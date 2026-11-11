import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { pt } from './pt'

/*
 * Lightweight translations. English source text is the key: `t('View open roles')` returns the
 * Portuguese (Brazil) string when the visitor picks PT and one exists, otherwise the English.
 * Add a translation by adding its English text to `pt.ts`.
 * The choice comes from ?lang=pt|en, else the last choice (localStorage), else English.
 */

export type Lang = 'en' | 'pt'
const STORAGE_KEY = 'bh-careers:lang'

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
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
function translate(en: string) {
  if (pt[en] !== undefined) return pt[en]
  const m = /^([\d.,]+|—)\s(.+)$/.exec(en)
  const tpl = m && pt[`{n} ${m[2]}`]
  return tpl ? tpl.replace('{n}', m[1]) : en
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
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
  }, [lang])

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: en => (lang === 'pt' ? translate(en) : en) }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
/** Translate a string: `const t = useT(); t('Search Roles')`. */
export const useT = () => useContext(I18nContext).t
