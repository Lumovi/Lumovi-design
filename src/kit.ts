/**
 * The plugin kit's parts, each drawn with its hard cases before it's built (LMV-262). A part is
 * one of Lumovi's own components, grown: a plugin names it and gives it values, never a class, a
 * color or a width. Every frame shows the part on the desktop and on a phone, with the cases
 * that break a part first (the longest names, several at once, nothing at all, thousands) and
 * its rule in a line beside it.
 *
 * Table is the first, since the pick list's row is its lead. It grows from the app's plain-row
 * table (the one a Service's ports use) and Karpenter's rows, which are the same thing with and
 * without headings.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

/** The lines of a shared stylesheet whose rule starts as `start` does: the app's own values. */
const only = (css: string, start: RegExp) =>
  css
    .split('\n')
    .filter((line) => start.test(line))
    .join('\n')

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 28px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.grid { display: grid; gap: 28px 32px; align-items: start; }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 10px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 640px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }

/* A card, as the app's: the box a table stands in. */
.kcard { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.kcard > h3 { display: flex; align-items: center; margin: 0; padding: 14px 16px 6px; font-size: 13px; font-weight: 600; }
.kcard > h3 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.kcard > .in { padding: 0 16px 12px; }

/* Table. One grid for its heading row and every row: a lead, then columns from one scale. */
.t { display: flex; flex-direction: column; margin: 0 -8px; }
.t .th, .t .tr { display: grid; grid-template-columns: var(--cols); align-items: center; gap: 16px; padding: 0 8px; }
.t .th { height: 28px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.t .th > span { display: flex; min-width: 0; align-items: center; gap: 4px; white-space: nowrap; }
.t .th > .r { justify-content: flex-end; }
.t .th > .sorted { color: var(--text-1); }
.t .th > .can { cursor: default; }
.t .th svg.i { flex: none; }
.t .tr { min-height: 36px; padding-top: 8px; padding-bottom: 8px; border-radius: 8px; }
.t .tr + .tr, .t .th + .tr { margin-top: 2px; }
.t .tr.opens.hover { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.t .tr.focus { box-shadow: 0 0 0 2px var(--accent); }
.t .tr > span { min-width: 0; }
.t .r { text-align: right; font-variant-numeric: tabular-nums; }
.t .q { font-size: 12px; color: var(--text-2); }
.t .q3 { font-size: 12px; color: var(--text-3); }
.t .rest { grid-column: var(--rest); text-align: right; font-size: 12px; color: var(--text-3); }
.t .note { grid-column: 1 / -1; margin: -2px 0 0 18px; display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 12px; line-height: 19px; color: var(--text-2); }
.t .tr.noted { align-items: start; row-gap: 2px; }
.t .tr.noted .lead { align-items: flex-start; }
.t .tr.noted .lead > .dot { margin-top: 6px; }
.t h4 { display: flex; align-items: baseline; gap: 8px; margin: 10px 8px 2px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.t h4:first-child { margin-top: 2px; }
.t h4 small { font-size: 11px; font-weight: 400; letter-spacing: 0; text-transform: none; font-variant-numeric: tabular-nums; }
.t .child { padding-left: 34px; }
.t .twist { display: grid; flex: none; width: 16px; height: 16px; margin-left: -2px; place-items: center; color: var(--text-3); }
.t .more { align-self: flex-start; margin: 6px 0 0 0; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--accent-strong); }

/* The lead: a dot (or none), a name, a quiet word beside it, a line under. */
.lead { display: flex; min-width: 0; align-items: center; gap: 10px; }
.lead > .dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--m); box-shadow: 0 0 0 3px color-mix(in srgb, var(--m) 18%, transparent); }
.lead > .nodot { flex: none; width: 8px; }
.lead > .w { min-width: 0; flex: 1; }
.lead .nm { display: flex; min-width: 0; align-items: baseline; gap: 8px; }
.lead .nm b { min-width: 0; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: clip; }
.lead .nm i { flex: none; max-width: 40%; overflow: hidden; font-style: normal; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.lead small { display: block; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }

/* A meter in a cell, as the app's. */
.mtr { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
.mtr > span:first-child { display: flex; justify-content: space-between; gap: 8px; font-size: 11px; line-height: 14px; color: var(--text-3); }
.mtr > span:first-child b { overflow: hidden; font-weight: 400; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.mtr .tk { height: 6px; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--c) 20%, transparent); }
.mtr .tk i { display: block; height: 100%; border-radius: inherit; background: var(--c); }
.mtr .tk.none { border: 1px dashed var(--line-strong); background: none; }

/* The four states of a table with nothing to list. */
.state { display: flex; min-height: 132px; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 16px; text-align: center; color: var(--text-3); }
.state .tile { display: grid; width: 36px; height: 36px; margin-bottom: 6px; place-items: center; border-radius: 10px; background: var(--surface-3); color: var(--text-2); }
.state b { font-size: 13px; font-weight: 500; color: var(--text-1); }
.state span { max-width: 300px; font-size: 12px; line-height: 18px; }
.state .btn { margin-top: 8px; }
.skel { display: flex; flex-direction: column; gap: 14px; padding: 12px 0 8px; }
.skel i { display: block; height: 10px; border-radius: 5px; background: var(--surface-3); }

/* The scale, drawn as a ruler over a row. */
.ruler { display: grid; grid-template-columns: var(--cols); gap: 16px; margin: 0 0 6px; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 14px; color: var(--accent-strong); }
.ruler span { padding-top: 3px; border-top: 2px solid var(--accent); white-space: nowrap; }
.ruler span:last-child { justify-self: end; min-width: 100%; text-align: right; }

/* A phone, 390 wide, and a table's cards on it. */
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .bar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .bar .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.ph .bar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.ph .sec { padding: 16px; }
.ph .sec + .sec { border-top: 1px solid var(--line); }
.ph .sec > h3 { display: flex; align-items: center; margin: 0 0 10px; font-size: 13px; font-weight: 600; }
.ph .sec > h3 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.ph .sec > h3 .tapb { display: grid; width: 44px; height: 44px; margin: -12px -12px -12px 4px; place-items: center; color: var(--text-2); }
.ph h4 { display: flex; align-items: baseline; gap: 8px; margin: 14px 0 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ph h4:first-of-type { margin-top: 0; }
.ph h4 small { font-weight: 400; letter-spacing: 0; text-transform: none; }
.cards { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; }
.cards > li { display: block; padding: 10px 14px; }
.cards > li + li { border-top: 1px solid var(--line); }
.cards > li.press { background: var(--surface-3); }
.cards > li.kid { padding-left: 38px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); }
ul.cards { margin: 0; padding: 0; list-style: none; }
.cards .top { display: flex; align-items: center; gap: 10px; }
.cards .top .lead { flex: 1; }
.cards .top .twist { display: grid; flex: none; width: 44px; height: 44px; margin: -12px -14px -12px 0; place-items: center; color: var(--text-3); }
.cards dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 8px 0 0 18px; font-size: 12px; line-height: 16px; }
.cards dl.one { grid-template-columns: minmax(0, 1fr); }
.cards dl.bare { margin-left: 0; }
.cards dt { color: var(--text-3); }
.cards dd { margin: 2px 0 0; color: var(--text-1); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.cards .pnote { margin: 6px 0 0 18px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.pmore { display: flex; height: 44px; align-items: center; margin-top: 4px; font-size: 13px; font-weight: 500; color: var(--accent-strong); }
`

const LEVEL: Record<Level, string> = {
  critical: 'critical',
  warning: 'warn',
  progressing: 'neutral',
  healthy: 'good',
  neutral: 'neutral',
}

interface Lead {
  /** Its dot's level; without one the name starts where a dot's would. */
  level?: Level
  name: string
  /** A quiet word beside the name: its namespace, say. */
  beside?: string
  /** One line under the name. */
  under?: string
}

/** The lead cell: what a row is called. A long name is cut in its middle, its last six kept. */
function lead(l: Lead, o: { fit?: number; twist?: 'open' | 'closed' } = {}): string {
  const name = o.fit && l.name.length > o.fit ? cut(l.name, o.fit) : escape(l.name)
  const dot = l.level
    ? `<span class="dot" style="--m:var(--${LEVEL[l.level]})"></span>`
    : '<span class="nodot"></span>'
  const twist = o.twist
    ? `<span class="twist">${icon(o.twist === 'open' ? 'chevron-down' : 'chevron-right', 14)}</span>`
    : ''
  return `<span class="lead">${twist}${dot}<span class="w"><span class="nm"><b>${name}</b>${l.beside ? `<i>${escape(l.beside)}</i>` : ''}</span>${l.under ? `<small>${escape(l.under)}</small>` : ''}</span></span>`
}

/** A name cut in its middle to `fit` characters, its last six kept, as the phone layout cuts one. */
function cut(name: string, fit: number): string {
  const head = Math.max(4, fit - 7)
  return `${escape(name.slice(0, head))}…${escape(name.slice(-6))}`
}

/** A meter in a cell, as the app's: amber from 75% of its whole, red from 90%. */
const meter = (label: string, text: string, pct?: number) => {
  const color = pct === undefined || pct < 75 ? 'series-1' : pct < 90 ? 'warn' : 'critical'
  const track =
    pct === undefined
      ? '<span class="tk none"></span>'
      : `<span class="tk" style="--c:var(--${color})"><i style="width:${pct}%"></i></span>`
  return `<span class="mtr"><span>${label}<b>${text}</b></span>${track}</span>`
}

interface Row {
  cells: string[]
  cls?: string
  note?: string
}

function table(cols: string, heads: string[] | null, rows: (Row | string)[]): string {
  const th = heads
    ? `<div class="th" role="row">${heads.map((h) => (h.startsWith('<') ? h : `<span>${h}</span>`)).join('')}</div>`
    : ''
  const tr = rows
    .map((r) =>
      typeof r === 'string'
        ? r
        : `<div class="tr ${r.cls ?? ''}${r.note ? ' noted' : ''}" role="row">${r.cells.join('')}${r.note ? `<span class="note">${escape(r.note)}</span>` : ''}</div>`,
    )
    .join('')
  return `<div class="t" style="--cols:${cols}">${th}${tr}</div>`
}

const head = (text: string, o: { r?: boolean; sorted?: 'up' | 'down'; can?: boolean } = {}) =>
  `<span class="${[o.r ? 'r' : '', o.sorted ? 'sorted' : '', o.can ? 'can' : ''].join(' ')}">${text}${o.sorted ? icon(o.sorted === 'up' ? 'arrow-up' : 'arrow-down', 12) : ''}</span>`

const card = (title: string, note: string, body: string) =>
  `<div class="kcard"><h3>${title}${note ? `<small>${note}</small>` : ''}</h3><div class="in">${body}</div></div>`

const spec = (title: string, sub: string, body: string, rule: string) =>
  `<section class="spec"><h2>${title}<i>${sub}</i></h2>${body}<p>${rule}</p></section>`

const LONG = 'checkout-payments-reconciliation-worker-eu-west-1-blue-canary-7d9f6c5b8-x2kqp'
const WHY =
  '0/9 nodes are available: 3 Insufficient memory, 6 node(s) didn’t match Pod’s node affinity/selector. preemption: 0/9 nodes are available: 9 No preemption victims found for incoming pod.'

// ─── Table, on the desktop ─────────────────────────────────────────────────────────────────

/** 1. The lead and the scale: every column a table can have, measured. */
function anatomy(): string {
  const cols = 'minmax(0,1.4fr) 88px minmax(0,1fr) 144px 28px'
  const ruler = `<div class="ruler" style="--cols:${cols}"><span>lead · wide, 1.4 shares</span><span>narrow · 88</span><span>normal · a share</span><span>status · 144</span><span>as its text</span></div>`
  return spec(
    'The lead, and the scale',
    'what a row is called, then columns from five widths',
    card(
      'Node pools',
      '3',
      `${ruler}${table(cols, null, [
        {
          cells: [
            lead({ level: 'healthy', name: 'general', under: 'On demand and spot · amd64' }),
            '<span class="q r">7 nodes</span>',
            meter('CPU', '24 of 64 cores', 38),
            `<span>${pill('healthy', 'Ready')}</span>`,
            '<span class="q3 r">41d</span>',
          ],
        },
        {
          cells: [
            lead({ level: 'warning', name: 'batch', under: 'Spot only · arm64' }),
            '<span class="q r">12 nodes</span>',
            meter('CPU', '105 of 128 cores', 82),
            `<span>${pill('warning', 'Near its limit')}</span>`,
            '<span class="q3 r">9d</span>',
          ],
        },
        {
          cells: [
            lead({ name: 'gpu', under: 'No nodes yet' }),
            '<span class="q r">0 nodes</span>',
            meter('CPU', 'no limit'),
            `<span>${pill('neutral', 'Idle')}</span>`,
            '<span class="q3 r">2h</span>',
          ],
        },
      ])}`,
    ),
    'A row starts with its <b>lead</b>: a dot in a status’s level (or none, and the name keeps its place), a name, optionally a quiet word beside it and one line under. After it come columns from <b>one scale</b>: narrow (88 px), normal (a share), wide (1.4 shares), a Status’s own 144 px, or as wide as its text, which is the widest value in that column, measured from the rows’ data and not from the rows drawn, so every row agrees and nothing shifts as a long table scrolls; <b>16 px between columns</b>, always. A plugin picks from the scale and never gives a width. Numbers and ages stand right and use tabular figures. A row with one line is 36 px, with a line under 52.',
  )
}

/** 2. Headings and sorting: a table with none is Karpenter's rows; with them it sorts. */
function sorting(): string {
  const cols = 'minmax(0,1.4fr) 144px 88px 88px'
  return spec(
    'Headings, and sorting',
    'a table without headings is a list of rows',
    card(
      'Certificates',
      '4',
      table(
        cols,
        [
          head('Name', { can: true }),
          head('Status', { sorted: 'down', can: true }),
          head('Renews', { r: true, can: true }),
          head('Age', { r: true, can: true }),
        ],
        [
          {
            cells: [
              lead({ level: 'critical', name: 'payments-tls', beside: 'shop' }),
              `<span>${pill('critical', 'Failed')}</span>`,
              '<span class="q r">—</span>',
              '<span class="q3 r">88d</span>',
            ],
          },
          {
            cells: [
              lead({ level: 'warning', name: 'storefront-tls', beside: 'shop' }),
              `<span>${pill('warning', 'Expires soon')}</span>`,
              '<span class="q r">in 3d</span>',
              '<span class="q3 r">87d</span>',
            ],
            cls: 'opens hover',
          },
          {
            cells: [
              lead({ level: 'healthy', name: 'api-tls', beside: 'platform' }),
              `<span>${pill('healthy', 'Ready')}</span>`,
              '<span class="q r">in 61d</span>',
              '<span class="q3 r">29d</span>',
            ],
            cls: 'focus',
          },
          {
            cells: [
              lead({ level: 'healthy', name: 'grafana-tls', beside: 'monitoring' }),
              `<span>${pill('healthy', 'Ready')}</span>`,
              '<span class="q r">in 74d</span>',
              '<span class="q3 r">16d</span>',
            ],
          },
        ],
      ),
    ),
    'A plugin <b>names every column, always</b> (a phone labels its facts with the names, a screen reader says them) and says separately whether headings show; a table without them is a list of rows, as Karpenter’s cards are. A column sorts if the plugin says it can: its heading is then a button, the sorted one in the stronger color with an arrow, and <b>a Status sorts worst first</b> by level, not by its word. A row that <b>opens something</b> is one target, edge to edge: a fill under the pointer (second row), the focus ring from the keyboard (third), and no chevron. <b>Keys:</b> Tab reaches the table, up and down move between rows, Enter opens, and the headings are stops before the rows.',
  )
}

/** 3. Groups, rows that nest, and "show all". */
function structure(): string {
  const cols = 'minmax(0,1.4fr) minmax(0,1fr) 144px'
  const R = (
    l: Lead,
    a: string,
    s: string,
    o: Partial<Row> & { twist?: 'open' | 'closed' } = {},
  ) => ({
    cells: [lead(l, { twist: o.twist }), `<span class="q">${a}</span>`, `<span>${s}</span>`],
    cls: o.cls,
  })
  return spec(
    'Groups, rows that nest, and “show all”',
    'one level of each',
    card(
      'Resources',
      '5 of 23',
      `${table(
        cols,
        [head('Name'), head('Sync'), head('Health')],
        [
          '<h4>Workloads <small>3</small></h4>',
          R(
            { level: 'healthy', name: 'storefront', under: 'Deployment' },
            'Synced',
            pill('healthy', 'Healthy'),
            { twist: 'closed' },
          ),
          R(
            { level: 'healthy', name: 'checkout', under: 'Deployment' },
            'Synced',
            pill('healthy', 'Healthy'),
            { twist: 'closed' },
          ),
          R(
            { level: 'critical', name: 'cart', under: 'Deployment' },
            'Out of sync',
            pill('critical', 'Degraded'),
            { twist: 'open' },
          ),
          R(
            { level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' },
            '',
            pill('healthy', 'Running'),
            { cls: 'child' },
          ),
          R(
            { level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' },
            '',
            pill('critical', 'CrashLoopBackOff'),
            { cls: 'child' },
          ),
          '<h4>Network <small>2</small></h4>',
          R(
            { level: 'healthy', name: 'storefront', under: 'Service' },
            'Synced',
            pill('healthy', 'Healthy'),
          ),
          R(
            { level: 'neutral', name: 'shop-old', under: 'Ingress' },
            'Not in the repository',
            pill('neutral', 'Unknown'),
          ),
        ],
      )}<span class="t"><span class="more">Show all 23</span></span>`,
    ),
    '<b>Groups</b> are the table’s own: a heading in small capitals with its count, never one a plugin places by hand. <b>A row may hold rows</b>, one level: a chevron before the dot opens it, its rows stand set in under its name and are rows like any other. A plugin says how many rows show first; the rest are behind <b>“Show all 23”</b>, which opens them in place. The count is of rows at the top level (here 3 and 2 of 23), never of the rows inside them. Past a few hundred the table draws only the rows in view, so 2,500 feel like 25. <b>Keys:</b> right opens a row, left closes it; a group’s heading is not a stop.',
  )
}

/** 4. The hard cases: the longest name, a note, a cell that takes the rest. */
function hard(): string {
  const cols = 'minmax(0,1fr) 88px 88px'
  return spec(
    'The longest name, a note, a cell that takes the rest',
    'what breaks a row first',
    `${card(
      'Nodes',
      '',
      table(cols, null, [
        {
          cells: [
            lead(
              {
                level: 'healthy',
                name: 'worker-eu-west-1a-m6i-2xlarge-on-demand-4f1c9aa7',
                under: 'm6i.2xlarge · on demand · eu-west-1a',
              },
              { fit: 38 },
            ),
            meter('CPU', '62%', 62),
            meter('Memory', '81%', 81),
          ],
        },
        {
          cells: [
            lead({
              level: 'healthy',
              name: 'worker-2',
              under: 'c7g.xlarge · spot · eu-west-1b',
            }),
            '<span class="rest" style="--rest:2 / 4">Ready · 4 cores</span>',
          ],
        },
      ]),
    )}${card(
      'Waiting for a node',
      '2',
      table('minmax(0,1fr) 28px', null, [
        {
          cells: [
            lead({ level: 'warning', name: LONG, beside: 'shop' }, { fit: 34 }),
            '<span class="q3 r">11m</span>',
          ],
          note: WHY,
        },
        {
          cells: [
            lead({ level: 'warning', name: 'reports-nightly-28931', beside: 'data' }),
            '<span class="q3 r">2m</span>',
          ],
          note: '0/9 nodes are available: 9 Insufficient cpu.',
        },
      ]),
    )}`,
    '<b>A name is never cut at its end.</b> Too long for its column, it loses its middle and keeps its last six characters, where a pod’s or a node’s name differs from its neighbours; the whole name is its title on hover and what a screen reader says. The word beside it gives way first (to 40% of the lead at most), then the name; the line under is the one thing cut at its end. <b>A row’s last cell may take the rest of the row</b> (second node: no meters to show, so words in their place); no other spans. <b>A note</b> runs under the whole row from the name’s left edge, two lines at most, then “…”; with a note the dot sits on the name’s line.',
  )
}

/** 5. Nothing to list: busy, failed, empty, quiet. */
function states(): string {
  const box = (title: string, body: string) => card(title, '', body)
  return spec(
    'Nothing to list',
    'busy, failed, empty, quiet',
    `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">
      ${box('Certificates', `<div class="skel"><i style="width:70%"></i><i style="width:52%"></i><i style="width:61%"></i></div>`)}
      ${box('Certificates', `<div class="state"><span class="tile">${icon('triangle-alert', 18)}</span><b>Couldn’t list certificates</b><span>certificates.cert-manager.io is forbidden for jane@example.com in shop.</span><span class="btn secondary sm">Try again</span></div>`)}
      ${box('Certificates', `<div class="state"><span class="tile">${icon('search', 18)}</span><b>No certificates</b><span>Nothing in shop matches “tls-old”.</span></div>`)}
      ${box('Waiting for a node', `<div class="state">${icon('circle-check', 22, 2, 'color:var(--good)')}<span style="margin-top:4px">No pods are waiting for a node.</span></div>`)}
    </div>`,
    'One part with four states, and the plugin says which and gives the words. <b>Busy</b> is a skeleton of rows, as the app’s list pages have, never the spinner; the part brings its own. <b>Failed</b> says what couldn’t be read in the cluster’s own words, with Try again. <b>Empty</b> has the tile, a title and a line. <b>Quiet</b> is for nothing to list and nothing wrong: one calm line, with a check if that’s good news. A filter that leaves nothing is Empty and names the filter.',
  )
}

// ─── Table, on a phone ─────────────────────────────────────────────────────────────────────

const fact = (label: string, value: string) => `<div><dt>${label}</dt><dd>${value}</dd></div>`

function phoneFrame(title: string, body: string): string {
  return `<div class="ph"><div class="bar"><span class="tap">${icon('arrow-left', 20)}</span><h1>${title}</h1></div>${body}</div>`
}

/** 6. On a phone a row is a card: the lead, then its other columns as labelled facts. */
function phoneCards(): string {
  const a = phoneFrame(
    'Karpenter',
    `<div class="sec"><h3>Node pools<small>3</small></h3><ul class="cards">
      <li><div class="top">${lead({ level: 'healthy', name: 'general', under: 'On demand and spot · amd64' })}</div><dl>${fact('Nodes', '7')}${fact('CPU', '24 of 64')}${fact('Status', 'Ready')}</dl></li>
      <li class="press"><div class="top">${lead({ level: 'warning', name: 'batch', under: 'Spot only · arm64' })}</div><dl>${fact('Nodes', '12')}${fact('CPU', '105 of 128')}${fact('Status', 'Near its limit')}</dl></li>
      <li><div class="top">${lead({ name: 'gpu', under: 'No nodes yet' })}</div><dl>${fact('Nodes', '0')}${fact('CPU', 'no limit')}${fact('Status', 'Idle')}</dl></li>
    </ul></div>
    <div class="sec"><h3>Waiting for a node<small>2</small></h3><ul class="cards">
      <li><div class="top">${lead({ level: 'warning', name: LONG, beside: 'shop' }, { fit: 30 })}</div><p class="pnote">0/9 nodes are available: 3 Insufficient memory, 6 node(s) didn’t match Pod’s node affinity/selector. preemption: 0/9 nodes are…</p><dl class="one">${fact('Waiting', '11m')}</dl></li>
    </ul></div>`,
  )
  const b = phoneFrame(
    'Argo CD',
    `<div class="sec"><h3>Resources<small>5 of 23</small><span class="tapb">${icon('arrow-up-down', 16)}</span></h3>
      <h4>Workloads <small>3</small></h4>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Deployment' })}<span class="twist">${icon('chevron-right', 16)}</span></div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'healthy', name: 'checkout', under: 'Deployment' })}<span class="twist">${icon('chevron-right', 16)}</span></div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'critical', name: 'cart', under: 'Deployment' })}<span class="twist">${icon('chevron-down', 16)}</span></div><dl class="one">${fact('Sync', 'Out of sync')}${fact('Health', 'Degraded')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' })}</div><dl class="one">${fact('Health', 'Running')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' })}</div><dl class="one">${fact('Health', 'CrashLoopBackOff')}</dl></li>
      </ul>
      <h4>Network <small>2</small></h4>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Service' })}</div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'neutral', name: 'shop-old', under: 'Ingress' })}</div><dl class="one">${fact('Sync', 'Not in the repository')}${fact('Health', 'Unknown')}</dl></li>
      </ul>
      <div class="pmore">Show all 23</div>
    </div>`,
  )
  return `<section class="spec"><h2>On a phone<i>a row is a card</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${a}${b}</div><p style="max-width:820px">Under 640 px <b>a row is a card</b>, by the phone layout’s own rule: its lead first, as on the desktop, then its other columns as labelled facts. Facts stand side by side <b>only when every value in the table fits a third</b> on one line; otherwise each takes a line, in every card of that table, its groups included, so a table’s cards all read the same way (right: “Not in the repository” doesn’t fit, so all of Resources stacks; left: Node pools’ values all fit). The facts’ labels are the columns’ names, which is why a plugin names every column even where no headings show. A meter becomes its words; a Status keeps its word and the lead’s dot keeps its level. A note stands under the lead, three lines at most. A row that opens is the whole card (second card, pressed). A row that holds rows has a 44 px chevron at its right; its rows are cards set in beneath it, closed until asked. A group’s heading stands above its cards. <b>Sorting</b> is the phone’s Sort sheet, from the button in the table’s heading, listing the columns that sort.</p></section>`
}

// ─── Frames ────────────────────────────────────────────────────────────────────────────────

export type KitFrame = 'table' | 'table-phone'

export const KIT_FRAMES: { id: KitFrame; title: string; size: Size }[] = [
  { id: 'table', title: 'Table, on the desktop', size: { width: 1440, height: 1560 } },
  { id: 'table-phone', title: 'Table, on a phone', size: { width: 920, height: 1040 } },
]

/** One of the kit's frames, in one theme. */
export function kitFrame(id: KitFrame, scheme: Scheme): string {
  const f = KIT_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'table'
      ? `<header><h1>Table</h1><p>What a plugin lists things with. It grows from the app’s plain-row table and Karpenter’s rows, which are one thing with and without headings. A plugin gives rows as data and names each column and its kind; Lumovi draws them. When the app’s own detail tables move onto it, their rows go from about 32 to 36 px and a long name takes the middle cut where today it wraps: both meant.</p></header>
        <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">${anatomy()}${sorting()}${structure()}${hard()}</div>
        ${states()}`
      : phoneCards()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${only(PARTS, /^(\* |svg\.i|\.btn)/)}
${only(SHELL, /^\.spill/)}
${CSS}
</style><div class="sheet">${body}</div>`
}
