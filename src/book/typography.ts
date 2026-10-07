// 05 Typography: Inter and JetBrains Mono, the type scale, headlines, and numbers and code.
import { tagline } from '../brand.ts'
import { gray, INK, status, themes } from '../colors.ts'
import { head, list, specs, type Section } from './kit.ts'

/** The type scale for the website, the docs and anything printed. The app's interface is denser. */
const SCALE: [
  name: string,
  size: number,
  line: number,
  weight: number,
  tracking: string,
  sample: string,
][] = [
  ['Display', 76, 1.02, 650, '−0.045em', 'Your clusters'],
  ['Title', 48, 1.08, 650, '−0.035em', 'Every kind, one list'],
  ['Heading', 32, 1.15, 600, '−0.025em', 'Usage over time'],
  ['Subheading', 20, 1.35, 600, '−0.01em', 'Right-sizing your workloads'],
  ['Lead', 20, 1.5, 400, '−0.005em', 'See what’s healthy, and where your capacity goes.'],
  ['Body', 16, 1.6, 400, '0', 'Pick a cluster and Lumovi shows you how it’s doing.'],
  ['Small', 14, 1.5, 400, '0', 'Lists load in chunks, so thousands of pods stay smooth.'],
  ['Label', 12, 1.3, 600, '+0.1em', 'NODES · PODS · EVENTS'],
]

