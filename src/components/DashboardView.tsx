import React from 'react';
import { ShieldedBalance } from './ShieldedBalance';
import { ActivityFeed } from './ActivityFeed';
import { TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  balance: number;
}

export const DashboardView = ({ balance }: DashboardViewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ShieldedBalance balance={balance} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase mb-4">
                <PieChart size={14} className="text-brand-primary" />
                Vault Allocation
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Shielded Pool</span>
                  <span className="text-sm font-mono">85%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full w-[85%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Yield Strategy A</span>
                  <span className="text-sm font-mono">15%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white/20 h-full w-[15%]" />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase mb-4">
                <TrendingUp size={14} className="text-emerald-400" />
                Yield Earned
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold font-mono text-emerald-400">0.00124</span>
                <span className="text-sm text-white/40 font-mono">zBTC</span>
              </div>
              <div className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tight">
                +12.4% APY (Shielded)
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button className="text-[10px] text-brand-primary hover:text-brand-primary/80 font-bold uppercase tracking-widest transition-colors">
                  Claim Rewards
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Network TVL', value: '1,240.5 BTC' },
              { label: 'Privacy Score', value: '98/100' },
              { label: 'STARK Proofs', value: '12,402' },
            ].map((stat) => (
              <div key={stat.label} className="glass p-4 rounded-xl">
                <div className="text-[10px] text-white/40 uppercase font-bold mb-1">{stat.label}</div>
                <div className="text-lg font-mono font-bold text-brand-primary">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <ActivityFeed />
          <div className="glass p-6 rounded-2xl border-brand-primary/10">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <ShieldCheck size={16} />
              Security Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Merkle Tree Height</span>
                <span className="font-mono">32 Levels</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Proof System</span>
                <span className="font-mono text-brand-primary">STARK (Cairo)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Nullifier Set</span>
                <span className="font-mono">8,241 Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
