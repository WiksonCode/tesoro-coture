-- ============================================================
-- TESORO Couture — Database Schema
-- Pokrenuti u Supabase SQL Editor
-- ============================================================

-- Tabela profila korisnika
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  ime TEXT NOT NULL DEFAULT '',
  prezime TEXT NOT NULL DEFAULT '',
  telefon TEXT DEFAULT '',
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
  naziv_en TEXT NOT NULL DEFAULT '',
  opis_sr TEXT DEFAULT '',
  opis_en TEXT DEFAULT '',
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

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER haljine_updated_at
  BEFORE UPDATE ON haljine
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Tabela rezervacija
CREATE TABLE rezervacije (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  haljina_id UUID REFERENCES haljine(id) ON DELETE CASCADE,
  ime TEXT NOT NULL,
  prezime TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT NOT NULL,
  odabrana_boja TEXT DEFAULT '',
  odabrana_velicina TEXT DEFAULT '',
  mjere JSONB,
  napomena TEXT,
  status TEXT DEFAULT 'na_cekanju' CHECK (status IN ('na_cekanju', 'potvrdjena', 'otkazana', 'realizovana')),
  datum_termina DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER rezervacije_updated_at
  BEFORE UPDATE ON rezervacije
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE haljine ENABLE ROW LEVEL SECURITY;
ALTER TABLE rezervacije ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Korisnik vidi svoj profil" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Korisnik mijenja svoj profil" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin vidi sve profile" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND uloga = 'admin')
  );

-- Haljine: svi mogu čitati, samo admin piše
CREATE POLICY "Svi citaju haljine" ON haljine
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin upravlja haljinama" ON haljine
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND uloga = 'admin')
  );

-- Rezervacije
CREATE POLICY "Korisnik vidi svoje rezervacije" ON rezervacije
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Svi mogu kreirati rezervaciju" ON rezervacije
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin vidi sve rezervacije" ON rezervacije
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND uloga = 'admin')
  );

-- ============================================================
-- Storage Buckets (kreirati u Supabase Dashboard → Storage)
-- ============================================================
-- Bucket: haljine-slike (public)
-- Bucket: haljine-video (public)

-- ============================================================
-- Demo podaci (opciono za testiranje)
-- ============================================================
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, cijena_rsd, kategorija, dostupne_boje, dostupne_velicine, featured, dostupna, kolicina_na_lageru)
VALUES
(
  'elegantna-crvena-koktel',
  'Elegantna crvena koktel haljina',
  'Elegant red cocktail dress',
  'Predivna crvena haljina savršena za posebne prilike. Izrađena od visokokvalitetnog materijala.',
  'Beautiful red dress perfect for special occasions. Made from high-quality fabric.',
  45000,
  'koktel',
  '[{"naziv": "Crvena", "hex": "#C41E3A"}, {"naziv": "Tamno crvena", "hex": "#8B0000"}]',
  '["XS", "S", "M", "L", "XL"]',
  true,
  true,
  5
),
(
  'bijela-vjencana-klasik',
  'Bijela vjenčana haljina klasik',
  'White wedding dress classic',
  'Klasična bijela vjenčana haljina sa dugim trenom. Savršena za vjenčanje iz snova.',
  'Classic white wedding dress with long train. Perfect for the wedding of your dreams.',
  120000,
  'vjencana',
  '[{"naziv": "Bijela", "hex": "#FFFFFF"}, {"naziv": "Krem", "hex": "#FFF8DC"}]',
  '["XS", "S", "M", "L", "XL", "XXL", "po_mjeri"]',
  true,
  true,
  3
);
