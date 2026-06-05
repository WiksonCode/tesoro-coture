import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import NovaRezervacijaForm from './NovaRezervacijaForm'

export const metadata: Metadata = { title: 'Nova rezervacija' }

export default async function NovaRezervacijaPage() {
  const supabase = await createClient()

  const { data: haljine } = await supabase
    .from('haljine')
    .select('id, naziv_sr, inventar(id, sifra, boja_naziv, boja_hex, velicina, dostupna, arhivirana)')
    .eq('arhivirana', false)
    .order('naziv_sr')

  const haljineSaInventarom = (haljine ?? []).map((h) => ({
    ...h,
    inventar: (h.inventar ?? []).filter((i: { arhivirana: boolean }) => !i.arhivirana),
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-3xl">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Rezervacije
        </p>
        <h1 className="text-[24px] sm:text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Nova rezervacija
        </h1>
      </div>

      <NovaRezervacijaForm haljine={haljineSaInventarom as Parameters<typeof NovaRezervacijaForm>[0]['haljine']} />
    </div>
  )
}
