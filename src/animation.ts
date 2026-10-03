/**
 * The mark, moving: an intro (the L rises into place, then the orb lights up) for splash
 * screens and the website, and a loading mark (the orb breathes) for while the app waits.
 *
 * Plain SVG with CSS animations, so they play in an <img> as well as inline. Both hold still
 * for people who ask for reduced motion: the intro shows its last frame, the loading mark a
 * steady orb.
 */
import { blue } from './colors.ts'
import { GRID, markShapes, paint, shapes, type Background } from './mark.ts'
import { n, svg } from './svg.ts'

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'

function base(background: Background, id: string, css: string, glow: boolean) {
  const p = paint('color', background, id)
  const [l, orb] = markShapes(p)
  const { orb: o } = shapes()
  // A soft light around the orb, out to the canvas's edge (and no further, or it shows one).
  const pad = 6
  const reach = Math.min(GRID + pad - o.cx, o.cy + pad)
  return svg({
    box: { x: -pad, y: -pad, width: GRID + pad * 2, height: GRID + pad * 2 },
    width: 128,
    height: 128,
    title: 'Lumovi',
    defs: [
      ...p.defs,
      `<radialGradient id="${id}-glow"><stop offset="0" stop-color="${background === 'dark' ? blue[300] : blue[400]}" stop-opacity="0.55"/><stop offset="1" stop-color="${blue[400]}" stop-opacity="0"/></radialGradient>`,
      // Class and animation names start with the id, so the CSS can't reach other SVGs inline.
      `<style>\n${css.trim().replaceAll('@ID', id)}\n</style>`,
    ],
    body: [
      ...(glow
        ? [
            `<circle class="${id}-glow" cx="${n(o.cx)}" cy="${n(o.cy)}" r="${n(reach)}" fill="url(#${id}-glow)"/>`,
          ]
        : []),
      l!.replace('<path ', `<path class="${id}-l" `),
      orb!.replace('<circle ', `<circle class="${id}-orb" `),
    ],
  })
}

/** Plays once, in a little over a second. */
export function intro(background: Background, id: string): string {
  const { orb } = shapes()
  const origin = `${n(orb.cx)}px ${n(orb.cy)}px`
  return base(
    background,
    id,
    `
.@ID-l { animation: @ID-rise 900ms ${EASE_OUT} both; }
.@ID-orb { transform-origin: ${origin}; animation: @ID-light 900ms ${EASE_OUT} 280ms both; }
.@ID-glow { transform-origin: ${origin}; animation: @ID-bloom 1400ms ${EASE_OUT} 380ms both; }
@keyframes @ID-rise { from { opacity: 0; transform: translate(-3px, 6px); } }
@keyframes @ID-light { from { opacity: 0; transform: scale(0.6); } }
@keyframes @ID-bloom { from { opacity: 0; transform: scale(0.4); } }
@media (prefers-reduced-motion: reduce) { .@ID-l, .@ID-orb, .@ID-glow { animation: none; } }`,
    true,
  )
}

/** Loops: the orb breathes, about once every two seconds. */
export function loading(background: Background, id: string): string {
  const { orb } = shapes()
  const origin = `${n(orb.cx)}px ${n(orb.cy)}px`
  return base(
    background,
    id,
    `
.@ID-orb { transform-origin: ${origin}; animation: @ID-breathe 2.2s ease-in-out infinite; }
.@ID-glow { transform-origin: ${origin}; animation: @ID-glow 2.2s ease-in-out infinite; }
@keyframes @ID-breathe { 50% { transform: scale(0.86); } }
@keyframes @ID-glow { 50% { opacity: 0.25; transform: scale(0.8); } }
@media (prefers-reduced-motion: reduce) { .@ID-orb, .@ID-glow { animation: none; } }`,
    true,
  )
}
