/**
 * Sketches for tickets that are proposed and not yet approved: one screen each, so the idea can
 * be judged before anyone specifies or builds it (LMV-214). They're drawn with the app's own
 * parts (src/clusters.ts) and its status pill, on mock data; a sketch to decide on, not a spec.
 *
 * LMV-159 Who can · LMV-171 Search every object · LMV-172 A map of a namespace ·
 * LMV-167 A page of port forwards.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

const LEVELS: Record<Level, [string, IconName]> = {
  critical: ['critical', 'circle-x'],
  warning: ['warn', 'triangle-alert'],
  progressing: ['neutral', 'circle-dashed'],
  healthy: ['good', 'circle-check'],
  neutral: ['neutral', 'circle-minus'],
}

/** A status pill, as the app's: its level's icon, then its word. */
export const pill = (level: Level, label: string) =>
  `<span class="spill" style="--m:var(--${LEVELS[level][0]});color:var(--${LEVELS[level][0]}-text)">${icon(LEVELS[level][1], 14, 2.25)}${escape(label)}</span>`

export const CSS = `
.win { position: relative; display: flex; width: 100%; height: 100%; overflow: hidden; background: var(--app-bg); }
.side { display: flex; flex: none; width: 244px; flex-direction: column; padding-top: 40px; }
.switcher { display: flex; margin: 12px; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.switcher .d { width: 8px; height: 8px; border-radius: 50%; background: var(--good); }
.switcher b { display: block; font-size: 13px; font-weight: 500; }
.switcher small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.switcher svg.i { margin-left: auto; color: var(--text-3); }
.nav { flex: 1; min-height: 0; overflow: hidden; padding: 0 12px; }
.nav .n { display: flex; height: 28px; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.nav .n svg.i { color: var(--text-3); }
.nav .n.on { background: var(--surface-3); font-weight: 500; color: var(--text-1); box-shadow: inset 0 0 0 1px var(--line); }
.nav .n .new { margin-left: auto; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 10.5px; font-weight: 500; color: var(--accent-strong); }
.nav h3 .soon { margin-left: 8px; padding: 0 6px; border: 1px dashed var(--line-strong); border-radius: 999px; font-size: 10px; letter-spacing: 0; text-transform: none; }
.nav .n.later { opacity: 0.55; }
.nav h3 { margin: 10px 0 2px; padding: 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.main { display: flex; flex: 1; min-width: 0; flex-direction: column; margin: 8px 8px 8px 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.hdr { display: flex; flex: none; height: 52px; align-items: center; gap: 8px; padding: 0 12px; border-bottom: 1px solid var(--line); }
.hdr h1 { display: flex; flex: 1; align-items: center; gap: 10px; margin: 0; padding-left: 4px; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.hdr h1 svg.i { color: var(--text-3); }
.hdr .ns { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; font-size: 13px; font-weight: 500; color: var(--text-2); }
.hdr .ns svg.i { color: var(--text-3); }
.hdr .find { display: flex; width: 208px; height: 32px; align-items: center; gap: 8px; padding: 0 6px 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 13px; color: var(--text-3); }
.hdr .find span:first-of-type { flex: 1; }
.body { display: flex; flex: 1; min-height: 0; flex-direction: column; overflow: hidden; }
.pad { padding: 20px 24px; }
.spill { display: inline-flex; height: 22px; align-items: center; gap: 4px; padding: 0 8px 0 6px; border-radius: 999px; background: color-mix(in srgb, var(--m) 12%, transparent); font-size: 12px; line-height: 16px; font-weight: 500; white-space: nowrap; }
.lead { margin: 0; max-width: 640px; font-size: 13px; line-height: 21px; color: var(--text-2); }
.bar { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--line); }
.bar .n { margin-right: 4px; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.bar .grow { flex: 1; }
.ask { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; color: var(--text-2); }
.ask .field { min-width: 0; font-weight: 500; }
.ask .field svg.i { color: var(--text-3); }
.thead, .tr { display: grid; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); }
.thead { flex: none; height: 36px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
.thead > *, .tr > * { min-width: 0; padding: 0 12px; }
.tr { min-height: 46px; font-size: 13px; }
.tr.sel { background: var(--accent-soft); }
.tr .nm { overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.tr .nm small { display: block; font-size: 12px; font-weight: 400; color: var(--text-3); }
.tr .m { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.tr .mu { color: var(--text-3); }
.tr .r { text-align: right; font-variant-numeric: tabular-nums; }
.group { display: flex; flex: none; height: 32px; align-items: center; gap: 8px; padding: 0 24px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; font-weight: 600; color: var(--text-1); }
.group svg.i { color: var(--text-3); }
.group .c { font-weight: 400; color: var(--text-3); font-variant-numeric: tabular-nums; }
.group .end { margin-left: auto; font-weight: 400; color: var(--text-3); }
.verbs { display: flex; flex-wrap: wrap; gap: 4px; }
.verb { padding: 1px 6px; border: 1px solid var(--line); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 16px; color: var(--text-2); }
.verb { display: inline-flex; align-items: center; gap: 3px; }
.verb.w { border-color: var(--line-strong); font-weight: 500; color: var(--text-1); }
.thead .key { display: inline-flex; align-items: center; gap: 4px; margin-left: 8px; letter-spacing: 0; text-transform: none; font-weight: 400; }
.via { display: flex; min-width: 0; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent-strong); white-space: nowrap; }
.via span { overflow: hidden; text-overflow: ellipsis; }
.via small { flex: none; font-family: 'Inter', sans-serif; color: var(--text-3); }
.partial { display: flex; flex: none; align-items: center; gap: 8px; padding: 8px 24px; border-bottom: 1px solid color-mix(in srgb, var(--warn) 25%, transparent); background: color-mix(in srgb, var(--warn) 10%, transparent); font-size: 12px; line-height: 18px; color: var(--warn-text); }
.kind { display: grid; flex: none; width: 24px; height: 24px; place-items: center; border-radius: 7px; background: var(--surface-3); color: var(--text-2); }
.who { display: flex; min-width: 0; align-items: center; gap: 10px; }
.hit { background: var(--accent-soft); border-radius: 3px; box-shadow: 0 0 0 2px var(--accent-soft); color: var(--accent-strong); }
.saved { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.saved code { font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.big { display: flex; flex: 1; min-width: 0; height: 40px; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--accent); border-radius: 10px; background: var(--surface); box-shadow: 0 0 0 3px var(--accent-soft); font-size: 14px; }
.big svg.i { color: var(--text-3); }
.big .end { margin-left: auto; font-size: 12px; color: var(--text-3); white-space: nowrap; }
.foot { display: flex; flex: none; align-items: center; gap: 8px; padding: 10px 24px; border-top: 1px solid var(--line); font-size: 12px; color: var(--text-3); }

/* The map. */
.map { position: relative; flex: 1; min-height: 0; overflow: hidden; background: color-mix(in srgb, var(--surface-2) 60%, transparent); }
.lane { position: absolute; top: 44px; bottom: 16px; border: 1px dashed var(--line-strong); border-radius: 14px; }
.lane > b { position: absolute; top: -10px; left: 14px; padding: 0 8px; background: var(--surface); border-radius: 6px; font-size: 12px; font-weight: 600; }
.lane > b small { margin-left: 6px; font-weight: 400; color: var(--text-3); }
.cols { position: absolute; top: 14px; left: 0; right: 0; display: flex; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.cols span { position: absolute; }
.mnode { position: absolute; display: flex; width: 190px; height: 48px; align-items: center; gap: 10px; padding: 0 10px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-panel); }
.mnode.sel { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.mnode.dim { opacity: 0.4; }
.mnode .kind { width: 28px; height: 28px; border-radius: 8px; }
.mnode .t { min-width: 0; flex: 1; }
.mnode .t b { display: block; overflow: hidden; font-size: 12.5px; line-height: 16px; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.mnode .t small { display: flex; align-items: center; gap: 4px; font-size: 11px; line-height: 15px; white-space: nowrap; }
.mnode .t small svg.i { flex: none; }
.mnode .x { flex: none; font-size: 11px; color: var(--text-3); font-variant-numeric: tabular-nums; }
svg.wires { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.legend { position: absolute; right: 16px; bottom: 16px; display: flex; gap: 14px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 11px; color: var(--text-3); }
.legend i { display: inline-block; width: 18px; margin-right: 6px; vertical-align: middle; border-top: 2px solid var(--line-strong); }
.legend i.w { border-color: var(--warn); }
.legend i.d { border-top-style: dashed; }
.seg span { white-space: nowrap; }

/* What a sketch adds, said under the window and on the parts themselves. */
.nw { margin-left: 6px; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 10.5px; font-style: normal; font-weight: 500; color: var(--accent-strong); }
.strip { display: flex; height: 44px; align-items: center; gap: 20px; padding: 0 20px; border-top: 1px solid var(--line-strong); background: var(--surface-2); font-size: 12.5px; color: var(--text-2); white-space: nowrap; overflow: hidden; }
.strip b { margin-right: 6px; font-weight: 600; color: var(--text-1); }
.strip .nw { margin: 0 6px 0 0; }

/* Port forwards. */
.pf .tr { min-height: 56px; }
.addr { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; }
.addr svg.i { color: var(--text-3); }
.addr a { color: var(--accent-strong); }
.why { display: block; margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--critical-text); }
.acts { display: flex; justify-content: flex-end; gap: 4px; }
.wide { display: inline-flex; align-items: center; gap: 4px; padding: 0 6px; border-radius: 4px; background: color-mix(in srgb, var(--warn) 12%, transparent); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--warn-text); }
`

