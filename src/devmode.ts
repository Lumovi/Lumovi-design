/**
 * Writing one (LMV-291, desktop only): a person's own plugin with code, run only while Developer
 * mode is on and only once they've agreed to what it may do. On the Plugins page as the store
 * left it (`pluginstore.ts`): the switch on the footer's folder line, the rows of yours with
 * code, the agree dialog, and a plugin's page while its code waits. Words are docs' (final).
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { STORE_FRAME_CSS, HERE, SECTION, STATE, ask, dlg } from './pluginstore.ts'
import { CSS as PLUGIN } from './plugins.ts'
import { CSS as SHELL, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'
import { CSS as STORE } from './store.ts'

const CSS = `
.opening { display: flex; gap: 10px; margin: 20px 20px 0; padding: 12px 16px; border-radius: 12px; background: var(--surface-2); font-size: 13px; line-height: 20px; color: var(--text-2); }
.opening > svg.i { flex: none; margin-top: 3px; color: var(--text-3); }
.opening em { font-style: normal; color: var(--text-1); background: color-mix(in srgb, var(--accent) 10%, transparent); border-radius: 3px; padding: 0 2px; }
.prow .wait { display: block; margin-top: 2px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.foot2 { display: flex; flex: none; align-items: flex-start; gap: 16px; padding: 10px 20px; border-top: 1px solid var(--line); font-size: 12px; line-height: 18px; color: var(--text-3); }
.foot2 > svg.i { flex: none; margin-top: 2px; }
.foot2 .t { min-width: 0; flex: 1; }
.foot2 .t code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-2); }
.foot2 .t .dm { display: flex; gap: 6px; margin-top: 4px; color: var(--text-3); }
.foot2 .t .dm svg.i { flex: none; margin-top: 2px; }
.dmsw { display: flex; flex: none; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.dmsw.off2 { opacity: 0.5; }
.sw2 { display: inline-flex; width: 32px; height: 18px; padding: 2px; border-radius: 999px; background: color-mix(in srgb, var(--text-3) 40%, transparent); }
.sw2 i { width: 14px; height: 14px; border-radius: 999px; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.25); }
.sw2.on { justify-content: flex-end; background: var(--accent); }
.footbox { overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.wait2 { display: flex; flex-direction: column; align-items: center; padding: 56px 24px; text-align: center; }
.wait2 .tl2 { display: grid; width: 44px; height: 44px; margin-bottom: 14px; place-items: center; border-radius: 16px; background: var(--surface-3); color: var(--text-2); }
.wait2 h3 { margin: 0; font-size: 15px; font-weight: 600; color: var(--text-1); }
.wait2 p { max-width: 380px; margin: 6px 0 18px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.strip2 { display: flex; align-items: center; gap: 8px; min-height: 36px; padding: 6px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-2); }
.strip2 svg.i { color: var(--text-3); }
.strip2 b { font-weight: 600; color: var(--text-1); }
.strip2 .end { margin-left: auto; font-weight: 500; color: var(--text-1); }
.ent { width: 1200px; overflow: hidden; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.ent .eb { padding: 14px 20px 16px 76px; border-top: 1px solid var(--line); background: var(--surface-2); }
.ent .eh { display: flex; align-items: center; gap: 16px; max-width: 700px; font-size: 13px; font-weight: 500; color: var(--text-1); }
.ent .eh .sw2 { margin-left: auto; }
.ent .eh .sw2.dis { opacity: 0.5; }
.ent .el { display: flex; align-items: center; gap: 8px; max-width: 700px; margin-top: 4px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.ent .el svg.i { flex: none; color: var(--text-3); }
.ent .el .btn { margin-left: 8px; }
.pagebx { width: 760px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pagebx .tabs2 { display: flex; gap: 20px; height: 40px; align-items: flex-end; padding: 0 20px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--text-2); }
.pagebx .tabs2 span { padding-bottom: 10px; }
.pagebx .tabs2 .on { color: var(--text-1); box-shadow: inset 0 -2px 0 var(--accent); }
.ask.red > svg.i, .ask.red .say { color: var(--critical-text); }
.ask .pth { margin: 6px 0 0; padding: 0 0 0 12px; border-left: 2px solid color-mix(in srgb, var(--critical) 35%, transparent); list-style: none; }
.ask .pth li { padding-left: 2ch; text-indent: -2ch; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-1); overflow-wrap: anywhere; }
.ask .pth li i { font-style: normal; color: var(--text-3); }
`

/** One of yours: where its code stands, which says the row's quiet line and its end. */
type Code = 'first' | 'changed' | 'more' | 'agreed' | 'off'

