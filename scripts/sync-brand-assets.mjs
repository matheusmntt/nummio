// Copies production assets out of the brand kit. The kit in assets/branding
// stays untouched and remains the source of truth; rerun after updating it.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kit = join(root, "assets/branding");

const copies = [
  // Next.js metadata file conventions (src/app)
  ["icons/favicon.ico", "src/app/favicon.ico"],
  ["icons/favicon.svg", "src/app/icon.svg"],
  ["icons/icon-180.png", "src/app/apple-icon.png"],
  ["social/open-graph-1200x630.png", "src/app/opengraph-image.png"],
  ["social/open-graph-1200x630.png", "src/app/twitter-image.png"],
  // Web app manifest icons (public)
  ["icons/icon-192.png", "public/brand/icon-192.png"],
  ["icons/icon-512.png", "public/brand/icon-512.png"],
];

for (const [from, to] of copies) {
  const target = join(root, to);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(kit, from), target);
  console.log(`brand: ${from} -> ${to}`);
}

/*
 * Web crops of the v2 visual studies in assets/studies (see its README for
 * how each master was made). Rectangles are in master pixels.
 *
 * `grade` lifts the master's blacks to the brand graphite, so the artwork's
 * ground matches the page and plates exactly. `upscale` resamples small
 * masters 2× with Lanczos and light sharpening, so browsers downsample a
 * clean image instead of stretching a small one.
 */
const studies = join(root, "assets/studies");
const GRAPHITE = { r: 11, g: 15, b: 20 };

const crops = [
  { from: "classical-intelligence.png", to: "classical-tall.jpg", grade: true, upscale: true },
  { from: "computational-forms.png", to: "computational-wide.jpg", region: { left: 0, top: 180, width: 3200, height: 1520 } },
  { from: "computational-forms.png", to: "computational-portrait.jpg", region: { left: 800, top: 200, width: 1400, height: 1560 } },
];

const artDir = join(root, "src/assets/art");
mkdirSync(artDir, { recursive: true });

for (const { from, to, region, grade = false, upscale = false } of crops) {
  let image = sharp(join(studies, from)).removeAlpha();
  if (region) image = image.extract(region);
  let buffer = await image.toBuffer();
  if (grade) {
    const { width, height } = await sharp(buffer).metadata();
    buffer = await sharp(buffer)
      .composite([{ input: { create: { width, height, channels: 3, background: GRAPHITE } }, blend: "lighten" }])
      .toBuffer();
  }
  let output = sharp(buffer);
  if (upscale) {
    const { width } = await sharp(buffer).metadata();
    output = output.resize({ width: width * 2, kernel: "lanczos3" }).sharpen({ sigma: 0.9, m1: 0.6, m2: 1.4 });
  }
  await output.jpeg({ quality: 92, mozjpeg: true }).toFile(join(artDir, to));
  console.log(`studies: ${from} -> src/assets/art/${to}`);
}
