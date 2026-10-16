/**
 * Compare two objects, or the same object in two clusters (LMV-173), as app-2's plan and the PM's
 * rulings have it: "Compare with…" on every kind, a picker, and a page of its own with a diff that
 * leaves out status and cluster-set fields until asked; for a workload, the config it references,
 * paired. Read-only throughout, and off on a phone at first. Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { CSS as HELM } from './helm.ts'
import { escape, only } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, win } from './windows.ts'

const MASK = '••••••••'

const CSS = `${WINDOW}
${only(HELM, /^(\.ad|\.prodm)/)}
.row { display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.col { display: flex; width: 600px; min-width: 0; flex-direction: column; gap: 8px; }
.col.n { width: 420px; }
.ad footer .btn { height: 32px; padding: 0 12px; font-size: 13px; }
.ad footer .btn.off { opacity: 0.5; }
.ad .sub2 { display: flex; align-items: center; gap: 6px; margin: 2px 0 0; font-size: 12px; line-height: 16px; color: var(--text-3); }
.ad .sub2 b { font-weight: 500; color: var(--text-2); }
.ad .fl { display: flex; flex-direction: column; gap: 6px; }
.ad .fl > span { font-size: 12px; font-weight: 500; color: var(--text-2); }
.ad .sel { display: inline-flex; width: 220px; height: 32px; align-items: center; gap: 8px; padding: 0 8px 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; }
.ad .sel svg.i { margin-left: auto; color: var(--text-3); }
.ad .in { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-3); }
.ad .in svg.i { color: var(--text-3); }

/* The picker's lists: a cluster a row, an object a row. */
.pk { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.pk .o { display: flex; min-height: 40px; align-items: center; gap: 10px; padding: 6px 12px; font-size: 13px; }
.pk .o + .o { border-top: 1px solid var(--line); }
.pk .o.on { background: var(--accent-soft); }
.pk .o .rd { width: 14px; height: 14px; flex: none; border: 1.5px solid var(--line-strong); border-radius: 50%; background: var(--surface); }
.pk .o.on .rd { border: 4px solid var(--accent); }
.pk .o .dot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--good); }
.pk .o .dot.off { background: var(--line-strong); }
.pk .o .cword { min-width: 0; flex: 1; }
.pk .o .cword b { font-weight: 500; }
.pk .o .cword small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.pk .o .tag { flex: none; font-size: 12px; color: var(--text-3); }
.pk .o .mono { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.pk .empty { display: flex; gap: 10px; padding: 14px 12px; font-size: 13px; line-height: 1.55; color: var(--text-2); }
.pk .empty svg.i { flex: none; margin-top: 3px; color: var(--text-3); }

/* The object's More actions, as built since LMV-193, with Compare with… after Copy link. */
.pm { width: 240px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.pm .lbl { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.pm .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.pm .mi svg.i { color: var(--text-3); }
.pm .mi.hl { background: var(--surface-3); }
.pm .mi.danger, .pm .mi.danger svg.i { color: var(--critical-text); }
.pm .mi .k { margin-left: auto; font-size: 12px; color: var(--text-3); }
.pm hr { height: 1px; margin: 4px; border: 0; background: var(--line); }

/* The comparison page. */
.cp { display: flex; flex: 1; min-height: 0; flex-direction: column; overflow: hidden; }
.sides { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: stretch; gap: 10px; padding: 16px 20px 12px; }
.side { display: flex; min-width: 0; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); }
.side .sg { display: grid; width: 22px; height: 22px; flex: none; place-items: center; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; }
.side .sg.l { background: color-mix(in srgb, var(--critical) 12%, transparent); color: var(--critical-text); }
.side .sg.r { background: color-mix(in srgb, var(--good) 12%, transparent); color: var(--good-text); }
.side .cword { min-width: 0; flex: 1; }
.side .cword p { display: flex; align-items: center; gap: 6px; margin: 0; font-size: 12px; line-height: 16px; color: var(--text-3); }
.side .cword p b { font-weight: 500; color: var(--text-2); }
.side .cword h3 { display: flex; align-items: center; gap: 6px; margin: 2px 0 0; overflow: hidden; font-size: 15px; line-height: 21px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; }
.side .cword h3 svg.i { color: var(--text-3); }
.side.bad { border-color: color-mix(in srgb, var(--critical) 35%, transparent); }
.side .why { display: block; margin-top: 2px; font-size: 12px; line-height: 17px; color: var(--critical-text); }
.swap { display: grid; width: 32px; align-self: center; height: 32px; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); }
.cbar { display: flex; align-items: center; gap: 10px; padding: 0 20px 12px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--text-2); }
.cbar .plus { font-weight: 500; color: var(--good-text); font-variant-numeric: tabular-nums; }
.cbar .minus { font-weight: 500; color: var(--critical-text); font-variant-numeric: tabular-nums; }
.cbar .q3 { color: var(--text-3); }
.cbar .grow { flex: 1; }
.tg { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1); }
.tg .sw { position: relative; width: 30px; height: 18px; border-radius: 999px; background: var(--line-strong); }
.tg .sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); }
.tg.on .sw { background: var(--accent); }
.tg.on .sw::after { left: 14px; }
.cbody { flex: 1; min-height: 0; overflow: hidden; padding: 12px 20px 16px; }
.sec { margin: 14px 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sec small { margin-left: 6px; font-size: 12px; font-weight: 400; letter-spacing: 0; text-transform: none; }

/* DiffView, as built. */
.diff { margin: 0; padding: 8px 0; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; }
.diff > div { padding: 0 16px; white-space: pre; color: var(--text-2); }
.diff .a { background: color-mix(in srgb, var(--good) 10%, transparent); color: var(--good-text); }
.diff .r { background: color-mix(in srgb, var(--critical) 10%, transparent); color: var(--critical-text); }
.diff .gap { margin: 4px 0; padding: 2px 16px; background: color-mix(in srgb, var(--surface-3) 60%, transparent); font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text-3); }
.diff .sg { display: inline-block; width: 12px; margin-right: 12px; color: var(--text-3); }
.diff .mk { padding: 0 3px; border-radius: 3px; background: color-mix(in srgb, var(--surface-3) 80%, transparent); }
.diff .wh { display: inline-flex; align-items: center; gap: 4px; padding: 0 6px; border-radius: 5px; background: var(--surface-3); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--text-2); }
.diff .so { font-family: 'Inter', sans-serif; font-style: italic; opacity: 0.85; }
.diff.plain > div { padding-left: 16px; }

