/**
 * The Alerts page and notifications for new warnings (LMV-180), drawn before they're built. Alerts
 * are Prometheus's own, firing and pending, read through the API server's proxy from the
 * Prometheus the Metrics page uses: a page in the Cluster group, one opened in the detail panel,
 * each of its states, the phone's cards, and the Overview's Warnings tile carrying them.
 * Notifications are per cluster, off by default, for new Warning events in namespaces of their
 * own: their section in the cluster's settings, the namespaces picked, and on a server the
 * browser's permission.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import {
  CSS as KIT,
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
.sheet > header p { margin: 6px 0 0; max-width: 1100px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.blk { display: flex; flex-direction: column; gap: 12px; }
.blk > h2 { margin: 0; font-size: 15px; font-weight: 600; }
.blk > h2 i { margin-left: 8px; font-style: normal; font-weight: 400; color: var(--text-3); }
.cap { margin: 0; font-size: 12px; color: var(--text-3); }
.rules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 28px; max-width: 1500px; margin: 4px 0 0; padding: 0; list-style: none; }
.rules li { font-size: 12.5px; line-height: 19px; color: var(--text-2); }
.rules li b { font-weight: 600; color: var(--text-1); }
.row2 { display: flex; gap: 24px; align-items: flex-start; }

.page { border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.page .phd { display: flex; align-items: center; gap: 8px; height: 48px; padding: 0 20px; border-bottom: 1px solid var(--line); font-size: 15px; font-weight: 600; }
.page .phd svg.i { color: var(--text-2); }
.split { display: grid; grid-template-columns: minmax(0, 1fr) 500px; }
.split > :last-child { border-left: 1px solid var(--line); }
.tb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--line); }
.tb .count { font-size: 13px; color: var(--text-2); }
.tb .chip { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); }
.tb .chip i { width: 7px; height: 7px; border-radius: 999px; background: var(--d); }
.tb .chip b { font-weight: 600; color: var(--text-1); }
.tb .sep { width: 1px; height: 18px; margin: 0 4px; background: var(--line-strong); }
.tb .grow { flex: 1; }
.tb .fld { display: inline-flex; align-items: center; gap: 6px; height: 28px; width: 200px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; font-size: 12.5px; color: var(--text-3); }
.src { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px 20px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-3); }
.src b { font-weight: 500; color: var(--text-2); }
.src a { color: var(--accent-strong); font-weight: 500; }
.tin { padding: 4px 12px 12px; }
.st2 { display: flex; flex-direction: column; font-size: 12.5px; line-height: 17px; }
.st2 b { font-weight: 500; color: var(--text-1); }
.st2 small { font-size: 11.5px; color: var(--text-3); }
.st2.pend b { color: var(--text-2); }
.olink { display: inline-flex; min-width: 0; align-items: center; gap: 6px; font-size: 12.5px; color: var(--accent-strong); }
.olink svg.i { flex: none; color: var(--text-3); }
.olink span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.q3 { font-size: 12px; color: var(--text-3); }
.lchips { display: flex; flex-wrap: wrap; gap: 6px; }
.lchip { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-2); }
.lchip b { font-weight: 400; color: var(--text-3); }

.det { padding: 16px 20px 20px; }
.det .dh { display: flex; align-items: flex-start; gap: 10px; }
.det .dh b { display: block; font-size: 15px; font-weight: 600; }
.det .dh small { display: block; font-size: 12px; color: var(--text-3); }
.det .x { margin-left: auto; color: var(--text-3); }
.det .under { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.det h5 { margin: 18px 0 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.det p { margin: 0; font-size: 13px; line-height: 19px; color: var(--text-2); }
.det p.lead3 { font-size: 13.5px; font-weight: 500; color: var(--text-1); }
.det dl.f { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 6px 12px; margin: 0; font-size: 12.5px; }
.det dl.f dt { color: var(--text-3); }
.det dl.f dd { margin: 0; color: var(--text-1); }
.det .ext { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 500; color: var(--accent-strong); }

.place { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 44px 24px; text-align: center; }
.place .t2 { display: grid; width: 40px; height: 40px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.place .t2.ok { background: color-mix(in srgb, var(--good) 14%, transparent); color: var(--good-text); }
.place b { font-size: 13.5px; font-weight: 600; }
.place span { max-width: 420px; font-size: 12.5px; line-height: 18px; color: var(--text-3); }
.place code { max-width: 440px; margin-top: 4px; padding: 6px 10px; border-radius: 8px; background: var(--surface-2); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 17px; color: var(--text-2); text-align: left; }
.place .btn { margin-top: 8px; }
.states { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.states .page { overflow: hidden; }

.dlg { width: 520px; border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.dlg .dhd { padding: 16px 20px 12px; border-bottom: 1px solid var(--line); }
.dlg .dhd b { display: block; font-size: 15px; font-weight: 600; }
.dlg .dhd small { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.dlg .bd { padding: 14px 20px 18px; }
.tg { display: flex; align-items: flex-start; gap: 12px; }
.tg + .tg { margin-top: 14px; }
.tg .sw { flex: none; display: inline-flex; width: 32px; height: 18px; margin-top: 1px; padding: 2px; border-radius: 999px; background: var(--line-strong); }
.tg .sw i { width: 14px; height: 14px; border-radius: 999px; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.25); }
.tg .sw.on { justify-content: flex-end; background: var(--accent); }
.tg b { display: block; font-size: 13px; font-weight: 500; color: var(--text-1); }
.tg small { display: block; font-size: 12px; line-height: 17px; color: var(--text-3); }
.wns { margin: 12px 0 0 44px; }
.wns .lbl2 { margin-bottom: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.rad { display: flex; align-items: center; gap: 8px; height: 28px; font-size: 12.5px; color: var(--text-1); }
.rad i { width: 14px; height: 14px; flex: none; border: 1.5px solid var(--line-strong); border-radius: 999px; }
.rad i.on { border: 4.5px solid var(--accent); }
.nsl { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 4px 0 0 22px; }
.nsc { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 2px 0 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); font-size: 12px; color: var(--text-1); }
.nsc span { display: grid; width: 20px; height: 20px; place-items: center; border-radius: 4px; color: var(--text-3); }
.nsadd { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px; border: 1px dashed var(--line-strong); border-radius: 6px; font-size: 12px; color: var(--text-2); }
.menu2 { width: 240px; margin: 6px 0 0 22px; padding: 4px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-pop); }
.menu2 .f2 { display: flex; align-items: center; gap: 6px; height: 28px; margin-bottom: 4px; padding: 0 8px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.menu2 .mi2 { display: flex; align-items: center; gap: 8px; height: 28px; padding: 0 8px; border-radius: 6px; font-size: 12.5px; color: var(--text-1); }
.menu2 .mi2.hov { background: var(--surface-3); }
.menu2 .mi2 .ck { width: 16px; color: var(--accent-strong); }
.hint2 { margin: 10px 0 0 44px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.perm { display: flex; align-items: flex-start; gap: 10px; margin: 12px 0 0 44px; padding: 10px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); font-size: 12.5px; line-height: 18px; color: var(--text-2); }
.perm svg.i { flex: none; margin-top: 1px; color: var(--text-3); }
.perm b { font-weight: 500; color: var(--text-1); }
.perm .btn { margin-top: 8px; }
.perm.ok svg.i { color: var(--good-text); }
.perm.no svg.i { color: var(--warn-text); }
.osn { width: 360px; padding: 12px 14px; border-radius: 14px; background: color-mix(in srgb, var(--surface-2) 92%, transparent); border: 1px solid var(--line-strong); box-shadow: var(--shadow-pop); }
.osn .a { display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: var(--text-3); }
.osn .a i { width: 16px; height: 16px; border-radius: 4px; background: linear-gradient(135deg, #5ea2f0, #2675d3); }
.osn b { display: block; margin-top: 6px; font-size: 13px; font-weight: 600; }
.osn p { margin: 2px 0 0; font-size: 12.5px; line-height: 17px; color: var(--text-2); }
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

const pageOf = (title: string, glyph: IconName, inner: string, width: number) =>
  `<div class="page" style="width:${width}px"><div class="phd">${icon(glyph, 16)}${title}</div>${inner}</div>`

// ─── Alerts ────────────────────────────────────────────────────────────────────────────────

type Sev = 'critical' | 'warning' | 'info' | 'none'
const SEV: Record<Sev, Level> = {
  critical: 'critical',
  warning: 'warning',
  info: 'neutral',
  none: 'neutral',
}

interface Alert {
  name: string
  sev: Sev
  pending?: string
  /** How long since it began firing: active, less its rule's for. */
  firing?: string
  since: string
  summary: string
  description: string
  object?: [IconName, string, string]
  labels: [string, string][]
  runbook?: string
  rule: string
  value: string
}

