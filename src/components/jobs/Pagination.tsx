import { useT } from '../../i18n/I18n'

/** "Prev 1 2 3 4 … 11 12 Next" pager. */
export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  const t = useT()
  if (totalPages <= 1) return null
  const pages: (number | '…')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p <= 4 || p > totalPages - 2 || Math.abs(p - page) <= 1) pages.push(p)
    else if (pages[pages.length - 1] !== '…') pages.push('…')
  }
  return (
    <nav aria-label={t('Pagination')} className="flex flex-wrap items-center justify-center gap-x-[10px] gap-y-2 text-[15px] sm:gap-[14px]">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="text-[#4e5c6e] underline disabled:opacity-40">{t('Prev')}</button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} aria-hidden>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex size-[25px] items-center justify-center rounded-full ${p === page ? 'bg-bh-blue text-white' : 'hover:text-bh-blue'}`}
          >
            {p}
          </button>
        ),
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="text-bh-blue underline disabled:opacity-40">{t('Next')}</button>
    </nav>
  )
}
