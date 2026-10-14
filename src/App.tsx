import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { business, buyingJourney, faqs, highlightedFeatures, mapLink, properties, testimonials, waLink } from './data';
import type { Property } from './data';
import { Facts, Footer, Header, Icon, LeadForm, PropertyCard, useFavorites, WhatsApp } from './components';
import Timeline from '@/components/ui/timeline';
import HorizontalFeatureReveal from '@/components/ui/horizontal-feature-reveal';
import { useSiteMotion } from '@/hooks/use-site-motion';
import { MOTION_QUERY } from '@/hooks/use-scroll-scene';

type Filters = { purpose: string; type: string; neighborhood: string; budget: string; bedrooms: string; parking: string };
const emptyFilters: Filters = { purpose: 'comprar', type: '', neighborhood: '', budget: '', bedrooms: '', parking: '' };
type PropertyProps = { favorites: string[]; toggleFavorite: (id: string) => void; share: (property: Property) => void };

function Catalog({ favorites, toggleFavorite, share, onlySaved = false }: PropertyProps & { onlySaved?: boolean }) {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const list = properties.filter(p =>
    (!onlySaved || favorites.includes(p.id)) &&
    (!filters.purpose || p.purposes.includes(filters.purpose as 'comprar' | 'investir')) &&
    (!filters.type || p.type === filters.type) &&
    (!filters.neighborhood || p.neighborhood === filters.neighborhood) &&
    (!filters.bedrooms || p.bedrooms >= Number(filters.bedrooms)) &&
    (!filters.parking || p.parking >= Number(filters.parking)) &&
    (!filters.budget || (p.price !== null && (filters.budget === 'above' ? p.price > 1500000 : p.price <= Number(filters.budget))))
  );
  const update = (key: keyof Filters, value: string) => setDraft(previous => ({ ...previous, [key]: value }));
  const clear = () => { setFilters(emptyFilters); setDraft(emptyFilters); };
  const submit = (event: FormEvent) => { event.preventDefault(); setFilters({ ...draft }); setShowFilters(false); setTimeout(() => resultsRef.current?.focus(), 50); };
  const active = Object.entries(filters).filter(([key, value]) => value && !(key === 'purpose' && value === 'comprar')).length;
  return <section id="imoveis" className="section catalog-section"><div className="section-heading"><div><span className="section-kicker">Uma seleção para o seu momento</span><h2>{onlySaved ? 'Os seus favoritos.' : 'Um lugar para chamar de seu.'}</h2></div><p>{onlySaved ? 'Guarde as suas referências e leve a seleção para uma conversa com Fábio.' : 'Encontre o perfil que combina com você. A próxima escolha começa aqui.'}</p></div><div className="search-panel"><div className="search-top"><span><Icon name="search" />O que você procura?</span><button className="filter-toggle" aria-expanded={showFilters} aria-controls="property-filters" onClick={() => setShowFilters(!showFilters)}><Icon name="sliders" size={17} />Filtros{active > 0 && ` (${active})`}</button><p>Seu próximo endereço, do seu jeito.</p></div><form className={`search-form ${showFilters ? 'is-open' : ''}`} id="property-filters" onSubmit={submit}><div className="search-fields"><label>Objetivo<select value={draft.purpose} onChange={e => update('purpose', e.target.value)}><option value="comprar">Quero comprar</option><option value="investir">Quero investir</option></select></label><label>Tipo de imóvel<select value={draft.type} onChange={e => update('type', e.target.value)}><option value="">Todos os tipos</option>{['Casa em condomínio', 'Casa térrea', 'Sobrado', 'Apartamento'].map(type => <option key={type}>{type}</option>)}</select></label><label>Bairro<select value={draft.neighborhood} onChange={e => update('neighborhood', e.target.value)}><option value="">Toda Sorocaba</option>{[...new Set(properties.map(p => p.neighborhood))].map(n => <option key={n}>{n}</option>)}</select></label><label>Faixa de preço<select value={draft.budget} onChange={e => update('budget', e.target.value)}><option value="">Todas as faixas</option><option value="500000">Até R$ 500 mil</option><option value="1000000">Até R$ 1 milhão</option><option value="1500000">Até R$ 1,5 milhão</option><option value="above">Acima de R$ 1,5 milhão</option></select></label><label>Quartos<select value={draft.bedrooms} onChange={e => update('bedrooms', e.target.value)}><option value="">Qualquer</option><option value="2">2 ou mais</option><option value="3">3 ou mais</option><option value="4">4 ou mais</option></select></label><label>Vagas<select value={draft.parking} onChange={e => update('parking', e.target.value)}><option value="">Qualquer</option><option value="1">1 ou mais</option><option value="2">2 ou mais</option><option value="3">3 ou mais</option></select></label></div><div className="search-actions"><p><Icon name="pin" size={15} />Sorocaba e região</p><button type="submit" className="button button-bronze">Ver imóveis compatíveis<Icon name="search" size={18} /></button></div></form></div><div className="catalog-status" ref={resultsRef} tabIndex={-1}><p role="status">{list.length} {list.length === 1 ? 'imóvel demonstrativo' : 'imóveis demonstrativos'}{active > 0 ? ' com os filtros selecionados' : ' para conhecer'}</p>{active > 0 && <button className="text-link" onClick={clear}>Limpar filtros<Icon name="close" size={15} /></button>}</div><div className={`property-grid ${list.length === 1 ? 'single-result' : ''}`}>{list.map(p => <PropertyCard property={p} key={p.id} saved={favorites.includes(p.id)} onSave={toggleFavorite} onShare={share} />)}</div>{list.length === 0 && <div className="empty-state"><Icon name={onlySaved ? 'heart' : 'search'} size={36} /><h3>{onlySaved && favorites.length === 0 ? 'Sua seleção começa com um favorito.' : 'Vamos ampliar a sua busca?'}</h3><p>{filters.budget ? 'Os exemplos ainda não têm preços de venda. Consulte os valores dos imóveis disponíveis diretamente com Fábio.' : onlySaved && favorites.length === 0 ? 'Toque no coração de um imóvel para encontrá-lo aqui quando quiser.' : 'Não há exemplos com essa combinação. Ajuste os filtros ou conte ao Fábio o que você procura.'}</p><div className="empty-actions">{onlySaved ? <a href="/#imoveis" className="button">Explorar imóveis<Icon name="diagonal" /></a> : <button className="button" onClick={clear}>Limpar filtros<Icon name="close" /></button>}<WhatsApp className="button-outline">Pedir uma seleção</WhatsApp></div></div>}<div className="catalog-note"><Icon name="building" size={17} /><p>Imóveis e fotografias ilustrativos nesta versão. Consulte as opções disponíveis com Fábio.</p></div></section>;
}

