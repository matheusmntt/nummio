"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, media, ScrollTrigger } from "@/lib/motion";

let current: Lenis | null = null;

/** The page's Lenis instance, or null when smooth scrolling is off. */
export function getLenis() {
  return current;
}

/** Scrolls to an in-page anchor through Lenis when present, natively otherwise. */
export function scrollToHash(hash: string, { immediate = false } = {}) {
  const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (current) {
    // Dimensions may still be the previous route's: re-measure before clamping.
    current.resize();
    current.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 1.4 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    target.scrollIntoView({ behavior: immediate ? "instant" : "auto" });
  }
  if (typeof target !== "number") target.focus({ preventScroll: true });
}

/*
 * Single smooth-scrolling system for the site: Lenis, driven by GSAP's ticker
 * so ScrollTrigger and Lenis share one frame loop. Disabled entirely when the
 * visitor prefers reduced motion; native scrolling then applies.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(media.reduce);
    let tick: ((time: number) => void) | null = null;

    function start() {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.11, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      current = lenis;
    }

    function stop() {
      if (tick) gsap.ticker.remove(tick);
      current?.destroy();
      current = null;
      tick = null;
    }

    const sync = () => {
      stop();
      if (!query.matches) start();
      ScrollTrigger.refresh();
    };

    if (!query.matches) start();
    query.addEventListener("change", sync);

    // In-page links go through Lenis so anchors glide instead of jumping.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!link || !hash || hash === "#") return;
      event.preventDefault();
      history.pushState(null, "", hash === "#top" ? location.pathname : hash);
      scrollToHash(hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      query.removeEventListener("change", sync);
      document.removeEventListener("click", onClick);
      stop();
    };
  }, []);

  return null;
}
