// What each build task gets: where to write, and whether to render images this time.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { writeJpeg, writePng } from './render.ts'

export const root = join(import.meta.dirname, '..', '..')

export interface Context {
  /** False for `--vector` and `--check` builds, which make only text files (SVG, CSS, JSON, …). */
  raster: boolean
  /** Writes a text file, relative to the repository's root. */
  text(path: string, content: string): void
  /** Writes a binary file, relative to the repository's root. */
  file(path: string, content: Buffer): void
  /** Writes a PNG, losslessly compressed, relative to the repository's root. */
  png(path: string, png: Buffer): Promise<void>
  /** Writes a JPEG from a PNG, relative to the repository's root. */
  jpeg(path: string, png: Buffer, quality?: number): Promise<void>
}

export interface Task {
  name: string
  /** The folders this task owns: emptied before a full build, so nothing stale stays behind. */
  outputs: string[]
  build(ctx: Context): Promise<void>
}

export interface Run {
  raster: boolean
  /** Compare with the files instead of writing them, and list the ones that differ. */
  check: boolean
  written: string[]
  stale: string[]
}

export function context(run: Run): Context {
  const put = (path: string, content: string | Buffer) => {
    const full = join(root, path)
    if (run.check) {
      if (!existsSync(full) || !readFileSync(full).equals(Buffer.from(content)))
        run.stale.push(path)
    } else {
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, content)
    }
    run.written.push(path)
  }
  return {
    raster: run.raster,
    text(path, content) {
      put(path, content.endsWith('\n') ? content : `${content}\n`)
    },
    file(path, content) {
      put(path, content)
    },
    async png(path, png) {
      await writePng(join(root, path), png)
      run.written.push(path)
    },
    async jpeg(path, png, quality) {
      await writeJpeg(join(root, path), png, quality)
      run.written.push(path)
    },
  }
}
