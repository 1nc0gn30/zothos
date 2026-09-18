import { createClient } from '@supabase/supabase-js';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

// Bitcoin / Solana base58 alphabet
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Decode(str) {
  const base = BigInt(58);
  let num = BigInt(0);
  for (const char of str) {
    const idx = BASE58_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base58 character: ${char}`);
    num = num * base + BigInt(idx);
  }
  const bytes = [];
  while (num > 0n) {
    bytes.unshift(Number(num % 256n));
    num = num / 256n;
  }
  for (const char of str) {
    if (char === '1') bytes.unshift(0);
    else break;
  }
  return Buffer.from(bytes);
}

// Ed25519 raw public key (32 bytes) -> DER SPKI (44 bytes)
function rawEd25519ToDerSpki(rawKey) {
  const header = Buffer.from('302a300506032b6570032100', 'hex');
  return Buffer.concat([header, rawKey]);
}

export const handler = async (event) => {
  console.log('[connect-solana-wallet] method:', event.httpMethod);
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: 'Missing Supabase service-role configuration.' });
  }

  let rawBody = event.body || '{}';
  // Netlify sometimes base64-encodes the body
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64').toString('utf-8');
  }
  console.log('[connect-solana-wallet] raw body:', rawBody.slice(0, 500));

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (e) {
    console.error('[connect-solana-wallet] JSON parse error:', e.message);
    return json(400, { error: 'Invalid JSON body.' });
  }

  console.log('[connect-solana-wallet] parsed keys:', Object.keys(payload));

  const accessToken = String(payload.accessToken || '').trim();
  const walletAddress = String(payload.walletAddress || '').trim();
  const message = String(payload.message || '').trim();
  const signatureHex = String(payload.signature || '').trim();

  console.log('[connect-solana-wallet] accessToken?', !!accessToken, 'walletAddress?', !!walletAddress, 'message?', !!message, 'signature?', !!signatureHex);

  if (!accessToken || !walletAddress || !message || !signatureHex) {
    return json(400, {
      error: 'accessToken, walletAddress, message, and signature are required.',
      detail: {
        hasAccessToken: !!accessToken,
        hasWalletAddress: !!walletAddress,
        hasMessage: !!message,
        hasSignature: !!signatureHex,
      },
    });
  }

  // 1. Verify the user from their access token
  const userClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser(accessToken);
  if (userError || !userData.user) {
    console.error('[connect-solana-wallet] getUser error:', userError?.message);
    return json(401, { error: 'Invalid or expired session.' });
  }

  const userId = userData.user.id;
  console.log('[connect-solana-wallet] userId:', userId);

  // 2. Validate message timestamp (must be within 5 minutes)
  const timestampMatch = message.match(/Timestamp:\s*(\d+)/);
  if (!timestampMatch) {
    return json(400, { error: 'Message missing timestamp.' });
  }

  const messageTime = parseInt(timestampMatch[1], 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (Number.isNaN(messageTime) || Math.abs(now - messageTime) > fiveMinutes) {
    return json(400, { error: 'Message timestamp expired or invalid.' });
  }

  // 3. Verify the wallet address appears in the message
  if (!message.includes(walletAddress)) {
    return json(400, { error: 'Message does not contain the claimed wallet address.' });
  }

  // 4. Decode base58 address and verify Ed25519 signature
  let rawPublicKey;
  try {
    rawPublicKey = base58Decode(walletAddress);
  } catch (e) {
    return json(400, { error: 'Invalid Solana wallet address.' });
  }

  if (rawPublicKey.length !== 32) {
    return json(400, { error: `Decoded public key length ${rawPublicKey.length} !== 32.` });
  }

  // Reconstruct DER SPKI for Node.js crypto
  const derSpki = rawEd25519ToDerSpki(rawPublicKey);

  let publicKey;
  try {
    publicKey = (await import('crypto')).createPublicKey({
      key: derSpki,
      format: 'der',
      type: 'spki',
    });
  } catch (e) {
    console.error('[connect-solana-wallet] createPublicKey error:', e.message);
    return json(500, { error: 'Failed to import public key for verification.' });
  }

  let signatureBytes;
  try {
    signatureBytes = Buffer.from(signatureHex.replace(/^0x/, ''), 'hex');
  } catch (e) {
    return json(400, { error: 'Invalid signature hex encoding.' });
  }

  let isValid;
  try {
    isValid = (await import('crypto')).verify(null, Buffer.from(message), publicKey, signatureBytes);
  } catch (e) {
    console.error('[connect-solana-wallet] verify error:', e.message);
    return json(400, { error: 'Signature verification failed.' });
  }

  if (!isValid) {
    return json(401, { error: 'Invalid wallet signature.' });
  }

  // 5. Update the user's profile with the verified wallet address
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: updateError } = await admin
    .from('profiles')
    .update({
      solana_wallet_address: walletAddress,
      wallet_type: 'self_custodial',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    console.error('[connect-solana-wallet] update error:', updateError.message);
    return json(500, { error: updateError.message });
  }

  console.log('[connect-solana-wallet] success for user:', userId);
  return json(200, {
    success: true,
    walletAddress,
    message: 'Wallet linked successfully.',
  });
};
