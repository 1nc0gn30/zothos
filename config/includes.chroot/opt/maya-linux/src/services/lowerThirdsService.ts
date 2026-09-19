import { TextOverlay, BadgeStyle, LowerThirdPreset } from '../types/models';

export type { LowerThirdPreset };

export type LowerThirdTheme = 'indigo' | 'emerald' | 'crimson' | 'amber' | 'cyan' | 'violet' | 'glass';

export interface LowerThirdThemeConfig {
  id: LowerThirdTheme;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  accent: string;
  textColor: string;
  subtextColor: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  pillBg: string;
}

export const LOWER_THIRD_THEMES: Record<LowerThirdTheme, LowerThirdThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Electric Indigo',
    gradientStart: '#6366F1',
    gradientEnd: '#8B5CF6',
    accent: '#A5B4FC',
    textColor: '#FFFFFF',
    subtextColor: '#C7D2FE',
    badgeBg: 'rgba(99, 102, 241, 0.25)',
    borderColor: 'rgba(165, 180, 252, 0.35)',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    pillBg: 'rgba(15, 23, 42, 0.88)',
  },
  emerald: {
    id: 'emerald',
    name: 'Mint Emerald',
    gradientStart: '#10B981',
    gradientEnd: '#0D9488',
    accent: '#6EE7B7',
    textColor: '#FFFFFF',
    subtextColor: '#A7F3D0',
    badgeBg: 'rgba(16, 185, 129, 0.25)',
    borderColor: 'rgba(110, 231, 183, 0.35)',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    pillBg: 'rgba(6, 30, 23, 0.88)',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Rose',
    gradientStart: '#F43F5E',
    gradientEnd: '#E11D48',
    accent: '#FDA4AF',
    textColor: '#FFFFFF',
    subtextColor: '#FECDD3',
    badgeBg: 'rgba(244, 63, 94, 0.25)',
    borderColor: 'rgba(253, 164, 175, 0.35)',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    pillBg: 'rgba(35, 10, 20, 0.88)',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    gradientStart: '#F59E0B',
    gradientEnd: '#EA580C',
    accent: '#FDE68A',
    textColor: '#FFFFFF',
    subtextColor: '#FEF3C7',
    badgeBg: 'rgba(245, 158, 11, 0.25)',
    borderColor: 'rgba(253, 230, 138, 0.35)',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    pillBg: 'rgba(30, 20, 8, 0.88)',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    gradientStart: '#06B6D4',
    gradientEnd: '#2563EB',
    accent: '#A5F3FC',
    textColor: '#FFFFFF',
    subtextColor: '#BAE6FD',
    badgeBg: 'rgba(6, 182, 212, 0.25)',
    borderColor: 'rgba(165, 243, 252, 0.35)',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    pillBg: 'rgba(8, 25, 40, 0.88)',
  },
  violet: {
    id: 'violet',
    name: 'Ultra Violet',
    gradientStart: '#8B5CF6',
    gradientEnd: '#D946EF',
    accent: '#F5D0FE',
    textColor: '#FFFFFF',
    subtextColor: '#E9D5FF',
    badgeBg: 'rgba(139, 92, 246, 0.25)',
    borderColor: 'rgba(245, 208, 254, 0.35)',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    pillBg: 'rgba(25, 12, 40, 0.88)',
  },
  glass: {
    id: 'glass',
    name: 'Obsidian Glass',
    gradientStart: '#334155',
    gradientEnd: '#0F172A',
    accent: '#94A3B8',
    textColor: '#F8FAFC',
    subtextColor: '#CBD5E1',
    badgeBg: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    pillBg: 'rgba(15, 23, 42, 0.85)',
  },
};

export interface LowerThirdPresetMeta {
  id: LowerThirdPreset;
  title: string;
  category: string;
  description: string;
  badge: string;
  defaultPrimary: string;
  defaultSecondary: string;
  defaultTag: string;
  defaultTheme: LowerThirdTheme;
  defaultIcon: 'user' | 'microphone' | 'sparkles' | 'code' | 'star' | 'rocket' | 'shield' | 'check';
  defaultSocialPlatform?: 'youtube' | 'github' | 'twitter' | 'generic';
}

