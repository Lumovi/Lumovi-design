/**
 * Trivy Operator's Security page (LMV-349), and what it adds to Lumovi's own pages: a workload's
 * "Objects that point here" (LMV-350) and a Findings column on workload lists (LMV-351). Part of
 * LMV-184, as app-2's plan has it (Lumovi-project/agents/app-2/lmv-184.md): the trivy-operator
 * plugin becomes a code plugin, its page drawn from the kit's parts, and four declarative kit
 * additions in core. Frames for Péter's OK before anything is built; words are drafts for docs.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
  card,
  cgroup,
  cut,
  escape,
  fact,
  head,
  lead,
  ltab,
  only,
  phoneFrame,
  sideItem,
  table,
  tile,
  type Level,
} from './kit.ts'
import { icon } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

const PLUGIN = 'Trivy'
/** A draft: the plugin's next version, once it has pages. */
const VERSION = '1.1.0'
const CLUSTER = 'production-eu'

const CSS = `
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
.pwin { width: 1376px; }
.ov .q { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ov .q3, .q3 { color: var(--text-3); }
.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.cg .crow.go .cv { color: var(--accent-strong); }
/* A tile's line wraps, between its parts, as the built Tile does (since #189). */
.ov .ktile .s, .ph .ktile .s { height: auto; min-height: 20px; align-items: flex-start; }
.ov .ktile .s .dot, .ph .ktile .s .dot { margin-top: 5px; }
.ov .ktile .s > span:last-child, .ph .ktile .s > span:last-child { white-space: normal; line-height: 17px; }
.ktile .s .pt { display: inline-block; }

/* A severity's count: its colour where it isn't nothing, the column saying which it is. */
.sv { font-variant-numeric: tabular-nums; }
.sv.c { font-weight: 600; color: var(--critical-text); }
.sv.h { font-weight: 600; color: var(--warn-text); }
.fx { display: flex; min-width: 0; flex-direction: column; }
.fx .q { line-height: 18px; }
.fx small { overflow: hidden; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }

/* The Table's Download CSV, in its card's heading, after the count. */
.kcard > h3 .kdl { display: inline-flex; height: 26px; align-items: center; gap: 6px; margin-left: 12px; padding: 0 8px; border: 1px solid var(--line-strong); border-radius: 7px; background: var(--surface); font-size: 12px; font-weight: 500; color: var(--text-1); }
.kcard > h3 .kdl svg.i { color: var(--text-3); }
.kcard > h3 small + .xm, .kcard > h3 small + .kdl { margin-left: 12px; }
.kcard > h3 .xm .kdl { margin-left: 0; }
.kcard > h3 .lk { display: inline-flex; align-items: center; gap: 5px; margin-left: 10px; font-size: 12px; font-weight: 400; color: var(--text-3); }

/* The filter bar, as the kit has it for a Table (Argo CD's Applications page). */
.fbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 2px 0 10px; padding: 0; }
.fbar .kfield { width: 280px; }
.fb { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.fb svg.i { color: var(--text-3); }
.fb.on { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: var(--accent-soft); color: var(--accent-strong); }
.fb.on svg.i { color: var(--accent-strong); }
.fb .v { font-weight: 400; }
.fcount { margin-left: auto; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.fclear { font-size: 13px; font-weight: 500; color: var(--accent-strong); }

/* What's new, outlined and numbered, said under the frame; everything else is the kit as built. */
.xm { position: relative; display: inline-flex; border-radius: 9px; outline: 1.5px dashed var(--accent); outline-offset: 3px; }
.xm.blockx { display: block; }
.xm::after { content: attr(data-n); position: absolute; z-index: 2; top: -12px; left: -12px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); font-size: 10px; font-weight: 600; line-height: 16px; text-align: center; color: #fff; }
.xm.end::after { right: -12px; left: auto; }
.keys { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; max-width: 1100px; margin: 0; font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.keys dt { display: grid; width: 16px; height: 16px; margin-top: 2px; place-items: center; border-radius: 50%; background: var(--accent); font-size: 10px; font-weight: 600; color: #fff; }
.keys dd { margin: 0; }
.keys b { font-weight: 600; color: var(--text-1); }

/* Lumovi's toast, as a download ends. */
.toast { display: flex; width: 380px; align-items: flex-start; gap: 10px; padding: 12px 14px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-pop); font-size: 13px; line-height: 19px; }
.toast svg.i { flex: none; margin-top: 1px; color: var(--good-text); }
.toast b { display: block; font-weight: 500; overflow-wrap: anywhere; }
.toast .a { margin-top: 4px; font-size: 12.5px; font-weight: 500; color: var(--accent-strong); }
.toast .x { margin-left: auto; color: var(--text-3); }

/* Lumovi's own panel: an object's head, its bar, its tabs. */
.ap { position: relative; width: 600px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ap.wide { width: 1180px; }
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
.pbody { border-top: 1px solid var(--line); }
.phd .end { display: grid; width: 32px; height: 32px; margin-left: auto; place-items: center; border-radius: 8px; color: var(--text-2); }
.phd .end.open { background: var(--surface-3); color: var(--text-1); }
.pmain { position: relative; }
.pm { position: absolute; z-index: 5; min-width: 224px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.pm .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; white-space: nowrap; }
.pm .mi svg.i { flex: none; color: var(--text-3); }
.pm .mi .k { margin-left: auto; padding-left: 16px; font-size: 12px; color: var(--text-3); }
.pm .mi.hl { background: var(--surface-3); }
.pm hr { height: 1px; margin: 4px; border: 0; background: var(--line); }
.hrow { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 18px; margin: 0 0 12px; font-size: 13px; color: var(--text-2); }
.hrow b { font-weight: 500; color: var(--text-1); }

/* Lumovi's own Overview sections in a panel. */
.osec { padding: 14px 20px 16px; border-top: 1px solid var(--line); }
.osec > h4 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.osec > h4 small { margin-left: auto; font-size: 12px; font-weight: 400; letter-spacing: 0; text-transform: none; }
.kv { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px 16px; margin: 0; font-size: 13px; }
.kv dt { color: var(--text-3); }
.kv dd { margin: 0; min-width: 0; color: var(--text-1); }
.kv dd.lnk { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.ostub { display: flex; height: 44px; align-items: center; justify-content: center; border: 1px dashed var(--line-strong); border-radius: 10px; font-size: 12px; color: var(--text-3); }

/* Objects that point here: a group a plugin, a row an object, its view's status, opening it. */
.ph-objs { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.ph-objs .g { display: flex; height: 30px; align-items: center; gap: 6px; padding: 0 12px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-3); }
.ph-objs .g b { font-weight: 500; color: var(--text-2); }
.ph-objs .g svg.i { flex: none; }
.ph-objs .o { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto 16px; align-items: center; gap: 10px; min-height: 44px; padding: 6px 12px; font-size: 13px; }
.ph-objs .o + .o { border-top: 1px solid var(--line); }
.ph-objs .o > svg.i { color: var(--text-3); }
.ph-objs .o .w { min-width: 0; }
.ph-objs .o .w b { display: block; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.ph-objs .o .w small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.ph-objs .o .go { color: var(--text-3); }
.ph-objs .o.hov { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }

/* Lumovi's own list of Deployments, with its new Findings column. */
.lst { position: relative; width: 760px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.lst .lh, .lst .lr { display: grid; grid-template-columns: minmax(0, 1fr) 108px 52px 132px 112px 48px; align-items: center; gap: 12px; padding: 0 16px; }
.lst .lh { height: 36px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.lst .lh .r, .lst .lr .r { text-align: right; }
.lst .lh .hp { display: inline-flex; align-items: center; gap: 5px; }
.lst .lr { height: 48px; border-bottom: 1px solid var(--line); font-size: 13px; }
.lst .lr:last-child { border-bottom: 0; }
.lst .lr .nm { min-width: 0; }
.lst .lr .nm b { display: block; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.lst .lr .nm small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.lst .lr .mg { overflow: hidden; font-size: 12.5px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.lst .lr .fd { display: flex; min-width: 0; align-items: center; gap: 4px; }
.lst .lr .fd .more { font-size: 12px; color: var(--text-3); }
.tip3 { position: absolute; z-index: 3; width: max-content; max-width: 300px; padding: 6px 10px; border-radius: 8px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); box-shadow: var(--shadow-pop); }

/* The YAML tab, a withheld field in it. */
.yml { margin: 0; padding: 14px 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 21px; color: var(--text-1); white-space: pre; }
.yml .k { color: var(--accent-strong); }
.yml .s { color: var(--text-2); }
.yml .wh { display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px; border-radius: 6px; background: var(--surface-3); font-family: 'Inter', sans-serif; font-size: 11.5px; font-weight: 500; color: var(--text-2); vertical-align: 1px; }
.yml .wh svg.i { color: var(--text-3); }
.whnote { display: flex; gap: 8px; margin: 10px 0 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.whnote svg.i { flex: none; margin-top: 1px; color: var(--text-3); }

.pair.even { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.duo { display: flex; gap: 32px; align-items: flex-start; }
.duo > .col { display: flex; min-width: 0; flex-direction: column; gap: 8px; }

/* On a phone. */
.ph .pfil { display: flex; gap: 8px; padding: 0 16px 8px; }
.ph .pfil .kfield { flex: 1; height: 44px; }
.ph .pfil .fb { height: 44px; }
.ph .pmore { padding: 12px 0 4px; font-size: 13px; font-weight: 500; color: var(--accent-strong); text-align: center; }
.ph .ph-objs .o { min-height: 52px; }
.ph .lcard { display: block; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.ph .lcard .top { display: flex; align-items: center; gap: 10px; }
.ph .lcard .top .lead { flex: 1; }
.ph .lcard dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 8px 0 0 18px; font-size: 12px; line-height: 16px; }
.ph .lcard dt { color: var(--text-3); }
.ph .lcard dd { margin: 2px 0 0; }
.ph .cards dl.wfix { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ph .cards dl.wfix > .whole { grid-column: 1 / -1; }
`

