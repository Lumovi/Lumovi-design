/**
 * The plugin store on the Plugins page (LMV-292, desktop only): what's newer in Lumovi-plugins'
 * latest signed release, installing and updating from it, and going back. On the Plugins page as
 * built (`pluginspage.ts`), with the PM's answers: plugins not in this build can be installed, and
 * then removed; no dot in the sidebar, since it checks only on opening Plugins and on Check now.
 * Drawn before it's built; the words are drafts for docs.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as PLUGIN } from './plugins.ts'
import { CSS as SHELL, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'
import { CSS as STORE } from './store.ts'

const CSS = `
.prow { grid-template-columns: 36px minmax(0, 1.5fr) minmax(0, 1.1fr) minmax(0, 1fr) 176px; }
.prow .act { display: flex; justify-content: flex-end; align-items: center; gap: 6px; }
.prow .act .q { font-size: 12px; line-height: 16px; color: var(--text-3); text-align: right; }
.prow .act .q b { font-weight: 500; color: var(--text-2); }
.prow .act .more { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 6px; color: var(--text-2); }
.prow .act .more.on { background: var(--surface-3); color: var(--text-1); }
.prow .newv { display: block; margin-top: 2px; font-size: 12px; color: var(--text-2); }
.prow .newv b { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-1); }
.storebar { display: flex; align-items: center; gap: 8px; margin-left: auto; font-size: 12px; color: var(--text-3); white-space: nowrap; }
.storebar b { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-2); }
.storebar .btn { margin-left: 4px; }
.storebar .spin { animation: none; }
.storebar.bad { color: var(--text-2); white-space: normal; max-width: 520px; }
.storebar.bad svg.i { color: var(--warn-text); }
.fromst small { color: var(--text-3); }
.menu3 { position: absolute; right: 24px; z-index: 4; width: 300px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.menu3 .mi { display: flex; align-items: flex-start; gap: 8px; padding: 7px 8px; border-radius: 6px; font-size: 13px; color: var(--text-1); }
.menu3 .mi svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.menu3 .mi small { display: block; font-size: 11.5px; line-height: 16px; color: var(--text-3); }
.menu3 .mi.hov { background: var(--surface-3); }
.menu3 .sep { height: 1px; margin: 4px 0; background: var(--line); }
.menu3 .mi.danger { color: var(--critical-text); }
.menu3 .mi.danger svg.i { color: var(--critical-text); }

.sheet { display: flex; flex-direction: column; gap: 36px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 12px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; color: var(--text-3); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 28px; max-width: 1500px; margin: 4px 0 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.dgrid { display: grid; grid-template-columns: repeat(2, 560px); gap: 28px 32px; align-items: start; }
.sdlg { width: 560px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.sdlg .dh { display: flex; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid var(--line); }
.sdlg .dh .g { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.sdlg .dh h3 { margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.sdlg .dh small { display: block; margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--text-3); }
.sdlg .dh small .use { display: block; margin-top: 2px; }
.sdlg .dh small b { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-2); }
.sdlg .part { padding: 14px 20px; }
.sdlg .part + .part { border-top: 1px solid var(--line); }
.sdlg .cap2 { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sdlg .cap2 .n { padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-size: 10.5px; letter-spacing: 0; text-transform: none; color: var(--text-1); }
.ask { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; font-size: 13px; line-height: 19px; color: var(--text-1); }
.ask svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.ask > span { min-width: 0; flex: 1; }
.ask code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); }
.ask small { display: block; font-size: 12px; line-height: 17px; color: var(--text-3); }
.ask.gone { color: var(--text-3); text-decoration: line-through; text-decoration-color: var(--line-strong); }
.ask.gone small { text-decoration: none; }
.same { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text-2); }
.same a, .codech a { color: var(--accent-strong); font-weight: 500; }
.codech { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.codech svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.codech b { font-weight: 600; color: var(--text-1); }
.codech small { display: block; margin-top: 2px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.codech code { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; color: var(--text-2); }
.ref { display: flex; align-items: flex-start; gap: 10px; padding: 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); font-size: 13px; line-height: 19px; color: var(--text-2); }
.ref svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.ref b { font-weight: 600; color: var(--text-1); }
.ref code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); }
.sdlg .df { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); }
.sdlg .df .note { margin-right: auto; font-size: 12px; color: var(--text-3); }
.btn.danger { background: var(--critical); color: #fff; }
.closed { display: flex; align-items: center; gap: 6px; padding: 4px 0 0; font-size: 12px; color: var(--text-3); }
`

const SECTION: [string, IconName][] = [
  ['Argo CD', 'git-branch'],
  ['CloudNativePG', 'database'],
  ['Karpenter', 'server-cog'],
  ['All plugins', 'plug'],
]

interface Row {
  name: string
  glyph: IconName
  version: string
  kinds: string
  here: 'sidebar' | 'no' | 'kinds'
  from: [string, string]
  act: string
  newv?: string
}

const HERE = {
  sidebar: `<span class="here">${icon('circle-check', 14, 2, 'color:var(--good-text)')}On this cluster: in the sidebar</span>`,
  no: `<span class="here no">${icon('minus', 14)}Not on this cluster</span>`,
  kinds: `<span class="here">${icon('circle-dashed', 14)}Its kinds are on this cluster</span>`,
}

const MORE = (on = false) =>
  `<span class="more${on ? ' on' : ''}" title="More">${icon('ellipsis', 16)}</span>`
const CAME = 'Comes with Lumovi'

const ROWS: Row[] = [
  {
    name: 'Argo CD',
    glyph: 'git-branch',
    version: '1.2.0',
    kinds: 'Applications, AppProjects, ApplicationSets',
    here: 'sidebar',
    from: ['Lumovi', CAME],
    newv: '1.3.0',
    act: `<span class="btn secondary sm">Update…</span>`,
  },
  {
    name: 'Karpenter',
    glyph: 'server-cog',
    version: '1.1.2',
    kinds: 'NodePools, NodeClaims, EC2NodeClasses',
    here: 'sidebar',
    from: ['Lumovi', CAME],
    act: `<span class="q"><b>1.3.0</b> needs<br>Lumovi 1.23.0</span>`,
  },
  {
    name: 'Flux',
    glyph: 'git-merge',
    version: '1.0.0',
    kinds: 'Kustomizations, HelmReleases, GitRepositories and 4 more kinds',
    here: 'no',
    from: ['Lumovi', CAME],
    act: '',
  },
  {
    name: 'CloudNativePG',
    glyph: 'database',
    version: '1.2.0',
    kinds: 'Clusters, Backups, ScheduledBackups and 3 more kinds',
    here: 'sidebar',
    from: ['Lumovi-plugins', 'Installed from Lumovi-plugins release 1.1.0 · 1.1.0 kept'],
    act: MORE(true),
  },
]

const NOT_HERE: Row[] = [
  {
    name: 'Tinker',
    glyph: 'boxes',
    version: '1.0.0',
    kinds: 'Gadgets, Gizmos',
    here: 'kinds',
    from: ['Lumovi-plugins', 'From Lumovi-plugins release 1.2.0'],
    act: `<span class="btn secondary sm">Install…</span>`,
  },
]

/** The page's own list by name, where one installed from Not here yet now sits. */
const ALL_T: Row[] = [
  {
    name: 'Tekton',
    glyph: 'workflow',
    version: '1.0.0',
    kinds: 'PipelineRuns, TaskRuns, Pipelines and 1 more kind',
    here: 'no',
    from: ['Lumovi', CAME],
    act: '',
  },
  {
    name: 'Toys',
    glyph: 'boxes',
    version: '1.2.0',
    kinds: 'Widgets',
    here: 'sidebar',
    from: ['Lumovi-plugins', 'Installed from Lumovi-plugins release 1.1.0'],
    act: MORE(true),
  },
  {
    name: 'Traefik',
    glyph: 'signpost',
    version: '1.0.0',
    kinds: 'IngressRoutes, Middlewares, IngressRouteTCPs and 5 more kinds',
    here: 'no',
    from: ['Lumovi', CAME],
    act: '',
  },
]

