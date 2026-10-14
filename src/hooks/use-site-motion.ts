import { useEffect, type RefObject } from 'react';

const depthQuery = '(min-width: 1060px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const motionQuery = '(prefers-reduced-motion: no-preference)';

/** Decorative motion only; no input, scroll or business state is intercepted. */
export function useSiteMotion(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const depth = window.matchMedia(depthQuery);
    const motion = window.matchMedia(motionQuery);
    let frame = 0;
    let active: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let observer: IntersectionObserver | undefined;

    const resetDepth = () => {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      if (!active) return;
      active.classList.remove('is-depth-active');
      for (const variable of ['--depth-x', '--depth-y', '--light-x', '--light-y']) active.style.removeProperty(variable);
      active = null;
    };
    const paint = () => {
      frame = 0;
      if (!active?.isConnected || !depth.matches) { resetDepth(); return; }
      const rect = active.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height));
      active.style.setProperty('--depth-x', `${((.5 - y) * 4.4).toFixed(2)}deg`);
      active.style.setProperty('--depth-y', `${((x - .5) * 4.4).toFixed(2)}deg`);
      active.style.setProperty('--light-x', `${(x * 100).toFixed(1)}%`);
      active.style.setProperty('--light-y', `${(y * 100).toFixed(1)}%`);
    };
    const move = (event: PointerEvent) => {
      if (!depth.matches || event.pointerType === 'touch') return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-depth]') : null;
      if (!target || !root.contains(target)) { resetDepth(); return; }
      if (active !== target) { resetDepth(); active = target; active.classList.add('is-depth-active'); }
      pointerX = event.clientX; pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = (event: PointerEvent) => {
      if (active && (!(event.relatedTarget instanceof Node) || !active.contains(event.relatedTarget))) resetDepth();
    };
    const updateDepth = () => {
      resetDepth();
      if (depth.matches) root.dataset.depthEnabled = 'true';
      else delete root.dataset.depthEnabled;
    };
    const updateReveals = () => {
      observer?.disconnect();
      root.querySelectorAll('.is-reveal-pending').forEach(element => element.classList.remove('is-reveal-pending'));
      if (!motion.matches || !('IntersectionObserver' in window)) { delete root.dataset.siteMotion; return; }
      root.dataset.siteMotion = 'true';
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.remove('is-reveal-pending');
          observer?.unobserve(entry.target);
        }
      }, { threshold: .08, rootMargin: '0px 0px -3% 0px' });
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
        if (element.getBoundingClientRect().top > window.innerHeight * .95) element.classList.add('is-reveal-pending');
        observer?.observe(element);
      });
    };

    updateDepth(); updateReveals();
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerout', leave, { passive: true });
    depth.addEventListener('change', updateDepth);
    motion.addEventListener('change', updateReveals);
    window.addEventListener('blur', resetDepth);
    return () => {
      resetDepth(); observer?.disconnect();
      root.removeEventListener('pointermove', move); root.removeEventListener('pointerout', leave);
      depth.removeEventListener('change', updateDepth); motion.removeEventListener('change', updateReveals);
      window.removeEventListener('blur', resetDepth);
      root.querySelectorAll('.is-reveal-pending').forEach(element => element.classList.remove('is-reveal-pending'));
      delete root.dataset.depthEnabled; delete root.dataset.siteMotion;
    };
  }, [ref]);
}