/** kube-prometheus's own rules, as a cluster with it installed fires them. Worst first. */
const ALERTS: Alert[] = [
  {
    name: 'KubePersistentVolumeFillingUp',
    value: '0.021',
    sev: 'critical',
    since: '12m',
    firing: '11m',
    summary: 'PersistentVolume is filling up.',
    description:
      'The PersistentVolume claimed by data-postgres-0 in Namespace data is only 2.1% free.',
    object: ['database', 'PersistentVolumeClaim', 'data/data-postgres-0'],
    labels: [
      ['namespace', 'data'],
      ['persistentvolumeclaim', 'data-postgres-0'],
      ['job', 'kubelet'],
    ],
    runbook: 'runbooks.prometheus-operator.dev/runbooks/kubernetes/kubepersistentvolumefillingup',
    rule: 'for 1m · kubernetes-storage',
  },
  {
    name: 'KubePodCrashLooping',
    value: '1',
    sev: 'warning',
    since: '26m',
    firing: '11m',
    summary: 'Pod is crash looping.',
    description:
      'Pod shop/checkout-7d9f6c5b8-hqnnn (app) is in waiting state (reason: "CrashLoopBackOff").',
    object: ['box', 'Pod', 'shop/checkout-7d9f6c5b8-hqnnn'],
    labels: [
      ['namespace', 'shop'],
      ['pod', 'checkout-7d9f6c5b8-hqnnn'],
      ['container', 'app'],
      ['job', 'kube-state-metrics'],
    ],
    runbook: 'runbooks.prometheus-operator.dev/runbooks/kubernetes/kubepodcrashlooping',
    rule: 'for 15m · kubernetes-apps',
  },
  {
    name: 'KubePodCrashLooping',
    value: '1',
    sev: 'warning',
    since: '25m',
    firing: '10m',
    summary: 'Pod is crash looping.',
    description:
      'Pod shop/checkout-7d9f6c5b8-pwkd2 (app) is in waiting state (reason: "CrashLoopBackOff").',
    object: ['box', 'Pod', 'shop/checkout-7d9f6c5b8-pwkd2'],
    labels: [
      ['namespace', 'shop'],
      ['pod', 'checkout-7d9f6c5b8-pwkd2'],
      ['container', 'app'],
    ],
    rule: 'for 15m · kubernetes-apps',
  },
  {
    name: 'KubeDeploymentReplicasMismatch',
    value: '1',
    sev: 'warning',
    since: '16m',
    firing: '1m',
    summary: 'Deployment has not matched the expected number of replicas.',
    description:
      'Deployment shop/checkout has not matched the expected number of replicas for longer than 15 minutes.',
    object: ['layers', 'Deployment', 'shop/checkout'],
    labels: [
      ['namespace', 'shop'],
      ['deployment', 'checkout'],
    ],
    rule: 'for 15m · kubernetes-apps',
  },
  {
    name: 'KubeJobFailed',
    value: '1',
    sev: 'warning',
    pending: '11m',
    since: '4m',
    summary: 'Job failed to complete.',
    description:
      'Job batch/db-migrate failed to complete. Removing failed job after investigation should clear this alert.',
    object: ['play', 'Job', 'batch/db-migrate'],
    labels: [
      ['namespace', 'batch'],
      ['job_name', 'db-migrate'],
    ],
    rule: 'for 15m · kubernetes-apps',
  },
  {
    name: 'CPUThrottlingHigh',
    value: '0.285',
    sev: 'info',
    pending: '6m',
    since: '9m',
    summary: 'Processes experience elevated CPU throttling.',
    description:
      '28.5% throttling of CPU in namespace monitoring for container prometheus in pod prometheus-k8s-0.',
    object: ['box', 'Pod', 'monitoring/prometheus-k8s-0'],
    labels: [
      ['namespace', 'monitoring'],
      ['pod', 'prometheus-k8s-0'],
      ['container', 'prometheus'],
    ],
    rule: 'for 15m · kubernetes-resources',
  },
  {
    name: 'Watchdog',
    value: '1',
    sev: 'none',
    since: '12d',
    firing: '12d',
    summary:
      'An alert that should always be firing to certify that Alertmanager is working properly.',
    description:
      'This is an alert meant to ensure that the entire alerting pipeline is functional.',
    labels: [],
    rule: 'general.rules',
  },
]

