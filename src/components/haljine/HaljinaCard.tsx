'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, ShoppingBag, Check, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useKorpa } from '@/store/korpa'
import type { Haljina, InventarStavka } from '@/types'

export function formatCijena(cijena: number): string {
  return new Intl.NumberFormat('sr-Latn-RS', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cijena) + ' RSD'
}

function getBojeIzInventara(inventar: InventarStavka[]) {
  const map = new Map<string, { naziv: string; hex: string }>()
  inventar.forEach((i) => {
    if (!map.has(i.boja_naziv)) map.set(i.boja_naziv, { naziv: i.boja_naziv, hex: i.boja_hex })
  })
  return Array.from(map.values())
}

function getVelicineIzInventara(inventar: InventarStavka[]) {
  const set = new Set(inventar.map((i) => i.velicina))
  return (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri'] as const).filter((v) => set.has(v))
}

export default function HaljinaCard({ haljina, className }: { haljina: Haljina; className?: string }) {
  const dostupniInventar = haljina.inventar?.filter((i) => i.dostupna && !i.arhivirana) ?? []
  const sviInventar = haljina.inventar ?? []

  const isRasprodato = dostupniInventar.length === 0
  const minCijena = dostupniInventar.length > 0
    ? Math.min(...dostupniInventar.map((i) => i.cijena_rsd))
    : sviInventar.length > 0 ? Math.min(...sviInventar.map((i) => i.cijena_rsd)) : 0

  const boje = getBojeIzInventara(dostupniInventar)
  const velicine = getVelicineIzInventara(dostupniInventar)
  const swatchBoje = boje.slice(0, 5)
  const ostalo = boje.length - swatchBoje.length

  const isNovo = !isRasprodato &&
    (Date.now() - new Date(haljina.created_at).getTime()) / 86400000 <= 30

  const slika = haljina.slike?.[0]?.replace(/\s+/g, '') || null
  const slika2 = haljina.slike?.[1]?.replace(/\s+/g, '') || null

  const [quickOpen, setQuickOpen] = useState(false)
  const [selBoja, setSelBoja] = useState<{ naziv: string; hex: string } | null>(boje[0] ?? null)
  const [selVelicina, setSelVelicina] = useState<string | null>(velicine[0] ?? null)
  const [added, setAdded] = useState(false)

  const { dodajArtikl } = useKorpa()

  function dodaj() {
    const inventarItem = dostupniInventar.find(
      (i) => i.boja_naziv === selBoja?.naziv && i.velicina === selVelicina
    ) ?? dostupniInventar[0]
    if (!inventarItem) return

    dodajArtikl({
      inventar_id: inventarItem.id,
      haljina_id: haljina.id,
      slug: haljina.slug,
      naziv: haljina.naziv_sr,
      slika: slika || '',
      boja_naziv: inventarItem.boja_naziv,
      boja_hex: inventarItem.boja_hex,
      velicina: inventarItem.velicina,
      cijena_rsd: inventarItem.cijena_rsd,
      cijena_eur: inventarItem.cijena_eur,
    })
    setQuickOpen(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleCartClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isRasprodato) return
    const jednaBoja = boje.length <= 1
    const jednaVelicina = velicine.length <= 1
    if (jednaBoja && jednaVelicina) dodaj()
    else setQuickOpen((v) => !v)
  }

  function handleDodajClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    dodaj()
  }

  return (
    <Link
      href={`/haljina/${haljina.slug}`}
      className={cn('group block', className)}
      onClick={(e) => { if (quickOpen) { e.preventDefault(); setQuickOpen(false) } }}
    >
      <div
        className="relative overflow-hidden bg-[#f0ebe5]"
        style={{ aspectRatio: '3/4' }}
        onMouseLeave={() => setQuickOpen(false)}
      >
        {slika ? (
          <>
            <Image
              src={slika}
              alt={haljina.naziv_sr}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={cn(
                'object-cover object-center transition-all duration-700 ease-out',
                isRasprodato && 'brightness-[0.65]',
                slika2 ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
              )}
            />
            {slika2 && (
              <Image
                src={slika2}
                alt={`${haljina.naziv_sr} — drugi ugao`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  'object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out',
                  isRasprodato && 'brightness-[0.65]'
                )}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#c9a96e]/40" />
            <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#c9a96e]/40" />
            <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#c9a96e]/40" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#c9a96e]/40" />
            <span className="text-[70px] font-light italic text-[#1a1a1a]/10 leading-none" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
          </div>
        )}

        {isNovo && (
          <div className="absolute top-3 left-3 bg-[#c9a96e] px-2.5 py-1.5">
            <span className="text-[11px] font-medium text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
              Novo
            </span>
          </div>
        )}

        {haljina.video_url && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1a1a1a]/60 backdrop-blur-sm px-2 py-1 pointer-events-none">
            <Play size={7} strokeWidth={0} className="text-white fill-white shrink-0" />
            <span className="text-[7px] tracking-[0.2em] uppercase text-white leading-none" style={{ fontFamily: 'var(--font-sans)' }}>
              Video
            </span>
          </div>
        )}

        {isRasprodato && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border border-white/30 px-4 py-2 bg-black/20 backdrop-blur-[2px]">
              <span className="text-[9px] tracking-[0.4em] uppercase text-white/70" style={{ fontFamily: 'var(--font-sans)' }}>
                Rasprodato
              </span>
            </div>
          </div>
        )}

        {!isRasprodato && (
          <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/25 transition-all duration-500 flex items-end justify-center pb-6 gap-2.5">
            <div className="flex items-center gap-2 bg-[#faf7f4] px-5 py-2.5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <Eye size={11} strokeWidth={1.5} className="text-[#1a1a1a]" />
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                Pogledaj
              </span>
            </div>
            <button
              type="button"
              onClick={handleCartClick}
              className={cn(
                'flex items-center justify-center w-10 h-10 border translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shrink-0',
                added
                  ? 'bg-[#c9a96e] border-[#c9a96e]'
                  : 'bg-white/90 border-[#e8e0d8] hover:border-[#1a1a1a]'
              )}
              title="Dodaj u korpu"
            >
              {added
                ? <Check size={13} strokeWidth={2.5} className="text-[#1a1a1a]" />
                : <ShoppingBag size={12} strokeWidth={1.5} className="text-[#1a1a1a]" />
              }
            </button>
          </div>
        )}

        <AnimatePresence>
          {quickOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute bottom-0 left-0 right-0 bg-[#faf7f4] p-5 z-20"
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              {boje.length > 1 && (
                <div className="mb-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-2.5" style={{ fontFamily: 'var(--font-sans)' }}>Boja</p>
                  <div className="flex gap-2 flex-wrap">
                    {boje.map((boja) => {
                      const isLight = ['Bela', 'Krem'].includes(boja.naziv)
                      return (
                        <button
                          key={boja.naziv}
                          type="button"
                          title={boja.naziv}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelBoja(boja) }}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all duration-150 cursor-pointer',
                            selBoja?.naziv === boja.naziv
                              ? 'border-[#1a1a1a] scale-110'
                              : isLight ? 'border-[#e8e0d8]' : 'border-transparent hover:border-[#8a8a8a]'
                          )}
                          style={{ backgroundColor: boja.hex }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
              {velicine.length > 1 && (
                <div className="mb-4">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-2.5" style={{ fontFamily: 'var(--font-sans)' }}>Veličina</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {velicine.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelVelicina(v) }}
                        className={cn(
                          'px-3 py-2 text-[10px] border transition-all duration-150 cursor-pointer',
                          selVelicina === v
                            ? 'bg-[#1a1a1a] text-[#faf7f4] border-[#1a1a1a]'
                            : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a]'
                        )}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {v === 'po_mjeri' ? 'PM' : v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={handleDodajClick}
                className="w-full py-3.5 bg-[#1a1a1a] text-[#faf7f4] text-[10px] tracking-[0.3em] uppercase hover:bg-[#333] transition-colors cursor-pointer"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Dodaj u korpu
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3.5">
        {haljina.kategorija?.naziv_sr && (
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#8a8a8a] mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
            {haljina.kategorija.naziv_sr}
          </p>
        )}
        <h3
          className="font-light text-[#1a1a1a] leading-tight mb-1.5 group-hover:text-[#c9a96e] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(15px, 1.2vw, 20px)' }}
        >
          {haljina.naziv_sr}
        </h3>
        <div className="flex items-center justify-between">
          {minCijena > 0 && (
            <span className="text-[13px] font-medium text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
              {formatCijena(minCijena)}
            </span>
          )}
          {swatchBoje.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              {swatchBoje.map((boja) => {
                const isLight = ['Bela', 'Krem'].includes(boja.naziv)
                return (
                  <span
                    key={boja.naziv}
                    title={boja.naziv}
                    className={cn('w-2.5 h-2.5 rounded-full shrink-0', isLight && 'border border-[#e8e0d8]')}
                    style={{ backgroundColor: boja.hex }}
                  />
                )
              })}
              {ostalo > 0 && (
                <span className="text-[8px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>+{ostalo}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
