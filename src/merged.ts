/**
 * Several clusters in one list (LMV-175), as app-2's plan and the PM's rulings have it: a set picked
 * on the Clusters page ("Several clusters", or a group's "Open together"), opened as a page of its
 * own with Workloads, Pods, Nodes and Events merged, a Cluster column, filters across all, and a
 * strip saying which clusters answered. Actions stay on the object's own cluster and name it; none
 * spans clusters. Words are drafts for docs.
 */
import { CSS as CLUSTERS_CSS, picker, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { CSS as HELM } from './helm.ts'
import { escape, only } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, pill, win } from './windows.ts'

type WLevel = Parameters<typeof pill>[0]

interface Member {
  name: string
  color: number
  prod: boolean
  /** How its read went: answered with a count, still reading, or why not. */
  state: 'ok' | 'reading' | 'timeout' | 'refused' | 'signs-in'
  pods: number
}

const SET: Member[] = [
  { name: 'Payments EU', color: 2, prod: true, state: 'ok', pods: 3214 },
  { name: 'Payments US', color: 5, prod: true, state: 'ok', pods: 2880 },
  { name: 'Payments staging', color: 4, prod: false, state: 'ok', pods: 412 },
  { name: 'Platform tools', color: 7, prod: false, state: 'ok', pods: 5974 },
]

const SHEET = `
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
`

// ─── 1. Picking the set, on the Clusters page ───────────────────────────────────────────────

const PICK_CSS = `
html, body { height: auto !important; overflow: visible !important; }
body { margin: 0; background: var(--app-bg); }
.pickwrap { position: relative; width: 720px; }
.pickwrap .picker { height: 560px; }
.ck { display: inline-grid; width: 18px; height: 18px; flex: none; place-items: center; border: 1.5px solid var(--line-strong); border-radius: 5px; background: var(--surface); color: #fff; }
.ck.on { border-color: var(--accent); background: var(--accent); }
.heading .og { margin-left: auto; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--accent-strong); }
.sbar { position: absolute; bottom: 52px; left: 50%; z-index: 4; display: flex; align-items: center; gap: 10px; padding: 6px 6px 6px 14px; transform: translateX(-50%); border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); font-size: 13px; white-space: nowrap; }
.sbar b { font-weight: 500; font-variant-numeric: tabular-nums; }
.sbar .note { font-size: 12px; color: var(--text-3); }
.sbar .btn { height: 30px; }
.sbar .x { display: grid; width: 28px; height: 28px; place-items: center; color: var(--text-3); }
.row.ticked { --row-bg: color-mix(in srgb, var(--accent) 7%, var(--surface-2)); }
`

/** The Clusters page's picker in "Several clusters": a box on each row, and the bar to open them. */
function pickSeveral(): string {
  let html = picker('signs-in')
  const ticked = ['Payments EU', 'Payments US', 'Payments staging', 'Platform tools']
  // A box before each row's tile, ticked for the set.
  html = html.replace(
    /<div class="row([^"]*)">\s*(<span class="tile[^]*?<span class="name">([^<]+)<\/span>)/g,
    (_m, cls: string, rest: string, name: string) => {
      const on = ticked.includes(name.replace(/&amp;/g, '&'))
      return `<div class="row${cls}${on ? ' ticked' : ''}"><span class="ck${on ? ' on' : ''}">${on ? icon('check', 12, 3) : ''}</span>${rest}`
    },
  )
  // Enter opens the set while picking several.
  html = html.replace(/ to open<\/span>/, ' to open together</span>')
  // Recent isn't offered while picking several: the groups are.
  html = html.replace(
    /<div class="heading">Recent<\/div>[\s\S]*?(?=<div class="heading">Payments)/,
    '',
  )
  // A group's heading offers Open together.
  html = html.replace(
    /(<div class="heading">(Payments|Platform)<span class="n">\d+<\/span>)/g,
    '$1<span class="og">Open together</span>',
  )
  // The bar's Several clusters, on.
  html = html.replace(
    /(<span class="btn ghost sm[^"]*">[^]*?Group by[^]*?<\/span>)/,
    `<span class="btn ghost sm on">${icon('list-checks', 14)}Several clusters</span>$1`,
  )
  const bar = `<div class="sbar"><b>4 clusters</b><span class="note">3 sign in when opened</span><span class="btn primary sm">Open together</span><span class="x">${icon('x', 16)}</span></div>`
  return `<div class="pickwrap">${html}${bar}</div>`
}

