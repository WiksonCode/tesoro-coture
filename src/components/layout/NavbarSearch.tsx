'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Haljina } from '@/types'

interface Props {
  isHero: boolean
  mobileInline?: boolean
}

const firstImage = (h: Haljina) =>
  Array.isArray(h.slike) ? h.slike[0] : null

function getMinCijena(h: Haljina): number | null {
  const prices = h.inventar?.filter(i => i.dostupna && !i.arhivirana).map(i => i.cijena_rsd) ?? []
  if (prices.length === 0) return null
  return Math.min(...prices)
}

function formatCijena(c: number) {
  return new Intl.NumberFormat('sr-RS').format(c) + ' RSD'
}

export default function NavbarSearch({ isHero, mobileInline = false }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Haljina[]>([])
  const [suggested, setSuggested] = useState<Haljina[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open || suggested.length > 0) return
    createClient()
      .from('haljine')
      .select('id, slug, naziv_sr, slike, kategorija:kategorije(slug, naziv_sr), inventar(cijena_rsd, dostupna)')
      .eq('arhivirana', false)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => setSuggested((data as unknown as Haljina[]) || []))
  }, [open, suggested.length])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setLoading(false); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const { data } = await createClient()
        .from('haljine')
        .select('id, slug, naziv_sr, slike, kategorija:kategorije(slug, naziv_sr), inventar(cijena_rsd, dostupna)')
        .eq('arhivirana', false)
        .ilike('naziv_sr', `%${query.trim()}%`)
        .limit(4)
      setResults((data as unknown as Haljina[]) || [])
      setLoading(false)
    }, 280)
    return () => clearTimeout(t)
  }, [query])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(query.trim())}`)
      close()
    }
  }

  // ─── Inline mobile Sheet variant ─────────────────────────────────────────
  if (mobileInline) {
    return (
      <div className="relative border-b border-[#e8e0d8] focus-within:border-[#c9a96e] transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Search size={14} strokeWidth={1.5} className="text-[#8a8a8a] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pretraži haljine..."
            className="flex-1 bg-transparent text-[11px] tracking-[0.15em] text-[#1a1a1a] placeholder:text-[#8a8a8a]/50 pb-3 pt-1 outline-none caret-[#c9a96e]"
            style={{ fontFamily: 'var(--font-sans)' }}
            autoComplete="off"
            spellCheck={false}
          />
          {loading && <span className="w-3 h-3 border border-[#e8e0d8] border-t-[#c9a96e] rounded-full animate-spin flex-shrink-0 mb-2" />}
        </div>
        {results.length > 0 && (
          <ul className="absolute left-0 right-0 top-full bg-white border border-[#e8e0d8] border-t-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-50 max-h-64 overflow-y-auto">
            {results.map((h) => (
              <li key={h.id}>
                <Link
                  href={`/haljina/${h.slug}`}
                  onClick={() => { setQuery(''); setResults([]) }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#faf7f4] transition-colors duration-150"
                >
                  <div className="w-7 h-9 flex-shrink-0 overflow-hidden bg-[#f0ebe5]">
                    {Array.isArray(h.slike) && h.slike[0]
                      ? <img src={h.slike[0]} alt={h.naziv_sr} className="w-full h-full object-cover" /> // eslint-disable-line
                      : <div className="w-full h-full bg-[#e8e0d8]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#1a1a1a] truncate" style={{ fontFamily: 'var(--font-serif)' }}>{h.naziv_sr}</p>
                    {getMinCijena(h) !== null && (
                      <p className="text-[10px] font-semibold text-[#c9a96e] mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>{formatCijena(getMinCijena(h)!)}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/katalog?q=${encodeURIComponent(query.trim())}`}
                onClick={() => { setQuery(''); setResults([]) }}
                className="flex items-center justify-between px-4 py-3 border-t border-[#e8e0d8] text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Svi rezultati <ArrowRight size={10} strokeWidth={1.5} />
              </Link>
            </li>
          </ul>
        )}
      </div>
    )
  }

  const isSearching = query.trim().length > 0
  const displayList = isSearching ? results : suggested
  const noResults = isSearching && !loading && results.length === 0

  // ─── Full-screen overlay ─────────────────────────────────────────────────
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Pretraži haljine"
        className={cn(
          'p-1.5 transition-colors duration-300 cursor-pointer',
          isHero ? 'text-white/80 hover:text-white' : 'text-[#1a1a1a] hover:text-[#c9a96e]'
        )}
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
          style={{ backgroundColor: 'rgba(14,13,13,0.97)' }}
        >
          {/* ── Top bar (shared) ───────────────────────────────────────── */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 lg:px-12 pt-6 pb-0">
            <span
              className="text-[8px] tracking-[0.55em] uppercase text-[#c9a96e]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Tesoro Couture — Pretraga
            </span>
            <button
              type="button"
              onClick={() => close()}
              aria-label="Zatvori pretragu"
              className="flex items-center gap-2.5 px-3 py-2 border border-white/15 hover:border-white/40 text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <span className="text-[9px] tracking-[0.3em] uppercase hidden sm:inline" style={{ fontFamily: 'var(--font-sans)' }}>
                Zatvori
              </span>
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* ════════════════════════════════════════════════════════════
              DESKTOP LAYOUT (lg+) — editorijalni input + horizontalne karte
          ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex flex-1 flex-col overflow-y-auto">

            {/* Input — centriran, max-w-2xl */}
            <div className="w-full max-w-2xl mx-auto px-6 pt-14">
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pretražite haljine..."
                  className="w-full bg-transparent text-white text-[clamp(28px,4.5vw,50px)] font-light pb-5 pr-12 outline-none placeholder:text-white/30 caret-[#c9a96e]"
                  style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/12" />
                <div
                  className="absolute bottom-0 left-0 h-px bg-[#c9a96e] transition-all duration-500 ease-out"
                  style={{ width: query ? '100%' : '0%' }}
                />
                {loading
                  ? <span className="absolute right-0 bottom-6 w-5 h-5 border border-white/15 border-t-[#c9a96e] rounded-full animate-spin" />
                  : <Search size={20} strokeWidth={1} className="absolute right-0 bottom-5 text-white/20 group-focus-within:text-[#c9a96e]/60 transition-colors duration-300" />
                }
              </div>
              <p className="text-[8px] tracking-[0.35em] text-white/25 mt-3 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
                Enter — pretraži &nbsp;·&nbsp; Esc — zatvori
              </p>
            </div>

            {/* Haljine — horizontalni red, pune slike */}
            {!noResults && displayList.length > 0 && (
              <div className="mt-10 flex flex-col animate-fade-up">

                {/* Section label */}
                <div className="mb-5 flex items-center justify-between" style={{ padding: '0 clamp(24px, 4vw, 80px)' }}>
                  <p className="text-[9px] tracking-[0.5em] uppercase text-white/65" style={{ fontFamily: 'var(--font-sans)' }}>
                    {isSearching ? 'Rezultati' : 'Preporučujemo'}
                    {isSearching && results.length > 0 && (
                      <span className="ml-3 text-[#c9a96e]">{results.length} {results.length === 1 ? 'rezultat' : 'rezultata'}</span>
                    )}
                  </p>
                  <Link
                    href={isSearching ? `/katalog?q=${encodeURIComponent(query.trim())}` : '/katalog'}
                    onClick={close}
                    className="flex items-center gap-1.5 text-[9px] tracking-[0.35em] uppercase text-white/55 hover:text-[#c9a96e] transition-colors duration-200 cursor-pointer group"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {isSearching ? 'Svi rezultati' : 'Cela kolekcija'}
                    <ArrowRight size={9} strokeWidth={1.5} className="group-hover:text-[#c9a96e] transition-colors" />
                  </Link>
                </div>

                {/* Grid kartica — uvijek 4 kolone, sve skalira sa vw */}
                <div style={{ padding: '0 clamp(24px, 4vw, 80px)' }}>
                  <ul style={{ gap: 'clamp(12px, 1.5vw, 24px)', paddingBottom: '2rem' }} className="grid grid-cols-4">
                    {displayList.map((h) => {
                      const img1 = Array.isArray(h.slike) ? h.slike[0] : null
                      const img2 = Array.isArray(h.slike) ? h.slike[1] : null
                      return (
                        <li key={h.id}>
                          <Link href={`/haljina/${h.slug}`} onClick={close} className="group flex flex-col cursor-pointer">
                            {/* Image — 3:4 */}
                            <div className="relative w-full aspect-[3/4] overflow-hidden bg-white/5">
                              {img1 && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={img1}
                                  alt={h.naziv_sr}
                                  className={cn(
                                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                                    img2 ? 'group-hover:opacity-0' : ''
                                  )}
                                />
                              )}
                              {img2 && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={img2}
                                  alt={h.naziv_sr}
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                />
                              )}
                              {!img1 && <div className="w-full h-full bg-white/8" />}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>

                            {/* Info — tekst skalira sa karticom */}
                            <div style={{ marginTop: 'clamp(8px, 1.2vw, 20px)', gap: 'clamp(2px, 0.4vw, 6px)', display: 'flex', flexDirection: 'column' }}>
                              <p
                                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(11px, 1.25vw, 20px)' }}
                                className="text-white font-light leading-snug truncate"
                              >
                                {h.naziv_sr}
                              </p>
                              <p
                                style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(7px, 0.65vw, 11px)', letterSpacing: '0.35em' }}
                                className="uppercase text-white/35"
                              >
                                {h.kategorija?.naziv_sr ?? ''}
                              </p>
                              {getMinCijena(h) !== null && (
                                <p
                                  style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(11px, 1.25vw, 20px)', marginTop: 'clamp(2px, 0.4vw, 8px)' }}
                                  className="text-[#c9a96e] font-semibold tracking-tight"
                                >
                                  {formatCijena(getMinCijena(h)!)}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* No results */}
            {noResults && (
              <div className="max-w-2xl mx-auto px-6 mt-12 animate-fade-up">
                <p className="text-white/60 text-[clamp(16px,2.5vw,26px)] font-light italic" style={{ fontFamily: 'var(--font-serif)' }}>
                  Nema rezultata za &ldquo;{query}&rdquo;
                </p>
                <Link
                  href="/katalog"
                  onClick={close}
                  className="inline-flex items-center gap-2.5 mt-5 text-[8px] tracking-[0.4em] uppercase text-[#c9a96e] hover:text-white transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Pogledajte celu kolekciju <ArrowRight size={10} strokeWidth={1.5} />
                </Link>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════════
              MOBILE LAYOUT (< lg) — kompaktni input + grid haljina
          ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
            {/* Mobile search input */}
            <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                {loading
                  ? <span className="w-4 h-4 border border-white/15 border-t-[#c9a96e] rounded-full animate-spin flex-shrink-0" />
                  : <Search size={16} strokeWidth={1.5} className="text-white/40 flex-shrink-0" />
                }
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pretražite haljine..."
                  className="flex-1 bg-transparent text-white text-[15px] font-light outline-none placeholder:text-white/30 caret-[#c9a96e]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                    <X size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile dress grid */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {!noResults && displayList.length > 0 && (
                <>
                  <p
                    className="text-[8px] tracking-[0.5em] uppercase text-white/30 mb-5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {isSearching ? `Rezultati (${results.length})` : 'Preporučujemo'}
                  </p>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                    {displayList.map((h) => (
                      <li key={h.id}>
                        <Link href={`/haljina/${h.slug}`} onClick={close} className="group flex flex-col cursor-pointer">
                          <div className="relative w-full aspect-[3/4] overflow-hidden bg-white/5">
                            {firstImage(h)
                              ? <img src={firstImage(h)!} alt={h.naziv_sr} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /> // eslint-disable-line
                              : <div className="w-full h-full bg-white/8" />}
                          </div>
                          <div className="mt-2.5 sm:mt-3 flex flex-col gap-0.5">
                            <p className="text-white text-[13px] sm:text-[14px] font-light leading-snug truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                              {h.naziv_sr}
                            </p>
                            <p className="text-[8px] tracking-[0.3em] uppercase text-white/35" style={{ fontFamily: 'var(--font-sans)' }}>
                              {h.kategorija?.naziv_sr ?? ''}
                            </p>
                            {getMinCijena(h) !== null && (
                              <p className="text-[#c9a96e] text-[12px] sm:text-[13px] font-semibold mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                                {formatCijena(getMinCijena(h)!)}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-white/8">
                    <Link
                      href={isSearching ? `/katalog?q=${encodeURIComponent(query.trim())}` : '/katalog'}
                      onClick={close}
                      className="inline-flex items-center gap-2 text-[8px] tracking-[0.4em] uppercase text-white/35 hover:text-[#c9a96e] transition-colors duration-200 cursor-pointer"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {isSearching ? 'Svi rezultati u katalogu' : 'Cela kolekcija'}
                      <ArrowRight size={10} strokeWidth={1.5} />
                    </Link>
                  </div>
                </>
              )}

              {noResults && (
                <div className="py-12 animate-fade-up">
                  <p className="text-white/60 text-[18px] font-light italic" style={{ fontFamily: 'var(--font-serif)' }}>
                    Nema rezultata za &ldquo;{query}&rdquo;
                  </p>
                  <Link
                    href="/katalog"
                    onClick={close}
                    className="inline-flex items-center gap-2 mt-4 text-[8px] tracking-[0.4em] uppercase text-[#c9a96e] hover:text-white transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Cela kolekcija <ArrowRight size={10} strokeWidth={1.5} />
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>,
        document.body
      )}
    </>
  )
}
