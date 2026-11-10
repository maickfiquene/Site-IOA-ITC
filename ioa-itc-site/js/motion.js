(() => {
  if (!window.IOA || !IOA.ui) return;
  const { $, $$, fmt } = IOA.ui;
  const html = document.documentElement;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;
  html.classList.add('motion');
  mq.addEventListener('change', e => {
    if (!e.matches) return;
    html.classList.remove('motion', 'vt-fallback', 'is-leaving');
    $$('.reveal').forEach(el => el.classList.add('in'));
  });

  /* Reveal ao rolar, com stagger entre irmãos */
  const STEP = 80, MAX = 8;
  const AUTO = '.reveal, [data-reveal], .sec-head, .g-item, .svc-grid > li, .timeline > li, .stat, .visit-band';
  const NO_ANIM = 'form, .form-card, [data-form], .loc__card, a[href^="tel:"], a[href*="wa.me"], a[href*="instagram.com"], a[href*="google.com/maps"]';
  const isContact = el => el.matches(NO_ANIM) || !!el.querySelector('form, [data-form], a[href^="tel:"]');
  const seen = new WeakSet();

  const show = (el, delay) => {
    el.style.setProperty('--rd', `${delay}ms`);
    el.classList.add('is-revealing', 'is-visible');
    setTimeout(() => { el.classList.remove('is-revealing'); el.style.removeProperty('--rd'); }, 650 + delay);
  };
  const io = new IntersectionObserver(entries => {
    const groups = new Map();
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const p = e.target.parentElement;
      groups.set(p, [...(groups.get(p) || []), e.target]);
    });
    groups.forEach(list => list
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .forEach((el, i) => show(el, Math.min(i, MAX) * STEP)));
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const tag = el => {
    if (seen.has(el)) return;
    seen.add(el);
    if (isContact(el)) { el.dataset.reveal = 'off'; el.classList.add('is-visible'); return; }
    if (!el.dataset.reveal) el.dataset.reveal = '';
    io.observe(el);
  };
  const scan = (root = document) => {
    if (root !== document && root.matches(AUTO)) tag(root);
    root.querySelectorAll(AUTO).forEach(tag);
  };
  IOA.ui.reveal = scan;
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && scan(n))))
    .observe(document.body, { childList: true, subtree: true });

  /* Contadores (700 ms ao entrar na tela) */
  IOA.ui.counters = (root = document) => {
    const run = el => {
      const to = +el.dataset.count, t0 = performance.now();
      const step = t => {
        const p = Math.min(1, (t - t0) / 700);
        el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { cio.unobserve(e.target); run(e.target); }
    }), { threshold: 0.5 });
    $$('[data-count]', root).forEach(el => { el.textContent = '0'; cio.observe(el); });
  };

  /* Transição entre páginas: nativa (View Transitions) ou fade de fallback (classe definida no head) */
  if (html.classList.contains('vt-fallback')) {
    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.protocol !== location.protocol || a.host !== location.host || !/\.html$/.test(a.pathname)) return;
      if (a.pathname === location.pathname && a.search === location.search) return;
      e.preventDefault();
      html.classList.add('is-leaving');
      setTimeout(() => { location.href = a.href; }, 300);
    });
    addEventListener('pageshow', e => { if (e.persisted) html.classList.remove('is-leaving'); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const pxs = $$('.hero__bg, .phero__bg').map(img => {
      const w = document.createElement('div');
      w.className = 'm-px';
      img.before(w);
      w.append(img);
      return w;
    });
    const header = $('.site-header');
    let ticking = false;
    const update = () => {
      ticking = false;
      if (header) header.classList.toggle('is-scrolled', scrollY > 24);
      pxs.forEach(w => {
        const r = w.parentElement.getBoundingClientRect();
        if (r.bottom > 0) w.style.transform = `translate3d(0, ${Math.max(0, -r.top) * 0.25}px, 0)`;
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });
})();
