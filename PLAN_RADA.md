# TESORO Couture — Plan Rada

## Status projekta (~80% gotovo, 2026-06-10)

```
FAZA 1 → Setup & Infrastruktura        ✅ ZAVRŠENO
FAZA 2 → Dizajn Sistem & Layout        ✅ ZAVRŠENO
FAZA 3 → Katalog & Haljine             ✅ ZAVRŠENO
FAZA 4 → Korpa & Rezervacija           ✅ ZAVRŠENO
FAZA 5 → Auth (Login/Register)         ✅ ZAVRŠENO
FAZA 6 → Admin Panel                   ✅ ZAVRŠENO
FAZA 7 → Email Notifikacije            ✅ ZAVRŠENO
FAZA 8 → i18n & Višejezičnost          ⏳ NIJE URAĐENO
FAZA 9 → Polishing & Deploy            🔄 U TOKU
```

---

## Šta je urađeno

### Faza 1 — Setup & Infrastruktura ✅
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase konfiguracija (client + server + proxy middleware)
- Database schema: `profiles`, `kategorije`, `haljine`, `inventar`, `rezervacije`
- RLS policies za sve tabele
- Supabase Storage bucketi za slike i video
- `.env.local` sa svim varijablama

### Faza 2 — Dizajn Sistem & Layout ✅
- Tailwind config sa custom bojama (`#1a1a1a`, `#c9a96e`, `#faf7f4`)
- Google Fonts: Cormorant Garamond (serif) + DM Sans (sans-serif)
- **Navbar** — desktop + mobile hamburger, auth state, admin link, scroll blur
- **Footer** — kontakt info, linkovi, radno vreme, adresa, mapa
- **Homepage** — Hero, Featured haljine, O nama sekcija, CTA banner
- ScrollToTop dugme

### Faza 3 — Katalog & Haljine ✅
- **Katalog** (`/katalog`) — grid prikaz, banner po kategoriji, breadcrumb
- **Filteri** — kategorija, boja (swatches), veličina (pills), cijena (range), popust toggle
- **Sortiranje** — najnovije, najstarije, cijena rastuće/opadajuće
- **HaljinaCard** — slika 3:4, hover efekti, cijena RSD/EUR, badge popust
- **Detaljna stranica** (`/haljina/[slug]`) — galerija, video, odabir boje/veličine, Po meri opcija
- **Vodič za veličine** (`/vodic-za-velicine`) — interaktivni kalkulator, SVG figura sa animiranim linijama, tabela veličina
- **VodicZaVelicineModal** — kompaktna verzija modala sa krojačkom lutkom (`mannequin.png`)

### Faza 4 — Korpa & Rezervacija ✅
- **Zustand store** (`/store/korpa.ts`) — persist localStorage, dodaj/ukloni/očisti
- **Korpa** (`/korpa`) — lista artikala, ukupno RSD/EUR, link na rezervaciju
- **Rezervacija** (`/rezervacija`) — forma sa React Hook Form + Zod validacijom
- **API ruta** (`/api/rezervacije`) — insert u Supabase + slanje email potvrde
- **Email potvrda** — Resend SDK, elegantni HTML template sa listom haljina, ukupnom cijenom, terminom i kontaktom

### Faza 5 — Auth (Login/Register) ✅
- **Login** (`/login`) — Supabase Auth, redirect po uspjehu
- **Registracija** (`/registracija`) — validacija, kreiranje profila
- **Profil** (`/profil`) — prikaz podataka, historija rezervacija, link na admin
- **Odjava** — ispravna server-side odjava via `/api/auth/signout` (briše HttpOnly kolačiće)

### Faza 6 — Admin Panel ✅
- **Admin layout** — sidebar navigacija, protected route (uloga='admin')
- **Dashboard** (`/admin`) — statistike, pregled rezervacija
- **Haljine CRUD** (`/admin/haljine`) — dodavanje, editovanje, brisanje
- **Upload slika/video** — Supabase Storage integracija
- **Inventar** — boje, veličine, cijene po SKU
- **Rezervacije** (`/admin/rezervacije`) — tabela, filter po statusu, promjena statusa
- **Detalji rezervacije** (`/admin/rezervacije/[id]`) — sve informacije, promjena statusa
- **Statistika** (`/admin/statistika`) — grafikoni po mesecima, top haljine
- **Korisnici** (`/admin/korisnici`) — lista registrovanih korisnika
- **Mobile admin** — responzivan sidebar

### Faza 7 — Email Notifikacije ✅
- Instaliran `resend` npm paket
- Email template (`/src/emails/PotvrdarezervacijeEmail.tsx`) — luksuzni HTML dizajn u brendu
- Automatsko slanje korisniku nakon uspješne rezervacije
- Formatiran datum ("5. maj 2026. godine")
- Kontakt info: +381 61 123 45 67, Bulevar Kralja Aleksandra 42
- `RESEND_API_KEY` u `.env.local`
- ⚠️ Kada se verifikuje domen → odkomentarisati `RESEND_FROM_EMAIL` u `.env.local`

### Razni bugfixevi
- Fix: odjava nije brisala sesiju (browser vs server Supabase client)
- Fix: `key` prop warning u listi artikala rezervacije
- Fix: `idempotencyKey` TypeScript greška u Resend pozivu
- Fix: katalog 404 zbog starog Turbopack cacha
- Fix: trajno brisanje haljina i inventara u admin panelu
- Fix: tačni kontakt podaci (adresa, telefon, radno vreme)

---

## Preostalo

### Faza 9 — Polishing & Deploy 🔄 (dogovoreni redoslijed)

- [ ] 1. Dizajn review + responzivnost (mobile testiranje svih stranica)
- [ ] 2. Favicon + og:image (logo već postoji u /public)
- [ ] 3. Loading.tsx i error.tsx na ključnim rutama
- [ ] 4. i18n — srpski + engleski (next-intl, messages/sr.json + en.json, LanguageSwitcher u Navbar)
- [ ] 5. generateMetadata na svim stranicama (SEO)
- [ ] 6. robots.txt i sitemap.xml
- [ ] 7. Rate limiting na API routes (rezervacije endpoint)
- [ ] 8. Verifikovati domen na Resend → odkomentarisati `RESEND_FROM_EMAIL` u .env.local
- [ ] 9. Environment varijable na Vercel
- [ ] 10. Deploy na Vercel
- [ ] 11. Klijent ubacuje haljine kroz admin panel

### Deploy komande:
```bash
git add . && git commit -m "production ready"
gh repo create tesoro-couture --private
git push

npx vercel
# Unesi env varijable u Vercel dashboard
```

---

## Env varijable za produkciju

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_KURS_EUR=117
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@tesorocouture.rs   # nakon verifikacije domena
```
