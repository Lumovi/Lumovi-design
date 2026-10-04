// Renders SVG and HTML to PNG with Chrome (through Playwright), so filters, blend modes and
// fonts look exactly as they do in a browser, then compresses the PNG losslessly with sharp.
import { mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { chromium, type Browser } from 'playwright'
import sharp from 'sharp'

let browser: Promise<Browser> | undefined
const scratch = mkdtempSync(join(tmpdir(), 'lumovi-'))

/**
 * Rasterize on the CPU, in one thread: large pictures with blurs otherwise come out a little
 * different from one run to the next, and the same source should make the same file.
 */
const ARGS = ['--disable-gpu', '--num-raster-threads=1', '--disable-partial-raster']

/** The installed Google Chrome, or Playwright's Chromium where there's none (as in CI). */
function launch(): Promise<Browser> {
  browser ??= chromium
    .launch({ channel: 'chrome', args: ARGS })
    .catch(() => chromium.launch({ args: ARGS }))
  return browser
}

export async function closeRenderer(): Promise<void> {
  if (browser) await (await browser).close()
  rmSync(scratch, { recursive: true, force: true })
}

export interface RenderOptions {
  width: number
  /** The page's height, or 'fit' for the height of what's on it. */
  height: number | 'fit'
  /** Device pixels per CSS pixel: 2 renders a 1200 × 630 page at 2400 × 1260. */
  scale?: number
  /** Keep transparency (the default); false renders on the page's own background. */
  transparent?: boolean
  /** JavaScript to run in the page before it's captured, such as pausing its animations. */
  prepare?: string
}

/** Renders an HTML page to PNG bytes. */
export async function renderHtml(html: string, options: RenderOptions): Promise<Buffer> {
  const { width, scale = 1, transparent = true } = options
  const browser = await launch()
  const page = await browser.newPage({
    viewport: { width, height: options.height === 'fit' ? 1 : options.height },
    deviceScaleFactor: scale,
  })
  try {
    // From a file, so the page can load fonts from node_modules.
    const file = join(scratch, `${Math.random().toString(36).slice(2)}.html`)
    writeFileSync(file, html)
    await page.goto(`file://${file}`)
    await page.evaluate(() => document.fonts.ready)
    if (options.prepare) await page.evaluate(options.prepare)
    if (options.height === 'fit') {
      return await page.screenshot({ omitBackground: transparent, fullPage: true })
    }
    return await page.screenshot({
      omitBackground: transparent,
      clip: { x: 0, y: 0, width, height: options.height },
    })
  } finally {
    await page.close()
  }
}

/**
 * Prints an HTML document to PDF, at the page size its CSS sets, with an outline from its
 * headings. Chrome stamps the time it was made; that's set to a fixed date, so the same
 * document makes the same file.
 */
export async function renderPdf(html: string): Promise<Buffer> {
  const page = await (await launch()).newPage()
  try {
    const file = join(scratch, `${Math.random().toString(36).slice(2)}.html`)
    writeFileSync(file, html)
    await page.goto(`file://${file}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const pdf = await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      outline: true,
      tagged: true,
    })
    return Buffer.from(
      pdf
        .toString('latin1')
        .replace(/\(D:\d{14}[^)]*\)/g, (stamp) => stamp.replace(/\d{14}/, '20260101000000')),
      'latin1',
    )
  } finally {
    await page.close()
  }
}

/** Renders an SVG document to PNG bytes at the given size. */
export function renderSvg(svg: string, width: number, height = width): Promise<Buffer> {
  return renderHtml(
    `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${width}px;height:${height}px}</style>${svg}`,
    { width, height },
  )
}

/** Compresses a PNG losslessly. */
export function optimize(png: Buffer): Promise<Buffer> {
  return sharp(png).png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer()
}

/** Writes a PNG, compressed losslessly. */
export async function writePng(path: string, png: Buffer): Promise<void> {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, await optimize(png))
}

/** Writes a lossless WebP, for the web, beside or instead of a PNG. */
export async function writeWebp(path: string, png: Buffer, quality?: number): Promise<void> {
  mkdirSync(dirname(path), { recursive: true })
  const image = sharp(png)
  const out = await (
    quality
      ? image.webp({ quality, effort: 6, smartSubsample: true })
      : image.webp({ lossless: true, effort: 6 })
  ).toBuffer()
  writeFileSync(path, out)
}

/** Writes a JPEG, for photos and large images where PNG would be heavy. */
export async function writeJpeg(path: string, png: Buffer, quality = 90): Promise<void> {
  mkdirSync(dirname(path), { recursive: true })
  const out = await sharp(png)
    .flatten()
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer()
  writeFileSync(path, out)
}

/** Decodes a PNG to raw RGBA pixels. */
export async function rgba(png: Buffer): Promise<{ data: Buffer; width: number; height: number }> {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}
