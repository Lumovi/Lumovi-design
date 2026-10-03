/**
 * The logo in all its versions, each painted for dark and light backgrounds.
 */
import { GRID, markShapes, paint, type Background, type Style } from './mark.ts'
import { n, svg, type Box } from './svg.ts'

export interface Variant {
  /** The file name's suffix: what the version is for. */
  name: string
  style: Style
  background: Background
}

export const VARIANTS: Variant[] = [
  { name: 'on-dark', style: 'color', background: 'dark' },
  { name: 'on-light', style: 'color', background: 'light' },
  { name: 'flat-on-dark', style: 'flat', background: 'dark' },
  { name: 'flat-on-light', style: 'flat', background: 'light' },
  { name: 'white', style: 'white', background: 'dark' },
  { name: 'black', style: 'black', background: 'light' },
]

/** The mark at a size, with its top-left corner at (x, y). */
export function placedMark(v: Variant, id: string, x: number, y: number, size: number) {
  const p = paint(v.style, v.background, id)
  const transform =
    x === 0 && y === 0
      ? `scale(${n(size / GRID, 5)})`
      : `translate(${n(x)} ${n(y)}) scale(${n(size / GRID, 5)})`
  return {
    defs: p.defs,
    body:
      size === GRID && x === 0 && y === 0
        ? markShapes(p)
        : [`<g transform="${transform}">`, ...markShapes(p).map((l) => `  ${l}`), '</g>'],
  }
}

export interface Logo {
  box: Box
  defs: string[]
  body: string[]
}

export function mark(v: Variant, id: string): Logo {
  return { box: { x: 0, y: 0, width: GRID, height: GRID }, ...placedMark(v, id, 0, 0, GRID) }
}

/** A logo as a standalone SVG file, `height` pixels tall when shown at its own size. */
export function document(logo: Logo, height: number): string {
  return svg({
    box: logo.box,
    width: (logo.box.width / logo.box.height) * height,
    height,
    title: 'Lumovi',
    defs: logo.defs,
    body: logo.body,
  })
}
