/**
 * Pins and saved views (LMV-174): any object pinned per cluster, in the sidebar's Pinned section
 * and heading the palette, with its live status; and a list's views, saved per cluster and kind
 * from a Views control in the list's toolbar. Drawn before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 32px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 860px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code, td code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 24px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.panel { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.side { width: 248px; padding: 8px 10px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--app-bg); }
.side h3 { display: flex; align-items: center; margin: 12px 0 4px; padding: 0 10px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.side h3 span { margin-left: auto; letter-spacing: 0; text-transform: none; font-weight: 400; }
.sn { position: relative; display: flex; height: 32px; min-width: 0; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-1); }
.sn > svg.i { flex: none; color: var(--text-3); }
.sn .nm { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.sn .ns { flex: none; font-size: 12px; color: var(--text-3); }
.sn .dot { width: 7px; height: 7px; flex: none; border-radius: 999px; background: var(--m); }
.sn .kb { flex: none; min-width: 18px; height: 18px; padding: 0 4px; border: 1px solid var(--line); border-radius: 4px; font-size: 11px; line-height: 16px; text-align: center; color: var(--text-3); }
.sn.on { background: var(--surface-3); font-weight: 500; }
.sn.gone .nm { color: var(--text-3); text-decoration: line-through; text-decoration-color: var(--line-strong); }
.sn.drag { background: var(--surface); box-shadow: var(--shadow-panel); outline: 1px solid var(--line-strong); }
.drop { height: 2px; margin: -1px 10px; border-radius: 999px; background: var(--accent); }
.tip { position: absolute; left: 236px; z-index: 3; width: max-content; max-width: 260px; padding: 6px 10px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 18px; color: var(--surface); white-space: normal; }
.dh { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px 12px; }
.dh .ic { display: grid; width: 40px; height: 40px; flex: none; place-items: center; border: 1px solid var(--line); border-radius: 10px; color: var(--text-2); }
.dh .t { min-width: 0; flex: 1; }
.dh small { display: block; font-size: 12px; color: var(--text-3); }
.dh b { display: block; font-size: 17px; line-height: 24px; font-weight: 600; }
.dh .acts { display: flex; gap: 6px; margin-top: 10px; }
.btn2 { display: inline-flex; height: 30px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; color: var(--text-1); }
.btn2.on { border-color: color-mix(in srgb, var(--accent) 45%, transparent); background: var(--accent-soft); color: var(--text-1); }
.btn2 > svg.i { color: var(--text-2); }
.btn2.on > svg.i { color: var(--accent); }
.ib { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 6px; color: var(--text-3); }
.tbar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
.tbar .count { margin-right: 4px; color: var(--text-2); }
.tbar .grow { flex: 1; }
.fld { display: flex; height: 30px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-3); }
.fld.typed { color: var(--text-1); }
.vw { display: inline-flex; height: 30px; max-width: 240px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 13px; color: var(--text-2); }
.vw b { min-width: 0; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.vw.open { border-color: var(--accent); }
.vw .chg { flex: none; font-size: 12px; white-space: nowrap; color: var(--text-3); }
.vw > svg.i { flex: none; }
.tr { display: grid; grid-template-columns: 28px minmax(0, 1fr) 150px 70px 28px; align-items: center; height: 40px; padding: 0 16px; border-bottom: 1px solid var(--line); }
.tr .nm { font-weight: 500; }
.tr .pinb { visibility: hidden; }
.tr.hov { background: var(--surface-3); }
.tr.hov .pinb, .tr .pinb.on { visibility: visible; }
.tr .pinb.on { color: var(--accent); }
.menu { width: 300px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.menu .list { padding: 4px; }
.mi { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; font-size: 13px; }
.mi > svg.i { flex: none; color: var(--text-3); }
.mi .n { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.mi .ok { color: var(--accent); }
.mi.on { background: var(--surface-3); }
.mi .more { color: var(--text-3); }
.mi.dis { color: var(--text-3); }
.sep { height: 1px; margin: 4px; background: var(--line); }
.grp { padding: 8px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.empty { padding: 10px 12px 12px; font-size: 12.5px; line-height: 19px; color: var(--text-3); }
.inl { display: flex; height: 30px; align-items: center; margin: 2px 4px; padding: 0 8px; border: 1px solid var(--accent); border-radius: 6px; box-shadow: 0 0 0 3px var(--accent-soft); font-size: 13px; }
.pal { width: 560px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pal .pin { display: flex; height: 48px; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--text-3); }
.pal .list { padding: 8px; }
.pr { display: flex; height: 36px; min-width: 0; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.pr > svg.i { flex: none; color: var(--text-3); }
.pr .dot { width: 7px; height: 7px; flex: none; border-radius: 999px; background: var(--m); }
.pr .n { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.pr .ns { flex: none; font-size: 12px; color: var(--text-3); }
.pr .h { margin-left: auto; display: flex; gap: 3px; }
.pr .h kbd { min-width: 18px; height: 18px; padding: 0 4px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface-2); font-family: 'Inter', sans-serif; font-size: 11px; line-height: 16px; text-align: center; color: var(--text-2); }
.pr.on { background: var(--surface-3); }
.toast { display: inline-flex; align-items: flex-start; gap: 10px; max-width: 420px; padding: 10px 14px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 13px; line-height: 19px; }
.toast > svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.toast b { font-weight: 600; }
table.t { border-collapse: collapse; font-size: 12.5px; line-height: 18px; }
table.t th { padding: 6px 16px 6px 0; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-align: left; text-transform: uppercase; color: var(--text-3); }
table.t td { padding: 7px 16px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
table.t td:first-child { color: var(--text-1); font-weight: 500; white-space: nowrap; }
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .bar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .tap { display: grid; width: 44px; height: 44px; flex: none; place-items: center; color: var(--text-2); }
.ph .bar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; }
.ph .drawer { padding: 4px 8px 12px; }
.ph .drawer .sn { height: 44px; }
.ph .tools { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.ph .tools .fld { height: 44px; flex: 1; font-size: 15px; }
.ph .tools .sq { display: grid; width: 44px; height: 44px; flex: none; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); }
.ph .sheetl .mi { height: 44px; font-size: 15px; }
.ph .vline { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--text-2); }
.ph .vline b { font-weight: 500; color: var(--text-1); }
.phones { display: flex; gap: 28px; align-items: flex-start; }
`

type L = 'healthy' | 'warning' | 'critical' | 'neutral' | 'progressing'
const LV: Record<L, string> = {
  healthy: 'good',
  warning: 'warn',
  critical: 'critical',
  neutral: 'neutral',
  progressing: 'neutral',
}

const sn = (
  glyph: IconName,
  name: string,
  o: { ns?: string; level?: L; kb?: string; on?: boolean; gone?: boolean; drag?: boolean } = {},
) =>
  `<div class="sn${o.on ? ' on' : ''}${o.gone ? ' gone' : ''}${o.drag ? ' drag' : ''}">${icon(glyph, 16)}<span class="nm">${name}</span>${o.ns ? `<span class="ns">${o.ns}</span>` : ''}${o.level ? `<span class="dot" style="--m:var(--${LV[o.level]})"></span>` : ''}${o.kb ? `<span class="kb">${o.kb}</span>` : ''}</div>`

const PINS = (o: { drag?: boolean; gone?: boolean } = {}) =>
  [
    sn('box', 'cart-6c9d7f5b44-w4nq7', { ns: 'shop', level: 'critical', kb: '1' }),
    o.drag ? '<div class="drop"></div>' : '',
    sn('layers', 'storefront', {
      ns: 'shop',
      level: 'healthy',
      kb: o.drag ? '3' : '2',
      on: !o.drag,
      drag: o.drag,
    }),
    sn('database', 'orders-db', { ns: 'data', level: 'warning', kb: o.drag ? '2' : '3' }),
    sn('server', 'ip-10-0-12-44', { level: 'healthy', kb: '4' }),
    o.gone
      ? sn('file-code-2', 'payments-reconciliation-config', { ns: 'billing', kb: '5', gone: true })
      : sn('network', 'storefront', { ns: 'shop', level: 'healthy', kb: '5' }),
  ].join('')

function sidebar(): string {
  const plain = `<div class="side"><h3>Pinned</h3>${sn('boxes', 'Deployments')}${sn('file-code-2', 'Certificates')}${PINS()}<h3>Cluster</h3>${sn('server', 'Nodes')}${sn('layout-grid', 'Namespaces')}</div>`
  const drag = `<div class="side"><h3>Pinned</h3>${sn('boxes', 'Deployments')}${sn('file-code-2', 'Certificates')}${PINS({ drag: true })}</div>`
  const gone = `<div class="side" style="position:relative"><h3>Pinned</h3>${sn('boxes', 'Deployments')}${PINS({ gone: true })}<span class="tip" style="top:222px">Not in the cluster any more. ConfigMap payments-reconciliation-config in billing. Unpin it from its menu.</span></div>`
  return `<section class="spec"><h2>The sidebar’s Pinned section<i>kinds first, then objects, one section</i></h2>
    <div class="row">
      <div><p class="cap">Two kinds and five objects; storefront open</p>${plain}</div>
      <div><p class="cap">Moving one: it lifts, a line shows where it lands, the numbers follow</p>${drag}</div>
      <div><p class="cap">One gone: struck through, quiet, kept in its place</p>${gone}</div>
    </div>
    <p><b>One Pinned section</b>, as today: the pinned kinds first, as they are (for every cluster), then this cluster’s pinned objects. A kind is a place and an object is a thing, and kinds stay above, so the numbers belong to the objects alone and don’t move when a kind is pinned. <b>An object’s row</b>: its kind’s icon, its name middle-cut, its namespace quiet (none for a cluster-wide object), its live status as the dot the lists use, read as the person, and its number (1 to 9) in a small key box. Hovering the row says kind, name and namespace in full, and its status in words. Pressing opens the object’s detail in its list. <b>Reordering</b>: drag a row; a 2 px accent line shows where it lands; the numbers follow the order. From the keyboard it’s in the palette (below). <b>A gone object</b> keeps its place and its number, its name struck through and quiet, no dot; its tooltip says “Not in the cluster any more.” with its kind, name and namespace, drawn in pieces as any name is (its marks shown); pressing it opens the list it was in, filtered to its name. Unpin is on every row’s context menu, and every unpin offers Undo. With no pins and no pinned kinds the section isn’t drawn. <b>Whose they are</b>: in the desktop app, the computer’s person’s; on a server, each signed-in person’s own, kept with their other settings by their user name and never per browser, so a shared browser never shows one person’s pinned names, or views, to the next.</p>
  </section>`
}

function controls(): string {
  const det = (on: boolean) =>
    `<div class="panel" style="width:520px"><div class="dh"><span class="ic">${icon('layers', 18)}</span><span class="t"><small>Deployment · shop · 88d old</small><b>storefront</b><span class="acts"><span class="btn2">${icon('arrow-up-down', 14)}Scale</span><span class="btn2">${icon('rotate-cw', 14)}Restart</span><span class="btn2${on ? ' on' : ''}">${icon(on ? 'pin' : 'pin', 14)}${on ? 'Pinned' : 'Pin'}</span><span class="btn2">${icon('ellipsis', 14)}</span></span></span><span class="ib">${icon('x', 16)}</span></div></div>`
  const rows = `<div class="panel" style="width:640px"><div class="tr" style="height:36px;font-size:11px;color:var(--text-3);letter-spacing:.05em;text-transform:uppercase"><span></span><span>Name</span><span>Status</span><span>Age</span><span></span></div>
    <div class="tr"><span></span><span class="nm">cart</span><span>${pill('critical', 'Degraded')}</span><span>88d</span><span class="ib pinb">${icon('pin', 15)}</span></div>
    <div class="tr hov"><span></span><span class="nm">checkout</span><span>${pill('warning', 'Degraded')}</span><span>88d</span><span class="ib pinb">${icon('pin', 15)}</span></div>
    <div class="tr"><span></span><span class="nm">storefront</span><span>${pill('healthy', 'Ready')}</span><span>88d</span><span class="ib pinb on">${icon('pin', 15)}</span></div></div>`
  const full = `<div class="toast">${icon('info', 16)}<span><b>20 pins is the most for a cluster.</b> Unpin one to pin checkout. Each pin is watched live, so they’re kept to a few.</span></div>`
  return `<section class="spec"><h2>Pin and Unpin<i>on a detail, on a row, in a menu</i></h2>
    <div class="row">
      <div><p class="cap">A detail, not pinned, then pinned</p>${det(false)}<div style="height:10px"></div>${det(true)}</div>
      <div><p class="cap">A list: the pin under the pointer, and on the pinned row always</p>${rows}<div style="height:14px"></div><p class="cap">The 21st: refused, with why (docs to word)</p>${full}<div style="height:10px"></div><p class="cap">An unpin, from anywhere: Undo puts it back in its place and number</p><div class="toast">${icon('pin-off', 16)}<span>Unpinned <b>orders-db</b>.</span><span style="margin-left:12px;font-weight:500;color:var(--accent)">Undo</span></div></div>
    </div>
    <p><b>On a detail</b> a “Pin” button stands with the object’s actions, before “…”; pinned, it reads “Pinned” with the accent’s soft fill, and pressing it again unpins (its tooltip says “Unpin storefront”, and ⌥P / Alt+P does the same). <b>On a list</b> a row’s last cell has a pin, shown under the pointer or keyboard focus, and always on a pinned row, in the accent; it’s also on the row’s context menu as Pin or Unpin. <b>The 21st</b> isn’t pinned: a toast says the cap and why, and names the one that wasn’t pinned; nothing else changes. A pin is per cluster; the same name in another cluster is another pin.</p>
  </section>`
}

function palette(): string {
  const pr = (
    glyph: IconName,
    n: string,
    o: { ns?: string; level?: L; keys?: string[]; on?: boolean; gone?: boolean } = {},
  ) =>
    `<div class="pr${o.on ? ' on' : ''}">${icon(glyph, 16)}${o.level ? `<span class="dot" style="--m:var(--${LV[o.level]})"></span>` : ''}<span class="n"${o.gone ? ' style="color:var(--text-3);text-decoration:line-through"' : ''}>${n}</span>${o.ns ? `<span class="ns">${o.ns}</span>` : ''}${o.keys ? `<span class="h">${o.keys.map((k) => `<kbd>${k}</kbd>`).join('')}</span>` : ''}</div>`
  const pal = `<div class="pal"><div class="pin">Jump to a page, object, namespace or cluster…</div><div class="list"><div class="grp">Pinned</div>${pr('box', 'cart-6c9d7f5b44-w4nq7', { ns: 'shop', level: 'critical', keys: ['⌥', '1'], on: true })}${pr('layers', 'storefront', { ns: 'shop', level: 'healthy', keys: ['⌥', '2'] })}${pr('database', 'orders-db', { ns: 'data', level: 'warning', keys: ['⌥', '3'] })}<div class="grp">Views of Pods</div>${pr('bookmark', 'Failing in production', { ns: '3 namespaces' })}${pr('bookmark', 'Mine, by restarts')}<div class="grp">Go to</div>${pr('layout-dashboard', 'Overview', { keys: ['G', 'O'] })}</div></div>`
  return `<section class="spec"><h2>The palette<i>Pinned first, then this kind’s views</i></h2>
    <div class="row"><div>${pal}</div>
    <div style="width:560px"><table class="t">
      <tr><th>Keys</th><th>Does</th></tr>
      <tr><td><code>⌥1</code>–<code>⌥9</code> (<code>Alt+1</code>–<code>Alt+9</code>)</td><td>opens the pin of that number: in the desktop app, and in browsers on macOS and Windows; not in a browser on Linux, which keeps Alt with a number for its tabs</td></tr>
      <tr><td><code>⌥P</code> (<code>Alt+P</code>)</td><td>pins or unpins the open object</td></tr>
      <tr><td><code>⌥↑</code> <code>⌥↓</code> on a Pinned row</td><td>moves it a place, the numbers following</td></tr>
      <tr><td><code>⌫</code> on a Pinned row, the field empty</td><td>unpins it, with an Undo toast; with text typed, ⌫ edits the text</td></tr>
    </table><p style="margin-top:10px">⌘1–⌘6 are Lumovi’s Go-to keys and ⌘ with a number is a browser’s tabs, so pins take ⌥ everywhere. ⌘⇧P isn’t used: it opens a private window in some browsers. As with the log search’s keys, ⌥ with a key fires only where it types nothing or the US layout’s character, never while a text field would take a letter it types. In a browser on Linux the number hints aren’t shown, in the sidebar or the palette, since the keys don’t reach Lumovi there: the palette’s Pinned rows are the way there.</p></div></div>
    <p><b>Pinned heads the palette</b> while nothing is typed, its rows as the sidebar’s (icon, dot, name, namespace) with their key at the right; typing matches them like any row. <b>Views of the list</b> the person is on come next, then the groups as today; typing reaches every kind’s views under “Views”. A gone pin is there struck through, and opens the list filtered to its name. <b>Undo inside a modal</b>: a toast under the palette or the phone’s drawer can’t be reached, so there an unpin is undone in place. The row stays where it was until the palette or drawer closes, its icon the crossed pin, its name quiet (not struck through, which is a gone pin’s), and “Unpinned · Undo” at its right; in the palette ↵ on it undoes and the footer says “↵ to undo”, ⌫ does nothing more; on a phone “Undo” is a 44 px button. A screen reader hears “Unpinned Database orders-db.” as it happens, and the row itself reads “Database orders-db: unpinned. Enter undoes it.” Elsewhere it’s the toast.</p>
  </section>`
}

function views(): string {
  const tbar = (view: string, o: { changed?: boolean; open?: boolean } = {}) =>
    `<div class="tbar"><span class="count">41 pods</span><span class="vw${o.open ? ' open' : ''}">${icon('bookmark', 14)}${view ? `<b>${view}</b>${o.changed ? '<span class="chg">· changed</span>' : ''}` : '<b style="font-weight:400;color:var(--text-2)">Views</b>'}${icon('chevron-down', 14)}</span><span class="grow"></span><span class="fld typed" style="width:200px">${icon('search', 14)}crash</span><span class="ib">${icon('columns-3', 16)}</span></div>`
  const mi = (n: string, o: { on?: boolean; check?: boolean; ns?: string } = {}) =>
    `<div class="mi${o.on ? ' on' : ''}">${icon('bookmark', 14)}<span class="n">${n}</span>${o.ns ? `<span class="more" style="font-size:12px">${o.ns}</span>` : ''}${o.check ? `<span class="ok">${icon('check', 14)}</span>` : ''}<span class="more">${icon('ellipsis', 14)}</span></div>`
  const menu = `<div class="menu"><div class="list">${mi('Failing in production', { check: true, ns: '3 namespaces' })}${mi('Mine, by restarts', { on: true })}${mi('Waiting for a node')}</div><div class="sep"></div><div class="list"><div class="mi">${icon('plus', 14)}<span class="n">Save view…</span></div><div class="mi">${icon('pencil', 14)}<span class="n">Save changes to “Failing in production”</span></div></div></div>`
  const naming = `<div class="menu"><div class="list">${mi('Failing in production', { check: true })}${mi('Mine, by restarts')}</div><div class="sep"></div><div class="grp" style="text-transform:none;letter-spacing:0;font-size:12px">Save what this list shows as</div><div class="inl">Crashing pods</div><div class="empty" style="padding-top:2px">The filter, health, labels, sort, columns and the 3 namespaces picked.</div></div>`
  const none = `<div class="menu"><div class="empty">No saved views. Save what this list shows to come back to it.</div><div class="sep"></div><div class="list"><div class="mi">${icon('plus', 14)}<span class="n">Save view…</span></div></div></div>`
  const rowMenu = `<div class="menu" style="width:200px"><div class="list"><div class="mi">${icon('pencil', 14)}<span class="n">Rename</span></div><div class="mi">${icon('arrow-up', 14)}<span class="n">Move up</span></div><div class="mi">${icon('arrow-down', 14)}<span class="n">Move down</span></div><div class="sep"></div><div class="mi">${icon('trash-2', 14)}<span class="n">Delete</span></div></div></div>`
  return `<section class="spec"><h2>Saved views<i>a Views control in the list’s toolbar</i></h2>
    <div class="row">
      <div style="width:640px"><p class="cap">No view open: “Views”</p><div class="panel">${tbar('')}</div>
        <p class="cap" style="margin-top:12px">A view open: the toolbar names it</p><div class="panel">${tbar('Failing in production')}</div>
        <p class="cap" style="margin-top:12px">Something changed since: “· changed”, and Save changes in the menu</p><div class="panel">${tbar('Failing in production', { changed: true, open: true })}</div></div>
      <div><p class="cap">The menu: the kind’s views, the open one checked</p>${menu}<div style="height:12px"></div><p class="cap">A view’s “…”</p>${rowMenu}</div>
      <div><p class="cap">Save view…: named in place</p>${naming}<div style="height:12px"></div><p class="cap">None yet (docs to word)</p>${none}</div>
    </div>
    <p><b>The Views control</b> stands first after the count, a secondary button with the bookmark icon: “Views” when none is open, the open view’s name (end-cut at 240 px) when one is. <b>A view</b> is what the list shows: the text filter, health chips, label selector, sort, columns, and the namespaces picked, per cluster and kind. Opening one sets them all; it doesn’t change the cluster’s own namespace pick, which comes back when the view is left. Once anything changes, the control adds “· changed”, and the menu offers “Save changes to …” beside “Save view…”. <b>The menu</b> lists the kind’s views in the person’s order, the open one checked; each has “…” with Rename (in place), Move up, Move down and Delete (no confirmation: it’s only a saved filter; a toast offers Undo). “Save view…” names it in place, saying what it keeps. <b>A view whose kind the cluster no longer serves</b> is listed under “Views” in the palette, quiet, and opening it says the cluster doesn’t serve the kind. <b>Two caps</b>, each a person’s: 20 views of one kind, and 50 in a cluster. At either, “Save view…” is disabled with the reason as its hint, and the same reason is a toast where a view is saved from the palette; for the cluster’s: “50 views of this cluster are saved, the most there can be. Delete one to save this.” (docs’ words; the kind’s in the same form).</p>
  </section>`
}

function phone(): string {
  const drawer = `<div class="ph"><div class="bar"><span class="tap">${icon('x', 20)}</span><h1>production</h1></div><div class="drawer side" style="border:0;width:auto;background:transparent"><h3>Pinned</h3>${sn('boxes', 'Deployments')}${sn('box', 'cart-6c9d7f5b44-w4nq7', { ns: 'shop', level: 'critical' })}${sn('layers', 'storefront', { ns: 'shop', level: 'healthy' })}${sn('database', 'orders-db', { ns: 'data', level: 'warning' })}<h3>Cluster</h3>${sn('server', 'Nodes')}</div></div>`
  const list = `<div class="ph"><div class="bar"><span class="tap">${icon('menu', 20)}</span><h1>Pods</h1></div><div class="tools"><span class="fld">${icon('search', 16)}Filter</span><span class="sq">${icon('bookmark', 16)}</span><span class="sq">${icon('columns-3', 16)}</span></div><div class="vline">${icon('bookmark', 14)}<b>Failing in production</b><span style="color:var(--text-3)">· changed</span></div><div style="height:160px"></div></div>`
  const sheet = `<div class="ph"><div class="bar"><span class="tap">${icon('x', 20)}</span><h1>Views of Pods</h1></div><div class="sheetl" style="padding:4px 8px"><div class="mi">${icon('bookmark', 16)}<span class="n">Failing in production</span><span class="ok">${icon('check', 16)}</span><span class="more">${icon('ellipsis', 16)}</span></div><div class="mi">${icon('bookmark', 16)}<span class="n">Mine, by restarts</span><span class="more">${icon('ellipsis', 16)}</span></div><div class="sep"></div><div class="mi">${icon('pencil', 16)}<span class="n">Save changes to “Failing in production”</span></div><div class="mi">${icon('plus', 16)}<span class="n">Save view…</span></div></div></div>`
  return `<section class="spec"><h2>On a phone<i>the drawer’s Pinned, Views as a sheet</i></h2><div class="phones">${drawer}${list}${sheet}</div>
    <p>By LMV-197’s rules. <b>The drawer</b> has the Pinned section as the sidebar does, rows 44 px, no numbers (no keys on a phone); reordering is by holding a row and dragging; a row’s menu (long press) has Unpin. <b>The detail’s Pin</b> is in its action row, 44 px. <b>Views</b> is a 44 px square beside the filter; a view open is named on a line under the toolbar, with “· changed”. Its sheet lists the kind’s views (44 px rows, “…” for Rename, Move up, Move down, Delete), then Save changes and Save view…, which names it in a field the keyboard opens on.</p>
  </section>`
}

export type PinsFrame = 'pins' | 'pins-phone'

export const PINS_FRAMES: { id: PinsFrame; title: string; size: Size }[] = [
  { id: 'pins', title: 'Pins and saved views', size: { width: 1440, height: 2400 } },
  { id: 'pins-phone', title: 'The same, on a phone', size: { width: 1340, height: 900 } },
]

/** One of the frames, in one theme. */
export function pinsFrame(id: PinsFrame, scheme: Scheme): string {
  const f = PINS_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'pins'
      ? `<header><h1>Pins and saved views</h1><p>Any object can be pinned, per cluster: it stands in the sidebar’s Pinned section and heads the palette, with its live status, the first nine numbered. A list’s view (its filter, sort, columns and namespaces) can be saved and opened again, per cluster and kind.</p></header>${sidebar()}${controls()}${palette()}${views()}`
      : phone()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${SHELL.split('\n')
  .filter((l) => /^\.spill/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet">${body}</div>`
}
