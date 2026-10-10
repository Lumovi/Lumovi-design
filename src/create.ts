/**
 * Create, with a form beside its YAML: mockups for the design (LMV-213), to be approved before
 * the app builds it (LMV-170). Today Create is a 600 px dialog with a YAML editor and seven
 * templates. This adds a form for the nine common kinds, with the YAML it writes beside it:
 * either side can be edited, and they stay in step. Drawn with the app's own parts
 * (src/clusters.ts) and its dialog's sizes; nothing here is in the app yet.
 *
 * Approved by Péter on LMV-170 (2026-10-10), with these decided:
 * - no review step: Create checks with the cluster and creates, as today;
 * - the dialog is 960 px wide and 86% of the window's height;
 * - the namespace is a field of the form, starting at the header's (`default` under All
 *   namespaces, and it says so);
 * - the dialog is called "Create", and the + button's tooltip, the palette's entry and the
 *   menu's item follow as "Create…";
 * - the side used last opens first; the first time, the form.
 * The two options that weren't chosen stay here, marked, so the choice can be seen: don't
 * build them.
 */
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

const SOURCES = join(import.meta.dirname, '..', 'sources')
/** The page behind the dialog: the app's own overview, as its screenshots have it. */
const behind = (scheme: Scheme) =>
  pathToFileURL(join(SOURCES, 'screenshots', `overview-${scheme}.webp`)).href

const CONTEXT = 'production'
const NAMESPACE = 'shop'

/** The kinds the form knows, in the order of the sidebar's groups. */
export const KINDS = [
  'Deployment',
  'StatefulSet',
  'DaemonSet',
  'Job',
  'CronJob',
  'Service',
  'ConfigMap',
  'Secret',
  'PersistentVolumeClaim',
] as const
export type Kind = (typeof KINDS)[number]

// ─── Styles ────────────────────────────────────────────────────────────────────────────────

