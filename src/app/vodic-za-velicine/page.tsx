import type { Metadata } from 'next'
import VodicKalkulator from '@/components/haljine/VodicKalkulator'

export const metadata: Metadata = {
  title: 'Vodič za veličine',
  description: 'Unesite vaše mere i odmah saznajte koja veličina haljine vam odgovara. Interaktivni vodič sa ilustracijom.',
}

export default function VodicZaVelicinePage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      {/* Header */}
      <div className="border-b border-[#e8e0d8]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pomoć pri odabiru
          </p>
          <h1
            className="text-[clamp(34px,5vw,56px)] font-light text-[#1a1a1a] leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Vodič za veličine
          </h1>
          <p
            className="mt-4 text-[13px] text-[#8a8a8a] max-w-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Unesite vaše mere u polja ispod — ilustracija pokazuje tačno gde meriti, a sistem odmah preporučuje vašu veličinu.
          </p>
        </div>
      </div>

      <VodicKalkulator />
    </main>
  )
}
