/**
 * Reach (LMV-290): a plugin's page linking to Lumovi's own Logs and Shell tabs and its Port
 * forward dialog, for a pod it shows. A link is Lumovi's part, taken only on the person's press:
 * a Header button with `goes`, or a Table row whose `opens` names a tab. Lumovi says where it goes
 * and draws the destination's icon; the plugin only names the button. A shell opened from a
 * link waits for Start. Drawn before it's built, on CloudNativePG's Clusters page.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
  btn,
  card,
  fact,
  head,
  header2,
  lead,
  ltab,
  only,
  pgframe,
  phoneFrame,
  table,
  whoseStrip,
} from './kit.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
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
.row2 { display: flex; gap: 24px; align-items: flex-start; }
.go2 { display: inline-flex; align-items: center; gap: 6px; }
.go2 svg.i { color: var(--text-3); }
.tip3 { position: absolute; z-index: 3; padding: 5px 9px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 17px; color: var(--surface); white-space: nowrap; box-shadow: var(--shadow-pop); }
.tip3 b { font-weight: 600; }
.rel { position: relative; }
.sstart { display: flex; flex-direction: column; align-items: center; padding: 40px 24px 32px; text-align: center; }
.sstart .tl2 { display: grid; width: 44px; height: 44px; margin-bottom: 14px; place-items: center; border-radius: 16px; background: var(--accent-soft); color: var(--accent-strong); }
.sstart h3 { margin: 0; font-size: 15px; font-weight: 600; }
.sstart p { max-width: 380px; margin: 6px 0 0; font-size: 13px; line-height: 20px; color: var(--text-2); }
.sstart dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; width: 100%; max-width: 380px; margin: 18px 0 0; padding: 12px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); text-align: left; font-size: 12px; }
.sstart dt { color: var(--text-3); }
.sstart dd { margin: 0; min-width: 0; color: var(--text-1); }
.sstart dd.m { font-family: 'JetBrains Mono', monospace; }
.sel2 { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); font-size: 12px; }
.sel2 svg.i { color: var(--text-3); }
.sstart .btn.primary { margin-top: 20px; }
.sstart .q { max-width: 380px; margin-top: 12px; font-size: 12px; line-height: 18px; color: var(--text-3); }
.tbar2 { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 20px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-2); }
.via { display: inline-flex; align-items: center; gap: 6px; }
.via svg.i { color: var(--text-3); }
.wia { width: 520px; padding: 20px 24px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); font-size: 13px; line-height: 20px; color: var(--text-2); }
.wia h4 { margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.wia p { margin: 0 0 8px; }
.wia code, .srvd code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); }
.srv { margin: 0 0 10px; }
.srv .say { color: var(--critical-text); }
.srv .svc { display: block; font-size: 12px; line-height: 18px; color: var(--text-3); }
.srv ul { margin: 6px 0 0; padding: 0 0 0 12px; border-left: 2px solid color-mix(in srgb, var(--critical) 35%, transparent); list-style: none; }
.srv li { padding-left: 2ch; text-indent: -2ch; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-1); overflow-wrap: anywhere; }
.srv li i { font-style: normal; color: var(--text-3); }
.srv .more { display: inline-flex; align-items: center; gap: 4px; margin-top: 2px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.srv .more svg.i { color: var(--text-3); }
.srv.off .say { color: var(--text-2); }
.srv.off ul { border-left-color: var(--line-strong); }
.srv.off li { color: var(--text-3); }
.srv .lockl { display: flex; gap: 6px; margin-top: 8px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.srv .lockl svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.ph-wia { padding: 12px 16px 16px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.ph-wia h4 { margin: 16px 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ph-wia p { margin: 0 0 8px; }
.ph-wia code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.ph-card { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; }
.ph-card .g { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--text-2); }
.ph-card b { font-weight: 500; color: var(--text-1); }
.ph-card small { display: block; font-size: 12px; color: var(--text-3); }
.srvd { width: 560px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.srvd .dh { display: flex; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid var(--line); }
.srvd .dh .g { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.srvd .dh h3 { margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.srvd .dh small { display: block; margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--text-3); }
.srvd .dh small b { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-2); }
.srvd .dh small .use { display: block; margin-top: 2px; }
.srvd .part { padding: 14px 20px; font-size: 13px; line-height: 19px; }
.srvd .part + .part { border-top: 1px solid var(--line); }
.srvd .cap2 { display: flex; align-items: center; gap: 8px; margin: 0 0 8px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.srvd .cap2 .n { padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-size: 10.5px; letter-spacing: 0; text-transform: none; color: var(--text-1); }
.srvd .ask { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; color: var(--text-1); }
.srvd .ask > svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.srvd .ask > span { min-width: 0; flex: 1; }
.srvd .ask.red > svg.i { color: var(--critical-text); }
.srvd .ask .srv { margin: 0; }
.srvd .df { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); }
.srvd .df .note { margin-right: auto; font-size: 12px; color: var(--text-3); }
.srvd .closed { display: flex; align-items: center; gap: 6px; padding-top: 8px; font-size: 12.5px; color: var(--text-2); }
.srvd .closed svg.i { color: var(--text-3); }
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

const block = (title: string, sub: string, body: string, rules: [string, string][]) =>
  `<section class="blk"><h2>${title}<i>${sub}</i></h2>${body}<ul class="rules">${rules.map(([b, t]) => `<li><b>${b}</b> ${t}</li>`).join('')}</ul></section>`

/** Lumovi's icon for each destination: the plugin names the button, Lumovi says where it goes. */
const DEST: Record<'logs' | 'shell' | 'forward', IconName> = {
  logs: 'scroll-text',
  shell: 'square-terminal',
  forward: 'arrow-left-right',
}

