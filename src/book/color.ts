// 04 Color: the named colors in every notation, the gray and blue scales and their roles,
// proportion, contrast, status and data colors, and the app's themes.
import { blue, brand, gray, INK, PAPER, PILL_FILL, series, status, themes } from '../colors.ts'
import { dot, icon, levels, motion, pill, type Health } from '../health.ts'
import { head, list, verdict, type Section } from './kit.ts'
import { cmyk, contrast, level, oklch, over, rgb, textOn } from './math.ts'

type Theme = (typeof themes)['light'] | (typeof themes)['dark']

/** A little of the app, in a theme's tokens: its background, a panel, lines and three levels of text. */
function surfaces(t: Theme, name: string): string {
  return `<div style="flex:1;display:flex;flex-direction:column;gap:8px">
    <div style="background:${t['app-bg']};border-radius:14px;padding:16px;display:flex;gap:14px;box-shadow:0 0 0 1px ${gray[200]}">
      <div style="width:120px;display:flex;flex-direction:column;gap:9px;padding-top:4px;font-size:13px;color:${t['text-2']}">
        <span style="color:${t['text-1']};font-weight:600">Overview</span><span>Workloads</span><span>Nodes</span><span>Events</span>
      </div>
      <div style="flex:1;background:${t.surface};border-radius:10px;box-shadow:0 0 0 1px ${t.line};padding:14px 16px;display:flex;flex-direction:column;gap:4px">
        <span style="font-size:15px;font-weight:600;color:${t['text-1']}">checkout</span>
        <span style="font-size:13px;color:${t['text-2']}">12 pods on 3 nodes</span>
        <span style="font-size:12px;color:${t['text-3']}">Updated 2 seconds ago</span>
        <div style="height:1px;background:${t.line};margin:8px 0 4px"></div>
        <span style="font-size:12px;color:${t['text-3']}">api-7f9c4d · worker-2x8p · cache-0</span>
      </div>
    </div>
    <span class="small">${name}: app-bg, surface, line, and text-1, text-2, text-3</span>
  </div>`
}

/** What blue is for, in a theme: a link, a primary button, a focused field and a selected row. */
function actions(t: Theme, name: string): string {
  return `<div style="flex:1;display:flex;flex-direction:column;gap:8px">
    <div style="background:${t.surface};border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:12px;box-shadow:0 0 0 1px ${gray[200]}">
      <div style="display:flex;align-items:center;gap:14px">
        <span style="padding:7px 14px;border-radius:8px;background:${t.accent};color:#fff;font-size:13px;font-weight:550">Scale</span>
        <span style="font-size:13px;color:${t['accent-strong']};font-weight:500">View in the docs</span>
        <span style="margin-left:auto;padding:6px 12px;border-radius:8px;box-shadow:0 0 0 1.5px ${t.accent}, 0 0 0 5px ${t['accent-soft']};font-size:13px;color:${t['text-1']};width:150px">replicas: 3</span>
      </div>
      <div style="display:flex;flex-direction:column;font-size:13px">
        <div style="padding:7px 10px;border-radius:7px;background:${t['accent-soft']};color:${t['text-1']};font-weight:500">api · 3/3</div>
        <div style="padding:7px 10px;color:${t['text-2']}">worker · 2/2</div>
      </div>
    </div>
    <span class="small">${name}: a button, a link, a focused field, a selected row</span>
  </div>`
}

/** Each theme's surfaces, from lightest to darkest: what text and marks have to read on. */
const SURFACES = {
  light: [
    themes.light.surface,
    themes.light['surface-2'],
    themes.light['app-bg'],
    themes.light['surface-3'],
  ],
  dark: [
    themes.dark['app-bg'],
    themes.dark.surface,
    themes.dark['surface-2'],
    themes.dark['surface-3'],
  ],
}

