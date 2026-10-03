// snippets/: the mark as components for the app (React) and the website (Astro), and the
// <head> tags for the icons. The components follow the theme the way the app and the website
// do: the system's, unless data-theme on <html> says otherwise.
import { night } from '../../src/colors.ts'
import { GRID, litStops, orbStops, REACH, shapes, type Background } from '../../src/mark.ts'
import { n, type Stop } from '../../src/svg.ts'
import type { Task } from '../lib/task.ts'

const { l, orb } = shapes()

/** The light and dark paints' gradients, as JSX or HTML, with ids from `id`. */
function gradients(id: (name: string) => string, jsx: boolean): string[] {
  const attr = (name: string) =>
    jsx ? name.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) : name
  const close = jsx ? ' />' : '></stop>'
  const stops = (list: Stop[]) =>
    list.map(
      ([offset, color]) => `  <stop offset="${n(offset)}" ${attr('stop-color')}="${color}"${close}`,
    )
  return (['light', 'dark'] as const).flatMap((background) => [
    `<radialGradient id=${id(`l-${background}`)} cx="${orb.cx}" cy="${orb.cy}" r="${REACH}" gradientUnits="userSpaceOnUse">`,
    ...stops(litStops(background)),
    '</radialGradient>',
    `<radialGradient id=${id(`orb-${background}`)} cx="0.36" cy="0.32" r="0.78">`,
    ...stops(orbStops(background)),
    '</radialGradient>',
  ])
}

/** CSS that paints the mark for the theme: light, or dark when the system or data-theme says. */
function themeCss(cls: (name: string) => string, url: (name: string) => string): string {
  const rules = (background: Background, scope = '') =>
    [
      `${scope}${cls('l')} { fill: ${url(`l-${background}`)}; }`,
      `${scope}${cls('orb')} { fill: ${url(`orb-${background}`)}; }`,
    ].join('\n')
  return [
    rules('light'),
    '@media (prefers-color-scheme: dark) {',
    ...rules('dark', ":root:not([data-theme='light']) ")
      .split('\n')
      .map((line) => `  ${line}`),
    '}',
    rules('dark', ":root[data-theme='dark'] "),
  ].join('\n')
}

function react(): string {
  const id = (name: string) => `{\`\${id}-${name}\`}`
  const css = themeCss(
    (name) => `.\${id}-${name}`,
    (name) => `url(#\${id}-${name})`,
  )
  return `// The Lumovi mark, for the app. Built by lumovi-design (npm run build): change it there.
import { useId } from 'react'
import { cn } from '@renderer/lib/cn'

const css = (id: string) => \`
${css}
\`

/** The Lumovi mark: an L that holds a light. It follows the app's theme. */
export function Logo({ className }: { className?: string }) {
  // useId() has colons, which CSS class names can't.
  const id = \`lumovi-\${useId().replace(/[^a-zA-Z0-9-]/g, '')}\`
  return (
    <svg viewBox="0 0 ${GRID} ${GRID}" aria-hidden className={cn('size-7', className)}>
      <defs>
${gradients(id, true)
  .map((line) => `        ${line}`)
  .join('\n')}
      </defs>
      <style>{css(id)}</style>
      <path className={\`\${id}-l\`} d="${l}" />
      <circle className={\`\${id}-orb\`} cx="${orb.cx}" cy="${orb.cy}" r="${orb.r}" />
    </svg>
  )
}
`
}

function astro(): string {
  const id = (name: string) => `{\`\${id}-${name}\`}`
  const css = themeCss(
    (name) => `.\${id}-${name}`,
    (name) => `url(#\${id}-${name})`,
  )
  return `---
// The Lumovi mark, for the website. Built by lumovi-design (npm run build): change it there.
/** The Lumovi mark: an L that holds a light. It follows the site's theme. */
interface Props {
  size?: number
  class?: string
}
const { size = 28, class: className } = Astro.props
const id = \`lumovi-\${Math.random().toString(36).slice(2, 8)}\`
const css = \`
${css}
\`
---

<svg viewBox="0 0 ${GRID} ${GRID}" width={size} height={size} aria-hidden="true" class={className}>
  <defs>
${gradients(id, false)
  .map((line) => `    ${line}`)
  .join('\n')}
  </defs>
  <style set:html={css}></style>
  <path class={\`\${id}-l\`} d="${l}"></path>
  <circle class={\`\${id}-orb\`} cx="${orb.cx}" cy="${orb.cy}" r="${orb.r}"></circle>
</svg>
`
}

function head(): string {
  return `<!-- Lumovi's icons and link previews. Copy icons/web/ to the site's root, and
     social/og/lumovi.png to /og.png. -->
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${night[900]}" />
<meta property="og:image" content="https://YOUR-SITE/og.png" />
<meta property="og:image:width" content="2400" />
<meta property="og:image:height" content="1260" />
<meta property="og:image:alt" content="Lumovi: your clusters, at a glance." />
<meta name="twitter:card" content="summary_large_image" />
`
}

export default {
  name: 'snippets',
  outputs: ['snippets'],
  async build(ctx) {
    ctx.text('snippets/react/Logo.tsx', react())
    ctx.text('snippets/astro/LumoviLogo.astro', astro())
    ctx.text('snippets/html/head.html', head())
  },
} satisfies Task
