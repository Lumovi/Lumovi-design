/**
 * What plugins would look like in Lumovi, if it had them: sketches for a decision (LMV-235,
 * for LMV-187), not a spec. Lumovi has none today. It extends through views, which are data
 * and can't run code; a plugin would run code, which is the largest thing a dashboard can add
 * to what has to be trusted. One example runs through every frame, a Cost plugin, so the
 * answers can be compared: build plugins, extend views, or neither. Under every frame: what
 * exists today, what would be new, and what it would cost or risk.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { CSS as SHELL, pill, seg, shell } from './proposals.ts'
import { FONTS } from './scene.ts'

const CSS = `
.code-tag { display: inline-flex; align-items: center; gap: 4px; padding: 0 6px; border-radius: 4px; background: color-mix(in srgb, var(--warn) 12%, transparent); font-size: 11px; line-height: 18px; font-weight: 500; color: var(--warn-text); white-space: nowrap; }
.by { display: flex; align-items: center; gap: 8px; padding: 8px 24px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-2); }
.by svg.i { color: var(--text-3); }
.by b { font-weight: 500; color: var(--text-1); }
.by .end { margin-left: auto; display: flex; gap: 12px; color: var(--text-3); }
.pad { display: flex; flex: 1; min-height: 0; flex-direction: column; gap: 16px; overflow: hidden; padding: 20px 24px; }
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.tl { padding: 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.tl .l { font-size: 13px; color: var(--text-2); }
.tl .v { margin-top: 10px; font-size: 28px; line-height: 1; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.tl .s { margin-top: 8px; font-size: 12px; line-height: 20px; color: var(--text-3); }
.cardx { display: flex; min-height: 0; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); overflow: hidden; }
.cardx > h2 { display: flex; align-items: center; margin: 0; padding: 14px 16px 10px; font-size: 13px; font-weight: 600; }
.cardx > h2 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.brow { display: grid; grid-template-columns: 200px 1fr 90px 90px; align-items: center; gap: 16px; padding: 8px 16px; font-size: 13px; }
.brow + .brow { border-top: 1px solid var(--line); }
.brow b { font-weight: 500; }
.brow .t { height: 6px; border-radius: 999px; background: color-mix(in srgb, var(--series-1) 20%, transparent); overflow: hidden; }
.brow .t i { display: block; height: 100%; border-radius: inherit; background: var(--series-1); }
.brow .t i + i { background: var(--text-3); opacity: 0.5; }
.brow .t { display: flex; }
.brow .r { text-align: right; font-variant-numeric: tabular-nums; }
.brow .mu { color: var(--text-3); }
.two { display: grid; grid-template-columns: minmax(0, 1fr) 520px; flex: 1; min-height: 0; }
.two > * { min-width: 0; }
.stops li > span { min-width: 0; }
.dpanel { display: flex; min-height: 0; flex-direction: column; border-left: 1px solid var(--line); background: var(--surface); }
.dpanel .hd { display: flex; gap: 12px; padding: 16px 20px 12px; }
.dpanel .hd .glyph { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); color: var(--text-2); }
.dpanel .hd small { display: block; font-size: 12px; color: var(--text-3); }
.dpanel .hd b { display: block; font-size: 17px; line-height: 1.375; font-weight: 600; letter-spacing: -0.01em; }
.tabsx { display: flex; gap: 4px; padding: 0 20px; box-shadow: inset 0 -1px 0 var(--line); }
.tabsx > span { position: relative; display: flex; height: 36px; align-items: center; gap: 6px; padding: 0 10px; font-size: 13px; font-weight: 500; color: var(--text-3); white-space: nowrap; }
.tabsx > span.on { color: var(--text-1); }
.tabsx > span.on::after { content: ''; position: absolute; right: 8px; bottom: 0; left: 8px; height: 2px; border-radius: 999px; background: var(--accent); }
.sec { padding: 16px 20px; border-bottom: 1px solid var(--line); }
.sec h3 { margin: 0 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.kv { display: grid; grid-template-columns: 150px 1fr; gap: 8px 24px; margin: 0; font-size: 13px; }
.kv dt { color: var(--text-3); }
.kv dd { margin: 0; font-variant-numeric: tabular-nums; }
.spark { display: flex; align-items: flex-end; gap: 3px; height: 56px; margin-top: 4px; }
.spark i { flex: 1; border-radius: 2px 2px 0 0; background: var(--series-1); opacity: 0.85; }
.stops { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.stops li { display: flex; gap: 8px; }
.stops svg.i { margin-top: 3px; color: var(--text-3); }
.stops b { font-weight: 500; color: var(--text-1); }
.yaml { margin: 0; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20.4px; color: var(--text-2); white-space: pre; overflow: hidden; }
.yaml .k { color: var(--accent-strong); }
.plug { display: grid; grid-template-columns: 36px minmax(0, 1.5fr) minmax(0, 1.1fr) minmax(0, 1.4fr) 110px; align-items: center; gap: 16px; padding: 12px 24px; border-bottom: 1px solid var(--line); font-size: 13px; }
.plug .glyph { display: grid; width: 36px; height: 36px; place-items: center; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); color: var(--text-2); }
.plug .nm b { font-weight: 600; }
.plug .nm small { display: block; overflow: hidden; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.plug .pub { font-size: 12px; line-height: 18px; color: var(--text-2); }
.plug .pub span { display: flex; align-items: center; gap: 5px; white-space: nowrap; }
.plug .pub .ok svg.i { color: var(--good-text); }
.plug .pub .no { color: var(--warn-text); }
.asks { display: flex; flex-wrap: wrap; gap: 4px; }
.ask2 { padding: 1px 8px; border-radius: 999px; background: var(--surface-3); font-size: 12px; line-height: 18px; color: var(--text-2); white-space: nowrap; }
.ask2.loose { background: color-mix(in srgb, var(--warn) 15%, transparent); color: var(--warn-text); }
.plug .act { display: flex; justify-content: flex-end; }
.perm { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding: 12px 16px; }
.perm + .perm { border-top: 1px solid var(--line); }
.perm .what { flex: 1; min-width: 200px; }
.perm .what b { display: block; font-size: 13px; font-weight: 500; }
.perm .what small { display: block; font-size: 12px; line-height: 17px; color: var(--text-3); }
.perm .what small.warn { display: flex; gap: 6px; margin-top: 4px; color: var(--warn-text); }
.perms { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
.auditnote { margin-right: auto; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); }
.locked { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; }
.band { display: flex; gap: 10px; margin: 16px 24px 0; padding: 10px 14px; border-radius: 12px; background: var(--surface-2); font-size: 13px; line-height: 19px; color: var(--text-2); }
.band svg.i { margin-top: 2px; color: var(--text-3); }
.strip3 { position: absolute; z-index: 50; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: 110px 1fr; gap: 4px 12px; height: 92px; align-content: center; padding: 0 24px; border-top: 1px solid var(--line-strong); background: var(--surface-2); font-size: 12.5px; line-height: 20px; color: var(--text-2); }
.strip3 b { font-weight: 600; color: var(--text-1); }
.strip3 .risk { color: var(--warn-text); }
`

const runsCode = `<span class="code-tag">${icon('triangle-alert', 11, 2.5)}Runs code</span>`
const by = (extra = '') =>
  `<div class="by">${icon('plug', 14)}<span>From the plugin <b>Cost</b> 1.4.2, by acme-platform</span>${runsCode}<span class="end"><span>Reads Pods, Nodes and usage in every namespace</span><span>No network</span>${extra}</span></div>`

const NAMESPACES: [string, number, number, string, string][] = [
  ['shop', 62, 14, '$1,284', '$310 idle'],
  ['data', 48, 6, '$986', '$122 idle'],
  ['monitoring', 31, 9, '$641', '$188 idle'],
  ['batch', 18, 11, '$372', '$229 idle'],
  ['kube-system', 12, 2, '$251', '$41 idle'],
]

/** 1a. A plugin's own page: tiles and bars summed across objects, which a view can't do. */
function pluginPage(): string {
  return shell(
    'Cost',
    'chart-spline',
    { after: 'Metrics', label: 'Cost', icon: 'chart-spline', tag: 'plugin' },
    `${by()}<div class="pad">
      <div class="tiles">
        <div class="tl"><div class="l">This month so far</div><div class="v">$3,534</div><div class="s">10 days of October</div></div>
        <div class="tl"><div class="l">Projected for the month</div><div class="v">$10,950</div><div class="s">$640 more than September</div></div>
        <div class="tl"><div class="l">Requested and not used</div><div class="v">$890</div><div class="s">25% of what’s requested</div></div>
        <div class="tl"><div class="l">Nodes</div><div class="v">6</div><div class="s">m6i.2xlarge, $0.384 an hour each</div></div>
      </div>
      <div class="cardx"><h2>By namespace<small>Requests × the node’s price, this month so far</small></h2>
        ${NAMESPACES.map(([n, used, idle, cost, i]) => `<div class="brow"><b>${n}</b><span class="t"><i style="width:${used}%"></i><i style="width:${idle}%"></i></span><span class="r">${cost}</span><span class="r mu">${i}</span></div>`).join('')}
      </div>
    </div>`,
    'All namespaces',
  )
}

