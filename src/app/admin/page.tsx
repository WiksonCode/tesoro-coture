import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CalendarCheck, Shirt, Users, TrendingUp, ArrowRight, Clock, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

const STATUS_CONFIG: Record<string, { label: string; pill: string; bar: string }> = {
  na_cekanju:  { label: 'Na čekanju',  pill: 'bg-[#c9a96e]/12 text-[#a07830]',  bar: 'bg-[#c9a96e]' },
  potvrdjena:  { label: 'Potvrđena',   pill: 'bg-[#e8f0eb] text-[#3d6b4a]',     bar: 'bg-[#3d6b4a]' },
  realizovana: { label: 'Realizovana', pill: 'bg-[#1a1a1a]/6 text-[#1a1a1a]',   bar: 'bg-[#1a1a1a]' },
  otkazana:    { label: 'Otkazana',    pill: 'bg-red-50 text-red-600',           bar: 'bg-red-400' },
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getGreeting(date: Date) {
  const h = date.getHours()
  if (h < 12) return 'Dobro jutro'
  if (h < 18) return 'Dobar dan'
  return 'Dobro veče'
}

function formatDatumHeader(date: Date) {
  return date.toLocaleDateString('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const now = new Date()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profiles').select('ime').eq('id', user!.id).single()
  const firstName = profil?.ime || null

  const today = now.toISOString().slice(0, 10)
  const nextWeek = new Date(now)
  nextWeek.setDate(now.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().slice(0, 10)

  const [
    { count: totalRez },
    { count: rezOvajMjesec },
    { count: totalInventarDostupno },
    { count: totalInventarSve },
    { count: totalKorisnici },
    { data: rezPoStatusu },
    { data: recentRez },
    { data: predstojeci },
  ] = await Promise.all([
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
    supabase.from('inventar').select('*, haljine!inner(arhivirana)', { count: 'exact', head: true }).eq('dostupna', true).eq('arhivirana', false).eq('haljine.arhivirana', false),
    supabase.from('inventar').select('*, haljine!inner(arhivirana)', { count: 'exact', head: true }).eq('arhivirana', false).eq('haljine.arhivirana', false),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('status'),
    supabase.from('rezervacije')
      .select('id, ime, prezime, status, created_at, inventar:inventar(haljina:haljine(naziv_sr))')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('rezervacije')
      .select('id, ime, prezime, datum_termina, status, inventar:inventar(haljina:haljine(naziv_sr))')
      .gte('datum_termina', today)
      .lte('datum_termina', nextWeekStr)
      .in('status', ['na_cekanju', 'potvrdjena'])
      .order('datum_termina', { ascending: true })
      .limit(5),
  ])

  const statusCounts = (rezPoStatusu ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  const totalRezCount = totalRez ?? 0
  const pendingCount = statusCounts['na_cekanju'] ?? 0

  return (
    <div className="p-6 lg:p-10 w-full">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p
              className="text-[10px] tracking-[0.45em] uppercase text-[#c9a96e] mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Admin Panel
            </p>
            <h1
              className="text-[clamp(26px,3vw,36px)] font-light text-[#1a1a1a] leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {getGreeting(now)}{firstName ? `, ${firstName}` : ''}
            </h1>
          </div>
          <p
            className="text-[11px] text-[#8a8a8a] hidden sm:block pb-0.5 capitalize"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {formatDatumHeader(now)}
          </p>
        </div>
        {/* Decorative rule */}
        <div className="flex items-center gap-3">
          <span className="block h-px flex-1 bg-[#e8e0d8]" />
          <span className="block w-1 h-1 bg-[#c9a96e] rotate-45" />
          <span className="block w-16 h-px bg-[#c9a96e]/40" />
          <span className="block w-1 h-1 bg-[#c9a96e] rotate-45" />
          <span className="block h-px flex-1 bg-[#e8e0d8]" />
        </div>
      </div>

      {/* Featured stat — full width */}
      <div className="relative bg-[#1a1a1a] p-4 sm:p-7 mb-4 overflow-hidden">
        {/* Decorative background ornament */}
        <div className="absolute right-0 top-0 bottom-0 w-64 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="text-[160px] font-light" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
        </div>
        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#c9a96e]" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <TrendingUp size={12} strokeWidth={1.5} className="text-[#c9a96e]" />
              <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
                Ovaj mesec
              </p>
            </div>
            <p
              className="text-[clamp(52px,6vw,72px)] font-light leading-none text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {rezOvajMjesec ?? 0}
            </p>
            <p className="text-[11px] text-white/40 mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
              rezervacija primljeno
            </p>
          </div>

          {pendingCount > 0 && (
            <Link
              href="/admin/rezervacije?status=na_cekanju"
              className="flex flex-col items-center gap-2 px-6 py-4 border border-[#c9a96e]/30 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 transition-all duration-300 group"
            >
              <div className="relative">
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c9a96e] animate-pulse" />
                <CalendarCheck size={18} strokeWidth={1.5} className="text-[#c9a96e]" />
              </div>
              <p
                className="text-[clamp(20px,2.5vw,28px)] font-light text-white leading-none tabular-nums"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {pendingCount}
              </p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
                čeka potvrdu
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Secondary stats — 3 cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        {[
          { label: 'Ukupno rezervacija', labelShort: 'Rezervacije', value: totalRezCount, icon: CalendarCheck },
          { label: 'Dostupnih u inventaru', labelShort: 'Inventar', value: totalInventarDostupno ?? 0, total: totalInventarSve ?? 0, icon: Shirt },
          { label: 'Korisnici', labelShort: 'Korisnici', value: totalKorisnici ?? 0, icon: Users },
        ].map(({ label, labelShort, value, total, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#e8e0d8] p-3 sm:p-5 relative overflow-hidden">
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#e8e0d8] opacity-60" />
            <Icon size={12} strokeWidth={1.5} className="text-[#c8c0b8] mb-2 sm:mb-3" />
            <p
              className="text-[24px] sm:text-[34px] font-light leading-none text-[#1a1a1a] mb-1 tabular-nums"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {value}{total != null && total > 0 ? <span className="text-[16px] sm:text-[20px] text-[#c8c0b8]"> / {total}</span> : null}
            </p>
            <p className="text-[9px] sm:text-[10px] text-[#8a8a8a] leading-snug" style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="sm:hidden">{labelShort}</span>
              <span className="hidden sm:inline">{label}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">

        {/* Recent reservations */}
        <div className="bg-white border border-[#e8e0d8]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d8]">
            <div className="flex items-center gap-2.5">
              <h2
                className="text-[14px] font-light text-[#1a1a1a]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Poslednje rezervacije
              </h2>
              {pendingCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a96e]" />
                </span>
              )}
            </div>
            <Link
              href="/admin/rezervacije"
              className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Sve <ArrowRight size={10} />
            </Link>
          </div>

          <div className="divide-y divide-[#e8e0d8]">
            {(recentRez ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Clock size={24} strokeWidth={1} className="text-[#e8e0d8] mx-auto mb-2" />
                <p className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Nema rezervacija
                </p>
              </div>
            ) : (
              (recentRez ?? []).map((r) => {
                const cfg = STATUS_CONFIG[r.status] ?? { label: r.status, pill: 'bg-gray-100 text-gray-600', bar: 'bg-gray-400' }
                const inventar = r.inventar as unknown as { haljina: { naziv_sr: string } | null } | null
                const isPending = r.status === 'na_cekanju'
                return (
                  <Link
                    key={r.id}
                    href={`/admin/rezervacije/${r.id}`}
                    className={cn(
                      'flex items-center justify-between px-6 py-3.5 transition-colors',
                      isPending ? 'bg-[#fdf8f0] hover:bg-[#faf2e4]' : 'hover:bg-[#faf7f4]'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#1a1a1a] font-light" style={{ fontFamily: 'var(--font-sans)' }}>
                        {r.ime} {r.prezime}
                      </p>
                      <p className="text-[10px] text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                        {inventar?.haljina?.naziv_sr ?? '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-[10px] text-[#8a8a8a] hidden sm:block" style={{ fontFamily: 'var(--font-sans)' }}>
                        {formatDatum(r.created_at)}
                      </span>
                      <span
                        className={cn('px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase', cfg.pill)}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Status breakdown with progress bars */}
          <div className="bg-white border border-[#e8e0d8] p-5">
            <h2 className="text-[13px] font-light text-[#1a1a1a] mb-5" style={{ fontFamily: 'var(--font-serif)' }}>
              Po statusu
            </h2>
            <div className="space-y-4">
              {Object.entries(STATUS_CONFIG).map(([key, { label, bar }]) => {
                const count = statusCounts[key] ?? 0
                const pct = totalRezCount > 0 ? Math.round((count / totalRezCount) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {label}
                      </span>
                      <span className="text-[14px] font-light text-[#1a1a1a] tabular-nums" style={{ fontFamily: 'var(--font-serif)' }}>
                        {count}
                      </span>
                    </div>
                    <div className="h-[2px] bg-[#f0ebe5] w-full">
                      <div
                        className={cn('h-full transition-all duration-500', bar)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Predstojeći termini */}
          <div className="bg-white border border-[#e8e0d8] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={12} strokeWidth={1.5} className="text-[#c9a96e]" />
                <h2 className="text-[13px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Ove nedelje
                </h2>
              </div>
            </div>
            {(predstojeci ?? []).length === 0 ? (
              <p className="text-[11px] text-[#8a8a8a] py-4 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
                Nema termina u narednih 7 dana
              </p>
            ) : (
              <div className="space-y-0 divide-y divide-[#f0ebe5]">
                {(predstojeci ?? []).map((r) => {
                  const inv = r.inventar as unknown as { haljina: { naziv_sr: string } | null } | null
                  const datum = r.datum_termina ? new Date(r.datum_termina + 'T00:00:00') : null
                  const danLabel = datum?.toLocaleDateString('sr-Latn-RS', { weekday: 'short', day: 'numeric', month: 'short' }) ?? '—'
                  return (
                    <Link
                      key={r.id}
                      href={`/admin/rezervacije/${r.id}`}
                      className="flex items-center gap-3 py-2.5 hover:opacity-70 transition-opacity"
                    >
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: r.status === 'potvrdjena' ? '#3d6b4a' : '#c9a96e' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {r.ime} {r.prezime}
                        </p>
                        <p className="text-[10px] text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                          {inv?.haljina?.naziv_sr ?? '—'}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#8a8a8a] shrink-0 capitalize" style={{ fontFamily: 'var(--font-sans)' }}>
                        {danLabel}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
