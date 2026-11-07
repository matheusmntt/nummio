"use client";

import { useRef } from "react";
import { ease, gsap, media, SplitText, useGSAP } from "@/lib/motion";

const ticker = ["Explore", "Understand", "Build", "Curiosity, engineered"];

/*
 * Chapter 05. A final statement built letter by letter as the reader
 * arrives, closed by the brand's square block, then handed to the footer.
 */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const split = SplitText.create(q("[data-closing-line]"), { type: "chars", mask: "chars" });
        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom bottom", scrub: 1 },
        });
        tl.from(q("[data-closing-meta] > *"), { opacity: 0, y: 16, stagger: 0.05, duration: 0.3, ease: ease.out }, 0)
          .from(split.chars, { yPercent: 110, stagger: 0.025, duration: 0.6, ease: ease.out }, 0.05)
          .from(q("[data-closing-block]"), { scale: 0, rotate: -90, duration: 0.4, ease: "back.out(2)" }, 0.75)
          .fromTo(q("[data-closing-line='1']"), { xPercent: 3 }, { xPercent: -1.5, duration: 1.4 }, 0)
          .fromTo(q("[data-closing-line='2']"), { xPercent: -4 }, { xPercent: 1, duration: 1.4 }, 0)
          .from(q("[data-closing-foot] > *"), { opacity: 0, y: 20, stagger: 0.08, duration: 0.3, ease: ease.out }, 1.0);

        // Continuous, quiet ticker; the one decorative loop on this chapter.
        const marquee = gsap.to(q("[data-ticker]"), { xPercent: -50, duration: 40, ease: "none", repeat: -1 });

        return () => {
          split.revert();
          marquee.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="closing"
      tabIndex={-1}
      aria-labelledby="closing-title"
      data-chapter="05"
      className="nm-track [--track:170svh]"
    >
      <div className="nm-stage flex flex-col">
        <div data-closing-meta className="nm-wide flex justify-between pt-24 font-mono text-meta tracking-label text-muted uppercase md:pt-28">
          <p>
            <span className="text-accent">N/05</span> — Closing
          </p>
          <p aria-hidden className="max-sm:hidden">Thought → Computation → Construction</p>
        </div>

        <h2 id="closing-title" className="nm-wide my-auto text-[clamp(3.6rem,15vw,17rem)] leading-[0.84] font-semibold tracking-[-0.055em]">
          <span data-closing-line="1" className="block whitespace-nowrap">
            Ideas into
          </span>
          <span className="flex items-end justify-end gap-[0.06em] whitespace-nowrap">
            <span data-closing-line="2" className="block">
              existence
            </span>
            <span aria-hidden data-closing-block className="mb-[0.12em] inline-block size-[0.17em] shrink-0 rounded-xs bg-accent" />
          </span>
        </h2>

        <div className="overflow-hidden border-y border-line py-3 font-mono text-meta tracking-label text-subtle uppercase" aria-hidden>
          <div data-ticker className="flex w-max gap-12 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex gap-12">
                {Array.from({ length: 4 }, () => ticker)
                  .flat()
                  .map((word, i) => (
                    <span key={i} className="flex items-center gap-12">
                      {word}
                      <span className="size-1 bg-accent" />
                    </span>
                  ))}
              </span>
            ))}
          </div>
        </div>

        <div data-closing-foot className="nm-wide flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="max-w-sm text-muted">
            We explore questions, build models to understand them, and engineer tools from what we learn.
          </p>
          <a href="#top" className="nm-link inline-flex min-h-11 items-center font-mono text-xs tracking-label text-foreground uppercase">
            Back to the beginning ↑
          </a>
        </div>
      </div>
    </section>
  );
}
