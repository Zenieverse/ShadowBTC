import React, { useState, useEffect } from 'react';
import { Send, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateZKProof } from '@/src/services/zkService';
import CryptoJS from 'crypto-js';

interface PrivateTransferProps {
  onSuccess: (amount: number) => void;
}

export const PrivateTransfer = ({ onSuccess }: PrivateTransferProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'proving' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [commitments, setCommitments] = useState<any[]>([]);

  useEffect(() => {
    fetchCommitments();
  }, []);

  const fetchCommitments = async () => {
    const res = await fetch('/api/commitments');
    const data = await res.json();
    setCommitments(data.filter((c: any) => !c.spent));
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient || commitments.length === 0) return;

    setIsProcessing(true);
    setStatus('proving');

    try {
      // 1. Generate Proof (Simulated via Gemini)
      const secret = "user_secret_" + Math.random().toString(36);
      const proof = await generateZKProof(secret, Number(amount));
      
      setStatus('submitting');
      
      // 2. Generate Nullifier
      const nullifier = CryptoJS.SHA256(secret + commitments[0].id).toString();

      // 3. Submit to Shielded Vault
      const res = await fetch('/api/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nullifier,
          proof,
          commitmentId: commitments[0].id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('success');
        onSuccess(Number(amount));
        fetchCommitments();
        setTimeout(() => {
          setStatus('idle');
          setAmount('');
          setRecipient('');
          setIsProcessing(false);
        }, 3000);
      } else {
        throw new Error(result.error || "Transfer failed");
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield size={20} className="text-brand-primary" />
        Private Transfer
      </h3>

      <form onSubmit={handleTransfer} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-white/40 uppercase font-bold">Recipient Address (Shielded)</label>
          <input 
            type="text" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isProcessing}
            className="w-full bg-brand-dark/50 border border-brand-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary transition-colors font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-white/40 uppercase font-bold">Amount (zBTC)</label>
          <div className="relative">
            <input 
              type="text" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isProcessing}
              className="w-full bg-brand-dark/50 border border-brand-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary transition-colors font-mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm">zBTC</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing || !amount || !recipient || commitments.length === 0}
          className="w-full btn-secondary flex items-center justify-center gap-2 py-4 border border-brand-primary/20 hover:border-brand-primary/50"
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {status === 'proving' ? 'Generating STARK Proof...' : 'Verifying Nullifier...'}
            </>
          ) : (
            <>
              Send Privately <Send size={18} />
            </>
          )}
        </button>

        {commitments.length === 0 && !isProcessing && (
          <p className="text-[10px] text-rose-400 text-center">No available shielded commitments. Mint zBTC first.</p>
        )}
      </form>

      {status === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm"
        >
          <CheckCircle2 size={18} />
          <span>Private transaction finalized.</span>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};
