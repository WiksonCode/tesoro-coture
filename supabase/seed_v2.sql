-- ============================================================
-- TESORO Couture — Seed data za schema_v2
-- Pokrenuti u Supabase SQL Editor
-- ============================================================

-- 1. KATEGORIJE
-- ============================================================
INSERT INTO kategorije (slug, naziv_sr, naziv_en, redosled) VALUES
  ('vjencane',  'Vjenčane',  'Wedding',    1),
  ('svecane',   'Svečane',   'Evening',    2),
  ('koktel',    'Koktel',    'Cocktail',   3),
  ('maturske',  'Maturske',  'Prom',       4),
  ('casual',    'Casual',    'Casual',     5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. HALJINE (modeli)
-- ============================================================
-- Čuvamo ID-ove kategorija u privremenim varijablama
DO $$
DECLARE
  id_vjencane  uuid;
  id_svecane   uuid;
  id_koktel    uuid;
  id_maturske  uuid;
  id_casual    uuid;

  h1 uuid; h2 uuid; h3 uuid; h4 uuid; h5 uuid;
  h6 uuid; h7 uuid; h8 uuid;
BEGIN

SELECT id INTO id_vjencane  FROM kategorije WHERE slug = 'vjencane';
SELECT id INTO id_svecane   FROM kategorije WHERE slug = 'svecane';
SELECT id INTO id_koktel    FROM kategorije WHERE slug = 'koktel';
SELECT id INTO id_maturske  FROM kategorije WHERE slug = 'maturske';
SELECT id INTO id_casual    FROM kategorije WHERE slug = 'casual';

-- ── Haljina 1: Bijela vjenčana ───────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'bijela-vjencana-princeza',
  'Bijela vjenčana princeza',
  'White Princess Wedding Gown',
  'Raskošna vjenčana haljina A-linije sa dugačkim šlepom. Gornji dio od mikade satena ukrašen ručno rađenom čipkom, suknja bogata i vazdušasta. Savršena za vjenčanje iz snova.',
  'Luxurious A-line wedding gown with a long train. Mikado satin bodice adorned with handcrafted lace, full and airy skirt. Perfect for a dream wedding.',
  id_vjencane,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0041584001779653204.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0217541001779653202.jpg"]',
  true
) RETURNING id INTO h1;

-- ── Haljina 2: Čipkasta vjenčana ────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'cipkasta-vjencana-boho',
  'Čipkasta vjenčana boho',
  'Lace Boho Wedding Dress',
  'Romantična boho vjenčana haljina od francuske čipke. Dugi rukavi, dekolte V-oblika i lagana svilena podstava. Idealna za vjenčanje na otvorenom.',
  'Romantic boho wedding dress made of French lace. Long sleeves, V-neckline and light silk lining. Ideal for outdoor weddings.',
  id_vjencane,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0252956001779653167.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0538321001779653186.jpg"]',
  false
) RETURNING id INTO h2;

-- ── Haljina 3: Crna svečana ──────────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'crna-svecana-elegantna',
  'Crna svečana elegantna',
  'Black Elegant Evening Gown',
  'Klasična crna svečana haljina od krepa sa asimetričnim izrezom i rahlim šlepom. Minimalistički dizajn koji odiše luksuzom i sofisticiranošću.',
  'Classic black evening gown in crepe fabric with asymmetric neckline and soft train. Minimalist design radiating luxury and sophistication.',
  id_svecane,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0690141001779653184.jpg"]',
  true
) RETURNING id INTO h3;

-- ── Haljina 4: Bordo svečana ─────────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'bordo-svecana-sirena',
  'Bordo svečana sirena',
  'Burgundy Mermaid Gown',
  'Glamurozna svečana haljina sirena-siluete od baršuna u bordo nijansi. Duboki dekolte na leđima, dugačak hlep. Za ženu koja želi ostaviti neizbrisiv utisak.',
  'Glamorous mermaid silhouette evening gown in burgundy velvet. Deep back neckline, long train. For the woman who wants to make an unforgettable impression.',
  id_svecane,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0859379001779658518.jpg"]',
  false
) RETURNING id INTO h4;

-- ── Haljina 5: Mini koktel ───────────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, video_url, featured)
VALUES (
  'mini-koktel-zlatna',
  'Mini koktel zlatna',
  'Gold Mini Cocktail Dress',
  'Elegantna kratka koktel haljina od zlatnog brokara. Ravna silueta, tanki breteli i skrivena leđna rajsferšlus. Savršena za koktel zabave i glamurozne večere.',
  'Elegant short cocktail dress in gold brocade. Straight silhouette, thin straps and hidden back zipper. Perfect for cocktail parties and glamorous dinners.',
  id_koktel,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0041584001779653204.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0252956001779653167.jpg"]',
  'https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_video_0234305001779653195.mp4',
  true
) RETURNING id INTO h5;

