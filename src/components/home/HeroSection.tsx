'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HERO_IMAGE = '/hero-bg.png'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center lg:items-end overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="TESORO Couture — elegantna haljina"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="flex flex-col items-center text-center">

          <motion.h1
            className="mb-8 leading-[0.9]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            <span
              className="block text-[clamp(48px,10vw,100px)] tracking-[-0.01em] font-light text-white uppercase"
              style={{ fontFamily: 'var(--font-serif)', textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 8px 48px rgba(0,0,0,0.6)' }}
            >
              Elegancija
            </span>
            <span
              className="block text-[clamp(34px,7.5vw,72px)] italic font-light text-white"
              style={{ fontFamily: 'var(--font-serif)', textShadow: '0 2px 24px rgba(0,0,0,0.85), 0 8px 48px rgba(0,0,0,0.6)' }}
            >
              koja traje
            </span>
          </motion.h1>

          <motion.div
            className="w-10 h-px bg-[#c9a96e] mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.85, ease: 'easeOut' }}
          />

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: 'easeOut' }}
          >
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-3 border border-white/60 px-8 sm:px-10 py-3.5 sm:py-4 text-[10px] tracking-[0.35em] uppercase text-white hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500"
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
          </motion.div>

        </div>
      </div>
    </section>
  )
}
