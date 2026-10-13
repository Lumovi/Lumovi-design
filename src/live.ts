/**
 * lumovi.dev's live blocks (LMV-280, Péter: every loop becomes an interactive copy of the app's
 * UI). Each is the app's own UI in its flat look, laid out by the site at build time and painted
 * with no script, then made to move and answer by a small script: once as it comes into view,
 * then under the pointer, the keyboard and a tap. Drawn here at rest, in use, and on a phone,
 * with what each does; the site builds them from these and the kit's parts.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
  LEVEL,
  TEXT,
  card,
  command,
  diff,
  escape,
  fact,
  head,
  lead,
  only,
  phoneFrame,
  table,
  tile,
  type Level,
} from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.sheet { display: flex; flex-direction: column; gap: 40px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; font-weight: 600; }
.sheet > header p { margin: 6px 0 0; max-width: 980px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 14px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.trio { display: flex; gap: 28px; align-items: flex-start; }
.col { display: flex; flex-direction: column; gap: 8px; }
.cap { margin: 0; font-size: 12px; color: var(--text-3); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 28px; max-width: 1700px; margin: 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { display: block; margin-bottom: 2px; font-weight: 600; color: var(--text-1); }
.lwin { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); box-shadow: 0 0 0 1px var(--line), 0 30px 80px -40px rgb(0 0 0 / 0.45); }
.lwin.pad { padding: 16px; }
.lcap { display: flex; gap: 8px; align-items: flex-start; min-height: 40px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: var(--surface-2); font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.lcap b { font-weight: 600; color: var(--text-1); }
.lcap .q { color: var(--text-3); }
.lbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
.steps { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0; padding: 0; list-style: none; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3); }
.steps li { display: inline-flex; align-items: center; gap: 6px; }
.steps li.on { color: var(--text-1); }
.steps li.now { color: var(--accent-strong); }
.steps li.to { color: var(--text-3); opacity: 0.5; }
.loopc { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid var(--line-strong); border-radius: 999px; background: var(--surface); color: var(--text-2); }

/* The map, in the app's look */
.lmap { position: relative; }
.lmap > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.lmap > svg path { fill: none; stroke: var(--line-strong); stroke-width: 1.5; }
.lmap > svg path.uses { stroke-dasharray: 4 4; }
.lmap > svg path.bad { stroke: var(--critical); }
.lmap > svg path.warnl { stroke: var(--warn); }
.lmap > svg path.on { stroke: var(--accent); stroke-width: 2; opacity: 1; }
.lmap > svg path.dim { opacity: 0.2; }
.lmap circle.req { fill: var(--accent); }
.lmap .gcard { width: var(--cw); }
.lmap .gcard.obj { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft), var(--shadow-panel); }
.lmap .gcard.missing { border-style: dashed; border-color: color-mix(in srgb, var(--critical) 55%, var(--line)); box-shadow: none; }
.lmap .gcard.lit { border-color: var(--accent); }
.lmap .gcard.ptr::after { content: ''; position: absolute; right: 14px; bottom: -10px; width: 14px; height: 14px; background: no-repeat center / contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l16 10-7 1.5L9 21z' fill='white' stroke='black' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E"); }
.ph .lmap .gcard { position: static; width: auto; }
.pcol { display: flex; flex-direction: column; gap: 0; padding: 14px 16px 16px; }
.pcol .ln { width: 1.5px; height: 18px; margin-left: 26px; background: var(--line-strong); }
.pcol .ln.uses { background: repeating-linear-gradient(var(--line-strong) 0 4px, transparent 4px 8px); }
.pcol .ln.usesbad { background: repeating-linear-gradient(var(--critical) 0 4px, transparent 4px 8px); }
.pcol .ln.warnl { background: var(--warn); }
.pcol .kid { margin-left: 24px; }
.pcol .kid2 { margin-left: 48px; }
.pcol h5 { margin: 14px 0 6px 24px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.lg { display: inline-block; width: 18px; height: 0; margin: 0 4px 3px; border-top: 1.5px solid var(--line-strong); vertical-align: middle; }
.lg.d { border-top-style: dashed; }
.pcol .ln.bad { background: var(--critical); }
.pcol .ln.on { width: 2px; background: var(--accent); }
.pcol .kid .gcard, .pcol .kid2 .gcard { margin-top: 8px; }
.pcol .gcard { position: static; }
.pcol .gcard.dim { opacity: 0.35; }
.pcol .ex { margin: 8px 0 0; padding: 10px 12px; border-radius: 10px; background: var(--surface-2); font-size: 13px; line-height: 19px; color: var(--text-2); }
.pcol .ex b { color: var(--text-1); font-weight: 600; }
.pcol .more { margin-top: 12px; font-size: 12px; color: var(--text-3); }

/* Needs attention */
.na { display: flex; flex-direction: column; }
.na .nr { display: grid; grid-template-columns: 148px minmax(0, 1fr) 16px; align-items: start; gap: 12px; padding: 9px 10px; border-radius: 8px; }
.na .nr + .nr { margin-top: 2px; }
.na .nr.hov { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.na .nr.open { background: var(--surface-3); }
.na .nr .w { min-width: 0; }
.na .nr .w b { display: block; overflow: hidden; font-size: 13px; line-height: 19px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.na .nr .w small { display: block; overflow: hidden; font-size: 12px; line-height: 17px; color: var(--text-3); text-overflow: ellipsis; white-space: nowrap; }
.na .nr.open .w small { white-space: normal; }
.na .nr .tw { padding-top: 2px; color: var(--text-3); }
.na .log { margin: 2px 10px 6px 170px; padding: 8px 10px; border-radius: 8px; background: var(--code-bg, var(--surface)); border: 1px solid var(--line); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 18px; color: var(--text-2); white-space: pre; overflow: hidden; }
.na .log .h { display: block; margin-bottom: 4px; font-family: Inter, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.na .log .e { color: var(--critical-text); }
.na .more { padding: 8px 10px 0; font-size: 12.5px; font-weight: 500; color: var(--accent); }
.ph .na .nr { grid-template-columns: minmax(0, 1fr) auto; padding: 10px 16px; border-radius: 0; }
.ph .na .nr + .nr { margin-top: 0; border-top: 1px solid var(--line); }
.ph .na .log { margin: 0 16px 10px; white-space: pre-wrap; overflow-wrap: anywhere; }

/* A dialog drawn in place */
.kdlg.inplace { width: 100%; box-shadow: none; border-color: var(--line); }
.revs { display: flex; flex-direction: column; gap: 8px; }
.rev { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.rev.on { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 7%, var(--surface)); box-shadow: 0 0 0 2px var(--accent-soft); }
.rev .rd { width: 16px; height: 16px; margin-top: 2px; flex: none; border: 1.5px solid var(--line-strong); border-radius: 999px; }
.rev.on .rd { border: 5px solid var(--accent); }
.rev b { font-size: 13px; font-weight: 600; }
.rev .s { font-size: 12px; color: var(--text-3); }
.rev small { display: block; margin-top: 2px; font-size: 12px; color: var(--text-2); }
.going { margin: 12px 0 0; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.going b { font-weight: 600; color: var(--text-1); }
.toast { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); font-size: 13px; }
.toast .ok { color: var(--good-text); }
.toast .btn { margin-left: auto; }
.larger { margin: 0; padding: 10px 12px; border-radius: 10px; background: var(--surface-2); font-size: 13px; line-height: 19px; color: var(--text-2); }
.larger b { font-weight: 500; color: var(--text-1); }

/* Right-sizing */
.rtiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.rtiles .ktile .v { font-size: 22px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0 8px; }
.chip { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); }
.chip small { color: var(--text-3); }
.chip.on { border-color: color-mix(in srgb, var(--accent) 50%, var(--line)); background: var(--accent-soft); color: var(--accent-strong); }
.rdet { margin: 4px 0 6px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); }
.rdet .rh { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-3); }
.rdet .rh b { font-size: 13px; color: var(--text-1); }
.rdet .rn { display: grid; grid-template-columns: 64px 1fr; gap: 2px 8px; margin: 8px 0; font-size: 12px; color: var(--text-3); }
.rdet .rn b { font-weight: 500; color: var(--text-1); }
.rdet .why { font-size: 12px; color: var(--text-2); }
.chart { position: relative; margin-top: 10px; }
.chart svg { display: block; width: 100%; height: 120px; overflow: visible; }
.chart .use { fill: none; stroke: var(--series-1, var(--accent)); stroke-width: 1.5; }
.chart .req { stroke: var(--text-3); stroke-dasharray: 3 3; }
.chart .rec { stroke: var(--good); stroke-width: 1.5; }
.chart .x { stroke: var(--text-2); stroke-width: 1; }
.chart .tip { position: absolute; padding: 4px 8px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); box-shadow: var(--shadow-pop); font-size: 11.5px; white-space: nowrap; color: var(--text-1); }
.chart .tip span { color: var(--text-3); }
.chart .lb { position: absolute; right: 0; font-size: 10.5px; color: var(--text-3); }

/* The approval */
.why { padding: 10px 12px; border-left: 3px solid var(--accent); border-radius: 8px; background: color-mix(in srgb, var(--accent) 8%, var(--surface)); }
.why .kcap { margin-bottom: 4px; }
.why p { margin: 0; font-size: 13px; line-height: 19px; }
.acc { display: flex; justify-content: space-between; margin: 12px 0 8px; font-size: 12.5px; color: var(--text-2); }
.acc > span { display: inline-flex; align-items: center; gap: 6px; }
.acc .n { color: var(--good-text); }
.kcmd .tok { white-space: nowrap; }
.acc .m { color: var(--critical-text); }
.waits { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--text-3); }
.done { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 10px; background: color-mix(in srgb, var(--good) 10%, transparent); font-size: 13px; color: var(--good-text); }
.done span { color: var(--text-2); }
.kbd2 { margin-left: 6px; padding: 0 4px; border-radius: 4px; background: rgb(255 255 255 / 0.18); font-size: 11px; }
.rjl { display: block; margin-bottom: 6px; font-size: 12.5px; font-weight: 500; color: var(--text-1); }
.rjf { display: flex; width: 100%; height: auto; min-height: 56px; align-items: flex-start; padding: 8px 10px; color: var(--text-3); }

