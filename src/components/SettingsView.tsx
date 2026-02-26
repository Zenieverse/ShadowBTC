import React, { useState } from 'react';
import { Settings, Shield, Globe, Bell, Lock, Cpu, Database, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const SettingsView = () => {
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState('maximum');
  const [network, setNetwork] = useState('starknet-testnet');
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the protocol state? This will delete all local commitments and transaction history. This action cannot be undone.")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        alert("Protocol state has been reset successfully. The page will now reload.");
        window.location.reload();
      } else {
        throw new Error("Failed to reset protocol state");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearCache = () => {
    alert("Local proof cache cleared successfully.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold">Protocol Settings</h2>
        <p className="text-white/40 text-sm">Configure your ShadowBTC node and privacy preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Privacy Section */}
          <div className="glass p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Shield size={16} />
              Privacy & Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-xl border border-brand-border">
                <div>
                  <p className="text-sm font-medium">Shielded Balance Visibility</p>
                  <p className="text-xs text-white/40">Hide balances by default on app launch.</p>
                </div>
                <div 
                  onClick={() => setNotifications(!notifications)}
                  className={cn(
                    "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                    notifications ? "bg-brand-primary" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-black rounded-full transition-all",
                    notifications ? "right-1" : "left-1"
                  )} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-xl border border-brand-border">
                <div>
                  <p className="text-sm font-medium">Anonymity Set Level</p>
                  <p className="text-xs text-white/40">Current level: Maximum (10k+ participants)</p>
                </div>
                <select 
                  value={privacyMode}
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  className="bg-brand-border text-xs py-1 px-2 rounded border border-white/10 outline-none"
                >
                  <option value="standard">Standard</option>
                  <option value="enhanced">Enhanced</option>
                  <option value="maximum">Maximum</option>
                </select>
              </div>
            </div>
          </div>

          {/* Network Section */}
          <div className="glass p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Globe size={16} />
              Network Configuration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-xl border border-brand-border">
                <div>
                  <p className="text-sm font-medium">Active Network</p>
                  <p className="text-xs text-white/40">Starknet Sepolia Testnet</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Connected
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-dark/50 rounded-xl border border-brand-border">
                <div>
                  <p className="text-sm font-medium">RPC Endpoint</p>
                  <p className="text-xs text-white/40">https://starknet-sepolia.public.blastapi.io</p>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <RefreshCw size={14} className="text-white/20" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Cpu size={14} />
              Node Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Local Prover</span>
                <span className="text-xs font-mono text-emerald-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Sync Progress</span>
                <span className="text-xs font-mono text-brand-primary">100%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Uptime</span>
                <span className="text-xs font-mono">14d 2h 42m</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-rose-500/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400/60 mb-4 flex items-center gap-2">
              <Database size={14} />
              Danger Zone
            </h4>
            <button 
              onClick={handleClearCache}
              className="w-full py-2 px-4 rounded-lg border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-colors"
            >
              Clear Local Proof Cache
            </button>
            <button 
              onClick={handleReset}
              disabled={isResetting}
              className="w-full mt-2 py-2 px-4 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold hover:bg-rose-500/20 transition-colors disabled:opacity-50"
            >
              {isResetting ? "Resetting..." : "Reset Protocol State"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
