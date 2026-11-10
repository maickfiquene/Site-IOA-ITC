(() => {
  const { $, esc, norm, icon, trap, reduced } = IOA.ui;
  const C = IOA.CFG, T = IOA.TEXTOS;
  const KEY = 'ioa_chat';
  let st = { msgs: [], asks: [] };
  try { st = JSON.parse(sessionStorage.getItem(KEY)) || st; } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  const wa = (m, t = 'Falar no WhatsApp') => `<a class="btn btn--sm btn--green" href="${IOA.wa(m)}" target="_blank" rel="noopener">${icon('wa')} ${t}</a>`;
  const a = (h, t, ext) => `<a href="${h}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
  const team = 'Essas informações são passadas pela equipe, que confirma tudo com segurança.';

  const INTENTS = [
    [/valor|preco|quanto|custa|parcel|mensalidade|investimento|pagamento|desconto/,
      () => `${team}<br>${wa('Olá! Gostaria de saber valores e condições das especializações.')}`],
    [/\bdatas?\b|turma|inscri|quando|comec|inicio|vaga|carga|horario|duracao|matricul/,
      () => `${team}<br>${wa('Olá! Gostaria de saber sobre turmas, datas e inscrições.')}`],
    [/atendente|humano|\bpessoa\b|falar com|whats|telefone|ligar|entrar em contato/,
      () => `Claro! Use o botão "Continuar com um atendente no WhatsApp" logo abaixo, ou ligue para ${a(C.phoneHref, C.phone)}.`],
    [/docente|professor|coordena|corpo/,
      () => `O corpo docente de cada especialização é informado pela equipe.<br>${wa('Olá! Gostaria de saber sobre o corpo docente das especializações.')}`],
    [/certific|\bmec\b|\bcfo\b|diploma|reconhec/, () => esc(T.certificacao)],
    [/endereco|\bonde\b|localiza|chegar|mapa|bairro|renascenca|carutapera/,
      () => `Estamos na ${esc(C.street)}, ${esc(C.city)}.<br>${a(IOA.mapsUrl(), 'Abrir no Google Maps', 1)}`],
    [/cadaver|\bitc\b|anatom|dissec/, () => `${esc(T.itc)}<br>${a('treinamento-itc.html', 'Conhecer o Treinamento ITC')}`],
    [/clinica|avaliac|servic|implante|\bdentes?\b|canal|paciente|botox|\blentes?\b|restaura|extra|coroa|gengiv|agendar|aparelho/,
      () => `A Clínica IOA oferece ${IOA.SERVICOS.length} serviços, como ${IOA.SERVICOS.slice(0, 4).join(', ').toLowerCase()} e outros. Agende sua avaliação gratuita.<br>${a('clinica.html', 'Ver serviços da clínica')}`],
    [/especializ|curso|pos.?grad|lato sensu|endodont|radiolog|dentistic|periodont|harmoniza|odontoped|ortodont|protese/,
      () => `Estas são as especializações divulgadas pela unidade:<ul>${IOA.getCourses().map(c =>
        `<li>${a(`especializacao.html?slug=${encodeURIComponent(c.slug)}`, esc(c.title))}</li>`).join('')}</ul>${a('especializacoes.html', 'Ver catálogo completo')}`],
    [/estrutura|foto|sala|laboratorio|auditorio|instala/,
      () => `Nossa unidade conta com salas de aula, laboratórios, auditório e clínica.<br>${a('estrutura.html', 'Ver fotos da estrutura')}`],
    [/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hey|opa)\b/,
      () => 'Olá! Como posso ajudar? Escolha um dos temas abaixo ou escreva sua dúvida.']
  ];
  const answer = q => {
    const n = norm(q);
    const hit = INTENTS.find(([re]) => re.test(n));
    return hit ? hit[1]() : 'Ainda não sei responder isso com segurança. Um atendente pode ajudar pelo WhatsApp, use o botão logo abaixo.';
  };
  const QUICK = ['Especializações', 'Treinamento ITC', 'Clínica', 'Endereço', 'Valores e turmas', 'Falar com atendente'];
  const WELCOME = 'Olá! Sou o assistente virtual do IOA/ITC São Luís. Posso ajudar com especializações, ITC, estrutura, clínica e localização. Valores e turmas são informados pela equipe.';

  document.body.insertAdjacentHTML('beforeend', `
    <button type="button" class="chat-fab" aria-expanded="false" aria-controls="chat" aria-label="Abrir atendimento">${icon('chat')}<span>Atendimento</span></button>
    <div class="chat" id="chat" role="dialog" aria-modal="true" aria-labelledby="chat-t" hidden>
      <div class="chat__head">
        <div><p class="chat__t" id="chat-t">Atendimento IOA/ITC</p><p class="chat__s">Assistente automático</p></div>
        <button type="button" class="icon-btn" data-chat-close aria-label="Fechar atendimento">${icon('close')}</button>
      </div>
      <ol class="chat__log" aria-live="polite" aria-label="Mensagens"></ol>
      <div class="chat__quick" role="group" aria-label="Respostas rápidas">${QUICK.map(q => `<button type="button" class="filter-chip" data-q="${q}">${q}</button>`).join('')}</div>
      <form class="chat__form">
        <label for="chat-in" class="sr-only">Sua mensagem</label>
        <input id="chat-in" class="input" type="text" placeholder="Escreva sua dúvida" autocomplete="off" maxlength="300">
        <button type="submit" class="icon-btn chat__send" aria-label="Enviar">${icon('send')}</button>
      </form>
      <a class="btn btn--green btn--block chat__handoff" target="_blank" rel="noopener">${icon('wa')} Continuar com um atendente no WhatsApp</a>
    </div>`);

  const fab = $('.chat-fab'), box = $('#chat'), log = $('.chat__log', box), input = $('#chat-in'), hand = $('.chat__handoff', box);
  const bubble = (who, html) => log.insertAdjacentHTML('beforeend', `<li class="msg msg--${who}"><span class="sr-only">${who === 'bot' ? 'Assistente:' : 'Você:'}</span>${html}</li>`);
  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const updateHand = () => {
    const last = st.asks.slice(-3);
    hand.href = IOA.wa(last.length
      ? `Olá! Vim pelo atendimento do site. Minhas últimas perguntas: ${last.map((q, n) => `${n + 1}) ${q}`).join(' ')}`
      : 'Olá! Vim pelo atendimento do site e gostaria de falar com um atendente.');
  };
  const push = (who, html) => { st.msgs.push([who, html]); st.msgs = st.msgs.slice(-40); save(); bubble(who, html); scroll(); };

  let busy = false;
  const ask = q => {
    q = q.trim();
    if (!q || busy) return;
    push('me', esc(q));
    st.asks.push(q); save(); updateHand();
    busy = true;
    log.insertAdjacentHTML('beforeend', '<li class="msg msg--bot msg--typing" aria-label="Digitando"><i></i><i></i><i></i></li>');
    scroll();
    setTimeout(() => { $('.msg--typing', log).remove(); push('bot', answer(q)); busy = false; }, reduced() ? 200 : 650);
  };

  if (!st.msgs.length) st.msgs.push(['bot', WELCOME]);
  st.msgs.forEach(([w, h]) => bubble(w, h));
  updateHand();

  let release;
  const open = () => {
    box.hidden = false; fab.setAttribute('aria-expanded', 'true'); document.body.classList.add('chat-open');
    release = trap(box, close); scroll(); input.focus();
  };
  const close = () => {
    if (box.hidden) return;
    box.hidden = true; fab.setAttribute('aria-expanded', 'false'); document.body.classList.remove('chat-open'); release();
  };
  fab.addEventListener('click', () => (box.hidden ? open() : close()));
  $('[data-chat-close]', box).addEventListener('click', close);
  $('.chat__quick', box).addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (b) ask(b.dataset.q); });
  $('.chat__form', box).addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; input.focus(); });
})();