const sevPill = (s: Sev) =>
  s === 'none' ? '<span class="q3">None</span>' : pill(SEV[s], s[0]!.toUpperCase() + s.slice(1))

const stateCell = (a: Alert) =>
  a.pending
    ? `<span class="st2 pend"><b>Pending</b><small>fires in ${a.pending}</small></span>`
    : `<span class="st2"><b>Firing</b><small>for ${a.firing}</small></span>`

const objLink = (a: Alert) =>
  a.object
    ? `<span class="olink">${icon(a.object[0], 13)}<span>${a.object[1]} ${escape(a.object[2])}</span></span>`
    : '<span class="q3">—</span>'

const ROWS = (list: Alert[], open = -1) =>
  list.map((a, i) => ({
    cells: [
      lead({ level: a.sev === 'none' ? undefined : SEV[a.sev], name: a.name, under: a.summary }),
      `<span>${sevPill(a.sev)}</span>`,
      stateCell(a),
      objLink(a),
      `<span class="r">${a.since}</span>`,
    ],
    cls: `opens${i === open ? ' hover' : ''}`,
  }))

const toolbar = () =>
  `<div class="tb"><span class="count">7 alerts</span><span class="chip" style="--d:var(--critical)"><i></i>Critical <b>1</b></span><span class="chip" style="--d:var(--warn)"><i></i>Warning <b>4</b></span><span class="chip" style="--d:var(--text-3)"><i></i>Info <b>1</b></span><span class="chip" style="--d:var(--line-strong)"><i></i>None <b>1</b></span><span class="sep"></span><span class="chip">Firing <b>5</b></span><span class="chip">Pending <b>2</b></span><span class="grow"></span><span class="fld">${icon('search', 13)}Filter alerts</span></div>`

