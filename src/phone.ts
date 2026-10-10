/**
 * The server's web UI on a phone and a tablet: the parts a narrow screen needs that the app
 * doesn't have yet, drawn once with the app's own tokens, type sizes and icons, so every
 * screen is built from the same top bar, context row, drawer, sheet, row and footer. Mockups
 * for the design (LMV-203) and the pictures in the guidelines' "On a phone" section. They
 * share the clusters page's parts (src/clusters.ts): its buttons, menus, scrim and dialogs.
 *
 * Under 1024 px the shell is the top bar, the context row and the drawer. Under 640 px lists
 * become two-line rows, a detail becomes a page, and menus and dialogs become sheets. From
 * 1024 px nothing here applies.
 */
import { CSS as PARTS, tokens, type Size } from './clusters.ts'
import { type Scheme } from './colors.ts'
import { icon, type IconName } from './lucide.ts'
import { FONTS } from './scene.ts'
import { escape } from './svg.ts'

// ─── What's on the screens ─────────────────────────────────────────────────────────────────

export type Level = 'critical' | 'warning' | 'progressing' | 'healthy' | 'neutral'

/** A level's color token and its pill's icon, as the app's Status.tsx has them. */
const LEVELS: Record<Level, { color: string; icon: IconName }> = {
  critical: { color: 'critical', icon: 'circle-x' },
  warning: { color: 'warn', icon: 'triangle-alert' },
  progressing: { color: 'neutral', icon: 'circle-dashed' },
  healthy: { color: 'good', icon: 'circle-check' },
  neutral: { color: 'neutral', icon: 'circle-minus' },
}

interface Pod {
  name: string
  namespace: string
  level: Level
  status: string
  ready: string
  restarts: number
  age: string
}

const PODS: Pod[] = [
  {
    name: 'checkout-7d9f6c5b8-x2kqp',
    namespace: 'shop',
    level: 'critical',
    status: 'CrashLoopBackOff',
    ready: '0/1',
    restarts: 14,
    age: '2m',
  },
  {
    name: 'search-indexer-5c7d8-q9wzn',
    namespace: 'shop',
    level: 'warning',
    status: 'Unschedulable',
    ready: '0/1',
    restarts: 0,
    age: '11m',
  },
  {
    name: 'cart-5f6d7c8b9-abcde',
    namespace: 'shop',
    level: 'progressing',
    status: 'ContainerCreating',
    ready: '0/1',
    restarts: 0,
    age: '8s',
  },
  {
    name: 'storefront-6b8f9d7c4-2hjkl',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    age: '3d',
  },
  {
    name: 'storefront-6b8f9d7c4-9pqrs',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '2/2',
    restarts: 0,
    age: '3d',
  },
  {
    name: 'recommendations-84c5d6f7b8-mnopq',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '1/1',
    restarts: 1,
    age: '5d',
  },
  {
    name: 'payments-worker-7c8d9e0f1-tuvwx',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '9d',
  },
  {
    name: 'payments-worker-7c8d9e0f1-yzabc',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '9d',
  },
  {
    name: 'redis-0',
    namespace: 'shop',
    level: 'healthy',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '21d',
  },
  {
    name: 'db-migrate-28931-kq7tp',
    namespace: 'shop',
    level: 'neutral',
    status: 'Completed',
    ready: '0/1',
    restarts: 0,
    age: '6h',
  },
]

/** The longest things a row has to hold: names that differ only at their end, long statuses. */
const LONG: Pod[] = [
  {
    name: 'recommendations-model-server-84c5d6f7b8-mnopq',
    namespace: 'machine-learning-platform',
    level: 'critical',
    status: 'CreateContainerConfigError',
    ready: '0/2',
    restarts: 0,
    age: '2m',
  },
  {
    name: 'recommendations-model-server-84c5d6f7b8-zr4kd',
    namespace: 'machine-learning-platform',
    level: 'critical',
    status: 'Init:CrashLoopBackOff',
    ready: '0/2',
    restarts: 212,
    age: '2y70d',
  },
  {
    name: 'payments-worker-7c8d9e0f1-tuvwx',
    namespace: 'payments',
    level: 'healthy',
    status: 'Running',
    ready: '1/1',
    restarts: 0,
    age: '9d',
  },
  {
    name: 'payments-worker-7c8d9e0f1-yzabc',
    namespace: 'payments',
    level: 'warning',
    status: 'Not ready',
    ready: '0/1',
    restarts: 3,
    age: '9d',
  },
]

const CLUSTER = 'production-eu'
const NAMESPACES = ['shop', 'payments', 'search', 'monitoring', 'kube-system', 'ingress-nginx']

// ─── The rules, as functions ───────────────────────────────────────────────────────────────

/** How many characters a truncated name keeps at its end: a pod's suffix, and one to spare. */
export const TAIL = 6

/**
 * A name that gives way in the middle, so its end always shows: replicas differ only in their
 * last characters, and a name cut at its end makes them read the same. Its last six
 * characters never go. Its head is cut to whole characters by measuring (FIT), so the ellipsis
 * and the kept end meet: CSS's own ellipsis would leave up to a character of slack between them.
 */
export function middle(text: string): string {
  if (text.length <= TAIL * 2) return `<span class="mid"><span>${escape(text)}</span></span>`
  return `<span class="mid"><span>${escape(text.slice(0, -TAIL))}</span><span>${escape(text.slice(-TAIL))}</span></span>`
}

/** A status pill, as the app's StatusPill draws it: its level's icon, then its word. */
export function pill(level: Level, label: string): string {
  const l = LEVELS[level]
  return `<span class="spill" style="--m:var(--${l.color});color:var(--${l.color}-text)">${icon(l.icon, 14, 2.25)}<span>${escape(label)}</span></span>`
}

/** A status dot, where the app has one: the cluster switcher, a health chip, a tile's line. */
const dot = (level: Level, size = 8) =>
  `<i class="sdot" style="width:${size}px;height:${size}px;background:var(--${LEVELS[level].color})"></i>`

/** Cuts each name's head to the characters that fit, once the fonts are in. */
const FIT = `<script>
document.fonts.ready.then(() => {
  for (const mid of document.querySelectorAll('.mid')) {
    const head = mid.firstElementChild
    if (head.scrollWidth <= head.clientWidth) continue
    const text = head.textContent
    const room = mid.parentElement.clientWidth - (mid.lastElementChild.offsetWidth || 0)
    head.style.flex = 'none'
    head.style.overflow = 'visible'
    let n = text.length
    do head.textContent = text.slice(0, --n).replace(/[-. ]+$/, '') + '…'
    while (n > 1 && head.offsetWidth > room)
  }
})
</script>`

// ─── Styles ────────────────────────────────────────────────────────────────────────────────

