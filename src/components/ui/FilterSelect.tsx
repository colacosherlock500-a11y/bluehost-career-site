import { useEffect, useId, useRef, useState } from 'react'
import arrowBlue from '../../assets/img/common/arrow-blue.svg'

export interface Option {
  value: string
  label: string
  count?: number
}

interface FilterSelectProps {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  className?: string
}

/** Outline dropdown ("Location ▾", "Team ▾", "Work type ▾") used by the job search filters. */
export function FilterSelect({ label, value, options, onChange, className = '' }: FilterSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-center gap-1 rounded-[10px] border-[1.6px] border-bh-blue px-[14px] py-[11px] text-[15px] font-medium leading-[1.4] shadow-[0px_3.3px_6.6px_0px_rgba(0,0,0,0.1)] transition-colors ${selected ? 'bg-bh-blue text-white' : 'bg-white/60 text-bh-blue'}`}
      >
        <span className="w-[138px] truncate">{selected ? selected.label : label}</span>
        <img src={arrowBlue} alt="" className={`size-[19.76px] transition-transform ${open ? '-rotate-90' : 'rotate-90'} ${selected ? 'brightness-0 invert' : ''}`} />
      </button>
      {open && (
        <ul id={id} role="listbox" aria-label={label} className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-full min-w-[220px] overflow-y-auto rounded-[10px] border border-bh-light-200 bg-white py-1 shadow-[0_12px_30px_rgba(0,42,102,0.15)]">
          <li>
            <button type="button" role="option" aria-selected={!value} onClick={() => { onChange(''); setOpen(false) }} className="flex w-full px-4 py-2 text-left text-sm text-night-sky hover:bg-bh-light-0">
              Any {label.toLowerCase()}
            </button>
          </li>
          {options.map(o => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-bh-light-0 ${o.value === value ? 'font-semibold text-bh-blue' : 'text-bh-blue-1100'}`}
              >
                {o.label}
                {o.count !== undefined && <span className="text-xs text-night-sky">{o.count}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
