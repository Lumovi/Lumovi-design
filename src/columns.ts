/**
 * A list's columns chosen, ordered and sized, a column added from a label or an annotation, and
 * the list copied or downloaded (LMV-162). Every list is ResourceTable, so this is one menu for
 * all of them. Drawn before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
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
.spec > p { margin: 0; max-width: 780px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code, td code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.panel { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.bar { display: flex; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--line); }
.bar .count { margin-right: 4px; font-size: 13px; color: var(--text-2); white-space: nowrap; }
.bar .grow { flex: 1; }
.fld { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-3); }
.fld > svg.i { flex: none; }
.fld kbd { margin-left: auto; padding: 0 5px; border: 1px solid var(--line); border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 11px; }
.sq { position: relative; display: grid; width: 32px; height: 32px; flex: none; place-items: center; border-radius: 8px; color: var(--text-2); }
.sq.open { background: var(--surface-3); color: var(--text-1); }
.sq .badge { position: absolute; top: -3px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px; background: var(--surface-3); box-shadow: 0 0 0 2px var(--surface); font-size: 10.5px; line-height: 16px; font-weight: 600; text-align: center; color: var(--text-1); }
.tip { position: absolute; z-index: 3; padding: 4px 8px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 18px; white-space: nowrap; color: var(--surface); }
.menu { width: 360px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.menu .top { display: flex; height: 40px; align-items: center; padding: 0 8px 0 12px; border-bottom: 1px solid var(--line); font-weight: 600; }
.menu .top .reset { margin-left: auto; padding: 0 8px; height: 28px; display: grid; place-items: center; border-radius: 6px; font-weight: 500; color: var(--text-2); }
.menu .top .reset.off { color: var(--text-3); opacity: 0.6; }
.menu .list { padding: 4px; }
.ci { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 6px 0 2px; border-radius: 6px; }
.ci.on { background: var(--surface-3); }
.ci.lift { background: var(--surface); box-shadow: var(--shadow-panel); outline: 1px solid var(--line-strong); }
.ci .grip { display: grid; width: 20px; flex: none; place-items: center; color: var(--text-3); }
.ci .grip.none { visibility: hidden; }
.ci .n { min-width: 0; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ci .n.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ci .n.off { color: var(--text-3); }
.ci .tag { flex: none; padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-size: 11px; line-height: 18px; color: var(--text-2); }
.ci .fit { flex: none; font-size: 11.5px; color: var(--text-3); }
.ci .rm { display: grid; width: 24px; height: 24px; flex: none; place-items: center; border-radius: 6px; color: var(--text-3); }
.drop { height: 2px; margin: -1px 8px; border-radius: 999px; background: var(--accent); }
.box { display: grid; width: 16px; height: 16px; flex: none; place-items: center; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); }
.box.x { border-color: var(--accent); background: var(--accent); color: #fff; }
.box.x.lock { opacity: 0.45; }
.sep { height: 1px; margin: 4px; background: var(--line); }
.addf { display: flex; height: 36px; align-items: center; gap: 8px; margin: 4px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; color: var(--text-3); }
.addf.typed { color: var(--text-1); border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.grp { padding: 8px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sg { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; }
.sg.on { background: var(--surface-3); }
.sg .n { min-width: 0; flex: 1; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; }
.sg .n b { font-weight: 600; }
.sg small { flex: none; font-size: 11.5px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.foot { display: flex; white-space: nowrap; align-items: center; gap: 4px 12px; padding: 8px 12px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--text-3); }
.foot kbd { display: inline-grid; min-width: 18px; height: 18px; margin-right: 4px; padding: 0 4px; place-items: center; border: 1px solid var(--line); border-radius: 4px; background: var(--surface-2); font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text-2); }
.foot .dl { margin-left: auto; display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 12.5px; font-weight: 500; color: var(--text-1); }
.tbl { font-size: 13px; }
.th, .tr { display: grid; align-items: center; column-gap: 16px; padding: 0 20px; }
.th { height: 36px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.th > span { position: relative; display: flex; height: 100%; min-width: 0; align-items: center; }
.th > span > em { min-width: 0; overflow: hidden; font-style: normal; white-space: nowrap; text-overflow: ellipsis; }
.th .edge { position: absolute; top: 8px; right: -9px; bottom: 8px; width: 2px; border-radius: 999px; background: var(--line-strong); }
.th .edge.drag { background: var(--accent); top: 0; bottom: 0; }
.th .edge.focus { background: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.tr { height: 36px; border-bottom: 1px solid var(--line); }
.tr > span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text-2); }
.tr > span.nm { color: var(--text-1); font-weight: 500; }
.tr > span.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.tr.picked { background: color-mix(in srgb, var(--accent) 8%, transparent); }
.tr .cb { display: inline-block; vertical-align: middle; margin-right: 10px; }
.dash { color: var(--text-3); }
.selbar { display: inline-flex; align-items: center; gap: 4px; padding: 6px 6px 6px 14px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 13px; font-weight: 500; }
.selbar .b { display: flex; height: 30px; align-items: center; gap: 6px; padding: 0 10px; border-radius: 8px; color: var(--text-1); }
.selbar .b.hi { background: var(--surface-3); }
.selbar .x { display: grid; width: 30px; height: 30px; place-items: center; color: var(--text-3); }
.toast { display: inline-flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 13px; }
.toast > svg.i { color: var(--healthy-text, var(--text-2)); }
.toast .lnk { margin-left: 8px; font-weight: 500; color: var(--accent); }
pre.out { margin: 0; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 18px; color: var(--text-2); white-space: pre; overflow: hidden; }
table.t { border-collapse: collapse; font-size: 12.5px; line-height: 18px; }
table.t th { padding: 6px 16px 6px 0; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-align: left; text-transform: uppercase; color: var(--text-3); }
table.t td { padding: 7px 16px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
table.t td:first-child { color: var(--text-1); font-weight: 500; white-space: nowrap; }
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .pbar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .tap { display: grid; width: 44px; height: 44px; flex: none; place-items: center; color: var(--text-2); }
.ph .pbar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; }
.ph .pbar .done { display: grid; height: 44px; padding: 0 12px; place-items: center; font-size: 15px; font-weight: 600; color: var(--accent); }
.ph .tools { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.ph .tools .fld { height: 44px; flex: 1; font-size: 15px; }
.ph .tools .sq44 { display: grid; width: 44px; height: 44px; flex: none; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); }
.ph .card { padding: 10px 16px; border-bottom: 1px solid var(--line); }
.ph .card b { display: block; font-weight: 500; }
.ph .card .facts { display: flex; flex-wrap: wrap; gap: 2px 14px; margin-top: 2px; font-size: 12.5px; color: var(--text-2); }
.ph .card .facts span.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ph .ci { height: 44px; font-size: 15px; }
.ph .ci .grip { width: 44px; height: 44px; }
.ph .ci .hit { display: grid; width: 44px; height: 44px; flex: none; place-items: center; }
.ph .ci .rm { width: 44px; height: 44px; }
.ph .list { padding: 4px 8px; }
.ph .addf { height: 44px; margin: 8px 16px; font-size: 15px; }
.ph .pfoot { display: flex; padding: 8px 16px 16px; border-top: 1px solid var(--line); }
.ph .pfoot .dl { display: flex; height: 44px; flex: 1; align-items: center; justify-content: center; gap: 8px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 15px; font-weight: 500; }
.phones { display: flex; gap: 28px; align-items: flex-start; }
`

const box = (on: boolean, lock = false) =>
  `<span class="box${on ? ' x' : ''}${lock ? ' lock' : ''}">${on ? icon('check', 12, 3) : ''}</span>`

/** A row of the column menu. */
const col = (
  name: string,
  o: {
    on?: boolean
    shown?: boolean
    lock?: boolean
    mono?: boolean
    tag?: string
    fit?: boolean
    focus?: boolean
    lift?: boolean
  } = {},
) =>
  `<div class="ci${o.focus ? ' on' : ''}${o.lift ? ' lift' : ''}"><span class="grip${o.lock ? ' none' : ''}">${icon('grip-vertical', 14)}</span>${box(o.shown !== false, o.lock)}<span class="n${o.mono ? ' mono' : ''}${o.shown === false ? ' off' : ''}">${escape(name)}</span>${o.fit ? '<span class="fit">doesn’t fit</span>' : ''}${o.tag ? `<span class="tag">${o.tag}</span><span class="rm">${icon('x', 14)}</span>` : ''}</div>`