const CSS = `
/* The frame: the page fills the screen, with no window chrome and no rounded panel. */
.phone { position: relative; display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--surface); }
.sdot { display: inline-block; flex: none; border-radius: 50%; box-shadow: 0 0 0 2px var(--surface); }
.spill { display: inline-flex; flex: none; max-width: 200px; height: 22px; align-items: center; gap: 4px; padding: 0 8px 0 6px; border-radius: 999px; background: color-mix(in srgb, var(--m) 12%, transparent); font-size: 12px; line-height: 16px; font-weight: 500; white-space: nowrap; }
.spill > span { overflow: hidden; text-overflow: ellipsis; }
.mid { display: flex; min-width: 0; white-space: nowrap; }
.mid > span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.mid > span + span { flex: none; }

/* 1. The top bar: 52 high, 44 px buttons, the page's title. */
.tb { display: flex; flex: none; height: 52px; align-items: center; padding: 0 4px; border-bottom: 1px solid var(--line); background: var(--surface); }
.tap { display: grid; flex: none; width: 44px; height: 44px; place-items: center; border-radius: 8px; color: var(--text-2); }
.tap.on { background: var(--surface-3); color: var(--text-1); }
.tb h1 { display: flex; flex: 1; min-width: 0; margin: 0; padding: 0 4px; overflow: hidden; font-size: 15px; line-height: 20px; font-weight: 600; letter-spacing: -0.01em; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.tb .badge { position: relative; }
.tb .badge::after { content: attr(data-n); position: absolute; top: 5px; right: 5px; display: grid; min-width: 14px; height: 14px; padding: 0 4px; place-items: center; border-radius: 999px; background: var(--text-1); font-size: 9px; font-weight: 600; color: var(--surface); }

/* 2. The context row: which cluster, which namespace. */
.ctx { display: flex; flex: none; height: 44px; align-items: center; gap: 8px; padding: 0 16px; border-bottom: 1px solid var(--line); background: var(--surface); }
.cchip { display: flex; min-width: 0; height: 32px; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.cchip.cluster { max-width: 60%; }
.cchip > span { overflow: hidden; text-overflow: ellipsis; }
.cchip svg.i { color: var(--text-3); }
.cchip.still { border-color: transparent; background: transparent; color: var(--text-3); }
.hit { position: relative; }
.hit::before { content: ''; position: absolute; inset: var(--hit, -6px) -4px; border: 1px dashed var(--accent); border-radius: 10px; }

/* The list's toolbar: a filter field, the label filter and Sort; then the count and chips. */
.ptools { flex: none; padding: 12px 16px 0; border-bottom: 1px solid var(--line); }
.ptools .r1 { display: flex; gap: 8px; }
.pfield { display: flex; flex: 1; min-width: 0; height: 44px; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); font-size: 16px; line-height: 24px; color: var(--text-1); white-space: nowrap; }
.pfield svg.i { color: var(--text-3); }
.pfield .ph { color: var(--text-3); }
.pfield.mono { font-family: 'JetBrains Mono', monospace; border-color: var(--line-strong); }
.pfield.focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.pfield.danger { border-color: var(--critical); box-shadow: 0 0 0 3px color-mix(in srgb, var(--critical) 15%, transparent); }
.tapb { display: grid; flex: none; width: 44px; height: 44px; place-items: center; border: 1px solid var(--line-strong); border-radius: 8px; background: var(--surface-2); color: var(--text-2); box-shadow: 0 1px 2px rgb(0 0 0 / 0.05); }
.tapb.on { background: var(--surface-3); color: var(--text-1); }
.ptools .r2 { display: flex; min-height: 44px; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 0; }
.ptools .n { margin-right: 4px; font-size: 13px; color: var(--text-2); font-variant-numeric: tabular-nums; }
.hchip { display: flex; height: 28px; align-items: center; gap: 6px; padding: 0 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; line-height: 16px; color: var(--text-2); white-space: nowrap; }
.hchip b { font-weight: 600; font-variant-numeric: tabular-nums; }
.hchip.on { border-color: transparent; background: var(--text-1); color: var(--surface); }
.hchip .sdot { box-shadow: none; }

/* 6. The two-line row: 60 high. The name and its status; then the facts and the age. */
.rows { flex: 1; min-height: 0; overflow: hidden; }
.prow { display: flex; height: 60px; flex-direction: column; justify-content: center; gap: 3px; padding: 0 16px; border-bottom: 1px solid var(--line); }
.prow.press { background: color-mix(in srgb, var(--surface-3) 50%, transparent); }
.prow .l1 { display: flex; min-width: 0; align-items: center; gap: 12px; }
.prow .nm { display: flex; flex: 1; min-width: 120px; overflow: hidden; font-size: 13px; line-height: 20px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.prow .l2 { display: flex; min-width: 0; gap: 12px; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; }
.prow .facts { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.prow .facts .warn { font-weight: 500; color: var(--warn-text); }
.prow .age { flex: none; font-variant-numeric: tabular-nums; }
.card .prow { padding: 0; }
.card .prow:last-child { border-bottom: 0; }

/* 3. The drawer: the sidebar, from the left, with 44 px items. */
.drawer { position: absolute; z-index: 30; top: 0; bottom: 0; left: 0; display: flex; width: min(320px, calc(100% - 56px)); flex-direction: column; border-right: 1px solid var(--line-strong); background: var(--app-bg); box-shadow: var(--shadow-pop); }
.switch-to { display: flex; margin: 12px; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); box-shadow: var(--shadow-panel); }
.switch-to .who { flex: 1; min-width: 0; }
.switch-to .who b { display: block; overflow: hidden; font-size: 13px; line-height: 20px; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.switch-to .who small { display: block; font-size: 12px; line-height: 16px; color: var(--text-3); }
.switch-to svg.i { color: var(--text-3); }
.switch-to .sdot { box-shadow: 0 0 0 2px var(--surface-2); }
.dnav { flex: 1; min-height: 0; overflow: hidden; padding: 0 12px 12px; }
.ditem { display: flex; height: 44px; align-items: center; gap: 10px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--text-2); }
.ditem svg.i { color: var(--text-3); }
.ditem.on { background: var(--surface-3); font-weight: 500; color: var(--text-1); box-shadow: inset 0 0 0 1px var(--line); }
.dnav h3 { margin: 16px 0 4px; padding: 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.dfoot { display: flex; flex: none; align-items: center; padding: 4px 8px; border-top: 1px solid var(--line); }
.dfoot .v { margin-left: auto; padding-right: 8px; font-size: 11px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.dfoot .me { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: var(--surface-3); font-size: 10px; font-weight: 600; color: var(--text-2); }
.dfoot .tap svg.i { width: 16px; height: 16px; }

.spons { flex: none; padding: 8px 12px 12px; border-top: 1px solid var(--line); }
.spons .cap { height: 16px; margin-bottom: 4px; padding: 0 10px; }
.scard { padding: 8px; border-radius: 12px; background: var(--surface-2); box-shadow: inset 0 0 0 1px var(--line); }
.scard i { display: block; height: 68px; border-radius: 4px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
.scard span { display: block; padding: 8px 2px 0; font-size: 12px; line-height: 16px; color: var(--text-2); }

/* 4. The sheet: every menu and picker on a phone. */
.sheet { position: absolute; z-index: 30; right: 0; bottom: 0; left: 0; display: flex; max-height: 85%; flex-direction: column; overflow: hidden; border: 1px solid var(--line-strong); border-bottom: 0; border-radius: 16px 16px 0 0; background: var(--surface-2); box-shadow: var(--shadow-pop); }
.sheet.tall { top: 24px; max-height: none; }
.grab { flex: none; width: 36px; height: 4px; margin: 8px auto 0; border-radius: 2px; background: var(--line-strong); }
.shead { display: flex; flex: none; height: 44px; align-items: center; padding: 0 4px 0 16px; }
.shead h2 { flex: 1; margin: 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.sheet > .pfield { flex: none; margin: 4px 16px 8px; }
.sitems { min-height: 0; overflow: hidden; padding: 0 8px 12px; }
.sitem { display: flex; height: 44px; align-items: center; gap: 10px; padding: 0 8px; border-radius: 8px; font-size: 13px; color: var(--text-1); white-space: nowrap; }
.sitem > span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.sitem svg.i { color: var(--text-3); }
.sitem .check { color: var(--accent); }
.sitem.press { background: var(--surface-3); }
.sitem small { flex: none; font-size: 11px; font-weight: 500; color: var(--warn-text); }
.sitem .dir { display: flex; flex: none; align-items: center; gap: 4px; font-size: 12px; color: var(--text-3); }
.ssep { height: 1px; margin: 4px; background: var(--line); }

/* 5. The tall sheet, and 9. its footer. */
.sheet .head { display: flex; flex: none; align-items: flex-start; gap: 12px; padding: 8px 4px 4px 16px; }
.sheet .head .glyph { display: grid; flex: none; width: 36px; height: 36px; margin-top: 4px; place-items: center; border-radius: 12px; background: var(--surface-3); color: var(--text-2); }
.sheet .head .glyph.ask { background: var(--accent-soft); color: var(--accent-strong); }
.sheet .head .t { flex: 1; min-width: 0; padding-top: 4px; }
.sheet .head .eyebrow { display: flex; align-items: center; gap: 4px; font-size: 12px; line-height: 16px; font-weight: 500; color: var(--accent-strong); }
.sheet .head h2 { margin: 2px 0 0; font-size: 15px; line-height: 21px; font-weight: 600; }
.sheet .head .sub { display: flex; min-width: 0; flex-wrap: wrap; align-items: center; gap: 2px 6px; margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; }
.sheet .head .sub > span:first-child { overflow: hidden; text-overflow: ellipsis; }
.sheet .head .sub b { font-weight: 500; color: var(--text-2); }
.sbody { display: flex; flex: 1; min-height: 0; flex-direction: column; gap: 16px; overflow: hidden; padding: 16px 16px 20px; }
.why { margin: 0; padding: 8px 12px; border-left: 2px solid var(--accent); border-radius: 8px; background: color-mix(in srgb, var(--accent-soft) 40%, transparent); }
.cap { font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }
.why p { margin: 2px 0 0; font-size: 13px; line-height: 21px; }
.accepts { display: flex; align-items: baseline; justify-content: space-between; margin: 0 0 6px; font-size: 12px; line-height: 16px; color: var(--text-2); }
.accepts b { font-weight: 500; }
.accepts .plus { font-weight: 500; color: var(--good-text); }
.accepts .minus { font-weight: 500; color: var(--critical-text); }
.diff { padding: 12px 0; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20.4px; color: var(--text-2); }
.diff > div { padding: 0 16px 0 calc(16px + 24px + var(--in, 0ch) + 2ch); text-indent: calc(-24px - var(--in, 0ch) - 2ch); white-space: pre-wrap; overflow-wrap: anywhere; }
.diff .sign { display: inline-block; width: 12px; margin-right: 12px; text-indent: 0; color: var(--text-3); }
.diff .add { background: color-mix(in srgb, var(--good) 10%, transparent); color: var(--good-text); }
.diff .del { background: color-mix(in srgb, var(--critical) 10%, transparent); color: var(--critical-text); }
.diff .gap { margin: 4px 0; padding: 2px 16px; background: color-mix(in srgb, var(--surface-3) 60%, transparent); font-family: 'Inter', sans-serif; font-size: 11px; line-height: 16px; text-indent: 0; color: var(--text-3); }
.sheet .command { margin: 0; }
.confirm .lbl { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 12px; line-height: 16px; color: var(--text-2); }
.confirm .lbl code { font-family: 'JetBrains Mono', monospace; font-weight: 500; color: var(--text-1); }
.confirm .lbl svg.i { color: var(--critical-text); }
.pfoot { flex: none; padding: 12px 16px; border-top: 1px solid var(--line); background: var(--surface); }
.pfoot .wait { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; font-size: 12px; line-height: 16px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.pfoot .wait.soon { color: var(--warn-text); }
.pfoot .buttons { display: flex; align-items: center; justify-content: space-between; }
.btn.tall { height: 44px; padding: 0 16px; }
.btn.tall.primary, .btn.tall.danger { min-width: 120px; }
.btn.danger { background: var(--critical); color: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / 0.1); }
.btn.ghost.tall { margin-left: -16px; }
.stepper { display: flex; align-items: center; gap: 8px; }
.stepper .pfield { flex: none; width: 96px; justify-content: center; font-variant-numeric: tabular-nums; }

/* A detail, as a page. */
.dhead { flex: none; padding: 16px 16px 12px; }
.dhead .kline { overflow: hidden; font-size: 12px; line-height: 16px; color: var(--text-3); white-space: nowrap; text-overflow: ellipsis; }
.dhead .name { display: flex; align-items: flex-start; }
.dhead h2 { flex: 1; min-width: 0; margin: 2px 0 0; font-size: 17px; line-height: 1.375; font-weight: 600; letter-spacing: -0.01em; overflow-wrap: anywhere; }
.dhead .name .tap { margin: -8px -12px -8px 0; }
.dhead .name .tap svg.i { width: 16px; height: 16px; }
.dhead .state { margin-top: 10px; }
.dhead .acts { display: flex; gap: 8px; margin-top: 12px; }
.ptabs { display: flex; flex: none; gap: 4px; padding: 0 16px; overflow: hidden; box-shadow: inset 0 -1px 0 var(--line); -webkit-mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent); mask-image: linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent); }
.ptab { position: relative; display: flex; flex: none; height: 44px; align-items: center; padding: 0 10px; font-size: 13px; font-weight: 500; color: var(--text-3); white-space: nowrap; }
.ptab.on { color: var(--text-1); }
.ptab.on::after { content: ''; position: absolute; right: 8px; bottom: 0; left: 8px; height: 2px; border-radius: 999px; background: var(--accent); }
.dbody { flex: 1; min-height: 0; overflow: hidden; }
.dsec { padding: 16px; border-bottom: 1px solid var(--line); }
.dsec > h3 { margin: 0 0 10px; font-size: 11px; line-height: 16px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); }

/* 8. A stacked fact, and a stacked table card. */
.sfacts { display: flex; flex-direction: column; gap: 12px; margin: 0; }
.sfacts dt { font-size: 12px; line-height: 16px; color: var(--text-3); }
.sfacts dd { margin: 2px 0 0; font-size: 13px; line-height: 20px; color: var(--text-1); overflow-wrap: anywhere; }
.sfacts dd.mono, .mono12 { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
.sfacts dd a { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent-strong); }
.meter { display: flex; align-items: center; gap: 12px; white-space: nowrap; font-variant-numeric: tabular-nums; }
.meter i { position: relative; width: 96px; height: 6px; overflow: hidden; border-radius: 999px; background: color-mix(in srgb, var(--warn) 20%, transparent); }
.meter i::after { content: ''; position: absolute; inset: 0 auto 0 0; width: var(--w); border-radius: inherit; background: var(--warn); }
.lchips { display: flex; flex-wrap: wrap; gap: 6px; }
.lchips span { max-width: 100%; overflow: hidden; padding: 2px 8px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 16px; color: var(--text-1); white-space: nowrap; text-overflow: ellipsis; }
.lchips span i { font-style: normal; color: var(--text-3); }
.stack { overflow: hidden; border: 1px solid var(--line); border-radius: 12px; }
.stack > div { padding: 10px 14px; }
.stack > div + div { border-top: 1px solid var(--line); }
.stack .top { display: flex; align-items: baseline; gap: 8px; }
.stack .top b { font-size: 13px; line-height: 20px; font-weight: 500; }
.stack .top .mono12 { font-weight: 500; }
.stack .top small { font-size: 12px; color: var(--text-3); }
.stack .top .end { margin-left: auto; font-size: 12px; color: var(--text-3); }
.stack .cond { display: flex; gap: 12px; }
.stack .cond.bad { background: color-mix(in srgb, var(--warn) 5%, transparent); }
.stack .cond > svg.i { margin-top: 2px; }
.stack .cond .what { flex: 1; min-width: 0; }
.stack .cond .why2 { font-size: 12px; line-height: 16px; color: var(--text-3); }
.stack .cond p { margin: 2px 0 0; font-size: 12px; line-height: 19.5px; color: var(--text-2); }
.stack dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 8px 0 0; font-size: 12px; line-height: 16px; }
.stack dt { color: var(--text-3); }
.stack dd { margin: 2px 0 0; font-family: 'JetBrains Mono', monospace; color: var(--text-1); }

/* Logs: wrapped lines hang, like the diff's. */
.lctl { flex: none; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.lctl .r { display: flex; gap: 8px; }
.lctl .r + .r { margin-top: 8px; }
.pselect { display: flex; flex: 1; min-width: 0; height: 44px; align-items: center; gap: 8px; padding: 0 10px 0 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); font-size: 16px; color: var(--text-1); white-space: nowrap; }
.pselect span { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.pselect svg.i { color: var(--text-3); }
.ltog { display: grid; flex: none; width: 44px; height: 44px; place-items: center; border-radius: 8px; color: var(--text-3); }
.ltog.on { background: var(--accent-soft); color: var(--accent-strong); }
.log { position: relative; flex: 1; min-height: 0; overflow: hidden; padding: 8px 0; background: color-mix(in srgb, var(--surface-2) 60%, transparent); font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 20px; color: var(--text-1); }
.log > div { padding: 0 16px 0 calc(16px + 2ch); text-indent: -2ch; white-space: pre-wrap; overflow-wrap: anywhere; }
.log .err { background: color-mix(in srgb, var(--critical) 8%, transparent); color: var(--critical-text); }
.log .wrn { background: color-mix(in srgb, var(--warn) 8%, transparent); color: var(--warn-text); }
.jump { position: absolute; bottom: 16px; left: 50%; display: flex; height: 32px; font-family: 'Inter', sans-serif; text-indent: 0; align-items: center; gap: 6px; padding: 0 16px; transform: translateX(-50%); border-radius: 999px; background: var(--text-1); font-size: 12px; font-weight: 500; color: var(--surface); box-shadow: var(--shadow-pop); white-space: nowrap; }

/* The overview: tiles two across, then cards whose rows are the list's. */
.ov { flex: 1; min-height: 0; overflow: hidden; padding: 16px; background: var(--surface); }
.ov .tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.otile, .ocard { border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); padding: 16px; box-shadow: var(--shadow-panel); }
.otile .l { display: flex; align-items: center; gap: 8px; font-size: 13px; line-height: 20px; color: var(--text-2); }
.otile .l svg.i { color: var(--text-3); }
.otile .l svg.i:last-child { margin-left: auto; }
.otile .v { margin-top: 10px; font-size: 28px; line-height: 1; font-weight: 600; letter-spacing: -0.02em; }
.otile .s { display: flex; height: 20px; align-items: center; gap: 6px; margin-top: 8px; font-size: 12px; color: var(--text-3); }
.otile .s .sdot { box-shadow: 0 0 0 2px var(--surface-2); }
.ocard { margin-top: 12px; padding-bottom: 4px; }
.ocard h2 { margin: 0 0 4px; font-size: 13px; line-height: 24px; font-weight: 600; }

/* The tablet: the same shell, the app's own table, and a detail as a 600 px panel. */
.thead { display: grid; flex: none; height: 36px; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); white-space: nowrap; }
.thead > *, .trow > * { min-width: 0; padding: 0 12px; }
.thead .sorted { display: flex; align-items: center; gap: 4px; color: var(--text-1); }
.trow { display: grid; height: 46px; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 13px; }
.trow.open { background: var(--accent-soft); }
.trow .nm { overflow: hidden; font-weight: 500; white-space: nowrap; text-overflow: ellipsis; }
.trow .r { text-align: right; font-variant-numeric: tabular-nums; }
.trow .muted { color: var(--text-3); }
.trow .warn { font-weight: 500; color: var(--warn-text); }
.trow .box { width: 14px; height: 14px; padding: 0; border: 1px solid var(--line-strong); border-radius: 3px; background: var(--surface); }
.ttools { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--line); }
.ttools .grow { flex: 0 0 100%; height: 0; }
.ttools .pfield { flex: 1 1 240px; }
.panel { position: absolute; z-index: 30; top: 0; right: 0; bottom: 0; display: flex; width: min(600px, 100%); flex-direction: column; border-left: 1px solid var(--line-strong); background: var(--surface); box-shadow: var(--shadow-pop); }
.panel .dhead { display: flex; gap: 12px; padding: 16px 8px 12px 20px; }
.panel .dhead .glyph { display: grid; flex: none; width: 36px; height: 36px; margin-top: 2px; place-items: center; border: 1px solid var(--line); border-radius: 12px; background: var(--surface-2); color: var(--text-2); }
.panel .dhead .t { flex: 1; min-width: 0; }
.panel .dhead .state { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.panel .dhead .acts { margin: 0; }
.panel .ptabs { padding: 0 20px; }
.panel .dsec { padding: 16px 20px; }
.facts2 { display: grid; grid-template-columns: minmax(120px, auto) 1fr; gap: 8px 24px; margin: 0; font-size: 13px; line-height: 20px; }
.facts2 dt { color: var(--text-3); }
.facts2 dd { margin: 0; overflow-wrap: anywhere; }
.pop44 { position: absolute; z-index: 30; width: 256px; padding: 0; }
.pop44 .find { display: flex; height: 44px; align-items: center; padding: 0 12px; border-bottom: 1px solid var(--line); font-size: 16px; color: var(--text-3); }
.pop44 .sitems { padding: 4px; }
.dialog .pfoot { display: flex; align-items: center; gap: 8px; padding: 12px 20px; }
.dialog .pfoot .wait { margin: 0 auto 0 0; }
.dialog .head .glyph.ask { background: var(--accent-soft); color: var(--accent-strong); }
.dialog .head .eyebrow { display: flex; align-items: center; gap: 4px; font-size: 12px; line-height: 16px; font-weight: 500; color: var(--accent-strong); }
.dialog .head .sub { display: flex; align-items: center; gap: 6px; }
.dialog .head .sub b { font-weight: 500; color: var(--text-2); }
`

