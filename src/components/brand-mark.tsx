import Image from "next/image";
import wordmarkDark from "@brand/logo/nummio-wordmark-dark.svg";
import wordmarkLight from "@brand/logo/nummio-wordmark-light.svg";
import symbolDark from "@brand/icons/nummio-symbol-dark.svg";
import symbolLight from "@brand/icons/nummio-symbol-light.svg";

/*
 * Glyph bounds inside the kit's 504×140 wordmark artboard. The artwork is
 * framed to these bounds so layout spacing (and the clear space around the
 * logo) is controlled by the page, not by the file's padding.
 */
const WORDMARK = { width: 504, height: 140, x: 26.25, y: 23.25, glyphWidth: 457.75, glyphHeight: 93.25 };

type BrandMarkProps = {
  variant?: "wordmark" | "symbol";
  className?: string;
  /** Accessible name. Pass an empty string when the mark is decorative. */
  label?: string;
  preload?: boolean;
};

export function BrandMark({
  variant = "wordmark",
  className,
  label = "Nummio",
  preload = false,
}: BrandMarkProps) {
  const decorative = label === "";

  if (variant === "symbol") {
    return (
      <span
        className={`relative inline-block aspect-square ${className ?? ""}`}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : label}
        aria-hidden={decorative || undefined}
      >
        <Image src={symbolDark} alt="" fill unoptimized loading={preload ? "eager" : undefined} className="light:hidden" />
        <Image src={symbolLight} alt="" fill unoptimized loading={preload ? "eager" : undefined} className="hidden light:block" />
      </span>
    );
  }

  const imageStyle = {
    width: `${(WORDMARK.width / WORDMARK.glyphWidth) * 100}%`,
    left: `${(-WORDMARK.x / WORDMARK.glyphWidth) * 100}%`,
    top: `${(-WORDMARK.y / WORDMARK.glyphHeight) * 100}%`,
  };

  return (
    <span
      className={`relative inline-block overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: `${WORDMARK.glyphWidth} / ${WORDMARK.glyphHeight}` }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={wordmarkDark}
        alt=""
        unoptimized
        loading={preload ? "eager" : undefined}
        className="absolute h-auto max-w-none light:hidden"
        style={imageStyle}
      />
      <Image
        src={wordmarkLight}
        alt=""
        unoptimized
        loading={preload ? "eager" : undefined}
        className="absolute hidden h-auto max-w-none light:block"
        style={imageStyle}
      />
    </span>
  );
}
