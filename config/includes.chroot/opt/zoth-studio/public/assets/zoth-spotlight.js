/**
 * ⚡ Zoth Studio — Cursor Spotlight & Magnetic Physics Engine (v1.0)
 * Enhances all cards, workstations, and buttons with interactive pointer-linked lighting.
 */
(function () {
  'use strict';

  if (window.__ZOTH_SPOTLIGHT_LOADED__) return;
  window.__ZOTH_SPOTLIGHT_LOADED__ = true;

  function initSpotlight() {
    var targets = document.querySelectorAll('.card, .panel, .consensus-panel, .webgen-card, .radar-hud-card, .recon-card, .vault-card, .omni-card, .hud-card, .hero-value-card, .stage-scroll-panel, [class*="-card"]');

    document.addEventListener('pointermove', function (e) {
      targets.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', x.toFixed(1) + 'px');
        card.style.setProperty('--spotlight-y', y.toFixed(1) + 'px');
      });
    }, { passive: true });

    // Subtle magnetic button physics on primary action buttons
    var magneticBtns = document.querySelectorAll('.btn-on, .btn-primary, .magic-shimmer-btn, .nav-annotate-btn');
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px, ' + (y * 0.18).toFixed(1) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlight);
  } else {
    initSpotlight();
  }
})();
