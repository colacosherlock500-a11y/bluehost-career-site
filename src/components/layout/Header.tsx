import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logoBlue from '../../assets/img/logos/bluehost.svg'
import logoWhite from '../../assets/img/common/bluehost-logo-white.svg'
import caretDown from '../../assets/img/common/caret-down.svg'
import chevronSmall from '../../assets/img/common/chevron-small.svg'
import flagBr from '../../assets/img/common/flag-br.svg'
import flagUs from '../../assets/img/common/flag-us.svg'
import { Button } from '../ui/Button'
import { useI18n, useT } from '../../i18n/I18n'
import { countryNav, lifeNav, teamNav, type NavCard } from './navData'

type Theme = 'dark' | 'light'
type MenuKey = 'life' | 'team' | 'world'

const menus: { key: MenuKey; label: string; to: string }[] = [
  { key: 'life', label: 'Life at Bluehost', to: '/life-at-bluehost' },
  { key: 'team', label: 'Our team', to: '/our-teams' },
  { key: 'world', label: 'Around the World', to: '/around-the-world' },
]

function CardGrid({ items, teamStyle, onNavigate }: { items: NavCard[]; teamStyle?: boolean; onNavigate: () => void }) {
  const t = useT()
  return (
    <div className="grid grid-cols-4 gap-x-[35px] gap-y-5">
      {items.map(item => (
        <Link key={item.to} to={item.to} onClick={onNavigate} className="group flex flex-col items-center gap-[10px]">
          <span
            className="relative block h-[100.5px] w-[141.7px] overflow-hidden rounded-[9px]"
            style={teamStyle ? { backgroundImage: 'linear-gradient(127.6deg, #196cdf 0%, #0e3b79 99%)' } : undefined}
          >
            <img src={item.image} alt="" className={`absolute inset-0 size-full transition-transform duration-300 group-hover:scale-105 ${teamStyle ? 'object-cover object-top' : 'object-cover'}`} />
          </span>
          <span className="flex items-center whitespace-nowrap pl-2 text-sm text-bh-blue-1100 group-hover:text-bh-blue">
            {t(item.label)}
            <img src={chevronSmall} alt="" className="size-[21.4px]" />
          </span>
        </Link>
      ))}
    </div>
  )
}

/**
 * Global navigation. `theme="dark"` renders white text for dark hero images,
 * `theme="light"` renders dark text. Once the page scrolls the bar turns solid white.
 */
