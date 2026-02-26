import React, { useState, useEffect } from 'react';
import { connect, disconnect } from 'get-starknet';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface WalletButtonProps {
  onAddressChange?: (address: string | null) => void;
}

export const WalletButton = ({ onAddressChange }: WalletButtonProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to connect silently if already authorized
        const starknet = await connect({ modalMode: 'neverAsk' }) as any;
        if (starknet && starknet.isConnected) {
          const addr = starknet.selectedAddress || null;
          setAddress(addr);
          onAddressChange?.(addr);
        }
      } catch (error) {
        // Silent fail is fine here
      }
    };
    checkConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const starknet = await connect({
        modalMode: 'alwaysAsk',
        modalTheme: 'dark'
      }) as any;
      
      if (starknet && starknet.isConnected) {
        const addr = starknet.selectedAddress || null;
        setAddress(addr);
        onAddressChange?.(addr);
      }
    } catch (error) {
      console.error("Connection failed", error);
      alert("Failed to connect Starknet wallet. Please ensure Argent X or Braavos is installed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setAddress(null);
      onAddressChange?.(null);
    } catch (error) {
      console.error("Disconnect failed", error);
    }
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
            title="Disconnect Wallet"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {isConnecting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Wallet size={18} />
          )}
          {isConnecting ? 'Connecting...' : 'Connect Starknet'}
        </button>
      )}
    </div>
  );
};