export function typographySection(): Section {
  const glyphs =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 ¶ & @ ( ) [ ] { } → ✓'
  return {
    number: '05',
    name: 'Typography',
    summary: 'Inter for everything you read, the wordmark included, and JetBrains Mono for code.',
    pages: [
      {
        title: 'Inter',
        html: `
          ${head('05 — Typography', 'Inter')}
          <div class="content" style="align-items:stretch">
            <div class="figure mist" style="flex:1;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:44px">
              <div style="font-size:250px;line-height:0.8;font-weight:650;letter-spacing:-0.05em;font-variation-settings:'opsz' 32">Aa</div>
              <div style="font-size:24px;line-height:1.35;letter-spacing:-0.01em;color:${gray[700]}">${glyphs}</div>
            </div>
            <div class="col text" style="gap:20px">
              <p class="body">The typeface of the app, the website, the docs, and the wordmark. Clear at 11 pixels in a dense table, and calm at 76 in a headline.</p>
              <div class="row" style="gap:22px;font-size:22px;color:${INK}">
                <span style="font-weight:400">Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">Semibold</span><span style="font-weight:700">Bold</span>
              </div>
              ${specs([
                ['Designer', 'Rasmus Andersson'],
                ['Axes', 'weight 100–900 · optical size 14–32'],
                ['Headlines', 'Display (opsz 32), 600–650'],
                ['Text', 'Text (opsz 14), 400–500'],
                ['Features', 'cv11 (single-story a), ss01 (open digits)'],
                ['License', 'SIL Open Font License 1.1'],
                ['Get it', 'rsms.me/inter · @fontsource-variable/inter'],
              ])}
            </div>
          </div>`,
      },
      {
        title: 'JetBrains Mono',
        html: `
          ${head('05 — Typography', 'JetBrains Mono')}
          <div class="content" style="align-items:stretch">
            <div class="figure ink" style="flex:1;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:44px;color:#ededed">
              <div class="mono" style="font-size:150px;line-height:0.9;font-weight:500">{ }</div>
              <div class="mono" style="font-size:20px;line-height:1.7;color:${gray[400]}">
                <span style="color:${gray[600]}">$</span> kubectl get pods -n checkout<br>
                api-7f9c4d &nbsp;1/1 &nbsp;<span style="color:${themes.dark['good-text']}">Running</span> &nbsp;&nbsp;0 &nbsp;12d<br>
                worker-2x8p 0/1 &nbsp;<span style="color:${themes.dark['warn-text']}">Pending</span> &nbsp;&nbsp;0 &nbsp;&nbsp;4m
              </div>
            </div>
            <div class="col text" style="gap:20px">
              <p class="body">For code, commands, YAML, logs, object names and numbers that line up: anything that’s typed, or read character by character.</p>
              ${specs([
                ['Designer', 'JetBrains'],
                ['Axes', 'weight 100–800'],
                ['Use', '400, with 500 for emphasis'],
                ['Ligatures', 'Off: code reads as it’s typed'],
                ['License', 'SIL Open Font License 1.1'],
                ['Get it', 'jetbrains.com/lp/mono · @fontsource-variable/jetbrains-mono'],
              ])}
            </div>
          </div>`,
      },
      {
        title: 'Type scale',
        html: `
          ${head('05 — Typography', 'Type scale', 'For the website, the docs and anything printed. Pick from it rather than between it.')}
          <table class="data" style="margin-top:20px">
            <thead><tr><th style="width:150px">Style</th><th>Sample</th><th style="width:300px">Size / line · weight · tracking</th></tr></thead>
            <tbody>
              ${SCALE.map(
                ([name, size, line, weight, tracking, sample]) => `<tr>
                  <td style="color:${INK};font-weight:500">${name}</td>
                  <td style="padding-top:${size > 40 ? 4 : 10}px;padding-bottom:${size > 40 ? 4 : 10}px"><span style="display:block;font-size:${Math.min(size, 60)}px;line-height:${line};font-weight:${weight};letter-spacing:${tracking.replace('−', '-')};color:${name === 'Lead' ? gray[700] : INK};${name === 'Label' ? 'text-transform:uppercase;' : ''}font-variation-settings:'opsz' ${size >= 20 ? 32 : 14};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:820px">${sample}</span></td>
                  <td class="mono">${size}/${Math.round(size * line)} · ${weight} · ${tracking}</td></tr>`,
              ).join('')}
            </tbody>
          </table>
          <p class="small" style="margin-top:14px">Display is shown at 60 px here; it’s 76 px on the page. In the app, the interface is denser: 13 px for text, 11 and 12 px in tables, all from Inter.</p>`,
      },
      {
        title: 'Headlines',
        html: `
          ${head('05 — Typography', 'Headlines')}
          <div class="content" style="align-items:stretch">
            <div class="figure mist" style="flex:1;flex-direction:column;align-items:flex-start;justify-content:center;padding:64px">
              <div style="font-size:84px;font-weight:650;letter-spacing:-0.045em;line-height:1.02;font-variation-settings:'opsz' 32">${tagline[0]}<br><span class="quiet">${tagline[1]}</span></div>
              <p style="font-size:22px;line-height:1.5;color:${gray[700]};margin-top:28px;max-width:30em">A beautiful, fast Kubernetes dashboard. On your desktop, or in your cluster.</p>
            </div>
            <div class="col text" style="gap:14px">
              ${list([
                '<b>Two tones.</b> The first line in Ink, what follows quieter: gray 600 on light, gray 500 on dark. One statement, read in two beats.',
                '<b>Short.</b> Two lines at most, in sentence case, ending with a period when it’s a sentence.',
                '<b>Tight.</b> Display size, semibold, tracked −0.045em, with the line height almost solid.',
                '<b>Balanced.</b> Break lines by meaning, not by the edge of the box.',
                '<b>Left-aligned,</b> with the text below it on the same edge.',
              ])}
            </div>
          </div>`,
      },
      {
        title: 'Numbers, names and code',
        html: `
          ${head('05 — Typography', 'Numbers, names and code', 'What’s read character by character gets JetBrains Mono; numbers that line up get tabular figures.')}
          <div class="content" style="align-items:stretch">
            <div class="figure paper" style="flex:1;flex-direction:column;align-items:stretch;justify-content:center;padding:36px 40px">
              <table class="data" style="font-size:15px">
                <thead><tr><th>Pod</th><th>Status</th><th style="text-align:right">CPU</th><th style="text-align:right">Memory</th><th style="text-align:right">Age</th></tr></thead>
                <tbody style="font-variant-numeric:tabular-nums">
                  ${[
                    ['api-7f9c4d', 'Running', status.light.good, '120m', '256Mi', '12d'],
                    ['worker-2x8p', 'Pending', status.light.warn, '—', '—', '4m'],
                    ['cache-0', 'Running', status.light.good, '1,240m', '1.8Gi', '31d'],
                    ['ingest-5b6c', 'CrashLoopBackOff', status.light.critical, '15m', '64Mi', '2h'],
                  ]
                    .map(
                      ([pod, s, c, cpu, mem, age]) =>
                        `<tr><td class="mono" style="color:${INK}">${pod}</td><td><span class="chip" style="background:${c};border-radius:7px;width:8px;height:8px;vertical-align:1px"></span>${s}</td><td style="text-align:right">${cpu}</td><td style="text-align:right">${mem}</td><td style="text-align:right">${age}</td></tr>`,
                    )
                    .join('')}
                </tbody>
              </table>
              <div class="mono" style="margin-top:28px;padding:18px 20px;border-radius:12px;background:${gray[950]};color:#ededed;font-size:14px;line-height:1.7">
                <span style="color:${gray[500]}">$</span> kubectl scale deployment/api --replicas=3
              </div>
            </div>
            <div class="col text" style="gap:14px">
              ${list([
                '<b>Names in mono:</b> pods, namespaces, nodes, images and anything else you’d type.',
                '<b>Numbers in Inter,</b> with tabular figures (font-variant-numeric: tabular-nums) wherever they line up in a column.',
                '<b>Units close:</b> 120m, 256Mi, 12d, as kubectl writes them.',
                '<b>A dash for nothing</b>, never 0 when there’s no value.',
                '<b>Status with a word,</b> and the color on a dot beside it.',
              ])}
            </div>
          </div>`,
      },
    ],
  }
}
