import type { Metadata } from 'next'
import KorpaClient from '@/components/korpa/KorpaClient'

export const metadata: Metadata = {
  title: 'Korpa',
  description: 'Pregledajte artiklе u vašoj korpi i nastavite na rezervaciju termina.',
}

export default function KorpaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <div className="border-b border-[#e8e0d8]">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            TESORO Couture
          </p>
        </div>
      </div>

      <KorpaClient />
    </main>
  )
}
