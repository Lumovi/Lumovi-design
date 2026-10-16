/**
 * lumovi.dev's tour section (LMV-347): the 10-minute tour after "Lumovi in a minute", before the
 * clusters scene, at #tour. The website draws it in its own markup, with its plain film player
 * (Film.astro, scripts/film.ts) and global .eyebrow, .h2 and .lead; this is how it should look.
 * The mock-up puts this markup into the live site's build, after [data-hero-film], in both themes
 * and on a phone.
 *
 * Two layouts for Péter to choose from: `beside`, the chapters at the film's right as tall as it
 * is, and `under`, the film as wide as the site's other films with the chapters in three columns
 * beneath. On a phone both stack, and the chapters fold after five.
 */
import { escape } from './svg.ts'

/** The tour's chapters, as Lumovi-marketing/out/tour/chapters.txt has them. */
export const CHAPTERS: { time: string; title: string }[] = [
  { time: '0:00', title: 'What Lumovi is' },
  { time: '0:30', title: 'Getting started' },
  { time: '0:57', title: 'The overview' },
  { time: '1:25', title: 'Alerts and events' },
  { time: '1:50', title: 'Finding things' },
  { time: '2:17', title: 'Lists and details' },
  { time: '2:47', title: 'Windows and the tabs below' },
  { time: '3:07', title: 'The Map' },
  { time: '3:32', title: 'Debugging' },
  { time: '4:25', title: 'Changing things safely' },
  { time: '5:05', title: 'Usage and right-sizing' },
  { time: '5:32', title: 'Helm' },
  { time: '6:05', title: 'Plugins' },
  { time: '6:42', title: 'Plugins with pages of their own' },
  { time: '7:27', title: 'AI agents' },
  { time: '8:02', title: 'In your cluster' },
  { time: '8:32', title: 'A fleet of clusters' },
  { time: '8:55', title: 'The audit log' },
  { time: '9:20', title: 'Trust' },
  { time: '9:45', title: 'Free and open source' },
]

/** Chapters a phone shows before "All 20 chapters". */
export const SHOWN_ON_A_PHONE = 5

export type TourLayout = 'beside' | 'under'

const seconds = (time: string) => {
  const [m, s] = time.split(':').map(Number)
  return m! * 60 + s!
}

/**
 * The section's words, its film and its chapters. `current` lights a chapter, as playing does;
 * `open` unfolds a phone's list.
 */
export function tourSection(
  layout: TourLayout,
  o: { current?: number; open?: boolean } = {},
): string {
  const rows = CHAPTERS.map(
    (c, i) =>
      `<li${i >= SHOWN_ON_A_PHONE ? ' class="later"' : ''}${i === o.current ? ' aria-current="true"' : ''}><button type="button" data-at="${seconds(c.time)}"><time>${c.time}</time><span>${escape(c.title)}</span></button></li>`,
  ).join('')
  return `<section class="tour ${layout}" id="tour" aria-labelledby="tour-title">
  <div class="wrap">
    <div class="t-head">
      <div class="t-intro">
        <span class="eyebrow">The tour</span>
        <h2 class="h2" id="tour-title">See it in 10 minutes. <span class="dim">Every part of Lumovi, in order.</span></h2>
      </div>
      <p class="lead t-lead">Twenty chapters, one for each part of the app. Start at the top, or jump to the part you came for.</p>
    </div>
    <div class="t-body">
      <figure class="t-film">
        <video controls playsinline preload="none" width="1920" height="1080" aria-label="The tour: a video, with sound"></video>
        <figcaption>
          <span class="title">The tour</span>
          <span class="about">Lumovi from your first cluster to a fleet.</span>
          <span class="length">10 min, with sound and captions.</span>
        </figcaption>
      </figure>
      <nav class="t-chapters" aria-label="The tour’s chapters"${o.open ? '' : ' data-folded'}>
        <ol>${rows}</ol>
        <button type="button" class="t-more" aria-expanded="${o.open ? 'true' : 'false'}">${o.open ? 'Fewer chapters' : `All ${CHAPTERS.length} chapters`}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
      </nav>
    </div>
  </div>
</section>
<style>${CSS}</style>`
}

