"use client";

import { useEffect, useRef } from "react";
import { media } from "@/lib/motion";

/** Values the hero choreography writes and the renderer reads each frame. */
export type FieldState = {
  /** Opening sequence, 0 → 1: the curtain unfurls from a single line. */
  intro: number;
  /** Scroll through the arrival chapter, 0 → 1: the camera passes through. */
  scroll: number;
};

/*
 * A live version of the "Computational Forms" study: a curtain of point
 * columns whose edges undulate, with sparse signal columns. Points part
 * around the pointer like a lens, and the camera travels through the field
 * as the visitor scrolls into the next chapter.
 */
const VERTEX = /* glsl */ `#version 300 es
in vec2 aGrid;
in vec3 aSeed;
uniform float uTime;
uniform float uIntro;
uniform float uScroll;
uniform float uAspect;
uniform float uWidth;
uniform float uSize;
uniform vec2 uPointer;
uniform float uPointerForce;
out float vAlpha;
out float vSignal;

void main() {
  float u = aGrid.x;
  float v = aGrid.y;
  float t = uTime;
  float x = (u - 0.5) * uWidth;
  float k = 2.4 / uWidth * 3.0;

  float top = 1.2 + 0.38 * sin(x * 0.55 * k + t * 0.21) + 0.18 * sin(x * 1.3 * k - t * 0.33 + 1.3);
  float bottom = -0.95 + 0.26 * sin(x * 0.45 * k - t * 0.17 + 2.0) + 0.12 * sin(x * 1.1 * k + t * 0.27);

  // Opening: each column unfurls from the midline, sweeping left to right.
  float sweep = clamp(uIntro * 1.7 - u * 0.7, 0.0, 1.0);
  sweep = sweep * sweep * (3.0 - 2.0 * sweep);
  float mid = mix(bottom, top, 0.5);
  float y = mix(mid, mix(bottom, top, v), sweep);
  float z = 0.38 * sin(x * 0.8 * k + t * 0.29) + 0.16 * sin(y * 2.2 + x * 0.4 * k - t * 0.23);

  vec3 p = vec3(x, y + 0.12, z);

  // Scroll: the field dissolves and the camera travels through it.
  float s = uScroll;
  p.z += s * 3.4 + s * s * aSeed.x * 2.4;
  p.xy += (aSeed.xy - 0.5) * s * s * 2.2;

  float yaw = -0.32 + s * 0.42;
  float cy = cos(yaw);
  float sy = sin(yaw);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  p.z -= 4.2;

  float depth = -p.z;
  float focal = 1.65;
  vec2 ndc = vec2(p.x * focal / uAspect, p.y * focal) / depth;

  // Lens: points part around the pointer.
  vec2 d = ndc - uPointer;
  d.x *= uAspect;
  float dist = length(d);
  float lens = exp(-dist * dist * 22.0) * uPointerForce;
  vec2 dir = d / max(dist, 1e-4);
  dir.x /= uAspect;
  ndc += dir * lens * 0.07;

  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = min(uSize * (4.2 / max(depth, 0.2)), uSize * 5.0) * (1.0 + lens * 0.9);

  float bell = exp(-pow((u - 0.48) / 0.34, 2.0));
  float edge = smoothstep(0.0, 0.12, v) * smoothstep(1.0, 0.82, v);
  float near = smoothstep(0.8, 2.4, depth);
  vAlpha = (0.1 + 0.9 * bell) * (0.45 + 0.55 * edge) * near * mix(0.0, 1.0, sweep) * (0.75 + 0.25 * aSeed.z);
  vAlpha = min(1.0, vAlpha + lens * 0.6);
  vSignal = aSeed.z > 0.94 ? 1.0 : 0.0;
}`;