const source = `<div class="src">${icon('chart-spline', 13)}From <b>prometheus-k8s</b> in monitoring, as the Metrics page reads it · 31 alerting rules · <a>Metrics source…</a></div>`

const alertsTable = (open = -1) =>
  table(
    'minmax(0,2.2fr) 104px 112px minmax(0,1.5fr) 56px',
    [
      head('Alert'),
      head('Severity', { sorted: 'down' }),
      head('State'),
      head('Object'),
      head('Active', { r: true }),
    ],
    ROWS(ALERTS, open),
  )

function detail(a: Alert, bare = false): string {
  return `<div class="det"${bare ? ' style="padding-top:4px"' : ''}>${
    bare
      ? ''
      : `<div class="dh">${icon('bell-ring', 18)}<div><b>${a.name}</b><small>Alert · active ${a.since}, firing ${a.firing} · since 14:06</small></div><span class="x">${icon('x', 16)}</span></div>
    <div class="under">${sevPill(a.sev)}<span class="spill" style="--m:var(--neutral)">Firing</span></div>`
  }
    <h5>Summary</h5><p class="lead3">${escape(a.summary)}</p>
    <h5>Description</h5><p>${escape(a.description)}</p>
    <h5>Object</h5>${objLink(a)}
    <h5>Labels</h5><div class="lchips">${[['alertname', a.name], ['severity', a.sev], ...a.labels].map(([k, v]) => `<span class="lchip"><b>${k}=</b>${escape(v!)}</span>`).join('')}</div>
    <h5>Rule</h5><dl class="f"><dt>Waits</dt><dd>${a.rule.split(' · ')[0]!.replace('for ', '')} pending before it fires</dd><dt>Group</dt><dd>${a.rule.split(' · ')[1] ?? a.rule}</dd><dt>Value</dt><dd>${a.value}</dd></dl>
    ${a.runbook ? `<h5>Runbook</h5><span class="ext">${icon('book-open', 14)}${a.runbook.split('/').at(-1)}${icon('external-link', 12)}</span>` : ''}</div>`
}

