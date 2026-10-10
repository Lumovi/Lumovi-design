/**
 * Daylight: the fifth sponsor tier's light on lumovi.dev, after spark, glow, beam and
 * lighthouse. The other four are lamps: a point, a larger one, a shaft, the mark. Daylight has
 * no lamp. The whole floor is lit to the card's edges, under a sky that is brightest at the
 * horizon. The website draws its lights on a canvas (its scenes/sponsors); this draws the same
 * thing with the same numbers, for the design (LMV-209) and the guidelines' picture.
 */
import { type Scheme } from './colors.ts'

/** The light's numbers, in the website's terms: k is the scene's pixels to a unit. */
export const DAYLIGHT = {
  /** The horizon, above the floor's middle, in units. */
  horizon: 0.95,
  /** The sky's white at the horizon, fading to none at the card's top. */
  sky: 0.3,
  /** The glow along the horizon: how wide (of the card), how tall (in units), how strong. */
  glow: { width: 1, height: 1.1, alpha: 0.14 },
  /** The floor's white, at the horizon and at the card's foot. */
  ground: [0.18, 0.03],
  /** How far the floor of dots reaches, of the card's width, from its middle. */
  reach: 0.8,
  /** On the light theme white shows less, so every light there is this much stronger. */
  onLight: 2.4,
  /**
   * On the light theme the floor is lit this much of that: lit as strongly as the sky, the
   * horizon would vanish, white on white. The floor stays the card's gray, and the sky ends on it.
   */
  floorOnLight: 0.2,
} as const

const FLOOR = {
  dark: { color: '255,255,255', dot: 0.5, light: 0.1, ground: '#121212', mix: 'lighter' },
  light: { color: '10,10,10', dot: 0.3, light: 0, ground: '#ececec', mix: 'source-over' },
} as const

/** The light on a card `width` × `height`, as a page with one canvas, in one theme. */
export function daylight(scheme: Scheme, width: number, height: number): string {
  const f = FLOOR[scheme]
  return `<!doctype html><meta charset="utf-8"><style>html, body { margin: 0; background: ${f.ground}; } canvas { display: block; width: ${width}px; height: ${height}px; }</style>
<canvas width="${width * 2}" height="${height * 2}"></canvas>
<script>
const D = ${JSON.stringify(DAYLIGHT)}
const W = ${width}, H = ${height}
const ctx = document.querySelector('canvas').getContext('2d')
ctx.scale(2, 2)
const white = (a) => 'rgba(255,255,255,' + a + ')'
const k = Math.min(W / 6, H / 4.2)
const at = [W / 2, H * 0.6]
const horizon = at[1] - k * D.horizon
// The floor of dots, as on the other lights, but to the card's edges and up to the horizon.
ctx.save()
ctx.beginPath(); ctx.rect(0, horizon, W, H); ctx.clip()
ctx.translate(at[0], at[1]); ctx.scale(1, 0.5)
const fk = k / 2.2, reach = W * D.reach
const fade = (a) => { const g = ctx.createRadialGradient(0, 0, 0, 0, 0, reach); g.addColorStop(0, 'rgba(${f.color},' + a + ')'); g.addColorStop(0.45, 'rgba(${f.color},' + a * 0.4 + ')'); g.addColorStop(1, 'rgba(${f.color},0)'); return g }
ctx.fillStyle = fade(${f.light}); ctx.fillRect(-reach, -reach, reach * 2, reach * 2)
const dots = Math.floor(reach / (fk * Math.SQRT2)), r = fk * Math.SQRT2 * 0.045
ctx.beginPath()
for (let i = -dots; i <= dots; i++) for (let j = -dots; j <= dots; j++) {
  if (i * i + j * j > dots * dots) continue
  const x = (i - j) * fk, y = (i + j) * fk
  ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2)
}
ctx.fillStyle = fade(${f.dot}); ctx.fill()
ctx.restore()
// The light: white, adding up on graphite, laid over the light theme's gray.
ctx.globalCompositeOperation = '${f.mix}'
const s = ${scheme === 'dark' ? 1 : DAYLIGHT.onLight}
const g = s * ${scheme === 'dark' ? 1 : DAYLIGHT.floorOnLight}
const sky = ctx.createLinearGradient(0, 0, 0, horizon)
sky.addColorStop(0, white(0)); sky.addColorStop(1, white(Math.min(1, D.sky * s)))
ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon)
const gw = W * D.glow.width, a = Math.min(1, D.glow.alpha * s)
// Wide and flat: the horizon is brightest at its middle, with no spot that reads as a lamp.
ctx.save(); ctx.translate(W / 2, horizon); ctx.scale(1, (k * D.glow.height) / gw)
const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, gw)
glow.addColorStop(0, white(a)); glow.addColorStop(0.5, white(a * 0.5)); glow.addColorStop(1, white(0))
ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, gw, 0, Math.PI * 2); ctx.fill(); ctx.restore()
const ground = ctx.createLinearGradient(0, horizon, 0, H)
ground.addColorStop(0, white(Math.min(1, D.ground[0] * g))); ground.addColorStop(1, white(Math.min(1, D.ground[1] * g)))
ctx.fillStyle = ground; ctx.fillRect(0, horizon, W, H - horizon)
</script>`
}