function Hero() {
  return (
    <section className="hero hero-reference" aria-labelledby="hero-title">
      <img className="hero-image" src="/images/hero-reference-sunset.jpg" width="1672" height="941" alt="Cena arquitetônica ilustrativa de uma residência com terraço e piscina de borda infinita ao pôr do sol" fetchPriority="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-header-shade" aria-hidden="true" />
      <div className="hero-topline"><span>Seu próximo capítulo mora aqui.</span><span>Interior de São Paulo</span></div>
      <div className="hero-story">
        <h1 id="hero-title">Casas escolhidas para<br className="desktop-break" /> histórias que estão<br className="desktop-break" /> começando.</h1>
        <p>Atendimento próximo para encontrar, negociar<br className="desktop-break" /> e conquistar o imóvel certo em Sorocaba.</p>
        <div className="hero-buttons">
          <a href="#imoveis" className="button">Encontrar meu imóvel<span className="button-icon"><Icon name="diagonal" size={17} /></span></a>
          <a className="hero-whatsapp" href={waLink()} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={21} />Falar pelo WhatsApp</a>
        </div>
      </div>
      <div className="hero-proof">
        <div className="proof-rating"><span>{business.rating}<span className="gold-star">★</span></span><p>{business.reviewCount} avaliações no Google</p></div>
        <div><Icon name="pin" size={21} /><p>Sorocaba e região<br /><span>Atendimento personalizado</span></p></div>
      </div>
      <span className="hero-image-note">Imagem arquitetônica ilustrativa</span>
      <a className="hero-scroll" href="#imoveis" aria-label="Ir à seleção de imóveis"><span>Explore os imóveis</span><Icon name="arrow" size={18} /></a>
    </section>
  );
}