interface Mine {
  name: string
  glyph: IconName
  version: string
  kinds: string
  code: Code
}

/** Docs' line under the name; agreed has none, as Lumovi's own code that runs. */
const LINE: Record<Code, string> = {
  first: 'Its code waits for you to agree to what it may do.',
  changed: 'Its code changed since you agreed. It waits for you.',
  more: 'It asks for more than when you agreed. It waits for you.',
  agreed: '',
  off: 'Its pages don’t run: Developer mode is off.',
}

const SEE = `<span class="btn secondary sm">See what it may do…</span>`

const folder = (name: string) => `~/.lumovi/plugins/${name.toLowerCase()}/plugin.yaml`

function mine(r: Mine): string {
  const waits = r.code === 'first' || r.code === 'changed' || r.code === 'more'
  return `<div class="prow"><span class="glyph">${icon(r.glyph, 18)}</span>
    <span class="nm"><b>${r.name}</b><span class="v">${r.version}</span><span class="yours">Yours</span><small>${r.kinds}</small>${LINE[r.code] ? `<span class="wait">${LINE[r.code]}</span>` : ''}</span>
    ${HERE.sidebar}<span class="from fromst">Yours<small>${folder(r.name)}</small></span><span class="act">${waits ? SEE : ''}</span></div>`
}

const MINE: Mine[] = [
  { name: 'Gauges', glyph: 'activity', version: '0.4.0', kinds: 'Gauges', code: 'more' },
  {
    name: 'Ledger',
    glyph: 'layers',
    version: '0.9.2',
    kinds: 'Ledgers, LedgerEntries',
    code: 'changed',
  },
  { name: 'Queues', glyph: 'list', version: '0.1.0', kinds: 'Queues, Consumers', code: 'first' },
  { name: 'Shelf', glyph: 'folder', version: '1.0.0', kinds: 'Shelves', code: 'agreed' },
]

type Mode = 'on' | 'off' | 'locked'

/** The opening, whole, with its one clause that follows Developer mode (docs' words). */
const AND_YOURS: Record<Mode, string> = {
  off: 'and yours only while Developer mode is on',
  on: 'and yours, each once you’ve agreed to what it may do',
  locked: 'but none of yours: your organization’s policy keeps Developer mode off',
}

const opening = (mode: Mode, mark = false) =>
  `<div class="opening">${icon('info', 16)}<span>A plugin teaches Lumovi a tool’s kinds: their columns, status, details and actions. Its actions change objects only with the patches and the objects they spell out, each shown here. Some plugins also add pages drawn by their own code, in a sealed box: it reads only what its file says it may, and any change it proposes waits for you in Lumovi’s own dialog. Those are the plugins from Lumovi-plugins, the ones Lumovi comes with and the ones you install, ${mark ? `<em>${AND_YOURS[mode]}</em>` : AND_YOURS[mode]}. A plugin has no access of its own: what it reads and changes, it does as you, and the cluster refuses what you may not do. Lumovi’s come inside Lumovi, and the ones you install from Lumovi-plugins’ signed releases; yours are your own files.</span></div>`

const SWITCH_LINE =
  'Run code from plugins in your own folder. Only turn this on for plugins you wrote or trust as much as Lumovi.'

