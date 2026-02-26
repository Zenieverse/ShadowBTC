import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'mint' | 'transfer' | 'receive';
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'mint', amount: '0.0500', timestamp: '2 mins ago', status: 'confirmed' },
  { id: '2', type: 'transfer', amount: '0.0120', timestamp: '1 hour ago', status: 'confirmed' },
  { id: '3', type: 'receive', amount: '0.0045', timestamp: '3 hours ago', status: 'confirmed' },
];

export const ActivityFeed = () => {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History size={20} className="text-white/40" />
          Shielded Activity
        </h3>
        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-white/40 uppercase tracking-widest">
          Private
        </span>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITY.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-border flex items-center justify-center text-white/60">
                {item.type === 'mint' && <ArrowDownLeft size={18} className="text-emerald-400" />}
                {item.type === 'transfer' && <ArrowUpRight size={18} className="text-rose-400" />}
                {item.type === 'receive' && <Shield size={18} className="text-brand-primary" />}
              </div>
              <div>
                <div className="text-sm font-medium capitalize">{item.type} zBTC</div>
                <div className="text-xs text-white/30">{item.timestamp}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold">
                {item.type === 'transfer' ? '-' : '+'}{item.amount}
              </div>
              <div className="text-[10px] text-emerald-500/60 uppercase font-bold tracking-tighter">
                {item.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 text-xs text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest font-bold">
        View Full History
      </button>
    </div>
  );
};
