/**
 * The server's Fleet page, drawn as the app would draw it, with what admins get to manage
 * clusters from it: connecting a private cluster through an agent, a cluster's settings, and
 * adding one by kubeconfig or token where the server allows it. Mockups for the design
 * (LMV-115) and the pictures in the guidelines' "Fleet page" section. It shares the clusters
 * page's parts (src/clusters.ts): its dialogs, menus, fields and checks.
 */
import { CSS as PARTS, tokens } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { document, horizontal, VARIANTS } from './logo.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

// ─── The fleet ─────────────────────────────────────────────────────────────────────────────

type Health = 'good' | 'warn' | 'critical'

/** Where a cluster comes from, as the hub knows it. */
export type Source =
  | { kind: 'argocd'; secret: string }
  | { kind: 'secret'; secret: string }
  | { kind: 'kubeconfig'; context: string }
  | { kind: 'this' }
  | { kind: 'agent'; page: boolean }
  | { kind: 'page' }

export interface FleetCluster {
  name: string
  /** A display name, set on the page. */
  title?: string
  labels: [string, string][]
  groups: string[]
  source: Source
  health: Health
  status: string
  version?: string
  latency?: number
  nodes?: [string, string, Health]
  pods?: [string, string, Health]
  workloads?: [string, string, Health]
  warnings?: [string, string]
  cpu?: number
  memory?: number
  problem?: string
}

export const FLEET: FleetCluster[] = [
  {
    name: 'production',
    title: 'Production EU',
    labels: [
      ['env', 'production'],
      ['region', 'eu-west'],
    ],
    groups: ['platform', 'sre'],
    source: { kind: 'argocd', secret: 'cluster-production' },
    health: 'warn',
    status: '1 node not ready',
    version: 'v1.34.1',
    latency: 18,
    nodes: ['5/6', '1 not ready', 'critical'],
    pods: ['214', 'All fine', 'good'],
    workloads: ['61/61', 'All available', 'good'],
    warnings: ['3', 'Last hour'],
    cpu: 41,
    memory: 52,
  },
  {
    name: 'payments',
    labels: [
      ['env', 'production'],
      ['team', 'payments'],
    ],
    groups: ['payments'],
    source: { kind: 'secret', secret: 'payments-kubeconfig' },
    health: 'good',
    status: 'Healthy',
    version: 'v1.34.1',
    latency: 24,
    nodes: ['3/3', 'All ready', 'good'],
    pods: ['96', 'All fine', 'good'],
    workloads: ['22/22', 'All available', 'good'],
    warnings: ['0', 'Last hour'],
    cpu: 33,
    memory: 47,
  },
  {
    name: 'edge-ap-south',
    labels: [
      ['env', 'production'],
      ['region', 'ap-south'],
    ],
    groups: ['platform'],
    source: { kind: 'agent', page: true },
    health: 'good',
    status: 'Healthy',
    version: 'v1.33.4',
    latency: 41,
    nodes: ['2/2', 'All ready', 'good'],
    pods: ['38', 'All fine', 'good'],
    workloads: ['9/9', 'All available', 'good'],
    warnings: ['0', 'Last hour'],
    cpu: 22,
    memory: 35,
  },
  {
    name: 'staging',
    labels: [['env', 'staging']],
    groups: [],
    source: { kind: 'kubeconfig', context: 'staging' },
    health: 'good',
    status: 'Healthy',
    version: 'v1.34.2',
    latency: 9,
    nodes: ['2/2', 'All ready', 'good'],
    pods: ['57', 'All fine', 'good'],
    workloads: ['18/18', 'All available', 'good'],
    warnings: ['1', 'Last hour'],
    cpu: 18,
    memory: 29,
  },
  {
    name: 'in-cluster',
    labels: [['env', 'tools']],
    groups: [],
    source: { kind: 'this' },
    health: 'good',
    status: 'Healthy',
    version: 'v1.34.1',
    latency: 2,
    nodes: ['3/3', 'All ready', 'good'],
    pods: ['41', 'All fine', 'good'],
    workloads: ['12/12', 'All available', 'good'],
    warnings: ['0', 'Last hour'],
    cpu: 27,
    memory: 38,
  },
  {
    name: 'lab',
    labels: [['env', 'lab']],
    groups: ['platform'],
    source: { kind: 'page' },
    health: 'critical',
    status: 'Unreachable',
    problem: 'connect ETIMEDOUT 10.60.0.4:6443',
  },
]

const find = (name: string) => FLEET.find((c) => c.name === name)!
const HUB = 'https://lumovi.example.com'
const NAMESPACE = 'lumovi'
/** Where clusters added from the page are kept: a namespace of their own (`fleet.addNamespace`). */
const CLUSTERS_NAMESPACE = `${NAMESPACE}-clusters`