const goes = (label: string, to: keyof typeof DEST) =>
  `<span class="btn secondary sm go2">${icon(DEST[to], 14)}${label}</span>`

const ACTS = (o: { forward?: boolean } = {}) =>
  `${goes('Primary’s logs', 'logs')}${goes('Shell into primary', 'shell')}${o.forward ? goes('Forward 5432', 'forward') : ''}${btn('Back up now…', 'primary')}`

const INSTANCES = (hover = -1) =>
  table(
    'minmax(0,1.6fr) 104px 120px minmax(0,1fr) 72px',
    [
      head('Name'),
      head('Role'),
      head('Status', { sorted: 'down' }),
      head('Node'),
      head('Age', { r: true }),
    ],
    [
      ['orders-db-1', 'Primary', 'ip-10-0-1-17', '12d'],
      ['orders-db-2', 'Replica', 'ip-10-0-2-44', '12d'],
      ['orders-db-3', 'Replica', 'ip-10-0-3-91', '3d'],
    ].map(([n, r, node, age], i) => ({
      cells: [
        lead({ level: 'healthy', name: n! }),
        `<span>${r}</span>`,
        `<span>${pill('healthy', 'Ready')}</span>`,
        `<span class="q">${node}</span>`,
        `<span class="r">${age}</span>`,
      ],
      cls: i === hover ? 'opens hover' : 'opens',
    })),
  )

