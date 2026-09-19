import { ProjectState } from '../types/project';

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, Math.min(width, height) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Draws 3D Metallic Chassis Thickness Extrusion when tilted
 */
export function draw3DChassisExtrusion(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  cornerRadius: number,
  project: ProjectState,
  sourceTime: number
) {
  if (!project.transform3D?.enabled) return;

  const rotX = project.transform3D.rotateX || 0;
  const rotY = project.transform3D.rotateY || 0;
  const extrusion = project.transform3D.depthExtrusion || 14;

  if (extrusion <= 0) return;

  const extX = (rotY / 45) * extrusion;
  const extY = -(rotX / 45) * extrusion;

  ctx.save();
  const grad = ctx.createLinearGradient(0, 0, phoneW, phoneH);
  grad.addColorStop(0, '#3A3D45');
  grad.addColorStop(0.5, '#1E2024');
  grad.addColorStop(1, '#0D0E10');

  ctx.fillStyle = grad;
  for (let i = 1; i <= Math.abs(extrusion); i += 2) {
    const stepRatio = i / extrusion;
    drawRoundedRect(
      ctx,
      -stepRatio * extX,
      -stepRatio * extY,
      phoneW,
      phoneH,
      cornerRadius
    );
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draws dynamic specular glass reflection sheen across screen
 */
export function drawSpecularGlare(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState,
  sourceTime: number
) {
  if (!project.transform3D?.enabled || project.transform3D.specularGlare === false) return;

  const drift = project.transform3D.autoDrift ? Math.sin(sourceTime * 0.8) * 0.3 : 0;
  const intensity = project.transform3D.glareIntensity ?? 0.25;

  ctx.save();
  drawRoundedRect(ctx, screenX, screenY, screenW, screenH, cornerRadius);
  ctx.clip();

  const sheenGrad = ctx.createLinearGradient(
    screenX - screenW * 0.5 + drift * screenW,
    screenY,
    screenX + screenW * 1.5 + drift * screenW,
    screenY + screenH
  );

  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.42, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.5, `rgba(255, 255, 255, ${Math.min(0.5, intensity * 0.4)})`);
  sheenGrad.addColorStop(0.58, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = sheenGrad;
  ctx.fillRect(screenX, screenY, screenW, screenH);
  ctx.restore();
}

/**
 * Draws Pixel-Perfect Modern macOS Browser Window (Arc / Safari / Chrome style)
 */
export function drawBrowserFrame(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState
) {
  const headerH = Math.max(38, screenY);
  const isLight = project.desktopFrame?.theme === 'light';

  ctx.save();

  // 1. Window Outer Shell with subtle gradient & outer border
  drawRoundedRect(ctx, 0, 0, phoneW, phoneH, cornerRadius);
  const bgGrad = ctx.createLinearGradient(0, 0, 0, headerH);
  if (isLight) {
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#F3F4F6');
  } else {
    bgGrad.addColorStop(0, '#24262D');
    bgGrad.addColorStop(1, '#18191E');
  }
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // 1px Window perimeter border
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 2. Traffic Light Buttons with subtle gradient & 3D rim
  const dotY = headerH * 0.5;
  const startDotX = 18;
  const dotSpacing = 16;
  const dotR = 5.5;

  const dots = [
    { start: '#FF6058', end: '#E0443E', border: '#D0342E' }, // Red (Close)
    { start: '#FFBE2F', end: '#DEA123', border: '#CE9118' }, // Yellow (Minimize)
    { start: '#28CA41', end: '#1AAB29', border: '#129B20' }, // Green (Expand)
  ];

  dots.forEach((dot, idx) => {
    const cx = startDotX + idx * dotSpacing;
    const g = ctx.createRadialGradient(cx - 1, dotY - 1, 0.5, cx, dotY, dotR);
    g.addColorStop(0, dot.start);
    g.addColorStop(1, dot.end);

    ctx.beginPath();
    ctx.arc(cx, dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = dot.border;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  });

  // 3. Navigation Controls (< > ↻)
  const navStartX = startDotX + dots.length * dotSpacing + 12;
  ctx.fillStyle = isLight ? '#6B7280' : '#9CA3AF';
  ctx.font = '600 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('‹', navStartX, dotY - 0.5);
  ctx.fillText('›', navStartX + 14, dotY - 0.5);
  ctx.font = '500 11px system-ui, sans-serif';
  ctx.fillText('↻', navStartX + 30, dotY);

  // 4. Centered URL Search Address Pill
  const pillW = Math.min(420, phoneW * 0.44);
  const pillH = Math.min(26, headerH * 0.62);
  const pillX = (phoneW - pillW) / 2;
  const pillY = (headerH - pillH) / 2;

  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 7);
  ctx.fillStyle = isLight ? '#FFFFFF' : '#0E0F12';
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // URL Padlock Icon + Formatted Domain Text
  const rawUrl = project.desktopFrame?.url || 'https://maya.studio/demo';
  const cleanDomain = rawUrl.replace(/^https?:\/\//, '');

  ctx.font = '500 10.5px Inter, -apple-system, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Padlock symbol
  ctx.fillStyle = isLight ? '#10B981' : '#34D399';
  ctx.fillText('🔒', pillX + 16, pillY + pillH / 2);

  // Domain Text
  ctx.fillStyle = isLight ? '#1F2937' : '#F3F4F6';
  ctx.fillText(cleanDomain, pillX + pillW / 2 + 6, pillY + pillH / 2);

  // 5. Hairline divider between titlebar and screen
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(phoneW, headerH);
  ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws Pro Hacker Terminal Window (Ghostty / iTerm2 / Linux shell)
 */
export function drawTerminalFrame(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState
) {
  const headerH = Math.max(36, screenY);

  ctx.save();

  // 1. Terminal Dark Acrylic Body
  drawRoundedRect(ctx, 0, 0, phoneW, phoneH, cornerRadius);
  const terminalGrad = ctx.createLinearGradient(0, 0, 0, headerH);
  terminalGrad.addColorStop(0, '#161B26');
  terminalGrad.addColorStop(1, '#0C1017');
  ctx.fillStyle = terminalGrad;
  ctx.fill();

  // Neon glowing outer stroke
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 2. Traffic Light Dots
  const dotY = headerH * 0.5;
  const startDotX = 18;
  const dotSpacing = 16;
  const dotR = 5.5;

  ['#EF4444', '#F59E0B', '#10B981'].forEach((color, idx) => {
    ctx.beginPath();
    ctx.arc(startDotX + idx * dotSpacing, dotY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // 3. Active Monospace Tab Capsule
  const tabW = Math.min(320, phoneW * 0.42);
  const tabH = Math.min(24, headerH * 0.65);
  const tabX = (phoneW - tabW) / 2;
  const tabY = (headerH - tabH) / 2;

  drawRoundedRect(ctx, tabX, tabY, tabW, tabH, 5);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Prompt Title: 📁 maya-linux ➜ git:(main)
  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 10.5px "JetBrains Mono", "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tabTitle = project.desktopFrame?.title || 'maya-linux — git:(main) — 80x24';
  ctx.fillText(`⚡ ${tabTitle}`, pillCenter(tabX, tabW), tabY + tabH / 2);

  // 4. Header divider
  ctx.beginPath();
  ctx.moveTo(0, headerH);
  ctx.lineTo(phoneW, headerH);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function pillCenter(x: number, w: number): number {
  return x + w / 2;
}

/**
 * Draws 5K Retina Apple Studio Display 27" with Aluminum Stand
 */
export function drawStudioDisplayFrame(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState
) {
  ctx.save();

  const isSilver = project.deviceColorID !== 'space-black';
  const displayH = screenY + screenH + screenY; // Screen height + uniform bottom bezel

  // 1. Aluminum Stand (Neck & Foot)
  const neckW = phoneW * 0.11;
  const neckH = phoneH - displayH + 10;
  const neckX = (phoneW - neckW) / 2;
  const neckY = displayH - 8;

  // Stand Neck Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  // Stand Neck Aluminum Gradient
  const neckGrad = ctx.createLinearGradient(neckX, 0, neckX + neckW, 0);
  neckGrad.addColorStop(0, isSilver ? '#CBD5E1' : '#334155');
  neckGrad.addColorStop(0.5, isSilver ? '#F1F5F9' : '#475569');
  neckGrad.addColorStop(1, isSilver ? '#94A3B8' : '#1E293B');
  ctx.fillStyle = neckGrad;
  drawRoundedRect(ctx, neckX, neckY, neckW, neckH, 4);
  ctx.fill();
  ctx.restore();

  // Cable Management Hole inside neck
  const holeW = neckW * 0.45;
  const holeH = holeW * 1.6;
  const holeX = (phoneW - holeW) / 2;
  const holeY = neckY + neckH * 0.35;
  drawRoundedRect(ctx, holeX, holeY, holeW, holeH, holeW / 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.strokeStyle = isSilver ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stand Base Foot (Rounded Perspective Plate)
  const footW = phoneW * 0.36;
  const footH = 10;
  const footX = (phoneW - footW) / 2;
  const footY = phoneH - footH;

  // Foot contact shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, footX, footY, footW, footH, 4);
  const footGrad = ctx.createLinearGradient(footX, footY, footX, footY + footH);
  footGrad.addColorStop(0, isSilver ? '#F8FAFC' : '#475569');
  footGrad.addColorStop(1, isSilver ? '#94A3B8' : '#1E293B');
  ctx.fillStyle = footGrad;
  ctx.fill();
  ctx.restore();

  // 2. Display Outer Housing (Black Anodized Uniform Slim Bezel)
  drawRoundedRect(ctx, 0, 0, phoneW, displayH, 12);
  ctx.fillStyle = '#090A0F';
  ctx.fill();

  // Outer Aluminum Rim Chamfer
  ctx.strokeStyle = isSilver ? '#94A3B8' : '#334155';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 3. 12MP Center Stage Ultra-Wide Camera & Status LED (Top Bezel Center)
  const camX = phoneW / 2;
  const camY = screenY * 0.48;

  // Lens Housing
  ctx.beginPath();
  ctx.arc(camX, camY, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Optical glass lens reflection (multi-coat purple sheen)
  ctx.beginPath();
  ctx.arc(camX, camY, 2.2, 0, Math.PI * 2);
  const lensGrad = ctx.createRadialGradient(camX - 0.5, camY - 0.5, 0.2, camX, camY, 2.2);
  lensGrad.addColorStop(0, '#6366F1');
  lensGrad.addColorStop(0.6, '#3B82F6');
  lensGrad.addColorStop(1, '#0B0F19');
  ctx.fillStyle = lensGrad;
  ctx.fill();

  // Green status LED dot (right of camera)
  ctx.beginPath();
  ctx.arc(camX + 14, camY, 1.2, 0, Math.PI * 2);
  ctx.fillStyle = '#22C55E';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws Rugged Apple Watch Ultra 2 Titanium Case (49mm)
 */
export function drawWatchUltraFrame(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState
) {
  ctx.save();

  const isNaturalTitanium = project.deviceColorID !== 'black-titanium';

  // 1. Aerospace Titanium Outer Case (Grade 5 Chamfered Shell)
  const caseRadius = phoneW * 0.22;
  drawRoundedRect(ctx, 0, 0, phoneW, phoneH, caseRadius);
  const caseGrad = ctx.createLinearGradient(0, 0, phoneW, phoneH);
  if (isNaturalTitanium) {
    caseGrad.addColorStop(0, '#E2E8F0');
    caseGrad.addColorStop(0.5, '#CBD5E1');
    caseGrad.addColorStop(1, '#94A3B8');
  } else {
    caseGrad.addColorStop(0, '#334155');
    caseGrad.addColorStop(0.5, '#1E293B');
    caseGrad.addColorStop(1, '#0F172A');
  }
  ctx.fillStyle = caseGrad;
  ctx.fill();

  ctx.strokeStyle = isNaturalTitanium ? '#64748B' : '#000000';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Right Side: Knurled Digital Crown with Orange Accent Groove
  const crownW = 8;
  const crownH = phoneH * 0.28;
  const crownX = phoneW - 3;
  const crownY = phoneH * 0.26;

  drawRoundedRect(ctx, crownX, crownY, crownW, crownH, 3);
  ctx.fillStyle = '#475569';
  ctx.fill();

  // Orange Ring Groove
  ctx.fillStyle = '#F97316';
  ctx.fillRect(crownX + 2, crownY + crownH * 0.35, crownW - 2, crownH * 0.3);

  // Right Side Button Guard
  drawRoundedRect(ctx, phoneW - 3, phoneH * 0.62, 5, phoneH * 0.16, 2);
  ctx.fillStyle = '#64748B';
  ctx.fill();

  // 3. Left Side: International Orange Action Button + Speaker Vents
  const actionW = 6;
  const actionH = phoneH * 0.26;
  const actionX = -3;
  const actionY = phoneH * 0.36;

  drawRoundedRect(ctx, actionX, actionY, actionW, actionH, 2.5);
  ctx.fillStyle = '#F97316';
  ctx.fill();

  // Machined Dual Row Speaker Holes (Left Side)
  ctx.fillStyle = '#0F172A';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(4, phoneH * 0.66 + i * 5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, phoneH * 0.66 + i * 5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Raised Sapphire Glass Display Protective Lip
  drawRoundedRect(ctx, screenX - 3, screenY - 3, screenW + 6, screenH + 6, cornerRadius + 2);
  ctx.fillStyle = '#050608';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws Google Pixel 9 Pro Camera Punch-Hole & Polished Rail Frame
 */
export function drawPixelFrame(
  ctx: CanvasRenderingContext2D,
  phoneW: number,
  phoneH: number,
  screenX: number,
  screenY: number,
  screenW: number,
  screenH: number,
  cornerRadius: number,
  project: ProjectState
) {
  ctx.save();

  // Polished Aluminum Side Rails
  drawRoundedRect(ctx, 0, 0, phoneW, phoneH, cornerRadius);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Top Speaker Earpiece Slit
  const speakerW = phoneW * 0.16;
  const speakerX = (phoneW - speakerW) / 2;
  ctx.fillStyle = '#1E293B';
  drawRoundedRect(ctx, speakerX, screenY * 0.35, speakerW, 2.5, 1.2);
  ctx.fill();

  // Center Front Camera Punch-Hole with Lens Optical Glass Reflection
  const camX = phoneW / 2;
  const camY = screenY + 14;

  ctx.beginPath();
  ctx.arc(camX, camY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(camX, camY, 3, 0, Math.PI * 2);
  const lensGrad = ctx.createRadialGradient(camX - 0.5, camY - 0.5, 0.3, camX, camY, 3);
  lensGrad.addColorStop(0, '#38BDF8');
  lensGrad.addColorStop(0.7, '#1E293B');
  lensGrad.addColorStop(1, '#050608');
  ctx.fillStyle = lensGrad;
  ctx.fill();

  ctx.restore();
}
