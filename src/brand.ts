/** Lumovi's name, words and addresses: the one place they're written down. */

export const name = 'Lumovi'

/** The headline, in two lines: the first bright, the second quieter. */
export const tagline = ['Your clusters,', 'at a glance.']

/** What Lumovi is, in a sentence. */
export const description =
  'A beautiful, fast Kubernetes dashboard. On your desktop, or in your cluster.'

export const site = {
  /** What Lumovi does, and where to get it. */
  website: 'https://lumovi.dev',
  docs: 'https://docs.lumovi.dev',
} as const

/** An address as people read it: without its scheme. */
export const address = (url: string): string => url.replace(/^https?:\/\//, '')
