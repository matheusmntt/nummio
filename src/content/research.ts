import type { ArtKey } from "@/lib/art";

export type ResearchLine = {
  art: ArtKey;
  title: string;
  axes: readonly string[];
  summary: string;
};

export const researchLines: readonly ResearchLine[] = [
  {
    art: "classical",
    title: "Classical Intelligence",
    axes: ["Thought", "Philosophy", "Context"],
    summary:
      "Where ideas come from. Reasoning, history and the long conversation about how we know things: the context any serious tool is built in.",
  },
  {
    art: "computational",
    title: "Computational Forms",
    axes: ["Data", "Systems", "Emergence"],
    summary:
      "How simple rules produce complex behaviour. Generative systems, data structures and the shapes information takes when it moves.",
  },
  {
    art: "constructed",
    title: "Constructed Forms",
    axes: ["Structure", "Engineering", "Material"],
    summary:
      "How things hold together. Constraints, architecture and craft: the discipline of turning a model into something that bears load.",
  },
  {
    art: "interface",
    title: "Kinetic Interfaces",
    axes: ["Interfaces", "Motion", "Latency"],
    summary:
      "How a system meets the hand. Layered interfaces, motion and response time: the craft of making fast software feel immediate.",
  },
];
