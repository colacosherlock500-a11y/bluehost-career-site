import { useEffect, useState } from 'react'

const GRADIENT = 'linear-gradient(90deg, #196cdf 43%, #0e57bd 57%)'

/**
 * EVP word that changes one at a time (Figma dev note: belong → build → grow → shine).
 * Each word rolls up out of view as the next rolls in. The slot is as wide as the longest
 * word so the sentence never reflows, and padded so descenders (g, p) are never clipped.
 * Screen readers hear one stable phrase; reduced motion swaps the words without sliding.
 */
export function RotatingWord({ words = ['belong', 'build', 'grow', 'shine'], label, interval = 2400 }: { words?: string[]; label?: string; interval?: number }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % words.length), interval)
    return () => window.clearInterval(id)
  }, [words.length, interval])
  return (
    <span className="relative -mx-[0.06em] -my-[0.28em] inline-grid overflow-hidden px-[0.06em] py-[0.28em] align-baseline">
      <span className="sr-only">{label ?? words.join(', ')}</span>
      {words.map((w, n) => {
        const offset = (n - i + words.length) % words.length
        const state = offset === 0 ? 'translate-y-0 opacity-100' : offset === words.length - 1 ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
        return (
          <span
            key={w}
            aria-hidden
            className={`col-start-1 row-start-1 whitespace-nowrap bg-clip-text pb-[0.06em] text-left text-transparent transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity ${state}`}
            style={{ backgroundImage: GRADIENT }}
          >
            {w}
          </span>
        )
      })}
    </span>
  )
}