/** Where a cluster comes from, in words. */
export function sourceText(s: Source): string {
  switch (s.kind) {
    case 'argocd':
      return `Argo CD’s Secret ${s.secret}`
    case 'secret':
      return `the Secret ${s.secret}`
    case 'kubeconfig':
      return `the fleet’s kubeconfig, context ${s.context}`
    case 'this':
      return 'this cluster, where Lumovi runs'
    case 'agent':
      return s.page ? 'its agent, connected from this page' : 'its agent'
    case 'page':
      return 'this page'
  }
}

// ─── Styles ────────────────────────────────────────────────────────────────────────────────

const CSS = `
.fleet { position: relative; display: flex; flex-direction: column; height: 100%; }
.fhead { display: flex; flex: none; align-items: center; gap: 4px; height: 56px; padding: 0 16px 0 24px; border-bottom: 1px solid var(--line); background: var(--app-bg); }
.fhead .logo svg { display: block; height: 26px; width: auto; }
.fhead .grow { flex: 1; }
.avatar { display: grid; width: 26px; height: 26px; margin: 0 3px; place-items: center; border-radius: 50%; background: var(--surface-3); font-size: 10px; font-weight: 600; color: var(--text-2); }
.fmain { flex: 1; min-height: 0; overflow: hidden; }
.fcontent { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 1152px; margin: 0 auto; padding: 32px 24px 48px; }
.titlerow { display: flex; align-items: flex-end; gap: 16px; }
.titlerow h1 { flex: 1; margin: 0; font-size: 30px; line-height: 1.15; font-weight: 600; font-variation-settings: 'opsz' 32; letter-spacing: -0.045em; color: var(--text-1); }
.titlerow h1 span { display: block; color: var(--text-3); }
.tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.fsearch { display: flex; width: 288px; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-3); }
.fsearch .kbd { margin-left: auto; }
.pills { display: flex; flex-wrap: wrap; gap: 4px; }
.fpill { display: flex; height: 32px; align-items: center; gap: 6px; padding: 0 12px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.fpill.on { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-strong); }
.fpill .n { opacity: 0.7; font-variant-numeric: tabular-nums; }
.tools .end { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.lchips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: -8px; color: var(--text-3); }
.lchip { display: flex; height: 24px; align-items: center; gap: 4px; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-2); }
.lchip .n { font-family: 'Inter', sans-serif; opacity: 0.7; }
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.narrow .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.card { position: relative; display: flex; min-width: 0; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.card.hover { border-color: var(--line-strong); background: var(--surface); }
.card.fresh { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: color-mix(in srgb, var(--accent) 6%, var(--surface-2)); }
.card .top { display: flex; min-width: 0; align-items: flex-start; gap: 10px; }
.sdot { flex: none; width: 8px; height: 8px; margin-top: 7px; border-radius: 50%; background: var(--d); box-shadow: 0 0 0 2px var(--surface-2); }
.sdot.pulse { opacity: 0.6; }
.card .who { flex: 1; min-width: 0; }
.card .nm { overflow: hidden; font-size: 15px; font-weight: 600; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.card .nm small { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 400; color: var(--text-3); }
.card .st { overflow: hidden; font-size: 12px; line-height: 16px; white-space: nowrap; text-overflow: ellipsis; }
.card .ver { flex: none; padding-top: 2px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 16px; color: var(--text-3); }
.card .more { display: grid; flex: none; width: 28px; height: 28px; margin: -4px -6px 0 0; place-items: center; border-radius: 8px; color: var(--text-2); }
.card .more.open { background: var(--surface-3); color: var(--text-1); }
.card .chips { display: flex; flex-wrap: wrap; gap: 4px; }
.card .chips span { padding: 2px 6px; border-radius: 6px; background: var(--surface-3); font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 16px; color: var(--text-2); }
.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.stat .l { font-size: 12px; color: var(--text-3); }
.stat .v { font-size: 17px; line-height: 24px; font-weight: 600; color: var(--text-1); font-variant-numeric: tabular-nums; }
.stat .s { display: flex; align-items: center; gap: 4px; font-size: 12px; line-height: 16px; }
.stat .s i { width: 6px; height: 6px; border-radius: 50%; background: var(--d); }
.meters { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px solid var(--line); }
.meter .row2 { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-2); }
.meter .track { height: 6px; margin-top: 6px; overflow: hidden; border-radius: 999px; background: var(--surface-3); }
.meter .track i { display: block; height: 100%; border-radius: inherit; background: var(--accent); }
.problem { display: flex; gap: 10px; padding: 10px 12px; border-radius: 8px; background: var(--surface-3); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); }
.problem svg.i { color: var(--critical-text); }
.card.pending { border: 1.5px dashed var(--line-strong); background: transparent; box-shadow: none; }
.card.pending .st { color: var(--neutral-text); }
.card.pending p { margin: 0; font-size: 12px; line-height: 18px; color: var(--text-3); }
.card.pending .buttons { display: flex; gap: 8px; margin-top: auto; }
.audit { display: flex; align-items: center; gap: 6px; margin-right: auto; font-size: 12px; color: var(--text-3); }
.source { display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.source svg.i { margin-top: 1px; }
.source .mono { font-size: 11.5px; color: var(--text-2); }
.source.set-by { color: var(--text-2); }
.form .control { min-width: 0; }
.chipsin.locked { background: var(--surface-2); }
.chipsin.locked .chip { background: transparent; border-color: var(--line); color: var(--text-2); }
.menu .item .sub { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.menu .item.tall { white-space: normal; height: auto; align-items: flex-start; padding-top: 8px; padding-bottom: 8px; }
.menu .item.tall svg.i { margin-top: 2px; }
.menu .item.off { opacity: 0.45; }
.menu .foot { display: flex; gap: 8px; margin: 4px; padding: 8px; border-radius: 8px; background: var(--surface-3); font-size: 12px; line-height: 17px; color: var(--text-2); }
.menu .foot svg.i { margin-top: 1px; color: var(--text-3); }
.menu .foot code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.waiting { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; font-size: 13px; color: var(--text-1); }
.waiting .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--neutral); box-shadow: 0 0 0 4px color-mix(in srgb, var(--neutral) 12%, transparent); }
.waiting .t { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.trust { padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.trust .top { display: flex; gap: 10px; }
.trust .top svg.i { margin-top: 2px; color: var(--accent-strong); }
.trust h4 { margin: 0; font-size: 13px; line-height: 20px; font-weight: 600; }
.trust p { margin: 2px 0 0; font-size: 12px; line-height: 18px; color: var(--text-2); }
.trust .command, .trust .field { margin-left: 26px; }
.trust .field { margin-top: 8px; }
.typed { font-family: 'JetBrains Mono', monospace; }
.dots { letter-spacing: 2px; }
`