function Process() {
  return <section className="section journey-section" id="processo"><div className="journey-heading"><div className="process-intro"><span className="section-kicker">Do primeiro contato à nova chave</span><h2>Antes de encontrar a casa,<br />a gente entende você.</h2></div><div className="journey-heading-copy"><p>Momento de vida, rotina, região e faixa de investimento. Uma boa escolha começa com uma boa conversa.</p><WhatsApp className="button-outline">Conte o que você procura</WhatsApp></div></div><Timeline items={buyingJourney} imageUrl="/images/interior-living.webp" duration={.65} /></section>;
}

function About() {
  return <section className="section about-section" id="sobre"><div className="about-image" data-depth><img src={business.portrait || '/images/interior-living.webp'} width="900" height="1000" loading="lazy" alt={business.portrait ? 'Fábio Silva, corretor de imóveis em Sorocaba' : 'Ambiente residencial ilustrativo; a fotografia oficial de Fábio será adicionada posteriormente'} /><div className="about-image-signature"><span>Fábio Silva</span><small>{business.portrait ? 'Casas em Sorocaba' : 'Atendimento com propósito'}</small></div>{!business.portrait && <span className="photo-caption">Ambiente ilustrativo · foto oficial a inserir</span>}</div><div className="about-copy" data-reveal><span className="section-kicker">Conheça quem caminha com você</span><h2>Mais do que apresentar casas, entender cada pessoa.</h2><p>Encontrar um imóvel é uma decisão importante. Você merece alguém que escute, explique e esteja por perto em cada etapa.</p><p>Fábio Silva atua em Sorocaba e região com um atendimento reconhecido pela proximidade, paciência e confiança. Sua escolha é acompanhada com atenção ao que faz sentido para o seu perfil.</p><div className="about-values"><span><Icon name="check" />Escuta de verdade</span><span><Icon name="check" />Atendimento próximo</span><span><Icon name="check" />Clareza na negociação</span></div><a className="text-link" href={waLink()} target="_blank" rel="noopener noreferrer">Vamos nos conhecer<Icon name="diagonal" size={18} /></a>{business.creci && <p className="creci-label">CRECI {business.creci}</p>}</div></section>;
}

function Spotlight() {
  return <section className="section featured-journey-section" id="em-evidencia"><div className="section-heading"><div><span className="section-kicker">Arquitetura que acolhe</span><h2>Quando o espaço<br />faz sentido para a vida.</h2></div><p>Do espaço para receber ao jardim para desacelerar. Conheça referências para a sua próxima escolha.</p></div><HorizontalFeatureReveal properties={highlightedFeatures} imageParallaxRange={5} cardGap={4} /></section>;
}

