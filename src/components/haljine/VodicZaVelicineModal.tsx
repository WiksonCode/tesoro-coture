'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
}

const TABELA = [
  { velicina: 'XS',  grudi: '78–82',  struk: '60–64', bokovi: '84–88',   visina: '160–167' },
  { velicina: 'S',   grudi: '82–86',  struk: '64–68', bokovi: '88–92',   visina: '162–168' },
  { velicina: 'M',   grudi: '86–90',  struk: '68–72', bokovi: '92–96',   visina: '164–170' },
  { velicina: 'L',   grudi: '90–96',  struk: '72–78', bokovi: '96–102',  visina: '165–172' },
  { velicina: 'XL',  grudi: '96–102', struk: '78–84', bokovi: '102–108', visina: '166–174' },
  { velicina: 'XXL', grudi: '102–110',struk: '84–92', bokovi: '108–116', visina: '167–175' },
]

export default function VodicZaVelicineModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black/65 z-50 backdrop-blur-[3px]"
            onClick={onClose}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 56 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-[640px] z-50 shadow-2xl overflow-hidden"
            style={{ maxHeight: '93vh' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center transition-colors cursor-pointer lg:bg-[#f0ebe5]/80 lg:hover:bg-[#e8e0d8] bg-white/12 hover:bg-white/20"
            >
              <X size={13} strokeWidth={1.5} className="lg:text-[#1a1a1a] text-white" />
            </button>

            <div className="flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden" style={{ maxHeight: '93vh' }}>

              {/* ── Left — dark editorial panel ── */}
              <div className="bg-[#1a1a1a] flex flex-col items-center px-8 pt-10 pb-8 lg:w-[230px] lg:min-h-full shrink-0">
                {/* Wordmark */}
                <p
                  className="text-[7px] tracking-[0.65em] uppercase text-[#c9a96e]/50 mb-4"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Tesoro Couture
                </p>

                {/* Heading */}
                <h2
                  className="text-[23px] font-light italic text-[#faf7f4] leading-snug text-center mb-7"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Vodič za<br />veličine
                </h2>

                {/* Divider */}
                <div className="w-6 h-px bg-[#c9a96e]/40 mb-7" />

                {/* SVG Figure */}
                <svg
                  viewBox="0 0 300 460"
                  className="w-full"
                  style={{ maxWidth: '150px', maxHeight: '250px' }}
                  aria-hidden
                >
                  {/* Head */}
                  <ellipse cx="140" cy="34" rx="22" ry="26" fill="#e8e0d8" />
                  <ellipse cx="140" cy="20" rx="24" ry="12" fill="#d4c9be" />

                  {/* Body */}
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
                    fill="#e8e0d8"
                  />

                  {/* ── GRUDI (y≈111) ── */}
                  <line x1="68" y1="114" x2="68" y2="108" stroke="#c9a96e" strokeWidth="1.5" />
                  <line x1="68" y1="111" x2="212" y2="111" stroke="#c9a96e" strokeWidth="0.75" strokeDasharray="5 3" />
                  <line x1="212" y1="114" x2="212" y2="108" stroke="#c9a96e" strokeWidth="1.5" />
                  <circle cx="68"  cy="111" r="2.5" fill="#c9a96e" />
                  <circle cx="212" cy="111" r="2.5" fill="#c9a96e" />
                  <text x="220" y="115" fontFamily="'DM Sans', sans-serif" fontSize="8.5" letterSpacing="1.8" fill="#c9a96e">GRUDI</text>

                  {/* ── STRUK (y≈165) ── */}
                  <line x1="80" y1="168" x2="80" y2="162" stroke="#c9a96e" strokeWidth="1.5" />
                  <line x1="80" y1="165" x2="200" y2="165" stroke="#c9a96e" strokeWidth="0.75" strokeDasharray="5 3" />
                  <line x1="200" y1="168" x2="200" y2="162" stroke="#c9a96e" strokeWidth="1.5" />
                  <circle cx="80"  cy="165" r="2.5" fill="#c9a96e" />
                  <circle cx="200" cy="165" r="2.5" fill="#c9a96e" />
                  <text x="208" y="169" fontFamily="'DM Sans', sans-serif" fontSize="8.5" letterSpacing="1.8" fill="#c9a96e">STRUK</text>

                  {/* ── BOKOVI (y≈201) ── */}
                  <line x1="62" y1="204" x2="62" y2="198" stroke="#c9a96e" strokeWidth="1.5" />
                  <line x1="62" y1="201" x2="218" y2="201" stroke="#c9a96e" strokeWidth="0.75" strokeDasharray="5 3" />
                  <line x1="218" y1="204" x2="218" y2="198" stroke="#c9a96e" strokeWidth="1.5" />
                  <circle cx="62"  cy="201" r="2.5" fill="#c9a96e" />
                  <circle cx="218" cy="201" r="2.5" fill="#c9a96e" />
                  <text x="226" y="205" fontFamily="'DM Sans', sans-serif" fontSize="8.5" letterSpacing="1.8" fill="#c9a96e">BOKOVI</text>

                  {/* ── VISINA — left side bracket (cream on dark bg) ── */}
                  <line x1="38" y1="8"   x2="52" y2="8"   stroke="#faf7f4" strokeWidth="1" opacity="0.25" />
                  <line x1="44" y1="8"   x2="44" y2="374" stroke="#faf7f4" strokeWidth="0.75" strokeDasharray="4 3" opacity="0.18" />
                  <line x1="38" y1="374" x2="52" y2="374" stroke="#faf7f4" strokeWidth="1" opacity="0.25" />
                  <text
                    x="44" y="191"
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="8.5" letterSpacing="2.5"
                    fill="#faf7f4" opacity="0.28"
                    textAnchor="middle"
                    transform="rotate(-90, 44, 191)"
                  >
                    VISINA
                  </text>
                </svg>

                <p
                  className="mt-5 text-[8px] tracking-widest text-[#faf7f4]/20 uppercase"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  cm
                </p>
              </div>

              {/* ── Right — cream table panel ── */}
              <div className="flex-1 bg-[#faf7f4] px-7 pt-8 pb-7 flex flex-col lg:overflow-y-auto">

                {/* Section header */}
                <div className="mb-6">
                  <p
                    className="text-[8px] tracking-[0.55em] uppercase text-[#8a8a8a] mb-2.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Tabela veličina (cm)
                  </p>
                  <div className="h-px w-7 bg-[#c9a96e]" />
                </div>

                {/* Table */}
                <table className="w-full" style={{ fontFamily: 'var(--font-sans)' }}>
                  <thead>
                    <tr className="border-b border-[#e8e0d8]">
                      <th className="text-left pb-2.5 text-[7.5px] tracking-[0.25em] uppercase text-[#8a8a8a]/55 font-normal w-12">Vel.</th>
                      <th className="text-left pb-2.5 text-[7.5px] tracking-[0.18em] uppercase font-normal" style={{ color: '#c9a96e' }}>Grudi</th>
                      <th className="text-left pb-2.5 text-[7.5px] tracking-[0.18em] uppercase font-normal" style={{ color: '#c9a96e' }}>Struk</th>
                      <th className="text-left pb-2.5 text-[7.5px] tracking-[0.18em] uppercase font-normal" style={{ color: '#c9a96e' }}>Bokovi</th>
                      <th className="text-left pb-2.5 text-[7.5px] tracking-[0.18em] uppercase font-normal text-[#8a8a8a]/35">Visina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TABELA.map((red) => (
                      <tr
                        key={red.velicina}
                        className="border-b border-[#f0ebe5] hover:bg-[#f5f0ea]/70 transition-colors duration-150"
                      >
                        <td className="py-2.5 pr-3">
                          <span
                            className="text-[16px] font-light text-[#1a1a1a] tracking-wide"
                            style={{ fontFamily: 'var(--font-serif)' }}
                          >
                            {red.velicina}
                          </span>
                        </td>
                        <td className="py-2.5 pr-2 text-[10px] text-[#5a5a5a] tabular-nums">{red.grudi}</td>
                        <td className="py-2.5 pr-2 text-[10px] text-[#5a5a5a] tabular-nums">{red.struk}</td>
                        <td className="py-2.5 pr-2 text-[10px] text-[#5a5a5a] tabular-nums">{red.bokovi}</td>
                        <td className="py-2.5 text-[10px] text-[#8a8a8a]/45 tabular-nums">{red.visina}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer note */}
                <p
                  className="mt-auto pt-5 text-[8.5px] text-[#8a8a8a]/50 leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Između dve veličine? Preporučujemo veću.<br />
                  Za savršen fit — odaberite{' '}
                  <span className="text-[#c9a96e]/70">Po meri</span>.
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
