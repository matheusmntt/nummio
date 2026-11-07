"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ElementType } from "react";
import { chapters, primaryNav } from "@/content/site";
import { duration, ease, gsap, media, ScrollTrigger, useGSAP } from "@/lib/motion";
import { BrandMark } from "./brand-mark";
import { MobileNav } from "./mobile-nav";
import { Magnetic } from "./motion/magnetic";
import { ThemeToggle } from "./theme-toggle";

/*
 * Site chrome: header, chapter readout, progress line and chapter rail share
 * one notion of the active chapter, tracked with a ScrollTrigger per chapter.
 */
export function SiteHeader() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(chapters[0].id);
  const chapter = chapters.find((item) => item.id === active) ?? chapters[0];
  // Chapters live on the homepage; elsewhere, links lead back into them.
  const onHome = usePathname() === "/";
  const base = onHome ? "" : "/";
  // In-page anchors glide through Lenis; other routes navigate client-side.
  const Anchor: ElementType = onHome ? "a" : Link;

  useGSAP(
    () => {
      const header = root.current?.querySelector<HTMLElement>("[data-header]");
      if (!header) return;

      for (const item of chapters) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          // Created before the chapters' pins exist: measure after them.
          refreshPriority: -1,
          onToggle: (self) => self.isActive && setActive(item.id),
        });
      }

      // Solid header once the page moves; hidden while reading downward.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          header.dataset.scrolled = String(y > 24);
          const hide = self.direction === 1 && y > window.innerHeight * 0.9;
          header.dataset.hidden = String(hide && !document.documentElement.hasAttribute("data-menu-open"));
        },
      });

      if (!onHome) return;

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        // Transforms are cleared so the header never becomes a containing block for the fixed menu.
        gsap.from(header, { yPercent: -100, duration: duration.reveal, ease: ease.out, delay: 0.5, clearProps: "transform" });
        gsap.from("[data-rail-tick]", { scaleX: 0, duration: duration.reveal, stagger: 0.05, delay: 1.2, ease: ease.out });
      });
    },
    // The header persists across routes: rebuild chapter tracking per page.
    { scope: root, dependencies: [onHome], revertOnUpdate: true },
  );

  // Slide the nav marker and roll the chapter readout when the chapter changes.
  useGSAP(
    () => {
      const marker = root.current?.querySelector<HTMLElement>("[data-nav-marker]");
      const link = root.current?.querySelector<HTMLElement>(`[data-nav-link="${active}"]`);
      if (marker) {
        if (link) {
          gsap.to(marker, { x: link.offsetLeft, width: link.offsetWidth, opacity: 1, duration: duration.ui, ease: ease.out });
        } else {
          gsap.to(marker, { opacity: 0, duration: duration.micro });
        }
      }
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        gsap.fromTo("[data-readout] > *", { yPercent: 100 }, { yPercent: 0, duration: duration.ui, stagger: 0.04, ease: ease.out });
      });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <div ref={root}>
      <header
        data-header
        data-scrolled="false"
        data-hidden="false"
        className="group/header fixed inset-x-0 top-0 z-(--nm-z-header) transition-[background-color,border-color,translate] duration-500 ease-(--ease-nm-out) data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-b data-[scrolled=true]:border-line data-[scrolled=true]:bg-header"
      >
        <div className="nm-wide relative flex h-16 items-center justify-between gap-6 md:h-18">
          <div className="flex items-center gap-8">
            <Anchor href={`${base}#top`} className="-m-2 inline-flex p-2" aria-label={onHome ? "Nummio, back to top" : "Nummio, home"}>
              <BrandMark label="" preload className="w-28 md:w-32" />
            </Anchor>
            <p
              hidden={!onHome}
              aria-live="polite"
              className="hidden overflow-hidden font-mono text-meta tracking-label text-muted uppercase lg:block"
            >
              <span className="sr-only">Current chapter: </span>
              <span data-readout className="flex gap-2">
                <span className="text-accent">{chapter.index}</span>
                <span aria-hidden>/</span>
                <span>{chapter.label}</span>
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <nav aria-label="Primary" className="relative hidden md:block">
              <ol className="flex items-center">
                {primaryNav.map((item, index) => {
                  const id = item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <Anchor
                        href={`${base}${item.href}`}
                        data-nav-link={id}
                        aria-current={active === id ? "true" : undefined}
                        className="group inline-flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-muted no-underline transition-colors hover:text-foreground aria-[current=true]:text-foreground"
                      >
                        <span className="font-mono text-meta text-subtle transition-colors group-hover:text-accent group-aria-[current=true]:text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </Anchor>
                    </li>
                  );
                })}
              </ol>
              <span
                aria-hidden
                data-nav-marker
                className="absolute bottom-1.5 left-0 h-px w-0 bg-accent opacity-0"
              />
            </nav>
            <Magnetic strength={0.25}>
              <ThemeToggle />
            </Magnetic>
            <MobileNav items={primaryNav} base={base} />
          </div>
        </div>
        <span aria-hidden data-progress className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent" />
      </header>

      {/* Chapter rail: the whole narrative at a glance, and a way to jump through it. */}
      <nav aria-label="Chapters" hidden={!onHome} className="fixed top-1/2 right-4 z-(--nm-z-header) hidden -translate-y-1/2 xl:block 2xl:right-6">
        <ol className="flex flex-col items-end gap-1">
          {chapters.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className="group flex h-6 items-center justify-end gap-3 no-underline"
              >
                {/*
                  Labels reveal on hover and focus only: the rail sits over the page's gutter, so a
                  standing label would cover content. The header readout names the current chapter.
                */}
                <span className="pointer-events-none translate-x-2 font-mono text-meta tracking-label whitespace-nowrap text-muted uppercase opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-aria-[current=true]:text-foreground">
                  {item.index} {item.label}
                </span>
                <span
                  data-rail-tick
                  className="block h-px w-3 origin-right bg-line-strong transition-[width,background-color] duration-500 ease-(--ease-nm-out) group-hover:w-5 group-hover:bg-foreground group-aria-[current=true]:w-7 group-aria-[current=true]:bg-accent"
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
