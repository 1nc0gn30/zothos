# DePay Webhook Function

This Supabase Edge Function handles DePay payment webhooks with RSA signature verification.

## Setup

1. **Environment Variables**:
   - `DEPAY_PUBLIC_KEY`: Your DePay public key for signature verification
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

2. **DePay Configuration**:
   - Set webhook URL to: `https://your-project-ref.supabase.co/functions/v1/depay-webhook`
   - Configure to send RSA-signed webhooks

## Function Details

- **Signature Verification**: Uses RSA PKCS1 v1.5 with SHA-256
- **Payment Processing**: Credits user wallet upon successful payment
- **Security**: Validates signatures before processing payments

## Expected Webhook Format

```json
{
  "status": "success",
  "amount": "20.00",
  "transaction": "tx_hash_here",
  "payload": {
    "user_id": "user_uuid"
  }
}
```

## Database Requirements

Ensure you have the `add_wallet_credits` RPC function in your Supabase database:

```sql
CREATE OR REPLACE FUNCTION add_wallet_credits(
  target_user_id UUID,
  credit_amount INTEGER,
  external_ref TEXT
) RETURNS VOID AS $$
BEGIN
  -- Your wallet credit logic here
  -- Example: UPDATE profiles SET wallet_balance = wallet_balance + credit_amount WHERE id = target_user_id;
  -- INSERT INTO wallet_transactions (...) VALUES (...);
END;
$$ LANGUAGE plpgsql;
```
