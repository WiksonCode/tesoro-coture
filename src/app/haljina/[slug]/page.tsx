import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HaljinaDetalji from '@/components/haljine/HaljinaDetalji'
import type { Haljina } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('haljine')
    .select('naziv_sr, opis_sr, slike')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Haljina nije pronađena' }

  return {
    title: data.naziv_sr,
    description: data.opis_sr?.slice(0, 160),
    openGraph: {
      images: data.slike?.[0] ? [{ url: data.slike[0] }] : [],
    },
  }
}

export default async function HaljinaPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('haljine')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) notFound()

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <HaljinaDetalji haljina={data as Haljina} />
    </main>
  )
}
