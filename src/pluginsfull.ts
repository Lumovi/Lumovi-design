/**
 * The full version of plugins, as Péter asked for it on LMV-187 (2026-10-10): a plugin may have a
 * page of its own, drawn by its own code, and may ask for anything Lumovi can do. It asks through
 * Lumovi and gets nothing Lumovi holds: its page sits in a frame that is visibly the plugin's, and
 * every change it asks for is confirmed by Lumovi's own dialog. What it may do is shown, by level,
 * before it's installed. All plugins come from Lumovi's own repository, where each is reviewed.
 *
 * Argo CD is the example with a page of its own; Flux stays data only beside it, so the two read as
 * one concept. A sketch for the proposal, not a spec: where something is undecided the cautious
 * case is drawn, and named as an assumption under its frame.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as PLUGIN } from './plugins.ts'
import { CSS as SHELL, pill, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.frow { display: grid; grid-template-columns: 36px minmax(0, 1.1fr) minmax(0, 2.5fr) minmax(0, 0.7fr) 170px; align-items: center; gap: 16px; padding: 9px 24px; border-bottom: 1px solid var(--line); font-size: 13px; }
.frow.head { padding-top: 8px; padding-bottom: 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.frow .glyph { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); color: var(--text-2); }
.frow .nm b { font-weight: 600; }
.frow .nm .v { margin-left: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.frow .nm small { display: block; overflow: hidden; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.frow .here { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.frow .here.no { color: var(--text-3); }
.frow .act { display: flex; justify-content: flex-end; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); white-space: nowrap; }
.lvs { display: flex; flex-wrap: wrap; gap: 4px; }
.lvc { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px 1px 6px; border-radius: 999px; background: var(--surface-3); font-size: 12px; line-height: 18px; color: var(--text-2); white-space: nowrap; }
.lvc svg.i { color: var(--text-3); }
.lvc.code { box-shadow: inset 0 0 0 1px var(--line-strong); background: transparent; color: var(--text-1); font-weight: 500; }
.lvc.code svg.i { color: var(--text-2); }
.lvc.out { background: color-mix(in srgb, var(--warn) 15%, transparent); color: var(--warn-text); font-weight: 500; }
.lvc.out svg.i { color: var(--warn-text); }
.lvc.local { background: color-mix(in srgb, var(--warn) 15%, transparent); color: var(--warn-text); font-weight: 500; }
.lvc.local svg.i { color: var(--warn-text); }
.lvl { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--surface); }
.lvl > div { display: grid; grid-template-columns: 16px 190px minmax(0, 1fr) auto; gap: 12px; align-items: start; padding: 9px 14px; font-size: 13px; line-height: 19px; }
.lvl > div + div { border-top: 1px solid var(--line); }
.lvl > div > svg.i { margin-top: 2px; color: var(--text-3); }
.lvl b { font-weight: 500; }
.lvl .t { font-size: 12.5px; color: var(--text-2); }
.lvl .st { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.lvl .st.no { color: var(--text-3); }
.lvl .st.yes svg.i { color: var(--good-text); }
.lvl .fresh { background: color-mix(in srgb, var(--warn) 9%, transparent); }
.lvl .fresh > svg.i, .lvl .fresh .st svg.i { color: var(--warn-text); }
.lvl .fresh .st { color: var(--warn-text); font-weight: 500; }
.lvl .same { color: var(--text-3); }
.lvl code, .never code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
.never { display: flex; gap: 10px; padding: 10px 14px; border-radius: 12px; background: var(--surface-2); font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.never svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.never b { font-weight: 600; color: var(--text-1); }
.opened { padding: 12px 24px 14px 76px; border-bottom: 1px solid var(--line); background: var(--surface-2); }
.opened .never { margin-top: 8px; padding: 0; background: none; }
.prov { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-2); }
.prov svg.i { color: var(--good-text); }
.whose { display: flex; flex: none; align-items: center; gap: 10px; padding: 8px 12px 8px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-2); }
.whose > svg.i { color: var(--text-3); }
.whose b { font-weight: 600; color: var(--text-1); }
.whose .end { margin-left: auto; display: flex; align-items: center; gap: 6px; }
.whose.local { background: color-mix(in srgb, var(--warn) 10%, var(--surface-2)); }
.whose.local > svg.i { color: var(--warn-text); }
.guest { position: relative; display: flex; flex: 1; min-height: 0; margin: 14px 16px 16px; border: 1px dashed var(--line-strong); border-radius: 12px; background: var(--surface); overflow: hidden; }
.guest > .tag { position: absolute; z-index: 2; bottom: -1px; right: 16px; display: flex; align-items: center; gap: 5px; padding: 1px 8px; border: 1px dashed var(--line-strong); border-bottom: 0; border-radius: 8px 8px 0 0; background: var(--surface-2); font-size: 11px; color: var(--text-3); }
.apps { display: flex; flex: none; width: 290px; flex-direction: column; border-right: 1px solid var(--line); }
.apps h4, .tree h4 { display: flex; align-items: center; margin: 0; padding: 14px 16px 8px; font-size: 13px; font-weight: 600; }
.apps h4 small, .tree h4 small { margin-left: 8px; font-size: 12px; font-weight: 400; color: var(--text-3); }
.app { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 8px; padding: 9px 16px; border-top: 1px solid var(--line); font-size: 13px; }
.app.sel { background: var(--accent-soft); }
.app b { font-weight: 500; }
.app small { grid-column: 1 / 3; display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-3); }
.app small.o { color: var(--warn-text); }
.tree { position: relative; display: flex; flex: 1; min-width: 0; flex-direction: column; }
.tree h4 .end { margin-left: auto; display: flex; gap: 8px; }
.canvas { position: relative; flex: 1; margin: 16px; min-height: 330px; }
.canvas svg.w { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.canvas svg.w path { fill: none; stroke: var(--line-strong); stroke-width: 1.25; }
.nd { position: absolute; display: flex; width: 236px; height: 58px; flex-direction: column; justify-content: center; gap: 3px; padding: 0 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 13px; }
.nd .k { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
.nd .k b { overflow: hidden; font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.nd .s { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--text-2); white-space: nowrap; }
.nd .s .y { display: inline-flex; align-items: center; gap: 4px; }
.nd .s .y.o { color: var(--warn-text); font-weight: 500; }
.nd.root { background: var(--surface); box-shadow: inset 0 0 0 1px var(--line-strong), var(--shadow-panel); }
.asked { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 6px 16px; margin: 0; font-size: 13px; line-height: 19px; }
.asked dt { color: var(--text-3); }
.asked dd { margin: 0; }
.asked dd small { display: block; font-size: 12px; color: var(--text-2); }
.from { display: flex; gap: 10px; padding: 10px 14px; border: 1px solid var(--line); border-radius: 12px; font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.from svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.from b { font-weight: 600; color: var(--text-1); }
.steps { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; list-style: none; font-size: 13px; }
.steps li { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 6px 0; color: var(--text-2); }
.steps li svg.i { color: var(--text-3); }
.steps li.done svg.i { color: var(--good-text); }
.steps li.now { color: var(--text-1); font-weight: 500; }
.steps li.now svg.i { color: var(--progress-text, var(--accent-strong)); }
.steps li small { font-size: 12px; font-weight: 400; color: var(--text-3); }
.split { display: flex; height: 8px; gap: 2px; margin: 10px 0 6px; border-radius: 999px; overflow: hidden; }
.split i { display: block; background: var(--series-1); }
.split i + i { background: var(--text-3); opacity: 0.5; }
.cap { display: flex; flex: none; align-items: center; gap: 10px; margin: 12px 24px 0; padding: 10px 14px; border: 1px solid var(--line); border-radius: 12px; font-size: 13px; color: var(--text-2); }
.cap > svg.i { color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-1); }
.cap .end { margin-left: auto; font-size: 12px; color: var(--text-3); }
.member { flex: none; margin: 16px 24px 0; border: 1px dashed var(--line-strong); border-radius: 12px; overflow: hidden; }
.member > h4 { display: flex; align-items: center; gap: 8px; margin: 0; padding: 10px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; font-weight: 500; color: var(--text-2); }
.member .frow { padding-left: 16px; padding-right: 16px; }
.member .frow:last-child { border-bottom: 0; }
.dev { display: grid; flex: none; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); border-top: 1px solid var(--line-strong); background: var(--surface-2); }
.dev > div { padding: 12px 20px 14px; }
.dev > div + div { border-left: 1px solid var(--line); }
.dev h4 { margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.dev p { display: flex; gap: 8px; margin: 0 0 5px; font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.dev p svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.dev p.no svg.i { color: var(--warn-text); }
.dev code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.lvl > div { grid-template-columns: 16px minmax(0, 1fr) auto; }
.lvl > div > span > b { display: block; }
.lvl .not > svg.i { color: var(--text-3); }
.state { display: flex; flex: none; align-items: center; gap: 10px; margin: 0 16px 14px; padding: 8px 12px; border: 1px dashed var(--line-strong); border-radius: 10px; font-size: 12px; color: var(--text-2); }
.state b { font-weight: 600; color: var(--text-1); }
.state .lab { padding-right: 10px; border-right: 1px solid var(--line); font-size: 11px; color: var(--text-3); }
.guest { margin-bottom: 12px; }
.argo { display: grid; flex: 1; min-height: 0; grid-template-columns: 300px minmax(0, 1fr); gap: 16px; padding: 16px 16px 12px; align-items: start; }
.argo .apps { width: auto; border-right: 1px solid var(--line); }
.argo .app:first-of-type { border-top: 1px solid var(--line); }
.one { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.onehead { display: flex; align-items: center; gap: 10px; font-size: 17px; }
.onehead b { font-weight: 600; letter-spacing: -0.01em; }
.onehead .end { margin-left: auto; display: flex; gap: 8px; }
.tr .res { display: flex; align-items: center; font-size: 12px; color: var(--text-2); }
.tr .res .y { display: inline-flex; align-items: center; gap: 4px; }
.tr .res .y.o { color: var(--warn-text); font-weight: 500; }
.one .guest { margin: 0; flex: none; }
.kit { display: flex; height: 100%; flex-direction: column; background: var(--app-bg); }
.win.none { display: none; }
.kithead { display: flex; flex: none; align-items: baseline; gap: 12px; padding: 20px 24px 14px; font-size: 13px; color: var(--text-2); }
.kithead b { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; color: var(--text-1); }
.kithead .end { margin-left: auto; display: flex; gap: 14px; }
.wh { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 400; color: var(--text-3); white-space: nowrap; }
.wh.shared svg.i, .cell.shared .wh svg.i { color: var(--good-text); }
.wh.missing, .cell.missing .wh { color: var(--warn-text); font-weight: 500; }
.cells { display: grid; flex: 1; min-height: 0; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 12px; padding: 0 24px 20px; }
.cell { display: flex; min-width: 0; flex-direction: column; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.cell.missing { border-style: dashed; border-color: var(--line-strong); }
.cell h4 { display: flex; align-items: center; margin: 0; font-size: 13px; font-weight: 600; }
.cell h4 .wh { margin-left: auto; }
.cell .spec { display: flex; flex: 1; min-height: 0; align-items: center; padding: 10px 0; overflow: hidden; }
.cell > small { font-size: 11.5px; line-height: 16px; color: var(--text-3); }
.cell .wrap { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.cell .ph { display: flex; width: 100%; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; }
.cell .ph b { font-weight: 600; }
.cell .ph .end { margin-left: auto; }
.cell .ph svg.i { color: var(--text-2); }
.mt { display: grid; grid-template-columns: 70px 1fr 40px; align-items: center; gap: 10px; padding: 4px 0; font-size: 12.5px; color: var(--text-2); }
.mt .t { height: 6px; border-radius: 999px; background: color-mix(in srgb, var(--series-1) 20%, transparent); overflow: hidden; }
.mt .t i { display: block; height: 100%; border-radius: inherit; background: var(--series-1); }
.mt .r { text-align: right; font-variant-numeric: tabular-nums; }
.empty { display: flex; width: 100%; flex-direction: column; align-items: center; gap: 2px; font-size: 12px; color: var(--text-3); }
.empty b { margin-top: 4px; font-size: 13px; font-weight: 500; color: var(--text-1); }
.notyet { display: flex; gap: 8px; font-size: 12px; line-height: 18px; color: var(--text-3); }
.notyet svg.i { flex: none; margin-top: 2px; }
.first { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 16px; padding: 12px 16px; }
.firstside { display: flex; flex-direction: column; gap: 12px; justify-content: center; font-size: 13px; line-height: 19px; color: var(--text-2); }
.firstside p { margin: 0; }
.firstside b { font-weight: 600; color: var(--text-1); }
`

/**
 * What a plugin may do, in Lumovi's words (docs' security model, section 3): never the plugin's
 * own. The sentence is what a person reads; the note says what it's for in this plugin.
 */