// ─── Parts ─────────────────────────────────────────────────────────────────────────────────

const kbd = (k: string) => `<span class="kbd">${k}</span>`
const HEALTH: Record<Health, string> = {
  good: 'var(--good)',
  warn: 'var(--warn)',
  critical: 'var(--critical)',
}
const HEALTH_TEXT: Record<Health, string> = {
  good: 'var(--good-text)',
  warn: 'var(--warn-text)',
  critical: 'var(--critical-text)',
}

function logo(scheme: Scheme): string {
  const variant = VARIANTS.find((v) => v.name === `on-${scheme}`)!
  return document(horizontal(variant), 26)
}

const GITHUB = `<svg class="i" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`

interface CardOptions {
  hover?: boolean
  menu?: boolean
  admin?: boolean
  fresh?: boolean
}

/** A cluster's card, as the Fleet page has it, with an admin's ⋯ on hover. */
export function card(c: FleetCluster, o: CardOptions = {}): string {
  const stat = (label: string, [v, s, h]: [string, string, Health]) =>
    `<div class="stat"><div class="l">${label}</div><div class="v">${v}</div><div class="s" style="color:${HEALTH_TEXT[h]}"><i style="--d:${HEALTH[h]}"></i>${s}</div></div>`
  const body = c.problem
    ? `<div class="problem">${icon('unplug', 16)}<span>${escape(c.problem)}</span></div>`
    : `<div class="stats">${stat('Nodes', c.nodes!)}${stat('Pods running', c.pods!)}${stat('Workloads', c.workloads!)}<div class="stat"><div class="l">Warnings</div><div class="v">${c.warnings![0]}</div><div class="s" style="color:var(--text-3)">${c.warnings![1]}</div></div></div>
      <div class="meters">${(
        [
          ['CPU', c.cpu!],
          ['Memory', c.memory!],
        ] as const
      )
        .map(
          ([l, v]) =>
            `<div class="meter"><div class="row2"><span>${l}</span><span>${v}%</span></div><div class="track"><i style="width:${v}%"></i></div></div>`,
        )
        .join('')}</div>`
  return `<div class="card${o.hover || o.menu ? ' hover' : ''}${o.fresh ? ' fresh' : ''}">
    <div class="top">
      <span class="sdot" style="--d:${HEALTH[c.health]}"></span>
      <div class="who"><div class="nm">${escape(c.title ?? c.name)}${c.title ? `<small>${escape(c.name)}</small>` : ''}</div><div class="st" style="color:${HEALTH_TEXT[c.health]}">${escape(c.status)}</div></div>
      ${c.version ? `<span class="ver">${c.version}<br>${c.latency} ms</span>` : ''}
      ${o.admin && (o.hover || o.menu) ? `<span class="more${o.menu ? ' open' : ''}">${icon('ellipsis', 16)}</span>` : ''}
    </div>
    <div class="chips">${c.labels.map(([k, v]) => `<span>${k}=${v}</span>`).join('')}</div>
    ${body}
  </div>`
}

