import { useEffect, type RefObject } from 'react';
import type * as Motion from '@/lib/gsap';

// Compact desktop previews still get the horizontal scenes. Small/short screens
// get scroll reveals in normal flow, not an unanimated substitute.
export const SCROLL_SCENE_QUERY = '(min-width: 800px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const COMPACT_SCENE_QUERY = '(max-width: 799px) and (prefers-reduced-motion: no-preference), (max-height: 639px) and (prefers-reduced-motion: no-preference)';
export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
export type MotionTools = typeof Motion;
export type SceneSetup = (element: HTMLElement, tools: MotionTools) => void | (() => void);

export function sceneTop() {
  return Math.ceil(document.querySelector('.header-inner')?.getBoundingClientRect().height ?? 88) + 16;
}

export function useScrollScene(ref: RefObject<HTMLElement | null>, setup: SceneSetup, compactSetup: SceneSetup) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const query = window.matchMedia(MOTION_QUERY);
    let disposed = false;
    let loading = false;
    let media: ReturnType<MotionTools['gsap']['matchMedia']> | undefined;

    const enable = async () => {
      if (!query.matches || disposed || loading || media) return;
      loading = true;
      try {
        // GSAP stays a separate production chunk in every responsive layout.
        const tools = await import('@/lib/gsap');
        await document.fonts.ready;
        if (disposed || !query.matches) return;
        media = tools.gsap.matchMedia();
        media.add(SCROLL_SCENE_QUERY, () => {
          element.dataset.motion = 'desktop';
          const cleanup = setup(element, tools);
          tools.ScrollTrigger.sort();
          tools.ScrollTrigger.refresh();
          return () => {
            cleanup?.();
            delete element.dataset.motion;
          };
        }, element);
        media.add(COMPACT_SCENE_QUERY, () => {
          element.dataset.motion = 'compact';
          const cleanup = compactSetup(element, tools);
          tools.ScrollTrigger.refresh();
          return () => {
            cleanup?.();
            delete element.dataset.motion;
          };
        }, element);
      } catch (error) {
        // All content remains visible if an optional animation can't initialize.
        media?.revert();
        delete element.dataset.motion;
        console.warn('A apresentação continua disponível sem animações.', error);
      } finally {
        loading = false;
      }
    };

    void enable();
    query.addEventListener('change', enable);
    return () => {
      disposed = true;
      query.removeEventListener('change', enable);
      media?.revert();
      delete element.dataset.motion;
    };
  }, [ref, setup, compactSetup]);
}
