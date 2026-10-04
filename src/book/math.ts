/** Color arithmetic for the book: contrast as WCAG measures it, and each color's other notations. */

export function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** Relative luminance, as WCAG 2 defines it. */
export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => linear(c / 255)) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** The contrast ratio between two colors, from 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** What a contrast ratio passes for text: AAA, AA, AA for large text only, or nothing. */
export function level(ratio: number): string {
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : '—'
}

/** Text that reads on a color: ink on light colors, paper on dark ones. */
export function textOn(hex: string): string {
  return luminance(hex) > 0.2 ? '#0a0a0a' : '#ffffff'
}

/** The color in OKLCH: lightness, chroma and hue, as CSS writes it. */
export function oklch(hex: string): string {
  const [r, g, b] = rgb(hex).map((c) => linear(c / 255)) as [number, number, number]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const C = Math.hypot(A, B)
  const hue = C < 0.002 ? 0 : (Math.atan2(B, A) * 180) / Math.PI
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${C < 0.002 ? 0 : ((hue + 360) % 360).toFixed(1)})`
}

/**
 * A starting point for print, by the simple formula: not color-managed, so proof it on the
 * press it's printed on.
 */
export function cmyk(hex: string): string {
  const [r, g, b] = rgb(hex).map((c) => c / 255) as [number, number, number]
  const k = 1 - Math.max(r, g, b)
  if (k >= 1) return '0 0 0 100'
  const part = (c: number) => Math.round(((1 - c - k) / (1 - k)) * 100)
  return `${part(r)} ${part(g)} ${part(b)} ${Math.round(k * 100)}`
}
