/**
 * The namespace picker with several namespaces picked (LMV-163): the header's button, its menu,
 * the keys, typed namespaces where they can't be listed, the phone's sheet, and the words that
 * change elsewhere when more than one is picked. Drawn before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 32px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 760px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.hdr { display: flex; height: 48px; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.nsb { display: flex; height: 32px; max-width: 224px; align-items: center; gap: 8px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.nsb.open { background: var(--surface-3); color: var(--text-1); }
.nsb > svg.i { flex: none; color: var(--text-3); }
.nsb b { min-width: 0; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.tipw { position: relative; }
.tip { position: absolute; top: 44px; left: 0; z-index: 2; width: max-content; max-width: 280px; padding: 6px 10px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 18px; color: var(--surface); }
.tip div { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.menu { width: 288px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.menu .find { display: flex; height: 40px; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); color: var(--text-3); }
.menu .find.typed { color: var(--text-1); }
.menu .list { padding: 4px; }
.mi { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; color: var(--text-1); }
.mi.on { background: var(--surface-3); }
.mi .n { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mi .n.add { color: var(--text-1); }
.mi .term { font-size: 11px; font-weight: 500; color: var(--warn-text); }
.mi .ok { color: var(--accent); }
.mi .typed { font-size: 11px; color: var(--text-3); }
.box { display: grid; width: 16px; height: 16px; flex: none; place-items: center; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); }
.box.x { border-color: var(--accent); background: var(--accent); color: #fff; }
.sep { height: 1px; margin: 4px; background: var(--line); }
.err { padding: 8px 12px; border-top: 1px solid var(--line); font-size: 12px; line-height: 18px; color: var(--text-3); }
.foot { display: flex; flex-wrap: wrap; gap: 4px 12px; padding: 8px 12px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--text-3); }
.foot kbd { display: inline-grid; min-width: 18px; height: 18px; margin-right: 4px; padding: 0 4px; place-items: center; border: 1px solid var(--line); border-radius: 4px; background: var(--surface-2); font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text-2); }
table.t { border-collapse: collapse; font-size: 12.5px; line-height: 18px; }
table.t th { padding: 6px 16px 6px 0; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-align: left; text-transform: uppercase; color: var(--text-3); }
table.t td { padding: 7px 16px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
table.t td:first-child { color: var(--text-1); font-weight: 500; }
table.t code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .bar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.ph .bar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; }
.ph .bar .done { padding: 0 12px; height: 44px; display: grid; place-items: center; font-size: 15px; font-weight: 600; color: var(--accent); }
.ctx { display: flex; gap: 8px; padding: 6px 16px; border-bottom: 1px solid var(--line); }
.chip { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; }
.chip > svg.i { flex: none; color: var(--text-3); }
.ph .find { display: flex; height: 44px; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--line); color: var(--text-3); font-size: 15px; }
.ph .list { padding: 4px 8px 12px; }
.ph .mi { height: 44px; padding: 0 0 0 0; font-size: 15px; }
.ph .mi .hit { display: grid; width: 44px; height: 44px; flex: none; place-items: center; }
.ph .mi .ok { margin-right: 12px; }
.ph .stub { padding: 16px; color: var(--text-3); font-size: 13px; }
.phones { display: flex; gap: 28px; align-items: flex-start; }
`

const box = (on: boolean) =>
  `<span class="box${on ? ' x' : ''}">${on ? icon('check', 12, 3) : ''}</span>`

const button = (text: string, o: { open?: boolean } = {}) =>
  `<span class="nsb${o.open ? ' open' : ''}">${icon('layout-grid', 14)}<b>${escape(text)}</b>${icon('chevron-down', 14)}</span>`

const header = (inner: string) => `<div class="hdr">${inner}</div>`

/** A row of the menu: the box, the name, a tag. `all` is the row that clears. */
const row = (
  name: string,
  o: { picked?: boolean; on?: boolean; term?: boolean; all?: boolean; typed?: boolean } = {},
) =>
  o.all
    ? `<div class="mi${o.on ? ' on' : ''}"><span class="n">All namespaces</span>${o.picked ? `<span class="ok">${icon('check', 16)}</span>` : ''}</div>`
    : `<div class="mi${o.on ? ' on' : ''}">${box(!!o.picked)}<span class="n">${escape(name)}</span>${o.typed ? '<span class="typed">typed</span>' : ''}${o.term ? '<span class="term">Terminating</span>' : ''}</div>`