function row(r: Row): string {
  return `<div class="prow"><span class="glyph">${icon(r.glyph, 18)}</span>
    <span class="nm"><b>${r.name}</b><span class="v">${r.version}</span><small>${r.kinds}</small>${r.newv ? `<span class="newv">Update: <b>${r.newv}</b></span>` : ''}</span>
    ${HERE[r.here]}<span class="from fromst">${r.from[0]}<small>${r.from[1]}</small></span><span class="act">${r.act}</span></div>`
}

const head = `<div class="prow head"><span></span><span>Plugin</span><span>On production</span><span>From</span><span></span></div>`

type StoreState = 'checked' | 'checking' | 'offline' | 'unsigned' | 'expired' | 'older' | 'policy'

const STATE: Record<StoreState, string> = {
  checked: `<span class="storebar">${icon('package', 14)}Lumovi-plugins release <b>1.2.0</b> · checked 2m ago<span class="btn ghost sm">Check now</span></span>`,
  checking: `<span class="storebar">${icon('loader-circle', 14)}Checking for newer plugins…<span class="btn ghost sm off">Check now</span></span>`,
  offline: `<span class="storebar bad">${icon('triangle-alert', 14)}Couldn’t check for newer plugins: GitHub didn’t answer in 60 seconds.<span class="btn ghost sm">Check now</span></span>`,
  unsigned: `<span class="storebar bad">${icon('triangle-alert', 14)}Couldn’t check for newer plugins: the release isn’t signed by Lumovi-plugins’ release workflow, so Lumovi took nothing from it.<span class="btn ghost sm">Check now</span></span>`,
  expired: `<span class="storebar bad">${icon('triangle-alert', 14)}Couldn’t check for newer plugins: this release expired on Oct 1, and Lumovi takes none past that.<span class="btn ghost sm">Check now</span></span>`,
  older: `<span class="storebar bad">${icon('triangle-alert', 14)}Couldn’t check for newer plugins: this release is older than one Lumovi has already taken, so Lumovi took nothing from it.<span class="btn ghost sm">Check now</span></span>`,
  policy: `<span class="storebar">${icon('lock', 14)}Your organization’s policy turns off checking for newer plugins.</span>`,
}

