import React from 'react';
import { MintForm } from './MintForm';
import { Bitcoin, ArrowDownCircle, ArrowUpCircle, Shield, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface VaultViewProps {
  onSuccess: (amount: number) => void;
}

export const VaultView = ({ onSuccess }: VaultViewProps) => {
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
        <MintForm onSuccess={onSuccess} />
        
        <div className="glass p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowUpCircle size={20} className="text-white/40" />
            Withdraw BTC
          </h3>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-white/5 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Bitcoin size={24} className="text-white/20" />
            </div>
            <h4 className="text-sm font-medium mb-2">Withdrawal to L1</h4>
            <p className="text-xs text-white/40 max-w-[200px] mb-6">
              Convert your shielded zBTC back to native Bitcoin on the mainnet.
            </p>
            <button className="btn-secondary w-full opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
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
              <div className="flex items-center justify-between bg-brand-dark/50 p-3 rounded-lg border border-brand-border">
                <code className="text-xs font-mono text-brand-primary">0x049d...c042</code>
                <ExternalLink size={14} className="text-white/20" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Shielded Vault (Cairo 2.x)</p>
              <div className="flex items-center justify-between bg-brand-dark/50 p-3 rounded-lg border border-brand-border">
                <code className="text-xs font-mono text-brand-primary">0x07f3...a3b2</code>
                <ExternalLink size={14} className="text-white/20" />
              </div>
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
