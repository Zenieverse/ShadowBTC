import React, { useState, useEffect } from 'react';
import { connect, disconnect } from 'get-starknet';
import { Wallet, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const WalletButton = () => {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const starknet = await connect() as any;
      if (starknet && starknet.isConnected) {
        setAddress(starknet.selectedAddress || null);
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setAddress(null);
  };

  return (
    <div className="flex items-center gap-4">
      {address ? (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-brand-border border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono opacity-70">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
          <button 
            onClick={handleDisconnect}
            className="p-2 rounded-full hover:bg-white/5 text-rose-400 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Wallet size={18} />
          Connect Starknet
        </button>
      )}
    </div>
  );
};