const PICK_RULES = [
  '<b>Several clusters</b>, a button in the Clusters page’s bar beside Group by, puts a box on every row: a click or Space ticks it, Enter opens the ticked ones together (not the one under the cursor), and Recent steps aside for the groups. Ticking any brings up the bar: “4 clusters”, how many of them sign in when opened, and <b>Open together</b>. × or Esc leaves it.',
  '<b>A group’s Open together</b>, at the right of its heading, opens its clusters at once, without ticking (Payments’ three; Platform’s two). On a server, the Fleet page’s cards offer the same, over the clusters the person may see.',
  '<b>A cluster that signs in when opened</b> can be in the set; ticking it opens nothing. On the page it’s listed unread, with its Open button, until it’s pressed (frame 3), so picking a set never starts a sign-in. That holds for the set remembered from last time too.',
  '<b>The set is in the page’s address</b>, and the last one is remembered on this computer: the sidebar’s Several clusters opens it again. There’s no lumovi:// link to a set for now.',
]

// ─── The merged page ────────────────────────────────────────────────────────────────────────

const PAGE_CSS = `${WINDOW}
${only(HELM, /^(\.ad|\.prodm)/)}
.row2 { display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.col { display: flex; width: 600px; min-width: 0; flex-direction: column; gap: 8px; }
.prodm { margin-left: 6px; padding: 0 5px; font-size: 10px; line-height: 15px; }
.sw.set { gap: 8px; }
.sw.set .sq { display: flex; gap: 2px; }
.sw.set .sq i { width: 8px; height: 8px; border-radius: 2px; background: var(--c); }
/* The strip: each cluster in the set, how its read went, and a filter by it. */
.strip { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 10px 20px; border-bottom: 1px solid var(--line); font-size: 12.5px; }
.strip .sum { margin-right: 4px; color: var(--text-2); }
.strip .sum b { font-weight: 500; color: var(--text-1); }
.cc { display: inline-flex; height: 28px; align-items: center; gap: 6px; padding: 0 10px 0 8px; border: 1px solid var(--line); border-radius: 8px; font-size: 12.5px; color: var(--text-1); white-space: nowrap; }
.cc i { width: 8px; height: 8px; flex: none; border-radius: 2px; background: var(--c); }
.cc .n { color: var(--text-3); font-variant-numeric: tabular-nums; }
.cc.on { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: var(--accent-soft); }
.cc.bad { border-color: color-mix(in srgb, var(--critical) 35%, transparent); }
.cc.bad .why { color: var(--critical-text); }
.cc.wait .why { color: var(--text-3); }
.cc .act { margin-left: 2px; font-weight: 500; color: var(--accent-strong); }
.cc .spin { color: var(--text-3); }
/* The Cluster cell. */
.clc { display: flex; min-width: 0; align-items: center; gap: 7px; }
.clc i { width: 8px; height: 8px; flex: none; border-radius: 2px; background: var(--c); }
.clc span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tr .q3, .q3 { color: var(--text-3); }
.tr.ticked { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.tr.hov { background: color-mix(in srgb, var(--surface-3) 50%, transparent); }
.ck { display: inline-grid; width: 16px; height: 16px; place-items: center; border: 1.5px solid var(--line-strong); border-radius: 4px; background: var(--surface); color: #fff; }
.ck.on { border-color: var(--accent); background: var(--accent); }
.ck.some { border-color: var(--accent); background: var(--accent); }
.selbar { position: absolute; bottom: 64px; left: 50%; z-index: 4; display: flex; align-items: center; gap: 6px; padding: 6px 6px 6px 14px; transform: translateX(-50%); border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); font-size: 13px; white-space: nowrap; }
.selbar b { margin-right: 6px; font-weight: 500; }
.selbar .btn.off { opacity: 0.45; }
.selbar .why { margin: 0 6px; font-size: 12px; color: var(--text-3); }
.selbar .x { display: grid; width: 28px; height: 28px; place-items: center; color: var(--text-3); }
.pm { position: absolute; z-index: 5; width: 260px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.pm .lbl { display: flex; align-items: center; gap: 6px; padding: 4px 8px 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.pm .lbl b { font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--text-1); }
.pm .lbl i { width: 8px; height: 8px; border-radius: 2px; background: var(--c); }
.pm .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.pm .mi svg.i { color: var(--text-3); }
.pm .mi.hl { background: var(--surface-3); }
.pm .mi.danger, .pm .mi.danger svg.i { color: var(--critical-text); }
.pm hr { height: 1px; margin: 4px; border: 0; background: var(--line); }
.dph .t p b { font-weight: 500; color: var(--text-2); }
.dph .t p i { display: inline-block; width: 8px; height: 8px; margin-right: 5px; border-radius: 2px; background: var(--c); }
.empty2 { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 56px 0; text-align: center; }
.empty2 h3 { margin: 0; font-size: 15px; font-weight: 600; }
.empty2 p { margin: 0; max-width: 440px; font-size: 13px; line-height: 1.55; color: var(--text-2); }
.vtip { display: flex; flex: none; align-items: center; gap: 8px; padding: 8px 20px; border-top: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.fbtn { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; color: var(--text-1); white-space: nowrap; }
.fbtn svg.i { color: var(--text-3); }
`

