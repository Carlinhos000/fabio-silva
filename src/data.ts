export const business = {
  name: 'Fábio Silva',
  tagline: 'Casas em Sorocaba',
  phone: '(15) 99168-5865',
  whatsapp: '5515991685865',
  address: 'R. Alfredo Gemente, Sorocaba — SP',
  postcode: '18055-862',
  hours: 'Atendimento até as 20h',
  instagram: '', // Insira aqui o endereço oficial completo do Instagram.
  creci: '', // Insira somente o número oficial confirmado.
  portrait: '', // Ex.: /images/fabio-silva.webp — use uma foto oficial autorizada.
  siteUrl: '', // Origem pública, ex.: https://dominio-confirmado.com.br
  rating: '5,0',
  reviewCount: 15,
  mapQuery: 'R. Alfredo Gemente, Sorocaba, SP, 18055-862',
};

export const waLink = (message = 'Olá, Fábio! Conheci seu trabalho pelo site e gostaria de receber ajuda para encontrar um imóvel em Sorocaba.') =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapQuery)}`;

export const buyingJourney = [
  { id: 'conversa', label: '01', title: 'Conversa inicial', content: 'Seu momento, suas preferências e o que importa para você.' },
  { id: 'selecao', label: '02', title: 'Seleção de imóveis', content: 'Uma curadoria de opções alinhadas ao que você procura.' },
  { id: 'visitas', label: '03', title: 'Visitas e negociação', content: 'Acompanhamento próximo para avaliar cada possibilidade.' },
  { id: 'conclusao', label: '04', title: 'Até a conclusão', content: 'Clareza e suporte nos próximos passos da sua compra.' },
];

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: 'Casa em condomínio' | 'Sobrado' | 'Casa térrea' | 'Apartamento';
  neighborhood: string;
  bedrooms: number;
  suites: number;
  parking: number;
  area: number;
  price: number | null;
  purposes: ('comprar' | 'investir')[];
  images: string[];
  description: string;
  amenities: string[];
  demo: boolean;
}

// Catálogo ilustrativo. Troque estes registros pelos anúncios autorizados.
// Nenhum valor de venda foi criado. A localização e as medidas são exemplos.
export const properties: Property[] = [
  {
    id: 'DEMO-01', slug: 'residencia-contemporanea',
    title: 'Espaço para viver o seu melhor.', type: 'Casa em condomínio',
    neighborhood: 'Campolim', bedrooms: 3, suites: 3, parking: 2, area: 240,
    price: null, purposes: ['comprar', 'investir'],
    images: ['/images/house-contemporary.webp', '/images/interior-living.webp', '/images/interior-kitchen.webp'],
    description: 'Uma proposta de residência com ambientes integrados, amplas aberturas e espaço para receber. Este exemplo apresenta a organização de um anúncio; características, bairro e imagens deverão ser substituídos pelos dados oficiais.',
    amenities: ['Ambientes integrados', 'Espaço gourmet', 'Jardim', 'Área de serviço'], demo: true,
  },
  {
    id: 'DEMO-02', slug: 'casa-terrea-com-jardim',
    title: 'A tranquilidade de chegar em casa.', type: 'Casa térrea',
    neighborhood: 'Wanel Ville', bedrooms: 3, suites: 1, parking: 2, area: 170,
    price: null, purposes: ['comprar'],
    images: ['/images/house-garden.webp', '/images/interior-kitchen.webp', '/images/interior-living.webp'],
    description: 'Uma referência de casa térrea com áreas de convivência e jardim. Imóvel demonstrativo: não representa uma oferta disponível. Converse com Fábio sobre opções reais com o seu perfil.',
    amenities: ['Casa térrea', 'Jardim', 'Sala de estar', 'Cozinha integrada'], demo: true,
  },
  {
    id: 'DEMO-03', slug: 'sobrado-ambientes-integrados',
    title: 'Um novo olhar sobre o morar.', type: 'Sobrado',
    neighborhood: 'Jardim Europa', bedrooms: 4, suites: 2, parking: 3, area: 280,
    price: null, purposes: ['comprar', 'investir'],
    images: ['/images/house-contemporary.webp', '/images/interior-living.webp', '/images/interior-kitchen.webp'],
    description: 'Exemplo de sobrado com espaços generosos para diferentes momentos da família. Os dados são ilustrativos, sem preço de venda ou disponibilidade comercial.',
    amenities: ['Varanda', 'Espaço gourmet', 'Quatro dormitórios', 'Lavabo'], demo: true,
  },
  {
    id: 'DEMO-04', slug: 'apartamento-vida-urbana',
    title: 'Perto do que faz parte da sua vida.', type: 'Apartamento',
    neighborhood: 'Santa Rosália', bedrooms: 2, suites: 1, parking: 1, area: 85,
    price: null, purposes: ['comprar', 'investir'],
    images: ['/images/interior-living.webp', '/images/interior-kitchen.webp'],
    description: 'Uma composição de apartamento pensada para demonstrar a apresentação do catálogo. Imagens, bairro e medidas são ilustrativos. Solicite a seleção de imóveis oficiais pelo WhatsApp.',
    amenities: ['Sala integrada', 'Dois dormitórios', 'Varanda', 'Área de serviço'], demo: true,
  },
];

export const highlightedFeatures = [
  {
    id: properties[0].id,
    eyebrow: 'Ambientes integrados',
    title: 'Espaço para viver o seu melhor.',
    image: '/images/interior-kitchen.webp',
    imageAlt: 'Interior residencial ilustrativo com materiais naturais e ambientes integrados',
    paragraphs: ['Ambientes integrados, luz natural e espaço para os seus planos. Uma referência para começar a imaginar o próximo endereço.'],
    facts: ['Campolim, Sorocaba', '3 suítes', '240 m²'],
    href: `/imoveis/${properties[0].slug}`,
    contactHref: waLink(`Olá, Fábio! Vi o exemplo ${properties[0].id} e gostaria de conhecer opções disponíveis com ambientes integrados.`),
    caption: 'Imagem ilustrativa · referência de ambientes integrados',
  },
  {
    id: properties[1].id,
    eyebrow: 'Casa com jardim',
    title: 'A tranquilidade de chegar em casa.',
    image: properties[1].images[0],
    imageAlt: 'Casa térrea e jardim ilustrativos, referência de imóvel residencial',
    paragraphs: ['Áreas de convivência e um jardim para imaginar a sua rotina. Conte ao Fábio o que faz diferença no seu próximo lar e consulte opções reais com esse perfil.'],
    facts: ['Wanel Ville, Sorocaba', '3 quartos', '170 m²'],
    href: `/imoveis/${properties[1].slug}`,
    contactHref: waLink(`Olá, Fábio! Vi o exemplo ${properties[1].id} e procuro uma casa térrea com jardim. Pode me apresentar opções disponíveis?`),
    caption: 'Imagem ilustrativa · referência de casa com jardim',
  },
];

export const testimonials = [
  { name: 'Construtora Pontelli', context: 'Parceiro comercial', quote: 'Atendimento diferenciado e único. Entende o cliente e oferece a melhor opção para cada perfil.' },
  { name: 'Bruno Henrique', context: 'Cliente', quote: 'Excelente corretor. Ajudou a realizar o sonho da minha casa própria. Super indico!' },
  { name: 'Rei do Brilho', context: 'Cliente', quote: 'O melhor atendimento. Um corretor de Sorocaba em quem você pode confiar.' },
];

export const faqs = [
  ['Como funciona o atendimento?', 'Começamos com uma conversa sobre o seu momento, necessidades, região desejada e orçamento. A partir disso, Fábio apresenta opções compatíveis para você avaliar.'],
  ['Como agendo uma visita?', 'Use o botão de agendamento no anúncio ou converse pelo WhatsApp. Fábio confirma a disponibilidade do imóvel e combina com você o melhor horário.'],
  ['Posso informar o tipo de imóvel que procuro?', 'Sim. Conte quantos quartos precisa, as regiões de interesse e sua faixa de investimento. Esses detalhes ajudam a construir uma seleção mais adequada.'],
  ['Vocês trabalham com imóveis novos e usados?', 'Converse com Fábio sobre o perfil desejado. As opções novas, usadas e de construtoras parceiras dependem do catálogo disponível no momento.'],
  ['Como anuncio meu imóvel?', 'Preencha o formulário de proprietários ou entre em contato pelo WhatsApp. Você poderá enviar as fotografias na conversa e combinar os próximos passos da divulgação.'],
  ['O corretor ajuda durante a negociação?', 'Fábio acompanha a apresentação do imóvel, as visitas e a negociação, ajudando a esclarecer informações e organizar os próximos passos até a conclusão.'],
  ['Posso solicitar informações sobre financiamento?', 'Sim. Fábio pode orientar os próximos passos para consultar uma instituição financeira. Taxas, condições e aprovação dependem da instituição e da análise individual.'],
  ['Quais regiões de Sorocaba são atendidas?', 'O atendimento é voltado a Sorocaba e região. Informe o bairro ou a área que você procura para consultar as opções e a disponibilidade.'],
];
