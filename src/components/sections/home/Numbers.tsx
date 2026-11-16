import { CountUp } from '../../ui/CountUp'
import { useT } from '../../../i18n/I18n'

const stat = 'font-semibold uppercase leading-[1.3]'

export function Numbers() {
  const t = useT()
  // Full width of the screen, within the page margins (HR feedback).
  return (
    <section className="px-[clamp(16px,3vw,48px)] py-[100px]">
      <div className="grid w-full gap-[30px] md:grid-cols-[1fr_minmax(462px,46%)] md:gap-y-[33px]">
        <div className="flex flex-col gap-5 md:max-w-[526px]">
          <p className="eyebrow">{t('By the Numbers')}</p>
          <h2 className="h-section">
            <span className="text-bh-blue">{t('Real people')}</span> {t('creating real impact around the world')}
          </h2>
          <p className="text-lead">{t('The numbers behind a team that earns trust every day, from our customers and from each other.')}</p>
        </div>
        <div className="relative h-[266px] overflow-hidden rounded-[11px] text-white" style={{ backgroundImage: 'linear-gradient(241.8deg, #51bff2 0%, #407abf 49%, #2f598c 98%)' }}>
          <p className={`${stat} absolute left-[30px] top-[38px] text-[84px] tracking-[-0.84px]`}>{t('1 in')} <CountUp value={3} from={1} duration={1800} /></p>
          <div className="absolute bottom-[59px] left-[30px] flex flex-col gap-1.5 md:left-auto md:right-[150px]">
            <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.17px]">{t('Of our people')}</p>
            <p className="text-[13px] leading-[1.4] tracking-[-0.13px]">{t('have been with us for five years or more')}</p>
          </div>
        </div>
        <div className="grid gap-[30px] sm:grid-cols-3 md:col-span-2">
          <div className="relative h-[254px] overflow-hidden rounded-[11px] text-white" style={{ backgroundImage: 'linear-gradient(234.7deg, #196cdf 0%, #0e3b79 100%)' }}>
            <p className={`${stat} absolute left-7 top-[29px] text-[77px] tracking-[-0.77px]`}><CountUp value={1100} suffix="+" duration={2800} /></p>
            <div className="absolute bottom-[30px] right-[26px] flex w-[175px] flex-col gap-1.5">
              <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.17px] text-bh-light-100">{t('Employees')}</p>
              <p className="text-[13px] leading-[1.4] tracking-[-0.13px] text-bh-light-0">{t('working across 16 countries')}</p>
            </div>
          </div>
          <div className="relative h-[254px] overflow-hidden rounded-[11px] bg-bh-light-300">
            <p className={`${stat} absolute left-7 top-5 text-[77px] tracking-[-0.77px] text-bh-blue`}><CountUp value={5} suffix="M+" duration={2200} /></p>
            <div className="absolute bottom-[30px] right-[26px] flex flex-col gap-1.5">
              <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.17px] text-bh-blue-1100">{t('Customers')}</p>
              <p className="text-[13px] leading-[1.4] tracking-[-0.13px] text-bh-blue-1000">{t('who trust our brands worldwide')}</p>
            </div>
          </div>
          <div className="relative h-[254px] overflow-hidden rounded-[11px] bg-bh-light-100">
            <p className={`${stat} absolute left-7 top-5 text-[77px] tracking-[-0.77px] text-bh-blue`}><CountUp value={20} suffix="+" duration={2400} /></p>
            <div className="absolute bottom-[30px] right-7 flex flex-col gap-1.5">
              <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.17px] text-bh-blue-1100">{t('Years')}</p>
              <p className="text-[13px] leading-[1.4] tracking-[-0.13px] text-bh-blue-1000">{t('helping businesses succeed online')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
