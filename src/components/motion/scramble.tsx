"use client";

import { useRef } from "react";
import { gsap, media, useGSAP } from "@/lib/motion";

type ScrambleProps = {
  text: string;
  className?: string;
  /** Seconds before decoding starts once in view. */
  delay?: number;
  /** Replay the decode whenever `text` changes instead of only on first view. */
  live?: boolean;
};

const GLYPHS = "01/\\<>_-+=·#";

/**
 * Technical metadata that decodes into place, like an instrument settling on
 * a reading. Screen readers get the final text only.
 */
export function Scramble({ text, className, delay = 0, live = false }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const decode = () => {
          seen.current = true;
          gsap.to(el, {
            duration: Math.min(1.2, 0.35 + text.length * 0.03),
            delay,
            ease: "none",
            scrambleText: { text, chars: GLYPHS, speed: 0.6, revealDelay: 0.15 },
          });
        };
        if (live && seen.current) {
          decode();
          return;
        }
        gsap.set(el, { textContent: text.replace(/[^\s]/g, "·") });
        gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%", once: true, onEnter: decode } });
      });
    },
    { scope: ref, dependencies: [text], revertOnUpdate: true },
  );

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {text}
      </span>
    </span>
  );
}