const CSS = `
.page { position: absolute; inset: 0; background-size: 1440px 900px; background-position: left top; background-repeat: no-repeat; }
/* The overview's line with the cluster's address, which no picture shows. */
.cover { position: absolute; left: 268px; top: 76px; width: 290px; height: 32px; background: var(--surface); }
.dialog.create { top: 7%; width: 960px; max-width: calc(100% - 48px); max-height: 86%; height: 86%; }
.dialog.create.narrow { top: 12%; width: 600px; max-height: 76%; height: auto; }
.dialog.create.full { top: 24px; width: calc(100% - 48px); max-width: none; max-height: none; height: calc(100% - 48px); }
.dialog.create > .head { padding-bottom: 12px; }
.dialog.create > .head > div:nth-child(2) { flex: 1; min-width: 0; }
.dialog.create > .head .sub { display: flex; min-width: 0; align-items: center; gap: 6px; }
.dialog.create > .head .sub > span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dialog.create > .head .seg { flex: none; }
.dialog.create > .head .sub b { font-weight: 500; color: var(--text-2); }
.dialog.create > .head .seg { margin: 2px 0 0 auto; align-self: flex-start; }
.kinds { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 20px 16px; }
.modes { display: flex; flex: none; padding: 4px 20px 8px; }
.narrow .modes { padding: 0; margin-bottom: -4px; }
.kchip { display: inline-flex; height: 24px; align-items: center; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--text-2); white-space: nowrap; }
.kchip.on { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-strong); }
.panes { display: grid; flex: 1; min-height: 0; grid-template-columns: 440px minmax(0, 1fr); border-top: 1px solid var(--line); }
.full .panes { grid-template-columns: 480px minmax(0, 1fr); }

/* The form: a label, the YAML path it writes, and its field. */
.fpane { position: relative; min-height: 0; overflow: hidden; padding: 16px 20px 20px; }
.fin { display: flex; flex-direction: column; gap: 14px; }
.fpane.locked .add { color: var(--text-3); }
.fpane::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 28px; background: linear-gradient(to bottom, transparent, var(--surface-2)); }
.fpane.locked .fin > :not(.note) { opacity: 0.45; }
.frow { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
.frow > * { min-width: 0; }
.fgroup { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-top: 4px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.fgroup .path { letter-spacing: 0; text-transform: none; font-weight: 400; }
.fl { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.fl.stack { display: block; }
.fl.stack .path { display: block; text-align: left; direction: ltr; }
.fl label { flex: none; font-size: 12px; line-height: 16px; font-weight: 500; color: var(--text-2); }
.fl label small { margin-left: 4px; font-size: 11px; font-weight: 400; color: var(--text-3); }
.path { min-width: 0; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; direction: rtl; text-align: right; }
.path.on { color: var(--accent-strong); }
.field.bad { border-color: var(--critical); box-shadow: 0 0 0 3px color-mix(in srgb, var(--critical) 15%, transparent); }
.field.set { border-color: color-mix(in srgb, var(--accent) 60%, transparent); }
.field .unit { margin-left: auto; font-size: 12px; color: var(--text-3); }
.field.area { height: auto; min-height: 52px; align-items: flex-start; padding: 6px 10px; line-height: 18px; white-space: pre; }
.ferr { margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--critical-text); }
.fhelp { margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.fhelp code, .note code, .ferr code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-2); }
.stepper2 { display: flex; align-items: center; gap: 8px; }
.stepper2 .sb { display: grid; flex: none; width: 32px; height: 32px; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); color: var(--text-2); box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); }
.stepper2 .field { width: 64px; justify-content: center; font-weight: 600; font-variant-numeric: tabular-nums; }
.pairs { display: flex; flex-direction: column; gap: 8px; }
.pair { display: flex; align-items: center; gap: 6px; }
.pair .field { min-width: 0; flex: 1; overflow: hidden; }
.pair .field.v { flex: 1.4; }
.pair .field.n { flex: none; width: 96px; }
.pair .eq { color: var(--text-3); }
.pair .rm { display: grid; flex: none; width: 32px; height: 32px; place-items: center; border-radius: 8px; color: var(--text-3); }
.add { display: inline-flex; height: 32px; align-items: center; gap: 6px; align-self: flex-start; margin-left: -8px; padding: 0 8px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--accent-strong); }
.note { display: flex; gap: 8px; padding: 10px 12px; border-radius: 8px; background: var(--surface-3); font-size: 13px; line-height: 21px; color: var(--text-2); }
.note > svg.i { margin-top: 3px; color: var(--text-3); }
.note b { display: block; font-weight: 600; color: var(--text-1); }
.note .btn { margin-top: 8px; }
.derived { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; line-height: 17px; color: var(--text-3); }
.derived svg.i { margin-top: 2px; }
.derived code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-2); }
.reads { margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }

/* The YAML: the app's editor, with what the cluster says and the command under it. */
.ypane { display: flex; min-width: 0; min-height: 0; flex-direction: column; border-left: 1px solid var(--line); }
.narrow .ypane { border-left: 0; }
.ybar { display: flex; flex: none; height: 36px; align-items: center; gap: 8px; padding: 0 8px 0 20px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-3); }
.ybar b { font-weight: 500; color: var(--text-2); }
.ybar .end { display: flex; align-items: center; gap: 2px; margin-left: auto; }
.ybar .btn.sm { height: 28px; padding: 0 8px; }
.code::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 28px; background: linear-gradient(to bottom, transparent, var(--surface-2)); }
.code { position: relative; flex: 1; min-height: 0; overflow: hidden; padding: 12px 0; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20.4px; color: var(--text-1); white-space: pre; }
.code .ln { display: flex; }
.code .ln > i { flex: none; width: 44px; padding-right: 14px; font-style: normal; text-align: right; color: color-mix(in srgb, var(--text-3) 60%, transparent); }
.code .ln.hl { background: color-mix(in srgb, var(--accent) var(--tint-hl), transparent); }
.code .ln.hl > i { color: var(--text-2); }
.code .ln.bad { background: color-mix(in srgb, var(--critical) var(--tint-bad), transparent); }
.code .ln.extra { background: color-mix(in srgb, var(--text-3) var(--tint-extra), transparent); }
.code .k { color: var(--accent-strong); }
.code .s { color: var(--good-text); }
.code .n { color: var(--ansi-5); }
.code .p { color: var(--text-3); }
.code .m { color: var(--text-3); letter-spacing: 1px; }
.under { display: flex; flex: none; flex-direction: column; gap: 12px; padding: 12px 20px 16px; border-top: 1px solid var(--line); }
.narrow .under { padding: 16px 0 0; border-top: 0; }
.under .command { margin: 0; }
.results { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; }
.results > div { display: flex; gap: 10px; padding: 8px 12px; font-size: 12px; line-height: 17px; }
.results > div + div { border-top: 1px solid var(--line); }
.results svg.i { margin-top: 1px; }
.results .who { display: block; font-family: 'JetBrains Mono', monospace; color: var(--text-1); }
.results .why { display: block; color: var(--critical-text); overflow-wrap: anywhere; }
.status { display: flex; align-items: center; gap: 6px; font-size: 12px; line-height: 16px; color: var(--text-2); }
.status svg.i { color: var(--good-text); }
.hint { margin: 0; font-size: 12px; color: var(--text-3); }
.hint code { font-family: 'JetBrains Mono', monospace; }
.narrow .body2 { display: flex; flex: 1; min-height: 0; flex-direction: column; gap: 16px; padding: 4px 20px 20px; }
.narrow .body2 > * { flex: none; }
.narrow .body2 > .ypane { flex: 0 1 300px; min-height: 120px; }
.narrow .kinds { padding: 0; }
.narrow .code { flex: 1; min-height: 0; border: 1px solid var(--line); border-radius: 12px; }
.optional { position: absolute; z-index: 40; top: 14px; left: 50%; transform: translateX(-50%); padding: 3px 10px; border-radius: 999px; background: var(--critical); font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; }
.review { display: flex; flex: 1; min-height: 0; flex-direction: column; gap: 12px; padding: 4px 20px 20px; }
.review .rv { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.review .rv b { font-weight: 600; }
.review .box { display: flex; flex: 1; min-height: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; }
`

// ─── Parts ─────────────────────────────────────────────────────────────────────────────────

interface FieldOptions {
  mono?: boolean
  focus?: boolean
  bad?: boolean
  placeholder?: boolean
  end?: IconName
  unit?: string
  cls?: string
}

