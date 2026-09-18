const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Pollinations.ai - free image generation, URLs are persistent
async function generateWithPollinations(prompt, { width = 1024, height = 1024, seed } = {}) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed || Math.floor(Math.random() * 1000000)}&enhance=true&private=true`;
  return { url, provider: 'pollinations' };
}

// OpenAI DALL-E
async function generateWithOpenAI(prompt, apiKey, model = 'dall-e-3', { width = 1024, height = 1024 } = {}) {
  const size = model === 'dall-e-2' && width <= 512 ? '512x512' : '1024x1024';
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      response_format: 'url',
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI image generation failed');
  }
  
  return { url: data.data[0].url, provider: 'openai' };
}

// Quick background persist for OpenAI URLs (URLs expire after ~1hr)
async function persistImageAsync(imageUrl, orderId, generationId) {
  try {
    const imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(25000) });
    if (!imageResponse.ok) throw new Error('Failed to download generated image');
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
    
    const fileName = `order-${orderId.slice(-8)}-${generationId.slice(-8)}.${ext}`;
    const filePath = `ai-assets/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, imageBuffer, {
        contentType,
        upsert: true,
      });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (err) {
    console.error('Failed to persist image:', err);
    return imageUrl;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { 
      statusCode: 400, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON payload' }) 
    };
  }

  const { 
    order_id, 
    user_id,
    prompt, 
    style = 'abstract',
    provider = 'pollinations',
    avatar_url,
    include_avatar,
    include_logo,
    openai_api_key,
    openai_model,
  } = payload;

  if (!order_id || !prompt) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing order_id or prompt' }),
    };
  }

  try {
    // 1. Create generation record as 'generating'
    const { data: generation, error: createError } = await supabase
      .from('ai_generations')
      .insert({
        order_id,
        user_id: user_id || null,
        prompt,
        status: 'generating'
      })
      .select()
      .single();

    if (createError) throw createError;

    // 2. Build full prompt
    let fullPrompt = prompt;
    const hasCannabis = /cannabis|weed|marijuana|bud|strain|thc|cbd|ganja|pot|herb/i.test(fullPrompt);
    
    // Pollinations is text-to-image only — image URLs in prompts are treated as text noise.
    // We skip avatar references and use text-only branding cues.
    if (provider === 'pollinations') {
      if (!hasCannabis) {
        fullPrompt += `. Cannabis culture aesthetic, marijuana art style, artistic.`;
      }
      fullPrompt += `. Vibrant, high quality digital art, artistic composition, no text, no watermark.`;
      if (include_logo) {
        fullPrompt += ` Include a subtle stylized cannabis leaf as a golden branding mark somewhere in the scene.`;
      }
    } else {
      if (!hasCannabis) {
        fullPrompt += `. Cannabis culture aesthetic, marijuana art style.`;
      }
      fullPrompt += `. Style: ${style}, artistic, vibrant, high quality digital art.`;
      if (include_avatar && avatar_url) {
        fullPrompt += ` Character design inspired by a cartoon avatar with this vibe: ${avatar_url}.`;
      }
      if (include_logo) {
        fullPrompt += ` Subtle golden cannabis leaf branding element in the composition.`;
      }
    }
    
    // 3. Generate image URL (fast — just builds the URL, doesn't wait for generation)
    let result;
    switch (provider) {
      case 'openai':
        if (!openai_api_key) throw new Error('OpenAI API key required');
        result = await generateWithOpenAI(fullPrompt, openai_api_key, openai_model || 'dall-e-3');
        break;
      case 'pollinations':
      default:
        result = await generateWithPollinations(fullPrompt);
        break;
    }

    // 4. For Pollinations: fetch server-side (no referrer) and upload to Supabase
    //    so the browser never hits referrer-based auth blocks.
    //    For OpenAI: try to persist but don't block — OpenAI URLs expire.
    let assetUrl = result.url;
    if (provider === 'pollinations') {
      try {
        const imageResponse = await fetch(result.url, {
          signal: AbortSignal.timeout(8000),
          headers: { 'Referer': '' }
        });
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          const contentType = imageResponse.headers.get('content-type') || 'image/png';
          const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';
          const fileName = `order-${order_id.slice(-8)}-${generation.id.slice(-8)}.${ext}`;
          const filePath = `ai-assets/${fileName}`;
          const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, imageBuffer, { contentType, upsert: true });
          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
            assetUrl = publicUrl;
          }
        }
      } catch (persistErr) {
        console.warn('Pollinations server-side persist failed, falling back to direct URL:', persistErr.message);
        // Fallback: return the direct Pollinations URL
      }
    } else if (provider === 'openai') {
      assetUrl = await persistImageAsync(result.url, order_id, generation.id);
    }

    // 5. Update generation record as completed
    const { error: updateError } = await supabase
      .from('ai_generations')
      .update({
        generated_asset_url: assetUrl,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', generation.id);

    if (updateError) throw updateError;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generation_id: generation.id,
        asset_url: assetUrl,
        status: 'completed',
        provider: result.provider,
      }),
    };

  } catch (error) {
    console.error('AI generation failed:', error);

    // Mark any generating record for this order as failed
    if (payload.order_id) {
      await supabase
        .from('ai_generations')
        .update({
          status: 'failed',
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', payload.order_id)
        .eq('status', 'generating');
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'AI generation failed', details: error.message }),
    };
  }
};
