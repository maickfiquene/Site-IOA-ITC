IOA.AREAS = {
  endodontia: 'Endodontia',
  radiologia: 'Radiologia',
  dentistica: 'Dentística',
  periodontia: 'Periodontia',
  harmonizacao: 'Harmonização Orofacial',
  odontopediatria: 'Odontopediatria',
  ortodontia: 'Ortodontia',
  protese: 'Prótese Dentária',
  implantodontia: 'Implantodontia'
};

IOA.TEXTOS = {
  quemSomos: 'Bem-vindos ao IOA/ITC São Luís: duas frentes de formação avançada em uma só instituição. Aqui, reunimos a maior Rede Premium em Educação Orofacial e o maior Instituto de Treinamento em Cadáveres Frescos das Américas. Uma estrutura pensada para profissionais da saúde que buscam ensino de alto nível, prática, tecnologia e evolução profissional.',
  estrutura: 'Nossa unidade conta com infraestrutura de ponta, salas de aula, laboratórios, centro cirúrgico, equipamentos modernos e ambientes preparados para uma aprendizagem prática, segura e alinhada às exigências da área da saúde. A tecnologia faz parte da experiência IOA/ITC São Luís.',
  localizacao: 'O IOA/ITC São Luís está localizado no Jardim Renascença, em uma unidade preparada para receber profissionais da saúde que buscam formação avançada, prática e atualização profissional.',
  itc: 'Treinamentos avançados com cadáveres frescos para profissionais da saúde. Estudo de vasos, nervos, músculos, planos anatômicos e áreas de atenção.',
  chamada1: 'Comece o ano investindo na sua carreira profissional',
  chamada2: 'Venha para o IOA ITC São Luís e especialize-se com quem é referência na área.',
  certificacao: 'Os cursos de pós-graduação lato sensu e especializações do IOA contam com certificação e parcerias com instituições credenciadas ao MEC e ao CFO.'
};

IOA.REDE = [
  { n: 41, label: 'unidades' },
  { n: 450, label: 'cursos' },
  { n: 17000, label: 'alunos' },
  { n: 97000, label: 'pacientes' },
  { n: 12, label: 'estados' }
];

const SRC = 'Divulgação oficial @ioaitcsaoluis (03/12/2025)';
const base = { type: 'Especialização', audience: ['Cirurgiões-dentistas'], modality: 'Presencial · IOA/ITC São Luís', source: SRC };

IOA.COURSES_DEFAULT = [
  { ...base, slug: 'endodontia-radiologia', title: 'Especializações em Endodontia e Radiologia', areas: ['endodontia', 'radiologia'],
    summary: 'Especializações em Endodontia e em Radiologia oferecidas pelo IOA/ITC São Luís.', docentes: [] },
  { ...base, slug: 'dentistica-periodontia', title: 'Especializações em Dentística e Periodontia · Estética branca e vermelha', areas: ['dentistica', 'periodontia'],
    summary: 'Especializações em Dentística e em Periodontia, divulgadas com o tema estética branca e vermelha.',
    docentes: ['Dr. Darlon Martins', 'Dr. Fernando Fialho', 'Dr. Bruno Benatti'] },
  { ...base, slug: 'harmonizacao-orofacial', title: 'Especialização em Harmonização Orofacial', areas: ['harmonizacao'],
    summary: 'Especialização em Harmonização Orofacial oferecida pelo IOA/ITC São Luís.',
    docentes: ['Profa. Raizza Leite', 'Prof. Me. Carlos Eduardo Santos', 'Profa. Ma. Leonarda Tavares'] },
  { ...base, slug: 'odontopediatria', title: 'Especialização em Odontopediatria', areas: ['odontopediatria'],
    summary: 'Especialização em Odontopediatria oferecida pelo IOA/ITC São Luís.',
    docentes: ['Prof. Dr. Silas Alves', 'Profa. Dra. Lorena Ladeira', 'Profa. Dra. Cláudia Rizzi', 'Profa. Dra. Anice Mohana', 'Profa. Dra. Clarissa Vieira'] },
  { ...base, slug: 'ortodontia', title: 'Especialização em Ortodontia', areas: ['ortodontia'],
    summary: 'Especialização em Ortodontia oferecida pelo IOA/ITC São Luís.', docentes: [] },
  { ...base, slug: 'protese-periodontia-reabilitacao', title: 'Especializações em Prótese Dentária e Periodontia · Reabilitação Oral Complexa', areas: ['protese', 'periodontia'],
    summary: 'Especializações em Prótese Dentária e em Periodontia, divulgadas com o tema reabilitação oral complexa.',
    docentes: ['Eunice Umeda', 'José Ricardo Kina', 'Renata Baleeiro'] },
  { ...base, modality: 'Consulte a equipe', source: 'Lista de cursos e professores fornecida para o site',
    slug: 'implantodontia', title: 'Especialização em Implantodontia', areas: ['implantodontia'],
    summary: 'Especialização em Implantodontia oferecida pelo IOA/ITC São Luís.', docentes: [] }
];