function linksFrame(): string {
  const page = (tip: string, hover = -1, forward = false) =>
    `<div class="rel" style="width:900px">${pgframe('CloudNativePG', '1.1.0', `<div class="arr-stack" style="padding:16px">${header2('orders-db', ['healthy', 'Healthy'], ACTS({ forward }))}${card('Instances', '3', INSTANCES(hover))}</div>`)}${tip}</div>`
  const btnTip = `<span class="tip3" style="right:150px;top:104px">Opens Pod shop/orders-db-1 at its Shell tab</span>`
  const rowTip = `<span class="tip3" style="left:40px;top:258px">Opens Pod shop/orders-db-1 at its Logs tab</span>`
  return block(
    'Where a link sits',
    'a Header button with goes, and a Table row whose opens names a tab',
    `<p class="cap">On the desktop: two links and a change in the header, the header’s three; “Shell into primary” under the pointer</p>${page(btnTip)}
    <p class="cap">A row that opens its pod at the Logs tab, under the pointer</p>${page(rowTip, 0)}`,
    [
      [
        'A link is a destination',
        'wherever Lumovi already takes one: a Header button (with goes, in place of press), a Table row’s opens, a Tile’s opens. No new place and no row menu: one press, one destination, and the plugin chooses which.',
      ],
      [
        'A link button',
        'is a secondary button with <b>Lumovi’s icon for where it goes</b> before the plugin’s word: the scroll for Logs, the terminal for Shell, the arrows for a forward. The icon is Lumovi’s, so “Shell into primary” and “Logs” can’t be dressed as each other. It never ends in “…” (nothing is asked first: the destination is Lumovi’s own) and it’s never the filled one, which stays a change.',
      ],
      [
        'Its tooltip',
        'is Lumovi’s words, after the app’s usual wait: “Opens Pod shop/orders-db-1 at its Shell tab”, “… its Logs tab”, “Opens Port forward for Pod shop/orders-db-1, port 5432”. The object is named as Lumovi knows it, from the token, never from the plugin’s text. A screen reader hears the button’s name, then the tooltip as its description.',
      ],
      [
        'A row that opens at a tab',
        'is a row that opens, as any: the hover fill and chevron, and the same tooltip, so a person knows the row goes to Logs before pressing. A row can name only one destination.',
      ],
      [
        'The header’s rule holds',
        'at most three buttons, the filled one last; a link counts as a button. With a fourth, a forward say, “…” stands before the filled one and holds the rest, each with its destination’s icon in the menu, as the kit’s header folds any action.',
      ],
      [
        'Nothing is shown that can’t work',
        '(below): where Lumovi doesn’t offer the destination, the link isn’t drawn, as Lumovi’s own Port forward isn’t on a server.',
      ],
    ],
  )
}

function startFrame(): string {
  const tabs = [
    ltab('Overview'),
    ltab('Logs'),
    ltab('Shell', { on: true }),
    ltab('Map'),
    ltab('Events'),
    ltab('Audit'),
    ltab('YAML'),
  ].join('')
  const panel = `<div class="dpanel" style="max-width:600px;width:600px"><div class="dhd"><div><b>orders-db-1</b><small>Pod · shop · 12d old</small></div>${pill('healthy', 'Running')}</div><nav class="lts">${tabs}</nav><div class="tbar2"><span class="via">${icon('plug', 13)}Opened from CloudNativePG’s page</span></div><div class="sstart"><span class="tl2">${icon('square-terminal', 20)}</span><h3>A shell in orders-db-1</h3><p>CloudNativePG’s page opened this tab. A shell starts only when you press Start: as you, within your access.</p><dl><dt>Container</dt><dd><span class="sel2">postgres${icon('chevron-down', 13)}</span></dd><dt>As</dt><dd>Your kubeconfig’s user for production, with its RBAC</dd><dt>Runs</dt><dd>bash, or sh where there’s no bash</dd></dl><span class="btn primary">${icon('play', 14)}Start shell</span><p class="q">A plugin’s page can bring you here, never start a shell. Opening the Shell tab yourself starts one at once, as always.</p></div></div>`
  const readOnly = `<div class="dpanel" style="max-width:600px;width:600px"><div class="dhd"><div><b>orders-db-1</b><small>Pod · shop · 12d old</small></div>${pill('healthy', 'Running')}</div><nav class="lts">${tabs}</nav><div class="sstart"><span class="tl2" style="background:var(--surface-3);color:var(--text-2)">${icon('square-terminal', 20)}</span><h3>Shells are off</h3><p>production is read-only in Lumovi, and a shell can change a container.</p></div></div>`
  return block(
    'The Shell tab, opened from a link',
    'it waits for Start; it never connects on a link alone',
    `<div class="row2"><div class="blk"><p class="cap">Arrived from CloudNativePG’s “Shell into primary”</p>${panel}</div><div class="blk"><p class="cap">Where Lumovi wouldn’t open a shell anyway: today’s place (read-only here; access and RBAC have theirs)</p>${readOnly}</div></div>`,
    [
      [
        'The Start state',
        'is the node shell’s explainer, the same parts: the accent tile with the terminal, “A shell in orders-db-1”, one line naming the plugin and that Lumovi starts it only on Start, as the person, then the facts (Container, picked as the link asked and changeable here; As, on a server the signed-in person with their RBAC, on the desktop the kubeconfig’s user for that cluster, in docs’ words; Runs, “bash, or sh where there’s no bash”, as Lumovi’s shell does), and “Start shell”. <b>Start is never the default focus</b> (docs’ must): the focus starts on the Container select (with one container, on the explainer’s heading), Enter does nothing, and Start takes a press only after the change dialog’s moment, so a press meant for the plugin’s link can’t land on it.',
      ],
      [
        'Whose it is',
        'the tab’s bar says “Opened from CloudNativePG’s page” with the plug, as long as this tab is open; the plugin’s name is its text, drawn and cut as its texts are. Started, the shell is Lumovi’s own, as any, audited shell.open with the plugin named as how the person got here.',
      ],
      [
        'Only from a link',
        'a person who opens the Shell tab themselves gets a shell at once, as today. A link never connects, and a second link to the same tab, while it waits, changes nothing but the container picked. Where Lumovi wouldn’t open a shell it shows today’s place, never the Start state: read-only “Shells are off”, access “You can’t open shells here”, RBAC “No shell access”, a stopped container “… isn’t running”.',
      ],
      [
        'Logs and a forward',
        'need no such step: Logs is a read, and Port forward is Lumovi’s own dialog whose “Start forwarding” is already the person’s press, with the port the link named filled in.',
      ],
    ],
  )
}