const FOOT = `<div class="foot"><span><kbd>↵</kbd>only this one</span><span><kbd>⌘↵</kbd>add or take away</span></div>`

const menu = (find: string, rows: string, o: { err?: boolean; foot?: boolean } = {}) =>
  `<div class="menu"><div class="find${find ? ' typed' : ''}">${find ? escape(find) : 'Find a namespace…'}</div><div class="list">${rows}</div>${o.err ? '<div class="err">Namespaces couldn’t be listed. Type a name to use it.</div>' : ''}${o.foot === false ? '' : FOOT}</div>`

const LONG = [
  'payments-reconciliation-prod',
  'payments-settlement-prod',
  'storefront-checkout-eu-west',
  'storefront-checkout-us-east',
  'observability-collectors',
  'data',
  'shop',
]

function buttons(): string {
  const cell = (cap: string, inner: string) => `<div><p class="cap">${cap}</p>${inner}</div>`
  return `<section class="spec"><h2>The button<i>what it says for none, one and several</i></h2>
    <div class="row">
      ${cell('None: all namespaces, as today', header(button('All namespaces')))}
      ${cell('One, as today', header(button('shop')))}
      ${cell('Two that fit whole', header(button('data, shop')))}
      ${cell('Two that don’t, or three or more', header(button('3 namespaces')))}
      ${cell(
        'Seven with long names, under the pointer',
        `<div class="tipw">${header(button('7 namespaces'))}<div class="tip">${[...LONG]
          .sort()
          .map((n) => `<div>${n}</div>`)
          .join('')}</div></div><div style="height:150px"></div>`,
      )}
    </div>
    <p><b>One name says itself</b>, end-cut as today (middle-cut in the phone’s chip). <b>Two say both</b>, “data, shop”, in name order, only if both fit whole in the button’s 224 px; otherwise, and for three or more, <b>the count</b>: “2 namespaces”, “7 namespaces”. A name is never cut inside a list of names, so a button never shows half of one. The tooltip, the app’s, lists every picked name in name order, one a line, each end-cut at 280 px; past ten, the tenth line is “and 4 more”.</p>
  </section>`
}