/** A field, as the app's dialogs draw them: 32 px, with what it holds. */
function field(value: string, o: FieldOptions = {}): string {
  const cls = `field${o.mono ? ' mono' : ''}${o.focus ? ' focus' : ''}${o.bad ? ' bad' : ''}${o.cls ? ` ${o.cls}` : ''}`
  const text = o.placeholder ? `<span class="ph">${escape(value)}</span>` : escape(value)
  const caret =
    o.focus && !o.end ? '<span class="caret" style="height:15px;margin:0 0 0 1px"></span>' : ''
  return `<span class="${cls}">${text}${caret}${o.unit ? `<span class="unit">${o.unit}</span>` : ''}${o.end ? `<span class="end">${icon(o.end, 14)}</span>` : ''}</span>`
}

/** A label with the YAML path its field writes, then the field and what's under it. */
function labelled(
  label: string,
  path: string,
  control: string,
  o: { on?: boolean; note?: string; stack?: boolean } = {},
) {
  return `<div><div class="fl${o.stack ? ' stack' : ''}"><label>${label}</label><span class="path${o.on ? ' on' : ''}">&lrm;${escape(path)}</span></div>${control}${o.note ?? ''}</div>`
}

const two = (a: string, b: string) => `<div class="frow">${a}${b}</div>`
const optional = (label: string) => `${label}<small>optional</small>`

const stepper = (value: number) =>
  `<span class="stepper2"><span class="sb">${icon('minus', 16)}</span><span class="field">${value}</span><span class="sb">${icon('plus', 16)}</span></span>`

const select = (value: string, o: FieldOptions = {}) =>
  field(value, { ...o, end: 'chevrons-up-down' })

function pairs(
  rows: [string, string][],
  add: string,
  o: { masked?: boolean; shown?: boolean } = {},
) {
  return `<div class="pairs">${rows
    .map(
      ([k, v]) =>
        `<div class="pair">${field(k, { mono: true })}<span class="eq">=</span>${field(o.masked && !o.shown ? '••••••••' : v, { mono: true, cls: 'v' })}<span class="rm">${icon('x', 16)}</span></div>`,
    )
    .join('')}<span class="add">${icon('plus', 16)}${add}</span></div>`
}

const seg = (items: string[], on: string) =>
  `<span class="seg">${items.map((i) => `<span${i === on ? ' class="on"' : ''}>${i}</span>`).join('')}</span>`

const P = 'spec.template.spec.containers[0]'

/** A group of fields that share the start of their path: each then names the rest. */
const group = (label: string, path = P) =>
  `<div class="fgroup"><span>${label}</span><span class="path">&lrm;${escape(path)}</span></div>`

/** The name and the namespace, which every kind has. */
function who(
  name: string,
  o: { nameField?: FieldOptions; namespace?: string; note?: string } = {},
) {
  return two(
    labelled('Name', 'metadata.name', field(name || 'web', { placeholder: !name, ...o.nameField })),
    labelled('Namespace', 'metadata.namespace', select(o.namespace ?? NAMESPACE)),
  )
}

// ─── YAML ──────────────────────────────────────────────────────────────────────────────────

type Mark = 'hl' | 'bad' | 'extra'

/** YAML as the app's editor colors it, with line numbers and some lines marked. */
function code(text: string, marks: Record<number, Mark> = {}, from = 1): string {
  const value = (v: string) =>
    /^•+$/.test(v)
      ? `<span class="m">${v}</span>`
      : /^(-?\d+(\.\d+)?|true|false|null)$/.test(v)
        ? `<span class="n">${v}</span>`
        : `<span class="s">${escape(v)}</span>`
  const lines = text.split('\n').map((line, i) => {
    const m = /^(\s*)(- )?([A-Za-z0-9_.\/-]+)(:)( ?)(.*)$/.exec(line)
    const dash = /^(\s*)(- )(.*)$/.exec(line)
    const body = line.startsWith('---')
      ? `<span class="p">---</span>`
      : m
        ? `${m[1]}${m[2] ? '<span class="p">- </span>' : ''}<span class="k">${m[3]}</span><span class="p">:</span>${m[5]}${m[6] ? value(m[6]!) : ''}`
        : dash
          ? `${dash[1]}<span class="p">- </span>${value(dash[3]!)}`
          : escape(line)
    return `<div class="ln${marks[i + 1] ? ` ${marks[i + 1]}` : ''}"><i>${i + 1}</i><span>${body}</span></div>`
  })
  return `<div class="code">${lines.slice(from - 1).join('')}</div>`
}

interface Deployment {
  name: string
  image: string
  replicas: number
  port?: number
  env?: boolean
  resources?: boolean
  request?: string
}

function deploymentYaml(d: Deployment, kind = 'Deployment'): string {
  return `apiVersion: apps/v1
kind: ${kind}
metadata:
  name: ${d.name}
  namespace: ${NAMESPACE}
spec:${kind === 'DaemonSet' ? '' : `\n  replicas: ${d.replicas}`}
  selector:
    matchLabels:
      app: ${d.name}
  template:
    metadata:
      labels:
        app: ${d.name}
    spec:
      containers:
        - name: ${d.name}
          image: ${d.image}${d.port ? `\n          ports:\n            - containerPort: ${d.port}` : ''}${d.env ? '\n          env:\n            - name: LOG_LEVEL\n              value: info' : ''}${d.resources ? `\n          resources:\n            requests:\n              cpu: 250m\n              memory: ${d.request ?? '128Mi'}\n            limits:\n              memory: 256Mi` : ''}`
}

