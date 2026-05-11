import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import KatalogClient from '@/components/haljine/KatalogClient'
import type { Haljina } from '@/types'

export const metadata: Metadata = {
  title: 'Katalog',
  description: 'Pregledajte našu ekskluzivnu kolekciju elegantnih haljina — vjenčane, koktel, svečane i maturske.',
}

interface SearchParams {
  kategorija?: string
  sort?: string
  naPopustu?: string
  maxCijena?: string
}

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('haljine').select('*').eq('dostupna', true)

  if (params.kategorija) {
    query = query.eq('kategorija', params.kategorija)
  }
  if (params.naPopustu === 'true') {
    query = query.eq('na_popustu', true)
  }
  if (params.maxCijena) {
    query = query.lte('cijena_rsd', Number(params.maxCijena))
  }

  switch (params.sort) {
    case 'cijena_rastuce':
      query = query.order('cijena_rsd', { ascending: true })
      break
    case 'cijena_opadajuce':
      query = query.order('cijena_rsd', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query
  const haljine = (data as Haljina[]) || []

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-20">
      {/* Page header */}
      <div className="border-b border-[#e8e0d8] bg-[#faf7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Kolekcija 2025
          </p>
          <h1
            className="text-[clamp(32px,5vw,56px)] font-light text-[#1a1a1a]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Katalog haljina
          </h1>
        </div>
      </div>

      <KatalogClient haljine={haljine} activeParams={params} />
    </main>
  )
}
