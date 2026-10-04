/**
 * The brand book: the guidelines as a designed, printable document. It's assembled here from
 * its sections, with a cover, the contents, a divider before each section, a running footer
 * with page numbers, and a back cover; the build prints it to PDF.
 */
import { address, description, site, tagline } from '../brand.ts'
import { gray } from '../colors.ts'
import { escape } from '../svg.ts'
import { colorSection } from './color.ts'
import { iconSection } from './icon.ts'
import { imagerySection, motionSection } from './imagery.ts'
import { introduction, story } from './introduction.ts'
import { CSS, logo, logoHeight, type Assets, type Page, type Section } from './kit.ts'
import { logoSection } from './logo.ts'
import { typographySection } from './typography.ts'
import { legalSection, useSection, voiceSection } from './use.ts'

export const TITLE = 'Lumovi brand guidelines'

export function sections(a: Assets): Section[] {
  return [
    introduction(),
    story(),
    logoSection(a),
    colorSection(),
    typographySection(),
    iconSection(a),
    imagerySection(a),
    motionSection(a),
    useSection(a),
    voiceSection(),
    legalSection(),
  ]
}

function cover(a: Assets): Page {
  return {
    title: 'Cover',
    dark: true,
    bare: true,
    html: `
      <img src="${a.cover}" style="position:absolute;inset:0;width:100%;height:100%">
      <div style="position:absolute;left:96px;top:80px">${logo('logo', 'on-dark', logoHeight(36))}</div>
      <div style="position:absolute;left:96px;bottom:96px">
        <div class="eyebrow" style="color:${gray[500]}">2026</div>
        <h1 style="margin-top:18px;color:#ededed">Brand <br><span style="color:${gray[600]}">guidelines</span></h1>
        <p class="lead" style="max-width:26em">The mark, the colors, the type and the pictures of Lumovi, and how to use them.</p>
      </div>`,
  }
}

function contents(all: Section[], first: Map<string, number>): Page {
  return {
    title: 'Contents',
    html: `
      <div class="head"><div class="eyebrow">Contents</div></div>
      <div style="margin-top:40px;display:grid;grid-template-columns:1fr 1fr;column-gap:96px;row-gap:0">
        ${all
          .map(
            (
              s,
            ) => `<div style="display:flex;align-items:baseline;gap:20px;padding:15px 0;border-bottom:1px solid ${gray[200]}">
              <span class="mono" style="font-size:14px;color:${gray[500]};width:24px">${s.number}</span>
              <div style="flex:1">
                <div style="font-size:24px;font-weight:600;letter-spacing:-0.02em">${escape(s.name)}</div>
                <div class="small" style="margin-top:2px">${escape(s.summary)}</div>
              </div>
              <span class="mono" style="font-size:14px;color:${gray[600]}">${first.get(s.number)}</span>
            </div>`,
          )
          .join('')}
      </div>`,
  }
}

function divider(s: Section): Page {
  return {
    title: s.name,
    dark: true,
    html: `
      <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between">
        <div class="mono" style="font-size:180px;line-height:1;color:${gray[800]};letter-spacing:-0.04em">${s.number}</div>
        <div>
          <h1 style="color:#ededed">${escape(s.name)}</h1>
          <p class="lead" style="max-width:30em">${escape(s.summary)}</p>
          <div style="margin-top:36px;display:flex;flex-wrap:wrap;gap:10px 28px">
            ${s.pages.map((p) => `<span style="font-size:15px;color:${gray[500]}">${escape(p.title)}</span>`).join('')}
          </div>
        </div>
      </div>`,
  }
}

function back(a: Assets): Page {
  return {
    title: 'Back cover',
    dark: true,
    bare: true,
    html: `
      <img src="${a.back}" style="position:absolute;inset:0;width:100%;height:100%">
      <div style="position:absolute;left:96px;bottom:96px">
        <p style="font-size:40px;font-weight:650;letter-spacing:-0.04em;line-height:1.05;color:#ededed;font-variation-settings:'opsz' 32">${tagline[0]}<br><span style="color:${gray[600]}">${tagline[1]}</span></p>
        <p class="lead" style="max-width:26em">${escape(description)}</p>
      </div>
      <div style="position:absolute;right:96px;bottom:96px;text-align:right;font-size:15px;line-height:1.8;color:${gray[400]}">
        ${address(site.website)}<br>${address(site.docs)}<br>github.com/Lumovi
      </div>`,
  }
}

/** The whole book, as one HTML document of pages. */
export function book(a: Assets): string {
  const all = sections(a)
  // Number the pages first, so the contents can say where each section starts.
  const pages: (Page & { section?: string })[] = [cover(a), { title: 'Contents', html: '' }]
  const first = new Map<string, number>()
  for (const s of all) {
    pages.push({ ...divider(s), section: s.name })
    first.set(s.number, pages.length)
    for (const page of s.pages) pages.push({ ...page, section: s.name })
  }
  pages.push(back(a))
  pages[1] = contents(all, first)

  const footer = (page: Page & { section?: string }, number: number) =>
    page.bare
      ? ''
      : `<div class="footer"><span class="brand">${logo('mark', page.dark ? 'on-dark' : 'on-light', 14)}Lumovi brand guidelines</span><span>${page.section ? `${escape(page.section)} · ` : ''}${number}</span></div>`
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>${TITLE}</title>
<style>${CSS}</style>
${pages
  .map(
    (page, i) =>
      `<section class="page${page.dark ? ' dark' : ''}${page.bare ? ' bare' : ''}">${page.html}${footer(page, i + 1)}</section>`,
  )
  .join('\n')}
</html>`
}
