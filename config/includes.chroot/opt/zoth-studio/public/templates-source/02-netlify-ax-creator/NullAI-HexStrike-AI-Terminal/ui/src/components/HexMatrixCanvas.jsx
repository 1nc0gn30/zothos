import React, { useEffect, useRef } from 'react';

const HexMatrixCanvas = ({
  enabled = true,
  speed = 1.0,
  density = 35,
  color = '#ff0033',
  opacity = 0.22,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const hexChars = '0123456789ABCDEFλπΣΨΩ01010101#@%&><{}[]';

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initColumns();
    };

    window.addEventListener('resize', handleResize);

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = [];

    const initColumns = () => {
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        // Stagger initial heights
        drops[i] = Math.random() * -100;
      }
    };

    initColumns();

    let lastTime = 0;
    const interval = 1000 / (30 * speed);

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = currentTime - lastTime;
      if (delta < interval) return;
      lastTime = currentTime - (delta % interval);

      // Translucent fade over previous frame
      ctx.fillStyle = 'rgba(5, 0, 2, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'Fira Code', 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Skip some columns based on density
        if (i % Math.max(1, Math.floor(60 / density)) !== 0) continue;

        const char = hexChars[Math.floor(Math.random() * hexChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright leading character
        ctx.fillStyle = '#ffffff';
        ctx.fillText(char, x, y);

        // Trailing colored character
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fillText(char, x, y - fontSize);
        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, speed, density, color]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: opacity,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default HexMatrixCanvas;
