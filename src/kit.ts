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

export type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

/** The lines of a shared stylesheet whose rule starts as `start` does: the app's own values. */
export const only = (css: string, start: RegExp) =>
  css
    .split('\n')
    .filter((line) => start.test(line))
    .join('\n')

export const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const CSS = `
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
.kcard > .about { max-width: none; margin: 0; padding: 0 16px 8px; font-size: 12px; line-height: 18px; color: var(--text-3); }
.kcard > .about.cut { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

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
.cards dd .mlv { display: inline-flex; align-items: center; gap: 4px; color: var(--mt); }
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
.h2why { margin: 4px 0 0; max-width: 640px; font-size: 13px; line-height: 19px; color: var(--text-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

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
.pick.under .pi { flex-wrap: wrap; row-gap: 6px; }
.pick.under .pi > .lead { flex-basis: 100%; }
.pick.under .pi > .st { margin-left: 18px; }
.bk2 { display: flex; height: 36px; align-items: center; gap: 8px; margin: -8px -8px -8px; padding: 0 8px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.bk2 svg.i { color: var(--text-3); }
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
.ph .ptiles > :last-child:nth-child(odd) { grid-column: 1 / -1; }
.finl { display: flex; justify-content: flex-end; gap: 6px; margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }
.finl svg.i { flex: none; margin-top: 1px; color: var(--text-3); }
.ph .finl { justify-content: flex-start; margin: 0; padding: 0 16px 4px; }
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
.sname { display: flex; gap: 8px; padding: 2px 0 10px; font-size: 13px; line-height: 20px; color: var(--text-1); }
.sname > svg.i { flex: none; margin-top: 3px; color: var(--text-3); }
.sname span { min-width: 0; overflow-wrap: anywhere; }
.sname b { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; font-weight: 500; }
.ib.spin { color: var(--text-3); }
.arr-stack > .cap { margin: 0 0 -4px; font-size: 12px; color: var(--text-3); }
.arr-stack > .kcard + .cap { margin-top: 8px; }
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
.cutbox { position: relative; }
.cutbox::after { content: ''; position: absolute; right: 1px; bottom: 1px; left: 1px; height: 22px; border-radius: 0 0 8px 8px; background: linear-gradient(transparent, var(--surface)); }
.cutbox .kdiff > div { padding-left: calc(12px + 6ch); text-indent: -6ch; white-space: pre-wrap; overflow: visible; overflow-wrap: anywhere; }
.cutbox.cut { max-height: calc(var(--rows) * 20px + 9px); overflow: hidden; border-radius: 8px; }
.cutbox:not(.cut)::after { content: none; }
.cutsay { margin: 6px 0 0; font-size: 12px; line-height: 17px; color: var(--text-2); }
.kcmd.fold .cl > span { display: inline-flex; align-items: center; gap: 4px; }
.kcmd.two code { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; white-space: pre-wrap; }
.notyet { padding: 14px 12px; border: 1px dashed var(--line-strong); border-radius: 8px; font-size: 13px; color: var(--text-3); }
.verdict { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.verdict > svg.i { flex: none; margin-top: 2px; }
.verdict.ok > svg.i { color: var(--good); }
.verdict.no { color: var(--critical-text); }
.moved { display: flex; gap: 8px; margin: 0 0 12px; padding: 10px 12px; border-radius: 8px; background: color-mix(in srgb, var(--warn) 12%, transparent); font-size: 12.5px; line-height: 18px; color: var(--warn-text); }
.moved > svg.i { flex: none; margin-top: 2px; }
.takes { display: flex; gap: 8px; margin-top: 10px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.takes > svg.i { flex: none; margin-top: 2px; color: var(--text-3); }
.takes code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.kdlg .typed label { display: block; margin: 12px 0 6px; font-size: 12px; color: var(--text-2); }
.kdlg .typed label code { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-1); }
.kdlg .typed label .tl { display: inline-flex; align-items: center; gap: 6px; }
.kdlg .typed label svg.i { flex: none; color: var(--critical-text); }
.kdlg .typed .f { height: 34px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface); }
.btn.danger { border-color: var(--critical); background: var(--critical); color: #fff; }
.over { position: relative; height: 1180px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--app-bg); }
.ohdr { display: flex; height: 52px; align-items: center; gap: 10px; padding: 0 16px; border-bottom: 1px solid var(--line); background: var(--surface); font-size: 14px; }
.ohdr .lg { width: 20px; height: 20px; border-radius: 6px; background: var(--surface-3); }
.ohdr .grow { flex: 1; }
.ostrip { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); font-size: 12px; color: var(--text-2); }
.obody { padding: 16px; }
.oscrim { position: absolute; inset: 0; background: rgb(0 0 0 / 0.4); }
.odlg { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); }
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
.gcard.ctx { border-style: dashed; box-shadow: none; }
.gcard.ctx .gi { opacity: 0.55; }
.gcard.ctx .m { opacity: 0.7; }
.fl { position: absolute; width: 1.5px; background: var(--text-3); }
.fl.h { width: auto; height: 1.5px; }
.gcard .g2 { display: block; overflow: hidden; font-size: 13px; line-height: 20px; font-weight: 500; white-space: nowrap; }
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
.fbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 4px 20px 12px; }
.fchip { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 4px 0 10px; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); font-size: 12px; color: var(--text-2); }
.fchip b { font-weight: 500; color: var(--text-1); }
.fchip .x { display: grid; width: 22px; height: 22px; place-items: center; border-radius: 6px; color: var(--text-3); }
.go2 { display: grid; place-items: center; color: var(--text-3); }
.kmore { padding: 10px 0 4px; font-size: 12.5px; font-weight: 500; color: var(--accent); }
.grp-h { display: flex; align-items: baseline; gap: 8px; padding: 14px 0 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.grp-h small { font-size: 11px; letter-spacing: 0; }
.t .q { color: var(--text-2); }
.t .r { text-align: right; font-variant-numeric: tabular-nums; }
.pagebox .pgframe { border: 0; box-shadow: none; }
.pair { display: grid; gap: 16px; align-items: start; }
.pair.wider { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
.counts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; padding: 4px 0 4px; }
.pair .counts { grid-template-columns: minmax(0, 1fr); gap: 14px; }
.counts.one { grid-template-columns: minmax(0, 1fr); gap: 14px; }
.cg h4 { margin: 0 0 6px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.crow { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(40px, 1fr) 28px; gap: 10px; align-items: center; min-height: 26px; font-size: 12.5px; }
.crow .cv { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text-1); }
.crow .cv.mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.crow .cb { height: 6px; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--series-1) 18%, transparent); }
.crow .cb i { display: block; height: 100%; border-radius: inherit; background: var(--series-1); }
.crow .cn { text-align: right; font-variant-numeric: tabular-nums; color: var(--text-2); }
.cmore { display: flex; align-items: center; gap: 6px; min-height: 26px; font-size: 12px; color: var(--text-3); }
.ph .crow { min-height: 32px; }
.ph .cmore { min-height: 44px; }
.mk { display: inline-block; margin: 0 1px; padding: 0 2px; border: 1px solid var(--line); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.92em; font-weight: 400; line-height: 1.25; text-transform: none; letter-spacing: 0; color: var(--text-3); }
.t .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.pwin { display: flex; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pside { width: 240px; flex: none; padding: 8px 10px 16px; border-right: 1px solid var(--line); background: var(--app-bg); }
.pside h3, .drawer h3 { margin: 14px 0 4px; padding: 0 10px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.sn { display: flex; height: 32px; min-width: 0; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-1); }
.sn > svg.i { flex: none; color: var(--text-3); }
.sn > span { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.sn.on { background: var(--surface-3); font-weight: 500; }
.pmain { min-width: 0; flex: 1; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pwin .pmain { border: 0; border-radius: 0; box-shadow: none; }
.pwin .pgframe, .pmain .pgframe { border: 0; border-radius: 0; box-shadow: none; }
.phd { display: flex; height: 48px; align-items: center; gap: 8px; padding: 0 20px; font-size: 15px; }
.phd > svg.i { color: var(--text-3); }
.phd b { font-weight: 600; }
.lts { display: flex; gap: 4px; overflow: hidden; padding: 0 20px 1px; box-shadow: inset 0 -1px 0 var(--line); }
.lt { position: relative; display: flex; height: 36px; flex: none; align-items: center; gap: 6px; padding: 0 10px; border-radius: 6px; font-size: 13px; font-weight: 500; white-space: nowrap; color: var(--text-3); }
.lt small { font-size: 12px; font-weight: 400; color: var(--text-3); font-variant-numeric: tabular-nums; }
.lt.on { color: var(--text-1); }
.lt.on::after { content: ''; position: absolute; right: 8px; bottom: -1px; left: 8px; height: 2px; border-radius: 999px; background: var(--accent); }
.lt.hov { color: var(--text-1); }
.ttw { position: relative; display: flex; }
.tt { position: absolute; top: 40px; left: 0; z-index: 2; padding: 4px 8px; border-radius: 6px; background: var(--text-1); font-size: 12px; line-height: 18px; white-space: nowrap; color: var(--surface); }
.dpanel { max-width: 560px; overflow: hidden; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.dpanel .pgframe { border: 0; border-radius: 0; box-shadow: none; }
.dhd { display: flex; align-items: center; gap: 12px; padding: 14px 20px 10px; }
.dhd > div { display: flex; min-width: 0; flex: 1; flex-direction: column; }
.dhd b { font-size: 15px; font-weight: 600; }
.dhd small { font-size: 12px; color: var(--text-3); }
.pal { overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-panel); }
.pin { display: flex; height: 48px; align-items: center; padding: 0 16px; border-bottom: 1px solid var(--line); font-size: 15px; color: var(--text-1); }
.pin .ph2 { color: var(--text-3); }
.pl { padding: 8px; }
.pl h4 { margin: 0; padding: 8px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.pr { display: flex; height: 36px; min-width: 0; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; color: var(--text-1); }
.pr > svg.i { flex: none; margin-right: 2px; color: var(--text-3); }
.pr .t { flex: none; white-space: nowrap; }
.pr .h { min-width: 0; max-width: 200px; margin-left: auto; overflow: hidden; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-3); }
.pr.on { background: var(--surface-3); }
.phones { display: flex; gap: 24px; align-items: flex-start; }
.ph .lts { padding: 0 8px 1px; }
.ph .lt { height: 44px; }
.ph .pgframe { border: 0; border-radius: 0; box-shadow: none; }
.drawer { padding: 0 8px 12px; }
.drawer .sn { height: 44px; }
.ph3 { justify-content: space-between; height: 52px; padding: 0 4px 0 16px; }
.ph3 .tap { display: grid; width: 44px; height: 44px; place-items: center; color: var(--text-2); }
.ph .pl .pr { height: 44px; }
.arr-stack > .cap:first-child { margin-top: 0; }

`

