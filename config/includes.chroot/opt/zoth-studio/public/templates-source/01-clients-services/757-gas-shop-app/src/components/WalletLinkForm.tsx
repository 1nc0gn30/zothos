import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Check, AlertCircle, Plus, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

type WalletReference = {
  id: string;
  user_id: string;
  wallet_address: string;
  network: string;
  is_primary: boolean;
  last_used_at: string | null;
  created_at: string;
};

interface WalletLinkFormProps {
  userId: string;
  onWalletLinked: () => void;
  existingWallets: WalletReference[];
}

const WalletLinkForm: React.FC<WalletLinkFormProps> = ({ userId, onWalletLinked, existingWallets }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('ethereum');
  const [isPrimary, setIsPrimary] = useState(existingWallets.length === 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isValidWallet = (address: string, networkType: string) => {
    if (!address.trim()) return false;
    
    // Basic validation - can be enhanced for specific networks
    switch (networkType) {
      case 'ethereum':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      case 'solana':
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      case 'polygon':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      default:
        return address.length > 20; // Basic length check
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidWallet(walletAddress, network)) {
      setError('Please enter a valid wallet address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('wallet_references')
        .insert([
          {
            user_id: userId,
            wallet_address: walletAddress.toLowerCase(),
            network,
            is_primary: isPrimary,
            last_used_at: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess(true);
      setWalletAddress('');
      onWalletLinked();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to link wallet');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, walletId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(walletId);
      setTimeout(() => setCopiedId((current) => current === walletId ? null : current), 2000);
    } catch {
      // Fallback for older browsers or clipboard API restrictions
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(walletId);
      setTimeout(() => setCopiedId((current) => current === walletId ? null : current), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Wallet className="h-5 w-5 text-primary" />
        Linked Wallets
      </h3>
      
      {existingWallets.length > 0 && (
        <div className="space-y-2">
          {existingWallets.map((wallet) => (
            <div key={wallet.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{wallet.wallet_address}</p>
                <p className="text-xs text-muted-foreground capitalize">{wallet.network}</p>
              </div>
              <button
                onClick={() => copyToClipboard(wallet.wallet_address, wallet.id)}
                className={`p-2 rounded transition-all duration-200 ${copiedId === wallet.id ? 'bg-green-500/20 text-green-500' : 'hover:bg-background text-muted-foreground hover:text-foreground'}`}
                title={copiedId === wallet.id ? 'Copied!' : 'Copy wallet address'}
              >
                {copiedId === wallet.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3">
          <label className="text-sm font-medium">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x... or your wallet address"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={loading}
          />
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-medium">Network</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={loading}
          >
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
            <option value="polygon">Polygon</option>
            <option value="bitcoin">Bitcoin</option>
          </select>
        </div>

        {existingWallets.length > 0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-primary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-input focus:ring-primary"
              disabled={loading}
            />
            <label htmlFor="is-primary" className="text-sm text-muted-foreground">
              Set as primary wallet
            </label>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="h-4 w-4" />
            Wallet linked successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !walletAddress.trim()}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Linking...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Link Wallet
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground">
        Linking your wallet helps with order tracking and provides a reference for any payment or order issues.
      </p>
    </div>
  );
};

export default WalletLinkForm;