function Reviews() {
  const [current, setCurrent] = useState(0);
  const review = testimonials[current];
  return <section className="section review-section" id="avaliacoes"><div className="review-intro"><span className="section-kicker">Confiança construída em cada encontro</span><h2>Quem já viveu<br />essa escolha.</h2><div className="review-score"><span className="stars" aria-label="5 de 5 estrelas">★★★★★</span><strong>{business.rating}</strong><span>{business.reviewCount} avaliações no Google</span></div></div><div className="review-content" aria-live="polite" data-reveal><Icon name="quote" className="quote-mark" size={34} /><blockquote key={review.name} className="review-quote-enter">{review.quote}</blockquote><div className="review-author"><span className="author-initials" aria-hidden="true">{review.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><div><strong>{review.name}</strong><small>{review.context} · avaliação no Google</small></div></div></div><div className="review-controls"><button className="icon-button previous" aria-label="Depoimento anterior" onClick={() => setCurrent((current + testimonials.length - 1) % testimonials.length)}><Icon name="chevron" /></button><span>{current + 1} / {testimonials.length}</span><button className="icon-button" aria-label="Próximo depoimento" onClick={() => setCurrent((current + 1) % testimonials.length)}><Icon name="chevron" /></button></div></section>;
}

function Sellers() {
  return <section className="section seller-section" id="anunciar"><div className="seller-copy"><span className="section-kicker">Para quem deseja vender</span><h2>Seu imóvel precisa<br />encontrar a pessoa certa.</h2><p>Uma apresentação cuidadosa, atendimento aos interessados e proximidade durante a negociação. Conte ao Fábio sobre o seu imóvel para planejar os próximos passos.</p><img src="/images/house-garden.webp" alt="Casa e jardim ilustrativos, referência de apresentação imobiliária" width="800" height="550" loading="lazy" /><p className="photo-credit">Imagem ilustrativa</p></div><div className="seller-form-panel"><h3>Vamos conhecer o seu imóvel?</h3><LeadForm kind="seller" /></div></section>;
}

function PartnersAndGuide() {
  return <><section className="section partner-section" id="parcerias" data-reveal><div className="partner-symbol"><Icon name="building" size={46} /></div><div><span className="section-kicker">Construtoras e incorporadoras</span><h2>Boas parcerias constroem<br />novas possibilidades.</h2><p>Divulgação de empreendimentos, atendimento aos compradores, visitas e apoio comercial. Vamos conversar sobre o seu projeto?</p></div><WhatsApp className="button-outline" message="Olá, Fábio! Tenho interesse em conversar sobre uma parceria para comercialização de imóveis.">Conversar sobre parceria</WhatsApp></section><section className="section guide-section" id="sorocaba"><div className="section-heading"><div><span className="section-kicker">Um olhar sobre a cidade</span><h2>Sorocaba, do seu jeito.</h2></div><p>A melhor região é aquela que conversa com a sua rotina. Conte suas prioridades para começarmos a busca.</p></div><div className="guide-grid"><a href={waLink('Olá, Fábio! Procuro um imóvel em uma região residencial de Sorocaba que combine com a rotina da minha família.')} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={25} /><h3>O bairro e a sua rotina</h3><p>Trabalho, escola, deslocamentos e serviços. O endereço também faz parte da escolha.</p><span>Conversar sobre regiões<Icon name="diagonal" size={16} /></span></a><a href={waLink('Olá, Fábio! Tenho interesse em conhecer opções de imóveis novos em Sorocaba.')} target="_blank" rel="noopener noreferrer"><Icon name="building" size={25} /><h3>Um começo novo</h3><p>Conheça possibilidades de imóveis novos e projetos de construtoras parceiras.</p><span>Consultar opções<Icon name="diagonal" size={16} /></span></a><a href={waLink('Olá, Fábio! Gostaria de conversar sobre imóveis em Sorocaba com o objetivo de investimento.')} target="_blank" rel="noopener noreferrer"><Icon name="area" size={25} /><h3>Uma escolha planejada</h3><p>Para morar ou investir, comece pelo objetivo e pelo perfil do imóvel que faz sentido para você.</p><span>Contar meu objetivo<Icon name="diagonal" size={16} /></span></a></div></section></>;
}

function FAQ() {
  return <section className="section faq-section" id="duvidas"><div><span className="section-kicker">Clareza em cada etapa</span><h2>Uma boa escolha<br />não deixa dúvidas.</h2><p>Não encontrou o que procura?<br /><a className="text-link" href={waLink()} target="_blank" rel="noopener noreferrer">Pergunte ao Fábio<Icon name="diagonal" size={16} /></a></p></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question} name="faq"><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}