function whereFrame(): string {
  const serverHeader = `<div style="width:900px">${pgframe('CloudNativePG', '1.1.0', `<div class="arr-stack" style="padding:16px">${header2('orders-db', ['healthy', 'Healthy'], ACTS())}</div>`)}</div>`
  const phone = phoneFrame(
    'orders-db',
    `<div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('CloudNativePG', '1.1.0', true)}</div><div class="under">${pill('healthy', 'Healthy')}</div><p class="larger">Open Lumovi on a larger screen to use <b style="font-weight:500;color:var(--text-2)">Shell into primary</b> and <b style="font-weight:500;color:var(--text-2)">Back up now</b>.</p><div class="ph-acts" style="display:flex;gap:8px;padding:12px 16px 0"><span class="btn secondary go2" style="height:44px;padding:0 14px">${icon('scroll-text', 14)}Primary’s logs</span></div><div class="sec"><h3>Instances<small>3</small></h3><ul class="cards"><li><div class="top">${lead({ level: 'healthy', name: 'orders-db-1' })}<span class="twist">${icon('chevron-right', 16)}</span></div><dl>${fact('Role', 'Primary')}${fact('Status', 'Ready')}${fact('Age', '12d')}</dl></li></ul></div>`,
    true,
  )
  return block(
    'Where each works',
    'what Lumovi doesn’t offer there, a link doesn’t either',
    `<div class="row2"><div class="blk"><p class="cap">On a server: no Port forward in Lumovi, so “Forward 5432” isn’t drawn</p>${serverHeader}</div><div class="blk"><p class="cap">On a phone (a server’s page): Logs stays; Shell joins Lumovi’s line with the change; no forward</p>${phone}</div></div>`,
    [
      [
        'Not drawn, not disabled',
        'a link to something Lumovi doesn’t offer where the person is isn’t shown at all, as Lumovi’s own Port forward isn’t on a server and its Shell tab isn’t on a phone. A greyed button would promise something that can’t be had there; the phone’s rule is the same (“what isn’t done isn’t shown”).',
      ],
      [
        'On a phone',
        'Logs works (it’s a read), 44 px high, where the header’s buttons were. A shell link, like the changes, gives way to Lumovi’s one line, named as the plugin wrote it: “Open Lumovi on a larger screen to use Shell into primary and Back up now.” A forward isn’t in the line: a phone is a server’s page, and a server has no forwards on any screen. A row whose opens names Shell opens the pod at its Overview there; one that names a forward opens the object.',
      ],
      [
        'On a server',
        'shells work as Lumovi’s do; forwards aren’t drawn. A row whose opens names a forward opens the object instead.',
      ],
      [
        'Desktop',
        'all three. Access, RBAC and read-only decide on arrival, in Lumovi’s own places, as they do for Lumovi’s own tabs; nothing is greyed before the press for those, since the tab says why itself.',
      ],
    ],
  )
}

