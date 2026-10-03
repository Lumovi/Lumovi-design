// social/: link previews (Open Graph), GitHub's social previews and profile banner, the
// avatar, and a header for X, Bluesky and Mastodon.
import { filled } from '../../src/icon.ts'
import { document, VARIANTS, wordmarkOnly } from '../../src/logo.ts'
import { headline, palette, scene, type Theme } from '../../src/scene.ts'
import { escape } from '../../src/svg.ts'
import { renderHtml, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

const TAGLINE = ['Your clusters,', 'at a glance.']
const LEAD = 'A beautiful, fast Kubernetes dashboard. On your desktop, or in your cluster.'

interface Card {
  width: number
  height: number
  theme?: Theme
  title: string[]
  lead?: string
  /** The type size of the title, in pixels at this card's size. */
  titleSize: number
  /** Leave out the wordmark, and center the copy higher: for headers an avatar overlaps. */
  header?: boolean
}

/**
 * A card: the wordmark top left, a title and a line under it, and the mark on its floor to the
 * right. Laid out from the card's height, so wide banners and social cards share proportions.
 */
function card({
  width: W,
  height: H,
  theme = 'dark',
  title,
  lead,
  titleSize,
  header,
}: Card): string {
  const u = H / 630
  const pad = 64 * u
  const markSize = Math.min(330 * u, W * 0.3)
  const variant = VARIANTS.find((v) => v.name === (theme === 'dark' ? 'on-dark' : 'on-light'))!
  const wordmark = document(wordmarkOnly(variant), 34 * u)
  const c = palette[theme]
  return scene({
    width: W,
    height: H,
    theme,
    mark: { x: W - pad - markSize - 16 * u, y: (H - markSize) / 2 - 10 * u, size: markSize },
    floor: { fadeLeft: true },
    css: `
      .wordmark { position: absolute; left: ${pad}px; top: ${60 * u}px; }
      .wordmark svg { display: block; }
      .copy {
        position: absolute;
        left: ${header ? W * 0.27 : pad}px;
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
      ${header ? '' : `<div class="wordmark">${wordmark}</div>`}
      <div class="copy">
        <h1>${headline(title, theme)}</h1>
        ${lead ? `<p>${escape(lead)}</p>` : ''}
      </div>`,
  })
}

/** GitHub's social previews, one per repository: 1280 × 640, under 1 MB. */
const REPOSITORIES: Record<string, Pick<Card, 'title' | 'lead'>> = {
  lumovi: { title: TAGLINE, lead: LEAD },
  'lumovi-website': {
    title: ['Website'],
    lead: "The source of Lumovi's website: what Lumovi does, and where to get it.",
  },
  'lumovi-docs': {
    title: ['Documentation'],
    lead: 'Install Lumovi, connect your clusters, and make the most of every view.',
  },
  'lumovi-design': {
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
        card({ width: 1200, height: 630, title: TAGLINE, lead: LEAD, titleSize: 76 }),
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
          card({ width: 1280, height: 420, theme, title: TAGLINE, lead: LEAD, titleSize: 60 }),
          1280,
          420,
          2,
        ),
      )
    }

    // A header for X, Bluesky and Mastodon (1500 × 500), and the avatar for all of them and GitHub.
    await ctx.png(
      'social/header.png',
      await render(
        card({ width: 1500, height: 500, title: TAGLINE, titleSize: 66, header: true }),
        1500,
        500,
        2,
      ),
    )
    await ctx.png('social/avatar.png', await renderSvg(filled(1024, 0.5625), 1024))
  },
} satisfies Task
