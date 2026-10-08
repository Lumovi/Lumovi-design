/**
 * The desktop app's clusters page (its start screen), drawn as the app would draw it: the list,
 * the kubeconfig files, adding a cluster, a cluster's settings, and an organization's lock.
 * Mockups for the design (LMV-114) and the pictures in the guidelines' "Clusters page" section;
 * the classes they stand for are in the guidelines' build table.
 */
import { series, status, themes, type Scheme } from './colors.ts'
import { document, horizontal, VARIANTS } from './logo.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

// ─── The clusters ──────────────────────────────────────────────────────────────────────────

export interface Cluster {
  /** The context's name in the kubeconfig. */
  context: string
  /** A display name, set in Lumovi. */
  name?: string
  /** A data color, 1 to 8 (`--series-n`), set in Lumovi. */
  color?: number
  group?: string
  labels?: [string, string][]
  host: string
  user: string
  version?: string
  latency?: number
  /** What the check found, if not the version. */
  problem?: 'checking' | 'unreachable' | 'auth'
  production?: boolean
  readOnly?: boolean
  /** The kubeconfig's current context. */
  current?: boolean
  hidden?: boolean
  /** Added in Lumovi: kept in its own folder, not in a kubeconfig. */
  added?: boolean
}

const EKS = (region: string, name: string) => `arn:aws:eks:${region}:123456789012:cluster/${name}`

export const CLUSTERS: Cluster[] = [
  {
    context: EKS('eu-west-1', 'payments-prod'),
    name: 'Payments EU',
    color: 2,
    group: 'Payments',
    labels: [
      ['env', 'production'],
      ['region', 'eu-west-1'],
    ],
    host: '4F1C2B9A.gr7.eu-west-1.eks.amazonaws.com',
    user: 'payments-admin',
    version: 'v1.34.1',
    latency: 18,
    production: true,
  },
  {
    context: 'payments-prod-us',
    name: 'Payments US',
    color: 2,
    group: 'Payments',
    labels: [
      ['env', 'production'],
      ['region', 'us-east-1'],
    ],
    host: '9A2E7D41.yl4.us-east-1.eks.amazonaws.com',
    user: 'payments-admin',
    version: 'v1.34.1',
    latency: 96,
    production: true,
    readOnly: true,
    added: true,
  },
  {
    context: 'payments-staging',
    name: 'Payments staging',
    color: 4,
    group: 'Payments',
    labels: [
      ['env', 'staging'],
      ['region', 'eu-west-1'],
    ],
    host: '10.20.0.12:6443',
    user: 'developer',
    version: 'v1.34.2',
    latency: 22,
  },
  {
    context: 'gke_example-platform_europe-west1_tools',
    name: 'Platform tools',
    color: 7,
    group: 'Platform',
    labels: [['env', 'tools']],
    host: '34.76.120.8',
    user: 'platform-sre',
    version: 'v1.33.4',
    latency: 31,
  },
  {
    context: 'gke_example-platform_europe-west1_ci',
    name: 'CI runners',
    color: 3,
    group: 'Platform',
    labels: [['env', 'ci']],
    host: '34.140.9.211',
    user: 'platform-sre',
    problem: 'auth',
  },
  {
    context: 'kind-lumovi',
    host: '127.0.0.1:52811',
    user: 'kind-lumovi',
    version: 'v1.34.0',
    latency: 2,
    current: true,
  },
  {
    context: 'minikube',
    host: '192.168.49.2:8443',
    user: 'minikube',
    problem: 'unreachable',
  },
  {
    context: 'docker-desktop',
    host: '127.0.0.1:6443',
    user: 'docker-desktop',
    version: 'v1.32.2',
    latency: 4,
    hidden: true,
  },
  {
    context: 'old-staging',
    host: '10.20.4.7:6443',
    user: 'developer',
    problem: 'unreachable',
    hidden: true,
  },
]

const RECENT = ['Payments EU', 'kind-lumovi', 'Payments staging']

/** The name a cluster goes by in Lumovi. */
export const title = (c: Cluster) => c.name ?? c.context

/** One or two letters for its tile: the display name's words, or the context's first letter. */
export function initials(c: Cluster): string {
  if (!c.name) return c.context[0]!.toUpperCase()
  const words = c.name.split(/\s+/).filter((w) => /^[A-Za-z0-9]/.test(w))
  return (words.length > 1 ? words[0]![0]! + words[1]![0]! : words[0]!.slice(0, 2)).toUpperCase()
}

const find = (name: string) => CLUSTERS.find((c) => title(c) === name)!

/** A long context name, cut in the middle so both its start and its end show. */
export function middle(text: string, max = 46): string {
  if (text.length <= max) return text
  const head = Math.ceil((max - 1) * 0.42)
  return `${text.slice(0, head)}…${text.slice(text.length - (max - 1 - head))}`
}

// ─── Tokens ────────────────────────────────────────────────────────────────────────────────

/** The app's tokens for one theme, as custom properties: semantic, status and data colors. */
export function tokens(scheme: Scheme): string {
  const t: Record<string, string> = { ...themes[scheme] }
  const s = status[scheme]
  Object.assign(t, { good: s.good, warn: s.warn, critical: s.critical, neutral: s.neutral })
  series[scheme].forEach((c, i) => (t[`series-${i + 1}`] = c))
  t['series-other'] = series.other[scheme]
  t['shadow-panel'] =
    scheme === 'dark'
      ? '0 0 0 1px rgb(255 255 255 / 0.02), 0 8px 24px -12px rgb(0 0 0 / 0.6)'
      : '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.12)'
  t['shadow-pop'] =
    scheme === 'dark'
      ? '0 16px 48px -8px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(255 255 255 / 0.08)'
      : '0 12px 40px -8px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(0 0 0 / 0.06)'
  // A tile's tint, and its letters: the cluster's color, faint behind and deep in front.
  t['tile-tint'] = scheme === 'dark' ? '22%' : '16%'
  t['tile-ink'] = scheme === 'dark' ? 'white 30%' : 'black 28%'
  return Object.entries(t)
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ')
}

// ─── Styles: the app's Tailwind classes, written out ───────────────────────────────────────

export const CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; }
body { position: relative; overflow: hidden; background: var(--app-bg); color: var(--text-1); font-family: 'Inter', system-ui, sans-serif; font-size: 13px; line-height: 20px; -webkit-font-smoothing: antialiased; font-feature-settings: 'cv11', 'ss01'; }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
svg.i { display: block; flex: none; }
.window { position: relative; display: flex; flex-direction: column; height: 100%; }
.titlebar { height: 52px; flex: none; }
main { position: relative; display: flex; flex: 1; min-height: 0; flex-direction: column; align-items: center; padding: 0 32px 24px; }
.column { display: flex; flex: 1; min-height: 0; width: 100%; max-width: 720px; flex-direction: column; }
header.top { display: flex; flex-direction: column; align-items: center; margin: 24px 0 32px; text-align: center; flex: none; }
header.top .logo svg { display: block; height: 36px; width: auto; }
header.top p { margin: 20px 0 0; font-size: 14px; color: var(--text-2); }
.short header.top { margin: 0 0 20px; }
.short header.top .logo svg { height: 28px; }
.short header.top p { margin-top: 16px; }

