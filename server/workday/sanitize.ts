/**
 * Allow-list HTML sanitizer for Workday job descriptions. Tags are rebuilt
 * from scratch (no attributes survive except a checked href), and all other
 * markup is reduced to escaped text, so the result is safe to render.
 */

const ALLOWED = new Set(['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 'h2', 'h3', 'h4', 'a', 'span', 'div'])
const RENAME: Record<string, string> = { h1: 'h2', h5: 'h4', h6: 'h4' }
const VOID = new Set(['br'])

const escapeText = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function sanitizeHtml(html: string): string {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, '')
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/g
  let out = ''
  let last = 0
  for (let m; (m = tag.exec(cleaned)); ) {
    out += escapeText(cleaned.slice(last, m.index))
    last = tag.lastIndex
    const closing = m[1] === '/'
    const name = RENAME[m[2].toLowerCase()] ?? m[2].toLowerCase()
    if (!ALLOWED.has(name)) continue
    if (closing) {
      if (!VOID.has(name)) out += `</${name}>`
    } else if (name === 'a') {
      const href = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[3])
      const url = (href?.[1] ?? href?.[2] ?? href?.[3] ?? '').trim()
      out += /^(https?:|mailto:)/i.test(url) ? `<a href="${url.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">` : '<a>'
    } else {
      out += `<${name}>`
    }
  }
  return out + escapeText(cleaned.slice(last))
}

/** Plain-text version (for summaries and keyword search). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/li|\/h\d|\/div)\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}
