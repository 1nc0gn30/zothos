import { BrowserSDK, AddressType, getDeeplinkToPhantom } from '@phantom/browser-sdk';
import type { User, UserIdentity } from '@supabase/supabase-js';
import { supabase } from '../supabase';

type SolanaPublicKey = {
  toBase58?: () => string;
  toString: () => string;
};

export interface Wallet {
  publicKey: SolanaPublicKey | null;
  connected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array): Promise<Uint8Array | { signature: Uint8Array }>;
}

type SolanaWalletProvider = Wallet & {
  publicKey: SolanaPublicKey | null;
  signIn?: (...inputs: any[]) => Promise<any>;
};

export interface WalletAdapter {
  name: string;
  icon: string;
  url: string;
  detected: boolean;
}

const WALLET_ADAPTERS: WalletAdapter[] = [
  {
    name: 'Phantom',
    icon: '/Phantom-Icon_App.svg',
    url: 'https://phantom.app/',
    detected: typeof window !== 'undefined' && !!(window as any).phantom?.solana,
  },
];

const PHANTOM_APP_ID = 'babf3ab8-409b-454a-9b3d-e10f7218f306';

/** Detect if the page is running inside Phantom's built-in browser (mobile app WebView). */
function isPhantomBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).phantom?.solana?.isPhantom;
}

