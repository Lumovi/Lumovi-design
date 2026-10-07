/**
 * The app icon: the mark, lit, on a plate of graphite. The light glows white, and lights the
 * shade beside it, brightest along the curve and fading toward the far corner.
 *
 * Icons are drawn in pixels at the size they're for. On Windows and Linux, below 128 pixels,
 * the glow is left out and the mark is larger; at 16 and 20 pixels the gap narrows to a pixel.
 */
import { gray, INK, PAPER } from './colors.ts'
import { GRID, geometry as standard, shapes, type Background, type Geometry } from './mark.ts'
import { squircle } from './squircle.ts'
import { linearGradient, n, radialGradient, svg } from './svg.ts'

/** For the smallest sizes, a narrower gap: one pixel when the mark is 12 pixels. */
export const tiny: Geometry = { ...standard, gap: 4 }

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
  /** The canvas's width, in pixels. */
  size: number
  /** The canvas's height, if it isn't square. */
  height?: number
  /** The plate, or none for the mark alone. */
  plate?: Plate
  /** The mark's top-left corner and size, in pixels. */
  mark: { x: number; y: number; size: number }
  geometry?: Geometry
  /** The light's glow, and the light it casts around it. */
  glow?: boolean
  /** A soft shadow under the plate, as macOS icons have. */
  shadow?: boolean
  /** A hairline around the plate's edge, which keeps it apart from dark backgrounds. */
  edge?: boolean
  /** A full square of graphite, for icons the platform masks itself (iOS, Android). */
  fill?: boolean
  /** What the mark is on: graphite (the default), or a light background, where it's flat. */
  background?: Background
}

/** The plate's colors: graphite, a little lighter at the top. */
export const PLATE_STOPS = [gray[750], gray[950]] as const
/** From the light's center to the square's far corner, rounded up. */
const REACH = 68
/** The middle of the light, where its glow is centered. */
const GLOW = { x: 13, y: 35, r: 46 }

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

/**
 * The lit mark's gradients and shapes, in its 48-unit square: the light white, and the shade
 * a veil of white, brightest along the curve.
 */
export function litMark(id: string, g: Geometry = standard, glow = true) {
  const { light, shade, square, origin, cut } = shapes(g)
  const defs = [
    radialGradient(`${id}-light`, { cx: origin.x, cy: origin.y, r: g.light, userSpace: true }, [
      [0, PAPER],
      [1, gray[150]],
    ]),
    radialGradient(`${id}-shade`, { cx: origin.x, cy: origin.y, r: REACH, userSpace: true }, [
      [cut / REACH, PAPER, 0.36],
      [1, PAPER, 0.13],
    ]),
    `<filter id="${id}-bloom" x="-50%" y="-50%" width="200%" height="200%">\n  <feGaussianBlur stdDeviation="2.4"/>\n</filter>`,
    // The glow stays inside the square, so its edges stay sharp.
    `<clipPath id="${id}-square">\n  <path d="${square}"/>\n</clipPath>`,
  ]
  const body = [
    `<path d="${shade}" fill="url(#${id}-shade)"/>`,
    ...(glow
      ? [
          `<g clip-path="url(#${id}-square)">`,
          `  <path d="${light}" fill="${PAPER}" fill-opacity="0.6" filter="url(#${id}-bloom)"/>`,
          '</g>',
        ]
      : []),
    `<path d="${light}" fill="url(#${id}-light)"/>`,
  ]
  return { defs, body }
}

export function icon(o: IconOptions): string {
  const { id, size, plate, mark } = o
  const height = o.height ?? size
  const background = o.background ?? 'dark'
  const g = o.geometry ?? standard
  const k = mark.size / GRID
  const shape = plate ? plateShape(plate) : ''
  const defs: string[] = []
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
    defs.push(
      `<filter id="${id}-shadow" x="-10%" y="-10%" width="120%" height="125%">\n  <feGaussianBlur stdDeviation="${n((plate.size / 824) * 12)}"/>\n</filter>`,
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
  if (o.glow && background === 'dark') {
    // The light it casts, centered on the middle of the light and reaching past the mark.
    const cx = mark.x + GLOW.x * k
    const cy = mark.y + GLOW.y * k
    const reach = GLOW.r * k
    defs.push(
      radialGradient(`${id}-halo`, { cx, cy, r: reach, userSpace: true }, [
        [0, PAPER, 0.17],
        [0.45, PAPER, 0.05],
        [1, PAPER, 0],
      ]),
    )
    scene.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(reach)}" fill="url(#${id}-halo)"/>`)
  }
  let markBody: string[]
  if (background === 'dark') {
    const lit = litMark(`${id}-mark`, g, Boolean(o.glow))
    defs.push(...lit.defs)
    markBody = lit.body
  } else {
    const { light, shade } = shapes(g)
    markBody = [`<path d="${shade}" fill="${gray[300]}"/>`, `<path d="${light}" fill="${INK}"/>`]
  }
  scene.push(
    `<g transform="translate(${n(mark.x)} ${n(mark.y)}) scale(${n(k, 5)})">`,
    ...markBody.map((line) => `  ${line}`),
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
      `<path d="${plateShape(inset)}" stroke="${PAPER}" stroke-opacity="0.12" stroke-width="${n(w)}" fill="none"/>`,
    )
  }

  return svg({ box: { x: 0, y: 0, width: size, height }, width: size, height, defs, body })
}