/** The sidebar as the app has it today. */
const NAV: ([string, IconName] | string)[] = [
  ['Overview', 'layout-dashboard'],
  ['Workloads', 'boxes'],
  ['Pods', 'box'],
  ['Metrics', 'chart-spline'],
  ['Helm releases', 'ship-wheel'],
  'Cluster',
  ['Nodes', 'server'],
  ['Namespaces', 'layout-grid'],
  ['Events', 'activity'],
  'Network',
  ['Services', 'network'],
  ['Ingresses', 'globe'],
  ['Network Policies', 'shield-check'],
  ['Gateway API', 'link'],
  'Configuration',
  ['ConfigMaps', 'file-code-2'],
  ['Secrets', 'key-round'],
  'Storage',
  ['Volume Claims', 'database'],
  ['Volumes', 'layers'],
  ['Storage Classes', 'folder'],
]

/** Access control's pages, which LMV-158 adds (approved, not built yet): where Who can lives. */
const ACCESS: [string, IconName][] = [
  ['Roles', 'shield-check'],
  ['Role bindings', 'link'],
  ['Service accounts', 'users'],
]

/** The app's window: its sidebar with one more item where the proposal puts it, and a page. */
export function shell(
  title: string,
  glyph: IconName,
  add: {
    after: string
    label: string
    icon: IconName
    tag?: string
    section?: string
    current?: string
    /** The section's other rows, in order; the one named by label is the new row. */
    items?: [string, IconName, string?][]
  },
  body: string,
  namespace = 'shop',
): string {
  const fresh = `<div class="n${add.current ? '' : ' on'}">${icon(add.icon, 16)}${add.label}${add.tag === '' ? '' : `<span class="new">${add.tag ?? 'new'}</span>`}</div>`
  const items = NAV.flatMap((n) => {
    const row =
      typeof n === 'string'
        ? `<h3>${n}</h3>`
        : `<div class="n${n[0] === add.current ? ' on' : ''}">${icon(n[1], 16)}${n[0]}</div>`
    return typeof n !== 'string' && n[0] === add.after ? [row, fresh] : [row]
  }).join('')
  // Who can sits in a section of its own, which another ticket brings.
  const access =
    add.after === 'Access control'
      ? `<h3>Access control<span class="soon">LMV-158</span></h3>${ACCESS.map(([l, g]) => `<div class="n later">${icon(g, 16)}${l}</div>`).join('')}${fresh}`
      : add.section
        ? // A section of its own after Storage, as the sidebar's Add-ons is today.
          `<h3>${add.section}</h3>${
            add.items
              ? add.items
                  .map(([l, g, n]) =>
                    l === add.label
                      ? fresh
                      : `<div class="n">${icon(g, 16)}${l}${n ? `<span style="margin-left:auto;font-size:11px;color:var(--text-3)">${n}</span>` : ''}</div>`,
                  )
                  .join('')
              : fresh
          }`
        : ''
  return `<div class="win"><aside class="side">
    <div class="switcher"><span class="d"></span><span><b>production</b><small>Kubernetes v1.34.1</small></span>${icon('chevrons-up-down', 16)}</div>
    <nav class="nav">${items}${access}</nav>
  </aside><div class="main">
    <header class="hdr"><span class="icon-btn">${icon('arrow-left', 16)}</span><span class="icon-btn" style="margin-left:-8px;opacity:0.45">${icon('arrow-right', 16)}</span><h1>${icon(glyph, 16)}${title}</h1><span class="ns">${icon('layout-grid', 14)}${namespace}${icon('chevron-down', 14)}</span><span class="find">${icon('search', 14)}<span>Search…</span><span class="kbd">⌘</span><span class="kbd">K</span></span><span class="icon-btn">${icon('plus', 16)}</span><span class="icon-btn">${icon('cable', 16)}</span><span class="icon-btn">${icon('history', 16)}</span><span class="icon-btn">${icon('rotate-cw', 16)}</span></header>
    <div class="body">${body}</div>
  </div></div>`
}

