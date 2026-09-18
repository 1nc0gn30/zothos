import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HologramCanvasProps {
  creatorId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.4, g: 0.4, b: 1 };
}

function hexToRgbString(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '100, 100, 255';
}

function createHexShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

/* ═══════════════════════════════════════════════════════════════
   ULTRA PREMIUM HOLOGRAPHIC FACE TEXTURE
   Procedurally animated canvas with sci-fi aesthetic
   ═══════════════════════════════════════════════════════════════ */
class HolographicTexture {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  size = 2048; // Higher res for crisp detail
  primary: string;
  secondary: string;
  accent: string;
  seed: string;
  private _nodes: { x: number; y: number; phase: number; speed: number }[] = [];

  constructor(primary: string, secondary: string, accent: string, seed: string) {
    this.primary = primary;
    this.secondary = secondary;
    this.accent = accent;
    this.seed = seed;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = 16;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // Pre-generate constellation nodes
    const nodeCount = 24;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (Math.PI * 2 / nodeCount) * i;
      const r = this.size * (0.15 + Math.random() * 0.3);
      this._nodes.push({
        x: this.size / 2 + r * Math.cos(angle),
        y: this.size / 2 + r * Math.sin(angle),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
  }

  draw(elapsed: number) {
    const { ctx, size, primary, secondary, accent, seed } = this;
    const cx = size / 2;
    const cy = size / 2;
    const hexR = size * 0.46;
    const pStr = hexToRgbString(primary);
    const sStr = hexToRgbString(secondary);
    const aStr = hexToRgbString(accent);

    // === BACKGROUND ===
    // Deep space radial with subtle noise texture feel
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.8);
    bg.addColorStop(0, '#0a0a14');
    bg.addColorStop(0.5, '#05050a');
    bg.addColorStop(0.85, '#020204');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // === CHROMATIC AMBIENT GLOW ===
    const chromaGlow = ctx.createRadialGradient(cx, cy, hexR * 0.5, cx, cy, hexR * 1.4);
    chromaGlow.addColorStop(0, `rgba(${pStr}, 0)`);
    chromaGlow.addColorStop(0.4, `rgba(${pStr}, 0.04)`);
    chromaGlow.addColorStop(0.7, `rgba(${aStr}, 0.03)`);
    chromaGlow.addColorStop(1, `rgba(${pStr}, 0)`);
    ctx.fillStyle = chromaGlow;
    ctx.fillRect(0, 0, size, size);

    // === HEX GRID FOUNDATION ===
    const gridRot = elapsed * 0.08;
    const gridCount = 9;
    for (let i = 1; i <= gridCount; i++) {
      const r = (hexR / gridCount) * i;
      const alpha = Math.max(0, 0.1 - i * 0.008);
      ctx.beginPath();
      for (let j = 0; j <= 6; j++) {
        const angle = (Math.PI / 3) * j - Math.PI / 6 + gridRot * (i % 2 === 0 ? 1 : -1) * 0.2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${pStr}, ${alpha})`;
      ctx.lineWidth = i === gridCount ? 2 : 1;
      ctx.stroke();
    }

    // === ROTATING DATA RINGS ===
    for (let i = 0; i < 4; i++) {
      const r = hexR * (0.2 + i * 0.18);
      const pulse = Math.sin(elapsed * (1.2 + i * 0.4) + i * 2) * 0.15;
      const alpha = 0.22 + pulse;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, r), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${i % 2 === 0 ? aStr : sStr}, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arc segments on rings
      const arcStart = elapsed * (0.3 + i * 0.15) + i;
      const arcLen = Math.PI * 0.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, arcStart, arcStart + arcLen);
      ctx.strokeStyle = `rgba(${pStr}, ${alpha + 0.15})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // === RADIAL DATA SPOKES ===
    const spokeCount = 24;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (Math.PI * 2 / spokeCount) * i + gridRot * 0.15;
      const len = hexR * (0.5 + Math.sin(elapsed * 0.6 + i * 0.5) * 0.2);
      const alpha = 0.03 + Math.sin(elapsed + i) * 0.02;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + len * Math.cos(angle), cy + len * Math.sin(angle));
      ctx.strokeStyle = `rgba(${sStr}, ${Math.max(0, alpha)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // === CONSTELLATION NODE NETWORK ===
    const nodes = this._nodes.map((n) => ({
      x: n.x + Math.sin(elapsed * n.speed + n.phase) * 8,
      y: n.y + Math.cos(elapsed * n.speed * 0.7 + n.phase) * 8,
    }));

    // Draw connections
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < size * 0.25) {
          const alpha = (1 - dist / (size * 0.25)) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${sStr}, ${alpha})`;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((n, i) => {
      const pulse = 0.5 + Math.sin(elapsed * 2 + i) * 0.5;
      const r = 3 + pulse * 3;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${i % 3 === 0 ? aStr : pStr}, ${0.2 * pulse})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${i % 3 === 0 ? aStr : pStr}, ${0.6 * pulse})`;
      ctx.fill();
    });

    // === CORNER BRACKETS (tech targeting) ===
    const cornerSize = size * 0.05;
    const corners = [
      { x: size * 0.04, y: size * 0.04, dx: 1, dy: 1 },
      { x: size * 0.96, y: size * 0.04, dx: -1, dy: 1 },
      { x: size * 0.96, y: size * 0.96, dx: -1, dy: -1 },
      { x: size * 0.04, y: size * 0.96, dx: 1, dy: -1 },
    ];
    corners.forEach((c, i) => {
      const pulse = 0.6 + Math.sin(elapsed * 2.5 + i * 1.5) * 0.4;
      ctx.strokeStyle = `rgba(${aStr}, ${0.35 * pulse})`;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + cornerSize * c.dy);
      ctx.lineTo(c.x, c.y);
      ctx.lineTo(c.x + cornerSize * c.dx, c.y);
      ctx.stroke();

      // Corner dot with glow
      ctx.beginPath();
      ctx.arc(c.x, c.y, 5 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pStr}, ${0.5 * pulse})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${aStr}, ${0.9 * pulse})`;
      ctx.fill();
    });

