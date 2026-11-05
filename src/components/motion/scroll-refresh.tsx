"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { scrollToHash } from "./smooth-scroll";

/**
 * Mounted after the chapters: once every chapter has created its triggers
 * and pins, recompute all positions, then honour a #hash in the URL (the
 * browser's own jump happens before pin spacing exists). Fonts settling can
 * shift layout, so refresh then too.
 */
export function ScrollRefresh() {
  useEffect(() => {
    ScrollTrigger.refresh();
    let cancelled = false;
    // After the router's own scroll handling for this navigation has run.
    const timer = window.setTimeout(() => {
      if (location.hash.length > 1) scrollToHash(location.hash, { immediate: true });
    }, 60);
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