/** The footer: the folder line, Developer mode at its end, and docs' line or the lock under. */
const footer = (mode: Mode, shown: string) =>
  `<div class="foot2">${icon('info', 14)}<span class="t">${shown} Yours go in <code>~/.lumovi/plugins</code>. One with the name of one of Lumovi’s is used in its place, all of it.<span class="dm">${mode === 'locked' ? `${icon('lock', 13)}Turned off by your organization’s policy.` : SWITCH_LINE}</span></span><span class="dmsw${mode === 'locked' ? ' off2' : ''}"><span class="sw2${mode === 'on' ? ' on' : ''}"><i></i></span>Developer mode</span></div>`

const head = `<div class="prow head"><span></span><span>Plugin</span><span>On production</span><span>From</span><span></span></div>`

function page(mode: Mode, rows: Mine[]): string {
  return shell(
    'Plugins',
    'plug',
    { after: '', label: 'All plugins', icon: 'plug', tag: '', section: 'Plugins', items: SECTION },
    `${opening(mode)}<div class="bar" style="margin-top:12px"><span class="n">32 come with Lumovi, 4 of yours</span>${seg(['All 36', 'On this cluster 10', 'Yours 4', 'Not in use 0'], 'Yours 4')}${STATE.checked}</div>
    ${head}<div style="position:relative">${rows.map(mine).join('')}</div>
    <div style="flex:1"></div>${footer(mode, '4 of 36 shown.')}`,
    'All namespaces',
  )
}

// ─── The dialog ───────────────────────────────────────────────────────────────────────────

const SUB = (name: string) =>
  `From your own folder, <b>${folder(name)}</b>. Nobody but you vouches for it: what it reads and changes, it does as you.`

const CODE_LINE = ask(
  'code',
  'Draws its pages with its own code, which runs in Lumovi’s sealed box and is handed only what’s listed here.',
)

function dialogs(): string {
  const first = dlg({
    glyph: 'list',
    title: 'Run Queues’ code?',
    sub: SUB('Queues'),
    body: `<div class="part"><p class="cap2">What it may do</p>
      ${CODE_LINE}
      ${ask('pencil', 'Its pages may propose to change and scale Queues, each change one you confirm in Lumovi.')}
      ${ask('eye', 'Of Pods, its code is handed only <code>metadata.name and status.phase</code>, as far as you may read them.')}
      ${ask('scroll-text', 'It shows containers’ logs: Lumovi reads them, and its code never sees them.')}</div>`,
    button: 'Run its code',
    note: 'Its code doesn’t run until you press Run its code.',
  })
  const more = dlg({
    glyph: 'activity',
    title: 'Run Gauges’ code?',
    sub: SUB('Gauges'),
    body: `<div class="part"><p class="cap2">New in 0.4.0<span class="n">2</span></p>
      <div class="ask red">${icon('server', 15)}<span><span class="say">Asks the server gauges-api in this cluster, through Lumovi, and its code reads what it answers:</span><small>The Service gauges-api, port http, in the namespace of the Gauge its page shows</small><ul class="pth"><li>/api/v1/gauges/<i>{gauge}</i>/readings</li></ul></span></div>
      ${ask('eye', 'Of Nodes, its code is handed only <code>metadata.name and status.allocatable</code>, as far as you may read them.')}</div>
      <div class="part"><p class="cap2">No longer</p>${ask('pencil', 'Its pages may propose to scale Gauges, each change one you confirm in Lumovi.', '', 'gone')}</div>
      <div class="part"><div class="closed">${icon('chevron-right', 13)}Everything else it may do, as before (3)</div></div>`,
    button: 'Run its code',
    note: 'Its code doesn’t run until you press Run its code.',
  })
  const changed = dlg({
    glyph: 'layers',
    title: 'Ledger’s code changed',
    sub: SUB('Ledger'),
    body: `<div class="part"><div class="same">${icon('circle-check', 15, 2, 'color:var(--good-text)')}It asks for nothing it doesn’t already have.</div><div class="closed" style="padding-top:10px">${icon('chevron-right', 13)}What it may do (5)</div></div>`,
    button: 'Run its code',
    note: 'Its code doesn’t run until you press Run its code.',
  })
  const fix = (html: string) =>
    html.replace(
      '<span class="btn ghost sm">Cancel</span>',
      '<span class="btn ghost sm">Not now</span>',
    )
  return `<section class="blk"><h2>Agreeing to run its code<i>the store’s dialog, said for your own folder</i></h2>
    <div class="dgrid"><div class="blk"><p class="cap">The first time: what it may do, the code line first</p>${fix(first)}</div><div class="blk"><p class="cap">It asks for more than when you agreed: New in, red first, then No longer</p>${fix(more)}</div><div class="blk"><p class="cap">Only its code changed: one press</p>${fix(changed)}</div></div>
    <ul class="rules">
      <li><b>One dialog</b>, the store’s, from a row’s See what it may do… or the page’s own: “Run Queues’ code?” and docs’ subtitle, which says where it’s from (your folder and its file) and that nobody but you vouches for it. No release, no signature, no GitHub link: there’s nothing of Lumovi-plugins’ to point at. A name says whose as Lumovi’s whose() does: “Queues’ code”, “Ledger’s code”. Its buttons are Run its code and Not now; Escape is Not now, and the code doesn’t run until it’s pressed.</li>
      <li><b>What changed since you agreed</b> is worked out from the file’s asks and its code’s digest. More asked: New in (a red line first, as the store’s update has it), then No longer, struck, and the rest folded. Only the code: its own title, “Ledger’s code changed”, the good line that it asks for nothing more, and one press. A developer rebuilding sees this on each build, so it never asks more than that.</li>
      <li><b>Agreed</b>, the row loses its line and its button, and its pages run as Lumovi’s own do, with Run its code in its entry to turn them off. Not now leaves the row waiting, saying so, and nothing else changes. Every agreement is audited (<code>plugin.code-agreed</code>, with the digests).</li>
    </ul></section>`
}

