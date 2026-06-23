'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  )
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
    naziv: 'Šivenje po meri',
    opis: 'Kako su nam bitni krojevi i znamo da se svaka žena ne uklapa u standardne krojeve, nudimo vam izradu po vašim ličnim merama.',
  },
  {
    broj: '02',
    naziv: 'Izbor materijala i boja',
    opis: 'U našoj ponudi možete pronaći veliki izbor različitih materijala i izradu haljina u boji po želji.',
  },
  {
    broj: '03',
    naziv: 'Individualan pristup',
    opis: 'Svaka klijentkinja je jedinstvena. Posvećujemo vam puno vreme i pažnju kako biste pronašli haljinu koja govori upravo vašim jezikom.',
  },
  {
    broj: '04',
    naziv: 'Besprekorna izrada',
    opis: 'Za vas biramo najkvalitetnije materijale i obraćamo pažnju na svaki detalj.',
  },
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
              TESORO je domaći brend osnovan 2020. godine u Beogradu sa ciljem da se svaka žena oseća glamurozno, ženstveno i samouvereno. Naš dizajn se ogleda u neprolaznoj eleganciji, preciznim krojevima i kvalitetnim materijalima u kojima će se svaka žena osećati zadovoljno i samouvereno.
            </p>
            <p className="text-[13px] text-[#8a8a8a] leading-relaxed mb-4 max-w-sm" style={{ fontFamily: 'var(--font-sans)' }}>
              U Tesoru možete pronaći haljine koje su idealne za različite prilike, bilo da je u pitanju proslava, večernji izlazak, matura, rođendan ili venčanje. Naša ponuda uključuje izradu po merama, određene korekcije haljina, kao i veliki izbor različitih materijala i boja.
            </p>
            <p className="text-[13px] text-[#8a8a8a] leading-relaxed max-w-sm" style={{ fontFamily: 'var(--font-sans)' }}>
              U našem studiu verujemo da ćete pronaći idealnu haljinu za vašu posebnu priliku koja će biti u skladu sa vašim željama i potrebama. Naše haljine nisu birane da budu samo lepe već i da pristaju svakoj građi, da traju i da se pamte.
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
              src="/o-nama.jpeg"
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
                u Beogradu
              </p>
              <p
                className="text-[22px] font-light text-[#faf7f4] italic leading-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Od 2020.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* ── Vrednosti — horizontal rows with huge watermark numbers ──────── */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
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
                viewport={{ once: true, amount: 0.01 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="relative py-9 lg:py-11 flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-14 group overflow-hidden"
              >
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



      {/* ── Kontakt + Mapa ────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-[#faf7f4] border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
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
              viewport={{ once: true, amount: 0.01 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {[
                {
                  icon: MapPin,
                  label: 'Adresa',
                  content: <p className="text-[13px] text-[#1a1a1a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>Jurija Gagarina 151a<br />11070 Beograd, Srbija</p>,
                },
                {
                  icon: Phone,
                  label: 'Telefon',
                  content: <a href="tel:+381654033795" className="text-[13px] text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300" style={{ fontFamily: 'var(--font-sans)' }}>065 403 3795</a>,
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
                      { dan: 'Ponedeljak', vreme: '12:00 – 19:00' },
                      { dan: 'Utorak', vreme: '12:00 – 19:00' },
                      { dan: 'Sreda', vreme: '12:00 – 19:00' },
                      { dan: 'Četvrtak', vreme: '12:00 – 19:00' },
                      { dan: 'Petak', vreme: '12:00 – 19:00' },
                      { dan: 'Subota', vreme: '10:00 – 16:00' },
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
                    { href: 'https://www.facebook.com/Tesoro.couture/', icon: IconFacebook, label: 'Facebook' },
                    { href: 'https://www.tiktok.com/@tesoro_couture', icon: IconTikTok, label: 'TikTok' },
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
              viewport={{ once: true, amount: 0.01 }}
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
          viewport={{ once: true, amount: 0.01 }}
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
