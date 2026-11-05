"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { duration, ease, gsap, media, SplitText, stagger, useGSAP } from "@/lib/motion";

type RevealTextProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /** Where the element must reach before revealing (ScrollTrigger `start`). */
  start?: string;
};

/**
 * Masked, line-by-line headline entrance. Lines are re-split on resize and
 * font load; the text is exposed to assistive tech as one unbroken string.
 */
export function RevealText({ as: Tag = "p", id, className, children, delay = 0, start = "top 88%" }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const split = SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "nm-line",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 0%",
              duration: duration.reveal,
              ease: ease.out,
              stagger: stagger.lines,
              delay,
              scrollTrigger: { trigger: ref.current, start, once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
