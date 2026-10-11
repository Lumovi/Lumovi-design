/**
 * The Plugins page as it's built first (LMV-253): every plugin Lumovi has and every one of your
 * own, read-only. What each may change and read is said from its file, in docs' words; nothing
 * is fetched, so nothing here speaks of updates, a store or a review. Redrawn from the sketch in
 * `store.ts` for what has been decided since: one `kind: Plugin`, kinds a plugin shows and
 * can't change, actions that ask first or run at once, and a plugin of yours taking the place of
 * Lumovi's of the same name.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as PLUGIN } from './plugins.ts'
import { CSS as SHELL, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'
import { CSS as STORE } from './store.ts'

const CSS = `
.prow { grid-template-columns: 36px minmax(0, 1.5fr) minmax(0, 1.3fr) minmax(0, 1fr); }
.prow .nm b { overflow-wrap: anywhere; }
.prow.off .glyph, .prow.off .nm b { color: var(--text-3); }
.prow .here.warn { align-items: flex-start; white-space: normal; color: var(--warn-text); }
.prow .here.warn svg.i { margin-top: 2px; color: var(--warn-text); }
.prow .here.warn b { font-weight: 600; }
.prow .here small { display: block; color: var(--text-3); }
.open { grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); }
.open p { margin: 0 0 6px; }
.open p.q { color: var(--text-3); }
.open .acts small.run { display: inline-flex; margin-top: 2px; padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-weight: 600; color: var(--text-1); }
.open .acts small.ask { display: inline-flex; margin-top: 2px; padding: 0 6px; border-radius: 999px; background: var(--surface-3); color: var(--text-2); }
.probs { padding: 10px 24px 12px 76px; border-bottom: 1px solid var(--line); background: color-mix(in srgb, var(--warn) 7%, var(--surface-2)); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 18px; color: var(--text-2); }
.probs div { padding-left: 2ch; text-indent: -2ch; overflow-wrap: anywhere; }
.probs .q { color: var(--text-3); }
.pp { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); font-size: 13px; }
.pp .tb { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.pp .tb span { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.pp .tb h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; }
.pp .lead { margin: 0; padding: 14px 16px; border-bottom: 1px solid var(--line); font-size: 12px; line-height: 18px; color: var(--text-2); }
.pp .chips { display: flex; gap: 8px; padding: 12px 16px; overflow: hidden; border-bottom: 1px solid var(--line); white-space: nowrap; }
.pp .chips span { display: flex; flex: none; height: 32px; align-items: center; padding: 0 12px; border: 1px solid var(--line); border-radius: 999px; color: var(--text-2); }
.pp .chips span.on { border-color: transparent; background: var(--surface-3); font-weight: 500; color: var(--text-1); }
.pp .pc { padding: 12px 16px; border-bottom: 1px solid var(--line); }
.pp .pc.press { background: var(--surface-3); }
.pp .pc .t { display: flex; align-items: baseline; gap: 6px; }
.pp .pc .t b { min-width: 0; font-weight: 600; overflow-wrap: anywhere; }
.pp .pc .t .v { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.pp .pc .t svg.i { flex: none; align-self: center; margin-left: auto; color: var(--text-3); }
.pp .pc small { display: block; font-size: 12px; line-height: 18px; color: var(--text-3); }
.pp .pc dl { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; margin: 8px 0 0; font-size: 12px; line-height: 16px; }
.pp .pc dt { color: var(--text-3); }
.pp .pc dd { margin: 2px 0 0; color: var(--text-1); overflow-wrap: anywhere; }
.pp .pc dd.warn { color: var(--warn-text); }
.sheetwrap { display: flex; gap: 32px; align-items: flex-start; padding: 32px; }
.sheetwrap p.prule { position: static; display: block; height: auto; max-width: 430px; margin: 0 0 10px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.sheetwrap p.prule b { font-weight: 600; color: var(--text-1); }
`

const SECTION: [string, IconName][] = [
  ['Argo CD', 'git-branch'],
  ['cert-manager', 'shield-check'],
  ['Flux', 'git-merge'],
  ['Karpenter', 'server'],
  ['Platform', 'building-2'],
  ['All plugins', 'plug'],
]

const LONG_FILE = 'a-view-the-widgets-of-the-platform-team-as-we-like-to-see-them.yaml'

interface Row {
  glyph: IconName
  name: string
  version?: string
  yours?: boolean
  kinds: string
  /** On this cluster: in the sidebar; on this cluster (views only); not on it. */
  here: 'sidebar' | 'views' | 'no'
  note?: string
  from: [string, string]
  off?: string
}

