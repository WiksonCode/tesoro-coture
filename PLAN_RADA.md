# TESORO Couture — Plan Rada

## Pregled Faza

```
FAZA 1 → Setup & Infrastruktura        (1-2 dana)
FAZA 2 → Dizajn Sistem & Layout        (2-3 dana)
FAZA 3 → Katalog & Haljine             (3-4 dana)
FAZA 4 → Korpa & Rezervacija           (2-3 dana)
FAZA 5 → Auth (Login/Register)         (1-2 dana)
FAZA 6 → Admin Panel                   (3-4 dana)
FAZA 7 → i18n & Višejezičnost          (1-2 dana)
FAZA 8 → Polishing & Deploy            (1-2 dana)
──────────────────────────────────────
UKUPNO: ~16-22 dana (solo developer)
```

---

## FAZA 1 — Setup & Infrastruktura

### Korak 1.1 — Inicijalizacija projekta
```bash
npx create-next-app@latest tesoro-couture \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd tesoro-couture
```

### Korak 1.2 — Instalacija zavisnosti
```bash
# UI i dizajn
npx shadcn@latest init
npm install framer-motion

# Baza i auth
npm install @supabase/supabase-js @supabase/ssr

# Forme i validacija
npm install react-hook-form zod @hookform/resolvers

# State management
npm install zustand

# i18n
npm install next-intl

# Utility
npm install clsx tailwind-merge
npm install date-fns
npm install @types/node
```

### Korak 1.3 — Supabase setup
1. Idi na supabase.com → napravi novi projekat "tesoro-couture"
2. Kopiraj `SUPABASE_URL` i `SUPABASE_ANON_KEY` u `.env.local`
3. Pokreni SQL iz `FAZA 1 — Database Schema` sekcije ispod

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_KURS_EUR=117
```

### Korak 1.4 — Database Schema (pokrenuti u Supabase SQL Editor)
```sql
-- Tabela profila korisnika
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  ime TEXT NOT NULL,
  prezime TEXT NOT NULL,
  telefon TEXT,
  uloga TEXT DEFAULT 'korisnik' CHECK (uloga IN ('korisnik', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Automatsko kreiranje profila na registraciju
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, ime, prezime)
  VALUES (NEW.id, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Tabela haljina
CREATE TABLE haljine (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  naziv_sr TEXT NOT NULL,
  naziv_en TEXT NOT NULL,
  opis_sr TEXT,
  opis_en TEXT,
  cijena_rsd DECIMAL(10,2) NOT NULL,
  na_popustu BOOLEAN DEFAULT FALSE,
  popust_procenat INTEGER DEFAULT 0 CHECK (popust_procenat >= 0 AND popust_procenat <= 100),
  kategorija TEXT CHECK (kategorija IN ('vjencana', 'koktel', 'svecana', 'casual', 'maturska')),
  dostupne_boje JSONB DEFAULT '[]',
  dostupne_velicine JSONB DEFAULT '[]',
  slike JSONB DEFAULT '[]',
  video_url TEXT,
  dostupna BOOLEAN DEFAULT TRUE,
  kolicina_na_lageru INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela rezervacija
CREATE TABLE rezervacije (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  haljina_id UUID REFERENCES haljine(id) ON DELETE CASCADE,
  ime TEXT NOT NULL,
  prezime TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT NOT NULL,
  odabrana_boja TEXT,
  odabrana_velicina TEXT,
  mjere JSONB,
  napomena TEXT,
  status TEXT DEFAULT 'na_cekanju' CHECK (status IN ('na_cekanju', 'potvrdjena', 'otkazana', 'realizovana')),
  datum_termina DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE haljine ENABLE ROW LEVEL SECURITY;
ALTER TABLE rezervacije ENABLE ROW LEVEL SECURITY;

-- Profiles: korisnik vidi samo svoj profil
CREATE POLICY "Korisnik vidi svoj profil" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Korisnik mijenja svoj profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Haljine: svi mogu čitati, samo admin piše
CREATE POLICY "Svi čitaju haljine" ON haljine
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin upravlja haljinama" ON haljine
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND uloga = 'admin')
  );

-- Rezervacije: korisnik vidi svoje, admin sve
CREATE POLICY "Korisnik vidi svoje rezervacije" ON rezervacije
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Svi mogu kreirati rezervaciju" ON rezervacije
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin vidi sve rezervacije" ON rezervacije
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND uloga = 'admin')
  );
