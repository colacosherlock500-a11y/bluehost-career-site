import { lazy, Suspense } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import HomePage from './pages/HomePage'
import { PT_BASE, useI18n } from './i18n/I18n'

const LifeAtBluehostPage = lazy(() => import('./pages/LifeAtBluehostPage'))
const OurTeamsPage = lazy(() => import('./pages/OurTeamsPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const AroundTheWorldPage = lazy(() => import('./pages/AroundTheWorldPage'))
const LocationPage = lazy(() => import('./pages/LocationPage'))
const JobSearchPage = lazy(() => import('./pages/JobSearchPage'))
const RolePage = lazy(() => import('./pages/RolePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// VITE_ROUTER=memory keeps navigation inside the page (for embedded previews
// such as a shared artifact, where the page URL can't change).
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export default function App() {
  const { lang } = useI18n()
  // Portuguese pages are served under /pt; remount the router when the base changes.
  const base = Router === BrowserRouter && lang === 'pt' ? PT_BASE : undefined
  return (
    <Router key={base ?? '/'} basename={base}>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="life-at-bluehost" element={<LifeAtBluehostPage />} />
            <Route path="our-teams" element={<OurTeamsPage />} />
            <Route path="our-teams/:slug" element={<TeamPage />} />
            <Route path="around-the-world" element={<AroundTheWorldPage />} />
            <Route path="locations/:slug" element={<LocationPage />} />
            <Route path="jobs" element={<JobSearchPage />} />
            <Route path="jobs/:id" element={<RolePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}
