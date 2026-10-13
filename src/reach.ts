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

export type ReachFrame = 'reach-links' | 'reach-start' | 'reach-where'

export const REACH_FRAMES: { id: ReachFrame; title: string; size: Size }[] = [
  { id: 'reach-links', title: 'Reach: where a link sits', size: { width: 1440, height: 1100 } },
  {
    id: 'reach-start',
    title: 'Reach: the Shell tab, waiting for Start',
    size: { width: 1440, height: 900 },
  },
  { id: 'reach-where', title: 'Reach: where each works', size: { width: 1440, height: 1000 } },
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
  }[id]()
  return sheet(scheme, f.size.width, body)
}