function pendingCard(): string {
  return `<div class="card pending">
    <div class="top"><span class="sdot pulse" style="--d:var(--neutral)"></span><div class="who"><div class="nm">edge-ap-south</div><div class="st">Waiting for its agent</div></div></div>
    <div class="chips"><span>env=production</span><span>region=ap-south</span></div>
    <p>The command to connect it works until 15:42. Run it in the cluster, and its card fills in.</p>
    <div class="buttons"><span class="btn secondary sm">${icon('terminal', 14)}Show the command</span><span class="btn ghost sm">Cancel it</span></div>
  </div>`
}

// ─── The page ──────────────────────────────────────────────────────────────────────────────

export type FleetState =
  | 'fleet'
  | 'viewer'
  | 'card-menu'
  | 'add-menu'
  | 'add-menu-off'
  | 'connect-form'
  | 'connect-command'
  | 'pending'
  | 'connect-connected'
  | 'connect-expired'
  | 'connect-used'
  | 'settings-managed'
  | 'settings-page'
  | 'remove'
  | 'add-kubeconfig'
  | 'add-token'
  | 'add-refused'
  | 'add-done'

export const FLEET_STATES: { state: FleetState; title: string; note: string }[] = [
  { state: 'fleet', title: 'The Fleet page, for an admin', note: 'Add cluster, and ⋯ on a card.' },
  { state: 'viewer', title: 'For everyone else', note: 'Nothing to click: as today.' },
  { state: 'card-menu', title: 'A cluster’s actions', note: 'Settings, and Remove where it can.' },
  { state: 'add-menu', title: 'Add cluster', note: 'An agent, a kubeconfig or a token.' },
  { state: 'add-menu-off', title: 'Where adding is off', note: 'Only the agent, and why.' },
  { state: 'connect-form', title: 'Connect a cluster', note: 'Its name, labels and groups.' },
  { state: 'connect-command', title: 'The command', note: 'One token, once, for an hour.' },
  { state: 'pending', title: 'Waiting, on the page', note: 'A card that waits for its agent.' },
  { state: 'connect-connected', title: 'Connected', note: 'And one more check: its CA.' },
  { state: 'connect-expired', title: 'An expired command', note: 'A new one, in one click.' },
  { state: 'connect-used', title: 'A used token', note: 'It works once.' },
  {
    state: 'settings-managed',
    title: 'Settings its source sets',
    note: 'Shown, with where to change them.',
  },
  { state: 'settings-page', title: 'Settings set here', note: 'All of them, and Remove.' },
  { state: 'remove', title: 'Removing a cluster', note: 'Typed, and what’s left to do.' },
  { state: 'add-kubeconfig', title: 'Add by kubeconfig', note: 'Kept as a Secret.' },
  { state: 'add-token', title: 'Add by token', note: 'A server, a token, its CA.' },
  { state: 'add-refused', title: 'A credential plugin', note: 'Refused, with what to do instead.' },
  { state: 'add-done', title: 'Checked', note: 'Name it, and who sees it.' },
]

export interface Size {
  width: number
  height: number
}

/** The Fleet page in one state, as a page `size` big. */
export function fleetPage(state: FleetState, scheme: Scheme, size: Size): string {
  const admin = state !== 'viewer'
  const narrow = size.width < 1200
  const shown = state === 'viewer' ? FLEET.filter((c) => c.groups.includes('platform')) : FLEET
  const attention = shown.filter((c) => c.health !== 'good').length
  const cards = shown
    .map((c) =>
      card(c, {
        admin,
        hover: state === 'fleet' && c.name === 'edge-ap-south',
        menu: state === 'card-menu' && c.name === 'edge-ap-south',
        fresh: state === 'connect-connected' && c.name === 'edge-ap-south',
      }),
    )
    .join('')
  const grid =
    state === 'pending'
      ? shown
          .filter((c) => c.name !== 'edge-ap-south')
          .map((c) => card(c, { admin }))
          .join('') + pendingCard()
      : cards
  const count = state === 'pending' ? shown.length - 1 : shown.length
  const addOpen = state === 'add-menu' || state === 'add-menu-off'
  const body = `<div class="fleet${narrow ? ' narrow' : ''}">
  <div class="fhead"><span class="logo">${logo(scheme)}</span><span class="grow"></span><span class="icon-btn">${icon('monitor', 16)}</span><span class="icon-btn">${icon('sparkles', 16)}</span><span class="avatar">${admin ? 'PK' : 'JA'}</span><span class="icon-btn">${GITHUB}</span></div>
  <div class="fmain"><div class="fcontent">
    <div class="titlerow">
      <h1>${count} clusters<span>${attention ? `${attention} need${attention === 1 ? 's' : ''} attention` : 'All healthy'}</span></h1>
      ${admin ? `<span class="btn secondary${addOpen ? ' on-open' : ''}" style="${addOpen ? 'background:var(--surface-3)' : ''}">${icon('plus', 16)}Add cluster${icon('chevron-down', 14)}</span>` : ''}
    </div>
    <div class="tools">
      <span class="fsearch">${icon('search', 14)}Search clusters and labels…${kbd('/')}</span>
      <span class="pills"><span class="fpill on">All<span class="n">${count}</span></span><span class="fpill">Needs attention<span class="n">${attention}</span></span><span class="fpill">Healthy<span class="n">${shown.filter((c) => c.health === 'good').length}</span></span></span>
      <span class="end"><span class="btn ghost sm">${icon('layers', 14)}Group by${icon('chevron-down', 14)}</span><span class="btn ghost sm">${icon('package-search', 14)}Find a workload</span></span>
    </div>
    <div class="lchips">${icon('tag', 14)}${labelCounts(shown)
      .map(([l, n]) => `<span class="lchip">${l}<span class="n">${n}</span></span>`)
      .join('')}</div>
    <div class="cards">${grid}</div>
  </div></div>
  ${overlay(state, size, narrow)}
</div>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${size.width}px; height: ${size.height}px; }
${PARTS}
${CSS}
</style>${body}`
}

