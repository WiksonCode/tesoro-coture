'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ArrowRight } from 'lucide-react'
import { useKorpa } from '@/store/korpa'
import { rezervacijaSchema, type RezervacijaInput } from '@/lib/validations/rezervacija'
import { formatCijena } from '@/components/haljine/HaljinaCard'
import { cn } from '@/lib/utils'

const KURS = 117

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function FieldInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="group">
      <label
        className="block text-[11px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
        {props.required && <span className="text-[#c9a96e] ml-1">*</span>}
      </label>
      <input
        {...props}
        className={cn(
          'w-full bg-transparent border-0 border-b pb-2.5 text-[13px] text-[#1a1a1a] outline-none transition-colors duration-300 placeholder:text-[#8a8a8a]/40',
          error
            ? 'border-b-red-400/60'
            : 'border-b-[#e8e0d8] focus:border-b-[#c9a96e]'
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-[10px] text-red-400"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function FieldTextarea({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <div>
      <label
        className="block text-[11px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className={cn(
          'w-full bg-transparent border-0 border-b pb-2.5 text-[13px] text-[#1a1a1a] outline-none resize-none transition-colors duration-300 placeholder:text-[#8a8a8a]/40',
          error
            ? 'border-b-red-400/60'
            : 'border-b-[#e8e0d8] focus:border-b-[#c9a96e]'
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      />
    </div>
  )
}