/** The red line: what a plugin's code may ask its tool's own server, through Lumovi. */
const srv = (o: {
  service: string
  svc: string
  paths: string[]
  shown?: number
  off?: boolean
}) => {
  const shown = o.shown ?? o.paths.length
  const path = (p: string) => p.replace(/\{([a-z]+)\}/g, '<i>{$1}</i>')
  return `<div class="srv${o.off ? ' off' : ''}"><span class="say">Asks the server ${o.service} in this cluster, through Lumovi, and its code reads what it answers:</span><span class="svc">${o.svc}</span><ul>${o.paths
    .slice(0, shown)
    .map((p) => `<li>${path(p)}</li>`)
    .join(
      '',
    )}</ul>${shown < o.paths.length ? `<span class="more">${icon('chevron-down', 13)}${o.paths.length - shown} more paths</span>` : ''}${o.off ? `<span class="lockl">${icon('lock', 13)}<span>Turned off by your organization’s policy (<code>pluginServers: off</code>): Lumovi asks no server for it.</span></span>` : ''}</div>`
}

const PROM = {
  service: 'prometheus-operated',
  svc: 'The Service prometheus-operated, port web, in the namespace of the Prometheus its page shows',
  // (Target health only: firing alerts are Lumovi's own Alerts page's, LMV-180.)
  paths: ['/api/v1/targets'],
}

const TOYS_PATHS = [
  '/api/v1/widgets',
  '/api/v1/widgets/{widget}',
  '/api/v1/widgets/{widget}/history',
  '/api/v1/widgets/{widget}/history/rollouts/latest/steps',
  '/api/v1/gadgets',
  '/api/v1/gadgets/{gadget}/health',
  '/api/v1/queues',
  '/api/v1/queues/depth',
  '/api/v1/workers',
  '/api/v1/workers/busy',
  '/api/v1/schedules',
  '/api/v1/schedules/next',
  '/api/v1/limits',
  '/api/v1/quotas',
  '/api/v1/version',
  '/api/v1/health',
  '/api/v1/metrics/summary',
  '/api/v1/audit/recent',
  '/api/v1/settings/public',
  '/api/v1/build-info',
]

/** The logs red line: a plugin whose code is handed what containers print (docs' words). */
const logsRed = (off = false) =>
  `<div class="srv${off ? ' off' : ''}"><span class="say">Its code reads containers’ logs: what they print, which can hold tokens and personal data, reaches its code.</span><span class="svc">Of pods its page shows, one container at a time: at most its last 500 lines or hour, as you, within your access.</span>${off ? `<span class="lockl">${icon('lock', 13)}<span>Turned off by your organization’s policy (<code>pluginLogs: off</code>): Lumovi reads no logs for it.</span></span>` : ''}</div>`

const mayRead = (
  red: string,
  last = 'It reads no logs and no Secret’s value, and sends nothing anywhere but to this cluster.',
) => `<div class="wia"><h4>May read</h4>${red}
  <p>Its own kinds’ objects: its columns, status and details are fields of the object shown.</p>
  <p>${last}</p></div>`

const TOYS_SRV = {
  service: 'toys-api',
  svc: 'The Service toys-api, port http, in the namespace of the Widget its page shows',
  paths: ['/api/v1/widgets/{widget}/history'],
}

