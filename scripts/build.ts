// Builds every asset in this repository from src/. Each file in scripts/tasks/ builds one
// folder (or a few), in order.
//
//   npm run build                  everything
//   npm run build -- logo icons    only the tasks whose names match
//   npm run build -- --vector      only text files (SVG, CSS, JSON): fast
//   npm run build -- --check       whether the text files are up to date with src/ (for CI)
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { closeRenderer } from './lib/render.ts'
import { context, root, type Run, type Task } from './lib/task.ts'

const args = process.argv.slice(2)
const check = args.includes('--check')
const raster = !check && !args.includes('--vector')
const only = args.filter((arg) => !arg.startsWith('--'))

const dir = join(import.meta.dirname, 'tasks')
const tasks: Task[] = []
for (const file of readdirSync(dir)
  .filter((f) => f.endsWith('.ts'))
  .sort()) {
  const { default: task } = (await import(join(dir, file))) as { default: Task }
  if (only.length === 0 || only.some((name) => task.name.includes(name))) tasks.push(task)
}

const stale: string[] = []
try {
  for (const task of tasks) {
    const started = performance.now()
    if (raster) {
      for (const out of task.outputs) rmSync(join(root, out), { recursive: true, force: true })
    }
    const run: Run = { raster, check, written: [], stale }
    await task.build(context(run))
    const seconds = ((performance.now() - started) / 1000).toFixed(1)
    console.log(
      `${task.name.padEnd(12)} ${String(run.written.length).padStart(4)} files  ${seconds}s`,
    )
  }
} finally {
  await closeRenderer()
}

if (stale.length > 0) {
  console.error(
    `\nOut of date with src/ (run npm run build):\n${stale.map((p) => `  ${p}`).join('\n')}`,
  )
  process.exitCode = 1
}
