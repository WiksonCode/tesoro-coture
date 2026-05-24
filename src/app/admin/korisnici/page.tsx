import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Shield, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profil } from '@/types'

export const metadata: Metadata = { title: 'Korisnici' }

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function KorisniciPage() {
  const supabase = await createClient()

  const { data: korisnici } = await supabase
    .from('profiles')
    .select('id, ime, prezime, telefon, uloga, created_at')
    .order('created_at', { ascending: false })

  const profili = (korisnici as Profil[]) ?? []
  const adminCount = profili.filter((p) => p.uloga === 'admin').length

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Upravljanje
          </p>
          <h1 className="text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Korisnici
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[24px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            {profili.length}
          </p>
          <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {adminCount} admin{adminCount !== 1 ? 'a' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e8e0d8]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e0d8]">
                {['Korisnik', 'Telefon', 'Uloga', 'Registrovan'].map((col) => (
                  <th
                    key={col}
                    className="text-left px-6 py-3 text-[8px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d8]">
              {profili.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    Nema korisnika
                  </td>
                </tr>
              ) : (
                profili.map((p) => {
                  const initials = `${p.ime?.[0] ?? ''}${p.prezime?.[0] ?? ''}`.toUpperCase() || '?'
                  return (
                    <tr key={p.id} className="hover:bg-[#faf7f4] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 flex items-center justify-center shrink-0 text-[11px] font-light',
                            p.uloga === 'admin' ? 'bg-[#c9a96e]/20 text-[#8a6630]' : 'bg-[#f0ebe5] text-[#8a8a8a]'
                          )} style={{ fontFamily: 'var(--font-serif)' }}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                              {p.ime && p.prezime ? `${p.ime} ${p.prezime}` : '(bez imena)'}
                            </p>
                            <p className="text-[10px] text-[#8a8a8a] font-mono">{p.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {p.telefon || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          {p.uloga === 'admin'
                            ? <Shield size={11} strokeWidth={1.5} className="text-[#c9a96e]" />
                            : <User size={11} strokeWidth={1.5} className="text-[#8a8a8a]" />
                          }
                          <span
                            className={cn('text-[9px] tracking-[0.2em] uppercase', p.uloga === 'admin' ? 'text-[#c9a96e]' : 'text-[#8a8a8a]')}
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {p.uloga}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {formatDatum(p.created_at)}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
