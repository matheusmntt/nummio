"use client";

import { useRef, useState } from "react";
import type { ProjectFigure as FigureKind } from "@/content/projects";
import { duration, ease, gsap, media, useGSAP } from "@/lib/motion";

type Node = { x: number; y: number; r: number };

function random(seed: number) {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/* Nexus: ideas as nodes; following one reveals what it connects to. */
const graphNodes: Node[] = Array.from({ length: 15 }, (_, i) => {
  const ring = i === 0 ? 0 : i < 6 ? 1 : 2;
  const angle = (i / (ring === 1 ? 5 : 9)) * Math.PI * 2 + ring * 0.6 + random(i) * 0.5;
  const radius = ring === 0 ? 0 : ring === 1 ? 22 : 38 + random(i + 3) * 6;
  return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius * 0.82, r: ring === 0 ? 2.6 : ring === 1 ? 1.8 : 1.2 };
});
const graphEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 6], [1, 7], [2, 7], [2, 8], [3, 9], [3, 10], [4, 11], [4, 12], [5, 13], [5, 14],
  [6, 14], [8, 9], [10, 11], [12, 13], [1, 3], [2, 5],
];

/* Ion: one source, derived state, effects; a change propagates left to right. */
const signalNodes: Node[] = [
  { x: 12, y: 50, r: 2.6 },
  { x: 38, y: 26, r: 1.8 },
  { x: 38, y: 50, r: 1.8 },
  { x: 38, y: 74, r: 1.8 },
  { x: 64, y: 18, r: 1.4 },
  { x: 64, y: 40, r: 1.4 },
  { x: 64, y: 60, r: 1.4 },
  { x: 64, y: 82, r: 1.4 },
  { x: 88, y: 32, r: 1.2 },
  { x: 88, y: 68, r: 1.2 },
];
const signalEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7], [4, 8], [5, 8], [6, 9], [7, 9],
];

function curve(a: Node, b: Node, kind: FigureKind) {
  if (kind === "signal") {
    const mx = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

/**
 * Generative diagram for a project. It illustrates the idea behind the
 * project and is labelled as a diagram; it is not a product screenshot.
 */
export function ProjectFigure({ kind, caption }: { kind: FigureKind; caption: string }) {
  const root = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const nodes = kind === "graph" ? graphNodes : signalNodes;
  const edges = kind === "graph" ? graphEdges : signalEdges;
  const linked = (edge: [number, number]) => focus !== null && edge.includes(focus);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        const build = gsap
          .timeline({ paused: true, defaults: { ease: ease.out } })
          .from(q("[data-node]"), { scale: 0, transformOrigin: "50% 50%", duration: duration.ui, stagger: 0.03 }, 0)
          .from(q("[data-edge]"), { drawSVG: "0%", duration: duration.reveal, stagger: 0.025 }, 0.15);

        // A pulse travels the diagram while it is on screen.
        const pulses = gsap.timeline({ repeat: -1, repeatDelay: kind === "signal" ? 0.6 : 1.4, paused: true });
        q("[data-pulse]").forEach((pulse, i) => {
          const layer = Number(pulse.getAttribute("data-layer"));
          pulses.fromTo(
            pulse,
            { drawSVG: "0% 0%" },
            { drawSVG: "100% 100%", duration: 0.9, ease: "power1.inOut" },
            layer * 0.45 + (kind === "graph" ? i * 0.06 : 0),
          );
        });

        // Visibility, not scroll position: the figure may sit in a horizontal track.
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              build.play();
              pulses.play();
            } else {
              pulses.pause();
            }
          },
          { threshold: 0.35 },
        );
        if (root.current) observer.observe(root.current);
        return () => {
          observer.disconnect();
          pulses.kill();
          build.kill();
        };
      });
    },
    { scope: root },
  );

  const layerOf = (edge: [number, number]) =>
    kind === "signal" ? (edge[0] === 0 ? 0 : edge[0] <= 3 ? 1 : 2) : edge[0] === 0 ? 0 : edge[0] <= 5 ? 1 : 2;

  return (
    <figure ref={root} className="relative flex size-full flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="nm-corners inset-0 text-line-strong" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <g fill="none">
            {edges.map((edge, i) => (
              <path
                key={i}
                data-edge
                d={curve(nodes[edge[0]], nodes[edge[1]], kind)}
                stroke={linked(edge) ? "var(--nm-accent)" : "var(--nm-border-strong)"}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke] duration-200"
              />
            ))}
            {edges.map((edge, i) => (
              <path
                key={`p${i}`}
                data-pulse
                data-layer={layerOf(edge)}
                d={curve(nodes[edge[0]], nodes[edge[1]], kind)}
                stroke="var(--nm-accent)"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                className="motion-reduce:hidden"
                style={{ strokeDasharray: "0 1000" }}
              />
            ))}
          </g>
          {nodes.map((node, i) => (
            <g key={i} data-node onPointerEnter={() => setFocus(i)} onPointerLeave={() => setFocus(null)} className="cursor-crosshair">
              <circle cx={node.x} cy={node.y} r={6} fill="transparent" />
              <rect
                x={node.x - node.r}
                y={node.y - node.r}
                width={node.r * 2}
                height={node.r * 2}
                rx={0.3}
                fill={i === 0 || focus === i ? "var(--nm-accent)" : "var(--nm-fg)"}
                className="transition-[fill] duration-200"
              />
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[0.6875rem] tracking-label text-subtle uppercase">
        <span>{caption}</span>
        <span aria-hidden className="hidden shrink-0 pointer-fine:inline">Hover nodes</span>
      </figcaption>
    </figure>
  );
}
