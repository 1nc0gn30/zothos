/* ============================================================
   "Constellation Ledger" ticker — interaction layer.
   Budget per spec/direction.md: IntersectionObserver + class
   toggles only. No rAF. Skips entirely under reduced motion.

   SECTIONS
     1. Guards (reduced motion, missing root/IO)
     2. Ignition on scroll-in (once)
     3. Pause state — hover / touch / focus / tab-switch
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Guards ---------- */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var root = document.getElementById("tk-ticker");
  if (!root || !("IntersectionObserver" in window)) return;

  var marquee = root.querySelector(".tk-marquee");
  if (!marquee) return;

  /* Arm the pre-ignition hide BEFORE observing. If this script never
     ran, the stack is never armed and logos render visible at rest —
     CSS ignition only enhances an already-visible component. Deferred
     execution means arming lands before first paint (no flash). */
  root.classList.add("tk-armed");

  /* ---------- 2. Ignition on scroll-in: fire once ---------- */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        root.classList.add("tk-inview");
        observer.disconnect();
      });
    },
    { threshold: 0.25 }
  );
  observer.observe(root);

  /* ---------- 3. Pause state ----------
     One source of truth: tk-paused on the marquee. A "sticky" flag
     remembers user intent (touch toggle / focus) so transient events
     — synthesized mouse events on hybrid devices, rapid hover/focus
     toggling, tab switches — can never fight each other or leak a
     stuck paused state. */
  var stickyPaused = false;

  function apply() {
    marquee.classList.toggle("tk-paused", stickyPaused || hovered || hidden);
  }

  // Hover: track state instead of blind add/remove so a mouseleave that
  // races a focusin (rapid toggling) can't unpause a focused strip.
  var hovered = false;
  marquee.addEventListener("mouseenter", function () {
    hovered = true;
    apply();
  });
  marquee.addEventListener("mouseleave", function () {
    hovered = false;
    apply();
  });

  // Touch tap toggles user intent (passive: vertical scroll stays native).
  marquee.addEventListener(
    "touchstart",
    function () {
      stickyPaused = !stickyPaused;
      apply();
    },
    { passive: true }
  );

  // Keyboard parity: hold still while a logo has focus. focusout defers
  // one tick so moving focus between adjacent logos never flickers pause.
  marquee.addEventListener("focusin", function () {
    stickyPaused = true;
    apply();
  });
  marquee.addEventListener("focusout", function () {
    window.setTimeout(function () {
      if (!marquee.contains(document.activeElement)) {
        stickyPaused = false;
        apply();
      }
    }, 0);
  });

  // Tab-switch: browsers throttle CSS animations inconsistently while
  // hidden; pin the pause explicitly and restore exactly what was there.
  var hidden = document.visibilityState === "hidden";
  document.addEventListener("visibilitychange", function () {
    hidden = document.visibilityState === "hidden";
    apply();
  });

  apply();
})();
