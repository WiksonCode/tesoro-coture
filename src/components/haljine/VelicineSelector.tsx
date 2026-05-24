'use client'

import { useState } from 'react'
import { ChevronDown, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Mjere } from '@/types'

interface VelicineSelectorProps {
  velicine: string[]
  odabrana: string
  mjere: Mjere | null
  onChange: (velicina: string) => void
  onMjereChange: (mjere: Mjere | null) => void
  onVodicOpen?: () => void
}

export default function VelicineSelector({
  velicine,
  odabrana,
  mjere,
  onChange,
  onMjereChange,
  onVodicOpen,
}: VelicineSelectorProps) {
  const [mjereOpen, setMjereOpen] = useState(false)
  const poMjeri = odabrana === 'po_mjeri'

  if (!velicine || velicine.length === 0) return null

  const standardneVelicine = velicine.filter(v => v !== 'po_mjeri')
  const imaPoMjeri = velicine.includes('po_mjeri')

  const handleChange = (v: string) => {
    onChange(v)
    if (v === 'po_mjeri') {
      setMjereOpen(true)
    } else {
      setMjereOpen(false)
      onMjereChange(null)
    }
  }

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

      {/* Standard sizes */}
      {standardneVelicine.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {standardneVelicine.map((v) => (
            <button
              key={v}
              onClick={() => handleChange(v)}
              className={cn(
                'px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase border transition-all duration-200 cursor-pointer',
                odabrana === v
                  ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                  : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Po meri — full width, visually equal */}
      {imaPoMjeri && (
        <button
          onClick={() => handleChange('po_mjeri')}
          className={cn(
            'w-full mt-2 py-3 text-[11px] tracking-[0.2em] uppercase border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2',
            odabrana === 'po_mjeri'
              ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
              : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
          )}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <span>Po meri</span>
          <span
            className={cn(
              'text-[8px] tracking-[0.15em]',
              odabrana === 'po_mjeri' ? 'text-[#c9a96e]' : 'text-[#c9a96e]/70'
            )}
          >
            — unesite vaše mere
          </span>
        </button>
      )}

      {/* Mjere form — expands when "po_mjeri" is selected */}
      {poMjeri && (
        <div className="mt-3 border border-[#e8e0d8] p-5 bg-white">
          <button
            onClick={() => setMjereOpen(!mjereOpen)}
            className="flex items-center justify-between w-full mb-4 cursor-pointer"
          >
            <p
              className="text-[10px] tracking-[0.25em] uppercase text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Unesite vaše mere (cm)
            </p>
            <ChevronDown
              size={14}
              className={cn(
                'text-[#8a8a8a] transition-transform duration-200',
                mjereOpen ? 'rotate-180' : ''
              )}
            />
          </button>

          {mjereOpen && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'grudi', label: 'Grudi' },
                { key: 'struk', label: 'Struk' },
                { key: 'bokovi', label: 'Bokovi' },
                { key: 'visina', label: 'Visina' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label
                    className="block text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] mb-1.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={key === 'visina' ? 140 : 40}
                      max={key === 'visina' ? 220 : 200}
                      value={mjere?.[key as keyof Mjere] || ''}
                      onChange={(e) =>
                        onMjereChange({
                          ...(mjere || { grudi: 0, struk: 0, bokovi: 0, visina: 0 }),
                          [key]: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      className="w-full border border-[#e8e0d8] bg-[#faf7f4] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#c9a96e] pr-10"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[#8a8a8a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      cm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
