/**
 * The mark's light coming on, as a short loop: Product Hunt's animated thumbnail (LMV-364).
 *
 * The brand's scene, square and dark: the mark on its floor of dots. The loop starts lit, so a
 * place that shows only the first frame shows the mark as it always is. Then the light dims, rests,
 * and comes on again, spreading over the dots in front of it as it does. Every change eases in
 * and out, and the last frame leads into the first, so the loop has no seam.
 */
import { gray, PAPER } from './colors.ts'
import { palette, scene } from './scene.ts'

/** 2.4 seconds at 25 frames a second: a frame every 40 ms, which a GIF can say exactly. */
export const LOOP = { frames: 60, delay: 40 } as const

/** How dim the light gets, from 0 (off) to 1 (as the mark always is). */
const DIMMEST = 0.22

/** The light's off color, mixed with the lit one as it comes on: still apart from the shade. */
const OFF = gray[700]

/** Eases in and out: still at both ends, so a hold before or after it joins without a step. */
const ease = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)

/**
 * How lit the mark is at `t` (0 to 1 over the loop): lit, dimming, resting dim, coming on, lit.
 * The coming on is the longest part, as it's the point.
 */
export function lightAt(t: number): number {
  const at = (from: number, to: number) => ease(Math.min(1, Math.max(0, (t - from) / (to - from))))
  if (t < 0.22) return 1
  if (t < 0.46) return 1 - (1 - DIMMEST) * at(0.22, 0.46)
  if (t < 0.56) return DIMMEST
  if (t < 0.9) return DIMMEST + (1 - DIMMEST) * at(0.56, 0.9)
  return 1
}

const mix = (a: string, b: string, k: number) => {
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const [x, y] = [rgb(a), rgb(b)]
  return `#${x
    .map((v, i) =>
      Math.round(v + (y[i]! - v) * k)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

/** One frame of the loop, `size` pixels square, `t` from 0 to 1. */
export function loopFrame(t: number, size = 240): string {
  const L = lightAt(t)
  const s = size / 240
  // The mark, a multiple of 8 at 1×, in the middle both ways: the floor shows under it.
  const mark = { x: 56 * s, y: 56 * s, size: 128 * s }
  const html = scene({ width: size, height: size, theme: 'dark', mark })
  // A second floor over the first: the dots the light falls on, brighter, in a pool that spreads
  // out from the mark's foot as the light comes on.
  // On a card the floor runs to the edges; on a square this small it would be a band of even dots,
  // so here it's a pool: bright at the mark's foot, gone before the corners.
  const floorStyle = /<div class="floor" style="([^"]*)"/.exec(html)![1]!
  const masked = (style: string, wide: number, deep: number, mid: number, at = 50) =>
    style.replace(
      /mask-image:[^;]*;mask-composite:intersect/,
      `mask-image:radial-gradient(ellipse ${wide}% ${deep}% at ${at}% 0%, #000, rgb(0 0 0 / ${mid}) 45%, transparent 100%)`,
    )
  const base = masked(floorStyle, 12, 70, 0.45)
  // The lit pool lies in front of the light, a little left of the mark's middle, as its glow does.
  const reach = 0.45 + 0.55 * L
  const lit = masked(floorStyle, 7 * reach, 40 * reach, 0.35, 46)
  const css = `
#scene-mark-light stop:nth-of-type(1) { stop-color: ${mix(OFF, PAPER, L)}; }
#scene-mark-light stop:nth-of-type(2) { stop-color: ${mix(OFF, gray[150], L)}; }
#scene-mark-shade stop:nth-of-type(1) { stop-opacity: ${0.36 * (0.55 + 0.45 * L)}; }
#scene-mark-shade stop:nth-of-type(2) { stop-opacity: ${0.13 * (0.55 + 0.45 * L)}; }
path[filter] { opacity: ${L ** 1.5}; }
#scene-halo { opacity: ${L ** 1.5}; }
#scene-halo stop:nth-of-type(1) { stop-opacity: ${0.17 * L ** 1.5}; }
#scene-halo stop:nth-of-type(2) { stop-opacity: ${0.05 * L ** 1.5}; }
.pool { opacity: ${0.35 + 0.65 * L}; }
.floor { opacity: ${palette.dark.dots * (0.55 + 0.25 * L)}; }
.floor.lit { opacity: ${0.65 * L ** 1.2}; }
`
  return html
    .replace('</style>', `${css}</style>`)
    .replace(floorStyle, base)
    .replace('<div class="pool">', `<div class="floor lit" style="${lit}"></div><div class="pool">`)
}
