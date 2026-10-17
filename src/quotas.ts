/**
 * Quotas show how full they are (LMV-161), as app-2's plan and the PM's rulings have them: the
 * ResourceQuota and LimitRange lists under Configuration, a quota's Usage card (a meter a resource),
 * a LimitRange's tables, a Namespace's Quotas and Limit ranges, Needs attention, and a Deployment
 * stuck on a quota. Drawn in Lumovi's window from main's lists, panel and Meter. Words are drafts
 * for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, deployments, dock, pill, win } from './windows.ts'

type WLevel = Parameters<typeof pill>[0]

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
.q3 { color: var(--text-3); }
.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

/* A quota's meter: Meter's shape, its level a quota's (blue to 90%, amber to full, red at full). */
.qm { position: relative; height: 6px; width: 100%; border-radius: 999px; background: color-mix(in srgb, var(--f) 20%, transparent); }
.qm i { position: absolute; inset: 0 auto 0 0; border-radius: 999px; background: var(--f); }
.qrow { display: flex; flex-direction: column; gap: 6px; }
.qrow .top { display: flex; align-items: baseline; gap: 8px; font-size: 13px; }
.qrow .top .lab { color: var(--text-2); }
.qrow .top .key { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); }
.qrow .top .val { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; font-size: 12px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.qrow .top .val b { font-weight: 600; color: var(--text-1); }
.qrow .top .val.warn b, .qrow .top .val.warn svg.i { color: var(--warn-text); }
.qrow .top .val.bad b, .qrow .top .val.bad svg.i { color: var(--critical-text); }
.qlist { display: flex; flex-direction: column; gap: 14px; }
/* The list's Fullest cell. */
.fullest { display: flex; min-width: 0; flex-direction: column; gap: 5px; }
.fullest .t { display: flex; min-width: 0; align-items: center; gap: 5px; font-size: 12.5px; white-space: nowrap; }
.fullest .t > svg.i, .fullest .t > b { flex: none; }
.fullest .t .k { min-width: 0; flex: 0 1 auto; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-2); text-overflow: ellipsis; }
.fullest .t b { font-weight: 600; font-variant-numeric: tabular-nums; }
.fullest .t.warn b, .fullest .t.warn svg.i { color: var(--warn-text); }
.fullest .t.bad b, .fullest .t.bad svg.i { color: var(--critical-text); }
.tr b.nm { font-weight: 500; }