/** Marks a new part with a number, said under the frame. */
const xm = (n: number, body: string, o: { end?: boolean; block?: boolean } = {}) =>
  `<span class="xm${o.end ? ' end' : ''}${o.block ? ' blockx' : ''}" data-n="${n}">${body}</span>`

const DOWNLOAD = `<span class="kdl">${icon('download', 14)}Download CSV</span>`

/** A Card whose Table can be saved as CSV: the button in its heading, after the count. */
const tcard = (
  title: string,
  note: string,
  body: string,
  o: { about?: string; mark?: boolean } = {},
) =>
  `<div class="kcard"><h3>${title}${note ? `<small>${note}</small>` : ''}${o.mark ? xm(1, DOWNLOAD, { end: true }) : DOWNLOAD}</h3>${o.about ? `<p class="about">${o.about}</p>` : ''}<div class="in">${body}</div></div>`

/** A severity's count. */
const sv = (n: number, s: 'c' | 'h' | '' = '') =>
  n ? `<span class="r sv ${s}">${n}</span>` : '<span class="r sv q3">0</span>'

const row = (cells: string[], opens = true) => ({ cells, cls: opens ? 'opens' : '' })
const ago = (t: string) => `<span class="r q3">${t}</span>`

const SIDE = (on: boolean) =>
  `<h3>Configuration</h3>${sideItem('ConfigMaps', 'file-code-2')}${sideItem('Secrets', 'key-round')}<h3>Plugins</h3>${sideItem('Argo CD', 'git-merge')}${sideItem(PLUGIN, 'bug', on)}${sideItem('All plugins', 'plug')}`

const TABS =
  ltab('Security', { plug: true, on: true }) +
  ltab('VulnerabilityReports', { count: '214' }) +
  ltab('ConfigAuditReports', { count: '96' }) +
  ltab('ExposedSecretReports', { count: '214' }) +
  ltab('RbacAssessmentReports', { count: '41' }) +
  ltab('ClusterRbacAssessmentReports', { count: '62' }) +
  ltab('ClusterComplianceReports', { count: '2' })

// ─── 1. The Security page ───────────────────────────────────────────────────────────────────

/** A tile's line, in parts each held whole, as the built Tile wraps only between them. */
const parts = (line: string) =>
  line
    .split(' · ')
    .map((p) => `<span class="pt">${p}</span>`)
    .join(' · ')

const TILES = () =>
  `${tile('shield-alert', 'Critical', '23', parts('16 fixable · in 6 workloads'), { level: 'critical', opens: true })}${tile('triangle-alert', 'High', '118', parts('71 fixable · in 19 workloads'), { level: 'warning', opens: true })}${tile('key-round', 'Exposed secrets', '3', parts('in 2 images'), { level: 'critical', opens: true })}${tile('file-warning', 'Misconfigured', '17', parts('of 96 resources · 9 high'), { level: 'warning', opens: true })}`

interface Workload {
  name: string
  ns: string
  kind: string
  images: number
  sev: [number, number, number, number]
  /** Fixable critical, fixable high. */
  fix: [number, number]
  /** The worst one with a fix: its ID, its package, from and to. */
  first: [string, string, string, string] | null
  scanned: string
  level: Level
}

