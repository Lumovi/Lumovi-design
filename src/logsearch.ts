/**
 * Log search with regular expressions, match case, exclude and next/previous match; a since that
 * takes a duration or a date and time; and a volume histogram that picks a range (LMV-164). The
 * Logs view's own toolbar and lines, grown. Drawn before it's built.
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
.spec > p { margin: 0; max-width: 820px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code, td code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.panel { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.tb { display: flex; align-items: center; gap: 6px; padding: 8px 20px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--text-2); }
.sel { display: flex; height: 28px; flex: none; align-items: center; gap: 4px; padding: 0 6px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); font-size: 12px; color: var(--text-1); white-space: nowrap; }
.sel.open { border-color: var(--accent); }
.sel > svg.i { color: var(--text-3); }
.sf { display: flex; height: 28px; min-width: 0; flex: 1; align-items: center; gap: 4px; padding: 0 2px 0 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
.sf.focus { border-color: var(--accent); }
.sf.bad { border-color: var(--critical); box-shadow: 0 0 0 1px var(--critical); }
.sf.slow { border-color: var(--warn); box-shadow: 0 0 0 1px var(--warn); }
.sf > svg.i { flex: none; color: var(--text-3); }
.sf .q { min-width: 0; flex: 1; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.sf .q.pl { font-family: 'Inter', sans-serif; color: var(--text-3); }
.sf .without { flex: none; padding: 0 6px; border-radius: 4px; background: var(--surface-3); font-size: 11px; font-weight: 500; line-height: 18px; color: var(--text-1); }
.sf .n { flex: none; padding: 0 2px; font-size: 11.5px; color: var(--text-3); font-variant-numeric: tabular-nums; white-space: nowrap; }
.sf .n.stale { opacity: 0.55; }
.ft { display: grid; width: 22px; height: 22px; flex: none; place-items: center; border-radius: 4px; color: var(--text-3); }
.ft.on { background: var(--accent-soft); color: var(--accent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent); }
.ft.off { opacity: 0.4; }
.vsep { width: 1px; height: 16px; flex: none; margin: 0 2px; background: var(--line); }
.tg { display: grid; width: 28px; height: 28px; flex: none; place-items: center; border-radius: 6px; color: var(--text-3); }
.tg.on { background: var(--surface-3); color: var(--text-1); }
.said { display: flex; align-items: flex-start; gap: 8px; padding: 6px 20px; border-bottom: 1px solid var(--line); font-size: 12px; line-height: 18px; }
.said.bad { background: color-mix(in srgb, var(--critical) 6%, var(--surface)); color: var(--critical-text); }
.said.slow { background: color-mix(in srgb, var(--warn) 8%, var(--surface)); color: var(--warn-text); }
.said > svg.i { flex: none; margin-top: 1px; }
.said code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
.chips { display: flex; align-items: center; gap: 6px; padding: 6px 20px; border-bottom: 1px solid var(--line); }
.chip { display: flex; height: 24px; align-items: center; gap: 6px; padding: 0 8px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--text-2); white-space: nowrap; }
.chip .dot { width: 7px; height: 7px; border-radius: 999px; }
.chip small { font-size: 11.5px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.chip.range { border-color: var(--accent); background: var(--accent-soft); color: var(--text-1); font-variant-numeric: tabular-nums; }
.chip.range > svg.i { color: var(--text-2); }
.hist { position: relative; display: flex; height: 32px; align-items: flex-end; gap: 1px; padding: 0 20px 4px; border-bottom: 1px solid var(--line); }
.hist .b { position: relative; flex: 1; display: flex; flex-direction: column-reverse; border-radius: 1px 1px 0 0; overflow: hidden; }
.hist .b i { display: block; }
.hist .b .all { background: color-mix(in srgb, var(--text-3) 45%, transparent); }
.hist .b .w { background: var(--warn); }
.hist .b .e { background: var(--critical); }
.hist .pick { position: absolute; top: 0; bottom: 0; border-left: 2px solid var(--accent); border-right: 2px solid var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
.hist .axis { position: absolute; right: 20px; bottom: -16px; left: 20px; display: flex; justify-content: space-between; font-size: 10.5px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.hist .tip { position: absolute; z-index: 3; padding: 4px 8px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 18px; white-space: nowrap; color: var(--surface); }
.lines { padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-2); }
.lines > div { padding: 0 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lines > div.err { background: color-mix(in srgb, var(--critical) 8%, transparent); color: var(--critical-text); }
.lines > div.cur { box-shadow: inset 3px 0 0 var(--accent); }
.lines .ts { color: var(--text-3); margin-right: 10px; }
.lines mark { border-radius: 2px; background: color-mix(in srgb, var(--warn) 35%, transparent); color: inherit; }
.lines mark.cur { background: var(--accent); color: #fff; }
.lines.dim { opacity: 0.55; }
.pop { width: 320px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pop .menu { padding: 4px; }
.pop .mi { display: flex; height: 30px; align-items: center; padding: 0 8px; border-radius: 6px; font-size: 13px; }
.pop .mi.on { background: var(--surface-3); }
.pop .mi .ok { margin-left: auto; color: var(--accent); }
.pop .form { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-top: 1px solid var(--line); }
.pop .form label { font-size: 12px; font-weight: 500; color: var(--text-2); }
.pop .fld { display: flex; height: 32px; align-items: center; padding: 0 10px; border: 1px solid var(--accent); border-radius: 8px; box-shadow: 0 0 0 3px var(--accent-soft); font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--text-1); }
.pop .fld.bad { border-color: var(--critical); box-shadow: 0 0 0 1px var(--critical); }
.pop .read { font-size: 12px; line-height: 18px; color: var(--text-2); }
.pop .read.bad { color: var(--critical-text); }
.pop .read b { font-weight: 600; color: var(--text-1); }
.pop .ex { font-size: 11.5px; color: var(--text-3); }
.pop .acts { display: flex; justify-content: flex-end; gap: 8px; }
.btn2 { display: inline-flex; height: 30px; align-items: center; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; color: var(--text-1); }
.btn2.pri { border-color: var(--accent); background: var(--accent); color: #fff; }
.btn2.dis { opacity: 0.45; }
table.t { border-collapse: collapse; font-size: 12.5px; line-height: 18px; }
table.t th { padding: 6px 16px 6px 0; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-align: left; text-transform: uppercase; color: var(--text-3); }
table.t td { padding: 7px 16px 7px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--text-2); }
table.t td:first-child { color: var(--text-1); font-weight: 500; white-space: nowrap; }
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .pbar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .tap { display: grid; width: 44px; height: 44px; flex: none; place-items: center; color: var(--text-2); }
.ph .pbar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; }
.ph .ptb { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--line); }
.ph .r { display: flex; align-items: center; gap: 4px; }
.ph .psel { display: flex; height: 44px; min-width: 0; flex: 1; align-items: center; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 15px; white-space: nowrap; overflow: hidden; }
.ph .sf { height: 44px; font-size: 15px; margin-right: 4px; }
.ph .sf .q { font-size: 14px; }
.ph .tg { width: 44px; height: 44px; }
.ph .ft { width: 44px; height: 44px; border-radius: 8px; }
.ph .n { margin-left: auto; font-size: 13px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.ph .lines > div { white-space: normal; padding-left: calc(16px + 2ch); text-indent: -2ch; padding-right: 16px; }
.ph .said { padding: 8px 16px; }
.ph .sheetb { padding: 8px 16px 16px; }
.ph .sheetb .fld { display: flex; height: 44px; align-items: center; padding: 0 12px; border: 1px solid var(--accent); border-radius: 8px; box-shadow: 0 0 0 3px var(--accent-soft); font-family: 'JetBrains Mono', monospace; font-size: 15px; }
.ph .sheetb .read { margin: 8px 0 4px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.ph .sheetb .read b { color: var(--text-1); }
.ph .sheetb .ex { font-size: 13px; color: var(--text-3); }
.ph .sheetb .go { display: grid; height: 44px; margin-top: 12px; place-items: center; border-radius: 8px; background: var(--accent); font-size: 15px; font-weight: 600; color: #fff; }
.ph .quick { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.ph .quick span { display: grid; height: 36px; padding: 0 12px; place-items: center; border: 1px solid var(--line); border-radius: 999px; font-size: 13px; }
.phones { display: flex; gap: 28px; align-items: flex-start; }
`

const ft = (glyph: IconName, on = false, off = false) =>
  `<span class="ft${on ? ' on' : ''}${off ? ' off' : ''}">${icon(glyph, 14)}</span>`
const tg = (glyph: IconName, on = false) =>
  `<span class="tg${on ? ' on' : ''}">${icon(glyph, 14)}</span>`

/** The search field, grown: the query, how many, next and previous, then the three toggles. */
function field(o: {
  q?: string
  count?: string
  stale?: boolean
  regex?: boolean
  cas?: boolean
  without?: boolean
  focus?: boolean
  bad?: boolean
  slow?: boolean
}): string {
  const step = !o.without && o.count
  return `<span class="sf${o.focus ? ' focus' : ''}${o.bad ? ' bad' : ''}${o.slow ? ' slow' : ''}">${icon('search', 13)}${o.without ? '<span class="without">Without</span>' : ''}<span class="q${o.q ? '' : ' pl'}">${o.q ? o.q.replace(/&/g, '&amp;').replace(/</g, '&lt;') : 'Search'}</span>${o.count ? `<span class="n${o.stale ? ' stale' : ''}">${o.count}</span>` : ''}${step ? `${ft('chevron-up')}${ft('chevron-down')}` : ''}<span class="vsep"></span>${ft('regex', o.regex)}${ft('case-sensitive', o.cas)}${ft('circle-minus', o.without)}</span>`
}

