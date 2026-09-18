# DePay + Solana USDC Migration Guide

## Overview
This document outlines the migration from Stripe to DePay with Solana USDC integration for the 757 Gas application.

## Changes Made

### 1. Backend Services
- **New Netlify Functions**:
  - `depay-webhook.js` - Handles DePay payment webhooks
  - `depay-packages.js` - Generates DePay payment links
  - `ai-generation.js` - AI digital asset generation service

- **Removed Stripe Functions**:
  - `stripe-webhook.js` - Replaced by DePay webhook
  - `credit-packages.js` - Replaced by DePay packages

### 2. Frontend Integration
- **New Wallet Services**:
  - `src/lib/wallet/depay.ts` - DePay Solana integration
  - `src/lib/wallet/auth.ts` - Wallet connection service
  - `src/lib/wallet/packages.ts` - Credit packages service
  - `src/store/walletStore.ts` - Zustand store for wallet state

- **Updated Pages**:
  - `Wallet.tsx` - Now uses DePay instead of Stripe
  - `OrderDetail.tsx` - Added AI generation and enhanced flow

### 3. Database Schema
- **New Fields**:
  - `profiles.solana_wallet_address` - User's Solana wallet
  - `profiles.wallet_type` - Custodial vs self-custodial
  - `profiles.last_wallet_sync` - Last balance sync timestamp
  - `wallet_transactions.blockchain_tx_hash` - On-chain transaction ID
  - `wallet_transactions.blockchain_network` - Network (solana)
  - `wallet_transactions.token_address` - Token address (USDC)

- **New Table**:
  - `ai_generations` - Stores AI-generated digital assets

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:

```bash
# DePay Configuration
VITE_DEPAY_APP_ID=your-depay-app-id

# Solana Configuration  
VITE_SOLANA_NETWORK=devnet

# Webhook Secrets
DEPAY_WEBHOOK_SECRET=your-depay-webhook-secret

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 2. Database Migration
Run the SQL migration in `supabase/migrations/20250425120000_add_wallet_blockchain_fields.sql`

### 3. DePay Setup
1. Create a DePay application at [https://depay.com](https://depay.com)
2. Configure webhooks to point to your `/.netlify/functions/depay-webhook` endpoint
3. Set up accepted tokens (USDC on Solana)

### 4. Google AI Setup
1. Create a Google AI API key at [https://makersuite.google.com](https://makersuite.google.com)
2. Enable the Generative Language API

## Legal Considerations

The migration maintains the legal separation:
- **Credits**: Used for "digital services" (AI asset generation)
- **Pickup Information**: Provided as "bonus location data" 
- **No Explicit Language**: No mention of cannabis transactions

Users purchase credits that can be used for:
1. AI digital asset generation services
2. Optional pickup location information (as a bonus)

## Testing

### Test DePay Integration
1. Connect a Solana wallet (Phantom)
2. Test USDC payments on devnet
3. Verify webhook processing and wallet balance updates

### Test AI Generation  
1. Complete an order using credits
2. Generate AI assets from order details
3. Verify asset creation and download

## Rollback Plan

If issues arise, you can:
1. Revert to Stripe by restoring original functions
2. Keep the database changes for future migration
3. Maintain both payment options during transition

## Support

For issues with:
- DePay integration: contact DePay support
- Solana transactions: check Solana dev docs  
- AI generation: verify Google AI API setup
- Database: run migration scripts carefully
