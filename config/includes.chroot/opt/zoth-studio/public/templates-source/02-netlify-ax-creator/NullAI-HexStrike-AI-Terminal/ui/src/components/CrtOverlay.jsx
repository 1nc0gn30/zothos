import React from 'react';

const CrtOverlay = ({ enabled = true, scanlines = true, flicker = true }) => {
  if (!enabled) return null;

  return (
    <div className="crt-master-overlay" aria-hidden="true">
      {scanlines && <div className="crt-scanlines" />}
      {flicker && <div className="crt-flicker" />}
      <div className="crt-vignette" />
      <div className="crt-phosphor-glow" />

      <style>{`
        .crt-master-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 999;
          overflow: hidden;
        }

        .crt-scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.45) 50%
          );
          background-size: 100% 4px;
          z-index: 1000;
          opacity: 0.85;
        }

        .crt-flicker {
          position: absolute;
          inset: 0;
          background: rgba(255, 0, 50, 0.015);
          opacity: 0.6;
          animation: crtFlicker 0.15s infinite;
          z-index: 1001;
        }

        .crt-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            transparent 60%,
            rgba(0, 0, 0, 0.8) 100%
          );
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.9);
          z-index: 1002;
        }

        .crt-phosphor-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 30, 30, 0.03) 0%,
            transparent 75%
          );
          z-index: 1003;
        }

        @keyframes crtFlicker {
          0% { opacity: 0.25; }
          50% { opacity: 0.35; }
          100% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

export default CrtOverlay;
