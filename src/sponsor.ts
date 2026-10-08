/**
 * The sponsor card: one card at the bottom of the app's sidebar, above its footer, in the
 * desktop app, the server's web UI and the fleet hub. Lumovi/main-sponsor's sponsor.json says
 * what it shows: nothing, Lumovi's own card, or a sponsor's.
 *
 * It's made of the sidebar's own parts, so it reads as part of it, not as an ad: a label like
 * the nav's section labels, over a quiet card like the cluster switcher, with a picture and one
 * line. Lumovi's own card and a sponsor's are the same size, so one replaces the other without
 * moving anything.
 */
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { themes, type Scheme } from './colors.ts'
import { FONTS, scene } from './scene.ts'
import { escape } from './svg.ts'

/** The card, in CSS pixels, and the app's tokens it's drawn with. */
export const card = {
  /** The sidebar's width, and its gutters: the card is as wide as the nav's items. */
  sidebar: 244,
  gutter: 12,
  width: 220,
  /** A 1-pixel `--line` along the top, as along the footer's: the card isn't part of the nav. */
  rule: 1,
  /** Space above the label, under the line, and below the card, above the footer. */
  above: 8,
  below: 12,
  /** The label: as the nav's section labels, `text-2xs font-medium tracking-wider uppercase`. */
  label: { text: 'Sponsor', size: 11, lineHeight: 16, inset: 10, gap: 4 },
  /** The card: `rounded-xl p-2 bg-surface-2`, its edge a 1-pixel `--line` inside it. */
  radius: 12,
  padding: 8,
  /** The picture: 3:1, its corners concentric with the card's. */
  image: { width: 204, height: 68, radius: 4 },
  /** The line under the picture: `text-xs text-ink-2`, inset 2 more to line up with the label. */
  line: { size: 12, lineHeight: 16, gap: 8, inset: 2 },
  /** The card's height: padding, picture, gap, line, padding. */
  height: 8 + 68 + 8 + 16 + 8,
  /** Hover and focus: the card's surface steps up, and the link's domain fades in. */
  transition: '150ms',
  /** Below this window height there's no card, and the nav keeps the room. */
  minWindowHeight: 720,
} as const

/** The room the card takes from the nav: the line, the label, the card and the space around them. */
export const ROOM =
  card.rule + card.above + card.label.lineHeight + card.label.gap + card.height + card.below

/** Lumovi's own card: built in, shown at launch, and whenever a sponsor's can't be. */
export const lumovi = {
  line: 'Help keep Lumovi free.',
  alt: 'Lumovi',
  /** Until sponsor.json gives another. */
  link: 'https://github.com/sponsors/Lumovi',
}

/** The pictures sponsors send, and the words that go with them. */
export const asset = {
  /** Twice the card's picture, for sharp screens: 3:1, exactly this size. */
  width: card.image.width * 2,
  height: card.image.height * 2,
  /** Keep logos and words this far inside each edge, at 2x: inside 360 × 88. */
  safe: 24,
  /** What's accepted, checked by the file's contents, not its name. */
  formats: ['PNG', 'WebP', 'GIF', 'animated WebP'],
  /** Bytes, per file. */
  maxBytes: { still: 150 * 1024, animated: 500 * 1024 },
  /** An animated picture plays once, for at most this long, then rests on its last frame. */
  maxSeconds: 5,
  /** The longest each piece of text may be, in characters. */
  text: { description: 32, name: 40, alt: 100, link: 200 },
  /** The line's room in the card, in CSS pixels of Inter at 12: wider is cut with an ellipsis. */
  lineWidth: card.width - 2 * (card.padding + card.line.inset),
} as const

/** How the card moves: as little as it can. */
export const motion = {
  /** Hover and focus: the surface and the domain change over this long. */
  hover: card.transition,
  /** One card replacing another, in place: the app's fade-in. */
  swap: '160ms ease-out',
} as const

/** The domain a link leads to, as the card shows it: the host, without `www.` */
export const domain = (link: string): string => new URL(link).hostname.replace(/^www\./, '')