const sq = (color: number) => `style="--c:var(--series-${color})"`

const clc = (m: Member) =>
  `<span class="clc" ${sq(m.color)}><i></i><span>${escape(m.name)}</span>${m.prod ? '<span class="prodm">Production</span>' : ''}</span>`

const fmt = (n: number) => n.toLocaleString('en-US')

/** One chip per cluster in the set: its count once read, or what's become of its read. */
function strip(set: Member[], on?: string): string {
  const answered = set.filter((m) => m.state === 'ok').length
  const chip = (m: Member) => {
    const head = `<i></i>${escape(m.name)}`
    switch (m.state) {
      case 'ok':
        return `<span class="cc${m.name === on ? ' on' : ''}" ${sq(m.color)}>${head}<span class="n">${fmt(m.pods)}</span></span>`
      case 'reading':
        return `<span class="cc wait" ${sq(m.color)}>${head}<span class="spin">${icon('loader-circle', 13)}</span><span class="why">Reading…</span></span>`
      case 'timeout':
        return `<span class="cc bad" ${sq(m.color)}>${head}<span class="why">didn’t answer in time</span><span class="act">Retry</span></span>`
      case 'refused':
        return `<span class="cc bad" ${sq(m.color)}>${head}<span class="why">your access doesn’t list Pods</span></span>`
      case 'signs-in':
        return `<span class="cc wait" ${sq(m.color)}>${head}<span class="why">Signs in when opened</span><span class="act">Open</span></span>`
    }
  }
  return `<div class="strip"><span class="sum"><b>${answered} of ${set.length}</b> answered</span>${set.map(chip).join('')}</div>`
}

type Pod = [string, string, number, WLevel, string, string, string, string]

const PODS: Pod[] = [
  ['checkout-7d9f6c5b8-hqnnn', 'shop', 0, 'critical', 'CrashLoopBackOff', '0/1', '14', '2h'],
  [
    'payments-api-5d8f7c9b6-x2kqp',
    'payments',
    2,
    'critical',
    'CrashLoopBackOff',
    '0/1',
    '9',
    '41m',
  ],
  ['ledger-sync-28811520-9hd2w', 'payments', 2, 'warning', 'Pending', '0/1', '0', '6m'],
  ['checkout-7d9f6c5b8-pwkd2', 'shop', 1, 'healthy', 'Running', '1/1', '0', '2d'],
  ['checkout-7d9f6c5b8-lnk52', 'shop', 0, 'healthy', 'Running', '1/1', '2', '2d'],
  ['payments-api-5d8f7c9b6-r8vmt', 'payments', 1, 'healthy', 'Running', '1/1', '0', '6d'],
  ['payments-api-6c4b7d9f5-m2zqk', 'payments', 2, 'healthy', 'Running', '1/1', '0', '41m'],
  ['argocd-server-7c9d8f6b5-qq2lt', 'argocd', 3, 'healthy', 'Running', '1/1', '0', '12d'],
  ['grafana-6f7c9b8d4-5wqzt', 'monitoring', 3, 'healthy', 'Running', '3/3', '0', '30d'],
]

