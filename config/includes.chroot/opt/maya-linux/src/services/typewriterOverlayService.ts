import { TypewriterOverlayItem, ImageOverlayItem } from '../types/models';

export interface BrandAssetPreset {
  id: string;
  name: string;
  category: 'logo' | 'seal' | 'badge' | 'heading';
  imageUrl: string;
  defaultPosition: { x: number; y: number };
  defaultScale: number;
  isCircular?: boolean;
  borderHex?: string;
  glowColor?: string;
}

export const BRAND_ASSET_PRESETS: BrandAssetPreset[] = [
  {
    id: 'zoth-navbar-logo',
    name: 'Zoth Studio Navbar Logo',
    category: 'logo',
    imageUrl: './assets/branding/zoth-navbar-logo-nobg.png',
    defaultPosition: { x: 0.18, y: 0.08 },
    defaultScale: 0.48,
    glowColor: 'rgba(0, 240, 255, 0.4)',
  },
  {
    id: 'azoth-master-seal',
    name: 'Azoth Master Sovereign Seal',
    category: 'seal',
    imageUrl: './assets/branding/azoth-master-seal-nobg.png',
    defaultPosition: { x: 0.88, y: 0.82 },
    defaultScale: 0.35,
    isCircular: true,
    borderHex: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
  },
  {
    id: 'azoth-master-portrait',
    name: 'Azoth Master Avatar (Classic)',
    category: 'seal',
    imageUrl: './assets/branding/azoth-master.jpg',
    defaultPosition: { x: 0.08, y: 0.88 },
    defaultScale: 0.22,
    isCircular: true,
    borderHex: '#e8c872',
    glowColor: 'rgba(232, 200, 114, 0.5)',
  },
  {
    id: 'heading-01-webgen',
    name: 'Transition: WebGen Terminal',
    category: 'heading',
    imageUrl: './assets/branding/heading-01-webgen-intro.png',
    defaultPosition: { x: 0.5, y: 0.18 },
    defaultScale: 0.65,
    glowColor: 'rgba(0, 240, 255, 0.5)',
  },
  {
    id: 'heading-02-hermes',
    name: 'Transition: Hermes 3 & AGY',
    category: 'heading',
    imageUrl: './assets/branding/heading-02-hermes-agy.png',
    defaultPosition: { x: 0.5, y: 0.18 },
    defaultScale: 0.65,
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  {
    id: 'heading-03-workbot',
    name: 'Transition: Workbot Eye Stream',
    category: 'heading',
    imageUrl: './assets/branding/heading-03-workbot-vision.png',
    defaultPosition: { x: 0.5, y: 0.18 },
    defaultScale: 0.65,
    glowColor: 'rgba(52, 211, 153, 0.5)',
  },
  {
    id: 'heading-04-workstation',
    name: 'Transition: Live Workstation Launch',
    category: 'heading',
    imageUrl: './assets/branding/heading-04-live-workstation.png',
    defaultPosition: { x: 0.5, y: 0.18 },
    defaultScale: 0.65,
    glowColor: 'rgba(251, 191, 36, 0.5)',
  },
  {
    id: 'heading-05-airgap',
    name: 'Transition: Sovereign Airgap Foundry',
    category: 'heading',
    imageUrl: './assets/branding/heading-05-sovereign-airgap.png',
    defaultPosition: { x: 0.5, y: 0.18 },
    defaultScale: 0.65,
    glowColor: 'rgba(244, 63, 94, 0.5)',
  },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function drawTypewriterOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  typewriters: TypewriterOverlayItem[] | undefined,
  sourceTime: number
) {
  if (!typewriters || typewriters.length === 0) return;

  for (const item of typewriters) {
    if (sourceTime < item.startTime || sourceTime > item.startTime + item.duration) continue;

    const elapsed = sourceTime - item.startTime;
    const remaining = item.startTime + item.duration - sourceTime;

    let alpha = 1.0;
    let scale = 1.0;
    let translateY = 0;

    if (elapsed < 0.2) {
      const t = elapsed / 0.2;
      alpha = t;
      scale = 0.92 + 0.08 * t;
      translateY = 12 * (1 - t);
    } else if (remaining < 0.25) {
      const t = remaining / 0.25;
      alpha = t;
      translateY = -8 * (1 - t);
    }

    const cps = item.typingSpeedCps || 24;
    const totalChars = item.text.length;
    const charsToShow = Math.min(totalChars, Math.floor(elapsed * cps));
    const textToDraw = item.text.substring(0, charsToShow);
    const isTyping = charsToShow < totalChars;

    const cursorChar = item.cursorChar || '█';
    const showCursor = item.showCursor !== false && (isTyping || Math.floor(elapsed * 3) % 2 === 0);

    const x = item.position.x * width;
    const y = item.position.y * height + translateY;
    const fontSize = item.fontSize || 32;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (item.style === 'stroke-typewriter') {
      ctx.font = `800 ${fontSize}px "IBM Plex Mono", "Liberation Mono", Hack, monospace`;
      ctx.textAlign = item.align || 'center';
      ctx.textBaseline = 'middle';

      const fullText = textToDraw + (showCursor ? cursorChar : '');

      ctx.lineWidth = item.strokeWidth || Math.max(5, fontSize * 0.18);
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeStyle = item.strokeColor || '#000000';

      ctx.shadowColor = item.glowColor || item.accentColor || 'rgba(0, 240, 255, 0.7)';
      ctx.shadowBlur = item.glowRadius || 14;

      ctx.strokeText(fullText, 0, 0);

      ctx.shadowBlur = 0;
      ctx.fillStyle = item.textColor || '#FFFFFF';
      ctx.fillText(fullText, 0, 0);

      if (item.subtitle && charsToShow >= totalChars * 0.6) {
        const subAlpha = Math.min(1, (charsToShow - totalChars * 0.6) / (totalChars * 0.4));
        ctx.save();
        ctx.globalAlpha = alpha * subAlpha;
        ctx.font = `600 ${Math.round(fontSize * 0.58)}px Inter, sans-serif`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(item.subtitle, 0, fontSize * 0.95);
        ctx.fillStyle = item.accentColor || '#38BDF8';
        ctx.fillText(item.subtitle, 0, fontSize * 0.95);
        ctx.restore();
      }

      if (item.tag) {
        ctx.save();
        ctx.font = `700 ${Math.round(fontSize * 0.42)}px "IBM Plex Mono", monospace`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(item.tag, 0, -fontSize * 0.85);
        ctx.fillStyle = item.accentColor || '#FBBF24';
        ctx.fillText(item.tag, 0, -fontSize * 0.85);
        ctx.restore();
      }
    } else if (item.style === 'cyber-glass') {
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      const fullText = textToDraw + (showCursor ? cursorChar : '');
      const measuredW = ctx.measureText(fullText).width;
      const cardW = Math.max(340, measuredW + 48);
      const cardH = (item.subtitle ? fontSize * 2.8 : fontSize * 1.6) + 32;

      const halfW = cardW / 2;
      const halfH = cardH / 2;

      ctx.fillStyle = item.bgHex || 'rgba(5, 8, 18, 0.88)';
      ctx.strokeStyle = item.accentColor || '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = item.glowColor || 'rgba(0, 240, 255, 0.4)';
      ctx.shadowBlur = 18;

      drawRoundedRect(ctx, -halfW, -halfH, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = item.accentColor || '#00f0ff';
      ctx.fillRect(-halfW + 6, -halfH + 6, 8, 2);
      ctx.fillRect(-halfW + 6, -halfH + 6, 2, 8);
      ctx.fillRect(halfW - 14, -halfH + 6, 8, 2);
      ctx.fillRect(halfW - 8, -halfH + 6, 2, 8);

      if (item.tag) {
        ctx.font = `700 ${Math.round(fontSize * 0.4)}px "IBM Plex Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillStyle = item.accentColor || '#00f0ff';
        ctx.fillText(item.tag, -halfW + 20, -halfH + 24);
      }

      ctx.font = `800 ${fontSize}px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = item.textColor || '#FFFFFF';
      ctx.fillText(fullText, -halfW + 20, item.tag ? -halfH + 52 : 0);

      if (item.subtitle) {
        ctx.font = `500 ${Math.round(fontSize * 0.48)}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
        ctx.fillText(item.subtitle, -halfW + 20, -halfH + 82);
      }
    } else if (item.style === 'alchemical-gold') {
      ctx.font = `800 ${fontSize}px "Fraunces", "Syne", Georgia, serif`;
      ctx.textAlign = item.align || 'center';
      ctx.textBaseline = 'middle';

      const fullText = textToDraw + (showCursor ? ' ⚡' : '');

      ctx.lineWidth = Math.max(5, fontSize * 0.16);
      ctx.strokeStyle = 'rgba(10, 8, 5, 0.9)';
      ctx.strokeText(fullText, 0, 0);

      ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = item.accentColor || '#fbbf24';
      ctx.fillText(fullText, 0, 0);

      if (item.subtitle) {
        ctx.shadowBlur = 6;
        ctx.font = `700 ${Math.round(fontSize * 0.5)}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = '#fef08a';
        ctx.fillText(item.subtitle, 0, fontSize * 0.9);
      }
    } else if (item.style === 'terminal-prompt') {
      ctx.font = `700 ${fontSize}px "IBM Plex Mono", Hack, monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const promptPrefix = '$ zoth-terminal · ';
      const prefixW = ctx.measureText(promptPrefix).width;
      const fullText = textToDraw + (showCursor ? '█' : '');
      const totalW = prefixW + ctx.measureText(fullText).width + 36;
      const totalH = fontSize * 1.8;

      ctx.fillStyle = 'rgba(3, 4, 8, 0.92)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, -totalW / 2, -totalH / 2, totalW, totalH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.fillText(promptPrefix, -totalW / 2 + 16, 0);

      ctx.fillStyle = item.textColor || '#FFFFFF';
      ctx.fillText(fullText, -totalW / 2 + 16 + prefixW, 0);
    } else {
      ctx.font = `900 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = item.align || 'center';
      ctx.textBaseline = 'middle';

      const fullText = textToDraw + (showCursor ? cursorChar : '');

      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;

      ctx.fillStyle = item.textColor || '#FFFFFF';
      ctx.fillText(fullText, 0, 0);

      if (item.subtitle) {
        ctx.font = `600 ${Math.round(fontSize * 0.52)}px Inter, sans-serif`;
        ctx.fillStyle = item.accentColor || '#94A3B8';
        ctx.fillText(item.subtitle, 0, fontSize * 0.95);
      }
    }

    ctx.restore();
  }
}

export function drawImageOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  imageOverlays: ImageOverlayItem[] | undefined,
  sourceTime: number,
  loadedImagesMap: Map<string, HTMLImageElement>
) {
  if (!imageOverlays || imageOverlays.length === 0) return;

  for (const item of imageOverlays) {
    if (sourceTime < item.startTime || sourceTime > item.startTime + item.duration) continue;

    const img = loadedImagesMap.get(item.imageUrl);
    if (!img || !img.complete || img.naturalWidth === 0) continue;

    const elapsed = sourceTime - item.startTime;
    const remaining = item.startTime + item.duration - sourceTime;

    let scaleMult = 1.0;
    let opacity = item.opacity ?? 1.0;
    let rotation = (item.rotation || 0) * (Math.PI / 180);
    let offsetY = 0;
    let offsetX = 0;

    if (item.animation === 'fade') {
      if (elapsed < 0.25) opacity *= (elapsed / 0.25);
      else if (remaining < 0.25) opacity *= (remaining / 0.25);
    } else if (item.animation === 'pop') {
      if (elapsed < 0.15) {
        scaleMult = 0.5 + (elapsed / 0.15) * 0.65;
      } else if (elapsed < 0.25) {
        scaleMult = 1.15 - ((elapsed - 0.15) / 0.10) * 0.15;
      }
      if (remaining < 0.2) opacity *= (remaining / 0.2);
    } else if (item.animation === 'float') {
      offsetY = Math.sin(elapsed * 2.2) * 10;
    } else if (item.animation === 'pulse') {
      scaleMult = 1.0 + Math.sin(elapsed * 4.5) * 0.06;
    } else if (item.animation === 'spin') {
      rotation += elapsed * 0.8;
    } else if (item.animation === 'slide-in') {
      if (elapsed < 0.25) {
        const t = elapsed / 0.25;
        offsetX = -80 * (1 - t);
        opacity *= t;
      }
    }

    const x = item.position.x * width + offsetX;
    const y = item.position.y * height + offsetY;

    const baseScale = item.scale || 1.0;
    const finalScale = baseScale * scaleMult;
    const targetW = img.naturalWidth * finalScale;
    const targetH = img.naturalHeight * finalScale;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

    if (item.blendMode && item.blendMode !== 'normal') {
      ctx.globalCompositeOperation = item.blendMode;
    }

    ctx.translate(x, y);
    ctx.rotate(rotation);

    if (item.glowColor) {
      ctx.shadowColor = item.glowColor;
      ctx.shadowBlur = item.glowRadius || 20;
    }

    if (item.isCircularAvatar) {
      const radius = Math.min(targetW, targetH) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      ctx.restore();

      if (item.borderHex) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = item.borderHex;
        ctx.lineWidth = item.borderWidth || 3;
        ctx.stroke();
      }
    } else {
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);

      if (item.borderHex) {
        ctx.strokeStyle = item.borderHex;
        ctx.lineWidth = item.borderWidth || 2;
        ctx.strokeRect(-targetW / 2, -targetH / 2, targetW, targetH);
      }
    }

    ctx.restore();
  }
}
