'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85&fit=crop'

const CTA_IMAGE =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&fit=crop'

const mockHaljine = [
  {
    id: '1',
    slug: 'alba',
    naziv: 'Alba',
    kategorija: 'Vjenčana',
    cijena: '48.000 RSD',
    slika: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=80&fit=crop',
  },
  {
    id: '2',
    slug: 'sera',
    naziv: 'Sera',
    kategorija: 'Koktel',
    cijena: '32.000 RSD',
    slika: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700&q=80&fit=crop',
  },
  {
    id: '3',
    slug: 'luna',
    naziv: 'Luna',
    kategorija: 'Svečana',
    cijena: '56.000 RSD',
    slika: 'https://images.unsplash.com/photo-1566479179817-0b31f9c87e0c?w=700&q=80&fit=crop',
  },
  {
    id: '4',
    slug: 'mila',
    naziv: 'Mila',
    kategorija: 'Maturska',
    cijena: '28.000 RSD',
    slika: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80&fit=crop',
  },
]

const MARQUEE_ITEMS = [
  'Vjenčane haljine',
  'Koktel haljine',
  'Maturske haljine',
  'Svečane haljine',
  'Casual haljine',
  'Po mjeri',
]

export default function TestPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) setProgress((window.scrollY / total) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="bg-[#faf7f4] min-h-screen">

      {/* ── Scroll progress ─────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-[#e8e0d8]">
        <div
          className="h-full bg-[#c9a96e] transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
          01 · HERO — split layout
      ══════════════════════════════════════════════════════════ */}
      <section className="lg:grid lg:grid-cols-[1fr_1px_52%] lg:min-h-screen">

        {/* Left — editorial text panel */}
        <div className="flex flex-col justify-between px-8 pt-24 pb-10 lg:px-14 lg:pt-28 lg:pb-14">

          {/* Top label row */}
          <div className="flex items-center justify-between mb-0">
            <span
              className="text-[9px] tracking-[0.45em] uppercase text-[#8a8a8a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Beograd · Srbija
            </span>
            <span
              className="text-[9px] tracking-[0.35em] text-[#e8e0d8]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              01
            </span>
          </div>

          {/* Main heading block */}
          <div className="py-12 lg:py-0">
            <p
              className="text-[9px] tracking-[0.55em] uppercase text-[#c9a96e] mb-7"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kolekcija · 2025
            </p>

            <h1 className="leading-[0.88] mb-9" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="block text-[clamp(54px,7.5vw,92px)] font-light text-[#1a1a1a] uppercase tracking-[-0.025em]">
                Haljine
              </span>
              <span className="block text-[clamp(38px,5.5vw,66px)] font-light text-[#1a1a1a] italic pl-1">
                koje govore
              </span>
              <span className="block text-[clamp(54px,7.5vw,92px)] font-light text-[#1a1a1a] uppercase tracking-[-0.025em]">
                za&thinsp;vas
              </span>
            </h1>

            {/* Thin gold rule + location */}
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-[#c9a96e]" />
              <span
                className="text-[9px] tracking-[0.45em] uppercase text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Ekskluzivni salon
              </span>
            </div>

            <p
              className="text-[13px] text-[#8a8a8a] leading-[1.75] max-w-[300px] mb-10"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Svaka haljina je priča. Pronađite svoju — od vjenčanih kreacija do koktel modela za svaku posebnu prigodu.
            </p>

            <Link
              href="/katalog"
              className="group inline-flex items-center gap-3 bg-[#1a1a1a] px-8 py-[14px] text-[9px] tracking-[0.35em] uppercase text-[#faf7f4] hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pogledaj kolekciju
              <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Bottom — stats row */}
          <div className="flex items-end gap-10 pt-4 border-t border-[#e8e0d8]">
            {[
              { num: '124+', label: 'modela' },
              { num: '8', label: 'godina' },
              { num: '2.400+', label: 'mušterija' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  className="text-[30px] font-light text-[#1a1a1a] leading-none mb-1"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {num}
                </div>
                <div
                  className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block bg-[#e8e0d8]" />

        {/* Right — full-bleed portrait image */}
        <div className="relative min-h-[70vw] lg:min-h-0 bg-[#f0ebe5] overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="TESORO Couture — elegantna haljina"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover object-top"
          />

          {/* Thin inner frame */}
          <div className="absolute inset-5 border border-white/15 pointer-events-none" />

          {/* Season chip — bottom right */}
          <div className="absolute bottom-7 right-7 bg-[#faf7f4]/90 backdrop-blur-sm px-4 py-3 border border-[#e8e0d8]/60">
            <p
              className="text-[8px] tracking-[0.45em] uppercase text-[#8a8a8a] mb-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Proljeće · Ljeto
            </p>
            <p
              className="text-[20px] font-light text-[#1a1a1a] leading-none"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              2025
            </p>
          </div>

          {/* Scroll indicator — bottom centre */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 lg:flex hidden">
            <div className="w-px h-10 bg-white/40 relative overflow-hidden">
              <div className="absolute top-0 w-full bg-white/80 animate-[scroll-line_1.8s_ease-in-out_infinite]" style={{ height: '40%' }} />
            </div>
            <span
              className="text-[7px] tracking-[0.5em] uppercase text-white/50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          Marquee strip
      ══════════════════════════════════════════════════════════ */}
      <div className="border-y border-[#e8e0d8] py-[11px] overflow-hidden bg-[#faf7f4]">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8 shrink-0">
              <span
                className="text-[9px] tracking-[0.5em] uppercase text-[#1a1a1a] px-8"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {item}
              </span>
              <span className="text-[#c9a96e] text-[10px]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          02 · FEATURED — horizontal scroll
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">

        {/* Section header */}
        <div className="px-8 lg:px-14 mb-12 flex items-end justify-between">
          <div>
            <span
              className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] block mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              02 · Istaknuto
            </span>
            <h2
              className="text-[clamp(28px,3.5vw,46px)] font-light text-[#1a1a1a] leading-[1.05]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Odabrane<br />
              <span className="italic">kreacije</span>
            </h2>
          </div>
          <Link
            href="/katalog"
            className="hidden lg:flex items-center gap-2 text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors duration-300 cursor-pointer group"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Ceo katalog
            <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-5 overflow-x-auto scrollbar-none px-8 lg:px-14 pb-2">
          {mockHaljine.map((h, i) => (
            <Link
              key={h.id}
              href={`/haljina/${h.slug}`}
              className="group flex-none w-[220px] sm:w-[260px] lg:w-[290px] cursor-pointer"
            >
              <div
                className="relative overflow-hidden bg-[#f0ebe5]"
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={h.slika}
                  alt={h.naziv}
                  fill
                  sizes="290px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/18 transition-all duration-500" />

                {/* Index badge */}
                <div className="absolute top-3 left-3 w-7 h-7 bg-[#faf7f4]/88 flex items-center justify-center">
                  <span
                    className="text-[9px] text-[#8a8a8a]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* Category chip on hover */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <span
                    className="bg-[#faf7f4]/90 backdrop-blur-sm px-4 py-2 text-[8px] tracking-[0.35em] uppercase text-[#1a1a1a]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {h.kategorija}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-2">
                <h3
                  className="text-[15px] font-light text-[#1a1a1a] group-hover:text-[#c9a96e] transition-colors duration-300 leading-tight"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {h.naziv}
                </h3>
                <span
                  className="text-[10px] text-[#8a8a8a] shrink-0"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {h.cijena}
                </span>
              </div>
            </Link>
          ))}

          {/* Ghost card — view all */}
          <Link
            href="/katalog"
            className="group flex-none w-[220px] sm:w-[260px] lg:w-[290px] cursor-pointer"
          >
            <div
              className="border border-[#e8e0d8] group-hover:border-[#c9a96e] transition-colors duration-300 flex flex-col items-center justify-center gap-5"
              style={{ aspectRatio: '3/4' }}
            >
              <div className="w-11 h-11 rounded-full border border-[#e8e0d8] group-hover:border-[#c9a96e] flex items-center justify-center transition-colors duration-300">
                <ArrowRight
                  size={14}
                  className="text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors duration-300"
                />
              </div>
              <span
                className="text-[9px] tracking-[0.4em] uppercase text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors duration-300"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Svi modeli
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          03 · PULL QUOTE
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36 border-t border-[#e8e0d8] overflow-hidden">
        <div className="px-8 lg:px-14">
          <span
            className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] block mb-14"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            03 · Filozofija
          </span>
          <blockquote
            className="text-[clamp(30px,5vw,68px)] font-light italic text-[#1a1a1a] leading-[1.18] max-w-[14ch]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            &ldquo;Svaka haljina nosi priču o ženi koja je nosi.&rdquo;
          </blockquote>
          <footer className="mt-12 flex items-center gap-6">
            <span className="block h-px w-10 bg-[#c9a96e]" />
            <div>
              <p
                className="text-[11px] tracking-[0.25em] uppercase text-[#1a1a1a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                TESORO Couture
              </p>
              <p
                className="text-[10px] tracking-[0.2em] text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Beograd · od 2017.
              </p>
            </div>
          </footer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          04 · CTA — split image + dark panel
      ══════════════════════════════════════════════════════════ */}
      <section className="lg:grid lg:grid-cols-2 border-t border-[#e8e0d8]">

        {/* Image side */}
        <div className="relative min-h-[55vw] lg:min-h-0 bg-[#f0ebe5] overflow-hidden order-2 lg:order-1">
          <Image
            src={CTA_IMAGE}
            alt="Rezervišite termin u TESORO Couture salonu"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20 bg-[#1a1a1a] order-1 lg:order-2">
          <span
            className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] block mb-10"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            04 · Rezervacija
          </span>
          <h2
            className="text-[clamp(30px,3.5vw,52px)] font-light text-[#faf7f4] leading-[1.12] mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Pronađite haljinu<br />
            <span className="italic">svog života</span>
          </h2>
          <p
            className="text-[13px] text-[#faf7f4]/60 leading-[1.75] mb-12 max-w-[340px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Posjetite nas i uz stručni savjet naših stilista pronađite savršenu haljinu. Besplatan termin, bez obaveza.
          </p>

          <Link
            href="/rezervacija"
            className="group self-start inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-[14px] text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500 cursor-pointer mb-16"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Zakaži termin
            <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Contact details */}
          <div className="border-t border-[#faf7f4]/10 pt-10 flex flex-col gap-4">
            {[
              { icon: MapPin, text: 'Bulevar Kralja Aleksandra 42, Beograd' },
              { icon: Phone, text: '+381 61 123 45 67' },
              { icon: Mail, text: 'info@tesorocouture.rs' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon size={11} className="text-[#c9a96e] shrink-0" strokeWidth={1.5} />
                <span
                  className="text-[10px] tracking-wide text-[#faf7f4]/45"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
