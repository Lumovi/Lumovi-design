/**
 * The Events page's Timeline (LMV-180): one row an involved object, each event a mark at its time,
 * a repeated one a bar from its first to its last. Drawn before it's built, with a real incident
 * (a Deployment whose pods crash, one of them first unschedulable), at 1440 and 1024, hovered,
 * zoomed, with many objects and with none, on an object's Events tab, and on a phone (the list).
 * The time axis, the range picker, the zoom chip and the tooltip are the metrics charts' own.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { CSS as KIT, cut, escape, only, phoneFrame } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.sheet { display: flex; flex-direction: column; gap: 40px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 12px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; color: var(--text-3); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 28px; max-width: 1500px; margin: 4px 0 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.row2 { display: flex; gap: 28px; align-items: flex-start; }

.page { overflow: visible; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.page .phd { display: flex; align-items: center; gap: 8px; height: 48px; padding: 0 20px; border-bottom: 1px solid var(--line); font-size: 15px; font-weight: 600; }
.page .phd svg.i { color: var(--text-2); }
.tb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--line); }
.tb .count { font-size: 13px; color: var(--text-2); }
.tb .chip { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); }
.tb .chip i { width: 7px; height: 7px; border-radius: 999px; background: var(--d); }
.tb .chip b { font-weight: 600; color: var(--text-1); }
.tb .chip.on { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); background: var(--accent-soft); color: var(--accent-strong); }
.tb .grow { flex: 1; }
.tb .fld { display: inline-flex; align-items: center; gap: 6px; height: 28px; width: 200px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 12.5px; color: var(--text-3); }
.tb .ibt { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid var(--line); border-radius: 8px; color: var(--text-2); }
.seg2 { display: flex; padding: 2px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); }
.seg2 span { display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 9px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.seg2 span.on { background: var(--surface); color: var(--text-1); box-shadow: 0 0 0 1px var(--line-strong); }
.zoomc { display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 4px 0 10px; border-radius: 999px; background: var(--accent-soft); font-size: 12px; font-weight: 500; color: var(--accent-strong); font-variant-numeric: tabular-nums; }
.zoomc span { display: grid; width: 20px; height: 20px; place-items: center; border-radius: 999px; }

.tlh { display: flex; align-items: center; gap: 10px; padding: 10px 20px 6px; }
.tlh .lg { display: flex; align-items: center; gap: 14px; margin-left: auto; font-size: 11.5px; color: var(--text-3); }
.tlh .lg span { display: inline-flex; align-items: center; gap: 5px; }
.tlh .lg svg { overflow: visible; }

.tl { position: relative; }
.tl .ax { display: grid; height: 26px; border-bottom: 1px solid var(--line-strong); }
.tl .ax .lbl { padding-left: 20px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; line-height: 26px; color: var(--text-3); }
.tl .r { display: grid; align-items: center; border-bottom: 1px solid var(--line); }
.tl .r.hov { background: color-mix(in srgb, var(--surface-3) 55%, transparent); }
.tl .r.dim .track, .tl .r.dim .name { opacity: 0.45; }
.tl .name { display: flex; min-width: 0; align-items: center; gap: 8px; padding: 0 12px 0 20px; }
.tl .name svg.i { flex: none; color: var(--text-3); }
.tl .name .k { flex: none; font-size: 11.5px; color: var(--text-3); }
.tl .name b { min-width: 0; overflow: hidden; font-size: 12.5px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; color: var(--accent-strong); }
.tl .name small { flex: none; font-size: 11.5px; color: var(--text-3); }
.tl .track { position: relative; height: 100%; }
.tl svg.g { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.tl svg.g line.grid { stroke: var(--line); }
.tl svg.g line.now { stroke: var(--text-3); stroke-dasharray: 3 3; }
.tl svg.g line.hair { stroke: var(--text-2); }
.tl svg.g text { font-size: 11px; fill: var(--text-3); font-variant-numeric: tabular-nums; }
.tl svg.g text.nowl { fill: var(--text-2); font-weight: 500; }
.tl svg.g rect.sel { fill: var(--accent-soft); stroke: var(--accent); stroke-opacity: 0.4; }
.tl svg.m { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.tl .mN { fill: var(--surface); stroke: var(--text-3); stroke-width: 1.5; }
.tl .mW { fill: var(--warn); stroke: var(--surface); stroke-width: 1; }
.tl .bW { fill: color-mix(in srgb, var(--warn) 22%, transparent); stroke: color-mix(in srgb, var(--warn) 70%, transparent); stroke-width: 1; }
.tl .bN { fill: color-mix(in srgb, var(--text-3) 14%, transparent); stroke: var(--line-strong); stroke-width: 1; }
.tl .xc { font-size: 10.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.tl .xc.W { fill: var(--warn-text); }
.tl .xc.N { fill: var(--text-3); }
.tl .clu { fill: var(--surface); stroke: var(--text-3); stroke-width: 1.5; }
.tl .clut { font-size: 10px; font-weight: 600; fill: var(--text-2); text-anchor: middle; }
.tl .foc { fill: none; stroke: var(--accent); stroke-width: 2; }
.tlmore { padding: 10px 20px 12px; border-top: 1px solid var(--line); font-size: 12px; color: var(--text-3); }

.ttip { position: absolute; z-index: 3; width: 300px; padding: 10px 12px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.ttip .t1 { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; }
.ttip .t1 .ty { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: var(--warn-text); }
.ttip .t1 .x { margin-left: auto; font-size: 12px; color: var(--warn-text); font-variant-numeric: tabular-nums; }
.ttip p { margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }
.ttip .t3 { margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.ttip ul { margin: 6px 0 0; padding: 0; list-style: none; }
.ttip li { display: grid; grid-template-columns: 62px 1fr; gap: 8px; font-size: 12px; line-height: 19px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.ttip li b { font-weight: 500; color: var(--text-1); }

.empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 56px 20px; text-align: center; }
.empty .tile2 { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.empty b { font-size: 13.5px; font-weight: 600; }
.empty span { font-size: 12.5px; color: var(--text-3); }

.dpanel2 { width: 600px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.dpanel2 .dh { display: flex; align-items: center; gap: 10px; padding: 14px 20px 8px; }
.dpanel2 .dh b { font-size: 15px; font-weight: 600; }
.dpanel2 .dh small { display: block; font-size: 12px; color: var(--text-3); }
.dpanel2 .lts { display: flex; gap: 4px; padding: 0 20px 1px; box-shadow: inset 0 -1px 0 var(--line); }
.dpanel2 .lt { padding: 8px 10px; font-size: 13px; color: var(--text-2); }
.dpanel2 .lt.on { color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }
.dpanel2 .tb { padding: 10px 20px; }

.ph .ev { display: flex; flex-direction: column; gap: 3px; }
.ph .ev .top2 { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.ph .ev .top2 .x { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--text-3); font-variant-numeric: tabular-nums; }
.ph .ev .obj { font-size: 12.5px; color: var(--accent-strong); }
.ph .ev p { margin: 2px 0 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.ph .tb { padding: 10px 16px; }
`

const sheet = (
  scheme: Scheme,
  width: number,
  body: string,
) => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${width}px; }
${only(PARTS, /^(\* |svg\.i|\.btn)/)}
${only(SHELL, /^\.spill/)}
${KIT}
${CSS}
</style><div class="sheet">${body}</div>`

// ─── The incident ──────────────────────────────────────────────────────────────────────────

/** An event: seconds after 14:00:00; a repeated one has its last time and its count. */
interface Ev {
  t: number
  reason: string
  w?: boolean
  last?: number
  count?: number
  msg: string
}

