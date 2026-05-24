'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Calendar, Check, CalendarCheck } from 'lucide-react'
import HaljinaGalerija from '@/components/haljine/HaljinaGalerija'
import BojeSelector from '@/components/haljine/BojeSelector'
import VelicineSelector from '@/components/haljine/VelicineSelector'
import VodicZaVelicineModal from '@/components/haljine/VodicZaVelicineModal'
import { cn } from '@/lib/utils'
import { useKorpa } from '@/store/korpa'
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

const KATEGORIJE_LABEL: Record<string, string> = {
  vjencana: 'Venčana',
  koktel: 'Koktel',
  svecana: 'Svečana',
  casual: 'Casual',
  maturska: 'Maturska',
}

export default function HaljinaDetalji({ haljina }: { haljina: Haljina }) {
  const [odabranaBoja, setOdabranaBoja] = useState(haljina.dostupne_boje?.[0]?.naziv || '')
  const [odabranaBojaHex, setOdabranaBojaHex] = useState(haljina.dostupne_boje?.[0]?.hex || '')
  const [odabranaVelicina, setOdabranaVelicina] = useState('')
  const [mjere, setMjere] = useState<Mjere | null>(null)
  const [dodano, setDodano] = useState(false)
  const [vodicOpen, setVodicOpen] = useState(false)

  const dodajArtikl = useKorpa((s) => s.dodajArtikl)

  const isRasprodato = haljina.kolicina_na_lageru === 0

  const cijena = haljina.na_popustu
    ? haljina.cijena_rsd * (1 - haljina.popust_procenat / 100)
    : haljina.cijena_rsd

  const handleDodajUKorpu = () => {
    if (!odabranaVelicina || isRasprodato) return
    dodajArtikl({
      haljina_id: haljina.id,
      slug: haljina.slug,
      naziv: haljina.naziv_sr,
      slika: haljina.slike?.[0] || '',
      boja: odabranaBoja,
      boja_hex: odabranaBojaHex,
      velicina: odabranaVelicina,
      mjere: mjere ?? undefined,
      cijena_rsd: cijena,
    })
    setDodano(true)
    setTimeout(() => setDodano(false), 2000)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4 pb-28 lg:py-10 lg:pb-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-20">
          {/* Gallery */}
          <HaljinaGalerija slike={haljina.slike || []} naziv={haljina.naziv_sr} />

          {/* Info — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">

            {/* Category + badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {haljina.kategorija && (
                <span
                  className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {KATEGORIJE_LABEL[haljina.kategorija] || haljina.kategorija}
                </span>
              )}
              {isRasprodato && (
                <span
                  className="inline-flex items-center gap-1.5 border border-[#e8e0d8] text-[8px] tracking-[0.3em] uppercase px-2.5 py-1 text-[#8a8a8a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8a8a8a]/40 shrink-0" />
                  Rasprodato
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
                className={cn('text-2xl font-light', isRasprodato ? 'text-[#8a8a8a]' : 'text-[#1a1a1a]')}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {formatRSD(cijena)}
              </span>
              {haljina.na_popustu && (
                <span className="text-base line-through text-[#8a8a8a]/60" style={{ fontFamily: 'var(--font-sans)' }}>
                  {formatRSD(haljina.cijena_rsd)}
                </span>
              )}
              <span className="text-sm text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
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

            {/* Color + Size selectors — disabled when rasprodato */}
            <div className={cn('transition-opacity duration-200', isRasprodato && 'opacity-40 pointer-events-none')}>
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
              <div className="mb-8">
                <VelicineSelector
                  velicine={haljina.dostupne_velicine || []}
                  odabrana={odabranaVelicina}
                  mjere={mjere}
                  onChange={setOdabranaVelicina}
                  onMjereChange={setMjere}
                  onVodicOpen={() => setVodicOpen(true)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              {isRasprodato ? (
                <div
                  className="flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase bg-[#f0ebe5] text-[#8a8a8a] border border-[#e8e0d8] select-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Trenutno nije dostupno
                </div>
              ) : (
                <button
                  onClick={handleDodajUKorpu}
                  disabled={!odabranaVelicina}
                  className={cn(
                    'flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase transition-all duration-300 cursor-pointer',
                    odabranaVelicina
                      ? dodano
                        ? 'bg-[#c9a96e] text-[#1a1a1a] border border-[#c9a96e]'
                        : 'bg-[#1a1a1a] text-[#faf7f4] border border-[#1a1a1a] hover:bg-[#c9a96e] hover:text-[#1a1a1a] hover:border-[#c9a96e]'
                      : 'bg-[#e8e0d8] text-[#8a8a8a] border border-[#e8e0d8] cursor-not-allowed'
                  )}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {dodano ? <Check size={14} strokeWidth={2} /> : <ShoppingBag size={14} strokeWidth={1.5} />}
                  {dodano ? 'Dodano u korpu!' : 'Dodaj u korpu'}
                </button>
              )}

              <Link
                href={`/rezervacija?haljina=${haljina.id}&boja=${encodeURIComponent(odabranaBoja)}&velicina=${encodeURIComponent(odabranaVelicina)}`}
                className="hidden lg:flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Calendar size={14} strokeWidth={1.5} />
                {isRasprodato ? 'Rezerviši za narednu dostavu' : 'Rezerviši odmah'}
              </Link>
            </div>

            {/* Stock warning */}
            {!isRasprodato && haljina.kolicina_na_lageru <= 3 && haljina.kolicina_na_lageru > 0 && (
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

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-[#faf7f4]/95 backdrop-blur-sm border-t border-[#e8e0d8] px-5 py-3.5 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p
            className="text-[8px] tracking-[0.2em] uppercase text-[#8a8a8a] truncate"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {haljina.naziv_sr}
          </p>
          <p
            className={cn('text-[15px] font-light mt-0.5', isRasprodato ? 'text-[#8a8a8a]' : 'text-[#1a1a1a]')}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {isRasprodato ? 'Rasprodato' : formatRSD(cijena)}
          </p>
        </div>
        {isRasprodato ? (
          <Link
            href={`/rezervacija?haljina=${haljina.id}`}
            className="shrink-0 px-5 py-3 text-[9px] tracking-[0.2em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Rezerviši
          </Link>
        ) : (
          <>
            {/* Calendar shortcut — replaces hidden "Rezerviši odmah" on mobile */}
            <Link
              href={`/rezervacija?haljina=${haljina.id}&boja=${encodeURIComponent(odabranaBoja)}&velicina=${encodeURIComponent(odabranaVelicina)}`}
              className="shrink-0 w-11 h-11 flex items-center justify-center border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
              title="Rezerviši odmah"
            >
              <CalendarCheck size={15} strokeWidth={1.5} />
            </Link>
            <button
              onClick={handleDodajUKorpu}
              disabled={!odabranaVelicina}
              className={cn(
                'shrink-0 px-5 py-3 text-[9px] tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer',
                odabranaVelicina
                  ? dodano
                    ? 'bg-[#c9a96e] text-[#1a1a1a]'
                    : 'bg-[#1a1a1a] text-[#faf7f4] hover:bg-[#c9a96e] hover:text-[#1a1a1a]'
                  : 'bg-[#e8e0d8] text-[#8a8a8a] cursor-not-allowed'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {dodano ? 'Dodano!' : 'U korpu'}
            </button>
          </>
        )}
      </div>

      {/* Size guide modal */}
      <VodicZaVelicineModal open={vodicOpen} onClose={() => setVodicOpen(false)} />
    </>
  )
}
