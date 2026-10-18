/**
 * Search the cluster (LMV-171), as app's plan and the approved sketch (LMV-214) have it: a Search
 * page that finds any listed kind by part of a name or by labels, grouped by kind with status;
 * the palette finding the same as you type; saved searches a key away; and the page on a phone.
 * Drawn in Lumovi's window from main's lists and palette. Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, pill, pods, win } from './windows.ts'

type WLevel = Parameters<typeof pill>[0]

const CSS = `${WINDOW}
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
.rules code, .mono { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
code, .mono, .m, .lbl, .q, .how dt, .hint code { font-variant-ligatures: none; }
.rowx { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }
/* The page's field, its count, and the saved searches. */
.sq { display: flex; flex: none; align-items: center; gap: 10px; padding: 14px 20px 10px; }
.sq .big { display: flex; flex: 1; min-width: 0; height: 40px; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--accent); border-radius: 10px; box-shadow: 0 0 0 3px var(--accent-soft); font-size: 14px; }
.sq .big svg.i { color: var(--text-3); }
.sq .big .q { white-space: pre; }
.sq .big .q code { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.sq .big .caret { width: 1.5px; height: 18px; margin-left: -9px; background: var(--text-1); }
.sq .big .ph { color: var(--text-3); }
.sq .big .end { margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text-3); white-space: nowrap; }
.sq .big .end b { font-weight: 500; color: var(--text-2); }
.sq .big .end .stop { color: var(--accent-strong); font-weight: 500; }
.spin { color: var(--text-3); }
.saved { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 6px 8px; padding: 0 20px 12px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.sv { display: inline-flex; height: 26px; align-items: center; gap: 7px; padding: 0 6px 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-1); white-space: nowrap; }
.sv code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
.sv .kbd { min-width: 16px; height: 16px; font-size: 10px; }
.sv.on { border-color: var(--accent); background: var(--accent-soft); }
.sv .x { color: var(--text-3); }
.hint { margin-left: auto; color: var(--text-3); }
.hint code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-2); }
/* The results: a group a kind, its rows as a list's. */
.grp { display: flex; flex: none; height: 34px; align-items: center; gap: 8px; padding: 0 24px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; font-weight: 500; color: var(--text-2); }
.grp svg.i { color: var(--text-3); }
.grp .c { font-weight: 400; color: var(--text-3); }
.grp .cap2 { margin-left: auto; font-weight: 400; color: var(--warn-text); }
.tr .hit { border-radius: 3px; background: color-mix(in srgb, var(--accent) 22%, transparent); color: var(--text-1); }
.tr .lbl { display: inline-flex; height: 20px; align-items: center; padding: 0 6px; border-radius: 5px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-1); white-space: nowrap; }
.tr .lbl + .lbl { margin-left: 4px; }
.tr .lbls { display: flex; overflow: hidden; }
.capline { display: flex; flex: none; align-items: center; gap: 8px; padding: 8px 24px; border-bottom: 1px solid var(--line); font-size: 12.5px; color: var(--text-2); }
.capline svg.i { color: var(--warn-text); }
.capline .lnk { color: var(--accent-strong); font-weight: 500; }
.foot { display: flex; flex: none; gap: 8px; padding: 12px 24px; font-size: 12.5px; line-height: 18px; color: var(--text-3); }
.foot svg.i { flex: none; margin-top: 2px; }
.foot b { font-weight: 500; color: var(--text-2); }
.foot .lnk { color: var(--accent-strong); font-weight: 500; }
.pend { display: flex; flex: none; height: 34px; align-items: center; gap: 8px; padding: 0 24px; font-size: 12px; color: var(--text-3); }
/* The empty page and nothing found. */
.blank { display: flex; flex-direction: column; gap: 18px; padding: 28px 24px; }
.blank h3 { margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.svl { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 10px; max-width: 640px; }
.svl .r { display: flex; height: 40px; align-items: center; gap: 10px; padding: 0 8px 0 14px; font-size: 13px; }
.svl .r + .r { border-top: 1px solid var(--line); }
.svl .r code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.svl .r .keys { margin-left: auto; display: flex; gap: 3px; }
.svl .r .x { display: grid; width: 26px; height: 26px; place-items: center; color: var(--text-3); }
.how { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 6px 16px; max-width: 640px; margin: 0; font-size: 13px; }
.how dt { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--text-1); }
.how dd { margin: 0; color: var(--text-2); }
.how dt.k2 { font-family: inherit; font-size: 13px; color: var(--text-3); }
.how dd code { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.none { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 56px 24px 36px; text-align: center; }
.none svg.i { color: var(--text-3); }
.none b { font-size: 14px; font-weight: 500; }
.none p { margin: 0; max-width: 460px; font-size: 13px; color: var(--text-2); }
.none code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
/* The palette, over the page. */
.scrim { position: absolute; inset: 0; z-index: 20; background: rgb(0 0 0 / 0.32); }
.pal { position: absolute; z-index: 30; top: 92px; left: 50%; width: 640px; overflow: hidden; transform: translateX(-50%); border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface); box-shadow: 0 24px 64px -16px rgb(0 0 0 / 0.45); }
.pal .in { display: flex; height: 48px; align-items: center; gap: 10px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 14px; }
.pal .in svg.i { color: var(--text-3); }
.pal .in .caret { width: 1.5px; height: 18px; margin-left: -9px; background: var(--text-1); }
.pal .in .ph { color: var(--text-3); }
.pal .bd { padding: 6px; }
.pal .gl { display: flex; padding: 10px 10px 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.pal .gl small { margin-left: auto; font-size: 11.5px; font-weight: 400; letter-spacing: 0; text-transform: none; }
.pal .it { display: flex; height: 40px; align-items: center; gap: 12px; padding: 0 10px; border-radius: 8px; font-size: 13.5px; }
.pal .it > svg.i { color: var(--text-2); }
.pal .it.hl { background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); }
.pal .it .nm2 { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.pal .it .nm2 small { margin-left: 8px; font-size: 12px; color: var(--text-3); }
.pal .it .nm2 code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.pal .it .hit { border-radius: 3px; background: color-mix(in srgb, var(--accent) 22%, transparent); }
.pal .it .keys { display: flex; gap: 3px; }
.pal .it .r2 { font-size: 12px; color: var(--text-3); white-space: nowrap; }
.pal .ft2 { display: flex; gap: 16px; padding: 8px 14px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--text-3); }
.pal .ft2 span { display: inline-flex; align-items: center; gap: 4px; }
/* On a phone. */
.phs { display: flex; width: 390px; height: 844px; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.phs .pb { display: flex; height: 52px; flex: none; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phs .pb b { flex: 1; font-weight: 600; }
.phs .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phs .pf { display: flex; height: 44px; align-items: center; gap: 10px; margin: 12px 16px 8px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 10px; font-size: 15px; }
.phs .pf svg.i { color: var(--text-3); }
.phs .pf .end { margin-left: auto; font-size: 13px; color: var(--text-3); }
.phs .psv { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 16px 12px; border-bottom: 1px solid var(--line); }
.phs .psv .sv { height: 32px; font-size: 13px; padding: 0 12px; }
.phs .pg { display: flex; align-items: center; gap: 8px; padding: 10px 16px 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.phs .pg .c { font-weight: 400; color: var(--text-3); }
.phs .pr { display: flex; min-height: 60px; align-items: center; gap: 10px; padding: 8px 16px; border-bottom: 1px solid var(--line); }
.phs .pr .w2 { min-width: 0; flex: 1; }
.phs .pr .w2 b { display: block; overflow: hidden; font-size: 15px; font-weight: 400; white-space: nowrap; text-overflow: ellipsis; }
.phs .pr .w2 small { display: block; font-size: 13px; color: var(--text-3); }
.phs .pr .hit { border-radius: 3px; background: color-mix(in srgb, var(--accent) 22%, transparent); }
.phs .pr .lbl { display: inline-flex; height: 20px; align-items: center; margin-top: 3px; padding: 0 6px; border-radius: 5px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.phs .pfoot { padding: 12px 16px; font-size: 13px; line-height: 19px; color: var(--text-3); }
`

/** The sidebar gains Search, after Helm releases, as the sketch has it. */
const withSearch = (on: boolean) => (html: string) =>
  html.replace(
    /(<div class="n[^"]*">[^]*?Helm releases<\/div>)/,
    `$1<div class="n${on ? ' on' : ''}">${icon('search', 16)}Search</div>`,
  )

const swin = (o: {
  page: string
  panel?: { html: string; width: number }
  w?: number
  h?: number
  ns?: string
  title?: string
  glyph?: IconName
  on?: boolean
  extra?: string
}) =>
  withSearch(o.on ?? true)(
    win({
      w: o.w ?? 1376,
      h: o.h ?? 760,
      cluster: 'production-eu',
      nav: o.on === false ? 'Pods' : '',
      title: o.title ?? 'Search',
      glyph: o.glyph ?? 'search',
      ns: o.ns,
      page: o.page,
      panel: o.panel,
      dock: dock([]),
      more: true,
      extra: o.extra,
    }),
  )

const kbd = (...keys: string[]) => keys.map((k) => `<span class="kbd">${k}</span>`).join('')

/** A name with what was typed marked in it. */
const hit = (name: string, q: string) =>
  q ? name.replace(q, `<span class="hit">${q}</span>`) : escape(name)

/** Cut in its middle, keeping its end, as Lumovi's lists cut a long name. */
const middle = (name: string, keep = 18) =>
  name.length <= keep ? name : `${name.slice(0, keep - 7)}…${name.slice(-6)}`

const field = (q: string, end: string, label = false, square = false) =>
  `<div class="sq"><span class="big">${icon('search', 16)}${q ? `<span class="q">${label ? `<code>${q}</code>` : q}</span><span class="caret"></span>` : '<span class="ph">A name, part of one, or a label: app=web</span><span class="caret" style="margin-left:-4px"></span>'}<span class="end">${end}</span></span>${q ? (square ? `<span class="btn" style="width:40px;height:40px;padding:0" title="Save this search">${icon('bookmark', 16)}</span>` : `<span class="btn">${icon('bookmark', 14)}Save this search</span>`) : ''}</div>`

const SAVED: [string, boolean][] = [
  ['app=checkout', true],
  ['tier=frontend', true],
  ['checkout', false],
  ['team=payments !canary', true],
]

const savedStrip = (current = '') =>
  `<div class="saved">Saved${SAVED.map(
    ([q, label], i) =>
      `<span class="sv${q === current ? ' on' : ''}">${label ? `<code>${q}</code>` : q}${kbd('⌥', '⇧', String(i + 1))}<span class="x">${icon('x', 12)}</span></span>`,
  ).join(
    '',
  )}<span class="hint">Labels: <code>app=web</code> <code>tier!=db</code> <code>team</code> <code>!canary</code></span></div>`

type Row = {
  name: string
  ns: string
  status?: [WLevel, string]
  note?: string
  labels?: string[]
  age: string
  sel?: boolean
}

const COLS = 'minmax(0,1.5fr) 132px 190px minmax(0,1.2fr) 64px'
const COLS_NARROW = 'minmax(0,1.4fr) 170px'

const rows = (q: string, list: Row[], narrow = false) =>
  list
    .map((r) => {
      const name = `<span><b>${hit(narrow ? middle(r.name) : r.name, q)}</b>${narrow ? `<small>${r.ns}</small>` : ''}</span>`
      const status = `<span>${r.status ? pill(...r.status) : '<span style="color:var(--text-3)">—</span>'}</span>`
      if (narrow)
        return `<div class="tr${r.sel ? ' sel' : ''}" style="grid-template-columns:${COLS_NARROW}">${name}${status}</div>`
      const note = r.labels
        ? `<span class="lbls">${r.labels.map((l) => `<span class="lbl">${l}</span>`).join('')}</span>`
        : `<span class="m">${r.note ?? ''}</span>`
      return `<div class="tr${r.sel ? ' sel' : ''}" style="grid-template-columns:${COLS}">${name}<span style="color:var(--text-2)">${r.ns}</span>${status}${note}<span class="r">${r.age}</span></div>`
    })
    .join('')

const group = (glyph: IconName, kind: string, n: string, cap = '') =>
  `<div class="grp">${icon(glyph, 14)}${kind}<span class="c">${n}</span>${cap ? `<span class="cap2">${cap}</span>` : ''}</div>`

const head = (narrow = false) =>
  narrow
    ? `<div class="th" style="grid-template-columns:${COLS_NARROW}"><span>Name</span><span>Status</span></div>`
    : `<div class="th" style="grid-template-columns:${COLS}"><span>Name</span><span>Namespace</span><span>Status</span><span></span><span class="r">Age</span></div>`

// ─── 1. The page ────────────────────────────────────────────────────────────────────────────

const NAME_RESULTS = (narrow = false) =>
  `${head(narrow)}${group('layers', 'Deployments', '1')}${rows('checkout', [{ name: 'checkout', ns: 'shop', status: ['warning', 'Degraded'], note: '1/3 ready', age: '88d' }], narrow)}
  ${group('box', 'Pods', '3', narrow ? '' : 'Searched the first 5,000 of 12,400')}${rows(
    'checkout',
    [
      {
        name: 'checkout-jzhdh6j29h-hqnnn',
        ns: 'shop',
        status: ['critical', 'CrashLoopBackOff'],
        note: '14 restarts',
        age: '47m',
      },
      {
        name: 'checkout-jzhdh6j29h-pwkd2',
        ns: 'shop',
        status: ['critical', 'CrashLoopBackOff'],
        note: '13 restarts',
        age: '46m',
      },
      { name: 'checkout-jzhdh6j29h-lnk52', ns: 'shop', status: ['healthy', 'Running'], age: '6d' },
    ],
    narrow,
  )}${narrow ? '' : `<div class="capline">${icon('triangle-alert', 14)}Pods: 12,400 is more than Lumovi reads at once, so 7,400 weren’t searched by name. <span class="lnk">Choose namespaces</span> or add a label to search them all.</div>`}
  ${group('network', 'Services', '2')}${rows(
    'checkout',
    [
      { name: 'checkout', ns: 'shop', note: 'ClusterIP 10.96.44.201', age: '88d' },
      { name: 'checkout-canary', ns: 'staging', note: 'ClusterIP 10.96.51.17', age: '12d' },
    ],
    narrow,
  )}
  ${group('file-code-2', 'ConfigMaps', '2')}${rows(
    'checkout',
    [
      { name: 'checkout-settings', ns: 'shop', note: '4 keys', age: '88d' },
      { name: 'checkout-feature-flags', ns: 'shop', note: '1 key', age: '31d' },
    ],
    narrow,
  )}
  ${group('globe', 'HTTPRoutes', '1')}${rows('checkout', [{ name: 'checkout', ns: 'shop', status: ['healthy', 'Accepted'], note: 'checkout.shop.example.com', age: '88d' }], narrow)}
  ${group('git-branch', 'Applications', '1 · argoproj.io')}${rows('checkout', [{ name: 'checkout', ns: 'argocd', status: ['warning', 'OutOfSync'], note: 'shop-config · main', age: '88d' }], narrow)}`

const SCOPE_DONE = `<div class="foot">${icon('info', 14)}<span>Searched <b>31 kinds</b> in <b>All namespaces</b>. <b>Not searched:</b> Secrets, Roles and RoleBindings, which your access doesn’t list. ConfigMaps are found by name and label, never by what they hold.</span></div>`

function nameResults(): string {
  return `${field('checkout', '<b>10 objects</b> in 6 kinds')}${savedStrip('checkout')}${NAME_RESULTS()}${SCOPE_DONE}`
}

function labelRunning(): string {
  const q = 'app=checkout !canary'
  return `${field(q, `${icon('loader-circle', 14)}Searching · 18 of 31 kinds · <b>9 so far</b><span class="stop">Stop</span>`, true)}${savedStrip()}${head()}
  ${group('layers', 'Deployments', '1')}${rows('', [{ name: 'checkout', ns: 'shop', status: ['warning', 'Degraded'], labels: ['app=checkout'], age: '88d' }])}
  ${group('box', 'Pods', '3')}${rows('', [
    {
      name: 'checkout-jzhdh6j29h-hqnnn',
      ns: 'shop',
      status: ['critical', 'CrashLoopBackOff'],
      labels: ['app=checkout'],
      age: '47m',
    },
    {
      name: 'checkout-jzhdh6j29h-pwkd2',
      ns: 'shop',
      status: ['critical', 'CrashLoopBackOff'],
      labels: ['app=checkout'],
      age: '46m',
    },
    {
      name: 'checkout-jzhdh6j29h-lnk52',
      ns: 'shop',
      status: ['healthy', 'Running'],
      labels: ['app=checkout'],
      age: '6d',
    },
  ])}
  ${group('network', 'Services', '2')}${rows('', [
    { name: 'checkout', ns: 'shop', labels: ['app=checkout'], age: '88d' },
    { name: 'checkout-db', ns: 'shop', labels: ['app=checkout'], age: '88d' },
  ])}<div class="pend">${icon('loader-circle', 13)}Still searching: ConfigMaps, Ingresses, PersistentVolumeClaims and 10 more</div>`
}

function pageFrame(): string {
  return `<section class="blk"><h2>The Search page<i>by part of a name, grouped by kind, each row as its list draws it</i></h2>
    <p class="cap"><b>Done</b>: “checkout” in every kind you may list. The saved search it matches is lit. Pods are more than Lumovi reads at once, and their group says so. The line at the foot says what was searched and what wasn’t.</p>${swin({ page: nameResults(), h: 1130 })}
    <p class="cap" style="margin-top:8px"><b>While it searches, by label</b>: groups join as their kinds answer, each row showing the labels that matched. A label is asked of the cluster, so Pods, cut short in the name search, are searched in full here.</p>${swin({ page: labelRunning(), h: 720 })}</section>`
}

const PAGE_RULES = [
  '<b>Search</b> is a page of the cluster, in the sidebar after Helm releases, from the palette (its last row, or ⌘↵), and <b>⌘⇧F</b> (Ctrl+Shift+F elsewhere) from anywhere: it opens with the field focused and its text selected. ⌘⇧F is in the shortcuts sheet and editor under Everywhere as “Search the cluster”, and can be changed there. On Windows and Linux, while a terminal has the keyboard, Ctrl+Shift+F is the terminal’s, as its Ctrl+Shift+C and V are: it’s on the editor’s list of keys a terminal keeps.',
  '<b>What’s typed</b>: words are parts of names (“checkout” finds checkout-jzhdh6j29h-hqnnn), any case; <code>key=value</code>, <code>key!=value</code>, <code>key</code> and <code>!key</code> are labels. Every term must match: <code>checkout app=web</code> is a name with “checkout” and the label app=web. <b>What’s read</b>: each kind is read once, when the page opens or its namespaces change, and kept current as Lumovi’s lists are (watched while the page is shown, read again on Refresh); typing matches names and labels against what’s read, 300 ms after the last key or at once on ↵, and reads nothing more. Only a kind cut short at 5,000 is asked again, for a search with a label, by that label, so the label reaches every object of it.',
  '<b>Where</b>: every kind the person may list, Lumovi’s and the cluster’s own (CRDs, their API group beside the kind), in the namespaces chosen in the header. Kinds outside namespaces (Nodes, ClusterRoles, PersistentVolumes) are searched only with All namespaces, and the foot line says so otherwise. Secrets and ConfigMaps are found by name and label, never by what they hold.',
  '<b>The results</b>: a group a kind, in the sidebar’s order, then the cluster’s own kinds by name; in a group, a name that is what was typed first, then by name. Each row is as its kind’s list has it: name with the match marked, namespace, status (or —), its list’s second fact (ready, restarts, an address), age. Searched by label, the fourth column shows the labels that matched instead. A row opens beside, as in a list, and the list gives way as LMV-113 has it.',
  '<b>While it searches</b>, the field’s end says “Searching · 18 of 31 kinds · 9 so far” and <b>Stop</b>, and groups join as their kinds answer, in their place. What’s under the pointer or the keyboard doesn’t move: the list keeps it where it is as groups join above. A line at the end names the kinds still being searched. A kind that hasn’t answered in 10 seconds is given up on, and the foot line says “Pods didn’t answer in time · Retry”.',
  '<b>Large kinds</b>: no kind is ever read past 5,000 at once, by name or by label (a label can match everything: app=web over 40,000 pods). A kind cut short says so in its group, in amber: “Searched the first 5,000 of 12,400”, or, where the cluster doesn’t say how many there are, “Searched the first 5,000: there are more”; and a line under it says what that leaves out, with <b>Choose namespaces</b>: “Pods: 12,400 is more than Lumovi reads at once, so 7,400 weren’t searched by name.” A label search of such a kind asks the cluster by the label, so its line goes, unless the label alone matches more than 5,000.',
  '<b>Done</b>, the field’s end says “10 objects in 6 kinds”, and the foot line says what was searched: “Searched 31 kinds in All namespaces.” Then, where it’s so, “Not searched: Secrets, Roles and RoleBindings, which your access doesn’t list.”',
]

// ─── 2. Saved searches, and the palette ─────────────────────────────────────────────────────

function palette(state: 'typing' | 'empty'): string {
  const it = (glyph: IconName, name: string, right: string, hl = false) =>
    `<div class="it${hl ? ' hl' : ''}">${icon(glyph, 16)}<span class="nm2">${name}</span>${right}</div>`
  const obj = (glyph: IconName, name: string, kind: string, p: string, hl = false) =>
    it(glyph, `${hit(name, 'checkout')}<small>${kind}</small>`, p, hl)
  const body =
    state === 'typing'
      ? `<div class="gl">Objects<small>10 in production-eu</small></div>
        ${obj('layers', 'checkout', 'Deployment · shop', pill('warning', 'Degraded'), true)}
        ${obj('box', 'checkout-jzhdh6j29h-hqnnn', 'Pod · shop', pill('critical', 'CrashLoopBackOff'))}
        ${obj('box', 'checkout-jzhdh6j29h-pwkd2', 'Pod · shop', pill('critical', 'CrashLoopBackOff'))}
        ${obj('box', 'checkout-jzhdh6j29h-lnk52', 'Pod · shop', pill('healthy', 'Running'))}
        ${obj('network', 'checkout', 'Service · shop', '')}
        ${obj('globe', 'checkout', 'HTTPRoute · shop', pill('healthy', 'Accepted'))}
        ${obj('git-branch', 'checkout', 'Application · argocd', pill('warning', 'OutOfSync'))}
        ${obj('file-code-2', 'checkout-settings', 'ConfigMap · shop', '')}
        ${it('search', 'Search the cluster for “checkout”', `<span class="r2">10 found</span><span class="keys">${kbd('⌘', '↵')}</span>`)}`
      : `<div class="gl">Saved searches</div>
        ${SAVED.map(([q, label], i) => it('search', label ? `<code>${q}</code>` : q, `<span class="keys">${kbd('⌥', '⇧', String(i + 1))}</span>`, i === 0)).join('')}
        <div class="gl">Pinned</div>${it('layers', 'storefront<small>Deployment · shop</small>', `<span class="keys">${kbd('⌥', '1')}</span>`)}
        <div class="gl">Go to</div>${it('layout-dashboard', 'Overview', `<span class="keys">${kbd('G', 'O')}</span>`)}${it('boxes', 'Workloads', `<span class="keys">${kbd('G', 'W')}</span>`)}`
  return `<div class="scrim"></div><div class="pal"><div class="in">${icon('search', 16)}${state === 'typing' ? 'checkout<span class="caret"></span>' : '<span class="ph">Type a command, a page, or an object’s name</span><span class="caret" style="margin-left:-4px"></span>'}</div><div class="bd">${body}</div><div class="ft2"><span>${kbd('↑', '↓')} to move</span><span>${kbd('↵')} to open</span>${state === 'typing' ? `<span>${kbd('⌘', '↵')} to search the cluster</span>` : ''}<span>${kbd('esc')} to close</span></div></div>`
}

function paletteFrame(): string {
  const under = pods()
  return `<section class="blk"><h2>The palette<i>finds objects as you type; the Search page is its last row</i></h2>
    <p class="cap"><b>Typing a name</b>: the cluster’s objects that have it, up to eight, best first, each with its kind, namespace and status; then Search the cluster. Today’s rows (Go to, Views, Actions) still come first wherever they match, so ↵ still does what it did.</p>${swin({ page: under, h: 720, title: 'Pods', glyph: 'box', on: false, extra: palette('typing') })}
    <p class="cap" style="margin-top:8px"><b>Before typing</b>: saved searches first, each with its key, then Pinned and the rest as today.</p>${swin({ page: under, h: 620, title: 'Pods', glyph: 'box', on: false, extra: palette('empty') })}</section>`
}

const SAVED_RULES = [
  '<b>The palette</b>, as you type, asks the cluster too: its <b>Objects</b> group shows up to eight objects that match, best first (a name that is what was typed, then one that starts with it, then one that has it), each with its kind’s icon, its name with the match marked, “Deployment · shop”, and its status. The group shows when every kind has answered or after 300 ms, whichever is first; after that, rows only join at its end, so the highlighted row never moves. The last row is <b>Search the cluster for “checkout”</b>, with how many were found, and ⌘↵ runs it from any row. ↵ on an object opens it, as a list’s row does.',
  '<b>A saved search</b> is what was typed, kept as typed: <b>Save this search</b> beside the field (it reads <b>Saved</b> with a check while the search is one), or the palette’s Save this search on the page. Saved searches are the person’s, for every cluster, kept on this computer (on a server, per person, as Settings is), and run in the cluster and namespaces open now.',
  '<b>The first nine have keys, ⌥⇧1 to ⌥⇧9</b> (Alt+Shift+1–9 on Windows and Linux), beside pins’ ⌥1–9, and they fire where pins’ keys fire: <b>never while something is being typed</b> (a field, the YAML editor, a terminal, the palette’s field once it has text), nor with a dialog or a menu open, so the character a layout puts on ⌥⇧ and a digit (German ⌥⇧7 is a backslash) is always typed. Keys go by the key’s place, not its character. In the palette with nothing typed, its saved rows take them, each only the number it has a row for, so with four saved, ⌥⇧5 still types its character. None on a phone, nor in a browser on Linux, where Alt and digits are the browser’s, as for pins. Windows switches the input language on Alt+Shift: if that fires before the digit, Windows has Ctrl+Shift+1–9 instead (the build checks it). In the shortcuts sheet as “Run a saved search”, built in.',
  '<b>The saved strip</b>, under the field: each search as a chip with its key and an × (under the pointer, or Delete when it has focus), in the order they were saved; the one running now is lit. Removing one moves the later ones up a key, and its toast says so, with Undo: “Removed app=checkout. Saved searches 2 to 4 are now ⌥⇧1 to ⌥⇧3.” Past a second line of chips, the strip ends in “and 3 more”, a menu. Before typing, the palette lists them first, then Pinned.',
]

// ─── 3. The empty page, nothing found, and at 1024 ──────────────────────────────────────────

function emptyPage(): string {
  return `${field('', '')}<div class="blank"><div><h3>Saved searches</h3><div class="svl">${SAVED.map(
    ([q, label], i) =>
      `<div class="r">${icon('search', 14)}${label ? `<code>${q}</code>` : q}<span class="keys">${kbd('⌥', '⇧', String(i + 1))}</span><span class="x">${icon('x', 14)}</span></div>`,
  ).join('')}</div></div>
    <div><h3>What you can type</h3><dl class="how"><dt>checkout</dt><dd>Any part of a name, in any case</dd><dt>app=checkout</dt><dd>A label with this value</dd><dt>tier!=db</dt><dd>Not this value, or no such label</dd><dt>team</dt><dd>Has this label, any value</dd><dt>!canary</dt><dd>Doesn’t have this label</dd><dt>checkout app=web</dt><dd>Both: every term must match</dd></dl></div></div>`
}

function nothingFound(): string {
  return `${field('checout', '<b>Nothing found</b> in 31 kinds')}${savedStrip()}<div class="none">${icon('search-x', 24)}<b>No object’s name has “checout”.</b><p>Searched 31 kinds in <b>shop</b>. Kinds outside namespaces are searched with All namespaces.</p></div>`
}

function narrow(): string {
  const panel = `<div class="dph"><span class="ktile">${icon('box', 18)}</span><div class="t"><p>Pod · shop · 47m old</p><h2>checkout-jzhdh6j29h-hqnnn${icon('copy', 14)}</h2><div class="acts">${pill('critical', 'CrashLoopBackOff')}<span class="btn">${icon('scroll-text', 14)}Logs</span><span class="btn">${icon('square-terminal', 14)}Shell</span><span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span></div></div><span class="ib" style="margin-top:2px">${icon('maximize-2', 16)}</span><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div><div class="itabs"><span class="on">Overview</span><span>Logs</span><span>Metrics</span><span>Events</span><span>YAML</span></div><dl class="how" style="grid-template-columns:120px minmax(0,1fr);padding:16px 20px"><dt class="k2">Node</dt><dd>worker-2</dd><dt class="k2">Restarts</dt><dd>14, the last 3m ago</dd><dt class="k2">Image</dt><dd><code>shop/checkout:1.42.0</code></dd><dt class="k2">Controlled by</dt><dd>ReplicaSet checkout-jzhdh6j29h</dd></dl>`
  const page = `${field('checkout', '<b>10 found</b>', false, true)}<div class="saved">Saved<span class="sv"><code>app=checkout</code>${kbd('⌥', '⇧', '1')}</span><span class="sv"><code>tier=frontend</code>${kbd('⌥', '⇧', '2')}</span><span class="sv on">checkout${kbd('⌥', '⇧', '3')}</span><span class="sv">and 1 more${icon('chevron-down', 12)}</span></div>${NAME_RESULTS(true).replace('<div class="tr" style="grid-template-columns:minmax(0,1.4fr) 170px"><span><b><span class="hit">checkout</span>-jzhdh6j29h-hqnnn', '<div class="tr sel" style="grid-template-columns:minmax(0,1.4fr) 170px"><span><b><span class="hit">checkout</span>-jzhdh6j29h-hqnnn')}`
  return swin({ page, panel: { html: panel, width: 440 }, w: 1024, h: 720, ns: 'All namespaces' })
}

function moreFrame(): string {
  return `<section class="blk"><h2>Before typing, nothing found, and at 1024<i>the page says what it takes, and what it searched</i></h2>
    <div style="display:flex;flex-direction:column;gap:24px"><div style="display:flex;flex-direction:column;gap:8px"><p class="cap"><b>Before typing</b>: the saved searches, then what can be typed.</p>${swin({ page: emptyPage(), w: 1024, h: 660 })}</div>
    <div style="display:flex;flex-direction:column;gap:8px"><p class="cap"><b>Nothing found</b>, with one namespace chosen.</p>${swin({ page: nothingFound(), w: 1024, h: 480, ns: 'shop' })}</div></div>
    <p class="cap" style="margin-top:8px"><b>At 1024, a row opened</b>: the panel beside, the results giving way to Name (its namespace under it) and Status.</p>${narrow()}</section>`
}

const MORE_RULES = [
  '<b>Before typing</b>, the page lists the saved searches, each with its key and ×, then what can be typed, as a short table. With none saved, only the table.',
  '<b>Nothing found</b> says what wasn’t found and where it looked: “No object’s name has “checout”.” or “Nothing has the labels app=checkout and !canary.”, then “Searched 31 kinds in shop.” and, with namespaces chosen, that kinds outside namespaces are searched with All namespaces. No guesses at what was meant.',
  '<b>At 1024</b>, or with a row open beside, the results give way as LMV-113’s lists do: the fourth column first, then Age, then Namespace (under the name instead), to Name and Status. A long name is cut in its middle, keeping its end, as lists cut it. Narrow, the field’s end says only “10 found”, Save this search becomes a square with its words in its tooltip, and the saved strip shows what fits on two lines, then “and 1 more”; its hint goes first.',
]

// ─── 4. On a phone ──────────────────────────────────────────────────────────────────────────

function phones(): string {
  const prow = (name: string, sub: string, p: string, label = '') =>
    `<div class="pr"><div class="w2"><b>${hit(name, label ? '' : 'checkout')}</b><small>${sub}</small>${label ? `<span class="lbl">${label}</span>` : ''}</div>${p}</div>`
  const results = `<div class="phs"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Search</b></div><div class="pf">${icon('search', 18)}checkout<span class="end">10 found</span></div><div class="psv"><span class="sv on">checkout</span><span class="sv"><code>app=checkout</code></span><span class="sv"><code>tier=frontend</code></span><span class="sv">and 1 more</span></div>
    <div class="pg">${icon('layers', 14)}Deployments<span class="c">1</span></div>${prow('checkout', 'shop · 88d', pill('warning', 'Degraded'))}
    <div class="pg">${icon('box', 14)}Pods<span class="c">3</span></div>${prow('checkout-jzhdh6j29h-hqnnn', 'shop · 47m', pill('critical', 'CrashLoopBackOff'))}${prow('checkout-jzhdh6j29h-pwkd2', 'shop · 46m', pill('critical', 'CrashLoopBackOff'))}${prow('checkout-jzhdh6j29h-lnk52', 'shop · 6d', pill('healthy', 'Running'))}
    <div class="pg">${icon('network', 14)}Services<span class="c">2</span></div>${prow('checkout', 'shop · 88d', '')}${prow('checkout-canary', 'staging · 12d', '')}</div>`
  const label = `<div class="phs"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Search</b></div><div class="pf">${icon('search', 18)}<code style="font-family:'JetBrains Mono',monospace;font-size:14px">app=checkout</code><span class="end">${icon('loader-circle', 14)}</span></div><div class="psv"><span class="sv">checkout</span><span class="sv on"><code>app=checkout</code></span><span class="sv"><code>tier=frontend</code></span><span class="sv">and 1 more</span></div>
    <div class="pg">${icon('layers', 14)}Deployments<span class="c">1</span></div>${prow('checkout', 'shop · 88d', pill('warning', 'Degraded'), 'app=checkout')}
    <div class="pg">${icon('box', 14)}Pods<span class="c">3</span></div>${prow('checkout-jzhdh6j29h-hqnnn', 'shop · 47m', pill('critical', 'CrashLoopBackOff'), 'app=checkout')}${prow('checkout-jzhdh6j29h-pwkd2', 'shop · 46m', pill('critical', 'CrashLoopBackOff'), 'app=checkout')}
    <div class="pfoot">Still searching: ConfigMaps, Services and 14 more. <span style="color:var(--accent-strong);font-weight:500">Stop</span></div></div>`
  return `<section class="blk"><h2>On a phone<i>the page alone: it reads, so the phone has all of it</i></h2><div class="rowx">${results}${label}</div><p class="cap" style="max-width:820px">Left: “checkout”, grouped by kind, each row two lines as the phone’s lists have them. Right: a label search still running; each row shows the label that matched.</p></section>`
}

const PHONE_RULES = [
  '<b>On a phone</b> Search is in the menu after Helm releases, and in the palette. The page is the same page: the field 44 px high, the saved strip as chips 32 px high that wrap (no keys there), then the groups; each row two lines as the phone’s lists have them (name; namespace and age), its status at the end, and the matching label under it when searched by label. A row opens the object’s page. The foot line and “Still searching” stand at the end.',
  '<b>Searching only reads</b>, so it’s all on a phone, saving included: a saved search is the person’s setting, not a change to the cluster.',
]

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type SearchFrame = 's-page' | 's-palette' | 's-more' | 's-phone'

export const SEARCH_FRAMES: { id: SearchFrame; title: string; size: Size }[] = [
  { id: 's-page', title: 'Search: the page', size: { width: 1440, height: 2240 } },
  {
    id: 's-palette',
    title: 'Search: the palette and saved searches',
    size: { width: 1440, height: 1880 },
  },
  {
    id: 's-more',
    title: 'Search: before typing, nothing found, at 1024',
    size: { width: 1440, height: 1880 },
  },
  { id: 's-phone', title: 'Search on a phone', size: { width: 920, height: 1160 } },
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function searchFrame(id: SearchFrame, scheme: Scheme): string {
  const f = SEARCH_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${escape(t)}</h1><p>${p}</p></header>`
  const body = {
    's-page': () =>
      `${intro('Search the cluster (LMV-171)', 'Find any object of a kind you may list, by part of its name or by its labels, grouped by kind with its status. Words are drafts for docs.')}${pageFrame()}${rules(PAGE_RULES)}`,
    's-palette': () =>
      `${intro('Search: the palette and saved searches (LMV-171)', 'The palette finds the cluster’s objects as you type and leads to the page; a saved search is a key away. Words are drafts for docs.')}${paletteFrame()}${rules(SAVED_RULES)}`,
    's-more': () =>
      `${intro('Search: before typing, nothing found, and at 1024 (LMV-171)', 'What the page shows before a search, when nothing matches, and in a narrower window. Words are drafts for docs.')}${moreFrame()}${rules(MORE_RULES)}`,
    's-phone': () => `${phones()}${rules(PHONE_RULES)}`,
  }[id]()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
${CSS}
html, body { width: ${f.size.width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
</style><div class="sheet">${body}</div>`
}
