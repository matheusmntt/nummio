import type { ReactNode } from "react";

type Tone = "muted" | "accent" | "research";

const toneClass: Record<Tone, string> = {
  muted: "text-muted",
  accent: "text-accent",
  research: "text-research",
};

const markerClass: Record<Tone, string> = {
  muted: "bg-line-strong",
  accent: "bg-accent",
  research: "bg-research",
};

type EditorialLabelProps = {
  children: ReactNode;
  tone?: Tone;
  /** Shows the square block from the Nummio symbol before the label. */
  marker?: boolean;
  as?: "span" | "p" | "div";
  className?: string;
};

export function EditorialLabel({
  children,
  tone = "muted",
  marker = false,
  as: Tag = "span",
  className,
}: EditorialLabelProps) {
  return (
    <Tag className={`nm-eyebrow inline-flex items-center gap-2 ${toneClass[tone]} ${className ?? ""}`}>
      {marker && <span aria-hidden className={`size-1.5 shrink-0 rounded-[1px] ${markerClass[tone]}`} />}
      {children}
    </Tag>
  );
}