function menus(): string {
  const none = menu(
    '',
    `${row('', { all: true, picked: true, on: true })}<div class="sep"></div>${row('cart')}${row('data')}${row('default')}${row('kube-system')}${row('legacy-billing', { term: true })}${row('shop')}`,
  )
  const several = menu(
    '',
    `${row('', { all: true })}<div class="sep"></div>${row('data', { picked: true })}${row('shop', { picked: true, on: true })}${row('storefront', { picked: true })}<div class="sep"></div>${row('cart')}${row('default')}${row('kube-system')}${row('legacy-billing', { term: true })}`,
  )
  const typed = menu(
    'billing',
    `${row('', { all: true })}<div class="sep"></div>${row('payments', { picked: true, typed: true })}${row('shop', { picked: true, typed: true })}<div class="sep"></div><div class="mi on">${icon('plus', 16)}<span class="n add">Use namespace “billing”</span></div>`,
    { err: true },
  )
  const full = `<div class="menu"><div class="find">Find a namespace…</div><div class="list">${row('', { all: true })}<div class="sep"></div>${row('api', { picked: true })}${row('billing', { picked: true })}<div class="mi" style="color:var(--text-3)"><span style="width:16px;text-align:center">⋮</span><span class="n" style="color:var(--text-3)">and 17 more picked</span></div>${row('worker', { picked: true })}<div class="sep"></div><div class="mi" style="opacity:.45">${box(false)}<span class="n">cart</span></div><div class="mi" style="opacity:.45">${box(false)}<span class="n">default</span></div></div><div class="err">20 is the most at once. Take one away to add another.</div>${FOOT}</div>`
  const cell = (cap: string, inner: string) => `<div><p class="cap">${cap}</p>${inner}</div>`
  return `<section class="spec"><h2>The menu<i>stays open while picking several; nothing moves while it’s open</i></h2>
    <div class="row">
      ${cell('None picked, as it opens', none)}
      ${cell('Three picked: they come first, as it opens', several)}
      ${cell('Namespaces can’t be listed; two typed, a third being typed', typed)}
      ${cell('At the ceiling, 20 picked', full)}
    </div>
    <p><b>Each namespace has a box</b> at its left: the app’s checkbox, ticked in the accent for a picked one. <b>“All namespaces” has no box</b>: it’s the row that clears, ticked (the check at the right, as today) when nothing is picked. <b>The picked come first</b>, in name order, under All namespaces and above a line, then the rest; that order is set as the menu opens and <b>nothing moves while it’s open</b>, so a row taken away stays where it is, its box empty, until the menu opens again. “Terminating” stays at the right. A long name is end-cut, its whole name in the row’s tooltip.</p>
    <p><b>Typed namespaces</b> (where they can’t be listed, or a name not in the list) are picked rows like any other, with a quiet “typed” at the right so a mistyped name can be told from a listed one; taking one away is its box, and it’s gone from the menu when it next opens. The typed row keeps today’s words, “Use namespace “billing””, with a plus, and the same two keys as any row: Enter uses it alone and closes, as today; ⌘Enter adds it, keeps the menu open and empties the field. The line under the list is as today.</p><p><b>There is a ceiling</b>, since each picked namespace is a list and a watch of its own on every page: 20 here, the app’s and the PM’s to set. At it, the unticked boxes are dimmed and can’t be pressed, a quiet line under the list says “20 is the most at once. Take one away to add another.”, and Enter on a row (only this one) still works. (The fourth menu shortens its middle for the picture; the menu itself lists all 20.)</p>
  </section>`
}

function keys(): string {
  return `<section class="spec"><h2>Keys and the pointer<i>today’s single pick is unchanged</i></h2>
    <table class="t">
      <tr><th>Do</th><th>Keys</th><th>Pointer, finger</th><th>Then</th></tr>
      <tr><td>Only this one</td><td><code>↵</code></td><td>the row’s name</td><td>picks it alone and closes, as today</td></tr>
      <tr><td>Add or take away</td><td><code>⌘↵</code> (<code>Ctrl+↵</code> off a Mac)</td><td>the row’s box</td><td>the box turns; the menu stays open; the page behind follows at once</td></tr>
      <tr><td>Clear, all namespaces</td><td><code>↵</code> on All namespaces</td><td>All namespaces</td><td>empties the pick and closes</td></tr>
      <tr><td>A typed name</td><td><code>↵</code> or <code>⌘↵</code> on Use namespace “…”</td><td>that row, or its plus</td><td>as any row: alone and close, or added with the menu open and the field emptied</td></tr>
      <tr><td>Move, close</td><td><code>↑</code> <code>↓</code>, <code>esc</code></td><td>outside the menu</td><td>closing keeps what’s picked</td></tr>
    </table>
    <p><b>Enter keeps today’s meaning</b>, so a person who picks one namespace finds it where it was; adding is the one new key, shown in the menu’s foot beside Enter, as the palette’s foot shows its keys; Escape is left out of it, as everywhere it closes a menu. The field keeps the focus throughout, so Space types; there is no key to pick “all but this”. The box is its own target, 16 px drawn in a 32 px square on the desktop and 44 px on a phone, so the name and the box can’t be mistaken under a finger.</p>
  </section>`
}