function Contact() {
  const [mapOpen, setMapOpen] = useState(false);
  return <section className="section contact-section" id="contato"><div className="contact-main" data-reveal><span className="section-kicker">A próxima chave começa aqui</span><h2>Vamos encontrar um endereço<br />para o seu próximo capítulo.</h2><p>Conte ao Fábio o tipo de imóvel que você procura.<br />Sua próxima escolha merece um atendimento próximo.</p><WhatsApp className="button-bronze">Conversar pelo WhatsApp</WhatsApp><div className="contact-details"><a href="tel:+5515991685865"><Icon name="phone" />{business.phone}</a><span>{business.hours}</span>{business.instagram && <a href={business.instagram} target="_blank" rel="noopener noreferrer"><Icon name="instagram" />Instagram</a>}</div></div><div className="contact-map"><div className="map-surface">{mapOpen ? <iframe title="Localização de Fábio Silva em Sorocaba" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`} /> : <><div className="map-grid-lines" aria-hidden="true" /><Icon name="pin" size={42} /><strong>Sorocaba</strong><button className="text-link" onClick={() => setMapOpen(true)}>Carregar mapa<Icon name="diagonal" size={16} /></button></>}</div><div className="map-caption"><p>{business.address}<br /><span>CEP {business.postcode}</span></p><a href={mapLink} className="round-link" target="_blank" rel="noopener noreferrer" aria-label="Traçar rota no Google Maps"><Icon name="diagonal" /></a></div></div></section>;
}

function Home(props: PropertyProps) {
  return <><Hero /><div className="site-shell"><div className="promise-strip"><p>Sorocaba é o endereço.<br /><span>A escolha certa começa com quem conhece.</span></p><span className="promise-line" /><div><Icon name="check" size={18} />Um atendimento. O seu perfil.</div></div><Catalog {...props} /><Process /><Spotlight /><About /><Reviews /><Sellers /><PartnersAndGuide /><FAQ /><Contact /><Footer /></div></>;
}

function Gallery({ property }: { property: Property }) {
  const [current, setCurrent] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const handleKey = (event: React.KeyboardEvent) => { if (event.key === 'ArrowRight') setCurrent((current + 1) % property.images.length); if (event.key === 'ArrowLeft') setCurrent((current - 1 + property.images.length) % property.images.length); };
  return <><div className="detail-gallery"><button data-depth className="gallery-main" onClick={() => dialog.current?.showModal()} aria-label="Ampliar fotografia do imóvel"><img src={property.images[current]} width="1400" height="900" alt={`Fotografia ilustrativa ${current + 1} de ${property.title}`} fetchPriority="high" /><span><Icon name="area" size={17} />Ampliar imagem</span></button><div className="gallery-thumbs">{property.images.map((image, index) => <button className={index === current ? 'selected' : ''} onClick={() => setCurrent(index)} aria-label={`Exibir fotografia ${index + 1}`} aria-pressed={index === current} key={image}><img src={image} width="400" height="250" alt="" /></button>)}</div></div><dialog ref={dialog} className="gallery-dialog" onKeyDown={handleKey} onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }} aria-label="Galeria ampliada do imóvel"><button className="icon-button dialog-close" aria-label="Fechar galeria" onClick={() => dialog.current?.close()}><Icon name="close" /></button><img src={property.images[current]} width="1600" height="1000" alt={`Fotografia ilustrativa ${current + 1} de ${property.title}`} /><div className="dialog-controls"><button className="icon-button previous" aria-label="Imagem anterior" onClick={() => setCurrent((current - 1 + property.images.length) % property.images.length)}><Icon name="chevron" /></button><span>{current + 1} / {property.images.length}</span><button className="icon-button" aria-label="Próxima imagem" onClick={() => setCurrent((current + 1) % property.images.length)}><Icon name="chevron" /></button></div></dialog></>;
}

function Detail({ property, ...props }: PropertyProps & { property: Property }) {
  return <><section className="section detail-intro"><nav className="breadcrumbs" aria-label="Caminho da página"><a href="/">Início</a><Icon name="chevron" size={14} /><a href="/#imoveis">Imóveis</a><Icon name="chevron" size={14} /><span>{property.type}</span></nav><div className="detail-title-row"><div><span className="section-kicker">{property.neighborhood}, Sorocaba · {property.id}</span><h1>{property.title}</h1></div><div className="detail-tools"><button className={`icon-button ${props.favorites.includes(property.id) ? 'is-saved' : ''}`} aria-pressed={props.favorites.includes(property.id)} onClick={() => props.toggleFavorite(property.id)} aria-label="Favoritar imóvel"><Icon name="heart" /></button><button className="icon-button" onClick={() => props.share(property)} aria-label="Compartilhar imóvel"><Icon name="share" /></button></div></div>{property.demo && <p className="detail-demo">Imóvel demonstrativo — substituir pelos dados oficiais. Fotografias, bairro e características são ilustrativos; não representam uma oferta comercial.</p>}<Gallery property={property} /><div className="detail-layout"><div><Facts property={property} /><h2>O espaço e as possibilidades.</h2><p>{property.description}</p><h3>Características do exemplo</h3><div className="amenities">{property.amenities.map(item => <span key={item}><Icon name="check" />{item}</span>)}<span><Icon name="check" />{property.suites} {property.suites === 1 ? 'suíte' : 'suítes'}</span></div><h3>Localização aproximada</h3><div className="detail-location"><Icon name="pin" /><span>{property.neighborhood}, Sorocaba — SP<br /><small>Bairro ilustrativo. Solicite a localização dos imóveis oficiais.</small></span></div><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.neighborhood + ', Sorocaba, SP')}`} target="_blank" rel="noopener noreferrer">Conhecer a região no mapa<Icon name="diagonal" size={16} /></a></div><aside className="detail-aside"><span className="section-kicker">Sua próxima escolha</span><h3>{property.price ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Valor sob consulta'}</h3><p>Gostou desse perfil? Peça uma seleção de opções disponíveis ou combine uma visita.</p><WhatsApp className="button-bronze" message={`Olá, Fábio! Vi o exemplo ${property.id} no site e gostaria de agendar uma visita a um imóvel disponível com esse perfil.`}>Agendar uma visita</WhatsApp><a className="text-link" href="#interesse">Prefiro deixar meu interesse<Icon name="diagonal" size={16} /></a><div className="aside-agent"><svg viewBox="0 0 64 64" className="agent-monogram" aria-hidden="true"><path d="M9 12h25v4H15v14h15v4H15v18H9Z" /><path d="M54 16C50 12 43 11 38 13C34 15 32 19 33 24C34 29 38 31 43 33L46 35C50 37 51 41 48 45C44 49 38 48 34 44L31 48C37 54 46 55 52 50C58 45 58 36 51 32L41 27C37 25 36 22 38 19C41 16 47 16 51 20Z" /></svg><div><strong>Fábio Silva</strong><small>Atendimento em Sorocaba e região</small></div></div></aside></div></section><section className="section detail-interest" id="interesse"><div><span className="section-kicker">Conte o que faz sentido para você</span><h2>Gostou dessa referência?</h2><p>Vamos conversar sobre as opções reais que se aproximam do que você procura.</p></div><LeadForm kind="buyer" property={property} /></section><section className="section related-section"><div className="section-heading"><h2>Outras possibilidades.</h2><a className="text-link" href="/#imoveis">Ver todos os imóveis<Icon name="diagonal" /></a></div><div className="related-grid">{properties.filter(p => p.id !== property.id).slice(0, 2).map(p => <PropertyCard key={p.id} property={p} saved={props.favorites.includes(p.id)} onSave={props.toggleFavorite} onShare={props.share} />)}</div></section><div className="mobile-detail-cta"><span>{property.price ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Valor sob consulta'}</span><WhatsApp message={`Olá, Fábio! Gostaria de visitar um imóvel com o perfil do exemplo ${property.id}.`}>Agendar visita</WhatsApp></div></>;
}