const WEB: Deployment = {
  name: 'web',
  image: 'ghcr.io/acme/web:2.4.1',
  replicas: 2,
  port: 8080,
  env: true,
  resources: true,
}

// ─── The forms ─────────────────────────────────────────────────────────────────────────────

interface FormOptions {
  d?: Deployment
  focus?: 'image'
  nameBad?: boolean
  requestBad?: boolean
  note?: string
  allNamespaces?: boolean
}

const follows = (name: string, also = 'selector and its pods’ labels') =>
  `<div class="derived">${icon('link', 12)}<span>Labelled <code>app=${escape(name || '…')}</code>: its ${also} follow the name.</span></div>`

function resources(o: { requestBad?: boolean; request?: string } = {}): string {
  return labelled(
    optional('Requests and limits'),
    '.resources',
    `<div class="frow" style="gap:8px 12px">${field('250m', { mono: true, unit: 'CPU request' })}${field(o.request ?? '128Mi', { mono: true, unit: 'Memory request', bad: o.requestBad })}${field('', { mono: true, unit: 'CPU limit' })}${field('256Mi', { mono: true, unit: 'Memory limit' })}</div>`,
    {
      note: o.requestBad
        ? `<p class="ferr">The cluster refused the memory request: must be less than or equal to memory limit of 256Mi.</p>`
        : '',
    },
  )
}

function deploymentForm(o: FormOptions = {}): string {
  const d = o.d ?? WEB
  const empty = !d.name
  return `${o.note ?? ''}
    ${two(
      labelled(
        'Name',
        'metadata.name',
        field(d.name || 'web', { placeholder: empty, bad: o.nameBad, focus: o.nameBad }),
      ),
      labelled('Namespace', 'metadata.namespace', select(o.allNamespaces ? 'default' : NAMESPACE)),
    )}
    ${o.nameBad ? `<p class="ferr" style="margin-top:-8px">Lowercase letters, digits and “-”, starting and ending with a letter or digit. The container takes the same name.</p>` : ''}
    ${o.allNamespaces ? `<p class="fhelp" style="margin-top:-8px">No namespace is chosen in the header, so it starts at <code>default</code>. Choose another here.</p>` : ''}
    ${labelled('Replicas', 'spec.replicas', stepper(d.replicas))}
    ${group('Container')}
    ${labelled('Image', '.image', field(d.image || 'nginx:1.27', { mono: true, placeholder: empty, focus: o.focus === 'image' }), { on: o.focus === 'image' })}
    ${labelled(optional('Port'), '.ports[0].containerPort', field(d.port ? String(d.port) : '80', { mono: true, placeholder: !d.port }))}
    ${labelled(optional('Environment'), '.env', d.env ? pairs([['LOG_LEVEL', 'info']], 'Add a variable') : `<span class="add" style="margin-top:-4px">${icon('plus', 16)}Add a variable</span>`)}
    ${d.resources ? resources({ requestBad: o.requestBad, request: d.request }) : labelled(optional('Requests and limits'), '.resources', `<span class="add" style="margin-top:-4px">${icon('plus', 16)}Set them</span>`)}
    ${follows(d.name)}`
}

/** What each of the other kinds asks, and the YAML it writes. */
const OTHERS: Record<
  Exclude<Kind, 'Deployment'>,
  { form: string; yaml: string; more?: boolean }
