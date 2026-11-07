import type { ReactNode } from "react";

/** The mono caption line under a figure: label on the left, metadata on the right. */
export function FigureCaption({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figcaption className={`mt-3 flex justify-between gap-4 font-mono text-meta tracking-label text-subtle uppercase ${className ?? ""}`}>
      {children}
    </figcaption>
  );
}
