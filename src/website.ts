/**
 * lumovi.dev's shared parts for its new pages (LMV-280): the navigation at 1440, 1024 and on a
 * phone, closed and open; the page shape every part's page uses; the download foot; the footer
 * as a sitemap; and the share-image template. Drawn with the site's own tokens, before the build.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'

/** The site's own values (Lumovi-website, src/styles/global.css). */
const TOKENS: Record<Scheme, string> = {
  dark: `--bg:#0a0a0a;--surface:#121212;--surface-2:#161616;--surface-3:#1f1f1f;--line:rgb(255 255 255/.07);--line-strong:rgb(255 255 255/.12);--text-1:#ededed;--text-2:#a3a3a3;--text-3:#8f8f8f;--accent:#2675d3;--accent-strong:#5ea2f0;--accent-soft:rgb(57 135 229/.16);--good:#009e00;--warn:#fab219;--critical:#d03b3b;--nav-bg:rgb(10 10 10/.96);--code-bg:#0e0e0e;--shadow-panel:0 0 0 1px rgb(255 255 255/.02),0 8px 24px -12px rgb(0 0 0/.6);--shadow-pop:0 16px 48px -8px rgb(0 0 0/.7),0 0 0 1px rgb(255 255 255/.08);--shadow-window:0 0 0 1px rgb(255 255 255/.06),0 40px 120px -30px rgb(0 0 0/.9);--glow:radial-gradient(75% 95% at 72% 42%,#212121,transparent 48%);`,
  light: `--bg:#f5f5f5;--surface:#ffffff;--surface-2:#fafafa;--surface-3:#efefef;--line:rgb(0 0 0/.08);--line-strong:rgb(0 0 0/.14);--text-1:#0a0a0a;--text-2:#525252;--text-3:#6b6b6b;--accent:#2675d3;--accent-strong:#1c5cab;--accent-soft:rgb(38 117 211/.1);--good:#008a00;--warn:#c98700;--critical:#c43434;--nav-bg:rgb(245 245 245/.96);--code-bg:#fafafa;--shadow-panel:0 0 0 1px rgb(0 0 0/.03),0 8px 24px -12px rgb(0 0 0/.15);--shadow-pop:0 16px 48px -8px rgb(0 0 0/.2),0 0 0 1px rgb(0 0 0/.08);--shadow-window:0 0 0 1px rgb(0 0 0/.08),0 40px 120px -30px rgb(0 0 0/.3);--glow:radial-gradient(75% 95% at 72% 42%,#ffffff,transparent 48%);`,
}

const CSS = `

.h1.xl.part { margin-top: 14px; max-width: 900px; font-size: 72px; line-height: 1.02; }
.phone .h1.xl.part { font-size: 40px; }
.hero2.part { padding-top: 88px; }
.phone .hero2.part { padding-top: 44px; }
.hero2.part .aurora { left: 30%; }
.scene { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; aspect-ratio: 16 / 10; border-radius: 16px; background: radial-gradient(60% 70% at 50% 40%, color-mix(in srgb, var(--accent) 16%, var(--surface)), var(--surface)); box-shadow: 0 0 0 1px var(--line), 0 30px 80px -40px rgb(0 0 0 / 0.45); font-size: 15px; font-weight: 600; color: var(--text-1); }
.scene small { font-size: 12px; font-weight: 400; color: var(--text-3); }
.scene .sc-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--accent-strong); box-shadow: 0 0 0 6px var(--accent-soft); margin-bottom: 6px; }
.scene.tilt { transform: rotateX(14deg); transform-origin: 50% 100%; }
.anchor { display: inline-block; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.thing .still { width: 100%; }
.fit { width: 100%; margin: 0 auto; }
.loopwrap { position: relative; width: 100%; }
.loopbar { display: flex; justify-content: flex-end; margin-top: 10px; }
.loopc { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid var(--line-strong); border-radius: 999px; background: var(--surface); color: var(--text-2); }
.phone .loopc { width: 36px; height: 36px; }
.loops { margin: 8px 0 0; padding: 0 0 0 18px; max-width: 900px; font-size: 12px; line-height: 18px; color: #333; }
.file { overflow: hidden; border-radius: 14px; background: var(--code-bg); box-shadow: 0 0 0 1px var(--line), 0 30px 80px -40px rgb(0 0 0 / 0.45); }
.file .fbar { display: flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-bottom: 1px solid var(--line); background: var(--surface-2); }
.file .fbar i { width: 10px; height: 10px; border-radius: 999px; background: var(--line-strong); }
.file .fbar span { display: inline-flex; align-items: center; gap: 6px; margin-left: 10px; font-size: 13px; color: var(--text-2); }
.file pre { margin: 0; padding: 22px 24px 26px; font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.75; color: var(--text-2); white-space: pre; overflow: hidden; }
.file pre b { font-weight: 400; color: var(--text-1); }
.phone .file pre { padding: 16px; font-size: 11.5px; }

.hero2 { position: relative; overflow: hidden; padding: 96px 0 0; }
.phone .hero2 { padding-top: 48px; }
.aurora { position: absolute; left: 50%; top: -260px; width: 1400px; height: 900px; transform: translateX(-50%); background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 34%, transparent), transparent 70%), radial-gradient(40% 50% at 70% 60%, color-mix(in srgb, #7c5cff 18%, transparent), transparent 70%); filter: blur(20px); opacity: var(--aur, 0.9); pointer-events: none; }
.center { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.rel { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border: 1px solid var(--line-strong); border-radius: 999px; background: color-mix(in srgb, var(--surface) 70%, transparent); font-size: 13px; color: var(--text-2); }
.rel > b { font-weight: 500; color: var(--text-1); }
.rel > span:first-child, .rel { }
.rel::before { content: none; }
.h1.xl { margin-top: 22px; font-size: 96px; line-height: 0.98; letter-spacing: -0.045em; background: linear-gradient(180deg, var(--text-1) 40%, color-mix(in srgb, var(--text-1) 62%, transparent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.phone .h1.xl { font-size: 48px; }
.lead.c { margin-left: auto; margin-right: auto; max-width: 700px; }
.phone .center { align-items: flex-start; text-align: left; }
.phone .acts.c { justify-content: flex-start; }
.phone .facts2 { align-items: flex-start; }
.acts.c { justify-content: center; }
.facts2 { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 14px; margin: 26px 0 0; font-size: 14px; color: var(--text-3); }
.facts2 i { width: 3px; height: 3px; border-radius: 999px; background: var(--text-3); }
.facts2 a { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; color: var(--accent-strong); }
.phone .facts2 { flex-direction: column; gap: 6px; }
.phone .facts2 i { display: none; }
.stage { position: relative; max-width: 1240px; margin: 56px auto 0; padding: 0 var(--gut); perspective: 1600px; }
.phone .stage { margin-top: 36px; }
.still { width: 100%; border-radius: 16px; background-repeat: no-repeat; background-color: var(--surface); }
.still.tilt { transform: rotateX(14deg); transform-origin: 50% 100%; border-radius: 18px; box-shadow: 0 0 0 1px var(--line-strong), 0 60px 120px -40px rgb(0 0 0 / 0.55); -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
.still.shadowed { box-shadow: 0 0 0 1px var(--line), 0 30px 80px -40px rgb(0 0 0 / 0.45); }
.playc { position: absolute; left: 50%; bottom: 18%; display: inline-flex; align-items: center; gap: 10px; padding: 10px 18px 10px 12px; border-radius: 999px; background: rgb(0 0 0 / 0.6); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #fff; font-size: 14px; transform: translateX(-50%); }
.playc b { font-weight: 600; }
.phone .playc { position: static; display: flex; width: max-content; margin: 16px 0 0; padding: 0; background: none; -webkit-backdrop-filter: none; backdrop-filter: none; color: var(--text-1); font-size: 15px; transform: none; }
.site .hb2 { padding-top: 120px; }
.site.phone .hb2 { padding-top: 64px; }
.hb2 .doc { margin-top: 4px; }
.site .media2 { padding-top: 32px; }
.hb2.band { margin-top: 120px; padding: 96px 0; background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 7%, transparent) 40%, transparent); }
.site.phone .hb2.band { margin-top: 64px; padding: 56px 0; }
.toolgrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 36px; }
.phone .toolgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tool { position: relative; display: flex; flex-direction: column; gap: 4px; padding: 22px 22px 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); box-shadow: var(--shadow-panel); }
.tool b { font-size: 20px; font-weight: 650; letter-spacing: -0.01em; }
.phone .tool b { font-size: 16px; }
.tool small { font-size: 13px; color: var(--text-3); }
.tool .tic { position: absolute; top: 18px; right: 18px; color: var(--text-3); }
.tool .tdot { position: absolute; top: 18px; right: 18px; width: 8px; height: 8px; border-radius: 999px; background: var(--good); box-shadow: 0 0 0 4px color-mix(in srgb, var(--good) 18%, transparent); }
.tool.lit { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent), 0 20px 50px -20px color-mix(in srgb, var(--accent) 45%, transparent); }
.story2 { display: flex; gap: 36px; align-items: center; }
.phone .story2 { flex-direction: column; align-items: flex-start; gap: 20px; }
.photo { width: 168px; height: 168px; flex: none; border-radius: 999px; background-size: cover; background-position: 50% 30%; box-shadow: 0 0 0 1px var(--line-strong); }
.phone .photo { width: 104px; height: 104px; }
.ph-q { margin: 0; max-width: 640px; padding: 16px 20px; border: 1px dashed var(--line-strong); border-radius: 12px; font-size: 22px; font-weight: 500; color: var(--text-3); }
.c2 .still { margin-top: 4px; border: 1px solid var(--line); }

.hgrid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: center; }
.phone .hgrid { grid-template-columns: minmax(0, 1fr); }
.shot.live { aspect-ratio: 4 / 3; }
.rel { display: inline-flex; align-items: center; gap: 10px; padding: 4px 10px 4px 4px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); font-size: 13px; color: var(--text-2); }
.okp { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--good) 14%, transparent); font-size: 12px; font-weight: 500; color: var(--good); }
.hero.home .h1 { font-size: 68px; }
.phone .hero.home .h1 { font-size: 42px; }
.site .facts { display: flex; flex-wrap: wrap; gap: 8px 24px; padding-top: 28px; padding-bottom: 8px; font-size: 14px; color: var(--text-2); }
.facts span { display: inline-flex; align-items: center; gap: 6px; }
.facts span + span::before { content: '·'; margin-right: 18px; color: var(--text-3); }
.facts .sec { color: var(--accent-strong); font-weight: 500; }
.phone .facts { flex-direction: column; gap: 6px; }
.phone .facts span + span::before { display: none; }
.site .hb { display: flex; flex-direction: column; padding-top: 96px; }
.site.phone .hb { padding-top: 56px; }
.h2 { margin: 12px 0 0; max-width: 760px; font-size: 44px; line-height: 1.08; font-weight: 650; letter-spacing: -0.03em; }
.phone .h2 { font-size: 30px; }
.lead2 { margin: 14px 0 24px; max-width: 640px; font-size: 18px; line-height: 1.55; color: var(--text-2); }
.phone .lead2 { font-size: 16px; }
.hb > .doc { margin-top: 18px; }
.eyebrow .new { margin-left: 4px; padding: 0 6px; border-radius: 999px; background: var(--accent-soft); font-size: 11px; font-weight: 600; line-height: 18px; color: var(--accent-strong); }
.cards2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.phone .cards2 { grid-template-columns: 1fr; }
.c2 { padding: 22px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
.c2 b { font-size: 18px; font-weight: 650; }
.c2 p { margin: 8px 0 16px; font-size: 15px; line-height: 1.55; color: var(--text-2); }
.c2 .inl { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; color: var(--accent-strong); }
.vid { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; font-size: 14px; font-weight: 500; color: var(--text-1); }
.marks { display: flex; flex-wrap: wrap; gap: 10px; }
.mk { display: inline-flex; height: 44px; align-items: center; padding: 0 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); font-size: 15px; font-weight: 600; color: var(--text-1); }
.mk.more { border-style: dashed; font-weight: 400; color: var(--text-3); }
.site .story { flex-direction: row; gap: 32px; align-items: center; }
.site.phone .story { flex-direction: column; align-items: flex-start; gap: 18px; }
.ph-photo { display: grid; width: 140px; height: 140px; flex: none; place-items: center; border-radius: 999px; background: var(--surface-3); font-size: 12px; color: var(--text-3); }
.phone .ph-photo { width: 96px; height: 96px; }
blockquote { margin: 0; max-width: 640px; font-size: 28px; line-height: 1.3; font-weight: 600; letter-spacing: -0.02em; }
.phone blockquote { font-size: 22px; }
.site .host2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: center; }
.site.phone .host2 { grid-template-columns: 1fr; }
.slots { display: flex; flex-wrap: wrap; gap: 12px; }
.slot { display: flex; height: 88px; min-width: 280px; align-items: center; justify-content: center; padding: 0 20px; border: 1px dashed var(--line-strong); border-radius: 12px; font-size: 14px; color: var(--text-3); text-align: center; }
.phone .slot { min-width: 0; width: 100%; }
.hb + .foot-dl { margin-top: 96px; }

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
.media .ph { position: absolute; inset: auto 0 18px; display: grid; place-items: center; font-size: 13px; color: var(--text-3); }
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
  const links = `<nav class="links">${PAGES.map(([n]) => `<a class="${n === on ? 'on' : ''}">${n}</a>`).join('')}</nav>`
  const right =
    width === 'wide'
      ? `<span class="quiet">${icon('file-text', 16)}Docs</span><span class="quiet">${icon('git-branch', 16)}GitHub</span><span class="icn">${icon('sun', 16)}</span>`
      : `<span class="icn" title="Docs">${icon('file-text', 16)}</span><span class="icn" title="GitHub">${icon('git-branch', 16)}</span><span class="icn">${icon('sun', 16)}</span>`
  return `<div class="nav"><div class="wrap in">${logo()}${links}<span class="grow"></span>${right}<span class="dl">${icon('download', 15)}Download</span></div></div>`
}

function sheetMenu(): string {
  return `<div class="sheet2">${PAGES.map(([n]) => `<div class="pg${n === 'For teams' ? ' on' : ''}"><span>${n}</span>${icon('chevron-right', 18)}</div>`).join('')}<div class="pg"><span>About</span>${icon('chevron-right', 18)}</div><div class="sub"><span>${icon('file-text', 16)}Docs</span><span>${icon('git-branch', 16)}GitHub</span></div><div class="seg"><span>System</span><span class="on">Light</span><span>Dark</span></div></div>`
}

function navigation(scheme: Scheme): string {
  const s = (w: number, inner: string) =>
    `<div class="site" style="width:${w}px;${TOKENS[scheme]}--gut:${w > 500 ? 40 : 16}px">${inner}</div>`
  return `<section class="spec"><h2>Navigation<i>one bar; five pages, Docs and GitHub, Download</i></h2>
    <p class="cap">1440</p>${s(1376, bar('wide'))}
    <p class="cap">1024: Docs and GitHub become icons (named for screen readers and in their tooltip)</p>${s(1024, bar('mid'))}
    <div class="row"><div><p class="cap">Phone, closed</p>${s(390, bar('phone'))}</div><div><p class="cap">Phone, open: a full-height sheet</p>${s(390, bar('phone', 'For teams', true) + sheetMenu())}</div></div>
    <p><b>The bar</b>: the logo (home), the five pages in the order marketing set, then at the right Docs and GitHub as quieter links, the theme switch, and <b>Download</b> as the one filled button. The current page is marked with a 2 px accent line under it. It stays on top as the page scrolls, as today, and gets its background once scrolled. <b>At 1024</b> Docs and GitHub become 36 px icons; nothing else goes. <b>Below 960</b> the five pages and Docs and GitHub fold into a menu button; Download stays. <b>About</b> is a footer page on the desktop, not in the bar; the phone’s sheet adds it after the five, since a phone’s footer is far. <b>On a phone</b> the bar is the logo, Download and the menu (44 px). The menu is a full-height sheet under the bar: the five pages and About as 52 px rows, the current one in the accent; Docs and GitHub as two buttons; the theme as a segmented control. The X closes it; so does a page link, Escape and Back. On a phone, Download goes to /download, where the phone gets its own first screen (see the page shape).</p>
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

