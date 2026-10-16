/**
 * Links that open a view in the desktop app (LMV-193). Drawn before it's built, from the app as it
 * is: its window, the detail panel's More actions, the top bar, the dock. What's new: Copy link,
 * the prompt every link asks before it goes anywhere, and what a link to a cluster this computer
 * doesn't have says. Words are docs' (15 Oct), the prompt's own frame words design's, for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'
import {
  CSS as WINDOW_CSS,
  DEPLOY_TABS,
  TERMINAL,
  T_PROD,
  T_STORE,
  deployments,
  dock,
  logs,
  panelHead,
  pill,
  pods,
  pointer,
  win,
} from './windows.ts'

const CSS = `${WINDOW_CSS}
/* The prompt: a card at the top of the window, over the page, that doesn't hold the page back. */
.lk { position: relative; display: flex; width: 460px; flex: none; flex-direction: column; gap: 10px; padding: 14px 16px 14px 18px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-pop); }
.lk.at { position: absolute; z-index: 4; top: 64px; left: 50%; transform: translateX(-50%); }
.lk .from { display: flex; align-items: center; gap: 6px; font-size: 12px; line-height: 16px; color: var(--text-3); }
.lk .from svg.i { color: var(--text-3); }
.lk .from .k { display: flex; align-items: center; gap: 3px; margin-left: auto; color: var(--text-2); }
.lk h3 { margin: 0; font-size: 14px; line-height: 20px; font-weight: 600; letter-spacing: -0.01em; text-wrap: pretty; }
.lk h3 bdi { font-weight: 600; }
.lk .what { margin: -6px 0 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.lk .what .q { color: var(--text-3); }
.lk .lt { display: flex; align-items: flex-start; gap: 8px; margin: 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); text-wrap: pretty; }
.lk .lt svg.i { margin-top: 1px; color: var(--text-3); }
.lk .lt.warn { color: var(--warn-text); }
.lk .lt.warn svg.i { color: var(--warn-text); }
.lk .bs { display: flex; justify-content: flex-end; gap: 8px; margin-top: 2px; }
.lk .bs .btn[aria-disabled] { opacity: 0.5; }
.lk .pick { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 9px; }
.lk .pick label { display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 12.5px; line-height: 18px; }
.lk .pick label + label { border-top: 1px solid var(--line); }
.lk .pick b { font-weight: 500; }
.lk .pick small { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 16px; color: var(--text-3); }
.lk .rd { width: 14px; height: 14px; flex: none; border: 1.5px solid var(--line-strong); border-radius: 50%; }
.lk .why { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.toast { position: absolute; z-index: 4; right: 20px; bottom: 56px; display: flex; width: 380px; align-items: flex-start; gap: 10px; padding: 12px 14px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-pop); font-size: 13px; line-height: 19px; }
.toast svg.i { margin-top: 1px; }
.toast .x { margin-left: auto; color: var(--text-3); }
.cards { display: grid; grid-template-columns: repeat(3, 460px); gap: 28px 28px; align-items: start; }
.cards .stack { gap: 8px; }
.ring2 { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn.primary .kbd,
.menu .mi.hl .kbd { border-color: rgb(255 255 255 / 0.45); background: transparent; color: #fff; }
.mark { display: inline-block; margin: 0 2px; padding: 0 4px; border: 1px solid var(--line-strong); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 15px; color: var(--text-2); vertical-align: 1px; }
/* Lumovi's menus, as built: the bar's More (⋯), and an object's More actions. */
.pm { position: absolute; z-index: 4; width: max-content; min-width: 192px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.pm .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; white-space: nowrap; }
.pm .mi svg.i { color: var(--text-3); }
.pm .mi .n { flex: 1; padding-right: 16px; }
.pm .mi .k { display: flex; gap: 2px; }
.pm .mi.hl { background: var(--surface-3); }
.pm .mi.danger, .pm .mi.danger svg.i { color: var(--critical-text); }
.pm .lbl { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.pm hr { height: 1px; margin: 4px; border: 0; background: var(--line); }
.ib.open { background: var(--surface-3); color: var(--text-1); }
/* A phone: a server's page there, its narrow bar, and the palette as the whole screen. */
.phs { display: flex; gap: 28px; align-items: flex-start; }
.ph { display: flex; width: 390px; height: 400px; flex: none; flex-direction: column; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .pb { display: flex; height: 52px; flex: none; align-items: center; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .tap { display: grid; width: 44px; height: 44px; flex: none; place-items: center; border-radius: 8px; color: var(--text-2); }
.ph .tap.pr { background: var(--surface-3); color: var(--text-1); }
.ph .pb h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; line-height: 20px; font-weight: 600; letter-spacing: -0.01em; }
.ph .ctx { display: flex; height: 44px; flex: none; align-items: center; gap: 8px; padding: 0 16px; border-bottom: 1px solid var(--line); }
.ph .cc { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; font-weight: 500; }
.ph .cc svg.i { color: var(--text-3); }
.ph .cc .d { width: 8px; height: 8px; border-radius: 50%; background: var(--good); }
.ph .rest { display: flex; flex: 1; margin: 16px; align-items: center; justify-content: center; border: 1px dashed var(--line-strong); border-radius: 12px; font-size: 12px; color: var(--text-3); }
.ph.pal { background: var(--surface-2); }
.ph .pf { display: flex; height: 48px; flex: none; align-items: center; padding-right: 4px; border-bottom: 1px solid var(--line); }
.ph .pf .in { flex: 1; min-width: 0; overflow: hidden; padding: 0 16px; font-size: 15px; color: var(--text-3); white-space: nowrap; }
.ph .pl { padding: 8px; }
.ph .pl .g { padding: 8px 8px 4px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ph .pl .it { display: flex; height: 44px; align-items: center; gap: 12px; padding: 0 10px; border-radius: 8px; font-size: 13.5px; }
.ph .pl .it svg.i { color: var(--text-3); }
.ph .pl .it.pr { background: var(--surface-3); }
`

// ─── The prompt ────────────────────────────────────────────────────────────────────────────

interface Ask {
  title: string
  /** What it opens, under the title. */
  what?: string
  lines?: { glyph: IconName; text: string; warn?: boolean }[]
  /** Several contexts share its cluster: the person picks one. */
  pick?: { name: string; detail: string }[]
  buttons: { label: string; primary?: boolean; focused?: boolean; off?: boolean; key?: string }[]
  /** Shown while a terminal or a field has the keyboard: it doesn't take it. */
  waiting?: boolean
  at?: boolean
  style?: string
}

const kbd = (k: string) =>
  k
    .split(' ')
    .map((p) => `<span class="kbd">${p}</span>`)
    .join('')

function ask(a: Ask): string {
  const lines = (a.lines ?? [])
    .map(
      (l) => `<p class="lt${l.warn ? ' warn' : ''}">${icon(l.glyph, 14)}<span>${l.text}</span></p>`,
    )
    .join('')
  const pick = a.pick
    ? `<div class="pick">${a.pick.map((p) => `<label><span class="rd"></span><span><b>${escape(p.name)}</b><small>${escape(p.detail)}</small></span></label>`).join('')}</div>`
    : ''
  const buttons = a.buttons
    .map(
      (b) =>
        `<span class="btn${b.primary ? ' primary' : ''}${b.focused && !a.waiting ? ' ring2' : ''}"${b.off ? ' aria-disabled="true"' : ''}>${escape(b.label)}${b.key ? `<span style="display:flex;gap:2px;margin-left:4px;opacity:0.8">${kbd(b.key)}</span>` : ''}</span>`,
    )
    .join('')
  return `<div class="lk${a.at ? ' at' : ''}"${a.style ? ` style="${a.style}"` : ''}>
    <div class="from">${icon('link', 13)}A link${a.waiting ? `<span class="k">${kbd('⌘ L')}&nbsp;to answer</span>` : ''}</div>
    <h3>${a.title}</h3>${a.what ? `<p class="what">${a.what}</p>` : ''}${lines}${pick}<div class="bs">${buttons}</div></div>`
}

/** A name from the link or the cluster, as their text: never markup, never turned round. */
const their = (s: string) => `<bdi>${escape(s)}</bdi>`

const OPEN = [
  { label: 'Cancel', focused: true },
  { label: 'New window' },
  { label: 'Open', primary: true },
]

// ─── Frame 1: Copy link ────────────────────────────────────────────────────────────────────

const CHECKOUT_ACTS = `<span class="btn">${icon('arrow-up-down', 14)}Scale</span><span class="btn">${icon('rotate-cw', 14)}Restart</span><span class="btn ring" style="width:30px;padding:0;background:var(--surface-3)">${icon('ellipsis', 14)}</span>`

function copyFrame(): string {
  const W = 1440
  const H = 900
  const panelW = 600
  const head = panelHead({
    kind: 'Deployment',
    glyph: 'layers',
    ns: 'shop',
    age: '88d',
    name: 'checkout',
    pill: pill('warning', 'Degraded'),
    acts: CHECKOUT_ACTS,
    tabs: DEPLOY_TABS,
    on: 'Logs',
  })
  // The panel's More actions, open: Copy link first, then what changes it.
  const more = `<div class="pm" style="left:922px;top:160px;min-width:224px"><div class="lbl">Actions<span class="kbd">.</span></div>${mi('link', 'Copy link', { hl: true })}<hr>${mi('tag', 'Edit labels…')}${mi('pencil', 'Edit YAML')}<hr>${mi('trash-2', 'Delete…', { keys: '⌘ ⌫', danger: true })}</div>`
  const menuWin = win({
    w: W,
    h: H,
    cluster: 'production',
    nav: 'Workloads',
    title: 'Deployments',
    glyph: 'layers',
    page: deployments({ sel: 'checkout', narrow: true }),
    panel: { width: panelW, html: `${head}${logs({ n: 18 })}` },
    dock: dock([T_PROD]),
    more: true,
    extra: more,
  })
  // Copied: the toast, at the window's bottom right, over the dock's bar.
  const toast = `<div class="toast">${icon('circle-check', 16, 2, 'color:var(--good)')}<span>Link copied. It names the cluster, not how to reach it.</span><span class="x">${icon('x', 14)}</span></div>`
  const copied = win({
    w: W,
    h: H,
    cluster: 'production',
    nav: 'Workloads',
    title: 'Deployments',
    glyph: 'layers',
    page: deployments({ sel: 'checkout', narrow: true }),
    panel: {
      width: panelW,
      html: `${head.replace(' ring" style="width:30px;padding:0;background:var(--surface-3)"', '" style="width:30px;padding:0"')}${logs({ n: 18 })}`,
    },
    dock: dock([T_PROD]),
    more: true,
    extra: toast,
  })
  // The page's own: first in the bar's More (⋯), after Refresh, above what's there already.
  const lumovis = bar({
    title: 'Pods',
    glyph: 'box',
    ns: 'shop',
    page: pods(),
    menu: `${mi('link', 'Copy link to this view', { hl: true })}<hr>${mi('keyboard', 'Keyboard shortcuts', { keys: '?' })}`,
  })
  const plugin = bar({
    title: 'Applications',
    glyph: 'git-merge',
    ns: 'All namespaces',
    page: ARGO_APPS,
    height: 124,
    menu: `${mi('link', 'Copy link to this view', { hl: true })}<hr>${mi('shield-check', 'What Argo CD may do')}<hr>${mi('keyboard', 'Keyboard shortcuts', { keys: '?' })}`,
  })
  return `<section class="blk"><h2>Copy link<i>in an object’s More actions, and the page’s own in the bar’s More (⋯); no key</i></h2>
    <p class="cap">checkout open in the panel, on its Logs: More actions (⋯) opened, Copy link first</p>${menuWin}
    <p class="cap">Pressed: the toast, as Lumovi’s toasts are, at the window’s bottom right; its second sentence says what a link doesn’t carry</p>${copied}
    <p class="cap">The page’s own: the bar’s More (⋯) opened, Copy link to this view first, under the pointer; Pods filtered to shop, so the link is to that view</p>${lumovis}
    <p class="cap">On a plugin’s page, Argo CD’s Applications: the plugin’s line between, as the ⋯ has it today</p>${plugin}
    <ul class="rules">
      <li><b>In an object’s More actions</b>, first, in a group of its own above what changes the object: <b>Copy link</b>, Lucide’s link (Link2 is the plugins’ “It links to …” line), with no key: ⇧⌘C is All clusters, and Ctrl+Alt on Windows is AltGr on many keyboards. It copies this page with this object open, on the tab it’s showing, cut to what a link may carry. In a kept object’s ⋯ below too, where it’s the object on its tab.</li>
      <li><b>The page’s own</b> is in the bar’s More (⋯), at its end after Refresh, on every cluster page (lists, Overview, Metrics, Alerts, a plugin’s pages): <b>Copy link to this view</b>, first, in a group of its own, the same icon, no key. Then, as today, a plugin’s page’s “What Argo CD may do”, and “Keyboard shortcuts” (not under a finger), each in its group. It copies the page as it stands, its filters, sort and namespace, and the panel’s object on its tab if one is open: so with a panel open, it and the panel’s item copy the same link. The bar has no link button: it keeps the buttons it had.</li>
      <li><b>The palette</b> has it in <b>Actions</b>, with the page’s own: Copy link to this view, then a plugin page’s “What Argo CD may do”. While an object is open, its Copy link heads Actions instead, its name at the right, and the page’s isn’t listed: it’s the same link, said once. <b>The toast</b> is docs’: “Link copied. It names the cluster, not how to reach it.” It goes after Lumovi’s usual time. <b>On a server</b> the same items copy the page’s own https address, which already works there, and the toast is “Link copied.” alone. Where the organization’s policy turns links off (<code>"links": "off"</code>), none is drawn, and the ⋯ keeps its other lines.</li>
    </ul></section>
    <section class="blk"><h2>On a phone<i>no ⋯ in a narrow bar: the palette’s Actions</i></h2>
    <div class="phs"><div class="stack"><p class="cap">Argo CD’s Applications on a phone: Menu, the page, Search, Refresh</p>${phoneBar()}</div><div class="stack"><p class="cap">Search: the palette, the whole screen; Copy link to this view first in Actions, pressed</p>${phonePalette()}</div></div>
    <ul class="rules">
      <li><b>A narrow bar has no ⋯</b>: a phone’s is Menu, the page’s name, Search and Refresh, and a tablet’s adds Create, port forwards and Activity. So where the bar is narrow, the page’s link is in the palette, which Search opens, as it already says what the ⋯ holds there.</li>
      <li><b>In Actions</b>, after Pinned and the list’s views as the palette orders them: <b>Copy link to this view</b>, then “What Argo CD may do” on a plugin’s page. Rows 44 px, no fill on the chosen row, the pressed row filled, as the palette’s rows are under a finger. Keyboard shortcuts isn’t there: there are no keys to learn under a finger.</li>
      <li><b>Pressed</b>, it copies the page’s https address (a phone reaches Lumovi on a server), the palette closes, and Lumovi’s toast says “Link copied.” <b>An object open</b> (its page inside the page): its Copy link heads Actions instead, with its name, as on the desktop, and its own ⋯ has it too.</li>
    </ul></section>`
}

/** An item of Lumovi's menus, as built: its icon, its name, and its key at the right. */
function mi(
  glyph: IconName,
  label: string,
  o: { hl?: boolean; keys?: string; danger?: boolean } = {},
) {
  return `<div class="mi${o.hl ? ' hl' : ''}${o.danger ? ' danger' : ''}">${icon(glyph, 16)}<span class="n">${label}</span>${o.keys ? `<span class="k">${kbd(o.keys)}</span>` : ''}</div>`
}

/** A cluster page's bar, the page cut under it, with the page's More (⋯) open at the bar's end. */
function bar(o: {
  title: string
  glyph: IconName
  ns: string
  page: string
  height?: number
  menu: string
}) {
  return `<div class="mn" style="width:1180px;margin:0;flex:none;position:relative;overflow:visible"><header class="hd"><span class="ib">${icon('arrow-left', 16)}</span><span class="ib dim" style="margin-left:-6px">${icon('arrow-right', 16)}</span><h1>${icon(o.glyph, 16)}${o.title}</h1><span class="ns">${icon('layout-grid', 14)}${o.ns}${icon('chevron-down', 14)}</span><span class="find">${icon('search', 14)}<span>Search…</span><span class="kbd">⌘</span><span class="kbd">K</span></span><span class="ib">${icon('plus', 16)}</span><span class="ib">${icon('history', 16)}</span><span class="ib">${icon('rotate-cw', 16)}</span><span class="ib open">${icon('ellipsis', 16)}</span></header><div style="height:${o.height ?? 140}px;overflow:hidden">${o.page}</div><div class="pm" style="right:13px;top:49px">${o.menu}</div>${pointer(1132, 62)}</div>`
}

/** Argo CD's Applications, as LMV-305's frame has it: its tabs, its search and filters. */
const ARGO_APPS = `<div class="ptabs"><span>Overview</span><span class="on">Applications</span><span>AppProjects<small>4</small></span><span>ApplicationSets<small>2</small></span></div>
  <div class="tbar"><span class="fld" style="width:260px">${icon('search', 14)}Name or namespace</span>${['Health', 'Sync', 'Operation', 'Project', 'More filters'].map((f) => `<span class="chip">${f}${icon('chevron-down', 12)}</span>`).join('')}<span class="grow"></span><span class="count">38 applications</span></div>`

/** A phone's narrow bar over a plugin's page: no ⋯ there. */
function phoneBar(): string {
  return `<div class="ph"><div class="pb"><span class="tap">${icon('menu', 20)}</span><h1>Applications</h1><span class="tap pr">${icon('search', 20)}</span><span class="tap">${icon('rotate-cw', 20)}</span></div><div class="ctx"><span class="cc"><span class="d"></span>production${icon('chevron-down', 14)}</span><span class="cc">${icon('layout-grid', 14)}All namespaces${icon('chevron-down', 14)}</span></div><div class="rest">Argo CD’s Applications, as cards</div></div>`
}

/** The palette on a phone, the whole screen: Actions first, with the page's own. */
function phonePalette(): string {
  const it = (glyph: IconName, label: string, pressed = false) =>
    `<div class="it${pressed ? ' pr' : ''}">${icon(glyph, 16)}<span>${label}</span></div>`
  return `<div class="ph pal"><div class="pf"><span class="in">Jump to a page, object, namespace or cluster…</span><span class="tap">${icon('x', 20)}</span></div><div class="pl"><div class="g">Actions</div>${it('link', 'Copy link to this view', true)}${it('shield-check', 'What Argo CD may do')}<div class="g">Go to</div>${it('layout-dashboard', 'Overview')}${it('boxes', 'Workloads')}${it('chart-spline', 'Metrics')}${it('bell', 'Alerts')}</div></div>`
}

// ─── Frame 2: every link asks ──────────────────────────────────────────────────────────────

function askFrame(): string {
  const W = 1440
  const H = 900
  const first = ask({
    at: true,
    title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in ${their('production')}?`,
    what: 'Pod in shop, on its Logs tab',
    lines: [{ glyph: 'key-round', text: 'Opening it signs in with aws.' }],
    buttons: OPEN,
  })
  const front = win({
    w: W,
    h: H,
    cluster: 'staging',
    version: 'v1.33.4',
    nav: 'Pods',
    title: 'Pods',
    glyph: 'box',
    ns: 'shop',
    page: pods(),
    dock: dock([{ glyph: 'square-terminal', name: 'staging' }]),
    more: true,
    extra: first,
  })
  // A terminal has the keyboard: the prompt shows and waits, with the key that goes to it.
  const typing = win({
    w: W,
    h: H,
    cluster: 'production',
    nav: 'Workloads',
    title: 'Deployments',
    glyph: 'layers',
    page: deployments({ narrow: true }),
    dock: dock([{ ...T_PROD, on: true }, T_STORE], {
      height: 300,
      term: true,
      html: TERMINAL.replace(
        '<span class="c"></span>',
        'kubectl rollout status deploy/che<span class="c"></span>',
      ),
    }),
    more: true,
    extra: ask({
      at: true,
      waiting: true,
      title: `Go to ${their('storefront')} in ${their('production')}?`,
      what: 'Deployment in shop, on its Overview',
      buttons: [
        { label: 'Cancel', focused: true },
        { label: 'Go', primary: true },
      ],
    }),
  })
  const card = (cap: string, a: Ask) =>
    `<div class="stack"><p class="cap">${cap}</p>${ask(a)}</div>`
  const cards = `<div class="cards">
    ${card('A cluster no window shows, its name the same as the link’s', {
      title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in ${their('production')}?`,
      what: 'Pod in shop, on its Logs tab',
      buttons: OPEN,
    })}
    ${card('Its name here differs; it signs in through a program; part of the link was left out', {
      title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in ${their('prod-eu')}?`,
      what: `Pod in shop · <span class="q">the link calls it ${their('production')}</span>`,
      lines: [
        { glyph: 'key-round', text: 'Opening it signs in with aws.' },
        { glyph: 'info', text: 'Some of the link was left out: the Shell tab.' },
      ],
      buttons: OPEN,
    })}
    ${card('A window already shows the cluster: that window comes forward and asks', {
      title: `Go to ${their('checkout-7d9f6c5b8-hqnnn')} in ${their('production')}?`,
      what: 'Pod in shop, on its Logs tab',
      buttons: [
        { label: 'Cancel', focused: true },
        { label: 'Go', primary: true },
      ],
    })}
    ${card('This window has unsaved work: New window comes first', {
      title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in ${their('production')}?`,
      what: 'Pod in shop, on its Logs tab',
      lines: [
        {
          glyph: 'pencil',
          text: 'This window has an edit that isn’t saved, so it opens in a new one.',
        },
      ],
      buttons: [
        { label: 'Cancel', focused: true },
        { label: 'Open here' },
        { label: 'New window', primary: true },
      ],
    })}
    ${card('Several contexts reach the cluster at its address, none by the link’s name', {
      title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in which context?`,
      what: 'Pod in shop, on its Logs tab',
      pick: [
        { name: 'prod-admin', detail: 'admin@corp · shop' },
        { name: 'prod-viewer', detail: 'viewer@corp · default' },
      ],
      buttons: [
        { label: 'Cancel', focused: true },
        { label: 'New window', off: true },
        { label: 'Open', primary: true, off: true },
      ],
    })}
    ${card('A long name cut in its middle; a right-to-left mark shown, not obeyed', {
      title: `Open ${their('payments-reconciliation-ledger-…-7f9c4d8b6-x2kqp')} in ${their('production')}?`,
      what: `Pod in billing · <span class="q">the link calls it <bdi>prod</bdi><span class="mark">U+202E</span><bdi>-eu</bdi></span>`,
      buttons: OPEN,
    })}
  </div>`
  return `<section class="blk"><h2>Every link asks first<i>at the top of the front window; Cancel focused; nothing connects, reads or signs in before a press</i></h2>
    <p class="cap">A link to production, which no window shows, arrives while the front window is on staging: it asks there, Cancel focused</p>${front}
    <p class="cap">One arrives while a terminal has the keyboard: the prompt shows without taking it; keys go on to the terminal; ⌘L goes to the prompt</p>${typing}
    ${cards}
    <ul class="rules">
      <li><b>Where</b>: a card at the top of the front window, 460 px, over the page and centred on the window, with the shadow of Lumovi’s menus. The page behind isn’t dimmed and still works: a link is a question, not a stop. A window that already shows the cluster comes forward and asks there, “<b>Go to</b> … ?”, with Go and Cancel. <b>One at a time</b>: a newer link replaces the card in place (it doesn’t stack); after one’s answered or replaced, links that come within 2 s are dropped, not queued; so a person who cancels by mistake and opens the link again at once isn’t met with nothing, the first one dropped after an answered card brings a toast, once per card (a page firing links in a loop gets one, not a stream): “Lumovi skipped a link that came right after the last one. Open it again if you meant to.” A window comes forward once per card. <b>The desktop app’s alone</b>: on a server a link is the page’s https address, which opens as a page does, with no card. An unanswered card stays until it’s answered, another link replaces it, or its window closes, and doing nothing does nothing.</li>
      <li><b>The keyboard</b>: <b>Cancel is focused</b>, with its ring, and Enter does nothing for the first 500 ms. While a terminal or a text field has the keyboard (being typed in), the card shows without taking it, and its first line says <b>⌘L to answer</b>; on Windows and Linux, where Ctrl+L is the shell’s (it clears the screen), <b>Ctrl+⇧L to answer</b>, as the dock’s keys add ⇧ there. The card draws the key for the platform it’s on. That key, only while a card waits, goes to the card’s Cancel, from anywhere: terminals leave it to Lumovi as they leave the dock’s keys, and the YAML editor’s own ⌘L (select line) gives way while a card waits. Esc on the card is Cancel. A screen reader hears the card as an alert dialog that isn’t modal, its title first.</li>
      <li><b>What it says</b>: “A link”, quiet, with the link’s icon; the title names the object and <b>the context here</b> that matched, as their text: bidi and zero-width characters shown, long names cut in the middle, never markup. Under it, what opens: kind, namespace, tab (or the page: “Alerts, filtered to warning”). <b>“the link calls it …”</b>, quiet, only when the link’s name differs. Then, each on its line with its icon: “Opening it signs in with aws.” (exec or auth provider, named as on the start screen); “Some of the link was left out: the Shell tab.” (named as the page calls them). <b>Unsaved work</b> (an edit, a form) puts New window first and filled, and says why. <b>Several contexts</b> at the cluster’s address and none by the link’s name: the person picks, user and namespace under each; Open and New window wait for a pick. Titles are 2 lines at most.</li>
    </ul></section>`
}

// ─── Frame 3: when this computer doesn't have the cluster, or the link can't be read ──────

function unknownFrame(): string {
  const card = (cap: string, a: Ask) =>
    `<div class="stack"><p class="cap">${cap}</p>${ask(a)}</div>`
  return `<section class="blk"><h2>When the cluster isn’t here, or the link can’t be read<i>said in the same card, in the front window</i></h2>
    <div class="cards">
    ${card('A cluster here has the link’s name, at another address', {
      title: `Open ${their('checkout-7d9f6c5b8-hqnnn')} in your cluster called ${their('production')}?`,
      what: 'Pod in shop, on its Logs tab',
      lines: [
        {
          glyph: 'triangle-alert',
          warn: true,
          text: `You have a cluster called ${their('production')}, but at another address than the link’s.`,
        },
      ],
      buttons: [{ label: 'Cancel', focused: true }, { label: `Open production anyway` }],
    })}
    ${card('No cluster here has its address or its name', {
      title: 'Lumovi doesn’t know this link’s cluster',
      lines: [
        {
          glyph: 'info',
          text: `This link is to a cluster called ${their('production')} that isn’t in your kubeconfig. Ask whoever sent it which one it is, then add it.`,
        },
      ],
      buttons: [
        { label: 'Close', focused: true },
        { label: 'Add a cluster', primary: true, key: '⌘ N' },
      ],
    })}
    ${card('A link that doesn’t parse: refused whole, nothing guessed', {
      title: 'This link can’t be opened: it names a port, and a link never does.',
      buttons: [{ label: 'Close', focused: true }],
    })}
    </div>
    <ul class="rules">
      <li><b>Same name, another address</b>: the warning line is docs’, in the warning’s text colour, and <b>Open production anyway</b> is not filled: a team can reach one cluster by two addresses, but it’s for the person to say. Cancel is focused. Two people whose kubeconfigs name the same server with another certificate authority land here too.</li>
      <li><b>Not here</b>: docs’ sentence, with <b>Add a cluster</b>, filled (its key on the button, ⌘N, not in the sentence), and <b>Close</b>, focused. Over a cluster’s page ⌘N is Create…, so ⌘N is Add a cluster only while the card has the keyboard, as Esc is its Close; while it waits without it, ⌘N is the page’s, as ever, and the button doesn’t show it. Add a cluster opens Lumovi’s own Add a cluster; the link isn’t kept for after, since nothing says the cluster added is the link’s.</li>
      <li><b>Can’t be opened</b>: docs’ sentence, the reason in plain words: “it names a port, and a link never does”, “it’s longer than 4 KB”, “it names a user or a password”, “it isn’t a link to a cluster”, “it isn’t written as a link is”, “its page isn’t one a link can open”, “its cluster isn’t named as Lumovi names one”, “an object’s name in it isn’t one Kubernetes allows” (docs’). One button, Close. Nothing reaches a cluster.</li>
    </ul></section>`
}

// ─── The frames ────────────────────────────────────────────────────────────────────────────

export type LinksFrame = 'lk-copy' | 'lk-ask' | 'lk-unknown'

export const LINKS_FRAMES: { id: LinksFrame; title: string; size: Size }[] = [
  { id: 'lk-copy', title: 'Copy link', size: { width: 1504, height: 3330 } },
  { id: 'lk-ask', title: 'Every link asks first', size: { width: 1504, height: 2600 } },
  {
    id: 'lk-unknown',
    title: 'Cluster not here, link unreadable',
    size: { width: 1504, height: 700 },
  },
]

const INTRO =
  '<header><h1>Links that open a view in the desktop app (LMV-193)</h1><p>A link is the address of what a window shows: its cluster, page, filters, the object open and its tab, plus a mark that finds the same cluster under another name. It carries no credential and opens no shell. Copied from an object or a page; opened from anywhere, it always asks first, in the front window, and nothing connects or signs in before a press. Words are docs’ (15 Oct).</p></header>'

/** One of the frames, in one theme. */
export function linksFrame(id: LinksFrame, scheme: Scheme): string {
  const f = LINKS_FRAMES.find((x) => x.id === id)!
  const body = {
    'lk-copy': () => `${INTRO}${copyFrame()}`,
    'lk-ask': askFrame,
    'lk-unknown': unknownFrame,
  }[id]()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${CSS}
</style><div class="sheet">${body}</div>`
}
