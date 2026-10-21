/**
 * LMV-382: lumovi.dev's first screen (156ef30), decluttered three ways. Each is a change to the
 * live page itself (its own classes, from AgentHero.astro, Nav.astro and ThemeSwitch.astro), so it
 * shows next to today's with nothing else moved. A trims the words, B quiets the picture as well,
 * C leads with the headline as well; a part of one can go without the rest. D and E answer Péter's
 * "the header above the claude code and lumovi looks weird. too much texts too many buttons" (via
 * the PM, 2026-10-21): above the windows, one line of headline, one of subline, one primary button
 * and one quiet one, and "Other platforms" as a small link; no tag, no notes.
 *
 * The story stays: Claude Code asks, Lumovi shows the request, you approve, it's on the record.
 */

export type Level = 'a' | 'b' | 'c' | 'd' | 'e'

export interface Variant {
  id: Level
  name: string
  /** One line: what it does to the first screen. */
  gist: string
  removes: string[]
  moves: string[]
  quiets: string[]
  css: string
  /** Run in the page once it's loaded: what CSS alone can't do. */
  script: string
}

/** The loop's seconds, as a keyframe's percent. */
const pc = (s: number) => `${+((s / 17) * 100).toFixed(2)}%`

/* ——— A: the words ——— */

const A_CSS = `
/* One primary button on the first screen: the nav's comes in once the hero's have gone by. */
[data-nav] .run { transition: opacity .2s, visibility .2s; }
:root:not([data-past-hero]) [data-nav] .run { opacity: 0; visibility: hidden; }

/* The button downloads; the version is the download section's to give. */
.ah .ctas .tag { display: none !important; }

/* The words over the terminal, the buttons over Lumovi's window: the picture's two columns
   (548 and 596 of its 1160). */
@media (min-width: 1100px) {
  .ah .row { display: grid; grid-template-columns: 47.24% minmax(0, 1fr); column-gap: 1.38%; }
}

/* One line under both buttons, for a note under each: what Download gets you, and the way to the
   other platforms ("For macOS on Apple silicon, 193 MB. Other platforms"). The cluster's note goes. */
.ah .ctas { flex-wrap: wrap; row-gap: 12px; }
.ah .cta { width: auto !important; min-width: 0 !important; }
.ah .cta ~ .cta .note { display: none !important; }
.ah .ctas .one { flex-basis: 100%; }
.ah .ctas .one .note { min-height: 0 !important; padding-left: 0 !important; margin: 0; }

/* The headline says it and the picture shows it: no caption under it. */
.ah .caption { display: none !important; }

/* The rhythm, on eights: 48 from the nav, 24 under the headline, 32 to the picture. */
.ah { padding-top: calc(64px + 32px) !important; }
.ah .row { margin-top: 24px !important; }
.ah .picture { padding-top: 32px !important; }

/* A short screen (1280×800): closer above the picture, so its last beat, the record, is in view. */
@media (min-width: 1100px) and (max-height: 820px) {
  .ah { padding-top: calc(64px + 24px) !important; }
  .ah .row { margin-top: 16px !important; }
  .ah .picture { padding-top: 24px !important; }
}

.ah h1 br.q { display: none; }

/* At 1024, the words and the phone's picture side by side, so the change and Approve are in view;
   the headline on four lines at 54 px, over the h2s' 50. */
@media (min-width: 901px) and (max-width: 1099px) {
  .ah { display: grid; grid-template-columns: minmax(0, 1fr) 358px; column-gap: 48px; align-items: start;
        max-width: calc(1240px + 2 * var(--gutter)); margin-inline: auto; padding-inline: var(--gutter); }
  .ah > .wrap { max-width: none !important; margin: 0 !important; padding-inline: 0 !important; }
  .ah h1 { font-size: 3.375rem !important; }
  .ah h1 .dim { display: block; }
  .ah h1 br.q { display: inline; }
  .ah .row { flex-direction: column; gap: 24px; }
  .ah .picture { padding-top: 0 !important; }
}

/* A phone: Download's line stays under Download, as today; the cluster's note goes. */
@media (max-width: 900px) {
  .ah .ctas { flex-direction: column; align-items: stretch; }
  .ah .ctas .one { order: 1; margin-top: -4px; }
  .ah .ctas .cta ~ .cta { order: 2; }
}
`

/* Download's note to a line under both buttons; the headline's breaks for 1024; and the nav's
   button held back while the hero's are in view. */
const A_SCRIPT = `
(() => {
  const ctas = document.querySelector('.ah .ctas')
  if (!ctas.querySelector('.one')) {
    const one = document.createElement('div')
    one.className = 'one'
    one.append(...ctas.querySelectorAll('.cta:first-child .note'))
    ctas.append(one)
    const h1 = document.querySelector('.ah h1')
    h1.innerHTML = h1.innerHTML.replace('Your agent ', 'Your agent <br class="q">').replace('You approve ', 'You approve <br class="q">')
  }
  new IntersectionObserver(([e]) =>
    document.documentElement.toggleAttribute('data-past-hero', !e.isIntersecting && e.boundingClientRect.top < 0),
  ).observe(ctas)
})();
`

