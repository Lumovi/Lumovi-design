// 04 Color: the named colors in every notation, the gray and blue scales and their roles,
// proportion, contrast, status and data colors, and the app's themes.
import { blue, brand, gray, INK, PAPER, series, status, themes } from '../colors.ts'
import { head, list, verdict, type Section } from './kit.ts'
import { cmyk, contrast, level, oklch, rgb, textOn } from './math.ts'

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
        <span style="font-size:13px;color:${t.accent};font-weight:500">View in the docs</span>
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
    ['Ink on Paper', INK, PAPER, 'Body text, headlines'],
    ['Gray 700 on Paper', gray[700], PAPER, 'Secondary text (text-2)'],
    ['Gray 600 on Paper', gray[600], PAPER, 'Quiet text, captions (text-3)'],
    ['Gray 500 on Paper', gray[500], PAPER, 'Large text only'],
    ['Blue 600 on Paper', blue[600], PAPER, 'Links'],
    ['Paper on Blue 600', PAPER, blue[600], 'Primary buttons'],
    ['#ededed on Gray 950', '#ededed', gray[950], 'Body text, dark (text-1)'],
    ['Gray 400 on Gray 950', gray[400], gray[950], 'Secondary text, dark (text-2)'],
    ['Gray 500 on Gray 950', gray[500], gray[950], 'Quiet text, dark (text-3)'],
    ['Blue 500 on Gray 950', blue[500], gray[950], 'Links, dark'],
  ]
  const tokenRows = (Object.keys(themes.light) as (keyof typeof themes.light)[]).map((key) => {
    const l = themes.light[key]
    const d = themes.dark[key]
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
              ['Text', '950 (Ink), 700 and 600 on light; #ededed, 400 and 500 on dark.'],
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
              ${list(['Links, in running text and lists.', 'Primary buttons, one to a view.', 'Focus rings, and the selected row or tab.', 'Progress, and the one chart series that matters most.'])}
            </div>
            <div class="col fill">
              ${verdict(false, 'Don’t use it for')}
              ${list(['The logo, in any of its versions.', 'Headlines, icons and decoration.', 'Backgrounds of whole sections or pages.', 'Status: that’s what the status colors are for.'])}
            </div>
            <div class="col fill">
              <h3>Steps</h3>
              <p class="body"><b>600</b> on light and <b>500</b> on dark, with <b>700</b> and <b>400</b> to press or hover. Text in 600, and white text on it, reach 4.5:1 on white.</p>
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
              ['Status', 2, status.good],
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
          ${head('04 — Color', 'Contrast', 'Text meets WCAG 2 AA: 4.5:1 for body text, 3:1 for large text (24 px, or 19 px bold).')}
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
        title: 'Status and data',
        html: `
          ${head('04 — Color', 'Status and data', 'Health and charts keep their own colors: they say how things are, and never decorate.')}
          <div class="content">
            <div class="col fill">
              <h3>Status</h3>
              <p class="body">Marks (dots, bars) are the same in both themes; text in a status color uses a readable step for its theme. A status color always comes with a word.</p>
              <table class="data" style="margin-top:8px">
                <thead><tr><th>Status</th><th>Mark</th><th>Text, light</th><th>Text, dark</th></tr></thead>
                <tbody>
                  ${(
                    [
                      [
                        'Good',
                        status.good,
                        themes.light['good-text'],
                        themes.dark['good-text'],
                        'Running',
                      ],
                      [
                        'Warning',
                        status.warn,
                        themes.light['warn-text'],
                        themes.dark['warn-text'],
                        'Pending',
                      ],
                      [
                        'Serious',
                        status.serious,
                        themes.light['serious-text'],
                        themes.dark['serious-text'],
                        'Degraded',
                      ],
                      [
                        'Critical',
                        status.critical,
                        themes.light['critical-text'],
                        themes.dark['critical-text'],
                        'CrashLoopBackOff',
                      ],
                      ['Neutral', status.neutral, gray[600], gray[500], 'Completed'],
                    ] as const
                  )
                    .map(
                      ([name, mark, lt, dt, word]) => `<tr>
                        <td style="color:${INK};font-weight:500">${name}</td>
                        <td><span class="chip" style="background:${mark};border-radius:7px"></span><span class="mono" style="font-size:12px">${mark}</span></td>
                        <td><span style="color:${lt};font-weight:550">${word}</span></td>
                        <td><span style="display:inline-block;padding:3px 9px;border-radius:6px;background:${gray[950]};color:${dt};font-weight:550">${word}</span></td></tr>`,
                    )
                    .join('')}
                </tbody>
              </table>
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
