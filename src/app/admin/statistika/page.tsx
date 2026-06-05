import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import StatistikaGrafikoni from '@/components/admin/StatistikaGrafikoni'

export const metadata: Metadata = { title: 'Statistika' }

const MONTH_NAMES: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'Maj', '06': 'Jun', '07': 'Jul', '08': 'Avg',
  '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Dec',
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-')
  return `${MONTH_NAMES[month] ?? month} ${year?.slice(2)}`
}

function formatRSD(amount: number) {
  return new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 }).format(amount) + ' RSD'
}

export default async function StatistikaPage() {
  const supabase = await createClient()

  const now = new Date()
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(now.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [
    { count: totalRez },
    { count: ovajMesec },
    { count: naChekanju },
    { count: potvrdjena },
    { count: otkazana },
    { count: realizovana },
    { data: sveRez },
    { data: topHaljineRaw },
    { data: zaradaRaw },
  ] = await Promise.all([
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'na_cekanju'),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'potvrdjena'),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'otkazana'),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'realizovana'),
    supabase.from('rezervacije')
      .select('created_at')
      .gte('created_at', twelveMonthsAgo.toISOString()),
    supabase.from('rezervacije')
      .select('inventar:inventar(haljina:haljine(naziv_sr))'),
    supabase.from('rezervacije')
      .select('created_at, inventar:inventar(cijena_rsd, cijena_eur)')
      .eq('status', 'realizovana'),
  ])

  const buckets: Record<string, number> = {}
  const zaradaBuckets: Record<string, number> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = 0
    zaradaBuckets[key] = 0
  }

  for (const r of sveRez ?? []) {
    const key = r.created_at.slice(0, 7)
    if (key in buckets) buckets[key]++
  }

  const mjeseciData = Object.entries(buckets).map(([month, count]) => ({
    month: formatMonth(month),
    count,
  }))

  let ukupnaZaradaRSD = 0
  for (const r of zaradaRaw ?? []) {
    const inv = r.inventar as unknown as { cijena_rsd: number } | null
    const cijena = inv?.cijena_rsd ?? 0
    ukupnaZaradaRSD += cijena
    const key = r.created_at.slice(0, 7)
    if (key in zaradaBuckets) zaradaBuckets[key] += cijena
  }

  const ovajMesecZaradaRSD = zaradaBuckets[currentMonthKey] ?? 0

  const zaradaData = Object.entries(zaradaBuckets).map(([month, zarada]) => ({
    month: formatMonth(month),
    zarada,
  }))

  const countMap: Record<string, number> = {}
  for (const r of topHaljineRaw ?? []) {
    const inv = r.inventar as unknown as { haljina: { naziv_sr: string } | null } | null
    const naziv = inv?.haljina?.naziv_sr
    if (naziv) countMap[naziv] = (countMap[naziv] || 0) + 1
  }
  const topHaljine = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([naziv, rezervacije]) => ({ naziv, rezervacije }))

  const totalInt = totalRez ?? 0
  const otkazaneInt = otkazana ?? 0
  const stopOtkazivanja = totalInt > 0 ? Math.round((otkazaneInt / totalInt) * 100) : 0

  const statusData = [
    { naziv: 'Na čekanju', vrednost: naChekanju ?? 0, boja: '#e8e0d8' },
    { naziv: 'Potvrdjene', vrednost: potvrdjena ?? 0, boja: '#c9a96e' },
    { naziv: 'Realizovane', vrednost: realizovana ?? 0, boja: '#1a1a1a' },
    { naziv: 'Otkazane', vrednost: otkazaneInt, boja: '#8a8a8a' },
  ]

  const statCards = [
    { label: 'Ukupno rezervacija', value: totalInt },
    { label: 'Ovaj mesec', value: ovajMesec ?? 0 },
    { label: 'Na čekanju', value: naChekanju ?? 0 },
    { label: 'Potvrdjene', value: potvrdjena ?? 0 },
    { label: 'Realizovane', value: realizovana ?? 0 },
    { label: 'Otkazane', value: otkazaneInt, sub: totalInt > 0 ? `${stopOtkazivanja}% od ukupnih` : undefined },
  ]

  return (
    <div className="p-6 lg:p-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Analitika
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Statistika
        </h1>
      </div>

      {/* Rezervacije kartice — stagger fade-up */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, sub }, index) => (
          <div
            key={label}
            className="bg-white border border-[#e8e0d8] p-5"
            style={{
              animationName: 'fade-up',
              animationDuration: '0.45s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'both',
              animationDelay: `${index * 70}ms`,
            }}
          >
            <p
              className="text-[32px] font-light text-[#1a1a1a] tabular-nums"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {value}
            </p>
            <p className="text-[10px] text-[#8a8a8a] mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              {label}
            </p>
            {sub && (
              <p className="text-[9px] text-[#c9a96e] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                {sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Section separator — Prihodi */}
      <div className="flex items-center gap-5 mb-6">
        <div className="flex-1 h-px bg-[#e8e0d8]" />
        <span
          className="text-[8px] tracking-[0.5em] uppercase text-[#c9a96e]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Prihodi
        </span>
        <div className="flex-1 h-px bg-[#e8e0d8]" />
      </div>

      {/* Zarada highlight kartice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div
          className="bg-[#1a1a1a] p-6 border-l-2 border-l-[#c9a96e]"
          style={{
            animationName: 'fade-up',
            animationDuration: '0.45s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'both',
            animationDelay: '420ms',
          }}
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
            Ukupna zarada
          </p>
          <p className="text-[30px] font-light text-white leading-none tabular-nums" style={{ fontFamily: 'var(--font-serif)' }}>
            {formatRSD(ukupnaZaradaRSD)}
          </p>
          <p className="text-[10px] text-[#8a8a8a] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
            od svih realizovanih rezervacija
          </p>
        </div>
        <div
          className="bg-[#1a1a1a] p-6 border-l-2 border-l-[#c9a96e]/40"
          style={{
            animationName: 'fade-up',
            animationDuration: '0.45s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'both',
            animationDelay: '490ms',
          }}
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
            Zarada ovaj mesec
          </p>
          <p className="text-[30px] font-light text-white leading-none tabular-nums" style={{ fontFamily: 'var(--font-serif)' }}>
            {formatRSD(ovajMesecZaradaRSD)}
          </p>
          <p className="text-[10px] text-[#8a8a8a] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
            od realizovanih rezervacija
          </p>
        </div>
      </div>

      <StatistikaGrafikoni
        mjeseciData={mjeseciData}
        topHaljine={topHaljine}
        zaradaData={zaradaData}
        statusData={statusData}
      />
    </div>
  )
}
