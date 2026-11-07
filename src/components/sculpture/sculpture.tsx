"use client";

import { useEffect, useRef } from "react";
import { fragment, vertex } from "./shader";

/** Values the chapter choreography writes (with GSAP) and the renderer reads. */
export type SculptureState = {
  /** 0 → 1 from the top: how much of the plate is printed as a dither. */
  scan: number;
  /** Dither cell in render pixels; floored, so tweening it steps the resolution. */
  block: number;
  /** 0 → 1: the form rising out of the dark. */
  exposure: number;
  /** Key light azimuth, radians. */
  light: number;
  /** Head turn, radians. */
  yaw: number;
  /** 0 = Bayer matrix, 1 = interleaved noise. */
  pattern: number;
  /** Offset of the dither pattern, in cells; whole steps make it crawl. */
  phase: number;
  /** -1 → 1: the pointer swings the key light around the head. */
  pointer: number;
};

export const finalSculpture: SculptureState = { scan: 1, block: 1, exposure: 1, light: -1.25, yaw: 0.45, pattern: 0, phase: 0, pointer: 0 };

function token(name: string): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

type SculptureProps = {
  state: SculptureState;
  /** Size of one render pixel in CSS pixels: the finest dither cell. */
  cell?: number;
  className?: string;
};

/**
 * The Classical Intelligence study, generated rather than photographed: a
 * raymarched head printed as an ordered dither in iris and signal. It renders
 * at the dither's own resolution and is scaled up in whole device pixels, so
 * cells stay crisp; frames are drawn only while visible and only when the
 * state has changed.
 */
export function Sculpture({ state, cell = 2, className }: SculptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    const compile = (type: number, source: string) => {
      const shader = gl?.createShader(type);
      if (!gl || !shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = gl && compile(gl.VERTEX_SHADER, vertex);
    const fs = gl && compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl?.createProgram();
    if (!gl || !vs || !fs || !program) {
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

    // One triangle covering the viewport.
    gl.bindVertexArray(gl.createVertexArray());
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      resolution: uniform("uResolution"),
      block: uniform("uBlock"),
      scan: uniform("uScan"),
      exposure: uniform("uExposure"),
      light: uniform("uLight"),
      yaw: uniform("uYaw"),
      pattern: uniform("uPattern"),
      phase: uniform("uPhase"),
    };
    gl.uniform3fv(uniform("uGround"), token("--nm-color-graphite"));
    gl.uniform3fv(uniform("uMid"), token("--nm-color-iris"));
    gl.uniform3fv(uniform("uHigh"), token("--nm-color-signal"));
    gl.uniform3fv(uniform("uTone"), token("--nm-color-bone"));

    let drawn = "";
    function draw(force = false) {
      const light = state.light + state.pointer * 0.9;
      const key = `${state.scan}|${Math.floor(state.block)}|${state.exposure}|${light}|${state.yaw}|${state.pattern}|${Math.floor(state.phase)}`;
      if (!force && key === drawn) return;
      drawn = key;
      gl!.uniform1f(u.scan, state.scan);
      gl!.uniform1f(u.block, state.block);
      gl!.uniform1f(u.exposure, state.exposure);
      gl!.uniform1f(u.light, light);
      gl!.uniform1f(u.yaw, state.yaw);
      gl!.uniform1f(u.pattern, state.pattern);
      gl!.uniform2f(u.phase, Math.floor(state.phase), Math.floor(state.phase * 0.5));
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function resize() {
      // The real ratio, uncapped: render pixels must map to whole device pixels or the cells blur.
      const dpr = window.devicePixelRatio || 1;
      const unit = Math.max(2, Math.round(cell * dpr));
      const cols = Math.max(1, Math.ceil((host!.clientWidth * dpr) / unit));
      const rows = Math.max(1, Math.ceil((host!.clientHeight * dpr) / unit));
      canvas!.width = cols;
      canvas!.height = rows;
      canvas!.style.width = `${(cols * unit) / dpr}px`;
      canvas!.style.height = `${(rows * unit) / dpr}px`;
      gl!.viewport(0, 0, cols, rows);
      gl!.uniform2f(u.resolution, cols, rows);
      draw(true);
    }

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(loop);
    });
    visibility.observe(host);
    const sizing = new ResizeObserver(resize);
    sizing.observe(host);

    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      host.dataset.gl = "off";
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      sizing.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, [state, cell]);

  return <canvas ref={canvasRef} aria-hidden className={`[image-rendering:pixelated] ${className ?? ""}`} />;
}