const FRAGMENT = /* glsl */ `#version 300 es
precision mediump float;
in float vAlpha;
in float vSignal;
uniform vec3 uInk;
uniform vec3 uSignal;
out vec4 color;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.32, d) * vAlpha;
  vec3 c = mix(uInk, uSignal, vSignal);
  color = vec4(c * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function parseColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i)?.[1];
  if (!hex) return fallback;
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

/** Deterministic pseudo-random, so the field is identical on every visit. */
function random(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type PointFieldProps = {
  state: FieldState;
  className?: string;
};

export function PointField({ state, className }: PointFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true, alpha: true });
    if (!gl) {
      host.dataset.gl = "off";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      host.dataset.gl = "off";
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      host.dataset.gl = "off";
      return;
    }
    host.dataset.gl = "on";
    gl.useProgram(program);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      time: uniform("uTime"),
      intro: uniform("uIntro"),
      scroll: uniform("uScroll"),
      aspect: uniform("uAspect"),
      width: uniform("uWidth"),
      size: uniform("uSize"),
      pointer: uniform("uPointer"),
      force: uniform("uPointerForce"),
      ink: uniform("uInk"),
      signal: uniform("uSignal"),
    };

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const gridBuffer = gl.createBuffer();
    const seedBuffer = gl.createBuffer();
    let count = 0;

    function buildGrid(cols: number, rows: number) {
      const grid = new Float32Array(cols * rows * 2);
      const seeds = new Float32Array(cols * rows * 3);
      for (let c = 0; c < cols; c++) {
        const column = random(c + 1);
        for (let r = 0; r < rows; r++) {
          const i = c * rows + r;
          grid[i * 2] = c / (cols - 1);
          grid[i * 2 + 1] = r / (rows - 1);
          seeds[i * 3] = random(i * 3.1 + 7);
          seeds[i * 3 + 1] = random(i * 5.7 + 3);
          seeds[i * 3 + 2] = column;
        }
      }
      for (const [buffer, data, name, size] of [
        [gridBuffer, grid, "aGrid", 2],
        [seedBuffer, seeds, "aSeed", 3],
      ] as const) {
        const location = gl!.getAttribLocation(program!, name);
        gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
        gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
        gl!.enableVertexAttribArray(location);
        gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, 0, 0);
      }
      count = cols * rows;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      gl!.uniform3fv(u.ink, parseColor(style.getPropertyValue("--nm-fg"), [0.95, 0.95, 0.93]));
      gl!.uniform3fv(u.signal, parseColor(style.getPropertyValue("--nm-accent"), [0.72, 1, 0.39]));
    }
    readColors();

    let aspect = 1;
    let gridKey = "";
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      aspect = width / Math.max(height, 1);
      const compact = width < 768;
      const key = compact ? "compact" : "full";
      if (key !== gridKey) {
        gridKey = key;
        if (compact) buildGrid(64, 52);
        else buildGrid(150, 72);
      }
      gl!.uniform1f(u.aspect, aspect);
      // Wide enough to overfill the frame once yawed.
      gl!.uniform1f(u.width, Math.max(4.6, (4.2 / 1.65) * aspect * 2.5));
      gl!.uniform1f(u.size, (compact ? 2.3 : 2.2) * dpr);
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, force: 0, active: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointer.active = inside && event.pointerType === "mouse" ? 1 : 0;
      if (!inside) return;
      pointer.tx = x * 2 - 1;
      pointer.ty = -(y * 2 - 1);
    };
    const onPointerLeave = () => {
      pointer.active = 0;
    };

    const reduce = window.matchMedia(media.reduce);
    let raf = 0;
    let visible = false;
    let last = performance.now();
    let time = 12;

    function draw() {
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(u.time, time);
      gl!.uniform1f(u.intro, reduce.matches ? 1 : state.intro);
      gl!.uniform1f(u.scroll, reduce.matches ? 0 : state.scroll);
      gl!.uniform2f(u.pointer, pointer.x, pointer.y);
      gl!.uniform1f(u.force, pointer.force);
      gl!.drawArrays(gl!.POINTS, 0, count);
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.force += (pointer.active - pointer.force) * 0.06;
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

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    observer.observe(host);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!visible || reduce.matches) draw();
    });
    resizeObserver.observe(host);

    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      host.dataset.gl = "off";
    };
    canvas.addEventListener("webglcontextlost", onLost);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    reduce.addEventListener("change", run);

    resize();
    run();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      reduce.removeEventListener("change", run);
      gl.deleteBuffer(gridBuffer);
      gl.deleteBuffer(seedBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [state]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
