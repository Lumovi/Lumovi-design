/**
 * The wordmark: "Lumovi", set in Inter Display SemiBold, the typeface the app is set in, so
 * the logo and the interface speak with one voice. (Inter is by Rasmus Andersson, under the
 * SIL Open Font License 1.1.)
 *
 * The letters are Inter's, outlined, so the wordmark needs no font, and tracked a little
 * tighter, as display type is. Coordinates are the font's units (2048 to the em), with the
 * baseline at 0 and y down.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import * as fontkit from 'fontkit'
import wawoff2 from 'wawoff2'
import { round } from './svg.ts'

const require = createRequire(import.meta.url)
const file = require.resolve('@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2')
// fontkit reads variable fonts from TrueType files, so the WOFF2 is unpacked first.
const ttf = Buffer.from(await wawoff2.decompress(readFileSync(file)))
const font = (fontkit.create(ttf) as fontkit.Font).getVariation({ wght: 600, opsz: 32 })

export const TEXT = 'Lumovi'
/** Tracking between letters, in font units: −3% of the em. */
const TRACKING = -0.03 * font.unitsPerEm

export interface Wordmark {
  letters: string
  /** The left of the L to the right of the i. */
  width: number
  /** The height of the capitals (the L) above the baseline. */
  capHeight: number
  /** The top of the i's dot above the baseline, and how far round letters dip below it. */
  top: number
  bottom: number
}

function build(): Wordmark {
  const run = font.layout(TEXT)
  let x = 0
  const placed = run.glyphs.map((glyph, i) => {
    const at = x
    x += run.positions[i]!.xAdvance + TRACKING
    return { glyph, at }
  })
  const left = placed[0]!.at + placed[0]!.glyph.bbox.minX
  const last = placed.at(-1)!
  const paths = placed.map(({ glyph, at }) =>
    glyph.path
      .scale(1, -1)
      .translate(at - left, 0)
      .toSVG(),
  )
  const boxes = placed.map(({ glyph }) => glyph.bbox)
  return {
    letters: round(paths.join('')),
    width: last.at + last.glyph.bbox.maxX - left,
    capHeight: font.layout('H').glyphs[0]!.bbox.maxY,
    top: Math.max(...boxes.map((b) => b.maxY)),
    bottom: -Math.min(...boxes.map((b) => b.minY)),
  }
}

export const wordmark: Wordmark = build()
