/**
 * Where Windows and Linux reach the app's menu: its window hides the title bar, and with it the
 * menu bar, so a button in the window's top left corner, where macOS keeps its traffic lights,
 * opens the same menu. It sits in the 52 px band the window's controls are drawn in, centered
 * with them, at the same place in every view. Mockups for the design (LMV-133) and the guidelines' picture. The menu
 * itself is the native one, drawn here as Windows draws it.
 */
import { CSS as PARTS, tokens } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { document, horizontal, VARIANTS } from './logo.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

type Entry =
  { label: string; keys?: string; checked?: boolean; submenu?: boolean; hl?: boolean } | 'sep'

/** The menu's top level, as Windows and Linux have it (macOS adds the app's own menu). */
const TOP: Entry[] = [
  { label: 'File', submenu: true },
  { label: 'Edit', submenu: true },
  { label: 'View', submenu: true },
  { label: 'Go', submenu: true },
  { label: 'Window', submenu: true },
  { label: 'Help', submenu: true },
]

/** Help, with Documentation added: the same items as the macOS menu's. */
export const HELP: Entry[] = [
  { label: 'Keyboard Shortcuts', keys: 'Ctrl+/' },
  'sep',
  { label: 'Documentation' },
  { label: 'Lumovi on GitHub' },
  { label: 'Report an Issue…' },
  { label: 'Sponsor Lumovi…' },
  'sep',
  { label: 'Check for Updates…' },
  { label: 'Check for Updates Automatically', checked: true },
]

export const VIEW: Entry[] = [
  { label: 'Refresh', keys: 'Ctrl+R' },
  { label: 'Command Palette…', keys: 'Ctrl+K' },
  { label: 'Filter List' },
  { label: 'Terminal', keys: 'Ctrl+`' },
  { label: 'New Terminal', keys: 'Ctrl+Shift+`' },
  { label: 'Match kubectl to Each Cluster', checked: true },
  'sep',
  { label: 'AI Assistants…' },
  'sep',
  { label: 'Actual Size', keys: 'Ctrl+0' },
  { label: 'Zoom In', keys: 'Ctrl+Shift+=' },
  { label: 'Zoom Out', keys: 'Ctrl+-' },
  'sep',
  { label: 'Toggle Full Screen', keys: 'F11' },
  { label: 'Toggle Developer Tools', keys: 'Ctrl+Shift+I' },
]

/** A native menu, as Windows 11 draws one in the app's theme. */
const NATIVE = `
.native { position: absolute; z-index: 30; min-width: 220px; padding: 4px; border-radius: 8px; font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 12.5px; }
.light .native { background: #f9f9f9; color: #1a1a1a; box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1), 0 8px 24px rgb(0 0 0 / 0.14); }
.dark .native { background: #2c2c2c; color: #f0f0f0; box-shadow: 0 0 0 1px rgb(255 255 255 / 0.08), 0 8px 24px rgb(0 0 0 / 0.5); }
.native .it { display: flex; height: 28px; align-items: center; padding: 0 10px 0 30px; border-radius: 4px; position: relative; white-space: nowrap; }
.native .it.hl { background: rgb(128 128 128 / 0.16); }
.native .it .ck { position: absolute; left: 10px; top: 7px; }
.native .it .k { margin-left: auto; padding-left: 28px; opacity: 0.6; }
.native .it .ar { margin-left: auto; padding-left: 28px; opacity: 0.7; }
.native .sp { height: 1px; margin: 4px 6px; }
.light .native .sp { background: rgb(0 0 0 / 0.1); }
.dark .native .sp { background: rgb(255 255 255 / 0.1); }
`

function native(entries: Entry[], left: number, top: number): string {
  return `<div class="native" style="left:${left}px;top:${top}px">${entries
    .map((e) =>
      e === 'sep'
        ? '<div class="sp"></div>'
        : `<div class="it${e.hl ? ' hl' : ''}">${e.checked ? `<span class="ck">${icon('check', 13, 2.25)}</span>` : ''}${escape(e.label)}${e.keys ? `<span class="k">${escape(e.keys)}</span>` : ''}${e.submenu ? `<span class="ar">${icon('chevron-right', 13)}</span>` : ''}</div>`,
    )
    .join('')}</div>`
}

