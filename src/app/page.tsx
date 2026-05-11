import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import FeaturedSection from '@/components/home/FeaturedSection'
import AboutSection from '@/components/home/AboutSection'
import CTASection from '@/components/home/CTASection'
import type { Haljina } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('haljine')
    .select('*')
    .eq('featured', true)
    .eq('dostupna', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const haljine = (data as Haljina[]) || []

  return (
    <main>
      <HeroSection />
      <FeaturedSection haljine={haljine} />
      <AboutSection />
      <CTASection />
    </main>
  )
}