// ─── Parts ─────────────────────────────────────────────────────────────────────────────────

const tap = (name: IconName, extra = '') => `<span class="tap${extra}">${icon(name, 20)}</span>`

type Lead = 'menu' | 'back'

/**
 * The top bar. A top-level page leads with the menu button, a detail with Back. Under 640 px
 * it ends with at most two buttons, Search and Refresh; from 640 px it has the header's own.
 */
function topBar(name: string, lead: Lead, wide = false, trailing = true): string {
  const title = lead === 'back' ? middle(name) : escape(name)
  const end = !trailing
    ? ''
    : wide
      ? `${tap('search')}${tap('plus')}<span class="tap badge" data-n="2">${icon('history', 20)}</span>${tap('rotate-cw')}`
      : `${tap('search')}${tap('rotate-cw')}`
  return `<header class="tb">${tap(lead === 'menu' ? 'menu' : 'arrow-left')}<h1>${title}</h1>${end}</header>`
}

/** The context row: the cluster, with its dot as the switcher has it, and the namespace. */
function contextRow(namespace: string | null, o: { hit?: boolean; cluster?: string } = {}): string {
  const hit = o.hit ? ' hit' : ''
  const ns =
    namespace === 'cluster'
      ? `<span class="cchip still">${icon('globe', 14)}<span>Cluster-wide</span></span>`
      : `<span class="cchip${hit}">${icon('layout-grid', 14)}<span>${escape(namespace ?? 'All namespaces')}</span>${icon('chevron-down', 14)}</span>`
  return `<div class="ctx"><span class="cchip cluster${hit}">${dot('healthy')}<span>${escape(o.cluster ?? CLUSTER)}</span>${icon('chevrons-up-down', 14)}</span>${ns}</div>`
}

