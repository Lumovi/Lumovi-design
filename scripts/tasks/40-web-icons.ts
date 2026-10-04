// icons/web/: favicons, touch icons and web app icons for the website, the docs, and the app
// when it's served from a cluster.
import { gray, INK, PAPER } from '../../src/colors.ts'
import { filled, plated } from '../../src/icon.ts'
import { GRID, shapes } from '../../src/mark.ts'
import { svg } from '../../src/svg.ts'
import { ico } from '../lib/formats.ts'
import { optimize, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/**
 * The mark alone, which reads best at tab size, in the colors for the browser's theme: ink
 * and mist on light, white and gray on dark.
 */
function favicon(): string {
  const { light, shade } = shapes()
  return svg({
    box: { x: 0, y: 0, width: GRID, height: GRID },
    width: 32,
    height: 32,
    defs: [
      [
        '<style>',
        `  .light { fill: ${INK} }`,
        `  .shade { fill: ${gray[300]} }`,
        '  @media (prefers-color-scheme: dark) {',
        `    .light { fill: ${PAPER} }`,
        `    .shade { fill: ${gray[700]} }`,
        '  }',
        '</style>',
      ].join('\n'),
    ],
    body: [`<path class="shade" d="${shade}"/>`, `<path class="light" d="${light}"/>`],
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
      theme_color: gray[950],
      background_color: gray[950],
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
    // favicon.ico can't follow the browser's theme, so it's the app icon: it reads on any tab.
    const sizes = [16, 32, 48]
    const icoImages = await Promise.all(
      sizes.map(async (size) => ({
        size,
        png: await optimize(await renderSvg(plated(size, `ico-${size}`), size)),
      })),
    )
    ctx.file('icons/web/favicon.ico', ico(icoImages))
    // iOS rounds the corners itself, and Android masks to its own shape (keeping the middle 80%).
    await ctx.png('icons/web/apple-touch-icon.png', await renderSvg(filled(180, 0.5), 180))
    await ctx.png('icons/web/icon-192.png', await renderSvg(plated(192), 192))
    await ctx.png('icons/web/icon-512.png', await renderSvg(plated(512), 512))
    await ctx.png('icons/web/icon-maskable-512.png', await renderSvg(filled(512, 0.46), 512))
  },
} satisfies Task
