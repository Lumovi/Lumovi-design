// media/: wallpapers, and the artwork the installers show (the macOS disk image's window, and
// the Windows installer's sidebar and header).
import { blue, night } from '../../src/colors.ts'
import { icon } from '../../src/icon.ts'
import { document, VARIANTS, wordmarkOnly } from '../../src/logo.ts'
import { FONTS, scene, type Theme } from '../../src/scene.ts'
import { bmp } from '../lib/formats.ts'
import { renderHtml, rgba } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

const wordmark = (theme: Theme, height: number) =>
  document(
    wordmarkOnly(VARIANTS.find((v) => v.name === (theme === 'dark' ? 'on-dark' : 'on-light'))!),
    height,
  )

/** A wallpaper: the mark on its floor, nothing else. */
function wallpaper(width: number, height: number, theme: Theme): string {
  const portrait = height > width
  const size = portrait ? width * 0.42 : height * 0.2
  return scene({
    width,
    height,
    theme,
    mark: { x: (width - size) / 2, y: height * (portrait ? 0.5 : 0.36) - size / 2, size },
  })
}

/**
 * The disk image's window (540 × 380 points, as electron-builder lays it out: the app at 130,
 * 220 and Applications at 410, 220). Finder writes the icons' names in black in light mode and
 * white in dark mode, so the sky gets lighter toward the bottom, to a blue-gray where both
 * read (white at 4.3:1, black at 4.9:1).
 */
function dmg(): string {
  const W = 540
  const H = 380
  const arrow = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0">
    <path d="M232 220h70m-12-11 12 11-12 11" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
  return `<!doctype html><meta charset="utf-8"><style>
    ${FONTS}
    html, body { margin: 0; }
    body {
      width: ${W}px; height: ${H}px; position: relative; overflow: hidden;
      font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;
      background:
        radial-gradient(60% 50% at 50% 0%, rgb(57 135 229 / 0.28), transparent 70%),
        linear-gradient(to bottom, ${night[900]} 0%, ${night[800]} 30%, ${night[600]} 58%, #6a7aa0 74%, #6a7aa0 100%);
    }
    .floor {
      position: absolute; left: -400px; top: 150px; width: 1340px; height: 600px;
      transform-origin: 50% 0; transform: perspective(520px) rotateX(64deg);
      background-image: radial-gradient(circle, ${blue[200]} 1.6px, transparent 2.2px);
      background-size: 28px 28px; background-position: center top;
      mask-image: radial-gradient(ellipse 50% 70% at 50% 0%, rgb(0 0 0 / 0.55), transparent 80%);
    }
    .wordmark { position: absolute; left: 50%; top: 56px; transform: translateX(-50%); }
    .wordmark svg { display: block; }
    p { position: absolute; left: 0; right: 0; top: 98px; margin: 0; text-align: center; color: rgb(242 242 244 / 0.62); font-size: 13px; letter-spacing: 0.01em; }
  </style>
  <div class="floor"></div>
  <div class="wordmark">${wordmark('dark', 30)}</div>
  <p>Drag Lumovi into Applications</p>
  ${arrow}`
}

/** The Windows installer's sidebar (164 × 314), beside its welcome and finish pages. */
function sidebar(): string {
  const W = 164
  const H = 314
  const size = 76
  return `<!doctype html><style>
    html, body { margin: 0; }
    body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden;
      background: radial-gradient(120% 70% at 50% 34%, ${night[700]}, ${night[900]} 70%); }
    .wordmark { position: absolute; left: 50%; bottom: 34px; transform: translateX(-50%); }
    .wordmark svg { display: block; }
  </style>
  ${icon({ id: 'side', size: W, height: H, mark: { x: (W - size) / 2, y: 92, size }, glow: true })}
  <div class="wordmark">${wordmark('dark', 18)}</div>`
}

/** The Windows installer's header (150 × 57), at the right of its pages' white header. */
function header(): string {
  const size = 33
  return `<!doctype html><style>html, body { margin: 0; background: #ffffff; }</style>
  ${icon({ id: 'head', size: 150, height: 57, mark: { x: 150 - size - 14, y: (57 - size) / 2, size }, background: 'light' })}`
}

const WALLPAPERS: [name: string, width: number, height: number][] = [
  ['desktop-16x9', 5120, 2880],
  ['desktop-16x10', 3456, 2160],
  ['phone', 1290, 2796],
]

export default {
  name: 'media',
  outputs: ['media'],
  async build(ctx) {
    if (!ctx.raster) return
    const page = (html: string, width: number, height: number, scale = 1) =>
      renderHtml(html, { width, height, scale, transparent: false })

    for (const [name, width, height] of WALLPAPERS) {
      for (const theme of ['dark', 'light'] as const) {
        // JPEG: a photo-sized picture of soft light, where PNG would be several times larger.
        const png = await page(wallpaper(width, height, theme), width, height)
        await ctx.jpeg(`media/wallpapers/lumovi-${name}-${theme}.jpg`, png, 92)
      }
    }

    await ctx.png('media/installer/dmg-background.png', await page(dmg(), 540, 380))
    await ctx.png('media/installer/dmg-background@2x.png', await page(dmg(), 540, 380, 2))
    const white: [number, number, number] = [255, 255, 255]
    const sidebarBmp = bmp(await rgba(await page(sidebar(), 164, 314)), white)
    ctx.file('media/installer/nsis-sidebar.bmp', sidebarBmp)
    ctx.file(
      'media/installer/nsis-header.bmp',
      bmp(await rgba(await page(header(), 150, 57)), white),
    )
  },
} satisfies Task
