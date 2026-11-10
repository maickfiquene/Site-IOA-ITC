(() => {
  const { $, esc, icon } = IOA.ui;

  const grid = $('[data-servicos]');
  if (grid) {
    grid.innerHTML = IOA.SERVICOS.map(s =>
      `<li><button type="button" class="svc" data-svc="${esc(s)}">${icon('tooth')}<span>${esc(s)}</span></button></li>`).join('');
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-svc]');
      const sel = $('#agendar select[name="servico"]');
      if (!b || !sel) return;
      sel.value = b.dataset.svc;
      sel.dispatchEvent(new Event('change'));
      $('#agendar').scrollIntoView({ behavior: IOA.ui.reduced() ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => $('#agendar input').focus({ preventScroll: true }), 350);
    });
  }

  const wipe = $('[data-wipe]');
  if (wipe) wipe.addEventListener('click', () => {
    try { ['ioa_leads'].forEach(k => localStorage.removeItem(k)); sessionStorage.removeItem('ioa_chat'); } catch (e) {}
    $('[data-wipe-msg]').textContent = 'Pronto: os dados de formulários e do atendimento foram apagados deste navegador.';
  });
})();