type Perm = [glyph: IconName, sentence: string, note: string, strong?: 'warn' | 'red']

const ARGO: Perm[] = [
  [
    'pencil',
    'Changes and creates Argo CD objects, each time with your approval',
    'Sync, Refresh and Roll back. Each opens Lumovi’s own confirmation, with the exact change.',
  ],
  [
    'eye',
    'Reads the Argo CD objects in this cluster',
    'Applications, projects and application sets.',
  ],
  [
    'layers',
    'Reads Deployments, StatefulSets, Services, Ingresses and Pods',
    'Only the fields it names: name, labels, status and conditions. Nothing else of them reaches it.',
  ],
  [
    'app-window',
    'Has a page of its own, and code that describes it',
    'Lumovi draws the page from Lumovi’s own parts, under a bar with the plugin’s name.',
  ],
]

const ARGO_NOT =
  'It doesn’t ask to read ConfigMaps, Secrets or logs, to start programs, or to change who may do what.'

interface Plugin {
  glyph: IconName
  name: string
  version: string
  what: string
  /** Chips beyond "its own kinds", in short words; the last flag marks one that stands out. */
  chips: [IconName, string, ('code' | 'warn')?][]
  here: boolean
  state: 'installed' | 'available' | 'update'
}

const DATA: [IconName, string] = ['file-code-2', 'No code of its own']

