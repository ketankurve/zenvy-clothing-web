// backend/src/modules/blockchain.js
// Drop-in replacement for the old Java-HTTP version.
// Same exports (addBlock, getLedger), same shape the frontend expects.

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// ---- Config ---------------------------------------------------------------
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  // Hardhat default account #0 — only for local dev
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// Look for deployment.json in a few sensible places
const candidatePaths = [
  process.env.ZENVY_DEPLOYMENT,
  path.join(__dirname, '..', '..', 'deployment.json'),                  // backend/deployment.json
  path.join(__dirname, '..', '..', '..', 'blockchain-solidity', 'deployment.json'),
  path.join(__dirname, '..', '..', '..', 'zenvy-solidity', 'deployment.json'),
].filter(Boolean);

let deployment = null;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    deployment = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log('Loaded Zenvy contract deployment from', p);
    break;
  }
}

if (!deployment) {
  console.error(
    'deployment.json not found. Deploy the contract first:\n' +
      '  cd zenvy-solidity && npm run compile && npm run deploy\n' +
      'then copy deployment.json into backend/ or set ZENVY_DEPLOYMENT=/abs/path.'
  );
}

// ---- ethers setup (lazy) --------------------------------------------------
let provider = null;
let wallet = null;
let contract = null;

function getContract() {
  if (!deployment) throw new Error('No deployment.json found');
  if (contract) return contract;
  provider = new ethers.JsonRpcProvider(RPC_URL);
  wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  contract = new ethers.Contract(deployment.address, deployment.abi, wallet);
  return contract;
}

// ---- Tx queue + nonce tracker --------------------------------------------
// Every write goes through this queue so txs are submitted strictly in order
// and we manage the nonce ourselves. Prevents "nonce too low / incorrect nonce"
// errors when multiple API requests hit the backend concurrently.
let txChain = Promise.resolve();
let currentNonce = null;

async function sendWithNonce(fn) {
  // Serialize: chain the next call onto the previous one
  const prev = txChain;
  let release;
  txChain = new Promise((res) => (release = res));

  try {
    await prev.catch(() => {}); // don't let a prior failure break the chain

    if (currentNonce === null) {
      currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
    }
    const nonce = currentNonce++;

    try {
      const tx = await fn({ nonce });
      await tx.wait();
      return tx;
    } catch (err) {
      // If our tracked nonce drifted, resync from the chain and retry once.
      if (/nonce/i.test(err.message || '')) {
        currentNonce = await provider.getTransactionCount(wallet.address, 'pending');
        const retryNonce = currentNonce++;
        const tx = await fn({ nonce: retryNonce });
        await tx.wait();
        return tx;
      }
      throw err;
    }
  } finally {
    release();
  }
}

// ---- Public API -----------------------------------------------------------

/**
 * Add a block to the on-chain ledger.
 * Same signature the backend already calls.
 */
const addBlock = async (action, details, relatedId, location = null) => {
  try {
    const c = getContract();
    await sendWithNonce((overrides) =>
      c.addBlock(
        String(action || ''),
        String(details || ''),
        String(relatedId || ''),
        String(location || ''),
        overrides
      )
    );
  } catch (err) {
    console.error('Blockchain Service Error. Is the EVM node running?', err.message);
  }
};

/**
 * Read the full ledger in the shape the frontend expects:
 *   { index, timestamp, data: { action, details, relatedId, location }, previousHash, hash }
 */
const getLedger = async () => {
  try {
    const c = getContract();
    const blocks = await c.getChain();
    return blocks.map((b) => {
      // Block size = bytes needed to store this block on-chain.
      // 32 bytes each for index, timestamp, previousHash, hash (4 * 32 = 128)
      // + UTF-8 byte length of each string field.
      const bytes =
        128 +
        Buffer.byteLength(b.action, 'utf8') +
        Buffer.byteLength(b.details, 'utf8') +
        Buffer.byteLength(b.relatedId, 'utf8') +
        Buffer.byteLength(b.location, 'utf8');

      return {
        index: Number(b.index),
        timestamp: new Date(Number(b.timestamp) * 1000).toISOString(),
        size: bytes,
        data: {
          action: b.action,
          details: b.details,
          relatedId: b.relatedId || undefined,
          location: b.location || undefined,
        },
        previousHash: b.previousHash,
        hash: b.hash,
      };
    });
  } catch (err) {
    console.error('Ledger Fetch Error:', err.message);
    return [];
  }
};

module.exports = { addBlock, getLedger };