function alertsPage(): string {
  const list = pageOf(
    'Alerts',
    'bell',
    `${toolbar()}${source}<div class="tin">${alertsTable()}</div>`,
    1376,
  )
  const opened = pageOf(
    'Alerts',
    'bell',
    `${toolbar()}${source}<div class="split"><div class="tin">${table(
      'minmax(0,2fr) 104px 112px 56px',
      [
        head('Alert'),
        head('Severity', { sorted: 'down' }),
        head('State'),
        head('Active', { r: true }),
      ],
      ALERTS.map((a, i) => ({
        cells: [
          lead({
            level: a.sev === 'none' ? undefined : SEV[a.sev],
            name: a.name,
            under: a.summary,
          }),
          `<span>${sevPill(a.sev)}</span>`,
          stateCell(a),
          `<span class="r">${a.since}</span>`,
        ],
        cls: i === 1 ? 'opens hover' : 'opens',
      })),
    )}</div>${detail(ALERTS[1]!)}</div>`,
    1376,
  )
  return block(
    'The Alerts page',
    'Prometheus’s own alerts, firing and pending; in the Cluster group, beside Events and Metrics',
    `<p class="cap">All namespaces: kube-prometheus’s rules on a cluster with an incident in shop</p>${list}<p class="cap">One opened: the app’s detail panel beside the list, as any object opens</p>${opened}`,
    [
      [
        'A row is an alert',
        '(one a firing instance, as Prometheus lists them: two pods crash-looping are two rows). Its lead is its name with its severity’s dot, its summary under, as the rule’s author wrote it, end-cut, whole in its tooltip.',
      ],
      [
        'Severity',
        'is its `severity` label, said with its level: Critical red, Warning amber, Info quiet; never colour alone (word and icon). Anything else, “none” as the stack’s Watchdog has, is quiet text. Sorted worst first, Firing before Pending within a severity, then oldest first.',
      ],
      [
        'State',
        'Firing; or Pending, quieter, with when it fires if it holds (“fires in 11m”, from its rule’s for), so it’s plain how close it is. Since is when it began, firing or pending. Pending isn’t a level of its own: its severity is.',
      ],
      [
        'The object',
        'is told from its labels by the usual names (namespace with pod, deployment, statefulset, daemonset, job_name, persistentvolumeclaim, service; or node): its kind’s icon and Kind namespace/name, a link that opens it. None found, or not there any more: a dash, and no link.',
      ],
      [
        'The source line',
        'under the toolbar says which Prometheus, as the Metrics page reads it, how many alerting rules it has, and “Metrics source…” to choose another, as Metrics has. On a server where an admin chose it, the line says so and “Metrics source…” isn’t offered.',
      ],
      [
        'Filters',
        'the header’s namespaces (an alert with no namespace label shows only under All namespaces), the severity chips and Firing / Pending chips (each counts what it would show), and the text filter, matching the name, the summary and the labels’ values. Polled every 30 s while shown; a new alert takes its place in the order, never above the row under the pointer.',
      ],
      [
        'Opened',
        'in the detail panel: its name, Firing for and since when, the severity and state, the summary, the description, the object (a link), every label as a chip (alertname and severity too, as Prometheus has them), the rule’s for and group, its value, and the runbook as an outside link where the rule gives runbook_url. Esc closes it.',
      ],
      [
        'Keys',
        'g then z opens it from anywhere (z, the last free letter that reads as alerts); it’s in the palette’s Go to as “Alerts”. Rows are the Table’s, one tab stop, ↑ ↓ and Enter.',
      ],
      [
        'Words',
        'are docs’: the page’s name, the source line, each state, Firing and Pending, “fires in 11m”.',
      ],
    ],
  )
}