function downloadFoot(phone = false, lead?: 'cluster'): string {
  if (lead === 'cluster')
    return `<div class="foot-dl"><div class="wrap"><h2>Install it for your team.</h2><p>One Helm chart in your cluster. Nobody else installs anything.</p><div class="acts"><span class="cmd">helm install lumovi oci://ghcr.io/lumovi/charts/lumovi<span class="cp">${icon('copy', 16)}</span></span>${phone ? `<span class="btn2">${icon('share', 16)}Get it on your computer</span>` : `<span class="btn2">${icon('download', 16)}Try it on your computer first</span>`}</div><p class="others">Kubernetes 1.25 or later, and 1.28 or later to sign in with tokens · single sign-on with OIDC or your proxy · <b>every way to install</b></p></div></div>`
  return `<div class="foot-dl"><div class="wrap"><h2>Get Lumovi.</h2><p>Free and open source. No telemetry, no accounts. It uses the kubeconfig you have and never writes to it.</p><div class="acts">${phone ? `<span class="dl big">${icon('share', 18)}Get it on your computer</span>` : `<span class="dl big">${icon('download', 18)}Download for macOS</span>`}<span class="cmd">helm install lumovi oci://ghcr.io/lumovi/charts/lumovi<span class="cp">${icon('copy', 16)}</span></span></div><p class="others">${phone ? 'Opens the share sheet with the download page’s link, to open on your computer.' : 'Also for <b>Windows</b> and <b>Linux</b> · <b>Homebrew</b> · every way to install'}</p></div></div>`
}

function footerInner(phone = false, none = false, home = false): string {
  void phone

  const col = (h: string, links: string[]) =>
    `<div class="fcol"><h4>${h}</h4>${links.map((l) => `<a>${l}</a>`).join('')}</div>`
  return `<div class="footer"><div class="wrap"><div class="fgrid"><div class="fcol">${logo()}<p class="about">A calm, fast Kubernetes dashboard, on your desktop or in your cluster. Free and open source.</p></div>${col('Product', ['The app', 'Plugins', 'AI assistants', 'Download'])}${col('For teams', ['For teams', 'For the people on your team', 'Security'])}${col('Open source', ['Docs', 'GitHub', 'Releases', 'Contributing', 'Licence: Apache 2.0'])}${col('Lumovi', ['Why I built it', 'Brand', 'Privacy', 'security@lumovi.dev'])}</div><div class="slim">${home ? '' : none ? 'Lumovi is free, kept going by its sponsors.' : '<span>Kept bright by its sponsors</span><span class="logos"><span class="smark">Sponsor</span><span class="smark">Sponsor</span><span class="smark">Sponsor</span></span>'}<a class="sall">Sponsor Lumovi${icon('arrow-right', 13)}</a><span class="grow"></span><span class="host">Hosted by <span class="smark">Sevalla</span></span></div><div class="legal"><span>© 2026 Peter Kota</span><span>No tracking, no cookie of our own · Privacy</span></div></div></div>`
}

