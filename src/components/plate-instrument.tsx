"use client";

import { useRef, type PointerEvent } from "react";

const format = (value: number) => String(Math.round(value)).padStart(4, "0");

/**
 * Pointer readout over an art plate, like a measuring instrument: crosshair
 * lines and a coordinate reading in thousandths of the plate. Updates the
 * DOM directly so tracking never re-renders React.
 */
export function PlateInstrument() {
  const root = useRef<HTMLDivElement>(null);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !root.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    root.current.style.setProperty("--x", `${x * 100}%`);
    root.current.style.setProperty("--y", `${y * 100}%`);
    root.current.dataset.active = "true";
    const label = root.current.querySelector("[data-reading]");
    if (label) label.textContent = `x ${format(x * 1000)} · y ${format(y * 1000)}`;
  }

  function onPointerLeave() {
    if (root.current) root.current.dataset.active = "false";
  }

  return (
    <div
      ref={root}
      aria-hidden
      data-active="false"
      className="group/instrument absolute inset-0 cursor-crosshair"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="absolute inset-y-0 left-(--x) w-px bg-plate-line opacity-0 transition-opacity group-data-[active=true]/instrument:opacity-100" />
      <span className="absolute inset-x-0 top-(--y) h-px bg-plate-line opacity-0 transition-opacity group-data-[active=true]/instrument:opacity-100" />
      <span className="absolute top-(--y) left-(--x) size-2 -translate-1/2 border border-plate-accent opacity-0 transition-opacity group-data-[active=true]/instrument:opacity-100" />
      <span data-reading className="nm-eyebrow absolute right-4 bottom-4 hidden bg-plate-scrim px-2 py-1 text-plate-muted tabular-nums pointer-fine:inline">
        x ---- · y ----
      </span>
    </div>
  );
}