/** Platform tools' pods, the cluster pressed in the large frame. */
const PLATFORM: Pod[] = [
  ['argocd-application-controller-0', 'argocd', 3, 'healthy', 'Running', '1/1', '0', '12d'],
  ['argocd-repo-server-6b8d7c9f5-k2xlm', 'argocd', 3, 'healthy', 'Running', '1/1', '0', '12d'],
  ['argocd-server-7c9d8f6b5-qq2lt', 'argocd', 3, 'healthy', 'Running', '1/1', '0', '12d'],
  ['cert-manager-5c7f9d8b6-wq4zn', 'cert-manager', 3, 'healthy', 'Running', '1/1', '0', '41d'],
  ['external-dns-7d6c9b8f4-p8rtv', 'external-dns', 3, 'healthy', 'Running', '1/1', '1', '41d'],
  ['grafana-6f7c9b8d4-5wqzt', 'monitoring', 3, 'healthy', 'Running', '3/3', '0', '30d'],
  ['loki-0', 'monitoring', 3, 'healthy', 'Running', '1/1', '0', '30d'],
  ['prometheus-k8s-0', 'monitoring', 3, 'healthy', 'Running', '2/2', '0', '30d'],
  ['velero-6c9d7b8f5-mm2kx', 'velero', 3, 'healthy', 'Running', '1/1', '0', '88d'],
]

const COLS = '28px minmax(0,1.7fr) minmax(0,1.15fr) 168px 60px 72px 56px'

function podRows(
  o: {
    ticked?: string[]
    hover?: string
    only?: string
    narrow?: boolean
    sel?: string
    pods?: Pod[]
  } = {},
): string {
  if (o.narrow) {
    const cols = 'minmax(0,1fr) minmax(0,1.3fr) 140px'
    return `<div class="th" style="grid-template-columns:${cols}"><span>Name</span><span>Cluster</span><span>Status</span></div>${PODS.map(([name, ns, c, level, st]) => `<div class="tr${o.sel === name ? ' sel' : ''}" style="grid-template-columns:${cols}"><span><b>${name}</b><small>${ns}</small></span>${clc(SET[c]!)}<span>${pill(level, st)}</span></div>`).join('')}`
  }
  const rows = (o.pods ?? PODS).filter(([, , c]) => !o.only || SET[c]!.name === o.only)
  return `<div class="th" style="grid-template-columns:${COLS}"><span>${o.ticked ? `<span class="ck some">${icon('minus', 12, 3)}</span>` : ''}</span><span>Name</span><span>Cluster</span><span>Status</span><span>Ready</span><span class="r">Restarts</span><span class="r">Age</span></div>${rows
    .map(([name, ns, c, level, st, ready, rs, age]) => {
      const on = o.ticked?.includes(name)
      return `<div class="tr${on ? ' ticked' : ''}${o.hover === name ? ' hov' : ''}" style="grid-template-columns:${COLS}"><span>${o.ticked ? `<span class="ck${on ? ' on' : ''}">${on ? icon('check', 12, 3) : ''}</span>` : ''}</span><span><b>${name}</b><small>${ns}</small></span>${clc(SET[c]!)}<span>${pill(level, st)}</span><span class="r" style="text-align:left">${ready}</span><span class="r">${rs}</span><span class="r">${age}</span></div>`
    })
    .join('')}`
}

const STATUS_CHIPS: [string, string, string][] = [
  ['critical', 'Failing', '2'],
  ['warn', 'Pending', '1'],
  ['good', 'Running', '12,477'],
]

const TOOLBAR = (count: string, chips = STATUS_CHIPS) =>
  `<div class="tbar"><span class="count">${count}</span>${chips.map(([d, w, n]) => `<span class="chip" style="--d:var(--${d})"><i></i>${w} <b>${n}</b></span>`).join('')}<span class="grow"></span><span class="fbtn">${icon('tag', 14)}Labels${icon('chevron-down', 14)}</span><span class="fld" style="width:220px">${icon('search', 14)}Filter pods</span></div>`

