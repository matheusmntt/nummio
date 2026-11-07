"use client";

import Image from "next/image";
import { useRef } from "react";
import { art, artQuality, crops } from "@/lib/art";
import { ease, gsap, media, SplitText, useGSAP } from "@/lib/motion";
import { FigureCaption } from "../figure-caption";

const SLIT = "inset(49% 47% 49% 47% round 0px 0px 0px 0px)";
const OPEN = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";
const ARCH = "inset(4% 7% 0% 7% round 999px 999px 0px 0px)";

/*
 * Chapter 02. Out of the dark field, a slit of light opens onto the
 * Classical Intelligence study. Words surface as the window widens, then
 * the frame settles into an arch: thought as the foundation of the lab.
 */
export function Curiosity() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const statement = SplitText.create(q("[data-statement]"), { type: "words", mask: "words" });
        const reading = SplitText.create(q("[data-reading]"), { type: "words" });

        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });

        tl.fromTo(q("[data-frame]"), { clipPath: SLIT }, { clipPath: OPEN, duration: 1, ease: "power2.inOut" }, 0)
          // Kept close to 1: the study is a 1600px source, so heavy zoom would soften it.
          .fromTo(q("[data-frame-image]"), { scale: 1.16, yPercent: -3 }, { scale: 1, yPercent: 0, duration: 3 }, 0)
          .fromTo(q("[data-ghost]"), { xPercent: 12 }, { xPercent: -28, duration: 3 }, 0)
          .from(q("[data-kicker] > *"), { yPercent: 120, opacity: 0, duration: 0.4, stagger: 0.08, ease: ease.out }, 0.1)
          .from(statement.words, { yPercent: 110, duration: 0.5, stagger: 0.05, ease: ease.out }, 0.35)
          .fromTo(reading.words, { opacity: 0.14 }, { opacity: 1, duration: 0.9, stagger: 0.04 }, 1.0)
          .to(q("[data-frame]"), { clipPath: ARCH, duration: 0.8, ease: "power2.inOut" }, 2.0)
          .from(q("[data-coda] > *"), { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: ease.out }, 2.1)
          .to({}, { duration: 0.4 });

        return () => {
          statement.revert();
          reading.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="curiosity"
      tabIndex={-1}
      aria-labelledby="curiosity-title"
      data-chapter="02"
      className="nm-track [--track:300svh] md:[--track:340svh]"
    >
      <div className="nm-stage">
        {/* Depth layer: an outlined word drifting slower than the frame. */}
        <p
          aria-hidden
          data-ghost
          className="pointer-events-none absolute -bottom-[0.18em] left-0 text-[34vw] max-md:hidden leading-none font-semibold tracking-[-0.055em] whitespace-nowrap text-transparent select-none opacity-60 [-webkit-text-stroke:1px_var(--nm-border)] md:text-[24vw]"
        >
          Thought
        </p>

        <figure className="absolute inset-x-(--nm-gutter) top-18 h-[38svh] md:top-24 md:right-(--nm-gutter) md:bottom-10 md:left-auto md:h-auto md:w-[44vw] lg:w-[min(40vw,40rem)]">
          <div data-frame className="relative size-full overflow-hidden bg-plate">
            <div data-frame-image className="absolute inset-0 will-change-transform">
              <Image
                src={crops.classicalTall}
                alt={art.classical.alt}
                fill
                placeholder="blur"
                quality={artQuality}
                sizes="(min-width: 1024px) min(40vw, 40rem), (min-width: 768px) 44vw, 100vw"
                className="object-cover object-[62%_30%]"
              />
            </div>
            {/* The study's ground is graphite: let the drapery fall away into it. */}
            <div aria-hidden className="absolute inset-x-0 -bottom-1 h-1/4 bg-linear-to-t from-plate to-transparent" />
            <div aria-hidden className="absolute inset-y-0 -right-1 w-1/5 bg-linear-to-l from-plate to-transparent" />
          </div>
          <FigureCaption className="max-md:hidden">
            <span>
              Fig. 02 — {art.classical.title}
            </span>
            <span>{art.classical.study}</span>
          </FigureCaption>
        </figure>

        <div className="nm-wide relative flex h-full flex-col justify-end pt-[calc(38svh+5rem)] pb-8 md:w-[calc(100%-2*var(--nm-gutter))] md:justify-center md:pt-24 md:pb-16">
          <div className="md:max-w-[calc(56vw-2*var(--nm-gutter)-1.5rem)] lg:max-w-[min(52vw,46rem)]">
            <p data-kicker className="flex gap-3 overflow-hidden font-mono text-meta tracking-label text-muted uppercase">
              <span className="text-accent">N/02</span>
              <span>Curiosity</span>
              <span className="hidden sm:inline">— Thought, philosophy, context</span>
            </p>
            <h2 id="curiosity-title" data-statement className="mt-4 text-[clamp(2.25rem,6.2vw,6rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance md:mt-8">
              Every tool begins as a question.
            </h2>
            <p data-reading className="mt-5 max-w-xl text-base leading-snug font-medium tracking-snug text-foreground md:mt-10 md:text-2xl">
              Curiosity is the starting point. Engineering is how it earns its keep. Reasoning, history and the long
              conversation about how we know things are the context any serious tool is built in.
            </p>
            <div data-coda className="mt-6 hidden gap-8 border-t border-line pt-5 font-mono text-meta tracking-label text-subtle uppercase sm:flex md:mt-10">
              <p>
                <span className="text-muted">In</span> Curiosity
              </p>
              <p>
                <span className="text-muted">Out</span> Questions
              </p>
              <p className="ml-auto">Thought → Computation → Construction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
