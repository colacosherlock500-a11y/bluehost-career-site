import iconBelonging from '../assets/img/life/icon-belonging.svg'
import iconGrowth from '../assets/img/life/icon-growth.svg'
import iconOneTeam from '../assets/img/life/icon-oneteam.svg'
import iconPurpose from '../assets/img/life/icon-purpose.svg'
import businessBuilder from '../assets/img/life/business-builder.jpg'
import heroSky from '../assets/img/life/hero-sky.jpg'
import howWeWork from '../assets/img/life/how-we-work.jpg'
import ashley from '../assets/img/people/ashley-pitts.jpg'
import brittney from '../assets/img/people/brittney-baring.jpg'
import candice from '../assets/img/people/candice-bethea.jpg'
import chelsey from '../assets/img/people/chelsey-attia.jpg'
import valBelonging from '../assets/img/values/belonging.svg'
import valCustomer from '../assets/img/values/customer.svg'
import valExcellence from '../assets/img/values/excellence.svg'
import valOneTeam from '../assets/img/values/one-team.svg'
import bluehostLogo from '../assets/img/logos/bluehost.svg'
import yith from '../assets/img/logos/yith.svg'
import yoast from '../assets/img/logos/yoast.png'
import { AffinityGroups } from '../components/sections/life/AffinityGroups'
import { Awards } from '../components/sections/life/Awards'
import { Benefits } from '../components/sections/life/Benefits'
import { WhatWeDo } from '../components/sections/life/WhatWeDo'
import { JoinCta } from '../components/sections/JoinCta'
import { HostGatorLogo, LogoStrip } from '../components/sections/LogoStrip'
import { PromiseCarousel } from '../components/sections/PromiseCarousel'
import { ReviewCard, type Testimonial } from '../components/sections/Testimonials'
import { Button } from '../components/ui/Button'
import { FeatureCard } from '../components/ui/FeatureCard'
import { SectionHeader } from '../components/ui/SectionHeader'

const chips = [
  [iconBelonging, 'Belonging'],
  [iconPurpose, 'Purpose'],
  [iconGrowth, 'Growth'],
  [iconOneTeam, 'One team'],
]

const stats = [
  ['4', 'Brands'],
  ['5M+', 'Customers worldwide'],
  ['100+', 'Countries where customers build with us'],
  ['1100+', 'Employees'],
]

const brands = [
  { logo: <img src={bluehostLogo} alt="Bluehost" className="h-6 w-[133px]" />, body: 'The AI-powered business platform that helps small businesses, developers, and agencies build, grow, and run online with confidence. Recommended by WordPress.org since 2005.', cta: 'Visit Bluehost', url: 'https://www.bluehost.com' },
  { logo: <HostGatorLogo />, body: 'A developer-friendly hosting platform known for freedom and flexibility, helping businesses get online and grow, with a strong presence in Latin America.', cta: 'Visit HostGator', url: 'https://www.hostgator.com' },
  { logo: <span role="img" aria-label="Yoast" className="relative block h-[35.6px] w-[74px] overflow-hidden"><img src={yoast} alt="" className="absolute left-0 top-0 h-[121.81%] w-[242.95%] max-w-none" /></span>, body: 'One of the most user-friendly SEO plugins for WordPress, helping websites and businesses get found online.', cta: 'Visit Yoast', url: 'https://yoast.com' },
  { logo: <img src={yith} alt="YITH" className="h-[43.6px] w-[66.7px]" />, body: 'One of the largest collections of WooCommerce plugins for WordPress, known for its ease of use and for helping online stores sell more.', cta: 'Visit Yith', url: 'https://yithemes.com' },
]

const values = [
  { icon: valCustomer, title: 'Focus on the customer, always', body: 'Every decision starts with the people who trust us with their business. We listen closely, act with care, and make sure that what we say and what we do are the same.' },
  { icon: valOneTeam, title: 'Act as one team to deliver exceptional results', body: 'Our people achieve extraordinary things when they work together as one global team. We share context, lift each other up, and celebrate our wins together.' },
  { icon: valExcellence, title: 'Demonstrate passion for excellence', body: 'Being a good company is not enough for us. We set a high bar for quality, stay curious, and keep improving, because small businesses count on us to get it right.' },
  { icon: valBelonging, title: 'Foster a sense of belonging', body: 'People from different cultures, backgrounds, and locations work together here with confidence and empathy. Everyone is welcome, and every voice adds to who we are.' },
]

