/**
 * Health: the one set of statuses the app, the docs, the website and the brand share. Five
 * levels, in the order lists sort them, each with a color, an icon and a name, and never shown
 * as color alone.
 *
 * Progressing is neutral, moving: blue is only for what you can act on. There's no level
 * between warning and critical; the app has nothing it would mean, and an orange between amber
 * and red is hard to tell apart, more so for color-blind readers.
 */
import { PILL_FILL, status, themes, type Scheme, type StatusColor } from './colors.ts'

export type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

export interface Health {
  level: Level
  /** The level's name, in the guidelines and the docs. */
  name: string
  /** What the app calls it in filter chips, where a list has no word of its own. */
  filter: string
  /** The status color it's drawn in: its mark, and its *-text token for words. */
  color: StatusColor
  /** The Lucide icon on its pill. */
  icon: keyof typeof icons
  means: string
  /** A label it might carry in the app. */
  example: string
}

export const levels: Health[] = [
  {
    level: 'critical',
    name: 'Critical',
    filter: 'Failing',
    color: 'critical',
    icon: 'circle-x',
    means: 'Broken, and won’t fix itself: a crash loop, a failed job, a node that isn’t ready.',
    example: 'CrashLoopBackOff',
  },
  {
    level: 'warning',
    name: 'Warning',
    filter: 'Warning',
    color: 'warn',
    icon: 'triangle-alert',
    means: 'Working, but not as it should: degraded, under pressure, pending, terminating.',
    example: 'Degraded',
  },
  {
    level: 'progressing',
    name: 'Progressing',
    filter: 'In progress',
    color: 'neutral',
    icon: 'circle-dashed',
    means: 'On its way: creating containers, reconciling, running a job.',
    example: 'ContainerCreating',
  },
  {
    level: 'healthy',
    name: 'Healthy',
    filter: 'Healthy',
    color: 'good',
    icon: 'circle-check',
    means: 'Doing what it’s meant to.',
    example: 'Running',
  },
  {
    level: 'neutral',
    name: 'Neutral',
    filter: 'Inactive',
    color: 'neutral',
    icon: 'circle-minus',
    means: 'Nothing to worry about: completed, suspended, scaled to zero.',
    example: 'Completed',
  },
]

/**
 * How progressing moves, the same everywhere: its dot pulses, and the dashed circle on its
 * pill turns. Both hold still for people who ask for reduced motion, and the icon and the word
 * still say it.
 */
export const motion = {
  pulse: { opacity: 0.45, duration: '2s', easing: 'ease-in-out' },
  turn: { duration: '3s', easing: 'linear' },
} as const

/** The icons, from Lucide (ISC license), as the app draws them: a 24-unit box, stroked. */
export const icons = {
  'circle-x': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  'triangle-alert':
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'circle-dashed':
    '<path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>',
  'circle-minus': '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>',
} as const

/** An icon as inline SVG, in the current text color. */
export function icon(name: keyof typeof icons, size: number, stroke = 2.25): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`
}

/** A status's dot, as lists show it; progressing's is drawn mid-pulse, with a halo. */
export function dot(h: Health, scheme: Scheme): string {
  const halo = h.level === 'progressing' ? `;box-shadow:0 0 0 3px ${status[scheme].neutral}4d` : ''
  return `<span style="display:inline-block;width:8px;height:8px;border-radius:4px;flex:none;background:${status[scheme][h.color]}${halo}"></span>`
}

/** A status's pill, as the app draws it: its words on its mark at PILL_FILL, with its icon. */
export function pill(h: Health, scheme: Scheme, label = h.example): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(status[scheme][h.color].slice(i, i + 2), 16))
  return `<span style="display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px 0 7px;border-radius:12px;background:rgb(${r} ${g} ${b} / ${PILL_FILL});color:${themes[scheme][`${h.color}-text`]};font-size:12.5px;font-weight:550;white-space:nowrap">${icon(h.icon, 14)}${label}</span>`
}
