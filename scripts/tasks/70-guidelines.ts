// guidelines/images/: the pictures in the brand guidelines, drawn from the same sources as the
// assets, so they can't disagree with them.
import { blue, brand, gray, night, status } from '../../src/colors.ts'
import { macos, plated } from '../../src/icon.ts'
import {
  document,
  GAP,
  horizontal,
  mark,
  stacked,
  VARIANTS,
  wordmarkOnly,
  type Logo,
  type Variant,
} from '../../src/logo.ts'
import { GRID, shapes } from '../../src/mark.ts'
import { FONTS, scene } from '../../src/scene.ts'
import { n } from '../../src/svg.ts'
import { ASCENDER, OVERSHOOT, wordmark } from '../../src/wordmark.ts'
import sharp from 'sharp'
import { renderHtml } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/** Pictures are 1000 pixels wide, rendered at 2x. */
const WIDTH = 1000

let ids = 0
const variant = (name: string): Variant => VARIANTS.find((v) => v.name === name)!
type Kind = 'logo' | 'stacked' | 'mark' | 'wordmark'

/** A logo as inline SVG, `height` pixels tall, with ids unique on the page. */
function logo(kind: Kind, name: string, height: number, style = ''): string {
  const v = variant(name)
  const id = `g${++ids}`
  const l: Logo =
    kind === 'logo'
      ? horizontal(v, id)
      : kind === 'stacked'
        ? stacked(v, id)
        : kind === 'mark'
          ? mark(v, id)
          : wordmarkOnly(v)
  return document(l, height)
    .replace(' role="img"', ` role="img" style="display:block;${style}"`)
    .replace(/<title>Lumovi<\/title>\n/, '')
}

