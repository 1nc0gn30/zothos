import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowRight, X, ZoomIn, ZoomOut, Maximize2, Eye, EyeOff, Info } from 'lucide-react';
import type { CreatorProfile } from '../types';
import { CATEGORIES } from '../lib/creators';
import '../styles/flow.css';

interface PlaybookFlowProps {
  creators: CreatorProfile[];
  onOpenCreator: (creator: CreatorProfile) => void;
}

interface FlowNode {
  id: string;
  x: number;
  y: number;
  category: string;
  creator: CreatorProfile;
}

interface FlowConnection {
  id: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  path: string;
  midX: number;
  midY: number;
  color: string;
  gradientId: string;
  sameCategory: boolean;
  sharedTags: string[];
  explanation: string;
  strength: number;
}

const CANVAS_W = 1500;
const CANVAS_H = 1150;

const CATEGORY_CLUSTERS: Record<string, { x: number; y: number; label: string; color: string }> = {
  'netlify-shippers': { x: 360, y: 360, label: 'Netlify Shippers', color: '#22d3ee' },
  'indie-hackers':    { x: 1000, y: 310, label: 'Indie Hackers',  color: '#f59e0b' },
  'big-players':      { x: 720, y: 820, label: 'Big Players',      color: '#ec4899' },
};

function computeBezier(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const offset = Math.max(40, Math.abs(dx) * 0.35);
  const cp1x = from.x + offset;
  const cp1y = from.y;
  const cp2x = to.x - offset;
  const cp2y = to.y;
  return {
    path: `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`,
    midX: (from.x + to.x) / 2,
    midY: (from.y + to.y) / 2,
  };
}

function buildExplanation(a: CreatorProfile, sameCat: boolean, sharedTags: string[]): string {
  const parts: string[] = [];
  if (sameCat) {
    const catInfo = CATEGORIES.find(c => c.id === a.category);
    parts.push(`Both are ${catInfo?.label || a.category}`);
  }
  if (sharedTags.length > 0) {
    parts.push(`Share ${sharedTags.length} ${sharedTags.length === 1 ? 'topic' : 'topics'}: ${sharedTags.slice(0, 5).join(', ')}`);
  }
  if (parts.length === 0) parts.push('Connected in the same community');
  return parts.join('. ');
}

