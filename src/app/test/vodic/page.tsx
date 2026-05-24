'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Size data ────────────────────────────────────────────────────────────────

const SIZE_TABLE = [
  { size: 'XS',  grudi: [76, 80],  struk: [58, 62],  bokovi: [82, 86],   visina: [155, 165] },
  { size: 'S',   grudi: [80, 84],  struk: [62, 66],  bokovi: [86, 90],   visina: [158, 168] },
  { size: 'M',   grudi: [84, 88],  struk: [66, 70],  bokovi: [90, 94],   visina: [160, 170] },
  { size: 'L',   grudi: [88, 92],  struk: [70, 74],  bokovi: [94, 98],   visina: [162, 172] },
  { size: 'XL',  grudi: [92, 96],  struk: [74, 78],  bokovi: [98, 102],  visina: [163, 173] },
  { size: 'XXL', grudi: [96, 100], struk: [78, 82],  bokovi: [102, 106], visina: [164, 174] },
]

type MeasureKey = 'grudi' | 'struk' | 'bokovi' | 'visina'

const MEASURES: {
  key: MeasureKey
  label: string
  labelSr: string
  description: string
  how: string
  yPct: number
  icon: string
}[] = [
  {
    key: 'grudi',
    label: 'Grudi',
    labelSr: 'Obim grudi',
    description: 'Najširi dio prsa, mjeri se oko grudi.',
    how: 'Traka treba biti paralelna sa tlom i proći kroz najistaknutiji dio grudi. Ne pritiskajte.',
    yPct: 28,
    icon: 'G',
  },
  {
    key: 'struk',
    label: 'Struk',
    labelSr: 'Obim struka',
    description: 'Najuži dio stomaka, iznad pupka.',
    how: 'Stanite opušteno, ne uvlačite stomak. Traka horizontalna, bez stezanja.',
    yPct: 42,
    icon: 'S',
  },
  {
    key: 'bokovi',
    label: 'Bokovi',
    labelSr: 'Obim bokova',
    description: 'Najširi dio kukova i zadnjice.',
    how: 'Izmjerite oko najšireg dijela. Noge blizu jedna drugoj.',
    yPct: 56,
    icon: 'B',
  },
  {
    key: 'visina',
    label: 'Visina',
    labelSr: 'Tjelesna visina',
    description: 'Visina tijela bez obuće.',
    how: 'Stanite uz ravnu podlogu, gledajte naprijed, izmjerite od poda do tjemena.',
    yPct: 100,
    icon: 'V',
  },
]

// ── Size calculator ──────────────────────────────────────────────────────────

function calcSize(vals: { grudi: string; struk: string; bokovi: string; visina: string }) {
  const g = parseInt(vals.grudi)
  const s = parseInt(vals.struk)
  const b = parseInt(vals.bokovi)
  if (!g && !s && !b) return null
  let best: string | null = null
  let bestScore = Infinity
  for (const row of SIZE_TABLE) {
    let score = 0, count = 0
    const mid = (a: number[]) => (a[0] + a[1]) / 2
    if (g) { score += Math.abs(g - mid(row.grudi)); count++ }
    if (s) { score += Math.abs(s - mid(row.struk)); count++ }
    if (b) { score += Math.abs(b - mid(row.bokovi)); count++ }
    if (count > 0 && score / count < bestScore) { bestScore = score / count; best = row.size }
  }
  return best
}

// ── Body diagram (SVG) ───────────────────────────────────────────────────────

