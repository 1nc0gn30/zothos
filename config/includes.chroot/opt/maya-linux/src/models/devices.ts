import { DeviceModel, DeviceFrame, CanvasAspectConfig, CanvasAspectRatioType, GradientSpec } from '../types/models';

const pro16_17Geometry = {
  aspect: 450.0 / 920.0,
  screenRect: {
    x: 25.0 / 450.0,
    y: 24.0 / 920.0,
    width: 400.0 / 450.0,
    height: 872.0 / 920.0,
  },
  cornerRadius: 48.0 / 450.0,
};

const pro15Geometry = {
  aspect: 473.0 / 932.0,
  screenRect: {
    x: 41.0 / 473.0,
    y: 41.0 / 932.0,
    width: 391.0 / 473.0,
    height: 850.0 / 932.0,
  },
  cornerRadius: 52.0 / 473.0,
};

const ipad11Geometry = {
  aspect: 1320.0 / 940.0,
  screenRect: {
    x: 56.0 / 1320.0,
    y: 54.0 / 940.0,
    width: 1208.0 / 1320.0,
    height: 832.0 / 940.0,
  },
  cornerRadius: 24.0 / 1320.0,
};

const macbookPro14Geometry = {
  aspect: 1216.0 / 735.0,
  screenRect: {
    x: 125.0 / 1216.0,
    y: 38.0 / 735.0,
    width: 966.0 / 1216.0,
    height: 608.0 / 735.0,
  },
  cornerRadius: 10.0 / 1216.0,
};

const voidColor = {
  id: 'default',
  name: 'Default',
  imageName: '',
  swatchHex: '#000000',
};

