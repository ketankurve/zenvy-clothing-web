import React from 'react';
import { Activity, X, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLedger } from '../context/LedgerContext';

export default function BlockchainLedger({ isOpen, onClose }) {
  // Read real-time blocks globally
  const { blocks } = useLedger();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Layer */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Ledger Drawer Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ touchAction: 'pan-y' }}
            className="fixed top-0 right-0 h-screen w-full max-w-[400px] bg-[#1A1512] border-l border-[#F5F1E8]/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5F1E8]/10">
              <div className="flex items-center gap-3">
                <Activity className="text-[#A05D46]" size={20} />
                <h2 className="text-[#F5F1E8] font-light tracking-[0.2em] uppercase text-sm">Live Ledger</h2>
              </div>
              <button onClick={onClose} className="text-[#F5F1E8]/50 hover:text-[#F5F1E8] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Container */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Smart Contract Overview */}
              <div className="bg-[#2C2420] border border-[#F5F1E8]/10 rounded-xl p-5 mb-8 shadow-lg">
                <div className="flex items-center justify-between mb-4 border-b border-[#F5F1E8]/5 pb-3">
                  <div className="flex items-center gap-2 text-[#D2B48C]">
                    <Shield size={16} />
                    <span className="text-xs font-bold tracking-widest uppercase">Smart Contract</span>
                  </div>
                  <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] px-2 py-1 rounded-full font-bold tracking-wider uppercase border border-[#10b981]/30">On-Chain</span>
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

              <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#F5F1E8]/40 uppercase mb-6 pl-2">
                Transaction History
              </h3>

              {/* Sequential Node List */}
              <div className="relative border-l-2 border-[#363636] ml-4 space-y-8 pb-12">
                {blocks.length === 0 ? (
                  <p className="text-[#F5F1E8]/30 text-xs pl-6 italic">No blocks recorded yet.</p>
                ) : (
                  // Sort chronologically (Oldest first) so Funds Locked appears above Delivered
                  [...blocks].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((block, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#1A1512] border-2 border-[#D2B48C] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D2B48C]" />
                      </div>

                      <div className="bg-[#363636]/50 border border-[#F5F1E8]/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#D2B48C] text-[10px] font-bold tracking-widest uppercase">{block.action}</span>
                          <span className="text-[#F5F1E8]/30 text-[9px] font-mono">
                            {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <p className="text-[#F5F1E8]/80 text-xs font-light mb-4">{block.details}</p>

                        <div className="space-y-2">
                          <div className="bg-[#1A1512] rounded-lg p-2 border border-[#F5F1E8]/5">
                            <p className="text-[8px] text-[#F5F1E8]/40 uppercase tracking-widest font-bold mb-0.5">Prev Hash:</p>
                            <p className="text-[#666] font-mono text-[10px]">
                              {block.previousHash ? `...${block.previousHash.slice(-6)}` : "GENESIS"}
                            </p>
                          </div>
                          <div className="bg-[#1A1512] rounded-lg p-2 border border-[#F5F1E8]/5">
                            <p className="text-[8px] text-[#F5F1E8]/40 uppercase tracking-widest font-bold mb-0.5">Hash:</p>
                            <p className="text-[#A05D46] font-mono text-[10px] font-semibold">
                              {block.hash ? `...${block.hash.slice(-6)}` : "..."}
                            </p>
                          </div>
                          <div className="flex justify-between items-center px-1 mt-1">
                            <span className="text-[#F5F1E8]/30 text-[9px]">Gas Used:</span>
                            <span className="text-[#10b981] text-[9px] font-mono flex items-center gap-1"><Zap size={8} /> {block.gas}</span>
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