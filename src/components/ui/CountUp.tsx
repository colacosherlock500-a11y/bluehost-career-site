import { useEffect, useRef, useState } from 'react'

/**
 * A number that counts up from 0 the first time it scrolls into view
 * ("By the Numbers": the numbers should count up, not appear static).
 * Reduced motion shows the final value straight away.
 */
export function CountUp({ value, from = 0, prefix = '', suffix = '', duration = 2600 }: { value: number; from?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(from)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setShown(Math.round(from + (value - from) * (1 - (1 - t) ** 3)))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, from, duration])

  return (
    <span ref={ref} className="tabular-nums" aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden>
        {prefix}
        {shown}
        {suffix}
      </span>
    </span>
  )
}
