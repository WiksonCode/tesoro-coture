'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Calendar } from 'lucide-react'
import { useKorpa } from '@/store/korpa'
import { formatCijena } from '@/components/haljine/HaljinaCard'

const KURS = 117

function getVelicinaLabel(v: string) {
  return v === 'po_mjeri' ? 'Po meri' : v
}

function formatEUR(rsd: number) {
  return '≈ ' + Math.round(rsd / KURS) + ' €'
}

function StepBar() {
  return (
    <div
      className="flex items-center gap-0 mb-8"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center bg-[#1a1a1a] text-[#faf7f4] text-[8px] tracking-wide">1</span>
        <span className="text-[8.5px] tracking-[0.25em] uppercase text-[#1a1a1a]">Korpa</span>
      </div>
      <div className="mx-3 flex-1 max-w-[48px] h-px bg-[#e8e0d8]" />
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center border border-[#e8e0d8] text-[8px] tracking-wide text-[#c8c0b8]">2</span>
        <span className="text-[8.5px] tracking-[0.25em] uppercase text-[#c8c0b8]">Rezervacija</span>
      </div>
    </div>
  )
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#1a1a1a]/15">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
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

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-10 py-10 lg:py-14">

      <StepBar />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {artikli.length} {artikli.length === 1 ? 'komad' : 'komada'}
      </motion.p>

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-14 lg:items-start">

        {/* LEFT — Item list */}
        <div className="border-t border-[#e8e0d8]">
          <AnimatePresence initial={false}>
            {artikli.map((artikl, i) => (
              <motion.div
                key={artikl.inventar_id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex gap-5 lg:gap-8 py-8 lg:py-9 border-b border-[#e8e0d8] group"
              >
                {/* Dress image — enlarged */}
                <Link
                  href={`/haljina/${artikl.slug}`}
                  className="shrink-0 relative overflow-hidden bg-[#f0ebe5]"
                  style={{ width: 120, aspectRatio: '3/4' }}
                >
                  {artikl.slika ? (
                    <Image
                      src={artikl.slika}
                      alt={artikl.naziv}
                      fill
                      sizes="(min-width: 1024px) 160px, 120px"
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-light italic text-[#1a1a1a]/10" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <Link href={`/haljina/${artikl.slug}`}>
                      <h3
                        className="text-[19px] lg:text-[21px] font-light text-[#1a1a1a] leading-snug hover:text-[#c9a96e] transition-colors duration-300 mb-3"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {artikl.naziv}
                      </h3>
                    </Link>

                    {/* Inline color + size — no pill borders */}
                    <div
                      className="flex items-center gap-2 text-[10px] tracking-[0.1em] text-[#8a8a8a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {artikl.boja_hex && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-[#e8e0d8]"
                          style={{ background: artikl.boja_hex }}
                        />
                      )}
                      {artikl.boja_naziv && (
                        <span>{artikl.boja_naziv}</span>
                      )}
                      {artikl.boja_naziv && artikl.velicina && (
                        <span className="text-[#c8c0b8]">·</span>
                      )}
                      {artikl.velicina && (
                        <span>{getVelicinaLabel(artikl.velicina)}</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2.5 mt-5">
                    <span
                      className="text-[17px] font-light text-[#1a1a1a] tabular-nums"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {formatCijena(artikl.cijena_rsd)}
                    </span>
                    <span
                      className="text-[11px] text-[#8a8a8a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {formatEUR(artikl.cijena_rsd)}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => ukloniArtikl(artikl.inventar_id)}
                  className="self-start mt-1.5 w-7 h-7 flex items-center justify-center text-[#6a6a6a] hover:text-[#c9a96e] hover:bg-[#f5ede0] transition-all duration-200 cursor-pointer"
                  aria-label="Ukloni iz korpe"
                >
                  <X size={13} strokeWidth={1.5} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Mobile summary */}
          <div className="lg:hidden mt-8 border-t border-[#e8e0d8] pt-7">
            <div className="flex items-baseline justify-between mb-6">
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Ukupno
              </span>
              <div className="text-right">
                <p
                  className="text-[20px] font-light text-[#1a1a1a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {formatCijena(ukupno)}
                </p>
                <p
                  className="text-[11px] text-[#8a8a8a] mt-0.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {formatEUR(ukupno)}
                </p>
              </div>
            </div>
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
                className="flex items-center justify-center w-full border border-[#e8e0d8] text-[#6a6a6a] py-4 text-[9px] tracking-[0.35em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — Dark sticky summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="hidden lg:block lg:sticky lg:top-28"
        >
          <div className="bg-[#1a1a1a] px-7 py-8">
            <p
              className="text-[9px] tracking-[0.65em] uppercase text-[#c9a96e]/70 mb-1"
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

            {/* Item list in summary */}
            <div className="space-y-4 pb-6 mb-6 border-b border-white/[0.08]">
              {artikli.map((artikl) => (
                <div key={`sum-${artikl.inventar_id}`} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10.5px] text-[#faf7f4]/75 leading-snug truncate"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {artikl.naziv}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {artikl.boja_hex && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0 ring-1 ring-white/10"
                          style={{ background: artikl.boja_hex }}
                        />
                      )}
                      <p
                        className="text-[9px] text-[#faf7f4]/65"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {getVelicinaLabel(artikl.velicina)}
                        {artikl.boja_naziv ? ` · ${artikl.boja_naziv}` : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10.5px] text-[#faf7f4]/70 shrink-0 tabular-nums"
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
                className="text-[10px] tracking-[0.35em] uppercase text-[#faf7f4]/65"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Ukupno
              </span>
              <span
                className="text-[20px] font-light text-[#faf7f4] tabular-nums"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {formatCijena(ukupno)}
              </span>
            </div>
            <p
              className="text-right text-[11px] text-[#c9a96e]/80 mb-8"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatEUR(ukupno)}
            </p>

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
              className="flex items-center justify-center w-full mt-3 py-3 text-[10px] tracking-[0.25em] uppercase text-[#faf7f4]/65 hover:text-[#faf7f4]/90 transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Nastavi kupovinu
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
