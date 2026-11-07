"use client";

import { useRef } from "react";
import { fronts } from "@/content/fronts";
import { ease, gsap, media, useGSAP } from "@/lib/motion";
import { RevealText } from "../motion/reveal-text";

/** Space between stacked fronts below lg, in px (`gap-y-14`): the trunk crosses it to reach the next front. */
const STACK_GAP = 56;

/*
 * Chapter 04. What the lab does, by who the work is for. One trace leaves
 * the method and branches into the three fronts: as the reader scrolls, a
 * pulse runs down each branch, and the front it reaches lights up, draws its
 * rule and rises onto it. On large screens the trace is a bus above the
 * columns; stacked, it is a trunk down their left edge.
 */
export function Practice() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      /**
       * A front coming online: its lamp lights, its rule is drawn, its text rises onto it.
       * Start states are set up front: a staggered fromTo only pre-renders its first target.
       */
      const arrive = (tl: gsap.core.Timeline, front: Element, at: number) => {
        const lamp = front.querySelector("[data-front-lamp]");
        const rule = front.querySelector("[data-front-rule]");
        const items = front.querySelectorAll("[data-front-item]");
        gsap.set(lamp, { opacity: 0 });
        gsap.set(rule, { scaleX: 0 });
        gsap.set(items, { y: 32, opacity: 0 });
        return tl
          .to(lamp, { opacity: 1, duration: 0.05 }, at)
          .to(rule, { scaleX: 1, duration: 0.4, ease: ease.inOut }, at)
          .to(items, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: ease.out }, at + 0.05);
      };

      /** A pulse that shows only while it travels. */
      const travel = (tl: gsap.core.Timeline, pulse: Element, axis: "x" | "y", length: () => number, at: number, span: number) =>
        tl
          .set(pulse, { opacity: 1 }, at)
          .fromTo(pulse, { [axis]: 0 }, { [axis]: length, duration: span, ease: "none" }, at)
          .set(pulse, { opacity: 0 }, at + span);

      mm.add(`${media.motion} and ${media.desktop}`, () => {
        const trunk = q("[data-bus-trunk]")[0] as HTMLElement;
        const drops = q("[data-bus-drop]") as HTMLElement[];
        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: {
            trigger: q("[data-bus]")[0],
            start: "top 80%",
            endTrigger: q("[data-fronts]")[0],
            end: "top 40%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.from(q("[data-bus-node]"), { scale: 0, duration: 0.15, ease: ease.out }, 0)
          .from(q("[data-bus-label]"), { opacity: 0, y: 8, duration: 0.2, ease: ease.out }, 0)
          .fromTo(trunk, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0.1);
        travel(tl, q("[data-bus-pulse]")[0], "x", () => trunk.offsetWidth, 0.1, 1);

        // The trunk reaches each column's left edge at 0, 1/2 and 1 of its length.
        q("[data-front]").forEach((front, index) => {
          const at = 0.1 + index * 0.5;
          const drop = drops[index];
          tl.fromTo(drop, { scaleY: 0 }, { scaleY: 1, duration: 0.3 }, at);
          // Pulses sit beside their trace, not inside it, so the trace's scale does not squash them.
          travel(tl, drop.parentElement!.querySelector("[data-pulse]")!, "y", () => drop.offsetHeight, at, 0.3);
          arrive(tl, front, at + 0.3);
        });
      });

      mm.add(`${media.motion} and (max-width: 1023.98px)`, () => {
        q("[data-front]").forEach((front) => {
          const segment = front.querySelector<HTMLElement>("[data-stack-segment]");
          const tl = gsap.timeline({
            defaults: { ease: ease.scrub },
            scrollTrigger: { trigger: front, start: "top 80%", end: `bottom+=${STACK_GAP} 80%`, scrub: 0.6, invalidateOnRefresh: true },
          });
          tl.fromTo(front.querySelector("[data-stack-stub]"), { scaleX: 0 }, { scaleX: 1, duration: 0.1 }, 0);
          arrive(tl, front, 0.1);
          // The trunk carries on to the next front while this one is read.
          if (segment) {
            tl.fromTo(segment, { scaleY: 0 }, { scaleY: 1, duration: 0.8 }, 0.2);
            travel(tl, front.querySelector("[data-pulse]")!, "y", () => segment.offsetHeight, 0.2, 0.8);
          }
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

        {/* The bus (lg): one trace from the method, dropping into each column's rule. Same grid as the fronts. */}
        <div aria-hidden data-bus className="relative mt-24 hidden h-28 lg:grid lg:grid-cols-3 lg:gap-x-6">
          <p data-bus-label className="absolute top-0 left-5 font-mono text-meta tracking-label text-muted uppercase">
            <span className="text-foreground">Method</span> — Explore → Understand → Build
          </p>
          {/* Ends at the third column's left edge: two columns and two gaps. */}
          <span data-bus-trunk className="absolute top-10 left-0 h-px w-[calc((200%+3rem)/3)] origin-left bg-line-strong" />
          <span data-bus-pulse className="absolute top-10 left-0 -mt-1 -ml-1 size-2 bg-accent opacity-0" />
          <span data-bus-node className="absolute top-10 left-0 -mt-1 -ml-1 size-2 bg-accent" />
          {fronts.map((front) => (
            <div key={front.title} className="relative">
              <span data-bus-drop className="absolute top-10 bottom-0 left-0 w-px origin-top bg-line-strong" />
              <span data-pulse className="absolute top-10 left-0 -mt-1 -ml-1 size-2 bg-accent opacity-0" />
            </div>
          ))}
        </div>

        {/* On large screens each front is a subgrid, so its rows line up across the three columns. Stacked, a trunk runs down the left. */}
        <ol data-fronts className="mt-16 grid gap-y-14 max-lg:pl-6 md:mt-24 lg:mt-0 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-0">
          {fronts.map((front, index) => (
            <li key={front.title} data-front className="relative pt-6 lg:row-span-4 lg:grid lg:grid-rows-subgrid">
              <span aria-hidden data-front-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <span aria-hidden data-stack-stub className="absolute top-0 right-full h-px w-6 origin-left bg-line-strong lg:hidden" />
              {index === 0 && <span aria-hidden className="absolute top-0 -left-6 -mt-1 -ml-1 size-2 bg-accent lg:hidden" />}
              {index < fronts.length - 1 && (
                <>
                  <span aria-hidden data-stack-segment className="absolute top-0 -left-6 h-[calc(100%+3.5rem)] w-px origin-top bg-line-strong lg:hidden" />
                  <span aria-hidden data-pulse className="absolute top-0 -left-6 -mt-1 -ml-1 size-2 bg-accent opacity-0 lg:hidden" />
                </>
              )}
              <div data-front-item className="flex items-center justify-between font-mono text-meta tracking-label uppercase">
                <span className="text-accent">F/{String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden className="relative size-2 rounded-[2px] bg-line-strong">
                  <span data-front-lamp className="absolute inset-0 rounded-[2px] bg-accent" />
                </span>
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