    // === CENTRAL ENERGY CORE ===
    const coreR = size * 0.08 + Math.sin(elapsed * 1.8) * 4;
    // Outer glow
    const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
    coreGlow.addColorStop(0, `rgba(${pStr}, 0.3)`);
    coreGlow.addColorStop(0.4, `rgba(${aStr}, 0.1)`);
    coreGlow.addColorStop(1, `rgba(${pStr}, 0)`);
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner hex
    ctx.beginPath();
    for (let j = 0; j <= 6; j++) {
      const angle = (Math.PI / 3) * j - Math.PI / 6 + elapsed * 0.3;
      const x = cx + coreR * Math.cos(angle);
      const y = cy + coreR * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const corePulse = 0.12 + Math.sin(elapsed * 2.5) * 0.06;
    ctx.fillStyle = `rgba(${pStr}, ${corePulse})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${aStr}, 0.6)`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner core dot
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${aStr}, 0.8)`;
    ctx.fill();

    // === ROTATING ORBITAL ARCS ===
    for (let i = 0; i < 3; i++) {
      const orbitR = hexR * (0.5 + i * 0.15);
      const startAngle = elapsed * (0.4 + i * 0.2) + i * 2.1;
      const arcLen = Math.PI * (0.3 + Math.sin(elapsed + i) * 0.15);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, startAngle, startAngle + arcLen);
      ctx.strokeStyle = `rgba(${i % 2 === 0 ? sStr : aStr}, 0.4)`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Trail fade
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, startAngle + arcLen, startAngle + arcLen + Math.PI * 0.1);
      ctx.strokeStyle = `rgba(${i % 2 === 0 ? sStr : aStr}, 0.1)`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // === DATA STREAM LINES (vertical) ===
    const streamCount = 8;
    for (let i = 0; i < streamCount; i++) {
      const x = cx + (Math.random() - 0.5) * hexR * 1.2;
      const speed = 80 + Math.random() * 60;
      const y = ((elapsed * speed + i * 123) % (size * 1.2)) - size * 0.1;
      const alpha = 0.06 + Math.sin(elapsed * 3 + i) * 0.04;
      ctx.fillStyle = `rgba(${sStr}, ${alpha})`;
      ctx.fillRect(x - 0.5, y, 1, 20 + Math.random() * 30);
    }

    // === STATUS BAR (top) ===
    // Left line
    ctx.strokeStyle = `rgba(${aStr}, 0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.12, size * 0.065);
    ctx.lineTo(size * 0.22, size * 0.065);
    ctx.stroke();
    // Right line
    ctx.beginPath();
    ctx.moveTo(size * 0.78, size * 0.065);
    ctx.lineTo(size * 0.88, size * 0.065);
    ctx.stroke();

