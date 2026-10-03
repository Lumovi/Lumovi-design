// icons/web/: favicons, touch icons and web app icons for the website, the docs, and the app
// when it's served from a cluster.
import { night } from '../../src/colors.ts'
import { filled, plated } from '../../src/icon.ts'
import { GRID, markShapes, paint } from '../../src/mark.ts'
import { svg } from '../../src/svg.ts'
import { ico } from '../lib/formats.ts'
import { optimize, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/**
 * The mark alone, which reads best at tab size, in the colors for the browser's theme: the
 * bluer orb on light, the glowing one on dark.
 */
function favicon(): string {
  const light = paint('color', 'light', 'light')
  const dark = paint('color', 'dark', 'dark')
  return svg({
    box: { x: 0, y: 0, width: GRID, height: GRID },
    width: 32,
    height: 32,
    defs: [
      ...light.defs,
      ...dark.defs,
      [
        '<style>',
        '  .l { fill: url(#light-l) }',
        '  .orb { fill: url(#light-orb) }',
        '  @media (prefers-color-scheme: dark) {',
        '    .l { fill: url(#dark-l) }',
        '    .orb { fill: url(#dark-orb) }',
        '  }',
        '</style>',
      ].join('\n'),
    ],
    body: markShapes({ l: 'X', orb: 'Y' }).map((line) =>
      line.replace(' fill="X"', ' class="l"').replace(' fill="Y"', ' class="orb"'),
    ),
  })
}

/** The mark alone for favicon.ico, filling its square: at 16, 32 and 48 its edges are on pixels. */
function icoMark(size: number): string {
  const p = paint('color', 'light', `ico-${size}`)
  return svg({
    box: { x: 0, y: 0, width: GRID, height: GRID },
    width: size,
    height: size,
    defs: p.defs,
    body: markShapes(p),
  })
}

function manifest(): string {
  return JSON.stringify(
    {
      name: 'Lumovi',
      short_name: 'Lumovi',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      theme_color: night[900],
      background_color: night[900],
      display: 'standalone',
    },
    null,
    2,
  )
}

export default {
  name: 'web-icons',
  outputs: ['icons/web'],
  async build(ctx) {
    ctx.text('icons/web/favicon.svg', favicon())
    ctx.text('icons/web/site.webmanifest', manifest())
    if (!ctx.raster) return
    const sizes = [16, 32, 48]
    const icoImages = await Promise.all(
      sizes.map(async (size) => ({
        size,
        png: await optimize(await renderSvg(icoMark(size), size)),
      })),
    )
    ctx.file('icons/web/favicon.ico', ico(icoImages))
    // iOS rounds the corners itself, and Android masks to its own shape (keeping the middle 80%).
    await ctx.png('icons/web/apple-touch-icon.png', await renderSvg(filled(180, 0.5625), 180))
    await ctx.png('icons/web/icon-192.png', await renderSvg(plated(192), 192))
    await ctx.png('icons/web/icon-512.png', await renderSvg(plated(512), 512))
    await ctx.png('icons/web/icon-maskable-512.png', await renderSvg(filled(512, 0.5), 512))
  },
} satisfies Task
