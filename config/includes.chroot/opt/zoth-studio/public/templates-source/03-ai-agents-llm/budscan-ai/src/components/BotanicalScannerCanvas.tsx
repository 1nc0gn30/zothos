import React, { useEffect, useRef } from 'react';

interface BotanicalScannerCanvasProps {
  isScanning: boolean;
  quality?: string | null;
}

export default function BotanicalScannerCanvas({ isScanning, quality }: BotanicalScannerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanLineY = 0;
    let scanDirection = 1;
    let particles: Array<{ x: number; y: number; size: number; alpha: number; speed: number }> = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    resize();

    // Create particles for trichome simulation mesh
    const w = canvas.clientWidth || 350;
    const h = canvas.clientHeight || 350;
    particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.8 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Render grid crosshairs & corner brackets
      ctx.strokeStyle = quality === 'moldy' 
        ? 'rgba(239, 68, 68, 0.4)' 
        : quality === 'pgr' 
        ? 'rgba(168, 85, 247, 0.4)' 
        : 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;

      // Draw particle mesh
      particles.forEach((p) => {
        p.y += p.speed * (isScanning ? 2 : 0.5);
        if (p.y > h) p.y = 0;

        ctx.fillStyle = isScanning
          ? `rgba(52, 211, 153, ${p.alpha})`
          : quality === 'moldy'
          ? `rgba(248, 113, 113, ${p.alpha})`
          : `rgba(16, 185, 129, ${p.alpha * 0.6})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center AI focal reticle
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.28;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer targeting ring
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = isScanning ? '#10b981' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Active scanning laser line
      if (isScanning) {
        scanLineY += 3 * scanDirection;
        if (scanLineY > h / 2 || scanLineY < -h / 2) {
          scanDirection *= -1;
        }

        ctx.beginPath();
        ctx.moveTo(-w / 2, scanLineY);
        ctx.lineTo(w / 2, scanLineY);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScanning, quality]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-10"
      aria-hidden="true"
    />
  );
}
