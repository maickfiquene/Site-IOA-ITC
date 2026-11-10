(() => {
  const { $, $$, esc, icon, modal, reveal, areaTags, courseCard, setMeta } = IOA.ui;
  const root = $('[data-course]');
  if (!root) return;
  const courses = IOA.getCourses();
  const slug = new URLSearchParams(location.search).get('slug');
  const c = courses.find(x => x.slug === slug);
  const T = IOA.TEXTOS, C = IOA.CFG;

  if (!c) {
    setMeta('Especialização não encontrada · IOA/ITC São Luís', 'A especialização procurada não foi encontrada.');
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.append(m);
    root.innerHTML = `<section class="section nf"><div class="container nf__in">
      <span class="kicker">Erro 404</span><h1>Especialização não encontrada</h1>
      <p class="lead">O endereço pode estar incompleto ou a especialização não está mais no catálogo.</p>
      <div class="btns"><a class="btn btn--navy" href="especializacoes.html">Ver todas as especializações</a>
      <a class="btn btn--ghost" href="index.html">Voltar ao início</a></div></div></section>`;
    return;
  }

  const msg = `Olá! Tenho interesse em ${c.title} e gostaria de saber turmas e valores.`;
  const areaNames = c.areas.map(a => IOA.AREAS[a]).join(' e ');
  setMeta(`${c.title} em São Luís · IOA/ITC`, `${c.summary} ${c.modality}. Consulte turmas e valores com a equipe.`);
  const photo = courses.indexOf(c) % 2 ? 'sala-aula-ioa-1.jpg' : 'sala-aula-ioa-2.jpg';
  const ask = `<a class="btn btn--sm btn--green" href="${IOA.wa(msg)}" target="_blank" rel="noopener">${icon('wa')} Consulte a equipe</a>`;

  const docentes = !C.mostrarDocentes ? `<p><strong>Corpo docente:</strong> consulte a equipe.</p>${ask}`
    : c.docentes.length ? `<ul class="list-check">${c.docentes.map(d => `<li>${icon('check')} ${esc(d)}</li>`).join('')}</ul>
      <p class="small muted">Divulgados nas redes da unidade · publicar após autorização.</p>`
    : '<p>A confirmar.</p>';
  const faq = [
    ['Onde acontecem as aulas?', `Na unidade IOA/ITC São Luís: ${C.street}, ${C.city}. <a href="${IOA.mapsUrl()}" target="_blank" rel="noopener">Como chegar</a>.`],
    ['Quais são os valores e as próximas turmas?', `Essas informações são passadas pela equipe. <a href="${IOA.wa(msg)}" target="_blank" rel="noopener">Fale no WhatsApp</a>.`],
    ['A especialização tem certificação?', esc(T.certificacao)],
    ['Como falo com a equipe?', `Pelo WhatsApp ${C.whatsDisplay}, pelo telefone <a href="${C.phoneHref}">${C.phone}</a> ou pelo Instagram @${C.instagram}.`]
  ];
  const tabs = [
    ['geral', 'Visão geral', `<p class="lead">${esc(c.summary)}</p><p>${esc(T.chamada2)}</p>
      <dl class="facts"><div><dt>Tipo</dt><dd>${esc(c.type)}</dd></div><div><dt>Áreas</dt><dd>${esc(areaNames)}</dd></div>
      <div><dt>Modalidade</dt><dd>${esc(c.modality)}</dd></div><div><dt>Turmas e valores</dt><dd>Consulte a equipe</dd></div></dl>
      <p class="small muted">Fonte: ${esc(c.source)}.</p>`],
    ['publico', 'Para quem é', `<ul class="list-check">${c.audience.map(a => `<li>${icon('check')} ${esc(a)}</li>`).join('')}</ul>
      <p>Modalidade: ${esc(c.modality)}.</p><p class="muted">Dúvidas sobre pré-requisitos? Consulte a equipe.</p>${ask}`],
    ['docentes', 'Docentes', docentes],
    ['cert', 'Certificação', `<blockquote class="quote">${esc(T.certificacao)}</blockquote>`],
    ['duvidas', 'Dúvidas', `<div class="faq">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`]
  ];
  const others = courses.filter(x => x !== c).sort((a, b) => b.areas.filter(z => c.areas.includes(z)).length - a.areas.filter(z => c.areas.includes(z)).length).slice(0, 3);

  root.innerHTML = `
    <section class="phero phero--course">
      <img class="phero__bg" src="assets/img/${photo}" alt="" width="1280" height="853" fetchpriority="high">
      <div class="container phero__in">
        <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a> / <a href="especializacoes.html">Especializações</a> / <span aria-current="page">${esc(areaNames)}</span></nav>
        <div class="chips">${areaTags(c.areas, 'tag--lt')}</div>
        <h1>${esc(c.title)}</h1>
        <p class="lead">${esc(c.type)} · ${esc(c.modality)}</p>
      </div>
    </section>
    <div class="container course-layout">
      <div class="course-main">
        <div class="tabs">
          <div class="tabs__list" role="tablist" aria-label="Informações da especialização">${tabs.map(([k, t], n) =>
            `<button class="tabs__btn" role="tab" id="t-${k}" aria-controls="p-${k}" aria-selected="${!n}" tabindex="${n ? -1 : 0}">${t}</button>`).join('')}</div>
          ${tabs.map(([k, , h], n) => `<div class="tabs__panel" role="tabpanel" id="p-${k}" aria-labelledby="t-${k}" tabindex="0" ${n ? 'hidden' : ''}>${h}</div>`).join('')}
        </div>
      </div>
      <aside class="course-side" aria-label="Inscrição">
        <div class="card side-box">
          <span class="kicker">Valores e turmas</span>
          <p class="side-box__t">Consulte a equipe</p>
          <p class="small muted">A equipe informa as turmas disponíveis e as condições.</p>
          <button type="button" class="btn btn--navy btn--block" data-enroll>Quero me inscrever</button>
          <a class="btn btn--green btn--block" href="${IOA.wa(msg)}" target="_blank" rel="noopener">${icon('wa')} Falar no WhatsApp</a>
          <button type="button" class="btn btn--ghost btn--block" data-avise="${esc(c.areas[0])}" data-curso="${esc(c.slug)}">Avise-me sobre turmas</button>
          <p class="side-box__addr">${icon('pin')} ${C.street}</p>
        </div>
      </aside>
    </div>
    <section class="section section--paper">
      <div class="container"><div class="sec-head sec-head--row"><h2>Outras especializações</h2>
        <a class="link-arrow" href="especializacoes.html">Ver catálogo ${icon('arrow')}</a></div>
        <div class="grid grid--3">${others.map(o => courseCard(o)).join('')}</div></div>
    </section>
    <div class="course-bar">
      <button type="button" class="btn btn--navy" data-enroll>Quero me inscrever</button>
      <a class="btn btn--green" href="${IOA.wa(msg)}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp sobre ${esc(c.title)}">${icon('wa')} WhatsApp</a>
    </div>`;
  document.body.classList.add('has-course-bar');

  const btns = $$('[role=tab]', root);
  const select = b => {
    btns.forEach(x => {
      const on = x === b;
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
    b.focus();
  };
  btns.forEach((b, n) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', e => {
      const k = { ArrowRight: n + 1, ArrowLeft: n - 1, Home: 0, End: btns.length - 1 }[e.key];
      if (k !== undefined) { e.preventDefault(); select(btns[(k + btns.length) % btns.length]); }
    });
  });

  root.addEventListener('click', e => {
    if (!e.target.closest('[data-enroll]')) return;
    const box = document.createElement('div');
    const m = modal({ title: 'Quero me inscrever', body: box });
    IOA.forms.mount(box, 'qualificado', { curso: c.slug, origem: 'especializacao' });
    box.insertAdjacentHTML('afterbegin', `<p class="small muted">Sem pagamento online. A equipe entra em contato para confirmar turmas e valores de <strong>${esc(c.title)}</strong>.</p>`);
    $('input', m.body).focus();
  });

  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Course', name: c.title, description: c.summary,
    provider: { '@type': 'EducationalOrganization', name: 'IOA/ITC São Luís' } });
  document.head.append(ld);
  reveal(root);
})();
