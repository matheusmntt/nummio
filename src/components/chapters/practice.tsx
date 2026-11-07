"use client";

import { useRef } from "react";
import { fronts } from "@/content/fronts";
import { duration, ease, gsap, media, useGSAP } from "@/lib/motion";
import { RevealText } from "../motion/reveal-text";

/*
 * Chapter 04. What the lab does, by who the work is for. Each front is laid
 * down like an entry in a register: its rule is drawn first, then the text
 * rises onto it.
 */
export function Practice() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        q("[data-front]").forEach((front, index) => {
          gsap
            .timeline({
              defaults: { ease: ease.out, duration: duration.reveal },
              scrollTrigger: { trigger: front, start: "top 85%", once: true },
              delay: (index % 3) * 0.12,
            })
            .from(front.querySelector("[data-front-rule]"), { scaleX: 0, duration: duration.cinematic, ease: ease.inOut })
            .from(front.querySelectorAll("[data-front-item]"), { y: 32, opacity: 0, stagger: 0.08 }, 0.3);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="practice" tabIndex={-1} aria-labelledby="practice-title" data-chapter="04" className="relative py-24 md:py-36">
      <div className="nm-wide">
        <header className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <p className="font-mono text-meta tracking-label text-muted uppercase lg:col-span-12">
            <span className="text-accent">N/04</span> — Practice
          </p>
          <RevealText as="h2" id="practice-title" className="text-statement font-semibold text-balance lg:col-span-8">
            One lab, three fronts.
          </RevealText>
          <p className="max-w-md text-lg text-muted lg:col-span-4 lg:self-end">
            Nummio is a hub for technology and innovation. The same method runs through everything it makes, whoever
            it is for.
          </p>
        </header>

        {/* On large screens each front is a subgrid, so its rows line up across the three columns. */}
        <ol className="mt-16 grid gap-y-14 md:mt-24 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
          {fronts.map((front, index) => (
            <li key={front.title} data-front className="group relative pt-6 lg:row-span-4 lg:grid lg:grid-rows-subgrid">
              <span aria-hidden data-front-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div data-front-item className="flex items-center justify-between font-mono text-meta tracking-label uppercase">
                <span className="text-accent">F/{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden className="size-2 rounded-[2px] bg-line-strong transition-colors duration-300 group-hover:bg-accent" />
              </div>
              <h3 data-front-item className="mt-10 text-4xl font-semibold tracking-tightest md:text-5xl">
                {front.title}
              </h3>
              <p data-front-item className="mt-4 max-w-sm text-muted">
                {front.definition}
              </p>
              <p data-front-item className="mt-8 max-w-sm border-t border-line pt-5 text-lg leading-snug font-medium tracking-snug">
                {front.line}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
