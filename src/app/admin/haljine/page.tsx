import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import type { Haljina } from '@/types'
import HaljineTableClient from './HaljineTableClient'

export const metadata: Metadata = { title: 'Haljine' }

export default async function AdminHaljinePage() {
  const supabase = await createClient()
  const { data: haljine } = await supabase
    .from('haljine')
    .select('id, slug, naziv_sr, featured, slike, created_at, kategorija:kategorije(id, slug, naziv_sr), inventar(id, sifra, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, slike, dostupna, arhivirana, rezervacije(status))')
    .eq('arhivirana', false)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Katalog
          </p>
          <h1 className="text-[24px] sm:text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Haljine
          </h1>
        </div>
        <Link
          href="/admin/haljine/nova"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-3 sm:px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <Plus size={13} strokeWidth={1.5} />
          <span className="hidden sm:inline">Nova haljina</span>
          <span className="sm:hidden">Nova</span>
        </Link>
      </div>

      <HaljineTableClient haljine={(haljine as unknown as Haljina[]) ?? []} />
    </div>
  )
}