function serverFrame(): string {
  const page = `<div class="row2">
    <div class="blk"><p class="cap">On the Plugins page: Prometheus Operator, opened (its first real user)</p>${mayRead(srv(PROM))}</div>
    <div class="blk"><p class="cap">Twenty paths (the most a file may list): six, then the rest in place (Toys, the tests’ stand-in)</p>${mayRead(srv({ service: 'toys-api', svc: 'The Service toys-api, port http, in the namespace of the Widget its page shows', paths: TOYS_PATHS, shown: 6 }))}</div>
    <div class="blk"><p class="cap">Turned off by policy: said, not red, since it can’t happen</p>${mayRead(srv({ ...PROM, off: true }))}</div>
  </div>`
  const sub = `From Lumovi-plugins release <b>1.4.0</b>, signed by its release workflow. What it reads and changes, it does as you.<span class="use">In use: 1.0.0, which comes with Lumovi.</span>`
  const dialog = `<div class="srvd"><div class="dh"><span class="g">${icon('activity', 18)}</span><div><h3>Update Prometheus Operator to 1.1.0?</h3><small>${sub}</small></div></div>
    <div class="part"><p class="cap2">New in 1.1.0<span class="n">2</span></p>
      <div class="ask red">${icon('server', 15)}<span>${srv(PROM)}</span></div>
      <div class="ask">${icon('code', 15)}<span>Draws its pages with its own code, which runs in Lumovi’s sealed box and is handed only what’s listed here.</span></div></div>
    <div class="part"><div class="closed">${icon('chevron-right', 13)}Everything else it may do, as before (3)</div></div>
    <div class="df"><span class="note">Nothing changes until you press Update.</span><span class="btn ghost sm">Cancel</span><span class="btn primary sm">Update to 1.1.0</span></div></div>`
  const lastLogs = 'It reads no Secret’s value, and sends nothing anywhere but to this cluster.'
  const two = `<div class="row2">
    <div class="blk"><p class="cap">Two red lines together: its code reads logs and asks its server (Toys, the tests’ stand-in)</p>${mayRead(logsRed() + srv(TOYS_SRV), lastLogs)}
      <p class="cap" style="margin-top:12px">Shown, not read: stays quiet, as today</p><div class="wia"><h4>May read</h4><p>Its own kinds’ objects: its columns, status and details are fields of the object shown.</p><p>It shows containers’ logs: Lumovi reads them, and its code never sees them.</p><p>It reads no Secret’s value, and sends nothing anywhere but to this cluster.</p></div>
      <p class="cap" style="margin-top:12px">Logs turned off by policy (<code>pluginLogs: off</code>): said, not red</p>${mayRead(logsRed(true), lastLogs)}</div>
    <div class="blk"><p class="cap">On a phone: the plugin opened as its own page</p>${phoneFrame(
      'Toys',
      `<div class="ph-wia"><div class="ph-card"><span class="g">${icon('boxes', 18)}</span><span><b>Toys</b> <code>1.3.0</code><small>Widgets</small></span></div><h4>May read</h4>${logsRed()}${srv(TOYS_SRV)}<p>Its own kinds’ objects: its columns, status and details are fields of the object shown.</p><p>${lastLogs}</p></div>`,
      true,
    )}</div>
    <div class="blk"><p class="cap">The store’s dialog with both, each new under New in, red, logs first</p><div class="srvd"><div class="dh"><span class="g">${icon('boxes', 18)}</span><div><h3>Update Toys to 1.3.0?</h3><small>From Lumovi-plugins release <b>1.4.0</b>, signed by its release workflow. What it reads and changes, it does as you.<span class="use">In use: 1.2.0, installed from Lumovi-plugins release <b>1.1.0</b>.</span></small></div></div>
      <div class="part"><p class="cap2">New in 1.3.0<span class="n">2</span></p>
        <div class="ask red">${icon('scroll-text', 15)}<span>${logsRed()}</span></div>
        <div class="ask red">${icon('server', 15)}<span>${srv(TOYS_SRV)}</span></div></div>
      <div class="part"><div class="closed">${icon('chevron-right', 13)}Everything else it may do, as before (4)</div></div>
      <div class="df"><span class="note">Nothing changes until you press Update.</span><span class="btn ghost sm">Cancel</span><span class="btn primary sm">Update to 1.3.0</span></div></div></div>
  </div>`
  const refused = `<div class="srvd"><div class="dh"><span class="g">${icon('activity', 18)}</span><div><h3>Update Prometheus Operator to 1.1.0?</h3><small>${sub}</small></div></div>
    <div class="part"><div class="ask">${icon('lock', 15)}<span><b>Your organization’s policy doesn’t let plugins talk to servers in the cluster, and this one would.</b> (<code>pluginServers: off</code>) 1.0.0 stays in use.</span></div></div>
    <div class="df"><span class="btn ghost sm">Close</span></div></div>`
  return block(
    'What reaches its code',
    'the two red lines a plugin’s file can earn: its tool’s own server, and containers’ logs',
    `${page}${two}<div class="row2"><div class="blk"><p class="cap">The store’s dialog: an update that adds it puts it first under New in</p>${dialog}</div><div class="blk"><p class="cap">Refused by policy, as the dialog’s other refusals are</p>${refused}</div></div>`,
    [
      [
        'The server’s line, red, first',
        'in May read on the Plugins page (it’s a read: GETs only), above the rest, since what it answers reaches the plugin’s code from past the Kubernetes API. Docs’ sentence, naming the Service (“Asks the server prometheus-operated in this cluster, through Lumovi, and its code reads what it answers:”, or “Asks a server in this cluster, …” where the file finds it by labels), since, unlike a Secret’s value or logs it only shows, what it answers is handed to the plugin’s code, in the critical ink, then, quiet, which Service, port and namespace it means, then every path as the file lists it, mono, one a line, hung from a thin red rule so the list reads as the line’s. A long path wraps anywhere, hanging; none is ever cut.',
      ],
      [
        'Paths as listed',
        'a segment Lumovi fills, like <code>{widget}</code>, stays as written in the quiet ink, so the fixed part reads first. Past six, the rest fold behind “14 more paths”, which opens them in place; the most a file may list is twenty. Nothing else on the page or in the dialog is red: red means a plugin can do it, here and now.',
      ],
      [
        'Logs, read or shown',
        'a plugin whose code reads containers’ logs earns the second red line, drawn as the server’s is: docs’ sentence in the critical ink (what they print can hold tokens and personal data, and it reaches the code), then, quiet, how much (one container at a time, the last 500 lines or hour, as you). No list under it. One that only shows logs keeps its quiet line, “It shows containers’ logs: Lumovi reads them, and its code never sees them.”, since nothing reaches its code. Where both red lines are there, logs come first, then the server, each whole. With <code>pluginLogs: off</code> it goes quiet as the server’s does, with docs’ lock line, the same for showing and reading since the key turns off both: “Turned off by your organization’s policy (pluginLogs: off): Lumovi reads no logs for it.” The store refuses an install or update of a plugin that shows or reads logs, Close only: “Your organization’s policy doesn’t let plugins show or read containers’ logs, and this one would. (pluginLogs: off)”, then that the version in use stays, or that nothing is installed. No agree dialog is drawn for a phone or a server: the store is the desktop’s, and a server’s plugins with code are LMV-295’s.',
      ],
      [
        'Turned off',
        'with <code>pluginServers: off</code> the line stays, so the person knows what the plugin would do, but in the page’s own ink, its paths quiet, and a lock line saying the policy turns it off and Lumovi asks no server for it. The store refuses an install or update that would add it, saying which key, as for Secrets. No new part on a plugin’s page: its code gets Lumovi’s sentence for a failure and says what it will.',
      ],
      [
        'In the dialog',
        'the same lines, each with its icon in red (the scroll for logs, the server for its server): under “New in” they come first, before the code line, and on a phone the plugin’s own page has them first in May read too (the store and its dialogs are the desktop’s); in a first install it follows the code line, which docs put first. Its paths are never folded behind “as before”: an update that changes the paths shows the new ones under New in and the gone ones under No longer, struck, as any permission.',
      ],
    ],
  )
}

