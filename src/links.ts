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
.ib.lk-b { color: var(--text-1); background: var(--surface-3); }
.cards { display: grid; grid-template-columns: repeat(3, 460px); gap: 28px 28px; align-items: start; }
.cards .stack { gap: 8px; }
.ring2 { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn.primary .kbd,
.menu .mi.hl .kbd { border-color: rgb(255 255 255 / 0.45); background: transparent; color: #fff; }
.mark { display: inline-block; margin: 0 2px; padding: 0 4px; border: 1px solid var(--line-strong); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 15px; color: var(--text-2); vertical-align: 1px; }
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
  const more = `<div class="menu" style="position:absolute;z-index:4;left:922px;top:160px;width:272px"><div class="mi hl">${icon('link', 16)}Copy link</div><hr><div class="mi">${icon('tag', 16)}Edit labels…</div><div class="mi">${icon('pencil', 16)}Edit YAML</div><hr><div class="mi" style="color:var(--critical-text)">${icon('trash-2', 16)}Delete…<span class="k"><span class="kbd">⌘</span><span class="kbd">⌫</span></span></div></div>`
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
    extra: toast,
  })
  // The page's own: a button in the top bar, before Refresh. Its tooltip names the key.
  const bar = `<div class="mn" style="width:1180px;margin:0;flex:none;position:relative;overflow:visible"><header class="hd"><span class="ib">${icon('arrow-left', 16)}</span><span class="ib dim" style="margin-left:-6px">${icon('arrow-right', 16)}</span><h1>${icon('box', 16)}Pods</h1><span class="ns">${icon('layout-grid', 14)}shop${icon('chevron-down', 14)}</span><span class="find">${icon('search', 14)}<span>Search…</span><span class="kbd">⌘</span><span class="kbd">K</span></span><span class="ib">${icon('plus', 16)}</span><span class="ib">${icon('history', 16)}</span><span class="ib lk-b">${icon('link', 16)}</span><span class="ib">${icon('rotate-cw', 16)}</span></header><div style="height:120px;overflow:hidden">${pods()}</div><span class="tip" style="right:20px;top:58px">Copy link to this view</span>${pointer(1180 - 12 - 32 - 32 + 14, 30)}</div>`
  return `<section class="blk"><h2>Copy link<i>in an object’s More actions, and the page’s own in the top bar; no key</i></h2>
    <p class="cap">checkout open in the panel, on its Logs: More actions (⋯) opened, Copy link first</p>${menuWin}
    <p class="cap">Pressed: the toast, as Lumovi’s toasts are, at the window’s bottom right; its second sentence says what a link doesn’t carry</p>${copied}
    <p class="cap">The page’s own: a link button before Refresh, on every cluster page, under the pointer; Pods filtered to shop, so the link is to that view</p>${bar}
    <ul class="rules">
      <li><b>In an object’s More actions</b>, first, in a group of its own above what changes the object: <b>Copy link</b>, Lucide’s link, with no key: ⇧⌘C is All clusters, and Ctrl+Alt on Windows is AltGr on many keyboards. It copies this page with this object open, on the tab it’s showing, cut to what a link may carry. In the command palette too, while an object is open, and in a kept object’s ⋯ below, where it’s the object on its tab.</li>
      <li><b>The page’s own</b> has no ⋯ in Lumovi’s top bar, so it’s a button there: <b>Copy link to this view</b>, before Refresh, on every cluster page (lists, Overview, Metrics, Alerts, a plugin’s pages). What it copies is the page as it stands, its filters, sort and namespace, and the panel’s object if one is open: so with a panel open, the button and the panel’s item copy the same link. In the command palette as “Copy link to this view” on every page.</li>
      <li><b>The toast</b> is docs’: “Link copied. It names the cluster, not how to reach it.” It goes after Lumovi’s usual time. <b>On a server</b> the same item and button copy the page’s own https address, which already works there, and the toast is “Link copied.” alone. Where the organization’s policy turns links off (<code>"links": "off"</code>), neither is drawn, nor the palette’s. Not on a phone’s bar: there it’s the panel’s ⋯ alone.</li>
    </ul></section>`
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
      <li><b>Where</b>: a card at the top of the front window, 460 px, over the page and centred on the window, with the shadow of Lumovi’s menus. The page behind isn’t dimmed and still works: a link is a question, not a stop. A window that already shows the cluster comes forward and asks there, “<b>Go to</b> … ?”, with Go and Cancel. <b>One at a time</b>: a newer link replaces the card in place (it doesn’t stack); after one’s answered or replaced, links that come within 2 s are dropped, not queued; so a person who cancels by mistake and opens the link again at once isn’t met with nothing, the first one dropped in that time brings a toast, once: “That link came too soon after the last. Open it again.” A window comes forward once per card. <b>The desktop app’s alone</b>: on a server a link is the page’s https address, which opens as a page does, with no card. An unanswered card stays until it’s answered, another link replaces it, or its window closes, and doing nothing does nothing.</li>
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
      <li><b>Not here</b>: docs’ sentence, with <b>Add a cluster</b>, filled (its key on the button, ⌘N, not in the sentence), and <b>Close</b>, focused. Over a cluster’s page ⌘N is Create…, so ⌘N is Add a cluster only while the card has the keyboard, as Esc is its Close; while it waits without it, ⌘N is the page’s, as ever. Add a cluster opens Lumovi’s own Add a cluster; the link isn’t kept for after, since nothing says the cluster added is the link’s.</li>
      <li><b>Can’t be opened</b>: docs’ sentence, the reason in plain words: “it names a port, and a link never does”, “it’s longer than 4 KB”, “it names a user or a password”, “it isn’t a link to a cluster”, “it isn’t written as a link is”, “its page isn’t one a link can open”, “its cluster isn’t named as Lumovi names one”, “an object’s name in it isn’t one Kubernetes allows” (docs’). One button, Close. Nothing reaches a cluster.</li>
    </ul></section>`
}

// ─── The frames ────────────────────────────────────────────────────────────────────────────

export type LinksFrame = 'lk-copy' | 'lk-ask' | 'lk-unknown'

export const LINKS_FRAMES: { id: LinksFrame; title: string; size: Size }[] = [
  { id: 'lk-copy', title: 'Copy link', size: { width: 1504, height: 2300 } },
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
