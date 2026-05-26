'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/profil'

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      if (error.message.includes('Invalid login')) {
        setServerError('Pogrešan email ili lozinka.')
      } else if (error.message.includes('Email not confirmed')) {
        setServerError('Potvrdite email adresu pre prijave.')
      } else {
        setServerError('Greška pri prijavi. Pokušajte ponovo.')
      }
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-[45%_55%]">

      {/* Left — editorial dark panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a1a1a] px-14 py-16 relative overflow-hidden">

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Large T monogram — barely-visible atmospheric depth */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="font-light text-white select-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(280px, 38vw, 500px)',
              lineHeight: 1,
              opacity: 0.028,
              letterSpacing: '-0.04em',
            }}
          >
            T
          </span>
        </div>

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="text-[22px] tracking-[0.3em] font-light uppercase text-white group-hover:text-white/80 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              TESORO
            </span>
            <span
              className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5 pl-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Couture
            </span>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="block h-px w-10 bg-[#c9a96e]" />
            <span
              className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Dobrodošli nazad
            </span>
          </div>
          <p
            className="text-[clamp(30px,3.8vw,50px)] font-light italic text-white leading-[1.1]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Nastavite gde ste<br />stali.
          </p>
          <p
            className="mt-6 text-[13px] text-white/55 leading-relaxed max-w-[300px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pristupite vašem profilu, pratite rezervacije i otkrijte nove kolekcije.
          </p>
        </div>

        <p
          className="relative text-[9px] tracking-[0.25em] text-white/35 uppercase"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          © 2025 TESORO Couture
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col min-h-screen px-8 lg:px-16 bg-[#faf7f4]">

        {/* Top bar — back link + mobile logo */}
        <div className="flex items-center justify-between pt-8 pb-0 lg:pt-10">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex flex-col leading-none">
            <span
              className="text-[20px] tracking-[0.3em] font-light uppercase text-[#1a1a1a]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              TESORO
            </span>
            <span
              className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5 pl-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Couture
            </span>
          </Link>
          {/* Back to homepage */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors duration-300 ml-auto"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6" />
            Početna
          </Link>
        </div>

        {/* Center — form */}
        <div className="flex-1 flex flex-col justify-center py-12">
        <div className="max-w-[400px] w-full mx-auto lg:mx-0">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Prijava
            </p>
            <h1
              className="text-[clamp(26px,3vw,36px)] font-light text-[#1a1a1a] leading-tight mb-10"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Unesite vaše podatke
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label
                htmlFor="email"
                className="block text-[11px] tracking-[0.3em] uppercase text-[#6a6a6a] mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Email adresa
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={cn(
                  'w-full border bg-transparent px-4 py-3.5 text-[14px] text-[#1a1a1a] outline-none transition-all duration-200 placeholder-[#8a8a8a]/45',
                  errors.email
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-[#d0c8bf] focus:border-[#1a1a1a]'
                )}
                placeholder="vas@email.com"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
            >
              <label
                htmlFor="password"
                className="block text-[11px] tracking-[0.3em] uppercase text-[#6a6a6a] mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Lozinka
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={cn(
                    'w-full border bg-transparent px-4 py-3.5 pr-12 text-[14px] text-[#1a1a1a] outline-none transition-all duration-200',
                    errors.password
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-[#d0c8bf] focus:border-[#1a1a1a]'
                  )}
                  placeholder="••••••••"
                  style={{ fontFamily: 'var(--font-sans)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Sakrij lozinku' : 'Pokaži lozinku'}
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end mt-2">
                <Link
                  href="/zaboravljena-lozinka"
                  className="text-[10px] tracking-[0.1em] text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Zaboravili ste lozinku?
                </Link>
              </div>
            </motion.div>

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-[12px] text-red-600" style={{ fontFamily: 'var(--font-sans)' }}>
                  {serverError}
                </p>
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-3 w-full bg-[#1a1a1a] text-[#faf7f4] px-8 py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {isSubmitting ? 'Prijava...' : 'Prijavite se'}
                {!isSubmitting && (
                  <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </motion.div>
          </form>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-8 pt-8 border-t border-[#e8e0d8]"
          >
            <p
              className="text-[12px] text-[#6a6a6a] text-center"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Nemate nalog?{' '}
              <Link
                href="/registracija"
                className="text-[#1a1a1a] border-b border-[#1a1a1a]/40 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors duration-200"
              >
                Registrujte se
              </Link>
            </p>
          </motion.div>

        </div>
        </div>{/* end center */}

        {/* Bottom — benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pb-10 pt-7 border-t border-[#e8e0d8]"
        >
          <div className="max-w-[400px] lg:max-w-none w-full mx-auto lg:mx-0 grid grid-cols-3 gap-0">
            {[
              { label: 'Rezervacije', desc: 'Pratite status vaših termina u realnom vremenu' },
              { label: 'Istorija', desc: 'Sve vaše rezervacije na jednom mestu' },
              { label: 'Brže', desc: 'Sačuvani podaci za sledeće rezervacije' },
            ].map((item, i) => (
              <div
                key={i}
                className={i > 0 ? 'pl-5 border-l border-[#e8e0d8]' : 'pr-5'}
              >
                <p
                  className="text-[8px] tracking-[0.4em] uppercase text-[#c9a96e] mb-1.5"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[11px] text-[#8a8a8a] leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  )
}