/** Fixable first: fixable critical, then fixable high, then the rest by severity. */
const WORKLOADS: Workload[] = [
  {
    name: 'payments-api',
    ns: 'payments',
    kind: 'Deployment',
    images: 1,
    sev: [9, 21, 34, 12],
    fix: [8, 19],
    first: ['CVE-2024-45337', 'golang.org/x/crypto', '0.21.0', '0.31.0'],
    scanned: '12m',
    level: 'critical',
  },
  {
    name: 'checkout',
    ns: 'shop',
    kind: 'Deployment',
    images: 2,
    sev: [4, 17, 25, 8],
    fix: [4, 15],
    first: ['CVE-2024-24790', 'stdlib', '1.21.3', '1.21.11'],
    scanned: '14m',
    level: 'critical',
  },
  {
    name: 'ingress-nginx-controller',
    ns: 'ingress-nginx',
    kind: 'Deployment',
    images: 1,
    sev: [2, 9, 14, 3],
    fix: [2, 9],
    first: ['CVE-2025-1974', 'ingress-nginx', '1.11.2', '1.11.5'],
    scanned: '1h',
    level: 'critical',
  },
  {
    name: 'storefront',
    ns: 'shop',
    kind: 'Deployment',
    images: 1,
    sev: [1, 6, 12, 4],
    fix: [1, 5],
    first: ['CVE-2024-6387', 'openssh', '9.3_p2-r1', '9.3_p2-r2'],
    scanned: '14m',
    level: 'critical',
  },
  {
    name: 'redis',
    ns: 'data',
    kind: 'StatefulSet',
    images: 1,
    sev: [1, 3, 9, 15],
    fix: [1, 2],
    first: ['CVE-2023-45853', 'zlib', '1.2.13', '1.3.1'],
    scanned: '3h',
    level: 'critical',
  },
  {
    name: 'node-exporter',
    ns: 'monitoring',
    kind: 'DaemonSet',
    images: 1,
    sev: [0, 4, 6, 2],
    fix: [0, 4],
    first: ['CVE-2024-34156', 'stdlib', '1.22.4', '1.22.7'],
    scanned: '41m',
    level: 'warning',
  },
  {
    name: 'legacy-batch',
    ns: 'batch',
    kind: 'CronJob',
    images: 1,
    sev: [6, 30, 51, 40],
    fix: [0, 3],
    first: ['CVE-2024-2961', 'glibc', '2.31-13', '2.31-13+deb11u9'],
    scanned: '2h',
    level: 'critical',
  },
  {
    name: 'cart',
    ns: 'shop',
    kind: 'Deployment',
    images: 1,
    sev: [0, 2, 7, 3],
    fix: [0, 2],
    first: ['CVE-2024-21538', 'cross-spawn', '7.0.3', '7.0.5'],
    scanned: '22m',
    level: 'warning',
  },
]

/** The worst one with a fix, and what to update it to. */
const firstFix = (f: Workload['first']) =>
  f
    ? `<span class="fx"><span class="q"><span class="mono">${f[0]}</span></span><small>${escape(f[1])} ${escape(f[2])} → ${escape(f[3])}</small></span>`
    : '<span class="q3">No fix yet</span>'

const fixable = (w: Workload) =>
  `<span class="r sv">${w.fix[0] + w.fix[1]}<span class="q3"> of ${w.sev[0] + w.sev[1]}</span></span>`

function byWorkload(rows: Workload[]): string {
  return table(
    'minmax(0,1.3fr) 60px 52px 60px 44px 84px minmax(0,1.2fr) 56px',
    [
      head('Workload'),
      head('Critical', { r: true }),
      head('High', { r: true }),
      head('Medium', { r: true }),
      head('Low', { r: true }),
      head('Fixable', { r: true, sorted: 'down' }),
      head('Fix first'),
      head('Scanned', { r: true }),
    ],
    rows.map((w) =>
      row([
        lead({
          level: w.level,
          name: w.name,
          beside: w.ns,
          under: `${w.kind} · ${w.images} ${w.images === 1 ? 'image' : 'images'}`,
        }),
        sv(w.sev[0], 'c'),
        sv(w.sev[1], 'h'),
        sv(w.sev[2]),
        sv(w.sev[3]),
        fixable(w),
        firstFix(w.first),
        ago(w.scanned),
      ]),
    ),
  )
}

const fb = (label: string, value = '') =>
  value
    ? `<span class="fb on">${label}: <span class="v">${value}</span>${icon('x', 12)}</span>`
    : `<span class="fb">${label}${icon('chevron-down', 14)}</span>`

const FBAR = (o: { set?: [string, string][]; count: string }) =>
  `<div class="fbar"><span class="kfield ph">${icon('search', 16)}<span>Workload, image or CVE</span></span>${['Severity', 'Fixable', 'Namespace', 'Kind'].map((f) => fb(f, o.set?.find(([k]) => k === f)?.[1])).join('')}${o.set?.length ? '<span class="fclear">Clear filters</span>' : ''}<span class="fcount">${o.count}</span></div>`

const BY_WORKLOAD = (
  o: { set?: [string, string][]; count?: string; rows?: Workload[]; mark?: boolean } = {},
) =>
  tcard(
    'Vulnerabilities by workload',
    '42',
    `${FBAR({ set: o.set, count: o.count ?? '42 workloads' })}${byWorkload(o.rows ?? WORKLOADS)}${o.rows ? '' : '<div class="kmore">Show all 42</div>'}`,
    {
      mark: o.mark,
      about:
        'Each workload’s images as Trivy last scanned them. Fixable ones first: those with a fixed version, critical before high.',
    },
  )

const IMAGES: [
  Level,
  string,
  string,
  string,
  Workload['sev'],
  [number, number],
  Workload['first'],
][] = [
  [
    'critical',
    'ghcr.io/acme/payments-api:2.4.2',
    'payments-api · payments',
    'alpine 3.19.1',
    [9, 21, 34, 12],
    [8, 19],
    ['CVE-2024-45337', 'golang.org/x/crypto', '0.21.0', '0.31.0'],
  ],
  [
    'critical',
    'ghcr.io/acme/checkout:1.14.0',
    'checkout · shop',
    'debian 12.5',
    [3, 12, 19, 6],
    [3, 11],
    ['CVE-2024-24790', 'stdlib', '1.21.3', '1.21.11'],
  ],
  [
    'critical',
    'registry.k8s.io/ingress-nginx/controller:v1.11.2',
    'ingress-nginx-controller · ingress-nginx',
    'alpine 3.20.0',
    [2, 9, 14, 3],
    [2, 9],
    ['CVE-2025-1974', 'ingress-nginx', '1.11.2', '1.11.5'],
  ],
  [
    'critical',
    'docker.io/library/redis:7.2.4',
    'redis · data, and 2 more',
    'debian 12.4',
    [1, 3, 9, 15],
    [1, 2],
    ['CVE-2023-45853', 'zlib', '1.2.13', '1.3.1'],
  ],
]

