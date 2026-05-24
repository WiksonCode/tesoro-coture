import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import type { Rezervacija } from '@/types'

export const metadata: Metadata = { title: 'Rezervacije' }

const STATUSI = [
  { key: 'sve', label: 'Sve' },
  { key: 'na_cekanju', label: 'Na čekanju' },
  { key: 'potvrdjena', label: 'Potvrđene' },
  { key: 'otkazana', label: 'Otkazane' },
  { key: 'realizovana', label: 'Realizovane' },
]

const STATUS_STYLE: Record<string, string> = {
  na_cekanju:  'bg-[#c9a96e]/15 text-[#8a6630]',
  potvrdjena:  'bg-green-50 text-green-700',
  otkazana:    'bg-red-50 text-red-600',
  realizovana: 'bg-[#1a1a1a]/8 text-[#1a1a1a]',
}

const STATUS_LABEL: Record<string, string> = {
  na_cekanju: 'Na čekanju',
  potvrdjena: 'Potvrđena',
  otkazana: 'Otkazana',
  realizovana: 'Realizovana',
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function AdminRezervacijePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const activeStatus = status && status !== 'sve' ? status : null

  const supabase = await createClient()
  let query = supabase
    .from('rezervacije')
    .select('id, ime, prezime, email, telefon, status, created_at, datum_termina, odabrana_velicina, odabrana_boja, haljina:haljine(naziv_sr)')
    .order('created_at', { ascending: false })

  if (activeStatus) {
    query = query.eq('status', activeStatus)
  }

  const { data: rezervacije } = await query

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Upravljanje
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Rezervacije
        </h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STATUSI.map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/rezervacije?status=${key}`}
            className={cn(
              'px-4 py-2 text-[9px] tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200',
              (status === key || (!status && key === 'sve'))
                ? 'bg-[#1a1a1a] text-white'
                : 'border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-white'
            )}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e0d8]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e0d8]">
                {['Klijent', 'Haljina', 'Veličina', 'Datum termina', 'Rezervisano', 'Status', ''].map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-[8px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d8]">
              {(rezervacije ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    Nema rezervacija
                  </td>
                </tr>
              ) : (
                (rezervacije as unknown as (Rezervacija & { haljina: { naziv_sr: string } | null })[]).map((r) => (
                  <tr key={r.id} className="hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.ime} {r.prezime}
                      </p>
                      <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.telefon}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.haljina?.naziv_sr ?? '—'}
                      </p>
                      {r.odabrana_boja && (
                        <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {r.odabrana_boja}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.odabrana_velicina || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.datum_termina ? formatDatum(r.datum_termina) : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {formatDatum(r.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn('px-2.5 py-1 text-[8px] tracking-[0.2em] uppercase', STATUS_STYLE[r.status] ?? 'bg-gray-50 text-gray-600')}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/rezervacije/${r.id}`}
                        className="text-[9px] tracking-[0.15em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors border-b border-transparent hover:border-[#c9a96e]"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        Detalji
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
