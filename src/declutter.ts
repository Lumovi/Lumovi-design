/**
 * LMV-382: lumovi.dev's first screen (156ef30), decluttered three ways. Each is a change to the
 * live page itself (its own classes, from AgentHero.astro, Nav.astro and ThemeSwitch.astro), so it
 * shows next to today's with nothing else moved. A trims the words, B quiets the picture as well,
 * C leads with the headline as well; a part of one can go without the rest.
 *
 * The story stays: Claude Code asks, Lumovi shows the request, you approve, it's on the record.
 */

export type Level = 'a' | 'b' | 'c'

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

/* One line under both buttons, for a note under each. */
.ah .ctas { flex-wrap: wrap; row-gap: 12px; }
.ah .cta { width: auto !important; min-width: 0 !important; }
.ah .cta .note { display: none !important; }
.ah .ctas .one { flex-basis: 100%; margin: 0; font-size: .8125rem; line-height: 1.5; color: var(--text-3); }

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

/* At 1024, the words and the phone's picture side by side, so the change and Approve are in view. */
@media (min-width: 901px) and (max-width: 1099px) {
  .ah { display: grid; grid-template-columns: minmax(0, 1fr) 358px; column-gap: 48px; align-items: start;
        max-width: calc(1240px + 2 * var(--gutter)); margin-inline: auto; padding-inline: var(--gutter); }
  .ah > .wrap { max-width: none !important; margin: 0 !important; padding-inline: 0 !important; }
  .ah h1 { font-size: 2.75rem !important; }
  .ah h1 .dim { display: block; }
  .ah .row { flex-direction: column; gap: 24px; }
  .ah .picture { padding-top: 0 !important; }
}

/* A phone: the line under both buttons, as above. */
@media (max-width: 900px) {
  .ah .ctas { flex-direction: column; align-items: stretch; }
  .ah .ctas .one { text-align: center; }
}
`

/* The line under both buttons, and the nav's button held back while the hero's are in view. */
const A_SCRIPT = `
(() => {
  const ctas = document.querySelector('.ah .ctas')
  if (!ctas.querySelector('.one')) {
    const p = document.createElement('p')
    p.className = 'one'
    p.textContent = 'Free and open source, for macOS, Windows and Linux.'
    ctas.append(p)
  }
  new IntersectionObserver(([e]) =>
    document.documentElement.toggleAttribute('data-past-hero', !e.isIntersecting && e.boundingClientRect.top < 0),
  ).observe(ctas)
})()
`

/* ——— B: the picture ——— */

const B_CSS = `
/* One window at a time: the terminal while Claude Code works, Lumovi from its ask to the record,
   then both, settled. The one behind stays in place, at a lower light. */
@keyframes q-term {
  0%, ${pc(7.6)} { opacity: 1 }
  ${pc(7.95)}, ${pc(12.4)} { opacity: .4 }
  ${pc(12.8)}, 100% { opacity: 1 }
}
@keyframes q-lum {
  0%, ${pc(7.4)} { opacity: .45 }
  ${pc(7.8)}, 100% { opacity: 1 }
}
.ah .stage .tpos { animation: q-term var(--ah-loop) linear infinite; }
.ah .stage .lpos { animation: q-lum var(--ah-loop) linear infinite; }

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
  .ah .row { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; margin-top: 0 !important; }
  .ah .lead { font-size: 1.0625rem; max-width: 27em; }
  .ah .ctas .one { display: none; }
}
@media (min-width: 1100px) and (max-height: 820px) {
  .ah h1 { font-size: 3.5rem !important; }
  .ah .lead { font-size: 1rem; }
}

/* The nav: the theme switch shows the one choice in force (its others open from it). */
:root[data-theme-pref='system'] [data-theme-switch] [data-value]:not([data-value='system']),
:root[data-theme-pref='light'] [data-theme-switch] [data-value]:not([data-value='light']),
:root[data-theme-pref='dark'] [data-theme-switch] [data-value]:not([data-value='dark']),
[data-theme-switch] .thumb { display: none !important; }
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
      'The two notes under the buttons (four 13 px lines) become one line under both.',
      'At 1024, the phone’s picture goes beside the words, not centred under them, so Approve is on the first screen.',
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
      'Lumovi’s window stays at a lower light while Claude Code works in the terminal (to 7.6 s).',
      'The terminal stays at a lower light from the ask to the record (7.8 s to 12.4 s), when the busiest stretch is Lumovi’s.',
      'Behind the dialog, the app’s own overlay (30% black, 2 px blur), so the window’s cut-off words stop reading.',
    ],
    css: A_CSS + B_CSS,
    script: A_SCRIPT,
  },
  {
    id: 'c',
    name: 'C · Headline first',
    gist: 'B, and the headline leads: two lines, larger than any section heading.',
    removes: [
      'The line under the buttons (the download section says where it runs).',
      'Two of the theme switch’s three icons: it shows the one in force, and opens to the others.',
    ],
    moves: [
      'The headline goes to two lines at up to 72 px, from one at 54, so it leads the page’s 56 px section headings.',
      'The lead and the buttons go beside it, in one column.',
    ],
    quiets: [],
    css: A_CSS + B_CSS + C_CSS,
    script: A_SCRIPT,
  },
]