const select = (glyph: IconName, text: string, mono = false) =>
  `<span class="field${mono ? ' mono' : ''}">${icon(glyph, 14)}${escape(text)}<span class="end">${icon('chevrons-up-down', 14)}</span></span>`

export const seg = (items: string[], on: string) =>
  `<span class="seg">${items.map((i) => `<span${i === on ? ' class="on"' : ''}>${i}</span>`).join('')}</span>`

const verbs = (list: string, writes = 'create update patch delete deletecollection *') =>
  `<span class="verbs">${list
    .split(' ')
    .map((v) =>
      writes.split(' ').includes(v)
        ? `<span class="verb w">${icon('pencil', 10, 2.25)}${v}</span>`
        : `<span class="verb">${v}</span>`,
    )
    .join('')}</span>`

const via = (binding: string, role: string) =>
  `<span class="via">${icon('link', 12)}<span>${binding}</span><small>→ ${role}</small></span>`

// ─── LMV-159: Who can ──────────────────────────────────────────────────────────────────────

const PARTIAL = `<div class="partial">${icon('triangle-alert', 14)}You can’t read Roles in <b style="font-weight:600;margin:0 3px">payments</b> and <b style="font-weight:600;margin:0 3px">kube-system</b>, so anything granted there is missing from this answer.</div>`

function whoCanSubject(): string {
  const G = 'grid-template-columns: minmax(180px, 1.1fr) minmax(260px, 1.6fr) minmax(260px, 1.4fr)'
  const row = (what: string, v: string, b: string, r: string) =>
    `<div class="tr" style="${G}"><span class="m" style="color:var(--text-1)">${what}</span><span>${verbs(v)}</span>${via(b, r)}</div>`
  const group = (ns: string, n: number, note = '') =>
    `<div class="group">${icon('layout-grid', 14)}${ns}<span class="c">${n}</span>${note ? `<span class="end">${note}</span>` : ''}</div>`
  return shell(
    'Who can',
    'key-round',
    { after: 'Access control', label: 'Who can', icon: 'key-round' },
    `<div class="bar" style="padding:16px 24px">${seg(['What can a subject do?', 'Who can do something?'], 'What can a subject do?')}<span class="ask" style="margin-left:8px">What can ${select('users', 'ServiceAccount shop/checkout', true)} do</span></div>
    ${PARTIAL}
    <div class="thead" style="${G}"><span>On</span><span>It may<span class="key">${icon('pencil', 10, 2.25)}changes things</span></span><span>Granted by</span></div>
    ${group('shop', 4)}
    ${row('configmaps', 'get list watch', 'checkout-reads-config', 'Role/config-reader')}
    ${row('secrets (payments-credentials)', 'get', 'checkout-reads-credentials', 'Role/one-secret')}
    ${row('pods, pods/log', 'get list watch', 'shop-viewers', 'ClusterRole/view')}
    ${row('leases.coordination.k8s.io', 'get create update', 'checkout-leader-election', 'Role/leader-election')}
    ${group('batch', 1)}
    ${row('jobs.batch', 'create get delete', 'checkout-runs-jobs', 'Role/job-runner')}
    ${group('Everywhere', 2, 'From ClusterRoleBindings')}
    ${row('namespaces', 'get list', 'all-serviceaccounts-discover', 'ClusterRole/discovery')}
    ${row('nodes', 'get list', 'all-serviceaccounts-discover', 'ClusterRole/discovery')}
    <div class="foot">${icon('info', 14)}Worked out from the Roles and bindings you may read.</div>`,
    'All namespaces',
  )
}

