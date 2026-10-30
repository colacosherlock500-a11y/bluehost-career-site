import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import HomePage from './pages/HomePage'

const LifeAtBluehostPage = lazy(() => import('./pages/LifeAtBluehostPage'))
const OurTeamsPage = lazy(() => import('./pages/OurTeamsPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const AroundTheWorldPage = lazy(() => import('./pages/AroundTheWorldPage'))
const LocationPage = lazy(() => import('./pages/LocationPage'))
const JobSearchPage = lazy(() => import('./pages/JobSearchPage'))
const RolePage = lazy(() => import('./pages/RolePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
