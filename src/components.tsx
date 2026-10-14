import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { business, mapLink, waLink } from './data';
import type { Property } from './data';

export function Icon({ name, size = 20, ...props }: { name: string; size?: number; className?: string }) {
  const paths: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    diagonal: <><path d="M6 18 18 6M6 6h12v12" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    bed: <><path d="M3 18V6M3 14h18v7M3 18h18M6 14V9h5v5M11 10h6a4 4 0 0 1 4 4" /></>,
    car: <><path d="m5 7 2-4h10l2 4M3 9h18v9H3ZM5 18v3M19 18v3M6 13h2M16 13h2" /></>,
    area: <><path d="M9 3H3v6M15 3h6v6M21 15v6h-6M9 21H3v-6M3 3l6 6M21 3l-6 6M21 21l-6-6M3 21l6-6" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 10 6-4M9 14l6 4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.7l.5 2.9a2 2 0 0 1-.6 1.7l-1.3 1.3a16 16 0 0 0 4.7 4.7l1.3-1.3a2 2 0 0 1 1.7-.6l2.9.5a2 2 0 0 1 1.7 2Z" />,
    whatsapp: <><path d="M21 11.5a9 9 0 0 1-13.3 8L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z" /><path d="M8 7c0 5 4 9 9 9l1-2-3-2-1 1a9 9 0 0 1-3-3l1-1-2-3-2 1Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" /></>,
    building: <><path d="M4 21V3h12v18M16 9h4v12M2 21h20M7 7h2M11 7h2M7 11h2M11 11h2M7 15h2M11 15h2M9 21v-3h3" /></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><path d="M8 3v6M16 9v6M10 15v6" /></>,
    quote: <><path d="M3 13c0-5 3-8 7-8v3c-2 0-3 2-3 4h3v7H3ZM14 13c0-5 3-8 7-8v3c-2 0-3 2-3 4h3v7h-7Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.arrow}</svg>;
}

export function Brand() {
  return <a className="brand" href="/" aria-label="Fábio Silva — início"><svg className="brand-monogram" viewBox="0 0 64 64" aria-hidden="true"><path d="M9 12h25v4H15v14h15v4H15v18H9Z" /><path d="M54 16C50 12 43 11 38 13C34 15 32 19 33 24C34 29 38 31 43 33L46 35C50 37 51 41 48 45C44 49 38 48 34 44L31 48C37 54 46 55 52 50C58 45 58 36 51 32L41 27C37 25 36 22 38 19C41 16 47 16 51 20Z" /></svg><span className="brand-wordmark"><span className="brand-name">Fábio Silva</span><small>Casas em Sorocaba</small></span></a>;
}

export function WhatsApp({ children = 'Falar com o Fábio', message, className = '', arrow = true }: { children?: ReactNode; message?: string; className?: string; arrow?: boolean }) {
  return <a className={`button ${className}`} href={waLink(message)} target="_blank" rel="noopener noreferrer">{children}{arrow && <span className="button-icon"><Icon name="diagonal" size={17} /></span>}</a>;
}

export function Header({ count, overlay = false }: { count: number; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!overlay) return;
    const update = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [overlay]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    const outside = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !button.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  const links = [['Início', '/'], ['Imóveis', '/#imoveis'], ['Como funciona', '/#processo'], ['Sobre', '/#sobre'], ['Avaliações', '/#avaliacoes'], ['Anuncie seu imóvel', '/#anunciar'], ['Contato', '/#contato']];
  return <header className={`site-header${overlay ? ' header-overlay' : ''}${scrolled || open ? ' is-solid' : ''}`}><div className="header-inner"><Brand /><nav className="desktop-nav" aria-label="Navegação principal">{links.map(([title, url]) => <a href={url} key={title}>{title}</a>)}</nav><div className="header-actions"><a className="icon-button saved-link" href="/favoritos" aria-label={`Ver ${count} imóveis favoritos`}><Icon name="heart" />{count > 0 && <span>{count}</span>}</a><WhatsApp className="header-contact">Falar com o Fábio</WhatsApp><button className="icon-button mobile-menu-toggle" ref={button} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button></div></div><div ref={panel} id="mobile-nav" className="mobile-nav" hidden={!open}><nav aria-label="Navegação móvel">{links.map(([title, url]) => <a href={url} key={title} onClick={() => setOpen(false)}>{title}<Icon name="diagonal" size={16} /></a>)}<WhatsApp /></nav></div></header>;
}

