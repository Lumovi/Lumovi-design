# Sources

The pictures the launch art in [`social/`](../social) (LinkedIn, YouTube and Product Hunt) is
made from. They come from other repositories, so unlike the rest of this one they aren't built
here: `npm run sources` takes them again.

| File                                | What                                   | From                                                                                                                                |
| ----------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `posters/<video>.webp`              | A frame of each video, 1920 × 1080     | [Lumovi-marketing](https://github.com/Lumovi/Lumovi-marketing): `npm run stills -- <video> <second>`, losslessly as WebP            |
| `screenshots/<screen>-<theme>.webp` | The app's own screenshots, 2880 × 1800 | [Lumovi's `docs/screenshots/`](https://github.com/Lumovi/Lumovi/tree/main/docs/screenshots), through jsDelivr, as they're published |

Which frame each video's thumbnail uses, the part of it shown, and which screenshots go in the
gallery are set in [`src/launch.ts`](../src/launch.ts).

To take them again, for new screenshots or other frames:

1. In a Lumovi-marketing checkout beside this one (or at `LUMOVI_MARKETING`), render the
   frames: `npm run stills -- <video> <second>`, with the second written as `src/launch.ts`
   has it, to one decimal place (`npm run stills -- incident 24.0`). `npm run sources` prints
   the ones it can't find.
2. Here, `npm run sources`, then `npm run build -- social`.
3. Look at the thumbnails again: a different frame may need a different crop.
