'use client'

import { cn } from '@/lib/utils'

type Boja = { naziv: string; hex: string }

interface BojeSelectorProps {
  boje: Boja[]
  odabrana: string
  onChange: (boja: string, hex: string) => void
}

export default function BojeSelector({ boje, odabrana, onChange }: BojeSelectorProps) {
  if (!boje || boje.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Boja
        </p>
        {odabrana && (
          <p
            className="text-[10px] text-[#1a1a1a] tracking-wide"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {odabrana}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {boje.map((boja) => (
          <button
            key={boja.naziv}
            title={boja.naziv}
            onClick={() => onChange(boja.naziv, boja.hex)}
            className={cn(
              'w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer',
              odabrana === boja.naziv
                ? 'border-[#c9a96e] scale-110 shadow-sm'
                : 'border-transparent hover:border-[#8a8a8a] hover:scale-105'
            )}
            style={{ backgroundColor: boja.hex }}
          />
        ))}
      </div>
    </div>
  )
}
