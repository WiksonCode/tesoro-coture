'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, User, LogOut, LayoutDashboard } from 'lucide-react'
import NavbarSearch from '@/components/layout/NavbarSearch'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useKorpa } from '@/store/korpa'
import { useJezik } from '@/store/jezik'
import { t } from '@/messages'
import { createClient } from '@/lib/supabase/client'

// Text shadow protects white text against variable hero images
const heroTextShadow = { textShadow: '0 1px 12px rgba(0,0,0,0.45)' }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isHero = pathname === '/' && !scrolled
  const isAuthPage = pathname === '/login' || pathname === '/registracija' || pathname.startsWith('/admin')
  const korpaCount = useKorpa((s) => s.artikli.length)
  const { jezik, setJezik } = useJezik()
  const tr = t[jezik].nav
  const navLinks = tr.links

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', session.user.id).single()
        setIsAdmin(profil?.uloga === 'admin')
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', session.user.id).single()
        setIsAdmin(profil?.uloga === 'admin')
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userMenuOpen])

  function handleLogout() {
    setUserMenuOpen(false)
    window.location.href = '/api/auth/signout'
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isAuthPage) return null

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        (scrolled || pathname !== '/')
          ? 'bg-[#faf7f4]/95 backdrop-blur-sm border-b border-[#e8e0d8] shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => { if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <Image
            src={isHero ? '/tesoro-logo-outline.png' : '/tesoro2-logo.png'}
            alt="TESORO Couture"
            width={802}
            height={311}
            className="object-contain transition-opacity duration-500 w-[110px] lg:w-[130px]"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative inline-flex flex-col items-center text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 pb-1',
                    active
                      ? 'text-[#c9a96e]'
                      : isHero
                        ? 'text-white/85 hover:text-white'
                        : 'text-[#1a1a1a] hover:text-[#c9a96e]'
                  )}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    ...(isHero && !active ? heroTextShadow : {}),
                  }}
                >
                  {link.label}
                  {/* Active indicator — thin gold line */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300',
                      active ? 'opacity-100 bg-[#c9a96e]' : 'opacity-0'
                    )}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right side — Search · Cart · User · Lang */}
        <div className="flex items-center gap-4 lg:gap-5">

          {/* Search */}
          <NavbarSearch isHero={isHero} />

          {/* Cart — min 44px touch target on mobile */}
          <Link
            href="/korpa"
            aria-label="Korpa"
            className="relative group min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0 flex items-center justify-center lg:p-1"
          >
            <ShoppingBag
              size={18}
              strokeWidth={1.5}
              className={cn(
                'group-hover:text-[#c9a96e] transition-colors duration-300',
                isHero ? 'text-white' : 'text-[#1a1a1a]'
              )}
            />
            {mounted && korpaCount > 0 && (
              <span className="absolute top-1.5 right-1.5 lg:top-0 lg:right-0 lg:-translate-y-0.5 lg:translate-x-0.5 w-4 h-4 bg-[#c9a96e] text-[#1a1a1a] text-[8px] font-medium flex items-center justify-center rounded-full leading-none">
                {korpaCount > 9 ? '9+' : korpaCount}
              </span>
            )}
          </Link>

          {/* Auth — desktop */}
          {mounted && (
            <div className="hidden lg:block">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center border transition-colors duration-200 cursor-pointer text-[11px] font-light',
                      userMenuOpen
                        ? 'border-[#c9a96e] bg-[#c9a96e] text-[#1a1a1a]'
                        : isHero
                          ? 'border-white/50 text-white hover:border-white'
                          : 'border-[#e8e0d8] text-[#1a1a1a] hover:border-[#1a1a1a]'
                    )}
                    style={{ fontFamily: 'var(--font-serif)' }}
                    aria-label="Korisnički meni"
                    aria-expanded={userMenuOpen}
                  >
                    {userInitial}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e8e0d8] shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 py-1">
                      <Link
                        href="/profil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#faf7f4] transition-colors duration-150"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        <User size={11} strokeWidth={1.5} />
                        {tr.profil}
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#faf7f4] transition-colors duration-150"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <LayoutDashboard size={11} strokeWidth={1.5} />
                          Admin
                        </Link>
                      )}
                      {/* Language switcher moved here — secondary utility */}
                      <div className="my-1 h-px bg-[#e8e0d8]" />
                      <div className="flex items-center gap-1 px-4 py-3" style={{ fontFamily: 'var(--font-sans)' }}>
                        <button onClick={() => setJezik('sr')} className={cn('relative px-1.5 py-0.5 text-[9px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200', jezik === 'sr' ? 'text-[#1a1a1a] after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-px after:bg-[#c9a96e]' : 'text-[#8a8a8a]/50 hover:text-[#8a8a8a]')}>
                          SR
                        </button>
                        <span className="text-[8px] text-[#1a1a1a] opacity-15">|</span>
                        <button onClick={() => setJezik('en')} className={cn('px-1.5 py-0.5 text-[9px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200', jezik === 'en' ? 'text-[#1a1a1a] after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-px after:bg-[#c9a96e]' : 'text-[#8a8a8a]/50 hover:text-[#8a8a8a]')}>
                          EN
                        </button>
                      </div>
                      <div className="my-1 h-px bg-[#e8e0d8]" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        <LogOut size={11} strokeWidth={1.5} />
                        {tr.odjava}
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Language switcher — desktop, only when NOT logged in */}
          {mounted && !user && (
            <div className="hidden lg:flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
              <button
                onClick={() => setJezik('sr')}
                className={cn(
                  'relative px-1.5 py-0.5 text-[9px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-300',
                  jezik === 'sr' && 'after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-px after:bg-[#c9a96e]',
                  jezik === 'sr'
                    ? (isHero ? 'text-white' : 'text-[#1a1a1a]')
                    : (isHero ? 'text-white/35 hover:text-white/70' : 'text-[#8a8a8a]/50 hover:text-[#8a8a8a]')
                )}
              >
                SR
              </button>
              <span className={cn('text-[8px] opacity-20', isHero ? 'text-white' : 'text-[#1a1a1a]')}>|</span>
              <button
                onClick={() => setJezik('en')}
                className={cn(
                  'relative px-1.5 py-0.5 text-[9px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-300',
                  jezik === 'en' && 'after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-px after:bg-[#c9a96e]',
                  jezik === 'en'
                    ? (isHero ? 'text-white' : 'text-[#1a1a1a]')
                    : (isHero ? 'text-white/35 hover:text-white/70' : 'text-[#8a8a8a]/50 hover:text-[#8a8a8a]')
                )}
              >
                EN
              </button>
            </div>
          )}

          {/* Mobile menu trigger — min 44x44 touch target */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Otvori meni"
            >
              <Menu
                size={20}
                strokeWidth={1.5}
                className={cn('transition-colors duration-500', isHero ? 'text-white' : 'text-[#1a1a1a]')}
              />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#faf7f4] border-l border-[#e8e0d8] w-72 p-0"
            >
              <div className="flex flex-col h-full px-8 pt-10 pb-8">
                {/* Mobile logo */}
                <div className="mb-10">
                  <Image
                    src="/tesoro2-logo.png"
                    alt="TESORO Couture"
                    width={120}
                    height={60}
                    className="object-contain w-[100px]"
                  />
                </div>

                {/* Mobile nav links — min 44px touch target each */}
                <nav className="flex flex-col">
                  {navLinks.map((link) => {
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center justify-between min-h-[44px] text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 border-b border-[#e8e0d8]/60 last:border-0',
                          active
                            ? 'text-[#c9a96e]'
                            : 'text-[#1a1a1a] hover:text-[#c9a96e]'
                        )}
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {link.label}
                        {active && (
                          <span className="w-1 h-1 rounded-full bg-[#c9a96e] flex-shrink-0" />
                        )}
                      </Link>
                    )
                  })}
                </nav>

                {/* Divider */}
                <div className="my-6 h-px bg-[#e8e0d8]" />

                {/* Mobile utility row — lang + cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
                    <button onClick={() => setJezik('sr')} className={cn('relative min-h-[44px] px-2 text-[11px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200', jezik === 'sr' ? 'text-[#1a1a1a] font-medium after:absolute after:bottom-3 after:left-2 after:right-2 after:h-px after:bg-[#c9a96e]' : 'text-[#8a8a8a] hover:text-[#1a1a1a]')}>
                      SR
                    </button>
                    <span className="text-[10px] text-[#1a1a1a] opacity-20">|</span>
                    <button onClick={() => setJezik('en')} className={cn('relative min-h-[44px] px-2 text-[11px] tracking-[0.25em] uppercase cursor-pointer transition-colors duration-200', jezik === 'en' ? 'text-[#1a1a1a] font-medium after:absolute after:bottom-3 after:left-2 after:right-2 after:h-px after:bg-[#c9a96e]' : 'text-[#8a8a8a] hover:text-[#1a1a1a]')}>
                      EN
                    </button>
                  </div>
                  <Link
                    href="/korpa"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 min-h-[44px] text-[11px] tracking-[0.25em] text-[#1a1a1a] hover:text-[#c9a96e] transition-colors uppercase"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    {tr.korpa}
                  </Link>
                </div>

                {/* Mobile auth */}
                {mounted && (
                  <div className="mt-2">
                    <div className="h-px bg-[#e8e0d8] mb-4" />
                    {user ? (
                      <div className="flex flex-col">
                        <Link
                          href="/profil"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 min-h-[44px] text-[11px] tracking-[0.25em] uppercase text-[#1a1a1a] hover:text-[#c9a96e] transition-colors"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <User size={14} strokeWidth={1.5} />
                          {tr.profil}
                        </Link>
                        <button
                          type="button"
                          onClick={() => { handleLogout(); setMobileOpen(false) }}
                          className="flex items-center gap-3 min-h-[44px] text-[11px] tracking-[0.25em] uppercase text-[#8a8a8a] hover:text-red-500 transition-colors cursor-pointer"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <LogOut size={14} strokeWidth={1.5} />
                          {tr.odjava}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Bottom tagline */}
                <div className="mt-auto pt-8">
                  <p
                    className="text-[#c9a96e] text-base italic"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {t[jezik].hero.naslov1} {t[jezik].hero.naslov2}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
