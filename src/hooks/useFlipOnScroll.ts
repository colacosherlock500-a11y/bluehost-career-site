import { useEffect, type RefObject } from 'react'

/**
 * Flips a list's cards into place around their vertical axis as the list scrolls into view,
 * one after another (Life at Bluehost brands, HR feedback). Driven by the scroll position, so
 * it reverses when scrolling back up. Reduced motion: cards are shown as they are.
 */
export function useFlipOnScroll(list: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = list.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = [...el.children] as HTMLElement[]
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      items.forEach((item, i) => {
        const top = item.getBoundingClientRect().top
        // 0 when the card's top is at the bottom of the screen, 1 at ~55% up; staggered
        const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.45) - i * 0.18))
        const e = 1 - (1 - p) ** 3
        item.style.transform = `perspective(1100px) rotateY(${(1 - e) * -95}deg)`
        item.style.opacity = String(Math.min(1, e * 1.6))
      })
    }
    const schedule = () => {
      raf ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      items.forEach(item => {
        item.style.transform = ''
        item.style.opacity = ''
      })
    }
  }, [list])
}
