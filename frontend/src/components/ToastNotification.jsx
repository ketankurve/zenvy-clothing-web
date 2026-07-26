import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastNotification = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 20, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-0 left-1/2 z-[9999] bg-[#A05D46] text-[#F5F1E8] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold tracking-widest uppercase border border-[#F5F1E8]/20"
        >
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};