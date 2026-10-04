// logo/: the mark, the wordmark and the lockups, as SVG and as PNG, in every version, and the
// mark animated.
import { intro, loading } from '../../src/animation.ts'
import {
  document,
  horizontal,
  mark,
  stacked,
  VARIANTS,
  wordmarkOnly,
  type Logo,
  type Variant,
} from '../../src/logo.ts'
import { renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

interface Kind {
  name: string
  variants: Variant[]
  logo: (v: Variant) => Logo
  /** Its height when an SVG is shown at its own size, and in the PNG. */
  height: { svg: number; png: number }
}

/** The wordmark is one color: in white for dark backgrounds, in black for light ones. */
const WORDMARKS = VARIANTS.filter((v) => v.style !== 'color')

const KINDS: Kind[] = [
  { name: 'logo', variants: VARIANTS, logo: horizontal, height: { svg: 48, png: 512 } },
  { name: 'logo-stacked', variants: VARIANTS, logo: stacked, height: { svg: 160, png: 1024 } },
  { name: 'mark', variants: VARIANTS, logo: mark, height: { svg: 128, png: 1024 } },
  { name: 'wordmark', variants: WORDMARKS, logo: wordmarkOnly, height: { svg: 40, png: 512 } },
]

export default {
  name: 'logo',
  outputs: ['logo'],
  async build(ctx) {
    for (const background of ['dark', 'light'] as const) {
      const name = `lumovi-mark-${background === 'dark' ? 'on-dark' : 'on-light'}`
      ctx.text(`logo/animated/${name}-intro.svg`, intro(background, `${name}-intro`))
      ctx.text(`logo/animated/${name}-loading.svg`, loading(background, `${name}-loading`))
    }
    for (const kind of KINDS) {
      for (const v of kind.variants) {
        const name = `lumovi-${kind.name}-${v.name}`
        const logo = kind.logo(v)
        ctx.text(`logo/svg/${name}.svg`, document(logo, kind.height.svg))
        if (ctx.raster) {
          const height = kind.height.png
          const width = Math.round((logo.box.width / logo.box.height) * height)
          await ctx.png(
            `logo/png/${name}.png`,
            await renderSvg(document(logo, height), width, height),
          )
        }
      }
    }
  },
} satisfies Task