interface Row {
  kind: string
  glyph: IconName
  name: string
  ns?: string
  evs: Ev[]
}

const POD = 'checkout-7d9f6c5b8'
const INCIDENT: Row[] = [
  {
    kind: 'Deployment',
    glyph: 'layers',
    name: 'checkout',
    ns: 'shop',
    evs: [{ t: 120, reason: 'ScalingReplicaSet', msg: `Scaled up replica set ${POD} to 3` }],
  },
  {
    kind: 'ReplicaSet',
    glyph: 'copy',
    name: POD,
    ns: 'shop',
    evs: [
      { t: 121, reason: 'SuccessfulCreate', msg: `Created pod: ${POD}-hqnnn` },
      { t: 121.4, reason: 'SuccessfulCreate', msg: `Created pod: ${POD}-pwkd2` },
      { t: 121.8, reason: 'SuccessfulCreate', msg: `Created pod: ${POD}-x2kqp` },
    ],
  },
  {
    kind: 'Pod',
    glyph: 'box',
    name: `${POD}-hqnnn`,
    ns: 'shop',
    evs: [
      { t: 121, reason: 'Scheduled', msg: `Successfully assigned shop/${POD}-hqnnn to worker-1` },
      {
        t: 124,
        reason: 'Pulled',
        msg: 'Container image "ghcr.io/acme/checkout:v1.14.0" already present on machine',
      },
      { t: 125, reason: 'Created', msg: 'Created container app' },
      { t: 126, reason: 'Started', msg: 'Started container app' },
      {
        t: 192,
        reason: 'BackOff',
        w: true,
        last: 1900,
        count: 14,
        msg: `Back-off restarting failed container app in pod ${POD}-hqnnn_shop(4f1c9aa8-6b2e-4d1a-9c3f-2a1908f7e6d5)`,
      },
    ],
  },
  {
    kind: 'Pod',
    glyph: 'box',
    name: `${POD}-pwkd2`,
    ns: 'shop',
    evs: [
      { t: 121, reason: 'Scheduled', msg: `Successfully assigned shop/${POD}-pwkd2 to worker-2` },
      {
        t: 127,
        reason: 'Pulled',
        msg: 'Container image "ghcr.io/acme/checkout:v1.14.0" already present on machine',
      },
      { t: 128, reason: 'Created', msg: 'Created container app' },
      { t: 128.5, reason: 'Started', msg: 'Started container app' },
      {
        t: 205,
        reason: 'BackOff',
        w: true,
        last: 1880,
        count: 12,
        msg: `Back-off restarting failed container app in pod ${POD}-pwkd2_shop(9e8d7c6b-5a4f-4e2d-8c0b-9a8f7e6d5c4b)`,
      },
    ],
  },
  {
    kind: 'Pod',
    glyph: 'box',
    name: `${POD}-x2kqp`,
    ns: 'shop',
    evs: [
      {
        t: 122,
        reason: 'FailedScheduling',
        w: true,
        last: 1260,
        count: 6,
        msg: '0/4 nodes are available: 1 Insufficient memory, 3 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }.',
      },
      { t: 1262, reason: 'Scheduled', msg: `Successfully assigned shop/${POD}-x2kqp to worker-3` },
      {
        t: 1266,
        reason: 'Pulled',
        msg: 'Container image "ghcr.io/acme/checkout:v1.14.0" already present on machine',
      },
      { t: 1267, reason: 'Created', msg: 'Created container app' },
      { t: 1267.5, reason: 'Started', msg: 'Started container app' },
      {
        t: 1330,
        reason: 'BackOff',
        w: true,
        last: 1890,
        count: 4,
        msg: `Back-off restarting failed container app in pod ${POD}-x2kqp_shop(1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d)`,
      },
    ],
  },
]