const BY_IMAGE = tcard(
  'Vulnerabilities by image',
  '31',
  `${table(
    'minmax(0,1.6fr) 60px 52px 60px 44px 84px minmax(0,1.2fr) 96px',
    [
      head('Image'),
      head('Critical', { r: true }),
      head('High', { r: true }),
      head('Medium', { r: true }),
      head('Low', { r: true }),
      head('Fixable', { r: true, sorted: 'down' }),
      head('Fix first'),
      head('OS'),
    ],
    IMAGES.map(([level, image, used, os, sev, fix, first]) =>
      row([
        lead({ level, name: image, under: `Used by ${used}` }),
        sv(sev[0], 'c'),
        sv(sev[1], 'h'),
        sv(sev[2]),
        sv(sev[3]),
        `<span class="r sv">${fix[0] + fix[1]}<span class="q3"> of ${sev[0] + sev[1]}</span></span>`,
        firstFix(first),
        `<span class="q q3">${os}</span>`,
      ]),
    ),
  )}<div class="kmore">Show all 31</div>`,
  { about: 'Each image once, however many workloads run it.' },
)

const crowGo = (html: string) => html.replaceAll('class="crow"', 'class="crow go"')

const WHERE = card(
  'Critical and high, by namespace',
  '',
  `<div class="counts one">${crowGo(
    cgroup(
      'Namespaces',
      [
        ['batch', 36],
        ['payments', 30],
        ['shop', 30],
        ['ingress-nginx', 11],
      ],
      141,
      true,
      6,
    ),
  )}</div>`,
)

const PACKAGES = card(
  'Fixable, by package',
  '',
  `<div class="counts one">${crowGo(
    cgroup(
      'Packages',
      [
        ['stdlib', 24],
        ['golang.org/x/crypto', 17],
        ['openssl', 12],
        ['zlib', 5],
      ],
      87,
      true,
      19,
    ),
  )}</div>`,
)

const SECRETS = tcard(
  'Exposed secrets',
  '3',
  table(
    'minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,1fr) 108px',
    [head('Where'), head('File'), head('What'), head('Severity', { sorted: 'down' })],
    [
      row([
        lead({
          level: 'critical',
          name: 'legacy-batch',
          beside: 'batch',
          under: 'worker · ghcr.io/acme/legacy-batch:0.9.1',
        }),
        '<span class="q mono">/app/config/.env</span>',
        '<span class="q">AWS access key ID</span>',
        `<span>${pill('critical', 'Critical')}</span>`,
      ]),
      row([
        lead({
          level: 'critical',
          name: 'legacy-batch',
          beside: 'batch',
          under: 'worker · ghcr.io/acme/legacy-batch:0.9.1',
        }),
        '<span class="q mono">/root/.ssh/id_rsa</span>',
        '<span class="q">Private key</span>',
        `<span>${pill('warning', 'High')}</span>`,
      ]),
      row([
        lead({
          level: 'neutral',
          name: 'checkout',
          beside: 'shop',
          under: 'web · ghcr.io/acme/checkout:1.14.0',
        }),
        '<span class="q mono">/srv/app/settings.py</span>',
        '<span class="q">Slack webhook</span>',
        `<span>${pill('neutral', 'Medium')}</span>`,
      ]),
    ],
  ),
  {
    about:
      'Where Trivy found each one, and what kind it is. The text that matched isn’t shown: Lumovi drops it before this page sees it.',
  },
)

const MISCONFIG = tcard(
  'Misconfigurations',
  '17 of 96 resources',
  `${table(
    'minmax(0,1.2fr) 60px 52px 60px 44px minmax(0,1.5fr) 56px',
    [
      head('Resource'),
      head('Critical', { r: true }),
      head('High', { r: true, sorted: 'down' }),
      head('Medium', { r: true }),
      head('Low', { r: true }),
      head('Worst check'),
      head('Scanned', { r: true }),
    ],
    [
      [
        'node-exporter',
        'monitoring',
        'DaemonSet',
        [0, 4, 3, 2],
        'KSV009',
        'Access to host network',
        '41m',
      ],
      ['legacy-batch', 'batch', 'CronJob', [0, 3, 4, 5], 'KSV017', 'Privileged container', '2h'],
      [
        'payments-api',
        'payments',
        'Deployment',
        [0, 1, 3, 6],
        'KSV014',
        'Root file system is not read-only',
        '12m',
      ],
      [
        'redis',
        'data',
        'StatefulSet',
        [0, 1, 2, 4],
        'KSV014',
        'Root file system is not read-only',
        '3h',
      ],
      ['checkout', 'shop', 'Deployment', [0, 0, 2, 5], 'KSV012', 'Runs as root user', '14m'],
    ].map(([name, ns, kind, s, id, title, when]) => {
      const sev = s as number[]
      return row([
        lead({
          level: sev[1] ? 'warning' : 'neutral',
          name: name as string,
          beside: ns as string,
          under: kind as string,
        }),
        sv(sev[0]!, 'c'),
        sv(sev[1]!, 'h'),
        sv(sev[2]!),
        sv(sev[3]!),
        `<span class="q"><span class="mono q3">${id}</span> ${escape(title as string)}</span>`,
        ago(when as string),
      ])
    }),
  )}<div class="kmore">Show all 17</div>`,
  { about: 'Checks that failed on each resource’s settings, by severity.' },
)

const RBAC = tcard(
  'RBAC',
  '9 of 103 roles',
  `${table(
    'minmax(0,1.2fr) 60px 52px 60px minmax(0,1.6fr)',
    [
      head('Role'),
      head('Critical', { r: true, sorted: 'down' }),
      head('High', { r: true }),
      head('Medium', { r: true }),
      head('Worst check'),
    ],
    [
      ['ci-deployer', 'cluster-wide', 'ClusterRole', [2, 1, 0], 'KSV046', 'Manage all resources'],
      ['payments-operator', 'cluster-wide', 'ClusterRole', [1, 2, 1], 'KSV041', 'Manage secrets'],
      ['shop-secrets-reader', 'shop', 'Role', [0, 1, 0], 'KSV113', 'Manage namespace secrets'],
      ['batch-runner', 'batch', 'Role', [0, 0, 2], 'KSV049', 'Manage configmaps'],
    ].map(([name, where, kind, s, id, title]) => {
      const sev = s as number[]
      return row([
        lead({
          level: sev[0] ? 'critical' : sev[1] ? 'warning' : 'neutral',
          name: name as string,
          beside: where as string,
          under: kind as string,
        }),
        sv(sev[0]!, 'c'),
        sv(sev[1]!, 'h'),
        sv(sev[2]!),
        `<span class="q"><span class="mono q3">${id}</span> ${escape(title as string)}</span>`,
      ])
    }),
  )}<div class="kmore">Show all 9</div>`,
  { about: 'Roles and cluster roles whose permissions Trivy flags, by severity.' },
)

const page = (mark = false) => `<div class="arr-stack ov" style="padding:16px">
  <div class="arr-tiles" style="--n:4">${TILES()}</div>
  ${BY_WORKLOAD({ mark })}
  ${BY_IMAGE}
  <div class="pair even">${WHERE}${PACKAGES}</div>
  ${SECRETS}
  ${MISCONFIG}
  ${RBAC}
</div>`

