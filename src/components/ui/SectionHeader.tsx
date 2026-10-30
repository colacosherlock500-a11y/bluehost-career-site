import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  align?: 'center' | 'left'
  icon?: ReactNode
  className?: string
}

/** Eyebrow + H2 + lead paragraph block used by almost every section. */
export function SectionHeader({ eyebrow, title, body, align = 'center', icon, className = '' }: SectionHeaderProps) {
  const center = align === 'center'
  return (
    <div className={`flex flex-col gap-5 ${center ? 'items-center text-center' : 'items-start'} ${className}`}>
      {icon}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`h-section max-w-[1010px] ${center ? '' : 'max-w-none'}`}>{title}</h2>
      {body && <p className={`text-lead max-w-[864px] ${center ? '' : ''}`}>{body}</p>}
    </div>
  )
}

/** Blue gradient text used for highlighted heading words. */
export function Highlight({ children, gradient = 'linear-gradient(90deg, #196cdf 43%, #0e57bd 57%)' }: { children: ReactNode; gradient?: string }) {
  return (
    <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradient }}>
      {children}
    </span>
  )
}