const NOW = 1920

const clock = (t: number, secs = false) => {
  const s = Math.round(t)
  const h = 14 + Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  return `${h}:${String(m).padStart(2, '0')}${secs ? `:${String(ss).padStart(2, '0')}` : ''}`
}

interface View {
  from: number
  to: number
  /** Seconds between the axis's ticks. */
  step: number
  width: number
  label: number
  rowH?: number
  hover?: { row: number; ev: number; at: number }
  focus?: { row: number; ev: number }
  sel?: [number, number]
}

const tri = (x: number, y: number, s = 5.5) =>
  `<path class="mW" d="M${x} ${y - s} L${x + s} ${y + s * 0.8} L${x - s} ${y + s * 0.8} Z"/>`

/** One row's marks: a mark at each event; a repeated one a bar to its last, with ×count; close marks merged. */
function marks(r: Row, v: View, W: number, H: number, focused?: number): string {
  const x = (t: number) => ((t - v.from) / (v.to - v.from)) * W
  const y = H / 2
  const out: string[] = []
  // Marks closer than 8 px merge into one, with how many it holds.
  const singles = r.evs.map((e, i) => ({ e, i })).filter(({ e }) => !e.count || e.count < 2)
  const groups: { xs: number[]; is: number[]; w: boolean }[] = []
  for (const { e, i } of singles) {
    const px = x(e.t)
    if (px < -6 || px > W + 6) continue
    const g = groups.at(-1)
    if (g && px - g.xs.at(-1)! < 8) {
      g.xs.push(px)
      g.is.push(i)
      g.w ||= !!e.w
    } else groups.push({ xs: [px], is: [i], w: !!e.w })
  }
  for (const e of r.evs.filter((e) => e.count && e.count > 1)) {
    const a = Math.max(x(e.t), -2)
    const b = Math.min(x(e.last!), W + 2)
    if (b < 0 || a > W) continue
    const k = e.w ? 'W' : 'N'
    const len = Math.max(b - a, 8)
    out.push(`<rect class="b${k}" x="${a}" y="${y - 7}" width="${len}" height="14" rx="7"/>`)
    if (x(e.t) >= 0) out.push(e.w ? tri(a, y) : `<circle class="mN" cx="${a}" cy="${y}" r="4"/>`)
    const clipped = x(e.last!) > W
    const label = `×${e.count}${clipped ? ' →' : ''}`
    // Inside the bar, by its start, where it's long enough (what follows the bar never covers it), else just after it.
    out.push(
      len > 44
        ? `<text class="xc ${k}" x="${a + (x(e.t) >= 0 ? 11 : 8)}" y="${y + 3.8}">${label}</text>`
        : `<text class="xc ${k}" x="${a + len + 5}" y="${y + 3.8}">${label}</text>`,
    )
  }
  for (const g of groups) {
    const cx = (g.xs[0]! + g.xs.at(-1)!) / 2
    if (g.xs.length > 1) {
      out.push(
        `<rect class="clu" x="${cx - 9}" y="${y - 7}" width="18" height="14" rx="7"/><text class="clut" x="${cx}" y="${y + 3.5}">${g.xs.length}</text>`,
      )
    } else {
      const e = r.evs[g.is[0]!]!
      out.push(e.w ? tri(cx, y) : `<circle class="mN" cx="${cx}" cy="${y}" r="4"/>`)
    }
  }
  if (focused !== undefined) {
    const e = r.evs[focused]!
    const fx = Math.max(x(e.t), 0)
    out.push(`<circle class="foc" cx="${fx}" cy="${y}" r="9"/>`)
  }
  return out.join('')
}

