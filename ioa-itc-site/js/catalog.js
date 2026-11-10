(() => {
  const { $, $$, esc, norm, icon, trap, modal, reveal, courseCard, setQuery } = IOA.ui;
  const courses = IOA.getCourses();
  const featured = $('[data-featured]');
  if (featured) {
    featured.innerHTML = courses.length ? courses.slice(0, 6).map(c => courseCard(c)).join('')
      : `<div class="empty" style="grid-column:1/-1"><h3>Catálogo em atualização</h3><p class="muted">Consulte a equipe.</p></div>`;
    reveal(featured);
  }
  const root = $('[data-catalog]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const st = {
    q: params.get('q') || '',
    areas: new Set((params.get('area') || '').split(',').filter(a => IOA.AREAS[a])),
    sort: 'procurados',
    cmp: []
  };
  const results = $('[data-results]'), count = $('[data-count-results]'), search = $('#busca'), sort = $('#ordem');
  const panel = $('#filtros'), areaBox = $('[data-areas]'), bar = $('[data-cmp-bar]');
  search.value = st.q;

  const bySearch = () => courses.filter(c => !st.q || norm(`${c.title} ${c.summary} ${c.areas.map(a => IOA.AREAS[a]).join(' ')}`).includes(norm(st.q)));
  const filtered = () => {
    let list = bySearch().filter(c => !st.areas.size || c.areas.some(a => st.areas.has(a)));
    if (st.sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    return list;
  };

  function renderAreas() {
    const base = bySearch();
    areaBox.innerHTML = Object.entries(IOA.AREAS).map(([k, t]) => {
      const n = base.filter(c => c.areas.includes(k)).length;
      return `<label class="fcheck"><input type="checkbox" value="${k}" ${st.areas.has(k) ? 'checked' : ''}>
        <span>${esc(t)}</span><span class="fcheck__n" aria-label="${n} ${n === 1 ? 'curso' : 'cursos'}">${n}</span></label>`;
    }).join('');
  }

  function render() {
    const list = filtered();
    renderAreas();
    count.textContent = `${list.length} ${list.length === 1 ? 'especialização encontrada' : 'especializações encontradas'}`;
    $('[data-panel-count]').textContent = list.length;
    if (!list.length) {
      results.innerHTML = `<div class="empty" style="grid-column:1/-1"><h3>Nenhuma especialização encontrada</h3>
        <p class="muted">${courses.length ? 'Tente outros termos ou remova os filtros.' : 'O catálogo está indisponível no momento.'}</p>
        <div class="btns"><button type="button" class="btn btn--navy" data-clear>Limpar filtros</button>
        <a class="btn btn--green" href="${IOA.wa('Olá! Não encontrei a especialização que procuro no site. Podem me ajudar?')}" target="_blank" rel="noopener">${icon('wa')} Fale com a equipe</a></div></div>`;
    } else {
      results.innerHTML = list.map(c => courseCard(c, { compare: true })).join('');
      $$('[data-compare]', results).forEach(i => (i.checked = st.cmp.includes(i.dataset.compare)));
      reveal(results);
    }
    setQuery({ q: st.q, area: [...st.areas].join(',') });
  }

  const clear = () => { st.q = ''; search.value = ''; st.areas.clear(); render(); search.focus(); };

  search.addEventListener('input', () => { st.q = search.value; render(); });
  sort.addEventListener('change', () => { st.sort = sort.value; render(); });
  areaBox.addEventListener('change', e => {
    const v = e.target.value;
    e.target.checked ? st.areas.add(v) : st.areas.delete(v);
    render();
    const again = $(`input[value="${v}"]`, areaBox);
    again && again.focus();
  });
  root.addEventListener('click', e => { if (e.target.closest('[data-clear]')) clear(); });

  let release;
  const openPanel = () => {
    panel.classList.add('is-open'); document.body.classList.add('no-scroll');
    release = trap(panel, closePanel); $('input', panel).focus();
  };
  const closePanel = () => {
    if (!panel.classList.contains('is-open')) return;
    panel.classList.remove('is-open'); document.body.classList.remove('no-scroll'); release();
  };
  $('[data-open-filters]').addEventListener('click', openPanel);
  $$('[data-close-filters]').forEach(b => b.addEventListener('click', closePanel));
  matchMedia('(min-width: 900px)').addEventListener('change', e => e.matches && closePanel());

  function renderBar() {
    bar.hidden = !st.cmp.length;
    document.body.classList.toggle('has-cmp', st.cmp.length > 0);
    $('[data-cmp-list]', bar).innerHTML = st.cmp.map(s => {
      const c = courses.find(x => x.slug === s);
      return `<li><span>${esc(c.title)}</span><button type="button" class="cmp-x" data-cmp-rm="${s}" aria-label="Remover ${esc(c.title)} da comparação">${icon('close')}</button></li>`;
    }).join('');
    $('[data-cmp-go]', bar).disabled = st.cmp.length < 2;
    $('[data-cmp-n]', bar).textContent = `${st.cmp.length}/3`;
  }
  const setCmp = (slug, on) => {
    if (on && !st.cmp.includes(slug)) {
      if (st.cmp.length >= 3) { $('[data-cmp-msg]').textContent = 'Você pode comparar até 3 especializações.'; return false; }
      st.cmp.push(slug);
    }
    if (!on) st.cmp = st.cmp.filter(s => s !== slug);
    $('[data-cmp-msg]').textContent = '';
    renderBar();
    return true;
  };
  results.addEventListener('change', e => {
    const i = e.target.closest('[data-compare]');
    if (i && !setCmp(i.dataset.compare, i.checked)) i.checked = false;
  });
  bar.addEventListener('click', e => {
    const rm = e.target.closest('[data-cmp-rm]');
    if (rm) {
      setCmp(rm.dataset.cmpRm, false);
      const i = $(`[data-compare="${rm.dataset.cmpRm}"]`, results);
      if (i) i.checked = false;
      if (st.cmp.length) $('[data-cmp-go]', bar).focus(); else search.focus();
    }
    if (e.target.closest('[data-cmp-clear]')) {
      st.cmp = []; $$('[data-compare]', results).forEach(i => (i.checked = false)); renderBar(); search.focus();
    }
    if (e.target.closest('[data-cmp-go]')) compare();
  });

  function compare() {
    const list = st.cmp.map(s => courses.find(c => c.slug === s));
    const ask = '<span class="muted">Consulte a equipe</span>';
    const rows = [
      ['Áreas', c => c.areas.map(a => esc(IOA.AREAS[a])).join(', ')],
      ['Público', c => esc(c.audience.join(', '))],
      ['Modalidade', c => esc(c.modality)],
      ['Certificação', () => esc(IOA.TEXTOS.certificacao)],
      ['Valores', () => ask],
      ['Turmas', () => ask]
    ];
    modal({
      title: 'Comparar especializações', wide: true,
      body: `<div class="cmp-wrap"><table class="cmp-table"><caption class="sr-only">Comparação entre especializações</caption>
        <thead><tr><th scope="col"><span class="sr-only">Item</span></th>${list.map(c => `<th scope="col">${esc(c.title)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([l, f]) => `<tr><th scope="row">${l}</th>${list.map(c => `<td>${f(c)}</td>`).join('')}</tr>`).join('')}
        <tr><th scope="row"><span class="sr-only">Ações</span></th>${list.map(c => `<td><a class="btn btn--sm btn--navy" href="especializacao.html?slug=${c.slug}">Ver detalhes</a></td>`).join('')}</tr></tbody></table></div>
        <div class="btns" style="margin-top:20px"><a class="btn btn--green" href="${IOA.wa(`Olá! Estou comparando: ${list.map(c => c.title).join('; ')}. Podem me passar turmas e valores?`)}" target="_blank" rel="noopener">${icon('wa')} Tirar dúvidas no WhatsApp</a></div>`
    });
  }

  results.innerHTML = Array.from({ length: 6 }, () => '<div class="skel" aria-hidden="true"></div>').join('');
  results.setAttribute('aria-busy', 'true');
  setTimeout(() => { results.removeAttribute('aria-busy'); render(); renderBar(); }, 450);
})();
