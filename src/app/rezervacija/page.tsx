import type { Metadata } from 'next'
import RezervacijaClient from '@/components/rezervacija/RezervacijaClient'

export const metadata: Metadata = {
  title: 'Rezervacija',
  description: 'Rezervišite termin za probu i preuzimanje vaše haljine u salonu TESORO Couture.',
}

export default function RezervacijaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <div className="border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            TESORO Couture · Beograd
          </p>
        </div>
      </div>

      <RezervacijaClient />
    </main>
  )
}