function footer(scheme: Scheme, phone = false, none = false): string {
  return `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px">${footerInner(phone, none)}</div>`
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
      ['Plugins: tools’ marks → /plugins', 0.6, 'thing'],
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

/** The films' own stills, the app as it really looks, in the reader's theme. */
const POSTER_DIR = new URL('../media/posters/', import.meta.url)
const posterUrl = (name: string, scheme: Scheme) =>
  `data:image/png;base64,${readFileSync(new URL(`${name}-${scheme}.png`, POSTER_DIR)).toString('base64')}`
const peter = () =>
  `data:image/jpeg;base64,${readFileSync(new URL('../../Lumovi-website/src/assets/peter.jpg', import.meta.url)).toString('base64')}`

/**
 * The app's own screenshots (Lumovi, docs/screenshots), 16:10, both themes, read from a fixed
 * commit of the app so a frame never changes with whatever branch the checkout is on.
 */
const APP_REPO = fileURLToPath(new URL('../../Lumovi/', import.meta.url))
const SHOTS_AT = '333bba178dbf2fe217b15a1e88a0fdb684e16960'
const shotUrl = (name: string, scheme: Scheme) =>
  `data:image/webp;base64,${execFileSync('git', ['-C', APP_REPO, 'show', `${SHOTS_AT}:docs/screenshots/${name}-${scheme}.webp`], { maxBuffer: 64 << 20 }).toString('base64')}`

/**
 * A still, framed: the image is shown at `scale` of the frame's width, its point `at` (x% y%)
 * kept in view, so one still can show the window whole or one part of it close.
 */
const still = (
  src: string,
  o: { ratio?: string; scale?: number; at?: string; cls?: string } = {},
) =>
  `<div class="still ${o.cls ?? ''}" style="aspect-ratio:${o.ratio ?? '16 / 9'};background-image:url(${src});background-size:${(o.scale ?? 1) * 100}% auto;background-position:${o.at ?? '50% 50%'}"></div>`

/**
 * A region of a 16:9 still, as fractions of its width and height, turned into what `still` takes:
 * the frame then shows exactly that region, edge to edge, at its own shape.
 */
const region = (x0: number, x1: number, y0: number, y1: number, aspect = 9 / 16) => {
  const w = x1 - x0
  const h = y1 - y0
  const scale = 1 / w
  const ratio = `${(1 / (h * scale * aspect)).toFixed(3)} / 1`
  const pct = (a: number, span: number) => (span >= 1 ? 50 : (a / (1 - span)) * 100)
  return { scale, ratio, at: `${pct(x0, w).toFixed(2)}% ${pct(y0, h).toFixed(2)}%` }
}

/** The regions of the films' stills the pages use: each a clean, readable moment, nothing named that isn't Lumovi's. */
const CROPS = {
  /** The overview window, from its tiles down: no address line. */
  heroWindow: region(0.33, 0.955, 0.4, 0.975),
  /** Access rules, the first columns with their row names whole. */
  accessLeft: region(0.025, 0.475, 0.0, 0.78),
  /** Access rules, the later columns. */
  accessRight: region(0.475, 0.975, 0.0, 0.78),
  /** The approval: its reason and the change, no title row, no manifest row. */
  approval: region(0.282, 0.771, 0.15, 0.63),
  /** The approval's foot: its kubectl command, the time it waits, Reject and Approve. */
  approvalFoot: region(0.282, 0.771, 0.71, 0.925),
  /** On a phone, close enough to read: the cluster's verdict and the two changed lines. */
  approvalPhone: region(0.29, 0.62, 0.3, 0.5),
  /** The app's screenshots (16:10). Needs attention and recent warnings, no sidebar. */
  attention: region(0.185, 0.972, 0.09, 0.635, 10 / 16),
  /** Karpenter's page: its tiles, pools and nodes, no sidebar. */
  karpenter: region(0.18, 0.975, 0.07, 0.93, 10 / 16),
  /** The map: the deployment's map, its header to its nodes, no sidebar. */
  map: region(0.18, 0.985, 0.07, 0.93, 10 / 16),
  /** The clusters window: the list, no empty margins. */
  clusters: region(0.24, 0.76, 0.07, 0.7, 10 / 16),
  /** The scale dialog with its kubectl command. */
  scaleDialog: region(0.325, 0.675, 0.12, 0.7, 10 / 16),
  /** Right-sizing: its tiles and the first workload opened. */
  rightsizing: region(0.18, 0.975, 0.12, 0.87, 10 / 16),
  /** Sign-in: the card, centred. */
  signIn: region(0.3, 0.7, 0.24, 0.66, 10 / 16),
  /** The fleet: its count, filters and cluster cards, below the window's title row. */
  fleet: region(0.105, 0.895, 0.075, 0.65, 10 / 16),
  /** Access rules: the table, no sidebar. */
  accessRules: region(0.07, 0.93, 0.06, 0.9, 10 / 16),
  /** The audit log: the integrity check that holds, no rows (no names of others). */
  auditHold: region(0, 1, 0, 0.36, 10 / 16),
  /** Your access, close enough to read: You, and two clusters' first columns. */
  yourAccess: region(0.075, 0.6, 0.18, 0.505, 10 / 16),
  /** A plugin's list, no sidebar. */
  pluginList: region(0.172, 0.995, 0.0, 0.49, 10 / 16),
  /** API resources: the custom resources by group, no sidebar. */
  apiResources: region(0.172, 0.995, 0.0, 0.62, 10 / 16),
  /** The Monday film's still, its table whole. */
  monday: region(0, 1, 0, 0.8),
  /** Assistants: the title and "On this computer", above the list of other tools' tabs. */
  assistantsTop: region(0.07, 0.93, 0.08, 0.37, 10 / 16),
  /** Assistant permissions: the counts and the defaults. */
  assistantDefaults: region(0.07, 0.685, 0.05, 0.53, 10 / 16),
  /** The session's changes, from the bar: what was done and what was refused. */
  activity: region(0.666, 0.957, 0.064, 0.408, 10 / 16),
  /**
   * On a phone, each still is cropped to its one point at the capture's own size or larger (the
   * column is 358 px, a quarter of a 1440 px screen), so its text is 11 px or more, never shrunk.
   */
  /** Workloads: the tabs, the counts by status, and the first workloads by name. */
  workloadsPhone: region(0.18, 0.43, 0.07, 0.415, 10 / 16),
  /** Needs attention: each problem's status and what it is. */
  attentionNear: region(0.195, 0.45, 0.105, 0.445, 10 / 16),
  /** The clusters window: each cluster's dot, checked, and its name. */
  clustersPhone: region(0.255, 0.505, 0.265, 0.6, 10 / 16),
  /** The map: the deployment, what leads to it and what it uses. */
  mapPhone: region(0.42, 0.67, 0.29, 0.82, 10 / 16),
  /** Right-sizing: the CPU tile, and the first workload's CPU opened. */
  rightsizingPhone: region(0.185, 0.435, 0.17, 0.62, 10 / 16),
  /** Karpenter: the node pools ready, and each pool, the one failing first. */
  karpenterPhone: region(0.19, 0.44, 0.125, 0.52, 10 / 16),
  /** The fleet: one cluster's card. */
  fleetPhone: region(0.375, 0.625, 0.3, 0.64, 10 / 16),
  /** Access rules: the first grants, each with its group and where. */
  accessRulesPhone: region(0.075, 0.33, 0.27, 0.6, 10 / 16),
  /** The audit log: its title and the check that holds. */
  auditPhone: region(0.012, 0.262, 0.225, 0.355, 10 / 16),
  /** Your access: the You card, with the groups that decide it. */
  yourAccessPhone: region(0.078, 0.298, 0.185, 0.505, 10 / 16),
  /** Flux's list: its counts by status, and its objects by name. */
  pluginListPhone: region(0.18, 0.43, 0.0, 0.47, 10 / 16),
  /** API resources: the custom resources' kinds, by group. */
  apiResourcesPhone: region(0.18, 0.43, 0.135, 0.62, 10 / 16),
  /** Assistants: the title, the tabs and "On this computer". */
  assistantsPhone: region(0.08, 0.33, 0.09, 0.36, 10 / 16),
  /** Assistant permissions: one namespace checked, setting by setting. */
  permissionsPhone: region(0.695, 0.905, 0.06, 0.6, 10 / 16),
  /** The Monday film: what everyone may do, row by row. */
  mondayPhone: region(0.025, 0.36, 0.0, 0.5),
  /** The same, for a card: the rows and what everyone may do. */
  accessLeftPhone: region(0.025, 0.32, 0.0, 0.5),
  /** The same, for a card: what the platform team and developers may do. */
  accessRightPhone: region(0.33, 0.62, 0.0, 0.5),
  /** The approval on a phone, as the page's picture: why, and the change. */
  approvalNear: region(0.282, 0.58, 0.15, 0.62),
  /** The approval's foot on a phone: its kubectl command and the time it waits. */
  approvalFootNear: region(0.282, 0.58, 0.71, 0.925),
  /** Sign-in on a phone: the button and its line. */
  signInPhone: region(0.375, 0.625, 0.315, 0.6, 10 / 16),
  /** The scale dialog on a phone: its title, the number, and the kubectl command's start. */
  scalePhone: region(0.345, 0.595, 0.125, 0.62, 10 / 16),
  /** The session's changes on a phone: the change that was refused, and the way to the audit log. */
  activityPhone: region(0.672, 0.92, 0.226, 0.408, 10 / 16),
  /** A whole window, sidebar and all. */
  window: region(0, 1, 0, 1, 10 / 16),
}

/** The home page: short, a block a phone screen, each pointing to its page; the app is the picture. */
function homePage(scheme: Scheme, phone = false): string {
  const P = (n: string) => posterUrl(n, scheme)
  const more = (to: string) => `<span class="doc">${to}${icon('arrow-right', 14)}</span>`
  const hero = `<div class="hero2"><div class="aurora"></div><div class="wrap center"><span class="rel">New<b>Lumovi 1.22 is out</b>${icon('arrow-right', 13)}</span><h1 class="h1 xl">Your clusters,<br>at a glance.</h1><p class="lead c">Lumovi is a calm, fast Kubernetes dashboard, on your desktop or in your cluster. Run it in your cluster for your whole team: everyone signs in as themselves, sees only what their own Kubernetes access allows, and what’s done is on the record.</p><div class="acts c">${phone ? `<span class="dl big">${icon('share', 18)}Get it on your computer</span><span class="btn2">Install in your cluster</span>` : `<span class="dl big">${icon('download', 18)}Download for macOS</span><span class="btn2">Install in your cluster</span>`}</div><p class="facts2"><span>Free and open source</span><i></i><span>No telemetry, no accounts</span><i></i><span>macOS, Windows, Linux, or your cluster</span><i></i><a>${icon('shield-check', 14)}How it’s kept secure</a></p></div>
    <div class="stage">${phone ? still(shotUrl('workloads', scheme), { ...CROPS.workloadsPhone, cls: 'shadowed' }) : still(P('hero-v1'), { ...CROPS.heroWindow, cls: 'tilt' })}<span class="playc">${icon('play', 22)}<b>Lumovi in a minute</b></span></div></div>`
  const block = (
    eyebrow: string,
    title: string,
    lead: string,
    body: string,
    to: string,
    cls = '',
  ) =>
    `<section class="hb2 ${cls}"><div class="wrap"><span class="eyebrow">${eyebrow}</span><h2 class="h2">${title}</h2><p class="lead2">${lead}</p>${more(to)}</div><div class="wrap media2">${body}</div></section>`
  const glance = block(
    `${icon('layout-dashboard', 14)}The app`,
    'Problems first.',
    'Pick a cluster, and Lumovi says what’s wrong before you’ve typed a thing: what’s failing comes first, then its logs, the map and the fix, a click away.',
    looped(
      still(shotUrl('overview-attention', scheme), {
        ...(phone ? CROPS.attentionNear : CROPS.attention),
        cls: 'shadowed',
      }),
    ),
    'See the app',
  )
  const teams = block(
    `${icon('users', 14)}For teams`,
    'Give it to your whole team.',
    'Install one Helm chart in your cluster. Everyone signs in as themselves, and what’s done is on the record.',
    `<div class="cards2"><div class="c2"><b>Everyone, as themselves</b><p>Single sign-on, and each person sees and changes only what their own Kubernetes access allows.</p>${still(P('monday-v2'), phone ? CROPS.accessLeftPhone : CROPS.accessLeft)}</div><div class="c2"><b>Who may do what, and who did</b><p>Decide more on top of RBAC, team by team, and keep a record of what’s done. <span class="inl">How it’s kept secure${icon('arrow-right', 12)}</span></p>${still(P('monday-v2'), phone ? CROPS.accessRightPhone : CROPS.accessRight)}</div></div><div class="vid">${icon('play', 16)}Watch “Monday”, 1 min</div>`,
    'For teams',
  )
  const tools = ['Karpenter', 'Argo CD', 'Flux', 'CloudNativePG', 'cert-manager', 'Istio']
  const plugins = `<section class="hb2 band"><div class="wrap"><span class="eyebrow">${icon('plug', 14)}Plugins</span><h2 class="h2">The tools your cluster runs, a click away.</h2><p class="lead2">When Karpenter, Argo CD, Flux or CloudNativePG is in your cluster, it gets a page of its own in Lumovi, with what’s failing first.</p>${more('Plugins')}</div><div class="wrap media2">${still(shotUrl('karpenter', scheme), { ...(phone ? CROPS.karpenterPhone : CROPS.karpenter), cls: 'shadowed' })}</div><div class="wrap"><div class="toolgrid">${tools.map((n, k) => `<div class="tool${k === 0 ? ' lit' : ''}"><span class="tic">${icon('plug', 16)}</span><b>${n}</b><small>${k < 4 ? 'a page of its own' : 'its kinds, its status'}</small></div>`).join('')}</div></div></section>`
  const ai = block(
    `${icon('sparkles', 14)}AI assistants`,
    'Your assistant, with you in charge.',
    'Any AI agent or assistant that speaks MCP works through Lumovi, as you. Where your permissions say so, its changes wait for you with the diff, the reason and the kubectl command.',
    looped(
      still(P('asked-first-v2'), {
        ...(phone ? CROPS.approvalPhone : CROPS.approval),
        cls: 'shadowed',
      }),
    ),
    'AI assistants',
  )
  const story = `<section class="hb2"><div class="wrap story2"><div class="photo" style="background-image:url(${peter()})"></div><div><blockquote class="ph-q">Péter’s pull quote, in his own words</blockquote><p class="lead2">Why Lumovi exists, who builds it, and how it stays free.</p>${more('Why I built it')}</div></div></section>`
  const sevalla = `<section class="hb2"><div class="wrap host2"><div><span class="eyebrow">Rather not run Kubernetes?</span><h2 class="h2">Sevalla keeps the clusters out of your way.</h2><p class="lead2">Push your code and Sevalla builds your app, runs it and scales it on Kubernetes, with its databases next to it. You pay for the resources you use, and you never write a manifest.</p>${more('sevalla.com')}</div><div class="shot">Sevalla’s scene, as today</div></div></section>`
  const sponsors = `<section class="hb2"><div class="wrap"><span class="eyebrow">${icon('heart', 14)}Sponsors</span><h2 class="h2">Kept going by its sponsors.</h2><p class="lead2">Lumovi is free and open source, and its sponsors help keep it going.</p><div class="slots"><span class="slot">Your logo and a link here, and in every page’s footer, with the Lighthouse and Daylight tiers.</span></div><div class="acts" style="margin-top:20px"><span class="btn2">${icon('heart', 16)}Sponsor Lumovi</span></div></div></section>`
  const inner = `${bar(phone ? 'phone' : 'wide', '')}${hero}${glance}${teams}${plugins}${ai}${story}${sevalla}${sponsors}${downloadFoot(phone)}${footerInner(phone, true, true)}`
  return `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px">${inner}</div>`
}

/**
 * A block's loop: muted, a few seconds, played while in view, its poster the still drawn here. Its
 * pause button is the one control it has, under the picture so it never covers what the loop
 * shows; under reduced motion it stays its poster.
 */
const looped = (still: string) =>
  `<div class="loopwrap">${still}<div class="loopbar"><span class="loopc" title="Pause">${icon('pause', 13)}</span></div></div>`

/** What a part's page shows in one of its things: a film's still or the app's screenshot, cropped, or a screen the launch capture is to take. */
type Pic =
  | {
      poster: string
      scale?: number
      at?: string
      ratio?: string
      fit?: number
      phone?: Pic
      loop?: string
    }
  | {
      shot: string
      scale?: number
      at?: string
      ratio?: string
      fit?: number
      phone?: Pic
      loop?: string
    }
  | { capture: string }
  | { file: string; code: string }

interface Part {
  path: string
  eyebrow: [IconName, string]
  title: string
  lead: string
  actions: [primary: string, secondary: string]
  hero: Pic
  film?: string
  things: { title: string; body: string; doc: string; pic: Pic; id?: string }[]
  docs: string[]
  foot?: 'cluster'
}

/** A file's lines, its keys in the ink and its values quieter, as the docs' code blocks set them. */
const yaml = (code: string) =>
  code
    .split('\n')
    .map((l) => l.replace(/^(\s*(?:- )?)([\w.]+:)(.*)$/, '$1<b>$2</b>$3'))
    .join('\n')

const pic = (q: Pic, scheme: Scheme, cls = '', phone = false): string => {
  const p = phone && 'phone' in q && q.phone ? q.phone : q
  const loop = 'loop' in q && q.loop
  if ('capture' in p)
    return `<div class="scene ${cls}"><span class="sc-dot"></span><span>${p.capture}</span><small>from the launch capture: not in the app’s screenshots yet</small></div>`
  if ('file' in p)
    return `<div class="file ${cls}"><div class="fbar"><i></i><i></i><i></i><span>${icon('file-text', 13)}${p.file}</span></div><pre>${yaml(p.code)}</pre></div>`
  const s = still('shot' in p ? shotUrl(p.shot, scheme) : posterUrl(p.poster, scheme), {
    ratio: p.ratio ?? '16 / 10',
    scale: p.scale ?? 1,
    at: p.at,
    cls: `shadowed ${cls}`,
  })
  // A close crop of a small part is shown at about its size in the app, not blown up.
  const fitted = p.fit ? `<div class="fit" style="max-width:${p.fit}px">${s}</div>` : s
  return loop ? looped(fitted) : fitted
}

/** One part's page, from the shared shape: headline and media, its things, the docs, the foot. */
function partPage(part: Part, scheme: Scheme, phone = false): string {
  const hero = `<div class="hero2 part"><div class="aurora" style="opacity:.55"></div><div class="wrap"><span class="eyebrow">${icon(part.eyebrow[0], 14)}${part.eyebrow[1]}</span><h1 class="h1 xl part">${part.title}</h1><p class="lead">${part.lead}</p><div class="acts">${phone && part.actions[0].startsWith('Download') ? `<span class="dl big">${icon('share', 18)}Get it on your computer</span>` : `<span class="dl big">${icon(part.foot === 'cluster' ? 'ship-wheel' : 'download', 18)}${part.actions[0]}</span>`}<span class="btn2">${part.actions[1]}</span></div></div><div class="stage">${pic(part.hero, scheme, phone ? '' : 'tilt', phone)}${part.film ? `<span class="playc">${icon('play', 22)}<b>${part.film}</b></span>` : ''}</div></div>`
  const things = part.things
    .map(
      (t, k) =>
        `<div class="thing${k % 2 ? ' r' : ''}"${t.id ? ` id="${t.id}"` : ''}><div class="tx"><h3>${t.title}</h3><p>${t.body}</p><span class="doc">${icon('file-text', 14)}${t.doc}${icon('arrow-right', 14)}</span></div>${pic(t.pic, scheme, '', phone)}</div>`,
    )
    .join('')
  const docs = `<div class="wrap docs"><h4>In the docs</h4><div class="dlinks">${part.docs.map((d) => `<span>${icon('file-text', 14)}${d}</span>`).join('')}</div></div>`
  const inner = `${bar(phone ? 'phone' : 'wide', PAGES.find(([, path]) => path === part.path)?.[0] ?? '')}${hero}<div class="wrap things">${things}</div>${docs}${downloadFoot(phone, part.foot)}${footerInner(phone, true)}`
  return `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px">${inner}</div>`
}

const APP: Part = {
  path: '/app',
  eyebrow: ['layout-dashboard', 'The app'],
  title: 'One calm window for every cluster you have.',
  lead: 'Problems first, then the map, the logs and the fix, a click away. On your desktop, or in your cluster for the whole team.',
  actions: ['Download for macOS', 'Install in your cluster'],
  hero: {
    shot: 'workloads',
    ...CROPS.window,
    phone: { shot: 'workloads', ...CROPS.workloadsPhone },
  },
  film: 'It’s 2 a.m., 1 min',
  things: [
    {
      id: 'clusters',
      title: 'Every cluster, checked before you open one.',
      body: 'Lumovi reads your kubeconfig and checks that each cluster answers, so you know which one to open before you click.',
      doc: 'Clusters',
      pic: {
        shot: 'clusters',
        ...CROPS.clusters,
        phone: { shot: 'clusters', ...CROPS.clustersPhone },
      },
    },
    {
      id: 'problems',
      title: 'Problems first.',
      body: 'What’s failing comes first, with its reason in plain words. Its logs, its events and the palette are a key away.',
      doc: 'Problems',
      pic: {
        loop: 'problems',
        shot: 'overview-attention',
        ...CROPS.attention,
        phone: { shot: 'overview-attention', ...CROPS.attentionNear },
      },
    },
    {
      id: 'map',
      title: 'What routes to what.',
      body: 'The map shows a workload with what it serves, mounts and needs, and says what’s missing.',
      doc: 'The map',
      pic: { loop: 'map', shot: 'map', ...CROPS.map, phone: { shot: 'map', ...CROPS.mapPhone } },
    },
    {
      id: 'rollback',
      title: 'Every change dialog shows its kubectl.',
      body: 'Many can be taken back with one click, and a Helm release rolls back to any revision.',
      doc: 'Undo and activity',
      pic: {
        loop: 'rollback',
        shot: 'scale',
        ...CROPS.scaleDialog,
        phone: { shot: 'scale', ...CROPS.scalePhone },
      },
    },
    {
      id: 'capacity',
      title: 'Where your capacity goes, and why a pod can’t start.',
      body: 'Requests, limits and use, by node and namespace, and the scheduler’s reason in plain words when a pod waits.',
      doc: 'Health and capacity',
      pic: {
        loop: 'right-sizing',
        shot: 'right-sizing',
        ...CROPS.rightsizing,
        phone: { shot: 'right-sizing', ...CROPS.rightsizingPhone },
      },
    },
  ],
  docs: ['Get started', 'Clusters', 'Problems', 'The map', 'Logs', 'Undo and activity', 'Helm'],
}

const TEAMS: Part = {
  path: '/teams',
  eyebrow: ['users', 'For teams'],
  title: 'The same app, for your whole team.',
  lead: 'Install one Helm chart in your cluster. Everyone signs in as themselves, sees only what their own Kubernetes access allows, and what’s done is on the record.',
  actions: ['Install in your cluster', 'Try it on your computer'],
  hero: {
    poster: 'monday-v2',
    ...CROPS.monday,
    phone: { poster: 'monday-v2', ...CROPS.mondayPhone },
  },
  film: 'Monday, 1 min',
  foot: 'cluster',
  things: [
    {
      title: 'One chart, one sign-in.',
      body: 'You install one Helm chart; nobody else installs anything. People sign in with your identity provider, or through the proxy you already run, and Lumovi acts as each of them.',
      doc: 'Install in a cluster',
      pic: {
        shot: 'server-single-sign-on',
        ...CROPS.signIn,
        phone: { shot: 'server-single-sign-on', ...CROPS.signInPhone },
      },
    },
    {
      title: 'Every cluster at once, private ones too.',
      body: 'An agent in each private cluster dials out, so the clusters behind a firewall stand beside the rest, with what needs attention first.',
      doc: 'Fleet',
      pic: { shot: 'fleet', ...CROPS.fleet, phone: { shot: 'fleet', ...CROPS.fleetPhone } },
    },
    {
      id: 'access',
      title: 'Who may do what.',
      body: 'Profiles, grants and limits on top of RBAC, team by team. Check what anyone may do; everyone sees their own, and why.',
      doc: 'Access rules',
      pic: {
        shot: 'access-rules',
        ...CROPS.accessRules,
        phone: { shot: 'access-rules', ...CROPS.accessRulesPhone },
      },
    },
    {
      id: 'record',
      title: 'And who did.',
      body: 'Changes, shells, Secrets read, sign-ins and assistants’ calls, kept in your cluster, sent on to your log pipeline, and checkable event by event.',
      doc: 'The audit log',
      pic: {
        loop: 'audit',
        shot: 'audit-checked',
        ...CROPS.auditHold,
        phone: { shot: 'audit-checked', ...CROPS.auditPhone },
      },
    },
    {
      id: 'everyone',
      title: 'For the people on your team.',
      body: 'Sign in with the company account. See your own namespaces, problems first, with logs and rollback a click away, and only what your access allows.',
      doc: 'Signing in',
      pic: {
        shot: 'your-access',
        ...CROPS.yourAccess,
        phone: { shot: 'your-access', ...CROPS.yourAccessPhone },
      },
    },
  ],
  docs: [
    'Install in a cluster',
    'Single sign-on',
    'Fleet',
    'Access rules',
    'The audit log',
    'Your access',
  ],
}

const PLUGINS: Part = {
  path: '/plugins',
  eyebrow: ['plug', 'Plugins'],
  title: 'The tools your cluster runs, a click away.',
  lead: 'When Karpenter, Argo CD, Flux or CloudNativePG is in your cluster, it gets a page of its own in Lumovi, with what’s failing first.',
  actions: ['Download for macOS', 'Install in your cluster'],
  hero: {
    shot: 'karpenter',
    ...CROPS.window,
    phone: { shot: 'karpenter', ...CROPS.karpenterPhone },
  },
  things: [
    {
      title: 'It appears when its tool does.',
      body: 'Install Flux, and Flux is in the sidebar, with its kinds in one list and what’s failing at the top.',
      doc: 'Plugins',
      pic: {
        shot: 'plugin',
        ...CROPS.pluginList,
        phone: { shot: 'plugin', ...CROPS.pluginListPhone },
      },
    },
    {
      title: 'Safe by design.',
      body: 'A plugin is a file, not code, with no access of its own: it reads and changes only as you.',
      doc: 'Write a plugin',
      pic: {
        file: 'queues.yaml',
        code: 'apiVersion: lumovi.dev/v1beta1\nkind: Plugin\nmetadata: { name: queues }\nspec:\n  version: 1.0.0\n  needs:\n    lumovi: 1.22.0\n  groups: [messaging.example.com]\n  views:\n    - kinds: [{ group: messaging.example.com, kind: Queue }]\n      columns: [{ name: Depth, path: .status.depth, type: number }]',
      },
    },
    {
      id: 'more',
      title: 'Every other kind, too.',
      body: 'Any custom resource the cluster serves has its list, with the columns kubectl gets, its details and its YAML.',
      doc: 'Custom resources',
      pic: {
        shot: 'api-resources',
        ...CROPS.apiResources,
        phone: { shot: 'api-resources', ...CROPS.apiResourcesPhone },
      },
    },
  ],
  docs: ['Plugins', 'Included plugins', 'Write a plugin', 'Custom resources'],
}

const AI: Part = {
  path: '/ai',
  eyebrow: ['sparkles', 'AI assistants'],
  title: 'Your assistant, with you in charge.',
  lead: 'Any AI agent or assistant that speaks MCP works through Lumovi, as you. Where your permissions say so, its changes wait for you with the diff, the reason and the kubectl command.',
  actions: ['Download for macOS', 'Install in your cluster'],
  hero: {
    poster: 'asked-first-v2',
    ...CROPS.approval,
    phone: { poster: 'asked-first-v2', ...CROPS.approvalNear },
  },
  film: 'It asked first, 1 min',
  things: [
    {
      title: 'Any assistant, as you.',
      body: 'Lumovi is an MCP server: connect any agent or assistant that speaks it, and it works with your access, never more.',
      doc: 'Connect an assistant',
      pic: {
        shot: 'assistants',
        ...CROPS.assistantsTop,
        phone: { shot: 'assistants', ...CROPS.assistantsPhone },
      },
    },
    {
      title: 'The cluster tries it first.',
      body: 'A change is dry-run by the cluster, then waits for you with the diff, the reason and the kubectl command, until you approve or reject it.',
      doc: 'Approvals',
      pic: {
        loop: 'approval',
        poster: 'asked-first-v2',
        ...CROPS.approvalFoot,
        phone: { poster: 'asked-first-v2', ...CROPS.approvalFootNear },
      },
    },
    {
      title: 'What it may do, and see.',
      body: 'By cluster and namespace: ask, go ahead, or never. And whether it may read Secrets, environment values and logs.',
      doc: 'Assistant permissions',
      pic: {
        shot: 'assistant-permissions',
        ...CROPS.assistantDefaults,
        phone: { shot: 'assistant-permissions', ...CROPS.permissionsPhone },
      },
    },
    {
      title: 'On the record.',
      body: 'Everything an assistant does through Lumovi is in the audit log, with the assistant’s name beside yours.',
      doc: 'The audit log',
      pic: {
        shot: 'assistant-activity',
        ...CROPS.activity,
        fit: 460,
        phone: { shot: 'assistant-activity', ...CROPS.activityPhone },
      },
    },
  ],
  docs: ['Connect an assistant', 'Approvals', 'Assistant permissions', 'The audit log'],
}

/** /security, /download and /about: their own parts, beside the shared shape. */
const CSS3 = `
.sx-index { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 44px; }
.phone .sx-index { grid-template-columns: minmax(0, 1fr); gap: 0; margin-top: 32px; border-top: 1px solid var(--line); }
.sx-card { position: relative; display: flex; flex-direction: column; gap: 6px; padding: 18px 18px 20px; border: 1px solid var(--line); border-radius: 14px; background: color-mix(in srgb, var(--surface) 82%, transparent); box-shadow: var(--shadow-panel); }
.sx-card .n { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-3); }
.sx-card .ic { position: absolute; top: 16px; right: 16px; color: var(--text-3); }
.sx-card b { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.sx-card small { font-size: 13px; line-height: 1.5; color: var(--text-2); }
.phone .sx-card { flex-direction: row; align-items: center; gap: 12px; min-height: 56px; padding: 10px 0; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: none; box-shadow: none; }
.phone .sx-card .ic { position: static; order: -1; }
.phone .sx-card small, .phone .sx-card .n { display: none; }
.phone .sx-card .go { margin-left: auto; color: var(--text-3); }
.sx-card .go { display: none; }
.phone .sx-card .go { display: block; }
.sx { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 56px; padding: 64px 0; border-top: 1px solid var(--line); }
.phone .sx { grid-template-columns: minmax(0, 1fr); gap: 18px; padding: 40px 0; }
.sx .hd .n { display: block; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--text-3); }
.sx .hd h3 { margin: 0; font-size: 30px; line-height: 1.12; font-weight: 650; letter-spacing: -0.025em; }
.phone .sx .hd h3 { font-size: 24px; }
.sx .bd > p { margin: 0; max-width: 640px; font-size: 17px; line-height: 1.65; color: var(--text-2); }
.sx .bd > p + * { margin-top: 24px; }
.sx .bd .still { max-width: 720px; }
.sx-table { width: 100%; max-width: 720px; border-collapse: separate; border-spacing: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); font-size: 14px; }
.sx-table th { padding: 10px 14px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; font-weight: 600; text-align: left; color: var(--text-3); }
.sx-table td { padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; line-height: 1.45; color: var(--text-2); }
.sx-table tr:last-child td { border-bottom: 0; }
.sx-table td:first-child { font-weight: 500; color: var(--text-1); }
.phone .sx-table { font-size: 13px; }
.phone .sx-table th, .phone .sx-table td { padding: 9px 10px; }
.sx-facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); max-width: 720px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.phone .sx-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.sx-facts div { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; }
.sx-facts div + div { border-left: 1px solid var(--line); }
.phone .sx-facts div:nth-child(3) { border-left: 0; }
.phone .sx-facts div:nth-child(n + 3) { border-top: 1px solid var(--line); }
.sx-facts span { font-size: 12px; color: var(--text-3); }
.sx-facts b { font-size: 16px; font-weight: 600; }
.sx-list { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; max-width: 640px; }
.sx-list li { display: flex; gap: 10px; font-size: 15px; line-height: 1.55; color: var(--text-2); }
.sx-list li > svg.i { margin-top: 3px; color: var(--text-3); }
.sx-list li b { font-weight: 500; color: var(--text-1); }
.term { max-width: 720px; overflow: hidden; border-radius: 12px; background: #0e0e0e; box-shadow: 0 0 0 1px var(--line-strong), 0 30px 80px -40px rgb(0 0 0 / 0.5); }
.term .tb { display: flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-bottom: 1px solid rgb(255 255 255 / 0.07); }
.term .tb i { width: 10px; height: 10px; border-radius: 999px; background: rgb(255 255 255 / 0.14); }
.term .tb span { margin-left: 8px; font-size: 12px; color: #8f8f8f; }
.term pre { margin: 0; padding: 16px 18px 18px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; color: #d4d4d4; white-space: pre-wrap; word-break: break-all; }
.term pre .c { color: #8f8f8f; }
.term pre .p { color: #8f8f8f; }
.phone .term pre { font-size: 11.5px; padding: 12px; }
.report { display: flex; align-items: center; gap: 18px; max-width: 720px; padding: 22px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-panel); }
.phone .report { flex-direction: column; align-items: flex-start; gap: 12px; padding: 18px; }
.report .ic { display: grid; width: 48px; height: 48px; flex: none; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-1); }
.report b { display: block; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 500; }
.phone .report b { font-size: 17px; }
.report small { display: block; margin-top: 4px; font-size: 14px; color: var(--text-2); }
.report .btn2 { margin-left: auto; }
.phone .report .btn2 { margin-left: 0; width: 100%; justify-content: center; }
.notyet { margin: 8px 0 64px; padding: 28px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface-2); }
.phone .notyet { margin-bottom: 40px; padding: 20px; }
.notyet h3 { margin: 0 0 6px; font-size: 22px; font-weight: 650; letter-spacing: -0.02em; }
.notyet > p { margin: 0 0 18px; font-size: 15px; color: var(--text-2); }

.dlh { display: flex; flex-direction: column; align-items: center; text-align: center; }
.phone .dlh { align-items: flex-start; text-align: left; }
.appicon { width: 112px; height: 112px; filter: drop-shadow(0 24px 48px rgb(0 0 0 / 0.35)); }
.phone .appicon { width: 72px; height: 72px; }
.dl-status { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px 16px; margin-top: 22px; font-size: 14px; color: var(--text-2); }
.phone .dl-status { justify-content: flex-start; }
.dl-status a { color: var(--accent-strong); font-weight: 500; }
.latest { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px 2px 6px; border-radius: 999px; background: color-mix(in srgb, var(--good) 14%, transparent); font-size: 12.5px; font-weight: 500; color: var(--good); }
.track2 { display: flex; align-items: baseline; gap: 14px; margin: 72px 0 18px; }
.phone .track2 { flex-direction: column; gap: 4px; margin-top: 48px; }
.track2 h2 { margin: 0; font-size: 30px; font-weight: 650; letter-spacing: -0.025em; }
.phone .track2 h2 { font-size: 24px; }
.track2 span { font-size: 14px; color: var(--text-3); }
.yours { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: center; padding: 32px; border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--line)); border-radius: 20px; background: var(--surface); box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent), 0 30px 80px -36px color-mix(in srgb, var(--accent) 50%, transparent); }
.yours h3 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 28px; font-weight: 650; letter-spacing: -0.02em; }
.yours .pill2 { padding: 2px 9px; border-radius: 999px; background: var(--accent-soft); font-size: 12px; font-weight: 600; color: var(--accent-strong); }
.yours p { margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: var(--text-2); }
.yours .btns { display: flex; gap: 10px; }
.yours .more { grid-column: 1 / -1; padding-top: 18px; line-height: 2.4; border-top: 1px solid var(--line); font-size: 14px; color: var(--text-2); }
.yours .more a { color: var(--accent-strong); font-weight: 500; }
.yours .more .cmd { margin-left: 8px; vertical-align: middle; }
.hero2.part.flat { padding-bottom: 40px; }
.size { margin-left: 4px; font-weight: 400; opacity: 0.75; }
.plats { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; margin-top: 16px; }
.phone .plats { grid-template-columns: minmax(0, 1fr); }
.plat { padding: 24px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); }
.phone .plat { padding: 18px; }
.plat h3 { margin: 0; font-size: 20px; font-weight: 650; }
.plat > p { margin: 6px 0 16px; font-size: 14px; line-height: 1.55; color: var(--text-2); }
.plat .note { margin: 14px 0 0; font-size: 13px; color: var(--text-3); }
.ltable { width: 100%; border-collapse: collapse; font-size: 14px; }
.ltable th { padding: 8px 0; font-size: 12px; font-weight: 500; text-align: left; color: var(--text-3); }
.ltable td, .ltable tbody th { padding: 9px 0; border-top: 1px solid var(--line); }
.ltable tbody th { font-size: 14px; font-weight: 500; color: var(--text-1); }
.ltable td { color: var(--accent-strong); font-weight: 500; }
.ltable td svg.i { margin-right: 6px; }
.btn3 { display: inline-flex; height: 44px; align-items: center; gap: 8px; padding: 0 16px; border: 1px solid var(--line-strong); border-radius: 10px; background: var(--surface-2); font-size: 15px; font-weight: 600; color: var(--text-1); }
.dl.mid { height: 44px; padding: 0 16px; border-radius: 10px; font-size: 15px; }
.phone .yours { grid-template-columns: minmax(0, 1fr); padding: 20px; }
.phone .yours .btns { flex-direction: column; }
.cmd.block { display: flex; width: 100%; height: auto; align-items: flex-start; justify-content: space-between; padding: 12px 8px 12px 16px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; word-break: break-all; }
.reqs2 { display: flex; flex-wrap: wrap; gap: 8px 28px; margin-top: 16px; font-size: 14px; color: var(--text-2); }
.reqs2 b { font-weight: 500; color: var(--text-1); }
.build2 { margin-top: 16px; padding: 20px 24px; border: 1px dashed var(--line-strong); border-radius: 16px; }
.phone .build2 { padding: 16px; }
.build2 .bl { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; font-size: 15px; font-weight: 600; }
.build2 .bl span { font-weight: 400; color: var(--text-3); }
.phone-first { margin-top: 28px; padding: 20px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); }
.phone-first p { margin: 0 0 16px; font-size: 16px; line-height: 1.55; color: var(--text-2); }
.phone-first .dl { width: 100%; justify-content: center; }

.letter { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 72px; padding-top: 96px; padding-bottom: 72px; }
.phone .letter { grid-template-columns: minmax(0, 1fr); gap: 28px; padding-top: 40px; padding-bottom: 48px; }
.who2 { display: flex; flex-direction: column; gap: 14px; }
.portrait { width: 240px; height: 240px; border-radius: 36px; background-size: cover; background-position: 50% 30%; box-shadow: 0 0 0 1px var(--line-strong), 0 40px 80px -40px rgb(0 0 0 / 0.55); }
.phone .portrait { width: 112px; height: 112px; border-radius: 24px; }
.phone .who2 { flex-direction: row; align-items: center; gap: 16px; }
.who2 .nm { font-size: 18px; font-weight: 600; }
.who2 .rl { margin-top: 2px; font-size: 14px; line-height: 1.5; color: var(--text-2); }
.who2 .gh { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 14px; font-weight: 500; color: var(--accent-strong); }
.storyt .pull { margin: 16px 0 0; font-size: 44px; line-height: 1.15; font-weight: 650; letter-spacing: -0.03em; background: linear-gradient(180deg, var(--text-1) 50%, color-mix(in srgb, var(--text-1) 70%, transparent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.phone .storyt .pull { font-size: 28px; }
.storyt p { max-width: 640px; margin: 22px 0 0; font-size: 18px; line-height: 1.7; color: var(--text-2); }
.phone .storyt p { font-size: 16.5px; }
.storyt a { color: var(--text-1); text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 3px; }
.sign { margin-top: 28px; font-size: 22px; font-weight: 600; font-style: italic; letter-spacing: -0.01em; }
.sp-head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: end; }
.phone .sp-head { grid-template-columns: minmax(0, 1fr); gap: 16px; }
.sp-head .h2 .dim { color: var(--text-3); }
.sp-head .lead2 { margin: 0 0 20px; }
.wall { margin-top: 36px; padding: 24px; border: 1px solid var(--line); border-radius: 18px; background: var(--surface); }
.wall .wh { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 16px; font-size: 13px; color: var(--text-3); }
.phone .wall .wh { flex-direction: column; }
.wall .slot { min-width: 220px; height: 72px; }
.tiers { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 14px; }
.phone .tiers { grid-template-columns: minmax(0, 1fr); }
.tier { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--line); border-radius: 18px; background: var(--surface); }
.tier.wide { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
.phone .tier.wide { grid-template-columns: minmax(0, 1fr); }
.tier.top { border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
.lightp { position: relative; height: 150px; overflow: hidden; background: #070707; }
.tier.wide .lightp { height: 100%; min-height: 200px; }
.lightp::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, rgb(255 255 255 / 0.28) 1px, transparent 1.6px) 0 0 / 12px 12px; -webkit-mask-image: linear-gradient(transparent 45%, #000); mask-image: linear-gradient(transparent 45%, #000); }
.lightp i { position: absolute; display: block; }
.l-spark i { left: 50%; top: 46%; width: 90px; height: 90px; transform: translate(-50%, -50%); background: radial-gradient(circle, #fff 0 2px, rgb(255 255 255 / 0.55) 3px, rgb(255 255 255 / 0.08) 18px, transparent 44px); }
.l-glow i { left: 50%; top: 40%; width: 220px; height: 180px; transform: translate(-50%, -50%); background: radial-gradient(circle, rgb(255 255 255 / 0.85) 0 3px, rgb(255 255 255 / 0.3) 10px, rgb(255 255 255 / 0.06) 50px, transparent 90px); }
.l-glow::after { content: ''; position: absolute; left: 50%; bottom: -30px; width: 260px; height: 80px; transform: translateX(-50%); background: radial-gradient(closest-side, rgb(255 255 255 / 0.22), transparent); }
.l-beam i { left: 50%; top: 0; width: 180px; height: 100%; transform: translateX(-50%); background: linear-gradient(rgb(255 255 255 / 0.5), rgb(255 255 255 / 0.04)); clip-path: polygon(46% 0, 54% 0, 80% 100%, 20% 100%); }
.l-beam::after { content: ''; position: absolute; left: 50%; bottom: -24px; width: 220px; height: 70px; transform: translateX(-50%); background: radial-gradient(closest-side, rgb(255 255 255 / 0.3), transparent); }
.l-lighthouse i { left: 50%; bottom: 26px; width: 26px; height: 26px; transform: translateX(-50%); border-radius: 7px; background: linear-gradient(135deg, #f5f5f5, #9a9a9a); box-shadow: 0 0 24px 6px rgb(255 255 255 / 0.25); }
.l-lighthouse::after { content: ''; position: absolute; left: 50%; bottom: 0; width: 100%; height: 100%; transform: translateX(-12%); background: linear-gradient(100deg, transparent 40%, rgb(255 255 255 / 0.18) 55%, transparent 80%); clip-path: polygon(38% 78%, 100% 20%, 100% 100%, 38% 84%); }
.l-daylight { background: linear-gradient(#070707 10%, #1c1c1c 70%, #3a3a3a); }
.l-daylight::before { -webkit-mask-image: linear-gradient(transparent 35%, #000); mask-image: linear-gradient(transparent 35%, #000); background: radial-gradient(circle, rgb(255 255 255 / 0.5) 1px, transparent 1.6px) 0 0 / 12px 12px; }
.l-daylight i { left: 0; right: 0; top: 52%; height: 2px; background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.9), transparent); box-shadow: 0 0 40px 18px rgb(255 255 255 / 0.18); }
.tbody { display: flex; flex: 1; flex-direction: column; padding: 20px 20px 22px; }
.tbody h3 { margin: 0; font-size: 18px; font-weight: 650; }
.price { margin: 4px 0 0; font-size: 14px; color: var(--text-3); }
.price b { font-size: 26px; font-weight: 650; letter-spacing: -0.02em; color: var(--text-1); }
.tbody > p { margin: 12px 0 0; font-size: 14px; line-height: 1.55; color: var(--text-2); }
.perks { display: flex; flex-direction: column; gap: 8px; margin: 14px 0 18px; padding: 0; list-style: none; }
.perks li { display: flex; gap: 8px; font-size: 13.5px; line-height: 1.5; color: var(--text-2); }
.perks li svg.i { margin-top: 2px; color: var(--text-3); }
.tbody .grow { flex: 1; }
.tbody .btn3, .tbody .dl { width: 100%; justify-content: center; }
.once { margin: 18px 0 0; font-size: 14px; color: var(--text-2); }
.once a { color: var(--accent-strong); font-weight: 500; }
.oss { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 28px; }
.phone .oss { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
.oss div { display: flex; flex-direction: column; gap: 6px; padding: 20px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); }
.phone .oss div { padding: 14px; }
.oss svg.i { color: var(--text-3); }
.oss b { margin-top: 6px; font-size: 16px; font-weight: 600; }
.oss small { font-size: 13px; line-height: 1.5; color: var(--text-2); }
`

const siteBox = (phone: boolean, scheme: Scheme, inner: string) =>
  `<div class="site${phone ? ' phone' : ''}" style="width:${phone ? 390 : 1376}px;${TOKENS[scheme]}--gut:${phone ? 16 : 40}px">${inner}</div>`

const docsRow = (docs: string[]) =>
  `<div class="wrap docs"><h4>In the docs</h4><div class="dlinks">${docs.map((d) => `<span>${icon('file-text', 14)}${d}</span>`).join('')}</div></div>`

/** The security page: the eight facts as anchors first, then each with its docs link. Words: marketing's where quoted, else docs' own, for docs to check. */
function securityPage(scheme: Scheme, phone = false): string {
  const facts: [IconName, string, string][] = [
    ['log-in', 'Sign-in', 'Single sign-on, a proxy or a token'],
    ['users', 'As each person', 'Their RBAC, never more'],
    ['key-round', 'Access rules', 'Less than RBAC, team by team'],
    ['scroll-text', 'The record', 'What’s done, and how to check it'],
    ['plug', 'Plugins', 'A file, not code'],
    ['globe', 'What it connects to', 'No telemetry, no accounts'],
    ['shield-check', 'Signed builds', 'Signed, attested, with SBOMs'],
    ['mail', 'Reporting', 'security@lumovi.dev'],
  ]
  const index = `<div class="sx-index">${facts.map(([ic, t, l], k) => `<div class="sx-card"><span class="n">0${k + 1}</span><span class="ic">${icon(ic, 18)}</span><b>${t}</b><small>${l}</small><span class="go">${icon('arrow-down', 16)}</span></div>`).join('')}</div>`
  const hero = `<div class="hero2 part"><div class="aurora" style="opacity:.4"></div><div class="wrap"><span class="eyebrow">${icon('shield-check', 14)}Security</span><h1 class="h1 xl part">How Lumovi is kept secure.</h1><p class="lead">How Lumovi signs people in, never exceeds their Kubernetes access, records what’s done, keeps your data where it is, and signs its builds.</p>${index}</div></div>`
  const doc = (d: string) =>
    `<span class="doc">${icon('file-text', 14)}${d}${icon('arrow-right', 14)}</span>`
  const sec = (k: number, title: string, d: string, body: string) =>
    `<section class="sx"><div class="hd"><span class="n">0${k}</span><h3>${title}</h3>${doc(d)}</div><div class="bd">${body}</div></section>`
  const shot = (name: string, desk: ReturnType<typeof region>, near: ReturnType<typeof region>) =>
    still(shotUrl(name, scheme), { ...(phone ? near : desk), cls: 'shadowed' })
  const holds = `<table class="sx-table"><thead><tr><th>Signed in with</th><th>What Lumovi holds</th><th>Its own account may</th></tr></thead><tbody>
    <tr><td>A token</td><td>Each person’s token, sealed</td><td>Nothing</td></tr>
    <tr><td>Single sign-on, tokens passed on</td><td>Each person’s tokens, sealed</td><td>Nothing</td></tr>
    <tr><td>Single sign-on</td><td>Who people are</td><td>Impersonate them</td></tr>
    <tr><td>An authenticating proxy</td><td>Nothing: it reads the proxy’s headers</td><td>Impersonate them</td></tr></tbody></table>`
  const li = (b: string, t: string) => `<li>${icon('check', 16)}<span><b>${b}</b>${t}</span></li>`
  const term = `<div class="term"><div class="tb"><i></i><i></i><i></i><span>Check a release</span></div><pre><span class="c"># Built by Lumovi’s release workflow, from main, and signed by it.</span>
<span class="p">$</span> signer=(--repo Lumovi/Lumovi --signer-workflow Lumovi/Lumovi/.github/workflows/release.yml --source-ref refs/heads/main)
<span class="p">$</span> gh attestation verify oci://ghcr.io/lumovi/lumovi:1.22.0 "\${signer[@]}"
<span class="p">$</span> cosign verify ghcr.io/lumovi/lumovi:1.22.0 \\
    --certificate-identity https://github.com/Lumovi/Lumovi/.github/workflows/release.yml@refs/heads/main \\
    --certificate-oidc-issuer https://token.actions.githubusercontent.com</pre></div>`
  const sections = [
    sec(
      1,
      'Single sign-on, a proxy, or a token.',
      'Signing in',
      `<p>People sign in with your identity provider over OIDC, through the authenticating proxy you already run, or with a Kubernetes token. Signing in with a token needs Kubernetes 1.28 or later.</p><div class="fit" style="max-width:${phone ? 358 : 440}px;margin:24px 0 0">${shot('server-single-sign-on', CROPS.signInPhone, CROPS.signInPhone)}</div>`,
    ),
    sec(
      2,
      'As each person, never more.',
      'Security in your cluster',
      `<p>Every request reaches the API server as the person who made it, and the API server applies their RBAC. Lumovi never acts as one of Kubernetes’ own users or groups, whatever a provider or proxy says.</p>${holds}`,
    ),
    sec(
      3,
      'Less than RBAC, never more.',
      'Access rules',
      `<p>Lumovi’s admins can let people do less through Lumovi than their RBAC allows: changes, shells, node shells, logs, Secrets, Helm and AI assistants. The server decides before it acts, and a refusal says which grant or limit decided.</p>${shot('access-rules', CROPS.accessRules, CROPS.accessRulesPhone)}`,
    ),
    sec(
      4,
      'On the record, and checkable.',
      'The audit log',
      `<p>By default, changes, shells, Secrets read, sign-ins and AI assistants’ calls, kept on a volume in Lumovi’s namespace and sent on to its output, and to a webhook if you give one. Never values, tokens or manifests. Each event follows from the one before: compare the newest with a copy kept elsewhere.</p>${shot('audit-checked', CROPS.auditHold, CROPS.auditPhone)}`,
    ),
    sec(
      5,
      'Plugins are a file, not code.',
      'Plugins',
      `<p>A plugin is a file, not code: every read and change goes to the cluster as you. The plugins Lumovi comes with are pinned by their SHA-256, and checked against their repository’s signature as each release is built.</p>`,
    ),
    sec(
      6,
      'What Lumovi connects to.',
      'Privacy and security',
      `<p>Lumovi has no telemetry and no accounts. It doesn’t send anything about you or your clusters anywhere you didn’t ask it to.</p><div class="sx-facts"><div><span>Telemetry</span><b>None</b></div><div><span>Accounts</span><b>None</b></div><div><span>Credentials</span><b>Stay on your computer, or sealed in your cluster</b></div><div><span>Licence</span><b>Apache 2.0</b></div></div><ul class="sx-list" style="margin-top:20px">${li('GitHub', ', to look for new versions; you can turn it off')}${li('The sponsor card', ', a file on GitHub, once an hour')}${li('Artifact Hub', ', only when you search it for a chart')}${li('The chart repositories you choose', ', when you install or upgrade from one')}${li('dl.k8s.io', ', for a kubectl that matches the cluster, when you open a terminal')}${li('On a server:', ' your identity provider, and the webhook you give it.')}</ul>`,
    ),
    sec(
      7,
      'Signed, attested, and checkable.',
      'Check a release',
      `<ul class="sx-list">${li('The macOS app', ' signed and notarized; the Windows installer signed')}${li('Every installer, the image and the chart', ' with a signed provenance attestation')}${li('The image and the chart', ' signed with cosign')}${li('Bills of materials', ' for every installer and the image')}</ul>${term}`,
    ),
    sec(
      8,
      'Report a vulnerability privately.',
      'SECURITY.md',
      `<p>By email, or through GitHub’s security advisories, never in a public issue.</p><div class="report"><span class="ic">${icon('mail', 22)}</span><div><b>security@lumovi.dev</b><small>Or a private advisory on GitHub</small></div><span class="btn2">${icon('shield-check', 16)}Report on GitHub</span></div>`,
    ),
  ].join('')
  const notyet = `<div class="notyet"><h3>What it doesn’t do yet.</h3><p>Said as plainly as the rest, from the docs on the day.</p><ul class="sx-list">${li('One replica.', ' With AI assistants on, or the audit history on its volume, the chart runs one Lumovi and refuses more.')}${li('The audit chain has no key.', ' Whoever can write its volume could rewrite it unseen: keep a copy elsewhere, and compare.')}</ul></div>`
  const inner = `${bar(phone ? 'phone' : 'wide', 'Security')}${hero}<div class="wrap">${sections}${notyet}</div>${docsRow(['Security in your cluster', 'Privacy and security', 'Access rules', 'The audit log', 'Check a release'])}${downloadFoot(phone, 'cluster')}${footerInner(phone, true)}`
  return siteBox(phone, scheme, inner)
}

const APP_ICON = `data:image/svg+xml;base64,${readFileSync(new URL('../../Lumovi-website/src/assets/lumovi-icon.svg', import.meta.url)).toString('base64')}`

/** The download page: today's section whole, your system first; on a phone, a way to get it to a computer. */
function downloadPage(scheme: Scheme, phone = false): string {
  const dlLink = (label: string, size: string) =>
    `<span>${icon('download', 14)}${label}<span class="size">${size}</span></span>`
  const status = `<p class="dl-status"><span class="latest">${icon('circle-check', 13)}Latest</span><span>Version <b>1.21.0</b>, released October 10, 2026.</span><a>Release notes</a><a>SHA-256 checksums</a><a>SBOM</a><a>Verify your download</a></p>`
  const hero = `<div class="hero2 part flat"><div class="aurora" style="opacity:.5"></div><div class="wrap dlh"><img class="appicon" src="${APP_ICON}" alt=""><h1 class="h1 xl part" style="margin-top:22px">Get Lumovi.</h1><p class="lead${phone ? '' : ' c'}">Free and open source under the Apache 2.0 license, with no telemetry. Download it for your computer, or install it in your cluster for everyone on your team.</p>${phone ? '' : status}</div></div>`
  const mac = `<div class="yours"><div><h3>macOS<span class="pill2">Your system</span></h3><p>macOS 13 or later. Signed and notarized by Apple.</p></div><div class="btns"><span class="dl mid">${icon('download', 16)}Apple silicon<span class="size">185 MB</span></span><span class="btn3">${icon('download', 16)}Intel<span class="size">194 MB</span></span></div><div class="more">Disk images (.dmg). Also as .zip for <a>Apple silicon</a> and <a>Intel</a>, or with <a>Homebrew</a>: <span class="cmd" style="height:36px;font-size:13px">brew install --cask lumovi/tap/lumovi<span class="cp">${icon('copy', 14)}</span></span></div></div>`
  const win = `<div class="plat"><h3>Windows</h3><p>Windows 10 or later, on x64 and arm64.</p><span class="btn3">${icon('download', 16)}Installer<span class="size">311 MB</span></span><p class="note">Signed by Open Source Developer Péter Kóta. While the certificate is new, Windows may still warn: choose More info, then Run anyway.</p></div>`
  const linux = `<div class="plat"><h3>Linux</h3><p>A recent 64-bit distribution.</p><table class="ltable"><thead><tr><th></th><th>x64</th><th>arm64</th></tr></thead><tbody>${[
    ['AppImage', '183 MB', '182 MB'],
    ['.deb', '147 MB', '140 MB'],
    ['.rpm', '132 MB', '126 MB'],
  ]
    .map(
      ([f, a, b]) =>
        `<tr><th>${f}</th><td>${icon('download', 14)}${a}</td><td>${icon('download', 14)}${b}</td></tr>`,
    )
    .join('')}</tbody></table></div>`
  const macPlat = `<div class="plat"><h3>macOS</h3><p>macOS 13 or later. Signed and notarized by Apple.</p><div class="reqs2">${dlLink('Apple silicon', '185 MB')}${dlLink('Intel', '194 MB')}</div><p class="note">Also as .zip, or with Homebrew: brew install --cask lumovi/tap/lumovi</p></div>`
  const build = `<div class="build2"><div class="bl">Or build it yourself <span>with Node.js 24 or later · Build from source</span></div><span class="cmd block">git clone https://github.com/Lumovi/Lumovi &amp;&amp; cd Lumovi &amp;&amp; npm ci &amp;&amp; npm run dist<span class="cp">${icon('copy', 16)}</span></span></div>`
  const helm = `helm install lumovi oci://ghcr.io/lumovi/charts/lumovi \\\n  --namespace lumovi --create-namespace\nkubectl port-forward --namespace lumovi service/lumovi 8080:80`
  const docker = `docker run --rm -p 8080:8080 \\\n  -v "$PWD/kubeconfig:/kubeconfig:ro" -e KUBECONFIG=/kubeconfig \\\n  ghcr.io/lumovi/lumovi`
  const cluster = `<div class="track2" id="cluster"><h2>In your cluster</h2><span>One Helm chart, for everyone on your team · Install in a cluster</span></div><div class="plats"><div class="plat"><h3>${icon('ship-wheel', 18)} Helm chart</h3><p>Any cluster on Kubernetes 1.25 or later (1.28 or later to sign in with a token, as here). Then open localhost:8080 and sign in with a token. Upgrading it later signs nobody out.</p><span class="cmd block">${helm}<span class="cp">${icon('copy', 16)}</span></span><p class="note">Then give it an address of its own, sign people in with single sign-on, harden it for production, or see every setting. The same chart runs a fleet for many clusters, and an agent in private ones. It’s on Artifact Hub, signed.</p></div><div class="plat"><h3>${icon('container', 18)} Container image</h3><p>Without Kubernetes, on a machine of its own: Lumovi shows a cluster, or a fleet of them, from a kubeconfig.</p><span class="cmd block">${docker}<span class="cp">${icon('copy', 16)}</span></span></div></div>`
  const computer = phone
    ? `<div class="phone-first"><p>Lumovi runs on macOS, Windows and Linux, or in your cluster.</p><span class="dl big">${icon('share', 18)}Send me the link</span><p style="margin:14px 0 8px;font-size:13px;color:var(--text-3)">Or install it in your cluster:</p><span class="cmd">helm install lumovi oci://ghcr.io/lumovi/charts/lumovi<span class="cp">${icon('copy', 16)}</span></span></div>${status}<div class="track2"><h2>On your computer</h2><span>It keeps itself up to date.</span></div><div class="plats">${macPlat}${win}${linux}</div>`
    : `<div class="track2"><h2>On your computer</h2><span>It keeps itself up to date · Get started</span></div>${mac}<div class="plats">${win}${linux}</div>`
  const reqs = `<div class="reqs2"><span>kubectl <b>Not needed</b></span><span>Helm <b>Not needed</b></span></div>`
  const inner = `${bar(phone ? 'phone' : 'wide', '')}${hero}<div class="wrap" style="padding-bottom:88px">${computer}${build}${reqs}${cluster}</div>${footerInner(phone, true)}`
  return siteBox(phone, scheme, inner)
}

/** The tiers as GitHub's listing words them (Lumovi-website, src/lib/sponsors.ts), each with its light. */
const TIERS: { light: string; name: string; price: string; text: string; perks: string[] }[] = [
  {
    light: 'spark',
    name: 'Spark',
    price: '$5',
    text: 'Every bit of light helps. You keep Lumovi free, open and moving forward.',
    perks: ['The Sponsor badge on your GitHub profile', 'My real thanks'],
  },
  {
    light: 'glow',
    name: 'Glow',
    price: '$25',
    text: 'For people who open Lumovi every day. Your support turns into new views, faster lists and fewer bugs.',
    perks: ['The Sponsor badge on your GitHub profile', 'My real thanks'],
  },
  {
    light: 'beam',
    name: 'Beam',
    price: '$100',
    text: 'For teams who rely on Lumovi to keep an eye on their clusters.',
    perks: [
      'Your name and a link in the sponsors section of Lumovi’s README',
      'The Sponsor badge on your GitHub profile',
    ],
  },
  {
    light: 'lighthouse',
    name: 'Lighthouse',
    price: '$500',
    text: 'For companies that run on Kubernetes and want Lumovi to keep shining.',
    perks: [
      'Your logo and a link here on lumovi.dev, with Lumovi’s sponsors',
      'Your logo and a link in the sponsors section of Lumovi’s README',
      'The Sponsor badge on your organization’s GitHub profile',
    ],
  },
  {
    light: 'daylight',
    name: 'Daylight',
    price: '$2,000',
    text: 'For companies that run their clusters with Lumovi and want their requests looked at first.',
    perks: [
      'Your feature requests and bugs go to the front of the queue, when they fit Lumovi; what gets built is open source, for everyone',
      'Your logo and a link here on lumovi.dev, and in the sponsors section of Lumovi’s README',
      'The Sponsor badge on your organization’s GitHub profile',
    ],
  },
]

/** Why I built it: the story in full, the sponsors with their five tiers, and how it's open. */
function aboutPage(scheme: Scheme, phone = false): string {
  const letter = `<div class="wrap letter"><aside class="who2"><div class="portrait" style="background-image:url(${peter()})"></div><div><div class="nm">Peter Kota</div><div class="rl">Creator of Lumovi.<br>Works on Sevalla.</div><span class="gh">${icon('git-branch', 14)}github.com/Lumovi</span></div></aside><div class="storyt"><span class="eyebrow">${icon('heart', 14)}Why I built it</span><p class="pull">I wanted to open a cluster and know in a second whether it was healthy, and if it wasn’t, where to look first.</p><p>I work on <a>Sevalla</a>. It runs apps, databases and static sites on Kubernetes, and the whole point is that our users never have to think about Kubernetes. They push code, and we look after the clusters.</p><p>That means we watch a lot of clusters. Every day I’d jump between them to check on nodes, pods and capacity. The tools I had were a terminal or a wall of tables. They could tell me anything, just not at a glance.</p><p>I like to see things. A failing pod should look like a failing pod, and a node that’s out of memory should stand out before anyone has to ask. So I built the app I wanted to open every morning.</p><p>Lumovi started as a tool for my own work. It’s free and open source, because anyone who runs a cluster should have one like it.</p><p class="sign">Peter</p></div></div>`
  const tier = (t: (typeof TIERS)[number]) =>
    `<div class="tier${t.light === 'daylight' ? ' wide' : ''}${t.light === 'lighthouse' ? ' top' : ''}"><div class="lightp l-${t.light}"><i></i></div><div class="tbody"><h3>${t.name}</h3><p class="price"><b>${t.price}</b> a month</p><p>${t.text}</p><ul class="perks">${t.perks.map((x) => `<li>${icon('check', 15)}<span>${x}</span></li>`).join('')}</ul><span class="grow"></span>${t.light === 'lighthouse' ? `<span class="dl mid">Sponsor</span>` : `<span class="btn3">Sponsor</span>`}</div></div>`
  const sponsors = `<section class="hb2" id="sponsors" style="padding-top:${phone ? 48 : 96}px;border-top:1px solid var(--line)"><div class="wrap"><div class="sp-head"><div><span class="eyebrow">${icon('heart', 14)}Sponsors</span><h2 class="h2">Free and open source. <span class="dim">Kept bright by its sponsors.</span></h2></div><div><p class="lead2">Lumovi is free, and it stays free. Sponsoring it gives me the time to keep making it better: new views, faster lists, fewer bugs, and all the quiet work behind a good release.</p><span class="dl big">${icon('heart', 18)}Sponsor on GitHub</span></div></div><div class="wall"><div class="wh"><span>Sponsors</span><span>Their logos stand here, with a link, for everyone who comes to lumovi.dev.</span></div><div class="slots"><span class="slot">${icon('plus', 16)} Your logo here</span></div></div><div class="tiers">${TIERS.map(tier).join('')}</div><p class="once">Rather give once? <a>A one-time thank you of $10</a> means more than you’d think, and it all goes into the app.</p></div></section>`
  const card = (ic: IconName, b: string, t: string) =>
    `<div>${icon(ic, 18)}<b>${b}</b><small>${t}</small></div>`
  const open = `<section class="hb2"><div class="wrap"><span class="eyebrow">${icon('code', 14)}Open source</span><h2 class="h2">Read it, build it, change it.</h2><p class="lead2">The app, the server and the plugins Lumovi comes with are on GitHub under the Apache 2.0 licence.</p><div class="oss">${card('git-branch', 'Lumovi on GitHub', 'The app and the server, its issues and releases')}${card('git-merge', 'Contributing', 'How to send a change, in CONTRIBUTING.md')}${card('book-open', 'Build from source', 'One command, with Node.js 24 or later')}${card('scroll-text', 'Licence', 'Apache 2.0')}</div></div></section>`
  const inner = `${bar(phone ? 'phone' : 'wide', '')}${letter}${sponsors}${open}<div style="height:${phone ? 48 : 96}px"></div>${downloadFoot(phone)}${footerInner(phone, true)}`
  return siteBox(phone, scheme, inner)
}

/** Where a page's loops sit, and how every loop behaves (Péter, 2026-10-13: "1a"). */
const loopNote = (list: [block: string, loop: string][]) =>
  `<p><b>Loops</b> (the pause button marks each): ${list.map(([b, l]) => `${b} → <i>${l}</i>`).join('; ')}. Website’s scenes, re-rendered; each loop’s poster is its own frame at rest, drawn here with the app’s screenshot until marketing’s sheet. Muted, a few seconds, loaded near view and played only while in view; one pause button under the picture, never over it, 44 px to touch, named Pause and then Play (aria-pressed), with a visible focus ring; under reduced motion or Save-Data, the poster alone. On a phone each loop is its own render at the phone crop drawn here, never the desktop one shrunk. Every other block is a still, and the films stay click-to-play.</p>`

const partLoops = (part: Part): [string, string][] =>
  part.things.flatMap((t) =>
    'loop' in t.pic && t.pic.loop ? [[t.title, t.pic.loop] as [string, string]] : [],
  )

export type SiteFrame =
  | 'site-shared'
  | 'site-shape'
  | 'site-map'
  | 'site-home'
  | 'site-app'
  | 'site-teams'
  | 'site-plugins'
  | 'site-ai'
  | 'site-security'
  | 'site-download'
  | 'site-about'

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
  { id: 'site-home', title: 'lumovi.dev: home', size: { width: 1960, height: 2400 } },
  { id: 'site-app', title: 'lumovi.dev: the app', size: { width: 1960, height: 2400 } },
  { id: 'site-teams', title: 'lumovi.dev: for teams', size: { width: 1960, height: 2400 } },
  { id: 'site-plugins', title: 'lumovi.dev: plugins', size: { width: 1960, height: 2400 } },
  { id: 'site-ai', title: 'lumovi.dev: AI assistants', size: { width: 1960, height: 2400 } },
  { id: 'site-security', title: 'lumovi.dev: security', size: { width: 1960, height: 2400 } },
  { id: 'site-download', title: 'lumovi.dev: download', size: { width: 1960, height: 2400 } },
  { id: 'site-about', title: 'lumovi.dev: why I built it', size: { width: 1960, height: 2400 } },
]

