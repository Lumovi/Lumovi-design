/**
 * A panel's tabs when they don't fit (LMV-360): at 1024 wide the detail panel is 489 px, and a
 * pod's eight tabs need about 530, so "YAML" was cut to "YA" with nothing to say more were there.
 * Tabs that don't fit go into a More menu at the row's end, and the open tab always keeps a place
 * in the row. Drawn in Lumovi's window at 1024 × 768 from main's panel. Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape } from './kit.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, panelHead, pill, win } from './windows.ts'

const CSS = `${WINDOW}
.sheet { display: flex; flex-direction: column; gap: 40px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.pair { display: flex; gap: 40px; align-items: flex-start; }
.pair > div { display: flex; flex-direction: column; gap: 10px; }
.cap { margin: 0; max-width: 1024px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-2); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 32px; max-width: 2088px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
/* The row: the tabs that fit, then More. */
.itabs.fit { overflow: visible; }
.itabs.fit { gap: 4px; padding: 0 20px; }
.itabs.fit > span { padding-right: 10px; padding-left: 10px; }
.itabs .tmore { position: relative; display: flex; align-items: center; gap: 6px; }
.itabs .tmore svg.i { color: var(--text-3); }
.itabs .tmore.open { color: var(--text-1); }
.itabs .tmore.ring { border-radius: 4px; box-shadow: 0 0 0 2px var(--accent-soft), 0 0 0 1px var(--accent); }
.tmenu { position: absolute; top: calc(100% + 4px); right: -8px; z-index: 2; width: 168px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-pop); font-weight: 400; color: var(--text-1); }
.tmenu .tmi { display: flex; height: 30px; align-items: center; padding: 0 10px; border-radius: 6px; }
.tmenu .tmi.hl { background: var(--surface-3); color: var(--text-1); }
.tmenu .tmi small { margin-left: auto; font-size: 11.5px; color: var(--text-3); }
/* The panel's body: a pod's details, or its YAML. */
.pbody { flex: 1; min-height: 0; overflow: hidden; padding: 16px 20px; }
.pbody h4 { margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3); }
.pkv { display: grid; grid-template-columns: 136px minmax(0, 1fr); row-gap: 8px; font-size: 13px; line-height: 20px; }
.pkv dt { color: var(--text-3); }
.pkv dd { margin: 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pkv dd.lk { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent-strong); font-variant-ligatures: none; }
.ysrc { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 19px; color: var(--text-1); white-space: pre; font-variant-ligatures: none; }
.ysrc i { font-style: normal; color: var(--accent-strong); }
.ysrc u { text-decoration: none; color: var(--text-3); }
.plist { display: flex; flex-direction: column; }
.plist .pc { padding: 10px 16px; font-size: 12px; color: var(--text-3); border-bottom: 1px solid var(--line); }
.plist .pr { display: flex; flex-direction: column; gap: 4px; padding: 9px 16px; border-bottom: 1px solid var(--line); }
.plist .pr > span { align-self: flex-start; }
.plist .pr b { overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.plist .pr.sel { background: var(--accent-soft); }
/* A tab row on its own, at a panel's width. */
.tstrip { display: flex; flex-direction: column; gap: 8px; }
.tstrip .box { overflow: visible; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.tstrip .box .itabs { border-bottom: 0; }
.tstrip .lab { font-size: 12px; line-height: 17px; color: var(--text-3); }
.tstrip .lab b { font-weight: 600; color: var(--text-2); }
`

const POD_TABS = ['Overview', 'Logs', 'Shell', 'Metrics', 'Map', 'Events', 'Audit', 'YAML']
const DEPLOY_TABS = ['Overview', 'Pods', 'Logs', 'Metrics', 'Map', 'Events', 'Audit', 'YAML']
const PANEL = 489

/**
 * The row: `shown` in order (the open one among them), then More holding `more`. Which tabs fit is
 * worked out by hand for a 489 px panel, as the app works it out by measuring.
 */
const row = (o: {
  shown: string[]
  on: string
  more?: string[]
  open?: boolean
  hl?: string
  ring?: boolean
}) => {
  const tabs = o.shown.map((t) => `<span${t === o.on ? ' class="on"' : ''}>${t}</span>`).join('')
  const menu =
    o.open && o.more
      ? `<span class="tmenu">${o.more.map((t) => `<span class="tmi${t === o.hl ? ' hl' : ''}">${t}</span>`).join('')}</span>`
      : ''
  const more = o.more?.length
    ? `<span class="tmore${o.open ? ' open' : ''}${o.ring ? ' ring' : ''}">More${icon('chevron-down', 14)}${menu}</span>`
    : ''
  return `<div class="itabs fit">${tabs}${more}</div>`
}

const ACTS = `<span class="btn">${icon('square-terminal', 14)}Shell</span><span class="btn">${icon('rotate-cw', 14)}Restart</span><span class="btn">${icon('pin', 14)}Pin</span><span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span>`

const head = () =>
  panelHead({
    kind: 'Pod',
    glyph: 'box',
    ns: 'shop',
    age: '47m',
    name: 'checkout-jzhdh6j29h-hqnnn',
    pill: `<span style="display:flex;flex-basis:100%">${pill('critical', 'CrashLoopBackOff')}</span>`,
    acts: ACTS,
    tabs: [],
    on: '',
  }).replace('<div class="itabs"></div>', '')

const OVERVIEW = `<div class="pbody"><h4>Details</h4><dl class="pkv"><dt>Created</dt><dd>Oct 17, 2026, 4:41 AM (47m ago)</dd><dt>Controlled by</dt><dd class="lk">ReplicaSet/checkout-jzhdh6j29h</dd><dt>Node</dt><dd class="lk">Node/worker-2</dd><dt>Pod IP</dt><dd>10.244.2.10</dd><dt>Host IP</dt><dd>10.0.1.12</dd><dt>QoS class</dt><dd>Burstable</dd><dt>Service account</dt><dd class="lk">ServiceAccount/checkout</dd><dt>Restart policy</dt><dd>Always</dd></dl></div>`

const YAML = `<div class="pbody"><pre class="ysrc"><i>apiVersion</i>: v1
<i>kind</i>: Pod
<i>metadata</i>:
  <i>name</i>: checkout-jzhdh6j29h-hqnnn
  <i>namespace</i>: shop
  <i>labels</i>:
    <i>app.kubernetes.io/name</i>: checkout
    <i>pod-template-hash</i>: jzhdh6j29h
  <i>ownerReferences</i>:
    - <i>kind</i>: ReplicaSet
      <i>name</i>: checkout-jzhdh6j29h
<i>spec</i>:
  <i>containers</i>:
    - <i>name</i>: app
      <i>image</i>: ghcr.io/acme/checkout:v1.14.0
      <i>resources</i>:
        <i>requests</i>: { <i>cpu</i>: 250m, <i>memory</i>: 256Mi }
  <i>nodeName</i>: worker-2
  <i>serviceAccountName</i>: checkout
<i>status</i>:
  <i>phase</i>: Running
  <i>qosClass</i>: Burstable</pre></div>`

const PODS: [string, 'healthy' | 'critical', string][] = [
  ['cart-7d9f6c5b8-x2kqp', 'healthy', 'Running'],
  ['cart-7d9f6c5b8-m4wzt', 'healthy', 'Running'],
  ['checkout-jzhdh6j29h-hqnnn', 'critical', 'CrashLoopBackOff'],
  ['checkout-jzhdh6j29h-p7c2d', 'critical', 'CrashLoopBackOff'],
  ['checkout-jzhdh6j29h-v9l5s', 'healthy', 'Running'],
  ['recommendations-mcbt654b8h-bpp5n', 'critical', 'ImagePullBackOff'],
  ['storefront-6b7f9c8d4-2xq8r', 'healthy', 'Running'],
]
const LIST = `<div class="plist"><span class="pc">23 items</span>${PODS.map(([n, l, st]) => `<div class="pr${n.endsWith('hqnnn') ? ' sel' : ''}"><b>${n}</b>${pill(l, st)}</div>`).join('')}</div>`

const window1024 = (tabs: string, body: string) =>
  win({
    w: 1024,
    h: 768,
    cluster: 'production-eu',
    nav: 'Pods',
    title: 'Pods',
    glyph: 'box',
    ns: 'shop',
    page: LIST,
    panel: {
      width: PANEL,
      html: `<div style="position:relative;display:flex;flex-direction:column;height:100%">${head()}${tabs}${body}</div>`,
    },
    dock: dock([]),
    more: true,
  })

const strip = (lab: string, width: number, tabs: string) =>
  `<div class="tstrip"><span class="lab">${lab}</span><div class="box" style="width:${width}px">${tabs}</div></div>`

function podFrame(): string {
  const picking = window1024(
    row({
      shown: POD_TABS.slice(0, 5),
      on: 'Overview',
      more: ['Events', 'Audit', 'YAML'],
      open: true,
      hl: 'YAML',
    }),
    OVERVIEW,
  )
  const picked = window1024(
    row({ shown: [...POD_TABS.slice(0, 5), 'YAML'], on: 'YAML', more: ['Events', 'Audit'] }),
    YAML,
  )
  return `<section class="blk"><h2>The pod panel at 1024<i>a 489 px panel: five tabs and More fit, three tabs go into it</i></h2><div class="pair"><div>${picking}<p class="cap"><b>More, opened</b> with a click, or ↓ on it from the row. It holds what doesn’t fit, in the row’s order: Events, Audit and YAML. The pointer is on YAML.</p></div><div>${picked}<p class="cap"><b>YAML picked.</b> The open tab always has a place in the row: YAML takes the last one, before More. It’s narrower than Events, so it fits where Events didn’t; Events and Audit stay in More. Back on Overview, YAML goes back into More and the row is as it was.</p></div></div></section>`
}

function stripsFrame(): string {
  const s = [
    strip(
      '<b>A Deployment</b>, at 489: Overview to Map, and More with Events, Audit and YAML.',
      PANEL,
      row({ shown: DEPLOY_TABS.slice(0, 5), on: 'Overview', more: ['Events', 'Audit', 'YAML'] }),
    ),
    strip(
      '<b>A plugin’s tab</b> (Trivy’s Findings, LMV-351) keeps its place, after Audit and before YAML, in More as in the row.',
      PANEL,
      row({
        shown: DEPLOY_TABS.slice(0, 5),
        on: 'Pods',
        more: ['Events', 'Audit', 'Findings', 'YAML'],
        open: true,
      }),
    ),
    strip(
      '<b>From the keyboard</b>: → past the last tab lands on More; ↓, Enter or Space opens it, and the first item is lit.',
      PANEL,
      row({
        shown: POD_TABS.slice(0, 5),
        on: 'Overview',
        more: ['Events', 'Audit', 'YAML'],
        open: true,
        hl: 'Events',
        ring: true,
      }),
    ),
    strip(
      '<b>Room for all</b>: the panel expanded, or a window wide enough. When every tab fits, there is no More.',
      720,
      row({ shown: POD_TABS, on: 'Overview' }),
    ),
  ]
  return `<section class="blk"><h2>Any kind’s panel<i>the same rule wherever a row of tabs is drawn</i></h2><div class="pair" style="flex-wrap:wrap;row-gap:150px">${s.join('')}</div></section>`
}

const RULES = [
  '<b>Tabs never scroll, wrap or get cut.</b> When every tab fits, they’re all in the row and there’s no More. Otherwise the tabs that fit stay in the row in their order, and the rest go into <b>More</b>, the row’s last item, which opens a menu of them in the same order. A row that scrolls sideways hides tabs with nothing to click, and a mouse without a trackpad can’t reach them.',
  '<b>The open tab always has a place in the row.</b> When it would be in More, it takes the row’s last place before More, and whatever no longer fits goes into More; nothing changes order. Going back to a tab in the row puts the picked one back into More, and the row is as it was before.',
  '<b>Which tabs fit is measured</b>, not counted: with no room for all, the row fills from the start while the next tab and More both still fit. It’s worked out again when the panel or window is resized, or a plugin adds a tab; nothing animates.',
  '<b>More</b> is drawn as a tab is (the same padding, type and colour), with a 14 px chevron 6 px after the word. It’s never underlined. While its menu is open it’s in the text colour. If a hidden tab carries a count, the menu carries it too.',
  '<b>From the keyboard</b>, More is the last stop in the tab row (→ from the last tab, End); ↓, Enter or Space opens the menu with its first item lit; ↑ ↓ move, Enter opens the tab and puts focus on it in the row, Esc closes the menu and returns to More. Any key that opens a tab still opens it when it’s in More.',
  '<b>Everywhere a row of tabs is drawn</b>: the detail panel for every kind, an object open on its own, a tab kept in the dock, and on a phone (where More opens as a sheet, as every menu there does). A plugin’s tabs keep their place, after Audit and before YAML, in the row and in More.',
  '<b>Words</b>: one new, “More”, read out as “More tabs”. No tab is renamed or shortened to fit.',
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

export type TabsFrame = 't-overflow'

export const TABS_FRAMES: { id: TabsFrame; title: string; size: Size }[] = [
  {
    id: 't-overflow',
    title: 'A panel’s tabs when they don’t fit',
    size: { width: 2152, height: 1500 },
  },
]

/** One of the frames, in one theme. */
export function tabsFrame(id: TabsFrame, scheme: Scheme): string {
  const f = TABS_FRAMES.find((x) => x.id === id)!
  const intro = `<header><h1>${escape('A panel’s tabs when they don’t fit (LMV-360)')}</h1><p>At 1024 wide the detail panel is 489 px, and a pod’s eight tabs need about 530: YAML was cut to “YA”, with nothing to say it was there. Tabs that don’t fit go into More, and the open tab always keeps its place in the row. Words are drafts for docs.</p></header>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
${CSS}
html, body { width: ${f.size.width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
</style><div class="sheet">${intro}${podFrame()}${stripsFrame()}${rules(RULES)}</div>`
}
