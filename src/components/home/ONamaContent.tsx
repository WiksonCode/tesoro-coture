'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react'

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function ONamaContent() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-20">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#e8e0d8] overflow-hidden">
        {/* Dekorativni rotiran tekst */}
        <div
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 select-none pointer-events-none hidden lg:block"
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
        >
          <span
            className="text-[11px] tracking-[0.6em] uppercase text-[#e8e0d8]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            TESORO · COUTURE · BEOGRAD · 2018
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p
                className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                O salonu
              </p>
              <h1
                className="text-[clamp(36px,5vw,64px)] font-light text-[#1a1a1a] leading-[1.05] mb-8"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Više od haljine —<br />
                <span className="italic">priča o ženstvenosti</span>
              </h1>
              <div className="w-10 h-px bg-[#c9a96e] mb-8" />
              <p
                className="text-sm text-[#8a8a8a] leading-relaxed mb-5 max-w-md"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                TESORO Couture je beogradski salon koji od 2018. godine pomaže ženama da pronađu haljinu koja ih čini neponovljivim.
              </p>
              <p
                className="text-sm text-[#8a8a8a] leading-relaxed max-w-md"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Naše ime znači "blago" na italijanskom — jer verujemo da je svaka žena dragocena, a savršena haljina samo naglašava tu istinu.
              </p>
            </motion.div>

            {/* Placeholder slika */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] bg-[#f0ebe5] overflow-hidden">
                <span className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#c9a96e]" />
                <span className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#c9a96e]" />
                <span className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#c9a96e]" />
                <span className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#c9a96e]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span
                    className="text-[120px] font-light italic leading-none select-none"
                    style={{ fontFamily: 'var(--font-serif)', color: 'rgba(26,26,26,0.07)' }}
                  >
                    T
                  </span>
                  <p
                    className="text-[8px] tracking-[0.6em] uppercase text-[#8a8a8a]/40"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Tesoro Couture
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-[#1a1a1a] px-8 py-6 hidden lg:block">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Beogradski salon
                </p>
                <p
                  className="text-2xl font-light text-[#faf7f4] italic"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Od 2018.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Filozofija — velika citata ────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-[#1a1a1a] overflow-hidden relative">
        {/* Dekorativno T u pozadini */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden">
          <span
            className="block leading-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(200px, 40vw, 500px)',
              color: 'rgba(201, 169, 110, 0.04)',
              marginRight: '-0.15em',
            }}
          >
            T
          </span>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <span
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]/50 mb-6 block"
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
              className="text-[clamp(24px,4vw,48px)] font-light italic text-[#faf7f4]/90 leading-[1.25]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              "Svaka haljina koju stvorimo nosi u sebi priču o ženi koja će je nositi — njenu snagu, njenu lepotu, njen jedinstven trenutak."
            </p>
          </motion.blockquote>

          <div className="mt-10 flex items-center gap-4">
            <div className="w-8 h-px bg-[#c9a96e]/40" />
            <p
              className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e]/50"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Milica Janković, osnivačica
            </p>
          </div>
        </div>
      </section>

      {/* ── Marquee traka ────────────────────────────────────────── */}
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

      {/* ── Vrednosti ────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-white border-b border-[#e8e0d8]">
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
              Naše vrednosti
            </p>
            <h2
              className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Zašto odabrati <span className="italic">TESORO</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {VREDNOSTI.map((v, i) => (
              <motion.div
                key={v.naziv}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                <p
                  className="text-[48px] font-light text-[#e8e0d8] leading-none mb-4 transition-colors duration-300 group-hover:text-[#c9a96e]/30"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {v.broj}
                </p>
                <h3
                  className="text-base font-light text-[#1a1a1a] mb-3 leading-snug"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {v.naziv}
                </h3>
                <div className="w-6 h-px bg-[#c9a96e] mb-4" />
                <p
                  className="text-sm text-[#8a8a8a] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {v.opis}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Naša priča ───────────────────────────────────────────── */}
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
              className="text-[clamp(28px,4vw,44px)] font-light text-[#1a1a1a] leading-tight mb-8"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Sve je počelo jednom<br />
              <span className="italic">savršenom haljinom</span>
            </h2>
            <div className="w-10 h-px bg-[#c9a96e] mb-10" />

            <div
              className="flex flex-col gap-6 text-sm text-[#8a8a8a] leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <p>
                TESORO Couture je osnovan 2018. godine sa jednom jedinom misijom: napraviti mesto gde svaka žena može pronaći haljinu koja govori njenom jeziku. Ne haljinu koja je modna u ovom trenutku — već haljinu koja je večna.
              </p>
              <p>
                Naš salon se nalazi u srcu Beograda, na Knez Mihailovoj ulici. Interijeri su dizajnirani da odišu toplinom i elegancijom — jer verujemo da iskustvo počinje već na ulaznim vratima.
              </p>
              <p>
                Radimo sa dizajnerima iz Srbije, Italije i Francuske. Svaki komad u kolekciji prolazi rigoroznu selekciju: kvalitet materijala, kroj, i ono neuhvatljivo — osećaj koji dobijate kada je obučete.
              </p>
              <p>
                Tokom godina, pomogli smo stotinama žena da pronađu haljinu za najvažnije trenutke svog života. To je privilegija koju ne uzimamo zdravo za gotovo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── O vlasnici ───────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 px-6 bg-white border-b border-[#e8e0d8]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Foto placeholder */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative aspect-[3/4] bg-[#f0ebe5] overflow-hidden">
                <span className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#c9a96e]" />
                <span className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#c9a96e]" />
                <span className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#c9a96e]" />
                <span className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#c9a96e]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span
                    className="text-[90px] font-light italic leading-none"
                    style={{ fontFamily: 'var(--font-serif)', color: 'rgba(26,26,26,0.07)' }}
                  >
                    M
                  </span>
                  <p
                    className="text-[8px] tracking-[0.5em] uppercase text-[#8a8a8a]/40"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Milica Janković
                  </p>
                </div>
              </div>

              {/* Nalepnica u uglu */}
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

            {/* Tekst o vlasnici */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            >
              <p
                className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Vlasnica salona
              </p>
              <h2
                className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a] leading-tight mb-2"
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
              <div className="w-10 h-px bg-[#c9a96e] mb-8" />

              <div
                className="flex flex-col gap-5 text-sm text-[#8a8a8a] leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <p>
                  Milica je svoju ljubav prema modi pretvorila u poziv još kao tinejdžerka, prativi kolekcije iz Pariza i Milana. Nakon studija dizajn u Beogradu i stažiranja u Italiji, 2018. osnovala je TESORO Couture.
                </p>
                <p>
                  Ono što je izdvaja nije samo impresivno oko za detalje — već iskrena posvećenost svakoj klijentkinji. Za Milicu, pronalaženje savršene haljine nije transakcija, već razgovor. Uslušivanje. Razumevanje.
                </p>
                <p>
                  "Žena ne treba da se uklopi u haljinu — haljina treba da se uklopi u nju." To je filozofija kojom živi svaki dan u salonu.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { broj: '15+', opis: 'godina u modi' },
                  { broj: '500+', opis: 'zadovoljnih klijentkinja' },
                  { broj: '3', opis: 'nagrade za dizajn' },
                ].map((stat) => (
                  <div key={stat.opis} className="flex flex-col">
                    <span
                      className="text-[28px] font-light text-[#1a1a1a] leading-none"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {stat.broj}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] mt-1"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {stat.opis}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Kontakt + Mapa ───────────────────────────────────────── */}
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
              className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Pronađite nas<br />
              <span className="italic">u Beogradu</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Kontakt info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* Adresa */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                  <MapPin size={15} strokeWidth={1.5} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p
                    className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-1.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Adresa
                  </p>
                  <p
                    className="text-sm text-[#1a1a1a] leading-relaxed"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Knez Mihailova 14<br />
                    11000 Beograd, Srbija
                  </p>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                  <Phone size={15} strokeWidth={1.5} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p
                    className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-1.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Telefon
                  </p>
                  <a
                    href="tel:+381111234567"
                    className="text-sm text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    +381 11 123 4567
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                  <Mail size={15} strokeWidth={1.5} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p
                    className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-1.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:info@tesorocouture.rs"
                    className="text-sm text-[#1a1a1a] hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    info@tesorocouture.rs
                  </a>
                </div>
              </div>

              {/* Radno vreme */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#e8e0d8] flex items-center justify-center shrink-0">
                  <Clock size={15} strokeWidth={1.5} className="text-[#c9a96e]" />
                </div>
                <div>
                  <p
                    className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-2"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Radno vreme
                  </p>
                  <div
                    className="text-sm text-[#1a1a1a] flex flex-col gap-1"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <div className="flex justify-between gap-8">
                      <span>Ponedeljak – Petak</span>
                      <span className="text-[#8a8a8a]">10:00 – 20:00</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Subota</span>
                      <span className="text-[#8a8a8a]">10:00 – 17:00</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span>Nedelja</span>
                      <span className="text-[#8a8a8a]">Po dogovoru</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Društvene mreže */}
              <div>
                <p
                  className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-4"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Pratite nas
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 border border-[#e8e0d8] px-4 py-2.5 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 transition-all duration-300"
                  >
                    <IconInstagram className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors" />
                    <span
                      className="text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Instagram
                    </span>
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 border border-[#e8e0d8] px-4 py-2.5 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 transition-all duration-300"
                  >
                    <IconFacebook className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors" />
                    <span
                      className="text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] group-hover:text-[#c9a96e] transition-colors"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Facebook
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Google mapa */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-[420px] lg:h-full min-h-[380px] bg-[#f0ebe5] overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.452059624948!2d20.455022!3d44.816498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7ab409d8d3f3%3A0xb6f3b9e2e47d0ab6!2sKnez%20Mihailova%2C%20Beograd!5e0!3m2!1ssr!2srs!4v1715000000000!5m2!1ssr!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(25%) contrast(1.05) brightness(0.97)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title="TESORO Couture lokacija"
                />
              </div>
              {/* Overlay tag */}
              <div className="absolute top-4 left-4 bg-[#1a1a1a] px-4 py-3">
                <p
                  className="text-[8px] tracking-[0.4em] uppercase text-[#c9a96e] mb-0.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  TESORO Couture
                </p>
                <p
                  className="text-[9px] text-[#faf7f4]/60"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Knez Mihailova 14, Beograd
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
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
            className="text-[clamp(28px,4vw,48px)] font-light text-[#1a1a1a] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Upoznajte nas<br />
            <span className="italic">lično</span>
          </h2>
          <p
            className="text-sm text-[#8a8a8a] leading-relaxed mb-10"
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
