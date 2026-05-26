'use client'

import { useState, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
}

type MjeraKey = 'grudi' | 'struk' | 'bokovi'

const TABELA = [
  { velicina: 'XS',  grudi: [78, 82]  as [number,number], struk: [60, 64]  as [number,number], bokovi: [84, 88]   as [number,number], visina: '160–167' },
  { velicina: 'S',   grudi: [82, 86]  as [number,number], struk: [64, 68]  as [number,number], bokovi: [88, 92]   as [number,number], visina: '162–168' },
  { velicina: 'M',   grudi: [86, 90]  as [number,number], struk: [68, 72]  as [number,number], bokovi: [92, 96]   as [number,number], visina: '164–170' },
  { velicina: 'L',   grudi: [90, 96]  as [number,number], struk: [72, 78]  as [number,number], bokovi: [96, 102]  as [number,number], visina: '165–172' },
  { velicina: 'XL',  grudi: [96, 102] as [number,number], struk: [78, 84]  as [number,number], bokovi: [102, 108] as [number,number], visina: '166–174' },
  { velicina: 'XXL', grudi: [102, 110]as [number,number], struk: [84, 92]  as [number,number], bokovi: [108, 116] as [number,number], visina: '167–175' },
]

const TIPS: Record<MjeraKey, string> = {
  grudi:  'Najširi deo, metar horizontalno.',
  struk:  '2–3 cm iznad pupka, ne uvlačiti stomak.',
  bokovi: 'Najširi deo bokova i zadnjice.',
}

function getSizeFor(key: MjeraKey, val: number): string {
  for (const row of TABELA) {
    if (val >= row[key][0] && val <= row[key][1]) return row.velicina
  }
  return val < TABELA[0][key][0] ? 'XS' : 'XXL'
}

function nadjiPreporuku(g: string, s: string, b: string): { velicina: string; konflikt: boolean } | null {
  const gn = parseFloat(g), sn = parseFloat(s), bn = parseFloat(b)
  if (isNaN(gn) && isNaN(sn) && isNaN(bn)) return null
  const sizeMap: Partial<Record<MjeraKey, string>> = {}
  if (!isNaN(bn)) sizeMap.bokovi = getSizeFor('bokovi', bn)
  if (!isNaN(gn)) sizeMap.grudi  = getSizeFor('grudi', gn)
  if (!isNaN(sn)) sizeMap.struk  = getSizeFor('struk', sn)
  const sizes = Object.values(sizeMap)
  if (!sizes.length) return null
  const unique = [...new Set(sizes)]
  const recommended = sizeMap.bokovi ?? sizeMap.grudi ?? sizeMap.struk!
  return { velicina: recommended, konflikt: unique.length > 1 }
}

// ─── Compact SVG figure for modal ────────────────────────────────────────────

