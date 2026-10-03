/**
 * The logo in all its versions: the mark, the wordmark, and the two lockups (the mark beside
 * the wordmark, and above it), each painted for dark and light backgrounds.
 *
 * Lockups are laid out in the wordmark's units. Beside the wordmark, the mark is exactly as
 * tall as the l (baseline to ascender), and sits on the baseline.
 */
import { blue } from './colors.ts'
import { GRID, INK, markShapes, paint, type Background, type Style } from './mark.ts'
import { n, svg, type Box } from './svg.ts'
import { ASCENDER, OVERSHOOT, wordmark } from './wordmark.ts'

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

/** The wordmark is one color with a blue dot; flat is the same as color. */
export const WORDMARK_VARIANTS = VARIANTS.filter((v) => v.style !== 'flat')

/** The space between the mark and the wordmark, beside it (about a third of the mark). */
export const GAP = 230
/** In the stacked lockup: the mark's size, and the space between it and the wordmark. */
export const STACKED_MARK = 1400
export const STACKED_GAP = 330

function wordmarkPaint({ style, background }: Variant): { letters: string; dot: string } {
  if (style === 'black') return { letters: INK, dot: INK }
  if (style === 'white') return { letters: '#ffffff', dot: '#ffffff' }
  return background === 'dark'
    ? { letters: '#ffffff', dot: blue[400] }
    : { letters: INK, dot: blue[600] }
}

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

/** The wordmark, with the left of its l at x and its baseline at y. */
export function placedWordmark(v: Variant, x: number, y: number): string[] {
  const p = wordmarkPaint(v)
  const { letters, dot } = wordmark
  const shapes = [
    `<path d="${letters}" fill="${p.letters}"/>`,
    `<circle cx="${n(dot.cx)}" cy="${n(dot.cy)}" r="${n(dot.r)}" fill="${p.dot}"/>`,
  ]
  if (x === 0 && y === 0) return shapes
  return [`<g transform="translate(${n(x)} ${n(y)})">`, ...shapes.map((l) => `  ${l}`), '</g>']
}

export interface Logo {
  box: Box
  defs: string[]
  body: string[]
}

export function mark(v: Variant, id: string): Logo {
  return { box: { x: 0, y: 0, width: GRID, height: GRID }, ...placedMark(v, id, 0, 0, GRID) }
}

export function wordmarkOnly(v: Variant): Logo {
  return {
    box: { x: 0, y: -ASCENDER, width: wordmark.width, height: ASCENDER + OVERSHOOT },
    defs: [],
    body: placedWordmark(v, 0, 0),
  }
}

export function horizontal(v: Variant, id: string): Logo {
  const m = placedMark(v, id, 0, -ASCENDER, ASCENDER)
  return {
    box: {
      x: 0,
      y: -ASCENDER,
      width: ASCENDER + GAP + wordmark.width,
      height: ASCENDER + OVERSHOOT,
    },
    defs: m.defs,
    body: [...m.body, ...placedWordmark(v, ASCENDER + GAP, 0)],
  }
}

export function stacked(v: Variant, id: string): Logo {
  const width = Math.max(wordmark.width, STACKED_MARK)
  const m = placedMark(v, id, (width - STACKED_MARK) / 2, 0, STACKED_MARK)
  const baseline = STACKED_MARK + STACKED_GAP + ASCENDER
  return {
    box: { x: 0, y: 0, width, height: baseline + OVERSHOOT },
    defs: m.defs,
    body: [...m.body, ...placedWordmark(v, (width - wordmark.width) / 2, baseline)],
  }
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
