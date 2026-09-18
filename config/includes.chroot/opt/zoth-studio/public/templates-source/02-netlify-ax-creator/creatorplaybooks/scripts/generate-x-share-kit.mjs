#!/usr/bin/env node
// Generates a standalone mentor-x-share-kit.html from the bundled creator data.
import fs from 'fs';
import path from 'path';

const apiPath = path.resolve(process.cwd(), 'netlify/functions/api.mjs');
const outPath = path.resolve(process.cwd(), 'public/mentor-x-share-kit.html');

const source = fs.readFileSync(apiPath, 'utf8');

function findMatchingBracket(text, openIdx) {
  let depth = 1;
  let inString = null;
  let escape = false;
  for (let i = openIdx + 1; i < text.length; i++) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (inString) {
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error('Could not find matching bracket for BASE_CREATORS');
}

const startMarker = 'const BASE_CREATORS = [';
const startIdx = source.indexOf(startMarker);
if (startIdx === -1) throw new Error('BASE_CREATORS not found');
const openIdx = startIdx + startMarker.length - 1; // points at '['
const closeIdx = findMatchingBracket(source, openIdx);
const literal = source.slice(openIdx, closeIdx + 1);
const creators = eval(literal);

function asciiNormalize(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2192/g, '->')
    .replace(/\u00A0/g, ' ');
}