const FOOT = `<div class="foot"><span><kbd>space</kbd>show or hide</span><span><kbd>⌥↑↓</kbd>move</span><span class="dl">${icon('download', 14)}Download CSV</span></div>`

const menu = (rows: string, o: { reset?: boolean; add?: string } = {}) =>
  `<div class="menu"><div class="top">Columns<span class="reset${o.reset ? '' : ' off'}">Reset</span></div><div class="list">${rows}</div><div class="sep" style="margin:0"></div>${o.add ?? `<div class="addf">${icon('plus', 14)}Add a label or annotation…</div>`}${FOOT}</div>`

const POD_COLS = [
  'Name',
  'Namespace',
  'Status',
  'Ready',
  'Restarts',
  'CPU',
  'Memory',
  'Node',
  'Age',
]

const toolbar = (o: { open?: boolean; badge?: string; tip?: string } = {}) =>
  `<div class="bar"><span class="count">41 pods</span><span class="grow"></span><span class="fld" style="width:200px">${icon('tag', 14)}Label selector</span><span class="fld" style="width:220px">${icon('search', 14)}Filter pods<kbd>/</kbd></span><span class="sq${o.open ? ' open' : ''}" style="position:relative">${icon('columns-3', 16)}${o.badge ? `<span class="badge">${o.badge}</span>` : ''}${o.tip ? `<span class="tip" style="top:38px;right:0">${o.tip}</span>` : ''}</span></div>`

