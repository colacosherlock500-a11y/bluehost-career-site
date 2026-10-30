import { careerPathIcon } from '../../data/careerPaths'

/** "Career paths — Where you can build with us" icon cards on team pages. */
export function CareerPaths({ items }: { items: string[] }) {
  return (
    <section className="px-4 py-[50px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">Career paths</p>
          <h2 className="h-section">Where you can build with us</h2>
        </div>
        <ul className="flex flex-wrap justify-center gap-5">
          {items.map(label => (
            <li key={label} className="flex w-[224px] flex-col gap-5 rounded-3xl p-4 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)]">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#e6f3ff]">
                <img src={careerPathIcon(label)} alt="" className="size-7 object-contain" />
              </span>
              <p className="text-[18px] font-medium leading-[1.3] tracking-[-0.18px]">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