/** Lumovi's own picture: the brand's scene, the mark standing on its floor, at 2x. */
export function lumoviArt(theme: Scheme): string {
  const size = 60
  return scene({
    width: asset.width,
    height: asset.height,
    theme,
    mark: { x: (asset.width - size) / 2, y: 26, size },
  })
}

/**
 * A placeholder sponsor's picture, at 2x, for mockups and tests: Acme, at acme.example, a
 * domain reserved for examples. Not a real company, and not to be shipped.
 */
export function exampleArt(theme: Scheme): string {
  const c =
    theme === 'light'
      ? { bg: '#efeefe', ink: '#3b2fa8', soft: '#d9d6fb' }
      : { bg: '#1c1936', ink: '#c4bdff', soft: '#2b2752' }
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { margin: 0; }
body { width: ${asset.width}px; height: ${asset.height}px; overflow: hidden; background: ${c.bg};
  background-image: repeating-linear-gradient(135deg, ${c.soft} 0 2px, transparent 2px 22px);
  font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: ${c.ink};
  display: flex; align-items: center; justify-content: center; gap: 18px; }
.name { font-size: 50px; font-weight: 700; letter-spacing: -0.04em; font-variation-settings: 'opsz' 32; }
.tag { font-size: 15px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  border: 2px solid currentColor; border-radius: 8px; padding: 4px 9px; opacity: 0.75; }
</style>
<svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" stroke-width="5"/><path d="M28 13 44 41H12Z" fill="currentColor"/></svg>
<span class="name">Acme</span><span class="tag">Example</span>`
}

/**
 * A template for sponsors, at the picture's size: its rounded corners, as the card cuts them,
 * and the safe area, to keep logos and words inside.
 */
export function template(): string {
  const { width: W, height: H, safe } = asset
  const r = card.image.radius * 2
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { margin: 0; }
body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden; font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased; color: #6b6b6b; font-size: 11px; line-height: 14px; }
.corners { position: absolute; inset: 0; border-radius: ${r}px; background: #efefef; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.14); }
.safe { position: absolute; left: ${safe}px; top: ${safe}px; right: ${safe}px; bottom: ${safe}px;
  border: 1px dashed #2675d3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; color: #1c5cab; }
.size { position: absolute; right: 8px; bottom: 5px; font-size: 10px; }
b { font-weight: 600; font-size: 12px; }
</style>
<div class="corners"></div>
<div class="safe"><b>Safe area, ${W - 2 * safe} × ${H - 2 * safe}</b><span>Logos and words stay inside</span></div>
<div class="size">${W} × ${H}</div>`
}

export const example = {
  name: 'Acme',
  line: 'Rockets, anvils and other gear.',
  alt: 'Acme',
  link: 'https://acme.example/',
}

/** What a card shows. */
export interface Content {
  /** Its picture, as a URL the mockup can load. */
  image: string
  alt: string
  line: string
  link: string
}

export type State = 'rest' | 'hover' | 'focus'

