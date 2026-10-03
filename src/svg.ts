// Small helpers for writing clean, readable SVG by hand.

/** A number as SVG writes it: to a thousandth, without trailing zeros. */
export function n(value: number, digits = 3): string {
  const factor = 10 ** digits
  const rounded = Math.round(value * factor) / factor
  return String(Object.is(rounded, -0) ? 0 : rounded)
}

/** Rounds every number in path data or a list of coordinates. */
export function round(data: string): string {
  return data.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (match) => n(Number(match)))
}

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

/** A standalone SVG document: a viewBox, a title for screen readers, definitions and shapes. */
export function svg({
  box,
  width,
  height,
  title,
  defs = [],
  body,
}: {
  box: Box
  width?: number
  height?: number
  title?: string
  defs?: string[]
  body: string[]
}): string {
  const size = width && height ? ` width="${n(width)}" height="${n(height)}"` : ''
  const viewBox = [box.x, box.y, box.width, box.height].map(n).join(' ')
  const lines = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"${size}${title ? ' role="img"' : ''}>`,
    ...(title ? [`  <title>${title}</title>`] : []),
    ...(defs.length ? ['  <defs>', ...indent(defs, 4), '  </defs>'] : []),
    ...indent(body, 2),
    '</svg>',
  ]
  return lines.join('\n') + '\n'
}

export function indent(lines: string[], spaces: number): string[] {
  const pad = ' '.repeat(spaces)
  return lines.flatMap((line) => line.split('\n')).map((line) => (line ? pad + line : line))
}

export type Stop = [offset: number, color: string, opacity?: number]

function stops(list: Stop[]): string[] {
  return list.map(
    ([offset, color, opacity]) =>
      `  <stop offset="${n(offset)}" stop-color="${color}"${opacity === undefined ? '' : ` stop-opacity="${n(opacity)}"`}/>`,
  )
}

export function linearGradient(
  id: string,
  [x1, y1, x2, y2]: [number, number, number, number],
  list: Stop[],
  userSpace = false,
): string {
  return [
    `<linearGradient id="${id}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"${userSpace ? ' gradientUnits="userSpaceOnUse"' : ''}>`,
    ...stops(list),
    '</linearGradient>',
  ].join('\n')
}

export function radialGradient(
  id: string,
  { cx, cy, r, userSpace = false }: { cx: number; cy: number; r: number; userSpace?: boolean },
  list: Stop[],
): string {
  return [
    `<radialGradient id="${id}" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"${userSpace ? ' gradientUnits="userSpaceOnUse"' : ''}>`,
    ...stops(list),
    '</radialGradient>',
  ].join('\n')
}

/** Escapes text for XML and HTML. */
export function escape(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!,
  )
}