export default function RezervacijaClient() {
  const [mounted, setMounted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { artikli, ocistiKorpu } = useKorpa()
  const ukupno = artikli.reduce((sum, a) => sum + a.cijena_rsd, 0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RezervacijaInput>({
    resolver: zodResolver(rezervacijaSchema),
  })

  useEffect(() => setMounted(true), [])

  const onSubmit = async (data: RezervacijaInput) => {
    setServerError(null)
    try {
      const res = await fetch('/api/rezervacije', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, artikli }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Greška pri slanju rezervacije.')
      }
      setSubmitted(true)
      ocistiKorpu()
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Greška. Pokušajte ponovo.')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border border-[#c9a96e]/30 border-t-[#c9a96e] rounded-full animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-[60vh] flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 border border-[#c9a96e]/30 flex items-center justify-center mb-8 relative"
        >
          <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#c9a96e]/60" />
          <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#c9a96e]/60" />
          <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#c9a96e]/60" />
          <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#c9a96e]/60" />
          <Check size={20} strokeWidth={1.5} className="text-[#c9a96e]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Zahtev primljen
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[clamp(24px,3.5vw,40px)] font-light italic text-[#1a1a1a] mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Hvala na poverenju
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[12px] text-[#8a8a8a] max-w-sm leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Vaš zahtev za rezervaciju je primljen. Naš tim će vas kontaktirati
          radi potvrde termina.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex items-center gap-6 mb-10"
        >
          <div className="text-center">
            <p
              className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-1"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              U roku od
            </p>
            <p
              className="text-[clamp(22px,3vw,32px)] font-light text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              24h
            </p>
          </div>
          <div className="w-px h-10 bg-[#e8e0d8]" />
          <p
            className="text-[11px] text-[#8a8a8a] leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Kontaktiraćemo vas putem<br />telefona ili emaila.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-10 py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#1a1a1a] hover:text-[#faf7f4] transition-all duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Nastavi pregledanje
            <ArrowRight size={11} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Contact info */}
            <div className="mb-10">
              <p
                className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6 pb-3 border-b border-[#e8e0d8]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Kontakt informacije
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <FieldInput
                  label="Ime"
                  required
                  placeholder="Vaše ime"
                  autoComplete="given-name"
                  error={errors.ime?.message}
                  {...register('ime')}
                />
                <FieldInput
                  label="Prezime"
                  required
                  placeholder="Vaše prezime"
                  autoComplete="family-name"
                  error={errors.prezime?.message}
                  {...register('prezime')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <FieldInput
                  label="Telefon"
                  required
                  type="tel"
                  placeholder="+381 60 000 0000"
                  autoComplete="tel"
                  error={errors.telefon?.message}
                  {...register('telefon')}
                />
                <FieldInput
                  label="Email"
                  required
                  type="email"
                  placeholder="vasa@adresa.rs"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            {/* Date & note */}
            <div className="mb-10">
              <p
                className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e] mb-6 pb-3 border-b border-[#e8e0d8]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Termin i napomena
              </p>

              <div className="mb-8">
                <FieldInput
                  label="Željeni datum termina"
                  type="date"
                  required
                  min={getTomorrow()}
                  error={errors.datum_termina?.message}
                  {...register('datum_termina')}
                />
                <p
                  className="mt-2 text-[11px] text-[#8a8a8a]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Datum je okvirni — naš tim će potvrditi dostupnost termina.
                </p>
              </div>

              <FieldTextarea
                label="Napomena"
                placeholder="Posebne napomene, pitanja ili zahtevi…"
                error={errors.napomena?.message}
                {...register('napomena')}
              />
            </div>

            {/* Empty cart warning */}
            {artikli.length === 0 && (
              <div
                className="border border-[#e8e0d8] p-4 mb-8 text-[11px] text-[#8a8a8a]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Vaša korpa je prazna.{' '}
                <Link href="/katalog" className="text-[#c9a96e] hover:underline">
                  Dodajte haljine
                </Link>{' '}
                pre slanja rezervacije.
              </div>
            )}

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-red-200 bg-red-50 p-4 mb-6 text-[11px] text-red-600"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {serverError}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || artikli.length === 0}
              className={cn(
                'w-full flex items-center justify-center gap-3 py-4 px-8 text-[9px] tracking-[0.35em] uppercase transition-all duration-300',
                isSubmitting || artikli.length === 0
                  ? 'bg-[#e8e0d8] text-[#8a8a8a] cursor-not-allowed'
                  : 'bg-[#1a1a1a] text-[#faf7f4] hover:bg-[#c9a96e] hover:text-[#1a1a1a]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Slanje…
                </>
              ) : (
                <>
                  Pošaljite zahtev za rezervaciju
                  <ArrowRight size={11} strokeWidth={1.5} />
                </>
              )}
            </button>

            <p
              className="mt-3 text-[11px] text-center text-[#8a8a8a]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kontaktiraćemo vas u roku od 24 sata putem telefona ili emaila.
            </p>

            <p
              className="mt-3 text-[9px] text-center text-[#8a8a8a]/70"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Rezervacijom prihvatate naše{' '}
              <Link href="/politika-privatnosti" className="underline hover:text-[#c9a96e] transition-colors">
                uslove poslovanja
              </Link>.
            </p>
          </form>
        </motion.div>

        {/* Cart summary */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:border-l lg:border-[#e8e0d8] lg:pl-12"
        >
          <p
            className="text-[9px] tracking-[0.4em] uppercase text-[#8a8a8a] mb-6"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Vaša selekcija
          </p>

          {artikli.length === 0 ? (
            <p
              className="text-[12px] text-[#8a8a8a] italic"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Korpa je prazna
            </p>
          ) : (
            <>
              <div className="space-y-5 mb-6">
                {artikli.map((a, i) => (
                  <div
                    key={a.inventar_id ?? i}
                    className="flex gap-3"
                  >
                    <div
                      className="flex-shrink-0 relative overflow-hidden bg-[#f0ebe5]"
                      style={{ width: 90, aspectRatio: '3/4' }}
                    >
                      {a.slika ? (
                        <Image
                          src={a.slika}
                          alt={a.naziv}
                          fill
                          sizes="90px"
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-2xl font-light italic text-[#1a1a1a]/10"
                            style={{ fontFamily: 'var(--font-serif)' }}
                          >
                            T
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <p
                        className="text-[12px] font-light text-[#1a1a1a] leading-snug mb-1"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {a.naziv}
                      </p>
                      <p
                        className="text-[10px] text-[#8a8a8a]"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {a.boja_naziv} · {a.velicina === 'po_mjeri' ? 'Po meri' : a.velicina}
                      </p>
                      <p
                        className="text-[11px] font-medium text-[#1a1a1a] mt-1"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {formatCijena(a.cijena_rsd)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e8e0d8] pt-5">
                <div className="flex justify-between items-baseline">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Ukupno
                  </span>
                  <div className="text-right">
                    <p
                      className="text-[15px] font-medium text-[#1a1a1a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {formatCijena(ukupno)}
                    </p>
                    <p
                      className="text-[10px] text-[#8a8a8a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      ≈ {Math.round(ukupno / KURS)} €
                    </p>
                  </div>
                </div>
              </div>

              {/* Atelier note */}
              <div className="mt-8 p-4 bg-[#f5ede0]">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase text-[#c9a96e] mb-2"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Napomena salona
                </p>
                <p
                  className="text-[11px] text-[#8a8a8a] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Plaćanje se vrši u salonu prilikom preuzimanja. Rezervacija
                  je besplatna i ne obavezuje na kupovinu.
                </p>
              </div>
            </>
          )}
        </motion.aside>
      </div>
    </div>
  )
}