/** One of the frames, in one theme. */
export function siteFrame(id: SiteFrame, scheme: Scheme): string {
  const f = SITE_FRAMES.find((x) => x.id === id)!
  const PARTS: Record<string, [Part, string]> = {
    'site-teams': [TEAMS, '/teams'],
    'site-plugins': [PLUGINS, '/plugins'],
    'site-ai': [AI, '/ai'],
  }
  const OWN: Record<string, [(scheme: Scheme, phone?: boolean) => string, string, string]> = {
    'site-security': [
      securityPage,
      '/security',
      'For whoever signs off: the eight facts as anchors first, then each fact with its docs link, a few of the app’s own screens, and what it doesn’t do yet. Words: marketing’s where they gave them (the lead, what it connects to, the builds), else the docs’ own, for docs to check every line before the build.',
    ],
    'site-download': [
      downloadPage,
      '/download',
      'Today’s Download section whole, your system first and lit. The version, its date and every size come from the release as the site builds, rounded as today’s site does them (MB of a million bytes); drawn with today’s, 1.21.0. On a phone, which can’t install the app, the first thing is “Send me the link” (the share sheet) and the Helm command.',
    ],
    'site-about': [
      aboutPage,
      '/about',
      'Péter’s story in full, today’s words, with his photo; the sponsors with the five tiers as GitHub’s listing words them, each with its light; then how it’s open. The tiers’ lights stand in for today’s drawn ones.',
    ],
  }
  const own = OWN[id]
  const body = own
    ? `<header><h1>lumovi.dev${own[1]}</h1><p>${own[2]}</p></header><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${own[0](scheme)}${own[0](scheme, true)}</div>`
    : PARTS[id]
      ? `<header><h1>lumovi.dev${PARTS[id]![1]}</h1><p>The part’s page in the shared shape, in brief §2a’s look, with the app’s own screenshots. Words: marketing’s where given, else drafts for marketing.</p>${partLoops(PARTS[id]![0]).length ? loopNote(partLoops(PARTS[id]![0])) : '<p><b>Loops</b>: none on this page; its blocks are stills, its film click-to-play.</p>'}</header><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${partPage(PARTS[id]![0], scheme)}${partPage(PARTS[id]![0], scheme, true)}</div>`
      : id === 'site-app'
        ? `<header><h1>lumovi.dev/app</h1><p>The part’s page in the shared shape, in brief §2a’s look. Words: marketing’s where given (audience.md §8), else drafts for marketing. Pictures are the app’s own screenshots (docs/screenshots); where the site has a live scene, it stands in their place on the desktop.</p>${loopNote(partLoops(APP))}</header><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${partPage(APP, scheme)}${partPage(APP, scheme, true)}</div>`
        : id === 'site-home'
          ? `<header><h1>lumovi.dev: home</h1><p>Short: a block a phone screen, each pointing to its page. The words are marketing’s (audience.md, sitemap draft 3); screens are labelled until the launch capture.</p>${loopNote(
              [
                ['Problems first.', 'problems'],
                ['AI assistants', 'approval'],
              ],
            )}</header><div class="row" style="flex-wrap:nowrap;align-items:flex-start">${homePage(scheme)}${homePage(scheme, true)}</div>`
          : id === 'site-map'
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
${CSS3}
</style><div class="sheet">${body}</div>`
}
