// 03 Logo: the mark and how it's built, the wordmark, the lockups and their versions, and how to
// use them: clear space, sizes, backgrounds, what to avoid, and placement.
import { blue, gray, INK, PAPER, status } from '../colors.ts'
import {
  GAP,
  horizontal,
  MARK,
  placedMark,
  placedWordmark,
  STACKED_GAP,
  STACKED_MARK,
  stacked,
  VARIANTS,
} from '../logo.ts'
import { GRID, geometry, shapes } from '../mark.ts'
import { n } from '../svg.ts'
import { wordmark } from '../wordmark.ts'
import {
  head,
  list,
  logo,
  logoHeight,
  notes,
  specs,
  verdict,
  type Assets,
  type Section,
} from './kit.ts'

const CAP = wordmark.capHeight
const onLight = VARIANTS.find((v) => v.name === 'on-light')!

/** The mark on its 48-unit grid, with the circles it's drawn from and their measures. */
function construction(size: number): string {
  const { light, shade, cut } = shapes()
  const r = geometry.corner
  const pad = 9
  const box = GRID + pad * 2
  const lines: string[] = []
  for (let i = 0; i <= GRID; i += 3) {
    const strong = i % 12 === 0
    const o = strong ? 0.2 : 0.08
    const w = strong ? 0.12 : 0.07
    lines.push(
      `<line x1="${i}" y1="0" x2="${i}" y2="${GRID}" stroke="${INK}" stroke-opacity="${o}" stroke-width="${w}"/>`,
      `<line x1="0" y1="${i}" x2="${GRID}" y2="${i}" stroke="${INK}" stroke-opacity="${o}" stroke-width="${w}"/>`,
    )
  }
  const dash = `fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="0.13" stroke-dasharray="0.6 0.5"`
  const text = (x: number, y: number, s: string, anchor = 'middle') =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="1.6" font-weight="560" fill="${INK}" font-family="Inter">${s}</text>`
  const dim = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${INK}" stroke-width="0.13" marker-start="url(#tick)" marker-end="url(#tick)"/>`
  return `<svg viewBox="${-pad} ${-pad} ${box} ${box}" width="${size}" height="${size}" style="display:block">
    <defs><marker id="tick" viewBox="-1 -1 2 2" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 -1V1" stroke="${INK}" stroke-width="0.5"/></marker>
    <clipPath id="frame"><rect x="-0.4" y="-0.4" width="${GRID + 0.8}" height="${GRID + 0.8}"/></clipPath></defs>
    <rect width="${GRID}" height="${GRID}" fill="${PAPER}"/>
    ${lines.join('')}
    <path d="${shade}" fill="${gray[300]}" fill-opacity="0.75"/>
    <path d="${light}" fill="${INK}" fill-opacity="0.88"/>
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
    ${dim(0, -4, GRID, -4)}${text(24, -5.3, '48')}
    ${dim(0, GRID + 4, geometry.light, GRID + 4)}${text(15, GRID + 7.4, 'R 30')}
    ${dim(geometry.light, GRID + 4, cut, GRID + 4)}${text(33, GRID + 7.4, '6')}
    ${dim(GRID + 4, 0, GRID + 4, r)}${text(GRID + 5.4, 6.6, 'R 12', 'start')}
    ${text(cut * Math.SQRT1_2 + 1.4, GRID - cut * Math.SQRT1_2 - 1, 'R 36', 'start')}
  </svg>`
}

