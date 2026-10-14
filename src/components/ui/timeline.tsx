// Adapted from the Hyperiux Vault timeline supplied by the user.
'use client';

import { useCallback, useId, useRef, type CSSProperties } from 'react';
import { sceneTop, useScrollScene, type SceneSetup } from '@/hooks/use-scroll-scene';
import { cn } from '@/lib/utils';

export interface JourneyItem {
  id: string;
  label: string;
  title: string;
  content: string;
}

export interface TimelineProps {
  items: JourneyItem[];
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollDuration?: number;
  className?: string;
}

export default function Timeline({
  items, title = 'Uma escolha acompanhada, do início à nova chave.',
  periodLabel = 'Do primeiro contato à conclusão',
  textColor = 'var(--text)', mutedTextColor = 'var(--muted)',
  activeColor = 'var(--bronze)', backgroundColor = 'var(--bg)',
  imageUrl = '/images/interior-living.webp',
  imageAlt = 'Ambiente residencial ilustrativo com sala ampla e materiais naturais',
  duration, scrollDuration = .65, className,
}: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const speed = Math.min(1.2, Math.max(.25, duration ?? scrollDuration));

  const setup = useCallback<SceneSetup>((element, { gsap, ScrollTrigger, SplitText }) => {
    const track = element.querySelector<HTMLElement>('.journey-track');
    const viewport = element.querySelector<HTMLElement>('.journey-viewport');
    const stage = element.querySelector<HTMLElement>('.journey-stage');
    if (!track || !viewport || !stage) return;
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (distance() === 0) return;
    const splits: InstanceType<typeof SplitText>[] = [];
    const horizontal = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        id: `journey-${id}`, trigger: stage, pin: true,
        start: () => `top ${sceneTop()}px`, end: () => `+=${Math.max(650, distance() * 1.2)}`,
        scrub: .4, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });

    gsap.fromTo(element.querySelector('.journey-line-progress'), { scaleX: 0 }, {
      scaleX: 1, transformOrigin: 'left center', ease: 'none',
      scrollTrigger: { trigger: stage, start: () => `top ${sceneTop()}px`, end: () => `+=${Math.max(650, distance() * 1.2)}`, scrub: true, invalidateOnRefresh: true },
    });

    element.querySelectorAll<HTMLElement>('.journey-item').forEach(item => {
      const stem = item.querySelector('.journey-stem');
      const dot = item.querySelector('.journey-dot');
      const initiallyVisible = item.getBoundingClientRect().left < viewport.getBoundingClientRect().right - 30;
      const revealTrigger = initiallyVisible
        ? { trigger: stage, start: 'top 85%', once: true, fastScrollEnd: true }
        : { trigger: item, containerAnimation: horizontal, start: 'left 90%', toggleActions: 'play none none reverse', fastScrollEnd: true };
      gsap.from(stem, { scaleY: 0, duration: .4, ease: 'power2.out', scrollTrigger: revealTrigger });
      gsap.from(dot, { scale: 0, duration: .4, ease: 'power2.out', scrollTrigger: revealTrigger });
      item.querySelectorAll<HTMLElement>('[data-journey-text]').forEach(text => {
        const split = SplitText.create(text, {
          type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 105, duration: speed, stagger: .055, ease: 'power2.out',
              immediateRender: false, scrollTrigger: revealTrigger,
            });
          },
        });
        splits.push(split);
      });
    });
    return () => {
      splits.forEach(split => split.revert());
      ScrollTrigger.getById(`journey-${id}`)?.kill();
    };
  }, [id, speed]);

  const compactSetup = useCallback<SceneSetup>((element, { gsap, SplitText }) => {
    const splits: InstanceType<typeof SplitText>[] = [];
    const photo = element.querySelector('.journey-photo');
    gsap.fromTo(element.querySelector('.journey-photo img'), { scale: 1.07 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    element.querySelectorAll<HTMLElement>('.journey-item').forEach(item => {
      const reveal = { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse', fastScrollEnd: true };
      gsap.from(item.querySelector('.journey-stem'), { scaleY: 0, duration: .6, ease: 'power2.out', scrollTrigger: reveal });
      gsap.from(item.querySelector('.journey-dot'), { scale: 0, duration: .4, ease: 'power2.out', scrollTrigger: reveal });
      item.querySelectorAll<HTMLElement>('[data-journey-text]').forEach(text => {
        const split = SplitText.create(text, {
          type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
          onSplit(self) {
            return gsap.from(self.lines, { yPercent: 100, duration: speed, stagger: .06, ease: 'power2.out', immediateRender: false, scrollTrigger: reveal });
          },
        });
        splits.push(split);
      });
    });
    return () => splits.forEach(split => split.revert());
  }, [speed]);

  useScrollScene(ref, setup, compactSetup);
  const style = {
    color: textColor, backgroundColor,
    '--journey-accent': activeColor, '--journey-muted': mutedTextColor,
  } as CSSProperties;

  return (
    <div ref={ref} className={cn('journey-presentation relative w-full', className)} style={style}>
      <div className="journey-meta flex items-center justify-between gap-4">
        <span>{periodLabel}</span><span className="motion-only">Role para acompanhar as etapas <span aria-hidden="true">↘</span></span>
      </div>
      <div className="journey-stage">
        <div className="journey-viewport">
          <div className="journey-track">
            <figure className="journey-photo">
              <img src={imageUrl} alt={imageAlt} width="900" height="1000" loading="lazy" />
              <figcaption>{title}<small>Imagem ilustrativa</small></figcaption>
            </figure>
            <ol className="journey-list" aria-label="Etapas do atendimento">
              <li className="journey-axis" role="presentation" aria-hidden="true"><span className="journey-line-progress" /></li>
              {items.map((item, index) => (
                <li key={item.id} className={cn('journey-item', index % 2 === 1 && 'journey-item-bottom')}>
                  <span className="journey-stem" aria-hidden="true" /><span className="journey-dot" aria-hidden="true" />
                  <div className="journey-copy"><span className="journey-label">{item.label}</span><h3 data-journey-text>{item.title}</h3><p data-journey-text>{item.content}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