// ─── The rest: the opening, the footer, a row while off, and a page while its code waits ───

function states(): string {
  const box = (html: string, w = 1200) => `<div class="footbox" style="width:${w}px">${html}</div>`
  const openings = (['off', 'on', 'locked'] as Mode[])
    .map(
      (m) =>
        `<p class="cap">${{ off: 'Developer mode off (as it starts)', on: 'Developer mode on', locked: 'Locked off by policy' }[m]}</p>${box(`<div style="padding-bottom:20px">${opening(m, true)}</div>`)}`,
    )
    .join('')
  const footers = (['off', 'on', 'locked'] as Mode[])
    .map(
      (m) =>
        `<p class="cap">${{ off: 'Off', on: 'On', locked: 'Locked off: pluginDeveloperMode: off, or plugins: bundled, off or no-code' }[m]}</p>${box(footer(m, '36 of 36 shown.'))}`,
    )
    .join('')
  const offRow = `<div class="footbox" style="width:1200px">${mine({ ...MINE[2]!, code: 'off' })}</div>`
  const pg = (inner: string) =>
    `<div class="pagebx"><div class="tabs2"><span class="on">Overview</span><span>Queues 3</span><span>Consumers 12</span></div><div class="strip2">${icon('plug', 13)}<span>This page is from your plugin <b>Queues</b> 0.1.0, from your own folder.</span><span class="end">What it may do →</span></div>${inner}</div>`
  const offPage = pg(
    `<div class="wait2"><span class="tl2">${icon('plug', 20)}</span><h3>Developer mode is off.</h3><p>Turn it on in Plugins to run Queues’ code.</p><span class="btn secondary">Open Plugins</span></div>`,
  )
  const lockedPage = pg(
    `<div class="wait2"><span class="tl2">${icon('lock', 20)}</span><h3 style="margin-bottom:0">Your organization’s policy keeps Developer mode off.</h3></div>`,
  )
  const entry = (line: string, code: Code) =>
    `<div class="ent">${mine({ ...MINE[2]!, code }).replace(SEE, '')}<div class="eb"><div class="eh">Run its code<span class="sw2${code === 'agreed' ? ' on' : ' dis'}"><i></i></span></div><div class="el">${line}</div></div></div>`
  const entries = [
    [
      'Waiting: off and disabled, docs’ waiting line where the description was, and the way to agree',
      entry(`Its code waits for you to agree to what it may do.${SEE}`, 'first'),
    ],
    ['Developer mode off', entry('Its pages don’t run: Developer mode is off.', 'off')],
    [
      'Locked by policy',
      entry(`${icon('lock', 13)}Turned off by your organization’s policy.`, 'off'),
    ],
    [
      'Agreed: the person’s own switch, and its description back',
      entry(
        'Draws its overview. It reads Pods as you, and proposes changes, each one you confirm.',
        'agreed',
      ),
    ],
  ]
    .map(([c, h]) => `<p class="cap">${c}</p>${h}`)
    .join('')
  const waiting = `<div class="pagebx"><div class="tabs2"><span class="on">Overview</span><span>Queues 3</span><span>Consumers 12</span></div><div class="strip2">${icon('plug', 13)}<span>This page is from your plugin <b>Queues</b> 0.1.0, from your own folder.</span><span class="end">What it may do →</span></div><div class="wait2"><span class="tl2">${icon('list', 20)}</span><h3>Queues’ code waits for you</h3><p>It runs once you’ve seen what it may do and agreed.</p><span class="btn primary">See what it may do…</span></div></div>`
  return `<section class="blk"><h2>The opening’s three endings<i>one clause follows Developer mode, the rest stays</i></h2><div class="blk">${openings}</div></section>
    <section class="blk"><h2>The switch<i>on the footer’s folder line, whatever filter is picked</i></h2><div class="blk">${footers}</div>
    <ul class="rules">
      <li><b>Where</b>: at the end of the footer’s line, beside “Yours go in ~/.lumovi/plugins”, the folder whose code it lets run; always in view, Yours 0 included, as someone is about to start. Lumovi has no settings page of its own to put it in. Docs’ line under it is always shown, never a tooltip: whoever turns it on has read it.</li>
      <li><b>Locked</b>: the switch off and at half strength, its line replaced by the lock and “Turned off by your organization’s policy.”, as the locked Run its code says it. The opening says none of yours run. On a server there’s no switch at all: a server’s plugins are its administrator’s (LMV-295).</li>
      <li><b>Turned off</b>, every plugin of yours with code stops at once: its open pages turn to the switched-off place below, and its row says “Its pages don’t run: Developer mode is off.” Its agreement is kept (turning it off is a switch, not taking an agreement back), so turning it on again runs what you agreed to without asking, unless its file’s asks or its code’s digest changed meanwhile: the agreement is bound to both and checked at every hand-over. The organization’s policy turning it off is someone else’s decision, so it clears every agreement: allowed again, each waits for the first dialog.</li>
    </ul></section>
    <section class="blk"><h2>A row of yours while Developer mode is off</h2>${offRow}</section>
    <section class="blk"><h2>Run its code, in the opened entry<i>it shows whether the code can run, not only what the person chose</i></h2><div class="blk">${entries}</div>
    <ul class="rules">
      <li><b>When something else stops it</b> (it waits for you to agree, Developer mode is off, or the policy locks it), the switch is off and disabled at half strength, and the line under it says why, in place of the description, as the locked Run its code already does. Waiting, the line has See what it may do… beside it.</li>
      <li><b>Once nothing stops it</b>, the switch shows the person’s own choice again and its description comes back. Their choice is kept underneath: turning Run its code off before agreeing still keeps it off after.</li>
    </ul></section>
    <section class="blk"><h2>Its page while Developer mode is off<i>a switched-off place, never a failure</i></h2><div class="row2" style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap"><div class="blk"><p class="cap">Off: what to do, and where</p>${offPage}</div><div class="blk"><p class="cap">Locked by policy: said, with nothing to press</p>${lockedPage}</div></div>
    <ul class="rules">
      <li><b>Off</b>: the tile with the plugin glyph, docs’ “Developer mode is off.” and “Turn it on in Plugins to run Queues’ code.”, and Open Plugins, secondary, since it goes somewhere rather than does something. No “the rest of Lumovi” line: nothing failed.</li>
      <li><b>Locked</b>: the lock in the tile and docs’ one sentence, “Your organization’s policy keeps Developer mode off.”, with no button, as there’s nothing the person can do here.</li>
      <li><b>Its lists stay</b> in both, as when its code waits: only what its code draws is held.</li>
    </ul></section>
    <section class="blk"><h2>Its page while its code waits<i>in place of its pages, until you’ve agreed</i></h2>${waiting}
    <ul class="rules">
      <li><b>In place of what its code draws</b>: the page’s strip as any of yours, then the tile, “Queues’ code waits for you”, docs’ line, and See what it may do…, which opens the dialog. Filled, being the page’s one thing to do; it never runs the code itself.</li>
      <li><b>Its lists stay</b>: the tabs that are data (Queues, Consumers) work as they would without code. Only what its code draws waits.</li>
      <li><b>Agreed</b> there, the page draws itself in place. Not now leaves this, and the row says the same.</li>
    </ul></section>`
}