function where(): string {
  return `<section class="spec"><h2>Where the menu is<i>one button at the end of every list’s toolbar, and the header</i></h2>
    <div class="row">
      <div style="width:700px"><p class="cap">As it is, nothing chosen: the button, its tooltip “Columns”</p><div class="panel">${toolbar({ tip: 'Columns' })}<div style="height:30px"></div></div></div>
      <div style="width:700px"><p class="cap">Two chosen columns don’t fit this width: the button says how many</p><div class="panel">${toolbar({ badge: '2', tip: 'Columns: 2 don’t fit at this width' })}<div style="height:30px"></div></div></div>
    </div>
    <p><b>A square button at the toolbar’s end</b>, after the filter, with the columns icon and the tooltip “Columns”; it opens the menu, which is a popover under it. <b>The header’s context menu</b> (right-click, or the menu key on a focused heading) has two items: “Hide this column” and “Columns…”, which opens the same menu. When chosen columns don’t fit the list’s width, the button carries <b>a count</b> in the app’s small grey badge, and its tooltip says “Columns: 2 don’t fit at this width”; nothing else on the page changes.</p>
  </section>`
}

function menus(): string {
  const plain = menu(POD_COLS.map((n, i) => col(n, { lock: i === 0, focus: i === 3 })).join(''))
  const chosen = menu(
    [
      col('Name', { lock: true }),
      col('Status'),
      col('app.kubernetes.io/component', { mono: true, tag: 'label' }),
      col('Restarts', { focus: true }),
      col('Namespace'),
      col('Node', { fit: true }),
      col('deployment.kubernetes.io/revision', { mono: true, tag: 'annotation', fit: true }),
      col('Ready', { shown: false }),
      col('CPU', { shown: false }),
      col('Memory', { shown: false }),
      col('Age', { shown: false }),
    ].join(''),
    { reset: true },
  )
  const dragging = menu(
    [
      col('Name', { lock: true }),
      col('Status'),
      '<div class="drop"></div>',
      col('Restarts', { lift: true }),
      col('Namespace'),
      col('Ready'),
      col('CPU'),
    ].join(''),
    { reset: true },
  )
  return `<section class="spec"><h2>The menu<i>a box to show, a handle to move, the order is the list’s</i></h2>
    <div class="row">
      <div><p class="cap">As it opens on Pods, nothing chosen</p>${plain}</div>
      <div><p class="cap">Chosen: moved, hidden, a label and an annotation added; two don’t fit</p>${chosen}</div>
      <div><p class="cap">Moving one with the pointer: it lifts, a line shows where it lands</p>${dragging}</div>
    </div>
    <p><b>The rows are the columns in the list’s order</b>, left to right, top to bottom; hidden ones keep their place in the order, drawn quieter. <b>Name is always first and always shown</b>: its box is ticked and dimmed, it has no handle, and nothing can be moved above it. <b>A box shows or hides</b>; <b>the handle moves</b> (the whole row is draggable; the line in the accent shows where it lands). An added column is in mono with “label” or “annotation” and an × that takes it away; a column of the list’s own can only be hidden. <b>“doesn’t fit”</b> marks the shown columns that the list’s width leaves out (below). <b>Reset</b> puts the list back as Lumovi draws it, added columns gone; it’s quiet while there’s nothing to reset. Choices apply at once and are remembered per kind and per cluster.</p>
  </section>`
}

