'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, X, Check, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type Boja = { naziv: string; hex: string }

const KATEGORIJE = [
  { value: '', label: 'Sve' },
  { value: 'vjencana', label: 'Venčane' },
  { value: 'koktel', label: 'Koktel' },
  { value: 'svecana', label: 'Svečane' },
  { value: 'casual', label: 'Casual' },
  { value: 'maturska', label: 'Maturske' },
]

const KATEGORIJE_NAZIVI: Record<string, string> = {
  vjencana: 'Venčane',
  koktel: 'Koktel',
  svecana: 'Svečane',
  casual: 'Casual',
  maturska: 'Maturske',
}

const SORTIRANJA = [
  { value: '', label: 'Najnovije' },
  { value: 'cijena_rastuce', label: 'Cena ↑' },
  { value: 'cijena_opadajuce', label: 'Cena ↓' },
  { value: 'po_dostupnosti', label: 'Dostupnost' },
]

const STANDARD_VELICINE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri']

const PRESET_BOJE: Boja[] = [
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

interface FilteriProps {
  activeParams: {
    kategorija?: string
    sort?: string
    naPopustu?: string
    maxCijena?: string
    q?: string
  }
  sveBoje: Boja[]
  sveVelicine: string[]
  selectedBoje: string[]
  selectedVelicine: string[]
  onBojeChange: (boje: string[]) => void
  onVelicineChange: (velicine: string[]) => void
  priceRange: [number, number]
  priceBounds: { min: number; max: number }
  onPriceChange: (range: [number, number]) => void
  onReset: () => void
  totalCount: number
  cols?: number
  onColsChange?: (n: number) => void
}

function formatRSD(value: number) {
  return new Intl.NumberFormat('sr-Latn-RS').format(Math.round(value / 1000) * 1000) + ' RSD'
}

function GridIcon({ cols }: { cols: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '2px',
        width: 14,
        height: 10,
      }}
    >
      {Array.from({ length: cols * 2 }).map((_, i) => (
        <div key={i} style={{ backgroundColor: 'currentColor', borderRadius: 1 }} />
      ))}
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#1a1a1a]/20 bg-[#1a1a1a]/5 text-[9px] tracking-[0.15em] uppercase text-[#1a1a1a] shrink-0"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
      >
        <X size={9} strokeWidth={2.5} />
      </button>
    </span>
  )
}

function DualSlider({ min, max, value, step = 5000, onChange }: {
  min: number; max: number; value: [number, number]; step?: number
  onChange: (v: [number, number]) => void
}) {
  const range = max - min || 1
  const leftPct = Math.min(100, Math.max(0, ((value[0] - min) / range) * 100))
  const rightPct = Math.min(100, Math.max(0, ((value[1] - min) / range) * 100))
  return (
    <div className="relative h-10 flex items-center select-none">
      <div className="absolute left-0 right-0 h-[3px] bg-[#e8e0d8] rounded-full">
        <div className="absolute h-full bg-[#c9a96e] rounded-full" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
      </div>
      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#c9a96e] shadow-md pointer-events-none z-10" style={{ left: `calc(${leftPct}% - 10px)` }} />
      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#c9a96e] shadow-md pointer-events-none z-10" style={{ left: `calc(${rightPct}% - 10px)` }} />
      <input type="range" min={min} max={max} step={step} value={value[0]}
        onChange={e => onChange([Math.min(Number(e.target.value), value[1] - step), value[1]])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: leftPct > 50 ? 5 : 3 }}
      />
      <input type="range" min={min} max={max} step={step} value={value[1]}
        onChange={e => onChange([value[0], Math.max(Number(e.target.value), value[0] + step)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: leftPct > 50 ? 3 : 5 }}
      />
    </div>
  )
}

