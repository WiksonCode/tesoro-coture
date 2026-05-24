import Link from 'next/link'

const footerLinks = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/rezervacija', label: 'Rezervacija' },
  { href: '/vodic-za-velicine', label: 'Vodič za veličine' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a] text-[#faf7f4]">
      <div className="h-px bg-gradient-to-r from-transparent via-[#c9a96e]/50 to-transparent" />

      {/* Brand — full width centered */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 text-center">
        <h3
          className="text-[48px] tracking-[0.5em] font-light leading-none mb-1"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          TESORO
        </h3>
        <p
          className="text-[8px] tracking-[0.7em] text-[#c9a96e] uppercase mb-5"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Couture
        </p>

        {/* Social */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <a
            href="https://www.instagram.com/tesorocouture"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 border border-[#faf7f4]/10 flex items-center justify-center text-[#faf7f4]/35 hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all duration-300 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/tesorocouture"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 border border-[#faf7f4]/10 flex items-center justify-center text-[#faf7f4]/35 hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all duration-300 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-[#faf7f4]/[0.07]" />
      </div>

      {/* Columns */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">

          {/* Navigation */}
          <div>
            <h4
              className="text-[8px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Navigacija
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-0 text-[11px] tracking-[0.2em] uppercase text-[#faf7f4]/40 hover:text-[#c9a96e] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <span className="block w-0 h-px bg-[#c9a96e] group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[8px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kontakt
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li
                className="text-[11px] tracking-wide text-[#faf7f4]/40 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Bulevar Kralja Aleksandra 42<br />
                11000 Beograd, Srbija
              </li>
              <li>
                <a
                  href="tel:+381611234567"
                  className="text-[11px] tracking-wide text-[#faf7f4]/40 hover:text-[#c9a96e] transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  +381 61 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@tesorocouture.rs"
                  className="text-[11px] tracking-wide text-[#faf7f4]/40 hover:text-[#c9a96e] transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  info@tesorocouture.rs
                </a>
              </li>
            </ul>
          </div>

          {/* Radno vreme */}
          <div>
            <h4
              className="text-[8px] tracking-[0.5em] uppercase text-[#c9a96e] mb-4"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Radno vreme
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li
                className="text-[11px] tracking-wide text-[#faf7f4]/40 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Pon – Pet: 10:00 – 20:00<br />
                Subota: 10:00 – 18:00<br />
                Nedeljom: po dogovoru
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-[#faf7f4]/[0.07] text-center">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-[#faf7f4]/50"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            © {year} TESORO Couture · Sva prava zadržana
          </p>
        </div>
      </div>
    </footer>
  )
}
