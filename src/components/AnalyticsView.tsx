import React from 'react';
import { BarChart3, Lock, Shield, EyeOff, Activity, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const YIELD_DATA = [
  { name: 'Jan', yield: 4.2, benchmark: 2.1 },
  { name: 'Feb', yield: 4.8, benchmark: 2.2 },
  { name: 'Mar', yield: 4.5, benchmark: 2.1 },
  { name: 'Apr', yield: 5.2, benchmark: 2.3 },
  { name: 'May', yield: 5.9, benchmark: 2.4 },
  { name: 'Jun', yield: 6.4, benchmark: 2.5 },
  { name: 'Jul', yield: 6.1, benchmark: 2.4 },
  { name: 'Aug', yield: 6.8, benchmark: 2.6 },
  { name: 'Sep', yield: 7.2, benchmark: 2.7 },
  { name: 'Oct', yield: 7.5, benchmark: 2.8 },
  { name: 'Nov', yield: 8.1, benchmark: 2.9 },
  { name: 'Dec', yield: 8.4, benchmark: 3.0 },
];

const PRIVACY_DATA = [
  { name: 'Week 1', score: 85 },
  { name: 'Week 2', score: 88 },
  { name: 'Week 3', score: 92 },
  { name: 'Week 4', score: 95 },
  { name: 'Week 5', score: 98 },
  { name: 'Week 6', score: 99 },
];

const generateDynamicYield = () => YIELD_DATA.map(d => ({
  ...d,
  yield: d.yield + (Math.random() * 0.4 - 0.2),
  benchmark: d.benchmark + (Math.random() * 0.1 - 0.05)
}));

const generateDynamicPrivacy = () => PRIVACY_DATA.map(d => ({
  ...d,
  score: Math.min(100, d.score + (Math.random() * 2 - 1))
}));

export const AnalyticsView = () => {
  const [dynamicYield, setDynamicYield] = React.useState(generateDynamicYield());
  const [dynamicPrivacy, setDynamicPrivacy] = React.useState(generateDynamicPrivacy());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDynamicYield(generateDynamicYield());
      setDynamicPrivacy(generateDynamicPrivacy());
    }, 5000);
    return () => clearInterval(interval);
  }, []);
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
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Private Analytics</h2>
          <p className="text-white/40 text-sm">Institutional-grade performance metrics. Computed locally.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <Shield size={12} />
            Local Data Only
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '1.24 BTC', icon: Activity, trend: '+12%' },
          { label: 'Avg. Privacy', value: '99.2%', icon: Shield, trend: '+2.4%' },
          { label: 'Proofs Generated', value: '42', icon: Lock, trend: '+5' },
          { label: 'L1 Gas Saved', value: '0.042 BTC', icon: BarChart3, trend: '0.005' },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <stat.icon size={18} className="text-brand-primary" />
            </div>
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-xl font-mono font-bold">{stat.value}</p>
              <span className="text-[10px] text-emerald-500 font-bold">{stat.trend}</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-bl-full -mr-8 -mt-8" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold">Yield Performance (APY %)</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-[10px] text-white/40 uppercase font-bold">Shielded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <span className="text-[10px] text-white/40 uppercase font-bold">Benchmark</span>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicYield}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F7931A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#F7931A' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#F7931A" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorYield)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#ffffff20" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold mb-8">Privacy Score Evolution</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicPrivacy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 8 }}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {dynamicPrivacy.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === dynamicPrivacy.length - 1 ? '#F7931A' : '#ffffff10'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={16} className="text-brand-primary" />
              <span className="text-xs font-bold uppercase tracking-widest">Privacy Insight</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Your anonymity set has increased by 14% this month due to higher network participation and diversified commitment sizes.
            </p>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0">
          <EyeOff size={32} className="text-white/20" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Zero-Knowledge Analytics</h3>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            ShadowBTC uses local computation to generate these insights. No personal financial data, transaction history, or performance metrics are ever uploaded to a central server or shared with third-party trackers.
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-primary px-8 py-3 text-xs uppercase tracking-widest font-bold shrink-0"
        >
          Download Audit Log
        </button>
      </div>
    </motion.div>
  );
};
