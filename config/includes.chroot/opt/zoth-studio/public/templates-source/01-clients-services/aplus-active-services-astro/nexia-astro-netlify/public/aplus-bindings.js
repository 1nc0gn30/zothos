(function () {
  var cfg = window.APLUS_CONFIG || {};
  function href(selector, url) {
    if (!url) return;
    document.querySelectorAll(selector).forEach(function (el) { el.setAttribute('href', url); });
  }
  function text(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (el) { el.textContent = value; });
  }
  function bind() {
    href('[data-aplus-link="collective"]', cfg.collectiveStripeUrl);
    href('[data-aplus-link="retainer"]', cfg.retainerStripeUrl);
    href('[data-aplus-link="newsletter"]', cfg.substackUrl);
    href('[data-aplus-link="calendar"]', cfg.calendarUrl);
    href('[data-aplus-link="inbound"]', cfg.inboundUrl);
    href('[data-aplus-link="podcast"]', cfg.podcastGuestLaunchUrl);
    document.querySelectorAll('[data-aplus-trio-image]').forEach(function (el) {
      var index = Number(el.getAttribute('data-aplus-trio-image'));
      var item = cfg.trio && cfg.trio[index];
      if (item && item.imageUrl) {
        el.style.backgroundImage = 'url("' + item.imageUrl + '")';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
      }
    });
    document.querySelectorAll('.nav-logo.black').forEach(function (img) {
      var wordmark = document.createElement('span');
      wordmark.className = 'aplus-wordmark';
      wordmark.textContent = 'A+ Active';
      img.replaceWith(wordmark);
    });
    document.querySelectorAll('.nexia-logo').forEach(function (img) {
      var wordmark = document.createElement('span');
      wordmark.className = 'aplus-wordmark';
      wordmark.textContent = 'A+ Active Services';
      img.replaceWith(wordmark);
    });
    document.querySelectorAll('.nav-link').forEach(function (a) {
      a.textContent = a.textContent.replace('Projects', 'Proof').replace('Blogs', 'Field Notes');
    });
    document.querySelectorAll('.button-text').forEach(function (el) {
      el.textContent = el.textContent
        .replace('Let’s Talk', 'Join for $197')
        .replace('Get Free Consultation', 'Join for $197')
        .replace('Start Now', 'Ask how we built this')
        .replace('Get Started', 'Start here');
    });
    document.querySelectorAll('h1,h2,h3,p,div,span').forEach(function (el) {
      if (!el.childElementCount) {
        el.textContent = el.textContent
          .replace(/ABOUT\s+NEXA/gi, 'ABOUT A+ ACTIVE')
          .replace(/\bNEXA\b/g, 'A+ Active')
          .replace(/\bNEXIA\b/g, 'A+ Active');
      }
    });
    document.querySelectorAll('.hero-para, .about-para, .cta-para').forEach(function (el) {
      el.textContent = el.textContent
        .replace(/We help brands grow faster through strategy-driven design, powerful websites, and high-impact digital solutions\\./gi, 'We help healthcare founders, clinics, and operators turn workflow ideas into MVPs, memberships, events, and last-mile software plans.')
        .replace(/Let.s turn your ideas into impactful digital products with A\\+ Active\\./gi, 'Bring us the healthcare workflow. We will help shape it, build it, and plan the last mile.');
    });
  }
  bind();
  document.addEventListener('DOMContentLoaded', bind);
  setTimeout(bind, 500);
})();