function Privacy() {
  return <section className="section privacy-page"><a className="text-link" href="/">Voltar ao início<Icon name="diagonal" /></a><h1>Política de privacidade.</h1><p>Esta página explica como os recursos deste site utilizam seus dados.</p><h2>Contato</h2><p>Os formulários preparam uma mensagem com as informações que você preencher. Os dados não são enviados a um servidor deste site. Ao continuar, você revisa e envia a mensagem no WhatsApp, que possui sua própria política de privacidade. As informações enviadas servem para atender à sua solicitação sobre imóveis.</p><h2>Favoritos</h2><p>A seleção de favoritos é armazenada apenas neste navegador, no armazenamento local. Você pode remover os imóveis pelo botão de coração ou apagar os dados do site nas configurações do navegador.</p><h2>Mapa e links externos</h2><p>O mapa do Google só é carregado quando você solicita. WhatsApp, Google Maps e Instagram são serviços externos e podem coletar dados conforme suas próprias políticas. Não são utilizados serviços de análise de visitantes nesta versão.</p><h2>Fale com o responsável</h2><p>Para solicitar informações sobre os dados que enviar no atendimento, entre em contato com Fábio Silva pelo telefone {business.phone}.</p><WhatsApp /></section>;
}

function Metadata({ property }: { property?: Property }) {
  useEffect(() => {
    const title = property ? `${property.type} em ${property.neighborhood} — Fábio Silva` : 'Fábio Silva — Casas em Sorocaba';
    const description = property ? `${property.type}: conheça esta referência e solicite opções disponíveis em Sorocaba. Atendimento personalizado com Fábio Silva.` : 'Encontre casas e imóveis residenciais em Sorocaba com Fábio Silva. Atendimento próximo para comprar, anunciar seu imóvel e agendar uma visita.';
    document.title = title;
    for (const [selector, value] of [['meta[name="description"]', description], ['meta[property="og:title"]', title], ['meta[property="og:description"]', description], ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', description]]) document.querySelector(selector)?.setAttribute('content', value);
    if (business.siteUrl) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
      canonical.href = new URL(window.location.pathname, business.siteUrl).href;
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: 'Fábio Silva — Casas em Sorocaba', telephone: '+55 15 99168-5865', address: { '@type': 'PostalAddress', streetAddress: 'R. Alfredo Gemente', addressLocality: 'Sorocaba', addressRegion: 'SP', postalCode: business.postcode, addressCountry: 'BR' }, areaServed: 'Sorocaba e região', ...(business.siteUrl ? { url: business.siteUrl } : {}) });
    document.head.append(script);
    return () => script.remove();
  }, [property]);
  return null;
}

