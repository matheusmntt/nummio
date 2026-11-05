"use client";

import { useRef, type CSSProperties } from "react";
import { ease, gsap, media, useGSAP } from "@/lib/motion";

/*
 * Visual study 03, Constructed Forms, as a technical axonometric: a
 * board-formed volume with a deep square opening, its ground slab, grid
 * axes, hidden lines and dimension lines. Geometry is projected once at
 * module load, so the drawing is identical on server and client.
 */

type V3 = [x: number, y: number, z: number];

// Volume (x: width, y: height, z: depth) and the opening in its z = D face.
const W = 6.4;
const H = 3.8;
const D = 5.2;
const OPEN = { x0: 3.3, x1: 5.6, y0: 0.85, y1: 3.0, depth: 3.1 };
const SLAB = { x0: -2.8, x1: 2.6, z0: D, z1: D + 3.2, h: 0.18 };

const ANGLE = (28 * Math.PI) / 180;
const SCALE = 74;
const raw = ([x, y, z]: V3) => [(x - z) * Math.cos(ANGLE) * SCALE, ((x + z) * Math.sin(ANGLE) - y) * SCALE] as const;

// Every point the drawing uses, to fit the viewBox around them.
const extents: V3[] = [
  [-1.4, 0, -1.4],
  [W + 2.2, 0, -1.4],
  [-1.4, 0, D + 3.6],
  [W + 2.2, 0, D + 1.4],
  [0, H + 0.9, -0.9],
  [SLAB.x0, 0, SLAB.z1],
];
const xs = extents.map((p) => raw(p)[0]);
const ys = extents.map((p) => raw(p)[1]);
const PAD = 44;
const minX = Math.min(...xs) - PAD;
const minY = Math.min(...ys) - PAD;
const VIEW_W = Math.max(...xs) - minX + PAD;
const VIEW_H = Math.max(...ys) - minY + PAD;

const pt = (p: V3) => {
  const [x, y] = raw(p);
  return `${(x - minX).toFixed(1)} ${(y - minY).toFixed(1)}`;
};
const poly = (...points: V3[]) => `M ${points.map(pt).join(" L ")} Z`;
const line = (a: V3, b: V3) => `M ${pt(a)} L ${pt(b)}`;
const at = (p: V3) => {
  const [x, y] = raw(p);
  return { x: x - minX, y: y - minY };
};

const { x0, x1, y0, y1, depth } = OPEN;
const back = D - depth;

/** Where the opening sits in the drawing, for zooming into it (CSS %). */
export const openingFocus = (() => {
  const c = at([(x0 + x1) / 2, (y0 + y1) / 2, D - depth / 2]);
  return `${((c.x / VIEW_W) * 100).toFixed(1)}% ${((c.y / VIEW_H) * 100).toFixed(1)}%`;
})();

const faces = {
  top: poly([0, H, 0], [W, H, 0], [W, H, D], [0, H, D]),
  right: poly([W, 0, 0], [W, 0, D], [W, H, D], [W, H, 0]),
  // Front face with the opening cut out (even-odd fill).
  front: `${poly([0, 0, D], [W, 0, D], [W, H, D], [0, H, D])} ${poly([x0, y0, D], [x0, y1, D], [x1, y1, D], [x1, y0, D])}`,
  recessBack: poly([x0, y0, back], [x0, y1, back], [x1, y1, back], [x1, y0, back]),
  recessFloor: poly([x0, y0, D], [x1, y0, D], [x1, y0, back], [x0, y0, back]),
  recessWall: poly([x0, y0, D], [x0, y1, D], [x0, y1, back], [x0, y0, back]),
  slabTop: poly([SLAB.x0, SLAB.h, SLAB.z0], [SLAB.x1, SLAB.h, SLAB.z0], [SLAB.x1, SLAB.h, SLAB.z1], [SLAB.x0, SLAB.h, SLAB.z1]),
  slabFront: poly([SLAB.x0, 0, SLAB.z1], [SLAB.x1, 0, SLAB.z1], [SLAB.x1, SLAB.h, SLAB.z1], [SLAB.x0, SLAB.h, SLAB.z1]),
  slabSide: poly([SLAB.x1, 0, SLAB.z0], [SLAB.x1, 0, SLAB.z1], [SLAB.x1, SLAB.h, SLAB.z1], [SLAB.x1, SLAB.h, SLAB.z0]),
};

