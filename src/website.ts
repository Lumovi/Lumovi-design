/**
 * lumovi.dev's shared parts for its new pages (LMV-280): the navigation at 1440, 1024 and on a
 * phone, closed and open; the page shape every part's page uses; the download foot; the footer
 * as a sitemap; and the share-image template. Drawn with the site's own tokens, before the build.
 */
import { type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { FONTS } from './scene.ts'

/** The site's own values (Lumovi-website, src/styles/global.css). */
const TOKENS: Record<Scheme, string> = {
  dark: `--bg:#0a0a0a;--surface:#121212;--surface-2:#161616;--surface-3:#1f1f1f;--line:rgb(255 255 255/.07);--line-strong:rgb(255 255 255/.12);--text-1:#ededed;--text-2:#a3a3a3;--text-3:#8f8f8f;--accent:#2675d3;--accent-strong:#5ea2f0;--accent-soft:rgb(57 135 229/.16);--good:#009e00;--warn:#fab219;--critical:#d03b3b;--nav-bg:rgb(10 10 10/.96);--code-bg:#0e0e0e;--shadow-panel:0 0 0 1px rgb(255 255 255/.02),0 8px 24px -12px rgb(0 0 0/.6);--shadow-pop:0 16px 48px -8px rgb(0 0 0/.7),0 0 0 1px rgb(255 255 255/.08);--shadow-window:0 0 0 1px rgb(255 255 255/.06),0 40px 120px -30px rgb(0 0 0/.9);--glow:radial-gradient(75% 95% at 72% 42%,#212121,transparent 48%);`,
  light: `--bg:#f5f5f5;--surface:#ffffff;--surface-2:#fafafa;--surface-3:#efefef;--line:rgb(0 0 0/.08);--line-strong:rgb(0 0 0/.14);--text-1:#0a0a0a;--text-2:#525252;--text-3:#6b6b6b;--accent:#2675d3;--accent-strong:#1c5cab;--accent-soft:rgb(38 117 211/.1);--good:#008a00;--warn:#c98700;--critical:#c43434;--nav-bg:rgb(245 245 245/.96);--code-bg:#fafafa;--shadow-panel:0 0 0 1px rgb(0 0 0/.03),0 8px 24px -12px rgb(0 0 0/.15);--shadow-pop:0 16px 48px -8px rgb(0 0 0/.2),0 0 0 1px rgb(0 0 0/.08);--shadow-window:0 0 0 1px rgb(0 0 0/.08),0 40px 120px -30px rgb(0 0 0/.3);--glow:radial-gradient(75% 95% at 72% 42%,#ffffff,transparent 48%);`,
}

const CSS = `

.map { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 12px; align-items: start; }
.mcol { display: flex; flex-direction: column; gap: 4px; }
.mhd { display: flex; flex-direction: column; margin-bottom: 6px; }
.mhd b { font-size: 13px; }
.mhd code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; }
.mhd small { font-size: 11px; color: #555; }
.mb { display: flex; align-items: flex-start; box-sizing: border-box; padding: 5px 7px; border-radius: 6px; font-size: 10.5px; line-height: 13px; color: #1a1a1a; overflow: hidden; }
.mb.m-hero { background: #c9dcf5; }
.mb.m-media { background: #dbe6f5; }
.mb.m-thing { background: #ffffff; box-shadow: inset 0 0 0 1px #c8c8c8; }
.mb.m-new { background: #fff3cf; box-shadow: inset 0 0 0 1px #e3c66b; }
.mb.m-quiet { background: #ececec; }
.mb.m-foot { background: #2675d3; color: #fff; }
.legend { display: flex; flex-wrap: wrap; gap: 8px; }
.legend .mb { height: 24px; align-items: center; }
body { margin: 0; background: #dcdcdc; font-family: 'Inter', sans-serif; color: #111; -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 36px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; }
.sheet > header p { margin: 4px 0 0; max-width: 860px; font-size: 13px; line-height: 20px; color: #333; }
.spec { display: flex; flex-direction: column; gap: 10px; }
.spec > h2 { margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: #555; margin-left: 8px; }
.spec > p { margin: 0; max-width: 900px; font-size: 12px; line-height: 18px; color: #333; }
.spec > p b { font-weight: 600; color: #000; }
.cap { margin: 0 0 6px; font-size: 12px; color: #555; }
.row { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start; }
.site { overflow: hidden; border-radius: 10px; background: var(--bg); color: var(--text-1); box-shadow: 0 1px 0 rgb(0 0 0/.1), 0 12px 40px -18px rgb(0 0 0/.4); }
.site * { box-sizing: border-box; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 var(--gut); }
.nav { position: relative; background: var(--nav-bg); box-shadow: 0 1px 0 var(--line); }
.nav .in { display: flex; height: 64px; align-items: center; gap: 22px; }
.logo { display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 650; letter-spacing: -0.02em; color: var(--text-1); }
.logo i { display: block; width: 22px; height: 22px; border-radius: 6px; background: linear-gradient(135deg, var(--accent-strong), var(--accent)); }
.links { display: flex; gap: 22px; margin-left: 10px; font-size: 14px; color: var(--text-2); }
.links a { position: relative; color: inherit; text-decoration: none; white-space: nowrap; }
.links a.on { color: var(--text-1); }
.links a.on::after { content: ''; position: absolute; left: 0; right: 0; bottom: -22px; height: 2px; border-radius: 2px; background: var(--accent); }
.links .new { margin-left: 6px; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 11px; font-weight: 600; line-height: 18px; color: var(--accent-strong); }
.grow { flex: 1; }
.quiet { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text-2); white-space: nowrap; }
.quiet > svg.i { color: var(--text-3); }
.icn { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 8px; color: var(--text-2); }
.dl { display: inline-flex; height: 36px; align-items: center; gap: 8px; padding: 0 14px; border-radius: 9px; background: var(--accent); font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; }
.dl.big { height: 48px; padding: 0 20px; border-radius: 11px; font-size: 16px; }
.btn2 { display: inline-flex; height: 48px; align-items: center; gap: 8px; padding: 0 18px; border: 1px solid var(--line-strong); border-radius: 11px; background: var(--surface); font-size: 16px; font-weight: 600; color: var(--text-1); }
.menu { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 10px; color: var(--text-1); }
.sheet2 { padding: 8px 16px 20px; background: var(--bg); }
.sheet2 .pg { display: flex; height: 52px; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); font-size: 18px; font-weight: 600; color: var(--text-1); }
.sheet2 .pg.on { color: var(--accent-strong); }
.sheet2 .pg small { margin-left: 8px; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 11px; font-weight: 600; line-height: 18px; color: var(--accent-strong); }
.sheet2 .pg svg.i { color: var(--text-3); }
.sheet2 .sub { display: flex; gap: 10px; margin-top: 18px; }
.sheet2 .sub span { display: flex; height: 44px; flex: 1; align-items: center; justify-content: center; gap: 8px; border: 1px solid var(--line-strong); border-radius: 10px; font-size: 15px; color: var(--text-2); }
.seg { display: flex; margin-top: 14px; padding: 3px; border-radius: 10px; background: var(--surface-3); }
.seg span { flex: 1; display: grid; height: 38px; place-items: center; border-radius: 8px; font-size: 14px; color: var(--text-2); }
.seg span.on { background: var(--surface); color: var(--text-1); box-shadow: var(--shadow-panel); }
.hero { position: relative; padding: 72px 0 48px; background: var(--glow); }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-3); }
.h1 { margin: 14px 0 0; max-width: 820px; font-size: 64px; line-height: 1.02; font-weight: 650; letter-spacing: -0.035em; }
.lead { margin: 18px 0 0; max-width: 640px; font-size: 19px; line-height: 1.5; color: var(--text-2); }
.acts { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.media { position: relative; margin-top: 40px; aspect-ratio: 16 / 9; border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-window); overflow: hidden; }
.media .bar { display: flex; gap: 6px; height: 34px; align-items: center; padding: 0 14px; border-bottom: 1px solid var(--line); background: var(--surface-2); }
.media .bar i { display: block; width: 10px; height: 10px; border-radius: 999px; background: var(--line-strong); }
.media .ph { position: absolute; inset: 34px 0 0; display: grid; place-items: center; font-size: 13px; color: var(--text-3); }
.media .play { position: absolute; left: 50%; top: 55%; display: grid; width: 64px; height: 64px; place-items: center; border-radius: 999px; background: rgb(0 0 0/.55); color: #fff; transform: translate(-50%, -50%); }
.things { display: flex; flex-direction: column; gap: 72px; padding-top: 80px; padding-bottom: 24px; }
.thing { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: center; }
.thing.r { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
.thing.r .tx { order: 2; }
.thing h3 { margin: 0; font-size: 28px; line-height: 1.15; font-weight: 650; letter-spacing: -0.02em; }
.thing p { margin: 12px 0 0; font-size: 16px; line-height: 1.6; color: var(--text-2); }
.doc { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 14px; font-weight: 500; color: var(--accent-strong); }
.shot { aspect-ratio: 16 / 10; border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-window); display: grid; place-items: center; font-size: 12px; color: var(--text-3); }
.docs { padding-top: 48px; padding-bottom: 48px; border-top: 1px solid var(--line); }
.docs h4, .fcol h4 { margin: 0 0 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-3); }
.docs .dlinks { display: flex; flex-wrap: wrap; gap: 10px; }
.docs .dlinks span { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 14px; color: var(--text-1); }
.docs .dlinks svg.i { color: var(--text-3); }
.foot-dl { padding: 64px 0; border-top: 1px solid var(--line); background: var(--glow); text-align: center; }
.foot-dl h2 { margin: 0; font-size: 40px; line-height: 1.1; font-weight: 650; letter-spacing: -0.03em; }
.foot-dl p { margin: 12px auto 0; max-width: 560px; font-size: 16px; line-height: 1.6; color: var(--text-2); }
.foot-dl .acts { justify-content: center; }
.cmd { display: inline-flex; align-items: center; gap: 12px; height: 48px; padding: 0 8px 0 16px; border: 1px solid var(--line-strong); border-radius: 11px; background: var(--code-bg); font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text-1); }
.cmd .cp { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 8px; color: var(--text-3); }
.foot-dl .others { margin-top: 18px; font-size: 13px; color: var(--text-3); }
.foot-dl .others b { font-weight: 500; color: var(--text-2); }
.footer { padding: 56px 0 28px; border-top: 1px solid var(--line); }
.fgrid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 32px; }
.fcol a { display: block; margin: 0 0 10px; font-size: 14px; color: var(--text-2); }
.fcol .about { max-width: 260px; margin-top: 12px; font-size: 13px; line-height: 1.6; color: var(--text-3); }
.slim { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 22px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--line); font-size: 13px; color: var(--text-3); }
.slim b { font-weight: 500; color: var(--text-2); }
.smark { display: inline-flex; height: 28px; align-items: center; padding: 0 10px; border: 1px dashed var(--line-strong); border-radius: 6px; font-size: 12px; font-weight: 600; color: var(--text-2); }
.sall { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--accent-strong); }
.legal { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 14px; font-size: 12px; color: var(--text-3); }
.phone { width: 390px; }
.phone .h1 { font-size: 40px; }
.phone .lead { font-size: 17px; }
.phone .hero { padding: 36px 0 28px; }
.phone .thing, .phone .thing.r { grid-template-columns: minmax(0, 1fr); gap: 18px; }
.phone .thing.r .tx { order: 0; }
.phone .things { gap: 48px; padding-top: 48px; padding-bottom: 16px; }
.phone .thing h3 { font-size: 22px; }
.phone .acts { flex-direction: column; }
.phone .acts > span { width: 100%; justify-content: center; }
.phone .foot-dl h2 { font-size: 30px; }
.phone .cmd { width: 100%; height: auto; padding: 10px 8px 10px 14px; font-size: 12.5px; text-align: left; justify-content: space-between; }
.phone .fgrid { grid-template-columns: 1fr 1fr; gap: 28px 20px; }
.phone .fgrid .fcol:first-child { grid-column: 1 / -1; }
.phone .slim { flex-direction: column; align-items: flex-start; gap: 12px; }
.phone .slim .grow { display: none; }
.slim .logos { display: flex; flex-wrap: wrap; gap: 10px; }
.slim .host { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; }
.og { position: relative; width: 1200px; height: 630px; overflow: hidden; border-radius: 10px; background: var(--bg); color: var(--text-1); }
.og .glow { position: absolute; inset: 0; background: var(--glow); }
.og .tx { position: absolute; left: 72px; top: 72px; width: 520px; }
.og .tx .h { margin: 44px 0 0; font-size: 56px; line-height: 1.04; font-weight: 650; letter-spacing: -0.035em; }
.og .tx .l { margin: 20px 0 0; font-size: 22px; line-height: 1.45; color: var(--text-2); }
.og .tx .u { position: absolute; top: 456px; font-size: 18px; color: var(--text-3); }
.og .scr { position: absolute; left: 640px; top: 96px; width: 640px; height: 460px; border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-window); display: grid; place-items: center; font-size: 14px; color: var(--text-3); }
.og .scr .bar { position: absolute; top: 0; left: 0; right: 0; height: 34px; border-bottom: 1px solid var(--line); background: var(--surface-2); border-radius: 14px 14px 0 0; }
`

const PAGES: [string, string][] = [
  ['The app', '/app'],
  ['For teams', '/teams'],
  ['Plugins', '/plugins'],
  ['AI assistants', '/ai'],
  ['Security', '/security'],
]

const logo = () => `<span class="logo"><i></i>Lumovi</span>`

function bar(width: 'wide' | 'mid' | 'phone', on = 'For teams', open = false): string {
  if (width === 'phone')
    return `<div class="nav"><div class="wrap in" style="gap:8px">${logo()}<span class="grow"></span><span class="dl">Download</span><span class="menu">${icon(open ? 'x' : 'menu', 22)}</span></div></div>`
  const links = `<nav class="links">${PAGES.map(([n]) => `<a class="${n === on ? 'on' : ''}">${n}${n === 'Plugins' ? '<span class="new">New in 1.22</span>' : ''}</a>`).join('')}</nav>`
  const right =
    width === 'wide'
      ? `<span class="quiet">${icon('file-text', 16)}Docs</span><span class="quiet">${icon('git-branch', 16)}GitHub</span><span class="icn">${icon('sun', 16)}</span>`
      : `<span class="icn" title="Docs">${icon('file-text', 16)}</span><span class="icn" title="GitHub">${icon('git-branch', 16)}</span><span class="icn">${icon('sun', 16)}</span>`
  return `<div class="nav"><div class="wrap in">${logo()}${links}<span class="grow"></span>${right}<span class="dl">${icon('download', 15)}Download</span></div></div>`
}

function sheetMenu(): string {
  return `<div class="sheet2">${PAGES.map(([n]) => `<div class="pg${n === 'For teams' ? ' on' : ''}"><span>${n}${n === 'Plugins' ? '<small>New in 1.22</small>' : ''}</span>${icon('chevron-right', 18)}</div>`).join('')}<div class="pg"><span>About</span>${icon('chevron-right', 18)}</div><div class="sub"><span>${icon('file-text', 16)}Docs</span><span>${icon('git-branch', 16)}GitHub</span></div><div class="seg"><span>System</span><span class="on">Light</span><span>Dark</span></div></div>`
}

function navigation(scheme: Scheme): string {
  const s = (w: number, inner: string) =>
    `<div class="site" style="width:${w}px;${TOKENS[scheme]}--gut:${w > 500 ? 40 : 16}px">${inner}</div>`
  return `<section class="spec"><h2>Navigation<i>one bar; five pages, Docs and GitHub, Download</i></h2>
    <p class="cap">1440</p>${s(1376, bar('wide'))}
    <p class="cap">1024: Docs and GitHub become icons (named for screen readers and in their tooltip)</p>${s(1024, bar('mid'))}
    <div class="row"><div><p class="cap">Phone, closed</p>${s(390, bar('phone'))}</div><div><p class="cap">Phone, open: a full-height sheet</p>${s(390, bar('phone', 'For teams', true) + sheetMenu())}</div></div>
    <p><b>The bar</b>: the logo (home), the five pages in the order marketing set, a quiet “New in 1.22” label on Plugins (taken off later), then at the right Docs and GitHub as quieter links, the theme switch, and <b>Download</b> as the one filled button. The current page is marked with a 2 px accent line under it. It stays on top as the page scrolls, as today, and gets its background once scrolled. <b>At 1024</b> Docs and GitHub become 36 px icons; nothing else goes. <b>Below 960</b> the five pages and Docs and GitHub fold into a menu button; Download stays. <b>About</b> is a footer page on the desktop, not in the bar; the phone’s sheet adds it after the five, since a phone’s footer is far. <b>On a phone</b> the bar is the logo, Download and the menu (44 px). The menu is a full-height sheet under the bar: the five pages and About as 52 px rows, the current one in the accent; Docs and GitHub as two buttons; the theme as a segmented control. The X closes it; so does a page link, Escape and Back. On a phone, Download goes to /download, where the phone gets its own first screen (see the page shape).</p>
  </section>`
}

function pageShape(scheme: Scheme, phone = false): string {
  const t = (title: string, body: string, r = false) =>
    `<div class="thing${r ? ' r' : ''}"><div class="tx"><h3>${title}</h3><p>${body}</p><span class="doc">${icon('file-text', 14)}Docs: how it works${icon('arrow-right', 14)}</span></div><div class="shot">the app’s own screen</div></div>`
  const inner = `${bar(phone ? 'phone' : 'wide')}<div class="hero"><div class="wrap"><span class="eyebrow">${icon('users', 14)}For teams</span><h1 class="h1">The same app, for your whole team.</h1><p class="lead">Install it in your cluster with one chart. Everyone signs in as themselves and sees only what their own access allows.</p><div class="acts"><span class="dl big">${icon('download', 18)}Install in your cluster</span><span class="btn2">Try it on your computer</span></div><div class="media"><div class="bar"><i></i><i></i><i></i></div><div class="ph">the page’s video, poster first</div><span class="play">${icon('play', 26)}</span></div></div></div>
    <div class="wrap things">${t('One chart, one sign-in', 'Install with Helm. People sign in with your identity provider, or through the proxy you already run.')}${t('As each person, never more', 'Lumovi acts as whoever is signed in, within their Kubernetes access. It never holds more than they have.', true)}${t('Who may do what, and who did', 'Profiles, grants and limits on top of RBAC, and a record of every change, shell and Secret read.')}</div>
    <div class="wrap docs"><h4>In the docs</h4><div class="dlinks"><span>${icon('file-text', 14)}Install in a cluster</span><span>${icon('file-text', 14)}Single sign-on</span><span>${icon('file-text', 14)}Access rules</span><span>${icon('file-text', 14)}The record</span></div></div>
    ${downloadFoot(phone)}`
  return `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px">${inner}</div>`
}

function downloadFoot(phone = false): string {
  return `<div class="foot-dl"><div class="wrap"><h2>Get Lumovi.</h2><p>Free and open source. No telemetry, no accounts. It uses the kubeconfig you have and never writes to it.</p><div class="acts">${phone ? `<span class="dl big">${icon('share', 18)}Get it on your computer</span>` : `<span class="dl big">${icon('download', 18)}Download for macOS</span>`}<span class="cmd">helm install lumovi oci://ghcr.io/lumovi/charts/lumovi<span class="cp">${icon('copy', 16)}</span></span></div><p class="others">${phone ? 'Opens the share sheet with the download page’s link, to open on your computer.' : 'Also for <b>Windows</b> and <b>Linux</b> · <b>Homebrew</b> · every way to install'}</p></div></div>`
}

function footer(scheme: Scheme, phone = false, none = false): string {
  const col = (h: string, links: string[]) =>
    `<div class="fcol"><h4>${h}</h4>${links.map((l) => `<a>${l}</a>`).join('')}</div>`
  return `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px"><div class="footer"><div class="wrap"><div class="fgrid"><div class="fcol">${logo()}<p class="about">A calm, fast Kubernetes dashboard, on your desktop or in your cluster. Free and open source.</p></div>${col('Product', ['The app', 'Plugins', 'AI assistants', 'Download'])}${col('For teams', ['For teams', 'For the people on your team', 'Security'])}${col('Open source', ['Docs', 'GitHub', 'Releases', 'Contributing', 'Licence: Apache 2.0'])}${col('Lumovi', ['Why I built it', 'Brand', 'Privacy', 'security@lumovi.dev'])}</div><div class="slim">${none ? 'Lumovi is free, kept bright by its sponsors.' : '<span>Kept bright by its sponsors</span><span class="logos"><span class="smark">Sponsor</span><span class="smark">Sponsor</span><span class="smark">Sponsor</span></span>'}<a class="sall">Sponsor Lumovi${icon('arrow-right', 13)}</a><span class="grow"></span><span class="host">Hosted by <span class="smark">Sevalla</span></span></div><div class="legal"><span>© 2026 Peter Kota</span><span>No tracking, no cookie of our own · Privacy</span></div></div></div></div>`
}

function share(scheme: Scheme): string {
  return `<div class="og" style="${TOKENS[scheme]}"><div class="glow"></div><div class="tx">${logo()}<p class="h">The same app, for your whole team.</p><p class="l">Everyone signs in as themselves and sees only what their own access allows.</p><span class="u">lumovi.dev/teams</span></div><div class="scr"><div class="bar"></div>the page’s app screen, light</div></div>`
}

/** A page as its blocks, each sized by the phone screens it takes (844 px each). */
type MapBlock = [
  name: string,
  phone: number,
  kind?: 'hero' | 'media' | 'thing' | 'quiet' | 'foot' | 'new',
]

const MAP: [string, string, MapBlock[]][] = [
  [
    '/',
    'Home',
    [
      ['Hero: headline, lead with the team, Download + Install', 0.8, 'hero'],
      ['The film, in the hero', 0.3, 'media'],
      ['Facts line · How it’s kept secure', 0.15, 'quiet'],
      ['At a glance: the live cluster → /app', 0.9, 'thing'],
      ['Built for teams: two cards, Monday → /teams', 1, 'thing'],
      ['Plugins · New in 1.22: tools’ marks → /plugins', 0.6, 'thing'],
      ['AI assistants ask first → /ai', 0.8, 'thing'],
      ['Why I built it: quote, photo → /about', 0.7, 'quiet'],
      ['Sevalla, its own section', 0.9, 'quiet'],
      ['Sponsors: logos, Sponsor Lumovi', 0.6, 'quiet'],
      ['Download, short', 0.7, 'foot'],
    ],
  ],
  [
    '/app',
    'The app',
    [
      ['Headline + the 2 a.m. video', 1.1, 'hero'],
      ['Every cluster checked first: Clusters scene', 1, 'thing'],
      ['Problems first: the window, 5 tabs', 1.1, 'thing'],
      ['What routes to what: Map scene', 1, 'thing'],
      ['Every change shows its kubectl: Rollback, Helm', 1, 'thing'],
      ['Where capacity goes, and why a pod can’t start', 1, 'thing'],
      ['Docs', 0.3, 'quiet'],
      ['Download foot', 0.7, 'foot'],
    ],
  ],
  [
    '/teams',
    'For teams',
    [
      ['Headline + Monday video', 1.1, 'hero'],
      ['One chart, sign-in, as each person: team scene', 1, 'thing'],
      ['Every cluster, private ones too: Fleet', 0.9, 'thing'],
      ['#access: who may do what', 1, 'thing'],
      ['#record: who did', 1, 'thing'],
      ['#everyone: for the people on your team', 0.8, 'new'],
      ['Docs', 0.3, 'quiet'],
      ['Install in your cluster foot', 0.7, 'foot'],
    ],
  ],
  [
    '/plugins',
    'Plugins',
    [
      ['Headline + one plugin’s page', 1.1, 'hero'],
      ['Appears when its tool runs; failing first', 0.9, 'thing'],
      ['Safe by design', 0.9, 'thing'],
      ['The included plugins (named)', 0.9, 'thing'],
      ['#more: every other kind too', 0.8, 'thing'],
      ['Docs: write one', 0.3, 'quiet'],
      ['Download foot', 0.7, 'foot'],
    ],
  ],
  [
    '/ai',
    'AI assistants',
    [
      ['Headline + It asked first', 1.1, 'hero'],
      ['Any MCP agent, as you', 0.8, 'thing'],
      ['Dry-run, then waits with the diff', 1, 'thing'],
      ['What agents may do and see', 0.9, 'thing'],
      ['On the record', 0.7, 'thing'],
      ['Docs', 0.3, 'quiet'],
      ['Download foot', 0.7, 'foot'],
    ],
  ],
  [
    '/security',
    'Security',
    [
      ['Headline + the eight facts as anchors', 0.9, 'hero'],
      ['Sign-in · as each person · access rules', 1.2, 'quiet'],
      ['The record · plugins’ sandbox', 0.9, 'quiet'],
      ['What it stores · signed builds', 0.9, 'quiet'],
      ['Reporting · what it doesn’t do yet', 0.8, 'quiet'],
      ['Install foot', 0.7, 'foot'],
    ],
  ],
  [
    '/download',
    'Download',
    [
      ['Your platform first (phone: Get it on your computer)', 1, 'hero'],
      ['Every file · Homebrew · from source', 1.6, 'quiet'],
      ['#cluster: Helm · Docker', 1.2, 'thing'],
    ],
  ],
  [
    '/about',
    'About',
    [
      ['#story: in full, with the photo', 1.6, 'hero'],
      ['#sponsors: the five tiers', 2, 'thing'],
      ['Licence · contributing', 0.6, 'quiet'],
    ],
  ],
]

function siteMap(): string {
  const PX = 64
  const col = ([path, name, blocks]: (typeof MAP)[number]) => {
    const total = blocks.reduce((n, b) => n + b[1], 0)
    return `<div class="mcol"><div class="mhd"><b>${name}</b><code>${path}</code><small>≈ ${total.toFixed(1)} phone screens</small></div>${blocks.map(([n, h, k]) => `<div class="mb m-${k ?? 'thing'}" style="height:${Math.max(40, Math.round(h * PX))}px"><span>${n}</span></div>`).join('')}</div>`
  }
  return `<section class="spec"><h2>The sitemap, as layout<i>each page’s blocks in order, drawn to the phone screens they take</i></h2><div class="map">${MAP.map(col).join('')}</div>
    <div class="legend"><span class="mb m-hero">headline and media</span><span class="mb m-thing">a thing: words and the app’s screen</span><span class="mb m-new">new on the site</span><span class="mb m-quiet">quiet: text, facts, story, sponsors</span><span class="mb m-foot">the download foot</span></div>
    <p><b>Every page stays within about eight phone screens</b> (today’s home page is 35). <b>The home page</b> is website’s draft 3 with Péter’s sponsors answer: its eleven blocks hold to about one phone screen each, the facts line and the film in the hero, so about 7.5. <b>/app keeps five things, not six</b>: today’s four demos (palette, problems, logs, Helm) don’t come as a sixth; the palette and logs join Problems first as two of its tabs, Helm joins Rollback (“Every change shows its kubectl.”, with “Many can be taken back with one click, and a Helm release rolls back to any revision.”, marketing’s words), so nothing is lost and the page stays within the shape’s five. The 17-tab window keeps five tabs: Overview, Problems, Map, Logs, Rollback. Each scene stays as one interactive scene on the desktop and its poster with a play on a phone. <b>/teams has six</b>, one past the shape’s five, by the PM’s ruling that access and the record share it; #everyone is short and closes it. <b>/about</b> is read, not scanned: the story in full and the five tiers. Sizes are design’s estimates; the frames measure them.</p>
  </section>`
}

export type SiteFrame = 'site-shared' | 'site-shape' | 'site-map'

export const SITE_FRAMES: { id: SiteFrame; title: string; size: Size }[] = [
  {
    id: 'site-shared',
    title: 'lumovi.dev: navigation, footer, share image',
    size: { width: 1440, height: 2400 },
  },
  { id: 'site-shape', title: 'lumovi.dev: the page shape', size: { width: 1440, height: 2400 } },
  {
    id: 'site-map',
    title: 'lumovi.dev: the sitemap, as layout',
    size: { width: 1440, height: 1200 },
  },
]

/** One of the frames, in one theme. */
export function siteFrame(id: SiteFrame, scheme: Scheme): string {
  const f = SITE_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'site-map'
      ? `<header><h1>lumovi.dev: the sitemap, as layout</h1><p>Website’s draft 3, marketing’s audience and Péter’s answers, as each page’s blocks. The frames of each page follow it.</p></header>${siteMap()}`
      : id === 'site-shared'
        ? `<header><h1>lumovi.dev: the shared parts</h1><p>For LMV-280’s new pages: the navigation, the footer as a sitemap, and the share-image template, drawn with the site’s own values. The page shape and the download foot are the other sheet.</p></header>${navigation(scheme)}
        <section class="spec"><h2>Footer<i>a sitemap, then a slim line for sponsors and the host</i></h2>${footer(scheme)}<div style="height:16px"></div><p class="cap">With no sponsors yet, as today</p>${footer(scheme, false, true)}<div style="height:16px"></div>${footer(scheme, true)}<p>Four columns of links (Product, For teams, Open source, Lumovi) after a short line of what Lumovi is. Then one slim line, on every page: the sponsors at the Lighthouse and Daylight tiers as <b>their logos, each a link</b>, in a version for each theme, as the listing promises (“Your logo and a link on lumovi.dev”), then “Sponsor Lumovi”, to /about’s sponsors section with the five tiers; with none yet, the line says “Lumovi is free, kept bright by its sponsors.” and the same link. The host’s mark at the right (the home page keeps the host’s own section too, by Péter). Then the legal line. On a phone the columns go two across, the first full width; no accordions, since a footer is read by scanning. The slim line stacks on a phone, each part whole on its own line: the words, the logos (wrapping as a group), “Sponsor Lumovi”, then “Hosted by” with its mark.</p></section>
        <section class="spec"><h2>Share image<i>one template, 1200 × 630, rendered per page</i></h2>${share('light')}<p>The logo, the page’s headline, its one line, its address, and the page’s own app screen in a window at the right, all in the light theme (the one most link previews show on). The window bleeds off the right edge on purpose, so the picture reads as a glimpse of the app, not a framed screenshot. Website renders one per page from the page’s headline, line and screen, and the home page’s is the hero’s. Text never smaller than 18 px at this size, so it reads as a thumbnail.</p></section>`
        : `<header><h1>lumovi.dev: the page shape</h1><p>One component for every part’s page: a headline and two lines, its media, three to five things, the docs, and the download foot. Drawn with /teams’ words as the example; the words are marketing’s.</p></header>
        <section class="spec"><h2>Desktop, 1440</h2>${pageShape(scheme)}</section>
        <section class="spec"><h2>Phone, 390</h2><div class="row">${pageShape(scheme, true)}<div style="max-width:620px"><p style="margin:0;font-size:12px;line-height:18px;color:#333"><b>Every part’s page is this</b>: an eyebrow naming the part, the headline at the display step, two lines at the lead step (max 640 px), the page’s two actions, then its media full width in the app’s window, poster first, playing muted when in view. Then three to five <b>things</b>: a heading, one or two sentences, a docs link, and the app’s own screen, alternating sides on the desktop and stacked text-first on a phone. Then <b>In the docs</b>, the page’s docs as links. Then the <b>foot</b>, the same component on every page; on /teams and /security, read by the people who install it in a cluster, the Helm command leads and the desktop download is second. On a phone the actions stack full width, and the foot’s first action is “Get it on your computer” (the share sheet with the download page’s link), since a phone can’t install the app; the Helm command is second and copies. Blocks are 96 px apart at 1440, 64 at 1024 and 48 on a phone; a page stays within about six screens on the desktop and eight on a phone.</p></div></div></section>`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
html, body { width: ${f.size.width}px; }
svg.i { display: inline-block; flex: none; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle; }
${CSS}
</style><div class="sheet">${body}</div>`
}