const PLUGINS: Plugin[] = [
  {
    glyph: 'git-branch',
    name: 'Argo CD',
    version: '2.0.0',
    what: 'Applications, each with its tree of resources.',
    chips: [
      ['layers', 'Reads pods, workloads, services'],
      ['pencil', 'Changes its own kinds'],
      ['app-window', 'Its own page', 'code'],
    ],
    here: true,
    state: 'installed',
  },
  {
    glyph: 'layers',
    name: 'Argo Rollouts',
    version: '1.2.0',
    what: 'Rollouts, each with its steps.',
    chips: [
      ['layers', 'Reads pods, workloads'],
      ['pencil', 'Changes its own kinds'],
      ['app-window', 'Its own tab', 'code'],
    ],
    here: true,
    state: 'installed',
  },
  {
    glyph: 'network',
    name: 'Argo Workflows',
    version: '1.1.0',
    what: 'Workflows and their templates, with each run’s steps.',
    chips: [
      ['layers', 'Reads pods'],
      ['scroll-text', 'Reads logs'],
      ['play', 'Can start programs', 'warn'],
      ['app-window', 'Its own page', 'code'],
    ],
    here: true,
    state: 'available',
  },
  {
    glyph: 'git-merge',
    name: 'Flux',
    version: '1.3.1',
    what: 'Sources, Kustomizations and Helm releases.',
    chips: [['pencil', 'Changes its own kinds'], DATA],
    here: true,
    state: 'installed',
  },
  {
    glyph: 'server',
    name: 'Karpenter',
    version: '1.1.0',
    what: 'Node pools and node claims, with an overview.',
    chips: [['layers', 'Reads nodes, pods'], ['pencil', 'Changes its own kinds'], DATA],
    here: true,
    state: 'installed',
  },
  {
    glyph: 'database',
    name: 'Velero',
    version: '1.0.0',
    what: 'Backups, restores and schedules.',
    chips: [['pencil', 'Changes its own kinds'], DATA],
    here: false,
    state: 'installed',
  },
]

const chip = (glyph: IconName, text: string, kind = '') =>
  `<span class="lvc${kind === 'code' ? ' code' : kind === 'warn' ? ' out' : ''}">${icon(glyph, 12)}${text}</span>`

const chips = (p: Plugin) =>
  `<span class="lvs">${p.chips.map(([g, t, k]) => chip(g, t, k)).join('')}</span>`

type Mode = 'desktop' | 'server'

function row(p: Plugin, mode: Mode = 'desktop', o: { capped?: boolean } = {}): string {
  const act = o.capped
    ? `${icon('lock', 14)}Above the ceiling: not loaded`
    : mode === 'server'
      ? `Came with the server`
      : p.state === 'available'
        ? `<span class="btn secondary sm">Install…</span>`
        : p.state === 'update'
          ? `<span class="btn secondary sm">Update to 2.1.0…</span>`
          : `Installed${icon('chevron-down', 14)}`
  return `<div class="frow"><span class="glyph">${icon(p.glyph, 18)}</span>
    <span class="nm"><b>${p.name}</b><span class="v">${p.version}</span><small>${p.what}</small></span>
    ${chips(p)}
    ${p.here ? `<span class="here">${icon('circle-check', 14, 2, 'color:var(--good-text)')}This cluster runs it</span>` : `<span class="here no">${icon('minus', 14)}Not on this cluster</span>`}
    <span class="act">${act}</span></div>`
}

const head = `<div class="frow head"><span></span><span>Plugin</span><span>What it may do</span><span>On production</span><span></span></div>`

type Mark = 'yes' | 'new' | 'same'

/** One permission of the list: Lumovi's sentence, what it's for here, and its state. */
function perm([glyph, sentence, note]: Perm, mark: Mark = 'yes'): string {
  const st =
    mark === 'new'
      ? `<span class="st">${icon('plus', 14)}New in this version</span>`
      : mark === 'same'
        ? `<span class="st same">${icon('check', 14)}As you allowed</span>`
        : ''
  return `<div${mark === 'new' ? ' class="fresh"' : ''}>${icon(glyph, 16)}<span><b>${sentence}</b><span class="t">${note}</span></span>${st}</div>`
}

const notAsked = (text: string) =>
  `<div class="not">${icon('minus', 16)}<span class="t" style="display:block">${text}</span></div>`

const NEVER = `<div class="never">${icon('lock', 14)}<span><b>No plugin ever gets:</b> your kubeconfig and sign-in, the audit log, Lumovi’s own settings, another plugin’s data, a shell, or an address outside your cluster.</span></div>`

const reviewed = (v: string, extra = '') =>
  `<div class="from">${icon('shield-check', 14, 2, 'color:var(--good-text)')}<span><b>Reviewed in Lumovi’s repository.</b> Two of Lumovi’s maintainers read version ${v}’s source and what it asks for, and Lumovi’s workflow built it from that source. The signature checks out.${extra}</span></div>`

const SECTION: [string, IconName, string?][] = [
  ['Argo CD', 'git-branch'],
  ['Argo Rollouts', 'layers'],
  ['Flux', 'git-merge'],
  ['Karpenter', 'server'],
  ['All plugins', 'plug'],
]

const side = (
  label: string,
  glyph: IconName,
  o: { current?: string; extra?: [string, IconName]; tag?: string; omit?: string } = {},
) => ({
  after: '',
  label,
  icon: glyph,
  tag: o.tag ?? '',
  section: 'Plugins',
  current: o.current,
  items: o.extra
    ? [
        ...SECTION.slice(0, -1).filter(([n]) => n !== 'Argo Rollouts'),
        o.extra,
        SECTION[SECTION.length - 1]!,
      ]
    : SECTION.filter(([n]) => n !== o.omit),
})

const BAND = `<div class="band">${icon('info', 16)}<span>A plugin teaches Lumovi a tool. Most are data: lists, status and buttons, with no code of their own. Some bring a page of their own: their code describes it, and Lumovi draws it. Every one comes from Lumovi’s own repository, where it’s reviewed before it’s published, and each may do only what’s listed beside it.</span></div>`

