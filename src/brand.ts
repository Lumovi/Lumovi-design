/** Lumovi's name, words and addresses: the one place they're written down. */

export const name = 'Lumovi'

/** The headline, in two lines: the first bright, the second quieter. */
export const tagline = ['Your clusters,', 'at a glance.']

/** What Lumovi is: the one line, the same everywhere. */
export const sentence =
  'Lumovi is a calm, fast Kubernetes dashboard, on your desktop or in your cluster.'

/** The line, for a description or another short field. */
export const description = 'A calm, fast Kubernetes dashboard, on your desktop or in your cluster.'

export const site = {
  /** What Lumovi does, and where to get it. */
  website: 'https://lumovi.dev',
  docs: 'https://docs.lumovi.dev',
} as const

/** An address as people read it: without its scheme. */
export const address = (url: string): string => url.replace(/^https?:\/\//, '')
