import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CreatorProfile } from '../types';

interface HoneycombWebGLGridProps {
  filteredCreators: CreatorProfile[];
  openCreatorModal: (c: CreatorProfile) => void;
  modalCreatorId: string | null;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '236, 72, 153';
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 2) {
  const words = text.split(' ');
  let line = '', cy = y, lc = 0;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxW && n > 0) {
      ctx.fillText(line.trim(), x, cy);
      line = words[n] + ' ';
      cy += lh;
      lc++;
      if (lc >= maxLines - 1) {
        const rest = words.slice(n + 1).join(' ');
        ctx.fillText((rest ? line.trim() + ' ' + rest : line.trim()).slice(0, 38) + '…', x, cy);
        return;
      }
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
}

function drawHexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + i * (Math.PI * 2 / 6);
    const px = cx + r * Math.cos(a);
    const py = cy - r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function HoneycombWebGLGrid({ filteredCreators, openCreatorModal, modalCreatorId }: HoneycombWebGLGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const texturesRef = useRef<Record<string, THREE.CanvasTexture>>({});
  const canvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});
  
  const [interacted, setInteracted] = useState(false);
  const interactedRef = useRef(false);

  const [zoomedInCreator, setZoomedInCreator] = useState<CreatorProfile | null>(null);
  const zoomedInCreatorRef = useRef<CreatorProfile | null>(null);

  const handleInteract = () => {
    interactedRef.current = true;
    setInteracted(true);
  };

  // Reset zoom state if modal closes
  useEffect(() => {
    if (modalCreatorId === null) {
      zoomedInCreatorRef.current = null;
      setZoomedInCreator(null);
    }
  }, [modalCreatorId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 700;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return;

    const loseCtxExt = gl.getExtension('WEBGL_lose_context');
    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050510, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    const defaultCamPos = new THREE.Vector3(0, 0, 9.0);
    camera.position.copy(defaultCamPos);

    // ── SPACE SCENE ──────────────────────────────────────────────
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const sp = new Float32Array(starCount * 3);
    const sc = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 80;
      sp[i * 3 + 1] = (Math.random() - 0.5) * 50;
      sp[i * 3 + 2] = -8 - Math.random() * 40;
      sc[i * 3] = 0.7 + Math.random() * 0.3;
      sc[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      sc[i * 3 + 2] = 0.85 + Math.random() * 0.15;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.07, transparent: true, opacity: 0.85, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const nebGeo = new THREE.SphereGeometry(6, 16, 16);
    const mkNeb = (col: number, op: number, p: [number, number, number], s: [number, number, number]) => {
      const m = new THREE.Mesh(nebGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.position.set(...p); m.scale.set(...s); scene.add(m); return m;
    };
    const neb1 = mkNeb(0xec4899, 0.025, [-8, 5, -18], [2.5, 1.8, 1]);
    const neb2 = mkNeb(0x8b5cf6, 0.02, [9, -4, -20], [3, 2, 1]);
    mkNeb(0x22d3ee, 0.018, [1, 1, -25], [4, 3, 1]);
    mkNeb(0x6366f1, 0.015, [-3, -5, -22], [2, 2.5, 1]);

    // ── LIGHTING ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(2, 4, 8); scene.add(key);
    const fill = new THREE.DirectionalLight(0x8b5cf6, 0.4);
    fill.position.set(-4, -2, 5); scene.add(fill);
    const rim = new THREE.DirectionalLight(0x22d3ee, 0.35);
    rim.position.set(0, -1, -4); scene.add(rim);
    const spot = new THREE.SpotLight(0xffffff, 1.8, 20, Math.PI / 5, 0.5, 1);
    spot.position.set(0, 0, 7); scene.add(spot);

    // ── LAYOUT ───────────────────────────────────────────────────
    const getPlacement = (idx: number, total: number) => {
      let row = 0, col = 0;
      const out: { x: number; y: number }[] = [];
      for (let i = 0; i < total; i++) {
        const odd = row % 2 === 1;
        const cap = odd ? 2 : 3;
        out.push({ x: (col - (cap - 1) / 2) * 2.85, y: -row * 2.45 });
        col++;
        if (col >= cap) { row++; col = 0; }
      }
      const ys = out.map(p => p.y);
      const off = -(Math.min(...ys) + Math.max(...ys)) / 2;
      return out[idx] ? { x: out[idx].x, y: out[idx].y + off } : { x: 0, y: 0 };
    };

    // ── CARD TEXTURE ─────────────────────────────────────────────
    const TEX = 1024;
    const PADDING = 78;
    const renderCardCanvas = (cr: CreatorProfile) => {
      let cv = canvasesRef.current[cr.id];
      if (!cv) { cv = document.createElement('canvas'); cv.width = TEX; cv.height = TEX; canvasesRef.current[cr.id] = cv; }
      const ctx = cv.getContext('2d')!;
      const cx = TEX / 2;
      const primaryRgb = hexToRgb(cr.theme.primary);
      const secondaryRgb = hexToRgb(cr.theme.secondary || cr.theme.primary);
      const accentRgb = hexToRgb(cr.theme.accent || cr.theme.primary);

      ctx.clearRect(0, 0, TEX, TEX);
      ctx.save();

      // Clip to hex shape for all background painting
      drawHexPath(ctx, cx, cx, TEX / 2 - 4);
      ctx.clip();

      // === BACKDROP ===
      const bg = ctx.createRadialGradient(cx, cx * 0.75, 0, cx, cx, TEX * 0.65);
      bg.addColorStop(0, '#0d0d18');
      bg.addColorStop(0.45, '#06060d');
      bg.addColorStop(0.85, '#030306');
      bg.addColorStop(1, '#000000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, TEX, TEX);

      // Primary ambient bloom from top
      const topGlow = ctx.createRadialGradient(cx, 180, 0, cx, 180, TEX * 0.55);
      topGlow.addColorStop(0, `rgba(${primaryRgb}, 0.28)`);
      topGlow.addColorStop(0.55, `rgba(${accentRgb}, 0.09)`);
      topGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, TEX, TEX);

      // Bottom accent rim light
      const botGlow = ctx.createRadialGradient(cx, TEX - 120, 0, cx, TEX - 120, TEX * 0.45);
      botGlow.addColorStop(0, `rgba(${accentRgb}, 0.16)`);
      botGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = botGlow;
      ctx.fillRect(0, 0, TEX, TEX);

      // Subtle hex grid
      ctx.lineWidth = 1;
      for (let i = 1; i <= 8; i++) {
        const r = (TEX / 2 - PADDING) * (i / 8);
        drawHexPath(ctx, cx, cx, r);
        ctx.strokeStyle = `rgba(${secondaryRgb}, ${0.06 + i * 0.004})`;
        ctx.stroke();
      }

      // Diagonal holographic sheen
      const sheen = ctx.createLinearGradient(0, 0, TEX, TEX);
      sheen.addColorStop(0, `rgba(${accentRgb}, 0.0)`);
      sheen.addColorStop(0.45, `rgba(${accentRgb}, 0.045)`);
      sheen.addColorStop(0.5, `rgba(${primaryRgb}, 0.07)`);
      sheen.addColorStop(0.55, `rgba(${secondaryRgb}, 0.045)`);
      sheen.addColorStop(1, `rgba(${primaryRgb}, 0.0)`);
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, TEX, TEX);

      // Vignette
      const vig = ctx.createRadialGradient(cx, cx, TEX * 0.32, cx, cx, TEX * 0.55);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, TEX, TEX);

      ctx.restore();

      // === BORDER GLOW ===
      ctx.save();
      ctx.shadowColor = cr.theme.primary;
      ctx.shadowBlur = 70;
      ctx.lineWidth = 12;
      ctx.strokeStyle = `rgba(${primaryRgb}, 0.9)`;
      drawHexPath(ctx, cx, cx, TEX / 2 - 6);
      ctx.stroke();
      ctx.restore();

      // Inner accent rim
      ctx.save();
      ctx.shadowColor = cr.theme.accent || cr.theme.primary;
      ctx.shadowBlur = 25;
      ctx.lineWidth = 3;
      ctx.strokeStyle = `rgba(${accentRgb}, 0.85)`;
      drawHexPath(ctx, cx, cx, TEX / 2 - 22);
      ctx.stroke();
      ctx.restore();

      // === TOP TECH HEADER ===
      const headerY = 64;
      ctx.font = '600 17px "SF Mono", "Fira Code", ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(${primaryRgb}, 0.9)`;
      ctx.beginPath();
      ctx.arc(PADDING + 8, headerY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText('CREATOR PLAYBOOK', PADDING + 22, headerY);

      const catLabel = (() => {
        if (cr.category === 'netlify-shippers') return '🚀 Netlify AI Shippers';
        if (cr.category === 'indie-hackers') return '🛠️ Indie Hackers';
        if (cr.category === 'big-players') return '📡 Big Players';
        return cr.category;
      })();
      ctx.font = '600 15px "SF Mono", "Fira Code", ui-monospace, monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText(catLabel, TEX - PADDING, headerY);

      // === AVATAR ===
      const avatarY = 230;
      const avatarR = 96;
      const avatarImg = imageCacheRef.current[cr.id];

      // Outer glow ring
      ctx.save();
      ctx.shadowColor = cr.theme.primary;
      ctx.shadowBlur = 45;
      ctx.beginPath();
      ctx.arc(cx, avatarY, avatarR + 10, 0, Math.PI * 2);
      const ringGrad = ctx.createLinearGradient(cx - avatarR, avatarY - avatarR, cx + avatarR, avatarY + avatarR);
      ringGrad.addColorStop(0, cr.theme.primary);
      ringGrad.addColorStop(0.5, cr.theme.accent || cr.theme.primary);
      ringGrad.addColorStop(1, cr.theme.secondary || cr.theme.primary);
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.restore();

      // Avatar image / fallback
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, avatarY, avatarR, 0, Math.PI * 2);
      ctx.clip();
      if (avatarImg) {
        ctx.drawImage(avatarImg, cx - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
      } else {
        const fallbackGrad = ctx.createLinearGradient(cx - avatarR, avatarY - avatarR, cx + avatarR, avatarY + avatarR);
        fallbackGrad.addColorStop(0, cr.theme.primary);
        fallbackGrad.addColorStop(1, cr.theme.secondary || cr.theme.primary);
        ctx.fillStyle = fallbackGrad;
        ctx.fill();
        ctx.font = 'bold 58px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cr.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase(), cx, avatarY);
      }
      ctx.restore();

      // Verified badge
      if (cr.status === 'verified') {
        const bx = cx + avatarR * 0.68;
        const by = avatarY + avatarR * 0.68;
        ctx.save();
        ctx.shadowColor = cr.theme.primary;
        ctx.shadowBlur = 18;
        ctx.fillStyle = cr.theme.primary;
        ctx.beginPath();
        ctx.arc(bx, by, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(bx - 9, by);
        ctx.lineTo(bx - 3, by + 6);
        ctx.lineTo(bx + 10, by - 7);
        ctx.stroke();
      }

      // === NAME ===
      ctx.save();
      ctx.font = '700 48px Inter, "SF Pro Display", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.shadowColor = `rgba(${primaryRgb}, 0.45)`;
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(cr.name, cx, 365);
      ctx.restore();

      // === HANDLE + FOLLOWERS ===
      ctx.font = '500 24px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      const formattedHandle = cr.handle.startsWith('@') ? cr.handle : `@${cr.handle}`;
      ctx.fillText(formattedHandle, cx, 428);

      ctx.font = '600 22px Inter, system-ui, sans-serif';
      ctx.fillStyle = `rgba(${accentRgb}, 0.95)`;
      ctx.fillText(`✦ ${cr.followersStr} followers`, cx, 462);

      // === BIO ===
      ctx.font = '500 19px Inter, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      wrapText(ctx, cr.bio, cx, 500, 600, 26, 2);

      // === CATEGORY PILL ===
      const pillY = 600;
      const pillPadX = 20;
      const pillText = `${cr.emoji || '◆'} ${(() => {
        if (cr.category === 'netlify-shippers') return 'Netlify Shipper';
        if (cr.category === 'indie-hackers') return 'Indie Hacker';
        if (cr.category === 'big-players') return 'Big Player';
        return cr.category;
      })()}`;
      ctx.font = '700 18px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const pillW = ctx.measureText(pillText).width + pillPadX * 2;
      const pillH = 38;
      const pillX = cx - pillW / 2;
      const r = pillH / 2;
      ctx.save();
      ctx.shadowColor = `rgba(${primaryRgb}, 0.35)`;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(pillX + r, pillY);
      ctx.lineTo(pillX + pillW - r, pillY);
      ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
      ctx.lineTo(pillX + pillW, pillY + pillH - r);
      ctx.quadraticCurveTo(pillX + pillW, pillY + pillH, pillX + pillW - r, pillY + pillH);
      ctx.lineTo(pillX + r, pillY + pillH);
      ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
      ctx.lineTo(pillX, pillY + r);
      ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
      ctx.closePath();
      ctx.fillStyle = `rgba(${primaryRgb}, 0.12)`;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(${primaryRgb}, 0.45)`;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pillText, pillX + pillPadX, pillY + pillH / 2);
      ctx.restore();

      // === STATS STRIP ===
      const stripY = 700;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PADDING + 40, stripY - 36);
      ctx.lineTo(TEX - PADDING - 40, stripY - 36);
      ctx.stroke();

      const plays = Array.isArray(cr.plays) ? cr.plays.length : 0;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      ctx.font = 'bold 42px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(plays.toLocaleString(), cx - 130, stripY - 6);
      ctx.font = '600 14px "SF Mono", "Fira Code", ui-monospace, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('GROWTH PLAYS', cx - 130, stripY + 42);

      ctx.font = 'bold 42px Inter, system-ui, sans-serif';
      ctx.fillStyle = `rgba(${accentRgb}, 1)`;
      ctx.fillText(cr.followersStr, cx + 130, stripY - 6);
      ctx.font = '600 14px "SF Mono", "Fira Code", ui-monospace, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('FOLLOWERS', cx + 130, stripY + 42);
      ctx.restore();

      // === BOTTOM ID HASH ===
      ctx.save();
      ctx.font = '600 16px "SF Mono", "Fira Code", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(`ID: ${cr.id.toUpperCase().padEnd(8, '0')} // ${plays} PLAYS`, cx, TEX - 58);
      ctx.restore();

      // === GLASS CORNER BRACKETS ===
      const cornerSize = 36;
      const corners = [
        { x: PADDING - 14, y: PADDING - 10, dx: 1, dy: 1 },
        { x: TEX - PADDING + 14, y: PADDING - 10, dx: -1, dy: 1 },
        { x: TEX - PADDING + 14, y: TEX - PADDING + 10, dx: -1, dy: -1 },
        { x: PADDING - 14, y: TEX - PADDING + 10, dx: 1, dy: -1 },
      ];
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      corners.forEach((c, i) => {
        ctx.strokeStyle = `rgba(${i % 2 === 0 ? accentRgb : primaryRgb}, 0.55)`;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y + cornerSize * c.dy);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(c.x + cornerSize * c.dx, c.y);
        ctx.stroke();
      });
      ctx.restore();
    };

    // ── GEOMETRY ─────────────────────────────────────────────────
    const HEX_R = 1.25;
    const DEPTH = 0.15;

    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 2 + i * (Math.PI * 2 / 6);
      if (i === 0) hexShape.moveTo(HEX_R * Math.cos(a), HEX_R * Math.sin(a));
      else hexShape.lineTo(HEX_R * Math.cos(a), HEX_R * Math.sin(a));
    }
    hexShape.closePath();

    const frontGeo = new THREE.ShapeGeometry(hexShape);
    {
      const pos = frontGeo.getAttribute('position') as THREE.BufferAttribute;
      const uv = frontGeo.getAttribute('uv') as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        uv.setX(i, (pos.getX(i) + HEX_R) / (2 * HEX_R));
        uv.setY(i, (pos.getY(i) + HEX_R) / (2 * HEX_R));
      }
      uv.needsUpdate = true;
    }
    frontGeo.translate(0, 0, DEPTH / 2);

    const sidesGeo = new THREE.CylinderGeometry(HEX_R, HEX_R, DEPTH, 6, 1, true);
    sidesGeo.rotateX(-Math.PI / 2);

    // ── BUILD CARDS ──────────────────────────────────────────────
    const groups: THREE.Group[] = [];
    const frontMeshes: THREE.Mesh[] = [];
    const meshesGroup = new THREE.Group();
    scene.add(meshesGroup);

    filteredCreators.forEach((cr, idx) => {
      renderCardCanvas(cr);

      const tex = new THREE.CanvasTexture(canvasesRef.current[cr.id]);
      tex.colorSpace = THREE.SRGBColorSpace;
      texturesRef.current[cr.id] = tex;

      const matFront = new THREE.MeshPhysicalMaterial({
        map: tex,
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.8,
        clearcoat: 0.9,
        clearcoatRoughness: 0.06,
        emissive: new THREE.Color(cr.theme.primary),
        emissiveIntensity: 0.06,
        emissiveMap: tex,
        ior: 1.7,
        iridescence: 0.6,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [120, 380],
        side: THREE.DoubleSide,
      });
      const matSides = new THREE.MeshPhysicalMaterial({
        color: 0x0b0b14,
        roughness: 0.35,
        metalness: 0.9,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      });

      const fMesh = new THREE.Mesh(frontGeo, matFront);
      fMesh.userData = { index: idx, creator: cr };

      const sMesh = new THREE.Mesh(sidesGeo, matSides);

      const edgeGeo = new THREE.EdgesGeometry(frontGeo, 1);
      const edgeMat = new THREE.LineBasicMaterial({ color: new THREE.Color(cr.theme.accent || cr.theme.primary), transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
      const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);

      const grp = new THREE.Group();
      grp.add(fMesh);
      grp.add(sMesh);
      grp.add(edgeMesh);

      const coord = getPlacement(idx, filteredCreators.length);
      grp.position.set(coord.x, coord.y, 0);
      grp.userData = { index: idx, creator: cr, baseX: coord.x, baseY: coord.y };

      if (cr.avatar && !imageCacheRef.current[cr.id]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = cr.avatar;
        img.onload = () => {
          imageCacheRef.current[cr.id] = img;
          renderCardCanvas(cr);
          texturesRef.current[cr.id].needsUpdate = true;
        };
      }

      groups.push(grp);
      frontMeshes.push(fMesh);
      meshesGroup.add(grp);
    });

    // ── CONNECTIONS ──────────────────────────────────────────────
    const conns: { from: number; to: number }[] = [];
    for (let i = 0; i < groups.length; i++)
      for (let j = i + 1; j < groups.length; j++)
        if (groups[i].position.distanceTo(groups[j].position) < 4.2)
          conns.push({ from: i, to: j });

    const linesGrp = new THREE.Group();
    scene.add(linesGrp);
    conns.forEach(c => {
      const p1 = groups[c.from].position, p2 = groups[c.to].position;
      const pts = new THREE.LineCurve3(new THREE.Vector3(p1.x, p1.y, -0.1), new THREE.Vector3(p2.x, p2.y, -0.1)).getPoints(10);
      linesGrp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x18182a, transparent: true, opacity: 0.35 })));
    });

    const pulseGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const pulses: { m: THREE.Mesh; path: THREE.LineCurve3; t: number; spd: number }[] = [];
    conns.forEach(c => {
      const p1 = groups[c.from].position, p2 = groups[c.to].position;
      const path = new THREE.LineCurve3(new THREE.Vector3(p1.x, p1.y, -0.1), new THREE.Vector3(p2.x, p2.y, -0.1));
      const pm = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }));
      scene.add(pm);
      pulses.push({ m: pm, path, t: Math.random(), spd: 0.002 + Math.random() * 0.003 });
    });

    // Particles
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) { pPos[i] = (Math.random() - 0.5) * 18; pPos[i + 1] = (Math.random() - 0.5) * 12; pPos[i + 2] = -2 + Math.random() * 2; }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.035, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── ORBIT CONTROLS ───────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 80;
    controls.minDistance = 4;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enabled = false;

    // ── INPUT ────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      spot.position.x = mouse.x * 5;
      spot.position.y = mouse.y * 4;
    };
    const onLeave = () => mouse.set(-99, -99);

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - startTime;

      if (dist < 6 && duration < 300) {
        if (!interactedRef.current) {
          interactedRef.current = true;
          setInteracted(true);
          return;
        }

        if (modalCreatorId || zoomedInCreatorRef.current) return;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(frontMeshes);
        if (hits.length > 0) {
          const creator = (hits[0].object as THREE.Mesh).userData.creator as CreatorProfile;
          zoomedInCreatorRef.current = creator;
          setZoomedInCreator(creator);
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    // ── RESIZE ───────────────────────────────────────────────────
    let resObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resObs = new ResizeObserver(ent => {
        if (!ent.length) return;
        const { width: w, height: h } = ent[0].contentRect;
        renderer.setSize(w || width, h || height);
        camera.aspect = (w || width) / (h || height);
        if (w < 480) defaultCamPos.set(0, 0, 16);
        else if (w < 768) defaultCamPos.set(0, 0, 13);
        else if (w < 1024) defaultCamPos.set(0, 0, 10.5);
        else defaultCamPos.set(0, 0, 9.0);
        camera.updateProjectionMatrix();
      });
      resObs.observe(container);
    }

    // ── ANIMATE ──────────────────────────────────────────────────
    let aId: number;
    const animStartTime = performance.now();
    const tCamPos = new THREE.Vector3().copy(defaultCamPos);
    const tLookAt = new THREE.Vector3(0, 0, 0);
    
    let prevZoomId = '';
    let isTransitioningBack = false;

    const animate = () => {
      aId = requestAnimationFrame(animate);
      const t = (performance.now() - animStartTime) / 1000;

      const zId = modalCreatorId || zoomedInCreatorRef.current?.id || '';

      if (!zId && prevZoomId) {
        isTransitioningBack = true;
      }
      prevZoomId = zId;

      if (zId) {
        controls.enabled = false;
        const tg = groups.find(g => g.userData.creator.id === zId);
        if (tg) {
          tCamPos.set(tg.position.x, tg.position.y, 3.0);
          tLookAt.set(tg.position.x, tg.position.y, 0);

          camera.position.lerp(tCamPos, 0.08);
          controls.target.copy(tLookAt);
          camera.lookAt(tLookAt);
        }
      } else {
        if (isTransitioningBack) {
          controls.enabled = false;
          camera.position.lerp(defaultCamPos, 0.08);
          camera.lookAt(0, 0, 0);

          if (camera.position.distanceTo(defaultCamPos) < 0.1) {
            isTransitioningBack = false;
            camera.position.copy(defaultCamPos);
            controls.target.set(0, 0, 0);
            controls.update();
          }
        } else {
          if (interactedRef.current) {
            controls.enabled = true;
            controls.update();
          } else {
            controls.enabled = false;
            camera.position.lerp(defaultCamPos, 0.08);
            camera.lookAt(0, 0, 0);
          }
        }
      }

      let hovIdx: number | null = null;
      if (!zId) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(frontMeshes);
        if (hits.length > 0) { hovIdx = (hits[0].object as THREE.Mesh).userData.index; canvas.style.cursor = 'pointer'; }
        else canvas.style.cursor = 'default';
      } else { canvas.style.cursor = 'default'; }

      groups.forEach((g, idx) => {
        const d = g.userData;
        let tx = d.baseX, ty = d.baseY, tz = 0, ts = 1.0;
        if (!zId && hovIdx !== null) {
          if (hovIdx === idx) { tz = 0.55; ts = 1.1; }
          else {
            const hg = groups[hovIdx];
            const dx = d.baseX - hg.userData.baseX, dy = d.baseY - hg.userData.baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) { tx = d.baseX + (dx / dist) * 0.3; ty = d.baseY + (dy / dist) * 0.3; }
          }
        }
        g.position.x += (tx - g.position.x) * 0.1;
        g.position.y += (ty - g.position.y) * 0.1;
        g.position.z += (tz - g.position.z) * 0.1;
        const s = g.scale.x + (ts - g.scale.x) * 0.1;
        g.scale.setScalar(s);

        let rx = 0, ry = 0;
        if (!zId) {
          if (hovIdx === idx) { rx = -mouse.y * 0.14; ry = mouse.x * 0.14; }
          else { rx = -mouse.y * 0.025; ry = mouse.x * 0.025; }
        }
        g.rotation.x += (rx - g.rotation.x) * 0.07;
        g.rotation.y += (ry - g.rotation.y) * 0.07;
      });

      pulses.forEach(p => { p.t += p.spd; if (p.t > 1) p.t = 0; p.m.position.copy(p.path.getPointAt(p.t)); (p.m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p.t * Math.PI) * 0.75; });

      stars.rotation.y = t * 0.002;
      stars.rotation.x = t * 0.001;
      particles.rotation.y = t * 0.012;
      neb1.scale.x = 2.5 + Math.sin(t * 0.3) * 0.2;
      neb2.scale.x = 3 + Math.sin(t * 0.25 + 1) * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(aId);
      window.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      if (resObs) resObs.disconnect();
      frontGeo.dispose(); sidesGeo.dispose(); pulseGeo.dispose(); pGeo.dispose(); pMat.dispose();
      starGeo.dispose(); starMat.dispose(); nebGeo.dispose();
      Object.values(texturesRef.current).forEach(t => t.dispose());
      controls.dispose();
      renderer.dispose();
      if (loseCtxExt) loseCtxExt.loseContext();
      if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
    };
  }, [filteredCreators, modalCreatorId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '700px' }}>
      <style>{`
        @keyframes pulse-explore {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.03); opacity: 1; filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)); }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      
      {!interacted && (
        <div 
          onClick={handleInteract}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            background: 'rgba(5, 5, 16, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 10,
            cursor: 'pointer',
            borderRadius: '24px',
            pointerEvents: 'auto'
          }}
        >
          <div 
            style={{
              color: '#ffffff',
              fontFamily: '"Cal Sans", "Instrument Sans", sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              animation: 'pulse-explore 2s infinite ease-in-out',
              background: 'linear-gradient(45deg, #ec4899, #8b5cf6, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              padding: '10px'
            }}
          >
            Click me to interact
          </div>
          <div style={{ color: '#7c7c8d', fontSize: '0.95rem', marginTop: '12px', letterSpacing: '0.5px' }}>
            Drag to rotate & pan • Scroll to zoom • Click cards to open
          </div>
        </div>
      )}

      {zoomedInCreator && !modalCreatorId && (
        <div
          style={{
            position: 'absolute',
            bottom: '45px',
            left: '50%',
            display: 'flex',
            gap: '16px',
            zIndex: 20,
            transform: 'translate(-50%, 0)',
            animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            pointerEvents: 'auto'
          }}
        >
          <button
            onClick={() => {
              if (zoomedInCreator) openCreatorModal(zoomedInCreator);
            }}
            style={{
              background: `linear-gradient(135deg, ${zoomedInCreator.theme.primary}, ${zoomedInCreator.theme.secondary || zoomedInCreator.theme.primary})`,
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${zoomedInCreator.theme.primary}40`,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 12px 30px ${zoomedInCreator?.theme.primary}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${zoomedInCreator?.theme.primary}40`;
            }}
          >
            Select Playbook
          </button>
          <button
            onClick={() => {
              zoomedInCreatorRef.current = null;
              setZoomedInCreator(null);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#e2e8f0';
            }}
          >
            Back to Grid
          </button>
        </div>
      )}

      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)' 
        }} 
      />
    </div>
  );
}
