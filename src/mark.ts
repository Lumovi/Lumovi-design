/**
 * The Lumovi mark: Sweep. A square, and light sweeping across it from one corner, the way
 * Lumovi takes in a whole cluster at a glance.
 *
 * It's drawn on a 48-unit square, from circles only. The square's corners have a radius of
 * 12; the light is a quarter of a circle with a radius of 30, centered on the bottom-left
 * corner; and the shade, the rest of the square, starts 6 further out. Because 36 and 12 make
 * 48, the shade's ends come to a point exactly where the square's corners begin.
 *
 * Every measure is a multiple of 3, so at 16 pixels (3 units a pixel) the square's edges fall
 * on pixels.
 */
import { gray, INK, PAPER } from './colors.ts'
import { n } from './svg.ts'

export const GRID = 48

export interface Geometry {
  /** The radius of the square's corners. */
  corner: number
  /** The radius of the light, from the bottom-left corner. */
  light: number
  /** The space between the light and the shade. */
  gap: number
}

export const geometry: Geometry = { corner: 12, light: 30, gap: 6 }

export interface Shapes {
  /** The light: a quarter disc, inside the square's rounded corner. */
  light: string
  /** The shade: the rest of the square, beyond the gap. */
  shade: string
  /** The whole square, light, gap and shade. */
  square: string
  /** The center of the light (the square's bottom-left corner), and where the shade starts. */
  origin: { x: number; y: number }
  cut: number
}

export function shapes({ corner: r, light, gap }: Geometry = geometry): Shapes {
  const G = GRID
  const cut = light + gap
  const v = (...values: number[]) => values.map((value) => n(value)).join(' ')
  // Straight runs only where there's room for them: none when the shade starts at a corner.
  const run = (command: 'H' | 'V', to: number, from: number) =>
    to === from ? '' : `${command}${n(to)}`
  return {
    light: `M0 ${n(G - light)}V${n(G - r)}A${v(r, r)} 0 0 0 ${v(r, G)}H${n(light)}A${v(light, light)} 0 0 0 ${v(0, G - light)}Z`,
    shade: [
      `M${v(0, G - cut)}`,
      run('V', r, G - cut),
      `A${v(r, r)} 0 0 1 ${v(r, 0)}`,
      `H${n(G - r)}`,
      `A${v(r, r)} 0 0 1 ${v(G, r)}`,
      `V${n(G - r)}`,
      `A${v(r, r)} 0 0 1 ${v(G - r, G)}`,
      run('H', cut, G - r),
      `A${v(cut, cut)} 0 0 0 ${v(0, G - cut)}`,
      'Z',
    ].join(''),
    square: `M${v(r, 0)}H${n(G - r)}A${v(r, r)} 0 0 1 ${v(G, r)}V${n(G - r)}A${v(r, r)} 0 0 1 ${v(G - r, G)}H${n(r)}A${v(r, r)} 0 0 1 ${v(0, G - r)}V${n(r)}A${v(r, r)} 0 0 1 ${v(r, 0)}Z`,
    origin: { x: 0, y: G },
    cut,
  }
}

/**
 * How the mark is painted: in two tones, the light and its shade (one version for light
 * backgrounds, one for dark), or in one color.
 */
export type Style = 'color' | 'black' | 'white'
export type Background = 'light' | 'dark'

export interface Paint {
  light: string
  shade: string
}

export function paint(style: Style, background: Background): Paint {
  switch (style) {
    case 'color':
      return background === 'dark'
        ? { light: PAPER, shade: gray[750] }
        : { light: INK, shade: gray[300] }
    case 'black':
      return { light: INK, shade: INK }
    case 'white':
      return { light: PAPER, shade: PAPER }
  }
}

/** The mark's two shapes, in its 48-unit square, painted. */
export function markShapes(p: Paint, g: Geometry = geometry): string[] {
  const { light, shade } = shapes(g)
  if (p.light === p.shade) {
    return [`<g fill="${p.light}">`, `  <path d="${shade}"/>`, `  <path d="${light}"/>`, '</g>']
  }
  return [`<path d="${shade}" fill="${p.shade}"/>`, `<path d="${light}" fill="${p.light}"/>`]
}
