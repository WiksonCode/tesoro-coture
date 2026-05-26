import type { Metadata } from 'next'
import Link from 'next/link'
import RezervacijaClient from '@/components/rezervacija/RezervacijaClient'

export const metadata: Metadata = {
  title: 'Rezervacija',
  description: 'Rezervišite termin za probu i preuzimanje vaše haljine u salonu TESORO Couture.',
}

export default function RezervacijaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      {/* Editorial dark header */}
      <div className="bg-[#1a1a1a] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

          {/* Step indicator */}
          <div
            className="flex items-center gap-0 mb-7"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Link href="/korpa" className="group flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center border border-[#faf7f4]/20 text-[#faf7f4]/30 text-[8px] group-hover:border-[#c9a96e]/50 group-hover:text-[#c9a96e]/60 transition-all duration-200">
                1
              </span>
              <span className="text-[8.5px] tracking-[0.25em] uppercase text-[#faf7f4]/30 group-hover:text-[#c9a96e]/60 transition-colors duration-200">
                Korpa
              </span>
            </Link>
            <div className="mx-3 w-8 h-px bg-[#faf7f4]/15" />
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-[#c9a96e] text-[#1a1a1a] text-[8px]">
                2
              </span>
              <span className="text-[8.5px] tracking-[0.25em] uppercase text-[#c9a96e]">
                Rezervacija
              </span>
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-[clamp(38px,6vw,72px)] font-light italic text-[#faf7f4] leading-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Rezervacija
          </h1>

          <div className="mt-8 h-px bg-gradient-to-r from-[#c9a96e]/40 via-[#c9a96e]/15 to-transparent" />
        </div>
      </div>

      <RezervacijaClient />
    </main>
  )
}
