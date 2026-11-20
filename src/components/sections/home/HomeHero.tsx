import eyebrowIcon from '../../../assets/img/common/eyebrow-icon.png'
import { RotatingWord } from '../../ui/RotatingWord'
import { JobSearchBar } from '../JobSearchBar'
import { LogoStrip } from '../LogoStrip'
import { HeroCube } from './HeroCube'
import { useI18n } from '../../../i18n/I18n'

export function HomeHero() {
  const { lang, t } = useI18n()
  return (
    <>
      {/* The cube hero (review call): the globe video moved to Around the World only. */}
      <section className="relative h-[640px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#1f6fe0_0%,#0b3a8c_38%,#06204f_75%,#041637_100%)] md:h-[826px]">
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1.5px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_75%)]" />
        <h1 className="sr-only">{t('Careers at Bluehost')}</h1>
        <HeroCube />
      </section>
      <section className="bg-gradient-to-b from-[#e6f4ff] to-[#d4ebff] px-4 py-[59px]">
        <div className="mx-auto flex max-w-[1150px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className="flex items-center gap-px px-[11px] eyebrow">
              <img src={eyebrowIcon} alt="" className="h-[30px] w-12 -scale-y-100 rotate-180 object-contain" />
              {t('Find your next role')}
            </p>
            <h2 className="h-section">
              {t('A place where people can')} <RotatingWord key={lang} words={lang === 'pt' ? ['pertencer', 'construir', 'crescer', 'brilhar'] : undefined} />
            </h2>
          </div>
          <JobSearchBar />
        </div>
      </section>
      <LogoStrip />
    </>
  )
}
