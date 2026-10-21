/**
 * The new lumovi.dev (LMV-376, part of LMV-375): three versions of the home page around one
 * problem, secure and audited AI agent work on clusters through Lumovi. Each has its own angle and
 * its own structure: A tells one change from start to finish, B puts the proof first, C is hands
 * on. The copy is marketing's (Lumovi-marketing plan/website-v4.md, 142fc6e, LMV-377). Today's
 * scenes are captures of lumovi.dev (2026-10-21, in ~/Lumovi/.review/lmv-376/today), reused as
 * they are: the dashboard's story moves to a page of its own, /dashboard, scenes and films with it.
 */
import { existsSync, readFileSync } from 'node:fs'
import { type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'

type Version = 'a' | 'b' | 'c'
type Dev = 'desk' | 'phone'

const REVIEW = new URL('../../.review/lmv-376/', import.meta.url)
const png = (url: URL) => `data:image/png;base64,${readFileSync(url).toString('base64')}`
/** A capture of today's lumovi.dev: a scene's stage, or a whole section. */
const cap = (name: string, dev: Dev, scheme: Scheme) =>
  png(new URL(`today/${name}-${dev}-${scheme}.png`, REVIEW))
const MARK = `data:image/svg+xml;base64,${readFileSync(new URL('../../Lumovi-website/public/favicon.svg', import.meta.url)).toString('base64')}`

const TOKENS: Record<Scheme, string> = {
  light: `--bg:#f5f5f5;--surface:#fff;--surface-2:#fafafa;--surface-3:#f0f0f0;--line:rgb(0 0 0/.08);--line-strong:rgb(0 0 0/.14);--text-1:#0a0a0a;--text-2:#525252;--text-3:#6b6b6b;--dim:#737373;--accent:#2675d3;--accent-strong:#1c5cab;--accent-soft:rgb(38 117 211/.1);--good:#009e00;--good-text:#00732b;--good-soft:rgb(0 158 0/.08);--warn-text:#8a5a00;--warn-soft:rgb(250 178 25/.14);--critical:#d03b3b;--critical-text:#b42318;--code-bg:#fbfbfb;--diff-add:#116329;--diff-add-bg:rgb(26 127 55/.1);--diff-del:#a40e26;--diff-del-bg:rgb(207 34 46/.08);--glow:radial-gradient(60% 80% at 60% 40%,#fff,transparent 60%);--pop:0 16px 48px -8px rgb(0 0 0/.14),0 0 0 1px rgb(0 0 0/.06);--panel:0 0 0 1px rgb(0 0 0/.06),0 8px 24px -12px rgb(0 0 0/.12);--gut:#e8e8e6;--note:#b45309;--note-soft:rgb(180 83 9/.1);--keep:#00732b;--move:#1c5cab;--gone:#737373;--new:#7c3aed;`,
  dark: `--bg:#0a0a0a;--surface:#121212;--surface-2:#181818;--surface-3:#212121;--line:rgb(255 255 255/.07);--line-strong:rgb(255 255 255/.12);--text-1:#ededed;--text-2:#a3a3a3;--text-3:#8f8f8f;--dim:#8f8f8f;--accent:#2675d3;--accent-strong:#5ea2f0;--accent-soft:rgb(57 135 229/.16);--good:#009e00;--good-text:#3fb950;--good-soft:rgb(63 185 80/.1);--warn-text:#e3a008;--warn-soft:rgb(250 178 25/.12);--critical:#d03b3b;--critical-text:#fc554c;--code-bg:#0e0e0e;--diff-add:#7ee08a;--diff-add-bg:rgb(63 185 80/.12);--diff-del:#ff8f88;--diff-del-bg:rgb(248 81 73/.12);--glow:radial-gradient(60% 80% at 60% 40%,#1d1d1d,transparent 60%);--pop:0 16px 48px -8px rgb(0 0 0/.7),0 0 0 1px rgb(255 255 255/.08);--panel:0 0 0 1px rgb(255 255 255/.06),0 8px 24px -12px rgb(0 0 0/.6);--gut:#151515;--note:#fb923c;--note-soft:rgb(251 146 60/.12);--keep:#3fb950;--move:#5ea2f0;--gone:#8f8f8f;--new:#a78bfa;`,
}

const CSS = `
* { box-sizing: border-box; }
body { margin: 0; background: var(--gut); font-family: 'Inter', sans-serif; color: var(--text-1); -webkit-font-smoothing: antialiased; font-feature-settings: 'cv11', 'ss01'; }
svg.i { display: block; flex: none; }
code, .mono { font-family: 'JetBrains Mono', monospace; }
.frame { display: grid; }
.sec { position: relative; }
.gut { padding: 28px 24px 0 28px; font-size: 13px; line-height: 19px; color: var(--text-2); border-top: 1px dashed var(--line-strong); }
.gut b { display: block; color: var(--text-1); font-size: 14px; margin-bottom: 4px; }
.gut .tag { display: inline-block; margin: 6px 6px 0 0; padding: 1px 7px; border-radius: 99px; font-size: 11.5px; font-weight: 600; letter-spacing: .02em; }
.tag.keep { color: var(--keep); background: color-mix(in srgb, var(--keep) 12%, transparent); }
.tag.move { color: var(--move); background: color-mix(in srgb, var(--move) 12%, transparent); }
.tag.gone { color: var(--gone); background: color-mix(in srgb, var(--gone) 14%, transparent); }
.tag.new { color: var(--new); background: color-mix(in srgb, var(--new) 12%, transparent); }
.tag.flag { color: var(--note); background: var(--note-soft); }
.page { background: var(--bg); overflow: hidden; border-top: 1px dashed var(--line-strong); }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 40px; }
.phone .wrap { padding: 0 16px; }
.pad { padding: 112px 0; }
.phone .pad { padding: 64px 0; }
.nav { height: 64px; display: flex; align-items: center; gap: 28px; font-size: 14px; color: var(--text-2); }
.nav .brand { display: flex; align-items: center; gap: 8px; font-weight: 650; font-size: 17px; color: var(--text-1); letter-spacing: -.01em; margin-right: auto; }
.nav .brand img { width: 22px; height: 22px; }
.nav .gh { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 9px; box-shadow: inset 0 0 0 1px var(--line-strong); color: var(--text-1); }
.phone .nav { gap: 12px; }
.eyebrow { font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); margin: 0 0 18px; }
h1, .h1 { margin: 0; font-size: 76px; line-height: 1; font-weight: 650; letter-spacing: -.05em; }
.phone h1 { font-size: 44px; }
h2, .h2 { margin: 0; font-size: 56px; line-height: 1.02; font-weight: 650; letter-spacing: -.045em; }
.phone h2 { font-size: 34px; }
.dim { color: var(--dim); }
h1 .dim { display: block; }
.lead { margin: 24px 0 0; font-size: 20px; line-height: 1.5; color: var(--text-2); max-width: 34em; }
.phone .lead { font-size: 17px; }
.body { margin: 20px 0 0; font-size: 16px; line-height: 1.6; color: var(--text-2); max-width: 36em; }
.btn { display: inline-flex; align-items: center; gap: 9px; height: 44px; padding: 0 18px; border-radius: 11px; font-size: 15px; font-weight: 550; white-space: nowrap; }
.btn.pri { background: var(--accent); color: #fff; box-shadow: inset 0 1px 0 rgb(255 255 255/.18), 0 8px 24px -8px color-mix(in srgb, var(--accent) 60%, transparent); }
.btn.sec { background: var(--surface-2); color: var(--text-1); box-shadow: inset 0 0 0 1px var(--line-strong); }
.btn small { font-size: 11.5px; padding: 1px 6px; border-radius: 6px; background: rgb(255 255 255/.18); }
.ctas { display: flex; gap: 14px; margin-top: 36px; flex-wrap: wrap; }
.cta { display: flex; flex-direction: column; gap: 8px; }
.cta > span { font-size: 13px; color: var(--text-3); padding-left: 2px; }
.phone .ctas { flex-direction: column; } .phone .cta .btn { justify-content: center; }
.release { display: inline-flex; align-items: center; gap: 8px; padding: 4px 10px 4px 4px; border-radius: 99px; font-size: 13px; color: var(--text-2); box-shadow: inset 0 0 0 1px var(--line); margin-bottom: 28px; }
.release i { font-style: normal; display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 99px; background: var(--good-soft); color: var(--good-text); font-weight: 550; font-size: 12px; }
.card { background: var(--surface); border-radius: 16px; box-shadow: var(--panel); }
.pop { background: var(--surface); border-radius: 14px; box-shadow: var(--pop); }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.phone .grid2 { grid-template-columns: 1fr; gap: 36px; }
.cols { display: grid; gap: 20px; }
.phone .cols { grid-template-columns: 1fr !important; }
.pt { display: flex; gap: 12px; font-size: 15px; line-height: 1.5; color: var(--text-2); }
.pt b { display: block; color: var(--text-1); font-weight: 600; margin-bottom: 2px; }
.pt svg { margin-top: 3px; }
.ok { color: var(--good-text); } .no { color: var(--text-3); } .ac { color: var(--accent-strong); } .bad { color: var(--critical-text); }
.link { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 500; color: var(--accent-strong); }
.shot { display: block; width: 100%; height: auto; }
.shot.sc { -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, #000 72%, transparent 100%); }
.film-flag { position: absolute; left: 16px; top: 16px; z-index: 2; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--note); background: var(--surface); box-shadow: 0 0 0 1.5px var(--note); }
/* An app part, drawn as the app draws it */
.ui { font-size: 13px; line-height: 19px; color: var(--text-1); text-align: left; }
.ui .hd { display: flex; gap: 12px; padding: 16px 18px 12px; }
.ui .hd .ico { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: var(--accent-soft); color: var(--accent-strong); }
.ui .ask { font-size: 12px; color: var(--accent-strong); font-weight: 500; display: flex; align-items: center; gap: 4px; }
.ui .ttl { font-weight: 600; font-size: 15px; }
.ui .sub { font-size: 12px; color: var(--text-3); display: flex; gap: 6px; align-items: center; }
.ui .prod { font-size: 10.5px; font-weight: 650; letter-spacing: .04em; color: var(--critical-text); background: color-mix(in srgb, var(--critical) 12%, transparent); padding: 0 5px; border-radius: 4px; }
.ui .why { margin: 0 18px; padding: 10px 12px; border-radius: 8px; background: var(--accent-soft); border-left: 3px solid var(--accent); }
.ui .lbl { font-size: 10.5px; font-weight: 600; letter-spacing: .06em; color: var(--text-3); text-transform: uppercase; display: block; margin-bottom: 2px; }
.ui .acc { margin: 12px 18px 0; display: flex; justify-content: space-between; color: var(--text-2); font-size: 12.5px; }
.ui .diff { margin: 6px 18px 0; border-radius: 8px; box-shadow: inset 0 0 0 1px var(--line); background: var(--code-bg); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 19px; padding: 6px 0; overflow: hidden; }
.ui .diff div { padding: 0 12px; white-space: pre; overflow: hidden; text-overflow: ellipsis; }
.ui .diff .q { color: var(--text-3); }
.ui .diff .add { background: var(--diff-add-bg); color: var(--diff-add); }
.ui .cmd { margin: 10px 18px 0; padding: 8px 12px; border-radius: 8px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 18px; white-space: pre-wrap; }
.ui .ft { display: flex; align-items: center; gap: 8px; padding: 14px 18px 16px; color: var(--text-3); font-size: 12.5px; }
.ui .ft .sp { margin-right: auto; display: flex; gap: 5px; align-items: center; }
.ui .b { height: 30px; padding: 0 12px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 550; }
.ui .b.p { background: var(--accent); color: #fff; } .ui .b.s { color: var(--text-1); box-shadow: inset 0 0 0 1px var(--line-strong); background: var(--surface-2); }
.ui .kb { font-size: 10.5px; opacity: .8; }
.mk { position: absolute; width: 26px; height: 26px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 13px; font-weight: 650; display: grid; place-items: center; box-shadow: 0 0 0 4px var(--bg); }
/* The audit log */
.audit .top { display: flex; align-items: center; padding: 16px 18px 4px; }
.audit .top .t { margin-right: auto; } .audit .top .t b { font-size: 16px; display: block; } .audit .top .t span { color: var(--text-3); font-size: 12.5px; }
.audit .holds { margin: 10px 18px 6px; padding: 9px 12px; border-radius: 8px; background: var(--good-soft); color: var(--good-text); display: flex; gap: 8px; font-size: 12.5px; line-height: 18px; }
.audit .holds b { color: var(--good-text); }
.audit .row { display: grid; grid-template-columns: 62px 22px 1fr; gap: 8px; padding: 9px 18px; border-top: 1px solid var(--line); align-items: start; }
.audit .row .tm { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-3); padding-top: 1px; }
.audit .row .w { color: var(--text-3); font-size: 12px; }
.audit .row.on { background: var(--surface-2); }
.audit dl { display: grid; grid-template-columns: 96px 1fr; gap: 3px 10px; margin: 8px 0 2px; font-size: 12px; }
.audit dt { color: var(--text-3); } .audit dd { margin: 0; } .audit dd code { font-size: 11px; }
.audit .chainft { display: flex; gap: 14px; padding: 10px 18px 14px; font-size: 11px; letter-spacing: .06em; font-weight: 600; color: var(--text-3); border-top: 1px solid var(--line); }
.audit .chainft span { display: flex; gap: 4px; align-items: center; color: var(--good-text); }
/* The conversation with an agent */
.chat { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 19px; }
.chat .top { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--line); font-family: 'Inter', sans-serif; font-size: 13px; }
.chat .top b { display: flex; gap: 6px; align-items: center; font-weight: 600; }
.chat .top b i { width: 7px; height: 7px; border-radius: 50%; background: var(--good); }
.chat .top span { color: var(--text-3); }
.chat .in { padding: 12px 16px 16px; display: grid; gap: 10px; }
.chat .you { color: var(--text-1); } .chat .you::before { content: '› '; color: var(--text-3); }
.chat .tool { color: var(--text-1); } .chat .tool::before { content: '● '; color: var(--good); }
.chat .res { color: var(--text-3); padding-left: 14px; }
.chat .say { font-family: 'Inter', sans-serif; font-size: 13.5px; line-height: 20px; color: var(--text-1); } .chat .say::before { content: '● '; color: var(--text-3); font-size: 10px; }
.chat .wait { color: var(--accent-strong); padding-left: 14px; }
/* Permissions, as the AI assistants page's rules */
.rules .r { display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 12px 18px; border-top: 1px solid var(--line); }
.rules .r:first-of-type { border-top: 0; }
.rules .r b { font-weight: 600; display: block; } .rules .r span { font-size: 12px; color: var(--text-3); }
.seg { display: inline-flex; padding: 2px; border-radius: 8px; background: var(--surface-3); font-size: 12px; }
.seg i { font-style: normal; padding: 3px 9px; border-radius: 6px; color: var(--text-3); white-space: nowrap; }
.seg i.on { background: var(--surface); color: var(--text-1); font-weight: 550; box-shadow: 0 1px 2px rgb(0 0 0/.12); }
.rules .h { padding: 14px 18px 8px; font-size: 11px; letter-spacing: .06em; font-weight: 600; color: var(--text-3); text-transform: uppercase; }
/* Steps, cards, lists */
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; margin-top: 56px; }
.phone .steps { grid-template-columns: 1fr; gap: 20px; margin-top: 32px; }
.step .n { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-weight: 650; font-size: 14px; background: var(--accent); color: #fff; margin-bottom: 14px; }
.step b { display: block; font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.step p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--text-2); }
.vs { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 48px; }
.phone .vs { grid-template-columns: 1fr; margin-top: 28px; }
.vs .card { padding: 26px 28px; }
.vs .card.them { background: transparent; box-shadow: inset 0 0 0 1px var(--line-strong); }
.vs h3 { margin: 0 0 18px; font-size: 15px; font-weight: 600; }
.vs ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.vs li { display: flex; gap: 10px; font-size: 16px; line-height: 1.45; }
.vs .them li { color: var(--text-2); }
.vs li svg { margin-top: 3px; }
.ctacards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 8px; }
.phone .ctacards { grid-template-columns: 1fr; margin-top: 28px; }
.ctacards .card { padding: 26px; display: flex; flex-direction: column; gap: 10px; }
.ctacards .card .ic { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; background: var(--surface-3); color: var(--text-1); margin-bottom: 6px; }
.ctacards .card b { font-size: 18px; font-weight: 600; }
.ctacards .card p { margin: 0 0 8px; font-size: 15px; line-height: 1.5; color: var(--text-2); flex: 1; }
.ctacards .card.first { box-shadow: 0 0 0 1.5px var(--accent), var(--panel); }
.faq { display: grid; grid-template-columns: 1fr 1fr; gap: 36px 56px; margin-top: 52px; }
.phone .faq { grid-template-columns: 1fr; gap: 26px; margin-top: 30px; }
.faq b { display: block; font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.faq p { margin: 0; font-size: 15px; line-height: 1.6; color: var(--text-2); }
.code { margin-top: 28px; padding: 16px 18px; border-radius: 12px; background: var(--code-bg); box-shadow: inset 0 0 0 1px var(--line-strong); font-family: 'JetBrains Mono', monospace; font-size: 14px; display: flex; align-items: center; gap: 12px; }
.code .p { color: var(--text-3); } .code .cp { margin-left: auto; color: var(--text-3); }
.band { border-top: 1px solid var(--line); }
.thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 36px; }
.phone .thumbs { grid-template-columns: 1fr 1fr; gap: 10px; }
.thumbs figure { margin: 0; } .thumbs .im { aspect-ratio: 4 / 3; border-radius: 12px; background-size: 112% auto; background-position: 50% 45%; background-repeat: no-repeat; box-shadow: inset 0 0 0 1px var(--line); }
.thumbs figcaption { margin-top: 8px; font-size: 13.5px; color: var(--text-2); }
.footer { padding: 48px 0 56px; border-top: 1px solid var(--line); font-size: 14px; color: var(--text-3); }
.footer .proof { font-size: 16px; color: var(--text-1); font-weight: 550; margin-bottom: 18px; }
.footer .lk { display: flex; gap: 22px; flex-wrap: wrap; }
.kept { position: relative; }
.kept img { display: block; width: 100%; }
.fade { position: relative; max-height: 560px; overflow: hidden; }
.phone .fade { max-height: 640px; }
.fade::after { content: ''; position: absolute; inset: auto 0 0 0; height: 220px; background: linear-gradient(transparent, var(--bg)); }
.fadenote { text-align: center; font-size: 13px; color: var(--note); margin: 0; padding: 8px 16px 72px; }
`

/* ——— Words: marketing's (plan/website-v4.md, 142fc6e) ——— */

const CTA = {
  download: ['Download', 'The desktop app, for macOS, Windows and Linux.', 'download'],
  cluster: [
    'Run in your cluster',
    'One Helm chart. Everyone signs in as themselves.',
    'ship-wheel',
  ],
  connect: ['Connect your agent', 'Turn it on, paste one line, ask what’s failing.', 'plug'],
} as const
type Cta = keyof typeof CTA
const PROOF = 'Free and open source (Apache 2.0). No telemetry, no account.'
const LINE = 'Lumovi is a Kubernetes dashboard with a built-in MCP server.'

/* ——— Parts ——— */

const i = (name: Parameters<typeof icon>[0], size = 16, cls = '') =>
  cls ? `<span class="${cls}">${icon(name, size)}</span>` : icon(name, size)

const nav = (links: string[], cta: string, phone: boolean) =>
  `<div class="wrap nav"><span class="brand"><img src="${MARK}">Lumovi</span>${phone ? i('menu', 20) : `${links.map((l) => `<span>${l}</span>`).join('')}<span class="gh">GitHub</span><span class="btn pri" style="height:34px;font-size:14px;padding:0 14px">${cta}</span>`}</div>`

const heading = (strong: string, dim = '', tag = 'h2') =>
  `<${tag}>${strong}${dim ? ` <span class="dim">${dim}</span>` : ''}</${tag}>`

const button = (c: Cta, primary: boolean, under?: string) =>
  `<div class="cta"><span class="btn ${primary ? 'pri' : 'sec'}">${icon(CTA[c][2], 16)}${CTA[c][0]}${c === 'download' && primary ? '<small>1.22.1</small>' : ''}</span>${under ? `<span>${under}</span>` : ''}</div>`

const release = `<span class="release"><i>${icon('circle-check', 12)}Running</i>Version 1.22.1 is out ${icon('arrow-right', 13)}</span>`

const ctaCards = (order: Cta[]) =>
  `<div class="ctacards">${order.map((c, n) => `<div class="card${n === 0 ? ' first' : ''}"><span class="ic">${icon(CTA[c][2], 20)}</span><b>${CTA[c][0]}</b><p>${CTA[c][1]}</p>${n === 0 ? `<span class="btn pri" style="align-self:flex-start">${CTA[c][0]}</span>` : `<span class="link">${CTA[c][0]} ${icon('arrow-right', 14)}</span>`}</div>`).join('')}</div>`

/** An agent's change, waiting: the app's approval, with its words. Restart, so the diff is the one annotation a restart adds. */
function approval(
  o: { marks?: boolean; width?: number; waits?: string; compact?: boolean } = {},
): string {
  const m = (n: number, style: string) =>
    o.marks ? `<span class="mk" style="${style}">${n}</span>` : ''
  return `<div class="pop ui" style="position:relative;width:${o.width ?? 460}px;max-width:100%">
${m(1, 'left:-13px;top:18px')}${m(2, 'left:-13px;top:184px')}${m(3, 'right:-13px;bottom:20px')}
<div class="hd"><span class="ico">${icon('rotate-cw', 17)}</span><div><span class="ask">${icon('sparkles', 12)}Your agent asks</span><div class="ttl">Restart Deployment worker</div><div class="sub">Deployment · batch · production <span class="prod">PRODUCTION</span></div></div></div>
<div class="why"><span class="lbl">Why</span>Its pods lost redis at 14:02 and never reconnected. A restart reconnects them.</div>
${
  o.compact
    ? ''
    : `<div class="acc"><span>The cluster accepts it</span><span><span class="ok">+1</span> −0 lines</span></div>
<div class="diff"><div class="q">  ⋯ 32 unchanged lines</div><div>    metadata:</div><div>      annotations:</div><div class="add">+       kubectl.kubernetes.io/restartedAt: "2026-10-21T14:31:07Z"</div><div class="q">  ⋯ 40 unchanged lines</div></div>`
}
<div class="cmd"><span class="lbl">Equivalent command</span>kubectl rollout restart deployment/worker -n batch --context production</div>
<div class="ft"><span class="sp">${icon('clock', 13)}Waits ${o.waits ?? '4:57'} more</span><span class="b s">Reject…</span><span class="b p">Approve <span class="kb">⌘↵</span></span></div></div>`
}

/** The audit log, an agent's change open: who, through what, approved by whom, and its place in the chain. */
function audit(o: { width?: number; short?: boolean } = {}): string {
  const row = (t: string, ic: Parameters<typeof icon>[0], what: string, who: string) =>
    `<div class="row"><span class="tm">${t}</span>${i(ic, 15, 'no')}<div>${what}<div class="w">${who}</div></div></div>`
  return `<div class="pop ui audit" style="width:${o.width ?? 500}px;max-width:100%">
<div class="top"><div class="t"><b>Audit log</b><span>What was done, by whom, and how it went.</span></div><span class="b s">${icon('shield-check', 14)}Check integrity</span></div>
<div class="holds">${icon('circle-check', 15)}<span><b>All 214 events hold.</b> Each, from the oldest kept, holds the hash of the one before it.</span></div>
<div class="row on"><span class="tm">14:31:22</span>${i('rotate-cw', 15, 'ac')}<div><b style="font-weight:600">Restarted Deployment worker</b><div class="w">dev@example.com, through an AI agent · production / batch</div>
<dl><dt>Asked by</dt><dd>An AI agent, over MCP, as dev@example.com</dd><dt>Approved by</dt><dd>dev@example.com, at 14:31:20</dd><dt>Why</dt><dd>Its pods lost redis at 14:02 and never reconnected.</dd>${o.short ? '' : '<dt>Does the same</dt><dd><code>kubectl rollout restart deployment/worker -n batch --context production</code></dd>'}<dt>In the log</dt><dd><code>Place 214 · hash 9f2c…e81a · after 41ab…07cd</code></dd></dl></div></div>
${row('14:30:58', 'scroll-text', 'Read the logs of worker-7d9f6-x2kqp', 'dev@example.com, through an AI agent · production / batch')}
${o.short ? '' : row('14:30:41', 'search', 'Asked what’s failing in production', 'dev@example.com, through an AI agent')}
${row('14:12:09', 'log-in', 'Signed in with single sign-on', 'dev@example.com')}
<div class="chainft"><span>${icon('check', 12)}RECORDED</span><span>${icon('check', 12)}CHAINED</span><span>${icon('check', 12)}CHECKED</span></div></div>`
}

/** C's conversation: marketing's four turns, true to the tools (find_problems, get_logs, then a restart that asks). */
const chat = (
  width = 470,
) => `<div class="pop chat" style="width:${width}px;max-width:100%"><div class="top"><b><i></i>Your agent</b><span>lumovi, over MCP</span></div><div class="in">
<div class="you">Anything wrong in production?</div>
<div class="tool">lumovi · find_problems</div><div class="res">└ worker · batch · 0 of 2 pods ready</div>
<div class="tool">lumovi · get_logs deployment/worker</div><div class="res">└ 14:02:11 lost connection to redis:6379</div>
<div class="say">One thing. Deployment worker, in batch: 0 of 2 pods ready. Their logs say they lost their connection to redis at 14:02, and never got it back.</div>
<div class="say">I’d restart worker, so its pods connect again. I’ve asked you in Lumovi.</div>
<div class="tool">lumovi · restart deployment/worker</div><div class="wait">└ Waiting for your approval in Lumovi…</div></div></div>`

/** The rules, as the AI assistants page's Permissions tab sets them: a few rules, and the defaults. */
const rules = (width = 500) => {
  const r = (name: string, where: string, seg: string[], on: number) =>
    `<div class="r"><div><b>${name}</b><span class="mono">${where}</span></div><span class="seg">${seg.map((s, n) => `<i${n === on ? ' class="on"' : ''}>${s}</i>`).join('')}</span></div>`
  return `<div class="pop ui rules" style="width:${width}px;max-width:100%"><div class="h">Rules</div>
${r('Staging', 'staging / all namespaces', ['Ask me', 'Without asking', 'Never'], 1)}
${r('Production', 'production / all namespaces', ['Ask me', 'Without asking', 'Never'], 0)}
${r('System', 'all contexts / kube-system', ['Visible', 'Hidden'], 1)}
<div class="h" style="border-top:1px solid var(--line)">Defaults</div>
${r('Secrets', 'What a Secret shows', ['Values', 'Keys only', 'Hidden'], 1)}
${r('Env values', 'In a workload’s spec', ['Show', 'Hide sensitive', 'Hide all'], 1)}
${r('Deletions', 'Wherever they may change', ['Always ask'], 0)}</div>`
}

/** A scene from today's site, as it is: its stage, framed by nothing. */
const scene = (name: string, dev: Dev, scheme: Scheme, style = '') =>
  `<img class="shot sc" style="${style}" src="${cap(name, dev, scheme)}">`

/** A section of today's site kept as it is, and Download's top, faded, as today's continues under the cards. */
const kept = (name: string, dev: Dev, scheme: Scheme) =>
  `<div class="kept"><img src="${cap(name, dev, scheme)}"></div>`
const downloadRest = (dev: Dev, scheme: Scheme) =>
  `<div class="fade"><img class="shot" src="${cap('sec-download', dev, scheme)}"></div><p class="fadenote">Today’s Download section goes on under the cards, as it is: every platform, and <code>#download</code> stays where the docs link to it.</p>`

/** The dashboard band (A8, B8): one line, and today's scenes, small, going to /dashboard. */
const band = (scheme: Scheme) =>
  `<section class="band pad"><div class="wrap">${heading('And a whole Kubernetes dashboard.')}<p class="body">Every cluster, what’s failing first, and its logs, map and history a click away.</p><div class="ctas" style="margin-top:22px;gap:24px"><span class="link">See the dashboard ${icon('arrow-right', 14)}</span><span class="link">Take the tour ${icon('arrow-right', 14)}</span></div><div class="thumbs">${(
    [
      ['clusters', 'All your clusters, checked first'],
      ['map', 'What it’s connected to'],
      ['rollback', 'Every change shows its kubectl'],
      ['capacity', 'Where your capacity goes'],
    ] as const
  )
    .map(
      ([n, t]) =>
        `<figure><div class="im" style="background-image:url(${cap(n, 'desk', scheme)})"></div><figcaption>${t}</figcaption></figure>`,
    )
    .join('')}</div></div></section>`

const footer = () =>
  `<footer class="footer"><div class="wrap"><div class="proof">${PROOF}</div><div class="lk"><span>Docs</span><span>GitHub</span><span>The dashboard</span><span>The tour</span><span>Brand</span><span>Privacy</span></div></div></footer>`

/* ——— The three versions: each a list of sections, with what the gutter says of each ——— */

interface Sec {
  id: string
  note: string
  tags: [kind: 'keep' | 'move' | 'gone' | 'new' | 'flag', text: string][]
  html: (dev: Dev, scheme: Scheme) => string
}

const ph = (dev: Dev) => dev === 'phone'

const A: Sec[] = [
  {
    id: 'A1 · Hero',
    note: 'The headline and CTAs centred, today’s hero cluster under them, an agent’s change waiting on it in place of Pod health.',
    tags: [
      ['keep', 'Hero cluster, reused'],
      ['new', 'The waiting change'],
    ],
    html: (d, s) =>
      `<section style="background:var(--glow)">${nav(['How it works', 'Your rules', 'Dashboard', 'Docs'], 'Download', ph(d))}<div class="wrap" style="text-align:${ph(d) ? 'left' : 'center'};padding-top:${ph(d) ? 40 : 88}px">${release}${heading('Let AI agents onto your clusters.', 'Keep the keys.', 'h1')}<p class="lead" style="${ph(d) ? '' : 'margin-left:auto;margin-right:auto'}">${LINE} Your agent acts as you, never past your access, and by default every change waits for your approval.</p><div class="ctas" style="justify-content:center">${button('download', true, 'For macOS, Windows and Linux.')}${button('cluster', false, 'One Helm chart, for your whole team.')}</div></div>
<div class="wrap" style="position:relative;margin-top:${ph(d) ? 24 : 8}px;padding-bottom:${ph(d) ? 40 : 96}px">${scene('hero', d, s, ph(d) ? 'height:230px;object-fit:cover;object-position:50% 38%' : 'width:880px;margin:0 0 0 40px')}<div style="${ph(d) ? 'margin-top:-40px;position:relative' : 'position:absolute;right:40px;top:120px'}">${approval({ width: ph(d) ? 358 : 440 })}</div></div></section>`,
  },
  {
    id: 'A2 · The problem',
    note: 'What handing an agent a kubeconfig means, against Lumovi, line for line.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap">${heading('A kubeconfig is all or nothing.', 'This isn’t.')}<div class="vs"><div class="card them"><h3>Your kubeconfig, handed to an agent</h3><ul>${['It can do everything you can.', 'It changes things the moment it decides.', 'You find out what it did afterwards.'].map((t) => `<li>${i('minus', 16, 'no')}${t}</li>`).join('')}</ul></div><div class="card"><h3>Your agent, through Lumovi</h3><ul>${['It acts as you, within rules you set.', 'By default, each change waits for your approval.', 'Each change is on the audit log, with its reason.'].map((t) => `<li>${i('check', 16, 'ok')}${t}</li>`).join('')}</ul></div></div></div></section>`,
  },
  {
    id: 'A3 · One change, start to finish',
    note: 'Four steps over one approval, numbered where each happens; the record’s place under it. Live, the steps light in turn as it scrolls.',
    tags: [
      ['keep', 'Approval, from today’s AI assistants section'],
      ['new', 'The steps'],
    ],
    html: (d) =>
      `<section class="pad band"><div class="wrap"><p class="eyebrow">How it works</p>${heading('One change,', 'start to finish.')}<div class="steps">${(
        [
          [
            'It asks',
            'Your agent asks to restart, scale, apply or delete, with its reason, in its own words.',
          ],
          [
            'The cluster checks it',
            'A dry run first. A change your access wouldn’t allow stops there.',
          ],
          [
            'You approve',
            'You see the diff, the reason and the kubectl command, then approve or reject it.',
          ],
          [
            'It’s on the record',
            'It’s made only if it still does what you saw, and goes on the audit log.',
          ],
        ] as const
      )
        .map(
          ([t, p], n) =>
            `<div class="step"><span class="n">${n + 1}</span><b>${t}</b><p>${p}</p></div>`,
        )
        .join(
          '',
        )}</div><div style="display:flex;gap:${ph(d) ? 20 : 40}px;margin-top:${ph(d) ? 36 : 64}px;align-items:flex-start;justify-content:center;flex-wrap:wrap">${approval({ marks: true, width: ph(d) ? 358 : 500 })}<div style="position:relative">${ph(d) ? '' : '<span class="mk" style="left:-13px;top:18px;z-index:2">4</span>'}${audit({ width: ph(d) ? 358 : 500, short: true })}</div></div></div></section>`,
  },
  {
    id: 'A4 · The film',
    note: 'The slot for “It asked first”. The film says “it’s an MCP server” and shows an assistant by name, so it needs a re-cut before it’s used: Péter’s call, with the videos question. Drawn here as a plain approval still.',
    tags: [
      ['keep', 'Film slot, reused'],
      ['flag', 'Film: needs a re-cut'],
    ],
    html: (d) =>
      `<section class="pad band"><div class="wrap"><div style="position:relative;max-width:960px;margin:0 auto;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,var(--surface-3),var(--bg));box-shadow:var(--panel);display:grid;place-items:center"><span class="film-flag">film: needs a re-cut (wording, product name)</span><div style="transform:scale(${ph(d) ? 0.62 : 0.82})">${approval({ width: 500 })}</div><div style="position:absolute;left:0;right:0;bottom:0;height:44px;background:linear-gradient(transparent,rgb(0 0 0/.55));display:flex;align-items:center;gap:12px;padding:0 16px;color:#fff;font-size:12px">${icon('play', 16)}<span>0:00</span><span style="flex:1;height:3px;border-radius:2px;background:rgb(255 255 255/.35)"></span><span>1:26</span></div></div><p style="max-width:960px;margin:14px auto 0;font-size:14px;color:var(--text-2)"><b style="color:var(--text-1)">It asked first</b> · An agent’s change, from its question to your approval.</p></div></section>`,
  },
  {
    id: 'A5 · Your rules',
    note: 'The words beside the rules as the Permissions tab sets them.',
    tags: [
      ['keep', 'From today’s AI assistants section'],
      ['new', 'Drawn smaller'],
    ],
    html: () =>
      `<section class="pad band"><div class="wrap grid2"><div><p class="eyebrow">Your rules</p>${heading('Your rules,', 'per cluster and namespace.')}<p class="body">Let staging change without asking, keep production at “ask me”, and hide kube-system altogether. Hide Secrets’ values, sensitive env values or logs. Deletions always ask, and read-only clusters stay read-only.</p><p style="margin-top:20px"><span class="link">What agents may do ${icon('arrow-up-right', 14)}</span></p></div><div style="display:flex;justify-content:center">${rules(520)}</div></div></section>`,
  },
  {
    id: 'A6 · Desktop or server',
    note: 'Two short columns, and today’s team scene as the server’s picture.',
    tags: [
      ['keep', 'Team scene, from “In your cluster”'],
      ['new', 'The columns'],
    ],
    html: (d, s) =>
      `<section class="pad band"><div class="wrap">${heading('On your desktop,', 'or your team’s server.')}<div class="grid2" style="margin-top:44px;align-items:start"><div class="cols" style="grid-template-columns:1fr 1fr"><div class="card" style="padding:24px"><div class="pt" style="margin-bottom:16px">${i('monitor', 18)}<b style="font-size:17px">On your desktop</b></div>${['Off until you turn it on.', 'Listens only on this computer, with a token.', 'Uses your kubeconfig, and your access.'].map((t) => `<div class="pt" style="margin-top:10px">${i('check', 15, 'ok')}<span>${t}</span></div>`).join('')}</div><div class="card" style="padding:24px"><div class="pt" style="margin-bottom:16px">${i('server', 18)}<b style="font-size:17px">In your cluster</b></div>${['Agents sign in through Lumovi, as the person.', 'Their changes wait on that person’s own Lumovi pages.', 'Admins set limits nobody’s own rules can loosen.'].map((t) => `<div class="pt" style="margin-top:10px">${i('check', 15, 'ok')}<span>${t}</span></div>`).join('')}</div></div><div>${scene('team', d, s)}</div></div></div></section>`,
  },
  {
    id: 'A7 · Get started',
    note: 'The three ways in, the first one filled, at the top of today’s Download, which goes on under them with its own heading.',
    tags: [
      ['new', 'The cards'],
      ['keep', 'Download, as it is'],
    ],
    html: (d, s) =>
      `<section class="pad band" style="padding-bottom:40px"><div class="wrap"><p class="eyebrow">Get started</p>${ctaCards(['download', 'cluster', 'connect'])}</div></section>${downloadRest(d, s)}`,
  },
  {
    id: 'A8 · The dashboard',
    note: 'One band for everything else Lumovi is: today’s scenes, small, each opening /dashboard where the scene is whole.',
    tags: [
      ['keep', 'Four scenes, small'],
      ['move', 'Their sections → /dashboard'],
    ],
    html: (_d, s) => band(s),
  },
]

const SPONSORS: Sec[] = [
  {
    id: 'Sponsors',
    note: 'Kept as it is, on the home page: a sponsor’s place there is what they pay for.',
    tags: [['keep', 'As it is']],
    html: (d, s) => kept('sec-sponsors', d, s),
  },
  {
    id: 'Sevalla',
    note: 'Kept as it is, for the same reason. Whether either moves is Péter’s call.',
    tags: [['keep', 'As it is']],
    html: (d, s) => kept('sec-sevalla', d, s),
  },
  {
    id: 'Footer',
    note: 'The proof line, shared by all three.',
    tags: [['new', 'Proof line']],
    html: () => footer(),
  },
]

const B: Sec[] = [
  {
    id: 'B1 · Hero',
    note: 'The headline across; under it, the words at the left and the record itself at the right: today’s team scene (who signs in, as whom), with the audit log over it, an agent’s change open.',
    tags: [
      ['keep', 'Team scene, reused'],
      ['new', 'The audit log over it'],
    ],
    html: (d, s) =>
      `<section style="background:var(--glow)">${nav(['Guarantees', 'Audit log', 'For teams', 'Dashboard', 'Docs'], 'Run in your cluster', ph(d))}<div class="wrap" style="padding-top:${ph(d) ? 40 : 80}px">${release}${heading('Every change an agent makes,', 'on the record.', 'h1')}</div><div class="wrap grid2" style="padding-bottom:${ph(d) ? 48 : 96}px;grid-template-columns:${ph(d) ? '1fr' : '0.8fr 1.2fr'};align-items:start"><div style="padding-top:${ph(d) ? 0 : 36}px"><p class="lead" style="margin-top:${ph(d) ? 20 : 0}px">${LINE} Agents act as the person, within your rules, and wait for approval, by default everywhere.</p><div class="ctas">${button('cluster', true, 'One Helm chart. Everyone signs in as themselves.')}${button('download', false, 'For macOS, Windows and Linux.')}</div></div><div style="position:relative;${ph(d) ? '' : 'min-height:820px'}">${scene('team', d, s, ph(d) ? '' : 'width:660px')}<div style="${ph(d) ? 'margin-top:-70px;position:relative' : 'position:absolute;right:-24px;top:300px'}">${audit({ width: ph(d) ? 358 : 470, short: ph(d) })}</div></div></div></section>`,
  },
  {
    id: 'B2 · Four guarantees',
    note: 'Each guarantee with how it’s kept, and the docs page that says so.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap"><p class="eyebrow">Four guarantees</p>${heading('What holds,', 'and how.')}<div class="cols" style="grid-template-columns:1fr 1fr;margin-top:48px">${(
        [
          [
            'user',
            'Never past their access',
            'An agent acts as the person who connected it. Their RBAC applies to every request.',
            'Each request reaches the API server as that person.',
            'Security',
          ],
          [
            'circle-check',
            'A person approves changes',
            'By default, every change waits for a person: the diff, the agent’s reason, the kubectl command.',
            'A dry run first; made only if it still does what you saw.',
            'Approvals',
          ],
          [
            'sliders-horizontal',
            'Rules you set',
            'Per cluster and namespace: what agents see, whether changes ask, and whether they read Secrets or logs.',
            'The strictest rule wins, setting by setting, within the administrator’s limits.',
            'Permissions',
          ],
          [
            'scroll-text',
            'A log you can check',
            'Every change, its approval and reason, and every tool an agent calls, each event chained to the last.',
            'Each event holds the one before’s SHA-256; check it with jq.',
            'Verify',
          ],
        ] as const
      )
        .map(
          ([ic, t, p, how, doc]) =>
            `<div class="card" style="padding:28px"><span style="display:grid;place-items:center;width:40px;height:40px;border-radius:11px;background:var(--surface-3);margin-bottom:18px">${icon(ic, 20)}</span><b style="font-size:19px;font-weight:600">${t}</b><p class="body" style="margin-top:8px;font-size:15.5px">${p}</p><p style="margin:16px 0 0;padding-top:14px;border-top:1px solid var(--line);font-size:14px;color:var(--text-2)"><b style="color:var(--text-1);font-weight:600">How:</b> ${how} <span class="link">${doc} ${icon('arrow-up-right', 13)}</span></p></div>`,
        )
        .join('')}</div></div></section>`,
  },
  {
    id: 'B3 · Never',
    note: 'The five things no rule can allow.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap grid2" style="align-items:start">${heading('What an agent', 'can never do.')}<div style="display:grid;gap:16px">${['Go past the RBAC of the person it acts for.', 'Change a read-only cluster, or where your rules say “Never”.', 'Delete without asking.', 'See what your rules hide: by default, Secrets’ values.', 'Open a shell or a port forward, or run Helm.'].map((t) => `<div class="pt" style="font-size:18px;color:var(--text-1)">${i('circle-x', 20, 'bad')}<span>${t}</span></div>`).join('')}</div></div></section>`,
  },
  {
    id: 'B4 · Check it yourself',
    note: 'The docs’ own command, and the chain drawn as the log keeps it: each event holding the hash of the one before.',
    tags: [['new', 'New']],
    html: (d) =>
      `<section class="pad band"><div class="wrap grid2">${'<div>'}<p class="eyebrow">The audit log</p>${heading('Check the log', 'yourself.')}<p class="body">Each audit event holds the hash of the one before it, so a changed, removed or inserted event shows. The Audit log page checks the chain for you. Keep the newest hash elsewhere, and a rewrite shows too. Or work out any event’s hash yourself:</p><div class="code"><span class="p">$</span><span>jq -jcS 'del(.hash)' | sha256sum</span><span class="cp">${icon('copy', 15)}</span></div><p style="margin-top:16px"><span class="link">Verify the audit log ${icon('arrow-up-right', 14)}</span></p></div><div style="display:grid;gap:0;justify-items:center">${(
        [
          ['212', 'Signed in with single sign-on', 'a91c…3f02', '77d0…b915'],
          ['213', 'Asked what’s failing in production', '41ab…07cd', 'a91c…3f02'],
          ['214', 'Restarted Deployment worker', '9f2c…e81a', '41ab…07cd'],
        ] as const
      )
        .map(
          ([n, t, h, p], k) =>
            `${k ? `<span style="height:26px;border-left:2px dashed var(--good);"></span>` : ''}<div class="pop ui" style="width:${ph(d) ? 358 : 460}px;padding:14px 18px;display:grid;grid-template-columns:auto 1fr;gap:4px 14px"><span class="mono" style="color:var(--text-3);font-size:12px">#${n}</span><b style="font-weight:600">${t}</b><span></span><span class="mono" style="font-size:11.5px;color:var(--text-2)">after <span style="color:var(--text-1)">${p}</span> · hash <span class="ok">${h}</span></span></div>`,
        )
        .join(
          '',
        )}<p style="margin:18px 0 0;font-size:13px;color:var(--good-text);display:flex;gap:6px;align-items:center">${icon('circle-check', 14)}All 214 events hold.</p></div></div></section>`,
  },
  {
    id: 'B5 · For your whole team',
    note: 'The server, in three points; the picture is the hero’s.',
    tags: [
      ['keep', 'From “In your cluster” and “Access and audit”'],
      ['new', 'Shorter'],
    ],
    html: () =>
      `<section class="pad band"><div class="wrap"><p class="eyebrow">In your cluster</p>${heading('For your whole team,', 'in your cluster.')}<p class="body">Install Lumovi from one Helm chart. People sign in with single sign-on, a proxy or tokens, and their agents sign in through Lumovi as them, with nothing to copy.</p><div class="cols" style="grid-template-columns:repeat(3,1fr);margin-top:44px">${(
        [
          [
            'users',
            'Less than RBAC, never more',
            'Admins give groups less than their RBAC allows, by cluster and namespace.',
          ],
          [
            'shield',
            'Limits on every agent',
            'Admins set limits on what agents may do that nobody’s own rules can loosen.',
          ],
          [
            'database',
            'One log for the team',
            'Kept on a volume in your cluster, and read by the auditors you name.',
          ],
        ] as const
      )
        .map(([ic, t, p]) => `<div class="pt">${i(ic, 18)}<span><b>${t}</b>${p}</span></div>`)
        .join('')}</div></div></section>`,
  },
  {
    id: 'B6 · Security review',
    note: 'The five questions, answered from the docs.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap">${heading('Questions your security review', 'will ask.')}<div class="faq">${(
        [
          [
            'Does anything go to an AI company?',
            'Lumovi has no AI of its own and needs no API key. Your agent sends what it reads to its own provider, so your rules can hide Secrets, env values, logs and namespaces from it.',
          ],
          [
            'What does Lumovi itself send out?',
            'Nothing about you or your clusters, anywhere you didn’t ask it to. No telemetry, no account. The docs list every connection it makes.',
          ],
          [
            'Does Lumovi need cluster-admin?',
            'No. With tokens, or single sign-on that passes people’s tokens on, its service account may do nothing. Otherwise it impersonates each person, and never Kubernetes’ own users or groups.',
          ],
          [
            'Is the audit log tamper-proof?',
            'No. It’s checkable: a changed, removed or inserted event shows. Keep the newest hash elsewhere, and a rewrite of the whole log shows too.',
          ],
          [
            'How do we verify what we install?',
            'The macOS app is signed and notarized, the Windows app signed. Each installer has signed build provenance and a bill of materials. The image and chart are signed too.',
          ],
        ] as const
      )
        .map(([q, a]) => `<div><b>${q}</b><p>${a}</p></div>`)
        .join('')}</div></div></section>`,
  },
  {
    id: 'B7 · Get started',
    note: 'The cluster first, for a team; today’s Download under the cards.',
    tags: [
      ['new', 'The cards'],
      ['keep', 'Download, as it is'],
    ],
    html: (d, s) =>
      `<section class="pad band" style="padding-bottom:40px"><div class="wrap"><p class="eyebrow">Get started</p>${ctaCards(['cluster', 'download', 'connect'])}</div></section>${downloadRest(d, s)}`,
  },
  {
    id: 'B8 · The dashboard',
    note: 'As A8.',
    tags: [
      ['keep', 'Four scenes, small'],
      ['move', 'Their sections → /dashboard'],
    ],
    html: (_d, s) => band(s),
  },
]

