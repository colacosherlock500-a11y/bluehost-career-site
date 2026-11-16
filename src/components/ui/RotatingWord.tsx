import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const GRADIENT = 'linear-gradient(90deg, #196cdf 43%, #0e57bd 57%)'
const DEFAULT_WORDS = ['belong', 'build', 'grow', 'shine']

/**
 * EVP word that changes one at a time (Figma dev note: belong → build → grow → shine).
 * Each word rolls up out of view as the next rolls in, and the slot's width eases to the
 * new word so the following text sits right after it (no gap after short words like "grow").
 * Padded so descenders (g, p) are never clipped. Screen readers hear one stable phrase;
 * reduced motion swaps the words without sliding.
 */
export function RotatingWord({ words = DEFAULT_WORDS, label, interval = 2400 }: { words?: string[]; label?: string; interval?: number }) {
  const [i, setI] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [words.length, interval])

  // Measure every word (again once web fonts load and on resize).
  useLayoutEffect(() => {
    const measure = () => setWidths(refs.current.map(el => el?.getBoundingClientRect().width ?? 0))
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [words.join('|')])

  const width = widths[i]
  return (
    <span
      className="relative -mx-[0.06em] -my-[0.28em] inline-block px-[0.06em] py-[0.28em] align-baseline [clip-path:inset(0)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={width ? { width: `calc(${width}px + 0.12em)` } : undefined}
    >
      <span className="sr-only">{label ?? words.join(', ')}</span>
      {/* invisible copy of the current word keeps the line's baseline and height */}
      <span aria-hidden className="invisible whitespace-nowrap">{words[i]}</span>
      {words.map((w, n) => {
        const offset = (n - i + words.length) % words.length
        const state = offset === 0 ? 'translate-y-0 opacity-100' : offset === words.length - 1 ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
        return (
          <span
            key={w}
            ref={el => {
              refs.current[n] = el
            }}
            aria-hidden
            className={`absolute left-[0.06em] top-[0.28em] whitespace-nowrap bg-clip-text pb-[0.06em] text-transparent transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity ${state}`}
            style={{ backgroundImage: GRADIENT }}
          >
            {w}
          </span>
        )
      })}
    </span>
  )
}
