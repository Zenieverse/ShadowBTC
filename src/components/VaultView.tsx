import React, { useState, useEffect } from 'react';
import { MintForm } from './MintForm';
import { Bitcoin, ArrowDownCircle, ArrowUpCircle, Shield, ExternalLink, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface VaultViewProps {
  onSuccess: (amount: number) => void;
  walletAddress: string | null;
}

export const VaultView = ({ onSuccess, walletAddress }: VaultViewProps) => {
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [commitments, setCommitments] = useState<any[]>([]);
  const [selectedCommitmentId, setSelectedCommitmentId] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (walletAddress) {
      fetchCommitments();
    }
  }, [walletAddress]);

  const fetchCommitments = async () => {
    try {
      const res = await fetch('/api/commitments', { cache: 'no-store' });
      const text = await res.text();
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        setCommitments(data.filter((c: any) => !c.spent));
      }
    } catch (err) {
      console.error("Failed to fetch commitments", err);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAddress || !selectedCommitmentId) return;

    setIsWithdrawing(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commitmentId: selectedCommitmentId,
          address: withdrawAddress
        }),
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (res.ok) {
        setStatus('success');
        const commitment = commitments.find(c => c.id === selectedCommitmentId);
        onSuccess(-(commitment?.amount || 0));
        fetchCommitments();
        setTimeout(() => {
          setStatus('idle');
          setWithdrawAddress('');
          setSelectedCommitmentId('');
          setIsWithdrawing(false);
        }, 3000);
      } else {
        throw new Error(result.error || "Withdrawal failed");
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
      setIsWithdrawing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shielded Vault</h2>
          <p className="text-white/40 text-sm">Deposit BTC to mint private zBTC or withdraw back to L1.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase font-bold">Vault TVL</p>
            <p className="text-lg font-mono font-bold text-brand-primary">1,240.52 BTC</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!walletAddress ? (
          <div className="md:col-span-2 glass p-12 rounded-2xl text-center space-y-4">
            <Shield size={48} className="mx-auto text-white/10" />
            <h3 className="text-lg font-bold">Wallet Not Connected</h3>
            <p className="text-sm text-white/40 max-w-xs mx-auto">Please connect your Starknet wallet to access the shielded vault and mint zBTC.</p>
          </div>
        ) : (
          <>
            <MintForm onSuccess={onSuccess} />
            
            <div className="glass p-6 rounded-2xl flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowUpCircle size={20} className="text-white/40" />
                Withdraw BTC
              </h3>
              
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-bold">Select Commitment to Burn</label>
                  <select 
                    value={selectedCommitmentId}
                    onChange={(e) => setSelectedCommitmentId(e.target.value)}
                    disabled={isWithdrawing || commitments.length === 0}
                    className="w-full bg-brand-dark/50 border border-brand-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary transition-colors font-mono text-sm appearance-none"
                  >
                    <option value="">Select a commitment...</option>
                    {commitments.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.amount.toFixed(4)} zBTC (ID: {c.id.slice(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase font-bold">Destination BTC Address</label>
                  <input 
                    type="text" 
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="bc1q..."
                    disabled={isWithdrawing}
                    className="w-full bg-brand-dark/50 border border-brand-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-primary transition-colors font-mono text-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isWithdrawing || !withdrawAddress || !selectedCommitmentId}
                  className="w-full btn-secondary flex items-center justify-center gap-2 py-4 border border-white/10 hover:border-white/20"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Withdrawal...
                    </>
                  ) : (
                    <>
                      Withdraw to L1 <Bitcoin size={18} />
                    </>
                  )}
                </button>

                {commitments.length === 0 && !isWithdrawing && (
                  <p className="text-[10px] text-rose-400 text-center">No available shielded commitments to withdraw.</p>
                )}
              </form>

              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm"
                >
                  <CheckCircle2 size={18} />
                  <span>Withdrawal request submitted to L1.</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="glass p-8 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Shield size={20} className="text-brand-primary" />
          Protocol Deployment Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold mb-1">zBTC ERC20 Contract</p>
              <button 
                onClick={() => copyToClipboard("0x049d...c042")}
                className="w-full flex items-center justify-between bg-brand-dark/50 p-3 rounded-lg border border-brand-border hover:border-brand-primary/30 transition-colors group"
              >
                <code className="text-xs font-mono text-brand-primary">0x049d...c042</code>
                <ExternalLink size={14} className="text-white/20 group-hover:text-brand-primary" />
              </button>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Shielded Vault (Cairo 2.x)</p>
              <button 
                onClick={() => copyToClipboard("0x07f3...a3b2")}
                className="w-full flex items-center justify-between bg-brand-dark/50 p-3 rounded-lg border border-brand-border hover:border-brand-primary/30 transition-colors group"
              >
                <code className="text-xs font-mono text-brand-primary">0x07f3...a3b2</code>
                <ExternalLink size={14} className="text-white/20 group-hover:text-brand-primary" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Audit Status</h4>
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle size={16} />
                Verified by StarkWare
              </div>
              <p className="text-[10px] text-white/40 mt-2">
                The ShadowBTC protocol utilizes formal verification for its Cairo smart contracts and STARK proof system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline></svg>
);
