/**
 * The logo in all its versions: the mark, the wordmark, and the two lockups (the mark beside
 * the wordmark, and above it), each for dark and light backgrounds, and in one color.
 *
 * Lockups are laid out in the wordmark's units. Beside the wordmark, the mark is a little
 * taller than the capitals and centered on them.
 */
import { INK, PAPER } from './colors.ts'
import { GRID, markShapes, paint, type Background, type Style } from './mark.ts'
import { n, svg, type Box } from './svg.ts'
import { wordmark } from './wordmark.ts'

export interface Variant {
  /** The file name's suffix: what the version is for. */
  name: string
  style: Style
  background: Background
}

export const VARIANTS: Variant[] = [
  { name: 'on-dark', style: 'color', background: 'dark' },
  { name: 'on-light', style: 'color', background: 'light' },
  { name: 'white', style: 'white', background: 'dark' },
  { name: 'black', style: 'black', background: 'light' },
]

const CAP = wordmark.capHeight
/** Beside the wordmark: the mark's size, and the space between them (both from the capitals). */
export const MARK = Math.round(CAP * 1.24)
export const GAP = Math.round(CAP * 0.38)
/** Above the wordmark: the mark's size, and the space between them. */
export const STACKED_MARK = Math.round(CAP * 2.8)
export const STACKED_GAP = Math.round(CAP * 0.62)

const wordmarkColor = ({ style, background }: Variant) =>
  style === 'black' ? INK : style === 'white' ? PAPER : background === 'dark' ? PAPER : INK

/** The mark at a size, with its top-left corner at (x, y). */
export function placedMark(v: Variant, x: number, y: number, size: number): string[] {
  const shapes = markShapes(paint(v.style, v.background))
  if (size === GRID && x === 0 && y === 0) return shapes
  const translate = x === 0 && y === 0 ? '' : `translate(${n(x)} ${n(y)}) `
  return [
    `<g transform="${translate}scale(${n(size / GRID, 5)})">`,
    ...shapes.map((l) => `  ${l}`),
    '</g>',
  ]
}

/** The wordmark, with the left of its L at x and its baseline at y. */
export function placedWordmark(v: Variant, x: number, y: number): string[] {
  const path = `<path d="${wordmark.letters}" fill="${wordmarkColor(v)}"/>`
  return x === 0 && y === 0
    ? [path]
    : [`<g transform="translate(${n(x)} ${n(y)})">`, `  ${path}`, '</g>']
}

export interface Logo {
  box: Box
  body: string[]
}

export function mark(v: Variant): Logo {
  return { box: { x: 0, y: 0, width: GRID, height: GRID }, body: placedMark(v, 0, 0, GRID) }
}

export function wordmarkOnly(v: Variant): Logo {
  return {
    box: { x: 0, y: -wordmark.top, width: wordmark.width, height: wordmark.top + wordmark.bottom },
    body: placedWordmark(v, 0, 0),
  }
}

export function horizontal(v: Variant): Logo {
  const top = -CAP / 2 - MARK / 2
  const y = Math.min(top, -wordmark.top)
  const bottom = Math.max(top + MARK, wordmark.bottom)
  return {
    box: { x: 0, y, width: MARK + GAP + wordmark.width, height: bottom - y },
    body: [...placedMark(v, 0, top, MARK), ...placedWordmark(v, MARK + GAP, 0)],
  }
}

export function stacked(v: Variant): Logo {
  const width = Math.max(wordmark.width, STACKED_MARK)
  const baseline = STACKED_MARK + STACKED_GAP + wordmark.top
  return {
    box: { x: 0, y: 0, width, height: baseline + wordmark.bottom },
    body: [
      ...placedMark(v, (width - STACKED_MARK) / 2, 0, STACKED_MARK),
      ...placedWordmark(v, (width - wordmark.width) / 2, baseline),
    ],
  }
}

/** A logo as a standalone SVG file, `height` pixels tall when shown at its own size. */
export function document(logo: Logo, height: number): string {
  return svg({
    box: logo.box,
    width: (logo.box.width / logo.box.height) * height,
    height,
    title: 'Lumovi',
    body: logo.body,
  })
}
