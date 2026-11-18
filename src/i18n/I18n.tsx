import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { translateDom } from './domTranslate'
import { pt } from './pt'

/*
 * Lightweight translations. English source text is the key: `t('View open roles')` returns the
 * Portuguese (Brazil) string when the visitor picks PT and one exists, otherwise the English.
 * Add a translation by adding its English text to `pt.ts`.
 * The choice comes from the URL (/pt/… or ?lang=pt|en), else the last choice (localStorage),
 * else English. Portuguese pages live under /pt (e.g. /pt/jobs) so they can be shared and
 * indexed separately; the flags switch between the two URLs.
 * Besides `t()`, all page text with a dictionary entry is translated in place (domTranslate.ts).
 */

/** URL prefix for Portuguese pages (only with real URLs, not the in-page preview router). */
export const PT_BASE = '/pt'
const realUrls = import.meta.env.VITE_ROUTER !== 'memory'
const hasPtPrefix = (path: string) => path === PT_BASE || path.startsWith(PT_BASE + '/')

export type Lang = 'en' | 'pt'
const STORAGE_KEY = 'bh-careers:lang'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  if (realUrls && hasPtPrefix(window.location.pathname)) return 'pt'
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'pt' || fromUrl === 'en') return fromUrl
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    // storage unavailable: English
  }
  return 'en'
}

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (en: string) => string
}

const I18nContext = createContext<I18nValue>({ lang: 'en', setLang: () => undefined, t: en => en })

/** Exact match first; then "<number> rest" via a "{n} rest" entry (e.g. "15 open roles"). */
function lookup(en: string): string | undefined {
  if (pt[en] !== undefined) return pt[en]
  const m = /^([\d.,]+|—)\s(.+)$/.exec(en)
  const tpl = m && pt[`{n} ${m[2]}`]
  return tpl ? tpl.replace('{n}', m[1]) : undefined
}
const translate = (en: string) => lookup(en) ?? en

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    if (realUrls) {
      // move between /… and /pt/… (the router remounts on the new base, see App)
      const { pathname, search, hash } = window.location
      const bare = hasPtPrefix(pathname) ? pathname.slice(PT_BASE.length) || '/' : pathname
      const path = next === 'pt' ? PT_BASE + (bare === '/' ? '' : bare) : bare
      const params = new URLSearchParams(search)
      params.delete('lang')
      const q = params.toString()
      window.history.replaceState(window.history.state, '', path + (q ? `?${q}` : '') + hash)
    }
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // not persisted; still switches for this visit
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title = lang === 'pt' ? 'Carreiras na Bluehost' : 'Careers at Bluehost'
    if (lang === 'pt') return translateDom(document.body, lookup)
  }, [lang])

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: en => (lang === 'pt' ? translate(en) : en) }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
/** Translate a string: `const t = useT(); t('Search Roles')`. */
export const useT = () => useContext(I18nContext).t
