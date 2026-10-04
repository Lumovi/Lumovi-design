// snippets/: the mark as components for the app (React) and the website (Astro), and the
// <head> tags for the icons. The components follow the theme the way the app and the website
// do: the system's, unless data-theme on <html> says otherwise.
import { address, description, name, site, tagline } from '../../src/brand.ts'
import { gray } from '../../src/colors.ts'
import { GRID, paint, shapes } from '../../src/mark.ts'
import type { Task } from '../lib/task.ts'

const { light, shade } = shapes()
const onLight = paint('color', 'light')
const onDark = paint('color', 'dark')

/** CSS that paints the mark for the theme: light, or dark when the system or data-theme says. */
function themeCss(cls: (part: string) => string): string {
  const rules = (p: { light: string; shade: string }, scope = '') =>
    [
      `${scope}${cls('light')} { fill: ${p.light}; }`,
      `${scope}${cls('shade')} { fill: ${p.shade}; }`,
    ].join('\n')
  return [
    rules(onLight),
    '@media (prefers-color-scheme: dark) {',
    ...rules(onDark, ":root:not([data-theme='light']) ")
      .split('\n')
      .map((line) => `  ${line}`),
    '}',
    rules(onDark, ":root[data-theme='dark'] "),
  ].join('\n')
}

function react(): string {
  return `// The Lumovi mark, for the app. Built by lumovi-design (npm run build): change it there.
import { useId } from 'react'
import { cn } from '@renderer/lib/cn'

const css = (id: string) => \`
${themeCss((part) => `.\${id}-${part}`)}
\`

/** The Lumovi mark: a square, and light sweeping across it. It follows the app's theme. */
export function Logo({ className }: { className?: string }) {
  // useId() has colons, which CSS class names can't.
  const id = \`lumovi-\${useId().replace(/[^a-zA-Z0-9-]/g, '')}\`
  return (
    <svg viewBox="0 0 ${GRID} ${GRID}" aria-hidden className={cn('size-7', className)}>
      <style>{css(id)}</style>
      <path className={\`\${id}-shade\`} d="${shade}" />
      <path className={\`\${id}-light\`} d="${light}" />
    </svg>
  )
}
`
}

function astro(): string {
  return `---
// The Lumovi mark, for the website. Built by lumovi-design (npm run build): change it there.
/** The Lumovi mark: a square, and light sweeping across it. It follows the site's theme. */
interface Props {
  size?: number
  class?: string
}
const { size = 28, class: className } = Astro.props
const id = \`lumovi-\${Math.random().toString(36).slice(2, 8)}\`
const css = \`
${themeCss((part) => `.\${id}-${part}`)}
\`
---

<svg viewBox="0 0 ${GRID} ${GRID}" width={size} height={size} aria-hidden="true" class={className}>
  <style set:html={css}></style>
  <path class={\`\${id}-shade\`} d="${shade}"></path>
  <path class={\`\${id}-light\`} d="${light}"></path>
</svg>
`
}

function head(): string {
  return `<!-- Lumovi's icons and link previews, for ${address(site.website)}. Copy icons/web/ to the
     site's root, and social/og/lumovi.png to /og.png. -->
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="${gray[950]}" />
<meta property="og:image" content="${site.website}/og.png" />
<meta property="og:image:width" content="2400" />
<meta property="og:image:height" content="1260" />
<meta property="og:image:alt" content="${name}. ${tagline.join(' ')} ${description}" />
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
