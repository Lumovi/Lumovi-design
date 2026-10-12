/**
 * The clusters page's "Kubeconfig files" popover when Lumovi notices kubeconfig changes
 * (LMV-168): folders added beside files, what a folder holds and what it skipped, a file kept as
 * last read while it can't be read, and the list a policy keeps. The popover is today's,
 * 440 px; the desktop app's only. Drawn before it's built.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'

const CSS = `
body { margin: 0; background: var(--app-bg); font-family: 'Inter', sans-serif; font-size: 13px; line-height: 20px; color: var(--text-1); -webkit-font-smoothing: antialiased; }
.sheet { display: flex; flex-direction: column; gap: 32px; padding: 32px; }
.sheet > header h1 { margin: 0; font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
.sheet > header p { margin: 4px 0 0; max-width: 820px; color: var(--text-2); }
.spec { display: flex; min-width: 0; flex-direction: column; gap: 12px; }
.spec > h2 { display: flex; align-items: baseline; gap: 10px; margin: 0; font-size: 13px; font-weight: 600; }
.spec > h2 i { font-style: normal; font-weight: 400; color: var(--text-3); }
.spec > p { margin: 0; max-width: 820px; font-size: 12px; line-height: 18px; color: var(--text-2); }
.spec > p b { font-weight: 600; color: var(--text-1); }
.spec > p code, td code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: var(--text-1); }
.row { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: flex-start; }
.cap { margin: 0 0 6px; font-size: 12px; color: var(--text-3); }
.pop { width: 440px; overflow: hidden; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.pop .hd { display: flex; align-items: baseline; justify-content: space-between; padding: 12px 14px 6px; }
.pop .hd b { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
.pop .hd span { font-size: 12px; color: var(--text-3); }
.pop .files { padding-bottom: 4px; }
.fr { display: flex; align-items: center; gap: 10px; margin: 0 4px; padding: 8px 10px; border-radius: 8px; }
.fr.hov { background: var(--surface-3); }
.fr > svg.i { flex: none; color: var(--text-3); }
.fr.warn > svg.i { color: var(--warn-text); }
.fr.crit > svg.i { color: var(--critical-text); }
.fr .tw { display: grid; width: 16px; height: 16px; flex: none; place-items: center; margin-right: -4px; color: var(--text-3); }
.fr .tw.none { visibility: hidden; }
.fr .m { min-width: 0; flex: 1; }
.fr .path { display: block; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; direction: rtl; text-align: left; color: var(--text-1); }
.fr .note { display: block; overflow: hidden; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-3); }
.fr.warn .note { white-space: normal; color: var(--warn-text); }
.fr.crit .note { color: var(--critical-text); }
.fr .bt { display: flex; flex: none; gap: 2px; }
.fr .bt span { display: grid; width: 26px; height: 26px; place-items: center; border-radius: 6px; color: var(--text-2); }
.fr.kid { margin-left: 30px; padding-top: 5px; padding-bottom: 5px; }
.fr.kid .path { direction: ltr; }
.sk { margin: 0 4px 0 34px; padding: 2px 10px 6px; }
.sk .sh { display: flex; height: 26px; align-items: center; gap: 6px; font-size: 12px; color: var(--text-3); }
.sk .si { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 12px; padding: 2px 0 2px 22px; font-size: 12px; line-height: 18px; }
.sk .si code { overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; white-space: nowrap; text-overflow: ellipsis; color: var(--text-2); }
.sk .si span { color: var(--text-3); }
.acts { padding: 4px; border-top: 1px solid var(--line); }
.ai { display: flex; height: 32px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; }
.ai > svg.i { color: var(--text-2); }
.ai.hl { background: var(--surface-3); }
.ai small { margin-left: auto; font-size: 12px; color: var(--text-3); }
.ai code { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.foot { display: flex; gap: 8px; padding: 10px 14px 12px; border-top: 1px solid var(--line); font-size: 12px; line-height: 18px; color: var(--text-3); }
.foot > svg.i { flex: none; margin-top: 2px; }
`

const fileRow = (
  glyph: IconName,
  path: string,
  note: string,
  o: {
    kind?: 'warn' | 'crit'
    hov?: boolean
    buttons?: IconName[]
    tw?: 'open' | 'shut' | 'none'
    kid?: boolean
  } = {},
) =>
  `<div class="fr${o.kind ? ` ${o.kind}` : ''}${o.hov ? ' hov' : ''}${o.kid ? ' kid' : ''}">${o.tw ? `<span class="tw${o.tw === 'none' ? ' none' : ''}">${icon(o.tw === 'open' ? 'chevron-down' : 'chevron-right', 14)}</span>` : ''}${icon(glyph, 16)}<span class="m"><span class="path"><bdi>${path}</bdi></span><span class="note">${note}</span></span>${o.buttons ? `<span class="bt">${o.buttons.map((b) => `<span>${icon(b, 15)}</span>`).join('')}</span>` : ''}</div>`

const skipped = (open: boolean, items: [string, string][]) =>
  `<div class="sk"><div class="sh">${icon(open ? 'chevron-down' : 'chevron-right', 14)}${items.length} skipped</div>${open ? items.map(([n, r]) => `<div class="si"><code>${n}</code><span>${r}</span></div>`).join('') : ''}</div>`

const ACTIONS = (hl = '') =>
  `<div class="acts"><div class="ai">${icon('file-input', 16)}Choose a kubeconfig…<small>Use only that file</small></div><div class="ai">${icon('file-plus', 16)}Add another file…</div><div class="ai${hl === 'folder' ? ' hl' : ''}">${icon('folder-plus', 16)}Add a folder…<small>Every kubeconfig in it</small></div><div class="ai">${icon('rotate-ccw', 16)}Back to <code>KUBECONFIG</code> and <code>~/.kube/config</code></div></div>`

const FOOT = `<div class="foot">${icon('info', 14)}<span>Lumovi reads these files and never writes to them. Removing one only stops Lumovi reading it. A change to them shows here within a second.</span></div>`

const pop = (rows: string, o: { locked?: boolean; hl?: string } = {}) =>
  `<div class="pop"><div class="hd"><b>Kubeconfig files</b><span>${o.locked ? 'Managed' : 'Merged as kubectl does'}</span></div><div class="files">${rows}</div>${o.locked ? '' : ACTIONS(o.hl)}${o.locked ? `<div class="foot">${icon('lock', 14)}<span>Your organization’s policy keeps Lumovi to these files.</span></div>` : FOOT}</div>`

function folders(): string {
  const main = pop(
    [
      fileRow('file-text', '~/.kube/config', '3 contexts'),
      fileRow('folder', '~/clusters', '3 kubeconfigs · 5 contexts · 5 skipped', {
        tw: 'open',
        hov: true,
        buttons: ['folder-open', 'x'],
      }),
      fileRow('file-text', 'production.yaml', '2 contexts', { kid: true }),
      fileRow('file-text', 'staging.yaml', '2 contexts · 1 asks before it runs', { kid: true }),
      fileRow(
        'file-warning',
        'lab.yaml',
        'Couldn’t read it at 10:43: it’s being written, or isn’t whole. Showing what it had at 10:42.',
        { kid: true, kind: 'warn' },
      ),
      skipped(true, [
        ['archive/', 'A folder: folders inside aren’t read'],
        ['shared.yaml', 'A link that leads out of the folder'],
        ['.prod.yaml.swp', 'Hidden, or an editor’s temporary file'],
        ['dump.yaml', 'Larger than 1 MB'],
        ['README.md', 'Not a kubeconfig'],
      ]),
      fileRow(
        'folder',
        '~/work/platform-team/kubeconfigs/eu-central',
        '12 kubeconfigs · 31 contexts',
        { tw: 'shut' },
      ),
    ].join(''),
    { hl: 'folder' },
  )
  return `<section class="spec"><h2>Folders<i>beside files; a folder’s kubeconfigs under it</i></h2>
    <div class="row">
      <div><p class="cap">Two folders: one open with its kubeconfigs and what it skipped, one shut</p>${main}</div>
      <div style="width:620px">
        <p><b>“Add a folder…”</b> comes after “Add another file…”, with the folder-and-plus icon and “Every kubeconfig in it” at the right; it opens the system’s folder picker. Each folder added is a row of its own, in the order added, after the files.</p><p style="margin-top:10px"><b>The order they merge in</b> is the order drawn: the files, then each folder in the order added, its kubeconfigs in name order. As kubectl does, the first to name a cluster, user or context wins, so the list is also which wins.</p>
        <p style="margin-top:10px"><b>A folder’s row</b> is a file’s row with a folder’s icon and a disclosure chevron before it. Its path is cut from the start, as a file’s is, and its note gives the counts: “3 kubeconfigs · 5 contexts · 5 skipped”, each part left out when it’s nothing. Show in Finder and Remove are its buttons, on hover or focus, as a file’s. Removing a folder stops Lumovi reading it, and everything in it.</p>
        <p style="margin-top:10px">Today <code>~/.kube/config</code> has a folder’s icon; with folders as rows it takes a file’s, so a folder’s icon only ever means a folder.</p><p style="margin-top:10px"><b>Its kubeconfigs are rows of their own</b>, set in under it: the file’s name only (the folder says where), its own note, and only Show in Finder, since one can’t be removed apart from its folder. That way a file with a problem says which one, where a count alone couldn’t. A folder with five or fewer is open as the popover opens; past five it’s shut, and the chevron opens it. Past twelve rows in all, the list scrolls inside the popover; the actions and foot stay.</p>
        <p style="margin-top:10px"><b>What it skipped</b> is the folder’s last line, “5 skipped”, shut until pressed; open, each is its name in mono and its reason, quiet: a folder inside (“folders inside aren’t read”), a link that leads out of the folder, hidden or an editor’s temporary file, larger than 1 MB, not a kubeconfig. Skipping is never a problem: it’s quiet, not amber. A folder with nothing in it says “No kubeconfigs in it”, quietly.</p><p style="margin-top:10px"><b>A folder’s files are trusted as a pasted cluster is</b>: a context whose credentials run a program, send a file or go to a server that isn’t verified asks first, in the app’s existing “Allow and continue” dialog, before its first use and again after any change to its command. Contexts with a token or a certificate work at once. The kubeconfig’s note says how many ask first (“2 contexts · 1 asks before it runs”), quiet, so nobody meets the dialog by surprise; the words are docs’.</p>
      </div>
    </div>
  </section>`
}

function states(): string {
  const kept = pop(
    [
      fileRow('file-text', '~/.kube/config', '3 contexts'),
      fileRow(
        'file-warning',
        '~/work/aws/eks-prod.yaml',
        'Couldn’t read it at 10:43: line 14 isn’t valid YAML. Showing what it had at 10:42.',
        { kind: 'warn', buttons: ['folder-open', 'x'] },
      ),
      fileRow('file-warning', '~/work/gone.yaml', 'Not there any more', {
        kind: 'crit',
        buttons: ['file-input', 'x'],
      }),
    ].join(''),
  )
  const locked = pop(
    [
      fileRow('file-text', '/etc/lumovi/kubeconfigs/production', '4 contexts'),
      fileRow('folder', '/etc/lumovi/kubeconfigs/teams', '6 kubeconfigs · 14 contexts', {
        tw: 'shut',
      }),
    ].join(''),
    { locked: true },
  )
  return `<section class="spec"><h2>A file kept as last read; the list a policy keeps<i>milder than a file that’s gone</i></h2>
    <div class="row">
      <div><p class="cap">One kept as last read (amber), one gone (critical, as today)</p>${kept}</div>
      <div><p class="cap">The organisation’s policy keeps the list: no actions, no Remove; a folder still a row</p>${locked}</div>
      <div style="width:620px">
        <p><b>A file that can’t be read while it’s being written</b>, or is broken, keeps the contexts it last had, so its clusters still work. Its row says so in the warning colour with the file-and-warning icon: “Couldn’t read it at 10:43: <i>why</i>. Showing what it had at 10:42.”, wrapping to a second line rather than cut, since the reason is the point. It goes back to the quiet note by itself the moment the file reads again. <b>Amber, not red</b>: red stays for what’s lost, a file that’s gone or that never read, as today. The footer’s button counts a kept file as a warning, as it counts any file that can’t be read while others can; it never makes it critical. The same in a folder’s kubeconfig row.</p>
        <p style="margin-top:10px"><b>When a policy keeps the list</b>, there are no actions, so no “Add a folder…”, and no Remove on any row; a folder the policy names is a row as any, its kubeconfigs and skipped files under it. The foot is today’s “Your organization’s policy keeps Lumovi to these files.” with the lock.</p>
        <p style="margin-top:10px"><b>A change shows by itself</b>, within about a second: a file’s note, a folder’s counts, a row that comes or goes, and the clusters page behind. Nothing flashes; a row that changes doesn’t move. The foot says it once: “A change to them shows here within a second.” The words are docs’.</p>
      </div>
    </div>
  </section>`
}

export type KubeconfigsFrame = 'kubeconfigs'

export const KUBECONFIGS_FRAMES: { id: KubeconfigsFrame; title: string; size: Size }[] = [
  {
    id: 'kubeconfigs',
    title: 'Kubeconfig folders and changes',
    size: { width: 1440, height: 1600 },
  },
]

/** The frame, in one theme. */
export function kubeconfigsFrame(_id: KubeconfigsFrame, scheme: Scheme): string {
  const f = KUBECONFIGS_FRAMES[0]!
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${f.size.width}px; }
${PARTS.split('\n')
  .filter((l) => /^(\* |svg\.i|\.btn)/.test(l))
  .join('\n')}
${CSS}
</style><div class="sheet"><header><h1>Kubeconfig folders, and changes noticed</h1><p>The clusters page’s “Kubeconfig files” popover, as today, grows folders: a folder added reads every kubeconfig in it, and says what it skipped and why. A file that can’t be read while it’s written keeps what it had. The desktop app’s only.</p></header>${folders()}${states()}</div>`
}
