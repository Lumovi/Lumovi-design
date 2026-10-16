/**
 * Helm's install and upgrade options, and a diff before rollback (LMV-353, part of LMV-177). Drawn
 * from main's ActionDialog, DeployDialog and RollbackReleaseDialog, with what this ticket adds:
 * Wait, Undo it if it fails (Helm 4's --rollback-on-failure, Helm 3's --atomic) and Timeout, off
 * by default; and, on rollback, what changes: its values by key only, and its manifest's diff with
 * Secrets' data masked as the YAML tab masks it. Built on app's proposal for PR A; words are
 * drafts for docs.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape, only } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'

const CONTEXT = 'production-eu'
const MASK = '••••••••'

const CSS = `
.sheet { display: flex; flex-direction: column; gap: 44px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-2); }
.row { display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.col { display: flex; width: 600px; min-width: 0; flex-direction: column; gap: 8px; }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 32px; max-width: 1376px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.rules code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.mono { font-family: 'JetBrains Mono', monospace; }

/* Lumovi's ActionDialog, as main draws it. */
.ad { display: flex; width: 600px; flex-direction: column; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 16px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.ad header { display: flex; align-items: flex-start; gap: 12px; padding: 20px 20px 4px; }
.ad .g { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.ad .g svg.i { width: 18px; height: 18px; }
.ad .t { min-width: 0; flex: 1; }
.ad h3 { margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.ad .sub { display: flex; align-items: center; gap: 6px; margin: 2px 0 0; font-size: 12px; line-height: 16px; color: var(--text-3); }
.ad .sub b { font-weight: 500; color: var(--text-2); }
.prodm { padding: 1px 6px; border-radius: 4px; background: color-mix(in srgb, var(--critical) 10%, transparent); font-size: 10.5px; line-height: 15px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--critical-text); }
.ad .body { display: flex; flex-direction: column; gap: 16px; padding: 16px 20px 20px; }
.ad .lbl { display: flex; align-items: center; gap: 8px; margin: 0 0 4px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.ad .lbl .end { margin-left: auto; font-weight: 400; color: var(--text-3); }
.ad .hint { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.ad .field { display: flex; height: 32px; align-items: center; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); }
.ad .field.ph { color: var(--text-3); }
.ad .field.bad { border-color: var(--critical); box-shadow: 0 0 0 3px color-mix(in srgb, var(--critical) 15%, transparent); }
.ad .editor { height: 120px; overflow: hidden; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 19px; color: var(--text-1); white-space: pre; }
.ad .editor .k { color: var(--accent-strong); }
.ad .picker { display: flex; height: 40px; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--line); border-radius: 10px; font-size: 13px; color: var(--text-2); }
.ad .picker b { font-weight: 500; color: var(--text-1); }
.ad .cmd { position: relative; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); }
.ad .cmd p { margin: 0 0 4px; font-size: 10.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
.ad .cmd code { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.6; color: var(--text-2); white-space: pre-wrap; overflow-wrap: anywhere; }
.ad .cmd code i { font-style: normal; color: var(--accent-strong); }
.ad .err { display: flex; gap: 10px; padding: 12px 20px; border-top: 1px solid var(--line); }
.ad .err > div { display: flex; gap: 10px; flex: 1; padding: 10px 12px; border: 1px solid color-mix(in srgb, var(--critical) 25%, transparent); border-radius: 8px; background: color-mix(in srgb, var(--critical) 8%, transparent); font-size: 13px; line-height: 1.6; color: var(--critical-text); }
.ad .err svg.i { flex: none; margin-top: 3px; }
.ad .err b { display: block; font-weight: 600; }
.ad .err .said { display: block; margin-top: 2px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; opacity: 0.9; }
.ad footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface); }
.ad footer .btn.primary { min-width: 80px; }
.ad footer .btn.busy { opacity: 0.5; }
.ad .flux { display: flex; gap: 8px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--warn) 10%, transparent); font-size: 13px; line-height: 1.6; color: var(--text-2); }
.ad .now { margin: 0; font-size: 12px; line-height: 18px; color: var(--text-3); }
.ad .now .tn { font-variant-numeric: tabular-nums; }