function adding(): string {
  const sug = (key: string, n: string, on = false, bold = 'comp') =>
    `<div class="sg${on ? ' on' : ''}"><span class="n">${escape(key).replace(bold, `<b>${bold}</b>`)}</span><small>${n}</small></div>`
  const typing = menu([col('Name', { lock: true }), col('Namespace'), col('Status')].join(''), {
    add: `<div class="addf typed">${icon('plus', 14)}comp</div><div class="grp">Labels</div>${sug('app.kubernetes.io/component', 'on 38 of 41', true)}${sug('component', 'on 4 of 41')}<div class="grp">Annotations</div>${sug('app.kubernetes.io/component-owner', 'on 12 of 41')}`,
  })
  const unknown = menu([col('Name', { lock: true }), col('Namespace')].join(''), {
    add: `<div class="addf typed">${icon('plus', 14)}team.example.com/owner</div><div class="sg on"><span class="n" style="font-family:Inter,sans-serif;font-size:13px">Add label “team.example.com/owner”</span></div><div class="sg"><span class="n" style="font-family:Inter,sans-serif;font-size:13px">Add annotation “team.example.com/owner”</span></div><div class="grp" style="text-transform:none;letter-spacing:0">None of the 41 pods has it yet.</div>`,
  })
  const header = `<div class="panel tbl" style="width:820px"><div class="th" style="grid-template-columns:minmax(0,2fr) 140px 120px 150px 80px"><span><em>Name</em></span><span><em>Status</em></span><span style="position:relative"><em>component</em><span class="tip" style="top:30px;left:0;text-transform:none;letter-spacing:0;font-weight:400">Label app.kubernetes.io/component</span></span><span><em>Restarts</em></span><span><em>Age</em></span></div>
    <div class="tr" style="grid-template-columns:minmax(0,2fr) 140px 120px 150px 80px"><span class="nm">cart-6c9d7f5b44-w4nq7</span><span>${pill('critical', 'CrashLoopBackOff')}</span><span class="mono">api</span><span>14</span><span>2h</span></div>
    <div class="tr" style="grid-template-columns:minmax(0,2fr) 140px 120px 150px 80px"><span class="nm">storefront-7d9f6c5b8-x2kqp</span><span>${pill('healthy', 'Running')}</span><span class="mono">web</span><span>0</span><span>3d</span></div>
    <div class="tr" style="grid-template-columns:minmax(0,2fr) 140px 120px 150px 80px"><span class="nm">redis-0</span><span>${pill('healthy', 'Running')}</span><span class="dash">—</span><span>0</span><span>12d</span></div></div>`
  return `<section class="spec"><h2>Adding a column<i>from a label or an annotation key</i></h2>
    <div class="row">
      <div><p class="cap">Typing: the keys the listed objects have, labels and annotations apart</p>${typing}</div>
      <div><p class="cap">A key none of them has yet</p>${unknown}</div>
      <div><p class="cap">As a header: the key’s name after its prefix; the whole key in the tooltip</p>${header}</div>
    </div>
    <p><b>The field is the menu’s last row.</b> Typing matches the keys of the objects the list holds now (a list offers only what it carries: Lumovi already leaves the last-applied configuration off every listed object), labels first, then annotations, each with how many of them have it (“on 38 of 41”), the most common first, eight at most a group; the typed part is in bold. A key none has yet can still be added, as a label or as an annotation, saying so. Enter adds the active suggestion; the field stays for another. <b>As a header</b> a key shows its name after the last “/” (“component”), uppercase as every header, with “Label app.kubernetes.io/component” in its tooltip; if two added columns would show the same name, both show the whole key, middle-cut. <b>A cell</b> is the value in mono, end-cut with its tooltip. A cell, its tooltip, and a heading made from a key are the cluster’s text, drawn as Lumovi draws any text that isn’t its own (characters that would turn text round or can’t be seen shown as marks); an object without the key shows the dash. An added column sorts like text and starts at 160 px.</p>
  </section>`
}

