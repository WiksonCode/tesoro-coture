-- ============================================================
-- TESORO Couture — Ažuriranje kategorija
-- Pokrenuti u Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  id_kratke uuid;
BEGIN

-- 1. Umetni nove kategorije
INSERT INTO kategorije (slug, naziv_sr, naziv_en, redosled) VALUES
  ('kratke', 'Kratke haljine', 'Short dresses',  1),
  ('midi',   'Midi haljine',   'Midi dresses',   2),
  ('duge',   'Duge haljine',   'Long dresses',   3)
ON CONFLICT (slug) DO UPDATE
  SET naziv_sr = EXCLUDED.naziv_sr,
      naziv_en = EXCLUDED.naziv_en,
      redosled = EXCLUDED.redosled;

-- 2. Uzmi ID nove kategorije 'midi' kao default za stare haljine
SELECT id INTO id_kratke FROM kategorije WHERE slug = 'midi';

-- 3. Premjesti sve haljine sa starim kategorijama na 'midi' (kao placeholder)
UPDATE haljine
SET kategorija_id = id_kratke
WHERE kategorija_id IN (
  SELECT id FROM kategorije WHERE slug IN ('vjencane', 'svecane', 'koktel', 'maturske', 'casual')
);

-- 4. Obriši stare kategorije
DELETE FROM kategorije WHERE slug IN ('vjencane', 'svecane', 'koktel', 'maturske', 'casual');

END $$;
