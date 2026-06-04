'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

// ─── Count-up ─────────────────────────────────────────────────────────────────

function CountUp({ to, suffix = '', duration = 2200 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Foto Placeholder ─────────────────────────────────────────────────────────

function FotoPlaceholder({ initial = 'T', label }: { initial?: string; label?: string }) {
  const id = `diag-${initial}`
  return (
    <div className="absolute inset-0 bg-[#141414] overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <pattern id={id} patternUnits="userSpaceOnUse" width="28" height="28" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="28" stroke="#c9a96e" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} opacity="0.07" />
      </svg>
      {/* Corner brackets */}
      <span className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#c9a96e]/35" />
      <span className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[#c9a96e]/35" />
      <span className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-[#c9a96e]/35" />
      <span className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#c9a96e]/35" />
      {/* Monogram */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <span
          className="text-[160px] font-light italic leading-none text-[#c9a96e]/10 select-none"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {initial}
        </span>
        {label && (
          <p className="text-[7px] tracking-[0.75em] uppercase text-[#c9a96e]/20" style={{ fontFamily: 'var(--font-sans)' }}>
            {label}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const VREDNOSTI = [
  {
    broj: '01',
    naziv: 'Individualni pristup',
    opis: 'Svaka klijentkinja je jedinstvena. Posvećujemo vam puno vreme i pažnju kako biste pronašli haljinu koja govori upravo vašim jezikom.',
  },
  {
    broj: '02',
    naziv: 'Ekskluzivna kolekcija',
    opis: 'Biramo samo najlepše kreacije od proverenih dizajnera. Naša kolekcija se stalno obnavlja, donoseći najnovije trendove i večne klasike.',
  },
  {
    broj: '03',
    naziv: 'Krojenje po meri',
    opis: 'Savršen kroj je naša opsesija. Nudimo uslugu krojenja po meri za sve prilike — od venčanja do maturskih večeri.',
  },
  {
    broj: '04',
    naziv: 'Iskustvo koje traje',
    opis: 'Dolazak u TESORO nije samo kupovina — to je iskustvo. Topla atmosfera i tim koji iskreno brine o vama.',
  },
]

const MARQUEE_ITEMS = [
  'Individualnost', 'Elegancija', 'Kvalitet', 'Beograd', '2018',
  'Couture', 'Savršenstvo', 'Stil', 'Lepota', 'Ženstvenost',
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ONamaContent() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-20 relative">

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none select-none"
        style={{
          zIndex: 9998,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          opacity: 0.025,
          mixBlendMode: 'multiply',
        }}
        aria-hidden
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#e8e0d8] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] min-h-[580px] lg:min-h-[700px]">

          {/* Left — text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="flex flex-col justify-center px-6 lg:px-14 py-20 lg:py-32"
          >
            <p
              className="text-[9px] tracking-[0.55em] uppercase text-[#c9a96e] mb-7"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              O salonu
            </p>
            <h1
              className="text-[clamp(40px,5.5vw,72px)] font-light text-[#1a1a1a] leading-[1.02] mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Više od haljine —<br />
              <span className="italic">priča o<br />ženstvenosti</span>
            </h1>
            <div className="w-12 h-[1.5px] bg-[#c9a96e] mb-8" />
            <p className="text-[13px] text-[#8a8a8a] leading-relaxed mb-4 max-w-sm" style={{ fontFamily: 'var(--font-sans)' }}>
              TESORO Couture je beogradski salon koji od 2018. godine pomaže ženama da pronađu haljinu koja ih čini neponovljivim.
            </p>
            <p className="text-[13px] text-[#8a8a8a] leading-relaxed max-w-sm" style={{ fontFamily: 'var(--font-sans)' }}>
              Naše ime znači "blago" na italijanskom — jer verujemo da je svaka žena dragocena, a savršena haljina samo naglašava tu istinu.
            </p>
          </motion.div>

          {/* Right — full-height photo */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
            className="relative min-h-[420px] lg:min-h-0"
          >
            <Image
              src="/haljina1.jpg"
              alt="TESORO Couture salon"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
            />

            {/* "Od 2018" badge overlaps left edge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute bottom-8 -left-3 lg:-left-6 bg-[#1a1a1a] px-7 py-5 z-10 shadow-2xl"
            >
              <p
                className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1.5"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Beogradski salon
              </p>
              <p
                className="text-[22px] font-light text-[#faf7f4] italic leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Od 2018.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Filozofija ────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-[#141414] overflow-hidden relative">
        {/* Giant T */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden" aria-hidden>
          <span
            className="block leading-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(220px, 42vw, 560px)',
              color: 'rgba(201,169,110,0.035)',
              marginRight: '-0.12em',
            }}
          >
            T
          </span>
        </div>
        {/* Decorative opening quote */}
        <div
          className="absolute top-4 left-6 lg:left-12 leading-none select-none pointer-events-none text-[#c9a96e]/10"
          style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(100px, 18vw, 180px)' }}
          aria-hidden
        >
          "
        </div>

        <div className="max-w-4xl mx-auto relative">
          <span
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]/45 mb-8 block"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Naša filozofija
          </span>

          <motion.blockquote
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-[clamp(22px,3.8vw,46px)] font-light italic text-[#faf7f4]/88 leading-[1.3]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              "Svaka haljina koju stvorimo nosi u sebi priču o ženi koja će je nositi — njenu snagu, njenu lepotu, njen jedinstven trenutak."
            </p>
          </motion.blockquote>

          <div className="mt-10 flex items-center gap-4">
            <div className="w-8 h-px bg-[#c9a96e]/35" />
            <p
              className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/40"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Osnivačica, TESORO Couture
            </p>
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <div className="bg-[#c9a96e] py-3 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0">
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center gap-6">
                  <span
                    className="text-[10px] tracking-[0.5em] uppercase text-[#1a1a1a] px-6"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {item}
                  </span>
                  <span className="text-[#1a1a1a]/30 text-xs">·</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Vrednosti — horizontal rows with huge watermark numbers ──────── */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 lg:mb-14"
          >
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Naše vrednosti
            </p>
            <h2
              className="text-[clamp(28px,4vw,52px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Zašto odabrati <span className="italic">TESORO</span>
            </h2>
          </motion.div>

          <div className="divide-y divide-[#e8e0d8] border-t border-[#e8e0d8]">
            {VREDNOSTI.map((v, i) => (
              <motion.div
                key={v.naziv}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="relative py-9 lg:py-11 flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-14 group overflow-hidden"
              >
                {/* Huge watermark number */}
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-light leading-none select-none pointer-events-none transition-colors duration-700"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(90px, 16vw, 200px)',
                    color: 'rgba(232,224,216,0.5)',
                  }}
                  aria-hidden
                >
                  {v.broj}
                </span>

                {/* Index */}
                <span
                  className="text-[11px] tracking-[0.45em] text-[#c9a96e] shrink-0 w-10 font-light"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {v.broj}
                </span>

                {/* Vertical divider — desktop only */}
                <div className="hidden sm:block w-px h-10 bg-[#e8e0d8] shrink-0" />

                {/* Content */}
                <div className="relative z-10 flex-1 max-w-lg">
                  <h3
                    className="text-[18px] lg:text-[21px] font-light text-[#1a1a1a] mb-2.5 leading-snug"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {v.naziv}
                  </h3>
                  <p
                    className="text-[12px] lg:text-[13px] text-[#8a8a8a] leading-relaxed"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {v.opis}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Naša priča — gold vertical line + pull quote ──────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-[#faf7f4] border-b border-[#e8e0d8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Naša priča
            </p>
            <h2
              className="text-[clamp(28px,4vw,46px)] font-light text-[#1a1a1a] leading-tight mb-12"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Sve je počelo jednom<br />
              <span className="italic">savršenom haljinom</span>
            </h2>
          </motion.div>

          <div className="flex gap-8 lg:gap-12">
            {/* Vertical gold line */}
            <div
              className="hidden lg:block w-px shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #c9a96e 0%, rgba(201,169,110,0.4) 60%, transparent 100%)',
                minHeight: '100%',
                alignSelf: 'stretch',
              }}
            />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex-1 flex flex-col gap-6"
            >
              <p
                className="text-[13px] text-[#8a8a8a] leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                TESORO Couture je osnovan 2018. godine sa jednom jedinom misijom: napraviti mesto gde svaka žena može pronaći haljinu koja govori njenom jeziku. Ne haljinu koja je modna u ovom trenutku — već haljinu koja je večna.
              </p>

              {/* Pull quote */}
              <blockquote className="relative pl-6 py-4 my-2 border-l-[2px] border-[#c9a96e]">
                <p
                  className="text-[18px] lg:text-[22px] font-light italic text-[#1a1a1a] leading-[1.45]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Naš salon se nalazi u srcu Beograda. Interijeri su dizajnirani da odišu toplinom i elegancijom — jer verujemo da iskustvo počinje već na ulaznim vratima.
                </p>
              </blockquote>

              <p
                className="text-[13px] text-[#8a8a8a] leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Radimo sa dizajnerima iz Srbije, Italije i Francuske. Svaki komad prolazi rigoroznu selekciju: kvalitet materijala, kroj, i ono neuhvatljivo — osećaj koji dobijate kada je obučete.
              </p>
              <p
                className="text-[13px] text-[#8a8a8a] leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Tokom godina, pomogli smo stotinama žena da pronađu haljinu za najvažnije trenutke svog života. To je privilegija koju ne uzimamo zdravo za gotovo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── O vlasnici ────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-white border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Photo */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/haljina1.jpg"
                  alt="Milica Janković, osnivačica TESORO Couture"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#c9a96e] px-6 py-4 hidden lg:block">
                <p
                  className="text-[8px] tracking-[0.4em] uppercase text-[#1a1a1a] mb-0.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Osnivačica
                </p>
                <p
                  className="text-base font-light text-[#1a1a1a] italic"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  TESORO Couture
                </p>
              </div>
            </motion.div>

            {/* Text + dramatic stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p
                className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Vlasnica salona
              </p>
              <h2
                className="text-[clamp(28px,4vw,50px)] font-light text-[#1a1a1a] leading-tight mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Milica Janković
              </h2>
              <p
                className="text-sm italic text-[#c9a96e] mb-8"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Stilistkinja & Osnivačica
              </p>
              <div className="w-10 h-[1.5px] bg-[#c9a96e] mb-8" />

              <div
                className="flex flex-col gap-5 text-[13px] text-[#8a8a8a] leading-relaxed mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <p>
                  Milica je svoju ljubav prema modi pretvorila u poziv još kao tinejdžerka, prativi kolekcije iz Pariza i Milana. Nakon studija dizajna u Beogradu i stažiranja u Italiji, 2018. osnovala je TESORO Couture.
                </p>
                <p>
                  Ono što je izdvaja nije samo impresivno oko za detalje — već iskrena posvećenost svakoj klijentkinji. Za Milicu, pronalaženje savršene haljine nije transakcija, već razgovor.
                </p>
              </div>

              <p
                className="text-[16px] lg:text-[18px] italic text-[#1a1a1a]/65 leading-[1.5] mb-10"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                "Žena ne treba da se uklopi u haljinu — haljina treba da se uklopi u nju."
              </p>

              {/* Dramatic stat block */}
              <div className="grid grid-cols-3 border border-[#e8e0d8] divide-x divide-[#e8e0d8]">
                {[
                  { to: 500, suffix: '+', label: 'Klijentkinja' },
                  { to: 15, suffix: '+', label: 'God. iskustva' },
                  { to: 3, suffix: '', label: 'Nagrade' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center py-7 px-4">
                    <span
                      className="text-[38px] lg:text-[52px] font-light leading-none text-[#1a1a1a] tabular-nums"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <CountUp to={stat.to} suffix={stat.suffix} duration={2200} />
                    </span>
                    <span className="w-5 h-px bg-[#c9a96e] my-3" />
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Kontakt + Mapa ────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-[#faf7f4] border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kontakt
            </p>
            <h2
              className="text-[clamp(28px,4vw,52px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Pronađite nas<br />
              <span className="italic">u Beogradu</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {[
                {
                  icon: MapPin,
                  label: 'Adresa',
                  content: <p className="text-[13px] text-[#1a1a1a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>Knez Mihailova 14<br />11000 Beograd, Srbija</p>,
                },
                {
                  icon: Phone,
                  label: 'Telefon',
                  content: <a href="tel:+381111234567" className="text-[13px] text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300" style={{ fontFamily: 'var(--font-sans)' }}>+381 11 123 4567</a>,
                },
                {
                  icon: Mail,
                  label: 'Email',
                  content: <a href="mailto:info@tesorocouture.rs" className="text-[13px] text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300" style={{ fontFamily: 'var(--font-sans)' }}>info@tesorocouture.rs</a>,
                },
              ].map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                    <Icon size={14} strokeWidth={1.5} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
                      {label}
                    </p>
                    {content}
                  </div>
                </div>
              ))}

              {/* Radno vreme */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                  <Clock size={14} strokeWidth={1.5} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-2.5" style={{ fontFamily: 'var(--font-sans)' }}>
                    Radno vreme
                  </p>
                  <div className="flex flex-col gap-1.5" style={{ fontFamily: 'var(--font-sans)' }}>
                    {[
                      { dan: 'Ponedeljak – Petak', vreme: '10:00 – 20:00' },
                      { dan: 'Subota', vreme: '10:00 – 17:00' },
                      { dan: 'Nedelja', vreme: 'Po dogovoru' },
                    ].map(({ dan, vreme }) => (
                      <div key={dan} className="flex justify-between gap-8">
                        <span className="text-[12px] text-[#1a1a1a]">{dan}</span>
                        <span className="text-[12px] text-[#8a8a8a]">{vreme}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                  Pratite nas
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { href: 'https://www.instagram.com/tesoro_couture/', icon: IconInstagram, label: 'Instagram' },
                    { href: 'https://www.facebook.com', icon: IconFacebook, label: 'Facebook' },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 border border-[#e8e0d8] px-4 py-2.5 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 transition-all duration-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors" />
                      <span
                        className="text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[420px] lg:h-full min-h-[380px] overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.9706587842456!2d20.386919299999995!3d44.8017866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6f3fb11a7287%3A0xbfae49a9b699ac4c!2sTesoro%20Couture!5e0!3m2!1sen!2srs!4v1780604882822!5m2!1sen!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(30%) contrast(1.05) brightness(0.96)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="TESORO Couture lokacija"
                />
              </div>
              <div className="absolute top-4 left-4 bg-[#141414] px-4 py-3">
                <p className="text-[8px] tracking-[0.4em] uppercase text-[#c9a96e] mb-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  TESORO Couture
                </p>
                <p className="text-[9px] text-[#faf7f4]/55" style={{ fontFamily: 'var(--font-sans)' }}>
                  Knez Mihailova 14, Beograd
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Poseta salonu
          </p>
          <h2
            className="text-[clamp(28px,4vw,50px)] font-light text-[#1a1a1a] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Upoznajte nas<br />
            <span className="italic">lično</span>
          </h2>
          <p
            className="text-[13px] text-[#8a8a8a] leading-relaxed mb-10"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Rezervišite besplatan termin i doživite TESORO iskustvo.<br />
            Čekaju vas naše konsultantkinje i cela kolekcija.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rezervacija"
              className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-[#faf7f4] px-10 py-4 text-[10px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Zakaži termin
              <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] border-b border-[#e8e0d8] hover:text-[#1a1a1a] hover:border-[#1a1a1a] pb-1 transition-all duration-300"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Pogledaj kolekciju
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
