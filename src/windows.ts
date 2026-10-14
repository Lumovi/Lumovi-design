/**
 * More than one window, and the dock keeping what you watch (LMV-176). Drawn before it's built,
 * from the app as it is: its window, its sidebar, the dock's bar along the bottom of a cluster's
 * pages, the detail panel and its Logs tab. What's new: an object kept open below, a tab's way to
 * a window of its own, a second window from the File menu, and what comes back after a restart.
 */
import { CSS as START_CSS, picker, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

/** The sheet a frame is laid out on: its header, blocks, captions and rules. */
const SHEET = `
* { box-sizing: border-box; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { flex: none; display: block; }
.sheet { display: flex; flex-direction: column; gap: 44px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 1180px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 12px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; color: var(--text-3); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 28px; max-width: 1440px; margin: 4px 0 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.row2 { display: flex; gap: 28px; align-items: flex-start; }
.stack { display: flex; flex-direction: column; gap: 10px; }
`

const CSS = `${SHEET}
.new { display: inline-block; margin-left: 6px; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 10.5px; line-height: 16px; font-style: normal; font-weight: 500; color: var(--accent-strong); vertical-align: 1px; }

/* The window, as the desktop app draws it. */
.w { position: relative; display: flex; flex: none; overflow: hidden; border-radius: 12px; background: var(--app-bg); box-shadow: 0 0 0 1px var(--line-strong), 0 24px 60px -24px rgb(0 0 0 / 0.35); }
.w.back { filter: saturate(0.92); }
.lights { position: absolute; top: 19px; left: 19px; display: flex; gap: 8px; }
.lights i { width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 0.12); }
.lights i + i { background: #febc2e; }
.lights i + i + i { background: #28c840; }
.w.back .lights i { background: var(--line-strong); }
.sb { display: flex; flex: none; width: 244px; flex-direction: column; padding-top: 40px; }
.sw { display: flex; margin: 12px; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.sw .d { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--good); }
.sw b { display: block; font-size: 13px; font-weight: 500; }
.sw small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.sw svg.i { margin-left: auto; color: var(--text-3); }
.nv { flex: 1; min-height: 0; overflow: hidden; padding: 0 12px; }
.nv .n { display: flex; height: 30px; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.nv .n svg.i { color: var(--text-3); }
.nv .n.on { background: var(--surface-3); font-weight: 500; color: var(--text-1); }
.nv h3 { margin: 12px 0 2px; padding: 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ft { display: flex; flex: none; height: 47px; align-items: center; gap: 4px; padding: 0 14px 8px; border-top: 1px solid var(--line); color: var(--text-2); }
.ft span { display: grid; width: 28px; height: 28px; place-items: center; }
.ft small { margin-left: auto; font-size: 12px; color: var(--text-3); }
.mn { display: flex; flex: 1; min-width: 0; flex-direction: column; margin: 8px 8px 8px 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.hd { display: flex; flex: none; height: 52px; align-items: center; gap: 6px; padding: 0 12px; border-bottom: 1px solid var(--line); }
.hd h1 { display: flex; flex: 1; min-width: 0; align-items: center; gap: 10px; margin: 0; padding-left: 6px; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.hd h1 svg.i { color: var(--text-2); }
.hd .ns { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; font-size: 13px; font-weight: 500; white-space: nowrap; }
.hd .ns svg.i { color: var(--text-3); }
.hd .find { display: flex; width: 200px; height: 32px; align-items: center; gap: 8px; padding: 0 6px 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 13px; color: var(--text-3); }
.hd .find span:first-of-type { flex: 1; }
.ib { display: grid; flex: none; width: 32px; height: 32px; place-items: center; border-radius: 8px; color: var(--text-2); }
.ib.s { width: 28px; height: 28px; border-radius: 6px; }
.ib.dim { opacity: 0.45; }
.ib.hov { background: var(--surface-3); color: var(--text-1); }
.ib.on { background: var(--accent-soft); color: var(--accent-strong); }
.kbd { display: inline-flex; min-width: 18px; height: 18px; align-items: center; justify-content: center; padding: 0 4px; border: 1px solid var(--line-strong); border-radius: 5px; background: var(--surface); font-size: 10.5px; font-weight: 500; line-height: 1; color: var(--text-3); }
.pgw { display: flex; flex: 1; min-height: 0; }
.list { display: flex; flex: 1; min-width: 0; flex-direction: column; overflow: hidden; }
.ptabs { display: flex; flex: none; height: 46px; align-items: flex-end; gap: 26px; padding: 0 24px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--text-2); white-space: nowrap; overflow: hidden; }
.ptabs span { padding-bottom: 12px; }
.ptabs span.on { font-weight: 500; color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }
.ptabs small { margin-left: 6px; color: var(--text-3); }
.tbar { display: flex; flex: none; height: 56px; align-items: center; gap: 8px; padding: 0 20px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.tbar .count { margin-right: 4px; font-size: 13px; color: var(--text-2); }
.chip { display: inline-flex; height: 28px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.chip i { width: 6px; height: 6px; border-radius: 50%; background: var(--d); }
.chip b { font-weight: 600; color: var(--text-1); }
.grow { flex: 1; }
.fld { display: inline-flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 13px; color: var(--text-3); white-space: nowrap; }
.th, .tr { display: grid; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); }
.th > *, .tr > * { min-width: 0; padding: 0 12px; }
.th { flex: none; height: 38px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.tr { flex: none; height: 50px; font-size: 13px; }
.tr.sel { background: var(--accent-soft); }
.tr b { display: block; overflow: hidden; font-weight: 400; white-space: nowrap; text-overflow: ellipsis; }
.tr small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.tr .m { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.tr .r { text-align: right; font-variant-numeric: tabular-nums; color: var(--text-2); }
.spill { display: inline-flex; height: 22px; align-items: center; gap: 4px; padding: 0 8px 0 6px; border-radius: 999px; background: color-mix(in srgb, var(--m) 12%, transparent); font-size: 12px; line-height: 16px; font-weight: 500; white-space: nowrap; }
.btn { display: inline-flex; height: 30px; align-items: center; justify-content: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 12.5px; font-weight: 500; white-space: nowrap; color: var(--text-1); }
.btn.sm { height: 26px; padding: 0 8px; font-size: 12px; border-radius: 7px; }
.btn.primary { border-color: transparent; background: var(--accent); color: #fff; }
.btn.ghost { border-color: transparent; background: none; color: var(--text-2); }
.ring { outline: 2px solid var(--accent); outline-offset: 1px; }

/* The detail panel, as the app draws it. */
.dp { display: flex; flex: none; flex-direction: column; overflow: hidden; border-left: 1px solid var(--line); }
.dph { display: flex; flex: none; align-items: flex-start; gap: 12px; padding: 16px 16px 12px 20px; }
.ktile { display: grid; flex: none; width: 36px; height: 36px; margin-top: 2px; place-items: center; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); color: var(--text-2); }
.dph .t { flex: 1; min-width: 0; }
.dph .t p { margin: 0; font-size: 12px; line-height: 16px; color: var(--text-3); }
.dph .t h2 { display: flex; align-items: center; gap: 4px; margin: 0; font-size: 17px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; }
.dph .t h2 svg.i { color: var(--text-3); }
.dph .acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 10px; }
.itabs { display: flex; flex: none; gap: 22px; padding: 0 20px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--text-2); white-space: nowrap; overflow: hidden; }
.itabs span { padding: 10px 0 11px; }
.itabs span.on { font-weight: 500; color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }

/* The Logs view. */
.lv { display: flex; flex: 1; min-height: 0; flex-direction: column; }
.ltb { display: flex; flex: none; height: 46px; align-items: center; gap: 6px; padding: 0 12px 0 16px; }
.sel2 { display: inline-flex; height: 30px; align-items: center; gap: 8px; padding: 0 8px 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 12.5px; color: var(--text-1); white-space: nowrap; }
.sel2 svg.i { margin-left: auto; color: var(--text-2); }
.srch { display: inline-flex; width: 120px; height: 30px; align-items: center; gap: 6px; padding: 0 8px; border: 1px solid var(--line); border-radius: 8px; font-size: 12.5px; color: var(--text-3); }
.lchips { display: flex; flex: none; align-items: center; gap: 6px; padding: 0 16px 8px; border-bottom: 1px solid var(--line); white-space: nowrap; overflow: hidden; }
.lchips .chip { height: 26px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
.lchips .sp { width: 1px; height: 16px; margin: 0 4px; background: var(--line-strong); }
.lines { flex: 1; min-height: 0; overflow: hidden; padding: 2px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; }
.ln { display: flex; gap: 10px; padding: 0 16px; white-space: nowrap; }
.ln .tm { color: var(--text-3); }
.ln .po { padding-left: 6px; box-shadow: inset 2px 0 0 var(--c); color: var(--text-2); }
.ln .lv1 { padding: 0 3px; border-radius: 3px; background: var(--surface-3); font-weight: 600; color: var(--text-1); }
.ln.err { background: color-mix(in srgb, var(--critical) 8%, transparent); }
.ln.err .lv1 { background: color-mix(in srgb, var(--critical) 14%, transparent); color: var(--critical-text); }
.ln.err .ms { color: var(--critical-text); }
.ln .ms { overflow: hidden; color: var(--text-1); text-overflow: clip; }
.ln .ms i { font-style: normal; color: var(--text-3); }

/* The dock: its bar, always there, and what it opens into. */
.dock { display: flex; flex: none; flex-direction: column; border-top: 1px solid var(--line); background: var(--surface-2); }
.dbar { display: flex; flex: none; height: 39px; align-items: center; gap: 4px; padding: 0 8px; }
.dock.open .dbar { border-bottom: 1px solid var(--line); }
.dbtn { display: inline-flex; flex: none; height: 28px; align-items: center; gap: 6px; padding: 0 8px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.dsep { width: 1px; height: 16px; flex: none; margin: 0 4px; background: var(--line); }
.dtabs { display: flex; min-width: 0; align-items: center; gap: 2px; overflow: hidden; }
.dt { position: relative; display: inline-flex; flex: none; height: 28px; align-items: center; gap: 6px; padding: 0 4px 0 10px; border-radius: 6px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.dt b { overflow: hidden; max-width: 192px; font-weight: 500; text-overflow: ellipsis; }
.dt .q { color: var(--text-3); }
.dt .st { font-style: italic; color: var(--text-3); }
.dt .x { display: grid; width: 20px; height: 20px; place-items: center; border-radius: 4px; color: var(--text-3); opacity: 0; }
.dt.on { background: var(--surface-3); color: var(--text-1); }
.dt.on .x, .dt.hov .x { opacity: 1; }
.dt.hov { background: color-mix(in srgb, var(--surface-3) 60%, transparent); color: var(--text-1); }
.dt.gone b { font-weight: 400; color: var(--text-3); }
.dt.gone svg.i { color: var(--text-3); }
.dt.ring { outline-offset: -1px; }
.dpan { position: relative; display: flex; flex: none; flex-direction: column; overflow: hidden; background: var(--surface); }
.dpan.term { background: var(--surface-2); }
.term .tl { padding: 0 16px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 20px; white-space: pre; color: var(--text-1); }
.term .tl:first-child { padding-top: 10px; }
.term .tl.q { color: var(--text-3); }
.term .tl .p { color: var(--accent-strong); }
.term .tl .c { display: inline-block; width: 8px; height: 16px; vertical-align: -3px; background: var(--accent); }
.irow { display: flex; flex: none; height: 40px; align-items: center; gap: 8px; padding: 0 8px 0 16px; border-bottom: 1px solid var(--line); }
.irow .itabs { flex: 1; min-width: 0; gap: 18px; padding: 0; border: 0; font-size: 12.5px; align-self: stretch; align-items: stretch; }
.irow .itabs span { display: flex; align-items: center; padding: 0; }
.dim > :not(.notice):not(.strip) { opacity: 0.45; }
.notice { position: absolute; left: 50%; top: 50%; display: flex; width: 460px; transform: translate(-50%, -50%); flex-direction: column; align-items: flex-start; gap: 6px; padding: 16px 18px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-pop); }
.notice b { font-size: 13.5px; font-weight: 600; }
.notice p { margin: 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); text-wrap: pretty; }
.notice .bs { display: flex; gap: 8px; margin-top: 6px; }
.strip { display: flex; flex: none; align-items: center; gap: 8px; padding: 7px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; line-height: 18px; color: var(--text-2); }
.strip svg.i { color: var(--text-3); }
.facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 14px 16px; }
.fc { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; }
.fc h4 { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.fc dl { display: grid; grid-template-columns: 82px minmax(0, 1fr); gap: 3px 10px; margin: 0; font-size: 12.5px; line-height: 18px; }
.fc dt { color: var(--text-3); }
.fc dd { overflow: hidden; margin: 0; white-space: nowrap; text-overflow: ellipsis; }
.fc .big { font-size: 20px; line-height: 28px; font-weight: 600; font-variant-numeric: tabular-nums; }
.fc .big small { margin-left: 6px; font-size: 12px; font-weight: 400; color: var(--text-3); }

/* Menus, tooltips, a pointer. */
.menu { width: 248px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-pop); }
.menu .mi { display: flex; height: 30px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 6px; font-size: 13px; }
.menu .mi svg.i { color: var(--text-3); }
.menu .mi .k { display: flex; gap: 2px; margin-left: auto; }
.menu .mi.hl { background: var(--accent); color: #fff; }
.menu .mi.hl svg.i { color: #fff; }
.menu .mi .sp0 { width: 16px; flex: none; }
.menu hr { height: 1px; margin: 4px 0; border: 0; background: var(--line); }
.tip { position: absolute; z-index: 5; padding: 5px 9px; border-radius: 7px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); white-space: nowrap; box-shadow: var(--shadow-pop); }
.tip .k { margin-left: 8px; opacity: 0.65; }
.ptr { position: absolute; z-index: 6; width: 18px; height: 22px; }

/* The Mac's menu bar, and a desktop to put windows on. */
.desk { position: relative; overflow: hidden; border-radius: 14px; background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, var(--app-bg)), var(--app-bg) 70%); box-shadow: inset 0 0 0 1px var(--line); }
.mbar { display: flex; height: 26px; align-items: center; gap: 18px; padding: 0 16px; background: color-mix(in srgb, var(--surface) 82%, transparent); font-size: 13px; color: var(--text-1); }
.mbar b { font-weight: 600; }
.mbar span.on { padding: 1px 8px; margin: 0 -8px; border-radius: 5px; background: var(--accent); color: #fff; }
.nmenu { position: absolute; z-index: 4; width: 280px; padding: 5px; border: 1px solid var(--line-strong); border-radius: 9px; background: var(--surface); box-shadow: var(--shadow-pop); }
.nmenu .mi { position: relative; display: flex; height: 24px; white-space: nowrap; align-items: center; padding: 0 10px 0 22px; border-radius: 5px; font-size: 13px; }
.nmenu .mi .k { margin-left: auto; color: var(--text-3); letter-spacing: 0.06em; }
.nmenu .mi.hl { background: var(--accent); color: #fff; }
.nmenu .mi.hl .k { color: #fff; }
.nmenu .mi .ck { position: absolute; left: 12px; }
.nmenu .mi.off { color: var(--text-3); }
.nmenu hr { height: 1px; margin: 5px 10px; border: 0; background: var(--line); }

/* A window that holds one tab: its band, then the tab. */
.band { display: flex; flex: none; height: 52px; align-items: center; gap: 10px; padding: 0 12px 0 92px; border-bottom: 1px solid var(--line); background: var(--surface-2); white-space: nowrap; }
.band b { font-size: 13.5px; font-weight: 600; }
.band .q { font-size: 12.5px; color: var(--text-3); }
.band svg.i { color: var(--text-2); }
.tw { flex-direction: column; background: var(--surface); }
`

// ─── The app's parts, drawn as built ───────────────────────────────────────────────────────

type Level = 'healthy' | 'warning' | 'critical' | 'neutral'
const LEVELS: Record<Level, [string, IconName]> = {
  healthy: ['good', 'circle-check'],
  warning: ['warn', 'triangle-alert'],
  critical: ['critical', 'circle-x'],
  neutral: ['neutral', 'circle'],
}
const pill = (level: Level, label: string) =>
  `<span class="spill" style="--m:var(--${LEVELS[level][0]});color:var(--${LEVELS[level][0]}-text)">${icon(LEVELS[level][1], 14, 2.25)}${escape(label)}</span>`

/** The sidebar as the app has it, cut where the window ends. */
const NAV: ([string, IconName] | string)[] = [
  ['Overview', 'layout-dashboard'],
  ['Workloads', 'boxes'],
  ['Pods', 'box'],
  ['Metrics', 'chart-spline'],
  ['Helm releases', 'ship-wheel'],
  'Cluster',
  ['Nodes', 'server'],
  ['Namespaces', 'layout-grid'],
  ['Events', 'activity'],
  'Network',
  ['Services', 'network'],
  ['Ingresses', 'globe'],
  ['Network Policies', 'shield-check'],
  ['Gateway API', 'link'],
  'Configuration',
  ['ConfigMaps', 'file-code-2'],
  ['Secrets', 'key-round'],
  'Storage',
  ['Volume Claims', 'database'],
]

interface Win {
  w: number
  h: number
  cluster: string
  version?: string
  /** The sidebar's current item. */
  nav: string
  title: string
  glyph: IconName
  ns?: string
  page: string
  panel?: { html: string; width: number }
  dock: string
  /** Not the frontmost window: its lights are grey. */
  back?: boolean
  extra?: string
}

function win(o: Win): string {
  const nav = NAV.map((n) =>
    typeof n === 'string'
      ? `<h3>${n}</h3>`
      : `<div class="n${n[0] === o.nav ? ' on' : ''}">${icon(n[1], 16)}${n[0]}</div>`,
  ).join('')
  return `<div class="w${o.back ? ' back' : ''}" style="width:${o.w}px;height:${o.h}px"><span class="lights"><i></i><i></i><i></i></span>
    <aside class="sb"><div class="sw"><span class="d"></span><span><b>${o.cluster}</b><small>Kubernetes ${o.version ?? 'v1.34.1'}</small></span>${icon('chevrons-up-down', 16)}</div>
      <nav class="nv">${nav}</nav>
      <div class="ft"><span>${icon('sun', 16)}</span><span>${icon('sparkles', 16)}</span><span>${icon('scroll-text', 16)}</span><small>v1.22.0</small></div></aside>
    <div class="mn"><header class="hd"><span class="ib">${icon('arrow-left', 16)}</span><span class="ib dim" style="margin-left:-6px">${icon('arrow-right', 16)}</span><h1>${icon(o.glyph, 16)}${o.title}</h1><span class="ns">${icon('layout-grid', 14)}${o.ns ?? 'All namespaces'}${icon('chevron-down', 14)}</span><span class="find">${icon('search', 14)}<span>Search…</span><span class="kbd">⌘</span><span class="kbd">K</span></span><span class="ib">${icon('plus', 16)}</span><span class="ib">${icon('history', 16)}</span><span class="ib">${icon('rotate-cw', 16)}</span></header>
      <div class="pgw"><div class="list">${o.page}</div>${o.panel ? `<div class="dp" style="width:${o.panel.width}px">${o.panel.html}</div>` : ''}</div>
      ${o.dock}</div>${o.extra ?? ''}</div>`
}

// The Deployments list, as in the docs' pictures.
const DEPLOYMENTS: [string, string, Level, string, string, string][] = [
  ['recommendations', 'shop', 'critical', 'Unavailable', '0/1', '30d'],
  ['checkout', 'shop', 'warning', 'Degraded', '1/3', '88d'],
  ['cart', 'shop', 'healthy', 'Ready', '2/2', '88d'],
  ['coredns', 'kube-system', 'healthy', 'Ready', '2/2', '2y70d'],
  ['grafana', 'monitoring', 'healthy', 'Ready', '1/1', '110d'],
  ['metrics-server', 'kube-system', 'healthy', 'Ready', '1/1', '2y69d'],
  ['prometheus', 'monitoring', 'healthy', 'Ready', '1/1', '110d'],
  ['storefront', 'shop', 'healthy', 'Ready', '3/3', '88d'],
]

function deployments(o: { sel?: string; narrow?: boolean } = {}): string {
  const cols = o.narrow
    ? '28px minmax(0,1.4fr) 150px 70px'
    : '28px minmax(0,1.3fr) 160px 80px minmax(0,1.6fr) 70px'
  return `<div class="ptabs"><span>All</span><span class="on">Deployments<small>8</small></span><span>StatefulSets<small>2</small></span><span>DaemonSets<small>2</small></span><span>Jobs<small>4</small></span><span>CronJobs<small>3</small></span></div>
    <div class="tbar"><span class="count">8 items</span><span class="chip" style="--d:var(--critical)"><i></i>Failing <b>1</b></span><span class="chip" style="--d:var(--warn)"><i></i>Warning <b>1</b></span><span class="chip" style="--d:var(--good)"><i></i>Healthy <b>6</b></span><span class="grow"></span>${o.narrow ? `<span class="fld">${icon('search', 14)}Filter deploy</span>` : `<span class="fld" style="width:240px">${icon('search', 14)}Filter deployments</span>`}</div>
    <div class="th" style="grid-template-columns:${cols}"><span></span><span>Name</span><span>Status</span><span>Ready</span>${o.narrow ? '' : '<span>Images</span><span class="r">Age</span>'}</div>
    ${DEPLOYMENTS.map(
      ([n, ns, l, s, r, a]) =>
        `<div class="tr${n === o.sel ? ' sel' : ''}" style="grid-template-columns:${cols}"><span></span><span><b>${n}</b><small>${ns}</small></span><span>${pill(l, s)}</span><span class="r" style="text-align:left">${r}</span>${o.narrow ? '' : `<span class="m">ghcr.io/acme/${n}:v2.3.1</span><span class="r">${a}</span>`}</div>`,
    ).join('')}`
}

const PODS: [string, string, Level, string, string, string][] = [
  ['cart-7d9f6c5b8-x2kqp', 'shop', 'healthy', 'Running', '1/1', '0'],
  ['cart-7d9f6c5b8-lq4ws', 'shop', 'healthy', 'Running', '1/1', '0'],
  ['checkout-7d9f6c5b8-hqnnn', 'shop', 'critical', 'CrashLoopBackOff', '0/1', '14'],
  ['checkout-7d9f6c5b8-pwkd2', 'shop', 'critical', 'CrashLoopBackOff', '0/1', '13'],
  ['checkout-7d9f6c5b8-x2kqp', 'shop', 'healthy', 'Running', '1/1', '2'],
  ['recommendations-mcbt654b8h-bpp5n', 'shop', 'critical', 'ImagePullBackOff', '0/1', '0'],
  ['storefront-6b8d9c7f5-75pbc', 'shop', 'healthy', 'Running', '1/1', '0'],
  ['storefront-6b8d9c7f5-7697d', 'shop', 'healthy', 'Running', '1/1', '0'],
]

function pods(): string {
  const cols = '28px minmax(0,1.8fr) 190px 70px 90px 70px'
  return `<div class="tbar"><span class="count">23 items</span><span class="chip" style="--d:var(--critical)"><i></i>Failing <b>3</b></span><span class="chip" style="--d:var(--good)"><i></i>Healthy <b>20</b></span><span class="grow"></span><span class="fld" style="width:240px">${icon('search', 14)}Filter pods</span></div>
    <div class="th" style="grid-template-columns:${cols}"><span></span><span>Name</span><span>Status</span><span>Ready</span><span class="r">Restarts</span><span class="r">Age</span></div>
    ${PODS.map(
      ([n, ns, l, s, r, x]) =>
        `<div class="tr" style="grid-template-columns:${cols}"><span></span><span><b>${n}</b><small>${ns}</small></span><span>${pill(l, s)}</span><span class="r" style="text-align:left">${r}</span><span class="r">${x}</span><span class="r">2h</span></div>`,
    ).join('')}`
}

// The storefront Deployment's logs, three pods, as the Logs tab shows them.
const POD_COLORS: Record<string, string> = {
  '75pbc': 'var(--series-1)',
  '7697d': 'var(--series-2)',
  ttlhm: 'var(--series-3)',
}
const LINES: [string, string, 'INFO' | 'ERROR', string][] = [
  [
    '14:19:49',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products/sku-1042 <i>status=</i>200 <i>duration=</i>12ms',
  ],
  [
    '14:19:49',
    '75pbc',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/static/app.8f3c1d.js <i>status=</i>200 <i>duration=</i>3ms',
  ],
  [
    '14:19:49',
    'ttlhm',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products/sku-2231 <i>status=</i>200 <i>duration=</i>9ms',
  ],
  [
    '14:19:50',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>304 <i>duration=</i>1ms',
  ],
  [
    '14:19:50',
    'ttlhm',
    'ERROR',
    'upstream request failed <i>upstream=</i>checkout.shop.svc.cluster.local:8080 <i>error=</i>connection refused',
  ],
  [
    '14:19:52',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products?page=2 <i>status=</i>200 <i>duration=</i>14ms',
  ],
  [
    '14:19:52',
    '75pbc',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products <i>status=</i>200 <i>duration=</i>11ms',
  ],
  [
    '14:19:52',
    'ttlhm',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/session <i>status=</i>200 <i>duration=</i>4ms',
  ],
  [
    '14:19:53',
    '7697d',
    'ERROR',
    'upstream request failed <i>upstream=</i>checkout.shop.svc.cluster.local:8080 <i>error=</i>connection refused',
  ],
  [
    '14:19:53',
    '75pbc',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>200 <i>duration=</i>1ms',
  ],
  [
    '14:19:53',
    'ttlhm',
    'INFO',
    'request completed <i>method=</i>POST <i>path=</i>/api/cart/items <i>status=</i>201 <i>duration=</i>22ms',
  ],
  [
    '14:19:54',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products?page=2 <i>status=</i>200 <i>duration=</i>13ms',
  ],
  [
    '14:19:54',
    '75pbc',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/static/app.8f3c1d.js <i>status=</i>200 <i>duration=</i>2ms',
  ],
  [
    '14:19:56',
    'ttlhm',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>8ms',
  ],
  [
    '14:19:57',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/products <i>status=</i>200 <i>duration=</i>10ms',
  ],
  [
    '14:19:57',
    '75pbc',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/session <i>status=</i>200 <i>duration=</i>3ms',
  ],
  [
    '14:19:58',
    'ttlhm',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/recommendations <i>status=</i>200 <i>duration=</i>31ms',
  ],
  [
    '14:20:00',
    '7697d',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart/items <i>status=</i>200 <i>duration=</i>7ms',
  ],
]

// One pod's own logs: no pod column, no pods' chips.
const POD_LINES: [string, 'INFO' | 'ERROR', string][] = [
  ['14:31:02', 'INFO', 'cart updated <i>session=</i>9f1c… <i>items=</i>3 <i>duration=</i>6ms'],
  [
    '14:31:04',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>4ms',
  ],
  [
    '14:31:05',
    'INFO',
    'request completed <i>method=</i>POST <i>path=</i>/api/cart/items <i>status=</i>201 <i>duration=</i>18ms',
  ],
  [
    '14:31:09',
    'ERROR',
    'redis: connection pool timeout <i>addr=</i>redis.shop.svc:6379 <i>waited=</i>2s',
  ],
  ['14:31:09', 'INFO', 'retrying <i>attempt=</i>2 <i>backoff=</i>200ms'],
  [
    '14:31:10',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>212ms',
  ],
  [
    '14:31:14',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>200 <i>duration=</i>1ms',
  ],
  [
    '14:31:18',
    'INFO',
    'request completed <i>method=</i>DELETE <i>path=</i>/api/cart/items/42 <i>status=</i>204 <i>duration=</i>9ms',
  ],
  [
    '14:31:21',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>5ms',
  ],
  ['14:31:22', 'INFO', 'cart updated <i>session=</i>a03e… <i>items=</i>1 <i>duration=</i>5ms'],
  [
    '14:31:25',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>200 <i>duration=</i>1ms',
  ],
  [
    '14:31:30',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>4ms',
  ],
  [
    '14:31:31',
    'INFO',
    'request completed <i>method=</i>POST <i>path=</i>/api/checkout <i>status=</i>202 <i>duration=</i>41ms',
  ],
  [
    '14:31:33',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>4ms',
  ],
  [
    '14:31:36',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>200 <i>duration=</i>1ms',
  ],
  ['14:31:40', 'INFO', 'cart updated <i>session=</i>7be2… <i>items=</i>4 <i>duration=</i>7ms'],
  [
    '14:31:41',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/api/cart <i>status=</i>200 <i>duration=</i>5ms',
  ],
  [
    '14:31:45',
    'INFO',
    'request completed <i>method=</i>GET <i>path=</i>/healthz <i>status=</i>200 <i>duration=</i>1ms',
  ],
]

/** The Logs view: its toolbar, its chips, its lines. */
function logs(o: { n?: number; pod?: boolean; container?: string } = {}): string {
  const tools = `<span class="ib s on">${icon('play', 15)}</span><span class="ib s">${icon('history', 15)}</span><span class="ib s on">${icon('clock', 15)}</span><span class="ib s">${icon('wrap-text', 15)}</span><span class="ib s">${icon('copy', 15)}</span><span class="ib s">${icon('download', 15)}</span>`
  const lines = o.pod
    ? POD_LINES.slice(0, o.n ?? POD_LINES.length)
        .map(
          ([t, l, m]) =>
            `<div class="ln${l === 'ERROR' ? ' err' : ''}"><span class="tm">${t}</span><span class="lv1">${l}</span><span class="ms">${m}</span></div>`,
        )
        .join('')
    : LINES.slice(0, o.n ?? LINES.length)
        .map(
          ([t, p, l, m]) =>
            `<div class="ln${l === 'ERROR' ? ' err' : ''}"><span class="tm">${t}</span><span class="po" style="--c:${POD_COLORS[p]}">${p}</span><span class="lv1">${l}</span><span class="ms">${m}</span></div>`,
        )
        .join('')
  const chips = o.pod
    ? `<span class="chip" style="--d:var(--critical)"><i></i>Errors 1</span><span class="chip" style="--d:var(--warn)"><i></i>Warnings 0</span>`
    : `<span class="chip" style="--d:var(--critical)"><i></i>Errors 10</span><span class="chip" style="--d:var(--warn)"><i></i>Warnings 44</span><span class="sp"></span>${Object.entries(
        POD_COLORS,
      )
        .map(([p, c]) => `<span class="chip" style="--d:${c}"><i></i>${p} 500</span>`)
        .join('')}`
  return `<div class="lv"><div class="ltb"><span class="sel2" style="width:${o.pod ? 110 : 130}px">${o.container ?? 'app'}${icon('chevron-down', 14)}</span><span class="sel2" style="width:150px">Last 500 lines${icon('chevron-down', 14)}</span><span class="srch">${icon('search', 13)}Search</span><span class="grow"></span>${tools}</div><div class="lchips">${chips}</div><div class="lines">${lines}</div></div>`
}

const DEPLOY_TABS = ['Overview', 'Pods', 'Logs', 'Metrics', 'Map', 'Events', 'Audit', 'YAML']
const POD_TABS = ['Overview', 'Logs', 'Shell', 'Metrics', 'Map', 'Events', 'Audit', 'YAML']

/** The detail panel's header and tabs, with the new button before Expand panel. */
function panelHead(o: {
  kind: string
  glyph: IconName
  ns: string
  age: string
  name: string
  pill: string
  acts: string
  tabs: string[]
  on: string
  keep?: 'idle' | 'hover' | 'kept' | 'ring'
}): string {
  const keep =
    o.keep === undefined
      ? ''
      : `<span class="ib${o.keep === 'hover' ? ' hov' : o.keep === 'kept' ? ' on' : ''}${o.keep === 'ring' ? ' ring' : ''}" style="margin-top:2px">${icon('panel-bottom', 16)}</span>`
  return `<div class="dph"><span class="ktile">${icon(o.glyph, 18)}</span><div class="t"><p>${o.kind} · ${o.ns} · ${o.age} old</p><h2>${o.name}${icon('copy', 14)}</h2><div class="acts">${o.pill}${o.acts}</div></div>${keep}<span class="ib" style="margin-top:2px">${icon('maximize-2', 16)}</span><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div>
    <div class="itabs">${o.tabs.map((t) => `<span${t === o.on ? ' class="on"' : ''}>${t}</span>`).join('')}</div>`
}

const STOREFRONT_ACTS = `<span class="btn">${icon('arrow-up-down', 14)}Scale</span><span class="btn">${icon('rotate-cw', 14)}Restart</span><span class="btn" style="width:30px;padding:0">${icon('ellipsis', 14)}</span>`

// ─── The dock ──────────────────────────────────────────────────────────────────────────────

interface Tab {
  glyph: IconName
  name: string
  /** Quiet after the name: a terminal's namespace, an object's tab, another cluster. */
  quiet?: string
  /** Quiet and in italics: exited, deleted, can't reach. */
  state?: string
  on?: boolean
  hover?: boolean
  gone?: boolean
  ring?: boolean
}

const tab = (t: Tab) =>
  `<span class="dt${t.on ? ' on' : ''}${t.hover ? ' hov' : ''}${t.gone ? ' gone' : ''}${t.ring ? ' ring' : ''}">${icon(t.glyph, 14)}<b>${escape(t.name)}</b>${t.quiet ? `<span class="q">${escape(t.quiet)}</span>` : ''}${t.state ? `<span class="st">${t.state}</span>` : ''}<span class="x">${icon('x', 12)}</span></span>`

/** The dock's bar, and what it holds when open. */
function dock(
  tabs: Tab[],
  open?: { html: string; height: number; term?: boolean },
  extra = '',
): string {
  const right = open
    ? `<span class="ib s">${icon('maximize-2', 15)}</span><span class="ib s">${icon('chevron-down', 16)}</span>`
    : `<span class="kbd" style="margin-right:4px">⌃\`</span><span class="ib s">${icon('chevron-up', 16)}</span>`
  return `<section class="dock${open ? ' open' : ''}"><div class="dbar"><span class="dbtn">${icon('square-terminal', 14)}Terminal</span>${tabs.length ? '<span class="dsep"></span>' : ''}<div class="dtabs">${tabs.map(tab).join('')}</div><span class="ib s">${icon('plus', 16)}</span><span class="grow"></span>${right}</div>${
    open
      ? `<div class="dpan${open.term ? ' term' : ''}" style="height:${open.height}px">${open.html}</div>`
      : ''
  }${extra}</section>`
}

/** An object kept in the dock: its tabs and what can be done with it on one row, then the tab. */
function kept(o: {
  tabs: string[]
  on: string
  pill: string
  acts?: string
  body: string
  /** In a window of one tab: no panel to open it in. */
  alone?: boolean
}): string {
  return `<div class="irow"><div class="itabs">${o.tabs.map((t) => `<span${t === o.on ? ' class="on"' : ''}>${t}</span>`).join('')}</div>${o.pill}${o.acts ?? ''}${o.alone ? '' : `<span class="dsep"></span><span class="ib s">${icon('arrow-up-right', 15)}</span>`}</div>${o.body}`
}

const STOREFRONT_KEPT = (body: string, on = 'Logs') =>
  kept({
    tabs: DEPLOY_TABS,
    on,
    pill: pill('healthy', 'Ready'),
    acts: `<span class="btn sm">${icon('arrow-up-down', 13)}Scale</span><span class="btn sm">${icon('rotate-cw', 13)}Restart</span><span class="btn sm" style="width:26px;padding:0">${icon('ellipsis', 13)}</span>`,
    body,
  })

const TERMINAL = `<div class="tl q">› kubectl points at production in this terminal. It’s v1.34.12, to match the cluster.</div><div class="tl"><span class="p">~ ›</span> kubectl get deployments -n shop</div><div class="tl">NAME              READY   UP-TO-DATE   AVAILABLE   AGE</div><div class="tl">cart              2/2     2            2           88d</div><div class="tl">checkout          1/3     3            1           88d</div><div class="tl">recommendations   0/1     1            0           30d</div><div class="tl">storefront        3/3     3            3           88d</div><div class="tl"><span class="p">~ ›</span> <span class="c"></span></div>`

const T_PROD: Tab = { glyph: 'square-terminal', name: 'production' }
const T_STORE: Tab = { glyph: 'layers', name: 'storefront', quiet: 'Logs' }
const T_CART: Tab = { glyph: 'box', name: 'cart-7d9f6c5b8-x2kqp' }

const pointer = (x: number, y: number) =>
  `<svg class="ptr" style="left:${x}px;top:${y}px" viewBox="0 0 18 22"><path d="M1.5 1.5 L1.5 17 L5.6 13.3 L8.4 19.8 L11 18.7 L8.3 12.4 L13.8 12.2 Z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`

// ─── Frame 1: keeping an object open below ─────────────────────────────────────────────────

function keepFrame(): string {
  const W = 1440
  const H = 900
  const panelW = 600
  const head = (keep: 'hover' | 'kept') =>
    panelHead({
      kind: 'Deployment',
      glyph: 'layers',
      ns: 'shop',
      age: '88d',
      name: 'storefront',
      pill: pill('healthy', 'Ready'),
      acts: STOREFRONT_ACTS,
      tabs: DEPLOY_TABS,
      on: 'Logs',
      keep,
    })
  // The panel's top right: Keep open below, Expand panel, Close. Under the pointer, its tooltip.
  const keepX = W - 8 - 16 - 32 * 3
  const before = win({
    w: W,
    h: H,
    cluster: 'production',
    nav: 'Workloads',
    title: 'Deployments',
    glyph: 'layers',
    page: deployments({ sel: 'storefront', narrow: true }),
    panel: { width: panelW, html: `${head('hover')}${logs()}` },
    dock: dock([T_PROD]),
    extra: `<span class="tip" style="left:${keepX - 128}px;top:104px">Keep open below</span>${pointer(keepX + 14, 82)}`,
  })
  const after = win({
    w: W,
    h: H,
    cluster: 'production',
    nav: 'Pods',
    title: 'Pods',
    glyph: 'box',
    page: pods(),
    dock: dock([T_PROD, { ...T_STORE, on: true }], {
      height: 288,
      html: STOREFRONT_KEPT(logs({ n: 9 })),
    }),
  })
  return `<section class="blk"><h2>Keep it open below<i>the detail panel’s new button; the object stays while you move around</i></h2>
    <p class="cap">storefront open in the panel on its Logs: the new button before Expand panel, under the pointer</p>${before}
    <p class="cap">Then on Pods: storefront is a tab in the dock, open on its Logs, still following, with the terminal beside it</p>${after}
    <ul class="rules">
      <li><b>One button, in the panel’s top right</b>, before Expand panel: <b>Keep open below</b> (Lucide’s panel-bottom), its tooltip saying so. It keeps the object, not one of its tabs: the dock’s tab opens on the tab the panel was showing, so pressed on Logs it’s the logs that stay. The same button is on the object’s expanded panel, and “Keep open below” is in the command palette while an object is open. <b>Logs aren’t a kind of their own</b>: a pod’s or a Deployment’s logs are its Logs tab, kept.</li>
      <li><b>Pressed, it adds a tab after the last one and shows it</b>, opening the dock at the height it had (288 px at first). The panel stays as it was; the person closes it if they like. <b>An object is kept once per window</b>: pressed again, or on an object already kept, the button shows its tab and is drawn pressed (the accent’s soft fill), its tooltip “Show below”. Focus stays on the button.</li>
      <li><b>A kept object keeps its own state</b> from then on: the tab it’s on, and on Logs its container, “Last 500 lines”, search, Follow, Timestamps, Wrap. It reads its cluster as the panel does, whatever page or namespace the window moves to, and stops reading only when its tab is closed. <b>Not on a phone, and not on a server’s web page</b>: there is no dock there today, and the button isn’t drawn.</li>
    </ul></section>`
}

// ─── Frame 2: the bar and a kept object ────────────────────────────────────────────────────

function tabsFrame(): string {
  const MW = 1180
  const strip = (
    tabs: Tab[],
    extra = '',
    open?: { html: string; height: number; term?: boolean },
  ) =>
    `<div class="mn" style="width:${MW}px;margin:0;flex:none;position:relative;overflow:visible">${dock(tabs, open)}${extra}</div>`
  const mixed: Tab[] = [
    T_PROD,
    { ...T_STORE, hover: true },
    T_CART,
    { glyph: 'square-terminal', name: 'migrations', quiet: 'shop' },
    { glyph: 'box', name: 'recommendations-…-bpp5n' },
  ]
  const tip = `<span class="tip" style="left:150px;top:44px">Deployment storefront in shop, on production · Logs</span>`
  const other = strip([
    T_PROD,
    T_STORE,
    { glyph: 'layers', name: 'storefront', quiet: 'staging' },
    { glyph: 'square-terminal', name: 'staging' },
  ])
  const objMenu = `<div class="menu"><div class="mi">${icon('arrow-up-right', 16)}Open in the panel</div><div class="mi hl">${icon('app-window', 16)}Move to a new window</div><hr><div class="mi">${icon('x', 16)}Close<span class="k"><span class="kbd">⌘</span><span class="kbd">W</span></span></div><div class="mi"><span class="sp0"></span>Close the others</div></div>`
  const termMenu = `<div class="menu"><div class="mi">${icon('pencil', 16)}Rename…<span class="k"><span class="kbd">F2</span></span></div><div class="mi">${icon('plus', 16)}New terminal like it</div><div class="mi">${icon('app-window', 16)}Move to a new window</div><hr><div class="mi">${icon('x', 16)}Close<span class="k"><span class="kbd">⌘</span><span class="kbd">W</span></span></div><div class="mi"><span class="sp0"></span>Close the others</div></div>`
  const overview = `<div class="facts"><div class="fc"><h4>Replicas</h4><div class="big">3/3<small>ready, up to date</small></div></div><div class="fc"><h4>Strategy</h4><dl><dt>Type</dt><dd>RollingUpdate</dd><dt>Max surge</dt><dd>25%</dd><dt>Unavailable</dt><dd>25%</dd></dl></div><div class="fc"><h4>Image</h4><dl><dt>app</dt><dd>ghcr.io/acme/storefront:v3.8.2</dd><dt>sidecar</dt><dd>envoyproxy/envoy:v1.31</dd></dl></div><div class="fc"><h4>Conditions</h4><dl><dt>Available</dt><dd>True · 88d</dd><dt>Progressing</dt><dd>True · 2h</dd></dl></div></div>`
  return `<section class="blk"><h2>The bar, with more than terminals<i>a terminal and a kept object side by side, in the order they came</i></h2>
    <p class="cap">Closed, five tabs: two terminals and three objects (a Deployment kept on Logs, two pods, the longer name middle-cut at 192 px); the pointer on storefront</p>${strip(mixed, tip)}
    <div style="height:20px"></div>
    <p class="cap">A tab from another cluster says which, quietly, after its name; a terminal is named by its cluster already</p>${other}
    <p class="cap">Open on storefront, at the dock’s first height (288 px): its Overview, wide and short</p>${strip([T_PROD, { ...T_STORE, quiet: '', on: true }, T_CART], '', { height: 288, html: STOREFRONT_KEPT(overview, 'Overview') })}
    <p class="cap">At 1024 the dock is 772 px: the row keeps the tabs and the status, its actions go into ⋯</p><div class="mn" style="width:772px;margin:0;flex:none">${dock([T_PROD, { ...T_STORE, on: true }, T_CART], { height: 240, html: kept({ tabs: DEPLOY_TABS, on: 'Logs', pill: pill('healthy', 'Ready'), acts: `<span class="btn sm" style="width:26px;padding:0">${icon('ellipsis', 13)}</span>`, body: logs({ n: 7 }) }) })}</div>
    <div class="row2"><div class="stack"><p class="cap">A kept object’s menu (right click)</p>${objMenu}</div><div class="stack"><p class="cap">A terminal’s menu: today’s, and Move to a new window</p>${termMenu}</div></div>
    <ul class="rules">
      <li><b>A tab says what it holds</b>: a terminal its cluster (and namespace), as today; a kept object its kind’s icon (the panel’s), its name, middle-cut past 192 px, and the tab it’s on, quiet, unless that’s Overview. <b>Another cluster</b> is named quietly after the name, only when it isn’t the window’s. The tooltip says it whole: kind, name, namespace, cluster, tab. A screen reader hears the same.</li>
      <li><b>One bar for both kinds</b>, in the order they were opened. <b>Terminal</b>, at its left, always means a terminal: it shows the last terminal, or opens one if there’s none, as <kbd>⌃\`</kbd> does; with a terminal shown, both hide the dock. The chevron at the right shows and hides the dock on whichever tab was last shown. <b>+</b> is still a new terminal: objects come from their panel. Many tabs scroll sideways, the shown one kept in view, as today. <b>No “dock” where a person reads it</b> (a Mac’s “Keep in Dock” is the system’s): Terminal’s tooltip is “Show the terminal (⌃\`)” with one kept, “Open a terminal (⌃\`)” without; the chevron “Show the tabs below” / “Hide the tabs below”; maximize “Maximize the tabs below” / “Restore the tabs below”; the section’s label “Tabs below”, and its list of tabs, today “Terminals”, the same.</li>
      <li><b>A kept object’s row</b> replaces the panel’s header, which the tab already names: its tabs on the left, then its status, its actions (the panel’s, smaller; under 900 px of dock they go into ⋯), and <b>Open in the panel</b> (↗), which opens it in this window’s panel and keeps the tab. Under it the tab, at the dock’s width and height, scrolling as in the panel; maximized, the dock gives it 85% of the height. <b>⌘W</b> closes the shown tab while focus is in the dock, as it does for a terminal today; elsewhere it closes the window.</li>
    </ul></section>`
}

// ─── Frame 3: when what's kept goes away, or can't be reached, or Lumovi restarts ──────────

function statesFrame(): string {
  const MW = 1180
  const box = (tabs: Tab[], html: string, height = 288, term = false) =>
    `<div class="mn" style="width:${MW}px;margin:0;flex:none">${dock(tabs, { html, height, term })}</div>`
  const deleted = box(
    [T_PROD, T_STORE, { ...T_CART, on: true, gone: true, state: 'deleted', quiet: 'Logs' }],
    `<div class="dim" style="position:relative;display:flex;flex-direction:column;height:100%">${kept({ tabs: POD_TABS, on: 'Logs', pill: pill('neutral', 'Deleted'), body: logs({ pod: true, n: 9 }) })}<div class="notice"><b>Pod cart-7d9f6c5b8-x2kqp was deleted at 14:32.</b><p>Its lines up to then stay here until you close this tab.</p><p>It belonged to the Deployment cart, which is still there.</p><div class="bs"><span class="btn primary">Keep cart open instead</span><span class="btn">Close this tab</span></div></div></div>`,
  )
  const away = box(
    [
      T_PROD,
      { ...T_STORE, on: true, quiet: 'Logs · staging', state: 'unreachable' },
      { glyph: 'square-terminal', name: 'staging' },
    ],
    `<div class="strip">${icon('wifi-off', 14)}<span>Can’t reach staging since 14:30. Lumovi tries again on its own, and the lines go on from the last one here.</span></div>${kept({ tabs: DEPLOY_TABS, on: 'Logs', pill: pill('healthy', 'Ready'), body: logs({ n: 8 }) })}`,
  )
  const restarted = box(
    [{ ...T_PROD, on: true, state: 'ended' }, T_STORE, { ...T_CART, quiet: '' }],
    `<div class="dim" style="position:relative;height:100%">${TERMINAL.replace('<span class="c"></span>', '')}<div class="notice"><b>The shell ended when Lumovi quit.</b><p>A terminal’s shell can’t outlive Lumovi. Its name, cluster and namespace are kept for a new one.</p><div class="bs"><span class="btn primary">${icon('rotate-cw', 14)}Start a new shell</span></div></div></div>`,
    240,
    true,
  )
  return `<section class="blk"><h2>When what’s kept goes, can’t be reached, or Lumovi restarts<i>the tab stays, and says so; nothing starts by itself</i></h2>
    <p class="cap">A kept pod deleted (a rollout replaced it): its last lines stay, dimmed, under a notice that offers what owned it</p>${deleted}
    <p class="cap">A kept object on a cluster Lumovi can’t reach: what was read stays, a strip says since when; the lines go on when it’s back</p>${away}
    <p class="cap">After a restart: the windows, their pages and their tabs come back; a terminal comes back ended, with Start a new shell</p>${restarted}
    <ul class="rules">
      <li><b>Deleted</b>: the tab’s name goes quiet with “deleted” after it, its icon quiet. What it showed stays, at 45%, under the terminal’s notice card: when it was deleted, that its lines (or its last state) stay until the tab closes, and, when Lumovi knows what owned it, that owner, with <b>Keep cart open instead</b> (replaces the tab with the owner, on the same tab) and <b>Close this tab</b>. A pod is the common case: every rollout replaces them, so a kept pod that ends this way is normal, not an error. No red.</li>
      <li><b>Can’t reach its cluster</b>: “unreachable” after the name, Lumovi’s word for such a cluster. The tab keeps what it read; a strip under the row says since when and that Lumovi tries again by itself, as the cluster’s pages do. When it’s back the strip goes and the logs carry on from the last line shown, nothing missed and nothing twice, where the cluster still has them. A terminal doesn’t depend on the cluster (it’s a shell on this computer), so it has no such state.</li>
      <li><b>After a restart</b> every window comes back as it was: its screen, place and size (a screen that’s gone, a monitor unplugged, gives its place to the main screen, the window kept whole on it); its cluster and page (with its panel, which the page’s address holds); its dock open or closed, its height, its tabs and the one shown. A kept object reads again as if just opened, with its own choices, so its logs show their last 500 lines, which covers the time Lumovi was closed; no note is needed, since each line has its time. <b>Only where nothing is asked</b>: a kept object on a cluster that signs in through a program (a cloud’s sign-in, a browser that opens) doesn’t read at launch. Its tab waits, quiet with “not read yet”, until someone shows it (a click, or the keys) or opens its cluster in that window; then it reads, asking what the cluster’s pages would. If it was the shown tab when Lumovi quit, it comes back shown but waiting, with the notice card “Not read yet” and <b>Read it now</b>, as a window of one tab does: being in view at launch isn’t asking. Nothing opens a browser or a prompt by itself. <b>A terminal comes back ended</b>, never as a new shell by itself (a shell runs the person’s profile, which Lumovi shouldn’t start unasked): its tab with “ended”, its old lines dimmed, and <b>Start a new shell</b> (“Restart” alone would read as restarting Lumovi).</li>
    </ul></section>`
}

// ─── Frame 4: more than one window ─────────────────────────────────────────────────────────

function windowsFrame(): string {
  const W2 = 1120
  const H2 = 700
  const prod = win({
    w: W2,
    h: H2,
    cluster: 'production',
    nav: 'Workloads',
    title: 'Deployments',
    glyph: 'layers',
    page: deployments({ narrow: true }),
    dock: dock([T_PROD, T_STORE], undefined),
    back: true,
  })
  const staging = win({
    w: W2,
    h: H2,
    cluster: 'staging',
    version: 'v1.33.4',
    nav: 'Pods',
    title: 'Pods',
    glyph: 'box',
    ns: 'shop',
    page: pods(),
    dock: dock([]),
  })
  const fileMenu = `<div class="nmenu" style="left:118px;top:30px"><div class="mi hl">New Window<span class="k">⇧⌘N</span></div><div class="mi">Create…<span class="k">⌘N</span></div><hr><div class="mi">Close Window<span class="k">⌘W</span></div></div>`
  const windowMenu = `<div class="nmenu" style="left:388px;top:30px;width:400px"><div class="mi">Minimize<span class="k">⌘M</span></div><div class="mi">Zoom</div><hr><div class="mi">Bring All to Front</div><hr><div class="mi">Deployments · production — Lumovi</div><div class="mi"><span class="ck">✓</span>Pods · staging — Lumovi</div><div class="mi">cart-7d9f6c5b8-x2kqp, Logs · production — Lumovi</div></div>`
  const mbar = (on: string) =>
    `<div class="mbar"><b>Lumovi</b>${['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((m) => `<span${m === on ? ' class="on"' : ''}>${m}</span>`).join('')}</div>`
  const two = `<div class="desk" style="width:2336px;height:790px">${mbar('')}<div style="position:absolute;left:36px;top:58px">${prod}</div><div style="position:absolute;left:1190px;top:70px">${staging}</div></div>`
  // A tab moved out: the pod's logs in a window of their own.
  const tw = `<div class="w tw" style="width:980px;height:560px"><span class="lights" style="top:20px"><i></i><i></i><i></i></span><div class="band">${icon('box', 16)}<b>cart-7d9f6c5b8-x2kqp</b><span class="q">Logs · shop · production</span><span class="grow"></span><span class="btn sm">${icon('panel-bottom', 13)}Put back below</span></div>${kept({ tabs: POD_TABS, on: 'Logs', pill: pill('healthy', 'Running'), acts: `<span class="btn sm">${icon('square-terminal', 13)}Shell</span><span class="btn sm">${icon('rotate-cw', 13)}Restart</span><span class="btn sm" style="width:26px;padding:0">${icon('ellipsis', 13)}</span>`, body: logs({ pod: true }), alone: true })}</div>`
  // Opened again after a restart, on a cluster that signs in through a program: it waits for a press.
  const band = `<span class="lights" style="top:20px"><i></i><i></i><i></i></span><div class="band">${icon('box', 16)}<b>cart-7d9f6c5b8-x2kqp</b><span class="q">Logs · shop · production</span><span class="grow"></span><span class="btn sm">${icon('panel-bottom', 13)}Put back below</span></div>`
  const waiting = `<div class="w tw" style="width:980px;height:560px">${band}${kept({ tabs: POD_TABS, on: 'Logs', pill: '', body: '<div style="position:relative;flex:1"><div class="notice"><b>Not read yet</b><p>production signs in through kubelogin, so Lumovi reads this when you ask.</p><div class="bs"><span class="btn primary">Read it now</span></div></div></div>', alone: true })}</div>`
  const menus = `<div class="desk" style="width:760px;height:236px">${mbar('File')}${fileMenu}</div><div class="desk" style="width:760px;height:236px">${mbar('Window')}${windowMenu.replace('left:388px', 'left:236px')}</div>`
  return `<section class="blk"><h2>More than one window<i>File → New Window; a tab into a window of its own</i></h2>
    <div class="row2"><div class="stack"><p class="cap">The File menu: New Window first, ⇧⌘N (Ctrl+Shift+N on Windows and Linux, in the app menu’s File)</p>${menus.split('</div><div class="desk"')[0]}</div></div><div class="stack"><p class="cap">The Window menu lists each window by its title, which says its page and its cluster</p><div class="desk"${menus.split('</div><div class="desk"')[1]}</div></div>
    <p class="cap">Two windows on two clusters, each its own: production with its dock and its kept storefront, staging in front on its own page and namespace</p>${two}
    <div class="row2"><div class="stack"><p class="cap">A kept pod moved to a window of its own (its tab’s menu, Move to a new window): only the tab, filling the window</p>${tw}</div><div class="stack"><p class="cap">The same window opened again after a restart, its cluster signing in through a program: it waits for Read it now</p>${waiting}</div></div>
    <ul class="rules">
      <li><b>New Window</b> is File’s first item, <b>⇧⌘N</b> (Ctrl+Shift+N): ⌘N stays Create…, and in a terminal ⌘N stays a new terminal. Also in the command palette. <b>It opens on the start screen</b>, the list of clusters, as Lumovi does when it starts: a second window is mostly for another cluster, and the same one is a click away there. It opens the size of the window it was asked from, 24 px down and right of it. Each window is its own: cluster, page, namespace, panel, history, dock.</li>
      <li><b>The title</b> is the one pages already set, “Deployments · production — Lumovi”, so the Window menu, the Mac’s window switcher and the Windows taskbar tell two clusters apart. Inside, the sidebar’s switcher names the cluster, as today. A window of one tab is titled by the tab: “cart-7d9f6c5b8-x2kqp, Logs · production — Lumovi”, a terminal “migrations · production — Lumovi”. On Windows and Linux the app menu’s Window has the same list.</li>
      <li><b>Move to a new window</b>, in every tab’s menu, opens a window holding that tab alone, filling it, under a 52 px band that names it (icon, name, then its tab, namespace and cluster, quiet) with <b>Put back below</b>, which returns it to the dock of the window it came from (or, if that one’s closed, the frontmost window on its cluster). It has no ↗ <b>Open in the panel</b>: a window of one tab has no panel, and Put back below is the way back to Lumovi’s pages. If no window is left on its cluster, the tab goes below the frontmost window, naming its cluster as a tab from another cluster does; if no other window is left at all, this window becomes Lumovi’s, the usual size, centred where it was, on the tab’s cluster with the tab below. Opened again after a restart on a cluster that signs in through a program, it waits: its tabs, no status or actions, and the notice card “Not read yet” with <b>Read it now</b>, focused. Closing the window closes the tab, as ⌘W on the tab does today. It opens 980 × 560 (no smaller than 560 × 360), over the window it came from. Dragging a tab out is left for later: the menu is the way.</li>
    </ul></section>`
}

// ─── Frame 5: on the start screen, a cluster that signs in through a program ───────────────

/** Drawn on the start screen's own styles: the list is the clusters page's, as it is. */
const SIGNIN_CSS = `
body { overflow: visible; }
.on-start { position: relative; flex: none; width: 720px; }
.tip { position: absolute; z-index: 5; padding: 5px 9px; border-radius: 7px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); white-space: nowrap; box-shadow: var(--shadow-pop); }
.ptr { position: absolute; z-index: 6; width: 18px; height: 22px; }
.swm { position: relative; flex: none; width: 300px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.swm .in { height: 40px; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 13px; line-height: 40px; color: var(--text-3); }
.swm .ls { max-height: 320px; overflow: hidden; padding: 4px; }
.swm .si { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 8px; font-size: 13px; color: var(--text-1); }
.swm .si.hl { background: var(--surface-3); }
.swm .si svg.i { color: var(--text-3); }
.swm .sd { width: 8px; height: 8px; flex: none; border-radius: 50%; }
.swm .sd[style] { box-shadow: 0 0 0 2px var(--surface); }
.swm .nm { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.swm hr { height: 1px; margin: 4px; border: 0; background: var(--line); }
.swm .ro { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-top: 1px solid var(--line); }
.swm .ro .tx { flex: 1; min-width: 0; }
.swm .ro b { display: block; font-size: 13px; font-weight: 400; }
.swm .ro small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.swm .tg { position: relative; width: 32px; height: 18px; flex: none; border-radius: 999px; background: var(--line-strong); }
.swm .tg::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); }
`

/** The sidebar's switcher, open: each cluster with its status, or none where asking would sign in. */
function switcher(): string {
  const item = (name: string, d?: string, o: { on?: boolean; hl?: boolean } = {}) =>
    `<div class="si${o.hl ? ' hl' : ''}"><span class="sd"${d ? ` style="background:var(--${d})"` : ''}></span><span class="nm">${escape(name)}</span>${o.on ? icon('check', 16, 2, 'color:var(--accent)') : ''}</div>`
  return `<div class="swm">
    <div class="in">Switch to…</div>
    <div class="ls">${[
      item('Payments EU', undefined, { hl: true }),
      item('Payments US'),
      item('Payments staging', 'good'),
      item('Platform tools'),
      item('CI runners'),
      item('kind-lumovi', 'good', { on: true }),
      item('minikube', 'critical'),
      item('docker-desktop', 'good'),
    ].join('')}<hr><div class="si">${icon('list', 16)}All clusters</div></div>
    <div class="ro">${icon('lock', 16, 2, 'color:var(--text-3)')}<span class="tx"><b>Read-only</b><small>Lumovi won’t change kind-lumovi</small></span><span class="tg"></span></div>
    <span class="tip" style="left:132px;top:58px">Signs in when opened</span>${pointer(116, 44)}
  </div>`
}

function signInFrame(): string {
  const tip = `<span class="tip" style="right:86px;top:558px">Signs in through gke-gcloud-auth-plugin, so Lumovi checks it when you open it.</span>${pointer(612, 532)}`
  return `<section class="blk"><h2>On the start screen: a cluster that signs in through a program<i>no dot and no version until it’s opened, so nothing signs in at launch</i></h2>
    <div class="row2"><div class="stack"><p class="cap">The list, its clouds’ clusters signing in through their programs (aws, gke-gcloud-auth-plugin); the pointer on CI runners’ words</p><div class="on-start">${picker('signs-in')}${tip}</div></div>
    <div class="stack"><p class="cap">The sidebar’s switcher, open in kind-lumovi</p>${switcher()}</div></div>
    <ul class="rules">
      <li><b>No dot, and words in its place.</b> A cluster whose kubeconfig signs in through a program (a credential plugin, as the clouds’ clusters do, or an auth provider) isn’t asked its version on the start screen: asking runs the program, which can open a browser. Its tile has no dot, since nothing is known and nothing pretends. Where the version and latency go: <b>Signs in when opened</b>, quiet (text-3, not mono), read as part of the row. Recent’s line the same. The column keeps its right edge and grows for these words, one line (126 px in Inter at 12): <code>min-w-[116px] whitespace-nowrap</code> for <code>w-[116px]</code>.</li>
      <li><b>Its tooltip</b>, on the words as a row’s error has its own, names the program: “Signs in through gke-gcloud-auth-plugin, so Lumovi checks it when you open it.” The name is read from the kubeconfig, never run: an exec’s command, its last part, or an auth provider’s name. Opening the cluster signs in as today. Back on the start screen the row stays the same: it says what kind of cluster this is, not a status that would go stale. A folder’s cluster not yet allowed keeps “Asks before it runs” first, which needs nothing run. Most clouds’ clusters sign in this way, so on many lists most rows read this, as drawn.</li>
      <li><b>The sidebar’s switcher</b> asks every cluster’s version as it opens, which would run the same programs (a browser for a cluster you didn’t pick). There too: no dot, its place kept so the names stay in line, and the row’s tooltip <b>Signs in when opened</b>. The cluster that’s open keeps its dot, there and on the sidebar, since it’s signed in. Light and dark use the tokens the list has: nothing new.</li>
    </ul></section>`
}

// ─── The frames ────────────────────────────────────────────────────────────────────────────

export type WindowsFrame = 'wn-keep' | 'wn-tabs' | 'wn-states' | 'wn-windows' | 'wn-signin'

export const WINDOWS_FRAMES: { id: WindowsFrame; title: string; size: Size }[] = [
  { id: 'wn-keep', title: 'Keep an object open below', size: { width: 1504, height: 2200 } },
  {
    id: 'wn-tabs',
    title: 'The bar with terminals and objects',
    size: { width: 1504, height: 1300 },
  },
  {
    id: 'wn-states',
    title: 'Deleted, unreachable, after a restart',
    size: { width: 1504, height: 1300 },
  },
  { id: 'wn-windows', title: 'More than one window', size: { width: 2400, height: 1900 } },
  {
    id: 'wn-signin',
    title: 'Signs in when opened, on the start screen',
    size: { width: 1504, height: 1100 },
  },
]

const INTRO =
  '<header><h1>More than one window, and tabs for what you watch (LMV-176)</h1><p>The dock along the bottom of a cluster’s pages holds terminals today. It now keeps objects too: any object, from its panel, open on whichever tab it was on, so its logs or its state stay in view while the window moves around. A tab can move into a window of its own, and File → New Window opens another window on any cluster. Windows and their tabs come back after a restart. Words are docs’ (14 Oct).</p></header>'

/** One of the frames, in one theme. */
export function windowsFrame2(id: WindowsFrame, scheme: Scheme): string {
  const f = WINDOWS_FRAMES.find((x) => x.id === id)!
  const body = {
    'wn-keep': () => `${INTRO}${keepFrame()}`,
    'wn-tabs': tabsFrame,
    'wn-states': statesFrame,
    'wn-windows': windowsFrame,
    'wn-signin': signInFrame,
  }[id]()
  const css = id === 'wn-signin' ? `${START_CSS}${SHEET}${SIGNIN_CSS}` : CSS
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${css}
</style><div class="sheet">${body}</div>`
}
