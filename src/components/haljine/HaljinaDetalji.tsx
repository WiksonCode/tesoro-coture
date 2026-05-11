'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Calendar } from 'lucide-react'
import HaljinaGalerija from '@/components/haljine/HaljinaGalerija'
import BojeSelector from '@/components/haljine/BojeSelector'
import VelicineSelector from '@/components/haljine/VelicineSelector'
import { cn } from '@/lib/utils'
import type { Haljina, Mjere } from '@/types'

const KURS = 117

function formatRSD(cijena: number) {
  return new Intl.NumberFormat('sr-Latn-RS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cijena) + ' RSD'
}

function formatEUR(cijenaRSD: number) {
  return '≈ ' + Math.round(cijenaRSD / KURS) + ' €'
}

interface HaljinaDetaljiProps {
  haljina: Haljina
}

export default function HaljinaDetalji({ haljina }: HaljinaDetaljiProps) {
  const [odabranaBoja, setOdabranaBoja] = useState(
    haljina.dostupne_boje?.[0]?.naziv || ''
  )
  const [odabranaBojaHex, setOdabranaBojaHex] = useState(
    haljina.dostupne_boje?.[0]?.hex || ''
  )
  const [odabranaVelicina, setOdabranaVelicina] = useState('')
  const [mjere, setMjere] = useState<Mjere | null>(null)
  const [dodano, setDodano] = useState(false)

  const cijena = haljina.na_popustu
    ? haljina.cijena_rsd * (1 - haljina.popust_procenat / 100)
    : haljina.cijena_rsd

  const kategorijeLabelMap: Record<string, string> = {
    vjencana: 'Vjenčana',
    koktel: 'Koktel',
    svecana: 'Svečana',
    casual: 'Casual',
    maturska: 'Maturska',
  }

  const handleDodajUKorpu = () => {
    if (!odabranaVelicina) return
    // TODO: Faza 4 — connect to Zustand korpa store
    setDodano(true)
    setTimeout(() => setDodano(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={11} />
          Katalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <HaljinaGalerija slike={haljina.slike || []} naziv={haljina.naziv_sr} />

        {/* Info */}
        <div className="lg:pt-4">
          {/* Category + badges */}
          <div className="flex items-center gap-3 mb-4">
            {haljina.kategorija && (
              <span
                className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {kategorijeLabelMap[haljina.kategorija] || haljina.kategorija}
              </span>
            )}
            {haljina.na_popustu && haljina.popust_procenat > 0 && (
              <span
                className="bg-[#1a1a1a] text-[#c9a96e] text-[8px] tracking-[0.2em] uppercase px-2 py-0.5"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                -{haljina.popust_procenat}%
              </span>
            )}
            {haljina.dostupne_velicine?.includes('po_mjeri') && (
              <span
                className="border border-[#e8e0d8] text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Po mjeri
              </span>
            )}
          </div>

          {/* Name */}
          <h1
            className="text-[clamp(28px,3.5vw,44px)] font-light text-[#1a1a1a] leading-tight mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {haljina.naziv_sr}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-[#e8e0d8]">
            <span
              className="text-2xl font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatRSD(cijena)}
            </span>
            {haljina.na_popustu && (
              <span
                className="text-base line-through text-[#8a8a8a]/60"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {formatRSD(haljina.cijena_rsd)}
              </span>
            )}
            <span
              className="text-sm text-[#8a8a8a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatEUR(cijena)}
            </span>
          </div>

          {/* Description */}
          {haljina.opis_sr && (
            <p
              className="text-sm text-[#8a8a8a] leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {haljina.opis_sr}
            </p>
          )}

          {/* Color selector */}
          <div className="mb-7">
            <BojeSelector
              boje={haljina.dostupne_boje || []}
              odabrana={odabranaBoja}
              onChange={(naziv, hex) => {
                setOdabranaBoja(naziv)
                setOdabranaBojaHex(hex)
              }}
            />
          </div>

          {/* Size selector */}
          <div className="mb-8">
            <VelicineSelector
              velicine={haljina.dostupne_velicine || []}
              odabrana={odabranaVelicina}
              mjere={mjere}
              onChange={setOdabranaVelicina}
              onMjereChange={setMjere}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDodajUKorpu}
              disabled={!odabranaVelicina}
              className={cn(
                'flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase transition-all duration-300',
                odabranaVelicina
                  ? dodano
                    ? 'bg-[#c9a96e] text-[#1a1a1a] border border-[#c9a96e]'
                    : 'bg-[#1a1a1a] text-[#faf7f4] border border-[#1a1a1a] hover:bg-[#c9a96e] hover:text-[#1a1a1a] hover:border-[#c9a96e]'
                  : 'bg-[#e8e0d8] text-[#8a8a8a] border border-[#e8e0d8] cursor-not-allowed'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              {dodano ? 'Dodano u korpu!' : 'Dodaj u korpu'}
            </button>

            <Link
              href={`/rezervacija?haljina=${haljina.id}&boja=${encodeURIComponent(odabranaBoja)}&velicina=${encodeURIComponent(odabranaVelicina)}`}
              className="flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Calendar size={14} strokeWidth={1.5} />
              Rezerviši odmah
            </Link>
          </div>

          {/* Stock info */}
          {haljina.kolicina_na_lageru <= 3 && haljina.kolicina_na_lageru > 0 && (
            <p
              className="mt-4 text-[10px] tracking-wide text-[#c9a96e]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Samo {haljina.kolicina_na_lageru} {haljina.kolicina_na_lageru === 1 ? 'komad' : 'komada'} na lageru
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
