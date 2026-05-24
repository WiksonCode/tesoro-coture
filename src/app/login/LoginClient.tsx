'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
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
        setServerError('Potvrdite email adresu prije prijave.')
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

      {/* Left — editorial panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a1a1a] px-14 py-20 relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[22px] tracking-[0.3em] font-light uppercase text-white" style={{ fontFamily: 'var(--font-serif)' }}>
              TESORO
            </span>
            <span className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5 pl-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              Couture
            </span>
          </Link>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="block h-px w-10 bg-[#c9a96e]" />
            <span className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
              Dobrodošli nazad
            </span>
          </div>
          <p
            className="text-[clamp(32px,4vw,52px)] font-light italic text-white leading-[1.1]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Nastavite gdje ste<br />stali.
          </p>
          <p className="mt-6 text-[13px] text-white/40 leading-relaxed max-w-[300px]" style={{ fontFamily: 'var(--font-sans)' }}>
            Pristupite vašem profilu, pratite rezervacije i otkrijte nove kolekcije.
          </p>
        </div>

        <p className="relative text-[9px] tracking-[0.25em] text-white/20 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          © 2025 TESORO Couture
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-8 py-20 lg:px-16 bg-[#faf7f4] pt-28 lg:pt-20">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[20px] tracking-[0.3em] font-light uppercase text-[#1a1a1a]" style={{ fontFamily: 'var(--font-serif)' }}>
              TESORO
            </span>
            <span className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5 pl-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
              Couture
            </span>
          </Link>
        </div>

        <div className="max-w-[400px] w-full mx-auto lg:mx-0">
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            Prijava
          </p>
          <h1 className="text-[28px] font-light text-[#1a1a1a] mb-10" style={{ fontFamily: 'var(--font-serif)' }}>
            Unesite vaše podatke
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                Email adresa
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={cn(
                  'w-full border bg-white px-4 py-3.5 text-[14px] text-[#1a1a1a] outline-none transition-colors duration-200 placeholder-[#8a8a8a]/50',
                  errors.email ? 'border-red-300 focus:border-red-400' : 'border-[#e8e0d8] focus:border-[#1a1a1a]'
                )}
                placeholder="vas@email.com"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
              {errors.email && (
                <p className="mt-1.5 text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                Lozinka
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={cn(
                    'w-full border bg-white px-4 py-3.5 pr-12 text-[14px] text-[#1a1a1a] outline-none transition-colors duration-200',
                    errors.password ? 'border-red-300 focus:border-red-400' : 'border-[#e8e0d8] focus:border-[#1a1a1a]'
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
            </div>

            {/* Server error */}
            {serverError && (
              <div className="border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-[12px] text-red-600" style={{ fontFamily: 'var(--font-sans)' }}>
                  {serverError}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#faf7f4] px-8 py-4 text-[9px] tracking-[0.35em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {isSubmitting ? 'Prijava...' : 'Prijavite se'}
              {!isSubmitting && (
                <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-8 pt-8 border-t border-[#e8e0d8]">
            <p className="text-[12px] text-[#8a8a8a] text-center" style={{ fontFamily: 'var(--font-sans)' }}>
              Nemate nalog?{' '}
              <Link
                href="/registracija"
                className="text-[#1a1a1a] border-b border-[#1a1a1a] hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors duration-200"
              >
                Registrujte se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
