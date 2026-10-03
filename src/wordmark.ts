/**
 * The wordmark: "lumovi", lowercase, drawn from Outfit SemiBold (SIL Open Font License 1.1).
 * Outfit's geometric letters share the mark's circles: its o is nearly the orb.
 *
 * The letters are Outfit's, outlined, so the wordmark needs no font. What's changed:
 * - spacing: tighter than the font's, and evened out by eye (u and m, m and o, o and v);
 * - the i's dot: a perfect circle, its top level with the top of the l. In color, it's blue:
 *   a small light, like the orb.
 *
 * Coordinates are the font's units (1000 to the em), with the baseline at 0 and y down.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import opentype from 'opentype.js'
import { round } from './svg.ts'

const require = createRequire(import.meta.url)
const file = require.resolve('@fontsource/outfit/files/outfit-latin-600-normal.woff')
const data = readFileSync(file)
const font = opentype.parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength))

export const TEXT = 'lumovi'
/** Tracking, in font units, between every pair of letters. */
const TRACKING = -36
/** Adjustments to particular pairs, on top of the tracking. */
const KERNING: Record<string, number> = { um: 4, mo: -6, ov: -16 }
/** The top of the l: the wordmark's height above the baseline. */
export const ASCENDER = 723
/** How far round letters (u, o) dip below the baseline. */
export const OVERSHOOT = 10
const DOT_RADIUS = 75

export interface Wordmark {
  /** One path for the letters, without the i's dot. */
  letters: string
  dot: { cx: number; cy: number; r: number }
  /** The left of the l's stem to the right of the i's dot. */
  width: number
}

type Command = opentype.PathCommand

/** A glyph's outline at x, or only its first contour (the i without its dot). */
function outline(char: string, x: number, firstContourOnly = false): Command[] {
  let commands = font.charToGlyph(char).getPath(x, 0, 1000).commands
  const second = commands.findIndex((c, i) => i > 0 && c.type === 'M')
  if (firstContourOnly && second > 0) commands = commands.slice(0, second)
  // Without the font's zero-length lines (a line to where the pen already is).
  return commands.filter((c, i) => {
    const previous = commands[i - 1]
    return !(
      c.type === 'L' &&
      previous &&
      'x' in previous &&
      previous.x === c.x &&
      previous.y === c.y
    )
  })
}

function pathData(commands: Command[], dx: number): string {
  const p = (x: number, y: number) => `${x + dx} ${y}`
  return commands
    .map((c) => {
      switch (c.type) {
        case 'M':
          return `M${p(c.x, c.y)}`
        case 'L':
          return `L${p(c.x, c.y)}`
        case 'Q':
          return `Q${p(c.x1, c.y1)} ${p(c.x, c.y)}`
        case 'C':
          return `C${p(c.x1, c.y1)} ${p(c.x2, c.y2)} ${p(c.x, c.y)}`
        default:
          return 'Z'
      }
    })
    .join('')
}

function build(): Wordmark {
  const outlines: Command[][] = []
  let x = 0
  let stem = { left: 0, right: 0 }
  for (let i = 0; i < TEXT.length; i++) {
    const char = TEXT[i]!
    if (i > 0) x += TRACKING + (KERNING[TEXT[i - 1]! + char] ?? 0)
    const commands = outline(char, x, char === 'i')
    if (char === 'i') {
      const xs = commands.flatMap((c) => ('x' in c ? [c.x] : []))
      stem = { left: Math.min(...xs), right: Math.max(...xs) }
    }
    outlines.push(commands)
    x += font.charToGlyph(char).advanceWidth ?? 0
  }
  // The wordmark starts at the left of the l's stem.
  const start = Math.min(...outlines[0]!.flatMap((c) => ('x' in c ? [c.x] : [])))
  const dot = {
    cx: (stem.left + stem.right) / 2 - start,
    cy: -(ASCENDER - DOT_RADIUS),
    r: DOT_RADIUS,
  }
  return {
    letters: round(outlines.map((commands) => pathData(commands, -start)).join('')),
    dot,
    width: dot.cx + DOT_RADIUS,
  }
}

export const wordmark: Wordmark = build()
