'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import type { Haljina } from '@/types'

interface AboutSectionProps {
  haljine: Haljina[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function AboutSection({ haljine }: AboutSectionProps) {
  if (!haljine.length) return null

  return (
    <section className="py-14 lg:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kolekcija
            </p>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Pronađi svoju<br />
              <span className="italic">savršenu haljinu</span>
            </h2>
          </div>

          <Link
            href="/katalog"
            className="group hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-300 border-b border-[#e8e0d8] hover:border-[#c9a96e] pb-1 shrink-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pogledaj celu kolekciju
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
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/katalog"
            className="group inline-flex items-center gap-3 border border-[#1a1a1a] px-10 py-4 text-[10px] tracking-[0.35em] uppercase text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-500"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pogledaj celu kolekciju
            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
