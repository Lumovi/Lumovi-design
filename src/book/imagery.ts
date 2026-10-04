// 07 Imagery and 08 Motion: the scene the brand's pictures share, the social images, banners,
// wallpapers, how to show the product, and the mark moving.
import { blue, gray, INK, PAPER } from '../colors.ts'
import { head, list, specs, type Assets, type Section } from './kit.ts'

export function imagerySection(a: Assets): Section {
  // The parts of the link preview, numbered, in its own coordinates (1200 × 630).
  const W = 960
  const s = W / 1200
  const parts: [x: number, y: number, text: string][] = [
    [40, 78, 'The logo, small, top left.'],
    [1132, 78, 'The address, across from it.'],
    [40, 262, 'A two-tone headline, and a line under it.'],
    [930, 210, 'The mark: the one light in the picture.'],
    [1080, 560, 'The floor: a cluster’s worth of pods, running into the distance.'],
    [740, 470, 'Light falling on the floor in front of the mark.'],
  ]
  const framed = (theme: 'light' | 'dark') => {
    const bg = theme === 'light' ? PAPER : gray[925]
    const bar = theme === 'light' ? gray[100] : gray[900]
    const line = theme === 'light' ? gray[200] : gray[800]
    const ink = theme === 'light' ? gray[300] : gray[750]
    return `<div style="width:520px;height:330px;border-radius:12px;overflow:hidden;background:${bg};box-shadow:0 0 0 1px ${theme === 'light' ? 'rgb(0 0 0 / 0.08)' : 'rgb(255 255 255 / 0.08)'}, 0 30px 70px -30px rgb(0 0 0 / ${theme === 'light' ? 0.35 : 0.8});display:flex;flex-direction:column">
      <div style="height:34px;background:${bar};display:flex;align-items:center;gap:7px;padding:0 13px;border-bottom:1px solid ${line}">${['#ff5f57', '#febc2e', '#28c840'].map((c) => `<span style="width:11px;height:11px;border-radius:6px;background:${c}"></span>`).join('')}</div>
      <div style="flex:1;display:flex">
        <div style="width:120px;border-right:1px solid ${line};padding:14px 12px;display:flex;flex-direction:column;gap:9px">${[70, 52, 60, 44, 56].map((w) => `<div style="height:8px;width:${w}%;border-radius:3px;background:${ink}"></div>`).join('')}</div>
        <div style="flex:1;padding:16px;display:flex;flex-direction:column;gap:10px">
          <div style="height:12px;width:40%;border-radius:3px;background:${ink}"></div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px">${[0, 1, 2].map(() => `<div style="height:58px;border-radius:8px;border:1px solid ${line}"></div>`).join('')}</div>
          ${[0, 1, 2, 3].map(() => `<div style="height:20px;border-bottom:1px solid ${line}"></div>`).join('')}
        </div>
      </div>
    </div>`
  }
  return {
    number: '07',
    name: 'Imagery',
    summary: 'One scene for every picture of the brand, and the rules for showing the product.',
    pages: [
      {
        title: 'The scene',
        html: `
          ${head('07 — Imagery', 'The scene', 'Every picture of the brand is the same scene: graphite, a floor of dots running into the distance, and the mark standing on it, its light falling on the floor in front.')}
          <div class="row" style="margin-top:26px;flex:1;gap:48px;align-items:center">
            <div style="position:relative;width:${W}px;height:${630 * s}px;flex:none">
              <img src="${a.file('social/og/lumovi.png')}" width="${W}" height="${630 * s}" style="border-radius:16px">
              ${parts
                .map(
                  ([x, y], i) =>
                    `<span style="position:absolute;left:${x * s - 13}px;top:${y * s - 13}px;width:26px;height:26px;border-radius:13px;background:${PAPER};color:${INK};font-size:13px;font-weight:650;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px ${blue[400]}, 0 2px 8px rgb(0 0 0 / 0.4)">${i + 1}</span>`,
                )
                .join('')}
            </div>
            <div class="col fill" style="gap:12px">
              ${parts.map(([, , text], i) => `<div class="note"><span class="n">${i + 1}</span><div class="body">${text}</div></div>`).join('')}
              <div class="rule" style="margin:10px 0"></div>
              <p class="body">One light, one subject, and plenty of dark. Black, white and gray: the light is white. The scene is built by src/scene.ts, so a new size is a new build.</p>
            </div>
          </div>`,
      },
      {
        title: 'Social images',
        html: `
          ${head('07 — Imagery', 'Social images', 'Link previews, 1200 × 630 at twice the size, and a preview for each repository on GitHub, 1280 × 640: set it in the repository’s Settings, under Social preview.')}
          <div class="grid" style="grid-template-columns:repeat(2,510px);justify-content:center;margin-top:24px;gap:14px 20px">
            ${[
              ['social/github/lumovi.png', 'Lumovi: the app’s repository'],
              ['social/github/lumovi-docs.png', 'The docs'],
              ['social/github/lumovi-website.png', 'The website'],
              ['social/github/lumovi-design.png', 'This repository'],
            ]
              .map(
                ([file, caption]) =>
                  `<div class="col" style="gap:8px"><img src="${a.file(file!)}" style="width:100%;border-radius:12px"><span class="small">${caption}</span></div>`,
              )
              .join('')}
          </div>`,
      },
      {
        title: 'Banners and headers',
        html: `
          ${head('07 — Imagery', 'Banners and headers')}
          <div class="row" style="margin-top:28px;gap:16px">
            <div class="col fill" style="gap:8px"><img src="${a.file('social/github/profile-banner-dark.png')}" style="width:100%;border-radius:12px"><span class="small">GitHub profile banner, dark</span></div>
            <div class="col fill" style="gap:8px"><img src="${a.file('social/github/profile-banner-light.png')}" style="width:100%;border-radius:12px"><span class="small">GitHub profile banner, light</span></div>
          </div>
          <div class="row" style="margin-top:24px;gap:40px;flex:1;align-items:center">
            <div style="position:relative;width:660px;height:220px;margin-bottom:${660 * 0.11}px">
              <img src="${a.file('social/header.png')}" width="660" height="220" style="border-radius:12px">
              <div style="position:absolute;left:${660 * 0.025}px;top:${220 - 660 * 0.11}px;width:${660 * 0.22}px;height:${660 * 0.22}px;border-radius:50%;border:2px dashed #f5a524;background:rgb(245 165 36 / 0.12)"></div>
            </div>
            <div class="col fill" style="gap:12px">
              <h3>X, Bluesky and Mastodon</h3>
              <p class="body">The header leaves the bottom left to the avatar (dashed), and keeps the address out of the top corners, where phones put their buttons.</p>
              ${specs([
                ['Header', '1500 × 500, at twice the size'],
                ['Avatar', 'social/avatar.png, 1024 × 1024'],
              ])}
            </div>
          </div>`,
      },
      {
        title: 'Wallpapers',
        html: `
          ${head('07 — Imagery', 'Wallpapers', 'For desktops and phones, in dark and light: the scene with nothing else in it.')}
          <div class="row" style="margin-top:28px;gap:16px;flex:1;align-items:center">
            <div class="col" style="gap:16px;flex:3">
              <div class="row" style="gap:16px">
                <div class="col fill" style="gap:8px"><img src="${a.file('media/wallpapers/lumovi-desktop-16x9-dark.jpg')}" style="width:100%;border-radius:12px"><span class="small">Desktop, dark · 5120 × 2880</span></div>
                <div class="col fill" style="gap:8px"><img src="${a.file('media/wallpapers/lumovi-desktop-16x9-light.jpg')}" style="width:100%;border-radius:12px;box-shadow:0 0 0 1px ${gray[200]}"><span class="small">Desktop, light · 5120 × 2880</span></div>
              </div>
              <p class="small">Also at 3456 × 2160 for 16:10 displays, in media/wallpapers.</p>
            </div>
            <div class="row" style="gap:16px;flex:1.1">
              <div class="col fill" style="gap:8px"><img src="${a.file('media/wallpapers/lumovi-phone-dark.jpg')}" style="width:100%;border-radius:22px"><span class="small">Phone, dark</span></div>
              <div class="col fill" style="gap:8px"><img src="${a.file('media/wallpapers/lumovi-phone-light.jpg')}" style="width:100%;border-radius:22px;box-shadow:0 0 0 1px ${gray[200]}"><span class="small">Phone, light</span></div>
            </div>
          </div>`,
      },
      {
        title: 'Showing the product',
        html: `
          ${head('07 — Imagery', 'Showing the product', 'Show the real app: real screenshots, in light and dark, framed the same way everywhere.')}
          <div class="row" style="margin-top:32px;gap:16px;flex:1">
            <div class="figure mist" style="flex:1">${framed('light')}<span class="caption">On light: a hairline and a soft shadow</span></div>
            <div class="figure ink" style="flex:1">${framed('dark')}<span class="caption">On dark: a hairline of white, a deeper shadow</span></div>
          </div>
          <div class="row" style="margin-top:22px;gap:40px">
            ${list(['Screenshots from the app as it is, with the demo clusters, at 2×.'])}
            ${list(['A 12 px corner, a 1 px edge, and one shadow, as above.'])}
            ${list(['No fake data that looks real, no mock-ups dressed as the app, no device frames.'])}
          </div>`,
      },
    ],
  }
}