/* Audit */
.ahd { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.ahd h4 { margin: 0; font-size: 18px; font-weight: 650; letter-spacing: -0.01em; }
.ahd h4 small { display: block; font-size: 14px; font-weight: 500; color: var(--text-2); }
.chk { display: flex; gap: 10px; margin-top: 12px; padding: 10px 12px; border: 1px solid color-mix(in srgb, var(--good) 40%, var(--line)); border-radius: 10px; background: color-mix(in srgb, var(--good) 9%, transparent); font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.chk b { display: block; color: var(--good-text); font-weight: 600; }
.chk.run { border-color: var(--line); background: var(--surface-2); }
.chk.run b { color: var(--text-1); }
.prog { height: 4px; margin-top: 8px; border-radius: 999px; background: var(--surface-3); overflow: hidden; }
.prog i { display: block; height: 100%; width: var(--p); border-radius: 999px; background: var(--accent); }
.arow { display: grid; grid-template-columns: 76px 28px minmax(0, 1fr); gap: 10px; align-items: center; padding: 8px 10px; border-radius: 8px; }
.arow.hov { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.arow.open { background: var(--surface-3); }
.arow .t { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); }
.arow .ic { display: grid; width: 28px; height: 28px; place-items: center; border: 1px solid var(--line); border-radius: 8px; color: var(--text-2); }
.arow b { display: block; overflow: hidden; font-size: 13px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.arow small { display: block; font-size: 12px; color: var(--text-3); }
.aev { margin: 2px 10px 6px 124px; display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 4px 10px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 12px; color: var(--text-3); }
.aev b { font-weight: 500; color: var(--text-1); overflow-wrap: anywhere; }
.aev code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.aev .sh { margin-top: 6px; }
.aev span.sh { font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
.adate { padding: 10px 10px 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ph .arow { grid-template-columns: 28px minmax(0, 1fr); padding: 10px 16px; border-radius: 0; }
.ph .arow .t { display: none; }
.ph .arow + .arow { border-top: 1px solid var(--line); }
.ph .aev { margin: 0 16px 10px; grid-template-columns: 1fr; }
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

/** A block's frame: at rest, in use, on a phone, then what it does. */
const block = (
  title: string,
  sub: string,
  panes: [cap: string, html: string][],
  rules: [what: string, text: string][],
) =>
  `<section class="blk"><h2>${title}<i>${sub}</i></h2><div class="trio">${panes.map(([c, h]) => `<div class="col"><p class="cap">${c}</p>${h}</div>`).join('')}</div><ul class="rules">${rules.map(([w, t]) => `<li><b>${w}</b>${t}</li>`).join('')}</ul></section>`

const strip = (steps: [string, 'on' | 'now' | 'to' | ''][]) =>
  `<ol class="steps">${steps.map(([s, st], i) => `${i ? '<li class="to" aria-hidden="true">→</li>' : ''}<li class="${st}">${st === 'on' ? icon('check', 13) : ''}${s}</li>`).join('')}</ol>`

const pause = `<span class="loopc" title="Pause">${icon('pause', 13)}</span>`

/** The app's equivalent command, each argument kept whole: a line breaks only between them. */
const cmd = (text: string) =>
  command('\u0000').replace(
    '\u0000',
    text
      .split(' ')
      .map((t) => `<span class="tok">${escape(t)}</span>`)
      .join(' '),
  )

// ─── The map ───────────────────────────────────────────────────────────────────────────────

interface MNode {
  id: string
  glyph: IconName
  kind: string
  name: string
  status?: [Level, string]
  col: number
  row: number
  obj?: boolean
  missing?: boolean
  about: string
}

/** storefront and what it's connected to, as today's map scene has them (Lumovi-website, scenes/map/data.ts). */
const MAP: MNode[] = [
  {
    id: 'gateway',
    glyph: 'globe',
    kind: 'Gateway',
    name: 'public',
    status: ['healthy', 'Programmed'],
    col: 1,
    row: 0,
    about: 'Takes traffic in from outside, for the routes that attach to it.',
  },
  {
    id: 'route',
    glyph: 'git-branch',
    kind: 'HTTPRoute',
    name: 'storefront',
    status: ['healthy', 'Accepted'],
    col: 0,
    row: 1,
    about: 'Routes shop.example.com from the gateway to the storefront service.',
  },
  {
    id: 'ingress',
    glyph: 'globe',
    kind: 'Ingress',
    name: 'storefront',
    col: 2,
    row: 1,
    about: 'The older way in, for shop.example.com, to the same service.',
  },
  {
    id: 'service',
    glyph: 'network',
    kind: 'Service',
    name: 'storefront',
    status: ['healthy', '3/3 ready'],
    col: 0,
    row: 2,
    about: 'Selects storefront’s pods, and sends each request to one that’s ready.',
  },
  {
    id: 'policy',
    glyph: 'shield',
    kind: 'Network policy',
    name: 'allow-storefront',
    col: 1,
    row: 2,
    about: 'Lets traffic in to storefront’s pods only from the gateway.',
  },
  {
    id: 'autoscaler',
    glyph: 'arrow-up-down',
    kind: 'Autoscaler',
    name: 'storefront',
    status: ['healthy', '3 of 2–10'],
    col: 2,
    row: 2,
    about: 'Scales storefront between 2 and 10 replicas on CPU.',
  },
  {
    id: 'deployment',
    glyph: 'layers',
    kind: 'Deployment',
    name: 'storefront',
    status: ['healthy', 'Ready'],
    col: 1,
    row: 3,
    obj: true,
    about: 'The object this map is of. Point at anything to trace its chain.',
  },
  {
    id: 'pods',
    glyph: 'box',
    kind: 'Pods',
    name: 'storefront',
    status: ['healthy', '3/3 ready'],
    col: 0,
    row: 4,
    about: '3 pods of revision 4, one card however many there are.',
  },
  {
    id: 'config',
    glyph: 'file-cog',
    kind: 'ConfigMap',
    name: 'storefront',
    col: 1,
    row: 4,
    about: 'Three keys, read by every pod as environment variables.',
  },
  {
    id: 'secret',
    glyph: 'key-round',
    kind: 'Secret',
    name: 'shop-tls',
    status: ['critical', 'Missing'],
    col: 2,
    row: 4,
    missing: true,
    about: 'Mounted by storefront’s pods, but it isn’t there: new pods won’t start.',
  },
  {
    id: 'w1',
    glyph: 'server',
    kind: 'Node',
    name: 'worker-1',
    status: ['healthy', 'Ready'],
    col: 0,
    row: 5,
    about: '2 of storefront’s pods run on it.',
  },
  {
    id: 'w2',
    glyph: 'server',
    kind: 'Node',
    name: 'worker-2',
    status: ['warning', 'MemoryPressure'],
    col: 1,
    row: 5,
    about: '1 of storefront’s pods runs on it, and it’s short of memory.',
  },
]

type MLink = [from: string, to: string, kind?: 'uses' | 'bad' | 'warnl' | 'usesbad']
const LINKS: MLink[] = [
  ['gateway', 'route'],
  ['route', 'service'],
  ['ingress', 'service'],
  ['service', 'deployment'],
  ['policy', 'deployment', 'uses'],
  ['autoscaler', 'deployment'],
  ['deployment', 'pods'],
  ['deployment', 'config', 'uses'],
  ['deployment', 'secret', 'usesbad'],
  ['pods', 'w1'],
  ['pods', 'w2', 'warnl'],
]

/** What leads to a card and what it leads to: its chain, as the trace lights it. */
function chain(id: string): Set<string> {
  const lit = new Set([id])
  const up = (x: string) => LINKS.filter(([, t]) => t === x).forEach(([f]) => (lit.add(f), up(f)))
  const down = (x: string) =>
    LINKS.filter(([f]) => f === x).forEach(([, t]) => (lit.add(t), down(t)))
  up(id)
  down(id)
  return lit
}

const mcard = (n: MNode, cls: string, style = '') => {
  const st = n.status
    ? `<span class="st" style="--m:var(--${LEVEL[n.status[0]]});--mt:var(--${TEXT[n.status[0]]})"><i></i>${n.status[1]}</span>`
    : ''
  return `<div class="gcard ${cls}${n.obj ? ' obj' : ''}${n.missing ? ' missing' : ''}" style="${style}"><span class="gi">${icon(n.glyph, 15)}</span><span class="gw"><span class="g1"><span class="m">${n.kind}</span>${st}</span><span class="g2">${escape(n.name)}</span></span></div>`
}

/** The map at the block's width: three columns of 200 px cards, rows 96 apart. */
function mapLive(o: { traced?: string; requests?: boolean } = {}): string {
  const CW = 200
  const G = 12
  const ROW = 96
  const CH = 56
  const at = (id: string) => {
    const n = MAP.find((x) => x.id === id)!
    return { x: n.col * (CW + G), y: n.row * ROW }
  }
  const lit = o.traced ? chain(o.traced) : undefined
  const pathOf = ([f, t]: MLink) => {
    const a = at(f)
    const b = at(t)
    const x1 = a.x + CW / 2
    const y1 = a.y + CH
    const x2 = b.x + CW / 2
    const y2 = b.y
    const m = (y1 + y2) / 2
    return {
      d: `M${x1} ${y1} V${m} H${x2} V${y2}`,
      mid: [x1, m] as const,
      end: [x2, (m + y2) / 2] as const,
    }
  }
  const paths = LINKS.map((l) => {
    const [f, t, k] = l
    const on = lit && lit.has(f) && lit.has(t)
    const cls = [
      k === 'uses' || k === 'usesbad' ? 'uses' : '',
      k === 'usesbad' ? 'bad' : '',
      k === 'warnl' ? 'warnl' : '',
      lit ? (on ? 'on' : 'dim') : '',
    ].join(' ')
    return `<path class="${cls}" d="${pathOf(l).d}"/>`
  }).join('')
  // Requests travel the routes in: from the gateway and the ingress to the pods.
  const reqs = o.requests
    ? (
        [
          ['gateway', 'route'],
          ['route', 'service'],
          ['ingress', 'service'],
          ['service', 'deployment'],
          ['deployment', 'pods'],
        ] as MLink[]
      )
        .map((l) => {
          const p = pathOf(l)
          return `<circle class="req" r="3" cx="${p.mid[0]}" cy="${p.mid[1]}"/><circle class="req" r="3" cx="${p.end[0]}" cy="${p.end[1]}" opacity=".55"/>`
        })
        .join('')
    : ''
  const width = 3 * CW + 2 * G
  const height = 5 * ROW + CH
  return `<div class="lmap" style="--cw:${CW}px;width:${width}px;height:${height}px"><svg>${paths}${reqs}</svg>${MAP.map(
    (n) => {
      const p = at(n.id)
      const cls = lit ? (lit.has(n.id) ? (n.id === o.traced ? 'lit ptr' : '') : 'dim') : ''
      return mcard(n, cls, `left:${p.x}px;top:${p.y}px`)
    },
  ).join('')}</div>`
}

const about = (id: string) => {
  const n = MAP.find((x) => x.id === id)!
  return `<div class="lcap">${icon(n.glyph, 15)}<span><b>${n.kind} ${n.name}</b>${n.status ? ` · ${n.status[1]}` : ''}. ${n.about}</span></div>`
}

function mapFrame(): string {
  const W = 'width:656px'
  const rest = `<div class="lwin pad" style="${W}">${mapLive({ requests: true })}${about('deployment')}<div class="lbar"><span class="cap">Routes, owns<i class="lg"></i> · Uses<i class="lg d"></i></span>${pause}</div></div>`
  const traced = `<div class="lwin pad" style="${W}">${mapLive({ traced: 'secret', requests: false })}${about('secret')}<div class="lbar"><span class="cap">Routes, owns<i class="lg"></i> · Uses<i class="lg d"></i></span>${pause}</div></div>`
  const one = (id: string, line: string, cls = '', box = '') => {
    const n = MAP.find((x) => x.id === id)!
    return `<div class="${box}">${line ? `<div class="ln ${line}"></div>` : ''}${mcard(n, cls)}</div>`
  }
  const col = `${one('gateway', '')}${one('route', 'on')}${one('service', 'on')}${one('deployment', 'on')}<h5>Under it</h5>${one('secret', '', 'lit', 'kid')}<p class="ex kid"><b>Secret shop-tls · Missing.</b> Mounted by storefront’s pods, but it isn’t there: new pods won’t start.</p>${one('pods', '', 'dim', 'kid')}${one('w2', 'warnl', 'dim', 'kid2')}`
  const phone = phoneFrame(
    'storefront',
    `<div class="pcol">${col}<p class="more">Its chain, and what’s under it; the whole map is on a larger screen.</p></div>`,
    true,
  )
  return block(
    'Map',
    '/app#map: what routes to what',
    [
      ['At rest, in view: requests travel in from the gateway and the ingress to the pods', rest],
      ['Traced: the pointer on Secret shop-tls lights its chain; the rest fades', traced],
      ['Phone: the Deployment’s chain in one column, Secret shop-tls tapped', phone],
    ],
    [
      [
        'What it is',
        'The app’s Map tab as it draws storefront: the same cards (56 px, a kind’s icon, kind and status on the first line, the name under), square lines, solid for routes and ownership and dashed for what’s used, in the color of what’s unwell at their end. The Deployment, the map’s object, has the accent frame; the missing Secret a dashed red one. Laid out by the site at build time: it paints with no script, and the rest state is its picture.',
      ],
      [
        'Comes into view',
        'Once: the cards settle in row by row from the Deployment outwards (12 px, 60 ms apart, 400 ms each), then requests start travelling the routes in, small accent dots a second apart, along gateway → route → service → Deployment → pods and from the ingress. They travel only while the map is in view, and stop for good after 30 s with nobody pointing, so it never moves for attention.',
      ],
      [
        'Pointer',
        'On a card: its chain lights (what leads to it and what it leads to), its lines blue and 2 px, every other card to 35% and line to 20%, as the app’s map does; the caption under the map says what the card is and does, in the old scene’s words. Off the map, it goes back to the Deployment’s caption. Requests keep travelling only on lit lines.',
      ],
      [
        'Keyboard',
        'Each card is a button named “Gateway public, Programmed”. Tab enters the map at the Deployment; arrow keys move card to card along the rows; the focused card traces, as the pointer does; Escape clears. The ring is the app’s focus ring.',
      ],
      [
        'Tap',
        'A tap traces and fills the caption; a tap on the traced card or outside the map clears. On a phone the map is the Deployment’s own chain in one column, 44 px rows, and the tapped card’s sentence opens under it in place.',
      ],
      [
        'Reduced motion',
        'No settling and no requests: the map is there at rest, and tracing is instant. The pause button (under the map, as the loops had it) stops and starts the requests; it isn’t drawn under reduced motion, since nothing moves.',
      ],
    ],
  )
}

// ─── Needs attention ───────────────────────────────────────────────────────────────────────

type NRow = [Level, string, string, string, string]
const NA: NRow[] = [
  [
    'critical',
    'Unavailable',
    'recommendations',
    'Deployment · shop',
    '0 of 1 ready: its pod can’t pull its image',
  ],
  [
    'critical',
    'CrashLoopBackOff',
    'checkout-jzhdh6j29h-hqnnn',
    'Pod · shop',
    'back-off 5m0s restarting failed container=app pod=checkout-jzhdh6j29h-hqnnn_shop',
  ],
  ['critical', 'Error', 'db-migrate-2r5n5', 'Pod · batch', 'Exited with code 1, 29m ago'],
  [
    'critical',
    'ImagePullBackOff',
    'recommendations-mcbt654b8h-bpp5n',
    'Pod · shop',
    'Back-off pulling image “ghcr.io/acme/recommendations:v2.0.0-typo”',
  ],
  ['warning', 'Degraded', 'checkout', 'Deployment · shop', '1 of 3 ready'],
]

const LOG = `<span class="h">The last lines of its log, container app</span>2026-10-13T14:02:11Z starting checkout v1.14.0
2026-10-13T14:02:11Z connecting to payments
<span class="e">2026-10-13T14:02:11Z panic: PAYMENTS_API_KEY is not set</span>`

const naRow = (r: NRow, o: { open?: boolean; hov?: boolean; phone?: boolean } = {}) =>
  o.phone
    ? `<div class="nr${o.open ? ' open' : ''}"><span class="w"><b>${escape(r[2])}</b><small>${r[3]} · ${escape(r[4])}</small></span><span>${pill(r[0], r[1])}</span></div>${o.open ? `<div class="log">${LOG}</div>` : ''}`
    : `<div class="nr${o.open ? ' open' : ''}${o.hov ? ' hov' : ''}"><span>${pill(r[0], r[1])}</span><span class="w"><b>${escape(r[2])}</b><small>${r[3]} · ${escape(r[4])}</small></span><span class="tw">${icon(o.open ? 'chevron-down' : 'chevron-right', 16)}</span></div>${o.open ? `<div class="log">${LOG}</div>` : ''}`

function problemsFrame(): string {
  const list = (open: number, hov = -1) =>
    `<div class="na">${NA.map((r, i) => naRow(r, { open: i === open, hov: i === hov })).join('')}<span class="more">Show all 12</span></div>`
  const rest = `<div class="lwin" style="width:656px">${card('Needs attention', '12', list(-1, 0))}</div>`
  const open = `<div class="lwin" style="width:656px">${card('Needs attention', '12', list(1))}</div>`
  const phone = phoneFrame(
    'Overview',
    `<div class="sec" style="padding:16px 0 8px"><h3 style="padding:0 16px">Needs attention<small>12</small></h3><div class="na">${NA.slice(
      0,
      4,
    )
      .map((r, i) => naRow(r, { phone: true, open: i === 1 }))
      .join('')}</div></div>`,
  )
  return block(
    'Problems first',
    'home’s block and /app’s Problems first: what’s failing, then why',
    [
      ['At rest: failing first; the first row under the pointer', rest],
      ['Pressed: a row opens in place, its reason whole and the last lines of its log', open],
      ['Phone: the same list, the phone’s rows; the CrashLoopBackOff tapped', phone],
    ],
    [
      [
        'What it is',
        'The Overview’s Needs attention, its rows as the app lists them: worst first, each row its status (never colour alone), its name, its kind and namespace, and the reason in the app’s own words. On home it keeps Recent warnings beside it, as the screenshot did; on /app it’s the list alone in its column. “Show all 12” is drawn, quiet, and goes nowhere on the site: it isn’t a link.',
      ],
      [
        'Comes into view',
        'Once: the rows arrive in their order, worst first, 6 px up and in, 60 ms apart. Then nothing moves.',
      ],
      [
        'Pointer and tap',
        'A row is a button: the hover fill and its chevron. Pressing one opens it in place: its reason whole, then the last three lines of its log in the mono, the failing line in the critical text, so the block says “its logs, a click away” by doing it. That opening is the site’s: in the app a row opens its object’s page, where the logs are a tab. One open at a time; pressing it again closes it. On home, an opened row’s log takes Recent warnings’ place until it’s closed.',
      ],
      [
        'Keyboard',
        'The list is a list of buttons: Tab to it, up and down move, Enter or Space opens and closes, Escape closes. An opened row is aria-expanded, its log a region named for the pod.',
      ],
      [
        'Phone',
        'It replaces phone-pods’ still: the phone’s own rows, name and status on the first line, kind, namespace and reason under, 60 px, a tap opening the log under the row. The first four rows, and “Show all 12”.',
      ],
      ['Reduced motion', 'The rows are there at rest; opening is instant.'],
    ],
  )
}

// ─── Rollback ──────────────────────────────────────────────────────────────────────────────

const REVS: [string, string, string, string][] = [
  [
    '2',
    'superseded · 20d ago',
    'Chart 2.4.0, app 3.9.0 · Upgrade complete',
    '3 lines of its values and 2 of its manifest',
  ],
  [
    '1',
    'superseded · 60d ago',
    'Chart 2.3.0, app 3.8.0 · Install complete',
    '9 lines of its values and 14 of its manifest',
  ],
]

function rollbackDlg(pick: number, phone = false): string {
  const r = REVS[pick]!
  const revs = `<div class="revs">${REVS.map((x, i) => `<div class="rev${i === pick ? ' on' : ''}"><span class="rd"></span><span><b>Revision ${x[0]}</b> <span class="s">${x[1]}</span><small>${x[2]}</small></span></div>`).join('')}</div>`
  const foot = phone
    ? `<div class="part"><p class="larger">Open Lumovi on a larger screen to <b>roll it back</b>.</p></div>`
    : `<div class="df"><span class="btn ghost sm">Cancel</span><span class="btn primary sm">Roll back</span></div>`
  return `<div class="kdlg inplace"><div class="dh"><span class="g">${icon('history', 18)}</span><div><h3>Roll back storefront</h3><div class="sub"><span>Helm release · shop · <b>production</b></span><span class="prodm">Production</span></div></div></div><div class="db"><div class="part">${revs}<p class="going">Running now: revision 3. Going back to <b>${r[0]}</b> changes ${r[3]}.</p>${cmd(`helm rollback storefront ${r[0]} --namespace shop --kube-context production`)}</div></div>${foot}</div>`
}

function rollbackFrame(): string {
  const toast = `<div class="toast">${icon('circle-check', 16)}<span><b>Rolled back storefront to revision 2</b><code style="display:block;margin-top:2px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--text-3)">helm rollback storefront 2 --namespace shop --kube-context production</code></span></div>`
  return block(
    'Rollback',
    '/app#rollback: every change dialog shows its kubectl',
    [
      [
        'At rest: Revision 2 picked, as the app opens it',
        `<div style="width:560px">${rollbackDlg(0)}</div>`,
      ],
      [
        'Picked Revision 1: what going back changes, and the command, follow',
        `<div style="width:560px;display:flex;flex-direction:column;gap:12px">${rollbackDlg(1)}<p class="cap">After Roll back: the dialog closes, and Lumovi’s notification takes its place, in the app’s words, with its command (a Helm rollback has no Undo)</p>${toast}</div>`,
      ],
      [
        'Phone: the same, to read; rolling back waits for a larger screen',
        phoneFrame('storefront', `<div style="padding:12px">${rollbackDlg(0, true)}</div>`, true),
      ],
    ],
    [
      [
        'What it is',
        'Lumovi’s Roll back dialog for the Helm release storefront, drawn in place in the block, not over a page: its title, where it is, the Production mark, the revisions it can go back to, what going back changes, the equivalent command, Cancel and Roll back.',
      ],
      [
        'Comes into view',
        'Once: the dialog rises 8 px and fades in, 300 ms, as the app’s dialogs open. Nothing more moves on its own.',
      ],
      [
        'Pointer and tap',
        'Picking a revision moves the selection (the app’s radio rows) and changes, at once, the “Going back to” line and the command, so the command can be seen following the choice. Roll back closes the dialog, and Lumovi’s notification says what was done, in the app’s words, “Rolled back storefront to revision 2”, with its command and no Undo, as in the app. A quiet “Show it again” under the block, the site’s own, brings the dialog back as it was. Cancel puts the dialog back at rest. Nothing reaches a cluster; nothing says it does.',
      ],
      [
        'Keyboard',
        'The revisions are a radio group: arrow keys move the pick; Tab goes to Cancel and Roll back; Enter on Roll back does it; Escape is Cancel. The command has the app’s Copy, which copies it.',
      ],
      [
        'Phone',
        'As Lumovi on a phone: rolling back isn’t offered there, so the dialog is a sheet to read, revisions still pickable, the command following, and in Roll back’s place Lumovi’s line: “Open Lumovi on a larger screen to roll it back.”',
      ],
      ['Reduced motion', 'No rise: it’s there. The notification appears without sliding.'],
    ],
  )
}

// ─── Right-sizing ──────────────────────────────────────────────────────────────────────────

/** Half-hourly CPU use over 7 days, in millicores: a working-day rhythm, peaks near 640. */
const USE = Array.from({ length: 336 }, (_, i) => {
  const day = Math.floor(i / 48)
  const h = (i % 48) / 2
  const work = h > 8 && h < 19 ? Math.sin(((h - 8) / 11) * Math.PI) : 0
  const noise = Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.31) * 0.5
  return Math.round(260 + (day % 7 < 5 ? 330 : 120) * work + 40 * noise)
})

function chart(o: { at?: number } = {}): string {
  const W = 560
  const H = 120
  const max = 900
  const y = (v: number) => H - (v / max) * H
  const x = (i: number) => (i / (USE.length - 1)) * W
  const d = USE.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('')
  const tip =
    o.at !== undefined
      ? `<line class="x" x1="${x(o.at)}" x2="${x(o.at)}" y1="0" y2="${H}"/><circle cx="${x(o.at)}" cy="${y(USE[o.at]!)}" r="3.5" fill="var(--accent)"/>`
      : ''
  const tipBox =
    o.at !== undefined
      ? `<span class="tip" style="left:${Math.min(x(o.at) + 10, W - 190)}px;top:${y(USE[o.at]!) - 30}px">Wed 14:30 · <b>${USE[o.at]}m</b> <span>· ${Math.round((USE[o.at]! / 500) * 100)}% of its request</span></span>`
      : ''
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><line class="req" x1="0" x2="${W}" y1="${y(500)}" y2="${y(500)}"/><line class="rec" x1="0" x2="${W}" y1="${y(700)}" y2="${y(700)}"/><path class="use" d="${d}"/>${tip}</svg><span class="lb" style="top:${y(700) - 15}px">Recommended 700m</span><span class="lb" style="top:${y(500) + 2}px">Request 500m</span>${tipBox}</div>`
}

function rsLive(o: { at?: number; chip?: string } = {}): string {
  const tiles = `<div class="rtiles">${tile('activity', 'CPU requests', '−250m', '490m to free · 240m more needed')}${tile('layers', 'Memory requests', '+256 MiB', '4.64 GiB to free')}${tile('triangle-alert', 'Need more', '4', '1 OOM-killed · 1 throttled', { level: 'warning' })}${tile('circle-dashed', 'Without requests', '1', 'Placed as if they used nothing')}</div>`
  const chips = `<div class="chips">${[
    ['All', '12'],
    ['Needs more', '4'],
    ['Over-provisioned', '4'],
    ['Right-sized', '2'],
  ]
    .map(
      ([n, c]) =>
        `<span class="chip${(o.chip ?? 'All') === n ? ' on' : ''}">${n} <small>${c}</small></span>`,
    )
    .join('')}</div>`
  const row = (lv: Level, name: string, ns: string, st: string, cpu: string, open = false) => ({
    cells: [
      lead({ name, under: `${ns} · 1 pod` }, { twist: open ? 'open' : 'closed' }),
      `<span>${pill(lv, st)}</span>`,
      `<span class="r">${cpu}</span>`,
    ],
    cls: open ? 'opens' : 'opens',
  })
  const det = `<div class="rdet"><div class="rh"><b>CPU</b><span>95th percentile 587m · peak 663m</span></div><div class="rn"><span>Request</span><b>500m → 700m</b><span>Limit</span><b>2 cores · stays</b></div><p class="why">It uses more than it requests: 700m covers 95% of its use, with 15% headroom.</p>${chart({ at: o.at })}</div>`
  const rows =
    o.chip === 'Over-provisioned'
      ? [
          row('neutral', 'checkout', 'shop', 'Over-provisioned', '1 → 250m'),
          row('neutral', 'search', 'search', 'Over-provisioned', '2 → 600m'),
        ]
      : [
          row('warning', 'prometheus', 'monitoring', 'Needs more', '500m → 700m', true),
          det,
          row('warning', 'postgres', 'data', 'Needs more', '250m · stays'),
          row('neutral', 'checkout', 'shop', 'Over-provisioned', '1 → 250m'),
        ]
  return `${tiles}${chips}${table('minmax(0,1.4fr) 150px 110px', [head('Workload'), head('Status'), head('CPU request', { r: true })], rows)}`
}

function rsFrame(): string {
  const W = 'width:656px'
  const phone = phoneFrame(
    'Right-sizing',
    `<div class="ptiles">${tile('activity', 'CPU requests', '−250m', '240m more needed')}${tile('triangle-alert', 'Need more', '4', '1 OOM-killed', { level: 'warning' })}</div><div class="sec" style="padding-top:0"><ul class="cards"><li><div class="top">${lead({ name: 'prometheus', under: 'monitoring · 1 pod' }, { twist: 'open' })}</div><dl>${fact('Status', 'Needs more')}${fact('CPU', '500m → 700m')}</dl><div style="padding:0 0 4px">${chart()}</div></li><li><div class="top">${lead({ name: 'postgres', under: 'data · 1 pod' })}</div><dl>${fact('Status', 'Needs more')}${fact('Memory', '1 → 1.2 GiB')}</dl></li></ul></div>`,
  )
  return block(
    'Right-sizing',
    '/app#capacity: where your capacity goes',
    [
      [
        'At rest: prometheus opened, its 7 days drawn; the pointer on the chart',
        `<div class="lwin pad" style="${W}">${rsLive({ at: 220 })}</div>`,
      ],
      [
        'A chip pressed: Over-provisioned; the rows follow',
        `<div class="lwin pad" style="${W}">${rsLive({ chip: 'Over-provisioned' })}</div>`,
      ],
      ['Phone: tiles two across, rows as cards, the open one’s chart full width', phone],
    ],
    [
      [
        'What it is',
        'Right-sizing as the app shows it: four tiles, the chips, the workloads with their status and what they should request, and the first that needs more opened, with its numbers, its reason in the app’s words and its 7 days of use against its request and the recommendation.',
      ],
      [
        'Comes into view',
        'Once: the opened row’s chart draws its use from left to right over 1.2 s, then the recommendation’s line fades in at its level: the reason in a picture. Nothing counts up; numbers are there from the start.',
      ],
      [
        'Pointer',
        'On the chart: a hairline and a dot follow the pointer half-hour by half-hour, with a tip saying when, how much, and what share of its request (“Wed 14:30 · 568m · 114% of its request”: the half-hour’s use, and that over its request of 500m). On a row: the hover fill; pressing opens it and closes the open one.',
      ],
      [
        'Chips and keyboard',
        'The chips are a radio group that filters the rows at once, with the count in each. Rows are buttons (Enter opens). The chart takes focus, and left and right step its hairline; its tip is read out as it moves.',
      ],
      [
        'Tap',
        'Chips and rows as the pointer’s presses; on the chart, a tap places the hairline and a drag moves it. On a phone: two tiles, rows as cards, the open card’s chart full width with the same tap.',
      ],
      [
        'Reduced motion',
        'The chart is drawn whole; the recommendation is there. The hairline still follows, without easing.',
      ],
    ],
  )
}

// ─── The approval ──────────────────────────────────────────────────────────────────────────

function approvalDlg(state: 'waiting' | 'approved' | 'reject', phone = false): string {
  const verdict = `<div class="acc"><span>The cluster accepts it</span><span><span class="n">+1</span> <span class="m">−1</span> lines</span></div>`
  const body = `${diff([
    ['', '  spec:'],
    ['del', '    replicas: 3'],
    ['add', '    replicas: 5'],
    ['', '    selector:'],
  ])}${cmd('kubectl scale deployment/storefront --replicas=5 -n shop --context production')}`
  const foot =
    state === 'approved'
      ? `<div class="part"><div class="done">${icon('circle-check', 16)}<b>Approved</b><span>The cluster scales storefront to 5 replicas.</span><span class="btn ghost sm" style="margin-left:auto">Again</span></div></div>`
      : state === 'reject'
        ? `<div class="part"><label class="rjl">Tell Claude Code why, or what to do instead (optional)</label><span class="kfield rjf">Scale it to 4 instead: the nodes are nearly full.</span><div class="df" style="padding:12px 0 0;border:0"><span class="btn ghost sm">Back</span><span class="btn danger sm">Reject</span></div></div>`
        : `<div class="df" style="justify-content:space-between"><span class="waits">${icon('timer', 14)}Waits 4:37 more</span><span style="display:flex;gap:8px"><span class="btn ghost sm${phone ? '" style="height:44px' : ''}">Reject…</span><span class="btn primary sm"${phone ? ' style="height:44px;padding:0 24px"' : ''}>Approve${phone ? '' : '<span class="kbd2">⌘↩</span>'}</span></span></div>`
  return `<div class="kdlg inplace"><div class="dh"><span class="g">${icon('arrow-up-down', 18)}</span><div><div class="eb">${icon('sparkles', 12)}Claude Code asks</div><h3>Scale Deployment storefront to 5 replicas</h3><div class="sub"><span>Deployment · shop · <b>production</b></span><span class="prodm">Production</span></div></div></div><div class="db"><div class="part"><div class="why"><div class="kcap">Why</div><p>Checkout latency has doubled since 14:00 and storefront’s pods are at 95% CPU: two more replicas spread the load.</p></div>${verdict}${body}</div></div>${foot}</div>`
}

function approvalFrame(): string {
  const S = (
    a: 'on' | 'now' | 'to' | '',
    b: 'on' | 'now' | 'to' | '',
    c: 'on' | 'now' | 'to' | '',
  ) =>
    strip([
      ['Dry-run', a],
      ['Waits', b],
      ['Approved', c],
    ])
  return block(
    'Approval',
    '/ai’s “The cluster tries it first” and home’s AI assistants: it asked first',
    [
      [
        'Coming into view: already tried by the cluster, as the app’s sheet opens; it waits, counting down',
        `<div style="width:560px;display:flex;flex-direction:column;gap:10px">${approvalDlg('waiting')}<div class="lbar">${S('on', 'now', '')}</div><p class="cap">Reject… pressed: the app’s field, its label and example</p>${approvalDlg('reject')}</div>`,
      ],
      [
        'Approve pressed: the demo’s end state (in the app it goes to the session’s activity as Approved, and the cluster rolls out); the strip ends',
        `<div style="width:560px;display:flex;flex-direction:column;gap:10px">${approvalDlg('approved')}<div class="lbar">${S('on', 'on', 'on')}</div></div>`,
      ],
      [
        'Phone: the phone’s own sheet (approving is one of a phone’s changes)',
        phoneFrame(
          'Overview',
          `<div style="padding:12px">${approvalDlg('waiting', true)}</div><div style="padding:0 16px 16px">${S('on', 'now', '')}</div>`,
        ),
      ],
    ],
    [
      [
        'What it is',
        'Lumovi’s approval of an AI assistant’s change, as the app shows it: who asks, the change in its own words, where, Production, the why, the cluster’s verdict with the diff and the command, how long it waits, Reject… and Approve. The strip under it now follows the dialog’s own state (the step it’s at is the accent, steps done carry a check), since it’s no longer a video it would have to keep time with.',
      ],
      [
        'Comes into view',
        'Once: the sheet rises in as the app’s does, already tried by the cluster (an assistant’s change arrives that way), so “The cluster accepts it”, the diff and the command are there and Dry-run is done on the strip; “Waits 5:00 more” then counts down by the second while the block is in view, and pauses out of view.',
      ],
      [
        'Pointer and tap',
        'Approve: “Approved”, as the session’s activity says it, then the demo’s own line, “The cluster scales storefront to 5 replicas.”, and the strip’s last step lights. Reject…: the app’s field, “Tell Claude Code why, or what to do instead (optional)”, its example as the placeholder (“Scale it to 4 instead: the nodes are nearly full.”), then Reject; then “Rejected”. Either way a quiet “Again”, the demo’s own, sets it back to the start. At 0:00 it says, in the app’s words, that it wasn’t approved in time and nothing was changed, with Again.',
      ],
      [
        'Keyboard',
        'Tab reaches Reject… and Approve, the command’s Copy, and Again; Enter presses a focused button, and ⌘↩ (Ctrl+Enter off a Mac) approves from anywhere in the block, as in the app, whose Approve shows the keys. The countdown isn’t read out each second: the strip’s step and the dialog’s state are a polite live region that speaks when the state changes.',
      ],
      [
        'Phone',
        'The phone’s sheet as app-2’s phone-approval screenshot shows it: buttons 44 px, the same sequence and presses.',
      ],
      [
        'Reduced motion',
        'No rise; the wait reads 5:00 and doesn’t tick; the strip is at Waits. Presses work, with no fades.',
      ],
    ],
  )
}

// ─── The audit log ─────────────────────────────────────────────────────────────────────────

const EVENTS: [string, IconName, string, string][] = [
  [
    '01:20:02 PM',
    'arrow-up-down',
    'Scale Deployment recommendations to 12 replicas',
    'ops@example.com · production / shop',
  ],
  [
    '01:12:40 PM',
    'key-round',
    'Read the keys of Secret shop-tls',
    'dev@example.com · production / shop',
  ],
  [
    '12:58:17 PM',
    'terminal',
    'Opened a shell in checkout-jzhdh6j29h-hqnnn',
    'oncall@example.com · production / shop',
  ],
  ['12:40:05 PM', 'log-in', 'Signed in with single sign-on', 'jane@example.com'],
]

function auditLive(o: { running?: number; open?: number; hov?: number } = {}): string {
  const chk =
    o.running !== undefined
      ? `<div class="chk run">${icon('circle-dashed', 16)}<span style="flex:1"><b>Checking 14 events…</b>Each against the one before it, from the oldest kept.<div class="prog" style="--p:${o.running}%"><i></i></div></span></div>`
      : `<div class="chk">${icon('shield-check', 16)}<span><b>All 14 events hold.</b>Each, from the oldest kept (Sep 16, 2026, 9:02 AM) to the newest, follows from the one before it: none was changed, and none removed or put in between them.</span></div>`
  const rows = EVENTS.map(([t, g, what, who], i) => {
    const ev =
      o.open === i
        ? `<div class="aev"><span>Person</span><b>ops@example.com</b><span>Through</span><b>Lumovi’s page</b><span>From</span><b><code>203.0.113.24</code></b><span>Cluster</span><b>production</b><span>Namespace</span><b>shop</b><span>Object</span><b>Deployment recommendations</b><span class="sh">Does the same</span><b class="sh"><code>kubectl scale deployment/recommendations --replicas=12 -n shop --context production</code></b><span class="sh">In the log</span><b class="sh">Place <code>#14</code> · Hash <code>9f2c…a41e</code></b></div>`
        : ''
    return `<div class="arow${o.open === i ? ' open' : ''}${o.hov === i ? ' hov' : ''}"><span class="t">${t}</span><span class="ic">${icon(g, 14)}</span><span style="min-width:0"><b>${what}</b><small>${who}</small></span></div>${ev}`
  }).join('')
  return `<div class="ahd"><h4>Audit log<small>What was done, by whom, and how it went.</small></h4><span style="display:flex;gap:6px"><span class="btn secondary sm">${icon('shield-check', 14)}Check integrity</span><span class="btn secondary sm">${icon('download', 14)}Export</span></span></div>${chk}<div class="adate">Today</div>${rows}`
}

function auditFrame(): string {
  const W = 'width:656px'
  const S = (a: string, b: string, c: string) =>
    strip([
      ['Recorded', a as 'on'],
      ['Chained', b as 'on'],
      ['Checked', c as 'on'],
    ])
  const phone = phoneFrame(
    'Audit log',
    `<div style="padding:12px 16px 4px">${auditLive({ open: 0 })
      .replace('<div class="ahd">', '<div class="ahd" style="display:none">')
      .replace(
        /<div class="arow/g,
        '<div class="arow',
      )}</div><div style="padding:8px 16px 16px">${S('on', 'on', 'on')}</div>`,
  )
  return block(
    'The audit log',
    '/teams’ “And who did.”: on the record, and checkable',
    [
      [
        'Coming into view: the integrity check runs; the strip follows it',
        `<div class="lwin pad" style="${W}">${auditLive({ running: 62, hov: 1 })}<div class="lbar">${S('on', 'now', '')}</div></div>`,
      ],
      [
        'Checked; a row pressed: the event with the app’s fields, what does the same, and its place in the log',
        `<div class="lwin pad" style="${W}">${auditLive({ open: 0 })}<div class="lbar">${S('on', 'on', 'on')}</div></div>`,
      ],
      ['Phone: the check, then the rows as the phone lists them, one opened', phone],
    ],
    [
      [
        'What it is',
        'The audit log’s page as the app shows it to an auditor: its title, Check integrity and Export, the integrity check’s panel, and today’s events: a change, a Secret’s keys read, a shell, a sign-in. Names are example.com’s.',
      ],
      [
        'Comes into view',
        'Once, the strip in step with the page: the rows are there (Recorded), the check panel says “Checking 14 events…” with its bar filling over 1.2 s (Chained; that in-between step is the site’s, as the app shows only the result), then the app’s “All 14 events hold.” in the good colour, with its shield (Checked). Then nothing moves.',
      ],
      [
        'Pointer and tap',
        'Check integrity runs the check again, the same way. A row is a button: its hover fill; pressing it opens the event under it with the app’s own fields: Person, Through, From, Cluster, Namespace, Object, then “Does the same” with the command and its Copy command, and “In the log” with its place and hash. Export is drawn and does nothing on the site; it isn’t a button there.',
      ],
      [
        'Keyboard',
        'Tab to Check integrity and to the rows; up and down move between rows; Enter opens and closes one. The check’s result is a polite live region: “All 14 events hold.”',
      ],
      [
        'Phone',
        'The check panel, then the rows as the phone lists them, 60 px, the time under the action; a tap opens one. The strip under it.',
      ],
      [
        'Reduced motion',
        'The check has already held: the panel says so, the strip is done. Check integrity shows its result at once.',
      ],
    ],
  )
}

export type LiveFrame =
  | 'live-map'
  | 'live-problems'
  | 'live-rollback'
  | 'live-rightsizing'
  | 'live-approval'
  | 'live-audit'

export const LIVE_FRAMES: { id: LiveFrame; title: string; size: Size }[] = [
  { id: 'live-map', title: 'lumovi.dev, live: the map', size: { width: 1840, height: 1400 } },
  {
    id: 'live-problems',
    title: 'lumovi.dev, live: problems first',
    size: { width: 1840, height: 1000 },
  },
  { id: 'live-rollback', title: 'lumovi.dev, live: rollback', size: { width: 1840, height: 1100 } },
  {
    id: 'live-rightsizing',
    title: 'lumovi.dev, live: right-sizing',
    size: { width: 1840, height: 1100 },
  },
  {
    id: 'live-approval',
    title: 'lumovi.dev, live: the approval',
    size: { width: 1840, height: 1400 },
  },
  {
    id: 'live-audit',
    title: 'lumovi.dev, live: the audit log',
    size: { width: 1840, height: 1000 },
  },
]

const INTRO =
  '<header><h1>lumovi.dev’s live blocks</h1><p>Péter (2026-10-13): every block that was a loop is an interactive copy of the app’s UI instead, no video. Each is the app’s own UI in its flat look, laid out at build time so it paints with no script and its rest state is its picture; a small script makes it move once as it comes into view and answer the pointer, the keyboard and a tap. Nothing a visitor does reaches a cluster, and nothing says it does. Drawn at rest, in use, and on a phone; what each does is under it. Blocks that were stills, and the heroes with their films, stay as they are.</p></header>'

/** One of the frames, in one theme. */
export function liveFrame(id: LiveFrame, scheme: Scheme): string {
  const f = LIVE_FRAMES.find((x) => x.id === id)!
  const body = {
    'live-map': mapFrame,
    'live-problems': problemsFrame,
    'live-rollback': rollbackFrame,
    'live-rightsizing': rsFrame,
    'live-approval': approvalFrame,
    'live-audit': auditFrame,
  }[id]()
  return sheet(scheme, f.size.width, `${id === 'live-map' ? INTRO : ''}${body}`)
}
