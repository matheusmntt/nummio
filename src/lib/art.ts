import type { StaticImageData } from "next/image";
import computationalWide from "@/assets/art/computational-wide.jpg";

export type ArtKey = "classical" | "computational";

type ArtStudy = {
  study: string;
  title: string;
  alt: string;
};

/*
 * The visual studies. Classical Intelligence is generated live in a shader
 * (src/components/sculpture); Computational Forms is cut from the brand
 * kit (assets/v2/imagery) by `pnpm brand:sync`.
 */
export const art: Record<ArtKey, ArtStudy> = {
  classical: {
    study: "Visual study 01",
    title: "Classical Intelligence",
    alt: "A classical head with tight curls, gazing upward, generated in a shader and printed as an ordered dither in iris and signal green on graphite.",
  },
  computational: {
    study: "Visual study 02",
    title: "Computational Forms",
    alt: "A dense field of thin filaments tipped with small beads, bending along a flowing manifold crossed by signal-green and iris strands.",
  },
};

export const crops = {
  computationalWide,
} satisfies Record<string, StaticImageData>;
