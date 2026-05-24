import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import type { Haljina } from '@/types'
import HaljineTableClient from './HaljineTableClient'

export const metadata: Metadata = { title: 'Haljine' }

const KATEGORIJA_LABELS: Record<string, string> = {
  vjencana: 'Vjenčana',
  koktel: 'Koktel',
  svecana: 'Svečana',
  casual: 'Casual',
  maturska: 'Maturska',
}

export default async function AdminHaljinePage() {
  const supabase = await createClient()
  const { data: haljine } = await supabase
    .from('haljine')
    .select('id, slug, naziv_sr, kategorija, cijena_rsd, na_popustu, popust_procenat, dostupna, featured, slike, kolicina_na_lageru')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Katalog
          </p>
          <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Haljine
          </h1>
        </div>
        <Link
          href="/admin/haljine/nova"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 text-[9px] tracking-[0.25em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <Plus size={13} strokeWidth={1.5} />
          Nova haljina
        </Link>
      </div>

      <HaljineTableClient
        haljine={(haljine as Haljina[]) ?? []}
        kategorijaLabels={KATEGORIJA_LABELS}
      />
    </div>
  )
}