/* The config it references: a pair a row; the one that differs opened. */
.pairs { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; }
.pr { display: grid; grid-template-columns: 16px 18px minmax(0, 1fr) auto; align-items: center; gap: 10px; min-height: 44px; padding: 6px 12px; font-size: 13px; }
.pairs > * + * { border-top: 1px solid var(--line); }
.pr > svg.i { color: var(--text-3); }
.pr .cword b { font-weight: 500; }
.pr .cword small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.pr .st { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--text-3); white-space: nowrap; }
.pr .st.d .plus { color: var(--good-text); font-weight: 500; }
.pr .st.d .minus { color: var(--critical-text); font-weight: 500; }
.pr .st.only { color: var(--warn-text); }
.pin { padding: 0 12px 12px 54px; }
.pin .bar2 { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; color: var(--text-3); }
.pin .bar2 .grow { flex: 1; }
.pin .bar2 .btn { height: 26px; padding: 0 8px; font-size: 12px; }
.pin .note { display: flex; gap: 6px; margin: 8px 0 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.pin .note svg.i { flex: none; margin-top: 1px; }

/* States. */
.none { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 48px 0; text-align: center; }
.none .g { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 14px; background: var(--surface-3); color: var(--good-text); }
.none h3 { margin: 6px 0 0; font-size: 15px; font-weight: 600; }
.none p { margin: 0; max-width: 460px; font-size: 13px; line-height: 1.55; color: var(--text-2); }
.none p a { color: var(--accent-strong); text-decoration: none; }
.only1 { display: flex; gap: 8px; margin: 0 0 8px; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.only1 svg.i { flex: none; margin-top: 1px; color: var(--text-3); }
.panelx { position: relative; display: flex; width: 1376px; height: 560px; overflow: hidden; border-radius: 12px; background: var(--surface); box-shadow: 0 0 0 1px var(--line-strong); }
`

// ─── Data ───────────────────────────────────────────────────────────────────────────────────

const L = { cluster: 'production-eu', prod: true }
const R = { cluster: 'staging', prod: false }

type D = ['a' | 'r' | 's' | 'gap', string]

const MAIN: D[] = [
  ['gap', '6 unchanged lines'],
  ['s', 'spec:'],
  ['r', '  replicas: 6'],
  ['a', '  replicas: 2'],
  ['gap', '14 unchanged lines'],
  ['s', '      containers:'],
  ['s', '        - name: api'],
  ['r', '          image: ghcr.io/acme/checkout:1.14.0'],
  ['a', '          image: ghcr.io/acme/checkout:1.15.0-rc.2'],
  ['s', '          env:'],
  ['s', '            - name: PAYMENTS_URL'],
  ['r', '              value: https://payments.prod.internal'],
  ['a', '              value: https://payments.staging.internal'],
  ['a', '            - name: FEATURE_NEW_CART'],
  ['a', '              value: "true"'],
  ['gap', '9 unchanged lines'],
  ['s', '          resources:'],
  ['s', '            limits:'],
  ['r', '              memory: 512Mi'],
  ['a', '              memory: 256Mi'],
  ['gap', '12 unchanged lines'],
]

/** With status and cluster-set fields shown: what else differs, which is noise for this question. */
const NOISY: D[] = [
  ['s', 'metadata:'],
  ['r', '  creationTimestamp: "2026-07-21T09:14:03Z"'],
  ['a', '  creationTimestamp: "2026-10-02T16:40:51Z"'],
  ['r', '  generation: 41'],
  ['a', '  generation: 7'],
  ['s', '  name: checkout'],
  ['s', '  namespace: shop'],
  ['r', '  resourceVersion: "48211903"'],
  ['a', '  resourceVersion: "1220443"'],
  ['r', '  uid: 3f2a9c1e-77b0-4d1e-9a51-0c6e2f1b8d42'],
  ['a', '  uid: a8d05e7c-1b3f-4c29-8e6a-5d2b9f0c4e17'],
  ['gap', '4 unchanged lines'],
  ...MAIN.slice(1, -1),
  ['gap', '12 unchanged lines'],
  ['s', 'status:'],
  ['r', '  availableReplicas: 6'],
  ['a', '  availableReplicas: 2'],
  ['r', '  observedGeneration: 41'],
  ['a', '  observedGeneration: 7'],
]

const lines = (ds: D[], plain = false) =>
  `<pre class="diff${plain ? ' plain' : ''}">${ds
    .map(([t, text]) =>
      t === 'gap'
        ? `<div class="gap"><span class="sg">⋯</span>${text}</div>`
        : `<div class="${t === 's' ? '' : t}">${plain ? '' : `<span class="sg">${{ a: '+', r: '−', s: ' ' }[t]}</span>`}${text.includes('<span') ? text : escape(text)}</div>`,
    )
    .join('')}</pre>`

// ─── Parts ──────────────────────────────────────────────────────────────────────────────────

const prodm = '<span class="prodm">Production</span>'

const side = (
  which: 'l' | 'r',
  o: { cluster: string; prod: boolean },
  ns: string,
  name: string,
  bad?: string,
) =>
  `<div class="side${bad ? ' bad' : ''}"><span class="sg ${which}">${which === 'l' ? '−' : '+'}</span><span class="cword"><p><b>${o.cluster}</b>${o.prod ? prodm : ''}<span>· ${ns}</span></p><h3>${icon('layers', 14)}${name}<span style="font-size:12px;font-weight:400;color:var(--text-3)">Deployment</span></h3>${bad ? `<span class="why">${bad}</span>` : ''}</span></div>`

const sides = (bad?: string) =>
  `<div class="sides">${side('l', L, 'shop', 'checkout')}<span class="swap" title="Swap sides">${icon('arrow-left-right', 16)}</span>${side('r', R, 'shop', 'checkout', bad)}</div>`

const cbar = (
  o: {
    plus?: number
    minus?: number
    on?: boolean
    hidden?: number
    none?: boolean
    unread?: string
  } = {},
) =>
  `<div class="cbar">${o.unread ? `<span class="q3">Nothing to compare until ${o.unread} is read</span>` : o.none ? '<span class="q3">No differences</span>' : `<span><span class="minus">−${o.minus}</span> <span class="plus">+${o.plus}</span> lines</span>`}${o.hidden ? `<span class="q3">· ${o.hidden} lines of status and cluster-set fields left out</span>` : ''}<span class="grow"></span><span class="tg${o.on ? ' on' : ''}"><span class="sw"></span>Show status and cluster-set fields</span><span class="btn">Change…</span><span class="btn">${icon('rotate-cw', 14)}Refresh</span></div>`

/** The config a workload references, paired by where it's referenced. */
function pairs(
  o: { reveal?: 'both' | 'left-only'; revealed?: boolean } = { reveal: 'both' },
): string {
  const v = (t: string) =>
    o.revealed ? `<span class="so">${t}</span>` : `<span class="mk">${MASK}</span>`
  const secret = lines([
    ['s', 'data:'],
    ['s', `  host: <span class="mk">${MASK}</span>`],
    ['r', `  password: ${v('‹its value on production-eu›')}`],
    ['a', `  password: ${v('‹its value on staging›')}`],
    ['s', `  user: <span class="mk">${MASK}</span>`],
  ])
  const bar =
    o.reveal === 'left-only'
      ? `<div class="bar2"><span>Secrets’ values hidden</span><span class="grow"></span><span class="btn ghost">${icon('eye', 14)}Reveal production-eu’s values</span></div>`
      : `<div class="bar2"><span>Secrets’ values hidden</span><span class="grow"></span><span class="btn ghost">${icon('eye', 14)}Reveal values</span></div>`
  const note =
    o.reveal === 'left-only'
      ? `<p class="note">${icon('lock', 14)}<span>staging’s stay hidden: your access there shows only their keys.</span></p>`
      : ''
  return `<p class="sec">Config it references<small>3 pairs</small></p><div class="pairs">
    <div class="pr">${icon('chevron-right', 16)}${icon('file-code-2', 16)}<span class="cword"><b>checkout-config</b><small>ConfigMap · envFrom, container api</small></span><span class="st">${icon('check', 12)} The same</span></div>
    <div><div class="pr">${icon('chevron-down', 16)}${icon('key-round', 16)}<span class="cword"><b>checkout-db</b><small>Secret · env DB_PASSWORD, container api</small></span><span class="st d"><span class="minus">−1</span> <span class="plus">+1</span></span></div><div class="pin">${bar}${secret}${note}</div></div>
    <div class="pr">${icon('chevron-right', 16)}${icon('file-code-2', 16)}<span class="cword"><b>checkout-flags</b><small>ConfigMap · volume flags, container api</small></span><span class="st only">Only on staging</span></div>
  </div>`
}

const cmpWin = (body: string, h = 900) =>
  win({
    w: 1376,
    h,
    cluster: 'production-eu',
    nav: '',
    title: 'Compare',
    glyph: 'git-compare',
    page: `<div class="cp">${body}</div>`,
    dock: dock([]),
    more: true,
  }).replace(/<span class="ns">[\s\S]*?<\/span><span class="find">/, '<span class="find">')

// ─── 1. Compare with…, and the picker ───────────────────────────────────────────────────────

const mi = (
  glyph: IconName,
  label: string,
  o: { hl?: boolean; k?: string; danger?: boolean } = {},
) =>
  `<span class="mi${o.hl ? ' hl' : ''}${o.danger ? ' danger' : ''}">${icon(glyph, 16)}${label}${o.k ? `<span class="k">${o.k}</span>` : ''}</span>`

const MORE = `<div class="pm"><div class="lbl">Actions</div>${mi('link', 'Copy link')}${mi('git-compare', 'Compare with…', { hl: true })}<hr>${mi('tag', 'Edit labels…')}${mi('pencil', 'Edit YAML')}<hr>${mi('trash-2', 'Delete…', { k: '⌘ ⌫', danger: true })}</div>`

type Objects = 'list' | 'not-served' | 'none' | 'forbidden'

function picker(o: { cluster: string; objects: Objects; kind?: string }): string {
  const clusters: [string, string, boolean, boolean, string][] = [
    ['production-eu', 'This one', true, true, ''],
    ['staging', '', false, true, ''],
    ['prod-us', '', true, true, ''],
    [
      'dev-anna',
      '',
      false,
      false,
      'Not open yet: picking it opens it, and it may ask you to sign in.',
    ],
  ]
  const crow = ([name, tag, prod, open, note]: (typeof clusters)[number]) =>
    `<div class="o${name === o.cluster ? ' on' : ''}"><span class="rd"></span><span class="dot${open ? '' : ' off'}"></span><span class="cword"><b>${name}</b> ${prod ? prodm : ''}${note ? `<small>${note}</small>` : ''}</span><span class="tag">${tag}</span></div>`
  const kind = o.kind ?? 'Deployments'
  const objs = {
    list: `<div class="pk">${[
      ['checkout', 'Same name'],
      ['checkout-canary', ''],
      ['cart', ''],
      ['storefront', ''],
    ]
      .map(
        ([n, t], i) =>
          `<div class="o${i === 0 ? ' on' : ''}"><span class="rd"></span><span class="cword mono">${n}</span><span class="tag">${t}</span></div>`,
      )
      .join('')}</div>`,
    'not-served': `<div class="pk"><div class="empty">${icon('info', 16)}<span>dev-anna doesn’t serve Certificates (cert-manager.io/v1), so there’s nothing to compare with there.</span></div></div>`,
    none: `<div class="pk"><div class="empty">${icon('info', 16)}<span>No Deployments in shop on staging. Pick another namespace, or another cluster.</span></div></div>`,
    forbidden: `<div class="pk"><div class="empty">${icon('lock', 16)}<span>Your access on prod-us doesn’t list Deployments in shop.</span></div></div>`,
  }[o.objects]
  const ready = o.objects === 'list'
  return `<div class="ad"><header><span class="g">${icon('git-compare', 18)}</span><div class="t"><h3>Compare checkout with…</h3><p class="sub2">Deployment · shop · <b>production-eu</b>${prodm}</p></div></header><div class="body">
    <div class="fl"><span>Cluster</span><div class="pk">${clusters.map(crow).join('')}</div></div>
    <div class="fl"><span>Namespace</span><span class="sel">shop${icon('chevron-down', 14)}</span></div>
    <div class="fl"><span>${o.kind ? 'Certificate' : 'Deployment'}</span>${ready ? `<span class="in">${icon('search', 14)}Filter ${kind.toLowerCase()}</span>` : ''}${objs}</div>
  </div><footer><span class="btn ghost">Cancel</span><span class="btn primary${ready ? '' : ' off'}">Compare</span></footer></div>`
}

function pickerFrame(): string {
  return `<section class="blk"><h2>Compare with…<i>in an object’s More actions, after Copy link, and in the palette’s Actions while an object is open</i></h2><div class="row"><div class="col n">${MORE}</div></div></section>
    <section class="blk"><h2>The picker<i>where to look, on any kind: a cluster, a namespace, an object of the same kind, the same-named one picked</i></h2>
    <div class="row"><div class="col"><p class="cap"><b>As it opens</b> from checkout on production-eu, staging picked: shop, and checkout there, picked as it has the same name.</p>${picker({ cluster: 'staging', objects: 'list' })}</div>
    <div class="col"><p class="cap"><b>Nothing of it there</b>: Compare waits for an object.</p>${picker({ cluster: 'staging', objects: 'none' })}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>Your access doesn’t list it there.</b></p>${picker({ cluster: 'prod-us', objects: 'forbidden' })}</div>
    <div class="col"><p class="cap"><b>The kind isn’t served there</b>, comparing a Certificate; dev-anna, not open before, was opened by picking it.</p>${picker({ cluster: 'dev-anna', objects: 'not-served', kind: 'Certificates' })}</div></div></section>`
}

const PICK_RULES = [
  '<b>“Compare with…”</b> is in every object’s More actions, after Copy link (both read, neither changes anything), and in the palette’s Actions while an object is open. It has no key. It’s read-only throughout: nothing it shows can be changed from it.',
  '<b>The picker</b>, titled “Compare checkout with…”, under it the object’s kind, namespace and cluster: <b>Cluster</b>, this one first (“This one”), then every cluster the person has, with their Production marks; <b>Namespace</b> for a namespaced kind, the same one to start; then the <b>objects of the same kind</b> there, filtered by a field, the same-named one picked (“Same name”). Compare opens the page. Esc and Cancel leave.',
  '<b>A cluster that isn’t open</b> is listed without being read, its dot quiet, and its row says “Not open yet: picking it opens it, and it may ask you to sign in.” Picking it opens it, as the cluster switcher does, sign-in included; nothing is read from it before.',
  '<b>Where there’s nothing to pick</b>, the list says why in one line, and Compare waits: the kind isn’t served there (“dev-anna doesn’t serve Certificates (cert-manager.io/v1), so there’s nothing to compare with there.”); none of it there (“No Deployments in shop on staging. Pick another namespace, or another cluster.”); access doesn’t list it (“Your access on prod-us doesn’t list Deployments in shop.”).',
]

// ─── 2. The comparison ──────────────────────────────────────────────────────────────────────

function pageFrame(): string {
  const page = `${sides()}${cbar({ minus: 4, plus: 6, hidden: 64 })}<div class="cbody">${lines(MAIN)}${pairs()}</div>`
  const noisy = `${sides()}${cbar({ minus: 10, plus: 12, on: true })}<div class="cbody">${lines(NOISY)}</div>`
  return `<section class="blk"><h2>The comparison<i>a page of its own: the two sides, what differs, and the config a workload references</i></h2>${cmpWin(page, 1140)}
    <p class="cap" style="margin-top:8px"><b>Show status and cluster-set fields</b> on: what else differs, which is noise for this question.</p>${cmpWin(noisy, 1110)}</section>`
}

const PAGE_RULES = [
  '<b>A page of its own</b>, “Compare” in the bar with Lumovi’s compare mark, as a table of differences needs the width. It has an address of its own, so Back returns to the object, and Copy link copies the comparison (both sides, by cluster, namespace and name).',
  '<b>The two sides</b>, left and right, each as its cluster (with its Production mark), namespace, name and kind. The left is marked <b>−</b> in red and the right <b>+</b> in green, as the diff’s lines are, so which line is whose is never in doubt. <b>Swap</b> turns them round; <b>Change…</b> opens the picker for the right side; <b>Refresh</b> reads both again.',
  '<b>The diff</b> is Lumovi’s DiffView, unified: the left’s lines that differ in red, the right’s in green, the rest folded (“14 unchanged lines”). Unified, not side by side: it’s what Lumovi’s other diffs are, it folds what’s the same, and it reads in a panel’s width as well as a page’s. The counts head it: “−4 +6 lines”.',
  '<b>Status and cluster-set fields are left out by default</b> (status; metadata’s uid, resourceVersion, generation, creationTimestamp, managedFields; the last-applied annotation; a Service’s clusterIP and the like: app-2’s list), and the bar says how many lines: “64 lines of status and cluster-set fields left out”. <b>Show status and cluster-set fields</b> puts them back, counted too. It’s remembered for the next comparison.',
  '<b>For a workload, the config it references</b>, under the diff: each ConfigMap and Secret, paired by where it’s referenced (envFrom, an env’s secretKeyRef, a volume), named with its kind and where. A pair that’s the same is folded, “The same”; one that differs shows its counts and opens to its own diff; one referenced on only one side says “Only on staging” (or the other side), in amber.',
  '<b>Secrets</b> are masked line for line, on both sides, as the YAML tab masks them: a changed value still shows as a changed line. <b>Reveal values</b> shows them where that side’s access shows Secrets’ values; where only one side’s does, the button names it (“Reveal production-eu’s values”) and the other side’s stay masked, with why (frame 3).',
]

// ─── 3. States ──────────────────────────────────────────────────────────────────────────────

function statesFrame(): string {
  const none = `${sides()}${cbar({ none: true, hidden: 64 })}<div class="cbody"><div class="none"><span class="g">${icon('check', 22)}</span><h3>No differences</h3><p>checkout is the same on both sides. 64 lines of status and cluster-set fields were left out, and may differ: <a>Show them</a>.</p></div></div>`
  const unread = `${sides('Couldn’t read it: staging didn’t answer in time.')}${cbar({ unread: 'staging' })}<div class="cbody"><p class="only1">${icon('info', 14)}<span>Only production-eu’s side, as it is. Refresh reads staging again.</span></p>${lines(
    [
      ['s', 'apiVersion: apps/v1'],
      ['s', 'kind: Deployment'],
      ['s', 'metadata:'],
      ['s', '  name: checkout'],
      ['s', '  namespace: shop'],
      ['s', 'spec:'],
      ['s', '  replicas: 6'],
      ['gap', '38 more lines'],
    ],
    true,
  )}</div>`
  const secrets = `${sides()}${cbar({ minus: 4, plus: 6, hidden: 64 })}<div class="cbody">${pairs({ reveal: 'left-only' })}</div>`
  const withheld = `<div class="cbody" style="padding-top:16px">${lines([
    ['s', 'report:'],
    ['s', '  secrets:'],
    ['s', '  - category: AWS'],
    ['s', `    match: <span class="wh">${icon('lock', 11)}Withheld</span>`],
    ['r', '    target: /app/config/.env'],
    ['a', '    target: /app/settings/.env'],
  ])}<p class="only1" style="margin-top:8px">${icon('lock', 14)}<span>Withheld by the plugin Trivy’s file, on both sides: what matched isn’t read from either cluster, so it can’t be compared.</span></p></div>`
  return `<section class="blk"><h2>States</h2>
    <p class="cap"><b>No differences</b>, said once, with what was left out.</p>${cmpWin(none, 520)}
    <p class="cap" style="margin-top:8px"><b>A side that can’t be read</b>: why, on that side; the other shown as it is.</p>${cmpWin(unread, 560)}
    <p class="cap" style="margin-top:8px"><b>Secrets, where only one side’s access shows values</b>: Reveal names that side; the other stays masked, and why.</p>${cmpWin(secrets, 600)}
    <div class="row" style="margin-top:8px"><div class="col"><p class="cap"><b>A field a plugin’s file withholds</b>, comparing two ExposedSecretReports: noted, as the YAML tab notes it.</p><div class="ad" style="width:600px">${withheld}</div></div></div></section>`
}

const STATE_RULES = [
  '<b>No differences</b>: a check, “No differences”, and “checkout is the same on both sides.” With the fields left out counted, and <b>Show them</b>, as they may differ. With them shown and still none: “checkout is the same on both sides, status included.”',
  '<b>A side that can’t be read</b> says why on its own card, in Lumovi’s words for the error (“Couldn’t read it: staging didn’t answer in time.”; “Your access on prod-us doesn’t let you read Deployments in shop.”; “It’s gone: checkout no longer exists on staging.”). The other side shows as it is, plain, under “Only production-eu’s side, as it is. Refresh reads staging again.” No counts, no diff.',
  '<b>Secrets, one side’s access showing only keys</b>: both sides stay masked; Reveal names the side it can show; the other’s line says “staging’s stay hidden: your access there shows only their keys.” A value is never shown for a side whose access doesn’t show it.',
  '<b>Withheld fields</b> (a plugin’s file, as LMV-349 has it) show as <b>Withheld</b> on both sides, never compared, with a line saying whose file withholds them.',
  '<b>On a phone it isn’t there at first</b>: Compare with… isn’t in More actions or the palette under 640 px. A comparison’s link opened on a phone says “Compare needs a larger screen.” with Back.',
]

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type CompareFrame = 'cmp-picker' | 'cmp-page' | 'cmp-states'

export const COMPARE_FRAMES: { id: CompareFrame; title: string; size: Size }[] = [
  { id: 'cmp-picker', title: 'Compare: the picker', size: { width: 1440, height: 2140 } },
  { id: 'cmp-page', title: 'Compare: the comparison', size: { width: 1440, height: 2795 } },
  { id: 'cmp-states', title: 'Compare: its states', size: { width: 1440, height: 2545 } },
]

const sheet = (
  scheme: Scheme,
  width: number,
  body: string,
) => `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${width}px; }
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
svg.i { display: block; flex: none; }
* { box-sizing: border-box; }
${CSS}
</style><div class="sheet">${body}</div>`

const rules = (list: string[]) =>
  `<section class="blk"><h2>The rules</h2><ul class="rules">${list.map((r) => `<li>${r}</li>`).join('')}</ul></section>`

/** One of the frames, in one theme. */
export function compareFrame(id: CompareFrame, scheme: Scheme): string {
  const f = COMPARE_FRAMES.find((x) => x.id === id)!
  const intro = (t: string, p: string) => `<header><h1>${t}</h1><p>${p}</p></header>`
  const body = {
    'cmp-picker': () =>
      `${intro('Compare with… (LMV-173)', 'Two objects of one kind, in any namespace or cluster the person has, side by side in a diff that leaves out what’s only status. Here: where it’s offered, and the picker. Read-only throughout. Words are drafts for docs.')}${pickerFrame()}${rules(PICK_RULES)}`,
    'cmp-page': () =>
      `${intro('Compare: the comparison (LMV-173)', 'checkout on production-eu beside checkout on staging: what differs in its spec, and in the config it references. Words are drafts for docs.')}${pageFrame()}${rules(PAGE_RULES)}`,
    'cmp-states': () =>
      `${intro('Compare: its states (LMV-173)', 'Nothing differs; a side can’t be read; Secrets where only one side shows values; a field a plugin withholds; and a phone. Words are drafts for docs.')}${statesFrame()}${rules(STATE_RULES)}`,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