function labelCounts(list: FleetCluster[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const c of list)
    for (const [k, v] of c.labels) counts.set(`${k}=${v}`, (counts.get(`${k}=${v}`) ?? 0) + 1)
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
}

// ─── Over the page ─────────────────────────────────────────────────────────────────────────

/** The content's right edge, where the Add cluster button ends. */
const contentRight = (size: Size) => Math.min(size.width, (size.width + 1152) / 2) - 24

function overlay(state: FleetState, size: Size, narrow: boolean): string {
  const right = size.width - contentRight(size)
  switch (state) {
    case 'add-menu':
    case 'add-menu-off':
      return addMenu(state === 'add-menu-off', right)
    case 'card-menu': {
      // edge-ap-south is the third card: the last column, or the first of the second row.
      const column = (size.width - 48 - Math.max(0, size.width - 1152)) / (narrow ? 2 : 3)
      const left = narrow
        ? (size.width - Math.min(size.width, 1152)) / 2 + 24 + column - 260 - 6
        : contentRight(size) - 262
      const top = narrow
        ? 56 + 32 + 70 + 24 + 32 + 24 + 16 + 24 + 300 + 12 + 46
        : 56 + 32 + 70 + 24 + 32 + 24 + 16 + 24 + 46
      return `<div class="menu" style="left:${left}px;top:${top}px;width:250px">
        <div class="item">${icon('arrow-right', 16)}Open</div>
        <div class="item hl">${icon('settings-2', 16)}Settings…</div>
        <div class="item">${icon('copy', 16)}Copy its name</div>
        <div class="sep"></div>
        <div class="item danger">${icon('trash-2', 16)}Remove from the fleet…</div>
      </div>`
    }
    case 'connect-form':
    case 'connect-command':
    case 'connect-connected':
    case 'connect-expired':
    case 'connect-used':
      return `<div class="scrim"></div>${connectDialog(state, size)}`
    case 'settings-managed':
    case 'settings-page':
      return `<div class="scrim"></div>${settingsDialog(state, size)}`
    case 'remove':
      return `<div class="scrim"></div>${removeDialog(size)}`
    case 'add-kubeconfig':
    case 'add-token':
    case 'add-refused':
    case 'add-done':
      return `<div class="scrim"></div>${addDialog(state, size)}`
    default:
      return ''
  }
}

function addMenu(off: boolean, right: number): string {
  const item = (glyph: IconName, title: string, sub: string, extra = '') =>
    `<div class="item tall${extra}">${icon(glyph, 16)}<span><span>${title}</span><span class="sub">${sub}</span></span></div>`
  return `<div class="menu" style="right:${right}px;top:${56 + 32 + 74}px;width:320px">
    ${item('cable', 'Connect with an agent…', 'For a cluster this server can’t reach. Its agent dials out.', ' hl')}
    <div class="sep"></div>
    ${item('clipboard-paste', 'Paste a kubeconfig…', `Kept as a Secret in ${CLUSTERS_NAMESPACE}.`, off ? ' off' : '')}
    ${item('key-round', 'Use a token…', 'A server’s address, a token and its CA.', off ? ' off' : '')}
    ${off ? `<div class="foot">${icon('lock', 14)}<span>Adding by kubeconfig or token is off on this server. It’s turned on with the Helm value <code>fleet.addFromPage</code>.</span></div>` : ''}
  </div>`
}

const check = (kind: 'ok' | 'bad' | 'ask' | 'wait' | 'todo', t: string, d = '', h = '') => {
  const glyph: Record<string, IconName> = {
    ok: 'circle-check',
    bad: 'circle-x',
    ask: 'circle-alert',
    wait: 'loader-circle',
    todo: 'circle-dashed',
  }
  return `<div class="check ${kind}">${icon(glyph[kind]!, 16)}<div style="min-width:0"><div class="t">${t}</div>${d ? `<div class="d">${d}</div>` : ''}${h ? `<div class="h">${h}</div>` : ''}</div></div>`
}

