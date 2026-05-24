'use client'

import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface MjesecData { month: string; count: number }
interface HaljinaData { naziv: string; rezervacije: number }

interface Props {
  mjeseciData: MjesecData[]
  topHaljine: HaljinaData[]
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] text-white px-3 py-2 text-[11px]" style={{ fontFamily: 'var(--font-sans)' }}>
      <p className="text-[#c9a96e] text-[9px] tracking-widest mb-0.5">{label}</p>
      <p>{payload[0]?.value} rezervacija</p>
    </div>
  )
}

export default function StatistikaGrafikoni({ mjeseciData, topHaljine }: Props) {
  return (
    <div className="space-y-6">
      {/* Area chart — monthly trend */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <div className="mb-5">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Trend
          </p>
          <h2 className="text-[18px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Rezervacije po mjesecima
          </h2>
        </div>
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
            <Tooltip content={<CustomTooltip />} />
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
      </div>

      {/* Bar chart — top dresses */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <div className="mb-5">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Popularnost
          </p>
          <h2 className="text-[18px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Top 5 haljina
          </h2>
        </div>
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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rezervacije" fill="#c9a96e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
