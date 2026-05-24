'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useEffect, useRef } from 'react'
import { X, Check, SlidersHorizontal, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

type Kategorija = 'vjencana' | 'koktel' | 'svecana' | 'maturska' | 'casual'
type Velicina = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'po_mjeri'

interface MockHaljina {
  id: string
  slug: string
  naziv: string
  kategorija: Kategorija
  cijena: number
  naPopustu: boolean
  popustProcenat: number
  boje: { naziv: string; hex: string }[]
  velicine: Velicina[]
  slika: string
}

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK: MockHaljina[] = [
  { id: '1', slug: 'alba', naziv: 'Alba', kategorija: 'vjencana', cijena: 48000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Bela', hex: '#FAFAFA' }, { naziv: 'Krem', hex: '#F5E6D3' }], velicine: ['XS', 'S', 'M', 'L'], slika: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80&fit=crop' },
  { id: '2', slug: 'sera', naziv: 'Sera', kategorija: 'koktel', cijena: 32000, naPopustu: true, popustProcenat: 15, boje: [{ naziv: 'Roze', hex: '#F2A7B3' }, { naziv: 'Lavanda', hex: '#9B87C0' }], velicine: ['S', 'M', 'L', 'XL'], slika: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80&fit=crop' },
  { id: '3', slug: 'luna', naziv: 'Luna', kategorija: 'svecana', cijena: 56000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Crna', hex: '#1a1a1a' }, { naziv: 'Zlatna', hex: '#C9A96E' }], velicine: ['XS', 'S', 'M'], slika: 'https://images.unsplash.com/photo-1566479179817-0b31f9c87e0c?w=600&q=80&fit=crop' },
  { id: '4', slug: 'mila', naziv: 'Mila', kategorija: 'maturska', cijena: 28000, naPopustu: true, popustProcenat: 20, boje: [{ naziv: 'Plava', hex: '#4A7FC1' }, { naziv: 'Lavanda', hex: '#9B87C0' }], velicine: ['S', 'M', 'L', 'XL', 'XXL'], slika: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&fit=crop' },
  { id: '5', slug: 'vera', naziv: 'Vera', kategorija: 'vjencana', cijena: 72000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Bela', hex: '#FAFAFA' }], velicine: ['XS', 'S', 'M', 'L', 'XL', 'po_mjeri'], slika: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80&fit=crop' },
  { id: '6', slug: 'lena', naziv: 'Lena', kategorija: 'casual', cijena: 18000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Zelena', hex: '#2D7D5A' }, { naziv: 'Krem', hex: '#F5E6D3' }], velicine: ['S', 'M', 'L', 'XL'], slika: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80&fit=crop' },
  { id: '7', slug: 'iva', naziv: 'Iva', kategorija: 'koktel', cijena: 38000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Crvena', hex: '#C41E3A' }, { naziv: 'Bordo', hex: '#800020' }], velicine: ['XS', 'S', 'M', 'L'], slika: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80&fit=crop' },
  { id: '8', slug: 'nora', naziv: 'Nora', kategorija: 'svecana', cijena: 44000, naPopustu: true, popustProcenat: 10, boje: [{ naziv: 'Zlatna', hex: '#C9A96E' }], velicine: ['S', 'M', 'L', 'XL', 'po_mjeri'], slika: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80&fit=crop' },
  { id: '9', slug: 'ema', naziv: 'Ema', kategorija: 'maturska', cijena: 24000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Roze', hex: '#F2A7B3' }, { naziv: 'Bela', hex: '#FAFAFA' }], velicine: ['XS', 'S', 'M'], slika: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600&q=80&fit=crop' },
  { id: '10', slug: 'ana', naziv: 'Ana', kategorija: 'vjencana', cijena: 86000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Krem', hex: '#F5E6D3' }, { naziv: 'Bela', hex: '#FAFAFA' }], velicine: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'], slika: 'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=600&q=80&fit=crop' },
  { id: '11', slug: 'zara', naziv: 'Zara', kategorija: 'casual', cijena: 14000, naPopustu: true, popustProcenat: 25, boje: [{ naziv: 'Plava', hex: '#4A7FC1' }], velicine: ['S', 'M', 'L', 'XL', 'XXL'], slika: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80&fit=crop' },
  { id: '12', slug: 'maja', naziv: 'Maja', kategorija: 'koktel', cijena: 41000, naPopustu: false, popustProcenat: 0, boje: [{ naziv: 'Crna', hex: '#1a1a1a' }, { naziv: 'Bordo', hex: '#800020' }], velicine: ['XS', 'S', 'M', 'L', 'XL'], slika: 'https://images.unsplash.com/photo-1623005329979-a44dc2c3e5e6?w=600&q=80&fit=crop' },
]

const KATEGORIJE = [
  { value: '' as const, label: 'Sve' },
  { value: 'vjencana' as Kategorija, label: 'Vjenčane' },
  { value: 'koktel' as Kategorija, label: 'Koktel' },
  { value: 'svecana' as Kategorija, label: 'Svečane' },
  { value: 'maturska' as Kategorija, label: 'Maturske' },
  { value: 'casual' as Kategorija, label: 'Casual' },
]

const VELICINE: Velicina[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri']

const BOJE = [
  { naziv: 'Bela', hex: '#FAFAFA' },
  { naziv: 'Krem', hex: '#F5E6D3' },
  { naziv: 'Roze', hex: '#F2A7B3' },
  { naziv: 'Crvena', hex: '#C41E3A' },
  { naziv: 'Bordo', hex: '#800020' },
  { naziv: 'Lavanda', hex: '#9B87C0' },
  { naziv: 'Plava', hex: '#4A7FC1' },
  { naziv: 'Zelena', hex: '#2D7D5A' },
  { naziv: 'Crna', hex: '#1a1a1a' },
  { naziv: 'Zlatna', hex: '#C9A96E' },
]

const SORT_OPTIONS = [
  { value: 'najnovije', label: 'Najnovije' },
  { value: 'cijena_asc', label: 'Cijena ↑' },
  { value: 'cijena_desc', label: 'Cijena ↓' },
  { value: 'popust', label: 'Na popustu' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('sr-Latn-RS').format(n) + ' RSD'
}

// ── DualSlider ───────────────────────────────────────────────────────────────

function DualSlider({ min, max, value, onChange }: {
  min: number; max: number; value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  const range = max - min || 1
  const lp = ((value[0] - min) / range) * 100
  const rp = ((value[1] - min) / range) * 100
  return (
    <div className="relative h-10 flex items-center select-none">
      <div className="absolute left-0 right-0 h-[2px] bg-[#e8e0d8]">
        <div className="absolute h-full bg-[#c9a96e]" style={{ left: `${lp}%`, right: `${100 - rp}%` }} />
      </div>
      <div className="absolute w-4 h-4 bg-white border-2 border-[#c9a96e] pointer-events-none z-10 -translate-x-1/2" style={{ left: `${lp}%` }} />
      <div className="absolute w-4 h-4 bg-white border-2 border-[#c9a96e] pointer-events-none z-10 -translate-x-1/2" style={{ left: `${rp}%` }} />
      <input type="range" min={min} max={max} step={5000} value={value[0]}
        onChange={e => onChange([Math.min(+e.target.value, value[1] - 5000), value[1]])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: lp > 50 ? 5 : 3 }}
      />
      <input type="range" min={min} max={max} step={5000} value={value[1]}
        onChange={e => onChange([value[0], Math.max(+e.target.value, value[0] + 5000)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: lp > 50 ? 3 : 5 }}
      />
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function TestKatalogPage() {
  const [kategorija, setKategorija] = useState<Kategorija | ''>('')
  const [velicine, setVelicine] = useState<Velicina[]>([])
  const [boje, setBoje] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [naPopustu, setNaPopustu] = useState(false)
  const [sort, setSort] = useState('najnovije')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const filtered = useMemo(() => {
    let res = [...MOCK]
    if (kategorija) res = res.filter(h => h.kategorija === kategorija)
    if (naPopustu) res = res.filter(h => h.naPopustu)
    if (velicine.length) res = res.filter(h => velicine.some(v => h.velicine.includes(v)))
    if (boje.length) res = res.filter(h => boje.some(b => h.boje.map(x => x.naziv).includes(b)))
    res = res.filter(h => {
      const c = h.naPopustu ? h.cijena * (1 - h.popustProcenat / 100) : h.cijena
      return c >= priceRange[0] && c <= priceRange[1]
    })
    if (sort === 'cijena_asc') res.sort((a, b) => a.cijena - b.cijena)
    if (sort === 'cijena_desc') res.sort((a, b) => b.cijena - a.cijena)
    if (sort === 'popust') res.sort((a, b) => (b.naPopustu ? 1 : 0) - (a.naPopustu ? 1 : 0))
    return res
  }, [kategorija, velicine, boje, priceRange, naPopustu, sort])

  const activeCount = [
    !!kategorija,
    velicine.length > 0,
    boje.length > 0,
    naPopustu,
    priceRange[0] > 0 || priceRange[1] < 100000,
  ].filter(Boolean).length

  const resetAll = () => {
    setKategorija('')
    setVelicine([])
    setBoje([])
    setPriceRange([0, 100000])
    setNaPopustu(false)
  }

  // ── Sidebar filter panel (reused for both desktop + mobile drawer) ──────

  const FilterContent = () => (
    <div className="flex flex-col gap-8">

      {/* Kategorija */}
      <div>
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          Kategorija
        </p>
        <div className="flex flex-col gap-1">
          {KATEGORIJE.map(k => (
            <button key={k.value} type="button"
              onClick={() => setKategorija(k.value as Kategorija | '')}
              className={cn(
                'flex items-center justify-between w-full py-2.5 px-3 text-[10px] tracking-[0.15em] uppercase transition-all duration-200 text-left cursor-pointer',
                (kategorija || '') === k.value
                  ? 'bg-[#1a1a1a] text-[#faf7f4]'
                  : 'text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#f0ebe5]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {k.label}
              <span className="text-[9px] opacity-50">
                {k.value ? MOCK.filter(h => h.kategorija === k.value).length : MOCK.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Veličina */}
      <div>
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          Veličina
        </p>
        <div className="flex flex-wrap gap-1.5">
          {VELICINE.map(v => {
            const sel = velicine.includes(v)
            return (
              <button key={v} type="button"
                onClick={() => setVelicine(sel ? velicine.filter(x => x !== v) : [...velicine, v])}
                className={cn(
                  'px-3 py-2 text-[9px] tracking-wide border transition-all duration-150 cursor-pointer',
                  sel ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]' : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {v === 'po_mjeri' ? 'Po mjeri' : v}
              </button>
            )
          })}
        </div>
      </div>

      {/* Boja */}
      <div>
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
          Boja
        </p>
        <div className="flex flex-wrap gap-3">
          {BOJE.map(b => {
            const sel = boje.includes(b.naziv)
            const isLight = ['Bela', 'Krem'].includes(b.naziv)
            return (
              <button key={b.naziv} type="button" title={b.naziv}
                onClick={() => setBoje(sel ? boje.filter(x => x !== b.naziv) : [...boje, b.naziv])}
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 cursor-pointer',
                  sel ? 'border-[#c9a96e] scale-110 shadow-md' : isLight ? 'border-[#e8e0d8] hover:border-[#8a8a8a]' : 'border-transparent hover:border-[#8a8a8a]'
                )}
                style={{ backgroundColor: b.hex }}
              >
                {sel && <Check size={10} strokeWidth={2.5} className={isLight ? 'text-[#1a1a1a]' : 'text-white'} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cijena */}
      <div>
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
          Cijena
        </p>
        <DualSlider min={0} max={100000} value={priceRange} onChange={setPriceRange} />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>{fmt(priceRange[0])}</span>
          <span className="text-[9px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>{fmt(priceRange[1])}</span>
        </div>
      </div>

      {/* Na popustu */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] tracking-[0.45em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
          Na popustu
        </p>
        <button type="button"
          onClick={() => setNaPopustu(v => !v)}
          className={cn(
            'relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0',
            naPopustu ? 'bg-[#c9a96e]' : 'bg-[#e8e0d8]'
          )}
        >
          <span className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            naPopustu ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </button>
      </div>

      {/* Reset */}
      {activeCount > 0 && (
        <button type="button" onClick={resetAll}
          className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer pt-2 border-t border-[#e8e0d8]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <X size={10} />
          Poništi sve filtere
        </button>
      )}
    </div>
  )

  return (
    <main className="bg-[#faf7f4] min-h-screen">

      {/* ── Editorijalski header ──────────────────────────────────────────── */}
      <div className="border-b border-[#e8e0d8] pt-20 lg:pt-24 pb-0 relative overflow-hidden">
        {/* Background oversized text */}
        <div
          className="absolute right-0 bottom-0 text-[clamp(80px,15vw,180px)] font-light text-[#e8e0d8] leading-none select-none pointer-events-none translate-y-[30%]"
          style={{ fontFamily: 'var(--font-serif)' }}
          aria-hidden="true"
        >
          Katalog
        </div>

        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
          <div className="flex items-end justify-between pb-8 gap-4">
            <div>
              <p
                className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Kolekcija · 2025
              </p>
              <h1
                className="text-[clamp(34px,5vw,60px)] font-light text-[#1a1a1a] leading-[1.0]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Sve haljine
              </h1>
            </div>
            <div className="shrink-0 text-right">
              <span
                className="block text-[clamp(28px,4vw,52px)] font-light text-[#e8e0d8] leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {filtered.length}
              </span>
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {filtered.length === 1 ? 'model' : 'modela'}
              </span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {KATEGORIJE.map(k => (
              <button key={k.value} type="button"
                onClick={() => setKategorija(k.value as Kategorija | '')}
                className={cn(
                  'px-5 py-3 text-[9px] tracking-[0.3em] uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer shrink-0',
                  (kategorija || '') === k.value
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-[#8a8a8a] hover:text-[#1a1a1a]'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active filter chips ───────────────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="border-b border-[#e8e0d8] bg-[#faf7f4]">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-14 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-[8px] tracking-[0.4em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
              Aktivan filter:
            </span>
            {kategorija && (
              <Chip label={KATEGORIJE.find(k => k.value === kategorija)?.label ?? kategorija} onRemove={() => setKategorija('')} />
            )}
            {velicine.map(v => (
              <Chip key={v} label={v === 'po_mjeri' ? 'Po mjeri' : v} onRemove={() => setVelicine(velicine.filter(x => x !== v))} />
            ))}
            {boje.map(b => (
              <Chip key={b} label={b} onRemove={() => setBoje(boje.filter(x => x !== b))} />
            ))}
            {naPopustu && <Chip label="Na popustu" onRemove={() => setNaPopustu(false)} />}
            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
              <Chip label={`${fmt(priceRange[0])} – ${fmt(priceRange[1])}`} onRemove={() => setPriceRange([0, 100000])} />
            )}
          </div>
        </div>
      )}

      {/* ── Body: sidebar + grid ─────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
        <div className={cn('flex gap-10 pt-10 pb-20 items-start', sidebarOpen ? 'lg:grid lg:grid-cols-[240px_1fr]' : '')}>

          {/* Desktop sidebar */}
          <aside className={cn('hidden lg:block sticky top-[4.5rem] self-start', sidebarOpen ? '' : 'lg:hidden')}>
            <FilterContent />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                {/* Sidebar toggle — desktop only */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(v => !v)}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-[9px] tracking-[0.3em] uppercase border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <SlidersHorizontal size={11} strokeWidth={1.5} />
                  {sidebarOpen ? 'Sakrij' : 'Filteri'}
                  {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#c9a96e] text-[#1a1a1a] text-[8px] flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </button>

                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-[9px] tracking-[0.3em] uppercase border border-[#e8e0d8] text-[#8a8a8a] cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <SlidersHorizontal size={11} strokeWidth={1.5} />
                  Filteri
                  {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#c9a96e] text-[#1a1a1a] text-[8px] flex items-center justify-center">{activeCount}</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-[#e8e0d8]">
                  <button type="button"
                    onClick={() => setView('grid')}
                    className={cn('p-2 transition-colors duration-150 cursor-pointer', view === 'grid' ? 'bg-[#1a1a1a] text-[#faf7f4]' : 'text-[#8a8a8a] hover:text-[#1a1a1a]')}
                    aria-label="Grid prikaz"
                  >
                    <LayoutGrid size={13} strokeWidth={1.5} />
                  </button>
                  <button type="button"
                    onClick={() => setView('list')}
                    className={cn('p-2 transition-colors duration-150 cursor-pointer', view === 'list' ? 'bg-[#1a1a1a] text-[#faf7f4]' : 'text-[#8a8a8a] hover:text-[#1a1a1a]')}
                    aria-label="Lista prikaz"
                  >
                    <List size={13} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Sort */}
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-[clamp(22px,3vw,38px)] font-light italic text-[#e8e0d8] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  Nema rezultata
                </p>
                <p className="text-[11px] tracking-wide text-[#8a8a8a] mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                  Pokušajte s drugačijim filterima
                </p>
                <button type="button" onClick={resetAll}
                  className="text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] border-b border-[#e8e0d8] pb-0.5 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Poništi sve
                </button>
              </div>
            )}

            {/* Grid view */}
            {filtered.length > 0 && view === 'grid' && (
              <div className={cn('grid gap-x-5 gap-y-12', sidebarOpen ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4')}>
                {filtered.map((h, i) => (
                  <GridCard key={h.id} h={h} index={i} />
                ))}
              </div>
            )}

            {/* List view */}
            {filtered.length > 0 && view === 'list' && (
              <div className="flex flex-col divide-y divide-[#e8e0d8]">
                {filtered.map((h, i) => (
                  <ListCard key={h.id} h={h} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100] lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-[101] lg:hidden bg-[#faf7f4] flex flex-col shadow-2xl overflow-hidden"
            style={{ width: 'min(300px, 88vw)' }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d8] shrink-0">
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                Filteri
              </p>
              <button type="button" onClick={() => setDrawerOpen(false)} className="p-1 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterContent />
            </div>
            <div className="px-6 pb-8 pt-4 border-t border-[#e8e0d8] shrink-0">
              <button type="button" onClick={() => setDrawerOpen(false)}
                className="w-full py-4 text-[9px] tracking-[0.35em] uppercase bg-[#1a1a1a] text-[#faf7f4] hover:bg-[#333] transition-colors cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Prikaži {filtered.length} {filtered.length === 1 ? 'haljinu' : 'haljine'}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-[#faf7f4] text-[8px] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
      {label}
      <button type="button" onClick={onRemove} className="opacity-60 hover:opacity-100 cursor-pointer">
        <X size={9} />
      </button>
    </span>
  )
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 border border-[#e8e0d8] text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all duration-200 cursor-pointer whitespace-nowrap"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {SORT_OPTIONS.find(s => s.value === value)?.label}
        <span className={cn('text-[8px] transition-transform duration-150', open ? 'rotate-180' : '')}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[#e8e0d8] shadow-lg z-50 min-w-[160px]">
          {SORT_OPTIONS.map(s => (
            <button key={s.value} type="button"
              onClick={() => { onChange(s.value); setOpen(false) }}
              className={cn(
                'w-full text-left px-4 py-3 text-[9px] tracking-wide transition-colors duration-150 cursor-pointer',
                value === s.value ? 'text-[#c9a96e] bg-[#faf7f4]' : 'text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#faf7f4]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GridCard({ h, index }: { h: MockHaljina; index: number }) {
  const cijena = h.naPopustu ? h.cijena * (1 - h.popustProcenat / 100) : h.cijena
  return (
    <Link href={`/haljina/${h.slug}`} className="group block cursor-pointer">
      <div className="relative overflow-hidden bg-[#f0ebe5]" style={{ aspectRatio: '3/4' }}>
        <Image
          src={h.slika}
          alt={h.naziv}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/18 transition-all duration-500" />

        {/* Index */}
        <div className="absolute top-2.5 left-2.5 w-6 h-6 bg-[#faf7f4]/88 flex items-center justify-center">
          <span className="text-[8px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Discount */}
        {h.naPopustu && (
          <div className="absolute top-2.5 right-2.5 bg-[#1a1a1a] px-2 py-1">
            <span className="text-[7px] tracking-[0.2em] uppercase text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
              -{h.popustProcenat}%
            </span>
          </div>
        )}

        {/* Hover CTA */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-[#faf7f4]/92 backdrop-blur-sm px-5 py-2 text-[8px] tracking-[0.3em] uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
            Pogledaj
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-[15px] font-light text-[#1a1a1a] group-hover:text-[#c9a96e] transition-colors duration-300 leading-tight mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          {h.naziv}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              {fmt(cijena)}
            </span>
            {h.naPopustu && (
              <span className="text-[11px] text-[#8a8a8a]/55 line-through" style={{ fontFamily: 'var(--font-sans)' }}>
                {fmt(h.cijena)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {h.boje.map(b => (
              <span
                key={b.naziv}
                title={b.naziv}
                className="w-3 h-3 rounded-full border border-[#e8e0d8]"
                style={{ backgroundColor: b.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

function ListCard({ h }: { h: MockHaljina }) {
  const cijena = h.naPopustu ? h.cijena * (1 - h.popustProcenat / 100) : h.cijena
  return (
    <Link href={`/haljina/${h.slug}`} className="group flex items-center gap-6 py-5 cursor-pointer">
      <div className="relative w-16 h-20 shrink-0 overflow-hidden bg-[#f0ebe5]">
        <Image src={h.slika} alt={h.naziv} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-light text-[#1a1a1a] group-hover:text-[#c9a96e] transition-colors duration-300 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          {h.naziv}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {KATEGORIJE.find(k => k.value === h.kategorija)?.label}
          </span>
          <span className="text-[#e8e0d8]">·</span>
          <div className="flex items-center gap-1">
            {h.boje.map(b => (
              <span key={b.naziv} className="w-3 h-3 rounded-full border border-[#e8e0d8]" style={{ backgroundColor: b.hex }} title={b.naziv} />
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[16px] font-light text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>{fmt(cijena)}</p>
        {h.naPopustu && (
          <p className="text-[11px] text-[#8a8a8a]/55 line-through" style={{ fontFamily: 'var(--font-sans)' }}>{fmt(h.cijena)}</p>
        )}
      </div>
    </Link>
  )
}
