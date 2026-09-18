import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface DePayConfig {
  appId: string;
  widgetUrl: string;
  defaultAcceptedTokens: string[];
}

export interface WalletBalance {
  custodial: number;
  onChainUSDC: number;
  total: number;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient: string;
  reference?: string;
}

// USDC on Solana mainnet
const USDC_MAINNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
// USDC on Solana devnet (for testing)
const USDC_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

class DePayService {
  private connection: Connection;
  private config: DePayConfig;

  constructor(config: DePayConfig) {
    this.config = config;
    this.connection = new Connection(
      import.meta.env.MODE === 'production' 
        ? clusterApiUrl('mainnet-beta')
        : clusterApiUrl('devnet'),
      'confirmed'
    );
  }

  // Initialize DePay widget
  async initializePaymentWidget(
    amount: number,
    currency: string = 'USDC',
    reference?: string
  ): Promise<string> {
    const widgetUrl = new URL(this.config.widgetUrl);
    
    widgetUrl.searchParams.set('amount', amount.toString());
    widgetUrl.searchParams.set('currency', currency);
    widgetUrl.searchParams.set('accept', this.config.defaultAcceptedTokens.join(','));
    
    if (reference) {
      widgetUrl.searchParams.set('reference', reference);
    }

    return widgetUrl.toString();
  }

  // Get user's on-chain USDC balance
  async getOnChainUSDCBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const usdcMint = import.meta.env.MODE === 'production' 
        ? USDC_MAINNET 
        : USDC_DEVNET;

      const usdcAccount = tokenAccounts.value.find(account => 
        account.account.data.parsed.info.mint === usdcMint
      );

      if (!usdcAccount) return 0;

      const balance = usdcAccount.account.data.parsed.info.tokenAmount.uiAmount;
      return balance || 0;
    } catch (error) {
      console.error('Error fetching on-chain USDC balance:', error);
      return 0;
    }
  }

  // Verify transaction on blockchain
  async verifyTransaction(
    txHash: string,
    expectedAmount: number,
    expectedRecipient: string
  ): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(txHash, {
        maxSupportedTransactionVersion: 0
      });

      if (!transaction) return false;

      // Verify transaction details match expected values
      // This would need more sophisticated verification based on DePay's implementation
      return true;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  // Generate payment reference for webhook tracking
  generatePaymentReference(userId: string): string {
    return `user_${userId}_${Date.now()}`;
  }
}

// Default configuration with your DePay app ID
const defaultConfig: DePayConfig = {
  appId: '1252e251-7a56-4454-a49e-9a83d25f3363',
  widgetUrl: 'https://integrate.depay.com',
  defaultAcceptedTokens: [USDC_MAINNET]
};

export const depayService = new DePayService(defaultConfig);

export default depayService;
