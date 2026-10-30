import { affinityCategories, affinityGroups, type AffinityGroup } from '../../../data/affinityGroups'
import { Marquee } from '../../ui/Marquee'

/** Figma "Affiliate" card: on hover the gradient deepens, the description opens and the category tab turns blue. */
function AffinityCard({ group }: { group: AffinityGroup }) {
  return (
    <div
      tabIndex={group.description ? 0 : undefined}
      className="group relative h-[307px] w-[384px] shrink-0 overflow-hidden rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-bh-blue"
    >
      <img src={group.image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-[rgba(1,33,70,0)] to-[rgba(1,33,70,0.6)] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(1,33,70,0.1)] from-[2%] to-[rgba(1,33,70,0.95)] to-[72%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <div className="absolute bottom-14 left-[18px] flex w-[342px] flex-col text-white">
        <p className="text-[23px] font-semibold leading-[1.33] tracking-[-0.23px]">{group.name}</p>
        {group.description && (
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
            <p className="overflow-hidden text-[14px] leading-[1.4] tracking-[-0.14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="block pt-[7px]">{group.description}</span>
            </p>
          </div>
        )}
      </div>
      {/* white notch with the category, matching the masked card shape in Figma */}
      <span className="absolute bottom-0 right-0 flex h-[46px] w-[159px] items-center justify-center rounded-tl-[10px] bg-white text-[13px] font-semibold uppercase tracking-[0.13px] text-bh-blue">
        <span className="absolute bottom-0 right-0 h-10 w-[152px] rounded-tl-[10px] bg-bh-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="relative leading-[1.4] transition-colors duration-300 group-hover:translate-x-[3.5px] group-hover:translate-y-[3px] group-hover:text-white group-focus-visible:translate-x-[3.5px] group-focus-visible:translate-y-[3px] group-focus-visible:text-white">{group.category}</span>
      </span>
    </div>
  )
}

export function AffinityGroups({ id }: { id?: string }) {
  const half = Math.ceil(affinityGroups.length / 2)
  return (
    <section id={id} className="scroll-mt-24 py-[60px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4">
        <div className="flex max-w-[1047px] flex-col items-center gap-5 text-center">
          <p className="eyebrow">community</p>
          <h2 className="h-section">
            Find your people in our <span className="text-bh-blue">affinity groups</span>
          </h2>
          <p className="text-lead max-w-[914px]">Our 33 employee-led affinity groups create space for connection, learning, advocacy, and a lot of fun. Whether you want to champion inclusion, train for a race, or share your favorite recipe, there is a community waiting for you.</p>
        </div>
        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[29px]">
          {affinityCategories.map(c => (
            <div key={c.title} className="flex flex-col gap-1">
              <p className="text-[20px] font-semibold leading-[1.3]">{c.title} ({c.count}):</p>
              <p className="text-[15px] leading-[1.4]">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-[33px]">
        <Marquee gap={25} duration={90}>
          {affinityGroups.slice(0, half).map(g => <AffinityCard key={g.name} group={g} />)}
        </Marquee>
        <Marquee gap={25} duration={90} reverse>
          {affinityGroups.slice(half).map(g => <AffinityCard key={g.name} group={g} />)}
        </Marquee>
      </div>
    </section>
  )
}