/** 1. The Plugins page: what each may do, at a glance; one opened, with the list in plain words. */
function page(open = true, argo: Plugin['state'] = 'installed'): string {
  const rows = PLUGINS.filter((p) => p.name !== 'Velero')
    .map((p) => {
      const q = p.name === 'Argo CD' ? { ...p, state: argo } : p
      return (
        row(q) +
        (open && p.name === 'Argo CD'
          ? `<div class="opened"><div class="lvl">${ARGO.map((x) => perm(x)).join('')}${notAsked(ARGO_NOT)}</div>${NEVER}</div>`
          : '')
      )
    })
    .join('')
  return shell(
    'Plugins',
    'plug',
    side('All plugins', 'plug', { omit: argo === 'available' ? 'Argo CD' : undefined }),
    `${BAND}<div style="height:12px"></div>
    <div class="bar"><span class="n">34 plugins, 5 on this cluster</span>${seg(['All 34', 'On this cluster 5', 'With code of their own 3', `Updates ${argo === 'update' ? 1 : 0}`], 'All 34')}<span class="grow"></span><span class="field" style="width:220px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
    ${head}${rows}
    <div class="foot">${icon('info', 14)}5 of 34 shown${open ? ', Argo CD opened' : ''}. A plugin with no code of its own comes with Lumovi. One with code of its own is installed by asking first.</div>`,
    'All namespaces',
  )
}

/** 2. Installing one with a page of its own: Lumovi's sentences, to decide in ten seconds. */
function install(): string {
  return `${page(false, 'available')}<div class="scrim" style="bottom:92px"></div><div class="dialog" style="top:5%;width:680px">
    <div class="head"><div class="glyph">${icon('git-branch', 18)}</div><div><h3>Install Argo CD 2.0.0?</h3><div class="sub">A plugin with code of its own · for every cluster on this computer that runs Argo CD</div></div></div>
    <div class="body" style="gap:12px">
      <div class="lvl">${ARGO.map((x) => perm(x)).join('')}${notAsked(ARGO_NOT)}</div>
      ${NEVER}
      ${reviewed('2.0.0')}
      <div class="notyet">${icon('info', 14)}<span>In this sketch: these lines hold only as far as the sealed frame and the door between a plugin and Lumovi do. Neither exists yet.</span></div>
    </div>
    <div class="actions"><span class="auditnote">${icon('scroll-text', 14)}Recorded in the audit log</span><span class="btn ghost">Cancel</span><span class="btn primary" style="min-width:80px">Install</span></div>
  </div>`
}

const sync = (ok: boolean) =>
  ok
    ? `<span class="y">${icon('check', 12)}Synced</span>`
    : `<span class="y o">${icon('triangle-alert', 12)}Out of sync</span>`

interface TreeNode {
  id: string
  kind: string
  name: string
  x: number
  y: number
  synced?: boolean
  health: string
  root?: boolean
}

const TREE: TreeNode[] = [
  {
    id: 'app',
    kind: 'Application',
    name: 'shop',
    x: 0,
    y: 136,
    synced: false,
    health: pill('critical', 'Degraded'),
    root: true,
  },
  {
    id: 'svc',
    kind: 'Service',
    name: 'storefront',
    x: 290,
    y: 0,
    synced: true,
    health: pill('healthy', 'Healthy'),
  },
  {
    id: 'd1',
    kind: 'Deployment',
    name: 'storefront',
    x: 290,
    y: 68,
    synced: true,
    health: pill('healthy', 'Healthy'),
  },
  {
    id: 'd2',
    kind: 'Deployment',
    name: 'cart',
    x: 290,
    y: 136,
    synced: false,
    health: pill('critical', 'Degraded'),
  },
  {
    id: 'ing',
    kind: 'Ingress',
    name: 'shop',
    x: 290,
    y: 204,
    synced: true,
    health: pill('healthy', 'Healthy'),
  },
  {
    id: 'old',
    kind: 'Ingress',
    name: 'shop-old',
    x: 290,
    y: 272,
    synced: false,
    health: pill('neutral', 'Not in the repository'),
  },
  {
    id: 'p1',
    kind: 'Pods',
    name: '3 of 3 ready',
    x: 580,
    y: 68,
    health: pill('healthy', 'Running'),
  },
  {
    id: 'p2',
    kind: 'Pods',
    name: '1 of 2 ready',
    x: 580,
    y: 136,
    health: pill('critical', 'CrashLoopBackOff'),
  },
]

const WIRES: [string, string][] = [
  ['app', 'svc'],
  ['app', 'd1'],
  ['app', 'd2'],
  ['app', 'ing'],
  ['app', 'old'],
  ['d1', 'p1'],
  ['d2', 'p2'],
]

function tree(): string {
  const at = (id: string) => TREE.find((n) => n.id === id)!
  const wires = WIRES.map(([a, b]) => {
    const f = at(a)
    const t = at(b)
    const x1 = f.x + 236
    const y1 = f.y + 27
    const x2 = t.x
    const y2 = t.y + 27
    const m = (x1 + x2) / 2
    return `<path d="M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}"/>`
  }).join('')
  const nodes = TREE.map(
    (n) =>
      `<div class="nd${n.root ? ' root' : ''}" style="left:${n.x}px;top:${n.y}px"><span class="k">${n.kind}<b>${n.name}</b></span><span class="s">${n.synced === undefined ? '' : sync(n.synced)}${n.health}</span></div>`,
  ).join('')
  return `<div class="canvas"><svg class="w">${wires}</svg>${nodes}</div>`
}

const whose = (name = 'Argo CD', version = '2.0.0', extra = '') =>
  `<div class="whose">${icon('plug', 14)}<span>This page is from the plugin <b>${name}</b> ${version}. Lumovi draws it, from Lumovi’s own parts.</span>${extra}<span class="end"><span class="btn ghost sm">What it may do${icon('chevron-down', 14)}</span></span></div>`

const RES = 'grid-template-columns: 130px minmax(0, 1fr) 130px 190px'

/** An application's resources as a table whose rows nest: every part of it is the app's own. */
function resources(): string {
  const r = (kind: string, name: string, s: boolean | undefined, health: string, child = false) =>
    `<div class="tr" style="${RES};min-height:38px"><span class="mu"${child ? ' style="padding-left:32px"' : ''}>${kind}</span><span class="nm">${name}</span><span class="res">${s === undefined ? '' : sync(s)}</span><span>${health}</span></div>`
  return `<div class="cardx"><h2>Resources<small>5, and the Pods of each workload</small></h2>
    <div class="thead" style="${RES}"><span>Kind</span><span>Name</span><span>Sync</span><span>Health</span></div>
    ${r('Service', 'storefront', true, pill('healthy', 'Healthy'))}
    ${r('Deployment', 'storefront', true, pill('healthy', 'Healthy'))}
    ${r('Pods', '3 of 3 ready', undefined, pill('healthy', 'Running'), true)}
    ${r('Deployment', 'cart', false, pill('critical', 'Degraded'))}
    ${r('Pods', '1 of 2 ready', undefined, pill('critical', 'CrashLoopBackOff'), true)}
    ${r('Ingress', 'shop', true, pill('healthy', 'Healthy'))}
    ${r('Ingress', 'shop-old', false, pill('neutral', 'Not in the repository'))}
  </div>`
}

