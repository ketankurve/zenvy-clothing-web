import { ethers } from "ethers";
import ContractData from "../blockchain/ZenvyLedger.json";

export const getBlockchainProvider = async () => {
  try {
    // HACKATHON MODE: Bypass MetaMask entirely. 
    // Connect directly to the local Hardhat node running in the background.
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Check if the network is actually running
    await provider.getNetwork();

    // Initialize the contract for READ-ONLY operations
    const contract = new ethers.Contract(
      ContractData.address,
      ContractData.abi,
      provider // Using provider instead of a signer means no MetaMask popup!
    );

    return { provider, contract };
  } catch (error) {
    console.error("Blockchain connection error:", error);
    throw new Error("Local blockchain node is not running. Please run 'npx hardhat node'.");
  }
};