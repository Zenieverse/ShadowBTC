import React from 'react';
import { 
  LayoutDashboard, 
  Shield, 
  ArrowLeftRight, 
  Settings, 
  HelpCircle,
  Zap,
  Lock,
  BarChart3,
  Database
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type ViewType = 'dashboard' | 'transfer' | 'vault' | 'analytics' | 'settings' | 'support';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transfer' as ViewType, icon: ArrowLeftRight, label: 'Transfer' },
  { id: 'vault' as ViewType, icon: Database, label: 'Vault' },
  { id: 'analytics' as ViewType, icon: BarChart3, label: 'Analytics' },
];

const BOTTOM_ITEMS = [
  { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
  { id: 'support' as ViewType, icon: HelpCircle, label: 'Support' },
];

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  return (
    <aside className="w-64 border-r border-brand-border flex flex-col h-screen sticky top-0 bg-brand-dark/50 backdrop-blur-xl z-20">
      <div className="p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(247,147,26,0.2)]">
            <Lock className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter">ShadowBTC</h1>
            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">Starknet Privacy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              currentView === item.id 
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(currentView === item.id ? "text-brand-primary" : "group-hover:text-white")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-brand-border">
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              currentView === item.id 
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(currentView === item.id ? "text-brand-primary" : "group-hover:text-white")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        
        <div className="mt-4 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
          <p className="text-[10px] text-brand-primary font-bold uppercase mb-1">Network Status</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Starknet Testnet</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>
    </aside>
  );
};
