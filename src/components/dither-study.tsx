"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

type Rgb = readonly [number, number, number];

/** Atkinson error diffusion: 6 neighbours take 1/8 each, so 1/4 of the error is dropped and contrast stays hard. */
const ATKINSON = [
  [1, 0],
  [2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [0, 2],
] as const;

/** Levels and curve for the marble: lift the black point, clip the highlights. */
const BLACK = 0.1;
const WHITE = 0.86;
const GAMMA = 1.15;

function tone(value: number) {
  return Math.pow(Math.min(1, Math.max(0, (value - BLACK) / (WHITE - BLACK))), GAMMA);
}

function token(name: string): Rgb {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as unknown as Rgb;
}

type DitherStudyProps = {
  src: StaticImageData;
  /** Object position of the crop, as fractions (like CSS `object-position`). */
  focusX: number;
  focusY: number;
  /** Size of one dither cell in CSS pixels. */
  cell?: number;
  className?: string;
};

/**
 * The study re-printed as a three-level Atkinson dither in the brand's two
 * electric inks (iris for midtones, signal for highlights) on graphite. It
 * is computed for the frame's real size in device pixels, so every cell
 * lands on whole pixels, and redrawn only when the frame resizes.
 */
export function DitherStudy({ src, focusX, focusY, cell = 2, className }: DitherStudyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return;

    const image = new Image();
    image.decoding = "async";
    image.src = src.src;
    let frameRequest = 0;

    const render = () => {
      if (!image.naturalWidth) return;
      // The real ratio, uncapped: the canvas must map 1:1 to device pixels or the cells blur.
      const dpr = window.devicePixelRatio || 1;
      const unit = Math.max(2, Math.round(cell * dpr));
      // Layout size, so the scroll-driven scale on the parent does not change the grid.
      const cols = Math.ceil((frame.clientWidth * dpr) / unit);
      const rows = Math.ceil((frame.clientHeight * dpr) / unit);
      if (!cols || !rows) return;

      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      const context = canvas.getContext("2d");
      if (!sampleContext || !context) return;

      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      sampleContext.imageSmoothingQuality = "high";
      sampleContext.drawImage(image, (cols - width) * focusX, (rows - height) * focusY, width, height);

      const pixels = sampleContext.getImageData(0, 0, cols, rows);
      const { data } = pixels;
      const light = new Float32Array(cols * rows);
      for (let i = 0; i < light.length; i++) {
        light[i] = tone((0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255);
      }

      const inks = [token("--nm-color-graphite"), token("--nm-color-iris"), token("--nm-color-signal")];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const level = Math.min(2, Math.max(0, Math.round(light[i] * 2)));
          const error = (light[i] - level / 2) / 8;
          for (const [dx, dy] of ATKINSON) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny < rows) light[ny * cols + nx] += error;
          }
          const [r, g, b] = inks[level];
          data[i * 4] = r;
          data[i * 4 + 1] = g;
          data[i * 4 + 2] = b;
          data[i * 4 + 3] = 255;
        }
      }
      sampleContext.putImageData(pixels, 0, 0);

      canvas.width = cols * unit;
      canvas.height = rows * unit;
      canvas.style.width = `${(cols * unit) / dpr}px`;
      canvas.style.height = `${(rows * unit) / dpr}px`;
      context.imageSmoothingEnabled = false;
      context.drawImage(sample, 0, 0, canvas.width, canvas.height);
    };

    const schedule = () => {
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(render);
    };

    image.addEventListener("load", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(frame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRequest);
      image.removeEventListener("load", schedule);
    };
  }, [src, focusX, focusY, cell]);

  return <canvas ref={canvasRef} aria-hidden className={`[image-rendering:pixelated] ${className ?? ""}`} />;
}
