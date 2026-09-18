export interface Post {
  id: string;
  timestamp: number;
  imageUrl: string;
  quality: 'fire' | 'suspect' | 'moldy' | 'pgr';
  details: string;
  visualNotes: string;
  warnings: string[];
  terpenes?: string[];
  userName: string;
}

export const MOCK_POSTS: Post[] = [
  {
    id: 'seed-post-1',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=600&q=80',
    quality: 'fire',
    details: 'Exemplary craft-grade flower scanned in Denver CO. Dense glandular trichome coverage with 70% cloudy / 30% amber gland heads.',
    visualNotes: 'Uniform calyx swelling, clear capitate-stalked trichome heads, vibrant orange-purple pistils.',
    warnings: [],
    terpenes: ['Limonene', 'Caryophyllene', 'Linalool', 'Myrcene'],
    userName: 'CannabisSommelier_404',
  },
  {
    id: 'seed-post-2',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    imageUrl: 'https://images.unsplash.com/photo-1556928045-16f7f50be0f3?auto=format&fit=crop&w=600&q=80',
    quality: 'moldy',
    details: 'CRITICAL SAFETY HAZARD: Micro-fungal filaments and web-like mycelium (Botrytis cinerea) detected inside inner node structures.',
    visualNotes: 'Greyish web-like fuzz across calyx bases, damp discolored leaf margins, active spore cluster signature.',
    warnings: ['DO NOT CONSUME: Severe fungal spore hazard detected', 'Quarantine specimen to protect healthy inventory'],
    terpenes: ['Caryophyllene', 'Pinene'],
    userName: 'LabSafetyInspector_77',
  },
  {
    id: 'seed-post-3',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1536819114556-1e10f967fb61?auto=format&fit=crop&w=600&q=80',
    quality: 'pgr',
    details: 'HIGH SYNTHETIC RISK: Abnormally compressed nugget structure with heavy red-brown pistil saturation and near-zero outer trichome heads.',
    visualNotes: 'Unnatural density, truncated calyxes, heavy matting of amber-brown hairs with minimal resin glands.',
    warnings: ['PGR ALERT: Synthetic hormone growth regulators suspected'],
    terpenes: ['Pinene', 'Terpinolene'],
    userName: 'QualityControlAgent_09',
  }
];