export function Header({ theme = 'dark' }: { theme?: Theme }) {
  const [open, setOpen] = useState<MenuKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t } = useI18n()
  const closeTimer = useRef<number | undefined>(undefined)
  const location = useLocation()

  useEffect(() => {
    // only touch React state when the bar actually switches (scroll fires every frame)
    let last: boolean | null = null
    const onScroll = () => {
      const now = window.scrollY > 40
      if (now !== last) setScrolled((last = now))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [location.pathname])

  const solid = scrolled || mobileOpen
  const dark = theme === 'dark' && !solid
  const textColor = dark ? 'text-white' : 'text-black'

  const openMenu = (key: MenuKey) => {
    window.clearTimeout(closeTimer.current)
    setOpen(key)
  }
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 150)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? 'bg-white/95 shadow-[0_2px_20px_rgba(0,42,102,0.08)] backdrop-blur' : 'bg-transparent'}`}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto flex h-[78px] max-w-[1449px] items-center justify-between px-4 md:px-6">
        <Link to="/" aria-label="Bluehost careers home" className="shrink-0">
          <img src={dark ? logoWhite : logoBlue} alt="Bluehost" className="h-[22.7px] w-[128.4px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-[41.5px] lg:flex">
          {menus.map(m => (
            <div key={m.key} className="relative" onMouseEnter={() => openMenu(m.key)}>
              <NavLink
                to={m.to}
                className={`flex items-end gap-[3px] text-sm leading-5 ${textColor} hover:opacity-80`}
                aria-haspopup="true"
                aria-expanded={open === m.key}
                onFocus={() => openMenu(m.key)}
              >
                {t(m.label)}
                <img src={caretDown} alt="" className={`size-[17px] transition-transform ${open === m.key ? 'rotate-180' : ''} ${dark ? '' : 'invert'}`} />
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-[31px] lg:flex">
          <div
            className="flex items-center gap-[7.3px] rounded-[6.2px] border-[0.6px] border-white px-[5.8px] py-[5.1px] shadow-[7.7px_3.8px_15.4px_0px_rgba(0,0,0,0.08)] backdrop-blur-[2px]"
            style={{ backgroundImage: 'linear-gradient(152.5deg, rgba(207,227,254,0.22) 0%, rgba(42,123,210,0.22) 100%)' }}
            role="group"
            aria-label={t('Language')}
          >
            <button onClick={() => setLang('pt')} aria-pressed={lang === 'pt'} aria-label="Português" className={`rounded-full border-[0.7px] ${lang === 'pt' ? 'border-bh-light-400' : 'border-transparent opacity-60'}`}>
              <img src={flagBr} alt="" className="size-[26.3px]" />
            </button>
            <button onClick={() => setLang('en')} aria-pressed={lang === 'en'} aria-label="English" className={`rounded-full border-[0.7px] ${lang === 'en' ? 'border-bh-light-400' : 'border-transparent opacity-60'}`}>
              <img src={flagUs} alt="" className="size-[26.3px] rounded-full" />
            </button>
          </div>
          <Button to="/jobs" variant={dark ? 'white' : 'primary'}>{t('View open roles')}</Button>
        </div>

        <button
          className={`flex size-11 items-center justify-center rounded-lg lg:hidden ${textColor}`}
          aria-label={t(mobileOpen ? 'Close menu' : 'Open menu')}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Desktop mega-menus */}
      {open && (
        <div className="absolute left-1/2 top-[70px] hidden -translate-x-1/2 lg:block" onMouseEnter={() => openMenu(open)} onMouseLeave={scheduleClose}>
          <div className="rounded-b-[11px] bg-white/90 px-[23px] py-[28px] shadow-[0_20px_40px_rgba(0,42,102,0.15)] backdrop-blur-md">
            {open === 'team' && <CardGrid items={teamNav} teamStyle onNavigate={() => setOpen(null)} />}
            {open === 'world' && <CardGrid items={countryNav} onNavigate={() => setOpen(null)} />}
            {open === 'life' && (
              <ul className="flex min-w-[320px] flex-col gap-1">
                {lifeNav.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} onClick={() => setOpen(null)} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] text-bh-blue-1100 hover:bg-bh-light-0 hover:text-bh-blue">
                      {t(l.label)}
                      <img src={chevronSmall} alt="" className="size-[21.4px]" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-78px)] overflow-y-auto border-t border-bh-light-100 bg-white px-4 pb-8 lg:hidden">
          {menus.map(m => (
            <details key={m.key} className="border-b border-bh-light-100 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">
                {t(m.label)}
                <img src={caretDown} alt="" className="size-[17px] invert" />
              </summary>
              <div className="mt-3 flex flex-col gap-1 pl-2">
                <Link to={m.to} className="py-1.5 text-bh-blue">{t('Overview')}</Link>
                {(m.key === 'team' ? teamNav : m.key === 'world' ? countryNav : lifeNav).map(i => (
                  <Link key={i.to} to={i.to} className="py-1.5 text-[15px] text-bh-blue-1100">{t(i.label)}</Link>
                ))}
              </div>
            </details>
          ))}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => setLang('pt')} aria-label="Português" className={lang === 'pt' ? '' : 'opacity-50'}><img src={flagBr} alt="" className="size-7" /></button>
              <button onClick={() => setLang('en')} aria-label="English" className={lang === 'en' ? '' : 'opacity-50'}><img src={flagUs} alt="" className="size-7" /></button>
            </div>
            <Button to="/jobs">{t('View open roles')}</Button>
          </div>
        </div>
      )}
    </header>
  )
}
