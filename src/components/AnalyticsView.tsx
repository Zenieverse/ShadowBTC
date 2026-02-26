import React from 'react';
import { BarChart3, Lock, Shield, EyeOff, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export const AnalyticsView = () => {
  const handleExport = () => {
    const stats = {
      totalVolume: "1.24 BTC",
      avgPrivacy: "99.2%",
      proofsGenerated: "42",
      l1GasSaved: "0.042 BTC",
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadowbtc-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Private Analytics</h2>
          <p className="text-white/40 text-sm">Personal performance metrics. No global exposure.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
          <Shield size={12} />
          Local Data Only
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '1.24 BTC', icon: Activity },
          { label: 'Avg. Privacy', value: '99.2%', icon: Shield },
          { label: 'Proofs Generated', value: '42', icon: Lock },
          { label: 'L1 Gas Saved', value: '0.042 BTC', icon: BarChart3 },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <stat.icon size={18} className="text-brand-primary" />
            </div>
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">{stat.label}</p>
            <p className="text-xl font-mono font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Yield Performance</h3>
          <div className="h-64 flex items-end gap-2 px-4">
            {[40, 60, 45, 70, 55, 85, 65, 90, 75, 95, 80, 100].map((height, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-all rounded-t-sm" 
                  style={{ height: `${height}%` }}
                />
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] text-white/20 font-mono">
                  M{i+1}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-primary" />
              <span className="text-xs text-white/60">Shielded Yield</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="text-xs text-white/60">Benchmark (L1)</span>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <EyeOff size={32} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">Privacy Preserved</h3>
          <p className="text-sm text-white/40 max-w-sm leading-relaxed">
            Your analytics are computed locally. ShadowBTC never uploads your transaction history or performance data to any central server.
          </p>
          <button 
            onClick={handleExport}
            className="mt-8 btn-secondary text-xs uppercase tracking-widest font-bold"
          >
            Export Local Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};
