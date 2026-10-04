/**
 * The brand book's page system: 16:9 pages, a type scale, and the few components every page is
 * made of (figures, spec lists, swatches, do and don't cards). Pages are HTML; the build prints
 * them to PDF with Chrome, so the logos stay vector and the fonts are embedded.
 */
import { blue, gray, INK, PAPER, status } from '../colors.ts'
import { document, horizontal, MARK, mark, stacked, VARIANTS, wordmarkOnly } from '../logo.ts'
import { FONTS } from '../scene.ts'
import { escape } from '../svg.ts'

/** A page, in CSS pixels: 16:9, the shape of the screens it's read on. */
export const W = 1600
export const H = 900

export interface Page {
  /** The page's title, for the contents and the PDF's outline. */
  title: string
  /** A dark page (dividers, covers), or a light one. */
  dark?: boolean
  /** No running footer: the cover and the back. */
  bare?: boolean
  html: string
}

export interface Section {
  number: string
  name: string
  summary: string
  pages: Page[]
}

/** Images the build renders for the book, and the repository's files, as URLs. */
export interface Assets {
  /** A file in the repository, by its path from the root. */
  file: (path: string) => string
  /** The cover's and the back cover's scenes, without text. */
  cover: string
  back: string
  /** The mark rendered at 16, 24, 32 and 48 pixels, enlarged with hard pixel edges. */
  pixels: Record<number, string>
  /** The Windows and Linux icon at 16, 24 and 32 pixels, enlarged the same way. */
  iconPixels: Record<number, string>
  /** The animated marks, paused at moments through their animations. */
  frames: { intro: { at: number; src: string }[]; loading: { at: number; src: string }[] }
}

export const CSS = `
${FONTS}
@page { size: ${W}px ${H}px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  color: ${INK};
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'cv11', 'ss01';
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  position: relative;
  width: ${W}px;
  height: ${H}px;
  overflow: hidden;
  background: ${PAPER};
  padding: 76px 96px 96px;
  break-after: page;
  display: flex;
  flex-direction: column;
}
.page.dark { background: ${gray[950]}; color: #ededed; }
.page.bare { padding: 0; }
.footer {
  position: absolute; left: 96px; right: 96px; bottom: 36px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; color: ${gray[500]}; letter-spacing: 0.01em;
}
.footer .brand { display: flex; align-items: center; gap: 8px; }
.footer svg { display: block; }
.dark .footer { color: ${gray[600]}; }

/* Type */
.eyebrow { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${gray[600]}; }
.dark .eyebrow { color: ${gray[500]}; }
h1, h2, h3 { margin: 0; font-variation-settings: 'opsz' 32; text-wrap: balance; }
h1 { font-size: 96px; font-weight: 650; letter-spacing: -0.045em; line-height: 1; }
h2 { font-size: 46px; font-weight: 650; letter-spacing: -0.035em; line-height: 1.06; margin-top: 14px; }
h3 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.3; }
.quiet { color: ${gray[400]}; }
.dark .quiet { color: ${gray[600]}; }
p { margin: 0; }
.lead { font-size: 21px; line-height: 1.5; color: ${gray[700]}; max-width: 34em; margin-top: 18px; text-wrap: pretty; }
.dark .lead { color: ${gray[400]}; }
.body { font-size: 16px; line-height: 1.62; color: ${gray[700]}; text-wrap: pretty; }
.body + .body { margin-top: 12px; }
.dark .body { color: ${gray[400]}; }
.small { font-size: 13px; line-height: 1.5; color: ${gray[600]}; }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-variant-ligatures: none; }
ul.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
ul.list li { position: relative; padding-left: 20px; font-size: 16px; line-height: 1.55; color: ${gray[700]}; }
ul.list li::before { content: ''; position: absolute; left: 2px; top: 10px; width: 6px; height: 6px; border-radius: 2px; background: ${gray[300]}; }
.dark ul.list li { color: ${gray[400]}; }
.dark ul.list li::before { background: ${gray[750]}; }
b, strong { font-weight: 600; color: ${INK}; }
.dark b, .dark strong { color: #ededed; }

/* Layout */
.head { flex: none; }
.content { flex: 1; min-height: 0; display: flex; gap: 64px; margin-top: 40px; }
.col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.text { width: 420px; flex: none; }
.fill { flex: 1; }
.center { align-items: center; justify-content: center; }
.grid { display: grid; gap: 16px; }
.row { display: flex; gap: 16px; }

/* Components */
.figure { position: relative; border-radius: 18px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.figure.paper { background: ${PAPER}; box-shadow: inset 0 0 0 1px ${gray[200]}; }
.figure.mist { background: ${gray[100]}; }
.figure.ink { background: ${gray[950]}; }
.figure.graphite { background: ${gray[800]}; }
.figure .caption { position: absolute; left: 20px; bottom: 16px; font-size: 13px; color: ${gray[600]}; }
.figure.ink .caption, .figure.graphite .caption { color: ${gray[500]}; }
.figure img { display: block; }
.specs { display: grid; grid-template-columns: auto 1fr; gap: 9px 22px; font-size: 14px; line-height: 1.45; margin: 0; }
.specs dt { color: ${gray[600]}; }
.specs dd { margin: 0; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 13px; color: ${INK}; }
.dark .specs dt { color: ${gray[500]}; }
.dark .specs dd { color: #ededed; }
.note { display: flex; gap: 14px; }
.note .n { flex: none; width: 24px; height: 24px; border-radius: 12px; background: ${INK}; color: ${PAPER}; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
.verdict { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
.verdict svg { flex: none; }
.ok { color: ${status.good}; }
.no { color: ${status.critical}; }
.rule { height: 1px; background: ${gray[200]}; }
.dark .rule { background: ${gray[800]}; }
table.data { border-collapse: collapse; width: 100%; font-size: 14px; }
table.data th { text-align: left; font-weight: 600; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${gray[600]}; padding: 0 12px 10px 0; border-bottom: 1px solid ${gray[200]}; }
table.data td { padding: 10px 12px 10px 0; border-bottom: 1px solid ${gray[150]}; vertical-align: middle; color: ${gray[700]}; }
table.data td.mono { font-size: 13px; color: ${INK}; }
.chip { display: inline-block; width: 14px; height: 14px; border-radius: 4px; vertical-align: -2px; margin-right: 8px; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08); }
.link { color: ${blue[600]}; }
`