function Dropdown({ label, active, badge, children }: {
  label: string; active?: boolean; badge?: number; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])
  return (
    <div className="relative shrink-0" style={{ overflow: 'visible' }} ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200 whitespace-nowrap cursor-pointer',
          active ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#faf7f4]' : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-white'
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
        {badge
          ? <span className="w-4 h-4 rounded-full bg-[#c9a96e] text-[#1a1a1a] text-[8px] flex items-center justify-center font-medium">{badge}</span>
          : <ChevronDown size={10} className={cn('transition-transform duration-200', open && 'rotate-180')} />
        }
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#e8e0d8] shadow-[0_8px_30px_rgba(0,0,0,0.12)]" style={{ zIndex: 9999, minWidth: 220 }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Mobile accordion section ────────────────────────────────────────────────

function DrawerAccordion({ label, value, active, children }: {
  label: string; value?: string; active?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#e8e0d8]">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
            {label}
          </p>
          {active && value && (
            <span className="text-[9px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
              — {value}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={cn('text-[#8a8a8a] transition-transform duration-200 shrink-0', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Filteri({
  activeParams, sveBoje, sveVelicine, selectedBoje, selectedVelicine,
  onBojeChange, onVelicineChange, priceRange, priceBounds, onPriceChange, onReset, totalCount,
  cols = 3, onColsChange,
}: FilteriProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const updateParam = useCallback((key: string, value: string | null, replace = false) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') params.delete(key)
    else params.set(key, value)
    const url = `/katalog?${params.toString()}`
    if (replace) router.replace(url, { scroll: false })
    else router.push(url)
  }, [router, searchParams])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const displayVelicine = sveVelicine.length > 0 ? sveVelicine : STANDARD_VELICINE
  const displayBoje = sveBoje.length > 0 ? sveBoje : PRESET_BOJE
  const priceActive = priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max
  const activeCount = [selectedBoje.length > 0, selectedVelicine.length > 0, priceActive, !!activeParams.naPopustu, !!activeParams.sort].filter(Boolean).length
  const hasActive = activeCount > 0 || !!activeParams.kategorija || !!activeParams.q
  const handleReset = () => { onReset(); router.push('/katalog') }

  const SizePills = () => (
    <div className="flex flex-wrap gap-2">
      {displayVelicine.map(v => {
        const sel = selectedVelicine.includes(v)
        return (
          <button key={v} type="button"
            onClick={() => {
              const newV = sel ? selectedVelicine.filter(x => x !== v) : [...selectedVelicine, v]
              onVelicineChange(newV)
              updateParam('velicine', newV.length > 0 ? newV.join(',') : null, true)
            }}
            className={cn('px-3 py-2 text-[10px] tracking-wide border transition-all duration-150 cursor-pointer',
              sel ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]' : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
            )}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {v === 'po_mjeri' ? 'Po meri' : v}
          </button>
        )
      })}
    </div>
  )

  const ColorGrid = () => (
    <div className="grid grid-cols-2 gap-1">
      {displayBoje.map(boja => {
        const sel = selectedBoje.includes(boja.naziv)
        const isLight = ['Bela', 'Krem'].includes(boja.naziv)
        return (
          <button key={boja.naziv} type="button"
            onClick={() => {
              const newBoje = sel ? selectedBoje.filter(b => b !== boja.naziv) : [...selectedBoje, boja.naziv]
              onBojeChange(newBoje)
              updateParam('boje', newBoje.length > 0 ? newBoje.join(',') : null, true)
            }}
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-2 transition-all duration-150 cursor-pointer text-left',
              sel ? 'bg-[#1a1a1a]/5' : 'hover:bg-[#1a1a1a]/[0.03]'
            )}
          >
            <div className={cn(
              'w-5 h-5 rounded-full shrink-0 border-2 transition-all duration-150 flex items-center justify-center',
              sel ? 'border-[#c9a96e] scale-110 shadow-sm' : isLight ? 'border-[#e8e0d8]' : 'border-transparent'
            )} style={{ backgroundColor: boja.hex }}>
              {sel && <Check size={9} strokeWidth={3} className={isLight ? 'text-[#1a1a1a]' : 'text-white'} />}
            </div>
            <span
              className={cn('text-[10px] tracking-wide leading-none transition-colors duration-150', sel ? 'text-[#1a1a1a]' : 'text-[#8a8a8a]')}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {boja.naziv}
            </span>
          </button>
        )
      })}
    </div>
  )

  // Build active chips array for desktop chips row
  const activeChips: Array<{ key: string; label: string; onRemove: () => void }> = [
    ...(activeParams.q ? [{ key: 'q', label: `"${activeParams.q}"`, onRemove: () => updateParam('q', null) }] : []),
    ...(activeParams.kategorija ? [{ key: 'kat', label: KATEGORIJE_NAZIVI[activeParams.kategorija] ?? activeParams.kategorija, onRemove: () => updateParam('kategorija', null) }] : []),
    ...selectedVelicine.map(v => ({
      key: `v-${v}`,
      label: v === 'po_mjeri' ? 'Po meri' : v,
      onRemove: () => {
        const newV = selectedVelicine.filter(x => x !== v)
        onVelicineChange(newV)
        updateParam('velicine', newV.length > 0 ? newV.join(',') : null, true)
      },
    })),
    ...selectedBoje.map(b => ({
      key: `b-${b}`,
      label: b,
      onRemove: () => {
        const newBoje = selectedBoje.filter(x => x !== b)
        onBojeChange(newBoje)
        updateParam('boje', newBoje.length > 0 ? newBoje.join(',') : null, true)
      },
    })),
    ...(priceActive ? [{ key: 'price', label: `${formatRSD(priceRange[0])} – ${formatRSD(priceRange[1])}`, onRemove: () => onPriceChange([priceBounds.min, priceBounds.max]) }] : []),
    ...(activeParams.naPopustu === 'true' ? [{ key: 'popust', label: 'Na popustu', onRemove: () => updateParam('naPopustu', null) }] : []),
    ...(activeParams.sort ? [{ key: 'sort', label: SORTIRANJA.find(s => s.value === activeParams.sort)?.label ?? activeParams.sort, onRemove: () => updateParam('sort', null) }] : []),
  ]

  return (
    <>
      {/* ── Sticky filter bar ──────────────────────────────────────────────── */}
      <div className="sticky top-16 lg:top-20 z-30 bg-[#faf7f4]/95 backdrop-blur-sm border-b border-[#e8e0d8]" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-10" style={{ overflow: 'visible' }}>

          {/* Category tabs — all screens */}
          <div className="relative">
            <div className="flex items-center overflow-x-auto scrollbar-hide py-3 border-b border-[#e8e0d8]/60">
            {KATEGORIJE.map(k => (
              <button key={k.value} type="button"
                onClick={() => {
                  if (!k.value) {
                    // "Sve" — reset sve filtere
                    onReset()
                    router.push('/katalog')
                  } else {
                    updateParam('kategorija', k.value)
                  }
                }}
                className={cn(
                  'px-4 py-2 text-[10px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer',
                  (activeParams.kategorija || '') === k.value ? 'bg-[#1a1a1a] text-[#faf7f4]' : 'text-[#8a8a8a] hover:text-[#1a1a1a]'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {k.label}
              </button>
            ))}
            </div>
            {/* Fade right edge — mobile only */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 lg:hidden"
              style={{ background: 'linear-gradient(to right, transparent, #faf7f4)' }} />
          </div>

          {/* Desktop filter row */}
          <div className="hidden lg:flex items-center justify-between gap-4 py-3" style={{ overflow: 'visible' }}>
            <div className="flex items-center gap-2" style={{ overflow: 'visible' }}>
              <Dropdown label="Veličina" active={selectedVelicine.length > 0} badge={selectedVelicine.length || undefined}>
                <div className="p-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Odaberite veličinu</p>
                  <SizePills />
                </div>
              </Dropdown>
              <Dropdown label="Cena" active={priceActive}>
                <div className="p-4" style={{ width: 280 }}>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>Cenovni opseg</p>
                  <DualSlider min={priceBounds.min} max={priceBounds.max} value={priceRange} onChange={onPriceChange} />
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 border border-[#e8e0d8] px-3 py-2 text-center">
                      <p className="text-[10px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{formatRSD(priceRange[0])}</p>
                    </div>
                    <div className="w-4 h-px bg-[#e8e0d8] shrink-0" />
                    <div className="flex-1 border border-[#e8e0d8] px-3 py-2 text-center">
                      <p className="text-[10px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{formatRSD(priceRange[1])}</p>
                    </div>
                  </div>
                </div>
              </Dropdown>
              <Dropdown label="Boja" active={selectedBoje.length > 0} badge={selectedBoje.length || undefined}>
                <div className="p-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>Odaberite boju</p>
                  <ColorGrid />
                </div>
              </Dropdown>
              <button type="button"
                onClick={() => updateParam('naPopustu', activeParams.naPopustu === 'true' ? null : 'true')}
                className={cn('flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer',
                  activeParams.naPopustu === 'true' ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#1a1a1a]' : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-white'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Na popustu
              </button>
              <AnimatePresence>
                {hasActive && (
                  <motion.button type="button"
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors shrink-0 cursor-pointer"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <X size={11} /> Poništi
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 shrink-0" style={{ overflow: 'visible' }}>
              <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                {totalCount} {totalCount === 1 ? 'haljina' : 'haljine'}
              </p>
              <Dropdown label={SORTIRANJA.find(s => (s.value || '') === (activeParams.sort || ''))?.label ?? 'Sortiranje'} active={!!activeParams.sort}>
                <div className="py-1" style={{ minWidth: 180 }}>
                  {SORTIRANJA.map(s => (
                    <button key={s.value} type="button"
                      onClick={() => updateParam('sort', s.value || null)}
                      className={cn('w-full text-left px-4 py-2.5 text-[10px] tracking-wide transition-colors duration-150 cursor-pointer',
                        (activeParams.sort || '') === s.value ? 'text-[#c9a96e] bg-[#faf7f4]' : 'text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#faf7f4]'
                      )}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </Dropdown>

              {/* View toggle — 2 / 3 / 4 columns */}
              {onColsChange && (
                <div className="flex items-center border border-[#e8e0d8] overflow-hidden">
                  {([2, 3, 4] as const).map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onColsChange(n)}
                      title={`${n} kolone`}
                      className={cn(
                        'w-8 h-9 flex items-center justify-center transition-colors duration-150 cursor-pointer',
                        cols === n ? 'bg-[#1a1a1a] text-[#faf7f4]' : 'bg-white text-[#8a8a8a] hover:text-[#1a1a1a]'
                      )}
                    >
                      <GridIcon cols={n} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips — desktop only */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block overflow-hidden"
              >
                <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-none">
                  {activeChips.map(chip => (
                    <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile row — count + filter button */}
          <div className="flex lg:hidden items-center justify-between py-3">
            <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
              {totalCount} {totalCount === 1 ? 'haljina' : 'haljine'}
            </p>
            <button type="button" onClick={() => setDrawerOpen(true)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200 cursor-pointer',
                activeCount > 0 ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#faf7f4]' : 'border-[#e8e0d8] text-[#8a8a8a] bg-white'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <SlidersHorizontal size={12} strokeWidth={1.5} />
              Filteri
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#c9a96e] text-[#1a1a1a] text-[8px] flex items-center justify-center font-medium">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile side drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer — slides in from left */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 z-[101] lg:hidden bg-[#faf7f4] flex flex-col shadow-2xl"
              style={{ width: 'min(320px, 88vw)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e0d8] shrink-0">
                <p className="text-[11px] tracking-[0.35em] uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Filteri
                </p>
                <button type="button" onClick={() => setDrawerOpen(false)} className="p-1 -mr-1 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable filter content */}
              <div className="flex-1 overflow-y-auto px-6">

                {/* Veličina */}
                <div className="py-5 border-b border-[#e8e0d8]">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Veličina</p>
                  <SizePills />
                </div>

                {/* Cena */}
                <div className="py-5 border-b border-[#e8e0d8]">
                  <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Cena</p>
                  <DualSlider min={priceBounds.min} max={priceBounds.max} value={priceRange} onChange={onPriceChange} />
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 border border-[#e8e0d8] px-3 py-2.5 text-center">
                      <p className="text-[10px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{formatRSD(priceRange[0])}</p>
                    </div>
                    <div className="w-4 h-px bg-[#e8e0d8] shrink-0" />
                    <div className="flex-1 border border-[#e8e0d8] px-3 py-2.5 text-center">
                      <p className="text-[10px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{formatRSD(priceRange[1])}</p>
                    </div>
                  </div>
                </div>

                {/* Sortiranje — collapsible */}
                <DrawerAccordion
                  label="Sortiranje"
                  value={SORTIRANJA.find(s => (s.value || '') === (activeParams.sort || ''))?.label}
                  active={!!activeParams.sort}
                >
                  <div className="flex flex-col gap-1 pb-1">
                    {SORTIRANJA.map(s => {
                      const isSel = (activeParams.sort || '') === s.value
                      return (
                        <button key={s.value} type="button"
                          onClick={() => updateParam('sort', s.value || null)}
                          className={cn('w-full text-left px-4 py-3 text-[10px] tracking-wide border transition-all duration-150 cursor-pointer',
                            isSel ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]' : 'border-[#e8e0d8] text-[#8a8a8a]'
                          )}
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </DrawerAccordion>

                {/* Boja — collapsible */}
                <DrawerAccordion
                  label="Boja"
                  value={selectedBoje.length > 0 ? `${selectedBoje.length} odabrano` : undefined}
                  active={selectedBoje.length > 0}
                >
                  <div className="pb-1">
                    <ColorGrid />
                  </div>
                </DrawerAccordion>

                {/* Na popustu */}
                <div className="py-5 border-b border-[#e8e0d8]">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>Na popustu</p>
                    <button type="button"
                      onClick={() => updateParam('naPopustu', activeParams.naPopustu === 'true' ? null : 'true')}
                      className={cn('relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer',
                        activeParams.naPopustu === 'true' ? 'bg-[#c9a96e]' : 'bg-[#e8e0d8]'
                      )}
                    >
                      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                        activeParams.naPopustu === 'true' ? 'translate-x-7' : 'translate-x-1'
                      )} />
                    </button>
                  </div>
                </div>

                {/* bottom spacing */}
                <div className="py-2" />

              </div>

              {/* Drawer footer */}
              <div className="px-6 pt-4 pb-8 border-t border-[#e8e0d8] shrink-0 flex gap-3">
                {hasActive && (
                  <button type="button"
                    onClick={() => { handleReset(); setDrawerOpen(false) }}
                    className="flex-1 py-3.5 text-[10px] tracking-[0.2em] uppercase border border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Poništi
                  </button>
                )}
                <button type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 py-3.5 text-[10px] tracking-[0.2em] uppercase bg-[#1a1a1a] text-[#faf7f4] hover:bg-[#333] transition-colors cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Prikaži {totalCount} {totalCount === 1 ? 'haljinu' : 'haljine'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
