export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * Generative diagram drawn for a project. These are illustrations of an idea,
 * never product screenshots; add real imagery only when it exists.
 */
export type ProjectFigure = "graph" | "signal";

export type Project = {
  /** Stable identifier, also used as the DOM id. */
  slug: string;
  name: string;
  /** Short classification shown as metadata, e.g. "Knowledge tool". */
  kind: string;
  summary: string;
  focus: readonly string[];
  figure: ProjectFigure;
  /** One-line caption describing what the figure illustrates. */
  figureCaption: string;
  /**
   * Only add links that have been verified to resolve. Projects without
   * links render without a call to action.
   */
  links?: readonly ProjectLink[];
};

export const projects: readonly Project[] = [
  {
    slug: "nexus",
    name: "Nexus",
    kind: "Knowledge tool",
    summary:
      "A tool for exploring, organizing and investigating knowledge, built for following the connections between ideas rather than just storing them.",
    focus: ["Exploration", "Organization", "Investigation"],
    figure: "graph",
    figureCaption: "Diagram — ideas as nodes, connections as the structure",
  },
  {
    slug: "ion-framework",
    name: "Ion Framework",
    kind: "Framework experiment",
    summary:
      "An experiment in reactive interfaces for the web: what a framework looks like when reactivity is the starting point, not an add-on.",
    focus: ["Reactivity", "Web interfaces", "Experiment"],
    figure: "signal",
    figureCaption: "Diagram — a change propagating through dependent state",
  },
];
