'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import type { Haljina } from '@/types'

const ITEMS_PER_PAGE = 4

interface AboutSectionProps {
  haljine: Haljina[]
}

export default function AboutSection({ haljine }: AboutSectionProps) {
  if (!haljine.length) return null

  const totalPages = Math.ceil(haljine.length / ITEMS_PER_PAGE)
  const [page, setPage] = useState(0)

  function navigate(newPage: number) {
    setPage(newPage)
  }

  function prev() {
    setPage((p) => (p - 1 + totalPages) % totalPages)
  }

  function next() {
    setPage((p) => (p + 1) % totalPages)
  }

  const pages = Array.from({ length: totalPages }, (_, i) =>
    haljine.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
  )

  return (
    <section className="py-14 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Kolekcija
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2
                className="text-[clamp(32px,4.5vw,56px)] font-light text-[#1a1a1a] leading-[1.05]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <span className="italic">Izdvajamo</span>
              </h2>
              <div className="mt-4 flex items-center gap-4">
                <span className="w-8 h-px bg-[#c9a96e] shrink-0" />
                <p
                  className="text-[10px] tracking-[0.35em] uppercase text-[#8a8a8a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Trenutno najprodavanije
                </p>
              </div>
            </div>

            <Link
              href="/katalog"
              className="group hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-300 border-b border-[#e8e0d8] hover:border-[#c9a96e] pb-1 shrink-0 self-end"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pogledaj celu kolekciju
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* Track slider — sve stranice su uvijek renderirane, samo se track pomiče */}
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${(page * 100) / totalPages}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${totalPages * 100}%` }}
          >
            {pages.map((pageItems, pageIdx) => (
              <div
                key={pageIdx}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 flex-shrink-0"
                style={{ width: `${100 / totalPages}%` }}
              >
                {pageItems.map((haljina) => (
                  <HaljinaCard key={haljina.id} haljina={haljina} />
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigacija: strelice + tačkice */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              onClick={prev}
              aria-label="Prethodna stranica"
              className="w-9 h-9 border border-[#e8e0d8] flex items-center justify-center hover:border-[#c9a96e] transition-colors duration-300 cursor-pointer shrink-0"
            >
              <ChevronLeft size={15} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  aria-label={`Stranica ${i + 1}`}
                  className="cursor-pointer flex items-center justify-center"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === page
                        ? 'w-5 h-1.5 bg-[#c9a96e]'
                        : 'w-1.5 h-1.5 bg-[#d8d0c8] hover:bg-[#c9a96e]/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Sledeća stranica"
              className="w-9 h-9 border border-[#e8e0d8] flex items-center justify-center hover:border-[#c9a96e] transition-colors duration-300 cursor-pointer shrink-0"
            >
              <ChevronRight size={15} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </button>
          </div>
        )}

        {/* Mobile CTA */}
        <div className="sm:hidden mt-10 text-center">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] border-b border-[#e8e0d8] pb-1"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pogledaj celu kolekciju
            <ArrowRight size={10} />
          </Link>
        </div>

      </div>
    </section>
  )
}
