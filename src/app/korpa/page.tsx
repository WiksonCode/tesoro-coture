import type { Metadata } from 'next'
import Link from 'next/link'
import KorpaClient from '@/components/korpa/KorpaClient'

export const metadata: Metadata = {
  title: 'Korpa — TESORO Couture',
  description: 'Pregledajte artikle u vašoj korpi i nastavite na rezervaciju termina.',
}

export default function KorpaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      {/* ── Editorial dark header ── */}
      <div className="bg-[#1a1a1a] relative overflow-hidden">
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 lg:px-10 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 mb-6 text-[8px] tracking-[0.25em] uppercase text-[#faf7f4]/30"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Link href="/" className="hover:text-[#c9a96e]/70 transition-colors duration-200">Početna</Link>
            <span>/</span>
            <Link href="/katalog" className="hover:text-[#c9a96e]/70 transition-colors duration-200">Katalog</Link>
            <span>/</span>
            <span className="text-[#c9a96e]/60">Korpa</span>
          </nav>

          {/* Main heading */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <p
                className="text-[8px] tracking-[0.6em] uppercase text-[#c9a96e]/55 mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Selekcija
              </p>
              <h1
                className="text-[clamp(38px,6vw,72px)] font-light italic text-[#faf7f4] leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Vaša korpa
              </h1>
            </div>

          </div>

          {/* Bottom accent line */}
          <div className="mt-8 h-px bg-gradient-to-r from-[#c9a96e]/40 via-[#c9a96e]/15 to-transparent" />
        </div>
      </div>

      <KorpaClient />
    </main>
  )
}
