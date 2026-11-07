"use client";

import { useRef } from "react";
import { art, crops } from "@/lib/art";
import { ease, gsap, media, SplitText, useGSAP } from "@/lib/motion";
import { DitherStudy } from "../dither-study";
import { FigureCaption } from "../figure-caption";

/** Crop of the sculpture in the print, as fractions (like CSS `object-position`). */
const FOCUS = { x: 0.62, y: 0.3 };

/** Dither cell sizes in CSS pixels: the print resolves through these, coarse to fine. */
const CELLS = [32, 20, 12, 8, 5, 3, 2] as const;

const cellLabel = (cell: number) => String(cell).padStart(2, "0");

/*
 * Chapter 02. The Classical Intelligence study is shown only as a print: a
 * hard dither in the brand's two inks. As the reader scrolls, the sampling
 * grid resolves in steps, from a few coarse blocks to the full fine print,
 * the way a computation sharpens its reading of a thought.
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
        const levels = q("[data-dither-level]") as HTMLCanvasElement[];
        const readout = q("[data-cell-readout]")[0] as HTMLElement;
        const resolve = { step: 0 };

        // Layers stack coarse to fine, so showing every layer up to the current step shows that step.
        const show = (step: number) => {
          levels.forEach((level, index) => {
            level.style.visibility = index <= step ? "visible" : "hidden";
          });
          readout.textContent = cellLabel(CELLS[step]);
        };
        show(0);

        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });

        tl.fromTo(q("[data-frame]"), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
          // The resolve: one discrete step per cell size, no blending between them.
          .to(
            resolve,
            {
              step: CELLS.length - 1,
              duration: 1.4,
              ease: "none",
              onUpdate: () => show(Math.round(resolve.step)),
            },
            0.15,
          )
          // The ruler fills as the grid resolves.
          .fromTo(q("[data-resolve-bar]"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "none" }, 0.15)
          .fromTo(q("[data-ghost]"), { xPercent: 12 }, { xPercent: -28, duration: 3 }, 0)
          .from(q("[data-kicker] > *"), { yPercent: 120, opacity: 0, duration: 0.4, stagger: 0.08, ease: ease.out }, 0.1)
          .from(statement.words, { yPercent: 110, duration: 0.5, stagger: 0.05, ease: ease.out }, 0.35)
          .fromTo(reading.words, { opacity: 0.14 }, { opacity: 1, duration: 0.9, stagger: 0.04 }, 1.0)
          .from(q("[data-coda] > *"), { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: ease.out }, 2.1)
          .to({}, { duration: 0.4 });

        return () => {
          levels.forEach((level) => level.style.removeProperty("visibility"));
          readout.textContent = cellLabel(CELLS[CELLS.length - 1]);
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

        <figure data-figure className="absolute inset-x-(--nm-gutter) top-18 h-[38svh] md:top-24 md:right-(--nm-gutter) md:bottom-10 md:left-auto md:h-auto md:w-[44vw] lg:w-[min(40vw,40rem)]">
          <div aria-hidden className="nm-corners -inset-2 text-line-strong md:-inset-3" />
          <div data-frame role="img" aria-label={art.classical.alt} className="relative size-full overflow-hidden bg-plate">
            <DitherStudy src={crops.classicalSculpture} focusX={FOCUS.x} focusY={FOCUS.y} cells={CELLS} />
            <div aria-hidden className="absolute inset-0 grid grid-cols-3 divide-x divide-plate-line/50">
              <span />
              <span />
              <span />
            </div>
            <div aria-hidden className="absolute inset-y-0 left-0 w-2 bg-[repeating-linear-gradient(to_bottom,var(--nm-plate-line)_0_1px,transparent_1px_16px)]">
              <div data-resolve-bar className="ml-auto h-full w-px origin-top bg-plate-accent" />
            </div>
            <p aria-hidden className="absolute top-0 right-0 bg-plate px-2 py-1 font-mono text-meta tracking-label text-plate-accent uppercase tabular-nums">
              Cell <span data-cell-readout>{cellLabel(CELLS[CELLS.length - 1])}</span> px
            </p>
            <p aria-hidden className="absolute bottom-0 left-0 bg-plate-accent px-2 py-1 font-mono text-meta tracking-label text-plate uppercase">
              Atkinson · Iris × Signal
            </p>
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
              <p className="ml-auto">Curiosity → Questions → Models → Tools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