export default function App() {
  const main = useRef<HTMLElement>(null);
  useSiteMotion(main);
  const { favorites, toggleFavorite, storageError } = useFavorites();
  const [notice, setNotice] = useState('');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const property = properties.find(p => path === `/imoveis/${p.slug}`);
  useEffect(() => {
    // A direct /#section link arrives before React creates that section.
    // Wait for fonts and optional pin layouts before applying the anchor once.
    if (!window.location.hash) return;
    let disposed = false;
    let frame = 0;
    const openAnchor = async () => {
      await document.fonts.ready;
      try { if (path === '/' && window.matchMedia(MOTION_QUERY).matches) await import('@/lib/gsap'); }
      catch { /* Optional motion must not prevent opening a section. */ }
      if (disposed) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (disposed) return;
          try { document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' }); }
          catch { /* An invalid fragment must not break navigation. */ }
        });
      });
    };
    void openAnchor();
    return () => { disposed = true; if (frame) cancelAnimationFrame(frame); };
  }, [path]);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  const announce = (text: string) => { setNotice(text); if (timeout.current) clearTimeout(timeout.current); timeout.current = setTimeout(() => setNotice(''), 5000); };
  const save = (id: string) => { toggleFavorite(id); announce(favorites.includes(id) ? 'Imóvel removido dos favoritos.' : 'Imóvel salvo nos favoritos.'); };
  const share = async (p: Property) => {
    const url = `${window.location.origin}/imoveis/${p.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: `${p.title} — Fábio Silva`, text: 'Referência de imóvel para conversar com Fábio Silva.', url });
      else { await navigator.clipboard.writeText(url); announce('Link do imóvel copiado.'); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) announce('Não foi possível copiar. Copie o endereço da página do imóvel no navegador.');
    }
  };
  const props = { favorites, toggleFavorite: save, share };
  return <><Metadata property={property} /><a className="skip-link" href="#main">Ir para o conteúdo</a><Header count={favorites.length} overlay={path === '/'} /><main id="main" ref={main} className={path === '/' ? 'home-page' : property ? 'site-shell is-detail' : 'site-shell'}>{path === '/' ? <Home {...props} /> : property ? <Detail property={property} {...props} /> : path === '/favoritos' ? <div className="favorites-page"><a className="text-link" href="/#imoveis">Voltar aos imóveis<Icon name="diagonal" /></a><Catalog onlySaved {...props} /></div> : path === '/privacidade' ? <Privacy /> : <section className="section empty-state"><h1>Esse endereço não foi encontrado.</h1><p>Vamos voltar à seleção de imóveis?</p><a className="button" href="/">Ir para o início<Icon name="diagonal" /></a></section>}{path !== '/' && <Footer />}</main><div className={`toast ${notice || storageError ? 'visible' : ''}`} role="status">{storageError ? 'Os favoritos funcionam nesta sessão; o navegador não permitiu salvá-los.' : notice}</div></>;
}
