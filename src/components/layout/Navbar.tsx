'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useKorpa } from '@/store/korpa'

const navLinks = [
  { href: '/', label: 'Početna' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/vodic-za-velicine', label: 'Vodič za veličine' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHero = pathname === '/' && !scrolled
  const korpaCount = useKorpa((s) => s.artikli.length)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        scrolled
          ? 'bg-[#faf7f4]/95 backdrop-blur-sm border-b border-[#e8e0d8] shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span
            className={cn(
              'text-[22px] lg:text-[26px] tracking-[0.3em] font-light uppercase transition-colors duration-500',
              isHero ? 'text-white' : 'text-[#1a1a1a]'
            )}
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            TESORO
          </span>
          <span
            className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase -mt-0.5 pl-0.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Couture
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-[10px] tracking-[0.25em] uppercase transition-colors duration-300',
                  pathname === link.href
                    ? 'text-[#c9a96e]'
                    : isHero
                      ? 'text-white/80 hover:text-white'
                      : 'text-[#1a1a1a] hover:text-[#c9a96e]'
                )}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Language switcher */}
          <div
            className={cn(
              'hidden lg:flex items-center gap-2 text-[9px] tracking-[0.25em] transition-colors duration-500',
              isHero ? 'text-white/50' : 'text-[#8a8a8a]'
            )}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <button className="hover:text-[#c9a96e] transition-colors uppercase">SR</button>
            <span className="opacity-40">|</span>
            <button className="hover:text-[#c9a96e] transition-colors uppercase">EN</button>
          </div>

          {/* Cart */}
          <Link href="/korpa" className="relative group p-1">
            <ShoppingBag
              size={18}
              strokeWidth={1.5}
              className={cn(
                'group-hover:text-[#c9a96e] transition-colors duration-300',
                isHero ? 'text-white' : 'text-[#1a1a1a]'
              )}
            />
            {mounted && korpaCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a96e] text-[#1a1a1a] text-[8px] font-medium flex items-center justify-center rounded-full leading-none">
                {korpaCount > 9 ? '9+' : korpaCount}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="lg:hidden p-1" aria-label="Otvori meni">
              <Menu size={20} strokeWidth={1.5} className={cn('transition-colors duration-500', isHero ? 'text-white' : 'text-[#1a1a1a]')} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#faf7f4] border-l border-[#e8e0d8] w-72 p-0"
            >
              <div className="flex flex-col h-full px-8 pt-10 pb-8">
                {/* Mobile logo */}
                <div className="mb-12">
                  <span
                    className="text-2xl tracking-[0.3em] font-light text-[#1a1a1a]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    TESORO
                  </span>
                  <p
                    className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mt-0.5"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Couture
                  </p>
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-7">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'text-[11px] tracking-[0.3em] uppercase transition-colors duration-300',
                        pathname === link.href
                          ? 'text-[#c9a96e]'
                          : 'text-[#1a1a1a] hover:text-[#c9a96e]'
                      )}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="my-8 h-px bg-[#e8e0d8]" />

                {/* Mobile language + cart */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-[#8a8a8a]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <button className="hover:text-[#c9a96e] transition-colors uppercase">SR</button>
                    <span className="opacity-40">|</span>
                    <button className="hover:text-[#c9a96e] transition-colors uppercase">EN</button>
                  </div>
                  <Link
                    href="/korpa"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-[10px] tracking-widest text-[#8a8a8a] hover:text-[#c9a96e] transition-colors uppercase"
                  >
                    <ShoppingBag size={15} strokeWidth={1.5} />
                    Korpa
                  </Link>
                </div>

                {/* Bottom tagline */}
                <div className="mt-auto">
                  <p
                    className="text-[#c9a96e] text-base italic"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Elegancija koja traje
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
