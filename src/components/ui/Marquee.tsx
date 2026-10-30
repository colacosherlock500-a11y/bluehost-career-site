import type { ReactNode } from 'react'

/**
 * Infinite horizontal ticker. Children are rendered twice and the track is
 * shifted by -50%, so `gap` must also be applied after the last item.
 */
export function Marquee({ children, reverse = false, duration = 40, gap = 81, className = '' }: { children: ReactNode; reverse?: boolean; duration?: number; gap?: number; className?: string }) {
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden={hidden || undefined}>
      {children}
    </div>
  )
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex h-full w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`} style={{ animationDuration: `${duration}s` }}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}
