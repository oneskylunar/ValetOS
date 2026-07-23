"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Global smooth scroll provider using Lenis.
 * Respects prefers-reduced-motion.
 * Initializes once, destroys on unmount.
 *
 * Also intercepts in-page hash links (e.g. <a href="#why-valetos">) and
 * animates to the target via Lenis so the scroll matches the rest of the
 * site's motion. Accounts for the fixed header so the section heading
 * isn't hidden underneath it.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Hash-link interception. Lenis does not auto-handle <a href="#…">
    // clicks, so we listen at the document level and forward them.
    function handleAnchorClick(event: MouseEvent) {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!(target instanceof HTMLElement)) return;

      event.preventDefault();

      // Measure the fixed header at click time so the section heading
      // lands below it instead of hidden underneath.
      const header = document.querySelector<HTMLElement>("header.fixed, [data-site-header]");
      const offset = header ? header.getBoundingClientRect().height : 0;

      lenis.scrollTo(target, { offset: -offset });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