/** A lockup drawn in its own units, with its proportions marked. */
function proportions(kind: 'horizontal' | 'stacked', width: number): string {
  const logoBox = kind === 'horizontal' ? horizontal(onLight).box : stacked(onLight).box
  const padX = kind === 'horizontal' ? 1400 : 1500
  const padY = kind === 'horizontal' ? 700 : 500
  const box = {
    x: logoBox.x - padX,
    y: logoBox.y - padY,
    w: logoBox.width + padX * 2,
    h: logoBox.height + padY * 2,
  }
  const s = width / box.w
  const px = (v: number) => v / s
  const line = (x1: number, y1: number, x2: number, y2: number, dash = false) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${blue[600]}" stroke-width="1" vector-effect="non-scaling-stroke"${dash ? ' stroke-dasharray="4 4"' : ''}/>`
  const tick = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}" stroke="${blue[600]}" stroke-width="1" vector-effect="non-scaling-stroke" marker-start="url(#t-${kind})" marker-end="url(#t-${kind})"/>`
  const label = (x: number, y: number, t: string, anchor = 'middle') =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${n(px(14))}" font-weight="600" fill="${blue[600]}" font-family="Inter">${t}</text>`
  const parts: string[] = []
  if (kind === 'horizontal') {
    const top = -CAP / 2 - MARK / 2
    const wx = MARK + GAP
    parts.push(
      ...placedMark(onLight, 0, top, MARK),
      ...placedWordmark(onLight, wx, 0),
      line(box.x, 0, box.x + box.w, 0, true),
      line(box.x, -CAP, box.x + box.w, -CAP, true),
      tick(-px(28), top, -px(28), top + MARK),
      label(-px(40), top + MARK / 2, '1.24 C', 'end'),
      tick(MARK, top - px(26), wx, top - px(26)),
      label(MARK + GAP / 2, top - px(46), '0.38 C'),
      tick(logoBox.width + px(28), -CAP, logoBox.width + px(28), 0),
      label(logoBox.width + px(40), -CAP / 2, 'C', 'start'),
      label(box.x + box.w - px(10), px(16), 'baseline', 'end'),
      label(box.x + box.w - px(10), -CAP - px(16), 'capitals', 'end'),
    )
  } else {
    const x = (logoBox.width - STACKED_MARK) / 2
    const baseline = STACKED_MARK + STACKED_GAP + wordmark.top
    const wx = (logoBox.width - wordmark.width) / 2
    parts.push(
      ...placedMark(onLight, x, 0, STACKED_MARK),
      ...placedWordmark(onLight, wx, baseline),
      line(box.x, baseline, box.x + box.w, baseline, true),
      line(box.x, baseline - CAP, box.x + box.w, baseline - CAP, true),
      tick(x - px(28), 0, x - px(28), STACKED_MARK),
      label(x - px(40), STACKED_MARK / 2, '2.8 C', 'end'),
      tick(x + STACKED_MARK + px(28), STACKED_MARK, x + STACKED_MARK + px(28), baseline - CAP),
      label(
        x + STACKED_MARK + px(40),
        STACKED_MARK + (baseline - CAP - STACKED_MARK) / 2,
        '0.62 C',
        'start',
      ),
      tick(wx + wordmark.width + px(28), baseline - CAP, wx + wordmark.width + px(28), baseline),
      label(wx + wordmark.width + px(40), baseline - CAP / 2, 'C', 'start'),
    )
  }
  return `<svg viewBox="${n(box.x)} ${n(box.y)} ${n(box.w)} ${n(box.h)}" width="${width}" height="${n(box.h * s)}" style="display:block">
    <defs><marker id="t-${kind}" viewBox="-1 -1 2 2" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 -1V1" stroke="${blue[600]}" stroke-width="0.4"/></marker></defs>
    ${parts.join('\n')}
  </svg>`
}

/** The logo beside its wordmark, drawn with other paint or other parts: for the things to avoid. */
function altered(
  p: { light: string; shade: string; letters: string; outline?: boolean },
  height: number,
): string {
  const { box } = horizontal(onLight)
  const top = -CAP / 2 - MARK / 2
  const fill = (color: string, stroke: number) =>
    p.outline ? `fill="none" stroke="${color}" stroke-width="${stroke}"` : `fill="${color}"`
  const { light, shade } = shapes()
  return `<svg viewBox="${[box.x, box.y, box.width, box.height].map((v) => n(v)).join(' ')}" height="${n(height)}" style="display:block">
    <g transform="translate(0 ${n(top)}) scale(${n(MARK / GRID, 5)})"><path d="${shade}" ${fill(p.shade, 0.9)}/><path d="${light}" ${fill(p.light, 0.9)}/></g>
    <path transform="translate(${MARK + GAP} 0)" d="${wordmark.letters}" ${fill(p.letters, 22)}/>
  </svg>`
}

