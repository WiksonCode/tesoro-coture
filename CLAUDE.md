# TESORO Couture — Claude Code Briefing

## O projektu
Sajt za salon ženskih haljina u Beogradu.
**Klijent:** TESORO Couture
**Cilj:** Prikaz kataloga haljina sa rezervacijom termina (bez online plaćanja)
**Jezici:** Srpski (latinica, default) + Engleski
**Valute:** RSD (default) + EUR (konverzija)

---

## Tech Stack

| Sloj | Tehnologija | Zašto |
|------|-------------|-------|
| Framework | Next.js 15 (App Router) | SSR/SSG za SEO, routing, API routes |
| Jezik | TypeScript | Type safety za kompleksan model podataka |
| Stilovi | Tailwind CSS + shadcn/ui | Brz razvoj, konzistentan dizajn sistem |
| Animacije | Framer Motion | Elegantne tranzicije, hover efekti |
| Baza | PostgreSQL (Supabase) | Auth, storage za slike/video, real-time |
| Auth | Supabase Auth | Login/Register korisnici + admin uloge |
| Slike/Video | Supabase Storage | Upload i serviranje media fajlova |
| Forme | React Hook Form + Zod | Validacija rezervacija i admin formi |
| i18n | next-intl | Srpski/Engleski prevodi |
| State | Zustand | Korpa (košarica) state management |
| Email | Resend | Notifikacije za rezervacije |
| Deploy | Vercel | Optimizovano za Next.js |

---

## Dizajn Smjernice

