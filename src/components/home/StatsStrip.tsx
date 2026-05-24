'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

const STATS = [
  { broj: 200, sufiks: '+', opis: 'haljina u kolekciji' },
  { broj: 2018, sufiks: '.', opis: 'godina osnivanja' },
  { broj: 1000, sufiks: '+', opis: 'zadovoljnih klijentkinja' },
  { broj: 100, sufiks: '%', opis: 'individualni pristup' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(count, value, {
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
    })
    return controls.stop
  }, [isInView, value, count])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}

export default function StatsStrip() {
  return (
    <section className="bg-[#faf7f4] border-y border-[#e8e0d8] py-12 lg:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.opis}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span
                className="text-[clamp(32px,4vw,48px)] font-light text-[#1a1a1a] leading-none mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <AnimatedNumber value={stat.broj} suffix={stat.sufiks} />
              </span>
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {stat.opis}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