/** A logo as inline SVG, `height` pixels tall. Kinds: logo, stacked, mark, wordmark. */
export function logo(
  kind: 'logo' | 'stacked' | 'mark' | 'wordmark',
  variant: 'on-dark' | 'on-light' | 'white' | 'black',
  height: number,
  style = '',
): string {
  const v = VARIANTS.find((x) => x.name === variant)!
  const l =
    kind === 'logo'
      ? horizontal(v)
      : kind === 'stacked'
        ? stacked(v)
        : kind === 'mark'
          ? mark(v)
          : wordmarkOnly(v)
  return document(l, height)
    .replace(' role="img"', ` role="img" style="display:block;${style}"`)
    .replace('<title>Lumovi</title>\n', '')
}

/** The horizontal logo's height for a mark `size` pixels tall. */
export function logoHeight(size: number): number {
  return (horizontal(VARIANTS[0]!).box.height / MARK) * size
}

/** A heading block: the section's number and name, the page's title, and a lead. */
export function head(eyebrow: string, title: string, lead?: string): string {
  return `<div class="head"><div class="eyebrow">${escape(eyebrow)}</div><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`
}

export function specs(rows: [string, string][]): string {
  return `<dl class="specs">${rows.map(([k, v]) => `<dt>${escape(k)}</dt><dd>${v}</dd>`).join('')}</dl>`
}

export function list(items: string[]): string {
  return `<ul class="list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
}

export function notes(items: string[]): string {
  return `<div class="col" style="gap:16px">${items
    .map(
      (text, i) =>
        `<div class="note"><span class="n">${i + 1}</span><div class="body">${text}</div></div>`,
    )
    .join('')}</div>`
}

const check = `<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${status.good}"/><path d="M5.2 9.3l2.4 2.4 5-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const cross = `<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${status.critical}"/><path d="M6 6l6 6m0-6l-6 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`

/** A small "Do" or "Don't" label. */
export function verdict(ok: boolean, text: string): string {
  return `<div class="verdict ${ok ? 'ok' : 'no'}">${ok ? check : cross}<span>${escape(text)}</span></div>`
}
