(() => {
  const { $, $$, icon, esc, trap } = IOA.ui;
  const C = IOA.CFG;
  const NAV = [
    ['index', 'index.html', 'Início'],
    ['especializacoes', 'especializacoes.html', 'Especializações'],
    ['professores', 'professores.html', 'Professores'],
    ['itc', 'treinamento-itc.html', 'Treinamento ITC'],
    ['estrutura', 'estrutura.html', 'Estrutura'],
    ['clinica', 'clinica.html', 'Clínica'],
    ['institucional', 'institucional.html', 'Institucional'],
    ['contato', 'contato.html', 'Contato']
  ];
  const page = document.body.dataset.page;
  const links = cls => NAV.map(([k, h, t]) =>
    `<li><a class="${cls}" href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  const cur = page === 'portal' ? ' aria-current="page"' : '';
  const portalBtn = cls => `<a class="${cls}" href="portal.html"${cur}>Portal do aluno <span class="soon">em breve</span></a>`;

  const header = $('#site-header');
  if (header) {
    header.outerHTML = `
    <a class="skip" href="#main">Pular para o conteúdo</a>
    <header class="site-header" id="top">
      <div class="container site-header__in">
        <a class="brand" href="index.html" aria-label="IOA | ITC São Luís · página inicial">
          <img src="assets/img/logo.png" alt="IOA | ITC São Luís" width="781" height="250">
        </a>
        <nav class="nav" aria-label="Principal"><ul>${links('nav__link')}</ul></nav>
        <div class="site-header__cta">
          ${portalBtn('btn btn--ghost btn--sm portal-btn')}
          <a class="btn btn--green btn--sm" href="${IOA.wa()}" target="_blank" rel="noopener">${icon('wa')}<span>Falar no WhatsApp</span></a>
          <button class="icon-btn menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mnav">${icon('menu')}</button>
        </div>
      </div>
    </header>
    <div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu" hidden>
      <div class="mnav__head">
        <img src="assets/img/logo.png" alt="" width="781" height="250">
        <button class="icon-btn" type="button" data-mclose aria-label="Fechar menu">${icon('close')}</button>
      </div>
      <ul class="mnav__list">${links('mnav__link')}</ul>
      ${portalBtn('mnav__portal')}
      <a class="btn btn--green btn--block" href="${IOA.wa()}" target="_blank" rel="noopener">${icon('wa')} Falar no WhatsApp</a>
    </div>`;
  }

  const footer = $('#site-footer');
  if (footer) {
    footer.outerHTML = `
    <footer class="site-footer">
      <div class="container site-footer__grid">
        <div>
          <span class="plate"><img src="assets/img/logo.png" alt="IOA | ITC São Luís" width="781" height="250" loading="lazy"></span>
          <p class="site-footer__txt">IOA · ITC · Universidade Ceuma. Formação avançada em saúde orofacial e treinamento com cadáveres frescos em São Luís.</p>
        </div>
        <nav aria-label="Rodapé"><h2 class="foot-h">Navegação</h2><ul class="foot-list">${links('')}<li><a href="portal.html"${cur}>Portal do aluno</a></li></ul></nav>
        <div><h2 class="foot-h">Áreas</h2><ul class="foot-list">${Object.entries(IOA.AREAS).map(([k, v]) =>
          `<li><a href="especializacoes.html?area=${k}">${esc(v)}</a></li>`).join('')}</ul></div>
        <div><h2 class="foot-h">Contato</h2><ul class="foot-list foot-list--ico">
          <li><a href="${IOA.wa()}" target="_blank" rel="noopener">${icon('wa')} ${C.whatsDisplay}</a></li>
          <li><a href="${C.phoneHref}">${icon('phone')} ${C.phone}</a></li>
          <li><a href="https://instagram.com/${C.instagram}" target="_blank" rel="noopener">${icon('ig')} @${C.instagram}</a></li>
          <li><a href="${IOA.mapsUrl()}" target="_blank" rel="noopener">${icon('pin')} ${C.street}<br>${C.city}</a></li>
        </ul></div>
      </div>
      <div class="container site-footer__base">
        <p><a href="privacidade.html">Política de privacidade</a> · Razão social e CNPJ: a informar</p>
        <p>Protótipo acadêmico · conteúdo sujeito a validação pela instituição</p>
      </div>
    </footer>
    <nav class="mbar" aria-label="Ações rápidas">
      <a href="especializacoes.html">${icon('book')}<span>Especializações</span></a>
      <a href="estrutura.html">${icon('grid')}<span>Estrutura</span></a>
      <a href="${IOA.wa()}" target="_blank" rel="noopener" class="mbar__wa">${icon('wa')}<span>WhatsApp</span></a>
    </nav>`;
  }

  const mnav = $('#mnav'), mbtn = $('.menu-btn');
  let release;
  const closeMenu = () => {
    if (mnav.hidden) return;
    mnav.hidden = true; mbtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll'); release && release();
  };
  if (mnav) {
    mbtn.addEventListener('click', () => {
      mnav.hidden = false; mbtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      release = trap(mnav, closeMenu);
      $('.mnav__link', mnav).focus();
    });
    mnav.addEventListener('click', e => { if (e.target.closest('[data-mclose]')) closeMenu(); });
    matchMedia('(min-width: 1280px)').addEventListener('change', e => e.matches && closeMenu());
  }

  $$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon) + ' '));
  $$('[data-icon-after]').forEach(el => el.insertAdjacentHTML('beforeend', ' ' + icon(el.dataset.iconAfter)));
  $$('[data-text]').forEach(el => (el.textContent = IOA.TEXTOS[el.dataset.text] || ''));
  $$('[data-wa]').forEach(el => { el.href = IOA.wa(el.dataset.wa || undefined); el.target = '_blank'; el.rel = 'noopener'; });
  IOA.ui.reveal();
  IOA.ui.counters();

  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'IOA/ITC São Luís',
    telephone: '+55-98-2106-9100', sameAs: [`https://instagram.com/${C.instagram}`],
    address: { '@type': 'PostalAddress', streetAddress: 'R. Carutapera, 5 – Jardim Renascença', addressLocality: 'São Luís', addressRegion: 'MA', postalCode: '65075-670', addressCountry: 'BR' }
  });
  document.head.append(ld);
})();
