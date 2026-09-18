export const MAYA = {
  handle: '@buildwithmaya',
  name: 'Maya',
  emoji: '🐼',
  avatar: '/maya/avatar.jpg',
  banner: '/maya/banner.jpg',
  followers: 1636,
  bio: 'just me, my laptop, and ideas\ndesigning + building + 9 to 5\nSharing lessons to help you build faster',
  products: [
    { name: 'IdeaPanda', url: 'https://getideapanda.com', description: 'Validated idea discovery tool' },
    { name: 'Newbie Marketer', url: 'https://newbiemarketer.to', description: 'Newsletter on distribution & marketing for builders' },
  ],
  pillars: [
    'Build in public — share the process, not just the result',
    'Distribution > code — great product dies without eyeballs',
    'Post daily — consistency compounds faster than virality',
    'Give away the playbook — teach everything you learn',
    'Iterate publicly — ship fast, learn out loud',
  ],
  milestones: [
    { label: 'Followers', value: '1,636+' },
    { label: 'Posts', value: '4,888' },
    { label: 'Products', value: '2' },
    { label: 'Newsletter', value: 'Issue #2' },
  ],
  media: [
    '/maya/media1.jpg',
    '/maya/media2.png',
    '/maya/media3.jpg',
    '/maya/media4.jpg',
    '/maya/media5.jpg',
    '/maya/media6.jpg',
  ],
};

export type MayaProfile = typeof MAYA;

export interface GrowthPlay {
  id: string;
  emoji: string;
  title: string;
  description: string;
  action: string;
  frequency: string;
}

export const PLAYS: GrowthPlay[] = [
  {
    id: 'public',
    emoji: '📢',
    title: 'Build in public',
    description: 'Share what you are building before it is perfect. Progress screenshots, failed experiments, and lessons earn trust faster than polished launches.',
    action: 'Post one honest update about your current project today.',
    frequency: 'Daily',
  },
  {
    id: 'distribution',
    emoji: '📡',
    title: 'Distribution first',
    description: 'The best product loses to the one with distribution. Comment on relevant posts, answer questions, and make friends before you need anything.',
    action: 'Leave 5 thoughtful replies on posts in your niche today.',
    frequency: 'Daily',
  },
  {
    id: 'volume',
    emoji: '⚡',
    title: 'Volume + speed',
    description: 'Speed reveals what works. Post frequently, measure engagement, and double down on the formats that resonate.',
    action: 'Ship one post and one thread this week.',
    frequency: 'Weekly',
  },
  {
    id: 'reciprocity',
    emoji: '🤝',
    title: 'Community reciprocity',
    description: 'Champion other builders. Celebrate wins, share their work, and show up in DMs. People remember who helped them before they were big.',
    action: 'Quote-post or retweet one smaller builder today.',
    frequency: 'Daily',
  },
  {
    id: 'owned',
    emoji: '📬',
    title: 'Own your distribution',
    description: 'X is rented land. Capture emails, build a newsletter, or start a simple waitlist so your audience survives algorithm changes.',
    action: 'Add a newsletter signup to your project or profile this week.',
    frequency: 'Weekly',
  },
  {
    id: 'iterate',
    emoji: '🔄',
    title: 'Iterate in public',
    description: 'Ship rough, gather feedback, improve visibly. Every update is a new chance to tell your story.',
    action: 'Ask your audience one question about your product today.',
    frequency: 'Daily',
  },
];

export interface ContentIdea {
  id: string;
  format: 'post' | 'thread' | 'reply' | 'quote';
  hook: string;
  angle: string;
  tags: string[];
}

const hooks = [
  'I shipped 12 projects in 12 months. Here is what I learned.',
  'The best founders I know do this one thing differently.',
  'Nobody talks about this part of building in public.',
  'I asked 50 builders how they get users. These 5 patterns won.',
  'One change that doubled my reply rate on X.',
  'Why your product is not the problem — your distribution is.',
];

const angles = [
  'Lead with the lesson, then the backstory.',
  'Share a specific number or metric to build credibility.',
  'Make it about the reader, not about you.',
  'Give away one actionable tactic in the first line.',
  'Use a before/after hook to create curiosity.',
  'Tag a creator whose idea inspired your take.',
];

const tags = ['buildinpublic', 'indiehackers', 'startups', 'solopreneur', 'marketing', 'product'];

export function generateIdeas(count = 6): ContentIdea[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    format: ['post', 'thread', 'reply', 'quote', 'post', 'thread'][i % 6] as ContentIdea['format'],
    hook: hooks[i % hooks.length],
    angle: angles[i % angles.length],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
  }));
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

export function defaultProgress(): UserProgress {
  return { streak: 3, postsThisWeek: 5, repliesToday: 8, lastPostDate: new Date().toISOString().slice(0, 10), xp: 145 };
}

export function scoreProgress(p: UserProgress): GrowthScore {
  const consistency = Math.min(100, p.streak * 10 + p.postsThisWeek * 5);
  const engagement = Math.min(100, p.repliesToday * 6 + 20);
  const distribution = Math.min(100, p.postsThisWeek * 8);
  const authenticity = Math.min(100, 50 + p.xp / 10);
  const overall = Math.round((consistency + engagement + distribution + authenticity) / 4);
  return { overall, consistency, engagement, distribution, authenticity };
}

export function levelFromXp(xp: number) {
  if (xp < 200) return { level: 1, title: 'Seedling', next: 200 };
  if (xp < 500) return { level: 2, title: 'Sprout', next: 500 };
  if (xp < 1000) return { level: 3, title: 'Growth Engine', next: 1000 };
  return { level: 4, title: 'Audience Magnet', next: 2000 };
}

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
}

export function defaultBuilder(): BuilderProfile {
  return {
    name: 'Your name',
    handle: '@yourhandle',
    bio: 'Building in public.\nSharing what I learn as I ship.',
    project: 'Your project',
    url: 'https://yourproject.com',
    goal: 'Post daily for 30 days and grow to 500 followers.',
    streak: 0,
    xp: 0,
    avatar: '/maya/avatar.jpg',
  };
}

export type ScheduledPost = {
  id: string;
  day: string;
  content: string;
  format: 'post' | 'thread' | 'reply';
};
