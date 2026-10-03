# Lumovi brand guidelines

<img src="images/cover.png" alt="The Lumovi logo, glowing over a floor of dots." />

How Lumovi looks, and how to use its logo, colors and type, whether you're working on the app,
the website or the docs, or writing about Lumovi elsewhere. Every file mentioned here is in this
repository; the [README](../README.md#whats-here) says where each one goes.

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
healthy, what's struggling and where to look first.

The mark is the corner of a view, an **L**, holding an **orb of light**. Together they're also
**Lo**, the start of the name. The orb is the brightest thing in every picture of the brand: it
glows, lights the L from the inside, and lights the floor beneath it.

Lumovi was KubeStacks. The blue and the night it sits on are the same; the stacked layers are
now a light.

## The logo

<img src="images/logo-versions.png" alt="The logo in each of its versions: beside and above the wordmark, the mark alone, the wordmark alone, flat, and in one color." />

| Version                      | Use it for                                                                      | Files                   |
| ---------------------------- | ------------------------------------------------------------------------------- | ----------------------- |
| **Logo** (mark and wordmark) | The first choice: headers, navigation bars, title slides, anything with room.   | `lumovi-logo-*`         |
| **Stacked**                  | Square spaces: a splash screen, a sticker, a slide's center.                    | `lumovi-logo-stacked-*` |
| **Mark**                     | Small or square spaces where the name is already nearby: icons, avatars, a tab. | `lumovi-mark-*`         |
| **Wordmark**                 | Text-only places, and where the mark is already shown.                          | `lumovi-wordmark-*`     |

Each comes in versions for the background it goes on:

- **`on-dark`** and **`on-light`**: in color, with the L lit by the orb. Use these wherever you
  can. On dark backgrounds the orb glows white; on light ones it's bluer, so it keeps its edge.
- **`flat-on-dark`** and **`flat-on-light`**: the same two blues, without gradients, where
  gradients don't reproduce (embroidery, screen printing, some apps' badges).
- **`white`** and **`black`**: one color, for photos, Lumovi Blue, one-color printing, and
  engraving.

The wordmark is "lumovi" in lowercase, lettered from Outfit SemiBold: spaced more tightly than
the font, with a perfectly round dot on the i, level with the top of the l. In color the dot is
blue, a small light like the orb. It's artwork, not text: use the files, and don't retype it.

### Construction

<img src="images/construction.png" alt="The mark on its 48-unit grid: bars 12 wide, the orb 30 across, 6 apart, and the curves that make it." />

The mark is drawn on a 48-unit square. Beside the wordmark it's exactly as tall as the l, sits
on the baseline, and is a third of its height away from it. The source of truth for all of this
is [`src/mark.ts`](../src/mark.ts) and [`src/logo.ts`](../src/logo.ts).

## Using the logo

### Clear space

<img src="images/clear-space.png" alt="The logo with clear space around it equal to half the mark's height." />

Keep space around the logo equal to **half the mark's height** (x), on every side, free of text,
edges and other logos.

### Minimum size

<img src="images/minimum-size.png" alt="The smallest sizes: the logo with a 20-pixel mark, the stacked logo 64 pixels tall, the mark 16 pixels, the wordmark with a 16-pixel l." />

| Version  | Smallest on screen  | Smallest in print |
| -------- | ------------------- | ----------------- |
| Logo     | the mark 20 px tall | the mark 6 mm     |
| Stacked  | 64 px tall          | 18 mm             |
| Mark     | 16 px               | 5 mm              |
| Wordmark | the l 16 px tall    | the l 4 mm        |

Below these sizes, use the mark alone. At 16 pixels it's pixel perfect: every measure of the
mark is a multiple of 3 units, so every straight edge lands on a pixel.

### Backgrounds

<img src="images/backgrounds.png" alt="The logo on Night, on the app's dark and light backgrounds, on Paper, and in white on Lumovi Blue and on a gradient." />

Use the color logo on Night, Paper, and the app's own backgrounds. On Lumovi Blue, photos and
gradients, use the white logo, and make sure what's behind it is quiet and dark enough to read.

### Things to avoid

<img src="images/misuse.png" alt="Eight things not to do: change its colors, stretch it, turn it, add shadows, outline it, flip the mark, set the name in another typeface, and put it where it gets lost." />