    // Title with glow
    ctx.font = 'bold 24px "SF Mono", "Fira Code", Monaco, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Glow
    ctx.shadowColor = `rgba(${aStr}, 0.5)`;
    ctx.shadowBlur = 15;
    ctx.fillStyle = `rgba(${aStr}, 0.7)`;
    ctx.fillText('◆  PLAYBOOK ACTIVE  ◆', cx, size * 0.065);
    ctx.shadowBlur = 0;

    // === ID HASH (bottom) ===
    ctx.font = 'bold 28px "SF Mono", "Fira Code", Monaco, monospace';
    ctx.fillStyle = `rgba(${sStr}, 0.5)`;
    ctx.fillText(`ID: ${seed.slice(0, 8).toUpperCase()}`, cx, size * 0.935);

    // Bottom lines
    ctx.strokeStyle = `rgba(${pStr}, 0.15)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size * 0.12, size * 0.92);
    ctx.lineTo(size * 0.22, size * 0.92);
    ctx.moveTo(size * 0.78, size * 0.92);
    ctx.lineTo(size * 0.88, size * 0.92);
    ctx.stroke();

    // === MINI HEX PATTERN (decorative corners) ===
    const miniHexSize = size * 0.018;
    const miniHexPositions = [
      { x: size * 0.08, y: size * 0.15 },
      { x: size * 0.92, y: size * 0.15 },
      { x: size * 0.08, y: size * 0.85 },
      { x: size * 0.92, y: size * 0.85 },
    ];
    miniHexPositions.forEach((pos, i) => {
      ctx.beginPath();
      for (let j = 0; j <= 6; j++) {
        const angle = (Math.PI / 3) * j - Math.PI / 6 + elapsed * (0.5 + i * 0.2);
        const x = pos.x + miniHexSize * Math.cos(angle);
        const y = pos.y + miniHexSize * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${i % 2 === 0 ? pStr : aStr}, 0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function HologramCanvas({ creatorId, primaryColor, secondaryColor, accentColor }: HologramCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'block';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);

    const width = parent.clientWidth || 320;
    const height = parent.clientHeight || 150;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL context could not be initialized');
      return;
    }
    const loseContextExt = gl.getExtension('WEBGL_lose_context');

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGLRenderer initialization failed:', e);
      if (loseContextExt) loseContextExt.loseContext();
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 5.0;

    const pCol = new THREE.Color(primaryColor);
    const sCol = new THREE.Color(secondaryColor);
    const aCol = new THREE.Color(accentColor);
    const pRgb = hexToRgb(primaryColor);
    const aRgb = hexToRgb(accentColor);

    // === HOLOGRAPHIC TEXTURE ===
    const holoTex = new HolographicTexture(primaryColor, secondaryColor, accentColor, creatorId);

    // === MAIN HEX CARD ===
    const hexRadius = 1.55;
    const hexShape = createHexShape(hexRadius);
    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 6,
    };
    const cardGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    cardGeo.center();

    // Ultra-premium side material - obsidian glass
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x060610),
      roughness: 0.12,
      metalness: 0.97,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      ior: 2.8,
      iridescence: 1.0,
      iridescenceIOR: 2.0,
      iridescenceThicknessRange: [80, 400],
      sheen: 1.0,
      sheenRoughness: 0.3,
      sheenColor: pCol,
    });

    // Face material - holographic projection surface
    const faceMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x080812),
      map: holoTex.texture,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      emissive: pCol,
      emissiveIntensity: 0.08,
      emissiveMap: holoTex.texture,
      ior: 1.8,
      iridescence: 0.7,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [150, 450],
      transparent: true,
      opacity: 0.97,
    });

    // Back material - dark mirror
    const backMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x040408),
      roughness: 0.2,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const cardMesh = new THREE.Mesh(cardGeo, [sideMat, faceMat, backMat]);
    scene.add(cardMesh);

    // === AMBIENT GLOW SPRITE ===
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 512;
    glowCanvas.height = 512;
    const gCtx = glowCanvas.getContext('2d')!;
    const glowGrad = gCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    glowGrad.addColorStop(0, `rgba(${Math.round(pRgb.r * 255)}, ${Math.round(pRgb.g * 255)}, ${Math.round(pRgb.b * 255)}, 0.2)`);
    glowGrad.addColorStop(0.3, `rgba(${Math.round(aRgb.r * 255)}, ${Math.round(aRgb.g * 255)}, ${Math.round(aRgb.b * 255)}, 0.08)`);
    glowGrad.addColorStop(0.6, `rgba(${Math.round(pRgb.r * 255)}, ${Math.round(pRgb.g * 255)}, ${Math.round(pRgb.b * 255)}, 0.02)`);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    gCtx.fillStyle = glowGrad;
    gCtx.fillRect(0, 0, 512, 512);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(5.2, 5.2, 1);
    glowSprite.position.z = -0.15;
    scene.add(glowSprite);

    // === CHROMATIC EDGE RING (main hex outline) ===
    const edgeGeo = new THREE.TorusGeometry(hexRadius + 0.025, 0.014, 12, 6);
    edgeGeo.rotateZ(Math.PI / 6);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: pCol,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    edgeMesh.position.z = 0.07;
    scene.add(edgeMesh);

    // Secondary thin edge
    const edge2Geo = new THREE.TorusGeometry(hexRadius + 0.035, 0.005, 8, 6);
    edge2Geo.rotateZ(Math.PI / 6);
    const edge2Mat = new THREE.MeshBasicMaterial({
      color: aCol,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const edge2Mesh = new THREE.Mesh(edge2Geo, edge2Mat);
    edge2Mesh.position.z = 0.06;
    scene.add(edge2Mesh);

    // === OUTER ACCENT RING ===
    const outerGeo = new THREE.TorusGeometry(hexRadius + 0.16, 0.007, 8, 64);
    const outerMat = new THREE.MeshBasicMaterial({
      color: aCol,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const outerRing = new THREE.Mesh(outerGeo, outerMat);
    outerRing.position.z = 0.02;
    scene.add(outerRing);

    // === CONCENTRIC WIRE HEX RINGS ===
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const r = hexRadius * (0.42 + i * 0.18);
      const rGeo = new THREE.TorusGeometry(r, 0.004, 6, 6);
      rGeo.rotateZ(Math.PI / 6);
      const rMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? sCol : aCol,
        transparent: true,
        opacity: 0.2 - i * 0.04,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.z = 0.012 + i * 0.006;
      scene.add(rMesh);
      rings.push(rMesh);
    }

    // === ORBITING MINI HEX PRISMS ===
    const miniHexes: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; axis: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const miniGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 6);
      miniGeo.rotateX(Math.PI / 2);
      const miniMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? pCol : aCol,
        roughness: 0.15,
        metalness: 0.95,
        emissive: i % 2 === 0 ? pCol : aCol,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.75,
        clearcoat: 1.0,
      });
      const mini = new THREE.Mesh(miniGeo, miniMat);
      scene.add(mini);
      miniHexes.push({
        mesh: mini,
        radius: 1.9 + i * 0.3,
        speed: 0.35 + i * 0.12,
        phase: i * 1.2,
        axis: i % 2 === 0 ? 1 : -1,
      });
    }

    // === FLOATING PARTICLE FIELD ===
    const pCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const r = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      pSizes[i] = 0.012 + Math.random() * 0.025;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: aCol,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // === RISING STREAM PARTICLES ===
    const sCount = 60;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(sCount * 3);
    const sSpeeds = new Float32Array(sCount);
    for (let i = 0; i < sCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * hexRadius * 0.9;
      sPos[i * 3] = r * Math.cos(angle);
      sPos[i * 3 + 1] = r * Math.sin(angle);
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      sSpeeds[i] = 0.2 + Math.random() * 0.35;
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      color: pCol,
      size: 0.018,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const streamParticles = new THREE.Points(sGeo, sMat);
    scene.add(streamParticles);

    // === LIGHTING SETUP ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const keyLight = new THREE.DirectionalLight(pCol, 3.0);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(sCol, 2.2);
    fillLight.position.set(-4, -3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(aCol, 2.5);
    rimLight.position.set(0, 0, -4);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(
      new THREE.Color(0.5, 0.6, 0.8),
      new THREE.Color(0.08, 0.04, 0.12),
      0.4
    );
    scene.add(hemiLight);

    // Orbiting point light
    const orbitLight = new THREE.PointLight(pCol, 2.0, 16);
    orbitLight.position.set(0, 0, 2.5);
    scene.add(orbitLight);

    // === MOUSE TILT ===
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotation.current.x = -y * 0.3;
      targetRotation.current.y = x * 0.3;
    };
    const handleMouseLeave = () => {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    };
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    // === RESIZE ===
    let resizeObs: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObs = new ResizeObserver((entries) => {
        if (!entries?.length) return;
        const e = entries[0];
        const w = e.contentRect.width || parent.clientWidth;
        const h = e.contentRect.height || parent.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
      resizeObs.observe(parent);
    }

    // === ANIMATION LOOP ===
    let animId: number;
    const start = performance.now();
    let scale = 0.01;
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - start) / 1000;
      frameCount++;

      // Smooth scale in with breathing
      scale += (1.0 - scale) * 0.07;
      const breathe = 1 + Math.sin(elapsed * 1.0) * 0.006;
      const finalScale = scale * breathe;

      // Smooth tilt
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.06;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.06;

      cardMesh.rotation.x = currentRotation.current.x;
      cardMesh.rotation.y = currentRotation.current.y;
      cardMesh.scale.setScalar(finalScale);

      // Update holographic texture every 2 frames
      if (frameCount % 2 === 0) {
        holoTex.draw(elapsed);
      }

      // Edge rings
      edgeMesh.rotation.copy(cardMesh.rotation);
      edgeMesh.scale.setScalar(finalScale);
      edgeMat.opacity = 0.5 + Math.sin(elapsed * 2.2) * 0.12;

      edge2Mesh.rotation.copy(cardMesh.rotation);
      edge2Mesh.scale.setScalar(finalScale);
      edge2Mat.opacity = 0.25 + Math.sin(elapsed * 1.8 + 1) * 0.1;

      // Outer ring
      outerRing.rotation.z = elapsed * 0.1;
      outerRing.scale.setScalar(finalScale * 1.01);
      outerMat.opacity = 0.15 + Math.sin(elapsed * 1.5) * 0.07;

      // Concentric rings
      rings.forEach((ring, i) => {
        ring.rotation.z = elapsed * (0.06 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
        ring.scale.setScalar(finalScale * (1 + i * 0.012));
        const base = 0.18 - i * 0.04;
        (ring.material as THREE.MeshBasicMaterial).opacity =
          base + Math.sin(elapsed * 1.3 + i * 1.1) * 0.06;
      });

      // Mini hex orbiters
      miniHexes.forEach((h) => {
        const angle = elapsed * h.speed + h.phase;
        h.mesh.position.x = Math.cos(angle) * h.radius * 0.5;
        h.mesh.position.y = Math.sin(angle * h.axis) * h.radius * 0.3;
        h.mesh.position.z = Math.sin(angle) * 0.4;
        h.mesh.rotation.x = elapsed * 1.8 + h.phase;
        h.mesh.rotation.y = elapsed * 1.2;
        h.mesh.scale.setScalar(finalScale * (0.8 + Math.sin(elapsed * 2.5 + h.phase) * 0.2));
        (h.mesh.material as THREE.MeshPhysicalMaterial).opacity =
          0.5 + Math.sin(elapsed * 1.8 + h.phase) * 0.25;
      });

      // Ambient particles
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.03) * 0.06;
      particles.scale.setScalar(finalScale);
      pMat.opacity = 0.35 + Math.sin(elapsed * 0.8) * 0.08;

      // Stream particles
      const sArr = sGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < sCount; i++) {
        sArr[i * 3 + 2] += sSpeeds[i] * 0.002;
        if (sArr[i * 3 + 2] > 0.7) {
          sArr[i * 3 + 2] = -0.7;
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * hexRadius * 0.8;
          sArr[i * 3] = r * Math.cos(a);
          sArr[i * 3 + 1] = r * Math.sin(a);
        }
      }
      sGeo.attributes.position.needsUpdate = true;
      streamParticles.rotation.copy(cardMesh.rotation);
      streamParticles.scale.setScalar(finalScale);

      // Glow sprite
      glowSprite.scale.set(5.0 * finalScale, 5.0 * finalScale, 1);
      glowMat.opacity = 0.55 + Math.sin(elapsed * 1.2) * 0.12;

      // Orbit light
      orbitLight.position.x = Math.sin(elapsed * 0.6) * 3.5;
      orbitLight.position.y = Math.cos(elapsed * 0.4) * 2.5;
      orbitLight.position.z = 3 + Math.sin(elapsed * 0.25) * 0.5;
      orbitLight.intensity = 1.8 + Math.sin(elapsed * 1.8) * 0.25;

      // Color-shift edge
      const t = (Math.sin(elapsed * 0.4) + 1) / 2;
      edgeMat.color.setRGB(
        pRgb.r * (1 - t) + aRgb.r * t,
        pRgb.g * (1 - t) + aRgb.g * t,
        pRgb.b * (1 - t) + aRgb.b * t
      );

      // Micro-glitch
      if (Math.random() < 0.012) {
        const g = 1 + (Math.random() - 0.5) * 0.025;
        cardMesh.scale.setScalar(finalScale * g);
        edgeMat.opacity = 0.15 + Math.random() * 0.4;
        pMat.opacity = 0.15 + Math.random() * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // === CLEANUP ===
    return () => {
      cancelAnimationFrame(animId);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      if (resizeObs) resizeObs.disconnect();

      cardGeo.dispose();
      sideMat.dispose();
      faceMat.dispose();
      backMat.dispose();
      holoTex.dispose();
      glowTex.dispose();
      glowMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      edge2Geo.dispose();
      edge2Mat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      rings.forEach((r) => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
      miniHexes.forEach((h) => { h.mesh.geometry.dispose(); (h.mesh.material as THREE.Material).dispose(); });
      pGeo.dispose();
      pMat.dispose();
      sGeo.dispose();
      sMat.dispose();
      renderer.dispose();
      if (loseContextExt) loseContextExt.loseContext();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, [creatorId, primaryColor, secondaryColor, accentColor]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
        zIndex: 1,
      }}
    />
  );
}