/** The one thing the kit lacks: a graph, in a region the plugin draws itself, bounded and named. */
const graph = () =>
  `<div class="guest"><span class="tag">${icon('plug', 11)}Drawn by the plugin itself</span>${tree()}</div>`

function argoPage(custom: boolean): string {
  const app = (n: string, repo: string, ok: boolean, health: string, sel = false) =>
    `<div class="app${sel ? ' sel' : ''}"><b>${n}</b>${health}<small${ok ? '' : ' class="o"'}>${ok ? icon('check', 12) : icon('triangle-alert', 12)}${ok ? 'Synced' : 'Out of sync'} · ${repo}</small></div>`
  const tile = (l: string, v: string, s: string) =>
    `<div class="tl" style="padding:12px 14px"><div class="l">${l}</div><div class="v" style="margin-top:6px;font-size:17px;letter-spacing:-0.01em">${v}</div><div class="s" style="margin-top:4px">${s}</div></div>`
  return shell(
    'Argo CD',
    'git-branch',
    side('Argo CD', 'git-branch'),
    `${whose('Argo CD', '2.0.0', custom ? `<span class="lvc out">${icon('brush', 12)}Draws part of its page itself</span>` : '')}
    <div class="argo">
      <div class="cardx apps"><h2>Applications<small>6</small></h2>
        ${app('shop', 'platform/apps/shop', false, pill('critical', 'Degraded'), true)}
        ${app('payments', 'platform/apps/payments', true, pill('healthy', 'Healthy'))}
        ${app('monitoring', 'platform/infra/monitoring', true, pill('progressing', 'Progressing'))}
        ${app('ingress', 'platform/infra/ingress', true, pill('healthy', 'Healthy'))}
        ${app('data', 'platform/apps/data', true, pill('healthy', 'Healthy'))}
        ${app('batch', 'platform/apps/batch', true, pill('neutral', 'Suspended'))}
      </div>
      <div class="one">
        <div class="onehead"><b>shop</b>${pill('critical', 'Degraded')}<span class="end"><span class="btn ghost sm">Refresh</span><span class="btn secondary sm">Roll back…</span><span class="btn primary sm">Sync…</span></span></div>
        <div class="tiles">${tile('Sync', 'Out of sync', '2 of 5 resources')}${tile('Revision', 'main at 4f1c9aa', 'platform/apps/shop')}${tile('Last synced', '2 hours ago', 'by jane@example.com')}${tile('Auto-sync', 'Off', 'Sync by hand')}</div>
        ${custom ? graph() : resources()}
      </div>
    </div>
    <div class="state"><span class="lab">Another state of this page</span>${icon('triangle-alert', 14, 2, 'color:var(--warn-text)')}<span><b>This plugin stopped responding.</b> The rest of Lumovi is unaffected.</span><span class="btn secondary sm" style="margin-left:auto">Stop it</span></div>`,
    'All namespaces',
  )
}

/** 3. The plugin's own page, made of Lumovi's parts: its code describes it, Lumovi draws it. */
const own = () => argoPage(false)

/** 3b. The same with the marked exception: a graph in a region the plugin draws itself. */
const custom = () => argoPage(true)

/** 4. A change the plugin's page asked for: Lumovi's own dialog, over the plugin's frame. */
function confirm(): string {
  return `${own()}<div class="scrim" style="bottom:92px"></div><div class="dialog" style="top:20px;width:620px;max-height:none">
    <div class="head"><div class="glyph">${icon('git-branch', 18)}</div><div><h3>Sync shop?</h3><div class="sub">Application · argocd · on production</div></div></div>
    <div class="body" style="gap:12px">
      <div class="from">${icon('plug', 14)}<span><b>Asked by Argo CD 2.0.0.</b> This dialog is Lumovi’s, not the plugin’s. Nothing changes unless you approve, and the plugin can’t approve for you.</span></div>
      <dl class="asked">
        <dt>Revision</dt><dd>main at 4f1c9aa</dd>
        <dt>Prune</dt><dd>Yes<small>Argo CD will delete what’s no longer in the repository: Ingress shop-old.</small></dd>
      </dl>
      <div class="command" style="margin-top:0"><div class="label">The exact change, to Application shop<span style="letter-spacing:0;text-transform:none;font-weight:400">The cluster was asked first: it would accept it</span></div><code>operation:
  sync:
    revision: 4f1c9aa
    prune: true</code></div>
      <div class="command" style="margin-top:0"><div class="label">The same, by hand${icon('copy', 14)}</div><code><span class="env">kubectl --context production -n argocd</span> patch application shop --type merge \\
  -p '{"operation":{"sync":{"revision":"4f1c9aa","prune":true}}}'</code></div>
    </div>
    <div class="actions"><span class="auditnote">${icon('scroll-text', 14)}Recorded, naming the plugin, whether you approve or refuse</span><span class="btn ghost">Refuse</span><span class="btn primary" style="min-width:80px">Approve</span></div>
  </div>`
}

/** 5. A plugin's tab on an object of its own kind, marked as the plugin's. */
function tab(): string {
  const G = 'grid-template-columns: minmax(180px, 1.6fr) 170px 80px'
  const r = (n: string, st: string, ready: string, sel = false) =>
    `<div class="tr${sel ? ' sel' : ''}" style="${G}"><span class="nm">${n}<small>shop</small></span><span>${st}</span><span class="m">${ready}</span></div>`
  const step = (cls: string, glyph: IconName, text: string, note = '') =>
    `<li class="${cls}">${icon(glyph, 14)}<span>${text}</span><small>${note}</small></li>`
  return shell(
    'Rollouts',
    'layers',
    side('Argo Rollouts', 'layers'),
    `<div class="two"><div>
      <div class="bar"><span class="n">3 items</span></div>
      <div class="thead" style="${G}"><span>Name</span><span>Status</span><span>Ready</span></div>
      ${r('cart', pill('healthy', 'Healthy'), '2/2')}${r('checkout', pill('progressing', 'Paused'), '4/4', true)}${r('storefront', pill('healthy', 'Healthy'), '3/3')}
    </div><aside class="dpanel">
      <div class="hd"><span class="glyph">${icon('layers', 18)}</span><span><small>Rollout · shop · 88d old</small><b>checkout</b></span><span style="margin-left:auto;display:flex;gap:8px;align-items:center"><span class="btn primary sm">Promote</span><span class="btn secondary sm">Abort</span></span></div>
      <div class="tabsx"><span>Overview</span><span>Pods</span><span class="on">${icon('plug', 12)}Steps</span><span>Events</span><span>YAML</span></div>
      <div class="whose" style="padding-left:20px">${icon('plug', 14)}<span>This tab is from the plugin <b>Argo Rollouts</b> 1.2.0</span><span class="end"><span class="btn ghost sm">What it may do${icon('chevron-down', 14)}</span></span></div>
      <div><section class="sec"><h3>A canary, at step 4 of 5</h3>
          <div style="display:flex;align-items:center;gap:8px;font-size:13px">${pill('progressing', 'Paused at 50%')}<span style="color:var(--text-3)">waiting to be promoted, for 12 minutes</span></div>
          <div class="split"><i style="width:50%"></i><i style="width:50%"></i></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2)"><span>New, 9be02d1: 2 pods, 50% of traffic</span><span>Stable, 4f1c9aa: 2 pods</span></div>
        </section>
        <section class="sec"><h3>Steps</h3><ul class="steps">
          ${step('done', 'circle-check', 'Send 20% to the new version', 'done')}
          ${step('done', 'circle-check', 'Wait 10 minutes', 'done')}
          ${step('done', 'circle-check', 'Send 50% to the new version', 'done')}
          ${step('now', 'clock', 'Wait until someone promotes it', 'now')}
          ${step('', 'minus', 'Send everything to the new version', '')}
        </ul></section>
        <section class="sec" style="border-bottom:0"><h3>The two versions’ Pods</h3>
          <dl class="kv"><dt>New, 9be02d1</dt><dd>2 of 2 ready, 0 restarts</dd><dt>Stable, 4f1c9aa</dt><dd>2 of 2 ready, 0 restarts</dd></dl>
        </section>
      </div>
    </aside></div>`,
  )
}

