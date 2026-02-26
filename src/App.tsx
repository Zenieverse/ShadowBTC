import React, { useState } from 'react';
import { Sidebar, ViewType } from './components/Sidebar';
import { WalletButton } from './components/WalletButton';
import { DashboardView } from './components/DashboardView';
import { TransferView } from './components/TransferView';
import { VaultView } from './components/VaultView';
import { AnalyticsView } from './components/AnalyticsView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { Bell, Search, Info, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function App() {
  const [balance, setBalance] = useState(0.0000);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ history: any[]; commitments: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, title: 'Protocol Update', message: 'ShadowBTC v1.0.0 is now live on Starknet Sepolia.', time: '2h ago', read: false },
    { id: 2, title: 'Shielded Deposit', message: 'Your deposit of 0.0425 BTC has been confirmed.', time: '5h ago', read: true },
  ]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/commitments');
      if (res.ok) {
        const commitments = await res.json();
        const total = commitments.reduce((acc: number, c: any) => acc + c.amount, 0);
        setBalance(total);
      }
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  React.useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBalanceUpdate = (amount: number) => {
    fetchBalance();
    showToast(`Balance updated: ${amount > 0 ? '+' : ''}${amount.toFixed(4)} zBTC`);
  };

  const handleTransferSuccess = (amount: number) => {
    fetchBalance();
    showToast(`Private transfer of ${amount.toFixed(4)} zBTC successful`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView balance={balance} onViewAll={() => setCurrentView('history')} />;
      case 'transfer':
        return <TransferView onSuccess={handleTransferSuccess} walletAddress={walletAddress} />;
      case 'vault':
        return <VaultView onSuccess={handleBalanceUpdate} walletAddress={walletAddress} />;
      case 'history':
        return <HistoryView />;
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search transactions, nullifiers, or roots..."
                className="w-full bg-brand-border/50 border border-brand-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 w-full mt-2 glass p-4 rounded-xl text-xs z-50 shadow-2xl border border-white/10 max-h-[400px] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-white/40">Searching protocol state...</div>
                  ) : searchResults && (searchResults.history.length > 0 || searchResults.commitments.length > 0) ? (
                    <div className="space-y-4">
                      {searchResults.history.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-white/20 mb-2">History</p>
                          {searchResults.history.map((h: any) => (
                            <div key={h.id} className="p-2 hover:bg-white/5 rounded-lg flex items-center justify-between">
                              <span className="capitalize">{h.type}</span>
                              <span className="font-mono text-brand-primary">{h.amount} zBTC</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {searchResults.commitments.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-white/20 mb-2">Commitments</p>
                          {searchResults.commitments.map((c: any) => (
                            <div key={c.id} className="p-2 hover:bg-white/5 rounded-lg flex flex-col">
                              <span className="text-[10px] font-mono text-white/40">{c.id}</span>
                              <span className="font-mono text-brand-primary">{c.amount} zBTC</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-white/40">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors relative"
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-brand-dark" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 glass rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h4 className="text-sm font-bold">Notifications</h4>
                      <button onClick={markAllRead} className="text-[10px] text-brand-primary uppercase font-bold hover:underline">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={cn("p-4 border-b border-white/5 hover:bg-white/5 transition-colors", !n.read && "bg-brand-primary/5")}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold">{n.title}</p>
                            <span className="text-[10px] text-white/20">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-white/40 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => showToast("ShadowBTC v1.0.0-beta", "success")}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors"
              >
                <Info size={20} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-brand-border" />
            <WalletButton onAddressChange={setWalletAddress} />
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
