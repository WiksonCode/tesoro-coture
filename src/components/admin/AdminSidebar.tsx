'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Shirt, CalendarCheck, BarChart3, Users,
  LogOut, Menu, X, ChevronRight, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard, exact: true },
  { href: '/admin/haljine',     label: 'Haljine',     icon: Shirt,           exact: false },
  { href: '/admin/rezervacije', label: 'Rezervacije', icon: CalendarCheck,   exact: false },
  { href: '/admin/statistika',  label: 'Statistika',  icon: BarChart3,       exact: false },
  { href: '/admin/korisnici',   label: 'Korisnici',   icon: Users,           exact: false },
]

interface AdminSidebarProps {
  displayName: string
  email: string
}

export default function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    window.location.href = '/api/auth/signout'
  }

  const initial = displayName[0]?.toUpperCase() ?? '?'

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/[0.07]">
        <Link href="/admin" onClick={() => setMobileOpen(false)}>
          <span className="text-[18px] tracking-[0.3em] font-light uppercase text-white" style={{ fontFamily: 'var(--font-serif)' }}>
            TESORO
          </span>
          <p className="text-[10px] tracking-[0.45em] text-[#c9a96e] uppercase mt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
            Admin Panel
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 px-3 mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
          Navigacija
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-200 group',
                    active
                      ? 'bg-[#c9a96e]/12 text-[#c9a96e]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  )}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.5}
                    className={cn('shrink-0 transition-colors', active ? 'text-[#c9a96e]' : 'text-white/35 group-hover:text-white/65')}
                  />
                  {label}
                  {active && <ChevronRight size={10} className="ml-auto text-[#c9a96e]/50" />}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 pt-4 border-t border-white/[0.07]">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 px-3 mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
            Sajt
          </p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase text-white/35 hover:text-white/70 transition-colors"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <ExternalLink size={14} strokeWidth={1.5} className="shrink-0" />
            Otvori sajt
          </Link>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 bg-[#c9a96e]/15 border border-[#c9a96e]/20 flex items-center justify-center shrink-0">
            <span className="text-[13px] text-[#c9a96e] font-light" style={{ fontFamily: 'var(--font-serif)' }}>
              {initial}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/70 truncate" style={{ fontFamily: 'var(--font-sans)' }}>{displayName}</p>
            <p className="text-[10px] text-white/35 truncate" style={{ fontFamily: 'var(--font-sans)' }}>{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase text-white/35 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          Odjava
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 bg-[#141414] min-h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#141414] h-14 flex items-center justify-between px-4 border-b border-white/[0.07]">
        <Link href="/admin" onClick={() => setMobileOpen(false)}>
          <span className="text-[16px] tracking-[0.3em] font-light uppercase text-white" style={{ fontFamily: 'var(--font-serif)' }}>
            TESORO{' '}
            <span className="text-[#c9a96e] text-[11px] tracking-[0.3em]" style={{ fontFamily: 'var(--font-sans)' }}>
              Admin
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="lg:hidden fixed top-14 left-0 bottom-0 z-50 w-[260px] bg-[#141414] overflow-y-auto shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
