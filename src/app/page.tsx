import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import MarqueeStrip from '@/components/home/MarqueeStrip'
import CategorySection from '@/components/home/CategorySection'
import AboutSection from '@/components/home/AboutSection'
import CTASection from '@/components/home/CTASection'
import type { Haljina } from '@/types'

export const metadata: Metadata = {
  title: 'Početna | TESORO Couture',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredData } = await supabase
    .from('haljine')
    .select('id, slug, naziv_sr, naziv_en, slike, video_url, featured, created_at, redoslijed, featured_redoslijed, kategorija_id, kategorija:kategorije(id, slug, naziv_sr, naziv_en, redosled), inventar(id, sifra, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, slike, dostupna, arhivirana)')
    .eq('arhivirana', false)
    .eq('featured', true)
    .order('featured_redoslijed', { ascending: true })
    .limit(12)

  let haljine = (featuredData as unknown as Haljina[]) || []

  if (!haljine.length) {
    const { data: fallback } = await supabase
      .from('haljine')
      .select('id, slug, naziv_sr, naziv_en, slike, video_url, featured, created_at, redoslijed, kategorija_id, kategorija:kategorije(id, slug, naziv_sr, naziv_en, redosled), inventar(id, sifra, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, slike, dostupna, arhivirana)')
      .eq('arhivirana', false)
      .order('redoslijed', { ascending: false })
      .limit(12)
    haljine = (fallback as unknown as Haljina[]) || []
  }

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <MarqueeStrip />
      <AboutSection haljine={haljine} />
      <CategorySection />
      <CTASection />
    </main>
  )
}
