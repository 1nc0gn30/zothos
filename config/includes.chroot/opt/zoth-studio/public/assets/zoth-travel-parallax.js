/**
 * Zoth Studio — Seamless Fluid Scroll & Waypoint Synchronizer (v7.0)
 * Uses IntersectionObserver and high-frequency scroll telemetry for:
 *   1. 100% Guaranteed visible sections across desktop and mobile.
 *   2. Zero clipping or trapped 100vh absolute chamber states.
 *   3. Responsive waypoint HUD synchronization.
 *   4. Smooth in-page anchor navigation.
 */
(function () {
  "use strict";

  var WAYPOINTS = [
    { id: "hero", title: "01 Workspace" },
    { id: "how-it-works", title: "02 How It Works" },
    { id: "interface", title: "03 Communicator" },
    { id: "agents", title: "04 Agent Team" },
    { id: "trust", title: "05 Privacy & Trust" },
    { id: "install", title: "06 1-Click Setup" }
  ];

  function initTravelParallax() {
    var stages = document.querySelectorAll(".travel-scene-stage");
    var hudDial = document.getElementById("hudProgressDial");
    var waypointBtns = document.querySelectorAll(".hud-waypoint-btn");
    var spaceMesh = document.querySelector(".travel-grid-mesh");

    if (stages.length === 0) return;

    // 1. Ensure all stages are permanently visible and interactive
    stages.forEach(function (stage) {
      stage.classList.add("revealed");
      stage.classList.remove("reveal-pending");
    });

    // 2. Setup IntersectionObserver for Waypoints & HUD sync
    if ("IntersectionObserver" in window) {
      var observerOptions = {
        root: null,
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1
      };

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var currentId = entry.target.id;
            var activeIdx = WAYPOINTS.findIndex(function (w) { return w.id === currentId; });

            if (activeIdx !== -1) {
              waypointBtns.forEach(function (btn, idx) {
                var isActive = idx === activeIdx;
                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-selected", String(isActive));
              });

              if (hudDial) {
                var pct = Math.round(((activeIdx + 1) / WAYPOINTS.length) * 100);
                hudDial.textContent = "WARP " + pct + "%";
              }
            }
          }
        });
      }, observerOptions);

      stages.forEach(function (stage) {
        observer.observe(stage);
      });
    }

    // 3. Smooth global scroll progress tracking
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
          var docHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
          var progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

          if (hudDial && !document.querySelector(".hud-waypoint-btn.active")) {
            hudDial.textContent = "WARP " + Math.round(progress * 100) + "%";
          }

          if (spaceMesh) {
            var translateY = 60 - (progress * 80);
            spaceMesh.style.transform = "perspective(600px) rotateX(60deg) translate3d(0, " + translateY + "px, 0) scale(1.8)";
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 4. Smooth Anchor Link Handler
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (href && href.length > 1 && href.startsWith("#")) {
          var targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            try {
              history.pushState(null, "", href);
            } catch (err) {}
          }
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTravelParallax);
  } else {
    initTravelParallax();
  }
})();
