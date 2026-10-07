// icons/app/: the app's icons for macOS, Windows (with the Microsoft Store) and Linux.
import sharp from 'sharp'
import { liquidGlass, macos, plated } from '../../src/icon.ts'
import { icns, ICNS_TYPES, ico } from '../lib/formats.ts'
import { optimize, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/** The sizes in the Windows icon: what Explorer, the taskbar and Start ask for, at each scale. */
const WINDOWS = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]
/** Linux's hicolor theme sizes. */
const LINUX = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]

/**
 * The Microsoft Store package's sizes, by the names Windows looks for. The target sizes are
 * the icon on the taskbar, in Start and in the title bar, at each display scale.
 */
const TARGETS = [16, 20, 24, 30, 32, 36, 40, 48, 60, 64, 72, 80, 96, 256]
/** The icon carries its own plate, so it's the same with Windows' plate or without, in either theme. */
const FORMS = ['', '_altform-unplated', '_altform-lightunplated']
/**
 * The scaled images, at 100%: each one's size, and the icon's on it. The logos are the icon;
 * the tiles have it in the middle, on transparency, so Start's tile color shows around it.
 */
const SCALED: [name: string, width: number, height: number, icon: number][] = [
  ['StoreLogo', 50, 50, 50],
  ['Square44x44Logo', 44, 44, 44],
  ['Square71x71Logo', 71, 71, 44],
  ['Square150x150Logo', 150, 150, 88],
  ['Wide310x150Logo', 310, 150, 88],
  ['Square310x310Logo', 310, 310, 176],
]
const SCALES = [1, 2, 4]

export default {
  name: 'app-icons',
  outputs: ['icons/app'],
  async build(ctx) {
    // macOS: the 1024 PNG electron-builder takes, every size in an .icns, and the Liquid Glass
    // icon for macOS 26 and later.
    ctx.text('icons/app/macos/icon.svg', macos(1024))
    const glass = liquidGlass()
    ctx.text('icons/app/macos/Lumovi.icon/icon.json', glass.json)
    for (const [name, layer] of Object.entries(glass.layers)) {
      ctx.text(`icons/app/macos/Lumovi.icon/Assets/${name}`, layer)
    }
    ctx.text('icons/app/windows/icon.svg', plated(1024))
    ctx.text('icons/app/linux/icon.svg', plated(1024))
    if (!ctx.raster) return

    const mac = new Map<number, Buffer>()
    for (const size of new Set(ICNS_TYPES.map(([, size]) => size))) {
      mac.set(size, await optimize(await renderSvg(macos(size, `mac-${size}`), size)))
    }
    await ctx.png('icons/app/macos/icon.png', mac.get(1024)!)
    ctx.file('icons/app/macos/icon.icns', icns(mac))

    // Windows and Linux: the plate edge to edge, drawn for each size.
    const store = SCALED.flatMap(([, , , icon]) => SCALES.map((scale) => icon * scale))
    const plates = new Map<number, Buffer>()
    for (const size of new Set([...WINDOWS, ...LINUX, ...TARGETS, ...store])) {
      plates.set(size, await optimize(await renderSvg(plated(size, `plate-${size}`), size)))
    }
    ctx.file(
      'icons/app/windows/icon.ico',
      ico(WINDOWS.map((size) => ({ size, png: plates.get(size)! }))),
    )
    await ctx.png('icons/app/windows/icon.png', plates.get(1024)!)
    for (const size of LINUX)
      await ctx.png(`icons/app/linux/${size}x${size}.png`, plates.get(size)!)

    // The Microsoft Store package, for electron-builder's build/appx/.
    for (const size of TARGETS) {
      for (const form of FORMS) {
        const name = `Square44x44Logo.targetsize-${size}${form}.png`
        await ctx.png(`icons/app/windows/store/${name}`, plates.get(size)!)
      }
    }
    for (const [name, width, height, icon] of SCALED) {
      for (const scale of SCALES) {
        const image = await centered(plates.get(icon * scale)!, width * scale, height * scale)
        await ctx.png(`icons/app/windows/store/${name}.scale-${scale * 100}.png`, image)
      }
    }
  },
} satisfies Task

/** An icon in the middle of a transparent image, on whole pixels. */
async function centered(icon: Buffer, width: number, height: number): Promise<Buffer> {
  const { width: size = 0 } = await sharp(icon).metadata()
  const left = Math.floor((width - size) / 2)
  const top = Math.floor((height - size) / 2)
  if (left === 0 && top === 0) return icon
  return sharp(icon)
    .extend({
      left,
      right: width - size - left,
      top,
      bottom: height - size - top,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()
}
