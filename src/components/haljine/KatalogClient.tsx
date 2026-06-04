'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import Filteri from '@/components/haljine/Filteri'
import { cn } from '@/lib/utils'
import type { Haljina } from '@/types'

interface ActiveParams {
  kategorija?: string
  sort?: string
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

  useEffect(() => { setSelectedBoje(parseList(activeParams.boje)) }, [activeParams.boje])
  useEffect(() => { setSelectedVelicine(parseList(activeParams.velicine)) }, [activeParams.velicine])

  const sveBoje = useMemo(() => {
    const map = new Map<string, { naziv: string; hex: string }>()
    haljine.forEach((h) =>
      h.inventar?.filter((i) => i.dostupna && !i.arhivirana).forEach((i) => {
        if (!map.has(i.boja_naziv)) map.set(i.boja_naziv, { naziv: i.boja_naziv, hex: i.boja_hex })
      })
    )
    return Array.from(map.values())
  }, [haljine])

  const sveVelicine = useMemo(() => {
    const set = new Set<string>()
    haljine.forEach((h) =>
      h.inventar?.filter((i) => i.dostupna && !i.arhivirana).forEach((i) => set.add(i.velicina))
    )
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'].filter((v) => set.has(v))
  }, [haljine])

  const priceBounds = useMemo(() => {
    const prices: number[] = []
    haljine.forEach((h) =>
      h.inventar?.filter((i) => i.dostupna && !i.arhivirana).forEach((i) => prices.push(i.cijena_rsd))
    )
    if (prices.length === 0) return { min: 0, max: 200000 }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [haljine])

  const [priceRange, setPriceRange] = useState<[number, number]>([priceBounds.min, priceBounds.max])

  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max])
  }, [priceBounds.min, priceBounds.max])

  const filtrirane = useMemo(() => {
    return haljine.filter((h) => {
      const dostupniInv = h.inventar?.filter((i) => i.dostupna && !i.arhivirana) ?? []

      if (selectedBoje.length > 0) {
        const imenaBoja = dostupniInv.map((i) => i.boja_naziv)
        if (!selectedBoje.some((b) => imenaBoja.includes(b))) return false
      }

      if (selectedVelicine.length > 0) {
        const velicine = dostupniInv.map((i) => i.velicina)
        if (!selectedVelicine.some((v) => velicine.includes(v as never))) return false
      }

      if (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max) {
        const cijene = dostupniInv.map((i) => i.cijena_rsd)
        if (cijene.length === 0) return false
        const minCijena = Math.min(...cijene)
        if (minCijena < priceRange[0] || minCijena > priceRange[1]) return false
      }

      return true
    })
  }, [haljine, selectedBoje, selectedVelicine, priceRange, priceBounds])

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
              <p className="text-2xl font-light italic text-[#1a1a1a] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
                Nema rezultata
              </p>
              <p className="text-[11px] tracking-wide text-[#8a8a8a] mb-8 max-w-xs leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
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
