'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1774976626858-75cf588233f0?w=1920&q=85&fit=crop&auto=format'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center lg:items-end overflow-hidden">
      {/* Hero slika */}
      <Image
        src={HERO_IMAGE}
        alt="TESORO Couture — elegantna haljina"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay — uniformniji na mobilnom, gradijent na desktopu */}
      <div className="absolute inset-0 bg-black/55 lg:hidden" />
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      {/* Top gradient za navbar */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Sadržaj */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-28 lg:py-0 lg:pb-28">
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        >
          <p
            className="text-[9px] tracking-[0.6em] uppercase text-[#c9a96e] mb-5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Beograd · Kolekcija 2025
          </p>

          <h1 className="mb-6 leading-[0.9]">
            <span
              className="block text-[clamp(48px,10vw,100px)] tracking-[-0.01em] font-light text-white uppercase"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Elegancija
            </span>
            <span
              className="block text-[clamp(34px,7.5vw,72px)] italic font-light text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              koja traje
            </span>
          </h1>

          {/* Zlatna linija */}
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <span className="block w-10 h-px bg-[#c9a96e]" />
            <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
            <span className="block w-10 h-px bg-[#c9a96e]" />
          </div>

          <p
            className="text-sm text-white/60 tracking-wide leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Otkrijte kolekciju venčanih, koktel i svečanih haljina.
            Svaka haljina — priča o savršenstvu.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-3 border border-white/60 px-8 sm:px-10 py-3.5 sm:py-4 text-[10px] tracking-[0.35em] uppercase text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-500"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pogledaj kolekciju
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/rezervacija"
              className="group inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-white/60 hover:text-[#c9a96e] transition-colors duration-300 border-b border-white/20 hover:border-[#c9a96e] pb-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Zakaži termin
              <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span
          className="text-[7px] tracking-[0.5em] uppercase text-white/35"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Skroluj
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={14} strokeWidth={1} className="text-white/35" />
        </motion.div>
      </motion.div>
    </section>
  )
}