const howWeWorkCards = [
  { title: 'Focus on execution', body: 'We deliver on our commitments, embrace and accelerate innovation, and test the limits of AI to find better ways to serve our customers. Fast decisions, empowered teams, and the courage to try new things keep our momentum strong.', bg: '#196cdf' },
  { title: 'Customers first', body: 'We stay curious about what our customers are doing, take the time to know their challenges, and create real value for them. When a business owner succeeds, we all succeed.', bg: 'linear-gradient(90deg, #3b82ec, #5a9df2)' },
  { title: 'Be the brand', body: 'We are passionate about what we build across all our brands, and we post with pride about our work. Every one of us helps make Bluehost Group the place small businesses choose to build, grow, and thrive.', bg: '#64a8f7' },
]

const stories: Testimonial[] = [
  { quote: '"Over a decade in and still growing" sums up my journey here. This is a place where customers come first, ideas are heard and acted on, and I feel supported not just at work but beyond it. Along the way, I\'ve found mentors and lifelong friends.', name: 'Ashley Pitts', role: 'Reputation Manager | United States', photo: ashley },
  { quote: "I've felt most empowered in moments when I was trusted to take an idea, run with it, and turn it into real impact. Having both ownership and the freedom to experiment is where creativity and confidence really grow.", name: 'Chelsey Attia', role: 'Senior Social Media Manager | United States', photo: chelsey },
  { quote: "Borrow someone else's belief in you. Sometimes your leaders or mentors see your potential long before you see it yourself. If you trust them, let their confidence carry you until yours catches up.", name: 'Brittney Baring', role: 'Talent Acquisition Supervisor | Philippines', photo: brittney },
  { quote: "Don't wait until you feel 100% ready. Step forward, speak up, and trust the value of your perspective. Stay curious, build strong networks, and never underestimate the impact you can make.", name: 'Candice Bethea', role: 'Senior Director, Learning and Development | United States', photo: candice },
]

