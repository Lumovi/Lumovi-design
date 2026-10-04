// guidelines/images/: the pictures in the brand guidelines, drawn from the same sources as the
// assets, so they can't disagree with them.
import sharp from 'sharp'
import { blue, brand, gray, INK, PAPER, status } from '../../src/colors.ts'
import { macos, plated } from '../../src/icon.ts'
import {
  document,
  GAP,
  horizontal,
  MARK,
  mark,
  stacked,
  VARIANTS,
  wordmarkOnly,
  type Logo,
} from '../../src/logo.ts'
import { GRID, geometry, shapes } from '../../src/mark.ts'
import { FONTS, scene } from '../../src/scene.ts'
import { n } from '../../src/svg.ts'
import { wordmark } from '../../src/wordmark.ts'
import { renderHtml } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/** Pictures are 1000 pixels wide, rendered at 2x. */
const WIDTH = 1000

type Kind = 'logo' | 'stacked' | 'mark' | 'wordmark'

/** A logo as inline SVG, `height` pixels tall. */
function logo(kind: Kind, name: string, height: number, style = ''): string {
  const v = VARIANTS.find((variant) => variant.name === name)!
  const l: Logo =
    kind === 'logo'
      ? horizontal(v)
      : kind === 'stacked'
        ? stacked(v)
        : kind === 'mark'
          ? mark(v)
          : wordmarkOnly(v)
  return document(l, height)
    .replace(' role="img"', ` role="img" style="display:block;${style}"`)
    .replace(/<title>Lumovi<\/title>\n/, '')
}

/** The horizontal logo's height for a mark `size` pixels tall. */
const logoHeight = (size: number) => (horizontal(VARIANTS[0]!).box.height / MARK) * size

const page = (body: string, css = '') => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { margin: 0; background: transparent; }
body { width: ${WIDTH}px; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: ${INK}; }
.sheet { border-radius: 20px; overflow: hidden; }
.tile { display: flex; align-items: center; justify-content: center; position: relative; }
.graphite { background: ${gray[950]}; color: #ededed; }
.light { background: ${PAPER}; }
.mist { background: ${gray[100]}; }
.label { position: absolute; left: 20px; bottom: 16px; font-size: 13px; color: ${gray[600]}; letter-spacing: 0.01em; }
.graphite .label { color: ${gray[500]}; }
.grid { display: grid; gap: 2px; background: ${gray[200]}; }
${css}
</style>${body}`

const shoot = (html: string) => renderHtml(html, { width: WIDTH, height: 'fit', scale: 2 })

/** Rounds a picture's corners, as the sheets' are: for scenes, which fill their page. */
async function rounded(png: Buffer, radius = 20 * 2): Promise<Buffer> {
  const { width = 0, height = 0 } = await sharp(png).metadata()
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}"/></svg>`
  return sharp(png)
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
    .png()
    .toBuffer()
}

const COVER_HEIGHT = 440

/** The cover: the logo standing on its floor. */
function coverScene(): string {
  const size = 112
  // The lockup, as in logo/: the capitals a little shorter than the mark, centered on it.
  const s = size / MARK
  const cap = wordmark.capHeight * s
  const x = (WIDTH - (size + (GAP + wordmark.width) * s)) / 2
  const y = 150
  const baseline = y + size / 2 + cap / 2
  return scene({
    width: WIDTH,
    height: COVER_HEIGHT,
    theme: 'dark',
    mark: { x, y, size },
    css: '.wm { position: absolute; } .wm svg { display: block; }',
    content: `<div class="wm" style="left:${x + size + GAP * s}px;top:${baseline - wordmark.top * s}px">${logo('wordmark', 'white', (wordmark.top + wordmark.bottom) * s)}</div>`,
  })
}

