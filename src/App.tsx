import React, { useState } from 'react';
import { Sidebar, ViewType } from './components/Sidebar';
import { WalletButton } from './components/WalletButton';
import { DashboardView } from './components/DashboardView';
import { TransferView } from './components/TransferView';
import { VaultView } from './components/VaultView';
import { AnalyticsView } from './components/AnalyticsView';
import { Bell, Search, Info, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [balance, setBalance] = useState(0.0425);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const handleBalanceUpdate = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const handleTransferSuccess = (amount: number) => {
    setBalance(prev => prev - amount);
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
                placeholder="Search transactions, nullifiers, or roots..."
                className="w-full bg-brand-border/50 border border-brand-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors">
                <Info size={20} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-brand-border" />
            <WalletButton />
          </div>
        </header>

        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
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
