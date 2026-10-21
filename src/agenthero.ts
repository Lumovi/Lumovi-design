/**
 * The new hero (LMV-376; Péter, 2026-10-22: "a claude code is doing some k8s stuff and we see the
 * approval request inside lumovi"): one scenario, animated, the same on top of A, B and C. Claude
 * Code, in a terminal, finds why checkout fails in production and asks to roll it back; the change
 * waits in Lumovi's own approval dialog; it's approved; Claude Code carries on, and the audit log
 * has it. Today's hero cluster leaves the hero (it stays whole on /dashboard).
 *
 * Words: marketing's (Lumovi-marketing plan/website-v4.md, 069637a). The tools, their messages and
 * the dialog are Lumovi's own: docs assistants/tools, and the app's ApprovalCenter.tsx,
 * mcp/tools.ts and audit/describe.ts (main eac4d9af). Claude Code is named here, at Péter's word.
 *
 * Everything moves on one 16 s clock of CSS animations, so it loops cleanly, and a still at any
 * moment is the same page with the clock stopped there.
 */
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'
import {
  button,
  CSS as SITE,
  type Dev,
  heading,
  nav,
  TOKENS,
  type Version,
  VERSIONS,
} from './agentsite.ts'

const T = 16

/** The clock's keyframes, made as the page is drawn: each moving part gets its own. */
class Clock {
  private css: string[] = []
  private n = 0
  private pct = (t: number) => `${((Math.min(Math.max(t, 0), T) / T) * 100).toFixed(3)}%`
  /** A keyframe from stops in seconds; returns the style that runs it. */
  kf(stops: [number, string][]): string {
    const name = `k${this.n++}`
    this.css.push(
      `@keyframes ${name} { ${stops.map(([t, s]) => `${this.pct(t)} { ${s} }`).join(' ')} }`,
    )
    return `animation:${name} ${T}s linear infinite`
  }
  /** Shown from `t`, eased in over 0.3 s, until the loop ends, or until `out`, when it folds away. */
  show(t: number, out?: number, fold = false): string {
    const off = fold ? 'opacity:0;max-height:0' : 'opacity:0;transform:translateY(4px)'
    const on = fold ? 'opacity:1;max-height:90px' : 'opacity:1;transform:none'
    const ease = 'animation-timing-function:cubic-bezier(.2,.8,.2,1)'
    return this.kf([
      [0, off],
      [t, `${off};${ease}`],
      [t + 0.3, on],
      ...(out === undefined
        ? ([
            [T - 0.01, on],
            [T, off],
          ] as [number, string][])
        : ([
            [out, `${on};${ease}`],
            [out + 0.3, off],
            [T, off],
          ] as [number, string][])),
    ])
  }
  /** Typed out, one character a step, from `t0` to `t1`. */
  type(t0: number, t1: number, chars: number): string {
    return this.kf([
      [0, 'clip-path:inset(0 100% 0 0)'],
      [t0, `clip-path:inset(0 100% 0 0);animation-timing-function:steps(${chars},end)`],
      [t1, 'clip-path:inset(0 0 0 0)'],
      [T, 'clip-path:inset(0 0 0 0)'],
    ])
  }
  get styles() {
    return this.css.join('\n')
  }
}

/* ——— The beats, in seconds ——— */
const AT = {
  ask: [0.5, 1.7] as const,
  checking: 2.0,
  problems: [2.5, 3.1] as const,
  logs: [3.5, 4.1] as const,
  history: [4.5, 5.1] as const,
  reason: 5.6,
  apply: 6.3,
  dialog: [6.8, 9.25] as const,
  cursor: [8.2, 8.95, 9.1] as const,
  rolled: 9.3,
  pods: [9.6, 10.0, 10.4] as const,
  changed: 9.5,
  audit: 10.2,
  done: 11.0,
  fade: [15.3, 15.9] as const,
}
/** Stills: the reads, the ask, the approval, and done. */
export const BEATS = [
  { t: 4.6, name: 'It reads' },
  { t: 7.8, name: 'It asks, in Lumovi' },
  { t: 9.02, name: 'You approve' },
  { t: 12.5, name: 'Done, and on the record' },
]

/* ——— The terminal: Claude Code ——— */