/* The picker: a cmdk list in a panel. */
.picker { display: flex; min-height: 0; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 16px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.bar { display: flex; flex: none; align-items: center; gap: 10px; height: 48px; padding: 0 10px 0 16px; border-bottom: 1px solid var(--line); }
.bar .search { color: var(--text-3); }
.bar .input { flex: 1; min-width: 0; font-size: 14px; color: var(--text-1); white-space: nowrap; }
.bar .input .ph { color: var(--text-3); }
.caret { display: inline-block; width: 1px; height: 17px; margin: 0 0 -3px 1px; background: var(--text-1); }
.count { font-size: 12px; color: var(--text-3); font-variant-numeric: tabular-nums; white-space: nowrap; }
.divider { width: 1px; height: 20px; background: var(--line); margin: 0 2px; }
.list { flex: 1; min-height: 0; overflow: hidden; padding: 6px; }
.list.end { display: flex; flex-direction: column; justify-content: flex-end; }
.list.end > * { flex: none; }
.heading { display: flex; align-items: baseline; gap: 6px; padding: 8px 10px 4px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.heading .n { font-weight: 400; letter-spacing: 0; opacity: 0.75; font-variant-numeric: tabular-nums; }
.heading.label { text-transform: none; letter-spacing: 0; font-family: 'JetBrains Mono', monospace; }
.row { --row-bg: var(--surface-2); position: relative; display: flex; align-items: center; gap: 14px; padding: 10px 12px; border-radius: 12px; background: var(--row-bg); }
.row.sel { --row-bg: var(--surface-3); }
.row.hid { opacity: 0.55; }
.row.new { --row-bg: var(--accent-soft); }
.tile { position: relative; display: grid; flex: none; width: 32px; height: 32px; place-items: center; border-radius: 9px; font-size: 12px; font-weight: 600; letter-spacing: 0.01em; background: color-mix(in srgb, var(--c) var(--tile-tint), transparent); color: color-mix(in srgb, var(--c), var(--tile-ink)); }
.tile.plain { background: var(--surface-3); color: var(--text-2); box-shadow: inset 0 0 0 1px var(--line); }
.row.sel .tile.plain { background: var(--surface-2); }
.tile .dot { position: absolute; right: -3px; bottom: -3px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--row-bg); background: var(--d); }
.tile.big { width: 36px; height: 36px; border-radius: 12px; font-size: 13px; }
.row.compact { gap: 12px; padding: 8px 12px; }
.row.compact .tile { width: 24px; height: 24px; border-radius: 7px; font-size: 10px; }
.row.compact .tile .dot { width: 10px; height: 10px; right: -3px; bottom: -3px; }
.what { flex: 1; min-width: 0; }
.what .top { display: flex; align-items: center; gap: 8px; min-width: 0; }
.what .name { overflow: hidden; font-size: 13.5px; font-weight: 500; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.what .sub { display: block; margin-top: 2px; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.prod { flex: none; padding: 1px 6px; border-radius: 4px; background: color-mix(in srgb, var(--critical) 10%, transparent); font-size: 11px; line-height: 16px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--critical-text); }
.pill { flex: none; padding: 1px 6px; border-radius: 999px; background: var(--surface-3); font-size: 11px; line-height: 16px; font-weight: 500; color: var(--text-2); }
.row.sel .pill { background: var(--surface-2); }
.lock { color: var(--text-3); }
.chips { display: flex; flex: none; gap: 4px; }
.chip { display: inline-flex; align-items: center; height: 20px; padding: 0 6px; border: 1px solid var(--line); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-2); white-space: nowrap; }
.chip.hit { border-color: transparent; background: var(--accent-soft); color: var(--accent-strong); }
.meta { flex: none; width: 116px; text-align: right; font-size: 12px; color: var(--text-3); white-space: nowrap; }
.meta .v { font-family: 'JetBrains Mono', monospace; color: var(--text-2); }
.meta .bad { color: var(--critical-text); }
.meta .wait { display: inline-block; width: 72px; height: 10px; border-radius: 4px; background: var(--surface-3); vertical-align: middle; }
.trail { display: flex; flex: none; align-items: center; gap: 2px; width: 52px; justify-content: flex-end; color: var(--text-3); }
.trail > * { opacity: 0; }
.row.sel .trail > * { opacity: 1; }
.dots { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 8px; color: var(--text-2); }
.dots.open { background: var(--surface-2); color: var(--text-1); box-shadow: inset 0 0 0 1px var(--line-strong); }
.foot { display: flex; flex: none; align-items: center; gap: 16px; padding: 8px 16px; border-top: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.foot .hint { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.foot .end { margin-left: auto; }
.kbd { display: inline-flex; min-width: 20px; height: 20px; align-items: center; justify-content: center; padding: 0 4px; border: 1px solid var(--line-strong); border-radius: 5px; background: var(--surface); font-size: 11px; font-weight: 500; color: var(--text-3); }
.link { display: inline-flex; align-items: center; gap: 6px; padding: 2px 6px; margin: -2px -6px; border-radius: 6px; font-weight: 500; color: var(--text-2); }

/* Buttons. */
.btn { display: inline-flex; height: 32px; align-items: center; justify-content: center; gap: 6px; padding: 0 12px; border-radius: 8px; font-size: 13px; font-weight: 500; white-space: nowrap; }
.btn.sm { height: 28px; padding: 0 10px; font-size: 12px; }
.btn.sm svg.i { width: 14px; height: 14px; }
.btn.primary { background: var(--accent); color: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.1); }
.btn.secondary { border: 1px solid var(--line-strong); background: var(--surface-2); color: var(--text-1); box-shadow: 0 1px 1px rgb(0 0 0 / 0.04); }
.btn.ghost { color: var(--text-2); }
.btn.ghost.on { background: var(--surface-3); color: var(--text-1); }
.btn.danger-ghost { color: var(--critical-text); }
.btn.off { opacity: 0.5; }
.btn.focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.icon-btn { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 8px; color: var(--text-2); }
.managed { display: inline-flex; height: 28px; align-items: center; gap: 6px; padding: 0 10px; border-radius: 8px; background: var(--surface-3); font-size: 12px; font-weight: 500; color: var(--text-2); }
.managed.open { box-shadow: inset 0 0 0 1px var(--line-strong); color: var(--text-1); }

/* The page's footer. */
footer.page { display: flex; flex: none; align-items: center; gap: 8px; margin-top: 20px; font-size: 12px; color: var(--text-3); }
.sources { display: inline-flex; min-width: 0; height: 28px; align-items: center; gap: 6px; padding: 0 8px; margin-left: -8px; border-radius: 8px; color: var(--text-3); }
.sources.open { background: var(--surface-3); color: var(--text-2); }
.sources .path { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.sources .more { flex: none; padding: 0 5px; border-radius: 999px; background: var(--surface-3); font-size: 11px; line-height: 16px; font-weight: 500; color: var(--text-2); }
.sources.open .more { background: var(--surface-2); }
.grow { flex: 1; }

/* Menus and popovers. */
.menu { position: absolute; z-index: 10; min-width: 192px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.menu .item { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; color: var(--text-1); white-space: nowrap; }
.menu .item svg.i { color: var(--text-3); }
.menu .item.hl { background: var(--surface-3); }
.menu .item.danger, .menu .item.danger svg.i { color: var(--critical-text); }
.menu .item .keys { display: flex; gap: 3px; margin-left: auto; padding-left: 16px; opacity: 0.8; }
.menu .item .check { margin-left: auto; color: var(--accent); }
.menu .sep { height: 1px; margin: 4px; background: var(--line); }
.menu .label { padding: 6px 8px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.025em; text-transform: uppercase; color: var(--text-3); }
.pop { padding: 0; }
.pop .head { display: flex; align-items: baseline; justify-content: space-between; padding: 12px 14px 6px; }
.pop .head .label { padding: 0; }
.pop .head .mode { font-size: 12px; color: var(--text-3); }
.file { --row-bg: transparent; display: flex; align-items: center; gap: 10px; margin: 0 4px; padding: 8px 10px; border-radius: 8px; }
.file.hl { background: var(--surface-3); }
.file > svg.i { color: var(--text-3); }
.file .what .path { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; direction: rtl; text-align: left; }
.file .what .note { font-size: 12px; line-height: 16px; color: var(--text-3); }
.file .what .note.bad { color: var(--critical-text); }
.file .acts { display: flex; gap: 2px; color: var(--text-3); }
.file .acts span { display: grid; width: 26px; height: 26px; place-items: center; border-radius: 6px; }
.file.hl .acts span:hover, .file .acts span.on { background: var(--surface-2); color: var(--text-1); }
.pop .note-foot { display: flex; gap: 8px; padding: 10px 14px 12px; border-top: 1px solid var(--line); font-size: 12px; line-height: 17px; color: var(--text-3); }
.pop .items { padding: 4px; border-top: 1px solid var(--line); }
.pop.explain { width: 340px; padding: 12px; }
.pop.explain h4 { margin: 0 0 4px; font-size: 13px; font-weight: 600; }
.pop.explain p { margin: 0; font-size: 12px; line-height: 18px; color: var(--text-2); }
.pop.explain .src { margin-top: 8px; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 16px; color: var(--text-3); }

/* Empty and unreadable. */
.empty-panel { flex: none; min-height: 380px; justify-content: center; }
.short .empty-panel { min-height: 320px; }
.empty { display: flex; flex-direction: column; align-items: center; max-width: 460px; margin: 0 auto; padding: 40px 24px; text-align: center; }
.empty .glyph { display: grid; width: 44px; height: 44px; margin-bottom: 16px; place-items: center; border: 1px solid var(--line); border-radius: 16px; background: var(--surface-3); color: var(--text-3); }
.empty .glyph.bad { border: 0; background: color-mix(in srgb, var(--critical) 10%, transparent); color: var(--critical-text); }
.empty h3 { margin: 0; font-size: 15px; line-height: 22px; font-weight: 600; }
.empty p { margin: 6px 0 0; font-size: 13px; line-height: 21px; color: var(--text-2); text-wrap: pretty; }
.empty code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); }
.empty .err { width: 100%; margin-top: 14px; padding: 8px 12px; border-radius: 8px; background: var(--surface-3); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; color: var(--text-2); text-align: left; }
.empty .err .where { color: var(--text-3); }
.empty .buttons { display: flex; gap: 8px; margin-top: 20px; }
.notice { display: flex; flex: none; align-items: center; gap: 8px; padding: 7px 16px; border-bottom: 1px solid color-mix(in srgb, var(--warn) 25%, transparent); background: color-mix(in srgb, var(--warn) 10%, transparent); font-size: 12px; line-height: 18px; color: var(--warn-text); }
.notice .mono { font-size: 11.5px; }
.notice .acts { display: flex; gap: 12px; margin-left: auto; font-weight: 500; }

/* Dialogs. */
.scrim { position: absolute; inset: 0; z-index: 20; background: rgb(0 0 0 / 0.3); backdrop-filter: blur(2px); }
.dialog { position: absolute; z-index: 30; left: 50%; display: flex; max-height: 86%; flex-direction: column; overflow: hidden; transform: translateX(-50%); border: 1px solid var(--line-strong); border-radius: 16px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.dialog > .head { display: flex; flex: none; align-items: flex-start; gap: 12px; padding: 20px 20px 4px; }
.dialog > .head .glyph { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.dialog > .head .glyph.good { background: color-mix(in srgb, var(--good) 12%, transparent); color: var(--good-text); }
.dialog > .head h3 { margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.dialog > .head .sub { margin-top: 2px; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.dialog > .head .x { margin: -6px -8px 0 auto; }
.dialog > .body { display: flex; min-height: 0; flex-direction: column; gap: 16px; overflow: hidden; padding: 16px 20px 20px; }
.dialog > .actions { display: flex; flex: none; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface); }
.dialog > .actions .first { margin-right: auto; }
.seg { display: inline-flex; align-self: flex-start; gap: 2px; padding: 2px; border-radius: 8px; background: var(--surface-3); }
.seg span { display: inline-flex; height: 28px; align-items: center; gap: 6px; padding: 0 10px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.seg span.on { background: var(--surface); font-weight: 600; color: var(--text-1); box-shadow: 0 1px 1px rgb(0 0 0 / 0.04), 0 0 0 1px var(--line); }
.editor { padding: 10px 0; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-2); white-space: pre; overflow: hidden; }
.editor.focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.editor .ln { display: inline-block; width: 36px; padding-right: 12px; text-align: right; color: var(--text-3); opacity: 0.6; }
.editor .k { color: var(--accent-strong); }
.editor .s { color: var(--good-text); }
.editor .c { color: var(--text-3); }
.help { margin: 0; font-size: 12px; line-height: 18px; color: var(--text-3); }
.drop { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 40px 20px; border: 1.5px dashed var(--line-strong); border-radius: 12px; text-align: center; color: var(--text-2); }
.drop.over { border-color: var(--accent); background: var(--accent-soft); }
.drop .glyph { display: grid; width: 40px; height: 40px; margin-bottom: 6px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-3); }
.drop strong { font-size: 13px; font-weight: 600; color: var(--text-1); }
.drop small { font-size: 12px; color: var(--text-3); }
.summary { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; background: var(--surface-3); font-size: 12px; color: var(--text-2); }
.summary svg.i { color: var(--text-3); }
.summary .edit { margin-left: auto; font-weight: 500; color: var(--accent-strong); }
.checks { display: flex; flex-direction: column; gap: 12px; }
.check { display: flex; gap: 10px; }
.check > svg.i { margin-top: 2px; }
.check .t { font-size: 13px; font-weight: 500; color: var(--text-1); }
.check .d { margin-top: 1px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 17px; color: var(--text-3); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.check .h { margin-top: 3px; font-size: 12px; line-height: 17px; color: var(--text-2); }
.check.ok > svg.i { color: var(--good-text); }
.check.bad > svg.i { color: var(--critical-text); }
.check.ask > svg.i { color: var(--warn-text); }
.check.wait > svg.i, .check.todo > svg.i { color: var(--text-3); }
.check.todo .t { color: var(--text-3); font-weight: 400; }
.warning { padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--warn) 30%, transparent); border-radius: 12px; background: color-mix(in srgb, var(--warn) 9%, transparent); }
.warning .top { display: flex; gap: 10px; }
.warning .top svg.i { margin-top: 2px; color: var(--warn-text); }
.warning h4 { margin: 0; font-size: 13px; line-height: 20px; font-weight: 600; color: var(--text-1); }
.warning p { margin: 2px 0 0; font-size: 12px; line-height: 18px; color: var(--text-2); }
.command { margin-top: 10px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); }
.warning .command { margin-left: 26px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
.command .label { display: flex; align-items: center; justify-content: space-between; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.command .label svg.i { color: var(--text-3); }
.command code { display: block; margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; color: var(--text-1); white-space: pre-wrap; overflow-wrap: anywhere; }
.command code .env { color: var(--text-3); }

/* Forms. */
.form { display: grid; grid-template-columns: 128px 1fr; align-items: center; gap: 12px 16px; }
.form > .lbl { align-self: start; padding-top: 6px; font-size: 12px; line-height: 20px; font-weight: 500; color: var(--text-2); }
.form > .lbl.mid { align-self: center; padding: 0; }
.field { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-1); }
.field.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.field .ph { color: var(--text-3); }
.field .end { margin-left: auto; color: var(--text-3); }
.field.focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.field.off { background: var(--surface-2); color: var(--text-2); }
.field.chipsin { height: auto; min-height: 32px; flex-wrap: wrap; gap: 4px; padding: 4px 6px; }
.field.chipsin .chip { gap: 4px; padding: 0 4px 0 6px; background: var(--surface-3); border-color: transparent; color: var(--text-1); }
.field.chipsin .chip svg.i { color: var(--text-3); }
.field.chipsin .ph { padding-left: 4px; font-size: 12px; }
.field-help { margin-top: 6px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.swatches { display: flex; align-items: center; gap: 8px; }
.sw { display: grid; width: 22px; height: 22px; place-items: center; border-radius: 50%; background: var(--c); color: #fff; }
.sw.none { background: var(--surface); box-shadow: inset 0 0 0 1px var(--line-strong); color: var(--text-3); }
.sw.on { box-shadow: 0 0 0 2px var(--surface-2), 0 0 0 4px var(--c); }
.sw.on.focus { box-shadow: 0 0 0 2px var(--surface-2), 0 0 0 4px var(--accent); }
.rule { height: 1px; margin: 2px 0; background: var(--line); grid-column: 1 / -1; }
.toggle { display: flex; align-items: flex-start; gap: 12px; grid-column: 1 / -1; }
.toggle .what .t { font-size: 13px; font-weight: 500; }
.toggle .what .d { margin-top: 1px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.toggle .what .d .lockline { display: inline-flex; align-items: center; gap: 4px; color: var(--text-2); }
.switch { position: relative; flex: none; width: 32px; height: 18px; margin-top: 1px; border-radius: 999px; background: color-mix(in srgb, var(--text-3) 40%, transparent); }
.switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); }
.switch.on { background: var(--accent); }
.switch.on::after { left: 16px; }
.switch.off { opacity: 0.5; }
.conn { grid-column: 1 / -1; padding: 12px 14px; border-radius: 12px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); }
.conn .label { display: flex; align-items: center; gap: 8px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.conn .label .src { margin-left: auto; letter-spacing: 0; text-transform: none; font-weight: 500; color: var(--text-2); }
.conn dl { display: grid; grid-template-columns: 96px 1fr; gap: 4px 12px; margin: 8px 0 0; font-size: 12px; line-height: 18px; }
.conn dt { color: var(--text-3); }
.conn dd { margin: 0; overflow: hidden; font-family: 'JetBrains Mono', monospace; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.conn p { margin: 8px 0 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.conn .buttons { display: flex; gap: 8px; margin-top: 10px; }
.toast { position: absolute; right: 16px; bottom: 16px; z-index: 40; display: flex; width: 380px; gap: 12px; padding: 12px 8px 12px 14px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.toast > svg.i { margin-top: 1px; color: var(--good-text); }
.toast .t { font-size: 13px; font-weight: 500; }
.toast .d { margin-top: 2px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.toast .act { align-self: center; margin-left: auto; padding: 2px 8px; border-radius: 6px; font-weight: 500; color: var(--accent-strong); }
`

// ─── Parts ─────────────────────────────────────────────────────────────────────────────────

const kbd = (k: string) => `<span class="kbd">${k}</span>`
const MOD = '⌘'
const RETURN = icon('corner-down-left', 12)

function logo(scheme: Scheme): string {
  const variant = VARIANTS.find((v) => v.name === `on-${scheme}`)!
  return document(horizontal(variant), 36)
}

const health = (c: Cluster) =>
  c.problem === 'checking' ? 'var(--accent)' : c.problem ? 'var(--critical)' : 'var(--good)'

/** A cluster's tile: its color and letters, with its status in the corner. */
export function tile(c: Cluster, big = false): string {
  const color = c.color ? `--c: var(--series-${c.color});` : ''
  return `<span class="tile${c.color ? '' : ' plain'}${big ? ' big' : ''}" style="${color}">${escape(initials(c))}${big ? '' : `<span class="dot" style="--d:${health(c)}"></span>`}</span>`
}

const PROBLEM = { unreachable: 'Unreachable', auth: 'Couldn’t sign in', checking: '' }

export interface RowOptions {
  selected?: boolean
  /** The label key the list is grouped by: its chip is left out. */
  groupedBy?: string
  menu?: boolean
  fresh?: boolean
  /** One line, for Recent: a shortcut to a row that's also in its group. */
  compact?: boolean
  /** The label a search matched: shown as a chip. */
  match?: string
}

/** A row of the list. */
export function row(c: Cluster, o: RowOptions = {}): string {
  const labels = (c.labels ?? []).filter(([k, v]) => `${k}=${v}` === o.match)
  const sub = c.name ? middle(c.context, labels.length ? 34 : 46) : `${c.host} · ${c.user}`
  const meta =
    c.problem === 'checking'
      ? '<span class="wait"></span>'
      : c.problem
        ? `<span class="bad">${PROBLEM[c.problem]}</span>`
        : `<span class="v">${c.version}</span> · ${c.latency} ms`
  return `<div class="row${o.selected ? ' sel' : ''}${c.hidden ? ' hid' : ''}${o.fresh ? ' new' : ''}${o.compact ? ' compact' : ''}">
    ${tile(c)}
    <span class="what">
      <span class="top"><span class="name">${escape(title(c))}</span>${c.production ? '<span class="prod">Production</span>' : ''}${c.readOnly ? `<span class="lock" title="Read-only">${icon('lock', 12, 2.25)}</span>` : ''}${c.current ? '<span class="pill">current</span>' : ''}${c.hidden ? `<span class="lock">${icon('eye-off', 13)}</span>` : ''}</span>
      ${o.compact ? '' : `<span class="sub">${escape(sub)}</span>`}
    </span>
    ${labels.length ? `<span class="chips">${labels.map(([k, v]) => `<span class="chip hit">${k}=${v}</span>`).join('')}</span>` : ''}
    <span class="meta">${meta}</span>
    <span class="trail"><span class="dots${o.menu ? ' open' : ''}">${icon('ellipsis', 16)}</span><span>${RETURN}</span></span>
  </div>`
}

const heading = (text: string, n?: number, label = false) =>
  `<div class="heading${label ? ' label' : ''}">${escape(text)}${n === undefined ? '' : `<span class="n">${n}</span>`}</div>`

// ─── The page ──────────────────────────────────────────────────────────────────────────────

export type State =
  | 'list'
  | 'search'
  | 'actions'
  | 'group-by'
  | 'by-label'
  | 'hidden'
  | 'files'
  | 'partial'
  | 'empty'
  | 'unreadable'
  | 'missing'
  | 'add-paste'
  | 'add-import'
  | 'add-checking'
  | 'add-exec'
  | 'add-failed'
  | 'add-done'
  | 'added'
  | 'settings'
  | 'settings-added'
  | 'locked'
  | 'locked-files'
  | 'locked-settings'
  | 'locked-empty'

export const STATES: { state: State; title: string; note: string }[] = [
  { state: 'list', title: 'The list', note: 'Recent first, then Lumovi’s groups.' },
  { state: 'search', title: 'Search', note: 'Names, contexts, servers and labels.' },
  { state: 'actions', title: 'A cluster’s actions', note: 'On ⋯, on right-click, or on “.”.' },
  { state: 'group-by', title: 'Group by', note: 'A group, a label, or nothing.' },
  { state: 'by-label', title: 'Grouped by a label', note: 'Its chip leaves the rows.' },
  { state: 'hidden', title: 'Hidden clusters, shown', note: 'Dimmed, with an eye.' },
  { state: 'files', title: 'Kubeconfig files', note: 'What’s read, from where.' },
  { state: 'partial', title: 'A file that can’t be read', note: 'The others still load.' },
  { state: 'empty', title: 'No clusters', note: 'The first run, with nothing found.' },
  { state: 'unreadable', title: 'An unreadable kubeconfig', note: 'Choose another, or fix it.' },
  { state: 'missing', title: 'A chosen file that’s gone', note: 'Choose again, or go back.' },
  { state: 'add-paste', title: 'Add a cluster: paste', note: 'A kubeconfig, or one context.' },
  { state: 'add-import', title: 'Add a cluster: a file', note: 'Dropped, or chosen.' },
  { state: 'add-checking', title: 'The check', note: 'It reads, it answers, it signs in.' },
  { state: 'add-exec', title: 'A credential plugin', note: 'The exact command, and a question.' },
  { state: 'add-failed', title: 'A check that fails', note: 'Why, and what to try.' },
  { state: 'add-done', title: 'Added', note: 'Name it, and use it in a terminal.' },
  { state: 'added', title: 'In the list', note: 'Selected, in its group.' },
  { state: 'settings', title: 'Cluster settings', note: 'From a kubeconfig.' },
  { state: 'settings-added', title: 'Cluster settings', note: 'Added in Lumovi.' },
  { state: 'locked', title: 'Managed by an organization', note: 'Why there’s no Add.' },
  { state: 'locked-files', title: 'Managed files', note: 'Shown, not changed.' },
  {
    state: 'locked-settings',
    title: 'A setting the policy sets',
    note: 'Locked, with who set it.',
  },
  { state: 'locked-empty', title: 'Managed, and empty', note: 'Who to ask.' },
]

export interface Size {
  width: number
  height: number
}

/** The clusters page in one state, as a page `size` big. */
export function clustersPage(state: State, scheme: Scheme, size: Size): string {
  const short = size.height <= 800
  const locked = state.startsWith('locked')
  const body = `<div class="window${short ? ' short' : ''}">
  <div class="titlebar"></div>
  <main>
    <div class="column">
      <header class="top"><h1 style="margin:0" class="logo">${logo(scheme)}</h1><p>Choose a cluster to explore.</p></header>
      ${content(state, locked)}
      ${pageFooter(state)}
    </div>
  </main>
  ${overlay(state, size)}
</div>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${size.width}px; height: ${size.height}px; }
${CSS}
</style>${body}`
}

const SEARCH_PH = '<span class="ph">Search clusters and labels…</span>'

function content(state: State, locked: boolean): string {
  const panel = (inside: string) => `<div class="picker empty-panel">${inside}</div>`
  if (state === 'empty' || state === 'locked-empty') return panel(empty(state === 'locked-empty'))
  if (state === 'unreadable') return panel(unreadable())
  if (state === 'missing') return panel(missing())
  const visible = CLUSTERS.filter((c) => !c.hidden || state === 'hidden')
  const total = CLUSTERS.filter((c) => !c.hidden).length
  let query = ''
  let groups: string
  let count = `${total} of ${total}`
  if (state === 'search') {
    query = 'env=production'
    const found = visible.filter((c) => c.labels?.some(([k, v]) => `${k}=${v}` === query))
    count = `${found.length} of ${total}`
    groups =
      heading('Payments', found.length) +
      found.map((c, i) => row(c, { selected: i === 0, match: query })).join('')
  } else {
    // Recent first, then the groups: Lumovi's own, or a label's values.
    const pick =
      state === 'actions' || state === 'added'
        ? { name: 'Payments US', recent: false }
        : state === 'hidden'
          ? { name: 'docker-desktop', recent: false }
          : { name: 'Payments EU', recent: true }
    const byLabel = state === 'by-label'
    const recent = state === 'added' ? [] : RECENT.map(find)
    const key = (c: Cluster) =>
      byLabel ? (c.labels?.find(([k]) => k === 'env')?.[1] ?? '') : (c.group ?? '')
    const byKey = new Map<string, Cluster[]>()
    for (const c of visible) byKey.set(key(c), [...(byKey.get(key(c)) ?? []), c])
    const order = [...byKey.keys()].sort((a, b) =>
      a === '' ? 1 : b === '' ? -1 : a.localeCompare(b),
    )
    const name = (k: string) =>
      byLabel ? (k ? `env=${k}` : 'No env label') : k || 'Other clusters'
    groups =
      (recent.length
        ? heading('Recent') +
          recent
            .map((c) => row(c, { selected: pick.recent && title(c) === pick.name, compact: true }))
            .join('')
        : '') +
      order
        .map(
          (k) =>
            heading(name(k), byKey.get(k)!.length, byLabel && k !== '') +
            byKey
              .get(k)!
              .map((c) =>
                row(c, {
                  selected: !pick.recent && title(c) === pick.name,
                  menu: state === 'actions' && title(c) === pick.name,
                  fresh: state === 'added' && title(c) === pick.name,
                }),
              )
              .join(''),
        )
        .join('')
    if (state === 'hidden') count = `${visible.length} of ${visible.length}`
  }
  const notice =
    state === 'partial'
      ? `<div class="notice">${icon('triangle-alert', 14)}<span><span class="mono">~/Downloads/k3s-lab.yaml</span> is gone, so its clusters aren’t here.</span><span class="acts"><span>Choose it again…</span><span>Remove</span></span></div>`
      : ''
  const hidden = CLUSTERS.filter((c) => c.hidden).length
  return `<div class="picker">
    <div class="bar">
      ${icon('search', 16, 2, 'color:var(--text-3)')}
      <span class="input">${query ? `${escape(query)}<span class="caret"></span>` : `<span class="caret" style="margin-left:0;margin-right:1px"></span>${SEARCH_PH}`}</span>
      <span class="count">${count}</span>
      <span class="divider"></span>
      <span class="btn ghost sm${state === 'group-by' ? ' on' : ''}${state === 'by-label' ? ' on' : ''}">${icon('layers', 14)}${state === 'by-label' ? 'Grouped by env' : 'Group by'}${icon('chevron-down', 14)}</span>
      ${locked ? `<span class="managed${state === 'locked' ? ' open' : ''}">${icon('lock', 12, 2.25)}Managed</span>` : `<span class="btn secondary sm">${icon('plus', 14)}Add cluster</span>`}
    </div>
    ${notice}
    <div class="list${state === 'hidden' ? ' end' : ''}">${groups}</div>
    <div class="foot">
      <span class="hint">${kbd('↑')}${kbd('↓')} to move</span>
      <span class="hint">${kbd(RETURN)} to open</span>
      <span class="hint">${kbd('.')} for actions</span>
      ${locked ? '' : `<span class="hint">${kbd(MOD)}${kbd('N')} to add</span>`}
      <span class="end link">${icon(state === 'hidden' ? 'eye' : 'eye-off', 14)}${state === 'hidden' ? `Showing ${hidden} hidden` : `${hidden} hidden`}</span>
    </div>
  </div>`
}

function empty(locked: boolean): string {
  return locked
    ? `<div class="empty">
      <div class="glyph">${icon('building-2', 20)}</div>
      <h3>No clusters yet</h3>
      <p>Your organization manages the clusters on this computer, and hasn’t given it any. Ask whoever looks after your Mac for access.</p>
      <div class="buttons"><span class="btn secondary">${icon('rotate-cw', 16)}Reload</span></div>
    </div>`
    : `<div class="empty">
      <div class="glyph">${icon('server-off', 20)}</div>
      <h3>No clusters yet</h3>
      <p>Lumovi looks for a kubeconfig in <code>KUBECONFIG</code> and <code>~/.kube/config</code>, and found none. Choose the file you use with kubectl, or add a cluster.</p>
      <div class="buttons"><span class="btn primary focus">${icon('file-input', 16)}Choose a kubeconfig…</span><span class="btn secondary">${icon('plus', 16)}Add a cluster</span></div>
    </div>`
}

function unreadable(): string {
  return `<div class="empty">
    <div class="glyph bad">${icon('file-warning', 20)}</div>
    <h3>Your kubeconfig couldn’t be read</h3>
    <p>Lumovi reads <code>~/.kube/config</code>, and it isn’t valid YAML. Fix it and reload, or choose another file.</p>
    <div class="err"><span class="where">line 14, column 9:</span> mapping values aren’t allowed here</div>
    <div class="buttons"><span class="btn primary">${icon('file-input', 16)}Choose a kubeconfig…</span><span class="btn secondary">${icon('folder-open', 16)}Show in Finder</span></div>
  </div>`
}

function missing(): string {
  return `<div class="empty">
    <div class="glyph">${icon('file-warning', 20)}</div>
    <h3>The kubeconfig you chose is gone</h3>
    <p>Lumovi was reading <code>~/Downloads/k3s-lab.yaml</code>, and it’s been moved or deleted, so there are no clusters to show.</p>
    <div class="buttons"><span class="btn primary">${icon('file-input', 16)}Choose a kubeconfig…</span><span class="btn secondary">${icon('rotate-ccw', 16)}Back to KUBECONFIG and ~/.kube/config</span></div>
  </div>`
}

function pageFooter(state: State): string {
  const none = state === 'empty' || state === 'locked-empty'
  const open = state === 'files' || state === 'locked-files'
  const sources = none
    ? `<span class="sources${open ? ' open' : ''}">${icon('file-text', 14)}<span>No kubeconfig</span>${icon('chevron-up', 14)}</span>`
    : state === 'unreadable' || state === 'missing'
      ? `<span class="sources">${icon('file-warning', 14, 2, 'color:var(--critical-text)')}<span class="path">${state === 'missing' ? '~/Downloads/k3s-lab.yaml' : '~/.kube/config'}</span>${icon('chevron-up', 14)}</span>`
      : `<span class="sources${open ? ' open' : ''}">${state === 'partial' ? icon('file-warning', 14, 2, 'color:var(--warn-text)') : icon('file-text', 14)}<span class="path">${state.startsWith('locked') ? '/etc/lumovi/kubeconfig' : '~/.kube/config'}</span>${state.startsWith('locked') ? '' : '<span class="more">+2</span>'}${icon('chevron-up', 14)}</span>`
  return `<footer class="page">
    ${sources}
    <span class="grow"></span>
    <span class="btn ghost">${icon('rotate-cw', 16)}Reload</span>
    <span class="icon-btn">${icon('monitor', 16)}</span>
    <span class="icon-btn">${icon('sparkles', 16)}</span>
    <span class="icon-btn"><svg class="i" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg></span>
  </footer>`
}

// ─── Over the page: menus, popovers, dialogs ───────────────────────────────────────────────

/** Where the column's left edge and the footer sit, to anchor popovers in mockups. */
function geometry(size: Size) {
  const column = Math.min(720, size.width - 64)
  const left = (size.width - column) / 2
  return { column, left, right: left + column }
}

function overlay(state: State, size: Size): string {
  const g = geometry(size)
  const footerBottom = 24 + 28 + 2 // main's padding, the footer, and a little air
  switch (state) {
    case 'actions':
      return `<div class="menu" style="left:${g.right - 60 - 250}px;top:${actionsTop(size)}px;width:250px">
        <div class="item hl">${icon('arrow-right', 16)}Open${'<span class="keys">' + kbd(RETURN) + '</span>'}</div>
        <div class="item">${icon('settings-2', 16)}Settings…<span class="keys">${kbd(MOD)}${kbd('I')}</span></div>
        <div class="item">${icon('terminal', 16)}Copy for kubectl</div>
        <div class="item">${icon('folder-open', 16)}Show in Finder</div>
        <div class="sep"></div>
        <div class="item">${icon('eye-off', 16)}Hide</div>
        <div class="item danger">${icon('trash-2', 16)}Remove from Lumovi<span class="keys">${kbd(MOD)}${kbd('⌫')}</span></div>
      </div>`
    case 'group-by':
      return `<div class="menu" style="left:${g.right - 10 - 116 - 200}px;top:${groupByTop(size)}px;width:200px">
        <div class="label">Group by</div>
        <div class="item hl">${icon('layers', 16)}Group<span class="check">${icon('check', 16)}</span></div>
        <div class="sep"></div>
        <div class="label">A label</div>
        <div class="item">${icon('tag', 16)}<span class="mono" style="font-size:12px">env</span></div>
        <div class="item">${icon('tag', 16)}<span class="mono" style="font-size:12px">region</span></div>
        <div class="sep"></div>
        <div class="item">${icon('minus', 16)}Nothing</div>
      </div>`
    case 'files':
      return files(g.left - 8, footerBottom, false)
    case 'locked-files':
      return files(g.left - 8, footerBottom, true)
    case 'locked':
      return `<div class="menu pop explain" style="left:${g.right - 10 - 340}px;top:${groupByTop(size)}px">
        <h4>Managed by your organization</h4>
        <p>Your organization looks after the clusters on this computer. Lumovi reads the kubeconfig it set up, and can’t add files or clusters.</p>
        <div class="src">/Library/Application Support/Lumovi/policy.json</div>
      </div>`
    case 'add-paste':
    case 'add-import':
    case 'add-checking':
    case 'add-exec':
    case 'add-failed':
    case 'add-done':
      return `<div class="scrim"></div>${addDialog(state, size)}`
    case 'added':
      return `<div class="toast">${icon('circle-check', 18)}<div><div class="t">Payments US is added</div><div class="d">It’s in Lumovi’s own folder. Your kubeconfig is as it was.</div></div><span class="act">Open</span></div>`
    case 'settings':
    case 'settings-added':
    case 'locked-settings':
      return `<div class="scrim"></div>${settingsDialog(state, size)}`
    default:
      return ''
  }
}

/** The top of the list's first row, in the mockup: the actions menu hangs from the selected row. */
const listTop = (size: Size) =>
  size.height <= 800 ? 52 + 0 + 28 + 16 + 20 + 20 : 52 + 24 + 36 + 20 + 20 + 32
const groupByTop = (size: Size) => listTop(size) + 48 - 6
const actionsTop = (size: Size) => listTop(size) + 48 + 6 + 28 + 56 * 3 + 28 + 56 + 46

function files(left: number, bottom: number, locked: boolean): string {
  interface File {
    path: string
    note: string
    hl?: boolean
    folder?: boolean
    /** Added in Lumovi, so it can be removed. */
    ours?: boolean
    missing?: boolean
  }
  const file = (f: File) => {
    const acts = f.missing
      ? `<span class="on" title="Choose it again">${icon('file-input', 15)}</span><span title="Remove">${icon('x', 15)}</span>`
      : f.hl
        ? `<span title="Show in Finder">${icon('folder-open', 15)}</span>${f.ours ? `<span title="Remove">${icon('x', 15)}</span>` : ''}`
        : ''
    return `<div class="file${f.hl ? ' hl' : ''}">${icon(f.missing ? 'file-warning' : f.folder ? 'folder' : 'file-text', 16, 2, f.missing ? 'color:var(--critical-text)' : '')}<span class="what"><div class="path"${f.missing ? ' style="color:var(--text-2)"' : ''}><bdi>${escape(f.path)}</bdi></div><div class="note${f.missing ? ' bad' : ''}">${f.note}</div></span><span class="acts">${acts}</span></div>`
  }
  const list: File[] = locked
    ? [{ path: '/etc/lumovi/kubeconfig', note: 'Set by your organization · 4 clusters', hl: true }]
    : [
        { path: '~/.kube/config', note: 'The default · 4 clusters' },
        {
          path: '~/work/payments/kubeconfig.yaml',
          note: 'Added in Lumovi · 2 clusters',
          hl: true,
          ours: true,
        },
        {
          path: '~/Downloads/k3s-lab.yaml',
          note: 'Missing: it was moved or deleted',
          ours: true,
          missing: true,
        },
        {
          path: '~/Library/Application Support/Lumovi/clusters',
          note: 'Clusters added in Lumovi · 1 cluster',
          folder: true,
        },
      ]
  return `<div class="menu pop" style="left:${left}px;bottom:${bottom}px;width:440px">
    <div class="head"><span class="label">Kubeconfig files</span><span class="mode">${locked ? 'Managed' : 'Merged as kubectl does'}</span></div>
    ${list.map(file).join('')}
    ${
      locked
        ? ''
        : `<div class="items">
      <div class="item">${icon('file-input', 16)}Choose a kubeconfig…<span class="keys" style="font-size:12px;color:var(--text-3)">Use only that file</span></div>
      <div class="item">${icon('file-plus', 16)}Add another file…</div>
      <div class="item">${icon('rotate-ccw', 16)}Back to <span class="mono" style="font-size:12px">KUBECONFIG</span> and <span class="mono" style="font-size:12px">~/.kube/config</span></div>
    </div>`
    }
    <div class="note-foot">${icon(locked ? 'lock' : 'info', 14, 2, 'margin-top:1px')}<span>${
      locked
        ? 'Your organization’s policy sets the kubeconfig on this computer.'
        : 'Lumovi reads these files and never writes to them. Removing one only stops Lumovi reading it.'
    }</span></div>
  </div>`
}

// ─── Adding a cluster ──────────────────────────────────────────────────────────────────────

const YAML = [
  ['k', 'apiVersion', 's', 'v1'],
  ['k', 'kind', 's', 'Config'],
  ['k', 'clusters', '', ''],
  ['-k', 'name', 's', 'payments-prod-us'],
  ['  k', 'cluster', '', ''],
  ['    k', 'server', 's', 'https://9A2E7D41.yl4.us-east-1.eks.amazonaws.com'],
  ['    k', 'certificate-authority-data', 's', 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM…'],
  ['k', 'users', '', ''],
  ['-k', 'name', 's', 'payments-admin'],
  ['  k', 'user', '', ''],
  ['    k', 'exec', '', ''],
  ['      k', 'command', 's', 'aws'],
  ['      k', 'args', 's', '[eks, get-token, --cluster-name, payments-prod, --region, us-east-1]'],
  ['      k', 'env', 's', '[{name: AWS_PROFILE, value: payments}]'],
]

function editor(lines: number, focus: boolean): string {
  const out = YAML.slice(0, lines)
    .map(([indent, key, , value], i) => {
      const pad = indent!.replace(/[a-z]/g, '').replace('-', '- ')
      return `<span class="ln">${i + 1}</span>${pad}<span class="k">${key}</span>:${value ? ` <span class="s">${escape(value)}</span>` : ''}`
    })
    .join('\n')
  return `<div class="editor${focus ? ' focus' : ''}">${out}</div>`
}

const COMMAND = [
  '<span class="env">AWS_PROFILE=payments</span>',
  'aws eks get-token',
  '--cluster-name payments-prod',
  '--region us-east-1',
]
  .map((part) => `<span style="white-space:nowrap">${part}</span>`)
  .join(' ')

function addDialog(state: State, size: Size): string {
  const top = Math.round(size.height * 0.1)
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
  const summary = `<div class="summary">${icon('clipboard-paste', 14)}<span>Pasted · 1 context, <span class="mono" style="font-size:12px;color:var(--text-1)">payments-prod-us</span></span><span class="edit">Edit</span></div>`
  const parsed = check('ok', 'It reads as a kubeconfig', 'payments-prod-us · user payments-admin')
  const answered = check(
    'ok',
    'The server answers',
    '9A2E7D41.yl4.us-east-1.eks.amazonaws.com · v1.34.1 · 96 ms',
  )
  let head = `<div class="glyph">${icon('plus', 18)}</div><div style="min-width:0"><h3>Add a cluster</h3><div class="sub">Lumovi keeps it in its own folder. Your kubeconfig stays as it is.</div></div>`
  let body = ''
  let actions = ''
  switch (state) {
    case 'add-paste':
      body = `<div class="seg"><span class="on">${icon('clipboard-paste', 14)}Paste</span><span>${icon('file-up', 14)}A file</span></div>
        ${editor(14, true)}
        <p class="help">A whole kubeconfig, or one context from one, with its cluster and user.</p>`
      actions = `<span class="btn ghost">Cancel</span><span class="btn primary">Check it</span>`
      break
    case 'add-import':
      body = `<div class="seg"><span>${icon('clipboard-paste', 14)}Paste</span><span class="on">${icon('file-up', 14)}A file</span></div>
        <div class="drop over"><div class="glyph" style="background:var(--surface);color:var(--accent-strong)">${icon('file-up', 20)}</div><strong>Drop it to add it</strong><small>payments-us.yaml</small></div>
        <p class="help">Or <span style="color:var(--accent-strong);font-weight:500">choose a file…</span> Lumovi copies what it needs, so the file can move or go.</p>`
      actions = `<span class="btn ghost">Cancel</span><span class="btn primary off">Check it</span>`
      break
    case 'add-checking':
      body = `${summary}<div class="checks">${parsed}${check('wait', 'The server answers', 'Asking 9A2E7D41.yl4.us-east-1.eks.amazonaws.com…')}${check('todo', 'The credentials work')}</div>`
      actions = `<span class="btn ghost">Cancel</span><span class="btn primary off">${icon('loader-circle', 16)}Checking</span>`
      break
    case 'add-exec':
      body = `${summary}<div class="checks">${parsed}${answered}${check('ask', 'The credentials work', 'Waiting for you')}</div>
        <div class="warning"><div class="top">${icon('triangle-alert', 16)}<div><h4>Signing in runs a program on this computer</h4><p>This kubeconfig gets its credentials from the command below. Lumovi would run it each time it connects, as kubectl does. Allow it only if you trust where the kubeconfig came from.</p></div></div>
          <div class="command"><div class="label">The command${icon('copy', 14)}</div><code>${COMMAND}</code></div></div>`
      actions = `<span class="btn ghost">Don’t add it</span><span class="btn primary">Allow and continue</span>`
      break
    case 'add-failed':
      body = `${summary}<div class="checks">${parsed}${check('bad', 'The server didn’t answer', 'connect ETIMEDOUT 10.40.2.8:6443, after 10 s', 'Is it on a network you’re not on, like a VPN? Connect to it and try again.')}${check('todo', 'The credentials work', '', '')}</div>`
      actions = `<span class="btn ghost first">Add it anyway</span><span class="btn secondary">Back</span><span class="btn primary">${icon('rotate-cw', 16)}Try again</span>`
      break
    case 'add-done':
      head = `<div class="glyph good">${icon('circle-check', 18)}</div><div style="min-width:0"><h3>Payments US is ready</h3><div class="sub">It’s in Lumovi’s own folder. Your kubeconfig stays as it is.</div></div>`
      body = `<div class="checks">${parsed}${answered}${check('ok', 'The credentials work', 'Signed in as payments-admin · can list namespaces')}</div>
        <div class="form">
          <span class="lbl mid">Name</span><span class="field focus" style="gap:0">Payments US<span class="caret" style="height:16px;margin:0 0 0 1px"></span></span>
          <span class="lbl mid">Color</span>${swatches(2, false)}
          <span class="lbl mid">Group</span><span class="field">Payments<span class="end">${icon('chevrons-up-down', 14)}</span></span>
        </div>
        <div class="command"><div class="label">Use it with kubectl${icon('copy', 14)}</div><code>export KUBECONFIG="$HOME/Library/Application Support/Lumovi/clusters/payments-us.yaml"</code></div>`
      actions = `<span class="btn ghost">Close</span><span class="btn primary">Open Payments US</span>`
      break
  }
  return `<div class="dialog" style="top:${top}px;width:600px">
    <div class="head">${head}<span class="icon-btn x">${icon('x', 16)}</span></div>
    <div class="body">${body}</div>
    <div class="actions">${actions}</div>
  </div>`
}

function swatches(chosen: number | 0, focus: boolean): string {
  const all = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  return `<span class="swatches">${all
    .map((n) =>
      n === 0
        ? `<span class="sw none${chosen === 0 ? ' on' : ''}" style="--c:var(--text-3)">${icon('minus', 12)}</span>`
        : `<span class="sw${chosen === n ? ' on' : ''}${chosen === n && focus ? ' focus' : ''}" style="--c:var(--series-${n})">${chosen === n ? icon('check', 12, 3) : ''}</span>`,
    )
    .join('')}</span>`
}

// ─── A cluster's settings ──────────────────────────────────────────────────────────────────

function settingsDialog(state: State, size: Size): string {
  const added = state === 'settings-added'
  const locked = state === 'locked-settings'
  const c = find(added || locked ? 'Payments US' : 'Payments EU')
  const top = Math.round(size.height * 0.07)
  const toggle = (t: string, d: string, on: boolean, off = false) =>
    `<div class="toggle"><span class="switch${on ? ' on' : ''}${off ? ' off' : ''}"></span><span class="what"><div class="t">${t}</div><div class="d">${d}</div></span></div>`
  const connection = added
    ? `<div class="conn"><div class="label">Connection<span class="src">Added in Lumovi, 8 October</span></div>
        <dl><dt>Server</dt><dd>https://${c.host}</dd><dt>Signs in with</dt><dd>aws eks get-token · allowed by you</dd></dl>
        <div class="buttons"><span class="btn secondary sm">${icon('pencil', 14)}Edit connection…</span><span class="btn ghost sm">${icon('terminal', 14)}Copy for kubectl</span></div></div>`
    : `<div class="conn"><div class="label">Connection<span class="src mono" style="font-size:12px">${locked ? '/etc/lumovi/kubeconfig' : '~/.kube/config'}</span></div>
        <p style="margin-top:6px">From ${locked ? 'the kubeconfig your organization set up' : 'your kubeconfig'}, as user <span class="mono" style="color:var(--text-2)">${c.user}</span>. Lumovi never changes it: to change how it connects, edit the file.</p>
        <div class="buttons"><span class="btn secondary sm">${icon('folder-open', 14)}Show in Finder</span></div></div>`
  return `<div class="dialog" style="top:${top}px;width:600px">
    <div class="head">${tile(c, true)}<div style="min-width:0"><h3>${escape(title(c))}</h3><div class="sub mono">${escape(c.context)}</div></div><span class="icon-btn x">${icon('x', 16)}</span></div>
    <div class="body">
      <div class="form">
        <span class="lbl mid">Name</span><span class="field${added || locked ? '' : ' focus'}" style="gap:0">${escape(title(c))}${added || locked ? '' : '<span class="caret" style="height:16px;margin:0 0 0 1px"></span>'}</span>
        <span class="lbl mid">Color</span>${swatches(c.color ?? 0, false)}
        <span class="lbl mid">Group</span><span class="field">${escape(c.group ?? '')}<span class="end">${icon('chevrons-up-down', 14)}</span></span>
        <span class="lbl">Labels</span><span class="field chipsin">${(c.labels ?? []).map(([k, v]) => `<span class="chip">${k}=${v}${icon('x', 12)}</span>`).join('')}<span class="ph">Add a label…</span></span>
        <span class="lbl mid">Namespace</span><span class="field">checkout<span class="end">${icon('chevrons-up-down', 14)}</span></span>
        <div class="rule"></div>
        ${toggle('Production', 'Deleting and draining ask you to type its name, and its rows say Production.', true)}
        ${
          locked
            ? toggle(
                'Read-only',
                `<span class="lockline">${icon('lock', 12, 2.25)}Set by your organization.</span> Lumovi changes nothing in it.`,
                true,
                true,
              )
            : toggle('Read-only', 'Lumovi changes nothing in it.', !!c.readOnly)
        }
        ${toggle('Hidden', 'Left out of the list. Show hidden clusters from its footer.', false)}
        ${connection}
      </div>
    </div>
    <div class="actions">${added ? `<span class="btn danger-ghost first">${icon('trash-2', 16)}Remove from Lumovi</span>` : ''}<span class="btn ghost">Cancel</span><span class="btn primary">Save</span></div>
  </div>`
}