/** The timeline: the axis on top, a row an object, marks on each. */
function timeline(
  rows: Row[],
  v: View,
  o: { tip?: string; byReason?: boolean; allNs?: boolean } = {},
): string {
  const W = v.width - v.label - 48
  const H = v.rowH ?? 40
  const x = (t: number) => ((t - v.from) / (v.to - v.from)) * W
  const ticks: number[] = []
  for (let t = Math.ceil(v.from / v.step) * v.step; t <= v.to; t += v.step) ticks.push(t)
  const secs = v.step < 60
  const axis = `<div class="ax" style="grid-template-columns:${v.label}px ${W}px 48px"><span class="lbl">${o.byReason ? 'Reason' : 'Object'}</span><div class="track"><svg class="g">${ticks
    .filter((t) => v.to < NOW - 1 || W - x(t) > 44)
    .map((t) => `<text x="${x(t)}" y="17" text-anchor="middle">${clock(t, secs)}</text>`)
    .join(
      '',
    )}${v.to >= NOW - 1 ? `<text class="nowl" x="${W}" y="17" text-anchor="end">now</text>` : ''}</svg></div><span></span></div>`
  const body = rows
    .map((r, i) => {
      const cls = v.hover ? (v.hover.row === i ? ' hov' : '') : ''
      const name = o.byReason
        ? `<div class="name"><b style="color:var(--text-1)">${escape(r.name)}</b></div>`
        : `<div class="name">${icon(r.glyph, 14)}<span class="k">${r.kind}</span><b>${fitName(r, v.label, !!o.allNs)}</b>${o.allNs && r.ns ? `<small>${r.ns}</small>` : ''}</div>`
      return `<div class="r${cls}" style="grid-template-columns:${v.label}px ${W}px 48px;height:${H}px">${name}<div class="track"><svg class="m">${marks(r, v, W, H, v.focus?.row === i ? v.focus.ev : undefined)}</svg></div><span></span></div>`
    })
    .join('')
  const total = 26 + rows.length * H
  const grid = `<svg class="g" style="left:${v.label}px;width:${W}px;top:0;height:${total}px">${ticks.map((t) => `<line class="grid" x1="${x(t)}" x2="${x(t)}" y1="26" y2="${total}"/>`).join('')}${v.to >= NOW - 1 ? `<line class="now" x1="${W}" x2="${W}" y1="22" y2="${total}"/>` : ''}${v.hover ? `<line class="hair" x1="${x(v.hover.at)}" x2="${x(v.hover.at)}" y1="22" y2="${total}"/>` : ''}${v.sel ? `<rect class="sel" x="${x(v.sel[0])}" y="26" width="${x(v.sel[1]) - x(v.sel[0])}" height="${total - 26}"/>` : ''}</svg>`
  const tip = o.tip ?? ''
  return `<div class="tl" style="width:${v.width}px">${grid}${axis}${body}${tip}</div>`
}

/** A name middle-cut to what its column leaves beside the icon, the kind and the namespace. */
const fitName = (r: Row, label: number, ns: boolean) => {
  const room =
    label - 20 - 12 - 14 - 8 - r.kind.length * 6.4 - 8 - (ns && r.ns ? r.ns.length * 6.4 + 8 : 0)
  const fit = Math.floor(room / 7.4)
  return r.name.length > fit ? cut(r.name, Math.max(fit, 12)) : escape(r.name)
}

const legend = `<div class="lg"><span><svg width="12" height="12"><path d="M6 1 L11.5 10.5 L0.5 10.5 Z" style="fill:var(--warn)"/></svg>Warning</span><span><svg width="12" height="12"><circle cx="6" cy="6" r="4" style="fill:var(--surface);stroke:var(--text-3);stroke-width:1.5"/></svg>Normal</span><span><svg width="22" height="10"><rect x="1" y="1" width="20" height="8" rx="4" style="fill:color-mix(in srgb, var(--warn) 22%, transparent);stroke:color-mix(in srgb, var(--warn) 70%, transparent)"/></svg>Repeated, with how often</span><span><svg width="18" height="14"><rect x="0.5" y="0.5" width="17" height="13" rx="6.5" style="fill:var(--surface);stroke:var(--text-3);stroke-width:1.5"/><text x="9" y="10.5" style="font-size:10px;font-weight:600;fill:var(--text-2);text-anchor:middle">3</text></svg>Close together: zoom to part them</span></div>`

const ranges = (on: string) =>
  `<div class="seg2" role="group" aria-label="Time range">${['15m', '1h', 'All'].map((r) => `<span class="${r === on ? 'on' : ''}">${r}</span>`).join('')}</div>`

