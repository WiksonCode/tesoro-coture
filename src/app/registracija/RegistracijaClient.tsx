'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { cn } from '@/lib/utils'

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[9px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegistracijaClient() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ email: string; hasSession: boolean } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterInput) {
    setServerError(null)
    const supabase = createClient()

    console.log('[signUp] pocetak...')
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { ime: data.ime, prezime: data.prezime, telefon: data.telefon },
      },
    })
    console.log('[signUp] kraj:', { user: authData?.user?.id, session: !!authData?.session, error })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('Nalog sa ovim emailom već postoji. Prijavite se.')
      } else {
        setServerError(`Greška: ${error.message}`)
      }
      return
    }

    const hasSession = !!authData.session
    setSuccess({ email: data.email, hasSession })

    if (hasSession) {
      setTimeout(() => {
        router.push('/profil')
        router.refresh()
      }, 2000)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen grid lg:grid-cols-[45%_55%]">
        <div className="hidden lg:flex flex-col justify-between bg-[#1a1a1a] px-14 py-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(#c9a96e 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="relative">
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-[22px] tracking-[0.3em] font-light uppercase text-white" style={{ fontFamily: 'var(--font-serif)' }}>TESORO</span>
              <span className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5 pl-0.5" style={{ fontFamily: 'var(--font-sans)' }}>Couture</span>
            </Link>
          </div>
          <div className="relative">
            <p className="text-[clamp(32px,4vw,52px)] font-light italic text-white leading-[1.1]" style={{ fontFamily: 'var(--font-serif)' }}>
              Dobrodošli<br />u TESORO.
            </p>
          </div>
          <p className="relative text-[9px] tracking-[0.25em] text-white/20 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>© 2025 TESORO Couture</p>
        </div>

        <div className="flex flex-col items-center justify-center px-8 py-20 lg:px-16 bg-[#faf7f4]">
          <div className="max-w-[420px] w-full text-center">
            <div className="w-16 h-16 border border-[#c9a96e]/30 flex items-center justify-center mx-auto mb-8 relative">
              <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#c9a96e]/60" />
              <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#c9a96e]/60" />
              <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#c9a96e]/60" />
              <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#c9a96e]/60" />
              <span className="text-[#c9a96e] text-[22px] font-light" style={{ fontFamily: 'var(--font-serif)' }}>✓</span>
            </div>

            <p className="text-[11px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Nalog kreiran
            </p>
            <h2 className="text-[28px] font-light text-[#1a1a1a] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Uspešno ste se registrovali
            </h2>

            {success.hasSession ? (
              <p className="text-[13px] text-[#8a8a8a] leading-relaxed mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                Preusmereravanje na vaš profil…
              </p>
            ) : (
              <>
                <p className="text-[13px] text-[#8a8a8a] leading-relaxed mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                  Poslali smo email za potvrdu na
                </p>
                <p className="text-[13px] text-[#1a1a1a] font-medium mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                  {success.email}
                </p>
                <p className="text-[11px] text-[#8a8a8a] leading-relaxed mb-8 max-w-xs mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
                  Kliknite na link u emailu da aktivirate nalog, a zatim se prijavite.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Prijavite se
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    )
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full border bg-white px-4 py-3.5 text-[14px] text-[#1a1a1a] outline-none transition-colors duration-200 placeholder-[#8a8a8a]/50',
      hasError ? 'border-red-300 focus:border-red-400' : 'border-[#e8e0d8] focus:border-[#1a1a1a]'
    )

  return (
    <main className="min-h-screen grid lg:grid-cols-[45%_55%]">

      {/* Left — editorial panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a1a1a] px-14 py-20 relative overflow-hidden">
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
              Novi nalog
            </span>
          </div>
          <p
            className="text-[clamp(32px,4vw,52px)] font-light italic text-white leading-[1.1]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Postanite deo<br />TESORO porodice.
          </p>
          <p className="mt-6 text-[13px] text-white/40 leading-relaxed max-w-[300px]" style={{ fontFamily: 'var(--font-sans)' }}>
            Pratite vaše rezervacije, sačuvajte omiljene haljine i budite prvi obavešteni o novim kolekcijama.
          </p>
        </div>

        <p className="relative text-[9px] tracking-[0.25em] text-white/20 uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          © 2025 TESORO Couture
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-8 py-20 lg:px-16 bg-[#faf7f4] pt-28 lg:pt-20 overflow-y-auto">

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

        <div className="max-w-[420px] w-full mx-auto lg:mx-0">
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            Registracija
          </p>
          <h1 className="text-[28px] font-light text-[#1a1a1a] mb-10" style={{ fontFamily: 'var(--font-serif)' }}>
            Kreirajte nalog
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {/* Ime + Prezime */}
            <div className="grid grid-cols-2 gap-4">
              <FormField id="ime" label="Ime" error={errors.ime?.message}>
                <input
                  id="ime"
                  type="text"
                  autoComplete="given-name"
                  {...register('ime')}
                  className={inputClass(!!errors.ime)}
                  placeholder="Marija"
                  style={{ fontFamily: 'var(--font-sans)' }}
                />
              </FormField>
              <FormField id="prezime" label="Prezime" error={errors.prezime?.message}>
                <input
                  id="prezime"
                  type="text"
                  autoComplete="family-name"
                  {...register('prezime')}
                  className={inputClass(!!errors.prezime)}
                  placeholder="Petrović"
                  style={{ fontFamily: 'var(--font-sans)' }}
                />
              </FormField>
            </div>

            {/* Email */}
            <FormField id="email" label="Email adresa" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={inputClass(!!errors.email)}
                placeholder="vas@email.com"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </FormField>

            {/* Telefon */}
            <FormField id="telefon" label="Broj telefona" error={errors.telefon?.message}>
              <input
                id="telefon"
                type="tel"
                autoComplete="tel"
                {...register('telefon')}
                className={inputClass(!!errors.telefon)}
                placeholder="+381 61 234 5678"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </FormField>

            {/* Password */}
            <FormField id="password" label="Lozinka" error={errors.password?.message}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className={inputClass(!!errors.password)}
                  placeholder="Najmanje 6 karaktera"
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
            </FormField>

            {/* Confirm password */}
            <FormField id="confirmPassword" label="Potvrdi lozinku" error={errors.confirmPassword?.message}>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className={inputClass(!!errors.confirmPassword)}
                  placeholder="Ponovite lozinku"
                  style={{ fontFamily: 'var(--font-sans)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                  aria-label={showConfirm ? 'Sakrij lozinku' : 'Pokaži lozinku'}
                >
                  {showConfirm ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </FormField>

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
              {isSubmitting ? 'Kreiranje naloga...' : 'Kreiraj nalog'}
              {!isSubmitting && (
                <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 pt-8 border-t border-[#e8e0d8]">
            <p className="text-[12px] text-[#8a8a8a] text-center" style={{ fontFamily: 'var(--font-sans)' }}>
              Već imate nalog?{' '}
              <Link
                href="/login"
                className="text-[#1a1a1a] border-b border-[#1a1a1a] hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors duration-200"
              >
                Prijavite se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
