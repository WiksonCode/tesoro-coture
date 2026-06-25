import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import RasporedClient from '../raspored/RasporedClient'
import { updateFeaturedRedoslijed } from '@/app/actions/admin'
import type { Haljina } from '@/types'

export default async function RasporedPocetnaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', user.id).single()
  if (profil?.uloga !== 'admin') redirect('/')

  const { data } = await supabase
    .from('haljine')
    .select('id, slug, naziv_sr, slike, featured_redoslijed, featured, arhivirana, created_at')
    .eq('arhivirana', false)
    .eq('featured', true)
    .order('featured_redoslijed', { ascending: true })
    .order('created_at', { ascending: false })

  const haljine = (data ?? []) as unknown as Haljina[]

  return (
    <div className="p-6 lg:p-10 max-w-[1400px]">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/haljine"
          className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={12} />
          Haljine
        </Link>
        <span className="text-[#e8e0d8]">/</span>
        <h1
          className="text-[11px] tracking-[0.3em] uppercase text-[#1a1a1a]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Raspored na početnoj
        </h1>
      </div>

      {haljine.length === 0 ? (
        <div className="border border-[#e8e0d8] bg-white p-10 text-center">
          <Star size={22} strokeWidth={1.5} className="mx-auto mb-4 text-[#c9a96e]" />
          <p className="text-[13px] text-[#1a1a1a] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Nema istaknutih haljina
          </p>
          <p className="text-[11px] text-[#8a8a8a] max-w-md mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Klikni na zvjezdicu pored haljine u listi da je dodaš na početnu stranicu, pa se vrati ovdje da podesiš redoslijed.
          </p>
        </div>
      ) : (
        <RasporedClient
          haljine={haljine}
          saveAction={updateFeaturedRedoslijed}
          helpText="Vuci haljine da promijeniš redoslijed u slideru na početnoj. Broj u uglu pokazuje poziciju (1 = prva)."
        />
      )}
    </div>
  )
}
