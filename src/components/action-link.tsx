import Link from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ActionLink({ href, children, variant = "primary" }: ActionLinkProps) {
  return (
    <Link href={href} className={`nm-button nm-button--${variant} group`}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 8h9M8.5 4 12.5 8l-4 4" />
      </svg>
    </Link>
  );
}