/**
 * macOS: Apple's grid. On a 1024 canvas, an 824 plate with continuous corners and room for
 * its shadow; the mark is 440, a little over half the plate.
 */
export const MACOS_MARK = 440

export function macos(size: number, id = 'lumovi-icon'): string {
  const s = size / 1024
  const plate: Plate = { x: 100 * s, y: 100 * s, size: 824 * s, radius: 185.4 * s, smoothing: 0.6 }
  const markSize = MACOS_MARK * s
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
 * How big the mark is on a full-size plate, per pixel size: larger at small sizes (with the
 * narrow gap at 16 and 20), and about 56.25% of the plate from 128 up. From 24 pixels on, a
 * multiple of 8, so the gap and the corners fall on whole pixels.
 */
export function fittedMark(size: number): { size: number; geometry: Geometry } {
  const table: Record<number, [number, Geometry]> = {
    16: [12, tiny],
    20: [12, tiny],
    24: [16, standard],
    30: [24, standard],
    32: [24, standard],
    36: [24, standard],
    40: [24, standard],
    44: [32, standard],
    48: [32, standard],
    50: [32, standard],
    60: [40, standard],
    64: [40, standard],
    72: [48, standard],
    80: [48, standard],
    88: [56, standard],
    96: [64, standard],
    100: [64, standard],
  }
  const [markSize, geometry] = table[size] ?? [Math.round((size * 0.5625) / 8) * 8, standard]
  return { size: markSize, geometry }
}

/**
 * Windows and Linux: a plate edge to edge, as icons there are, with continuous corners.
 * Small sizes leave the glow out.
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

/** A square of graphite with the mark: for iOS and Android, which round the corners themselves. */
export function filled(size: number, markRatio: number, id = 'lumovi-icon'): string {
  const markSize = size * markRatio
  const offset = (size - markSize) / 2
  return icon({ id, size, fill: true, mark: { x: offset, y: offset, size: markSize }, glow: true })
}

/**
 * macOS 26's Liquid Glass icon, for Icon Composer and Xcode: graphite as the icon's fill, the
 * light and the shade as glass layers the system lights, tints and shadows itself (in light,
 * dark, clear and tinted appearances), and the light's glow behind them. The system masks the
 * canvas to its shape, so the layers are drawn on the whole canvas, with the mark the same
 * share of it as of the plate in macos().
 */
export function liquidGlass(): { json: string; layers: Record<string, string> } {
  const size = 1024
  const markSize = (MACOS_MARK / 824) * size
  const offset = (size - markSize) / 2
  const k = markSize / GRID
  const { light, shade } = shapes()
  const lit = litMark('lumovi', standard, false)
  const layer = (defs: string[], content: string) =>
    svg({
      box: { x: 0, y: 0, width: size, height: size },
      width: size,
      height: size,
      defs,
      body: [
        `<g transform="translate(${n(offset)} ${n(offset)}) scale(${n(k, 5)})">`,
        `  ${content}`,
        '</g>',
      ],
    })
  const color = (hex: string) =>
    `extended-srgb:${[1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(5)).join(',')},1.00000`
  const group = (name: string, image: string, glass: boolean, translucency: number) => ({
    layers: [{ 'image-name': image, name, glass }],
    shadow: { kind: 'neutral', opacity: 0.5 },
    translucency: { enabled: translucency > 0, value: translucency },
  })
  const json = {
    fill: {
      'linear-gradient': [color(PLATE_STOPS[0]), color(PLATE_STOPS[1])],
      orientation: { start: { x: 0.5, y: 0 }, stop: { x: 0.5, y: 1 } },
    },
    // Front to back: the light, solid so it stays bright; the shade, glass; and the glow.
    groups: [
      group('Light', 'light.svg', true, 0),
      group('Shade', 'shade.svg', true, 0.4),
      { ...group('Glow', 'glow.svg', false, 0), shadow: { kind: 'none', opacity: 0 } },
    ],
    'supported-platforms': { squares: ['macOS'] },
  }
  return {
    json: JSON.stringify(json, null, 2),
    layers: {
      'light.svg': layer([lit.defs[0]!], `<path d="${light}" fill="url(#lumovi-light)"/>`),
      'shade.svg': layer([lit.defs[1]!], `<path d="${shade}" fill="url(#lumovi-shade)"/>`),
      'glow.svg': layer(
        [
          radialGradient('lumovi-glow', { cx: 0.5, cy: 0.5, r: 0.5 }, [
            [0, PAPER, 0.3],
            [0.45, PAPER, 0.08],
            [1, PAPER, 0],
          ]),
        ],
        `<circle cx="${GLOW.x}" cy="${GLOW.y}" r="${GLOW.r}" fill="url(#lumovi-glow)"/>`,
      ),
    },
  }
}