function versions(): string {
  const t = (cls: string, content: string, label: string, h: number, style = '') =>
    `<div class="tile ${cls}" style="height:${h}px;${style}">${content}<span class="label"${style ? ' style="color:rgb(255 255 255 / 0.75)"' : ''}>${label}</span></div>`
  return page(`<div class="sheet grid" style="grid-template-columns:1fr 1fr">
    ${t('graphite', logo('logo', 'on-dark', logoHeight(52)), 'Logo, on dark', 220)}
    ${t('light', logo('logo', 'on-light', logoHeight(52)), 'Logo, on light', 220)}
    ${t('graphite', logo('stacked', 'on-dark', 150), 'Stacked', 260)}
    ${t('light', logo('stacked', 'on-light', 150), 'Stacked', 260)}
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:2px">
      ${t('graphite', logo('mark', 'on-dark', 96), 'Mark', 200)}
      ${t('graphite', logo('mark', 'white', 96), 'One color', 200)}
    </div>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:2px">
      ${t('light', logo('mark', 'on-light', 96), 'Mark', 200)}
      ${t('light', logo('mark', 'black', 96), 'One color', 200)}
    </div>
    ${t('graphite', logo('wordmark', 'white', 56), 'Wordmark', 170)}
    ${t('light', logo('wordmark', 'black', 56), 'Wordmark', 170)}
    ${t('', logo('logo', 'white', logoHeight(46)), 'One color, on Blue', 160, `background:${blue[600]}`)}
    ${t('mist', logo('logo', 'black', logoHeight(46)), 'One color', 160)}
  </div>`)
}

/** The mark on its grid, with the circles it's drawn from. */
function construction(): string {
  const { light, shade, cut } = shapes()
  const r = geometry.corner
  const u = 9.5 // pixels per unit
  const pad = 10
  const box = GRID + pad * 2
  const lines: string[] = []
  for (let i = 0; i <= GRID; i += 3) {
    const strong = i % 12 === 0
    const o = strong ? 0.2 : 0.08
    const w = strong ? 0.12 : 0.08
    lines.push(
      `<line x1="${i}" y1="0" x2="${i}" y2="${GRID}" stroke="${INK}" stroke-opacity="${o}" stroke-width="${w}"/>`,
      `<line x1="0" y1="${i}" x2="${GRID}" y2="${i}" stroke="${INK}" stroke-opacity="${o}" stroke-width="${w}"/>`,
    )
  }
  const dash = `fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="0.14" stroke-dasharray="0.6 0.5"`
  const text = (x: number, y: number, s: string, anchor = 'middle', color: string = INK) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="1.7" font-weight="550" fill="${color}" font-family="Inter">${s}</text>`
  const dim = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${INK}" stroke-width="0.14" marker-start="url(#tick)" marker-end="url(#tick)"/>`
  const diagonal = Math.SQRT1_2
  const svg = `<svg viewBox="${-pad} ${-pad} ${box} ${box}" width="${box * u}" height="${box * u}" style="display:block">
    <defs><marker id="tick" viewBox="-1 -1 2 2" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 -1V1" stroke="${INK}" stroke-width="0.5"/></marker>
    <clipPath id="frame"><rect x="-0.5" y="-0.5" width="${GRID + 1}" height="${GRID + 1}"/></clipPath></defs>
    <rect x="0" y="0" width="${GRID}" height="${GRID}" fill="${PAPER}"/>
    ${lines.join('\n')}
    <path d="${shade}" fill="${gray[300]}" fill-opacity="0.7"/>
    <path d="${light}" fill="${INK}" fill-opacity="0.85"/>
    <g clip-path="url(#frame)">
      <circle cx="0" cy="${GRID}" r="${geometry.light}" ${dash}/>
      <circle cx="0" cy="${GRID}" r="${cut}" ${dash}/>
    </g>
    ${[
      [r, r],
      [GRID - r, r],
      [GRID - r, GRID - r],
      [r, GRID - r],
    ]
      .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${dash}/>`)
      .join('')}
    <circle cx="0" cy="${GRID}" r="0.5" fill="${INK}"/>
    ${dim(0, -4, GRID, -4)}${text(24, -5.4, '48')}
    ${dim(0, GRID + 4, geometry.light, GRID + 4)}${text(15, GRID + 7.6, 'R 30')}
    ${dim(geometry.light, GRID + 4, cut, GRID + 4)}${text(33, GRID + 7.6, '6')}
    ${dim(GRID + 4, 0, GRID + 4, r)}${text(GRID + 5.6, 6.6, 'R 12', 'start')}
    ${text(cut * diagonal + 1.6, GRID - cut * diagonal - 1, 'R 36', 'start')}
  </svg>`
  return page(
    `<div class="sheet mist" style="display:flex;align-items:center;gap:56px;padding:36px 56px">
      ${svg}
      <div style="font-size:15px;line-height:1.6;color:${gray[700]};max-width:310px">
        <div style="font-size:20px;font-weight:600;color:${INK};margin-bottom:12px;letter-spacing:-0.01em">Only circles</div>
        A 48-unit square with corners of radius 12. The light is a quarter circle of radius 30
        from the bottom-left corner; the shade starts 6 further out, at 36. As 36 and 12 make
        48, the shade's ends meet the edges exactly where the corners begin.
        <div style="margin-top:14px">Every measure is a multiple of 3, so at 16 pixels the square's edges fall on pixels.</div>
      </div>
    </div>`,
  )
}

function clearSpace(): string {
  const size = 84
  const x = size / 2
  const zone = `background: repeating-linear-gradient(45deg, ${gray[200]} 0 6px, ${gray[100]} 6px 12px);`
  return page(
    `<div class="sheet mist" style="padding:56px 56px 52px;display:flex;justify-content:center;position:relative">
      <div style="position:relative;padding:${x}px;${zone};outline:1.5px dashed ${gray[500]};outline-offset:-0.75px">
        <div style="background:${gray[100]};outline:1.5px dashed ${gray[500]}">${logo('logo', 'on-light', logoHeight(size))}</div>
        <div style="position:absolute;left:0;top:0;width:${x}px;height:${x}px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:${gray[700]}">x</div>
        <div style="position:absolute;right:0;bottom:0;width:${x}px;height:${x}px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:${gray[700]}">x</div>
      </div>
      <div style="position:absolute;left:56px;bottom:20px;font-size:13px;color:${gray[600]}">x = half the mark's height</div>
    </div>`,
  )
}

function minimumSize(): string {
  const t = (content: string, label: string) =>
    `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:18px;height:120px">${content}<span style="font-size:13px;color:${gray[600]}">${label}</span></div>`
  return page(
    `<div class="sheet mist" style="display:flex;justify-content:space-around;align-items:flex-end;padding:48px 40px 36px">
      ${t(logo('logo', 'on-light', logoHeight(18)), 'Logo: the mark 18 px tall')}
      ${t(logo('stacked', 'on-light', 64), 'Stacked: 64 px tall')}
      ${t(logo('mark', 'on-light', 16), 'Mark: 16 px')}
      ${t(logo('wordmark', 'black', 14 * ((wordmark.top + wordmark.bottom) / wordmark.capHeight)), 'Wordmark: capitals 14 px tall')}
    </div>`,
  )
}