/** The bar's More (⋯), open: what the plugin may do, then Keyboard shortcuts, as on every plugin page. */
const MORE_MENU = `<div class="pm" style="top:44px;right:16px"><span class="mi hl">${icon('shield-check', 16)}What ${PLUGIN} may do</span><hr><span class="mi">${icon('keyboard', 16)}Keyboard shortcuts<span class="k">?</span></span></div>`

/** Lumovi's window: the plugin's page sits in it as Lumovi's own do, with no strip or frame of its own. */
const win = (body: string, open = false) =>
  `<div class="pwin"><aside class="pside">${SIDE(true)}</aside><div class="pmain"><div class="phd">${icon('bug', 16)}<b>${PLUGIN}</b><span class="end${open ? ' open' : ''}">${icon('ellipsis', 16)}</span></div><nav class="lts">${TABS}</nav><div class="pbody">${body}</div>${open ? MORE_MENU : ''}</div></div>`

function securityFrame(): string {
  const filtered = win(
    `<div class="arr-stack ov" style="padding:16px">${BY_WORKLOAD({
      set: [
        ['Severity', 'Critical'],
        ['Fixable', 'Yes'],
      ],
      count: '5 of 42',
      rows: WORKLOADS.filter((w) => w.fix[0] > 0),
    })}</div>`,
    true,
  )
  const toast = `<div class="toast">${icon('circle-check', 16)}<div><b>Saved trivy-vulnerabilities-by-workload-${CLUSTER}-2026-10-16.csv</b><div class="a">Show in Finder</div></div><span class="x">${icon('x', 14)}</span></div>`
  return `<section class="blk"><h2>The Security page<i>the plugin’s own page, first of its tabs: what to fix first, then everything else Trivy found</i></h2>${win(page(true))}</section>
  <section class="blk"><h2>Filtered, and saved<i>the Critical tile opens it filtered; Download CSV saves what the table holds</i></h2><p class="cap"><b>From the Critical tile</b>, with Fixable set: the five to update first. The bar’s ⋯ is open: What Trivy may do, then Keyboard shortcuts.</p>${filtered}<p class="cap" style="margin-top:8px"><b>Download CSV</b> saves the rows as filtered, every column, all 5, and says so in Lumovi’s own toast.</p>${toast}</section>`
}

const SEC_RULES = [
  '<b>A Security page, Trivy’s own</b>, first of its tabs, then its kinds’ lists as today. The plugin is a code plugin now; its page is drawn from the kit’s parts only (Tiles, FilterBar, Table, Card, Pair, Counts), so it reads as Lumovi’s own. It reads the reports field by field, and never <code>report.secrets[].match</code>, which its file declares withheld (frame 2).',
  '<b>Whose page it is</b> is said as on every plugin page since LMV-331: the plug on its tabs, and <b>What Trivy may do</b> in the bar’s More (⋯), before Keyboard shortcuts (and after Copy link to this view, with LMV-193); on a phone, in the palette’s Actions. There is no strip over the page and no frame around it: it sits in Lumovi’s window as Lumovi’s own pages do.',
  '<b>Four tiles, what needs me first:</b> Critical and High, each with how many have a fix and in how many workloads; Exposed secrets, with how many images; Misconfigured, of how many resources. Each opens the table below filtered to it (Critical: Severity Critical and Fixable Yes, the frame under).',
  '<b>Vulnerabilities by workload</b>, fixable first: by fixable critical, then fixable high, then the rest by severity, so a workload whose criticals have no fix yet (legacy-batch) comes after those you can fix today. Each severity’s count in its column, coloured only where it isn’t 0; Fixable as “27 of 30” (critical and high); Fix first, the worst one with a fix and the version that fixes it; when Trivy scanned it. A workload is its images’ reports added up; a row opens the workload, on its Objects that point here (frame 3).',
  '<b>By image</b>, each image once however many workloads run it, with who runs it and its OS; a row opens its report (frame 2). <b>By namespace</b> and <b>by package</b> are Counts: critical and high per namespace, and fixable ones per package, each row opening the table filtered to it.',
  '<b>Exposed secrets</b>: where (the workload, its container and image, the file) and what kind (Trivy’s own title), with its severity. Never what matched: the plugin can’t read it, and Lumovi doesn’t show it anywhere. <b>Misconfigurations</b> and <b>RBAC</b>: each resource or role with its failed checks by severity and the worst one, ID and title as Trivy names them.',
  '<b>Download CSV</b>, new in the kit (1): every Table can save itself, in its card’s heading (on a table that’s its page’s list, a square button at the bar’s end, where Lumovi’s lists have Columns, its icon a download, named and titled “Download CSV”), with the words and the file name Lumovi’s own lists use (<code>trivy-vulnerabilities-by-workload-production-eu-2026-10-16.csv</code>): the rows as filtered and sorted, all of them, every column, with the formula guard Lumovi’s lists have. <b>Its columns</b>, as a spreadsheet reads them: Group (where any row has one), Part of (an inner row’s row, by name, where any row holds rows; inner rows each a line after their row), the lead as its heading names it, then “<i>Name</i> (beside)” and “<i>Name</i> (under)” and the dot’s level in Lumovi’s word, headed as the table’s level filter (else Health), each where any row has it; then the plugin’s columns in order: text whole, a number bare, an age or a status’s since whole in UTC (“<i>Status</i> (since)”), a status its word, a meter two numbers (“<i>CPU</i> (used)”, “<i>CPU</i> (of)”, empty with no limit), a row’s rest in the first column it takes, a button’s column left out; and a Note last where any row has one. Lumovi writes the file, not the plugin, and its toast says where. Nothing leaves the cluster but that file, on this computer.',
  '<b>States:</b> while the first read runs, the kit’s busy state in each part; a failed read, its failed state with Try again; no reports yet: “Trivy hasn’t written any reports yet. They show here once it has scanned the cluster’s workloads.” A table with nothing in it says so in a line (“No exposed secrets found.”), never hidden.',
  '<b>On a phone</b> the page is read: tiles two across, each table as cards, its Download CSV a 44 px button at its heading’s end (frame 4).',
  '<b>Not here:</b> ClusterComplianceReports stay a list, as today; no scanner is started or configured from Lumovi; nothing is fixed from this page, as an image is fixed where it’s built.',
]

// ─── 2. A report, and a withheld field ─────────────────────────────────────────────────────

