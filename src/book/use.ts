// 09 In use, 10 Voice and 11 Legal and resources: the brand in the places Lumovi lives, how it
// talks, the rules for the name and logo, and where the files are.
import { address, site } from '../brand.ts'
import { blue, gray, INK, PAPER } from '../colors.ts'
import { head, list, logo, logoHeight, specs, verdict, type Assets, type Section } from './kit.ts'

const folder = `<svg width="80" height="80" viewBox="0 0 80 80"><path d="M8 20a6 6 0 0 1 6-6h17l6 6h29a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#6eb5f5"/><path d="M8 28a6 6 0 0 1 6-6h52a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" fill="#8ccaff"/><path d="M33 36h14l-7 8z M40 44v-14" stroke="#4a95db" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>`

export function useSection(a: Assets): Section {
  const nav = (theme: 'light' | 'dark') => {
    const bg = theme === 'light' ? PAPER : gray[950]
    const fg = theme === 'light' ? INK : '#ededed'
    const muted = theme === 'light' ? gray[600] : gray[400]
    const line = theme === 'light' ? gray[200] : gray[800]
    return `<div style="width:100%;border-radius:14px;overflow:hidden;background:${bg};box-shadow:0 0 0 1px ${line}">
      <div style="height:64px;display:flex;align-items:center;gap:28px;padding:0 24px;border-bottom:1px solid ${line}">
        ${logo('logo', theme === 'light' ? 'on-light' : 'on-dark', logoHeight(24))}
        ${['The app', 'Features', 'In your cluster', 'Install'].map((l) => `<span style="font-size:14px;color:${muted}">${l}</span>`).join('')}
        <span style="margin-left:auto;font-size:14px;color:${muted}">Docs</span>
        <span style="padding:8px 14px;border-radius:9px;background:${blue[600]};color:#fff;font-size:14px;font-weight:550">Download</span>
      </div>
      <div style="padding:20px 24px 22px">
        <div style="font-size:30px;font-weight:650;letter-spacing:-0.045em;line-height:1.02;color:${fg};font-variation-settings:'opsz' 32">Your clusters,<br><span style="color:${theme === 'light' ? gray[600] : gray[500]}">at a glance.</span></div>
      </div>
    </div>`
  }
  return {
    number: '09',
    name: 'In use',
    summary:
      'The brand in the places Lumovi lives: the installers, the app’s sponsor card, the website, the docs and GitHub.',
    pages: [
      {
        title: 'Installers',
        html: `
          ${head('09 — In use', 'Installers', 'The first thing people see of Lumovi on their computer.')}
          <div class="row" style="margin-top:28px;gap:16px;flex:1">
            <div class="figure mist" style="flex:1.45;flex-direction:column;gap:16px">
              <div style="width:640px;border-radius:12px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0 / 0.1), 0 30px 60px -20px rgb(0 0 0 / 0.4)">
                <div style="height:30px;background:#e8e8e8;display:flex;align-items:center;gap:7px;padding:0 12px">${['#ff5f57', '#febc2e', '#28c840'].map((c) => `<span style="width:11px;height:11px;border-radius:6px;background:${c}"></span>`).join('')}<span style="margin-left:auto;margin-right:auto;font-size:12px;font-weight:600;color:#4a4a4a">Lumovi</span></div>
                <div style="position:relative;width:640px;height:${(640 * 380) / 540}px">
                  <img src="${a.file('media/installer/dmg-background@2x.png')}" width="640" height="${(640 * 380) / 540}">
                  ${[
                    [
                      130,
                      `<img src="${a.file('icons/app/macos/icon.png')}" width="95" height="95">`,
                      'Lumovi',
                    ],
                    [
                      410,
                      folder.replace('width="80" height="80"', 'width="95" height="95"'),
                      'Applications',
                    ],
                  ]
                    .map(
                      ([x, icon, label]) =>
                        `<div style="position:absolute;left:${((x as number) / 540) * 640 - 60}px;top:${(220 / 380) * ((640 * 380) / 540) - 48}px;width:120px;display:flex;flex-direction:column;align-items:center;gap:6px">${icon}<span style="font-size:13px;color:#000">${label}</span></div>`,
                    )
                    .join('')}
                </div>
              </div>
              <span class="caption">The macOS disk image: the names sit on a gray where black and white text both read</span>
            </div>
            <div class="figure mist" style="flex:1;flex-direction:column;gap:16px">
              <div style="display:flex;width:420px;height:300px;border-radius:6px;overflow:hidden;box-shadow:0 0 0 1px rgb(0 0 0 / 0.12), 0 20px 50px -20px rgb(0 0 0 / 0.35);background:${PAPER}">
                <img src="${a.file('media/installer/nsis-sidebar.bmp')}" width="157" height="300" style="flex:none">
                <div style="padding:22px;display:flex;flex-direction:column;gap:12px"><div style="font-size:17px;font-weight:600;color:${INK}">Welcome to Lumovi Setup</div><div style="font-size:12px;line-height:1.5;color:${gray[700]}">Setup will guide you through the installation of Lumovi.</div></div>
              </div>
              <span class="caption">The Windows installer’s welcome page</span>
            </div>
          </div>`,
      },
      {
        title: 'The sponsor card',
        html: `
          ${head('09 — In use', 'The sponsor card', 'One card at the bottom of the app’s sidebar: Lumovi’s own, a sponsor’s, or none.')}
          <div class="content">
            <div class="text col" style="gap:24px">
              <p class="body">It’s made of the sidebar’s own parts, so it reads as part of Lumovi, not as an ad: a label like the nav’s, over a card like the cluster’s. Lumovi’s card and a sponsor’s are the same size, so one replaces the other without moving anything.</p>
              ${specs([
                ['Label', '“Sponsor”, as the nav’s section labels'],
                ['Card', '220 × 108, 12 px corners, Surface 2'],
                ['Picture', '204 × 68 (3:1), sent at 408 × 136'],
                ['Hover, focus', 'Surface 3, and the link’s domain fades in'],
                ['A long nav', 'Fades where it goes on, under a hairline'],
                ['Short windows', 'Under 720 px tall, no card'],
                ['Motion', 'Plays once, 5 s at most; the first frame for reduced motion'],
              ])}
            </div>
            <div class="figure mist" style="flex:1;padding:24px 24px 48px">
              <img src="${a.file('guidelines/images/sponsor-states.png')}" style="display:block;width:100%">
              <span class="caption">None, Lumovi’s own, a sponsor’s, on hover and with focus. Acme is a placeholder.</span>
            </div>
          </div>`,
      },
      {
        title: 'Website and docs',
        html: `
          ${head('09 — In use', 'Website and docs', `The logo top left in the navigation, the rest in gray, and the one blue button: on ${address(site.website)} and ${address(site.docs)}.`)}
          <div class="col" style="margin-top:24px;gap:12px">
            ${nav('light')}
            ${nav('dark')}
          </div>
          <div class="row" style="margin-top:28px;gap:48px">
            ${specs([
              ['Logo in the bar', 'The mark 24 px tall (26–28 on wide pages)'],
              ['Bar', '64 px tall, the logo on the content’s left edge'],
              ['Links', 'Body text in Gray 600 (400 on dark)'],
            ])}
            ${specs([
              ['Primary button', 'Blue 600 (700 on hover), white text, 9 px corners'],
              [
                'Docs (Mintlify)',
                'logo/light.svg and logo/dark.svg: the logo, on-light and on-dark',
              ],
              ['Favicon', 'icons/web/favicon.svg'],
            ])}
          </div>`,
      },
      {
        title: 'GitHub',
        html: `
          ${head('09 — In use', 'GitHub', 'The organization and every repository: the avatar, a social preview, and the logo at the top of the README.')}
          <div class="row" style="margin-top:28px;gap:16px;flex:1">
            <div class="figure mist" style="flex:0.7;flex-direction:column;gap:14px">
              <img src="${a.file('social/avatar.png')}" width="200" height="200" style="border-radius:24px">
              <span class="caption">The organization’s avatar</span>
            </div>
            <div class="col" style="flex:1.6;gap:14px">
              <div class="figure paper" style="flex:1;flex-direction:column;gap:20px;padding:32px">
                ${logo('logo', 'on-light', logoHeight(40))}
                <div class="small" style="color:${gray[700]};font-size:15px">A beautiful, fast Kubernetes dashboard.</div>
              </div>
              <div class="mono" style="padding:18px 20px;border-radius:12px;background:${gray[950]};color:${gray[300]};font-size:12.5px;line-height:1.7;white-space:pre">&lt;picture&gt;
  &lt;source media="(prefers-color-scheme: dark)" srcset="lumovi-logo-on-dark.svg" /&gt;
  &lt;img src="lumovi-logo-on-light.svg" alt="Lumovi" height="48" /&gt;
&lt;/picture&gt;</div>
            </div>
          </div>
          <p class="small" style="margin-top:14px">The README logo follows the reader’s theme: on-dark for dark mode, on-light otherwise. Give it alt text: “Lumovi”.</p>`,
      },
    ],
  }
}