function storePage(o: {
  filter: string
  rows: Row[]
  state: StoreState
  menu?: string
  foot: string
  counts?: string[]
}): string {
  const counts =
    o.counts ??
    (o.state === 'policy'
      ? ['All 32', 'On this cluster 6', 'Yours 0']
      : ['All 32', 'On this cluster 6', 'Updates 1', 'Not here yet 2'])
  return shell(
    'Plugins',
    'plug',
    { after: '', label: 'All plugins', icon: 'plug', tag: '', section: 'Plugins', items: SECTION },
    `<div class="bar"><span class="n">32 from Lumovi</span>${seg(counts, o.filter)}${STATE[o.state]}</div>
    ${head}<div style="position:relative">${o.rows.map(row).join('')}${o.menu ?? ''}</div>
    <div class="foot">${icon('info', 14)}${o.foot}</div>`,
    'All namespaces',
  )
}

const MENU_STORE = `<div class="menu3" style="top:268px"><div class="mi hov">${icon('history', 15)}<span>Back to 1.1.0<small>The one before, kept on this computer</small></span></div><div class="mi">${icon('package', 15)}<span>Back to the one that came with Lumovi<small>1.1.0, as built into Lumovi 1.22.0</small></span></div><div class="sep"></div><div class="mi">${icon('external-link', 15)}<span>Its release on GitHub</span></div></div>`

