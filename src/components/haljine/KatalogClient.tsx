'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
  const [filterOpen, setFilterOpen] = useState(false)

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

  // Client-side filtering for colors and sizes
  const filtrirane = useMemo(() => {
    return haljine.filter((h) => {
      if (selectedBoje.length > 0) {
        const imenaBoja = h.dostupne_boje?.map((b) => b.naziv) || []
        if (!selectedBoje.some((b) => imenaBoja.includes(b))) return false
      }
      if (selectedVelicine.length > 0) {
        if (!selectedVelicine.some((v) => h.dostupne_velicine?.includes(v))) return false
      }
      return true
    })
  }, [haljine, selectedBoje, selectedVelicine])

  const filteri = (
    <Filteri
      activeParams={activeParams}
      sveBoje={sveBoje}
      sveVelicine={sveVelicine}
      selectedBoje={selectedBoje}
      selectedVelicine={selectedVelicine}
      onBojeChange={setSelectedBoje}
      onVelicineChange={setSelectedVelicine}
    />
  )

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
      <div className="flex gap-10">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          {filteri}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <p
              className="text-[11px] tracking-[0.2em] text-[#8a8a8a] uppercase"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {filtrirane.length} {filtrirane.length === 1 ? 'haljina' : 'haljina'}
            </p>

            {/* Mobile filter button */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger className="lg:hidden flex items-center gap-2 border border-[#e8e0d8] px-4 py-2">
                <SlidersHorizontal size={13} strokeWidth={1.5} className="text-[#8a8a8a]" />
                <span
                  className="text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Filteri
                </span>
              </SheetTrigger>
              <SheetContent side="left" className="bg-[#faf7f4] border-r border-[#e8e0d8] w-72 p-6">
                {filteri}
              </SheetContent>
            </Sheet>
          </div>

          {/* Grid */}
          {filtrirane.length === 0 ? (
            <div className="py-24 text-center">
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
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
              {filtrirane.map((haljina) => (
                <HaljinaCard key={haljina.id} haljina={haljina} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