const edges = [
  line([0, 0, D], [W, 0, D]),
  line([W, 0, D], [W, 0, 0]),
  line([0, 0, D], [0, H, D]),
  line([W, 0, D], [W, H, D]),
  line([W, 0, 0], [W, H, 0]),
  line([0, H, D], [W, H, D]),
  line([W, H, D], [W, H, 0]),
  line([0, H, 0], [W, H, 0]),
  line([0, H, 0], [0, H, D]),
];

const hidden = [line([0, 0, 0], [W, 0, 0]), line([0, 0, 0], [0, 0, D]), line([0, 0, 0], [0, H, 0])];

const recessEdges = [
  line([x0, y1, D], [x0, y1, back]),
  line([x0, y0, D], [x0, y0, back]),
  line([x1, y0, D], [x1, y0, back]),
  line([x0, y1, back], [x0, y0, back]),
  line([x0, y0, back], [x1, y0, back]),
];

// Board-form joints on both visible walls, broken around the opening.
const joints: string[] = [];
for (let y = 0.475; y < H - 0.1; y += 0.475) {
  if (y > y0 && y < y1) {
    joints.push(line([0.04, y, D], [x0, y, D]), line([x1, y, D], [W - 0.04, y, D]));
  } else {
    joints.push(line([0.04, y, D], [W - 0.04, y, D]));
  }
  joints.push(line([W, y, D - 0.04], [W, y, 0.04]));
}

// Grid axes on the ground: A–C across the width, 1–3 across the depth.
const axes = [
  ...[0, W / 2, W].map((x, i) => ({ d: line([x, 0, -1.2], [x, 0, D + 1.2]), label: "ABC"[i], tag: at([x, 0, -1.4]) })),
  ...[0, D / 2, D].map((z, i) => ({ d: line([-1.2, 0, z], [W + 2, 0, z]), label: "123"[i], tag: at([W + 2.2, 0, z]) })),
];

// Dimension lines: width at roof level behind, depth and height off the right face.
const tick = (p: V3) => {
  const c = at(p);
  return `M ${(c.x - 6).toFixed(1)} ${(c.y + 6).toFixed(1)} L ${(c.x + 6).toFixed(1)} ${(c.y - 6).toFixed(1)}`;
};
const dims = [
  {
    d: [line([0, H, -0.7], [W, H, -0.7]), line([0, H, 0], [0, H, -0.9]), line([W, H, 0], [W, H, -0.9]), tick([0, H, -0.7]), tick([W, H, -0.7])],
    label: "W",
    tag: at([W / 2, H + 0.25, -0.7]),
  },
  {
    d: [line([W + 0.9, 0, 0], [W + 0.9, 0, D]), line([W, 0, 0], [W + 1.1, 0, 0]), line([W, 0, D], [W + 1.1, 0, D]), tick([W + 0.9, 0, 0]), tick([W + 0.9, 0, D])],
    label: "D",
    tag: at([W + 1.25, 0, D / 2]),
  },
  {
    d: [line([W + 0.9, 0, -0.01], [W + 0.9, H, -0.01]), line([W, H, 0], [W + 1.1, H, 0]), tick([W + 0.9, 0, 0]), tick([W + 0.9, H, 0])],
    label: "H",
    tag: at([W + 1.25, H / 2, 0]),
  },
];

const tone = (amount: number): CSSProperties => ({
  fill: `color-mix(in srgb, var(--draw-fg) ${amount}%, var(--draw-bg))`,
});

type ConstructedDrawingProps = {
  /** Build the drawing as it scrolls into view; otherwise render it complete. */
  animate?: boolean;
  className?: string;
  /** Override the colours the drawing is mixed from (defaults: page fg/bg). */
  style?: CSSProperties;
};