function alertStates(): string {
  const st = (glyph: IconName, title: string, line: string, extra = '', ok = false) =>
    pageOf(
      'Alerts',
      'bell',
      `<div class="place"><span class="t2${ok ? ' ok' : ''}">${icon(glyph, 18)}</span><b>${title}</b><span>${line}</span>${extra}</div>`,
      440,
    )
  const tileRow = `<div class="arr-tiles" style="--n:4;width:1120px">${tile('server', 'Nodes', '4', 'All ready', { level: 'healthy', opens: true })}${tile('box', 'Pods', '14', '3 failing', { level: 'critical', opens: true })}${tile('layers', 'Workloads', '6', '1 degraded', { level: 'warning', opens: true })}${tile('triangle-alert', 'Warnings', '4', 'last hour · <span style="color:var(--accent-strong);font-weight:500">3 alerts firing</span>', { level: 'warning', opens: true })}</div>`
  return block(
    'Its states, and the Overview',
    'each in docs’ words; drafts here',
    `<div class="states">${st('chart-spline', 'No Prometheus found in this cluster.', 'Alerts come from the Prometheus the Metrics page uses. Choose one, or install Lumovi’s own metrics stack from Metrics.', '<span class="btn secondary sm">Metrics source…</span>')}${st('bell', 'prometheus-k8s has no alerting rules.', 'Lumovi’s own metrics stack installs none. Alerts show here once your monitoring stack’s rules are loaded.')}${st('circle-check', 'Nothing is firing.', '31 alerting rules quiet. Checked 12 seconds ago.', '<span>Watchdog, of severity none, always fires to show the pipeline works: it’s under the None chip.</span><span class="btn secondary sm">Show None</span>', true)}${st('shield-alert', 'Lumovi can’t read Prometheus’s alerts.', 'The cluster said:', '<code>services "prometheus-k8s:web" is forbidden: User "jane@example.com" cannot get resource "services/proxy" in API group "" in the namespace "monitoring"</code>')}${st('server-off', 'Prometheus answered something Lumovi doesn’t read.', 'From monitoring/prometheus-k8s, at /api/v1/alerts:', '<code>HTTP 502 Bad Gateway</code><span class="btn secondary sm">Try again</span>')}</div>
    <p class="cap" style="margin-top:12px">The Overview in namespace shop, where an alerts source is found: the Warnings tile (the timeline’s 4) carries shop’s 3 firing alerts</p>${tileRow}`,
    [
      [
        'Nothing is firing',
        'means nothing above severity none: an alert of severity none, as kube-prometheus’s Watchdog always fires, never makes the page or the Overview say something is firing; the place names it and offers its chip. It’s good news, so it has the good level’s icon and a line that says how many rules are quiet and when it last looked. No Prometheus, no rules, can’t read and an odd answer are neutral places, never red: nothing in the cluster is wrong.',
      ],
      [
        'Can’t read',
        'quotes the cluster’s words, as every refusal in Lumovi does; on a server it’s the signed-in person’s own access. Whoever may proxy to Prometheus sees every alert it holds, whatever namespaces they may read otherwise: docs say so on the page’s docs, not here.',
      ],
      [
        'The Overview',
        'keeps its four tiles. Where an alerts source is found, the Warnings tile’s line adds “3 alerts firing” (the header’s namespaces, as the page; severity none not counted), a link to Alerts, and its level is the worse of the two; with none firing it adds nothing. Where none is found, the tile is as today.',
      ],
    ],
  )
}

function alertsPhone(): string {
  const card = (a: Alert) =>
    `<li><div class="top">${lead({ level: a.sev === 'none' ? undefined : SEV[a.sev], name: a.name })}</div><p class="pnote">${escape(a.summary)}</p><dl>${fact('Severity', a.sev === 'none' ? 'None' : a.sev[0]!.toUpperCase() + a.sev.slice(1))}${fact('State', a.pending ? `Pending, fires in ${a.pending}` : `Firing, ${a.firing}`)}</dl>${a.object ? `<div style="margin-top:6px">${objLink(a)}</div>` : ''}</li>`
  const list = phoneFrame(
    'Alerts',
    `<div class="sec"><h3>Alerts<small>7</small></h3><ul class="cards">${ALERTS.slice(0, 4).map(card).join('')}</ul></div>`,
  )
  const crash = ALERTS[1]!
  const one = phoneFrame(
    'KubePodCrashLooping',
    `<div class="under">${pill('warning', 'Warning')}<span class="spill" style="--m:var(--neutral)">Firing, ${crash.firing}</span></div>${detail(crash, true)}`,
    true,
  )
  return block(
    'On a phone',
    'cards, read-only, like the other lists',
    `<div class="row2">${list}${one}</div>`,
    [
      [
        'A card',
        'is the row: the name with its severity’s dot, the summary under (three lines at most), Severity and State as facts, and the object as a link on its own line. Severity and State fit a third, so they stand side by side.',
      ],
      [
        'Opened',
        'it’s a page of its own with Back, the name in the top bar (middle-cut), the severity and state under it, then the panel’s sections; the runbook opens in the browser. Nothing on it changes anything, so a phone has all of it.',
      ],
      [
        'Filters',
        'as the phone’s lists: the chips in a row that scrolls sideways, the text filter 44 px high.',
      ],
    ],
  )
}

