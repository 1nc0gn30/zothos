const X_API_BASE = 'https://api.x.com/2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const handle = url.searchParams.get('handle');
  const mediaOnly = url.searchParams.get('media') === 'true';

  if (!handle) {
    return jsonResponse({ error: 'Missing handle query param' }, 400);
  }

  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    return jsonResponse({ error: 'X_BEARER_TOKEN not configured' }, 500);
  }

  try {
    const cleanHandle = handle.replace(/^@/, '');

    // 1. Fetch user profile
    const userFields = 'public_metrics,profile_image_url,url,description,verified,verified_type,location';
    const userRes = await fetch(
      `${X_API_BASE}/users/by/username/${cleanHandle}?user.fields=${userFields}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userRes.ok) {
      const err = await userRes.json().catch(() => ({}));
      return jsonResponse(
        { error: err.detail || `X API error ${userRes.status}` },
        userRes.status
      );
    }

    const userData = await userRes.json();
    const user = userData.data;

    if (!user) {
      return jsonResponse({ error: 'User not found on X' }, 404);
    }

    const result = {
      id: user.id,
      handle: user.username,
      name: user.name,
      bio: user.description || '',
      avatar: user.profile_image_url?.replace('_normal', '_400x400') || null,
      banner: null, // X API v2 doesn't expose banner_url; we'll try v1.1 fallback
      followers: user.public_metrics?.followers_count ?? 0,
      following: user.public_metrics?.following_count ?? 0,
      posts: user.public_metrics?.tweet_count ?? 0,
      verified: user.verified || false,
      verifiedType: user.verified_type || null,
      url: user.url || `https://x.com/${user.username}`,
      location: user.location || null,
    };

    // 2. If not media-only, also fetch recent tweets
    if (!mediaOnly) {
      const tweetFields = 'public_metrics,created_at,attachments,referenced_tweets';
      const tweetExpansions = 'attachments.media_keys';
      const mediaFields = 'url,preview_image_url,type,width,height';

      const tweetsRes = await fetch(
        `${X_API_BASE}/users/${user.id}/tweets?max_results=10&tweet.fields=${tweetFields}&expansions=${tweetExpansions}&media.fields=${mediaFields}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (tweetsRes.ok) {
        const tweetsData = await tweetsRes.json();
        const mediaMap = new Map();
        (tweetsData.includes?.media || []).forEach((m) => {
          mediaMap.set(m.media_key, m);
        });

        result.tweets = (tweetsData.data || []).map((t) => {
          const media = [];
          if (t.attachments?.media_keys) {
            t.attachments.media_keys.forEach((mk) => {
              const m = mediaMap.get(mk);
              if (m) {
                media.push({
                  url: m.url || m.preview_image_url,
                  type: m.type,
                  width: m.width,
                  height: m.height,
                });
              }
            });
          }
          return {
            id: t.id,
            text: t.text,
            createdAt: t.created_at,
            metrics: t.public_metrics || {},
            media,
            isRetweet: t.referenced_tweets?.some((r) => r.type === 'retweeted') || false,
            isReply: t.referenced_tweets?.some((r) => r.type === 'replied_to') || false,
          };
        });
      } else {
        result.tweets = [];
      }
    }

    return jsonResponse(result, 200);
  } catch (e) {
    console.error('x-data function error:', e);
    return jsonResponse({ error: e.message || 'Internal error' }, 500);
  }
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

export const config = {
  path: '/api/x',
};