const CAME = 'came with this Lumovi'

const ROWS: Row[] = [
  {
    glyph: 'git-branch',
    name: 'Argo CD',
    version: '1.0.0',
    kinds: 'Applications, ApplicationSets, AppProjects',
    here: 'sidebar',
    from: ['Lumovi', CAME],
  },
  {
    glyph: 'git-merge',
    name: 'Flux',
    version: '1.0.0',
    kinds: 'Kustomizations, HelmReleases, GitRepositories and 4 more kinds',
    here: 'sidebar',
    from: ['Lumovi', CAME],
  },
  {
    glyph: 'shield-check',
    name: 'cert-manager',
    version: '1.0.0',
    kinds: 'Certificates, CertificateRequests, Issuers and 3 more kinds',
    here: 'no',
    from: ['Lumovi', CAME],
    off: 'Not in use: your cert-manager.yaml is used in its place, all of it.',
  },
  {
    glyph: 'shield-check',
    name: 'cert-manager',
    version: '0.3.0',
    yours: true,
    kinds: 'Certificates, Issuers',
    here: 'sidebar',
    note: 'In use in place of Lumovi’s cert-manager',
    from: ['Yours', '~/.lumovi/plugins/cert-manager.yaml'],
  },
  {
    glyph: 'building-2',
    name: 'Platform',
    version: '2.1.0',
    yours: true,
    kinds: 'Databases',
    here: 'sidebar',
    from: ['Yours', '~/.lumovi/plugins/platform.yaml'],
  },
  {
    glyph: 'file-code-2',
    name: 'platform-queues',
    version: '0.1.0',
    yours: true,
    kinds: 'Queues',
    here: 'views',
    from: ['Yours', '~/.lumovi/plugins/queues.yaml'],
  },
  {
    glyph: 'database',
    name: 'Velero',
    version: '1.0.0',
    kinds: 'Backups, Restores, Schedules and 1 more kind',
    here: 'no',
    from: ['Lumovi', CAME],
  },
]

const HERE = {
  sidebar: (note?: string) =>
    `<span class="here">${icon('circle-check', 14, 2, 'color:var(--good-text)')}<span>On this cluster: in the sidebar${note ? `<small>${note}</small>` : ''}</span></span>`,
  views: () =>
    `<span class="here">${icon('circle-check', 14, 2, 'color:var(--good-text)')}On this cluster</span>`,
  no: () => `<span class="here no">${icon('minus', 14)}Not on this cluster</span>`,
}

function row(r: Row): string {
  const state = r.off
    ? `<span class="here no">${icon('minus', 14)}<span style="white-space:normal">${r.off}</span></span>`
    : HERE[r.here](r.note)
  return `<div class="prow${r.off ? ' off' : ''}"><span class="glyph">${icon(r.glyph, 18)}</span>
    <span class="nm"><b>${r.name}</b>${r.version ? `<span class="v">${r.version}</span>` : ''}${r.yours ? '<span class="yours">Yours</span>' : ''}<small>${r.kinds}</small></span>
    ${state}<span class="from">${r.from[0]}<small>${r.from[1]}</small></span></div>`
}

const head = `<div class="prow head"><span></span><span>Plugin</span><span>On production</span><span>From</span></div>`