const SIDE: [string, IconName][] = [
  ['Workloads', 'boxes'],
  ['Pods', 'box'],
  ['Nodes', 'server'],
  ['Events', 'activity'],
]

/** Lumovi's window, holding a set of clusters instead of one: its own sidebar, title and bar. */
function setWin(o: {
  page: string
  title?: string
  panel?: { html: string; width: number }
  extra?: string
  h?: number
  set?: Member[]
}): string {
  const set = o.set ?? SET
  let html = win({
    w: 1376,
    h: o.h ?? 720,
    cluster: 'x',
    nav: '',
    title: o.title ?? 'Pods · 4 clusters',
    glyph: 'layers',
    page: o.page,
    panel: o.panel,
    dock: dock([]),
    more: true,
    extra: o.extra,
  })
  // The switcher names the set, with each cluster's colour; the sidebar holds the four kinds.
  html = html.replace(
    /<div class="sw">[\s\S]*?<\/div>/,
    `<div class="sw set"><span class="sq">${set.map((m) => `<i ${sq(m.color)}></i>`).join('')}</span><span><b>Several clusters</b><small>${set.map((m) => m.name.replace('Payments ', '')).join(', ')}</small></span>${icon('chevrons-up-down', 16)}</div>`,
  )
  html = html.replace(
    /<nav class="nv">[\s\S]*?<\/nav>/,
    `<nav class="nv"><h3>Several clusters</h3>${SIDE.map(([n, g]) => `<div class="n${n === (o.title ?? 'Pods').split(' ')[0] ? ' on' : ''}">${icon(g, 16)}${n}</div>`).join('')}<h3>One cluster</h3>${set.map((m) => `<div class="n"><span style="display:inline-block;width:8px;height:8px;margin:0 4px;border-radius:2px;background:var(--series-${m.color})"></span>${escape(m.name)}</div>`).join('')}</nav>`,
  )
  // Nothing is created across clusters: no + in the bar.
  html = html.replace(`<span class="ib">${icon('plus', 16)}</span>`, '')
  return html
}

function pageFrame(): string {
  const page = `${strip(SET)}${TOOLBAR('12,480 pods')}${podRows()}`
  return `<section class="blk"><h2>The page<i>its own, outside one cluster: the four kinds in its sidebar, a Cluster column, and a strip saying who answered</i></h2>${setWin({ page })}</section>`
}

const PAGE_RULES = [
  '<b>A page of its own</b>, outside one cluster’s layout. The switcher names the set (“Several clusters”, each cluster’s colour, their names) and changes it; the sidebar holds <b>Workloads, Pods, Nodes and Events</b>, then the set’s clusters, each opening that cluster alone. The bar’s title is the kind and how many clusters: “Pods · 4 clusters”. Nothing is created here: no + in the bar.',
  '<b>The strip</b>, above the filters, says who answered: “4 of 4 answered”, then a chip per cluster with its colour, name and count. A chip is also a filter: pressed, the list shows that cluster alone (pressed again, all). The counts are each cluster’s, as filtered by namespace and text.',
  '<b>The Cluster column</b>, after Name, on every list here: the cluster’s colour, its name (end-cut), and its Production mark. It sorts, and gives way after Status (LMV-113’s order). A row’s namespace stays under its name, as Lumovi’s lists have it.',
  '<b>Filters work across all</b>: the text, the status chips (their counts across the set), the namespace picker (the namespaces any cluster has; one that a cluster lacks matches nothing there) and labels. Sorting is across all too: worst first by default, as Lumovi’s lists sort.',
  '<b>Events</b> merge by time, newest first, with the same column; <b>Nodes</b> and <b>Workloads</b> as Lumovi’s own lists, with it. Columns the person added to a kind’s list are kept here.',
  '<b>On a phone</b> it isn’t offered at first: Several clusters isn’t on the Clusters page under 640 px, and the page’s address there says “Several clusters needs a larger screen.”, with Back.',
]

// ─── States: reading, refused, unreachable, signs in ────────────────────────────────────────

