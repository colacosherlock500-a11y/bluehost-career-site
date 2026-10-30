import type { ReactNode } from 'react'
import { SectionHeader } from '../ui/SectionHeader'
import { Globe } from './Globe'

export function GlobeSection({
  eyebrow = 'Around the World',
  title = 'One team, connected across the globe' as ReactNode,
  body = 'From Cebu to Florianópolis and from Mumbai to Jacksonville, our people bring different cultures, languages, and ideas to one shared purpose.',
  selected,
  onSelect,
  id,
}: {
  eyebrow?: string
  title?: ReactNode
  body?: string
  selected?: string | null
  onSelect?: (slug: string | null) => void
  id?: string
}) {
  return (
    <section id={id} className="px-4 pb-[60px] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10">
        <SectionHeader eyebrow={eyebrow} title={title} body={<span className="text-base leading-[1.4] tracking-[-0.08px] text-bh-blue-950">{body}</span>} />
        <Globe selected={selected} onSelect={onSelect} />
        <hr className="mt-6 w-full max-w-[1200px] border-[#e8ecf2]" />
      </div>
    </section>
  )
}