const toolbar = (f: string, range = 'Last 500 lines') =>
  `<div class="tb"><span class="sel">application-controller${icon('chevron-down', 12)}</span><span class="sel">${range}${icon('chevron-down', 12)}</span>${f}${tg('play', true)}${tg('history')}${tg('clock', true)}${tg('wrap-text')}${tg('copy')}${tg('download')}</div>`

const chips = (extra = '') =>
  `<div class="chips"><span class="chip"><span class="dot" style="background:var(--critical)"></span>Errors<small>3</small></span><span class="chip"><span class="dot" style="background:var(--warn)"></span>Warnings<small>16</small></span>${extra}</div>`

const L = (ts: string, text: string, o: { err?: boolean; cur?: boolean } = {}) =>
  `<div class="${o.err ? 'err' : ''}${o.cur ? ' cur' : ''}"><span class="ts">${ts}</span>${text}</div>`

const LINES_FOUND = [
  L(
    '14:05:12',
    'level=info msg="Comparing app state" application=<mark>cart</mark> revision=4f1c9aa',
  ),
  L(
    '14:05:13',
    'level=error msg="ComparisonError: rpc error: code = Unavailable" application=<mark class="cur">cart</mark>',
    { err: true, cur: true },
  ),
  L(
    '14:05:13',
    'level=info msg="Skipping auto-sync: status is Unknown" application=<mark>cart</mark>',
  ),
  L(
    '14:05:41',
    'level=info msg="Refreshing app status (controller refresh requested)" application=<mark>cart</mark>',
  ),
  L(
    '14:06:02',
    'level=info msg="Reconciliation completed" application=<mark>cart</mark> dedup_ms=0',
  ),
].join('')

