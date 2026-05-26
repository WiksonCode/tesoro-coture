import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Rezervacija } from '@/types'
import StatusSelector from './StatusSelector'

export const metadata: Metadata = { title: 'Detalji rezervacije' }

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
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'long', year: 'numeric' })
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#f0ebe5] last:border-0">
      <span className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] shrink-0 w-36" style={{ fontFamily: 'var(--font-sans)' }}>
        {label}
      </span>
      <span className="text-[12px] text-[#1a1a1a] text-right" style={{ fontFamily: 'var(--font-sans)' }}>
        {value}
      </span>
    </div>
  )
}

type RezervacijaDetalji = Rezervacija & {
  inventar: {
    sifra: string
    boja_naziv: string
    boja_hex: string
    velicina: string
    cijena_rsd: number
    haljina: { naziv_sr: string; slike: string[] } | null
  } | null
}

export default async function RezervacijaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rezervacija } = await supabase
    .from('rezervacije')
    .select('*, inventar:inventar(sifra, boja_naziv, boja_hex, velicina, cijena_rsd, haljina:haljine(naziv_sr, slike))')
    .eq('id', id)
    .single()

  if (!rezervacija) notFound()

  const r = rezervacija as unknown as RezervacijaDetalji

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/rezervacije"
          className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors mb-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={11} />
          Sve rezervacije
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
              Rezervacija
            </p>
            <h1 className="text-[24px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              {r.ime} {r.prezime}
            </h1>
          </div>
          <span
            className={cn('mt-1 px-3 py-1.5 text-[8px] tracking-[0.25em] uppercase shrink-0', STATUS_STYLE[r.status] ?? 'bg-gray-50 text-gray-600')}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {STATUS_LABEL[r.status] ?? r.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-6">
        <div className="space-y-4">
          {r.inventar && (
            <div className="bg-white border border-[#e8e0d8] p-5 flex gap-4">
              <div className="w-16 h-20 shrink-0 bg-[#f0ebe5] overflow-hidden">
                {r.inventar.haljina?.slike?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.inventar.haljina.slike[0]} alt={r.inventar.haljina.naziv_sr} className="w-full h-full object-cover object-top" />
                ) : null}
              </div>
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  Haljina
                </p>
                <p className="text-[16px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {r.inventar.haljina?.naziv_sr ?? '—'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-[#e8e0d8] shrink-0"
                    style={{ backgroundColor: r.inventar.boja_hex }}
                  />
                  <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {r.inventar.boja_naziv} · {r.inventar.velicina} · {r.inventar.sifra}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#e8e0d8] p-5">
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
              Podaci o klijentu
            </h2>
            <Row label="Ime i prezime" value={`${r.ime} ${r.prezime}`} />
            <Row label="Email" value={r.email} />
            <Row label="Telefon" value={r.telefon} />
            <Row label="Željeni termin" value={r.datum_termina ? formatDatum(r.datum_termina) : null} />
            <Row label="Napomena" value={r.napomena} />
            <Row label="Rezervisano" value={formatDatum(r.created_at)} />
          </div>
        </div>

        <div>
          <StatusSelector id={r.id} currentStatus={r.status} />
        </div>
      </div>
    </div>
  )
}