const C: Sec[] = [
  {
    id: 'C1 · Hero',
    note: 'The headline across; under it, the words at the left and at the right today’s hero cluster, the conversation over it, and its change waiting in Lumovi, as today’s AI assistants section pairs them.',
    tags: [
      ['keep', 'Hero cluster, reused'],
      ['keep', 'Conversation + approval, from AI assistants'],
    ],
    html: (d, s) =>
      `<section style="background:var(--glow)">${nav(['Connect', 'What it reads', 'Dashboard', 'Docs'], 'Download', ph(d))}<div class="wrap" style="padding-top:${ph(d) ? 40 : 80}px">${release}${heading('Your agent, on your clusters.', 'With you in charge.', 'h1')}</div><div class="wrap grid2" style="padding-bottom:${ph(d) ? 48 : 96}px;grid-template-columns:${ph(d) ? '1fr' : '0.8fr 1.2fr'};align-items:start"><div style="padding-top:${ph(d) ? 0 : 36}px"><p class="lead" style="margin-top:${ph(d) ? 20 : 0}px">${LINE} Connect your agent in a minute: it reads with your access, and by default asks first.</p><div class="ctas">${button('connect', true, 'Turn it on, paste one line, ask what’s failing.')}${button('download', false, 'For macOS, Windows and Linux.')}</div></div><div style="position:relative;${ph(d) ? '' : 'min-height:860px'}">${ph(d) ? `${chat(358)}<div style="margin-top:-8px">${scene('hero', d, s, 'height:230px;object-fit:cover;object-position:50% 38%')}</div><div style="margin-top:-60px;position:relative">${approval({ width: 358, compact: true, waits: '4:59' })}</div>` : `${scene('hero', d, s, 'position:absolute;right:-50px;top:-30px;width:720px')}<div style="position:absolute;left:-20px;top:290px">${chat(410)}</div><div style="position:absolute;right:-64px;top:520px">${approval({ width: 370, compact: true, waits: '4:59' })}</div>`}</div></div></section>`,
  },
  {
    id: 'C2 · Three steps',
    note: 'Big numbers; step 2 has the address with a copy button, its token noted under it.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap"><p class="eyebrow">Connect</p>${heading('Connect in a minute.')}<div class="cols" style="grid-template-columns:repeat(3,1fr);margin-top:48px;gap:24px">${(
        [
          [
            'Turn it on',
            'In Lumovi, open AI assistants and turn them on. They’re off until you do.',
            '',
          ],
          [
            'Paste one line',
            'Copy your agent’s line, with its token, into its settings:',
            `<div class="code" style="margin-top:16px;font-size:13px;padding:12px 14px">http://127.0.0.1:47830/mcp<span class="cp">${icon('copy', 14)}</span></div><p style="margin:10px 0 0;font-size:13px;color:var(--text-3)">With its token, as <code>Authorization: Bearer …</code>. The Connect tab has your agent’s exact line.</p>`,
          ],
          ['Ask', 'Ask what’s failing. It answers with Lumovi’s own reasons.', ''],
        ] as const
      )
        .map(
          ([t, p, x], n) =>
            `<div class="card" style="padding:28px"><div style="font-size:56px;font-weight:650;letter-spacing:-.04em;line-height:1;color:var(--accent-strong);margin-bottom:20px">${n + 1}</div><b style="font-size:19px;font-weight:600">${t}</b><p class="body" style="margin-top:8px;font-size:15.5px">${p}</p>${x}</div>`,
        )
        .join('')}</div></div></section>`,
  },
  {
    id: 'C3 · What it reads',
    note: 'Two lists side by side.',
    tags: [['new', 'New']],
    html: () =>
      `<section class="pad band"><div class="wrap">${heading('What it reads,', 'and what it can’t see.')}<p class="body">Your agent reads what you can, through Lumovi’s tools: nothing more. What it sees of that is up to your rules, and by default some of it stays hidden.</p><div class="vs"><div class="card"><h3>It reads</h3><ul>${['Your clusters, and their kinds', 'Objects, as YAML', 'Events and logs', 'What’s failing, in one answer'].map((t) => `<li>${i('eye', 16, 'ok')}${t}</li>`).join('')}</ul></div><div class="card"><h3>Kept from it</h3><ul>${['Secrets’ values: by default, keys only', 'Env values that look sensitive', 'Namespaces you hide', 'Anything past your own access'].map((t) => `<li>${i('eye-off', 16, 'no')}${t}</li>`).join('')}</ul></div></div></div></section>`,
  },
  {
    id: 'C4 · It asks first',
    note: 'The approval whole, beside its words.',
    tags: [['keep', 'Approval, from AI assistants']],
    html: () =>
      `<section class="pad band"><div class="wrap grid2"><div style="display:flex;justify-content:center">${approval({ width: 480 })}</div><div>${heading('By default, it asks', 'before any change.')}<p class="body">The cluster dry-runs the change first. Then Lumovi shows you the diff, your agent’s reason and the kubectl command, and tells you if you’re in another window. It’s made only if you approve, and only if it still does what you saw.</p></div></div></section>`,
  },
  {
    id: 'C5 · You decide where',
    note: 'The rules, as A5 draws them.',
    tags: [['keep', 'From AI assistants']],
    html: () =>
      `<section class="pad band"><div class="wrap grid2"><div>${heading('You decide', 'where.')}<p class="body">Let staging change without asking, keep production at “ask me”, and keep it out of kube-system. Deletions always ask. Every change, and every tool it called, is on Lumovi’s audit log.</p></div><div style="display:flex;justify-content:center">${rules(520)}</div></div></section>`,
  },
  {
    id: 'C6 · When you look yourself',
    note: 'Today’s four scenes, two by two, each under its own heading from today: the dashboard’s story, told on the home page in short. Their words and cards stay on /dashboard.',
    tags: [
      ['keep', 'Clusters, Map, Rollback, Capacity'],
      ['move', 'Their full sections → /dashboard too'],
    ],
    html: (d, s) =>
      `<section class="pad band"><div class="wrap">${heading('When you look yourself.')}<p class="body">A calm, fast dashboard for every cluster, with what’s failing first.</p><div class="cols" style="grid-template-columns:1fr 1fr;margin-top:36px;gap:40px 48px;align-items:start">${(
        [
          ['clusters', 'All your clusters, in one list.', 'Which answer, how fast, which don’t.'],
          ['map', 'See what it’s connected to.', 'And what’s missing.'],
          ['rollback', 'Every change shows its kubectl.', 'Any revision, one rollback away.'],
          ['capacity', 'See where your capacity goes.', 'And why a pod can’t start.'],
        ] as const
      )
        .map(
          ([n, a, b]) =>
            `<div>${scene(n, 'desk', s)}<h3 style="margin:4px 0 0;font-size:${ph(d) ? 22 : 28}px;line-height:1.1;letter-spacing:-.03em;font-weight:650">${a} <span class="dim">${b}</span></h3></div>`,
        )
        .join(
          '',
        )}</div><p style="margin-top:24px"><span class="link">See the dashboard ${icon('arrow-right', 14)}</span></p></div></section>`,
  },
  {
    id: 'C7 · Get started',
    note: 'Connect first; today’s Download under the cards.',
    tags: [
      ['new', 'The cards'],
      ['keep', 'Download, as it is'],
    ],
    html: (d, s) =>
      `<section class="pad band" style="padding-bottom:40px"><div class="wrap"><p class="eyebrow">Get started</p>${ctaCards(['connect', 'download', 'cluster'])}</div></section>${downloadRest(d, s)}`,
  },
]

const VERSIONS: Record<Version, { name: string; angle: string; who: string; secs: Sec[] }> = {
  a: {
    name: 'A · Let agents in, safely',
    angle: 'The story of one change',
    who: 'the engineering lead whose team wants agents on the clusters',
    secs: [...A, ...SPONSORS],
  },
  b: {
    name: 'B · Every agent change, on the record',
    angle: 'Proof first',
    who: 'the platform, security or compliance engineer',
    secs: [...B, ...SPONSORS],
  },
  c: {
    name: 'C · Connect your agent in a minute',
    angle: 'Hands on',
    who: 'the developer or SRE who already uses an agent',
    secs: [...C, ...SPONSORS],
  },
}

const GUT: Record<Dev, number> = { desk: 300, phone: 230 }
const PAGE: Record<Dev, number> = { desk: 1440, phone: 390 }

function versionPage(v: Version, dev: Dev, scheme: Scheme): string {
  const V = VERSIONS[v]
  const rows = V.secs
    .map(
      (s) =>
        `<div class="gut"><b>${s.id}</b>${dev === 'desk' ? s.note : ''}<div>${s.tags.map(([k, t]) => `<span class="tag ${k}">${t}</span>`).join('')}</div></div><div class="page ${dev}">${s.html(dev, scheme)}</div>`,
    )
    .join('')
  return `<div class="frame" style="grid-template-columns:${GUT[dev]}px ${PAGE[dev]}px">${rows}</div>`
}

/* ——— The sitemap: today's sections and pages, and where each goes in each version ——— */

type Fate = [kind: 'keep' | 'move' | 'gone' | 'new', text: string]
const TODAY: [section: string, a: Fate, b: Fate, c: Fate][] = [
  [
    'Hero · “Your clusters, at a glance.”',
    ['keep', 'Its cluster stays, under new words (A1)'],
    ['move', 'Its cluster → /dashboard’s top'],
    ['keep', 'Its cluster stays, under the conversation (C1)'],
  ],
  [
    'Film · Lumovi in a minute',
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
  ],
  [
    'Clusters',
    ['move', '→ /dashboard; small in A8'],
    ['move', '→ /dashboard; small in B8'],
    ['keep', 'Whole in C6, and /dashboard'],
  ],
  [
    'The app (17 tabs, film “It’s 2 a.m.”)',
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
  ],
  [
    'Map',
    ['move', '→ /dashboard; small in A8'],
    ['move', '→ /dashboard; small in B8'],
    ['keep', 'Whole in C6, and /dashboard'],
  ],
  [
    'Rollback',
    ['move', '→ /dashboard; small in A8'],
    ['move', '→ /dashboard; small in B8'],
    ['keep', 'Whole in C6, and /dashboard'],
  ],
  [
    'Capacity',
    ['move', '→ /dashboard; small in A8'],
    ['move', '→ /dashboard; small in B8'],
    ['keep', 'Whole in C6, and /dashboard'],
  ],
  [
    'Features (palette, problems, logs, Helm)',
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
  ],
  [
    'AI assistants',
    ['keep', 'Becomes the page: approval (A3), film (A4), rules (A5)'],
    ['keep', 'Becomes the page: guarantees (B2), never (B3)'],
    ['keep', 'Becomes the page: conversation (C1), approval (C4), rules (C5)'],
  ],
  [
    'In your cluster (team scene, film “Monday”)',
    ['keep', 'Team scene in A6; install → Download; film → /dashboard'],
    ['keep', 'Team scene in the hero, words in B5; film → /dashboard'],
    ['move', '→ /dashboard; a line in C7’s card'],
  ],
  ['Fleet', ['move', '→ /dashboard'], ['move', '→ /dashboard'], ['move', '→ /dashboard']],
  [
    'Access and audit',
    ['keep', 'The audit log in A3; the rest → /dashboard'],
    ['keep', 'Grows into B4 and B5'],
    ['keep', 'One line in C5; the rest → /dashboard'],
  ],
  [
    'Every other kind, plugins',
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
    ['move', '→ /dashboard'],
  ],
  [
    'Story (why I built it)',
    ['move', '→ /dashboard, at its end'],
    ['move', '→ /dashboard, at its end'],
    ['move', '→ /dashboard, at its end'],
  ],
  ['Sponsors', ['keep', 'As it is'], ['keep', 'As it is'], ['keep', 'As it is']],
  ['Sevalla', ['keep', 'As it is'], ['keep', 'As it is'], ['keep', 'As it is']],
  [
    'Download (#download)',
    ['keep', 'Under A7’s cards; the anchor stays'],
    ['keep', 'Under B7’s cards'],
    ['keep', 'Under C7’s cards'],
  ],
]
const PAGES_TODAY: [page: string, fate: Fate][] = [
  ['/tour', ['keep', 'Stays; linked from the dashboard band and /dashboard']],
  ['/brand', ['keep', 'Stays']],
  ['/privacy', ['keep', 'Stays']],
  [
    '/dashboard',
    [
      'new',
      'New in all three: today’s home page from Clusters to Story, in today’s order, scenes and films whole',
    ],
  ],
]

function sitemap(): string {
  const cell = ([k, t]: Fate) =>
    `<td><span class="tag ${k}">${{ keep: 'Stays', move: 'Moves', gone: 'Goes', new: 'New' }[k]}</span> ${t}</td>`
  const th = (Object.keys(VERSIONS) as Version[])
    .map((v) => `<th>${VERSIONS[v].name}<span>${VERSIONS[v].angle}</span></th>`)
    .join('')
  const navs = `<tr><td><b>Navigation</b></td><td>How it works · Your rules · Dashboard · Docs · <b>Download</b></td><td>Guarantees · Audit log · For teams · Dashboard · Docs · <b>Run in your cluster</b></td><td>Connect · What it reads · Dashboard · Docs · <b>Download</b></td></tr>`
  const order = (v: Version) =>
    VERSIONS[v].secs.map((s) => s.id.split(' · ')[1] ?? s.id).join(' → ')
  return `<div class="sm"><h1>The sitemap: what stays, moves or goes</h1><p class="sub">Today’s home page is 17 sections, 26 screens at 1440 and 35 on a phone. Each version keeps it to one problem in 9 to 10 screens at 1440 and about 15 on a phone, two of them today’s sponsors and Sevalla, kept as they are, and everything else Lumovi is moves, whole, to a new page, <b>/dashboard</b>, where today’s scenes and films keep their wow. Nothing goes. Old anchors (#map, #fleet…) send to the same place on /dashboard with a small script, as a #anchor never reaches the server; <code>#download</code>, the only one the docs link to, stays on the home page.</p>
<table><thead><tr><th>Today’s home page</th>${th}</tr></thead><tbody>${TODAY.map(([s, a, b, c]) => `<tr><td>${s}</td>${cell(a)}${cell(b)}${cell(c)}</tr>`).join('')}${navs}<tr><td><b>The new home page, in order</b></td>${(['a', 'b', 'c'] as Version[]).map((v) => `<td class="ord">${order(v)}</td>`).join('')}</tr></tbody></table>
<h2>Today’s other pages</h2><table class="pg"><tbody>${PAGES_TODAY.map(([p, f]) => `<tr><td><code>${p}</code></td>${cell(f)}</tr>`).join('')}</tbody></table></div>`
}

const SM_CSS = `
.sm { padding: 48px 56px 64px; background: var(--bg); }
.sm h1 { font-size: 30px; letter-spacing: -.03em; }
.sm h2 { font-size: 22px; letter-spacing: -.02em; margin: 40px 0 14px; }
.sm .sub { max-width: 1100px; font-size: 15px; line-height: 1.6; color: var(--text-2); margin: 14px 0 28px; }
.sm table { width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.45; background: var(--surface); border-radius: 12px; overflow: hidden; box-shadow: var(--panel); }
.sm th { text-align: left; padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--line-strong); vertical-align: top; }
.sm th span { display: block; font-weight: 400; color: var(--text-3); font-size: 13px; }
.sm td { padding: 11px 16px; border-top: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
.sm td:first-child { color: var(--text-1); width: 22%; }
.sm .tag { margin: 0 4px 0 0; }
.sm .ord { font-size: 13px; }
.sm .pg td:first-child { width: 160px; }
`

/* ——— Side by side: today's home page and each version, at one scale ——— */

const SCALE = 0.1
/** A page's height at 1440, from its thumbnail (288 px wide, so 1:5): a PNG's height is bytes 20–23. */
const tall = (file: string, scheme: Scheme) => {
  const u = new URL(`thumbs/${file}-${scheme}.png`, REVIEW)
  return existsSync(u) ? readFileSync(u).readUInt32BE(20) * 5 : 0
}
function compare(scheme: Scheme): string {
  const thumb = (file: string) => {
    const u = new URL(`thumbs/${file}-${scheme}.png`, REVIEW)
    return existsSync(u)
      ? `<img src="${png(u)}" style="width:${1440 * SCALE}px;display:block;border-radius:6px;box-shadow:var(--panel)">`
      : `<div style="width:${1440 * SCALE}px;height:400px;border:1px dashed var(--line-strong)"></div>`
  }
  const col = (title: string, sub: string, file: string, notes: string) =>
    `<div class="cc"><b>${title}</b><span>${sub} · ${tall(file, scheme).toLocaleString('en')} px, ${(tall(file, scheme) / 900).toFixed(0)} screens</span>${thumb(file)}<div class="cn">${notes}</div></div>`
  const li = (k: Fate[0], t: string) =>
    `<li><span class="tag ${k}">${{ keep: 'Reuses', move: 'Moves', gone: 'Removes', new: 'New' }[k]}</span>${t}</li>`
  return `<div class="sm cmp"><h1>Today’s home page, and the three, side by side</h1><p class="sub">Each at a tenth of its size at 1440, so their lengths compare: today’s is 26 screens. Nothing of today’s wow is removed: the hero cluster and the team scene stay on the home page in one form or another, and every scene and film stays whole on /dashboard. What leaves the home page is listed under each.</p><div class="row">
${col('Today', '17 sections', 'today', `<ul>${li('keep', 'Its hero cluster and scenes are drawn live (canvas); the new pages use them as they are.')}</ul>`)}
${col(VERSIONS.a.name, VERSIONS.a.angle, 'a-desk', `<ul>${li('keep', 'Hero cluster (A1), team scene (A6), four scenes small (A8), sponsors, Sevalla, Download')}${li('move', 'The app, features, fleet, plugins, story, both films but one → /dashboard')}${li('new', 'The problem, the four steps, the CTA cards')}</ul>`)}
${col(VERSIONS.b.name, VERSIONS.b.angle, 'b-desk', `<ul>${li('keep', 'Team scene (B1), four scenes small (B8), sponsors, Sevalla, Download')}${li('move', 'Hero cluster → /dashboard’s top; the app, features, fleet, plugins, story, films → /dashboard')}${li('new', 'Guarantees, never, the chain, security questions')}</ul>`)}
${col(VERSIONS.c.name, VERSIONS.c.angle, 'c-desk', `<ul>${li('keep', 'Hero cluster (C1), Clusters, Map, Rollback and Capacity whole (C6), sponsors, Sevalla, Download')}${li('move', 'The app, features, team, fleet, plugins, story, films → /dashboard')}${li('new', 'The three steps, what it reads, the CTA cards')}</ul>`)}
</div></div>`
}

const CMP_CSS = `
.cmp .row { display: flex; gap: 40px; align-items: flex-start; }
.cc { width: 330px; display: flex; flex-direction: column; gap: 6px; }
.cc > b { font-size: 16px; } .cc > span { font-size: 13px; color: var(--text-3); margin-bottom: 8px; }
.cn ul { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 10px; font-size: 13px; line-height: 1.5; color: var(--text-2); }
.cn .tag { margin: 0 6px 0 0; }
`

/* ——— Frames ——— */

export type AgentSiteFrame = `${Version}-${Dev}` | 'sitemap' | 'compare'

export const AGENTSITE_FRAMES: { id: AgentSiteFrame; title: string; size: Size }[] = [
  ...(['a', 'b', 'c'] as Version[]).flatMap((v) =>
    (['desk', 'phone'] as Dev[]).map((d) => ({
      id: `${v}-${d}` as AgentSiteFrame,
      title: `${VERSIONS[v].name}, ${d === 'desk' ? 'at 1440' : 'on a phone'}`,
      size: { width: GUT[d] + PAGE[d], height: 1000 },
    })),
  ),
  { id: 'sitemap', title: 'The sitemap', size: { width: 1700, height: 1200 } },
  { id: 'compare', title: 'Side by side with today', size: { width: 1700, height: 1200 } },
]

/** One of the frames, in one theme. */
export function agentSiteFrame(id: AgentSiteFrame, scheme: Scheme): string {
  const f = AGENTSITE_FRAMES.find((x) => x.id === id)!
  const inner =
    id === 'sitemap'
      ? sitemap()
      : id === 'compare'
        ? compare(scheme)
        : (() => {
            const [v, d] = id.split('-') as [Version, Dev]
            const V = VERSIONS[v]
            return `<header class="vh"><b>${V.name}</b><span>${V.angle} · for ${V.who} · ${d === 'desk' ? '1440 wide' : '390 wide'} · copy: marketing, LMV-377</span></header>${versionPage(v, d, scheme)}`
          })()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${TOKENS[scheme]} }
${CSS}${SM_CSS}${CMP_CSS}
.vh { padding: 22px 28px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-3); }
.vh b { font-size: 20px; color: var(--text-1); letter-spacing: -.02em; }
html, body { width: ${f.size.width}px; }
</style>${inner}`
}
