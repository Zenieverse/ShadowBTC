import React, { useState } from 'react';
import { Sidebar, ViewType } from './components/Sidebar';
import { WalletButton } from './components/WalletButton';
import { DashboardView } from './components/DashboardView';
import { TransferView } from './components/TransferView';
import { VaultView } from './components/VaultView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { Bell, Search, Info, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [balance, setBalance] = useState(0.0425);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBalanceUpdate = (amount: number) => {
    setBalance(prev => prev + amount);
    showToast(`Balance updated: ${amount > 0 ? '+' : ''}${amount.toFixed(4)} zBTC`);
  };

  const handleTransferSuccess = (amount: number) => {
    setBalance(prev => prev - amount);
    showToast(`Private transfer of ${amount.toFixed(4)} zBTC successful`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView balance={balance} />;
      case 'transfer':
        return <TransferView onSuccess={handleTransferSuccess} />;
      case 'vault':
        return <VaultView onSuccess={handleBalanceUpdate} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'support':
        return <SupportView />;
      default:
        return <DashboardView balance={balance} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white selection:bg-brand-primary/30">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-brand-border flex items-center justify-between px-8 bg-brand-dark/30 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, nullifiers, or roots..."
                className="w-full bg-brand-border/50 border border-brand-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 w-full mt-2 glass p-4 rounded-xl text-xs text-white/40 z-50">
                  No results found for "{searchQuery}" in local shielded state.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => showToast("No new notifications")}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors"
              >
                <Bell size={20} />
              </button>
              <button 
                onClick={() => showToast("ShadowBTC v1.0.0-beta", "success")}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors"
              >
                <Info size={20} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-brand-border" />
            <WalletButton />
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 relative">
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 20, x: '-50%' }}
                className={cn(
                  "fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-full shadow-2xl border flex items-center gap-3",
                  toast.type === 'success' ? "bg-emerald-500/90 border-emerald-400 text-white" : "bg-rose-500/90 border-rose-400 text-white"
                )}
              >
                {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm font-medium">{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {showWelcome && currentView === 'dashboard' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 rounded-2xl bg-gradient-to-r from-brand-primary/20 to-transparent border border-brand-primary/20 relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Welcome to the Shielded Pool</h2>
                  <p className="text-white/60 max-w-2xl text-sm leading-relaxed">
                    ShadowBTC leverages ZK-STARKs on Starknet to provide institutional-grade privacy for Bitcoin assets. 
                    Shield your BTC to mint zBTC and perform fully anonymous transfers.
                  </p>
                  <button 
                    onClick={() => setShowWelcome(false)}
                    className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield size={200} className="text-brand-primary rotate-12" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