const toolbar = (o: {
  count: string
  warn: number
  normal: number
  view: 'List' | 'Timeline'
  warnOn?: boolean
  filter?: string
  width?: number
}) =>
  `<div class="tb"><span class="count">${o.count}</span><span class="chip${o.warnOn ? ' on' : ''}" style="--d:var(--warn)"><i></i>Warning <b>${o.warn}</b></span><span class="chip" style="--d:var(--text-3)"><i></i>Normal <b>${o.normal}</b></span><span class="grow"></span><span class="fld" style="width:${o.width ?? 200}px">${icon('search', 13)}${o.filter ?? 'Filter events'}</span><span class="ibt">${icon('tag', 14)}</span><span class="seg2" role="group" aria-label="View"><span class="${o.view === 'List' ? 'on' : ''}">${icon('list', 13)}List</span><span class="${o.view === 'Timeline' ? 'on' : ''}">${icon('chart-gantt', 13)}Timeline</span></span></div>`

const pageOf = (title: string, inner: string, width: number) =>
  `<div class="page" style="width:${width}px"><div class="phd">${icon('activity', 16)}${title}</div>${inner}</div>`

const tipFor = (r: Row, e: Ev, left: number, top: number) =>
  `<div class="ttip" style="left:${left}px;top:${top}px" role="tooltip"><div class="t1">${escape(e.reason)}<span class="ty">${icon('triangle-alert', 12)}Warning</span>${e.count ? `<span class="x">×${e.count}</span>` : ''}</div><p>${escape(e.msg)}</p><div class="t3">${r.kind} ${escape(r.name)} · first ${clock(e.t, true)}, last ${clock(e.last ?? e.t, true)}</div></div>`

const W1440 = 1376 - 2
const VIEW_ALL: View = { from: 0, to: NOW, step: 300, width: W1440, label: 340 }

function incidentFrame(): string {
  const hqnnn = INCIDENT[2]!
  const at = 1240
  const xAt = 340 + ((at - 0) / NOW) * (W1440 - 340 - 48)
  const rest = pageOf(
    'Events',
    `${toolbar({ count: '20 events', warn: 4, normal: 16, view: 'Timeline' })}<div class="tlh">${ranges('All')}${legend}</div>${timeline(INCIDENT, VIEW_ALL)}`,
    1376,
  )
  const hovered = pageOf(
    'Events',
    `${toolbar({ count: '20 events', warn: 4, normal: 16, view: 'Timeline' })}<div class="tlh">${ranges('All')}${legend}</div>${timeline(
      INCIDENT,
      { ...VIEW_ALL, hover: { row: 2, ev: 4, at } },
      { tip: tipFor(hqnnn, hqnnn.evs[4]!, xAt - 14 - 300, 26 + 40 + 6) },
    )}`,
    1376,
  )
  return `<section class="blk"><h2>The incident<i>the Events page, Timeline; namespace shop; All</i></h2>
    <p class="cap">At rest: rows in the order their first event came, so it reads top to bottom: the Deployment scaled, its ReplicaSet made three pods, two started and went into BackOff, the third couldn’t be scheduled for 19 minutes</p>${rest}
    <p class="cap">The pointer on hqnnn’s BackOff: its row lit, a hairline at the pointer’s time, the tooltip</p>${hovered}
    <ul class="rules">
      <li><b>Where:</b> “List | Timeline” at the toolbar’s right, the metrics charts’ segmented control, in the page’s address (?as=timeline; ?view is saved views’). The filters stay as they are: namespaces, the Warning and Normal chips (what they count is what’s drawn), the text filter and the label selector. The columns button goes in Timeline, since there are none.</li>
      <li><b>A row</b> is an involved object: its kind’s icon, its kind quiet, its name in the link colour (it opens the object), middle-cut to its column, and, with all namespaces, its namespace quiet. Rows come in the order of their first event, oldest at the top. 40 px a row, 340 px for the names at 1440.</li>
      <li><b>A mark</b> is an event at its time: Normal a hollow circle in the quiet ink, Warning a filled triangle in the warning colour, so the shape tells them apart as well as the colour. <b>Repeated</b> (a count over 1): a bar from its first time to its last, its first mark at the start and ×count inside it by the start (after it when the bar is short), in the warning text for a Warning. <b>The count’s room</b> is its width and 4 px, free of any mark or bar in that row, single marks included. When a mark sits in the room after a short bar, the count goes before the bar’s first mark instead, right-aligned 4 px from it (“×31 ▲▭”). When both sides are taken it isn’t drawn: the bar still reads as repeated, and the hover card and the mark’s name still say ×31. Zoomed in, the bar grows and the count goes back inside it.</li>
      <li><b>Close together</b>, marks less than 8 px apart merge into one rounded mark with how many it holds (the 4 at each pod’s start: Scheduled, Pulled, Created, Started). Its tooltip lists them; zooming parts them.</li>
      <li><b>The axis</b> is the metrics charts’: their ticks and times, 11 px quiet, a hairline grid, and “now” at the right with a dashed line when the range runs to now. Ranges: 15m, 1h and All (from the earliest event shown; Kubernetes keeps about an hour by default).</li>
      <li><b>Hover or focus</b>, the row takes the hover fill, a hairline marks the time, and the charts’ tooltip says the reason, Warning (word and icon), ×count, the message whole, and the object with its first and last time. <b>Click a mark</b>: opens the event, as a row of the list does. <b>Click a name</b>: opens the object.</li>
    </ul></section>`
}

