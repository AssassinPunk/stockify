'use client';

import { useEffect } from 'react';

// Staggers each section's parts in as they arrive. Items are only hidden once this runs,
// so the page stays complete without script and under reduced motion.
export default function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = Array.from(document.querySelectorAll<HTMLElement>('.landing [data-reveal]')).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px' },
    );

    items.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 75}ms`;
      el.classList.add('reveal-pending');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
