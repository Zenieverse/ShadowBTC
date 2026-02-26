import React, { useState } from 'react';
import { Bitcoin, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion } from 'motion/react';

interface MintFormProps {
  onSuccess: (amount: number) => void;
}

export const MintForm = ({ onSuccess }: MintFormProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState<'idle' | 'depositing' | 'committing' | 'success'>('idle');

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setIsMinting(true);
    setStep('depositing');

    // Step 1: Simulate BTC Deposit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('committing');
    // Step 2: Create Commitment
    const secret = Math.random().toString(36).substring(7);
    const hash = CryptoJS.SHA256(secret + amount).toString();
    
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, amount: Number(amount) }),
      });
      
      if (res.ok) {
        setStep('success');
        onSuccess(Number(amount));
        setTimeout(() => {
          setStep('idle');
          setAmount('');
          setIsMinting(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Minting failed", error);
      setIsMinting(false);
      setStep('idle');
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bitcoin size={20} className="text-brand-primary" />
        Shield BTC
      </h3>
      
      <form onSubmit={handleMint} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-white/40 uppercase font-bold">Amount to Shield</label>
          <div className="relative">
            <input 
              type="text" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isMinting}
              className="w-full bg-brand-dark/50 border border-brand-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary transition-colors font-mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm">BTC</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isMinting || !amount}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4"
        >
          {isMinting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {step === 'depositing' ? 'Waiting for BTC Confirmation...' : 'Generating Commitment...'}
            </>
          ) : (
            <>
              Shield Assets <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {step === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm"
        >
          <CheckCircle2 size={18} />
          <span>Successfully minted {amount} zBTC to shielded pool.</span>
        </motion.div>
      )}
    </div>
  );
};
