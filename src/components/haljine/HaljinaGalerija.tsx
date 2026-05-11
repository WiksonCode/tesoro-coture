'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HaljinaGalerijaProps {
  slike: string[]
  naziv: string
}

export default function HaljinaGalerija({ slike, naziv }: HaljinaGalerijaProps) {
  const [aktivna, setAktivna] = useState(0)

  if (!slike || slike.length === 0) {
    return (
      <div className="relative bg-[#f0ebe5] flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
        <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#c9a96e]/40" />
        <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#c9a96e]/40" />
        <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#c9a96e]/40" />
        <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#c9a96e]/40" />
        <span
          className="text-[120px] font-light italic text-[#1a1a1a]/10 leading-none"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          T
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden bg-[#f0ebe5]" style={{ aspectRatio: '3/4' }}>
        <Image
          src={slike[aktivna]}
          alt={`${naziv} — slika ${aktivna + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Thumbnails */}
      {slike.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slike.map((slika, i) => (
            <button
              key={i}
              onClick={() => setAktivna(i)}
              className={cn(
                'relative shrink-0 overflow-hidden transition-all duration-200',
                aktivna === i
                  ? 'ring-1 ring-[#c9a96e] opacity-100'
                  : 'opacity-50 hover:opacity-80'
              )}
              style={{ width: 64, height: 86 }}
            >
              <Image
                src={slika}
                alt={`${naziv} — thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