/** Lucide's arrow-up-right (ISC license), as the app draws icons: stroked, in the text color. */
const arrow = (size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`

/** A pointer, as macOS draws it, its tip at 0, 0. */
const POINTER = `<svg width="22" height="28" viewBox="-1 -1 22 28" style="position:absolute;filter:drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.35))"><path d="M0 0v20.5l4.9-4.6 3 7.1 3.4-1.4-3-7h6.8Z" fill="#000" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`

/** The app's tokens, as CSS custom properties, for one theme. */
const tokens = (scheme: Scheme) =>
  Object.entries(themes[scheme])
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ')

/** The card's CSS, written as the app would: its tokens, type and radii. */
export const CSS = `
.sponsor { border-top: ${card.rule}px solid var(--line); padding: ${card.above}px ${card.gutter}px ${card.below}px; font-feature-settings: 'cv11', 'ss01'; }
.sponsor .label { display: flex; align-items: center; gap: 4px; height: ${card.label.lineHeight}px; margin-bottom: ${card.label.gap}px; padding: 0 ${card.label.inset}px; font-size: ${card.label.size}px; line-height: ${card.label.lineHeight}px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sponsor .domain { display: flex; align-items: center; gap: 3px; margin-left: auto; min-width: 0; font-family: 'JetBrains Mono', monospace; font-weight: 400; letter-spacing: 0; text-transform: none; opacity: 0; transition: opacity ${card.transition}; }
.sponsor .domain svg { flex: none; }
.sponsor .card { position: relative; display: block; padding: ${card.padding}px; border-radius: ${card.radius}px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); text-decoration: none; transition: background-color ${card.transition}; outline: none; }
.sponsor .image { position: relative; display: block; width: ${card.image.width}px; height: ${card.image.height}px; border-radius: ${card.image.radius}px; overflow: hidden; background: var(--surface); }
.sponsor .image img { display: block; width: 100%; height: 100%; }
.sponsor .image::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px var(--line); }
.sponsor .line { display: block; padding: ${card.line.gap}px ${card.line.inset}px 0; font-size: ${card.line.size}px; line-height: ${card.line.lineHeight}px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sponsor.hover .card { background: var(--surface-3); }
.sponsor.focus .card { outline: 2px solid var(--accent); outline-offset: 1px; }
.sponsor.hover .domain, .sponsor.focus .domain { opacity: 1; }
`

/** The card, in a theme's tokens (set them on an ancestor), in one of its states. */
export function sponsorCard(c: Content, state: State = 'rest', pointer = false): string {
  return `<section class="sponsor ${state}" aria-label="Sponsor">
  <div class="label" aria-hidden="true"><span>${card.label.text}</span><span class="domain">${escape(domain(c.link))}${arrow(12)}</span></div>
  <a class="card" href="${escape(c.link)}">
    <span class="image"><img src="${c.image}" alt="${escape(c.alt)}"></span>
    <span class="line">${escape(c.line)}</span>
    ${pointer ? `<span style="position:absolute;left:118px;top:52px">${POINTER}</span>` : ''}
  </a>
</section>`
}

const SCREENSHOTS = join(import.meta.dirname, '..', 'sources', 'screenshots')

/** The app's real window, 1440 × 900, as its screenshots show it. */
export const WINDOW = { width: 1440, height: 900 }
/** In the screenshots: where the nav starts, under the cluster, and the footer's 1-pixel line. */
const NAV = 77
const FOOTER = 851
/** The version the footer shows: the app's screenshots are taken with an older one. */
export const VERSION = '1.14.0'
/** How far the nav fades out at an edge where it goes on: a little less than one of its rows. */
export const FADE = 24

export type Mode = 'none' | 'lumovi' | 'sponsor'

export interface SidebarOptions {
  state?: State
  /** The part of the sidebar shown, at its real size. */
  view?: { top: number; height: number }
  /** How far the nav is scrolled. The screenshot has the nav down to the footer, so with the
   * card that's at most its room. */
  scroll?: number
}

/** The real sidebar, from the app's own screenshot, with the card in it. */
export function sidebar(
  scheme: Scheme,
  mode: Mode,
  content: Record<Exclude<Mode, 'none'>, Content>,
  o: SidebarOptions = {},
): string {
  const { state = 'rest', view = { top: 0, height: WINDOW.height }, scroll = 0 } = o
  const t = themes[scheme]
  const shot = pathToFileURL(join(SCREENSHOTS, `overview-${scheme}.webp`)).href
  const img = (top: number) =>
    `<img src="${shot}" style="position:absolute;left:0;top:${top}px;width:${WINDOW.width}px;height:${WINDOW.height}px;display:block">`
  const band = (top: number, height: number, inner: string, style = '') =>
    `<div style="position:absolute;left:0;top:${top - view.top}px;width:${card.sidebar}px;height:${height}px;overflow:hidden;${style}">${inner}</div>`
  // The nav, scrolled. With the card, it goes on below at every scroll the screenshot can
  // show, so it fades out at the bottom, and at the top once it's scrolled.
  const bottom = mode === 'none' ? FOOTER : FOOTER - ROOM
  const fade = `mask-image:linear-gradient(to bottom, ${scroll > 0 ? `transparent, #000 ${FADE}px` : '#000'}, #000 calc(100% - ${FADE}px), transparent)`
  return `<div class="app" style="${tokens(scheme)};position:relative;width:${card.sidebar}px;height:${view.height}px;overflow:hidden;background:${t['app-bg']}">
  ${band(0, NAV, img(0))}
  ${band(NAV, bottom - NAV, img(-NAV - scroll), mode === 'none' ? '' : fade)}
  ${mode === 'none' ? '' : band(bottom, ROOM, sponsorCard(content[mode], state, state === 'hover'))}
  ${band(FOOTER, WINDOW.height - FOOTER, `${img(-FOOTER)}<span style="position:absolute;right:${card.gutter}px;top:9px;width:52px;height:32px;padding-right:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:flex-end;background:${t['app-bg']};font-size:11px;line-height:16px;color:${t['text-3']};font-variant-numeric:tabular-nums;font-feature-settings:'cv11','ss01','tnum'">v${VERSION}</span>`)}
</div>`
}

/** A page for the mockups: the fonts, and the card's CSS. */
export function page(body: string, width: number, css = ''): string {
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { margin: 0; background: transparent; }
body { width: ${width}px; font-family: 'Inter', sans-serif; font-size: 13px; -webkit-font-smoothing: antialiased; }
${CSS}
${css}
</style>${body}`
}

const kb = (bytes: number) => `${bytes / 1024} KB`

/**
 * The spec sponsors get, written from the numbers above, so it can't disagree with the card:
 * ready to go in Lumovi/main-sponsor's README, with this folder's template and previews.
 */
export function spec(): string {
  const { width: W, height: H, safe } = asset
  const light = themes.light
  const dark = themes.dark
  return `# Sponsoring Lumovi: the card, and what to send

Lumovi has one sponsor at a time. Their card sits at the bottom of the app's sidebar, above its
footer, in the desktop app, in the web UI Lumovi serves from a cluster, and in the fleet hub,
in light mode and dark. It's a picture, one line of text and a link, under the label
"${card.label.text}".

<img src="preview-light.png" width="244" alt="The bottom of Lumovi's sidebar in light mode: the Sponsor label, and a card with Acme's picture and its line." /> <img src="preview-dark.png" width="244" alt="The same, in dark mode." />

_Acme, at acme.example, is a placeholder: not a real company._

## The picture

<img src="template.png" width="${W}" alt="The template: a ${W} by ${H} canvas with rounded corners, and the safe area marked inside it." />

| | |
| --- | --- |
| **Size** | **${W} × ${H} pixels**, exactly (3:1). The card shows it at ${card.image.width} × ${card.image.height}, at twice the density, so it's sharp on every screen. |
| **Safe area** | Keep logos and words at least ${safe} pixels from every edge: inside the middle ${W - 2 * safe} × ${H - 2 * safe}. |
| **Corners** | The card rounds them by ${card.image.radius * 2} pixels, and draws a 1-pixel line around the picture. Don't draw your own border. |
| **Light and dark** | **Two versions, one for each mode.** Each is shown only in its mode, on the card's own color: \`${light['surface-2']}\` in light mode and \`${dark['surface-2']}\` in dark. |
| **Background** | Fill it, or leave it transparent: transparent pixels show \`${light.surface}\` in light mode and \`${dark.surface}\` in dark. |
| **Formats** | PNG, WebP, GIF or animated WebP, checked by what the file is, not its name. Not SVG, JPEG or AVIF. |
| **File size** | Up to ${kb(asset.maxBytes.still)} for a still picture, and ${kb(asset.maxBytes.animated)} for an animated one, each. |

[\`template.png\`](template.png) is the canvas at its size, with the corners and the safe area.

## Animation

An animated picture is welcome, as long as it stays calm: Lumovi is open while people fix
things.

- **It plays once**, when the card appears, for **${asset.maxSeconds} seconds at most**, then rests on its last
  frame. A file set to loop isn't accepted: send a GIF with no loop (no NETSCAPE2.0 block), or
  an animated WebP with a loop count of 1.
- **Its first frame stands on its own.** People who ask their system for less motion see only
  that frame, so it shows your logo and anything you need to say. The last frame is where it
  rests: best the same as the first.
- **No flashing** (never more than three flashes a second), and nothing fast.

## The words

| Field | Up to | |
| --- | --- | --- |
| \`description\` | ${asset.text.description} characters | The line under the picture: one line of plain text, in sentence case, with no emoji, links or line breaks. It's ${asset.lineWidth} pixels wide in Inter at 12 pixels; a longer line is cut with an ellipsis. |
| \`name\` | ${asset.text.name} characters | Your name, as people say it. |
| \`alt\` | ${asset.text.alt} characters | What the picture says, for people who use a screen reader. Often just your name. |
| \`link\` | ${asset.text.link} characters | Where the card leads: an \`https\` address. |

## The link

- **\`https\` only.** People see its domain when they point at the card or move to it with the
  keyboard, so make it your own domain, not a redirect or a link shortener.
- It opens in the browser. Lumovi adds nothing to it and sends no referrer; you may add your own
  campaign parameters.
- **Lumovi counts nothing**: no views, no clicks. The app only reads this repository, as it reads
  GitHub for its updates.

## sponsor.json

What the card shows. Every Lumovi reads it from this repository's main branch: the desktop app
a few seconds after it starts, and a Lumovi server for the pages it serves; then every hour. So a
change here shows everywhere within the hour (GitHub's caching can add a few minutes), with no
release.

\`\`\`json
{
  "version": 1,
  "mode": "sponsor",
  "lumovi": { "link": "${lumovi.link}" },
  "sponsor": {
    "name": "${example.name}",
    "description": "${example.line}",
    "link": "${example.link}",
    "alt": "${example.alt}",
    "image": { "light": "acme-light.png", "dark": "acme-dark.png" },
    "until": "2026-12-31"
  }
}
\`\`\`

| Field | |
| --- | --- |
| \`version\` | \`1\`. |
| \`mode\` | \`"none"\`: no card, and the sidebar is as it's always been. \`"lumovi"\`: Lumovi's own card, "${lumovi.line}". \`"sponsor"\`: the sponsor's card. |
| \`lumovi.link\` | Where Lumovi's own card leads, as an \`https\` address. Optional: without it, [Lumovi's GitHub Sponsors page](${lumovi.link}). |
| \`sponsor\` | The sponsor's card, with the words above. It must be there when \`mode\` is \`"sponsor"\`, and it's checked whenever it's there. |
| \`sponsor.image\` | The pictures' file names, next to \`sponsor.json\`, one for \`light\` mode and one for \`dark\`: letters, digits, \`.\`, \`_\` and \`-\`. |
| \`sponsor.until\` | The card's last day, as \`YYYY-MM-DD\`: it shows until the end of that day, UTC. Optional. After it, Lumovi shows its own card. |

Nothing else goes in it: a misspelt field fails the check, rather than being quietly ignored.
Every change comes as a pull request, and merges once the check passes.

## What's checked

Every change to this repository is checked: the pictures' real type, their size in pixels and in
bytes, their animation, the words' lengths and the link. The app checks again what it reads. If
anything doesn't pass, or can't be reached, Lumovi shows its own card instead: never an empty or
broken one.
`
}

/** The bottom of the sidebar: the last of the nav, the card and the footer. */
export const BOTTOM = { top: 568, height: WINDOW.height - 568 }

/** Lumovi's card and the placeholder sponsor's, with their pictures rendered to PNG. */
export function contents(
  lumoviPng: Buffer,
  examplePng: Buffer,
): Record<'lumovi' | 'sponsor', Content> {
  const uri = (png: Buffer) => `data:image/png;base64,${png.toString('base64')}`
  return {
    lumovi: { image: uri(lumoviPng), alt: lumovi.alt, line: lumovi.line, link: lumovi.link },
    sponsor: { image: uri(examplePng), alt: example.alt, line: example.line, link: example.link },
  }
}
