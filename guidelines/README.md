# Lumovi brand guidelines

<img src="images/cover.png" alt="The Lumovi logo, its light glowing over a floor of dots." />

How Lumovi looks, and how to use its logo, colors and type, whether you're working on the app,
the website or the docs, or writing about Lumovi elsewhere. Every file mentioned here is in this
repository; the [README](../README.md#whats-here) says where each one goes.

**[The brand book (PDF, 64 pages)](lumovi-brand-guidelines.pdf)** has all of this in more detail,
laid out to read on screen or to print: construction, proportions, every version, color
values and contrast, the type scale, the app icon's anatomy, imagery, motion and voice.

- [The idea](#the-idea)
- [The logo](#the-logo)
- [Using the logo](#using-the-logo)
- [The app icon](#the-app-icon)
- [Color](#color)
- [Typography](#typography)
- [Imagery](#imagery)
- [Writing about Lumovi](#writing-about-lumovi)
- [The name and logo are trademarks](#the-name-and-logo-are-trademarks)

## The idea

Lumovi is _lumen_ and _view_: light on what's happening in your clusters, so you can see what's
healthy, what's struggling and where to look first, at a glance.

The mark is **Sweep**: a square, and **light sweeping across it** from one corner, the way
Lumovi takes in a whole cluster at once. It's drawn only from circles, and set in black, white
and gray, so the product and what it shows come first.

Lumovi was KubeStacks.

## The logo

<img src="images/logo-versions.png" alt="The logo in each of its versions: beside and above the wordmark, the mark alone, the wordmark alone, and in one color." />

| Version                      | Use it for                                                                      | Files                   |
| ---------------------------- | ------------------------------------------------------------------------------- | ----------------------- |
| **Logo** (mark and wordmark) | The first choice: headers, navigation bars, title slides, anything with room.   | `lumovi-logo-*`         |
| **Stacked**                  | Square spaces: a splash screen, a sticker, a slide's center.                    | `lumovi-logo-stacked-*` |
| **Mark**                     | Small or square spaces where the name is already nearby: icons, avatars, a tab. | `lumovi-mark-*`         |
| **Wordmark**                 | Text-only places, and where the mark is already shown.                          | `lumovi-wordmark-*`     |

Each comes in versions for the background it goes on:

- **`on-dark`** and **`on-light`**: in two tones, the light and its shade. Use these wherever
  you can. On dark backgrounds the light is white and the shade dark gray; on light ones the
  light is ink and the shade a pale gray.
- **`white`** and **`black`**: one color, for photos, the blue, one-color printing, and
  engraving. The gap between the light and the shade keeps the mark readable.

The wordmark is "Lumovi" in Inter Display Semibold, the typeface the app is set in, tracked a
little tighter than the font. It's artwork, not text: use the files, and don't retype it. It's
one color, so it comes in white and black.

### Construction

<img src="images/construction.png" alt="The mark on its 48-unit grid: corners of radius 12, the light a quarter circle of radius 30, and the shade starting 6 further out." />

The mark is drawn on a 48-unit square, from circles only. Beside the wordmark it's a little
taller than the capitals (1.24 times) and centered on them, with a gap of a little over a third
of their height. The source of truth for all of this is [`src/mark.ts`](../src/mark.ts) and
[`src/logo.ts`](../src/logo.ts).

## Using the logo

### Clear space

<img src="images/clear-space.png" alt="The logo with clear space around it equal to half the mark's height." />

Keep space around the logo equal to **half the mark's height** (x), on every side, free of text,
edges and other logos.

### Minimum size

<img src="images/minimum-size.png" alt="The smallest sizes: the logo with an 18-pixel mark, the stacked logo 64 pixels tall, the mark 16 pixels, the wordmark with 14-pixel capitals." />

| Version  | Smallest on screen  | Smallest in print |
| -------- | ------------------- | ----------------- |
| Logo     | the mark 18 px tall | the mark 5 mm     |
| Stacked  | 64 px tall          | 18 mm             |
| Mark     | 16 px               | 4 mm              |
| Wordmark | capitals 14 px tall | capitals 3 mm     |

Below these sizes, use the mark alone. At 16 pixels its edges land on whole pixels.

### Backgrounds

<img src="images/backgrounds.png" alt="The logo on Graphite, on the app's dark and light backgrounds, on Paper, and in white on the blue and on a gradient." />

Use the two-tone logo on graphite, paper and the app's own backgrounds. On the blue, on photos
and on gradients, use the white logo, and make sure what's behind it is quiet and dark enough
to read.

### Things to avoid

<img src="images/misuse.png" alt="Eight things not to do: change its colors, stretch it, turn it, add shadows, outline it, flip the mark, set the name in another typeface, and put it where it gets lost." />

Don't color the logo, change its proportions, turn it, flip it (the light always comes from the
bottom left), outline it, add shadows or effects to it, or redraw the wordmark in another
typeface. The glow belongs to the app icon and the brand's imagery, not to the logo.

## The app icon

<img src="images/app-icons.png" alt="The app icon on macOS, on Windows and Linux at each size, and the favicon in light and dark browser tabs." />

The mark, lit, on a plate of graphite: the light glows white, and lights the shade beside it,
brightest along the curve.

- **macOS** follows Apple's grid: an 824-pixel plate with continuous corners on a 1024 canvas,
  room for its shadow, and the mark a little over half the plate. For macOS 26 and later
  there's also a **Liquid Glass** icon (`Lumovi.icon`), with the light and the shade as glass
  layers, so the system can light and tint it in each appearance.
- **Windows and Linux** use the plate edge to edge, as icons there do, and every size is drawn
  for itself: up to 96 pixels the mark is larger, and at 16 and 20 pixels the gap narrows to a
  single pixel.
- **Favicons** are the mark alone, which reads best at tab size, in the colors for the
  browser's theme. `favicon.ico` can't follow the theme, so it's the app icon.

Use the icon as it is. Don't redraw it, put it on another plate, or use it as the logo in
running text.

## Color

<img src="images/palette.png" alt="The palette: Ink, Graphite, Silver, Mist, Paper and Blue, and the gray, blue and status scales." />

| Color        | Hex       | Use                                                  |
| ------------ | --------- | ---------------------------------------------------- |
| **Ink**      | `#0a0a0a` | Text, the logo, and the light in the mark on light.  |
| **Graphite** | `#262626` | Dark surfaces, and the app icon.                     |
| **Silver**   | `#a3a3a3` | Quieter text, and the second line of headlines.      |
| **Mist**     | `#d4d4d4` | Lines, and the mark's shade on light.                |
| **Paper**    | `#ffffff` | Light surfaces, and the logo on dark.                |
| **Blue**     | `#2675d3` | Only for what you can act on: links, buttons, focus. |

The brand is black, white and gray: **true neutral grays**, without a tint, the way Vercel and
Apple present themselves. Color is kept for meaning.

- **Blue** is for what you can act on (links, buttons, focus and selection), as in Apple's
  interfaces. It isn't the brand: never color the logo with it. Text in it, and white text on
  it, reach 4.5:1 on white (WCAG AA); for small text on tinted backgrounds, use Blue 700.
- **Status colors** are the app's, and say how things are: good, warning, serious, critical.
  They always come with a word or an icon, never alone, and never decorate.
- The **data colors** for charts (`--series-1` to `--series-8`) are ordered so that neighbors
  stay apart for color-blind readers. Use them in that order.

The palette, and the app's semantic tokens for light and dark, are in [`colors/`](../colors) as
CSS custom properties, a Tailwind theme, design tokens (JSON), and Adobe and GIMP swatches.

## Typography

<img src="images/typography.png" alt="Inter for everything you read and the wordmark, and JetBrains Mono for code." />

- **[Inter](https://rsms.me/inter/)** for everything you read, and the wordmark: the app, the
  website and the docs. Headlines use its display optical size, semibold, tracked tight
  (−0.045em), often with the line after the first in gray. Text is regular, at a comfortable
  1.5 line height.
- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** for code, commands, object names and
  numbers that line up.

Both are free and open source (SIL Open Font License).

## Imagery

<img src="../social/og/lumovi.png" alt="A link preview: the headline 'Your clusters, at a glance.' beside the mark, standing on a floor of dots." />

The brand's pictures share one scene: graphite, a floor of dots running off into the distance
(a cluster's worth of pods, seen from above), and the mark standing on it, its light falling on
the floor in front. It's calm: one light, one subject, and plenty of dark. Social cards,
banners, wallpapers and installer windows are all drawn from it, by
[`src/scene.ts`](../src/scene.ts).

For the product itself, show the product: real screenshots of the app, in light and dark.

## Writing about Lumovi

- It's **Lumovi**: one word, capital L. Not LUMOVI, LumoVi or Lumovi App.
- Lumovi is **a Kubernetes dashboard** you run **on your desktop** (macOS, Windows and Linux),
  or **in your cluster** for your whole team.
- Link to **[lumovi.dev](https://lumovi.dev)**, and to
  **[docs.lumovi.dev](https://docs.lumovi.dev)** for how to use it. Write the addresses in
  lowercase, without `https://` or `www.`
- Write the way the app talks: plainly, calmly, and to the point. Say what something does, not
  how amazing it is.

## The name and logo are trademarks

The code and the files in this repository are open source (Apache 2.0), but the Lumovi name and
logo identify the Lumovi project, and the license doesn't grant rights to them (see section 6 of
the [license](../LICENSE)).

You're welcome to use the logo to link to or write about Lumovi, in articles, talks, videos
and lists of tools, as long as you follow these guidelines and it's clear the Lumovi project
doesn't endorse you. Don't use the name or logo for your own product, fork, company or domain,
or in a way that suggests it's an official Lumovi project. If you're not sure, open an issue and
ask.
