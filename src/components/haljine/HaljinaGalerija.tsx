'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

type MediaItem = { type: 'image'; src: string } | { type: 'video'; src: string }

interface HaljinaGalerijaProps {
  slike: string[]
  naziv: string
  videoUrl?: string | null
}

export default function HaljinaGalerija({ slike, naziv, videoUrl }: HaljinaGalerijaProps) {
  const media: MediaItem[] = [
    ...slike.map((src) => ({ type: 'image' as const, src })),
    ...(videoUrl ? [{ type: 'video' as const, src: videoUrl }] : []),
  ]
  const total = media.length

  const [aktivna, setAktivna] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [hoverZoom, setHoverZoom] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })

  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)
  const didSwipe = useRef(false)

  const current = media[aktivna]
  const isVideo = current?.type === 'video'

  const prev = useCallback(() => {
    if (isVideo || hoverZoom) { setHoverZoom(false); setZoomOrigin({ x: 50, y: 50 }) }
    setAktivna((i) => (i - 1 + total) % total)
  }, [total, isVideo, hoverZoom])

  const next = useCallback(() => {
    if (isVideo || hoverZoom) { setHoverZoom(false); setZoomOrigin({ x: 50, y: 50 }) }
    setAktivna((i) => (i + 1) % total)
  }, [total, isVideo, hoverZoom])

  useEffect(() => {
    if (isVideo) { setHoverZoom(false); setZoomOrigin({ x: 50, y: 50 }) }
  }, [isVideo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox) setLightbox(false)
        else if (hoverZoom) { setHoverZoom(false); setZoomOrigin({ x: 50, y: 50 }) }
      }
      if (lightbox && e.key === 'ArrowRight') next()
      if (lightbox && e.key === 'ArrowLeft') prev()
    }
    if (lightbox) document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (lightbox) document.body.style.overflow = ''
    }
  }, [lightbox, hoverZoom, next, prev])

  function handleZoomMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hoverZoom || isVideo) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (didSwipe.current || isVideo) return
    if (hoverZoom) {
      setHoverZoom(false)
      setZoomOrigin({ x: 50, y: 50 })
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
    setHoverZoom(true)
  }

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

  if (total === 0) {
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

  function renderMainMedia(inLightbox = false) {
    if (!current) return null
    if (current.type === 'video') {
      return (
         
        <video
          key={current.src}
          src={current.src}
          autoPlay
          muted={!inLightbox}
          loop
          playsInline
          controls={inLightbox}
          className={cn(
            'absolute inset-0 w-full h-full',
            inLightbox ? 'object-contain' : 'object-cover object-center'
          )}
        />
      )
    }
    return (
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
            src={current.src}
            alt={`${naziv} — slika ${aktivna + 1}`}
            fill
            sizes={inLightbox ? '90vw' : '(max-width: 1024px) 100vw, 60vw'}
            className={inLightbox ? 'object-contain' : 'object-cover object-top'}
            priority
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  function renderThumb(item: MediaItem, i: number, vertical: boolean) {
    return (
      <button
        key={i}
        onClick={() => setAktivna(i)}
        className={cn(
          'relative shrink-0 overflow-hidden transition-all duration-200 cursor-pointer',
          aktivna === i ? 'ring-1 ring-[#c9a96e] opacity-100' : 'opacity-45 hover:opacity-75'
        )}
        style={vertical ? { width: 68, height: 91 } : { width: 56, height: 75 }}
      >
        {item.type === 'image' ? (
          <Image src={item.src} alt={`${naziv} — thumbnail ${i + 1}`} fill sizes="70px" className="object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-center gap-1">
            <Play size={14} strokeWidth={1.5} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-[6px] tracking-[0.2em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>Video</span>
          </div>
        )}
      </button>
    )
  }

  const navArrows = (stopProp = false) => total > 1 && (
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
      {/* ── Desktop ── */}
      <div className="hidden lg:flex gap-3 items-start">
        {total > 1 && (
          <div className="flex flex-col gap-2 shrink-0">
            {media.map((item, i) => renderThumb(item, i, true))}
          </div>
        )}
        <div className="flex-1">
          <div
            className={cn(
              'relative overflow-hidden bg-[#f0ebe5] group/img',
              isVideo ? 'cursor-default bg-black' : hoverZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
            )}
            style={{ aspectRatio: '3/4' }}
            onMouseMove={handleZoomMove}
            onClick={handleImageClick}
            {...swipeHandlers}
          >
            {isVideo ? (
              renderMainMedia(false)
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: hoverZoom ? 'scale(2)' : 'scale(1)',
                  transition: hoverZoom ? 'transform 0.25s ease-out' : 'transform 0.2s ease-out',
                }}
              >
                {renderMainMedia(false)}
              </div>
            )}
            {!isVideo && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setHoverZoom(false); setZoomOrigin({ x: 50, y: 50 }); setLightbox(true) }}
                className="absolute bottom-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-sm p-1.5 hover:bg-black/50 cursor-pointer"
                title="Fullscreen"
              >
                <ZoomIn size={13} strokeWidth={1.5} className="text-white" />
              </button>
            )}
            {!hoverZoom && navArrows(true)}
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="lg:hidden flex flex-col gap-2.5">
        <div
          className={cn(
            'relative overflow-hidden group/img w-full',
            isVideo ? 'bg-black' : 'bg-[#f0ebe5] cursor-zoom-in'
          )}
          style={{ height: 'min(52vh, calc(100vw * 4 / 3))' }}
          onClick={() => { if (!didSwipe.current && !isVideo) setLightbox(true) }}
          {...swipeHandlers}
        >
          {renderMainMedia(false)}
          {!isVideo && total > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
              {media.map((_, i) => (
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
        {total > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
            {media.map((item, i) => renderThumb(item, i, false))}
          </div>
        )}
      </div>

      {/* ── Lightbox — only for images ── */}
      <AnimatePresence>
        {lightbox && !isVideo && (
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
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {total > 1 && (
                <p className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] uppercase text-white/40 z-10 select-none" style={{ fontFamily: 'var(--font-sans)' }}>
                  {aktivna + 1} / {total}
                </p>
              )}

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
                    {current?.type === 'image' && (
                      <Image src={current.src} alt={`${naziv} — slika ${aktivna + 1}`} fill sizes="90vw" className="object-contain" priority />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {total > 1 && (
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

              {total > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {media.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={e => { e.stopPropagation(); setAktivna(i) }}
                      className={cn(
                        'transition-all duration-200 cursor-pointer',
                        item.type === 'video'
                          ? cn('w-4 h-1.5 rounded-full', i === aktivna ? 'bg-[#c9a96e]' : 'bg-white/35 hover:bg-white/60')
                          : cn('w-1.5 h-1.5 rounded-full', i === aktivna ? 'bg-white scale-125' : 'bg-white/35 hover:bg-white/60')
                      )}
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