export function logoSection(a: Assets): Section {
  const lh = logoHeight
  const avoid = (content: string, label: string, bg: string = PAPER, dark = false) => `
    <div style="position:relative;border-radius:14px;overflow:hidden;background:${bg};box-shadow:inset 0 0 0 1px ${gray[200]};display:flex;align-items:center;justify-content:center;height:100%">
      ${content}
      <div style="position:absolute;left:16px;bottom:13px;font-size:12.5px;color:${dark ? 'rgb(255 255 255 / 0.85)' : gray[700]};display:flex;align-items:center;gap:7px">
        <svg width="14" height="14" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="${status.light.critical}"/><path d="M6 6l6 6m0-6l-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>${label}
      </div>
    </div>`
  const small = lh(32)
  const DIM = gray[500]
  const ON_COLOR = 'rgb(255 255 255 / 0.8)'
  const tile = (bg: string, content: string, caption: string, captionColor: string = gray[600]) =>
    `<div class="figure" style="background:${bg};${bg === PAPER ? `box-shadow:inset 0 0 0 1px ${gray[200]};` : ''}flex:1">${content}<span class="caption" style="color:${captionColor}">${caption}</span></div>`
  const x = 'x'
  return {
    number: '03',
    name: 'Logo',
    summary: 'The mark and the wordmark, how they’re built, their versions, and how to use them.',
    pages: [
      {
        title: 'The mark',
        html: `
          ${head('03 — Logo', 'The mark')}
          <div class="content">
            <div class="col text" style="gap:18px">
              <p class="body">Two shapes in a square, with a gap between them:</p>
              ${notes([
                '<b>The light</b>, a quarter circle from the bottom-left corner. It’s the brightest thing in the mark, always: ink on light backgrounds, white on dark ones.',
                '<b>The shade</b>, the rest of the square. It holds the shape together and stays quiet: pale gray on light, dark gray on dark.',
                '<b>The gap</b> between them, the same width all along the curve. It keeps the two apart even when the mark is one color.',
              ])}
              <p class="body">The light always comes from the bottom left, and the square always sits level.</p>
            </div>
            <div class="row fill" style="gap:16px">
              ${tile(PAPER, logo('mark', 'on-light', 280), 'On light')}
              ${tile(gray[950], logo('mark', 'on-dark', 280), 'On dark', DIM)}
            </div>
          </div>`,
      },
      {
        title: 'Construction',
        html: `
          ${head('03 — Logo', 'Construction', 'Drawn only from circles, on a 48-unit square.')}
          <div class="content" style="margin-top:24px">
            <div class="figure mist" style="flex:1">${construction(600)}</div>
            <div class="col text" style="justify-content:center">
              ${notes([
                'A <b>48-unit square</b> with rounded corners of radius 12.',
                'The light: a quarter of a circle of <b>radius 30</b>, centered on the square’s bottom-left corner.',
                'The shade starts <b>6 further out</b>, at radius 36, so the gap is 6 all along the curve.',
                'As <b>36 and 12 make 48</b>, the shade’s two ends come to a point exactly where the square’s corners begin.',
                'Every measure is a <b>multiple of 3</b>, so at 16 pixels, 3 units to a pixel, the square’s edges fall on whole pixels.',
              ])}
            </div>
          </div>`,
      },
      {
        title: 'On the pixel grid',
        html: `
          ${head('03 — Logo', 'On the pixel grid', 'The mark rendered at its smallest sizes, pixel by pixel. The square’s edges are sharp at every size.')}
          <div class="row" style="margin-top:36px;flex:1;gap:16px">
            ${[16, 24, 32, 48]
              .map(
                (px) => `<div class="figure mist" style="flex:1;flex-direction:column;gap:18px">
                  <div style="position:relative;width:240px;height:240px">
                    <img src="${a.pixels[px]}" width="240" height="240" style="image-rendering:pixelated">
                    <div style="position:absolute;inset:0;background-image:linear-gradient(to right, rgb(0 0 0 / 0.08) 1px, transparent 1px),linear-gradient(to bottom, rgb(0 0 0 / 0.08) 1px, transparent 1px);background-size:${240 / px}px ${240 / px}px"></div>
                  </div>
                  <div style="font-size:15px;font-weight:600">${px} px</div>
                  <div class="small">${px === 16 ? '3 units a pixel' : px === 24 ? '2 units a pixel' : px === 32 ? '1.5 units a pixel' : '1 unit a pixel'}</div>
                </div>`,
              )
              .join('')}
          </div>
          <p class="small" style="margin-top:18px">At 12 pixels and smaller, as in the 16- and 20-pixel app icons, the gap narrows from 6 units to 4, so it stays one whole pixel wide.</p>`,
      },
      {
        title: 'The wordmark',
        html: `
          ${head('03 — Logo', 'The wordmark')}
          <div class="figure mist" style="margin-top:36px;height:340px">${logo('wordmark', 'black', 190)}</div>
          <div class="row" style="margin-top:36px;gap:64px">
            <div class="col fill">
              <p class="body">“Lumovi”, set in <b>Inter Display Semibold</b>: the typeface the app is set in, so the logo and the interface speak with one voice.</p>
              <p class="body">It’s Inter’s letters, outlined, so it needs no font, and tracked a little tighter than the font, as display type is. Use the files; don’t type it out.</p>
            </div>
            <div class="col fill">
              ${specs([
                ['Typeface', 'Inter Display, by Rasmus Andersson'],
                ['Weight and size', 'wght 600 · opsz 32'],
                ['Tracking', '−3% (−61 of 2048 units)'],
                ['Capitals', `${CAP} of 2048 units`],
                ['License', 'SIL Open Font License 1.1'],
              ])}
            </div>
          </div>`,
      },
      {
        title: 'The logo',
        html: `
          ${head('03 — Logo', 'The logo', 'The mark beside the wordmark: the first choice, wherever there’s room.')}
          <div class="figure paper" style="margin-top:28px;flex:1">${proportions('horizontal', 1100)}</div>
          <div class="row" style="margin-top:22px;gap:48px">
            <p class="body fill">The mark is <b>1.24 times the height of the capitals</b> (C), centered on them, so it reads a little larger than the letters beside it.</p>
            <p class="body fill">The space between the mark and the L is <b>0.38 C</b>. The two never move closer, further apart, or out of line.</p>
          </div>`,
      },
      {
        title: 'The stacked logo',
        html: `
          ${head('03 — Logo', 'The stacked logo', 'The mark above the wordmark, for square spaces: a splash screen, a sticker, the middle of a slide.')}
          <div class="content" style="margin-top:24px">
            <div class="figure paper" style="flex:1">${proportions('stacked', 620)}</div>
            <div class="col text" style="justify-content:center">
              ${notes([
                'The mark is <b>2.8 times the height of the capitals</b> (C).',
                'The space between the mark and the capitals is <b>0.62 C</b>.',
                'Both are centered on the same axis.',
              ])}
              <p class="body" style="margin-top:8px">Use it only where the logo doesn’t fit side by side; otherwise, use the logo.</p>
            </div>
          </div>`,
      },
      {
        title: 'Versions',
        html: `
          ${head('03 — Logo', 'Versions', 'Two tones for light and dark backgrounds, and one color for everything else.')}
          <div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;margin-top:32px;flex:1">
            ${tile(gray[950], logo('logo', 'on-dark', small), 'on-dark', DIM)}
            ${tile(PAPER, logo('logo', 'on-light', small), 'on-light')}
            ${tile(blue[600], logo('logo', 'white', small), 'white', ON_COLOR)}
            ${tile(gray[100], logo('logo', 'black', small), 'black')}
            ${tile(gray[950], logo('mark', 'on-dark', 120), 'on-dark', DIM)}
            ${tile(PAPER, logo('mark', 'on-light', 120), 'on-light')}
            ${tile(blue[600], logo('mark', 'white', 120), 'white', ON_COLOR)}
            ${tile(gray[100], logo('mark', 'black', 120), 'black')}
          </div>`,
      },
      {
        title: 'Choosing a version',
        html: `
          ${head('03 — Logo', 'Choosing a version')}
          <div class="content">
            <div class="col fill">
              <table class="data">
                <thead><tr><th>On</th><th>Use</th><th>Files</th></tr></thead>
                <tbody>
                  <tr><td>Paper, the app’s light backgrounds, light gray</td><td><b>on-light</b>, two tones</td><td class="mono">lumovi-*-on-light</td></tr>
                  <tr><td>Ink, graphite, the app’s dark backgrounds</td><td><b>on-dark</b>, two tones</td><td class="mono">lumovi-*-on-dark</td></tr>
                  <tr><td>Blue, photos, gradients, other colors</td><td><b>white</b>, one color</td><td class="mono">lumovi-*-white</td></tr>
                  <tr><td>One-color printing, engraving, embossing, fax</td><td><b>black</b>, one color</td><td class="mono">lumovi-*-black</td></tr>
                  <tr><td>Anywhere the two tones would be too faint to read</td><td><b>black</b> or <b>white</b></td><td class="mono">lumovi-*-black, -white</td></tr>
                </tbody>
              </table>
            </div>
            <div class="col text">
              <h3>Which kind</h3>
              ${list([
                '<b>Logo</b> (<span class="mono">lumovi-logo</span>): the default.',
                '<b>Stacked</b> (<span class="mono">lumovi-logo-stacked</span>): square spaces.',
                '<b>Mark</b> (<span class="mono">lumovi-mark</span>): small or square spaces, where the name is nearby.',
                '<b>Wordmark</b> (<span class="mono">lumovi-wordmark</span>): text-only places, and where the mark is already shown. It’s one color, in white and black.',
              ])}
              <p class="small" style="margin-top:10px">Every one is in <span class="mono">logo/svg</span> and <span class="mono">logo/png</span>. Use SVG wherever it’s accepted.</p>
            </div>
          </div>`,
      },
      {
        title: 'Clear space',
        html: `
          ${head('03 — Logo', 'Clear space', 'Keep space around the logo equal to half the mark’s height (x), on every side, free of text, edges and other logos.')}
          <div class="row" style="margin-top:36px;flex:1;gap:16px">
            ${[
              ['logo', 'on-light', lh(96), 96],
              ['mark', 'on-light', 150, 150],
            ]
              .map(([kind, variant, height, markSize]) => {
                const pad = (markSize as number) / 2
                return `<div class="figure mist" style="flex:${kind === 'logo' ? 1.7 : 1}">
                  <div style="position:relative;padding:${pad}px;background:repeating-linear-gradient(45deg, ${gray[200]} 0 6px, ${gray[100]} 6px 12px);outline:1.5px dashed ${gray[500]}">
                    <div style="background:${gray[100]};outline:1.5px dashed ${gray[500]}">${logo(kind as 'logo', variant as 'on-light', height as number)}</div>
                    <span style="position:absolute;left:0;top:0;width:${pad}px;height:${pad}px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:${gray[700]}">${x}</span>
                    <span style="position:absolute;right:0;bottom:0;width:${pad}px;height:${pad}px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:${gray[700]}">${x}</span>
                  </div>
                  <span class="caption">${kind === 'logo' ? 'The logo' : 'The mark'}: x = half the mark’s height</span>
                </div>`
              })
              .join('')}
          </div>`,
      },
      {
        title: 'Minimum size',
        html: `
          ${head('03 — Logo', 'Minimum size', 'Below these sizes, use the mark alone. They’re shown here at their actual size on screen.')}
          <div class="row" style="margin-top:36px;gap:16px;height:250px">
            ${[
              [logo('logo', 'on-light', lh(18)), 'Logo', 'the mark 18 px · 5 mm'],
              [logo('stacked', 'on-light', 64), 'Stacked', '64 px tall · 18 mm'],
              [logo('mark', 'on-light', 16), 'Mark', '16 px · 4 mm'],
              [
                logo('wordmark', 'black', 14 * ((wordmark.top + wordmark.bottom) / CAP)),
                'Wordmark',
                'capitals 14 px · 3 mm',
              ],
            ]
              .map(
                ([svg, name, size]) =>
                  `<div class="figure mist" style="flex:1;flex-direction:column;gap:22px">${svg}<div style="text-align:center"><div style="font-size:15px;font-weight:600">${name}</div><div class="small">${size}</div></div></div>`,
              )
              .join('')}
          </div>
          <div class="row" style="margin-top:28px;gap:48px">
            <p class="body fill">On screen, sizes are in CSS pixels: on a high-density display, the logo has two or three device pixels for each.</p>
            <p class="body fill">In print, sizes are the height of the mark (or of the capitals, for the wordmark) on the page.</p>
          </div>`,
      },
      {
        title: 'Backgrounds',
        html: `
          ${head('03 — Logo', 'Backgrounds', 'The two-tone logo on paper, graphite and the app’s own backgrounds; the white logo on color and photos.')}
          <div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;margin-top:32px;flex:1">
            ${tile(PAPER, logo('logo', 'on-light', lh(40)), verdictText(true, 'Paper'))}
            ${tile(gray[100], logo('logo', 'on-light', lh(40)), verdictText(true, 'The app, light'))}
            ${tile(gray[950], logo('logo', 'on-dark', lh(40)), verdictText(true, 'The app, dark', true), DIM)}
            ${tile(gray[800], logo('logo', 'on-dark', lh(40)), verdictText(true, 'Graphite', true), DIM)}
            ${tile(blue[600], logo('logo', 'white', lh(40)), verdictText(true, 'Blue: white', true), DIM)}
            ${tile(`linear-gradient(135deg, ${gray[600]}, ${gray[900]})`, logo('logo', 'white', lh(40)), verdictText(true, 'Gradients: white', true), DIM)}
            ${tile(gray[500], logo('logo', 'on-light', lh(40)), verdictText(false, 'Mid gray: too little contrast'))}
            ${tile(`repeating-linear-gradient(60deg, ${gray[300]} 0 14px, ${gray[100]} 14px 28px)`, logo('logo', 'on-light', lh(40)), verdictText(false, 'Busy: the logo gets lost'))}
          </div>`,
      },
      {
        title: 'Things to avoid',
        html: `
          ${head('03 — Logo', 'Things to avoid', 'The logo is the same everywhere. Use the files as they are.')}
          <div class="grid" style="grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);margin-top:28px;flex:1;gap:12px">
            ${avoid(altered({ light: '#e5484d', shade: '#f5a524', letters: INK }, lh(30)), 'Don’t color it')}
            ${avoid(logo('logo', 'on-light', lh(30), 'transform:scaleX(1.35)'), 'Don’t stretch or squash it')}
            ${avoid(logo('logo', 'on-light', lh(30), 'transform:rotate(-12deg)'), 'Don’t turn it')}
            ${avoid(logo('logo', 'on-light', lh(30), 'filter:drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))'), 'Don’t add shadows or effects')}
            ${avoid(altered({ light: INK, shade: INK, letters: INK, outline: true }, lh(30)), 'Don’t outline it')}
            ${avoid(logo('mark', 'on-light', 64, 'transform:scaleX(-1)'), 'Don’t flip the mark')}
            ${avoid(`<div style="display:flex;align-items:center;gap:12px">${logo('mark', 'on-light', 34)}<span class="mono" style="font-size:34px;font-weight:500;letter-spacing:-0.02em">Lumovi</span></div>`, 'Don’t retype the name')}
            ${avoid(`<div style="display:flex;align-items:center;gap:14px">${logo('wordmark', 'black', 30)}${logo('mark', 'on-light', 34)}</div>`, 'Don’t rearrange it')}
            ${avoid(`<div style="display:flex;align-items:center;gap:10px">${logo('mark', 'on-light', 64)}${logo('wordmark', 'black', 22)}</div>`, 'Don’t change its proportions')}
            ${avoid(`<div style="padding:18px 22px;border-radius:14px;background:${INK}">${logo('logo', 'on-dark', lh(26))}</div>`, 'Don’t put it in a box')}
            ${avoid(logo('logo', 'on-light', lh(30)), 'Don’t lose it in low contrast', gray[600], true)}
            ${avoid(`<div style="position:absolute;left:-58px;top:50%;transform:translateY(-50%)">${logo('logo', 'on-light', lh(30))}</div>`, 'Don’t crop it')}
          </div>`,
      },
      {
        title: 'Placing the logo',
        html: `
          ${head('03 — Logo', 'Placing the logo', 'Top left, on the layout’s grid, with its clear space: where people start reading.')}
          <div class="row" style="margin-top:32px;flex:1;gap:16px">
            ${placement('A slide', 16 / 9, 'Top left, the margin a twentieth of the width.')}
            ${placement('A page', 210 / 297, 'Top left, on the text’s margin.')}
            ${placement('A social card', 1200 / 630, 'Top left, small: the mark on the right carries the brand.', true)}
          </div>
          <div class="row" style="margin-top:22px;gap:48px">
            <p class="body fill">Align the logo’s left edge, the mark’s, with the left edge of the text below it. Its height comes from the layout: about the height of the body text’s capitals times 2.5 is a good start.</p>
            <p class="body fill">Use one logo per page, and don’t repeat the mark large and small on the same view unless one of them is clearly a picture, as on the social cards.</p>
          </div>`,
      },
      {
        title: 'Next to other logos',
        html: `
          ${head('03 — Logo', 'Next to other logos', 'For integrations, sponsors and talks: side by side, the same height, with a line between.')}
          <div class="figure mist" style="margin-top:32px;flex:1">
            <div style="display:flex;align-items:center;gap:${MARK_PX / 2}px">
              ${logo('logo', 'on-light', lh(MARK_PX))}
              <div style="width:1.5px;height:${MARK_PX * 1.4}px;background:${gray[300]}"></div>
              <div style="height:${MARK_PX}px;padding:0 26px;border-radius:12px;border:1.5px dashed ${gray[400]};display:flex;align-items:center;color:${gray[600]};font-size:22px;font-weight:600;letter-spacing:-0.01em">Partner logo</div>
            </div>
          </div>
          <div class="row" style="margin-top:22px;gap:48px">
            ${list(['Give both logos the same visual weight: as tall as each other, or as wide, whichever looks even.'])}
            ${list(['Space them by half the mark’s height on each side of a line as tall as 1.4 marks, in Mist.'])}
            ${list(['Don’t join them into one shape, and don’t change either one’s colors to match.'])}
          </div>`,
      },
    ],
  }
}