const CSS = `
.win { position: relative; width: 100%; height: 100%; overflow: hidden; background: var(--app-bg); }
.menu-btn { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 8px; color: var(--text-2); }
.menu-btn.open { background: var(--surface-3); color: var(--text-1); }
.menu-btn.hover { background: var(--surface-3); color: var(--text-1); }
.tip { position: absolute; z-index: 30; transform: translateY(-50%); display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 6px; background: var(--text-1); color: var(--surface); font-size: 12px; font-weight: 500; box-shadow: var(--shadow-pop); }
.tip .kbd { height: 18px; min-width: 18px; border-color: transparent; background: color-mix(in srgb, var(--surface) 18%, transparent); color: var(--surface); }
.side { position: absolute; left: 0; top: 0; bottom: 0; width: 244px; }
.side .band { display: flex; height: 52px; align-items: center; padding: 0 12px; }
.switcher { margin: 12px; display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.switcher .d { width: 8px; height: 8px; border-radius: 50%; background: var(--good); }
.switcher .t { font-size: 13px; font-weight: 500; }
.switcher .s { font-size: 12px; color: var(--text-3); }
.switcher .c { margin-left: auto; color: var(--text-3); }
.nav { padding: 0 12px; }
.nav .n { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.nav .n svg.i { color: var(--text-3); }
.nav .n.on { background: var(--surface-3); color: var(--text-1); }
.panel { position: absolute; left: 244px; top: 8px; right: 8px; bottom: 0; border: 1px solid var(--line); border-bottom: 0; border-radius: 12px 12px 0 0; background: var(--surface); }
.panel .head { display: flex; height: 44px; align-items: center; gap: 10px; padding: 0 14px; border-bottom: 1px solid var(--line); font-size: 14px; font-weight: 600; }
.controls { position: absolute; top: 0; right: 0; display: flex; height: 52px; }
.controls span { display: grid; width: 46px; height: 52px; place-items: center; color: var(--text-2); }
.start .band { display: flex; height: 52px; align-items: center; padding: 0 12px; }
.start .logo { position: absolute; left: 50%; top: 76px; transform: translateX(-50%); }
.start .logo svg { display: block; height: 36px; width: auto; }
.start p { position: absolute; left: 0; right: 0; top: 132px; margin: 0; text-align: center; font-size: 14px; color: var(--text-2); }
`

const page = (scheme: Scheme, width: number, height: number, body: string) =>
  `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${width}px; height: ${height}px; }
${PARTS}
${CSS}
${NATIVE}
</style><div class="win ${scheme}">${body}</div>`

/** Windows' own window controls, drawn over the top right, as its title bar overlay draws them. */
const CONTROLS = `<div class="controls"><span>${icon('minus', 14)}</span><span>${icon('square', 12)}</span><span>${icon('x', 14)}</span></div>`

const navItem = (glyph: IconName, label: string, on = false) =>
  `<div class="n${on ? ' on' : ''}">${icon(glyph, 16)}${label}</div>`

/** In a cluster: the button in the sidebar's top band, with Help open, or at rest, hovered. */
export function sidebarMenu(scheme: Scheme, open = true): string {
  return page(
    scheme,
    760,
    460,
    `<div class="side">
      <div class="band"><span class="menu-btn ${open ? 'open' : 'hover'}">${icon('menu', 16)}</span></div>
      <div class="switcher"><span class="d"></span><div><div class="t">Payments EU</div><div class="s">Kubernetes v1.34.1</div></div><span class="c">${icon('chevrons-up-down', 14)}</span></div>
      <div class="nav">${navItem('layout-dashboard', 'Overview', true)}${navItem('boxes', 'Workloads')}${navItem('box', 'Pods')}${navItem('chart-spline', 'Metrics')}${navItem('ship-wheel', 'Helm releases')}</div>
    </div>
    <div class="panel"><div class="head">Overview</div></div>
    ${CONTROLS}
    ${
      open
        ? `${native([...TOP.slice(0, 5), { label: 'Help', submenu: true, hl: true }], 12, 46)}
    ${native(HELP, 12 + 222, 46 + 4 + 28 * 5)}`
        : `<div class="tip" style="left:52px;top:26px">Menu<span class="kbd">Alt</span></div>`
    }`,
  )
}

/** On the start screen: the button in the title bar's band, with View open, or at rest, hovered. */
export function startMenu(scheme: Scheme, open = true): string {
  const variant = VARIANTS.find((v) => v.name === `on-${scheme}`)!
  return page(
    scheme,
    760,
    500,
    `<div class="start">
      <div class="band"><span class="menu-btn ${open ? 'open' : 'hover'}">${icon('menu', 16)}</span></div>
      <div class="logo">${document(horizontal(variant), 36)}</div>
      <p>Choose a cluster to explore.</p>
    </div>
    ${CONTROLS}
    ${
      open
        ? `${native([TOP[0]!, TOP[1]!, { label: 'View', submenu: true, hl: true }, TOP[3]!, TOP[4]!, TOP[5]!], 12, 46)}
    ${native(VIEW, 12 + 222, 46 + 4 + 28 * 2)}`
        : `<div class="tip" style="left:52px;top:26px">Menu<span class="kbd">Alt</span></div>`
    }`,
  )
}