const CVES: [string, Level, string, string, string, string, string][] = [
  [
    'CVE-2024-45337',
    'critical',
    'Critical',
    'golang.org/x/crypto',
    '0.21.0',
    '0.31.0',
    'Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass',
  ],
  [
    'CVE-2024-24790',
    'critical',
    'Critical',
    'stdlib',
    '1.21.8',
    '1.21.11',
    'Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses',
  ],
  [
    'CVE-2023-45288',
    'critical',
    'Critical',
    'golang.org/x/net',
    '0.19.0',
    '0.23.0',
    'HTTP/2 CONTINUATION flood',
  ],
  [
    'CVE-2024-6119',
    'warning',
    'High',
    'openssl',
    '3.1.4-r5',
    '3.1.7-r0',
    'Possible denial of service in X.509 name checks',
  ],
  [
    'CVE-2024-34156',
    'warning',
    'High',
    'stdlib',
    '1.21.8',
    '1.22.7',
    'Stack exhaustion in Decoder.Decode',
  ],
  [
    'CVE-2024-24791',
    'warning',
    'High',
    'stdlib',
    '1.21.8',
    '1.21.12',
    'Denial of service due to improper 100-continue handling',
  ],
  [
    'CVE-2024-45338',
    'warning',
    'High',
    'golang.org/x/net',
    '0.19.0',
    '0.33.0',
    'Non-linear parsing of case-insensitive content',
  ],
  [
    'CVE-2024-9143',
    'critical',
    'Critical',
    'openssl',
    '3.1.4-r5',
    '',
    'Low-level invalid GF(2^m) parameters lead to out-of-bounds memory access',
  ],
]

function reportFrame(): string {
  const cveTable = table(
    '150px 96px minmax(0,0.9fr) 92px 92px minmax(0,2fr)',
    [
      head('Vulnerability'),
      head('Severity'),
      head('Package'),
      head('Installed'),
      head('Fixed in', { sorted: 'down' }),
      head('Title'),
    ],
    CVES.map(([id, level, word, pkg, inst, fixed, title]) =>
      row(
        [
          `<span class="q mono">${id}</span>`,
          `<span>${pill(level, word)}</span>`,
          `<span class="q">${escape(pkg)}</span>`,
          `<span class="q mono">${inst}</span>`,
          fixed ? `<span class="q mono">${fixed}</span>` : '<span class="q3">No fix yet</span>',
          `<span class="q q3">${escape(title)}</span>`,
        ],
        true,
      ),
    ),
  )
  const tab = `<div class="hrow"><span>Image <b class="mono">ghcr.io/acme/payments-api:2.4.2</b></span><span>OS <b>alpine 3.19.1</b></span><span>Container <b>api</b></span><span>Scanned <b>12 minutes ago</b></span></div>${tcard(
    'Vulnerabilities',
    '76',
    `<div class="fbar"><span class="kfield ph">${icon('search', 16)}<span>Vulnerability, package or title</span></span>${fb('Severity')}${fb('Fixable')}<span class="fcount">76 vulnerabilities</span></div>${cveTable}<div class="kmore">Show all 76</div>`,
    {
      about:
        'Those with a fix first, worst first in each. A row opens the vulnerability’s own page, outside Lumovi.',
    },
  )}`
  const panel = `<div class="ap wide"><div class="hd"><span class="kt">${icon('bug', 18)}</span><div class="who"><small>VulnerabilityReport · payments · 12m old</small><b>replicaset-payments-api-5d8f7c9b6-api</b><div class="st2">${pill('critical', '9 critical')}<span class="abar"><span class="sq">${icon('pin', 14)}</span><span class="sq">${icon('ellipsis', 14)}</span></span></div></div><span class="wins"><span>${icon('panel-bottom', 16)}</span><span>${icon('maximize-2', 16)}</span><span>${icon('x', 16)}</span></span></div><nav class="lts">${ltab('Overview')}${ltab('Vulnerabilities', { plug: true, on: true })}${ltab('Events')}${ltab('Audit')}${ltab('YAML')}</nav><div class="pbody"><div class="ov" style="padding:16px">${tab}</div></div></div>`

  const yaml = `<pre class="yml"><span class="k">report</span>:
  <span class="k">scanner</span>:
    <span class="k">name</span>: <span class="s">Trivy</span>
  <span class="k">secrets</span>:
  - <span class="k">category</span>: <span class="s">AWS</span>
    <span class="k">match</span>: <span class="wh">${icon('lock', 12)}Withheld</span>
    <span class="k">ruleID</span>: <span class="s">aws-access-key-id</span>
    <span class="k">severity</span>: <span class="s">CRITICAL</span>
    <span class="k">target</span>: <span class="s">/app/config/.env</span>
    <span class="k">title</span>: <span class="s">AWS Access Key ID</span>
  - <span class="k">category</span>: <span class="s">AsymmetricPrivateKey</span>
    <span class="k">match</span>: <span class="wh">${icon('lock', 12)}Withheld</span>
    <span class="k">ruleID</span>: <span class="s">private-key</span>
    <span class="k">severity</span>: <span class="s">HIGH</span>
    <span class="k">target</span>: <span class="s">/root/.ssh/id_rsa</span>
    <span class="k">title</span>: <span class="s">Asymmetric Private Key</span></pre>`
  const yamlPanel = `<div class="ap"><div class="hd"><span class="kt">${icon('key-round', 18)}</span><div class="who"><small>ExposedSecretReport · batch · 2h old</small><b>cronjob-legacy-batch-worker</b><div class="st2">${pill('critical', '1 critical')}<span class="abar"><span class="sq">${icon('pin', 14)}</span><span class="sq">${icon('ellipsis', 14)}</span></span></div></div></div><nav class="lts">${ltab('Overview')}${ltab('Events')}${ltab('Audit')}${ltab('YAML', { on: true })}</nav><div class="tb">${xm(2, yaml, { block: true })}<p class="whnote">${icon('lock', 14)}<span>Withheld by the plugin Trivy’s file: Lumovi drops what matched as it reads the report, so it isn’t here, in the details, in a CSV, in the plugin’s code or in what its assistant tools read.</span></p></div></div>`

  return `<section class="blk"><h2>A report’s findings<i>the plugin’s own tab, on its own kind: every vulnerability in an image, fixable first</i></h2>${panel}</section>
  <section class="blk"><h2>A withheld field<i>new in the kit (2): what a file declares withheld, Lumovi never shows, and never hands to the plugin’s code</i></h2><div class="duo"><div class="col"><p class="cap"><b>An ExposedSecretReport’s YAML tab</b>, Lumovi’s own: each <code>match</code> withheld, its key kept so the shape still reads.</p>${yamlPanel}</div></div></section>`
}

