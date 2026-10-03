/**
 * The Lumovi mark: an L that holds a light.
 *
 * Lumovi is lumen (light) and view. The mark is the corner of a view, an L, curving around
 * an orb of light; read together they're also "Lo", the start of the name. It's built from
 * straight lines and one curve: the inside of the L is an arc that keeps the orb at an even
 * distance, and the outside corner is the same arc again, moved down and to the left.
 *
 * It's drawn on a 48-unit square. Every measure is a multiple of 3, so at 16 pixels (3 units
 * a pixel) every straight edge lands on a pixel.
 */
import { blue } from './colors.ts'
import { n, radialGradient, type Stop } from './svg.ts'

export const GRID = 48

export interface Geometry {
  /** The thickness of the L's two bars. */
  bar: number
  /** The space between the L and the orb. */
  gap: number
  /** The radius of the L's outside corner. */
  corner: number
}

export const geometry: Geometry = { bar: 12, gap: 6, corner: 21 }

export interface Shapes {
  /** The L, as path data. */
  l: string
  orb: { cx: number; cy: number; r: number }
  /** The radius of the L's inside curve, centered on the orb. */
  curve: number
}

/**
 * The mark's shapes. The orb touches the top and the right of the square, as the L's ends
 * do, so the mark fills its square exactly.
 */
export function shapes({ bar, gap, corner }: Geometry = geometry): Shapes {
  const curve = (GRID - bar + gap) / 2
  const cx = bar + curve
  const cy = GRID - bar - curve
  const end = bar / 2
  const l = [
    `M0 ${n(cy)}`,
    `V${n(end)}`,
    `A${n(end)} ${n(end)} 0 0 1 ${n(bar)} ${n(end)}`,
    `V${n(cy)}`,
    `A${n(curve)} ${n(curve)} 0 0 0 ${n(cx)} ${n(GRID - bar)}`,
    `H${n(GRID - end)}`,
    `A${n(end)} ${n(end)} 0 0 1 ${n(GRID - end)} ${GRID}`,
    `H${n(corner)}`,
    `A${n(corner)} ${n(corner)} 0 0 1 0 ${n(GRID - corner)}`,
    'Z',
  ].join('')
  return { l, orb: { cx, cy, r: curve - gap }, curve }
}

/**
 * How the mark is painted.
 *
 * - `color`: the L lit by the orb, brightest where it curves around it. One version for dark
 *   backgrounds, where the orb glows white, and one for light backgrounds, where it's bluer
 *   so it keeps its edge.
 * - `flat`: the same two blues without gradients, where gradients don't reproduce.
 * - `black` and `white`: one color, for one-color printing, engraving and embossing, or on
 *   photos and brand colors.
 */
export type Style = 'color' | 'flat' | 'black' | 'white'
export type Background = 'light' | 'dark'

export interface Paint {
  defs: string[]
  l: string
  orb: string
}

/** From the orb's center to the L's farthest point (the outside corner), rounded up. */
export const REACH = 38

/** The L's light: a radial gradient centered on the orb, out to the L's farthest corner. */
export function litStops(background: Background, bright = false): Stop[] {
  const { curve } = shapes()
  const inner = curve / REACH
  if (bright) {
    return [
      [inner, blue[200]],
      [0.76, blue[400]],
      [1, blue[500]],
    ]
  }
  return background === 'dark'
    ? [
        [inner, blue[300]],
        [0.76, blue[500]],
        [1, blue[700]],
      ]
    : [
        [inner, blue[400]],
        [0.76, blue[600]],
        [1, blue[700]],
      ]
}

export function orbStops(background: Background): Stop[] {
  return background === 'dark'
    ? [
        [0, '#ffffff'],
        [0.3, blue[50]],
        [0.72, blue[300]],
        [1, blue[500]],
      ]
    : [
        [0, blue[200]],
        [0.5, blue[400]],
        [1, blue[600]],
      ]
}

export const INK = '#0b0b0f'

/**
 * The paint for a style on a background. Gradient ids start with `id`, so they're unique on
 * a page. `bright` lifts the L's far end, for icons too small to show the falloff.
 */
export function paint(style: Style, background: Background, id: string, bright = false): Paint {
  switch (style) {
    case 'color': {
      const { orb } = shapes()
      return {
        defs: [
          radialGradient(
            `${id}-l`,
            { cx: orb.cx, cy: orb.cy, r: REACH, userSpace: true },
            litStops(background, bright),
          ),
          radialGradient(`${id}-orb`, { cx: 0.36, cy: 0.32, r: 0.78 }, orbStops(background)),
        ],
        l: `url(#${id}-l)`,
        orb: `url(#${id}-orb)`,
      }
    }
    case 'flat':
      return background === 'dark'
        ? { defs: [], l: blue[500], orb: blue[300] }
        : { defs: [], l: blue[600], orb: blue[400] }
    case 'black':
      return { defs: [], l: INK, orb: INK }
    case 'white':
      return { defs: [], l: '#ffffff', orb: '#ffffff' }
  }
}

/** The mark's two shapes, in its 48-unit square, painted. */
export function markShapes(p: Pick<Paint, 'l' | 'orb'>, g: Geometry = geometry): string[] {
  const { l, orb } = shapes(g)
  if (p.l === p.orb) {
    return [
      `<g fill="${p.l}">`,
      `  <path d="${l}"/>`,
      `  <circle cx="${n(orb.cx)}" cy="${n(orb.cy)}" r="${n(orb.r)}"/>`,
      '</g>',
    ]
  }
  return [
    `<path d="${l}" fill="${p.l}"/>`,
    `<circle cx="${n(orb.cx)}" cy="${n(orb.cy)}" r="${n(orb.r)}" fill="${p.orb}"/>`,
  ]
}