Don't change the logo's colors or proportions, turn it, flip it, outline it, add shadows or
effects to it, rearrange its parts, or redraw the wordmark in another typeface. The glow is
part of the app icon and the brand's imagery, not of the logo.

## The app icon

<img src="images/app-icons.png" alt="The app icon on macOS, on Windows and Linux at each size, and the favicon in light and dark browser tabs." />

The mark, lit, on a plate of Night: the orb glows and lights up the night around it.

- **macOS** follows Apple's grid: an 824-pixel plate with continuous corners on a 1024 canvas,
  room for its shadow, and the mark 55% of the plate. For macOS 26 and later there's also a
  **Liquid Glass** icon (`Lumovi.icon`), made of the L and the orb as glass layers, so the
  system can light and tint it in each appearance.
- **Windows and Linux** use the plate edge to edge, as icons there do, and every size is drawn
  for itself: up to 96 pixels the mark is larger and on whole pixels, and at 16 and 20 pixels
  the gap narrows to a single pixel.
- **Favicons** are the mark alone, which reads best at tab size, in the colors for the
  browser's theme.

Use the icon as it is. Don't redraw it, put it on another plate, or use it as the logo in
running text.

## Color

<img src="images/palette.png" alt="The palette: Lumovi Blue, Daylight, Lumen, Night, Ink and Paper, and the blue, night, gray and status scales." />

| Color           | Hex       | Use                                                    |
| --------------- | --------- | ------------------------------------------------------ |
| **Lumovi Blue** | `#2675d3` | The brand color: links, buttons and the logo on light. |
| **Daylight**    | `#3987e5` | Lumovi Blue on dark backgrounds.                       |
| **Lumen**       | `#8cc2ff` | Light itself: the orb, glows and highlights.           |
| **Night**       | `#0a0f1f` | The app icon and dark brand surfaces.                  |
| **Ink**         | `#0b0b0f` | Text, and the one-color logo on light.                 |
| **Paper**       | `#ffffff` | Light backgrounds, and the one-color logo on dark.     |

Blue carries the brand; everything else stays out of its way. Most of what people see is
neutral: the app's grays, with the blue for what you can act on, and the orb's light for what
matters most.

- **Lumovi Blue** is a touch deeper than KubeStacks' `#2a78d6`, so that text in it, and white
  text on it, reach 4.5:1 on white (WCAG AA). For small text on tinted backgrounds, use Blue 700.
- **Status colors** are the app's, and say how things are: good, warning, serious, critical.
  They always come with a word or an icon, never alone, and never decorate.
- The **data colors** for charts (`--series-1` to `--series-8`) are ordered so that neighbors
  stay apart for color-blind readers. Use them in that order.

The palette, and the app's semantic tokens for light and dark, are in [`colors/`](../colors) as
CSS custom properties, a Tailwind theme, design tokens (JSON), and Adobe and GIMP swatches.

## Typography

<img src="images/typography.png" alt="Inter for text, JetBrains Mono for code, and the wordmark." />

- **[Inter](https://rsms.me/inter/)** for everything you read: the app, the website and the
  docs. Headlines use its display optical size, semibold, tracked tight (−0.04em), often with
  the line after the first in gray. Text is regular, at a comfortable 1.5 line height.
- **[JetBrains Mono](https://www.jetbrains.com/lp/mono/)** for code, commands, object names and
  numbers that line up.
- **The wordmark** is lettering, not a font: it's drawn from
  [Outfit](https://fonts.google.com/specimen/Outfit) SemiBold. Don't set Outfit as the brand's
  type.

All three are free and open source (SIL Open Font License).

## Imagery

<img src="../social/og/lumovi.png" alt="A link preview: the headline 'Your clusters, at a glance.' beside the mark, standing on a floor of dots." />

The brand's pictures share one scene: night, a floor of dots running off into the distance (a
cluster's worth of pods, seen from above), and the mark over it, its orb lighting the floor
beneath. It's calm: one light, one subject, and plenty of dark. Social cards, banners,
wallpapers and installer windows are all drawn from it, by [`src/scene.ts`](../src/scene.ts).

For the product itself, show the product: real screenshots of the app, in light and dark.

## Writing about Lumovi

- It's **Lumovi**: one word, capital L. Not LUMOVI, LumoVi or Lumovi App. The lowercase
  "lumovi" is only for the wordmark.
- Lumovi is **a Kubernetes dashboard** you run **on your desktop** (macOS, Windows and Linux),
  or **in your cluster** for your whole team.
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
