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
      {/* The cube hero (review call; look and motion after Maria's "logo 2" reference video).
          The globe video stays on Around the World only. */}
      <section className="hero-columns relative h-[640px] overflow-hidden md:h-[826px]">
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
