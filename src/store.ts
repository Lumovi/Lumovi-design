/**
 * Plugins as Péter chose them on LMV-187 (2026-10-10): one thing, called a plugin. Today's 32
 * add-ons become the official plugins, kept in a repository of their own, each with a version,
 * bundled in every Lumovi and updated from Lumovi's own store between releases. They stay data:
 * no code, no sandbox, no other publishers. A sketch for the proposal, not a spec.
 *
 * Three things here are the PM's recommendations, not yet answered: every official plugin is
 * bundled; a server has no update button; plugins keep their actions.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as PLUGIN } from './plugins.ts'
import { CSS as SHELL, pill, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.prow { display: grid; grid-template-columns: 36px minmax(0, 1.5fr) minmax(0, 1.2fr) minmax(0, 1fr) 150px; align-items: center; gap: 16px; padding: 10px 24px; border-bottom: 1px solid var(--line); font-size: 13px; }
.prow.head { padding-top: 8px; padding-bottom: 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.prow .glyph { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); color: var(--text-2); }
.prow .nm b { font-weight: 600; }
.prow .nm .v { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.prow .nm small { display: block; overflow: hidden; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.prow .here { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.prow .here.no { color: var(--text-3); }
.prow .here svg.i { color: var(--text-3); }
.prow .from { font-size: 12px; color: var(--text-2); }
.prow .from small { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-3); }
.prow .act { display: flex; justify-content: flex-end; font-size: 12px; color: var(--text-3); white-space: nowrap; }
.yours { margin-left: 6px; padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-size: 11px; font-weight: 500; color: var(--text-2); }
.chg { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.chg > div { display: flex; gap: 10px; padding: 10px 14px; font-size: 13px; line-height: 20px; }
.chg > div + div { border-top: 1px solid var(--line); }
.chg > div > svg.i { margin-top: 3px; color: var(--text-3); }
.chg b { font-weight: 500; }
.chg small { display: block; font-size: 12px; line-height: 18px; color: var(--text-2); }
.chg .act2 { background: color-mix(in srgb, var(--warn) 9%, transparent); }
.chg .act2 > svg.i { color: var(--warn-text); }
.chg code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
.signed { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-2); }
.signed svg.i { color: var(--good-text); }
.tabs2 { display: flex; flex: none; gap: 4px; padding: 0 20px; box-shadow: inset 0 -1px 0 var(--line); }
.tabs2 > span { position: relative; display: flex; height: 36px; align-items: center; gap: 6px; padding: 0 10px; font-size: 13px; font-weight: 500; color: var(--text-3); white-space: nowrap; }
.tabs2 > span small { font-size: 12px; font-weight: 400; }
.tabs2 > span.on { color: var(--text-1); }
.tabs2 > span.on::after { content: ''; position: absolute; right: 8px; bottom: 0; left: 8px; height: 2px; border-radius: 999px; background: var(--accent); }
.open { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 32px; padding: 14px 24px 16px 76px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; line-height: 18px; color: var(--text-2); }
.open h4 { margin-bottom: 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.open .mono, .open code, .two code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 17px; color: var(--text-1); white-space: pre; }
.open .mono { margin: 4px 0 8px; }
.open .never { display: flex; gap: 6px; margin-top: 8px; }
.open .never svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.open .acts { display: grid; grid-template-columns: 130px minmax(0, 1fr); gap: 6px 16px; align-items: start; }
.open .acts b { display: block; font-size: 13px; font-weight: 500; color: var(--text-1); }
.open .acts small { font-size: 11px; color: var(--text-3); }
.open .acts code { padding: 4px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-1); }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; }
.two.one { grid-template-columns: 1fr; }
.two > span { display: block; padding: 6px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); }
.two i { display: block; margin-bottom: 2px; font-size: 11px; font-style: normal; color: var(--text-3); }
.two mark { background: color-mix(in srgb, var(--warn) 22%, transparent); color: inherit; }
.was { margin-left: 8px; font-size: 11px; font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--text-3); text-decoration: line-through; }
`

/** The sidebar's Plugins section on this cluster: the tools it runs, then the page of all of them. */
const SECTION: [string, IconName, string?][] = [
  ['Argo CD', 'rotate-cw'],
  ['cert-manager', 'shield-check'],
  ['Flux', 'git-merge'],
  ['Karpenter', 'server'],
  ['Platform', 'building-2'],
  ['All plugins', 'plug'],
]