function statesFrame(): string {
  const mixed: Member[] = [
    SET[0]!,
    { ...SET[1]!, state: 'refused' },
    { ...SET[2]!, state: 'timeout' },
    { ...SET[3]!, state: 'signs-in' },
  ]
  const reading: Member[] = [SET[0]!, SET[1]!, { ...SET[2]!, state: 'reading' }, SET[3]!]
  const page = (set: Member[], rows: string, count: string) =>
    `${strip(set)}${TOOLBAR(`${count} pods`)}${rows}`
  const firstOnly = podRows({ only: 'Payments EU' })
  const none: Member[] = SET.map((m) => ({ ...m, state: 'timeout' as const }))
  return `<section class="blk"><h2>When a cluster doesn’t answer<i>said once, in its chip; the others are listed, and nothing waits for it</i></h2>
    <p class="cap"><b>Still reading</b>: Payments staging’s chip turns until it answers; the rows that have come are listed, and its own arrive in place.</p>${setWin({ page: page(reading, podRows(), '12,068'), set: reading })}
    <p class="cap" style="margin-top:8px"><b>Each way it can go</b>: access refuses Pods on Payments US, Payments staging didn’t answer in time, and Platform tools signs in when opened, waiting for its Open. Payments EU’s pods are listed alone.</p>${setWin({ page: page(mixed, firstOnly, '3,214'), set: mixed, h: 520 })}
    <p class="cap" style="margin-top:8px"><b>None answered</b>: one line, and Retry for them all.</p>${setWin({ page: `${strip(none)}<div class="empty2"><h3>None of the 4 clusters answered</h3><p>Lumovi couldn’t reach Payments EU, Payments US, Payments staging or Platform tools in time. Retry, or open one of them alone from the sidebar.</p><span class="btn primary" style="margin-top:8px">${icon('rotate-cw', 14)}Retry all</span></div>`, set: none, h: 520 })}</section>`
}

const STATE_RULES = [
  '<b>Each cluster is read on its own</b>, and its rows are listed as they come: one slow or unreachable cluster never holds the others. Until it answers, its chip turns (“Reading…”). After 10 s it’s given up for this read: “didn’t answer in time”, in red, with <b>Retry</b> for that cluster alone; the summary says “3 of 4 answered”.',
  '<b>Refused by access</b>: its chip says so in the person’s words (“your access doesn’t list Pods”), no Retry, as asking again changes nothing. The other kinds may still be allowed there: the chip is per kind.',
  '<b>Signs in when opened</b>: listed unread, “Signs in when opened”, with <b>Open</b> in its chip. Nothing is read from it, and no sign-in starts, until Open is pressed, in a set opened now or remembered from last time. Open signs in as opening that cluster alone does, then reads it.',
  '<b>None answered</b>: “None of the 4 clusters answered”, why, <b>Retry all</b>, and the way to open one alone. A set whose clusters all sign in when opened shows each chip’s Open, and an empty list that says “Open a cluster above to list its Pods.”',
]

// ─── Actions, panels and picking rows ───────────────────────────────────────────────────────

