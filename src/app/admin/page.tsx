import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCijenaRSD } from '@/lib/utils'
import { CalendarCheck, Shirt, Users, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

const STATUS_LABELS: Record<string, { label: string; dot: string }> = {
  na_cekanju:  { label: 'Na čekanju',  dot: 'bg-[#c9a96e]' },
  potvrdjena:  { label: 'Potvrđena',   dot: 'bg-green-500' },
  otkazana:    { label: 'Otkazana',    dot: 'bg-red-500' },
  realizovana: { label: 'Realizovana', dot: 'bg-[#1a1a1a]' },
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    { count: totalRez },
    { count: rezOvajMjesec },
    { count: totalHaljina },
    { count: totalKorisnici },
    { data: rezPoStatusu },
    { data: recentRez },
  ] = await Promise.all([
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
    supabase.from('haljine').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('status'),
    supabase.from('rezervacije')
      .select('id, ime, prezime, status, created_at, haljina:haljine(naziv_sr, cijena_rsd)')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  const statusCounts = (rezPoStatusu ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  const stats = [
    { label: 'Rezervacije ovaj mj.', value: rezOvajMjesec ?? 0, icon: TrendingUp, color: 'text-[#c9a96e]', bg: 'bg-[#c9a96e]/10' },
    { label: 'Ukupno rezervacija', value: totalRez ?? 0, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Haljine u katalogu', value: totalHaljina ?? 0, icon: Shirt, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Registrovanih korisnika', value: totalKorisnici ?? 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Admin Panel
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#e8e0d8] p-5">
            <div className={cn('w-9 h-9 flex items-center justify-center mb-3', bg)}>
              <Icon size={17} strokeWidth={1.5} className={color} />
            </div>
            <p className="text-[26px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              {value}
            </p>
            <p className="text-[10px] text-[#8a8a8a] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        {/* Recent reservations */}
        <div className="bg-white border border-[#e8e0d8]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d8]">
            <h2 className="text-[13px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              Posljednje rezervacije
            </h2>
            <Link
              href="/admin/rezervacije"
              className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Sve <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-[#e8e0d8]">
            {(recentRez ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Clock size={24} strokeWidth={1} className="text-[#e8e0d8] mx-auto mb-2" />
                <p className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>Nema rezervacija</p>
              </div>
            ) : (
              (recentRez ?? []).map((r) => {
                const status = STATUS_LABELS[r.status] ?? { label: r.status, dot: 'bg-gray-400' }
                const haljina = r.haljina as unknown as { naziv_sr: string; cijena_rsd: number } | null
                return (
                  <Link
                    key={r.id}
                    href={`/admin/rezervacije/${r.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-[#faf7f4] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#1a1a1a] font-light" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.ime} {r.prezime}
                      </p>
                      <p className="text-[10px] text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                        {haljina?.naziv_sr ?? '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {formatDatum(r.created_at)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                        <span className="text-[9px] tracking-[0.15em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Status breakdown + Quick actions */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e8e0d8] p-5">
            <h2 className="text-[13px] font-light text-[#1a1a1a] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Po statusu
            </h2>
            <div className="space-y-2.5">
              {Object.entries(STATUS_LABELS).map(([key, { label, dot }]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', dot)} />
                    <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>{label}</span>
                  </div>
                  <span className="text-[13px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                    {statusCounts[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#e8e0d8] p-5">
            <h2 className="text-[13px] font-light text-[#1a1a1a] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Brze akcije
            </h2>
            <div className="space-y-2">
              <Link
                href="/admin/haljine/nova"
                className="flex items-center justify-between px-3 py-2.5 bg-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase text-white hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 group"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Dodaj haljinu
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/admin/rezervacije"
                className="flex items-center justify-between px-3 py-2.5 border border-[#e8e0d8] text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Upravljaj rezervacijama
                <ArrowRight size={11} />
              </Link>
              <Link
                href="/admin/statistika"
                className="flex items-center justify-between px-3 py-2.5 border border-[#e8e0d8] text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Statistika
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
