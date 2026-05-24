'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ShoppingBag, Calendar } from 'lucide-react'
import { useKorpa } from '@/store/korpa'
import { formatCijena } from '@/components/haljine/HaljinaCard'

const KURS = 117

function getVelicinaLabel(v: string) {
  return v === 'po_mjeri' ? 'Po meri' : v
}

function formatEUR(rsd: number) {
  return '≈ ' + Math.round(rsd / KURS) + ' €'
}

export default function KorpaClient() {
  const [mounted, setMounted] = useState(false)
  const { artikli, ukloniArtikl } = useKorpa()

  useEffect(() => setMounted(true), [])

  const ukupno = artikli.reduce((sum, a) => sum + a.cijena_rsd, 0)

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin" />
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (artikli.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-[72vh] flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="relative mb-10 w-24 h-24 border border-[#e8e0d8] flex items-center justify-center">
          <span className="absolute top-1.5 left-1.5 w-4 h-4 border-t border-l border-[#c9a96e]/40" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 border-t border-r border-[#c9a96e]/40" />
          <span className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b border-l border-[#c9a96e]/40" />
          <span className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b border-r border-[#c9a96e]/40" />
          <ShoppingBag size={24} strokeWidth={1} className="text-[#1a1a1a]/15" />
        </div>

        <p
          className="text-[clamp(34px,5vw,58px)] font-light italic text-[#1a1a1a] leading-tight mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Vaša korpa<br />je prazna
        </p>
        <div className="w-8 h-px bg-[#c9a96e]/50 mx-auto my-4" />
        <p
          className="text-[10px] tracking-[0.35em] text-[#8a8a8a] mb-10 uppercase"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Otkrijte novu kolekciju
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-3 bg-[#1a1a1a] text-[#faf7f4] px-10 py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Pregledaj katalog
          <ArrowRight size={11} strokeWidth={1.5} />
        </Link>
      </motion.div>
    )
  }

  // ── Filled state ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 py-10 lg:py-14">

      {/* Item count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {artikli.length} {artikli.length === 1 ? 'komad' : 'komada'}
      </motion.p>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-14 lg:items-start">

        {/* ── LEFT — Item list ── */}
        <div className="border-t border-[#e8e0d8]">
          <AnimatePresence initial={false}>
            {artikli.map((artikl, i) => (
              <motion.div
                key={`${artikl.haljina_id}-${artikl.boja}-${artikl.velicina}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex gap-5 lg:gap-7 py-7 lg:py-8 border-b border-[#e8e0d8] group"
              >
                {/* Thumbnail */}
                <Link
                  href={`/haljina/${artikl.slug}`}
                  className="shrink-0 relative overflow-hidden bg-[#f0ebe5]"
                  style={{ width: 100, aspectRatio: '3/4' }}
                >
                  {artikl.slika ? (
                    <Image
                      src={artikl.slika}
                      alt={artikl.naziv}
                      fill
                      sizes="100px"
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-light italic text-[#1a1a1a]/10" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <Link href={`/haljina/${artikl.slug}`}>
                      <h3
                        className="text-[18px] font-light text-[#1a1a1a] leading-snug hover:text-[#c9a96e] transition-colors duration-300 mb-3"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {artikl.naziv}
                      </h3>
                    </Link>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {artikl.boja && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#e8e0d8] text-[8px] tracking-[0.15em] uppercase text-[#8a8a8a]"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {artikl.boja_hex && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0 border border-[#e8e0d8]"
                              style={{ background: artikl.boja_hex }}
                            />
                          )}
                          {artikl.boja}
                        </span>
                      )}
                      {artikl.velicina && (
                        <span
                          className="inline-flex items-center px-2.5 py-1 border border-[#e8e0d8] text-[8px] tracking-[0.15em] uppercase text-[#8a8a8a]"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {getVelicinaLabel(artikl.velicina)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-4">
                    <span
                      className="text-[14px] font-light text-[#1a1a1a] tabular-nums"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {formatCijena(artikl.cijena_rsd)}
                    </span>
                    <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {formatEUR(artikl.cijena_rsd)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => ukloniArtikl(artikl.haljina_id, artikl.boja, artikl.velicina)}
                  className="self-start mt-1 w-7 h-7 flex items-center justify-center text-[#c8c0b8] hover:text-[#1a1a1a] hover:bg-[#f0ebe5] transition-all duration-200 cursor-pointer"
                  aria-label="Ukloni iz korpe"
                >
                  <X size={13} strokeWidth={1.5} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Mobile total (only shows on mobile, below items) */}
          <div className="lg:hidden mt-8 border-t border-[#e8e0d8] pt-6">
            <div className="flex items-baseline justify-between mb-6">
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Ukupno
              </span>
              <div className="text-right">
                <p className="text-xl font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                  {formatCijena(ukupno)}
                </p>
                <p className="text-[10px] text-[#8a8a8a] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  {formatEUR(ukupno)}
                </p>
              </div>
            </div>
            <p className="text-[8.5px] text-[#8a8a8a]/60 mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
              Cena ne uključuje PDV. Plaćanje u salonu.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/rezervacija"
                className="flex items-center justify-center gap-2.5 w-full bg-[#1a1a1a] text-[#faf7f4] py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Calendar size={12} strokeWidth={1.5} />
                Rezerviši termin
              </Link>
              <Link
                href="/katalog"
                className="flex items-center justify-center w-full border border-[#e8e0d8] text-[#8a8a8a] py-4 text-[9px] tracking-[0.35em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Dark sticky summary (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="hidden lg:block lg:sticky lg:top-28"
        >
          <div className="bg-[#1a1a1a] px-7 py-8">
            {/* Panel label */}
            <p
              className="text-[7px] tracking-[0.65em] uppercase text-[#c9a96e]/55 mb-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Tesoro Couture
            </p>
            <h2
              className="text-[22px] font-light italic text-[#faf7f4] leading-snug mb-7"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Pregled<br />porudžbine
            </h2>

            {/* Items breakdown */}
            <div className="space-y-3.5 pb-6 mb-6 border-b border-white/[0.08]">
              {artikli.map((artikl) => (
                <div
                  key={`sum-${artikl.haljina_id}-${artikl.boja}-${artikl.velicina}`}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] text-[#faf7f4]/60 leading-snug truncate"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {artikl.naziv}
                    </p>
                    <p className="text-[9px] text-[#faf7f4]/28 mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                      {getVelicinaLabel(artikl.velicina)}
                      {artikl.boja ? ` · ${artikl.boja}` : ''}
                    </p>
                  </div>
                  <span
                    className="text-[10px] text-[#faf7f4]/65 shrink-0 tabular-nums"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {formatCijena(artikl.cijena_rsd)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between mb-1">
              <span
                className="text-[8.5px] tracking-[0.35em] uppercase text-[#faf7f4]/35"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Ukupno
              </span>
              <span
                className="text-[19px] font-light text-[#faf7f4] tabular-nums"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {formatCijena(ukupno)}
              </span>
            </div>
            <p
              className="text-right text-[10px] text-[#c9a96e]/65 mb-8"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatEUR(ukupno)}
            </p>

            {/* CTAs */}
            <Link
              href="/rezervacija"
              className="flex items-center justify-center gap-2.5 w-full bg-[#c9a96e] text-[#1a1a1a] py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#d4b87d] transition-all duration-300 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Calendar size={12} strokeWidth={1.5} />
              Rezerviši termin
            </Link>

            <Link
              href="/katalog"
              className="flex items-center justify-center w-full mt-3 py-3 text-[8.5px] tracking-[0.25em] uppercase text-[#faf7f4]/30 hover:text-[#faf7f4]/65 transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Nastavi kupovinu
            </Link>

            {/* Footer note */}
            <div className="mt-7 pt-6 border-t border-white/[0.07]">
              <p
                className="text-[7.5px] text-[#faf7f4]/18 leading-relaxed text-center"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Plaćanje u salonu · Bez PDV-a
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