function generateNonce(): string {
  const cryptoObj = typeof window !== 'undefined' ? (window as any).crypto : undefined;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export class WalletAuthService {
  private sdk: BrowserSDK | null = null;
  private currentWallet: SolanaWalletProvider | null = null;

  constructor() {
    this.initSdk();
  }

  private initSdk(): void {
    if (typeof window === 'undefined') return;
    try {
      this.sdk = new BrowserSDK({
        appId: PHANTOM_APP_ID,
        addressTypes: [AddressType.solana],
        providers: ['injected', 'deeplink', 'phantom'],
        embeddedWalletType: 'user-wallet',
        authOptions: {
          redirectUrl: window.location.origin + '/wallet',
        },
      });
    } catch (e) {
      console.error('[WalletAuthService] Failed to initialize Phantom SDK:', e);
    }
  }

  /** Grab the raw window.phantom.solana injected provider if it exists. */
  private getInjectedPhantom(): SolanaWalletProvider | null {
    if (typeof window === 'undefined') return null;
    const injected = (window as any).phantom?.solana;
    if (!injected || typeof injected.connect !== 'function') return null;
    return injected as SolanaWalletProvider;
  }

  private setCurrentWalletFromSdk(solanaAddress: string): void {
    this.currentWallet = {
      publicKey: { toString: () => solanaAddress, toBase58: () => solanaAddress },
      connected: true,
      connect: async () => {},
      disconnect: async () => {
        await this.sdk?.disconnect();
      },
      signMessage: async (message: Uint8Array) => {
        if (!this.sdk) throw new Error('Phantom SDK not initialized');
        const result = await this.sdk.solana.signMessage(message);
        return { signature: result.signature };
      },
    } as SolanaWalletProvider;
  }

  isMobile(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  getAvailableWallets(): WalletAdapter[] {
    if (this.isMobile()) {
      return WALLET_ADAPTERS;
    }
    return WALLET_ADAPTERS.filter(adapter => adapter.detected);
  }

  /** Connect to Phantom using the Browser SDK. Falls back through injected → embedded (phantom) wallet creation. */
  async connectWithPhantom(): Promise<string> {
    const inPhantomBrowser = isPhantomBrowser();
    if (!this.sdk) {
      throw new Error('Phantom SDK not initialized. Ensure you are in a browser environment.');
    }

    // If already connected (e.g. after a deeplink return), return the address immediately.
    if (this.sdk.isConnected()) {
      const solanaAddress = this.sdk
        .getAddresses()
        .find((addr) => addr.addressType === AddressType.solana)?.address;
      if (solanaAddress) {
        this.setCurrentWalletFromSdk(solanaAddress);
        return solanaAddress;
      }
    }

    const isMobile = this.isMobile();
    // Inside Phantom's browser the injected provider is always available, so prefer it.
    const providers: Array<'injected' | 'phantom'> = (isMobile && !inPhantomBrowser)
      ? ['phantom']
      : ['injected', 'phantom'];

    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const result = await this.sdk.connect({ provider });
        const solanaAddress = result.addresses.find(
          (addr) => addr.addressType === AddressType.solana
        )?.address;

        if (!solanaAddress) {
          throw new Error(`No Solana address returned by Phantom (${provider}).`);
        }

        this.setCurrentWalletFromSdk(solanaAddress);
        return solanaAddress;
      } catch (err: any) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.message?.toLowerCase().includes('mxdomain')) {
          console.warn('[connectWithPhantom] mxdomain error — domain not registered for this Phantom appId. Will try injected provider.');
        }
        console.warn(`[connectWithPhantom] provider ${provider} failed:`, lastError.message);
      }
    }

    // Ultimate fallback: use the raw injected provider directly (bypasses SDK domain checks).
    const injected = this.getInjectedPhantom();
    if (injected) {
      try {
        if (!injected.connected) await injected.connect();
        const pk = injected.publicKey;
        if (!pk) throw new Error('Injected Phantom provider returned no public key.');
        this.currentWallet = injected;
        return pk.toString();
      } catch (e: any) {
        console.warn('[connectWithPhantom] Injected fallback failed:', e?.message || e);
      }
    }

    if (isMobile) {
      throw new Error(
        'MOBILE_WALLET_REQUIRED: On mobile, wallet apps do not inject into external browsers. ' +
        'Please open this website in Phantom\'s built-in browser. ' +
        'Tap "Open in Phantom" below, then return here and try again.'
      );
    }

    throw lastError || new Error('Failed to connect with Phantom. No available provider succeeded. If you see "mxdomain", the site domain is not registered in the Phantom developer dashboard for this appId.');
  }

  /** Sign a standardized wallet-linking message using the SDK. */
  async signLinkingMessage(walletAddress: string): Promise<{ message: string; signatureHex: string }> {
    const signer = this.currentWallet;
    if (!signer) {
      throw new Error('No wallet connected. Connect Phantom first.');
    }

    const timestamp = Date.now();
    const nonce = generateNonce();
    const message = `Link wallet to 757 GAS SHOP\nAddress: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;

    let signResult: { signature: Uint8Array; publicKey?: string };
    try {
      const encoded = new TextEncoder().encode(message);
      const raw = await signer.signMessage(encoded);
      signResult =
        raw && 'signature' in raw
          ? (raw as { signature: Uint8Array; publicKey?: string })
          : { signature: raw as Uint8Array };
    } catch (err: any) {
      console.error('[signLinkingMessage] signMessage error:', err);
      throw new Error(err?.message || 'Wallet message signing was rejected.');
    }

    const signatureBytes = signResult.signature;
    if (!signatureBytes || signatureBytes.length === 0) {
      throw new Error('Wallet returned an empty signature. Try refreshing the page or reconnecting your wallet.');
    }

    const signatureHex = Array.from(signatureBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return { message, signatureHex };
  }

  // ─── Backward-compat wallet connector used by walletStore ───
  async connectWallet(walletName: string): Promise<string> {
    if (walletName === 'Phantom') {
      return this.connectWithPhantom();
    }
    throw new Error('Unsupported wallet');
  }

  // ─── Connect wallet to the current email-authenticated profile ───
  async connectWalletToProfile(): Promise<void> {
    const walletAddress = await this.connectWithPhantom();
    if (!walletAddress) throw new Error('Wallet public key is missing.');

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error('You must be signed in to link a wallet.');

    const { message, signatureHex } = await this.signLinkingMessage(walletAddress);

    const response = await fetch('/api/connect-solana-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken,
        walletAddress,
        message,
        signature: signatureHex,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'Wallet linking failed.');
    }
  }

  // ─── Deep-link helpers for mobile wallets ───
  openPhantomApp(): void {
    if (typeof window === 'undefined') return;
    window.location.href = getDeeplinkToPhantom();
  }

  // ─── Legacy helpers kept for any remaining identity checks ───
  hasSolanaIdentity(user: User | null): boolean {
    return !!this.getSolanaIdentity(user);
  }

  getSolanaIdentity(user: User | null): UserIdentity | null {
    return user?.identities?.find((identity) => identity.provider === 'solana') ?? null;
  }

  getSolanaProviderId(user: User | null): string | null {
    return this.getSolanaIdentity(user)?.identity_data?.provider_id ?? null;
  }

  async disconnectWallet(): Promise<void> {
    if (this.currentWallet) {
      try { await this.currentWallet.disconnect(); } catch (e) { console.error(e); }
      this.currentWallet = null;
    }
    if (this.sdk) {
      try { await this.sdk.disconnect(); } catch (e) { console.error(e); }
      this.sdk = null;
    }
  }

  async signMessage(message: string): Promise<string> {
    const signer = this.currentWallet;
    if (!signer) throw new Error('No wallet connected');
    const encoded = new TextEncoder().encode(message);
    const raw = await signer.signMessage(encoded);
    const signResult =
      raw && 'signature' in raw
        ? (raw as { signature: Uint8Array })
        : { signature: raw as Uint8Array };
    const signatureBytes = signResult.signature;
    return Array.from(signatureBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  getWalletAddress(): string | null {
    return this.currentWallet?.publicKey?.toString() || null;
  }

  isConnected(): boolean {
    return !!this.sdk?.isConnected() || !!this.currentWallet?.connected;
  }
}

export const walletAuthService = new WalletAuthService();
export default walletAuthService;
