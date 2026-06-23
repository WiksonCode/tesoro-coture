import type { Metadata } from 'next'
import RezervacijaClient from '@/components/rezervacija/RezervacijaClient'
import RezervacijaHeader from '@/components/rezervacija/RezervacijaHeader'

export const metadata: Metadata = {
  title: 'Rezervacija',
  description: 'Rezervišite termin za probu i preuzimanje vaše haljine u salonu TESORO Couture.',
}

export default function RezervacijaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <RezervacijaHeader />
      <RezervacijaClient />
    </main>
  )
}
