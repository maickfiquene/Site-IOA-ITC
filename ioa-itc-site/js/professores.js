(() => {
  const { $, $$, esc, reveal, setQuery } = IOA.ui;
  const root = $('[data-professores]');
  if (!root) return;

  if (!IOA.CFG.mostrarDocentes) {
    root.innerHTML = `<div class="empty"><h2 class="h3">Corpo docente em breve</h2>
      <p class="muted">Enquanto isso, a equipe informa os docentes de cada curso.</p>
      <div class="btns"><a class="btn btn--green" href="${IOA.wa('Olá! Gostaria de saber sobre o corpo docente.')}" target="_blank" rel="noopener">Falar no WhatsApp</a></div></div>`;
    return;
  }

  const { cursos, professores } = IOA.PROFESSORES;
  const groups = [
    ...cursos.map(c => ({ ...c, list: professores.filter(p => p.status !== 'curso-pendente' && p.cursos.includes(c.id)) })),
    { id: 'a-confirmar', nome: 'Curso a confirmar', list: professores.filter(p => p.status === 'curso-pendente') }
  ].filter(g => g.list.length);

  const PARTICLES = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
  const initials = nome => {
    const w = nome.split(/\s+/).filter(x => !PARTICLES.has(x.toLowerCase()));
    return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
  };
  const tone = nome => [...nome].reduce((s, c) => s + c.charCodeAt(0), 0) % 4;
  const placeholder = nome => `<span class="prof-ph prof-ph--${tone(nome)}" aria-hidden="true">${esc(initials(nome))}</span>`;
  const label = (n, one = 'docente', many = 'docentes') => `${n} ${n === 1 ? one : many}`;

  const card = (p, curso) => `<li class="card prof-card reveal">
    <div class="prof-card__photo">${p.foto
      ? `<img src="${esc(p.foto)}" alt="Foto de ${esc(p.nome)}" data-nome="${esc(p.nome)}" width="480" height="576" loading="lazy" decoding="async">`
      : placeholder(p.nome)}</div>
    <div class="prof-card__body">
      <h3 class="prof-card__name">${esc([p.titulo, p.nome].filter(Boolean).join(' '))}</h3>
      <p class="prof-card__curso">${esc(curso)}</p>
    </div></li>`;

  root.innerHTML = `
    <div class="filterbar prof-chips" role="group" aria-label="Filtrar por curso">
      ${[{ id: 'todos', nome: 'Todos', n: professores.length }, ...groups.map(g => ({ ...g, n: g.list.length }))].map(g =>
        `<button type="button" class="filter-chip" data-curso="${esc(g.id)}">${esc(g.nome)} <span>${g.n}</span></button>`).join('')}
    </div>
    <p class="cat-count" data-prof-status aria-live="polite"></p>
    ${groups.map(g => `<section class="prof-group" id="curso-${esc(g.id)}" data-group="${esc(g.id)}" aria-labelledby="h-${esc(g.id)}">
      <div class="prof-head"><h2 id="h-${esc(g.id)}">${esc(g.nome)}</h2><span class="prof-count">${label(g.list.length)}</span></div>
      <ul class="prof-grid">${g.list.map(p => card(p, g.nome)).join('')}</ul>
    </section>`).join('')}`;

  root.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName === 'IMG') img.outerHTML = placeholder(img.dataset.nome);
  }, true);

  const chips = $$('[data-curso]', root), sections = $$('[data-group]', root), status = $('[data-prof-status]', root);
  const apply = id => {
    chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.curso === id));
    sections.forEach(s => { s.hidden = id !== 'todos' && s.dataset.group !== id; });
    const g = groups.find(x => x.id === id);
    status.textContent = g ? `${g.nome}: ${label(g.list.length)}` : label(professores.length);
  };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-curso]');
    if (!b) return;
    apply(b.dataset.curso);
    setQuery({ curso: b.dataset.curso === 'todos' ? '' : b.dataset.curso });
  });

  const asked = new URLSearchParams(location.search).get('curso');
  apply(groups.some(g => g.id === asked) ? asked : 'todos');
  reveal(root);
})();