function words(): string {
  return `<section class="spec"><h2>The words that change with several<i>for docs to word; drafts</i></h2>
    <table class="t">
      <tr><th>Where</th><th>None</th><th>One</th><th>Two</th><th>Three or more</th></tr>
      <tr><td>The button</td><td>All namespaces</td><td>shop</td><td>data, shop (or 2 namespaces)</td><td>3 namespaces</td></tr>
      <tr><td>A page’s scope (“No workloads …”, “Nothing from Flux …”)</td><td>in this cluster</td><td>in shop</td><td>in data and shop</td><td>in 3 namespaces</td></tr>
      <tr><td>The address</td><td>no parameter</td><td><code>?namespaces=shop</code></td><td><code>?namespaces=data,shop</code></td><td><code>?namespaces=data,shop,storefront</code></td></tr>
      <tr><td>The palette’s Namespace group</td><td colspan="4">All namespaces clears; a namespace’s row picks it alone, as Enter does in the menu; the picked rows carry the check at the right</td></tr>
    </table>
    <p><b>The scope names two</b>, in name order, whole, joined by “and”, since a sentence can carry a long name where a button can’t; <b>three or more are counted</b>. <b>The address</b> carries the names in name order, joined by commas, so one pick has one address; a single namespace uses the same parameter, so there’s one form to read. <b>The address is new</b> (today the namespace is only remembered, never in a link), so what’s in it is anyone’s text: <b>a name is kept only if it is a namespace’s name by Kubernetes’ rule</b> (a DNS label, 63 characters at most); anything else is dropped and never drawn, nor are names past the ceiling. A kept name the cluster doesn’t list is drawn as typed. <b>A link’s pick is for that visit only</b>: what the person picked for the cluster is remembered as it was, and replaced only when they change the pick themselves. <b>The palette replaces</b>: it’s for going somewhere quickly, and adding stays the menu’s.</p>
  </section>`
}

function phone(): string {
  const page = `<div class="ph"><div class="bar"><span class="tap">${icon('menu', 20)}</span><h1>Workloads</h1></div><div class="ctx"><span class="chip">${icon('layout-grid', 14)}<span>3 namespaces</span>${icon('chevron-down', 14)}</span></div><div class="stub">the list, in data, shop and storefront</div></div>`
  const prow = (name: string, picked: boolean, o: { typed?: boolean; term?: boolean } = {}) =>
    `<div class="mi"><span class="hit">${box(picked)}</span><span class="n">${escape(name)}</span>${o.typed ? '<span class="typed" style="margin-right:12px">typed</span>' : ''}${o.term ? '<span class="term" style="margin-right:12px">Terminating</span>' : ''}</div>`
  const sheet = `<div class="ph"><div class="bar"><span class="tap">${icon('x', 20)}</span><h1>Namespaces</h1><span class="done">Done</span></div><div class="find">Find a namespace…</div><div class="list"><div class="mi"><span class="n" style="padding-left:12px">All namespaces</span></div><div class="sep"></div>${prow('data', true)}${prow('shop', true)}${prow('storefront-checkout-eu-west-production', true)}<div class="sep"></div>${prow('cart', false)}${prow('default', false)}${prow('kube-system', false)}${prow('legacy-billing', false, { term: true })}</div></div>`
  return `<section class="spec"><h2>On a phone<i>the context row’s chip, and the sheet</i></h2><div class="phones">${page}${sheet}</div>
    <p>By LMV-197’s rules: the chip in the context row says what the button says, its one name middle-cut. Its sheet is the phone’s, titled “Namespaces”, with rows 44 px high: <b>the box is a 44 px target</b> at the row’s left and adds or takes away; <b>the name</b> picks that one alone and closes, as today. With anything picked, the sheet’s top bar has <b>Done</b> at the right; the X closes too, and both keep what’s picked. Picked first, nothing moving while it’s open, typed and Terminating at the right: as on the desktop. There are no keys to show, so there’s no foot.</p>
  </section>`
}

export type NamespacesFrame = 'picker' | 'picker-phone'

export const NAMESPACES_FRAMES: { id: NamespacesFrame; title: string; size: Size }[] = [
  { id: 'picker', title: 'Several namespaces', size: { width: 1440, height: 1800 } },
  { id: 'picker-phone', title: 'The same, on a phone', size: { width: 920, height: 900 } },
]

/** One of the frames, in one theme. */
export function namespacesFrame(id: NamespacesFrame, scheme: Scheme): string {
  const f = NAMESPACES_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'picker'
      ? `<header><h1>Several namespaces</h1><p>The namespace picker picks any number: none is all of them, as today; one is as today; several are filtered together on lists, Workloads, Events and Metrics. Picking one stays what it was.</p></header>${buttons()}${menus()}${keys()}${words()}`
      : phone()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet">${body}</div>`
}