const MENU_NOT_HERE = `<div class="menu3" style="top:120px"><div class="mi">${icon('external-link', 15)}<span>Its release on GitHub</span></div><div class="sep"></div><div class="mi danger hov">${icon('trash-2', 15)}<span>Remove Toys<small>It goes back under Not here yet</small></span></div></div>`

const W = 1440

function pageFrame(): string {
  return storePage({
    filter: 'All 32',
    rows: ROWS,
    state: 'checked',
    menu: MENU_STORE,
    foot: '4 of 32 shown; CloudNativePG’s menu open. Updates come only when you choose them.',
  })
}

function notHereFrame(): string {
  // Toys, installed from Not here yet, is here now: in the page's own list, by name.
  const counts = ['All 33', 'On this cluster 7', 'Updates 1', 'Not here yet 1']
  return `<div class="pair">${storePage({
    filter: 'Not here yet 1',
    rows: NOT_HERE,
    state: 'checked',
    counts,
    foot: 'Names are examples (the tests’ stand-ins): today every plugin in Lumovi-plugins comes with Lumovi, so this filter is empty and not shown.',
  })}${storePage({
    filter: 'All 33',
    rows: ALL_T,
    state: 'checked',
    counts,
    menu: MENU_NOT_HERE,
    foot: 'Toys, installed from Not here yet, in the list by its name; Toys’ menu open.',
  })}</div>`
}

// ─── The dialog ────────────────────────────────────────────────────────────────────────────

const ask = (glyph: IconName, text: string, note = '', cls = '') =>
  `<div class="ask ${cls}">${icon(glyph, 15)}<span>${text}${note ? `<small>${note}</small>` : ''}</span></div>`

const dlg = (o: {
  glyph: IconName
  title: string
  sub: string
  body: string
  button: string
  note?: string
  off?: boolean
}) =>
  `<div class="sdlg"><div class="dh"><span class="g">${icon(o.glyph, 18)}</span><div><h3>${o.title}</h3><small>${o.sub}</small></div></div>${o.body}<div class="df">${o.note ? `<span class="note">${o.note}</span>` : ''}<span class="btn ghost sm">${o.off ? 'Close' : 'Cancel'}</span>${o.off ? '' : `<span class="btn primary sm">${o.button}</span>`}</div></div>`

const SUB = (v: string) =>
  `From Lumovi-plugins release <b>1.4.0</b>, signed by its release workflow. What it reads and changes, it does as you.${v ? `<span class="use">In use: ${v}.</span>` : ''}`

