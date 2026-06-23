'use client'

import Link from 'next/link'
import { useJezik } from '@/store/jezik'
import { t } from '@/messages'

export default function KorpaHeader() {
  const { jezik } = useJezik()
  const tr = t[jezik].korpa

  return (
    <div className="bg-[#1a1a1a] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-5 lg:px-10 py-10 lg:py-14">
        <nav
          className="flex items-center gap-2 mb-6 text-[8px] tracking-[0.25em] uppercase text-[#faf7f4]/30"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <Link href="/" className="hover:text-[#c9a96e]/70 transition-colors duration-200">{tr.breadcrumbPoc}</Link>
          <span>/</span>
          <Link href="/katalog" className="hover:text-[#c9a96e]/70 transition-colors duration-200">{tr.breadcrumbKat}</Link>
          <span>/</span>
          <span className="text-[#c9a96e]/60">{tr.breadcrumbKorpa}</span>
        </nav>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p
              className="text-[8px] tracking-[0.6em] uppercase text-[#c9a96e]/55 mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {tr.eyebrow}
            </p>
            <h1
              className="text-[clamp(38px,6vw,72px)] font-light italic text-[#faf7f4] leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {tr.naslov}
            </h1>
          </div>
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-[#c9a96e]/40 via-[#c9a96e]/15 to-transparent" />
      </div>
    </div>
  )
}