/** 1b. A plugin's panel on an object's details: a tab of its own on a kind Lumovi has a page for. */
function pluginPanel(): string {
  const G = 'grid-template-columns: minmax(200px, 1.6fr) 150px 80px'
  const row = (n: string, st: string, r: string, sel = false) =>
    `<div class="tr${sel ? ' sel' : ''}" style="${G}"><span class="nm">${n}<small>shop</small></span><span>${st}</span><span class="m">${r}</span></div>`
  const bars = [30, 34, 31, 36, 40, 38, 44, 52, 49, 55]
  return shell(
    'Deployments',
    'layers',
    { after: 'Metrics', label: 'Cost', icon: 'chart-spline', tag: 'plugin', current: 'Workloads' },
    `<div class="two"><div>
      <div class="bar"><span class="n">4 items</span></div>
      <div class="thead" style="${G}"><span>Name</span><span>Status</span><span>Ready</span></div>
      ${row('cart', pill('healthy', 'Ready'), '2/2')}${row('checkout', pill('healthy', 'Ready'), '3/3', true)}${row('recommendations', pill('critical', 'Unavailable'), '0/1')}${row('storefront', pill('healthy', 'Ready'), '3/3')}
    </div><aside class="dpanel">
      <div class="hd"><span class="glyph">${icon('layers', 18)}</span><span><small>Deployment · shop · 88d old</small><b>checkout</b></span></div>
      <div class="tabsx"><span>Overview</span><span>Pods</span><span>Logs</span><span>Metrics</span><span class="on">Cost</span><span>Map</span><span>Events</span><span>YAML</span></div>
      <div class="by" style="padding:8px 20px">${icon('plug', 14)}<span>Drawn by the plugin <b>Cost</b></span>${runsCode}</div><section class="sec"><h3>This month so far</h3><dl class="kv"><dt>Cost</dt><dd>$412 for 3 pods</dd><dt>Requested and not used</dt><dd>$96 (23%)</dd><dt>Projected</dt><dd>$1,277 for October</dd></dl></section>
      <section class="sec"><h3>A day, the last ten</h3><div class="spark">${bars.map((b) => `<i style="height:${b}px"></i>`).join('')}</div></section>
      <section class="sec" style="background:var(--surface-2)"><h3>What it read, kept by Lumovi</h3><dl class="kv"><dt>Plugin</dt><dd>Cost 1.4.2, by acme-platform</dd><dt>For this tab</dt><dd>3 Pods, 2 Nodes, 7 days of usage</dd></dl></section>
    </aside></div>`,
  )
}

