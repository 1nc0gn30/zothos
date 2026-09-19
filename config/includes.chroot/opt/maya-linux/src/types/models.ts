export type DeviceFrameKind = 'physical' | 'generic' | 'browser' | 'terminal' | 'desktop' | 'watch' | 'none';

export interface DeviceColor {
  id: string;
  name: string;
  imageName: string;
  swatchHex: string;
}

export interface RectNormalized {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesktopFrameConfig {
  title?: string;
  url?: string;
  theme?: 'dark' | 'light' | 'translucent';
  trafficLights?: 'macos' | 'windows' | 'minimal' | 'none';
  showUrlBar?: boolean;
}

export interface DeviceModel {
  id: string;
  displayName: string;
  frameAspectRatio: number;
  screenRectNormalized: RectNormalized;
  screenCornerRadiusNormalized: number;
  colors: DeviceColor[];
  kind: DeviceFrameKind;
  symbol: string;
  defaultColor: DeviceColor;
  desktopConfig?: DesktopFrameConfig;
}

export interface DeviceFrame {
  id: string;
  displayName: string;
  imageName: string;
  frameAspectRatio: number;
  screenRectNormalized: RectNormalized;
  screenCornerRadiusNormalized: number;
  kind: DeviceFrameKind;
  desktopConfig?: DesktopFrameConfig;
}

export type CanvasAspectRatioType = 'square' | 'vertical9x16' | 'vertical4x5' | 'landscape4x3' | 'landscape16x9';

export interface CanvasAspectConfig {
  id: CanvasAspectRatioType;
  ratio: number;
  displayName: string;
  shortLabel: string;
  renderWidth: number;
  renderHeight: number;
  symbol: string;
}

export interface GradientSpec {
  startHex: string;
  endHex: string;
  angleDegrees: number;
}

export type BackgroundType = 'none' | 'solid' | 'gradient' | 'image' | 'videoBlur' | 'meshGradient';

export type PatternType = 'dots' | 'grid' | 'crosses' | 'circuit' | 'radialLines';

export interface BackgroundPatternConfig {
  enabled: boolean;
  type: PatternType;
  opacity: number; // 0..1
  colorHex: string;
  scale: number; // grid size
}

export interface BackgroundOption {
  type: BackgroundType;
  hex?: string;
  gradient?: GradientSpec;
  imageURL?: string;
  theme?: 'aurora' | 'cyberpunk' | 'sunset' | 'deepOcean';
  pattern?: BackgroundPatternConfig;
}

export type ProgressBarStyle = 'gradient' | 'neonGlow' | 'storyPills' | 'radialClock';
export type ProgressBarPosition = 'top' | 'bottom' | 'top-pills' | 'bottom-thin';

export interface ProgressBarConfig {
  enabled: boolean;
  style: ProgressBarStyle;
  position: ProgressBarPosition;
  height: number;
  colorStart: string;
  colorEnd: string;
  pillCount?: number;
  glowRadius?: number;
  opacity?: number;
}

export interface PhoneShadow {
  enabled: boolean;
  colorHex: string;
  radius: number;
  offsetY: number;
  offsetX: number;
  opacity: number;
}

export interface Device3DTransform {
  enabled: boolean;
  rotateX: number; // Pitch (-45 to 45 deg)
  rotateY: number; // Yaw (-45 to 45 deg)
  rotateZ: number; // Roll (-45 to 45 deg)
  perspective: number; // 800 to 2500
  autoDrift: boolean; // Subtle cinematic parallax drift
  depthExtrusion?: number; // 0..24 3D chassis thickness
  specularGlare?: boolean; // Dynamic glass reflection sheen
  glareIntensity?: number; // 0..1
}

export interface CursorConfig {
  enabled: boolean;
  style: 'macos' | 'dot' | 'laser' | 'glow';
  colorHex: string;
  size: number;
  clickRipples: boolean;
}

export interface AudioTrack {
  id: string;
  url: string;
  name: string;
  volume: number; // 0..1
  startTime: number; // timeline start in seconds
  duration: number;
  fadeIn?: number; // seconds (0..5)
  fadeOut?: number; // seconds (0..5)
  duckingEnabled?: boolean;
  duckingAmount?: number; // 0..1 (default 0.3)
  isMuted?: boolean;
  bpm?: number;
  beatTimestamps?: number[];
  waveformData?: number[];
}

export type TransitionType = 
  | 'whipPan' 
  | 'crashZoom' 
  | 'lightLeakFlash' 
  | 'rgbGlitch' 
  | 'filmBurn' 
  | 'vortexSwirl' 
  | 'directionalPush'
  | 'none';

export interface TransitionItem {
  id: string;
  type: TransitionType;
  startTime: number; // in seconds
  duration: number; // typically 0.3..0.8s
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number; // 0..1
}

export type ZoomFocus = 
  | 'center' 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'custom';

export type AnimationCurve = 'spring' | 'bouncy' | 'smooth' | 'snappy' | 'gentle' | 'linear';

export interface ZoomSegment {
  id: string;
  startTime: number;
  duration: number;
  scale: number;
  focus: ZoomFocus;
  panX?: number; // -1 (left) to 1 (right), default 0 (center)
  panY?: number; // -1 (top) to 1 (bottom), default 0 (center)
  transitionIn: number;
  transitionOut: number;
  curve: AnimationCurve;
}

export type TapStyle = 'ripple' | 'pulse' | 'ring';

export interface TapEvent {
  id: string;
  startTime: number;
  duration: number;
  position: { x: number; y: number }; // normalized 0..1 inside screen
  style: TapStyle;
  diameterFraction: number; // normalized relative to screen short side
  colorHex: string;
  playSound: boolean;
}

export type SpeedCurvePreset = 'custom' | 'heroRamp' | 'montage' | 'bulletTime' | 'riser';

export interface SpeedSegment {
  id: string;
  startTime: number;
  duration: number;
  rate: number;
  curvePreset?: SpeedCurvePreset;
}

export type ColorGradeType = 
  | 'none' 
  | 'cyberpunk' 
  | 'warmSunset' 
  | 'vintageVHS' 
  | 'noir' 
  | 'studioBoost' 
  | 'matrix'
  | 'oppenheimer70mm'
  | 'duneDesert'
  | 'bladeRunner'
  | 'interstellar'
  | 'tealOrange'
  | 'datamosh'
  | 'infraredHeat'
  | 'crtArcade';

export interface VideoEffectsConfig {
  colorGrade: ColorGradeType;
  vignette: number; // 0..1
  filmGrain: number; // 0..1
  chromaticAberration: number; // 0..1
  scanlines: boolean;
  bloom: number; // 0..1
  cameraShake: number; // 0..1 (intensity)
  rgbGlitch: number; // 0..1 (intensity)
  anamorphicFlare?: {
    enabled: boolean;
    intensity: number; // 0..1
    colorHex: string;
    streakWidth: number; // 0.3..1.0
  };
  letterbox?: {
    enabled: boolean;
    aspect: '2.39:1' | '2.35:1' | '1.85:1' | '4:3';
    opacity: number; // 0..1
  };
  lightLeaks?: {
    enabled: boolean;
    intensity: number; // 0..1
    theme: 'kodakWarm' | 'neonCyan' | 'solarAmber' | 'goldenHour';
  };
  proMistGlow?: {
    enabled: boolean;
    intensity: number; // 0..1
    radius: number; // 4..32
  };
  handheldCamera?: {
    enabled: boolean;
    intensity: number; // 0..1
    speed: number; // 0.5..2.0
  };
  spotlight?: {
    enabled: boolean;
    x: number; // normalized 0..1
    y: number; // normalized 0..1
    radius: number; // 0.1..0.8
    opacity: number; // 0..0.9
  };
  deviceGlow?: {
    enabled: boolean;
    colorHex: string;
    radius: number; // 0..40
  };
  vhsGlitch?: {
    enabled: boolean;
    intensity: number; // 0..1
    showOSD?: boolean;
  };
  vintage8mm?: {
    enabled: boolean;
    intensity: number; // 0..1
    dustFlicker?: boolean;
  };
  prismRefraction?: {
    enabled: boolean;
    intensity: number; // 0..1
  };
  showSafeZones?: boolean;
  showGrid?: boolean;
}

export interface MetaEditsConfig {
  scribble?: {
    enabled: boolean;
    style: 'neon' | 'chalk' | 'electric' | 'rainbow';
    speed: number; // 0.5..3.0
    intensity: number; // 0..1
    colorHex: string;
    mode?: 'around-frame' | 'taps' | 'screen-border';
  };
  outline?: {
    enabled: boolean;
    colorHex: string;
    width: number; // 2..12
    pulseSpeed: number; // 0.5..4.0
    glowIntensity: number; // 0..1
    style: 'solid' | 'dashed' | 'flowing';
  };
  glitter?: {
    enabled: boolean;
    starCount: number; // 10..80
    colorTheme: 'diamond' | 'gold' | 'neonPink' | 'cosmic';
    speed: number; // 0.5..3.0
  };
  selectiveBlur?: {
    enabled: boolean;
    type: 'gaussian' | 'pixelate';
    x: number; // normalized 0..1
    y: number; // normalized 0..1
    width: number; // normalized 0.05..0.8
    height: number; // normalized 0.05..0.5
    pixelSize?: number;
  };
  flashStrobe?: {
    enabled: boolean;
    intensity: number; // 0..1
    triggerEverySec?: number; // 1..10
  };
}

export type SubtitleStyle = 'hormozi' | 'neonGlow' | 'glassCard' | 'minimal' | 'karaoke' | 'popBounce';

export interface SubtitleItem {
  id: string;
  startTime: number;
  duration: number;
  text: string;
  speaker?: string;
  style?: SubtitleStyle;
  fontSize?: number;
  colorHex?: string;
  strokeHex?: string;
  bgHex?: string;
  uppercase?: boolean;
  positionY?: number; // 0.1 to 0.95 (default ~0.82)
}

export type BadgeStyle = 'pill' | 'frosted' | 'neon' | 'minimal' | 'speaker-pill' | 'tech-badge' | 'social-cta' | 'launch-tag';

export type LowerThirdPreset = 'speaker-pill' | 'tech-badge' | 'social-cta' | 'launch-tag';

export interface TextOverlay {
  id: string;
  startTime: number;
  duration: number;
  text: string;
  subtitle?: string;
  position: { x: number; y: number }; // normalized 0..1 on canvas
  style: BadgeStyle;
  bgColor: string;
  textColor: string;
  fontSize: number; // 12 to 36
  lowerThirdPreset?: LowerThirdPreset;
  tag?: string;
  avatarIcon?: 'user' | 'microphone' | 'sparkles' | 'code' | 'star' | 'rocket' | 'shield' | 'check' | 'zap';
  socialPlatform?: 'youtube' | 'github' | 'twitter' | 'generic';
  theme?: string;
  animationStyle?: 'slide-up' | 'scale-in' | 'bounce-in' | 'fade-slide';
  accentColor?: string;
  price?: string;
  originalPrice?: string;
}

export type StickerAnimation = 'pop' | 'bounce' | 'pulse' | 'float' | 'spin' | 'none';

export interface StickerItem {
  id: string;
  startTime: number;
  duration: number;
  emojiOrIcon: string; // e.g. "🔥", "✨", "🚀", "❤️", "👍", "⚡", "💯", "🎯", "👆"
  position: { x: number; y: number }; // normalized 0..1
  size: number; // 24 to 120
  animation: StickerAnimation;
  rotation?: number; // degrees
}

export type TypewriterStyle = 
  | 'stroke-typewriter' 
  | 'cyber-glass' 
  | 'alchemical-gold' 
  | 'minimal-heading' 
  | 'terminal-prompt';

export interface TypewriterOverlayItem {
  id: string;
  startTime: number;
  duration: number;
  text: string;
  subtitle?: string;
  tag?: string;
  position: { x: number; y: number }; // normalized 0..1
  style: TypewriterStyle;
  fontSize: number; // 18 to 72
  strokeWidth?: number; // 1 to 8
  strokeColor?: string;
  textColor: string;
  accentColor?: string;
  bgHex?: string;
  typingSpeedCps?: number; // characters per second (default 24)
  showCursor?: boolean;
  cursorChar?: string; // e.g. "█", "|", "⚡"
  maxWidthFraction?: number; // 0.3 to 0.95
  align?: 'left' | 'center' | 'right';
  glowColor?: string;
  glowRadius?: number;
}

export type ImageOverlayAnimation = 'fade' | 'pop' | 'float' | 'pulse' | 'slide-in' | 'spin' | 'none';

export interface ImageOverlayItem {
  id: string;
  startTime: number;
  duration: number;
  imageUrl: string;
  name?: string;
  position: { x: number; y: number }; // normalized 0..1
  scale: number; // 0.2 to 3.0
  opacity: number; // 0..1
  rotation?: number; // degrees
  animation: ImageOverlayAnimation;
  blendMode?: 'normal' | 'screen' | 'overlay' | 'lighten';
  isCircularAvatar?: boolean;
  borderHex?: string;
  borderWidth?: number;
  glowColor?: string;
  glowRadius?: number;
  presetKey?: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  opacity: number; // 0..1
  scale: number; // 0.5..2
}

export type SelectedEvent = 
  | { type: 'zoom'; id: string }
  | { type: 'tap'; id: string }
  | { type: 'speed'; id: string }
  | { type: 'transition'; id: string }
  | { type: 'overlay'; id: string }
  | { type: 'subtitle'; id: string }
  | { type: 'sticker'; id: string }
  | { type: 'typewriter'; id: string }
  | { type: 'imageOverlay'; id: string }
  | { type: 'audio'; id: string }
  | { type: 'video'; id: string }
  | null;

