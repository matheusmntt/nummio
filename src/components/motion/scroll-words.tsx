"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, media, SplitText, useGSAP } from "@/lib/motion";

type ScrollWordsProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Opacity of words not yet read. */
  dim?: number;
};

/**
 * Reading-paced text: words brighten as the paragraph crosses the viewport,
 * so the scroll position is the reading position. Words stay plain text for
 * assistive tech (SplitText's aria-label is not allowed on a paragraph).
 */
export function ScrollWords({ as: Tag = "p", className, children, dim = 0.16 }: ScrollWordsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const split = SplitText.create(ref.current, { type: "words", wordsClass: "nm-word", aria: "none" });
        gsap.fromTo(
          split.words,
          { opacity: dim },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
          },
        );
        return () => split.revert();
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
