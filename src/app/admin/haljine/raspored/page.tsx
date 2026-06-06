import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RasporedClient from './RasporedClient'
import type { Haljina } from '@/types'

export default async function RasporedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', user.id).single()
  if (profil?.uloga !== 'admin') redirect('/')

  const { data } = await supabase
    .from('haljine')
    .select('id, slug, naziv_sr, slike, redoslijed, arhivirana, created_at')
    .eq('arhivirana', false)
    .order('redoslijed', { ascending: true })
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
          Raspored u katalogu
        </h1>
      </div>

      <RasporedClient haljine={haljine} />
    </div>
  )
}