/** Flux's row, opened: what it may change and read, and each action with what it sends. */
const opened = `<div class="open">
  <div><h4>May change and create</h4>
    <p>Only the kinds it shows:</p>
    <p class="mono">Kustomization, HelmRelease, GitRepository,<br>OCIRepository, HelmRepository, HelmChart, Bucket</p>
    <p class="q">all in the API groups it names: kustomize.toolkit.fluxcd.io, helm.toolkit.fluxcd.io, source.toolkit.fluxcd.io</p>
    <p class="never">${icon('lock', 14)}<span>Never, on an object it changes, what’s the cluster’s to set: its owners, finalizers, name or namespace. Never Kubernetes’ own kinds: no Pods, Jobs, Secrets or RoleBindings. No plugin can.</span></p>
    <h4 style="margin-top:12px">May read</h4>
    <p>Its own kinds’ objects: its columns, status and details are fields of the object shown.</p>
    <p>It links to its sources by name. A link opens Lumovi’s page for the object; the plugin reads nothing of it.</p>
    <p>It reads no logs and no Secret’s value, and sends nothing anywhere but to this cluster.</p>
  </div>
  <div><h4>Its actions, and what each sends</h4>
    <div class="acts">
      <span><b>Reconcile</b><small>on all 7 kinds</small><br><small class="run">runs at once</small></span><code>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)</code>
      <span><b>Suspend</b><small>on all 7 kinds</small><br><small class="run">runs at once</small></span><code>spec.suspend: true</code>
      <span><b>Resume</b><small>on all 7 kinds</small><br><small class="run">runs at once</small></span><code>spec.suspend: (removed)<br>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)</code>
    </div>
    <p class="never">${icon('info', 14)}<span>An action that asks first shows this and its kubectl command before anything is sent. One that runs at once sends it when its button is pressed.</span></p>
  </div>
</div>`

const notInUse = `<div class="prow"><span class="glyph">${icon('file-code-2', 18)}</span>
  <span class="nm"><b>${LONG_FILE}</b><span class="yours">Yours</span><small>~/.lumovi/plugins</small></span>
  <span class="here warn" style="grid-column: 3 / 5">${icon('triangle-alert', 14)}<span><b>Not in use.</b> 2 problems to fix in the file.</span></span></div>
<div class="probs"><div>spec.groups: is required: the API groups its kinds are in, like [example.com]</div><div>spec.views[0].colums: isn’t something a view has</div></div>`

function page(): string {
  const rows = ROWS.map((r) => row(r) + (r.name === 'Flux' ? opened : '')).join('')
  return shell(
    'Plugins',
    'plug',
    { after: '', label: 'All plugins', icon: 'plug', tag: '', section: 'Plugins', items: SECTION },
    `<div class="band">${icon('info', 16)}<span>A plugin teaches Lumovi a tool’s kinds: their columns, status, details and actions. Plugins are data. They can’t run code, and they change objects only with the patches and the objects they spell out, each shown here. A plugin has no access of its own: what it reads and changes, it does as you, and the cluster refuses what you may not do. Lumovi’s come inside Lumovi; yours are your own files.</span></div>
    <div style="height:16px"></div>
    <div class="bar"><span class="n">32 from Lumovi, 4 of yours</span>${seg(['All 36', 'On this cluster 6', 'Yours 4', 'Not in use 2'], 'All 36')}<span class="grow"></span><span class="field" style="width:240px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
    ${head}${rows}${notInUse}
    <div class="foot">${icon('info', 14)}8 of 36 shown, Flux opened. Yours go in ~/.lumovi/plugins. One with the name of one of Lumovi’s is used in its place, all of it.</div>`,
    'All namespaces',
  )
}