function dialogsFrame(): string {
  const install = dlg({
    glyph: 'boxes',
    title: 'Install Tinker 1.0.0?',
    sub: SUB(''),
    body: `<div class="part"><p class="cap2">What it may do</p>
      ${ask('code', 'Draws its pages with its own code, which runs in Lumovi’s sealed box and is handed only what’s listed here.')}
      ${ask('pencil', 'Its pages may propose to change Gadgets and Gizmos, each change one you confirm in Lumovi.')}
      ${ask('eye', 'Of Pods, its code is handed only <code>metadata.name and status.phase</code>, as far as you may read them.')}
      ${ask('key-round', 'Shows you <code>token</code> of the Secret that a Gadget’s <code>spec.secretRef.name</code> names. Lumovi reads it as you, only when you press Reveal or Copy; the plugin never sees it.')}</div>`,
    button: 'Install 1.0.0',
    note: 'Nothing is written until you press Install.',
  })
  const adds = dlg({
    glyph: 'boxes',
    title: 'Update Toys to 1.3.0?',
    sub: SUB('1.2.0, installed from Lumovi-plugins release <b>1.1.0</b>'),
    body: `<div class="part"><p class="cap2">New in 1.3.0<span class="n">2</span></p>
      ${ask('key-round', 'Shows you <code>token</code> of the Secret that a Widget’s <code>spec.apiSecretRef.name</code> names. Lumovi reads it as you, only when you press Reveal or Copy; the plugin never sees it.')}
      ${ask('link', 'It links to Pods by name. A link opens Lumovi’s page for the object; the plugin reads nothing of it.')}</div>
      <div class="part"><p class="cap2">No longer</p>${ask('pencil', 'Its pages may propose to scale Widgets, each change one you confirm in Lumovi.', '', 'gone')}</div>
      <div class="part"><div class="codech">${icon('code', 15)}<span><b>Its code changed.</b> <a>See what changed on GitHub ↗</a><small>Lumovi-plugins release <code>1.1.0</code> to <code>1.4.0</code>, every plugin’s changes. This one’s are under <code>plugins/toys</code> and <code>src/toys</code>.</small></span></div><div class="closed">${icon('chevron-right', 13)}Everything else it may do, as before (4)</div></div>`,
    button: 'Update to 1.3.0',
    note: 'Without this, 1.2.0 stays in use.',
  })
  const same = dlg({
    glyph: 'boxes',
    title: 'Update Tinker to 1.0.1?',
    sub: SUB('1.0.0, installed from Lumovi-plugins release <b>1.1.0</b>'),
    body: `<div class="part"><div class="same">${icon('circle-check', 15, 2, 'color:var(--good-text)')}It asks for nothing it doesn’t already have.</div></div><div class="part"><div class="codech">${icon('code', 15)}<span><b>Its code changed.</b> <a>See what changed on GitHub ↗</a><small>Lumovi-plugins release <code>1.1.0</code> to <code>1.4.0</code>, every plugin’s changes. This one’s are under <code>plugins/tinker</code> and <code>src/tinker</code>.</small></span></div><div class="closed">${icon('chevron-right', 13)}What it may do (6)</div></div>`,
    button: 'Update to 1.0.1',
  })
  const refused = dlg({
    glyph: 'boxes',
    title: 'Update Toys to 1.3.0?',
    sub: SUB('1.2.0, installed from Lumovi-plugins release <b>1.1.0</b>'),
    body: `<div class="part"><div class="ref">${icon('lock', 15)}<span><b>Your organization’s policy doesn’t let plugins show what’s in Secrets, and this one would.</b> (<code>pluginSecrets: off</code>) 1.2.0 stays in use.</span></div></div>`,
    button: '',
    off: true,
  })
  const remove = dlg({
    glyph: 'boxes',
    title: 'Remove Toys?',
    sub: 'Its pages and lists go, and nothing in your cluster changes.',
    body: `<div class="part"><div class="same">${icon('info', 15)}It goes back under Not here yet, where Install… brings it back, with this dialog’s questions again.</div></div>`,
    button: 'Remove',
  }).replace(
    '<span class="btn primary sm">Remove</span>',
    '<span class="btn danger sm">Remove</span>',
  )
  return `<section class="blk"><h2>Installing and updating<i>one dialog, Lumovi’s words for what each asks</i></h2>
    <div class="dgrid"><div class="blk"><p class="cap">A first install, of one not in this Lumovi (Tinker and Toys are the tests’ stand-ins)</p>${install}</div><div class="blk"><p class="cap">An update that asks for more: what’s new first</p>${adds}</div><div class="blk"><p class="cap">An update that asks for the same</p>${same}</div><div class="blk"><p class="cap">Refused by policy</p>${refused}</div><div class="blk"><p class="cap">Removing one installed from Not here yet</p>${remove}</div></div>
    <ul class="rules">
      <li><b>One dialog</b>, opened from a row’s Install… or Update…: the plugin and its version, and under them the store’s release (“From Lumovi-plugins release 1.4.0, signed by its release workflow. What it reads and changes, it does as you.”, true of every plugin, code or not); an update or a go-back adds what’s in use on a line of its own, “In use: 1.2.0, installed from Lumovi-plugins release 1.1.0.” or “In use: 1.1.0, which comes with Lumovi.”, each release named as the bar names it, so two 1.2.0s never read as one. Then what it may do, then one button, “Install 1.0.0” or “Update to 1.2.0”. Nothing is written without it; Escape and Cancel leave everything as it was.</li>
      <li><b>What it may do</b> is the Plugins page’s own lines (WhatItAsks), one for each permission, so a permission reads the same before and after; New in and No longer are worked out from the plugin’s asks, never from their words. A plugin with code has one line more, first: “Draws its pages with its own code, which runs in Lumovi’s sealed box and is handed only what’s listed here.”</li>
      <li><b>Nothing is red</b> (docs): “Shows you … of the Secret” is Lumovi showing it to you, as you, and the plugin never holds it. Red comes with LMV-290’s server reach. Nothing else is coloured.</li>
      <li><b>An update says what’s new first</b>, with how many, then what it no longer asks (struck through, quiet), then “Its code changed” with the diff on GitHub between the release it came from and this one (compare/v1.1.0...v1.4.0: Lumovi-plugins’ tags are its releases, never a plugin’s version), and under it, quiet, docs’ line: “Lumovi-plugins release 1.1.0 to 1.4.0, every plugin’s changes. This one’s are under plugins/toys and src/toys.” No plugin versions beside it, no link where both are the same release, and never a summary of ours. What it asks as before is folded, with how many, and opens in place.</li>
      <li><b>The same asks</b>: one line, “It asks for nothing it doesn’t already have.”, with the good icon; the code line still shows, since code is new whatever it asks.</li>
      <li><b>Refused by policy</b>: the dialog says so and which key, in the policy’s own name, and that the version in use stays; it has Close and no button that can’t work. A row whose update policy refuses still offers Update…, so the person learns why.</li>
      <li><b>Going back</b> to a version that asks for anything the current one doesn’t opens this same dialog, titled “Go back to Toys 1.2.0?”, its new asks first; otherwise it goes back at once with a toast. <b>Remove</b> (only for one not in this Lumovi) asks first, its button in the danger colour; after, the row is back under Not here yet with Install…, and the toast “Removed Toys.” has no Undo, since putting it back is an install with its own questions.</li>
    </ul></section>`
}