function zoomFrame(): string {
  const zoom: View = {
    from: 110,
    to: 200,
    step: 15,
    width: W1440,
    label: 340,
    focus: { row: 2, ev: 1 },
  }
  const drag: View = { ...VIEW_ALL, sel: [110, 200] }
  const hqnnn2 = INCIDENT[2]!
  const fx = 340 + ((124 - 110) / (200 - 110)) * (W1440 - 340 - 48)
  const ftip = `<div class="ttip" style="left:${fx + 64}px;top:30px" role="tooltip"><div class="t1">Pulled<span class="ty" style="color:var(--text-3)">${icon('circle', 12)}Normal</span></div><p>${escape(hqnnn2.evs[1]!.msg)}</p><div class="t3">Pod ${escape(hqnnn2.name)} · ${clock(124, true)}</div></div>`
  return `<section class="blk"><h2>Zoom<i>drag across the timeline, as on the metrics charts</i></h2>
    <p class="cap">Dragging from 14:01:50 to 14:03:20: the charts’ selection</p>${pageOf('Events', `${toolbar({ count: '20 events', warn: 4, normal: 16, view: 'Timeline' })}<div class="tlh">${ranges('All')}${legend}</div>${timeline(INCIDENT, drag)}`, 1376)}
    <p class="cap">Zoomed to that minute and a half: most merged marks part (pwkd2’s Created and Started, half a second apart, still make a 2); hqnnn’s BackOff begins; the bars that run past the right edge say so; hqnnn’s Pulled has the keyboard’s focus</p>${pageOf('Events', `${toolbar({ count: '20 events', warn: 4, normal: 16, view: 'Timeline' })}<div class="tlh"><span class="zoomc">14:01:50 – 14:03:20<span>${icon('x', 13)}</span></span>${legend}</div>${timeline(INCIDENT, zoom, { tip: ftip })}`, 1376)}
    <ul class="rules">
      <li><b>Zoomed</b>, the range picker gives way to the charts’ chip, “14:01:50 – 14:03:20” with its × (“Reset zoom”), and the axis ticks in seconds. A bar that runs past either edge is drawn to it, and its ×count sits at the edge with an arrow. A merged mark parts as soon as its marks are 8 px apart.</li>
      <li><b>Keyboard</b>: the timeline is one tab stop, a grid. ↑ ↓ move between rows, ← → between a row’s marks in time (a merged mark is stepped through mark by mark), the focused mark has the accent ring and its tooltip, Enter opens the event, and Tab from a row goes to its name (Enter opens the object). Escape leaves the tooltip. A screen reader hears “Pulled, Normal, 14:02:04, Pod checkout-…-hqnnn”, then the message.</li>
      <li><b>Live</b>: the page’s polling adds marks where they belong and moves “now”; a zoomed view stays where it was, as the charts’ does. A new row is added at its place in the order, never above the one under the pointer.</li>
    </ul></section>`
}

