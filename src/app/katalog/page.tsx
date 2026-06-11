import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import KatalogClient from '@/components/haljine/KatalogClient'
import type { Haljina } from '@/types'

export const metadata: Metadata = {
  title: 'Katalog',
  description: 'Pregledajte našu ekskluzivnu kolekciju elegantnih haljina — venčane, koktel, svečane i maturske.',
}

interface SearchParams {
  kategorija?: string
  sort?: string
  q?: string
  boje?: string
  velicine?: string
}

const KATEGORIJE_NAZIVI: Record<string, string> = {
  vjencana: 'Venčane haljine',
  koktel: 'Koktel haljine',
  svecana: 'Svečane haljine',
  casual: 'Casual haljine',
  maturska: 'Maturske haljine',
}

const KATEGORIJE_OPISI: Record<string, string> = {
  vjencana: 'Elegantne venčane haljine za vaš najvažniji dan',
  koktel: 'Sofisticirane koktel haljine za svečane prilike',
  svecana: 'Luksuzne svečane haljine za posebne trenutke',
  casual: 'Elegantne casual haljine za svakodnevni šarm',
  maturska: 'Glamurozne maturske haljine za nezaboravnu noć',
}

const KATEGORIJE_SLIKE: Record<string, string> = {
  vjencana: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85&fit=crop&auto=format',
  koktel:   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85&fit=crop&auto=format',
  svecana:  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=85&fit=crop&auto=format',
  casual:   'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85&fit=crop&auto=format',
  maturska: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1920&q=85&fit=crop&auto=format',
}
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1774976626858-75cf588233f0?w=1920&q=85&fit=crop&auto=format'

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('haljine')
    .select('id, slug, naziv_sr, naziv_en, opis_sr, slike, video_url, featured, created_at, redoslijed, kategorija_id, kategorija:kategorije(id, slug, naziv_sr, naziv_en, redosled), inventar(id, sifra, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, slike, dostupna, arhivirana)')
    .eq('arhivirana', false)

  if (params.q) {
    query = query.ilike('naziv_sr', `%${params.q}%`)
  }

  if (params.kategorija) {
    const { data: kat } = await supabase
      .from('kategorije')
      .select('id')
      .eq('slug', params.kategorija)
      .single()
    if (kat) query = query.eq('kategorija_id', kat.id)
  }

  switch (params.sort) {
    case 'najstarije':
      query = query.order('created_at', { ascending: true })
      break
    default:
      query = query.order('redoslijed', { ascending: true }).order('created_at', { ascending: false })
  }

  const { data } = await query
  let haljine = (data as unknown as Haljina[]) || []

  // Client-side sort by price (min inventar price)
  if (params.sort === 'cijena_rastuce') {
    haljine = [...haljine].sort((a, b) => {
      const minA = Math.min(...(a.inventar?.filter(i => i.dostupna).map(i => i.cijena_rsd) ?? [Infinity]))
      const minB = Math.min(...(b.inventar?.filter(i => i.dostupna).map(i => i.cijena_rsd) ?? [Infinity]))
      return minA - minB
    })
  } else if (params.sort === 'cijena_opadajuce') {
    haljine = [...haljine].sort((a, b) => {
      const minA = Math.min(...(a.inventar?.filter(i => i.dostupna).map(i => i.cijena_rsd) ?? [0]))
      const minB = Math.min(...(b.inventar?.filter(i => i.dostupna).map(i => i.cijena_rsd) ?? [0]))
      return minB - minA
    })
  }

  const naslov = params.kategorija
    ? (KATEGORIJE_NAZIVI[params.kategorija] ?? 'Kolekcija haljina')
    : 'Kolekcija haljina'
  const opis = params.kategorija ? (KATEGORIJE_OPISI[params.kategorija] ?? null) : null
  const bannerSlika = params.kategorija
    ? (KATEGORIJE_SLIKE[params.kategorija] ?? DEFAULT_BANNER)
    : DEFAULT_BANNER

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      <div className="relative h-[220px] lg:h-[320px] overflow-hidden bg-[#1a1a1a]">
        <Image src={bannerSlika} alt={naslov} fill priority sizes="100vw" className="object-cover object-center animate-ken-burns" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-6 lg:px-10 py-5 lg:py-7">
          <nav>
            <ol className="flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>
              <li><Link href="/" className="hover:text-white/70 transition-colors duration-200">Početna</Link></li>
              <li>/</li>
              <li>
                <Link href="/katalog" className={params.kategorija ? 'hover:text-white/70 transition-colors duration-200' : 'text-white/70'}>
                  Kolekcija
                </Link>
              </li>
              {params.kategorija && (
                <>
                  <li>/</li>
                  <li className="text-white/70">{KATEGORIJE_NAZIVI[params.kategorija]}</li>
                </>
              )}
            </ol>
          </nav>

          <div className="text-center pb-2">
            <p className="text-[9px] tracking-[0.6em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Kolekcija 2026
            </p>
            <h1 className="text-[clamp(38px,7vw,80px)] font-light text-white leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              {naslov}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="block w-10 h-px bg-[#c9a96e]/60" />
              <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]/60" />
              <span className="block w-10 h-px bg-[#c9a96e]/60" />
            </div>
            {opis && (
              <p className="text-[11px] tracking-wide text-white/50 mt-3 hidden lg:block" style={{ fontFamily: 'var(--font-sans)' }}>
                {opis}
              </p>
            )}
          </div>
        </div>
      </div>

      <KatalogClient haljine={haljine} activeParams={params} />
    </main>
  )
}
