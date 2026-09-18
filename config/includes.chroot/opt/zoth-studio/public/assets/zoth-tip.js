/**
 * One portal tip for the hub. data-tip="short line"
 * Skips coarse pointers so phones stay clean.
 */
(function () {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  var tip = document.createElement("div");
  tip.id = "zoth-tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.appendChild(tip);

  var timer = 0;
  var active = null;

  function hide() {
    window.clearTimeout(timer);
    tip.classList.remove("on");
    tip.hidden = true;
    active = null;
  }

  function place(el) {
    var r = el.getBoundingClientRect();
    tip.hidden = false;
    var tw = tip.offsetWidth;
    var th = tip.offsetHeight;
    var left = r.left + r.width / 2 - tw / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - tw - 10));
    var below = r.bottom + 10;
    var above = r.top - th - 10;
    var top = r.top > 88 && below + th < window.innerHeight - 8 ? below : above;
    if (top < 8) top = below;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tip.classList.add("on");
  }

  function show(el) {
    var text = el.getAttribute("data-tip");
    if (!text) return;
    active = el;
    tip.textContent = text;
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      if (active === el) place(el);
    }, 280);
  }

  document.addEventListener("mouseover", function (e) {
    var el = e.target.closest("[data-tip]");
    if (!el || el === active) return;
    show(el);
  });
  document.addEventListener("mouseout", function (e) {
    var el = e.target.closest("[data-tip]");
    if (!el) return;
    var next = e.relatedTarget && e.relatedTarget.closest
      ? e.relatedTarget.closest("[data-tip]")
      : null;
    if (next === el) return;
    hide();
  });
  document.addEventListener("focusin", function (e) {
    var el = e.target.closest("[data-tip]");
    if (el) show(el);
  });
  document.addEventListener("focusout", hide);
  window.addEventListener("scroll", hide, { passive: true });
})();