> = {
  StatefulSet: {
    form: `${who('postgres')}
      ${two(labelled('Replicas', 'spec.replicas', stepper(1)), labelled('Service', 'spec.serviceName', select('postgres')))}
      <p class="fhelp" style="margin-top:-8px">The headless Service that names its pods. It isn’t created here: make it first, as a Service.</p>
      ${group('Container')}
      ${labelled('Image', '.image', field('postgres:17.2', { mono: true }))}
      ${labelled(optional('Port'), '.ports[0].containerPort', field('5432', { mono: true }))}
      ${labelled(optional('Storage for each pod'), 'spec.volumeClaimTemplates[0]', `<div class="frow" style="gap:8px 12px">${field('20', { mono: true, unit: 'Gi' })}${select('gp3 (default)')}</div><div style="height:8px"></div>${field('/data', { mono: true, unit: 'Mounted at' })}`)}
      ${labelled(optional('Environment'), '.env', pairs([['PGDATA', '/data/pg']], 'Add a variable'))}
      ${follows('postgres')}`,
    yaml: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: shop
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:17.2
          ports:
            - containerPort: 5432
          env:
            - name: PGDATA
              value: /data/pg
          volumeMounts:
            - name: data
              mountPath: /data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: gp3
        resources:
          requests:
            storage: 20Gi`,
    more: true,
  },
  DaemonSet: {
    form: `${who('log-agent', { namespace: 'monitoring' })}
      ${group('Container')}
      ${labelled('Image', '.image', field('ghcr.io/acme/log-agent:1.8.0', { mono: true }))}
      ${labelled(optional('Port'), '.ports[0].containerPort', field('80', { mono: true, placeholder: true }))}
      ${labelled(optional('Environment'), '.env', pairs([['LOG_LEVEL', 'info']], 'Add a variable'))}
      ${resources()}
      <p class="fhelp" style="margin-top:-6px">One pod on every node, so there’s no replica count.</p>
      ${follows('log-agent')}`,
    yaml: deploymentYaml(
      {
        name: 'log-agent',
        image: 'ghcr.io/acme/log-agent:1.8.0',
        replicas: 0,
        env: true,
        resources: true,
      },
      'DaemonSet',
    ).replace('namespace: shop', 'namespace: monitoring'),
  },
  Job: {
    form: `${who('reindex')}
      ${two(labelled('Retries', 'spec.backoffLimit', stepper(3)), '<span></span>')}
      ${labelled('When a pod fails', 'spec.template.spec.restartPolicy', select('Start a new pod'), { note: '<p class="fhelp"><code>Never</code>: the failed pod is kept, to read its logs.</p>' })}
      ${group('Container')}
      ${labelled('Image', '.image', field('ghcr.io/acme/search-indexer:4.1.0', { mono: true }))}
      ${labelled(optional('Command'), '.command', field('indexer --all --since 24h', { mono: true }), { note: '<p class="fhelp">Run as <code>sh -c</code>. Empty runs the image’s own command.</p>' })}
      ${labelled(optional('Environment'), '.env', pairs([['INDEX', 'products']], 'Add a variable'))}`,
    yaml: `apiVersion: batch/v1
kind: Job
metadata:
  name: reindex
  namespace: shop
spec:
  backoffLimit: 3
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: reindex
          image: ghcr.io/acme/search-indexer:4.1.0
          command:
            - sh
            - -c
            - indexer --all --since 24h
          env:
            - name: INDEX
              value: products`,
  },
  CronJob: {
    form: `${who('reindex-nightly')}
      ${labelled('Schedule', 'spec.schedule', field('30 2 * * *', { mono: true }), { note: '<p class="reads">Every day at 02:30, in the cluster’s time zone.</p>' })}
      ${labelled('If the last run is still going', 'spec.concurrencyPolicy', select('Skip this one'))}
      ${labelled('When a pod fails', 'spec.jobTemplate.spec.template.spec.restartPolicy', select('Start a new pod'), { stack: true, note: '<p class="fhelp"><code>Never</code>: the failed pod is kept, to read its logs.</p>' })}
      ${group('Container', 'spec.jobTemplate.spec.template.spec.containers[0]')}
      ${labelled('Image', '.image', field('ghcr.io/acme/search-indexer:4.1.0', { mono: true }))}
      ${labelled(optional('Command'), '.command', field('indexer --all --since 24h', { mono: true }), { note: '<p class="fhelp">Run as <code>sh -c</code>. Empty runs the image’s own command.</p>' })}
      ${labelled(optional('Environment'), '.env', pairs([['INDEX', 'products']], 'Add a variable'))}`,
    yaml: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: reindex-nightly
  namespace: shop
spec:
  schedule: "30 2 * * *"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
            - name: reindex-nightly
              image: ghcr.io/acme/search-indexer:4.1.0
              command:
                - sh
                - -c
                - indexer --all --since 24h
              env:
                - name: INDEX
                  value: products`,
  },
  Service: {
    form: `${who('web')}
      ${labelled('Type', 'spec.type', seg(['ClusterIP', 'NodePort', 'LoadBalancer'], 'ClusterIP'), { note: '<p class="fhelp">Reached from inside the cluster only.</p>' })}
      ${labelled('Sends traffic to pods labelled', 'spec.selector', pairs([['app', 'web']], 'Add a label'), { note: `<p class="reads" style="display:flex;align-items:center;gap:6px">${icon('circle-check', 14, 2, 'color:var(--good-text)')}2 pods in shop match now.</p>` })}
      ${labelled('Ports', 'spec.ports', `<div class="pairs"><div class="pair">${field('80', { mono: true, unit: 'Port', cls: 'n' })}<span class="eq">${icon('arrow-right', 14)}</span>${field('8080', { mono: true, unit: 'On the pod' })}${select('TCP', { cls: 'n' })}<span class="rm">${icon('x', 16)}</span></div><span class="add">${icon('plus', 16)}Add a port</span></div>`)}`,
    yaml: `apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: shop
spec:
  type: ClusterIP
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP`,
  },
  ConfigMap: {
    form: `${who('web-settings')}
      ${labelled('Data', 'data', `<div class="pairs"><div class="pair">${field('LOG_LEVEL', { mono: true })}<span class="eq">=</span>${field('info', { mono: true, cls: 'v' })}<span class="rm">${icon('x', 16)}</span></div><div class="pair" style="align-items:flex-start">${field('features.yaml', { mono: true })}<span class="eq" style="margin-top:6px">=</span>${field('checkout:\n  express: true\n  gift-cards: false', { mono: true, cls: 'v area' })}<span class="rm">${icon('x', 16)}</span></div><span class="add">${icon('plus', 16)}Add a key</span></div>`, { note: '<p class="fhelp">A value can have several lines.</p>' })}`,
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: web-settings
  namespace: shop
data:
  LOG_LEVEL: info
  features.yaml: |
    checkout:
      express: true
      gift-cards: false`,
  },
  Secret: {
    form: '',
    yaml: '',
  },
  PersistentVolumeClaim: {
    form: `${who('uploads')}
      ${labelled('Size', 'spec.resources.requests.storage', field('50', { mono: true, unit: 'Gi' }))}
      ${labelled('Storage class', 'spec.storageClassName', select('gp3 (default)'))}
      ${labelled('Who can mount it', 'spec.accessModes', select('One node, to read and write'), { note: '<p class="fhelp"><code>ReadWriteOnce</code>. The class decides which of these it can give.</p>' })}
      <div class="note">${icon('info', 16)}<span>Its size can grow later where the class allows it; it can’t shrink.</span></div>`,
    yaml: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: uploads
  namespace: shop
spec:
  storageClassName: gp3
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi`,
  },
}

