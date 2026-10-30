import glow from '../../assets/img/home/card-glow.svg'

/** White card with blue outline, icon tile, title and body ("Feature" component in Figma). */
export function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] border-[0.94px] border-bh-300 bg-white p-[28px] card-shadow">
      <img aria-hidden src={glow} alt="" className="pointer-events-none absolute -left-[230px] -top-[310px] h-[821px] w-[86px] rotate-[50.32deg] opacity-80" />
      <div className="relative flex flex-col gap-[11.3px]">
        <span className="flex size-[46px] items-center justify-center rounded-[6.9px] bg-icon-bg">
          <img src={icon} alt="" className="size-8" />
        </span>
        <h3 className="text-[19.75px] font-semibold leading-[26px] text-ink">{title}</h3>
        <p className="text-[14px] leading-[1.4] tracking-[-0.14px] text-bh-blue-1100">{body}</p>
      </div>
    </div>
  )
}
