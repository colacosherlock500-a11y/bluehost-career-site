import teamPhoto from '../../../assets/img/home/life-team-photo.jpg'
import { Button } from '../../ui/Button'

export function LifeBanner() {
  return (
    <section className="px-4 py-[50px]">
      <div className="mx-auto grid max-w-[1204px] gap-[30px] md:grid-cols-2">
        <div className="flex min-h-[505px] flex-col justify-center gap-6 rounded-2xl px-[53px] py-10 shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)]" style={{ backgroundImage: 'linear-gradient(180deg, #7fbbfc 0%, #d6edfd 100%)' }}>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase leading-[1.2] tracking-[2px] text-bh-blue-1100">Life at Bluehost</p>
            <h2 className="text-[clamp(30px,3vw,40px)] font-semibold leading-[1.3] tracking-[-0.4px]">A culture you can feel every day</h2>
          </div>
          <p className="max-w-[472px] text-base leading-[1.4] tracking-[-0.16px]">
            Discover the purpose and values that guide us, the benefits that support you where you live, the 33 affinity groups that bring people together, and the recognition our teams have earned along the way.
          </p>
          <Button to="/life-at-bluehost" className="self-start">Life at bluehost</Button>
        </div>
        <div className="relative min-h-[505px] overflow-hidden rounded-2xl shadow-[0px_-8px_80px_0px_rgba(171,157,251,0.1),0px_8px_80px_0px_rgba(106,246,251,0.1)]">
          <img src={teamPhoto} alt="Bluehost team members at a conference booth" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-[rgba(23,105,219,0)] to-[rgba(17,66,135,0.91)]" />
          <Button to="/life-at-bluehost#values" variant="gold-link" className="absolute bottom-8 left-[44px] !text-[15px]">Purpose, mission, and values</Button>
        </div>
      </div>
    </section>
  )
}
