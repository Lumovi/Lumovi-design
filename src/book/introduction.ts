// 01 Introduction and 02 Brand: what the book is, Lumovi at a glance, the name, the principles
// and the idea behind the mark.
import { address, description, site, tagline } from '../brand.ts'
import { brand, gray, INK, PAPER } from '../colors.ts'
import { head, list, logo, type Section } from './kit.ts'

export function introduction(): Section {
  return {
    number: '01',
    name: 'Introduction',
    summary: 'What this book is for, and Lumovi on one page.',
    pages: [
      {
        title: 'About this book',
        html: `
          ${head('01 — Introduction', 'About this book', 'How Lumovi looks and sounds, and how to use its logo, colors, type and pictures, whether you work on the app, the website or the docs, or you’re writing about Lumovi.')}
          <div class="content">
            <div class="col fill">
              <h3>Who it’s for</h3>
              ${list([
                'Contributors to the app, the website and the docs, deciding how something should look.',
                'Designers making anything new for Lumovi: a page, a slide, a sticker.',
                'Writers, speakers and partners who want to show Lumovi as it should be shown.',
              ])}
            </div>
            <div class="col fill">
              <h3>Where everything is</h3>
              <p class="body">Every logo, icon, color and picture in this book is a file in the <b>Lumovi-design</b> repository, and all of them, this book included, are built from the same few source files. Take the files from there rather than from this PDF.</p>
              <p class="body">If this book and the files ever disagree, the files are right and the book is out of date.</p>
            </div>
            <div class="col fill">
              <h3>How it’s organized</h3>
              <p class="body">It starts with the idea, then the logo, color and type, the app icon, pictures and motion, how they come together in the places Lumovi lives, and how Lumovi talks. The last pages are the rules for the name and logo, and the list of files.</p>
            </div>
          </div>`,
      },
      {
        title: 'Lumovi at a glance',
        html: `
          ${head('01 — Introduction', 'Lumovi at a glance')}
          <div class="grid" style="grid-template-columns:1.25fr 1fr 1fr;grid-template-rows:1fr 1fr;margin-top:36px;flex:1;gap:16px">
            <div class="figure ink" style="grid-row:span 2;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:40px">
              ${logo('mark', 'on-dark', 120)}
              <div>
                <div style="font-size:15px;color:${gray[500]};margin-bottom:12px">The name</div>
                ${logo('wordmark', 'white', 72)}
                <p class="body" style="margin-top:16px;color:${gray[400]}">From <i>lumen</i>, light, and <i>view</i>. Light on what’s happening in your clusters.</p>
              </div>
            </div>
            ${card('What it is', `<p style="font-size:22px;line-height:1.35;font-weight:550;letter-spacing:-0.015em">${description}</p>`)}
            ${card('The line', `<p style="font-size:30px;line-height:1.1;font-weight:650;letter-spacing:-0.035em;font-variation-settings:'opsz' 32">${tagline[0]}<br><span class="quiet">${tagline[1]}</span></p>`)}
            ${card(
              'Colors',
              `<div class="row" style="gap:8px">${Object.values(brand)
                .map(
                  (c) =>
                    `<div style="flex:1"><div style="height:64px;border-radius:10px;background:${c.hex};box-shadow:inset 0 0 0 1px rgb(0 0 0 / 0.08)"></div><div class="small" style="margin-top:8px;color:${INK};font-weight:550">${c.name}</div></div>`,
                )
                .join('')}</div>`,
            )}
            ${card(
              'Type and addresses',
              `<div class="row" style="gap:28px;align-items:flex-end">
                <div><div style="font-size:48px;font-weight:600;letter-spacing:-0.03em;line-height:1">Aa</div><div class="small" style="margin-top:6px">Inter</div></div>
                <div><div class="mono" style="font-size:44px;line-height:1">{}</div><div class="small" style="margin-top:6px">JetBrains Mono</div></div>
                <div class="small" style="margin-left:auto;text-align:right;color:${INK};font-size:15px;line-height:1.6">${address(site.website)}<br>${address(site.docs)}<br>github.com/Lumovi</div>
              </div>`,
            )}
          </div>`,
      },
    ],
  }
}

function card(label: string, content: string): string {
  return `<div class="figure mist" style="flex-direction:column;align-items:stretch;justify-content:space-between;padding:28px">
    <div class="small">${label}</div>${content}</div>`
}