export type ReachFrame = 'reach-links' | 'reach-start' | 'reach-where' | 'reach-server'

export const REACH_FRAMES: { id: ReachFrame; title: string; size: Size }[] = [
  { id: 'reach-links', title: 'Reach: where a link sits', size: { width: 1440, height: 1100 } },
  {
    id: 'reach-start',
    title: 'Reach: the Shell tab, waiting for Start',
    size: { width: 1440, height: 900 },
  },
  { id: 'reach-where', title: 'Reach: where each works', size: { width: 1440, height: 1000 } },
  {
    id: 'reach-server',
    title: 'Reach: its tool’s own server',
    size: { width: 1680, height: 1400 },
  },
]

/** One of the frames, in one theme. */
export function reachFrame(id: ReachFrame, scheme: Scheme): string {
  const f = REACH_FRAMES.find((x) => x.id === id)!
  const intro =
    '<header><h1>Reach (LMV-290)</h1><p>A plugin’s page can link to Lumovi’s own Logs and Shell tabs and its Port forward dialog, for a pod it shows. A link is Lumovi’s part, taken only on the person’s press; the person does everything else in Lumovi’s own UI. Drawn on CloudNativePG’s Clusters page. Words are drafts for docs.</p></header>'
  const body = {
    'reach-links': () => `${intro}${linksFrame()}`,
    'reach-start': startFrame,
    'reach-where': whereFrame,
    'reach-server': serverFrame,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
