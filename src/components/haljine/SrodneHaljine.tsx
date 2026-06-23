'use client'

import Link from 'next/link'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import { useJezik } from '@/store/jezik'
import { t } from '@/messages'
import type { Haljina, Kategorija } from '@/types'

interface Props {
  haljine: Haljina[]
  kategorija?: Kategorija
  istaKategorija?: boolean
}

export default function SrodneHaljine({ haljine, kategorija, istaKategorija = true }: Props) {
  const { jezik } = useJezik()
  const tr = t[jezik].srodne

  if (haljine.length === 0) return null

  const katNaziv = jezik === 'en'
    ? (kategorija?.naziv_en ?? kategorija?.naziv_sr ?? '')
    : (kategorija?.naziv_sr ?? '')

  const naslov = istaKategorija
    ? (katNaziv ? tr.naslovSlicne(katNaziv) : tr.naslovSlidneFallback)
    : tr.mozda

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 border-t border-[#e8e0d8]">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
            {istaKategorija ? tr.slicno : tr.preporucujemo}
          </p>
          <h2 className="text-[clamp(22px,3vw,32px)] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            {naslov}
          </h2>
        </div>
        {kategorija && (
          <Link
            href={`/katalog?kategorija=${kategorija.slug}`}
            className="hidden lg:block text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors border-b border-transparent hover:border-[#c9a96e] pb-0.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {tr.pogledajSve}
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {haljine.map((haljina) => (
          <HaljinaCard key={haljina.id} haljina={haljina} />
        ))}
      </div>
    </section>
  )
}