function formatText(str) {
  return asciiNormalize(str)
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function oneLine(str) {
  return formatText(str).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function joinLines(...parts) {
  return formatText(parts.filter(Boolean).join('\n\n'));
}

function playLine(p, i) {
  const title = p.title || 'Untitled play';
  const desc = p.description || '';
  const emoji = p.emoji || '';
  return `${i}. ${emoji} ${title}${desc ? ` — ${desc}` : ''}`;
}

function threadLine(p, i) {
  const title = p.title || 'Untitled play';
  const desc = p.description || '';
  const emoji = p.emoji || '';
  const action = p.action || '';
  const freq = p.frequency || '';
  let body = `${i}/ ${emoji} ${title}\n${desc}`;
  if (action || freq) body += `\nAction: ${action}${freq ? ` (${freq})` : ''}`;
  return body;
}

function urlAbs(relativeUrl) {
  if (!relativeUrl) return '';
  if (/^https?:\/\//.test(relativeUrl)) return relativeUrl;
  return `https://creatorplaybooks.netlify.app${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function xShareUrl(text, url) {
  const body = encodeURIComponent(asciiNormalize(text));
  const link = url ? encodeURIComponent(url) : '';
  return `https://x.com/intent/post?text=${body}${link ? '&url=' + link : ''}`;
}

function postFor(c) {
  const plays = (c.plays || []).filter(p => p.title || p.description);
  const hooks = c.hooks || [];
  const products = c.products || [];
  const media = c.media || [];
  const topPlays = plays.slice(0, 3);
  const hook = hooks[0] || `Meet ${c.name}.`;
  const bio = c.bio || '';
  const apiUrl = `https://creatorplaybooks.netlify.app/api/creator?id=${c.id}&expand=all`;
  const xUrl = `https://x.com/${c.xHandle}`;

  const main = joinLines(
    hook,
    bio,
    topPlays.length ? `Repeatable plays:\n${topPlays.map((p, i) => playLine(p, i + 1)).join('\n')}` : '',
    `Copy the full playbook → ${apiUrl}`,
    `Follow ${c.handle} → ${xUrl}`
  );

  const product = products.length
    ? joinLines(
        `${c.name} builds:`,
        products.map((p, i) => `${i + 1}. ${p.name}${p.description ? ` — ${p.description}` : ''}\n${p.url || ''}`).join('\n\n'),
        hook,
        `→ ${xUrl}`
      )
    : joinLines(
        `${c.name} is building in public.`,
        hook,
        `Follow the journey → ${xUrl}`
      );

  const thread = plays.length
    ? joinLines(
        `Thread: ${c.name}'s repeatable growth plays`,
        plays.map((p, i) => threadLine(p, i + 1)).join('\n\n'),
        `Get the full agent-ready bundle:\n${apiUrl}`
      )
    : joinLines(
        `Thread: ${c.name}'s playbook`,
        bio,
        `Get the full bundle:\n${apiUrl}`
      );

  const mediaPost = media.length
    ? joinLines(
        hook,
        bio,
        `Asset drop below. More plays + hooks in the full bundle:\n${apiUrl}`
      )
    : '';

  const short = joinLines(
    hook,
    bio,
    `Copy the playbook → ${apiUrl}`
  );

  return { main, product, thread, media: mediaPost, short };
}

function cardHTML(c) {
  const posts = postFor(c);
  const primary = c.theme?.primary || '#22d3ee';
  const secondary = c.theme?.secondary || '#8b5cf6';
  const accent = c.theme?.accent || '#22d3ee';
  const tags = (c.tags || []).slice(0, 5);
  const media = (c.media || []).map(urlAbs);
  const xUrl = `https://x.com/${c.xHandle}`;
  const apiUrl = `https://creatorplaybooks.netlify.app/api/creator?id=${c.id}&expand=all`;
  const productLinks = (c.products || []).map(p => ({ name: p.name, url: p.url }));
  const avatar = urlAbs(c.avatar);
  const firstName = c.name.split(' ')[0];

  const sections = [
    { key: 'main', label: 'Main Hook', text: posts.main },
    { key: 'short', label: 'Short Hook', text: posts.short },
    { key: 'product', label: 'Product Drop', text: posts.product },
    { key: 'thread', label: 'Thread', text: posts.thread },
  ];
  if (posts.media) sections.push({ key: 'media', label: 'Media Drop', text: posts.media });

  const tabs = sections.map((s, i) => `
          <button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${s.key}" onclick="switchTab('${c.id}','${s.key}')" style="--accent:${accent}">${s.label}</button>`).join('') +
    `<button class="tab-btn design-tab" data-tab="design" onclick="switchTab('${c.id}','design')" style="--accent:${accent}">✨ Design Card</button>`;

  const panels = sections.map((s, i) => `
          <div class="tab-panel${i === 0 ? ' active' : ''}" id="panel-${c.id}-${s.key}">
            <textarea id="post-${c.id}-${s.key}" readonly style="white-space:pre-wrap;" onclick="this.select()">${escapeHtml(s.text)}</textarea>
            <div class="post-actions">
              <button class="copy-btn" onclick="copyPost('${c.id}','${s.key}')">Copy Text</button>
              <a class="x-btn" href="${xShareUrl(s.text, apiUrl)}" target="_blank" rel="noreferrer">Open in X</a>
              <button class="card-btn" onclick="previewDesign('${c.id}','${s.key}')">Preview Card</button>
              <span class="char-count" id="count-${c.id}-${s.key}">${s.text.length} chars</span>
            </div>
          </div>`).join('') + `
          <div class="tab-panel" id="panel-${c.id}-design">
            <div class="design-card" id="design-${c.id}" style="--primary:${primary};--accent:${accent}">
              <div class="design-header">
                <div class="design-avatar-placeholder" style="background: linear-gradient(135deg, ${primary}, ${accent}); color: #fff;"><span>${escapeHtml(c.name[0].toUpperCase())}</span></div>
                <div class="design-meta">
                  <div class="design-name">${escapeHtml(c.name)} ${c.emoji || ''}</div>
                  <div class="design-handle">${escapeHtml(c.handle)}</div>
                </div>
                <div class="design-time">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
              <div class="design-body" id="design-body-${c.id}">${escapeHtml(posts.main)}</div>
              ${media.length ? `
              <div class="design-media">
                ${media.slice(0, 4).map(m => `<img src="${m}" crossorigin="anonymous" alt="" onerror="this.style.display='none'" />`).join('')}
              </div>` : ''}
              <div class="design-footer">
                <span class="design-cta">Copy the playbook → creatorplaybooks.netlify.app/api/creator?id=${c.id}&expand=all</span>
              </div>
              <div class="design-brand">CreatorPlaybooks · Mentor X Share Kit</div>
            </div>
            <div class="design-actions">
              <button class="copy-btn" onclick="copyCardImage('${c.id}')">📋 Copy Card Image</button>
              <button class="x-btn" onclick="downloadCard('${c.id}')">💾 Download Card</button>
              <span class="char-count">${primary}-to-${accent}</span>
            </div>
          </div>`;

  const mediaGrid = media.length ? `
        <div class="media-strip">
          ${media.map((m, i) => `<a href="${m}" target="_blank" rel="noreferrer" class="media-thumb" title="Media ${i + 1}"><img src="${m}" loading="lazy" alt="${c.name} media ${i + 1}" onerror="this.style.display='none'" /></a>`).join('')}
        </div>` : '';

  const links = productLinks.map(p => `<a href="${p.url}" target="_blank" rel="noreferrer" class="link-chip">${p.name}</a>`).join('') +
    `<a href="${xUrl}" target="_blank" rel="noreferrer" class="link-chip x-chip">X / ${c.handle}</a>` +
    `<a href="${apiUrl}" target="_blank" rel="noreferrer" class="link-chip api-chip">API Bundle</a>`;

  return `
  <article class="mentor-card" data-id="${c.id}" data-name="${escapeHtml(c.name.toLowerCase())}" data-handle="${escapeHtml(c.handle.toLowerCase())}" data-category="${c.category || ''}" data-tags="${tags.join(' ')}" data-first="${firstName.toLowerCase()}" style="--primary:${primary};--secondary:${secondary};--accent:${accent}">
    <div class="card-glow"></div>
    <div class="card-topbar"></div>
    <div class="card-header">
      <img class="card-avatar" src="${avatar}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="this.src='https://unavatar.io/twitter/${c.xHandle}'" />
      <div class="card-meta">
        <h2>${escapeHtml(c.name)} ${c.emoji || ''}</h2>
        <p class="handle">${escapeHtml(c.handle)}</p>
        <div class="badges">
          <span class="pill followers">${c.followersStr}</span>
          <span class="pill category">${c.category || 'mentor'}</span>
          ${c.status === 'verified' ? '<span class="pill verified">Verified</span>' : ''}
        </div>
      </div>
    </div>
    <p class="bio">${escapeHtml(oneLine(c.bio || ''))}</p>
    ${tags.length ? `<div class="tags">${tags.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    <div class="post-tabs">
      <div class="tab-list">${tabs}</div>
      ${panels}
    </div>
    ${mediaGrid}
    <div class="link-row">${links}</div>
  </article>`;
}

const categories = [...new Set(creators.map(c => c.category).filter(Boolean))];
const categoryOptions = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c.replace(/-/g, ' '))}</option>`).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mentor X Share Kit — CreatorPlaybooks</title>
  <meta name="description" content="Ready-to-paste X posts, hooks, media assets, and links for every CreatorPlaybooks mentor." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <script src="https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.min.js"></script>
  <style>
    :root {
      --bg: #05050a;
      --surface: #0b0b14;
      --surface-2: #111120;
      --surface-3: #17172a;
      --text: #f2f2f7;
      --muted: #8b8ba7;
      --border: rgba(255,255,255,0.08);
      --radius: 18px;
      --radius-sm: 10px;
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      --sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      --ease: cubic-bezier(0.16, 1, 0.3, 1);
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: var(--sans); }
    body {
      background:
        radial-gradient(circle at 10% 0%, rgba(34,211,238,0.12) 0%, transparent 35%),
        radial-gradient(circle at 90% 100%, rgba(236,72,153,0.1) 0%, transparent 35%),
        var(--bg);
      min-height: 100vh;
      padding-bottom: 80px;
    }
    .container { width: min(1280px, 92%); margin: 0 auto; }
    header { padding: 48px 0 28px; text-align: center; }
    .eyebrow { display: inline-flex; align-items: center; gap: 8px; font: 600 12px var(--mono); letter-spacing: 0.12em; text-transform: uppercase; color: #22d3ee; margin-bottom: 12px; }
    .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 12px #22d3ee; animation: pulse 1.8s infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }
    h1 { font: 800 48px/1.05 var(--sans); margin: 0; letter-spacing: -0.03em; background: linear-gradient(90deg, #fff, #a5f3fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: var(--muted); font-size: 17px; max-width: 620px; margin: 14px auto 0; line-height: 1.55; }
    .controls { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin: 32px 0 24px; }
    .controls input, .controls select, .controls button {
      background: var(--surface-2); border: 1px solid var(--border); color: var(--text);
      padding: 12px 16px; border-radius: var(--radius-sm); font: 500 14px var(--sans); outline: none;
      transition: border-color .2s var(--ease), box-shadow .2s var(--ease);
    }
    .controls input { min-width: 260px; }
    .controls input:focus, .controls select:focus { border-color: #22d3ee; box-shadow: 0 0 0 3px rgba(34,211,238,0.12); }
    .controls button { cursor: pointer; background: linear-gradient(135deg, #22d3ee, #0ea5e9); border: none; color: #000; font-weight: 700; }
    .controls button:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(34,211,238,0.25); }
    .stats { text-align: center; color: var(--muted); font-size: 14px; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 24px; }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } h1 { font-size: 34px; } }
    .mentor-card {
      position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 22px; overflow: hidden; transition: transform .25s var(--ease), box-shadow .25s var(--ease), border-color .25s var(--ease);
    }
    .mentor-card:hover { transform: translateY(-3px); border-color: var(--accent); box-shadow: 0 18px 44px rgba(0,0,0,0.45), 0 0 0 1px var(--accent); }
    .card-glow {
      position: absolute; inset: 0; opacity: 0.06; pointer-events: none;
      background: radial-gradient(circle at 50% 0%, var(--primary), transparent 60%);
    }
    .card-topbar { height: 4px; width: 100%; position: absolute; top: 0; left: 0; background: linear-gradient(90deg, var(--primary), var(--accent)); }
    .card-header { display: flex; gap: 16px; align-items: center; margin-bottom: 14px; position: relative; z-index: 1; }
    .card-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); box-shadow: 0 0 18px color-mix(in srgb, var(--primary) 50%, transparent); }
    .card-meta h2 { margin: 0; font: 700 22px var(--sans); }
    .handle { margin: 4px 0 8px; color: var(--muted); font-size: 14px; }
    .badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .pill { font: 600 11px var(--mono); padding: 5px 10px; border-radius: 999px; background: var(--surface-3); border: 1px solid var(--border); color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
    .pill.followers { color: #fff; background: color-mix(in srgb, var(--accent) 22%, var(--surface-3)); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
    .pill.verified { color: #22d3ee; border-color: rgba(34,211,238,0.35); }
    .bio { color: #cfcfe3; font-size: 14px; line-height: 1.55; margin: 0 0 14px; position: relative; z-index: 1; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; position: relative; z-index: 1; }
    .tag { font: 500 12px var(--mono); color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, var(--surface-2)); border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent); padding: 4px 9px; border-radius: 6px; }
    .post-tabs { position: relative; z-index: 1; }
    .tab-list { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
    .tab-btn { background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); padding: 8px 12px; border-radius: 8px; font: 600 12px var(--sans); cursor: pointer; transition: all .2s var(--ease); }
    .tab-btn:hover { color: var(--text); border-color: var(--accent); }
    .tab-btn.active { background: color-mix(in srgb, var(--accent) 18%, var(--surface-3)); color: #fff; border-color: var(--accent); box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 25%, transparent); }
    .tab-btn.design-tab { border-color: rgba(139,92,246,0.35); color: #c4b5fd; }
    .tab-btn.design-tab.active { background: color-mix(in srgb, #8b5cf6 18%, var(--surface-3)); border-color: #8b5cf6; color: #fff; box-shadow: 0 0 14px rgba(139,92,246,0.25); }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; animation: fade .25s var(--ease); }
    @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    textarea { width: 100%; min-height: 220px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: #e9e9f5; font: 500 14.5px/1.65 var(--sans); padding: 16px; resize: vertical; outline: none; white-space: pre-wrap; }
    textarea:focus { border-color: var(--accent); }
    .post-actions, .design-actions { display: flex; gap: 10px; align-items: center; margin-top: 10px; flex-wrap: wrap; }
    .copy-btn, .x-btn, .card-btn { font: 600 12px var(--sans); padding: 8px 14px; border-radius: 8px; cursor: pointer; text-decoration: none; transition: transform .15s var(--ease), box-shadow .15s var(--ease); border: none; }
    .copy-btn { background: #fff; color: #000; }
    .copy-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(255,255,255,0.18); }
    .x-btn { background: #000; color: #fff; border: 1px solid #333; }
    .x-btn:hover { border-color: #fff; transform: translateY(-1px); }
    .card-btn { background: var(--surface-3); color: #fff; border: 1px solid var(--border); }
    .card-btn:hover { border-color: var(--accent); color: #fff; transform: translateY(-1px); }
    .char-count { margin-left: auto; font: 500 12px var(--mono); color: var(--muted); }
    .media-strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 8px; margin-top: 16px; position: relative; z-index: 1; }
    .media-thumb { border-radius: 10px; overflow: hidden; border: 1px solid var(--border); height: 88px; display: block; transition: transform .2s var(--ease), border-color .2s var(--ease); }
    .media-thumb:hover { transform: scale(1.03); border-color: var(--accent); }
    .media-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .link-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; position: relative; z-index: 1; }
    .link-chip { font: 600 12px var(--sans); padding: 7px 12px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); text-decoration: none; transition: all .2s var(--ease); }
    .link-chip:hover { background: var(--surface-3); border-color: var(--accent); color: #fff; }
    .link-chip.x-chip { border-color: rgba(34,211,238,0.3); color: #22d3ee; }
    .link-chip.api-chip { border-color: rgba(139,92,246,0.35); color: #c4b5fd; }

    .design-card {
      position: relative; background: linear-gradient(180deg, var(--surface-2), var(--surface));
      border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.35);
      overflow: hidden; text-align: left;
    }
    .design-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }
    .design-header { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
    .design-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); }
    .design-avatar-placeholder { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font: 700 18px var(--sans); border: 2px solid var(--primary); box-shadow: 0 0 14px color-mix(in srgb, var(--primary) 40%, transparent); }
    .design-avatar-placeholder span { text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
    .design-meta { flex: 1; }
    .design-name { font: 700 15px var(--sans); color: #fff; }
    .design-handle { font: 500 13px var(--sans); color: var(--muted); }
    .design-time { font: 500 12px var(--sans); color: var(--muted); }
    .design-body { font: 500 15px/1.62 var(--sans); color: #e9e9f5; white-space: pre-wrap; word-break: break-word; margin-bottom: 14px; }
    .design-media { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
    .design-media img { width: 100%; height: 160px; object-fit: cover; display: block; background: var(--surface-3); }
    .design-media img:only-child { grid-column: 1 / -1; }
    .design-footer { border-top: 1px solid var(--border); padding-top: 12px; }
    .design-cta { font: 500 13px var(--sans); color: var(--accent); }
    .design-brand { font: 600 10px var(--mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-top: 14px; }

    .empty { text-align: center; color: var(--muted); padding: 60px 0; font-size: 16px; }
    .toast {
      position: fixed; bottom: 24px; right: 24px; background: #111; color: #fff; border: 1px solid #333;
      padding: 12px 18px; border-radius: 12px; font-weight: 600; box-shadow: 0 14px 40px rgba(0,0,0,0.6);
      opacity: 0; transform: translateY(10px); pointer-events: none; transition: all .25s var(--ease); z-index: 100;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    footer { text-align: center; color: var(--muted); padding: 50px 0 30px; font-size: 13px; }
    footer a { color: #22d3ee; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="eyebrow"><span class="live-dot"></span>Agent-Ready Sharing Kit</div>
      <h1>Mentor X Share Kit</h1>
      <p class="subtitle">Ready-to-paste X posts, hooks, media assets, and external links for every CreatorPlaybooks mentor. ASCII-clean for select-all + paste. Preview, copy, or download each post as a designed card.</p>
    </header>

    <div class="controls">
      <input type="text" id="search" placeholder="Search mentors, handles, tags, or first name..." oninput="filterCards()" />
      <select id="category" onchange="filterCards()">
        <option value="">All categories</option>
        ${categoryOptions}
      </select>
      <button onclick="copyAllMainPosts()">Copy All Main Posts</button>
    </div>

    <p class="stats" id="stats">Loading ${creators.length} mentors...</p>

    <main class="grid" id="grid">
      ${creators.map((c, i) => cardHTML(c, i)).join('')}
    </main>

    <footer>
      <p>Generated from <a href="https://creatorplaybooks.netlify.app" target="_blank" rel="noreferrer">CreatorPlaybooks</a> · Live API: <code>/api/creator?id=&lt;mentor&gt;&expand=all</code></p>
    </footer>
  </div>

  <div class="toast" id="toast">Copied to clipboard</div>

  <script>
    const creators = ${JSON.stringify(creators.map(c => ({ id: c.id, handle: c.handle, xHandle: c.xHandle })))};

    function getCard(id) {
      return document.querySelector('.mentor-card[data-id="' + id + '"]');
    }

    function activePostKey(id) {
      const card = getCard(id);
      const active = card && card.querySelector('.tab-panel.active');
      if (!active) return 'main';
      if (active.id.endsWith('-design')) return 'main';
      const m = active.id.match(/panel-[^-]+-(.+)/);
      return m && m[1] ? m[1] : 'main';
    }

      function switchTab(id, key) {
        const card = getCard(id);
        if (!card) return;
        card.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
        card.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id + '-' + key));
      }

      function previewDesign(id, key) {
        const body = document.getElementById('design-body-' + id);
        const textarea = document.getElementById('post-' + id + '-' + key);
        if (body && textarea) {
          body.textContent = textarea.value;
        }
        switchTab(id, 'design');
      }

    async function copyCardImage(id) {
      const node = document.getElementById('design-' + id);
      try {
        const blob = await htmlToImage.toBlob(node, { pixelRatio: 2, backgroundColor: '#0b0b14' });
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('Card image copied — paste into X');
      } catch (e) {
        showToast('Could not copy image. Try Download instead.');
        console.error(e);
      }
    }

    async function downloadCard(id) {
      const node = document.getElementById('design-' + id);
      const name = getCard(id).dataset.name.replace(/\s+/g, '-');
      try {
        const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2, backgroundColor: '#0b0b14' });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'creatorplaybooks-' + name + '-x-card.png';
        a.click();
        showToast('Card downloaded');
      } catch (e) {
        showToast('Download failed');
        console.error(e);
      }
    }

    function copyAllMainPosts() {
      const posts = [];
      document.querySelectorAll('textarea[id^="post-"][id$="-main"]').forEach(t => {
        const id = t.id.replace('post-', '').replace('-main', '');
        const c = creators.find(x => x.id === id);
        posts.push('— ' + (c ? c.handle : id) + ' —\n' + t.value);
      });
      navigator.clipboard.writeText(posts.join('\n\n')).then(() => showToast('All main posts copied'));
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2200);
    }

    function copyPost(id, key) {
      const textarea = document.getElementById('post-' + id + '-' + key);
      if (textarea) {
        navigator.clipboard.writeText(textarea.value).then(() => {
          showToast('Post copied to clipboard');
        });
      }
    }

    function filterCards() {
      const q = document.getElementById('search').value.toLowerCase().trim();
      const cat = document.getElementById('category').value;
      let visible = 0;
      document.querySelectorAll('.mentor-card').forEach(card => {
        const matchesQ = !q || card.dataset.name.includes(q) || card.dataset.handle.includes(q) || card.dataset.tags.includes(q) || card.dataset.first.includes(q);
        const matchesCat = !cat || card.dataset.category === cat;
        const show = matchesQ && matchesCat;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      document.getElementById('stats').textContent = visible + ' mentor' + (visible === 1 ? '' : 's') + ' visible';
    }

    // Bind all interactive handlers to window scope
    window.switchTab = switchTab;
    window.previewDesign = previewDesign;
    window.copyPost = copyPost;
    window.copyCardImage = copyCardImage;
    window.downloadCard = downloadCard;
    window.copyAllMainPosts = copyAllMainPosts;
    window.filterCards = filterCards;

    filterCards();
  </script>
</body>
</html>`;

fs.writeFileSync(outPath, html, 'utf8');
console.log(`Wrote ${outPath} (${(html.length / 1024).toFixed(1)} KB) with ${creators.length} mentors.`);
