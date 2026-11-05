"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { duration, ease, gsap, media, stagger, useGSAP } from "@/lib/motion";

type RevealProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Distance travelled, in px. */
  distance?: number;
  delay?: number;
  start?: string;
};

/**
 * Staggered entrance for a group: each direct child rises into place. Content
 * is fully visible without JavaScript or with reduced motion.
 */
export function Reveal({ as: Tag = "div", className, children, distance = 32, delay = 0, start = "top 88%" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const items = ref.current ? Array.from(ref.current.children) : [];
        gsap.from(items, {
          y: distance,
          autoAlpha: 0,
          duration: duration.reveal,
          ease: ease.out,
          stagger: stagger.items,
          delay,
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
