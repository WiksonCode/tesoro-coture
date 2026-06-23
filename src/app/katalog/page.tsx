import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import KatalogClient from '@/components/haljine/KatalogClient'
import KatalogHeader from '@/components/haljine/KatalogHeader'
import type { Haljina } from '@/types'

export const dynamic = 'force-dynamic'

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
  naPopustu?: string
}


export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('haljine')
    .select('id, slug, naziv_sr, naziv_en, opis_sr, slike, video_url, featured, created_at, redoslijed, kategorija_id, kategorija:kategorije(id, slug, naziv_sr, naziv_en, redosled), inventar(id, sifra, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, na_akciji, popust_procenat, cijena_akcija_rsd, cijena_akcija_eur, slike, dostupna, arhivirana)')
    .or('arhivirana.eq.false,arhivirana.is.null')

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

  if (params.naPopustu === 'true') {
    haljine = haljine.filter(h =>
      h.inventar?.some(i => i.na_akciji && i.dostupna && !i.arhivirana)
    )
  }

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

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <KatalogHeader kategorija={params.kategorija} />
      <KatalogClient haljine={haljine} activeParams={params} />
    </main>
  )
}
