import { 
  BackgroundOption, 
  CanvasAspectRatioType, 
  PhoneShadow, 
  Device3DTransform,
  AudioTrack,
  ZoomSegment, 
  TapEvent, 
  SpeedSegment, 
  TextOverlay,
  SubtitleItem,
  StickerItem,
  WatermarkConfig,
  VideoEffectsConfig,
  SelectedEvent,
  ProgressBarConfig,
  MetaEditsConfig,
  TransitionItem,
  TypewriterOverlayItem,
  ImageOverlayItem,
} from './models';

export interface ProjectState {
  videoURL: string | null;
  displayName: string | null;
  videoNaturalWidth: number;
  videoNaturalHeight: number;
  videoDuration: number;
  currentSeconds: number;
  isPlaying: boolean;
  isMuted: boolean;

  scale: number;
  offset: { width: number; height: number };
  background: BackgroundOption;
  canvasAspect: CanvasAspectRatioType;
  shadow: PhoneShadow;
  transform3D: Device3DTransform;
  effects: VideoEffectsConfig;
  metaEdits?: MetaEditsConfig;
  watermark: WatermarkConfig;

  deviceModelID: string;
  deviceColorID: string;

  bareCornerRadius: number;
  bareBezelWidth: number;
  bareBezelHex: string;

  desktopFrame?: {
    title?: string;
    url?: string;
    theme?: 'dark' | 'light' | 'translucent';
    trafficLights?: 'macos' | 'windows' | 'minimal' | 'none';
    showUrlBar?: boolean;
  };

  cursor?: {
    enabled: boolean;
    style: 'macos' | 'dot' | 'laser' | 'glow';
    colorHex: string;
    size: number;
    clickRipples: boolean;
  };

  progressBar?: ProgressBarConfig;

  animations: ZoomSegment[];
  tapEvents: TapEvent[];
  speedSegments: SpeedSegment[];
  transitions: TransitionItem[];
  overlays: TextOverlay[];
  subtitles: SubtitleItem[];
  stickers: StickerItem[];
  typewriters?: TypewriterOverlayItem[];
  imageOverlays?: ImageOverlayItem[];
  audioTracks: AudioTrack[];
  selectedEvent: SelectedEvent;
  snapToBeat?: boolean;

  trimStartTime: number;
  trimEndTime: number;
  clipTimelineStart: number;

  isExporting: boolean;
  exportProgress: number;
  exportType: 'background' | 'transparent' | null;
}
