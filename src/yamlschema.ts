/**
 * The YAML editor that knows the cluster's schema (LMV-169): what's wrong underlined before the
 * dry run, a field's description under the pointer, and completion from the object's fields.
 * The editor is CodeEditor's, as it is in Edit YAML, Create's YAML and the create form's YAML
 * side. Desktop only: a phone reads YAML and doesn't edit it. Drawn before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 32px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 820px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code, td code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.ed { position: relative; overflow: visible; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.code { padding: 12px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20.4px; }
.ln { position: relative; display: flex; white-space: pre; }
.ln.act { background: color-mix(in srgb, var(--accent) 6%, transparent); }
.ln .g { display: grid; width: 20px; flex: none; place-items: center; padding-left: 8px; }
.ln .g.e { color: var(--critical); }
.ln .g.w { color: var(--warn-text); }
.ln .no { width: 28px; flex: none; padding-right: 14px; text-align: right; color: color-mix(in srgb, var(--text-3) 60%, transparent); }
.ln .t { color: var(--text-1); }
.k { color: var(--accent-strong); }
.s { color: var(--good-text); }
.n { color: var(--ansi-5); }
.p { color: var(--text-3); }
.c { color: var(--text-3); font-style: italic; }
.err { text-decoration: underline wavy var(--critical); text-decoration-thickness: 1.5px; text-underline-offset: 3px; text-decoration-skip-ink: none; }
.wrn { text-decoration: underline dashed var(--warn); text-decoration-thickness: 1.5px; text-underline-offset: 3px; text-decoration-skip-ink: none; }
.caret { display: inline-block; width: 2px; height: 15px; margin: 0 -1px; vertical-align: -3px; background: var(--accent); }
.foot { display: flex; align-items: center; gap: 14px; padding: 6px 12px; border-top: 1px solid var(--line); font-size: 12px; color: var(--text-2); border-radius: 0 0 12px 12px; background: var(--surface-2); }
.foot .e, .foot .w { display: flex; align-items: center; gap: 5px; }
.foot .e > svg.i { color: var(--critical); }
.foot .w > svg.i { color: var(--warn-text); }
.foot .hint { margin-left: auto; color: var(--text-3); }
.foot kbd, .card kbd, td kbd { display: inline-grid; min-width: 18px; height: 18px; padding: 0 4px; place-items: center; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text-2); }
.card { position: absolute; z-index: 3; width: max-content; max-width: 420px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-2); box-shadow: var(--shadow-panel); font-size: 12.5px; line-height: 18px; }
.card .hd { display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px 0; }
.card .hd > svg.i { flex: none; margin-top: 1px; }
.card .hd.e > svg.i { color: var(--critical); }
.card .hd.w > svg.i { color: var(--warn-text); }
.card .hd b { font-weight: 600; }
.card .path { padding: 2px 12px 0; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); overflow-wrap: anywhere; }
.card .ty { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 12px 0; font-size: 12px; color: var(--text-2); }
.card .ty code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.card .tag { padding: 0 6px; border-radius: 999px; background: var(--surface-3); font-size: 11px; line-height: 18px; color: var(--text-1); }
.card .desc { max-height: 216px; overflow: hidden; padding: 6px 12px 10px; color: var(--text-1); white-space: pre-wrap; }
.card .desc.fade { -webkit-mask-image: linear-gradient(#000 80%, transparent); }
.card .more { padding: 0 12px 10px; font-size: 11.5px; color: var(--text-3); }
.card .msg { padding: 2px 12px 10px 32px; color: var(--text-1); }
.card .from { padding: 0 12px 10px 32px; font-size: 11.5px; color: var(--text-3); }
.ac { position: absolute; z-index: 3; display: flex; align-items: flex-start; gap: 6px; }
.ac .list { width: 340px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-2); box-shadow: var(--shadow-panel); padding: 4px; }
.ac .it { display: flex; height: 28px; min-width: 0; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; font-size: 12.5px; }
.ac .it.on { background: var(--accent-soft); }
.ac .it .nm { min-width: 0; flex: 1; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.ac .it .nm b { font-weight: 700; color: var(--accent-strong); }
.ac .it .ty { flex: none; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-3); }
.ac .it .req { flex: none; padding: 0 5px; border-radius: 999px; background: var(--surface-3); font-size: 10.5px; line-height: 16px; color: var(--text-1); }
.ac .it .dflt { flex: none; font-size: 11px; color: var(--text-3); }
.ac .it .had { flex: none; font-size: 11px; color: var(--text-3); }
.ac .card { position: static; width: 300px; }
.ac .foot2 { display: flex; gap: 12px; padding: 6px 8px 2px; border-top: 1px solid var(--line); margin-top: 4px; font-size: 11px; color: var(--text-3); }
.panel { border-top: 1px solid var(--line); background: var(--surface-2); font-size: 12.5px; }
.panel .ph { display: flex; align-items: center; height: 30px; padding: 0 12px; border-bottom: 1px solid var(--line); font-weight: 600; font-size: 12px; }
.panel .ph span { margin-left: auto; color: var(--text-3); font-weight: 400; }
.panel .pr { display: flex; align-items: flex-start; gap: 8px; padding: 5px 12px; }
.panel .pr.on { background: var(--accent-soft); }
.panel .pr > svg.i { flex: none; margin-top: 2px; }
.panel .pr.e > svg.i { color: var(--critical); }
.panel .pr.w > svg.i { color: var(--warn-text); }
.panel .pr .at { flex: none; width: 52px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); }
.panel .pr .m { min-width: 0; flex: 1; }
.panel .pr .m code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
table.t { border-collapse: collapse; font-size: 12.5px; line-height: 18px; }
table.t th { padding: 6px 16px 6px 0; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-align: left; text-transform: uppercase; color: var(--text-3); }
table.t td { padding: 7px 16px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
table.t td:first-child { color: var(--text-1); font-weight: 500; white-space: nowrap; }
`

type Line = { no: number; t: string; g?: 'e' | 'w'; act?: boolean }

const line = ({ no, t, g, act }: Line) =>
  `<div class="ln${act ? ' act' : ''}"><span class="g ${g ?? ''}">${g === 'e' ? icon('circle-x', 12) : g === 'w' ? icon('triangle-alert', 12) : ''}</span><span class="no">${no}</span><span class="t">${t}</span></div>`

const k = (s: string) => `<span class="k">${s}</span>`
const p = (s: string) => `<span class="p">${s}</span>`
const s = (x: string) => `<span class="s">${x}</span>`
const n = (x: string) => `<span class="n">${x}</span>`

const DOC: Line[] = [
  { no: 1, t: `${k('apiVersion')}${p(':')} ${s('apps/v1')}` },
  { no: 2, t: `${k('kind')}${p(':')} ${s('Deployment')}` },
  { no: 3, t: `${k('metadata')}${p(':')}` },
  { no: 4, t: `  ${k('name')}${p(':')} ${s('storefront')}` },
  { no: 5, t: `  ${k('namespace')}${p(':')} ${s('shop')}` },
  { no: 6, t: `${k('spec')}${p(':')}` },
  { no: 7, t: `  ${k('replicas')}${p(':')} <span class="err">${s('three')}</span>`, g: 'e' },
  { no: 8, t: `  ${k('selector')}${p(':')}` },
  { no: 9, t: `    ${k('matchLabels')}${p(':')}` },
  { no: 10, t: `      ${k('app')}${p(':')} ${s('storefront')}` },
  { no: 11, t: `  ${k('template')}${p(':')}` },
  { no: 12, t: `    ${k('spec')}${p(':')}` },
  { no: 13, t: `      ${k('containers')}${p(':')}` },
  { no: 14, t: `        ${p('-')} ${k('name')}${p(':')} ${s('web')}` },
  { no: 15, t: `          ${k('image')}${p(':')} ${s('ghcr.io/shop/storefront:4f1c9aa')}` },
  {
    no: 16,
    t: `          <span class="wrn">${k('imagePulPolicy')}</span>${p(':')} ${s('Always')}`,
    g: 'w',
  },
  { no: 17, t: `          ${k('ports')}${p(':')}` },
  { no: 18, t: `            ${p('-')} ${k('containerPort')}${p(':')} ${n('8080')}` },
]

const editor = (lines: Line[], extra = '', foot = true, panel = '') =>
  `<div class="ed"><div class="code">${lines.map(line).join('')}</div>${extra}${panel}${foot ? `<div class="foot"><span class="e">${icon('circle-x', 13)}1 error</span><span class="w">${icon('triangle-alert', 13)}1 warning</span><span class="hint"><kbd>F8</kbd> next · <kbd>⌥F8</kbd> all</span></div>` : ''}</div>`

function errors(): string {
  const errTip = `<div class="card" style="left:150px;top:166px"><div class="hd e">${icon('circle-x', 14)}<span><b>Error</b>: a whole number goes here, not text.</span></div><div class="msg" style="padding-top:2px"><span class="path" style="padding:0;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--text-3)">spec.replicas · integer</span></div><div class="from">The cluster would refuse it.</div></div>`
  const wrnTip = `<div class="card" style="left:120px;top:370px;max-width:440px"><div class="hd w">${icon('triangle-alert', 14)}<span><b>Warning</b>: a container has no field “imagePulPolicy”. Did you mean imagePullPolicy?</span></div><div class="from">The cluster would drop it without saying so.</div></div>`
  const panel = `<div class="panel"><div class="ph">Problems<span>2 · ⌥F8 closes</span></div><div class="pr e on">${icon('circle-x', 13)}<span class="at">7:13</span><span class="m">A whole number goes here, not text. <code>spec.replicas</code></span></div><div class="pr w">${icon('triangle-alert', 13)}<span class="at">16:11</span><span class="m">A container has no field “imagePulPolicy”. Did you mean imagePullPolicy? <code>spec.template.spec.containers[0]</code></span></div></div>`
  return `<section class="spec"><h2>What’s wrong<i>underlined where it is, a mark in the gutter, a count under the editor</i></h2>
    <div class="row">
      <div style="width:620px"><p class="cap">An error and a warning, the pointer on the error</p>${editor(DOC, errTip)}</div>
      <div style="width:620px"><p class="cap">The pointer on the warning</p>${editor(DOC, wrnTip)}</div>
      <div style="width:620px"><p class="cap">All of them: ⌥F8, or the count, opens the list under the editor, the editor’s own panel</p>${editor(DOC.slice(0, 8), '', true, panel)}</div>
    </div>
    <p><b>Two kinds, told apart by shape and icon as well as colour.</b> <b>An error</b> is what the cluster would refuse: YAML that doesn’t parse, the wrong type (text where a number goes, a list where an object goes), a required field missing, an enum value it doesn’t list. It’s underlined with a critical wave, and the gutter has a circled ×. <b>A warning</b> is what the cluster would take but not as meant: a field it doesn’t know, which it drops without a word, with “Did you mean …” when a known field is one or two letters away. It’s underlined with a dashed amber line, and the gutter has the triangle. A CRD that keeps unknown fields gets no warnings for them. <b>The underline is under what’s wrong</b>: a value under its value, an unknown field under its key, a missing field under the key of the object that lacks it. They come <b>0.5 s after typing stops</b>, never mid-word, and go as soon as it’s put right. The check runs in a worker, so a long document (a big ConfigMap, a CRD’s own YAML) never holds typing up; its marks just come a little later.</p>
    <p><b>Under the pointer</b>, a card: the icon and “Error” or “Warning” in words, then what’s wrong in one sentence, the field’s path and type in mono, and what the cluster would do. <b>Under the editor</b>, a quiet count, “1 error · 1 warning”, with the keys; with none, the line isn’t there. Pressing the count opens <b>the list</b>, the editor’s own panel, as search’s is: each problem with its line and column, the sentence and the path; ↑↓ move, Enter goes to it. <b>Nothing here stops Save or Create</b>: the dry run is still what decides, and the editor only says sooner what it will say.</p>
  </section>`
}

function hover(): string {
  const desc =
    'Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. Cannot be updated. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images'
  const card1 = `<div class="card" style="position:static;width:420px"><div class="path">spec.template.spec.containers[].imagePullPolicy</div><div class="ty"><code>string</code><span>one of</span><code>Always</code><code>IfNotPresent</code><code>Never</code></div><div class="desc">${desc}</div></div>`
  const long = Array.from(
    { length: 4 },
    () =>
      'NodePool is the Schema for the NodePools API. Disruption contains the parameters that relate to Karpenter’s disruption logic, including consolidation, budgets and how long a node may live before it is replaced. Budgets are a list of Budget, each of which limits how many nodes may be disrupted at once.',
  ).join(' ')
  const card2 = `<div class="card" style="position:static;width:420px"><div class="path">spec.disruption</div><div class="ty"><code>object</code><span class="tag">required</span></div><div class="desc fade">${long}</div><div class="more">Scroll for the rest · from the CRD nodepools.karpenter.sh</div></div>`
  const card3 = `<div class="card" style="position:static;width:420px"><div class="path">spec.replicas</div><div class="ty"><code>integer</code><span>default</span><code>1</code></div><div class="desc">Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.</div></div>`
  return `<section class="spec"><h2>A field’s description<i>under the pointer, as the cluster wrote it</i></h2>
    <div class="row">
      <div><p class="cap">A field with values to choose from</p>${card1}</div>
      <div><p class="cap">A long description, from a CRD: its widest and tallest</p>${card2}</div>
      <div><p class="cap">A default</p>${card3}</div>
    </div>
    <p><b>The pointer resting on a key</b> for the app’s tooltip wait shows a card under the line. It holds the field’s path in mono, quiet; then the type in mono, with “required”, “one of” and its values, or “default” and its value; then the description. <b>The description is the cluster’s text, drawn plainly</b>: as written, wrapping, with no markdown and no links (an address stays text and can be selected), and characters that would turn text round or can’t be seen shown as marks, by the kit’s own rule for a text that isn’t Lumovi’s (<code>inPieces</code>), not the older one. <b>At most 420 px wide and 216 px of description</b> (twelve lines). Past that it fades and scrolls inside the card, which stays while the pointer is on it. A CRD’s field says which CRD under it. With nothing written, there’s no description, only the path and type. The card is never over the line under the pointer, and goes when the pointer leaves both.</p>
  </section>`
}

function complete(): string {
  const lines: Line[] = [
    { no: 13, t: `      ${k('containers')}${p(':')}` },
    { no: 14, t: `        ${p('-')} ${k('name')}${p(':')} ${s('web')}` },
    { no: 15, t: `          ${k('image')}${p(':')} ${s('ghcr.io/shop/storefront:4f1c9aa')}` },
    { no: 16, t: `          ${k('re')}<span class="caret"></span>`, act: true },
    { no: 17, t: `` },
    { no: 18, t: `` },
    { no: 19, t: `` },
    { no: 20, t: `` },
    { no: 21, t: `` },
    { no: 22, t: `` },
    { no: 23, t: `` },
    { no: 24, t: `` },
    { no: 25, t: `` },
  ]
  const it = (
    nm: string,
    ty: string,
    o: { on?: boolean; req?: boolean; had?: boolean; dflt?: boolean } = {},
  ) =>
    `<div class="it${o.on ? ' on' : ''}"><span class="nm">${nm}</span>${o.req ? '<span class="req">required</span>' : ''}${o.dflt ? '<span class="dflt">default</span>' : ''}${o.had ? '<span class="had">already set</span>' : ''}<span class="ty">${ty}</span></div>`
  const info = `<div class="card"><div class="path">containers[].readinessProbe</div><div class="ty"><code>object</code></div><div class="desc">Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. Cannot be updated.</div></div>`
  const fields = `<div class="ac" style="left:140px;top:${12 + 4 * 20.4}px"><div class="list">${it('<b>re</b>adinessProbe', 'object', { on: true })}${it('<b>re</b>sizePolicy', 'list')}${it('<b>re</b>sources', 'object')}${it('<b>re</b>startPolicy', 'string')}${it('<b>re</b>adinessGates', 'list')}<div class="foot2"><span>↵ or tab to take</span><span>esc to close</span></div></div>${info}</div>`
  const vals: Line[] = [
    { no: 15, t: `          ${k('image')}${p(':')} ${s('ghcr.io/shop/storefront:4f1c9aa')}` },
    {
      no: 16,
      t: `          ${k('imagePullPolicy')}${p(':')} <span class="caret"></span>`,
      act: true,
    },
    { no: 17, t: `` },
    { no: 18, t: `` },
    { no: 19, t: `` },
    { no: 20, t: `` },
  ]
  const values = `<div class="ac" style="left:230px;top:${12 + 2 * 20.4}px"><div class="list" style="width:220px">${it('Always', '', { on: true })}${it('IfNotPresent', '', { dflt: true })}${it('Never', '')}</div></div>`
  const wide = `<div class="list" style="width:340px">${it('schedulerName', 'string', { had: true })}${it('securityContext', 'object', { on: true })}${it('serviceAccountName', 'string')}${it('setHostnameAsFQDN', 'boolean')}${it('shareProcessNamespace', 'boolean')}${it('subdomain', 'string')}${it('terminationGracePeriodSeconds', 'integer')}${it('topologySpreadConstraints', 'list')}<div class="foot2"><span>8 of 34 · ↑↓ for more</span></div></div>`
  return `<section class="spec"><h2>Completion<i>the fields the object can have where the caret is; a field’s values after its colon</i></h2>
    <div class="row">
      <div style="width:820px"><p class="cap">Fields, “re” typed: the description of the selected one beside the list</p>${editor(lines, fields, false)}</div>
      <div style="width:520px"><p class="cap">After “imagePullPolicy: ”, its values</p>${editor(vals, values, false)}</div>
      <div><p class="cap">Opened by ⌃Space with nothing typed: its widest, and its tallest, eight rows, then it scrolls</p><div class="ac" style="position:static">${wide}</div></div>
    </div>
    <p><b>Opened by typing</b> at the start of a key in a mapping, or by <kbd>⌃Space</kbd> anywhere. <b>A row</b> holds the name in mono, the typed part in bold in the key colour, then “required” as a quiet pill where it is, then the type at the right in mono and quiet: <code>string</code>, <code>integer</code>, <code>boolean</code>, <code>object</code>, <code>list</code>, <code>map</code>. Required fields come first, then the rest in name order. A field already set in this object stays in the list, quieter, with “already set”, and taking it goes to it. <b>The selected row</b> has the accent’s soft fill, and its description stands beside the list in the hover card’s form, 300 px wide. <b>After a key’s colon</b> the list is its values, an enum’s, or <code>true</code>/<code>false</code>, with the default marked “default”. <b>At most 340 px wide and eight rows</b>; a long name is end-cut. Taking a field writes <code>name: </code>, and for an object or a list goes on to the next line, indented, for the value. Nothing is taken without a key or a click.</p>
  </section>`
}

function keys(): string {
  return `<section class="spec"><h2>Keys<i>in the editor</i></h2>
    <table class="t">
      <tr><th>Keys</th><th>Does</th></tr>
      <tr><td><kbd>⌃Space</kbd> or <kbd>⌥Esc</kbd></td><td>opens completion where the caret is. On a Mac with more than one input source ⌃Space switches the source and never reaches the editor; ⌥Esc, and typing, still open it</td></tr>
      <tr><td><kbd>↑</kbd> <kbd>↓</kbd>, <kbd>↵</kbd> or <kbd>tab</kbd>, <kbd>esc</kbd></td><td>in the list: move, take, close. Tab takes only while the list is open; otherwise it indents, as today</td></tr>
      <tr><td><kbd>F8</kbd>, <kbd>⇧F8</kbd></td><td>the caret to the next or previous problem, and its card shown there</td></tr>
      <tr><td><kbd>⌥F8</kbd> (<kbd>Alt+F8</kbd>)</td><td>opens or closes the list of problems under the editor</td></tr>
      <tr><td><kbd>⌥F1</kbd> (<kbd>Alt+F1</kbd>)</td><td>the description of the field at the caret, as under the pointer; esc closes it</td></tr>
    </table>
    <p>F8 and the problems list are the lint package’s, as app-2 proposes (if the PM lets it in). ⌥F1 gives the keyboard what hovering gives the pointer. The keys are ones browsers leave alone with an editor focused (⌘⇧M and ⌘I are Chrome’s and Firefox’s), so they hold in a browser as in the app; the count under the editor names F8 and ⌥F8 and is itself pressable, so nobody has to know them first. Where they don’t reach: on a Mac laptop F1 and F8 need Fn held; on Linux, GNOME takes Alt+F1 and Alt+F8 and KDE Alt+F1 before any app sees them. Alt+Esc is taken by Windows and GNOME, so ⌥Esc opens completion on a Mac only; ⌃Space works elsewhere unless an input method uses it, and typing at a key’s start opens it everywhere. There the pressable count, F8 with Fn, and hovering are the way in. ⌘F, ⌘S and Tab keep their meanings.</p>
  </section>`
}

export type YamlSchemaFrame = 'yaml'

export const YAML_SCHEMA_FRAMES: { id: YamlSchemaFrame; title: string; size: Size }[] = [
  { id: 'yaml', title: 'The YAML editor knows the schema', size: { width: 1440, height: 2400 } },
]

/** The frame, in one theme. */
export function yamlSchemaFrame(_id: YamlSchemaFrame, scheme: Scheme): string {
  const f = YAML_SCHEMA_FRAMES[0]!
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet"><header><h1>The YAML editor knows the schema</h1><p>Edit YAML, Create’s YAML and the create form’s YAML side learn the cluster’s schema: what’s wrong is underlined before the dry run, a field’s description is under the pointer, and the fields an object can have are offered as they’re typed. Desktop only: a phone reads YAML and doesn’t edit it.</p></header>${errors()}${hover()}${complete()}${keys()}</div>`
}
