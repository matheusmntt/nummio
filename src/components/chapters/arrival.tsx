"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { art, crops } from "@/lib/art";
import { duration, ease, gsap, media, useGSAP } from "@/lib/motion";
import { Magnetic } from "../motion/magnetic";
import { PointField, type FieldState } from "./point-field";

const method = ["Explore", "Understand", "Build"] as const;

/*
 * Chapter 01. A live point field (Computational Forms) under poster-scale
 * type. The opening sequence unfurls the field and lifts the headline; on
 * scroll the headline parts and the camera travels through the field into
 * the darkness where Chapter 02 opens.
 */
export function Arrival() {
  const root = useRef<HTMLElement>(null);
  const [field] = useState<FieldState>(() => ({ intro: 0, scroll: 0 }));
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(media.motion, () => {
        const state = field;
        state.intro = 0;

        const intro = gsap.timeline({ defaults: { ease: ease.out } });
        intro
          .fromTo(q("[data-rail]"), { scaleY: 0 }, { scaleY: 1, duration: duration.cinematic, stagger: 0.04, ease: ease.inOut }, 0)
          .to(state, { intro: 1, duration: 2.6, ease: "power2.inOut" }, 0.1)
          .fromTo(
            q("[data-headline-line]"),
            { yPercent: 108, autoAlpha: 1 },
            { yPercent: 0, autoAlpha: 1, duration: duration.cinematic, stagger: 0.14 },
            0.35,
          )
          .fromTo(q("[data-intro-meta]"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: duration.reveal, stagger: 0.06 }, 0.8)
          .fromTo(q("[data-intro-copy]"), { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: duration.reveal, stagger: 0.08 }, 1.0);

        // Scroll: the headline parts, the field is crossed, the frame goes dark.
        const out = gsap.timeline({
          defaults: { ease: ease.scrub },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });
        out
          .to(state, { scroll: 1, duration: 1 }, 0)
          .to(q("[data-part='left']"), { xPercent: -18, duration: 0.8 }, 0)
          .to(q("[data-part='right']"), { xPercent: 14, duration: 0.8 }, 0)
          .to(q("[data-headline]"), { opacity: 0, duration: 0.35 }, 0.45)
          .to(q("[data-fade-early]"), { opacity: 0, y: -24, duration: 0.3, stagger: 0.02 }, 0)
          .to(q("[data-rail]"), { yPercent: -12, opacity: 0, duration: 0.7, stagger: 0.01 }, 0.1)
          .fromTo(q("[data-veil]"), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.65);
      });

      // Live pointer reading in the field's own coordinates.
      mm.add(`${media.fine}`, () => {
        const el = readout.current;
        const stage = root.current?.querySelector<HTMLElement>("[data-stage]");
        if (!el || !stage || !contextSafe) return;
        const fmt = (v: number) => (v < 0 ? "−" : "+") + Math.abs(v).toFixed(3);
        const onMove = contextSafe((event: PointerEvent) => {
          const box = stage.getBoundingClientRect();
          const x = ((event.clientX - box.left) / box.width) * 2 - 1;
          const y = -(((event.clientY - box.top) / box.height) * 2 - 1);
          el.textContent = `x ${fmt(x)}  y ${fmt(y)}`;
        });
        stage.addEventListener("pointermove", onMove);
        return () => stage.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      tabIndex={-1}
      aria-labelledby="hero-title"
      data-chapter="01"
      className="nm-track [--track:200svh]"
    >
      <div data-stage className="nm-stage isolate">
        {/* Field, with the static study as a fallback where WebGL is unavailable. */}
        <div className="group/field absolute inset-0 -z-10">
          <Image
            src={crops.computationalWide}
            alt=""
            fill
            sizes="100vw"
            className="hidden object-cover opacity-70 group-data-[gl=off]/field:block"
          />
          <PointField state={field} className="absolute inset-0 size-full" />
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-linear-to-t from-background via-background/70 to-transparent" />

        <div aria-hidden className="nm-wide absolute inset-y-0 left-0 right-0 -z-10 [--rails:4] md:[--rails:12]">
          <div className="nm-rails">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} data-rail className={i >= 4 ? "max-md:hidden" : undefined} />
            ))}
          </div>
        </div>

        <div className="nm-wide relative flex h-full flex-col pt-24 pb-6 md:pt-28 md:pb-8">
          {/* Instrument strip */}
          <div data-fade-early className="grid grid-cols-2 gap-6 font-mono text-meta tracking-label text-muted uppercase md:grid-cols-12">
            <p data-intro data-intro-meta className="md:col-span-3">
              <span className="text-accent">N/01</span> — Arrival
            </p>
            <p data-intro data-intro-meta className="max-md:text-right md:col-span-3">
              {site.descriptor}
            </p>
            <p data-intro data-intro-meta aria-hidden className="hidden tabular-nums md:col-span-3 md:block">
              Field — {art.computational.title}
            </p>
            <p data-intro data-intro-meta aria-hidden className="hidden text-right tabular-nums pointer-fine:md:block md:col-span-3">
              <span ref={readout}>x +0.000  y +0.000</span>
            </p>
          </div>

          <div className="mt-auto">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div data-fade-early className="relative before:pointer-events-none before:absolute before:-inset-x-16 before:-inset-y-12 before:-z-10 before:bg-[radial-gradient(closest-side,var(--nm-bg)_45%,transparent)] md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
                <p data-intro data-intro-copy className="max-w-sm text-base text-muted md:text-lg">
                  Nummio is an independent lab for software and applied research. We follow questions until they become
                  models, and models until they become tools.
                </p>
                <div data-intro data-intro-copy className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Magnetic>
                    <a href="#projects" className="nm-button nm-button--primary group">
                      Explore projects
                      <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8h9M8.5 4 12.5 8l-4 4" />
                      </svg>
                    </a>
                  </Magnetic>
                  <a href="#approach" className="nm-link inline-flex min-h-11 items-center font-medium text-foreground">
                    Our approach
                  </a>
                </div>
              </div>
            </div>

            <h1 id="hero-title" data-headline className="mt-8 text-[15vw] leading-[0.86] font-semibold tracking-[-0.055em] md:mt-4 md:text-poster">
              <span className="block overflow-y-clip pb-[0.06em]">
                <span data-part="left" className="block">
                  <span data-intro data-headline-line className="block">
                    Curiosity,
                  </span>
                </span>
              </span>
              <span className="-mt-[0.06em] block overflow-y-clip pb-[0.08em] md:text-right">
                <span data-part="right" className="block">
                  <span data-intro data-headline-line className="block text-accent">
                    engineered<span className="text-foreground">.</span>
                  </span>
                </span>
              </span>
            </h1>

            <div data-fade-early className="mt-4 flex items-center justify-between gap-6 border-t border-line pt-4 font-mono text-meta tracking-label text-subtle uppercase md:mt-6">
              <ol aria-label="Method" data-intro data-intro-meta className="flex gap-4 md:gap-8">
                {method.map((step, index) => (
                  <li key={step}>
                    <span className="text-muted">{String(index + 1).padStart(2, "0")}</span> {step}
                  </li>
                ))}
              </ol>
              <p data-intro data-intro-meta aria-hidden className="flex items-center gap-3">
                Scroll
                <span className="relative block h-px w-10 overflow-hidden bg-line md:w-16">
                  <span className="absolute inset-0 origin-left bg-accent motion-safe:animate-[nm-scan_2.4s_var(--ease-nm-out)_4]" />
                </span>
              </p>
            </div>
          </div>
        </div>

        <div aria-hidden data-veil className="pointer-events-none absolute inset-0 bg-background opacity-0" />
      </div>
    </section>
  );
}