```

### Korak 1.5 — Supabase Storage Buckets
U Supabase Dashboard → Storage → napravi bucket-e:
- `haljine-slike` (public)
- `haljine-video` (public)

### Claude Code prompt za Fazu 1:
> "Setup je završen. Napravi mi Supabase client konfiguraciju za Next.js 15 App Router. Treba mi: lib/supabase/client.ts (browser client), lib/supabase/server.ts (server client sa cookies), i middleware.ts za auth refresh sesije."

---

## FAZA 2 — Dizajn Sistem & Layout

### Šta se radi:
- Tailwind config sa custom bojama i fontovima
- Globalni CSS varijable
- Navbar (desktop + mobile hamburger)
- Footer
- Homepage skeleton

### shadcn komponente za instalaciju:
```bash
npx shadcn@latest add button input label select
npx shadcn@latest add dialog sheet drawer
npx shadcn@latest add badge separator skeleton
npx shadcn@latest add toast sonner
npx shadcn@latest add dropdown-menu navigation-menu
```

### Claude Code prompts za Fazu 2:

**Prompt 2.1 — Tailwind & Dizajn Sistem:**
> "Podesi mi tailwind.config.ts za TESORO Couture projekat. Boje: primary #1a1a1a, secondary/zlatna #c9a96e, cream pozadina #faf7f4, muted #8a8a8a, border #e8e0d8. Fontovi: Cormorant Garamond (serif, za naslove) i DM Sans (sans-serif, za body) — dodaj Google Fonts import u layout.tsx. Napravi i globals.css sa CSS varijablama."

**Prompt 2.2 — Navbar:**
> "Napravi Navbar komponentu za TESORO Couture. Desktop: logo lijevo, navigacija u sredini (Početna, Katalog, O nama, Vodič za veličine), desno: ikonicu korpe sa brojem artikala, login/avatar i language switcher SR|EN. Mobile: hamburger meni koji otvara Sheet/drawer sa istim linkovima. Stil: minimalistički, pozadina bijela/prozirna sa blur efektom na scroll, zlatni hover efekti."

**Prompt 2.3 — Homepage:**
> "Napravi Homepage za TESORO Couture. Sekcije:
> 1. Hero — full-height, velika slika haljine (placeholder), naziv salona elegantnim serifom, kratki tagline, CTA dugme 'Pogledaj kolekciju'
> 2. Featured haljine — 3-4 karte iz baze (server component, fetch featured=true)
> 3. O salonu kratko — 2 kolone, tekst lijevo + slika desno
> 4. Poziv na akciju — rezervacija termina banner
> Minimalistički dizajn, puno bijelog prostora, Framer Motion fade-in animacije."

---

## FAZA 3 — Katalog & Haljine

### Claude Code prompts za Fazu 3:

**Prompt 3.1 — HaljinaCard komponenta:**
> "Napravi HaljinaCard komponentu. Sadrži: slika haljine (omjer 3:4, object-cover), overlay sa drugom slikom na hover, naziv haljine, cijena u RSD i EUR, badge 'POPUST -X%' ako je na_popustu=true, badge 'PO MJERI' ako ima tu opciju. Klikabilna → /haljina/[slug]. Elegantni hover efekti (scale 1.02, shadow)."

**Prompt 3.2 — Filteri:**
> "Napravi Filteri komponentu za /katalog stranicu. Filteri: kategorija (checkboxes), boja (color swatches klikabilni), veličina (pill buttons), raspon cijene (range slider), na popustu (toggle switch). Sortiranje: dropdown (najnovije, cijena↑↓, popularno, popust). Na mobile: filteri su sakriveni u Sheet koji se otvara dugmetom 'Filteri'. Koristiti URL search params za state (searchParams) da filteri perzistuju na refresh."

**Prompt 3.3 — Detaljna stranica haljine:**
> "Napravi /haljina/[slug]/page.tsx. Layout: lijevo galerija slika (glavna + thumbnaili ispod, klik mijenja glavnu), desno: naziv, cijena RSD/EUR (sa precrtanom originalnom ako je popust), opis, odabir boje (color swatches), odabir veličine (pill buttons + 'Po mjeri' opcija), ako 'Po mjeri' → forma za unos mjera (grudi, struk, bokovi, visina) sa linkom na vodič. Dugme 'Dodaj u korpu' i 'Rezerviši odmah'. Ako postoji video_url → video tab pored galerije."

**Prompt 3.4 — Vodič za veličine:**
> "Napravi /vodic-za-velicine stranicu. Sadržaj: uvodni tekst, SVG ilustracija tijela sa oznakama gdje se mjeri (grudi, struk, bokovi, visina), tabela veličina (XS do XXL sa cm rasponima), savjeti za mjerenje. Elegantan, informativan layout."

---

## FAZA 4 — Korpa & Rezervacija

### Korak 4.1 — Zustand store
> "Napravi Zustand store za korpu u store/korpa.ts. Tip artikla: {haljina_id, slug, naziv, slika, boja, velicina, mjere?, cijena_rsd, cijena_eur}. Akcije: dodajArtikl, ukloniArtikl, ocistiKorpu. Persist u localStorage. Eksportuj useKorpa hook."

### Korak 4.2 — Korpa stranica
> "Napravi /korpa stranicu. Prikazuje listu artikala iz Zustand store-a. Svaki artikl: slika, naziv, boja, veličina, cijena, dugme ukloni. Na dnu: ukupno RSD/EUR, dugme 'Nastavi na rezervaciju'. Ako je korpa prazna → poruka i link na katalog."

### Korak 4.3 — Rezervacija forma
> "Napravi /rezervacija stranicu sa formom. Polja: Ime, Prezime, Telefon, Email, Željeni datum termina (date picker, min: sutrašnji datum), Napomena (opciono). Na vrhu kratak pregled artikala iz korpe. Submit šalje na /api/rezervacije koji insertuje u Supabase i šalje email notifikaciju. Koristiti React Hook Form + Zod validaciju. Nakon submita → success stranica sa porukom."

---

## FAZA 5 — Auth (Login/Register)

### Claude Code prompts:

**Prompt 5.1:**
> "Napravi /login stranicu sa Supabase Auth. Email + password forma. Link na /registracija. Koristiti server action za submit. Nakon login → redirect na /profil ili na stranicu sa koje je korisnik došao (callbackUrl). Minimalistički dizajn."

**Prompt 5.2:**
> "Napravi /registracija stranicu. Polja: Ime, Prezime, Email, Telefon, Password, Potvrdi password. Server action → supabase.auth.signUp + update profiles tabele. Nakon registracije → poruka da provjeri email."

**Prompt 5.3:**
> "Napravi /profil stranicu (protected route). Prikazuje korisnikove podatke i listu njegovih rezervacija sa statusima. Admin korisnici vide link na /admin panel."

---

## FAZA 6 — Admin Panel

### Claude Code prompts:

**Prompt 6.1 — Layout:**
> "Napravi Admin layout sa sidebar navigacijom. Linkovi: Dashboard, Haljine, Rezervacije, Statistika, Korisnici. Protected — provjeri uloga='admin' u middleware, ako nije admin redirect na /. Sidebar kolaps na mobile."

**Prompt 6.2 — Upravljanje haljinama:**
> "Napravi /admin/haljine stranicu — tabela svih haljina sa kolonama: slika (thumbnail), naziv, kategorija, cijena, na lageru (dostupna toggle), popust, akcije (edit/delete). Dugme 'Dodaj haljinu' → /admin/haljine/nova."

**Prompt 6.3 — Forma za haljinu:**
> "Napravi formu za dodavanje/editovanje haljine (/admin/haljine/nova i /admin/haljine/[id]). Polja: naziv SR/EN, opis SR/EN, cijena RSD, kategorija (select), upload slika (multiple, drag&drop → Supabase Storage), upload video (opciono → Supabase Storage), dostupne boje (color picker koji dodaje u listu), dostupne veličine (multi-select checkboxes), kolicina na lageru, popust toggle + procenat, featured toggle. Submit → API route."

**Prompt 6.4 — Rezervacije:**
> "Napravi /admin/rezervacije stranicu. Tabela sa filterom po statusu (sve/na_cekanju/potvrdjena/otkazana/realizovana). Kolone: datum, klijent, haljina, veličina, boja, status (editable select), akcije. Klik na red → modal sa svim detaljima."

**Prompt 6.5 — Statistika:**
> "Napravi /admin/statistika stranicu. Kartice: ukupno rezervacija ovaj mjesec, realizovano, na čekanju, otkazano. Grafikon linija — rezervacije po mesecima (zadnjih 12 meseci). Grafikon bar — top 5 najpopularnijih haljina. Koristiti Recharts biblioteku."

---

## FAZA 7 — i18n

**Prompt 7.1:**
> "Podesi next-intl za srpski i engleski jezik. Default locale je 'sr'. Napravi messages/sr.json i messages/en.json sa prijevodima za: navigaciju, homepage, katalog, detalji haljine, korpa, rezervacija, login/register, footer. Omotaj app u [locale] folder. Napravi LanguageSwitcher komponentu za Navbar."

---

## FAZA 8 — Polishing & Deploy

### Checklist prije deploya:
- [ ] Sve slike imaju alt tekstove
- [ ] generateMetadata na svim stranicama
- [ ] Loading.tsx i error.tsx na ključnim rutama
- [ ] Mobile testiranje (sve stranice)
- [ ] Favicon i og:image sa TESORO logom
- [ ] robots.txt i sitemap.xml
- [ ] Rate limiting na API routes
- [ ] Environment varijable na Vercel

### Deploy:
```bash
# Poveži sa GitHub
git init && git add . && git commit -m "initial commit"
gh repo create tesoro-couture --private
git push

