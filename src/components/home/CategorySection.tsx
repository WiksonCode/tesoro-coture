'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const KATEGORIJE = [
  {
    naziv: 'Kratke haljine',
    href: '/katalog?kategorija=kratke',
    opis: 'Sloboda pokreta',
    slika: '/kratka.jpeg',
  },
  {
    naziv: 'Midi haljine',
    href: '/katalog?kategorija=midi',
    opis: 'Savršena dužina',
    slika: '/midi.jpeg',
  },
  {
    naziv: 'Duge haljine',
    href: '/katalog?kategorija=duge',
    opis: 'Dramatičan izgled',
    slika: '/duga.jpeg',
  },
  {
    naziv: 'Snižene',
    href: '/katalog?naPopustu=true',
    opis: 'Povoljne cene',
    slika: '/snizena.jpeg',
  },
]

export default function CategorySection() {
  return (
    <section className="py-16 lg:py-20 px-6 lg:px-10 bg-[#faf7f4]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Po kategoriji
            </p>
            <h2
              className="text-[clamp(24px,3.5vw,40px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Pronađi svoju <span className="italic">savršenu haljinu</span>
            </h2>
          </div>
        </motion.div>

        {/* Grid kategorija */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {KATEGORIJE.map((kat, i) => (
            <motion.div
              key={kat.naziv}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={kat.href}
                className="group block relative overflow-hidden bg-[#1a1a1a]"
                style={{ aspectRatio: '3/4' }}
              >
                {/* Slika */}
                <Image
                  src={kat.slika}
                  alt={kat.naziv}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center opacity-80 group-hover:opacity-70 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Tekst */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-[clamp(18px,2.5vw,26px)] font-light text-white leading-none"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {kat.naziv}
                    </h3>
                    <ArrowRight
                      size={14}
                      className="text-white/50 group-hover:text-[#c9a96e] group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