function actionsFrame(): string {
  const staging = SET[2]!
  const menu = `<div class="pm" style="top:338px;left:900px"><div class="lbl">Actions on <i ${sq(staging.color)}></i><b>Payments staging</b></div><span class="mi">${icon('link', 16)}Copy link</span><hr><span class="mi">${icon('rotate-cw', 16)}Restart</span><span class="mi hl">${icon('square-terminal', 16)}Open a shell</span><span class="mi">${icon('pencil', 16)}Edit YAML</span><hr><span class="mi danger">${icon('trash-2', 16)}Delete…</span></div>`
  const hover = 'ledger-sync-28811520-9hd2w'
  const withMenu = `${strip(SET)}${TOOLBAR('12,480 pods')}${podRows({ hover })}`
  const panel = `<div class="dph"><span class="ktile">${icon('box', 18)}</span><div class="t"><p>Pod · payments · on <i ${sq(SET[2]!.color)}></i><b>Payments staging</b> · 6m old</p><h2>ledger-sync-28811520-9hd2w${icon('copy', 14)}</h2><div class="acts">${pill('warning', 'Pending')}<span class="btn">${icon('rotate-cw', 14)}Restart</span><span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span></div></div><span class="ib" style="margin-top:2px">${icon('maximize-2', 16)}</span><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Logs</span><span>Shell</span><span>Events</span><span>YAML</span></div><div style="padding:16px 20px;font-size:13px;color:var(--text-2)">Its Overview, Logs, Shell and the rest, read from Payments staging alone, as that cluster’s own panel has them.</div>`
  const narrow = `${strip(SET)}${TOOLBAR('12,480')}${podRows({ narrow: true, sel: hover })}`
  const ticked = [
    'checkout-7d9f6c5b8-hqnnn',
    'payments-api-5d8f7c9b6-x2kqp',
    'checkout-7d9f6c5b8-lnk52',
  ]
  const selbar = `<div class="selbar"><b>3 selected</b><span class="btn ghost off">${icon('rotate-cw', 14)}Restart</span><span class="btn ghost off">${icon('trash-2', 14)}Delete…</span><span class="why">They’re on 2 clusters: pick rows on one to act on them together.</span><span class="x">${icon('x', 16)}</span></div>`
  const picked = `${strip(SET)}${TOOLBAR('12,480 pods')}${podRows({ ticked })}`
  return `<section class="blk"><h2>Acting on a row<i>always on the object’s own cluster, which every menu, panel and dialog names</i></h2>
    <p class="cap"><b>A row’s menu</b> (its ⋯, or a right-click), headed by the cluster it acts on.</p>${setWin({ page: withMenu, extra: menu })}
    <p class="cap" style="margin-top:8px"><b>A row opened</b>: its panel says the cluster beside its kind and namespace, and reads from that cluster alone. The list beside it gives way to Name, Cluster and Status.</p>${setWin({ page: narrow, panel: { html: panel, width: 560 } })}
    <p class="cap" style="margin-top:8px"><b>Rows ticked on two clusters</b>: the selection bar’s actions are off, and it says why. Ticking rows on one cluster turns them on, as in its own list.</p>${setWin({ page: picked, extra: selbar })}
    <div class="row2" style="margin-top:8px"><div class="col"><p class="cap"><b>Its dialog</b>, as Lumovi’s: the cluster and its Production mark in the subject, as always.</p>${restartDialog()}</div></div></section>`
}

function restartDialog(): string {
  return `<div class="ad"><header><span class="g">${icon('rotate-cw', 18)}</span><div class="t"><h3>Restart ledger-sync-28811520-9hd2w?</h3><p class="sub"><span>Pod · payments · <b>Payments staging</b></span></p></div></header><div class="body"><p style="margin:0;font-size:13px;line-height:1.6;color:var(--text-2)">Deletes the Pod so its Job makes a new one.</p><div class="cmd"><p>Equivalent command</p><code>kubectl delete pod ledger-sync-28811520-9hd2w -n payments --context payments-staging</code></div></div><footer><span class="btn ghost">Cancel</span><span class="btn primary">Restart</span></footer></div>`
}

const ACT_RULES = [
  '<b>Every action stays on the object’s own cluster</b> and names it. A row’s ⋯ is headed “Actions on Payments staging”, with the cluster’s colour; the panel’s line says “on Payments staging” beside the kind and namespace; a dialog’s subject names it, with its Production mark, as Lumovi’s dialogs always do. A shell, logs or a port forward open on that cluster, and the dock’s tab says which.',
  '<b>No action spans clusters.</b> Rows can be ticked across the set, to copy them say, but the selection bar’s actions work only while every ticked row is on one cluster: with rows on two, they’re off, and the bar says “They’re on 2 clusters: pick rows on one to act on them together.”',
  '<b>Opening a row</b> opens its panel beside the list, read from its own cluster alone; the list gives way, Cluster staying after Name. Back and the panel’s links stay inside the set’s page; “Open in Payments staging” in the panel’s ⋯ leaves for that cluster’s own page.',
]

// ─── Large: thousands of rows ───────────────────────────────────────────────────────────────