function backgrounds(): string {
  const t = (style: string, name: string, label: string) =>
    `<div class="tile" style="height:170px;${style}">${logo('logo', name, logoHeight(46))}<span class="label" style="color:inherit;opacity:0.7">${label}</span></div>`
  return page(`<div class="sheet grid" style="grid-template-columns:repeat(3,1fr)">
    ${t(`background:${gray[800]};color:#fff`, 'on-dark', 'Graphite')}
    ${t(`background:${gray[950]};color:#fff`, 'on-dark', 'The app, dark')}
    ${t(`background:${PAPER};color:#000`, 'on-light', 'Paper')}
    ${t(`background:${gray[100]};color:#000`, 'on-light', 'The app, light')}
    ${t(`background:${blue[600]};color:#fff`, 'white', 'Blue: white')}
    ${t(`background:linear-gradient(135deg, ${gray[600]}, ${gray[900]});color:#fff`, 'white', 'Photos and gradients: white')}
  </div>`)
}

/** The logo beside its wordmark, drawn with other paint: for the things to avoid. */
function altered(
  p: { light: string; shade: string; letters: string; outline?: boolean },
  height: number,
): string {
  const { box } = horizontal(VARIANTS[0]!)
  const top = -wordmark.capHeight / 2 - MARK / 2
  // Strokes in each part's own units: the mark's 48-unit square, and the wordmark's font units.
  const fill = (color: string, stroke: number) =>
    p.outline ? `fill="none" stroke="${color}" stroke-width="${stroke}"` : `fill="${color}"`
  const { light, shade } = shapes()
  return `<svg viewBox="${[box.x, box.y, box.width, box.height].map((v) => n(v)).join(' ')}" height="${n(height)}" style="display:block">
    <g transform="translate(0 ${n(top)}) scale(${n(MARK / GRID, 5)})"><path d="${shade}" ${fill(p.shade, 0.9)}/><path d="${light}" ${fill(p.light, 0.9)}/></g>
    <path transform="translate(${MARK + GAP} 0)" d="${wordmark.letters}" ${fill(p.letters, 22)}/>
  </svg>`
}

function misuse(): string {
  const no = `<svg width="22" height="22" viewBox="0 0 22 22" style="position:absolute;top:14px;right:14px"><circle cx="11" cy="11" r="11" fill="${status.critical}"/><path d="M7.5 7.5l7 7m0-7l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`
  const t = (content: string, label: string, bg: string = PAPER) =>
    `<div class="tile" style="height:170px;background:${bg}">${content}${no}<span class="label"${bg === PAPER ? '' : ' style="color:rgb(255 255 255 / 0.8)"'}>${label}</span></div>`
  const lockup = (style = '', name = 'on-light') => logo('logo', name, logoHeight(34), style)
  const recolored = altered({ light: '#e5484d', shade: '#f5a524', letters: INK }, logoHeight(34))
  const outlined = altered({ light: INK, shade: INK, letters: INK, outline: true }, logoHeight(34))
  return page(`<div class="sheet grid" style="grid-template-columns:repeat(4,1fr)">
    ${t(recolored, 'Change its colors')}
    ${t(lockup('transform:scaleX(1.35)'), 'Stretch or squash it')}
    ${t(lockup('transform:rotate(-12deg)'), 'Turn it')}
    ${t(lockup('filter:drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))'), 'Add shadows or effects')}
    ${t(outlined, 'Outline it')}
    ${t(logo('mark', 'on-light', 70, 'transform:scaleX(-1)'), 'Flip the mark')}
    ${t(`<div style="display:flex;align-items:center;gap:12px">${logo('mark', 'on-light', 36)}<span style="font-family:'JetBrains Mono';font-size:36px;font-weight:500;letter-spacing:-0.02em">Lumovi</span></div>`, 'Set the name in another type')}
    ${t(lockup('', 'on-light'), 'Put it where it gets lost', gray[600])}
  </div>`)
}

function palette(): string {
  const text = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
      number,
      number,
      number,
    ]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? INK : PAPER
  }
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')
  const big = Object.values(brand)
    .map(
      (
        c,
      ) => `<div style="background:${c.hex};color:${text(c.hex)};padding:18px;height:130px;display:flex;flex-direction:column;justify-content:flex-end">
        <div style="font-size:15px;font-weight:600">${c.name}</div>
        <div style="font-size:12px;opacity:0.75;margin-top:4px;font-family:'JetBrains Mono'">${c.hex}<br>rgb ${rgb(c.hex)}</div>
      </div>`,
    )
    .join('')
  const row = (name: string, scale: Record<string, string>) => `
    <div style="display:flex;align-items:stretch">
      <div style="width:76px;font-size:13px;font-weight:600;display:flex;align-items:center">${name}</div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${Object.keys(scale).length},1fr);border-radius:10px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">
        ${Object.entries(scale)
          .map(
            ([
              step,
              hex,
            ]) => `<div style="background:${hex};color:${text(hex)};height:64px;padding:8px 6px;display:flex;flex-direction:column;justify-content:space-between">
              <span style="font-size:11px;font-weight:600">${step}</span><span style="font-size:9.5px;font-family:'JetBrains Mono';opacity:0.8">${hex.slice(1)}</span></div>`,
          )
          .join('')}
      </div>
    </div>`
  return page(`<div class="sheet light" style="padding:28px;box-shadow:inset 0 0 0 1px ${gray[200]}">
    <div style="display:grid;grid-template-columns:repeat(6,1fr);border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">${big}</div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">
      ${row('Gray', gray)}
      ${row('Blue', blue)}
      ${row('Status', status)}
    </div>
  </div>`)
}