const card = (r: Row, o: { press?: boolean } = {}) =>
  `<div class="pc${o.press ? ' press' : ''}"><div class="t"><b>${r.name}</b>${r.version ? `<span class="v">${r.version}</span>` : ''}${r.yours ? '<span class="yours">Yours</span>' : ''}${icon('chevron-right', 16)}</div><small>${r.kinds}</small>
    <dl><div><dt>On production</dt><dd>${r.off ?? (r.here === 'sidebar' ? `On this cluster: in the sidebar${r.note ? `. ${r.note}` : ''}` : r.here === 'views' ? 'On this cluster' : 'Not on this cluster')}</dd></div><div><dt>From</dt><dd>${r.from[0]}, ${r.from[1]}</dd></div></dl></div>`

function phone(): string {
  return `<div class="sheetwrap"><div class="pp">
    <div class="tb"><span>${icon('menu', 20)}</span><h1>Plugins</h1><span>${icon('search', 20)}</span></div>
    <div class="chips"><span class="on">All 36</span><span>On this cluster 6</span><span>Yours 4</span><span>Not in use 2</span></div>
    ${card(ROWS[1]!, { press: true })}${card(ROWS[2]!)}${card(ROWS[3]!)}${card(ROWS[5]!)}
    <div class="pc"><div class="t"><b>${LONG_FILE}</b><span class="yours">Yours</span>${icon('chevron-right', 16)}</div>
      <dl><div><dt>On production</dt><dd class="warn">Not in use. 2 problems to fix in the file.</dd></div><div><dt>From</dt><dd>Yours, ~/.lumovi/plugins</dd></div></dl></div>
  </div>
  <div>
    <p class="prule"><b>On a phone the table is cards</b>, by the phone layout’s rule: the plugin’s name, version and “Yours”, its kinds, then On production and From as facts, one a line (a path never fits a third). The filters are a strip that scrolls sideways, as tabs do. The opening paragraph isn’t shown on a phone; it’s the first thing on the opened plugin’s page.</p>
    <p class="prule"><b>A card opens the plugin as a page</b> with Back: May change and create, May read, then its actions, each a card with “asks first” or “runs at once” and what it sends, wrapped and hanging as the phone’s mono text does. A file not in use opens to its problems, each a line.</p>
    <p class="prule"><b>A file’s name is never cut here</b>: it wraps, since this is the page a person comes to with that name in hand.</p>
    <p class="prule"><b>Made from the file, not printed as drawn.</b> The opened row’s May change and create and May read are sentences chosen by what the plugin’s file holds: its kinds, what it creates, the kinds it only shows, its related lists and its links, each named. Flux has no related list, so it has no sentence for one. “runs at once” is the pill that stands out, in the stronger ink; “asks first” is the quiet one; both grey, neither blue.</p>
    <p class="prule"><b>“They can’t run code” has an end date</b>: it’s true of every plugin now, and stops being true of the first that carries code in Lumovi’s sealed frame. The paragraph is rewritten then, not before.</p>
    <p class="prule"><b>“From” says what the app knows</b>: for Lumovi’s, that it came with this Lumovi; a file’s “needs Lumovi 1.22.0 or newer” is another fact and belongs in the opened row if anywhere.</p>
    <p class="prule"><b>Read-only on every screen</b>: nothing on this page changes anything, so a phone has all of it.</p>
  </div></div>`
}

export type PluginsPageFrame = 'page' | 'phone'

export const SIZES: Record<PluginsPageFrame, Size> = {
  page: { width: 1440, height: 1340 },
  phone: { width: 960, height: 900 },
}

/** The Plugins page, or its phone form, in one theme. */
export function pluginsPageFrame(id: PluginsPageFrame, scheme: Scheme): string {
  const size = SIZES[id]
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${size.width}px; ${id === 'page' ? `height: ${size.height}px;` : ''} margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; color: var(--text-1); }
${PARTS}
${SHELL}
${PLUGIN}
${STORE}
${CSS}
${id === 'page' ? `.win { height: ${size.height}px; }` : ''}
</style>${id === 'page' ? page() : phone()}`
}