function largeFrame(): string {
  const big: Member[] = SET.map((m, i) => ({ ...m, pods: [3214, 2880, 412, 5974][i]! }))
  const page = `${strip(big, 'Platform tools')}${TOOLBAR('5,974 of 12,480 pods', [['good', 'Running', '5,974']])}${podRows({ pods: PLATFORM })})}<div class="grow"></div><div class="vtip">${icon('info', 14)}<span>12,480 pods across 4 clusters: the list shows them all, drawn as they scroll by, as Lumovi’s own lists do.</span></div>`
  return `<section class="blk"><h2>Thousands of rows<i>counts per cluster in the strip; one pressed to see it alone</i></h2>${setWin({ page })}</section>`
}

const LARGE_RULES = [
  '<b>Thousands of rows</b> are one list, drawn as they scroll by (Lumovi’s own lists’ way), with every row there to sort, filter and search. The strip’s chips carry each cluster’s count, so where the rows come from reads at a glance; one pressed narrows the list to it (“5,974 of 12,480 pods”).',
  '<b>Reading stays each cluster’s own</b>: a large cluster reads in pages, as Lumovi’s lists do, and its chip counts up while it comes; the others are listed meanwhile. Watching for changes is per cluster too.',
]

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type MergedFrame = 'mc-pick' | 'mc-page' | 'mc-states' | 'mc-actions' | 'mc-large'

export const MERGED_FRAMES: { id: MergedFrame; title: string; size: Size }[] = [
  { id: 'mc-pick', title: 'Several clusters: picking', size: { width: 1440, height: 1030 } },
  { id: 'mc-page', title: 'Several clusters: the page', size: { width: 1440, height: 1195 } },
  { id: 'mc-states', title: 'Several clusters: who answered', size: { width: 1440, height: 2355 } },
  {
    id: 'mc-actions',
    title: 'Several clusters: acting on a row',
    size: { width: 1440, height: 3005 },
  },
  {
    id: 'mc-large',
    title: 'Several clusters: thousands of rows',
    size: { width: 1440, height: 1070 },
  },
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

const doc = (
  scheme: Scheme,
  width: number,
  css: string,
  body: string,
) => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
${css}
html, body { width: ${width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
${SHEET}
</style><div class="sheet">${body}</div>`

/** One of the frames, in one theme. */
export function mergedFrame(id: MergedFrame, scheme: Scheme): string {
  const f = MERGED_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${t}</h1><p>${p}</p></header>`
  if (id === 'mc-pick')
    return doc(
      scheme,
      f.size.width,
      `${CLUSTERS_CSS}\n${PICK_CSS}`,
      `${intro('Several clusters in one list (LMV-175)', 'Workloads, Pods, Nodes and Events from several clusters on one page. Here: picking the set on the Clusters page. Words are drafts for docs.')}<section class="blk"><h2>Picking the set<i>Several clusters, a box on each row; or a group’s Open together</i></h2><p class="cap"><b>Four ticked</b>, Payments’ three and Platform tools; Payments EU, Payments US and Platform tools sign in when opened, and stay unread.</p>${pickSeveral()}</section>${rules(PICK_RULES)}`,
    )
  const body = {
    'mc-page': () =>
      `${intro('Several clusters: the page (LMV-175)', 'Pods from four clusters, merged, with the Cluster column, filters across all, and the strip saying who answered. Words are drafts for docs.')}${pageFrame()}${rules(PAGE_RULES)}`,
    'mc-states': () =>
      `${intro('Several clusters: who answered (LMV-175)', 'One slow, refused or unreachable cluster doesn’t hold the others; one that signs in waits for its Open. Words are drafts for docs.')}${statesFrame()}${rules(STATE_RULES)}`,
    'mc-actions': () =>
      `${intro('Several clusters: acting on a row (LMV-175)', 'Every action stays on the object’s own cluster and names it; none spans clusters. Words are drafts for docs.')}${actionsFrame()}${rules(ACT_RULES)}`,
    'mc-large': () =>
      `${intro('Several clusters: thousands of rows (LMV-175)', 'Four clusters, 12,480 pods: the counts per cluster, and one picked to see it alone. Words are drafts for docs.')}${largeFrame()}${rules(LARGE_RULES)}`,
  }[id]()
  return doc(scheme, f.size.width, PAGE_CSS, body)
}