# Deploy na Vercel
npx vercel
# Unesi env varijable u Vercel dashboard
```

---

## Redoslijed Claude Code Sesija

Preporučeni pristup — jedna sesija = jedna logička cjelina:

| Sesija | Šta se radi | Estimacija |
|--------|-------------|------------|
| 1 | Faza 1 kompletna (setup, DB, Supabase clients) | 2-3h |
| 2 | Faza 2: Tailwind config + Navbar + Footer | 2h |
| 3 | Faza 2: Homepage + O nama stranica | 2-3h |
| 4 | Faza 3: HaljinaCard + Grid + Filteri | 3h |
| 5 | Faza 3: Detaljna stranica + Vodič za veličine | 3h |
| 6 | Faza 4: Zustand korpa + Korpa stranica + Rezervacija | 3h |
| 7 | Faza 5: Auth (Login/Register/Profil) | 2h |
| 8 | Faza 6: Admin layout + Haljine CRUD + Upload | 4h |
| 9 | Faza 6: Rezervacije admin + Statistika | 3h |
| 10 | Faza 7: i18n SR/EN | 2h |
| 11 | Faza 8: Polishing + SEO + Deploy | 2h |

---

## Tips za rad sa Claude Code

1. **Uvijek daj kontekst** — na početku svake sesije reci: *"Radim na TESORO Couture projektu. Pročitaj CLAUDE.md za kontekst."*

2. **Jedna stvar odjednom** — ne pitaj za 5 komponenti odjednom

3. **Daj mu greške** — ako nešto ne radi, paste cijelu grešku

4. **Iterativno** — prvo radi da radi, pa tek onda polishing

5. **Komiti često** — `git commit` nakon svake završene sesije