export function story(): Section {
  const principle = (name: string, line: string, practice: string[]) => `
    <div class="col" style="gap:14px;padding:30px;border-radius:18px;background:${gray[100]}">
      <h3 style="font-size:26px;letter-spacing:-0.025em">${name}</h3>
      <p class="body" style="color:${INK};font-size:17px">${line}</p>
      <div class="rule" style="margin:6px 0 2px"></div>
      <div class="small" style="text-transform:uppercase;letter-spacing:0.1em;font-weight:600">In practice</div>
      ${list(practice)}
    </div>`
  return {
    number: '02',
    name: 'Brand',
    summary: 'Where the name comes from, what Lumovi stands for, and the idea behind the mark.',
    pages: [
      {
        title: 'The name',
        html: `
          ${head('02 — Brand', 'The name')}
          <div class="content" style="align-items:center">
            <div class="col fill" style="gap:28px">
              <div class="row" style="align-items:baseline;gap:28px;font-variation-settings:'opsz' 32">
                <span style="font-size:88px;font-weight:650;letter-spacing:-0.045em">lumen</span>
                <span style="font-size:56px;color:${gray[400]}">+</span>
                <span style="font-size:88px;font-weight:650;letter-spacing:-0.045em">view</span>
              </div>
              <div class="row" style="align-items:center;gap:28px">
                <span style="font-size:56px;color:${gray[400]}">→</span>
                ${logo('wordmark', 'black', 104)}
              </div>
            </div>
            <div class="col text" style="gap:16px">
              <p class="body"><b>Lumen</b> is Latin for light, and the unit light is measured in. <b>View</b> is what you get when there’s enough of it.</p>
              <p class="body">Lumovi puts light on what’s happening in your clusters, so you can see what’s healthy, what’s struggling and where to look first.</p>
              <p class="body">It was called <b>KubeStacks</b>. That named what the app works on; Lumovi names what it gives you. The app, its code and the people making it are the same.</p>
            </div>
          </div>`,
      },
      {
        title: 'Principles',
        html: `
          ${head('02 — Brand', 'Principles', 'Four things everything Lumovi makes should be. They come from the app itself, and they decide the close calls.')}
          <div class="grid" style="grid-template-columns:repeat(4,1fr);margin-top:40px;align-items:start">
            ${principle('Calm', 'Nothing shouts. When something goes wrong, Lumovi is the calm one in the room.', ['One light, one subject, plenty of space.', 'Gray first; color only when it means something.', 'Motion is slow and rare.'])}
            ${principle('Clear', 'What matters is seen first: at a glance, before any detail.', ['Hierarchy before decoration.', 'Problems sort to the top, in the app and on the page.', 'Plain words, short sentences.'])}
            ${principle('Exact', 'Everything sits on a grid and has a reason to be where it is.', ['The mark is built from circles, on whole pixels.', 'Spacing and type from one scale.', 'If it can be measured, measure it.'])}
            ${principle('Honest', 'Show the real thing, and say what it does.', ['Real screenshots, never mock-ups dressed as the app.', 'No claims the app can’t back.', 'Every change shows its kubectl.'])}
          </div>`,
      },
      {
        title: 'The idea',
        html: `
          ${head('02 — Brand', 'The idea: Sweep')}
          <div class="content" style="align-items:stretch">
            <div class="figure ink" style="flex:1.25">${logo('mark', 'on-dark', 330)}</div>
            <div class="col text" style="justify-content:center;gap:16px">
              <p class="lead" style="margin:0;color:${INK}">A square, and light sweeping across it from one corner.</p>
              <p class="body">The square is the whole of what you look after: a cluster, every cluster. The light is Lumovi, taking all of it in at once, the way you see a room when someone turns the lights on.</p>
              <p class="body">It’s drawn only from circles, in black, white and gray, and it reads the same at 16 pixels and on a billboard. Turned into the app icon, the light glows.</p>
              <div class="row" style="gap:24px;margin-top:10px">
                <div class="col" style="gap:8px"><div style="width:44px;height:44px;border-radius:12px;background:${INK}"></div><span class="small">The light</span></div>
                <div class="col" style="gap:8px"><div style="width:44px;height:44px;border-radius:12px;background:${gray[300]}"></div><span class="small">The shade</span></div>
                <div class="col" style="gap:8px"><div style="width:44px;height:44px;border-radius:12px;background:${PAPER};box-shadow:inset 0 0 0 1px ${gray[200]}"></div><span class="small">The gap</span></div>
              </div>
            </div>
          </div>`,
      },
    ],
  }
}