/** Many objects: the cluster-wide hour, the Warning chip on. */
function manyFrame(): string {
  const names: [string, IconName, string, string, number, number, number][] = [
    ['Pod', 'box', 'recommendations-mcbt654b8h-bpp5n', 'shop', 40, 1910, 31],
    ['Pod', 'box', `${POD}-hqnnn`, 'shop', 192, 1900, 14],
    ['Pod', 'box', `${POD}-pwkd2`, 'shop', 205, 1880, 12],
    ['Pod', 'box', 'db-migrate-2r5n5', 'batch', 300, 640, 6],
    ['Pod', 'box', `${POD}-x2kqp`, 'shop', 122, 1260, 6],
    ['Job', 'play', 'db-migrate', 'batch', 650, 650, 1],
    ['Pod', 'box', 'search-6f8d9c7b5-q2wlx', 'search', 800, 1500, 3],
    ['PersistentVolumeClaim', 'database', 'data-postgres-0', 'data', 900, 1700, 9],
    ['Pod', 'box', 'storefront-5b8c7d9f4-k2m7p', 'shop', 1000, 1850, 22],
    ['Ingress', 'globe', 'storefront', 'shop', 1100, 1100, 1],
    ['Pod', 'box', 'cart-6c9d7f5b44-w4nq7', 'shop', 1200, 1915, 8],
    ['HorizontalPodAutoscaler', 'arrow-up-down', 'storefront', 'shop', 1300, 1800, 4],
    [
      'Pod',
      'box',
      'payments-reconciliation-worker-eu-west-1-blue-6c4d8f7b9-r8tzn',
      'billing',
      1400,
      1900,
      5,
    ],
    ['Service', 'network', 'search', 'search', 1500, 1500, 1],
  ]
  const rows: Row[] = names.map(([kind, glyph, name, ns, a, b, c]) => ({
    kind,
    glyph,
    name,
    ns,
    evs: [
      {
        t: a,
        w: true,
        reason: 'BackOff',
        last: c > 1 ? b : undefined,
        count: c > 1 ? c : undefined,
        msg: '',
      },
    ],
  }))
  const v: View = { ...VIEW_ALL, rowH: 34 }
  return `<section class="blk"><h2>Many objects<i>all namespaces, the Warning chip on</i></h2>
    ${pageOf('Events', `${toolbar({ count: '186 of 1,204 events', warn: 186, normal: 1018, view: 'Timeline', warnOn: true })}<div class="tlh">${ranges('All')}${legend}</div>${timeline(rows, v, { allNs: true })}<div class="tlmore">14 of 58 objects in view · scroll for more</div>`, 1376)}
    <ul class="rules">
      <li><b>Rows are virtualized</b>, 34 px each when there are more than 20, the axis staying on top as the rows scroll. The order is still each object’s first event, so the oldest trouble is first; a filter (a chip, the text, the labels) keeps the order and only takes rows away.</li>
      <li><b>A long name</b> takes the middle cut, its last six kept, as every list does; the tooltip and the object’s page have it whole. The kind is never cut.</li>
      <li><b>At the list’s 5,000 cap</b>, the page’s own note says so above the timeline, and the timeline draws what the list has.</li>
    </ul></section>`
}

// ─── 1024, the object's tab, empty ─────────────────────────────────────────────────────────

function narrowFrame(): string {
  const v: View = { ...VIEW_ALL, width: 760, label: 220 }
  const hq = INCIDENT[2]!
  const byReason: Row[] = [
    { kind: '', glyph: 'box', name: 'Scheduled', evs: [hq.evs[0]!] },
    { kind: '', glyph: 'box', name: 'Pulled', evs: [hq.evs[1]!] },
    { kind: '', glyph: 'box', name: 'Created', evs: [hq.evs[2]!] },
    { kind: '', glyph: 'box', name: 'Started', evs: [hq.evs[3]!] },
    { kind: '', glyph: 'box', name: 'BackOff', evs: [hq.evs[4]!] },
  ]
  const tab = `<div class="dpanel2"><div class="dh">${icon('box', 18)}<div><b>${escape(hq.name)}</b><small>Pod · shop · 30m old</small></div></div><div class="lts"><span class="lt">Overview</span><span class="lt">Logs</span><span class="lt">Map</span><span class="lt on">Events</span><span class="lt">Audit</span><span class="lt">YAML</span></div><div class="tb"><span class="count">5 events</span><span class="grow"></span><span class="seg2"><span>${icon('list', 13)}List</span><span class="on">${icon('chart-gantt', 13)}Timeline</span></span></div><div class="tlh">${ranges('All')}</div>${timeline(byReason, { ...VIEW_ALL, width: 600, label: 150 }, { byReason: true })}</div>`
  const empty = pageOf(
    'Events',
    `${toolbar({ count: '6 events', warn: 0, normal: 6, view: 'Timeline', width: 140 })}<div class="tlh">${ranges('15m')}</div><div class="empty"><span class="tile2">${icon('chart-gantt', 18)}</span><b>No events in search in the last 15 minutes.</b><span>Kubernetes keeps events for about an hour: All shows what’s kept.</span></div>`,
    760,
  )
  return `<section class="blk"><h2>At 1024, on an object, and none<i>the same parts, narrower</i></h2>
    <p class="cap">At 1024: the names’ column 220 px, the rest the timeline</p>${pageOf('Events', `${toolbar({ count: '20 events', warn: 4, normal: 16, view: 'Timeline', width: 140 })}<div class="tlh">${ranges('All')}</div>${timeline(INCIDENT, v)}`, 762)}
    <div class="row2"><div class="blk"><p class="cap">A Pod’s Events tab: one object, so a row a reason</p>${tab}</div><div class="blk"><p class="cap">Nothing in the range: namespace search, its six events all older</p>${empty}</div></div>
    <ul class="rules">
      <li><b>At 1024</b> the names take 220 px and the legend goes (each mark’s tooltip says what it is), the timeline keeping the rest. <b>Timeline is offered where its track gets at least 320 px</b>, the names taking 150 px below 1000 px of page: from about 560 px of page. <b>Opening an event or object never turns it into the list</b> under the person’s click: where the page beside the panel would drop under 560, the panel opens over the timeline instead, as a detail already opens over a list in a narrow window. Only a page that’s narrow before anything opens shows the list, without the toggle. A tick label within 44 px of “now” gives way to it.</li>
      <li><b>On an object’s Events tab</b> there’s one object, so a row is a <b>reason</b>, in the order each first came: Scheduled, Pulled, Created, Started, then BackOff ×14, its whole story on five lines. The toggle is in the tab’s own toolbar, and the choice stays with the person, so the next object’s Events tab opens the same way. A Deployment’s tab, which lists its own events, does the same.</li>
      <li><b>Counts are the list’s</b>: the count and the chips say what the page has, each Event once whatever its ×count, as in List; the range and the zoom only say how much time the timeline shows. <b>Nothing in the range</b>: the app’s EmptyState in the timeline’s place, docs’ words; with All already chosen, “No events in shop.” alone. The chips and filters stay, so a filter that hides everything says so as the list does (“Nothing matches “crash”.”).</li>
    </ul></section>`
}