const side = (label: string, glyph: IconName) => ({
  after: '',
  label,
  icon: glyph,
  tag: '',
  section: 'Plugins',
  items: SECTION,
})

interface Official {
  glyph: IconName
  name: string
  version: string
  what: string
  here: boolean
  from?: 'yours'
  update?: string
}

const OFFICIAL: Official[] = [
  {
    glyph: 'rotate-cw',
    name: 'Argo CD',
    version: '1.2.0',
    what: 'Applications, projects and application sets.',
    here: true,
  },
  {
    glyph: 'shield-check',
    name: 'cert-manager',
    version: '1.0.3',
    what: 'Certificates, their requests, and issuers.',
    here: true,
  },
  {
    glyph: 'layers',
    name: 'Crossplane',
    version: '1.0.0',
    what: 'Providers, compositions and claims.',
    here: false,
  },
  {
    glyph: 'git-merge',
    name: 'Flux',
    version: '1.3.1',
    what: 'Sources, Kustomizations and Helm releases.',
    here: true,
    update: '1.4.0',
  },
  {
    glyph: 'server',
    name: 'Karpenter',
    version: '1.1.0',
    what: 'Node pools, node claims and node classes.',
    here: true,
  },
  {
    glyph: 'chart-spline',
    name: 'KEDA',
    version: '1.0.1',
    what: 'Scaled objects, scaled jobs and triggers.',
    here: false,
  },
  {
    glyph: 'building-2',
    name: 'Platform',
    version: '',
    what: 'Your team’s kinds, from platform.yaml.',
    here: true,
    from: 'yours',
  },
  {
    glyph: 'database',
    name: 'Velero',
    version: '1.0.0',
    what: 'Backups, restores and schedules.',
    here: false,
  },
]

function row(p: Official, server = false): string {
  const from =
    p.from === 'yours'
      ? server
        ? `<span class="from">This server’s<small>/etc/lumovi/views</small></span>`
        : `<span class="from">Yours<small>~/.lumovi/views/platform.yaml</small></span>`
      : `<span class="from">Lumovi<small>with Lumovi 1.22.0</small></span>`
  const act =
    p.from === 'yours'
      ? `<span class="act">${server ? 'Its administrator’s' : 'Your file'}</span>`
      : server
        ? `<span class="act">Comes with the server</span>`
        : p.update
          ? `<span class="act"><span class="btn secondary sm">Update to ${p.update}…</span></span>`
          : `<span class="act">Up to date</span>`
  return `<div class="prow"><span class="glyph">${icon(p.glyph, 18)}</span>
    <span class="nm"><b>${p.name}</b>${p.version ? `<span class="v">${p.version}</span>` : ''}${p.from === 'yours' ? `<span class="yours">${server ? 'This server’s' : 'Yours'}</span>` : ''}<small>${p.what}</small></span>
    ${p.here ? `<span class="here">${icon('circle-check', 14, 2, 'color:var(--good-text)')}This cluster runs it: in the sidebar</span>` : `<span class="here no">${icon('minus', 14)}Not on this cluster</span>`}
    ${from}${act}</div>`
}

const head = `<div class="prow head"><span></span><span>Plugin</span><span>On production</span><span>From</span><span></span></div>`