/** 2. The same, as a view: what YAML with no code can show of it, and where it stops. */
function asView(): string {
  const G = 'grid-template-columns: minmax(120px, 1fr) 120px 104px 96px 88px 56px'
  const row = (n: string, st: string, a: string, b: string, c: string) =>
    `<div class="tr" style="${G}"><span class="nm">${n}</span><span>${st}</span><span class="r">${a}</span><span class="r">${b}</span><span class="r">${c}</span><span class="r mu">6h</span></div>`
  return shell(
    'Cost reports',
    'chart-spline',
    { after: '', label: 'Cost reports', icon: 'chart-spline', tag: '', section: 'Add-ons' },
    `<div class="two" style="grid-template-columns:minmax(0,1fr) 400px"><div style="display:flex;flex-direction:column;min-height:0">
      <div class="bar"><span class="n">5 objects</span><span class="saved">Healthy 4</span><span class="saved">Warning 1</span><span class="grow"></span><span class="field" style="width:220px;color:var(--text-3)">${icon('search', 14)}Filter Cost reports</span></div>
      <div class="thead" style="${G}"><span>Name</span><span>Status</span><span style="text-align:right">Month so far</span><span style="text-align:right">Projected</span><span style="text-align:right">Not used</span><span style="text-align:right">Age</span></div>
      ${row('shop', pill('healthy', 'Current'), '1284', '3980', '310')}
      ${row('data', pill('healthy', 'Current'), '986', '3056', '122')}
      ${row('monitoring', pill('healthy', 'Current'), '641', '1987', '188')}
      ${row('batch', pill('warning', 'Stale'), '372', '1153', '229')}
      ${row('kube-system', pill('healthy', 'Current'), '251', '778', '41')}
      <div class="pad" style="flex:none;padding-top:16px"><pre class="yaml"><span class="k">apiVersion</span>: lumovi.dev/v1alpha1
<span class="k">kind</span>: View
<span class="k">metadata</span>: { name: cost-reports }
<span class="k">spec</span>:
  <span class="k">kinds</span>: [{ group: cost.example.com, kind: CostReport }]
  <span class="k">columns</span>:
    - { name: Month so far, path: .status.monthToDate, type: number }
    - { name: Projected, path: .status.projected, type: number }
    - { name: Not used, path: .status.idle, type: number }
  <span style="color:var(--text-3)"># Left out here: its status rules, and the AddOn document that
  # gives it the sidebar entry.</span></pre></div>
    </div><aside class="dpanel"><section class="sec" style="border:0"><h3>Where a view stops</h3><ul class="stops">
      <li>${icon('check', 14)}<span><b>It can list a kind,</b> with columns read from each object, a status, details, related lists and spelled-out actions. So this works only if something in the cluster already writes a CostReport for each namespace.</span></li>
      <li>${icon('x', 14)}<span><b>No sums.</b> A column reads one object. Totals for the cluster, or a workload’s share, aren’t expressible.</span></li>
      <li>${icon('x', 14)}<span><b>No tiles, bars or charts.</b> A cell is text, a number, a date, yes or no, or a count: “1284”, as the object has it, with no currency or unit.</span></li>
      <li>${icon('x', 14)}<span><b>Nothing on a Deployment.</b> On kinds Lumovi has a page for, a view may only add actions: no tab, no section.</span></li>
      <li>${icon('x', 14)}<span><b>Nothing worked out.</b> A column reads its own object. Related lists show other objects, and nothing is computed from them. No metrics, no prices, nothing outside the cluster’s API.</span></li>
      <li>${icon('info', 14)}<span><b>Extending views</b> would mean adding some of these to the format, one by one, still as data: a sum over a related list, a unit, a meter.</span></li>
    </ul></section></aside></div>`,
    'All namespaces',
  )
}

