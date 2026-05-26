import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import RezervacijeTableClient, { type RezervacijaSaInventarom } from './RezervacijeTableClient'

export const metadata: Metadata = { title: 'Rezervacije' }

const STATUSI = [
  { key: 'sve', label: 'Sve' },
  { key: 'na_cekanju', label: 'Na čekanju' },
  { key: 'potvrdjena', label: 'Potvrđene' },
  { key: 'otkazana', label: 'Otkazane' },
  { key: 'realizovana', label: 'Realizovane' },
]

export default async function AdminRezervacijePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeStatus = status && status !== 'sve' ? status : null

  const supabase = await createClient()

  const countQuery = supabase
    .from('rezervacije')
    .select('status')

  let dataQuery = supabase
    .from('rezervacije')
    .select('id, ime, prezime, email, telefon, status, created_at, datum_termina, inventar:inventar(sifra, boja_naziv, velicina, haljina:haljine(naziv_sr))')
    .order('created_at', { ascending: false })

  if (activeStatus) {
    dataQuery = dataQuery.eq('status', activeStatus)
  }

  const [{ data: sviStatusi }, { data: rezervacije }] = await Promise.all([
    countQuery,
    dataQuery,
  ])

  const brojevi = (sviStatusi ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    acc['sve'] = (acc['sve'] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Upravljanje
        </p>
        <h1 className="text-[24px] sm:text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Rezervacije
        </h1>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {STATUSI.map(({ key, label }) => {
          const count = brojevi[key] ?? 0
          const isActive = status === key || (!status && key === 'sve')
          return (
            <Link
              key={key}
              href={`/admin/rezervacije?status=${key}`}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200',
                isActive
                  ? 'bg-[#1a1a1a] text-white'
                  : 'border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-white'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full leading-none',
                    isActive ? 'bg-white/20 text-white' : 'bg-[#e8e0d8] text-[#8a8a8a]'
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <RezervacijeTableClient rezervacije={(rezervacije as unknown as RezervacijaSaInventarom[]) ?? []} />
    </div>
  )
}
