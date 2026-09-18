/**
 * zoth-hero-title.js — Hero H1 life: per-word staggered rise-in + ink sweep trigger.
 * Runs once on load (defer). No IntersectionObserver. Respects prefers-reduced-motion.
 */
(function () {
  "use strict";
  var h1 = document.querySelector(".hero-h1");
  if (!h1 || h1.dataset.zh1Bound) return;
  h1.dataset.zh1Bound = "1";

  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { /* treat as no-preference */ }

  var text = h1.textContent;
  if (reduced) {
    h1.classList.add("zh1-live");
    return; // skip animation entirely; CSS keeps static rendering
  }

  var words = text.split(/\s+/).filter(Boolean);
  h1.textContent = "";
  words.forEach(function (word, i) {
    var span = document.createElement("span");
    span.className = "zh1-word";
    span.textContent = word;
    if (i < words.length - 1) span.textContent += " ";
    span.style.animationDelay = (i * 90) + "ms, " + (1400 + i * 120) + "ms";
    h1.appendChild(span);
  });

  h1.classList.add("zh1-live"); // enables the breathing cyan underglow
})();