function secret(shown: boolean): { form: string; yaml: string } {
  const rows: [string, string][] = [
    ['PAYMENTS_API_KEY', 'c41d07be6a3e8f29'],
    ['WEBHOOK_SECRET', '6d2a57e41a4b1f0c'],
  ]
  return {
    form: `${who('payments-credentials')}
      ${labelled('Type', 'type', '<p class="reads" style="margin:0"><b style="font-weight:500">Opaque</b>: keys and values of your own. For a TLS or registry secret, use the YAML.</p>')}
      ${labelled('Data', 'stringData', pairs(rows, 'Add a key', { masked: true, shown }), { note: `<p class="fhelp">${shown ? 'Values are showing on both sides; Hide values, above the YAML, hides them again.' : 'Values are hidden on both sides until you choose Show values, above the YAML.'} The cluster stores them base64-encoded, which isn’t encryption.</p>` })}`,
    yaml: `apiVersion: v1
kind: Secret
metadata:
  name: payments-credentials
  namespace: shop
type: Opaque
stringData:
${rows.map(([k, v]) => `  ${k}: ${shown ? v : '••••••••'}`).join('\n')}`,
  }
}

// ─── The dialog ────────────────────────────────────────────────────────────────────────────

const PRODUCTION = '<span class="prod">Production</span>'

/**
 * The dialog's header. With YAML it's today's line, whole. With the form, the namespace is one
 * of its fields, so the line says only which cluster.
 */
function head(title: string, mode: 'Form' | 'YAML') {
  const sub =
    mode === 'YAML'
      ? `<span>New objects go to ${NAMESPACE} unless they name a namespace · <b>${CONTEXT}</b></span>`
      : `<span>On <b>${CONTEXT}</b></span>`
  return `<div class="head"><div class="glyph">${icon('file-plus', 18)}</div><div><h3>${title}</h3><div class="sub">${sub}${PRODUCTION}</div></div></div>`
}

/** The switch between the two ways, then the kinds: the form's nine, or YAML's seven templates. */
const kinds = (mode: 'Form' | 'YAML', on?: string, list: readonly string[] = KINDS) =>
  `<div class="modes">${seg(['Form', 'YAML'], mode)}</div><div class="kinds">${list.map((k) => `<span class="kchip${k === on ? ' on' : ''}">${k}</span>`).join('')}</div>`

const command = (text: string) =>
  `<div class="command"><div class="label">Equivalent command${icon('copy', 14)}</div><code>${escape(text)}</code></div>`

const CREATE = `kubectl create -f objects.yaml -n ${NAMESPACE} --context ${CONTEXT}`

const footer = (confirm = 'Create', back = 'Cancel', off = false) =>
  `<div class="actions"><span class="btn ghost">${back}</span><span class="btn primary${off ? ' off' : ''}" style="min-width:80px">${confirm}</span></div>`

interface Panes {
  kind: Kind
  form: string
  yaml: string
  marks?: Record<number, Mark>
  bar?: string
  results?: string
  locked?: boolean
  more?: boolean
  cls?: string
  namespace?: string
  cmd?: string
  /** How far the form is scrolled, in px (negative), to bring a field into view. */
  shift?: number
  /** Create can't be pressed yet. */
  off?: boolean
  /** The first line of the YAML in view, where it's scrolled. */
  from?: number
}

/** The dialog with the form: the kinds, the form, and beside it the YAML it writes. */
function withForm(p: Panes): string {
  return `<div class="dialog create${p.cls ? ` ${p.cls}` : ''}">
    ${head('Create', 'Form')}
    ${kinds('Form', p.kind)}
    <div class="panes">
      <div class="fpane${p.locked ? ' locked' : ''}${p.more ? ' more' : ''}"><div class="fin"${p.shift ? ` style="margin-top:${p.shift}px"` : ''}>${p.form}</div></div>
      <div class="ypane">
        <div class="ybar"><b>YAML</b>${p.bar ?? '<span>Edit either side: they stay in step.</span>'}</div>
        ${code(p.yaml, p.marks, p.from)}
        <div class="under">${p.results ?? ''}${command(p.cmd ?? CREATE)}</div>
      </div>
    </div>
    ${footer('Create', 'Cancel', p.off)}
  </div>`
}

