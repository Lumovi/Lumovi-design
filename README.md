<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="logo/svg/lumovi-logo-on-dark.svg" />
  <img src="logo/svg/lumovi-logo-on-light.svg" alt="Lumovi" height="56" />
</picture>

<br />
<br />

**Lumovi's brand: the logo, app icons, colors, type and media for the app, the website and the
docs.**

[**Guidelines**](guidelines/README.md) · [**Brand book (PDF)**](guidelines/lumovi-brand-guidelines.pdf) · [Logo](#logo) · [App icons](#app-icons) ·
[Colors](#colors) · [Social](#social-and-github) · [Media](#media) ·
[Building](#building-the-assets)

[lumovi.dev](https://lumovi.dev) · [docs.lumovi.dev](https://docs.lumovi.dev)

</div>

<img src="guidelines/images/cover.png" alt="The Lumovi logo, its light glowing over a floor of dots." />

[Lumovi](https://lumovi.dev) is a beautiful, fast Kubernetes dashboard, on your desktop or in
your cluster. It was called KubeStacks. This repository is the source of everything it looks like: every asset is
built from a few files in [`src/`](src), so they all agree, and you can grab whatever you need
from the folders below.

**The idea.** Lumovi is _lumen_ and _view_. The mark, **Sweep**, is a square with **light
sweeping across it** from one corner, the way Lumovi takes in a whole cluster at a glance. It's
drawn only from circles, in black, white and gray. Read more in the
[brand guidelines](guidelines/README.md).

## What's here

| Folder                      | What                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`logo/`](logo)             | The logo, stacked logo, mark and wordmark, as SVG and PNG, in every version; animated marks                         |
| [`icons/app/`](icons/app)   | The app's icons: macOS (PNG, ICNS, Liquid Glass), Windows (ICO, Microsoft Store) and Linux (PNG)                    |
| [`icons/web/`](icons/web)   | Favicons, touch icons, web app icons and a web manifest                                                             |
| [`colors/`](colors)         | The palette and the app's theme tokens: CSS, Tailwind, design tokens, Adobe and GIMP                                |
| [`social/`](social)         | Link previews, GitHub's previews and banner, an avatar, headers, and LinkedIn, YouTube and Product Hunt art         |
| [`media/`](media)           | Wallpapers, the installers' artwork (macOS disk image, Windows installer), and the sponsor card's pictures and spec |
| [`snippets/`](snippets)     | The mark as a React and an Astro component, and the HTML `<head>` tags for the icons                                |
| [`sources/`](sources)       | Video frames and the app's screenshots, from other repositories, that the launch art is made from                   |
| [`guidelines/`](guidelines) | How to use all of it, online and as a 66-page brand book (PDF)                                                      |

## Logo

<img src="guidelines/images/logo-versions.png" alt="The logo in each of its versions." />

Files are named `lumovi-<kind>-<version>`, in [`logo/svg/`](logo/svg) and
[`logo/png/`](logo/png):

| Kind           | What                                      |     | Version    | For                               |
| -------------- | ----------------------------------------- | --- | ---------- | --------------------------------- |
| `logo`         | The mark beside the wordmark: the default |     | `on-dark`  | Two tones, on dark backgrounds    |
| `logo-stacked` | The mark above the wordmark               |     | `on-light` | Two tones, on light backgrounds   |
| `mark`         | The mark alone                            |     | `white`    | One color, on photos and the blue |
| `wordmark`     | The name alone (`white` and `black`)      |     | `black`    | One color, for print              |

In a README, switch between them with the reader's theme:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="lumovi-logo-on-dark.svg" />
  <img src="lumovi-logo-on-light.svg" alt="Lumovi" height="48" />
</picture>
```

[`logo/animated/`](logo/animated) has the mark moving, for splash screens and loading states:
an intro that plays once (the square settles and the light sweeps across it), and a loading
mark whose light breathes. Both hold still for people who
ask for reduced motion.

## App icons

<img src="guidelines/images/app-icons.png" alt="The app icon on macOS, Windows and Linux, and the favicon." />

### In the app

| File                                               | Goes to                                |
| -------------------------------------------------- | -------------------------------------- |
| `icons/app/macos/icon.png`                         | `build/icon.png`                       |
| `icons/app/macos/Lumovi.icon/`                     | `build/Lumovi.icon/`                   |
| `icons/app/windows/icon.png`                       | `build/icon-win.png`                   |
| `icons/app/windows/store/`                         | `build/appx/`                          |
| `icons/app/linux/`                                 | `build/icons/`                         |
| `media/installer/dmg-background.png` and its `@2x` | `build/background.png` and its `@2x`   |
| `media/installer/nsis-sidebar.bmp`                 | `build/installerSidebar.bmp`           |
| `media/installer/nsis-header.bmp`                  | `build/installerHeader.bmp`            |
| `media/sponsor/lumovi-light.png` and `-dark.png`   | `src/renderer/public/sponsor/`         |
| `icons/web/favicon.svg`                            | `src/renderer/public/favicon.svg`      |
| `snippets/react/Logo.tsx`                          | `src/renderer/src/components/Logo.tsx` |
| `colors/tokens.css` (the semantic tokens)          | `src/renderer/src/styles/index.css`    |

electron-builder finds the installer artwork in `build/`, and the Microsoft Store package's
images in `build/appx/`, by those names. The rest goes in `electron-builder.yml`:

```yaml
mac:
  # The Liquid Glass icon. electron-builder compiles it with Xcode's actool (Xcode 26 or
  # later, on the Mac that builds), along with the .icns older versions of macOS show.
  # Without Xcode 26, leave this out and build/icon.png is used.
  icon: build/Lumovi.icon
win:
  icon: build/icon-win.png
linux:
  icon: build/icons
nsis:
  installerHeader: build/installerHeader.bmp
appx:
  # The tiles are transparent, so Start shows them on the tile color Windows picks.
  backgroundColor: transparent
```

`icons/app/macos/icon.icns` is there too, for anything that wants one. The app's window and
dock in development use `build/icon.png`. The Helm chart's `icon` can point here, once this
repository is public:

```yaml
icon: https://raw.githubusercontent.com/Lumovi/Lumovi-design/main/icons/app/macos/icon.png
```

### On the website and in the docs

| File                                | [lumovi.dev](https://lumovi.dev)        | [docs.lumovi.dev](https://docs.lumovi.dev) (Mintlify) |
| ----------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| `icons/web/*`                       | `public/`                               | `favicon.svg`                                         |
| `social/og/lumovi.png`              | `public/og.png`                         |                                                       |
| `social/og/lumovi-docs.png`         |                                         | `og.png`                                              |
| `snippets/astro/LumoviLogo.astro`   | `src/components/logos/LumoviLogo.astro` |                                                       |
| `snippets/html/head.html`           | `src/layouts/Base.astro`                |                                                       |
| `logo/svg/lumovi-logo-on-light.svg` |                                         | `logo/light.svg`                                      |
| `logo/svg/lumovi-logo-on-dark.svg`  |                                         | `logo/dark.svg`                                       |

And in the docs' `docs.json`:

```json
"colors": { "primary": "#2675d3", "light": "#5ea2f0", "dark": "#2675d3" },
"background": { "color": { "light": "#ffffff", "dark": "#0a0a0a" } },
"logo": { "light": "/logo/light.svg", "dark": "/logo/dark.svg", "href": "https://lumovi.dev" },
"favicon": "/favicon.svg",
"seo": { "metatags": { "og:image": "https://docs.lumovi.dev/og.png" } }
```

## Colors

<img src="guidelines/images/palette.png" alt="The palette." />

| Color        | Hex       |     | Color     | Hex       |
| ------------ | --------- | --- | --------- | --------- |
| **Ink**      | `#0a0a0a` |     | **Mist**  | `#d4d4d4` |
| **Graphite** | `#262626` |     | **Paper** | `#ffffff` |
| **Silver**   | `#a3a3a3` |     | **Blue**  | `#2675d3` |

Black, white and true neutral grays carry the brand. Blue is only for what you can act on.

[`colors/`](colors) has them in every form:

- **`tokens.css`**: the palette (`--lumovi-gray-950`, `--lumovi-blue-600`, …) and the app's semantic tokens
  (`--surface`, `--text-1`, `--accent`, …) for light and dark. Dark follows the system unless
  `data-theme` on `<html>` says otherwise, as in the app.
- **`tailwind.css`**: the palette as Tailwind CSS v4 colors (`bg-lumovi-gray-950`).
- **`tokens.json`**: design tokens in the W3C format, for Figma plugins and Style Dictionary.
- **`lumovi.ase`** and **`lumovi.gpl`**: swatches for Adobe apps, and for GIMP and Inkscape.

## Social and GitHub

| File                                             | For                                                                                                                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `social/og/lumovi.png`                           | The link preview for lumovi.dev (2400 × 1260)                                                                                                               |
| `social/og/lumovi-docs.png`                      | The link preview for docs.lumovi.dev                                                                                                                        |
| `social/github/<repository>.png`                 | Each repository's social preview: _Settings → General → Social preview_                                                                                     |
| `social/github/profile-banner-*.png`             | The organization's profile README, in light and dark                                                                                                        |
| `social/avatar.png`                              | The organization's avatar, and on X, Bluesky, Mastodon, Discord, LinkedIn and YouTube                                                                       |
| `social/header.png`                              | The header on X, Bluesky and Mastodon (clear of the avatar)                                                                                                 |
| `social/linkedin/banner-*.png`                   | The LinkedIn company page's cover image, 1128 × 191, clear of the page's logo                                                                               |
| `social/youtube/channel-art-*.png`               | The YouTube channel's banner, 2560 × 1440. TVs show it all, computers the middle band, phones only the middle 1546 × 423, where the title and the mark are  |
| `social/youtube/thumbnails/<video>-*.png`        | Each video's thumbnail, 1280 × 720: `hero`, `incident` ("It's 2 a.m."), `approval` ("It asked first"), `platform` ("Monday") and `map` ("Where's the 503?") |
| `social/product-hunt/thumbnail.png`              | The Product Hunt thumbnail, 240 × 240: the app icon                                                                                                         |
| `social/product-hunt/gallery-<n>-<screen>-*.png` | The Product Hunt gallery, 1270 × 760, in its order, from the app's own screenshots                                                                          |

The launch art comes in dark and light (`-dark`, `-light`): pick one for each account, or one
theme for a whole gallery. It's made from the pictures in [`sources/`](sources), and the videos'
titles, frames and the gallery are set in [`src/launch.ts`](src/launch.ts).

<img src="social/github/lumovi.png" alt="The social preview for the Lumovi repository." width="640" />

## Media

| File                                          | What                                                                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `media/wallpapers/lumovi-desktop-16x9-*.jpg`  | 5120 × 2880, for 16:9 displays, in dark and light                                                                                                                     |
| `media/wallpapers/lumovi-desktop-16x10-*.jpg` | 3456 × 2160, for MacBooks and other 16:10 displays                                                                                                                    |
| `media/wallpapers/lumovi-phone-*.jpg`         | 1290 × 2796, for phones                                                                                                                                               |
| `media/installer/`                            | The macOS disk image's window and the Windows installer's pictures                                                                                                    |
| `media/sponsor/`                              | The sidebar's sponsor card: Lumovi's own pictures, and the spec sponsors get ([README](media/sponsor/README.md)), with a template, a placeholder sponsor and previews |

## Building the assets

Everything outside `src/`, `scripts/` and `sources/` is built, so change the source and build
again rather than editing the files themselves.

```sh
npm ci
npm run build                  # everything (about 30 seconds)
npm run build -- logo icons    # only some of it
npm run build:vector           # only SVG, CSS and JSON, in a second
npm run check                  # whether those are up to date with src/, as CI checks
npm run sources                # take the pictures in sources/ again (see its README)
```

Images are rendered with Chrome, through Playwright: your Google Chrome if you have it, or
Playwright's Chromium (`npx playwright install chromium`). Node.js 24 or later.

| Source                               | What it defines                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| [`src/colors.ts`](src/colors.ts)     | Every color, and the app's theme tokens                                            |
| [`src/health.ts`](src/health.ts)     | The five status levels: their colors, icons, names and motion                      |
| [`src/mark.ts`](src/mark.ts)         | The mark's geometry and how it's painted                                           |
| [`src/wordmark.ts`](src/wordmark.ts) | The wordmark, from Inter Display Semibold, with its spacing                        |
| [`src/logo.ts`](src/logo.ts)         | The lockups and their versions                                                     |
| [`src/icon.ts`](src/icon.ts)         | The app icons, for each platform and size                                          |
| [`src/scene.ts`](src/scene.ts)       | The brand's imagery: social cards, banners, wallpapers                             |
| [`src/launch.ts`](src/launch.ts)     | The launch art: YouTube thumbnails and channel art, Product Hunt's gallery         |
| [`src/sponsor.ts`](src/sponsor.ts)   | The sidebar's sponsor card: its measurements and motion, and the spec sponsors get |
| [`src/book/`](src/book)              | The brand book, page by page                                                       |
| [`scripts/tasks/`](scripts/tasks)    | One task per folder of assets                                                      |

See [CONTRIBUTING.md](CONTRIBUTING.md) to propose a change.

## License

The files and code here are licensed under the [Apache License 2.0](LICENSE). The Lumovi name
and logo are trademarks of the Lumovi project: you're welcome to use them to refer to Lumovi,
as the [guidelines](guidelines/README.md#the-name-and-logo-are-trademarks) describe, but not
for your own products. The fonts are by their authors, under the SIL Open Font License.

<sub>Kubernetes is a registered trademark of the Linux Foundation.</sub>