function phoneFrameBlock(): string {
  const ev = (reason: string, w: boolean, x: string, obj: string, msg: string, age: string) =>
    `<li><div class="ev"><div class="top2">${w ? icon('triangle-alert', 14) : ''}${reason}<span class="x">${x}${x ? ' · ' : ''}${age}</span></div><span class="obj">${obj}</span><p>${msg}</p></div></li>`
  const list = phoneFrame(
    'Events',
    `<div class="tb"><span class="count">20 events</span><span class="grow"></span><span class="chip" style="--d:var(--warn)"><i></i>Warning <b>4</b></span></div><div class="sec" style="padding-top:4px"><ul class="cards">${ev('BackOff', true, '×14', `Pod checkout-7d9f…-hqnnn`, 'Back-off restarting failed container app in pod checkout-7d9f6c5b8-hqnnn_shop(4f1c9aa8-6b2e-4d1a-9c3f-2a1908f7e6d5)', '28s')}${ev('BackOff', true, '×4', `Pod checkout-7d9f…-x2kqp`, 'Back-off restarting failed container app in pod checkout-7d9f6c5b8-x2kqp_shop(1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d)', '30s')}${ev('BackOff', true, '×12', `Pod checkout-7d9f…-pwkd2`, 'Back-off restarting failed container app in pod checkout-7d9f6c5b8-pwkd2_shop(9e8d7c6b-5a4f-4e2d-8c0b-9a8f7e6d5c4b)', '40s')}${ev('Started', false, '', `Pod checkout-7d9f…-x2kqp`, 'Started container app', '11m')}</ul></div>`,
  )
  return `<section class="blk"><h2>On a phone<i>the list, as today; no Timeline</i></h2><div class="row2">${list}<ul class="rules" style="grid-template-columns:minmax(0,1fr);max-width:620px"><li><b>No toggle on a phone</b>: a timeline needs width, and a phone’s question, what’s wrong now, is the list’s, newest first. Under 640 px the toggle isn’t drawn and ?as=timeline opens the list. The list’s cards are as today: the reason with its level (word and icon for a Warning), ×count and age, the object as a link, the message under, three lines at most.</li><li><b>Turned sideways</b>, a phone wider than 760 px gets the timeline, as a narrow window does, by the page’s width and not the device.</li></ul></div></section>`
}

export type TimelineFrame = 'tl-incident' | 'tl-zoom' | 'tl-many' | 'tl-narrow' | 'tl-phone'

export const TIMELINE_FRAMES: { id: TimelineFrame; title: string; size: Size }[] = [
  {
    id: 'tl-incident',
    title: 'Events, Timeline: the incident',
    size: { width: 1440, height: 1400 },
  },
  {
    id: 'tl-zoom',
    title: 'Events, Timeline: zoom and keyboard',
    size: { width: 1440, height: 1400 },
  },
  { id: 'tl-many', title: 'Events, Timeline: many objects', size: { width: 1440, height: 1000 } },
  {
    id: 'tl-narrow',
    title: 'Events, Timeline: at 1024, on an object, none',
    size: { width: 1440, height: 1500 },
  },
  { id: 'tl-phone', title: 'Events on a phone', size: { width: 1100, height: 900 } },
]

const INTRO =
  '<header><h1>Events, Timeline (LMV-180)</h1><p>The Events page’s list, drawn on a time axis: a row an involved object, each event a mark at its time, a repeated one a bar from its first to its last. It reads nothing new: it’s the page’s own list, with the page’s filters. The axis, the ranges, the zoom chip and the tooltip are the metrics charts’ own. Drawn with a real incident in shop: Deployment checkout scaled to 3, two pods crash-looping, the third unschedulable for 19 minutes, then crash-looping too.</p></header>'

/** One of the frames, in one theme. */
export function timelineFrame(id: TimelineFrame, scheme: Scheme): string {
  const f = TIMELINE_FRAMES.find((x) => x.id === id)!
  const body = {
    'tl-incident': () => `${INTRO}${incidentFrame()}`,
    'tl-zoom': zoomFrame,
    'tl-many': manyFrame,
    'tl-narrow': narrowFrame,
    'tl-phone': phoneFrameBlock,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
