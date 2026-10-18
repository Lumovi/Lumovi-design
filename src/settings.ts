/**
 * Lumovi's Settings (LMV-357) and its shortcuts editor (one frame of LMV-358), as app's plan has
 * them: a page reached by ⌘, and the app menu on the desktop, and the sidebar and palette on a
 * server; Appearance, Time, Terminal, Namespaces and Updates, each applied at once; values policy
 * sets shown as "Set by your organization". Drawn in Lumovi's window with its own controls (the
 * Switch, the segmented control, Toggle's locked line). Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, win } from './windows.ts'

const CSS = `${WINDOW}
.sheet { display: flex; flex-direction: column; gap: 44px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-2); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 32px; max-width: 1376px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.rules code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.rowx { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }

/* The Settings page: its sections at the left, the one open at the right. */
.sp { display: flex; flex: 1; min-height: 0; }
.snav { flex: none; width: 216px; padding: 16px 12px; border-right: 1px solid var(--line); }
.snav .s { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.snav .s svg.i { color: var(--text-3); }
.snav .s.on { background: var(--surface-3); font-weight: 500; color: var(--text-1); }
.snav .s .lk { margin-left: auto; color: var(--text-3); }
.sbody { flex: 1; min-width: 0; overflow: hidden; padding: 20px 32px 24px; }
.sbody h2 { margin: 0 0 2px; font-size: 17px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; }
.sbody .lead2 { margin: 0 0 18px; font-size: 13px; color: var(--text-3); }
.set { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 4px 24px; align-items: start; padding: 14px 0; border-top: 1px solid var(--line); }
.set > .k b { display: block; font-size: 13px; font-weight: 500; }
.set > .k small { display: block; margin-top: 2px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.set > .v { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
.set .line { font-size: 12px; line-height: 17px; color: var(--text-3); }
.set .lockl { font-size: 12px; line-height: 17px; color: var(--text-2); }
.set .lockl svg.i { display: inline-block; margin-right: 4px; vertical-align: -2px; }
.set.locked > .v > :not(.lockl):not(.line) { opacity: 0.5; }
.seg2 { display: inline-flex; align-self: flex-start; padding: 2px; border-radius: 8px; background: var(--surface-3); }
.seg2 span { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 6px; font-size: 13px; color: var(--text-2); }
.seg2 span svg.i { color: var(--text-3); }
.seg2 span.on { background: var(--surface); color: var(--text-1); box-shadow: 0 1px 2px rgb(0 0 0 / 0.12); }
.sw2 { position: relative; display: inline-block; width: 32px; height: 18px; flex: none; border-radius: 999px; background: color-mix(in srgb, var(--text-3) 40%, transparent); }
.sw2::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); }
.sw2.on { background: var(--accent); }
.sw2.on::after { left: 16px; }
.tg2 { display: flex; align-items: flex-start; gap: 10px; }
.tg2 .tw2 b { display: block; font-size: 13px; font-weight: 500; }
.tg2 .tw2 small { display: block; font-size: 12px; line-height: 17px; color: var(--text-3); }
.sel3 { display: inline-flex; align-self: flex-start; min-width: 240px; height: 32px; align-items: center; gap: 8px; padding: 0 8px 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; }
.sel3 small { color: var(--text-3); }
.sel3 svg.i:last-child { margin-left: auto; color: var(--text-3); }
.sel3.mono { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.sw3 { display: flex; gap: 8px; }
.sw3 span { position: relative; display: grid; width: 26px; height: 26px; place-items: center; border-radius: 50%; background: var(--c); }
.sw3 span.on { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--c); }
.sw3 span.on svg.i { color: inherit; }
.radios { display: flex; flex-direction: column; gap: 8px; }
.radios .r { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.radios .r .rd { width: 14px; height: 14px; flex: none; border: 1.5px solid var(--line-strong); border-radius: 50%; background: var(--surface); }
.radios .r.on .rd { border: 4px solid var(--accent); }
.radios .r small { margin-left: 4px; font-size: 12px; color: var(--text-3); }
.radios .r .in3 { display: inline-flex; height: 28px; align-items: center; margin-left: 6px; padding: 0 8px; border: 1px solid var(--line-strong); border-radius: 7px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.stepper { display: inline-flex; align-self: flex-start; align-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); }
.stepper span { display: grid; min-width: 32px; height: 30px; place-items: center; padding: 0 8px; font-size: 13px; color: var(--text-2); }
.stepper span + span { border-left: 1px solid var(--line); }
.stepper .val { min-width: 64px; color: var(--text-1); font-variant-numeric: tabular-nums; }
.preview { display: flex; align-self: stretch; flex-direction: column; gap: 2px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; background: #0d0d0d; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 19px; color: #ededed; }
.preview .p { color: #8f8f8f; }
.preview > span { white-space: pre; }
.sfoot { display: flex; align-items: center; gap: 10px; margin-top: 16px; font-size: 12px; color: var(--text-3); }
.sfoot .lnk { font-weight: 500; color: var(--accent-strong); }
.upd { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-2); }
.upd .btn { height: 28px; padding: 0 10px; font-size: 12px; }

/* The shortcuts editor. */
.kgrp { margin: 18px 0 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.kgrp:first-of-type { margin-top: 4px; }
.kl { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.kr { display: grid; grid-template-columns: minmax(0, 1fr) auto 28px; align-items: center; gap: 12px; min-height: 40px; padding: 4px 8px 4px 14px; font-size: 13px; }
.kr + .kr { border-top: 1px solid var(--line); }
.kr .lab small { margin-left: 8px; font-size: 11.5px; font-weight: 500; color: var(--accent-strong); }
.kr .lab small.bi { color: var(--text-3); font-weight: 400; }
.kr .keys { display: flex; align-items: center; gap: 4px; }
.kbd2 { display: inline-flex; min-width: 22px; height: 22px; align-items: center; justify-content: center; padding: 0 6px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); font-size: 12px; font-weight: 500; color: var(--text-2); }
.kr .ed { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 7px; color: var(--text-3); }
.kr.hov { background: color-mix(in srgb, var(--surface-3) 50%, transparent); }
.kr.hov .ed { color: var(--text-1); }
.kr.rec { background: var(--accent-soft); }
.kr.rec .keys .wait { display: inline-flex; height: 26px; align-items: center; gap: 6px; padding: 0 10px; border: 1.5px dashed var(--accent); border-radius: 7px; font-size: 12px; color: var(--accent-strong); }
.kr .cf { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin: 2px 0 4px; padding: 8px 10px; border-radius: 8px; font-size: 12.5px; line-height: 18px; }
.kr .cf.warn { background: color-mix(in srgb, var(--warn) 10%, transparent); color: var(--text-1); }
.kr .cf.bad { background: color-mix(in srgb, var(--critical) 8%, transparent); color: var(--critical-text); }
.kr .cf svg.i { flex: none; }
.kr .cf.warn svg.i { color: var(--warn-text); }
.kr .cf .btn { height: 26px; padding: 0 8px; font-size: 12px; }
.kr .cf .sp2 { flex: 1; }
.kr .cf > span:not(.sp2):not(.btn) { flex: 1 1 320px; min-width: 0; }
.kr .lk2 { color: var(--text-3); }
.ktop { display: flex; align-items: center; gap: 10px; margin: 0 0 6px; }
.ktop .fld { width: 280px; }
.ktop .grow { flex: 1; }
.ktop .btn { height: 30px; }

/* On a phone: the server's Settings, a section a page. */
.phx { display: flex; width: 390px; height: 844px; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.phx .pb { display: flex; height: 52px; flex: none; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phx .pb b { flex: 1; font-weight: 600; }
.phx .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phx .li { display: flex; min-height: 52px; align-items: center; gap: 12px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phx .li svg.i { color: var(--text-3); }
.phx .li small { margin-left: auto; font-size: 13px; color: var(--text-3); }
.phx .li .chev { color: var(--text-3); }
.phx .pin { padding: 16px; }
.phx .pin .set { grid-template-columns: 1fr; gap: 8px; }
.phx .seg2 span { padding: 10px 14px; font-size: 15px; }
.phx .sw3 span { width: 36px; height: 36px; }
.phx .phr2 { display: flex; height: 44px; align-items: center; margin: 8px 0 0; font-size: 15px; font-weight: 500; color: var(--accent-strong); }
.phx .note3 { margin: 12px 16px; font-size: 13px; line-height: 1.5; color: var(--text-3); }
`

// ─── Parts ──────────────────────────────────────────────────────────────────────────────────

const sw = (on: boolean) => `<span class="sw2${on ? ' on' : ''}"></span>`

const seg = (opts: (string | [IconName, string])[], on: number) =>
  `<span class="seg2">${opts.map((o, i) => `<span${i === on ? ' class="on"' : ''}>${typeof o === 'string' ? o : `${icon(o[0], 14)}${o[1]}`}</span>`).join('')}</span>`

const LOCK = (who = 'Set by your organization') =>
  `<span class="lockl">${icon('lock', 12)}${who}</span>`

const setting = (
  key: string,
  sub: string,
  value: string,
  o: { locked?: boolean; line?: string } = {},
) =>
  `<div class="set${o.locked ? ' locked' : ''}"><div class="k"><b>${key}</b>${sub ? `<small>${sub}</small>` : ''}</div><div class="v">${o.locked ? LOCK() : ''}${value}${o.line ? `<span class="line">${o.line}</span>` : ''}</div></div>`

/**
 * The accents, each as Blue is: a fill its label reads on (4.5:1 or more) and a strong shade for
 * links and words on a surface (4.5:1 or more), per theme. Measured: label on fill 4.60 (Blue),
 * 5.36 (Cyan), 5.62 (Violet), 10.37 and 13.36 (Graphite); strong on surface 6.16 to 12.64. None is
 * near a status's hue: critical 0°, warning 38°, good 120°; Cyan is 193°, Violet 253°.
 */
/** The theme the frame is drawn in, which System is now. */
let NOW: Scheme = 'dark'

const ACCENTS: { name: string; light: [string, string, string]; dark: [string, string, string] }[] =
  [
    {
      name: 'Blue',
      light: ['#2675d3', '#1c5cab', '#ffffff'],
      dark: ['#2675d3', '#5ea2f0', '#ffffff'],
    },
    {
      name: 'Cyan',
      light: ['#0e7490', '#0e6a83', '#ffffff'],
      dark: ['#0e7490', '#3cc4dd', '#ffffff'],
    },
    {
      name: 'Violet',
      light: ['#6d4fd6', '#5b3fc4', '#ffffff'],
      dark: ['#6d4fd6', '#a99bf5', '#ffffff'],
    },
    {
      name: 'Graphite',
      light: ['#404040', '#404040', '#ffffff'],
      dark: ['#d4d4d4', '#d4d4d4', '#0a0a0a'],
    },
  ]

/** Each accent's fill and label as variables, for the scheme the frame is drawn in. */
const accentVars = (scheme: Scheme) =>
  ACCENTS.map((a, i) => `--acc${i}: ${a[scheme][0]}; --acc${i}-on: ${a[scheme][2]};`).join(' ')

const swatches = (size: number) =>
  `<span class="sw3">${ACCENTS.map((a, i) => `<span style="--c:var(--acc${i});color:var(--acc${i}-on)" title="${a.name}" class="${i === 0 ? 'on' : ''}">${i === 0 ? icon('check', size, 3) : ''}</span>`).join('')}</span>`

type Section = 'Appearance' | 'Time' | 'Terminal' | 'Namespaces' | 'Updates' | 'Keyboard shortcuts'

const SECTIONS: [Section, IconName][] = [
  ['Appearance', 'palette'],
  ['Time', 'clock'],
  ['Terminal', 'square-terminal'],
  ['Namespaces', 'layout-grid'],
  ['Keyboard shortcuts', 'keyboard'],
  ['Updates', 'download'],
]

function appearance(): string {
  return `<h2>Appearance</h2><p class="lead2">Applied at once, in every window.</p>
    ${setting(
      'Theme',
      '',
      seg(
        [
          ['monitor', 'System'],
          ['sun', 'Light'],
          ['moon', 'Dark'],
        ],
        0,
      ),
      { line: `System follows macOS: ${NOW} now.` },
    )}
    ${setting('Accent', 'Buttons, links and what’s picked.', `${swatches(14)}`, { line: 'Blue. Statuses keep their own colours: no accent is red, amber or green.' })}
    ${setting('Density', 'How much fits in a list.', seg(['Comfortable', 'Compact'], 0), { line: 'Compact rows are 36 px, from 46.' })}
    ${setting('Text size', '', `<span class="stepper"><span>${icon('minus', 14)}</span><span class="val">100%</span><span>${icon('plus', 14)}</span></span>`, { line: '90% to 125%. ⌘+ and ⌘− change it too, and ⌘0 puts it back.' })}`
}

function time(): string {
  return `<h2>Time</h2><p class="lead2">How times and dates are shown. Ages (“2h”, “3d”) are the same everywhere.</p>
    ${setting('Time zone', '', `<span class="sel3">This computer’s <small>Europe/Budapest, UTC+2</small>${icon('chevron-down', 14)}</span>`, { line: 'Or UTC, or any zone: events, logs and audit read in it.' })}
    ${setting('Clock', '', seg(['System', '12-hour', '24-hour'], 0), { line: 'System: 24-hour now, as macOS has it.' })}`
}

function terminal(desktop = true): string {
  return `<h2>Terminal</h2><p class="lead2">For every terminal in the dock. Open ones change at once.</p>
    ${setting('Font', '', `<div class="rowx" style="gap:8px"><span class="sel3 mono" style="min-width:200px">JetBrains Mono${icon('chevron-down', 14)}</span><span class="stepper"><span>${icon('minus', 14)}</span><span class="val">12 px</span><span>${icon('plus', 14)}</span></span></div><div class="preview"><span><span class="p">~ ›</span> kubectl get pods -n shop</span><span>NAME                      READY   STATUS</span><span>checkout-7d9f6c5b8-hqnnn  0/1     CrashLoopBackOff</span></div>`)}
    ${setting('Copy on select', '', `<span class="tg2">${sw(false)}<span class="tw2"><b>Copy what I select</b><small>Off: select, then ⌘C, as a terminal does by default.</small></span></span>`)}
    ${desktop ? setting('Shell', 'The program a terminal starts.', `<span class="sel3 mono">/bin/zsh <small>your login shell</small>${icon('chevron-down', 14)}</span>`, { line: 'Or another shell this computer has, or a path. It starts with kubectl pointed at the terminal’s cluster, whichever shell it is.' }) : ''}`
}

function namespaces(locked = false): string {
  return `<h2>Namespaces</h2><p class="lead2">Which namespace a cluster opens in.</p>
    ${setting(
      'When a cluster opens',
      '',
      `<div class="radios"><span class="r"><span class="rd"></span>All namespaces</span><span class="r${locked ? '' : ' on'}"><span class="rd"></span>The one I last picked there<small>as now</small></span><span class="r${locked ? ' on' : ''}"><span class="rd"></span>This one<span class="in3">${locked ? 'shop' : 'default'}</span></span></div>`,
      { locked, line: 'Where a cluster’s own settings name a namespace, that wins.' },
    )}`
}

function updates(locked: boolean): string {
  return `<h2>Updates</h2><p class="lead2">On this computer.</p>
    ${setting('Check automatically', '', `<span class="tg2">${sw(!locked)}<span class="tw2"><b>Check for updates</b><small>Once a day, from lumovi.dev. An update asks before it installs.</small></span></span>`, { locked })}
    ${setting('This version', '', `<span class="upd">Lumovi 1.22.0 · checked 2h ago<span class="btn">Check now</span></span>`)}`
}

// ─── The shortcuts editor ───────────────────────────────────────────────────────────────────

const k = (...keys: string[]) => keys.map((x) => `<span class="kbd2">${escape(x)}</span>`).join('')

type KRow = {
  label: string
  keys: string[]
  changed?: boolean
  hov?: boolean
  rec?: boolean
  cf?: string
  locked?: boolean
  builtin?: boolean
}

const krow = (r: KRow) =>
  `<div class="kr${r.hov ? ' hov' : ''}${r.rec ? ' rec' : ''}"><span class="lab">${r.label}${r.changed ? '<small>Changed</small>' : ''}${r.builtin ? '<small class="bi">Built in</small>' : ''}</span><span class="keys">${r.rec ? `<span class="wait">${icon('keyboard', 13)}Press the new keys · Esc to cancel</span>` : k(...r.keys)}</span><span class="ed">${r.locked ? `<span class="lk2">${icon('lock', 14)}</span>` : r.changed ? icon('rotate-ccw', 15) : r.hov ? icon('pencil', 14) : ''}</span>${r.cf ?? ''}</div>`

function shortcuts(attempt: 'taken' | 'refused'): string {
  const taken = `<div class="cf warn">${icon('triangle-alert', 14)}<span><b style="font-weight:500">⌘ [</b> is Back’s. Use it here, and Back has no keys until you give it some.</span><span class="sp2"></span><span class="btn primary">Use it here</span><span class="btn ghost">Cancel</span></div>`
  const refused = `<div class="cf bad">${icon('circle-alert', 14)}<span><b style="font-weight:500">⌘ W</b> stays the system’s: it closes the window. Press other keys, or Esc.</span></div>`
  const general =
    attempt === 'taken'
      ? `${krow({ label: 'Command palette', keys: ['⌘', 'K'] })}${krow({ label: 'Filter the list', keys: ['/'] })}${krow({ label: 'Refresh', keys: ['⌘', '⇧', 'R'], changed: true, hov: true })}${krow({ label: 'Back', keys: ['⌘', '['] })}${krow({ label: 'Forward', keys: [], rec: true, cf: taken })}`
      : `${krow({ label: 'Command palette', keys: ['⌘', 'K'] })}${krow({ label: 'Forward', keys: [], rec: true, cf: refused })}`
  return `<h2>Keyboard shortcuts</h2><p class="lead2">Change a command’s keys, or put them back. The menus, the palette and ? show yours.</p>
    <div class="ktop"><span class="fld">${icon('search', 14)}Search commands or keys</span><span class="grow"></span><span class="btn">${icon('rotate-ccw', 14)}Reset all…</span></div>
    <div class="kgrp">General</div><div class="kl">${general}</div>
    ${attempt === 'taken' ? `<div class="kgrp">Open object</div><div class="kl">${krow({ label: 'Actions: scale, restart, edit…', keys: ['.'] })}${krow({ label: 'Delete', keys: ['⌘', '⌫'], locked: true })}</div><div class="kgrp">Lists</div><div class="kl">${krow({ label: 'Move through rows', keys: ['↑', '↓'], builtin: true })}${krow({ label: 'Close the detail panel', keys: ['Esc'], builtin: true })}${krow({ label: 'Select the row', keys: ['X'] })}</div>` : ''}`
}

// ─── The page ───────────────────────────────────────────────────────────────────────────────

function page(
  on: Section,
  body: string,
  o: { server?: boolean; locks?: Section[]; nothingToRestore?: boolean } = {},
): string {
  const nav = SECTIONS.filter(([s]) => !(o.server && s === 'Updates'))
    .map(
      ([s, g]) =>
        `<div class="s${s === on ? ' on' : ''}">${icon(g, 16)}${s}${o.locks?.includes(s) ? `<span class="lk">${icon('lock', 12)}</span>` : ''}</div>`,
    )
    .join('')
  return `<div class="sp"><nav class="snav">${nav}</nav><div class="sbody">${body}<p class="sfoot">${o.server ? 'Kept for you on this server: every device you sign in from shows them.' : 'Kept on this computer, in its settings file.'}${o.nothingToRestore ? '' : '<span class="lnk">Restore this section’s defaults</span>'}</p></div></div>`
}

const setWin = (body: string, h = 720, title = 'Settings') =>
  win({
    w: 1376,
    h,
    cluster: 'production-eu',
    nav: '',
    title,
    glyph: 'settings',
    page: body,
    dock: dock([]),
  })
    .replace(/<span class="ns">[\s\S]*?<\/span><span class="find">/, '<span class="find">')
    .replace(`<span class="ib">${icon('plus', 16)}</span>`, '')

function settingsFrame(): string {
  return `<section class="blk"><h2>Settings<i>⌘, or the app menu’s Settings…; a page in the window, its sections at the left</i></h2>${setWin(page('Appearance', appearance()))}</section>
  <section class="blk"><h2>The other sections</h2>
    <p class="cap"><b>Time</b></p>${setWin(page('Time', time()), 460)}
    <p class="cap" style="margin-top:8px"><b>Terminal</b>, with the shell on the desktop.</p>${setWin(page('Terminal', terminal()), 640)}
    <p class="cap" style="margin-top:8px"><b>Namespaces</b>, as it is today unless changed.</p>${setWin(page('Namespaces', namespaces()), 420)}</section>
  <section class="blk"><h2>Set by your organization<i>what policy sets, said where it is, the control off</i></h2>
    <p class="cap"><b>Updates</b>, its check turned off by the organization’s policy; the section’s entry carries the lock.</p>${setWin(page('Updates', updates(true), { locks: ['Updates'], nothingToRestore: true }), 420)}</section>`
}

const SETTINGS_RULES = [
  '<b>Settings is a page</b>, in the window it was asked from, its sections at the left: Appearance, Time, Terminal, Namespaces, Keyboard shortcuts, and Updates on the desktop. On the desktop it’s <b>⌘,</b> (Ctrl+, elsewhere) and the app menu’s Settings…; on a server, the sidebar’s footer and the palette. Back returns to where it was asked from. Where a section is narrower than 720 px (a 1024 window), each setting’s name and line stand above its control, which takes the section’s width. Settings belong to no namespace and no page of the cluster’s: its top bar has no namespace picker, and nothing in the sidebar’s nav is current while it’s open.',
  '<b>Every setting applies at once</b>, in every window, and survives a restart: no Save. Each section has <b>Restore this section’s defaults</b>. The desktop keeps them in its settings file; a server keeps them per person, so every device they sign in from shows the same.',
  '<b>Appearance</b>: Theme (System, Light, Dark; System says which it is now); <b>Accent</b>: Blue, Cyan, Violet, Graphite. Each is Blue’s pair, per theme: a fill for buttons and what’s picked, its label 4.5:1 or more on it (Graphite’s dark fill takes a dark label), and a strong shade for links, “Changed” and words, 4.5:1 or more on the surfaces; its soft tint as Blue’s is made. None sits near a status’s hue, so no accent reads as red, amber or green. <b>Under Graphite links are underlined</b>: its shade is the text’s grey (1.3:1 to the text in dark, 1.9:1 in light), so without the line a link would look like any other words. Density (Comfortable, Compact: rows 46 px, as today, or 36 px). <b>Text size</b>, 90% to 125%: it is the View menu’s Actual Size, Zoom In and Zoom Out (⌘0, ⌘+, ⌘−), one setting, not two.',
  '<b>Time</b>: the zone (this computer’s, UTC, or any) in which events, logs and the audit read; the clock (System, 12-hour, 24-hour). The zone’s field shows its value whole (“This computer’s (Europe/Budapest, UTC+2)”); where it can’t, the zone’s name is cut in its middle, never its offset. Ages stay as they are. <b>Terminal</b>: font and size (12 px by default, as today) with a live preview; Copy on select; on the desktop, the Shell (the login shell, another one, or a path), started with kubectl pointed at the terminal’s cluster whichever shell it is.',
  '<b>Namespaces</b>: when a cluster opens, All namespaces, the one last picked there (today’s, and the default), or a named one. A cluster’s own settings’ namespace wins over it.',
  '<b>Set by your organization</b>: a value policy sets (the desktop’s policy file, or the chart’s <code>settings:</code>) shows the policy’s value, its control off, and the line with a lock “Set by your organization”, as a cluster’s Read-only does today. The section’s entry carries the lock too. Restore skips it, and isn’t shown where nothing’s left to restore. Under a policy that turns the automatic check off, <b>Check now</b> stays: the person can still look.',
]

function shortcutsFrame(): string {
  return `<section class="blk"><h2>Keyboard shortcuts<i>a section of Settings: change a command’s keys, put them back, and conflicts said before they happen</i></h2><p class="cap"><b>Keys another command has</b>, pressed for Forward; Refresh changed, under the pointer; Delete locked by policy.</p>${setWin(page('Keyboard shortcuts', shortcuts('taken')), 940)}<p class="cap" style="margin-top:8px"><b>Keys that can’t be taken</b>, pressed for Forward.</p>${setWin(page('Keyboard shortcuts', shortcuts('refused')), 480)}</section>`
}

const KEY_RULES = [
  '<b>Every command with keys</b>, grouped as the Keyboard shortcuts sheet groups them, with a search for a command or a key. A row’s pencil (or Enter on it) asks for the new keys: “Press the new keys · Esc to cancel”. Esc cancels, so it can’t be recorded. <b>Built in</b>, in their groups with no pencil: moving through a list (the arrows, J and K, Home and End, ↵), Esc for closing (the detail panel, as every dialog and menu), the G sequences, ⌘1–6, ⌥1–9, ⌥← and ⌥→, zoom, F2 and ⌘↵ (Approve): keys a person moves and leaves by, the same in every copy of Lumovi. A changed row says <b>Changed</b> and its ↺ puts its default back; <b>Reset all…</b> asks once, then puts every default back; with nothing changed it stays, dimmed.',
  '<b>Keys another command has, in the same place</b>, are said before they’re taken: “⌘ [ is Back’s. Use it here, and Back has no keys until you give it some.”, with <b>Use it here</b> and Cancel. A place is where a key works: everywhere, a list, an open object, the Clusters page, or a terminal. Places that never meet share keys today and keep doing so (⌘⌫ is Delete in an open object and Remove on the Clusters page; “.” is Actions in both). Everywhere meets every place, and there <b>the narrower place’s key wins while it has the keyboard</b>: ⌘N is Create… everywhere, and a new terminal while a terminal has the keyboard, as today. Giving a command for everywhere a key a narrower place uses asks first: “In a terminal, ⌘N opens a new terminal instead. Use it anyway?”; and giving a place’s command a key an everywhere command uses asks the same way round (“Everywhere else, ⌘ K is the Command palette. Use it anyway?”). Within a place, no key ever does two things; a command left without keys is still in the menus and the palette.',
  '<b>Putting a default back</b> (↺, Restore this section’s defaults) asks the same question when another command in its place holds it now: “⌘ [ is Forward’s now. Give it back to Back, and Forward has no keys?”, Give it back and Cancel. <b>Reset all…</b> puts every default back at once, so nothing clashes, except with a key policy holds: its confirmation names what that leaves without keys.',
  '<b>Keys that can’t be taken</b> are refused, in red, with why: the system’s own (on a Mac ⌘C, ⌘V, ⌘X, ⌘Z, ⌘⇧Z, ⌘Q, ⌘W, ⌘H, ⌥⌘H, ⌘M and ⌘`; on Windows and Linux Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+Y and Alt+F4, and any key with ⊞: “⊞ keys stay the system’s. Press other keys, or Esc.”); a terminal’s keys while it has the keyboard; a built-in key (“J is built in: it moves down a list. Press other keys, or Esc.”); and a key a policy set for another command (“⌘ ⌫ is Delete’s, which your organization set. Press other keys, or Esc.”). While recording, a refused key is only refused: ⌘Q doesn’t quit (“⌘ Q stays the system’s: it quits Lumovi. Press other keys, or Esc.”), and ⌘W, ⌘H and ⌘M don’t close, hide or minimize. Keys the system takes before Lumovi sees them (⌘Tab, ⌘Space, and in a browser the browser’s own, such as ⌘W) do what they always do. A command whose key a policy sets carries the lock and can’t be changed; ↺, Restore and Reset all… skip it.',
  '<b>Yours are shown everywhere</b> a key is: the menus, the palette, the ? sheet and tooltips. On a server they’re kept per person, as the rest of Settings is. A row draws at most two of a command’s keys (a third, kept for an old habit, isn’t drawn); keys a person gives a command replace all of its keys, the undrawn one too, and ↺ brings them back. As Lumovi always had it, on a Mac ⌃ stands in for ⌘ where it isn’t a key of its own, and off a Mac ⊞ stands in for Ctrl; recording takes the keys as pressed, so a person’s ⌃K is a key of its own and asks nothing. On a phone there are no keys: the section isn’t there.',
]

// ─── On a phone ─────────────────────────────────────────────────────────────────────────────

function phones(): string {
  const list = `<div class="phx"><div class="pb"><span class="tap">${icon('arrow-left', 20)}</span><b>Settings</b></div>${SECTIONS.filter(
    ([s]) => s !== 'Updates' && s !== 'Keyboard shortcuts',
  )
    .map(
      ([s, g], i) =>
        `<div class="li">${icon(g, 18)}${s}<small>${['System · Blue', 'This phone’s · 24-hour', 'JetBrains Mono · 12 px', 'Last picked'][i]}</small><span class="chev">${icon('chevron-right', 18)}</span></div>`,
    )
    .join(
      '',
    )}<p class="note3">Kept for you on this server: every device you sign in from shows them. Keyboard shortcuts are changed from a computer.</p></div>`
  const section = `<div class="phx"><div class="pb"><span class="tap">${icon('arrow-left', 20)}</span><b>Appearance</b></div><div class="pin">
    <div class="set" style="border-top:0"><div class="k"><b>Theme</b></div><div class="v">${seg(['System', 'Light', 'Dark'], 0)}<span class="line">System follows this phone: ${NOW} now.</span></div></div>
    <div class="set"><div class="k"><b>Accent</b></div><div class="v">${swatches(16)}</div></div>
    <div class="set"><div class="k"><b>Density</b></div><div class="v">${seg(['Comfortable', 'Compact'], 0)}<span class="line">On a phone, rows stay large enough for a finger.</span></div></div>
    <div class="set"><div class="k"><b>Text size</b></div><div class="v"><span class="stepper"><span style="min-width:44px;height:44px">${icon('minus', 16)}</span><span class="val" style="height:44px">100%</span><span style="min-width:44px;height:44px">${icon('plus', 16)}</span></span></div></div>
    <p class="phr2">Restore this section’s defaults</p>
  </div></div>`
  return `<section class="blk"><h2>On a phone<i>the server’s Settings: a list of sections, each a page</i></h2><div class="rowx">${list}${section}</div></section>`
}

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type SettingsFrame = 'set-page' | 'set-keys' | 'set-phone'

export const SETTINGS_FRAMES: { id: SettingsFrame; title: string; size: Size }[] = [
  { id: 'set-page', title: 'Settings', size: { width: 1440, height: 3555 } },
  { id: 'set-keys', title: 'Settings: keyboard shortcuts', size: { width: 1440, height: 2025 } },
  { id: 'set-phone', title: 'Settings on a phone', size: { width: 920, height: 950 } },
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function settingsFrameHtml(id: SettingsFrame, scheme: Scheme): string {
  NOW = scheme
  const f = SETTINGS_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${t}</h1><p>${p}</p></header>`
  const body = {
    'set-page': () =>
      `${intro('Settings (LMV-357)', 'Appearance, Time, Terminal, Namespaces and Updates, applied at once; what an organization’s policy sets, said so. Words are drafts for docs.')}${settingsFrame()}${rules(SETTINGS_RULES)}`,
    'set-keys': () =>
      `${intro('Settings: keyboard shortcuts (LMV-358)', 'One frame of the shortcuts editor: rebind, reset one or all, and conflicts flagged before they happen, the keys Lumovi leaves alone included. Words are drafts for docs.')}${shortcutsFrame()}${rules(KEY_RULES)}`,
    'set-phone': phones,
  }[id]()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} ${accentVars(scheme)} }
${CSS}
html, body { width: ${f.size.width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
</style><div class="sheet">${body}</div>`
}
