'use client'

import { cn } from '@/lib/utils'
import { Ruler } from 'lucide-react'

const SVE_VELICINE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'] as const

interface VelicineSelectorProps {
  velicine: string[]
  odabrana: string
  onChange: (velicina: string) => void
  onVodicOpen?: () => void
}

export default function VelicineSelector({
  velicine,
  odabrana,
  onChange,
  onVodicOpen,
}: VelicineSelectorProps) {
  const dostupneSet = new Set(velicine)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Veličina
        </p>
        {onVodicOpen && (
          <button
            type="button"
            onClick={onVodicOpen}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-[#c9a96e] border-b border-[#c9a96e]/40 hover:border-[#c9a96e] pb-0.5 transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Ruler size={11} strokeWidth={1.5} />
            Vodič za veličine
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {SVE_VELICINE.map((v) => {
          const dostupna = dostupneSet.has(v)
          const odabrana_ = odabrana === v
          return (
            <button
              key={v}
              onClick={() => dostupna && onChange(v)}
              disabled={!dostupna}
              className={cn(
                'relative px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase border transition-all duration-200',
                odabrana_
                  ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                  : dostupna
                    ? 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] cursor-pointer'
                    : 'border-[#e8e0d8] text-[#d0ccc8] cursor-not-allowed overflow-hidden'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
              title={!dostupna ? 'Nije dostupno' : undefined}
            >
              {!dostupna && (
                <span
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden
                >
                  <span className="absolute w-[130%] h-px bg-[#d0ccc8] rotate-[-20deg]" />
                </span>
              )}
              {v === 'po_mjeri' ? 'Po meri' : v}
            </button>
          )
        })}
      </div>
    </div>
  )
}