const page = (body: string, css = '') => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { margin: 0; background: transparent; }
body { width: ${WIDTH}px; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; color: #0b0b0f; }
.sheet { border-radius: 20px; overflow: hidden; }
.tile { display: flex; align-items: center; justify-content: center; position: relative; }
.dark { background: ${gray[950]}; color: #f2f2f4; }
.night { background: ${night[900]}; color: #f2f2f4; }
.light { background: #ffffff; }
.mist { background: ${gray[100]}; }
.label { position: absolute; left: 20px; bottom: 16px; font-size: 13px; color: ${gray[600]}; letter-spacing: 0.01em; }
.dark .label, .night .label { color: ${gray[500]}; }
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

/** The cover: the logo standing on its floor. */
const COVER_HEIGHT = 440

function coverScene(): string {
  const H = COVER_HEIGHT
  const size = 120
  // The lockup, as in logo/: the l as tall as the mark, the gap a third of it.
  const s = size / ASCENDER
  const x = (WIDTH - (size + (GAP + wordmark.width) * s)) / 2
  const y = 150
  return scene({
    width: WIDTH,
    height: H,
    theme: 'dark',
    mark: { x, y, size },
    css: '.wm { position: absolute; } .wm svg { display: block; }',
    content: `<div class="wm" style="left:${x + size + GAP * s}px;top:${y}px">${logo('wordmark', 'on-dark', (ASCENDER + OVERSHOOT) * s)}</div>`,
  })
}

function versions(): string {
  const t = (cls: string, content: string, label: string, h: number) =>
    `<div class="tile ${cls}" style="height:${h}px">${content}<span class="label">${label}</span></div>`
  return page(`<div class="sheet grid" style="grid-template-columns:1fr 1fr">
    ${t('night', logo('logo', 'on-dark', 56), 'Logo, on dark', 220)}
    ${t('light', logo('logo', 'on-light', 56), 'Logo, on light', 220)}
    ${t('night', logo('stacked', 'on-dark', 150), 'Stacked', 260)}
    ${t('light', logo('stacked', 'on-light', 150), 'Stacked', 260)}
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:2px">
      ${t('night', logo('mark', 'on-dark', 96), 'Mark', 200)}
      ${t('night', logo('mark', 'flat-on-dark', 96), 'Flat', 200)}
    </div>
    <div class="grid" style="grid-template-columns:1fr 1fr;gap:2px">
      ${t('light', logo('mark', 'on-light', 96), 'Mark', 200)}
      ${t('light', logo('mark', 'flat-on-light', 96), 'Flat', 200)}
    </div>
    ${t('night', logo('wordmark', 'on-dark', 52), 'Wordmark', 180)}
    ${t('light', logo('wordmark', 'on-light', 52), 'Wordmark', 180)}
    ${t('', logo('logo', 'white', 48), 'One color', 160)
      .replace('class="tile "', `class="tile" style="background:${blue[600]}"`)
      .replace('class="label"', 'class="label" style="color:rgb(255 255 255 / 0.8)"')}
    ${t('mist', logo('logo', 'black', 48), 'One color', 160)}
  </div>`)
}

/** The mark on its grid, with the measures it's built from. */
function construction(): string {
  const { l, orb, curve } = shapes()
  const u = 9.5 // pixels per unit
  const pad = 9
  const box = GRID + pad * 2
  const lines: string[] = []
  for (let i = 0; i <= GRID; i += 3) {
    const strong = i % 12 === 0
    const o = strong ? 0.22 : 0.09
    lines.push(
      `<line x1="${i}" y1="0" x2="${i}" y2="${GRID}" stroke="${blue[600]}" stroke-opacity="${o}" stroke-width="${strong ? 0.12 : 0.08}"/>`,
      `<line x1="0" y1="${i}" x2="${GRID}" y2="${i}" stroke="${blue[600]}" stroke-opacity="${o}" stroke-width="${strong ? 0.12 : 0.08}"/>`,
    )
  }
  const dash = `fill="none" stroke="${blue[600]}" stroke-width="0.14" stroke-dasharray="0.6 0.5"`
  const corner = 21
  const text = (x: number, y: number, s: string, anchor = 'middle', color: string = blue[700]) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="1.7" font-weight="550" fill="${color}" font-family="Inter">${s}</text>`
  const dim = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${blue[700]}" stroke-width="0.14" marker-start="url(#tick)" marker-end="url(#tick)"/>`
  const svg = `<svg viewBox="${-pad} ${-pad} ${box} ${box}" width="${box * u}" height="${box * u}" style="display:block">
    <defs><marker id="tick" viewBox="-1 -1 2 2" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 -1V1" stroke="${blue[700]}" stroke-width="0.5"/></marker></defs>
    <rect x="0" y="0" width="${GRID}" height="${GRID}" fill="${blue[50]}"/>
    ${lines.join('\n')}
    <path d="${l}" fill="${blue[600]}" fill-opacity="0.16" stroke="${blue[600]}" stroke-width="0.16"/>
    <circle cx="${orb.cx}" cy="${orb.cy}" r="${orb.r}" fill="${blue[600]}" fill-opacity="0.16" stroke="${blue[600]}" stroke-width="0.16"/>
    <circle cx="${orb.cx}" cy="${orb.cy}" r="${curve}" ${dash}/>
    <circle cx="${corner}" cy="${GRID - corner}" r="${corner}" ${dash}/>
    <circle cx="6" cy="6" r="6" ${dash}/>
    <circle cx="42" cy="42" r="6" ${dash}/>
    <path d="M${orb.cx} ${orb.cy}L${corner} ${GRID - corner}" stroke="${blue[600]}" stroke-width="0.14" stroke-dasharray="0.6 0.5"/>
    <circle cx="${orb.cx}" cy="${orb.cy}" r="0.45" fill="${blue[700]}"/>
    <circle cx="${corner}" cy="${GRID - corner}" r="0.45" fill="${blue[700]}"/>
    ${dim(0, -4, 12, -4)}${text(6, -5.4, '12')}
    ${dim(-4, 36, -4, 48)}${text(-5.6, 42.6, '12', 'end')}
    ${dim(18, -4, 48, -4)}${text(33, -5.4, 'Ø 30')}
    ${dim(orb.cx - orb.r * Math.SQRT1_2, orb.cy + orb.r * Math.SQRT1_2, orb.cx - curve * Math.SQRT1_2, orb.cy + curve * Math.SQRT1_2)}
    ${text(orb.cx - 19.4, orb.cy + 19.2, '6', 'end')}
    ${text(orb.cx + curve * 0.72 + 1, orb.cy + curve * 0.72 + 3.4, 'R 21', 'start')}
    ${text(corner - corner * 0.72 - 1.2, GRID - corner + corner * 0.72 + 4.2, 'R 21', 'end')}
    ${text(13.4, 1.2, 'R 6', 'start')}
    ${text(52, 43.2, '48', 'start', gray[500])}
    ${dim(50.5, 0, 50.5, 48)}
  </svg>`
  return page(
    `<div class="sheet mist" style="display:flex;align-items:center;gap:56px;padding:40px 56px">
      ${svg}
      <div style="font-size:15px;line-height:1.6;color:${gray[700]};max-width:300px">
        <div style="font-size:20px;font-weight:600;color:#0b0b0f;margin-bottom:12px;letter-spacing:-0.01em">One curve, twice</div>
        On a 48-unit square: bars 12 wide, the orb 30 across, and 6 between them. The inside of
        the L is a circle around the orb; its outside corner is the same circle, moved 12 down
        and 12 left. The ends are half circles.
        <div style="margin-top:14px">Every measure is a multiple of 3, so at 16 pixels every straight edge falls on a pixel.</div>
      </div>
    </div>`,
  )
}

function clearSpace(): string {
  const h = 96
  const x = h / 2
  const zone = `background: repeating-linear-gradient(45deg, ${blue[100]} 0 6px, ${blue[50]} 6px 12px);`
  return page(
    `<div class="sheet mist" style="padding:56px;display:flex;justify-content:center">
      <div style="position:relative;padding:${x}px;${zone};outline:1.5px dashed ${blue[400]};outline-offset:-0.75px">
        <div style="background:${gray[100]};outline:1.5px dashed ${blue[400]}">${logo('logo', 'on-light', h * ((ASCENDER + OVERSHOOT) / ASCENDER))}</div>
        <div style="position:absolute;left:0;top:0;width:${x}px;height:${x}px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:${blue[700]}">x</div>
        <div style="position:absolute;right:0;bottom:0;width:${x}px;height:${x}px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:${blue[700]}">x</div>
      </div>
      <div style="position:absolute;left:56px;bottom:20px;font-size:13px;color:${gray[600]}">x = half the mark's height</div>
    </div>`,
    '.sheet { position: relative; }',
  )
}

function minimumSize(): string {
  const t = (content: string, label: string) =>
    `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:18px;height:120px">${content}<span style="font-size:13px;color:${gray[600]}">${label}</span></div>`
  return page(
    `<div class="sheet mist" style="display:flex;justify-content:space-around;align-items:flex-end;padding:48px 40px 36px">
      ${t(logo('logo', 'on-light', 20 * ((ASCENDER + OVERSHOOT) / ASCENDER)), 'Logo: the mark 20 px tall')}
      ${t(logo('stacked', 'on-light', 64), 'Stacked: 64 px tall')}
      ${t(logo('mark', 'on-light', 16), 'Mark: 16 px')}
      ${t(logo('wordmark', 'on-light', 16 * ((ASCENDER + OVERSHOOT) / ASCENDER)), 'Wordmark: the l 16 px tall')}
    </div>`,
  )
}

function backgrounds(): string {
  const t = (style: string, name: string, label: string) =>
    `<div class="tile" style="height:170px;${style}">${logo('logo', name, 44)}<span class="label" style="color:inherit;opacity:0.7">${label}</span></div>`
  return page(`<div class="sheet grid" style="grid-template-columns:repeat(3,1fr)">
    ${t(`background:${night[900]};color:#fff`, 'on-dark', 'Night')}
    ${t(`background:${gray[950]};color:#fff`, 'on-dark', 'The app, dark')}
    ${t(`background:#ffffff;color:#000`, 'on-light', 'Paper')}
    ${t(`background:${gray[100]};color:#000`, 'on-light', 'The app, light')}
    ${t(`background:${blue[600]};color:#fff`, 'white', 'Lumovi Blue: white')}
    ${t(`background:linear-gradient(135deg, ${blue[500]}, ${night[700]});color:#fff`, 'white', 'Photos and gradients: white')}
  </div>`)
}

function misuse(): string {
  const ok = `<svg width="22" height="22" viewBox="0 0 22 22" style="position:absolute;top:14px;right:14px"><circle cx="11" cy="11" r="11" fill="${status.critical}"/><path d="M7.5 7.5l7 7m0-7l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`
  const t = (content: string, label: string, bg = '#ffffff') =>
    `<div class="tile" style="height:170px;background:${bg}">${content}${ok}<span class="label"${bg === '#ffffff' ? '' : ' style="color:rgb(255 255 255 / 0.8)"'}>${label}</span></div>`
  const lockup = (style = '', name = 'on-light') => logo('logo', name, 34, style)
  const recolored = lockup().replace(
    /#5ea2f0|#2675d3|#1c5cab|#bfdcff/g,
    (c) =>
      ({ '#5ea2f0': '#f5a524', '#2675d3': '#e5484d', '#1c5cab': '#b4232c', '#bfdcff': '#ffe08a' })[
        c
      ]!,
  )
  // Strokes in each part's units: the mark's 48-unit square, and the wordmark's font units.
  const outlined = lockup()
    .replace(/fill="url\(#[^)]+\)"/g, 'fill="none" stroke="#0b0b0f" stroke-width="0.8"')
    .replace(/fill="#0b0b0f"|fill="#2675d3"/g, 'fill="none" stroke="#0b0b0f" stroke-width="12"')
  const mirrored = logo('mark', 'on-light', 70, 'transform:scaleX(-1)')
  return page(`<div class="sheet grid" style="grid-template-columns:repeat(4,1fr)">
    ${t(recolored, 'Change its colors')}
    ${t(lockup('transform:scaleX(1.35)'), 'Stretch or squash it')}
    ${t(lockup('transform:rotate(-12deg)'), 'Turn it')}
    ${t(lockup('filter:drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))'), 'Add shadows or effects')}
    ${t(outlined, 'Outline it')}
    ${t(mirrored, 'Flip the mark')}
    ${t(`<div style="display:flex;align-items:center;gap:12px">${logo('mark', 'on-light', 34)}<span style="font:italic 600 38px Georgia,serif;letter-spacing:-0.01em">Lumovi</span></div>`, 'Set the name in another type')}
    ${t(lockup('', 'on-light'), 'Put it where it gets lost', blue[500])}
  </div>`)
}

function palette(): string {
  const text = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [
      number,
      number,
      number,
    ]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#0b0b0f' : '#ffffff'
  }
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')
  const big = Object.values(brand)
    .map(
      (
        c,
      ) => `<div style="background:${c.hex};color:${text(c.hex)};padding:18px;height:130px;display:flex;flex-direction:column;justify-content:flex-end;${c.hex === '#ffffff' ? `box-shadow:inset 0 0 0 1px ${gray[200]}` : ''}">
        <div style="font-size:15px;font-weight:600">${c.name}</div>
        <div style="font-size:12px;opacity:0.75;margin-top:4px;font-family:'JetBrains Mono'">${c.hex}<br>rgb ${rgb(c.hex)}</div>
      </div>`,
    )
    .join('')
  const row = (name: string, scale: Record<string, string>) => `
    <div style="display:flex;align-items:stretch;gap:0">
      <div style="width:76px;font-size:13px;font-weight:600;display:flex;align-items:center">${name}</div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${Object.keys(scale).length},1fr);border-radius:10px;overflow:hidden">
        ${Object.entries(scale)
          .map(
            ([
              step,
              hex,
            ]) => `<div style="background:${hex};color:${text(hex)};height:64px;padding:8px;display:flex;flex-direction:column;justify-content:space-between">
              <span style="font-size:11px;font-weight:600">${step}</span><span style="font-size:10px;font-family:'JetBrains Mono';opacity:0.8">${hex.slice(1)}</span></div>`,
          )
          .join('')}
      </div>
    </div>`
  return page(`<div class="sheet light" style="padding:28px;box-shadow:inset 0 0 0 1px ${gray[200]}">
    <div style="display:grid;grid-template-columns:repeat(6,1fr);border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">${big}</div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">
      ${row('Blue', blue)}
      ${row('Night', night)}
      ${row('Gray', gray)}
      ${row('Status', status)}
    </div>
  </div>`)
}

function typography(): string {
  return page(`<div class="sheet light" style="box-shadow:inset 0 0 0 1px ${gray[200]};display:grid;grid-template-columns:1.35fr 1fr">
    <div style="padding:36px 40px;border-right:1px solid ${gray[200]}">
      <div style="font-size:13px;color:${gray[600]};margin-bottom:18px">Inter — the app, the website, the docs</div>
      <div style="font-size:60px;font-weight:650;letter-spacing:-0.04em;line-height:1.02;font-variation-settings:'opsz' 32">Your clusters,<br><span style="color:${gray[500]}">at a glance.</span></div>
      <div style="font-size:16px;line-height:1.6;color:${gray[700]};margin-top:22px;max-width:440px">See what's healthy, what's struggling and where your capacity goes, and fix things safely when they need it.</div>
      <div style="display:flex;gap:26px;margin-top:26px;font-size:15px;color:${gray[700]}">
        <span style="font-weight:400">Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">Semibold</span><span style="font-weight:700">Bold</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column">
      <div style="padding:36px 40px 28px;border-bottom:1px solid ${gray[200]};flex:1">
        <div style="font-size:13px;color:${gray[600]};margin-bottom:18px">JetBrains Mono — code, names and numbers</div>
        <div style="font-family:'JetBrains Mono';font-size:15px;line-height:1.75;color:#0b0b0f">
          <span style="color:${gray[500]}">$</span> kubectl get pods -A<br>
          api-7f9c <span style="color:${status.good}">●</span> Running&nbsp;&nbsp;12d<br>
          worker-2 <span style="color:${status.warn}">●</span> Pending&nbsp;&nbsp;&nbsp;4m
        </div>
      </div>
      <div style="padding:28px 40px 32px;background:${gray[50]}">
        <div style="font-size:13px;color:${gray[600]};margin-bottom:16px">The wordmark — lettered from Outfit SemiBold</div>
        ${logo('wordmark', 'on-light', 40)}
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
    const bg = theme === 'light' ? '#ffffff' : '#2b2b30'
    const strip = theme === 'light' ? gray[150] : '#1c1c20'
    const color = theme === 'light' ? '#0b0b0f' : '#f2f2f4'
    const p = theme === 'light' ? 'on-light' : 'on-dark'
    return `<div style="background:${strip};padding:10px 10px 0;border-radius:12px 12px 0 0">
      <div style="background:${bg};color:${color};border-radius:9px 9px 0 0;display:flex;align-items:center;gap:9px;padding:9px 14px;font-size:13px;width:200px">
        ${logo('mark', p, 16)}<span>Lumovi</span></div></div>`
  }
  return page(`<div class="sheet grid" style="grid-template-columns:1.2fr 1fr">
    <div class="tile mist" style="height:420px;gap:28px">
      ${img(ids(macos(1024), 'mac'), 240)}
      <span class="label">macOS</span>
    </div>
    <div class="grid" style="grid-template-rows:1fr 1fr">
      <div class="tile night" style="gap:28px">${img(ids(plated(1024), 'win'), 120)}<div style="display:flex;align-items:flex-end;gap:18px">${small}</div><span class="label">Windows and Linux, drawn for each size</span></div>
      <div class="tile mist" style="flex-direction:column;gap:14px">${tab('light')}${tab('dark')}<span class="label">Favicon</span></div>
    </div>
  </div>`)
}

export default {
  name: 'guidelines',
  outputs: ['guidelines/images'],
  async build(ctx) {
    if (!ctx.raster) return
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
    const cover = await renderHtml(coverScene(), { width: WIDTH, height: COVER_HEIGHT, scale: 2 })
    await ctx.png('guidelines/images/cover.png', await rounded(cover))
    for (const [name, html] of Object.entries(pictures)) {
      await ctx.png(`guidelines/images/${name}.png`, await shoot(html))
    }
  },
} satisfies Task
