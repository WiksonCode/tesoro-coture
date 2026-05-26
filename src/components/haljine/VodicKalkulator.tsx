'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type MjeraKey = 'grudi' | 'struk' | 'bokovi'

const TABELA = [
  { velicina: 'XS',  grudi: [78, 82]  as [number,number], struk: [60, 64]  as [number,number], bokovi: [84, 88]   as [number,number], visina: '160–167' },
  { velicina: 'S',   grudi: [82, 86]  as [number,number], struk: [64, 68]  as [number,number], bokovi: [88, 92]   as [number,number], visina: '162–168' },
  { velicina: 'M',   grudi: [86, 90]  as [number,number], struk: [68, 72]  as [number,number], bokovi: [92, 96]   as [number,number], visina: '164–170' },
  { velicina: 'L',   grudi: [90, 96]  as [number,number], struk: [72, 78]  as [number,number], bokovi: [96, 102]  as [number,number], visina: '165–172' },
  { velicina: 'XL',  grudi: [96, 102] as [number,number], struk: [78, 84]  as [number,number], bokovi: [102, 108] as [number,number], visina: '166–174' },
  { velicina: 'XXL', grudi: [102, 110]as [number,number], struk: [84, 92]  as [number,number], bokovi: [108, 116] as [number,number], visina: '167–175' },
]

const MJERA_TIPS: Record<MjeraKey, string> = {
  grudi: 'Najširi deo grudi, metar horizontalno. Udahnite normalno.',
  struk: 'Najtanji deo trupa, 2–3 cm iznad pupka. Ne uvlačite stomak.',
  bokovi: 'Najširi deo bokova i zadnjice. Stopala zajedno.',
}

function getSizeFor(key: MjeraKey, val: number): string {
  for (const row of TABELA) {
    if (val >= row[key][0] && val <= row[key][1]) return row.velicina
  }
  return val < TABELA[0][key][0] ? 'XS' : 'XXL'
}

function nadjiPreporuku(
  grudi: string, struk: string, bokovi: string
): { velicina: string; napomena: string | null } | null {
  const g = parseFloat(grudi), s = parseFloat(struk), b = parseFloat(bokovi)
  if (isNaN(g) && isNaN(s) && isNaN(b)) return null

  const sizeMap: Partial<Record<MjeraKey, string>> = {}
  if (!isNaN(b)) sizeMap.bokovi = getSizeFor('bokovi', b)
  if (!isNaN(g)) sizeMap.grudi  = getSizeFor('grudi', g)
  if (!isNaN(s)) sizeMap.struk  = getSizeFor('struk', s)

  const sizes = Object.values(sizeMap)
  if (sizes.length === 0) return null

  const unique = [...new Set(sizes)]
  const recommended = sizeMap.bokovi ?? sizeMap.grudi ?? sizeMap.struk!

  return {
    velicina: recommended,
    napomena: unique.length > 1
      ? 'Mere ukazuju na različite veličine — preporučujemo opciju "Po meri" za savršen fit.'
      : null,
  }
}

// ─── SVG Figure ──────────────────────────────────────────────────────────────

