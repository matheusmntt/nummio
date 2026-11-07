export type Front = {
  title: string;
  /** What the front is, in plain terms. */
  definition: string;
  /** The front's line, in the lab's voice. */
  line: string;
};

/**
 * How the lab works, ordered by who the work is for. Descriptions only:
 * cases are added here once there is published work to point to.
 */
export const fronts: readonly Front[] = [
  {
    title: "Products",
    definition: "Nummio's own SaaS and tools.",
    line: "Tools we build for ourselves, then open to others.",
  },
  {
    title: "Partners",
    definition: "Products, SaaS and internal systems built for other companies.",
    line: "Software built with companies, from first question to production.",
  },
  {
    title: "Research",
    definition: "Applied research and prototypes: new technology tested before it becomes product.",
    line: "Experiments that tell us what to build next.",
  },
];
