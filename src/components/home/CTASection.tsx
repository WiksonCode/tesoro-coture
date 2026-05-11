'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-[#1a1a1a] py-24 lg:py-32 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="block w-10 h-px bg-[#c9a96e]/50" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]/50" />
          <span className="block w-10 h-px bg-[#c9a96e]/50" />
        </div>

        <p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-8"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Rezervišite termin
        </p>

        <h2
          className="text-[clamp(36px,5vw,64px)] font-light italic text-[#faf7f4] leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Zaslužujete savršenu haljinu
        </h2>

        <p
          className="text-sm text-[#faf7f4]/40 mb-12 leading-relaxed tracking-wide"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Posjetite nas i pronađite haljinu koja govori vašim jezikom.<br />
          Rezervišite besplatan termin — bez obaveza.
        </p>

        <Link
          href="/rezervacija"
          className="group inline-flex items-center gap-3 border border-[#c9a96e] px-10 py-4 text-[10px] tracking-[0.35em] uppercase text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Zakaži termin
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>
    </section>
  )
}