export type DevFrame = 'dev-page' | 'dev-dialogs' | 'dev-states'

export const DEV_FRAMES: { id: DevFrame; title: string; size: Size }[] = [
  {
    id: 'dev-page',
    title: 'Writing one: the Plugins page, yours',
    size: { width: 1440, height: 900 },
  },
  {
    id: 'dev-dialogs',
    title: 'Writing one: agreeing to run its code',
    size: { width: 1200, height: 1400 },
  },
  {
    id: 'dev-states',
    title: 'Writing one: the opening, the switch, a page that waits',
    size: { width: 1440, height: 2000 },
  },
]

const RULES_PAGE = `<ul class="rules" style="margin:20px 32px 32px">
  <li><b>A row of yours with code</b> keeps Yours and its file’s path under From, as any of yours. Waiting, it says why under its kinds, in the quiet line “Its pages don’t run: …” uses today: the first time, when its code changed, or when it asks for more, each in docs’ words; and See what it may do… at its end, a secondary button, never filled. Agreed, it has no line and no button: it runs as Lumovi’s own do.</li>
  <li><b>No word for “unsigned”</b>: it says how Lumovi checks things, not what to do. The dialog’s subtitle says what matters: it’s from your own folder, and nobody but you vouches for it.</li>
  <li><b>The bar</b> counts each row once, as the store left it: “32 come with Lumovi, 4 of yours”. Rows stay in name order, whatever each came from.</li>
</ul>`

/** One of the frames, in one theme. */
export function devFrame(id: DevFrame, scheme: Scheme): string {
  const f = DEV_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'dev-page'
      ? `${page('on', MINE)}${RULES_PAGE}`
      : `<div class="sheet">${id === 'dev-dialogs' ? `<header><h1>Writing one (LMV-291)</h1><p>Desktop only. A plugin of yours may carry code in its own folder (<code>~/.lumovi/plugins/&lt;name&gt;/plugin.yaml</code> and <code>plugin.js</code>), and it runs only while Developer mode is on and once you’ve agreed to what it may do, through the same box, door and checks as Lumovi’s own. Words are docs’.</p></header>${dialogs()}` : states()}</div>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; color: var(--text-1); }
${PARTS}
${SHELL}
${PLUGIN}
${STORE}
${STORE_FRAME_CSS}
${CSS}
${id === 'dev-page' ? `.win { height: ${f.size.height - 1}px; }` : ''}
</style>${body}`
}