/** The names of a pod list's health chips, as the app's lib/health.ts has them for pods. */
const POD_CHIPS: [Level, string][] = [
  ['critical', 'Failing'],
  ['warning', 'Warning'],
  ['progressing', 'Starting'],
  ['healthy', 'Running'],
  ['neutral', 'Completed'],
]

function chips(pods: Pod[], on?: Level): string {
  return POD_CHIPS.filter(([level]) => pods.some((p) => p.level === level))
    .map(
      ([level, name]) =>
        `<span class="hchip${level === on ? ' on' : ''}">${dot(level, 6)}${name}<b>${pods.filter((p) => p.level === level).length}</b></span>`,
    )
    .join('')
}

/** A list's toolbar on a phone. */
function toolbar(pods: Pod[], o: { sort?: boolean; on?: Level } = {}): string {
  return `<div class="ptools">
    <div class="r1"><span class="pfield">${icon('search', 16)}<span class="ph">Filter pods</span></span><span class="tapb">${icon('tag', 16)}</span><span class="tapb${o.sort ? ' on' : ''}">${icon('arrow-up-down', 16)}</span></div>
    <div class="r2"><span class="n">${pods.length} items</span>${chips(pods, o.on)}</div>
  </div>`
}

/** A pod's row. Its namespace shows only where every namespace is listed, as in the table. */
function podRow(p: Pod, o: { namespace?: boolean; press?: boolean } = {}): string {
  const restarts =
    p.restarts > 0
      ? `<span class="warn">${p.restarts} restart${p.restarts === 1 ? '' : 's'}</span>`
      : '0 restarts'
  const facts = [o.namespace ? escape(p.namespace) : '', `${p.ready} ready`, restarts]
    .filter(Boolean)
    .join(' · ')
  return `<div class="prow${o.press ? ' press' : ''}">
    <div class="l1"><span class="nm">${middle(p.name)}</span>${pill(p.level, p.status)}</div>
    <div class="l2"><span class="facts">${facts}</span><span class="age">${p.age}</span></div>
  </div>`
}

