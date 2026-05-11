'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ShoppingBag } from 'lucide-react'
import { useKorpa } from '@/store/korpa'
import { formatCijena } from '@/components/haljine/HaljinaCard'

const KURS = 117

const velicinaLabel: Record<string, string> = {
  po_mjeri: 'Po meri',
}

function getVelicinaLabel(v: string) {
  return velicinaLabel[v] ?? v
}

export default function KorpaClient() {
  const [mounted, setMounted] = useState(false)
  const { artikli, ukloniArtikl } = useKorpa()

  useEffect(() => setMounted(true), [])

  const ukupno = artikli.reduce((sum, a) => sum + a.cijena_rsd, 0)
  const ukupnoEUR = Math.round(ukupno / KURS)

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin" />
      </div>
    )
  }

  if (artikli.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="min-h-[60vh] flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <div
          className="w-20 h-20 border border-[#e8e0d8] flex items-center justify-center mb-8 relative"
        >
          <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#c9a96e]/40" />
          <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#c9a96e]/40" />
          <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#c9a96e]/40" />
          <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#c9a96e]/40" />
          <ShoppingBag size={22} strokeWidth={1} className="text-[#1a1a1a]/20" />
        </div>

        <p
          className="text-[28px] font-light italic text-[#1a1a1a] mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Vaša korpa je prazna
        </p>
        <p
          className="text-[11px] tracking-[0.2em] text-[#8a8a8a] mb-10 uppercase"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Pogledajte našu kolekciju
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-3 bg-[#1a1a1a] text-[#faf7f4] px-10 py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Pregledaj katalog
          <ArrowRight size={11} strokeWidth={1.5} />
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-2"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Selekcija
        </p>
        <h1
          className="text-[clamp(28px,4vw,44px)] font-light text-[#1a1a1a]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Vaša korpa{' '}
          <span className="italic text-[#8a8a8a]">
            ({artikli.length} {artikli.length === 1 ? 'komad' : 'komada'})
          </span>
        </h1>
      </motion.div>

      {/* Item list */}
      <div className="border-t border-[#e8e0d8]">
        <AnimatePresence initial={false}>
          {artikli.map((artikl, i) => (
            <motion.div
              key={`${artikl.haljina_id}-${artikl.boja}-${artikl.velicina}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex gap-5 py-7 border-b border-[#e8e0d8] group"
            >
              {/* Thumbnail */}
              <Link
                href={`/haljina/${artikl.slug}`}
                className="flex-shrink-0 relative overflow-hidden bg-[#f0ebe5]"
                style={{ width: 88, aspectRatio: '3/4' }}
              >
                {artikl.slika ? (
                  <Image
                    src={artikl.slika}
                    alt={artikl.naziv}
                    fill
                    sizes="88px"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-4xl font-light italic text-[#1a1a1a]/10"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      T
                    </span>
                  </div>
                )}
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <Link href={`/haljina/${artikl.slug}`}>
                    <h3
                      className="text-base font-light text-[#1a1a1a] leading-snug hover:text-[#c9a96e] transition-colors duration-300 mb-2"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {artikl.naziv}
                    </h3>
                  </Link>
                  <div
                    className="flex items-center gap-3 text-[10px] tracking-[0.15em] text-[#8a8a8a] uppercase"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {artikl.boja && (
                      <span className="flex items-center gap-1.5">
                        {artikl.boja_hex && (
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-[#e8e0d8]"
                            style={{ background: artikl.boja_hex }}
                          />
                        )}
                        {artikl.boja}
                      </span>
                    )}
                    {artikl.boja && artikl.velicina && (
                      <span className="text-[#e8e0d8]">·</span>
                    )}
                    {artikl.velicina && (
                      <span>{getVelicinaLabel(artikl.velicina)}</span>
                    )}
                  </div>
                </div>

                <span
                  className="text-[13px] text-[#1a1a1a] mt-3"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {formatCijena(artikl.cijena_rsd)}
                </span>
              </div>

              {/* Remove button */}
              <button
                onClick={() =>
                  ukloniArtikl(artikl.haljina_id, artikl.boja, artikl.velicina)
                }
                className="self-start mt-1 p-1.5 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors duration-200"
                aria-label="Ukloni iz korpe"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent mb-8" />

        <div className="flex items-baseline justify-between mb-1">
          <span
            className="text-[10px] tracking-[0.35em] uppercase text-[#8a8a8a]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Ukupno
          </span>
          <div className="text-right">
            <span
              className="text-xl font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatCijena(ukupno)}
            </span>
            <p
              className="text-[10px] text-[#8a8a8a] mt-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              ≈ {ukupnoEUR} €
            </p>
          </div>
        </div>

        <p
          className="text-[9px] tracking-wide text-[#8a8a8a] mb-10"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Cena ne uključuje PDV. Plaćanje u salonu.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/rezervacija"
            className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] text-[#faf7f4] py-4 px-8 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Nastavi na rezervaciju
            <ArrowRight size={11} strokeWidth={1.5} />
          </Link>

          <Link
            href="/katalog"
            className="flex items-center justify-center gap-3 w-full border border-[#e8e0d8] text-[#8a8a8a] py-4 px-8 text-[9px] tracking-[0.35em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Nastavi kupovinu
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