/* The options: a checkbox, its words and Helm's flag; a line under each. */
.opts { display: flex; flex-direction: column; gap: 10px; }
.opt { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 2px 10px; align-items: start; }
.opt .cb { display: inline-grid; width: 16px; height: 16px; margin-top: 2px; place-items: center; border: 1.5px solid var(--line-strong); border-radius: 4px; background: var(--surface); color: #fff; }
.opt .cb.on { border-color: var(--accent); background: var(--accent); }
.opt .cb.lock { opacity: 0.5; }
.opt .w { font-size: 13px; line-height: 20px; color: var(--text-1); }
.opt .w code, .tmo code { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); }
.opt.lock .w { color: var(--text-2); }
.opt p, .tmo p { grid-column: 2; margin: 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.tmo { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 4px 10px; }
.tmo .line { grid-column: 2; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-1); }
.tmo .field { width: auto; min-width: 64px; font-family: 'Inter', sans-serif; font-size: 13px; }
.tmo .bad-l { grid-column: 2; margin: 0; font-size: 12px; color: var(--critical-text); }

/* While it waits, under the diff. */
.waitl { display: flex; align-items: flex-start; gap: 8px; margin: 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.waitl svg.i { flex: none; margin-top: 1px; color: var(--text-3); }
.waitl small { display: block; font-size: 12px; color: var(--text-3); }
.spin { display: inline-block; }

/* The review step's head, as main's. */
.revh { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-2); }
.revh .btn { height: 28px; padding: 0 8px; font-size: 12px; }
.plus { font-weight: 500; color: var(--good-text); font-variant-numeric: tabular-nums; }
.minus { font-weight: 500; color: var(--critical-text); font-variant-numeric: tabular-nums; }

/* Rollback: the revisions, as main's. */
.revs { display: flex; flex-direction: column; gap: 8px; }
.rev { display: flex; gap: 12px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; }
.rev.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent-soft) 60%, transparent); }
.rev .rd { width: 14px; height: 14px; flex: none; margin-top: 3px; border: 1.5px solid var(--line-strong); border-radius: 50%; background: var(--surface); }
.rev.on .rd { border: 4px solid var(--accent); }
.rev b { font-size: 13px; font-weight: 600; }
.rev .m { margin-left: 8px; font-size: 12px; color: var(--text-3); }
.rev small { display: block; margin-top: 2px; font-size: 12px; color: var(--text-2); }

/* What it changes: values by key, then the manifest's diff. */
.keys { overflow: hidden; border: 1px solid var(--line); border-radius: 8px; }
.keys .k { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 10px; padding: 8px 12px; font-size: 12.5px; line-height: 20px; }
.keys .k + .k { border-top: 1px solid var(--line); }
.keys .kw { color: var(--text-3); }
.keys .kk { display: flex; min-width: 0; flex-wrap: wrap; gap: 4px 6px; }
.keys .kk code { padding: 0 6px; border-radius: 5px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); overflow-wrap: anywhere; }
.dbox { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; }
.dbar { display: flex; align-items: center; gap: 8px; padding: 6px 8px 6px 12px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-2); }
.dbar .end { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.dbar .btn { height: 26px; padding: 0 8px; font-size: 12px; }
.dbar .btn svg.i { width: 14px; height: 14px; }
.dbar .lk { display: inline-flex; align-items: center; gap: 6px; color: var(--text-3); }
.diff { margin: 0; padding: 10px 0; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; }
.diff > div { padding: 0 20px; white-space: pre; color: var(--text-2); }
.diff .a { background: color-mix(in srgb, var(--good) 10%, transparent); color: var(--good-text); }
.diff .r { background: color-mix(in srgb, var(--critical) 10%, transparent); color: var(--critical-text); }
.diff .gap { margin: 4px 0; padding: 2px 20px; background: color-mix(in srgb, var(--surface-3) 60%, transparent); font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text-3); }
.diff .sg { display: inline-block; width: 12px; margin-right: 12px; color: var(--text-3); }
.diff .mk { padding: 0 3px; border-radius: 3px; background: color-mix(in srgb, var(--surface-3) 80%, transparent); }
.hid { display: flex; gap: 10px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; line-height: 1.6; color: var(--text-2); }
.hid svg.i { flex: none; margin-top: 3px; color: var(--text-3); }

