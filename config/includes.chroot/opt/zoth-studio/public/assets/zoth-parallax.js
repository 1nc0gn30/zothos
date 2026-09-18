/**
 * Zoth Studio — Universal High-Performance Parallax & Section Reveal Engine (v5.0)
 * Multi-layer hardware-accelerated intersection reveals, depth parallax,
 * and fluid motion dynamics across all desktop, tablet, and mobile viewports.
 */
(function () {
  "use strict";

  function initParallax() {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = document.querySelectorAll(
      "section, .parallax-section, .hero, .creators-showcase, .note, .pets, .social-wall-section, .install, .travel-scene-stage"
    );
    var parallaxCards = document.querySelectorAll(
      ".parallax-card, .glass-stage-card, .hero-value-card, .tool-card, .pet-card, .social-card, .parallax-item, .agent-card, .install-box, .showcase-card, .note-card, .pantheon-grand-card, .binary-dl-card, .direct-binary-grid > div"
    );

    // 1. Intersection Observer for Smooth Reveal Ratios & Active Focal Points
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var sectionObserver = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var ratio = entry.intersectionRatio;
            var target = entry.target;
            target.style.setProperty("--reveal-ratio", Math.max(0.6, ratio).toFixed(3));

            if (entry.isIntersecting) {
              target.classList.add("in-view");
              if (ratio >= 0.25) {
                target.classList.add("in-focal-point");
              } else {
                target.classList.remove("in-focal-point");
              }
            } else {
              target.classList.remove("in-view");
              target.classList.remove("in-focal-point");
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -4% 0px",
          threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75, 1.0]
        }
      );

      sections.forEach(function (sec) {
        sectionObserver.observe(sec);
      });

      var cardObserver = new window.IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              entry.target.style.setProperty(
                "--reveal-ratio",
                Math.max(0.65, entry.intersectionRatio).toFixed(3)
              );
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -2% 0px",
          threshold: [0.05, 0.25, 0.5, 0.8]
        }
      );

      parallaxCards.forEach(function (card) {
        cardObserver.observe(card);
      });
    } else {
      // Reduced motion or fallback: ensure everything is fully visible immediately
      sections.forEach(function (sec) {
        sec.classList.add("in-view", "in-focal-point");
        sec.style.setProperty("--reveal-ratio", "1");
        sec.style.setProperty("--parallax-offset", "0px");
        sec.style.setProperty("--scroll-progress", "0");
      });
      parallaxCards.forEach(function (card) {
        card.classList.add("revealed");
        card.style.setProperty("--reveal-ratio", "1");
      });
    }

    // 2. High-Performance RequestAnimationFrame Multi-Layer Parallax Ticker
    if (!prefersReducedMotion) {
      var ticking = false;

      function updateParallax() {
        var vh = window.innerHeight || 800;

        sections.forEach(function (sec) {
          var rect = sec.getBoundingClientRect();
          // Check if section is within or near viewport
          if (rect.bottom > -100 && rect.top < vh + 100) {
            var centerOffset = rect.top + rect.height / 2 - vh / 2;
            var normalizedOffset = Math.max(-1, Math.min(1, centerOffset / vh));

            // Subtle, performant parallax shift (clamped for mobile stability)
            var offsetPx = Math.max(-40, Math.min(40, centerOffset * 0.12));
            sec.style.setProperty("--parallax-offset", offsetPx.toFixed(1) + "px");
            sec.style.setProperty("--scroll-progress", normalizedOffset.toFixed(3));

            // Shift ambient floating luminous orbs
            var orbs = sec.querySelectorAll(".parallax-orb");
            if (orbs.length > 0) {
              orbs.forEach(function (orb, i) {
                var factor = i % 2 === 0 ? 0.08 : -0.1;
                var orbShift = Math.max(-35, Math.min(35, centerOffset * factor));
                orb.style.transform = "translate3d(0, " + orbShift.toFixed(1) + "px, 0)";
              });
            }
          }
        });

        ticking = false;
      }

      function requestTick() {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }

      window.addEventListener("scroll", requestTick, { passive: true });
      window.addEventListener("touchmove", requestTick, { passive: true });
      window.addEventListener("touchend", requestTick, { passive: true });
      window.addEventListener("wheel", requestTick, { passive: true });
      window.addEventListener("resize", requestTick, { passive: true });
      window.addEventListener("orientationchange", function () {
        setTimeout(requestTick, 100);
      }, { passive: true });

      // Initial run
      updateParallax();

      window.ZothParallax = {
        refresh: updateParallax
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParallax);
  } else {
    initParallax();
  }
})();
