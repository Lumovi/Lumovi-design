// sources/: the pictures the launch art is made from, which come from other repositories.
// `npm run sources` takes them again: the app's screenshots as published (Lumovi's
// docs/screenshots, through jsDelivr), and from a Lumovi-marketing checkout beside this one,
// the videos' frames, rendered there first with `npm run stills` from both the dark and the
// light versions of each video, and the app's screens as captured there for the videos.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import sharp from 'sharp'
import { sources } from '../src/launch.ts'
import { root } from './lib/task.ts'

const SCREENSHOTS = 'https://cdn.jsdelivr.net/gh/Lumovi/Lumovi@main/docs/screenshots'
const MARKETING = resolve(process.env.LUMOVI_MARKETING ?? join(root, '..', 'Lumovi-marketing'))

const out = (path: string) => {
  const full = join(root, 'sources', path)
  mkdirSync(dirname(full), { recursive: true })
  return full
}

for (const path of sources.screenshots) {
  const name = path.slice('screenshots/'.length)
  const response = await fetch(`${SCREENSHOTS}/${name}`)
  if (!response.ok) throw new Error(`${name}: ${response.status} ${response.statusText}`)
  writeFileSync(out(path), Buffer.from(await response.arrayBuffer()))
  console.log(`sources/${path}`)
}

const missing: string[] = []
for (const { still: name, file } of sources.posters) {
  const still = join(MARKETING, 'out', 'stills', name)
  if (!existsSync(still)) {
    missing.push(name)
    continue
  }
  // Lossless, a third of the PNG's size.
  await sharp(still).webp({ lossless: true, effort: 6 }).toFile(out(file))
  console.log(`sources/${file}`)
}
for (const { still: name, file } of sources.site) {
  const still = join(MARKETING, 'out', 'stills', name)
  if (!existsSync(still)) {
    missing.push(name)
    continue
  }
  await sharp(still).webp({ lossless: true, effort: 6 }).toFile(out(file))
  console.log(`sources/${file}`)
}
if (missing.length) {
  console.error(
    `\nThese frames aren't in ${MARKETING}/out/stills: render them there (npm run stills), then run this again.\n${missing.map((m) => `  ${m}`).join('\n')}`,
  )
  process.exitCode = 1
}

const uncaptured: string[] = []
for (const { capture: name, file } of sources.captures) {
  const capture = join(MARKETING, 'public', 'captures', name)
  if (!existsSync(capture)) {
    uncaptured.push(name)
    continue
  }
  // Captured at three times the window's size, kept at twice: the screenshots' size.
  await sharp(capture).resize(2880, 1800).webp({ lossless: true, effort: 6 }).toFile(out(file))
  console.log(`sources/${file}`)
}
if (uncaptured.length) {
  console.error(
    `\nThese screens aren't in ${MARKETING}/public/captures: capture them there (npm run capture), then run this again.\n${uncaptured.map((m) => `  ${m}`).join('\n')}`,
  )
  process.exitCode = 1
}