export default function LifeAtBluehostPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={heroSky} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="relative mx-auto flex min-h-[679px] max-w-[700px] flex-col items-center justify-center gap-[26px] px-4 pb-16 pt-[62px] text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px]">life at bluehost</p>
            <h1 className="flex flex-col gap-1 font-semibold">
              <span className="text-[clamp(34px,4vw,48px)] leading-[1.2] tracking-[-0.24px]">A culture built by people</span>
              <span className="bg-clip-text text-[clamp(32px,4vw,46px)] leading-[1.1] tracking-[-1.61px] text-transparent" style={{ backgroundImage: 'linear-gradient(89deg, #0f59c0 26%, #0a78e5 100%)' }}>who show up for each other</span>
            </h1>
            <p className="max-w-[693px] text-base leading-[1.4]">Our culture is shaped by the customers we serve and the colleagues we grow with. Here is how we put customers first, focus on execution, and bring our brands to life every day, as one team.</p>
          </div>
          <Button to="/jobs" variant="white">View open roles</Button>
          <ul className="mt-6 flex flex-wrap justify-center gap-5">
            {chips.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-[14.6px] rounded-[9.7px] px-[10px] py-[6px] text-sm font-semibold shadow-[0px_0px_16px_0px_rgba(0,42,102,0.22),12px_6px_24px_0px_rgba(0,0,0,0.08)] backdrop-blur-[3px]">
                <img src={icon} alt="" className="size-[25px]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <LogoStrip />

      <section className="px-4 py-[80px]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_582px]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">who we are</p>
            <h2 className="h-section">We power prosperity for business builders</h2>
            <p className="text-base leading-[1.75]">Bluehost Group brings together a family of brands that help small businesses and builders succeed online: Bluehost, HostGator, Yoast, and YITH. Each brand offers its own products and services, and all of them share the same vision, the same pillars, and the same focus on the business builders and AI builders we serve. Together, our brands are trusted by millions of customers in more than 100 countries.</p>
            <p className="text-base leading-[1.75]">Behind every product and every solved problem are real people. Our customers keep us human, and they remind us every day why our work matters. We measure our success by two things that matter most to them: the growth of their business and how helpful we are along the way.</p>
          </div>
          <ul className="grid grid-cols-2 gap-[22px]">
            {stats.map(([n, l]) => (
              <li key={l} className="flex aspect-[280/227] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-bh-300 bg-white p-4 text-center">
                <span className="text-[clamp(40px,5vw,72px)] font-semibold leading-none text-bh-blue">{n}</span>
                <span className="text-base leading-[1.4]">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-bh-light-0 px-4 py-[80px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          <SectionHeader eyebrow="Our brands" title="Different brands working toward one shared vision" body="Wherever you work in Bluehost Group, you help business builders show up, stand out, and thrive in the AI era. Each brand serves its customers in its own way, and together they bring our three pillars to life." />
          <ul className="grid w-full gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {brands.map(b => (
              <li key={b.cta} className="flex flex-col justify-between gap-6 rounded-2xl border border-bh-light-200 bg-white p-5 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)]">
                <div className="flex flex-col gap-4">
                  <div className="flex h-11 items-center">{b.logo}</div>
                  <p className="text-sm leading-[1.4]">{b.body}</p>
                </div>
                <Button href={b.url} variant="link" className="self-start !text-sm">{b.cta}</Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhatWeDo />

      <section className="px-4 py-[80px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          <SectionHeader eyebrow="Who we build for" title={<>The builders who <span className="text-bh-blue">inspire our work</span></>} body="Every day, teams across all our brands work for two kinds of builders who are shaping the future of business online. Their success is our scoreboard, and helping them grow is what gets us up in the morning." />
          <div className="grid w-full gap-[30px] md:grid-cols-2">
            <div className="flex min-h-[505px] flex-col gap-4 rounded-2xl p-[53px] pt-[70px] text-white" style={{ backgroundImage: 'linear-gradient(150deg, #5a9ef0 0%, #1e6fe0 60%, #1868d8 100%)' }}>
              <h3 className="text-[clamp(28px,2.6vw,36px)] font-semibold leading-[1.3]">The Business Builder</h3>
              <p className="max-w-[460px] text-base leading-[1.4]">Small business owners who want to grow revenue online. They want simple, effective solutions to be found and win new customers, and a team that helps them when they get stuck.</p>
            </div>
            <div className="min-h-[505px] overflow-hidden rounded-2xl">
              <img src={businessBuilder} alt="A florist managing her online store" className="size-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="scroll-mt-24 bg-gradient-to-b from-white to-[#e6f3ff] px-4 py-[80px]">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-10">
          <SectionHeader eyebrow="What drives us" title={<><span className="text-bh-blue">The purpose</span> behind everything we build</>} />
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
              <span className="rounded-full border border-bh-light-200 bg-white px-4 py-1 text-sm font-semibold text-bh-blue">Our purpose</span>
              <p className="text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.3]">We believe every small business deserves the opportunity to succeed online.</p>
              <p className="text-base leading-[1.6]">Every role at Bluehost Group, in every brand and from support to engineering, connects to a real business with a real dream behind it.</p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <span className="rounded-full border border-bh-light-200 bg-white px-4 py-1 text-sm font-semibold text-bh-blue">Our mission</span>
              <p className="text-[clamp(22px,2.2vw,28px)] font-semibold leading-[1.3]">To give small businesses the confidence to think big.</p>
              <p className="text-base leading-[1.6]">We make complex technology feel simple and keep real human help close, so our customers can focus on what they love.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-[80px]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
          <SectionHeader eyebrow="our values" title={<>The values that guide <span className="text-bh-blue">how we work together</span></>} body="Our values are shared across the Newfold Digital family of brands and lived every day by teams across Bluehost Group around the world." />
          <div className="grid w-full gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {values.map(v => <FeatureCard key={v.title} {...v} />)}
          </div>
        </div>
      </section>

      <section className="px-4 py-[60px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_460px]">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">How we work</p>
              <h2 className="h-section">How every one of us <span className="block text-bh-blue">contributes to our success</span></h2>
            </div>
            <p className="text-sm leading-[1.5]">Our values are shared across the Newfold Digital family of brands and lived every day by teams across Bluehost Group around the world.</p>
          </div>
          <img src={howWeWork} alt="Bluehost colleagues celebrating together" className="h-[429px] w-full rounded-2xl object-cover" />
          <div className="grid gap-[30px] md:grid-cols-3">
            {howWeWorkCards.map(c => (
              <div key={c.title} className="flex flex-col gap-3 rounded-2xl p-6 text-white shadow-[0_20px_40px_rgba(25,108,223,0.18)]" style={{ background: c.bg }}>
                <h3 className="text-[19px] font-semibold">{c.title}</h3>
                <p className="text-sm leading-[1.55]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromiseCarousel id="growth" />
      <Benefits id="benefits" />
      <AffinityGroups id="affinity-groups" />
      <Awards id="awards" />

      <section className="flex flex-col items-center gap-10 px-4 py-[100px]">
        <SectionHeader eyebrow="Our People" title="Real stories from real people" body="Hear from colleagues who have found their place, their voice, and their next step at Bluehost." />
        <div className="no-scrollbar -mx-4 flex w-[calc(100%+32px)] gap-[29px] overflow-x-auto px-4 xl:w-auto xl:justify-center">
          {stories.map(s => <ReviewCard key={s.name} {...s} />)}
        </div>
      </section>

      <JoinCta
        eyebrow="join us"
        title={<>Come build what's next <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 30%, #83c0fc 100%)' }}>with us</span></>}
        body="Explore open roles across our brands, teams, and locations, and help us power prosperity for business builders everywhere."
      />
    </>
  )
}
