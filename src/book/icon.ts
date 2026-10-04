// 06 App icon: its anatomy, the Liquid Glass layers, the sizes for Windows and Linux, the web's
// icons, and how to use them.
import { gray, INK, PAPER, status } from '../colors.ts'
import { liquidGlass, MACOS_MARK, PLATE_STOPS } from '../icon.ts'
import { head, list, logo, specs, verdict, type Assets, type Section } from './kit.ts'

export function iconSection(a: Assets): Section {
  // Where the parts of the macOS icon are, on its 1024 canvas.
  const at = (x: number, y: number) => ({ x, y })
  const k = MACOS_MARK / 48
  const m0 = (1024 - MACOS_MARK) / 2
  const parts = [
    {
      ...at(190, 190),
      name: 'Plate',
      spec: `Graphite, ${PLATE_STOPS[0]} to ${PLATE_STOPS[1]}, top to bottom. 824 px with continuous corners.`,
    },
    {
      ...at(m0 + 13 * k, m0 + 35 * k),
      name: 'Light',
      spec: 'White, warming to #efefef at its edge. The brightest thing in the icon.',
    },
    {
      ...at(m0 + 23.3 * k, m0 + 24.7 * k),
      name: 'Glow',
      spec: 'The light, blurred and kept inside the square, so its edges stay sharp.',
    },
    {
      ...at(m0 + 36 * k, m0 + 12 * k),
      name: 'Shade',
      spec: 'A veil of white, 36% along the curve fading to 13% at the far corner.',
    },
    {
      ...at(924, 512),
      name: 'Edge',
      spec: 'A hairline of white at 12%, so the plate holds its shape on dark docks.',
    },
    {
      ...at(512, 940),
      name: 'Shadow',
      spec: 'Black at 32%, 10 px down and 12 px soft, as Apple’s template has.',
    },
  ]
  const size = 600
  const s = size / 1024
  const marker = (i: number, x: number, y: number) =>
    `<div style="position:absolute;left:${x * s - 14}px;top:${y * s - 14}px;width:28px;height:28px;border-radius:14px;background:${PAPER};color:${INK};font-size:13px;font-weight:650;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${INK}, 0 2px 8px rgb(0 0 0 / 0.3)">${i}</div>`
  const glass = liquidGlass()
  const layer = (svg: string, name: string, note: string) => `
    <div class="col" style="gap:10px;flex:1;align-items:center">
      <div style="width:200px;height:200px;border-radius:44px;overflow:hidden;background:repeating-conic-gradient(#2a2a2a 0 25%, #1f1f1f 0 50%) 0 0/20px 20px">${svg.replace(/width="1024" height="1024"/, 'width="200" height="200" style="display:block"')}</div>
      <div style="font-size:15px;font-weight:600">${name}</div>
      <div class="small" style="text-align:center;max-width:220px">${note}</div>
    </div>`
  const fill = `<svg viewBox="0 0 1024 1024" width="1024" height="1024"><defs><linearGradient id="book-glass-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PLATE_STOPS[0]}"/><stop offset="1" stop-color="${PLATE_STOPS[1]}"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#book-glass-fill)"/></svg>`
  const sizes = [16, 24, 32, 48, 64, 96, 128, 256]
  const tab = (theme: 'light' | 'dark') => {
    const bg = theme === 'light' ? PAPER : '#2b2b2e'
    const strip = theme === 'light' ? gray[150] : '#1c1c1e'
    const color = theme === 'light' ? INK : '#ededed'
    return `<div style="background:${strip};padding:12px 12px 0;border-radius:14px 14px 0 0;width:300px">
      <div style="background:${bg};color:${color};border-radius:10px 10px 0 0;display:flex;align-items:center;gap:10px;padding:11px 16px;font-size:14px">
        ${logo('mark', theme === 'light' ? 'on-light' : 'on-dark', 16)}<span>Lumovi</span><span style="margin-left:auto;opacity:0.4">×</span></div></div>`
  }
  return {
    number: '06',
    name: 'App icon',
    summary: 'The mark, lit on graphite: for macOS, Windows, Linux and the web.',
    pages: [
      {
        title: 'The app icon',
        html: `
          ${head('06 — App icon', 'The app icon')}
          <div class="content" style="margin-top:20px">
            <div class="figure mist" style="flex:1">
              <div style="position:relative;width:${size}px;height:${size}px">
                <img src="${a.file('icons/app/macos/icon.png')}" width="${size}" height="${size}">
                ${parts.map((p, i) => marker(i + 1, p.x, p.y)).join('')}
              </div>
            </div>
            <div class="col text" style="justify-content:center;gap:16px">
              <p class="body">The mark, lit, on a plate of graphite. The light glows and lights the shade beside it, brightest along the curve: the only place the brand glows.</p>
              <div class="col" style="gap:12px">
                ${parts.map((p, i) => `<div class="note"><span class="n">${i + 1}</span><div class="body"><b>${p.name}.</b> ${p.spec}</div></div>`).join('')}
              </div>
            </div>
          </div>`,
      },
      {
        title: 'Liquid Glass',
        html: `
          ${head('06 — App icon', 'Liquid Glass', 'On macOS 26 and later, the icon is an Icon Composer document: layers the system lights, tints and shadows itself, in light, dark, clear and tinted appearances.')}
          <div class="row" style="margin-top:32px;gap:12px;align-items:flex-start">
            ${layer(fill, 'Fill', 'Graphite, top to bottom, set in icon.json. The system masks it to the icon’s shape.')}
            ${layer(glass.layers['glow.svg']!, 'Glow', 'The light’s glow on the plate. Not glass: it stays soft.')}
            ${layer(glass.layers['shade.svg']!, 'Shade', 'Glass, 40% translucent, with a neutral shadow.')}
            ${layer(glass.layers['light.svg']!, 'Light', 'Glass, solid, so it stays the brightest thing.')}
          </div>
          <div class="row" style="margin-top:36px;gap:48px">
            <p class="body fill">The layers are drawn on the whole 1024 canvas, with the mark the same share of it as of the plate in the classic icon. Open <span class="mono">icons/app/macos/Lumovi.icon</span> in Icon Composer to see every appearance.</p>
            <p class="body fill">electron-builder compiles it with Xcode’s actool (Xcode 26 or later), together with the .icns that older versions of macOS show.</p>
          </div>`,
      },
      {
        title: 'Windows and Linux',
        html: `
          ${head('06 — App icon', 'Windows and Linux', 'The plate edge to edge, as icons there are, and every size drawn for itself.')}
          <div class="figure mist" style="margin-top:28px;height:340px;gap:28px;align-items:flex-end;padding-bottom:48px">
            ${sizes.map((px) => `<div class="col" style="align-items:center;gap:10px"><img src="${a.file(`icons/app/linux/${px}x${px}.png`)}" width="${px}" height="${px}"><span class="small">${px}</span></div>`).join('')}
            <span class="caption">At their actual size</span>
          </div>
          <div class="row" style="margin-top:16px;gap:16px;flex:1">
            ${[16, 24, 32]
              .map(
                (px) => `<div class="figure ink" style="flex:1;gap:24px">
                  <img src="${a.iconPixels[px]}" width="168" height="168">
                  <div class="col" style="gap:4px"><div style="font-size:15px;font-weight:600;color:#ededed">${px} px</div><div class="small" style="color:${gray[500]}">${px === 16 ? 'Mark 12 px, gap 1 px' : px === 24 ? 'Mark 16 px' : 'Mark 24 px'}</div></div>
                </div>`,
              )
              .join('')}
            <div class="col" style="flex:1.3;justify-content:center;padding-left:16px">
              ${list(['Up to 96 px the mark is larger than on the big icon, and the glow is left out.', 'At 16 and 20 px the gap narrows to one pixel.', 'The Windows .ico holds ten sizes, 16 to 256; Linux gets a PNG for each.'])}
            </div>
          </div>`,
      },
      {
        title: 'Favicons and web icons',
        html: `
          ${head('06 — App icon', 'Favicons and web icons')}
          <div class="row" style="margin-top:32px;gap:16px;flex:1">
            <div class="figure mist" style="flex:1.2;flex-direction:column;gap:16px">
              ${tab('light')}${tab('dark')}
              <span class="caption">favicon.svg follows the browser’s theme</span>
            </div>
            <div class="figure mist" style="flex:1;flex-direction:column;gap:14px">
              <img src="${a.file('icons/web/apple-touch-icon.png')}" width="150" height="150" style="border-radius:34px">
              <span class="caption">Touch icon: iOS rounds the corners</span>
            </div>
            <div class="figure mist" style="flex:1;flex-direction:column;gap:14px">
              <div style="position:relative;width:200px;height:200px">
                <img src="${a.file('icons/web/icon-maskable-512.png')}" width="200" height="200">
                <div style="position:absolute;inset:20px;border-radius:50%;outline:2px dashed ${status.warn}"></div>
              </div>
              <span class="caption">Maskable: the mark inside the safe circle</span>
            </div>
          </div>
          <div class="row" style="margin-top:22px;gap:48px">
            ${specs([
              ['favicon.svg', 'The mark: ink and Mist on light, white and gray on dark'],
              ['favicon.ico', '16, 32, 48 px: the app icon, which reads on any tab'],
            ])}
            ${specs([
              ['apple-touch-icon.png', '180 px, graphite to the edges'],
              ['icon-192, icon-512', 'The plate, for installed web apps'],
              ['site.webmanifest', 'theme and background #0a0a0a'],
            ])}
          </div>`,
      },
      {
        title: 'Using the icon',
        html: `
          ${head('06 — App icon', 'Using the icon', 'The icon stands for the app itself: on a dock, in a store, beside a download button.')}
          <div class="grid" style="grid-template-columns:repeat(4,1fr);margin-top:32px;flex:1">
            ${[
              [
                true,
                'Use it as it is',
                `<img src="${a.file('icons/app/macos/icon.png')}" width="200" height="200">`,
              ],
              [
                false,
                'Don’t recolor the plate',
                `<img src="${a.file('icons/app/macos/icon.png')}" width="200" height="200" style="filter:sepia(1) saturate(5) hue-rotate(170deg)">`,
              ],
              [
                false,
                'Don’t add badges or words',
                `<div style="position:relative"><img src="${a.file('icons/app/macos/icon.png')}" width="200" height="200"><div style="position:absolute;right:24px;top:22px;padding:4px 10px;border-radius:12px;background:${status.critical};color:#fff;font-weight:700;font-size:16px">NEW</div></div>`,
              ],
              [
                false,
                'Don’t use it as the logo',
                `<div style="display:flex;align-items:center;gap:10px"><img src="${a.file('icons/app/macos/icon.png')}" width="64" height="64"><span style="font-size:30px;font-weight:650;letter-spacing:-0.03em">Lumovi</span></div>`,
              ],
            ]
              .map(
                ([ok, label, visual]) =>
                  `<div class="figure mist" style="flex-direction:column;gap:22px">${visual}<div style="position:absolute;left:20px;bottom:18px">${verdict(ok as boolean, label as string)}</div></div>`,
              )
              .join('')}
          </div>`,
      },
    ],
  }
}
