"use client";

import { useRef, type ReactNode } from "react";
import { gsap, media, useGSAP } from "@/lib/motion";

/**
 * Lifts its content out of a mask as it scrolls into view, scrubbed to the
 * scroll position. Used for the closing wordmark so the page ends in motion.
 */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          ref.current?.firstElementChild ?? null,
          { yPercent: 70 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom 85%", scrub: 0.6 } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div>{children}</div>
    </div>
  );
}
