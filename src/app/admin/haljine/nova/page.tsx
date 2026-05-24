import type { Metadata } from 'next'
import HaljinaForma from '@/components/admin/HaljinaForma'

export const metadata: Metadata = { title: 'Nova haljina' }

export default function NovahaljinaPage() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Haljine
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          Nova haljina
        </h1>
      </div>
      <HaljinaForma />
    </div>
  )
}
