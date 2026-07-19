import React, { useState, useEffect } from 'react';
import { Activity, X, Shield, Box, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../utils/api'; // Adjust path if needed

export default function BlockchainLedger({ isOpen, onClose }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data fallback for styling if API isn't ready
  const mockBlocks = [
    { action: "DELIVERED", details: "Verification success. Order finalized.", timestamp: new Date().toISOString(), hash: "0x8f2a...39b4", gas: "41,200" },
    { action: "OUT_FOR_DELIVERY", details: "Order status advanced: OUT_FOR_DELIVERY", timestamp: new Date(Date.now() - 3600000).toISOString(), hash: "0x3a1c...9f21", gas: "38,450" },
    { action: "CUSTOMER_PAID", details: "Customer paid 999. Funds securely held in escrow.", timestamp: new Date(Date.now() - 86400000).toISOString(), hash: "0x7c9b...11a2", gas: "65,100" }
  ];

  useEffect(() => {
    if (isOpen) {
      // Fetch real blocks if you have an endpoint, otherwise use mock for UI testing
      const fetchLedger = async () => {
        try {
          // Replace with your actual endpoint if you exposed getLedger()
          const data = await apiRequest('/api/blockchain/ledger'); 
          setBlocks(data.reverse()); // Newest first
        } catch (error) {
          console.warn("Using mock blockchain data for demo");
          setBlocks(mockBlocks);
        } finally {
          setLoading(false);
        }
      };
      fetchLedger();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Ledger Drawer */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ touchAction: 'pan-y' }} // <--- ADD THIS LINE
            className="fixed top-0 right-0 h-screen w-full max-w-[400px] bg-[#1A1512] border-l border-[#F5F1E8]/10 z-[101] flex flex-col shadow-2xl"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5F1E8]/10">
              <div className="flex items-center gap-3">
                <Activity className="text-[#A05D46]" size={20} />
                <h2 className="text-[#F5F1E8] font-light tracking-[0.2em] uppercase text-sm">Live Ledger</h2>
              </div>
              <button onClick={onClose} className="text-[#F5F1E8]/50 hover:text-[#F5F1E8] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              
              {/* Smart Contract Overview Panel */}
              <div className="bg-[#2C2420] border border-[#F5F1E8]/10 rounded-xl p-5 mb-8 shadow-lg">
                <div className="flex items-center justify-between mb-4 border-b border-[#F5F1E8]/5 pb-3">
                  <div className="flex items-center gap-2 text-[#D2B48C]">
                    <Shield size={16} />
                    <span className="text-xs font-bold tracking-widest uppercase">Smart Contract</span>
                  </div>
                  <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] px-2 py-1 rounded-full font-bold tracking-wider uppercase border border-[#10b981]/30">
                    On-Chain
                  </span>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#F5F1E8]/50">Address</span>
                    <span className="text-[#A05D46] font-mono">0xZenv...f94A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F1E8]/50">Chain ID</span>
                    <span className="text-[#F5F1E8] font-mono">31337 (Hardhat)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#F5F1E8]/50">Total Blocks</span>
                    <span className="text-[#F5F1E8] font-mono">{blocks.length}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Header */}
              <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#F5F1E8]/40 uppercase mb-6 pl-2">
                Transaction History
              </h3>

              {/* Blocks Timeline */}
              <div className="relative border-l-2 border-[#363636] ml-4 space-y-8 pb-12">
                {loading ? (
                  <p className="text-[#F5F1E8]/50 text-xs pl-6">Syncing blocks...</p>
                ) : (
                  blocks.map((block, idx) => (
                    <div key={idx} className="relative pl-6">
                      {/* Timeline Node */}
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#1A1512] border-2 border-[#D2B48C] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D2B48C]" />
                      </div>

                      {/* Block Card */}
                      <div className="bg-[#363636]/50 border border-[#F5F1E8]/5 rounded-xl p-4 hover:border-[#D2B48C]/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#D2B48C] text-[10px] font-bold tracking-widest uppercase">
                            {block.action}
                          </span>
                          <span className="text-[#F5F1E8]/30 text-[9px] font-mono">
                            {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <p className="text-[#F5F1E8]/80 text-xs font-light mb-4 leading-relaxed">
                          {block.details}
                        </p>

                        {/* Hash & Gas Footer */}
                        <div className="bg-[#1A1512] rounded-md p-2 flex flex-col gap-1.5 border border-[#F5F1E8]/5">
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-[#F5F1E8]/40">Hash:</span>
                            <span className="text-[#A05D46]">{block.hash || `0x${Math.random().toString(16).substr(2, 8)}...`}</span>
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className="text-[#F5F1E8]/40">Gas Used:</span>
                            <span className="text-[#10b981] flex items-center gap-1">
                              <Zap size={8} /> {block.gas || "21,000"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}