/** A cubic Bézier easing curve, drawn. */
function easing(x1: number, y1: number, x2: number, y2: number, size: number): string {
  const p = (x: number, y: number) => `${(x * size).toFixed(1)} ${((1 - y) * size).toFixed(1)}`
  return `<svg width="${size + 40}" height="${size + 40}" viewBox="-20 -20 ${size + 40} ${size + 40}" style="display:block">
    <rect width="${size}" height="${size}" fill="none" stroke="${gray[200]}"/>
    <path d="M${p(0, 0)}L${p(x1, y1)}M${p(1, 1)}L${p(x2, y2)}" stroke="${gray[300]}" stroke-dasharray="3 3"/>
    <path d="M${p(0, 0)}C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}" fill="none" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="${x1 * size}" cy="${(1 - y1) * size}" r="4" fill="${blue[600]}"/><circle cx="${x2 * size}" cy="${(1 - y2) * size}" r="4" fill="${blue[600]}"/>
  </svg>`
}

export function motionSection(a: Assets): Section {
  const strip = (frames: { at: number; src: string }[]) =>
    `<div class="row" style="gap:10px">${frames
      .map(
        (f) =>
          `<div class="col" style="gap:8px;align-items:center;flex:1"><div style="border-radius:14px;background:${gray[950]};padding:10px;width:100%;display:flex;justify-content:center"><img src="${f.src}" width="128" height="128"></div><span class="small mono">${f.at} ms</span></div>`,
      )
      .join('')}</div>`
  return {
    number: '08',
    name: 'Motion',
    summary: 'The mark, moving: an intro, and a loading mark.',
    pages: [
      {
        title: 'The mark, moving',
        html: `
          ${head('08 — Motion', 'The mark, moving', 'Two animations, as SVG files that play in an image tag. Both hold still for people who ask for reduced motion.')}
          <div class="row" style="margin-top:26px;gap:48px;flex:1">
            <div class="col" style="flex:2.4;gap:22px">
              <div class="col" style="gap:10px"><h3>Intro <span class="small" style="font-weight:400">· once, in 1.3 seconds: the square settles, then the light sweeps across it</span></h3>${strip(a.frames.intro)}</div>
              <div class="col" style="gap:10px"><h3>Loading <span class="small" style="font-weight:400">· loops every 2.2 seconds: the light breathes</span></h3>${strip(a.frames.loading)}</div>
            </div>
            <div class="col fill" style="gap:16px">
              ${easing(0.16, 1, 0.3, 1, 200)}
              ${specs([
                ['Easing', 'cubic-bezier(0.16, 1, 0.3, 1)'],
                ['Square', '700 ms, from 94% and transparent'],
                ['Light', '900 ms from 250 ms, from its corner'],
                ['Breathing', '2.2 s, to 80% and back'],
                ['Reduced motion', 'The last frame, still'],
              ])}
              <p class="small">The same easing as the app’s panels and toasts: quick to start, slow to settle.</p>
            </div>
          </div>`,
      },
    ],
  }
}
