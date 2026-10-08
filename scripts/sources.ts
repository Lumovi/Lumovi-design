// sources/: the pictures the launch art is made from, which come from other repositories.
// `npm run sources` takes them again: the app's screenshots as published (Lumovi's
// docs/screenshots, through jsDelivr), and the videos' frames from a Lumovi-marketing checkout
// beside this one, rendered there first with `npm run stills`.
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
for (const { id, second, file } of sources.posters) {
  const still = join(MARKETING, 'out', 'stills', `${id}-${second.toFixed(1)}.png`)
  if (!existsSync(still)) {
    missing.push(`npm run stills -- ${id} ${second.toFixed(1)}`)
    continue
  }
  // Lossless, a third of the PNG's size.
  await sharp(still).webp({ lossless: true, effort: 6 }).toFile(out(file))
  console.log(`sources/${file}`)
}
if (missing.length) {
  console.error(
    `\nSome frames are missing. In ${MARKETING}, run:\n${missing.map((m) => `  ${m}`).join('\n')}\nthen this again.`,
  )
  process.exitCode = 1
}