const chips = (list: string[], locked = false, ph = '') =>
  `<span class="field chipsin${locked ? ' locked' : ''}">${list.map((g) => `<span class="chip">${escape(g)}${locked ? '' : icon('x', 12)}</span>`).join('')}${ph ? `<span class="ph">${ph}</span>` : ''}</span>`

const AUDIT = `<span class="audit">${icon('scroll-text', 14)}Recorded in the audit log</span>`

const COMMAND = [
  `helm install lumovi-agent oci://ghcr.io/lumovi/charts/lumovi \\`,
  `  --namespace ${NAMESPACE} --create-namespace \\`,
  `  --set mode=agent --set clusterName=edge-ap-south \\`,
  `  --set agent.hubUrl=${HUB} \\`,
  `  --set agent.joinToken=lmvj_7Hq2xK9wPz4mR8tN3vB6cY1d`,
].join('\n')

function connectDialog(state: FleetState, size: Size): string {
  const top = Math.round(size.height * 0.08)
  let head = `<div class="glyph">${icon('cable', 18)}</div><div style="min-width:0"><h3>Connect a cluster</h3><div class="sub">Through an agent that dials out to this server: the cluster opens no port.</div></div>`
  let body = ''
  let actions = ''
  const commandBox = (dim = false) =>
    `<div class="command"${dim ? ' style="opacity:0.5"' : ''}><div class="label">Run it where kubectl reaches the cluster${icon('copy', 14)}</div><code>${escape(COMMAND)}</code></div>`
  switch (state) {
    case 'connect-form':
      body = `<div class="form">
          <span class="lbl mid">Name</span><span class="field focus typed" style="gap:0">edge-ap-south<span class="caret" style="height:16px;margin:0 0 0 1px"></span></span>
          <span class="lbl">Labels</span><span class="control">${chips(['env=production', 'region=ap-south'], false, 'Add a label…')}</span>
          <span class="lbl">Groups</span><span class="control">${chips(['platform'], false, 'Add a group…')}<div class="field-help">Who sees it, besides admins: with none, everyone signed in.</div></span>
        </div>
        <p class="help">Nobody pastes the cluster’s credentials here: the agent uses its own service account, inside the cluster.</p>`
      actions = `${AUDIT}<span class="btn ghost">Cancel</span><span class="btn primary">Create the command</span>`
      break
    case 'connect-command':
      body = `${commandBox()}
        <p class="help">Its token works once, until 15:42, and isn’t shown again. Closing this keeps it waiting on the page.</p>
        <div class="waiting"><span class="pulse"></span>Waiting for edge-ap-south to connect…<span class="t">0:42</span></div>`
      actions = `${AUDIT}<span class="btn ghost">Cancel the command</span><span class="btn secondary">Close</span>`
      break
    case 'connect-connected':
      head = `<div class="glyph good">${icon('circle-check', 18)}</div><div style="min-width:0"><h3>edge-ap-south is connected</h3><div class="sub">Its card is on the page, for admins and the platform group.</div></div>`
      body = `<div class="checks">${check('ok', 'Its agent connected', 'from 10.4.0.12, at 14:02 · the token is used')}${check('ok', 'Lumovi reaches its API through it', 'v1.33.4 · 41 ms')}</div>
        <div class="trust"><div class="top">${icon('shield-check', 16)}<div><h4>Make sure it’s your cluster</h4><p>The agent sent its cluster’s certificate authority, and Lumovi trusts it for now. Run this in the cluster, and paste what it prints, to check it’s the one you meant.</p></div></div>
          <div class="command"><div class="label">In edge-ap-south${icon('copy', 14)}</div><code>kubectl get configmap kube-root-ca.crt -n default -o jsonpath='{.data.ca\\.crt}' | openssl x509 -noout -fingerprint -sha256</code></div>
          <span class="field mono"><span class="ph">SHA256 Fingerprint=…</span></span></div>`
      actions = `${AUDIT}<span class="btn ghost">Later</span><span class="btn primary">Check it</span>`
      break
    case 'connect-expired':
      body = `${commandBox(true)}${check('bad', 'This command expired at 15:42, unused', '', 'Nothing connected with it, and it can’t be used now. A new one takes a click.')}`
      actions = `${AUDIT}<span class="btn ghost">Close</span><span class="btn primary">${icon('rotate-cw', 16)}Create a new command</span>`
      break
    case 'connect-used':
      body = `${commandBox(true)}${check('bad', 'This token was used already', 'edge-ap-south connected with it at 14:02', 'At 14:09 another agent tried it, and was refused: a token works once. To connect another cluster, create a new command.')}`
      actions = `${AUDIT}<span class="btn ghost">Close</span><span class="btn primary">${icon('plus', 16)}Connect another cluster</span>`
      break
  }
  return `<div class="dialog" style="top:${top}px;width:600px">
    <div class="head">${head}<span class="icon-btn x">${icon('x', 16)}</span></div>
    <div class="body">${body}</div>
    <div class="actions">${actions}</div>
  </div>`
}

