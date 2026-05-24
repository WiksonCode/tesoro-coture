import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import MarqueeStrip from '@/components/home/MarqueeStrip'
import CategorySection from '@/components/home/CategorySection'
import FeaturedSection from '@/components/home/FeaturedSection'
import StatsStrip from '@/components/home/StatsStrip'
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
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <MarqueeStrip />
      <FeaturedSection haljine={haljine} />
      <StatsStrip />
      <CategorySection />
      <AboutSection />
      <CTASection />
    </main>
  )
}
