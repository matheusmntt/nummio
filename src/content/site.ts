export const site = {
  name: "Nummio",
  domain: "nummio.dev",
  url: "https://nummio.dev",
  tagline: "Curiosity, engineered.",
  descriptor: "Independent technology lab",
  description:
    "Nummio is an independent lab for technology, software and applied research. We explore questions, build models to understand them, and engineer tools from what we learn.",
} as const;

export type NavItem = {
  label: string;
  href: `#${string}`;
};

export const primaryNav: readonly NavItem[] = [
  { label: "Approach", href: "#approach" },
  { label: "Practice", href: "#practice" },
  { label: "About", href: "#about" },
];

export type Chapter = {
  /** DOM id of the chapter's section. */
  id: string;
  index: string;
  label: string;
};

/**
 * The homepage reads as one continuous narrative, Curiosity → Questions →
 * Models → Tools. Chapters drive the progress rail and the header readout.
 */
export const chapters: readonly Chapter[] = [
  { id: "top", index: "01", label: "Arrival" },
  { id: "curiosity", index: "02", label: "Curiosity" },
  { id: "approach", index: "03", label: "Method" },
  { id: "practice", index: "04", label: "Practice" },
  { id: "about", index: "05", label: "Philosophy" },
  { id: "closing", index: "06", label: "Closing" },
];