/* Panels' sections. */
.sec2 { padding: 14px 20px 16px; border-top: 1px solid var(--line); }
.sec2 > h4 { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sec2 > h4 small { margin-left: auto; font-size: 12px; font-weight: 400; letter-spacing: 0; text-transform: none; }
.kv2 { display: grid; grid-template-columns: 128px minmax(0, 1fr); gap: 8px 16px; margin: 0; font-size: 13px; }
.kv2 dt { color: var(--text-3); }
.kv2 dd { margin: 0; min-width: 0; }
.kv2 code { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.qcard { padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; }
.qcard + .qcard { margin-top: 10px; }
.qcard .hd2 { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 13px; }
.qcard .hd2 b { font-weight: 500; }
.qcard .hd2 .go { margin-left: auto; color: var(--text-3); }
.qcard .qlist { gap: 10px; }
.empty3 { display: flex; gap: 8px; font-size: 13px; color: var(--text-3); }
.empty3 svg.i { flex: none; margin-top: 2px; }
.lr { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.lr .lh, .lr .lrr { display: grid; grid-template-columns: minmax(64px, 1fr) 60px 60px 88px 80px 72px; gap: 10px; align-items: center; padding: 0 12px; }
.lr .lh { min-height: 32px; padding-top: 6px; padding-bottom: 6px; line-height: 14px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.lr .lrr { min-height: 36px; font-size: 13px; }
.lr .lrr + .lrr { border-top: 1px solid var(--line); }
.lr .lrr .mono { font-size: 12.5px; }
.lr .lrr .q3 { font-size: 12.5px; }
.lrt { margin: 14px 0 8px; font-size: 13px; font-weight: 500; }
.lrt:first-child { margin-top: 0; }
.why2 { display: flex; gap: 8px; margin: 10px 0 0; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--critical) 8%, transparent); font-size: 12.5px; line-height: 18px; color: var(--text-1); }
.why2 svg.i { flex: none; margin-top: 1px; color: var(--critical-text); }
.why2 code { display: block; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 17px; color: var(--text-2); overflow-wrap: anywhere; }
.why2 .lnk { display: inline-block; margin-top: 6px; font-weight: 500; color: var(--accent-strong); }

/* Needs attention, as the Overview has it. */
.nacard { width: 680px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.nacard > h3 { display: flex; align-items: center; margin: 0; padding: 14px 16px 8px; font-size: 13px; font-weight: 600; }
.nacard > h3 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.narow { display: flex; align-items: center; gap: 12px; padding: 8px 16px; }
.narow .pl { width: 160px; flex: none; }
.narow .nw { min-width: 0; }
.narow .nw b { display: block; overflow: hidden; font-size: 13px; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.narow .nw small { display: block; overflow: hidden; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }

/* On a phone. */
.phq { display: flex; width: 390px; height: 844px; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.phq .pb { display: flex; height: 52px; flex: none; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phq .pb b { flex: 1; font-weight: 600; }
.phq .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phq .pin { padding: 16px; }
.phq .pin small { display: block; font-size: 12px; color: var(--text-3); }
.phq .pin h3 { margin: 2px 0 10px; font-size: 17px; line-height: 24px; font-weight: 600; }
.phq .ptabs2 { display: flex; gap: 20px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--text-3); white-space: nowrap; }
.phq .ptabs2 span { padding: 11px 0; }
.phq .ptabs2 .on { color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }
.phq .qrow .top { font-size: 14px; }
.phq .qrow .top .val { font-size: 13px; }
.phq .card2 { padding: 12px 16px; border-bottom: 1px solid var(--line); }
.phq .card2 .t2 { display: flex; align-items: center; gap: 10px; }
.phq .card2 .t2 b { font-size: 15px; font-weight: 500; }
.phq .card2 .t2 i { font-style: normal; font-size: 13px; color: var(--text-3); }
.phq .card2 .t2 .spill { margin-left: auto; }
.phq .card2 .fullest { margin: 8px 0 0; }
`

// ─── Data and parts ─────────────────────────────────────────────────────────────────────────

type Level = 'ok' | 'warn' | 'bad'

const levelOf = (r: number): Level => (r >= 1 ? 'bad' : r >= 0.9 ? 'warn' : 'ok')
const FILL: Record<Level, string> = {
  ok: 'var(--series-1)',
  warn: 'var(--warn)',
  bad: 'var(--critical)',
}
const ICON: Partial<Record<Level, IconName>> = { warn: 'triangle-alert', bad: 'circle-x' }
const STATUS: Record<Level, [WLevel, string]> = {
  ok: ['healthy', 'Within quota'],
  warn: ['warning', 'Nearly full'],
  bad: ['critical', 'Full'],
}

const meter = (r: number) => {
  const l = levelOf(r)
  return `<span class="qm" style="--f:${FILL[l]}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, Math.floor(r * 100 + 1e-9))}" aria-valuetext="${pct(r)}"><i style="width:${Math.min(100, Math.round(r * 100))}%"></i></span>`
}

/** Floored: 99.6% reads 99% under Nearly full, never 100%. */
const pct = (r: number) => `${Math.floor(r * 100 + 1e-9)}%`

/** A resource's line and meter: the % first, as the Node's usage has it, then used of hard. */
function qrow(label: string, key: string, used: string, hard: string, r: number): string {
  const l = levelOf(r)
  const ic = ICON[l] ? icon(ICON[l]!, 13) : ''
  return `<div class="qrow"><div class="top"><span class="lab">${label}</span><span class="key">${key}</span><span class="val ${l}">${ic}<b>${pct(r)}</b> · ${used} of ${hard}</span></div>${meter(r)}</div>`
}

/** The list's Fullest: its fullest resource, its % and meter. */
const fullest = (key: string, r: number) => {
  const l = levelOf(r)
  return `<span class="fullest"><span class="t ${l}">${ICON[l] ? icon(ICON[l]!, 13) : ''}<span class="k">${key}</span><b>${pct(r)}</b></span>${meter(r)}</span>`
}

type Quota = [string, string, string, number, string]

const QUOTAS: Quota[] = [
  ['storage', 'shop', 'persistentvolumeclaims', 1, '41d'],
  ['pods', 'batch', 'pods', 1, '88d'],
  ['compute', 'shop', 'requests.memory', 0.94, '41d'],
  ['compute', 'payments', 'limits.cpu', 0.62, '30d'],
  ['compute', 'monitoring', 'requests.cpu', 0.48, '88d'],
  ['objects', 'shop', 'count/configmaps', 0.36, '41d'],
]

const nav = (on: string) => (html: string) =>
  html.replace(
    /(<div class="n">[^]*?Secrets<\/div>)/,
    `$1<div class="n${on === 'Resource Quotas' ? ' on' : ''}">${icon('gauge', 16)}Resource Quotas</div><div class="n${on === 'Limit Ranges' ? ' on' : ''}">${icon('ruler', 16)}Limit Ranges</div>`,
  )

const qwin = (o: {
  title: string
  glyph: IconName
  page: string
  panel?: { html: string; width: number }
  on?: string
  navOn?: string
  h?: number
}) =>
  nav(o.on ?? '')(
    win({
      w: 1376,
      h: o.h ?? 640,
      cluster: 'production-eu',
      nav: o.navOn ?? '',
      title: o.title,
      glyph: o.glyph,
      page: o.page,
      panel: o.panel,
      dock: dock([]),
      more: true,
    }),
  )

// ─── 1. The lists ───────────────────────────────────────────────────────────────────────────

const QCOLS = '28px minmax(0,1.1fr) minmax(0,1.3fr) 128px 64px'

function quotaList(sel = '', narrow = false): string {
  const cols = narrow ? '28px minmax(0,1fr) minmax(0,1.2fr) 112px' : QCOLS
  const counts = { bad: 2, warn: 1, ok: 3 }
  const rows = QUOTAS.map(([name, ns, key, r, age]) => {
    const [lv, word] = STATUS[levelOf(r)]
    return `<div class="tr${name + ns === sel ? ' sel' : ''}" style="grid-template-columns:${cols}"><span></span><span><b class="nm">${name}</b><small>${ns}</small></span>${fullest(key, r)}<span>${pill(lv, word)}</span>${narrow ? '' : `<span class="r">${age}</span>`}</div>`
  }).join('')
  return `<div class="tbar"><span class="count">6 resource quotas</span><span class="chip" style="--d:var(--critical)"><i></i>Full <b>${counts.bad}</b></span><span class="chip" style="--d:var(--warn)"><i></i>Nearly full <b>${counts.warn}</b></span><span class="chip" style="--d:var(--good)"><i></i>Within quota <b>${counts.ok}</b></span><span class="grow"></span><span class="fld" style="width:220px">${icon('search', 14)}Filter resource quotas</span></div><div class="th" style="grid-template-columns:${cols}"><span></span><span>Name</span><span>Fullest</span><span>Status</span>${narrow ? '' : '<span class="r">Age</span>'}</div>${rows}`
}

const LCOLS = '28px minmax(0,1.2fr) minmax(0,1.4fr) 64px'

function limitList(): string {
  const rows: [string, string, string, string][] = [
    ['defaults', 'shop', 'Container, Pod', '41d'],
    ['defaults', 'payments', 'Container', '30d'],
    ['pvc-size', 'shop', 'PersistentVolumeClaim', '41d'],
    ['defaults', 'batch', 'Container', '88d'],
  ]
  return `<div class="tbar"><span class="count">4 limit ranges</span><span class="grow"></span><span class="fld" style="width:220px">${icon('search', 14)}Filter limit ranges</span></div><div class="th" style="grid-template-columns:${LCOLS}"><span></span><span>Name</span><span>Types</span><span class="r">Age</span></div>${rows
    .map(
      ([n, ns, t, a]) =>
        `<div class="tr" style="grid-template-columns:${LCOLS}"><span></span><span><b class="nm">${n}</b><small>${ns}</small></span><span>${t}</span><span class="r">${a}</span></div>`,
    )
    .join('')}`
}

function listsFrame(): string {
  return `<section class="blk"><h2>The lists<i>two built-in kinds, under Configuration; the fullest quotas first</i></h2>
    <p class="cap"><b>Resource Quotas</b>: each quota’s fullest resource, its meter and %, and its status.</p>${qwin({ title: 'Resource Quotas', glyph: 'gauge', page: quotaList(), on: 'Resource Quotas', h: 760 })}
    <p class="cap" style="margin-top:8px"><b>Limit Ranges</b>: which types each one sets.</p>${qwin({ title: 'Limit Ranges', glyph: 'ruler', page: limitList(), on: 'Limit Ranges', h: 760 })}</section>`
}

const LIST_RULES = [
  '<b>Resource Quotas and Limit Ranges</b> become built-in lists under Configuration, after Secrets, as Lumovi’s other kinds are: search, namespace, columns, CSV, and the panel. Their icons: a gauge and a ruler.',
  '<b>Fullest</b>, on Resource Quotas: the resource nearest its hard limit, as its key (<code>requests.memory</code>), its % and its meter. Where the cell is narrow, the key is cut at its end; the % never is. Status follows it: <b>Within quota</b> under 90%, <b>Nearly full</b> from 90%, <b>Full</b> at 100% (nothing more of it can be made). Sorted worst first, and the chips filter by status.',
  '<b>The % is floored</b>, never rounded up past a level: 99.6% reads 99% under Nearly full, and 89.6% reads 89% under Within quota, so the number, the colour and the word always agree. The meter’s width may round. <b>Used over hard</b> (a quota lowered below what’s there) writes the real %, 125% say, its meter full (its spoken value 100, its text “125%”), and is Full. <b>Not counted yet</b> (a new quota the controller hasn’t counted): “Not counted yet”, no meter and no status colour.',
  '<b>A hard of 0</b> forbids a thing (<code>services.loadbalancers: 0</code>): it reads “Not allowed · 0 of 0”, with no meter and no %, and doesn’t count toward Fullest or the status, so a quota that only forbids is Within quota and never in Needs attention. If one is there anyway (used over 0), it’s Full.',
  '<b>Never by colour alone</b>: the % is always written, beside the meter, and from 90% an icon stands before it (amber ⚠ Nearly full, red ⊗ Full); the status word says it again. A quota’s meter is main’s Meter with the quota’s levels (blue to 90%, amber to full, red at full), as a prop, so it keeps Meter’s role, value and spoken text (“94%”). Main’s usage levels turn amber at 75% for a node; a quota at 75% needs nothing, so its levels are its own.',
  '<b>Limit Ranges’ Types</b>: Container, Pod, PersistentVolumeClaim, as its limits name them.',
]

// ─── 2. A quota, and a LimitRange ───────────────────────────────────────────────────────────

function quotaPanel(): string {
  return `<div class="dph"><span class="ktile">${icon('gauge', 18)}</span><div class="t"><p>ResourceQuota · shop · 41d old</p><h2>compute${icon('copy', 14)}</h2><div class="acts">${pill('warning', 'Nearly full')}<span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span></div></div><span class="ib" style="margin-top:2px">${icon('maximize-2', 16)}</span><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Events</span><span>Audit</span><span>YAML</span></div>
    <div class="sec2" style="border-top:0"><h4>Usage<small>requests.memory is 94% used</small></h4><div class="qlist">
      ${qrow('Memory requests', 'requests.memory', '3.76 Gi', '4 Gi', 0.94)}
      ${qrow('CPU requests', 'requests.cpu', '1.8 cores', '2 cores', 0.9)}
      ${qrow('CPU limits', 'limits.cpu', '3.2 cores', '4 cores', 0.8)}
      ${qrow('Memory limits', 'limits.memory', '6 Gi', '8 Gi', 0.75)}
      ${qrow('Pods', 'pods', '9', '20', 0.45)}
      <div class="qrow"><div class="top"><span class="lab">Load balancers</span><span class="key">services.loadbalancers</span><span class="val">Not allowed · 0 of 0</span></div></div>
    </div></div>
    <div class="sec2"><h4>Applies to</h4><dl class="kv2"><dt>Scopes</dt><dd>NotBestEffort</dd><dt>Scope selector</dt><dd><code>priorityClass In (high, default)</code></dd></dl></div>`
}

function limitPanel(): string {
  const table = (rows: [string, string, string, string, string, string][]) =>
    `<div class="lr"><div class="lh"><span>Resource</span><span>Min</span><span>Max</span><span>Default request</span><span>Default limit</span><span>Limit ÷ request</span></div>${rows
      .map(
        (r) =>
          `<div class="lrr"><span>${r[0]}</span>${r
            .slice(1)
            .map((v) => (v ? `<span class="mono">${v}</span>` : '<span class="q3">—</span>'))
            .join('')}</div>`,
      )
      .join('')}</div>`
  return `<div class="dph"><span class="ktile">${icon('ruler', 18)}</span><div class="t"><p>LimitRange · shop · 41d old</p><h2>defaults${icon('copy', 14)}</h2></div><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Events</span><span>YAML</span></div>
    <div class="sec2" style="border-top:0"><h4>Limits</h4>
      <p class="lrt">Container</p>${table([
        ['CPU', '50m', '2', '100m', '500m', '4'],
        ['Memory', '64Mi', '4Gi', '128Mi', '512Mi', ''],
      ])}
      <p class="lrt">Pod</p>${table([
        ['CPU', '', '4', '', '', ''],
        ['Memory', '', '8Gi', '', '', ''],
      ])}
    </div>`
}

function detailFrame(): string {
  return `<section class="blk"><h2>A quota<i>its Usage: a meter a resource, worst first; and what it applies to</i></h2>${qwin({ title: 'Resource Quotas', glyph: 'gauge', page: quotaList('computeshop', true), on: 'Resource Quotas', panel: { html: quotaPanel(), width: 600 }, h: 600 })}</section>
  <section class="blk"><h2>A LimitRange<i>a table a type, as its limits name them</i></h2>${qwin({ title: 'Limit Ranges', glyph: 'ruler', page: limitList(), on: 'Limit Ranges', panel: { html: limitPanel(), width: 640 }, h: 560 })}</section>`
}

const DETAIL_RULES = [
  '<b>A quota’s Usage</b>, first on its Overview: one meter for every resource in its <code>hard</code>, worst first, each as a Node’s usage reads: its name in words (“Memory requests”) with its key quiet beside it, then the % in bold, then “3.76 Gi of 4 Gi”, then the meter. Units are the resource’s own: cores (“1 core”, “2 cores”; m under 1), Gi and Mi, and plain counts for pods, services and <code>count/…</code>. A key with no words of its own (<code>requests.nvidia.com/gpu</code>, a storage class’s) is its own label, cut at its end where it must be, whole in its title. The card’s heading names the fullest (“requests.memory is 94% used”).',
  '<b>Applies to</b>: its Scopes and Scope selector, as the API has them; a quota with neither says “Every pod in shop”.',
  '<b>A LimitRange</b>: a table per type it sets (Container, Pod, PersistentVolumeClaim), a row per resource: Min, Max, Default request, Default limit, and Limit ÷ request (maxLimitRequestRatio). What it doesn’t set is a quiet dash.',
]

// ─── 3. A namespace, and where a quota stops a rollout ──────────────────────────────────────

function nsPanel(state: 'shown' | 'refused'): string {
  const quotas =
    state === 'refused'
      ? `<p class="empty3">${icon('lock', 14)}<span>Your access doesn’t list ResourceQuotas in shop.</span></p>`
      : `<div class="qcard"><div class="hd2">${icon('gauge', 15)}<b>compute</b>${pill('warning', 'Nearly full')}<span class="go">${icon('chevron-right', 16)}</span></div><div class="qlist">${qrow('Memory requests', 'requests.memory', '3.76 Gi', '4 Gi', 0.94)}${qrow('CPU requests', 'requests.cpu', '1.8 cores', '2 cores', 0.9)}<span class="q3" style="font-size:12px">and 3 more under 90%</span></div></div><div class="qcard"><div class="hd2">${icon('gauge', 15)}<b>storage</b>${pill('critical', 'Full')}<span class="go">${icon('chevron-right', 16)}</span></div><div class="qlist">${qrow('Volume claims', 'persistentvolumeclaims', '10', '10', 1)}</div></div>`
  const limits =
    state === 'refused'
      ? `<p class="empty3">${icon('info', 14)}<span>No limit ranges in shop.</span></p>`
      : `<dl class="kv2"><dt>defaults</dt><dd>A container’s default request <code>100m</code> CPU, <code>128Mi</code> memory; its default limit <code>500m</code>, <code>512Mi</code></dd><dt>pvc-size</dt><dd>A volume claim from <code>1Gi</code> to <code>100Gi</code></dd></dl>`
  return `<div class="dph"><span class="ktile">${icon('layout-grid', 18)}</span><div class="t"><p>Namespace · 88d old</p><h2>shop${icon('copy', 14)}</h2><div class="acts">${pill('healthy', 'Active')}</div></div><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Events</span><span>YAML</span></div>
    <div class="sec2" style="border-top:0"><h4>Quotas<small>${state === 'refused' ? '' : '2'}</small></h4>${quotas}</div>
    <div class="sec2"><h4>Limit ranges<small>${state === 'refused' ? '' : '2'}</small></h4>${limits}</div>`
}

const NSCOLS = '28px minmax(0,1fr) 120px'
const nsList = () =>
  `<div class="tbar"><span class="count">7 namespaces</span><span class="grow"></span><span class="fld" style="width:200px">${icon('search', 14)}Filter namespaces</span></div><div class="th" style="grid-template-columns:${NSCOLS}"><span></span><span>Name</span><span>Status</span></div>${[
    'batch',
    'data',
    'default',
    'monitoring',
    'payments',
    'shop',
    'staging',
  ]
    .map(
      (n) =>
        `<div class="tr${n === 'shop' ? ' sel' : ''}" style="grid-template-columns:${NSCOLS}"><span></span><span><b class="nm">${n}</b></span><span>${pill('healthy', 'Active')}</span></div>`,
    )
    .join('')}`

function nsFrame(): string {
  return `<section class="blk"><h2>A namespace<i>its Quotas and Limit ranges on its Overview</i></h2>${qwin({ title: 'Namespaces', glyph: 'layout-grid', navOn: 'Namespaces', page: nsList(), panel: { html: nsPanel('shown'), width: 640 }, h: 760 })}
    <p class="cap" style="margin-top:8px"><b>Where access doesn’t list quotas</b>, and there are no limit ranges.</p>${qwin({ title: 'Namespaces', glyph: 'layout-grid', navOn: 'Namespaces', page: nsList(), panel: { html: nsPanel('refused'), width: 640 }, h: 420 })}</section>`
}

function attentionCard(): string {
  const row = (lv: WLevel, word: string, name: string, sub: string) =>
    `<div class="narow"><span class="pl">${pill(lv, word)}</span><span class="nw"><b>${name}</b><small>${sub}</small></span></div>`
  return `<div class="nacard"><h3>Needs attention<small>5</small></h3>
    ${row('critical', 'CrashLoopBackOff', 'checkout-7d9f6c5b8-hqnnn', 'Pod · shop · Back-off restarting failed container')}
    ${row('critical', 'Quota exceeded', 'checkout', 'Deployment · shop · 2 of 3 ready: exceeded quota compute (requests.memory)')}
    ${row('critical', 'Full', 'storage', 'ResourceQuota · shop · persistentvolumeclaims 10 of 10')}
    ${row('critical', 'Full', 'pods', 'ResourceQuota · batch · pods 50 of 50')}
    ${row('warning', 'Nearly full', 'compute', 'ResourceQuota · shop · requests.memory 94% · 3.76 Gi of 4 Gi')}
  </div>`
}

function stuckPanel(): string {
  return `<div class="dph"><span class="ktile">${icon('layers', 18)}</span><div class="t"><p>Deployment · shop · 6d old</p><h2>checkout${icon('copy', 14)}</h2><div class="acts">${pill('critical', 'Quota exceeded')}<span class="btn">${icon('arrow-up-down', 14)}Scale</span><span class="btn">${icon('rotate-cw', 14)}Restart</span></div></div><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Pods</span><span>Logs</span><span>Events</span><span>YAML</span></div>
    <div class="sec2" style="border-top:0"><dl class="kv2"><dt>Replicas</dt><dd>2 ready of 3</dd></dl><div class="why2">${icon('circle-x', 14)}<span>1 of its 3 pods can’t be made: the namespace’s quota <b>compute</b> has no room for its memory request.<code>pods "checkout-7d9f6c5b8-x2kqp" is forbidden: exceeded quota: compute, requested: requests.memory=512Mi, used: requests.memory=3.76Gi, limited: requests.memory=4Gi</code><span class="lnk">Open quota compute</span></span></div></div>`
}

function attentionFrame(): string {
  return `<section class="blk"><h2>Needs attention<i>a quota from 90%, with its fullest resource; and a rollout a quota stopped</i></h2><div class="rowx">${attentionCard()}</div></section>
  <section class="blk"><h2>A Deployment stuck on a quota<i>its status says so, with the API’s own words and the quota to open</i></h2>${qwin(
    {
      title: 'Workloads',
      glyph: 'boxes',
      navOn: 'Workloads',
      page: deployments({ sel: 'checkout', narrow: true }).replace(
        `${pill('warning', 'Degraded')}</span><span class="r" style="text-align:left">1/3`,
        `${pill('critical', 'Quota exceeded')}</span><span class="r" style="text-align:left">2/3`,
      ),
      panel: { html: stuckPanel(), width: 640 },
      h: 520,
    },
  )}</section>`
}

const NS_RULES = [
  '<b>A namespace’s Overview</b> gains <b>Quotas</b> and <b>Limit ranges</b>, after Details. Quotas: a card per quota, its status, its resources from 90% as meters, “and 3 more under 90%” for the rest; it opens the quota. Limit ranges: each one’s defaults in a line (“A container’s default request 100m CPU, 128Mi memory; its default limit 500m, 512Mi”).',
  '<b>Empty and refused</b>, each in its section: “No quotas in shop.”, “No limit ranges in shop.”; where access doesn’t list them, “Your access doesn’t list ResourceQuotas in shop.” with a lock. Neither hides the other.',
  '<b>Needs attention</b> lists a quota from 90%: Nearly full (warning) and Full (critical), sorted with the rest, its line its fullest resource (“requests.memory 94% · 3.76 Gi of 4 Gi”; “persistentvolumeclaims 10 of 10”). A row opens the quota.',
  '<b>A workload a quota stops</b>: where a ReplicaSet’s FailedCreate says “exceeded quota”, its Deployment’s status is <b>Quota exceeded</b> (critical), its reason in Lumovi’s words (“1 of its 3 pods can’t be made: the namespace’s quota compute has no room for its memory request.”, the count from its replicas less the pods there are), then the API’s own message, in mono, and <b>Open quota compute</b>. In Needs attention: “2 of 3 ready: exceeded quota compute (requests.memory)”.',
]

// ─── 4. On a phone ──────────────────────────────────────────────────────────────────────────

function phones(): string {
  const list = `<div class="phq"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Resource Quotas</b><span class="tap">${icon('search', 20)}</span></div>${QUOTAS.slice(
    0,
    4,
  )
    .map(([n, ns, key, r]) => {
      const [lv, word] = STATUS[levelOf(r)]
      return `<div class="card2"><div class="t2"><b>${n}</b><i>${ns}</i>${pill(lv, word)}</div>${fullest(key, r)}</div>`
    })
    .join('')}</div>`
  const detail = `<div class="phq"><div class="pb"><span class="tap">${icon('arrow-left', 20)}</span><b>compute</b></div><div class="pin"><small>ResourceQuota · shop</small><h3>compute</h3>${pill('warning', 'Nearly full')}</div><div class="ptabs2"><span class="on">Overview</span><span>Events</span><span>Audit</span><span>YAML</span></div><div class="pin"><div class="qlist">${qrow('Memory requests', '', '3.76 Gi', '4 Gi', 0.94)}${qrow('CPU requests', '', '1.8 cores', '2 cores', 0.9)}${qrow('CPU limits', '', '3.2 cores', '4 cores', 0.8)}${qrow('Memory limits', '', '6 Gi', '8 Gi', 0.75)}${qrow('Pods', '', '9', '20', 0.45)}</div></div><div class="pin" style="padding-top:0"><dl class="kv2" style="grid-template-columns:1fr"><dt>Scopes</dt><dd>NotBestEffort</dd><dt>Scope selector</dt><dd><code>priorityClass In (high, default)</code></dd></dl></div></div>`
  return `<section class="blk"><h2>On a phone<i>read: the list as cards, a quota’s meters at full width</i></h2><div class="rowx">${list}${detail}</div><p class="cap" style="max-width:820px">Left: each quota a card, its status and its fullest resource. Right: a quota’s Usage, a meter a line, the key left out where the words say it.</p></section>`
}

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type QuotaFrame = 'q-lists' | 'q-detail' | 'q-ns' | 'q-attention' | 'q-phone'

export const QUOTA_FRAMES: { id: QuotaFrame; title: string; size: Size }[] = [
  { id: 'q-lists', title: 'Quotas: the lists', size: { width: 1440, height: 2135 } },
  {
    id: 'q-detail',
    title: 'Quotas: a quota and a LimitRange',
    size: { width: 1440, height: 1680 },
  },
  { id: 'q-ns', title: 'Quotas: a namespace', size: { width: 1440, height: 1600 } },
  {
    id: 'q-attention',
    title: 'Quotas: Needs attention and a stuck rollout',
    size: { width: 1440, height: 1330 },
  },
  { id: 'q-phone', title: 'Quotas on a phone', size: { width: 920, height: 980 } },
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function quotaFrame(id: QuotaFrame, scheme: Scheme): string {
  const f = QUOTA_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${escape(t)}</h1><p>${p}</p></header>`
  const body = {
    'q-lists': () =>
      `${intro('Quotas show how full they are (LMV-161)', 'ResourceQuotas and LimitRanges as Lumovi’s own lists, the fullest quotas first. Words are drafts for docs.')}${listsFrame()}${rules(LIST_RULES)}`,
    'q-detail': () =>
      `${intro('Quotas: a quota and a LimitRange (LMV-161)', 'A quota’s Usage, a meter a resource; a LimitRange’s tables. Words are drafts for docs.')}${detailFrame()}${rules(DETAIL_RULES)}`,
    'q-ns': () =>
      `${intro('Quotas: a namespace (LMV-161)', 'A namespace’s quotas and limit ranges on its Overview, and where access doesn’t list them. Words are drafts for docs.')}${nsFrame()}${rules(NS_RULES.slice(0, 2))}`,
    'q-attention': () =>
      `${intro('Quotas: Needs attention and a stuck rollout (LMV-161)', 'A quota from 90% in Needs attention; a Deployment a quota stopped. Words are drafts for docs.')}${attentionFrame()}${rules(NS_RULES.slice(2))}`,
    'q-phone': phones,
  }[id]()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
${CSS}
html, body { width: ${f.size.width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
</style><div class="sheet">${body}</div>`
}
