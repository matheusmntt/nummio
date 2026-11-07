"use client";

import { useRef, useState } from "react";
import { principles } from "@/content/principles";
import { ease, gsap, media, useGSAP } from "@/lib/motion";
import { MethodFigure, type MethodState } from "./method-figure";

const figureLabels = ["Scatter", "Lattice", "Structure"] as const;

/*
 * Chapter 03. A pinned sequence: each principle replaces the last while one
 * set of points reorganises from scattered observations, to a measured
 * lattice, to a built structure.
 */
export function Method() {
  const root = useRef<HTMLElement>(null);
  const [figure] = useState<MethodState>(() => ({ progress: 0 }));

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const steps = q("[data-step]");
        const words = q("[data-step-word]");
        const details = q("[data-step-detail]");
        const labels = q("[data-figure-label]");
        const bars = q("[data-step-bar]");
        const nums = q("[data-step-num]");
        figure.progress = 0;

        gsap.set(words.slice(1), { yPercent: 130 });
        gsap.set(details.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(labels.slice(1), { yPercent: 100 });
        gsap.set(nums.slice(1), { yPercent: 100 });
        gsap.set(steps, { pointerEvents: "none" });

        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.9 },
        });

        tl.from(q("[data-method-head] > *"), { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.3, ease: ease.out }, 0)
          .from(q("[data-rail]"), { scaleY: 0, stagger: 0.03, duration: 0.6, ease: ease.out }, 0)
          .from(q("[data-figure]"), { scale: 0.86, opacity: 0, duration: 0.5, ease: ease.out }, 0)
          .from(words[0], { yPercent: 105, duration: 0.4, ease: ease.out }, 0.1)
          .from(details[0], { autoAlpha: 0, y: 24, duration: 0.35, ease: ease.out }, 0.25)
          .fromTo(bars[0], { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

        for (let i = 1; i < steps.length; i++) {
          const at = i * 1.1;
          tl.to(words[i - 1], { yPercent: -130, duration: 0.4, ease: "power2.in" }, at)
            .to(nums[i - 1], { yPercent: -100, duration: 0.3, ease: "power2.in" }, at)
            .to(nums[i], { yPercent: 0, duration: 0.3, ease: ease.out }, at + 0.3)
            .to(details[i - 1], { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, at)
            .to(labels[i - 1], { yPercent: -100, duration: 0.3 }, at)
            .to(words[i], { yPercent: 0, duration: 0.5, ease: ease.out }, at + 0.3)
            .to(details[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: ease.out }, at + 0.4)
            .to(labels[i], { yPercent: 0, duration: 0.3 }, at + 0.2)
            .to(figure, { progress: i, duration: 0.9, ease: "power1.inOut" }, at - 0.1)
            .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 1.1 }, at);
        }
        tl.to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="approach"
      tabIndex={-1}
      aria-labelledby="approach-title"
      data-chapter="03"
      className="nm-track [--track:360svh] md:[--track:400svh]"
    >
      <div className="nm-stage">
        <div aria-hidden className="nm-wide absolute inset-0 [--rails:4] md:[--rails:12]">
          <div className="nm-rails">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} data-rail className={i >= 4 ? "max-md:hidden" : undefined} />
            ))}
          </div>
        </div>

        <div className="nm-wide relative grid h-full grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-y-4 pt-20 pb-8 md:pt-28 md:pb-12 lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-x-6">
          <header data-method-head className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 overflow-hidden lg:col-span-12">
            <p className="font-mono text-meta tracking-label text-muted uppercase">
              <span className="text-accent">N/03</span> — Method
            </p>
            <h2 id="approach-title" className="font-mono text-meta tracking-label text-muted uppercase">
              <span className="sr-only">Method: </span>A loop of three moves
            </h2>
          </header>

          {/* Figure */}
          <div data-figure className="relative min-h-0 lg:order-2 lg:col-span-6 lg:col-start-7 lg:row-start-2">
            <div className="nm-corners inset-0 text-line-strong" />
            <MethodFigure state={figure} className="absolute inset-0 size-full" />
            <p aria-hidden className="absolute bottom-3 left-3 flex gap-2 font-mono text-meta tracking-label text-subtle uppercase md:bottom-4 md:left-4">
              Fig. 03 —
              <span className="relative inline-grid overflow-hidden">
                {figureLabels.map((label) => (
                  <span key={label} data-figure-label className="col-start-1 row-start-1 text-foreground motion-reduce:hidden first:motion-reduce:block">
                    {label}
                  </span>
                ))}
              </span>
            </p>
          </div>

          {/* Principles: stacked in place while motion is on; a plain list otherwise. */}
          <ol className="grid content-end lg:order-1 lg:col-span-6 lg:row-start-2 lg:content-center">
            {principles.map((principle, index) => (
              <li
                key={principle.title}
                data-step
                className="motion-safe:col-start-1 motion-safe:row-start-1 motion-reduce:border-t motion-reduce:border-line motion-reduce:py-8"
              >
                <p className="overflow-hidden font-mono text-xs text-accent">
                  <span data-step-num className="block">
                    {String(index + 1).padStart(2, "0")} <span className="text-subtle">/ 03</span>
                  </span>
                </p>
                <h3 className="overflow-hidden pb-[0.08em] text-[clamp(3.25rem,10vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.055em]">
                  <span data-step-word className="block">
                    {principle.title}.
                  </span>
                </h3>
                <div data-step-detail className="mt-4 max-w-md md:mt-8">
                  <p className="text-muted md:text-lg">{principle.body}</p>
                  <p className="mt-5 flex items-center gap-3 font-mono text-meta tracking-label text-subtle uppercase">
                    <span>{principle.io[0]}</span>
                    <span aria-hidden className="h-px w-8 bg-line-strong" />
                    <span className="sr-only">becomes</span>
                    <span className="text-foreground">{principle.io[1]}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Progress through the three moves */}
          <ol aria-hidden className="grid grid-cols-3 gap-3 motion-reduce:hidden lg:col-span-12 lg:row-start-3">
            {principles.map((principle, index) => (
              <li key={principle.title} className="font-mono text-meta tracking-label text-subtle uppercase">
                <span className="relative mb-2 block h-px bg-line">
                  <span data-step-bar className="absolute inset-0 origin-left scale-x-0 bg-accent" />
                </span>
                {String(index + 1).padStart(2, "0")} {principle.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
