/**
 * Argo CD's pages as LMV-305 asks for them (LMV-307): frames for Péter's OK before anything is
 * built. Group 1 first, which rides 1.22.0: Sync while an operation runs, in Lumovi's own bar,
 * on the plugin's tab, and on Lumovi's list. Words are drafts for docs.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
  card,
  cgroup,
  command,
  escape,
  fact,
  head,
  lead,
  ltab,
  only,
  pageHead,
  pgframe,
  phoneFrame,
  PLUGINS_SECTION,
  sideItem,
  table,
  tile,
  whoseStrip,
  type Level,
} from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.sheet { display: flex; flex-direction: column; gap: 44px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-2); }
.grid2 { display: grid; grid-template-columns: repeat(2, 600px); gap: 32px; align-items: start; }
.col { display: flex; min-width: 0; flex-direction: column; gap: 8px; }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 32px; max-width: 1376px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.rules code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }

/* Lumovi's own panel: the object's head, its bar, its tabs. */
.ap { position: relative; width: 600px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ap .hd { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px 12px; }
.ap .kt { display: grid; flex: none; width: 36px; height: 36px; margin-top: 2px; place-items: center; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); color: var(--text-2); }
.ap .who { flex: 1; min-width: 0; }
.ap .who small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.ap .who > b { display: flex; align-items: center; gap: 6px; font-size: 17px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; }
.ap .who > b svg.i { color: var(--text-3); }
.ap .st2 { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: 10px; }
.abar { display: flex; align-items: center; gap: 6px; }
.abar .btn { height: 28px; padding: 0 10px; font-size: 12px; }
.abar .btn svg.i { width: 14px; height: 14px; }
.sq { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); }
.ap .wins { display: flex; gap: 4px; color: var(--text-3); }
.ap .wins span { display: grid; width: 28px; height: 28px; place-items: center; }
.ap .lts { padding: 0 12px 1px; }
.ap .tb { display: flex; flex-direction: column; gap: 4px; padding: 16px; }
.ap .rest { display: flex; height: 56px; margin-top: 12px; align-items: center; justify-content: center; border: 1px dashed var(--line-strong); border-radius: 12px; font-size: 12px; color: var(--text-3); }
.pgframe.flat { border: 0; border-top: 1px solid var(--line); border-radius: 0; box-shadow: none; }