function terminal(c: Clock, phone: boolean): string {
  // On a phone the pane is short, so early lines fold away as later ones come, as a terminal scrolls.
  const out = (t: number) => (phone ? t : undefined)
  const line = (t: number, html: string, cls = '', gone?: number) =>
    `<div class="tl ${cls}" style="${c.show(t, gone, true)}">${html}</div>`
  const call = (t: [number, number], tool: string, args: string, result: string, gone?: number) =>
    `<div class="tl" style="${c.show(t[0], gone, true)}"><span class="dot run" style="${c.kf([
      [0, 'opacity:1'],
      [t[1], 'opacity:1'],
      [t[1] + 0.01, 'opacity:0'],
      [T, 'opacity:0'],
    ])}"></span><span class="dot ok" style="${c.kf([
      [0, 'opacity:0'],
      [t[1], 'opacity:0'],
      [t[1] + 0.01, 'opacity:1'],
      [T, 'opacity:1'],
    ])}"></span><span class="tx"><b>lumovi - ${tool}</b> (MCP)(${args})</span></div><div class="tl res" style="${c.show(t[1], gone, true)}"><span class="el">⎿</span><span class="tx">${result}</span></div>`
  return `<div class="term"><div class="tbar"><i></i><i></i><i></i><span>shop — claude</span></div><div class="tbody">
${line(0, '<span class="pr">❯</span><span class="tx">claude</span>', 'mut', phone ? 4.4 : 6.2)}
<div class="tl ask" style="${c.show(0.35, phone ? 5.4 : 10.6, true)}"><span class="gt">&gt;</span><span class="typed" style="${c.type(AT.ask[0], AT.ask[1], 38)}">why is checkout failing in production?</span></div>
${line(AT.checking, '<span class="dot say"></span><span class="tx">Checking what’s failing in shop.</span>', '', phone ? 6.25 : 9.4)}
${call([AT.problems[0], AT.problems[1]], 'find_problems', 'cluster: "production", namespace: "shop"', 'Deployment checkout: 0 of 3 ready · CrashLoopBackOff, 14 restarts', out(9.4))}
${call([AT.logs[0], AT.logs[1]], 'get_logs', 'cluster: "production", namespace: "shop", pod: "checkout-7d9f8-x2k4q", previous: true', '<span class="bad">panic: PAYMENTS_API_KEY is not set</span>', out(10.9))}
${call([AT.history[0], AT.history[1]], 'get_rollout_history', 'cluster: "production", kind: "Deployment", namespace: "shop", name: "checkout"', 'revision 7 · checkout:v1.14.0 · 2 hours ago (now)<br>revision 6 · checkout:v1.13.2 · ran 9 days', out(10.9))}
${line(AT.reason, '<span class="dot say"></span><span class="tx">v1.14.0 crashes on start: PAYMENTS_API_KEY isn’t set. v1.13.2 ran fine, so I’ll ask to roll back.</span>')}
<div class="tl" style="${c.show(AT.apply, undefined, true)}"><span class="dot run" style="${c.kf([
    [0, 'opacity:1'],
    [AT.changed, 'opacity:1'],
    [AT.changed + 0.01, 'opacity:0'],
    [T, 'opacity:0'],
  ])}"></span><span class="dot ok" style="${c.kf([
    [0, 'opacity:0'],
    [AT.changed, 'opacity:0'],
    [AT.changed + 0.01, 'opacity:1'],
    [T, 'opacity:1'],
  ])}"></span><span class="tx"><b>lumovi - apply_manifest</b> (MCP)(cluster: "production", manifest: "apiVersion: apps/v1…", reason: "v1.14.0 panics on start…")</span></div>
<div class="tl res" style="${c.show(AT.changed, undefined, true)}"><span class="el">⎿</span><span class="tx">Changed deployment checkout, approved in Lumovi. The kubectl command that does the same: <span class="cm">kubectl apply --server-side … --context production</span></span></div>
${line(AT.done, '<span class="dot say"></span><span class="tx">checkout is back on v1.13.2, 3 of 3 ready. v1.14.0 needs PAYMENTS_API_KEY before it ships again.</span>')}
</div></div>`
}

/* ——— Lumovi's window: checkout's page, the approval, the audit log ——— */

const PODS_BEFORE = ['checkout-7d9f8-x2k4q', 'checkout-7d9f8-m4wzp', 'checkout-7d9f8-q8rtd']
const PODS_AFTER = ['checkout-5c6b7-h2vtn', 'checkout-5c6b7-p9ksd', 'checkout-5c6b7-z7lmx']