/** What Flux's plugin may change and every action it adds, as the opened row shows them. */
const opened = `<div class="open">
  <div><h4>May change and create</h4>
    <p>Only kinds of the three API groups it declares:</p>
    <p class="mono">kustomize.toolkit.fluxcd.io<br>helm.toolkit.fluxcd.io<br>source.toolkit.fluxcd.io</p>
    <p class="never">${icon('lock', 14)}<span>Never Kubernetes’ own kinds: no Pods, Jobs, Secrets or RoleBindings. No plugin can.</span></p>
    <h4 style="margin-top:12px">May read</h4>
    <p>Its own kinds, and nothing of Kubernetes’ own: it has no related lists. No plugin reads Secrets, ConfigMaps or logs. Its links open Lumovi’s page for the object.</p>
  </div>
  <div><h4>Its actions, and what each sends</h4>
    <div class="acts">
      <span><b>Reconcile</b><small>on all 7 kinds</small></span><code>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)</code>
      <span><b>Suspend</b><small>on all 7 kinds</small></span><code>spec.suspend: true</code>
      <span><b>Resume</b><small>on all 7 kinds</small></span><code>spec.suspend: (removed)<br>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)</code>
    </div>
    <p class="never">${icon('info', 14)}<span>Each asks first, showing this patch and its kubectl command.</span></p>
  </div>
</div>`

const refused = `<div class="prow"><span class="glyph">${icon('file-code-2', 18)}</span>
  <span class="nm"><b>queues.yaml</b><span class="yours">Yours</span><small>~/.lumovi/views/queues.yaml</small></span>
  <span class="here" style="grid-column: 3 / 6; white-space: normal; color: var(--warn-text)">${icon('triangle-alert', 14, 2, 'color:var(--warn-text)')}<span><b style="font-weight:600">Not loaded.</b> Its action “Rerun” creates a Job, a kind of Kubernetes’ own, which a plugin can’t change or create.</span></span></div>`

/** 1. The Plugins page: every official plugin, its version, whether this cluster runs its tool. */
function page(): string {
  const rows = OFFICIAL.filter(
    (p) => !['KEDA', 'cert-manager', 'Karpenter', 'Crossplane'].includes(p.name),
  )
    .map((p) => row(p) + (p.name === 'Flux' ? opened : ''))
    .join('')
  return shell(
    'Plugins',
    'plug',
    side('All plugins', 'plug'),
    `<div class="band">${icon('info', 16)}<span>A plugin teaches Lumovi a tool’s kinds: their columns, status, details and actions. Plugins are data. They can’t run code, and they change objects only with the patches and the objects they spell out. Lumovi’s come only from its own repository, where each is reviewed before it’s published; yours are your own files.</span></div>
    <div style="height:16px"></div>
    <div class="bar"><span class="n">32 from Lumovi, 2 of yours</span>${seg(['All 34', 'On this cluster 5', 'Updates 1', 'Not loaded 1'], 'All 34')}<span class="grow"></span><span class="field" style="width:240px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
    ${head}${rows}${refused}
    <div class="foot">${icon('info', 14)}5 of 34 shown, Flux opened. Yours go in ~/.lumovi/views and win over Lumovi’s of the same name. An update is never taken for you; Lumovi asks its store once a day, unless update checks are off.</div>`,
    'All namespaces',
  )
}

