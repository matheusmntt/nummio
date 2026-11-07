"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { duration, ease, gsap, media, useGSAP } from "@/lib/motion";
import { RevealText } from "../motion/reveal-text";
import { ScrollWords } from "../motion/scroll-words";

const facts = [
  { term: "Type", detail: site.descriptor },
  { term: "Focus", detail: "Software, applied research" },
  { term: "Method", detail: "Explore → Understand → Build" },
  { term: "Structure", detail: "Nummio · Nummio Labs · Nummio Research" },
  { term: "Domain", detail: site.domain },
] as const;

/** Geometry of the official symbol (assets/branding/icons/nummio-symbol-*.svg). */
const SYMBOL_N = "M22 78 V22 H34 L68 61 V22 H80 V78 H68 L34 39 V78 Z";

/*
 * Chapter 06. The page turns to the opposite surface: a light reading room
 * in the dark theme (and the reverse in light). The Nummio symbol is drawn,
 * filled and finally receives its block, the lab's mark assembled in place.
 */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(
          q("[data-surface]"),
          { clipPath: "inset(0% 7% 0% 7% round 28px 28px 0px 0px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );

        const symbol = gsap.timeline({
          defaults: { ease: ease.out },
          scrollTrigger: { trigger: q("[data-symbol]")[0], start: "top 80%", end: "bottom 45%", scrub: 1 },
        });
        symbol
          .fromTo(q("[data-symbol-stroke]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "none" })
          .fromTo(q("[data-symbol-fill]"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.8)
          .fromTo(q("[data-symbol-block]"), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, 1.0);

        gsap.from(q("[data-fact]"), {
          y: 20,
          opacity: 0,
          stagger: 0.06,
          duration: duration.reveal,
          ease: ease.out,
          scrollTrigger: { trigger: q("[data-facts]")[0], start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" tabIndex={-1} aria-labelledby="about-title" data-chapter="06" className="relative isolate text-inverse-foreground">
      <div aria-hidden data-surface className="absolute inset-0 -z-10 bg-inverse" />
      <div className="nm-wide py-24 md:py-36">
        <div className="flex items-center justify-between font-mono text-meta tracking-label text-inverse-muted uppercase">
          <p>
            <span className="text-inverse-accent">N/06</span> — Philosophy
          </p>
          <p aria-hidden>Explore → Understand → Build</p>
        </div>

        <div className="mt-16 grid gap-y-16 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-8">
            <RevealText as="h2" id="about-title" className="text-[clamp(3rem,8.4vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-balance">
              An independent lab, by design.
            </RevealText>
          </div>
          <div data-symbol className="relative hidden aspect-square w-full max-w-72 self-end justify-self-end lg:col-span-4 lg:block">
            <svg viewBox="0 0 100 100" aria-hidden className="size-full overflow-visible">
              <path data-symbol-fill d={SYMBOL_N} fill="currentColor" />
              <path data-symbol-stroke d={SYMBOL_N} fill="none" stroke="currentColor" strokeWidth="0.6" />
              <rect data-symbol-block x="75" y="13" width="13" height="13" rx="1.8" fill="var(--nm-inverse-accent)" />
            </svg>
          </div>
        </div>

        <div className="mt-16 grid gap-y-14 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <ScrollWords className="text-3xl leading-[1.12] font-medium tracking-snug text-balance md:text-5xl lg:col-span-9" dim={0.18}>
            Nummio is an independent laboratory for technology, software and applied research. It exists to give
            curiosity a working method.
          </ScrollWords>

          <div className="space-y-6 text-lg text-inverse-muted lg:col-span-5 lg:col-start-1">
            <p>
              That means time to explore a question properly, the rigor to understand it, and the engineering to turn
              what we learn into something useful. Research and software are not separate tracks here; each keeps the
              other honest.
            </p>
            <p>
              Independence is the point. It lets the lab choose problems for their interest rather than their pitch, and
              build tools at the scale they need, no larger.
            </p>
          </div>

          <dl data-facts className="self-start border-t border-inverse-line lg:col-span-5 lg:col-start-8">
            {facts.map((fact) => (
              <div key={fact.term} data-fact className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-inverse-line py-4">
                <dt className="nm-eyebrow pt-0.5 text-inverse-muted">{fact.term}</dt>
                <dd className="text-sm">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
