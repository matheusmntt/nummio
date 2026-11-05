export type Principle = {
  title: string;
  body: string;
  /** What the step consumes and what it produces. */
  io: readonly [input: string, output: string];
};

export const principles: readonly Principle[] = [
  {
    title: "Explore",
    body: "Follow a question past the point where it is convenient. Read widely, prototype cheaply, keep notes, and let the problem show its real shape before deciding what it is.",
    io: ["Curiosity", "Questions"],
  },
  {
    title: "Understand",
    body: "Turn observations into models that can be tested and explained. If we cannot say how something works, and where it stops working, we are not done.",
    io: ["Questions", "Models"],
  },
  {
    title: "Build",
    body: "Engineer small, precise tools that hold up in real use. Software is where an idea is tested against the world, and where it becomes useful to someone else.",
    io: ["Models", "Tools"],
  },
];
