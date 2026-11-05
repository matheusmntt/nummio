"use client";

import { useEffect, useRef } from "react";
import { media } from "@/lib/motion";

/** 0 = scatter (Explore), 1 = lattice (Understand), 2 = structure (Build). */
export type MethodState = { progress: number };

const N = 216;
const PLANE = { cols: 18, rows: 12 };
const CUBE = 6;

function random(seed: number) {
  const x = Math.sin(seed * 91.345) * 47453.5453;
  return x - Math.floor(x);
}

type Vec = [number, number, number];

/*
 * The method as one set of 216 points: a loose cloud of observations, a
 * measured lattice, then a built structure. The same points travel between
 * states, so each step visibly grows out of the one before it.
 */
function buildStates() {
  const scatter: Vec[] = [];
  const plane: Vec[] = [];
  const cube: Vec[] = [];
  for (let i = 0; i < N; i++) {
    const u = random(i + 1) * Math.PI * 2;
    const v = Math.acos(2 * random(i + 300) - 1);
    const r = 0.55 + 0.75 * Math.cbrt(random(i + 600));
    scatter.push([r * Math.sin(v) * Math.cos(u), r * Math.cos(v) * 0.8, r * Math.sin(v) * Math.sin(u)]);

    const c = i % PLANE.cols;
    const row = Math.floor(i / PLANE.cols);
    plane.push([(c / (PLANE.cols - 1) - 0.5) * 2.6, 0, (row / (PLANE.rows - 1) - 0.5) * 1.7]);

    const a = i % CUBE;
    const b = Math.floor(i / CUBE) % CUBE;
    const d = Math.floor(i / (CUBE * CUBE));
    const s = 1.25;
    cube.push([(a / (CUBE - 1) - 0.5) * s, (b / (CUBE - 1) - 0.5) * s, (d / (CUBE - 1) - 0.5) * s]);
  }

  const planeLinks: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const c = i % PLANE.cols;
    if (c < PLANE.cols - 1) planeLinks.push([i, i + 1]);
    if (i + PLANE.cols < N) planeLinks.push([i, i + PLANE.cols]);
  }

  // Cube: strong edges where a link lies on two boundary faces, faint on one.
  const edgeLinks: [number, number][] = [];
  const faceLinks: [number, number][] = [];
  const index = (a: number, b: number, d: number) => a + b * CUBE + d * CUBE * CUBE;
  const edge = (n: number) => n === 0 || n === CUBE - 1;
  for (let d = 0; d < CUBE; d++)
    for (let b = 0; b < CUBE; b++)
      for (let a = 0; a < CUBE; a++) {
        const from = index(a, b, d);
        const steps: [number, number, number, boolean, boolean][] = [
          [a + 1, b, d, edge(b), edge(d)],
          [a, b + 1, d, edge(a), edge(d)],
          [a, b, d + 1, edge(a), edge(b)],
        ];
        for (const [na, nb, nd, e1, e2] of steps) {
          if (na >= CUBE || nb >= CUBE || nd >= CUBE) continue;
          const pair: [number, number] = [from, index(na, nb, nd)];
          if (e1 && e2) edgeLinks.push(pair);
          else if (e1 || e2) faceLinks.push(pair);
        }
      }

  // The Nummio block: the structure's top corner, in signal.
  const signal = index(CUBE - 1, CUBE - 1, 0);
  const delays = Array.from({ length: N }, (_, i) => random(i + 900) * 0.4);
  return { scatter, plane, cube, planeLinks, edgeLinks, faceLinks, signal, delays };
}

const states = buildStates();

function ease(x: number, delay: number) {
  const t = Math.min(1, Math.max(0, (x - delay) / (1 - 0.4)));
  return t * t * (3 - 2 * t);
}

function readColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#F2F1ED";
}

export function MethodFigure({ state, className }: { state: MethodState; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(media.reduce);
    let colors = { ink: readColor("--nm-fg"), line: readColor("--nm-border-strong"), signal: readColor("--nm-accent") };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let time = 0;
    let last = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const projected = new Float32Array(N * 3);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas!.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
    }

    function draw() {
      const p = reduce.matches ? 1 : state.progress;
      const e1Base = Math.min(1, Math.max(0, p));
      const e2Base = Math.min(1, Math.max(0, p - 1));
      const yaw = 0.62 + time * 0.08 + pointer.x * 0.35;
      const pitch = 0.5 - e1Base * 0.12 + e2Base * 0.08 + pointer.y * 0.15;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const scale = Math.min(width, height) * 0.36;

      for (let i = 0; i < N; i++) {
        const delay = states.delays[i];
        const e1 = ease(e1Base, delay);
        const e2 = ease(e2Base, delay);
        const a = states.scatter[i];
        const b = states.plane[i];
        const c = states.cube[i];
        // Unsettled observations drift; measured ones hold still.
        const drift = (1 - e1) * 0.06;
        let x = a[0] + Math.sin(time * 0.7 + i) * drift;
        let y = a[1] + Math.cos(time * 0.6 + i * 1.3) * drift;
        let z = a[2];
        x += (b[0] - x) * e1;
        y += (b[1] - y) * e1;
        z += (b[2] - z) * e1;
        x += (c[0] - x) * e2;
        y += (c[1] - y) * e2;
        z += (c[2] - z) * e2;

        const rx = x * cy - z * sy;
        const rz = x * sy + z * cy;
        const ry = y * cp - rz * sp;
        const depth = y * sp + rz * cp + 4;
        const f = 4 / depth;
        projected[i * 3] = width / 2 + rx * scale * f;
        projected[i * 3 + 1] = height / 2 - ry * scale * f;
        projected[i * 3 + 2] = f;
      }

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;

      const links = (pairs: [number, number][], alpha: number, color: string) => {
        if (alpha <= 0.01) return;
        ctx!.globalAlpha = alpha;
        ctx!.strokeStyle = color;
        ctx!.beginPath();
        for (const [from, to] of pairs) {
          ctx!.moveTo(projected[from * 3], projected[from * 3 + 1]);
          ctx!.lineTo(projected[to * 3], projected[to * 3 + 1]);
        }
        ctx!.stroke();
      };

      links(states.planeLinks, 0.55 * e1Base * (1 - e2Base), colors.line);
      links(states.faceLinks, 0.35 * e2Base, colors.line);
      links(states.edgeLinks, 0.9 * e2Base, colors.ink);

      ctx!.fillStyle = colors.ink;
      for (let i = 0; i < N; i++) {
        const f = projected[i * 3 + 2];
        const size = 1.6 * f + 0.4;
        ctx!.globalAlpha = Math.min(1, 0.35 + f * 0.55);
        ctx!.fillRect(projected[i * 3] - size / 2, projected[i * 3 + 1] - size / 2, size, size);
      }

      const s = states.signal;
      const block = 4 + 7 * e2Base;
      ctx!.globalAlpha = 0.4 + 0.6 * e2Base;
      ctx!.fillStyle = colors.signal;
      ctx!.fillRect(projected[s * 3] - block / 2, projected[s * 3 + 1] - block / 2, block, block);
      ctx!.globalAlpha = 1;
    }

    function frame(now: number) {
      time += Math.min((now - last) / 1000, 0.05);
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function run() {
      cancelAnimationFrame(raf);
      if (visible && !reduce.matches) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else {
        draw();
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    observer.observe(canvas);
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      colors = { ink: readColor("--nm-fg"), line: readColor("--nm-border-strong"), signal: readColor("--nm-accent") };
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    reduce.addEventListener("change", run);

    resize();
    run();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      reduce.removeEventListener("change", run);
    };
  }, [state]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