function swap(
  c: Clock,
  at: number,
  before: string,
  after: string,
  until?: number,
  third?: string,
): string {
  return `<span class="sw"><span style="${c.kf([
    [0, 'opacity:1'],
    [at, 'opacity:1'],
    [at + 0.25, 'opacity:0'],
    [T, 'opacity:0'],
  ])}">${before}</span><span style="${c.kf(
    until === undefined
      ? [
          [0, 'opacity:0'],
          [at, 'opacity:0'],
          [at + 0.25, 'opacity:1'],
          [T, 'opacity:1'],
        ]
      : [
          [0, 'opacity:0'],
          [at, 'opacity:0'],
          [at + 0.25, 'opacity:1'],
          [until, 'opacity:1'],
          [until + 0.25, 'opacity:0'],
          [T, 'opacity:0'],
        ],
  )}">${after}</span>${
    third && until !== undefined
      ? `<span style="${c.kf([
          [0, 'opacity:0'],
          [until, 'opacity:0'],
          [until + 0.25, 'opacity:1'],
          [T, 'opacity:1'],
        ])}">${third}</span>`
      : ''
  }</span>`
}

const pill = (
  level: 'critical' | 'progressing' | 'healthy',
  text: string,
  ic: Parameters<typeof icon>[0],
) => `<span class="lp ${level}">${icon(ic, 12)}${text}</span>`

function dialog(c: Clock, phone: boolean): string {
  return `<div class="dlg${phone ? ' sheet' : ''}" style="${c.kf(
    phone
      ? [
          [0, 'transform:translateY(105%)'],
          [
            AT.dialog[0],
            'transform:translateY(105%);animation-timing-function:cubic-bezier(.2,.8,.2,1)',
          ],
          [AT.dialog[0] + 0.45, 'transform:none'],
          [AT.dialog[1], 'transform:none;animation-timing-function:cubic-bezier(.4,0,1,1)'],
          [AT.dialog[1] + 0.35, 'transform:translateY(105%)'],
          [T, 'transform:translateY(105%)'],
        ]
      : [
          [0, 'opacity:0;transform:translateY(10px) scale(.97)'],
          [
            AT.dialog[0],
            'opacity:0;transform:translateY(10px) scale(.97);animation-timing-function:cubic-bezier(.2,.8,.2,1)',
          ],
          [AT.dialog[0] + 0.35, 'opacity:1;transform:none'],
          [AT.dialog[1], 'opacity:1;transform:none'],
          [AT.dialog[1] + 0.25, 'opacity:0;transform:scale(.98)'],
          [T, 'opacity:0;transform:scale(.98)'],
        ],
  )}">${phone ? '<span class="grab"></span>' : ''}
<header><span class="ico">${icon('file-code-2', 18)}</span><div><p class="asks">${icon('sparkles', 12)} Claude Code asks</p><h3>Change Deployment checkout</h3><p class="sub">Deployment · shop · <b>production</b> <span class="prod">Production</span></p></div>${phone ? '' : `<span class="x">${icon('x', 16)}</span>`}</header>
<div class="db">
<figure class="why"><figcaption>Why</figcaption><blockquote>v1.14.0 panics on start: PAYMENTS_API_KEY isn’t set. v1.13.2 ran for 9 days without a restart, so rolling back gets checkout serving again.</blockquote></figure>
<section><p class="acc"><span>The cluster accepts it</span><span><b class="g">+1</b> <b class="r">−1</b> lines</span></p><div class="diff"><div class="q">⋯ 23 unchanged lines</div><div class="del">-         image: ghcr.io/acme/checkout:v1.14.0</div><div class="add">+         image: ghcr.io/acme/checkout:v1.13.2</div><div class="q">⋯ 30 unchanged lines</div></div></section>
<section class="eq"><p class="lbl">Equivalent command</p><div class="cmdb"><code>kubectl apply --server-side --force-conflicts --field-manager=lumovi -f checkout.yaml -n shop --context production</code>${icon('copy', 14)}</div></section>
</div>
<footer><span class="waits">${icon('clock', 13)}Waits 4:58 more</span><span class="b s">Reject…</span><span class="b p">Approve <span class="kb">⌘↩</span><span class="press" style="${c.kf(
    [
      [0, 'opacity:0'],
      [AT.cursor[2] - 0.08, 'opacity:0'],
      [AT.cursor[2], 'opacity:1'],
      [AT.cursor[2] + 0.2, 'opacity:0'],
      [T, 'opacity:0'],
    ],
  )}"></span></span></footer></div>`
}

