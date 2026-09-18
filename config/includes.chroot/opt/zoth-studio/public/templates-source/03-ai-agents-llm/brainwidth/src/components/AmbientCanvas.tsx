import React, { useEffect, useRef } from 'react';

interface AmbientCanvasProps {
  currentLoad?: number;
  peakLoad?: number;
}

export const AmbientCanvas: React.FC<AmbientCanvasProps> = ({ currentLoad = 0, peakLoad = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system
    const numParticles = Math.min(50, Math.floor((width * height) / 30000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      hue: number;
    }> = [];

    const getPrimaryHue = () => {
      if (peakLoad > 10) return 0; // Red for overloaded
      if (peakLoad > 7) return 38; // Amber/Yellow
      return 155; // Emerald / Cyan
    };

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        hue: getPrimaryHue() + (Math.random() * 30 - 15),
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const baseHue = getPrimaryHue();

      // Draw subtle background radial gradient glowing orb
      const grad = ctx.createRadialGradient(
        width * 0.7 + Math.sin(time * 0.5) * 100,
        height * 0.3 + Math.cos(time * 0.3) * 100,
        50,
        width * 0.7,
        height * 0.3,
        width * 0.6
      );
      grad.addColorStop(0, `hsla(${baseHue}, 70%, 50%, 0.07)`);
      grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles & connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * (1 + currentLoad * 0.05);
        p.y += p.vy * (1 + currentLoad * 0.05);

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${baseHue}, 70%, 60%, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles with neural bandwidth lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `hsla(${baseHue}, 70%, 50%, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentLoad, peakLoad]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      aria-hidden="true"
    />
  );
};
