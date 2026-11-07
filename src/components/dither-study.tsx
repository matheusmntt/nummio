"use client";

import { getImageProps, type StaticImageData } from "next/image";
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

/** Width of the optimised source. The finest grid samples about half the frame's CSS width, so this leaves headroom. */
const SOURCE_WIDTH = 828;

function tone(value: number) {
  return Math.pow(Math.min(1, Math.max(0, (value - BLACK) / (WHITE - BLACK))), GAMMA);
}

function token(name: string): Rgb {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace("#", "");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as unknown as Rgb;
}

/** Prints the image onto `canvas` as one dither cell per canvas pixel, cropped like CSS `object-fit: cover`. */
function print(canvas: HTMLCanvasElement, image: HTMLImageElement, cols: number, rows: number, focusX: number, focusY: number, inks: Rgb[]) {
  canvas.width = cols;
  canvas.height = rows;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, (cols - width) * focusX, (rows - height) * focusY, width, height);

  const pixels = context.getImageData(0, 0, cols, rows);
  const { data } = pixels;
  const light = new Float32Array(cols * rows);
  for (let i = 0; i < light.length; i++) {
    light[i] = tone((0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255);
  }

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
  context.putImageData(pixels, 0, 0);
}

type DitherStudyProps = {
  src: StaticImageData;
  /** Object position of the crop, as fractions (like CSS `object-position`). */
  focusX: number;
  focusY: number;
  /** Dither cell sizes in CSS pixels, coarse to fine. Each is printed as its own layer, the finest on top. */
  cells: readonly number[];
  className?: string;
};

/**
 * The study printed as a three-level Atkinson dither in the brand's two
 * electric inks (iris for midtones, signal for highlights) on graphite, once
 * per cell size. Each layer holds one canvas pixel per cell and is scaled up
 * by a whole number of device pixels with `pixelated` rendering, so cells stay
 * hard at any density. Layers are printed when the frame nears the viewport
 * and reprinted only when it resizes; `[data-dither-level]` lets a timeline
 * choose which one shows. It fills its positioned container.
 */
export function DitherStudy({ src, focusX, focusY, cells, className }: DitherStudyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = rootRef.current;
    if (!frame) return;

    const canvases = Array.from(frame.querySelectorAll<HTMLCanvasElement>("canvas"));
    const image = new Image();
    image.decoding = "async";
    let frameRequest = 0;

    const render = () => {
      if (!image.naturalWidth) return;
      // The real ratio, uncapped: each cell must cover a whole number of device pixels or it blurs.
      const dpr = window.devicePixelRatio || 1;
      const inks = [token("--nm-color-graphite"), token("--nm-color-iris"), token("--nm-color-signal")];
      cells.forEach((cell, index) => {
        const unit = Math.max(1, Math.round(cell * dpr));
        // Layout size, so transforms on ancestors do not change the grid.
        const cols = Math.ceil((frame.clientWidth * dpr) / unit);
        const rows = Math.ceil((frame.clientHeight * dpr) / unit);
        if (!cols || !rows) return;
        const canvas = canvases[index];
        print(canvas, image, cols, rows, focusX, focusY, inks);
        canvas.style.width = `${(cols * unit) / dpr}px`;
        canvas.style.height = `${(rows * unit) / dpr}px`;
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(render);
    };

    // The optimised source (AVIF or WebP at a fixed width), fetched only as the frame approaches.
    const { srcSet = "", src: fallback } = getImageProps({ src, alt: "", width: SOURCE_WIDTH, sizes: `${SOURCE_WIDTH}px` }).props;
    const source = srcSet
      .split(", ")
      .map((candidate) => candidate.split(" "))
      .find(([, descriptor]) => descriptor === `${SOURCE_WIDTH}w`)?.[0];
    const nearby = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        nearby.disconnect();
        image.src = source ?? fallback;
      },
      { rootMargin: "100% 0px" },
    );
    nearby.observe(frame);

    image.addEventListener("load", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(frame);

    return () => {
      nearby.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frameRequest);
      image.removeEventListener("load", schedule);
    };
  }, [src, focusX, focusY, cells]);

  return (
    <div ref={rootRef} aria-hidden className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {cells.map((cell) => (
        <canvas key={cell} data-dither-level={cell} className="absolute top-0 left-0 [image-rendering:pixelated]" />
      ))}
    </div>
  );
}