/* ——— B: the picture ——— */

const B_CSS = `
/* One window at a time: the terminal while Claude Code works, Lumovi from its ask to the record,
   then both, settled. The one behind stays in place, out of focus: on a light page a little faded
   and softened (faded further, the dark terminal turns a grey slab that looks disabled); on a dark
   one, at a lower light. */
@keyframes q-term-l {
  0%, ${pc(7.6)} { opacity: 1; filter: blur(0) }
  ${pc(7.95)}, ${pc(12.4)} { opacity: .72; filter: blur(1px) }
  ${pc(12.8)}, 100% { opacity: 1; filter: blur(0) }
}
@keyframes q-lum-l {
  0%, ${pc(7.4)} { opacity: .72; filter: blur(1px) }
  ${pc(7.8)}, 100% { opacity: 1; filter: blur(0) }
}
@keyframes q-term-d {
  0%, ${pc(7.6)} { opacity: 1 }
  ${pc(7.95)}, ${pc(12.4)} { opacity: .4 }
  ${pc(12.8)}, 100% { opacity: 1 }
}
@keyframes q-lum-d {
  0%, ${pc(7.4)} { opacity: .45 }
  ${pc(7.8)}, 100% { opacity: 1 }
}
.ah .stage .tpos { animation: q-term-l var(--ah-loop) linear infinite; }
.ah .stage .lpos { animation: q-lum-l var(--ah-loop) linear infinite; }
:root[data-theme='dark'] .ah .stage .tpos { animation-name: q-term-d; }
:root[data-theme='dark'] .ah .stage .lpos { animation-name: q-lum-d; }

/* Behind the dialog, the app's own overlay: black at 30% and a 2 px blur (ApprovalCenter.tsx),
   so the window's cut-off words stop reading as words. */
.ah .scrim { background: rgb(0 0 0 / .3) !important; backdrop-filter: blur(2px); }
`

/* ——— C: the headline ——— */

const C_CSS = `
/* The page's one h1 leads its h2s (56 px): two lines, at up to 72. */
@media (min-width: 1100px) {
  .ah h1 { font-size: clamp(3.5rem, 1rem + 3.9vw, 4.5rem) !important; line-height: 1 !important; }
  .ah h1 .dim { display: block; }
  .ah .words { display: grid; grid-template-columns: max-content minmax(0, 1fr); column-gap: 56px; align-items: end; }
  .ah .row { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; margin-top: 0 !important; }
  .ah .lead { font-size: 1.0625rem; max-width: 27em; }
  .ah .ctas { row-gap: 8px; }
}
/* A short screen (1280×800): 60 px still leads the h2s' 56, and the record stays in view. */
@media (min-width: 1100px) and (max-height: 820px) {
  .ah h1 { font-size: 3.75rem !important; }
  .ah .lead { font-size: 1rem; }
  .ah .row { gap: 12px; }
  .ah .picture { padding-top: 16px !important; }
}
`

/* ——— D and E: one line each, above the picture ——— */

const D_CSS = `
/* The section headings top out at 48 (from 56), so the one-line headline leads them at every size. */
:root { --step-h2: clamp(2.125rem, 1rem + 2.6vw, 3rem); }

/* No notes and no line under the buttons: Download, a quiet way into the cluster, and a small link
   to the other platforms, in one row. */
.ah .cta .note, .ah .ctas .one { display: none !important; }
.ah .ctas { flex-wrap: nowrap; align-items: center; gap: 12px; }
.ah .ctas .other { font-size: .8125rem; color: var(--text-3); text-decoration: underline;
  text-underline-offset: 3px; text-decoration-color: color-mix(in srgb, currentColor 40%, transparent); margin-right: 12px; white-space: nowrap; }
.ah .ctas .other:hover { color: var(--text-1); }
.ah .btn-secondary.quiet {
  background: transparent !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 16%, transparent) !important;
}

@media (min-width: 1100px) {
  /* The headline on one line, as large as the column allows, up to 57 px. */
  .ah h1 { font-size: min(calc((100vw - 2 * var(--gutter)) / 21.6), 3.59rem) !important; white-space: nowrap; }
  .ah .row { display: block !important; margin-top: 16px !important; }
  /* One line where it fits (1200 px and up); under that it wraps to two, never past the column. */
  .ah .lead { max-width: none; }
  .ah .ctas { margin-top: 24px; }
}
/* A short screen (1280×800): closer, so the record stays in view. */
@media (min-width: 1100px) and (max-height: 820px) {
  .ah .ctas { margin-top: 16px; }
  .ah .picture { padding-top: 20px !important; }
}
@media (max-width: 900px) {
  .ah .ctas { flex-direction: column; align-items: stretch; gap: 10px; }
  .ah .ctas .other { order: 1; align-self: center; margin: -2px 0 2px; }
  .ah .ctas .cta ~ .cta { order: 2; }
  .ah .cta .btn { width: 100%; justify-content: center; }
}
`