/* What's new on a frame, outlined. */
.xm { position: relative; display: block; border-radius: 10px; outline: 1.5px dashed var(--accent); outline-offset: 4px; }

/* On a phone: the dialog is a sheet. */
.phw { position: relative; display: flex; width: 390px; height: 844px; flex-direction: column; justify-content: flex-end; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--app-bg); }
.phw .dim { position: absolute; inset: 0; background: rgb(0 0 0 / 0.3); }
.phw .ad { position: relative; width: 100%; max-height: calc(100% - 24px); border-bottom: 0; border-radius: 16px 16px 0 0; }
.phw .grab { display: flex; justify-content: center; padding: 8px 0 0; }
.phw .grab i { width: 36px; height: 5px; border-radius: 3px; background: var(--line-strong); }
.phw .ad header { padding: 8px 4px 4px 16px; }
.phw .ad .x { display: grid; flex: none; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phw .ad .body { min-height: 0; flex: 1; overflow: hidden; padding: 16px; }
.phw .ad footer { justify-content: space-between; padding: 12px 16px 28px; }
.phw .ad footer .btn { height: 44px; padding: 0 16px; font-size: 15px; }
.phw .ad footer .btn.ghost { margin-left: -16px; }
.phw .ad footer .btn.primary { min-width: 120px; }
.phw .opt { grid-template-columns: 20px minmax(0, 1fr); min-height: 44px; }
.phw .opt .cb { width: 20px; height: 20px; }
.phw .opt .w { font-size: 15px; line-height: 22px; }
.phw .tmo { grid-template-columns: 20px minmax(0, 1fr); }
.phw .tmo .line { font-size: 15px; }
.phw .tmo .field { height: 44px; min-width: 72px; font-size: 15px; }
.phw .diff > div { padding: 0 16px 0 calc(16px + 24px + var(--lead, 0ch)); text-indent: calc(-24px - var(--lead, 0ch)); white-space: pre-wrap; overflow-wrap: anywhere; }
.phw .diff .gap { padding: 2px 16px; text-indent: 0; }
.phw .rev { padding: 12px; }
.phw .dbar { padding: 4px 4px 4px 12px; }
.phw .dbar .lk { display: none; }
.dbar > span:first-child { white-space: nowrap; }
.phw .dbar .btn { height: 44px; padding: 0 12px; font-size: 14px; }
`

const cb = (on: boolean, lock = false) =>
  `<span class="cb${on ? ' on' : ''}${lock ? ' lock' : ''}">${on ? icon('check', 12, 3) : ''}</span>`

/** The dialog's head, as ActionDialog draws it: its icon, title, and what and where. */
const dhead = (glyph: IconName, title: string, subject: string, phone = false) =>
  `<header><span class="g">${icon(glyph, 18)}</span><div class="t"><h3>${title}</h3><p class="sub"><span>${subject} · <b>${CONTEXT}</b></span><span class="prodm">Production</span></p></div>${phone ? `<span class="x">${icon('x', 20)}</span>` : ''}</header>`

/** The equivalent command, what this ticket adds to it in the accent. */
const cmd = (text: string) => `<div class="cmd"><p>Equivalent command</p><code>${text}</code></div>`

const foot = (confirm: string, busy = false) =>
  `<footer><span class="btn ghost">Cancel</span><span class="btn primary${busy ? ' busy' : ''}">${busy ? icon('loader-circle', 14) : ''}${confirm}</span></footer>`

// ─── 1. Install and upgrade: Wait, Atomic, Timeout ─────────────────────────────────────────

interface Opts {
  wait?: boolean
  atomic?: boolean
  timeout?: string
  bad?: boolean
  install?: boolean
}

const OPT_WORDS = {
  wait: [
    'Wait until it’s ready',
    '--wait',
    'Helm waits until what it made is ready, and fails if the timeout runs out first.',
  ],
  waitHeld: 'On, as undoing a failure has to wait to see it.',
  undoUp: [
    'Undo it if it fails',
    '--rollback-on-failure',
    'If it fails, or isn’t ready in time, Helm rolls it back to revision 7.',
  ],
  undoIn: [
    'Undo it if it fails',
    '--rollback-on-failure',
    'If it fails, or isn’t ready in time, Helm uninstalls it.',
  ],
} as const

/** The three options, under the values. */
function options(o: Opts, phone = false): string {
  const atomic = o.install ? OPT_WORDS.undoIn : OPT_WORDS.undoUp
  const wait = OPT_WORDS.wait
  const waitOn = o.wait || o.atomic
  const t = o.timeout
  return `<div><p class="lbl">Options</p><div class="opts">
    <div class="opt${o.atomic ? ' lock' : ''}">${cb(!!waitOn, !!o.atomic)}<span class="w">${wait[0]}${phone ? '' : `<code>${wait[1]}</code>`}</span><p>${o.atomic ? OPT_WORDS.waitHeld : wait[2]}</p></div>
    <div class="opt">${cb(!!o.atomic)}<span class="w">${atomic[0]}${phone ? '' : `<code>${atomic[1]}</code>`}</span><p>${atomic[2]}</p></div>
    <div class="tmo"><span></span><span class="line">Timeout <span class="field${t ? '' : ' ph'}${o.bad ? ' bad' : ''}">${t ?? '5 minutes, Helm’s default'}</span>${t ? 'minutes' : ''}${phone ? '' : '<code>--timeout</code>'}</span>${o.bad ? '<p class="bad-l">From 1 to 60 minutes.</p>' : ''}<p>How long Helm gives each step, hooks included, and the wait, before it calls it failed.</p></div>
  </div></div>`
}

const VALUES = `<span class="k">image</span>:
  <span class="k">tag</span>: 2.4.3
<span class="k">replicaCount</span>: 3
<span class="k">resources</span>:
  <span class="k">limits</span>:
    <span class="k">memory</span>: 512Mi`

function upgradeDialog(o: Opts): string {
  const flags = [
    ...(o.wait && !o.atomic ? ['--wait'] : []),
    ...(o.atomic ? ['--rollback-on-failure'] : []),
    ...(o.timeout && !o.bad ? ['--timeout', `${o.timeout}m0s`] : []),
  ]
  const added = flags.length ? ` <i>${flags.join(' ')}</i>` : ''
  return `<div class="ad">${dhead('circle-arrow-up', 'Upgrade payments-api', 'Helm release · payments')}<div class="body">
    <div class="picker">${icon('package', 16)}<span>Chart <b>payments-api 2.4.3</b> · as stored with the release</span></div>
    <div><p class="lbl">Values</p><p class="hint">Everything set here; the chart’s defaults fill in the rest.</p><div class="editor">${VALUES}</div></div>
    <div class="xm">${options(o)}</div>
    ${cmd(`helm upgrade payments-api ./payments-api-2.4.3 --values values.yaml${added} --namespace payments --kube-context ${CONTEXT}`)}
  </div>${foot('Review')}</div>`
}

function installOptions(): string {
  return `<div class="ad">${dhead('package-plus', 'Install a chart', 'Helm')}<div class="body">
    <div class="xm">${options({ install: true, atomic: true })}</div>
    ${cmd(`helm install orders oci://ghcr.io/acme/charts/orders --version 1.2.0 --values values.yaml <i>--rollback-on-failure</i> --namespace shop --kube-context ${CONTEXT}`)}
  </div>${foot('Review')}</div>`
}

/** The review step, Upgrade pressed with Atomic and 10m: it waits, then how a failure ends. */
function reviewDialog(stage: 'waiting' | 'rolled-back'): string {
  const lines = `<div class="dbox"><pre class="diff"><div class="gap"><span class="sg">⋯</span>41 unchanged lines</div><div class="r"><span class="sg">−</span>        image: ghcr.io/acme/payments-api:2.4.2</div><div class="a"><span class="sg">+</span>        image: ghcr.io/acme/payments-api:2.4.3</div><div class="gap"><span class="sg">⋯</span>18 unchanged lines</div></pre></div>`
  const waiting = `<p class="waitl">${icon('loader-circle', 14)}<span>Upgrading, then waiting until it’s ready: up to 10 minutes, 1m 12s so far.<small>Closing this doesn’t stop it. The release’s page says how it ended.</small></span></p>`
  const err = `<div class="err"><div>${icon('circle-alert', 16)}<p style="margin:0"><b>It wasn’t ready within 10 minutes, so Helm rolled it back to revision 7.</b><span class="said">UPGRADE FAILED: release payments-api failed, and has been rolled back due to rollback-on-failure being set: context deadline exceeded</span></p></div></div>`
  return `<div class="ad">${dhead('circle-arrow-up', 'Upgrade payments-api', 'Helm release · payments')}<div class="body">
    <div class="revh"><span class="btn ghost">${icon('arrow-left', 14)}Back to editing</span><span>The cluster accepts it · <span class="plus">+1</span> <span class="minus">−1</span> lines of manifest</span></div>
    ${lines}
    ${stage === 'waiting' ? `<div class="xm">${waiting}</div>` : ''}
    ${cmd(`helm upgrade payments-api ./payments-api-2.4.3 --values values.yaml <i>--rollback-on-failure --timeout 10m0s</i> --namespace payments --kube-context ${CONTEXT}`)}
  </div>${stage === 'rolled-back' ? `<div class="xm" style="outline-offset:-4px">${err}</div>` : ''}${foot('Upgrade', stage === 'waiting')}</div>`
}

function optionsFrame(): string {
  return `<section class="blk"><h2>Install and upgrade<i>three options under the values, off by default; each with a line on what it does</i></h2>
    <div class="row"><div class="col"><p class="cap"><b>As it opens</b>: all three off, Timeout blank (Helm’s default, said in it).</p>${upgradeDialog({})}</div>
    <div class="col"><p class="cap"><b>Undo it if it fails</b>, with 10 minutes: Wait is held on, its line saying why, and the command follows.</p>${upgradeDialog({ atomic: true, timeout: '10' })}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>On Install a chart</b>, Undo it if it fails says what it does there: Helm uninstalls it.</p>${installOptions()}</div>
    <div class="col"><p class="cap"><b>A Timeout out of range</b>: said under it, and Review waits for 1 to 60.</p><div class="ad" style="width:600px"><div class="body">${options({ timeout: '90', bad: true })}</div></div></div></div></section>
    <section class="blk"><h2>While it waits, and how it ends<i>the review step, Upgrade pressed with Undo it if it fails and 10 minutes</i></h2>
    <div class="row"><div class="col"><p class="cap"><b>Waiting</b>: Upgrade is busy, and a line says what it waits for, how long it may, and that closing doesn’t stop it.</p>${reviewDialog('waiting')}</div>
    <div class="col"><p class="cap"><b>Not ready in time</b>: Lumovi says what happened, first, then Helm’s own words.</p>${reviewDialog('rolled-back')}</div></div></section>`
}

const OPT_RULES = [
  '<b>Three options, under the values</b>, in a group headed Options, on Install a chart and Upgrade alike: <b>Wait until it’s ready</b> (<code>--wait</code>), <b>Undo it if it fails</b> (Helm 4’s <code>--rollback-on-failure</code>, Helm 3’s <code>--atomic</code>) and <b>Timeout</b>. Each says in a line what it does, with Helm’s flag beside it in quiet mono, so someone who knows Helm finds the one they know.',
  '<b>Off by default, every time</b>: both boxes clear and Timeout blank, its placeholder “5 minutes, Helm’s default”. Nothing is remembered between dialogs. The equivalent command gains only what’s set, after <code>--values</code>.',
  '<b>Undo it if it fails waits</b>, as Helm’s flag implies <code>--wait</code>: ticking it ticks Wait and holds it, dimmed, its line saying why (“On, as undoing a failure has to wait to see it.”), and the command says <code>--rollback-on-failure</code> alone. Its own line says what undoing is there: on an upgrade, the revision it goes back to (“rolls it back to revision 7”); on an install, that Helm uninstalls it.',
  '<b>Timeout</b> is a number of minutes, 1 to 60; blank is Helm’s default. Out of range is said under it in red (“From 1 to 60 minutes.”) and Review waits. The command writes it as Helm does, <code>--timeout 10m0s</code>. It applies with or without Wait, as Helm’s does: hooks have it too.',
  '<b>While it waits</b>, after Upgrade (or Install) is pressed with Wait: the button is busy, as ActionDialog’s are, and a line under the diff says what it waits for, how long it may (“up to 10 minutes, 1m 12s so far”), and that <b>closing the dialog doesn’t stop it</b>: the release’s page and its History say how it ended. (Helm runs in Lumovi’s backend as its own process, which nothing in the page cancels. Quitting Lumovi on the desktop ends it, as it ends Lumovi’s own processes: so quitting while one runs asks first, “payments-api is still upgrading. Quitting stops Helm, and can leave the release pending.”, with Quit anyway and Keep it open.)',
  '<b>How it ends.</b> Ready: the dialog closes and Lumovi’s toast says “Upgraded payments-api”, as today. Failed and undone: the error, where ActionDialog puts it, leads with Lumovi’s words (“It wasn’t ready within 10 minutes, so Helm rolled it back to revision 7.”; on an install, “… so Helm uninstalled it.”), then Helm’s own, in mono. Failed without it: Helm’s words alone, as today.',
]

// ─── 2. Rollback: what changes ─────────────────────────────────────────────────────────────

const REVS: [number, string, string, string, string][] = [
  [7, 'superseded', '2d', 'payments-api-2.4.2, app 2.4.2', 'Upgrade complete'],
  [6, 'superseded', '9d', 'payments-api-2.4.0, app 2.4.0', 'Upgrade complete'],
  [5, 'superseded', '23d', 'payments-api-2.3.1, app 2.3.1', 'Rollback to 3'],
]

const revisions = (on: number) =>
  `<div class="revs" role="radiogroup">${REVS.map(
    ([n, st, ago, chart, why]) =>
      `<div class="rev${n === on ? ' on' : ''}"><span class="rd"></span><span><b>Revision ${n}</b><span class="m">${st} · ${ago} ago</span><small>Chart ${chart} · ${why}</small></span></div>`,
  ).join('')}</div>`

/** The values' keys that differ, by what happens to them going back: never their values. */
const KEYS: [string, string[]][] = [
  ['Changed', ['image.tag', 'resources.limits.memory', 'database.password']],
  ['Removed', ['metrics.enabled']],
]
const KEY_COUNT = KEYS.reduce((n, [, keys]) => n + keys.length, 0)

const keyList = () =>
  `<div><p class="lbl">Values</p><div class="keys">${KEYS.map(([what, keys]) => `<div class="k"><span class="kw">${what}</span><span class="kk">${keys.map((k) => `<code>${k}</code>`).join('')}</span></div>`).join('')}</div></div>`

type DLine = ['a' | 'r' | 's' | 'gap', string]

/** The manifest's diff from revision 8 to 6: the Deployment, and the Secret its chart makes. */
const MANIFEST = (revealed: boolean): DLine[] => {
  const v = (text: string) => (revealed ? text : `<span class="mk">${MASK}</span>`)
  return [
    ['gap', '12 unchanged lines'],
    ['s', '# Source: payments-api/templates/secret.yaml'],
    ['s', 'apiVersion: v1'],
    ['s', 'kind: Secret'],
    ['s', 'metadata:'],
    ['s', '  name: payments-api-db'],
    ['s', 'data:'],
    ['r', `  password: ${v('c2VjcmV0LTI=')}`],
    ['a', `  password: ${v('c2VjcmV0LTE=')}`],
    ['gap', '31 unchanged lines'],
    ['s', '      containers:'],
    ['s', '        - name: api'],
    ['r', '          image: ghcr.io/acme/payments-api:2.4.2'],
    ['a', '          image: ghcr.io/acme/payments-api:2.4.0'],
    ['s', '          resources:'],
    ['s', '            limits:'],
    ['r', '              memory: 512Mi'],
    ['a', '              memory: 384Mi'],
    ['gap', '9 unchanged lines'],
    ['r', '          - name: METRICS_ENABLED'],
    ['r', '            value: "true"'],
    ['gap', '14 unchanged lines'],
  ]
}

const diffLines = (lines: DLine[]) =>
  `<pre class="diff">${lines
    .map(([t, text]) =>
      t === 'gap'
        ? `<div class="gap"><span class="sg">⋯</span>${text}</div>`
        : `<div class="${t === 's' ? '' : t}" style="--lead:${text.length - text.trimStart().length + 2}ch"><span class="sg">${{ a: '+', r: '−', s: ' ' }[t]}</span>${text.includes('<span') ? text : escape(text)}</div>`,
    )
    .join('')}</pre>`

const manifestBox = (revealed: boolean, phone = false) =>
  `<div><p class="lbl">Manifest</p><div class="dbox"><div class="dbar"><span><span class="plus">+3</span> <span class="minus">−5</span> lines</span><span class="end">${revealed ? '' : `<span class="lk">Secrets’ values hidden</span>`}<span class="btn ghost">${icon(revealed ? 'eye-off' : 'eye', 14)}${revealed ? 'Hide values' : 'Reveal values'}</span></span></div>${diffLines(phone ? MANIFEST(revealed).slice(0, 9) : MANIFEST(revealed))}</div></div>`

function rollbackDialog(state: 'masked' | 'revealed' | 'hidden'): string {
  const what =
    state === 'hidden'
      ? `<div class="hid">${icon('lock', 16)}<span><b style="font-weight:500;color:var(--text-1)">What it changes is hidden</b><br>Its values and manifests can hold Secrets, and your access shows only their keys in payments. Roll back still goes back to all that revision 6 had.</span></div>`
      : `${keyList()}${manifestBox(state === 'revealed')}`
  return `<div class="ad">${dhead('history', 'Roll back payments-api', 'Helm release · payments')}<div class="body">
    ${revisions(6)}
    <p class="now">Running now: revision 8. Going back to 6 changes <span class="tn">${KEY_COUNT}</span> of its values and <span class="tn">8</span> lines of its manifest.</p>
    <div class="xm"><p class="lbl" style="margin-bottom:10px">What changes</p>${what}</div>
    ${cmd(`helm rollback payments-api 6 --namespace payments --kube-context ${CONTEXT}`)}
  </div>${foot('Roll back')}</div>`
}

function rollbackFrame(): string {
  return `<section class="blk"><h2>Roll back<i>what changes, before it does: the values by key, the manifest as a diff, Secrets’ data masked</i></h2>
    <div class="row"><div class="col"><p class="cap"><b>Revision 6 picked</b>, as it opens for someone whose access shows Secrets’ values: masked until asked.</p>${rollbackDialog('masked')}</div>
    <div class="col"><p class="cap"><b>Reveal values pressed</b>: the Secret’s data as it is in each revision; Hide values masks it again.</p>${rollbackDialog('revealed')}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>For someone whose access hides Secrets’ values</b>: nothing of the values or manifests, as the release’s own tabs, and why.</p>${rollbackDialog('hidden')}</div></div></section>`
}

const RB_RULES = [
  '<b>What it changes</b>, between the revision running now and the one picked, under the revisions and the line that counts it, as main’s dialog has it. It follows the pick: another revision, another diff, at once (both are read with the release).',
  '<b>Values</b>, by key only, never their values: a values file often holds passwords, and the key is what a person checks. Each key whole, dotted as Helm’s <code>--set</code> takes it (<code>resources.limits.memory</code>, <code>ingress.hosts[0].host</code>), in mono, grouped by what going back does to it: <b>Changed</b>, <b>Added</b> (only in the revision picked), <b>Removed</b> (only in the one running now); a group with none isn’t drawn. Nothing: “No values change.”',
  '<b>Manifest changes</b>, the same diff as Upgrade’s review step (DiffView: additions green, removals red, the rest folded as “31 unchanged lines”), its counts in the box’s bar. Nothing: “The manifest doesn’t change.”',
  '<b>Secrets’ data masked</b>, as the YAML tab masks it: each value under a Secret’s <code>data</code> and <code>stringData</code>, and its last-applied annotation, reads <code>••••••••</code>, on both sides of a change, so a changed password shows as a changed line with neither value. The diff is worked out on the real text first, so a change is never hidden by the mask. <b>Reveal values</b> in the bar shows them, for someone whose access shows Secrets’ values, and Hide values masks them again; it’s never remembered.',
  '<b>Someone whose access hides Secrets’ values</b> (on a server, below “values”) sees neither the keys nor the diff, as the release’s Values and Manifest tabs are hidden from them today: “What it changes is hidden”, with the reason Lumovi already gives there (“Its values and manifests can hold Secrets, and your access shows only their keys in payments.”), and that Roll back still goes back to everything the revision had. Roll back itself is as their access allows, as today.',
  '<b>On a phone</b> it’s ActionDialog’s sheet: the revisions, then the keys, wrapping, then the diff, each long line wrapped under its own text (as DiffView wraps on a phone), Reveal values a 44 px button (frame 3).',
  '<b>For a later ticket, not this one:</b> the release’s own Manifest tab shows a Secret’s data unmasked to anyone whose access shows Secrets’ values. With this, rollback masks it until asked and the tab doesn’t; the tab should mask it the same way.',
]

// ─── 3. On a phone ──────────────────────────────────────────────────────────────────────────

function phones(): string {
  const up = `<div class="phw"><span class="dim"></span><div class="ad"><div class="grab"><i></i></div>${dhead('circle-arrow-up', 'Upgrade payments-api', 'Helm release · payments', true)}<div class="body">${options({ atomic: true, timeout: '10' }, true)}${cmd(`helm upgrade payments-api ./payments-api-2.4.3 --values values.yaml <i>--rollback-on-failure --timeout 10m0s</i> --namespace payments --kube-context ${CONTEXT}`)}</div><footer><span class="btn ghost">Cancel</span><span class="btn primary">Review</span></footer></div></div>`
  const rb = `<div class="phw"><span class="dim"></span><div class="ad"><div class="grab"><i></i></div>${dhead('history', 'Roll back payments-api', 'Helm release · payments', true)}<div class="body"><div class="rev on"><span class="rd"></span><span><b>Revision 6</b><span class="m">superseded · 9d ago</span><small>Chart payments-api-2.4.0, app 2.4.0 · Upgrade complete</small></span></div><p class="now">Running now: revision 8. Going back to 6 changes 4 of its values and 8 lines of its manifest.</p><p class="lbl">What changes</p>${keyList()}${manifestBox(false, true)}</div><footer><span class="btn ghost">Cancel</span><span class="btn primary">Roll back</span></footer></div></div>`
  return `<section class="blk"><h2>On a phone<i>ActionDialog’s sheet, as every dialog is there</i></h2><div class="row">${up}${rb}</div><p class="cap" style="max-width:820px">Left: Upgrade scrolled to its options, each a 44 px row; Helm’s flags aren’t beside the words there (no room), and are in the command. Right: Roll back scrolled to what changes: revision 6 picked, the keys wrapping, the diff wrapping each long line under its own text, Reveal values a 44 px button.</p></section>`
}

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type HelmFrame = 'helm-options' | 'helm-rollback' | 'helm-phone'

export const HELM_FRAMES: { id: HelmFrame; title: string; size: Size }[] = [
  {
    id: 'helm-options',
    title: 'Helm: wait, atomic and timeout',
    size: { width: 1440, height: 2400 },
  },
  {
    id: 'helm-rollback',
    title: 'Helm: what a rollback changes',
    size: { width: 1440, height: 2620 },
  },
  { id: 'helm-phone', title: 'Helm on a phone', size: { width: 920, height: 1010 } },
]

const sheet = (
  scheme: Scheme,
  width: number,
  body: string,
) => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
${only(PARTS, /^(\* |svg\.i|\.btn)/)}
${CSS}
</style><div class="sheet">${body}</div>`

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function helmFrame(id: HelmFrame, scheme: Scheme): string {
  const f = HELM_FRAMES.find((x) => x.id === id)!
  const body = {
    'helm-options': () =>
      `<header><h1>Helm: wait, atomic and timeout on install and upgrade (LMV-353)</h1><p>Main’s Install a chart and Upgrade dialogs, with three options under the values, off by default, each with a line on what it does; then the review step while Helm waits, and how a failure that rolls back is said. Outlined: what this ticket adds. Words are drafts for docs.</p></header>${optionsFrame()}${rules(OPT_RULES)}`,
    'helm-rollback': () =>
      `<header><h1>Helm: what a rollback changes, before it does (LMV-353)</h1><p>Main’s Roll back dialog says how many lines would change; now it shows them: the values by key, and the manifest’s diff, with Secrets’ data masked as the YAML tab masks it, at the person’s level. Outlined: what this ticket adds. Words are drafts for docs.</p></header>${rollbackFrame()}${rules(RB_RULES)}`,
    'helm-phone': phones,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