function whoCanAction(): string {
  const G = 'grid-template-columns: minmax(280px, 1.4fr) 150px minmax(260px, 1.4fr) 110px'
  const row = (
    kind: IconName,
    name: string,
    sub: string,
    type: string,
    b: string,
    r: string,
    scope: string,
  ) =>
    `<div class="tr" style="${G}"><span class="who"><span class="kind">${icon(kind, 14)}</span><span class="nm">${name}<small>${sub}</small></span></span><span class="mu">${type}</span>${via(b, r)}<span class="mu">${scope}</span></div>`
  return shell(
    'Who can',
    'key-round',
    { after: 'Access control', label: 'Who can', icon: 'key-round' },
    `<div class="bar" style="padding:16px 24px">${seg(['What can a subject do?', 'Who can do something?'], 'Who can do something?')}<span class="ask" style="margin-left:8px">Who can ${select('pencil', 'delete', true)} ${select('key-round', 'secrets', true)} in ${select('layout-grid', 'shop')}</span></div>
    <div class="bar"><span class="n">5 subjects</span><span class="saved">${icon('users', 12)}Groups 2</span><span class="saved">${icon('users', 12)}Users 1</span><span class="saved">${icon('box', 12)}Service accounts 2</span></div>
    <div class="thead" style="${G}"><span>Subject</span><span>Kind</span><span>Granted by</span><span>Reach</span></div>
    ${row('users', 'platform-team', '6 members, by your sign-in provider', 'Group', 'platform-admins', 'ClusterRole/cluster-admin', 'Everywhere')}
    ${row('users', 'shop-owners', '3 members', 'Group', 'shop-owners', 'ClusterRole/admin', 'shop')}
    ${row('users', 'jane@example.com', '', 'User', 'jane-breakglass', 'ClusterRole/admin', 'shop')}
    ${row('box', 'argocd-application-controller', 'argocd', 'ServiceAccount', 'argocd-manages-everything', 'ClusterRole/cluster-admin', 'Everywhere')}
    ${row('box', 'external-secrets', 'external-secrets', 'ServiceAccount', 'external-secrets-writes', 'ClusterRole/secret-writer', 'Everywhere')}
    <div class="foot">${icon('info', 14)}Complete: you can read every Role and binding that reaches shop.</div>`,
    'shop',
  )
}

// ─── LMV-171: search every object ──────────────────────────────────────────────────────────

function searchPage(): string {
  const G =
    'grid-template-columns: minmax(300px, 1.6fr) 150px minmax(170px, 1fr) minmax(220px, 1.2fr) 64px'
  const hit = (name: string) => name.replace('checkout', '<span class="hit">checkout</span>')
  const row = (name: string, ns: string, status: string, note: string, age: string) =>
    `<div class="tr" style="${G}"><span class="nm">${hit(name)}</span><span class="mu">${ns}</span><span>${status}</span><span class="m">${note}</span><span class="r mu">${age}</span></div>`
  const group = (glyph: IconName, kind: string, n: number) =>
    `<div class="group">${icon(glyph, 14)}${kind}<span class="c">${n}</span></div>`
  return shell(
    'Search',
    'search',
    { after: 'Helm releases', label: 'Search', icon: 'search' },
    `<div class="bar" style="padding:16px 24px"><span class="big">${icon('search', 16)}checkout<span class="caret" style="height:17px;margin:0 0 0 -8px"></span><span class="end">12 objects of 6 kinds · 0.4 s</span></span><span class="btn secondary">${icon('plus', 16)}Save this search</span></div>
    <div class="bar"><span class="n" style="color:var(--text-3)">Saved</span><span class="saved"><code>app=checkout</code><span class="kbd">1</span></span><span class="saved"><code>tier=frontend</code><span class="kbd">2</span></span><span class="saved">not ready<span class="kbd">3</span></span><span class="grow"></span><span class="n" style="color:var(--text-3)">A name, part of one, or key=value</span></div>
    <div class="thead" style="${G}"><span>Name</span><span>Namespace</span><span>Status</span><span></span><span style="text-align:right">Age</span></div>
    ${group('layers', 'Deployments', 1)}
    ${row('checkout', 'shop', pill('warning', 'Degraded'), '1/3 ready', '88d')}
    ${group('box', 'Pods', 3)}
    ${row('checkout-jzhdh6j29h-hqnnn', 'shop', pill('critical', 'CrashLoopBackOff'), '14 restarts', '47m')}
    ${row('checkout-jzhdh6j29h-pwkd2', 'shop', pill('critical', 'CrashLoopBackOff'), '13 restarts', '46m')}
    ${row('checkout-jzhdh6j29h-lnk52', 'shop', pill('healthy', 'Running'), '', '6d')}
    ${group('network', 'Services', 2)}
    ${row('checkout', 'shop', '<span class="mu">—</span>', 'ClusterIP 10.96.44.201', '88d')}
    ${row('checkout-canary', 'staging', '<span class="mu">—</span>', 'ClusterIP 10.96.51.17', '12d')}
    ${group('file-code-2', 'ConfigMaps', 2)}
    ${row('checkout-settings', 'shop', '<span class="mu">—</span>', '4 keys', '88d')}
    ${row('checkout-feature-flags', 'shop', '<span class="mu">—</span>', '1 key', '31d')}
    ${group('globe', 'HTTPRoutes', 1)}
    ${row('checkout', 'shop', pill('healthy', 'Accepted'), 'checkout.shop.example.com', '88d')}
    <div class="foot">${icon('info', 14)}In the namespaces chosen in the header, among the kinds you may list. Secrets and ConfigMaps are found by their names and labels, never by what they hold.</div>`,
    'All namespaces',
  )
}

