/**
 * lumovi.dev's "Every cluster" card: the clusters page, small, beside the scene's plates. The
 * website draws it in its own markup; this is how it should look, with the clusters page's parts
 * (src/clusters.ts) at nine tenths of their size, as the site's cards are. Mockups for the
 * design (LMV-212) and the picture in the guidelines.
 */
import { CSS as PARTS, initials, tokens, type Cluster } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

/** The site's five clusters, as its scene has them, named, colored and grouped as the page lets you. */
export const SITE_CLUSTERS: Cluster[] = [
  {
    context: 'demo',
    // Not the first data color, a blue: on this card blue is the open row's edge alone.
    color: 7,
    group: 'Shop',
    host: '10.0.4.20:6443',
    user: 'admin',
    version: 'v1.37.1',
    latency: 12,
    current: true,
  },
  {
    context: 'prod-us-east',
    name: 'Production US',
    color: 2,
    group: 'Shop',
    host: 'api.prod-us-east.example.com',
    user: 'jane@example.com',
    version: 'v1.36.4',
    latency: 86,
    production: true,
  },
  {
    context: 'staging-eu',
    name: 'Staging EU',
    color: 3,
    group: 'Shop',
    host: 'api.staging-eu.example.com',
    user: 'jane@example.com',
    version: 'v1.36.4',
    latency: 41,
    // Pasted into Lumovi, and kept in its own folder: the footer counts it.
    added: true,
  },
  {
    context: 'kind-local',
    color: 5,
    group: 'Lab',
    host: 'kind-local:6443',
    user: 'kind-local',
    version: 'v1.37.0',
    latency: 3,
  },
  {
    context: 'legacy-onprem',
    group: 'Lab',
    host: '10.20.0.15:6443',
    user: 'admin',
    problem: 'unreachable',
  },
]

const CSS = `
body { overflow: visible; background: var(--app-bg); }
.scard { width: 420px; padding: 12px 8px 0; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 12px; line-height: 1.45; color: var(--text-2); }
.scard h3 { margin: 0; padding: 0 8px 6px; font-size: 13px; font-weight: 600; color: var(--text-1); }
.scard .heading { padding: 6px 8px 3px; font-size: 10px; line-height: 14px; }
.srow { display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 6px 8px; border-radius: 9px; }
.srow.open { background: var(--surface-3); box-shadow: inset 2px 0 0 var(--accent); }
.srow.hover { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.srow .tile { --row-bg: var(--surface-2); width: 28px; height: 28px; border-radius: 8px; font-size: 11px; }
.srow.open .tile { --row-bg: var(--surface-3); }
.srow.open .tile.plain { background: var(--surface-2); }
.srow .tile .dot { right: -3px; bottom: -3px; width: 11px; height: 11px; }
.srow .tile .dot.wait { animation: none; opacity: 0.6; }
.srow .c-text { display: grid; min-width: 0; }
.srow .c-name { display: flex; min-width: 0; align-items: center; gap: 6px; font-size: 12.5px; line-height: 18px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.srow .c-name > span:first-child { overflow: hidden; text-overflow: ellipsis; }
.srow .prod { padding: 0 5px; font-size: 10px; line-height: 15px; }
.srow .pill { padding: 0 6px; font-size: 10.5px; line-height: 15px; }
.srow.open .pill { background: var(--surface-2); }
.srow .c-where { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 15px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.srow .c-answer { min-width: 15ch; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; text-align: right; color: var(--text-3); white-space: nowrap; }
.srow .c-answer .v { color: var(--text-2); }
.srow .c-answer.bad { font-family: 'Inter', sans-serif; font-size: 11px; color: var(--critical-text); }
.sfoot { display: flex; align-items: center; gap: 6px; margin: 6px -8px 0; padding: 7px 16px; border-top: 1px solid var(--line); font-size: 11px; color: var(--text-3); white-space: nowrap; }
.sfoot .path { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--text-2); }
.sfoot .more { color: var(--text-3); }
.sheet2 { display: flex; gap: 24px; padding: 24px; align-items: flex-start; }
.col { display: flex; flex-direction: column; gap: 8px; }
.cap2 { font-size: 12px; color: var(--text-3); }
`

export type CardState = 'checking' | 'answered' | 'open'

function row(c: Cluster, state: CardState, open: boolean): string {
  const checking = state === 'checking'
  const d = checking ? 'var(--neutral)' : c.problem ? 'var(--critical)' : 'var(--good)'
  const color = c.color ? `--c: var(--series-${c.color});` : ''
  const answer = checking
    ? '<span class="c-answer">Checking…</span>'
    : c.problem
      ? '<span class="c-answer bad">Unreachable</span>'
      : `<span class="c-answer"><span class="v">${c.version}</span> · ${c.latency} ms</span>`
  // A named cluster says its context under its name; another, where it is and who signs in.
  const where = c.name ? c.context : `${c.host} · ${c.user}`
  return `<div class="srow${open ? ' open' : ''}">
    <span class="tile${c.color ? '' : ' plain'}" style="${color}">${escape(initials(c))}<span class="dot${checking ? ' wait' : ''}" style="--d:${d}"></span></span>
    <span class="c-text"><span class="c-name"><span>${escape(c.name ?? c.context)}</span>${c.production ? '<span class="prod">Production</span>' : ''}${c.current ? '<span class="pill">current</span>' : ''}</span><span class="c-where">${escape(where)}</span></span>
    ${answer}
  </div>`
}

/** The card, in one of its states: asking, answered, and with a cluster open. */
export function card(state: CardState): string {
  const groups = [...new Set(SITE_CLUSTERS.map((c) => c.group!))]
  const added = SITE_CLUSTERS.filter((c) => c.added).length
  return `<div class="scard"><h3>Clusters</h3>
    ${groups
      .map((g) => {
        const list = SITE_CLUSTERS.filter((c) => c.group === g)
        return `<div class="heading">${g}<span class="n">${list.length}</span></div>${list.map((c) => row(c, state, state === 'open' && c.context === 'prod-us-east')).join('')}`
      })
      .join('')}
    <div class="sfoot">${icon('file-text', 13)}<span class="path">~/.kube/config</span><span class="more">and ${added} added in Lumovi</span></div>
  </div>`
}

const CAPTIONS: Record<CardState, string> = {
  checking: 'Asked: every dot neutral, “Checking…”',
  answered: 'Answered: its version and how fast, or why not',
  open: 'One open: the row’s fill and blue edge, as now',
}

/** The card's three states side by side, in one theme. */
export function cardSheet(scheme: Scheme): string {
  const states: CardState[] = ['checking', 'answered', 'open']
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
${PARTS}
${CSS}
</style><div class="sheet2">${states.map((s) => `<div class="col">${card(s)}<span class="cap2">${CAPTIONS[s]}</span></div>`).join('')}</div>`
}