const MARK_PX = 72

function verdictText(ok: boolean, text: string, light = false): string {
  return verdict(ok, text).replace(
    '<span>',
    `<span style="color:${light ? 'rgb(255 255 255 / 0.85)' : INK};font-weight:500">`,
  )
}

/** A wireframe of a format with the logo placed on it. */
function placement(name: string, ratio: number, rule: string, withMark = false): string {
  // Landscape formats 400 wide, a portrait page 330 tall: each fits its column.
  const w = ratio >= 1 ? 400 : Math.round(330 * ratio)
  const h = Math.round(w / ratio)
  const margin = Math.round(w / 20)
  return `<div class="figure mist" style="flex:1;flex-direction:column;gap:18px">
    <div style="position:relative;width:${w}px;height:${h}px;background:${PAPER};box-shadow:0 1px 3px rgb(0 0 0 / 0.08), 0 0 0 1px ${gray[200]};border-radius:4px">
      <div style="position:absolute;inset:${margin}px;outline:1px dashed ${blue[300]}"></div>
      ${withMark ? `<div style="position:absolute;right:${margin * 1.6}px;top:50%;transform:translateY(-50%)">${logo('mark', 'on-light', h * 0.42)}</div>` : ''}
      <div style="position:absolute;left:${margin}px;top:${margin}px">${logo('logo', 'on-light', logoHeight(Math.max(12, w / 34)))}</div>
      <div style="position:absolute;left:${margin}px;top:${margin + w / 8}px;right:${margin}px;display:flex;flex-direction:column;gap:${Math.max(5, w / 70)}px">
        <div style="height:${Math.max(8, w / 32)}px;width:62%;background:${gray[300]};border-radius:3px"></div>
        <div style="height:${Math.max(4, w / 90)}px;width:80%;background:${gray[200]};border-radius:2px"></div>
        <div style="height:${Math.max(4, w / 90)}px;width:72%;background:${gray[200]};border-radius:2px"></div>
      </div>
    </div>
    <div style="text-align:center"><div style="font-size:15px;font-weight:600">${name}</div><div class="small">${rule}</div></div>
  </div>`
}