function searchPalette(scheme: Scheme): string {
  const item = (glyph: IconName, name: string, sub: string, right: string, on = false) =>
    `<div class="item${on ? ' hl' : ''}" style="height:40px;gap:12px;padding:0 10px;font-size:13.5px">${icon(glyph, 16)}<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${name.replace('checkout', '<span class="hit">checkout</span>')}<small style="margin-left:8px;font-size:12px;color:var(--text-3)">${sub}</small></span>${right}</div>`
  void scheme
  return `${searchPage().replace('</div></div>', '</div></div>')}<div class="scrim"></div>
  <div class="menu" style="z-index:30;top:108px;left:50%;width:640px;transform:translateX(-50%);padding:0;border-radius:16px">
    <div style="display:flex;height:48px;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid var(--line);font-size:14px">${icon('search', 16, 2, 'color:var(--text-3)')}checkout<span class="caret" style="height:17px;margin:0 0 0 -8px"></span></div>
    <div style="padding:6px">
      <div class="label">Go to</div>
      ${item('layers', 'Deployments', '', '<span class="keys"><span class="kbd">G</span><span class="kbd">D</span></span>')}
      <div class="label">Objects matching “checkout”<span style="float:right;letter-spacing:0;text-transform:none;font-weight:400">12 in this cluster</span></div>
      ${item('layers', 'checkout', 'Deployment · shop', pill('warning', 'Degraded'), true)}
      ${item('box', 'checkout-jzhdh6j29h-hqnnn', 'Pod · shop', pill('critical', 'CrashLoopBackOff'))}
      ${item('box', 'checkout-jzhdh6j29h-pwkd2', 'Pod · shop', pill('critical', 'CrashLoopBackOff'))}
      ${item('network', 'checkout', 'Service · shop', '')}
      ${item('search', 'See all 12 on the Search page', '', '<span class="keys"><span class="kbd">⌘</span><span class="kbd">↵</span></span>')}
    </div>
  </div>`
}

// ─── LMV-172: a map of a namespace ─────────────────────────────────────────────────────────

interface MapNode {
  id: string
  col: number
  row: number
  kind: IconName
  type: string
  name: string
  level?: Level
  status?: string
  count?: string
  sel?: boolean
  dim?: boolean
}

const COLS = [28, 258, 488, 718, 948]
const COL_NAMES = ['Routes', 'Services', 'Workloads', 'Pods', 'Config and storage']

function mapView(nodes: MapNode[], wires: [string, string, ('w' | 'd')?][], laneTop = 70): string {
  const at = (n: MapNode) => ({ x: COLS[n.col]!, y: laneTop + n.row * 62 })
  const by = new Map(nodes.map((n) => [n.id, n]))
  const paths = wires
    .map(([a, b, kind]) => {
      const p = at(by.get(a)!)
      const q = at(by.get(b)!)
      const x1 = p.x + 190
      const y1 = p.y + 24
      const x2 = q.x
      const y2 = q.y + 24
      const mx = (x1 + x2) / 2
      return `<path d="M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="var(--${kind === 'w' ? 'warn' : 'line-strong'})" stroke-width="${kind === 'w' ? 2 : 1.5}"${kind === 'd' ? ' stroke-dasharray="4 4"' : ''}/>`
    })
    .join('')
  const cards = nodes
    .map((n) => {
      const { x, y } = at(n)
      const status = n.level
        ? `<small style="color:var(--${LEVELS[n.level][0]}-text)">${icon(LEVELS[n.level][1], 11, 2.5)}${n.status}</small>`
        : `<small style="color:var(--text-3)">${n.type}</small>`
      return `<div class="mnode${n.sel ? ' sel' : ''}${n.dim ? ' dim' : ''}" style="left:${x}px;top:${y}px"><span class="kind">${icon(n.kind, 14)}</span><span class="t"><b>${n.name}</b>${status}</span>${n.count ? `<span class="x">${n.count}</span>` : ''}</div>`
    })
    .join('')
  return `<div class="cols">${COL_NAMES.map((c, i) => `<span style="left:${COLS[i]! + 2}px">${c}</span>`).join('')}</div><svg class="wires">${paths}</svg>${cards}`
}