export const DEVICE_MODELS: DeviceModel[] = [
  {
    id: 'no-frame',
    displayName: 'No frame',
    frameAspectRatio: 9.0 / 19.5,
    screenRectNormalized: { x: 0, y: 0, width: 1, height: 1 },
    screenCornerRadiusNormalized: 0.04,
    colors: [voidColor],
    kind: 'none',
    symbol: 'rectangle.dashed',
    defaultColor: voidColor,
  },
  {
    id: 'generic-phone',
    displayName: 'Generic Phone (Clean Bezel)',
    frameAspectRatio: 9.0 / 19.5,
    screenRectNormalized: { x: 0, y: 0, width: 1, height: 1 },
    screenCornerRadiusNormalized: 0.08,
    colors: [voidColor],
    kind: 'generic',
    symbol: 'iphone',
    defaultColor: voidColor,
  },
  {
    id: 'iphone-17-pro',
    displayName: 'iPhone 17 Pro',
    frameAspectRatio: pro16_17Geometry.aspect,
    screenRectNormalized: pro16_17Geometry.screenRect,
    screenCornerRadiusNormalized: pro16_17Geometry.cornerRadius,
    colors: [
      { id: 'cosmic-orange', name: 'Cosmic Orange', imageName: 'iPhone 17 Pro - Cosmic Orange.png', swatchHex: '#E96A2C' },
      { id: 'deep-blue', name: 'Deep Blue', imageName: 'iPhone 17 Pro - Deep Blue.png', swatchHex: '#3F5476' },
      { id: 'silver', name: 'Silver', imageName: 'iPhone 17 Pro - Silver.png', swatchHex: '#C9CCD0' },
    ],
    kind: 'physical',
    symbol: 'iphone',
    defaultColor: { id: 'cosmic-orange', name: 'Cosmic Orange', imageName: 'iPhone 17 Pro - Cosmic Orange.png', swatchHex: '#E96A2C' },
  },
  {
    id: 'iphone-16-pro',
    displayName: 'iPhone 16 Pro',
    frameAspectRatio: pro16_17Geometry.aspect,
    screenRectNormalized: pro16_17Geometry.screenRect,
    screenCornerRadiusNormalized: pro16_17Geometry.cornerRadius,
    colors: [
      { id: 'natural-titanium', name: 'Natural Titanium', imageName: 'iPhone 16 Pro - Natural Titanium .png', swatchHex: '#BFB4A1' },
      { id: 'black-titanium', name: 'Black Titanium', imageName: 'iPhone 16 Pro - Black Titanium.png', swatchHex: '#3A3A3C' },
      { id: 'white-titanium', name: 'White Titanium', imageName: 'iPhone 16 Pro - White Titanium.png', swatchHex: '#E3E0DA' },
      { id: 'gold-titanium', name: 'Desert Titanium', imageName: 'iPhone 16 Pro - Gold Titanium.png', swatchHex: '#C9A77F' },
    ],
    kind: 'physical',
    symbol: 'iphone',
    defaultColor: { id: 'natural-titanium', name: 'Natural Titanium', imageName: 'iPhone 16 Pro - Natural Titanium .png', swatchHex: '#BFB4A1' },
  },
  {
    id: 'iphone-15-pro',
    displayName: 'iPhone 15 Pro',
    frameAspectRatio: pro15Geometry.aspect,
    screenRectNormalized: pro15Geometry.screenRect,
    screenCornerRadiusNormalized: pro15Geometry.cornerRadius,
    colors: [
      { id: 'natural-titanium', name: 'Natural Titanium', imageName: 'iPhone 15 Pro - Natural Titanium.png', swatchHex: '#8B8378' },
      { id: 'black-titanium', name: 'Black Titanium', imageName: 'iPhone 15 Pro - Black Titanium.png', swatchHex: '#3A3A3C' },
      { id: 'white-titanium', name: 'White Titanium', imageName: 'iPhone 15 Pro - White Titanium.png', swatchHex: '#E3E0DA' },
    ],
    kind: 'physical',
    symbol: 'iphone',
    defaultColor: { id: 'natural-titanium', name: 'Natural Titanium', imageName: 'iPhone 15 Pro - Natural Titanium.png', swatchHex: '#8B8378' },
  },
  {
    id: 'ipad-pro-11',
    displayName: 'iPad Pro 11"',
    frameAspectRatio: ipad11Geometry.aspect,
    screenRectNormalized: ipad11Geometry.screenRect,
    screenCornerRadiusNormalized: ipad11Geometry.cornerRadius,
    colors: [
      { id: 'silver', name: 'Silver', imageName: 'iPad Pro 11.png', swatchHex: '#C9CCD0' },
    ],
    kind: 'physical',
    symbol: 'ipad.landscape',
    defaultColor: { id: 'silver', name: 'Silver', imageName: 'iPad Pro 11.png', swatchHex: '#C9CCD0' },
  },
  {
    id: 'ipad-pro-13-m4',
    displayName: 'iPad Pro 13" (M4)',
    frameAspectRatio: ipad11Geometry.aspect,
    screenRectNormalized: ipad11Geometry.screenRect,
    screenCornerRadiusNormalized: ipad11Geometry.cornerRadius,
    colors: [
      { id: 'space-black', name: 'Space Black', imageName: 'iPad Pro 11.png', swatchHex: '#18181B' },
      { id: 'silver', name: 'Silver', imageName: 'iPad Pro 11.png', swatchHex: '#C9CCD0' },
    ],
    kind: 'physical',
    symbol: 'ipad.landscape',
    defaultColor: { id: 'space-black', name: 'Space Black', imageName: 'iPad Pro 11.png', swatchHex: '#18181B' },
  },
  {
    id: 'macbook-pro-14',
    displayName: 'MacBook Pro 14"',
    frameAspectRatio: macbookPro14Geometry.aspect,
    screenRectNormalized: macbookPro14Geometry.screenRect,
    screenCornerRadiusNormalized: macbookPro14Geometry.cornerRadius,
    colors: [
      { id: 'space-black', name: 'Space Black', imageName: 'MacBook Pro 14.png', swatchHex: '#1F242D' },
      { id: 'silver', name: 'Silver', imageName: 'MacBook Pro 14.png', swatchHex: '#C9CCD0' },
    ],
    kind: 'physical',
    symbol: 'laptopcomputer',
    defaultColor: { id: 'space-black', name: 'Space Black', imageName: 'MacBook Pro 14.png', swatchHex: '#1F242D' },
  },
  {
    id: 'macbook-air-15',
    displayName: 'MacBook Air 15"',
    frameAspectRatio: macbookPro14Geometry.aspect,
    screenRectNormalized: macbookPro14Geometry.screenRect,
    screenCornerRadiusNormalized: macbookPro14Geometry.cornerRadius,
    colors: [
      { id: 'midnight', name: 'Midnight Blue', imageName: 'MacBook Pro 14.png', swatchHex: '#1E293B' },
      { id: 'starlight', name: 'Starlight', imageName: 'MacBook Pro 14.png', swatchHex: '#F1E9DB' },
      { id: 'space-gray', name: 'Space Gray', imageName: 'MacBook Pro 14.png', swatchHex: '#475569' },
      { id: 'silver', name: 'Silver', imageName: 'MacBook Pro 14.png', swatchHex: '#C9CCD0' },
    ],
    kind: 'physical',
    symbol: 'laptopcomputer',
    defaultColor: { id: 'midnight', name: 'Midnight Blue', imageName: 'MacBook Pro 14.png', swatchHex: '#1E293B' },
  },
  {
    id: 'browser-window',
    displayName: 'Browser Window (macOS Safari / Arc)',
    frameAspectRatio: 16.0 / 10.0,
    screenRectNormalized: {
      x: 0,
      y: 44.0 / 600.0,
      width: 1.0,
      height: (600.0 - 44.0) / 600.0,
    },
    screenCornerRadiusNormalized: 14.0 / 960.0,
    colors: [
      { id: 'dark', name: 'Dark Frosted', imageName: '', swatchHex: '#18181B' },
      { id: 'light', name: 'Clean Light', imageName: '', swatchHex: '#F4F4F5' },
      { id: 'translucent', name: 'Glass Acrylic', imageName: '', swatchHex: '#27272A' },
    ],
    kind: 'browser',
    symbol: 'globe',
    defaultColor: { id: 'dark', name: 'Dark Frosted', imageName: '', swatchHex: '#18181B' },
    desktopConfig: {
      title: 'Maya Studio Demo',
      url: 'https://maya.studio/demo',
      theme: 'dark',
      trafficLights: 'macos',
      showUrlBar: true,
    },
  },
  {
    id: 'terminal-window',
    displayName: 'Hacker Terminal (Ghostty / zsh)',
    frameAspectRatio: 16.0 / 10.0,
    screenRectNormalized: {
      x: 0,
      y: 40.0 / 600.0,
      width: 1.0,
      height: (600.0 - 40.0) / 600.0,
    },
    screenCornerRadiusNormalized: 14.0 / 960.0,
    colors: [
      { id: 'cyber-dark', name: 'Cyber Slate', imageName: '', swatchHex: '#0B0F19' },
      { id: 'matrix-green', name: 'Matrix Emerald', imageName: '', swatchHex: '#062E1C' },
    ],
    kind: 'terminal',
    symbol: 'terminal',
    defaultColor: { id: 'cyber-dark', name: 'Cyber Slate', imageName: '', swatchHex: '#0B0F19' },
    desktopConfig: {
      title: 'maya-linux — git:(main) — 80x24',
      theme: 'dark',
      trafficLights: 'macos',
      showUrlBar: false,
    },
  },
  {
    id: 'studio-display-27',
    displayName: 'Apple Studio Display 27"',
    frameAspectRatio: 16.0 / 11.2,
    screenRectNormalized: {
      x: 0.032,
      y: 0.032,
      width: 0.936,
      height: 0.772,
    },
    screenCornerRadiusNormalized: 0.008,
    colors: [
      { id: 'silver', name: 'Silver Aluminum', imageName: '', swatchHex: '#E2E8F0' },
      { id: 'space-black', name: 'Space Black', imageName: '', swatchHex: '#1E242D' },
    ],
    kind: 'desktop',
    symbol: 'display',
    defaultColor: { id: 'silver', name: 'Silver Aluminum', imageName: '', swatchHex: '#E2E8F0' },
  },
  {
    id: 'pixel-9-pro',
    displayName: 'Google Pixel 9 Pro',
    frameAspectRatio: 440.0 / 920.0,
    screenRectNormalized: {
      x: 18.0 / 440.0,
      y: 18.0 / 920.0,
      width: 404.0 / 440.0,
      height: 884.0 / 920.0,
    },
    screenCornerRadiusNormalized: 52.0 / 440.0,
    colors: [
      { id: 'obsidian', name: 'Obsidian Black', imageName: '', swatchHex: '#18181B' },
      { id: 'porcelain', name: 'Porcelain White', imageName: '', swatchHex: '#F4F4F5' },
      { id: 'hazel', name: 'Hazel Sage', imageName: '', swatchHex: '#71717A' },
      { id: 'rose-quartz', name: 'Rose Quartz', imageName: '', swatchHex: '#F43F5E' },
    ],
    kind: 'generic',
    symbol: 'phone',
    defaultColor: { id: 'obsidian', name: 'Obsidian Black', imageName: '', swatchHex: '#18181B' },
  },
  {
    id: 'apple-watch-ultra',
    displayName: 'Apple Watch Ultra 2 (49mm)',
    frameAspectRatio: 1.0,
    screenRectNormalized: {
      x: 0.13,
      y: 0.13,
      width: 0.74,
      height: 0.74,
    },
    screenCornerRadiusNormalized: 0.20,
    colors: [
      { id: 'titanium', name: 'Natural Titanium', imageName: '', swatchHex: '#D4D4D8' },
      { id: 'black-titanium', name: 'Black Titanium', imageName: '', swatchHex: '#18181B' },
    ],
    kind: 'watch',
    symbol: 'applewatch',
    defaultColor: { id: 'titanium', name: 'Natural Titanium', imageName: '', swatchHex: '#D4D4D8' },
  },
];