function typography(): string {
  return page(`<div class="sheet light" style="box-shadow:inset 0 0 0 1px ${gray[200]};display:grid;grid-template-columns:1.35fr 1fr">
    <div style="padding:36px 40px;border-right:1px solid ${gray[200]}">
      <div style="font-size:13px;color:${gray[600]};margin-bottom:18px">Inter — the logo, the app, the website, the docs</div>
      <div style="font-size:60px;font-weight:650;letter-spacing:-0.045em;line-height:1.02;font-variation-settings:'opsz' 32">Your clusters,<br><span style="color:${gray[500]}">at a glance.</span></div>
      <div style="font-size:16px;line-height:1.6;color:${gray[700]};margin-top:22px;max-width:440px">See what's healthy, what's struggling and where your capacity goes, and fix things safely when they need it.</div>
      <div style="display:flex;gap:26px;margin-top:26px;font-size:15px;color:${gray[700]}">
        <span style="font-weight:400">Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">Semibold</span><span style="font-weight:700">Bold</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column">
      <div style="padding:36px 40px 28px;border-bottom:1px solid ${gray[200]};flex:1">
        <div style="font-size:13px;color:${gray[600]};margin-bottom:18px">JetBrains Mono — code, names and numbers</div>
        <div style="font-family:'JetBrains Mono';font-size:15px;line-height:1.75;color:${INK}">
          <span style="color:${gray[500]}">$</span> kubectl get pods -A<br>
          api-7f9c <span style="color:${status.good}">●</span> Running&nbsp;&nbsp;12d<br>
          worker-2 <span style="color:${status.warn}">●</span> Pending&nbsp;&nbsp;&nbsp;4m
        </div>
      </div>
      <div style="padding:28px 40px 32px;background:${gray[50]}">
        <div style="font-size:13px;color:${gray[600]};margin-bottom:16px">The wordmark — Inter Display Semibold, outlined</div>
        ${logo('wordmark', 'black', 44)}
      </div>
    </div>
  </div>`)
}

