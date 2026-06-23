'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useJezik } from '@/store/jezik'
import { t } from '@/messages'

interface KatalogHeaderProps {
  kategorija?: string
}

export default function KatalogHeader({ kategorija }: KatalogHeaderProps) {
  const { jezik } = useJezik()
  const tr = t[jezik].katalog.header

  const naslov = kategorija
    ? (tr.kategorijeNazivi[kategorija as keyof typeof tr.kategorijeNazivi] ?? tr.defaultTitle)
    : tr.defaultTitle
  const opis = kategorija
    ? (tr.kategorijeOpisi[kategorija as keyof typeof tr.kategorijeOpisi] ?? null)
    : null

  return (
    <div className="relative h-[220px] lg:h-[320px] overflow-hidden bg-[#1a1a1a]">
      <Image src="/hero-bg.png" alt={naslov} fill priority sizes="100vw" className="object-cover object-[center_30%] animate-ken-burns" />
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-between max-w-7xl mx-auto px-6 lg:px-10 py-5 lg:py-7">
        <nav>
          <ol className="flex items-center gap-2 text-[8px] tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: 'var(--font-sans)' }}>
            <li><Link href="/" className="hover:text-white/70 transition-colors duration-200">{tr.pocetak}</Link></li>
            <li>/</li>
            <li>
              <Link href="/katalog" className={kategorija ? 'hover:text-white/70 transition-colors duration-200' : 'text-white/70'}>
                {tr.kolekcija}
              </Link>
            </li>
            {kategorija && (
              <>
                <li>/</li>
                <li className="text-white/70">{tr.kategorijeNazivi[kategorija as keyof typeof tr.kategorijeNazivi]}</li>
              </>
            )}
          </ol>
        </nav>

        <div className="text-center pb-2">
          <p className="text-[9px] tracking-[0.6em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            {tr.eyebrow}
          </p>
          <h1 className="text-[clamp(38px,7vw,80px)] font-light text-white leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            {naslov}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="block w-10 h-px bg-[#c9a96e]/60" />
            <span className="block w-1.5 h-1.5 rounded-full bg-[#c9a96e]/60" />
            <span className="block w-10 h-px bg-[#c9a96e]/60" />
          </div>
          {opis && (
            <p className="text-[11px] tracking-wide text-white/50 mt-3 hidden lg:block" style={{ fontFamily: 'var(--font-sans)' }}>
              {opis}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