function sizing(): string {
  const cols = 'minmax(160px,2fr) 180px 104px 120px 96px'
  const t = (edge: string) =>
    `<div class="panel tbl" style="width:680px"><div class="th" style="grid-template-columns:${cols}"><span><em>Name</em></span><span><em>Status</em>${edge}</span><span><em>Ready</em></span><span><em>Restarts</em></span><span><em>Age</em></span></div><div class="tr" style="grid-template-columns:${cols}"><span class="nm">cart-6c9d7f5b44-w4nq7</span><span>${pill('critical', 'CrashLoopBackOff')}</span><span>1/2</span><span>14</span><span>2h</span></div></div>`
  return `<section class="spec"><h2>Sizing<i>a heading’s right edge; the list never scrolls sideways</i></h2>
    <div class="row">
      <div><p class="cap">Under the pointer, the edge shows; dragging, it’s the accent from top to bottom</p>${t('<span class="edge drag"></span>')}</div>
      <div><p class="cap">From the keyboard: a focused heading, then ⌥← ⌥→</p>${t('<span class="edge focus"></span>')}</div>
    </div>
    <p><b>Each heading’s right edge</b> is an 8 px target; under the pointer a 2 px line shows, and while dragging it runs the table’s height in the accent. Double-clicking it gives the column its own width back. <b>From the keyboard</b>, on a focused heading (headings are already stops, after the rows), ⌥→ widens and ⌥← narrows it by 16 px, the edge drawn in the accent while it’s moving; ⌥0 gives its width back. <b>A column is never narrower than 64 px</b>, nor than its heading’s first word; Name never narrower than 160 px. <b>Never sideways</b>: the columns are laid out in the person’s order, and the ones that would run past the list’s right edge aren’t drawn, last first; Name is never one of them. They’re the ones the menu marks “doesn’t fit” and the button counts. Widening a column can push the last ones out; that’s the trade, said by the badge as it happens. With nothing chosen, today’s priorities decide what gives way, as now.</p>
  </section>`
}

function exporting(): string {
  const cols = '28px minmax(0,2fr) 150px 140px 80px'
  const r = (
    name: string,
    st: string,
    lvl: 'critical' | 'healthy',
    comp: string,
    age: string,
    picked = false,
  ) =>
    `<div class="tr${picked ? ' picked' : ''}" style="grid-template-columns:${cols}"><span>${box(picked)}</span><span class="nm">${name}</span><span>${pill(lvl, st)}</span><span class="mono">${comp}</span><span>${age}</span></div>`
  return `<section class="spec"><h2>Copy and download<i>what’s picked to the clipboard; what’s listed to a file</i></h2>
    <div class="row">
      <div style="width:620px"><p class="cap">Rows picked: Copy is in the picked rows’ bar, first</p><div class="panel tbl"><div class="th" style="grid-template-columns:${cols}"><span>${box(false)}</span><span><em>Name</em></span><span><em>Status</em></span><span><em>component</em></span><span><em>Age</em></span></div>${r('cart-6c9d7f5b44-w4nq7', 'CrashLoopBackOff', 'critical', 'api', '2h', true)}${r('cart-6c9d7f5b44-8xk2p', 'Running', 'healthy', 'api', '2h', true)}${r('storefront-7d9f6c5b8-x2kqp', 'Running', 'healthy', 'web', '3d')}</div>
        <div style="display:flex;justify-content:center;margin-top:14px"><span class="selbar">2 selected<span class="b hi" style="margin-left:8px">${icon('copy', 14)}Copy</span><span class="b">${icon('rotate-cw', 14)}Restart</span><span class="b">${icon('trash-2', 14)}Delete</span><span class="x">${icon('x', 16)}</span></span></div>
        <div style="display:flex;justify-content:center;margin-top:12px"><span class="toast">${icon('check', 16)}Copied 2 rows</span></div></div>
      <div style="width:620px"><p class="cap">What Copy puts on the clipboard: the shown columns, as shown, tab-separated, with the headings</p><pre class="out">Name\tStatus\tcomponent\tAge
cart-6c9d7f5b44-w4nq7\tCrashLoopBackOff\tapi\t2h
cart-6c9d7f5b44-8xk2p\tRunning\tapi\t2h</pre>
        <p class="cap" style="margin-top:14px">What Download CSV saves: every filtered row, the shown columns, whole values</p><pre class="out">Name,Status,app.kubernetes.io/component,Created
cart-6c9d7f5b44-w4nq7,CrashLoopBackOff,api,2026-10-12T07:41:09Z
cart-6c9d7f5b44-8xk2p,Running,api,2026-10-12T07:41:09Z
storefront-7d9f6c5b8-x2kqp,Running,web,2026-10-09T11:02:55Z
redis-0,Running,,2026-09-30T18:20:14Z</pre>
        <div style="display:flex;margin-top:12px"><span class="toast">${icon('check', 16)}Saved pods-shop-2026-10-12.csv<span class="lnk">Show in Finder</span></span></div></div>
    </div>
    <p><b>Copy</b> is the first button of the picked rows’ bar, on every list; it copies those rows for pasting into a chat or a ticket: the shown columns in their order, the headings first, tab-separated, each value as the list shows it but never cut (a long name whole, a status in its word, an age as “2h”). The app’s toast says “Copied 2 rows”. ⌘C copies them too while the list has the focus and rows are picked. <b>Download CSV</b> is in the column menu’s foot, since it’s the shown columns that it writes: every row the filters and the namespace pick let through, not only the ones on screen, with whole values a spreadsheet can use: an added key’s whole name as its heading, times in UTC as ISO 8601 (“Age” becomes “Created”), numbers without units, an empty cell where the list shows a dash. The file is named for the kind, the namespace (or the cluster) and the day, saved through the app’s own save dialog, opening at Downloads with that name filled in, as logs and the audit file are; the toast names the file as kept, with “Show in Finder” (on Windows and Linux, “Show in folder”; served in a browser, the browser’s own download). With nothing filtered it’s the whole list. The file’s name keeps only letters, digits and hyphens of the namespace or the cluster’s name. <b>Safe to open</b>: everything in it is the cluster’s text, which anyone who may label an object writes, so a cell that starts with <code>=</code>, <code>+</code>, <code>-</code>, <code>@</code>, a tab or a carriage return gets a <code>'</code> in front so a spreadsheet takes it as text, never a formula; a cell holding a comma, a quote or a line break is quoted, its quotes doubled; and names and values are written as text, never numbers or dates guessed from their look, except the columns Lumovi knows are numbers or times. <b>Copy</b> puts a space in place of a tab or a line break inside a value, so a row stays a row.</p>
  </section>`
}

function keys(): string {
  return `<section class="spec"><h2>Keys<i>everything here without a pointer</i></h2>
    <table class="t">
      <tr><th>Where</th><th>Keys</th><th>Does</th></tr>
      <tr><td>The Columns button</td><td><code>↵</code> or <code>space</code></td><td>opens the menu, the first column row focused</td></tr>
      <tr><td>A column row</td><td><code>↑</code> <code>↓</code>, <code>space</code>, <code>⌥↑</code> <code>⌥↓</code>, <code>⌫</code></td><td>moves the focus; shows or hides; moves the column a place; takes an added one away</td></tr>
      <tr><td>The add field</td><td>type, <code>↑</code> <code>↓</code>, <code>↵</code></td><td>suggests, picks, adds; the field stays for another</td></tr>
      <tr><td>Reset, Download CSV</td><td><code>tab</code> to them, <code>↵</code></td><td>as pressed</td></tr>
      <tr><td>A focused heading</td><td><code>⌥←</code> <code>⌥→</code>, <code>⌥0</code>, the menu key</td><td>narrows or widens by 16 px; its own width; the heading’s menu</td></tr>
      <tr><td>The list, rows picked</td><td><code>⌘C</code></td><td>copies the picked rows</td></tr>
      <tr><td>The menu</td><td><code>esc</code></td><td>closes it; what was chosen stays</td></tr>
    </table>
    <p>The menu’s foot shows the two keys a person wouldn’t guess (space and ⌥↑↓), as the namespace menu’s foot shows its own. ⌥ is Alt off a Mac, ⌘ is Ctrl.</p>
  </section>`
}

function phone(): string {
  const list = `<div class="ph"><div class="pbar"><span class="tap">${icon('menu', 20)}</span><h1>Pods</h1></div><div class="tools"><span class="fld">${icon('search', 16)}Filter</span><span class="sq44">${icon('arrow-up-down', 16)}</span><span class="sq44">${icon('columns-3', 16)}</span></div>
    <div class="card"><b>cart-6c9d7f5b44-w4nq7</b><div class="facts">${pill('critical', 'CrashLoopBackOff')}<span class="mono">api</span><span>14 restarts</span><span>shop</span></div></div>
    <div class="card"><b>storefront-7d9f6c5b8-x2kqp</b><div class="facts">${pill('healthy', 'Running')}<span class="mono">web</span><span>0 restarts</span><span>shop</span></div></div>
    <div class="card"><b>redis-0</b><div class="facts">${pill('healthy', 'Running')}<span>0 restarts</span><span>data</span></div></div></div>`
  const prow = (
    name: string,
    o: { shown?: boolean; lock?: boolean; mono?: boolean; tag?: string } = {},
  ) =>
    `<div class="ci"><span class="grip${o.lock ? ' none' : ''}">${icon('grip-vertical', 16)}</span><span class="hit">${box(o.shown !== false, o.lock)}</span><span class="n${o.mono ? ' mono' : ''}${o.shown === false ? ' off' : ''}">${escape(name)}</span>${o.tag ? `<span class="rm">${icon('x', 16)}</span>` : ''}</div>`
  const sheet = `<div class="ph"><div class="pbar"><span class="tap">${icon('x', 20)}</span><h1>Columns</h1><span class="done">Reset</span></div><div class="list">${prow('Name', { lock: true })}${prow('Status')}${prow('app.kubernetes.io/component', { mono: true, tag: 'label' })}${prow('Restarts')}${prow('Namespace')}${prow('Ready', { shown: false })}${prow('Age', { shown: false })}</div><div class="addf">${icon('plus', 16)}Add a label or annotation…</div><div class="pfoot"><span class="dl">${icon('download', 16)}Download CSV</span></div></div>`
  return `<section class="spec"><h2>On a phone<i>the same choices, as the card’s facts</i></h2><div class="phones">${list}${sheet}</div>
    <p>By LMV-197’s rules. <b>The Columns button</b> is a 44 px square beside the filter and the sort button, as the sort button is. Its sheet is the phone’s, titled “Columns”, with Reset in the top bar: rows 44 px, the box a 44 px target, the handle a 44 px target that moves the row when held and dragged, × on an added one; the add field and Download CSV below. <b>The choices are the card’s facts</b>: after the name, the shown columns in their order, Status as its pill, an added key’s value in mono, a number with its column’s word (“14 restarts”); a fact the object hasn’t is left out, not dashed; the facts wrap to a second line and no further, those past it left out. <b>Nothing is sized on a phone</b>, so there’s nothing that doesn’t fit, and no badge. Copy is in the picked rows’ bar, as on the desktop.</p>
  </section>`
}

export type ColumnsFrame = 'columns' | 'columns-phone'

export const COLUMNS_FRAMES: { id: ColumnsFrame; title: string; size: Size }[] = [
  { id: 'columns', title: 'Columns and export', size: { width: 1440, height: 3000 } },
  { id: 'columns-phone', title: 'The same, on a phone', size: { width: 920, height: 900 } },
]

/** One of the frames, in one theme. */
export function columnsFrame(id: ColumnsFrame, scheme: Scheme): string {
  const f = COLUMNS_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'columns'
      ? `<header><h1>Columns and export</h1><p>Every list chooses which columns it shows, in what order and how wide, adds a column from a label or an annotation, and copies what’s picked or downloads what’s listed. One menu for all of them, since every list is the same table; remembered per kind and per cluster.</p></header>${where()}${menus()}${adding()}${sizing()}${exporting()}${keys()}`
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