IOA.getCourses = () => {
  try {
    if (localStorage.getItem('ioa_demo_empty') === '1') return [];
    const saved = JSON.parse(localStorage.getItem('ioa_courses') || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) {}
  return IOA.COURSES_DEFAULT;
};

IOA.GAL_CATS = {
  fachada: 'Fachada', recepcao: 'Recepção', laboratorio: 'Laboratório ITC', auditorio: 'Auditório',
  salas: 'Salas de aula', clinica: 'Clínica', apoio: 'Espaços de apoio', detalhes: 'Detalhes'
};

IOA.PHOTOS_DEFAULT = [
  { f: 'fachada-noturna.jpg', w: 1280, h: 851, cat: 'fachada', cap: 'Fachada da unidade', alt: 'Fachada iluminada à noite com o letreiro Instituto Orofacial das Américas' },
  { f: 'recepcao.jpg', w: 853, h: 1280, cat: 'recepcao', cap: 'Recepção', alt: 'Recepção da unidade com os logotipos do ITC e do IOA na parede' },
  { f: 'laboratorio-itc.jpg', w: 1280, h: 853, cat: 'laboratorio', cap: 'Laboratório do ITC', alt: 'Laboratório do ITC com macas de inox e focos de luz cirúrgicos' },
  { f: 'auditorio-itc.jpg', w: 1280, h: 853, cat: 'auditorio', cap: 'Auditório', alt: 'Auditório com fileiras de cadeiras e o logotipo do ITC' },
  { f: 'sala-aula-ioa-1.jpg', w: 1280, h: 853, cat: 'salas', cap: 'Sala de aula', alt: 'Sala de aula com bancadas e o logotipo do IOA' },
  { f: 'sala-aula-ioa-2.jpg', w: 1280, h: 852, cat: 'salas', cap: 'Sala de aula', alt: 'Sala de aula com painel de madeira e o logotipo do IOA' },
  { f: 'clinica-odonto-1.jpg', w: 1280, h: 853, cat: 'clinica', cap: 'Clínica odontológica', alt: 'Clínica odontológica com cadeiras alinhadas' },
  { f: 'clinica-odonto-2.jpg', w: 1280, h: 852, cat: 'clinica', cap: 'Clínica odontológica', alt: 'Clínica odontológica com iluminação em tons de azul e roxo' },
  { f: 'cadeira-odonto.jpg', w: 853, h: 1280, cat: 'clinica', cap: 'Cadeira odontológica', alt: 'Cadeira odontológica com tela exibindo a marca IOA' },
  { f: 'sala-reuniao.jpg', w: 1280, h: 853, cat: 'apoio', cap: 'Sala de reuniões', alt: 'Sala de reuniões com mesa central e cadeiras' },
  { f: 'detalhe-bancada.jpg', w: 1280, h: 853, cat: 'detalhes', cap: 'Detalhe da bancada', alt: 'Detalhe de bancada com instrumentais organizados' }
];

IOA.getPhotos = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('ioa_photos') || 'null');
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) {}
  return IOA.PHOTOS_DEFAULT;
};

IOA.SERVICOS = ['Implante dentário', 'Ortodontia', 'Tratamento de canal', 'Restaurações estéticas', 'Cirurgia gengival',
  'Coroas de porcelana', 'Lentes de contato dental', 'Prótese dentária', 'Cirurgia e extração dental', 'Botox', 'Harmonização facial'];
