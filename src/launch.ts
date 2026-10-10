/**
 * The launch's art, for the accounts Lumovi opens: YouTube's channel art and a thumbnail for
 * each video, and Product Hunt's gallery. They show the real app, from pictures in sources/:
 * frames of the videos, the app's own screenshots, and the pictures the videos are made from.
 */
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { address, site, tagline } from './brand.ts'
import { document, horizontal, VARIANTS } from './logo.ts'
import { FONTS, headline, palette, scene, type Theme } from './scene.ts'
import { escape } from './svg.ts'

const SOURCES = join(import.meta.dirname, '..', 'sources')
const source = (path: string) => pathToFileURL(join(SOURCES, path)).href

/** A part of a picture, in its pixels. */
export interface Crop {
  x: number
  y: number
  width: number
  height: number
}

export interface Video {
  /** The video's id in Lumovi-marketing, and its file name here. */
  id: string
  /** Its title, as on YouTube: the first line bright, the rest quieter. */
  title: string[]
  /** A line under the title, or none. */
  lead?: string
  /** What the thumbnail shows: a frame of the video, or one of the app's screenshots. */
  picture:
    | {
        /** The second its frame in sources/posters/ is taken at (npm run stills). */ second: number
      }
    | { /** A screenshot in sources/screenshots/, in the thumbnail's theme. */ screen: string }
  /** The part of the picture the thumbnail shows: the moment, without a caption. */
  crop: Crop
}

/** The pictures' sizes: the videos' frames, and the app's window at twice the size. */
const FRAME = { width: 1920, height: 1080 }
const SCREENSHOT = { width: 2880, height: 1800 }

/** The videos, in the order of the launch plan, each shown at its telling moment. */
export const videos: Video[] = [
  {
    id: 'hero',
    title: [...tagline],
    // The app itself, as the video's opening shows it: its overview.
    picture: { screen: 'overview' },
    crop: { x: 500, y: 0, width: 1600, height: 1449 },
  },
  {
    id: 'incident',
    title: ['It’s 2 a.m.'],
    lead: 'Checkout is crash-looping.',
    picture: { second: 24 },
    crop: { x: 660, y: 112, width: 800, height: 725 },
  },
  {
    id: 'approval',
    title: ['It asked first.'],
    lead: 'An AI assistant’s fix, approved by you.',
    // Why it asks, the change in red and green, and the Approve button under it.
    picture: { second: 16.6 },
    crop: { x: 564, y: 146, width: 792, height: 717 },
  },
  {
    id: 'platform',
    title: ['Monday.'],
    lead: 'The same app, for your whole team.',
    picture: { second: 30 },
    crop: { x: 100, y: 50, width: 860, height: 779 },
  },
  {
    id: 'map',
    title: ['Where’s the 503?'],
    lead: 'The map shows what’s missing.',
    // The route, and the service it leads to with no pods: the line between them is amber.
    picture: { second: 19 },
    crop: { x: 677, y: 186, width: 560, height: 507 },
  },
  {
    id: 'tour',
    title: ['A tour of', 'the whole app.'],
    lead: 'Nine minutes, one feature at a time.',
    // Command K, open over the overview: the list of everywhere it goes.
    picture: { second: 100 },
    crop: { x: 668, y: 259, width: 584, height: 529 },
  },
]

export interface Shot {
  /** The screen's name in sources/captures/, as Lumovi-marketing captures it for the videos. */
  screen: string
  /** The headline over it: the website's, for the same part of the app. */
  title: [string, string]
  /**
   * Its capture's name, where the gallery has one of its own: the screen in a state whose rows
   * end clear of the image's bottom edge, which cuts the window 697 px down.
   */
  capture?: string
}

/** Product Hunt's gallery, in order: the app's screens, each with what it shows. */
export const gallery: Shot[] = [
  { screen: 'overview', title: ['Your clusters,', 'at a glance.'] },
  { screen: 'workloads', title: ['Made for the day something breaks.', 'Calm on all the others.'] },
  { screen: 'map', title: ['See what it’s connected to.', 'And what’s missing.'] },
  { screen: 'assistant-approval', title: ['Your assistant,', 'with you in charge.'] },
  {
    screen: 'access',
    title: ['Who may do what,', 'and who did.'],
    capture: 'access-gallery',
  },
]

/** The pictures the art is made from, for npm run sources to fetch. */
/**
 * A video's poster on the website: what its player shows before it plays. A bare frame of the
 * video, at the telling moment, rendered without its caption, and cut so the app fills the
 * frame: no backdrop at a side, and a calm band along the bottom, where the browser draws its
 * controls.
 */