function mapPage(): string {
  const nodes: MapNode[] = [
    {
      id: 'r1',
      col: 0,
      row: 0,
      kind: 'globe',
      type: 'HTTPRoute',
      name: 'storefront',
      level: 'healthy',
      status: 'Accepted',
    },
    {
      id: 'r2',
      col: 0,
      row: 1,
      kind: 'globe',
      type: 'HTTPRoute',
      name: 'checkout',
      level: 'healthy',
      status: 'Accepted',
    },
    {
      id: 's1',
      col: 1,
      row: 0,
      kind: 'network',
      type: 'Service',
      name: 'storefront',
      level: 'healthy',
      status: '2 pods',
    },
    {
      id: 's2',
      col: 1,
      row: 1,
      kind: 'network',
      type: 'Service',
      name: 'checkout',
      level: 'warning',
      status: 'No pods',
      sel: true,
    },
    {
      id: 's3',
      col: 1,
      row: 2,
      kind: 'network',
      type: 'Service',
      name: 'cart',
      level: 'healthy',
      status: '2 pods',
    },
    {
      id: 's4',
      col: 1,
      row: 3,
      kind: 'network',
      type: 'Service',
      name: 'redis',
      level: 'healthy',
      status: '1 pod',
    },
    {
      id: 'w1',
      col: 2,
      row: 0,
      kind: 'layers',
      type: 'Deployment',
      name: 'storefront',
      level: 'healthy',
      status: 'Ready',
      count: '2/2',
    },
    {
      id: 'w2',
      col: 2,
      row: 1,
      kind: 'layers',
      type: 'Deployment',
      name: 'checkout',
      level: 'warning',
      status: 'Degraded',
      count: '1/3',
    },
    {
      id: 'w3',
      col: 2,
      row: 2,
      kind: 'layers',
      type: 'Deployment',
      name: 'cart',
      level: 'healthy',
      status: 'Ready',
      count: '2/2',
    },
    {
      id: 'w4',
      col: 2,
      row: 3,
      kind: 'database',
      type: 'StatefulSet',
      name: 'redis',
      level: 'healthy',
      status: 'Ready',
      count: '1/1',
    },
    {
      id: 'w5',
      col: 2,
      row: 4,
      kind: 'clock',
      type: 'CronJob',
      name: 'reindex-nightly',
      level: 'neutral',
      status: 'Scheduled',
    },
    {
      id: 'p1',
      col: 3,
      row: 0,
      kind: 'box',
      type: 'Pods',
      name: '2 pods',
      level: 'healthy',
      status: 'Running',
    },
    {
      id: 'p2',
      col: 3,
      row: 1,
      kind: 'box',
      type: 'Pods',
      name: 'checkout-…-hqnnn',
      level: 'critical',
      status: 'CrashLoopBackOff',
    },
    {
      id: 'p3',
      col: 3,
      row: 2,
      kind: 'box',
      type: 'Pods',
      name: 'checkout-…-pwkd2',
      level: 'critical',
      status: 'CrashLoopBackOff',
    },
    {
      id: 'p4',
      col: 3,
      row: 3,
      kind: 'box',
      type: 'Pods',
      name: 'checkout-…-lnk52',
      level: 'healthy',
      status: 'Running',
    },
    {
      id: 'p5',
      col: 3,
      row: 4,
      kind: 'box',
      type: 'Pods',
      name: '3 more pods',
      level: 'healthy',
      status: 'Running',
    },
    { id: 'c1', col: 4, row: 1, kind: 'file-code-2', type: 'ConfigMap', name: 'checkout-settings' },
    { id: 'c2', col: 4, row: 2, kind: 'key-round', type: 'Secret', name: 'payments-credentials' },
    {
      id: 'c3',
      col: 4,
      row: 3,
      kind: 'database',
      type: 'PersistentVolumeClaim',
      name: 'redis-data',
      level: 'healthy',
      status: 'Bound',
    },
  ]
  const wires: [string, string, ('w' | 'd')?][] = [
    ['r1', 's1'],
    ['r2', 's2', 'w'],
    ['s1', 'w1'],
    ['s2', 'w2', 'w'],
    ['s3', 'w3'],
    ['s4', 'w4'],
    ['w1', 'p1'],
    ['w2', 'p2'],
    ['w2', 'p3'],
    ['w2', 'p4'],
    ['w3', 'p5'],
    ['w4', 'p5'],
    ['p2', 'c1', 'd'],
    ['p3', 'c2', 'd'],
    ['p5', 'c3', 'd'],
  ]
  return shell(
    'Map',
    'network',
    { after: 'Pods', label: 'Map', icon: 'network' },
    `<div class="bar"><span class="n">19 objects in shop</span><span class="saved">${icon('triangle-alert', 12, 2, 'color:var(--warn-text)')}Warning 2</span><span class="saved">${icon('circle-x', 12, 2, 'color:var(--critical-text)')}Failing 2</span><span class="grow"></span>${seg(['Map', 'List'], 'Map')}<span class="btn ghost sm">${icon('layers', 14)}Group by namespace${icon('chevron-down', 14)}</span><span class="field" style="width:200px;color:var(--text-3)">${icon('search', 14)}Find in the map</span></div>
    <div class="map">
      <div class="lane" style="left:14px;right:14px"><b>shop<small>19 objects</small></b></div>
      ${mapView(nodes, wires)}
      <div class="legend"><span><i></i>Routes to, owns</span><span><i class="w"></i>Something’s missing</span><span><i class="d"></i>Uses</span></div>
    </div>`,
  )
}