/** 2. Taking an update: what changes, worked out from the two versions, old patch beside new. */
function update(): string {
  return `${page()}<div class="scrim" style="bottom:92px"></div><div class="dialog" style="top:4%;width:720px">
    <div class="head"><div class="glyph">${icon('git-merge', 18)}</div><div><h3>Update Flux to 1.4.0?</h3><div class="sub">A plugin from Lumovi · you have 1.3.1, built in · for every cluster on this computer</div></div></div>
    <div class="body">
      <div class="chg">
        <div class="act2">${icon('triangle-alert', 16)}<span><b>This update changes what Flux can do</b><small>It may change one more API group, and one action sends a different patch.</small></span></div>
        <div>${icon('plus', 16)}<span><b>May change a new API group: <code>image.toolkit.fluxcd.io</code></b><small>For 1 new kind, ImagePolicy. Still none of Kubernetes’ own kinds.</small></span></div>
        <div>${icon('pencil', 16)}<span style="flex:1"><b>Changed action: Reconcile, on a HelmRelease</b>
          <span class="two"><span><i>1.3.1 sends</i><code>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)</code></span><span><i>1.4.0 sends</i><code>metadata.annotations:<br>  reconcile.fluxcd.io/requestedAt: (now)<br><mark>  reconcile.fluxcd.io/forceAt: (now)</mark></code></span></span></span></div>
        <div>${icon('plus', 16)}<span style="flex:1"><b>New action: Suspend, on an ImagePolicy</b><span class="two one"><span><i>Sends</i><code>spec.suspend: true</code></span></span></span></div>
        <div>${icon('check', 16)}<span><b>Nothing removed, and the rest is the same</b><small>7 kinds, Suspend and Resume on each, Reconcile on the other six. 1 column added, which changes nothing in a cluster.</small></span></div>
      </div>
      <div class="signed">${icon('info', 14, 2, 'color:var(--text-3)')}Lumovi worked this out by comparing the two versions. It isn’t the author’s description.</div>
      <div class="signed">${icon('circle-check', 14)}Signed by Lumovi, and the signature checks out. Needs Lumovi 1.22.0 or later: you have it.</div>
      <div class="signed">${icon('history', 14, 2, 'color:var(--text-3)')}You can go back to the built-in version, 1.3.1, at any time, from the plugin’s row.</div>
    </div>
    <div class="actions"><span class="auditnote">${icon('scroll-text', 14)}Recorded in the audit log</span><span class="btn ghost">Not now</span><span class="btn primary" style="min-width:80px">Update</span></div>
  </div>`
}

/** 3. After the rename: the sidebar's section and one plugin's page, with the word changed. */
function renamed(): string {
  const G = 'grid-template-columns: minmax(200px, 1.4fr) 170px 150px minmax(200px, 1.6fr) 60px'
  const r = (n: string, ns: string, t: string, st: string, m: string, a: string) =>
    `<div class="tr" style="${G}"><span class="nm">${n}<small>${ns}</small></span><span class="mu">${t}</span><span>${st}</span><span class="m" style="font-family:inherit;font-size:12px">${m}</span><span class="r mu">${a}</span></div>`
  return shell(
    'Flux',
    'git-merge',
    side('Flux', 'git-merge'),
    `<div class="tabs2"><span class="on">All <small>14</small></span><span>Kustomizations <small>6</small></span><span>HelmReleases <small>4</small></span><span>GitRepositories <small>3</small></span><span>HelmRepositories <small>1</small></span></div>
    <div class="bar"><span class="n">14 objects</span><span class="saved">Failing 1</span><span class="saved">In progress 1</span><span class="saved">Healthy 12</span><span class="grow"></span><span class="field" style="width:220px;color:var(--text-3)">${icon('search', 14)}Filter Flux</span></div>
    <div class="thead" style="${G}"><span>Name</span><span>Type</span><span>Status</span><span>Message</span><span style="text-align:right">Age</span></div>
    ${r('shop', 'flux-system', 'Kustomization', pill('critical', 'Failed'), 'kustomize build failed: missing resource cart.yaml', '88d')}
    ${r('monitoring', 'flux-system', 'HelmRelease', pill('progressing', 'Reconciling'), 'Running upgrade to 61.3.2', '41d')}
    ${r('platform', 'flux-system', 'GitRepository', pill('healthy', 'Ready'), 'stored artifact for revision main@sha1:4f1c9aa', '88d')}
    ${r('infrastructure', 'flux-system', 'Kustomization', pill('healthy', 'Ready'), 'Applied revision main@sha1:4f1c9aa', '88d')}
    ${r('ingress-nginx', 'flux-system', 'HelmRelease', pill('healthy', 'Ready'), 'Helm upgrade succeeded', '60d')}
    ${r('cert-manager', 'flux-system', 'HelmRelease', pill('healthy', 'Ready'), 'Helm upgrade succeeded', '60d')}
    <div class="foot">${icon('info', 14)}The same page as today. What moves: the sidebar’s heading reads Plugins, with “All plugins” at its end; the palette’s hint reads Plugin; the docs’ and the site’s word follows.</div>`,
    'All namespaces',
  )
}

