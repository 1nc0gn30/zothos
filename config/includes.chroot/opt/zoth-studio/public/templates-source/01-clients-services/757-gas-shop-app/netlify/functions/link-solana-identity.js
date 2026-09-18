import { createClient } from '@supabase/supabase-js';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
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

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const emailAccessToken = String(payload.emailAccessToken || '').trim();
  const walletAccessToken = String(payload.walletAccessToken || '').trim();

  if (!emailAccessToken || !walletAccessToken) {
    return json(400, {
      error: 'Both emailAccessToken and walletAccessToken are required.',
      detail: {
        hasEmailToken: !!emailAccessToken,
        hasWalletToken: !!walletAccessToken,
      },
    });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [{ data: emailData, error: emailError }, { data: walletData, error: walletError }] =
    await Promise.all([
      admin.auth.getUser(emailAccessToken),
      admin.auth.getUser(walletAccessToken),
    ]);

  if (emailError || !emailData.user) {
    return json(401, { error: 'Email session is no longer valid.' });
  }

  if (walletError || !walletData.user) {
    return json(401, { error: 'Wallet session is no longer valid.' });
  }

  const solanaIdentity = walletData.user.identities?.find((identity) => identity.provider === 'solana');
  if (!solanaIdentity) {
    return json(400, {
      error: 'The wallet session does not include a verified Solana identity.',
      detail: {
        walletUserId: walletData.user.id,
        walletIdentities: walletData.user.identities?.map((i) => ({ provider: i.provider, provider_id: i.provider_id })) || [],
      },
    });
  }

  const { data, error } = await admin.rpc('merge_solana_identity_into_user', {
    target_user_id: emailData.user.id,
    wallet_user_id: walletData.user.id,
  });

  if (error) {
    return json(500, { error: error.message });
  }

  return json(200, {
    providerId: data?.[0]?.provider_id || solanaIdentity.identity_data?.provider_id || solanaIdentity.provider_id,
    identityId: data?.[0]?.identity_id || solanaIdentity.id,
  });
};
