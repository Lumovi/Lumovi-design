/**
 * Helm repositories, a chart browser, and "Update available" on releases (LMV-354, part of
 * LMV-177), as app's plan has them: helm never sees a credential; Lumovi fetches charts with the
 * saved sign-in and hands helm the chart. Drawn in Lumovi's window from main's Helm page, its
 * ListBar, its release panel and its ActionDialog. Words are drafts for docs.
 */
import { tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { CSS as HELM } from './helm.ts'
import { escape, only, type Level } from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { CSS as WINDOW, dock, pill, win } from './windows.ts'

type WLevel = Parameters<typeof pill>[0]

const CONTEXT = 'production-eu'

const CSS = `${WINDOW}
${only(HELM, /^(\.ad|\.prodm|\.xm|\.opt)/)}
.row { display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.col { display: flex; width: 600px; min-width: 0; flex-direction: column; gap: 8px; }
.col.wide { width: 1376px; }
.ad footer .btn { height: 32px; padding: 0 12px; font-size: 13px; }
.ad .sub2 { margin: 2px 0 0; font-size: 12px; line-height: 16px; color: var(--text-3); }
.ad footer .left { margin-right: auto; }

/* The Helm page's own strip, and its ListBar's new parts. */
.tbar .btn svg.i { color: var(--text-2); }
.chip.upd { border-color: color-mix(in srgb, var(--accent) 35%, transparent); color: var(--accent-strong); }
.chip.upd b { color: var(--accent-strong); }
.svd { display: inline-flex; align-items: center; gap: 5px; }
.svd svg.i { color: var(--text-3); }
.th > span { white-space: nowrap; }
.foot { flex: none; padding: 10px 24px; font-size: 12px; color: var(--text-3); }
.tr .q3 { color: var(--text-3); }
.tr .bad { color: var(--critical-text); }
.tr .mm { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; }
.tr .lead2 { display: flex; min-width: 0; align-items: center; gap: 10px; }
.tr .lead2 .dot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--m); }
.tr .lead2 .lw { min-width: 0; }
.tr .lead2 .lw b { display: inline; font-weight: 500; }
.tr .lead2 .lw i { margin-left: 6px; font-style: normal; font-size: 12px; color: var(--text-3); }
.tr .lead2 .lw small { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.tr .more { display: grid; width: 28px; height: 28px; margin-left: auto; place-items: center; border-radius: 6px; color: var(--text-3); }
.tr.hov { background: color-mix(in srgb, var(--surface-3) 50%, transparent); }
.tr.hov .more { background: var(--surface-3); color: var(--text-1); }

/* A chart's icon: its own image, or its initial in a tile until then. */
.cico { display: grid; width: 32px; height: 32px; flex: none; place-items: center; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 600; color: var(--text-2); }
.cico.big { width: 36px; height: 36px; border-radius: 10px; }
.cico svg { display: block; }

/* "Update available": Lumovi's accent, a button where it upgrades. */
.upd { display: inline-flex; height: 22px; align-items: center; gap: 5px; padding: 0 9px 0 7px; border-radius: 999px; background: var(--accent-soft); font-size: 12px; line-height: 16px; font-weight: 500; color: var(--accent-strong); white-space: nowrap; }
.upd svg.i { width: 14px; height: 14px; }
.upd.btnish { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent); }

/* A row's menu, as Lumovi's. */
.rmenu { position: absolute; z-index: 5; width: 210px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.rmenu .mi { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.rmenu .mi svg.i { color: var(--text-3); }
.rmenu .mi.hl { background: var(--surface-3); }
.rmenu .mi.danger, .rmenu .mi.danger svg.i { color: var(--critical-text); }
.rmenu hr { height: 1px; margin: 4px; border: 0; background: var(--line); }
.lst-wrap { position: relative; }

/* The dialogs' fields. */
.ad .fl { display: flex; flex-direction: column; gap: 4px; }
.ad .fl > span { font-size: 12px; font-weight: 500; color: var(--text-2); }
.ad .fl small { font-size: 12px; line-height: 17px; color: var(--text-3); }
.ad .two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.ad .in { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-1); }
.ad .in.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ad .in.ph { color: var(--text-3); }
.ad .in.focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.ad .in .end { margin-left: auto; color: var(--text-3); }
.ad .seg { display: inline-flex; align-self: flex-start; padding: 2px; border-radius: 8px; background: var(--surface-3); }
.ad .seg span { padding: 5px 12px; border-radius: 6px; font-size: 13px; color: var(--text-2); }
.ad .seg span.on { background: var(--surface); color: var(--text-1); box-shadow: 0 1px 2px rgb(0 0 0 / 0.1); }
.ad .chips { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 32px; padding: 4px 6px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); }
.ad .chips .c { display: inline-flex; height: 22px; align-items: center; gap: 4px; padding: 0 4px 0 8px; border-radius: 6px; background: var(--surface-3); font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ad .chips .c svg.i { color: var(--text-3); }
.ad .chips .ph { font-size: 13px; color: var(--text-3); }
.ad .signin { display: flex; flex-direction: column; gap: 10px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; }
.ad .signin .hd2 { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.ad .signin .hd2 .cb { display: inline-grid; width: 16px; height: 16px; place-items: center; border: 1.5px solid var(--line-strong); border-radius: 4px; background: var(--surface); color: #fff; }
.ad .signin .hd2 .cb.on { border-color: var(--accent); background: var(--accent); }
.ad .signin .hd2 .cb.off { opacity: 0.45; }
.ad .signin .hd2.off { color: var(--text-3); }
.ad .kept { display: flex; gap: 8px; margin: 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.ad .kept svg.i { flex: none; margin-top: 1px; }
.ad .saved { display: flex; height: 32px; align-items: center; gap: 8px; padding: 0 4px 0 10px; border: 1px dashed var(--line-strong); border-radius: 8px; font-size: 13px; color: var(--text-2); }
.ad .saved .btn { margin-left: auto; height: 26px; padding: 0 8px; font-size: 12px; }
.ad .saved .btn + .btn { margin-left: 4px; }
.ad .test { display: flex; align-items: center; gap: 10px; }
.ad .test .btn { height: 28px; padding: 0 10px; font-size: 12px; }
.ad .res { display: flex; align-items: flex-start; gap: 6px; font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.ad .res svg.i { flex: none; margin-top: 1px; }
.ad .res.ok svg.i { color: var(--good-text); }
.ad .res.no { color: var(--critical-text); }
.ad .nokey { display: flex; gap: 10px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); font-size: 13px; line-height: 1.55; color: var(--text-2); }
.ad .nokey svg.i { flex: none; margin-top: 3px; color: var(--text-3); }
.ad .nokey b { display: block; font-weight: 500; color: var(--text-1); }
.ad .from { display: flex; flex-direction: column; gap: 8px; }
.ad .ro { display: flex; gap: 10px; font-size: 13px; }
.ad .ro .rd { width: 14px; height: 14px; flex: none; margin-top: 3px; border: 1.5px solid var(--line-strong); border-radius: 50%; }
.ad .ro.on .rd { border: 4px solid var(--accent); }
.ad .ro small { display: block; font-size: 12px; color: var(--text-3); }
.ad .ro.dim { color: var(--text-2); }
.ad .sel { display: inline-flex; height: 32px; align-items: center; gap: 8px; padding: 0 8px 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; }
.ad .sel svg.i { margin-left: auto; color: var(--text-3); }
.ad .sel.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.ad .three { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 140px; gap: 8px; margin-left: 24px; }
.ad .cmd .note2 { margin: 6px 0 0; font-size: 12px; text-transform: none; letter-spacing: 0; font-weight: 400; color: var(--text-3); }
.ad .editor2 { display: flex; height: 64px; align-items: center; justify-content: center; border: 1px dashed var(--line-strong); border-radius: 8px; font-size: 12px; color: var(--text-3); }

/* The chart's panel. */
.cdesc { margin: 0; padding: 12px 20px 4px; font-size: 13px; line-height: 1.55; color: var(--text-2); }
.clinks { display: flex; gap: 16px; padding: 4px 20px 12px; font-size: 12.5px; color: var(--accent-strong); }
.clinks span { display: inline-flex; align-items: center; gap: 4px; }
.vers { display: flex; flex-direction: column; padding: 4px 12px 12px; }
.vers .vh { display: grid; grid-template-columns: minmax(0, 1fr) 96px 72px; padding: 6px 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.vers .v { display: grid; grid-template-columns: minmax(0, 1fr) 96px 72px; align-items: center; height: 36px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.vers .v.on { background: var(--accent-soft); }
.vers .v .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.vers .v .tag { margin-left: 8px; font-size: 11px; font-weight: 500; color: var(--text-3); }
.vers .v .r { text-align: right; color: var(--text-3); font-variant-numeric: tabular-nums; }
.dfacts { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px 16px; margin: 0; padding: 14px 20px; font-size: 13px; }
.dfacts dt { color: var(--text-3); }
.dfacts dd { margin: 0; min-width: 0; }
.dfacts .q3 { color: var(--text-3); }
.dsec { padding: 0 20px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.tip3 { position: absolute; z-index: 6; width: max-content; max-width: 300px; padding: 6px 10px; border-radius: 8px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); box-shadow: var(--shadow-pop); }

/* On a phone. */
.phr { display: flex; width: 390px; height: 700px; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); }
.phr .pb { display: flex; height: 52px; flex: none; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); font-size: 15px; }
.phr .pb b { flex: 1; font-weight: 600; }
.phr .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.phr .ptabs2 { display: flex; gap: 20px; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--text-3); white-space: nowrap; }
.phr .ptabs2 span { padding: 11px 0; }
.phr .ptabs2 .on { color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }
.phr .ptabs2 small { margin-left: 5px; color: var(--text-3); }
.phr .pcnt { padding: 12px 16px 4px; font-size: 13px; color: var(--text-2); }
.phr .pc { padding: 12px 16px; border-bottom: 1px solid var(--line); }
.phr .pc .top { display: flex; align-items: center; gap: 10px; }
.phr .pc .top .dot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--m); }
.phr .pc .top b { font-size: 15px; font-weight: 500; }
.phr .pc .top i { font-style: normal; font-size: 13px; color: var(--text-3); }
.phr .pc dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 12px; margin: 8px 0 0 18px; font-size: 12px; }
.phr .pc dl.one { grid-template-columns: minmax(0, 1fr); }
.phr .pc dt { color: var(--text-3); }
.phr .pc dd { margin: 2px 0 0; font-size: 14px; }
.phr .pc dd.mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-wrap: anywhere; }
.phr .pin { padding: 16px 16px 12px; }
.phr .pin small { display: block; font-size: 12px; color: var(--text-3); }
.phr .pin h3 { margin: 2px 0 10px; font-size: 17px; line-height: 24px; font-weight: 600; }
.phr .pin .pills { display: flex; flex-wrap: wrap; gap: 8px; }
.phr .pfacts { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 16px; }
.phr .pfacts dt { font-size: 12px; color: var(--text-3); }
.phr .pfacts dd { margin: 2px 0 0; font-size: 14px; }
.phr .pnote { display: flex; gap: 8px; margin: 0 16px; padding: 10px 12px; border-radius: 10px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); font-size: 13px; line-height: 1.5; color: var(--text-2); }
.phr .pnote svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
`

// ─── Parts ──────────────────────────────────────────────────────────────────────────────────

const dot = (level: Level) =>
  `<span class="dot" style="--m:var(--${{ critical: 'critical', warning: 'warn', progressing: 'neutral', healthy: 'good', neutral: 'neutral' }[level]})"></span>`

const lead = (level: Level, name: string, beside = '', under = '') =>
  `<span class="lead2">${dot(level)}<span class="lw"><b>${escape(name)}</b>${beside ? `<i>${escape(beside)}</i>` : ''}${under ? `<small>${escape(under)}</small>` : ''}</span></span>`

const upd = (version: string, button = false) =>
  `<span class="upd${button ? ' btnish' : ''}">${icon('circle-arrow-up', 14)}Update available: ${version}</span>`

/** A chart's icon: drawn as its initial in a tile, where its image isn't fetched (or fails). */
const cico = (name: string, hue: number | null, big = false) =>
  hue === null
    ? `<span class="cico${big ? ' big' : ''}">${name[0]!.toUpperCase()}</span>`
    : `<span class="cico${big ? ' big' : ''}"><svg width="${big ? 26 : 22}" height="${big ? 26 : 22}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="hsl(${hue} 60% 50%)"/><path d="M8 15l4-6 4 6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`

const TABS = (on: 'Releases' | 'Charts' | 'Repositories') =>
  `<div class="ptabs">${[
    ['Releases', '12'],
    ['Charts', '61'],
    ['Repositories', '4'],
  ]
    .map(([t, n]) => `<span${t === on ? ' class="on"' : ''}>${t}<small>${n}</small></span>`)
    .join('')}</div>`

const helmWin = (page: string, panel?: { html: string; width: number }, extra = '', h = 640) =>
  win({
    w: 1376,
    h,
    cluster: CONTEXT,
    nav: 'Helm releases',
    title: 'Helm',
    glyph: 'ship-wheel',
    page,
    panel,
    dock: dock([]),
    more: true,
    extra,
  })

/** Lumovi's ActionDialog. A repository is Lumovi's, not a cluster's: its subject names where it's kept. */
function adlg(o: {
  glyph: IconName
  title: string
  subject: string
  cluster?: boolean
  danger?: boolean
  body: string
  command?: string
  note?: string
  confirm: string
  left?: string
}): string {
  const g = o.danger
    ? `<span class="g" style="background:color-mix(in srgb, var(--critical) 10%, transparent);color:var(--critical-text)">${icon(o.glyph, 18)}</span>`
    : `<span class="g">${icon(o.glyph, 18)}</span>`
  const sub = o.cluster
    ? `<p class="sub"><span>${o.subject} · <b>${CONTEXT}</b></span><span class="prodm">Production</span></p>`
    : `<p class="sub2">${o.subject}</p>`
  const cmd = o.command
    ? `<div class="cmd"><p>Equivalent command</p><code>${o.command}</code>${o.note ? `<p class="note2">${o.note}</p>` : ''}</div>`
    : ''
  return `<div class="ad"><header>${g}<div class="t"><h3>${o.title}</h3>${sub}</div></header><div class="body">${o.body}${cmd}</div><footer>${o.left ?? ''}<span class="btn ghost">Cancel</span><span class="btn primary"${o.danger ? ' style="background:var(--critical)"' : ''}>${o.confirm}</span></footer></div>`
}

// ─── 1. Repositories ────────────────────────────────────────────────────────────────────────

type Repo = [Level, string, 'HTTP' | 'OCI', string, string, string, string, string]

const REPOS: Repo[] = [
  [
    'critical',
    'old-mirror',
    'HTTP',
    'https://charts.old.example',
    'None',
    '—',
    'Couldn’t read: 404 Not Found',
    '3h',
  ],
  ['healthy', 'acme-charts', 'HTTP', 'https://charts.acme.example', 'Saved', '42', 'Read', '12m'],
  ['healthy', 'acme-oci', 'OCI', 'oci://ghcr.io/acme/charts', 'Saved', '2', 'Read', '12m'],
  [
    'healthy',
    'prometheus-community',
    'HTTP',
    'https://prometheus-community.github.io/helm-charts',
    'None',
    '17',
    'Read',
    '12m',
  ],
]

const RCOLS = 'minmax(0,1.1fr) 64px minmax(0,1.6fr) 96px 64px minmax(0,1.1fr) 44px'

function reposPage(o: { admin: boolean; menu?: boolean } = { admin: true }): string {
  const add = o.admin
    ? `<span class="btn">${icon('plus', 14)}Add repository</span>`
    : `<span class="q3" style="font-size:12.5px;color:var(--text-3)">Only Lumovi’s admins add repositories here. The server names them: anna, peter.</span>`
  const rows = REPOS.map(([level, name, kind, addr, cred, n, read, when], i) => {
    const status =
      read === 'Read'
        ? `<span class="q3">Read ${when} ago</span>`
        : `<span class="bad">${escape(read)}</span>`
    return `<div class="tr${o.menu && i === 1 ? ' hov' : ''}" style="grid-template-columns:${RCOLS}">${lead(level, name)}<span>${kind}</span><span class="mm">${addr}</span><span class="${cred === 'None' ? 'q3' : ''}">${cred === 'Saved' ? `<span class="svd">${icon('lock', 12)}Saved</span>` : 'None'}</span><span class="r">${n}</span><span>${status}</span><span>${o.admin ? `<span class="more">${icon('ellipsis', 16)}</span>` : ''}</span></div>`
  }).join('')
  const menu = o.menu
    ? `<div class="rmenu" style="top:248px;right:24px"><span class="mi">${icon('pencil', 16)}Edit…</span><span class="mi hl">${icon('refresh-cw', 16)}Test connection</span><hr><span class="mi danger">${icon('trash-2', 16)}Remove…</span></div>`
    : ''
  return `<div class="lst-wrap" style="display:flex;flex:1;min-height:0;flex-direction:column">${TABS('Repositories')}<div class="tbar"><span class="count">4 repositories</span><span class="chip" style="--d:var(--critical)"><i></i>Can’t read <b>1</b></span><span class="chip" style="--d:var(--good)"><i></i>Read <b>3</b></span>${o.admin ? add : ''}<span class="grow"></span><span class="fld" style="width:220px">${icon('search', 14)}Filter repositories</span></div>${o.admin ? '' : `<div class="tbar" style="height:40px;border-bottom:0">${add}</div>`}<div class="th" style="grid-template-columns:${RCOLS}"><span>Name</span><span>Kind</span><span>Address</span><span>Sign-in</span><span class="r">Charts</span><span>Index</span><span></span></div>${rows}<div class="grow"></div><p class="foot">Lumovi reads each repository every 30 minutes and when this page opens. Charts come only from repositories added here.</p>${menu}</div>`
}

const signin = (o: {
  state: 'new' | 'saved' | 'nokey' | 'server'
  user?: string
  secret?: string
}) => {
  if (o.state === 'nokey')
    return `<div class="signin"><span class="hd2 off"><span class="cb off"></span>It needs a sign-in</span><div class="nokey">${icon('lock', 16)}<span><b>Lumovi can’t keep a password here.</b>This computer has no keychain Lumovi can use, and Lumovi won’t write a password to a file. Add the repository without a sign-in, or set up a keychain (such as GNOME Keyring or KWallet), then open this again.</span></div></div>`
  if (o.state === 'saved')
    return `<div class="signin"><span class="hd2"><span class="cb on">${icon('check', 12, 3)}</span>It needs a sign-in</span><div class="two"><label class="fl"><span>Username</span><span class="in mono">anna</span></label><label class="fl"><span>Password</span><span class="saved">${icon('lock', 14)}Saved<span class="btn">Replace…</span></span></label></div><p class="kept">${icon('lock', 14)}<span>Never shown again once saved. To change it, replace it and type the new one. Remove the sign-in by clearing It needs a sign-in.</span></p></div>`
  const where =
    o.state === 'server'
      ? 'Kept sealed on the server and never shown again, to anyone. Adding or changing one is in the audit log. Helm never sees it: Lumovi fetches charts with it and hands Helm the chart.'
      : 'Kept in this computer’s keychain and never shown again. Helm never sees it: Lumovi fetches charts with it and hands Helm the chart.'
  return `<div class="signin"><span class="hd2"><span class="cb on">${icon('check', 12, 3)}</span>It needs a sign-in</span><div class="two"><label class="fl"><span>Username</span><span class="in mono">${o.user ?? 'anna'}</span></label><label class="fl"><span>${o.secret ?? 'Password'}</span><span class="in mono focus">••••••••••••</span></label></div><p class="kept">${icon('lock', 14)}<span>${where}</span></p></div>`
}

function addHttp(): string {
  return adlg({
    glyph: 'plus',
    title: 'Add a repository',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<span class="seg"><span class="on">HTTP repository</span><span>OCI registry</span></span>
      <div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-charts</span></label><label class="fl"><span>Address</span><span class="in mono">https://charts.acme.example</span></label></div>
      ${signin({ state: 'new' })}
      <div class="test"><span class="btn">${icon('refresh-cw', 14)}Test connection</span><span class="res ok">${icon('circle-check', 14)}<span>Connected: its index lists 42 charts.</span></span></div>`,
    command:
      'helm repo add acme-charts https://charts.acme.example --username anna --password-stdin',
    note: 'Lumovi keeps repositories itself, not in Helm’s own list: this is how Helm would add it.',
    confirm: 'Add repository',
  })
}

function addOci(): string {
  return adlg({
    glyph: 'plus',
    title: 'Add a repository',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<span class="seg"><span>HTTP repository</span><span class="on">OCI registry</span></span>
      <div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-oci</span></label><label class="fl"><span>Registry</span><span class="in mono">oci://ghcr.io/acme/charts</span></label></div>
      <label class="fl"><span>Charts</span><span class="chips"><span class="c">orders${icon('x', 12)}</span><span class="c">payments-api${icon('x', 12)}</span><span class="ph">Add a chart’s name</span></span><small>A registry has no index to browse: name the charts Lumovi should look for. It reads their versions from the registry’s tags.</small></label>
      ${signin({ state: 'new', user: 'anna', secret: 'Token' })}
      <div class="test"><span class="btn">${icon('refresh-cw', 14)}Test connection</span><span class="res ok">${icon('circle-check', 14)}<span>Connected: orders has 6 versions, payments-api 14.</span></span></div>`,
    command: 'helm registry login ghcr.io --username anna --password-stdin',
    note: 'Lumovi keeps registries itself, not in Helm’s own list: this is how Helm would sign in to it.',
    confirm: 'Add repository',
  })
}

function editRepo(): string {
  return adlg({
    glyph: 'pencil',
    title: 'Edit acme-charts',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-charts</span></label><label class="fl"><span>Address</span><span class="in mono">https://charts.acme.example</span></label></div>${signin({ state: 'saved' })}
      <div class="test"><span class="btn">${icon('refresh-cw', 14)}Test connection</span><span class="res no">${icon('circle-x', 14)}<span>Couldn’t sign in: 401 Unauthorized. The saved password may have changed: replace it.</span></span></div>`,
    confirm: 'Save',
  })
}

/** The address changed to another host: the saved sign-in goes, fail-closed. */
function editMoved(): string {
  return adlg({
    glyph: 'pencil',
    title: 'Edit acme-charts',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-charts</span></label><label class="fl"><span>Address</span><span class="in mono focus">https://charts.acme-mirror.example</span><small>Changing the host removes its sign-in. Enter it again for the new address.</small></label></div><div class="signin"><span class="hd2"><span class="cb on">${icon('check', 12, 3)}</span>It needs a sign-in</span><div class="two"><label class="fl"><span>Username</span><span class="in mono">anna</span></label><label class="fl"><span>Password</span><span class="in mono ph">Enter it for the new address</span></label></div></div>`,
    confirm: 'Save',
  })
}

/** An http address: no sign-in is sent over it. */
function plainHttp(): string {
  return adlg({
    glyph: 'plus',
    title: 'Add a repository',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<span class="seg"><span class="on">HTTP repository</span><span>OCI registry</span></span><div class="two"><label class="fl"><span>Name</span><span class="in mono">lab-charts</span></label><label class="fl"><span>Address</span><span class="in mono">http://charts.lab.example</span></label></div><div class="signin"><span class="hd2 off"><span class="cb off"></span>It needs a sign-in</span><p class="kept">${icon('lock', 14)}<span>A sign-in is only sent over https. Use the repository’s https address to add one.</span></p></div>`,
    command: 'helm repo add lab-charts http://charts.lab.example',
    note: 'Lumovi keeps repositories itself, not in Helm’s own list: this is how Helm would add it.',
    confirm: 'Add repository',
  })
}

function noKeychain(): string {
  return adlg({
    glyph: 'plus',
    title: 'Add a repository',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<span class="seg"><span class="on">HTTP repository</span><span>OCI registry</span></span><div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-charts</span></label><label class="fl"><span>Address</span><span class="in mono">https://charts.acme.example</span></label></div>${signin({ state: 'nokey' })}`,
    confirm: 'Add repository',
  })
}

function serverAdd(): string {
  return adlg({
    glyph: 'plus',
    title: 'Add a repository',
    subject: 'Helm repositories · kept on this server, for everyone who uses it',
    body: `<span class="seg"><span class="on">HTTP repository</span><span>OCI registry</span></span><div class="two"><label class="fl"><span>Name</span><span class="in mono">acme-charts</span></label><label class="fl"><span>Address</span><span class="in mono">https://charts.acme.example</span></label></div>${signin({ state: 'server' })}`,
    confirm: 'Add repository',
  })
}

function removeRepo(): string {
  return adlg({
    glyph: 'trash-2',
    danger: true,
    title: 'Remove acme-charts?',
    subject: 'Helm repositories · kept on this computer, for every cluster',
    body: `<p style="margin:0;font-size:13px;line-height:1.6;color:var(--text-2)">Lumovi forgets it, and its saved sign-in. Its charts leave the Charts tab. Releases installed from it stay as they are, and stop saying when it has a newer version.</p>`,
    command: 'helm repo remove acme-charts',
    note: 'Lumovi’s own list, not Helm’s: this is how Helm would remove it.',
    confirm: 'Remove',
  })
}

function reposFrame(): string {
  return `<section class="blk"><h2>Repositories<i>a tab of the Helm page: every repository Lumovi reads charts from, and whether it could</i></h2>
    <p class="cap"><b>On the desktop</b>, a row’s ⋯ open: Edit, Test connection, Remove.</p>${helmWin(reposPage({ admin: true, menu: true }))}
    <p class="cap" style="margin-top:8px"><b>On a server, for someone who isn’t one of Lumovi’s admins</b>: the same list, read; no Add, no row menu, and who to ask.</p>${helmWin(reposPage({ admin: false }), undefined, '', 380)}</section>
    <section class="blk"><h2>Adding, editing, removing<i>Lumovi’s ActionDialog; a repository is Lumovi’s, so it names where it’s kept, not a cluster</i></h2>
    <div class="row"><div class="col"><p class="cap"><b>An HTTP repository</b>, with a sign-in, after Test connection.</p>${addHttp()}</div><div class="col"><p class="cap"><b>An OCI registry</b>: no index, so it’s added with the charts to look for.</p>${addOci()}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>Editing</b>: the saved password is never shown; Replace asks for a new one. Here its test failed.</p>${editRepo()}</div><div class="col"><p class="cap"><b>On Linux with no keychain</b>: no password is kept, and why.</p>${noKeychain()}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>The address moved to another host</b>: the saved sign-in is gone, and it has to be entered again.</p>${editMoved()}</div><div class="col"><p class="cap"><b>An http address</b>: no sign-in can be added, and why.</p>${plainHttp()}</div></div>
    <div class="row"><div class="col"><p class="cap"><b>On a server, for one of Lumovi’s admins</b>: sealed on the server, and audited.</p>${serverAdd()}</div><div class="col"><p class="cap"><b>Remove</b>, from the row’s ⋯.</p>${removeRepo()}</div></div></section>`
}

const REPO_RULES = [
  '<b>The Helm page gets tabs</b>: Releases (today’s list), Charts and Repositories, each with its count, as Lumovi’s strips have them. The sidebar’s Helm releases opens Releases.',
  '<b>Repositories</b> lists each one Lumovi reads charts from: its name, HTTP or OCI, its address, whether it has a saved sign-in, how many charts it holds (an OCI registry: the charts named for it), and how its last read went: “Read 12m ago”, or “Couldn’t read:” and why, in red, its dot critical, worst first. A chip for each state. A row’s ⋯ has <b>Edit…</b>, <b>Test connection</b> and <b>Remove…</b>.',
  '<b>Lumovi reads each index every 30 minutes and when the Helm page opens</b>, only from repositories added here, and says so under the list. Nothing is read from anywhere else, and nothing is added for the person.',
  '<b>Add repository</b> asks HTTP or OCI, a name and the address. <b>An OCI registry has no index</b>, so it’s added with the charts to look for, as chips; their versions are the registry’s tags. <b>Test connection</b>, in the dialog and a row’s menu, reads it once and says what it found (“Connected: its index lists 42 charts.”) or why not (“Couldn’t sign in: 401 Unauthorized.”). Adding doesn’t wait for a test: a repository that can’t be read is listed, and says so.',
  '<b>A sign-in</b> (username and password, or a token for a registry) is never shown again once saved: not in the dialog, a copy, a CSV or a command (which uses <code>--password-stdin</code>). Editing shows “Saved” with <b>Replace…</b>, which asks for a new one, typed in full; clearing It needs a sign-in removes it. <b>Helm never sees it</b>: Lumovi fetches charts with it and hands Helm the chart, and the dialog says so.',
  '<b>A sign-in goes only where it was given.</b> Changing the address’s host, scheme or port removes the saved sign-in, at once and fail-closed, and the dialog says so under the address (“Changing the host removes its sign-in. Enter it again for the new address.”): the password field is empty, to be typed for the new one. Otherwise anyone who may edit a repository (on a server, any of Lumovi’s admins) could point it at a host of their own and be sent its sealed password. A redirect to another host is followed without the sign-in. <b>A sign-in is only sent over https</b>: with an http address, It needs a sign-in stays off, its line saying why (localhost is the one exception, for a repository on this computer).',
  '<b>Where it’s kept.</b> On the desktop, in the computer’s keychain, encrypted; with none (Linux without a Secret Service), nothing is kept, and the dialog says “Lumovi can’t keep a password here.”, why, and what to do. On a server, sealed in its state, write-only and in the audit log; and only Lumovi’s admins add, edit or remove repositories, as Access is theirs: others see the list, with who to ask, in Access’s words.',
  '<b>Remove</b> forgets the repository and its sign-in; its charts leave the Charts tab; releases installed from it stay as they are and lose Update available from it. The dialog is Lumovi’s danger one, with no typing to confirm, as nothing in a cluster changes.',
  '<b>A repository isn’t a cluster’s</b>, so these dialogs name where it’s kept (“kept on this computer, for every cluster”; “kept on this server, for everyone who uses it”) in place of a cluster and its Production mark. Their command is how Helm would do the same, with a line saying Lumovi keeps its own list.',
]

// ─── 2. Charts ──────────────────────────────────────────────────────────────────────────────

type Chart = [string, string, number | null, string, string, string, string]

const CHARTS: Chart[] = [
  [
    'kube-prometheus-stack',
    'prometheus-community',
    28,
    '61.3.2',
    'v0.75.2',
    '2d',
    'Prometheus, Alertmanager and Grafana, with the rules and dashboards to run them.',
  ],
  ['orders', 'acme-oci', null, '1.2.0', '1.2.0', '4d', 'The shop’s orders service.'],
  [
    'payments-api',
    'acme-charts',
    210,
    '2.5.0',
    '2.5.0',
    '1d',
    'Payments API, with its database migrations as a hook.',
  ],
  [
    'prometheus',
    'prometheus-community',
    28,
    '25.24.1',
    'v2.53.1',
    '6d',
    'Prometheus on its own: a monitoring system and time series database.',
  ],
  [
    'redis',
    'acme-charts',
    0,
    '19.6.2',
    '7.2.5',
    '9d',
    'Redis, as one primary with replicas, or a cluster.',
  ],
]

const CCOLS = 'minmax(0,2fr) 96px 96px 72px'

function chartsPage(sel: string): string {
  const rows = CHARTS.map(
    ([name, repo, hue, ver, app, when, desc]) =>
      `<div class="tr${name === sel ? ' sel' : ''}" style="grid-template-columns:${CCOLS};height:56px"><span class="lead2">${cico(name, hue)}<span class="lw"><b>${name}</b><i>${repo}</i><small>${escape(desc)}</small></span></span><span class="mm">${ver}</span><span class="mm">${app}</span><span class="r">${when}</span></div>`,
  ).join('')
  return `${TABS('Charts')}<div class="tbar"><span class="count">61 charts</span><span class="sel2" style="height:30px">All repositories${icon('chevron-down', 14)}</span><span class="grow"></span><span class="fld" style="width:260px">${icon('search', 14)}Chart, keyword or description</span></div><div class="th" style="grid-template-columns:${CCOLS}"><span>Chart</span><span>Latest</span><span>App</span><span class="r">Updated</span></div>${rows}`
}

function chartPanel(): string {
  const vers: [string, string, string, boolean][] = [
    ['2.5.0', '2.5.0', '1d', true],
    ['2.4.3', '2.4.3', '9d', false],
    ['2.4.2', '2.4.2', '23d', false],
    ['2.4.0', '2.4.0', '41d', false],
    ['2.3.1', '2.3.1', '2mo', false],
  ]
  return `<div class="dph"><span class="ktile" style="border:0;background:none">${cico('payments-api', 210, true)}</span><div class="t"><p>Chart · acme-charts</p><h2>payments-api</h2><div class="acts"><span class="btn primary">${icon('package-plus', 14)}Install 2.5.0…</span></div></div><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div>
    <p class="cdesc">Payments API, with its database migrations as a hook.</p><div class="clinks"><span>Home${icon('external-link', 12)}</span><span>Source${icon('external-link', 12)}</span></div>
    <p class="dsec">Versions <span style="text-transform:none;letter-spacing:0;font-weight:400">· 14</span></p><div class="vers"><div class="vh"><span>Version</span><span>App</span><span class="r" style="text-align:right">Released</span></div>${vers.map(([v, a, w, latest]) => `<div class="v${v === '2.5.0' ? ' on' : ''}"><span><span class="mono">${v}</span>${latest ? '<span class="tag">Latest</span>' : ''}</span><span class="mono">${a}</span><span class="r">${w}</span></div>`).join('')}</div>`
}

/** Install a chart, opened from the browser: the chart part, filled in from the saved repository. */
function installFromRepo(): string {
  return adlg({
    glyph: 'package-plus',
    title: 'Install a chart',
    subject: 'Helm',
    cluster: true,
    body: `<div class="two"><label class="fl"><span>Release name</span><span class="in mono focus">payments-api</span></label><label class="fl"><span>Namespace</span><span class="in mono">payments</span></label></div>
      <div class="fl"><span>Chart</span><div class="from"><div class="ro on"><span class="rd"></span><span>From a saved repository</span></div><div class="three"><span class="sel">acme-charts${icon('chevron-down', 14)}</span><span class="sel mono">payments-api${icon('chevron-down', 14)}</span><span class="sel mono">2.5.0${icon('chevron-down', 14)}</span></div><div class="ro dim"><span class="rd"></span><span>A chart from another repository or a registry</span></div><div class="ro dim"><span class="rd"></span><span>A chart on this computer</span></div></div></div>
      <div class="fl"><span>Values</span><div class="editor2">Empty: the chart’s defaults. Start from them, or type what to set.</div></div>`,
    command: `helm install payments-api ./payments-api-2.5.0.tgz --values values.yaml --namespace payments --kube-context ${CONTEXT}`,
    note: 'Lumovi fetches payments-api 2.5.0 from acme-charts with its saved sign-in, then hands Helm the chart. The command can’t say the sign-in.',
    confirm: 'Review',
  })
}

function chartsFrame(): string {
  return `<section class="blk"><h2>Charts<i>a tab of the Helm page: every chart in the repositories added, searched; one opened, with its versions</i></h2>${helmWin(chartsPage('payments-api'), { html: chartPanel(), width: 420 })}</section>
    <section class="blk"><h2>Install, from the browser<i>today’s Install a chart, with the chart filled in from the saved repository</i></h2><div class="row"><div class="col">${installFromRepo()}</div></div></section>`
}

const CHART_RULES = [
  '<b>Charts</b> lists every chart in the repositories added, one row each: its icon, name, repository beside it and description under it; its latest version, its app’s, and when it was released. Search matches name, keywords and description; a menu picks one repository. Sorted by name. A chart in two repositories is two rows, each saying where.',
  '<b>Its icon</b> is the one its index names, fetched by Lumovi’s backend (never the page), over https only, as an image of at most 256 KB, only from the repository’s own host or a public address (never a private, link-local or cluster-local one: on a server the backend is inside the cluster’s network), and never with the repository’s sign-in unless it’s on the repository’s own host. Until it comes, or if it can’t, the chart’s initial in a tile.',
  '<b>A chart opened</b> shows in the panel, as an object does: its icon, name and repository, its description, links to its home and source (only http and https ones, opened through Lumovi’s usual link-out), and its versions, newest first, each with its app version and when it was released, the latest marked. Picking one sets the button: <b>Install 2.5.0…</b>. An OCI chart lists its tags.',
  '<b>Install</b> opens today’s Install a chart with the chart filled in: a new first choice, <b>From a saved repository</b>, its repository, chart and version as menus, then today’s two (another repository or registry, a chart on this computer). The release name is the chart’s, selected to change; the values start empty, as today. The command shows Helm installing the fetched chart, and a line under it says Lumovi fetched it with the saved sign-in. <b>The fetched chart is checked</b> before Helm gets it: against the index’s <code>digest</code> (sha256), or an OCI chart’s manifest digest; a mismatch stops it (“The chart Lumovi fetched isn’t the one its repository lists.”). Lumovi records that it installed the release from that repository, for Update available.',
  '<b>Empty</b>: no repositories added: “Add a repository to browse its charts.”, with Add repository (for those who may). Nothing matches: “No charts match.”',
]

// ─── 3. Update available ────────────────────────────────────────────────────────────────────

type Rel = [WLevel, string, string, string, string, string | null, string, string, string]

const RELEASES: Rel[] = [
  [
    'healthy',
    'payments-api',
    'payments',
    'Deployed',
    'payments-api 2.4.2',
    '2.5.0',
    '2.4.2',
    '8',
    '2d',
  ],
  [
    'healthy',
    'monitoring',
    'monitoring',
    'Deployed',
    'kube-prometheus-stack 58.0.0',
    '61.3.2',
    'v0.73.2',
    '3',
    '41d',
  ],
  ['healthy', 'orders', 'shop', 'Deployed', 'orders 1.2.0', null, '1.2.0', '5', '4d'],
  ['healthy', 'logging', 'monitoring', 'Deployed', 'fluent-bit 0.46.0', null, '3.0.7', '6', '12d'],
  ['healthy', 'redis', 'data', 'Deployed', 'redis 19.0.1', null, '7.2.4', '2', '88d'],
  ['critical', 'legacy-batch', 'batch', 'Failed', 'legacy-batch 0.9.1', null, '0.9.1', '4', '3h'],
]

const UCOLS = 'minmax(0,1fr) 104px minmax(0,1.2fr) 196px 100px 76px 72px'
/** With the panel open, as LMV-113 has columns give way: Update first, then the rest, to Name, Status and Chart. */
const NCOLS = 'minmax(0,1fr) 112px minmax(0,1.1fr)'

function releasesPage(sel = ''): string {
  const narrow = sel !== ''
  const cols = narrow ? NCOLS : UCOLS
  const rows = RELEASES.map(([level, name, ns, st, chart, up, app, rev, when]) => {
    const at = chart.lastIndexOf(' ')
    const cells = [
      `<span><b style="font-weight:500">${name}</b><small>${ns}</small></span>`,
      `<span>${pill(level, st)}</span>`,
      `<span style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${chart.slice(0, at)} <span class="q3">${chart.slice(at + 1)}</span></span>`,
      ...(narrow
        ? []
        : [
            `<span>${up ? upd(up) : '<span class="q3">—</span>'}</span>`,
            `<span class="mm">${app}</span>`,
            `<span class="r">${rev}</span>`,
            `<span class="r">${when}</span>`,
          ]),
    ]
    return `<div class="tr${name === sel ? ' sel' : ''}" style="grid-template-columns:${cols}">${cells.join('')}</div>`
  }).join('')
  const heads = narrow
    ? '<span>Name</span><span>Status</span><span>Chart</span>'
    : '<span>Name</span><span>Status</span><span>Chart</span><span>Update</span><span>App version</span><span class="r">Revision</span><span class="r">Updated</span>'
  const tip = `<div class="tip3" style="top:390px;left:870px">acme-charts has a fluent-bit, but nothing says logging came from there: Lumovi didn’t install it, and their sources differ. So it says nothing.</div>`
  return `${TABS('Releases')}<div class="tbar"><span class="count">12 releases</span><span class="chip" style="--d:var(--critical)"><i></i>Failed <b>1</b></span><span class="chip" style="--d:var(--good)"><i></i>Deployed <b>11</b></span><span class="chip upd">${icon('circle-arrow-up', 13)}Update available <b>2</b></span><span class="btn">${icon('package-plus', 14)}Install chart</span><span class="grow"></span>${narrow ? `<span class="ib">${icon('search', 16)}</span>` : `<span class="fld" style="width:220px">${icon('search', 14)}Filter releases</span>`}</div><div class="th" style="grid-template-columns:${cols}">${heads}</div>${rows}${narrow ? '' : tip}`
}

function releasePanel(): string {
  return `<div class="dph"><span class="ktile">${icon('ship-wheel', 18)}</span><div class="t"><p>Helm release · payments</p><h2>payments-api${icon('copy', 14)}</h2><div class="acts">${pill('healthy', 'Deployed')}${upd('2.5.0', true)}</div><div class="acts" style="margin-top:8px"><span class="btn">${icon('circle-arrow-up', 14)}Upgrade…</span><span class="btn">${icon('history', 14)}Roll back…</span><span class="btn" style="color:var(--critical-text)">${icon('trash-2', 14)}Uninstall…</span></div></div><span class="ib" style="margin-top:2px">${icon('x', 16)}</span></div>
    <div class="itabs"><span class="on">Overview</span><span>Resources</span><span>Values</span><span>Manifest</span><span>History</span></div>
    <dl class="dfacts"><dt>Chart</dt><dd>payments-api 2.4.2 <span class="q3">· 2.5.0 in acme-charts</span></dd><dt>App version</dt><dd>2.4.2</dd><dt>Revision</dt><dd>8</dd><dt>Last change</dt><dd>Upgrade complete</dd><dt>Installed</dt><dd>Sep 3, 2026, 10:12 AM</dd></dl>`
}

function upgradeFromRepo(): string {
  return adlg({
    glyph: 'circle-arrow-up',
    title: 'Upgrade payments-api',
    subject: 'Helm release · payments',
    cluster: true,
    body: `<div class="fl"><span>Chart</span><div class="from"><div class="ro on"><span class="rd"></span><span>A newer version from acme-charts<small>payments-api 2.5.0, released yesterday</small></span></div><div class="three"><span class="sel">acme-charts${icon('chevron-down', 14)}</span><span class="sel mono">payments-api${icon('chevron-down', 14)}</span><span class="sel mono">2.5.0${icon('chevron-down', 14)}</span></div><div class="ro dim"><span class="rd"></span><span>The chart it runs: payments-api 2.4.2</span></div><div class="ro dim"><span class="rd"></span><span>A chart from another repository or a registry</span></div><div class="ro dim"><span class="rd"></span><span>A chart on this computer</span></div></div></div>
      <div class="fl"><span>Values</span><div class="editor2">Its values as they are now, as today’s Upgrade opens with them</div></div>`,
    command: `helm upgrade payments-api ./payments-api-2.5.0.tgz --values values.yaml --namespace payments --kube-context ${CONTEXT}`,
    note: 'Lumovi fetches payments-api 2.5.0 from acme-charts with its saved sign-in, then hands Helm the chart. The command can’t say the sign-in.',
    confirm: 'Review',
  })
}

function updateFrame(): string {
  return `<section class="blk"><h2>Update available<i>on a release whose chart is in exactly one repository added, with a newer version there</i></h2>
    <p class="cap"><b>Releases</b>, with an Update column and a chip for it; logging’s dash under the pointer.</p>${helmWin(releasesPage())}
    <p class="cap" style="margin-top:8px"><b>payments-api’s panel</b>: Update available beside its status, a button that opens Upgrade with 2.5.0. The list beside it has given way, as LMV-113 has it, to Name, Status and Chart.</p>${helmWin(releasesPage('payments-api'), { html: releasePanel(), width: 520 })}</section>
    <section class="blk"><h2>Upgrade, to the newer version<i>today’s Upgrade, with the newer chart chosen</i></h2><div class="row"><div class="col">${upgradeFromRepo()}</div></div></section>`
}

const UPD_RULES = [
  '<b>“Update available: 2.5.0”</b>, in Lumovi’s accent with the upgrade arrow, only where Lumovi knows the release came from that repository: it installed or upgraded it from there (and recorded so), or the chart’s name and its source (<code>home</code> or <code>sources</code>, as the release’s own chart records them) match that repository’s chart. And there must be a newer version there. The version compared is the chart’s, never the app’s, as Semantic Versioning orders them; a pre-release counts only when the release runs one.',
  '<b>It says nothing</b> where it can’t be sure, a dash whose tooltip says why: a chart of that name whose source differs, from a release Lumovi didn’t install (logging, under the pointer); a chart in more than one repository with nothing to tell them apart; a chart in none; a repository it couldn’t read. Never a guess, and never “up to date”: no news is a dash.',
  '<b>In Releases</b> it’s a column of its own, Update, after Chart, giving way early when there’s no room (LMV-113’s order, priority 3), and a chip, “Update available 2”, that filters to them. It sorts newest-first by what’s available.',
  '<b>In a release’s panel</b> it stands beside the status, as a button: pressing it opens Upgrade with the newer version chosen. The Overview’s Chart says where it is (“2.5.0 in acme-charts”). Upgrade… itself is as today.',
  '<b>Upgrade, with a newer version</b>, gains a first choice, <b>A newer version from acme-charts</b>, its repository, chart and version as menus (to pick another); then today’s three. Its values are the release’s own, as today, and its review step is today’s diff. The fetched chart is checked against its digest before Helm gets it, as on Install, and Lumovi records the repository it came from.',
  '<b>Read when the indexes are</b>: every 30 minutes and when the Helm page opens; a release’s Update available changes with them, without the page reloading.',
]

// ─── 4. On a phone ──────────────────────────────────────────────────────────────────────────

function phones(): string {
  const rel = `<div class="phr"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Helm</b><span class="tap">${icon('search', 20)}</span></div><div class="ptabs2"><span class="on">Releases<small>12</small></span><span>Charts<small>61</small></span><span>Repositories<small>4</small></span></div><div class="pcnt">12 releases</div>${RELEASES.slice(
    0,
    3,
  )
    .map(
      ([level, name, ns, st, chart, up]) =>
        `<div class="pc"><div class="top">${dot(level)}<b>${name}</b><i>${ns}</i></div><dl>${`<div><dt>Status</dt><dd>${st}</dd></div><div><dt>Chart</dt><dd>${chart}</dd></div>`}${up ? `<div style="grid-column:1/-1"><dt>Update</dt><dd>${upd(up)}</dd></div>` : ''}</dl></div>`,
    )
    .join('')}</div>`
  const page = `<div class="phr"><div class="pb"><span class="tap">${icon('arrow-left', 20)}</span><b>payments-api</b></div><div class="pin"><small>Helm release · payments</small><h3>payments-api</h3><div class="pills">${pill('healthy', 'Deployed')}${upd('2.5.0')}</div></div><div class="ptabs2"><span class="on">Overview</span><span>Resources</span><span>Values</span><span>Manifest</span><span>History</span></div><dl class="pfacts"><div><dt>Chart</dt><dd>payments-api 2.4.2 · 2.5.0 in acme-charts</dd></div><div><dt>App version</dt><dd>2.4.2</dd></div><div><dt>Revision</dt><dd>8</dd></div></dl><p class="pnote">${icon('info', 14)}<span>Upgrade waits for a larger screen, as every change to a cluster does.</span></p></div>`
  const repos = `<div class="phr"><div class="pb"><span class="tap">${icon('menu', 20)}</span><b>Helm</b><span class="tap">${icon('search', 20)}</span></div><div class="ptabs2"><span>Releases<small>12</small></span><span>Charts<small>61</small></span><span class="on">Repositories<small>4</small></span></div><div class="pcnt">4 repositories</div>${REPOS.slice(
    0,
    3,
  )
    .map(
      ([level, name, kind, addr, , n, read, when]) =>
        `<div class="pc"><div class="top">${dot(level)}<b>${name}</b><i>${kind}</i></div><dl class="one"><div><dt>Address</dt><dd class="mono">${addr}</dd></div><div><dt>Index</dt><dd${read === 'Read' ? '' : ' style="color:var(--critical-text)"'}>${read === 'Read' ? `Read ${when} ago · ${n} charts` : escape(read)}</dd></div></dl></div>`,
    )
    .join('')}</div>`
  return `<section class="blk"><h2>On a phone<i>read: what’s there and what’s newer; changes wait for a larger screen</i></h2><div class="row">${rel}${page}${repos}</div><p class="cap" style="max-width:1200px">Left: Releases as cards, Update available a fact on those that have one. Middle: a release’s page, Update available beside its status, not a button there, as Upgrade waits for a larger screen (main’s phone gate refuses Helm’s changes). Right: Repositories, read: no Add, Edit, Remove or Test on a phone, as adding one means typing a sign-in, and on a server changes what everyone installs from (the PM’s ruling). Charts reads the same way, with no Install.</p></section>`
}

// ─── The frames ─────────────────────────────────────────────────────────────────────────────

export type HelmReposFrame =
  'helmrepo-repos' | 'helmrepo-charts' | 'helmrepo-update' | 'helmrepo-phone'

export const HELM_REPOS_FRAMES: { id: HelmReposFrame; title: string; size: Size }[] = [
  { id: 'helmrepo-repos', title: 'Helm: repositories', size: { width: 1440, height: 4100 } },
  { id: 'helmrepo-charts', title: 'Helm: the chart browser', size: { width: 1440, height: 1940 } },
  { id: 'helmrepo-update', title: 'Helm: Update available', size: { width: 1440, height: 2560 } },
  {
    id: 'helmrepo-phone',
    title: 'Helm repositories on a phone',
    size: { width: 1440, height: 875 },
  },
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
export function helmReposFrame(id: HelmReposFrame, scheme: Scheme): string {
  const f = HELM_REPOS_FRAMES.find((x) => x.id === id)!
  const intro = (title: string, text: string) => `<header><h1>${title}</h1><p>${text}</p></header>`
  const body = {
    'helmrepo-repos': () =>
      `${intro('Helm repositories (LMV-354)', 'A Repositories tab on the Helm page: added, edited, tested and removed, HTTP and OCI; sign-ins kept where they can be, never shown again, and never handed to Helm. Words are drafts for docs.')}${reposFrame()}${rules(REPO_RULES)}`,
    'helmrepo-charts': () =>
      `${intro('Helm: the chart browser (LMV-354)', 'Every chart in the repositories added, searched, with its versions; Install opens today’s dialog with the chart filled in. Words are drafts for docs.')}${chartsFrame()}${rules(CHART_RULES)}`,
    'helmrepo-update': () =>
      `${intro('Helm: Update available (LMV-354)', 'A release whose chart has a newer version in the one repository it can be from says so, in the list and its panel, and Upgrade opens with it. Words are drafts for docs.')}${updateFrame()}${rules(UPD_RULES)}`,
    'helmrepo-phone': phones,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