/** 6. An update that asks for more than was granted: what's new in what it may do, first. */
function more(): string {
  return `${page(false, 'update')}<div class="scrim" style="bottom:92px"></div><div class="dialog" style="top:5%;width:680px">
    <div class="head"><div class="glyph">${icon('git-branch', 18)}</div><div><h3>Update Argo CD to 2.1.0?</h3><div class="sub">You have 2.0.0 · the new version asks for more than you allowed</div></div></div>
    <div class="body" style="gap:12px">
      <div class="warning"><div class="top">${icon('triangle-alert', 16)}<div><h4>It asks for one thing more</h4><p>Until you allow it, Lumovi keeps 2.0.0 and nothing changes.</p></div></div></div>
      <div class="lvl">
        ${perm(['scroll-text', 'Reads containers’ logs', 'To show a failing Pod’s last lines in an application’s tree. It follows your rule for logs, and each read is recorded.'], 'new')}
        ${ARGO.map((x) => perm([x[0], x[1], ''], 'same')).join('')}
      </div>
      ${reviewed('2.1.0', ' Lumovi worked out this comparison from the two versions; it isn’t the author’s description.')}
    </div>
    <div class="actions"><span class="auditnote">${icon('scroll-text', 14)}Recorded in the audit log</span><span class="btn ghost">Stay on 2.0.0</span><span class="btn primary">Allow and update</span></div>
  </div>`
}

/** 7. A team's server: what came with it, the organisation's ceiling, and a member's first open. */
function server(): string {
  const rows = PLUGINS.filter((p) => ['Argo CD', 'Argo Workflows', 'Flux'].includes(p.name))
  return shell(
    'Plugins',
    'plug',
    side('All plugins', 'plug'),
    `<div class="band">${icon('users', 16)}<span><b style="font-weight:600;color:var(--text-1)">You’re one of this server’s administrators.</b> Its plugins came with its image, for everyone who signs in. A plugin works with each person’s own access to the cluster, never the server’s. To add or update one, upgrade the server.</span></div>
    <div class="cap">${icon('lock', 16)}<span><b>Your organisation’s ceiling:</b> no plugin may read what’s in Secrets, start programs, or change who may do what.</span><span class="end">Set where the server is deployed</span></div>
    <div style="height:12px"></div>
    <div class="bar"><span class="n">33 for everyone, 1 above the ceiling</span>${seg(['All 34', 'On this cluster 5', 'With code of their own 3'], 'All 34')}<span class="grow"></span><span class="field" style="width:220px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
    ${head}${rows.map((p) => row({ ...p, state: 'installed' }, 'server', { capped: p.name === 'Argo Workflows' })).join('')}
    <div class="member"><h4>${icon('user', 14)}What a member sees, the first time they open Argo CD’s page (once for each version)</h4>
      <div class="first"><div class="lvl">${ARGO.map((x) => perm([x[0], x[1], ''])).join('')}</div>
        <div class="firstside"><p><b>Argo CD 2.0.0 is a plugin.</b> Your administrators installed it for everyone on this server. It works with your own access, and Lumovi asks you before any change.</p><div style="display:flex;gap:8px"><span class="btn primary sm">Open its page</span><span class="btn ghost sm">Not now</span></div></div>
      </div>
    </div>
    <div style="flex:1"></div>
    <div class="foot">${icon('scroll-text', 14)}3 of 34 shown. A member can’t install, update or remove a plugin. What each plugin reads and asks to change is recorded with the member’s name and the plugin’s.</div>`,
    'All namespaces',
  )
}

/** 8. Writing one: a developer mode, loaded from a folder, loudly marked wherever it shows. */
function local(): string {
  const tile = (l: string, v: string, s: string) =>
    `<div class="tl"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`
  const G = 'grid-template-columns: minmax(160px, 1.4fr) 110px 110px 150px'
  const r = (n: string, w: string, a: string, st: string) =>
    `<div class="tr" style="${G};min-height:38px"><span class="nm">${n}</span><span class="r">${w}</span><span class="r">${a}</span><span>${st}</span></div>`
  return shell(
    'Queues',
    'folder',
    side('Queues', 'folder', { extra: ['Queues', 'folder'], tag: 'not reviewed' }),
    `<div class="whose local">${icon('triangle-alert', 14)}<span><b>Developer mode: not reviewed, from your computer.</b> The plugin Queues, loaded from <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px">~/code/queues-plugin</span></span><span class="lvc local">${icon('rotate-cw', 12)}Reloads when you save</span><span class="end"><span class="btn ghost sm">Turn developer mode off</span></span></div>
    <div style="display:flex;flex:1;min-height:0;flex-direction:column">
      <div class="pad" style="gap:12px;padding:16px">
        <div class="tiles">${tile('Waiting', '1,204', 'jobs in 4 queues')}${tile('Oldest', '6 min', 'in the queue emails')}${tile('Workers', '14', '2 of them idle')}${tile('Failed today', '31', '0.4% of what ran')}</div>
        <div class="cardx"><h2>Queues<small>From your team’s Queue objects</small></h2>
          <div class="thead" style="${G}"><span>Name</span><span style="text-align:right">Waiting</span><span style="text-align:right">Workers</span><span>Status</span></div>
          ${r('emails', '880', '4', pill('warning', 'Falling behind'))}${r('exports', '212', '6', pill('healthy', 'Keeping up'))}${r('thumbnails', '112', '4', pill('healthy', 'Keeping up'))}
        </div>
      </div>
    </div>
    <div class="dev">
      <div><h4>What it asks for, in its manifest</h4>
        <p>${icon('eye', 14)}<span>Reads the Queues objects in this cluster</span></p>
        <p>${icon('layers', 14)}<span>Reads Pods: name, labels, conditions</span></p>
        <p>${icon('app-window', 14)}<span>Has a page of its own, and code that describes it</span></p>
      </div>
      <div><h4>What Lumovi refused while it ran, 2</h4>
        <p class="no">${icon('triangle-alert', 14)}<span>It asked to read what’s in a Secret in <code>shop</code>. Its manifest doesn’t ask for that.</span></p>
        <p class="no">${icon('triangle-alert', 14)}<span>It asked to reach <code>hooks.example.com</code>. No plugin reaches an address outside the cluster.</span></p>
        <p>${icon('info', 14)}<span>The repository runs the same checks on a pull request, before two maintainers read it.</span></p>
      </div>
    </div>`,
    'All namespaces',
  )
}