interface Plugin {
  glyph: IconName
  name: string
  what: string
  pub: string
  signed: boolean
  reviewed: boolean
  version: string
  asks: [string, boolean?][]
  state: 'installed' | 'available' | 'update'
}

const PLUGINS: Plugin[] = [
  {
    glyph: 'chart-spline',
    name: 'Cost',
    what: 'What each namespace and workload costs, from requests and node prices.',
    pub: 'acme-platform',
    signed: true,
    reviewed: true,
    version: '1.4.2',
    asks: [['Reads Pods, Nodes, usage'], ['No network']],
    state: 'installed',
  },
  {
    glyph: 'shield-check',
    name: 'Image scan results',
    what: 'Vulnerabilities per image, on a workload’s details.',
    pub: 'Lumovi',
    signed: true,
    reviewed: true,
    version: '0.9.0',
    asks: [['Reads Pods, scan reports'], ['No network']],
    state: 'update',
  },
  {
    glyph: 'clock',
    name: 'On-call',
    what: 'Who is on call for a namespace, beside its alerts.',
    pub: 'northwind-sre',
    signed: true,
    reviewed: false,
    version: '2.1.0',
    asks: [['Reads Namespaces'], ['Network: api.pager.example.com', true]],
    state: 'available',
  },
  {
    glyph: 'terminal',
    name: 'Runbook runner',
    what: 'Runs a team’s runbook steps against a workload.',
    pub: 'someone-42',
    signed: false,
    reviewed: false,
    version: '0.3.1',
    asks: [
      ['Changes workloads', true],
      ['Opens shells', true],
      ['Network: any address', true],
    ],
    state: 'available',
  },
]

