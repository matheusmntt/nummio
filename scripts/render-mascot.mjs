// Draws Nou, the Nummio mascot: the Signal module of the symbol come alive.
// Writes one SVG per mood to assets/mascot/ (the source of truth, editable by
// hand afterwards), a contact sheet that shows each mood at artwork, avatar
// and emoji sizes, and PNG exports in assets/mascot/png/ for avatars, emojis
// and stickers. Rerun after changing the geometry below.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets/mascot");
mkdirSync(out, { recursive: true });

// Signal Core tokens (assets/system/tokens.json).
const GRAPHITE = "#0B0F14";
const CHARCOAL = "#151B22";
const BONE = "#F2F1ED";
const SIGNAL = "#B7FF63";
const IRIS = "#A38CFF";
const STEEL = "#A5A9B8";
const INFRARED = "#FF5526";
const AMBER = "#FFB020";

/*
 * Geometry, on the symbol's 100-unit grid. The body is the Signal module
 * scaled up: a square with the module's corner ratio (3.2 / 15.5). Eyes are
 * vertical bars, the N's stems in miniature. Everything else is a module too:
 * sparks, thought dots, the blocks Nou stacks.
 */
const BODY = { x: 20, y: 26, size: 58 };
const RADIUS = BODY.size * (3.2 / 15.5);
const CENTRE = { x: BODY.x + BODY.size / 2, y: BODY.y + BODY.size / 2 };

const rect = (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2.4}" fill="${fill}" ${extra}/>`;
const module = (x, y, size, fill, extra = "") => `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * (3.2 / 15.5)}" fill="${fill}" ${extra}/>`;
const diamond = (x, y, size, fill) => module(x - size / 2, y - size / 2, size, fill, `transform="rotate(45 ${x} ${y})"`);

function body(fill, { dy = 0, outline } = {}) {
  const { x, y, size } = BODY;
  return outline
    ? `<rect x="${x + 1.5}" y="${y + dy + 1.5}" width="${size - 3}" height="${size - 3}" rx="${RADIUS - 1}" fill="${fill}" stroke="${outline}" stroke-width="3"/>`
    : `<rect x="${x}" y="${y + dy}" width="${size}" height="${size}" rx="${RADIUS}" fill="${fill}"/>`;
}

/** Two eyes, mirrored around the body's centre line. `w`/`h` per eye; `dx`/`dy` move the gaze. */
function eyes({ w = 7, h = 14, gap = 20, dx = 0, dy = -4, fill = GRAPHITE, right = {} } = {}) {
  const y = CENTRE.y + dy;
  const left = rect(CENTRE.x - gap / 2 - w / 2 + dx, y - h / 2, w, h, fill);
  const rw = right.w ?? w;
  const rh = right.h ?? h;
  const r = rect(CENTRE.x + gap / 2 - rw / 2 + dx, y + (right.dy ?? 0) - rh / 2, rw, rh, fill);
  return left + r;
}

