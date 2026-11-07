"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { researchLines } from "@/content/research";
import { art, artQuality, crops, type ArtKey } from "@/lib/art";
import { duration, ease, gsap, media, ScrollTrigger, useGSAP } from "@/lib/motion";
import { RevealText } from "../motion/reveal-text";
import { Scramble } from "../motion/scramble";
import { ConstructedDrawing } from "../constructed-drawing";
import { PlateInstrument } from "../plate-instrument";
import { FigureCaption } from "../figure-caption";

// Constructed Forms is a drawing rather than a picture; the others are images.
const plates: Record<Exclude<ArtKey, "constructed">, { src: StaticImageData; focus: string }> = {
  classical: { src: crops.classicalTall, focus: "object-[60%_22%]" },
  computational: { src: crops.computationalPortrait, focus: "object-center" },
};

/** The drawing in negative: plate-coloured lines on the dark plate. */
const plateDrawing = {
  "--draw-fg": "var(--nm-plate-fg)",
  "--draw-bg": "var(--nm-plate-bg)",
  "--draw-accent": "var(--nm-plate-accent)",
} as CSSProperties;

/*
 * Chapter 05. A research index, read like a catalogue: three lines of
 * enquiry beside a specimen plate. The plate follows whichever line is
 * active (hovered, focused or centred on screen) and wipes between studies.
 */
export function Research() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const line = researchLines[active];

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      q("[data-line]").forEach((row, index) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(index),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.from(q("[data-line]"), {
          y: 48,
          opacity: 0,
          stagger: 0.1,
          ease: ease.out,
          duration: duration.reveal,
          scrollTrigger: { trigger: q("[data-index]")[0], start: "top 80%", once: true },
        });
        gsap.fromTo(
          q("[data-plate]"),
          { clipPath: "inset(12% 12% 12% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-plate]")[0], start: "top 95%", end: "top 40%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  // Wipe the newly active study over the previous one.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const layer = q(`[data-plate-layer="${active}"]`)[0] as HTMLElement | undefined;
      if (!layer) return;
      q("[data-plate-layer]").forEach((el) => ((el as HTMLElement).style.zIndex = el === layer ? "2" : "1"));
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: duration.reveal, ease: ease.inOut });
        gsap.fromTo(layer.firstElementChild, { scale: 1.18 }, { scale: 1, duration: duration.cinematic, ease: ease.out });
      });
      mm.add(media.reduce, () => {
        gsap.set(layer, { clipPath: "inset(0% 0% 0% 0%)" });
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: false },
  );

  return (
    <section
      ref={root}
      id="research"
      tabIndex={-1}
      aria-labelledby="research-title"
      data-chapter="05"
      className="relative border-t border-line py-24 md:py-36"
    >
      <div className="nm-wide">
        <header className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-6">
          <p className="font-mono text-meta tracking-label text-muted uppercase lg:col-span-12">
            <span className="text-research">N/05</span> — Research &amp; experiments
          </p>
          <RevealText as="h2" id="research-title" className="text-statement font-semibold text-balance lg:col-span-8">
            Three ways of looking at the same problem.
          </RevealText>
          <p className="max-w-md text-lg text-muted lg:col-span-4 lg:self-end">
            Research at Nummio runs along three lines. They are lenses rather than departments, and most work passes
            through all of them.
          </p>
        </header>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-x-6">
          <ol data-index className="lg:col-span-6">
            {researchLines.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item.art}
                  data-line
                  className="border-t border-line last:border-b"
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="research-plate"
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group grid w-full grid-cols-[3rem_1fr] items-baseline gap-x-4 py-7 text-left md:grid-cols-[4.5rem_1fr] md:py-9"
                  >
                    <span className={`font-mono text-xs transition-colors ${isActive ? "text-research" : "text-subtle"}`}>
                      R/{String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span
                        className={`block text-3xl font-semibold tracking-tightest transition-[color,translate] duration-500 ease-(--ease-nm-out) md:text-5xl ${
                          isActive ? "translate-x-2 text-foreground" : "text-subtle group-hover:text-muted"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="mt-3 block font-mono text-meta tracking-label text-subtle uppercase">
                        {item.axes.join(" / ")}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-(--ease-nm-out) ${
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-md pt-4 text-muted">{item.summary}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:col-span-6">
            <figure id="research-plate" className="lg:sticky lg:top-24">
              <div data-plate className="relative aspect-[4/5] overflow-hidden bg-plate text-plate-foreground lg:aspect-auto lg:h-[min(74svh,46rem)]">
                {researchLines.map((item, index) => (
                  <div
                    key={item.art}
                    data-plate-layer={index}
                    className="absolute inset-0 overflow-hidden"
                    style={{ zIndex: index === 0 ? 2 : 1 }}
                  >
                    <div className="absolute inset-0 bg-plate">
                      {item.art === "constructed" ? (
                        <>
                          <ConstructedDrawing animate={false} style={plateDrawing} className="absolute inset-[5%] size-[90%]" />
                          <span className="sr-only">{index === active ? art.constructed.alt : ""}</span>
                        </>
                      ) : (
                        <Image
                          src={plates[item.art].src}
                          alt={index === active ? art[item.art].alt : ""}
                          fill
                          placeholder="blur"
                          quality={artQuality}
                          sizes="(min-width: 1024px) 45vw, 100vw"
                          className={`object-cover ${plates[item.art].focus}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 z-3 flex flex-col justify-between p-4 font-mono text-meta tracking-label uppercase md:p-5">
                  <div className="flex justify-between gap-4">
                    <span className="bg-plate-scrim px-1.5 py-0.5 text-plate-research">
                      <Scramble text={`R/${String(active + 1).padStart(2, "0")} — ${line.title}`} live />
                    </span>
                    <span className="hidden bg-plate-scrim px-1.5 py-0.5 text-plate-muted sm:inline">{art[line.art].study}</span>
                  </div>
                </div>
                <div className="nm-corners inset-3 z-3 text-plate-line md:inset-4" />
                <div className="absolute inset-0 z-4">
                  <PlateInstrument />
                </div>
              </div>
              <FigureCaption>
                <span>{line.axes.join(" / ")}</span>
                <span>Specimen {String(active + 1).padStart(2, "0")} / 03</span>
              </FigureCaption>
            </figure>
          </div>
        </div>

        <div className="mt-20 grid gap-4 border-t border-line pt-6 font-mono text-xs text-subtle md:mt-28 md:grid-cols-2">
          <p>Nummio Research is the editorial line for this work.</p>
          <p className="md:text-right">
            Images are Nummio visual studies, generated and rendered for the lab. They do not depict or document real
            artworks, objects or buildings.
          </p>
        </div>
      </div>
    </section>
  );
}
