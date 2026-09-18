import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const signature = req.headers.get('x-signature')
  const body = await req.text()
  const pem = Deno.env.get('DEPAY_PUBLIC_KEY')!

  // 1. VERIFY SIGNATURE
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const publicKey = await crypto.subtle.importKey(
    "spki",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = Uint8Array.from(atob(signature!), c => c.charCodeAt(0));
  const dataBytes = new TextEncoder().encode(body);

  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    sigBytes,
    dataBytes
  );

  if (!verified) {
    return new Response(JSON.stringify({ error: "Invalid Signature" }), { status: 401 });
  }

  const data = JSON.parse(body);

  // 2. PARSE REFERENCE TO EXTRACT USER ID
  // The reference format is: user_${userId}_${timestamp}
  const reference = data.reference || '';
  const refMatch = reference.match(/^user_([a-f0-9-]{36})_(\d+)$/);
  
  if (!refMatch) {
    console.warn('Invalid or missing reference:', reference);
    return new Response(JSON.stringify({ received: true, credited: false, reason: 'invalid_reference' }), { status: 200 });
  }

  const userId = refMatch[1];
  const amountPaid = Math.floor(parseFloat(data.amount || '0'));
  const txHash = data.transaction || data.tx_hash || '';
  const currency = data.currency || 'USDC';

  // 3. VALIDATE AMOUNT
  if (amountPaid <= 0) {
    console.warn('Invalid amount:', amountPaid, 'from reference:', reference);
    return new Response(JSON.stringify({ received: true, credited: false, reason: 'invalid_amount' }), { status: 200 });
  }

  // 4. IDEMPOTENCY CHECK — don't double-credit
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: existingTx } = await supabase
    .from('wallet_transactions')
    .select('id')
    .eq('external_reference', txHash)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingTx) {
    console.log('Duplicate webhook ignored for tx:', txHash);
    return new Response(JSON.stringify({ received: true, credited: false, reason: 'already_processed' }), { status: 200 });
  }

  // 5. ADD CREDITS
  const { error } = await supabase.rpc('add_wallet_credits', {
    target_user_id: userId,
    credit_amount: amountPaid,
    external_ref: txHash
  });

  if (error) {
    console.error('add_wallet_credits failed:', error);
    return new Response(JSON.stringify({ error: 'Credit update failed', details: error.message }), { status: 500 });
  }

  console.log(`Credited ${amountPaid} to user ${userId}, tx: ${txHash}`);

  return new Response(JSON.stringify({ received: true, credited: true, amount: amountPaid, user_id: userId }), { status: 200 });
});