export const LOWER_THIRD_PRESET_METAS: LowerThirdPresetMeta[] = [
  {
    id: 'speaker-pill',
    title: 'Speaker & Keynote Pill',
    category: 'Broadcast / Keynote',
    description: 'Modern gradient pill with Avatar icon, Primary Speaker Name, and Subtitle Role & Company.',
    badge: 'Gradient Pill • Avatar',
    defaultPrimary: 'Alex Rivera',
    defaultSecondary: 'Chief Product Architect • Maya Labs',
    defaultTag: 'SPEAKER',
    defaultTheme: 'indigo',
    defaultIcon: 'user',
  },
  {
    id: 'tech-badge',
    title: 'Minimalist Glass Card',
    category: 'Product Demo / Tech',
    description: 'Frosted glass floating card with category tag, bold headline, and secondary technical spec.',
    badge: 'Frosted Glass • Category Tag',
    defaultPrimary: 'Zero-Latency WebGL Canvas',
    defaultSecondary: 'Real-time 60 FPS 4K compositing pipeline',
    defaultTag: 'NEW FEATURE',
    defaultTheme: 'emerald',
    defaultIcon: 'sparkles',
  },
  {
    id: 'social-cta',
    title: 'Channel & Repo CTA',
    category: 'Call to Action',
    description: 'Broadcast call-to-action bar with YouTube Subscribe / GitHub Star / Twitter follow badge.',
    badge: 'Social Bar • CTA Button',
    defaultPrimary: 'Maya Video Studio',
    defaultSecondary: 'Subscribe for weekly tutorials & releases',
    defaultTag: 'SUBSCRIBE',
    defaultTheme: 'crimson',
    defaultIcon: 'rocket',
    defaultSocialPlatform: 'youtube',
  },
  {
    id: 'launch-tag',
    title: 'SaaS Launch Ribbon & Price',
    category: 'Launch & Special Offer',
    description: 'Gradient SaaS Launch Ribbon with pricing tag, strikethrough discount, and product tier.',
    badge: 'Launch Ribbon • Price Tag',
    defaultPrimary: 'Maya Studio Pro Lifetime',
    defaultSecondary: 'All 3D Devices • 4K Export • No Watermark',
    defaultTag: 'LAUNCH SALE',
    defaultTheme: 'amber',
    defaultIcon: 'rocket',
  },
];

export interface LowerThirdOptions {
  primaryText?: string;
  secondaryText?: string;
  tagText?: string;
  avatarIcon?: 'user' | 'microphone' | 'sparkles' | 'code' | 'star' | 'rocket' | 'shield' | 'check' | 'zap';
  socialPlatform?: 'youtube' | 'github' | 'twitter' | 'generic';
  theme?: LowerThirdTheme;
  position?: { x: number; y: number };
  fontSize?: number;
  animationStyle?: 'slide-up' | 'scale-in' | 'bounce-in' | 'fade-slide';
  price?: string;
  originalPrice?: string;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
}

/**
 * Creates a fully configured TextOverlay ready to be placed on the video timeline.
 */
export function createLowerThirdOverlay(
  preset: LowerThirdPreset,
  options: LowerThirdOptions | string = {},
  startTime: number = 0,
  duration: number = 4.0
): TextOverlay {
  const opts: LowerThirdOptions = typeof options === 'string'
    ? { primaryText: options }
    : options;

  const meta = LOWER_THIRD_PRESET_METAS.find(p => p.id === preset) || LOWER_THIRD_PRESET_METAS[0];
  const themeKey = opts.theme || meta.defaultTheme;
  const themeConfig = LOWER_THIRD_THEMES[themeKey] || LOWER_THIRD_THEMES.indigo;

  // Default positions per preset
  let defaultPosition = { x: 0.22, y: 0.85 };
  if (preset === 'speaker-pill') {
    defaultPosition = { x: 0.24, y: 0.85 };
  } else if (preset === 'tech-badge') {
    defaultPosition = { x: 0.24, y: 0.84 };
  } else if (preset === 'social-cta') {
    defaultPosition = { x: 0.50, y: 0.86 };
  } else if (preset === 'launch-tag') {
    defaultPosition = { x: 0.50, y: 0.85 };
  }

  const primary = opts.primaryText ?? meta.defaultPrimary;
  const secondary = opts.secondaryText ?? meta.defaultSecondary;
  const tag = opts.tagText ?? meta.defaultTag;
  const icon = opts.avatarIcon ?? meta.defaultIcon;
  const social = opts.socialPlatform ?? (meta.defaultSocialPlatform || 'youtube');

  return {
    id: crypto.randomUUID(),
    startTime: Math.max(0, startTime),
    duration: Math.max(0.5, duration),
    text: primary,
    subtitle: secondary,
    tag,
    position: opts.position || defaultPosition,
    style: preset as BadgeStyle,
    lowerThirdPreset: preset,
    bgColor: opts.bgColor || themeConfig.gradientStart,
    textColor: opts.textColor || themeConfig.textColor,
    fontSize: opts.fontSize || (preset === 'speaker-pill' ? 22 : preset === 'tech-badge' ? 20 : 21),
    avatarIcon: icon,
    socialPlatform: social,
    theme: themeKey,
    animationStyle: opts.animationStyle || 'slide-up',
    accentColor: opts.accentColor || themeConfig.accent,
    price: opts.price ?? (preset === 'launch-tag' ? '$49' : undefined),
    originalPrice: opts.originalPrice ?? (preset === 'launch-tag' ? '$149' : undefined),
  };
}