-- ── Haljina 6: Roze maturska ─────────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'roze-maturska-tyl',
  'Roze maturska tyl',
  'Pink Tulle Prom Dress',
  'Raskošna maturska haljina od roze tila sa A-linijom siluetom. Gornji dio ukrašen diskretnim kristalima, suknja lagana i vazdušasta. Idealna za nezaboravnu matursku večer.',
  'Luxurious pink tulle prom dress with A-line silhouette. Top adorned with subtle crystals, skirt light and airy. Perfect for an unforgettable prom night.',
  id_maturske,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0538321001779653186.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg"]',
  true
) RETURNING id INTO h6;

-- ── Haljina 7: Ljetna casual ─────────────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'ljetna-casual-midi',
  'Ljetna casual midi',
  'Summer Casual Midi',
  'Lagana ljetna haljina midi dužine od viskoznog šifona. Cvjetni print, elastična struka i volanaste rukavice. Idealna za opuštene prilike, šetnje i piknik.',
  'Light summer midi dress in viscose chiffon. Floral print, elastic waist and ruffled sleeves. Ideal for casual occasions, walks and picnics.',
  id_casual,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0690141001779653184.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0859379001779658518.jpg"]',
  false
) RETURNING id INTO h7;

-- ── Haljina 8: Tamno plava svečana ──────────────────────────
INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, kategorija_id, slike, featured)
VALUES (
  'tamno-plava-svecana',
  'Tamno plava svečana',
  'Midnight Blue Evening Dress',
  'Elegantna svečana haljina u tamno plavoj boji od satena. Jednostruki rame, nabrana suknja do poda. Sofisticiran izbor za gala večeri i dodjele nagrada.',
  'Elegant evening dress in midnight blue satin. One-shoulder design, floor-length gathered skirt. Sophisticated choice for gala evenings and award ceremonies.',
  id_svecane,
  '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0217541001779653202.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg"]',
  false
) RETURNING id INTO h8;


-- ============================================================
-- 3. INVENTAR (fizičke instance sa siframa, bojama, veličinama)
-- ============================================================

-- ── H1: Bijela vjenčana princeza ────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('VJE-001-BEL-S',  h1, 'Bela',   '#FFFEF5', 'S',  189000, 1615, 'nova',      true),
  ('VJE-001-BEL-M',  h1, 'Bela',   '#FFFEF5', 'M',  189000, 1615, 'nova',      true),
  ('VJE-001-BEL-L',  h1, 'Bela',   '#FFFEF5', 'L',  189000, 1615, 'odlicna',   true),
  ('VJE-001-SLO-M',  h1, 'Slonova kost', '#F8F3E6', 'M', 192000, 1641, 'nova', true),
  ('VJE-001-SLO-L',  h1, 'Slonova kost', '#F8F3E6', 'L', 192000, 1641, 'nova', true);

-- ── H2: Čipkasta vjenčana boho ──────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('VJE-002-BEL-XS', h2, 'Bela',   '#FFFEF5', 'XS', 165000, 1410, 'nova',    true),
  ('VJE-002-BEL-S',  h2, 'Bela',   '#FFFEF5', 'S',  165000, 1410, 'nova',    true),
  ('VJE-002-BEL-M',  h2, 'Bela',   '#FFFEF5', 'M',  165000, 1410, 'odlicna', true),
  ('VJE-002-KRE-S',  h2, 'Krem',   '#F5E6D3', 'S',  168000, 1436, 'nova',    true),
  ('VJE-002-KRE-M',  h2, 'Krem',   '#F5E6D3', 'M',  168000, 1436, 'nova',    true);

-- ── H3: Crna svečana elegantna ──────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('SVE-003-CRN-XS', h3, 'Crna',   '#1a1a1a', 'XS', 78000, 667, 'nova',    true),
  ('SVE-003-CRN-S',  h3, 'Crna',   '#1a1a1a', 'S',  78000, 667, 'nova',    true),
  ('SVE-003-CRN-M',  h3, 'Crna',   '#1a1a1a', 'M',  78000, 667, 'odlicna', true),
  ('SVE-003-CRN-L',  h3, 'Crna',   '#1a1a1a', 'L',  78000, 667, 'nova',    true),
  ('SVE-003-NVP-S',  h3, 'Tamno plava', '#1C3A6B', 'S', 81000, 692, 'nova', true),
  ('SVE-003-NVP-M',  h3, 'Tamno plava', '#1C3A6B', 'M', 81000, 692, 'nova', true);