const REPORT_RULES = [
  '<b>A report’s own tab</b>, the plugin’s, on its own kind (as the kit allows today): the image, its OS, the container and when it was scanned, then every vulnerability in it, sorted by Fixed in: those with a fix first, worst first in each, so an unfixed critical comes after the fixable highs: its ID, severity, package, the version installed and the one that fixes it (“No fix yet” where there’s none), and Trivy’s title. Search and the Severity and Fixable filters; Download CSV.',
  '<b>A row opens the vulnerability’s own page</b>, the link Trivy gives it, in the browser, as Lumovi’s links out do. Nothing else leaves: Lumovi doesn’t look a vulnerability up anywhere.',
  '<b>Withheld fields</b>, new in the kit (2) and first of the four: the plugin’s file names fields (<code>withheld: [report.secrets[].match]</code>) that Lumovi drops as it reads the object, before anything else sees it. Not in the plugin’s code, not in details, not in the YAML tab, not in a CSV, not in a copy, and not in what Lumovi’s assistant tools read (their get and list of these kinds). It’s withheld from what Lumovi shows and hands on, not from the cluster: <code>kubectl get exposedsecretreport -o yaml</code> in a terminal still shows it, and docs say so. The YAML tab keeps the key with a quiet <b>Withheld</b> where its value was, so the object’s shape still reads; a line under it says whose file withholds it.',
  '<b>A kind with a withheld field has no Edit YAML or Apply</b>, refused by Lumovi’s backend as well as its page: what Lumovi doesn’t show, it can’t send back. Its labels and annotations can still be edited, as those patches carry nothing withheld. Trivy’s reports are written by Trivy, so nothing is lost.',
]

// ─── 3. On Lumovi's own pages: objects that point here, and a Findings column ──────────────

type Dep = [
  string,
  string,
  [Level, string],
  string,
  string,
  [Level, string] | null,
  string,
  string?,
]

const DEPLOYMENTS: Dep[] = [
  [
    'payments-api',
    'payments',
    ['healthy', 'Running'],
    '3/3',
    'Argo CD · payments',
    ['critical', '9 critical'],
    '6d',
  ],
  [
    'checkout',
    'shop',
    ['healthy', 'Running'],
    '3/3',
    'Argo CD · checkout',
    ['critical', '4 critical'],
    '6d',
  ],
  [
    'ingress-nginx-controller',
    'ingress-nginx',
    ['healthy', 'Running'],
    '2/2',
    'Helm · ingress-nginx',
    ['critical', '2 critical'],
    '41d',
  ],
  [
    'storefront',
    'shop',
    ['healthy', 'Running'],
    '3/3',
    'Argo CD · storefront',
    ['critical', '1 critical'],
    '5h',
  ],
  ['cart', 'shop', ['warning', 'Degraded'], '1/2', 'Argo CD · cart', ['warning', '2 high'], '22m'],
  ['search', 'shop', ['healthy', 'Running'], '2/2', 'Argo CD · search', null, '1d'],
  ['catalog', 'shop', ['healthy', 'Running'], '2/2', '—', null, '3d'],
]

function deploymentsList(): string {
  const rows = DEPLOYMENTS.map(
    ([name, ns, status, ready, managed, finding, age, more], i) =>
      `<div class="lr"><span class="nm"><b>${name}</b><small>${ns}</small></span><span>${pill(...status)}</span><span class="r">${ready}</span><span class="mg">${managed}</span><span class="fd">${finding ? `${pill(...finding)}${more ? `<span class="more">${more}</span>` : ''}` : '<span class="q3">—</span>'}${i === 0 ? '' : ''}</span><span class="r q3">${age}</span></div>`,
  ).join('')
  const tip = `<div class="tip3" style="top:278px;left:524px">2 high, from the plugin Trivy ${VERSION}</div>`
  return `<div class="lst"><div class="lh"><span>Name</span><span>Status</span><span class="r">Ready</span><span>Managed by</span>${xm(4, `<span class="hp">${icon('plug', 12)}Findings</span>`)}<span class="r">Age</span></div>${rows}${tip}</div>`
}

/** A report's name, cut in its middle where it doesn't fit: reports differ in their last part. */
const rname = (name: string, fit?: number) => (fit ? cut(name, fit) : escape(name))

const POINT_ROWS = (hover = false, fit?: number) =>
  `<div class="ph-objs"><div class="g">${icon('plug', 14)}<span>From the plugin <b>${PLUGIN}</b> ${VERSION}</span></div><div class="o${hover ? ' hov' : ''}">${icon('bug', 16)}<span class="w"><b>${rname('replicaset-payments-api-5d8f7c9b6-api', fit)}</b><small>VulnerabilityReport · the api container</small></span>${pill('critical', '9 critical')}<span class="go">${icon('chevron-right', 16)}</span></div><div class="o">${icon('file-check', 16)}<span class="w"><b>${rname('replicaset-payments-api-5d8f7c9b6', fit)}</b><small>ConfigAuditReport</small></span>${pill('warning', '1 high')}<span class="go">${icon('chevron-right', 16)}</span></div><div class="o">${icon('file-check', 16)}<span class="w"><b>${rname('replicaset-payments-api-5d8f7c9b6-api', fit)}</b><small>ExposedSecretReport · the api container</small></span>${pill('healthy', 'No critical or high')}<span class="go">${icon('chevron-right', 16)}</span></div></div>`

function workloadPanel(): string {
  return `<div class="ap"><div class="hd"><span class="kt">${icon('layers', 18)}</span><div class="who"><small>Deployment · payments · 6d old</small><b>payments-api</b><div class="st2">${pill('healthy', 'Running')}<span class="abar"><span class="btn secondary sm">${icon('arrow-up-down', 14)}Scale</span><span class="btn secondary sm">${icon('rotate-cw', 14)}Restart</span><span class="sq">${icon('pin', 14)}</span><span class="sq">${icon('ellipsis', 14)}</span></span></div></div></div><nav class="lts">${ltab('Overview', { on: true })}${ltab('Pods')}${ltab('Logs')}${ltab('Metrics')}${ltab('Map')}${ltab('Events')}${ltab('Audit')}${ltab('YAML')}</nav>
  <div class="osec" style="border-top:0"><h4>Details</h4><dl class="kv"><dt>Created</dt><dd>Oct 10, 2026, 9:12 AM (6d ago)</dd><dt>Replicas</dt><dd>3 ready of 3</dd><dt>Managed by</dt><dd>Argo CD · payments</dd><dt>Image</dt><dd class="lnk">ghcr.io/acme/payments-api:2.4.2</dd></dl></div>
  <div class="osec"><h4>Objects that point here<small>3</small></h4>${xm(3, POINT_ROWS(true), { block: true })}</div>
  <div class="osec"><h4>Containers</h4><div class="ostub">the containers, as today</div></div></div>`
}

function onLumoviFrame(): string {
  return `<section class="blk"><h2>On Lumovi’s own pages<i>what Trivy found, where the workload is: a column on its list, and a section in its detail</i></h2>
  <div class="duo"><div class="col"><p class="cap"><b>Deployments</b>, Lumovi’s own list, with its new Findings column (4), cart’s cell under the pointer.</p>${deploymentsList()}</div>
  <div class="col"><p class="cap"><b>payments-api’s detail</b>, Lumovi’s own, with its new Objects that point here (3), the first under the pointer.</p>${workloadPanel()}</div></div></section>`
}