/** Where a field's value comes from: the cluster's source, which manages it, or this page. */
function source(kind: 'managed' | 'here', where = ''): string {
  return kind === 'managed'
    ? `<div class="source set-by">${icon('lock', 12, 2.25)}<span>Set by ${where}. Change it there.</span></div>`
    : `<div class="source">${icon('pencil', 12)}<span>Set on this page.</span></div>`
}

function settingsDialog(state: FleetState, size: Size): string {
  const managed = state === 'settings-managed'
  const c = find(managed ? 'production' : 'edge-ap-south')
  const top = Math.round(size.height * 0.06)
  const secret = `<span class="mono">argocd/cluster-production</span>`
  const form = managed
    ? `<span class="lbl mid" style="align-self:start;padding-top:6px">Name</span><span class="control"><span class="field">Production EU</span>${source('here')}</span>
       <span class="lbl" >Labels</span><span class="control">${chips(['env=production', 'region=eu-west'], true)}${source('managed', `its Secret, ${secret}, in <span class="mono">lumovi.dev/labels</span>`)}</span>
       <span class="lbl">Groups</span><span class="control">${chips(['platform', 'sre'], false, 'Add a group…')}${source('here')}<div class="field-help">Who sees it, besides admins. A change applies at once.</div></span>`
    : `<span class="lbl mid" style="align-self:start;padding-top:6px">Name</span><span class="control"><span class="field typed">edge-ap-south</span>${source('here')}</span>
       <span class="lbl">Labels</span><span class="control">${chips(['env=production', 'region=ap-south'], false, 'Add a label…')}${source('here')}</span>
       <span class="lbl">Groups</span><span class="control">${chips(['platform'], false, 'Add a group…')}${source('here')}<div class="field-help">Who sees it, besides admins. A change applies at once.</div></span>`
  const connection = managed
    ? `<div class="conn"><div class="label">Comes from<span class="src">Argo CD</span></div><p style="margin-top:6px">Argo CD’s Secret ${secret}, in the <span class="mono">argocd</span> namespace. What it sets is shown, not changed, here; it can’t be removed from this page.</p></div>`
    : `<div class="conn"><div class="label">Comes from<span class="src">Its agent</span></div><dl><dt>Connected</dt><dd>from this page, 8 October, 14:02</dd><dt>Certificate</dt><dd>SHA-256 checked · 3F:9A:…:C2:71</dd></dl></div>`
  return `<div class="dialog" style="top:${top}px;width:600px">
    <div class="head"><div class="glyph">${icon('settings-2', 18)}</div><div style="min-width:0"><h3>${escape(c.title ?? c.name)}</h3><div class="sub">Comes from ${escape(sourceText(c.source))}</div></div><span class="icon-btn x">${icon('x', 16)}</span></div>
    <div class="body"><div class="form">${form}${connection}</div></div>
    <div class="actions">${managed ? AUDIT : `<span class="btn danger-ghost first">${icon('trash-2', 16)}Remove from the fleet…</span>`}<span class="btn ghost">Cancel</span><span class="btn primary">Save</span></div>
  </div>`
}

function removeDialog(size: Size): string {
  const top = Math.round(size.height * 0.12)
  return `<div class="dialog" style="top:${top}px;width:480px">
    <div class="head"><div class="glyph" style="background:color-mix(in srgb, var(--critical) 10%, transparent);color:var(--critical-text)">${icon('trash-2', 18)}</div><div style="min-width:0"><h3>Remove edge-ap-south?</h3><div class="sub">From the fleet · <span style="font-weight:500;color:var(--text-2)">edge-ap-south</span> <span class="prod">Production</span></div></div></div>
    <div class="body">
      <p class="help" style="font-size:13px;line-height:21px;color:var(--text-2)">People stop seeing it, and its agent’s token stops working at once. The agent keeps running in the cluster until you uninstall it there:</p>
      <div class="command"><div class="label">In edge-ap-south${icon('copy', 14)}</div><code>helm uninstall lumovi-agent --namespace ${NAMESPACE}</code></div>
      <div><div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:12px;color:var(--text-2)">${icon('triangle-alert', 14, 2, 'color:var(--critical-text)')}Type <b style="font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--text-1)">edge-ap-south</b> to confirm</div><span class="field mono" style="gap:0;height:36px;border-color:var(--critical);box-shadow:0 0 0 3px color-mix(in srgb, var(--critical) 15%, transparent)">edge-ap-<span class="caret" style="height:16px;margin:0"></span></span></div>
    </div>
    <div class="actions">${AUDIT}<span class="btn ghost">Cancel</span><span class="btn primary off" style="background:var(--critical)">Remove</span></div>
  </div>`
}

