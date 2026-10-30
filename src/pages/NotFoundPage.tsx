import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 pt-32 text-center">
      <p className="eyebrow text-bh-blue">404</p>
      <h1 className="h-section">This page took a different career path</h1>
      <p className="text-lead max-w-xl">The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.</p>
      <div className="flex gap-4">
        <Button to="/">Go home</Button>
        <Button to="/jobs" variant="outline">View open roles</Button>
      </div>
    </section>
  )
}
