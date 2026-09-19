import { ProjectState } from '../types/project';
import { GRADIENT_PRESETS, SOLID_PRESETS } from '../models/devices';

export interface ProTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  badge: string;
  icon: string;
  previewColors: [string, string];
}

export const PRO_TEMPLATES: ProTemplate[] = [
  {
    id: 'saas-launch',
    title: 'SaaS Product Demo',
    description: 'High-converting product demo with 3D isometric iPhone 17 Pro Cosmic Orange, deep indigo gradient, and studio HDR boost color grading.',
    category: 'Product & Launch',
    badge: '16:9 • 3D Isometric',
    icon: 'sparkles',
    previewColors: ['#1E1B4B', '#6466FA'],
  },
  {
    id: 'viral-shorts',
    title: 'Viral Shorts / TikTok',
    description: 'High-retention 9:16 mobile canvas with blurred video backdrop, borderless edge-to-edge frame, cyberpunk neon LUT, and Hormozi captions ready.',
    category: 'Social & Mobile',
    badge: '9:16 • TikTok / Reels',
    icon: 'flame',
    previewColors: ['#EC4899', '#38BDF8'],
  },
  {
    id: 'apple-minimal',
    title: 'Apple Clean Showcase',
    description: 'Ultra-clean minimalist showcase with iPhone 16/17 Natural Titanium, soft white/slate backdrop, flat perspective, and smooth ambient drop shadow.',
    category: 'Clean & Minimal',
    badge: '16:9 • Minimal Flat',
    icon: 'smartphone',
    previewColors: ['#F8FAFC', '#CBD5E1'],
  },
  {
    id: 'streamer-highlight',
    title: 'Streamer & Gaming',
    description: 'Dynamic gaming & stream highlight layout with dark slate backdrop, retro CRT scanlines, Matrix Emerald LUT grade, and isometric 3D tilt.',
    category: 'Gaming & Streams',
    badge: '16:9 • Matrix & CRT',
    icon: 'monitor',
    previewColors: ['#0F172A', '#10B981'],
  },
  {
    id: 'dev-tutorial',
    title: 'Developer Masterclass',
    description: 'Professional tech & code presentation inside a sleek MacBook Pro frame, deep navy gradient, Studio HDR LUT, and clean minimal subtitle styling.',
    category: 'Coding & Tutorials',
    badge: '16:9 • MacBook Pro',
    icon: 'terminal',
    previewColors: ['#4338CA', '#0F172A'],
  },
];

/**
 * Applies a 1-click Pro Studio template preset to the current project state.
 * Returns the updated partial project properties.
 */
