/**
 * The plugin kit's parts, each drawn with its hard cases before it's built (LMV-262). A part is
 * one of Lumovi's own components, grown: a plugin names it and gives it values, never a class, a
 * color or a width. Every frame shows the part on the desktop and on a phone, with the cases
 * that break a part first (the longest names, several at once, nothing at all, thousands) and
 * its rule in a line beside it.
 *
 * Table is the first, since the pick list's row is its lead. It grows from the app's plain-row
 * table (the one a Service's ports use) and Karpenter's rows, which are the same thing with and
 * without headings.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon } from './lucide.ts'
import { CSS as SHELL, pill } from './proposals.ts'
import { FONTS } from './scene.ts'

type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

/** The lines of a shared stylesheet whose rule starts as `start` does: the app's own values. */
const only = (css: string, start: RegExp) =>
  css
    .split('\n')
    .filter((line) => start.test(line))
    .join('\n')

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 28px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.grid { display: grid; gap: 28px 32px; align-items: start; }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 10px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 640px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }

/* A card, as the app's: the box a table stands in. */
.kcard { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.kcard > h3 { display: flex; align-items: center; margin: 0; padding: 14px 16px 6px; font-size: 13px; font-weight: 600; }
.kcard > h3 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.kcard > .in { padding: 0 16px 12px; }

/* Table. One grid for its heading row and every row: a lead, then columns from one scale. */
.t { display: flex; flex-direction: column; margin: 0 -8px; }
.t .th, .t .tr { display: grid; grid-template-columns: var(--cols); align-items: center; gap: 16px; padding: 0 8px; }
.t .th { height: 28px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.t .th > span { display: flex; min-width: 0; align-items: center; gap: 4px; white-space: nowrap; }
.t .th > .r { justify-content: flex-end; }
.t .th > .sorted { color: var(--text-1); }
.t .th > .can { cursor: default; }
.t .th svg.i { flex: none; }
.t .tr { min-height: 36px; padding-top: 8px; padding-bottom: 8px; border-radius: 8px; }
.t .tr + .tr, .t .th + .tr { margin-top: 2px; }
.t .tr.opens.hover { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.t .tr.focus { box-shadow: 0 0 0 2px var(--accent); }
.t .tr > span { min-width: 0; }
.t .r { text-align: right; font-variant-numeric: tabular-nums; }
.t .q { font-size: 12px; color: var(--text-2); }
.t .q3 { font-size: 12px; color: var(--text-3); }
.t .rest { grid-column: var(--rest); text-align: right; font-size: 12px; color: var(--text-3); }
.t .note { grid-column: 1 / -1; margin: -2px 0 0 18px; display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-size: 12px; line-height: 19px; color: var(--text-2); }
.t .tr.noted { align-items: start; row-gap: 2px; }
.t .tr.noted .lead { align-items: flex-start; }
.t .tr.noted .lead > .dot { margin-top: 6px; }
.t h4 { display: flex; align-items: baseline; gap: 8px; margin: 10px 8px 2px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.t h4:first-child { margin-top: 2px; }
.t h4 small { font-size: 11px; font-weight: 400; letter-spacing: 0; text-transform: none; font-variant-numeric: tabular-nums; }
.t .child { padding-left: 34px; }
.t .child2 { padding-left: 60px; }
.t .twist { display: grid; flex: none; width: 16px; height: 16px; margin-left: -2px; place-items: center; color: var(--text-3); }
.t .more { align-self: flex-start; margin: 6px 0 0 0; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; color: var(--accent-strong); }

/* The lead: a dot (or none), a name, a quiet word beside it, a line under. */
.lead { display: flex; min-width: 0; align-items: center; gap: 10px; }
.lead > .dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--m); box-shadow: 0 0 0 3px color-mix(in srgb, var(--m) 18%, transparent); }
.lead > .nodot { flex: none; width: 8px; }
.lead > .w { min-width: 0; flex: 1; }
.lead .nm { display: flex; min-width: 0; align-items: baseline; gap: 8px; }
.lead .nm b { min-width: 0; overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: clip; }
.lead .nm i { flex: none; max-width: 40%; overflow: hidden; font-style: normal; font-size: 12px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.lead small { display: block; overflow: hidden; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }

/* A meter in a cell, as the app's. */
.mtr { display: flex; min-width: 0; flex-direction: column; gap: 4px; }
.mtr > span:first-child { display: flex; justify-content: space-between; gap: 8px; font-size: 11px; line-height: 14px; color: var(--text-3); }
.mtr > span:first-child b { overflow: hidden; font-weight: 400; color: var(--text-2); white-space: nowrap; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
.mtr .tk { height: 6px; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--c) 20%, transparent); }
.mtr .tk i { display: block; height: 100%; border-radius: inherit; background: var(--c); }
.mtr .tk.none { border: 1px dashed var(--line-strong); background: none; }

/* The four states of a table with nothing to list. */
.state { display: flex; min-height: 132px; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 16px; text-align: center; color: var(--text-3); }
.state .tile { display: grid; width: 36px; height: 36px; margin-bottom: 6px; place-items: center; border-radius: 10px; background: var(--surface-3); color: var(--text-2); }
.state b { font-size: 13px; font-weight: 500; color: var(--text-1); }
.state span { max-width: 300px; font-size: 12px; line-height: 18px; }
.state .btn { margin-top: 8px; }
.skel { display: flex; flex-direction: column; gap: 14px; padding: 12px 0 8px; }
.skel i { display: block; height: 10px; border-radius: 5px; background: var(--surface-3); }

/* The scale, drawn as a ruler over a row. */
.ruler { display: grid; grid-template-columns: var(--cols); gap: 16px; margin: 0 0 6px; padding: 0 8px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 14px; color: var(--accent-strong); }
.ruler span { padding-top: 3px; border-top: 2px solid var(--accent); white-space: nowrap; }
.ruler span:last-child { justify-self: end; min-width: 100%; text-align: right; }

/* A phone, 390 wide, and a table's cards on it. */
.ph { width: 390px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-panel); }
.ph .bar { display: flex; height: 52px; align-items: center; gap: 4px; padding: 0 4px; border-bottom: 1px solid var(--line); }
.ph .bar .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.ph .bar h1 { flex: 1; margin: 0; padding: 0 4px; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.ph .sec { padding: 16px; }
.ph .sec + .sec { border-top: 1px solid var(--line); }
.ph .sec > h3 { display: flex; align-items: center; margin: 0 0 10px; font-size: 13px; font-weight: 600; }
.ph .sec > h3 small { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--text-3); }
.ph .sec > h3 .tapb { display: grid; width: 44px; height: 44px; margin: -12px -12px -12px 4px; place-items: center; color: var(--text-2); }
.ph h4 { display: flex; align-items: baseline; gap: 8px; margin: 14px 0 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.ph h4:first-of-type { margin-top: 0; }
.ph h4 small { font-weight: 400; letter-spacing: 0; text-transform: none; }
.cards { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; }
.cards > li { display: block; padding: 10px 14px; }
.cards > li + li { border-top: 1px solid var(--line); }
.cards > li.press { background: var(--surface-3); }
.cards > li.kid { padding-left: 38px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); }
ul.cards { margin: 0; padding: 0; list-style: none; }
.cards .top { display: flex; align-items: center; gap: 10px; }
.cards .top .lead { flex: 1; }
.cards .top .twist { display: grid; flex: none; width: 44px; height: 44px; margin: -12px -14px -12px 0; place-items: center; color: var(--text-3); }
.cards dl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 8px 0 0 18px; font-size: 12px; line-height: 16px; }
.cards dl.one { grid-template-columns: minmax(0, 1fr); }
.cards dl.bare { margin-left: 0; }
.cards dt { color: var(--text-3); }
.cards dd { margin: 2px 0 0; color: var(--text-1); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.cards .pnote { margin: 6px 0 0 18px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.pmore { display: flex; height: 44px; align-items: center; margin-top: 4px; font-size: 13px; font-weight: 500; color: var(--accent-strong); }
/* The pick list: rows that are a lead with a Status at the right, one of them picked. */
.pick { display: flex; flex-direction: column; margin: 0 -8px; }
.pick .pi { display: flex; min-height: 52px; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; }
.pick .pi + .pi { margin-top: 2px; }
.pick .pi .lead { flex: 1; }
.pick .pi.on { background: var(--accent-soft); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent); }
.pick .pi.hover { background: color-mix(in srgb, var(--surface-3) 60%, transparent); }
.pick .pi.focus { box-shadow: 0 0 0 2px var(--accent); }
.pick .pi > .st { flex: none; }
.pfind { display: flex; height: 32px; align-items: center; gap: 8px; margin: 2px 0 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-3); }
.fadeb { position: relative; max-height: var(--h); margin: 0 -10px; padding: 2px 10px 0; overflow: hidden; }
.fadeb::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 28px; background: linear-gradient(transparent, var(--surface-2)); }