function statesFrame(): string {
  const bar = (s: StoreState) =>
    `<div class="bar" style="border:1px solid var(--line);border-radius:10px;background:var(--surface)"><span class="n">32 from Lumovi</span>${seg(s === 'policy' ? ['All 32', 'On this cluster 6'] : ['All 32', 'On this cluster 6', 'Updates 1', 'Not here yet 2'], 'All 32')}${STATE[s]}</div>`
  return `<section class="blk"><h2>The toolbar’s states<i>the page goes on with what’s installed in every one</i></h2>
    <div class="blk" style="max-width:1200px">${(['checked', 'checking', 'offline', 'unsigned', 'expired', 'older', 'policy'] as StoreState[]).map((s) => bar(s)).join('')}</div>
    <ul class="rules">
      <li><b>Checked</b>: the store release’s name and when it was checked, then Check now (ghost). It checks on opening Plugins and on Check now, never in the background, at most once in 10 minutes unless asked, so there’s no dot in the sidebar.</li>
      <li><b>Couldn’t check</b>: one line saying which check failed, in docs’ words, with the warning icon and Check now; the Updates and Not here yet filters keep what the last good check found, and say so in their tooltip (“From the check at 14:02”). Nothing installed changes.</li>
      <li><b>Turned off by policy</b>: the lock and the policy’s sentence; the two filters and every Install…, Update… and menu go, as there’s nothing to fetch. On a server the store isn’t there at all: plugins are the administrator’s, with the image, and the page already says so.</li>
      <li><b>On a phone</b>: nothing to draw. The store is the desktop app’s, and a phone is always a server’s page, where there’s no store. If a server ever gets one, its phone shows what’s newer read-only.</li>
    </ul></section>`
}