export interface Poster {
  /** Its file's name: the video's on the website, with its version. */
  name: string
  /** The video's id in Lumovi-marketing, and the second its frame is taken at. */
  id: string
  second: number
  /** The part of the frame it shows, in the still's pixels; 16:9 from its width. All, if none. */
  crop?: { x: number; y: number; width: number }
}

export const POSTER = { width: 1920, height: 1080 }

export const posters: Poster[] = [
  // The two pods that crash-loop, in their box, with the Deployment they belong to.
  { name: '2am-v2', id: 'incident', second: 24, crop: { x: 1215, y: 215, width: 2460 } },
  // The whole request: why, the change, the command, and Approve.
  { name: 'asked-first-v2', id: 'approval', second: 21, crop: { x: 172, y: 20, width: 3318 } },
  // What each profile may do, with changes lit.
  { name: 'monday-v2', id: 'platform', second: 30, crop: { x: 100, y: 80, width: 3640 } },
  // The app itself, under the video's own line.
  { name: 'hero-v1', id: 'hero', second: 9 },
]

export const sources = {
  // The website's posters: Lumovi-marketing renders them without captions, as poster-<id>-….
  site: posters.flatMap((p) =>
    (['dark', 'light'] as const).map((theme) => ({
      still: `poster-${p.id}-${theme}-${p.second.toFixed(1)}.png`,
      file: `site/${p.id}-${theme}.webp`,
    })),
  ),
  // Each video's frame in both themes: Lumovi-marketing names the light one <id>-light-<second>.
  posters: videos.flatMap((v) =>
    'second' in v.picture
      ? (['dark', 'light'] as const).map((theme) => ({
          still: `${v.id}${theme === 'light' ? '-light' : ''}-${(v.picture as { second: number }).second.toFixed(1)}.png`,
          file: `posters/${v.id}-${theme}.webp`,
        }))
      : [],
  ),
  screenshots: videos
    .flatMap((v) => ('screen' in v.picture ? [v.picture.screen] : []))
    .flatMap((screen) =>
      (['dark', 'light'] as const).map((theme) => `screenshots/${screen}-${theme}.webp`),
    ),
  // The gallery's screens in both themes: Lumovi-marketing names them <screen>-<theme>.png.
  captures: gallery.flatMap((s) =>
    (['dark', 'light'] as const).map((theme) => ({
      capture: `${s.capture ?? s.screen}-${theme}.png`,
      file: `captures/${s.capture ?? s.screen}-${theme}.webp`,
    })),
  ),
}

const logo = (theme: Theme, height: number) =>
  document(horizontal(VARIANTS.find((v) => v.name === `on-${theme}`)!), height)

/** A plain page in a scene's light: the sky, lit from one point, with no mark or floor. */
function page(
  width: number,
  height: number,
  theme: Theme,
  light: [number, number],
  css: string,
  body: string,
) {
  const c = palette[theme]
  return `<!doctype html>
<meta charset="utf-8">
<style>
${FONTS}
html, body { margin: 0; }
body {
  position: relative;
  width: ${width}px;
  height: ${height}px;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: ${c.text};
  -webkit-font-smoothing: antialiased;
  background: radial-gradient(80% 100% at ${light[0] * 100}% ${light[1] * 100}%, ${c.sky[0]} 0%, ${c.sky[1]} 55%, ${c.sky[2]} 100%);
}
.logo svg { display: block; }
.window {
  position: absolute;
  overflow: hidden;
  background: ${theme === 'dark' ? '#0a0a0a' : '#ffffff'};
  box-shadow: 0 0 0 1px ${theme === 'dark' ? 'rgb(255 255 255 / 0.1)' : 'rgb(0 0 0 / 0.1)'},
    0 40px 90px -30px rgb(0 0 0 / ${theme === 'dark' ? 0.8 : 0.35});
}
.window img { position: absolute; display: block; }
h1 {
  margin: 0;
  font-weight: 650;
  font-variation-settings: 'opsz' 32;
  letter-spacing: -0.045em;
  line-height: 1.02;
  text-wrap: balance;
}
${css}
</style>
${body}`
}

