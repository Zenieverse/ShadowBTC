import React, { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Shield, RefreshCw } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'mint' | 'transfer' | 'receive' | 'withdraw';
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history', { cache: 'no-store' });
      const text = await res.text();
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}: ${text.slice(0, 100)}`);
      }
      
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error("History data is not an array:", data);
        }
      } catch (parseError) {
        console.error("Failed to parse history JSON:", text);
        throw parseError;
      }
    } catch (error: any) {
      console.error("Failed to fetch history:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // Poll for updates
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History size={20} className="text-white/40" />
          Shielded Activity
        </h3>
        <button 
          onClick={fetchHistory}
          className="p-1.5 rounded-full hover:bg-white/5 text-white/20 hover:text-white/40 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="py-12 text-center text-white/20 text-sm italic">
            No recent activity found.
          </div>
        ) : (
          activities.map((item) => (
            <div 
              key={item.id} 
              onClick={() => alert(`Transaction Detail\nID: ${item.id}\nType: ${item.type}\nStatus: ${item.status}\nNetwork: Starknet Testnet`)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-border flex items-center justify-center text-white/60">
                  {item.type === 'mint' && <ArrowDownLeft size={18} className="text-emerald-400" />}
                  {item.type === 'transfer' && <ArrowUpRight size={18} className="text-rose-400" />}
                  {item.type === 'withdraw' && <ArrowUpRight size={18} className="text-brand-primary" />}
                  {item.type === 'receive' && <Shield size={18} className="text-brand-primary" />}
                </div>
                <div>
                  <div className="text-sm font-medium capitalize">{item.type} zBTC</div>
                  <div className="text-xs text-white/30">{item.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold">
                  {(item.type === 'transfer' || item.type === 'withdraw') ? '-' : '+'}{item.amount}
                </div>
                <div className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-tighter">
                  {item.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-6 text-xs text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest font-bold">
        View Full History
      </button>
    </div>
  );
};