function FiguraSVG({
  active,
  mjere,
}: {
  active: MjeraKey | null
  mjere: { grudi: string; struk: string; bokovi: string }
}) {
  const op = (key: MjeraKey) =>
    active === null ? 0.65 : active === key ? 1 : 0.22

  const GRUDI_Y = 111
  const STRUK_Y = 165
  const BOKOVI_Y = 201

  const valLabel = (key: MjeraKey) => {
    const v = parseFloat(mjere[key])
    return !isNaN(v) ? `${v} cm` : ''
  }

  return (
    <svg
      viewBox="0 0 320 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[300px] mx-auto"
      aria-hidden="true"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Subtle background grid */}
      <g opacity="0.18">
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 16} y1={0} x2={i * 16} y2={430} stroke="#c9a96e" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 27 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 16} x2={320} y2={i * 16} stroke="#c9a96e" strokeWidth="0.3" />
        ))}
      </g>

      {/* ── Head ── */}
      <ellipse cx="140" cy="34" rx="22" ry="26" fill="#f0ebe5" stroke="#c8bfb5" strokeWidth="1.3" />
      {/* Hair */}
      <path
        d="M 118 22 C 116 8 128 4 140 6 C 152 4 164 8 162 22 C 156 14 144 12 140 12 C 136 12 124 14 118 22 Z"
        fill="#c9a96e"
        opacity="0.18"
      />
      <path
        d="M 116 24 C 112 16 114 10 118 22"
        stroke="#c9a96e"
        strokeWidth="1.2"
        opacity="0.15"
        fill="none"
      />

      {/* ── Body silhouette ── */}
      <path
        d="
          M 118 58
          C 100 64 86 76 84 88
          C 80 98 76 108 74 120
          C 72 132 76 144 80 155
          C 82 161 84 165 84 170
          C 80 180 70 190 64 206
          C 60 218 62 230 66 242
          C 72 260 74 280 76 304
          C 78 322 76 342 76 358
          L 70 374
          L 90 374
          L 93 290
          C 96 272 102 260 110 252
          C 116 246 124 244 134 244
          C 138 244 140 244 140 244
          C 144 244 148 246 154 250
          C 162 258 168 270 172 288
          L 176 374
          L 196 374
          L 190 358
          C 190 342 188 322 190 304
          C 192 280 194 260 200 242
          C 204 230 206 218 202 206
          C 196 190 186 180 182 170
          C 182 165 184 161 186 155
          C 190 144 194 132 192 120
          C 190 108 186 98 182 88
          C 180 76 166 64 148 58
          L 148 72
          C 146 76 144 78 140 78
          C 136 78 134 76 132 72
          Z
        "
        fill="#f0ebe5"
        stroke="#c8bfb5"
        strokeWidth="1.4"
      />

      {/* Dress neckline suggestion */}
      <path d="M 132 72 C 136 78 140 80 140 80 C 140 80 144 78 148 72" stroke="#c8bfb5" strokeWidth="0.8" fill="none" opacity="0.5"/>

      {/* ── GRUDI band ── */}
      <motion.g
        animate={{ opacity: op('grudi') }}
        transition={{ duration: 0.3 }}
        style={{ filter: active === 'grudi' ? 'url(#glow)' : 'none' }}
      >
        <rect x="50" y={GRUDI_Y - 6} width="176" height="12" fill="#c9a96e" opacity="0.07" />
        <line x1="68" y1={GRUDI_Y - 6} x2="68" y2={GRUDI_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="68" y1={GRUDI_Y} x2="212" y2={GRUDI_Y} stroke="#c9a96e" strokeWidth="1.4" strokeDasharray="5 3" />
        <line x1="212" y1={GRUDI_Y - 6} x2="212" y2={GRUDI_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="68" cy={GRUDI_Y} r="4" fill="#c9a96e" />
        <circle cx="212" cy={GRUDI_Y} r="4" fill="#c9a96e" />
        <line x1="216" y1={GRUDI_Y} x2="236" y2={GRUDI_Y} stroke="#c9a96e" strokeWidth="1" opacity="0.55" />
        <circle cx="236" cy={GRUDI_Y} r="2" fill="#c9a96e" opacity="0.55" />
        <text x="243" y={GRUDI_Y - 5} fontFamily="DM Sans, sans-serif" fontSize="8" letterSpacing="2.5" fill="#c9a96e">
          GRUDI
        </text>
        {valLabel('grudi') && (
          <text x="243" y={GRUDI_Y + 8} fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a1a1a" opacity="0.75" fontWeight="500">
            {valLabel('grudi')}
          </text>
        )}
      </motion.g>

      {/* ── STRUK band ── */}
      <motion.g
        animate={{ opacity: op('struk') }}
        transition={{ duration: 0.3 }}
        style={{ filter: active === 'struk' ? 'url(#glow)' : 'none' }}
      >
        <rect x="62" y={STRUK_Y - 6} width="158" height="12" fill="#c9a96e" opacity="0.07" />
        <line x1="80" y1={STRUK_Y - 6} x2="80" y2={STRUK_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1={STRUK_Y} x2="200" y2={STRUK_Y} stroke="#c9a96e" strokeWidth="1.4" strokeDasharray="5 3" />
        <line x1="200" y1={STRUK_Y - 6} x2="200" y2={STRUK_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy={STRUK_Y} r="4" fill="#c9a96e" />
        <circle cx="200" cy={STRUK_Y} r="4" fill="#c9a96e" />
        <line x1="204" y1={STRUK_Y} x2="236" y2={STRUK_Y} stroke="#c9a96e" strokeWidth="1" opacity="0.55" />
        <circle cx="236" cy={STRUK_Y} r="2" fill="#c9a96e" opacity="0.55" />
        <text x="243" y={STRUK_Y - 5} fontFamily="DM Sans, sans-serif" fontSize="8" letterSpacing="2.5" fill="#c9a96e">
          STRUK
        </text>
        {valLabel('struk') && (
          <text x="243" y={STRUK_Y + 8} fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a1a1a" opacity="0.75" fontWeight="500">
            {valLabel('struk')}
          </text>
        )}
      </motion.g>

      {/* ── BOKOVI band ── */}
      <motion.g
        animate={{ opacity: op('bokovi') }}
        transition={{ duration: 0.3 }}
        style={{ filter: active === 'bokovi' ? 'url(#glow)' : 'none' }}
      >
        <rect x="46" y={BOKOVI_Y - 6} width="190" height="12" fill="#c9a96e" opacity="0.07" />
        <line x1="64" y1={BOKOVI_Y - 6} x2="64" y2={BOKOVI_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="64" y1={BOKOVI_Y} x2="218" y2={BOKOVI_Y} stroke="#c9a96e" strokeWidth="1.4" strokeDasharray="5 3" />
        <line x1="218" y1={BOKOVI_Y - 6} x2="218" y2={BOKOVI_Y + 6} stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="64" cy={BOKOVI_Y} r="4" fill="#c9a96e" />
        <circle cx="218" cy={BOKOVI_Y} r="4" fill="#c9a96e" />
        <line x1="222" y1={BOKOVI_Y} x2="236" y2={BOKOVI_Y} stroke="#c9a96e" strokeWidth="1" opacity="0.55" />
        <circle cx="236" cy={BOKOVI_Y} r="2" fill="#c9a96e" opacity="0.55" />
        <text x="243" y={BOKOVI_Y - 5} fontFamily="DM Sans, sans-serif" fontSize="8" letterSpacing="2.5" fill="#c9a96e">
          BOKOVI
        </text>
        {valLabel('bokovi') && (
          <text x="243" y={BOKOVI_Y + 8} fontFamily="DM Sans, sans-serif" fontSize="9" fill="#1a1a1a" opacity="0.75" fontWeight="500">
            {valLabel('bokovi')}
          </text>
        )}
      </motion.g>

      {/* ── Height indicator ── */}
      <g opacity="0.28">
        <line x1="28" y1="8" x2="28" y2="374" stroke="#8a8a8a" strokeWidth="0.9" />
        <path d="M 24 16 L 28 6 L 32 16" fill="none" stroke="#8a8a8a" strokeWidth="0.9" />
        <path d="M 24 366 L 28 376 L 32 366" fill="none" stroke="#8a8a8a" strokeWidth="0.9" />
        <line x1="22" y1="374" x2="34" y2="374" stroke="#8a8a8a" strokeWidth="0.9" />
        <line x1="22" y1="8" x2="34" y2="8" stroke="#8a8a8a" strokeWidth="0.9" />
        <text
          x="16"
          y="191"
          fontFamily="DM Sans, sans-serif"
          fontSize="7.5"
          letterSpacing="2.5"
          fill="#8a8a8a"
          textAnchor="middle"
          transform="rotate(-90, 16, 191)"
        >
          VISINA
        </text>
      </g>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VodicKalkulator() {
  const [mjere, setMjere] = useState({ grudi: '', struk: '', bokovi: '' })
  const [active, setActive] = useState<MjeraKey | null>(null)

  const preporuka = useMemo(
    () => nadjiPreporuku(mjere.grudi, mjere.struk, mjere.bokovi),
    [mjere]
  )

  const setMjera = (key: MjeraKey, val: string) =>
    setMjere((prev) => ({ ...prev, [key]: val }))

  const resetMjere = () => setMjere({ grudi: '', struk: '', bokovi: '' })

  const hasAny = Object.values(mjere).some((v) => v !== '')

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-14 lg:py-20">

      {/* ── Section header ── */}
      <div className="mb-12">
        <p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Interaktivni vodič
        </p>
        <h2
          className="text-[clamp(28px,4vw,42px)] font-light text-[#1a1a1a] leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Pronađite svoju veličinu
        </h2>
        <div className="w-10 h-px bg-[#c9a96e] mt-4" />
      </div>

      {/* ── Main grid: figure + calculator ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 mb-16 items-start">

        {/* Figure */}
        <div className="relative">
          <FiguraSVG active={active} mjere={mjere} />
          <p
            className="text-center text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]/50 mt-3"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Kliknite na polje mere da označite tačku merenja
          </p>
        </div>

        {/* Calculator */}
        <div className="flex flex-col gap-6">

          {/* Inputs */}
          {(['grudi', 'struk', 'bokovi'] as MjeraKey[]).map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <label
                className="block text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>

              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={mjere[key]}
                  onChange={(e) => setMjera(key, e.target.value)}
                  onFocus={() => setActive(key)}
                  onBlur={() => setActive(null)}
                  placeholder="0"
                  min={40}
                  max={180}
                  className="w-full border border-[#e8e0d8] bg-white px-5 py-4 text-[16px] font-light text-[#1a1a1a] outline-none focus:border-[#c9a96e] transition-colors duration-200 placeholder:text-[#d4ccc4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                />
                <span
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] text-[#a0988e]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  cm
                </span>
              </div>

              {/* Contextual tip */}
              <AnimatePresence>
                {active === key && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[11px] text-[#8a8a8a] leading-relaxed mt-2 overflow-hidden"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {MJERA_TIPS[key]}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Clear */}
          {hasAny && (
            <button
              type="button"
              onClick={resetMjere}
              className="self-start text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Obriši mere
            </button>
          )}

          {/* Recommendation box */}
          <div className="mt-2">
            <AnimatePresence mode="wait">
              {preporuka ? (
                <motion.div
                  key={preporuka.velicina + (preporuka.napomena ? 'n' : '')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="border border-[#e8e0d8] bg-white p-6"
                >
                  <p
                    className="text-[8px] tracking-[0.45em] uppercase text-[#8a8a8a] mb-4"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Preporučena veličina
                  </p>

                  <div className="flex items-center gap-5 mb-4">
                    <span
                      className="text-[64px] font-light text-[#1a1a1a] leading-none"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {preporuka.velicina}
                    </span>
                    <div className="border-l border-[#e8e0d8] pl-5">
                      {(() => {
                        const row = TABELA.find((r) => r.velicina === preporuka.velicina)
                        return row ? (
                          <div
                            className="flex flex-col gap-1 text-[11px] text-[#8a8a8a]"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            <span>
                              <span className="text-[#c9a96e]">G</span> {row.grudi[0]}–{row.grudi[1]} cm
                            </span>
                            <span>
                              <span className="text-[#c9a96e]">S</span> {row.struk[0]}–{row.struk[1]} cm
                            </span>
                            <span>
                              <span className="text-[#c9a96e]">B</span> {row.bokovi[0]}–{row.bokovi[1]} cm
                            </span>
                            <span className="text-[#8a8a8a]/50">{row.visina} cm visina</span>
                          </div>
                        ) : null
                      })()}
                    </div>
                  </div>

                  {preporuka.napomena && (
                    <p
                      className="text-[10px] text-[#c9a96e] leading-relaxed border-t border-[#f0ebe5] pt-4"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {preporuka.napomena}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-dashed border-[#e8e0d8] p-6 text-center"
                >
                  <p
                    className="text-[13px] font-light italic text-[#c8bfb5]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Unesite mere za preporuku
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ── How to measure tips ── */}
      <div className="border-t border-[#e8e0d8] pt-12 mb-16">
        <h3
          className="text-xl font-light text-[#1a1a1a] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Kako se meri?
        </h3>
        <div className="w-8 h-px bg-[#c9a96e] mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: 'Grudi',
              tip: 'Merite na najširem delu grudi. Metar neka bude horizontalan, udahnite normalno i ne pritiskajte previše.',
              num: '01',
            },
            {
              label: 'Struk',
              tip: 'Najtanji deo trupa, obično 2–3 cm iznad pupka. Stojte uspravno i ne uvlačite stomak.',
              num: '02',
            },
            {
              label: 'Bokovi',
              tip: 'Najširi deo bokova i zadnjice. Stojte sa stopalima zajedno. Metar neka bude horizontalan.',
              num: '03',
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-5">
              <span
                className="text-[#c9a96e] text-sm shrink-0 mt-0.5 tabular-nums"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {item.num}
              </span>
              <div>
                <p
                  className="text-[10px] tracking-[0.35em] uppercase text-[#1a1a1a] mb-2"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[13px] text-[#8a8a8a] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p
          className="mt-7 text-[11px] text-[#a0988e] leading-relaxed"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Uvek merite u donjem vešu, koristite mekani metar (ne čelični), i stojte uspravno u prirodnom položaju.
        </p>
      </div>

      {/* ── Full size table ── */}
      <div>
        <h3
          className="text-xl font-light text-[#1a1a1a] mb-2"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Tabela veličina
        </h3>
        <div className="w-8 h-px bg-[#c9a96e] mb-8" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-[#e8e0d8]">
                {['Veličina', 'Grudi (cm)', 'Struk (cm)', 'Bokovi (cm)', 'Visina (cm)'].map((col) => (
                  <th
                    key={col}
                    className="text-left pb-4 pr-6 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABELA.map((row) => {
                const isRec = preporuka?.velicina === row.velicina
                return (
                  <motion.tr
                    key={row.velicina}
                    animate={{
                      backgroundColor: isRec ? '#f5ede0' : 'transparent',
                    }}
                    transition={{ duration: 0.35 }}
                    className="border-b border-[#e8e0d8] group"
                  >
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ scaleY: isRec ? 1 : 0, opacity: isRec ? 1 : 0 }}
                          initial={{ scaleY: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-[3px] h-6 bg-[#c9a96e] shrink-0 origin-top"
                        />
                        <span
                          className="text-[18px] font-light leading-none"
                          style={{
                            fontFamily: 'var(--font-serif)',
                            color: isRec ? '#1a1a1a' : '#8a8a8a',
                          }}
                        >
                          {row.velicina}
                        </span>
                        <AnimatePresence>
                          {isRec && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.2 }}
                              className="text-[8px] tracking-[0.2em] uppercase text-[#c9a96e] bg-[#c9a96e]/12 px-2.5 py-1"
                              style={{ fontFamily: 'var(--font-sans)' }}
                            >
                              Vaša
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                    {[
                      `${row.grudi[0]}–${row.grudi[1]}`,
                      `${row.struk[0]}–${row.struk[1]}`,
                      `${row.bokovi[0]}–${row.bokovi[1]}`,
                      row.visina,
                    ].map((val, j) => (
                      <td
                        key={j}
                        className="py-4 pr-6 tabular-nums"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 13,
                          color: isRec ? '#3a3a3a' : '#8a8a8a',
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Po meri CTA */}
        <div className="mt-8 bg-[#1a1a1a] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p
                className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Između dve veličine?
              </p>
              <p
                className="text-[15px] font-light italic text-[#faf7f4]/85 leading-snug"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Svaka haljina dostupna je i u opciji{' '}
                <span className="text-[#c9a96e]">Po meri</span> — unesete vaše tačne mere i mi prilagodimo haljinu vama.
              </p>
            </div>
            <Link
              href="/katalog"
              className="shrink-0 inline-flex items-center gap-2.5 bg-[#c9a96e] text-[#1a1a1a] px-7 py-3.5 text-[9px] tracking-[0.35em] uppercase hover:bg-[#d4b87d] transition-colors duration-300 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pregledaj katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
