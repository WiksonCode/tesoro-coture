'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Haljina } from '@/types'

interface HaljinaCardProps {
  haljina: Haljina
  className?: string
}

export function formatCijena(cijena: number): string {
  return new Intl.NumberFormat('sr-Latn-RS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cijena) + ' RSD'
}

export default function HaljinaCard({ haljina, className }: HaljinaCardProps) {
  const slika = haljina.slike?.[0]
  const cijena = haljina.na_popustu
    ? haljina.cijena_rsd * (1 - haljina.popust_procenat / 100)
    : haljina.cijena_rsd

  return (
    <Link href={`/haljina/${haljina.slug}`} className={cn('group block', className)}>
      {/* Image container — 3:4 aspect ratio */}
      <div className="relative overflow-hidden bg-[#f0ebe5]" style={{ aspectRatio: '3/4' }}>

        {slika ? (
          <Image
            src={slika}
            alt={haljina.naziv_sr}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#c9a96e]/40" />
            <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#c9a96e]/40" />
            <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#c9a96e]/40" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#c9a96e]/40" />
            <span
              className="text-[70px] font-light italic text-[#1a1a1a]/10 leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              T
            </span>
          </div>
        )}

        {/* Discount badge */}
        {haljina.na_popustu && haljina.popust_procenat > 0 && (
          <div className="absolute top-3 left-3 bg-[#1a1a1a] px-2 py-1">
            <span
              className="text-[8px] tracking-[0.2em] uppercase text-[#c9a96e]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              -{haljina.popust_procenat}%
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/30 transition-all duration-500 flex items-end justify-center pb-8">
          <motion.div
            className="flex items-center gap-2 bg-[#faf7f4] px-6 py-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400"
          >
            <Eye size={12} strokeWidth={1.5} className="text-[#1a1a1a]" />
            <span
              className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pogledaj
            </span>
          </motion.div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h3
          className="text-base font-light text-[#1a1a1a] leading-tight mb-1 group-hover:text-[#c9a96e] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {haljina.naziv_sr}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] tracking-wide text-[#8a8a8a]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {formatCijena(cijena)}
          </span>
          {haljina.na_popustu && (
            <span
              className="text-[10px] line-through text-[#8a8a8a]/50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {formatCijena(haljina.cijena_rsd)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