export function getDeviceFrame(modelId: string, colorId?: string): DeviceFrame {
  const model = DEVICE_MODELS.find(m => m.id === modelId) || DEVICE_MODELS[2];
  const color = model.colors.find(c => c.id === colorId) || model.defaultColor;

  return {
    id: `${model.id}.${color.id}`,
    displayName: model.kind === 'physical' ? `${model.displayName} – ${color.name}` : model.displayName,
    imageName: color.imageName,
    frameAspectRatio: model.frameAspectRatio,
    screenRectNormalized: model.screenRectNormalized,
    screenCornerRadiusNormalized: model.screenCornerRadiusNormalized,
    kind: model.kind,
    desktopConfig: model.desktopConfig,
  };
}

export const CANVAS_ASPECTS: Record<CanvasAspectRatioType, CanvasAspectConfig> = {
  square: {
    id: 'square',
    ratio: 1.0,
    displayName: 'Square',
    shortLabel: '1:1',
    renderWidth: 1080,
    renderHeight: 1080,
    symbol: 'square',
  },
  vertical9x16: {
    id: 'vertical9x16',
    ratio: 9.0 / 16.0,
    displayName: 'Reels / Story',
    shortLabel: '9:16',
    renderWidth: 1080,
    renderHeight: 1920,
    symbol: 'rectangle.portrait',
  },
  vertical4x5: {
    id: 'vertical4x5',
    ratio: 4.0 / 5.0,
    displayName: 'Portrait',
    shortLabel: '4:5',
    renderWidth: 1080,
    renderHeight: 1350,
    symbol: 'rectangle.portrait',
  },
  landscape4x3: {
    id: 'landscape4x3',
    ratio: 4.0 / 3.0,
    displayName: 'Landscape',
    shortLabel: '4:3',
    renderWidth: 1440,
    renderHeight: 1080,
    symbol: 'rectangle',
  },
  landscape16x9: {
    id: 'landscape16x9',
    ratio: 16.0 / 9.0,
    displayName: 'YouTube / Widescreen',
    shortLabel: '16:9',
    renderWidth: 1920,
    renderHeight: 1080,
    symbol: 'rectangle',
  },
};

export const GRADIENT_PRESETS: GradientSpec[] = [
  { startHex: '#6466FA', endHex: '#A78BFA', angleDegrees: 135 },
  { startHex: '#6466FA', endHex: '#EC4899', angleDegrees: 135 },
  { startHex: '#6466FA', endHex: '#22D3EE', angleDegrees: 135 },
  { startHex: '#818CF8', endHex: '#F59E0B', angleDegrees: 135 },
  { startHex: '#1E1B4B', endHex: '#6466FA', angleDegrees: 180 },
  { startHex: '#4338CA', endHex: '#0F172A', angleDegrees: 135 },
  { startHex: '#E0E7FF', endHex: '#818CF8', angleDegrees: 135 },
  { startHex: '#A5B4FC', endHex: '#C084FC', angleDegrees: 135 },
];

export const SOLID_PRESETS = [
  '#6466FA',
  '#4338CA',
  '#A78BFA',
  '#1E1B4B',
  '#0F172A',
  '#000000',
  '#FFFFFF',
  '#F8FAFC',
  '#E0E7FF',
];