const ON_LUMOVI_RULES = [
  '<b>Objects that point here</b> (3, LMV-350), new in a Kubernetes object’s detail, on its Overview after Details: the plugins’ objects whose view links to this one, grouped by plugin under “From the plugin Trivy 1.1.0”, each with its kind and what it’s of (“the api container”), its view’s own status as a pill, and a chevron; a row opens the object on its plugin tab. Declarative: Lumovi draws it from the file’s links and statuses, and no plugin code runs on Lumovi’s own detail. Nothing points here: the section isn’t drawn. It serves Kyverno’s policy reports, Gatekeeper’s violations and cert-manager’s certificates the same way.',
  '<b>A Findings column</b> (4, LMV-351), new on Lumovi’s workload lists, beside Managed by: a view may say its status counts against what it links to, and Lumovi shows the worst there is as its pill (“9 critical”); where two plugins say something, the worse, the other in its tooltip. Only critical and warning show; fine or none is a quiet dash, so the column is quiet unless something is wrong. Its heading is Lumovi’s own word, with the plug that marks what a plugin says; the tooltip names the plugin and its version. It sorts worst first.',
  '<b>Only what the cluster already says:</b> both read the plugin’s objects as Lumovi lists them; neither asks a scanner, runs a scan or sends anything out of the cluster. A workload with no report yet shows a dash, never “clean”.',
  '<b>On a phone</b> the column is a fact on the row’s card, “Findings” with its pill, and the section is the same list at 52 px rows (frame 4).',
]

// ─── 4. On a phone ──────────────────────────────────────────────────────────────────────────

function phones(): string {
  const wcard = (w: Workload) =>
    `<li><div class="top">${lead({ level: w.level, name: w.name, beside: w.ns, under: `${w.kind} · ${w.images} ${w.images === 1 ? 'image' : 'images'}` })}</div><dl class="wfix">${fact('Critical', `${w.sev[0]}`)}${fact('High', `${w.sev[1]}`)}${fact('Fixable', `${w.fix[0] + w.fix[1]} of ${w.sev[0] + w.sev[1]}`)}${fact('Fix first', w.first ? `<span class="mono">${w.first[0]}</span> · ${escape(w.first[1])} ${escape(w.first[2])} → ${escape(w.first[3])}` : 'No fix yet').replace('<div>', '<div class="whole">')}</dl></li>`
  const sec = phoneFrame(
    PLUGIN,
    `<nav class="lts">${TABS}</nav><div class="ptiles">${TILES()}</div><div class="sec"><h3>Vulnerabilities by workload<small>42</small><span class="tapb">${icon('download', 18)}</span></h3></div><div class="pfil"><span class="kfield ph">${icon('search', 16)}<span>Workload, image or CVE</span></span><span class="fb">${icon('sliders-horizontal', 16)}Filters</span></div><div class="sec" style="padding-top:0"><ul class="cards">${WORKLOADS.slice(0, 2).map(wcard).join('')}</ul><div class="pmore">Show all 42</div></div>`,
  )
  const lcard = (d: Dep) =>
    `<div class="lcard"><div class="top">${lead({ level: d[2][0], name: d[0], beside: d[1] })}</div><dl>${fact('Status', d[2][1])}${fact('Ready', d[3])}${fact('Findings', d[5] ? pill(...d[5]) : '—')}</dl></div>`
  const list = phoneFrame(
    'Deployments',
    `<div class="pcount">14 deployments</div>${DEPLOYMENTS.slice(0, 3).map(lcard).join('')}<div class="sec"><h3>payments-api<small>Objects that point here</small></h3>${POINT_ROWS(false, 16)}</div>`,
  )
  return `<section class="blk"><h2>On a phone<i>read, as the kit draws every page there</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${sec}${list}</div><p class="cap" style="max-width:820px">Left: the Security page, tiles two across, each table as cards, every column a fact, the long ones each on a line; its Download CSV a 44 px button at the table’s heading. Right: Lumovi’s own Deployments with Findings as a fact on each card, and a workload’s Objects that point here, the same rows at 52 px, each report’s name cut in its middle, as reports differ in their last part.</p></section>`
}

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

const KEYS = `<dl class="keys"><dt>1</dt><dd><b>Download CSV on the kit’s Table</b> (LMV-184’s fourth addition): a Table saves itself, as Lumovi’s own lists do.</dd><dt>2</dt><dd><b>Withheld fields</b> (the first): a file names fields Lumovi never shows or hands to the plugin’s code.</dd><dt>3</dt><dd><b>Objects that point here</b> (the second, LMV-350): in a Kubernetes object’s detail, the plugins’ objects that link to it.</dd><dt>4</dt><dd><b>A Findings column</b> (the third, LMV-351): a view’s status, on the workloads it links to.</dd></dl>`

export type TrivyFrame = 'trivy-security' | 'trivy-report' | 'trivy-lumovi' | 'trivy-phone'

export const TRIVY_FRAMES: { id: TrivyFrame; title: string; size: Size }[] = [
  { id: 'trivy-security', title: 'Trivy: the Security page', size: { width: 1440, height: 4330 } },
  {
    id: 'trivy-report',
    title: 'Trivy: a report, and a withheld field',
    size: { width: 1440, height: 2010 },
  },
  { id: 'trivy-lumovi', title: 'Trivy on Lumovi’s own pages', size: { width: 1440, height: 1200 } },
  { id: 'trivy-phone', title: 'Trivy on a phone', size: { width: 920, height: 1065 } },
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

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function trivyFrame(id: TrivyFrame, scheme: Scheme): string {
  const f = TRIVY_FRAMES.find((x) => x.id === id)!
  const body = {
    'trivy-security': () =>
      `<header><h1>Trivy’s Security page (LMV-349, part of LMV-184)</h1><p>What Trivy Operator already found in the cluster, on a page of the trivy-operator plugin drawn only from the kit’s parts: vulnerabilities by workload and by image, fixable first; exposed secrets without what matched; misconfigurations and RBAC; each table saved as CSV. Nothing is scanned or sent anywhere. Outlined and numbered: new in the kit; everything else is the kit as built. Words are drafts for docs.</p></header>${KEYS}${securityFrame()}${rules(SEC_RULES)}`,
    'trivy-report': () =>
      `<header><h1>Trivy: a report’s findings, and a withheld field (LMV-349)</h1><p>Where the Security page’s rows go: an image’s report, on the plugin’s own tab; and the first of the kit’s four additions, the field a file withholds, as Lumovi’s own YAML tab shows it.</p></header>${reportFrame()}${rules(REPORT_RULES)}`,
    'trivy-lumovi': () =>
      `<header><h1>Trivy on Lumovi’s own pages (LMV-350 and LMV-351)</h1><p>What Trivy found, where you already look at a workload: a Findings column on Lumovi’s workload lists, and the reports that point at a workload in its detail. Both declarative, from the plugin’s file; neither runs plugin code on Lumovi’s own pages.</p></header>${onLumoviFrame()}${rules(ON_LUMOVI_RULES)}`,
    'trivy-phone': phones,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
