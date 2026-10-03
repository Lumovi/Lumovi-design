/**
 * The app icon: the mark, lit, on a plate of night blue. The orb is the light in the scene:
 * it glows, lights up the night around it, and lights the inside of the L most.
 *
 * Icons are drawn in pixels at the size they're for, so small ones can put the mark on whole
 * pixels. On Windows and Linux, below 128 pixels, the glow is left out and the mark is larger.
 */
import { blue, night } from './colors.ts'
import {
  GRID,
  geometry as standard,
  markShapes,
  paint,
  shapes,
  type Background,
  type Geometry,
} from './mark.ts'
import { squircle } from './squircle.ts'
import { linearGradient, n, radialGradient, svg } from './svg.ts'

/**
 * For the smallest sizes, a narrower gap: at 12 pixels (4 units a pixel), the bars are 3
 * pixels and the gap 1, where the standard gap would fall between pixels.
 */
export const tiny: Geometry = { bar: 12, gap: 4, corner: 21 }

export interface Plate {
  x: number
  y: number
  size: number
  radius: number
  /** Continuous corners (0.6, as Apple's icons), or 0 for a plain rounded square. */
  smoothing: number
}

export interface IconOptions {
  /** A prefix for ids, so several icons can share a page. */
  id: string
  /** The canvas, in pixels. */
  size: number
  /** The plate, or none for the mark alone. */
  plate?: Plate
  /** The mark's top-left corner and size, in pixels. */
  mark: { x: number; y: number; size: number }
  geometry?: Geometry
  /** The orb's glow, and the light it casts on the plate. */
  glow?: boolean
  /** A soft shadow under the plate, as macOS icons have. */
  shadow?: boolean
  /** A hairline around the plate's edge, which keeps it apart from dark backgrounds. */
  edge?: boolean
  /** A full square of night, for icons the platform masks itself (iOS, Android). */
  fill?: boolean
  /** What the mark is on: night (the default), or a light background. */
  background?: Background
  /** A canvas that isn't square: `size` is then its width. */
  height?: number
}

export function plateShape(p: Plate): string {
  return p.smoothing > 0
    ? squircle(p.x, p.y, p.size, p.radius, p.smoothing)
    : roundedSquare(p.x, p.y, p.size, p.radius)
}

function roundedSquare(x: number, y: number, size: number, r: number): string {
  const v = (...values: number[]) => values.map((value) => n(value)).join(' ')
  return [
    `M${v(x + r, y)}H${n(x + size - r)}`,
    `A${v(r, r)} 0 0 1 ${v(x + size, y + r)}V${n(y + size - r)}`,
    `A${v(r, r)} 0 0 1 ${v(x + size - r, y + size)}H${n(x + r)}`,
    `A${v(r, r)} 0 0 1 ${v(x, y + size - r)}V${n(y + r)}`,
    `A${v(r, r)} 0 0 1 ${v(x + r, y)}Z`,
  ].join('')
}

/** The plate's colors: night, a little lighter at the top. */
export const PLATE_STOPS = [night[700], night[900]] as const