function search(): string {
  const cell = (cap: string, inner: string, w = 1376) =>
    `<div style="width:${w}px"><p class="cap">${cap}</p><div class="panel">${inner}</div></div>`
  return `<section class="spec"><h2>Search<i>the field grows its three toggles, and steps between matches</i></h2>
    <div class="row">
      ${cell('Nothing typed: the toggles are there, quiet, so they can be set before typing', toolbar(field({})) + chips() + `<div class="lines">${LINES_FOUND.replace(/<mark( class="cur")?>|<\/mark>/g, '').replace(' cur', '')}</div>`)}
      ${cell('An expression, match case off: the lines that match, the matches marked, the third of 41 current', toolbar(field({ q: 'cart|storefront', count: '3 of 41', regex: true, focus: true })) + chips() + `<div class="lines">${LINES_FOUND}</div>`)}
      ${cell('Exclude: the lines without it; nothing to step between, so no arrows and the count says lines', toolbar(field({ q: 'healthz', count: '1,204 lines', without: true, focus: true })) + chips() + `<div class="lines">${LINES_FOUND.replace(/<mark( class="cur")?>|<\/mark>/g, '').replace(' cur', '')}</div>`)}
    </div>
    <p><b>The search still filters</b>, as today: what’s shown is the lines that match. <b>Inside the field, at its right</b>: how many, then up and down to step between matches, a hairline, then three toggles of 22 px: <b>regular expression</b> (<code>.*</code>), <b>match case</b> (<code>Aa</code>) and <b>exclude</b> (a circled minus). A toggle that’s on has the accent’s soft fill and an accent outline; its tooltip says what it does and its key. <b>The count</b> counts matches, not lines, “3 of 41”, the 3 being the current one; every match in the shown lines is marked in a quiet amber, the current one in the accent, its line with an accent rule at its left; Enter goes to the next, Shift+Enter to the previous, wrapping round, and the lines scroll to keep the current one in the middle. Following stops while one is current, so the view doesn’t run off under it, and starts again when the search is cleared. <b>Exclude</b> shows the lines that don’t match: the field gets a “Without” tag before the text, the count says “1,204 lines”, and there are no arrows and no marks, since nothing shown matches. The level and pod chips still apply on top. Escape clears the text and leaves the toggles as they are. Download and Copy take what’s shown, filters and all.</p>
  </section>`
}

