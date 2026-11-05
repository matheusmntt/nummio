"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ElementType } from "react";
import { chapters, site, type NavItem } from "@/content/site";
import { duration, ease, gsap, media, useGSAP } from "@/lib/motion";
import { getLenis } from "./motion/smooth-scroll";

/*
 * Full-screen menu for small viewports. Opens as a curtain from the header,
 * with links rising into place; the page behind is inert and holds still.
 */
export function MobileNav({ items, base = "" }: { items: readonly NavItem[]; base?: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const Anchor: ElementType = base ? Link : "a";

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        timeline.current = gsap
          .timeline({ paused: true, defaults: { ease: ease.out } })
          .set(panel, { visibility: "visible" })
          .fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: duration.ui + 0.15, ease: ease.inOut })
          .fromTo(panel.querySelectorAll("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, duration: duration.reveal, stagger: 0.05 }, 0.18)
          .fromTo(panel.querySelectorAll("[data-menu-meta]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: duration.ui }, 0.4);
        return () => {
          timeline.current = null;
        };
      });
    },
    { scope: panelRef },
  );

  useEffect(() => {
    const root = document.documentElement;
    const page = [document.getElementById("main"), document.querySelector("footer")];
    const panel = panelRef.current;
    const tl = timeline.current;

    if (open) {
      root.setAttribute("data-menu-open", "");
      page.forEach((el) => el && (el.inert = true));
      getLenis()?.stop();
      if (panel) {
        panel.hidden = false;
        // Visible before focusing: a hidden element cannot take focus.
        panel.style.visibility = "visible";
      }
      tl?.timeScale(1).play();
      panel?.querySelector<HTMLAnchorElement>("a")?.focus();
    } else {
      root.removeAttribute("data-menu-open");
      page.forEach((el) => el && (el.inert = false));
      getLenis()?.start();
      const hide = () => {
        if (panel) panel.hidden = true;
      };
      if (tl && tl.progress() > 0) tl.timeScale(1.6).reverse().then(hide);
      else hide();
    }

    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    // Close if the viewport grows past the breakpoint where the panel exists.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2.5 rounded-sm border border-line bg-background px-3.5 font-mono text-xs tracking-label text-foreground uppercase transition-colors hover:border-line-strong"
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden className="relative block h-2.5 w-3.5">
          <span
            className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
          />
        </span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden
        className="invisible fixed inset-0 -z-10 flex h-dvh flex-col bg-background pt-16 motion-reduce:visible"
      >
        <nav aria-label="Primary" className="nm-wide flex-1 overflow-y-auto pt-8">
          <ol>
            {items.map((item, index) => (
              <li key={item.href} className="overflow-hidden border-t border-line">
                <Anchor
                  href={`${base}${item.href}`}
                  data-menu-item
                  onClick={() => setOpen(false)}
                  className="flex min-h-20 items-center justify-between text-5xl font-semibold tracking-tightest text-foreground no-underline"
                >
                  {item.label}
                  <span className="font-mono text-xs font-normal tracking-normal text-accent">{String(index + 1).padStart(2, "0")}</span>
                </Anchor>
              </li>
            ))}
          </ol>
        </nav>
        <div data-menu-meta className="nm-wide grid grid-cols-2 gap-4 border-t border-line py-6 font-mono text-[0.6875rem] tracking-label text-subtle uppercase">
          <p>{site.tagline}</p>
          <p className="text-right">{chapters.length.toString().padStart(2, "0")} chapters · {site.domain}</p>
        </div>
      </div>
    </div>
  );
}
