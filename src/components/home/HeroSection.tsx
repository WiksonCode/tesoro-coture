'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf7f4] pt-20">

      {/* Subtle background texture: large italic "T" watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[40vw] font-light italic text-[#1a1a1a]/[0.025] leading-none"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          T
        </span>
      </div>

      {/* Thin golden top accent */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-px h-16 bg-[#c9a96e]/40"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        style={{ transformOrigin: 'top' }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <motion.p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-8"
          style={{ fontFamily: 'var(--font-sans)' }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Beograd · Kolekcija 2025
        </motion.p>

        {/* Main headline */}
        <motion.h1
          className="leading-[0.9] mb-6"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span
            className="block text-[clamp(56px,10vw,110px)] tracking-[-0.01em] font-light text-[#1a1a1a] uppercase"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Elegancija
          </span>
          <span
            className="block text-[clamp(40px,7vw,80px)] italic font-light text-[#1a1a1a]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            koja traje
          </span>
        </motion.h1>

        {/* Golden rule */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.95 }}
        >
          <span className="block w-12 h-px bg-[#c9a96e]" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
          <span className="block w-12 h-px bg-[#c9a96e]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-[#8a8a8a] tracking-wide leading-relaxed mb-12 max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-sans)' }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          Otkrijte kolekciju vjenčanih, koktel i svečanih haljina.<br />
          Svaka haljina — priča o savršenstvu.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 1.25 }}
        >
          <Link
            href="/katalog"
            className="group inline-flex items-center gap-3 border border-[#1a1a1a] px-10 py-4 text-[10px] tracking-[0.35em] uppercase text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pogledaj kolekciju
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Thin golden bottom accent */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-12 bg-[#c9a96e]/40"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 1.4 }}
        style={{ transformOrigin: 'bottom' }}
      />

      {/* Scroll hint */}
      <motion.p
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.4em] uppercase text-[#8a8a8a]"
        style={{ fontFamily: 'var(--font-sans)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        Scroll
      </motion.p>
    </section>
  )
}
