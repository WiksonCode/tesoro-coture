import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HaljinaForma from '@/components/admin/HaljinaForma'
import type { Haljina } from '@/types'

export const metadata: Metadata = { title: 'Uredi haljinu' }

export default async function EditHaljinaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: haljina }, { data: kategorije }] = await Promise.all([
    supabase.from('haljine').select('*').eq('id', id).single(),
    supabase.from('kategorije').select('*').order('redosled'),
  ])

  if (!haljina) notFound()

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          Haljine / Uredi
        </p>
        <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
          {(haljina as Haljina).naziv_sr}
        </h1>
      </div>
      <HaljinaForma haljina={haljina as Haljina} kategorije={kategorije ?? []} />
    </div>
  )
}
