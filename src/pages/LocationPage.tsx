import { Navigate, useParams } from 'react-router-dom'
import { OpenRoles } from '../components/jobs/OpenRoles'
import { CountryDetail, OfficeCards } from '../components/sections/countries/CountryDetail'
import { GlobeSection } from '../components/sections/GlobeSection'
import { JoinCta } from '../components/sections/JoinCta'
import { Testimonials } from '../components/sections/Testimonials'
import { getCountry } from '../data/countries'

export default function LocationPage() {
  const { slug } = useParams()
  const country = getCountry(slug)
  if (!country) return <Navigate to="/around-the-world" replace />

  return (
    <>
      <section className="px-4 pt-[30px]">
        <div className="mx-auto flex max-w-[1346px] justify-center rounded-xl px-6 py-[50px] md:px-[73px]" style={{ backgroundImage: 'linear-gradient(189.7deg, #e6f3ff 15%, #d1e7ff 86%)' }}>
          <CountryDetail country={country} headingLevel="h1" />
        </div>
      </section>
      <section className="px-4 py-[50px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          <h2 className="h-section">Offices</h2>
          <OfficeCards country={country} />
        </div>
      </section>
      <OpenRoles filter={{ country: country.slug }} />
      <GlobeSection key={country.slug} />
      <Testimonials />
      <JoinCta />
    </>
  )
}