/** Closed or happy eyes, drawn as strokes. */
const strokeEyes = (path, color = GRAPHITE, width = 4.5) =>
  [-10, 10].map((offset) => `<path d="${path(CENTRE.x + offset, CENTRE.y - 3)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");

const ground = (width = 40, opacity = 0.35) => `<ellipse cx="${CENTRE.x}" cy="94" rx="${width / 2}" ry="2.6" fill="${STEEL}" opacity="${opacity}"/>`;

// Each mood maps to a status color of the server and the site, so Nou can stand in for the lights.
const moods = {
  neutral: {
    label: "Neutral",
    note: "Default. Lime: all good.",
    art: (shadow = ground) => shadow() + body(SIGNAL) + eyes(),
  },
  curious: {
    label: "Curious",
    note: "Explore. Eyes on a module, as above the N.",
    art: (shadow = ground) =>
      shadow() +
      `<g transform="rotate(-7 ${CENTRE.x} 84)">${body(SIGNAL)}${eyes({ dx: 3, dy: -6, right: { h: 17, dy: -1.5 } })}</g>` +
      module(80, 7, 11, SIGNAL),
  },
  thinking: {
    label: "Thinking",
    note: "Understand. Iris; thoughts rise as modules.",
    art: (shadow = ground) =>
      shadow() +
      body(IRIS) +
      eyes({ h: 10, dx: -3, dy: -9 }) +
      module(70, 15, 5, BONE) +
      module(78, 9, 6.5, BONE) +
      module(87, 2, 8, BONE),
  },
  building: {
    label: "Building",
    note: "Build. Focused, stacking modules.",
    art: (shadow = ground) =>
      shadow() +
      body(SIGNAL) +
      eyes({ w: 9, h: 7, dy: -1 }) +
      module(40, 14, 12, BONE) +
      module(46, 2, 12, SIGNAL, `transform="rotate(6 52 8)"`),
  },
  shipped: {
    label: "Shipped",
    note: "Milestones. Jumps, happy eyes, sparks.",
    art: (shadow = ground) =>
      shadow(30, 0.25) +
      `<g transform="translate(0 -8)">${body(SIGNAL)}${strokeEyes((x, y) => `M${x - 5} ${y + 2} L${x} ${y - 4} L${x + 5} ${y + 2}`)}</g>` +
      diamond(12, 20, 6, BONE) +
      diamond(88, 14, 7, SIGNAL) +
      diamond(91, 40, 5, IRIS) +
      diamond(8, 46, 5, SIGNAL),
  },
  alert: {
    label: "Alert",
    note: "Down or error. Infrared, eyes wide.",
    art: (shadow = ground) =>
      shadow() +
      body(INFRARED) +
      eyes({ w: 10, h: 10, gap: 22, dy: -4 }) +
      rect(84, 6, 5, 13, BONE) +
      module(84, 22, 5, BONE) +
      `<path d="M12 40 L8 37 M12 50 L7 50 M12 60 L8 63" stroke="${BONE}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>`,
  },
  worried: {
    label: "Worried",
    note: "Warning. Amber, a drop of sweat.",
    art: (shadow = ground) =>
      shadow() +
      body(AMBER) +
      // Brows raised in the middle: each eye's inner top corner sits higher than its outer one.
      `<path d="M${CENTRE.x - 13.5} ${CENTRE.y - 5} L${CENTRE.x - 6.5} ${CENTRE.y - 9} L${CENTRE.x - 6.5} ${CENTRE.y + 4} L${CENTRE.x - 13.5} ${CENTRE.y + 4} Z" fill="${GRAPHITE}" stroke="${GRAPHITE}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M${CENTRE.x + 13.5} ${CENTRE.y - 5} L${CENTRE.x + 6.5} ${CENTRE.y - 9} L${CENTRE.x + 6.5} ${CENTRE.y + 4} L${CENTRE.x + 13.5} ${CENTRE.y + 4} Z" fill="${GRAPHITE}" stroke="${GRAPHITE}" stroke-width="2" stroke-linejoin="round"/>` +
      diamond(84, 34, 6, BONE),
  },
  sleeping: {
    label: "Sleeping",
    note: "Off or not checked yet. Steel outline.",
    art: (shadow = ground) =>
      shadow(40, 0.2) +
      body(CHARCOAL, { outline: STEEL }) +
      strokeEyes((x, y) => `M${x - 5} ${y + 3} L${x + 5} ${y + 3}`, STEEL, 3.5) +
      `<path d="M74 12 h8 l-8 9 h8 M86 2 h6 l-6 7 h6" fill="none" stroke="${STEEL}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  home: {
    label: "Home",
    note: "In the symbol: the module above the N.",
    art: () => {
      // The symbol (assets/icons/nummio-symbol-tile.svg) with eyes on its module.
      const n = `<path d="M20 80 V20 H33.5 L66.5 58.5 V35 H80 V80 H66.5 L33.5 41.5 V80 Z" fill="${BONE}"/>`;
      const m = `<rect x="66.5" y="15" width="15.5" height="15.5" rx="3.2" fill="${SIGNAL}"/>`;
      const e = rect(70.3, 19.6, 2.4, 4.8, GRAPHITE) + rect(76, 19.6, 2.4, 4.8, GRAPHITE);
      return `<rect width="100" height="100" rx="22" fill="${GRAPHITE}"/>${n}${m}${e}`;
    },
  },
};

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">${inner}</svg>\n`;

for (const [name, mood] of Object.entries(moods)) {
  writeFileSync(join(out, `nou-${name}.svg`), svg(mood.art()));
  console.log(`mascot: nou-${name}.svg`);
}

/*
 * Contact sheet: per mood, the artwork at 240 px, then avatar (64) and emoji
 * (22) sizes on dark and light grounds, so legibility can be judged at a
 * glance.
 */
const CELL = { w: 400, h: 400 };
const COLS = 3;
const entries = Object.entries(moods);
const rows = Math.ceil(entries.length / COLS);
const width = CELL.w * COLS;
const height = CELL.h * rows + 90;
const font = `font-family="Space Grotesk, Inter, Helvetica, Arial, sans-serif"`;
const mono = `font-family="Geist Mono, JetBrains Mono, Menlo, monospace"`;

const cells = entries
  .map(([name, mood], i) => {
    const x = (i % COLS) * CELL.w;
    const y = 90 + Math.floor(i / COLS) * CELL.h;
    const art = (size, ax, ay) => `<svg x="${ax}" y="${ay}" width="${size}" height="${size}" viewBox="0 0 100 100">${mood.art()}</svg>`;
    return `<g>
      <rect x="${x + 10}" y="${y + 10}" width="${CELL.w - 20}" height="${CELL.h - 20}" rx="18" fill="${CHARCOAL}" stroke="rgba(242,241,237,0.08)"/>
      ${art(220, x + 24, y + 34)}
      <rect x="${x + 262}" y="${y + 40}" width="116" height="92" rx="12" fill="#313338"/>
      ${art(64, x + 288, y + 54)}
      <rect x="${x + 262}" y="${y + 144}" width="116" height="92" rx="12" fill="#FFFFFF"/>
      ${art(64, x + 288, y + 158)}
      <rect x="${x + 262}" y="${y + 248}" width="56" height="40" rx="8" fill="#313338"/>
      ${art(22, x + 279, y + 257)}
      <rect x="${x + 322}" y="${y + 248}" width="56" height="40" rx="8" fill="#FFFFFF"/>
      ${art(22, x + 339, y + 257)}
      <text x="${x + 34}" y="${y + 300}" ${font} font-size="26" font-weight="600" fill="${BONE}">${mood.label}</text>
      <text x="${x + 34}" y="${y + 326}" ${mono} font-size="13" fill="${STEEL}">nou-${name}.svg</text>
      <text x="${x + 34}" y="${y + 356}" ${font} font-size="14" fill="${STEEL}">${mood.note}</text>
    </g>`;
  })
  .join("");

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${GRAPHITE}"/>
  <text x="34" y="52" ${font} font-size="30" font-weight="700" fill="${BONE}">Nou</text>
  <text x="104" y="52" ${font} font-size="18" fill="${STEEL}">νοῦ · "of the mind". The Signal module, come alive.</text>
  ${cells}
</svg>`;

await sharp(Buffer.from(sheet)).png().toFile(join(out, "nou-sheet.png"));
console.log("mascot: nou-sheet.png");

/*
 * PNG exports, 512 px on transparent ground. The moods drop the floor shadow
 * (noise at emoji size) and are framed tighter, on a crop shared by all of
 * them so Nou keeps one size across a set; Home keeps the symbol's full tile.
 */
const CROP = "4 0 92 92";
const png = join(out, "png");
mkdirSync(png, { recursive: true });
for (const [name, mood] of Object.entries(moods)) {
  const inner = name === "home" ? mood.art() : mood.art(() => "");
  const viewBox = name === "home" ? "0 0 100 100" : CROP;
  const file = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="${viewBox}">${inner}</svg>`;
  await sharp(Buffer.from(file)).png().toFile(join(png, `nou-${name}.png`));
}
console.log("mascot: png/nou-*.png");