export function voiceSection(): Section {
  const example = (write: string, not: string) => `
    <div class="col" style="gap:10px;padding:22px;border-radius:16px;background:${gray[100]}">
      ${verdict(true, 'Write')}<p class="body" style="color:${INK};font-size:17px">${write}</p>
      <div class="rule" style="margin:4px 0"></div>
      ${verdict(false, 'Not')}<p class="body">${not}</p>
    </div>`
  return {
    number: '10',
    name: 'Voice',
    summary: 'How Lumovi talks: plainly, calmly, and to the point.',
    pages: [
      {
        title: 'How Lumovi talks',
        html: `
          ${head('10 — Voice', 'How Lumovi talks', 'The way the app talks: plainly, calmly, and to the point. Say what something does, not how amazing it is.')}
          <div class="grid" style="grid-template-columns:repeat(3,1fr);margin-top:32px;align-items:start">
            ${example('Restart the deployment. Its pods are replaced in a rolling update, so it keeps serving.', 'Supercharge your workflow with one-click, zero-downtime restarts!')}
            ${example('Lost the connection to the cluster. The last data stays on screen until it’s back.', 'Oops! Something went wrong. Please try again later.')}
            ${example('See what’s healthy, what’s struggling and where your capacity goes.', 'The ultimate, next-generation Kubernetes observability platform.')}
          </div>
          <div class="row" style="margin-top:28px;gap:40px">
            ${[
              [
                'When all is well',
                'Quiet. Routine work needs no applause: “Scaled to 3”, not “Success!”.',
              ],
              [
                'When something’s wrong',
                'Calm and specific: what happened, where, and what to do next.',
              ],
              [
                'Before a change',
                'Clear about the effect. Destructive actions say what will be lost, and start on Cancel.',
              ],
            ]
              .map(
                ([k, v]) =>
                  `<div class="col fill" style="gap:6px"><h3>${k}</h3><p class="body">${v}</p></div>`,
              )
              .join('')}
          </div>`,
      },
      {
        title: 'Words',
        html: `
          ${head('10 — Voice', 'Words')}
          <div class="content">
            <div class="col fill">
              <table class="data">
                <thead><tr><th>Write</th><th>Instead of</th></tr></thead>
                <tbody>
                  ${[
                    ['Kubernetes dashboard', 'K8s IDE, cockpit, observability platform'],
                    [
                      'cluster, namespace, pod, node',
                      'environment, project, container (when you mean a pod)',
                    ],
                    ['on your desktop, in your cluster', 'locally, self-hosted'],
                    ['sign in', 'log in, authenticate'],
                    ['Couldn’t reach the cluster', 'Error 503, Network failure'],
                    ['Restart, Scale, Roll back', 'Execute, Perform, Trigger'],
                    ['fast, calm, clear', 'blazing, revolutionary, seamless'],
                  ]
                    .map(
                      ([w, n]) =>
                        `<tr><td style="color:${INK};font-weight:500">${w}</td><td>${n}</td></tr>`,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
            <div class="col text">
              ${list([
                '<b>Short sentences,</b> in the active voice, about what people can see and do.',
                '<b>Kubernetes’ own words</b> for Kubernetes’ things, spelled as kubectl spells them.',
                '<b>Buttons say what happens:</b> “Restart”, then “Restarted”.',
                '<b>Errors say what went wrong and what to do,</b> without blame or apology.',
                '<b>No exclamation marks,</b> no emoji in the product, no superlatives.',
              ])}
            </div>
          </div>`,
      },
      {
        title: 'Names and addresses',
        html: `
          ${head('10 — Voice', 'Names and addresses')}
          <div class="row" style="margin-top:36px;gap:16px;align-items:stretch">
            ${[
              [
                true,
                'Lumovi',
                'One word, capital L, everywhere: in titles, in text, at the start of a sentence.',
              ],
              [
                false,
                'LUMOVI · lumovi · LumoVi · Lumovi App',
                'Not in capitals, not in lowercase (the wordmark is artwork, not a spelling), and no “App”.',
              ],
              [
                true,
                address(site.website),
                `The website, written without https:// or www. The docs are at ${address(site.docs)}.`,
              ],
              [
                true,
                'KubeStacks',
                'The old name. Say it once where people need to know (“Lumovi, formerly KubeStacks”), then drop it.',
              ],
            ]
              .map(
                ([
                  ok,
                  word,
                  rule,
                ]) => `<div class="col" style="flex:1;gap:14px;padding:28px;border-radius:16px;background:${gray[100]}">
                  ${verdict(ok as boolean, ok ? 'Write' : 'Not')}
                  <div style="font-size:${(word as string).length > 20 ? 22 : 34}px;font-weight:650;letter-spacing:-0.03em;line-height:1.2;color:${INK}">${word}</div>
                  <p class="body">${rule}</p>
                </div>`,
              )
              .join('')}
          </div>`,
      },
    ],
  }
}

export function legalSection(): Section {
  const tree: [string, string][] = [
    ['logo/', 'The logo, stacked logo, mark and wordmark, as SVG and PNG; animated marks'],
    [
      'icons/app/',
      'macOS (PNG, ICNS, Liquid Glass), Windows (ICO, Microsoft Store) and Linux (PNG)',
    ],
    ['icons/web/', 'Favicons, touch and web app icons, and the web manifest'],
    ['colors/', 'CSS custom properties, Tailwind, design tokens, Adobe and GIMP swatches'],
    ['social/', 'Link previews, GitHub previews and banners, the avatar, the X header'],
    ['media/', 'Wallpapers, and the macOS and Windows installers’ artwork'],
    ['snippets/', 'The mark as React and Astro components, and the HTML <head> tags'],
    ['guidelines/', 'The guidelines online, their pictures, and this book'],
    ['src/', 'What everything is built from: colors, the mark, the wordmark, the icons, the scene'],
  ]
  return {
    number: '11',
    name: 'Legal and resources',
    summary: 'The rules for the name and logo, and where everything is.',
    pages: [
      {
        title: 'Using the name and logo',
        html: `
          ${head('11 — Legal and resources', 'Using the name and logo')}
          <div class="content">
            <div class="col fill">
              <p class="lead" style="margin-top:0;color:${INK}">The files in this book are open source, under the Apache License 2.0. The Lumovi name and logo are trademarks of the Lumovi project, and the license doesn’t grant rights to them.</p>
            </div>
            <div class="col fill">
              ${verdict(true, 'You’re welcome to')}
              ${list(['Use the logo to link to Lumovi or write about it: in articles, talks, videos and lists of tools.', 'Show it next to your own logo for an integration, as on page “Next to other logos”.', 'Use the screenshots and pictures to show what Lumovi is.'])}
            </div>
            <div class="col fill">
              ${verdict(false, 'Please don’t')}
              ${list(['Use the name or logo for your own product, fork, company or domain.', 'Suggest that Lumovi endorses you, or that something is an official Lumovi project when it isn’t.', 'Change the logo, or make a new one from it.'])}
              <p class="small" style="margin-top:10px">Not sure? Open an issue in the Lumovi-design repository and ask.</p>
            </div>
          </div>`,
      },
      {
        title: 'The files',
        html: `
          ${head('11 — Legal and resources', 'The files', 'Everything in this book is in the Lumovi-design repository, built from source with npm run build.')}
          <table class="data" style="margin-top:28px">
            <tbody>
              ${tree.map(([path, what]) => `<tr><td class="mono" style="width:220px;font-size:14px">${path}</td><td>${what.replace('<head>', '&lt;head&gt;')}</td></tr>`).join('')}
            </tbody>
          </table>
          <p class="small" style="margin-top:16px">github.com/Lumovi/Lumovi-design · Change the source in src/, not the built files, and the book follows.</p>`,
      },
    ],
  }
}