/* The one-line subline, the quiet second button, and the small link after Download. */
const D_SCRIPT = `
(() => {
  document.querySelector('.ah .lead').textContent =
    'Lumovi is a Kubernetes dashboard with a built-in MCP server. Your agent works through it as you, and by default each change waits for you.'
  const ctas = document.querySelector('.ah .ctas')
  ctas.querySelector('.btn-secondary').classList.add('quiet')
  if (!ctas.querySelector('.other')) {
    const a = document.createElement('a')
    a.className = 'other'
    a.href = '#download'
    a.textContent = 'Other platforms'
    ctas.querySelector('.cta').after(a)
  }
})();
`

const E_CSS = `
/* Centred: the headline, its line and the row of buttons on the picture's middle. */
@media (min-width: 1100px) {
  .ah .words { text-align: center; }
  .ah .ctas { justify-content: center; }
  .ah .ctas .other { margin-right: 4px; }
}
`

export const VARIANTS: Variant[] = [
  {
    id: 'a',
    name: 'A · Trim the words',
    gist: 'The same layout, with fewer things around the headline.',
    removes: [
      'The nav’s blue “Run in your cluster” while the hero’s own is on screen: one primary button, not two, and the label once, not twice. It comes in as you scroll past.',
      'The version tag in the Download button (the download section has it).',
      'The caption under the picture: the headline says it and the picture shows it.',
    ],
    moves: [
      'The two notes under the buttons (four 13 px lines) become one line under both: what Download gets you, and “Other platforms”. The cluster button’s note goes.',
      'At 1024, the phone’s picture goes beside the words, not centred under them, so Approve is on the first screen; the headline goes to four lines at 54 px, over the h2s’ 50.',
    ],
    quiets: ['The gaps on eights: 48 from the nav, 24 under the headline, 32 to the picture.'],
    css: A_CSS,
    script: A_SCRIPT,
  },
  {
    id: 'b',
    name: 'B · One window at a time',
    gist: 'A, and the picture lights one window at a time.',
    removes: [],
    moves: [],
    quiets: [
      'Lumovi’s window is out of focus while Claude Code works in the terminal (to 7.6 s): at 72% and a 1 px blur on a light page, at 45% on a dark one.',
      'The terminal is out of focus from the ask to the record (7.8 s to 12.4 s), when the busiest stretch is Lumovi’s: at 72% and a 1 px blur on a light page, at 40% on a dark one.',
      'Behind the dialog, the app’s own overlay (30% black, 2 px blur), so the window’s cut-off words stop reading.',
    ],
    css: A_CSS + B_CSS,
    script: A_SCRIPT,
  },
  {
    id: 'c',
    name: 'C · Headline first',
    gist: 'B, and the headline leads: two lines, larger than any section heading.',
    removes: [],
    moves: [
      'The headline goes to two lines at up to 72 px (60 on a short screen), from one at 54, so it leads the page’s 56 px section headings.',
      'The lead, the buttons and Download’s line go beside it, in one column.',
    ],
    quiets: [],
    css: A_CSS + B_CSS + C_CSS,
    script: A_SCRIPT,
  },
  {
    id: 'd',
    name: 'D · One line each',
    gist: 'Above the windows: one line of headline, one of subline, and one row: Download, a small link, a quiet button.',
    removes: [
      'Both notes under the buttons, and the line A puts in their place.',
      'The version tag in Download.',
      'The nav’s blue “Run in your cluster” while the hero’s is on screen (as A).',
      'The caption under the picture (as A).',
    ],
    moves: [
      'The lead becomes one line from 1200 px up: “Lumovi is a Kubernetes dashboard with a built-in MCP server. Your agent works through it as you, and by default each change waits for you.” (marketing’s wording, 2026-10-21).',
      '“Other platforms” becomes a small link right after Download.',
    ],
    quiets: [
      '“Run in your cluster” becomes a quiet button: no fill, a hairline ring.',
      'The section headings top out at 48 px (from 56), so the one-line headline (57 px at 1440) leads them at every size.',
    ],
    css: A_CSS + D_CSS,
    script: A_SCRIPT + D_SCRIPT,
  },
  {
    id: 'e',
    name: 'E · One line each, centred',
    gist: 'D, centred over the picture.',
    removes: [],
    moves: ['The headline, its line and the row of buttons are centred over the two windows.'],
    quiets: [],
    css: A_CSS + D_CSS + E_CSS,
    script: A_SCRIPT + D_SCRIPT,
  },
]