/** Any row: a name, its status, what's worth knowing, and when. */
function row(name: string, status: string, facts: string, age: string): string {
  return `<div class="prow"><div class="l1"><span class="nm">${name}</span>${status}</div><div class="l2"><span class="facts">${facts}</span><span class="age">${age}</span></div></div>`
}

const NAV: ([string, IconName] | string)[] = [
  ['Overview', 'layout-dashboard'],
  ['Workloads', 'boxes'],
  ['Pods', 'box'],
  ['Metrics', 'chart-spline'],
  ['Helm releases', 'ship-wheel'],
  'Cluster',
  ['Nodes', 'server'],
  ['Namespaces', 'layout-grid'],
  ['Events', 'activity'],
  'Network',
  ['Services', 'network'],
  ['Ingresses', 'globe'],
  ['Network Policies', 'shield-check'],
  'Configuration',
  ['ConfigMaps', 'file-code-2'],
  ['Secrets', 'key-round'],
]

/** The drawer: the sidebar as it is, its items 44 px high, with a hairline on its open edge. */
function drawer(current: string): string {
  const items = NAV.map((n) =>
    typeof n === 'string'
      ? `<h3>${n}</h3>`
      : `<div class="ditem${n[0] === current ? ' on' : ''}">${icon(n[1], 16)}${n[0]}</div>`,
  ).join('')
  return `<div class="scrim"></div><aside class="drawer">
    <div class="switch-to">${dot('healthy')}<span class="who"><b>${CLUSTER}</b><small>Kubernetes v1.34.1</small></span>${icon('chevrons-up-down', 16)}</div>
    <nav class="dnav">${items}</nav>
    <div class="spons"><div class="cap">Sponsor</div><div class="scard"><i></i><span>Help keep Lumovi free.</span></div></div>
    <div class="dfoot">${tap('monitor')}${tap('sparkles')}${tap('scroll-text')}<span class="tap"><span class="me">JA</span></span><span class="v">v1.19.0</span></div>
  </aside>`
}

const closeX = `<span class="tap">${icon('x', 20)}</span>`

/** A sheet from the bottom: a grabber, its title and Close, then 44 px items. */
function sheet(title: string, inside: string): string {
  return `<div class="scrim"></div><div class="sheet"><i class="grab"></i><div class="shead"><h2>${title}</h2>${closeX}</div>${inside}</div>`
}

function namespaceItems(current: string | null, press?: string): string {
  const item = (label: string, on: boolean, note = '') =>
    `<div class="sitem${label === press ? ' press' : ''}"><span>${label}</span>${note}${on ? icon('check', 16, 2, 'color:var(--accent)') : ''}</div>`
  return `${item('All namespaces', current === null)}<div class="ssep"></div>${NAMESPACES.map((n) => item(n, n === current)).join('')}${item('old-shop', false, '<small>Terminating</small>')}`
}

function namespaceSheet(current: string | null): string {
  return sheet(
    'Namespace',
    `<span class="pfield">${icon('search', 16)}<span class="ph">Find a namespace…</span></span><div class="sitems">${namespaceItems(current)}</div>`,
  )
}

/** Sort: the list's sortable columns. The chosen one says its direction; choosing it again turns it. */
function sortSheet(): string {
  const columns = ['Status', 'Name', 'Restarts', 'CPU', 'Memory', 'Age']
  const items = columns
    .map(
      (c, i) =>
        `<div class="sitem"><span>${c}</span>${i === 0 ? `<span class="dir">Worst first${icon('arrow-up', 14)}</span>${icon('check', 16, 2, 'color:var(--accent)')}` : ''}</div>`,
    )
    .join('')
  return sheet('Sort by', `<div class="sitems">${items}</div>`)
}

// ─── The approval, and an action's dialog ──────────────────────────────────────────────────

const PRODUCTION = '<span class="prod">Production</span>'

function diffLine(kind: 'same' | 'add' | 'del', indent: number, text: string): string {
  const sign = kind === 'add' ? '+' : kind === 'del' ? '−' : ' '
  return `<div class="${kind}" style="--in:${indent}ch"><span class="sign">${sign}</span>${' '.repeat(indent)}${escape(text)}</div>`
}

const DIFF = `<div class="diff">
${diffLine('same', 4, 'containers:')}
${diffLine('same', 6, '- name: app')}
${diffLine('del', 8, 'image: ghcr.io/acme/checkout:v1.14.0')}
${diffLine('add', 8, 'image: ghcr.io/acme/checkout:v1.13.2')}
${diffLine('same', 8, 'imagePullPolicy: IfNotPresent')}
<div class="gap">⋯ 73 unchanged lines</div>
</div>`

function command(text: string): string {
  return `<div class="command"><div class="label">Equivalent command${icon('copy', 14)}</div><code>${escape(text)}</code></div>`
}

const APPLY =
  'kubectl apply --server-side --field-manager=lumovi -f checkout.yaml -n shop --context production-eu'

