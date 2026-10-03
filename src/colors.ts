/**
 * Lumovi's colors: the one place they're defined. Everything else (the tokens in colors/,
 * the logo, the icons and the media) is built from here.
 *
 * Blue carries the brand. The scale keeps the app's accents (400–700) and fills in the
 * rest in OKLCH, at the same hue. Night is the deep navy of the app icon and the hero
 * glows. Gray is the app's neutrals, which lean very slightly toward the blue.
 */

export const blue = {
  50: '#eff7ff',
  100: '#dcebfe',
  200: '#bfdcff',
  300: '#8cc2ff',
  400: '#5ea2f0',
  500: '#3987e5',
  // Lumovi Blue. A touch deeper than KubeStacks' #2a78d6, so text in it, and white text
  // on it, reach 4.5:1 (WCAG AA) on white.
  600: '#2675d3',
  700: '#1c5cab',
  800: '#184789',
  900: '#153365',
  950: '#112242',
} as const

export const night = {
  500: '#3e517c',
  600: '#2d3e67',
  700: '#1d2b4f',
  800: '#131d37',
  900: '#0a0f1f',
  950: '#040610',
} as const

export const gray = {
  50: '#fafafb',
  100: '#f5f5f6',
  150: '#f0f0f2',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#8b8b94',
  600: '#71717a',
  700: '#52525b',
  750: '#3f3f46',
  800: '#212126',
  850: '#18181c',
  900: '#121215',
  950: '#0c0c0e',
} as const

/** The named colors of the brand, as the guidelines present them. */
export const brand = {
  blue: {
    name: 'Lumovi Blue',
    hex: blue[600],
    use: 'The brand color: links, buttons and the logo on light backgrounds.',
  },
  daylight: { name: 'Daylight', hex: blue[500], use: 'Lumovi Blue on dark backgrounds.' },
  lumen: { name: 'Lumen', hex: blue[300], use: 'Light itself: the orb, glows and highlights.' },
  night: { name: 'Night', hex: night[900], use: 'The app icon and dark brand surfaces.' },
  ink: { name: 'Ink', hex: '#0b0b0f', use: 'Text and the one-color logo on light backgrounds.' },
  paper: {
    name: 'Paper',
    hex: '#ffffff',
    use: 'Light backgrounds, and the one-color logo on dark ones.',
  },
} as const

/**
 * Health, as the app shows it. The marks (dots, bars) are the same in both themes; text in a
 * status color uses the readable step for its theme. A status color always comes with a
 * label, never on its own.
 */
export const status = {
  good: '#0ca30c',
  warn: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
  neutral: '#898781',
} as const

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
    surface: '#ffffff',
    'surface-2': gray[50],
    'surface-3': gray[150],
    line: 'rgb(12 12 20 / 0.08)',
    'line-strong': 'rgb(12 12 20 / 0.14)',
    'text-1': brand.ink.hex,
    'text-2': gray[700],
    'text-3': gray[600],
    accent: blue[600],
    'accent-strong': blue[700],
    'accent-soft': 'rgb(38 117 211 / 0.1)',
    'accent-track': blue[100],
    'good-text': '#1a7f37',
    'warn-text': '#8a5a00',
    'serious-text': '#b4501f',
    'critical-text': '#b42318',
  },
  dark: {
    'app-bg': gray[950],
    surface: gray[900],
    'surface-2': gray[850],
    'surface-3': gray[800],
    line: 'rgb(255 255 255 / 0.07)',
    'line-strong': 'rgb(255 255 255 / 0.12)',
    'text-1': '#f2f2f4',
    'text-2': gray[400],
    'text-3': gray[500],
    accent: blue[500],
    'accent-strong': blue[400],
    'accent-soft': 'rgb(57 135 229 / 0.16)',
    'accent-track': 'rgb(57 135 229 / 0.2)',
    'good-text': '#3fb950',
    'warn-text': '#e3a008',
    'serious-text': '#f0883e',
    'critical-text': '#f85149',
  },
} as const

export type Scheme = keyof typeof themes