function plugRow(p: Plugin, o: { admin?: boolean; server?: boolean } = {}): string {
  const act =
    p.state === 'installed'
      ? `<span class="btn ghost sm">Installed${icon('chevron-down', 14)}</span>`
      : p.state === 'update'
        ? `<span class="btn secondary sm">Update to 1.0.0</span>`
        : o.server && !o.admin
          ? `<span class="btn secondary sm off">${icon('lock', 14)}Install…</span>`
          : `<span class="btn secondary sm">Install…</span>`
  return `<div class="plug"><span class="glyph">${icon(p.glyph, 18)}</span>
    <span class="nm"><b>${p.name}</b> <span class="mu" style="font-size:12px;color:var(--text-3)">${p.version}</span><small>${p.what}</small></span>
    <span class="pub"><span>${icon('building-2', 12)}${p.pub}</span>${p.signed ? `<span class="ok">${icon('circle-check', 12)}Signed by its publisher</span>` : `<span class="no">${icon('triangle-alert', 12)}Not signed</span>`}${p.reviewed ? `<span class="ok">${icon('circle-check', 12)}Reviewed by Lumovi</span>` : `<span class="no">${icon('triangle-alert', 12)}Not reviewed</span>`}</span>
    <span class="asks">${p.asks.map(([a, loose]) => `<span class="ask2${loose ? ' loose' : ''}">${a}</span>`).join('')}</span>
    <span class="act">${act}</span></div>`
}

const catalogueHead = (n: string) =>
  `<div class="bar"><span class="n">${n}</span>${seg(['All', 'Installed', 'Updates'], 'All')}<span class="grow"></span><span class="field" style="width:240px;color:var(--text-3)">${icon('search', 14)}Search plugins</span></div>
  <div class="plug" style="padding-top:8px;padding-bottom:8px;font-size:11px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--text-3)"><span></span><span>Plugin</span><span>Published by</span><span>It asks to</span><span></span></div>`

/** 3. The catalogue: who published each, whether it's signed and reviewed, and what it asks for. */
function catalogue(): string {
  return shell(
    'Plugins',
    'plug',
    { after: 'Helm releases', label: 'Plugins', icon: 'plug' },
    `<div class="band">${icon('triangle-alert', 16, 2, 'color:var(--warn-text)')}<span>A plugin is a program. It runs inside Lumovi with what you let it read and do, as you. Install one only from a publisher you’d run code from.</span></div>
    <div style="height:16px"></div>${catalogueHead('1 installed, 1 update, 2 available')}${PLUGINS.map((p) => plugRow(p)).join('')}
    <div class="foot">${icon('info', 14)}“Reviewed by Lumovi” would mean this version’s code was read by Lumovi, which found its requests match what it does. It says nothing of later versions.</div>`,
    'All namespaces',
  )
}

/** 4. Installing one: it asks first, in the pattern of what AI assistants may do. */
function install(): string {
  const perm = (title: string, sub: string, control: string, warn = '') =>
    `<div class="perm"><span class="what"><b>${title}</b><small>${sub}</small>${warn ? `<small class="warn">${icon('lock', 12)}${warn}</small>` : ''}</span>${control}</div>`
  return `${catalogue()}<div class="scrim" style="bottom:92px"></div><div class="dialog" style="top:6%;width:600px">
    <div class="head"><div class="glyph">${icon('plug', 18)}</div><div><h3>Install On-call 2.1.0?</h3><div class="sub">By northwind-sre · signed by its publisher · not reviewed by Lumovi</div></div></div>
    <div class="body">
      <div class="warning"><div class="top">${icon('triangle-alert', 16)}<div><h4>It’s a program, and nobody at Lumovi has read it</h4><p>It runs with what you allow below, as you, each time you open Lumovi. Its publisher’s signature says who made it, not that it’s safe.</p></div></div></div>
      <div class="perms">
        ${perm(
          'Clusters',
          'Where it would run. Lumovi would have to keep it from the others.',
          `<span class="field" style="width:230px">staging, load-test<span class="end">${icon('chevrons-up-down', 14)}</span></span>`,
          'production is left out. Add it yourself, when you mean to.',
        )}
        ${perm(
          'Read',
          'It asks for Namespaces. No plugin could read Secrets through Lumovi.',
          seg(['What it asks', 'Nothing'], 'What it asks'),
        )}
        ${perm(
          'Change',
          'It asks for nothing.',
          '<span style="font-size:12px;color:var(--text-3)">Lumovi would refuse its changes</span>',
        )}
        ${perm('Network', 'It asks to reach api.pager.example.com, to look up who is on call.', seg(['That address', 'Blocked'], 'That address'), 'What it reads from your cluster can leave through this.')}
      </div>
      <div class="command"><div class="label">What Lumovi would have to hold to</div><code>Its code must not read or imitate Lumovi’s own pages, your kubeconfig or your sign-in, and every request it makes must go through Lumovi. These rows hold only as far as that sandbox does. It doesn’t exist yet.</code></div>
    </div>
    <div class="actions"><span class="auditnote">${icon('scroll-text', 14)}Recorded in the audit log</span><span class="btn ghost">Cancel</span><span class="btn primary" style="min-width:80px">Install</span></div>
  </div>`
}

