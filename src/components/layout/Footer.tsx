import Link from 'next/link'

const footerLinks = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/rezervacija', label: 'Rezervacija' },
  { href: '/vodic-za-velicine', label: 'Vodič za veličine' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#faf7f4]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

          {/* Brand column */}
          <div>
            <h3
              className="text-3xl tracking-[0.3em] font-light mb-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              TESORO
            </h3>
            <p
              className="text-[8px] tracking-[0.5em] text-[#c9a96e] uppercase mb-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Couture
            </p>
            <p
              className="text-sm text-[#faf7f4]/50 leading-relaxed max-w-[240px]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Salon elegantnih ženskih haljina u srcu Beograda. Ekskluzivne kreacije za svaku posebnu prigodu.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-7"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Navigacija
            </h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] tracking-[0.2em] uppercase text-[#faf7f4]/50 hover:text-[#c9a96e] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[9px] tracking-[0.4em] uppercase text-[#c9a96e] mb-7"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Kontakt
            </h4>
            <ul className="flex flex-col gap-4">
              <li
                className="text-[11px] tracking-wide text-[#faf7f4]/50 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Bulevar Kralja Aleksandra 42<br />
                11000 Beograd, Srbija
              </li>
              <li>
                <a
                  href="tel:+381611234567"
                  className="text-[11px] tracking-wide text-[#faf7f4]/50 hover:text-[#c9a96e] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  +381 61 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@tesorocouture.rs"
                  className="text-[11px] tracking-wide text-[#faf7f4]/50 hover:text-[#c9a96e] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  info@tesorocouture.rs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-7 border-t border-[#faf7f4]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-[#faf7f4]/25"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            © 2025 TESORO Couture · Sva prava zadržana
          </p>
          <div className="flex items-center gap-3">
            <span className="block w-6 h-px bg-[#c9a96e]/50" />
            <span
              className="text-[#c9a96e]/70 text-base italic"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Elegancija koja traje
            </span>
            <span className="block w-6 h-px bg-[#c9a96e]/50" />
          </div>
        </div>
      </div>
    </footer>
  )
}