export function PlaybookFlow({ creators, onOpenCreator }: PlaybookFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [activeConn, setActiveConn] = useState<string | null>(null);
  const [showAllConnections, setShowAllConnections] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const hasMoved = useRef(false);
  const pinchRef = useRef<{ dist: number; scale: number; cx: number; cy: number } | null>(null);
  const isPinching = useRef(false);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  // ── NODE POSITIONS ──────────────────────────────────────
  const nodes = useMemo(() => {
    const byCat: Record<string, CreatorProfile[]> = {};
    creators.forEach(c => {
      if (!byCat[c.category]) byCat[c.category] = [];
      byCat[c.category].push(c);
    });

    const result: FlowNode[] = [];
    for (const [cat, members] of Object.entries(byCat)) {
      const center = CATEGORY_CLUSTERS[cat] || { x: 700, y: 500 };
      const n = members.length;
      const radius = n <= 1 ? 0 : Math.max(70, Math.min(200, n * 14));
      members.forEach((cr, i) => {
        const angle = n <= 1 ? 0 : (i / n) * 2 * Math.PI - Math.PI / 2;
        result.push({
          id: cr.id,
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
          category: cat,
          creator: cr,
        });
      });
    }
    return result;
  }, [creators]);

  // ── CONNECTIONS ─────────────────────────────────────────
  const connections = useMemo(() => {
    const result: FlowConnection[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const byCat: Record<string, number[]> = {};
    creators.forEach((c, idx) => {
      if (!byCat[c.category]) byCat[c.category] = [];
      byCat[c.category].push(idx);
    });

    // Within-category ring + cross-links
    for (const [, indices] of Object.entries(byCat)) {
      const n = indices.length;
      // Ring connections (skip if only 1 member - would self-loop)
      for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        if (n <= 1) continue;
        const a = creators[indices[i]];
        const b = creators[indices[next]];
        const fn = nodeMap.get(a.id);
        const tn = nodeMap.get(b.id);
        if (!fn || !tn) continue;
        const bez = computeBezier(fn, tn);
        const sharedTags = a.tags.filter(t => b.tags.includes(t));
        result.push({
          id: `${a.id}__${b.id}`, from: a.id, to: b.id,
          fromName: a.name, toName: b.name,
          ...bez, color: a.theme.primary,
          gradientId: `g-${a.id}__${b.id}`,
          sameCategory: true, sharedTags, strength: 2 + sharedTags.length,
          explanation: buildExplanation(a, true, sharedTags),
        });
      }
      // Cross-links (3+ shared tags, need at least 3 members to be meaningful)
      for (let i = 0; i < n; i++) {
        for (let j = i + 2; j < n; j++) {
          if (n <= 2) continue;
          const a = creators[indices[i]];
          const b = creators[indices[j]];
          const sharedTags = a.tags.filter(t => b.tags.includes(t));
          if (sharedTags.length >= 3) {
            const fn = nodeMap.get(a.id);
            const tn = nodeMap.get(b.id);
            if (!fn || !tn) continue;
            const bez = computeBezier(fn, tn);
            result.push({
              id: `${a.id}__${b.id}`, from: a.id, to: b.id,
              fromName: a.name, toName: b.name,
              ...bez, color: a.theme.accent || a.theme.primary,
              gradientId: `g-${a.id}__${b.id}`,
              sameCategory: true, sharedTags, strength: 1 + sharedTags.length,
              explanation: buildExplanation(a, true, sharedTags),
            });
          }
        }
      }
    }

    // Cross-category connections (3+ shared tags)
    for (let i = 0; i < creators.length; i++) {
      for (let j = i + 1; j < creators.length; j++) {
        if (creators[i].category === creators[j].category) continue;
        const a = creators[i];
        const b = creators[j];
        const sharedTags = a.tags.filter(t => b.tags.includes(t));
        if (sharedTags.length >= 3) {
          const fn = nodeMap.get(a.id);
          const tn = nodeMap.get(b.id);
          if (!fn || !tn) continue;
          const bez = computeBezier(fn, tn);
          result.push({
            id: `${a.id}__${b.id}`, from: a.id, to: b.id,
            fromName: a.name, toName: b.name,
            ...bez, color: a.theme.secondary,
            gradientId: `g-${a.id}__${b.id}`,
            sameCategory: false, sharedTags, strength: sharedTags.length,
            explanation: buildExplanation(a, false, sharedTags),
          });
        }
      }
    }
    return result;
  }, [creators, nodes]);

  // ── FIT VIEW ───────────────────────────────────────────
  const fitView = useCallback(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - 60;
    const maxX = Math.max(...xs) + 60;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const scale = Math.min(rect.width / contentW, rect.height / contentH, 1.3);
    const x = (rect.width - contentW * scale) / 2 - minX * scale;
    const y = (rect.height - contentH * scale) / 2 - minY * scale;
    setTransform({ x, y, scale });
  }, [nodes]);

  useEffect(() => {
    const timer = setTimeout(() => fitView(), 100);
    return () => clearTimeout(timer);
  }, [fitView]);

  // ── WHEEL ZOOM (native listener for non-passive) ──────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const t = transformRef.current;
      const delta = -e.deltaY * 0.0015;
      const newScale = Math.max(0.2, Math.min(3, t.scale * (1 + delta)));
      const ratio = newScale / t.scale;
      setTransform({
        x: mx - (mx - t.x) * ratio,
        y: my - (my - t.y) * ratio,
        scale: newScale,
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── MOUSE PAN ──────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (isPinching.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('.flow-node') || target.closest('.flow-expanded-card') || target.closest('.flow-conn-hit')) return;
    hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved.current = true;
    if (hasMoved.current) {
      setTransform(prev => ({ ...prev, x: dragStart.current!.tx + dx, y: dragStart.current!.ty + dy }));
    }
  };

  const onPointerUp = () => {
    if (!hasMoved.current && dragStart.current && !isPinching.current) {
      setExpandedNode(null);
      setActiveConn(null);
    }
    dragStart.current = null;
    hasMoved.current = false;
  };

  // ── TOUCH PAN + PINCH ──────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      dragStart.current = null;
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = rect ? (t1.clientX + t2.clientX) / 2 - rect.left : 0;
      const cy = rect ? (t1.clientY + t2.clientY) / 2 - rect.top : 0;
      pinchRef.current = { dist, scale: transform.scale, cx, cy };
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY);
      if (target instanceof HTMLElement && (target.closest('.flow-node') || target.closest('.flow-expanded-card') || target.closest('.flow-conn-hit'))) return;
      hasMoved.current = false;
      dragStart.current = { x: t.clientX, y: t.clientY, tx: transform.x, ty: transform.y };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (pinchRef.current && e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const t = transformRef.current;
      const newScale = Math.max(0.2, Math.min(3, pinchRef.current.scale * (dist / pinchRef.current.dist)));
      const ratio = newScale / t.scale;
      setTransform({
        x: pinchRef.current.cx - (pinchRef.current.cx - t.x) * ratio,
        y: pinchRef.current.cy - (pinchRef.current.cy - t.y) * ratio,
        scale: newScale,
      });
    } else if (dragStart.current && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) hasMoved.current = true;
      if (hasMoved.current) {
        setTransform(prev => ({ ...prev, x: dragStart.current!.tx + dx, y: dragStart.current!.ty + dy }));
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!hasMoved.current && dragStart.current && e.touches.length === 0) {
      setExpandedNode(null);
      setActiveConn(null);
    }
    dragStart.current = null;
    if (e.touches.length === 0) {
      pinchRef.current = null;
      isPinching.current = false;
    }
    hasMoved.current = false;
  };

  // ── INTERACTION HANDLERS ───────────────────────────────
  const handleNodeClick = (id: string) => {
    if (hasMoved.current) return;
    setExpandedNode(prev => prev === id ? null : id);
    setActiveConn(null);
  };

  const handleConnClick = (conn: FlowConnection) => {
    if (hasMoved.current) return;
    setActiveConn(prev => prev === conn.id ? null : conn.id);
    setExpandedNode(null);
  };

  // ── VISIBILITY HELPERS ─────────────────────────────────
  const connState = (conn: FlowConnection): 'highlighted' | 'normal' | 'dimmed' | 'hidden' => {
    if (activeConn === conn.id) return 'highlighted';
    if (!showAllConnections && !expandedNode && !activeConn) return 'hidden';
    if (expandedNode && (conn.from === expandedNode || conn.to === expandedNode)) return 'highlighted';
    if (expandedNode || activeConn) return 'dimmed';
    return 'normal';
  };

  const nodeState = (id: string): 'expanded' | 'dimmed' | 'normal' => {
    if (expandedNode === id) return 'expanded';
    if (expandedNode && expandedNode !== id) return 'dimmed';
    return 'normal';
  };

  // ── ACTIVE DATA ────────────────────────────────────────
  const activeConnData = connections.find(c => c.id === activeConn);
  const expandedNodeData = nodes.find(n => n.id === expandedNode);

  const connPopupPos = activeConnData ? (() => {
    const raw = {
      x: activeConnData.midX * transform.scale + transform.x,
      y: activeConnData.midY * transform.scale + transform.y,
    };
    if (!containerRef.current) return raw;
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.max(140, Math.min(rect.width - 140, raw.x)),
      y: Math.max(60, Math.min(rect.height - 60, raw.y)),
    };
  })() : null;

  const expandedCardPos = expandedNodeData ? (() => {
    const cardW = 250;
    const offset = 45;
    const x = expandedNodeData.x < CANVAS_W / 2
      ? expandedNodeData.x + offset
      : expandedNodeData.x - offset - cardW;
    const y = expandedNodeData.y - 70;
    return { x, y };
  })() : null;

  return (
    <div className="flow-container">
      <div className="flow-bg-grid" />
      <div className="flow-glow-orb flow-glow-pink" />
      <div className="flow-glow-orb flow-glow-cyan" />

      {/* Info bar */}
      {showInfo && (
        <div className="flow-info-bar">
          <div className="flow-info-content">
            <Info size={14} className="flow-info-icon" />
            <div>
              <span className="flow-info-title">Playbook Flow Canvas</span>
              <span className="flow-info-text">Drag to pan - scroll to zoom - tap a mentor to expand - tap a connection to see why they're linked</span>
            </div>
          </div>
          <button className="flow-info-close" onClick={() => setShowInfo(false)}><X size={13} /></button>
        </div>
      )}

      {/* Canvas */}
      <div
        className="flow-viewport"
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {creators.length === 0 ? (
          <div className="flow-empty">
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>No mentors found</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>Try adjusting filters on the Mentors tab</div>
          </div>
        ) : (
          <div
            className="flow-content"
            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
          >
            {/* SVG connections */}
            <svg className="flow-svg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} fill="none" preserveAspectRatio="xMidYMid meet">
              <defs>
                {connections.map(conn => (
                  <linearGradient key={conn.gradientId} id={conn.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={conn.color} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={conn.sameCategory ? '#8b5cf6' : '#22d3ee'} stopOpacity="0.75" />
                  </linearGradient>
                ))}
                <filter id="flow-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {connections.map(conn => {
                const s = connState(conn);
                if (s === 'hidden') return null;
                return (
                  <g key={conn.id} className={`flow-conn-group flow-conn-${s}`}>
                    {/* Invisible hit area */}
                    <path
                      d={conn.path}
                      stroke="transparent"
                      strokeWidth={28}
                      fill="none"
                      className="flow-conn-hit"
                      onClick={() => handleConnClick(conn)}
                    />
                    {/* Glow underlay */}
                    {s === 'highlighted' && (
                      <path
                        d={conn.path}
                        stroke={`url(#${conn.gradientId})`}
                        strokeWidth={10}
                        fill="none"
                        opacity={0.25}
                        filter="url(#flow-glow)"
                      />
                    )}
                    {/* Main path */}
                    <path
                      d={conn.path}
                      stroke={`url(#${conn.gradientId})`}
                      strokeWidth={s === 'highlighted' ? 3 : s === 'dimmed' ? 1 : 1.5}
                      fill="none"
                      className="flow-conn-path"
                    />
                    {/* Animated dash */}
                    <path
                      d={conn.path}
                      stroke={conn.sameCategory ? '#ffffff' : '#22d3ee'}
                      strokeWidth={s === 'highlighted' ? 1.5 : 0.8}
                      fill="none"
                      opacity={s === 'highlighted' ? 0.65 : s === 'dimmed' ? 0.1 : 0.3}
                      className="flow-conn-dash"
                    />
                    {/* Sparkle */}
                    {s === 'highlighted' && (
                      <circle r="3" fill="#fff" className="flow-sparkle">
                        <animateMotion dur="2.5s" repeatCount="indefinite" path={conn.path} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Category cluster labels */}
            {Object.entries(CATEGORY_CLUSTERS).map(([cat, info]) => {
              const count = nodes.filter(n => n.category === cat).length;
              if (count === 0) return null;
              return (
                <div
                  key={cat}
                  className="flow-cluster-label"
                  style={{ left: info.x, top: info.y, '--cluster-color': info.color } as React.CSSProperties}
                >
                  <span className="flow-cluster-dot" style={{ background: info.color }} />
                  {info.label}
                  <span className="flow-cluster-count">{count}</span>
                </div>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const s = nodeState(node.id);
              const initials = node.creator.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
              const catColor = CATEGORY_CLUSTERS[node.category]?.color || '#8b5cf6';
              return (
                <div
                  key={node.id}
                  className={`flow-node flow-node-${s}`}
                  style={{ left: node.x, top: node.y, '--cat-color': catColor } as React.CSSProperties}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="flow-node-ring">
                    {node.creator.avatar ? (
                      <img src={node.creator.avatar} alt={node.creator.name} className="flow-node-avatar" draggable={false} />
                    ) : (
                      <div className="flow-node-avatar-fallback" style={{ background: `linear-gradient(135deg, ${node.creator.theme.primary}, ${node.creator.theme.secondary})` }}>
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="flow-node-label">{node.creator.name.split(' ')[0]}</div>
                </div>
              );
            })}

            {/* Expanded card */}
            {expandedNodeData && expandedCardPos && (
              <div
                className="flow-expanded-card"
                style={{
                  left: expandedCardPos.x,
                  top: expandedCardPos.y,
                  '--card-accent': expandedNodeData.creator.theme.primary,
                } as React.CSSProperties}
                onClick={e => e.stopPropagation()}
              >
                <button className="flow-card-close" onClick={() => setExpandedNode(null)}><X size={12} /></button>
                <div className="flow-card-header">
                  <div className="flow-card-avatar">
                    {expandedNodeData.creator.avatar ? (
                      <img src={expandedNodeData.creator.avatar} alt={expandedNodeData.creator.name} />
                    ) : (
                      <div className="flow-card-avatar-fallback" style={{ background: `linear-gradient(135deg, ${expandedNodeData.creator.theme.primary}, ${expandedNodeData.creator.theme.secondary})` }}>
                        {expandedNodeData.creator.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flow-card-info">
                    <h3>{expandedNodeData.creator.name}</h3>
                    <span>{expandedNodeData.creator.handle}</span>
                  </div>
                </div>
                <p className="flow-card-bio">{expandedNodeData.creator.bio.split('\n')[0]}</p>
                <div className="flow-card-stats">
                  <div className="flow-card-stat">
                    <span className="flow-card-stat-val">{expandedNodeData.creator.followersStr}</span>
                    <span className="flow-card-stat-lbl">Followers</span>
                  </div>
                  <div className="flow-card-stat">
                    <span className="flow-card-stat-val">{expandedNodeData.creator.plays.length}</span>
                    <span className="flow-card-stat-lbl">Plays</span>
                  </div>
                  <div className="flow-card-stat">
                    <span className="flow-card-stat-val">{expandedNodeData.creator.tags.length}</span>
                    <span className="flow-card-stat-lbl">Tags</span>
                  </div>
                </div>
                <div className="flow-card-tags">
                  {expandedNodeData.creator.tags.slice(0, 5).map(tag => (
                    <span key={tag} className="flow-card-tag">#{tag}</span>
                  ))}
                </div>
                <div className="flow-card-connections">
                  {connections.filter(c => c.from === expandedNodeData.id || c.to === expandedNodeData.id).length} connections
                </div>
                <button
                  className="flow-card-open"
                  onClick={e => { e.stopPropagation(); onOpenCreator(expandedNodeData.creator); }}
                  style={{ '--accent': expandedNodeData.creator.theme.primary } as React.CSSProperties}
                >
                  Open Playbook <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connection explanation popup */}
      {activeConnData && connPopupPos && (
        <div className="flow-conn-popup" style={{ left: connPopupPos.x, top: connPopupPos.y }}>
          <button className="flow-popup-close" onClick={() => setActiveConn(null)}><X size={11} /></button>
          <div className="flow-popup-header">
            <span className="flow-popup-name">{activeConnData.fromName}</span>
            <span className="flow-popup-link" />
            <span className="flow-popup-name">{activeConnData.toName}</span>
          </div>
          <div className="flow-popup-body">
            {activeConnData.sameCategory && (
              <div className="flow-popup-badge">Same Community</div>
            )}
            <p className="flow-popup-explain">{activeConnData.explanation}</p>
            {activeConnData.sharedTags.length > 0 && (
              <div className="flow-popup-tags">
                {activeConnData.sharedTags.map(tag => (
                  <span key={tag} className="flow-popup-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flow-toolbar">
        <button className="flow-tool-btn" onClick={() => setTransform(p => ({ ...p, scale: Math.min(3, p.scale * 1.25) }))} title="Zoom in"><ZoomIn size={15} /></button>
        <button className="flow-tool-btn" onClick={() => setTransform(p => ({ ...p, scale: Math.max(0.2, p.scale / 1.25) }))} title="Zoom out"><ZoomOut size={15} /></button>
        <button className="flow-tool-btn" onClick={fitView} title="Fit view"><Maximize2 size={15} /></button>
        <div className="flow-tool-sep" />
        <button
          className={`flow-tool-btn ${showAllConnections ? 'active' : ''}`}
          onClick={() => setShowAllConnections(!showAllConnections)}
          title={showAllConnections ? 'Hide connections' : 'Show connections'}
        >
          {showAllConnections ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <div className="flow-tool-zoom">{Math.round(transform.scale * 100)}%</div>
      </div>

      {/* Legend */}
      <div className="flow-legend">
        {Object.entries(CATEGORY_CLUSTERS).map(([cat, info]) => {
          const count = nodes.filter(n => n.category === cat).length;
          if (count === 0) return null;
          return (
            <div key={cat} className="flow-legend-item">
              <span className="flow-legend-dot" style={{ background: info.color }} />
              {info.label}
              <span className="flow-legend-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}