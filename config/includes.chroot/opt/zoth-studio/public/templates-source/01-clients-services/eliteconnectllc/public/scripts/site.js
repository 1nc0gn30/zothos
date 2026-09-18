(function() {
  'use strict';

  /* ---------- Scroll-aware navbar ---------- */
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('scrolled', y > 24);
      if (y > lastScroll && y > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Dark mode logo swap ---------- */
  function updateLogo() {
    document.querySelectorAll('img[data-logo-light][data-logo-dark]').forEach(function(img) {
      const isDark = document.documentElement.classList.contains('dark');
      const target = isDark ? img.dataset.logoDark : img.dataset.logoLight;
      if (img.getAttribute('src') !== target) {
        img.src = target;
      }
    });
  }
  updateLogo();
  const logoObserver = new MutationObserver(updateLogo);
  logoObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  /* ---------- Active nav link ---------- */
  const path = location.pathname;
  document.querySelectorAll('.nav-links a, .drawer-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && (path === href || (path.startsWith(href.replace(/\/$/, '')) && href !== '/'))) {
      a.classList.add('active');
    } else if (href === '/' && path === '/') {
      a.classList.add('active');
    }
  });

  /* ---------- Mobile drawer ---------- */
  const menuBtn = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');

  function openDrawer() {
    if (!menuBtn || !mobileDrawer || !mobileBackdrop) return;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }
  function closeDrawer() {
    if (!menuBtn || !mobileDrawer || !mobileBackdrop) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
  if (menuBtn && mobileDrawer && mobileBackdrop) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeDrawer() : openDrawer();
    });
    drawerClose && drawerClose.addEventListener('click', closeDrawer);
    mobileBackdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        closeDrawer();
      }
    });
  }

  /* ---------- Internal link loader ---------- */
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    if (a.target === '_blank') return;
    a.addEventListener('click', function() {
      const loader = document.getElementById('page-loader');
      if (!loader) return;
      loader.classList.remove('page-loader--done');
      loader.style.opacity = '1';
      loader.style.visibility = 'visible';
      // Update label if this link has one
      const label = a.dataset.loaderLabel;
      if (label) {
        const textEl = loader.querySelector('.page-loader-text');
        if (textEl) textEl.textContent = label;
      }
    });
  });

  /* ---------- Netlify AJAX forms with inline success ---------- */
  document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn && btn.querySelector('.btn-text');
      const btnLoader = btn && btn.querySelector('.btn-loader');
      const successId = form.getAttribute('data-form-success');
      const successEl = successId ? document.getElementById(successId) : null;
      const formView = form.closest('.lead-modal-body') || form;

      // Loading state
      if (btn) {
        btn.disabled = true;
        if (btnText) btnText.hidden = true;
        if (btnLoader) btnLoader.hidden = false;
      }

      const data = new FormData(form);
      const action = form.getAttribute('action') || '/';

      fetch('/', {
        method: 'POST',
        headers: { 'Accept': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(data).toString()
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed');

        // Show inline success if available
        if (successEl && formView) {
          if (formView.classList.contains('lead-modal-body')) {
            formView.hidden = true;
          } else {
            form.hidden = true;
          }
          successEl.hidden = false;

          // Reset button for next time
          if (btn) {
            btn.disabled = false;
            if (btnText) btnText.hidden = false;
            if (btnLoader) btnLoader.hidden = true;
          }
          form.reset();
        } else {
          // Fallback redirect
          window.location.href = action;
        }
      })
      .catch(() => {
        // Fallback to native submit
        form.submit();
      });
    });
  });
})();
