// Adapted from the horizontal-feature-reveal component supplied by the user.
'use client';

import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { sceneTop, useScrollScene, type SceneSetup } from '@/hooks/use-scroll-scene';
import type { ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface FeatureRevealProperty {
  id: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  facts: string[];
  href: string;
  contactHref: string;
  caption: string;
}

export interface HorizontalFeatureRevealProps {
  properties: FeatureRevealProperty[];
  bgColor?: string;
  imageParallaxRange?: number;
  cardGap?: number;
  className?: string;
}

export default function HorizontalFeatureReveal({ properties, bgColor = 'var(--bg)', imageParallaxRange = 5, cardGap = 4, className }: HorizontalFeatureRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const range = Math.min(8, Math.max(0, imageParallaxRange));

  const setup = useCallback<SceneSetup>((element, { gsap, SplitText }) => {
    const viewport = element.querySelector<HTMLElement>('.feature-viewport');
    const track = element.querySelector<HTMLElement>('.feature-track');
    const stage = element.querySelector<HTMLElement>('.feature-stage');
    const panels = [...element.querySelectorAll<HTMLElement>('.feature-panel')];
    if (!viewport || !track || !stage || panels.length < 2) return;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const splits: InstanceType<typeof SplitText>[] = [];
    const cleanups: Array<() => void> = [];
    let current = 0;
    const horizontal = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: stage, pin: true, start: () => `top ${sceneTop()}px`,
        end: () => `+=${Math.max(900, distance() * .85)}`,
        scrub: .45, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate(self) {
          const next = Math.round(self.progress * (panels.length - 1));
          if (current !== next) { current = next; setActive(next); }
        },
      },
    });
    trigger.current = horizontal.scrollTrigger ?? null;

    panels.forEach((panel, index) => {
      const image = panel.querySelector('img');
      gsap.fromTo(image, { xPercent: -range }, {
        xPercent: range, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true },
      });
      panel.querySelectorAll<HTMLElement>('[data-feature-text]').forEach(text => {
        const split = SplitText.create(text, {
          type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110, duration: .65, stagger: .065, ease: 'power2.out',
              immediateRender: false,
              scrollTrigger: index === 0
                ? { trigger: stage, start: 'top 85%', once: true, fastScrollEnd: true }
                : { trigger: panel, containerAnimation: horizontal, start: 'left 80%', toggleActions: 'play none none reverse', fastScrollEnd: true },
            });
          },
        });
        splits.push(split);
      });
      // A keyboard user can focus a link on the next panel without getting lost.
      const followFocus = () => {
        const scene = trigger.current;
        if (!scene || current === index) return;
        window.scrollTo({ top: scene.start + (scene.end - scene.start) * index / (panels.length - 1), behavior: 'instant' });
        horizontal.progress(index / (panels.length - 1));
      };
      panel.addEventListener('focusin', followFocus);
      cleanups.push(() => panel.removeEventListener('focusin', followFocus));
    });
    return () => { splits.forEach(split => split.revert()); cleanups.forEach(cleanup => cleanup()); trigger.current = null; };
  }, [properties, range]);
  const compactSetup = useCallback<SceneSetup>((element, { gsap, SplitText }) => {
    const splits: InstanceType<typeof SplitText>[] = [];
    element.querySelectorAll<HTMLElement>('.feature-panel').forEach(panel => {
      const photo = panel.querySelector('.feature-image');
      gsap.fromTo(panel.querySelector('img'), { scale: 1.08, yPercent: -3 }, {
        scale: 1, yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
      });
      panel.querySelectorAll<HTMLElement>('[data-feature-text]').forEach(text => {
        const split = SplitText.create(text, {
          type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110, duration: .65, stagger: .06, ease: 'power2.out', immediateRender: false,
              scrollTrigger: { trigger: text, start: 'top 90%', toggleActions: 'play none none reverse', fastScrollEnd: true },
            });
          },
        });
        splits.push(split);
      });
    });
    return () => splits.forEach(split => split.revert());
  }, [properties]);
  useScrollScene(ref, setup, compactSetup);

  const select = (index: number) => {
    const scene = trigger.current;
    if (!scene) return;
    window.scrollTo({ top: scene.start + (scene.end - scene.start) * index / Math.max(1, properties.length - 1), behavior: 'smooth' });
  };
  const style = { backgroundColor: bgColor, '--feature-gap': `${Math.min(6, Math.max(1, cardGap))}vw`, '--image-bleed': `${range * 1.2 + .5}%` } as CSSProperties;

  return (
    <div ref={ref} className={cn('feature-presentation relative w-full', className)} style={style}>
      <div className="feature-stage">
        <nav className="feature-navigation motion-only" aria-label="Ir para um destaque">
          {properties.map((property, index) => <button key={property.id} type="button" aria-pressed={active === index} onClick={() => select(index)}><span aria-hidden="true" />{property.eyebrow}</button>)}
          <span className="feature-scroll-hint">Continue rolando <span aria-hidden="true">↘</span></span>
        </nav>
        <div className="feature-viewport">
          <div className="feature-track">
            {properties.map(property => (
              <article className="feature-panel" key={property.id}>
                <figure className="feature-image"><img src={property.image} alt={property.imageAlt} width="1200" height="900" loading="lazy" /><figcaption>{property.caption}</figcaption></figure>
                <div className="feature-copy"><span className="section-kicker">{property.eyebrow}</span><h3 data-feature-text>{property.title}</h3><div className="feature-description">{property.paragraphs.map(paragraph => <p data-feature-text key={paragraph}>{paragraph}</p>)}</div><ul className="feature-facts" aria-label="Características do exemplo">{property.facts.map(fact => <li key={fact}>{fact}</li>)}</ul><div className="feature-actions"><a className="button button-outline" href={property.href}>Conhecer o imóvel<span className="feature-arrow" aria-hidden="true">↗</span></a><a className="text-link" href={property.contactHref} target="_blank" rel="noopener noreferrer">Solicitar detalhes<span aria-hidden="true">↗</span></a></div><p className="demo-caption">Imóvel demonstrativo — substituir pelos dados oficiais.</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