function approvalHead(): string {
  return `<div class="glyph ask">${icon('file-code-2', 18)}</div>
    <div class="t"><p class="eyebrow" style="margin:0">${icon('sparkles', 12)}Claude Code asks</p><h2>Change Deployment checkout</h2><div class="sub"><span>Deployment · shop · <b>${CLUSTER}</b></span>${PRODUCTION}</div></div>`
}

const WHY =
  'v1.14.0 panics on start: its payments client can’t find PAYMENTS_API_KEY. v1.13.2, the release before, ran without it.'

function approvalBody(): string {
  return `<figure class="why"><div class="cap">Why</div><p>${WHY}</p></figure>
    <div><p class="accepts"><b>The cluster accepts it</b><span><span class="plus">+1</span> <span class="minus">−1</span> lines</span></p>${DIFF}</div>
    ${command(APPLY)}`
}

/** The approval on a phone: a tall sheet, its footer pinned, the wait on a line of its own. */
function approvalSheet(soon = false): string {
  return `<div class="scrim"></div><div class="sheet tall"><i class="grab"></i>
    <div class="head">${approvalHead()}${closeX}</div>
    <div class="sbody">${approvalBody()}</div>
    <div class="pfoot"><div class="wait${soon ? ' soon' : ''}">${icon('timer', 14)}Waits ${soon ? '0:48' : '4:12'} more</div><div class="buttons"><span class="btn ghost tall">Reject…</span><span class="btn primary tall">Approve</span></div></div>
  </div>`
}

/** One of Lumovi's own dialogs on a phone: Scale, with its field at 16 px. */
function scaleSheet(): string {
  return `<div class="scrim"></div><div class="sheet"><i class="grab"></i>
    <div class="head"><div class="glyph">${icon('arrow-up-down', 18)}</div><div class="t"><h2 style="margin-top:0">Scale checkout</h2><div class="sub"><span>Deployment · shop · <b>${CLUSTER}</b></span>${PRODUCTION}</div></div>${closeX}</div>
    <div class="sbody"><div><div class="confirm"><div class="lbl">Replicas, 3 now</div></div><div class="stepper"><span class="tapb">${icon('minus', 16)}</span><span class="pfield focus">5<span class="caret"></span></span><span class="tapb">${icon('plus', 16)}</span></div></div>${command('kubectl scale deployment/checkout --replicas=5 -n shop --context production-eu')}</div>
    <div class="pfoot"><div class="buttons"><span class="btn ghost tall">Cancel</span><span class="btn primary tall">Scale</span></div></div>
  </div>`
}

/** A typed confirmation on a phone: the field at 16 px, the footer above the keyboard. */
function typedSheet(): string {
  return `<div class="scrim"></div><div class="sheet" style="bottom:291px;border-radius:16px 16px 0 0"><i class="grab"></i>
    <div class="head"><div class="glyph ask" style="background:color-mix(in srgb, var(--critical) 10%, transparent);color:var(--critical-text)">${icon('trash-2', 18)}</div><div class="t"><p class="eyebrow" style="margin:0">${icon('sparkles', 12)}Claude Code asks</p><h2>Delete Job db-migrate-28931</h2><div class="sub"><span>Job · shop · <b>${CLUSTER}</b></span>${PRODUCTION}</div></div>${closeX}</div>
    <div class="sbody" style="padding-bottom:16px"><div class="confirm"><div class="lbl">${icon('triangle-alert', 14)}Type <code>db-migrate-28931</code> to approve</div><span class="pfield mono danger">db-migrate-28<span class="caret"></span></span></div></div>
    <div class="pfoot"><div class="wait">${icon('timer', 14)}Waits 3:05 more</div><div class="buttons"><span class="btn ghost tall">Reject…</span><span class="btn danger tall off">Approve deletion</span></div></div>
  </div>${keyboard()}`
}

/** The phone's keyboard, as a plain block: what the footer has to stay above. */
function keyboard(): string {
  const keys = (row: string) =>
    `<div style="display:flex;justify-content:center;gap:6px">${[...row].map((k) => `<span style="display:grid;width:32px;height:42px;place-items:center;border-radius:5px;background:var(--surface);box-shadow:0 1px 0 var(--line-strong);font-size:16px;color:var(--text-1)">${k}</span>`).join('')}</div>`
  return `<div style="position:absolute;z-index:40;right:0;bottom:0;left:0;display:flex;height:291px;flex-direction:column;gap:11px;padding:8px 3px 0;background:var(--surface-3)">${keys('qwertyuiop')}${keys('asdfghjkl')}${keys('zxcvbnm')}</div>`
}

// ─── A detail ──────────────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Pods', 'Logs', 'Metrics', 'Events', 'Audit', 'YAML']
const tabs = (on: string, list = TABS) =>
  `<div class="ptabs">${list.map((t) => `<span class="ptab${t === on ? ' on' : ''}">${t}</span>`).join('')}</div>`

const btn = (name: IconName, label: string, tall = true) =>
  `<span class="btn secondary${tall ? ' tall' : ' sm'}">${icon(name, tall ? 16 : 14)}${label}</span>`

const LABELS = `<div class="lchips"><span><i>app=</i>checkout</span><span><i>team=</i>payments</span><span><i>app.kubernetes.io/managed-by=</i>Helm</span><span><i>helm.sh/chart=</i>checkout-2026.10.3+build.4f1c9aa.production</span></div>`

const CONDITIONS = `<div class="stack">
  <div class="cond bad">${icon('triangle-alert', 16, 2, 'color:var(--warn)')}<div class="what"><div class="top"><b>Available</b><span class="end">6m ago</span></div><div class="why2">MinimumReplicasUnavailable</div><p>Deployment does not have minimum availability.</p></div></div>
  <div class="cond">${icon('check', 16, 2, 'color:var(--good)')}<div class="what"><div class="top"><b>Progressing</b><span class="end">41d ago</span></div><div class="why2">NewReplicaSetAvailable</div></div></div>
</div>`

/** A Deployment's facts, stacked: each label above its value. */
const FACTS = `<dl class="sfacts">
  <div><dt>Replicas</dt><dd><span class="meter"><i style="--w:66%"></i>2 of 3 ready</span></dd></div>
  <div><dt>Strategy</dt><dd>RollingUpdate, 25% surge, 25% unavailable</dd></div>
  <div><dt>Image</dt><dd class="mono">ghcr.io/acme/checkout:2026.10.3@sha256:9f2c41d07be6a3e84b1f0c6d2a57e41a</dd></div>
  <div><dt>Controlled by</dt><dd><a>HelmRelease/checkout</a></dd></div>
  <div><dt>Created</dt><dd>Aug 30, 2026, 9:14 AM (41d ago)</dd></div>
</dl>`

const facts2 = `<dl class="facts2">
  <dt>Created</dt><dd>Aug 30, 2026, 9:14 AM (41d ago)</dd>
  <dt>Controlled by</dt><dd><a class="mono12" style="color:var(--accent-strong)">HelmRelease/checkout</a></dd>
  <dt>Replicas</dt><dd><span class="meter"><i style="--w:66%"></i>2 of 3 ready</span></dd>
  <dt>Strategy</dt><dd>RollingUpdate, 25% surge, 25% unavailable</dd>
  <dt>Image</dt><dd class="mono12">ghcr.io/acme/checkout:2026.10.3@sha256:9f2c41d07be6a3e84b1f0c6d2a57e41a</dd>
</dl>`

function detailHead(
  name: string,
  kind: string,
  level: Level,
  status: string,
  actions: string,
): string {
  return `<div class="dhead">
    <div class="kline">${kind} · shop · ${CLUSTER}</div>
    <div class="name"><h2>${escape(name)}</h2><span class="tap">${icon('copy', 16)}</span></div>
    <div class="state">${pill(level, status)}</div>
    <div class="acts">${actions}</div>
  </div>`
}

