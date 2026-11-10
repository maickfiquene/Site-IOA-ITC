(() => {
  const { $, $$, esc, icon, trap } = IOA.ui;
  const IMG = 'assets/img/';

  function lightbox(list, start, onClose) {
    let i = start;
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visualizar foto');
    lb.innerHTML = `
      <div class="lb__top"><span class="lb__count" aria-live="polite"></span>
        <button class="lb__btn" type="button" data-x aria-label="Fechar">${icon('close')}</button></div>
      <figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"></figcaption></figure>
      <button class="lb__btn lb__nav lb__nav--prev" type="button" data-prev aria-label="Foto anterior">${icon('left')}</button>
      <button class="lb__btn lb__nav lb__nav--next" type="button" data-next aria-label="Próxima foto">${icon('right')}</button>`;
    const img = $('.lb__img', lb), cap = $('.lb__cap', lb), count = $('.lb__count', lb);
    const show = n => {
      i = (n + list.length) % list.length;
      const p = list[i];
      img.classList.remove('is-in');
      img.src = IMG + p.f; img.alt = p.alt; img.width = p.w; img.height = p.h;
      cap.textContent = p.cap;
      count.textContent = `${i + 1} / ${list.length}`;
      requestAnimationFrame(() => img.classList.add('is-in'));
    };
    const close = () => {
      lb.remove(); document.removeEventListener('keydown', keys);
      document.body.classList.remove('no-scroll'); release(); onClose && onClose();
    };
    const keys = e => {
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    };
    lb.addEventListener('click', e => {
      if (e.target.closest('[data-x]') || e.target === lb || e.target.classList.contains('lb__fig')) close();
      else if (e.target.closest('[data-prev]')) show(i - 1);
      else if (e.target.closest('[data-next]')) show(i + 1);
    });
    let x0 = null, y0 = 0;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    if (list.length < 2) $$('.lb__nav', lb).forEach(b => (b.hidden = true));
    document.body.append(lb);
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', keys);
    const release = trap(lb, close);
    show(i);
    $('[data-x]', lb).focus();
  }

  function gallery(root) {
    const photos = IOA.getPhotos();
    const grid = $('[data-grid]', root), bar = $('[data-filters]', root);
    let cat = new URLSearchParams(location.search).get('cat') || 'todas';
    if (cat !== 'todas' && !IOA.GAL_CATS[cat]) cat = 'todas';
    const used = Object.keys(IOA.GAL_CATS).filter(k => photos.some(p => p.cat === k));
    bar.innerHTML = [['todas', 'Todas', photos.length], ...used.map(k => [k, IOA.GAL_CATS[k], photos.filter(p => p.cat === k).length])]
      .map(([k, t, n]) => `<button type="button" class="filter-chip" data-cat="${k}" aria-pressed="${k === cat}">${esc(t)} <span>${n}</span></button>`).join('');
    const render = () => {
      const list = cat === 'todas' ? photos : photos.filter(p => p.cat === cat);
      grid.innerHTML = list.map((p, n) => `
        <figure class="g-item${p.h > p.w ? ' g-item--tall' : ''}">
          <button type="button" class="g-item__btn" data-i="${n}" aria-label="Ampliar foto: ${esc(p.cap)}">
            <img src="${IMG + p.f}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
          </button>
          <figcaption><span class="g-item__cat">${esc(IOA.GAL_CATS[p.cat] || '')}</span>${esc(p.cap)}</figcaption>
        </figure>`).join('');
      $('[data-status]', root).textContent = `${list.length} ${list.length === 1 ? 'foto' : 'fotos'}`;
      grid.onclick = e => {
        const b = e.target.closest('[data-i]');
        if (b) lightbox(list, +b.dataset.i);
      };
    };
    bar.addEventListener('click', e => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      cat = b.dataset.cat;
      $$('[data-cat]', bar).forEach(x => x.setAttribute('aria-pressed', x === b));
      IOA.ui.setQuery({ cat: cat === 'todas' ? '' : cat });
      render();
    });
    render();
  }

  IOA.lightbox = lightbox;
  $$('[data-gallery]').forEach(gallery);
})();
