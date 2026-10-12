/**
 * A node's taints, and a drain with kubectl's options and PodDisruptionBudgets said (LMV-182).
 * Both are the app's ActionDialog: its header, its body, the equivalent command, the typed name
 * on a production cluster, and its footer. Desktop only: neither is offered on a phone. Drawn
 * before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 32px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 860px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 24px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.dlg { width: 560px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 16px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.dlg.wide { width: 640px; }
.dlg .hd { display: flex; align-items: flex-start; gap: 12px; padding: 20px 20px 4px; }
.dlg .ic { display: grid; width: 36px; height: 36px; flex: none; place-items: center; border-radius: 10px; background: var(--surface-3); color: var(--text-2); }
.dlg .ic.danger { background: color-mix(in srgb, var(--critical) 12%, transparent); color: var(--critical-text); }
.dlg .hd h3 { margin: 0; font-size: 15px; line-height: 20px; font-weight: 600; }
.dlg .hd small { display: flex; align-items: center; gap: 6px; margin-top: 2px; font-size: 12px; color: var(--text-3); }
.dlg .hd small b { font-weight: 500; color: var(--text-2); }
.dlg .hd .prod { padding: 0 6px; border-radius: 4px; background: color-mix(in srgb, var(--critical) 10%, transparent); font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--critical-text); }
.dlg .bd { display: flex; flex-direction: column; gap: 14px; padding: 16px 20px 20px; }
.dlg .lead { margin: 0; font-size: 13px; line-height: 20px; color: var(--text-2); }
.dlg .ft { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); }
.b { display: inline-flex; height: 32px; align-items: center; gap: 6px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-size: 13px; font-weight: 500; color: var(--text-1); }
.b.pri { border-color: var(--accent); background: var(--accent); color: #fff; }
.b.danger { border-color: var(--critical); background: var(--critical); color: #fff; }
.b.dis { opacity: 0.45; }
.b.ghost { border-color: transparent; background: transparent; height: 26px; padding: 0 8px; color: var(--text-2); }
.cmd { padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); }
.cmd b { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
.cmd code { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 19px; color: var(--text-2); white-space: pre-wrap; overflow-wrap: anywhere; }
.typed label svg.i { display: inline; vertical-align: -1px; margin-right: 4px; color: var(--critical-text); }
.typed label { display: block; margin-bottom: 6px; font-size: 12px; color: var(--text-2); }
.typed label code { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-1); }
.typed .f { height: 36px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); }
.list { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; }
.tr { display: flex; min-height: 40px; align-items: center; gap: 10px; padding: 6px 8px 6px 12px; border-top: 1px solid var(--line); }
.tr:first-child { border-top: 0; }
.tr .kv { min-width: 0; flex: 1; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.tr .kv i { font-style: normal; color: var(--text-3); }
.tr .eff { flex: none; padding: 0 8px; border-radius: 999px; background: var(--surface-3); font-size: 11.5px; line-height: 20px; color: var(--text-1); }
.tr .eff.ne { background: color-mix(in srgb, var(--warn) 14%, transparent); color: var(--warn-text); }
.tr .sys { flex: none; font-size: 11.5px; color: var(--text-3); }
.tr.add { box-shadow: inset 3px 0 0 var(--accent); background: color-mix(in srgb, var(--accent) 5%, transparent); }
.tr.add .new { flex: none; font-size: 11.5px; font-weight: 500; color: var(--accent); }
.tr.rm .kv, .tr.rm .eff { text-decoration: line-through; color: var(--text-3); }
.tr.rm .undo { flex: none; font-size: 12px; font-weight: 500; color: var(--accent); }
.form { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto auto; gap: 8px; align-items: end; }
.form label { display: block; white-space: nowrap; margin-bottom: 4px; font-size: 12px; font-weight: 500; color: var(--text-2); }
.fld { display: flex; height: 32px; min-width: 0; align-items: center; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-1); white-space: nowrap; overflow: hidden; }
.fld.ph { font-family: 'Inter', sans-serif; color: var(--text-3); }
.fld.bad { border-color: var(--critical); box-shadow: 0 0 0 1px var(--critical); }
.fld.sm { width: 84px; }
.seg { display: inline-flex; height: 32px; padding: 2px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); }
.seg span { display: grid; padding: 0 10px; place-items: center; border-radius: 6px; font-size: 12.5px; color: var(--text-2); white-space: nowrap; }
.seg span.on { background: var(--surface-3); font-weight: 500; color: var(--text-1); }
.why { margin: 4px 0 0; font-size: 12px; line-height: 18px; color: var(--critical-text); }
.warn { display: flex; gap: 8px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--warn) 10%, transparent); font-size: 12.5px; line-height: 19px; color: var(--warn-text); }
.warn > svg.i { flex: none; margin-top: 2px; }
.warn b { font-weight: 600; }
.ok { display: flex; gap: 8px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--good) 10%, transparent); font-size: 12.5px; color: var(--good-text); }
.opts { display: flex; flex-direction: column; gap: 10px; }
.opt { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 12px; align-items: center; }
.opt > span:first-child { font-size: 12.5px; font-weight: 500; color: var(--text-1); }
.opt .cell { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-3); }
.cb { display: flex; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; }
.cb.risk { border-color: color-mix(in srgb, var(--critical) 40%, transparent); background: color-mix(in srgb, var(--critical) 5%, transparent); }
.cb .box { display: grid; width: 16px; height: 16px; flex: none; margin-top: 2px; place-items: center; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); }
.cb .box.x { border-color: var(--accent); background: var(--accent); color: #fff; }
.cb.risk .box.x { border-color: var(--critical); background: var(--critical); }
.cb b { display: block; font-size: 13px; font-weight: 500; }
.cb small { display: block; font-size: 12px; color: var(--text-3); }
.cnt { font-size: 12px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.cnt.w { color: var(--warn-text); }
.pods { max-height: none; }
.pr { display: flex; align-items: center; gap: 10px; padding: 7px 12px; border-top: 1px solid var(--line); }
.pr:first-child { border-top: 0; }
.pr > .st { display: grid; width: 16px; flex: none; place-items: center; color: var(--text-3); }
.pr > .st.good { color: var(--good-text); }
.pr > .st.w { color: var(--warn-text); }
.pr > .st.x { color: var(--critical-text); }
.pr .m { min-width: 0; flex: 1; }
.pr .m code { display: block; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.pr .m small { display: block; font-size: 12px; color: var(--text-3); }
.pr .m small.w { color: var(--warn-text); }
.pr .m small.x { color: var(--critical-text); }
.pdbs { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--warn) 10%, transparent); font-size: 12.5px; line-height: 19px; color: var(--warn-text); }
.pdbs .top { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.pdbs .top span { margin-left: auto; font-weight: 400; font-variant-numeric: tabular-nums; }
.pdbs .p { display: flex; gap: 8px; padding-left: 22px; color: var(--text-1); }
.pdbs .p code { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.pdbs .p span { color: var(--text-2); }
.spin { color: var(--text-3); }
`

const header = (glyph: IconName, title: string, o: { danger?: boolean; prod?: boolean } = {}) =>
  `<div class="hd"><span class="ic${o.danger ? ' danger' : ''}">${icon(glyph, 18)}</span><div><h3>${title}</h3><small>Node · <b>production</b>${o.prod ? '<span class="prod">Production</span>' : ''}</small></div></div>`

const cmd = (lines: string[]) =>
  `<div class="cmd"><b>Equivalent command</b><code>${lines.join('\n')}</code></div>`

const taint = (
  k: string,
  v: string,
  eff: string,
  o: { add?: boolean; rm?: boolean; sys?: boolean } = {},
) =>
  `<div class="tr${o.add ? ' add' : ''}${o.rm ? ' rm' : ''}"><span class="kv">${k}${v ? `<i>=</i>${v}` : ''}</span><span class="eff${eff === 'NoExecute' ? ' ne' : ''}">${eff}</span>${o.sys ? '<span class="sys">Set by Kubernetes</span>' : ''}${o.add ? '<span class="new">New</span>' : ''}${o.rm ? '<span class="undo">Keep</span>' : `<span class="b ghost">${icon('x', 14)}</span>`}</div>`

const form = (k: string, v: string, eff: string, o: { bad?: string; add?: boolean } = {}) =>
  `<div><div class="form"><div><label>Key</label><div class="fld${k ? '' : ' ph'}${o.bad ? ' bad' : ''}">${k || 'dedicated'}</div></div><div><label>Value</label><div class="fld${v ? '' : ' ph'}">${v || 'optional'}</div></div><div><label>Effect</label><span class="seg">${['NoSchedule', 'PreferNoSchedule', 'NoExecute'].map((e) => `<span${e === eff ? ' class="on"' : ''}>${e}</span>`).join('')}</span></div><div><label>&nbsp;</label><span class="b${o.add ? '' : ' dis'}">${icon('plus', 14)}Add</span></div></div>${o.bad ? `<p class="why">${o.bad}</p>` : ''}</div>`

function taints(): string {
  const first = `<div class="dlg wide">${header('tag', 'Taints on ip-10-0-12-44')}<div class="bd"><p class="lead">A taint keeps pods off the node unless they tolerate it. The node has three.</p><div class="list">${taint('node-role.kubernetes.io/control-plane', '', 'NoSchedule', { sys: true })}${taint('dedicated', 'gpu', 'NoSchedule')}${taint('maintenance', 'kernel-6.8', 'PreferNoSchedule')}</div>${form('', '', 'NoSchedule')}${cmd(['kubectl --context production taint nodes ip-10-0-12-44 …'])}</div><div class="ft"><span class="b">Cancel</span><span class="b pri dis">Apply</span></div></div>`
  const staged = `<div class="dlg wide">${header('tag', 'Taints on ip-10-0-12-44', { danger: true, prod: true })}<div class="bd"><p class="lead">A taint keeps pods off the node unless they tolerate it. Nothing changes until Apply.</p><div class="list">${taint('node-role.kubernetes.io/control-plane', '', 'NoSchedule', { sys: true })}${taint('dedicated', 'gpu', 'NoSchedule')}${taint('maintenance', 'kernel-6.8', 'PreferNoSchedule', { rm: true })}${taint('maintenance', 'kernel-6.8', 'NoExecute', { add: true })}</div><div class="warn">${icon('triangle-alert', 14)}<span><b>Applying this evicts 4 pods from ip-10-0-12-44 at once.</b> cart-6c9d7f5b44-w4nq7, storefront-7d9f6c5b8-x2kqp and 2 more don’t tolerate maintenance=kernel-6.8. PodDisruptionBudgets aren’t asked, and pods without a controller don’t come back.</span></div>${form('', '', 'NoSchedule')}<div class="typed"><label>${icon('triangle-alert', 12)} Type <code>ip-10-0-12-44</code> to apply on production</label><div class="f"></div></div>${cmd(['kubectl --context production taint nodes ip-10-0-12-44 maintenance=kernel-6.8:PreferNoSchedule-', 'kubectl --context production taint nodes ip-10-0-12-44 maintenance=kernel-6.8:NoExecute'])}</div><div class="ft"><span class="b">Cancel</span><span class="b danger dis">Apply and evict 4 pods</span></div></div>`
  const bad = `<div class="dlg wide">${header('tag', 'Taints on ip-10-0-12-44')}<div class="bd"><div class="list">${taint('dedicated', 'gpu', 'NoSchedule')}</div>${form('dedicated gpu', '', 'NoSchedule', { bad: 'A key is letters, digits, “-”, “_” and “.”, with an optional prefix and “/”: no spaces.' })}${form('dedicated', 'cpu', 'NoSchedule', { add: true })}<p class="why" style="color:var(--text-2);margin-top:-6px">Replaces dedicated=gpu:NoSchedule: a node has one taint per key and effect.</p></div></div>`
  return `<section class="spec"><h2>Taints<i>one dialog: what the node has, what to add, nothing done until Apply</i></h2>
    <div class="row">
      <div><p class="cap">As it opens: three taints, one Kubernetes’ own; the add form under them</p>${first}</div>
      <div><p class="cap">Changes staged, one of them NoExecute, on production</p>${staged}</div>
      <div><p class="cap">The form’s own errors: a key that can’t be one; a key and effect already there</p>${bad}</div>
    </div>
    <p><b>“Taints…”</b> is the node’s action beside Cordon and Drain…, in its detail and its menu; the dialog is ActionDialog’s, wide. <b>Each taint is a row</b>: key, “=”, value in mono (end-cut, whole in the tooltip), the effect as a quiet pill (NoExecute’s in amber, as it evicts), and × to remove. A taint Kubernetes sets itself (<code>node.kubernetes.io/…</code>, <code>node-role.kubernetes.io/…</code>) says “Set by Kubernetes”; it can be removed, and may come back while its cause is true. <b>Under them, the add form</b>: Key, Value (optional), the effect as the app’s segmented control, NoSchedule first, and Add, which is enabled once the key is valid.</p>
    <p><b>Nothing is done until Apply.</b> Add puts a row in the list, marked with an accent rule and “New”; × strikes a row through, marked “Removed”, and offers “Keep”; a new row’s × (its tooltip “Remove”) takes it out again. Apply is disabled until something is staged. The equivalent command shows one <code>kubectl taint</code> line per change, a removal ending in <code>-</code>. A key and effect the node already has is replaced, and the form says so. <b>One Apply for all of it</b>, so a production cluster asks for the node’s name once, as Drain does; and <b>one toast with Undo</b>: “Tainted ip-10-0-12-44 with dedicated=gpu:NoSchedule” for one change, “Changed ip-10-0-12-44’s taints: … added, … removed” for several. Undo puts back the taints as they were; after an Apply that evicted, the toast’s second line says so: “Undo puts the taints back. Pods it evicted don’t come back.” <b>If the node’s taints change while the dialog is open</b> (Kubernetes adds and removes its own, a cordon is one), Apply doesn’t write over them: it refuses, says “ip-10-0-12-44’s taints changed while this was open: here they are now.” above the list, and shows the list as it is now with the person’s changes still staged on it. <b>Removing the control-plane taint</b> is the one of Kubernetes’ own that doesn’t come back by itself: its struck row adds “Pods will be scheduled on this control-plane node.” in amber.</p>
    <p><b>Adding NoExecute</b> turns the dialog to danger: its icon, the amber note above the form saying how many pods will be evicted at once and naming the first two (“and 2 more”), that PodDisruptionBudgets aren’t asked (a taint eviction doesn’t), and Apply becomes “Apply and evict 4 pods” (“1 pod”) in the critical colour. Pods are named by name, with “in shop” only when they’re in more than one namespace. With none to evict there’s no note and no danger, plain Apply, and under the staged row: “Every pod on ip-10-0-12-44 tolerates it: none is evicted.” Changing NoSchedule to NoExecute is the same.</p>
  </section>`
}

const opts = (
  o: { grace?: string; timeout?: string; ds?: boolean; local?: boolean; force?: boolean } = {},
) =>
  `<div class="opts"><div class="opt"><span>Grace period</span><span class="cell"><span class="seg"><span${o.grace ? '' : ' class="on"'}>Each pod’s own</span><span${o.grace ? ' class="on"' : ''}>Seconds</span></span>${o.grace ? `<span class="fld sm">${o.grace}</span>` : ''}</span></div><div class="opt"><span>Give up after</span><span class="cell"><span class="seg"><span${o.timeout ? '' : ' class="on"'}>Never</span><span${o.timeout ? ' class="on"' : ''}>Seconds</span></span>${o.timeout ? `<span class="fld sm">${o.timeout}</span><span>How long to keep trying pods a PodDisruptionBudget holds.</span>` : '<span>Stop it yourself</span>'}</span></div>
  <label class="cb"><span class="box${o.ds !== false ? ' x' : ''}">${o.ds !== false ? icon('check', 12, 3) : ''}</span><span><b>Leave DaemonSet pods</b><small>Their DaemonSet would start them here again anyway. Off, a DaemonSet pod stops the drain.</small></span></label>
  <label class="cb risk"><span class="box${o.local ? ' x' : ''}">${o.local ? icon('check', 12, 3) : ''}</span><span><b>Delete emptyDir data</b><small>Evict pods that keep data in emptyDir volumes; the data is lost.</small></span></label>
  <label class="cb risk"><span class="box${o.force ? ' x' : ''}">${o.force ? icon('check', 12, 3) : ''}</span><span><b>Evict pods without a controller</b><small>Nothing starts them elsewhere.</small></span></label></div>`

const pod = (
  name: string,
  note: string,
  st: '' | 'ok' | 'w' | 'x' | 'spin',
  o: { tone?: 'w' | 'x'; retry?: boolean } = {},
) =>
  `<div class="pr"><span class="st ${st === 'spin' ? 'spin' : st === 'ok' ? 'good' : st}">${st === 'ok' ? icon('circle-check', 16) : st === 'w' ? icon('clock', 16) : st === 'x' ? icon('circle-x', 16) : st === 'spin' ? icon('loader-circle', 16) : icon('minus', 14)}</span><span class="m"><code>${name}</code><small${o.tone ? ` class="${o.tone}"` : ''}>${note}</small></span>${o.retry ? `<span class="b ghost">${icon('rotate-cw', 14)}Retry</span>` : ''}</div>`

function drain(): string {
  const review = `<div class="dlg wide">${header('package-minus', 'Drain ip-10-0-12-44?', { danger: true })}<div class="bd"><p class="lead">ip-10-0-12-44 is cordoned so nothing new is scheduled on it, then its pods are evicted and their controllers start them on other nodes. PodDisruptionBudgets are respected.</p>${opts({ timeout: '300' })}<span class="cnt">5 pods to evict, 2 staying</span><div class="list pods">${pod('cart-6c9d7f5b44-w4nq7', 'shop', '')}${pod('cart-6c9d7f5b44-8xk2p', 'shop', '')}${pod('fluent-bit-7xk2p', 'logging · DaemonSet pod, stays on the node', '')}${pod('redis-0', 'data · Its emptyDir data is lost', '', { tone: 'w' })}</div>${cmd(['kubectl --context production drain ip-10-0-12-44 --ignore-daemonsets --timeout=300s'])}</div><div class="ft"><span class="b">Cancel</span><span class="b danger dis">Drain</span></div></div>`
  const waiting = `<div class="dlg wide">${header('package-minus', 'Draining ip-10-0-12-44', { danger: true })}<div class="bd"><div class="pdbs"><div class="top">${icon('clock', 14)}Waiting on 2 PodDisruptionBudgets<span>trying every 5 s · 2:10 of 5:00</span></div><div class="p"><code>shop/cart</code><span>holds 2 pods: 0 disruptions allowed, 2 of 2 healthy</span></div><div class="p"><code>data/redis</code><span>holds 1 pod: 0 disruptions allowed, 2 of 3 healthy</span></div></div><span class="cnt">2 of 5 evicted · 3 waiting</span><div class="list pods">${pod('storefront-7d9f6c5b8-x2kqp', 'shop · Evicted', 'ok')}${pod('api-5f8d9c7b6-q9w2e', 'shop · Evicted', 'ok')}${pod('cart-6c9d7f5b44-w4nq7', 'shop · Held by cart: 0 disruptions allowed, 2 of 2 healthy · again in 3 s', 'w', { tone: 'w' })}${pod('cart-6c9d7f5b44-8xk2p', 'shop · Held by cart · again in 3 s', 'w', { tone: 'w' })}${pod('redis-0', 'data · Held by redis: 0 disruptions allowed, 2 of 3 healthy · again in 3 s', 'w', { tone: 'w' })}</div></div><div class="ft"><span class="b">Stop</span></div></div>`
  const stopped = `<div class="dlg wide">${header('package-minus', 'Drain of ip-10-0-12-44 stopped', { danger: true })}<div class="bd"><div class="warn">${icon('triangle-alert', 14)}<span><b>Stopped: 3 pods are still on ip-10-0-12-44. It stays cordoned.</b> After 5:00, held by the PodDisruptionBudgets cart (2 pods) and redis (1).</span></div><span class="cnt w">2 of 5 evicted · 3 stopped</span><div class="list pods">${pod('storefront-7d9f6c5b8-x2kqp', 'shop · Evicted', 'ok')}${pod('api-5f8d9c7b6-q9w2e', 'shop · Evicted', 'ok')}${pod('cart-6c9d7f5b44-w4nq7', 'shop · Held by cart: 0 disruptions allowed, 2 of 2 healthy', 'x', { tone: 'x', retry: true })}${pod('cart-6c9d7f5b44-8xk2p', 'shop · Held by cart', 'x', { tone: 'x', retry: true })}${pod('redis-0', 'data · Held by redis: 0 disruptions allowed, 2 of 3 healthy', 'x', { tone: 'x', retry: true })}</div></div><div class="ft"><span class="b">Uncordon</span><span class="b">Drain again</span><span class="b pri">Done</span></div></div>`
  return `<section class="spec"><h2>Drain, with its options<i>each one kubectl flag; the command follows them</i></h2>
    <div class="row">
      <div><p class="cap">The options, a timeout set: the pods and what each option does to them</p>${review}</div>
      <div><p class="cap">Running, held by PodDisruptionBudgets: which, why, and when it tries again</p>${waiting}</div>
      <div><p class="cap">Past the timeout: what it stopped on, and what’s left as it was</p>${stopped}</div>
    </div>
    <p><b>The options</b> come between the lead and the pods, two rows then three boxes. <b>Grace period</b>: “Each pod’s own” or Seconds with a field (<code>--grace-period</code>), which takes 1 or more and says so; no grace at all isn’t offered, as it stops pods with no time to finish. <b>Give up after</b>: “Never”, with “Stop it yourself” beside it, or Seconds (<code>--timeout</code>). <b>Leave DaemonSet pods</b>, on as today (<code>--ignore-daemonsets</code>); off, each DaemonSet pod’s row says it stops the drain, in amber, and Drain is held until it’s on again. <b>Delete emptyDir data</b> (<code>--delete-emptydir-data</code>, today’s “Delete local data”, renamed for the flag it is) and <b>Evict pods without a controller</b> (<code>--force</code>) keep today’s critical tint when ticked. The count and the pods’ rows follow the options as today; the command follows them too.</p>
    <p><b>While a PodDisruptionBudget holds pods</b>, an amber box above the list names each one with the pods it holds and why, in the budget’s own numbers (“0 disruptions allowed, 2 of 2 healthy”), and says it tries every 5 s and how long it has been against the timeout (“2:10 of 5:00”, or “2:10” with none). Each held pod’s row has the clock icon and its budget, and counts down to its next try. Nothing is red while it waits, since waiting is what a budget is for. The footer has only <b>Stop</b>, which stops the tries and leaves the node cordoned. <b>Past the timeout</b>, or stopped: the box says so in amber, which pods are left and which budgets held them, and that the node stays cordoned; each pod left has Retry; the footer has Uncordon, Drain again and Done.</p>
  </section>`
}

export type DrainFrame = 'drain'

export const DRAIN_FRAMES: { id: DrainFrame; title: string; size: Size }[] = [
  { id: 'drain', title: 'Taints, and a drain with options', size: { width: 2140, height: 2000 } },
]

/** The frame, in one theme. */
export function drainFrame(_id: DrainFrame, scheme: Scheme): string {
  const f = DRAIN_FRAMES[0]!
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet"><header><h1>Taints, and a drain with options</h1><p>A node’s taints in one dialog, and Drain… with kubectl’s options, saying which PodDisruptionBudgets hold it up. Both are ActionDialog’s. Desktop only.</p></header>${taints()}${drain()}</div>`
}