function BodyDiagram({ active, onSelect }: { active: MeasureKey | null; onSelect: (k: MeasureKey) => void }) {
  return (
    <div className="relative mx-auto" style={{ width: 160, height: 400 }}>

      {/* Body SVG */}
      <svg viewBox="0 0 80 200" fill="none" className="w-full h-full" aria-hidden="true">
        {/* Head */}
        <ellipse cx="40" cy="12" rx="11" ry="12" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5" />
        {/* Neck */}
        <path d="M35 23 L35 30 M45 23 L45 30" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4" />
        {/* Shoulders */}
        <path d="M35 29 Q24 28 12 38" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4" fill="none" />
        <path d="M45 29 Q56 28 68 38" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4" fill="none" />
        {/* Arms */}
        <path d="M12 38 L9 68" stroke="#c9a96e" strokeWidth="0.6" opacity="0.35" />
        <path d="M68 38 L71 68" stroke="#c9a96e" strokeWidth="0.6" opacity="0.35" />
        {/* Torso sides */}
        <path d="M20 38 Q18 54 19 66 Q21 76 23 84" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5" fill="none" />
        <path d="M60 38 Q62 54 61 66 Q59 76 57 84" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5" fill="none" />
        {/* Hips */}
        <path d="M23 84 Q12 91 11 104 L14 128" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5" fill="none" />
        <path d="M57 84 Q68 91 69 104 L66 128" stroke="#c9a96e" strokeWidth="0.6" opacity="0.5" fill="none" />
        {/* Crotch */}
        <path d="M14 128 Q40 134 66 128" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4" fill="none" />
        {/* Legs */}
        <path d="M14 128 L17 188 M37 128 L34 188 M43 128 L46 188 M66 128 L63 188" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4" />
      </svg>

      {/* Measurement lines + interactive dots */}
      {MEASURES.filter(m => m.key !== 'visina').map(m => {
        const isActive = active === m.key
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onSelect(m.key)}
            className="absolute left-0 right-0 cursor-pointer group"
            style={{ top: `${m.yPct}%`, transform: 'translateY(-50%)' }}
            aria-label={m.label}
          >
            {/* Horizontal measurement line */}
            <div className={cn(
              'w-full h-px transition-all duration-300',
              isActive
                ? 'bg-[#c9a96e]'
                : 'bg-[#c9a96e]/25 group-hover:bg-[#c9a96e]/50'
            )} />
            {/* Right-side dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-px">
              {/* Sonar ring */}
              {isActive && (
                <div className="absolute w-4 h-4 rounded-full border border-[#c9a96e] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-sonar" />
              )}
              {/* Solid dot */}
              <div className={cn(
                'w-2 h-2 rounded-full border transition-all duration-200',
                isActive
                  ? 'bg-[#c9a96e] border-[#c9a96e] scale-125'
                  : 'bg-transparent border-[#c9a96e]/50 group-hover:bg-[#c9a96e]/30'
              )} />
            </div>
            {/* Left-side dot */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-px">
              <div className={cn(
                'w-2 h-2 rounded-full border transition-all duration-200',
                isActive
                  ? 'bg-[#c9a96e] border-[#c9a96e] scale-125'
                  : 'bg-transparent border-[#c9a96e]/50 group-hover:bg-[#c9a96e]/30'
              )} />
            </div>
          </button>
        )
      })}

      {/* Height indicator (left edge) */}
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col items-center">
        <div className="flex-1 w-px bg-[#c9a96e]/20" />
        <div className="w-2 h-px bg-[#c9a96e]/40 -translate-x-0.5" />
      </div>

      {/* Scan beam */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-[2px] animate-scan-beam"
          style={{ background: 'linear-gradient(to right, transparent 0%, #c9a96e 40%, #c9a96e 60%, transparent 100%)', boxShadow: '0 0 8px #c9a96e88' }}
        />
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function TestVodicPage() {
  const [active, setActive] = useState<MeasureKey>('grudi')
  const [vals, setVals] = useState({ grudi: '', struk: '', bokovi: '', visina: '' })
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const activeMeasure = MEASURES.find(m => m.key === active)!

  useEffect(() => {
    const size = calcSize(vals)
    if (size !== result) {
      setShowResult(false)
      setTimeout(() => { setResult(size); setShowResult(true) }, 150)
    }
  }, [vals, result])

  return (
    <main className="min-h-screen bg-[#faf7f4]">

      {/* ══════════════════════════════════════════════════════
          HERO — dark scanner header
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#111111] pt-24 pb-16 relative overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Horizontal scan lines decoration */}
        {[15, 35, 55, 75].map(t => (
          <div key={t} className="absolute left-0 right-0 h-px bg-[#c9a96e]/5" style={{ top: `${t}%` }} />
        ))}

        <div className="relative max-w-[1400px] mx-auto px-8 lg:px-14">
          {/* Corner brackets */}
          <div className="absolute top-0 left-8 lg:left-14 w-8 h-8 border-t border-l border-[#c9a96e]/30" />
          <div className="absolute top-0 right-8 lg:right-14 w-8 h-8 border-t border-r border-[#c9a96e]/30" />

          <p className="text-[9px] tracking-[0.55em] uppercase text-[#c9a96e] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            TESORO Couture · Sistem veličina
          </p>
          <h1 className="text-[clamp(36px,6vw,80px)] font-light text-[#faf7f4] leading-[0.92] mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Vodič za<br />
            <span className="italic text-[#c9a96e]">veličine</span>
          </h1>
          <p className="text-[13px] text-[#faf7f4]/50 max-w-md leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            Pronađite svoju savršenu veličinu u 3 koraka. Izmjerite se, unesite mjere i dobijte preporuku.
          </p>

          {/* Bottom border */}
          <div className="mt-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#c9a96e]/20" />
            <span className="text-[8px] tracking-[0.5em] uppercase text-[#c9a96e]/40" style={{ fontFamily: 'var(--font-sans)' }}>
              v2025
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SCANNER — interactive body diagram
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14 py-16 lg:py-24">

          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/60 mb-12" style={{ fontFamily: 'var(--font-sans)' }}>
            01 · Interaktivni dijagram
          </p>

          <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0 items-center">

            {/* Left: body figure */}
            <div className="flex flex-col items-center justify-center py-8 lg:py-0 lg:pr-16">
              <BodyDiagram active={active} onSelect={setActive} />
              <p className="mt-8 text-[9px] tracking-[0.35em] uppercase text-[#faf7f4]/20 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
                Kliknite na liniju za detalje
              </p>
            </div>

            {/* Vertical divider */}
            <div className="hidden lg:block bg-[#c9a96e]/15" />

            {/* Right: measurement info */}
            <div className="lg:pl-16 py-8 lg:py-0">

              {/* Measure selector tabs */}
              <div className="flex gap-1 mb-10 flex-wrap">
                {MEASURES.map(m => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setActive(m.key)}
                    className={cn(
                      'px-4 py-2 text-[9px] tracking-[0.3em] uppercase transition-all duration-200 cursor-pointer border',
                      active === m.key
                        ? 'bg-[#c9a96e] text-[#111] border-[#c9a96e]'
                        : 'border-[#c9a96e]/20 text-[#faf7f4]/40 hover:border-[#c9a96e]/60 hover:text-[#faf7f4]/70'
                    )}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Active measure info */}
              <div key={active} className="animate-fade-up">
                {/* Index + label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 border border-[#c9a96e]/40 flex items-center justify-center shrink-0">
                    <span className="text-[13px] font-light text-[#c9a96e]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {activeMeasure.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/60 mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                      Mjera
                    </p>
                    <p className="text-xl font-light text-[#faf7f4]" style={{ fontFamily: 'var(--font-serif)' }}>
                      {activeMeasure.labelSr}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-[#faf7f4]/60 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                  {activeMeasure.description}
                </p>

                {/* How to measure */}
                <div className="border border-[#c9a96e]/15 p-5">
                  <p className="text-[8px] tracking-[0.45em] uppercase text-[#c9a96e] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    Kako izmjeriti
                  </p>
                  <p className="text-[12px] text-[#faf7f4]/50 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                    {activeMeasure.how}
                  </p>
                </div>

                {/* Size range for this measure */}
                <div className="mt-6 grid grid-cols-6 gap-1">
                  {SIZE_TABLE.map(row => (
                    <div key={row.size} className="text-center border border-[#c9a96e]/10 py-2 px-1">
                      <p className="text-[8px] tracking-wide text-[#c9a96e]/60 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                        {row.size}
                      </p>
                      <p className="text-[9px] text-[#faf7f4]/40 leading-tight" style={{ fontFamily: 'var(--font-sans)' }}>
                        {activeMeasure.key !== 'visina'
                          ? `${row[activeMeasure.key as 'grudi' | 'struk' | 'bokovi'][0]}–${row[activeMeasure.key as 'grudi' | 'struk' | 'bokovi'][1]}`
                          : `${row.visina[0]}–${row.visina[1]}`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW TO MEASURE — 4 steps, light section
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#faf7f4] py-20 lg:py-28 border-b border-[#e8e0d8]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">

          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-12" style={{ fontFamily: 'var(--font-sans)' }}>
            02 · Uputstvo
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {MEASURES.map((m, i) => (
              <div key={m.key} className="group">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative w-9 h-9 border border-[#e8e0d8] flex items-center justify-center shrink-0 group-hover:border-[#c9a96e] transition-colors duration-300">
                    <span className="text-[11px] font-light text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors duration-300" style={{ fontFamily: 'var(--font-sans)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-[#e8e0d8] group-hover:bg-[#c9a96e]/40 transition-colors duration-300" />
                </div>

                <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  {m.label}
                </p>
                <h3 className="text-lg font-light text-[#1a1a1a] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                  {m.labelSr}
                </h3>
                <p className="text-[12px] text-[#8a8a8a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  {m.how}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SIZE CALCULATOR — dark, interactive
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#111111] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">

          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/60 mb-12" style={{ fontFamily: 'var(--font-sans)' }}>
            03 · Kalkulator veličine
          </p>

          <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0">
            {/* Inputs */}
            <div className="lg:pr-16">
              <h2 className="text-[clamp(24px,3vw,40px)] font-light text-[#faf7f4] leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                Unesite vaše<br />
                <span className="italic text-[#c9a96e]">mjere</span>
              </h2>
              <p className="text-[12px] text-[#faf7f4]/40 mb-10 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                Unesite jednu ili više mjera u centimetrima. Preporuka se ažurira automatski.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {MEASURES.map(m => (
                  <div key={m.key}>
                    <label
                      htmlFor={`calc-${m.key}`}
                      className="block text-[8px] tracking-[0.45em] uppercase text-[#c9a96e]/70 mb-2"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {m.labelSr}
                    </label>
                    <div className="flex items-center border border-[#c9a96e]/20 bg-[#0d0d0d] focus-within:border-[#c9a96e]/60 transition-colors duration-200">
                      <input
                        id={`calc-${m.key}`}
                        type="number"
                        min={30}
                        max={200}
                        placeholder="—"
                        value={vals[m.key]}
                        onChange={e => setVals(prev => ({ ...prev, [m.key]: e.target.value }))}
                        className="flex-1 bg-transparent px-4 py-3 text-[14px] font-light text-[#faf7f4] placeholder-[#faf7f4]/15 outline-none w-0"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      />
                      <span className="pr-3 text-[9px] text-[#c9a96e]/40 shrink-0" style={{ fontFamily: 'var(--font-sans)' }}>
                        cm
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {Object.values(vals).some(v => v) && (
                <button
                  type="button"
                  onClick={() => setVals({ grudi: '', struk: '', bokovi: '', visina: '' })}
                  className="mt-5 text-[9px] tracking-[0.3em] uppercase text-[#faf7f4]/25 hover:text-[#faf7f4]/50 transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Poništi
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden lg:block bg-[#c9a96e]/10" />

            {/* Result */}
            <div className="lg:pl-16 flex flex-col justify-center py-12 lg:py-0">
              {/* Corner brackets decoration */}
              <div className="relative border border-[#c9a96e]/15 p-10 lg:p-12 flex flex-col items-center justify-center min-h-[280px]">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a96e]/40 -translate-x-px -translate-y-px" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#c9a96e]/40 translate-x-px -translate-y-px" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#c9a96e]/40 -translate-x-px translate-y-px" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a96e]/40 translate-x-px translate-y-px" />

                {result && showResult ? (
                  <div className="text-center animate-fade-up">
                    <p className="text-[8px] tracking-[0.55em] uppercase text-[#c9a96e]/60 mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                      Preporučena veličina
                    </p>
                    <div
                      className="text-[clamp(64px,10vw,100px)] font-light text-[#c9a96e] leading-none mb-4"
                      style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 40px rgba(201,169,110,0.3)' }}
                    >
                      {result}
                    </div>
                    <p className="text-[11px] text-[#faf7f4]/30 leading-relaxed max-w-[200px] mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
                      Pogledajte tabelu ispod za detaljan raspon mjera
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-[clamp(36px,6vw,64px)] font-light text-[#faf7f4]/10 leading-none mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                      —
                    </div>
                    <p className="text-[11px] text-[#faf7f4]/20 leading-relaxed max-w-[200px] mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
                      Unesite mjere da vidite preporuku
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-1">
                      <span className="text-[9px] text-[#faf7f4]/15 animate-blink" style={{ fontFamily: 'var(--font-sans)' }}>█</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SIZE REFERENCE TABLE
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#faf7f4] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">

          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            04 · Tabela veličina
          </p>
          <h2 className="text-[clamp(22px,3vw,38px)] font-light text-[#1a1a1a] mb-12" style={{ fontFamily: 'var(--font-serif)' }}>
            Referentne mjere
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#e8e0d8]">
                  <th className="text-left py-4 pr-8 text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] font-normal" style={{ fontFamily: 'var(--font-sans)' }}>
                    Veličina
                  </th>
                  {['Grudi (cm)', 'Struk (cm)', 'Bokovi (cm)', 'Visina (cm)'].map(col => (
                    <th key={col} className="text-left py-4 pr-6 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal" style={{ fontFamily: 'var(--font-sans)' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row, i) => (
                  <tr
                    key={row.size}
                    className={cn(
                      'border-b border-[#e8e0d8]/60 group cursor-default transition-colors duration-150 hover:bg-[#f0ebe5]',
                      result === row.size && 'bg-[#c9a96e]/8'
                    )}
                  >
                    <td className="py-5 pr-8">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'text-[18px] font-light transition-colors duration-200',
                            result === row.size ? 'text-[#c9a96e]' : 'text-[#1a1a1a]'
                          )}
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {row.size}
                        </span>
                        {result === row.size && (
                          <span className="text-[7px] tracking-[0.35em] uppercase text-[#c9a96e] border border-[#c9a96e] px-1.5 py-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                            vaša
                          </span>
                        )}
                      </div>
                    </td>
                    {[row.grudi, row.struk, row.bokovi, row.visina].map((range, j) => (
                      <td key={j} className="py-5 pr-6">
                        <span className="text-[13px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {range[0]} – {range[1]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[10px] text-[#8a8a8a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
            Sve mjere su u centimetrima. Ako ste između dvije veličine, preporučujemo veću. Za posebne zahtjeve, uvijek je dostupna opcija krojenja po mjeri.
          </p>

          {/* CTA */}
          <div className="mt-14 pt-10 border-t border-[#e8e0d8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[18px] font-light text-[#1a1a1a] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                Niste sigurni koja je vaša veličina?
              </p>
              <p className="text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                Posjetite nas — naši stilisti će vam pomoći.
              </p>
            </div>
            <Link
              href="/rezervacija"
              className="group inline-flex items-center gap-3 bg-[#1a1a1a] px-8 py-4 text-[9px] tracking-[0.35em] uppercase text-[#faf7f4] hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500 cursor-pointer shrink-0"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Zakaži termin
              <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
