import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ChatWidget } from './ChatWidget'

export function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <main id="main">
        <Outlet />
      </main>
      <ChatWidget />
    </>
  )
}