/** A picture's crop, scaled to cover a box `width` × `height`, as an <img> inside it. */
function cropped(
  src: string,
  picture: { width: number; height: number },
  crop: Crop,
  width: number,
  height: number,
) {
  const k = Math.max(width / crop.width, height / crop.height)
  const left = width / 2 - (crop.x + crop.width / 2) * k
  const top = height / 2 - (crop.y + crop.height / 2) * k
  return `<img src="${src}" style="left:${left}px;top:${top}px;width:${picture.width * k}px;height:${picture.height * k}px">`
}

/**
 * A video's thumbnail, 1280 × 720: the logo, the title large on the left, and the video's
 * moment in a window running off the right and the bottom. YouTube puts the video's length in
 * the bottom right corner, over the window.
 */
export function thumbnail(v: Video, theme: Theme): string {
  const W = 1280
  const H = 720
  const box = { x: 600, y: 104, width: W - 600, height: H - 104 }
  const c = palette[theme]
  const title = v.title.length > 1 ? headline(v.title, theme) : escape(v.title[0]!)
  const [picture, size] =
    'screen' in v.picture
      ? [source(`screenshots/${v.picture.screen}-${theme}.webp`), SCREENSHOT]
      : [source(`posters/${v.id}-${theme}.webp`), FRAME]
  return page(
    W,
    H,
    theme,
    [0.72, 0.55],
    `
    .logo { position: absolute; left: 72px; top: 64px; }
    .copy { position: absolute; left: 72px; top: 400px; transform: translateY(-50%); width: 480px; }
    h1 { font-size: ${v.title.length > 1 ? 76 : 104}px; }
    p { margin: 26px 0 0; font-size: 30px; line-height: 1.3; letter-spacing: -0.012em; color: ${c.lead}; text-wrap: balance; }
    .window { left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height}px; border-radius: 22px 0 0 0; }`,
    `<div class="logo">${logo(theme, 38)}</div>
    <div class="copy"><h1>${title}</h1>${v.lead ? `<p>${escape(v.lead)}</p>` : ''}</div>
    <div class="window">${cropped(picture, size, v.crop, box.width, box.height)}</div>`,
  )
}

/**
 * A Product Hunt gallery image, 1270 × 760: a headline over the app's screen, in the
 * screen's theme, the window running off the bottom.
 */
export function galleryImage(s: Shot, theme: Theme): string {
  const W = 1270
  const H = 760
  const top = 213
  const box = { x: 70, y: top, width: W - 140, height: H - top }
  return page(
    W,
    H,
    theme,
    [0.5, 0.75],
    `
    .copy { position: absolute; left: 70px; top: 58px; }
    h1 { font-size: 46px; line-height: 1.08; }
    .logo { position: absolute; right: 70px; top: 66px; }
    .window { left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height + 40}px; border-radius: 16px; }`,
    `<div class="copy"><h1>${headline(s.title, theme)}</h1></div>
    <div class="logo">${logo(theme, 30)}</div>
    <div class="window">${cropped(source(`captures/${s.capture ?? s.screen}-${theme}.webp`), SCREENSHOT, { x: 0, y: 0, ...SCREENSHOT }, box.width, (box.width * SCREENSHOT.height) / SCREENSHOT.width)}</div>`,
  )
}

/**
 * YouTube's channel art, 2560 × 1440. TVs show all of it, computers a band 423 pixels tall
 * across the middle, and phones only the middle 1546 × 423, so the title and the mark stay
 * in that part; the scene runs to the edges.
 */
export const SAFE = { x: (2560 - 1546) / 2, y: (1440 - 423) / 2, width: 1546, height: 423 }

export function channelArt(theme: Theme): string {
  const W = 2560
  const H = 1440
  const markSize = 300
  const c = palette[theme]
  return scene({
    width: W,
    height: H,
    theme,
    mark: {
      x: SAFE.x + SAFE.width - markSize - 40,
      y: SAFE.y + (SAFE.height - markSize) / 2 - 10,
      size: markSize,
    },
    floor: { fadeLeft: true },
    css: `
      .copy { position: absolute; left: ${SAFE.x + 40}px; top: ${H / 2}px; transform: translateY(-50%); }
      h1 { margin: 0; font-size: 104px; font-weight: 650; font-variation-settings: 'opsz' 32; letter-spacing: -0.045em; line-height: 1.02; }
      .url { margin-top: 26px; font-size: 34px; font-weight: 500; letter-spacing: -0.01em; color: ${c.accent}; }`,
    content: `<div class="copy"><h1>${headline([...tagline], theme)}</h1><div class="url">${address(site.website)}</div></div>`,
  })
}