/** A Service's ports: a table on the desktop, a card a port here. */
const PORTS = `<div class="stack">
  <div><div class="top"><span class="mono12">http</span><span class="end">TCP</span></div><dl><div><dt>Port</dt><dd>80</dd></div><div><dt>Target</dt><dd>8080</dd></div><div><dt>Node port</dt><dd>—</dd></div></dl></div>
  <div><div class="top"><span class="mono12">metrics</span><span class="end">TCP</span></div><dl><div><dt>Port</dt><dd>9090</dd></div><div><dt>Target</dt><dd>metrics</dd></div><div><dt>Node port</dt><dd>—</dd></div></dl></div>
</div>`

const LOG = `<div class="log">
<div>starting checkout 2026.10.3 (commit 4f1c9aa)</div>
<div>config loaded from /etc/checkout/config.yaml</div>
<div>connecting to postgres at payments-db.shop.svc.cluster.local:5432</div>
<div class="err">level=error msg="connect: connection refused" host=payments-db.shop.svc port=5432 attempt=1</div>
<div>retrying in 2s</div>
<div class="err">level=error msg="connect: connection refused" host=payments-db.shop.svc port=5432 attempt=2</div>
<div>retrying in 4s</div>
<div class="wrn">level=warn msg="slow start: 6s without a database"</div>
<div class="err">level=fatal msg="giving up after 3 attempts: could not reach the database; is the payments-db Service up, and does its NetworkPolicy let checkout in?"</div>
<div>shutting down</div>
<span class="jump">${icon('arrow-down', 14)}Jump to latest</span>
</div>`

// ─── The tablet's table ────────────────────────────────────────────────────────────────────

const GRID = 'grid-template-columns: 40px minmax(220px, 1.8fr) minmax(168px, 1fr) 64px 108px 84px'

function table(open?: string): string {
  const head = `<div class="thead" style="${GRID}"><span></span><span>Name</span><span class="sorted">Status${icon('arrow-up', 12)}</span><span>Ready</span><span style="text-align:right">Restarts</span><span style="text-align:right">CPU</span></div>`
  const rows = PODS.map(
    (p) =>
      `<div class="trow${p.name === open ? ' open' : ''}" style="${GRID}"><span><i class="box" style="display:block"></i></span><span class="nm">${p.name}</span><span>${pill(p.level, p.status)}</span><span style="font-variant-numeric:tabular-nums">${p.ready}</span><span class="r ${p.restarts ? 'warn' : 'muted'}">${p.restarts}</span><span class="r${p.level === 'healthy' ? '' : ' muted'}">${p.level === 'healthy' ? '12m' : '—'}</span></div>`,
  ).join('')
  return `<div class="ttools"><span class="n" style="font-size:13px;color:var(--text-2)">${PODS.length} items</span>${chips(PODS)}<span class="grow"></span><span class="pfield mono" style="border-color:var(--line)">${icon('tag', 16)}<span class="ph" style="font-family:'Inter',sans-serif">Label selector</span></span><span class="pfield">${icon('search', 16)}<span class="ph">Filter pods</span></span></div>${head}<div class="rows">${rows}</div>`
}

// ─── The screens ───────────────────────────────────────────────────────────────────────────

export type State =
  | 'list'
  | 'list-all'
  | 'list-long'
  | 'overview'
  | 'drawer'
  | 'namespace'
  | 'sort'
  | 'detail'
  | 'detail-scrolled'
  | 'service'
  | 'logs'
  | 'approval'
  | 'approval-soon'
  | 'scale'
  | 'typed'
  | 'hit'
  | 'landscape'
  | 'tablet'
  | 'tablet-drawer'
  | 'tablet-detail'
  | 'tablet-menu'
  | 'tablet-approval'

export const STATES: { state: State; title: string; note: string }[] = [
  {
    state: 'list',
    title: 'A list',
    note: 'The top bar, the context row, the toolbar, and two-line rows.',
  },
  {
    state: 'list-all',
    title: 'Every namespace',
    note: 'A row says its namespace only here, as the table does.',
  },
  {
    state: 'list-long',
    title: 'The longest names',
    note: 'Names cut in the middle; the pill keeps its word.',
  },
  {
    state: 'overview',
    title: 'The overview',
    note: 'Tiles two across; the cards’ rows are the list’s.',
  },
  { state: 'drawer', title: 'The drawer', note: 'The sidebar, from the left.' },
  { state: 'namespace', title: 'A sheet', note: 'The namespace picker; every menu opens like it.' },
  { state: 'sort', title: 'Sort', note: 'The list’s columns, in a sheet.' },
  { state: 'detail', title: 'A detail', note: 'A page, with Back. Facts stack.' },
  {
    state: 'detail-scrolled',
    title: 'A detail, scrolled',
    note: 'The top bar takes the object’s name.',
  },
  { state: 'service', title: 'A table, stacked', note: 'A Service’s ports, a card each.' },
  { state: 'logs', title: 'Logs', note: 'Lines wrap, and hang.' },
  { state: 'approval', title: 'An approval', note: 'A tall sheet with its footer pinned.' },
  { state: 'approval-soon', title: 'A minute left', note: 'The wait turns amber, as it does now.' },
  { state: 'scale', title: 'A dialog', note: 'Lumovi’s own, as a sheet.' },
  { state: 'typed', title: 'Typed to confirm', note: 'The footer stays above the keyboard.' },
  { state: 'hit', title: 'What a finger gets', note: 'Each chip answers on 44 px.' },
  { state: 'landscape', title: 'On its side', note: 'The context row scrolls away with the page.' },
  { state: 'tablet', title: 'A tablet', note: 'The same shell; the app’s table.' },
  { state: 'tablet-drawer', title: 'A tablet’s drawer', note: 'As the phone’s.' },
  { state: 'tablet-detail', title: 'A tablet’s detail', note: 'A 600 px panel over the list.' },
  {
    state: 'tablet-menu',
    title: 'A tablet’s menu',
    note: 'The app’s popover, its items 44 px high.',
  },
  {
    state: 'tablet-approval',
    title: 'A tablet’s approval',
    note: 'The app’s dialog, its buttons 44 px high.',
  },
]

/** The phone, upright; on its side; and a tablet, upright. */
export const PHONE: Size = { width: 390, height: 844 }
export const LANDSCAPE: Size = { width: 844, height: 390 }
export const TABLET: Size = { width: 768, height: 1024 }

export const sizeOf = (state: State): Size =>
  state === 'landscape' ? LANDSCAPE : state.startsWith('tablet') ? TABLET : PHONE

