/*
 * Page-wide Portuguese (HR: "when Portuguese is selected, not everything on the page is
 * translated"). Components translate their own labels with `t()`, but most copy (page text,
 * data such as team and country descriptions, colleague stories) is plain English in the code.
 * While Portuguese is on, this watches the page and swaps every text fragment and every
 * accessible label (aria-label, alt, placeholder, title) that has an entry in the dictionary,
 * including content that appears later (menus, carousels, route changes). Switching back to
 * English restores the original text. Mark an element `translate="no"` to leave it alone.
 */

const ATTRS = ['aria-label', 'alt', 'placeholder', 'title'] as const

/** What we wrote into a text node, and the English it replaced. */
const textState = new WeakMap<Text, { src: string; out: string }>()
/** Same for attributes, per element and attribute name. */
const attrState = new WeakMap<Element, Map<string, { src: string; out: string }>>()

const skip = (el: Element | null) => !!el?.closest('script,style,[translate="no"]')

/** Keeps the original's leading/trailing whitespace around the translation. */
function swap(src: string, lookup: (en: string) => string | undefined) {
  const key = src.replace(/\s+/g, ' ').trim()
  if (!key || !/[A-Za-z]/.test(key)) return undefined
  const tr = lookup(key)
  if (tr === undefined || tr === key) return undefined
  const lead = /^\s*/.exec(src)![0]
  const trail = /\s*$/.exec(src)![0]
  return lead + tr + trail
}

function translateText(n: Text, lookup: (en: string) => string | undefined) {
  if (skip(n.parentElement)) return
  const cur = n.nodeValue ?? ''
  const st = textState.get(n)
  // React may have written new English since we last touched it: that is the new source
  const src = st && st.out === cur ? st.src : cur
  const out = swap(src, lookup)
  if (out === undefined) {
    if (st && st.out === cur) n.nodeValue = st.src
    textState.delete(n)
    return
  }
  textState.set(n, { src, out })
  if (cur !== out) n.nodeValue = out
}

function translateAttrs(el: Element, lookup: (en: string) => string | undefined) {
  if (skip(el)) return
  for (const a of ATTRS) {
    const cur = el.getAttribute(a)
    if (cur === null) continue
    let m = attrState.get(el)
    const st = m?.get(a)
    const src = st && st.out === cur ? st.src : cur
    const out = swap(src, lookup)
    if (out === undefined) continue
    if (!m) attrState.set(el, (m = new Map()))
    m.set(a, { src, out })
    if (cur !== out) el.setAttribute(a, out)
  }
}

function walk(root: Node, lookup: (en: string) => string | undefined) {
  if (root.nodeType === Node.TEXT_NODE) return translateText(root as Text, lookup)
  if (root.nodeType !== Node.ELEMENT_NODE) return
  translateAttrs(root as Element, lookup)
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
  let n: Node | null
  while ((n = w.nextNode())) {
    if (n.nodeType === Node.TEXT_NODE) translateText(n as Text, lookup)
    else translateAttrs(n as Element, lookup)
  }
}

function restore(root: Node) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
  let n: Node | null
  while ((n = w.nextNode())) {
    if (n.nodeType === Node.TEXT_NODE) {
      const t = n as Text
      const st = textState.get(t)
      if (st && st.out === t.nodeValue) t.nodeValue = st.src
      textState.delete(t)
    } else {
      const el = n as Element
      attrState.get(el)?.forEach((st, a) => {
        if (el.getAttribute(a) === st.out) el.setAttribute(a, st.src)
      })
      attrState.delete(el)
    }
  }
}

/** Translates `root` now and as it changes; returns a function that stops and restores English. */
export function translateDom(root: HTMLElement, lookup: (en: string) => string | undefined) {
  walk(root, lookup)
  let pending = new Set<Node>()
  let raf = 0
  const flush = () => {
    raf = 0
    const nodes = pending
    pending = new Set()
    nodes.forEach(n => n.isConnected && walk(n, lookup))
  }
  const mo = new MutationObserver(records => {
    for (const r of records) {
      if (r.type === 'childList') r.addedNodes.forEach(n => pending.add(n))
      else pending.add(r.target)
    }
    // translate before the next paint so English never flashes
    if (!raf) {
      raf = requestAnimationFrame(flush)
      queueMicrotask(() => {
        if (raf) {
          cancelAnimationFrame(raf)
          flush()
        }
      })
    }
  })
  mo.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] })
  return () => {
    mo.disconnect()
    cancelAnimationFrame(raf)
    restore(root)
  }
}
