# Contributing to Lumovi's design

Thanks for helping! Ideas, fixes and new assets are all welcome.

## Before you start

- **Ideas and problems:** open an [issue](../../issues) first for anything bigger than a small
  fix (a new asset, a change to the logo or the colors), so we can agree on it before you
  draw it.
- **The logo and the colors** change rarely, and only together with the app, the website and
  the docs. Small refinements are welcome; new directions start as an issue.
- **Lumovi itself**, its website and its docs live in their own repositories.

## Setting up

```sh
nvm use      # Node.js 26 (24 also works)
npm ci
npm run build
```

Images are rendered with Chrome through Playwright: your Google Chrome if you have it,
otherwise Playwright's Chromium (`npx playwright install chromium`).

## How it fits together

Every asset is built from the source in `src/`, by the tasks in `scripts/tasks/`, one per
folder. Nothing outside `src/`, `scripts/` and `sources/` is edited by hand: change the source,
build, and commit both.

- `src/colors.ts`: every color, and the app's theme tokens.
- `src/health.ts`: the five status levels, with their colors, icons, names and motion.
- `src/mark.ts`: the mark's geometry (a 48-unit square, drawn from circles) and how it's painted.
- `src/wordmark.ts`: the wordmark, outlined from Inter Display Semibold, with its spacing.
- `src/logo.ts`: the lockups and their versions.
- `src/icon.ts`: the app icons for each platform and size, and the Liquid Glass icon.
- `src/scene.ts`: the brand's imagery: social cards, banners, wallpapers.
- `src/launch.ts`: the launch art: YouTube's thumbnails and channel art, and Product Hunt's
  gallery, from the pictures in `sources/`, which come from other repositories (`npm run
sources` takes them again).
- `src/sponsor.ts`: the sidebar's sponsor card, as the app draws it, and the spec sponsors get.
- `src/clusters.ts`: the desktop app's clusters page, every state of it, as the app draws it.
- `src/fleet.ts`: the server's Fleet page, with what admins get to manage clusters, every state.
- `src/lucide.ts`: the Lucide icons the app uses, for the mockups.
- `src/animation.ts`: the animated marks.
- `src/book/`: the brand book (the PDF in `guidelines/`), a module per section. Its pages are
  HTML, printed with Chrome; render them to look at while you work on them.

A new kind of asset is a new task: a file in `scripts/tasks/` that default-exports a `Task`
(its name, the folders it owns, and a `build` function). Tasks run in file-name order.

## Making a change

1. Create a branch from `main`.
2. Change the source, then build what it affects: `npm run build -- logo` builds the tasks
   whose names match.
3. Look at the result, at the sizes it's used at: in light and dark, small and large. The
   guidelines' pictures (`guidelines/images/`) are built from the same source, so they show
   most changes at a glance.
4. Run the checks:

   ```sh
   npm run verify   # format check, typecheck, and the SVG, CSS and JSON up to date
   ```

5. Commit with a [Conventional Commits](https://www.conventionalcommits.org) message
   (`feat(icons): …`, `fix(logo): …`, `docs: …`), and open a pull request with pictures of what
   changed, before and after.

### The macOS Liquid Glass icon

`icons/app/macos/Lumovi.icon` is an Icon Composer document. To check a change to it, open it
in Icon Composer (with Xcode 26 or later), or compile it as electron-builder does:

```sh
mkdir -p out
xcrun actool "$PWD/icons/app/macos/Lumovi.icon" --compile "$PWD/out" --app-icon Lumovi \
  --platform macosx --target-device mac --minimum-deployment-target 26.0 \
  --output-partial-info-plist "$PWD/out/Info.plist"
```

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By taking part, you agree
to uphold it.