// ─── Notifications ─────────────────────────────────────────────────────────────────────────

const sw = (on: boolean) => `<span class="sw${on ? ' on' : ''}"><i></i></span>`

function nsPicker(open = false): string {
  const chips = ['shop', 'payments']
    .map((n) => `<span class="nsc">${n}<span>${icon('x', 12)}</span></span>`)
    .join('')
  const menu = open
    ? `<div class="menu2"><div class="f2">${icon('search', 12)}Filter namespaces</div>${[
        ['batch', false],
        ['data', false],
        ['monitoring', false],
        ['payments', true],
        ['search', false],
        ['shop', true],
      ]
        .map(
          ([n, on], i) =>
            `<div class="mi2${i === 1 ? ' hov' : ''}"><span class="ck">${on ? icon('check', 14) : ''}</span>${n}</div>`,
        )
        .join('')}</div>`
    : ''
  return `<div class="wns"><div class="lbl2">Watch</div><div class="rad"><i></i>All namespaces</div><div class="rad"><i class="on"></i>These namespaces</div><div class="nsl">${chips}<span class="nsadd">${icon('plus', 12)}Add</span></div>${menu}</div>`
}

function notifications(): string {
  const toggle = (title: string, line: string, on: boolean, locked = '') =>
    `<div class="tg">${sw(on)}<div><b>${title}</b><small>${locked ? `${icon('lock', 11)} ${locked} ` : ''}${line}</small></div></div>`
  const desk = `<div class="dlg"><div class="dhd"><b>production</b><small>arn:aws:eks:eu-west-1:…:cluster/production</small></div><div class="bd">${toggle('Production', 'Deleting and draining ask you to type its name, and its rows say Production.', true)}${toggle('Read-only', 'Lumovi changes nothing in it.', false)}${toggle('Hidden', 'Left out of the list. Show hidden clusters from its footer.', false)}<div style="margin:14px 0;border-top:1px solid var(--line)"></div>${toggle('Notify me of new warnings', 'A notification for each new Warning event in the namespaces it watches, while Lumovi runs.', true)}${nsPicker(true)}<p class="hint2">New since Lumovi last looked, once an object and reason in 10 minutes; several at once come as one (“5 new warnings in shop”).</p></div></div>`
  const off = `<div class="dlg"><div class="bd">${toggle('Notify me of new warnings', 'A notification for each new Warning event in the namespaces it watches, while Lumovi runs.', false)}</div></div>`
  const os = `<div class="osn"><div class="a"><i></i>Lumovi · now</div><b>BackOff on Pod/checkout-7d9f6c5b8-hqnnn</b><p>Back-off restarting failed container app in pod checkout-7d9f6c5b8-hqnnn_shop(4f1c9aa8-…)</p><p style="color:var(--text-3)">production</p></div><div class="osn" style="margin-top:10px"><div class="a"><i></i>Lumovi · now</div><b>5 new warnings in shop</b><p>BackOff ×3, FailedScheduling, Unhealthy</p><p style="color:var(--text-3)">production</p></div>`
  const perm = (kind: 'ask' | 'ok' | 'no') =>
    kind === 'ask'
      ? `<div class="perm">${icon('bell', 15)}<div><b>Your browser will ask first.</b> Lumovi shows these only while one of its tabs is open in this browser, hidden or not.<div><span class="btn primary sm">Allow notifications</span></div></div></div>`
      : kind === 'ok'
        ? `<div class="perm ok">${icon('circle-check', 15)}<div><b>On in this browser.</b> Only while a Lumovi tab is open. <span style="color:var(--accent-strong);font-weight:500">Send a test</span></div></div>`
        : `<div class="perm no">${icon('triangle-alert', 15)}<div><b>This browser blocks Lumovi’s notifications.</b> Allow them in its settings for this site, then come back. The switch stays on, so they start once allowed.</div></div>`
  const server = (k: 'ask' | 'ok' | 'no') =>
    `<div class="dlg" style="width:500px"><div class="bd">${toggle('Notify me of new warnings', 'A notification for each new Warning event in the namespaces it watches, while a Lumovi tab is open.', true)}${perm(k)}</div></div>`
  return block(
    'Notifications for new warnings',
    'per cluster, off by default; desktop: the cluster’s settings; on a server: each person’s own',
    `<div class="row2"><div class="blk"><p class="cap">On the desktop: the cluster’s settings, with its namespaces being picked</p>${desk}</div><div class="blk"><p class="cap">Off, as it starts</p>${off}<p class="cap" style="margin-top:12px">What the system shows (the system draws it; the words are Lumovi’s)</p>${os}</div></div>
    <p class="cap" style="margin-top:16px">On a server: the browser’s permission, asked, allowed and blocked</p><div class="row2">${server('ask')}${server('ok')}${server('no')}</div>`,
    [
      [
        'Where',
        'in the cluster’s settings, after Production, Read-only and Hidden and a rule, with the same switch row: “Notify me of new warnings” and its line. Off by default. On a server it’s each person’s own, in the same place, never another’s.',
      ],
      [
        'Watched namespaces',
        'are its own set, not the header’s pick: a choice of All namespaces or These namespaces, as the dialog’s other choices are radios. These are chips with × and an “Add” that opens a filterable list with checks, so several can be picked without closing it. Turned on, it starts at the namespace the cluster opens in, or All if it opens in all.',
      ],
      [
        'When it tells',
        'a Warning event new since the last look (a new event, or its count gone up) in a watched namespace; one an object and reason in 10 minutes; several within the same look come as one, “5 new warnings in shop”, with their reasons. A click opens Lumovi at the object, or at Events filtered to that namespace for a group.',
      ],
      [
        'The notification',
        'is the system’s, its title the reason and the object (“BackOff on Pod/…”), the message under, the cluster’s name last, so a person with two clusters knows which. Docs words it; nothing of it is styled by Lumovi.',
      ],
      [
        'On a server',
        'the browser’s permission comes first: turning it on shows one line and “Allow notifications”, which asks the browser. Allowed: “On in this browser.” with Send a test. Blocked: the browser’s settings are the only way back, said plainly, and the switch stays on so it starts once allowed. It’s per browser as well as per person.',
      ],
      [
        'Honest about when',
        'the desktop reads while Lumovi runs, whatever page is shown; a server’s, while a tab is open, hidden or not. With Lumovi closed nothing is read, and the line says “while Lumovi runs” so no one expects more.',
      ],
    ],
  )
}

