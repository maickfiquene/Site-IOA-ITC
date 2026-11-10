(() => {
  const { $, $$, esc, icon } = IOA.ui;
  const opts = (list, ph) => `<option value="">${ph}</option>` + list.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('');
  const PRAZOS = [['ate3', 'Em até 3 meses'], ['3a6', 'De 3 a 6 meses'], ['mais6', 'Mais de 6 meses'], ['pesquisando', 'Só pesquisando']];
  const MODS = [['presencial', 'Consigo participar presencialmente em São Luís'], ['avaliar', 'Ainda preciso avaliar']];
  const PERIODOS = [['manha', 'Manhã'], ['tarde', 'Tarde'], ['indiferente', 'Tanto faz']];
  const ASSUNTOS = [['especializacoes', 'Especializações'], ['itc', 'Treinamento ITC'], ['clinica', 'Clínica IOA'], ['outro', 'Outro assunto']];
  const lab = (list, v) => (list.find(x => x[0] === v) || [, v])[1];

  const F = {
    nome: () => ['text', 'Nome completo', { autocomplete: 'name', required: 1 }],
    whats: () => ['tel', 'WhatsApp com DDD', { autocomplete: 'tel', required: 1, inputmode: 'tel', placeholder: '(98) 90000-0000' }],
    email: () => ['email', 'E-mail', { autocomplete: 'email', required: 1 }],
    perfil: () => ['select', 'Perfil profissional', { required: 1 }, opts(IOA.PERFIS.map(p => [p.v, p.label]), 'Selecione')],
    area: () => ['select', 'Área de interesse', { required: 1 }, opts([...Object.entries(IOA.AREAS), ['itc', 'Treinamento ITC']], 'Selecione')],
    registro: () => ['text', 'Registro profissional (CRO/CRM/CRBM)', { opt: 1 }],
    curso: () => ['select', 'Especialização', { required: 1 }, opts(IOA.getCourses().map(c => [c.slug, c.title]), 'Selecione')],
    prazo: () => ['select', 'Quando pretende iniciar?', { required: 1 }, opts(PRAZOS, 'Selecione')],
    modalidade: () => ['select', 'Participação', { required: 1 }, opts(MODS, 'Selecione')],
    servico: () => ['select', 'Serviço de interesse', { required: 1 }, opts(IOA.SERVICOS.map(s => [s, s]), 'Selecione')],
    periodo: () => ['select', 'Período de preferência', { required: 1 }, opts(PERIODOS, 'Selecione')],
    assunto: () => ['select', 'Assunto', { required: 1 }, opts(ASSUNTOS, 'Selecione')],
    mensagem: () => ['textarea', 'Mensagem', { required: 1 }]
  };
  const FORMS = {
    interesse: [['nome'], ['whats', 'email'], ['perfil', 'area']],
    qualificado: [['nome'], ['whats', 'email'], ['perfil', 'registro'], ['curso'], ['prazo', 'modalidade']],
    clinica: [['nome'], ['whats', 'servico'], ['periodo']],
    contato: [['nome'], ['email', 'whats'], ['assunto'], ['mensagem']]
  };

  let uid = 0;
  function field(name) {
    const [type, label, a, inner] = F[name]();
    const id = `f${++uid}-${name}`;
    const attrs = `id="${id}" name="${name}" class="input" ${a.required ? 'required aria-required="true"' : ''} aria-describedby="${id}-e"
      ${a.autocomplete ? `autocomplete="${a.autocomplete}"` : ''} ${a.inputmode ? `inputmode="${a.inputmode}"` : ''} ${a.placeholder ? `placeholder="${a.placeholder}"` : ''}`;
    const ctl = type === 'select' ? `<select ${attrs}>${inner}</select>`
      : type === 'textarea' ? `<textarea ${attrs} rows="4" maxlength="1000"></textarea>` : `<input type="${type}" ${attrs}>`;
    return `<div class="field"><label for="${id}">${label}${a.opt ? ' <span class="opt">(opcional)</span>' : ''}</label>${ctl}<span class="err" id="${id}-e" aria-live="polite"></span></div>`;
  }

  const mask = v => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  function validate(el) {
    const v = el.value.trim();
    let msg = '';
    if (el.type === 'checkbox') msg = el.checked ? '' : 'Para enviar, aceite a política de privacidade.';
    else if (el.required && !v) msg = 'Preencha este campo.';
    else if (el.name === 'nome' && v.split(/\s+/).length < 2) msg = 'Informe nome e sobrenome.';
    else if (el.name === 'whats' && !/^\d{10,11}$/.test(v.replace(/\D/g, ''))) msg = 'Informe um WhatsApp válido com DDD.';
    else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Informe um e-mail válido.';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const err = document.getElementById(el.getAttribute('aria-describedby').split(' ')[0]);
    if (err) err.textContent = msg;
    return !msg;
  }

  function qualify(d) {
    const Q = IOA.QUAL;
    const course = IOA.getCourses().find(c => c.slug === d.curso);
    const perfil = IOA.PERFIS.find(p => p.v === d.perfil);
    const eleg = !!(course && perfil && course.audience.includes(perfil.aud));
    const pts = (eleg ? Q.perfilElegivel : 0) + (d.registro ? Q.registro : 0) + (Q.prazo[d.prazo] || 0) + (d.modalidade === 'presencial' ? Q.presencial : 0);
    const nivel = !eleg || pts < Q.nutricao ? 'fora' : pts >= Q.qualificado ? 'qualificado' : 'nutricao';
    return { nivel, pts, course, perfil };
  }

  function saveLead(lead) {
    try {
      const all = JSON.parse(localStorage.getItem('ioa_leads') || '[]');
      all.push(lead);
      localStorage.setItem('ioa_leads', JSON.stringify(all));
    } catch (e) {}
  }
  const forceError = () => {
    try { if (localStorage.getItem('ioa_force_error') === '1') { localStorage.removeItem('ioa_force_error'); return true; } } catch (e) {}
    return false;
  };

  function result(type, d, q) {
    const first = esc(d.nome.split(' ')[0]);
    const btn = (m, t = 'Agilizar pelo WhatsApp') => `<a class="btn btn--green" href="${IOA.wa(m)}" target="_blank" rel="noopener">${icon('wa')} ${t}</a>`;
    const ok = (h, p, m) => `<div class="form__status form__status--ok" role="status"><h3>${h}</h3><p>${p}</p><div class="btns">${btn(m)}</div></div>`;
    if (type === 'interesse') {
      const area = IOA.AREAS[d.area] || (d.area === 'itc' ? 'Treinamento ITC' : d.area);
      return ok(`Recebemos seu interesse, ${first}!`, 'A equipe vai entrar em contato com informações sobre as turmas.',
        `Olá! Sou ${d.nome} e tenho interesse em ${area}. Gostaria de informações sobre as turmas.`);
    }
    if (type === 'clinica') return ok(`Pedido recebido, ${first}!`, 'A equipe da Clínica IOA vai entrar em contato para agendar sua avaliação gratuita.',
      `Olá! Sou ${d.nome} e gostaria de agendar uma avaliação gratuita na Clínica IOA (${d.servico}). Período de preferência: ${lab(PERIODOS, d.periodo)}.`);
    if (type === 'contato') return ok(`Mensagem recebida, ${first}!`, 'A equipe vai responder pelo contato informado.',
      `Olá! Sou ${d.nome}. Assunto: ${lab(ASSUNTOS, d.assunto)}. ${d.mensagem}`);
    const perfil = q.perfil ? q.perfil.label : '';
    const title = q.course ? q.course.title : '';
    if (q.nivel === 'qualificado') return `<div class="form__status form__status--ok" role="status"><h3>Tudo certo, ${first}!</h3>
      <p>Seu interesse em <strong>${esc(title)}</strong> foi registrado. Fale agora com a equipe para saber turmas e valores.</p>
      <div class="btns">${btn(`Olá! Sou ${d.nome} (${perfil}) e quero me inscrever em ${title}.`, 'Continuar no WhatsApp')}</div></div>`;
    if (q.nivel === 'nutricao') return `<div class="form__status form__status--ok" role="status"><h3>Obrigado, ${first}!</h3>
      <p>Seu interesse em <strong>${esc(title)}</strong> foi registrado. A equipe vai enviar informações sobre as próximas turmas.</p></div>`;
    const compat = IOA.getCourses().filter(c => q.perfil && c.audience.includes(q.perfil.aud));
    return `<div class="form__status form__status--warn" role="status"><h3>Obrigado pelo interesse, ${first}.</h3>
      <p>Esta especialização é voltada a ${esc((q.course ? q.course.audience : []).join(', ').toLowerCase())}.</p>
      ${compat.length ? `<p>Opções compatíveis com o seu perfil:</p><ul>${compat.map(c => `<li><a href="especializacao.html?slug=${c.slug}">${esc(c.title)}</a></li>`).join('')}</ul>`
        : `<p>O <a href="treinamento-itc.html">Treinamento ITC</a> é voltado a profissionais da saúde. A equipe pode indicar o melhor caminho para você.</p>`}</div>`;
  }

  function mount(box, type, { origem = document.body.dataset.page, curso = '', titulo, preset = {} } = {}) {
    const rows = FORMS[type].map(r => r.length > 1 ? `<div class="form__row">${r.map(field).join('')}</div>` : field(r[0])).join('');
    const lid = `lg${++uid}`;
    box.innerHTML = `<form class="form" novalidate>${titulo ? `<h3>${esc(titulo)}</h3>` : ''}${rows}
      <div class="field"><label class="check"><input type="checkbox" name="lgpd" id="${lid}" required aria-describedby="${lid}-e">
      <span>Concordo com o uso dos meus dados para receber o contato da equipe, conforme a <a href="privacidade.html" target="_blank">Política de privacidade</a>.</span></label>
      <span class="err" id="${lid}-e" aria-live="polite"></span></div>
      <p class="form__note">Simulação: os dados ficam salvos apenas neste navegador. Não informe dados de saúde.</p>
      <button class="btn btn--navy" type="submit">Enviar</button></form><div class="form__out" aria-live="polite"></div>`;
    const form = $('form', box), out = $('.form__out', box), submit = $('[type=submit]', form);
    if (curso && form.curso) form.curso.value = curso;
    Object.entries(preset).forEach(([k, v]) => { if (v && form[k]) form[k].value = v; });
    const els = $$('input, select, textarea', form);
    els.forEach(el => {
      el.addEventListener('blur', () => (el.value || el.type === 'checkbox') && validate(el));
      el.addEventListener('change', () => el.getAttribute('aria-invalid') === 'true' && validate(el));
    });
    form.whats.addEventListener('input', e => { e.target.value = mask(e.target.value); });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = els.filter(el => !validate(el));
      if (bad.length) return bad[0].focus();
      const d = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
      submit.disabled = true;
      submit.innerHTML = '<span class="spinner" aria-hidden="true"></span> Enviando…';
      setTimeout(() => {
        submit.disabled = false; submit.textContent = 'Enviar';
        if (forceError()) {
          out.innerHTML = `<div class="form__status form__status--err" role="alert"><h3>Não foi possível enviar agora.</h3>
            <p>Tente novamente ou fale direto com a equipe.</p><div class="btns"><a class="btn btn--green" href="${IOA.wa()}" target="_blank" rel="noopener">${icon('wa')} Falar no WhatsApp</a></div></div>`;
          return;
        }
        const q = type === 'qualificado' ? qualify(d) : null;
        delete d.lgpd;
        saveLead({ id: Date.now().toString(36), tipo: type, dados: d, origem, curso: d.curso || curso || '', qualificacao: q ? q.nivel : '', data: new Date().toISOString() });
        form.hidden = true;
        out.innerHTML = result(type, d, q);
        out.querySelector('h3').setAttribute('tabindex', '-1');
        out.querySelector('h3').focus();
      }, IOA.CFG.fakeDelay);
    });
  }

  IOA.forms = { mount, mask, qualify };
  $$('[data-form]').forEach(el => mount(el, el.dataset.form, { titulo: el.dataset.title }));

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-avise]');
    if (!b) return;
    const box = document.createElement('div');
    IOA.ui.modal({ title: 'Avise-me sobre as turmas', body: box });
    mount(box, 'interesse', { origem: 'avise-me', curso: b.dataset.curso || '', preset: { area: b.dataset.avise } });
    $('input', box).focus();
  });
})();
