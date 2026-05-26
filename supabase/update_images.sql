-- Update demo haljine with real Unsplash images
-- Run this in Supabase SQL Editor

-- Update existing demo records with Unsplash images
UPDATE haljine
SET slike = '[
  "https://images.unsplash.com/photo-1765229279946-f265fa703385?w=800&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&fit=crop&auto=format"
]'
WHERE slug = 'elegantna-crvena-koktel';

UPDATE haljine
SET slike = '[
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80&fit=crop&auto=format"
]'
WHERE slug = 'bijela-vjencana-klasik';

-- Add a third featured dress (svecana)
INSERT INTO haljine (
  slug,
  naziv_sr,
  naziv_en,
  opis_sr,
  opis_en,
  cijena_rsd,
  na_popustu,
  popust_procenat,
  kategorija,
  dostupne_boje,
  dostupne_velicine,
  slike,
  dostupna,
  kolicina_na_lageru,
  featured
) VALUES (
  'bordo-svecana-haljina',
  'Bordo svečana haljina',
  'Burgundy Evening Gown',
  'Raskošna svečana haljina u dubokoj bordo nijansi. Izrađena od visokokvalitetnog satena sa dekorativnim detaljem na struku. Idealna za gala večeri i svečane proslave.',
  'Luxurious evening gown in deep burgundy. Made from high-quality satin with decorative waist detail. Perfect for gala evenings.',
  89900,
  false,
  0,
  'svecana',
  '[{"naziv": "Bordo", "hex": "#722F37"}, {"naziv": "Tamno plava", "hex": "#1B2A4A"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1675294292199-aac27f952585?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1623580674393-edf6eb7090f8?w=800&q=80&fit=crop&auto=format"
  ]',
  true,
  4,
  true
) ON CONFLICT (slug) DO UPDATE SET
  slike = EXCLUDED.slike,
  featured = true;
