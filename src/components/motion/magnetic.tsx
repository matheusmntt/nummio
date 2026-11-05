"use client";

import { useRef, type ReactNode } from "react";
import { duration, gsap, media, useGSAP } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  /** Fraction of the pointer offset the element follows. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its content toward a fine pointer and springs back on leave. Touch,
 * coarse pointers and reduced motion get the plain element.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const mm = gsap.matchMedia();
      mm.add(`${media.motion} and ${media.fine}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: duration.ui, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: duration.ui, ease: "power3.out" });

        const onMove = contextSafe((event: PointerEvent) => {
          const box = el.getBoundingClientRect();
          xTo((event.clientX - (box.left + box.width / 2)) * strength);
          yTo((event.clientY - (box.top + box.height / 2)) * strength);
        });
        const onLeave = contextSafe(() => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)" });
        });

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-flex will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}