/** The lowest contrast a color has on any of these backgrounds. */
const lowest = (fg: string, backgrounds: string[]) =>
  Math.min(...backgrounds.map((bg) => contrast(fg, bg))).toFixed(2)

function statusRow(h: Health): string {
  const sample = (scheme: 'light' | 'dark') =>
    `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:10px;background:${themes[scheme].surface};box-shadow:inset 0 0 0 1px ${scheme === 'light' ? gray[200] : gray[800]}">${dot(h, scheme)}${pill(h, scheme)}</div>`
  const values = (
    light: string,
    dark: string,
    ratio: (scheme: 'light' | 'dark', hex: string) => string,
  ) =>
    `<div class="mono" style="font-size:12px;line-height:1.9;white-space:nowrap">${(
      [
        ['light', light],
        ['dark', dark],
      ] as const
    )
      .map(
        ([scheme, hex]) =>
          `<span class="chip" style="background:${hex};width:10px;height:10px;border-radius:5px;vertical-align:-1px"></span>${hex} <span style="color:${gray[600]}">${ratio(scheme, hex)}</span>`,
      )
      .join('<br>')}</div>`
  const word = `${h.color}-text` as const
  return `<tr>
    <td><div style="display:flex;align-items:center;gap:8px;color:${INK};font-weight:600;font-size:15px">${icon(h.icon, 16, 2)}${h.name}</div><div class="small" style="margin-top:3px">Filter: ${h.filter}</div></td>
    <td><div class="col" style="gap:6px">${sample('light')}${sample('dark')}</div></td>
    <td style="color:${gray[700]};line-height:1.45">${h.means}${h.level === 'progressing' ? ` <b style="color:${INK}">Neutral, moving:</b> the dot pulses and the dashed circle turns.` : ''}</td>
    <td>${values(status.light[h.color], status.dark[h.color], (scheme, hex) => lowest(hex, SURFACES[scheme]))}</td>
    <td>${values(themes.light[word], themes.dark[word], (scheme, hex) =>
      lowest(hex, [
        ...SURFACES[scheme],
        ...SURFACES[scheme].map((bg) => over(status[scheme][h.color], bg, PILL_FILL)),
      ]),
    )}</td></tr>`
}

