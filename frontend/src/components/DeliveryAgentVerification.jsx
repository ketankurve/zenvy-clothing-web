import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Key, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { BackgroundLayer } from './BackgroundLayer';
import { BackgroundDelivery } from './BackgroundDelivery';

const DeliveryAgentVerification = () => {
  const [orderId, setOrderId] = useState('');
  const [hashSuffix, setHashSuffix] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
        const response = await apiRequest(`/api/orders/verify`, {
        method: 'POST',
        // Change 'hashSuffix' to 'inputOtp' here:
        body: JSON.stringify({ orderId, inputOtp: hashSuffix }) 
        });
        setResult({ success: true, message: "Delivery Verified Successfully!" });
    } catch (error) {
        setResult({ success: false, message: "Invalid Code or Order ID." });
    } finally {
        setVerifying(false);
    }
    };

  return (
    <div className="relative min-h-screen bg-[#2C2420] text-[#F5F1E8] font-sans selection:bg-[#A05D46] selection:text-[#F5F1E8]">
      <BackgroundDelivery />
      
      <div className="relative z-10 px-4 py-32 max-w-[500px] mx-auto flex flex-col items-center">
        <div className="mb-12 text-center">
          <ShieldCheck size={48} className="text-[#A05D46] mx-auto mb-6" />
          <h1 className="text-4xl font-light tracking-tighter mb-4">Last-Mile Verify</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D2B48C]">
            Agent Secure Hand-off
          </p>
        </div>

        <form onSubmit={handleVerify} className="w-full bg-[#1A1512]/90 backdrop-blur-xl border border-[#F5F1E8]/10 rounded-[2rem] p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#F5F1E8]/50 font-bold mb-2 block">Order ID</label>
              <input 
                type="text" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-[#2C2420] border border-[#F5F1E8]/10 rounded-xl px-4 py-3 focus:border-[#A05D46] outline-none transition-colors"
                required 
              />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#F5F1E8]/50 font-bold mb-2 block">Verification Code</label>
              <input 
                type="text" 
                value={hashSuffix} 
                onChange={(e) => setHashSuffix(e.target.value)}
                className="w-full bg-[#2C2420] border border-[#F5F1E8]/10 rounded-xl px-4 py-3 focus:border-[#A05D46] outline-none transition-colors text-center text-xl tracking-[0.5em]"
                required 
              />
            </div>
            
            <button 
              disabled={verifying}
              type="submit"
              className="w-full bg-[#A05D46] hover:bg-[#844935] transition-colors py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              {verifying ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Complete Delivery"}
            </button>
          </div>
        </form>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-8 p-4 rounded-xl w-full flex items-center gap-3 border ${result.success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}
          >
            {result.success ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
            <span className="text-xs uppercase tracking-widest">{result.message}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAgentVerification;