/**
 * A map of a whole namespace or cluster (LMV-172), as app's plan has it: a Map page of the picked
 * namespaces, after Workloads, drawn with the Map tab's cards and lines in columns (traffic,
 * services, workloads, pods, config and storage) and in bands by namespace, node or app. A big map
 * counts pods on their workloads and folds what's healthy; a search dims what doesn't match; the
 * page shows as a list too, and only as a list on a phone. Drawn in Lumovi's window from main's Map
 * tab (MapTab.tsx, map-layout.ts). Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { escape } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, DEPLOY_TABS, dock, panelHead, pill, win } from './windows.ts'

type H = 'healthy' | 'warning' | 'critical' | 'neutral'
const V: Record<H, string> = {
  healthy: 'good',
  warning: 'warn',
  critical: 'critical',
  neutral: 'neutral',
}

const CSS = `${WINDOW}
.sheet { display: flex; flex-direction: column; gap: 44px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; max-width: 1100px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.cap b { font-weight: 600; color: var(--text-2); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 32px; max-width: 1376px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.rules code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); font-variant-ligatures: none; }
/* The bar: grouping, the field, and the toggle. */
.sel3 { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 8px 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; color: var(--text-3); white-space: nowrap; }
.sel3 b { font-weight: 500; color: var(--text-1); }
.sel3 svg.i { color: var(--text-2); }
.fld.on { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); color: var(--text-1); }
.fld .caret { width: 1.5px; height: 16px; margin-left: -6px; background: var(--text-1); }
.fld .fcount { margin-left: auto; font-size: 12px; color: var(--text-3); }
.seg { display: inline-flex; flex: none; padding: 2px; gap: 2px; border: 1px solid var(--line); border-radius: 9px; }
.seg span { display: grid; width: 28px; height: 26px; place-items: center; border-radius: 6px; color: var(--text-3); }
.seg span.on { background: var(--surface-3); color: var(--text-1); }
.seg span.off { opacity: 0.4; }
.note { display: flex; flex: none; align-items: center; gap: 8px; padding: 8px 20px; border-bottom: 1px solid var(--line); font-size: 12.5px; color: var(--text-2); }
.note svg.i { color: var(--text-3); }
/* The map: column heads, bands, cards and lines. */
.mz { position: relative; flex: 1; min-height: 0; overflow: hidden; }
.mh { position: relative; flex: none; height: 34px; margin: 0 20px; border-bottom: 1px solid var(--line); }
.mh span { position: absolute; top: 11px; font-size: 11px; line-height: 14px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
.mb { padding: 0 20px; }
.mb + .mb { border-top: 1px solid var(--line); }
.bh { display: flex; height: 46px; align-items: center; gap: 8px; font-size: 12.5px; white-space: nowrap; }
.bh > svg.i { color: var(--text-3); }
.bh b { font-size: 13.5px; font-weight: 600; }
.bh .in { color: var(--text-3); }
.bc { overflow: hidden; color: var(--text-3); text-overflow: ellipsis; }
.hl { display: flex; flex: none; margin-left: auto; align-items: center; gap: 8px; font-weight: 500; }
.hl > span { display: inline-flex; align-items: center; gap: 6px; }
.hl i { width: 6px; height: 6px; border-radius: 50%; }
.hl .ok { font-weight: 400; color: var(--text-2); }
.hl .sep { color: var(--text-3); font-weight: 400; }
.hl .nm { font-weight: 400; color: var(--text-3); }
.bb { position: relative; margin-bottom: 18px; }
.bb.cut { overflow: hidden; }
svg.mln { position: absolute; inset: 0; overflow: visible; }
.cd { position: absolute; display: flex; height: 56px; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); }
.cd .kt { display: grid; width: 28px; height: 28px; flex: none; place-items: center; border-radius: 8px; background: var(--surface-3); color: var(--text-2); }
.cd .tx { display: flex; min-width: 0; flex: 1; flex-direction: column; overflow: hidden; }
.cd .l1 { display: flex; min-width: 0; align-items: center; font-size: 11px; line-height: 15px; white-space: nowrap; color: var(--text-3); }
.cd .l1 .k { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.cd .l1 .mt { min-width: 0; flex-shrink: 999; overflow: hidden; text-overflow: ellipsis; }
.cd .st { display: flex; min-width: 0; flex: none; margin-left: auto; padding-left: 8px; align-items: center; gap: 4px; font-weight: 500; color: var(--text-2); }
.cd .st i { width: 6px; height: 6px; border-radius: 50%; }
.cd .l2 { display: flex; min-width: 0; align-items: baseline; gap: 6px; }
.cd .l2 b { min-width: 0; overflow: hidden; font-size: 13px; line-height: 19px; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.cd .l2 small { flex: none; overflow: hidden; font-size: 11px; color: var(--text-3); white-space: nowrap; }
.cd .l2 small em { font-style: normal; font-weight: 500; color: var(--critical-text); }
.cd mark { border-radius: 3px; background: color-mix(in srgb, var(--accent) 22%, transparent); color: inherit; }
.cd .bar { position: absolute; right: 12px; bottom: 6px; left: 12px; display: flex; height: 3px; gap: 1px; overflow: hidden; border-radius: 999px; }
.cd.nar .l1 .st { margin-left: 0; padding-left: 0; }
.cd.nar .l1 .cn { flex: none; margin-left: auto; padding-left: 8px; font-size: 11px; color: var(--text-3); }
.cd.nar .l1 .cn em { font-style: normal; font-weight: 500; color: var(--critical-text); }
.cd.nar .l2 { align-items: center; gap: 5px; }
.cd.nar .l2 svg.i { color: var(--text-3); }
.cd.miss { border-style: dashed; border-color: color-mix(in srgb, var(--critical) 45%, transparent); background: color-mix(in srgb, var(--critical) 5%, var(--surface)); box-shadow: none; }
.cd.dim { opacity: 0.35; }
.cd.hit { border-color: var(--accent); }
.cd.open { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.cd.open .kt { background: var(--accent); color: #fff; }
/* Folded: a healthy band as one card, and a band's healthy rest. */
.fold { display: flex; height: 52px; align-items: center; gap: 8px; margin: 10px 0; padding: 0 14px 0 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); font-size: 12.5px; white-space: nowrap; }
.fold > svg.i { color: var(--text-3); }
.fold b { font-size: 13.5px; font-weight: 600; }
.lnk { flex: none; color: var(--accent-strong); font-weight: 500; }
.fold .lnk, .rest .lnk { margin-left: 16px; }
.rest { position: absolute; left: 0; right: 0; display: flex; height: 48px; align-items: center; gap: 8px; padding: 0 14px 0 12px; border: 1px dashed var(--line-strong); border-radius: 12px; background: var(--surface-2); font-size: 12.5px; color: var(--text-2); white-space: nowrap; }
.rest svg.i { color: var(--text-3); }
.rest b { font-weight: 500; color: var(--text-1); }
.rest .lnk { margin-left: auto; }
/* The Group by menu. */
.gmenu { position: absolute; z-index: 30; width: 300px; padding: 6px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-pop); }
.gmenu .gi { display: flex; gap: 10px; padding: 7px 10px; border-radius: 8px; }
.gmenu .gi.hl2 { background: var(--surface-2); }
.gmenu .gi svg.i { margin-top: 2px; color: var(--text-2); }
.gmenu .gi b { display: block; font-size: 13px; font-weight: 500; }
.gmenu .gi small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.gmenu .gi .ck { margin-left: auto; color: var(--accent-strong); }
.mstrip { width: 1124px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
/* The list. */
.grp { display: flex; flex: none; height: 38px; align-items: center; gap: 8px; padding: 0 24px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12.5px; white-space: nowrap; }
.grp > svg.i { color: var(--text-3); }
.grp b { font-weight: 600; }
.grp .hl { font-size: 12px; }
.tr .pc { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: var(--text-2); }
.tr .pc em { font-style: normal; font-weight: 500; color: var(--critical-text); }
.tr .pc .bar { display: flex; width: 72px; height: 3px; gap: 1px; overflow: hidden; border-radius: 999px; }
.tr .via { overflow: hidden; font-size: 12.5px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.tr .via small { display: inline; color: var(--text-3); font-size: 12px; }
.tr .via .gone { color: var(--critical-text); }
/* The panel's Overview, enough to see it's the rows' panel. */
.ov { display: flex; flex-direction: column; gap: 14px; padding: 16px 20px; font-size: 13px; }
.kv { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 8px 12px; }
.kv dt { color: var(--text-3); }
.kv dd { margin: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.kv dd.m { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ov h4 { margin: 4px 0 0; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ov .pr2 { display: flex; height: 36px; align-items: center; gap: 10px; border-bottom: 1px solid var(--line); font-size: 12.5px; }
.ov .pr2 span:first-child { min-width: 0; flex: 1; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; }
.list { position: relative; }
.shade { position: absolute; top: 0; right: 0; bottom: 0; z-index: 5; display: flex; flex-direction: column; overflow: hidden; border-left: 1px solid var(--line-strong); background: var(--surface); box-shadow: -16px 0 40px -16px rgb(0 0 0 / 0.3); }
/* On a phone. */
.phs { display: flex; width: 390px; height: 844px; flex: none; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.phs .pb { display: flex; height: 52px; flex: none; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phs .pb b { flex: 1; font-weight: 600; }
.phs .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phs .pbar { display: flex; flex: none; gap: 8px; padding: 12px 16px 8px; }
.phs .pbar .sel3 { height: 40px; font-size: 14px; }
.phs .pf { display: flex; height: 44px; flex: none; align-items: center; gap: 10px; margin: 0 16px 10px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 10px; font-size: 15px; color: var(--text-3); }
.phs .pg { display: flex; flex: none; height: 44px; align-items: center; gap: 8px; padding: 0 16px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 13px; white-space: nowrap; }
.phs .pg b { font-weight: 600; }
.phs .pg .hl { font-size: 13px; }
.phs .pr { display: flex; min-height: 60px; flex: none; align-items: center; gap: 10px; padding: 8px 16px; border-bottom: 1px solid var(--line); }
.phs .pr .w2 { min-width: 0; flex: 1; }
.phs .pr .w2 b { display: block; overflow: hidden; font-size: 15px; font-weight: 400; white-space: nowrap; text-overflow: ellipsis; }
.phs .pr .w2 small { display: block; font-size: 13px; color: var(--text-3); }
.phs .pr .w2 small em { font-style: normal; font-weight: 500; color: var(--critical-text); }
`

// ─── Cards, lines and bands ────────────────────────────────────────────────────────────────

interface Card {
  id: string
  col: number
  row: number
  /** The kind as the Map tab says it: Deployment, Pods, Volume claim. */
  kind: string
  glyph: IconName
  name: string
  st?: [H, string]
  /** After the kind, giving way first: a Service's type and ports, a ConfigMap's keys. */
  meta?: string
  /** Pods by health along the card's foot: ready, warning, failing. */
  bar?: [number, number, number]
  /** Pods counted on their workload, after its name: [pods, failing, here]. */
  count?: [number, number, boolean?]
  missing?: boolean
  look?: 'dim' | 'hit' | 'open'
  /** What a search matched in the name. */
  hit?: string
}

/** From, to, and whether it's what the first uses or mounts (dashed). */
type Edge = [string, string, boolean?]

interface Geo {
  cw: number
  gap: number
}
/** Five columns at 1440: 1,082 px of map. */
const G5: Geo = { cw: 186, gap: 38 }
/** Four, with pods counted on their workloads. */
const G4: Geo = { cw: 240, gap: 40 }
/** Four at 1024: 730 px of map. */
const G1024: Geo = { cw: 164, gap: 24 }
const CH = 56
const ROW = CH + 12

const COLS5 = ['Traffic', 'Services', 'Workloads', 'Pods', 'Config and storage']
const COLS4 = ['Traffic', 'Services', 'Workloads', 'Config and storage']

const bar = ([ok, warn, fail]: [number, number, number], cls = 'bar') =>
  `<span class="${cls}">${[
    [ok, 'good'],
    [warn, 'warn'],
    [fail, 'critical'],
  ]
    .filter(([n]) => (n as number) > 0)
    .map(([n, v]) => `<span style="flex-grow:${n};background:var(--${v})"></span>`)
    .join('')}</span>`

/** "2 of 3 failing", or "3 pods" when none are; narrow, "2 failing". By node, "2 here, 2 failing". */
const counted = ([n, fail, here]: [number, number, boolean?], short = false) => {
  if (here) return fail ? `${n} here, <em>${fail} failing</em>` : `${n} here`
  if (!fail) return `${n} pod${n === 1 ? '' : 's'}`
  return short ? `<em>${fail} failing</em>` : `<em>${fail} of ${n} failing</em>`
}

function card(c: Card, g: Geo, shift = 0, short = false): string {
  const x = c.col * (g.cw + g.gap) - shift
  const y = c.row * ROW
  const lvl: H | undefined = c.missing ? 'critical' : c.st?.[0]
  const quiet = !lvl || lvl === 'healthy' || lvl === 'neutral'
  const st = c.st
    ? `<span class="st"${quiet ? '' : ` style="color:var(--${V[lvl!]}-text)"`}><i style="background:var(--${V[lvl!]})"></i>${c.st[1]}</span>`
    : ''
  const name = c.hit ? escape(c.name).replace(c.hit, `<mark>${c.hit}</mark>`) : escape(c.name)
  const cls = ['cd', c.missing ? 'miss' : '', c.look ?? '', short ? 'nar' : '']
    .filter(Boolean)
    .join(' ')
  // Narrow, the kind's tile and word give way to a small icon by the name, and the first line is
  // how it is: its status, then its count, or a ConfigMap's keys where there's no status.
  if (short) {
    const lead =
      st || (c.meta && c.kind !== 'Service' ? `<span class="mt">${escape(c.meta)}</span>` : '')
    return `<div class="${cls}" style="left:${x}px;top:${y}px;width:${g.cw}px" title="${c.kind} ${escape(c.name)}"><span class="tx"><span class="l1">${lead}${c.count ? `<small class="cn">${counted(c.count, true)}</small>` : ''}</span><span class="l2">${icon(c.glyph, 13)}<b>${name}</b></span></span>${c.bar ? bar(c.bar) : ''}</div>`
  }
  return `<div class="${cls}" style="left:${x}px;top:${y}px;width:${g.cw}px"><span class="kt">${icon(c.glyph, 15)}</span><span class="tx"><span class="l1"><span class="k">${c.kind}</span>${c.meta && c.kind !== 'Service' ? `<span class="mt">&nbsp;· ${escape(c.meta)}</span>` : ''}${st}</span><span class="l2"><b>${name}</b>${c.count ? `<small>${counted(c.count, short)}</small>` : ''}</span></span>${c.bar ? bar(c.bar) : ''}</div>`
}

const EDGE: Partial<Record<H, string>> = { critical: 'var(--critical)', warning: 'var(--warn)' }

function lines(cards: Card[], edges: Edge[], g: Geo, shift = 0): string {
  const at = new Map(cards.map((c) => [c.id, c]))
  const paths = edges.map(([f, t, uses]) => {
    const a = at.get(f)!
    const b = at.get(t)!
    const x1 = a.col * (g.cw + g.gap) + g.cw - shift
    const y1 = a.row * ROW + CH / 2
    const x2 = b.col * (g.cw + g.gap) - shift
    const y2 = b.row * ROW + CH / 2
    const color = EDGE[b.missing ? 'critical' : (b.st?.[0] ?? 'neutral')]
    const dim = a.look === 'dim' || b.look === 'dim'
    const d = `M${x1} ${y1} C${x1 + g.gap / 2} ${y1} ${x2 - g.gap / 2} ${y2} ${x2} ${y2}`
    return {
      order: color ? 1 : 0,
      svg: `<path d="${d}" fill="none" stroke="${color ?? 'var(--line-strong)'}" stroke-width="1.5"${uses ? ' stroke-dasharray="4 4"' : ''} stroke-linejoin="round"${dim ? ' opacity="0.2"' : ''}/>`,
    }
  })
  // Where lines share a lane, the ones that say something are drawn last, on top.
  return `<svg class="mln" aria-hidden="true">${paths
    .sort((p, q) => p.order - q.order)
    .map((p) => p.svg)
    .join('')}</svg>`
}

interface BandBody {
  cards: Card[]
  edges: Edge[]
  /** The band's healthy rest, folded into one card after its rows. */
  rest?: string
  /** Rows shown, when the window cuts the band. */
  rows?: number
}

function body(b: BandBody, g: Geo, shift = 0, short = false): string {
  const rows = Math.max(...b.cards.map((c) => c.row)) + 1
  const restTop = rows * ROW
  const full = b.rest ? restTop + 48 : rows * ROW - 12
  const h = b.rows !== undefined ? b.rows * ROW - 12 : full
  const rest = b.rest
    ? `<div class="rest" style="top:${restTop}px">${icon('chevrons-up-down', 14)}${b.rest}<span class="lnk">Show them</span></div>`
    : ''
  return `<div class="bb${b.rows !== undefined ? ' cut' : ''}" style="height:${h}px">${lines(b.cards, b.edges, g, shift)}${b.cards.map((c) => card(c, g, shift, short)).join('')}${rest}</div>`
}

const health = (fail = 0, warn = 0) =>
  fail || warn
    ? [
        fail
          ? `<span style="color:var(--critical-text)"><i style="background:var(--critical)"></i>${fail} failing</span>`
          : '',
        warn
          ? `<span style="color:var(--warn-text)"><i style="background:var(--warn)"></i>${warn} warning</span>`
          : '',
      ]
        .filter(Boolean)
        .join('<span class="sep">·</span>')
    : `<span class="ok"><i style="background:var(--good)"></i>All healthy</span>`

const NO_MATCH = '<span class="nm">No match</span>'

const head = (o: {
  glyph: IconName
  name: string
  counts: string
  health: string
  open?: boolean
  after?: string
}) =>
  `<header class="bh">${icon(o.open === false ? 'chevron-right' : 'chevron-down', 14)}${icon(o.glyph, 14)}<b>${o.name}</b>${o.after ?? ''}<span class="bc">${o.counts}</span><span class="hl">${o.health}</span></header>`

const folded = (name: string, counts: string) =>
  `<div class="fold">${icon('chevron-right', 14)}${icon('layout-grid', 14)}<b>${name}</b><span class="bc">${counts}</span><span class="hl" style="margin-left:auto">${health()}</span><span class="lnk">Show</span></div>`

const colHeads = (names: string[], g: Geo, shift = 0) =>
  `<div class="mh">${names.map((n, i) => `<span style="left:${i * (g.cw + g.gap) - shift}px">${n}</span>`).join('')}</div>`

const toolbar = (o: {
  count: string
  group?: string
  q?: string
  found?: string
  list?: boolean
  field?: number
}) =>
  `<div class="tbar"><span class="count">${o.count}</span><span class="sel3">Group by <b>${o.group ?? 'Namespace'}</b>${icon('chevron-down', 14)}</span><span class="grow"></span>${
    o.q
      ? `<span class="fld on" style="width:${o.field ?? 260}px">${icon('search', 14)}<span>${o.q}</span><span class="caret"></span><span class="fcount">${o.found}</span></span>`
      : `<span class="fld" style="width:${o.field ?? 240}px">${icon('search', 14)}Find on the map</span>`
  }<span class="seg"><span class="${o.list ? '' : 'on'}" title="As a map">${icon('waypoints', 15)}</span><span class="${o.list ? 'on' : ''}" title="As a list">${icon('list', 15)}</span></span></div>`

/** The sidebar gains Map, after Workloads, with the Map tab's icon. */
const withMap = (html: string) =>
  html.replace(
    /(<div class="n[^"]*">[^]*?Workloads<\/div>)/,
    `$1<div class="n on">${icon('waypoints', 16)}Map</div>`,
  )

const mwin = (o: { page: string; w?: number; h?: number; ns?: string; extra?: string }) =>
  withMap(
    win({
      w: o.w ?? 1376,
      h: o.h ?? 860,
      cluster: 'production-eu',
      nav: '',
      title: 'Map',
      glyph: 'waypoints',
      ns: o.ns ?? '3 namespaces',
      page: o.page,
      dock: dock([]),
      more: true,
      extra: o.extra,
    }),
  )

// ─── What's drawn ──────────────────────────────────────────────────────────────────────────

const svc = (id: string, row: number, name: string, port: string, st: [H, string]): Card => ({
  id,
  col: 1,
  row,
  kind: 'Service',
  glyph: 'network',
  name,
  meta: `ClusterIP · ${port}`,
  st,
})

/** shop: five workloads, one failing, one degraded, and a ConfigMap that isn't there. */
function shop(): BandBody {
  const cards: Card[] = [
    {
      id: 'i1',
      col: 0,
      row: 0,
      kind: 'Ingress',
      glyph: 'globe',
      name: 'storefront',
      meta: 'shop.example.com',
    },
    svc('s1', 0, 'storefront', '80', ['healthy', '3/3 ready']),
    {
      id: 'd1',
      col: 2,
      row: 0,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'storefront',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p1',
      col: 3,
      row: 0,
      kind: 'Pods',
      glyph: 'box',
      name: 'storefront-6d4b9c7f5',
      st: ['healthy', '3/3 ready'],
      bar: [3, 0, 0],
    },
    {
      id: 'c1',
      col: 4,
      row: 0,
      kind: 'ConfigMap',
      glyph: 'file-code-2',
      name: 'storefront-config',
      meta: '4 keys',
    },
    svc('s2', 1, 'checkout', '8080', ['warning', '1/3 ready']),
    {
      id: 'd2',
      col: 2,
      row: 1,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'checkout',
      st: ['warning', 'Degraded'],
    },
    {
      id: 'p2',
      col: 3,
      row: 1,
      kind: 'Pods',
      glyph: 'box',
      name: 'checkout-7c9f8b6d4',
      st: ['critical', '1/3 ready'],
      bar: [1, 0, 2],
    },
    {
      id: 'c2',
      col: 4,
      row: 1,
      kind: 'Secret',
      glyph: 'key-round',
      name: 'checkout-stripe',
      meta: '2 keys',
    },
    svc('s3', 2, 'cart', '8080', ['healthy', '2/2 ready']),
    {
      id: 'd3',
      col: 2,
      row: 2,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'cart',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p3',
      col: 3,
      row: 2,
      kind: 'Pods',
      glyph: 'box',
      name: 'cart-5f7d8c9b6',
      st: ['healthy', '2/2 ready'],
      bar: [2, 0, 0],
    },
    {
      id: 'c3',
      col: 4,
      row: 2,
      kind: 'ConfigMap',
      glyph: 'file-code-2',
      name: 'cart-config',
      meta: '3 keys',
    },
    svc('s4', 3, 'recommendations', '8080', ['critical', '0/1 ready']),
    {
      id: 'd4',
      col: 2,
      row: 3,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'recommendations',
      st: ['critical', 'Unavailable'],
    },
    {
      id: 'p4',
      col: 3,
      row: 3,
      kind: 'Pods',
      glyph: 'box',
      name: 'recommendations-84c6f',
      st: ['critical', '0/1 ready'],
      bar: [0, 0, 1],
    },
    {
      id: 'c4',
      col: 4,
      row: 3,
      kind: 'ConfigMap',
      glyph: 'file-code-2',
      name: 'recs-model',
      st: ['critical', 'Not found'],
      missing: true,
    },
    svc('s5', 4, 'orders-db', '5432', ['healthy', '1/1 ready']),
    {
      id: 'd5',
      col: 2,
      row: 4,
      kind: 'StatefulSet',
      glyph: 'database',
      name: 'orders-db',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p5',
      col: 3,
      row: 4,
      kind: 'Pods',
      glyph: 'box',
      name: 'orders-db',
      st: ['healthy', '1/1 ready'],
      bar: [1, 0, 0],
    },
    {
      id: 'c5',
      col: 4,
      row: 4,
      kind: 'Volume claim',
      glyph: 'hard-drive',
      name: 'data-orders-db-0',
      meta: '20Gi',
      st: ['healthy', 'Bound'],
    },
  ]
  const edges: Edge[] = [
    ['i1', 's1'],
    ['i1', 's2'],
  ]
  for (const n of [1, 2, 3, 4, 5])
    edges.push([`s${n}`, `d${n}`], [`d${n}`, `p${n}`], [`p${n}`, `c${n}`, true])
  return { cards, edges }
}

function monitoring(): BandBody {
  const cards: Card[] = [
    {
      id: 'i1',
      col: 0,
      row: 0,
      kind: 'Ingress',
      glyph: 'globe',
      name: 'grafana',
      meta: 'grafana.example.com',
    },
    svc('s1', 0, 'grafana', '3000', ['healthy', '1/1 ready']),
    {
      id: 'd1',
      col: 2,
      row: 0,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'grafana',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p1',
      col: 3,
      row: 0,
      kind: 'Pods',
      glyph: 'box',
      name: 'grafana-7b8c5d9f4',
      st: ['healthy', '1/1 ready'],
      bar: [1, 0, 0],
    },
    {
      id: 'c1',
      col: 4,
      row: 0,
      kind: 'ConfigMap',
      glyph: 'file-code-2',
      name: 'grafana-dashboards',
      meta: '12 keys',
    },
    svc('s2', 1, 'prometheus', '9090', ['healthy', '1/1 ready']),
    {
      id: 'd2',
      col: 2,
      row: 1,
      kind: 'StatefulSet',
      glyph: 'database',
      name: 'prometheus',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p2',
      col: 3,
      row: 1,
      kind: 'Pods',
      glyph: 'box',
      name: 'prometheus',
      st: ['healthy', '1/1 ready'],
      bar: [1, 0, 0],
    },
    {
      id: 'c2',
      col: 4,
      row: 1,
      kind: 'Volume claim',
      glyph: 'hard-drive',
      name: 'prometheus-db-0',
      meta: '50Gi',
      st: ['healthy', 'Bound'],
    },
  ]
  const edges: Edge[] = [['i1', 's1']]
  for (const n of [1, 2])
    edges.push([`s${n}`, `d${n}`], [`d${n}`, `p${n}`], [`p${n}`, `c${n}`, true])
  return { cards, edges }
}

/** A band with its pods counted on its workloads: the Pods column gone, config in the fourth. */
function countedBand(b: BandBody, keep?: Set<string>): BandBody {
  const pods = new Map(b.cards.filter((c) => c.kind === 'Pods').map((c) => [c.id.slice(1), c]))
  const cards = b.cards
    .filter((c) => c.kind !== 'Pods' && (!keep || keep.has(c.id)))
    .map((c) => {
      if (c.col === 4) return { ...c, col: 3 }
      const p = c.col === 2 ? pods.get(c.id.slice(1)) : undefined
      return p
        ? {
            ...c,
            bar: p.bar,
            count: [p.bar!.reduce((s, n) => s + n, 0), p.bar![2]] as [number, number],
          }
        : c
    })
  const rows = [...new Set(cards.map((c) => c.row))].sort((x, y) => x - y)
  const packed = cards.map((c) => ({ ...c, row: rows.indexOf(c.row) }))
  const ids = new Set(packed.map((c) => c.id))
  const edges: Edge[] = b.edges
    .map(([f, t, u]): Edge => (f.startsWith('p') ? [`d${f.slice(1)}`, t, u] : [f, t, u]))
    .filter(([f, t]) => !t.startsWith('p') && ids.has(f) && ids.has(t))
  return { cards: packed, edges }
}

const looks = (b: BandBody, l: Record<string, Card['look']>, hit = ''): BandBody => ({
  ...b,
  cards: b.cards.map((c) => ({
    ...c,
    look: l[c.id] ?? c.look,
    hit: l[c.id] === 'hit' ? hit : undefined,
  })),
})

const SHOP_HEAD = {
  glyph: 'layout-grid' as IconName,
  name: 'shop',
  counts: '5 workloads · 10 pods · 5 services',
}
const MON_HEAD = {
  glyph: 'layout-grid' as IconName,
  name: 'monitoring',
  counts: '2 workloads · 2 pods · 2 services',
}
const KS_HEAD = {
  glyph: 'layout-grid' as IconName,
  name: 'kube-system',
  counts: '6 workloads · 14 pods · 3 services',
}

/** The bar's count: the namespaces with a band, their workloads, and their pods once each. */
const COUNT = '3 namespaces · 13 workloads · 26 pods'

/** kube-system's first rows, cut by the window. */
function kubeSystem(): BandBody {
  const cards: Card[] = [
    svc('s1', 0, 'kube-dns', '53', ['healthy', '2/2 ready']),
    {
      id: 'd1',
      col: 2,
      row: 0,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'coredns',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p1',
      col: 3,
      row: 0,
      kind: 'Pods',
      glyph: 'box',
      name: 'coredns-5d78c9869d',
      st: ['healthy', '2/2 ready'],
      bar: [2, 0, 0],
    },
    {
      id: 'c1',
      col: 4,
      row: 0,
      kind: 'ConfigMap',
      glyph: 'file-code-2',
      name: 'coredns',
      meta: '1 key',
    },
    svc('s2', 1, 'metrics-server', '443', ['healthy', '1/1 ready']),
    {
      id: 'd2',
      col: 2,
      row: 1,
      kind: 'Deployment',
      glyph: 'layers',
      name: 'metrics-server',
      st: ['healthy', 'Ready'],
    },
    {
      id: 'p2',
      col: 3,
      row: 1,
      kind: 'Pods',
      glyph: 'box',
      name: 'metrics-server-6d94bc8694',
      st: ['healthy', '1/1 ready'],
      bar: [1, 0, 0],
    },
  ]
  return {
    cards,
    edges: [
      ['s1', 'd1'],
      ['d1', 'p1'],
      ['p1', 'c1', true],
      ['s2', 'd2'],
      ['d2', 'p2'],
    ],
  }
}

// ─── The frames ────────────────────────────────────────────────────────────────────────────

function pageFrame(): string {
  const page = `${toolbar({ count: COUNT })}<div class="mz">${colHeads(COLS5, G5)}
    <section class="mb">${head({ ...SHOP_HEAD, health: health(2, 1) })}${body(shop(), G5)}</section>
    <section class="mb">${head({ ...MON_HEAD, health: health() })}${body(monitoring(), G5)}</section>
    <section class="mb">${head({ ...KS_HEAD, health: health() })}${body(kubeSystem(), G5)}</section></div>`
  return `<section class="blk"><h2>The page<i>grouped by namespace, at 1440, a small cluster: everything drawn</i></h2>${mwin({ page, h: 900 })}<p class="cap">Three namespaces picked. shop has a degraded Deployment whose pods are failing, a Deployment that’s down, and a ConfigMap it mounts that isn’t there; lines into each take its colour. monitoring is healthy. Hovering a card lights its chain both ways, as on the Map tab.</p></section>`
}

function largeFrame(): string {
  const g = G4
  const shopBig = countedBand(
    { ...shop(), cards: shop().cards.map((c) => (c.id === 'i1' ? { ...c, row: 1 } : c)) },
    new Set(['i1', 's2', 'd2', 'c2', 's4', 'd4', 'c4']),
  )
  shopBig.rest = '<b>22 more workloads, all healthy,</b> with their 19 services and 61 pods'
  const pay: BandBody = {
    cards: [
      svc('s1', 0, 'payments-api', '8443', ['critical', '0/2 ready']),
      {
        id: 'd1',
        col: 2,
        row: 0,
        kind: 'Deployment',
        glyph: 'layers',
        name: 'payments-api',
        st: ['critical', 'Unavailable'],
        bar: [0, 0, 2],
        count: [2, 2],
      },
      {
        id: 'c1',
        col: 3,
        row: 0,
        kind: 'Secret',
        glyph: 'key-round',
        name: 'payments-db',
        meta: '2 keys',
      },
    ],
    edges: [
      ['s1', 'd1'],
      ['d1', 'c1', true],
    ],
    rest: '<b>6 more workloads, all healthy,</b> with their 6 services and 14 pods',
  }
  const menu = `<div class="gmenu" style="left:466px;top:112px">
      <div class="gi hl2">${icon('layout-grid', 15)}<span><b>Namespace</b><small>A band for each namespace</small></span><span class="ck">${icon('check', 15)}</span></div>
      <div class="gi">${icon('server', 15)}<span><b>Node</b><small>A band for each node, with the pods on it</small></span></div>
      <div class="gi">${icon('tag', 15)}<span><b>App</b><small>By app.kubernetes.io/name, or app</small></span></div></div>`
  const page = `${toolbar({ count: '8 namespaces · 113 workloads · 265 pods' })}<div class="note">${icon('info', 14)}A big map: each workload’s pods are counted on its card, and what’s healthy is folded.</div><div class="mz">${colHeads(COLS4, g)}
    <section class="mb" style="padding-top:2px">${folded('argocd', '7 workloads · 19 pods · 9 services')}${folded('cert-manager', '3 workloads · 3 pods · 2 services')}${folded('ingress-nginx', '1 workload · 2 pods · 2 services')}${folded('kube-system', '14 workloads · 41 pods · 6 services')}${folded('monitoring', '9 workloads · 23 pods · 11 services')}</section>
    <section class="mb">${head({ glyph: 'layout-grid', name: 'payments', counts: '7 workloads · 16 pods · 7 services', health: health(1) })}${body(pay, g)}</section>
    <section class="mb">${head({ glyph: 'layout-grid', name: 'shop', counts: '24 workloads · 65 pods · 21 services', health: health(2, 1) })}${body(shopBig, g)}</section>
    <section class="mb">${folded('staging', '48 workloads · 96 pods · 44 services')}</section></div>`

  const nodeBand: BandBody = {
    cards: [
      svc('s1', 0, 'checkout', '8080', ['warning', '1/3 ready']),
      {
        id: 'd1',
        col: 2,
        row: 0,
        kind: 'Deployment',
        glyph: 'layers',
        name: 'checkout',
        st: ['warning', 'Degraded'],
        bar: [0, 0, 2],
        count: [2, 2, true],
      },
      {
        id: 'c1',
        col: 3,
        row: 0,
        kind: 'Secret',
        glyph: 'key-round',
        name: 'checkout-stripe',
        meta: '2 keys',
      },
    ],
    edges: [
      ['s1', 'd1'],
      ['d1', 'c1', true],
    ],
  }
  const appBand: BandBody = {
    cards: [
      {
        id: 'i1',
        col: 0,
        row: 0,
        kind: 'Ingress',
        glyph: 'globe',
        name: 'storefront',
        meta: 'shop.example.com',
      },
      svc('s1', 0, 'checkout', '8080', ['warning', '1/3 ready']),
      {
        id: 'd1',
        col: 2,
        row: 0,
        kind: 'Deployment',
        glyph: 'layers',
        name: 'checkout',
        st: ['warning', 'Degraded'],
        bar: [1, 0, 2],
        count: [3, 2],
      },
      {
        id: 'c1',
        col: 3,
        row: 0,
        kind: 'Secret',
        glyph: 'key-round',
        name: 'checkout-stripe',
        meta: '2 keys',
      },
    ],
    edges: [
      ['i1', 's1'],
      ['s1', 'd1'],
      ['d1', 'c1', true],
    ],
  }
  const strips = `<div class="rowx" style="display:flex;flex-direction:column;gap:12px">
    <div class="mstrip"><section class="mb">${head({ glyph: 'server', name: 'ip-10-0-3-17', after: pill('warning', 'Memory pressure'), counts: '31 pods of 14 workloads', health: health(1, 1) })}${body(nodeBand, g)}</section></div>
    <div class="mstrip"><section class="mb">${head({ glyph: 'tag', name: 'checkout', after: '<span class="in">in shop and staging</span>', counts: '· 3 workloads · 7 pods · 4 services', health: health(0, 1) })}${body(appBand, g)}</section></div></div>`
  return `<section class="blk"><h2>A big map<i>all namespaces: pods counted on their workloads, healthy bands folded, the Group by menu open</i></h2>${mwin({ page, h: 1090, ns: 'All namespaces', extra: menu })}<p class="cap">Ten namespaces, eight with a band: kube-node-lease and kube-public hold only Leases and kube-root-ca.crt, which aren’t drawn. Past about 400 cards. Six healthy namespaces are one card each; payments and shop show what’s unwell with its chain, and fold the rest into one card at their end.</p></section>
  <section class="blk"><h2>Grouped by node, and by app<i>a band’s head and first row each</i></h2>${strips}<p class="cap"><b>By node</b>, the node’s own trouble is a pill by its name, and a workload is drawn in each node it has pods on: “2 here” are this node’s. <b>By app</b>, the head says which namespaces the app is in.</p></section>`
}

function searchFrame(): string {
  const l: Record<string, Card['look']> = {}
  for (const c of shop().cards) l[c.id] = 'dim'
  for (const id of ['s2', 'd2', 'p2', 'c2']) l[id] = 'hit'
  l.i1 = undefined
  const page = `${toolbar({ count: COUNT, q: 'checkout', found: '4 found' })}<div class="mz">${colHeads(COLS5, G5)}
    <section class="mb">${head({ ...SHOP_HEAD, health: health(2, 1) })}${body(looks(shop(), l, 'checkout'), G5)}</section>
    <section class="mb">${head({ ...MON_HEAD, open: false, health: NO_MATCH })}</section>
    <section class="mb">${head({ ...KS_HEAD, open: false, health: NO_MATCH })}</section></div>`

  const cols = 'minmax(0,1.25fr) 150px 120px minmax(0,1.5fr) minmax(0,1.2fr)'
  const row = (o: {
    name: string
    kind: string
    st: string
    pods: [number, number, number]
    via: string
    uses: string
  }) => {
    const n = o.pods.reduce((s, x) => s + x, 0)
    return `<div class="tr" style="grid-template-columns:${cols}"><span><b>${o.name}</b><small>${o.kind}</small></span><span>${o.st}</span><span class="pc"><span>${n}${o.pods[2] ? ` · <em>${o.pods[2]} failing</em>` : ''}</span>${bar(o.pods)}</span><span class="via">${o.via}</span><span class="via">${o.uses}</span></div>`
  }
  const grp = (name: string, counts: string, h: string) =>
    `<div class="grp">${icon('chevron-down', 14)}${icon('layout-grid', 14)}<b>${name}</b><span class="bc">${counts}</span><span class="hl">${h}</span></div>`
  const k = (kind: string, name: string) => `<small>${kind}</small> ${name}`
  const list = `${toolbar({ count: COUNT, list: true })}
    <div class="th" style="grid-template-columns:${cols}"><span>Workload</span><span>Status</span><span>Pods</span><span>Reached by</span><span>Uses</span></div>
    ${grp('shop', SHOP_HEAD.counts, health(2, 1))}
    ${row({ name: 'storefront', kind: 'Deployment', st: pill('healthy', 'Ready'), pods: [3, 0, 0], via: `${k('Ingress', 'storefront')} · ${k('Service', 'storefront')}`, uses: 'storefront-config' })}
    ${row({ name: 'checkout', kind: 'Deployment', st: pill('warning', 'Degraded'), pods: [1, 0, 2], via: `${k('Ingress', 'storefront')} · ${k('Service', 'checkout')}`, uses: 'checkout-stripe' })}
    ${row({ name: 'cart', kind: 'Deployment', st: pill('healthy', 'Ready'), pods: [2, 0, 0], via: k('Service', 'cart'), uses: 'cart-config' })}
    ${row({ name: 'recommendations', kind: 'Deployment', st: pill('critical', 'Unavailable'), pods: [0, 0, 1], via: k('Service', 'recommendations'), uses: '<span class="gone">recs-model, not found</span>' })}
    ${row({ name: 'orders-db', kind: 'StatefulSet', st: pill('healthy', 'Ready'), pods: [1, 0, 0], via: k('Service', 'orders-db'), uses: 'data-orders-db-0' })}
    ${grp('monitoring', MON_HEAD.counts, health())}
    ${row({ name: 'grafana', kind: 'Deployment', st: pill('healthy', 'Ready'), pods: [1, 0, 0], via: `${k('Ingress', 'grafana')} · ${k('Service', 'grafana')}`, uses: 'grafana-dashboards' })}
    ${row({ name: 'prometheus', kind: 'StatefulSet', st: pill('healthy', 'Ready'), pods: [1, 0, 0], via: k('Service', 'prometheus'), uses: 'prometheus-db-0' })}
    ${grp('kube-system', KS_HEAD.counts, health())}`
  return `<section class="blk"><h2>Finding on the map<i>“checkout”: what doesn’t match dims, the way to a match stays</i></h2>${mwin({ page, h: 640 })}<p class="cap">Four cards match, the matched part marked. The Ingress doesn’t match but routes to one, so it stays as it is, and so do the lines between them. The bands with nothing matching fold to their heads.</p></section>
  <section class="blk"><h2>As a list<i>the toggle at the bar’s end: the same bands, a row for each workload</i></h2>${mwin({ page: list, h: 700 })}<p class="cap">The rows are in the map’s order, so switching doesn’t move anything. A row opens beside, as any list’s does.</p></section>`
}

function narrowFrame(): string {
  const g = G1024
  const shop4 = countedBand(shop())
  const mon4 = countedBand(monitoring())
  const plain = `${toolbar({ count: COUNT, field: 180 })}<div class="mz">${colHeads(COLS4, g)}
    <section class="mb">${head({ ...SHOP_HEAD, counts: '5 workloads · 10 pods', health: health(2, 1) })}${body(shop4, g, 0, true)}</section>
    <section class="mb">${head({ ...MON_HEAD, counts: '2 workloads · 2 pods', health: health() })}${body(mon4, g, 0, true)}</section></div>`

  // Opened: the panel lies over the map, which has scrolled a column so the card stays in view.
  const shift = g.cw + g.gap
  const opened = looks(shop4, { d2: 'open' })
  const panel = `<div class="shade" style="width:400px">${panelHead({
    kind: 'Deployment',
    glyph: 'layers',
    ns: 'shop',
    age: '88d',
    name: 'checkout',
    pill: pill('warning', 'Degraded'),
    acts: `<span class="btn">${icon('arrow-up-down', 14)}Scale</span><span class="btn">${icon('rotate-cw', 14)}Restart</span><span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span>`,
    tabs: DEPLOY_TABS.slice(0, 6),
    on: 'Overview',
  })}<div class="ov"><dl class="kv"><dt>Ready</dt><dd>1 of 3</dd><dt>Strategy</dt><dd>RollingUpdate, 25% surge</dd><dt>Image</dt><dd class="m">ghcr.io/acme/checkout:2.14.1</dd></dl><h4>Pods</h4>
    <div class="pr2"><span>checkout-7c9f8b6d4-hqnnn</span>${pill('critical', 'CrashLoopBackOff')}</div><div class="pr2"><span>checkout-7c9f8b6d4-pwkd2</span>${pill('critical', 'CrashLoopBackOff')}</div><div class="pr2"><span>checkout-7c9f8b6d4-lnk52</span>${pill('healthy', 'Running')}</div></div></div>`
  const open = `${toolbar({ count: COUNT, field: 180 })}<div class="mz">${colHeads(COLS4, g, shift)}
    <section class="mb">${head({ ...SHOP_HEAD, counts: '5 workloads · 10 pods', health: health(2, 1) })}${body(opened, g, shift, true)}</section>
    <section class="mb">${head({ ...MON_HEAD, counts: '2 workloads · 2 pods', health: health() })}${body(mon4, g, shift, true)}</section></div>${panel}`

  const prow = (name: string, sub: string, p: string) =>
    `<div class="pr"><div class="w2"><b>${name}</b><small>${sub}</small></div>${p}</div>`
  const pgrp = (name: string, h: string) =>
    `<div class="pg">${icon('layout-grid', 14)}<b>${name}</b><span class="hl">${h}</span></div>`
  const phone = `<div class="phs"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Map</b><span class="tap">${icon('layout-grid', 18)}</span></div>
    <div class="pbar"><span class="sel3">Group by <b>Namespace</b>${icon('chevron-down', 14)}</span></div><div class="pf">${icon('search', 18)}Find on the map</div>
    ${pgrp('shop', health(2, 1))}${prow('storefront', 'Deployment · 3 pods', pill('healthy', 'Ready'))}${prow('checkout', 'Deployment · 3 pods · <em>2 failing</em>', pill('warning', 'Degraded'))}${prow('cart', 'Deployment · 2 pods', pill('healthy', 'Ready'))}${prow('recommendations', 'Deployment · 1 pod · <em>1 failing</em>', pill('critical', 'Unavailable'))}${prow('orders-db', 'StatefulSet · 1 pod', pill('healthy', 'Ready'))}
    ${pgrp('monitoring', health())}${prow('grafana', 'Deployment · 1 pod', pill('healthy', 'Ready'))}${prow('prometheus', 'StatefulSet · 1 pod', pill('healthy', 'Ready'))}${pgrp('kube-system', health())}${prow('coredns', 'Deployment · 2 pods', pill('healthy', 'Ready'))}${prow('metrics-server', 'Deployment · 1 pod', pill('healthy', 'Ready'))}${prow('kube-proxy', 'DaemonSet · 6 pods', pill('healthy', 'Ready'))}</div>`

  return `<section class="blk"><h2>At 1024<i>four columns: pods counted on their workloads</i></h2>${mwin({ page: plain, w: 1024, h: 680 })}<p class="cap">Five columns need 1,082 px of map; at 1024 there are 730, so the pods are counted on their workloads, as on a big map. Each card is 164 px, so it’s compact: the kind is a small icon by the name, and the first line is how it is.</p></section>
  <section class="blk"><h2>A card opened<i>at 1024: the rows’ panel, over the map, the map scrolled a column so the card stays in view</i></h2>${mwin({ page: open, w: 1024, h: 680 })}</section>
  <section class="blk"><h2>On a phone<i>the list only</i></h2><div class="rowx" style="display:flex;gap:24px">${phone}</div></section>`
}

const PAGE_RULES = [
  '<b>Map</b> is in the sidebar after Workloads, with the Map tab’s icon, and in the palette and the Go menu. <b>G then Y</b> goes there: G then P is Pods and G then M Namespaces, and Q and Y were the only letters left. The Shortcuts window lists it with the other Go keys. It maps the namespaces picked at the top, as every list does.',
  '<b>It only reads.</b> Nothing on the page changes the cluster. A card opens the rows’ panel, and the object’s own actions are there, as they are for a row.',
  '<b>Columns, left to right</b>: Traffic (Ingresses and Gateway API routes), Services, Workloads, Pods (a workload’s pods as one card, as the Map tab has them), and Config and storage (ConfigMaps, Secrets, volume claims). A namespace grows in number, not in depth, so the map grows down the page, which scrolls, not sideways. The column heads stay at the top.',
  '<b>Rows follow the chain</b>: a workload’s row holds what routes to it and what it uses, so most lines run straight across. A Service’s line goes to the workload whose pods it selects, and the workload’s goes on to its pods. (The Map tab draws it to the pods, having no workload column, so docs say the two differ.) Lines for what a thing uses or mounts are dashed, as on the Map tab.',
  '<b>Lines into anything unwell take its colour</b>: red into what’s failing, amber into a warning, grey otherwise. A card says how it is by dot and word (“Degraded”, “1/3 ready”, “Not found”), never by colour alone. Hovering or focusing a card lights its chain both ways and dims the rest, as on the Map tab. Something mounted that isn’t there is a dashed red card.',
  '<b>Bands</b>: one for each namespace, in name order, so a band never moves when its health changes. Its head has the chevron that folds it, the name, and “5 workloads · 10 pods · 5 services”. At the right is its health: “2 failing · 1 warning” in their colours, or “All healthy”, quiet, with a green dot.',
  '<b>What the health counts</b>: each workload as its card says (checkout is Degraded, so it’s a warning, though two of its pods fail), and anything outside a workload on its own, such as a Service with no pods or a ConfigMap that isn’t there (recs-model is shop’s second failing). It reads the same whether pods are drawn or counted, and whether the band is folded or not.',
  '<b>What’s left out</b>: ConfigMaps and Secrets that nothing drawn uses or mounts, such as every namespace’s kube-root-ca.crt (put into pods by Kubernetes, never named by a workload) and Helm’s sh.helm.release.v1 Secrets. Their own lists have them, and no count on the page includes them. Service accounts, roles and bindings aren’t drawn either; the Map tab has them. Volume claims are drawn even when nothing mounts them, since they hold data, and a Service with no pods is drawn with its warning.',
  '<b>Nothing to map</b>: a namespace with nothing left to draw has no band (kube-public, kube-node-lease). With nothing at all, the page says “Nothing to map in these namespaces.” under the bar, with the namespace picker’s name as a link. <b>The bar’s count</b> is the namespaces with a band, their workloads and their pods, each pod once: what the band heads add up to.',
  '<b>Keys</b>: cards are in the tab order band by band, row by row; ↵ opens one beside and Esc closes it. Each card reads as the Map tab’s do: “Deployment checkout, Degraded”, then what it’s connected to.',
]

const LARGE_RULES = [
  '<b>A big map</b>, past about 400 cards: each workload’s pods are counted on its card, the Pods column goes, and the other four widen. The count ends the card’s second line: “2 of 3 failing” in red, or “3 pods” when none are. The bar along its foot is the pods by health, as on a Pods card, so the share shows without reading. A Service card drops its type and ports here, which don’t fit beside its status; its panel has them. The line under the bar says what’s happened.',
  '<b>A healthy band folds to one card</b>: its name, counts and “All healthy”, with Show at the end. The whole card is the button. Show unfolds it until the page is left, and its head’s chevron folds it again. Folded bands keep their place in name order.',
  '<b>A band with something unwell</b> draws what’s unwell with its chain, everything leading to it and from it. The rest folds into one dashed card at the band’s end: “22 more workloads, all healthy, with their 19 services and 61 pods”, and “Show them”. Anything unwell never folds, and neither does its chain. A line into something folded ends at that card.',
  '<b>Group by</b>: Namespace (the default), Node or App, kept for each cluster. Each grouping keeps the same columns, bands and health.',
  '<b>By node</b>, a band is a node: its name, a pill for its own trouble when it has one (NotReady, Memory pressure, Disk pressure), and “31 pods of 14 workloads”. A workload is drawn in each node it has pods on, its count saying how many are on this one: “2 here, 2 failing”. Services, config and storage go with the pods they serve. Its health counts the node too. Pods not yet on a node are in “Not scheduled” at the end.',
  '<b>By app</b>, a band is the value of app.kubernetes.io/name, or app where that’s not set, and its head says which namespaces it’s in. Something with neither label goes with what it’s connected to, when that’s all one app; otherwise it’s in “No app label” at the end.',
]

const SEARCH_RULES = [
  '<b>Find on the map</b> is the page’s field, and takes the words Search does: a bare word is part of a name, and <code>app=web</code> is a label, with <code>!=</code>, <code>=*</code> and <code>!key</code>. As you type, a card that doesn’t match dims to a third and its lines to a fifth. A match keeps its look, with an accent border and the matched part marked.',
  '<b>The way to a match stays</b>: everything leading to it and from it keeps its look, as hovering lights it, so what routes to a match and what it uses can still be read. The field ends in “4 found”, or “Nothing matches”. ↵ scrolls to the next match and ⇧↵ to the one before; Esc clears the field.',
  '<b>Bands with nothing matching fold to their heads</b>, saying “No match” where their health was, until the field is cleared, so the matches are on one screen. A match in a folded band or a folded rest unfolds it while the search is on.',
  '<b>As a map, or as a list</b>: two square buttons at the bar’s end, the Map tab’s icon and a list, titled “As a map” and “As a list”. The choice is kept for each cluster. The grouping and the field apply to both.',
  '<b>The list</b> has the same bands as group rows, with the same health, and a row for each workload in the map’s order: its name and kind, its status, its pods (“3 · 2 failing” over the bar, the column being Pods), what reaches it (Ingresses, then Services) and what it uses. Something that isn’t part of a workload has a row of its own after them. A row opens beside, as a list’s row does.',
  '<b>For a screen reader</b>, the list is the map in rows, and the map’s cards say what they’re connected to, as the Map tab’s do. The toggle says which is shown.',
]

const NARROW_RULES = [
  '<b>At 1024</b>: five columns need 1,082 px of map (a window about 1,380 px wide). With less, pods are counted on their workloads, as on a big map, and four columns fit down to 728 px; at 1024 there are 730, so a card is 164 px. Under about 180 px a card is compact: no kind tile or word, but the kind’s small icon before the name; the first line is the status, then the count (“2 failing”, or “3 pods”). A name gets 17 characters or so before it’s cut. The kind and name are in the card’s title and are read out.',
  '<b>Narrower still</b>, under 728 px of map (a window under about 1,020 px), the page shows the list. The map button is off, titled “The map needs a wider window”.',
  '<b>A card opens beside</b>, in the rows’ panel (400 px), on the object’s Overview. The panel lies over the map’s right side with a shadow, because the map can’t narrow without moving every card. The map scrolls sideways so the opened card and the line into it stay in view, and scrolls back when the panel closes. The opened card has the Map tab’s own-object look: an accent border and ring.',
  '<b>Open its map</b> is in a card’s menu (right-click, or the menu key) and goes to the per-object map: the panel on its Map tab.',
  '<b>On a phone</b>, the page is the list only, as the Map tab isn’t on a phone either, so there’s no toggle. It’s in the menu after Workloads. Group by and the field are as on the desktop, 40 and 44 px high. Bands are group rows with their health, and each row is two lines: the name, then the kind and pods, “Deployment · 3 pods · 2 failing”, the failing part in red. A row opens the object’s page.',
]

export type MapFrame = 'm-page' | 'm-large' | 'm-find' | 'm-narrow'

export const MAP_FRAMES: { id: MapFrame; title: string; size: Size }[] = [
  { id: 'm-page', title: 'The map: the page', size: { width: 1440, height: 1500 } },
  {
    id: 'm-large',
    title: 'The map: a big cluster, and grouping',
    size: { width: 1440, height: 1900 },
  },
  { id: 'm-find', title: 'The map: finding, and as a list', size: { width: 1440, height: 1900 } },
  {
    id: 'm-narrow',
    title: 'The map: at 1024, a card opened, on a phone',
    size: { width: 1440, height: 2700 },
  },
]

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function mapFrame(id: MapFrame, scheme: Scheme): string {
  const f = MAP_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${escape(t)}</h1><p>${p}</p></header>`
  const body = {
    'm-page': () =>
      `${intro('A map of a whole namespace or cluster (LMV-172)', 'The Map tab’s cards and lines for everything in the picked namespaces, in bands, with what’s unwell and what leads to it easy to see. It only reads. Words are drafts for docs.')}${pageFrame()}${rules(PAGE_RULES)}`,
    'm-large': () =>
      `${intro('The map: a big cluster, and grouping (LMV-172)', 'What changes past about 400 cards, and the bands by node and by app. Words are drafts for docs.')}${largeFrame()}${rules(LARGE_RULES)}`,
    'm-find': () =>
      `${intro('The map: finding, and as a list (LMV-172)', 'The field dims what doesn’t match and keeps the way to what does; the toggle shows the same map as a list. Words are drafts for docs.')}${searchFrame()}${rules(SEARCH_RULES)}`,
    'm-narrow': () =>
      `${intro('The map: at 1024, a card opened, and on a phone (LMV-172)', 'Four columns in a narrower window, the panel over the map, and the list on a phone. Words are drafts for docs.')}${narrowFrame()}${rules(NARROW_RULES)}`,
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
