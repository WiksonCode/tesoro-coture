'use client'

import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface MjesecData { month: string; count: number }
interface HaljinaData { naziv: string; rezervacije: number }
interface ZaradaData { month: string; zarada: number }
interface StatusData { naziv: string; vrednost: number; boja: string }

interface Props {
  mjeseciData: MjesecData[]
  topHaljine: HaljinaData[]
  zaradaData: ZaradaData[]
  statusData: StatusData[]
}

const RezTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] text-white px-3 py-2 text-[11px]" style={{ fontFamily: 'var(--font-sans)' }}>
      <p className="text-[#c9a96e] text-[9px] tracking-widest mb-0.5">{label}</p>
      <p>{payload[0]?.value} rezervacija</p>
    </div>
  )
}

const ZaradaTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="bg-[#1a1a1a] text-white px-3 py-2 text-[11px]" style={{ fontFamily: 'var(--font-sans)' }}>
      <p className="text-[#c9a96e] text-[9px] tracking-widest mb-0.5">{label}</p>
      <p>{new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 }).format(value)} RSD</p>
    </div>
  )
}

function formatZaradaTick(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return String(value)
}

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8e0d8] p-6">
      <div className="mb-4">
        <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          {eyebrow}
        </p>
        <h2 className="text-[18px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          {title}
        </h2>
      </div>
      {/* Thin divider — extends full card width */}
      <div className="h-px bg-[#e8e0d8] -mx-6 mb-6" />
      {children}
    </div>
  )
}

export default function StatistikaGrafikoni({ mjeseciData, topHaljine, zaradaData, statusData }: Props) {
  return (
    <div className="space-y-6">
      {/* Area chart — rezervacije po mesecima */}
      <ChartCard eyebrow="Trend" title="Rezervacije po mesecima">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={mjeseciData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<RezTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#c9a96e"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={{ fill: '#c9a96e', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#c9a96e' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Area chart — zarada po mesecima */}
      <ChartCard eyebrow="Prihodi" title="Zarada po mesecima (RSD)">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={zaradaData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="zaradaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatZaradaTick}
              tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ZaradaTooltip />} />
            <Area
              type="monotone"
              dataKey="zarada"
              stroke="#c9a96e"
              strokeWidth={2}
              fill="url(#zaradaGradient)"
              dot={{ fill: '#c9a96e', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#c9a96e' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bottom row — Top 5 + Status distribucija */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart — top 5 haljina */}
        <ChartCard eyebrow="Popularnost" title="Top 5 haljina">
          {topHaljine.length === 0 ? (
            <p className="text-[12px] text-[#8a8a8a] py-8 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
              Nema dovoljno podataka
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topHaljine} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" horizontal vertical={false} />
                <XAxis
                  dataKey="naziv"
                  tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#8a8a8a', fontFamily: 'var(--font-sans)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<RezTooltip />} />
                <Bar dataKey="rezervacije" fill="#c9a96e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Pie chart — status distribucija */}
        <ChartCard eyebrow="Pregled" title="Distribucija po statusu">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="vrednost"
                  nameKey="naziv"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  strokeWidth={0}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.naziv} fill={entry.boja} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0]?.payload as StatusData
                    return (
                      <div className="bg-[#1a1a1a] text-white px-3 py-2 text-[11px]" style={{ fontFamily: 'var(--font-sans)' }}>
                        <p className="text-[#c9a96e] text-[9px] tracking-widest mb-0.5">{d.naziv}</p>
                        <p>{d.vrednost} rezervacija</p>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legenda */}
            <div className="flex flex-col gap-3 flex-1">
              {statusData.map((s) => (
                <div key={s.naziv} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.boja }} />
                  <div className="flex-1 flex justify-between items-baseline">
                    <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {s.naziv}
                    </span>
                    <span className="text-[13px] font-light text-[#1a1a1a] tabular-nums" style={{ fontFamily: 'var(--font-serif)' }}>
                      {s.vrednost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
