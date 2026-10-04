/**
 * The brand's imagery, for social cards, banners, wallpapers and installers: graphite, a floor
 * of dots running off into the distance (a cluster's worth of pods, seen from above), and the
 * mark standing on it, its light falling on the floor in front.
 *
 * A scene is an HTML page, rendered with Chrome. The floor scales with the mark, so a small
 * mark on a big wallpaper stands in the same pool of light as a big one on a social card.
 */
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { gray, INK, PAPER } from './colors.ts'
import { icon } from './icon.ts'
import { escape } from './svg.ts'

const require = createRequire(import.meta.url)
const font = (path: string) => pathToFileURL(require.resolve(path)).href

/** Inter (with optical sizes) and JetBrains Mono: the app's typefaces. */
export const FONTS = `
@font-face {
  font-family: 'Inter';
  src: url(${font('@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2')}) format('woff2');
  font-weight: 100 900;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url(${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}) format('woff2');
  font-weight: 100 800;
}`

export type Theme = 'dark' | 'light'

export interface SceneOptions {
  width: number
  height: number
  theme: Theme
  /** The mark: its top-left corner and its size, in pixels. */
  mark: { x: number; y: number; size: number }
  /** The floor of dots under the mark. `fadeLeft` keeps it out of the left, for text. */
  floor?: false | { fadeLeft?: boolean }
  /** HTML laid over the scene: text, the wordmark. */
  content?: string
  /** CSS for the content. */
  css?: string
}

export const palette = {
  dark: {
    sky: [gray[850], gray[950], '#000000'],
    pool: 'rgb(255 255 255 / 0.1)',
    dot: PAPER,
    dots: 0.5,
    text: '#ededed',
    muted: gray[500],
    lead: gray[400],
    accent: '#ededed',
  },
  light: {
    sky: [PAPER, gray[100], '#ebebeb'],
    pool: 'rgb(0 0 0 / 0.035)',
    dot: INK,
    dots: 0.3,
    text: INK,
    muted: gray[600],
    lead: gray[700],
    accent: INK,
  },
} as const

export function scene(o: SceneOptions): string {
  const { width: W, height: H, theme, mark } = o
  const c = palette[theme]
  // The floor scales with the mark: 1 for a 330-pixel mark, as on a social card.
  const u = mark.size / 330
  // The middle of the mark: where the light pools.
  const ox = mark.x + mark.size / 2
  const oy = mark.y + mark.size / 2
  const markSvg = icon({ id: 'scene', size: W, height: H, mark, glow: true, background: theme })

  const floor =
    o.floor === false
      ? ''
      : (() => {
          // A plane tipped away from the viewer, its far edge (the horizon) at the foot of the mark.
          const w = Math.max(W * 1.6, 1800 * u)
          const h = 1000 * u
          const left = ox - w / 2
          const top = mark.y + mark.size * 0.97
          const fade = o.floor?.fadeLeft
            ? `, linear-gradient(to right, transparent ${((ox - W * 0.42 - left) / w) * 100}%, #000 ${((ox - W * 0.12 - left) / w) * 100}%)`
            : ''
          const mask = `radial-gradient(ellipse 48% 62% at 50% 14%, #000, rgb(0 0 0 / 0.25) 52%, transparent 86%)${fade}`
          return `<div class="floor" style="left:${left}px;top:${top}px;width:${w}px;height:${h}px;mask-image:${mask};mask-composite:intersect"></div>`
        })()

  return `<!doctype html>
<meta charset="utf-8">
<style>
${FONTS}
html, body { margin: 0; }
body {
  position: relative;
  width: ${W}px;
  height: ${H}px;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: ${c.text};
  -webkit-font-smoothing: antialiased;
  background: radial-gradient(75% 95% at ${(ox / W) * 100}% ${(oy / H) * 100}%, ${c.sky[0]} 0%, ${c.sky[1]} 48%, ${c.sky[2]} 100%);
}
.floor {
  position: absolute;
  transform-origin: 50% 0;
  transform: perspective(${700 * u}px) rotateX(64deg);
  background-image: radial-gradient(circle, ${c.dot} ${2.2 * u}px, transparent ${3 * u}px);
  background-size: ${40 * u}px ${40 * u}px;
  background-position: center top;
  opacity: ${c.dots};
}
.pool {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle ${mark.size * 1.45}px at ${ox}px ${oy}px, ${c.pool}, transparent 70%);
}
.mark { position: absolute; inset: 0; }
.mark svg { display: block; }
${o.css ?? ''}
</style>
${floor}
<div class="pool"></div>
<div class="mark">${markSvg}</div>
${o.content ?? ''}
`
}

/** A headline in two tones, as the website's: the first line bright, the rest quieter. */
export function headline(lines: string[], theme: Theme): string {
  const [first, ...rest] = lines
  return `${escape(first ?? '')}${rest.map((line) => `<br><span style="color:${palette[theme].muted}">${escape(line)}</span>`).join('')}`
}
