'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HaljinaGalerijaProps {
  slike: string[]
  naziv: string
}

export default function HaljinaGalerija({ slike, naziv }: HaljinaGalerijaProps) {
  const [aktivna, setAktivna] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // Touch tracking — gallery + lightbox
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)
  const didSwipe = useRef(false)

  const prev = useCallback(() => setAktivna(i => (i - 1 + slike.length) % slike.length), [slike.length])
  const next = useCallback(() => setAktivna(i => (i + 1) % slike.length), [slike.length])

  // Keyboard + scroll lock for lightbox
  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, next, prev])

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchDeltaX.current = 0
      didSwipe.current = false
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      touchDeltaX.current = touchStartX.current - e.touches[0].clientX
      if (Math.abs(touchDeltaX.current) > 8) didSwipe.current = true
    },
    onTouchEnd: () => {
      if (didSwipe.current && Math.abs(touchDeltaX.current) > 45) {
        if (touchDeltaX.current > 0) next()
        else prev()
      }
      touchStartX.current = null
    },
  }

  if (!slike || slike.length === 0) {
    return (
      <div className="relative bg-[#f0ebe5] flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
        <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#c9a96e]/40" />
        <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#c9a96e]/40" />
        <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#c9a96e]/40" />
        <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#c9a96e]/40" />
        <span className="text-[120px] font-light italic text-[#1a1a1a]/10 leading-none" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
      </div>
    )
  }

  // Shared image content (used in both mobile and desktop main image)
  const imageContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={aktivna}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="absolute inset-0"
      >
        <Image
          src={slike[aktivna]}
          alt={`${naziv} — slika ${aktivna + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
          priority
        />
      </motion.div>
    </AnimatePresence>
  )

  const thumbs = (vertical: boolean) =>
    slike.map((slika, i) => (
      <button
        key={i}
        onClick={() => setAktivna(i)}
        className={cn(
          'relative shrink-0 overflow-hidden transition-all duration-200 cursor-pointer',
          aktivna === i ? 'ring-1 ring-[#c9a96e] opacity-100' : 'opacity-45 hover:opacity-75'
        )}
        style={vertical ? { width: 68, height: 91 } : { width: 56, height: 75 }}
      >
        <Image src={slika} alt={`${naziv} — thumbnail ${i + 1}`} fill sizes="70px" className="object-cover object-top" />
      </button>
    ))

  const navArrows = (stopProp = false) => slike.length > 1 && (
    <>
      <button
        type="button"
        onClick={e => { if (stopProp) e.stopPropagation(); prev() }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-white"
      >
        <ChevronLeft size={14} strokeWidth={1.5} className="text-[#1a1a1a]" />
      </button>
      <button
        type="button"
        onClick={e => { if (stopProp) e.stopPropagation(); next() }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-white"
      >
        <ChevronRight size={14} strokeWidth={1.5} className="text-[#1a1a1a]" />
      </button>
    </>
  )

  return (
    <>
      {/* ── Desktop: thumbnails left + full aspect-ratio main image ── */}
      <div className="hidden lg:flex gap-3 items-start">
        {slike.length > 1 && <div className="flex flex-col gap-2 shrink-0">{thumbs(true)}</div>}
        <div className="flex-1">
          <div
            className="relative overflow-hidden bg-[#f0ebe5] group/img cursor-zoom-in"
            style={{ aspectRatio: '3/4' }}
            onClick={() => { if (!didSwipe.current) setLightbox(true) }}
            {...swipeHandlers}
          >
            {imageContent}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-sm p-1.5">
              <ZoomIn size={13} strokeWidth={1.5} className="text-white" />
            </div>
            {navArrows(true)}
          </div>
        </div>
      </div>

      {/* ── Mobile: capped height image + thumbnails below ── */}
      <div className="lg:hidden flex flex-col gap-2.5">
        {/* Image capped at 52vh so name/price visible without scrolling */}
        <div
          className="relative overflow-hidden bg-[#f0ebe5] group/img cursor-zoom-in w-full"
          style={{ height: 'min(52vh, calc(100vw * 4 / 3))' }}
          onClick={() => { if (!didSwipe.current) setLightbox(true) }}
          {...swipeHandlers}
        >
          {imageContent}
          {/* Swipe hint dots */}
          {slike.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
              {slike.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-200',
                    i === aktivna ? 'bg-white scale-110' : 'bg-white/40'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {slike.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
            {thumbs(false)}
          </div>
        )}
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              key="lb-backdrop"
              className="fixed inset-0 bg-black/92 z-[200]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightbox(false)}
            />
            <motion.div
              key="lb-content"
              className="fixed inset-0 z-[201] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* Counter */}
              {slike.length > 1 && (
                <p className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] uppercase text-white/40 z-10 select-none" style={{ fontFamily: 'var(--font-sans)' }}>
                  {aktivna + 1} / {slike.length}
                </p>
              )}

              {/* Image — swipeable */}
              <div
                className="relative"
                style={{ width: 'min(90vw, calc(82vh * 3 / 4))', aspectRatio: '3/4' }}
                onClick={e => e.stopPropagation()}
                {...swipeHandlers}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={aktivna}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0"
                  >
                    <Image src={slike[aktivna]} alt={`${naziv} — slika ${aktivna + 1}`} fill sizes="90vw" className="object-contain" priority />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev/Next — desktop only (mobile uses swipe) */}
              {slike.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); prev() }}
                    className="hidden lg:flex absolute left-8 w-11 h-11 items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); next() }}
                    className="hidden lg:flex absolute right-8 w-11 h-11 items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {slike.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {slike.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={e => { e.stopPropagation(); setAktivna(i) }}
                      className={cn('w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer', i === aktivna ? 'bg-white scale-125' : 'bg-white/35 hover:bg-white/60')}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