export function colorSection(): Section {
  const chips = (scale: Record<string, string>, height = 120) =>
    `<div style="display:grid;grid-template-columns:repeat(${Object.keys(scale).length},1fr);border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">
      ${Object.entries(scale)
        .map(
          ([
            step,
            hex,
          ]) => `<div style="background:${hex};color:${textOn(hex)};height:${height}px;padding:12px 10px;display:flex;flex-direction:column;justify-content:space-between">
            <span style="font-size:13px;font-weight:600">${step}</span>
            <span class="mono" style="font-size:11px;opacity:0.8">${hex}</span></div>`,
        )
        .join('')}
    </div>`
  const sample = (fg: string, bg: string, text: string, size = 16) =>
    `<span style="display:inline-block;padding:6px 12px;border-radius:8px;background:${bg};color:${fg};font-size:${size}px;font-weight:${size > 18 ? 600 : 500};box-shadow:inset 0 0 0 1px rgb(127 127 127 / 0.18)">${text}</span>`
  const pairs: [string, string, string, string][] = [
    ['Ink on Gray 150', INK, gray[150], 'Body text, headlines (text-1)'],
    ['Gray 700 on Gray 150', gray[700], gray[150], 'Secondary text (text-2)'],
    ['Gray 650 on Gray 150', gray[650], gray[150], 'Quiet text, captions (text-3)'],
    ['Gray 600 on Gray 150', gray[600], gray[150], 'A headline’s second line: large text'],
    ['Blue 700 on Gray 150', blue[700], gray[150], 'Blue words: links (accent-strong)'],
    [
      'Paper on Blue 600',
      PAPER,
      blue[600],
      `Primary buttons, in both themes; ${contrast(PAPER, blue[700]).toFixed(2)}:1 on hover (Blue 700)`,
    ],
    ['#ededed on Gray 850', '#ededed', gray[850], 'Body text, dark (text-1)'],
    ['Gray 400 on Gray 850', gray[400], gray[850], 'Secondary text, dark (text-2)'],
    ['Gray 500 on Gray 850', gray[500], gray[850], 'Quiet text and second lines, dark (text-3)'],
    ['Blue 400 on Gray 850', blue[400], gray[850], 'Blue words, dark (accent-strong)'],
  ]
  const tokens = {
    light: { ...themes.light, ...status.light },
    dark: { ...themes.dark, ...status.dark },
  }
  const tokenRows = (Object.keys(tokens.light) as (keyof typeof tokens.light)[]).map((key) => {
    const l = tokens.light[key]
    const d = tokens.dark[key]
    const chip = (v: string) =>
      `<span class="chip" style="background:${v}"></span><span class="mono" style="font-size:12px">${v}</span>`
    return `<tr><td class="mono" style="font-size:12.5px;color:${INK}">--${key}</td><td>${chip(l)}</td><td>${chip(d)}</td></tr>`
  })
  const half = Math.ceil(tokenRows.length / 2)
  const tokenTable = (rows: string[]) =>
    `<table class="data"><thead><tr><th>Token</th><th>Light</th><th>Dark</th></tr></thead><tbody>${rows.join('')}</tbody></table>`
  return {
    number: '04',
    name: 'Color',
    summary: 'Black, white and true neutral grays carry the brand; color is kept for meaning.',
    pages: [
      {
        title: 'Brand colors',
        html: `
          ${head('04 — Color', 'Brand colors', 'Five neutrals and one blue. The neutrals carry the brand; the blue is only for what you can act on.')}
          <div class="row" style="margin-top:32px;flex:1;gap:12px">
            ${Object.values(brand)
              .map(
                (
                  c,
                ) => `<div style="flex:1;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">
                  <div style="flex:1;background:${c.hex};color:${textOn(c.hex)};padding:20px;display:flex;flex-direction:column;justify-content:flex-end">
                    <div style="font-size:22px;font-weight:650;letter-spacing:-0.02em">${c.name}</div>
                  </div>
                  <div style="padding:16px 18px;background:${PAPER};display:flex;flex-direction:column;gap:10px">
                    <p class="small" style="min-height:58px;color:${gray[700]}">${c.use}</p>
                    <dl class="specs" style="gap:5px 12px;font-size:12px">
                      <dt>HEX</dt><dd>${c.hex}</dd>
                      <dt>RGB</dt><dd>${rgb(c.hex).join(' ')}</dd>
                      <dt>OKLCH</dt><dd style="font-size:11px">${oklch(c.hex).replace('oklch(', '').replace(')', '')}</dd>
                      <dt>CMYK</dt><dd>${cmyk(c.hex)}</dd>
                    </dl>
                  </div>
                </div>`,
              )
              .join('')}
          </div>
          <p class="small" style="margin-top:16px">CMYK values are a starting point by the simple formula, not color-managed: proof them on the press the job is printed on.</p>`,
      },
      {
        title: 'Gray',
        html: `
          ${head('04 — Color', 'Gray', 'True neutral grays, without a tint, from near-white to near-black. Most of what people see is these.')}
          <div style="margin-top:32px">${chips(gray, 130)}</div>
          <div class="row" style="margin-top:32px;gap:24px">
            ${[
              ['Backgrounds', '50, 100, 150 on light; 900, 925, 950 on dark.'],
              ['Lines', 'Black or white at 7–14% opacity, so they work on any surface.'],
              ['The mark’s shade', '300 (Mist) on light; 750 on dark.'],
              ['Text', '950 (Ink), 700 and 650 on light; #ededed, 400 and 500 on dark.'],
            ]
              .map(
                ([k, v]) =>
                  `<div class="col fill" style="gap:6px"><h3>${k}</h3><p class="body">${v}</p></div>`,
              )
              .join('')}
          </div>
          <div class="row" style="margin-top:30px;gap:16px">${surfaces(themes.light, 'Light')}${surfaces(themes.dark, 'Dark')}</div>`,
      },
      {
        title: 'Blue',
        html: `
          ${head('04 — Color', 'Blue', 'For what you can act on, as in Apple’s interfaces. It isn’t the brand’s color.')}
          <div style="margin-top:32px">${chips(blue, 110)}</div>
          <div class="row" style="margin-top:36px;gap:48px">
            <div class="col fill">
              ${verdict(true, 'Use it for')}
              ${list(['Links, in running text and lists.', 'Primary buttons, one to a view.', 'Focus rings, and the selected row or tab.', 'Progress bars for something you started, and the one chart series that matters most.'])}
            </div>
            <div class="col fill">
              ${verdict(false, 'Don’t use it for')}
              ${list(['The logo, in any of its versions.', 'Headlines, icons and decoration.', 'Backgrounds of whole sections or pages.', 'Status, even in progress: that’s what the status colors are for.'])}
            </div>
            <div class="col fill">
              <h3>Steps</h3>
              <p class="body"><b>600</b> for fills, rings and icons in both themes, deepening to <b>700</b> on hover, so white labels reach ${contrast(PAPER, blue[600]).toFixed(2)}:1 and ${contrast(PAPER, blue[700]).toFixed(2)}:1. Blue words use 700 on light and 400 on dark (accent-strong): 4.5:1 on every surface.</p>
            </div>
          </div>
          <div class="row" style="margin-top:28px;gap:16px">${actions(themes.light, 'Light')}${actions(themes.dark, 'Dark')}</div>`,
      },
      {
        title: 'Proportion',
        html: `
          ${head('04 — Color', 'Proportion', 'Roughly how much of each, on a typical page of the app, the website or the docs.')}
          <div style="margin-top:44px;display:flex;height:200px;border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px ${gray[200]}">
            ${[
              ['Paper and light grays', 62, gray[100]],
              ['Ink', 18, INK],
              ['Mist and Silver', 14, gray[300]],
              ['Blue', 4, blue[600]],
              ['Status', 2, status.light.good],
            ]
              .map(
                ([name, share, hex]) =>
                  `<div style="flex:${share};background:${hex};color:${textOn(hex as string)};padding:16px;display:flex;flex-direction:column;justify-content:flex-end;min-width:0"><div style="font-size:${(share as number) > 10 ? 15 : 0}px;font-weight:600">${name}</div><div class="mono" style="font-size:${(share as number) > 10 ? 12 : 0}px;opacity:0.8">${share}%</div></div>`,
              )
              .join('')}
          </div>
          <p class="small" style="margin-top:14px;text-align:right">Blue, about 4%: what you can act on. Status, about 2%: only where something’s wrong.</p>
          <div class="row" style="margin-top:36px;gap:48px">
            <p class="body fill">A page should look gray at a glance, with the blue and the status colors standing out because there’s so little of them.</p>
            <p class="body fill">In the brand’s own pictures there’s even less color: black, white, gray, and the light.</p>
          </div>`,
      },
      {
        title: 'Contrast',
        html: `
          ${head('04 — Color', 'Contrast', 'Text meets WCAG 2 AA on every surface, shown here on the hardest: 4.5:1, or 3:1 for large text (24 px, or 19 px bold).')}
          <table class="data" style="margin-top:28px">
            <thead><tr><th>Pair</th><th>Sample</th><th>Ratio</th><th>Passes</th><th>For</th></tr></thead>
            <tbody>
              ${pairs
                .map(
                  ([name, fg, bg, use]) => `<tr>
                    <td style="color:${INK};font-weight:500">${name}</td>
                    <td>${sample(fg, bg, 'Your clusters')}</td>
                    <td class="mono">${contrast(fg, bg).toFixed(2)}:1</td>
                    <td class="mono">${level(contrast(fg, bg))}</td>
                    <td>${use}</td></tr>`,
                )
                .join('')}
            </tbody>
          </table>`,
      },
      {
        title: 'Status',
        html: `
          ${head('04 — Color', 'Status', 'Five levels of health, the same in the app, the docs and the website. Each has a color, an icon and a word, and never shows as color alone.')}
          <table class="data" style="margin-top:22px;font-size:14px">
            <thead><tr><th style="width:190px">Level</th><th style="width:270px">In the app, light and dark</th><th>Means</th><th style="width:170px">Mark</th><th style="width:170px">Words</th></tr></thead>
            <tbody>${levels.map(statusRow).join('')}</tbody>
          </table>
          <p class="small" style="margin-top:12px">Light, then dark. Each ratio is the lowest on any surface of its theme, and for words on the pill’s fill too: marks need 3:1 (WCAG 1.4.11), words 4.5:1.</p>`,
      },
      {
        title: 'Status in use, and data',
        html: `
          ${head('04 — Color', 'Status in use, and data', 'Health and charts keep their own colors: they say how things are, and never decorate.')}
          <div class="content">
            <div class="col fill">
              <h3>Status</h3>
              ${list([
                '<b>Never color alone.</b> A dot sits beside a name, and a pill has its icon and its word.',
                '<b>Marks and words.</b> Dots, bars and fills take the status color; words take its <span class="mono">*-text</span> token, which reads on every surface.',
                `<b>A pill</b> is its words on its mark at ${PILL_FILL * 100}%, over whatever it’s on.`,
                `<b>Progressing is neutral, moving.</b> Its dot pulses, to ${motion.pulse.opacity * 100}% and back every ${motion.pulse.duration.replace('s', ' s')}; the dashed circle on its pill turns once every ${motion.turn.duration.replace('s', ' s')}. Both hold still for reduced motion.`,
                '<b>Blue is never a status,</b> not even for something in progress: it’s for what you can act on.',
                '<b>Four colors, five levels.</b> There’s no orange between warning and critical: it’s hard to tell from either, more so for color-blind readers.',
                '<b>Lists sort by level,</b> critical first, so what needs you is at the top.',
              ])}
            </div>
            <div class="col fill">
              <h3>Data</h3>
              <p class="body">Eight categorical colors for charts, in this order: neighbors stay apart for readers with color-blind vision. Use them in order, and gray for “other”.</p>
              ${['light', 'dark']
                .map(
                  (
                    theme,
                  ) => `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;padding:14px;border-radius:12px;background:${theme === 'light' ? gray[100] : gray[950]}">
                    ${series[theme as 'light']
                      .map(
                        (hex, i) =>
                          `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:46px;border-radius:7px;background:${hex}"></div><span class="mono" style="font-size:11px;color:${theme === 'light' ? gray[600] : gray[500]}">${i + 1}</span></div>`,
                      )
                      .join('')}
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px"><div style="width:100%;height:46px;border-radius:7px;background:${series.other[theme as 'light']}"></div><span class="mono" style="font-size:11px;color:${gray[500]}">other</span></div>
                  </div>`,
                )
                .join('')}
            </div>
          </div>`,
      },
      {
        title: 'Themes',
        html: `
          ${head('04 — Color', 'Themes', 'The app’s semantic tokens, in colors/tokens.css: light, and dark when the system or data-theme says so.')}
          <div class="row" style="margin-top:24px;gap:64px;align-items:flex-start">
            <div class="fill">${tokenTable(tokenRows.slice(0, half))}</div>
            <div class="fill">${tokenTable(tokenRows.slice(half))}</div>
          </div>
          <p class="small" style="margin-top:16px">Use the tokens, not the hex values, in the app, the website and the docs, so a theme can change in one place.</p>`,
      },
    ],
  }
}