/* The tab's header: the name, two statuses, the buttons; the line under. */
.hdr { display: flex; min-width: 0; align-items: center; gap: 8px; }
.hdr > b { min-width: 0; overflow: hidden; margin-right: 2px; font-size: 17px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; text-overflow: ellipsis; }
.hdr > .acts { display: flex; flex: none; gap: 8px; margin-left: auto; }
.why { margin: 0; font-size: 13px; line-height: 19px; color: var(--text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.why em { font-style: normal; font-weight: 500; color: var(--warn-text); }
.hrow { display: flex; align-items: flex-start; gap: 24px; }
.hrow .why { flex: 1; min-width: 0; }
.hnote { display: flex; gap: 6px; max-width: 50%; margin: 0 0 0 auto; font-size: 12px; line-height: 17px; color: var(--text-2); }
.hnote svg.i { flex: none; margin-top: 1px; color: var(--text-3); }
.dlgs { display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.dlgs > .col { width: 560px; }
.kdlg .said { margin: 0 0 12px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.spill .el { margin-left: 2px; font-weight: 400; opacity: 0.8; font-variant-numeric: tabular-nums; }

/* Busy: where a button was, what it's busy with, and for how long. */
.btn.busy { border: 1px solid var(--line-strong); background: var(--surface-2); color: var(--text-2); box-shadow: none; }
.btn.busy svg.i { color: var(--text-3); }
.btn.busy .el { font-weight: 400; color: var(--text-3); font-variant-numeric: tabular-nums; }
.tip3 { position: absolute; z-index: 3; width: max-content; max-width: 280px; padding: 6px 10px; border-radius: 8px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); box-shadow: var(--shadow-pop); }
.rel { position: relative; display: inline-flex; }

/* What's Lumovi's, what's the kit's, and what's new: a numbered outline, said under it. */
.xm { position: relative; display: inline-flex; border-radius: 9px; outline: 1.5px dashed var(--accent); outline-offset: 3px; }
.xm::after { content: attr(data-n); position: absolute; z-index: 2; top: -12px; left: -12px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); font-size: 10px; font-weight: 600; line-height: 16px; text-align: center; color: #fff; }
.xm.kit { outline-color: var(--text-3); }
.xm.end::after { right: -12px; left: auto; }
.hdr.wide { gap: 16px; }
.xm.kit::after { background: var(--text-3); color: var(--surface); }
.legend { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 12px; color: var(--text-2); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 14px; height: 10px; border-radius: 3px; border: 1.5px dashed var(--accent); }
.legend i.kit { border-color: var(--text-3); }
.keys { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; margin: 4px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }
.keys dt { display: grid; width: 16px; height: 16px; margin-top: 1px; place-items: center; border-radius: 50%; background: var(--accent); font-size: 10px; font-weight: 600; color: #fff; }
.keys dt.kit { background: var(--text-3); color: var(--surface); }
.keys dd { margin: 0; }
.keys b { font-weight: 600; color: var(--text-1); }

/* The header's cases, one under another. */
.cases { display: grid; grid-template-columns: repeat(2, 600px); gap: 12px 32px; }
.case { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.case > .cap { margin-bottom: 6px; }

/* Lumovi's own list of Applications, a row's menu open. */
.lst { position: relative; width: 760px; height: 284px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.lst .lh, .lst .lr { display: grid; grid-template-columns: minmax(0, 1fr) 132px 120px; align-items: center; gap: 12px; padding: 0 16px; }
.lst .lh { height: 36px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.lst .lr { height: 48px; border-bottom: 1px solid var(--line); font-size: 13px; }
.lst .lr.on { background: var(--surface-3); }
.lst .lr .nm { min-width: 0; font-weight: 500; }
.lst .lr .sy { font-size: 13px; color: var(--text-2); }
.lst .menu { top: 92px; left: 150px; width: 248px; }
.lst .menu .item.dim { color: var(--text-3); }
.lst .menu .item .el { margin-left: -4px; color: var(--text-3); font-variant-numeric: tabular-nums; }

/* The Overview: Lumovi's window, the plugin's page in it. */
.pwin { width: 1376px; }
.ov .q { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ov .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ov .q3 { color: var(--text-3); }
.cg .crow.go .cv { color: var(--accent-strong); }
.mkline { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0; font-size: 12px; color: var(--text-2); }

/* A tile's line wraps, between its parts, as the built Tile does (since #189). */
.ov .ktile .s, .ph .ktile .s { height: auto; min-height: 20px; align-items: flex-start; }
.ov .ktile .s .dot, .ph .ktile .s .dot { margin-top: 5px; }
.ov .ktile .s > span:last-child, .ph .ktile .s > span:last-child { white-space: normal; line-height: 17px; }
.ktile .s .pt { display: inline-block; }

/* The Applications page: its filter bar, rows that select, Lumovi's own selection bar. */
.lpage { position: relative; }
.fbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.fbar .kfield { width: 280px; }
.fb { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.fb svg.i { color: var(--text-3); }
.fb.on { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: var(--accent-soft); color: var(--accent-strong); }
.fb.on svg.i { color: var(--accent-strong); }
.fb .v { font-weight: 400; }
.fcount { margin-left: auto; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.fclear { font-size: 13px; font-weight: 500; color: var(--accent-strong); }
.cb { display: inline-grid; width: 16px; height: 16px; place-items: center; border: 1.5px solid var(--line-strong); border-radius: 4px; background: var(--surface); color: #fff; }
.cb.on { border-color: var(--accent); background: var(--accent); }
.cb.some { border-color: var(--accent); background: var(--accent); }
.t .tr.sel { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.selbar { position: absolute; bottom: 24px; left: 50%; z-index: 4; display: flex; align-items: center; gap: 4px; padding: 6px 6px 6px 14px; transform: translateX(-50%); border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); white-space: nowrap; }
.selbar b { margin-right: 8px; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
.selbar .btn { height: 28px; padding: 0 10px; font-size: 12px; }
.selbar .sep { width: 1px; height: 20px; margin: 0 4px; background: var(--line); }
.selbar .x { display: grid; width: 28px; height: 28px; place-items: center; color: var(--text-3); }
.fmenu { position: absolute; z-index: 5; width: 240px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.fmenu .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.fmenu .mi.hl { background: var(--surface-3); }
.fmenu .mi small { margin-left: auto; font-size: 12px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.objs { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.objs .o { display: flex; height: 36px; align-items: center; gap: 10px; padding: 0 12px; font-size: 13px; }
.objs .o + .o { border-top: 1px solid var(--line); }
.objs .o small { font-size: 12px; color: var(--text-3); }
.objs .o .st { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-2); }
.objs .o .st.bad { color: var(--critical-text); }
.objs .o .st svg.i { flex: none; }
.objs .o.out { color: var(--text-3); }
.left { display: flex; gap: 6px; margin: 10px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }
.left svg.i { flex: none; margin-top: 1px; color: var(--text-3); }

/* On a phone. */
.ph .tbp { display: flex; flex-direction: column; gap: 12px; padding: 16px; }
.ph .tbp > b { font-size: 17px; line-height: 24px; font-weight: 600; }
.ph .pills { display: flex; flex-wrap: wrap; gap: 8px; }
.ph .larger { padding: 0; }
.ph .rest { display: flex; height: 120px; align-items: center; justify-content: center; border: 1px dashed var(--line-strong); border-radius: 12px; font-size: 12px; color: var(--text-3); }
`

/** A status pill, with a time where an operation runs. */
const opPill = (level: Level, word: string, time?: string) =>
  pill(level, word).replace('</span>', time ? `<span class="el">${time}</span></span>` : '</span>')

/** A button that's busy: Lumovi's turning mark, the plugin's word, and the time where it's said. */
const busy = (word: string, time?: string) =>
  `<span class="btn busy sm">${icon('loader-circle', 14)}<span>${escape(word)}</span>${time ? `<span class="el">${time}</span>` : ''}</span>`

const btn = (label: string, kind: 'primary' | 'secondary' | 'ghost', glyph?: IconName) =>
  `<span class="btn ${kind} sm">${glyph ? icon(glyph, 14) : ''}${label}</span>`

/** Marks a part with a number, said under the panel: new (in the accent), or the kit's or Lumovi's own. */
const xm = (n: number, body: string, kit = false, end = false) =>
  `<span class="xm${kit ? ' kit' : ''}${end ? ' end' : ''}" data-n="${n}">${body}</span>`

const PIN = `<span class="sq">${icon('pin', 14)}</span>`
const MORE = `<span class="sq">${icon('ellipsis', 14)}</span>`
const SYNC = btn('Sync…', 'secondary', 'refresh-cw')

interface Panel {
  health: [Level, string]
  /** Lumovi's bar, after the health. */
  bar: string
  /** The tab's header and the line under it. */
  header: string
  marked?: boolean
}

const TABS =
  ltab('Overview') +
  ltab('Events') +
  ltab('Audit') +
  ltab('Argo CD', { plug: true, on: true }) +
  ltab('YAML')

/** The Application's page in Lumovi: its head and bar, its tabs, and Argo CD's tab open. */
function panel(p: Panel): string {
  const bar = `<span class="abar">${p.bar}${PIN}${MORE}</span>`
  return `<div class="ap"><div class="hd"><span class="kt">${icon('git-branch', 18)}</span><div class="who"><small>Application · argocd · 12d old</small><b>storefront${icon('copy', 14)}</b><div class="st2">${pill(...p.health)}${p.marked ? xm(5, bar, true, true) : bar}</div></div><span class="wins"><span>${icon('maximize-2', 16)}</span><span>${icon('x', 16)}</span></span></div><nav class="lts">${TABS}</nav><div class="pgframe flat">${whoseStrip('Argo CD', '1.3.0', true)}<div class="tb">${p.header}<div class="rest">Its tiles, Resources and History: the application’s page, frame 4</div></div></div></div>`
}

/** The tab's header: the name, health, the operation, the buttons, and the line under. */
const header = (status: string, buttons: string, why?: string, wide = false, note?: string) =>
  `<div class="hdr${wide ? ' wide' : ''}"><b>storefront</b>${status}<span class="acts">${buttons}</span></div>${note ? `<div class="hrow">${why ? `<p class="why">${why}</p>` : ''}<p class="hnote">${icon('info', 14)}<span>${note}</span></p></div>` : why ? `<p class="why">${why}</p>` : ''}`

/** Terminate sync…, in Lumovi's own bar: the plugin file's action, while a sync runs or waits. */
const TERMINATE = btn('Terminate sync…', 'secondary', 'square')

const ACTS = (sync: string) => `${btn('Delete…', 'ghost')}${btn('Refresh…', 'secondary')}${sync}`

const WAITING = 'waiting for healthy state of apps/Deployment/storefront'
const FAILED =
  'one or more objects failed to apply, reason: Deployment.apps "storefront" is invalid: spec.template.spec.containers[0].image: Required value'

/** 1. Press Sync, and it says Syncing until Argo CD is done. */
function pressFrame(): string {
  const before = panel({
    health: ['healthy', 'Healthy'],
    bar: SYNC,
    header: header(
      `${pill('healthy', 'Healthy')}${pill('warning', 'Out of sync')}`,
      ACTS(btn('Sync…', 'primary')),
    ),
  })
  const pressed = panel({
    health: ['healthy', 'Healthy'],
    bar: `${TERMINATE}${busy('Syncing')}`,
    header: header(
      `${pill('healthy', 'Healthy')}${opPill('progressing', 'Syncing')}`,
      busy('Syncing'),
      'Waiting for Argo CD to start the sync.',
    ),
  })
  const running = panel({
    health: ['progressing', 'Progressing'],
    marked: true,
    bar: `${xm(6, TERMINATE)}${xm(1, busy('Syncing', '1m 05s'))}`,
    header: `<div style="padding-top:6px">${header(
      `${xm(2, pill('progressing', 'Progressing'), true)}${xm(3, opPill('progressing', 'Syncing', '1m 05s'))}`,
      xm(4, busy('Syncing')),
      `Sync running: ${WAITING}`,
      true,
    )}</div>`,
  })
  const failed = panel({
    health: ['healthy', 'Healthy'],
    bar: SYNC,
    header: header(
      `${pill('healthy', 'Healthy')}${pill('critical', 'Sync failed')}`,
      ACTS(btn('Sync…', 'primary')),
      escape(FAILED),
    ),
  })
  return `<section class="blk"><h2>Press Sync, and it says Syncing until Argo CD is done<i>Lumovi’s own bar above every tab, and Argo CD’s tab under it</i></h2>
    <div class="legend"><span><i></i>New (LMV-305 §5, and one beyond it)</span><span><i class="kit"></i>The kit’s, or Lumovi’s own, as built</span></div>
    <div class="grid2">
      <div class="col"><p class="cap"><b>Before.</b> One Sync, in two places, both asking first (the sync dialog is frame 5).</p>${before}</div>
      <div class="col"><p class="cap"><b>Sync pressed.</b> Busy at once, before Argo CD has started it, so with no time yet.</p>${pressed}</div>
      <div class="col" style="margin-top:12px"><p class="cap"><b>Running.</b> The time counts. Nothing takes Sync’s place: Edit YAML stays in the menu.</p>${running}<dl class="keys"><dt>1</dt><dd><b>New:</b> a view’s action, busy, with its time (Lumovi’s bar)</dd><dt class="kit">2</dt><dd>The kit’s Header status, as built: health</dd><dt>3</dt><dd><b>New:</b> the Header’s second status, the operation and its time</dd><dt>4</dt><dd><b>New:</b> a Header’s button, busy (no time: the status beside the name has it)</dd><dt class="kit">5</dt><dd>Lumovi’s own bar, as built</dd><dt>6</dt><dd><b>New in Argo CD’s file:</b> Terminate sync…, its own action in Lumovi’s bar, only while a sync runs or waits (stopping a running sync writes the Application’s status, which only the file’s actions may; a page can’t). Its square icon is new to the file’s list.</dd></dl></div>
      <div class="col" style="margin-top:12px"><p class="cap"><b>It failed.</b> Sync… is back, and the header says how it ended, with Argo CD’s message.</p>${failed}</div>
    </div></section>`
}

/** 2. The operation's state, beside health: every case of the header's second status. */
function statesFrame(): string {
  const c = (cap: string, status: string, buttons: string, why?: string) =>
    `<div class="case"><p class="cap">${cap}</p>${header(status, buttons, why)}</div>`
  const IDLE = ACTS(btn('Sync…', 'primary'))
  const tip = `<div class="case"><p class="cap"><b>The busy button, under a pointer or on focus</b>: what it’s busy with, in Lumovi’s words</p><div style="position:relative;height:66px"><span class="abar">${busy('Syncing', '1m 05s')}${PIN}${MORE}</span><span class="tip3" style="top:36px;left:0">Syncing for 1m 05s. Sync can be pressed again when it’s done.</span></div></div>`
  return `<section class="blk"><h2>The operation’s state, beside health<i>the header’s second status: the first case that holds</i></h2><div class="cases">
    ${c('<b>1. Running</b>: its phase and how long; the line under is Argo CD’s message', `${pill('progressing', 'Progressing')}${opPill('progressing', 'Syncing', '1m 05s')}`, busy('Syncing'), `Sync running: ${WAITING}`)}
    ${c('<b>1. Running for 10 minutes or more</b>: amber, and the line under says it may be stuck', `${pill('progressing', 'Progressing')}${opPill('warning', 'Syncing', '14m 20s')}`, busy('Syncing'), `<em>May be stuck after 14 minutes:</em> ${WAITING}`)}
    ${c('<b>1. Terminating</b>: busy until it ends', `${pill('progressing', 'Progressing')}${opPill('progressing', 'Terminating', '12s')}`, busy('Terminating'), 'Sync terminating: operation is terminating')}
    ${c('<b>1. Asked for, not started yet</b>: no time until Argo CD starts it', `${pill('healthy', 'Healthy')}${opPill('progressing', 'Syncing')}`, busy('Syncing'), 'Waiting for Argo CD to start the sync.')}
    ${c('<b>1. Not started a minute after Lumovi first saw it</b>: amber, and the line says why it may wait', `${pill('healthy', 'Healthy')}${opPill('warning', 'Syncing')}`, busy('Syncing'), '<em>Not started:</em> Argo CD hasn’t picked up the sync for over a minute. Its application controller may not be running.')}
    ${c('<b>2. The last sync failed</b>: red until the next sync, its message under', `${pill('healthy', 'Healthy')}${pill('critical', 'Sync failed')}`, IDLE, escape(FAILED))}
    ${c('<b>2. The last sync couldn’t run</b> (Argo CD’s Error)', `${pill('healthy', 'Healthy')}${pill('critical', 'Sync error')}`, IDLE, 'ComparisonError: failed to load target state: rpc error: code = Unknown desc = Manifest generation error (cached)')}
    ${c('<b>2. The last sync was terminated</b>: grey, not red; Argo CD’s message under it', `${pill('healthy', 'Healthy')}${pill('neutral', 'Sync terminated')}`, IDLE, 'Operation terminated')}
    ${c('<b>3. Nothing running, the last sync fine</b>: the sync status, Synced', `${pill('healthy', 'Healthy')}${pill('healthy', 'Synced')}`, IDLE)}
    ${c('<b>3. Out of sync</b> (and Unknown, in grey, where Argo CD can’t tell)', `${pill('healthy', 'Healthy')}${pill('warning', 'Out of sync')}`, IDLE)}
    ${tip}
  </div></section>`
}

/** Lumovi's own dialog for a file's action that asks first: its words, the command, Cancel and its name. */
const actionDialog = (said: string, patch: string) =>
  `<div class="kdlg"><div class="dh"><span class="g" style="background:var(--surface-3);color:var(--text-2)">${icon('square', 18)}</span><div><h3>Terminate storefront’s sync?</h3><div class="sub"><span>Application argocd/storefront · <b>production-eu</b></span><span class="prodm">Production</span></div></div></div><div class="db"><div class="part send"><p class="said">${said}</p>${command(`kubectl patch application storefront -n argocd --type merge -p '${patch}' --context production-eu`)}</div></div><div class="df"><span class="btn ghost sm">Cancel</span><span class="btn primary sm">Terminate sync</span></div></div>`

/** 2b. Terminate sync…: the file's action, in Lumovi's own dialog, for a running sync and one not started. */
function terminateFrame(): string {
  const running = actionDialog(
    'Argo CD stops this sync where it is. What it has already applied stays applied, and the rest isn’t applied.',
    '{"status":{"operationState":{"phase":"Terminating"}}}',
  )
  const waiting = actionDialog(
    'Argo CD hasn’t started this sync yet. Terminating it takes the request back, so it never runs.',
    '{"operation":null}',
  )
  return `<section class="blk"><h2>Terminate sync…<i>Argo CD’s file’s own action, in Lumovi’s bar, with Lumovi’s own dialog</i></h2><div class="dlgs"><div class="col"><p class="cap"><b>A sync that runs</b> (phase Running): Argo CD stops it where it is. This is the patch its own Terminate makes.</p>${running}</div><div class="col"><p class="cap"><b>A sync not started yet</b>: the request is withdrawn, and Argo CD never runs it. Argo CD has no withdraw of its own; this is the file’s.</p>${waiting}</div></div><p class="cap" style="max-width:1232px">Two actions in the file under one name, “Terminate sync”, each with its own condition, so one shows at a time: phase Running; or asked for and not started. The words in the dialog are the file’s. <b>New on a file’s action:</b> an optional <code>title</code>, a one-line template filled from the object (“Terminate {{ .metadata.name }}’s sync?”); without one, the title is Lumovi’s own pattern. Lumovi still names the object on the line under it. <b>New in Lumovi:</b> a file’s action that has a condition goes in one step: Lumovi sends the patch with the resourceVersion of the Application it judged the condition on (Lumovi may; the file may not), so if the sync started or ended in between, the cluster refuses it and nothing changes. The dialog then says, in Lumovi’s words for every plugin: “storefront changed while you looked at it, so nothing was changed. Look at it again.” <b>No subresource</b> on either action: Argo CD’s Application has no status subresource (its CRD in 2.13 and 3.1, as app-2 read it), so its status is written on the object itself, as Argo CD’s own Terminate writes it.</p></section>`
}

/** 3. Lumovi's own list of Applications: Sync in a row's menu is busy too. */
function listFrame(): string {
  const row = (name: string, health: [Level, string], sync: string, on = false) =>
    `<div class="lr${on ? ' on' : ''}"><span class="nm">${name}</span><span>${pill(...health)}</span><span class="sy">${sync}</span></div>`
  const menu = `<div class="menu">${xm(1, `<span class="item dim" style="width:238px">${icon('loader-circle', 16)}<span>Syncing</span><span class="el">1m 05s</span></span>`)}<span class="item">${icon('radar', 16)}Refresh</span><span class="item">${icon('tags', 16)}Edit labels…</span><span class="item">${icon('file-code-2', 16)}Edit YAML</span><div class="sep"></div><span class="item danger">${icon('trash-2', 16)}Delete…<span class="keys">⌘⌫</span></span></div>`
  return `<section class="blk"><h2>Lumovi’s own list of Applications<i>a row’s menu, while that row’s application syncs</i></h2><div class="lst"><div class="lh"><span>Name</span><span>Status</span><span>Sync</span></div>${row('checkout', ['healthy', 'Healthy'], 'Synced')}${row('storefront', ['progressing', 'Progressing'], 'OutOfSync', true)}${row('payments', ['healthy', 'Healthy'], 'Synced')}${row('legacy-batch', ['critical', 'Degraded'], 'OutOfSync')}${menu}</div><dl class="keys" style="width:760px"><dt>1</dt><dd><b>New:</b> a view’s action, busy, with its time, in the row’s menu as in the bar. The rest is Lumovi’s list as built: its Status is the health, its Sync the plugin file’s column, as Argo CD writes it.</dd></dl></section>`
}

const RULES = [
  '<b>One Sync, which asks first.</b> Sync in Lumovi’s bar is the plugin file’s own action, and it now asks first, with the tab’s three choices (revision, prune, strategy): its dialog is frame 5. The tab’s Sync… is the same sync. Neither runs at once any more.',
  '<b>Busy, never gone.</b> While an operation runs, Sync stays where it was as a busy button: Lumovi’s turning mark, the plugin’s word for it, and where it’s given, how long. It’s never hidden, and nothing takes its place: Edit YAML stays in the menu.',
  '<b>From the press.</b> Cancelled in the dialog, nothing was sent and nothing is busy. Applied, it’s busy at once, before Argo CD has picked it up (no time yet; the line under says so), and never flashes back to Sync… in between: Lumovi holds the tab’s button busy until the plugin draws again, 10 seconds at most, and the bar’s until the Application says. Refused or failed, it’s Sync… again, with Lumovi’s words for why.',
  '<b>Never busy for nothing.</b> It’s busy as long as the Application holds the request, as Argo CD runs it whenever its controller picks it up. Not started a minute after Lumovi first saw it, the status turns amber and the line says Argo CD hasn’t picked it up. Terminate sync… withdraws it.',
  '<b>Terminate sync…</b> is Argo CD’s file’s own action, in Lumovi’s bar beside the busy Sync and in a row’s menu, only while a sync runs (phase Running) or waits (asked for, not started): two actions under one name, one condition each. Running, it sets the phase to Terminating, as Argo CD’s own Terminate does; that writes the Application’s status, which only a file’s action may, never a page. Waiting, it withdraws the request (<code>operation</code> removed). It asks first, in Lumovi’s own dialog, and goes with the resourceVersion of the Application Lumovi judged its condition on, so a sync that started or ended in between refuses it. Argo CD ends a terminated sync Failed, “Operation terminated”: the tab’s status says Sync terminated, in grey; “Operation termination had errors” (Error) is Sync error, in red. A new permission line in Argo CD’s file, for Péter’s yes.',
  '<b>The time</b> counts every second from when Argo CD started the operation (<code>operationState.startedAt</code>, once its phase is Running), as Lumovi says a duration: 42s, 1m 05s, 12m 30s, 1h 02m. Its digits are of one width, so it doesn’t jiggle. The plugin says when it started; Lumovi counts, by the cluster’s clock where this machine’s differs (as the API server’s answers date them). A start that still looks ahead is 0s, and the count never goes back. “May be stuck” is judged by the same count.',
  '<b>A busy button</b> looks like a secondary one, whatever it was: never filled, as there’s nothing to press. Its text is quieter and it has no hover. It can’t be pressed, but the keyboard reaches it, and a screen reader hears its state in words (“Sync, busy: syncing, 1 minute 5 seconds”), not the glyphs. Its tooltip says the same to a pointer. Its word has no “…”, which in Lumovi means a button asks first.',
  '<b>Once, in a row.</b> The time is said once a row: beside the name in the header’s second status, so the tab’s busy button has none; in Lumovi’s bar and a row’s menu, where no status says it, the button has it. Two would be two clocks.',
  '<b>The header’s second status</b> says the operation, beside health. (1) While one runs: Syncing or Terminating, and how long; at 10 minutes, amber, and the line under starts “May be stuck after N minutes:” (the minutes as counted) before Argo CD’s message. (2) If the last one failed: Sync failed, or Sync error, in red, with Argo CD’s message under it, until the next sync; if it was terminated, Sync terminated, in grey. (3) Otherwise the sync status: Synced, Out of sync, or Unknown.',
  '<b>Where Sync shows</b>, it’s busy in all of them at once: Lumovi’s bar on the Application’s page (above every tab), the tab’s header, and the row’s menu on Lumovi’s list of Applications. When the sync ends, each is Sync… again.',
  '<b>New in the kit</b>, each a new property of a kit part, so each is declared, comes in at <code>PLUGIN_SINCE</code> next, is checked by the door and is on docs’ kit page, as Card’s about was: the busy state, for a Header’s button and a view’s action (LMV-305 §5); and, beyond §5, a Header’s second status. The rest is the kit’s Header and Lumovi’s own bar, menu and list, as built.',
  '<b>On a phone</b> neither Sync nor Terminate sync… is offered, as no file’s action is there, and the header’s two statuses say what’s happening. Lumovi’s line for what a phone doesn’t do leaves a busy button out, so while a sync runs there’s no such line.',
]

/** On a phone: the tab's page, running and failed. */
function phoneSync(): string {
  const b = (name: string) => `<b style="font-weight:500;color:var(--text-2)">${name}</b>`
  const page = (pills: string, why: string, busy = false) =>
    phoneFrame(
      'storefront',
      `<nav class="lts">${TABS}</nav><div class="pgframe flat" style="border-top:0">${whoseStrip('Argo CD', '1.3.0', true)}</div><div class="tbp"><b>storefront</b><div class="pills">${pills}</div><p class="why" style="-webkit-line-clamp:unset">${why}</p>${busy ? '' : `<p class="larger">Open Lumovi on a larger screen to use ${b('Delete')}, ${b('Refresh')} and ${b('Sync')}.</p>`}<div class="rest">Its tiles, Resources and History</div></div>`,
      true,
    )
  return `<section class="blk"><h2>On a phone<i>Sync isn’t offered; the two statuses say what’s happening</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${page(`${pill('progressing', 'Progressing')}${opPill('progressing', 'Syncing', '1m 05s')}`, `Sync running: ${WAITING}`, true)}${page(`${pill('healthy', 'Healthy')}${pill('critical', 'Sync failed')}`, escape(FAILED))}</div><p class="cap" style="max-width:820px">The header on a phone, as the kit draws it there: the name, then its statuses on a line of their own (they wrap), then the line under, whole (a finger has no tooltip), then Lumovi’s line for what a phone doesn’t do, which leaves out a button that’s busy (its status says it): while it syncs, there’s none.</p></section>`
}

// ─── 2. The Overview ────────────────────────────────────────────────────────────────────────

const OV_TABS =
  ltab('Overview', { plug: true, on: true }) +
  ltab('Applications', { plug: true }) +
  ltab('AppProjects', { count: '4' }) +
  ltab('ApplicationSets', { count: '2' })

/** A row of the kit's Table: cells, and whether it opens what it's of. */
const row = (cells: string[], opens = true) => ({ cells, cls: opens ? 'opens' : '' })

const ago = (t: string) => `<span class="r q3">${t}</span>`

/** What needs a look: worst first, each with Argo CD's own one line. */
function needsAttention(n = 6): string {
  const rows: [Level, string, string, [Level, string], string, string][] = [
    [
      'critical',
      'legacy-batch',
      'default',
      ['critical', 'Degraded'],
      'Back-off restarting failed container batch in pod legacy-batch-7d9f6c5b8-x2kqp',
      '2h',
    ],
    [
      'healthy',
      'payments',
      'payments',
      ['critical', 'Sync failed'],
      'one or more objects failed to apply, reason: Deployment.apps "payments-api" is invalid: spec.template.spec.containers[0].image: Required value',
      '14m',
    ],
    [
      'healthy',
      'reports',
      'batch',
      ['critical', 'Sync error'],
      'ComparisonError: failed to load target state: rpc error: code = Unknown desc = Manifest generation error (cached)',
      '3h',
    ],
    [
      'progressing',
      'orders',
      'shop',
      ['warning', 'May be stuck'],
      'waiting for healthy state of apps/Deployment/orders',
      '14m',
    ],
    ['warning', 'search', 'shop', ['warning', 'Missing'], 'Deployment search-api is missing', '1d'],
    [
      'healthy',
      'inventory',
      'shop',
      ['warning', 'Out of sync'],
      '3 of 12 resources differ from the repository',
      '6h',
    ],
  ]
  return card(
    'Needs attention',
    '11',
    table(
      'minmax(0,1.1fr) 132px minmax(0,2.4fr) 56px',
      [head('Application'), head('Why'), head('What Argo CD says'), head('Since', { r: true })],
      [
        ...rows
          .slice(0, n)
          .map(([level, name, project, why, says, since]) =>
            row([
              lead({ level, name, beside: project }),
              `<span>${pill(...why)}</span>`,
              `<span class="q">${escape(says)}</span>`,
              ago(since),
            ]),
          ),
        '<div class="kmore">Show all 11</div>',
      ],
    ),
  )
}

const RUNNING = card(
  'Running now',
  '2',
  table(
    'minmax(0,1fr) 150px 64px minmax(0,1.1fr)',
    [head('Application'), head('Operation'), head('Wave'), head('Waiting on')],
    [
      row([
        lead({ level: 'progressing', name: 'orders', beside: 'shop' }),
        `<span>${opPill('warning', 'Syncing', '14m 20s')}</span>`,
        '<span class="q3">2 of 3</span>',
        '<span class="q mono">Deployment/orders</span>',
      ]),
      row([
        lead({ level: 'healthy', name: 'storefront', beside: 'shop' }),
        `<span>${opPill('progressing', 'Syncing', '1m 05s')}</span>`,
        '<span class="q3">PreSync</span>',
        '<span class="q mono">Job/db-migrate</span>',
      ]),
    ],
  ),
)

const BY_STATE = card(
  'By state',
  '38',
  `<div class="counts one">${cgroup(
    'Health',
    [
      ['Healthy', 33],
      ['Degraded', 3],
      ['Missing', 1],
      ['Progressing', 1],
    ],
    38,
  ).replaceAll('class="crow"', 'class="crow go"')}${cgroup(
    'Sync',
    [
      ['Synced', 31],
      ['Out of sync', 6],
      ['Unknown', 1],
    ],
    38,
  ).replaceAll('class="crow"', 'class="crow go"')}</div>`,
)

function recentSyncs(n = 8): string {
  const rows: [Level, string, string, string, string, string, string][] = [
    ['healthy', 'Succeeded', 'checkout', '4f1c9aa', 'main', 'automated', '3m'],
    ['critical', 'Failed', 'payments', 'b07e2d1', 'v2.4.2', 'anna', '14m'],
    ['healthy', 'Succeeded', 'cart', '4f1c9aa', 'main', 'automated', '22m'],
    ['neutral', 'Terminated', 'catalog', '91ac0f3', 'main', 'peter', '41m'],
    ['healthy', 'Succeeded', 'search', 'e5d2b19', 'v1.9.0', 'automated', '1h'],
    ['critical', 'Error', 'reports', '7c1e0b4', 'main', 'automated', '3h'],
    ['healthy', 'Succeeded', 'storefront', '9b2e771', 'main', 'peter', '5h'],
    ['healthy', 'Succeeded', 'inventory', '2a6f8c0', 'main', 'automated', '6h'],
  ]
  return card(
    'Recent syncs',
    '20',
    table(
      'minmax(0,1fr) 120px minmax(0,1fr) 112px 64px',
      [
        head('Application'),
        head('Result'),
        head('Revision'),
        head('By'),
        head('When', { r: true, sorted: 'down' }),
      ],
      [
        ...rows
          .slice(0, n)
          .map(([level, result, name, sha, ref, by, when]) =>
            row([
              lead({ name }),
              `<span>${pill(level, result)}</span>`,
              `<span class="q"><span class="mono">${sha}</span> <span class="q3">${ref}</span></span>`,
              `<span class="q${by === 'automated' ? ' q3' : ''}">${by === 'automated' ? 'Auto-sync' : by}</span>`,
              ago(when),
            ]),
          ),
        '<div class="kmore">Show all 20</div>',
      ],
    ),
  )
}

const PROJECTS = card(
  'Projects',
  '4',
  table(
    'minmax(0,1fr) 52px 72px 72px 96px',
    [
      head('Project'),
      head('Apps', { r: true }),
      head('Healthy', { r: true }),
      head('Synced', { r: true }),
      head('Need a look', { r: true }),
    ],
    [
      row([
        lead({ level: 'critical', name: 'shop' }),
        '<span class="r">17</span>',
        '<span class="r">14/17</span>',
        '<span class="r">13/17</span>',
        '<span class="r">5</span>',
      ]),
      row([
        lead({ level: 'healthy', name: 'payments' }),
        '<span class="r">8</span>',
        '<span class="r">8/8</span>',
        '<span class="r">7/8</span>',
        '<span class="r">2</span>',
      ]),
      row([
        lead({ level: 'critical', name: 'batch' }),
        '<span class="r">8</span>',
        '<span class="r">7/8</span>',
        '<span class="r">6/8</span>',
        '<span class="r">2</span>',
      ]),
      row([
        lead({ level: 'critical', name: 'default' }),
        '<span class="r">5</span>',
        '<span class="r">4/5</span>',
        '<span class="r">5/5</span>',
        '<span class="r">2</span>',
      ]),
    ],
  ),
)

const WHERE = card(
  'Where they run',
  '',
  `<div class="counts one">${cgroup(
    'Clusters',
    [
      ['in-cluster', 24],
      ['prod-us', 11],
      ['staging', 3],
    ],
    38,
    true,
  ).replaceAll('class="crow"', 'class="crow go"')}${cgroup(
    'Namespaces',
    [
      ['shop', 13],
      ['payments', 6],
      ['batch', 5],
      ['search', 4],
    ],
    38,
    true,
    10,
  ).replaceAll('class="crow"', 'class="crow go"')}</div>`,
)

const APPSETS = card(
  'ApplicationSets',
  '2',
  table(
    'minmax(0,1fr) minmax(0,1fr) 52px 72px 72px',
    [
      head('ApplicationSet'),
      head('Makes them from'),
      head('Apps', { r: true }),
      head('Healthy', { r: true }),
      head('Synced', { r: true }),
    ],
    [
      row([
        lead({ level: 'warning', name: 'shop-services' }),
        '<span class="q">a Git directory each</span>',
        '<span class="r">12</span>',
        '<span class="r">11/12</span>',
        '<span class="r">10/12</span>',
      ]),
      row([
        lead({ level: 'healthy', name: 'regional-payments' }),
        '<span class="q">a cluster each</span>',
        '<span class="r">6</span>',
        '<span class="r">6/6</span>',
        '<span class="r">5/6</span>',
      ]),
    ],
  ),
)

/** A tile's line, in its parts: each held whole, as the built Tile wraps only between them. */
const parts = (line: string) =>
  line
    .split(' · ')
    .map((part) => `<span class="pt">${part}</span>`)
    .join(' · ')

const OV_TILES = () =>
  `${tile('activity', 'Healthy', '33/38', parts('3 degraded · 1 missing · 1 progressing'), { level: 'critical', opens: true })}${tile('git-branch', 'Synced', '31/38', parts('6 out of sync · 1 unknown'), { level: 'warning', opens: true })}${tile('refresh-cw', 'Syncing now', '2', parts('the longest for 14m\u00a020s'), { level: 'warning', opens: true })}${tile('circle-x', 'Last sync failed', '2', parts('payments · reports'), { level: 'critical', opens: true })}`

/** 2. The Overview: what's happening, and what needs me. */
function overviewFrame(): string {
  const page = `<div class="arr-stack ov" style="padding:16px">
    <div class="arr-tiles" style="--n:4">${OV_TILES()}</div>
    ${needsAttention()}
    <div class="pair wider">${RUNNING}${BY_STATE}</div>
    ${recentSyncs()}
    <div class="pair wider">${PROJECTS}${WHERE}</div>
    ${APPSETS}
  </div>`
  return `<section class="blk"><h2>The Overview<i>what’s happening, and what needs me: the plugin’s own page, first of its tabs</i></h2>
    <div class="pwin"><aside class="pside"><h3>Configuration</h3>${sideItem('ConfigMaps', 'file-code-2')}${sideItem('Secrets', 'key-round')}${PLUGINS_SECTION('Argo CD')}</aside><div class="pmain">${pageHead('Argo CD', 'git-merge')}<nav class="lts">${OV_TABS}</nav>${pgframe('Argo CD', '1.3.0', page)}</div></div></section>`
}

const OV_RULES = [
  '<b>Four tiles, what needs me first:</b> Healthy and Synced, each of all the applications, their line under naming the rest; Syncing now, its line the longest one’s time (amber once one may be stuck); Last sync failed, naming them, or how many past two. Each opens the Applications page (frame 3) filtered to those.',
  '<b>A dot is always health:</b> an application’s, as Lumovi’s Lead has it everywhere; a project’s or an ApplicationSet’s is its worst application’s. What’s wrong besides is a status of its own (Needs attention’s Why). The quiet word beside an application’s name is its project.',
  '<b>Needs attention</b> is everything that wants a look, worst first, each once, under the first reason that holds: Degraded, Sync failed, Sync error, May be stuck, Missing, a condition that’s an error, Out of sync. The line is Argo CD’s own, end-cut, whole in the row’s tooltip. Six show, then “Show all”. A row opens the Application, on its Argo CD tab. Nothing needs a look: “All 38 applications are synced and healthy.”',
  '<b>Running now</b> is every operation in progress: its phase and time, as the tab’s second status says them; its wave (“2 of 3”: where the wave of what it waits on stands among the application’s distinct waves, sorted, negative ones first; never the wave’s own number, which can be −1 or 10. Read from <code>status.resources[].syncWave</code>, matched by group, kind, namespace and name, a missing one being wave 0, as Argo CD leaves 0 out; or the hook phase, PreSync or PostSync, while a hook runs; where neither can be told, the phase alone); and what it waits on, read from Argo CD’s message where it has the shape “waiting for healthy state of group/Kind/name” (in any other shape, the message whole, end-cut). It’s empty, and quiet, most of the time: “Nothing is syncing.”',
  '<b>By state</b> breaks health and sync down, each count a row that opens the Applications page filtered to it. <b>Where they run</b> does the same by cluster and namespace (four, then “10 more”).',
  '<b>Recent syncs</b> are the last 20 operations across applications, newest first: how each ended (Succeeded, Failed, Error, Terminated), the revision and branch, who started it (a person, or Auto-sync), and when. Argo CD keeps a finished sync in its history, and a failure only until the application’s next sync, so an older failure isn’t listed. Terminated is a sync that ended Failed, “Operation terminated”, as group 1 has it.',
  '<b>Projects and ApplicationSets</b>, read already and shown now: how many applications each has, how many of them are healthy and synced, and, for a project, how many need a look; worst first. An ApplicationSet says what it makes its applications from. A row opens the object; a project’s dot is its worst application’s health.',
  '<b>New in the kit:</b> a Counts row that opens a destination; a destination that is the plugin’s own page, filtered (the Applications page’s filter bar, frame 3); and a status cell with a running time, as the Header’s second status has. <b>The rest is the kit as built:</b> Tiles, Table (grouped, statuses, rows that open), Card, Pair, Counts, Stack.',
  '<b>States:</b> while the first read runs, the tiles and tables show the kit’s busy state; a failed read, its failed state with Try again; no Applications at all, one empty state for the page: “No applications in this cluster. Argo CD is installed; its applications show here once there are any.”',
]

/** On a phone: tiles two across, the tables as cards. */
function overviewPhone(): string {
  const cardRow = (
    level: Level,
    name: string,
    project: string,
    why: [Level, string],
    says: string,
    since: string,
  ) =>
    `<li><div class="top">${lead({ level, name, beside: project })}</div><dl class="one">${fact('Why', pill(...why))}${fact('What Argo CD says', escape(says))}${fact('Since', since)}</dl></li>`
  const top = phoneFrame(
    'Argo CD',
    `<nav class="lts">${OV_TABS}</nav><div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('Argo CD', '1.3.0', true)}</div><div class="ptiles">${OV_TILES()}</div><div class="sec"><h3>Needs attention<small>11</small></h3><ul class="cards">${cardRow('critical', 'legacy-batch', 'default', ['critical', 'Degraded'], 'Back-off restarting failed container batch in pod legacy-batch-7d9f6c5b8-x2kqp', '2h')}${cardRow('healthy', 'payments', 'payments', ['critical', 'Sync failed'], 'one or more objects failed to apply, reason: Deployment.apps "payments-api" is invalid: spec.template.spec.containers[0].image: Required value', '14m')}</ul></div>`,
  )
  return `<section class="blk"><h2>On a phone<i>the same page, read: tiles two across, each table as cards</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${top}</div><p class="cap" style="max-width:820px">As the kit draws every page on a phone: tiles two across, the chevron always shown on one that opens; each table as cards, every column a fact, a line that’s long whole on its card (a finger has no tooltip). Needs attention goes on with its six cards and “Show all 11”, then each section below as cards, in the same order.</p></section>`
}

// ─── 3. The Applications page ──────────────────────────────────────────────────────────────

const LIST_TABS =
  ltab('Overview', { plug: true }) +
  ltab('Applications', { plug: true, on: true }) +
  ltab('AppProjects', { count: '4' }) +
  ltab('ApplicationSets', { count: '2' })

type AppRow = [
  string, // name
  string, // project
  string, // repository · path
  [Level, string], // health
  [Level, string], // sync
  string, // operation, as a status: '' for a sync that succeeded
  string, // revision: target · synced
  string, // destination: cluster · namespace
  string, // auto-sync
  string, // last sync
]

const APPS: AppRow[] = [
  [
    'legacy-batch',
    'default',
    'acme/deploy · jobs/legacy-batch',
    ['critical', 'Degraded'],
    ['warning', 'Out of sync'],
    '',
    'main · 4f1c9aa',
    'in-cluster · batch',
    'On',
    '2h',
  ],
  [
    'payments',
    'payments',
    'acme/deploy · apps/payments',
    ['healthy', 'Healthy'],
    ['warning', 'Out of sync'],
    pill('critical', 'Failed'),
    'v2.4.2 · b07e2d1',
    'prod-us · payments',
    'Off',
    '14m',
  ],
  [
    'reports',
    'batch',
    'acme/deploy · jobs/reports',
    ['healthy', 'Healthy'],
    ['neutral', 'Unknown'],
    pill('critical', 'Error'),
    'main · 7c1e0b4',
    'in-cluster · batch',
    'On',
    '3h',
  ],
  [
    'orders',
    'shop',
    'acme/deploy · apps/orders',
    ['progressing', 'Progressing'],
    ['warning', 'Out of sync'],
    opPill('warning', 'Syncing', '14m 20s'),
    'main · 6d1f2a9',
    'prod-us · shop',
    'Off',
    '1d',
  ],
  [
    'search',
    'shop',
    'acme/deploy · apps/search',
    ['warning', 'Missing'],
    ['warning', 'Out of sync'],
    '',
    'v1.9.0 · e5d2b19',
    'prod-us · search',
    'On',
    '1h',
  ],
  [
    'inventory',
    'shop',
    'acme/deploy · apps/inventory',
    ['healthy', 'Healthy'],
    ['warning', 'Out of sync'],
    '',
    'main · 2a6f8c0',
    'in-cluster · shop',
    'Off',
    '6h',
  ],
  [
    'storefront',
    'shop',
    'acme/deploy · apps/storefront',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    opPill('progressing', 'Syncing', '1m 05s'),
    'main · 9b2e771',
    'prod-us · shop',
    'On',
    '5h',
  ],
  [
    'catalog',
    'shop',
    'acme/deploy · apps/catalog',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    pill('neutral', 'Terminated'),
    'main · 91ac0f3',
    'in-cluster · shop',
    'Off',
    '41m',
  ],
  [
    'checkout',
    'shop',
    'acme/deploy · apps/checkout',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    '',
    'main · 4f1c9aa',
    'prod-us · shop',
    'On',
    '3m',
  ],
  [
    'cart',
    'shop',
    'acme/deploy · apps/cart',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    '',
    'main · 4f1c9aa',
    'prod-us · shop',
    'On',
    '22m',
  ],
  [
    'ledger',
    'payments',
    'acme/deploy · apps/ledger',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    '',
    'v2.4.1 · 8e3b6d0',
    'prod-us · payments',
    'Off',
    '1d',
  ],
  [
    'billing',
    'payments',
    'acme/deploy · apps/billing',
    ['healthy', 'Healthy'],
    ['healthy', 'Synced'],
    '',
    'v2.4.1 · 8e3b6d0',
    'prod-us · payments',
    'Off',
    '1d',
  ],
]

const CHECK = (on: boolean | 'some') =>
  `<span class="cb${on === 'some' ? ' some' : on ? ' on' : ''}">${on === 'some' ? icon('minus', 12, 3) : on ? icon('check', 12, 3) : ''}</span>`

/** The Applications table: a box to pick each row, then the lead and seven columns. */
function appsTable(
  rows: AppRow[],
  picked: (name: string) => boolean = () => false,
  head0: boolean | 'some' = false,
): string {
  return table(
    '16px minmax(0,1.5fr) 112px 116px 132px minmax(0,1fr) minmax(0,1.1fr) 80px 76px',
    [
      CHECK(head0),
      head('Name'),
      head('Health', { sorted: 'down' }),
      head('Sync'),
      head('Operation'),
      head('Revision'),
      head('Destination'),
      head('Auto-sync'),
      head('Last sync', { r: true }),
    ],
    rows.map(([name, project, repo, health, sync, op, rev, dest, auto, last]) => ({
      cells: [
        CHECK(picked(name)),
        lead({ level: health[0], name, beside: project, under: repo }),
        `<span>${pill(...health)}</span>`,
        `<span>${pill(...sync)}</span>`,
        `<span>${op || '<span class="q3">—</span>'}</span>`,
        `<span class="q mono">${rev}</span>`,
        `<span class="q">${dest}</span>`,
        `<span class="q${auto === 'Off' ? ' q3' : ''}">${auto}</span>`,
        ago(last),
      ],
      cls: `opens${picked(name) ? ' sel' : ''}`,
    })),
  )
}

const fb = (label: string, value = '') =>
  value
    ? `<span class="fb on">${label}: <span class="v">${value}</span>${icon('x', 12)}</span>`
    : `<span class="fb">${label}${icon('chevron-down', 14)}</span>`

const FBAR = (o: { search?: string; set?: [string, string][]; count: string; menu?: string }) =>
  `<div class="fbar" style="position:relative"><span class="kfield${o.search ? '' : ' ph'}">${icon('search', 16)}<span>${o.search ?? 'Name or namespace'}</span></span>${['Health', 'Sync', 'Operation', 'Project'].map((f) => fb(f, o.set?.find(([k]) => k === f)?.[1])).join('')}${fb('More filters')}${o.set?.length ? '<span class="fclear">Clear filters</span>' : ''}<span class="fcount">${o.count}</span>${o.menu ?? ''}</div>`

/** The Applications page in Lumovi's window: its filter bar, its table, and what's under it. */
function listPage(body: string, after = ''): string {
  return `<div class="pwin"><aside class="pside"><h3>Configuration</h3>${sideItem('ConfigMaps', 'file-code-2')}${sideItem('Secrets', 'key-round')}${PLUGINS_SECTION('Argo CD')}</aside><div class="pmain lpage">${pageHead('Argo CD', 'git-merge')}<nav class="lts">${LIST_TABS}</nav>${pgframe('Argo CD', '1.3.0', `<div class="arr-stack ov" style="padding:16px">${body}</div>`)}${after}</div></div>`
}

const HEALTH_MENU = `<div class="fmenu" style="top:40px;left:290px">${[
  ['Healthy', '33', false],
  ['Degraded', '3', false],
  ['Missing', '1', false],
  ['Progressing', '1', false],
  ['Suspended', '0', false],
  ['Unknown', '0', false],
]
  .map(
    ([v, n, on]) =>
      `<span class="mi${v === 'Degraded' ? ' hl' : ''}">${CHECK(on as boolean)}${v}<small>${n}</small></span>`,
  )
  .join('')}</div>`

const PICKED = [
  'payments',
  'reports',
  'search',
  'inventory',
  'storefront',
  'checkout',
  'cart',
  'ledger',
  'billing',
  'legacy-batch',
]

const SELBAR = `<div class="selbar"><b>10 selected</b><span class="btn ghost">${icon('refresh-cw', 14)}Sync…</span><span class="btn ghost">${icon('radar', 14)}Refresh…</span><span class="sep"></span><span class="x">${icon('x', 16)}</span></div>`

/** 3. The page as it opens, a filter being chosen, and ten rows picked. */
function appsPageFrame(): string {
  const whole = listPage(
    `${FBAR({ count: '38 applications', menu: HEALTH_MENU })}${card('Applications', '', appsTable(APPS))}<p class="cap">… and 26 more rows, worst first</p>`,
  )
  const filtered = listPage(
    `${FBAR({ set: [['Operation', 'Failed, Error']], count: '2 of 38' })}${card('Applications', '', appsTable(APPS.filter(([n]) => n === 'payments' || n === 'reports')))}`,
  )
  const picked = listPage(
    `${FBAR({ count: '38 applications' })}${card(
      'Applications',
      '',
      appsTable(APPS, (n) => PICKED.includes(n), 'some'),
    )}<p class="cap">… and 26 more rows</p>`,
    SELBAR,
  )
  return `<section class="blk"><h2>The Applications page<i>the plugin’s own list: search, filters, every column LMV-305 asks for, and rows to pick</i></h2>
    <p class="cap"><b>As it opens</b>, worst first, with the Health filter’s menu open.</p>${whole}
    <p class="cap" style="margin-top:12px"><b>Filtered</b>, as the Overview’s “Last sync failed” opens it.</p>${filtered}
    <p class="cap" style="margin-top:12px"><b>Ten picked:</b> Lumovi’s own selection bar, as its lists have it. No Delete: nothing is deleted in bulk.</p>${picked}</section>`
}

/**
 * Lumovi's own dialog for a file's action on the rows a person ticked: asked once, then each one
 * followed, by the file's own busy state, to how it ended.
 */
function bulkDialog(stage: 'ask' | 'after'): string {
  const objs = PICKED.filter((n) => n !== 'storefront')
  const AFTER: Record<string, string> = {
    ledger: `<span class="st bad">${icon('circle-x', 14)}Changed while you looked at it: not sent</span>`,
    payments: `<span class="st bad">${icon('circle-x', 14)}Failed: one or more objects failed to apply</span>`,
    search: `<span class="st">${icon('loader-circle', 14)}Syncing<span class="q3">1m 52s</span></span>`,
    'legacy-batch': `<span class="st">${icon('loader-circle', 14)}Syncing<span class="q3">2m 10s</span></span>`,
  }
  const row = (name: string) => {
    const app = APPS.find(([n]) => n === name)!
    const st =
      stage === 'ask'
        ? `<span class="st">${icon('circle-check', 14)}<span style="color:var(--good-text)">Accepted</span></span>`
        : (AFTER[name] ??
          `<span class="st">${icon('circle-check', 14)}<span style="color:var(--good-text)">Succeeded</span></span>`)
    return `<div class="o"><span>${name}</span><small>to ${app[7]}</small>${st}</div>`
  }
  const order =
    stage === 'after'
      ? [...objs].sort(
          (a, b) =>
            Number(AFTER[b]?.includes('bad') ?? false) - Number(AFTER[a]?.includes('bad') ?? false),
        )
      : objs
  const head = `<div class="dh"><span class="g" style="background:var(--surface-3);color:var(--text-2)">${icon('refresh-cw', 18)}</span><div><h3>${stage === 'ask' ? 'Sync 9 Applications?' : 'Started 8 of 9 syncs'}</h3><div class="sub"><span>Applications · argocd · <b>production-eu</b></span><span class="prodm">Production</span></div></div></div>`
  const options = `<div class="part opts"><div class="fld"><label>Prune</label><span class="ksw"><i></i></span><p>Delete what is no longer in the repository.</p></div><div class="fld"><label>Strategy</label><span class="kseg"><span>Apply</span><span class="on">Hook</span></span><p>Asked once, for all nine. Each syncs to the revision it tracks, so Revision isn’t asked.</p></div></div>`
  const list = `<div class="part send"><div class="kcap">${stage === 'ask' ? 'The nine it syncs' : 'How each is going'}</div><div class="objs">${order.map(row).join('')}</div>${stage === 'ask' ? `<p class="left">${icon('info', 14)}<span>Left out: storefront, which is syncing already.</span></p>${command(`kubectl patch application ${objs.join(' ')} -n argocd --type merge -p '{"operation":{"sync":{"syncStrategy":{"hook":{}}}}}' --context production-eu`)}<p class="left">${icon('info', 14)}<span>Lumovi also sends each with the version it judged it on, which a command can’t say.</span></p>` : ''}</div>`
  const foot = `<div class="df"><span class="btn ghost sm">${stage === 'ask' ? 'Cancel' : 'Close'}</span><span class="btn primary sm">${stage === 'ask' ? 'Sync 9' : 'Try the 2 again…'}</span></div>`
  return `<div class="kdlg" style="width:600px">${head}<div class="db">${stage === 'ask' ? options : ''}${list}</div>${foot}</div>`
}

function bulkFrame(): string {
  return `<section class="blk"><h2>Sync, several at once<i>Argo CD’s file’s own Sync, which Lumovi applies to the rows you ticked</i></h2>
    <div class="dlgs" style="gap:32px"><div class="col" style="width:600px"><p class="cap"><b>Asked once</b>, in Lumovi’s own dialog: the file’s options for its Sync, the nine it syncs, each to where it deploys, and what is left out.</p>${bulkDialog('ask')}</div><div class="col" style="width:600px"><p class="cap"><b>Then each one followed</b> to how it ended, failures first, until the dialog is closed. Eight started; one changed while you looked at it.</p>${bulkDialog('after')}</div></div></section>`
}

const LIST_RULES = [
  '<b>The plugin’s own Applications page</b>, second of its tabs, standing in for Lumovi’s own list of Applications in Argo CD’s place (new: a plugin’s page may take a kind’s tab there; Lumovi’s own list stays where Lumovi lists every kind). It lists every column LMV-305 asks for, in a Table: the name, its project beside it and its repository and path under it; Health and Sync; Operation (one running, with its time, or how the last ended when it didn’t succeed: Failed, Error, Terminated; empty after a sync that succeeded); the revision it tracks and the one it’s at; the destination, cluster then namespace, said so everywhere; Auto-sync; and when it last synced. Worst first. A row opens the Application, on its Argo CD tab.',
  '<b>Search and filters</b>: a field that matches name and namespace, then Health, Sync, Operation and Project, and More filters for Cluster, Namespace, Auto-sync and Labels. Each filter is a menu of the values there are, with how many have each; values in one filter are either, filters together are all. A filter set shows its values, with × to take it off, and Clear filters takes off all; the count says “2 of 38”. Matching nothing: “No applications match these filters.”, with Clear filters. The Overview’s counts open the page with their filter set.',
  '<b>Picking rows</b>: a box at each row’s start, and one in the headings for every row shown (a dash when some are). Picking any brings up <b>Lumovi’s own selection bar</b>, as its lists have it: how many, Sync…, Refresh…, and × to let go. There is no Delete in bulk.',
  '<b>Sync…, for several, is Lumovi’s.</b> It’s Argo CD’s file’s own Sync, which Lumovi applies to the rows the person ticked. The plugin’s code never picks rows or starts a change to several; it isn’t told of one. It asks once, in Lumovi’s own dialog, titled for what the person asked (“Sync 9 Applications?”): the file’s options, but no Revision, as each syncs to the revision it tracks; the Applications, each to where it deploys; those it leaves out (one syncing already) and why; and one command. The place it names is where the change happens: the Applications, in Argo CD’s namespace, on the connected cluster, with its Production mark, never where they deploy.',
  '<b>Sent, then followed.</b> Lumovi sends them four at a time, as its own bulk changes go, each with the version it judged it on (the command can’t say so, and a line under it does). Then, in the same dialog, each one is followed by the file’s own busy state to how it ended, failures first, until the dialog is closed; “Started 8 of 9 syncs”, not “synced”, as nothing has ended yet. Closed sooner, they go on, and each row’s Operation says how it went. <b>Try again</b> reads each one afresh and judges it again: sent with its new version, or left out with why.',
  '<b>Refresh…, for several</b>, asks Normal or Hard once, in the same dialog, and says what happened to each; a refresh is quick, so there’s nothing to follow after.',
  '<b>On a phone</b> the page is read: the field, and Filters, which opens the filters as a sheet; the rows as cards, a fact a line, as values this long don’t fit a third of a card. Nothing is picked or changed there.',
  '<b>New in the kit:</b> the search and filter bar for a Table; rows that can be ticked, with Lumovi’s own selection bar offering the file’s actions for them; and, on a file’s action, how its work ends (<code>ends</code>: a path on the action’s own object, its values as words and levels, and a path for the message beside them), so Lumovi can say “Failed: one or more objects failed to apply” and read nothing else. <b>The rest is the kit as built</b>, and Lumovi’s own selection bar and bulk dialog, as its lists have them.',
]

/** On a phone: the page read, filters as a sheet, rows as cards. */
function listPhone(): string {
  const cardRow = ([name, project, repo, health, sync, op, rev, dest]: AppRow) =>
    `<li><div class="top">${lead({ level: health[0], name, beside: project, under: repo })}</div><dl class=\"one\">${fact('Health', pill(...health))}${fact('Sync', pill(...sync))}${op ? fact('Operation', op) : ''}${fact('Revision', `<span class="mono">${rev}</span>`)}${fact('Destination', dest)}</dl></li>`
  const page = phoneFrame(
    'Argo CD',
    `<nav class="lts">${LIST_TABS}</nav><div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('Argo CD', '1.3.0', true)}</div><div class="sec" style="display:flex;gap:8px;padding-bottom:0"><span class="kfield ph" style="flex:1;height:44px">${icon('search', 16)}<span>Name or namespace</span></span><span class="fb" style="height:44px">${icon('sliders-horizontal', 16)}Filters</span></div><div class="pcount">38 applications</div><div class="sec" style="padding-top:0"><ul class="cards">${APPS.slice(0, 3).map(cardRow).join('')}</ul></div>`,
  )
  return `<section class="blk"><h2>On a phone<i>read, not changed: filters as a sheet, rows as cards</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${page}</div></section>`
}

export type ArgoFrame =
  | 'argo-sync'
  | 'argo-sync-phone'
  | 'argo-overview'
  | 'argo-overview-phone'
  | 'argo-list'
  | 'argo-list-phone'

export const ARGO_FRAMES: { id: ArgoFrame; title: string; size: Size }[] = [
  { id: 'argo-sync', title: 'Argo CD: while a sync runs', size: { width: 1440, height: 2400 } },
  { id: 'argo-sync-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
  { id: 'argo-overview', title: 'Argo CD: the Overview', size: { width: 1440, height: 2400 } },
  { id: 'argo-overview-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
  { id: 'argo-list', title: 'Argo CD: the Applications page', size: { width: 1440, height: 2400 } },
  { id: 'argo-list-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
]

const sheet = (
  scheme: Scheme,
  width: number,
  body: string,
) => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${width}px; }
${only(PARTS, /^(\* |svg\.i|\.btn|\.menu)/)}
${only(SHELL, /^\.spill/)}
${KIT}
${CSS}
</style><div class="sheet">${body}</div>`

/** One of the frames, in one theme. */
export function argoFrame(id: ArgoFrame, scheme: Scheme): string {
  const f = ARGO_FRAMES.find((x) => x.id === id)!
  const intro =
    '<header><h1>Argo CD’s pages, 1: while a sync runs (LMV-307)</h1><p>Péter: “when I click on sync we should see Syncing instead of Edit YAML”. Sync stays where it was, busy, with how long it has run, in Lumovi’s own bar on the Application’s page, on Argo CD’s tab and in a row’s menu on Lumovi’s list; and the tab’s header says the operation beside health. This group rides 1.22.0; the Overview, the list, the application’s page and the sync dialog follow. Words are drafts for docs.</p></header>'
  const body = {
    'argo-sync': () =>
      `${intro}${pressFrame()}${statesFrame()}${terminateFrame()}${listFrame()}<section class="blk"><h2>The rules</h2><ul class="rules">${RULES.map((r) => `<li>${r}</li>`).join('')}</ul></section>`,
    'argo-sync-phone': phoneSync,
    'argo-overview': () =>
      `<header><h1>Argo CD’s pages, 2: the Overview (LMV-307)</h1><p>Péter: “the overview page must be super informative and useful”. What’s happening, and what needs a look, in the order a person asks: is anything wrong, is anything running, what happened lately, and where. Words are drafts for docs.</p></header>${overviewFrame()}<section class="blk"><h2>The rules</h2><ul class="rules">${OV_RULES.map((r) => `<li>${r}</li>`).join('')}</ul></section>`,
    'argo-overview-phone': overviewPhone,
    'argo-list': () =>
      `<header><h1>Argo CD’s pages, 3: the Applications page (LMV-307)</h1><p>Péter: “bulk actions are required for syncing”. Every Application, searched and filtered by anything LMV-305 lists; several picked, synced or refreshed together after one question; and each sync followed to how it ended. Words are drafts for docs.</p></header>${appsPageFrame()}${bulkFrame()}<section class="blk"><h2>The rules</h2><ul class="rules">${LIST_RULES.map((r) => `<li>${r}</li>`).join('')}</ul></section>`,
    'argo-list-phone': listPhone,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
