'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import type { Haljina } from '@/types'

interface FeaturedSectionProps {
  haljine: Haljina[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function FeaturedSection({ haljine }: FeaturedSectionProps) {
  if (!haljine.length) return null

  return (
    <section className="py-24 lg:py-32 px-6 bg-[#faf7f4]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Istaknuta kolekcija
            </p>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Odabrane haljine<br />
              <span className="italic">za posebne trenutke</span>
            </h2>
          </div>

          <Link
            href="/katalog"
            className="group hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-300 border-b border-[#e8e0d8] hover:border-[#c9a96e] pb-1 shrink-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Ceo katalog
            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {haljine.map((haljina) => (
            <motion.div key={haljina.id} variants={itemVariants}>
              <HaljinaCard haljina={haljina} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="sm:hidden mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] border-b border-[#e8e0d8] pb-1"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Ceo katalog
            <ArrowRight size={10} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
