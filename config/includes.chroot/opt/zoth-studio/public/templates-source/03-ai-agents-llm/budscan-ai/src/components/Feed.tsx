import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, AlertTriangle, ShieldAlert, CheckCircle2, Clock, User, Filter, ChevronDown, Award } from 'lucide-react';
import { Post } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

interface FeedProps {
  posts: Post[];
  onSelectTab?: (tab: string) => void;
}

export default function Feed({ posts, onSelectTab }: FeedProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fire' | 'suspect' | 'moldy' | 'pgr'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPosts = posts.filter(p => {
    if (activeFilter === 'all') return true;
    return p.quality === activeFilter;
  });

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'fire': return 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
      case 'suspect': return 'text-amber-400 border-amber-400/50 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
      case 'moldy': return 'text-red-400 border-red-400/50 bg-red-400/10 shadow-[0_0_10px_rgba(248,113,113,0.2)]';
      case 'pgr': return 'text-purple-400 border-purple-400/50 bg-purple-400/10 shadow-[0_0_10px_rgba(192,132,252,0.2)]';
      default: return 'text-slate-400 border-slate-400/50 bg-slate-400/10';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'fire': return <Zap className="w-3.5 h-3.5" />;
      case 'suspect': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'moldy': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'pgr': return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto pb-24">
        {/* Header & Filter Row */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter text-emerald-400 uppercase italic">
              Community Scan Feed
            </h2>
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 font-mono">
              {filteredPosts.length} SCANS
            </Badge>
          </div>

          {/* Quality Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {(['all', 'fire', 'suspect', 'moldy', 'pgr'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setActiveFilter(filterKey)}
                className={`px-2.5 py-1 rounded-lg border uppercase tracking-wider text-[10px] transition-all font-bold ${
                  activeFilter === filterKey
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
                aria-pressed={activeFilter === filterKey}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </header>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card className="bg-slate-900/60 border-slate-800 p-6 text-center text-slate-300 space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold">No scans found matching filter '{activeFilter.toUpperCase()}'.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="text-xs text-emerald-400 underline font-mono uppercase"
            >
              Reset Filters
            </button>
          </Card>
        )}

        {/* Feed Posts */}
        <div role="list" aria-label="Community Specimen Scan Posts" className="space-y-4">
          {filteredPosts.map((post, index) => {
            const isExpanded = expandedId === post.id;
            return (
              <motion.div
                key={post.id}
                role="listitem"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/70 border-slate-800/90 overflow-hidden group hover:border-emerald-500/30 transition-all backdrop-blur-sm">
                  {/* User Bar */}
                  <div className="p-3 flex items-center justify-between border-b border-slate-800/60 bg-black/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{post.userName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatTime(post.timestamp)}
                    </div>
                  </div>

                  {/* Image & Grade Badge */}
                  <div className="relative aspect-square bg-black">
                    <img
                      src={post.imageUrl}
                      alt={`Specimen scan by ${post.userName}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`uppercase font-black tracking-wider text-[10px] border px-2.5 py-1 ${getQualityColor(post.quality)}`}>
                        <span className="mr-1">{getQualityIcon(post.quality)}</span>
                        {post.quality}
                      </Badge>
                    </div>
                  </div>

                  {/* Summary & Terpenes */}
                  <div className="p-3.5 space-y-3">
                    <p className="text-xs text-slate-200 italic leading-relaxed bg-black/30 p-2.5 rounded-lg border border-slate-800/80">
                      "{post.details}"
                    </p>

                    <div className="space-y-1">
                      <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold tracking-wider">
                        Botanical Features
                      </div>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        {post.visualNotes}
                      </p>
                    </div>

                    {post.terpenes && post.terpenes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {post.terpenes.map(t => (
                          <Badge key={t} variant="secondary" className="text-[9px] font-mono bg-slate-800 text-emerald-300 border border-emerald-500/20">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {post.warnings && post.warnings.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold uppercase pt-2 border-t border-slate-800/80">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>{post.warnings[0]} {post.warnings.length > 1 ? `(+${post.warnings.length - 1} more)` : ''}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
