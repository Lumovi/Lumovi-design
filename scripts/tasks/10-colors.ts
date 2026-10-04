// colors/: the palette and the app's semantic tokens, for CSS, Tailwind, design tools (as
// design tokens), and Adobe and GIMP swatches.
import { blue, brand, gray, series, status, themes, type Scheme } from '../../src/colors.ts'
import { ase } from '../lib/formats.ts'
import type { Task } from '../lib/task.ts'

const HEADER = 'Built from src/colors.ts by `npm run build`: change it there.'
const scales = { gray, blue } as const

/** `rgb(12 12 20 / 0.08)` or `#rrggbb` as `#rrggbbaa`/`#rrggbb`, for formats without rgb(). */
function hex(color: string): string {
  const rgb = color.match(/^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/)
  if (!rgb) return color
  const [, r, g, b, a] = rgb.map(Number) as number[]
  const byte = (v: number) => v.toString(16).padStart(2, '0')
  return `#${byte(r!)}${byte(g!)}${byte(b!)}${byte(Math.round(a! * 255))}`
}

/** A theme's tokens, with the app's names: the palette's semantic tokens, status marks and series. */
function themeTokens(scheme: Scheme): [string, string][] {
  return [
    ...Object.entries(themes[scheme]),
    ...Object.entries(status),
    ...series[scheme].map((color, i): [string, string] => [`series-${i + 1}`, color]),
    ['series-other', series.other[scheme]],
  ]
}

function css(): string {
  const block = (scheme: Scheme, indent: string) =>
    [
      `${indent}color-scheme: ${scheme};`,
      ...themeTokens(scheme).map(([k, v]) => `${indent}--${k}: ${v};`),
    ].join('\n')
  const palette = Object.entries(scales)
    .map(([name, scale]) =>
      [
        `  /* ${name[0]!.toUpperCase()}${name.slice(1)} */`,
        ...Object.entries(scale).map(([step, v]) => `  --lumovi-${name}-${step}: ${v};`),
      ].join('\n'),
    )
    .join('\n\n')
  return `/*
 * Lumovi's colors. ${HEADER}
 *
 * The palette is --lumovi-*. The semantic tokens (--surface, --text-1, --accent, …) have the
 * names the app uses. They're light, and dark when the system is, unless data-theme on <html>
 * says light; data-theme="dark" makes them dark whatever the system.
 */

:root {
${palette}
}

:root {
${block('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${block('dark', '    ')}
  }
}

:root[data-theme='dark'] {
${block('dark', '  ')}
}
`
}

function tailwind(): string {
  const lines = Object.entries(scales).flatMap(([name, scale]) => [
    '',
    ...Object.entries(scale).map(([step, v]) => `  --color-lumovi-${name}-${step}: ${v};`),
  ])
  return `/*
 * Lumovi's palette as Tailwind CSS (v4) colors: bg-lumovi-blue-600, text-lumovi-night-900, …
 * ${HEADER}
 *
 * Import it after Tailwind: @import 'tailwindcss'; @import './tailwind.css';
 */

@theme {${lines.join('\n')}
}
`
}

function tokens(): string {
  const color = (value: string, description?: string) => ({
    $value: hex(value),
    ...(description ? { $description: description } : {}),
  })
  const scale = (s: Record<string, string>) =>
    Object.fromEntries(Object.entries(s).map(([step, v]) => [step, color(v)]))
  return JSON.stringify(
    {
      $description: `Lumovi's colors, as design tokens (W3C Design Tokens Community Group format). ${HEADER}`,
      color: {
        $type: 'color',
        brand: Object.fromEntries(
          Object.entries(brand).map(([k, b]) => [k, color(b.hex, `${b.name}. ${b.use}`)]),
        ),
        gray: scale(gray),
        blue: scale(blue),
        status: scale(status),
      },
      theme: {
        $type: 'color',
        light: Object.fromEntries(themeTokens('light').map(([k, v]) => [k, color(v)])),
        dark: Object.fromEntries(themeTokens('dark').map(([k, v]) => [k, color(v)])),
      },
    },
    null,
    2,
  )
}

const title = (s: string) => s[0]!.toUpperCase() + s.slice(1)

function swatchGroups() {
  return [
    { name: 'Lumovi', colors: Object.values(brand).map((b) => ({ name: b.name, hex: b.hex })) },
    ...Object.entries(scales).map(([name, scale]) => ({
      name: title(name),
      colors: Object.entries(scale).map(([step, v]) => ({
        name: `${title(name)} ${step}`,
        hex: v,
      })),
    })),
    {
      name: 'Status',
      colors: Object.entries(status).map(([k, v]) => ({ name: title(k), hex: v })),
    },
  ]
}

/** GIMP and Inkscape palette. */
function gpl(): string {
  const rows = swatchGroups().flatMap((group) => [
    `# ${group.name}`,
    ...group.colors.map(({ name, hex: h }) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
      return `${String(r).padStart(3)} ${String(g).padStart(3)} ${String(b).padStart(3)}\t${name}`
    }),
  ])
  return ['GIMP Palette', 'Name: Lumovi', 'Columns: 11', `# ${HEADER}`, ...rows].join('\n')
}

export default {
  name: 'colors',
  outputs: ['colors'],
  async build(ctx) {
    ctx.text('colors/tokens.css', css())
    ctx.text('colors/tailwind.css', tailwind())
    ctx.text('colors/tokens.json', tokens())
    ctx.text('colors/lumovi.gpl', gpl())
    ctx.file('colors/lumovi.ase', ase(swatchGroups()))
  },
} satisfies Task
