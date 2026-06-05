'use client'

import { useState, useMemo } from 'react'
import { Search, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { StatusRezervacije } from '@/types'

export type RezervacijaSaInventarom = {
  id: string
  ime: string
  prezime: string
  email: string
  telefon: string
  status: StatusRezervacije
  created_at: string
  datum_termina: string | null
  vreme_termina: string | null
  inventar: {
    sifra: string
    boja_naziv: string
    velicina: string
    haljina: { naziv_sr: string } | null
  } | null
}

const STATUS_STYLE: Record<string, string> = {
  na_cekanju:  'bg-[#c9a96e]/15 text-[#8a6630]',
  potvrdjena:  'bg-green-50 text-green-700',
  otkazana:    'bg-red-50 text-red-600',
  realizovana: 'bg-[#1a1a1a]/8 text-[#1a1a1a]',
}

const STATUS_DOT: Record<string, string> = {
  na_cekanju:  'bg-[#c9a96e]',
  potvrdjena:  'bg-green-500',
  otkazana:    'bg-red-400',
  realizovana: 'bg-[#1a1a1a]',
}

const STATUS_LABEL: Record<StatusRezervacije, string> = {
  na_cekanju: 'Na čekanju',
  potvrdjena: 'Potvrđena',
  otkazana: 'Otkazana',
  realizovana: 'Realizovana',
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RezervacijeTableClient({ rezervacije }: { rezervacije: RezervacijaSaInventarom[] }) {
  const [q, setQ] = useState('')

  const filtrirane = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rezervacije
    return rezervacije.filter((r) =>
      `${r.ime} ${r.prezime}`.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.telefon?.includes(term)
    )
  }, [rezervacije, q])

  const emptyMsg = q ? `Nema rezultata za „${q}"` : 'Nema rezervacija'

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraži po imenu, emailu ili telefonu…"
          className="w-full pl-9 pr-9 py-2.5 text-[12px] border border-[#e8e0d8] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#8a8a8a]"
          style={{ fontFamily: 'var(--font-sans)' }}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden bg-white border border-[#e8e0d8] divide-y divide-[#e8e0d8]">
        {filtrirane.length === 0 ? (
          <p className="px-4 py-10 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {emptyMsg}
          </p>
        ) : (
          filtrirane.map((r) => (
            <Link
              key={r.id}
              href={`/admin/rezervacije/${r.id}`}
              className="flex items-center gap-3 px-4 py-4 hover:bg-[#faf7f4] transition-colors active:bg-[#f5f0ea]"
            >
              {/* Status dot */}
              <span className={cn('w-2 h-2 rounded-full shrink-0 mt-0.5', STATUS_DOT[r.status] ?? 'bg-[#8a8a8a]')} />

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] text-[#1a1a1a] font-light truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                    {r.ime} {r.prezime}
                  </p>
                  <span
                    className={cn('shrink-0 px-1.5 py-0.5 text-[9px] tracking-[0.15em] uppercase', STATUS_STYLE[r.status] ?? 'bg-gray-50 text-gray-600')}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                  {r.inventar?.haljina?.naziv_sr ?? '—'}
                  {r.inventar?.boja_naziv ? ` · ${r.inventar.boja_naziv} · ${r.inventar.velicina}` : ''}
                </p>
                <p className="text-[10px] text-[#b0a898] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  {formatDatum(r.created_at)}
                  {r.datum_termina ? ` · Termin: ${formatDatum(r.datum_termina)}${r.vreme_termina ? ' u ' + r.vreme_termina.slice(0, 5) : ''}` : ''}
                </p>
              </div>

              <ChevronRight size={14} strokeWidth={1.5} className="text-[#c8c0b8] shrink-0" />
            </Link>
          ))
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block bg-white border border-[#e8e0d8]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e0d8]">
                {['Klijent', 'Haljina', 'Boja / Veličina', 'Datum termina', 'Rezervisano', 'Status', ''].map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d8]">
              {filtrirane.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {emptyMsg}
                  </td>
                </tr>
              ) : (
                filtrirane.map((r) => (
                  <tr key={r.id} className="hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{r.ime} {r.prezime}</p>
                      <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>{r.telefon}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.inventar?.haljina?.naziv_sr ?? '—'}
                      </p>
                      {r.inventar?.sifra && (
                        <p className="text-[10px] text-[#8a8a8a] font-mono">{r.inventar.sifra}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.inventar?.boja_naziv ? `${r.inventar.boja_naziv} · ${r.inventar.velicina}` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.datum_termina ? formatDatum(r.datum_termina) + (r.vreme_termina ? ', ' + r.vreme_termina.slice(0, 5) : '') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {formatDatum(r.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn('px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase', STATUS_STYLE[r.status] ?? 'bg-gray-50 text-gray-600')}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/rezervacije/${r.id}`}
                        className="text-[11px] tracking-[0.15em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors border-b border-transparent hover:border-[#c9a96e]"
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

      {q && filtrirane.length > 0 && (
        <p className="mt-3 text-[10px] text-[#8a8a8a] tracking-wide" style={{ fontFamily: 'var(--font-sans)' }}>
          {filtrirane.length} {filtrirane.length === 1 ? 'rezultat' : 'rezultata'} za „{q}"
        </p>
      )}
    </div>
  )
}
