import { useEffect, useState } from 'react'
import belong from '../../assets/img/evp/belong.jpg'
import build from '../../assets/img/evp/build.jpg'
import grow from '../../assets/img/evp/grow.jpg'
import logo3d from '../../assets/img/evp/logo-3d.webp'
import oneTeam from '../../assets/img/evp/one-team.jpg'
import shine from '../../assets/img/evp/shine.jpg'

const pillars = [
  { title: 'Belong', image: belong, body: 'You join a global community of colleagues across 16 countries and 33 employee-led affinity groups. New hires are welcomed by teams that love helping each other, and many of our people build friendships and mentorships that last for years.' },
  { title: 'Build', image: build, body: 'Through Bluehost, HostGator, Yoast, and YITH, you help business builders build anything, host anything, and run their business with AI-powered tools, reliable hosting, and real human support. We focus on execution, test early, and learn from what our customers tell us.' },
  { title: 'Grow', image: grow, body: 'You have access to learning programs, education support in many countries, and real opportunities to move into new roles and teams. You are encouraged to test the limits of AI and grow your skills along the way.' },
  { title: 'Shine', image: shine, body: 'You are trusted with ownership from day one. Ideas are heard and acted on, trial and error is part of how we learn, and you are invited to be the brand, sharing the work you are proud of.' },
  { title: 'As one team', image: oneTeam, body: "We break down silos between functions and countries, share what we learn, and win together. Our success is measured by our customers' growth and by how helpful we are, to them and to each other." },
]

const pad = (n: number) => String(n).padStart(2, '0')

/** "Our promise to you" — EVP pillars (Belong, Build, Grow, Shine, As one team) cycling around the 3D logo. */
export function PromiseCarousel({ id }: { id?: string }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setI(n => (n + 1) % pillars.length), 6000)
    return () => window.clearInterval(t)
  }, [paused])
  const p = pillars[i]
  const next = pillars[(i + 1) % pillars.length]

  return (
    <section id={id} className="scroll-mt-24 bg-gradient-to-b from-[#e6f3ff] to-[#d4e9ff] px-4 py-[59px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex max-w-[909px] flex-col items-center gap-5 text-center">
          <p className="eyebrow">Our promise to you</p>
          <h2 className="h-section">What belonging, building, growing, and shining look like here</h2>
          <p className="text-lead max-w-[712px]">Our employee value proposition is more than words on a page. Here is how it shows up in your everyday work.</p>
        </div>

        <div className="relative grid w-full items-center gap-6 md:grid-cols-[348px_1fr_176px]">
          <button key={`a${i}`} onClick={() => setI(n => (n - 1 + pillars.length) % pillars.length)} aria-label="Previous" className="relative mx-auto aspect-[348/253] w-full max-w-[348px] overflow-hidden rounded-[14px] shadow-[0_20px_50px_rgba(0,42,102,0.2)] animate-[fadeUp_0.6s_ease-out]">
            <img src={p.image} alt="" className="size-full object-cover" />
            <span className="absolute left-4 top-3 text-[25px] font-semibold text-white drop-shadow">{pad(i + 1)}</span>
          </button>
          <img src={logo3d} alt="" className="mx-auto w-full max-w-[442px]" />
          <button key={`b${i}`} onClick={() => setI(n => (n + 1) % pillars.length)} aria-label="Next" className="relative mx-auto hidden aspect-[176/128] w-[176px] rotate-[8deg] overflow-hidden rounded-[10px] opacity-90 blur-[1.5px] transition hover:blur-0 md:block">
            <img src={next.image} alt="" className="size-full object-cover" />
            <span className="absolute bottom-2 right-3 text-[19px] font-semibold text-white">{pad(((i + 1) % pillars.length) + 1)}</span>
          </button>
        </div>

        <div key={`t${i}`} className="flex max-w-[702px] flex-col items-center gap-[10px] text-center animate-[fadeUp_0.5s_ease-out]" aria-live="polite">
          <p className="text-[15px] font-semibold">
            <span className="text-bh-blue">{pad(i + 1)}</span>/<span className="text-[12px] text-night-sky">{pad(pillars.length)}</span>
          </p>
          <h3 className="text-[25px] font-semibold leading-[1.33]">{p.title}</h3>
          <p className="text-base leading-[1.4] tracking-[-0.16px]">{p.body}</p>
          <div className="mt-2 flex gap-2" role="tablist" aria-label="Our promise">
            {pillars.map((x, n) => (
              <button key={x.title} role="tab" aria-selected={n === i} aria-label={x.title} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-bh-blue' : 'w-2 bg-bh-light-300'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
