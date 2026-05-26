import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politika privatnosti',
  description: 'Saznajte kako TESORO Couture prikuplja, obrađuje i čuva vaše lične podatke.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2
      className="text-[clamp(20px,2.5vw,28px)] font-light italic text-[#1a1a1a] mb-5 leading-snug"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {title}
    </h2>
    <div
      className="text-[13px] leading-[1.9] text-[#5a5a5a] space-y-3"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </div>
  </section>
)

export default function PolitikaPrivatnostiPage() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 pt-16 pb-12 border-b border-[#e8e0d8]">
        <p
          className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-5"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Pravni dokumenti
        </p>
        <h1
          className="text-[clamp(36px,5vw,60px)] font-light text-[#1a1a1a] leading-tight mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Politika privatnosti
        </h1>
        <p
          className="text-[12px] text-[#8a8a8a] tracking-wide"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Poslednje ažuriranje: maj 2025.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-14">

        <Section title="Ko smo mi">
          <p>
            <strong className="text-[#1a1a1a] font-medium">TESORO Couture</strong> je salon ženskih haljina
            sa sedištem u Beogradu, Srbija. Kao administrator vaših ličnih podataka, odgovorni smo za
            zakonitu, poštenu i transparentnu obradu podataka u skladu sa Zakonom o zaštiti podataka
            o ličnosti Republike Srbije (ZZPL) i Opštom uredbom o zaštiti podataka EU (GDPR).
          </p>
          <p>
            Kontakt: <a href="mailto:info@tesorocouture.rs" className="text-[#c9a96e] hover:underline">info@tesorocouture.rs</a>
          </p>
        </Section>

        <Section title="Koje podatke prikupljamo">
          <p>Prikupljamo isključivo podatke koje nam sami dostavite prilikom rezervacije termina:</p>
          <ul className="list-none space-y-2 mt-3 pl-0">
            {[
              'Ime i prezime',
              'Broj telefona',
              'E-mail adresa',
              'Željeni datum termina',
              'Odabrana haljina, boja i veličina',
              'Napomena (opciono)',
              'Telesne mere (samo ako odaberete opciju "Po meri")',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-[#c9a96e] shrink-0 mt-[9px]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Ako se registrujete, čuvamo i podatke naloga (e-mail, lozinka u šifrovanom obliku).
            Ne prikupljamo podatke o plaćanju jer na sajtu ne postoji online plaćanje.
          </p>
        </Section>

        <Section title="Zašto koristimo vaše podatke">
          <p>Vaše podatke koristimo isključivo za:</p>
          <ul className="list-none space-y-2 mt-3 pl-0">
            {[
              'Obradu i potvrdu rezervacije termina u salonu',
              'Komunikaciju u vezi sa vašim terminom (potvrda, podsetnik, otkazivanje)',
              'Upravljanje korisničkim nalogom (ako ste se registrovali)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-[#c9a96e] shrink-0 mt-[9px]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Ne koristimo vaše podatke u marketinške svrhe bez vaše izričite saglasnosti,
            niti ih prodajemo ili delimo sa trećim stranama, osim u slučajevima navedenim ispod.
          </p>
        </Section>

        <Section title="Gde se podaci čuvaju">
          <p>
            Podaci se čuvaju na platformi <strong className="text-[#1a1a1a] font-medium">Supabase</strong>
            {' '}(PostgreSQL baza podataka) koja koristi infrastrukturu u okviru EU
            (AWS Frankfurt, Nemačka). Supabase je u skladu sa GDPR zahtevima i primenjuje
            enkripciju podataka u mirovanju i prenosu (TLS/SSL).
          </p>
          <p>
            Sajt je hostovan na platformi <strong className="text-[#1a1a1a] font-medium">Vercel</strong>
            {' '}(EU region), koja obrađuje serverske zahteve i ne čuva lične podatke nezavisno od vaše sesije.
          </p>
        </Section>

        <Section title="Koliko dugo čuvamo podatke">
          <p>
            Podatke o rezervaciji čuvamo dok je rezervacija aktivna i do 12 meseci nakon
            njenog završetka, radi rešavanja eventualnih nedoumica. Nakon toga, podaci se brišu ili anonimizuju.
          </p>
          <p>
            Podatke korisničkog naloga čuvamo dok nalog postoji. Možete zatražiti brisanje naloga u svakom trenutku.
          </p>
        </Section>

        <Section title="Kolačići i lokalno skladište">
          <p>
            Sajt koristi isključivo <strong className="text-[#1a1a1a] font-medium">tehničke kolačiće</strong> neophodne
            za funkcionisanje:
          </p>
          <ul className="list-none space-y-2 mt-3 pl-0">
            {[
              'Kolačiće sesije za autentifikaciju (Supabase Auth) — brišu se pri odjavljivanju',
              'Lokalno skladište (localStorage) za privremeno čuvanje sadržaja korpe — ne šalje se serveru',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-[#c9a96e] shrink-0 mt-[9px]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Ne koristimo analitičke, marketinške niti kolačiće trećih strana.
            Google fontovi se učitavaju lokalno (bez poziva Google serverima).
          </p>
        </Section>

        <Section title="Vaša prava">
          <p>U skladu sa ZZPL i GDPR-om, imate pravo da:</p>
          <ul className="list-none space-y-2 mt-3 pl-0">
            {[
              'Pristupite podacima koje čuvamo o vama',
              'Zatražite ispravku netačnih podataka',
              'Zatražite brisanje vaših podataka ("pravo na zaborav")',
              'Ograničite ili prigovorite obradi podataka',
              'Zatražite prenosivost podataka (u strukturiranom formatu)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-[#c9a96e] shrink-0 mt-[9px]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Zahtev možete uputiti na{' '}
            <a href="mailto:info@tesorocouture.rs" className="text-[#c9a96e] hover:underline">
              info@tesorocouture.rs
            </a>
            . Odgovorićemo u roku od 30 dana.
          </p>
          <p>
            Imate pravo i na pritužbu Povereniku za informacije od javnog značaja i zaštitu
            podataka o ličnosti Republike Srbije.
          </p>
        </Section>

        <Section title="Izmene politike">
          <p>
            Zadržavamo pravo da ažuriramo ovu politiku privatnosti. O značajnim promenama
            obavestićemo vas e-mailom (ako imate nalog) ili objavom na sajtu.
            Datum poslednjeg ažuriranja uvek je naveden na vrhu stranice.
          </p>
        </Section>

        {/* Back link */}
        <div className="pt-8 border-t border-[#e8e0d8]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#8a8a8a] hover:text-[#c9a96e] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ← Nazad na početnu
          </Link>
        </div>

      </div>
    </main>
  )
}
