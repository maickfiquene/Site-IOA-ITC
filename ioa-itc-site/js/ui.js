(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const P = {
    wa: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" fill="currentColor"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" />',
    left: '<path d="M15 6l-6 6 6 6" />',
    right: '<path d="M9 6l6 6-6 6" />',
    close: '<path d="M6 6l12 12M18 6 6 18" />',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" />',
    search: '<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />',
    filter: '<path d="M4 6h16M7 12h10M10 18h4" />',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" />',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" />',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" />',
    building: '<path d="M4 21V5l8-3 8 3v16" /><path d="M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2" />',
    tooth: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.4 2.5 1 6 2.5 6s1.8-4 2.5-6h4c.7 2 1 6 2.5 6s2.1-3.5 2.5-6c.5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z" />',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M7.5 15h9" />',
    check: '<path d="m5 12 4.5 4.5L19 7" />',
    chat: '<path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9.5h8M8 12.5h5" />',
    send: '<path d="M4 12 20 4l-6 16-3-7-7-1Z" />',
    up: '<path d="m6 15 6-6 6 6" />',
    down: '<path d="m6 9 6 6 6-6" />',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />'
  };
  const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trap(box, onEsc) {
    const prev = document.activeElement;
    const key = e => {
      if (e.key === 'Escape' && onEsc) { e.preventDefault(); onEsc(); return; }
      if (e.key !== 'Tab') return;
      const f = $$(FOCUSABLE, box).filter(el => el.offsetParent !== null || el === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); prev && prev.focus && prev.focus(); };
  }

  function modal({ title, body, wide = false, onClose }) {
    const wrap = document.createElement('div');
    wrap.className = 'modal';
    const id = 'm' + Math.random().toString(36).slice(2, 8);
    wrap.innerHTML = `<div class="modal__backdrop" data-close></div>
      <div class="modal__box ${wide ? 'modal__box--wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}">
        <div class="modal__head"><h2 id="${id}" class="modal__title">${esc(title)}</h2>
        <button class="icon-btn" type="button" data-close aria-label="Fechar">${icon('close')}</button></div>
        <div class="modal__body"></div></div>`;
    const bodyEl = $('.modal__body', wrap);
    typeof body === 'string' ? (bodyEl.innerHTML = body) : bodyEl.append(body);
    document.body.append(wrap);
    document.body.classList.add('no-scroll');
    let release;
    const close = () => {
      wrap.remove();
      if (!$('.modal')) document.body.classList.remove('no-scroll');
      release();
      onClose && onClose();
    };
    release = trap(wrap, close);
    wrap.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    requestAnimationFrame(() => { wrap.classList.add('is-open'); ($(FOCUSABLE, bodyEl) || $('[data-close].icon-btn', wrap)).focus(); });
    return { el: wrap, body: bodyEl, close };
  }

  function reveal(root = document) {
    const els = $$('.reveal:not(.in)', root);
    if (reduced() || !('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  const fmt = n => n.toLocaleString('pt-BR');
  function counters(root = document) {
    const els = $$('[data-count]', root);
    const run = el => {
      const to = +el.dataset.count;
      if (reduced()) { el.textContent = fmt(to); return; }
      const t0 = performance.now(), dur = 1400;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) return els.forEach(run);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.5 });
    els.forEach(e => { e.textContent = '0'; io.observe(e); });
  }

  const areaTags = (areas, cls = '') => areas.map(a => `<span class="tag ${cls}">${esc(IOA.AREAS[a] || a)}</span>`).join('');

  const courseCard = (c, { compare = false } = {}) => `
    <article class="card course-card reveal">
      <div class="course-card__tags">${areaTags(c.areas)}</div>
      <h3 class="course-card__title"><a href="especializacao.html?slug=${encodeURIComponent(c.slug)}">${esc(c.title)}</a></h3>
      <p class="course-card__meta">${esc(c.type)} · ${esc(c.modality)}</p>
      <p class="course-card__note">Consulte turmas e valores</p>
      <div class="course-card__foot">
        <a class="btn btn--sm btn--navy" href="especializacao.html?slug=${encodeURIComponent(c.slug)}" aria-label="Ver detalhes: ${esc(c.title)}">Ver detalhes ${icon('arrow')}</a>
        ${compare ? `<label class="check-compare"><input type="checkbox" data-compare="${esc(c.slug)}"> Comparar</label>` : ''}
      </div>
    </article>`;

  const setMeta = (title, desc) => {
    document.title = title;
    const m = $('meta[name="description"]');
    if (m) m.setAttribute('content', desc);
  };

  const setQuery = obj => {
    const q = new URLSearchParams(location.search);
    Object.entries(obj).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    const s = q.toString();
    try { history.replaceState(null, '', s ? `?${s}` : location.pathname); } catch (e) {}
  };

  IOA.ui = { $, $$, esc, norm, icon, trap, modal, reveal, counters, areaTags, courseCard, setMeta, reduced, fmt, setQuery };
})();
