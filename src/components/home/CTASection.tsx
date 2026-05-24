'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative bg-[#faf7f4] py-16 lg:py-32 px-6 overflow-hidden">

      {/* Watermark */}
      <span
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[clamp(160px,25vw,320px)] font-light italic leading-none text-[#1a1a1a]/[0.04]"
        style={{ fontFamily: 'var(--font-serif)' }}
        aria-hidden
      >
        Tesoro
      </span>

      {/* Corner brackets */}
      <span className="absolute top-6 left-6 w-7 h-7 border-t border-l border-[#c9a96e]/30" />
      <span className="absolute top-6 right-6 w-7 h-7 border-t border-r border-[#c9a96e]/30" />
      <span className="absolute bottom-6 left-6 w-7 h-7 border-b border-l border-[#c9a96e]/30" />
      <span className="absolute bottom-6 right-6 w-7 h-7 border-b border-r border-[#c9a96e]/30" />

      <motion.div
        className="relative max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="block w-10 h-px bg-[#c9a96e]/40" />
          <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]/40" />
          <span className="block w-10 h-px bg-[#c9a96e]/40" />
        </div>

        <p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-8"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Rezervišite termin
        </p>

        <h2
          className="text-[clamp(36px,5vw,64px)] font-light text-[#1a1a1a] leading-[1.1] mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Pronađite haljinu koja<br />
          <span className="italic">priča vašu priču</span>
        </h2>

        <p
          className="text-sm text-[#8a8a8a] mb-12 leading-relaxed tracking-wide max-w-lg mx-auto"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Zakažite besplatnu konsultaciju u našem beogradskom salonu.
          Naš tim vas vodi kroz celu kolekciju — venčane, koktel i svečane haljine —
          dok ne pronađete onu pravu.
        </p>

        <div className="flex flex-col items-center gap-5">
          <Link
            href="/rezervacija"
            className="group inline-flex items-center gap-3 border border-[#1a1a1a] px-10 py-4 text-[10px] tracking-[0.35em] uppercase text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Zakaži termin
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="/katalog"
            className="group inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pogledaj kolekciju
            <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