const RULES_PAGE = `<ul class="rules" style="margin:20px 32px 32px">
  <li><b>A row with an update</b> says “Update: 1.2.0” under its kinds, in the ink, and has Update… at its end, a secondary button, never filled: updates are a choice, and there can be several. Its version stays the one in use until it’s done.</li>
  <li><b>One this Lumovi is too old for</b> says “1.3.0 needs Lumovi 1.23.0”, quiet, at its end, and nothing to press: Lumovi’s own update is how to get it.</li>
  <li><b>Installed from the store</b>, From says “Installed from Lumovi-plugins release 1.1.0” (docs’ line, on every store plugin’s row and in its dialog) and which version is kept; Lumovi’s own say “Comes with Lumovi”; its “…” menu has Back to 1.1.0 (the one kept), Back to the one that came with Lumovi (deletes the store’s copies) and its release on GitHub. One not in this Lumovi has “Remove Toys” instead, in the danger colour, since there’s nothing of Lumovi’s to go back to.</li>
  <li><b>Updates</b> and <b>Not here yet</b> are filters with their counts, beside the page’s own; the counts are the last good check’s. Not here yet lists each with Install… (and isn’t shown at all while the store has nothing Lumovi doesn’t carry, as today; a filter that empties while it’s on falls back to All, without a word); once installed, one is here, so it leaves Not here yet for the page’s own list, and Remove puts it back. The list is one order, by name, whatever each came from, so an update or an install never moves a row, and, before it’s installed, “Its kinds are on this cluster” where they are, so the person sees which would show something.</li>
  <li><b>The store’s line</b> is at the bar’s right: “Lumovi-plugins release 1.2.0 · checked 2m ago” and Check now; or what’s happening, or why it couldn’t check (wrapping under the filters when it’s long). Docs write the filters “Updates: 1” and “Not here yet: 2”; here they take the page’s own segmented form with the count.</li>
  <li><b>Every change here is audited</b> (installed, updated, went back), with the versions and what was agreed.</li>
</ul>`

export type StoreFrame = 'store-page' | 'store-not-here' | 'store-dialogs' | 'store-states'

export const STORE_FRAMES: { id: StoreFrame; title: string; size: Size }[] = [
  {
    id: 'store-page',
    title: 'The store: the Plugins page, an update and a menu',
    size: { width: W, height: 760 },
  },
  { id: 'store-not-here', title: 'The store: not here yet', size: { width: W, height: 1136 } },
  {
    id: 'store-dialogs',
    title: 'The store: installing and updating',
    size: { width: 1200, height: 1400 },
  },
  {
    id: 'store-states',
    title: 'The store: the toolbar’s states',
    size: { width: 1440, height: 900 },
  },
]

/** One of the frames, in one theme. */
export function storeFrame2(id: StoreFrame, scheme: Scheme): string {
  const f = STORE_FRAMES.find((x) => x.id === id)!
  const page = id === 'store-page' || id === 'store-not-here'
  const body = page
    ? `${id === 'store-page' ? pageFrame() : notHereFrame()}${id === 'store-page' ? RULES_PAGE : ''}`
    : `<div class="sheet">${id === 'store-dialogs' ? `<header><h1>The plugin store (LMV-292)</h1><p>Desktop only. Lumovi-plugins’ latest signed release, checked on opening Plugins and on Check now, never in the background. A plugin is installed, updated or taken back only on the person’s press, after a dialog that says what it may do in Lumovi’s words. Words are drafts for docs.</p></header>${dialogsFrame()}` : statesFrame()}</div>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; color: var(--text-1); }
${PARTS}
${SHELL}
${PLUGIN}
${STORE}
${CSS}
${page ? `.win { height: ${f.size.height - 1}px; }` : ''}
.pair > .win { height: 560px; }
.pair > .win + .win { margin-top: 16px; }
</style>${body}`
}
