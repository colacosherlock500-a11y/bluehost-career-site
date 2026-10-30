import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import arrowBlue from '../../assets/img/common/arrow-blue.svg'
import arrowGold from '../../assets/img/common/arrow-gold.svg'
import arrowWhite from '../../assets/img/common/arrow-white.svg'

type Variant = 'primary' | 'white' | 'outline' | 'link' | 'gold-link'

const styles: Record<Variant, string> = {
  primary: 'bg-bh-blue-500 text-white drop-shadow-[0px_3.3px_3.3px_rgba(0,0,0,0.1)] hover:bg-bh-blue-900',
  white: 'bg-white text-bh-blue drop-shadow-[0px_3.3px_3.3px_rgba(0,0,0,0.1)] hover:bg-bh-light-0',
  outline:
    'border-[1.6px] border-bh-blue text-bh-blue shadow-[0px_3.3px_6.6px_0px_rgba(0,0,0,0.1)] hover:bg-bh-blue hover:text-white [&:hover_img]:brightness-0 [&:hover_img]:invert',
  link: 'text-bh-blue !px-0 !py-0 !min-w-0 hover:underline',
  'gold-link': 'text-gold !px-0 !py-0 !min-w-0 hover:underline',
}

const arrows: Record<Variant, string> = {
  primary: arrowWhite,
  white: arrowBlue,
  outline: arrowBlue,
  link: arrowBlue,
  'gold-link': arrowGold,
}

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  /** Internal route (react-router) or external URL. */
  to?: string
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  arrow?: boolean
  size?: 'md' | 'sm'
  className?: string
}

/** Pill-cornered CTA with the chevron arrow used throughout the Figma file. */
export function Button({ children, variant = 'primary', to, href, onClick, type = 'button', arrow = true, size = 'md', className = '' }: ButtonProps) {
  const cls = [
    'inline-flex items-center justify-center gap-1 rounded-[10px] font-medium capitalize leading-[1.4] whitespace-nowrap transition-colors',
    size === 'md' ? 'min-w-[136px] py-[14px] pl-[18px] pr-4 text-base' : 'py-[11px] px-[14px] text-[15px]',
    styles[variant],
    className,
  ].join(' ')
  const content = (
    <>
      <span>{children}</span>
      {arrow && <img src={arrows[variant]} alt="" aria-hidden className="size-[19.76px] shrink-0" />}
    </>
  )
  if (to) return <Link to={to} className={cls}>{content}</Link>
  if (href) return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a>
  return <button type={type} onClick={onClick} className={cls}>{content}</button>
}
