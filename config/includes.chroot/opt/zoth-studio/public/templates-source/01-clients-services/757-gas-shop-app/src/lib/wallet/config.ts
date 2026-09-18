// DePay Configuration for 757 Gas Shop
export const DEPAY_CONFIG = {
  // Your DePay App ID
  appId: '1252e251-7a56-4454-a49e-9a83d25f3363',
  
  // Widget configuration
  widgetUrl: 'https://integrate.depay.com',
  
  // Accepted tokens (USDC on Solana)
  acceptedTokens: {
    solana: [
      // USDC mainnet
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      // USDC devnet (for testing)
      '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEER极JgZJDncDU'
    ]
  },

  // Payment amounts (matching your credit packages)
  creditPackages: [20, 40, 100],

  // Webhook configuration
  webhookUrl: "https://isnzaevdulkiwzzjhouv.supabase.co/functions/v1/depay-webhook",

  // App metadata
  appName: '757 Gas Shop',
  appUrl: 'https://app.757gas.shop',
  
  // Blockchain networks
  networks: {
    solana: {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com',
      testnet: 'https://api.testnet.solana.com'
    }
  }
} as const;

export default DEPAY_CONFIG;