/** 4. A team's server: what came with the image and the chart, the administrator's, no updates. */
function server(): string {
  return shell(
    'Plugins',
    'plug',
    side('All plugins', 'plug'),
    `<div class="band">${icon('lock', 16)}<span><b style="font-weight:600;color:var(--text-1)">This server’s plugins come with it.</b> Lumovi’s are the ones in its image, Lumovi 1.22.0; its own are from its chart’s settings. Its administrator changes them there, by upgrading the release. The server fetches nothing while it runs, and nobody adds or updates one from a browser.</span></div>
    <div style="height:16px"></div>
    <div class="bar"><span class="n">32 from Lumovi, 1 from this server</span>${seg(['All 33', 'On this cluster 5'], 'All 33')}<span class="grow"></span><span class="field" style="width:240px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
    ${head}${OFFICIAL.map((p) => row({ ...p, update: undefined, version: p.name === 'Flux' ? '1.3.1' : p.version }, true)).join('')}
    <div class="foot">${icon('info', 14)}8 of 33 shown. The same plugins are used in every cluster of the fleet that runs their tool.</div>`,
    'All namespaces',
  )
}

export type Frame = 'page' | 'update' | 'renamed' | 'server'

export const FRAMES: { id: Frame; title: string; today: string; fresh: string; risk: string }[] = [
  {
    id: 'page',
    title: '1. The Plugins page',
    today:
      '32 add-ons ship inside the app; one shows in the sidebar only where a cluster runs its tool. No page lists them, and none has a version.',
    fresh:
      'A page of all: version, what each may change, each action’s patch, why one isn’t loaded. Assumed: all bundled, actions kept, each asks first (Péter’s choice: 29 of 52 run at once today).',
    risk: 'A store to run: signed list, releases, a second daily request. New: a person’s own file that creates a Job works today and would be refused, if theirs fall under the limits (Péter’s choice; docs: yes).',
  },
  {
    id: 'update',
    title: '2. Taking an update',
    today: 'An add-on changes only with a new Lumovi, tested with it.',
    fresh:
      'An update between releases, with what it changes worked out by Lumovi: groups, kinds, each action’s old patch beside its new (this one is made up). Going back is always there.',
    risk: 'An update can change what a button does to a cluster. The comparison has to be right every time; it’s the security-sensitive part of the build.',
  },
  {
    id: 'renamed',
    title: '3. After the rename',
    today: 'This page and this section, under the heading Add-ons.',
    fresh:
      'The word: Plugins, in the sidebar, the palette, the docs and the site. And “All plugins” at the section’s end.',
    risk: 'The word changes in about 45 files of the app, 24 pages of the docs, the site, and the tour’s chapter 11 with its voice, before the launch.',
  },
  {
    id: 'server',
    title: '4. On a team’s server',
    today:
      'A server’s views and add-ons come with its image and its chart’s settings, the administrator’s, for everyone.',
    fresh:
      'The same, shown on a page. Assumed, and not yet answered by Péter: no update button on a server.',
    risk: 'A server’s plugins are as old as its image until it’s upgraded. A fix to a plugin reaches a team only with the next Lumovi.',
  },
]

export const WINDOW: Size = { width: 1440, height: 992 }

/** A frame, in one theme, with its three lines under it. */
export function storeFrame(id: Frame, scheme: Scheme): string {
  const body = { page, update, renamed, server }[id]()
  const f = FRAMES.find((x) => x.id === id)!
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${WINDOW.width}px; height: ${WINDOW.height}px; }
${PARTS}
${SHELL}
${PLUGIN}
${CSS}
.win { height: ${WINDOW.height - 92}px; }
</style>${body}<div class="strip3"><b>Today</b><span>${f.today}</span><b>Would be new</b><span>${f.fresh}</span><b>Cost or risk</b><span class="risk">${f.risk}</span></div>`
}
