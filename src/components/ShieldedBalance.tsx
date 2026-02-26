import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShieldedBalanceProps {
  balance: number;
}

export const ShieldedBalance = ({ balance }: ShieldedBalanceProps) => {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <div className="glass p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60 text-sm font-medium uppercase tracking-wider">
          <ShieldCheck size={16} className="text-brand-primary" />
          Shielded Balance
        </div>
        <button 
          onClick={() => setIsHidden(!isHidden)}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white"
        >
          {isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <div className="flex items-baseline gap-2">
        <AnimatePresence mode="wait">
          {isHidden ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-4xl font-bold tracking-tighter"
            >
              •••••• <span className="text-lg text-white/40 font-mono">zBTC</span>
            </motion.div>
          ) : (
            <motion.div
              key="visible"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-4xl font-bold tracking-tighter flex items-baseline gap-2"
            >
              {balance.toFixed(8)} <span className="text-lg text-brand-primary font-mono">zBTC</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-xs text-white/30 font-mono">
        STARK Proof Verified • Merkle Root: 0x7f...3a2
      </div>
    </div>
  );
};
