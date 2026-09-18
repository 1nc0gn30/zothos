import { useEffect, useRef } from 'react';

interface AuraVisualizerProps {
  state?: 'listening' | 'processing' | 'speaking' | 'urgent';
  className?: string;
}

export default function AuraVisualizer({ state = 'listening', className = '' }: AuraVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }> = [];

    const numParticles = 24;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Re-init particles based on size
      particles.length = 0;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          radius: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          alpha: Math.random() * 0.6 + 0.2,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Color themes based on aura state
      let colorPrimary = 'rgba(15, 23, 42, 0.8)';
      let colorSecondary = 'rgba(99, 102, 241, 0.5)';
      let colorGlow = 'rgba(56, 189, 248, 0.3)';

      if (state === 'processing') {
        colorPrimary = 'rgba(124, 58, 237, 0.8)';
        colorSecondary = 'rgba(192, 132, 252, 0.6)';
        colorGlow = 'rgba(236, 72, 153, 0.4)';
      } else if (state === 'speaking') {
        colorPrimary = 'rgba(16, 185, 129, 0.8)';
        colorSecondary = 'rgba(52, 211, 153, 0.6)';
        colorGlow = 'rgba(45, 212, 191, 0.4)';
      } else if (state === 'urgent') {
        colorPrimary = 'rgba(244, 63, 94, 0.8)';
        colorSecondary = 'rgba(251, 146, 60, 0.6)';
        colorGlow = 'rgba(253, 224, 71, 0.4)';
      }

      // Outer ambient glow
      const outerGlowRadius = Math.min(width, height) * 0.38 + Math.sin(time * 2) * 8;
      const outerGradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, outerGlowRadius
      );
      outerGradient.addColorStop(0, colorGlow);
      outerGradient.addColorStop(0.5, colorSecondary);
      outerGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rotating plasma rings
      const rings = 3;
      for (let r = 0; r < rings; r++) {
        const ringRadius = Math.min(width, height) * (0.18 + r * 0.07);
        const rotationAngle = time * (1 - r * 0.2) * (r % 2 === 0 ? 1 : -1);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationAngle);

        ctx.beginPath();
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const distortion = Math.sin(angle * 4 + time * 3 + r) * 6;
          const currentR = ringRadius + distortion;
          const px = Math.cos(angle) * currentR;
          const py = Math.sin(angle) * currentR;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = r === 0 ? colorPrimary : colorSecondary;
        ctx.lineWidth = 2.5 - r * 0.5;
        ctx.shadowColor = colorGlow;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // Floating aura particle system
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorGlow;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Core inner luminous pulse
      const coreRadius = Math.min(width, height) * 0.12 + Math.cos(time * 3) * 4;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, coreRadius
      );
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.4, colorPrimary);
      coreGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [state]);

  return (
    <div className={`relative w-full h-full min-h-[300px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-2xl"
        role="img"
        aria-label={`Interactive AI Aura Visualizer in ${state} mode`}
      />
    </div>
  );
}
