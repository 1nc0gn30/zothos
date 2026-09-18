export interface MemberProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  banner: string;
  website?: string;
  xHandle?: string;
  github?: string;
  building: string;
  likedPlaybooks: string[];
  admiredCreators: string[];
  votes: Record<string, 'up' | 'down' | null>;
  role: 'member' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreatorSubmission {
  id: string;
  submittedBy: string;
  handle: string;
  name: string;
  category: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface VoteSummary {
  creatorId: string;
  up: number;
  down: number;
  score: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function buildDefaultProfile(user: AuthUser): MemberProfile {
  const safeName = user.name || user.email.split('@')[0] || 'Builder';
  const handle = safeName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'builder';
  return {
    id: user.id,
    email: user.email,
    name: safeName,
    handle,
    bio: 'Just a builder learning from the best playbooks.',
    avatar: '',
    banner: '',
    building: '',
    likedPlaybooks: [],
    admiredCreators: [],
    votes: {},
    role: 'member',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