/** 5. On a server: the admin installs, for everyone; everyone else sees what runs, and why. */
function server(): string {
  return shell(
    'Plugins',
    'plug',
    { after: 'Helm releases', label: 'Plugins', icon: 'plug' },
    `<div class="band">${icon('lock', 16)}<span><b style="font-weight:600;color:var(--text-1)">Only Lumovi’s admins install plugins on this server.</b> The server names them: jane@example.com, ops@example.com. What’s installed runs for everyone who signs in. Lumovi would have to hold it to each person’s own access.</span></div>
    <div style="height:16px"></div>${catalogueHead('1 installed for everyone, 3 available')}${PLUGINS.map((p) => plugRow({ ...p, state: p.name === 'Cost' ? 'installed' : 'available' }, { server: true })).join('')}
    <div class="foot">${icon('scroll-text', 14)}Installing, updating and removing a plugin is recorded in the audit log, with who did it. Where the server’s settings turn plugins off, this page says so and lists none.</div>`,
    'All namespaces',
  )
}

export type Frame = 'page' | 'panel' | 'view' | 'catalogue' | 'install' | 'server'

/** Under each frame: what exists today, what would be new, what it would cost or risk. */
export const FRAMES: { id: Frame; title: string; today: string; fresh: string; risk: string }[] = [
  {
    id: 'page',
    title: '1a. A plugin’s own page',
    today: 'Nothing like it. One compiled overview exists, for one add-on, built into the app.',
    fresh:
      'A page in the sidebar drawn by a plugin: tiles, bars, sums across objects. The blue tag marks what’s proposed.',
    risk: 'Its code reads every pod and node you can. A sandbox, permissions and their upkeep are Lumovi’s to build and keep safe, for good.',
  },
  {
    id: 'panel',
    title: '1b. A plugin’s tab on an object',
    today: 'A view can add actions to a Deployment, and nothing else.',
    fresh: 'A tab on kinds Lumovi has pages for, drawn by a plugin, marked as running code.',
    risk: 'A tab inside Lumovi’s own panel borrows its trust, and is where a sandbox is hardest. Keeping a record of what it read is Lumovi’s work too.',
  },
  {
    id: 'view',
    title: '2. The same, as a view',
    today: 'This frame: an add-on listing a kind with columns from each object. No code runs.',
    fresh: 'Extending views means adding sums, units and a meter to the format, as data.',
    risk: 'No new code to trust. The cost is reach: it shows only what something else has already put in the cluster.',
  },
  {
    id: 'catalogue',
    title: '3. A catalogue',
    today: 'Views are files in a folder. There’s no catalogue, no signing and no review.',
    fresh: 'A Plugins page: publisher, signature, review, version, and what each asks for.',
    risk: 'A catalogue is a supply chain: signing keys, takedowns, and someone to read every version of other people’s code. There is no such team today.',
  },
  {
    id: 'install',
    title: '4. Installing one',
    today:
      'By default, Lumovi asks before an assistant changes anything, and shows what it may do.',
    fresh: 'The same pattern for a plugin: clusters, what it reads, what it changes, the network.',
    risk: 'Every row rests on a sandbox that isn’t built: if it fails, the dialog is decoration. And people click through prompts; one allowed address is a way out.',
  },
  {
    id: 'server',
    title: '5. On a server',
    today: 'A server’s views are its administrator’s, from its Helm values, for everyone.',
    fresh: 'Admins install plugins from this page; everyone else sees what runs and can’t add any.',
    risk: 'One install runs in every signed-in person’s session. A bad plugin acts with each person’s access at once.',
  },
]

export const WINDOW: Size = { width: 1440, height: 992 }

/** A frame, in one theme, with its three lines under it. */
export function pluginFrame(id: Frame, scheme: Scheme): string {
  const body = { page: pluginPage, panel: pluginPanel, view: asView, catalogue, install, server }[
    id
  ]()
  const f = FRAMES.find((x) => x.id === id)!
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${WINDOW.width}px; height: ${WINDOW.height}px; }
${PARTS}
${SHELL}
${CSS}
.win { height: ${WINDOW.height - 92}px; }
</style>${body}<div class="strip3"><b>Today</b><span>${f.today}</span><b>Would be new</b><span>${f.fresh}</span><b>Cost or risk</b><span class="risk">${f.risk}</span></div>`
}