-- ── H4: Bordo svečana sirena ─────────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('SVE-004-BOR-S',  h4, 'Bordo',  '#800020', 'S',  95000, 812, 'nova',    true),
  ('SVE-004-BOR-M',  h4, 'Bordo',  '#800020', 'M',  95000, 812, 'nova',    true),
  ('SVE-004-BOR-L',  h4, 'Bordo',  '#800020', 'L',  95000, 812, 'odlicna', true),
  ('SVE-004-CRN-M',  h4, 'Crna',   '#1a1a1a', 'M',  98000, 838, 'nova',    true),
  ('SVE-004-CRN-L',  h4, 'Crna',   '#1a1a1a', 'L',  98000, 838, 'nova',    true);

-- ── H5: Mini koktel zlatna ───────────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('KOK-005-ZLA-XS', h5, 'Zlatna', '#C9A96E', 'XS', 52000, 444, 'nova',    true),
  ('KOK-005-ZLA-S',  h5, 'Zlatna', '#C9A96E', 'S',  52000, 444, 'nova',    true),
  ('KOK-005-ZLA-M',  h5, 'Zlatna', '#C9A96E', 'M',  52000, 444, 'odlicna', true),
  ('KOK-005-CRN-S',  h5, 'Crna',   '#1a1a1a', 'S',  55000, 470, 'nova',    true),
  ('KOK-005-CRN-M',  h5, 'Crna',   '#1a1a1a', 'M',  55000, 470, 'nova',    true),
  ('KOK-005-CRN-L',  h5, 'Crna',   '#1a1a1a', 'L',  55000, 470, 'nova',    true);

-- ── H6: Roze maturska tyl ────────────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('MAT-006-ROZ-XS', h6, 'Roze',   '#FFB6C1', 'XS', 62000, 530, 'nova',    true),
  ('MAT-006-ROZ-S',  h6, 'Roze',   '#FFB6C1', 'S',  62000, 530, 'nova',    true),
  ('MAT-006-ROZ-M',  h6, 'Roze',   '#FFB6C1', 'M',  62000, 530, 'odlicna', true),
  ('MAT-006-ROZ-L',  h6, 'Roze',   '#FFB6C1', 'L',  62000, 530, 'nova',    true),
  ('MAT-006-LAV-S',  h6, 'Lavanda','#9B87C0', 'S',  62000, 530, 'nova',    true),
  ('MAT-006-LAV-M',  h6, 'Lavanda','#9B87C0', 'M',  62000, 530, 'nova',    true),
  ('MAT-006-BEL-S',  h6, 'Bela',   '#FFFEF5', 'S',  62000, 530, 'nova',    true),
  ('MAT-006-BEL-M',  h6, 'Bela',   '#FFFEF5', 'M',  62000, 530, 'nova',    true);

-- ── H7: Ljetna casual midi ───────────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('CAS-007-PLV-XS', h7, 'Plava',  '#4A7FC1', 'XS', 28000, 239, 'nova',    true),
  ('CAS-007-PLV-S',  h7, 'Plava',  '#4A7FC1', 'S',  28000, 239, 'nova',    true),
  ('CAS-007-PLV-M',  h7, 'Plava',  '#4A7FC1', 'M',  28000, 239, 'odlicna', true),
  ('CAS-007-PLV-L',  h7, 'Plava',  '#4A7FC1', 'L',  28000, 239, 'nova',    true),
  ('CAS-007-ZEL-S',  h7, 'Zelena', '#2D7D5A', 'S',  28000, 239, 'nova',    true),
  ('CAS-007-ZEL-M',  h7, 'Zelena', '#2D7D5A', 'M',  28000, 239, 'nova',    true),
  ('CAS-007-ZEL-L',  h7, 'Zelena', '#2D7D5A', 'L',  28000, 239, 'nova',    true);

-- ── H8: Tamno plava svečana ──────────────────────────────────
INSERT INTO inventar (sifra, haljina_id, boja_naziv, boja_hex, velicina, cijena_rsd, cijena_eur, stanje, dostupna) VALUES
  ('SVE-008-NPL-XS', h8, 'Tamno plava', '#1C3A6B', 'XS', 85000, 726, 'nova',    true),
  ('SVE-008-NPL-S',  h8, 'Tamno plava', '#1C3A6B', 'S',  85000, 726, 'nova',    true),
  ('SVE-008-NPL-M',  h8, 'Tamno plava', '#1C3A6B', 'M',  85000, 726, 'odlicna', true),
  ('SVE-008-NPL-L',  h8, 'Tamno plava', '#1C3A6B', 'L',  85000, 726, 'nova',    true),
  ('SVE-008-CRN-S',  h8, 'Crna',        '#1a1a1a', 'S',  88000, 752, 'nova',    true),
  ('SVE-008-CRN-M',  h8, 'Crna',        '#1a1a1a', 'M',  88000, 752, 'nova',    true);

END $$;