const NGINX = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: shop
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80`

/** Today's dialog, with the switch to the form in its header: nothing else in it changes. */
function yamlOnly(): string {
  return `<div class="dialog create narrow">
    ${head('Create', 'YAML')}
    <div class="body2">
      ${kinds('YAML', undefined, ['Deployment', 'Service', 'ConfigMap', 'Secret', 'Job', 'CronJob', 'Namespace'])}
      <div class="ypane">${code(NGINX)}</div>
      <p class="hint">Several objects can be created at once: separate them with a line of <code>---</code>.</p>
      ${command(CREATE)}
    </div>
    ${footer()}
  </div>`
}

const EXTRA = `${deploymentYaml(WEB).replace('  selector:', '  strategy:\n    type: Recreate\n  selector:').replace('    spec:\n      containers:', '    spec:\n      nodeSelector:\n        pool: general\n      containers:')}`

const TWO = `${deploymentYaml({ ...WEB, env: false, resources: false })}
        - name: metrics
          image: ghcr.io/acme/metrics-sidecar:0.9.2
          ports:
            - containerPort: 9102`

export type State =
  | 'yaml'
  | 'empty'
  | 'filled'
  | 'error'
  | 'extra'
  | 'locked'
  | 'refused'
  | 'created'
  | 'review'
  | 'all-namespaces'
  | 'full'
  | 'statefulset'
  | 'daemonset'
  | 'job'
  | 'cronjob'
  | 'service'
  | 'configmap'
  | 'secret'
  | 'secret-shown'
  | 'pvc'

export const STATES: { state: State; title: string; note: string; group: string }[] = [
  {
    state: 'yaml',
    group: 'Choosing',
    title: 'YAML, as today',
    note: 'Today’s dialog, with one thing added: the switch to the form in its header.',
  },
  {
    state: 'empty',
    group: 'Deployment',
    title: 'The form, new',
    note: 'Nine kinds. Each field names the YAML path it writes; the YAML is beside it.',
  },
  {
    state: 'filled',
    group: 'Deployment',
    title: 'Filled in',
    note: 'In a field, its path and its line in the YAML light up.',
  },
  {
    state: 'error',
    group: 'Deployment',
    title: 'A field in error',
    note: 'Said under the field as it’s typed, and marked on its line.',
  },
  {
    state: 'extra',
    group: 'Deployment',
    title: 'YAML the form doesn’t show',
    note: 'Edited by hand: the form keeps what it has no field for, and says so.',
  },
  {
    state: 'locked',
    group: 'Deployment',
    title: 'YAML the form can’t show',
    note: 'Two containers: the form steps back, the YAML is what’s created.',
  },
  {
    state: 'refused',
    group: 'Deployment',
    title: 'The cluster refuses it',
    note: 'Create checks with the cluster first, as today. Its answer goes to the field it names.',
  },
  {
    state: 'created',
    group: 'Deployment',
    title: 'Created',
    note: 'As today: the dialog closes, and a toast offers to open it.',
  },
  {
    state: 'review',
    group: 'Decided',
    title: 'Not chosen: a review before creating',
    note: 'Don’t build this. Create checks with the cluster and creates, as today.',
  },
  {
    state: 'all-namespaces',
    group: 'Decided',
    title: 'The namespace',
    note: 'A field of the form. With All namespaces in the header, it starts at default and says so.',
  },
  {
    state: 'full',
    group: 'Decided',
    title: 'Not chosen: filling the window',
    note: 'Don’t build this. The dialog is 960 px wide and 86% of the window’s height.',
  },
  {
    state: 'statefulset',
    group: 'The other kinds',
    title: 'StatefulSet',
    note: 'Its Service, and storage for each pod.',
  },
  {
    state: 'daemonset',
    group: 'The other kinds',
    title: 'DaemonSet',
    note: 'A Deployment’s fields, without replicas.',
  },
  {
    state: 'job',
    group: 'The other kinds',
    title: 'Job',
    note: 'A command, and how often to retry.',
  },
  {
    state: 'cronjob',
    group: 'The other kinds',
    title: 'CronJob',
    note: 'A schedule, read back in words.',
  },
  {
    state: 'service',
    group: 'The other kinds',
    title: 'Service',
    note: 'Its type, the pods it sends to, and its ports.',
  },
  {
    state: 'configmap',
    group: 'The other kinds',
    title: 'ConfigMap',
    note: 'Keys and values; a value can have several lines.',
  },
  {
    state: 'secret',
    group: 'The other kinds',
    title: 'Secret',
    note: 'Values hidden, in the form and in the YAML.',
  },
  {
    state: 'secret-shown',
    group: 'The other kinds',
    title: 'Secret, shown',
    note: 'Shown on purpose, with one button for both sides.',
  },
  {
    state: 'pvc',
    group: 'The other kinds',
    title: 'PersistentVolumeClaim',
    note: 'A size, a class, and who can mount it.',
  },
]

function dialog(state: State, small: boolean): string {
  const other = (kind: Exclude<Kind, 'Deployment' | 'Secret'>) =>
    withForm({
      kind,
      form: OTHERS[kind].form,
      yaml: OTHERS[kind].yaml,
      more: OTHERS[kind].more,
      cmd: kind === 'DaemonSet' ? CREATE.replace('-n shop', '-n monitoring') : undefined,
    })
  switch (state) {
    case 'yaml':
      return yamlOnly()
    case 'empty': {
      const d = { name: '', image: '', replicas: 1 }
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({ d }),
        yaml: deploymentYaml(d),
        bar: '<span>Name and Image are still empty.</span>',
        off: true,
      })
    }
    case 'filled':
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({ focus: 'image' }),
        yaml: deploymentYaml(WEB),
        marks: { 18: 'hl' },
        from: small ? 6 : 1,
      })
    case 'error': {
      const d = { ...WEB, name: 'Web_API' }
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({ d, nameBad: true }),
        yaml: deploymentYaml(d),
        marks: { 4: 'bad', 17: 'bad' },
        from: small ? 3 : 1,
        bar: '<span>1 field to fix before it can be created.</span>',
        off: true,
      })
    }
    case 'extra':
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({
          note: `<div class="note">${icon('info', 16)}<span>The YAML also sets <code>spec.strategy</code> and <code>spec.template.spec.nodeSelector</code>. The form has no field for them, and keeps them as they are.</span></div>`,
        }),
        yaml: EXTRA,
        marks: { 8: 'extra', 9: 'extra', 18: 'extra', 19: 'extra' },
        from: small ? 7 : 1,
        more: true,
      })
    case 'locked':
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({
          note: `<div class="note">${icon('info', 16)}<span><b>The form can’t show this YAML</b>It has two containers, and the form edits one. The YAML is what gets created; go on editing it there. Below is the form as it last was.<br><span class="btn secondary sm">${icon('rotate-ccw', 14)}Go back to the form’s version</span></span></div>`,
        }),
        yaml: TWO,
        marks: { 21: 'extra', 22: 'extra', 23: 'extra', 24: 'extra' },
        from: small ? 11 : 1,
        bar: '<span>Edited by hand. This is what gets created.</span>',
        locked: true,
      })
    case 'refused': {
      const d = { ...WEB, request: '512Mi' }
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({ d, requestBad: true }),
        yaml: deploymentYaml(d),
        marks: { 27: 'bad' },
        from: small ? 19 : 13,
        shift: small ? -262 : 0,
        more: true,
        results: `<div class="results"><div>${icon('circle-x', 14, 2, 'color:var(--critical-text)')}<span><span class="who">Deployment/web</span><span class="why">Deployment.apps "web" is invalid: spec.template.spec.containers[0].resources.requests: Invalid value: "512Mi": must be less than or equal to memory limit of 256Mi</span></span></div></div>`,
        bar: '<span>Nothing was created.</span>',
      })
    }
    case 'created':
      return `<div class="toast">${icon('circle-check', 18)}<div><div class="t">Created deployment web</div></div><span class="act">Open</span></div>`
    case 'review':
      return `<span class="optional">Not chosen: don’t build this step</span><div class="dialog create">
        ${head('Create', 'Form')}
        <div class="review">
          <div class="rv"><span class="btn ghost sm" style="margin-left:-8px">${icon('arrow-right', 14, 2, 'transform:rotate(180deg)')}Back to editing</span><span class="status" style="margin-left:auto">${icon('circle-check', 14)}The cluster accepts it (checked without saving it).</span></div>
          <div class="rv"><span>Creates <b>Deployment web</b> in <b>shop</b>, on <b>${CONTEXT}</b>: 2 pods of <span class="mono" style="font-size:12px">ghcr.io/acme/web:2.4.1</span>.</span></div>
          <div class="box">${code(deploymentYaml(WEB))}</div>
          ${command(CREATE)}
        </div>
        ${footer('Create', 'Cancel')}
      </div>`
    case 'all-namespaces':
      return withForm({
        kind: 'Deployment',
        form: deploymentForm({ allNamespaces: true }),
        yaml: deploymentYaml(WEB).replace('namespace: shop', 'namespace: default'),
        marks: { 5: 'hl' },
        namespace: 'default',
        cmd: CREATE.replace('-n shop', '-n default'),
      })
    case 'full':
      return `<span class="optional">Not chosen: don’t build this size</span>${withForm({
        kind: 'Deployment',
        form: deploymentForm(),
        yaml: deploymentYaml(WEB),
        cls: 'full',
      })}`
    case 'statefulset':
      return other('StatefulSet')
    case 'daemonset':
      return other('DaemonSet')
    case 'job':
      return other('Job')
    case 'cronjob':
      return other('CronJob')
    case 'service':
      return other('Service')
    case 'configmap':
      return other('ConfigMap')
    case 'pvc':
      return other('PersistentVolumeClaim')
    case 'secret':
    case 'secret-shown': {
      const shown = state === 'secret-shown'
      const s = secret(shown)
      return withForm({
        kind: 'Secret',
        form: s.form,
        yaml: s.yaml,
        bar: `<span>${shown ? 'Edit either side: they stay in step.' : 'Read-only while its values are hidden.'}</span><span class="end"><span class="btn ghost sm">${icon(shown ? 'eye-off' : 'eye', 14)}${shown ? 'Hide values' : 'Show values'}</span></span>`,
      })
    }
  }
}

/** The app's window at the two sizes its screenshots are checked at. */
export const SIZES: Size[] = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
]

/** Create in one state and theme, in a window `size` big, over the app's overview. */
export function createPage(state: State, scheme: Scheme, size: Size): string {
  const ansi = scheme === 'dark' ? '#bc8cff' : '#8250df'
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} --ansi-5: ${ansi}; --tint-hl: ${scheme === 'dark' ? '20%' : '8%'}; --tint-bad: ${scheme === 'dark' ? '22%' : '10%'}; --tint-extra: ${scheme === 'dark' ? '18%' : '10%'}; }
html, body { width: ${size.width}px; height: ${size.height}px; }
${PARTS}
${CSS}
</style><div class="page" style="background-image:url(${behind(scheme)})"></div><i class="cover"></i>${state === 'created' ? '' : '<div class="scrim"></div>'}${dialog(state, size.width < 1200)}`
}
