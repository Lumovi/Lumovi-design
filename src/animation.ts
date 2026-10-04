/**
 * The mark, moving: an intro (the square settles, then the light sweeps across it from its
 * corner) for splash screens and the website, and a loading mark (the light breathes) for
 * while the app waits.
 *
 * Plain SVG with CSS animations, so they play in an <img> as well as inline. Both hold still
 * for people who ask for reduced motion: the intro shows its last frame, the loading mark a
 * steady light.
 */
import { PAPER } from './colors.ts'
import { GRID, paint, shapes, type Background } from './mark.ts'
import { svg } from './svg.ts'

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
/** The canvas reaches past the mark, so its glow has room. */
const PAD = 6
/** The middle of the light, and its glow: out to the canvas's edge, and no further. */
const GLOW = { x: 13, y: 35, r: 13 + PAD }

function base(background: Background, id: string, css: string): string {
  const p = paint('color', background)
  const { light, shade, origin } = shapes()
  const glow = background === 'dark'
  return svg({
    box: { x: -PAD, y: -PAD, width: GRID + PAD * 2, height: GRID + PAD * 2 },
    width: 128,
    height: 128,
    title: 'Lumovi',
    defs: [
      `<radialGradient id="${id}-glow"><stop offset="0" stop-color="${PAPER}" stop-opacity="0.35"/><stop offset="1" stop-color="${PAPER}" stop-opacity="0"/></radialGradient>`,
      // Class and animation names start with the id, so the CSS can't reach other SVGs inline.
      `<style>\n${css
        .trim()
        .replaceAll('@ID', id)
        .replaceAll('@ORIGIN', `${origin.x}px ${origin.y}px`)}\n</style>`,
    ],
    body: [
      ...(glow
        ? [
            `<circle class="${id}-glow" cx="${GLOW.x}" cy="${GLOW.y}" r="${GLOW.r}" fill="url(#${id}-glow)"/>`,
          ]
        : []),
      `<path class="${id}-shade" d="${shade}" fill="${p.shade}"/>`,
      `<path class="${id}-light" d="${light}" fill="${p.light}"/>`,
    ],
  })
}

/** Plays once, in a little over a second. */
export function intro(background: Background, id: string): string {
  return base(
    background,
    id,
    `
.@ID-shade { transform-origin: 24px 24px; animation: @ID-settle 700ms ${EASE_OUT} both; }
.@ID-light { transform-origin: @ORIGIN; animation: @ID-sweep 900ms ${EASE_OUT} 250ms both; }
.@ID-glow { transform-origin: @ORIGIN; animation: @ID-sweep 1200ms ${EASE_OUT} 350ms both; }
@keyframes @ID-settle { from { opacity: 0; transform: scale(0.94); } }
@keyframes @ID-sweep { from { opacity: 0; transform: scale(0.2); } }
@media (prefers-reduced-motion: reduce) { .@ID-shade, .@ID-light, .@ID-glow { animation: none; } }`,
  )
}

/** Loops: the light breathes, about once every two seconds. */
export function loading(background: Background, id: string): string {
  return base(
    background,
    id,
    `
.@ID-light { transform-origin: @ORIGIN; animation: @ID-breathe 2.2s ease-in-out infinite; }
.@ID-glow { transform-origin: @ORIGIN; animation: @ID-glow 2.2s ease-in-out infinite; }
@keyframes @ID-breathe { 50% { transform: scale(0.8); } }
@keyframes @ID-glow { 50% { opacity: 0.3; transform: scale(0.8); } }
@media (prefers-reduced-motion: reduce) { .@ID-light, .@ID-glow { animation: none; } }`,
  )
}
