# Visual studies (v2)

High-resolution masters for the three visual directions used on nummio.dev.
They follow the brand kit studies in `assets/branding/imagery/` (which stay
untouched as the identity reference) and are cut into web crops by
`pnpm brand:sync`. Constructed Forms is not a raster study: it is drawn live
as an SVG axonometric by `src/components/constructed-drawing.tsx`.

| File | Origin |
| --- | --- |
| `computational-forms.png` | Procedural, 3200×2000. Source: `scripts/studies/computational.html`, rendered with `pnpm studies:render`. |
| `classical-intelligence.png` | AI-generated, 960×1280, Figma AI (`gpt-image-2.5-flare`), November 2026. Prompt below. |

The classical study depicts an original sculpture created for this brand. It
is not a photograph or reproduction of a real artwork; credit and caption it
as a visual study, never as a documented object.

Prompt used for `classical-intelligence.png`:

> Fine-art studio photograph of an original classical marble sculpture (not a
> copy of any existing artwork): the head, neck and draped shoulder of a young
> figure with dense sculpted curly hair, face tilted upward in quiet
> contemplation, eyes lifted toward the sky, seen from a low three-quarter
> angle. Strict monochrome, high-contrast chiaroscuro, one hard key light from
> the upper left carving the brow, nose and jaw, shadows falling into deep
> blue-black. Background is a flat, very dark graphite (#0B0F14) fading to pure
> black, no gradient banding. Weathered white Carrara marble with fine pores,
> faint chisel marks and tiny pits, extremely crisp detail, tack-sharp focus,
> large-format camera, 90mm lens, f/11, museum archive quality. The head
> occupies the upper two-thirds and right side of a vertical frame, with
> generous dark negative space on the left. No text, no letters, no logos, no
> frames, no borders, no colored elements, no watermark.