/**
 * Procedural Canvas2D Drawing for Lower Thirds Overlay with Entrance / Exit Transitions
 */
export function drawLowerThirdOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlay: TextOverlay,
  sourceTime: number
): void {
  if (sourceTime < overlay.startTime || sourceTime > overlay.startTime + overlay.duration) {
    return;
  }

  const localTime = sourceTime - overlay.startTime;
  const totalDuration = overlay.duration;
  const introDuration = 0.55;
  const outroDuration = 0.40;

  // Compute animation progress
  let progressIn = 1.0;
  if (localTime < introDuration) {
    progressIn = easeOutBack(Math.max(0, Math.min(1, localTime / introDuration)));
  }

  let progressOut = 1.0;
  if (localTime > totalDuration - outroDuration) {
    const outT = (totalDuration - localTime) / outroDuration;
    progressOut = easeInCubic(Math.max(0, Math.min(1, outT)));
  }

  const alpha = Math.max(0, Math.min(1,
    (localTime < 0.25 ? localTime / 0.25 : 1) *
    (localTime > totalDuration - 0.3 ? (totalDuration - localTime) / 0.3 : 1)
  ));

  if (alpha <= 0.001) return;

  const animStyle = overlay.animationStyle || 'slide-up';
  let translateY = 0;
  let scale = 1.0;

  if (animStyle === 'slide-up') {
    translateY = (1 - progressIn) * 45 + (1 - progressOut) * 35;
    scale = (0.92 + 0.08 * progressIn) * (0.92 + 0.08 * progressOut);
  } else if (animStyle === 'scale-in') {
    scale = progressIn * progressOut;
  } else if (animStyle === 'bounce-in') {
    scale = easeOutBounce(Math.min(1, localTime / 0.65)) * progressOut;
  } else {
    // fade-slide
    translateY = (1 - progressIn) * 20;
    scale = 0.96 + 0.04 * progressIn;
  }

  const posX = overlay.position.x * width;
  const posY = overlay.position.y * height;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(posX, posY + translateY);
  ctx.scale(scale, scale);

  const themeKey = (overlay.theme as LowerThirdTheme) || 'indigo';
  const theme = LOWER_THIRD_THEMES[themeKey] || LOWER_THIRD_THEMES.indigo;
  const preset = overlay.lowerThirdPreset || (overlay.style as LowerThirdPreset) || 'speaker-pill';

  switch (preset) {
    case 'speaker-pill':
      drawSpeakerPill(ctx, width, height, overlay, theme, localTime);
      break;
    case 'tech-badge':
      drawTechBadge(ctx, width, height, overlay, theme, localTime);
      break;
    case 'social-cta':
      drawSocialCTA(ctx, width, height, overlay, theme, localTime);
      break;
    case 'launch-tag':
      drawLaunchTag(ctx, width, height, overlay, theme, localTime);
      break;
    default:
      drawSpeakerPill(ctx, width, height, overlay, theme, localTime);
      break;
  }

  ctx.restore();
}

/**
 * 1. Speaker Pill Renderer
 */
