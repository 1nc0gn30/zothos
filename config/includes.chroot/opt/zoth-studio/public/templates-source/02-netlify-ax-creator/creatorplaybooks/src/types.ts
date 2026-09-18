export interface CreatorProfile {
  id: string;
  handle: string;
  xHandle: string;
  name: string;
  status: 'verified' | 'active' | 'draft';
  emoji: string;
  avatar: string;
  banner: string;
  followers: number;
  followersStr: string;
  bio: string;
  category: 'netlify-shippers' | 'indie-hackers' | 'big-players';
  products: { name: string; url: string; description: string }[];
  pillars: string[];
  milestones: { label: string; value: string }[];
  media: string[];
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bg?: string;
    surface?: string;
    surface2?: string;
  };
  plays: GrowthPlay[];
  hooks: string[];
  angles: string[];
  tags: string[];
}

export type MayaProfile = CreatorProfile;

export interface BuilderProfile {
  name: string;
  handle: string;
  bio: string;
  project: string;
  url: string;
  goal: string;
  streak: number;
  xp: number;
  avatar: string;
  accessibilityPreferences?: {
    largeText?: boolean;
    highContrast?: boolean;
    reducedMotion?: boolean;
  };
}

export interface GrowthPlay {
  id: string;
  emoji: string;
  title: string;
  description: string;
  action: string;
  frequency: string;
}

export interface ContentIdea {
  id: string;
  format: 'post' | 'thread' | 'reply' | 'quote';
  hook: string;
  angle: string;
  tags: string[];
}

export interface UserProgress {
  streak: number;
  postsThisWeek: number;
  repliesToday: number;
  lastPostDate: string;
  xp: number;
}

export interface GrowthScore {
  overall: number;
  consistency: number;
  engagement: number;
  distribution: number;
  authenticity: number;
}

export interface ScheduledPost {
  id: string;
  day: string;
  content: string;
  format: 'post' | 'thread' | 'reply';
}

export type Tab = 'creators' | 'dashboard' | 'me' | 'docs';