export function applyTemplate(
  templateId: string,
  currentProject: ProjectState
): Partial<ProjectState> {
  switch (templateId) {
    case 'saas-launch':
      return {
        canvasAspect: 'landscape16x9',
        deviceModelID: 'iphone-17-pro',
        deviceColorID: 'cosmic-orange',
        scale: 0.86,
        offset: { width: 0, height: 0 },
        background: {
          type: 'gradient',
          gradient: GRADIENT_PRESETS[4] || {
            startHex: '#1E1B4B',
            endHex: '#6466FA',
            angleDegrees: 180,
          },
        },
        transform3D: {
          enabled: true,
          rotateX: 12,
          rotateY: -18,
          rotateZ: 4,
          perspective: 1100,
          autoDrift: false,
        },
        effects: {
          ...currentProject.effects,
          colorGrade: 'studioBoost',
          vignette: 0.2,
          filmGrain: 0,
          chromaticAberration: 0,
          scanlines: false,
          bloom: 0.15,
        },
        shadow: {
          enabled: true,
          colorHex: '#000000',
          radius: 36,
          offsetY: 18,
          offsetX: -6,
          opacity: 0.45,
        },
      };

    case 'viral-shorts':
      return {
        canvasAspect: 'vertical9x16',
        deviceModelID: 'no-frame',
        deviceColorID: 'default',
        bareCornerRadius: 0.04,
        bareBezelWidth: 0,
        scale: 1.0,
        offset: { width: 0, height: 0 },
        background: {
          type: 'videoBlur',
        },
        transform3D: {
          enabled: false,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          perspective: 1000,
          autoDrift: false,
        },
        effects: {
          ...currentProject.effects,
          colorGrade: 'cyberpunk',
          vignette: 0.15,
          filmGrain: 0,
          chromaticAberration: 0.05,
          scanlines: false,
          bloom: 0.2,
        },
        shadow: {
          enabled: false,
          colorHex: '#000000',
          radius: 0,
          offsetY: 0,
          offsetX: 0,
          opacity: 0,
        },
        subtitles: (currentProject.subtitles || []).map((s) => ({
          ...s,
          style: 'hormozi' as const,
          colorHex: '#FACC15',
          strokeHex: '#000000',
          uppercase: true,
          fontSize: 32,
        })),
      };

    case 'apple-minimal':
      return {
        canvasAspect: 'landscape16x9',
        deviceModelID: 'iphone-16-pro',
        deviceColorID: 'natural-titanium',
        scale: 0.85,
        offset: { width: 0, height: 0 },
        background: {
          type: 'solid',
          hex: SOLID_PRESETS[7] || '#F8FAFC',
        },
        transform3D: {
          enabled: false,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          perspective: 1000,
          autoDrift: false,
        },
        effects: {
          ...currentProject.effects,
          colorGrade: 'none',
          vignette: 0,
          filmGrain: 0,
          chromaticAberration: 0,
          scanlines: false,
          bloom: 0,
        },
        shadow: {
          enabled: true,
          colorHex: '#000000',
          radius: 48,
          offsetY: 24,
          offsetX: 0,
          opacity: 0.22,
        },
      };

    case 'streamer-highlight':
      return {
        canvasAspect: 'landscape16x9',
        deviceModelID: 'iphone-17-pro',
        deviceColorID: 'deep-blue',
        scale: 0.85,
        offset: { width: 0, height: 0 },
        background: {
          type: 'solid',
          hex: SOLID_PRESETS[4] || '#0F172A',
        },
        transform3D: {
          enabled: true,
          rotateX: 12,
          rotateY: 18,
          rotateZ: -4,
          perspective: 1000,
          autoDrift: false,
        },
        effects: {
          ...currentProject.effects,
          colorGrade: 'matrix',
          scanlines: true,
          vignette: 0.3,
          filmGrain: 0.08,
          chromaticAberration: 0.12,
          bloom: 0.25,
        },
        shadow: {
          enabled: true,
          colorHex: '#000000',
          radius: 32,
          offsetY: 16,
          offsetX: 6,
          opacity: 0.6,
        },
      };

    case 'dev-tutorial':
      return {
        canvasAspect: 'landscape16x9',
        deviceModelID: 'macbook-pro-14',
        deviceColorID: 'silver',
        scale: 0.88,
        offset: { width: 0, height: 0 },
        background: {
          type: 'gradient',
          gradient: GRADIENT_PRESETS[5] || {
            startHex: '#4338CA',
            endHex: '#0F172A',
            angleDegrees: 135,
          },
        },
        transform3D: {
          enabled: false,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          perspective: 1000,
          autoDrift: false,
        },
        effects: {
          ...currentProject.effects,
          colorGrade: 'studioBoost',
          vignette: 0.1,
          filmGrain: 0,
          chromaticAberration: 0,
          scanlines: false,
          bloom: 0,
        },
        shadow: {
          enabled: true,
          colorHex: '#000000',
          radius: 40,
          offsetY: 20,
          offsetX: 0,
          opacity: 0.4,
        },
        subtitles: (currentProject.subtitles || []).map((s) => ({
          ...s,
          style: 'minimal' as const,
          colorHex: '#FFFFFF',
          bgHex: '#0F172A',
          fontSize: 24,
        })),
      };

    default:
      return {};
  }
}
