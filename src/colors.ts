/**
 * Lumovi's colors: the one place they're defined. Everything else (the tokens in colors/,
 * the logo, the icons and the media) is built from here.
 *
 * The brand is black, white and gray: true neutral grays, without a tint, so the product and
 * what it shows come first. Color is kept for meaning: blue for what you can act on (as in
 * Apple's interfaces), and the app's status and chart colors for what they say.
 */

export const gray = {
  50: '#fafafa',
  100: '#f5f5f5',
  150: '#efefef',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#8f8f8f',
  600: '#737373',
  // Quiet text on light: 4.5:1 on every light surface, gray 150 included.
  650: '#6b6b6b',
  700: '#525252',
  750: '#404040',
  800: '#262626',
  850: '#212121',
  900: '#181818',
  925: '#121212',
  950: '#0a0a0a',
} as const

/** Blue, for what you can act on: links, buttons, focus and selection. Not the brand. */
export const blue = {
  50: '#eff7ff',
  100: '#dcebfe',
  200: '#bfdcff',
  300: '#8cc2ff',
  400: '#5ea2f0',
  500: '#3987e5',
  // Text in it, and white text on it, reach 4.5:1 (WCAG AA) on white.
  600: '#2675d3',
  700: '#1c5cab',
  800: '#184789',
  900: '#153365',
  950: '#112242',
} as const

export const INK = gray[950]
export const PAPER = '#ffffff'

/** The named colors of the brand, as the guidelines present them. */
export const brand = {
  ink: {
    name: 'Ink',
    hex: INK,
    use: 'Text, the logo, and the light in the mark on light backgrounds.',
  },
  graphite: { name: 'Graphite', hex: gray[800], use: 'Dark surfaces, and the app icon.' },
  silver: {
    name: 'Silver',
    hex: gray[400],
    use: 'Quieter text on dark backgrounds.',
  },
  mist: { name: 'Mist', hex: gray[300], use: 'Lines, and the mark’s shade on light.' },
  paper: { name: 'Paper', hex: PAPER, use: 'Light surfaces, and the logo on dark.' },
  blue: {
    name: 'Blue',
    hex: blue[600],
    use: 'Only for what you can act on: links, buttons, focus.',
  },
} as const

/**
 * The status colors, for marks: dots, bars, and a pill's fill. Each reaches 3:1 on every
 * surface of its theme, as WCAG asks of marks; only warn differs, deeper on light. Words in a
 * status color use the theme's *-text tokens. src/health.ts says which level uses which, and
 * a status color always comes with an icon and a word, never on its own.
 */
export const status = {
  light: { good: '#009e00', warn: '#bd7800', critical: '#d03b3b', neutral: gray[600] },
  dark: { good: '#009e00', warn: '#fab219', critical: '#d03b3b', neutral: gray[600] },
} as const

export type StatusColor = keyof (typeof status)['light']

/** A status pill's fill: its mark, at this opacity, over whatever the pill is on. */
export const PILL_FILL = 0.12

/** Categorical colors for charts, in order: neighbors stay apart for color-blind readers. */
export const series = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'],
  other: { light: '#a3a29d', dark: '#5f5e5a' },
} as const

/** The app's semantic tokens, per theme: what the app, the website and the docs use. */
export const themes = {
  light: {
    'app-bg': gray[100],
    surface: PAPER,
    'surface-2': gray[50],
    'surface-3': gray[150],
    line: 'rgb(0 0 0 / 0.08)',
    'line-strong': 'rgb(0 0 0 / 0.14)',
    'text-1': INK,
    'text-2': gray[700],
    'text-3': gray[650],
    // Blue for fills, rings and icons; blue words use accent-strong, 4.5:1 on every surface.
    // White labels on a fill reach 4.5:1 at rest and on hover, which deepens it.
    accent: blue[600],
    'accent-strong': blue[700],
    'accent-hover': blue[700],
    'accent-soft': 'rgb(38 117 211 / 0.1)',
    'accent-track': blue[100],
    // Words in a status color: 4.5:1 on every surface, and on the status's pill over each.
    'good-text': '#00732b',
    'warn-text': '#8a5a00',
    'critical-text': '#b42318',
    'neutral-text': gray[700],
    // A danger button: white on critical, deepening on hover.
    'critical-hover': '#bb3535',
  },
  dark: {
    'app-bg': gray[950],
    surface: gray[925],
    'surface-2': gray[900],
    'surface-3': gray[850],
    line: 'rgb(255 255 255 / 0.07)',
    'line-strong': 'rgb(255 255 255 / 0.12)',
    'text-1': '#ededed',
    'text-2': gray[400],
    'text-3': gray[500],
    accent: blue[600],
    'accent-strong': blue[400],
    'accent-hover': blue[700],
    'accent-soft': 'rgb(57 135 229 / 0.16)',
    'accent-track': 'rgb(57 135 229 / 0.2)',
    'good-text': '#3fb950',
    'warn-text': '#e3a008',
    'critical-text': '#fc554c',
    'neutral-text': gray[400],
    'critical-hover': '#bb3535',
  },
} as const

export type Scheme = keyof typeof themes
