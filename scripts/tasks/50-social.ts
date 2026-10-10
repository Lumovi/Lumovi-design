// social/: link previews (Open Graph), GitHub's social previews and profile banner, the
// avatar, a header for X, Bluesky and Mastodon, and the launch's art: a LinkedIn banner,
// YouTube's channel art and video thumbnails, and Product Hunt's thumbnail and gallery.
import { address, description, site, tagline } from '../../src/brand.ts'
import { filled } from '../../src/icon.ts'
import {
  channelArt,
  fileName,
  gallery,
  galleryImage,
  square,
  thumbnail,
  videos,
} from '../../src/launch.ts'
import { document, horizontal, VARIANTS } from '../../src/logo.ts'
import { headline, palette, scene, type Theme } from '../../src/scene.ts'
import { escape } from '../../src/svg.ts'
import { renderHtml, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

const WEBSITE = address(site.website)
const DOCS = address(site.docs)

interface Card {
  width: number
  height: number
  theme?: Theme
  title: string[]
  lead?: string
  /** The type size of the title, in pixels at this card's size. */
  titleSize: number
  /** The address the card is for, as people read it, or none. */
  url?: string
  /** Leave out the logo, and center the copy higher: for headers an avatar overlaps. */
  header?: boolean
  /**
   * Set the mark beside the copy, the two centered as one group, instead of at the right edge:
   * for headers that apps put their buttons over, in the top corners.
   */
  beside?: boolean
}

/**
 * A card: the logo top left, a title and a line under it, and the mark on its floor to the
 * right. Laid out from the card's height, so wide banners and social cards share proportions.
 */
function card({
  width: W,
  height: H,
  theme = 'dark',
  title,
  lead,
  titleSize,
  url,
  header,
  beside,
}: Card): string {
  const u = H / 630
  const pad = 64 * u
  const markSize = beside ? H * 0.4 : Math.min(290 * u, W * 0.26)
  // The copy's left edge; beside it, the mark's right edge is as far from the right.
  const left = header ? W * 0.27 : pad
  const variant = VARIANTS.find((v) => v.name === (theme === 'dark' ? 'on-dark' : 'on-light'))!
  const logo = document(horizontal(variant), 34 * u)
  const c = palette[theme]
  return scene({
    width: W,
    height: H,
    theme,
    mark: {
      x: beside ? W - left - markSize : W - pad - markSize - 28 * u,
      y: (H - markSize) / 2 - 18 * u,
      size: markSize,
    },
    floor: { fadeLeft: true },
    css: `
      .logo { position: absolute; left: ${pad}px; top: ${60 * u}px; }
      .logo svg { display: block; }
      .url {
        position: absolute;
        right: ${pad + 28 * u}px;
        top: ${77 * u}px;
        transform: translateY(-50%);
        font-size: ${19 * u}px;
        font-weight: 500;
        color: ${c.muted};
      }
      .copy .url {
        position: static;
        transform: none;
        margin-top: ${24 * u}px;
        font-size: ${34 * u}px;
        letter-spacing: -0.01em;
        color: ${c.accent};
      }
      .copy {
        position: absolute;
        left: ${left}px;
        top: ${header ? H * 0.42 : H / 2 + 60 * u}px;
        transform: translateY(-50%);
        max-width: ${W * 0.56}px;
      }
      h1 {
        margin: 0;
        font-size: ${titleSize}px;
        font-weight: 650;
        font-variation-settings: 'opsz' 32;
        letter-spacing: -0.04em;
        line-height: 1.02;
      }
      p {
        margin: ${30 * u}px 0 0;
        font-size: ${24 * u}px;
        line-height: 1.45;
        letter-spacing: -0.005em;
        color: ${c.lead};
        max-width: ${560 * u}px;
        text-wrap: balance;
      }`,
    content: `
      ${header ? '' : `<div class="logo">${logo}</div>${url ? `<div class="url">${escape(url)}</div>` : ''}`}
      <div class="copy">
        <h1>${headline(title, theme)}</h1>
        ${lead ? `<p>${escape(lead)}</p>` : ''}
        ${header && url ? `<div class="url">${escape(url)}</div>` : ''}
      </div>`,
  })
}

/** GitHub's social previews, one per repository: 1280 × 640, under 1 MB. */
const REPOSITORIES: Record<string, Pick<Card, 'title' | 'lead' | 'url'>> = {
  lumovi: { title: tagline, lead: description, url: WEBSITE },
  'lumovi-website': {
    url: WEBSITE,
    title: ['Website'],
    lead: "The source of Lumovi's website: what Lumovi does, and where to get it.",
  },
  'lumovi-docs': {
    url: DOCS,
    title: ['Documentation'],
    lead: 'Install Lumovi, connect your clusters, and make the most of every view.',
  },
  'lumovi-design': {
    url: WEBSITE,
    title: ['Brand and design'],
    lead: 'The logo, app icons, colors and media for the app, the website and the docs.',
  },
}

export default {
  name: 'social',
  outputs: ['social'],
  async build(ctx) {
    if (!ctx.raster) return
    const render = (html: string, width: number, height: number, scale = 1) =>
      renderHtml(html, { width, height, scale, transparent: false })

    // Link previews: 1200 × 630, at twice the size for sharp previews on high-density screens.
    await ctx.png(
      'social/og/lumovi.png',
      await render(
        card({
          width: 1200,
          height: 630,
          title: tagline,
          lead: description,
          url: WEBSITE,
          titleSize: 76,
        }),
        1200,
        630,
        2,
      ),
    )
    await ctx.png(
      'social/og/lumovi-docs.png',
      await render(
        card({ width: 1200, height: 630, ...REPOSITORIES['lumovi-docs']!, titleSize: 76 }),
        1200,
        630,
        2,
      ),
    )

    for (const [repo, text] of Object.entries(REPOSITORIES)) {
      await ctx.png(
        `social/github/${repo}.png`,
        await render(card({ width: 1280, height: 640, ...text, titleSize: 78 }), 1280, 640),
      )
    }

    // The organization's profile banner, for its README, in light and dark.
    for (const theme of ['dark', 'light'] as const) {
      await ctx.png(
        `social/github/profile-banner-${theme}.png`,
        await render(
          card({
            width: 1280,
            height: 420,
            theme,
            title: tagline,
            lead: description,
            url: WEBSITE,
            titleSize: 60,
          }),
          1280,
          420,
          2,
        ),
      )
    }

    // A header for X, Bluesky and Mastodon (1500 × 500), and the avatar for all of them and GitHub.
    // Their apps put buttons in its top corners, so the mark comes in beside the words. The
    // address is left out: each profile shows its link just below.
    await ctx.png(
      'social/header.png',
      await render(
        card({
          width: 1500,
          height: 500,
          title: tagline,
          titleSize: 66,
          header: true,
          beside: true,
        }),
        1500,
        500,
        2,
      ),
    )
    await ctx.png('social/avatar.png', await renderSvg(filled(1024, 0.5625), 1024))

    // The launch: in light and dark, so either can be picked for each account.
    for (const theme of ['dark', 'light'] as const) {
      // LinkedIn's company banner. The page's logo sits over its bottom left, so the copy is
      // set in from the left, as on the header for X.
      await ctx.png(
        `social/linkedin/banner-${theme}.png`,
        await render(
          card({
            width: 1128,
            height: 191,
            theme,
            title: tagline,
            url: WEBSITE,
            titleSize: 34,
            header: true,
          }),
          1128,
          191,
        ),
      )
      await ctx.png(
        `social/youtube/channel-art-${theme}.png`,
        await render(channelArt(theme), 2560, 1440),
      )
      for (const video of videos) {
        await ctx.png(
          `social/youtube/thumbnails/${fileName(video)}-${theme}.png`,
          await render(thumbnail(video, theme), 1280, 720),
        )
        await ctx.png(
          `social/square/${fileName(video)}-${theme}.png`,
          await render(square(video, theme), 1080, 1080),
        )
      }
      for (const [i, shot] of gallery.entries()) {
        await ctx.png(
          `social/product-hunt/gallery-${i + 1}-${shot.screen}-${theme}.png`,
          await render(galleryImage(shot, theme), 1270, 760),
        )
      }
    }
    // Product Hunt's thumbnail: the app icon, as small as it gets shown.
    await ctx.png('social/product-hunt/thumbnail.png', await renderSvg(filled(240, 0.6), 240))
  },
} satisfies Task
