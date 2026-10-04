// guidelines/lumovi-brand-guidelines.pdf: the brand guidelines as a designed book, printed from
// src/book with Chrome. It's built last, from the assets the other tasks make.
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import sharp from 'sharp'
import { intro, loading } from '../../src/animation.ts'
import { book } from '../../src/book/index.ts'
import { H, W, type Assets } from '../../src/book/kit.ts'
import { plated } from '../../src/icon.ts'
import { document, mark, VARIANTS } from '../../src/logo.ts'
import { scene } from '../../src/scene.ts'
import { renderHtml, renderPdf, renderSvg } from '../lib/render.ts'
import { root, type Task } from '../lib/task.ts'

const dataUrl = (png: Buffer) => `data:image/png;base64,${png.toString('base64')}`

/** A small image enlarged with hard pixel edges, so a PDF viewer can't blur them. */
async function enlarged(png: Buffer, size: number): Promise<string> {
  return dataUrl(await sharp(png).resize(size, size, { kernel: 'nearest' }).png().toBuffer())
}

/** An animated mark, paused at a moment, on graphite. */
async function frame(svg: string, at: number): Promise<string> {
  const png = await renderHtml(
    `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:128px;height:128px}</style>${svg}`,
    {
      width: 128,
      height: 128,
      scale: 2,
      prepare: `document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${at} })`,
    },
  )
  return dataUrl(png)
}

export async function assets(): Promise<Assets> {
  const onLight = VARIANTS.find((v) => v.name === 'on-light')!
  const page = (html: string) =>
    renderHtml(html, { width: W, height: H, scale: 2, transparent: false })
  const pixels: Record<number, string> = {}
  for (const px of [16, 24, 32, 48]) {
    pixels[px] = await enlarged(await renderSvg(document(mark(onLight), px), px), 240)
  }
  const iconPixels: Record<number, string> = {}
  for (const px of [16, 24, 32]) {
    iconPixels[px] = await enlarged(await renderSvg(plated(px, `book-${px}`), px), 168)
  }
  const introSvg = intro('dark', 'book-intro')
  const loadingSvg = loading('dark', 'book-loading')
  return {
    file: (path) => pathToFileURL(join(root, path)).href,
    cover: dataUrl(
      await page(
        scene({ width: W, height: H, theme: 'dark', mark: { x: 1010, y: 190, size: 400 } }),
      ),
    ),
    back: dataUrl(
      await page(
        scene({ width: W, height: H, theme: 'dark', mark: { x: 670, y: 150, size: 260 } }),
      ),
    ),
    pixels,
    iconPixels,
    frames: {
      intro: await Promise.all(
        [0, 200, 400, 600, 900, 1300].map(async (at) => ({ at, src: await frame(introSvg, at) })),
      ),
      loading: await Promise.all(
        [0, 550, 1100, 1650].map(async (at) => ({ at, src: await frame(loadingSvg, at) })),
      ),
    },
  }
}

export default {
  name: 'book',
  outputs: ['guidelines/lumovi-brand-guidelines.pdf'],
  async build(ctx) {
    if (!ctx.raster) return
    const a = await assets()
    ctx.file('guidelines/lumovi-brand-guidelines.pdf', await renderPdf(book(a)))
  },
} satisfies Task
