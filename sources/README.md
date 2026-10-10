# Sources

The pictures the launch art in [`social/`](../social) (LinkedIn, YouTube and Product Hunt) is
made from. They come from other repositories, so unlike the rest of this one they aren't built
here: `npm run sources` takes them again.

| File                                | What                                                                          | From                                                                                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `posters/<video>-<theme>.webp`      | A frame of each video, from its dark and its light version, 1920 × 1080       | [Lumovi-marketing](https://github.com/Lumovi/Lumovi-marketing)'s stills, `<video>-<second>.png` and `<video>-light-<second>.png`, losslessly as WebP                      |
| `screenshots/<screen>-<theme>.webp` | The app's own screenshots, 2880 × 1800                                        | [Lumovi's `docs/screenshots/`](https://github.com/Lumovi/Lumovi/tree/main/docs/screenshots), through jsDelivr, as they're published                                       |
| `captures/<screen>-<theme>.webp`    | The app's screens as the videos show them, 2880 × 1800                        | [Lumovi-marketing](https://github.com/Lumovi/Lumovi-marketing)'s captures, `<screen>-<theme>.png`, at two thirds of their size, losslessly as WebP                        |
| `site/<video>-<theme>.webp`         | The frame each video's poster on the website is cut from, without its caption | [Lumovi-marketing](https://github.com/Lumovi/Lumovi-marketing)'s stills, `poster-<video>-<theme>-<second>.png`, rendered with `REMOTION_CAPTIONS=off`, losslessly as WebP |

Which frame each video's thumbnail uses, the part of it shown, and which screenshots go in the
gallery are set in [`src/launch.ts`](../src/launch.ts).

To take them again, for new screenshots or other frames:

1. In a Lumovi-marketing checkout beside this one (or at `LUMOVI_MARKETING`), render each
   video's frame from its dark and its light version (`npm run stills`), at the second
   `src/launch.ts` has, written to one decimal place: `incident-24.0.png` and
   `incident-light-24.0.png`. `npm run sources` lists the ones it can't find.
2. There too, capture the app's screens for the gallery (`npm run capture`): `overview-dark.png`
   and so on, in `public/captures/`.
3. Here, `npm run sources`, then `npm run build -- social`.
4. Look at the thumbnails again: a different frame may need a different crop.
