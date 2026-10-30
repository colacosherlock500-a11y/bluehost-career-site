import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import instagram from '../../assets/img/social/instagram.svg'
import igWhite from '../../assets/img/social/ig-white.svg'
import linkedin from '../../assets/img/social/linkedin.svg'
import post1 from '../../assets/img/social/post-1.jpg'
import post2 from '../../assets/img/social/post-2.jpg'
import post3 from '../../assets/img/social/post-3.jpg'
import post4 from '../../assets/img/social/post-4.jpg'
import post5 from '../../assets/img/social/post-5.jpg'
import { Button } from '../ui/Button'

const INSTAGRAM_URL = 'https://www.instagram.com/bluehost/'

// Fan of social posts: [image, x-offset from centre, width, height, z-index]
const posts: [string, number, number, number, number][] = [
  [post3, -352, 289, 393, 2],
  [post4, -213, 299, 407, 4],
  [post5, 0, 318.5, 433, 5],
  [post1, 206, 299, 407, 3],
  [post2, 332, 289, 393, 1],
]

function FacebookIcon() {
  return (
    <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
      <circle cx="14" cy="14" r="14" fill="#1877F2" />
      <path d="M15.6 22.5v-7.1h2.4l.36-2.8H15.6v-1.8c0-.8.22-1.35 1.38-1.35h1.47V7c-.26-.03-1.13-.11-2.14-.11-2.12 0-3.57 1.29-3.57 3.67v2.04H10.3v2.8h2.4v7.1h2.9z" fill="#fff" />
    </svg>
  )
}

/** Cycling LinkedIn → Instagram → Facebook icon above the CTA ("Social animation" in Figma). */
function SocialSpinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % 3), 1800)
    return () => window.clearInterval(id)
  }, [])
  const icons = [<img key="li" src={linkedin} alt="" className="size-[29px]" />, <img key="ig" src={instagram} alt="" className="size-7" />, <FacebookIcon key="fb" />]
  return (
    <div className="relative h-[29px] w-[29px]" aria-hidden>
      {icons.map((icon, n) => (
        <span key={n} className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${n === i ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          {icon}
        </span>
      ))}
    </div>
  )
}

export function SocialCards() {
  return (
    <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Follow Bluehost on Instagram" className="group relative block h-[clamp(320px,40vw,558px)] w-full max-w-[1199px] overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[558px] w-[1199px] -translate-x-1/2 -translate-y-1/2 max-xl:scale-90 max-lg:scale-75 max-md:scale-[0.6] max-sm:scale-[0.42]">
        {posts.map(([src, x, w, h, z]) => (
          // Hover (Figma "Cards" variants): the card comes to the front and grows to the
          // featured size (343 × 466) around its own centre; the others stay in place.
          <div
            key={src}
            className="absolute top-1/2 z-[var(--z)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[12.6px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-[scale,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[var(--hover-scale)] hover:shadow-[0_24px_50px_rgba(0,42,102,0.28)]"
            style={{ width: w, height: h, left: `calc(50% + ${x}px)`, '--z': z, '--hover-scale': 343 / w } as CSSProperties}
          >
            <img src={src} alt="" className="size-full object-cover" />
            <img src={igWhite} alt="" className="absolute bottom-[4.5%] right-[5.8%] w-[6.8%]" />
          </div>
        ))}
      </div>
    </a>
  )
}

interface JoinCtaProps {
  eyebrow?: string
  title?: ReactNode
  body?: string
  /** Show the secondary "Meet Our Teams" button. */
  showTeamsButton?: boolean
  /** Job search variant: static social icon row under "join our socials" instead of the animated icon. */
  socialRow?: boolean
}

export function JoinCta({
  eyebrow = 'join us',
  title = (
    <>
      Your next chapter{' '}
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(89.7deg, #196cdf 26%, #83c0fc 100%)' }}>
        starts here
      </span>
    </>
  ),
  body = "Bring your curiosity and your courage. We'll bring the team, the tools, and the support to help you grow and shine.",
  showTeamsButton = true,
  socialRow = false,
}: JoinCtaProps) {
  return (
    <section className="flex flex-col items-center gap-10 px-4 pb-[60px] pt-[100px]">
      <div className="flex flex-col items-center gap-5 text-center">
        {!socialRow && <SocialSpinner />}
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-section">{title}</h2>
        <p className="text-lead max-w-[734px]">{body}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-[18px]">
        <Button to="/jobs">View All open roles</Button>
        {showTeamsButton && <Button to="/our-teams" variant="outline">Meet Our Teams</Button>}
      </div>
      <div className="flex flex-col items-center gap-3">
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-base font-semibold uppercase leading-[1.5] tracking-[-0.08px] text-bh-blue hover:underline">
          join our socials
        </a>
        {socialRow && (
          <div className="flex items-center gap-[14px]">
            <a href="https://www.facebook.com/bluehost" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><img src={instagram} alt="" className="size-7" /></a>
            <a href="https://www.linkedin.com/company/bluehost-com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={linkedin} alt="" className="size-7" /></a>
          </div>
        )}
      </div>
      <SocialCards />
    </section>
  )
}