function mapLarge(): string {
  const ws = (
    id: string,
    row: number,
    name: string,
    level: Level,
    status: string,
    count: string,
    kind: IconName = 'layers',
  ): MapNode => ({
    id,
    col: 2,
    row,
    kind,
    type: 'Deployment',
    name,
    level,
    status,
    count,
  })
  const nodes: MapNode[] = [
    {
      id: 'r',
      col: 0,
      row: 1,
      kind: 'globe',
      type: 'HTTPRoute',
      name: '14 routes',
      level: 'healthy',
      status: 'All accepted',
    },
    {
      id: 's',
      col: 1,
      row: 0,
      kind: 'network',
      type: 'Service',
      name: 'storefront',
      level: 'healthy',
      status: '24 pods',
    },
    {
      id: 's2',
      col: 1,
      row: 1,
      kind: 'network',
      type: 'Service',
      name: 'checkout',
      level: 'warning',
      status: 'No pods',
    },
    {
      id: 's3',
      col: 1,
      row: 2,
      kind: 'network',
      type: 'Service',
      name: '31 more services',
      level: 'healthy',
      status: 'All with pods',
    },
    ws('a', 0, 'storefront', 'healthy', 'Ready', '24/24'),
    ws('b', 1, 'checkout', 'warning', 'Degraded', '1/3'),
    ws('c', 2, 'search-indexer', 'critical', 'Unavailable', '0/6'),
    ws('d', 3, '58 more workloads', 'healthy', 'All ready', ''),
    {
      id: 'p',
      col: 3,
      row: 1,
      kind: 'box',
      type: 'Pods',
      name: '1,263 pods',
      level: 'warning',
      status: '8 not running',
    },
    { id: 'c', col: 4, row: 1, kind: 'file-code-2', type: 'Config', name: '212 config objects' },
  ]
  return shell(
    'Map',
    'network',
    { after: 'Pods', label: 'Map', icon: 'network' },
    `<div class="bar"><span class="n">1,502 objects in shop</span><span class="saved">${icon('triangle-alert', 12, 2, 'color:var(--warn-text)')}Warning 9</span><span class="saved">${icon('circle-x', 12, 2, 'color:var(--critical-text)')}Failing 7</span><span class="grow"></span>${seg(['Map', 'List'], 'Map')}<span class="btn ghost sm">${icon('layers', 14)}Group by namespace${icon('chevron-down', 14)}</span><span class="field" style="width:200px;color:var(--text-3)">${icon('search', 14)}Find in the map</span></div>
    <div class="partial" style="border-color:var(--line);background:var(--surface-2);color:var(--text-2)">${icon('info', 14)}Too many to draw one by one: pods are counted on their workload, and what’s healthy is gathered. Open a workload to see its pods.</div>
    <div class="map">
      <div class="lane" style="left:14px;right:14px"><b>shop<small>1,502 objects</small></b></div>
      ${mapView(nodes, [
        ['r', 's'],
        ['r', 's2', 'w'],
        ['r', 's3'],
        ['s', 'a'],
        ['s2', 'b', 'w'],
        ['s3', 'c'],
        ['s3', 'd'],
        ['a', 'p'],
        ['b', 'p'],
        ['c', 'p'],
        ['d', 'p'],
        ['p', 'c', 'd'],
      ])}
      <div class="legend"><span><i></i>Routes to, owns</span><span><i class="w"></i>Something’s missing</span><span><i class="d"></i>Uses</span></div>
    </div>`,
  )
}

// ─── LMV-167: port forwards ────────────────────────────────────────────────────────────────

function forwardsPage(): string {
  const G = 'grid-template-columns: minmax(210px, 1.1fr) minmax(220px, 1.2fr) 330px 150px 140px'
  const row = (
    name: string,
    sub: string,
    target: string,
    local: string,
    status: string,
    acts: string,
    extra = '',
  ) =>
    `<div class="tr" style="${G}"><span class="nm">${name}<small>${sub}</small></span><span class="m">${target}</span><span>${local}</span><span>${status}${extra}</span><span class="acts">${acts}</span></div>`
  const local = (addr: string, wide = false) =>
    `<span class="addr">${icon('cable', 14)}${addr}${wide ? `<span class="wide">${icon('triangle-alert', 11, 2.5)}Open to your network</span>` : ''}</span>`
  const b = (glyph: IconName, label: string) =>
    `<span class="btn secondary sm">${icon(glyph, 14)}${label}</span>`
  const more = `<span class="icon-btn" style="width:28px;height:28px">${icon('ellipsis', 16)}</span>`
  return shell(
    'Port forwards',
    'cable',
    { after: 'Gateway API', label: 'Port forwards', icon: 'cable' },
    `<div class="bar"><span class="n">2 running, 1 dropped, 2 saved</span><span class="grow"></span><span class="btn ghost sm">${icon('rotate-cw', 14)}Start all saved</span><span class="btn secondary">${icon('plus', 16)}Forward a port</span></div>
    <div class="pf" style="display:flex;flex:1;min-height:0;flex-direction:column">
    <div class="thead" style="${G}"><span>Name</span><span>To</span><span>On this computer</span><span>Status</span><span></span></div>
    <div class="group">Running<span class="c">2</span></div>
    ${row('Grafana', 'Saved · restored when you connect', 'Service/grafana:3000 · monitoring', local('localhost:3000'), pill('healthy', 'Forwarding'), `${b('external-link', 'Open')}${more}`)}
    ${row('checkout, to debug', 'This session only', 'Pod/checkout-jzhdh6j29h-lnk52:8080 · shop', local('0.0.0.0:8080', true), pill('healthy', 'Forwarding'), `${b('external-link', 'Open')}${more}`)}
    <div class="group">Dropped<span class="c">1</span></div>
    ${row('Postgres', 'Saved', 'Service/postgres:5432 · data', local('localhost:5432'), pill('critical', 'Dropped'), `${b('rotate-cw', 'Retry')}${more}`, '<span class="why">Its pod was replaced 2 minutes ago.</span>')}
    <div class="group">Saved, not running<span class="c">2</span></div>
    ${row('Prometheus', 'Saved', 'Service/prometheus:9090 · monitoring', local('localhost:9090'), pill('neutral', 'Stopped'), `${b('play', 'Start')}${more}`)}
    ${row('Argo CD', 'Saved · opens as https', 'Service/argocd-server:443 · argocd', local('localhost:8443'), pill('neutral', 'Stopped'), `${b('play', 'Start')}${more}`)}
    </div>
    <div class="foot">${icon('info', 14)}Saved forwards are kept for this cluster on this computer. A forward listens on localhost unless you choose otherwise.</div>`,
    'All namespaces',
  )
}