function screen(state: State): string {
  const list = (pods: Pod[], ns: string | null, o: { sort?: boolean } = {}) =>
    `${topBar('Pods', 'menu')}${contextRow(ns)}${toolbar(pods, o)}<div class="rows">${pods.map((p) => podRow(p, { namespace: ns === null })).join('')}</div>`
  const deployment = (scrolled: boolean) =>
    `${topBar(scrolled ? 'checkout' : 'Deployments', 'back', false, false)}${
      scrolled
        ? ''
        : detailHead(
            'checkout',
            'Deployment',
            'warning',
            'Degraded',
            `${btn('arrow-up-down', 'Scale')}${btn('rotate-cw', 'Restart')}`,
          )
    }${tabs('Overview')}<div class="dbody">
      <section class="dsec"><h3>Details</h3>${FACTS}</section>
      <section class="dsec"><h3>Conditions</h3>${CONDITIONS}</section>
      <section class="dsec"><h3>Labels</h3>${LABELS}</section>
      ${scrolled ? `<section class="dsec"><h3>Annotations</h3><dl class="sfacts"><div><dt>deployment.kubernetes.io/revision</dt><dd class="mono" style="color:var(--text-2)">7</dd></div><div><dt>meta.helm.sh/release-name</dt><dd class="mono" style="color:var(--text-2)">checkout</dd></div></dl></section>` : ''}
    </div>`
  switch (state) {
    case 'list':
      return list(PODS, 'shop')
    case 'list-all':
      return list(PODS, null)
    case 'list-long':
      return list(LONG, null)
    case 'hit':
      return `${topBar('Pods', 'menu')}${contextRow('shop', { hit: true })}${toolbar(PODS)}<div class="rows">${PODS.slice(
        0,
        3,
      )
        .map((p) => podRow(p))
        .join('')}</div>`
    case 'drawer':
      return `${list(PODS, 'shop')}${drawer('Pods')}`
    case 'namespace':
      return `${list(PODS, 'shop')}${namespaceSheet('shop')}`
    case 'sort':
      return `${list(PODS, 'shop', { sort: true })}${sortSheet()}`
    case 'overview':
      return `${topBar('Overview', 'menu')}${contextRow(null)}<div class="ov">
        <div class="tiles">
          <div class="otile"><div class="l">${icon('server', 16)}Nodes ready${icon('chevron-right', 16)}</div><div class="v">6/6</div><div class="s">${dot('healthy')}All ready</div></div>
          <div class="otile"><div class="l">${icon('box', 16)}Pods running${icon('chevron-right', 16)}</div><div class="v">148</div><div class="s">${dot('critical')}3 unhealthy</div></div>
        </div>
        <div class="ocard card"><h2>Needs attention</h2>
          ${row(middle(PODS[0]!.name), pill('critical', 'CrashLoopBackOff'), 'Pod · shop · <span class="warn">14 restarts</span>', '2m')}
          ${row(middle(PODS[1]!.name), pill('warning', 'Unschedulable'), 'Pod · shop · 0/6 nodes are available', '11m')}
          ${row('checkout', pill('warning', 'Degraded'), 'Deployment · shop · 2 of 3 ready', '6m')}
        </div>
        <div class="ocard card"><h2>Recent warnings</h2>
          ${row('BackOff', '<span class="age" style="font-size:12px;color:var(--text-3)">×14</span>', `Pod/${PODS[0]!.name} · Back-off restarting failed container`, '2m')}
          ${row('FailedScheduling', '<span class="age" style="font-size:12px;color:var(--text-3)">×3</span>', `Pod/${PODS[1]!.name} · 0/6 nodes are available`, '11m')}
        </div>
      </div>`
    case 'detail':
      return deployment(false)
    case 'detail-scrolled':
      return deployment(true)
    case 'service':
      return `${topBar('Services', 'back', false, false)}<div class="dhead"><div class="kline">Service · shop · ${CLUSTER}</div><div class="name"><h2>checkout</h2><span class="tap">${icon('copy', 16)}</span></div></div>${tabs('Overview', ['Overview', 'Pods', 'Events', 'Audit', 'YAML'])}<div class="dbody">
        <section class="dsec"><h3>Details</h3><dl class="sfacts"><div><dt>Type</dt><dd>ClusterIP</dd></div><div><dt>Cluster IP</dt><dd class="mono">10.96.14.2</dd></div></dl></section>
        <section class="dsec"><h3>Ports</h3>${PORTS}</section>
      </div>`
    case 'logs':
      return `${topBar(PODS[0]!.name, 'back', false, false)}${tabs('Logs', ['Overview', 'Logs', 'Metrics', 'Events', 'Audit', 'YAML'])}
        <div class="lctl"><div class="r"><span class="pselect"><span>app</span>${icon('chevron-down', 16)}</span><span class="pselect"><span>Last 500 lines</span>${icon('chevron-down', 16)}</span></div>
        <div class="r"><span class="pfield">${icon('search', 16)}<span class="ph">Search</span></span><span class="ltog on">${icon('play', 16)}</span><span class="ltog">${icon('clock', 16)}</span><span class="ltog">${icon('ellipsis', 16)}</span></div></div>${LOG}`
    case 'approval':
      return `${list(PODS, 'shop')}${approvalSheet()}`
    case 'approval-soon':
      return `${list(PODS, 'shop')}${approvalSheet(true)}`
    case 'scale':
      return `${deployment(false)}${scaleSheet()}`
    case 'typed':
      return `${list(PODS, 'shop')}${typedSheet()}`
    case 'landscape':
      return `${topBar('Pods', 'menu', true)}${toolbar(PODS)}<div class="rows">${PODS.map((p) => podRow(p)).join('')}</div>`
    case 'tablet':
      return `${topBar('Pods', 'menu', true)}${contextRow('shop')}${table()}`
    case 'tablet-drawer':
      return `${topBar('Pods', 'menu', true)}${contextRow('shop')}${table()}${drawer('Pods')}`
    case 'tablet-menu':
      return `${topBar('Pods', 'menu', true)}${contextRow('shop')}${table()}<div class="menu pop44" style="top:94px;left:149px"><div class="find">Find a namespace…</div><div class="sitems">${namespaceItems('shop')}</div></div>`
    case 'tablet-detail':
      return `${topBar('Pods', 'menu', true)}${contextRow('shop')}${table('checkout-7d9f6c5b8-x2kqp')}<div class="scrim"></div><aside class="panel">
        <div class="dhead"><div class="glyph">${icon('layers', 18)}</div><div class="t"><div class="kline">Deployment · shop · 41d old</div><div class="name"><h2>checkout</h2><span class="tap" style="margin:-8px 0">${icon('copy', 16)}</span></div><div class="state" style="margin-top:10px">${pill('warning', 'Degraded')}<div class="acts">${btn('arrow-up-down', 'Scale')}${btn('rotate-cw', 'Restart')}<span class="tapb">${icon('ellipsis', 16)}</span></div></div></div><span class="tap">${icon('x', 20)}</span></div>
        ${tabs('Overview', ['Overview', 'Pods', 'Logs', 'Metrics', 'Map', 'Events', 'Audit', 'YAML'])}
        <div class="dbody"><section class="dsec"><h3>Details</h3>${facts2}</section><section class="dsec"><h3>Conditions</h3>${CONDITIONS}</section><section class="dsec"><h3>Labels</h3>${LABELS}</section></div>
      </aside>`
    case 'tablet-approval':
      return `${topBar('Pods', 'menu', true)}${contextRow('shop')}${table()}<div class="scrim"></div><div class="dialog" style="top:8%;width:680px;max-width:calc(100% - 48px)">
        <div class="head">${approvalHead().replace('<h2>', '<h3 style="margin-top:2px">').replace('</h2>', '</h3>')}<span class="tap" style="margin:-8px -12px 0 auto">${icon('x', 20)}</span></div>
        <div class="body">${approvalBody()}</div>
        <div class="pfoot"><div class="wait">${icon('timer', 14)}Waits 4:12 more</div><span class="btn ghost tall" style="margin:0">Reject…</span><span class="btn primary tall">Approve</span></div>
      </div>`
  }
}

/** One of the screens, in one theme, as a page the size of its device. */
export function phonePage(state: State, scheme: Scheme): string {
  const size = sizeOf(state)
  return `<!doctype html><meta charset="utf-8"><style>
${FONTS}
:root { ${tokens(scheme)} }
html, body { width: ${size.width}px; height: ${size.height}px; }
${PARTS}
${CSS}
</style><div class="phone">${screen(state)}</div>${FIT}`
}
