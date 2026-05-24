'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="py-14 lg:py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Tekst */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              O salonu
            </p>

            <h2
              className="text-[clamp(32px,4vw,52px)] font-light text-[#1a1a1a] leading-[1.1] mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Više od haljine —<br />
              <span className="italic">iskustvo koje pamtite</span>
            </h2>

            <div className="w-10 h-px bg-[#c9a96e] mb-8" />

            <p
              className="text-sm text-[#8a8a8a] leading-relaxed mb-5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              TESORO Couture je beogradski salon koji veruje da svaka žena zaslužuje haljinu koja je čini neponovljivom. Naša kolekcija obuhvata venčane, koktel, svečane i maturske kreacije.
            </p>
            <p
              className="text-sm text-[#8a8a8a] leading-relaxed mb-10"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Svaka poseta salonu je individualni doživljaj. Naš tim vam pomaže da pronađete savršenu haljinu — po meri ili iz naše ekskluzivne kolekcije.
            </p>

            <Link
              href="/o-nama"
              className="group inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300 border-b border-[#1a1a1a] hover:border-[#c9a96e] pb-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Saznaj više
              <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Slika */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="relative aspect-[3/2] sm:aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&fit=crop&auto=format"
                alt="TESORO Couture salon — elegantna haljina"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#c9a96e]" />
              <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#c9a96e]" />
              <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#c9a96e]" />
              <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#c9a96e]" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] px-8 py-6 hidden lg:block">
              <p
                className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Od
              </p>
              <p
                className="text-2xl font-light text-[#faf7f4] italic"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                2018. godine
              </p>
              <p
                className="text-[9px] tracking-wide text-[#faf7f4]/40 mt-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                u srcu Beograda
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