function appIcons(): string {
  const img = (svg: string, size: number) =>
    svg.replace(
      /width="(\d+)" height="(\d+)"/,
      `width="${size}" height="${size}" style="display:block"`,
    )
  const ids = (svg: string, prefix: string) => svg.replaceAll('lumovi-icon', prefix)
  const small = [16, 24, 32, 48, 64]
    .map(
      (s) =>
        `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">${img(ids(plated(s), `p${s}`), s)}<span style="font-size:12px;color:${gray[500]}">${s}</span></div>`,
    )
    .join('')
  const tab = (theme: 'light' | 'dark') => {
    const bg = theme === 'light' ? PAPER : '#2b2b2e'
    const strip = theme === 'light' ? gray[150] : '#1c1c1e'
    const color = theme === 'light' ? INK : '#ededed'
    return `<div style="background:${strip};padding:10px 10px 0;border-radius:12px 12px 0 0">
      <div style="background:${bg};color:${color};border-radius:9px 9px 0 0;display:flex;align-items:center;gap:9px;padding:9px 14px;font-size:13px;width:200px">
        ${logo('mark', theme === 'light' ? 'on-light' : 'on-dark', 16)}<span>Lumovi</span></div></div>`
  }
  return page(`<div class="sheet grid" style="grid-template-columns:1.2fr 1fr">
    <div class="tile mist" style="height:420px">
      ${img(ids(macos(1024), 'mac'), 240)}
      <span class="label">macOS</span>
    </div>
    <div class="grid" style="grid-template-rows:1fr 1fr">
      <div class="tile graphite" style="gap:28px">${img(ids(plated(1024), 'win'), 120)}<div style="display:flex;align-items:flex-end;gap:18px">${small}</div><span class="label">Windows and Linux, drawn for each size</span></div>
      <div class="tile mist" style="flex-direction:column;gap:14px">${tab('light')}${tab('dark')}<span class="label">Favicon</span></div>
    </div>
  </div>`)
}

export default {
  name: 'guidelines',
  outputs: ['guidelines/images'],
  async build(ctx) {
    if (!ctx.raster) return
    const cover = await renderHtml(coverScene(), { width: WIDTH, height: COVER_HEIGHT, scale: 2 })
    await ctx.png('guidelines/images/cover.png', await rounded(cover))
    const pictures: Record<string, string> = {
      'logo-versions': versions(),
      construction: construction(),
      'clear-space': clearSpace(),
      'minimum-size': minimumSize(),
      backgrounds: backgrounds(),
      misuse: misuse(),
      palette: palette(),
      typography: typography(),
      'app-icons': appIcons(),
    }
    for (const [name, html] of Object.entries(pictures)) {
      await ctx.png(`guidelines/images/${name}.png`, await shoot(html))
    }
  },
} satisfies Task
