/**
 * Argo CD's pages as LMV-305 asks for them (LMV-307): frames for Péter's OK before anything is
 * built. Group 1 first, which rides 1.22.0: Sync while an operation runs, in Lumovi's own bar,
 * on the plugin's tab, and on Lumovi's list. Words are drafts for docs.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
  command,
  escape,
  ltab,
  only,
  phoneFrame,
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

/** Terminate…, in Lumovi's own bar: the plugin file's action, while a sync runs or waits. */
const TERMINATE = btn('Terminate…', 'secondary', 'square')

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
      <div class="col" style="margin-top:12px"><p class="cap"><b>Running.</b> The time counts. Nothing takes Sync’s place: Edit YAML stays in the menu.</p>${running}<dl class="keys"><dt>1</dt><dd><b>New:</b> a view’s action, busy, with its time (Lumovi’s bar)</dd><dt class="kit">2</dt><dd>The kit’s Header status, as built: health</dd><dt>3</dt><dd><b>New:</b> the Header’s second status, the operation and its time</dd><dt>4</dt><dd><b>New:</b> a Header’s button, busy (no time: the status beside the name has it)</dd><dt class="kit">5</dt><dd>Lumovi’s own bar, as built</dd><dt>6</dt><dd><b>New in Argo CD’s file:</b> Terminate…, its own action in Lumovi’s bar, only while a sync runs or waits (stopping a running sync writes the Application’s status, which only the file’s actions may; a page can’t). Its square icon is new to the file’s list.</dd></dl></div>
      <div class="col" style="margin-top:12px"><p class="cap"><b>It failed.</b> Sync… is back, and the header says how it ended, with Argo CD’s message.</p>${failed}</div>
    </div></section>`
}

/** 2. The operation's state, beside health: every case of the header's second status. */
function statesFrame(): string {
  const c = (cap: string, status: string, buttons: string, why?: string) =>
    `<div class="case"><p class="cap">${cap}</p>${header(status, buttons, why)}</div>`
  const IDLE = ACTS(btn('Sync…', 'primary'))
  const tip = `<div class="case"><p class="cap"><b>The busy button, under a pointer or on focus</b>: what it’s busy with, in Lumovi’s words</p><div style="position:relative;height:66px"><span class="abar">${busy('Syncing', '1m 05s')}${PIN}${MORE}</span><span class="tip3" style="top:36px;left:0">Syncing for 1m 05s. Sync can be pressed again once it’s done.</span></div></div>`
  return `<section class="blk"><h2>The operation’s state, beside health<i>the header’s second status: the first case that holds</i></h2><div class="cases">
    ${c('<b>1. Running</b>: its phase and how long; the line under is Argo CD’s message', `${pill('progressing', 'Progressing')}${opPill('progressing', 'Syncing', '1m 05s')}`, busy('Syncing'), `Sync running: ${WAITING}`)}
    ${c('<b>1. Running for 10 minutes or more</b>: amber, and the line under says it may be stuck', `${pill('progressing', 'Progressing')}${opPill('warning', 'Syncing', '14m 20s')}`, busy('Syncing'), `<em>May be stuck:</em> still ${WAITING}, after 14 minutes.`)}
    ${c('<b>1. Terminating</b>: busy until it ends', `${pill('progressing', 'Progressing')}${opPill('progressing', 'Terminating', '12s')}`, busy('Terminating'), 'Sync terminating: operation is terminating')}
    ${c('<b>1. Asked for, not started yet</b>: no time until Argo CD starts it', `${pill('healthy', 'Healthy')}${opPill('progressing', 'Syncing')}`, busy('Syncing'), 'Waiting for Argo CD to start the sync.')}
    ${c('<b>1. Not started a minute after Lumovi first saw it</b>: amber, and the line says why it may wait', `${pill('healthy', 'Healthy')}${opPill('warning', 'Syncing')}`, busy('Syncing'), '<em>Not started:</em> Argo CD hasn’t picked up the sync in a minute. Its application controller may not be running.')}
    ${c('<b>2. The last sync failed</b>: red until the next sync, its message under', `${pill('healthy', 'Healthy')}${pill('critical', 'Sync failed')}`, IDLE, escape(FAILED))}
    ${c('<b>2. The last sync couldn’t run</b> (Argo CD’s Error)', `${pill('healthy', 'Healthy')}${pill('critical', 'Sync error')}`, IDLE, 'ComparisonError: failed to load target state: rpc error: code = Unknown desc = Manifest generation error (cached)')}
    ${c('<b>2. The last sync was terminated</b>: grey, not red; Argo CD’s message under it', `${pill('healthy', 'Healthy')}${pill('neutral', 'Sync stopped')}`, IDLE, 'Operation terminated')}
    ${c('<b>3. Nothing running, the last sync fine</b>: the sync status, Synced', `${pill('healthy', 'Healthy')}${pill('healthy', 'Synced')}`, IDLE)}
    ${c('<b>3. Out of sync</b> (and Unknown, in grey, where Argo CD can’t tell)', `${pill('healthy', 'Healthy')}${pill('warning', 'Out of sync')}`, IDLE)}
    ${tip}
  </div></section>`
}

/** Lumovi's own dialog for a file's action that asks first: its words, the command, Cancel and its name. */
const actionDialog = (said: string, patch: string) =>
  `<div class="kdlg"><div class="dh"><span class="g" style="background:var(--surface-3);color:var(--text-2)">${icon('square', 18)}</span><div><h3>Terminate storefront?</h3><div class="sub"><span>Application argocd/storefront · <b>production-eu</b></span><span class="prodm">Production</span></div></div></div><div class="db"><div class="part send"><p class="said">${said}</p>${command(`kubectl patch application storefront -n argocd --type merge -p '${patch}' --context production-eu`)}</div></div><div class="df"><span class="btn ghost sm">Cancel</span><span class="btn primary sm">Terminate</span></div></div>`

/** 2b. Terminate…: the file's action, in Lumovi's own dialog, for a running sync and one not started. */
function terminateFrame(): string {
  const running = actionDialog(
    'Argo CD stops the sync where it is. What it has applied stays applied, and nothing after it runs.',
    '{"status":{"operationState":{"phase":"Terminating"}}}',
  )
  const waiting = actionDialog(
    'Argo CD hasn’t started this sync yet. Terminating withdraws it, and it never runs.',
    '{"operation":null}',
  )
  return `<section class="blk"><h2>Terminate…<i>Argo CD’s file’s own action, in Lumovi’s bar, with Lumovi’s own dialog</i></h2><div class="dlgs"><div class="col"><p class="cap"><b>A sync that runs</b> (phase Running): Argo CD stops it where it is. This is the patch its own Terminate makes.</p>${running}</div><div class="col"><p class="cap"><b>A sync not started yet</b>: the request is withdrawn, and Argo CD never runs it. Argo CD has no withdraw of its own; this is the file’s.</p>${waiting}</div></div><p class="cap" style="max-width:1232px">Two actions in the file under one name, each with its own condition, so one shows at a time: phase Running; or asked for and not started. The words in the dialog are the file’s. <b>New in Lumovi:</b> a file’s action that has a condition goes in one step: Lumovi sends the patch with the resourceVersion of the Application it judged the condition on (Lumovi may; the file may not), so if the sync started or ended in between, the cluster refuses it and nothing changes. The dialog then says “Argo CD’s application changed since. Look again.” <b>No subresource</b> on either action: Argo CD’s Application has no status subresource (its CRD in 2.13 and 3.1, as app-2 read it), so its status is written on the object itself, as Argo CD’s own Terminate writes it.</p></section>`
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
  '<b>Never busy for nothing.</b> It’s busy as long as the Application holds the request, as Argo CD runs it whenever its controller picks it up. Not started a minute after Lumovi first saw it, the status turns amber and the line says Argo CD hasn’t picked it up. Terminate… withdraws it.',
  '<b>Terminate…</b> is Argo CD’s file’s own action, in Lumovi’s bar beside the busy Sync and in a row’s menu, only while a sync runs (phase Running) or waits (asked for, not started): two actions under one name, one condition each. Running, it sets the phase to Terminating, as Argo CD’s own Terminate does; that writes the Application’s status, which only a file’s action may, never a page. Waiting, it withdraws the request (<code>operation</code> removed). It asks first, in Lumovi’s own dialog, and goes with the resourceVersion of the Application Lumovi judged its condition on, so a sync that started or ended in between refuses it. Argo CD ends a terminated sync Failed, “Operation terminated”: the tab’s status says Sync stopped, in grey; “Operation termination had errors” (Error) is Sync error, in red. A new permission line in Argo CD’s file, for Péter’s yes.',
  '<b>The time</b> counts every second from when Argo CD started the operation (<code>operationState.startedAt</code>, once its phase is Running), as Lumovi says a duration: 42s, 1m 05s, 12m 30s, 1h 02m. Its digits are of one width, so it doesn’t jiggle. The plugin says when it started; Lumovi counts, by the cluster’s clock where this machine’s differs (as the API server’s answers date them). A start that still looks ahead is 0s, and the count never goes back. “May be stuck” is judged by the same count.',
  '<b>A busy button</b> looks like a secondary one, whatever it was: never filled, as there’s nothing to press. Its text is quieter and it has no hover. It can’t be pressed, but the keyboard reaches it, and a screen reader hears its state in words (“Sync, busy: syncing, 1 minute 5 seconds”), not the glyphs. Its tooltip says the same to a pointer. Its word has no “…”, which in Lumovi means a button asks first.',
  '<b>Once, in a row.</b> The time is said once a row: beside the name in the header’s second status, so the tab’s busy button has none; in Lumovi’s bar and a row’s menu, where no status says it, the button has it. Two would be two clocks.',
  '<b>The header’s second status</b> says the operation, beside health. (1) While one runs: Syncing or Terminating, and how long; at 10 minutes, amber, and the line under starts “May be stuck:” with what it waits on. (2) If the last one failed: Sync failed, or Sync error, in red, with Argo CD’s message under it, until the next sync; if it was terminated, Sync stopped, in grey. (3) Otherwise the sync status: Synced, Out of sync, or Unknown.',
  '<b>Where Sync shows</b>, it’s busy in all of them at once: Lumovi’s bar on the Application’s page (above every tab), the tab’s header, and the row’s menu on Lumovi’s list of Applications. When the sync ends, each is Sync… again.',
  '<b>New in the kit</b>, each a new property of a kit part, so each is declared, comes in at <code>PLUGIN_SINCE</code> next, is checked by the door and is on docs’ kit page, as Card’s about was: the busy state, for a Header’s button and a view’s action (LMV-305 §5); and, beyond §5, a Header’s second status. The rest is the kit’s Header and Lumovi’s own bar, menu and list, as built.',
  '<b>On a phone</b> neither Sync nor Terminate… is offered, as no file’s action is there, and the header’s two statuses say what’s happening. Lumovi’s line for what a phone doesn’t do leaves a busy button out, so while a sync runs there’s no such line.',
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

export type ArgoFrame = 'argo-sync' | 'argo-sync-phone'

export const ARGO_FRAMES: { id: ArgoFrame; title: string; size: Size }[] = [
  { id: 'argo-sync', title: 'Argo CD: while a sync runs', size: { width: 1440, height: 2400 } },
  { id: 'argo-sync-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
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
  }[id]()
  return sheet(scheme, f.size.width, body)
}
