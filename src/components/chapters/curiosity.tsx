"use client";

import { useRef, useState } from "react";
import { art } from "@/lib/art";
import { ease, gsap, media, SplitText, useGSAP } from "@/lib/motion";
import { FigureCaption } from "../figure-caption";
import { finalSculpture, Sculpture, type SculptureState } from "../sculpture/sculpture";

/*
 * Chapter 02. A classical head, generated in a shader, rises out of the dark
 * in continuous tone and turns toward the reader. Then a scan line passes
 * over it and prints it as a dither in the brand's two inks, coarse at
 * first and resolving to the finest cell: thought, read by computation.
 */
export function Curiosity() {
  const root = useRef<HTMLElement>(null);
  // Starts at the finished print, which is also what reduced motion keeps.
  const [sculpture] = useState<SculptureState>(() => ({ ...finalSculpture }));

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const statement = SplitText.create(q("[data-statement]"), { type: "words", mask: "words" });
        const reading = SplitText.create(q("[data-reading]"), { type: "words" });
        const readout = q("[data-scan-readout]")[0] as HTMLElement;

        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });

        // The form: rises from the dark, turns toward the reader, the key light travels with it.
        tl.fromTo(sculpture, { exposure: 0 }, { exposure: 1, duration: 0.9, ease: "power1.out" }, 0)
          .fromTo(sculpture, { yaw: 0.95, light: -2.0 }, { yaw: finalSculpture.yaw, light: finalSculpture.light, duration: 3.4, ease: "none" }, 0)
          // The print: the pattern crawls in whole cells, the scan prints it coarse,
          // the cell steps down to the finest and the noise settles into the Bayer grid.
          .fromTo(sculpture, { phase: 0 }, { phase: 48, duration: 3.4, ease: "none" }, 0)
          .fromTo(sculpture, { scan: 0 }, { scan: 1, duration: 1.2, ease: "none" }, 1.4)
          .fromTo(sculpture, { block: 10 }, { block: 1, duration: 1.6, ease: "steps(9)" }, 1.4)
          .fromTo(sculpture, { pattern: 1 }, { pattern: 0, duration: 1.0, ease: "none" }, 2.0)
          .fromTo(q("[data-ghost]"), { xPercent: 12 }, { xPercent: -28, duration: 3 }, 0)
          .from(q("[data-kicker] > *"), { yPercent: 120, opacity: 0, duration: 0.4, stagger: 0.08, ease: ease.out }, 0.1)
          .from(statement.words, { yPercent: 110, duration: 0.5, stagger: 0.05, ease: ease.out }, 0.35)
          .fromTo(reading.words, { opacity: 0.14 }, { opacity: 1, duration: 0.9, stagger: 0.04 }, 1.0)
          // The scan line rides the print's edge, with the cell size as its readout.
          .fromTo(q("[data-scan]"), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 1.35)
          .fromTo(
            q("[data-scan]"),
            { yPercent: 0 },
            {
              yPercent: 100,
              duration: 1.2,
              ease: "none",
              onUpdate: () => {
                readout.textContent = `${Math.round(sculpture.scan * 100)}`.padStart(3, "0");
              },
            },
            1.4,
          )
          .to(q("[data-scan]"), { opacity: 0, duration: 0.15 }, 2.6)
          .from(q("[data-coda] > *"), { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: ease.out }, 2.1)
          .to({}, { duration: 0.4 });

        return () => {
          statement.revert();
          reading.revert();
        };
      });

      // The pointer swings the key light around the head, and the dither flows with it.
      mm.add(`${media.motion} and ${media.fine}`, () => {
        const frame = q("[data-frame]")[0] as HTMLElement;
        const swing = gsap.quickTo(sculpture, "pointer", { duration: 0.9, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          const box = frame.getBoundingClientRect();
          swing(gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width) * 2 - 1));
        };
        const onLeave = () => swing(0);
        frame.addEventListener("pointermove", onMove);
        frame.addEventListener("pointerleave", onLeave);
        return () => {
          frame.removeEventListener("pointermove", onMove);
          frame.removeEventListener("pointerleave", onLeave);
          sculpture.pointer = 0;
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
          <div aria-hidden className="nm-corners -inset-2 text-line-strong md:-inset-3" />
          <div data-frame role="img" aria-label={art.classical.alt} className="relative size-full overflow-hidden bg-plate">
            <Sculpture state={sculpture} className="absolute top-0 left-0" />
            {/* The proof sheet: a raw grid, an edge ruler and the print's specification. */}
            <div aria-hidden className="absolute inset-0 grid grid-cols-3 divide-x divide-plate-line/50">
              <span />
              <span />
              <span />
            </div>
            <div aria-hidden className="absolute inset-y-0 left-0 w-2 bg-[repeating-linear-gradient(to_bottom,var(--nm-plate-line)_0_1px,transparent_1px_16px)]" />
            <p aria-hidden className="absolute bottom-0 left-0 bg-plate-accent px-2 py-1 font-mono text-meta tracking-label text-plate uppercase">
              SDF · Bayer 8×8 · Iris × Signal
            </p>
            <div aria-hidden data-scan className="pointer-events-none absolute inset-0 opacity-0">
              <div className="absolute inset-x-0 top-0 h-px bg-plate-accent" />
              <p className="absolute top-0 right-3 -translate-y-[calc(100%+0.375rem)] bg-plate-scrim px-1.5 py-0.5 font-mono text-meta tracking-label text-plate-accent uppercase tabular-nums">
                Print <span data-scan-readout>000</span>
              </p>
            </div>
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
