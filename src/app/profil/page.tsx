import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, CalendarDays, Package, Settings } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import type { Korisnik } from '@/types'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Moj profil',
  description: 'Upravljajte vašim TESORO Couture nalogom i rezervacijama.',
}

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  na_cekanju:  { label: 'Na čekanju',  classes: 'bg-[#c9a96e]/15 text-[#8a6630]' },
  potvrdjena:  { label: 'Potvrđena',   classes: 'bg-green-50 text-green-700' },
  otkazana:    { label: 'Otkazana',    classes: 'bg-red-50 text-red-600' },
  realizovana: { label: 'Realizovana', classes: 'bg-[#1a1a1a]/8 text-[#1a1a1a]' },
}

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

type RezervacijaSaInventarom = {
  id: string
  status: string
  datum_termina: string | null
  created_at: string
  inventar: {
    boja_naziv: string
    velicina: string
    cijena_rsd: number
    na_akciji: boolean
    cijena_akcija_rsd: number | null
    haljina: { naziv_sr: string; slike: string[] } | null
  } | null
}

export default async function ProfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: korisnik }, { data: rezervacije }] = await Promise.all([
    supabase.from('korisnici').select('*').eq('auth_id', user.id).single(),
    supabase
      .from('rezervacije')
      .select('id, status, datum_termina, created_at, inventar:inventar(boja_naziv, velicina, cijena_rsd, na_akciji, cijena_akcija_rsd, haljina:haljine(naziv_sr, slike))')
      .order('created_at', { ascending: false }),
  ])

  const k = korisnik as Korisnik | null
  const rez = (rezervacije as unknown as RezervacijaSaInventarom[]) ?? []
  const initials = k
    ? `${k.ime?.[0] ?? ''}${k.prezime?.[0] ?? ''}`.toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? '?'

  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      <div className="border-b border-[#e8e0d8] bg-[#faf7f4]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
            Moj nalog
          </p>
          <h1 className="text-[clamp(28px,4vw,44px)] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
            {k ? `${k.ime} ${k.prezime}` : user.email}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">

          <aside className="space-y-4">
            <div className="border border-[#e8e0d8] bg-white p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center shrink-0">
                  <span className="text-[16px] font-light text-[#c9a96e]" style={{ fontFamily: 'var(--font-serif)' }}>
                    {initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-light text-[#1a1a1a] truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                    {k ? `${k.ime} ${k.prezime}` : 'Korisnik'}
                  </p>
                  <p className="text-[10px] text-[#8a8a8a] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#e8e0d8] pt-5">
                {k?.telefon && (
                  <div>
                    <p className="text-[8px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                      Telefon
                    </p>
                    <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {k.telefon}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[8px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                    Član od
                  </p>
                  <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {formatDatum(user.created_at)}
                  </p>
                </div>
                {k?.uloga === 'admin' && (
                  <div className="pt-1">
                    <span className="inline-block px-2 py-1 bg-[#c9a96e]/15 text-[#8a6630] text-[8px] tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
                      Admin
                    </span>
                  </div>
                )}
              </div>
            </div>

            {k?.uloga === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 border border-[#e8e0d8] bg-white px-4 py-3.5 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 group"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <Settings size={13} strokeWidth={1.5} className="shrink-0" />
                Admin panel
              </Link>
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 border border-[#e8e0d8] bg-white px-4 py-3.5 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:border-red-300 hover:text-red-500 transition-all duration-200 cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <LogOut size={13} strokeWidth={1.5} className="shrink-0" />
                Odjava
              </button>
            </form>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  Moje rezervacije
                </p>
                <h2 className="text-[22px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Historija termina
                </h2>
              </div>
              {rez.length > 0 && (
                <span className="text-[#8a8a8a] text-[12px]" style={{ fontFamily: 'var(--font-sans)' }}>
                  {rez.length} {rez.length === 1 ? 'rezervacija' : 'rezervacije'}
                </span>
              )}
            </div>

            {rez.length === 0 ? (
              <div className="border border-[#e8e0d8] bg-white px-8 py-16 text-center">
                <div className="flex justify-center mb-4">
                  <Package size={28} strokeWidth={1} className="text-[#e8e0d8]" />
                </div>
                <p className="text-[16px] font-light italic text-[#8a8a8a] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  Još nema rezervacija
                </p>
                <p className="text-[12px] text-[#8a8a8a] mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                  Pronađite haljinu koja vam se sviđa i rezervišite termin.
                </p>
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] border-b border-[#e8e0d8] pb-0.5 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Idi na katalog
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {rez.map((r) => {
                  const status = STATUS_LABELS[r.status] ?? { label: r.status, classes: 'bg-gray-50 text-gray-600' }
                  const slika = r.inventar?.haljina?.slike?.[0]

                  return (
                    <div
                      key={r.id}
                      className="border border-[#e8e0d8] bg-white flex gap-5 p-5 hover:border-[#1a1a1a]/20 transition-colors duration-200"
                    >
                      <div className="w-16 h-20 shrink-0 bg-[#f0ebe5] overflow-hidden">
                        {slika ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slika} alt={r.inventar?.haljina?.naziv_sr ?? ''} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[28px] font-light italic text-[#1a1a1a]/10" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-[15px] font-light text-[#1a1a1a] leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                            {r.inventar?.haljina?.naziv_sr ?? 'Haljina'}
                          </h3>
                          <span
                            className={cn('shrink-0 px-2.5 py-1 text-[8px] tracking-[0.25em] uppercase', status.classes)}
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {status.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          {r.inventar?.velicina && (
                            <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                              Veličina: <span className="text-[#1a1a1a]">{r.inventar.velicina}</span>
                            </span>
                          )}
                          {r.inventar?.boja_naziv && (
                            <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                              Boja: <span className="text-[#1a1a1a]">{r.inventar.boja_naziv}</span>
                            </span>
                          )}
                          {r.datum_termina && (
                            <span className="text-[10px] text-[#8a8a8a] flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
                              <CalendarDays size={10} strokeWidth={1.5} />
                              <span className="text-[#1a1a1a]">{formatDatum(r.datum_termina)}</span>
                            </span>
                          )}
                        </div>
                        {r.inventar?.cijena_rsd != null && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[13px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                              {(r.inventar.na_akciji && r.inventar.cijena_akcija_rsd ? r.inventar.cijena_akcija_rsd : r.inventar.cijena_rsd).toLocaleString('sr-RS')}&nbsp;RSD
                            </span>
                            {r.inventar.na_akciji && r.inventar.cijena_akcija_rsd && (
                              <span className="text-[11px] line-through text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                                {r.inventar.cijena_rsd.toLocaleString('sr-RS')}&nbsp;RSD
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
