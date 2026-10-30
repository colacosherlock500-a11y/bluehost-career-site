import { useState } from 'react'
import headset from '../../../assets/img/awards/headset.svg'
import medalBlue from '../../../assets/img/awards/medal-blue.svg'
import medalBronze from '../../../assets/img/awards/medal-bronze.svg'
import medalSilver from '../../../assets/img/awards/medal-silver.svg'
import trend from '../../../assets/img/awards/trend.svg'
import users from '../../../assets/img/awards/users.svg'

interface Award {
  name: string
  detail?: string
  year: string
}

const medal = (year: string) => (/silver/i.test(year) ? medalSilver : /bronze/i.test(year) ? medalBronze : medalBlue)

const groups: { title: string; icon: string; note?: string; awards: Award[] }[] = [
  {
    title: 'A workplace people are proud of',
    icon: users,
    note: 'Awarded to Newfold Digital, the parent company of Bluehost.',
    awards: [
      'Top Workplace in the Technology Industry',
      'Top Workplaces for Remote Work',
      'Top Workplace for Employee Well-Being',
      'Top Workplace for Professional Development',
      'Top Workplace for Purpose and Values',
      'Top Workplace for Work-Life Flexibility',
      'Top Workplace for Leadership',
      'Top Workplace for Innovation',
      'Top Workplace for Employee Appreciation',
      'Top Workplace for Compensation and Benefits',
    ].map(name => ({ name, year: '2026' })),
  },
  {
    title: 'Customer experience that earns trust',
    icon: headset,
    awards: [
      { name: 'Stevie® Awards', detail: 'Contact Center of the Year (Over 100 Seats), Technology Industries', year: 'Silver · 2026' },
      { name: 'Stevie® Awards', detail: 'Customer Service Department of the Year, Global Operations', year: 'Silver · 2026' },
      { name: 'Stevie® Awards', detail: 'Customer Service Transformation Award, Business and Financial Services', year: 'Silver · 2026' },
      { name: 'BIG Awards for Business', detail: 'Excellence in Customer Service', year: '2023' },
    ],
  },
  {
    title: 'Products that help businesses grow',
    icon: trend,
    awards: [
      { name: 'Titan Business Awards', detail: 'Web Services Solution', year: 'Silver · 2026' },
      { name: 'MarTech Breakthrough Awards', detail: 'Best eCommerce Web Platform', year: '2025' },
      { name: 'Horizon Interactive Awards', detail: 'Online Store and Marketplace for eCommerce', year: 'Bronze · 2023' },
      { name: 'Stevie® Awards', detail: 'eCommerce Solutions', year: 'Bronze · 2023' },
      { name: 'BIG Awards for Business', detail: 'Bluehost Online Store and Marketplace, Product of the Year', year: '2022' },
      { name: 'The Ad Club Hatch Awards', detail: 'Film Advertisement', year: 'Bronze · 2022' },
      { name: 'U.S. News 360 Reviews', detail: 'Best Web Hosting Services of 2022', year: '2022' },
    ],
  },
]

const stats: [string, string][] = [
  ['21', 'awards and honors across our people, service and products'],
  ['10', 'Top Workplace awards in 2026'],
  ['4', 'Stevie® Awards for customer service and eCommerce'],
]

/** "Recognized for our people and our work" — stats + accordion of award groups. */
export function Awards({ id }: { id?: string }) {
  const [open, setOpen] = useState(2)
  return (
    <section id={id} className="scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff] px-4 py-[100px]">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[420px_1fr] lg:gap-[90px]">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">Recognition</p>
          <h2 className="h-section">
            Recognized for <span className="text-bh-blue">our people and our work</span>
          </h2>
          <p className="text-base leading-[1.4]">Every award reflects what our teams build together, for our customers and for each other.</p>
          <ul className="mt-4 flex flex-col gap-3">
            {stats.map(([n, l]) => (
              <li key={l} className="flex items-center gap-6 rounded-xl bg-white/70 px-6 py-4">
                <span className="w-12 text-[38px] font-semibold leading-none text-bh-blue">{n}</span>
                <span className="text-sm leading-[1.4]">{l}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          {groups.map((g, i) => {
            const isOpen = open === i
            return (
              <div key={g.title} className="overflow-hidden rounded-2xl border border-bh-light-200 bg-white shadow-[0_8px_30px_rgba(0,42,102,0.06)]">
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 px-6 py-5 text-left">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-icon-bg">
                    <img src={g.icon} alt="" className="size-[26px]" />
                  </span>
                  <span className="flex-1 text-[18px] font-medium">{g.title}</span>
                  <span className="rounded-full bg-bh-blue px-3 py-0.5 text-xs font-medium text-white">{g.awards.length} awards</span>
                </button>
                {isOpen && (
                  <ul className="px-6 pb-4 animate-[fadeUp_0.3s_ease-out]">
                    {g.awards.map((a, k) => (
                      <li key={k} className="flex items-center gap-4 border-t border-[#eef2f7] py-3">
                        <img src={medal(a.year)} alt="" className="size-9 shrink-0" />
                        <span className="flex flex-1 flex-col">
                          <span className="text-sm font-semibold">{a.name}</span>
                          {a.detail && <span className="text-[13px] text-night-sky">{a.detail}</span>}
                        </span>
                        <span className="shrink-0 rounded-full bg-bh-light-0 px-2.5 py-0.5 text-xs text-bh-blue">{a.year}</span>
                      </li>
                    ))}
                    {g.note && <li className="pt-2 text-xs text-night-sky">{g.note}</li>}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
