import type { ReactNode } from 'react'
import andrew from '../../assets/img/people/andrew-jackson.jpg'
import jorge from '../../assets/img/people/jorge-tristan.png'
import jose from '../../assets/img/people/jose-castellano.png'
import maaz from '../../assets/img/people/maaz-mansoor.png'
import rakshitha from '../../assets/img/people/rakshitha-rai.png'
import ring from '../../assets/img/common/avatar-ring.svg'
import star from '../../assets/img/common/star.svg'
import { Marquee } from '../ui/Marquee'
import { SectionHeader } from '../ui/SectionHeader'

export interface Testimonial {
  quote: string
  name: string
  role: string
  photo: string
}

export const testimonials: Testimonial[] = [
  { quote: 'My journey here started 14 years ago. What I love most is how the company has evolved so many times. It feels like starting a new job every few years, but with the same great people by your side. Roles may change, but the sense of community stays the same.', name: 'Jorge Tristan', role: 'System Administrator · Argentina', photo: jorge },
  { quote: "I joined as a Sales Agent, and less than a year later I was part of the Bluehost marketing team. Growth here isn't just possible, it's encouraged. This is a place where your ambition is matched by opportunity.", name: 'Maaz Mansoor', role: 'Product Marketing Specialist · Canada', photo: maaz },
  { quote: 'I joined Bluehost in 2016 and have seen firsthand how deeply the company lives its customer-first culture. What has kept me here is the people and the purpose. If you are looking for a place where you feel valued and proud of the difference your work makes, you will find it here.', name: 'Andrew Jackson', role: 'Director, Customer Advocacy · United States', photo: andrew },
  { quote: 'My favorite part of my job is the people. I get to work with teams not just in India, but across the globe. Working with people from different cultural backgrounds brings fresh perspectives and little learning moments every day.', name: 'Rakshitha Rai', role: 'Content Marketing · India', photo: rakshitha },
  { quote: 'What keeps me going is knowing that every effort we make, every customer we help, and every solution we find contributes to something bigger than ourselves. We are here to grow, support each other, and make a difference.', name: 'Jose Castellano', role: 'Product Support Specialist · Philippines', photo: jose },
]

export function ReviewCard({ quote, name, role, photo }: Testimonial) {
  return (
    <figure className="flex h-[400px] w-[337px] shrink-0 flex-col justify-between rounded-[13px] border border-bh-light-200 bg-white px-[25px] py-[29px]">
      <div className="flex flex-col gap-[17px]">
        <div className="flex" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <img key={i} src={star} alt="" className="size-[19px]" />
          ))}
        </div>
        <blockquote className="text-[15px] leading-[1.4] tracking-[-0.15px]">{quote}</blockquote>
      </div>
      <figcaption className="flex items-start gap-[5px]">
        <span className="relative size-[50px] shrink-0">
          <img src={photo} alt="" className="absolute left-[2px] top-[2px] size-[46px] rounded-full object-cover" />
          <img src={ring} alt="" className="absolute inset-0 size-[50px]" />
        </span>
        <span className="flex flex-col gap-px">
          <span className="text-base font-semibold leading-6">{name}</span>
          <span className="text-[13px] leading-[19px] text-bh-blue">{role}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/** "Stories from the people who make Bluehost" — auto-scrolling testimonial cards with faded edges. */
export function Testimonials({ title, eyebrow = 'Our People', items = testimonials }: { title?: ReactNode; eyebrow?: string; items?: Testimonial[] }) {
  return (
    <section className="flex flex-col items-center gap-10 py-[100px]">
      <SectionHeader
        className="px-4"
        eyebrow={eyebrow}
        title={title ?? (<>Stories from the people <span className="text-bh-blue">who make Bluehost</span></>)}
        body="Hear from colleagues around the world about what it means to belong, build, grow, and shine here."
      />
      <div className="relative w-full py-10">
        <Marquee gap={29} scrollLinked>
          {items.map(t => (
            <ReviewCard key={t.name} {...t} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(300px,15vw)] bg-gradient-to-r from-white/80 to-white/0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[min(300px,15vw)] bg-gradient-to-l from-white/80 to-white/0" />
      </div>
    </section>
  )
}
