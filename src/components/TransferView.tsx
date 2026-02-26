import React from 'react';
import { PrivateTransfer } from './PrivateTransfer';
import { Shield, Info, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface TransferViewProps {
  onSuccess: (amount: number) => void;
  walletAddress: string | null;
}

export const TransferView = ({ onSuccess, walletAddress }: TransferViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Private Transfer</h2>
          <p className="text-white/40 text-sm">Send zBTC privately using zero-knowledge proofs.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest">
          <Lock size={12} />
          End-to-End Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {!walletAddress ? (
            <div className="glass p-12 rounded-2xl text-center space-y-4">
              <Shield size={48} className="mx-auto text-white/10" />
              <h3 className="text-lg font-bold">Wallet Not Connected</h3>
              <p className="text-sm text-white/40 max-w-xs mx-auto">Please connect your Starknet wallet to initiate private transfers.</p>
            </div>
          ) : (
            <PrivateTransfer onSuccess={onSuccess} walletAddress={walletAddress} />
          )}
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Info size={14} />
              How it works
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-border flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                <p className="text-xs text-white/60 leading-relaxed">Enter the recipient's stealth address. This address is never linked to their public identity.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-border flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                <p className="text-xs text-white/60 leading-relaxed">ShadowBTC generates a STARK proof locally in your browser to verify you own the funds.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-border flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                <p className="text-xs text-white/60 leading-relaxed">A nullifier is submitted to the Starknet contract to prevent double-spending without revealing which commitment was spent.</p>
              </li>
            </ul>
          </div>

          <div className="glass p-6 rounded-2xl border-brand-primary/10">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Network Fee</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono">0.000042 BTC</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Low Latency</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