export type AlertsFrame = 'al-page' | 'al-states' | 'al-phone' | 'nt-settings'

export const ALERTS_FRAMES: { id: AlertsFrame; title: string; size: Size }[] = [
  { id: 'al-page', title: 'Alerts: the page, one opened', size: { width: 1440, height: 1400 } },
  {
    id: 'al-states',
    title: 'Alerts: its states, and the Overview',
    size: { width: 1440, height: 1100 },
  },
  { id: 'al-phone', title: 'Alerts on a phone', size: { width: 1100, height: 1000 } },
  {
    id: 'nt-settings',
    title: 'Notifications for new warnings',
    size: { width: 1600, height: 1300 },
  },
]

/** One of the frames, in one theme. */
export function alertsFrame(id: AlertsFrame, scheme: Scheme): string {
  const f = ALERTS_FRAMES.find((x) => x.id === id)!
  const intro =
    '<header><h1>Alerts, and notifications for new warnings (LMV-180)</h1><p>Prometheus’s own alerts, firing and pending, read through the API server’s proxy from the Prometheus the Metrics page uses (Alertmanager’s silences are a later step). And notifications for new Warning events, per cluster, off by default, for namespaces of their own. Words are drafts for docs.</p></header>'
  const body = {
    'al-page': () => `${intro}${alertsPage()}`,
    'al-states': alertStates,
    'al-phone': alertsPhone,
    'nt-settings': notifications,
  }[id]()
  return sheet(scheme, f.size.width, body)
}