function forwardDialog(): string {
  return `${forwardsPage()}<div class="scrim"></div><div class="dialog" style="top:14%;width:480px">
    <div class="head"><div class="glyph">${icon('cable', 18)}</div><div><h3>Forward a port to grafana</h3><div class="sub">Service · monitoring · production</div></div></div>
    <div class="body">
      <div class="form" style="grid-template-columns:128px 1fr">
        <span class="lbl mid">Its port</span><span class="field">3000 · http<span class="end">${icon('chevrons-up-down', 14)}</span></span>
        <span class="lbl">On this computer</span><div><span class="field" style="border-color:var(--critical);box-shadow:0 0 0 3px color-mix(in srgb, var(--critical) 15%, transparent)">3000</span><p class="field-help" style="color:var(--critical-text)"><i class="nw" style="margin:0 6px 0 0">new</i>Port 3000 is taken by another program. <span style="font-weight:500;color:var(--accent-strong)">Use 3001</span>, which is free.</p></div>
        <span class="lbl">Listen on<i class="nw">new</i></span><div>${seg(['localhost', 'Every address'], 'localhost')}<p class="field-help">Only this computer can reach it.</p></div>
        <span class="lbl mid">Open as<i class="nw">new</i></span>${seg(['http', 'https'], 'http')}
        <div class="rule"></div>
        <div class="toggle"><span class="switch on"></span><div class="what"><div class="t">Save it<i class="nw">new</i></div><div class="d">Kept for this cluster, and started again when you connect.</div></div></div>
      </div>
    </div>
    <div class="actions"><span class="btn ghost">Cancel</span><span class="btn primary off" style="min-width:80px">Forward</span></div>
  </div>`
}

// ─── The sketches ──────────────────────────────────────────────────────────────────────────

export type Sketch =
  | 'who-can-subject'
  | 'who-can-action'
  | 'search-page'
  | 'search-palette'
  | 'map-namespace'
  | 'map-large'
  | 'forwards-page'
  | 'forwards-dialog'

export const SKETCHES: { id: Sketch; ticket: string; title: string }[] = [
  { id: 'who-can-subject', ticket: 'LMV-159', title: 'Who can: what a subject may do' },
  { id: 'who-can-action', ticket: 'LMV-159', title: 'Who can: who may do something' },
  { id: 'search-page', ticket: 'LMV-171', title: 'Search: its own page' },
  { id: 'search-palette', ticket: 'LMV-171', title: 'Search: from the palette' },
  { id: 'map-namespace', ticket: 'LMV-172', title: 'Map: a namespace' },
  { id: 'map-large', ticket: 'LMV-172', title: 'Map: a large namespace, gathered' },
  { id: 'forwards-page', ticket: 'LMV-167', title: 'Port forwards: the page' },
  { id: 'forwards-dialog', ticket: 'LMV-167', title: 'Port forwards: starting one' },
]

export const WINDOW: Size = { width: 1440, height: 944 }

/** What exists today, and what the sketch adds: said under each window. */
const STRIP: Record<Sketch, [string, string]> = {
  'who-can-subject': [
    'Why your own action is forbidden. No way to ask about someone else.',
    'The Who can page. The Access control section around it comes with LMV-158, approved and not built yet.',
  ],
  'who-can-action': [
    'Why your own action is forbidden. No way to ask about someone else.',
    'The same page, asked the other way round.',
  ],
  'search-page': [
    'The palette finds views, kinds and what’s already loaded.',
    'A Search page: every kind, by name or label, grouped by kind, with saved searches.',
  ],
  'search-palette': [
    'The palette finds views, kinds and what’s already loaded.',
    'The palette also finds objects across the cluster, and leads to the page.',
  ],
  'map-namespace': [
    'A Map tab on each object, for what it’s connected to.',
    'A Map page for a whole namespace, with the same cards, lines and legend.',
  ],
  'map-large': [
    'A Map tab on each object, for what it’s connected to.',
    'On a large namespace, what’s healthy is gathered and pods are counted.',
  ],
  'forwards-page': [
    'The header’s forwards button lists what’s running, for this session.',
    'A page: saved forwards, dropped ones with why, and Start. The header’s button stays.',
  ],
  'forwards-dialog': [
    'The dialog asks its port and a local port.',
    'The taken-port check, Listen on, Open as and Save it, each marked.',
  ],
}

/** A sketch, in one theme, in the app's default window. */
export function sketchPage(id: Sketch, scheme: Scheme): string {
  const body = {
    'who-can-subject': whoCanSubject,
    'who-can-action': whoCanAction,
    'search-page': searchPage,
    'search-palette': () => searchPalette(scheme),
    'map-namespace': mapPage,
    'map-large': mapLarge,
    'forwards-page': forwardsPage,
    'forwards-dialog': forwardDialog,
  }[id]()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${WINDOW.width}px; height: ${WINDOW.height}px; }
${PARTS}
${CSS}
html, body { height: ${WINDOW.height}px; }
.win { height: ${WINDOW.height - 44}px; }
.scrim { bottom: 44px; }
</style>${body}<div class="strip" style="position:absolute;left:0;right:0;bottom:0;z-index:50"><span><b>Today</b>${STRIP[id][0]}</span><span><span class="nw">new</span>${STRIP[id][1]}</span></div>`
}
