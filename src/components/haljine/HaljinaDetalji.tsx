'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Calendar, Check, CalendarCheck, MessageCircle } from 'lucide-react'
import HaljinaGalerija from '@/components/haljine/HaljinaGalerija'
import BojeSelector from '@/components/haljine/BojeSelector'
import VelicineSelector from '@/components/haljine/VelicineSelector'
import VodicZaVelicineModal from '@/components/haljine/VodicZaVelicineModal'
import { cn } from '@/lib/utils'
import { useKorpa } from '@/store/korpa'
import type { Haljina } from '@/types'

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

const WHATSAPP_BROJ = process.env.NEXT_PUBLIC_WHATSAPP_BROJ ?? ''

export default function HaljinaDetalji({ haljina }: { haljina: Haljina }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const dostupniInventar = useMemo(
    () => haljina.inventar?.filter((i) => i.dostupna && !i.arhivirana) ?? [],
    [haljina.inventar]
  )

  const isRasprodato = dostupniInventar.length === 0

  const boje = useMemo(() => {
    const map = new Map<string, { naziv: string; hex: string }>()
    dostupniInventar.forEach((i) => {
      if (!map.has(i.boja_naziv)) map.set(i.boja_naziv, { naziv: i.boja_naziv, hex: i.boja_hex })
    })
    return Array.from(map.values())
  }, [dostupniInventar])

  const initialBoja = useMemo(() => {
    const param = searchParams.get('boja')
    return (param && boje.some((b) => b.naziv === param)) ? param : (boje[0]?.naziv || '')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [odabranaBoja, setOdabranaBoja] = useState(initialBoja)
  const [odabranaBojaHex, setOdabranaBojaHex] = useState(
    boje.find((b) => b.naziv === initialBoja)?.hex || boje[0]?.hex || ''
  )
  const [odabranaVelicina, setOdabranaVelicina] = useState(searchParams.get('velicina') ?? '')
  const [dodano, setDodano] = useState(false)
  const [vodicOpen, setVodicOpen] = useState(false)

  function updateUrl(boja: string, velicina: string) {
    const params = new URLSearchParams()
    if (boja) params.set('boja', boja)
    if (velicina) params.set('velicina', velicina)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function handleBojaChange(naziv: string, hex: string) {
    setOdabranaBoja(naziv)
    setOdabranaBojaHex(hex)
    setOdabranaVelicina('')
    updateUrl(naziv, '')
  }

  function handleVelicinaChange(velicina: string) {
    setOdabranaVelicina(velicina)
    updateUrl(odabranaBoja, velicina)
  }

  const velicineZaBoju = useMemo(() => {
    const filtered = odabranaBoja
      ? dostupniInventar.filter((i) => i.boja_naziv === odabranaBoja)
      : dostupniInventar
    const set = new Set(filtered.map((i) => i.velicina))
    return (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'] as const).filter((v) => set.has(v))
  }, [dostupniInventar, odabranaBoja])

  const odabraniInventar = useMemo(
    () => dostupniInventar.find(
      (i) => i.boja_naziv === odabranaBoja && i.velicina === odabranaVelicina
    ) ?? dostupniInventar.find((i) => i.boja_naziv === odabranaBoja),
    [dostupniInventar, odabranaBoja, odabranaVelicina]
  )

  const cijena = odabraniInventar?.cijena_rsd
    ?? (dostupniInventar[0]?.cijena_rsd ?? 0)

  const dostupnostInfo = useMemo(() => {
    if (isRasprodato) return null
    const filtered = dostupniInventar.filter(
      (i) =>
        (!odabranaBoja || i.boja_naziv === odabranaBoja) &&
        (!odabranaVelicina || i.velicina === odabranaVelicina)
    )
    const n = filtered.length
    if (n === 0 && (odabranaBoja || odabranaVelicina)) return { tip: 'nedostupno' as const, tekst: 'Odabrana kombinacija nije dostupna' }
    if (n === 1) return { tip: 'zadnji' as const, tekst: 'Poslednji dostupan primerak' }
    return { tip: 'dostupno' as const, tekst: 'Dostupno' }
  }, [dostupniInventar, odabranaBoja, odabranaVelicina, isRasprodato])

  const whatsappUrl = useMemo(() => {
    if (!WHATSAPP_BROJ) return null
    const tekst = encodeURIComponent(`Pozdrav, zanima me haljina "${haljina.naziv_sr}"${odabranaBoja ? `, boja ${odabranaBoja}` : ''}${odabranaVelicina ? `, veličina ${odabranaVelicina}` : ''}.`)
    return `https://wa.me/${WHATSAPP_BROJ.replace(/\D/g, '')}?text=${tekst}`
  }, [haljina.naziv_sr, odabranaBoja, odabranaVelicina])

  const galerija = useMemo(() => {
    const glavne = haljina.slike || []
    if (!odabranaBoja) return glavne
    const bojaSlike = dostupniInventar
      .filter((i) => i.boja_naziv === odabranaBoja)
      .flatMap((i) => i.slike ?? [])
    if (bojaSlike.length === 0) return glavne
    // Kombinuj slike stavke + glavne slike haljine (bez duplikata)
    const kombinovane = [...bojaSlike, ...glavne.filter((s) => !bojaSlike.includes(s))]
    return kombinovane
  }, [odabranaBoja, dostupniInventar, haljina.slike])

  const dodajArtikl = useKorpa((s) => s.dodajArtikl)

  const handleDodajUKorpu = () => {
    if (!odabranaVelicina || isRasprodato) return
    const inventarItem = dostupniInventar.find(
      (i) => i.boja_naziv === odabranaBoja && i.velicina === odabranaVelicina
    ) ?? dostupniInventar.find((i) => i.boja_naziv === odabranaBoja)
    if (!inventarItem) return

    dodajArtikl({
      inventar_id: inventarItem.id,
      haljina_id: haljina.id,
      slug: haljina.slug,
      naziv: haljina.naziv_sr,
      slika: galerija[0] || haljina.slike?.[0] || '',
      boja_naziv: inventarItem.boja_naziv,
      boja_hex: inventarItem.boja_hex,
      velicina: odabranaVelicina as import('@/types').Velicina,
      cijena_rsd: inventarItem.cijena_rsd,
      cijena_eur: inventarItem.cijena_eur,
    })
    setDodano(true)
    setTimeout(() => setDodano(false), 2000)
  }

  const kategorijaNaziv = haljina.kategorija?.naziv_sr ?? ''

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4 pb-28 lg:py-10 lg:pb-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 lg:gap-16">
          <HaljinaGalerija slike={galerija} naziv={haljina.naziv_sr} videoUrl={haljina.video_url} />

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {kategorijaNaziv && (
                <span
                  className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {kategorijaNaziv}
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

            <h1
              className="text-[clamp(28px,3.5vw,44px)] font-light text-[#1a1a1a] leading-tight mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {haljina.naziv_sr}
            </h1>

            <div className="flex items-baseline gap-4 mb-3 pb-4 border-b border-[#e8e0d8]">
              {cijena > 0 && (
                <>
                  <span
                    className={cn('text-2xl font-light', isRasprodato ? 'text-[#8a8a8a]' : 'text-[#1a1a1a]')}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {formatRSD(cijena)}
                  </span>
                  <span className="text-sm text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {formatEUR(cijena)}
                  </span>
                </>
              )}
              {dostupnostInfo && (
                <span
                  className={cn(
                    'ml-auto flex items-center gap-1.5 text-[10px] tracking-[0.15em]',
                    dostupnostInfo.tip === 'dostupno' && 'text-green-600',
                    dostupnostInfo.tip === 'zadnji' && 'text-amber-600',
                    dostupnostInfo.tip === 'nedostupno' && 'text-[#8a8a8a]',
                  )}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    dostupnostInfo.tip === 'dostupno' && 'bg-green-500',
                    dostupnostInfo.tip === 'zadnji' && 'bg-amber-500 animate-pulse',
                    dostupnostInfo.tip === 'nedostupno' && 'bg-[#d0ccc8]',
                  )} />
                  {dostupnostInfo.tekst}
                </span>
              )}
            </div>

            {haljina.opis_sr && (
              <p className="text-sm text-[#8a8a8a] leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                {haljina.opis_sr}
              </p>
            )}

            <div className={cn('transition-opacity duration-200', isRasprodato && 'opacity-40 pointer-events-none')}>
              {boje.length > 0 && (
                <div className="mb-7">
                  <BojeSelector
                    boje={boje}
                    odabrana={odabranaBoja}
                    onChange={handleBojaChange}
                  />
                </div>
              )}
              <div className="mb-8">
                <VelicineSelector
                  velicine={velicineZaBoju as unknown as string[]}
                  odabrana={odabranaVelicina}
                  onChange={handleVelicinaChange}
                  onVodicOpen={() => setVodicOpen(true)}
                />
              </div>
            </div>

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
                href={`/rezervacija?inventar=${odabraniInventar?.id ?? ''}`}
                className="hidden lg:flex items-center justify-center gap-3 py-4 px-8 text-[10px] tracking-[0.35em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Calendar size={14} strokeWidth={1.5} />
                {isRasprodato ? 'Rezerviši za narednu dostavu' : 'Rezerviši odmah'}
              </Link>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center justify-center gap-2.5 py-3.5 px-8 text-[10px] tracking-[0.3em] uppercase border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#25D366] hover:text-[#25D366] transition-all duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <MessageCircle size={13} strokeWidth={1.5} />
                  Pitajte nas
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-[#faf7f4]/95 backdrop-blur-sm border-t border-[#e8e0d8] px-5 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
            {odabranaBoja || haljina.naziv_sr}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className={cn('text-[15px] font-light', isRasprodato ? 'text-[#8a8a8a]' : 'text-[#1a1a1a]')} style={{ fontFamily: 'var(--font-sans)' }}>
              {isRasprodato ? 'Rasprodato' : cijena > 0 ? formatRSD(cijena) : ''}
            </p>
            {dostupnostInfo && dostupnostInfo.tip !== 'dostupno' && (
              <span className={cn(
                'text-[9px] flex items-center gap-1',
                dostupnostInfo.tip === 'zadnji' ? 'text-amber-600' : 'text-[#8a8a8a]'
              )} style={{ fontFamily: 'var(--font-sans)' }}>
                <span className={cn('w-1.5 h-1.5 rounded-full', dostupnostInfo.tip === 'zadnji' ? 'bg-amber-500' : 'bg-[#d0ccc8]')} />
                {dostupnostInfo.tip === 'zadnji' ? 'Poslednji' : 'Nedostupno'}
              </span>
            )}
          </div>
        </div>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-11 h-11 flex items-center justify-center border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
            title="Pitajte nas na WhatsApp-u"
          >
            <MessageCircle size={15} strokeWidth={1.5} />
          </a>
        )}
        {isRasprodato ? (
          <Link
            href="/rezervacija"
            className="shrink-0 px-5 py-3 text-[9px] tracking-[0.2em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Rezerviši
          </Link>
        ) : (
          <>
            <Link
              href={`/rezervacija?inventar=${odabraniInventar?.id ?? ''}`}
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

      <VodicZaVelicineModal open={vodicOpen} onClose={() => setVodicOpen(false)} />
    </>
  )
}