### Estetika
- **Stil:** Minimalistički luksuz — manje elemenata, više prostora
- **Inspiracija:** Editorijalni modni magazin (Vogue, Harper's Bazaar)
- **NE koristiti:** Previše animacija, natrpane stranice, generičke komponente

### Palete boja
```
--color-primary:   #1a1a1a    /* skoro crna — tekstovi, naslovi */
--color-secondary: #c9a96e    /* zlatna — akcenti, hover */
--color-cream:     #faf7f4    /* topla bijela — pozadine */
--color-muted:     #8a8a8a    /* siva — meta tekst */
--color-border:    #e8e0d8    /* topla siva — granice */
```

### Tipografija
```
Naslovi:  Cormorant Garamond (serif, luksuzno)
Body:     DM Sans (sans-serif, čitljivo)
Akcenti:  Cormorant Garamond Italic
```

### Principi layouta
- Puno bijelog prostora (padding generozno)
- Slike uvijek pune visine / omjer 3:4 za haljine
- Hover efekti suptilni (fade, scale 1.02)
- Mobile-first, ali desktop primarno ciljana publika

---

## Stranice i Rute

```
/                          → Homepage
/o-nama                    → O salonu
/katalog                   → Katalog haljina (sa filterima)
/haljina/[slug]            → Detaljna stranica haljine
/vodic-za-velicine         → Vodič za mjerenje
/rezervacija               → Forma za rezervaciju termina
/korpa                     → Pregled korpe
/login                     → Prijava
/registracija              → Registracija
/profil                    → Korisnički profil + historija rezervacija

/admin                     → Admin dashboard
/admin/haljine             → Lista haljina
/admin/haljine/nova        → Dodavanje haljine
/admin/haljine/[id]        → Editovanje haljine
/admin/rezervacije         → Sve rezervacije
/admin/rezervacije/[id]    → Detalji rezervacije + promjena statusa
/admin/statistika          → Grafikoni prodaje/rezervacija
/admin/korisnici           → Upravljanje korisnicima
```

---

## Model Podataka (Database Schema)

### haljine (dresses)
```typescript
{
  id: uuid
  slug: string (unique)
  naziv_sr: string       // srpski naziv
  naziv_en: string       // engleski naziv
  opis_sr: text
  opis_en: text
  cijena_rsd: decimal
  cijena_eur: decimal
  na_popustu: boolean
  popust_procenat: number (0-100)
  kategorija: enum ['vjencana', 'koktel', 'svecana', 'casual', 'maturska']
  dostupne_boje: json    // [{naziv: 'Roze', hex: '#F2A7B3'}, ...]
  dostupne_velicine: json // ['XS','S','M','L','XL','XXL', 'po_mjeri']
  slike: json            // [url1, url2, ...]  (Supabase Storage URLs)
  video_url: string | null
  dostupna: boolean      // da li je na lageru
  kolicina_na_lageru: number
  featured: boolean      // prikazuje se na homepage
  created_at: timestamp
  updated_at: timestamp
}
```

### rezervacije (reservations)
```typescript
{
  id: uuid
  user_id: uuid | null   // null ako nije ulogovan
  haljina_id: uuid
  ime: string
  prezime: string
  telefon: string
  email: string
  odabrana_boja: string
  odabrana_velicina: string  // ili 'po_mjeri'
  mjere: json | null     // {grudi, struk, bokovi, visina} — samo za po_mjeri
  napomena: string | null
  status: enum ['na_cekanju', 'potvrdjena', 'otkazana', 'realizovana']
  datum_rezervacije: date | null  // kada želi termin
  created_at: timestamp
  updated_at: timestamp
}
```

### korisnici (users) — extends Supabase Auth
```typescript
{
  id: uuid (FK → auth.users)
  ime: string
  prezime: string
  telefon: string
  uloga: enum ['korisnik', 'admin']
  created_at: timestamp
}
```

---

## Ključne Funkcionalnosti — Detalji

### 1. Katalog sa filterima
```
Filteri:
- Kategorija (checkboxes)
- Boja (color swatches)
- Veličina (pill buttons)
- Cijena (range slider)
- Na popustu (toggle)

Sortiranje:
- Najnovije (default)
- Cijena: rastuće / opadajuće
- Popularno (po broju rezervacija)
- Popust

Prikaz: Grid 2 kolone (mobile) / 3-4 kolone (desktop)
```

### 2. Detaljna stranica haljine
```
- Galerija slika (swipe mobile, click desktop)
- Video prikaz (ako postoji) — autoplay muted loop
- Naziv, cijena (RSD + EUR)
- Odabir boje — vizualni color swatches
- Odabir veličine — pill buttons + "Po mjeri" opcija
- Ako "Po mjeri" → otvara se sekcija za unos mjera
- "Dodaj u korpu" button
- Link na Vodič za veličine
- "Rezerviši odmah" shortcut
```

### 3. Korpa i Rezervacija
```
Korpa:
- Persist u localStorage (neregistrovani) / DB (registrovani)
- Prikazuje: slika, naziv, boja, veličina, cijena
- Ide na formu za rezervaciju

Forma za rezervaciju:
- Ime, Prezime, Telefon, Email
- Željeni datum termina (date picker)
- Napomena
- Submit → status "na_cekanju"
- Email notifikacija adminu
- Email potvrda korisniku
```

### 4. Vodič za veličine
```
4 mjere: Grudi, Struk, Bokovi, Visina
Ilustracija kako izmjeriti (SVG ili ilustracija)
Tabela veličina: XS/S/M/L/XL/XXL sa cm rasponima
```

### 5. Admin Panel
```
Dashboard: ukupno rezervacija, prihod, top haljine
Haljine: CRUD, upload slika/video, stavljanje na popust
Rezervacije: lista, filter po statusu, promjena statusa, pregled detalja
Statistika: grafikon po mesecima, najpopularnije haljine
Korisnici: lista, pregled profila
```

### 6. i18n (Višejezičnost)
```
Koristiti next-intl
Fajlovi: /messages/sr.json i /messages/en.json
URL prefiks: /sr/... i /en/... ili automatska detekcija
```

---

## Važne Napomene za Razvoj

- **Nema online plaćanja** — samo rezervacija termina
- **Admin uloga** se dodjeljuje ručno u bazi (uloga = 'admin')
- **Slike haljina** omjer 3:4 uvijek (portrait format)
- **Video** autoplay, muted, loop — nikad sa soundom po defaultu
- **Boje haljina** su custom spektar — ne koristiti standardne CSS named colors
- **Cijena u EUR** = cijena_rsd / kurs (kurs čuvati u settings tabeli ili env varijabli)
- **Mobilni prikaz** — hamburger meni, bottom sheet za filtere
- **SEO** — generateMetadata za svaku stranicu, posebno haljine

---

## Folder Struktura

```
tesoro-couture/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Homepage
│   │   ├── o-nama/page.tsx
│   │   ├── katalog/page.tsx
│   │   ├── haljina/[slug]/page.tsx
│   │   ├── vodic-za-velicine/page.tsx
│   │   ├── rezervacija/page.tsx
│   │   ├── korpa/page.tsx
│   │   ├── login/page.tsx
│   │   ├── registracija/page.tsx
│   │   ├── profil/page.tsx
│   │   └── admin/
│   │       ├── page.tsx                # Dashboard
│   │       ├── haljine/
│   │       ├── rezervacije/
│   │       ├── statistika/
│   │       └── korisnici/
│   └── api/
│       ├── rezervacije/route.ts
│       ├── haljine/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/                             # shadcn komponente
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── haljine/
│   │   ├── HaljinCard.tsx
│   │   ├── HaljinGrid.tsx
│   │   ├── HaljinGalerija.tsx
│   │   ├── BojeSelector.tsx
│   │   ├── VelicineSelector.tsx
│   │   └── Filteri.tsx
│   ├── rezervacija/
│   │   ├── RezervacijaForma.tsx
│   │   └── KorpaPregled.tsx
│   └── admin/
│       ├── HaljinaForma.tsx
│       ├── RezervacijaTabela.tsx
│       └── StatistikaGrafikoni.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validations/
│   └── utils.ts
├── store/
│   └── korpa.ts                        # Zustand store
├── messages/
│   ├── sr.json
│   └── en.json
├── types/
│   └── index.ts
└── CLAUDE.md                           # ovaj fajl
```

---

## Redoslijed Razvoja

Vidi `PLAN_RADA.md` za detaljne korake.