function lumovi(c: Clock, phone: boolean): string {
  const row = (name: string, st: string) =>
    `<div class="pr"><span class="pn">${name}</span>${st}</div>`
  const crash = pill('critical', 'CrashLoopBackOff', 'circle-x')
  const running = pill('healthy', 'Running', 'circle-check')
  const rows = PODS_BEFORE.map(
    (p, k) =>
      `<div class="prw">${swap(c, AT.pods[k]!, row(p, crash), row(PODS_AFTER[k]!, running))}</div>`,
  ).join('')
  const side = ['layout-dashboard', 'boxes', 'box', 'network', 'activity', 'scroll-text'] as const
  const sideNames = ['Overview', 'Workloads', 'Pods', 'Map', 'Events', 'Audit log']
  return `<div class="lw${phone ? ' ph' : ''}">${phone ? '' : '<div class="lbar"><i></i><i></i><i></i></div>'}<div class="lapp">
${phone ? '' : `<aside><div class="cl"><i></i><span><b>production</b>Kubernetes v1.34.1</span></div>${side.map((ic, k) => `<span class="ni${k === 1 ? ' on' : ''}">${icon(ic, 15)}${sideNames[k]}</span>`).join('')}<span class="ni ai">${icon('sparkles', 15)}AI assistants<i></i></span></aside>`}
<main><div class="ltop">${phone ? icon('menu', 18) : `${icon('arrow-left', 15)}${icon('arrow-right', 15)}`}<span class="tt">${icon('boxes', 15)}Deployments</span><span class="ns">${icon('layout-grid', 13)}shop</span></div>
<div class="lpage"><div class="ph"><span class="pi">${icon('box', 18)}</span><div><p class="k">Deployment · shop · 47d old</p><h4>checkout</h4></div><span class="st">${swap(c, AT.rolled, pill('critical', 'Unavailable', 'circle-x'), pill('progressing', 'Progressing', 'loader-circle'), AT.pods[2], pill('healthy', 'Available', 'circle-check'))}</span></div>
<div class="tiles"><div class="tile"><span>Ready</span><b>${swap(c, AT.pods[0], '0/3', '1/3', AT.pods[2], '3/3')}</b></div><div class="tile"><span>Image</span><b class="mono">${swap(c, AT.rolled, 'checkout:v1.14.0', 'checkout:v1.13.2')}</b></div>${phone ? '' : `<div class="tile"><span>Restarts</span><b>${swap(c, AT.pods[0], '14', '0')}</b></div>`}</div>
<p class="lh">Pods</p><div class="pods">${rows}</div></div>
<div class="audit" style="${c.show(AT.audit)}"><span class="al">${icon('scroll-text', 13)}Audit log</span><div class="ar"><span class="tm">14:31:22</span><span class="ai2">${icon('file-check', 13)}</span><div><b>Applied Deployment checkout</b><span class="who"><i>DE</i>dev@example.com<em>Claude Code</em>· <span class="mono">production / shop</span></span></div></div></div>
</main></div>
<div class="scrim" style="${c.kf([
    [0, 'opacity:0'],
    [AT.dialog[0], 'opacity:0'],
    [AT.dialog[0] + 0.3, 'opacity:1'],
    [AT.dialog[1], 'opacity:1'],
    [AT.dialog[1] + 0.3, 'opacity:0'],
    [T, 'opacity:0'],
  ])}"></div>
${dialog(c, phone)}
${
  phone
    ? `<span class="tap" style="${c.kf([
        [0, 'opacity:0;transform:scale(.4)'],
        [AT.cursor[2] - 0.15, 'opacity:0;transform:scale(.4)'],
        [AT.cursor[2], 'opacity:.9;transform:scale(1)'],
        [AT.cursor[2] + 0.35, 'opacity:0;transform:scale(1.5)'],
        [T, 'opacity:0'],
      ])}"></span>`
    : cursor(c)
}
</div>`
}

/** The pointer: it comes in, goes to Approve, and presses it. */
const cursor = (c: Clock) =>
  `<span class="cur" style="${c.kf([
    [0, 'opacity:0;transform:translate(150px,150px)'],
    [
      AT.cursor[0],
      'opacity:0;transform:translate(150px,150px);animation-timing-function:cubic-bezier(.3,.7,.2,1)',
    ],
    [AT.cursor[0] + 0.2, 'opacity:1;transform:translate(110px,110px)'],
    [AT.cursor[1], 'opacity:1;transform:translate(0,0)'],
    [AT.cursor[2], 'opacity:1;transform:translate(0,0) scale(.88)'],
    [AT.cursor[2] + 0.12, 'opacity:1;transform:translate(0,0)'],
    [AT.dialog[1] + 0.5, 'opacity:1;transform:translate(14px,20px)'],
    [AT.dialog[1] + 0.9, 'opacity:0;transform:translate(20px,26px)'],
    [T, 'opacity:0'],
  ])}"><svg width="20" height="22" viewBox="0 0 20 22"><path d="M2 1.5v16.2l4.3-3.9 2.9 6.6 2.8-1.2-2.9-6.5h5.9z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></span>`

/* ——— The stage: desktop side by side, a phone one pane at a time ——— */

function stage(c: Clock, phone: boolean): string {
  const fade = c.kf([
    [0, 'opacity:0'],
    [0.35, 'opacity:1'],
    [AT.fade[0], 'opacity:1'],
    [AT.fade[1], 'opacity:0'],
    [T, 'opacity:0'],
  ])
  if (!phone)
    return `<div class="stage" style="${fade}"><div class="tpos">${terminal(c, false)}</div><div class="lpos">${lumovi(c, false)}</div></div>`
  // A phone steps: the terminal, then Lumovi while the change waits and lands, then the terminal again.
  const into = AT.dialog[0] - 0.25
  const back = AT.audit + 0.9
  const ease = 'animation-timing-function:cubic-bezier(.65,0,.35,1)'
  return `<div class="stage ph" style="${fade}"><div class="pane" style="${c.kf([
    [0, 'transform:none'],
    [into, `transform:none;${ease}`],
    [into + 0.45, 'transform:translateX(-104%)'],
    [back, `transform:translateX(-104%);${ease}`],
    [back + 0.45, 'transform:none'],
    [T, 'transform:none'],
  ])}">${terminal(c, true)}</div><div class="pane" style="${c.kf([
    [0, 'transform:translateX(104%)'],
    [into, `transform:translateX(104%);${ease}`],
    [into + 0.45, 'transform:none'],
    [back, `transform:none;${ease}`],
    [back + 0.45, 'transform:translateX(104%)'],
    [T, 'transform:translateX(104%)'],
  ])}">${lumovi(c, true)}</div><div class="steps">${['Claude Code', 'Lumovi', 'Claude Code']
    .map(
      (s, k) =>
        `<span style="${c.kf(
          k === 0
            ? [
                [0, 'opacity:1'],
                [into, 'opacity:1'],
                [into + 0.3, 'opacity:.35'],
                [T, 'opacity:.35'],
              ]
            : k === 1
              ? [
                  [0, 'opacity:.35'],
                  [into, 'opacity:.35'],
                  [into + 0.3, 'opacity:1'],
                  [back, 'opacity:1'],
                  [back + 0.3, 'opacity:.35'],
                  [T, 'opacity:.35'],
                ]
              : [
                  [0, 'opacity:.35'],
                  [back, 'opacity:.35'],
                  [back + 0.3, 'opacity:1'],
                  [T, 'opacity:1'],
                ],
        )}">${s}</span>`,
    )
    .join('<i></i>')}</div></div>`
}

const STAGE_CSS = `
.stage { position: relative; width: 1160px; height: 520px; margin: 0 auto; }
.stage .tpos { position: absolute; left: 0; top: 20px; width: 548px; }
.stage .lpos { position: absolute; right: 0; top: 0; width: 596px; }
.term { background: #0d0d0e; border-radius: 12px; box-shadow: 0 0 0 1px rgb(255 255 255/.1), 0 30px 80px -30px rgb(0 0 0/.55); color: #e6e6e6; overflow: hidden; }
.tbar { height: 34px; display: flex; align-items: center; gap: 7px; padding: 0 12px; border-bottom: 1px solid rgb(255 255 255/.07); }
.tbar i, .lbar i { width: 11px; height: 11px; border-radius: 50%; background: #3a3a3c; }
.tbar span { margin-left: auto; margin-right: auto; padding-right: 50px; font-size: 12px; color: #8a8a8e; }
.tbody { height: 466px; padding: 14px 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 19px; display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
.tl { display: flex; flex: none; gap: 8px; overflow: hidden; }
.tl .tx { min-width: 0; }
.tl b { font-weight: 700; color: #fff; }
.tl.mut { color: #8a8a8e; } .tl .pr { color: #3fb950; }
.tl.ask { background: #1c1c1f; border-radius: 6px; padding: 6px 10px; color: #fff; flex: none; }
.tl.ask .gt { color: #8a8a8e; }
.tl.res { color: #a1a1a6; padding-left: 4px; margin-top: -4px; }
.tl.res .el { color: #6e6e73; flex: none; }
.tl .bad { color: #ff8f88; } .tl .wait { color: #d4a72c; } .tl .cm { color: #e6e6e6; }
.dot { position: relative; flex: none; width: 10px; height: 19px; }
.dot::before { content: ''; position: absolute; left: 1px; top: 6px; width: 8px; height: 8px; border-radius: 50%; }
.dot.say::before { background: #e6e6e6; }
.dot.ok::before { background: #3fb950; }
.dot.run::before { background: #8a8a8e; }
.tl > .dot.run + .dot.ok { margin-left: -18px; }
.lw { position: relative; background: var(--surface); border-radius: 12px; box-shadow: 0 0 0 1px var(--line-strong), 0 30px 80px -30px rgb(0 0 0/.35); overflow: hidden; color: var(--text-1); font-size: 12.5px; }
.lbar { height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 12px; background: var(--surface-2); border-bottom: 1px solid var(--line); }
.lapp { display: flex; height: 490px; }
.lw aside { width: 150px; flex: none; padding: 10px 8px; background: var(--surface-2); border-right: 1px solid var(--line); display: flex; flex-direction: column; gap: 2px; }
.lw aside .cl { display: flex; gap: 7px; align-items: center; padding: 6px 6px 10px; margin-bottom: 4px; border-bottom: 1px solid var(--line); }
.lw aside .cl i { width: 7px; height: 7px; border-radius: 50%; background: var(--good); flex: none; }
.lw aside .cl span { display: flex; flex-direction: column; font-size: 11px; color: var(--text-3); line-height: 14px; } .lw aside .cl b { font-size: 12.5px; color: var(--text-1); font-weight: 600; }
.ni { display: flex; align-items: center; gap: 8px; padding: 5px 7px; border-radius: 7px; color: var(--text-2); font-size: 12.5px; }
.ni.on { background: var(--surface-3); color: var(--text-1); font-weight: 550; }
.ni.ai { margin-top: auto; position: relative; } .ni.ai i { width: 6px; height: 6px; border-radius: 50%; background: var(--good); margin-left: auto; }
.lw main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.ltop { height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 14px; border-bottom: 1px solid var(--line); color: var(--text-2); }
.ltop .tt { display: flex; gap: 6px; align-items: center; font-weight: 600; color: var(--text-1); font-size: 13px; }
.ltop .ns { margin-left: auto; display: flex; gap: 5px; align-items: center; font-size: 12px; padding: 3px 8px; border-radius: 7px; box-shadow: inset 0 0 0 1px var(--line-strong); }
.lpage { padding: 16px 18px; flex: 1; }
.lpage .ph { display: flex; gap: 10px; align-items: center; }
.lpage .pi { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; box-shadow: inset 0 0 0 1px var(--line-strong); background: var(--surface-2); flex: none; }
.lpage .k { margin: 0; font-size: 11.5px; color: var(--text-3); } .lpage h4 { margin: 0; font-size: 16px; font-weight: 650; letter-spacing: -.01em; }
.lpage .st { margin-left: auto; }
.sw { display: inline-grid; } .sw > span { grid-area: 1 / 1; }
.lp { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px 2px 6px; border-radius: 99px; font-size: 11.5px; font-weight: 550; white-space: nowrap; }
.lp.critical { color: var(--critical-text); background: color-mix(in srgb, var(--critical) 12%, transparent); }
.lp.progressing { color: var(--accent-strong); background: var(--accent-soft); }
.lp.healthy { color: var(--good-text); background: var(--good-soft); }
.tiles { display: flex; gap: 10px; margin-top: 16px; }
.tile { flex: 1; padding: 10px 12px; border-radius: 10px; box-shadow: inset 0 0 0 1px var(--line); background: var(--surface-2); display: flex; flex-direction: column; gap: 2px; }
.tile span { font-size: 11.5px; color: var(--text-3); } .tile b { font-size: 17px; font-weight: 650; } .tile b.mono { font-size: 12.5px; font-weight: 550; padding-top: 4px; }
.lh { margin: 18px 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-3); }
.pods { border-radius: 10px; box-shadow: inset 0 0 0 1px var(--line); }
.prw + .prw { border-top: 1px solid var(--line); }
.prw .sw { display: grid; }
.pr { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 12px; }
.pn { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.audit { margin: 0 12px 12px; padding: 8px 10px; border-radius: 10px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); }
.audit .al { display: flex; gap: 5px; align-items: center; font-size: 11px; font-weight: 600; letter-spacing: .04em; color: var(--text-3); margin-bottom: 6px; }
.audit .ar { display: flex; gap: 10px; align-items: center; }
.audit .tm { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-3); }
.audit .ai2 { width: 26px; height: 26px; border-radius: 7px; display: grid; place-items: center; box-shadow: inset 0 0 0 1px var(--line); background: var(--surface); color: var(--good-text); flex: none; }
.audit b { display: block; font-size: 12.5px; font-weight: 550; }
.audit .who { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--text-3); flex-wrap: wrap; }
.audit .who i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; background: var(--surface-3); font-size: 11px; font-weight: 650; display: grid; place-items: center; color: var(--text-2); }
.audit .who em { font-style: normal; padding: 0 5px; border-radius: 5px; box-shadow: inset 0 0 0 1px var(--line-strong); color: var(--text-2); font-size: 11px; }
.scrim { position: absolute; inset: 0; background: rgb(0 0 0/.22); }
.dlg { position: absolute; left: 50%; top: 18px; width: 468px; margin-left: -234px; background: var(--surface-2); border-radius: 16px; box-shadow: 0 0 0 1px var(--line-strong), 0 24px 60px -12px rgb(0 0 0/.4); font-size: 12.5px; }
.dlg header { display: flex; gap: 10px; align-items: flex-start; padding: 16px 16px 4px; }
.dlg .ico { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-strong); flex: none; }
.dlg .asks { margin: 0; display: flex; gap: 4px; align-items: center; font-size: 11.5px; font-weight: 550; color: var(--accent-strong); }
.dlg h3 { margin: 1px 0 0; font-size: 14.5px; font-weight: 600; }
.dlg .sub { margin: 1px 0 0; font-size: 11.5px; color: var(--text-3); display: flex; gap: 5px; align-items: center; flex-wrap: wrap; } .dlg .sub b { font-weight: 550; color: var(--text-2); }
.dlg .prod { font-size: 11px; font-weight: 650; letter-spacing: .04em; text-transform: uppercase; color: var(--critical-text); background: color-mix(in srgb, var(--critical) 12%, transparent); padding: 0 5px; border-radius: 4px; }
.dlg .x { margin-left: auto; color: var(--text-2); }
.dlg .db { padding: 10px 16px 0; display: grid; gap: 11px; }
.dlg .why { margin: 0; padding: 7px 10px; border-left: 2px solid var(--accent); border-radius: 8px; background: color-mix(in srgb, var(--accent-soft) 45%, transparent); }
.dlg .why figcaption, .dlg .lbl { font-size: 11px; font-weight: 550; letter-spacing: .06em; text-transform: uppercase; color: var(--text-3); margin: 0; }
.dlg .why blockquote { margin: 1px 0 0; font-size: 12.5px; line-height: 18px; }
.dlg .acc { margin: 0 0 5px; display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-2); } .dlg .acc > span:first-child { font-weight: 550; }
.dlg .acc .g { color: var(--good-text); font-weight: 550; } .dlg .acc .r { color: var(--critical-text); font-weight: 550; }
.dlg .diff { border-radius: 8px; box-shadow: inset 0 0 0 1px var(--line); background: var(--code-bg); font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 18px; padding: 4px 0; }
.dlg .diff div { padding: 0 10px; white-space: pre; overflow: hidden; text-overflow: ellipsis; }
.dlg .diff .q { color: var(--text-3); } .dlg .diff .add { background: var(--diff-add-bg); color: var(--diff-add); } .dlg .diff .del { background: var(--diff-del-bg); color: var(--diff-del); }
.dlg .man { margin: 0; display: flex; gap: 4px; align-items: center; font-size: 12px; color: var(--text-2); }
.dlg .cmdb { margin-top: 4px; display: flex; gap: 8px; align-items: flex-start; padding: 7px 10px; border-radius: 8px; box-shadow: inset 0 0 0 1px var(--line); background: var(--surface); color: var(--text-3); }
.dlg .cmdb code { flex: 1; font-size: 11px; line-height: 17px; color: var(--text-1); word-break: normal; overflow-wrap: anywhere; }
.dlg footer { display: flex; align-items: center; gap: 8px; padding: 14px 16px 16px; }
.dlg .waits { margin-right: auto; display: flex; gap: 5px; align-items: center; font-size: 12px; color: var(--text-3); }
.dlg .b { position: relative; height: 30px; padding: 0 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 550; }
.dlg .b.s { box-shadow: inset 0 0 0 1px var(--line-strong); background: var(--surface); }
.dlg .b.p { background: var(--accent); color: #fff; } .dlg .b .kb { font-size: 11px; opacity: .8; }
.dlg .press { position: absolute; inset: 0; border-radius: 8px; background: rgb(0 0 0/.22); }
.cur { position: absolute; left: 490px; top: 386px; z-index: 5; }
/* A phone: one pane at a time */
.stage.ph { width: 358px; height: 600px; overflow: hidden; border-radius: 14px; }
.stage.ph .pane { position: absolute; inset: 0 0 34px 0; }
.stage.ph .term, .stage.ph .lw { height: 100%; border-radius: 14px; }
.stage.ph .tbody { height: calc(100% - 34px); font-size: 11px; line-height: 17px; padding: 12px; gap: 5px; justify-content: flex-start; }
.stage.ph .tbar span { padding-right: 40px; }
.stage.ph .lapp { height: 100%; }
.stage.ph .lpage { padding: 14px; }
.stage.ph .pn { font-size: 11px; }
.stage.ph .tiles { gap: 8px; }
.stage.ph .tile b.mono { font-size: 11.5px; }
.stage.ph .audit { margin: 0 10px 10px; }
.dlg.sheet { left: 0; right: 0; top: auto; bottom: 0; width: auto; margin: 0; border-radius: 16px 16px 0 0; font-size: 12px; }
.dlg.sheet .grab { display: block; width: 36px; height: 4px; border-radius: 2px; background: var(--line-strong); margin: 8px auto 0; }
.dlg.sheet header { padding-top: 10px; }
.dlg.sheet .db { gap: 9px; }
.tap { position: absolute; right: 52px; bottom: 21px; width: 34px; height: 34px; border-radius: 50%; background: rgb(255 255 255/.55); box-shadow: 0 0 0 2px rgb(0 0 0/.25); z-index: 5; }
.steps { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; font-weight: 550; color: var(--text-2); }
.steps i { width: 14px; height: 1px; background: var(--line-strong); }
.hero2 .hh h1 { font-size: 54px; letter-spacing: -.045em; }
.hero2 .hh h1 .dim { display: inline; }
.hero2 .hrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 48px; margin-top: 18px; }
.hero2 .hrow .lead { margin: 0; font-size: 18px; max-width: 560px; }
.hero2 .hrow .ctas { margin: 0; flex: none; }
.phone .hero2 .hh h1 { font-size: 44px; } .phone .hero2 .hh h1 .dim { display: block; }
.phone .hero2 .hrow { flex-direction: column; gap: 28px; margin-top: 20px; } .phone .hero2 .hrow .lead { font-size: 17px; }
.phone .hero2 .hrow .ctas { align-self: stretch; }
.caption { margin: 22px auto 0; text-align: center; font-size: 14px; color: var(--text-3); }
`

/* ——— The hero, on top of each version ——— */

const CTAS: Record<Version, string> = {
  a: `${button('download', true, 'For macOS, Windows and Linux.')}${button('cluster', false, 'One Helm chart, for your whole team.')}`,
  b: `${button('download', true, 'For macOS, Windows and Linux.')}${button('cluster', false, 'One Helm chart, for your whole team.')}`,
  c: `${button('connect', true, 'Turn it on, paste one line, ask what’s failing.')}${button('download', false, 'For macOS, Windows and Linux.')}`,
}
const NAV: Record<Version, [string[], string]> = {
  a: [['How it works', 'Your rules', 'Dashboard', 'Docs'], 'Download'],
  b: [['Guarantees', 'Audit log', 'For teams', 'Dashboard', 'Docs'], 'Run in your cluster'],
  c: [['Connect', 'What it reads', 'Dashboard', 'Docs'], 'Download'],
}

function hero(c: Clock, v: Version, phone: boolean): string {
  return `<section class="hero2" style="background:var(--glow)">${nav(NAV[v][0], NAV[v][1], phone)}<div class="wrap hh" style="padding-top:${phone ? 36 : 28}px">${heading('Your agent does the work.', 'You approve the change.', 'h1')}<div class="hrow"><p class="lead">Lumovi is a Kubernetes dashboard with a built-in MCP server. Claude Code, or any MCP client, works through it as you; by default, each change waits for you.</p><div class="ctas">${CTAS[v]}</div></div></div><div class="wrap" style="padding:${phone ? '32px 16px 56px' : '28px 0 96px'}">${stage(c, phone)}<p class="caption">Claude Code asks, the cluster checks, you approve, and it’s recorded.</p></div></section>`
}

export type HeroFrame = `hero-${Version}-${Dev}` | 'hero-beats'

export const HERO_FRAMES: { id: HeroFrame; title: string; width: number }[] = [
  ...(['a', 'b', 'c'] as Version[]).flatMap((v) =>
    (['desk', 'phone'] as Dev[]).map((d) => ({
      id: `hero-${v}-${d}` as HeroFrame,
      title: `The new hero on ${VERSIONS[v].name}, ${d === 'desk' ? 'at 1440' : 'on a phone'}`,
      width: d === 'desk' ? 1440 : 390,
    })),
  ),
  { id: 'hero-beats', title: 'The hero’s beats', width: 2440 },
]

/**
 * One of the frames, in one theme. With `t`, the clock is stopped there (a still); without, it runs
 * (the live page). The hero frames show the version's next section under the hero, as it tops it.
 */
export function heroFrame(id: HeroFrame, scheme: Scheme, t?: number): string {
  const f = HERO_FRAMES.find((x) => x.id === id)!
  const c = new Clock()
  let inner: string
  if (id === 'hero-beats') {
    const cell = (b: (typeof BEATS)[number], phone: boolean) =>
      `<figure><figcaption><b>${b.t.toFixed(1)} s</b> ${b.name}</figcaption><div class="frz" style="--t:-${b.t}s">${stage(c, phone)}</div></figure>`
    inner = `<div class="beats"><h1>The hero’s beats</h1><p>One 16 s loop: it reads, it asks in Lumovi, you approve, and it’s done and on the record; then it fades and starts again. On a phone it steps: Claude Code, Lumovi, Claude Code.</p><div class="bd">${BEATS.map((b) => cell(b, false)).join('')}</div><div class="bp">${BEATS.map((b) => cell(b, true)).join('')}</div></div>`
  } else {
    const [, v, d] = id.split('-') as [string, Version, Dev]
    const phone = d === 'phone'
    const next = VERSIONS[v].secs[1]!
    inner = `<div class="page${phone ? ' phone' : ''}">${hero(c, v, phone)}${next.html(d, scheme)}</div>`
    if (t !== undefined) inner = `<div class="frz" style="--t:-${t}s">${inner}</div>`
  }
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
${FONTS}
:root { ${TOKENS[scheme]} }
${SITE}${STAGE_CSS}
${c.styles}
html, body { width: ${f.width}px; margin: 0; background: var(--bg); }
.page { border: 0; }
.frz, .frz * { animation-delay: var(--t) !important; animation-play-state: paused !important; }
.beats { padding: 40px 48px 56px; background: var(--bg); }
.beats h1 { font-size: 30px; letter-spacing: -.03em; } .beats > p { font-size: 15px; color: var(--text-2); margin: 10px 0 28px; max-width: 900px; }
.beats .bd { display: grid; grid-template-columns: 1160px 1160px; gap: 36px 24px; }
.beats .bp { display: flex; gap: 24px; margin-top: 40px; }
.beats figure { margin: 0; } .beats figcaption { margin-bottom: 12px; font-size: 14px; color: var(--text-2); } .beats figcaption b { color: var(--text-1); }
</style>${inner}`
}