type Where = 'shared' | 'lift' | 'missing'

const WHERE: Record<Where, [IconName, string]> = {
  shared: ['circle-check', 'A shared part today'],
  lift: ['layers', 'Inside one page today'],
  missing: ['plus', 'Missing'],
}

const part = (name: string, where: Where, from: string, body: string) =>
  `<div class="cell ${where}"><h4>${name}<span class="wh">${icon(WHERE[where][0], 12)}${WHERE[where][1]}</span></h4><div class="spec">${body}</div><small>${from}</small></div>`

/** 9. The kit's first set: what a plugin's page can be made of, each as the app draws it today. */
function kit(): string {
  const G = 'grid-template-columns: minmax(0, 1fr) 90px 60px'
  const tr = (n: string, st: string, a: string) =>
    `<div class="tr" style="${G};min-height:32px"><span class="nm">${n}</span><span>${st}</span><span class="r mu">${a}</span></div>`
  const meter = (l: string, pct: number, v: string) =>
    `<div class="mt"><span>${l}</span><span class="t"><i style="width:${pct}%"></i></span><span class="r">${v}</span></div>`
  const line = [22, 26, 24, 30, 28, 35, 33, 40, 37, 46, 44, 50]
  const pts = line.map((y, i) => `${i * 22},${58 - y}`).join(' ')
  return `<div class="kit">
    <div class="kithead"><b>The kit’s first set</b><span>What a plugin’s page can be made of. Each part is drawn as the app draws it today; nothing here is a new design.</span>
      <span class="end">${(['shared', 'lift', 'missing'] as Where[]).map((w) => `<span class="wh ${w}">${icon(WHERE[w][0], 12)}${WHERE[w][1]}</span>`).join('')}</span></div>
    <div class="cells">
      ${part(
        'Page header',
        'shared',
        'PageHeader, in the shell; three pages use it',
        `<div class="ph">${icon('git-branch', 16)}<b>Argo CD</b><span class="end"><span class="btn ghost sm">Refresh</span></span></div>`,
      )}
      ${part('Card', 'shared', 'Card', `<div class="cardx" style="width:100%"><h2>By namespace<small>this month</small></h2><div style="padding:0 16px 14px;font-size:12px;color:var(--text-3)">A titled box for anything below.</div></div>`)}
      ${part('Tile', 'lift', 'The Overview’s tiles', `<div class="tl" style="width:100%;padding:12px 14px"><div class="l">Nodes ready</div><div class="v" style="margin-top:6px;font-size:22px">9</div><div class="s" style="margin-top:4px">4 of them on spot</div></div>`)}
      ${part('Status', 'shared', 'Status: pill and dot, five levels', `<div class="wrap">${pill('healthy', 'Healthy')}${pill('progressing', 'Progressing')}${pill('warning', 'Pending')}${pill('critical', 'Degraded')}${pill('neutral', 'Suspended')}</div>`)}
      ${part(
        'Table',
        'shared',
        'ResourceTable, in the resource lists; six places use it',
        `<div style="width:100%"><div class="thead" style="${G};height:28px"><span>Name</span><span>Status</span><span style="text-align:right">Age</span></div>${tr('cart', pill('healthy', 'Ready'), '88d')}${tr('checkout', pill('progressing', 'Rolling out'), '41d')}</div>`,
      )}
      ${part('Details list', 'lift', 'An object’s details, built from several pieces', `<dl class="kv" style="width:100%;grid-template-columns:110px 1fr;gap:6px 16px"><dt>Project</dt><dd>default</dd><dt>Revision</dt><dd>main at 4f1c9aa</dd><dt>Auto-sync</dt><dd>No</dd></dl>`)}
      ${part('Meter', 'shared', 'Meter', `<div style="width:100%">${meter('CPU', 62, '62%')}${meter('Memory', 81, '81%')}</div>`)}
      ${part('Stacked bar', 'shared', 'StackedBar', `<div style="width:100%"><div class="split" style="margin:0 0 6px"><i style="width:44%"></i><i style="width:56%"></i></div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2)"><span>Spot 4</span><span>On demand 5</span></div></div>`)}
      ${part('Tabs', 'shared', 'Tabs', `<div class="tabsx" style="width:100%;padding:0"><span class="on">Overview</span><span>Pods</span><span>Events</span><span>YAML</span></div>`)}
      ${part('Buttons', 'shared', 'Button', `<div class="wrap"><span class="btn primary sm">Sync…</span><span class="btn secondary sm">Roll back…</span><span class="btn ghost sm">Refresh</span><span class="btn danger-ghost sm">Delete…</span></div>`)}
      ${part('Fields', 'lift', 'Switch, number and search are shared; text, chips and the segmented choice sit in Access and AI assistants', `<div class="wrap"><span class="field" style="width:150px">main</span>${seg(['Yes', 'No'], 'Yes')}<span class="field" style="width:120px;color:var(--text-3)">${icon('search', 14)}Search</span></div>`)}
      ${part('Charts', 'shared', 'TimeChart, Sparkline, Histogram', `<svg viewBox="0 0 242 60" style="width:100%;height:60px"><polyline points="${pts}" fill="none" stroke="var(--series-1)" stroke-width="1.75" stroke-linejoin="round"/><line x1="0" y1="59.5" x2="242" y2="59.5" stroke="var(--line)"/></svg>`)}
      ${part('Empty, error, loading', 'shared', 'States', `<div class="empty">${icon('search', 18)}<b>No applications</b><span>Nothing matches “shop-old”.</span></div>`)}
      ${part('YAML and a difference', 'shared', 'YamlText, DiffView', `<pre class="yaml" style="width:100%;padding:8px 12px;font-size:11.5px;line-height:18px"><span class="k">spec</span>:\n  <span class="k">suspend</span>: true</pre>`)}
      ${part('A table whose rows nest', 'missing', 'Argo CD’s resources need it (frame 3)', `<div style="width:100%"><div class="tr" style="${G};min-height:32px"><span class="nm">Deployment cart</span><span></span><span></span></div><div class="tr" style="${G};min-height:32px"><span class="nm" style="padding-left:32px;font-weight:400;color:var(--text-2)">Pods, 1 of 2 ready</span><span></span><span></span></div></div>`)}
      ${part('A graph of objects', 'missing', 'The Map draws one, as a page of its own. Frame 3b is the way out', `<svg viewBox="0 0 242 60" style="width:100%;height:60px"><path d="M70 30 C100 30 100 14 130 14 M70 30 C100 30 100 46 130 46" fill="none" stroke="var(--line-strong)"/><rect x="2" y="18" width="68" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line-strong)"/><rect x="130" y="2" width="68" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/><rect x="130" y="34" width="68" height="24" rx="6" fill="var(--surface-2)" stroke="var(--line)"/></svg>`)}
    </div>
  </div>`
}

export type Frame =
  'page' | 'install' | 'own' | 'custom' | 'confirm' | 'tab' | 'more' | 'server' | 'local' | 'kit'

export const FRAMES: { id: Frame; title: string; today: string; fresh: string; risk: string }[] = [
  {
    id: 'page',
    title: '1. The Plugins page',
    today:
      '32 add-ons ship inside the app, all data, and no page lists them. One page is code: Karpenter’s overview, built into the app.',
    fresh:
      'Every plugin with what it may do, at a glance and in Lumovi’s own sentences. Assumed: plugins with no code come with Lumovi; one with code is installed by asking.',
    risk: 'Each sentence is a promise Lumovi has to enforce on the plugin’s code, not only print. Assumed for Péter: no address outside the cluster, ever (docs’ position).',
  },
  {
    id: 'install',
    title: '2. Installing one with its own page',
    today: 'Nothing is installed: an add-on arrives with a release of Lumovi.',
    fresh:
      'A sheet in Lumovi’s words: what it may do, what no plugin ever gets, who reviewed it. All or nothing, no switch per line. Frame 1 is the page after this install.',
    risk: 'None of it is built. The first ticket is a spike that tries every way out of the sealed frame. And “reviewed” is two maintainers reading every version, for good.',
  },
  {
    id: 'own',
    title: '3. The plugin’s own page',
    today:
      'Argo CD’s add-on is a list of Applications with Sync and Refresh. It can’t draw a tree, or ask for a sync’s options.',
    fresh:
      'Its code describes the page and Lumovi draws it from its own parts: native in both themes and on a phone. The bar with its name is Lumovi’s. Karpenter’s overview, moved this way pixel for pixel, would be the first test.',
    risk: 'The kit of parts is the largest piece of the work, and a page can be made only of what it has. This page needs one thing it lacks: a table whose rows nest.',
  },
  {
    id: 'custom',
    title: '3b. The same, with a graph the plugin draws',
    today:
      'The Map draws objects and their lines, as a page of its own. No part of the app is a graph another page could reuse.',
    fresh:
      'The exception: one region the plugin draws itself, bounded and labelled, and a permission of its own at install (“Draws part of its page itself”).',
    risk: 'In that region the plugin has pixels: it can drift from Lumovi’s look, or imitate it. Design’s view: frame 3 does the job without it. Build this only if a plugin proves the need.',
  },
  {
    id: 'confirm',
    title: '4. A change the plugin asks for',
    today:
      'Lumovi confirms an AI assistant’s change in its own dialog, with the change and the command. Only a deletion asks for something typed: the object’s name.',
    fresh:
      'The same for a plugin, by today’s rules: Lumovi’s dialog, partly over Lumovi’s own header, the plugin’s page dimmed and inert. Approve waits a moment after it opens.',
    risk: 'Two clicks for every change a plugin’s code asks for, always. Its buttons are Lumovi’s parts and look like Lumovi’s; what they ask is decided here, in Lumovi’s words.',
  },
  {
    id: 'tab',
    title: '5. A plugin’s tab on its own kind',
    today:
      'A Rollout’s page has Lumovi’s tabs, and Promote and Abort as buttons from the add-on’s data. An add-on can’t add a tab or draw the steps.',
    fresh:
      'A tab from the plugin on its own kind, marked with the plug, under the same bar as its page. Its buttons stay data, as today.',
    risk: 'A tab on a Deployment or a Pod is not in the first release (app’s plan): it needs an order and a limit first, or five plugins crowd a Pod’s page.',
  },
  {
    id: 'more',
    title: '6. An update that asks for more',
    today: 'An add-on changes only with a new Lumovi.',
    fresh:
      'What’s new in what it may do comes first, and has to be allowed again; the rest is listed as unchanged. Never automatic; saying no keeps the version you have.',
    risk: 'Saying no leaves a person on the old version, without its fixes. For Péter: talking to the tool’s own server in the cluster isn’t drawn (docs: possible later, only through Lumovi).',
  },
  {
    id: 'server',
    title: '7. On a team’s server',
    today: 'A server’s add-ons come with its image and its chart’s settings.',
    fresh:
      'The administrator sees what came with the image and the organisation’s ceiling. A member sees what a plugin may do on first opening its page. Argo Workflows is above the ceiling because it can start programs.',
    risk: 'A plugin’s code runs in every member’s browser. Each request has to be checked on the server against that member’s own access, never in the page.',
  },
  {
    id: 'local',
    title: '8. Writing one',
    today:
      'A person’s own add-on is a YAML file in a folder. A mistake in it is listed with its reason; a view of a kind that has its own page loses its columns without a word.',
    fresh:
      'A developer mode the person switches on, on the desktop only: a plugin from a folder, held to its manifest, marked “not reviewed” in the sidebar and on its page.',
    risk: 'Undecided, and Péter’s choice. Docs’ position: no code runs that Lumovi’s workflow didn’t sign. An author still has to run what they’re writing; this is that exception.',
  },
  {
    id: 'kit',
    title: '9. The kit’s first set',
    today:
      'Most of what a page needs is already a part of the app: 11 of these 16 are shared parts (9 in the components folder, 2 beside the pages that use them), and 3 are drawn inside one page and would be lifted out.',
    fresh:
      'The same parts, given to plugin authors as a kit with names and properties that stay stable. Two are missing: a table whose rows nest, and a graph.',
    risk: 'The kit is the largest piece of the work and a promise kept for years: every part on a phone, in both themes, named for screen readers. Design checks each one.',
  },
]

export const WINDOW: Size = { width: 1440, height: 992 }

/** A frame, in one theme, with its three lines under it. */
export function fullFrame(id: Frame, scheme: Scheme): string {
  const body = { page: () => page(), install, own, custom, confirm, tab, more, server, local, kit }[
    id
  ]()
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
</style>${id === 'kit' ? `<div class="win" style="display:block">${body}</div>` : body}<div class="strip3"><b>Today</b><span>${f.today}</span><b>Would be new</b><span>${f.fresh}</span><b>Cost or risk</b><span class="risk">${f.risk}</span></div>`
}
