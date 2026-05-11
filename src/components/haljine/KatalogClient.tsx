'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HaljinaCard from '@/components/haljine/HaljinaCard'
import Filteri from '@/components/haljine/Filteri'
import type { Haljina, Boja } from '@/types'

interface ActiveParams {
  kategorija?: string
  sort?: string
  naPopustu?: string
  maxCijena?: string
}

interface KatalogClientProps {
  haljine: Haljina[]
  activeParams: ActiveParams
}

export default function KatalogClient({ haljine, activeParams }: KatalogClientProps) {
  const [selectedBoje, setSelectedBoje] = useState<string[]>([])
  const [selectedVelicine, setSelectedVelicine] = useState<string[]>([])

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

  // Resetuj slider kada se kategorija promeni (novi haljine = novi opseg cena)
  useEffect(() => {
    setPriceRange([priceBounds.min, priceBounds.max])
  }, [priceBounds.min, priceBounds.max])

  // Collect all unique colors and sizes from all dresses
  const sveBoje = useMemo(() => {
    const bojeMap = new Map<string, Boja>()
    haljine.forEach((h) => {
      h.dostupne_boje?.forEach((b) => {
        if (!bojeMap.has(b.naziv)) bojeMap.set(b.naziv, b)
      })
    })
    return Array.from(bojeMap.values())
  }, [haljine])

  const sveVelicine = useMemo(() => {
    const set = new Set<string>()
    haljine.forEach((h) => {
      h.dostupne_velicine?.forEach((v) => set.add(v))
    })
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri']
    return order.filter((v) => set.has(v))
  }, [haljine])

  // Client-side filtering for colors, sizes and price
  const filtrirane = useMemo(() => {
    return haljine.filter((h) => {
      if (selectedBoje.length > 0) {
        const imenaBoja = h.dostupne_boje?.map((b) => b.naziv) || []
        // Only filter if this dress has color data; skip filter if data is missing
        if (imenaBoja.length > 0 && !selectedBoje.some((b) => imenaBoja.includes(b))) return false
      }
      if (selectedVelicine.length > 0) {
        const velicine = h.dostupne_velicine || []
        // Only filter if this dress has size data; skip filter if data is missing
        if (velicine.length > 0 && !selectedVelicine.some((v) => velicine.includes(v))) return false
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
              className="py-24 text-center"
            >
              <p
                className="text-2xl font-light italic text-[#8a8a8a] mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Nema rezultata
              </p>
              <p
                className="text-sm text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Pokušajte s drugačijim filterima
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
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
