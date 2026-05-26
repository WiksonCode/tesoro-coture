import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Shield, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProfilRow = { id: string; ime: string; prezime: string; telefon: string | null; uloga: string; created_at: string }

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

  const sviKorisnici = (korisnici as ProfilRow[]) ?? []
  const adminCount = sviKorisnici.filter((k) => k.uloga === 'admin').length

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] tracking-[0.45em] uppercase text-[#c9a96e] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
            Upravljanje
          </p>
          <h1 className="text-[24px] sm:text-[28px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            Korisnici
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[24px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            {sviKorisnici.length}
          </p>
          <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {adminCount} admin{adminCount !== 1 ? 'a' : ''}
          </p>
        </div>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden bg-white border border-[#e8e0d8] divide-y divide-[#e8e0d8]">
        {sviKorisnici.length === 0 ? (
          <p className="px-4 py-10 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            Nema korisnika
          </p>
        ) : (
          sviKorisnici.map((k) => {
            const initials = `${k.ime?.[0] ?? ''}${k.prezime?.[0] ?? ''}`.toUpperCase() || '?'
            const isAdmin = k.uloga === 'admin'
            return (
              <div key={k.id} className="flex items-center gap-3 px-4 py-4">
                <div className={cn(
                  'w-9 h-9 flex items-center justify-center shrink-0 text-[12px] font-light',
                  isAdmin ? 'bg-[#c9a96e]/20 text-[#8a6630]' : 'bg-[#f0ebe5] text-[#8a8a8a]'
                )} style={{ fontFamily: 'var(--font-serif)' }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] text-[#1a1a1a] font-light truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                      {k.ime && k.prezime ? `${k.ime} ${k.prezime}` : '(bez imena)'}
                    </p>
                    {isAdmin && (
                      <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 bg-[#c9a96e]/15 text-[#8a6630]">
                        <Shield size={8} strokeWidth={1.5} />
                        <span className="text-[8px] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>Admin</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {k.telefon || '—'} · {formatDatum(k.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Desktop table (≥ md) ── */}
      <div className="hidden md:block bg-white border border-[#e8e0d8]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e0d8]">
                {['Korisnik', 'Telefon', 'Uloga', 'Registrovan'].map((col) => (
                  <th
                    key={col}
                    className="text-left px-6 py-3 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d8]">
              {sviKorisnici.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    Nema korisnika
                  </td>
                </tr>
              ) : (
                sviKorisnici.map((k) => {
                  const initials = `${k.ime?.[0] ?? ''}${k.prezime?.[0] ?? ''}`.toUpperCase() || '?'
                  return (
                    <tr key={k.id} className="hover:bg-[#faf7f4] transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 flex items-center justify-center shrink-0 text-[11px] font-light',
                            k.uloga === 'admin' ? 'bg-[#c9a96e]/20 text-[#8a6630]' : 'bg-[#f0ebe5] text-[#8a8a8a]'
                          )} style={{ fontFamily: 'var(--font-serif)' }}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                              {k.ime && k.prezime ? `${k.ime} ${k.prezime}` : '(bez imena)'}
                            </p>
                            <p className="text-[10px] text-[#8a8a8a] font-mono">{k.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {k.telefon || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          {k.uloga === 'admin'
                            ? <Shield size={11} strokeWidth={1.5} className="text-[#c9a96e]" />
                            : <User size={11} strokeWidth={1.5} className="text-[#8a8a8a]" />
                          }
                          <span
                            className={cn('text-[11px] tracking-[0.2em] uppercase', k.uloga === 'admin' ? 'text-[#c9a96e]' : 'text-[#8a8a8a]')}
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {k.uloga}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {formatDatum(k.created_at)}
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
