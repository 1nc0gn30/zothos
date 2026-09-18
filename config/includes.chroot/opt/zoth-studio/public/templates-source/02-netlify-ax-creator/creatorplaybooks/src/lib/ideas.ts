import type { CreatorProfile, ContentIdea } from '../types';
export function generateIdeasForCreator(creator: CreatorProfile, count = 6): ContentIdea[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    format: ['post', 'thread', 'reply', 'quote', 'post', 'thread'][i % 6] as ContentIdea['format'],
    hook: creator.hooks[i % creator.hooks.length],
    angle: creator.angles[i % creator.angles.length],
    tags: [creator.tags[i % creator.tags.length], creator.tags[(i + 1) % creator.tags.length]],
  }));
}
