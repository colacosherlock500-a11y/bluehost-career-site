import iconAnimation from '../../../assets/img/home/icon-animation.svg'
import iconChart from '../../../assets/img/home/icon-chart.svg'
import iconCommunity from '../../../assets/img/home/icon-community.svg'
import iconIdea from '../../../assets/img/home/icon-idea.svg'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../ui/Button'
import { FeatureCard } from '../../ui/FeatureCard'
import { useT } from '../../../i18n/I18n'

const features = [
  { icon: iconCommunity, title: 'You belong here from day one', body: 'Across countries, cultures, and time zones, we are real people who show up for each other. Your voice is heard, your perspective matters, and your story becomes part of ours.' },
  { icon: iconIdea, title: 'Build what helps businesses think big', body: 'Your work reaches the florist launching her first website, the creator shipping a new app with AI, the online store growing with WooCommerce, and the small business climbing in search results. We test the limits of AI and pair it with real human expertise, so every business gets a real chance to compete.' },
  { icon: iconChart, title: 'Grow in more than one direction', body: 'Many of our people have grown from their first role into new teams and leadership positions. We invest in learning, mentorship, and internal mobility, so your ambition is always matched by opportunity.' },
  { icon: iconAnimation, title: 'Shine for what you bring', body: 'Great ideas can come from anyone on the team. We give you the ownership to experiment and the support to embrace innovation, and we invite you to be the brand, sharing the work you are proud of with the world.' },
]

/**
 * "Build anything. Host anything. Run your business." — the text grows into place: each line
 * scales up from small, one after another, when the card scrolls into view; then the lines
 * take turns getting a little larger. Reduced motion: static.
 */
function StatementCard() {
  const t = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [focus, setFocus] = useState(-1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setInView(true)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setFocus(-1)
    let n = -1
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => setFocus((n = (n + 1) % 3)), 1600)
      cleanup = () => window.clearInterval(id)
    }, 1500)
    let cleanup = () => window.clearTimeout(start)
    return () => {
      window.clearTimeout(start)
      cleanup()
    }
  }, [inView])

  const line = (i: number, origin: string) => {
    const scale = !inView ? 'scale-[0.55] opacity-0' : focus === -1 || focus === i ? (focus === i ? 'scale-[1.08] opacity-100' : 'scale-100 opacity-100') : 'scale-[0.94] opacity-70'
    return `${origin} transition-[scale,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${scale}`
  }
  const delay = (i: number) => ({ transitionDelay: inView && focus === -1 ? `${i * 220}ms` : '0ms' })

  return (
    <div ref={ref} className="relative aspect-[582/485] w-full max-w-[582px] overflow-hidden rounded-2xl bg-bh-blue text-[clamp(28px,4vw,48px)] font-semibold leading-[1.2] tracking-[-0.24px] text-white">
      <p className={`absolute left-[6.4%] top-[21%] ${line(0, 'origin-left')}`} style={delay(0)}>{t('Build anything.')}</p>
      <div className={`absolute left-[23.4%] top-[43.2%] flex h-[16.7%] w-[98%] items-center bg-bh-blue-1000 pl-[34px] text-bh-light-200 ${line(1, 'origin-left')}`} style={delay(1)}>
        {t('Host anything.')}
      </div>
      <p className={`absolute inset-x-0 top-[67%] text-center ${line(2, 'origin-center')}`} style={delay(2)}>
        <em className="font-bold text-bh-light-100">{t('Run')}</em> {t('your business.')}
      </p>
    </div>
  )
}

export function WhyBluehost() {
  const t = useT()
  return (
    <section className="px-4 py-[100px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-20">
          <div className="flex flex-col items-start gap-5 lg:w-[538px] lg:shrink-0">
            <p className="eyebrow">{t('Why Bluehost')}</p>
            <h2 className="text-[clamp(34px,4vw,48px)] font-semibold leading-[1.2] tracking-[-0.24px]">
              {t('A place built by people who believe in')} <span className="text-bh-blue">{t('what they do')}</span>
            </h2>
            <p className="text-lead">
              {t("For more than 20 years, our brands have helped small businesses succeed online. Today, Bluehost Group brings together Bluehost, HostGator, Yoast, and YITH. Each brand offers its own products and services, and together they help business builders build anything, host anything, and run their business, with real people ready to help whenever they need us. That work starts with our own people. When you join us, you join a team that puts customers first, trusts you with real challenges, and celebrates what we achieve together.")}
            </p>
            <Button to="/life-at-bluehost" className="w-[189px]">{t('Learn more')}</Button>
          </div>
          <StatementCard />
        </div>
        <div className="grid gap-[30px] md:grid-cols-2">
          {features.map(f => (
            <FeatureCard key={f.title} icon={f.icon} title={t(f.title)} body={t(f.body)} />
          ))}
        </div>
      </div>
    </section>
  )
}
