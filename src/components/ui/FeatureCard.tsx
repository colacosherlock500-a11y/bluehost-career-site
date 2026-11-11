import glow from '../../assets/img/home/card-glow.svg'

/**
 * White card with blue outline, icon tile, title and body ("Feature" component in Figma).
 * Hover/focus follows the prototype's Variant2: the card grows ~6%, the outline turns
 * Bluehost blue with a deeper blue shadow, the icon tile fills blue, and the blurred
 * light streak sweeps diagonally across the card.
 */
export function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div
      tabIndex={0}
      className="group relative flex h-full flex-col overflow-hidden rounded-[15px] border-[0.94px] border-bh-300 bg-white p-[28px] card-shadow outline-none transition-[scale,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:scale-[1.064] hover:border-bh-blue hover:shadow-[0_8px_80px_rgba(0,115,182,0.21),0_-8px_80px_rgba(0,0,0,0.1)] focus-visible:z-10 focus-visible:scale-[1.064] focus-visible:border-bh-blue motion-reduce:hover:scale-100"
    >
      <img
        aria-hidden
        src={glow}
        alt=""
        className="pointer-events-none absolute -left-[230px] -top-[310px] h-[821px] w-[86px] rotate-[50.32deg] opacity-80 transition-[translate,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[300px] group-hover:translate-y-[230px] group-hover:opacity-100 group-focus-visible:translate-x-[300px] group-focus-visible:translate-y-[230px]"
      />
      <div className="relative flex flex-col gap-[11.3px]">
        <span className="flex size-[46px] items-center justify-center rounded-[6.9px] bg-icon-bg transition-colors duration-500 group-hover:bg-bh-blue group-focus-visible:bg-bh-blue">
          <img src={icon} alt="" className="size-8 transition-[filter] duration-500 group-hover:brightness-0 group-hover:invert group-focus-visible:brightness-0 group-focus-visible:invert" />
        </span>
        <h3 className="text-[19.75px] font-semibold leading-[26px] text-ink">{title}</h3>
        <p className="text-[14px] leading-[1.4] tracking-[-0.14px] text-bh-blue-1100">{body}</p>
      </div>
    </div>
  )
}
