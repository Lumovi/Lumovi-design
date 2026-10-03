// icons/app/: the app's icons for macOS, Windows and Linux.
import { macos, plated } from '../../src/icon.ts'
import { icns, ICNS_TYPES, ico } from '../lib/formats.ts'
import { optimize, renderSvg } from '../lib/render.ts'
import type { Task } from '../lib/task.ts'

/** The sizes in the Windows icon: what Explorer, the taskbar and Start ask for, at each scale. */
const WINDOWS = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256]
/** Linux's hicolor theme sizes. */
const LINUX = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]

export default {
  name: 'app-icons',
  outputs: ['icons/app'],
  async build(ctx) {
    // macOS: the 1024 PNG electron-builder takes, and every size in an .icns.
    ctx.text('icons/app/macos/icon.svg', macos(1024))
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
    const plates = new Map<number, Buffer>()
    for (const size of new Set([...WINDOWS, ...LINUX])) {
      plates.set(size, await optimize(await renderSvg(plated(size, `plate-${size}`), size)))
    }
    ctx.file(
      'icons/app/windows/icon.ico',
      ico(WINDOWS.map((size) => ({ size, png: plates.get(size)! }))),
    )
    await ctx.png('icons/app/windows/icon.png', plates.get(1024)!)
    for (const size of LINUX)
      await ctx.png(`icons/app/linux/${size}x${size}.png`, plates.get(size)!)
  },
} satisfies Task
