import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, ExternalLink, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ActivityItem {
  id: string;
  type: 'mint' | 'transfer' | 'receive' | 'withdraw' | 'faucet';
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

export const HistoryView = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mint' | 'transfer' | 'withdraw'>('all');
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredActivities = activities.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase()) || 
                         item.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "shadowbtc_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-white/40 text-sm">Full audit log of your shielded protocol interactions.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="glass p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            {(['all', 'mint', 'transfer', 'withdraw'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                  filter === f ? "bg-brand-primary text-black" : "bg-white/5 text-white/40 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or type..."
              className="bg-brand-dark/50 border border-brand-border rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-brand-primary/50 w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Transaction ID</th>
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Type</th>
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Amount</th>
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Timestamp</th>
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Status</th>
                <th className="pb-4 text-[10px] uppercase font-bold text-white/20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/20 text-sm">
                    Loading history...
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/20 text-sm italic">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-xs text-white/60">{item.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          item.type === 'mint' ? "bg-emerald-500/10 text-emerald-500" :
                          item.type === 'transfer' ? "bg-rose-500/10 text-rose-500" :
                          "bg-brand-primary/10 text-brand-primary"
                        )}>
                          {item.type === 'mint' && <ArrowDownLeft size={12} />}
                          {item.type === 'transfer' && <ArrowUpRight size={12} />}
                          {item.type === 'withdraw' && <ArrowUpRight size={12} />}
                          {item.type === 'faucet' && <Shield size={12} />}
                        </div>
                        <span className="text-xs font-medium capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-xs font-bold">
                      {(item.type === 'transfer' || item.type === 'withdraw') ? '-' : '+'}{item.amount} zBTC
                    </td>
                    <td className="py-4 text-xs text-white/40">{item.timestamp}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => alert(`Viewing proof for ${item.id}`)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