function wrong(): string {
  const cell = (cap: string, inner: string) =>
    `<div style="width:1376px"><p class="cap">${cap}</p><div class="panel">${inner}</div></div>`
  return `<section class="spec"><h2>When an expression can’t be used<i>the view keeps its last good result</i></h2>
    <div class="row">
      ${cell('Not a valid expression: the field in the critical colour, one line under the toolbar, the lines as they were, dimmed', toolbar(field({ q: 'cart|(storefront', count: '3 of 41', stale: true, regex: true, focus: true, bad: true })) + `<div class="said bad">${icon('circle-alert', 14)}<span>Not a regular expression: <code>(</code> at character 6 is never closed. The lines are from the last one that worked.</span></div>` + chips() + `<div class="lines dim">${LINES_FOUND}</div>`)}
      ${cell('Took too long: stopped after its bound; in amber, since nothing is wrong with what was typed as such', toolbar(field({ q: '(a+)+b', count: '3 of 41', stale: true, regex: true, focus: true, slow: true })) + `<div class="said slow">${icon('triangle-alert', 14)}<span>This expression took too long on 20,000 lines, so Lumovi stopped it. Try a simpler one. The lines are from the last one that worked.</span></div>` + chips() + `<div class="lines dim">${LINES_FOUND}</div>`)}
    </div>
    <p><b>Nothing is cleared</b>: the lines and their marks stay as the last expression that worked left them, at 55%, with its count dimmed the same, so it’s plain they aren’t this expression’s. <b>One line under the toolbar</b>, the width of the view, says why, in the app’s words for the browser’s reason where it can (which character, never closed, nothing to repeat), else “isn’t a regular expression Lumovi can use”; it goes as soon as the field holds one that works. Invalid is the critical colour with its icon; too slow is the warning colour with its icon, as it’s a limit, not a mistake. Turning regular expression off makes the same text a plain search at once. The words are docs’. <b>Every expression runs in a worker</b> with a time bound, at any number of lines, and the worker is ended when the bound passes: that’s the only stop that can happen, since an expression on the page’s own thread would hold the whole window. A plain search does too, so the two behave alike.</p>
  </section>`
}

function since(): string {
  const menu = `<div class="menu">${['Last 100 lines', 'Last 500 lines', 'Last 2,000 lines', 'Last 5 minutes', 'Last hour', 'Last day'].map((r) => `<div class="mi">${r}</div>`).join('')}<div class="mi on">Since…</div></div>`
  const form = (val: string, read: string, bad = false) =>
    `<div class="pop">${menu}<div class="form"><label>Since</label><div class="fld${bad ? ' bad' : ''}">${val}</div><div class="read${bad ? ' bad' : ''}">${read}</div>${bad ? '' : '<div class="ex">A duration, like 90m, 2h or 3d, or a date and time, like 14:30 or 2026-10-11 09:00.</div>'}<div class="acts"><span class="btn2">Cancel</span><span class="btn2 pri${bad ? ' dis' : ''}">Show</span></div></div></div>`
  return `<section class="spec"><h2>Since<i>a duration or a date and time, in one field</i></h2>
    <div class="row">
      <div><p class="cap">A duration</p>${form('90m', 'From <b>12:58 today</b>, 90 minutes ago, your time (UTC+2).')}</div>
      <div><p class="cap">A date and time</p>${form('2026-10-11 09:00', 'From <b>09:00 yesterday</b>, 1 day 5 hours ago, your time (UTC+2).')}</div>
      <div><p class="cap">Neither</p>${form('last tuesday', 'Not a duration or a time Lumovi reads. Try 90m, 2h, 14:30 or 2026-10-11 09:00.', true)}</div>
      <div style="width:900px"><p class="cap">A span longer than the view keeps: the last of it, and a line saying so</p><div class="panel"><div class="tb"><span class="sel">application-controller${icon('chevron-down', 12)}</span><span class="sel">Since 1 Sep 00:00${icon('chevron-down', 12)}</span>${field({})}</div><div class="said" style="color:var(--text-2)">${icon('info', 14)}<span>Showing the last 20,000 lines since 1 Sep 00:00. Choose a later since to see from the start.</span></div><div class="lines">${LINES_FOUND.replace(/<mark( class="cur")?>|<\/mark>/g, '').replace(' cur', '')}</div></div></div>
      <div><p class="cap">Then the picker says it</p><div class="panel" style="width:360px"><div class="tb" style="padding:10px 12px"><span class="sel">Last 90 minutes${icon('chevron-down', 12)}</span><span class="sel">Since 09:00 yesterday${icon('chevron-down', 12)}</span></div></div></div>
    </div>
    <p><b>The range picker gains “Since…”</b> at its end; it opens a small form under the picker, as the app’s pickers open. <b>One field</b> reads either: a duration (<code>90m</code>, <code>2h</code>, <code>3d</code>, <code>1h30m</code>) or a date and time (<code>14:30</code> is today, <code>2026-10-11 09:00</code>), always the person’s own time, with the zone said. Under the field, as it’s typed, <b>what Lumovi read</b>, in words, so a misread is seen before it’s used. Enter or Show applies it; nothing in the future, nothing past what the cluster keeps (it says so when that’s where it stops). <b>The picker then says it</b>: a duration as “Last 90 minutes” (as the presets are worded), a time as “Since 14:30”, “Since 09:00 yesterday”, or “Since 11 Oct 09:00” further back. Choosing Since… again opens the form with it filled in. <b>A long span is cut</b>: the view keeps at most the last 20,000 lines of it, as no preset goes past 2,000 lines or a day, and says so in a quiet line above the lines, with how to narrow it: “Showing the last 20,000 lines since 1 Sep 00:00. Choose a later since to see from the start.” 20,000 is the Logs view’s own buffer, and with a since each container is asked for at most its last 20,000 lines.</p>
  </section>`
}

function histogram(): string {
  const H = [
    4, 5, 4, 6, 5, 7, 6, 8, 9, 7, 6, 5, 6, 8, 12, 18, 22, 20, 15, 11, 9, 8, 7, 6, 6, 5, 6, 7, 6, 5,
    5, 6, 7, 9, 8, 7, 6, 6, 5, 4, 5, 6, 5, 6, 7, 6, 5, 4,
  ]
  const E: Record<number, [number, number]> = {
    15: [2, 3],
    16: [4, 5],
    17: [3, 4],
    18: [1, 3],
    33: [0, 2],
  }
  const bars = H.map((h, i) => {
    const [e, w] = E[i] ?? [0, 0]
    const px = (n: number) => Math.round((n / 22) * 24)
    return `<span class="b" style="height:${px(h)}px">${e ? `<i class="e" style="height:${px(e)}px"></i>` : ''}${w ? `<i class="w" style="height:${px(w)}px"></i>` : ''}<i class="all" style="flex:1"></i></span>`
  }).join('')
  const hist = (extra: string) =>
    `<div class="hist">${bars}${extra}<div class="axis"><span>13:45</span><span>14:00</span><span>14:15</span><span>14:30</span><span>14:45</span></div></div><div style="height:14px;border-bottom:1px solid var(--line)"></div>`
  const cell = (cap: string, inner: string) =>
    `<div style="width:1376px"><p class="cap">${cap}</p><div class="panel">${inner}</div></div>`
  return `<section class="spec"><h2>The histogram<i>lines over the loaded span; drag to pick a stretch of it</i></h2>
    <div class="row">
      ${cell('Under the pointer: a bar says its minute', toolbar(field({}), 'Last hour') + chips() + hist(`<span class="tip" style="left:${20 + 16 * 27.6}px;top:-30px">14:05 · 412 lines · 9 errors · 11 warnings</span>`) + `<div style="height:20px"></div>`)}
      ${cell('A stretch picked: the lines are filtered to it, and it’s a chip beside the levels', toolbar(field({}), 'Last hour') + chips(`<span class="chip range">14:04–14:12${icon('x', 12)}</span>`) + hist(`<span class="pick" style="left:${20 + 15 * 27.6}px;width:${6 * 27.6}px"></span>`) + `<div class="lines">${LINES_FOUND.replace(/<mark( class="cur")?>|<\/mark>/g, '').replace(' cur', '')}</div>`)}
    </div>
    <p><b>A 32 px strip under the chips</b>, when the loaded lines span at least two minutes and carry times. Bars share the width, one for each step of a round size (a minute, five, fifteen, an hour) that gives between 30 and 60 of them; times under it at round points. A bar is the count of lines in its step, in a quiet grey; <b>errors and warnings</b> stand at its foot in their level’s colours, as the level chips’ dots are, and each is said in words in the bar’s tooltip (“14:05 · 412 lines · 9 errors · 11 warnings”), never by colour alone. It counts the lines as loaded, before the search, so it doesn’t jump while typing. <b>Dragging picks a stretch</b>: the accent’s soft fill with edges in the accent; letting go filters the lines to it, stops following, and adds a chip with its times and an ×, after the level chips. Clicking a bar picks its step. The × or Escape on the strip clears it. <b>From the keyboard</b> the strip is one stop: ← → move a cursor bar by bar, Shift with them widens the stretch, Enter picks it, Escape clears; a time range from the keyboard is also Since…. It counts what’s loaded and nothing more, so it’s as fast as the lines are; it counts in a worker, and the strip waits empty rather than hold the view up. It needs every line’s time, so the view always asks for times, whether or not Timestamps shows them.</p>
  </section>`
}

function phone(): string {
  const plain = LINES_FOUND.replace(/<span class="ts">[^<]*<\/span>/g, '')
  const view = `<div class="ph"><div class="pbar"><span class="tap">${icon('arrow-left', 20)}</span><h1>application-controller-0</h1></div><div class="ptb"><div class="r"><span class="psel">application-controller</span><span class="psel">Last 500 lines</span></div><div class="r">${field({ q: 'cart|store', regex: true, focus: true }).replace(/<span class="vsep"><\/span>.*<\/span>$/, '</span>')}${tg('play')}${tg('ellipsis')}</div><div class="r">${ft('regex', true)}${ft('case-sensitive')}${ft('circle-minus')}<span class="n">3 of 41</span>${ft('chevron-up')}${ft('chevron-down')}</div></div><div class="lines">${plain}</div></div>`
  const bad = `<div class="ph"><div class="pbar"><span class="tap">${icon('arrow-left', 20)}</span><h1>application-controller-0</h1></div><div class="ptb"><div class="r"><span class="psel">application-controller</span><span class="psel">Last 500 lines</span></div><div class="r">${field({ q: 'cart|(store', regex: true, focus: true, bad: true }).replace(/<span class="vsep"><\/span>.*<\/span>$/, '</span>')}${tg('play')}${tg('ellipsis')}</div><div class="r">${ft('regex', true)}${ft('case-sensitive')}${ft('circle-minus')}<span class="n" style="opacity:.55">3 of 41</span>${ft('chevron-up')}${ft('chevron-down')}</div></div><div class="said bad">${icon('circle-alert', 14)}<span>Not a regular expression: <code>(</code> at character 6 is never closed. The lines are from the last one that worked.</span></div><div class="lines dim">${plain}</div></div>`
  const sheet = `<div class="ph"><div class="pbar"><span class="tap">${icon('x', 20)}</span><h1>Since</h1></div><div class="sheetb"><div class="fld">90m</div><div class="read">From <b>12:58 today</b>, 90 minutes ago, your time (UTC+2).</div><div class="ex">A duration, like 90m, 2h or 3d, or a date and time, like 14:30 or 2026-10-11 09:00.</div><div class="quick"><span>15m</span><span>2h</span><span>6h</span><span>Today 00:00</span></div><div class="go">Show</div></div></div>`
  return `<section class="spec"><h2>On a phone<i>the toggles get a row of their own while searching</i></h2><div class="phones">${view}${bad}${sheet}</div>
    <p>By LMV-197’s rules. The first row stays: container and range. The second is today’s: the search field, Follow and More (Timestamps moves into More to make room). <b>While the field has the focus or holds text, a third row</b> comes under it: the three toggles at 44 px, then the count and up and down at 44 px; it goes when the field is empty and left. The count stays in that row, not in the field, so the field keeps its width for the text. A reason an expression can’t be used is the same line under the toolbar, wrapping. <b>Since…</b> in the range select opens a sheet: the field (the phone’s keyboard opens on it), what Lumovi read, the example, four quick ones as chips that fill the field, and Show at 44 px. <b>No histogram on a phone</b>: it’s too narrow to drag a stretch of with a finger; Since… covers it. Lines wrap and hang, as the phone’s logs do.</p>
  </section>`
}

function keys(): string {
  return `<section class="spec"><h2>Keys<i>with the focus in the search field</i></h2>
    <table class="t">
      <tr><th>Keys</th><th>Does</th></tr>
      <tr><td><code>↵</code>, <code>⇧↵</code></td><td>next match, previous match, wrapping round</td></tr>
      <tr><td><code>⌥R</code> (<code>Alt+R</code> off a Mac)</td><td>regular expression on or off</td></tr>
      <tr><td><code>⌥C</code> (<code>Alt+C</code>)</td><td>match case on or off</td></tr>
      <tr><td><code>⌥X</code> (<code>Alt+X</code>)</td><td>exclude on or off</td></tr>
      <tr><td><code>esc</code></td><td>clears the text; the toggles stay as they are</td></tr>
    </table>
    <p><b>Alt and a letter, with the focus in the field</b>, so the same keys work in the desktop app and in a browser: ⌥⌘C and its neighbours are the browsers’ developer tools, which a page can’t take back, while ⌥R, ⌥C and ⌥X are left alone by browsers (the field takes the key, so on a Mac it doesn’t type “ç”). app to confirm they’re free everywhere Lumovi runs. The three toggles are also stops after the field, in its order, Space turning each. Their tooltips name the key: “Regular expression ⌥R”. The toggles are remembered for the Logs view, not per pod, so a person who works in expressions doesn’t turn it on each time; the text is not remembered.</p>
  </section>`
}

export type LogSearchFrame = 'logs' | 'logs-phone'

export const LOG_SEARCH_FRAMES: { id: LogSearchFrame; title: string; size: Size }[] = [
  {
    id: 'logs',
    title: 'Log search, since, and the histogram',
    size: { width: 1440, height: 3000 },
  },
  { id: 'logs-phone', title: 'The same, on a phone', size: { width: 1340, height: 900 } },
]

/** One of the frames, in one theme. */
export function logSearchFrame(id: LogSearchFrame, scheme: Scheme): string {
  const f = LOG_SEARCH_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'logs'
      ? `<header><h1>Log search</h1><p>The Logs view’s search takes a regular expression, matches case, or excludes; steps between matches; reads a since as a duration or a date and time; and can show its lines over time and pick a stretch of them. The toolbar is today’s, grown; on merged logs from several pods it’s the same.</p></header>${search()}${wrong()}${since()}${histogram()}${keys()}`
      : phone()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet">${body}</div>`
}