export function Facts({ property }: { property: Property }) {
  return <div className="property-facts"><span><Icon name="bed" size={18} />{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span><span><Icon name="car" size={18} />{property.parking} {property.parking === 1 ? 'vaga' : 'vagas'}</span><span><Icon name="area" size={18} />{property.area} m²</span></div>;
}

export function PropertyCard({ property, saved, onSave, onShare }: { property: Property; saved: boolean; onSave: (id: string) => void; onShare: (p: Property) => void }) {
  return <article className="property-card"><div className="property-image-wrap" data-depth><a href={`/imoveis/${property.slug}`} aria-label={`Ver detalhes: ${property.title}`}><img className="property-image" src={property.images[0]} width="1000" height="700" alt={`${property.type}: imagem ilustrativa de arquitetura residencial`} loading="lazy" /></a><span className="image-tag">{property.type}</span><button className={`icon-button favorite-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(property.id)} aria-label={saved ? `Remover ${property.title} dos favoritos` : `Favoritar ${property.title}`} aria-pressed={saved}><Icon name="heart" /></button></div><div className="property-caption"><div className="property-location"><Icon name="pin" size={15} />{property.neighborhood}, Sorocaba <span>{property.id}</span></div><a className="property-title" href={`/imoveis/${property.slug}`}>{property.title}</a><Facts property={property} /><div className="property-bottom"><span className="price">{property.price ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Valor sob consulta'}</span><a href={`/imoveis/${property.slug}`} className="round-link" aria-label={`Ver detalhes: ${property.title}`}><Icon name="diagonal" size={19} /></a></div><div className="property-actions"><a href={waLink(`Olá, Fábio! Gostaria de agendar uma visita. Vi o exemplo ${property.id} e procuro um imóvel com esse perfil. Pode me apresentar opções disponíveis?`)} target="_blank" rel="noopener noreferrer">Agendar visita</a><button onClick={() => onShare(property)}><Icon name="share" size={15} />Compartilhar</button></div>{property.demo && <p className="demo-caption">Imóvel demonstrativo — substituir pelos dados oficiais.</p>}</div></article>;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem('fabio-favorites') || '[]');
      return Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string') : [];
    } catch { return []; }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem('fabio-favorites', JSON.stringify(favorites)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [favorites]);
  return { favorites, storageError, toggleFavorite: (id: string) => setFavorites(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id]) };
}

export function LeadForm({ kind, property }: { kind: 'seller' | 'buyer'; property?: Property }) {
  const [ready, setReady] = useState<string | null>(null);
  const [error, setError] = useState('');
  const feedback = useRef<HTMLDivElement>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') ?? '').replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 13) {
      setError('Informe um WhatsApp válido, com DDD.');
      event.currentTarget.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
      return;
    }
    setError('');
    const intro = kind === 'seller' ? 'Quero anunciar meu imóvel.' : `Gostaria de encontrar um imóvel${property ? ` com o perfil do exemplo ${property.id}` : ''}.`;
    const text = `Olá, Fábio! ${intro}\nNome: ${data.get('name')}\nWhatsApp: ${data.get('phone')}\nTipo: ${data.get('type')}\nBairro/região: ${data.get('neighborhood')}\nFaixa de valor: ${data.get('budget') || 'A combinar'}\nMensagem: ${data.get('message') || 'Gostaria de conversar.'}${kind === 'seller' ? '\nPosso enviar as fotos na conversa.' : ''}`;
    setReady(waLink(text));
    setTimeout(() => feedback.current?.focus(), 50);
  };
  return <form className="lead-form" onSubmit={submit} onChange={() => setReady(null)}><div className="field-row"><label>Seu nome<input name="name" autoComplete="name" required maxLength={100} placeholder="Como podemos chamar você?" /></label><label>WhatsApp com DDD<input name="phone" type="tel" autoComplete="tel" inputMode="tel" required placeholder="(15) 99999-9999" aria-invalid={!!error} aria-describedby={error ? `${kind}-phone-error` : undefined} />{error && <span className="field-error" id={`${kind}-phone-error`}>{error}</span>}</label></div><div className="field-row"><label>Tipo de imóvel<select name="type" defaultValue={property?.type || ''} required><option value="" disabled>Selecione</option><option>Casa em condomínio</option><option>Casa térrea</option><option>Sobrado</option><option>Apartamento</option><option>Outro</option></select></label><label>Bairro ou região<input name="neighborhood" required maxLength={120} placeholder="Onde fica ou onde você procura?" defaultValue={property?.neighborhood} /></label></div><label>Faixa de valor<input name="budget" maxLength={80} placeholder="Ex.: até R$ 700 mil, ou a combinar" /></label><label>Conte um pouco mais<textarea name="message" rows={3} maxLength={1200} placeholder={kind === 'seller' ? 'Características do imóvel e o que você gostaria de combinar.' : 'O que faz diferença para você no próximo imóvel?'} /></label>{kind === 'seller' && <p className="form-note">As fotos podem ser enviadas diretamente na conversa pelo WhatsApp.</p>}<p className="form-note">Seus dados serão usados para preparar o contato. Você revisa e envia a mensagem no WhatsApp.</p><button className="button button-bronze" type="submit">{kind === 'seller' ? 'Quero anunciar meu imóvel' : 'Solicitar atendimento'}<span className="button-icon"><Icon name="diagonal" size={17} /></span></button>{ready && <div className="form-ready" tabIndex={-1} ref={feedback} role="status"><Icon name="check" /><div><strong>Mensagem preparada.</strong><p>Revise e envie no WhatsApp para iniciar o atendimento.</p><a className="text-link" href={ready} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp <Icon name="diagonal" size={16} /></a></div></div>}</form>;
}

export function Footer() {
  const [overlapsControl, setOverlapsControl] = useState(false);
  useEffect(() => {
    let frame = 0;
    const inspect = () => {
      frame = 0;
      if (window.innerWidth > 760) { setOverlapsControl(false); return; }
      const right = window.innerWidth - 16;
      const bottom = window.innerHeight - 16;
      const blocked = [...document.querySelectorAll('a,button,input,select,textarea,p,h1,h2,h3,.hero-proof,.property-facts')].some(element => {
        if (element.closest('.floating-whatsapp')) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.left < right + 5 && rect.right > right - 60 && rect.top < bottom + 5 && rect.bottom > bottom - 60;
      });
      setOverlapsControl(blocked);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(inspect); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    inspect();
    return () => { observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <><footer className="site-footer"><div className="footer-top"><Brand /><p>Sorocaba é o endereço.<br />A escolha certa começa com quem conhece.</p><a className="text-link" href="/#imoveis">Encontre seu próximo imóvel<Icon name="diagonal" /></a></div><div className="footer-grid"><div><span className="footer-label">Uma boa conversa começa aqui</span><a className="footer-phone" href="tel:+5515991685865">{business.phone}</a><p>{business.hours}</p>{business.instagram && <a className="social-link" href={business.instagram} target="_blank" rel="noopener noreferrer"><Icon name="instagram" />Instagram</a>}</div><div><span className="footer-label">Sorocaba e região</span><p>{business.address}<br />CEP {business.postcode}</p><a className="text-link" href={mapLink} target="_blank" rel="noopener noreferrer">Ver localização<Icon name="diagonal" size={16} /></a></div><nav aria-label="Navegação do rodapé"><a href="/#imoveis">Imóveis</a><a href="/#sobre">Sobre Fábio</a><a href="/#anunciar">Anuncie seu imóvel</a><a href="/#parcerias">Construtoras parceiras</a><a href="/favoritos">Meus favoritos</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Fábio Silva. Todos os direitos reservados.</span><span>{business.creci ? `CRECI ${business.creci}` : 'CRECI: informação a confirmar'}</span><a href="/privacidade">Política de privacidade</a></div><p className="availability-note">Disponibilidade e valores estão sujeitos a atualização. O catálogo desta versão contém imóveis demonstrativos, sem oferta comercial.</p></footer><a className={`floating-whatsapp ${overlapsControl ? 'avoids-controls' : ''}`} href={waLink()} aria-label="Conversar com Fábio pelo WhatsApp" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={26} /><span>Vamos conversar?</span></a></>;
}
