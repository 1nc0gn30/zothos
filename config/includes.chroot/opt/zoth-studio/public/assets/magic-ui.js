/**
 * ============================================================================
 * HERMETIC MAGIC UI VANILLA INTERACTION LIBRARY (v3.0)
 * ============================================================================
 * Golden Ratio (\u03a6 = 1.618) Spotlight Tracking & Celestial Meteor Rain Fields
 * Colors: #fbbf24 (Solar Gold) · #00f0ff (Aether Cyan) · #34d399 (Emerald Verde)
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const PHI = 1.618033988749895;

  // 1. Dynamic Golden Ratio Spotlight Tracker
  document.querySelectorAll('.magic-spotlight').forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      elem.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      elem.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });

  // 2. Hermetic Celestial Meteor Generator (Fibonacci Count: 13 per container)
  const meteorContainers = document.querySelectorAll('.magic-meteors');
  const METEOR_THEMES = ['#fbbf24', '#00f0ff', '#34d399', '#fde68a'];

  meteorContainers.forEach((container) => {
    const meteorCount = 13; // Fibonacci F_7
    for (let i = 0; i < meteorCount; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'magic-meteor';
      const col = METEOR_THEMES[i % METEOR_THEMES.length];
      meteor.style.left = `${(i * (100 / meteorCount) + (Math.random() * 8 - 4))}%`;
      meteor.style.animationDelay = `${(i * 0.38 * PHI) % 6}s`;
      meteor.style.animationDuration = `${2.4 + (i % 5) * 0.618}s`;
      meteor.style.setProperty('--meteor-color', col);
      container.appendChild(meteor);
    }
  });
});

