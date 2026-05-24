'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import Filteri from '@/components/haljine/Filteri'
import { cn } from '@/lib/utils'
import type { Haljina, Boja } from '@/types'

interface ActiveParams {
  kategorija?: string
  sort?: string
  naPopustu?: string
  maxCijena?: string
  q?: string
  boje?: string
  velicine?: string
}

interface KatalogClientProps {
  haljine: Haljina[]
  activeParams: ActiveParams
}

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

function parseList(val?: string): string[] {
  return val ? val.split(',').filter(Boolean) : []
}

export default function KatalogClient({ haljine, activeParams }: KatalogClientProps) {
  const router = useRouter()
  const [cols, setCols] = useState(3)

  const [selectedBoje, setSelectedBoje] = useState<string[]>(() => parseList(activeParams.boje))
  const [selectedVelicine, setSelectedVelicine] = useState<string[]>(() => parseList(activeParams.velicine))

  // Sync when URL params change (e.g. after router.replace in Filteri)
  useEffect(() => {
    setSelectedBoje(parseList(activeParams.boje))
  }, [activeParams.boje])

  useEffect(() => {
    setSelectedVelicine(parseList(activeParams.velicine))
  }, [activeParams.velicine])

  const priceBounds = useMemo(() => {
    if (haljine.length === 0) return { min: 0, max: 200000 }
    const prices = haljine.map(h => h.cijena_rsd)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [haljine])

  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    if (haljine.length === 0) return [0, 200000]
    const prices = haljine.map(h => h.cijena_rsd)
    return [Math.min(...prices), Math.max(...prices)]
  })

  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max])
  }, [priceBounds.min, priceBounds.max])

  const sveBoje = useMemo(() => {
    const bojeMap = new Map<string, Boja>()
    haljine.forEach(h => {
      h.dostupne_boje?.forEach(b => {
        if (!bojeMap.has(b.naziv)) bojeMap.set(b.naziv, b)
      })
    })
    return Array.from(bojeMap.values())
  }, [haljine])

  const sveVelicine = useMemo(() => {
    const set = new Set<string>()
    haljine.forEach(h => h.dostupne_velicine?.forEach(v => set.add(v)))
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'].filter(v => set.has(v))
  }, [haljine])

  const filtrirane = useMemo(() => {
    return haljine.filter(h => {
      if (selectedBoje.length > 0) {
        const imenaBoja = h.dostupne_boje?.map(b => b.naziv) || []
        if (imenaBoja.length > 0 && !selectedBoje.some(b => imenaBoja.includes(b))) return false
      }
      if (selectedVelicine.length > 0) {
        const velicine = h.dostupne_velicine || []
        if (velicine.length > 0 && !selectedVelicine.some(v => velicine.includes(v))) return false
      }
      const efektivnaCijena = h.na_popustu
        ? h.cijena_rsd * (1 - h.popust_procenat / 100)
        : h.cijena_rsd
      if (efektivnaCijena < priceRange[0] || efektivnaCijena > priceRange[1]) return false
      return true
    })
  }, [haljine, selectedBoje, selectedVelicine, priceRange])

  const handleReset = useCallback(() => {
    setSelectedBoje([])
    setSelectedVelicine([])
    setPriceRange([priceBounds.min, priceBounds.max])
  }, [priceBounds])

  const handleFullReset = useCallback(() => {
    handleReset()
    router.push('/katalog')
  }, [handleReset, router])

  const hasActiveFilters =
    selectedBoje.length > 0 ||
    selectedVelicine.length > 0 ||
    !!activeParams.kategorija ||
    !!activeParams.naPopustu ||
    !!activeParams.sort ||
    !!activeParams.q ||
    priceRange[0] > priceBounds.min ||
    priceRange[1] < priceBounds.max

  return (
    <>
      <Filteri
        activeParams={activeParams}
        sveBoje={sveBoje}
        sveVelicine={sveVelicine}
        selectedBoje={selectedBoje}
        selectedVelicine={selectedVelicine}
        onBojeChange={setSelectedBoje}
        onVelicineChange={setSelectedVelicine}
        priceRange={priceRange}
        priceBounds={priceBounds}
        onPriceChange={setPriceRange}
        onReset={handleReset}
        totalCount={filtrirane.length}
        cols={cols}
        onColsChange={setCols}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <AnimatePresence mode="wait">
          {filtrirane.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-32 flex flex-col items-center text-center"
            >
              <p
                className="text-[80px] leading-none font-light italic text-[#c9a96e]/20 mb-6 select-none"
                style={{ fontFamily: 'var(--font-serif)' }}
                aria-hidden
              >
                ∅
              </p>
              <p
                className="text-2xl font-light italic text-[#1a1a1a] mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Nema rezultata
              </p>
              <p
                className="text-[11px] tracking-wide text-[#8a8a8a] mb-8 max-w-xs leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Nijedna haljina ne odgovara odabranim filterima.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleFullReset}
                  className="px-8 py-3.5 text-[10px] tracking-[0.3em] uppercase border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Poništi sve filtere
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className={cn('grid gap-6', GRID_COLS[cols] ?? 'grid-cols-2 lg:grid-cols-3')}
              layout
            >
              <AnimatePresence mode="popLayout">
                {filtrirane.map((haljina, i) => (
                  <motion.div
                    key={haljina.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: i < 6 ? i * 0.04 : 0, ease: 'easeOut' }}
                  >
                    <HaljinaCard haljina={haljina} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
