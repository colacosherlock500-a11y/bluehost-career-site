import { useEffect, type RefObject } from 'react'

/**
 * "Section moves up" (Figma dev note on Life at Bluehost, ref. jobs.uber.com):
 * the children of `container` become sticky, so as you scroll each one slides
 * up over the previous one, which freezes behind it. Used via <StackOver>.
 *
 * A section taller than the viewport sticks with its bottom edge at the bottom
 * of the screen (top = viewport height − section height), so all of its
 * content is still scrolled through before the next one covers it.
 * Disabled for visitors who prefer reduced motion.
 */
export function useStackedSections(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const wrapper = container.current
    if (!wrapper || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let sections: HTMLElement[] = []
    const layout = () => {
      const vh = window.innerHeight
      for (const s of sections) s.style.top = `${Math.min(0, vh - s.offsetHeight)}px`
    }
    const resize = new ResizeObserver(layout)

    const setup = () => {
      resize.disconnect()
      sections = [...wrapper.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
      sections.forEach((s, i) => {
        s.classList.add('stack-section')
        s.style.zIndex = String(i + 1)
        // A covering section must be opaque; sections without their own background get the page's.
        const style = getComputedStyle(s)
        if (style.backgroundImage === 'none' && style.backgroundColor === 'rgba(0, 0, 0, 0)') s.style.backgroundColor = 'var(--color-white, #fff)'
        resize.observe(s)
      })
      layout()
    }

    // Keyboard focus can land on something the next section has slid over: scroll back
    // just far enough that its section is uncovered and the element is on screen.
    const revealFocused = (e: FocusEvent) => {
      const el = e.target as HTMLElement
      const i = sections.findIndex(s => s.contains(el))
      if (i < 0) return
      const r = el.getBoundingClientRect()
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      if (hit && (el.contains(hit) || hit.contains(el))) return
      const vh = window.innerHeight
      const naturalTop = wrapper.getBoundingClientRect().top + window.scrollY + sections.slice(0, i).reduce((sum, s) => sum + s.offsetHeight, 0)
      const offsetInSection = r.top - sections[i].getBoundingClientRect().top
      const uncoveredUntil = naturalTop + Math.max(0, sections[i].offsetHeight - vh)
      window.scrollTo({ top: Math.min(uncoveredUntil, naturalTop + offsetInSection - vh / 2) })
    }

    const children = new MutationObserver(setup)
    children.observe(wrapper, { childList: true })
    window.addEventListener('resize', layout)
    wrapper.addEventListener('focusin', revealFocused)
    setup()
    return () => {
      children.disconnect()
      resize.disconnect()
      window.removeEventListener('resize', layout)
      wrapper.removeEventListener('focusin', revealFocused)
    }
  }, [container])
}
