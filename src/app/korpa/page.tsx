import type { Metadata } from 'next'
import KorpaClient from '@/components/korpa/KorpaClient'
import KorpaHeader from '@/components/korpa/KorpaHeader'

export const metadata: Metadata = {
  title: 'Korpa — TESORO Couture',
  description: 'Pregledajte artikle u vašoj korpi i nastavite na rezervaciju termina.',
}

export default function KorpaPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <KorpaHeader />
      <KorpaClient />
    </main>
  )
}
