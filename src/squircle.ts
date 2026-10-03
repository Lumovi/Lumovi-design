/**
 * A rounded square whose corners ease into the sides instead of meeting them at a point
 * where the curve suddenly starts: the "continuous corners" of Apple's app icons. Each corner
 * is a circular arc between two cubic curves; `smoothing` is how much of the corner the
 * curves take (0 is a plain rounded rectangle; 0.6 is iOS's and macOS's).
 *
 * The construction is Figma's corner smoothing, as described in "Desperately seeking
 * squircles" (figma.com/blog/desperately-seeking-squircles).
 */
import { n } from './svg.ts'

const rad = (degrees: number) => (degrees * Math.PI) / 180

export function squircle(
  x: number,
  y: number,
  size: number,
  radius: number,
  smoothing = 0.6,
): string {
  const p = Math.min((1 + smoothing) * radius, size / 2)
  const s = Math.min(smoothing, p / radius - 1)
  const arcMeasure = 90 * (1 - s)
  const arc = Math.sin(rad(arcMeasure / 2)) * radius * Math.SQRT2
  const alpha = (90 - arcMeasure) / 2
  const p3p4 = radius * Math.tan(rad(alpha / 2))
  const beta = 45 * s
  const c = p3p4 * Math.cos(rad(beta))
  const d = c * Math.tan(rad(beta))
  const b = (p - arc - c - d) / 3
  const a = 2 * b
  const r = n(radius)
  const ab = a + b
  const abc = a + b + c
  const v = (...values: number[]) => values.map((value) => n(value)).join(' ')
  return [
    `M${v(x + size - p, y)}`,
    `c${v(a, 0, ab, 0, abc, d)}`,
    `a${r} ${r} 0 0 1 ${v(arc, arc)}`,
    `c${v(d, c, d, b + c, d, abc)}`,
    `L${v(x + size, y + size - p)}`,
    `c${v(0, a, 0, ab, -d, abc)}`,
    `a${r} ${r} 0 0 1 ${v(-arc, arc)}`,
    `c${v(-c, d, -(b + c), d, -abc, d)}`,
    `L${v(x + p, y + size)}`,
    `c${v(-a, 0, -ab, 0, -abc, -d)}`,
    `a${r} ${r} 0 0 1 ${v(-arc, -arc)}`,
    `c${v(-d, -c, -d, -(b + c), -d, -abc)}`,
    `L${v(x, y + p)}`,
    `c${v(0, -a, 0, -ab, d, -abc)}`,
    `a${r} ${r} 0 0 1 ${v(arc, -arc)}`,
    `c${v(c, -d, b + c, -d, abc, -d)}`,
    'Z',
  ].join('')
}
