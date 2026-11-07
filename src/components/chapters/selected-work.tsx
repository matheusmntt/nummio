"use client";

import { useRef } from "react";
import { projects } from "@/content/projects";
import { art } from "@/lib/art";
import { ease, gsap, media, ScrollTrigger, useGSAP } from "@/lib/motion";
import { ConstructedDrawing, openingFocus } from "../constructed-drawing";
import { ProjectFigure } from "./project-figure";
import { FigureCaption } from "../figure-caption";

const drawingAlt =
  "Axonometric drawing of a board-formed concrete volume with a deep square opening, on a ground slab, with grid axes and dimension lines.";

/*
 * Chapter 04. Constructed Forms. On large screens the chapter becomes a
 * horizontal gallery: the vertical scroll drives a track of project
 * showcases, with images and titles moving at their own depths. Smaller
 * screens and reduced motion get the same content as a vertical sequence.
 */
export function SelectedWork() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(`${media.motion} and ${media.desktop}`, () => {
        const stage = q("[data-work-stage]")[0] as HTMLElement;
        const track = q("[data-work-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });

        // The first panel is on screen before the track moves, so it reveals on the vertical approach.
        q("[data-reveal-panel]").forEach((panel, index) => {
          gsap.from(panel.querySelectorAll("[data-panel-item]"), {
            y: 40,
            opacity: 0,
            stagger: 0.07,
            ease: ease.out,
            scrollTrigger:
              index === 0
                ? { trigger: stage, start: "top 65%", toggleActions: "play none none reverse" }
                : { trigger: panel, containerAnimation: scroll, start: "left 75%", toggleActions: "play none none reverse" },
          });
        });

        const titles = q("[data-title-skew]");
        const skewTo = gsap.quickTo(titles, "skewX", { duration: 0.6, ease: "power3.out" });
        ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: () => `+=${distance()}`,
          onUpdate: (self) => skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -400)),
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        });

        // Into the opening of the drawn volume: its interior fills the frame.
        gsap.fromTo(q("[data-opening]"), { scale: 1 }, {
          scale: 3.2,
          ease: "power2.in",
          scrollTrigger: { trigger: q("[data-opening]")[0], containerAnimation: scroll, start: "left 70%", end: "right right", scrub: true },
        });
      });

      mm.add(`${media.motion} and (max-width: 1023.98px)`, () => {
        q("[data-reveal-panel]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-panel-item]"), {
            y: 36,
            opacity: 0,
            stagger: 0.08,
            ease: ease.out,
            scrollTrigger: { trigger: panel, start: "top 80%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" tabIndex={-1} aria-labelledby="projects-title" data-chapter="04" className="relative">
      <div data-work-stage className="lg:motion-safe:h-svh lg:motion-safe:overflow-hidden">
        <div data-work-track className="flex flex-col lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-stretch">
          {/* Intro panel */}
          <div data-reveal-panel className="nm-wide relative flex flex-col gap-10 py-24 lg:motion-safe:w-[88vw] lg:motion-safe:flex-row lg:motion-safe:items-end lg:motion-safe:gap-16 lg:motion-safe:pt-28 lg:motion-safe:pr-[6vw] lg:motion-safe:pb-14 lg:motion-safe:pl-(--nm-gutter) lg:motion-safe:[margin-inline:0]">
            <div className="lg:motion-safe:w-[36vw] lg:motion-safe:shrink-0">
              <p data-panel-item className="font-mono text-meta tracking-label text-muted uppercase">
                <span className="text-accent">N/04</span> — Selected work
              </p>
              <h2 id="projects-title" data-panel-item className="mt-6 text-statement font-semibold text-balance">
                Tools and experiments from the lab.
              </h2>
              <p data-panel-item className="mt-6 max-w-md text-lg text-muted">
                Every project begins as a question. Some grow into tools, some remain experiments. Both are part of the
                work.
              </p>
              <dl data-panel-item className="mt-10 grid max-w-md grid-cols-2 border-t border-line pt-4 font-mono text-xs">
                <dt className="tracking-label text-subtle uppercase">Listed</dt>
                <dd className="text-right text-foreground">{String(projects.length).padStart(2, "0")}</dd>
              </dl>
            </div>
            {/* A technical sheet: the study drawn as an axonometric, built as it scrolls in. */}
            <figure data-panel-item className="relative flex flex-col lg:motion-safe:flex-1">
              <div className="relative aspect-square w-full sm:aspect-[4/3]">
                <div aria-hidden className="nm-corners inset-0 text-line-strong" />
                <ConstructedDrawing className="absolute inset-3 size-[calc(100%-1.5rem)] md:inset-5 md:size-[calc(100%-2.5rem)]" />
                <span className="sr-only">{drawingAlt}</span>
              </div>
              <FigureCaption>
                <span className="text-accent">Fig. 04 — {art.constructed.title}</span>
                <span className="max-sm:hidden">Axonometric</span>
              </FigureCaption>
            </figure>
          </div>

          {/* Project showcases */}
          {projects.map((project, index) => {
            const titleId = `${project.slug}-title`;
            const links = project.links ?? [];
            return (
              <article
                key={project.slug}
                id={project.slug}
                aria-labelledby={titleId}
                data-reveal-panel
                className="nm-wide relative flex flex-col border-t border-line py-20 lg:motion-safe:w-screen lg:motion-safe:flex-row lg:motion-safe:gap-[5vw] lg:motion-safe:border-t-0 lg:motion-safe:border-l lg:motion-safe:px-[5vw] lg:motion-safe:pt-28 lg:motion-safe:pb-14 lg:motion-safe:[margin-inline:0]"
              >
                <div className="flex flex-col lg:motion-safe:w-[46vw] lg:motion-safe:shrink-0">
                  <div data-panel-item className="flex items-center justify-between font-mono text-meta tracking-label uppercase">
                    <span className="text-accent">P/{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-muted">{project.kind}</span>
                  </div>
                  <h3 id={titleId} className="mt-8 lg:motion-safe:mt-auto">
                    <span data-title-skew data-panel-item className="block origin-bottom-left text-[clamp(3.25rem,9vw,10.5rem)] leading-[0.88] font-semibold tracking-[-0.055em] text-balance">
                      {project.name}
                    </span>
                  </h3>
                  <p data-panel-item className="mt-6 max-w-lg text-lg text-muted lg:motion-safe:text-xl">
                    {project.summary}
                  </p>
                  <div data-panel-item className="mt-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 border-t border-line pt-5 font-mono text-xs">
                    <span className="tracking-label text-subtle uppercase">Focus</span>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-foreground">
                      {project.focus.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                    <span className="tracking-label text-subtle uppercase">Status</span>
                    {links.length > 0 ? (
                      <ul className="flex flex-wrap gap-x-6">
                        {links.map((link) => (
                          <li key={link.href}>
                            <a href={link.href} className="nm-link font-medium text-foreground">
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">No public link listed · A Nummio project</span>
                    )}
                  </div>
                </div>
                <div data-panel-item className="mt-12 aspect-square w-full lg:motion-safe:mt-0 lg:motion-safe:aspect-auto lg:motion-safe:flex-1 lg:motion-reduce:aspect-[16/9]">
                  <ProjectFigure kind={project.figure} caption={project.figureCaption} />
                </div>
              </article>
            );
          })}

          {/* Outro: into the opening of the constructed form */}
          <div data-reveal-panel className="nm-wide relative flex flex-col gap-8 border-t border-line py-20 lg:motion-safe:w-[72vw] lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-12 lg:motion-safe:border-t-0 lg:motion-safe:border-l lg:motion-safe:pr-(--nm-gutter) lg:motion-safe:pl-[5vw] lg:motion-safe:[margin-inline:0]">
            <p data-panel-item className="max-w-sm text-2xl font-medium tracking-snug text-balance lg:motion-safe:w-[24vw] lg:motion-safe:shrink-0 lg:motion-safe:text-3xl">
              From model to tool. Constructed Forms is the lab&rsquo;s language for engineering: structure, constraint
              and material.
            </p>
            <div data-panel-item aria-hidden className="relative aspect-square flex-1 overflow-hidden sm:aspect-[4/3]">
              <div data-opening className="absolute inset-6" style={{ transformOrigin: openingFocus }}>
                <ConstructedDrawing animate={false} className="size-full" />
              </div>
              <div className="nm-corners inset-0 text-line-strong" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
