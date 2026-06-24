import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL } from '@/lib/seo'

// Sitemap se generiše iz baze pri svakom zahtjevu (haljine se mijenjaju).
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticne: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/katalog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/o-nama`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/rezervacija`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/politika-privatnosti`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Javni, anonimni klijent — sitemap ne zahtijeva auth/cookies.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: haljine } = await supabase
    .from('haljine')
    .select('slug, updated_at')
    .or('arhivirana.eq.false,arhivirana.is.null')

  const haljineUrls: MetadataRoute.Sitemap = (haljine ?? []).map((h) => ({
    url: `${SITE_URL}/haljina/${h.slug}`,
    lastModified: h.updated_at ? new Date(h.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticne, ...haljineUrls]
}