export const LEVEL: Record<Level, string> = {
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
export function lead(l: Lead, o: { fit?: number; twist?: 'open' | 'closed' } = {}): string {
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
export function cut(name: string, fit: number): string {
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

export function table(cols: string, heads: string[] | null, rows: (Row | string)[]): string {
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

export const head = (
  text: string,
  o: { r?: boolean; sorted?: 'up' | 'down'; can?: boolean } = {},
) =>
  `<span class="${[o.r ? 'r' : '', o.sorted ? 'sorted' : '', o.can ? 'can' : ''].join(' ')}">${text}${o.sorted ? icon(o.sorted === 'up' ? 'arrow-up' : 'arrow-down', 12) : ''}</span>`

export const card = (title: string, note: string, body: string) =>
  `<div class="kcard"><h3>${title}${note ? `<small>${note}</small>` : ''}</h3><div class="in">${body}</div></div>`

export const spec = (title: string, sub: string, body: string, rule: string) =>
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
    'A row starts with its <b>lead</b>: a dot in a status’s level (or none, and the name keeps its place), a name, optionally a quiet word beside it and one line under. After it come columns from <b>one scale</b>: narrow (88 px), normal (a share), wide (1.4 shares), a Status’s own 144 px, or as wide as its text, which is the widest value in that column, measured from the rows’ data and not from the rows drawn, so every row agrees and nothing shifts as a long table scrolls; <b>16 px between columns</b>, always. A plugin picks from the scale and never gives a width. Numbers and ages stand right and use tabular figures. A row with one line is 36 px, with a line under 52; a one-line row that holds a meter is 40, since the app’s meter is its words over its bar and isn’t squeezed.',
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
    'A plugin <b>names every column, always</b> (a phone labels its facts with the names, a screen reader says them) and says separately whether headings show; a table without them is a list of rows, as Karpenter’s cards are. A column sorts if the plugin says it can: its heading is then a button, the sorted one in the stronger color with an arrow, and <b>a Status sorts worst first</b> by level, not by its word: that is its first sort, and its arrow points down, the arrows meaning what they mean in the app’s own lists. A row that <b>opens something</b> is one target, edge to edge: a fill under the pointer (second row), the focus ring from the keyboard (third), and no chevron. <b>Keys</b>, as Lumovi’s own lists: the table is one stop for Tab, however many rows it has, and keeps the focus while an active row moves inside it: up and down (or k and j), Home and End for the first and last row, Page Up and Page Down by ten. Enter opens the active row; Space isn’t a row’s key (a long list scrolls by a screen, as any scrolling box does). The headings that sort are stops after the rows, as in the app’s lists, each a button for Enter or Space; a screen reader still reads headings first. Nothing here picks rows.',
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
            '—',
            pill('healthy', 'Running'),
            { cls: 'child' },
          ),
          R(
            { level: 'critical', name: 'cart-6c9d7f5b44-w4nq7', under: 'Pod' },
            '—',
            pill('critical', 'CrashLoopBackOff'),
            { cls: 'child' },
          ),
          '<h4>Network <small>20</small></h4>',
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
    '<b>Groups</b> are the table’s own: a heading in small capitals with its count, never one a plugin places by hand. <b>A row may hold rows</b>, one level (the Graph’s own table is the one exception: it nests as deep as its lines go): a chevron before the dot opens it, its rows stand set in under its name and are rows like any other. A plugin says how many rows show first; the rest are behind <b>“Show all 23”</b>, which opens them in place. A group’s heading counts all of that group’s rows, shown or not (3 and 20 here, 23 in all, of which 5 show), and the counts are of rows at the top level, never of the rows inside them. A cell with nothing in it shows a dash where its column’s values stand, never a blank; on a phone a stacked fact with nothing is left out, and facts side by side keep their place with a dash. Past a few hundred the table draws only the rows in view, so 2,500 feel like 25. <b>Keys:</b> right opens the active row if it holds rows, left closes it, and on any other row they do nothing (the kit’s Table is never paged, so they turn no page); a group’s heading is not a stop; “Show all 23” is a button after the rows.',
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

export const fact = (label: string, value: string) =>
  `<div><dt>${label}</dt><dd>${value}</dd></div>`

export function phoneFrame(title: string, body: string, back = false): string {
  return `<div class="ph"><div class="bar"><span class="tap">${icon(back ? 'arrow-left' : 'menu', 20)}</span><h1>${title}</h1></div>${body}</div>`
}

/** 6. On a phone a row is a card: the lead, then its other columns as labelled facts. */
function phoneCards(): string {
  const a = phoneFrame(
    'Karpenter',
    `<div class="sec"><h3>Node pools<small>3</small></h3><ul class="cards">
      <li><div class="top">${lead({ level: 'healthy', name: 'general', under: 'On demand and spot · amd64' })}</div><dl>${fact('Nodes', '7')}${fact('CPU', '24 of 64')}${fact('Status', 'Ready')}</dl></li>
      <li class="press"><div class="top">${lead({ level: 'warning', name: 'batch', under: 'Spot only · arm64' })}</div><dl>${fact('Nodes', '12')}${fact('CPU', `<span class="mlv" style="--mt:var(--warn-text)">${icon('triangle-alert', 12)}105 of 128</span>`)}${fact('Status', 'Near its limit')}</dl></li>
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
      <h4>Network <small>20</small></h4>
      <ul class="cards">
        <li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Service' })}</div><dl class="one">${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li>
        <li><div class="top">${lead({ level: 'neutral', name: 'shop-old', under: 'Ingress' })}</div><dl class="one">${fact('Sync', 'Not in the repository')}${fact('Health', 'Unknown')}</dl></li>
      </ul>
      <div class="pmore">Show all 23</div>
    </div>`,
  )
  return `<section class="spec"><h2>On a phone<i>a row is a card</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${a}${b}</div><p style="max-width:820px">Under 640 px <b>a row is a card</b>, by the phone layout’s own rule: its lead first, as on the desktop, then its other columns as labelled facts. Facts stand side by side <b>only when every value in the table fits a third</b> on one line; otherwise each takes a line, in every card of that table, its groups included, so a table’s cards all read the same way (right: “Not in the repository” doesn’t fit, so all of Resources stacks; left: Node pools’ values all fit). The facts’ labels are the columns’ names, which is why a plugin names every column even where no headings show. A meter becomes its words; a Status keeps its word and the lead’s dot keeps its level. A note stands under the lead, three lines at most. A row that opens is the whole card (second card, pressed). A row that holds rows has a 44 px chevron at its right; its rows are cards set in beneath it, closed until asked. A group’s heading stands above its cards. <b>Sorting</b> is the phone’s Sort sheet, from the button in the table’s heading, listing the columns that sort. <b>A meter</b> is its text as a fact; at its warning or critical line it carries that level’s status icon before the value, in the level’s text colour, as a status does (never colour alone), so a phone never hides a reading the desktop shows in amber or red; below the line, plain text.</p></section>`
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
export function tile(
  glyph: Parameters<typeof icon>[0],
  label: string,
  value: string,
  sub: string,
  o: TileOptions = {},
): string {
  const dot = o.level ? `<span class="dot" style="--m:var(--${LEVEL[o.level]})"></span>` : ''
  return `<div class="ktile${o.hover ? ' hover' : ''}"><div class="l">${icon(glyph, 16)}<span>${label}</span>${o.opens ? `<span class="go">${icon('chevron-right', 16)}</span>` : ''}</div><div class="v${o.words ? ' words' : ''}">${value}</div><div class="s">${dot}<span>${sub}</span></div></div>`
}

export const btn = (label: string, kind: 'primary' | 'secondary' | 'ghost') =>
  `<span class="btn ${kind} sm">${label}</span>`

const MORE = `<span class="btn secondary sm" style="width:28px;padding:0">${icon('ellipsis', 14)}</span>`

export function header2(
  name: string,
  status: [Level, string],
  buttons: string,
  fit?: number,
): string {
  const shown = fit && name.length > fit ? cut(name, fit) : escape(name)
  return `<div class="h2nd"><b>${shown}</b><span class="st">${pill(status[0], status[1])}</span><span class="acts">${buttons}</span></div>`
}

const ACTS = `${btn('Restart…', 'ghost')}${btn('Switch over…', 'secondary')}${btn('Back up now…', 'primary')}`

const TILES = (hover = false) =>
  `${tile('server', 'Instances ready', '2/3', '1 not ready', { level: 'warning', opens: true, hover })}${tile('database', 'Primary', 'orders-db-1', 'since 12 days ago', { words: true, opens: true })}${tile('timer', 'Last backup', '3h', 'Completed', { level: 'healthy', opens: true })}${tile('layers', 'PostgreSQL', '17.2', '20Gi for each instance')}`

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
    'A pick list’s row <b>is Table’s lead</b> with a Status at its right, 52 px high, so the two parts share one row; its card says what’s listed and how many. <b>One row is always picked</b>: the first when the page opens, and the list is sorted worst first unless the plugin says otherwise, so the first is the one to look at. The picked row has the selection’s blue wash, and never the blue alone: the rest of the page names it in its header. Under the pointer a row has the fill; from the keyboard the ring. <b>Keys:</b> up and down move the focus, Enter or Space picks (Space is a key here and not in a Table, because picking is this list’s whole act, as in any list of choices); picking never needs the pointer. Past twelve rows it scrolls inside the side, with a filter above it, and the picked row is kept in view. <b>A long name</b> takes the middle cut; the Status is never cut. With nothing to list it shows Table’s empty state, and the rest of the page shows nothing.',
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
      <div class="arr-tiles" style="--n:4">${tile('database', 'Primary', cut('checkout-payments-reconciliation-ledger-1', 20), 'since 12 days ago', { words: true, opens: true })}${tile('timer', 'Last backup', 'Never', 'No schedule backs this cluster up', { words: true, level: 'warning' })}${tile('package', 'Storage for each instance, of what its class allows', '1.2 TiB', 'of 2 TiB')}${tile('layers', 'PostgreSQL', '17.2', '')}</div>
      <div class="arr-tiles" style="--n:3">${tile('git-branch', 'Out of sync', '2/5', '2 resources differ', { level: 'warning', opens: true })}${tile('git-branch', 'Revision', 'main at 4f1c9aa', 'platform/apps/shop', { words: true })}${tile('timer', 'Auto-sync', 'Off', 'Sync by hand', { words: true })}</div>
      <div class="arr-tiles" style="--n:2">${tile('server', 'Nodes ready', '9/9', 'All ready', { level: 'healthy', opens: true })}${tile('package', 'Waiting for a node', '2', 'the oldest for 11 minutes', { level: 'warning', opens: true })}</div>
    </div>`,
    '<b>The header</b> says what’s picked: its name at 17 px, its Status, and at most <b>three buttons</b> at the right, the one that matters most last and the only one filled. With more than three actions the filled one stays last, <b>“…” stands before it</b> and holds the rest (first header: five actions). The name stays on one line and takes the middle cut; the Status and the buttons are never cut or wrapped. A button whose change asks first ends in “…”, and the asking is Lumovi’s own dialog. <b>A tile is the app’s own</b>, the Overview’s, which Karpenter’s page uses: an icon and a label (the icon one of the names a plugin’s file may use, or none, and then the label starts at the edge), a value at 28 px, and one line under with, optionally, a level’s dot. A value that is words or a name and not a number is set at 15 px on the same 28 px line, as the Metrics page’s small tile sets one; what’s new is that a name there takes the middle cut; the label and the line under are cut at their ends; a tile without a line under keeps its height, so tiles in a row are always the same height. A tile that <b>opens a named destination</b> is a button: its border darkens and a chevron shows under the pointer (first tile above), and the chevron always shows on touch; one that opens nothing has neither.',
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
    <p class="larger">Open Lumovi on a larger screen to use <b style="font-weight:500;color:var(--text-2)">Back up now</b>, <b style="font-weight:500;color:var(--text-2)">Switch over</b> and <b style="font-weight:500;color:var(--text-2)">Restart</b>.</p>
    <div class="ptiles">${TILES()}</div>
    <div class="sec"><h3>Instances<small>3</small></h3><div class="stub" style="border:1px solid var(--line);border-radius:12px">a Table, as cards</div></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the list is the page; what’s picked is a page of its own</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${list}${one}</div><p style="max-width:820px">Under 640 px <b>a split is two pages</b>: the pick list first, full width, under a line that says how many (and, past twelve, a filter field 44 px high above it, as the phone’s lists have), its rows 60 px high as the phone’s lists are, and nothing picked (second row, pressed). Tapping one opens the rest as a page with Back, the picked thing’s name in the top bar (middle cut) and its Status on a line of its own under it. <b>A plugin’s own actions that change the cluster aren’t offered on a phone</b>: a phone changes only what Lumovi lists for it, so the header’s buttons give way to one line in Lumovi’s own words that names them as they’re written, without their “…”: “Open Lumovi on a larger screen to use Back up now.”, “… to use Back up now and Switch over.”, “… to use Back up now, Switch over and Restart.”, and past five the first four “and 3 more”. Each name is set apart by its weight, as a button’s name is anywhere in the app, and is the plugin’s text, drawn and cut like any other of its texts. The plugin writes none of the sentence. Buttons that only read or open something stay, 44 px high. <b>A row of tiles</b> is two across, then wraps, the chevron in the tile’s corner; a single tile takes the width. <b>A stack</b> is a stack. Back returns to the list where it was.</p></section>`
}

// ─── Parts shown by reference: a Secret's value, logs, events ──────────────────────────────

const PLUGIN = 'Argo CD'

const refCard = (title: string, them: 'it' | 'them', note: string, body: string) =>
  `<div class="kcard"><h3>${title}<span class="by">${them === 'them' ? `Shown by Lumovi: ${PLUGIN}’s code never sees them.` : `Shown by Lumovi. ${PLUGIN} can’t see it.`}</span>${note ? `<small>${note}</small>` : ''}</h3><div class="in">${body}</div></div>`

const ib = (glyph: Parameters<typeof icon>[0], off = false) =>
  `<span class="ib${off ? ' off' : ''}">${icon(glyph, 16)}</span>`

/** The Secret's own name and namespace, from the cluster: Lumovi's to show, whatever the plugin titled the card. */
const secretName = (phone = false) =>
  `<div class="sname${phone ? ' tap' : ''}">${icon('key-round', 14)}<span>Secret <b>repo-credentials</b> in <b>argocd</b></span></div>`

const secretCard = (note: string, body: string, named = true) =>
  refCard('Repository credentials', 'it', note, `${named ? secretName() : ''}${body}`)

/**
 * A key's box. Before a press it holds only what the plugin's file names: the key, hidden. What a
 * press came back with is drawn in the box that was pressed.
 */
function secretKey(
  key: string,
  o: {
    value?: string
    size?: string
    box?: boolean
    reading?: boolean
    quiet?: string
  } = {},
): string {
  const answered = o.quiet !== undefined
  const shown = answered
    ? `<span class="val quiet">${o.quiet}</span>`
    : o.value === undefined
      ? '<span class="val dots">••••••••</span>'
      : `<span class="val${o.box ? ' box' : ''}">${escape(o.value)}</span>`
  // A box whose press came back with no value has nothing to reveal or copy.
  const buttons = answered
    ? ''
    : `<span class="do">${o.reading ? '<span class="ib spin">' + icon('loader-circle', 16) + '</span>' : ib(o.value === undefined ? 'eye' : 'eye-off')}${ib('copy')}</span>`
  return `<div class="sk"><div class="top"><span class="k">${key}</span>${o.size ? `<small>${o.size}</small>` : ''}${buttons}</div>${shown}</div>`
}

const LONG_SECRET = Array.from({ length: 22 }, (_, i) =>
  'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ'.slice(
    i * 3,
  ),
).join('')

const said = (text: string, warn = false) =>
  `<div class="said${warn ? ' warn' : ''}">${icon(warn ? 'lock' : 'info', 16)}<span>${text}</span></div>`

/** 1. A Secret's value, shown by Lumovi and never held by the plugin: nothing is read until a press. */
function refSecret(): string {
  const revealAll = (reading = false) =>
    `<span class="btn ghost sm" style="margin:-6px -8px -6px 0">${icon(reading ? 'loader-circle' : 'eye', 14)}Reveal all</span>`
  const cap = (t: string) => `<p class="cap">${t}</p>`
  return spec(
    'A Secret’s value',
    'shown and not held, and not read until a press',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack">
        ${cap('As the page opens: nothing read')}
        ${secretCard(
          revealAll(),
          `<div class="secret">${secretKey('username')}${secretKey('password')}${secretKey('sshPrivateKey')}${secretKey('token')}${secretKey('tls.crt')}</div>`,
        )}
        ${cap('After presses: each box holds what its own press came back with')}
        ${secretCard(
          revealAll(),
          `<div class="secret">${secretKey('username', { value: 'deploy-bot', size: '10 B' })}${secretKey('password', { reading: true })}${secretKey('sshPrivateKey', { value: LONG_SECRET, size: '1.6 KB', box: true })}${secretKey('token', { quiet: 'Secret repo-credentials in argocd has no key named token.' })}${secretKey('tls.crt', { quiet: 'Value hidden by your access' })}</div>`,
        )}
      </div>
      <div class="arr-stack">
        ${cap('A press came back with no Secret to show: the boxes give way')}
        ${secretCard('', said(`Your account isn’t allowed to read this Secret. ${PLUGIN}’s page asks Lumovi to show it here.`, true))}
        ${secretCard('', said(`There’s no Secret named repo-credentials in argocd. ${PLUGIN}’s page points at it.`))}
        ${cap('Known without a read, so said as the page opens')}
        ${secretCard('', said('This server doesn’t show Secrets’ values on a plugin’s page.'))}
        ${secretCard('', said('This Certificate names no Secret.'), false)}
      </div>
    </div>`,
    `A plugin says <b>which Secret and which keys</b>. <b>Nothing is read until the person presses</b>: a page that opens doesn’t make Lumovi fetch a Secret because a plugin drew a card, so as it opens the card holds only what’s known without one: the plugin’s title, Lumovi’s caption, <b>the Secret’s own name and namespace</b> on a line of Lumovi’s under the heading, as dark as the title (a title is the plugin’s to choose; the name is the cluster’s), and a box for each key the plugin names, hidden: eight dots, Reveal and Copy, and <b>no size</b>. Reveal, Copy and Reveal all are the presses; each reads as the person, under their own rights. While a read is on its way the pressed button turns, the dots stay and the rest stays pressable. <b>A box shows what its own press came back with</b>, and Reveal all is a press on every box: the value, with its size beside the key from then on while it’s shown; or, with no buttons left, that the Secret has no such key, or that the person’s access hides the value. Hide puts a box back exactly as it was before the press, size and all, so there’s one hidden look and not two. <b>Lumovi keeps a value only while its box shows it</b>: one read brings the whole Secret, since the cluster can’t give one key, and what it brought for boxes that weren’t pressed is let go at once; Hide lets the value go, so the next Reveal is a new read. <b>Copy on a hidden box</b> is a press like the others: it reads, copies, and leaves the box hidden, and if the read comes back with no such key, a hidden value or no Secret, the box or the card says so just as for Reveal. In “has no key named token” the key’s name is the plugin’s own text inside Lumovi’s sentence, drawn as any text that isn’t Lumovi’s. If the press finds that the person may not read the Secret, or that it isn’t there, that’s the card’s to say and not one box’s: the boxes give way to the sentence, by name, and that the plugin’s page asked. Two things are known without a read and said from the start: a server whose organisation keeps Secrets off plugins’ pages (a setting the server doesn’t have yet: a requirement on the app, not built, and its sentence is new), and an object that names no Secret, which is the one card with no name line. <b>Nothing goes back to the plugin</b>: not the value, not its length, not whether it was pressed, nor what came back. A revealed value wraps whole and is never cut with “…” (a cut Secret looks whole): past 288 px (about sixteen lines) it scrolls inside its box, as on the Secret page, and Copy takes all of it. <b>It stands in a card or a tab of its own</b>, full width, never in a table’s cell or a tile.`,
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
        ${refCard('Logs', 'them', 'argocd-dex-server-5c7d8b6f9-q4lzn', `<div class="state" style="min-height:96px"><span>Not shown: a plugin’s page shows 4 logs at once. This one starts when another closes.</span></div>`)}
        ${refCard('Logs', 'them', 'argocd-redis-6d9c5b7f48-m2xkt', `<div class="state" style="min-height:96px"><span>Not shown: ${PLUGIN} shows 8 logs at once, across its pages and tabs. This one starts when another closes.</span></div>`)}
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
    `A plugin says <b>which pod</b> (and may say which container) or <b>which object</b>. Logs are the app’s own log view, with its container picker, Search and Follow, and its own words when there’s nothing. Events are <b>the detail’s Events tab as it is</b>: an icon, the reason, the message, how often and how long ago, newest first, with no count and no filter up to 200 events. Past 200 the tab draws only the rows in view and gains the lists’ own filter field above the list, with how many match beside it while something is typed; the part has whatever the tab has, and nothing of its own. The plugin never holds a line of either. Refusals and missing things are said as for a Secret. <b>A full slot</b> (docs: 4 live logs a page, 8 a plugin) is the part’s quiet place, as “nothing is running” is: its head as ever, the pod named, and one line in the quiet ink: “Not shown: a plugin’s page shows 4 logs at once. This one starts when another closes.” where the page’s 4 are full, or “Not shown: Argo CD shows 8 logs at once, across its pages and tabs. This one starts when another closes.” where the plugin’s 8 are and the page’s aren’t (where both are, the page’s line). Either has no icon, no spinner and nothing to press, since nothing’s wrong and nothing waits on the person. It keeps that place’s 96 px and starts by itself, in the order the parts were drawn, when a slot frees. On a phone both are the phone layout’s own: log lines wrap and hang, and events are its two-line rows.`,
  )
}

/** 3. On a phone. */
function refPhone(): string {
  const a = phoneFrame(
    'storefront',
    `<div class="sec"><h3>Repository credentials<span class="btn ghost sm" style="height:44px;margin:-12px -10px -12px auto">${icon('eye', 16)}Reveal all</span></h3><p class="larger" style="padding:0 0 8px">Shown by Lumovi. ${PLUGIN} can’t see it.</p>${secretName(true)}<div class="secret">${secretKey('username', { value: 'deploy-bot', size: '10 B' })}${secretKey('password')}${secretKey('token', { quiet: 'Secret repo-credentials in argocd has no key named token.' })}</div></div>
    <div class="sec"><h3>Logs</h3><p class="larger" style="padding:0 0 8px">Shown by Lumovi: ${PLUGIN}’s code never sees them.</p><div class="klog">${LOGS.slice(
      1,
      3,
    )
      .map(([c, l]) => `<div class="${c}">${escape(l!)}</div>`)
      .join('')}</div></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the same parts, a finger’s size</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${a}</div><p style="max-width:820px">The caption moves under the part’s title, since a phone’s heading has no room beside it. The Secret’s own name is on a line under it, wrapping if it’s long. A key’s box is the desktop’s, with Reveal, Copy and Reveal all at 44 px, and as on the desktop nothing is read until one of them is pressed: here the first key was revealed, the second not pressed, and the third’s press found no such key. Logs wrap and hang by two characters, as the phone’s logs do. Revealing and copying are reads by the person, so a phone has them.</p></section>`
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

export const diff = (lines: [string, string][]) =>
  `<div class="kdiff">${lines.map(([k, t]) => `<div class="${k}">${k === 'add' ? '+' : k === 'del' ? '−' : ' '} ${escape(t)}</div>`).join('')}</div>`

export const command = (text: string) =>
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
  /** A line of Lumovi's above the change: the object moved, say. */
  notice?: string
  /** Fields it takes over from another manager. */
  takes?: string
  /** Delete: Lumovi's own verb, in the danger colour, and a typed name. */
  danger?: boolean
  /** A caption over the change part. */
  sendCap?: string
  /** No fields: the plugin asked for none. */
  noFields?: boolean
}

function ask(a: Ask): string {
  return `<div class="kdlg"${a.maxHeight ? ` style="--mh:${a.maxHeight}px"` : ''}>
    <div class="dh"><span class="g">${icon('git-branch', 18)}</span><div><div class="eb">${icon('plug', 12)}From ${PLUGIN} 2.1.0</div><h3>${a.title ?? `${PLUGIN} asks to change the Application argocd/storefront`}</h3><div class="sub"><span>Application · argocd · <b>production-eu</b></span><span class="prodm">Production</span></div></div></div>
    <div class="db">
      ${a.noFields ? '' : `<div class="part opts${a.cut ? ' cut' : ''}"><div class="kcap">Options, in ${PLUGIN}’s words</div>${a.fields}</div>`}
      <div class="part send">${a.notice ? `<div class="moved">${icon('triangle-alert', 14)}<span>${a.notice}</span></div>` : ''}<div class="kcap">${a.sendCap ?? 'What Lumovi will send'}</div>${a.send}${a.takes ? `<div class="takes">${icon('info', 14)}<span>${a.takes}</span></div>` : ''}${a.fields && a.danger ? a.fields : ''}</div>
    </div>
    <div class="df"><span class="btn ghost sm">Cancel</span><span class="btn ${a.danger ? 'danger' : 'primary'} sm${a.approve === false ? ' off' : ''}">${a.verb ?? 'Sync'}</span></div>
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
    `When a plugin’s change needs options first (“Sync…”, “Back up now…”), <b>the form is inside Lumovi’s own confirmation</b>, never on the plugin’s page. <b>It is a confirmation, not an approval</b>: the person started this change a moment ago on the plugin’s page, and nobody is waiting for an answer. So it has no wait, its buttons are Cancel and the action’s own word (the one on the button that opened it: “Sync”), and Escape cancels, as in Lumovi’s own Scale and Restart. Three places say whose words are whose: the heading (“From ${PLUGIN} 2.1.0”, then Lumovi’s own title of the change, where, and the Production mark); <b>“Options, in ${PLUGIN}’s words”</b> over the fields, whose labels and hints are the plugin’s and are shown whole; and <b>“What Lumovi will send”</b> over the patch and the command, which are Lumovi’s and which no plugin writes. The change <b>follows the fields as they’re filled</b>: after every edit Lumovi asks the cluster again (“Asking the cluster…”, the button off), and only “The cluster accepts it, as the options stand.” makes the button live, so what’s sent is what the cluster was asked. A field that’s wrong or empty says so under itself in Lumovi’s words by its kind (“Fill this in.”, “A whole number from 1 to 10.”, “Choose one.”), and the change’s place says it shows once the options are filled in. What the cluster refuses is said under the field it names, or else under the change.`,
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
      <div class="spec" style="gap:10px"><p style="max-width:none"><b>The options scroll; the change stays in view.</b> When the fields are taller than the dialog allows, they scroll in their own box, fading at its edge, and “What Lumovi will send” stays above the buttons with its verdict. A person can’t confirm having read only the plugin’s words.</p><p style="max-width:none"><b>Who gets the height</b> when it doesn’t all fit, and what the change’s box must always show, is the next section.</p><p style="max-width:none"><b>The limits are the format’s:</b> five fields at most; a label of 40 characters and a hint of about two lines (160 characters is design’s number, for app to settle as the format’s), each wrapping whole and never cut. Four kinds of field: text, a whole number, a choice (two to four as a segmented control, more as a select) and a switch. <b>No kind hides what’s typed</b>, and none is labelled or drawn as a password: a plugin’s form is for options, and a field that looks like a sign-in can’t be made.</p><p style="max-width:none"><b>Keys:</b> the focus starts in the first field, Tab goes through the fields to Cancel and the action’s button, Enter in a field doesn’t confirm, Escape cancels.</p></div>
    </div>`,
    'Drawn at the dialog’s greatest height, 640 px here: the first two fields show, the rest are a scroll away, and the patch, the command and the verdict are all in view.',
  )
}

/** 2a. Who gets the height: the options first, and the change's box never loses the change. */
function formHeights(): string {
  /** The change's box: `rows` rows in view where it's cut, and Lumovi's line under it. */
  const box = (lines: [string, string][], say: string, rows?: number) =>
    `<div class="cutbox${rows ? ' cut' : ''}"${rows ? ` style="--rows:${rows}"` : ''}>${diff(lines)}</div>${say ? `<p class="cutsay">${say}</p>` : ''}`
  const cmd = (text: string, folded = false) =>
    folded
      ? `<div class="kcmd fold"><div class="cl"><span>${icon('chevron-right', 12)}Equivalent command</span>${icon('copy', 14)}</div></div>`
      : `<div class="kcmd two"><div class="cl">Equivalent command${icon('copy', 14)}</div><code>${escape(text)}</code></div>`
  const dlg2 = (o: {
    glyph: Parameters<typeof icon>[0]
    from: string
    title: string
    sub: string
    fields: string
    cut: boolean
    send: string
    verb: string
    height: number
  }) =>
    `<div class="kdlg" style="--mh:${o.height}px;height:${o.height}px"><div class="dh"><span class="g">${icon(o.glyph, 18)}</span><div><div class="eb">${icon('plug', 12)}From ${o.from}</div><h3>${o.title}</h3><div class="sub"><span>${o.sub}</span></div></div></div>
    <div class="db"><div class="part opts${o.cut ? ' cut' : ''}"><div class="kcap">Options, in ${o.from.replace(/ [0-9.]+$/, '')}’s words</div>${o.fields}</div>
    <div class="part send"><div class="kcap">What Lumovi will send</div>${o.send}${OK}</div></div>
    <div class="df"><span class="btn ghost sm">Cancel</span><span class="btn primary sm">${o.verb}</span></div></div>`
  const size = fld(
    'Size',
    kfield('5', { mono: true, width: 96 }),
    'How many copies of the widget to keep, from 1 to 10. More copies answer faster and cost more.',
  )
  const colour = fld(
    'Colour',
    kseg(['Red', 'Blue', 'Green'], 'Blue'),
    'The label its pods carry, which the dashboards group by.',
  )
  const five = `${size}${colour}${fld('Weight', kfield('20', { mono: true, width: 96 }), 'The share of traffic it takes while it’s tuned, in percent of the whole.')}${fld('Speed', kseg(['Slow', 'Steady', 'Fast'], 'Steady'), 'How quickly the change rolls out across its copies.')}${fld('Reach', kfield('eu-central-1', { mono: true, width: 260 }), 'The regions it’s tuned in, separated by commas. Empty means every region.')}`
  const URL =
    'https://dashboards.example.com/d/widgets/blue-widget?orgId=1&var-namespace=default&var-widget=blue-widget&var-colour=blue&var-region=eu-central-1&from=now-6h&to=now&refresh=30s&viewPanel=12'
  const patch: [string, string][] = [
    ['', '  tier: toys'],
    ['add', 'annotations:'],
    ['add', `  example.com/dashboard: ${URL}`],
    ['add', '  example.com/note-1: a note that says something of the widget, number 1'],
    ['add', '  example.com/note-2: a note that says something of the widget, number 2'],
    ['add', '  example.com/note-3: a note that says something of the widget, number 3'],
  ]
  const patchCmd =
    'kubectl patch widget.example.com/blue-widget --type merge -p \'{"metadata":{"annotations":{"example.com/dashboard":"https://dashboards.example.com/d/widgets/blue-widget?orgId=1&var-namespace=default…'
  const tinker = (o: {
    height: number
    fields: string
    cut: boolean
    send: string
    verb?: string
  }) =>
    dlg2({
      glyph: 'boxes',
      from: 'Tinker 1.0.0',
      title: 'Tinker asks to change the Widget default/blue-widget',
      sub: 'Widget · default · <b>demo</b>',
      verb: 'Tune',
      ...o,
    })
  const room = tinker({
    height: 804,
    fields: `${size}${colour}`,
    cut: false,
    send: `${box(patch, 'Shows 3 of 25 changed lines. Scroll to see the rest.', 10)}${cmd(patchCmd)}`,
  })
  const floor = tinker({
    height: 804,
    fields: five,
    cut: true,
    send: `${box(patch, 'Shows 1 of 25 changed lines. Scroll to see the rest.', 5)}${cmd(patchCmd)}`,
  })
  const part = tinker({
    height: 544,
    fields: five,
    cut: true,
    send: `${box(
      [
        ['', 'spec:'],
        ['del', `  dashboard: ${URL.replace('blue-widget?', 'blue-widget-old?')}`],
        ['add', `  dashboard: ${URL}`],
      ],
      'Shows part of the first of 2 changed lines. Scroll to see the rest.',
      5,
    )}${cmd('', true)}`,
  })
  const backup = dlg2({
    glyph: 'database',
    from: 'CloudNativePG 1.1.0',
    title: 'CloudNativePG asks to create a new Backup in shop',
    sub: 'Backup · shop · <b>databases</b>',
    fields: fld('Method', kseg(['Volume snapshot', 'Barman object store'], 'Volume snapshot')),
    cut: false,
    send: `${box(
      [
        ['add', 'apiVersion: postgresql.cnpg.io/v1'],
        ['add', 'kind: Backup'],
        ['add', 'metadata:'],
        ['add', '  generateName: orders-db-'],
        ['add', '  namespace: shop'],
      ],
      'Shows 4 of 9 changed lines. Scroll to see the rest.',
      5,
    )}${cmd(`kubectl create -f - -n shop --context databases <<'LUMOVI_EOF'\nthe object above, 9 lines`)}`,
    verb: 'Back up now',
    height: 544,
  })
  return spec(
    'Who gets the height',
    'a long change never squeezes the options; a long form never hides the change',
    `<div style="display:grid;grid-template-columns:repeat(2,560px);gap:28px 32px;align-items:start">
      <div class="arr-stack"><span class="cap">A window of 1440 × 900 (the dialog at most 804 px), two options: they’re whole, so the change’s box takes the rest. A long value wraps, its rows set in</span>${room}</div>
      <div class="arr-stack"><span class="cap">The same window, five options: they get the height first and scroll; the box is at its floor, three rows of the change</span>${floor}</div>
      <div class="arr-stack"><span class="cap">The smallest window, 1024 × 640 (at most 544 px): the command folds; the first changed line alone is taller than the floor</span>${part}</div>
      <div class="arr-stack"><span class="cap">A create at 1024 × 640: the whole object is the change, so it starts at its top</span>${backup}</div>
    </div>`,
    `The dialog is at most the window less 48 px above and below, and its caption, verdict and buttons are always in view. <b>The options get the height first</b>, up to their whole height, since they’re what the person fills in; then the change’s box, up to its own length; then the command’s box, from a floor of two lines. Where the options would still have less than two fields’ height (about 190 px), the command folds to its heading’s row, with its copy button and a chevron that opens it in place. Only then do the options scroll, fading at their edge, the focused field always brought into view. <b>The change’s box opens on the change</b> (docs’ must): its first line is the first line that changes, with at most one line before it for place, never a fold of unchanged lines and never the object’s top when the change is further down. <b>Its floor is three rows of the change</b>: a plugin’s long form may take the box down to them and no further (three rows a person can read: the fade that shows there’s more lies over a further row, never over these), a change shorter than the box shows whole, and unchanged folds come after it or between its parts, never counted. <b>A line wraps whole inside the box</b>: it’s never cut at the right edge and the box never scrolls sideways; it breaks as the equivalent command does, between its words but for one wider than the box, its further rows set in under its text, the − or + on its first row only, and lines of context wrap the same way. So one scroll, downwards, shows everything. <b>A cut box says so, in Lumovi’s words</b>, on a line of its own under it and outside the plugin’s part: “Shows 1 of 25 changed lines. Scroll to see the rest.” It counts whole lines: one counts as shown only when all its rows are in view, and where the first changed line alone is taller than the floor it reads “Shows part of the first of 2 changed lines. Scroll to see the rest.” <b>A create</b> is all change, so it starts at its top and says the same when cut; every line of it is a changed line, so its count is the object’s lines as Lumovi will send it. None of this adds a wait.`,
  )
}

/** 2b. Docs' cases: the object moved, a create, a delete, what it takes over, the first moment. */
function formMore(): string {
  const created = `${diff([
    ['add', 'apiVersion: postgresql.cnpg.io/v1'],
    ['add', 'kind: Backup'],
    ['add', 'metadata:'],
    ['add', '  generateName: orders-db-'],
    ['add', '  namespace: shop'],
    ['add', 'spec:'],
    ['add', '  cluster: { name: orders-db }'],
    ['add', '  method: volumeSnapshot'],
  ])}${command('kubectl create -f - -n shop --context production-eu')}${OK}`
  const create = ask({
    title: 'CloudNativePG asks to create a Backup in shop',
    fields: fld('Method', kseg(['Volume snapshot', 'Object store'], 'Volume snapshot')),
    send: created,
    sendCap: 'The whole object Lumovi will create',
    verb: 'Back up now',
  })
    .replace(new RegExp(`From ${PLUGIN} 2\\.1\\.0`), 'From the plugin CloudNativePG 0.3.0')
    .replace(`Options, in ${PLUGIN}’s words`, 'Options, in CloudNativePG’s words')
    .replace('Application · argocd ·', 'Backup · shop ·')
  const moved = ask({
    fields: SYNC_FIELDS,
    send: SYNC_SEND('main', ASKING),
    approve: false,
    notice:
      'Application storefront changed since this was shown. Here is the change again, as it stands now.',
  })
  const takes = ask({
    fields: SYNC_FIELDS,
    send: SYNC_SEND('main', OK),
    takes:
      'It takes over <code>operation</code> from <b>argocd-application-controller</b>, which set it last.',
  })
  const del = ask({
    title: `${PLUGIN} asks to delete the Application argocd/storefront`,
    fields: `<div class="typed"><label><span class="tl">${icon('triangle-alert', 12)}Type <code>storefront</code> to delete it on production</span></label><div class="f"></div></div>`,
    send: `${command('kubectl delete application storefront -n argocd --context production-eu')}<div class="verdict">${icon('info', 14)}<span>It has a finalizer: the cluster deletes it once that’s done.</span></div>`,
    sendCap: 'What Lumovi will do',
    noFields: true,
    danger: true,
    approve: false,
    verb: 'Delete',
  })
  return spec(
    'Docs’ cases',
    'Lumovi’s title, the plugin’s word on the button, and what can’t be confirmed',
    `<div style="display:grid;grid-template-columns:repeat(2,560px);gap:28px 32px;align-items:start">
      <div class="arr-stack"><span class="cap">5 · the object changed since it was shown: asked again, the button off</span>${moved}</div>
      <div class="arr-stack"><span class="cap">6 · it takes over a field another manager set</span>${takes}</div>
      <div class="arr-stack"><span class="cap">7 · a create shows the whole object, not a before→after</span>${create}</div>
      <div class="arr-stack"><span class="cap">8 · a delete: Lumovi’s “Delete”, never the plugin’s word; the typed name on production</span>${del}</div>
    </div>`,
    `<b>The title is always Lumovi’s</b> and says what will happen: “Argo CD asks to change the Application argocd/storefront”, “… to create a Backup in shop”, “… to delete …”, with “From Argo CD 2.1.0” above it. <b>The button may carry the plugin’s word</b> (“Sync”, “Back up now”) for a change, a create, a scale or a restart: the plugin’s text, one line, 24 characters at most, refused if it’s Cancel, Close, Back, No, Keep, OK, Done or Don’t. <b>A delete is always Lumovi’s “Delete”</b>, in the danger colour, with the typed name where today’s rules ask for it. <b>The button is off</b> until the cluster has answered for the values shown: while it’s asked again, after the object moved, while an option is wrong, and for a moment after the dialog opens (its first 600 ms, counted from when the window has focus and the dialog is drawn, and the dialog never opens under the pointer). <b>What it takes over</b> from another manager is said under the change. Nothing here changes on a phone, which refuses a plugin’s proposals.`,
  )
}

/** 2c. Where it stands: over Lumovi's header, the plugin's frame dimmed and inert. */
function formOver(): string {
  return spec(
    'Where it stands',
    'over Lumovi’s own header; the plugin’s page dimmed and inert',
    `<div class="over"><div class="ohdr"><span class="lg"></span><b>Argo CD</b><span class="grow"></span><span class="ib">${icon('search', 16)}</span><span class="ib">${icon('rotate-cw', 16)}</span></div><div class="ostrip">${icon('plug', 13)}This page is from the plugin <b>Argo CD</b> 2.1.0. Lumovi draws it from its own parts; what it shows and says is the plugin’s.</div><div class="obody"><div class="stub" style="height:420px">Argo CD’s page, inert</div></div><div class="oscrim"></div><div class="odlg">${ask({ fields: SYNC_FIELDS, send: SYNC_SEND('main', OK) })}</div></div>`,
    `Lumovi draws the dialog in its own page, above everything: the plugin’s frame is dimmed (Lumovi’s scrim, 40% black in light, 60% in dark) and takes no input, and the dialog starts 24 px from the window’s top, over Lumovi’s own header, where no plugin can draw, so nothing a plugin draws can sit beside it or look like part of it. It’s the one dialog in all of Lumovi: a proposal is refused while any other confirmation or approval is open, or while the window isn’t focused.`,
  )
}

/** 3. On a phone: a tall sheet, the footer pinned. */
function formPhone(): string {
  const f = phoneFrame(
    'storefront',
    `<div class="sec"><div class="said" style="padding:0">${icon('monitor', 16)}<span>This isn’t done from a phone. Open Lumovi on a larger screen to change storefront.</span></div></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>a plugin’s proposals are refused, in Lumovi’s usual words</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${f}</div><p style="max-width:820px">By Péter’s ruling on LMV-187, a phone changes only what Lumovi lists for it, so a plugin’s proposal is refused with the phone’s usual sentence, naming the action in Lumovi’s own words (change, create, delete), as the title does; no sheet in version 1. The page’s own buttons that would propose aren’t drawn on a phone in the first place (the kit’s header rule), so this is only for a proposal made some other way.</p></section>`
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

export const TEXT: Record<Level, string> = {
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
                '—',
                pill('critical', 'CrashLoopBackOff'),
              ),
              cls: 'child2',
            },
            {
              ...R(
                { level: 'healthy', name: 'cart-6c9d7f5b44-8xk2p', under: 'Pod' },
                '—',
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
                '—',
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
    '<b>Depth</b>: the indent grows 26 px a level up to 8 levels (on a phone 24 px up to 4) and no further; a row deeper than that shows its level as a quiet number in the indent’s last step, the number’s tooltip says “Level 12”, and a table whose rows nest is a treegrid whose rows carry aria-level at any depth (a flat one stays a grid). <b>The legend</b> names only the line kinds the plugin gave a word for; with no word for one, it has no item, since Lumovi can’t know what the plugin meant by it, and with none the legend isn’t drawn; a line’s ends are read from the cards it joins (focus lights them) and from the table, as lines don’t take the pointer. <b>The table is derived by the part</b>, never described twice by the plugin: the cards nothing leads to come first, each card’s rows are the cards its lines lead to, in the picture’s order, worst first among equals. It is the kit’s own Table whose rows nest, so its keys, its sorting and its phone form are Table’s. In the table rows nest as deep as the lines go, set in a step at each level; this is the one place Table nests past one level. <b>A card with two parents is listed under each</b>: whole under the first, and under the others as one quiet row, “Listed again; first under cart”, whose name jumps to the first. An edge’s label joins the row’s line under (“ConfigMap · mounts”). <b>The switch</b>, Graph or Table, sits at the right of the part’s own bar, beside the legend, and is remembered for that plugin’s page. <b>The ceiling</b> is 300 cards or 600 lines: past it Graph can’t be chosen, and one line says why and how many there are.',
  )
}

/** 3b. A graph with nothing in it, and names holding marks. */
function graphEdges(): string {
  const m = (cp: string) => `<span class="mk">${cp}</span>`
  const nm = (drawn: string) =>
    `<div class="gcard" style="position:static;width:${CARD_W}px"><span class="gi">${icon('box', 15)}</span><span class="gw"><span class="g1"><span class="m">Deployment</span></span><span class="g2">${drawn}</span></span></div>`
  return spec(
    'Nothing to draw, and names with marks',
    'three cases the picture must say plainly',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack">${card('Resources', '0', `<div class="state" style="min-height:120px"><span>Nothing to show: storefront has no resources yet.</span></div>`)}${card('Resources', '3 of 9', `<div class="gbar"><span class="kfield" style="width:220px;height:28px">${icon('search', 14)}cart<span style="margin-left:auto;display:flex">${icon('x', 14)}</span></span><span class="end gseg"><span class="on">Graph</span><span>Table</span></span></div><div style="position:relative;display:flex;flex-direction:column;gap:12px;padding:4px 0"><i class="fl" style="left:12px;top:60px;height:40px;opacity:.55"></i><i class="fl h" style="left:12px;top:99px;width:12px;opacity:.55"></i><i class="fl" style="left:36px;top:128px;height:108px"></i><i class="fl h" style="left:36px;top:167px;width:12px"></i><i class="fl h" style="left:36px;top:235px;width:12px"></i><div class="gcard ctx" style="position:static;width:${CARD_W}px"><span class="gi">${icon('git-branch', 15)}</span><span class="gw"><span class="g1"><span class="m">Application</span></span><span class="g2">shop</span></span></div><div class="gcard" style="position:static;width:${CARD_W}px;margin-left:24px"><span class="gi">${icon('box', 15)}</span><span class="gw"><span class="g1"><span class="m">Deployment</span></span><span class="g2"><b style="font-weight:700">cart</b></span></span></div><div class="gcard" style="position:static;width:${CARD_W}px;margin-left:48px"><span class="gi">${icon('box', 15)}</span><span class="gw"><span class="g1"><span class="m">Pod</span></span><span class="g2"><b style="font-weight:700">cart</b>-6c9d7f5b44-w4nq7</span></span></div><div class="gcard" style="position:static;width:${CARD_W}px;margin-left:48px"><span class="gi">${icon('box', 15)}</span><span class="gw"><span class="g1"><span class="m">Pod</span></span><span class="g2"><b style="font-weight:700">cart</b>-6c9d7f5b44-8xk2p</span></span></div></div>`)}${card('Resources', '0 of 9', `<div class="gbar"><span class="kfield" style="width:220px;height:28px">${icon('search', 14)}orders<span style="margin-left:auto;display:flex">${icon('x', 14)}</span></span><span class="end gseg"><span class="on">Graph</span><span>Table</span></span></div><div class="state" style="min-height:120px"><span>Nothing matches “orders”.</span><span class="btn secondary sm" style="margin-top:8px">Clear filter</span></div>`)}</div>
      ${card('Resources', '3', `<div style="display:flex;flex-direction:column;gap:12px;padding:8px 0">${nm(`cart${m('U+202E')}ipa`)}${nm(`pay…${m('U+3164')}${m('U+180E')}st`)}${nm(`spam${m('U+3164')}${m('U+3164')}…`)}</div>`)}
    </div>`,
    `<b>An empty graph</b> is the app’s empty state in the card’s place, with the plugin’s sentence for why if it gave one (“Nothing to show: …”), and no switch to Table, since there’s nothing to list; the card’s count says 0. <b>The filter is the part’s own</b>: Lumovi filters the cards it was given, so the count can say “3 of 9” (three cards match). Its field is the lists’ field, 28 px high, at the left of the part’s bar, the Graph | Table switch at the right; “Filter” as its placeholder and “Filter {title}” as its name for a screen reader (a plugin’s title isn’t lowercased into a sentence), × to clear, and no key of its own, since a page can hold several parts. It matches a card’s name and its kind word, and in Table its cells too. <b>A match keeps the cards above it</b>, so its place in the picture reads, and the lines between them: a kept card is <b>context</b>, its frame dashed and its icon and kind word quieter, its name at full ink, as it’s still an object that opens when pressed; its lines are at 55%, a match’s in full. Every other card goes, and the matched part of a name is in bold. Context cards aren’t counted in “3 of 9”; a screen reader hears each as “Application shop, shown for context”, kind before name as every card. The same filter holds in Graph and Table; on a phone the table has it, 44 px high, above the cards. <b>A graph filtered to nothing</b> keeps its switch, says “Nothing matches “orders”.”, the typed filter in curly quotes, with “Clear filter”, and its count reads “0 of 9”, so it’s plain there are cards behind the filter. <b>A card’s name holds marks</b> by the kit’s rule, as in Table: in place, never cut away, the cut taking letters and drawing any marks from the part it takes right after the “…”, and ending “…” after the last mark that fits on the card’s line. The card’s tooltip spells them, capped. Marks are text-coloured and never tint the card.`,
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
  return `<section class="spec"><h2>On a phone, and with the keys<i>one order for all three</i></h2><div style="display:flex;gap:32px;align-items:flex-start">${f}<div class="spec" style="max-width:420px;padding-top:8px"><p><b>Under 640 px the part is its table</b>, as Table’s cards, each level set in; there is no picture and no switch. “Listed again” is a row 44 px high that jumps to the first. Past 600 lines the same is said of them: “Their 712 links are too many to draw as a graph (600 at most), so they’re listed.”</p><p><b>One order serves the phone, the keys and a screen reader</b>: the table’s. In the picture, Tab reaches the graph and then each card in that order; the arrow keys follow lines (down to the first card a line leads to, up to what leads here, left and right along a row); Enter opens a card that opens something. A screen reader hears it as the nested list, each card as “Deployment cart, Degraded, 2 of 9, leads to 3”, never as a picture.</p><p><b>When the Map tab is moved onto this part</b>, every difference from today’s pictures is counted, shown and accepted by name, as Karpenter’s rows were. Two are expected and accepted here: a long name’s middle cut, and its lines’ meaning said by this part’s legend. Anything else is looked at when it’s measured.</p></div></div></section>`
}

// ─── A plugin's page: whose it is, and stopped ─────────────────────────────────────────────

export const whoseStrip = (name: string, version: string, short = false) =>
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

export const pgframe = (name: string, version: string, body: string, short = false) =>
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
    `<b>The strip that says whose the page is</b> is Lumovi’s own. It must stand between the app’s header and the plugin’s page, outside the frame the plugin’s code describes, so that no plugin can draw there, cover it or scroll it away: a requirement on the app, not yet built. It names the plugin and its version. <b>“What it may do” goes to the Plugins page</b> with that plugin’s row opened, the one place where that’s said; it is not a menu and opens nothing over the page. <b>When a page stops, its place says so</b>, and the strip stays: the page’s content is gone whole, never left half drawn under a message. It is not an error of the person’s and not a crash to them, so it’s drawn calm, as the app’s own empty state is (its tile, its 14 px title, its lines no wider than 384 px, its button under them), with no red: the first sentence says who stopped it, the second why in Lumovi’s words, then that nothing else changed. For the processor and memory a line says a very large cluster can need more than a plugin is allowed. <b>“Open it again”</b> is offered wherever opening again can help; it’s always the person’s press, never Lumovi’s own retry, and a page that stops again says so again. Where the place a plugin’s code runs in never opened there’s no such button: opening again can’t help until the cause is fixed, and then reloading Lumovi does. <b>What the plugin itself said</b> when it failed is set apart in a dashed box under “Karpenter said”, as plain text in mono: its message alone, 200 characters at most, which is all Lumovi takes from a plugin that failed; every character that can’t be seen is shown as its code point in a small outlined chip (U+202E), so it can’t be taken for something the plugin wrote; its line breaks are kept up to five lines, and past that they become spaces; nothing in it is a link or is drawn as Lumovi’s. A long plugin name wraps in the sentence and the strip, and is never cut; a name ending in s takes the apostrophe alone, as in the app’s other plugin sentences.`,
  )
}

function stoppedPhone(): string {
  const f = `<div class="ph"><div class="bar"><span class="tap">${icon('menu', 20)}</span><h1>Karpenter</h1></div>${pgframe('Karpenter', '1.0.0', stopped('Karpenter', { title: 'Lumovi stopped Karpenter’s page.', why: 'It was using more memory than a plugin may.', advice: true }), true)}</div>`
  return `<section class="spec"><h2>On a phone<i>the same, with a shorter strip</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${f}</div><p style="max-width:820px">Under 640 px the strip says “From the plugin Karpenter 1.0.0”, under the top bar and above the page, and stays while the page scrolls. The stopped state is the same words; “Open it again” is 44 px high. Opening a page again changes nothing in a cluster, so a phone has it.</p></section>`
}

// ─── Where a plugin adds things: its pages, a tab on its kinds' objects, palette commands ──

/** A tab of the app's strip. A tab whose body is a plugin's frame carries Lumovi's plug before its name. */
export const ltab = (
  label: string,
  o: { on?: boolean; plug?: boolean; count?: string; hover?: boolean } = {},
) =>
  `<span class="lt${o.on ? ' on' : ''}${o.hover ? ' hov' : ''}">${o.plug ? icon('plug', 14) : ''}${escape(label)}${o.count ? `<small>${o.count}</small>` : ''}</span>`

const KARPENTER_TABS = (on: string, more = false) =>
  [
    ltab('Overview', { plug: true, on: on === 'Overview' }),
    ltab('Capacity', { plug: true, on: on === 'Capacity' }),
    ltab('Disruptions', { plug: true, on: on === 'Disruptions' }),
    ...(more
      ? [
          ltab('Consolidation and disruption budgets now', { plug: true }),
          ltab('Spot interruptions', { plug: true }),
          ltab('Drift', { plug: true }),
        ]
      : []),
    ltab('NodePools', { count: '3' }),
    ltab('NodeClaims', { count: '12' }),
    ltab('EC2NodeClasses', { count: '2' }),
  ].join('')

const sideItem = (label: string, glyph: Parameters<typeof icon>[0], on = false) =>
  `<div class="sn${on ? ' on' : ''}">${icon(glyph, 16)}<span>${label}</span></div>`

const PLUGINS_SECTION = (on = 'Karpenter') =>
  `<h3>Plugins</h3>${sideItem('Argo CD', 'git-merge', on === 'Argo CD')}${sideItem('Karpenter', 'server-cog', on === 'Karpenter')}${sideItem('Platform Team’s Reconciliation and Settlement Workflows', 'boxes')}${sideItem('All plugins', 'plug')}`

const pageHead = (title: string, glyph: Parameters<typeof icon>[0]) =>
  `<div class="phd">${icon(glyph, 16)}<b>${title}</b></div>`

const frameStub = (text = 'the plugin’s frame') => `<div class="stub">${text}</div>`

/** 1. The sidebar's entry and the plugin's page with its tabs. */
function placesPage(): string {
  return spec(
    'A plugin’s page',
    'its entry under Plugins; its pages first among its tabs',
    `<div class="pwin"><aside class="pside"><h3>Storage</h3>${sideItem('Volume Claims', 'database')}${sideItem('Volumes', 'layers')}${PLUGINS_SECTION()}<h3>Custom resources</h3>${sideItem('Certificates', 'file-code-2')}</aside>
      <div class="pmain">${pageHead('Karpenter', 'server-cog')}<nav class="lts">${KARPENTER_TABS('Overview')}</nav>${pgframe('Karpenter', '1.0.0', frameStub('Karpenter’s Overview, drawn from the kit’s parts'))}</div></div>`,
    `<b>A plugin with pages always stands under Plugins</b>, never in one of Lumovi’s own sections, with the icon its file names and its name, end-cut. Its entry opens its first page and is current on any of its pages and its kinds’ lists. <b>The page’s tabs are the app’s strip</b>: the plugin’s pages first, in its order, then its kinds’ lists with their counts, as today. <b>A tab whose body is the plugin’s own frame carries Lumovi’s plug</b>, 14 px, before its name: the same plug as the strip under it that says whose the page is, and never the plugin’s icon, which the plugin chooses and so can’t tell anything apart. A kind’s list is Lumovi’s own drawing, so it has no plug. The plug is in the tab’s colour, quiet when the tab isn’t current.`,
  )
}

/** 2. The tab strip's hard cases. */
function placesTabs(): string {
  return spec(
    'The strip, the hard cases',
    'long names, many pages, one page',
    `<div class="arr-stack">
      <p class="cap">Six pages and three kinds at 1024 px, one name of 40 characters: the strip scrolls sideways, as it does today, and keeps the current tab in view</p>
      <div class="pmain" style="width:784px">${pageHead('Karpenter', 'server-cog')}<nav class="lts">${KARPENTER_TABS('Capacity', true)}</nav></div>
      <p class="cap">Under the pointer: the app’s tooltip says whose the tab is</p>
      <div class="pmain" style="width:784px;overflow:visible">${pageHead('Karpenter', 'server-cog')}<nav class="lts" style="overflow:visible">${ltab('Overview', { plug: true, on: true })}<span class="ttw">${ltab('Capacity', { plug: true, hover: true })}<span class="tt">From the plugin Karpenter 1.0.0</span></span>${ltab('Disruptions', { plug: true })}${ltab('NodePools', { count: '3' })}</nav><div style="height:36px"></div></div>
      <p class="cap">One page and no kinds of its own: no strip; the page is under the title</p>
      <div class="pmain" style="width:784px">${pageHead('Release calendar', 'clock')}${pgframe('Release calendar', '0.3.1', frameStub())}</div>
    </div>`,
    `A tab’s name is the plugin’s text, at most 40 characters, and is never cut: the strip scrolls instead, without a scrollbar, as the app’s strips do. A strip of a single tab isn’t drawn. The tooltip is the app’s, after its usual wait.`,
  )
}

export const detailHead = (name: string, kind: string) =>
  `<div class="dhd"><div><b>${name}</b><small>${kind}</small></div>${pill('healthy', 'Ready')}</div>`

/** 3. A tab on an object of the plugin's kinds. */
function placesObject(): string {
  const tabs = (on: string) =>
    [
      ltab('Overview', { on: on === 'Overview' }),
      ltab('Map'),
      ltab('Events'),
      ltab('Audit'),
      ltab('Capacity', { plug: true, on: on === 'Capacity' }),
      ltab('YAML'),
    ].join('')
  return spec(
    'A tab on an object of its kinds',
    'after Lumovi’s own tabs, before YAML',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack"><p class="cap">The object’s detail, on its own tab</p><div class="dpanel">${detailHead('general', 'NodePool')}<nav class="lts">${tabs('Overview')}</nav>${frameStub('Lumovi’s Overview of the NodePool')}</div></div>
      <div class="arr-stack"><p class="cap">The plugin’s tab: under 640 px of width the strip says it shortly</p><div class="dpanel">${detailHead('general', 'NodePool')}<nav class="lts">${tabs('Capacity')}</nav>${pgframe('Karpenter', '1.0.0', frameStub(), true)}</div></div>
    </div>`,
    `One tab a plugin a kind, after Lumovi’s own and before YAML, so YAML stays last wherever a person looks for it. It is marked as a page’s tab is, with the plug, and its body is the door’s: the strip that says whose it is, then the plugin’s frame, or the stopped place. <b>The strip is short wherever it has less than 640 px</b>, as on a phone: a detail panel is usually narrower. A tab the person left open is opened again with the object, as Lumovi’s own tabs are.`,
  )
}

const palRow = (glyph: Parameters<typeof icon>[0], text: string, hint: string, on = false) =>
  `<div class="pr${on ? ' on' : ''}">${icon(glyph, 16)}<span class="t">${escape(text)}</span><span class="h">${escape(hint)}</span></div>`

/** 4. Palette commands. */
function placesPalette(): string {
  const pal = (search: string, rows: string) =>
    `<div class="pal"><div class="pin">${search ? escape(search) : '<span class="ph2">Jump to a page, object, namespace or cluster…</span>'}</div><div class="pl">${rows}</div></div>`
  return spec(
    'Palette commands',
    'a group of their own; each only opens one of the plugin’s pages',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack"><p class="cap">“node” typed</p>${pal('node', `<h4>Go to</h4>${palRow('server', 'Nodes', 'Cluster')}${palRow('server-cog', 'NodePools', 'karpenter.sh')}${palRow('server-cog', 'NodeClaims', 'karpenter.sh')}<h4>From plugins</h4>${palRow('plug', 'Show node pools', 'Karpenter', true)}${palRow('plug', 'Nodes waiting for capacity', 'Karpenter')}`)}</div>
      <div class="arr-stack"><p class="cap">The longest: a 40-character command from a plugin with a long name</p>${pal('settle', `<h4>From plugins</h4>${palRow('plug', 'Settlement runs that failed in the last day', 'Platform Team’s Reconciliation and Settlement Workflows', true)}${palRow('plug', 'Settlement calendar', 'Platform Team’s Reconciliation and Settlement Workflows')}`)}</div>
    </div>`,
    `<b>From plugins</b> (docs to word) comes after Go to. Each row is the palette’s own with <b>Lumovi’s plug in the icon’s place</b>, as the tabs have it, and nothing a plugin chooses there: a plugin labelled “Cluster” with a command “Nodes” would otherwise read as Go to’s Nodes. Then the command’s name, and the plugin’s name at the right in the quiet colour, where Go to puts a page’s section; typing matches both. Go to’s rows are as today: Lumovi’s kinds show their key or section, a plugin’s kinds their API group. A command <b>only opens one of the plugin’s pages</b>, with nothing passed to it, so it runs nothing and changes nothing; it has no key of its own. The command’s name is never cut; the plugin’s name gives way at the end, past 200 px.`,
  )
}

const place = (glyph: Parameters<typeof icon>[0], title: string, text: string, button?: string) =>
  `<div class="stopped"><span class="tile">${icon(glyph, 20)}</span><h3>${title}</h3><p>${text}</p>${button ? `<span class="btn secondary">${button}</span>` : ''}</div>`

/** 5. The places of Lumovi's own: a plugin no longer in use, a page it doesn't have. */
function placesGone(): string {
  const gone = place(
    'plug',
    'Karpenter isn’t in use any more.',
    'Its pages, its tabs and its commands were taken away while this was open. Plugins says why.',
    'Go to Plugins',
  )
  return spec(
    'Two places of Lumovi’s',
    'a plugin that stops being in use while it’s open; an address to a page it doesn’t have',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="arr-stack"><p class="cap">No longer in use, on its page: the entry and the tabs are gone, the title stays</p><div class="pmain">${pageHead('Karpenter', 'server-cog')}<div class="pgframe" style="border:0;box-shadow:none">${gone}</div></div></div>
      <div class="arr-stack"><p class="cap">No longer in use, on its tab of an object: the tab stays while it’s the one shown</p><div class="dpanel">${detailHead('general', 'NodePool')}<nav class="lts">${ltab('Overview')}${ltab('Map')}${ltab('Events')}${ltab('Audit')}${ltab('Capacity', { plug: true, on: true })}${ltab('YAML')}</nav>${gone}</div></div>
      <div class="arr-stack"><p class="cap">An address to a page the plugin doesn’t have: its tabs, none current</p><div class="pmain">${pageHead('Karpenter', 'server-cog')}<nav class="lts">${KARPENTER_TABS('')}</nav>${place('search-x', 'Karpenter has no such page.', 'Karpenter 1.0.0 has no page at this address. A link made with another version of it can name a page this one doesn’t have.', 'Open Karpenter')}</div></div>
      <div class="arr-stack"><p class="cap">An address to a page of a plugin not in use here</p><div class="pmain">${pageHead('Karpenter', 'server-cog')}${place('plug', 'Karpenter isn’t in use here.', 'Its pages are shown only where it’s in use. Plugins says where it is, and why it isn’t here.', 'Go to Plugins')}</div></div>
    </div>`,
    `Both are the app’s EmptyState, in docs’ words, and neither has the strip that says whose a page is: nothing of the plugin’s is drawn. <b>When a plugin stops being in use</b> (turned off, or its file gone) its entry, tabs and commands go at once; a page or tab of it that’s open stays where it is, in this place, so nothing jumps under the person, until they go elsewhere; then it’s gone and Back doesn’t bring it. <b>Go to Plugins</b> opens the Plugins page with that plugin’s row opened. <b>An address to a page it doesn’t have</b> keeps the plugin’s tabs so another can be picked; Open Karpenter opens its first page.`,
  )
}

/** 6. On a phone. */
function placesPhone(): string {
  const drawer = `<div class="ph"><div class="bar"><span class="tap">${icon('x', 20)}</span><h1>production</h1></div><div class="drawer"><h3>Storage</h3>${sideItem('Volume Claims', 'database')}${sideItem('Volumes', 'layers')}${PLUGINS_SECTION()}</div></div>`
  const page = phoneFrame(
    'Karpenter',
    `<nav class="lts">${KARPENTER_TABS('Overview')}</nav>${pgframe('Karpenter', '1.0.0', frameStub(), true)}`,
  )
  const object = phoneFrame(
    'general',
    `<nav class="lts">${ltab('Overview')}${ltab('Events')}${ltab('Audit')}${ltab('Capacity', { plug: true, on: true })}${ltab('YAML')}</nav>${pgframe('Karpenter', '1.0.0', frameStub(), true)}`,
    true,
  )
  const palette = `<div class="ph"><div class="pin ph3"><span>node</span><span class="tap">${icon('x', 20)}</span></div><div class="pl">${'<h4>Go to</h4>' + palRow('server', 'Nodes', 'Cluster') + palRow('server-cog', 'NodePools', 'karpenter.sh') + '<h4>From plugins</h4>' + palRow('plug', 'Show node pools', 'Karpenter', true) + palRow('plug', 'Nodes waiting for capacity', 'Karpenter')}</div></div>`
  return `<section class="spec"><h2>On a phone<i>the drawer, a plugin’s page, an object’s tab, the palette</i></h2><div class="phones">${drawer}${page}${object}${palette}</div><p style="max-width:1100px">The drawer’s Plugins section is the sidebar’s, its rows 44 px high. A plugin’s page and an object’s detail have the phone’s strip of tabs, 44 px high, scrolling sideways; a plugin’s tabs keep the plug. The strip that says whose a page is is the short one. Map isn’t on a phone, as today. The palette is the phone’s full-screen one, its rows 44 px, the plugin’s name at the right as on the desktop. Everything here only opens and reads, so a phone has all of it; a plugin’s own actions that change the cluster aren’t offered on a phone, as the kit’s header says.</p></section>`
}

// ─── A text that isn't Lumovi's, in a Table: its marks ─────────────────────────────────────

/** A mark: the code point of a character that can't be seen or would act, in a hairline box. */
const mk = (cp: string) => `<span class="mk">${cp}</span>`

/** A lead cell whose name is given as drawn (text and marks), not escaped. */
const leadDrawn = (drawn: string, under: string, level: Level = 'healthy') =>
  `<span class="lead"><span class="dot" style="--m:var(--${LEVEL[level]})"></span><span class="w"><span class="nm"><b>${drawn}</b></span><small>${under}</small></span></span>`

function marksTable(): string {
  const rows: Row[] = [
    {
      cells: [
        leadDrawn(`cart${mk('U+3164')}-api`, 'shop'),
        `<span>Ready</span>`,
        `<span>ghcr.io/acme/cart:v2.3.1</span>`,
      ],
    },
    {
      cells: [
        leadDrawn(`invoice-${mk('U+202E')}fdp.exe`, 'billing', 'warning'),
        `<span>Syncing</span>`,
        `<span>ghcr.io/acme/${mk('U+202E')}gpj.exe:1.0</span>`,
      ],
    },
    {
      cells: [
        leadDrawn(`platform-observ…${mk('U+3164')}${mk('U+180E')}u-west`, 'monitoring'),
        `<span>Ready</span>`,
        `<span>quay.io/team/collector:0.98.0</span>`,
      ],
    },
    {
      cells: [
        leadDrawn(`<bdi dir="auto">طلبات-الدفع</bdi>`, 'payments'),
        `<span><bdi dir="auto">جاهز</bdi></span>`,
        `<span>ghcr.io/acme/payments:3.1.0</span>`,
      ],
    },
    {
      cells: [
        leadDrawn(`spam${mk('U+3164')}${mk('U+3164')}${mk('U+3164')}…`, 'shop', 'critical'),
        `<span>Failed</span>`,
        `<span>—</span>`,
      ],
    },
  ]
  return spec(
    'A text that isn’t Lumovi’s, in a Table',
    'its marks in a cell, in a cut name, and in a heading',
    `<div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">
      ${card('Applications', '5', table('minmax(0,1.6fr) 120px minmax(0,1.3fr)', [head(`Name`), head(`Sta${mk('U+3164')}ge`), head('Image')], rows))}
      <div class="arr-stack">
        <p class="cap">Under the pointer, a name holding marks: its tooltip spells them, as plain text</p>
        <div class="kcard" style="padding:10px 14px;font-size:12.5px"><code style="font-family:'JetBrains Mono',monospace;font-size:12px">invoice- U+202E fdp.exe</code></div>
        <p class="cap">A cut name: the cut takes letters, never a mark; marks in the part cut away are drawn after the “…”</p>
        <div class="kcard" style="padding:10px 14px"><span style="font-size:13px;font-weight:500">platform-observ…${mk('U+3164')}${mk('U+180E')}u-west</span></div>
      </div>
    </div>`,
    `<b>Every text a plugin or the cluster wrote is drawn in pieces</b>, by the kit’s own rule (<code>inPieces</code>): runs of text as written, and for each character that turns text round, isn’t text, or draws as nothing, <b>a mark of Lumovi’s</b>: its code point in mono, quiet, in a hairline box with a 4 px radius, at the text’s own size less 8%, sitting on its line. A mark is never coloured: it says “something is here”, not “something is wrong”. Three marks in a row at most, then one mark “and 117 more”; twenty in a text at most. <b>In a cell</b> the marks sit in the text where the characters were. (A column is text, number, age, status or meter; there’s no mono kind, so an image’s name is text, in the sans.) <b>A name cut in its middle</b> (Table’s lead, the phone’s cards, a header) cuts letters only: a mark is never split and never cut away, so any mark in the part that goes is drawn right after the “…”, and the cut takes more letters to make room. Where the marks themselves don’t fit, the name ends with “…” after the last mark that does, and the tooltip spells them, capped as <code>quotedBack</code> caps a quoted text (its first 40 characters and “…”), so a name of a thousand marks can’t make a tooltip the size of the screen. <b>A text cut at its end</b> (a cell, a tooltip’s line) keeps its marks the same way: any in the part that goes are drawn right after the “…”, as many as fit. <b>Inside the app’s inverted tooltip</b> a mark is drawn from the tooltip’s own ink, its text at about 70% of it and its border at about 35%, so the code point reads there as well as anywhere. <b>A heading</b> a plugin wrote is uppercased, but its marks aren’t: “U+3164” stays as it is. <b>Right-to-left text</b> keeps its own direction inside its cell and changes nothing outside it, and starts at the cell’s left like every text of a row. <b>Where a mark can’t be drawn</b> (a tooltip, a name read out, a log line) the code point is spelled with spaces round it, “invoice- U+202E fdp.exe”; a screen reader hears “invisible character U+202E”. Sorting and filtering use the text as written; the marks are only how it’s drawn.`,
  )
}

// ─── Counts, Card and Pair: what Karpenter's overview is drawn from ──────────────────────────

/** A row of Counts: the value, a bar for its share of the whole, and its count. */
const crow = (value: string, n: number, total: number, mono = false) =>
  `<div class="crow"><span class="cv${mono ? ' mono' : ''}">${value}</span><span class="cb"><i style="width:${Math.max(2, Math.round((n / total) * 100))}%"></i></span><span class="cn">${n}</span></div>`

const cgroup = (title: string, rows: [string, number][], total: number, mono = false, more = 0) =>
  `<div class="cg"><h4>${title}</h4>${rows.map(([v, n]) => crow(v, n, total, mono)).join('')}${more ? `<div class="cmore">${icon('chevron-down', 14)}${more} more</div>` : ''}</div>`

/** A Card's quiet line about where its data came from, and a header button that only reads. */
function cardAbout(): string {
  const ABOUT =
    'These are the targets of whichever of them answered: the prometheus-operated Service sends each ask to one of their pods. Asking again may show the other’s.'
  const lead2 = (level: Level, name: string, beside: string, under = '') =>
    `<span class="lead"><span class="dot" style="--m:var(--${LEVEL[level]})"></span><span class="w"><span class="nm"><b>${name}</b><i>${beside}</i></span>${under ? `<small>${under}</small>` : ''}</span></span>`
  const rows = table(
    'minmax(0,1fr) 64px 64px',
    [head('Pool'), head('Up', { r: true }), head('Down', { r: true })],
    [
      pgRow([
        lead2('warning', 'storefront', 'ServiceMonitor · shop'),
        '<span class="r">1</span>',
        '<span class="r">1</span>',
      ]),
      pgRow([
        lead2('neutral', 'cart', 'PodMonitor · shop', '1 target not scraped yet'),
        '<span class="r">0</span>',
        '<span class="r">0</span>',
      ]),
      pgRow([
        lead2('healthy', 'node-exporter', 'ServiceMonitor · monitoring'),
        '<span class="r">2</span>',
        '<span class="r">0</span>',
      ]),
    ],
  )
  const withAbout = (
    about: string,
    cut = false,
    title = 'Prometheus k8s and user',
    note = 'in monitoring',
    inner = rows,
  ) =>
    `<div class="kcard"><h3>${title}<small>${note}</small></h3><p class="about${cut ? ' cut' : ''}">${about}</p><div class="in">${inner}</div></div>`
  const widgets = table(
    'minmax(0,1fr) 120px',
    [head('Widget'), head('Status')],
    [
      pgRow([lead2('healthy', 'blue-7', 'shop'), `<span>${pill('healthy', 'Ready')}</span>`]),
      pgRow([lead2('warning', 'green-2', 'shop'), `<span>${pill('warning', 'Paused')}</span>`]),
    ],
  )
  const tip = `<div style="position:relative">${withAbout('Counted from toys-api’s own list of widgets, which it refreshes every five minutes and keeps for a day, so a widget made in the last five minutes, or one removed since, may not show here yet. Lumovi’s own list of Widgets is always current.', true, 'Widgets', '2', widgets)}<span class="tt" style="top:58px;left:16px;max-width:520px;white-space:normal">Counted from toys-api’s own list of widgets, which it refreshes every five minutes and keeps for a day, so a widget made in the last five minutes, or one removed since, may not show here yet. Lumovi’s own list of Widgets is always current.</span></div>`
  const headers = `<div class="arr-stack">
    <p class="cap">One button, and it only reads: none filled</p><div class="h2nd"><b>Target health</b><span class="acts">${btn('Ask again', 'secondary')}</span></div>
    <p class="cap">One that changes, listed before a read: it moves to the end, filled, the others in their order</p>${header2('orders-db', ['healthy', 'Healthy'], `${btn('Ask again', 'secondary')}${btn('Back up now…', 'primary')}`)}
  </div>`
  return spec(
    'A Card’s line, and a button that only reads',
    'where a card’s data came from; and weight that follows what a press can do',
    `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start"><div class="arr-stack"><p class="cap">A Card with its quiet line: Prometheus Operator’s, where a namespace runs two</p>${withAbout(ABOUT)}<p class="cap">A longer one (Toys, the tests’ stand-in): two lines, then cut at its end, whole in its tooltip</p>${tip}</div>${headers}</div>`,
    `<b>A Card’s line</b> (<code>about</code>, the plugin’s text, at most 240 characters) says where the card’s data came from, when the title and its note can’t: under the title, before what it holds, in the quiet ink at 12 px, as wide as the card, wrapping to two lines and then cut at its end, whole in its tooltip (and read whole to a screen reader, after the title, never as its name). Under a finger, where nothing hovers, it isn’t cut: it wraps whole, at most 240 characters, so it can always be read. <b>That’s the kit’s rule, not this line’s alone</b>: whatever is whole in a tooltip under a pointer is whole on the page, or a tap away, under a finger. A line of words wraps whole (a Card’s line, a Header’s status detail, the reason a button is off, which then stands under the buttons as a note does); a value in a row is a tap away, as a fact that stands for something longer is. No icon and no colour: it’s said, not warned. A card without one is as today. <b>A button that only reads</b> is never drawn filled: the filled one is the last button that declares <code>changes</code>, and a header whose buttons only read or go has none filled, as a link already isn’t. <b>The filled one always stands last</b>, at the row’s right end where a filled button stands on every Lumovi page, and so is never folded into “…”: where the plugin lists a read after it, Lumovi moves it there, and the others keep the plugin’s order. One that’s <code>off</code> for now still stands there and is still the filled one, drawn off at half strength with its reason, since it’s still where the change is. For that to be true, the door gives a press token only to a button that declares <code>changes</code>, so a press of any other button can propose nothing; on a phone, as today, those that change give way to Lumovi’s line, and those that only read stay.`,
  )
}

function countsWhole(): string {
  const long = `eu-central-1-wl1-ber…${mk('U+202E')}wlz-1`
  const mix = card(
    'Node mix',
    '',
    `<div class="counts">${cgroup(
      'Instance types',
      [
        ['m6i.2xlarge', 7],
        ['c6i.4xlarge', 5],
        ['r6i.xlarge', 3],
        ['m6i.large', 1],
      ],
      20,
      true,
      4,
    )}${cgroup(
      'Capacity types',
      [
        ['On demand', 13],
        ['Spot', 7],
      ],
      20,
    )}${cgroup(
      'Zones',
      [
        ['eu-central-1a', 6],
        ['eu-central-1b', 5],
        ['eu-central-1c', 4],
        ['eu-west-1a', 3],
        [long, 2],
      ],
      20,
      true,
    )}</div>`,
  )
  const nodes = card(
    'Nodes',
    '20 · 3 still starting',
    `<div class="stub" style="height:220px">a Table of the nodes, as the kit’s Table</div>`,
  )
  const pair = `<div class="pair wider">${nodes}${mix}</div>`
  return spec(
    'Counts, in a Card, in a Pair',
    'Node mix as Karpenter draws it, beside Nodes',
    pair,
    `<b>Counts</b> is a part of its own, not a meter: a meter fills against a limit and turns warning and critical; a count’s bar is a share of a whole and is never a level. Groups, each a title in the small caps of a card’s section, then rows: the value (in mono where the plugin says the values are code, like an instance type), a bar of its share of the group’s whole in the first series colour only, and the count, tabular, at the right. Rows come largest first. <b>A group of up to five rows shows them all; past five it shows four and “N more”</b>, which opens the rest in place, so a card stays a glance (Zones, at five, has no “more”; Instance types, eight, shows four and “4 more”). Bars keep one column, so rows line up; a value longer than its column is cut in its middle, taking only what doesn’t fit, and its marks are kept, drawn right after the “…”, as in Table, and it’s whole in its tooltip. Bars are 6 px, as a meter’s, the smallest share a dot, and no colour says anything but “how much”. <b>Card</b> is Lumovi’s card: a title, and a quiet note at its right if the plugin gives one, which may be words (“20 · 3 still starting”), end-cut; and exactly one part inside, never an arrangement, so cards don’t nest pages. <b>Pair</b> sets two parts side by side, <code>wider</code> (the first 7 of 12, as Karpenter’s today) or <code>even</code>; always exactly two (one thing alone is a Card in the Stack, full width, so a page never has a hole beside a lone card; the door refuses a Pair of one or of three; three or four equal things are Tiles; a side with nothing to show keeps its card and that card’s empty state), Lumovi sets the widths, and below 960 px of page, or on a phone, the two stack, first on top. The “couldn’t refresh part of it” notice is Lumovi’s own, the app’s, above the page under the strip; never a part a plugin draws.`,
  )
}

function countsPhone(): string {
  const long = `eu-cen…${mk('U+202E')}wlz-1`
  const f = phoneFrame(
    'Karpenter',
    `<div class="sec"><h3>Nodes<small>20 · 3 still starting</small></h3><div class="stub" style="height:64px">the Table’s cards, scrolled past</div></div><div class="sec"><h3>Node mix</h3><div class="counts one">${cgroup(
      'Instance types',
      [
        ['m6i.2xlarge', 7],
        ['c6i.4xlarge', 5],
        ['r6i.xlarge', 3],
        ['m6i.large', 1],
      ],
      20,
      true,
      4,
    )}${cgroup(
      'Zones',
      [
        ['eu-central-1a', 6],
        ['eu-central-1b', 5],
        ['eu-central-1c', 4],
        ['eu-west-1a', 3],
        [long, 2],
      ],
      20,
      true,
    )}</div></div>`,
  )
  return `<section class="spec"><h2>On a phone<i>a Pair stacks; Counts keeps its three columns</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${f}</div><p style="max-width:820px">A Pair is two stacked cards, the first on top: Nodes, then Node mix. Counts’ groups stack one under another; each row keeps value, bar and count on one line, the bars in one narrower column so rows still line up, a value longer than its column cut in its middle, its marks kept; the groups come in the plugin’s order and all are shown (Capacity types is below, scrolled); “4 more” is a 44 px row.</p></section>`
}

/** What Karpenter's move to its plugin asked of Table and Tiles (LMV-254), written once. */
function movedRules(): string {
  return `<section class="spec"><h2>Four rules from Karpenter’s move<i>so nothing it shows today is lost</i></h2><p style="max-width:860px"><b>A row’s rest may carry a time</b>: drawn after the rest’s words as “Launching · 3m”, the “ · ” and the age in the rest’s own ink, tabular, at the row’s right as the rest is; the age is Lumovi’s to write from the time the plugin gives, never the plugin’s text. <b>A table’s <code>shows</code> applies to each group alike</b>: one number for the table, each group showing that many and its own “Show all N” under them, N its full count; groups can’t ask for different numbers. A table without groups has one “Show all N”. <b>A tile’s value is optional</b>: a tile still reading, or with nothing to count, is its icon and label with the value’s space kept, so a row of tiles doesn’t jump when it arrives; no “…” and no dash. <b>A read cut at Lumovi’s limit</b> draws what it read, and says so in Table’s ceiling-line form (“Showing the first 5,000; there are more.”, docs’ words); a tile counting from it is handed the read’s cut as a Table is, and Lumovi draws the plugin’s own figure with a “+” after it (“5,000+” for the whole read, “4,980+” for part of it), the plugin’s label unchanged, and a detail line of Lumovi’s: “Counted from the first 5,000 Lumovi read.” And whenever any read on a page was cut, the page shell says so beside the stale notice, quietly, in Lumovi’s words, so no plugin can hide it: “Some of what this page shows is from the first 5,000 of a list: the cluster has more than Lumovi reads at once.” A cut read is never drawn as failed.</p></section>`
}

// ─── CloudNativePG as a plugin: its Clusters and Backups pages, read-only (LMV-279) ──────────

const PG_CLUSTERS: Picked[] = [
  {
    lead: { level: 'critical', name: 'reports-db', under: '0 of 2 ready · analytics' },
    status: ['critical', 'Failed'],
  },
  {
    lead: { level: 'progressing', name: 'sessions-db', under: '1 of 2 ready · shop' },
    status: ['progressing', 'Switching over'],
  },
  {
    lead: { level: 'healthy', name: 'orders-db', under: '3 of 3 ready · shop' },
    status: ['healthy', 'Healthy'],
  },
  {
    lead: {
      level: 'healthy',
      name: 'payments-reconciliation-ledger-db',
      under: '3 of 3 ready · billing',
    },
    status: ['healthy', 'Healthy'],
  },
]

const pgRow = (cells: string[], cls = '') => ({ cells, cls })

function pgInstances(): string {
  return table(
    'minmax(0,1.6fr) 104px 120px minmax(0,1fr) 72px 56px',
    [
      head('Name'),
      head('Role'),
      head('Status', { sorted: 'down' }),
      head('Node'),
      head('Restarts', { r: true }),
      head('Age', { r: true }),
    ],
    [
      pgRow([
        lead({ level: 'healthy', name: 'orders-db-1' }),
        '<span>Primary</span>',
        `<span>${pill('healthy', 'Ready')}</span>`,
        '<span class="q">ip-10-0-1-17</span>',
        '<span class="r">0</span>',
        '<span class="r">12d</span>',
      ]),
      pgRow([
        lead({ level: 'healthy', name: 'orders-db-2' }),
        '<span>Replica</span>',
        `<span>${pill('healthy', 'Ready')}</span>`,
        '<span class="q">ip-10-0-2-44</span>',
        '<span class="r">0</span>',
        '<span class="r">12d</span>',
      ]),
      pgRow([
        lead({ level: 'healthy', name: 'orders-db-3' }),
        '<span>Replica</span>',
        `<span>${pill('healthy', 'Ready')}</span>`,
        '<span class="q">ip-10-0-3-91</span>',
        '<span class="r">2</span>',
        '<span class="r">3d</span>',
      ]),
    ],
  )
}

const BK = (rows: [Level, string, string, string, string, string][]) =>
  rows.map(([lv, name, method, st, started, took]) =>
    pgRow([
      lead({ level: lv, name }),
      `<span>${method}</span>`,
      `<span>${pill(lv, st)}</span>`,
      `<span class="r">${started}</span>`,
      `<span class="r">${took}</span>`,
    ]),
  )

function pgBackups(empty = false): string {
  if (empty)
    return `<div class="state" style="min-height:96px"><span>No backups of orders-db yet.</span></div>`
  return `${table(
    'minmax(0,1.6fr) 140px 120px 72px 80px',
    [
      head('Name'),
      head('Method'),
      head('Status'),
      head('Started', { r: true, sorted: 'down' }),
      head('Took', { r: true }),
    ],
    BK([
      ['progressing', 'orders-db-20261013-1200', 'Volume snapshot', 'Running', '4m', '—'],
      ['healthy', 'orders-db-20261013-0900', 'Volume snapshot', 'Completed', '3h', '4m 12s'],
      ['critical', 'orders-db-20261013-0600', 'Barman object store', 'Failed', '6h', '1m 03s'],
      ['healthy', 'orders-db-20261013-0300', 'Volume snapshot', 'Completed', '9h', '4m 01s'],
      ['healthy', 'orders-db-20261013-0000', 'Volume snapshot', 'Completed', '12h', '3m 58s'],
    ]),
  )}<div class="kmore">Show all 41</div>`
}

const pgTiles = () =>
  `${tile('server', 'Instances ready', '3/3', 'All ready', { level: 'healthy', opens: true })}${tile('database', 'Primary', 'orders-db-1', 'timeline 4', { words: true, opens: true })}${tile('timer', 'Last backup', '3h', 'Volume snapshot', { opens: true })}${tile('package', 'PostgreSQL', '16.4', 'ghcr.io/cloudnative-pg/postgresql:16.4', { words: true })}`

function pgClusters(): string {
  const right = `<div class="arr-stack">
    ${header2('orders-db', ['healthy', 'Healthy'], '')}
    <div class="arr-tiles" style="--n:4">${pgTiles()}</div>
    ${card('Instances', '3', pgInstances())}
    ${card('Backups', '41', pgBackups())}
    <div class="pair wider">${card('Schedules', '2', table('minmax(0,1fr) 88px 88px', [head('Schedule'), head('Last', { r: true }), head('Next', { r: true })], [pgRow([`<span class="lead"><span class="w"><span class="nm"><b>Every 3 hours</b></span><small>nightly-and-day · 0 0 */3 * * *</small></span></span>`, '<span class="r">3h</span>', '<span class="r">in 4m</span>']), pgRow([`<span class="lead"><span class="w"><span class="nm"><b>Every day at 02:00</b></span><small>weekly-offsite · 0 0 2 * * *</small></span></span>`, '<span class="r">10h</span>', '<span class="r">in 14h</span>'])]))}${card('Poolers', '1', table('minmax(0,1fr) 56px 88px', [head('Name'), head('Type'), head('Ready', { r: true })], [pgRow([lead({ level: 'healthy', name: 'orders-db-rw' }), '<span>rw</span>', '<span class="r">2 of 2</span>'])]))}</div>
  </div>`
  return spec(
    'Clusters',
    'a Split: the clusters, and the one picked',
    `<div class="pagebox">${pgframe('CloudNativePG', '1.24.1', `<div class="arr-split" style="padding:16px">${card('Clusters', '4', pickList(PG_CLUSTERS, 2, { fit: 26 }))}${right}</div>`)}</div><p class="cap" style="margin-top:12px">reports-db picked: the header’s status carries the phase’s reason, under the name and word</p><div class="pagebox" style="max-width:900px"><div class="h2nd"><b>reports-db</b><span class="st">${pill('critical', 'Failed')}</span></div><p class="h2why">Cluster cannot proceed to reconciliation due to an unknown plugin being required: barman-cloud.cloudnative-pg.io</p></div>`,
    `The kit’s Split with real data, read-only: no buttons, so the header is the name and its status alone, and under them, when the cluster gives one, <b>the status’s detail</b>: the phase’s reason, the plugin’s text, quiet, at the lead step’s small size, wrapping to two lines then end-cut, whole in its tooltip. On a phone it sits under the status pill. A Header’s detail is the kit’s, for any plugin. <b>The list</b> is worst first (Failed, then Switching over, then Healthy); a phase is said in a short word with its level, never colour alone. <b>Tiles</b>: Instances ready, Primary (the instance’s name, “timeline 4”), Last backup (its age and method; “No backup yet” in amber when there’s none), PostgreSQL (the version from the image tag, the image under it, end-cut). <b>Instances</b>: <i>Role</i> is a text column, not a status: Primary and Replica aren’t levels. A row opens its Pod. <b>Backups</b>: latest first, five shown and “Show all 41”; a row opens its Backup; “Took” is a dash while it runs. <b>Schedules and Poolers</b> sit in a Pair when the cluster has both. A Pair is exactly two, so when it has one of them, that one is a Card on its own, full width; when neither, there’s nothing. The schedule is said in words; under it, quiet, the ScheduledBackup’s name and its cron, one text in the sans as a row’s line under is, end-cut, so it can be read and copied.`,
  )
}

/** The Split in a narrow pane (beside a row's panel): the phone's two pages, by its own width. */
function pgNarrow(): string {
  const back = `<div class="bk2">${icon('arrow-left', 16)}Clusters</div>`
  const panel = `<div class="dpanel" style="width:380px">${detailHead('orders-db-1', 'Pod · shop')}${frameStub('Lumovi’s Overview of the Pod')}</div>`
  const kept = pgframe(
    'CloudNativePG',
    '1.24.1',
    `<div class="arr-stack" style="padding:16px">${back}${header2('orders-db', ['healthy', 'Healthy'], '')}<div class="arr-tiles" style="--n:1">${tile('server', 'Instances ready', '3/3', 'All ready', { level: 'healthy', opens: true })}</div><p class="cap">… its other tiles, Instances (orders-db-1 the row just pressed), Backups</p></div>`,
    true,
  )
  const list = pgframe(
    'CloudNativePG',
    '1.24.1',
    `<div class="arr-stack" style="padding:16px">${card('Clusters', '4', pickList(PG_CLUSTERS, 2).replace('class="pick"', 'class="pick under"'))}</div>`,
    true,
  )
  const pane = (body: string) =>
    `<div style="display:flex;gap:12px;align-items:flex-start"><div style="width:300px;flex:none">${body}</div>${panel}</div>`
  return spec(
    'Beside a panel',
    'under 640 px of its own width, the Split is the phone’s two pages',
    `<div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap"><div class="arr-stack"><p class="cap">1024, a row of orders-db pressed: what was in view stays, with Back</p>${pane(kept)}</div><div class="arr-stack"><p class="cap">After Back: the list, names whole to their floor, every pill under, orders-db still picked</p>${pane(list)}</div></div>`,
    `The Split goes by <b>its own width</b>, not the window’s: side by side from 640 px (the list’s 300, the gap, and enough for the rest’s tiles to stand two across); under that, the phone’s two pages, in place. So at 1440 or 1024 beside a row’s panel it’s two pages, and at 1024 with no panel it stays side by side. <b>Narrowing never takes away what’s in view</b>: a picked one’s page that was showing when the panel opened keeps showing, so the row just pressed is still there beside its panel, with a Back row first: the arrow and the list’s own title (“Clusters”), 36 px, the whole row pressable, focusable as any row. No title in the top bar (that’s the phone’s app bar), since the picked one’s header names it. <b>Arriving narrow</b> (a reload, a link) starts at the list, as on a phone. On the list page the picked one is marked and nothing is beside the list. <b>A name keeps the Table’s floor</b>, the least of its own width and 160 px; where any row’s pill can’t sit beside its name at that floor, <b>every</b> row’s pill goes on a line of its own under the name’s two, at the name’s edge (the list decides, so pills are never mixed), and a longer name is cut in its middle only past its floor. In the 300 px list side by side they stay beside. <b>Widening</b> (the panel closed) goes back side by side, the same one picked. Tiles under 320 px of row stand one across.`,
  )
}

function pgBackupsPage(): string {
  const tiles = `${tile('database', 'Backups in the last day', '23', 'across 3 clusters')}${tile('circle-x', 'Failed in the last day', '1', 'orders-db at 06:00', { level: 'critical', opens: true })}${tile('clock', 'No backup in a day', '1', 'reports-db', { level: 'warning', opens: true })}${tile('timer', 'Next scheduled', 'in 4m', 'orders-db', { words: true })}`
  const groups = `${table(
    'minmax(0,1.6fr) 140px 120px 72px 80px',
    [
      head('Name'),
      head('Method'),
      head('Status'),
      head('Started', { r: true, sorted: 'down' }),
      head('Took', { r: true }),
    ],
    [
      '<div class="grp-h">orders-db<small>41</small></div>',
      ...BK([
        ['progressing', 'orders-db-20261013-1200', 'Volume snapshot', 'Running', '4m', '—'],
        ['healthy', 'orders-db-20261013-0900', 'Volume snapshot', 'Completed', '3h', '4m 12s'],
        ['critical', 'orders-db-20261013-0600', 'Barman object store', 'Failed', '6h', '1m 03s'],
      ]),
      '<div class="kmore">Show all 41</div>',
      '<div class="grp-h">reports-db<small>2</small></div>',
      ...BK([
        ['healthy', 'reports-db-20261011-0200', 'Volume snapshot', 'Completed', '2d', '9m 40s'],
      ]),
      '<div class="grp-h">sessions-db<small>8</small></div>',
      ...BK([
        ['healthy', 'sessions-db-20261013-1100', 'Volume snapshot', 'Completed', '1h', '2m 20s'],
      ]),
      '<div class="kmore">Show all 8</div>',
      '<div class="grp-h">payments-reconciliation-ledger-db<small>16</small></div>',
      ...BK([
        [
          'healthy',
          'payments-reconciliation-ledger-db-20261013-1130',
          'Volume snapshot',
          'Completed',
          '30m',
          '6m 05s',
        ],
      ]),
      '<div class="kmore">Show all 16</div>',
    ],
  )}`
  return spec(
    'Backups',
    'every cluster’s, by cluster, latest first',
    `<div class="pagebox">${pgframe('CloudNativePG', '1.24.1', `<div class="arr-stack" style="padding:16px"><div class="arr-tiles" style="--n:4">${tiles}</div>${card('Backups', '67', groups)}</div>`)}</div>`,
    `A Stack: four tiles, then one Table grouped by cluster, each group showing five with its own “Show all N” (the rule from Karpenter’s move). <b>Tiles</b>: a count in the last day; failed in the last day, critical past zero and opening the list filtered to those; clusters with no backup in a day, amber past zero; the next scheduled, as “in 4m” with its cluster. Groups come worst first: a cluster with a failed or missing backup above the rest. The picture shows fewer rows a group than five, for room; each group still says its full count.`,
  )
}

function pgPhone(): string {
  const list = phoneFrame(
    'CloudNativePG',
    `<div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('CloudNativePG', '1.24.1', true)}</div><div class="pick">${PG_CLUSTERS.map((c) => `<div class="pi">${lead(c.lead, { fit: 22 })}<span class="st">${pill(c.status[0], c.status[1])}</span></div>`).join('')}</div>`,
  )
  const one = phoneFrame(
    'orders-db',
    `<div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('CloudNativePG', '1.24.1', true)}</div><div class="under">${pill('healthy', 'Healthy')}</div><div class="ptiles">${pgTiles()}</div><div class="sec"><h3>Instances<small>3</small></h3><ul class="cards"><li><div class="top">${lead({ level: 'healthy', name: 'orders-db-1' })}</div><dl>${fact('Role', 'Primary')}${fact('Status', 'Ready')}${fact('Age', '12d')}${fact('Node', 'ip-10-0-1-17')}${fact('Restarts', '0')}</dl></li><li><div class="top">${lead({ level: 'healthy', name: 'orders-db-2' })}</div><dl>${fact('Role', 'Replica')}${fact('Status', 'Ready')}${fact('Age', '12d')}${fact('Node', 'ip-10-0-2-44')}${fact('Restarts', '0')}</dl></li></ul></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the Split’s two pages</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${list}${one}</div><p style="max-width:820px">By the kit’s Split: the clusters as a list page, then the picked one as a page with Back, its name in the top bar and its status under. Tiles two across, each that opens with its “›” always shown, as a touch screen has no hover (on the desktop it shows on hover, the kit’s rule). The tables as cards, every column a fact, three across where every value fits a third of the card, else one a line. No buttons here either, so nothing is held back for a larger screen.</p></section>`
}

// ─── Argo CD, as a plugin with code ────────────────────────────────────────────────────────

/** Argo CD's health, as a level: Healthy, Progressing, Degraded, Missing, Suspended, Unknown. */
const HEALTH: Record<string, Level> = {
  Healthy: 'healthy',
  Progressing: 'progressing',
  Degraded: 'critical',
  Missing: 'warning',
  Suspended: 'neutral',
  Unknown: 'neutral',
}

const syncPill = (s: 'Synced' | 'Out of sync' | 'Unknown') =>
  pill(s === 'Synced' ? 'healthy' : s === 'Out of sync' ? 'warning' : 'neutral', s)

type App = [
  name: string,
  health: string,
  sync: 'Synced' | 'Out of sync',
  path: string,
  target: string,
  dest: string,
  synced: string,
]

const APP_ROWS = (apps: App[]) =>
  apps.map(([name, health, sync, path, target, dest, synced]) =>
    pgRow([
      lead({ level: HEALTH[health], name, under: health }),
      `<span>${syncPill(sync)}</span>`,
      `<span class="q">github.com/acme/deploy · ${path}</span>`,
      `<span class="q">${target}</span>`,
      `<span>${dest}</span>`,
      `<span class="r">${synced}</span>`,
    ]),
  )

const ARGO_TABS =
  ltab('Overview', { plug: true, on: true }) +
  ltab('Applications', { count: '14' }) +
  ltab('AppProjects', { count: '2' }) +
  ltab('ApplicationSets', { count: '1' })

const ARGO_TILES = () =>
  `${tile('activity', 'Healthy', '12/14', '1 degraded · 1 progressing', { level: 'critical', opens: true })}${tile('git-branch', 'Out of sync', '2', 'of 14 applications', { level: 'warning', opens: true })}${tile('circle-x', 'Last sync failed', '1', 'legacy-batch', { level: 'critical', opens: true })}`

/** 1. The overview: three tiles, then the applications by project, worst first. */
function argoOverview(): string {
  const apps = table(
    'minmax(0,1.3fr) 112px minmax(0,1.6fr) 96px 96px 80px',
    [
      head('Name'),
      head('Sync'),
      head('Repository and path'),
      head('Target revision'),
      head('Destination'),
      head('Last synced', { r: true }),
    ],
    [
      '<div class="grp-h">default<small>1</small></div>',
      ...APP_ROWS([
        ['legacy-batch', 'Degraded', 'Out of sync', 'jobs/legacy-batch', 'main', 'batch', '2h'],
      ]),
      '<div class="grp-h">shop<small>13</small></div>',
      ...APP_ROWS([
        ['payments', 'Progressing', 'Out of sync', 'apps/payments', 'v2.4.1', 'payments', '1d'],
        ['storefront', 'Healthy', 'Synced', 'apps/storefront', 'main', 'shop', '3m'],
        ['checkout', 'Healthy', 'Synced', 'apps/checkout', 'main', 'shop', '3m'],
        ['cart', 'Healthy', 'Synced', 'apps/cart', 'main', 'shop', '3m'],
        ['search', 'Healthy', 'Synced', 'apps/search', 'v1.9.0', 'search', '6h'],
      ]),
      '<div class="kmore">Show all 13</div>',
    ],
  )
  return spec(
    'Overview',
    'the plugin’s own page, first among its tabs',
    `<div class="pwin"><aside class="pside"><h3>Configuration</h3>${sideItem('ConfigMaps', 'file-code-2')}${sideItem('Secrets', 'key-round')}${PLUGINS_SECTION('Argo CD')}</aside>
      <div class="pmain">${pageHead('Argo CD', 'git-merge')}<nav class="lts">${ARGO_TABS}</nav>${pgframe('Argo CD', '2.1.0', `<div class="arr-stack" style="padding:16px"><div class="arr-tiles" style="--n:3">${ARGO_TILES()}</div>${card('Applications', '14', apps)}</div>`)}</div></div>`,
    `A Stack: a row of tiles, then one Table. No header and no buttons: the page’s title is Lumovi’s, above the tabs. <b>Five counts make three tiles</b>, as a row holds two to four: <b>Healthy</b> is how many of all the applications (so “Applications” is its whole), and its line under names the rest by health, Degraded first; <b>Out of sync</b>, amber past zero; <b>Last sync failed</b>, red past zero, naming the one or how many. Each opens Lumovi’s own list of Applications filtered to those. A cut read says so on the tile, as Karpenter’s do. <b>Applications</b>, grouped by project, worst group first (a degraded or failed application lifts its project above the rest), worst first within a group, five a group with its own “Show all N”. The lead is the name, its dot the health’s level and the health’s word under it (never colour alone): Healthy green, Degraded red, Missing amber; Progressing, Suspended and Unknown grey, Progressing with the kit’s turning mark on its status (blue is only for what can be pressed or picked). <b>Sync</b> is a status: Synced, Out of sync in amber, Unknown grey. The repository and path is one quiet text, end-cut, whole in its tooltip; the target revision quiet; Destination is the namespace. A row opens the Application’s own page in Lumovi, on its Argo CD tab.`,
  )
}

const appHead = (name: string, health: string) =>
  `<div class="dhd"><div><b>${name}</b><small>Application · argocd</small></div>${pill(HEALTH[health]!, health)}</div>`

const APP_OBJ_TABS =
  ltab('Overview') +
  ltab('Events') +
  ltab('Audit') +
  ltab('Argo CD', { plug: true, on: true }) +
  ltab('YAML')

const ARGO_ACTS = (syncOff = false) =>
  `${btn('Delete…', 'ghost')}${btn('Refresh…', 'secondary')}<span class="btn primary sm${syncOff ? ' off' : ''}">Sync…</span>`

const appTiles = () =>
  `${tile('git-branch', 'Sync', 'Synced', '3 of 3 resources', { words: true, level: 'healthy' })}${tile('package', 'Synced revision', '4f1c9aa', 'main', { words: true })}${tile('clock', 'Last synced', '3m', 'Succeeded, by auto-sync')}${tile('rotate-cw', 'Auto-sync', 'On', 'Prune off · self-heal on', { words: true })}`

/** Docs' sentence, the plugin's own, by Delete…: only when the Application has Argo CD's resources finalizer. */
const FINALIZER = `<p class="finl">${icon('info', 14)}<span>Deleting it also deletes what it deployed (it has Argo CD’s resources finalizer).</span></p>`

const RESOURCES = card(
  'Resources',
  '3',
  table(
    'minmax(0,1.6fr) 120px 120px',
    [head('Name'), head('Sync'), head('Health', { sorted: 'down' })],
    [
      pgRow([
        lead({ level: 'healthy', name: 'storefront', under: 'Deployment · shop' }),
        `<span>${syncPill('Synced')}</span>`,
        `<span>${pill('healthy', 'Healthy')}</span>`,
      ]),
      pgRow([
        lead({ level: 'healthy', name: 'storefront', under: 'Service · shop' }),
        `<span>${syncPill('Synced')}</span>`,
        `<span>${pill('healthy', 'Healthy')}</span>`,
      ]),
      pgRow([
        lead({ name: 'storefront-config', under: 'ConfigMap · shop' }),
        `<span>${syncPill('Synced')}</span>`,
        '<span class="q">—</span>',
      ]),
    ],
  ),
)

const HISTORY = card(
  'History',
  '2',
  table(
    '48px 92px minmax(0,1fr) 80px',
    [
      head('ID'),
      head('Revision'),
      head('Source path'),
      head('Deployed', { r: true, sorted: 'down' }),
    ],
    [
      pgRow([
        '<span>12</span>',
        '<span class="q">4f1c9aa</span>',
        '<span class="q">apps/storefront</span>',
        '<span class="r">3m</span>',
      ]),
      pgRow([
        '<span>11</span>',
        '<span class="q">9b2e771</span>',
        '<span class="q">apps/storefront</span>',
        '<span class="r">2d</span>',
      ]),
    ],
  ),
)

const COMPARISON =
  "Failed to load target state: failed to generate manifest for source 1 of 1: rpc error: code = Unknown desc = Manifest generation error (cached): kustomize build jobs/legacy-batch failed: accumulating resources: accumulation err='accumulating resources from '../base'"

const LEGACY_HISTORY = card(
  'History',
  '4',
  table(
    '48px 92px minmax(0,1fr) 80px',
    [
      head('ID'),
      head('Revision'),
      head('Source path'),
      head('Deployed', { r: true, sorted: 'down' }),
    ],
    [
      ['7', 'c41d0e2', '9d'],
      ['6', '18aa3f5', '23d'],
      ['5', 'e07b9c1', '41d'],
      ['4', '5f2d8a4', '62d'],
    ].map(([id, rev, age]) =>
      pgRow([
        `<span>${id}</span>`,
        `<span class="q">${rev}</span>`,
        '<span class="q">jobs/legacy-batch</span>',
        `<span class="r">${age}</span>`,
      ]),
    ),
  ),
)

/** 2. The Application's tab: the header with its three changes, the tiles, then its cards. */
function argoTab(): string {
  const conditions = card(
    'Conditions',
    '1',
    table(
      '144px minmax(0,1fr) 64px',
      [head('Type'), head('Message'), head('When', { r: true })],
      [
        pgRow([
          `<span>${pill('warning', 'ComparisonError')}</span>`,
          `<span class="q" style="white-space:normal">${escape(COMPARISON.slice(0, 150))}…</span>`,
          '<span class="r">2h</span>',
        ]),
      ],
    ),
  )
  return spec(
    'The Application’s tab',
    'after Lumovi’s own tabs, before YAML',
    `<div class="pmain">${appHead('storefront', 'Healthy')}<nav class="lts">${APP_OBJ_TABS}</nav>${pgframe('Argo CD', '2.1.0', `<div class="arr-stack" style="padding:16px"><div>${header2('storefront', ['healthy', 'Healthy'], ARGO_ACTS())}${FINALIZER}</div><div class="arr-tiles" style="--n:4">${appTiles()}</div>${RESOURCES}${HISTORY}</div>`)}</div>
    <p class="cap" style="margin-top:20px">The header’s other cases: an operation running (Sync… off), and a degraded application with its condition</p>
    <div class="pagebox arr-stack">
      <div>${header2('payments', ['progressing', 'Progressing'], ARGO_ACTS(true))}<p class="h2why">Sync running: waiting for healthy state of apps/Deployment/payments</p></div>
      <div>${header2('legacy-batch', ['critical', 'Degraded'], ARGO_ACTS())}<p class="h2why">${escape(COMPARISON)}</p></div>
      <div class="pair wider">${LEGACY_HISTORY}${conditions}</div>
    </div>`,
    `The object’s own page in Lumovi, its head Lumovi’s (name, kind and namespace, and the health its data view already shows), then <b>Argo CD’s tab, after Lumovi’s own and before YAML</b>, with the plug, and the strip that says whose it is. <b>The header</b> repeats the name, as every plugin page’s header says what it’s about, then the health’s word with its level, and at most three buttons, the one that matters most last and the only one filled: <b>Delete…, Refresh…, Sync…</b>. <b>Refresh ends in “…”</b>: it asks one thing (Normal or Hard) first, and a button that asks first ends so. <b>Sync… is off while an operation runs</b>, its tooltip saying “A sync is running.”. <b>The status’s detail</b> is, in order: the running operation’s message (“Sync running: …”), the last operation’s message when it failed, else the first condition’s message; two lines, then end-cut, whole in its tooltip. <b>Nothing says “Sync started” of its own</b>: after Lumovi’s dialog, Lumovi’s notification says what it sent, and the header shows what the cluster says by reading the Application again, so the page never says it worked before the cluster does. <b>Four tiles, not five</b>: health is the header’s, so Sync (and how many resources are in sync), Synced revision (seven characters in the mono, the whole in its tooltip, the branch under), Last synced (a time value, as an age, with how it went and who), Auto-sync (with prune and self-heal under). <b>Resources</b>: kind and namespace under the name, Sync and Health as statuses, worst first; a ConfigMap has no health, so a dash. <b>By Delete…</b>, only when the Application has Argo CD’s resources finalizer, the plugin’s own line, docs’ words: “Deleting it also deletes what it deployed (it has Argo CD’s resources finalizer).”, quiet, under the buttons at the right, so it’s read before the press; payments and legacy-batch have none, so none. Lumovi’s dialog names the finalizer in its own words too. A row opens the object’s page where it’s one of Lumovi’s kinds. <b>History</b>: newest first, the revision short. <b>Conditions</b> only where there are any; with History they make a Pair, exactly two; alone, History is a Card full width.`,
  )
}

/** 2b. Where a resource's row goes: Lumovi's own list, filtered to it exactly. */
function argoOpens(): string {
  const go = `<span class="go2">${icon('chevron-right', 16)}</span>`
  const rows = table(
    'minmax(0,1.6fr) 120px 120px 24px',
    [head('Name'), head('Sync'), head('Health', { sorted: 'down' }), ''],
    [
      {
        cells: [
          lead({ level: 'healthy', name: 'storefront', under: 'Deployment · shop' }),
          `<span>${syncPill('Synced')}</span>`,
          `<span>${pill('healthy', 'Healthy')}</span>`,
          go,
        ],
        cls: 'opens hover',
      },
      {
        cells: [
          lead({ level: 'healthy', name: 'storefront', under: 'Service · shop' }),
          `<span>${syncPill('Synced')}</span>`,
          `<span>${pill('healthy', 'Healthy')}</span>`,
          '<span></span>',
        ],
        cls: 'opens',
      },
      pgRow([
        lead({ level: 'warning', name: 'storefront-canary', under: 'Rollout · shop' }),
        `<span>${syncPill('Out of sync')}</span>`,
        `<span>${pill('warning', 'Missing')}</span>`,
        '<span></span>',
      ]),
    ],
  )
  const list = `<div class="pmain"><div class="phd">${icon('layers', 16)}<b>Deployments</b></div><div class="fbar"><span class="fchip">${icon('git-merge', 13)}<span>name <b>storefront</b> · namespace <b>shop</b></span><span class="x">${icon('x', 13)}</span></span><span class="q3">Opened from Argo CD’s page: only this one is shown. Clear the filter to see every Deployment.</span></div><div style="padding:0 20px 16px">${table(
    'minmax(0,1.6fr) 96px 88px 64px',
    [head('Name'), head('Status'), head('Ready', { r: true }), head('Age', { r: true })],
    [
      pgRow([
        lead({ level: 'healthy', name: 'storefront', beside: 'shop' }),
        `<span>${pill('healthy', 'Ready')}</span>`,
        '<span class="r">3/3</span>',
        '<span class="r">88d</span>',
      ]),
    ],
  )}</div></div>`
  return spec(
    'Where a resource’s row goes',
    'Lumovi’s own list of its kind, filtered to it exactly',
    `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start"><div class="arr-stack"><p class="cap">The Resources card: the first row under the pointer; the Rollout is a kind the file doesn’t name, so it doesn’t open</p>${card('Resources', '3', rows)}</div><div class="arr-stack"><p class="cap">Pressed: Lumovi’s Deployments, filtered by exact name and namespace</p>${list}</div></div>`,
    `<b>Not built yet:</b> this is docs’ (a) ruling, to be built in Lumovi (the file’s key for the kinds it may open, the Plugins page’s line, the list’s exact filter and its chip) and then in Argo CD’s plugin; until then its rows don’t open. The plugin holds nothing of a Deployment, so a row can’t open its page; <b>it opens Lumovi’s own list of that kind, filtered to it exactly</b>, one row away (docs’ five conditions). <b>The file names the kinds it may open</b> (its own key, never one that reads), and the Plugins page lists them under what the plugin may do: “Its pages may open Lumovi’s lists of Deployments, Services and ConfigMaps.” (plurals in the file’s order; past eight, “…, Secrets and 6 more kinds”, all in its tooltip). <b>A row of a named kind opens</b> on a press, as any Table row that opens: the hover fill and a chevron under the pointer, the whole row the button, the ring from the keyboard. <b>A row of any other kind</b>, or one that’s Missing, is drawn without them and does nothing. <b>The list</b> is Lumovi’s, drawn as always, with one chip at the head of its filters: Argo CD’s mark, then the exact name and namespace, and an × that clears it; a quiet line beside it says how the person got here (docs’ words; the plugin’s name possessive, the kind plural as the list’s title has it). Nothing else of the plugin’s is on that page. If nothing matches (the object is gone, or the person may not see it), the list’s empty state says “No Deployment storefront in shop that you can see.”, true either way. On a phone the card is a card that opens, and the chip wraps under the list’s title.`,
  )
}

/** 3. Its three proposals, each in Lumovi's dialog. */
function argoProposals(): string {
  const refresh = ask({
    title: 'Argo CD asks to change the Application argocd/storefront',
    fields: fld(
      'How',
      kseg(['Normal', 'Hard'], 'Normal'),
      'Hard also asks the repository again, past Argo CD’s cache.',
    ),
    send: `${diff([
      ['', 'metadata:'],
      ['', '  annotations:'],
      ['add', '    argocd.argoproj.io/refresh: normal'],
    ])}${command(
      'kubectl annotate application.argoproj.io/storefront argocd.argoproj.io/refresh=normal --overwrite -n argocd --context production-eu',
    )}${OK}`,
    verb: 'Refresh',
  })
  return spec(
    'Its changes',
    'Sync…, Refresh… and Delete…, each in Lumovi’s own dialog',
    `<div style="display:grid;grid-template-columns:560px minmax(0,1fr);gap:32px;align-items:start">${refresh}<div class="spec" style="gap:10px"><p style="max-width:none"><b>Sync…</b> is the kit’s form frame as drawn (“A form inside Lumovi’s confirmation”): Revision, starting at the target revision; Prune, off; Strategy, Apply or Hook, starting at Hook.</p><p style="max-width:none"><b>Refresh…</b> (left): one choice, How, Normal or Hard, starting at Normal, into the refresh annotation; the verb on the dialog’s button is “Refresh”. A patch that only sets annotations is said as <code>kubectl annotate … --overwrite</code>, one that only sets labels as <code>kubectl label … --overwrite</code> (a removed key as <code>key-</code>); any other patch as <code>kubectl patch</code>.</p><p style="max-width:none"><b>Delete…</b> is Lumovi’s own Delete, its dialog and its typed name, with no fields of the plugin’s. What the finalizer will take with it is said on the page, by Delete…, before the press; the dialog names the finalizer in Lumovi’s words.</p><p style="max-width:none"><b>Two places, on purpose.</b> The tab runs only where a plugin’s pages are offered, and never on a phone, so today’s at-once <b>Sync</b> and <b>Refresh</b> stay on Lumovi’s own list of Applications, for everyone. They differ by their “…”: the list’s Sync syncs to what the application tracks, as it stands, with Lumovi’s usual confirmation; the tab’s Sync… asks for its options first. Same word, same verb, so a person who knows one knows the other.</p></div></div>`,
    '',
  )
}

/** 4. On a phone. */
function argoPhone(): string {
  const appCard = ([name, health, sync, path, target, dest, synced]: App) =>
    `<li><div class="top">${lead({ level: HEALTH[health], name, under: health })}</div><dl class="one">${fact('Sync', sync)}${fact('Repository and path', `github.com/acme/deploy · ${path}`)}${fact('Target revision', target)}${fact('Destination', dest)}${fact('Last synced', synced)}</dl></li>`
  const overview = phoneFrame(
    'Argo CD',
    `<nav class="lts">${ARGO_TABS}</nav><div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('Argo CD', '2.1.0', true)}</div><div class="ptiles">${ARGO_TILES()}</div><div class="sec"><h3>Applications<small>14</small></h3><h4>default <small>1</small></h4><ul class="cards">${appCard(['legacy-batch', 'Degraded', 'Out of sync', 'jobs/legacy-batch', 'main', 'batch', '2h'])}</ul><h4>shop <small>13</small></h4><ul class="cards">${appCard(['payments', 'Progressing', 'Out of sync', 'apps/payments', 'v2.4.1', 'payments', '1d'])}</ul></div>`,
  )
  const tab = phoneFrame(
    'storefront',
    `<nav class="lts">${APP_OBJ_TABS}</nav><div class="pgframe" style="border:0;border-radius:0;box-shadow:none">${whoseStrip('Argo CD', '2.1.0', true)}</div><div class="under">${pill('healthy', 'Healthy')}</div><p class="larger">Open Lumovi on a larger screen to use <b style="font-weight:500;color:var(--text-2)">Delete</b>, <b style="font-weight:500;color:var(--text-2)">Refresh</b> and <b style="font-weight:500;color:var(--text-2)">Sync</b>.</p>${FINALIZER}<div class="ptiles">${appTiles()}</div><div class="sec"><h3>Resources<small>3</small></h3><ul class="cards"><li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Deployment · shop' })}</div><dl>${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li><li><div class="top">${lead({ level: 'healthy', name: 'storefront', under: 'Service · shop' })}</div><dl>${fact('Sync', 'Synced')}${fact('Health', 'Healthy')}</dl></li><li><div class="top">${lead({ name: 'storefront-config', under: 'ConfigMap · shop' })}</div><dl>${fact('Sync', 'Synced')}${fact('Health', '—')}</dl></li></ul></div>`,
    true,
  )
  return `<section class="spec"><h2>On a phone<i>the overview, and the Application’s tab</i></h2><div style="display:flex;gap:24px;align-items:flex-start">${overview}${tab}</div><p style="max-width:820px">The overview: the strip of tabs, the short strip of whose page it is, the three tiles two across (the third alone on its row takes the width), then the applications as cards under their projects. The repository and path doesn’t fit a third, so every fact of these cards takes a line. The tab: the health under the name, then, in the header’s place, <b>Lumovi’s one line naming the three changes</b> in the order the buttons stand, without their “…”; a phone makes none of them, Lumovi’s Delete included, as docs’ phone page says. Under it the plugin’s finalizer line stays: it’s read, not pressed. Then the four tiles two across, and Resources and History as cards; Resources’ facts fit a third, so they stand side by side.</p></section>`
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
  | 'places'
  | 'places-phone'
  | 'marks'
  | 'counts'
  | 'counts-phone'
  | 'cnpg'
  | 'cnpg-phone'
  | 'argo'
  | 'argo-phone'

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
  { id: 'places', title: 'Where a plugin adds things', size: { width: 1440, height: 2400 } },
  { id: 'places-phone', title: 'The same, on a phone', size: { width: 1760, height: 900 } },
  {
    id: 'marks',
    title: 'A text that isn’t Lumovi’s, in a Table',
    size: { width: 1440, height: 900 },
  },
  { id: 'counts', title: 'Counts, Card and Pair', size: { width: 1440, height: 900 } },
  { id: 'counts-phone', title: 'The same, on a phone', size: { width: 920, height: 900 } },
  { id: 'cnpg', title: 'CloudNativePG as a plugin', size: { width: 1440, height: 2400 } },
  { id: 'cnpg-phone', title: 'The same, on a phone', size: { width: 920, height: 900 } },
  { id: 'argo', title: 'Argo CD as a plugin with code', size: { width: 1440, height: 2400 } },
  { id: 'argo-phone', title: 'The same, on a phone', size: { width: 920, height: 1040 } },
]

/** One of the kit's frames, in one theme. */
export function kitFrame(id: KitFrame, scheme: Scheme): string {
  const f = KIT_FRAMES.find((x) => x.id === id)!
  const body =
    id === 'table'
      ? `<header><h1>Table</h1><p>What a plugin lists things with. It grows from the app’s plain-row table and Karpenter’s rows, which are one thing with and without headings. A plugin gives rows as data and names each column and its kind; Lumovi draws them. When the app’s own detail tables move onto it, their rows go from about 32 to 36 px and a long name takes the middle cut where today it wraps: both meant.</p></header>
        <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">${anatomy()}${sorting()}${structure()}${hard()}</div>
        ${states()}${movedRules()}`
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
                  ? `<header><h1>A form inside Lumovi’s confirmation</h1><p>For a plugin’s change that asks for options first. The plugin describes the fields; Lumovi shows them in its own dialog with the change it will make.</p></header>${formStates()}${formMore()}${formOver()}${formHard()}${formHeights()}`
                  : id === 'form-phone'
                    ? formPhone()
                    : id === 'graph'
                      ? `<header><h1>Graph</h1><p>For things that lead to other things: an application’s resources, a workflow’s steps, who talks to whom. A plugin gives cards and lines; Lumovi lays them out, and derives the table from the same data.</p></header>${graphWhole()}${graphHard()}${graphEdges()}${graphTable()}`
                      : id === 'graph-phone'
                        ? graphPhone()
                        : id === 'stopped'
                          ? `<header><h1>Whose page it is, and a page stopped</h1><p>Two things around a plugin’s page that are Lumovi’s and never the plugin’s: the strip that says the page is a plugin’s, and what stands in the page’s place when Lumovi stops it or it stops by itself.</p></header>${stoppedCases()}`
                          : id === 'stopped-phone'
                            ? stoppedPhone()
                            : id === 'places'
                              ? `<header><h1>Where a plugin adds things</h1><p>For a plugin whose file carries code: its own pages, a tab on objects of its own kinds, and commands in the palette. Each page and tab is the door’s (the strip that says whose it is, then the plugin’s frame, or the stopped place); here is where they stand among Lumovi’s own, and how they’re told apart.</p></header>${placesPage()}${placesTabs()}${placesObject()}${placesPalette()}${placesGone()}`
                              : id === 'places-phone'
                                ? placesPhone()
                                : id === 'counts'
                                  ? `<header><h1>Counts, Card and Pair</h1><p>Three parts Karpenter’s overview needs to be drawn from the kit: a share of a whole, the card a part stands in, and two parts side by side.</p></header>${countsWhole()}${cardAbout()}`
                                  : id === 'counts-phone'
                                    ? countsPhone()
                                    : id === 'cnpg'
                                      ? `<header><h1>CloudNativePG, as a plugin</h1><p>Its code draws two pages in Lumovi’s box from the kit’s parts: Clusters, and every cluster’s Backups. Back up now, on a cluster’s header, proposes a Backup through Lumovi’s dialog. It reads its own kinds, and of Kubernetes’ own only the Pods labelled cnpg.io/cluster.</p></header>${pgClusters()}${pgNarrow()}${pgBackupsPage()}`
                                      : id === 'cnpg-phone'
                                        ? pgPhone()
                                        : id === 'argo'
                                          ? `<header><h1>Argo CD, as a plugin with code</h1><p>Its code draws an overview of every Application and a tab on each, from the kit’s parts, and proposes three changes through Lumovi’s dialog. It reads only its own kinds: Applications and AppProjects. Drawn from app’s shape (LMV-279) with its sample: storefront, payments and legacy-batch in the projects default and shop.</p></header>${argoOverview()}${argoTab()}${argoOpens()}${argoProposals()}`
                                          : id === 'argo-phone'
                                            ? argoPhone()
                                            : `<header><h1>Marks</h1><p>How a text that isn’t Lumovi’s shows what can’t be seen or would act: in a Table’s cells, its lead, its headings.</p></header>${marksTable()}`
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${only(PARTS, /^(\* |svg\.i|\.btn)/)}
${only(SHELL, /^\.spill/)}
${CSS}
</style><div class="sheet">${body}</div>`
}
