"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * Nummio motion system. Every animation in the site draws its timing from
 * these tokens so the whole page moves with one voice: quick, precise
 * microinteractions; deliberate, heavy-eased reveals; scrubbed cinematics.
 */

export const duration = {
  /** Hover, press, focus. */
  micro: 0.2,
  /** Menus, indicators, state changes. */
  ui: 0.4,
  /** Headline and image reveals. */
  reveal: 0.9,
  /** Opening sequence beats. */
  cinematic: 1.4,
} as const;

export const stagger = {
  chars: 0.025,
  words: 0.04,
  lines: 0.09,
  items: 0.08,
} as const;

let registered = false;

/** Registers plugins and brand eases once per page. Safe to call repeatedly. */
export function registerMotion() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin);
  // "Engineered" ease: a fast, precise departure with a long, quiet settle.
  CustomEase.create("nm.out", "M0,0 C0.16,1 0.3,1 1,1");
  CustomEase.create("nm.inOut", "M0,0 C0.7,0 0.2,1 1,1");
  CustomEase.create("nm.in", "M0,0 C0.6,0 0.9,0.4 1,1");
  gsap.defaults({ ease: "nm.out", duration: duration.reveal });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export const ease = {
  out: "nm.out",
  inOut: "nm.inOut",
  in: "nm.in",
  /** Scrubbed timelines map scroll linearly; easing lives inside tweens. */
  scrub: "none",
} as const;

/** gsap.matchMedia conditions shared by every choreography. */
export const media = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 768px) and (max-width: 1023.98px)",
  mobile: "(max-width: 767.98px)",
  fine: "(pointer: fine)",
} as const;

registerMotion();

export { gsap, ScrollTrigger, SplitText, useGSAP };