/* The second-level header: the thing picked, its Status, and what can be done to it. */
.h2nd { display: flex; min-width: 0; align-items: center; gap: 10px; }
.h2nd > b { min-width: 0; overflow: hidden; font-size: 17px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.h2nd > .st { flex: none; }
.h2nd > .acts { display: flex; flex: none; gap: 8px; margin-left: auto; }

/* Tiles, and the three arrangements. */
.ktile { position: relative; min-width: 0; padding: 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.ktile.hover { border-color: var(--line-strong); background: color-mix(in srgb, var(--surface-3) 40%, var(--surface-2)); }
.ktile .l { display: flex; min-width: 0; align-items: center; gap: 8px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.ktile .l > svg.i { flex: none; color: var(--text-3); }
.ktile .l > span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ktile .l > .go { margin-left: auto; opacity: 0; }
.ktile.hover .l > .go { opacity: 1; }
.ktile .v { display: flex; height: 28px; align-items: flex-end; margin-top: 10px; overflow: hidden; font-size: 28px; line-height: 28px; font-weight: 600; letter-spacing: -0.02em; white-space: nowrap; }
.ktile .v.words { font-size: 15px; line-height: 22px; letter-spacing: -0.01em; }
.ktile .s { display: flex; height: 20px; min-width: 0; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; color: var(--text-3); }
.ktile .s > span:last-child { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.ktile .s .dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--m); }
.ph .ktile .l { gap: 6px; }
.ph .ktile .l > .go { position: absolute; top: 8px; right: 8px; opacity: 1; }
.larger { margin: 0; padding: 12px 16px 0; font-size: 12px; line-height: 18px; color: var(--text-3); }
.pcount { padding: 12px 16px 8px; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.arr-stack { display: flex; min-width: 0; flex-direction: column; gap: 16px; }
.arr-tiles { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 16px; }
.arr-split { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 16px; align-items: start; }
.pagebox { padding: 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); }
.tag { position: relative; }
.tag::before { content: attr(data-tag); position: absolute; z-index: 2; top: -9px; left: 10px; padding: 0 6px; border-radius: 4px; background: var(--accent); font-family: 'JetBrains Mono', monospace; font-size: 10.5px; line-height: 16px; color: #fff; white-space: nowrap; }
.tag.b::before { top: auto; bottom: -9px; }
.tag.o { outline: 1px dashed var(--accent); outline-offset: 5px; border-radius: 12px; }
.stub { display: flex; height: 76px; align-items: center; justify-content: center; font-size: 12px; color: var(--text-3); }

/* On a phone: the page's own top bar after picking, and buttons a finger's height. */
.ph .under { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 16px 0; }
.ph .acts { display: flex; gap: 8px; padding: 12px 16px 4px; }
.ph .acts .btn { height: 44px; padding: 0 16px; }
.ph .acts .sq { display: grid; width: 44px; height: 44px; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); }
.ph .ptiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 16px; }
.ph .pick { margin: 0; }
.ph .pick .pi { min-height: 60px; padding: 8px 16px; border-radius: 0; }
.ph .pick .pi + .pi { margin-top: 0; border-top: 1px solid var(--line); }
.ph .pick .pi.press { background: var(--surface-3); }
.ph .bar h1 { overflow: hidden; white-space: nowrap; }

/* Parts that show something of Lumovi's by reference: the plugin names it, Lumovi shows it. */
.kcard > h3 .by { margin-left: 10px; font-size: 12px; font-weight: 400; color: var(--text-3); }
.kcard > h3 .by + small { margin-left: auto; }
.secret { display: flex; flex-direction: column; gap: 8px; }
.secret .sk { padding: 6px 6px 8px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.secret .sk > .top { display: flex; min-height: 28px; align-items: center; gap: 8px; }
.secret .k { min-width: 0; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.secret .top small { font-size: 12px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.secret .do { display: flex; align-items: center; gap: 2px; margin-left: auto; }
.secret .val { display: block; min-width: 0; margin-top: 2px; padding-right: 6px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; color: var(--text-1); overflow-wrap: anywhere; }
.secret .val.dots { letter-spacing: 0.1em; color: var(--text-2); }
.secret .val.quiet { font-family: 'Inter', sans-serif; color: var(--text-3); }
.secret .val.box { position: relative; max-height: 288px; overflow: hidden; }
.secret .val.box::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 24px; background: linear-gradient(transparent, var(--surface)); }
.ib { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 6px; color: var(--text-2); }
.ib.off { opacity: 0.4; }
.said { display: flex; gap: 10px; padding: 12px 0 4px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.said > svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.said.warn > svg.i { color: var(--warn-text); }
.klog { padding: 10px 0; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-2); }
.klog > div { padding: 0 12px 0 calc(12px + 2ch); text-indent: -2ch; white-space: pre-wrap; overflow-wrap: anywhere; }
.klog .err { background: color-mix(in srgb, var(--critical) 8%, transparent); color: var(--critical-text); }
.ktools { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.kfield { display: flex; height: 32px; min-width: 0; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 13px; color: var(--text-1); }
.kfield.ph { color: var(--text-3); }
.kfield.mono { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
.kfield.bad { border-color: var(--critical); box-shadow: 0 0 0 1px var(--critical); }
.kfield > svg.i { flex: none; color: var(--text-3); }
.kfield > .end { margin-left: auto; padding-left: 4px; }
.ktools .n { margin-right: auto; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.ev { display: grid; grid-template-columns: 16px 150px minmax(0, 1fr) 40px 40px; align-items: baseline; gap: 12px; padding: 7px 0; font-size: 13px; }
.ev + .ev { border-top: 1px solid var(--line); }
.ev > svg.i { align-self: center; color: var(--text-3); }
.ev.w > svg.i { color: var(--warn-text); }
.ev b { overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.ev span { min-width: 0; color: var(--text-2); }
.ev small { font-size: 12px; text-align: right; color: var(--text-3); font-variant-numeric: tabular-nums; }

/* A plugin's form inside Lumovi's own confirmation. */
.kdlg { display: flex; width: 560px; max-height: var(--mh, none); flex-direction: column; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 14px; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.kdlg .dh { display: flex; flex: none; align-items: flex-start; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid var(--line); }
.kdlg .dh .g { display: grid; flex: none; width: 36px; height: 36px; place-items: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent-strong); }
.kdlg .dh .eb { display: flex; align-items: center; gap: 5px; font-size: 12px; line-height: 16px; font-weight: 500; color: var(--accent-strong); }
.kdlg .dh h3 { margin: 2px 0 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.kdlg .dh .sub { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--text-3); }
.kdlg .dh .sub b { font-weight: 500; color: var(--text-2); }
.prodm { padding: 1px 6px; border-radius: 4px; background: color-mix(in srgb, var(--critical) 10%, transparent); font-size: 11px; line-height: 16px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--critical-text); }
.kdlg .db { display: flex; min-height: 0; flex: 1; flex-direction: column; }
.kdlg .part { padding: 14px 20px; }
.kdlg .part + .part { border-top: 1px solid var(--line); }
.kdlg .part.opts { min-height: 0; overflow: hidden; position: relative; }
.kdlg .part.opts.cut { flex: 1; }
.kdlg .part.opts.cut::after { content: ''; position: absolute; right: 0; bottom: 0; left: 0; height: 28px; background: linear-gradient(transparent, var(--surface-2)); }
.kdlg .part.send { flex: none; }
.kcap { display: flex; align-items: center; gap: 6px; margin: 0 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.fld + .fld { margin-top: 12px; }
.fld > label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
.fld > p { margin: 5px 0 0; font-size: 12px; line-height: 17px; color: var(--text-3); }
.fld > p.bad { color: var(--critical-text); }
.kseg { display: inline-flex; padding: 2px; border-radius: 8px; background: var(--surface-3); }
.kseg span { padding: 4px 12px; border-radius: 6px; font-size: 13px; color: var(--text-2); }
.kseg span.on { background: var(--surface-2); font-weight: 500; color: var(--text-1); box-shadow: 0 1px 2px rgb(0 0 0 / 0.12); }
.ksw { display: inline-flex; width: 36px; height: 20px; padding: 2px; border-radius: 999px; background: var(--surface-3); box-shadow: inset 0 0 0 1px var(--line-strong); }
.ksw i { width: 16px; height: 16px; border-radius: 50%; background: var(--surface-2); box-shadow: 0 1px 2px rgb(0 0 0 / 0.3); }
.ksw.on { justify-content: flex-end; background: var(--accent); box-shadow: none; }
.ksw.on i { background: #fff; }
.kdiff { padding: 8px 0; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-2); }
.kdiff > div { padding: 0 12px; white-space: pre; overflow: hidden; }
.kdiff .add { background: color-mix(in srgb, var(--good) 10%, transparent); color: var(--good-text); }
.kdiff .del { background: color-mix(in srgb, var(--critical) 10%, transparent); color: var(--critical-text); }
.kcmd { margin-top: 8px; padding: 8px 12px; border-radius: 8px; background: color-mix(in srgb, var(--surface-3) 70%, transparent); }
.kcmd .cl { display: flex; align-items: center; justify-content: space-between; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.kcmd code { display: block; margin-top: 2px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; overflow-wrap: anywhere; }
.notyet { padding: 14px 12px; border: 1px dashed var(--line-strong); border-radius: 8px; font-size: 13px; color: var(--text-3); }
.verdict { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.verdict > svg.i { flex: none; margin-top: 2px; }
.verdict.ok > svg.i { color: var(--good); }
.verdict.no { color: var(--critical-text); }
.kdlg .df { display: flex; flex: none; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface); }
.kdlg .df .aud { display: flex; align-items: center; gap: 6px; margin-right: auto; font-size: 12px; color: var(--text-3); }
.ph .kdlg { width: auto; border: 0; border-radius: 0; box-shadow: none; }
.ph .grab { width: 36px; height: 4px; margin: 8px auto 0; border-radius: 2px; background: var(--line-strong); }
.ph .kdlg .dh { padding: 10px 16px 12px; }
.ph .kdlg .part { padding: 14px 16px; }
.ph .kdlg .df { justify-content: space-between; padding: 12px 16px; }
.ph .kdlg .df .aud { flex-basis: 100%; margin: 0 0 10px; }
.ph .kdlg .df .btn.ghost { margin-left: -16px; }
.ph .kdlg .df .btn { height: 44px; padding: 0 16px; font-size: 13px; }
.ph .kdlg .df .btn.primary { min-width: 120px; }
.ph .kfield { height: 44px; font-size: 16px; }
.ph .ib { width: 44px; height: 44px; }

/* The graph: the app's object map, grown. Cards in rows, lines between them. */
.gwrap { position: relative; }
.gwrap > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.gwrap path { fill: none; stroke: var(--line-strong); stroke-width: 1.5; stroke-linejoin: round; }
.gwrap path.dash { stroke-dasharray: 4 4; }
.gwrap path.on { stroke: var(--accent); stroke-width: 2; }
.gwrap path.dim { opacity: 0.2; }
.gwrap path.bad { stroke: var(--critical); }
.gwrap path.warnl { stroke: var(--warn); }
.gwrap path.head { fill: var(--line-strong); stroke: none; }
.gcard { position: absolute; display: flex; height: 56px; align-items: center; gap: 10px; padding: 0 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.gcard.dim { opacity: 0.35; }
.gcard.focus { box-shadow: 0 0 0 3px var(--accent-soft), var(--shadow-panel); border-color: var(--accent); }
.gcard.more { justify-content: center; border-style: dashed; border-color: var(--line-strong); box-shadow: none; font-size: 13px; font-weight: 500; color: var(--text-2); }
.gcard .gi { display: grid; flex: none; width: 28px; height: 28px; place-items: center; border-radius: 8px; background: var(--surface-3); color: var(--text-2); }
.gcard .gw { min-width: 0; flex: 1; }
.gcard .g1 { display: flex; min-width: 0; align-items: center; font-size: 11px; line-height: 16px; white-space: nowrap; color: var(--text-3); }
.gcard .g1 .m { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.gcard .g1 .st { display: flex; flex: none; align-items: center; gap: 4px; margin-left: auto; padding-left: 8px; font-weight: 500; color: var(--mt); }
.gcard .g1 .st i { width: 6px; height: 6px; border-radius: 50%; background: var(--m); }
.gcard .g2 { overflow: hidden; font-size: 13px; line-height: 20px; font-weight: 500; white-space: nowrap; }
.glabel { position: absolute; padding: 0 6px; border-radius: 4px; background: var(--surface); font-size: 11px; line-height: 16px; color: var(--text-3); white-space: nowrap; transform: translate(-50%, -50%); }
.glabel.on { color: var(--accent-strong); }
.gbar { display: flex; align-items: center; gap: 12px; margin: 0 0 14px; font-size: 12px; color: var(--text-3); }
.gbar .leg { display: flex; align-items: center; gap: 6px; }
.gbar .end { margin-left: auto; }
.gseg { display: inline-flex; padding: 2px; border-radius: 8px; background: var(--surface-3); }
.gseg span { display: flex; height: 24px; align-items: center; gap: 6px; padding: 0 10px; border-radius: 6px; font-size: 12px; color: var(--text-2); }
.gseg span.on { background: var(--surface-2); font-weight: 500; color: var(--text-1); box-shadow: 0 1px 2px rgb(0 0 0 / 0.12); }
.again { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); }
.again b { font-weight: 500; color: var(--accent-strong); }

/* A plugin's page: the strip that says whose it is, and the page stopped. */
.pgframe { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pgframe .whose { display: flex; min-height: 36px; align-items: center; gap: 8px; padding: 6px 8px 6px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; line-height: 18px; color: var(--text-2); }
.pgframe .whose > svg.i { flex: none; color: var(--text-3); }
.pgframe .whose > span:first-of-type { min-width: 0; flex: 1; }
.pgframe .whose b { font-weight: 600; color: var(--text-1); }
.stopped { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 40px 24px 44px; text-align: center; }
.stopped .tile { display: grid; width: 44px; height: 44px; margin-bottom: 8px; place-items: center; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.stopped h3 { max-width: 384px; margin: 0; font-size: 14px; line-height: 20px; font-weight: 600; }
.stopped p { max-width: 384px; margin: 0; font-size: 13px; line-height: 20px; color: var(--text-2); }
.stopped p.q { margin-top: 6px; font-size: 12px; line-height: 18px; color: var(--text-3); }
.stopped .btn { margin-top: 12px; }
.stopped .saidbox { width: 100%; max-width: 384px; margin-top: 10px; border: 1px dashed var(--line-strong); border-radius: 10px; text-align: left; }
.stopped .saidbox > i { display: block; padding: 6px 12px 0; font-size: 11px; font-style: normal; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.stopped .saidbox > code { display: block; padding: 4px 12px 10px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 18px; color: var(--text-2); overflow-wrap: anywhere; }
.ph .pgframe { border: 0; border-radius: 0; box-shadow: none; }
.ph .stopped { padding: 28px 16px 32px; }
.ph .stopped .btn { height: 44px; padding: 0 16px; font-size: 13px; }

.reasons { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr) minmax(0, 2fr) 130px; gap: 0 16px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.reasons > span { padding: 6px 0; border-top: 1px solid var(--line); }
.reasons > .h { border-top: 0; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.reasons b { font-weight: 500; color: var(--text-1); }

`

const LEVEL: Record<Level, string> = {
  critical: 'critical',
  warning: 'warn',
  progressing: 'neutral',
  healthy: 'good',
  neutral: 'neutral',
}

interface Lead {
  /** Its dot's level; without one the name starts where a dot's would. */
  level?: Level
  name: string
  /** A quiet word beside the name: its namespace, say. */
  beside?: string
  /** One line under the name. */
  under?: string
}

/** The lead cell: what a row is called. A long name is cut in its middle, its last six kept. */
function lead(l: Lead, o: { fit?: number; twist?: 'open' | 'closed' } = {}): string {
  const name = o.fit && l.name.length > o.fit ? cut(l.name, o.fit) : escape(l.name)
  const dot = l.level
    ? `<span class="dot" style="--m:var(--${LEVEL[l.level]})"></span>`
    : '<span class="nodot"></span>'
  const twist = o.twist
    ? `<span class="twist">${icon(o.twist === 'open' ? 'chevron-down' : 'chevron-right', 14)}</span>`
    : ''
  return `<span class="lead">${twist}${dot}<span class="w"><span class="nm"><b>${name}</b>${l.beside ? `<i>${escape(l.beside)}</i>` : ''}</span>${l.under ? `<small>${escape(l.under)}</small>` : ''}</span></span>`
}

/** A name cut in its middle to `fit` characters, its last six kept, as the phone layout cuts one. */
function cut(name: string, fit: number): string {
  const head = Math.max(4, fit - 7)
  return `${escape(name.slice(0, head))}…${escape(name.slice(-6))}`
}

/** A meter in a cell, as the app's: amber from 75% of its whole, red from 90%. */
const meter = (label: string, text: string, pct?: number) => {
  const color = pct === undefined || pct < 75 ? 'series-1' : pct < 90 ? 'warn' : 'critical'
  const track =
    pct === undefined
      ? '<span class="tk none"></span>'
      : `<span class="tk" style="--c:var(--${color})"><i style="width:${pct}%"></i></span>`
  return `<span class="mtr"><span>${label}<b>${text}</b></span>${track}</span>`
}

interface Row {
  cells: string[]
  cls?: string
  note?: string
}

function table(cols: string, heads: string[] | null, rows: (Row | string)[]): string {
  const th = heads
    ? `<div class="th" role="row">${heads.map((h) => (h.startsWith('<') ? h : `<span>${h}</span>`)).join('')}</div>`
    : ''
  const tr = rows
    .map((r) =>
      typeof r === 'string'
        ? r
        : `<div class="tr ${r.cls ?? ''}${r.note ? ' noted' : ''}" role="row">${r.cells.join('')}${r.note ? `<span class="note">${escape(r.note)}</span>` : ''}</div>`,
    )
    .join('')
  return `<div class="t" style="--cols:${cols}">${th}${tr}</div>`
}

const head = (text: string, o: { r?: boolean; sorted?: 'up' | 'down'; can?: boolean } = {}) =>
  `<span class="${[o.r ? 'r' : '', o.sorted ? 'sorted' : '', o.can ? 'can' : ''].join(' ')}">${text}${o.sorted ? icon(o.sorted === 'up' ? 'arrow-up' : 'arrow-down', 12) : ''}</span>`

const card = (title: string, note: string, body: string) =>
  `<div class="kcard"><h3>${title}${note ? `<small>${note}</small>` : ''}</h3><div class="in">${body}</div></div>`

const spec = (title: string, sub: string, body: string, rule: string) =>
  `<section class="spec"><h2>${title}<i>${sub}</i></h2>${body}<p>${rule}</p></section>`

const LONG = 'checkout-payments-reconciliation-worker-eu-west-1-blue-canary-7d9f6c5b8-x2kqp'
const WHY =
  '0/9 nodes are available: 3 Insufficient memory, 6 node(s) didn’t match Pod’s node affinity/selector. preemption: 0/9 nodes are available: 9 No preemption victims found for incoming pod.'

// ─── Table, on the desktop ─────────────────────────────────────────────────────────────────

/** 1. The lead and the scale: every column a table can have, measured. */
function anatomy(): string {
  const cols = 'minmax(0,1.4fr) 88px minmax(0,1fr) 144px 28px'
  const ruler = `<div class="ruler" style="--cols:${cols}"><span>lead · wide, 1.4 shares</span><span>narrow · 88</span><span>normal · a share</span><span>status · 144</span><span>as its text</span></div>`
  return spec(
    'The lead, and the scale',
    'what a row is called, then columns from five widths',
    card(
      'Node pools',
      '3',
      `${ruler}${table(cols, null, [
        {
          cells: [
            lead({ level: 'healthy', name: 'general', under: 'On demand and spot · amd64' }),
            '<span class="q r">7 nodes</span>',
            meter('CPU', '24 of 64 cores', 38),
            `<span>${pill('healthy', 'Ready')}</span>`,
            '<span class="q3 r">41d</span>',
          ],
        },
        {
          cells: [
            lead({ level: 'warning', name: 'batch', under: 'Spot only · arm64' }),
            '<span class="q r">12 nodes</span>',
            meter('CPU', '105 of 128 cores', 82),
            `<span>${pill('warning', 'Near its limit')}</span>`,
            '<span class="q3 r">9d</span>',
          ],
        },
        {
          cells: [
            lead({ name: 'gpu', under: 'No nodes yet' }),
            '<span class="q r">0 nodes</span>',
            meter('CPU', 'no limit'),
            `<span>${pill('neutral', 'Idle')}</span>`,
            '<span class="q3 r">2h</span>',
          ],
        },
      ])}`,
    ),
    'A row starts with its <b>lead</b>: a dot in a status’s level (or none, and the name keeps its place), a name, optionally a quiet word beside it and one line under. After it come columns from <b>one scale</b>: narrow (88 px), normal (a share), wide (1.4 shares), a Status’s own 144 px, or as wide as its text, which is the widest value in that column, measured from the rows’ data and not from the rows drawn, so every row agrees and nothing shifts as a long table scrolls; <b>16 px between columns</b>, always. A plugin picks from the scale and never gives a width. Numbers and ages stand right and use tabular figures. A row with one line is 36 px, with a line under 52.',
  )
}

/** 2. Headings and sorting: a table with none is Karpenter's rows; with them it sorts. */
function sorting(): string {
  const cols = 'minmax(0,1.4fr) 144px 88px 88px'
  return spec(
    'Headings, and sorting',
    'a table without headings is a list of rows',
    card(
      'Certificates',
      '4',
      table(
        cols,
        [
          head('Name', { can: true }),
          head('Status', { sorted: 'down', can: true }),
          head('Renews', { r: true, can: true }),
          head('Age', { r: true, can: true }),
        ],
        [
          {
            cells: [
              lead({ level: 'critical', name: 'payments-tls', beside: 'shop' }),
              `<span>${pill('critical', 'Failed')}</span>`,
              '<span class="q r">—</span>',
              '<span class="q3 r">88d</span>',
            ],
          },
          {
            cells: [
              lead({ level: 'warning', name: 'storefront-tls', beside: 'shop' }),
              `<span>${pill('warning', 'Expires soon')}</span>`,
              '<span class="q r">in 3d</span>',
              '<span class="q3 r">87d</span>',
            ],
            cls: 'opens hover',
          },
          {
            cells: [
              lead({ level: 'healthy', name: 'api-tls', beside: 'platform' }),
              `<span>${pill('healthy', 'Ready')}</span>`,
              '<span class="q r">in 61d</span>',
              '<span class="q3 r">29d</span>',
            ],
            cls: 'focus',
          },
          {
            cells: [
              lead({ level: 'healthy', name: 'grafana-tls', beside: 'monitoring' }),
              `<span>${pill('healthy', 'Ready')}</span>`,
              '<span class="q r">in 74d</span>',
              '<span class="q3 r">16d</span>',
            ],
          },
        ],
      ),
    ),
    'A plugin <b>names every column, always</b> (a phone labels its facts with the names, a screen reader says them) and says separately whether headings show; a table without them is a list of rows, as Karpenter’s cards are. A column sorts if the plugin says it can: its heading is then a button, the sorted one in the stronger color with an arrow, and <b>a Status sorts worst first</b> by level, not by its word. A row that <b>opens something</b> is one target, edge to edge: a fill under the pointer (second row), the focus ring from the keyboard (third), and no chevron. <b>Keys</b>, as Lumovi’s own lists: the table is one stop for Tab, however many rows it has, and keeps the focus while an active row moves inside it: up and down (or k and j), Home and End for the first and last row, Page Up and Page Down by ten. Enter opens the active row; Space isn’t a row’s key (a long list scrolls by a screen, as any scrolling box does). The headings that sort are stops after the rows, as in the app’s lists, each a button for Enter or Space; a screen reader still reads headings first. Nothing here picks rows.',
  )
}

/** 3. Groups, rows that nest, and "show all". */
function structure(): string {
  const cols = 'minmax(0,1.4fr) minmax(0,1fr) 144px'
  const R = (
    l: Lead,
    a: string,
    s: string,
    o: Partial<Row> & { twist?: 'open' | 'closed' } = {},
  ) => ({
    cells: [lead(l, { twist: o.twist }), `<span class="q">${a}</span>`, `<span>${s}</span>`],
    cls: o.cls,
  })
  return spec(
    'Groups, rows that nest, and “show all”',
    'one level of each',
    card(
      'Resources',
      '5 of 23',
      `${table(
        cols,
        [head('Name'), head('Sync'), head('Health')],
        [
          '<h4>Workloads <small>3</small></h4>',
          R(
            { level: 'healthy', name: 'storefront', under: 'Deployment' },
            'Synced',
            pill('healthy', 'Healthy'),
            { twist: 'closed' },
          ),
          R(
            { level: 'healthy', name: 'checkout', under: 'Deployment' },
            'Synced',
            pill('healthy', 'Healthy'),
            { twist: 'closed' },
          ),
          R(
            { level: 'critical', name: 'cart', under: 'Deployment' },
            'Out of sync',
            pill('critical', 'Degraded'),
            { twist: 'open' },
          ),
          R(
            { level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' },
            '',
            pill('healthy', 'Running'),
            { cls: 'child' },
          ),
          R(
            { level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' },
            '',
            pill('critical', 'CrashLoopBackOff'),
            { cls: 'child' },
          ),
          '<h4>Network <small>2</small></h4>',
          R(
            { level: 'healthy', name: 'storefront', under: 'Service' },
            'Synced',
            pill('healthy', 'Healthy'),
          ),
          R(
            { level: 'neutral', name: 'shop-old', under: 'Ingress' },
            'Not in the repository',
            pill('neutral', 'Unknown'),
          ),
        ],
      )}<span class="t"><span class="more">Show all 23</span></span>`,
    ),
    '<b>Groups</b> are the table’s own: a heading in small capitals with its count, never one a plugin places by hand. <b>A row may hold rows</b>, one level (the Graph’s own table is the one exception: it nests as deep as its lines go): a chevron before the dot opens it, its rows stand set in under its name and are rows like any other. A plugin says how many rows show first; the rest are behind <b>“Show all 23”</b>, which opens them in place. The count is of rows at the top level (here 3 and 2 of 23), never of the rows inside them. Past a few hundred the table draws only the rows in view, so 2,500 feel like 25. <b>Keys:</b> right opens the active row if it holds rows, left closes it, and on any other row they do nothing (the kit’s Table is never paged, so they turn no page); a group’s heading is not a stop; “Show all 23” is a button after the rows.',
  )
}

/** 4. The hard cases: the longest name, a note, a cell that takes the rest. */
function hard(): string {
  const cols = 'minmax(0,1fr) 88px 88px'
  return spec(
    'The longest name, a note, a cell that takes the rest',
    'what breaks a row first',
    `${card(
      'Nodes',
      '',
      table(cols, null, [
        {
          cells: [
            lead(
              {
                level: 'healthy',
                name: 'worker-eu-west-1a-m6i-2xlarge-on-demand-4f1c9aa7',
                under: 'm6i.2xlarge · on demand · eu-west-1a',
              },
              { fit: 38 },
            ),
            meter('CPU', '62%', 62),
            meter('Memory', '81%', 81),
          ],
        },
        {
          cells: [
            lead({
              level: 'healthy',
              name: 'worker-2',
              under: 'c7g.xlarge · spot · eu-west-1b',
            }),
            '<span class="rest" style="--rest:2 / 4">Ready · 4 cores</span>',
          ],
        },
      ]),
    )}${card(
      'Waiting for a node',
      '2',
      table('minmax(0,1fr) 28px', null, [
        {
          cells: [
            lead({ level: 'warning', name: LONG, beside: 'shop' }, { fit: 34 }),
            '<span class="q3 r">11m</span>',
          ],
          note: WHY,
        },
        {
          cells: [
            lead({ level: 'warning', name: 'reports-nightly-28931', beside: 'data' }),
            '<span class="q3 r">2m</span>',
          ],
          note: '0/9 nodes are available: 9 Insufficient cpu.',
        },
      ]),
    )}`,
    '<b>A name is never cut at its end.</b> Too long for its column, it loses its middle and keeps its last six characters, where a pod’s or a node’s name differs from its neighbours; the whole name is its title on hover and what a screen reader says. The word beside it gives way first (to 40% of the lead at most), then the name; the line under is the one thing cut at its end. <b>A row’s last cell may take the rest of the row</b> (second node: no meters to show, so words in their place); no other spans. <b>A note</b> runs under the whole row from the name’s left edge, two lines at most, then “…”; with a note the dot sits on the name’s line.',
  )
}

/** 5. Nothing to list: busy, failed, empty, quiet. */
function states(): string {
  const box = (title: string, body: string) => card(title, '', body)
  return spec(
    'Nothing to list',
    'busy, failed, empty, quiet',
    `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">
      ${box('Certificates', `<div class="skel"><i style="width:70%"></i><i style="width:52%"></i><i style="width:61%"></i></div>`)}
      ${box('Certificates', `<div class="state"><span class="tile">${icon('triangle-alert', 18)}</span><b>Couldn’t list certificates</b><span>certificates.cert-manager.io is forbidden for jane@example.com in shop.</span><span class="btn secondary sm">Try again</span></div>`)}
      ${box('Certificates', `<div class="state"><span class="tile">${icon('search', 18)}</span><b>No certificates</b><span>Nothing in shop matches “tls-old”.</span></div>`)}
      ${box('Waiting for a node', `<div class="state">${icon('circle-check', 22, 2, 'color:var(--good)')}<span style="margin-top:4px">No pods are waiting for a node.</span></div>`)}
    </div>`,
    'One part with four states, and the plugin says which and gives the words. <b>Busy</b> is a skeleton of rows, as the app’s list pages have, never the spinner; the part brings its own. <b>Failed</b> says what couldn’t be read in the cluster’s own words, with Try again. <b>Empty</b> has the tile, a title and a line. <b>Quiet</b> is for nothing to list and nothing wrong: one calm line, with a check if that’s good news. A filter that leaves nothing is Empty and names the filter.',
  )
}

// ─── Table, on a phone ─────────────────────────────────────────────────────────────────────

const fact = (label: string, value: string) => `<div><dt>${label}</dt><dd>${value}</dd></div>`

function phoneFrame(title: string, body: string, back = false): string {
  return `<div class="ph"><div class="bar"><span class="tap">${icon(back ? 'arrow-left' : 'menu', 20)}</span><h1>${title}</h1></div>${body}</div>`
}

/** 6. On a phone a row is a card: the lead, then its other columns as labelled facts. */
function phoneCards(): string {
  const a = phoneFrame(
    'Karpenter',
    `<div class="sec"><h3>Node pools<small>3</small></h3><ul class="cards">
      <li><div class="top">${lead({ level: 'healthy', name: 'general', under: 'On demand and spot · amd64' })}</div><dl>${fact('Nodes', '7')}${fact('CPU', '24 of 64')}${fact('Status', 'Ready')}</dl></li>
      <li class="press"><div class="top">${lead({ level: 'warning', name: 'batch', under: 'Spot only · arm64' })}</div><dl>${fact('Nodes', '12')}${fact('CPU', '105 of 128')}${fact('Status', 'Near its limit')}</dl></li>
      <li><div class="top">${lead({ name: 'gpu', under: 'No nodes yet' })}</div><dl>${fact('Nodes', '0')}${fact('CPU', 'no limit')}${fact('Status', 'Idle')}</dl></li>
    </ul></div>
    <div class="sec"><h3>Waiting for a node<small>2</small></h3><ul class="cards">
      <li><div class="top">${lead({ level: 'warning', name: LONG, beside: 'shop' }, { fit: 30 })}</div><p class="pnote">0/9 nodes are available: 3 Insufficient memory, 6 node(s) didn’t match Pod’s node affinity/selector. preemption: 0/9 nodes are…</p><dl class="one">${fact('Waiting', '11m')}</dl></li>
    </ul></div>`,
  )
  const b = phoneFrame(
    'Argo CD',
    `<div class="sec"><h3>Resources<small>5 of 23</small><span class="tapb">${icon('arrow-up-down', 16)}</span></h3>
      <h4>Workloads <small>3</small></h4>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Deployment' })}<span class="twist">${icon('chevron-right', 16)}</span></div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'healthy', name: 'checkout', under: 'Deployment' })}<span class="twist">${icon('chevron-right', 16)}</span></div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'critical', name: 'cart', under: 'Deployment' })}<span class="twist">${icon('chevron-down', 16)}</span></div><dl class="one">${fact('Sync', 'Out of sync')}${fact('Health', 'Degraded')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' })}</div><dl class="one">${fact('Health', 'Running')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' })}</div><dl class="one">${fact('Health', 'CrashLoopBackOff')}</dl></li>
      </ul>
      <h4>Network <small>2</small></h4>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Service' })}</div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'neutral', name: 'shop-old', under: 'Ingress' })}</div><dl class="one">${fact('Sync', 'Not in the repository')}${fact('Health', 'Unknown')}</dl></li>
      </ul>
      <div class="pmore">Show all 23</div>
    </div>`,
  )
  return `<section class="spec"><h2>On a phone<i>a row is a card</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${a}${b}</div><p style="max-width:820px">Under 640 px <b>a row is a card</b>, by the phone layout’s own rule: its lead first, as on the desktop, then its other columns as labelled facts. Facts stand side by side <b>only when every value in the table fits a third</b> on one line; otherwise each takes a line, in every card of that table, its groups included, so a table’s cards all read the same way (right: “Not in the repository” doesn’t fit, so all of Resources stacks; left: Node pools’ values all fit). The facts’ labels are the columns’ names, which is why a plugin names every column even where no headings show. A meter becomes its words; a Status keeps its word and the lead’s dot keeps its level. A note stands under the lead, three lines at most. A row that opens is the whole card (second card, pressed). A row that holds rows has a 44 px chevron at its right; its rows are cards set in beneath it, closed until asked. A group’s heading stands above its cards. <b>Sorting</b> is the phone’s Sort sheet, from the button in the table’s heading, listing the columns that sort.</p></section>`
}

// ─── The pick list, the three arrangements, the second-level header ────────────────────────

interface Picked {
  lead: Lead
  status: [Level, string]
}

/** Worst first, as Table sorts a Status. */
const CLUSTERS: Picked[] = [
  {
    lead: { level: 'warning', name: 'orders-db', under: '2 of 3 ready · shop' },
    status: ['warning', 'Not all ready'],
  },
  {
    lead: { level: 'progressing', name: 'sessions-db', under: '1 of 2 ready · shop' },
    status: ['progressing', 'Switching over'],
  },
  {
    lead: { level: 'healthy', name: 'payments-db', under: '3 of 3 ready · shop' },
    status: ['healthy', 'Healthy'],
  },
  {
    lead: { level: 'healthy', name: 'reports-db', under: '1 of 1 ready · data' },
    status: ['healthy', 'Healthy'],
  },
]

const LONG_DB = 'checkout-payments-reconciliation-ledger-eu-west-1-blue-canary-db'
const WORST: Picked = {
  lead: { level: 'critical', name: LONG_DB, under: '0 of 3 ready · shop' },
  status: ['critical', 'Unrecoverable'],
}

function pickList(
  items: Picked[],
  on: number,
  o: { fit?: number; mark?: Record<number, string> } = {},
): string {
  return `<div class="pick" role="listbox">${items
    .map(
      (it, i) =>
        `<div class="pi${i === on ? ' on' : ''}${o.mark?.[i] ? ` ${o.mark[i]}` : ''}" role="option">${lead(it.lead, { fit: o.fit })}<span class="st">${pill(it.status[0], it.status[1])}</span></div>`,
    )
    .join('')}</div>`
}

interface TileOptions {
  /** Its value is words or a name, not a number: set smaller, a name cut in its middle. */
  words?: boolean
  /** A level's dot before the line under. */
  level?: Level
  /** It opens a named destination: a button, with a chevron (under the pointer; always on touch). */
  opens?: boolean
  hover?: boolean
}

/** A tile, as the app's Overview has them and Karpenter's page uses. */
function tile(
  glyph: Parameters<typeof icon>[0],
  label: string,
  value: string,
  sub: string,
  o: TileOptions = {},
): string {
  const dot = o.level ? `<span class="dot" style="--m:var(--${LEVEL[o.level]})"></span>` : ''
  return `<div class="ktile${o.hover ? ' hover' : ''}"><div class="l">${icon(glyph, 16)}<span>${label}</span>${o.opens ? `<span class="go">${icon('chevron-right', 16)}</span>` : ''}</div><div class="v${o.words ? ' words' : ''}">${value}</div><div class="s">${dot}<span>${sub}</span></div></div>`
}

const btn = (label: string, kind: 'primary' | 'secondary' | 'ghost') =>
  `<span class="btn ${kind} sm">${label}</span>`

const MORE = `<span class="btn secondary sm" style="width:28px;padding:0">${icon('ellipsis', 14)}</span>`

function header2(name: string, status: [Level, string], buttons: string, fit?: number): string {
  const shown = fit && name.length > fit ? cut(name, fit) : escape(name)
  return `<div class="h2nd"><b>${shown}</b><span class="st">${pill(status[0], status[1])}</span><span class="acts">${buttons}</span></div>`
}

const ACTS = `${btn('Restart…', 'ghost')}${btn('Switch over…', 'secondary')}${btn('Back up now…', 'primary')}`

const TILES = (hover = false) =>
  `${tile('server', 'Instances ready', '2/3', '1 not ready', { level: 'warning', opens: true, hover })}${tile('database', 'Primary', 'orders-db-1', 'since 12 days ago', { words: true, opens: true })}${tile('clock', 'Last backup', '3h', 'Completed', { level: 'healthy', opens: true })}${tile('layers', 'PostgreSQL', '17.2', '20Gi for each instance')}`

/** 1. A page made of the three arrangements, with a pick list and a second-level header. */
function pageWhole(): string {
  const stub = (title: string, note: string, text: string) =>
    card(title, note, `<div class="stub">${text}</div>`)
  return spec(
    'A page, from three arrangements',
    'a split, a row of tiles, a stack',
    `<div class="pagebox"><div class="arr-split tag o" data-tag="split · a 300 px side, then the rest">
      ${card('Clusters', '4', pickList(CLUSTERS, 0, { mark: { 1: 'hover' } }))}
      <div class="arr-stack tag b o" data-tag="stack · 16 px apart">
        ${header2('orders-db', ['warning', 'Not all ready'], ACTS)}
        <div class="arr-tiles tag o" style="--n:4" data-tag="tiles · 2 to 4, equal">${TILES(true)}</div>
        ${stub('Instances', '3', 'a Table')}
        ${stub('Backups', 'the last 3 of 41', 'a Table')}
      </div>
    </div></div>`,
    'A plugin places its parts with <b>three arrangements and nothing else</b>, and never gives a width, a gap or a position. <b>A stack</b>: one under another, 16 px apart; it’s what a page is when nothing else is said. <b>A row of tiles</b>: two to four, equal widths, 16 px apart. <b>A split</b>: a side 300 px wide, then the rest; the side holds a pick list and the rest follows what’s picked. A split holds stacks and rows of tiles; nothing holds a split, so a page has one at most. The page’s own padding and the cards’ are Lumovi’s.',
  )
}

/** 2. The pick list by itself: its states, and the cases that break it. */
function pickCases(): string {
  const many: Picked[] = [
    WORST,
    ...CLUSTERS,
    {
      lead: { level: 'healthy', name: 'search-db', under: '2 of 2 ready · search' },
      status: ['healthy', 'Healthy'],
    },
    { lead: { name: 'archive-db', under: 'Hibernated · data' }, status: ['neutral', 'Stopped'] },
  ]
  return spec(
    'The pick list',
    'one is always picked',
    `<div style="display:grid;grid-template-columns:300px 300px minmax(0,1fr);gap:16px;align-items:start">
      ${card('Clusters', '38', `<div class="pfind">${icon('search', 14)}Filter clusters</div><div class="fadeb" style="--h:300px">${pickList(many, 3, { fit: 15, mark: { 2: 'focus' } })}</div>`)}
      ${card('Clusters', '1', pickList([CLUSTERS[2]!], 0))}
      ${card('Clusters', '', `<div class="state"><span class="tile">${icon('database', 18)}</span><b>No clusters</b><span>CloudNativePG is installed, and nothing in demo uses it yet.</span></div>`)}
    </div>`,
    'A pick list’s row <b>is Table’s lead</b> with a Status at its right, 52 px high, so the two parts share one row; its card says what’s listed and how many. <b>One row is always picked</b>: the first when the page opens, and the list is sorted worst first unless the plugin says otherwise, so the first is the one to look at. The picked row has the selection’s blue wash, and never the blue alone: the rest of the page names it in its header. Under the pointer a row has the fill; from the keyboard the ring. <b>Keys:</b> up and down move the focus, Enter or Space picks; picking never needs the pointer. Past twelve rows it scrolls inside the side, with a filter above it, and the picked row is kept in view. <b>A long name</b> takes the middle cut; the Status is never cut. With nothing to list it shows Table’s empty state, and the rest of the page shows nothing.',
  )
}

/** 3. The second-level header, and tiles: their hard cases. */
function headerCases(): string {
  return spec(
    'The second-level header, and tiles',
    'the longest name, more than three actions, values that don’t fit',
    `<div class="pagebox arr-stack">
      ${header2(LONG_DB, ['critical', 'Unrecoverable'], `${btn('Switch over…', 'secondary')}${MORE}${btn('Back up now…', 'primary')}`, 40)}
      ${header2('orders-db', ['warning', 'Not all ready'], ACTS)}
      ${header2('reports-db', ['healthy', 'Healthy'], btn('Back up now…', 'primary'))}
      <div class="arr-tiles" style="--n:4">${tile('database', 'Primary', cut('checkout-payments-reconciliation-ledger-1', 20), 'since 12 days ago', { words: true, opens: true })}${tile('clock', 'Last backup', 'Never', 'No schedule backs this cluster up', { words: true, level: 'warning' })}${tile('box', 'Storage for each instance, of what its class allows', '1.2 TiB', 'of 2 TiB')}${tile('layers', 'PostgreSQL', '17.2', '')}</div>
      <div class="arr-tiles" style="--n:3">${tile('git-branch', 'Out of sync', '2/5', '2 resources differ', { level: 'warning', opens: true })}${tile('git-branch', 'Revision', 'main at 4f1c9aa', 'platform/apps/shop', { words: true })}${tile('clock', 'Auto-sync', 'Off', 'Sync by hand', { words: true })}</div>
      <div class="arr-tiles" style="--n:2">${tile('server', 'Nodes ready', '9/9', 'All ready', { level: 'healthy', opens: true })}${tile('box', 'Waiting for a node', '2', 'the oldest for 11 minutes', { level: 'warning', opens: true })}</div>
    </div>`,
    '<b>The header</b> says what’s picked: its name at 17 px, its Status, and at most <b>three buttons</b> at the right, the one that matters most last and the only one filled. With more than three actions the filled one stays last, <b>“…” stands before it</b> and holds the rest (first header: five actions). The name stays on one line and takes the middle cut; the Status and the buttons are never cut or wrapped. A button whose change asks first ends in “…”, and the asking is Lumovi’s own dialog. <b>A tile is the app’s own</b>, the Overview’s, which Karpenter’s page uses: an icon and a label, a value at 28 px, and one line under with, optionally, a level’s dot. A value that is words or a name and not a number is set at 15 px on the same 28 px line, as the Metrics page’s small tile sets one; what’s new is that a name there takes the middle cut; the label and the line under are cut at their ends; a tile without a line under keeps its height, so tiles in a row are always the same height. A tile that <b>opens a named destination</b> is a button: its border darkens and a chevron shows under the pointer (first tile above), and the chevron always shows on touch; one that opens nothing has neither.',
  )
}

/** 4. On a phone: the list is the page, and what's picked is a page of its own. */
function pagePhone(): string {
  const list = phoneFrame(
    'CloudNativePG',
    `<div class="pcount">5 clusters</div><div class="pick" style="border-top:1px solid var(--line)">${[
      WORST,
      ...CLUSTERS,
    ]
      .map(
        (it, i) =>
          `<div class="pi${i === 1 ? ' press' : ''}">${lead(it.lead, { fit: 20 })}<span class="st">${pill(it.status[0], it.status[1])}</span></div>`,
      )
      .join('')}</div>`,
  )
  const one = phoneFrame(
    'orders-db',
    `<div class="under">${pill('warning', 'Not all ready')}</div>
    <p class="larger">Open Lumovi on a larger screen to back up, switch over or restart this cluster.</p>
    <div class="ptiles">${TILES()}</div>
    <div class="sec"><h3>Instances<small>3</small></h3><div class="stub" style="border:1px solid var(--line);border-radius:12px">a Table, as cards</div></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the list is the page; what’s picked is a page of its own</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${list}${one}</div><p style="max-width:820px">Under 640 px <b>a split is two pages</b>: the pick list first, full width, under a line that says how many (and, past twelve, a filter field 44 px high above it, as the phone’s lists have), its rows 60 px high as the phone’s lists are, and nothing picked (second row, pressed). Tapping one opens the rest as a page with Back, the picked thing’s name in the top bar (middle cut) and its Status on a line of its own under it. <b>A plugin’s own actions that change the cluster aren’t offered on a phone</b>: a phone changes only what Lumovi lists for it, so the header’s buttons give way to one line saying where they are, in the app’s own words for it. Buttons that only read or open something stay, 44 px high. <b>A row of tiles</b> is two across, then wraps, the chevron in the tile’s corner; a single tile takes the width. <b>A stack</b> is a stack. Back returns to the list where it was.</p></section>`
}

// ─── Parts shown by reference: a Secret's value, logs, events ──────────────────────────────

const PLUGIN = 'Argo CD'

const refCard = (title: string, them: 'it' | 'them', note: string, body: string) =>
  `<div class="kcard"><h3>${title}<span class="by">Shown by Lumovi. ${PLUGIN} can’t see ${them}.</span>${note ? `<small>${note}</small>` : ''}</h3><div class="in">${body}</div></div>`

const ib = (glyph: Parameters<typeof icon>[0], off = false) =>
  `<span class="ib${off ? ' off' : ''}">${icon(glyph, 16)}</span>`

function secretKey(
  key: string,
  value: string | null,
  size: string,
  o: { box?: boolean; quiet?: string } = {},
): string {
  const hiddenByAccess = o.quiet !== undefined
  const shown = hiddenByAccess
    ? `<span class="val quiet">${o.quiet}</span>`
    : value === null
      ? '<span class="val dots">••••••••</span>'
      : `<span class="val${o.box ? ' box' : ''}">${escape(value)}</span>`
  // A value the person's access hides has nothing to reveal or copy.
  const buttons = hiddenByAccess
    ? ''
    : `<span class="do">${ib(value === null ? 'eye' : 'eye-off')}${ib('copy')}</span>`
  return `<div class="sk"><div class="top"><span class="k">${key}</span>${size ? `<small>${size}</small>` : ''}${buttons}</div>${shown}</div>`
}

const LONG_SECRET = Array.from({ length: 22 }, (_, i) =>
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ'.slice(
    i * 3,
  ),
).join('')

const said = (text: string, warn = false) =>
  `<div class="said${warn ? ' warn' : ''}">${icon(warn ? 'lock' : 'info', 16)}<span>${text}</span></div>`

/** 1. A Secret's value, shown by Lumovi and never held by the plugin. */
function refSecret(): string {
  return spec(
    'A Secret’s value',
    'shown and not held',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      ${refCard(
        'Repository credentials',
        'it',
        `<span class="btn ghost sm" style="margin:-6px -8px -6px 0">${icon('eye', 14)}Reveal all</span>`,
        `<div class="secret">${secretKey('username', 'deploy-bot', '10 B')}${secretKey('password', null, '40 B')}${secretKey('sshPrivateKey', LONG_SECRET, '1.6 KB', { box: true })}${secretKey('tls.crt', null, '', { quiet: 'Value hidden by your access' })}</div>`,
      )}
      <div class="arr-stack">
        ${refCard('Repository credentials', 'it', '', said(`Your account isn’t allowed to read this Secret. ${PLUGIN}’s page asks Lumovi to show it here.`, true))}
        ${refCard('Repository credentials', 'it', '', said(`There’s no Secret named repo-credentials in argocd. ${PLUGIN}’s page points at it.`))}
        ${refCard('Repository credentials', 'it', '', `<div class="secret">${secretKey('username', null, '10 B')}</div>${said('Secret repo-credentials in argocd has no key named token.')}`)}
      </div>
    </div>`,
    `A plugin says <b>which Secret and which keys</b>; Lumovi reads it as the person, under their own rights, and draws it with the Secret page’s own controls, unchanged: each key in a box of its own, its size and its buttons on the key’s line and the value under it; eight dots whatever the value’s length, Reveal and Hide for each key, Reveal all and Hide all, Copy. A value the person’s access hides says so and has no buttons. <b>Nothing goes back to the plugin</b>: not the value, not its length, not whether it was revealed; the part’s heading says so, once, and it’s only drawn by a part of which it’s true. A revealed value wraps whole and is never cut with “…” (a cut Secret looks whole): past 288 px (about sixteen lines) it scrolls inside its box, as on the Secret page, and Copy takes all of it. Where the person may not read it, or it isn’t there, Lumovi says which, by name, and that the plugin’s page asked. <b>It stands in a card or a tab of its own</b>, full width, never in a table’s cell or a tile.`,
  )
}

const LOGS = [
  [
    '',
    'time="2026-10-11T09:14:02Z" level=info msg="Reconciliation completed" application=storefront dedup_ms=0 dest-namespace=shop',
  ],
  [
    '',
    'time="2026-10-11T09:14:31Z" level=info msg="Comparing app state" application=cart revision=4f1c9aa',
  ],
  [
    'err',
    'time="2026-10-11T09:14:32Z" level=error msg="ComparisonError: failed to load target state: rpc error: code = Unavailable desc = connection error" application=cart',
  ],
  [
    '',
    'time="2026-10-11T09:14:33Z" level=info msg="Skipping auto-sync: application status is Unknown" application=cart',
  ],
]

/** 2. A pod's logs and an object's events: Lumovi's own views, unchanged. */
function refLogs(): string {
  const tools = `<div class="ktools"><span class="kfield" style="flex:none;white-space:nowrap">application-controller<span class="end">${icon('chevrons-up-down', 14)}</span></span><span class="kfield ph" style="flex:1">${icon('search', 14)}Search</span><span class="ib">${icon('play', 16)}</span></div>`
  const ev = (w: boolean, reason: string, msg: string, n: string, age: string) =>
    `<div class="ev${w ? ' w' : ''}">${icon(w ? 'triangle-alert' : 'info', 14)}<b>${reason}</b><span>${msg}</span><small>${n}</small><small>${age}</small></div>`
  return spec(
    'A pod’s logs, an object’s events',
    'Lumovi’s own views, unchanged',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack">
        ${refCard('Logs', 'them', 'argocd-application-controller-0', `${tools}<div class="klog">${LOGS.map(([c, l]) => `<div class="${c}">${escape(l!)}</div>`).join('')}</div>`)}
        ${refCard('Logs', 'them', 'argocd-repo-server-7d9f6c5b8-x2kqp', `<div class="state" style="min-height:96px"><span>Nothing is running for this right now, so there are no logs to show.</span></div>`)}
        ${refCard('Logs', 'them', '', said(`There’s no pod named argocd-repo-server-7d9f6c5b8-x2kqp in argocd: it may have been deleted.`))}
      </div>
      <div class="arr-stack">
        ${refCard(
          'Events',
          'them',
          'Application storefront',
          `${ev(true, 'OperationFailed', 'Sync operation to 4f1c9aa failed: one or more objects failed to apply', '×14', '2m')}
          ${ev(false, 'OperationStarted', 'Initiated sync to 4f1c9aa', '×14', '2m')}
          ${ev(false, 'ResourceUpdated', 'Updated sync status: Synced → OutOfSync', '×3', '11m')}
          ${ev(false, 'ResourceUpdated', 'Updated health status: Healthy → Degraded', '', '11m')}`,
        )}
        ${refCard('Events', 'them', 'Application storefront', said(`Your account isn’t allowed to read these events. ${PLUGIN}’s page asks Lumovi to show them here.`, true))}
      </div>
    </div>`,
    `A plugin says <b>which pod</b> (and may say which container) or <b>which object</b>. Logs are the app’s own log view, with its container picker, Search and Follow, and its own words when there’s nothing. Events are <b>the detail’s Events tab as it is</b>: an icon, the reason, the message, how often and how long ago, newest first, with no count and no filter. That list draws every row today; for an object with thousands of events it must draw only the rows in view, which is new work for the tab and the part alike, and is the one thing here that isn’t the app’s already. The plugin never holds a line of either. Refusals and missing things are said as for a Secret. On a phone both are the phone layout’s own: log lines wrap and hang, and events are its two-line rows.`,
  )
}

/** 3. On a phone. */
function refPhone(): string {
  const a = phoneFrame(
    'storefront',
    `<div class="sec"><h3>Repository credentials<span class="btn ghost sm" style="height:44px;margin:-12px -10px -12px auto">${icon('eye', 16)}Reveal all</span></h3><p class="larger" style="padding:0 0 8px">Shown by Lumovi. ${PLUGIN} can’t see it.</p><div class="secret">${secretKey('username', 'deploy-bot', '10 B')}${secretKey('password', null, '40 B')}${secretKey('tls.crt', null, '', { quiet: 'Value hidden by your access' })}</div></div>
    <div class="sec"><h3>Logs</h3><p class="larger" style="padding:0 0 8px">Shown by Lumovi. ${PLUGIN} can’t see them.</p><div class="klog">${LOGS.slice(
      1,
      3,
    )
      .map(([c, l]) => `<div class="${c}">${escape(l!)}</div>`)
      .join('')}</div></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the same parts, a finger’s size</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${a}</div><p style="max-width:820px">The caption moves under the part’s title, since a phone’s heading has no room beside it. A key’s box is the desktop’s, with Reveal, Copy and Reveal all at 44 px. Logs wrap and hang by two characters, as the phone’s logs do. Revealing and copying are reads by the person, so a phone has them.</p></section>`
}

// ─── A plugin's form inside Lumovi's own confirmation ──────────────────────────────────────

const fld = (label: string, control: string, hint = '', bad = '') =>
  `<div class="fld"><label>${label}</label>${control}${bad ? `<p class="bad">${bad}</p>` : hint ? `<p>${hint}</p>` : ''}</div>`

const kseg = (items: string[], on: string) =>
  `<span class="kseg">${items.map((i) => `<span class="${i === on ? 'on' : ''}">${i}</span>`).join('')}</span>`

const ksw = (on: boolean) => `<span class="ksw${on ? ' on' : ''}"><i></i></span>`

const kfield = (
  value: string,
  o: { mono?: boolean; bad?: boolean; ph?: boolean; width?: number; end?: boolean } = {},
) =>
  `<span class="kfield${o.mono ? ' mono' : ''}${o.bad ? ' bad' : ''}${o.ph ? ' ph' : ''}"${o.width ? ` style="width:${o.width}px"` : ''}>${value}${o.end ? `<span class="end">${icon('chevrons-up-down', 14)}</span>` : ''}</span>`

const diff = (lines: [string, string][]) =>
  `<div class="kdiff">${lines.map(([k, t]) => `<div class="${k}">${k === 'add' ? '+' : k === 'del' ? '−' : ' '} ${escape(t)}</div>`).join('')}</div>`

const command = (text: string) =>
  `<div class="kcmd"><div class="cl">Equivalent command${icon('copy', 14)}</div><code>${escape(text)}</code></div>`

interface Ask {
  fields: string
  send: string
  approve?: boolean
  cut?: boolean
  maxHeight?: number
  title?: string
  /** The action's own word, as on the button that opened the dialog. */
  verb?: string
}

function ask(a: Ask): string {
  return `<div class="kdlg"${a.maxHeight ? ` style="--mh:${a.maxHeight}px"` : ''}>
    <div class="dh"><span class="g">${icon('git-branch', 18)}</span><div><div class="eb">${icon('plug', 12)}From ${PLUGIN} 2.0.0</div><h3>${a.title ?? 'Patch Application storefront'}</h3><div class="sub"><span>Application · argocd · <b>production-eu</b></span><span class="prodm">Production</span></div></div></div>
    <div class="db">
      <div class="part opts${a.cut ? ' cut' : ''}"><div class="kcap">Options, in ${PLUGIN}’s words</div>${a.fields}</div>
      <div class="part send"><div class="kcap">What Lumovi will send</div>${a.send}</div>
    </div>
    <div class="df"><span class="btn ghost sm">Cancel</span><span class="btn primary sm${a.approve === false ? ' off' : ''}">${a.verb ?? 'Sync'}</span></div>
  </div>`
}

const SYNC_FIELDS = `${fld('Revision', kfield('main', { mono: true, width: 260 }), 'A branch, a tag or a commit. Empty syncs to what the application tracks.')}${fld('Prune', ksw(true), 'Delete resources that are no longer in the repository.')}${fld('Strategy', kseg(['Apply', 'Hook'], 'Apply'))}`

const SYNC_SEND = (revision: string, verdict: string) =>
  `${diff([
    ['', 'operation:'],
    ['add', '  sync:'],
    ['add', `    revision: ${revision}`],
    ['add', '    prune: true'],
    ['add', '    syncStrategy: { apply: {} }'],
  ])}${command(`kubectl patch application storefront -n argocd --type merge -p '{"operation":{"sync":{"revision":"${revision}","prune":true,"syncStrategy":{"apply":{}}}}}' --context production-eu`)}${verdict}`

const OK = `<div class="verdict ok">${icon('circle-check', 14)}<span>The cluster accepts it, as the options stand.</span></div>`
const ASKING = `<div class="verdict">${icon('circle-dashed', 14)}<span>Asking the cluster…</span></div>`

/** 1. The dialog, and its states as the options change. */
function formStates(): string {
  const wrong = ask({
    fields: `${fld('Revision', kfield('main', { mono: true, width: 260 }), 'A branch, a tag or a commit. Empty syncs to what the application tracks.')}${fld('Retries', kfield('25', { mono: true, bad: true, width: 96 }), '', 'A whole number from 1 to 10.')}${fld('Strategy', kseg(['Apply', 'Hook'], ''), '', 'Choose one.')}`,
    send: `<div class="notyet">The change shows here once the options above are filled in.</div>`,
    approve: false,
  })
  const refused = ask({
    fields: `${fld('Revision', kfield('release/2026.10', { mono: true, bad: true, width: 260 }), '', 'The cluster refused it: revision “release/2026.10” isn’t in the repository.')}${fld('Prune', ksw(true), 'Delete resources that are no longer in the repository.')}${fld('Strategy', kseg(['Apply', 'Hook'], 'Apply'))}`,
    send: SYNC_SEND('release/2026.10', ''),
    approve: false,
  })
  return spec(
    'A change that asks for options first',
    'the plugin’s words above, Lumovi’s below',
    `<div style="display:grid;grid-template-columns:repeat(2,560px);gap:28px 32px;align-items:start">
      <div class="arr-stack"><span class="cap">1 · filled in, and the cluster accepts it</span>${ask({ fields: SYNC_FIELDS, send: SYNC_SEND('main', OK) })}</div>
      <div class="arr-stack"><span class="cap">2 · an option changed: asking again, Sync off</span>${ask({ fields: SYNC_FIELDS.replace('>main<', '>4f1c9aa<'), send: SYNC_SEND('4f1c9aa', ASKING), approve: false })}</div>
      <div class="arr-stack"><span class="cap">3 · an option wrong or still empty</span>${wrong}</div>
      <div class="arr-stack"><span class="cap">4 · the cluster refused it</span>${refused}</div>
    </div>`,
    `When a plugin’s change needs options first (“Sync…”, “Back up now…”), <b>the form is inside Lumovi’s own confirmation</b>, never on the plugin’s page. <b>It is a confirmation, not an approval</b>: the person started this change a moment ago on the plugin’s page, and nobody is waiting for an answer. So it has no wait, its buttons are Cancel and the action’s own word (the one on the button that opened it: “Sync”), and Escape cancels, as in Lumovi’s own Scale and Restart. Three places say whose words are whose: the heading (“From ${PLUGIN} 2.0.0”, then Lumovi’s own title of the change, where, and the Production mark); <b>“Options, in ${PLUGIN}’s words”</b> over the fields, whose labels and hints are the plugin’s and are shown whole; and <b>“What Lumovi will send”</b> over the patch and the command, which are Lumovi’s and which no plugin writes. The change <b>follows the fields as they’re filled</b>: after every edit Lumovi asks the cluster again (“Asking the cluster…”, the button off), and only “The cluster accepts it, as the options stand.” makes the button live, so what’s sent is what the cluster was asked. A field that’s wrong or empty says so under itself in Lumovi’s words by its kind (“Fill this in.”, “A whole number from 1 to 10.”, “Choose one.”), and the change’s place says it shows once the options are filled in. What the cluster refuses is said under the field it names, or else under the change.`,
  )
}

/** 2. The hard case: five fields with long labels and hints must not push the change out of sight. */
function formHard(): string {
  const five = `${fld('Revision', kfield('main', { mono: true, width: 260 }), 'A branch, a tag or a commit. Empty syncs to what the application tracks, which for this application is the branch main of platform/apps/shop.')}${fld('Prune resources that are gone from the repository', ksw(true), 'Delete resources that are no longer in the repository. Anything deleted this way is gone from the cluster and is not recoverable from here.')}${fld('Strategy', kseg(['Apply', 'Hook'], 'Apply'), 'Hook runs the application’s sync hooks; Apply sends the manifests as they are.')}${fld('Retries', kfield('3', { mono: true, width: 96 }), 'How many times to try again if the sync fails, from 1 to 10.')}${fld('Only these resources', kfield('Deployment/cart', { mono: true }), 'Leave empty to sync everything.')}`
  return spec(
    'Five fields, long labels, two-line hints',
    'the change never leaves the screen',
    `<div style="display:grid;grid-template-columns:560px minmax(0,1fr);gap:32px;align-items:start">
      ${ask({ fields: five, send: SYNC_SEND('main', OK), cut: true, maxHeight: 640 })}
      <div class="spec" style="gap:10px"><p style="max-width:none"><b>The options scroll; the change doesn’t.</b> When the fields are taller than the dialog allows, they scroll in their own box, fading at its edge, and “What Lumovi will send” stays whole above the buttons with its verdict. A person can’t confirm having read only the plugin’s words.</p><p style="max-width:none"><b>The limits are the format’s:</b> five fields at most; a label of 40 characters and a hint of about two lines (160 characters is design’s number, for app to settle as the format’s), each wrapping whole and never cut. Four kinds of field: text, a whole number, a choice (two to four as a segmented control, more as a select) and a switch. <b>No kind hides what’s typed</b>, and none is labelled or drawn as a password: a plugin’s form is for options, and a field that looks like a sign-in can’t be made.</p><p style="max-width:none"><b>Keys:</b> the focus starts in the first field, Tab goes through the fields to Cancel and the action’s button, Enter in a field doesn’t confirm, Escape cancels.</p></div>
    </div>`,
    'Drawn at the dialog’s greatest height, 640 px here: the first two fields show, the rest are a scroll away, and the patch, the command and the verdict are all in view.',
  )
}

/** 3. On a phone: a tall sheet, the footer pinned. */
function formPhone(): string {
  const body = `<i class="grab" style="display:block"></i>${ask({ fields: SYNC_FIELDS, send: SYNC_SEND('main', OK) })}`
  return `<section class="spec"><h2>On a phone<i>drawn, and not offered until the phone’s rule allows a plugin’s changes</i></h2><div style="display:flex;gap:24px;align-items:flex-start"><div class="ph">${body}</div></div><p style="max-width:820px">The phone’s tall sheet, with its footer pinned: fields 44 px high with 16 px text, Cancel at the left and the action’s button at the right, at least 120 px wide. The options scroll and the change stays above the footer, as on the desktop. <b>Today a phone doesn’t offer a plugin’s changes at all</b> (the page’s frame says where they are instead), so this is the form it takes if that rule is widened, and nothing to build before then.</p></section>`
}

// ─── The graph ─────────────────────────────────────────────────────────────────────────────

const CARD_W = 232
const CARD_H = 56
const ROW = CARD_H + 44

interface GNode {
  id: string
  glyph: Parameters<typeof icon>[0]
  kind: string
  meta?: string
  name: string
  status?: [Level, string]
  col: number
  row: number
  cls?: string
  more?: number
}

type GEdge = [from: string, to: string, o?: { dash?: boolean; label?: string; cls?: string }]

const TEXT: Record<Level, string> = {
  critical: 'critical-text',
  warning: 'warn-text',
  progressing: 'text-2',
  healthy: 'text-2',
  neutral: 'text-2',
}

function gcard(n: GNode, x: number, y: number): string {
  if (n.more)
    return `<div class="gcard more" style="left:${x}px;top:${y}px;width:${CARD_W}px">${icon('plus', 16)}${n.more} more</div>`
  const st = n.status
    ? `<span class="st" style="--m:var(--${LEVEL[n.status[0]]});--mt:var(--${TEXT[n.status[0]]})"><i></i>${n.status[1]}</span>`
    : ''
  const name = n.name.length > 23 ? cut(n.name, 23) : escape(n.name)
  return `<div class="gcard ${n.cls ?? ''}" style="left:${x}px;top:${y}px;width:${CARD_W}px"><span class="gi">${icon(n.glyph, 15)}</span><span class="gw"><span class="g1"><span class="m">${n.kind}${n.meta ? ` · ${n.meta}` : ''}</span>${st}</span><span class="g2">${name}</span></span></div>`
}

/** Cards in rows, and the lines between them; a back edge runs up the side and ends in a head. */
function graph(
  nodes: GNode[],
  edges: GEdge[],
  cols: number,
  rows: number,
  back?: [string, string],
): string {
  const gap = 12
  const width = cols * CARD_W + (cols - 1) * gap + (back ? 40 : 0)
  const at = (id: string) => {
    const n = nodes.find((x) => x.id === id)!
    return { x: n.col * (CARD_W + gap), y: n.row * ROW }
  }
  const paths = edges
    .map(([f, t, o]) => {
      const a = at(f)
      const b = at(t)
      const x1 = a.x + CARD_W / 2
      const y1 = a.y + CARD_H
      const x2 = b.x + CARD_W / 2
      const y2 = b.y
      const m = (y1 + y2) / 2
      return `<path class="${o?.dash ? 'dash ' : ''}${o?.cls ?? ''}" d="M${x1} ${y1} C${x1} ${m} ${x2} ${m} ${x2} ${y2}"/>`
    })
    .join('')
  let loop = ''
  if (back) {
    const a = at(back[0])
    const b = at(back[1])
    const xr = width - 12
    const y1 = a.y + CARD_H / 2
    const y2 = b.y + CARD_H / 2
    const x1 = a.x + CARD_W
    const x2 = b.x + CARD_W
    loop = `<path d="M${x1} ${y1} H${xr - 10} Q${xr} ${y1} ${xr} ${y1 - 10} V${y2 + 10} Q${xr} ${y2} ${xr - 10} ${y2} H${x2 + 7}"/><path class="head" d="M${x2} ${y2} l8 -4.5 v9 z"/>`
  }
  const labels = edges
    .filter(([, , o]) => o?.label)
    .map(([f, t, o]) => {
      const a = at(f)
      const b = at(t)
      return `<span class="glabel ${o?.cls === 'on' ? 'on' : ''}" style="left:${(a.x + b.x) / 2 + CARD_W / 2}px;top:${(a.y + CARD_H + b.y) / 2}px">${o!.label}</span>`
    })
    .join('')
  return `<div class="gwrap" style="width:${width}px;height:${(rows - 1) * ROW + CARD_H}px"><svg>${paths}${loop}</svg>${nodes
    .map((n) => {
      const p = at(n.id)
      return gcard(n, p.x, p.y)
    })
    .join('')}${labels}</div>`
}

const legend = (view: 'Graph' | 'Table') =>
  `<div class="gbar"><span class="leg"><svg width="22" height="6"><path d="M0 3h22" stroke="var(--text-3)" stroke-width="1.5" fill="none"/></svg>Owns</span><span class="leg"><svg width="22" height="6"><path d="M0 3h22" stroke="var(--text-3)" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/></svg>Uses</span><span class="end gseg"><span class="${view === 'Graph' ? 'on' : ''}">Graph</span><span class="${view === 'Table' ? 'on' : ''}">Table</span></span></div>`

const APP_NODES: GNode[] = [
  {
    id: 'app',
    glyph: 'git-branch',
    kind: 'Application',
    meta: '4f1c9aa',
    name: 'shop',
    status: ['critical', 'Degraded'],
    col: 1,
    row: 0,
    cls: 'dim',
  },
  {
    id: 'd1',
    glyph: 'layers',
    kind: 'Deployment',
    name: 'storefront',
    status: ['healthy', 'Healthy'],
    col: 0,
    row: 1,
    cls: 'dim',
  },
  {
    id: 'd2',
    glyph: 'layers',
    kind: 'Deployment',
    name: 'cart',
    status: ['critical', 'Degraded'],
    col: 1,
    row: 1,
    cls: 'lit',
  },
  {
    id: 'svc',
    glyph: 'server',
    kind: 'Service',
    name: 'storefront',
    status: ['healthy', 'Healthy'],
    col: 2,
    row: 1,
    cls: 'dim',
  },
  {
    id: 'ing',
    glyph: 'box',
    kind: 'Ingress',
    name: 'shop',
    status: ['healthy', 'Healthy'],
    col: 3,
    row: 1,
    cls: 'dim',
  },
  {
    id: 'p1',
    glyph: 'box',
    kind: 'Pod',
    name: 'storefront-7d9f6c5b8-x2kqp',
    status: ['healthy', 'Running'],
    col: 0,
    row: 2,
    cls: 'dim',
  },
  {
    id: 'p2',
    glyph: 'box',
    kind: 'Pod',
    name: 'cart-6c9d7f5b44-8xk2p',
    status: ['healthy', 'Running'],
    col: 1,
    row: 2,
    cls: 'dim',
  },
  {
    id: 'p3',
    glyph: 'box',
    kind: 'Pod',
    name: 'cart-6c9d7f5b44-w4nq7',
    status: ['critical', 'CrashLoopBackOff'],
    col: 2,
    row: 2,
    cls: 'lit focus',
  },
  {
    id: 'cm',
    glyph: 'file-text',
    kind: 'ConfigMap',
    name: 'cart-config',
    col: 3,
    row: 2,
    cls: 'dim',
  },
]

const APP_EDGES: GEdge[] = [
  ['app', 'd1', { cls: 'dim' }],
  ['app', 'd2', { cls: 'dim' }],
  ['app', 'svc', { cls: 'dim' }],
  ['app', 'ing', { cls: 'dim' }],
  ['d1', 'p1', { cls: 'dim' }],
  ['d2', 'p2', { cls: 'dim' }],
  ['d2', 'p3', { cls: 'on' }],
  ['d2', 'cm', { dash: true, cls: 'dim', label: 'mounts' }],
  ['d1', 'cm', { dash: true, cls: 'dim' }],
]

/** 1. The graph: the map's card and lines, a selected card, the switch. */
function graphWhole(): string {
  return spec(
    'The graph',
    'the app’s object map, grown',
    card('Resources', '9', `${legend('Graph')}${graph(APP_NODES, APP_EDGES, 4, 3)}`),
    '<b>The card is the Map tab’s card as it is</b>: 56 px high and 210 to 252 wide; a kind’s icon in a 28 px tile; on its first line the kind, a quiet word after it, and at the right a Status as a dot with its word (quiet for healthy and neutral, in the level’s color for anything else); under it the name. Nothing else goes in a card. One thing changes: <b>a name too long takes the middle cut</b>, last six kept, where the map cuts its end today. <b>A line</b> is solid or dashed, and the plugin says what each means in the legend’s two words; it may carry <b>a label</b> of at most 16 characters, set on the line where it’s halfway. Lines carry no arrowheads: what leads to a card is above it. <b>Under the pointer or with the focus</b>, as on the map: that card’s own lines turn blue and 2 px, the cards at their other ends stay as they are, and everything else fades (cards to 35%, lines to 20%). Here Pod cart-…w4nq7 has the keyboard’s focus, so it has the ring, its one line is blue, and Deployment cart is the one card left unfaded. A card that names an object Lumovi gave the plugin <b>opens it</b>; another opens nothing and isn’t a button.',
  )
}

/** 2. The hard cases: a loop, five parents, more than fit, the longest name and label. */
function graphHard(): string {
  const loopNodes: GNode[] = [
    {
      id: 'a',
      glyph: 'play',
      kind: 'Step',
      meta: '1 of 4',
      name: 'checkout',
      status: ['healthy', 'Succeeded'],
      col: 0,
      row: 0,
    },
    {
      id: 'b',
      glyph: 'play',
      kind: 'Step',
      meta: '2 of 4',
      name: 'build-and-push-the-image-for-every-architecture',
      status: ['healthy', 'Succeeded'],
      col: 0,
      row: 1,
    },
    {
      id: 'c',
      glyph: 'play',
      kind: 'Step',
      meta: '3 of 4',
      name: 'integration-tests',
      status: ['critical', 'Failed'],
      col: 0,
      row: 2,
    },
    {
      id: 'd',
      glyph: 'play',
      kind: 'Step',
      meta: '4 of 4',
      name: 'deploy',
      status: ['neutral', 'Skipped'],
      col: 0,
      row: 3,
    },
  ]
  const fan: GNode[] = [
    ...['gateway', 'storefront', 'cart', 'checkout', 'reports'].map((n, i) => ({
      id: `s${i}`,
      glyph: 'server' as const,
      kind: 'Service',
      name: n,
      status: ['healthy', 'Healthy'] as [Level, string],
      col: i,
      row: 0,
    })),
    {
      id: 'db',
      glyph: 'database',
      kind: 'Cluster',
      meta: '17 pods',
      name: 'orders-db',
      status: ['warning', 'Not all ready'],
      col: 2,
      row: 1,
    },
    {
      id: 'i1',
      glyph: 'box',
      kind: 'Pod',
      name: 'orders-db-1',
      status: ['healthy', 'Running'],
      col: 0,
      row: 2,
    },
    {
      id: 'i2',
      glyph: 'box',
      kind: 'Pod',
      name: 'orders-db-2',
      status: ['healthy', 'Running'],
      col: 1,
      row: 2,
    },
    {
      id: 'i3',
      glyph: 'box',
      kind: 'Pod',
      name: 'orders-db-3',
      status: ['critical', 'CrashLoopBackOff'],
      col: 2,
      row: 2,
    },
    { id: 'm', glyph: 'plus', kind: '', name: '', col: 3, row: 2, more: 14 },
  ]
  const fanEdges: GEdge[] = [
    ...[0, 1, 2, 3, 4].map(
      (i) =>
        [
          `s${i}`,
          'db',
          { dash: true, cls: 'warnl', label: i === 0 ? 'reads and writes' : undefined },
        ] as GEdge,
    ),
    ['db', 'i1'],
    ['db', 'i2'],
    ['db', 'i3', { cls: 'bad' }],
    ['db', 'm'],
  ]
  return spec(
    'A loop, five parents, more than fit',
    'what breaks a picture first',
    `<div class="arr-stack" style="align-items:flex-start">
      ${card(
        'Steps',
        '4',
        graph(
          loopNodes,
          [
            ['a', 'b'],
            ['b', 'c'],
            ['c', 'd'],
          ],
          1,
          4,
          ['c', 'b'],
        ),
      )}
      ${card('What uses orders-db', '23', graph(fan, fanEdges, 5, 3))}
    </div>`,
    '<b>A loop</b> is broken where it turns back: that one line runs up the card’s right side and ends in an arrowhead, the only place a head is drawn, since there the position can’t say the direction (first: a failed test sends the workflow back to the build). <b>A card with many parents</b> gets a line from each, and a label that’s the same on all of them is set once, on the first. A line to a card that’s a warning or worse takes that level’s color, as on the map (all five into orders-db; the one to its failing pod). A Status’s word and its level are the plugin’s to give, one level to a word. <b>A row with more cards than fit</b> ends in “14 more”, which opens that row whole in place, as the map’s does. The longest name takes the middle cut (second step). A label longer than 16 characters is cut at its end; the whole label is said to a screen reader.',
  )
}

/** 3. The same data as a table, the switch, and the ceiling. */
function graphTable(): string {
  const cols = 'minmax(0,1.4fr) minmax(0,1fr) 144px'
  const R = (
    l: Lead,
    a: string,
    st: string,
    o: { twist?: 'open' | 'closed'; cls?: string } = {},
  ) => ({
    cells: [lead(l, { twist: o.twist }), `<span class="q">${a}</span>`, `<span>${st}</span>`],
    cls: o.cls,
  })
  const again = (name: string, under: string) => ({
    cells: [
      `<span class="lead"><span class="nodot"></span><span class="w"><span class="nm"><b style="font-weight:400;color:var(--text-2)">${name}</b></span><small>ConfigMap</small></span></span>`,
      `<span class="again" style="grid-column:2 / 4">${icon('corner-down-left', 14)}Listed again; first under <b>${under}</b></span>`,
    ],
    cls: 'child',
  })
  return spec(
    'The same data as a table, and the ceiling',
    'for a phone, for the keyboard, for too many',
    `<div style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;align-items:start">
      ${card(
        'Resources',
        '9',
        `${legend('Table')}${table(
          cols,
          [head('Name'), head('Sync'), head('Health')],
          [
            R(
              { level: 'critical', name: 'shop', under: 'Application' },
              '4f1c9aa',
              pill('critical', 'Degraded'),
              { twist: 'open' },
            ),
            R(
              { level: 'critical', name: 'cart', under: 'Deployment' },
              'Out of sync',
              pill('critical', 'Degraded'),
              { twist: 'open', cls: 'child' },
            ),
            {
              ...R(
                { level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' },
                '',
                pill('critical', 'CrashLoopBackOff'),
              ),
              cls: 'child2',
            },
            {
              ...R(
                { level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' },
                '',
                pill('healthy', 'Running'),
              ),
              cls: 'child2',
            },
            { ...R({ name: 'cart-config', under: 'ConfigMap · mounts' }, '', ''), cls: 'child2' },
            R(
              { level: 'healthy', name: 'storefront', under: 'Deployment' },
              'Synced',
              pill('healthy', 'Healthy'),
              { twist: 'open', cls: 'child' },
            ),
            {
              ...R(
                { level: 'healthy', name: 'storefront-7d9f6c5b8-x2kqp', under: 'Pod' },
                '',
                pill('healthy', 'Running'),
              ),
              cls: 'child2',
            },
            { ...again('cart-config', 'cart'), cls: 'child2' },
            R(
              { level: 'healthy', name: 'storefront', under: 'Service' },
              'Synced',
              pill('healthy', 'Healthy'),
              { cls: 'child' },
            ),
            R(
              { level: 'healthy', name: 'shop', under: 'Ingress' },
              'Synced',
              pill('healthy', 'Healthy'),
              { cls: 'child' },
            ),
          ],
        )}`,
      )}
      ${card('Resources', '412', `<div class="gbar"><span class="end gseg"><span style="opacity:.45">Graph</span><span class="on">Table</span></span></div><div class="said">${icon('info', 16)}<span>412 are too many to draw as a graph (300 at most), so they’re listed. Filter the list to see fewer.</span></div><div class="stub">the same Table, 412 rows, only those in view drawn</div>`)}
    </div>`,
    '<b>The table is derived by the part</b>, never described twice by the plugin: the cards nothing leads to come first, each card’s rows are the cards its lines lead to, in the picture’s order, worst first among equals. It is the kit’s own Table whose rows nest, so its keys, its sorting and its phone form are Table’s. In the table rows nest as deep as the lines go, set in a step at each level; this is the one place Table nests past one level. <b>A card with two parents is listed under each</b>: whole under the first, and under the others as one quiet row, “Listed again; first under cart”, whose name jumps to the first. An edge’s label joins the row’s line under (“ConfigMap · mounts”). <b>The switch</b>, Graph or Table, sits at the right of the part’s own bar, beside the legend, and is remembered for that plugin’s page. <b>The ceiling</b> is 300 cards or 600 lines: past it Graph can’t be chosen, and one line says why and how many there are.',
  )
}

/** 4. On a phone: the table; and the keys. */
function graphPhone(): string {
  const f = phoneFrame(
    'shop',
    `<div class="sec"><h3>Resources<small>9</small><span class="tapb">${icon('arrow-up-down', 16)}</span></h3>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'critical', name: 'shop', under: 'Application' })}<span class="twist">${icon('chevron-down', 16)}</span></div><dl>${fact('Sync', '4f1c9aa')}${fact('Health', 'Degraded')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'critical', name: 'cart', under: 'Deployment' })}<span class="twist">${icon('chevron-down', 16)}</span></div><dl>${fact('Sync', 'Out of sync')}${fact('Health', 'Degraded')}</dl></li>
        <li class="kid" style="padding-left:62px"><div class="top">${lead({ level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' }, { fit: 20 })}</div><dl class="one">${fact('Health', 'CrashLoopBackOff')}</dl></li>
        <li class="kid" style="padding-left:62px"><div class="top">${lead({ level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' }, { fit: 20 })}</div><dl class="one">${fact('Health', 'Running')}</dl></li>
        <li class="kid" style="padding-left:62px"><div class="top">${lead({ name: 'cart-config', under: 'ConfigMap · mounts' })}</div></li>
        <li class="kid"><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Deployment' })}<span class="twist">${icon('chevron-down', 16)}</span></div><dl>${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li class="kid" style="padding-left:62px"><div class="top">${lead({ level: 'healthy', name: 'storefront-7d9f6c5b8-x2kqp', under: 'Pod' }, { fit: 20 })}</div><dl class="one">${fact('Health', 'Running')}</dl></li>
        <li class="kid" style="padding-left:62px;min-height:44px;display:flex;align-items:center"><span class="again">${icon('corner-down-left', 14)}cart-config, listed again; first under <b>cart</b></span></li>
        <li class="kid"><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Service' })}</div><dl>${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li class="kid"><div class="top">${lead({ level: 'healthy', name: 'shop', under: 'Ingress' })}</div><dl>${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
      </ul>
    </div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone, and with the keys<i>one order for all three</i></h2><div style="display:flex;gap:32px;align-items:flex-start">${f}<div class="spec" style="max-width:420px;padding-top:8px"><p><b>Under 640 px the part is its table</b>, as Table’s cards, each level set in; there is no picture and no switch. “Listed again” is a row 44 px high that jumps to the first.</p><p><b>One order serves the phone, the keys and a screen reader</b>: the table’s. In the picture, Tab reaches the graph and then each card in that order; the arrow keys follow lines (down to the first card a line leads to, up to what leads here, left and right along a row); Enter opens a card that opens something. A screen reader hears it as the nested list, each card as “Deployment cart, Degraded, 2 of 9, leads to 3”, never as a picture.</p><p><b>When the Map tab is moved onto this part</b>, every difference from today’s pictures is counted, shown and accepted by name, as Karpenter’s rows were. Two are expected and accepted here: a long name’s middle cut, and its lines’ meaning said by this part’s legend. Anything else is looked at when it’s measured.</p></div></div></section>`
}

// ─── A plugin's page: whose it is, and stopped ─────────────────────────────────────────────

const whoseStrip = (name: string, version: string, short = false) =>
  `<div class="whose">${icon('plug', 14)}<span>${short ? `From the plugin <b>${name}</b> ${version}` : `This page is from the plugin <b>${name}</b> ${version}. Lumovi draws it from its own parts; what it shows and says is the plugin’s.`}</span><span class="btn ghost sm">What it may do${icon('arrow-right', 14)}</span></div>`

interface Stop {
  title: string
  why?: string
  said?: string
  advice?: boolean
  again?: boolean
}

const STILL =
  'The rest of Lumovi is as it was, and stopping the page changed nothing in your cluster.'
const ADVICE =
  'On a very large cluster a page can need more than a plugin is allowed. If it happens again, tell the plugin’s author.'

function stopped(name: string, s: Stop): string {
  return `<div class="stopped"><span class="tile">${icon('plug', 20)}</span><h3>${s.title}</h3>${s.why ? `<p>${s.why}</p>` : ''}${s.said ? `<div class="saidbox"><i>${name} said</i><code>${escape(s.said)}</code></div>` : ''}<p class="q">${s.again === false ? 'The rest of Lumovi is as it was.' : STILL}</p>${s.advice ? `<p class="q">${ADVICE}</p>` : ''}${s.again === false ? '' : '<span class="btn secondary sm">Open it again</span>'}</div>`
}

const pgframe = (name: string, version: string, body: string, short = false) =>
  `<div class="pgframe">${whoseStrip(name, version, short)}${body}</div>`

const LONG_PLUGIN = 'Platform Team’s Reconciliation and Settlement Workflows'
const SAID = "Uncaught TypeError: Cannot read properties of undefined (reading 'status')"

const REASONS: [string, string, string, string][] = [
  [
    'Using too much memory',
    'Lumovi stopped Karpenter’s page.',
    'It was using more memory than a plugin may.',
    'yes, with the advice',
  ],
  [
    'Using too much of the processor',
    'Lumovi stopped Karpenter’s page.',
    'Over the last half minute it used more than half of a processor core.',
    'yes, with the advice',
  ],
  ['Going silent', 'Lumovi stopped Karpenter’s page.', 'It had stopped answering.', 'yes'],
  [
    'Sending too many messages',
    'Lumovi stopped Karpenter’s page.',
    'It sent more at once than a plugin may.',
    'yes',
  ],
  [
    'Sending too much text',
    'Lumovi stopped Karpenter’s page.',
    'It sent more at once than a plugin may.',
    'yes',
  ],
  [
    'Sending something that isn’t text',
    'Lumovi stopped Karpenter’s page.',
    'It sent something a plugin can’t.',
    'yes',
  ],
  [
    'Not in a process of its own',
    'Lumovi stopped Karpenter’s page.',
    'It wasn’t running apart from the rest, as a plugin must.',
    'yes',
  ],
  [
    'Failing by itself',
    'Karpenter’s page stopped by itself.',
    'Then “Karpenter said” and its message.',
    'yes',
  ],
  [
    'A part of Lumovi’s failing as it drew the page (a requirement, not yet built)',
    'Lumovi couldn’t draw Karpenter’s page.',
    'That’s a fault in Lumovi, not in the plugin. Then “The rest of Lumovi is as it was.” and “If it happens again, tell us.”',
    'yes',
  ],
  [
    'Its place never opening',
    'Karpenter’s page couldn’t start.',
    'Lumovi couldn’t open the place a plugin’s code runs in.',
    'no',
  ],
]

const reasons = () =>
  `<div class="kcard"><h3>Every way a page ends, and what its place says</h3><div class="in"><div class="reasons"><span class="h">Why it ended</span><span class="h">The title</span><span class="h">Under it</span><span class="h">Open it again</span>${REASONS.map(([a, b, c, d]) => `<span><b>${a}</b></span><span>${b}</span><span>${c}</span><span>${d}</span>`).join('')}</div></div></div>`

/** A plugin's page stopped by Lumovi, by itself, or never started. */
function stoppedCases(): string {
  return spec(
    'A plugin’s page, stopped',
    'in the page’s own place, under the strip that says whose it is',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      ${pgframe('Karpenter', '1.0.0', stopped('Karpenter', { title: 'Lumovi stopped Karpenter’s page.', why: 'Over the last half minute it used more than half of a processor core.', advice: true }))}
      ${pgframe('Karpenter', '1.0.0', stopped('Karpenter', { title: 'Karpenter’s page stopped by itself.', said: SAID }))}
      ${pgframe(LONG_PLUGIN, '12.104.3', stopped(LONG_PLUGIN, { title: `Lumovi stopped ${LONG_PLUGIN}’ page.`, why: 'It sent something a plugin can’t.' }))}
      ${pgframe('Karpenter', '1.0.0', stopped('Karpenter', { title: 'Karpenter’s page couldn’t start.', why: 'Lumovi couldn’t open the place a plugin’s code runs in.', again: false }))}
    </div>${reasons()}`,
    `<b>The strip that says whose the page is</b> is Lumovi’s own. It must stand between the app’s header and the plugin’s page, outside the frame the plugin’s code describes, so that no plugin can draw there, cover it or scroll it away: a requirement on the app, not yet built. It names the plugin and its version. <b>“What it may do” goes to the Plugins page</b> with that plugin’s row opened, the one place where that’s said; it is not a menu and opens nothing over the page. <b>When a page stops, its place says so</b>, and the strip stays: the page’s content is gone whole, never left half drawn under a message. It is not an error of the person’s and not a crash to them, so it’s drawn calm, as the app’s own empty state is (its tile, its 14 px title, its lines no wider than 384 px, its button under them), with no red: the first sentence says who stopped it, the second why in Lumovi’s words, then that nothing else changed. For the processor and memory a line says a very large cluster can need more than a plugin is allowed. <b>“Open it again”</b> is offered wherever opening again can help; it’s always the person’s press, never Lumovi’s own retry, and a page that stops again says so again. Where the place a plugin’s code runs in never opened there’s no such button: opening again can’t help until the cause is fixed, and then reloading Lumovi does. <b>What the plugin itself said</b> when it failed is set apart in a dashed box under “Karpenter said”, as plain text in mono: its message alone, 200 characters at most, which is all Lumovi takes from a plugin that failed; every character that can’t be seen is shown as its code point in a small outlined chip (U+200B), so it can’t be taken for something the plugin wrote; its line breaks are kept up to five lines, and past that they become spaces; nothing in it is a link or is drawn as Lumovi’s. A long plugin name wraps in the sentence and the strip, and is never cut; a name ending in s takes the apostrophe alone, as in the app’s other plugin sentences.`,
  )
}

function stoppedPhone(): string {
  const f = `<div class="ph"><div class="bar"><span class="tap">${icon('menu', 20)}</span><h1>Karpenter</h1></div>${pgframe('Karpenter', '1.0.0', stopped('Karpenter', { title: 'Lumovi stopped Karpenter’s page.', why: 'It was using more memory than a plugin may.', advice: true }), true)}</div>`
  return `<section class="spec"><h2>On a phone<i>the same, with a shorter strip</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${f}</div><p style="max-width:820px">Under 640 px the strip says “From the plugin Karpenter 1.0.0”, under the top bar and above the page, and stays while the page scrolls. The stopped state is the same words; “Open it again” is 44 px high. Opening a page again changes nothing in a cluster, so a phone has it.</p></section>`
}

// ─── Frames ────────────────────────────────────────────────────────────────────────────────

export type KitFrame =
  | 'table'
  | 'table-phone'
  | 'page'
  | 'page-phone'
  | 'reference'
  | 'reference-phone'
  | 'form'
  | 'form-phone'
  | 'graph'
  | 'graph-phone'
  | 'stopped'
  | 'stopped-phone'

export const KIT_FRAMES: { id: KitFrame; title: string; size: Size }[] = [
  { id: 'table', title: 'Table, on the desktop', size: { width: 1440, height: 1560 } },
  { id: 'table-phone', title: 'Table, on a phone', size: { width: 920, height: 1040 } },
  {
    id: 'page',
    title: 'The pick list, the arrangements and the second-level header',
    size: { width: 1440, height: 1500 },
  },
  { id: 'page-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
  { id: 'reference', title: 'Parts shown by reference', size: { width: 1440, height: 1500 } },
  { id: 'reference-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
  { id: 'form', title: 'A form inside Lumovi’s confirmation', size: { width: 1440, height: 1800 } },
  { id: 'form-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
  { id: 'graph', title: 'The graph', size: { width: 1440, height: 1900 } },
  {
    id: 'graph-phone',
    title: 'The graph on a phone, and its keys',
    size: { width: 920, height: 1040 },
  },
  { id: 'stopped', title: 'A plugin’s page, stopped', size: { width: 1440, height: 1200 } },
  { id: 'stopped-phone', title: 'The same, on a phone', size: { width: 920, height: 900 } },
]

/** One of the kit's frames, in one theme. */
export function kitFrame(id: KitFrame, scheme: Scheme): string {
  const f = KIT_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'table'
      ? `<header><h1>Table</h1><p>What a plugin lists things with. It grows from the app’s plain-row table and Karpenter’s rows, which are one thing with and without headings. A plugin gives rows as data and names each column and its kind; Lumovi draws them. When the app’s own detail tables move onto it, their rows go from about 32 to 36 px and a long name takes the middle cut where today it wraps: both meant.</p></header>
        <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">${anatomy()}${sorting()}${structure()}${hard()}</div>
        ${states()}`
      : id === 'table-phone'
        ? phoneCards()
        : id === 'page'
          ? `<header><h1>A page’s frame</h1><p>How a plugin lays a page out, picks one thing from several, and names it. Drawn with CloudNativePG’s clusters; Argo CD’s applications and Karpenter’s overview are the same three arrangements.</p></header>${pageWhole()}${pickCases()}${headerCases()}`
          : id === 'page-phone'
            ? pagePhone()
            : id === 'reference'
              ? `<header><h1>Shown by reference</h1><p>Three things a plugin’s page can show without ever holding them: a Secret’s value, a pod’s logs, an object’s events. The plugin names the thing; Lumovi reads it as the person and draws it with its own parts.</p></header>${refSecret()}${refLogs()}`
              : id === 'reference-phone'
                ? refPhone()
                : id === 'form'
                  ? `<header><h1>A form inside Lumovi’s confirmation</h1><p>For a plugin’s change that asks for options first. The plugin describes the fields; Lumovi shows them in its own dialog with the change it will make.</p></header>${formStates()}${formHard()}`
                  : id === 'form-phone'
                    ? formPhone()
                    : id === 'graph'
                      ? `<header><h1>Graph</h1><p>For things that lead to other things: an application’s resources, a workflow’s steps, who talks to whom. A plugin gives cards and lines; Lumovi lays them out, and derives the table from the same data.</p></header>${graphWhole()}${graphHard()}${graphTable()}`
                      : id === 'graph-phone'
                        ? graphPhone()
                        : id === 'stopped'
                          ? `<header><h1>Whose page it is, and a page stopped</h1><p>Two things around a plugin’s page that are Lumovi’s and never the plugin’s: the strip that says the page is a plugin’s, and what stands in the page’s place when Lumovi stops it or it stops by itself.</p></header>${stoppedCases()}`
                          : stoppedPhone()
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${only(PARTS, /^(\* |svg\.i|\.btn)/)}
${only(SHELL, /^\.spill/)}
${CSS}
</style><div class="sheet">${body}</div>`
}
