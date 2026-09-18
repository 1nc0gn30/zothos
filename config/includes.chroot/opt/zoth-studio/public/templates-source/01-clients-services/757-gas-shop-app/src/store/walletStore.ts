import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { walletAuthService } from '../lib/wallet/auth';
import { depayService } from '../lib/wallet/depay';

interface WalletState {
  // Authentication state
  walletAddress: string | null;
  isConnected: boolean;
  connecting: boolean;
  
  // Balance state
  onChainBalance: number;
  loadingBalance: boolean;
  
  // Actions
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshOnChainBalance: () => Promise<void>;
  syncWalletWithProfile: (userId: string) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  walletAddress: null,
  isConnected: false,
  connecting: false,
  onChainBalance: 0,
  loadingBalance: false,

  connectWallet: async (walletName: string) => {
    set({ connecting: true });
    
    try {
      const address = await walletAuthService.connectWallet(walletName);
      
      set({
        walletAddress: address,
        isConnected: true,
        connecting: false,
      });

      // Refresh on-chain balance after connection
      await get().refreshOnChainBalance();

    } catch (error) {
      set({ connecting: false });
      throw error;
    }
  },

  disconnectWallet: async () => {
    try {
      await walletAuthService.disconnectWallet();
      
      set({
        walletAddress: null,
        isConnected: false,
        onChainBalance: 0,
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  },

  refreshOnChainBalance: async () => {
    const { walletAddress } = get();
    if (!walletAddress) return;

    set({ loadingBalance: true });
    
    try {
      const balance = await depayService.getOnChainUSDCBalance(walletAddress);
      set({ onChainBalance: balance, loadingBalance: false });
    } catch (error) {
      console.error('Failed to refresh on-chain balance:', error);
      set({ loadingBalance: false });
    }
  },

  syncWalletWithProfile: async (userId: string) => {
    const { walletAddress } = get();
    if (!walletAddress) return;

    try {
      // Update user profile with wallet address
      const { error } = await supabase
        .from('profiles')
        .update({ 
          solana_wallet_address: walletAddress,
          wallet_type: 'self_custodial',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to sync wallet with profile:', error);
      }
    } catch (error) {
      console.error('Error syncing wallet:', error);
    }
  },
}));

// Initialize wallet connection state on page load
if (typeof window !== 'undefined') {
  const address = walletAuthService.getWalletAddress();
  if (address) {
    useWalletStore.setState({
      walletAddress: address,
      isConnected: walletAuthService.isConnected(),
    });
  }
}
