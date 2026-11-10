window.IOA = window.IOA || {};

IOA.CFG = {
  whatsapp: '5598991123521',
  whatsDisplay: '(98) 99112-3521',
  phone: '(98) 2106-9100',
  phoneHref: 'tel:+559821069100',
  instagram: 'ioaitcsaoluis',
  street: 'R. Carutapera, 5 – Jardim Renascença',
  city: 'São Luís – MA · CEP 65075-670',
  mapsQuery: 'R. Carutapera, 5, Jardim Renascença, São Luís - MA, 65075-670',
  mostrarDocentes: true,
  fakeDelay: 1000
};

IOA.QUAL = {
  perfilElegivel: 3,
  registro: 2,
  prazo: { ate3: 3, '3a6': 1, mais6: 0, pesquisando: 0 },
  presencial: 2,
  qualificado: 7,
  nutricao: 3
};

IOA.PERFIS = [
  { v: 'dentista', label: 'Cirurgião-dentista', aud: 'Cirurgiões-dentistas' },
  { v: 'medico', label: 'Médico', aud: 'Médicos' },
  { v: 'biomedico', label: 'Biomédico', aud: 'Biomédicos' },
  { v: 'estudante', label: 'Estudante', aud: 'Estudantes' },
  { v: 'outro', label: 'Outro', aud: '' }
];

IOA.wa = (msg = 'Olá! Vim pelo site do IOA/ITC São Luís e gostaria de mais informações.') =>
  `https://wa.me/${IOA.CFG.whatsapp}?text=${encodeURIComponent(msg)}`;

IOA.mapsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(IOA.CFG.mapsQuery)}`;
