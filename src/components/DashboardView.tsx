import React, { useState } from 'react';
import { ShieldedBalance } from './ShieldedBalance';
import { ActivityFeed } from './ActivityFeed';
import { TrendingUp, PieChart, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  balance: number;
  onViewAll?: () => void;
}

export const DashboardView = ({ balance, onViewAll }: DashboardViewProps) => {
  const [rewards, setRewards] = useState(0.00124);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tvl: 1240.52,
    privacyScore: 98,
    proofs: 12402
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          tvl: 1240.52 + data.tvl, // Base + dynamic
          privacyScore: data.privacyScore,
          proofs: 12402 + data.proofs
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  React.useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleFaucet = async () => {
    try {
      const res = await fetch('/api/faucet', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully requested ${data.amount} testnet zBTC. Your balance will update shortly.`);
        fetchStats();
      }
    } catch (err) {
      console.error("Faucet request failed", err);
    }
  };

  const handleClaim = () => {
    if (rewards <= 0) return;
    setIsClaiming(true);
    setTimeout(() => {
      setRewards(0);
      setIsClaiming(false);
      alert("Shielded rewards claimed and added to your pool.");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <ShieldedBalance balance={balance} />
            <button 
              onClick={handleRefresh}
              className="absolute top-4 right-16 p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white/40 transition-colors"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase mb-4">
                <PieChart size={14} className="text-brand-primary" />
                Vault Allocation
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Shielded Pool</span>
                  <span className="text-sm font-mono">{balance > 0 ? '92%' : '0%'}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full transition-all duration-1000" style={{ width: balance > 0 ? '92%' : '0%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Yield Strategy A</span>
                  <span className="text-sm font-mono">{balance > 0 ? '8%' : '0%'}</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white/20 h-full transition-all duration-1000" style={{ width: balance > 0 ? '8%' : '0%' }} />
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase mb-4">
                <TrendingUp size={14} className="text-emerald-400" />
                Yield Earned
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold font-mono text-emerald-400">
                  {rewards > 0 ? rewards.toFixed(5) : "0.00000"}
                </span>
                <span className="text-sm text-white/40 font-mono">zBTC</span>
              </div>
              <div className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tight">
                +12.4% APY (Shielded)
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={handleClaim}
                  disabled={isClaiming || rewards <= 0}
                  className="text-[10px] text-brand-primary hover:text-brand-primary/80 font-bold uppercase tracking-widest transition-colors disabled:opacity-30"
                >
                  {isClaiming ? "Claiming..." : "Claim Rewards"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Network TVL', value: `${stats.tvl.toLocaleString()} BTC`, info: 'Total value locked across all shielded pools on Starknet.' },
              { label: 'Privacy Score', value: `${stats.privacyScore.toFixed(0)}/100`, info: 'Calculated based on anonymity set size and transaction mixing frequency.' },
              { label: 'STARK Proofs', value: stats.proofs.toLocaleString(), info: 'Total zero-knowledge proofs verified by the Cairo smart contracts.' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                onClick={() => alert(`${stat.label}: ${stat.info}`)}
                className="glass p-4 rounded-xl cursor-help hover:border-brand-primary/30 transition-colors group"
              >
                <div className="text-[10px] text-white/40 uppercase font-bold mb-1 group-hover:text-brand-primary/60 transition-colors">{stat.label}</div>
                <div className="text-lg font-mono font-bold text-brand-primary">{stat.value}</div>
              </div>
            ))}
            <button 
              onClick={handleFaucet}
              className="glass p-4 rounded-xl border-brand-primary/20 hover:bg-brand-primary/5 transition-all group flex flex-col justify-center"
            >
              <div className="text-[10px] text-brand-primary uppercase font-bold mb-1">Testnet Faucet</div>
              <div className="text-sm font-bold flex items-center gap-2">
                Request 0.1 zBTC <RefreshCw size={12} className="group-hover:rotate-180 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <ActivityFeed onViewAll={onViewAll} />
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
