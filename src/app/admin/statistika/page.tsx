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

export default async function StatistikaPage() {
  const supabase = await createClient()

  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const [
    { count: totalRez },
    { count: ovajMjesec },
    { count: naChekanju },
    { count: realizovane },
    { data: sveRez },
    { data: topHaljineRaw },
  ] = await Promise.all([
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'na_cekanju'),
    supabase.from('rezervacije').select('*', { count: 'exact', head: true }).eq('status', 'realizovana'),
    supabase.from('rezervacije')
      .select('created_at')
      .gte('created_at', twelveMonthsAgo.toISOString()),
    supabase.from('rezervacije')
      .select('haljina:haljine(naziv_sr)')
      .not('haljina_id', 'is', null),
  ])

  // Build month buckets for the last 12 months
  const buckets: Record<string, number> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = 0
  }
  for (const r of sveRez ?? []) {
    const key = r.created_at.slice(0, 7)
    if (key in buckets) buckets[key]++
  }
  const mjeseciData = Object.entries(buckets).map(([month, count]) => ({
    month: formatMonth(month),
    count,
  }))

  // Top 5 dresses
  const countMap: Record<string, number> = {}
  for (const r of topHaljineRaw ?? []) {
    const naziv = (r.haljina as unknown as { naziv_sr: string } | null)?.naziv_sr
    if (naziv) countMap[naziv] = (countMap[naziv] || 0) + 1
  }
  const topHaljine = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([naziv, rezervacije]) => ({ naziv, rezervacije }))

  const cards = [
    { label: 'Ukupno rezervacija', value: totalRez ?? 0 },
    { label: 'Ovaj mjesec', value: ovajMjesec ?? 0 },
    { label: 'Na čekanju', value: naChekanju ?? 0 },
    { label: 'Realizovane', value: realizovane ?? 0 },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Analitika
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Statistika
        </h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value }) => (
          <div key={label} className="bg-white border border-[#e8e0d8] p-5">
            <p className="text-[32px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              {value}
            </p>
            <p className="text-[10px] text-[#8a8a8a] mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <StatistikaGrafikoni mjeseciData={mjeseciData} topHaljine={topHaljine} />
    </div>
  )
}
