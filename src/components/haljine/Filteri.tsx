'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { Boja } from '@/types'

const KATEGORIJE = [
  { value: 'vjencana', label: 'Vjenčane' },
  { value: 'koktel', label: 'Koktel' },
  { value: 'svecana', label: 'Svečane' },
  { value: 'casual', label: 'Casual' },
  { value: 'maturska', label: 'Maturske' },
]

const SORTIRANJA = [
  { value: '', label: 'Najnovije' },
  { value: 'cijena_rastuce', label: 'Cijena ↑' },
  { value: 'cijena_opadajuce', label: 'Cijena ↓' },
]

interface FilteriProps {
  activeParams: {
    kategorija?: string
    sort?: string
    naPopustu?: string
    maxCijena?: string
  }
  sveBoje: Boja[]
  sveVelicine: string[]
  selectedBoje: string[]
  selectedVelicine: string[]
  onBojeChange: (boje: string[]) => void
  onVelicineChange: (velicine: string[]) => void
}

export default function Filteri({
  activeParams,
  sveBoje,
  sveVelicine,
  selectedBoje,
  selectedVelicine,
  onBojeChange,
  onVelicineChange,
}: FilteriProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`/katalog?${params.toString()}`)
    },
    [router, searchParams]
  )

  const labelClass = 'text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-4 block'
  const sectionClass = 'mb-8'

  return (
    <div>
      <p
        className="text-[11px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-8 font-medium"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Filteri
      </p>

      {/* Kategorija */}
      <div className={sectionClass}>
        <span className={labelClass} style={{ fontFamily: 'var(--font-sans)' }}>
          Kategorija
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParam('kategorija', null)}
            className={cn(
              'px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-all duration-200',
              !activeParams.kategorija
                ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
            )}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Sve
          </button>
          {KATEGORIJE.map((k) => (
            <button
              key={k.value}
              onClick={() =>
                updateParam(
                  'kategorija',
                  activeParams.kategorija === k.value ? null : k.value
                )
              }
              className={cn(
                'px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase border transition-all duration-200',
                activeParams.kategorija === k.value
                  ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                  : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sortiranje */}
      <div className={sectionClass}>
        <span className={labelClass} style={{ fontFamily: 'var(--font-sans)' }}>
          Sortiranje
        </span>
        <div className="flex flex-col gap-2">
          {SORTIRANJA.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam('sort', s.value || null)}
              className={cn(
                'text-left text-[10px] tracking-wide transition-colors duration-200',
                (activeParams.sort || '') === s.value
                  ? 'text-[#c9a96e]'
                  : 'text-[#8a8a8a] hover:text-[#1a1a1a]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Na popustu */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <span className={labelClass} style={{ fontFamily: 'var(--font-sans)' }}>
            Na popustu
          </span>
          <Switch
            checked={activeParams.naPopustu === 'true'}
            onCheckedChange={(checked) =>
              updateParam('naPopustu', checked ? 'true' : null)
            }
          />
        </div>
      </div>

      {/* Boje */}
      {sveBoje.length > 0 && (
        <div className={sectionClass}>
          <span className={labelClass} style={{ fontFamily: 'var(--font-sans)' }}>
            Boja
          </span>
          <div className="flex flex-wrap gap-2">
            {sveBoje.map((boja) => (
              <button
                key={boja.naziv}
                onClick={() => {
                  const next = selectedBoje.includes(boja.naziv)
                    ? selectedBoje.filter((b) => b !== boja.naziv)
                    : [...selectedBoje, boja.naziv]
                  onBojeChange(next)
                }}
                title={boja.naziv}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all duration-200',
                  selectedBoje.includes(boja.naziv)
                    ? 'border-[#c9a96e] scale-110'
                    : 'border-transparent hover:border-[#8a8a8a]'
                )}
                style={{ backgroundColor: boja.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Veličine */}
      {sveVelicine.length > 0 && (
        <div className={sectionClass}>
          <span className={labelClass} style={{ fontFamily: 'var(--font-sans)' }}>
            Veličina
          </span>
          <div className="flex flex-wrap gap-2">
            {sveVelicine.map((v) => (
              <button
                key={v}
                onClick={() => {
                  const next = selectedVelicine.includes(v)
                    ? selectedVelicine.filter((x) => x !== v)
                    : [...selectedVelicine, v]
                  onVelicineChange(next)
                }}
                className={cn(
                  'px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border transition-all duration-200',
                  selectedVelicine.includes(v)
                    ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                    : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {v === 'po_mjeri' ? 'Po mjeri' : v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {(activeParams.kategorija ||
        activeParams.sort ||
        activeParams.naPopustu ||
        selectedBoje.length > 0 ||
        selectedVelicine.length > 0) && (
        <button
          onClick={() => {
            onBojeChange([])
            onVelicineChange([])
            router.push('/katalog')
          }}
          className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors underline underline-offset-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Resetuj filtere
        </button>
      )}
    </div>
  )
}