export function icon(o: IconOptions): string {
  const { id, size, plate, mark } = o
  const g = o.geometry ?? standard
  const k = mark.size / GRID
  const { orb } = shapes(g)
  const orbX = mark.x + orb.cx * k
  const orbY = mark.y + orb.cy * k
  const background = o.background ?? 'dark'
  const height = o.height ?? size
  const p = paint('color', background, `${id}-mark`, background === 'dark' && mark.size < 48)
  const shape = plate ? plateShape(plate) : ''
  const defs: string[] = [...p.defs]
  const body: string[] = []

  if (plate || o.fill) {
    defs.push(
      linearGradient(
        `${id}-plate`,
        [0, 0, 0, 1],
        [
          [0, PLATE_STOPS[0]],
          [1, PLATE_STOPS[1]],
        ],
      ),
    )
  }
  if (plate && o.shadow) {
    // A shadow as Apple's icon template has: down a little, soft, and faint.
    const blur = (plate.size / 824) * 12
    defs.push(
      `<filter id="${id}-shadow" x="-10%" y="-10%" width="120%" height="125%">\n  <feGaussianBlur stdDeviation="${n(blur)}"/>\n</filter>`,
    )
    body.push(
      `<path d="${shape}" fill="#000000" fill-opacity="0.32" transform="translate(0 ${n((plate.size / 824) * 10)})" filter="url(#${id}-shadow)"/>`,
    )
  }
  if (o.fill) body.push(`<rect width="${size}" height="${height}" fill="url(#${id}-plate)"/>`)
  if (plate) {
    defs.push(`<clipPath id="${id}-clip">\n  <path d="${shape}"/>\n</clipPath>`)
    body.push(`<path d="${shape}" fill="url(#${id}-plate)"/>`)
  }

  const scene: string[] = []
  if (o.glow) {
    // The light the orb casts on the plate, then a bloom right behind the orb.
    const reach = orb.r * k * 3.4
    defs.push(
      radialGradient(
        `${id}-halo`,
        { cx: orbX, cy: orbY, r: reach, userSpace: true },
        background === 'dark'
          ? [
              [0, blue[400], 0.5],
              [0.38, blue[500], 0.2],
              [1, blue[500], 0],
            ]
          : [
              [0, blue[300], 0.45],
              [0.38, blue[300], 0.16],
              [1, blue[300], 0],
            ],
      ),
      `<filter id="${id}-bloom" x="-1" y="-1" width="3" height="3">\n  <feGaussianBlur stdDeviation="${n(orb.r * 0.42)}"/>\n</filter>`,
    )
    scene.push(`<circle cx="${n(orbX)}" cy="${n(orbY)}" r="${n(reach)}" fill="url(#${id}-halo)"/>`)
  }
  const shapesInMark = markShapes(p, g)
  const bloom = o.glow
    ? [
        `<circle cx="${n(orb.cx)}" cy="${n(orb.cy)}" r="${n(orb.r)}" fill="${blue[300]}" fill-opacity="${background === 'dark' ? 0.85 : 0.6}" filter="url(#${id}-bloom)"/>`,
      ]
    : []
  // The L first, then the bloom over it, then the orb.
  const [lShape, orbShape] = shapesInMark
  scene.push(
    `<g transform="translate(${n(mark.x)} ${n(mark.y)}) scale(${n(k, 5)})">`,
    `  ${lShape}`,
    ...bloom.map((line) => `  ${line}`),
    `  ${orbShape}`,
    '</g>',
  )

  if (plate) {
    body.push(`<g clip-path="url(#${id}-clip)">`, ...scene.map((line) => `  ${line}`), '</g>')
  } else {
    body.push(...scene)
  }

  if (plate && o.edge) {
    // Inside the plate's edge: drawn on a plate one stroke smaller.
    const w = Math.max(1, plate.size / 300)
    const inset: Plate = {
      ...plate,
      x: plate.x + w / 2,
      y: plate.y + w / 2,
      size: plate.size - w,
      radius: plate.radius - w / 2,
    }
    body.push(
      `<path d="${plateShape(inset)}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="${n(w)}" fill="none"/>`,
    )
  }

  return svg({
    box: { x: 0, y: 0, width: size, height },
    width: size,
    height,
    defs,
    body,
  })
}

/**
 * macOS: Apple's grid. On a 1024 canvas, an 824 plate with continuous corners and room for
 * its shadow; the mark is 55% of the plate.
 */
export function macos(size: number, id = 'lumovi-icon'): string {
  const s = size / 1024
  const plate: Plate = { x: 100 * s, y: 100 * s, size: 824 * s, radius: 185.4 * s, smoothing: 0.6 }
  const markSize = 452 * s
  return icon({
    id,
    size,
    plate,
    mark: { x: (size - markSize) / 2, y: (size - markSize) / 2, size: markSize },
    glow: true,
    shadow: true,
    edge: true,
  })
}

/**
 * How big the mark is on a full-size plate, per pixel size: on whole pixels at small sizes
 * (with the tiny geometry at 16 and 20), where it's larger, and 56.25% of the plate from 128
 * up (on whole pixels at 128 and 256 too).
 */
export function fittedMark(size: number): { size: number; geometry: Geometry } {
  const table: Record<number, [number, Geometry]> = {
    16: [12, tiny],
    20: [12, tiny],
    24: [16, standard],
    32: [24, standard],
    40: [24, standard],
    48: [32, standard],
    64: [40, standard],
    96: [64, standard],
  }
  const [markSize, geometry] = table[size] ?? [size * 0.5625, standard]
  return { size: markSize, geometry }
}

/**
 * Windows and Linux: a plate edge to edge, as icons there are, with continuous corners.
 * Small sizes put the mark on whole pixels and leave the glow out.
 */
export function plated(size: number, id = 'lumovi-icon'): string {
  const fit = fittedMark(size)
  const offset = (size - fit.size) / 2
  return icon({
    id,
    size,
    plate: { x: 0, y: 0, size, radius: size * 0.225, smoothing: size >= 64 ? 0.6 : 0 },
    mark: { x: offset, y: offset, size: fit.size },
    geometry: fit.geometry,
    glow: size >= 128,
    edge: size >= 32,
  })
}

/** A square of night with the mark: for iOS and Android, which round the corners themselves. */
export function filled(size: number, markRatio: number, id = 'lumovi-icon'): string {
  const markSize = size * markRatio
  const offset = (size - markSize) / 2
  return icon({
    id,
    size,
    fill: true,
    mark: { x: offset, y: offset, size: markSize },
    glow: true,
  })
}