/** In the site's tokens (src/styles/global.css there), beside its .wrap, .eyebrow, .h2 and .lead. */
export const CSS = `
.tour { padding-block: clamp(64px, 9vw, 120px) clamp(24px, 4vw, 48px); scroll-margin-top: 72px; }
.t-head { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); align-items: end; gap: 1.25rem 4rem; margin-bottom: clamp(28px, 3.5vw, 44px); }
.t-intro { display: grid; gap: 1.1rem; }
.tour .h2 .dim { display: block; }
.t-lead { font-size: 1.0625rem; }

/* The film: Film.astro's player, poster and caption. */
.t-film { display: grid; gap: 14px; margin: 0; }
.t-film video { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; border-radius: clamp(10px, 1.2vw, 16px); background: var(--surface); box-shadow: var(--shadow-window); }
.t-film figcaption { display: flex; flex-wrap: wrap; gap: 2px 10px; font-size: 0.875rem; color: var(--text-2); }
.t-film .title { font-weight: 600; color: var(--text-1); }
.t-film .length { color: var(--text-3); }

/* The chapters, a quiet table of contents: a press jumps the film there and plays it, and the
   chapter it's in is lit. */
.t-chapters ol { margin: 0; padding: 0; list-style: none; }
.t-chapters li button { display: grid; grid-template-columns: 3.4em 1fr; align-items: center; width: 100%; padding: 0 10px; border: 0; border-radius: 8px; background: none; font: inherit; font-size: 0.875rem; text-align: left; color: var(--text-2); cursor: pointer; }
.t-chapters li button:hover { background: var(--tint); color: var(--text-1); }
.t-chapters time { font-variant-numeric: tabular-nums; color: var(--text-3); }
.t-chapters li[aria-current] button { position: relative; color: var(--text-1); background: var(--tint); }
.t-chapters li[aria-current] time { color: var(--accent-strong); }
.t-chapters li[aria-current] button::before { content: ''; position: absolute; left: 0; top: 7px; bottom: 7px; width: 2px; border-radius: 2px; background: var(--accent-strong); }
.t-more { display: none; }

/* Beside: twenty rows as tall as the film (800 × 450 at 1440, so 22.5 px each). */
.beside .t-body { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 0 clamp(24px, 3vw, 40px); align-items: start; }
.beside .t-chapters li button { height: calc((min(100vw - 2 * var(--gutter), var(--max)) - clamp(24px, 3vw, 40px)) * 2 / 3 * 9 / 16 / 20); min-height: 21px; }

/* Under: the film at the site's 960, the chapters in three columns beneath. */
.under .t-body { max-width: 960px; margin-inline: auto; display: grid; gap: 28px; }
.under .t-chapters { padding-top: 22px; border-top: 1px solid var(--line); }
.under .t-chapters ol { columns: 3; column-gap: 28px; }
.under .t-chapters li { break-inside: avoid; }
.under .t-chapters li button { height: 32px; }

/* A phone: one column, rows a thumb can hit, five shown until "All 20 chapters". */
@media (max-width: 760px) {
  .t-head { grid-template-columns: 1fr; }
  .beside .t-body, .under .t-body { grid-template-columns: 1fr; gap: 20px; }
  .under .t-chapters { padding-top: 0; border-top: 0; }
  .under .t-chapters ol { columns: 1; }
  .t-chapters li button, .beside .t-chapters li button, .under .t-chapters li button { height: 44px; padding: 0 12px; border-radius: 0; font-size: 0.9375rem; }
  .t-chapters ol { border-top: 1px solid var(--line); }
  .t-chapters li { border-bottom: 1px solid var(--line); }
  .t-chapters[data-folded] li.later { display: none; }
  .t-more { display: inline-flex; align-items: center; gap: 6px; height: 44px; margin-top: 4px; padding: 0 12px; border: 0; background: none; font: inherit; font-size: 0.9375rem; font-weight: 500; color: var(--text-1); cursor: pointer; }
  .t-chapters:not([data-folded]) .t-more svg { transform: rotate(180deg); }
}`