export function ConstructedDrawing({ animate = true, className, style }: ConstructedDrawingProps) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!animate) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        // Built in the order a structure goes up: grid, slab, frame, skin, opening, dimensions.
        const tl = gsap.timeline({
          defaults: { ease: ease.scrub },
          // Complete by the time its top reaches mid-screen, before any pin takes over.
          scrollTrigger: { trigger: root.current, start: "top 95%", end: "top 58%", scrub: 0.8 },
        });
        // Dashed lines fade in: drawing them would overwrite their dash pattern.
        tl.fromTo(q("[data-d=axis]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.05 }, 0)
          .fromTo(q("[data-d=tag]"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.2, stagger: 0.03 }, 0.3)
          .fromTo(q("[data-d=slab]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45)
          .fromTo(q("[data-d=hidden]"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.55)
          .fromTo(q("[data-d=edge]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, stagger: 0.04 }, 0.6)
          .fromTo(q("[data-d=face]"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06 }, 1.0)
          .fromTo(q("[data-d=joint]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, stagger: 0.01 }, 1.25)
          .fromTo(q("[data-d=signal]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4 }, 1.4)
          .fromTo(q("[data-d=dim]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, stagger: 0.02 }, 1.55)
          .fromTo(q("[data-d=dimtag]"), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.05 }, 1.8);
      });
    },
    { scope: root, dependencies: [animate] },
  );

  const stroke = "var(--draw-fg)";

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${VIEW_W.toFixed(0)} ${VIEW_H.toFixed(0)}`}
      className={className}
      style={{ "--draw-fg": "var(--nm-fg)", "--draw-bg": "var(--nm-bg)", "--draw-accent": "var(--nm-accent)", ...style } as CSSProperties}
      aria-hidden
    >
      <g fill="none" strokeLinecap="square">
        {axes.map((axis) => (
          <path key={axis.label} data-d="axis" d={axis.d} stroke={stroke} strokeOpacity={0.22} strokeDasharray="10 6 2 6" vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {axes.map((axis) => (
        <g key={axis.label} data-d="tag">
          <circle cx={axis.tag.x} cy={axis.tag.y} r={19} fill="none" stroke={stroke} strokeOpacity={0.45} vectorEffect="non-scaling-stroke" />
          <text x={axis.tag.x} y={axis.tag.y} textAnchor="middle" dominantBaseline="central" fontSize={19} fill={stroke} fillOpacity={0.75} className="font-mono">
            {axis.label}
          </text>
        </g>
      ))}

      <g data-d="slab" stroke={stroke} strokeOpacity={0.55}>
        <path d={faces.slabTop} style={tone(9)} vectorEffect="non-scaling-stroke" />
        <path d={faces.slabFront} style={tone(4)} vectorEffect="non-scaling-stroke" />
        <path d={faces.slabSide} style={tone(2)} vectorEffect="non-scaling-stroke" />
      </g>

      <g fill="none" stroke={stroke} strokeOpacity={0.35} strokeDasharray="5 5">
        {hidden.map((d) => (
          <path key={d} data-d="hidden" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* Recess first: the front face, drawn after, occludes what lies outside the opening. */}
      <g data-d="face">
        <path d={faces.recessBack} style={tone(1)} />
        <path d={faces.recessFloor} style={tone(10)} />
        <path d={faces.recessWall} style={tone(5)} />
      </g>
      <g fill="none" stroke={stroke} strokeOpacity={0.6}>
        {recessEdges.map((d) => (
          <path key={d} data-d="edge" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g data-d="face">
        <path d={faces.top} style={tone(13)} />
        <path d={faces.front} fillRule="evenodd" style={tone(7)} />
        <path d={faces.right} style={tone(3)} />
      </g>

      <g fill="none" stroke={stroke} strokeOpacity={0.16}>
        {joints.map((d) => (
          <path key={d} data-d="joint" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill="none" stroke={stroke} strokeOpacity={0.9} strokeWidth={1.25}>
        {edges.map((d) => (
          <path key={d} data-d="edge" d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <path
        data-d="signal"
        d={poly([x0, y0, D], [x0, y1, D], [x1, y1, D], [x1, y0, D])}
        fill="none"
        stroke="var(--draw-accent)"
        strokeWidth={1.75}
        vectorEffect="non-scaling-stroke"
      />

      <g fill="none" stroke={stroke} strokeOpacity={0.55}>
        {dims.flatMap((dim) => dim.d.map((d) => <path key={`${dim.label}${d}`} data-d="dim" d={d} vectorEffect="non-scaling-stroke" />))}
      </g>
      {dims.map((dim) => (
        <text
          key={dim.label}
          data-d="dimtag"
          x={dim.tag.x}
          y={dim.tag.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={21}
          fill={stroke}
          fillOpacity={0.8}
          className="font-mono"
        >
          {dim.label}
        </text>
      ))}
    </svg>
  );
}