function FiguraSVG({ active, mjere }: {
  active: MjeraKey | null
  mjere: { grudi: string; struk: string; bokovi: string }
}) {
  const op = (key: MjeraKey) =>
    active === null ? 0.7 : active === key ? 1 : 0.18

  const GRUDI_Y = 111
  const STRUK_Y = 165
  const BOKOVI_Y = 201

  const val = (key: MjeraKey) => {
    const n = parseFloat(mjere[key])
    return !isNaN(n) ? `${n}` : ''
  }

  return (
    <svg viewBox="0 0 210 420" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full" style={{ maxWidth: 180, maxHeight: 340 }} aria-hidden>

      {/* Head */}
      <ellipse cx="100" cy="34" rx="22" ry="26" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1.2" />
      <path d="M 80 22 C 78 8 90 4 100 6 C 110 4 122 8 120 22 C 114 14 104 12 100 12 C 96 12 86 14 80 22 Z"
        fill="#c9a96e" opacity="0.2" />

      {/* Body */}
      <path d="
        M 78 58 C 60 64 46 76 44 88 C 40 98 36 108 34 120
        C 32 132 36 144 40 155 C 42 161 44 165 44 170
        C 40 180 30 190 24 206 C 20 218 22 230 26 242
        C 32 260 34 280 36 304 C 38 322 36 342 36 358
        L 30 374 L 50 374 L 53 290
        C 56 272 62 260 70 252 C 76 246 84 244 94 244
        C 98 244 100 244 100 244
        C 104 244 108 246 114 250 C 122 258 128 270 132 288
        L 136 374 L 156 374 L 150 358
        C 150 342 148 322 150 304 C 152 280 154 260 160 242
        C 164 230 166 218 162 206 C 156 190 146 180 142 170
        C 142 165 144 161 146 155 C 150 144 154 132 152 120
        C 150 108 146 98 142 88 C 140 76 126 64 108 58
        L 108 72 C 106 76 104 78 100 78 C 96 78 94 76 92 72 Z"
        fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1.3" />

      {/* ── GRUDI ── */}
      <motion.g animate={{ opacity: op('grudi') }} transition={{ duration: 0.25 }}>
        <rect x="16" y={GRUDI_Y - 5} width="136" height="10" fill="#c9a96e" opacity="0.08" />
        <line x1="28" y1={GRUDI_Y - 5} x2="28" y2={GRUDI_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1={GRUDI_Y} x2="172" y2={GRUDI_Y} stroke="#c9a96e" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="172" y1={GRUDI_Y - 5} x2="172" y2={GRUDI_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28"  cy={GRUDI_Y} r="3.5" fill="#c9a96e" />
        <circle cx="172" cy={GRUDI_Y} r="3.5" fill="#c9a96e" />
        {val('grudi') && (
          <text x="100" y={GRUDI_Y - 8} fontFamily="DM Sans, sans-serif" fontSize="8" fill="#c9a96e" textAnchor="middle" letterSpacing="1">
            {val('grudi')} cm
          </text>
        )}
      </motion.g>

      {/* ── STRUK ── */}
      <motion.g animate={{ opacity: op('struk') }} transition={{ duration: 0.25 }}>
        <rect x="30" y={STRUK_Y - 5} width="120" height="10" fill="#c9a96e" opacity="0.08" />
        <line x1="40" y1={STRUK_Y - 5} x2="40" y2={STRUK_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1={STRUK_Y} x2="160" y2={STRUK_Y} stroke="#c9a96e" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="160" y1={STRUK_Y - 5} x2="160" y2={STRUK_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40"  cy={STRUK_Y} r="3.5" fill="#c9a96e" />
        <circle cx="160" cy={STRUK_Y} r="3.5" fill="#c9a96e" />
        {val('struk') && (
          <text x="100" y={STRUK_Y - 8} fontFamily="DM Sans, sans-serif" fontSize="8" fill="#c9a96e" textAnchor="middle" letterSpacing="1">
            {val('struk')} cm
          </text>
        )}
      </motion.g>

      {/* ── BOKOVI ── */}
      <motion.g animate={{ opacity: op('bokovi') }} transition={{ duration: 0.25 }}>
        <rect x="14" y={BOKOVI_Y - 5} width="142" height="10" fill="#c9a96e" opacity="0.08" />
        <line x1="24" y1={BOKOVI_Y - 5} x2="24" y2={BOKOVI_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1={BOKOVI_Y} x2="176" y2={BOKOVI_Y} stroke="#c9a96e" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="176" y1={BOKOVI_Y - 5} x2="176" y2={BOKOVI_Y + 5} stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24"  cy={BOKOVI_Y} r="3.5" fill="#c9a96e" />
        <circle cx="176" cy={BOKOVI_Y} r="3.5" fill="#c9a96e" />
        {val('bokovi') && (
          <text x="100" y={BOKOVI_Y - 8} fontFamily="DM Sans, sans-serif" fontSize="8" fill="#c9a96e" textAnchor="middle" letterSpacing="1">
            {val('bokovi')} cm
          </text>
        )}
      </motion.g>

      {/* Height indicator */}
      <g opacity="0.2">
        <line x1="8" y1="8" x2="8" y2="374" stroke="#faf7f4" strokeWidth="0.8" />
        <path d="M 5 15 L 8 7 L 11 15" fill="none" stroke="#faf7f4" strokeWidth="0.8" />
        <path d="M 5 367 L 8 375 L 11 367" fill="none" stroke="#faf7f4" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function VodicZaVelicineModal({ open, onClose }: Props) {
  const [mjere, setMjere] = useState({ grudi: '', struk: '', bokovi: '' })
  const [active, setActive] = useState<MjeraKey | null>(null)

  const preporuka = useMemo(
    () => nadjiPreporuku(mjere.grudi, mjere.struk, mjere.bokovi),
    [mjere]
  )

  const setMjera = (key: MjeraKey, val: string) =>
    setMjere(prev => ({ ...prev, [key]: val }))

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset on close
  useEffect(() => {
    if (!open) {
      setMjere({ grudi: '', struk: '', bokovi: '' })
      setActive(null)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black/65 z-50 backdrop-blur-[3px]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-[820px] z-50 shadow-2xl overflow-hidden"
            style={{ maxHeight: '94vh' }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center transition-colors cursor-pointer bg-white/10 hover:bg-white/20 lg:bg-[#f0ebe5]/80 lg:hover:bg-[#e8e0d8]"
              aria-label="Zatvori"
            >
              <X size={13} strokeWidth={1.5} className="text-white lg:text-[#1a1a1a]" />
            </button>

            <div
              className="flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
              style={{ maxHeight: '94vh' }}
            >

              {/* ── Left — dark figure panel ── */}
              <div className="bg-[#1a1a1a] flex flex-col items-center px-8 pt-10 pb-8 lg:w-[260px] lg:min-h-full shrink-0">
                <p
                  className="text-[8px] tracking-[0.65em] uppercase text-[#c9a96e]/75 mb-3"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Tesoro Couture
                </p>
                <h2
                  className="text-[22px] font-light italic text-[#faf7f4] leading-snug text-center mb-6"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Vodič za<br />veličine
                </h2>
                <div className="w-6 h-px bg-[#c9a96e]/40 mb-6" />

                <FiguraSVG active={active} mjere={mjere} />

                {/* Measure labels */}
                <div className="mt-5 w-full flex flex-col gap-2">
                  {(['grudi', 'struk', 'bokovi'] as MjeraKey[]).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActive(active === key ? null : key)}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <span className="w-5 h-px bg-[#c9a96e] opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span
                        className="text-[8px] tracking-[0.35em] uppercase transition-colors"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          color: active === key ? '#c9a96e' : 'rgba(250,247,244,0.65)',
                        }}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Right — cream panel ── */}
              <div className="flex-1 bg-[#faf7f4] px-7 pt-7 pb-7 flex flex-col lg:overflow-y-auto">

                {/* Inputs */}
                <div className="mb-5">
                  <p
                    className="text-[10px] tracking-[0.35em] uppercase text-[#6a6a6a] mb-4"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Unesite mere (cm)
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['grudi', 'struk', 'bokovi'] as MjeraKey[]).map(key => (
                      <div key={key}>
                        <label
                          className="block text-[10px] tracking-[0.25em] uppercase text-[#c9a96e] mb-1.5"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={mjere[key]}
                            onChange={e => setMjera(key, e.target.value)}
                            onFocus={() => setActive(key)}
                            onBlur={() => setActive(null)}
                            placeholder="0"
                            min={40}
                            max={180}
                            className="w-full border border-[#e8e0d8] bg-white px-3 py-3 text-[14px] font-light text-[#1a1a1a] outline-none focus:border-[#c9a96e] transition-colors duration-200 placeholder:text-[#d4ccc4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#a0988e]"
                            style={{ fontFamily: 'var(--font-sans)' }}>cm</span>
                        </div>
                        <AnimatePresence>
                          {active === key && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="text-[9px] text-[#8a8a8a] mt-1.5 overflow-hidden leading-snug"
                              style={{ fontFamily: 'var(--font-sans)' }}
                            >
                              {TIPS[key]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <AnimatePresence mode="wait">
                  {preporuka ? (
                    <motion.div
                      key={preporuka.velicina}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#1a1a1a] px-5 py-4 mb-5 flex items-center gap-5"
                    >
                      <span
                        className="text-[52px] font-light text-[#faf7f4] leading-none shrink-0"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {preporuka.velicina}
                      </span>
                      <div className="border-l border-white/10 pl-5 flex-1">
                        {preporuka.konflikt ? (
                          <p className="text-[10px] text-[#c9a96e] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                            Mere ukazuju na različite veličine. Preporučujemo opciju{' '}
                            <span className="font-medium">Po meri</span>.
                          </p>
                        ) : (
                          <>
                            <p className="text-[9px] tracking-[0.3em] uppercase text-[#faf7f4]/65 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                              Preporučena veličina
                            </p>
                            {(() => {
                              const row = TABELA.find(r => r.velicina === preporuka.velicina)
                              return row ? (
                                <div className="flex gap-4 text-[11px] text-[#faf7f4]/80" style={{ fontFamily: 'var(--font-sans)' }}>
                                  <span><span className="text-[#c9a96e]">G</span> {row.grudi[0]}–{row.grudi[1]}</span>
                                  <span><span className="text-[#c9a96e]">S</span> {row.struk[0]}–{row.struk[1]}</span>
                                  <span><span className="text-[#c9a96e]">B</span> {row.bokovi[0]}–{row.bokovi[1]}</span>
                                </div>
                              ) : null
                            })()}
                          </>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border border-dashed border-[#e8e0d8] px-5 py-4 mb-5 text-center"
                    >
                      <p className="text-[12px] font-light italic text-[#c8bfb5]" style={{ fontFamily: 'var(--font-serif)' }}>
                        Unesite mere za preporuku
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Size table */}
                <div>
                  <p className="text-[10px] tracking-[0.45em] uppercase text-[#6a6a6a] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    Tabela veličina (cm)
                  </p>
                  <div className="h-px w-6 bg-[#c9a96e] mb-4" />

                  <table className="w-full" style={{ fontFamily: 'var(--font-sans)' }}>
                    <thead>
                      <tr className="border-b border-[#e8e0d8]">
                        {['Vel.', 'Grudi', 'Struk', 'Bokovi', 'Visina'].map(col => (
                          <th key={col} className="text-left pb-2.5 text-[7.5px] tracking-[0.2em] uppercase font-normal"
                            style={{ color: col === 'Vel.' || col === 'Visina' ? '#8a8a8a' : '#c9a96e', opacity: col === 'Visina' ? 0.65 : 1 }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABELA.map(row => {
                        const isRec = preporuka?.velicina === row.velicina
                        return (
                          <motion.tr
                            key={row.velicina}
                            animate={{ backgroundColor: isRec ? '#f5ede0' : 'transparent' }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-[#f0ebe5]"
                          >
                            <td className="py-2.5 pr-2">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ scaleY: isRec ? 1 : 0, opacity: isRec ? 1 : 0 }}
                                  initial={{ scaleY: 0, opacity: 0 }}
                                  className="w-[2.5px] h-5 bg-[#c9a96e] shrink-0 origin-top"
                                />
                                <span
                                  className="text-[15px] font-light"
                                  style={{ fontFamily: 'var(--font-serif)', color: isRec ? '#1a1a1a' : '#8a8a8a' }}
                                >
                                  {row.velicina}
                                </span>
                              </div>
                            </td>
                            {[
                              `${row.grudi[0]}–${row.grudi[1]}`,
                              `${row.struk[0]}–${row.struk[1]}`,
                              `${row.bokovi[0]}–${row.bokovi[1]}`,
                              row.visina,
                            ].map((val, j) => (
                              <td key={j} className="py-2.5 pr-1 text-[10px] tabular-nums"
                                style={{ color: isRec ? '#3a3a3a' : j === 3 ? 'rgba(138,138,138,0.65)' : '#5a5a5a' }}>
                                {val}
                              </td>
                            ))}
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer note */}
                <p className="mt-auto pt-5 text-[11px] text-[#8a8a8a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
                  Između dve veličine? Preporučujemo veću, ili odaberite{' '}
                  <span className="text-[#c9a96e]">Po meri</span> za savršen fit.
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
