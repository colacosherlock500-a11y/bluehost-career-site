import bluehost from '../../assets/img/logos/bluehost.svg'
import backArm from '../../assets/img/logos/hg-backarm.svg'
import backLeg from '../../assets/img/logos/hg-backleg.svg'
import body from '../../assets/img/logos/hg-body.svg'
import frontArm from '../../assets/img/logos/hg-frontarm.svg'
import frontLeg from '../../assets/img/logos/hg-frontleg.svg'
import head from '../../assets/img/logos/hg-head.svg'
import p0 from '../../assets/img/logos/hg-path.svg'
import p1 from '../../assets/img/logos/hg-path1.svg'
import p2 from '../../assets/img/logos/hg-path2.svg'
import p3 from '../../assets/img/logos/hg-path3.svg'
import p4 from '../../assets/img/logos/hg-path4.svg'
import p5 from '../../assets/img/logos/hg-path5.svg'
import s0 from '../../assets/img/logos/hg-shape.svg'
import s1 from '../../assets/img/logos/hg-shape1.svg'
import s2 from '../../assets/img/logos/hg-shape2.svg'
import yith from '../../assets/img/logos/yith.svg'
import yoast from '../../assets/img/logos/yoast.png'
import { Marquee } from '../ui/Marquee'

// HostGator wordmark + "Snappy" mascot are separate vector pieces in Figma; positions are the
// percentage insets from the design (top right bottom left).
const hostgatorPieces: [string, string][] = [
  [p0, '31.92% 54.2% 15.13% 37.6%'],
  [p1, '15.43% 33.77% 14.54% 53.65%'],
  [p2, '15.78% 73.12% 17.18% 16.03%'],
  [s0, '31.26% 62.57% 15.78% 27.61%'],
  [p3, '15.78% 46.26% 15.68% 46.14%'],
  [s1, '31.07% 24.78% 15.67% 66.5%'],
  [p4, '15.78% 16.75% 15.68% 75.65%'],
  [s2, '31.26% 7.38% 15.78% 82.8%'],
  [p5, '31.85% 0.11% 17.18% 93.33%'],
  [backLeg, '72.87% 89.37% 3.64% 8.16%'],
  [backArm, '34.63% 87.29% 29.99% 8.94%'],
  [body, '11.49% 89.62% 15.42% 0.01%'],
  [frontLeg, '68.94% 93.15% 0.71% 4.04%'],
  [frontArm, '32.7% 93.21% 31.01% 2.92%'],
  [head, '0.5% 87.44% 55.07% 5.14%'],
]

export function HostGatorLogo({ className = 'h-[27.7px] w-[155.5px]' }: { className?: string }) {
  return (
    <span role="img" aria-label="HostGator" className={`relative block shrink-0 ${className}`}>
      {hostgatorPieces.map(([src, inset], i) => (
        <img key={i} src={src} alt="" className="absolute block" style={{ inset }} />
      ))}
    </span>
  )
}

function Logos() {
  return (
    <>
      <img src={bluehost} alt="Bluehost" className="h-[23.9px] w-[133.4px] shrink-0" />
      <HostGatorLogo />
      <span role="img" aria-label="Yoast" className="relative block h-[35.6px] w-[74px] shrink-0 overflow-hidden">
        <img src={yoast} alt="" className="absolute left-0 top-0 h-[121.81%] w-[242.95%] max-w-none" />
      </span>
      <img src={yith} alt="YITH" className="h-[43.6px] w-[66.7px] shrink-0" />
    </>
  )
}

/** Brand family ticker (Bluehost, HostGator, Yoast, YITH). */
export function LogoStrip() {
  return (
    <div className="h-[68px] border-y border-[#dce2ea] bg-white drop-shadow-[0px_4px_3px_rgba(160,174,192,0.09)]">
      <Marquee className="h-full" duration={30}>
        <Logos />
        <Logos />
      </Marquee>
    </div>
  )
}