function drawSpeakerPill(
  ctx: CanvasRenderingContext2D,
  _canvasW: number,
  _canvasH: number,
  overlay: TextOverlay,
  theme: LowerThirdThemeConfig,
  _localTime: number
) {
  const fontSize = overlay.fontSize || 22;
  const subFontSize = Math.max(12, Math.round(fontSize * 0.62));
  const tagFontSize = Math.max(10, Math.round(fontSize * 0.48));

  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  const nameMetrics = ctx.measureText(overlay.text || 'Speaker Name');
  const nameWidth = nameMetrics.width;

  ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
  const subMetrics = ctx.measureText(overlay.subtitle || '');
  const subWidth = subMetrics.width;

  const tagText = overlay.tag ? overlay.tag.toUpperCase() : '';
  let tagWidth = 0;
  if (tagText) {
    ctx.font = `700 ${tagFontSize}px Inter, -apple-system, sans-serif`;
    tagWidth = ctx.measureText(tagText).width + 16;
  }

  const avatarRadius = Math.round(fontSize * 0.95);
  const avatarDiameter = avatarRadius * 2;
  const textBlockWidth = Math.max(nameWidth, subWidth);
  const paddingX = 16;
  const paddingY = 12;

  const cardW = avatarDiameter + textBlockWidth + (tagWidth ? tagWidth + 14 : 0) + paddingX * 2.8;
  const cardH = Math.max(avatarDiameter + paddingY * 1.5, fontSize + subFontSize + paddingY * 2);
  const cornerR = cardH / 2;

  const originX = -cardW / 2;
  const originY = -cardH / 2;

  // Outer shadow & glow
  ctx.save();
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // Background Frosted Glass Pill
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.fillStyle = theme.pillBg;
  ctx.fill();
  ctx.restore();

  // Glass Specular Border
  ctx.save();
  const borderGrad = ctx.createLinearGradient(originX, originY, originX + cardW, originY + cardH);
  borderGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  borderGrad.addColorStop(0.5, theme.borderColor);
  borderGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.stroke();

  // Specular top highlight line
  ctx.beginPath();
  ctx.arc(originX + cornerR, originY + cornerR, cornerR - 1, Math.PI, Math.PI * 1.5);
  ctx.lineTo(originX + cardW - cornerR, originY + 1);
  ctx.arc(originX + cardW - cornerR, originY + cornerR, cornerR - 1, Math.PI * 1.5, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // Avatar Circle
  const avatarCenterX = originX + paddingX + avatarRadius;
  const avatarCenterY = originY + cardH / 2;

  ctx.save();
  const avatarGrad = ctx.createLinearGradient(
    avatarCenterX - avatarRadius,
    avatarCenterY - avatarRadius,
    avatarCenterX + avatarRadius,
    avatarCenterY + avatarRadius
  );
  avatarGrad.addColorStop(0, theme.gradientStart);
  avatarGrad.addColorStop(1, theme.gradientEnd);

  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = avatarGrad;
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Draw Icon inside Avatar
  drawVectorIcon(ctx, avatarCenterX, avatarCenterY, avatarRadius * 0.55, overlay.avatarIcon || 'user', '#FFFFFF');
  ctx.restore();

  // Text Content
  const textStartX = avatarCenterX + avatarRadius + 14;
  const hasSubtitle = !!overlay.subtitle;

  ctx.save();
  ctx.fillStyle = overlay.textColor || theme.textColor;
  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = hasSubtitle ? 'bottom' : 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  const textY = hasSubtitle ? originY + cardH / 2 - 1 : originY + cardH / 2;
  ctx.fillText(overlay.text || 'Speaker Name', textStartX, textY);

  if (hasSubtitle) {
    ctx.fillStyle = overlay.accentColor || theme.subtextColor;
    ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.shadowBlur = 0;
    ctx.fillText(overlay.subtitle!, textStartX, originY + cardH / 2 + 3);
  }
  ctx.restore();

  // Optional Tag / Live indicator on the right
  if (tagText) {
    const tagX = originX + cardW - paddingX - tagWidth;
    const tagH = tagFontSize + 10;
    const tagY = originY + (cardH - tagH) / 2;

    ctx.save();
    ctx.beginPath();
    drawRoundedRectPath(ctx, tagX, tagY, tagWidth, tagH, tagH / 2);
    ctx.fillStyle = theme.badgeBg;
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = theme.accent;
    ctx.font = `700 ${tagFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(tagText, tagX + tagWidth / 2, tagY + tagH / 2);
    ctx.restore();
  }
}

/**
 * 2. Tech Glass Card Renderer
 */
function drawTechBadge(
  ctx: CanvasRenderingContext2D,
  _canvasW: number,
  _canvasH: number,
  overlay: TextOverlay,
  theme: LowerThirdThemeConfig,
  localTime: number
) {
  const fontSize = overlay.fontSize || 20;
  const subFontSize = Math.max(12, Math.round(fontSize * 0.64));
  const tagFontSize = Math.max(10, Math.round(fontSize * 0.50));

  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  const titleWidth = ctx.measureText(overlay.text || '').width;

  ctx.font = `400 ${subFontSize}px Inter, -apple-system, sans-serif`;
  const subWidth = ctx.measureText(overlay.subtitle || '').width;

  const tagText = (overlay.tag || 'FEATURE').toUpperCase();
  ctx.font = `700 ${tagFontSize}px Inter, -apple-system, sans-serif`;
  const tagWidth = ctx.measureText(tagText).width + 24;

  const padding = 18;
  const contentWidth = Math.max(titleWidth, subWidth, tagWidth + 60);
  const cardW = contentWidth + padding * 2.6 + 12; // extra for accent bar
  const cardH = fontSize + subFontSize + tagFontSize + padding * 2.4;
  const cornerR = 14;

  const originX = -cardW / 2;
  const originY = -cardH / 2;

  // Drop Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;

  // Background Card
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
  ctx.fill();
  ctx.restore();

  // Glass Specular Border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.stroke();

  // Left Glowing Accent Bar
  const barW = 4.5;
  const barGrad = ctx.createLinearGradient(originX, originY, originX, originY + cardH);
  barGrad.addColorStop(0, theme.gradientStart);
  barGrad.addColorStop(1, theme.gradientEnd);

  ctx.beginPath();
  drawRoundedRectPath(ctx, originX + 2, originY + 6, barW, cardH - 12, 2.5);
  ctx.fillStyle = barGrad;
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();

  const textStartX = originX + padding + 12;
  let currentY = originY + padding;

  // Top Tag Pill
  const tagH = tagFontSize + 8;
  ctx.save();
  ctx.beginPath();
  drawRoundedRectPath(ctx, textStartX, currentY, tagWidth, tagH, 6);
  ctx.fillStyle = theme.badgeBg;
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Tag pulse dot
  const dotX = textStartX + 9;
  const dotY = currentY + tagH / 2;
  const pulseAlpha = 0.6 + 0.4 * Math.sin(localTime * 4);
  ctx.beginPath();
  ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = pulseAlpha;
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 6;
  ctx.fill();

  ctx.globalAlpha = 1.0;
  ctx.fillStyle = theme.accent;
  ctx.font = `700 ${tagFontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(tagText, textStartX + 18, currentY + tagH / 2 + 0.5);
  ctx.restore();

  currentY += tagH + 8;

  // Headline
  ctx.save();
  ctx.fillStyle = overlay.textColor || '#FFFFFF';
  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  ctx.fillText(overlay.text || '', textStartX, currentY);

  currentY += fontSize + 4;

  // Subtitle
  if (overlay.subtitle) {
    ctx.fillStyle = overlay.accentColor || theme.subtextColor;
    ctx.font = `400 ${subFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.shadowBlur = 0;
    ctx.fillText(overlay.subtitle, textStartX, currentY);
  }
  ctx.restore();
}

/**
 * 3. Social CTA Renderer
 */
function drawSocialCTA(
  ctx: CanvasRenderingContext2D,
  _canvasW: number,
  _canvasH: number,
  overlay: TextOverlay,
  theme: LowerThirdThemeConfig,
  localTime: number
) {
  const fontSize = overlay.fontSize || 21;
  const subFontSize = Math.max(12, Math.round(fontSize * 0.62));
  const platform = overlay.socialPlatform || 'youtube';

  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  const nameWidth = ctx.measureText(overlay.text || '').width;

  ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
  const subWidth = ctx.measureText(overlay.subtitle || '').width;

  // CTA Button styling per platform
  let ctaLabel = 'SUBSCRIBE';
  let ctaBg = '#EF4444';
  let ctaTextColor = '#FFFFFF';
  let iconType: any = 'youtube';

  if (platform === 'github') {
    ctaLabel = '★ STAR';
    ctaBg = '#F59E0B';
    iconType = 'github';
  } else if (platform === 'twitter') {
    ctaLabel = 'FOLLOW';
    ctaBg = '#0284C7';
    iconType = 'twitter';
  } else if (overlay.tag) {
    ctaLabel = overlay.tag.toUpperCase();
    ctaBg = theme.gradientStart;
  }

  const ctaFontSize = Math.max(11, Math.round(fontSize * 0.58));
  ctx.font = `800 ${ctaFontSize}px Inter, -apple-system, sans-serif`;
  const ctaTextWidth = ctx.measureText(ctaLabel).width;
  const ctaButtonWidth = ctaTextWidth + 28;
  const ctaButtonHeight = fontSize + 12;

  const iconRadius = Math.round(fontSize * 0.85);
  const iconDiameter = iconRadius * 2;
  const paddingX = 18;
  const paddingY = 12;

  const textBlockWidth = Math.max(nameWidth, subWidth);
  const cardW = iconDiameter + textBlockWidth + ctaButtonWidth + paddingX * 3.2;
  const cardH = Math.max(iconDiameter + paddingY * 2, fontSize + subFontSize + paddingY * 2.2);
  const cornerR = cardH / 2;

  const originX = -cardW / 2;
  const originY = -cardH / 2;

  // Card Background Glow & Glass
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;

  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
  ctx.fill();
  ctx.restore();

  // Glass Specular Stroke
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.stroke();
  ctx.restore();

  // Platform Icon Badge on the left
  const iconCenterX = originX + paddingX + iconRadius;
  const iconCenterY = originY + cardH / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(iconCenterX, iconCenterY, iconRadius, 0, Math.PI * 2);
  ctx.fillStyle = platform === 'youtube' ? '#DC2626' : platform === 'github' ? '#1E293B' : '#0284C7';
  ctx.shadowColor = platform === 'youtube' ? 'rgba(220, 38, 38, 0.6)' : theme.glowColor;
  ctx.shadowBlur = 10;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawVectorIcon(ctx, iconCenterX, iconCenterY, iconRadius * 0.6, iconType, '#FFFFFF');
  ctx.restore();

  // Middle Text Block
  const textStartX = iconCenterX + iconRadius + 14;
  const hasSubtitle = !!overlay.subtitle;

  ctx.save();
  ctx.fillStyle = overlay.textColor || '#FFFFFF';
  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = hasSubtitle ? 'bottom' : 'middle';
  ctx.textAlign = 'left';
  const textY = hasSubtitle ? originY + cardH / 2 - 1 : originY + cardH / 2;
  ctx.fillText(overlay.text || '', textStartX, textY);

  if (hasSubtitle) {
    ctx.fillStyle = overlay.accentColor || '#94A3B8';
    ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(overlay.subtitle!, textStartX, originY + cardH / 2 + 3);
  }
  ctx.restore();

  // CTA Action Button on the Right
  const ctaX = originX + cardW - paddingX - ctaButtonWidth;
  const ctaY = originY + (cardH - ctaButtonHeight) / 2;
  const ctaR = ctaButtonHeight / 2;

  // Pulse effect on CTA button
  const ctaScale = 1.0 + 0.03 * Math.sin(localTime * 5);

  ctx.save();
  ctx.translate(ctaX + ctaButtonWidth / 2, ctaY + ctaButtonHeight / 2);
  ctx.scale(ctaScale, ctaScale);
  ctx.translate(-(ctaX + ctaButtonWidth / 2), -(ctaY + ctaButtonHeight / 2));

  ctx.beginPath();
  drawRoundedRectPath(ctx, ctaX, ctaY, ctaButtonWidth, ctaButtonHeight, ctaR);
  ctx.fillStyle = ctaBg;
  ctx.shadowColor = ctaBg;
  ctx.shadowBlur = 14;
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = ctaTextColor;
  ctx.font = `800 ${ctaFontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(ctaLabel, ctaX + ctaButtonWidth / 2, ctaY + ctaButtonHeight / 2);
  ctx.restore();
}

/**
 * 4. SaaS Launch Ribbon & Price Tag Renderer
 */
function drawLaunchTag(
  ctx: CanvasRenderingContext2D,
  _canvasW: number,
  _canvasH: number,
  overlay: TextOverlay,
  theme: LowerThirdThemeConfig,
  localTime: number
) {
  const fontSize = overlay.fontSize || 21;
  const subFontSize = Math.max(12, Math.round(fontSize * 0.62));
  const tagFontSize = Math.max(10, Math.round(fontSize * 0.50));

  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  const titleWidth = ctx.measureText(overlay.text || '').width;

  ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
  const subWidth = ctx.measureText(overlay.subtitle || '').width;

  const ribbonText = (overlay.tag || 'LAUNCH DEAL 🚀').toUpperCase();
  ctx.font = `800 ${tagFontSize}px Inter, -apple-system, sans-serif`;
  const ribbonWidth = ctx.measureText(ribbonText).width + 30;

  const currentPrice = overlay.price || '$49';
  const originalPrice = overlay.originalPrice || '$149';

  ctx.font = `800 ${fontSize}px Inter, -apple-system, sans-serif`;
  const priceWidth = ctx.measureText(currentPrice).width;

  ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
  const origPriceWidth = originalPrice ? ctx.measureText(originalPrice).width + 8 : 0;
  const priceTagWidth = priceWidth + origPriceWidth + 24;

  const paddingX = 18;
  const paddingY = 12;
  const textBlockWidth = Math.max(titleWidth, subWidth);
  const cardW = ribbonWidth + textBlockWidth + priceTagWidth + paddingX * 3;
  const cardH = Math.max(fontSize + subFontSize + paddingY * 2.4, 56);
  const cornerR = 16;

  const originX = -cardW / 2;
  const originY = -cardH / 2;

  // Drop Shadow
  ctx.save();
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;

  // Background Card
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.fill();
  ctx.restore();

  // Specular Border
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  drawRoundedRectPath(ctx, originX, originY, cardW, cardH, cornerR);
  ctx.stroke();
  ctx.restore();

  // Left Ribbon Flag with Gradient
  ctx.save();
  const ribbonGrad = ctx.createLinearGradient(originX, originY, originX + ribbonWidth, originY + cardH);
  ribbonGrad.addColorStop(0, theme.gradientStart);
  ribbonGrad.addColorStop(1, theme.gradientEnd);

  ctx.beginPath();
  ctx.moveTo(originX + cornerR, originY);
  ctx.lineTo(originX + ribbonWidth - 10, originY);
  ctx.lineTo(originX + ribbonWidth + 4, originY + cardH / 2);
  ctx.lineTo(originX + ribbonWidth - 10, originY + cardH);
  ctx.lineTo(originX + cornerR, originY + cardH);
  ctx.arc(originX + cornerR, originY + cardH - cornerR, cornerR, Math.PI / 2, Math.PI);
  ctx.lineTo(originX, originY + cornerR);
  ctx.arc(originX + cornerR, originY + cornerR, cornerR, Math.PI, Math.PI * 1.5);
  ctx.closePath();
  ctx.fillStyle = ribbonGrad;
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 12;
  ctx.fill();

  // Specular shimmer sweep across ribbon
  const shimmerPos = ((localTime * 0.8) % 3.0) / 3.0; // 0 to 1
  if (shimmerPos < 0.6) {
    const shimX = originX + shimmerPos * (ribbonWidth * 1.6);
    const shimGrad = ctx.createLinearGradient(shimX - 20, originY, shimX + 20, originY + cardH);
    shimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
    shimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.save();
    ctx.clip();
    ctx.fillStyle = shimGrad;
    ctx.fillRect(originX, originY, ribbonWidth + 10, cardH);
    ctx.restore();
  }

  // Ribbon Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 ${tagFontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 4;
  ctx.fillText(ribbonText, originX + (ribbonWidth - 4) / 2, originY + cardH / 2);
  ctx.restore();

  // Middle Content
  const textStartX = originX + ribbonWidth + 14;
  const hasSubtitle = !!overlay.subtitle;

  ctx.save();
  ctx.fillStyle = overlay.textColor || '#FFFFFF';
  ctx.font = `700 ${fontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = hasSubtitle ? 'bottom' : 'middle';
  ctx.textAlign = 'left';
  const textY = hasSubtitle ? originY + cardH / 2 - 1 : originY + cardH / 2;
  ctx.fillText(overlay.text || '', textStartX, textY);

  if (hasSubtitle) {
    ctx.fillStyle = overlay.accentColor || theme.subtextColor;
    ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillText(overlay.subtitle!, textStartX, originY + cardH / 2 + 3);
  }
  ctx.restore();

  // Right Price Tag Pill
  const priceTagH = cardH - 16;
  const priceTagX = originX + cardW - paddingX - priceTagWidth;
  const priceTagY = originY + (cardH - priceTagH) / 2;

  ctx.save();
  ctx.beginPath();
  drawRoundedRectPath(ctx, priceTagX, priceTagY, priceTagWidth, priceTagH, 10);
  ctx.fillStyle = theme.badgeBg;
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  let pCurX = priceTagX + 12;

  if (originalPrice) {
    ctx.fillStyle = '#94A3B8';
    ctx.font = `500 ${subFontSize}px Inter, -apple-system, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(originalPrice, pCurX, priceTagY + priceTagH / 2);

    // Strikethrough line
    const strikeW = ctx.measureText(originalPrice).width;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pCurX - 1, priceTagY + priceTagH / 2);
    ctx.lineTo(pCurX + strikeW + 1, priceTagY + priceTagH / 2);
    ctx.stroke();

    pCurX += strikeW + 8;
  }

  // Current Price
  ctx.fillStyle = theme.accent;
  ctx.font = `800 ${fontSize}px Inter, -apple-system, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 8;
  ctx.fillText(currentPrice, pCurX, priceTagY + priceTagH / 2);
  ctx.restore();
}

/**
 * Procedural Vector Icons for Crisp Rendering on Any Canvas Resolution
 */
function drawVectorIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  type: string,
  color: string = '#FFFFFF'
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const s = size / 2;

  switch (type) {
    case 'user': {
      // Head
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.35, s * 0.45, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders
      ctx.beginPath();
      ctx.arc(cx, cy + s * 0.85, s * 0.8, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      break;
    }
    case 'microphone': {
      // Mic capsule
      ctx.beginPath();
      drawRoundedRectPath(ctx, cx - s * 0.32, cy - s * 0.75, s * 0.64, s * 0.95, s * 0.32);
      ctx.fill();
      // Stand arc
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.2, s * 0.55, 0, Math.PI);
      ctx.stroke();
      // Stand stem
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.35);
      ctx.lineTo(cx, cy + s * 0.75);
      ctx.moveTo(cx - s * 0.45, cy + s * 0.75);
      ctx.lineTo(cx + s * 0.45, cy + s * 0.75);
      ctx.stroke();
      break;
    }
    case 'sparkles': {
      // 4-point star sparkle
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.quadraticCurveTo(cx, cy, cx + s, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy + s);
      ctx.quadraticCurveTo(cx, cy, cx - s, cy);
      ctx.quadraticCurveTo(cx, cy, cx, cy - s);
      ctx.fill();
      break;
    }
    case 'code': {
      // Left bracket
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.2, cy - s * 0.6);
      ctx.lineTo(cx - s * 0.75, cy);
      ctx.lineTo(cx - s * 0.2, cy + s * 0.6);
      ctx.stroke();
      // Right bracket
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.2, cy - s * 0.6);
      ctx.lineTo(cx + s * 0.75, cy);
      ctx.lineTo(cx + s * 0.2, cy + s * 0.6);
      ctx.stroke();
      break;
    }
    case 'star': {
      // 5-point star
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = cx + Math.cos(angle) * s;
        const y = cy + Math.sin(angle) * s;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'rocket': {
      // Rocket body
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.9);
      ctx.quadraticCurveTo(cx + s * 0.6, cy, cx + s * 0.4, cy + s * 0.7);
      ctx.lineTo(cx - s * 0.4, cy + s * 0.7);
      ctx.quadraticCurveTo(cx - s * 0.6, cy, cx, cy - s * 0.9);
      ctx.fill();
      // Rocket window
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.1, s * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'youtube': {
      // Play triangle
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.35, cy - s * 0.55);
      ctx.lineTo(cx + s * 0.60, cy);
      ctx.lineTo(cx - s * 0.35, cy + s * 0.55);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'github': {
      // GitHub Octocat silhouette / Star
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - s * 0.1, s * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'twitter': {
      // Stylized X
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.6, cy - s * 0.6);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.6);
      ctx.moveTo(cx + s * 0.6, cy - s * 0.6);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.6);
      ctx.stroke();
      break;
    }
    case 'shield': {
      // Shield outline + check
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 0.85);
      ctx.lineTo(cx + s * 0.7, cy - s * 0.5);
      ctx.quadraticCurveTo(cx + s * 0.6, cy + s * 0.6, cx, cy + s * 0.9);
      ctx.quadraticCurveTo(cx - s * 0.6, cy + s * 0.6, cx - s * 0.7, cy - s * 0.5);
      ctx.closePath();
      ctx.stroke();
      // Inner check
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.3, cy);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.35, cy - s * 0.25);
      ctx.stroke();
      break;
    }
    case 'check': {
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.5, cy);
      ctx.lineTo(cx - s * 0.1, cy + s * 0.4);
      ctx.lineTo(cx + s * 0.55, cy - s * 0.35);
      ctx.stroke();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

/**
 * Canvas path utility for smooth rounded rectangles
 */
function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  ctx.closePath();
}

/**
 * Animation Easings
 */
function easeOutBack(x: number): number {
  const c1 = 1.60;
  const c3 = c1 + 1;
  const t = Math.max(0, Math.min(1, x)) - 1;
  return 1 + c3 * t * t * t + c1 * t * t;
}

function easeInCubic(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * t;
}

function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  let t = Math.max(0, Math.min(1, x));

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}
