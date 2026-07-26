import React, { createContext, useContext, useState, useEffect } from 'react';

const LedgerContext = createContext();

export const useLedger = () => useContext(LedgerContext);

export const LedgerProvider = ({ children }) => {
  // Load existing blocks from storage or start empty
  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem('zenvy_ledger');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to storage on every new block
  useEffect(() => {
    localStorage.setItem('zenvy_ledger', JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = (action, details, hash, gas) => {
    setBlocks(prevBlocks => {
      // Access the top of the array directly from the 'prevBlocks' parameter
      const latestBlock = prevBlocks[0]; 
      const prevHash = latestBlock ? latestBlock.hash : "0xGENESIS_BLOCK_0000";

      const newBlock = {
        action,
        details,
        timestamp: new Date().toISOString(),
        hash: hash || `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        previousHash: prevHash, // Now correctly pulling the hash from the actual previous block
        gas: gas || Math.floor(Math.random() * 20000 + 30000).toLocaleString()
      };

      return [newBlock, ...prevBlocks]; // Correctly prepends, maintaining chronological order in the array
    });
  };

  const clearLedger = () => setBlocks([]);

  return (
    <LedgerContext.Provider value={{ blocks, addBlock, clearLedger }}>
      {children}
    </LedgerContext.Provider>
  );
};