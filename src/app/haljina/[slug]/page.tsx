import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HaljinaDetalji from '@/components/haljine/HaljinaDetalji'
import SrodneHaljine from '@/components/haljine/SrodneHaljine'
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

  const haljina = data as Haljina

  const { data: srodneData } = await supabase
    .from('haljine')
    .select('*')
    .eq('dostupna', true)
    .eq('kategorija', haljina.kategorija)
    .neq('id', haljina.id)
    .order('created_at', { ascending: false })
    .limit(4)

  let srodneHaljine = (srodneData as Haljina[]) || []

  if (srodneHaljine.length === 0) {
    const { data: ostalePodaci } = await supabase
      .from('haljine')
      .select('*')
      .eq('dostupna', true)
      .neq('id', haljina.id)
      .order('created_at', { ascending: false })
      .limit(4)
    srodneHaljine = (ostalePodaci as Haljina[]) || []
  }

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      <HaljinaDetalji haljina={haljina} />
      <SrodneHaljine
        haljine={srodneHaljine}
        kategorija={haljina.kategorija}
        istaKategorija={srodneData != null && (srodneData as Haljina[]).length > 0}
      />
    </main>
  )
}
