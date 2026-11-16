import { useEffect, useRef, useState, type ReactNode } from 'react'
import instagram from '../../assets/img/social/instagram.svg'
import linkedin from '../../assets/img/social/linkedin.svg'
import liPost1 from '../../assets/img/social/li-post-1.jpg'
import liPost2 from '../../assets/img/social/li-post-2.jpg'
import liPost3 from '../../assets/img/social/li-post-3.jpg'
import liPost4 from '../../assets/img/social/li-post-4.jpg'
import liPost5 from '../../assets/img/social/li-post-5.jpg'
import liPost6 from '../../assets/img/social/li-post-6.jpg'
import liPost7 from '../../assets/img/social/li-post-7.jpg'
import { Button } from '../ui/Button'
import { useT } from '../../i18n/I18n'

const INSTAGRAM_URL = 'https://www.instagram.com/bluehost/'

const LINKEDIN_URL = 'https://www.linkedin.com/company/bluehost-com'

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

/*
 * LinkedIn posts fanned out as in the Figma ("Come build what's next with us", node 1163:36775):
 * seven portrait cards overlapping towards a larger centre card. Positions are the Figma ones
 * on a 1199 x 453 stage, scaled to the available width. When the row scrolls into view the
 * cards fan out from the centre one by one; hovering a card brings it to the front.
 * Reduced motion: the fan is shown as is.
 */
const STAGE_W = 1199
const STAGE_H = 453
const FAN = [
  { src: liPost1, x: 49, y: 40, w: 275, h: 374, z: 2 },
  { src: liPost2, x: 118, y: 29, w: 289, h: 393, z: 3 },
  { src: liPost3, x: 249, y: 23, w: 299, h: 407, z: 5 },
  { src: liPost4, x: 440, y: 10, w: 319, h: 433, z: 6 },
  { src: liPost5, x: 651, y: 23, w: 299, h: 407, z: 4 },
  { src: liPost6, x: 792, y: 29, w: 289, h: 393, z: 1 },
  { src: liPost7, x: 875, y: 40, w: 275, h: 374, z: 0 },
]
const CENTER = FAN[3]

export function SocialCards() {
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const fit = () => setScale(Math.max(0.5, Math.min(1.15, el.clientWidth / STAGE_W)))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOpen(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOpen(true), { threshold: 0.3 })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrap} role="region" aria-label="Bluehost on LinkedIn" className="relative w-full overflow-hidden" style={{ height: STAGE_H * scale + 24 }}>
      <div className="absolute left-1/2 top-3" style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>
        {FAN.map((c, i) => {
          // closed: tucked behind the centre card
          const dx = open ? 0 : CENTER.x + CENTER.w / 2 - (c.x + c.w / 2)
          const delay = open ? Math.abs(i - 3) * 110 : 0
          return (
            <a
              key={i}
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Bluehost post on LinkedIn"
              className="group absolute block hover:!z-20 focus-visible:!z-20"
              style={{
                left: c.x,
                top: c.y,
                width: c.w,
                height: c.h,
                zIndex: c.z,
                transform: `translateX(${dx}px) scale(${open ? 1 : 0.92})`,
                opacity: open || i === 3 ? 1 : 0,
                transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 500ms ease ${delay}ms`,
              }}
            >
              <span className="block size-full overflow-hidden rounded-[12px] shadow-[0_10px_30px_rgba(0,42,102,0.16)] transition-[translate,scale,box-shadow] duration-300 ease-out group-hover:-translate-y-4 group-hover:scale-[1.05] group-hover:shadow-[0_26px_56px_rgba(0,42,102,0.3)] group-focus-visible:-translate-y-4 group-focus-visible:scale-[1.05]">
                <img src={c.src} alt="" draggable={false} className="size-full object-cover" />
              </span>
            </a>
          )
        })}
      </div>
    </div>
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
  eyebrow = '',
  title,
  body,
  showTeamsButton = false,
  socialRow = false,
}: JoinCtaProps) {
  const t = useT()
  // Spacing per the Figma "Come build what's next with us" layout: heading, 40 px, button,
  // 40 px, "Join our socials" with the icon under it, 40 px, the post fan.
  return (
    <section className="flex flex-col items-center gap-10 px-4 pb-[60px] pt-[100px]">
      <div className="flex flex-col items-center gap-5 text-center">
        {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
        <h2 className="h-section">
          {title ?? (
            <>
              {t("Come build what's next")}{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #196cdf 30%, #83c0fc 100%)' }}>
                {t('with us')}
              </span>
            </>
          )}
        </h2>
        {body && <p className="text-lead max-w-[734px]">{t(body)}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-[18px]">
        <Button to="/jobs">{t('View Open Roles')}</Button>
        {showTeamsButton && <Button to="/our-teams" variant="outline">{t('Meet Our Teams')}</Button>}
      </div>
      <div className="flex flex-col items-center gap-3">
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="text-base font-semibold uppercase leading-[1.5] tracking-[-0.08px] text-bh-blue hover:underline">
          {t('join our socials')}
        </a>
        {socialRow ? (
          <div className="flex items-center gap-[14px]">
            <a href="https://www.facebook.com/bluehost" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><img src={instagram} alt="" className="size-7" /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={linkedin} alt="" className="size-7" /></a>
          </div>
        ) : (
          <SocialSpinner />
        )}
      </div>
      <SocialCards />
    </section>
  )
}
