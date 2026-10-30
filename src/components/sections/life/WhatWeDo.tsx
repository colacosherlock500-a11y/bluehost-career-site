import { useState } from 'react'
import mockup from '../../../assets/img/life/agent-mockup.webp'

const pillars = [
  { tab: 'Build anything', title: 'Dream it, describe it, and create it with AI.', body: 'Our AI-powered app and website builders turn an idea into a live business, with domains, email, and security ready from the start.', bg: 'linear-gradient(90deg, #0a1f45, #1259b8)' },
  { tab: 'Host anything', title: 'Seamless hosting with predictable pricing.', body: 'Whatever our customers build, and wherever they build it, we give it a fast, reliable, and secure home that is simple to manage and easy to scale.', bg: 'linear-gradient(90deg, #1a8fd8, #2bb3ef)' },
  { tab: 'Run your business', title: 'AI agents that help grow revenue.', body: 'Smart agents help businesses get found, run campaigns across social, email, and search, and turn visitors into customers, with real people ready to help along the way.', bg: 'linear-gradient(180deg, #dbeeff, #cfe6ff)' },
]

/** "What we do" — three stacked pillar tabs; the front card shows the active pillar. */
export function WhatWeDo() {
  const [active, setActive] = useState(2)
  const p = pillars[active]
  return (
    <section className="px-4 py-[30px]">
      <div className="mx-auto grid max-w-[1204px] items-center gap-[30px] md:grid-cols-2">
        <div className="flex flex-col gap-6 px-2 md:px-[53px]">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px]">What we do</p>
            <h2 className="text-[clamp(30px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.4px]">
              Build anything.
              <br />
              Host anything.
              <br />
              <span className="text-bh-blue">Run your business.</span>
            </h2>
          </div>
          <p className="max-w-[472px] text-base leading-[1.4] tracking-[-0.16px]">
            Three pillars guide everything our brands create, so business builders can go from idea to growth on one simple and helpful platform.
            <br />
            <br />
            Whatever your role or brand, your work connects to these pillars and to the millions of businesses that depend on them.
          </p>
        </div>

        <div className="relative h-[578px]" role="tablist" aria-label="Our pillars">
          {pillars.map((x, i) => {
            const isActive = i === active
            // stacked tabs: earlier pillars peek above the active card
            const top = isActive ? 73 : i < active ? i * 36.5 : 73 + (i - active) * 36.5
            return (
              <button
                key={x.tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="absolute inset-x-0 h-[505px] overflow-hidden rounded-2xl text-left shadow-[0_-4px_20px_rgba(0,42,102,0.12)] transition-all duration-500"
                style={{ top, zIndex: isActive ? 10 : i, background: isActive ? pillars[2].bg : x.bg }}
              >
                <span className={`block pt-[13px] text-center text-sm font-semibold uppercase tracking-[2px] ${isActive ? 'text-bh-blue-1100' : 'text-white'}`}>{x.tab}</span>
              </button>
            )
          })}
          <div key={active} className="pointer-events-none absolute inset-x-0 z-20 flex flex-col gap-[17px] px-10 animate-[fadeUp_0.4s_ease-out]" style={{ top: 73 + 55 }}>
            <h3 className="max-w-[507px] text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.3]">{p.title}</h3>
            <p className="max-w-[472px] text-base leading-[1.4] tracking-[-0.16px]">{p.body}</p>
            {active === 2 && <img src={mockup} alt="Chat with an AI booking agent" className="mt-4 w-[495px] max-w-full" />}
          </div>
        </div>
      </div>
    </section>
  )
}