const KUBECONFIG = [
  ['k', 'apiVersion', 'v1'],
  ['k', 'kind', 'Config'],
  ['k', 'clusters', ''],
  ['-k', 'name', 'lab'],
  ['  k', 'cluster', ''],
  ['    k', 'server', 'https://10.60.0.4:6443'],
  ['    k', 'certificate-authority-data', 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM…'],
  ['k', 'users', ''],
  ['-k', 'name', 'lumovi-reader'],
  ['  k', 'user', ''],
  ['    k', 'token', 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkY0…'],
]

function editor(): string {
  return `<div class="editor focus">${KUBECONFIG.map(([indent, key, value], i) => {
    const pad = indent!.replace(/[a-z]/g, '').replace('-', '- ')
    return `<span class="ln">${i + 1}</span>${pad}<span class="k">${key}</span>:${value ? ` <span class="s">${escape(value)}</span>` : ''}`
  }).join('\n')}</div>`
}

function addDialog(state: FleetState, size: Size): string {
  const top = Math.round(size.height * 0.08)
  const head = `<div class="glyph">${icon('plus', 18)}</div><div style="min-width:0"><h3>Add a cluster</h3><div class="sub">Lumovi keeps it as a Secret in ${CLUSTERS_NAMESPACE}, labelled lumovi.dev/cluster.</div></div>`
  const tabs = (on: 'kubeconfig' | 'token') =>
    `<div class="seg"><span${on === 'kubeconfig' ? ' class="on"' : ''}>${icon('clipboard-paste', 14)}A kubeconfig</span><span${on === 'token' ? ' class="on"' : ''}>${icon('key-round', 14)}A token</span></div>`
  let body = ''
  let actions = ''
  switch (state) {
    case 'add-kubeconfig':
      body = `${tabs('kubeconfig')}${editor()}<p class="help">One context, with a token or a client certificate. Credential plugins can’t run on this server.</p>`
      actions = `${AUDIT}<span class="btn ghost">Cancel</span><span class="btn primary">Check it</span>`
      break
    case 'add-token':
      body = `${tabs('token')}<div class="form">
          <span class="lbl mid">Server</span><span class="field mono">https://10.60.0.4:6443</span>
          <span class="lbl mid">Token</span><span class="field focus mono dots" style="gap:0">••••••••••••••••••••••••<span class="caret" style="height:16px;margin:0 0 0 1px"></span></span>
          <span class="lbl">Its CA</span><span class="control"><span class="field" style="height:64px;align-items:flex-start;padding-top:6px"><span class="ph mono" style="font-size:12px">-----BEGIN CERTIFICATE-----</span></span><div class="field-help">The certificate authority its server presents, as PEM. Lumovi checks the server against it.</div></span>
        </div>`
      actions = `${AUDIT}<span class="btn ghost">Cancel</span><span class="btn primary off">Check it</span>`
      break
    case 'add-refused':
      body = `<div class="summary">${icon('clipboard-paste', 14)}<span>Pasted · 1 context, <span class="mono" style="font-size:12px;color:var(--text-1)">payments-prod-us</span></span><span class="edit">Edit</span></div>
        <div class="checks">${check('ok', 'It reads as a kubeconfig', 'payments-prod-us · user payments-admin')}${check('bad', 'It signs in by running a program', 'aws eks get-token --cluster-name payments-prod --region us-east-1', 'This server can’t run programs, so it can’t use this kubeconfig. Use a token instead, such as a service account’s, or connect the cluster with an agent.')}</div>`
      actions = `<span class="btn ghost first">Cancel</span><span class="btn secondary">${icon('key-round', 16)}Use a token</span><span class="btn primary">${icon('cable', 16)}Connect with an agent</span>`
      break
    case 'add-done':
      body = `<div class="checks">${check('ok', 'It reads as a kubeconfig', 'lab · user lumovi-reader')}${check('ok', 'The server answers', '10.60.0.4:6443 · v1.33.2 · 12 ms')}${check('ok', 'The credentials work', 'Signed in as system:serviceaccount:lumovi:reader · can list namespaces')}</div>
        <div class="form">
          <span class="lbl mid">Name</span><span class="field focus typed" style="gap:0">lab<span class="caret" style="height:16px;margin:0 0 0 1px"></span></span>
          <span class="lbl">Labels</span><span class="control">${chips(['env=lab'], false, 'Add a label…')}</span>
          <span class="lbl">Groups</span><span class="control">${chips(['platform'], false, 'Add a group…')}<div class="field-help">Who sees it, besides admins.</div></span>
        </div>`
      actions = `${AUDIT}<span class="btn ghost">Cancel</span><span class="btn primary">Add to the fleet</span>`
      break
  }
  return `<div class="dialog" style="top:${top}px;width:600px">
    <div class="head">${head}<span class="icon-btn x">${icon('x', 16)}</span></div>
    <div class="body">${body}</div>
    <div class="actions">${actions}</div>
  </div>`
}
