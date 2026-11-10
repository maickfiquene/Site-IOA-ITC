(() => {
  const { $, fmt, counters } = IOA.ui;
  const stats = $('[data-stats]');
  if (!stats) return;
  stats.innerHTML = IOA.REDE.map(r =>
    `<div class="stat"><span class="stat__n" data-count="${r.n}" aria-hidden="true">${fmt(r.n)}</span>
     <span class="sr-only">${fmt(r.n)} ${r.label}</span><span class="stat__l" aria-hidden="true">${r.label}</span></div>`).join('');
  counters(stats);
})();
