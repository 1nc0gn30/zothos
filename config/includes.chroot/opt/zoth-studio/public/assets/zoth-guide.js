/**
 * Zoth presence: crop the hero figure into background film.
 * Scroll narration is now handled unified by the floating Pet HUD Companion.
 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var FACE = "/assets/mascot/azoth-mask.jpg";
  var SEAL = "/assets/brand/azoth-seal-masterpiece.jpg";

  function placeFaces() {
    document.querySelectorAll("[data-face]").forEach(function (stage) {
      if (stage === document.body || stage === document.documentElement) return;
      if (stage.querySelector(".zoth-face")) return;
      var side = stage.getAttribute("data-face") || "east";
      if (side === "off") return;
      var img = document.createElement("img");
      img.className = "zoth-face " + side;
      img.src = FACE;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      stage.appendChild(img);
    });
    document.querySelectorAll("[data-seal]").forEach(function (el) {
      if (el.querySelector(".zoth-seal")) return;
      var img = document.createElement("img");
      img.className = "zoth-seal " + (el.getAttribute("data-seal") || "tr");
      img.src = SEAL;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      el.appendChild(img);
    });
  }

  // Remove any legacy floating guide box if present
  function cleanupLegacyGuide() {
    var oldGuide = document.getElementById("zoth-guide");
    if (oldGuide) {
      oldGuide.remove();
    }
  }

  function boot() {
    placeFaces();
    cleanupLegacyGuide();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
