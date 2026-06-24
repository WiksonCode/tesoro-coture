'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import figuraLutka from '../../../public/figura-lutka.png'

interface Props {
  open: boolean
  onClose: () => void
}

type MjeraKey = 'grudi' | 'struk' | 'bokovi'

const TABELA = [
  { velicina: 'XS', grudi: [78, 82] as [number,number], struk: [60, 64] as [number,number], bokovi: [84, 88]  as [number,number] },
  { velicina: 'S',  grudi: [82, 86] as [number,number], struk: [64, 68] as [number,number], bokovi: [88, 92]  as [number,number] },
  { velicina: 'M',  grudi: [86, 90] as [number,number], struk: [68, 72] as [number,number], bokovi: [92, 96]  as [number,number] },
  { velicina: 'L',  grudi: [90, 96] as [number,number], struk: [72, 78] as [number,number], bokovi: [96, 102] as [number,number] },
]

function getSizeFor(key: MjeraKey, val: number): string {
  for (const row of TABELA) {
    if (val >= row[key][0] && val <= row[key][1]) return row.velicina
  }
  return val < TABELA[0][key][0] ? 'XS' : 'L'
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

// ─── Figure image for modal ───────────────────────────────────────────────────

function FiguraSlika() {
  return (
    <Image
      src={figuraLutka}
      alt=""
      aria-hidden
      className="w-full scale-125 origin-top"
      style={{ width: 'calc(100% + 64px)', height: 'auto', marginLeft: '-32px', marginRight: '-32px' }}
    />
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function VodicZaVelicineModal({ open, onClose }: Props) {
  const [mjere, setMjere] = useState({ grudi: '', struk: '', bokovi: '' })

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
    if (!open) setMjere({ grudi: '', struk: '', bokovi: '' })
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
              <div className="bg-[#1a1a1a] shrink-0 lg:w-[260px] lg:min-h-full lg:flex lg:flex-col lg:items-center lg:px-8 lg:pt-10 lg:pb-8">

                {/* Mobile: title + image capped height */}
                <div className="lg:hidden flex flex-col items-center px-8 pt-7 pb-0">
                  <p
                    className="text-[7px] tracking-[0.55em] uppercase text-[#c9a96e]/75 mb-1.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Tesoro Couture
                  </p>
                  <h2
                    className="text-[20px] font-light italic text-[#faf7f4] leading-none mb-4"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Vodič za veličine
                  </h2>
                  <Image
                    src={figuraLutka}
                    alt=""
                    aria-hidden
                    className="w-full"
                    style={{ width: 'calc(100% + 64px)', height: 'auto', marginLeft: '-32px', marginRight: '-32px' }}
                  />
                </div>

                {/* Desktop: full layout with image */}
                <div className="hidden lg:contents">
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
                  <FiguraSlika />
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
                            placeholder="0"
                            min={40}
                            max={180}
                            className="w-full border border-[#e8e0d8] bg-white px-3 py-3 text-[14px] font-light text-[#1a1a1a] outline-none focus:border-[#c9a96e] transition-colors duration-200 placeholder:text-[#d4ccc4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#a0988e]"
                            style={{ fontFamily: 'var(--font-sans)' }}>cm</span>
                        </div>
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
                        {['Vel.', 'Grudi', 'Struk', 'Bokovi'].map(col => (
                          <th key={col} className="text-left pb-2.5 text-[7.5px] tracking-[0.2em] uppercase font-normal"
                            style={{ color: col === 'Vel.' ? '#8a8a8a' : '#c9a96e' }}>
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
                            ].map((val, j) => (
                              <td key={j} className="py-2.5 pr-1 text-[10px] tabular-nums"
                                style={{ color: isRec ? '#3a3a3a' : '#5a5a5a' }}>
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
