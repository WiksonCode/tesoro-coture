-- Dodavanje više haljina sa Unsplash slikama
-- Pokrenuti u Supabase SQL Editoru

INSERT INTO haljine (slug, naziv_sr, naziv_en, opis_sr, opis_en, cijena_rsd, na_popustu, popust_procenat, kategorija, dostupne_boje, dostupne_velicine, slike, dostupna, kolicina_na_lageru, featured)
VALUES

-- 1. Roze maturska sa tyl suknjom
(
  'roze-maturska-tyl',
  'Roze maturska sa tyl suknjom',
  'Pink Tulle Prom Dress',
  'Raskošna maturska haljina od roze tila sa A-linijom siluetom. Gornji deo ukrašen diskretnim kristalima, suknja lagana i vazdušasta. Idealna za nezaboravnu matursku večer.',
  'Luxurious pink tulle prom dress with A-line silhouette. Top adorned with subtle crystals, skirt light and airy. Perfect for an unforgettable prom night.',
  62000,
  true,
  15,
  'maturska',
  '[{"naziv": "Roze", "hex": "#FFB6C1"}, {"naziv": "Bela", "hex": "#FFFEF5"}, {"naziv": "Lavanda", "hex": "#E6CFEF"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1623580674393-edf6eb7090f8?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1623580674393-edf6eb7090f8?w=800&q=80&fit=crop&crop=top&auto=format"
  ]',
  true,
  8,
  false
),

-- 2. Safir plava svečana haljina (sa popustom)
(
  'safir-plava-svecana',
  'Safir plava svečana haljina',
  'Sapphire Blue Evening Gown',
  'Bogata svečana haljina u dubokoj safir plavoj boji sa dugim trenom. Tkanina pada elegantno, naglašavajući svaki pokret. Savršena za gala večeri i svadbe kao gost.',
  'Rich evening gown in deep sapphire blue with a long train. The fabric falls elegantly, highlighting every movement. Perfect for gala evenings and weddings as a guest.',
  95000,
  true,
  20,
  'svecana',
  '[{"naziv": "Safir plava", "hex": "#0F52BA"}, {"naziv": "Tamno zelena", "hex": "#1B4D3E"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1675294292199-aac27f952585?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1675294292199-aac27f952585?w=800&q=80&fit=crop&crop=top&auto=format"
  ]',
  true,
  3,
  false
),

-- 3. Bela princeza venčana haljina (featured)
(
  'bela-princeza-vencana',
  'Bela princeza venčana haljina',
  'White Princess Bridal Gown',
  'Raskošna venčana haljina u stilu princeze sa čipkastim gornjim delom i svilenom balskom suknjom. Višeslojni tyl kreira voluminoznu siluetu iz bajke. Detalji ručno šivenih perli i kristala.',
  'Lavish princess-style wedding gown with lace bodice and silk ball skirt. Multi-layered tulle creates a fairy-tale volumetric silhouette. Hand-sewn pearl and crystal details.',
  185000,
  false,
  0,
  'vjencana',
  '[{"naziv": "Bela", "hex": "#FFFEF5"}, {"naziv": "Slonova kost", "hex": "#FFFFF0"}, {"naziv": "Krem", "hex": "#FFF8DC"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80&fit=crop&auto=format"
  ]',
  true,
  2,
  true
),

-- 4. Smaragdno zelena koktel haljina
(
  'smaragd-zelena-koktel',
  'Smaragdno zelena koktel haljina',
  'Emerald Green Cocktail Dress',
  'Sofisticirana koktel haljina u bogatoj smaragdno zelenoj boji. Midi dužina sa asimetričnom hem linijom i nežnim naborima na bokovima. Savršena za venčanja, godišnjice i proslava.',
  'Sophisticated cocktail dress in rich emerald green. Midi length with asymmetrical hem and gentle hip pleating. Perfect for weddings, anniversaries and celebrations.',
  58000,
  false,
  0,
  'koktel',
  '[{"naziv": "Smaragd zelena", "hex": "#50C878"}, {"naziv": "Tamno bordo", "hex": "#722F37"}]',
  '["XS", "S", "M", "L", "XL"]',
  '[
    "https://images.unsplash.com/photo-1765229279946-f265fa703385?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1765229279946-f265fa703385?w=800&q=80&fit=crop&crop=top&auto=format"
  ]',
  true,
  6,
  false
),

-- 5. Crna casual haljina
(
  'crna-casual-elegantna',
  'Crna elegantna casual haljina',
  'Black Elegant Casual Dress',
  'Svestrana crna haljina koja prelazi granice između casual i elegantnog. Kvalitetna krepova tkanina pada ravno, midi dužina. Odeća koja radi za vas — na poslu, na večeri ili na proslavi.',
  'Versatile black dress that crosses the line between casual and elegant. Quality crepe fabric falls straight, midi length. Clothing that works for you — at work, dinner or celebration.',
  35000,
  false,
  0,
  'casual',
  '[{"naziv": "Crna", "hex": "#1a1a1a"}, {"naziv": "Tamno siva", "hex": "#4A4A4A"}]',
  '["XS", "S", "M", "L", "XL", "XXL"]',
  '[
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80&fit=crop&crop=top&auto=format"
  ]',
  true,
  10,
  false
),

-- 6. Zlatna gala svečana haljina (featured)
(
  'zlatna-gala-svecana',
  'Zlatna gala svečana haljina',
  'Golden Gala Evening Gown',
  'Ekskluzivna svečana haljina u zlatnoj boji sa sekvinima koji hvataju svetlost pri svakom pokretu. Dug tren, raskošan gornji deo sa V-dekolteom. Za žene koje žele da svetle.',
  'Exclusive evening gown in gold with sequins that catch the light with every movement. Long train, lavish bodice with V-neckline. For women who want to shine.',
  145000,
  false,
  0,
  'svecana',
  '[{"naziv": "Zlatna", "hex": "#D4AF37"}, {"naziv": "Bronza", "hex": "#CD7F32"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1592842232655-e5d345f5e4c2?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1592842232655-e5d345f5e4c2?w=800&q=80&fit=crop&crop=center&auto=format"
  ]',
  true,
  2,
  true
),

-- 7. Perla bela maturska haljina
(
  'perla-bela-maturska',
  'Perla bela maturska haljina',
  'Pearl White Prom Dress',
  'Elegantna maturska haljina u perla beloj boji sa finim detaljima. Silueta hvatanje struka naglašava figuru, midi dužina daje eleganciju i slobodu kretanja.',
  'Elegant prom dress in pearl white with fine details. Figure-hugging silhouette emphasizes shape, midi length provides elegance and freedom of movement.',
  48000,
  true,
  10,
  'maturska',
  '[{"naziv": "Perla bela", "hex": "#F5F0E8"}, {"naziv": "Svetlo roze", "hex": "#FFD1DC"}]',
  '["XS", "S", "M", "L", "XL", "po_mjeri"]',
  '[
    "https://images.unsplash.com/photo-1609205879098-4f02a3c73985?w=800&q=80&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1609205879098-4f02a3c73985?w=800&q=80&fit=crop&crop=top&auto=format"
  ]',
  true,
  5,
  false
)

ON CONFLICT (slug) DO UPDATE SET
  slike = EXCLUDED.slike,
  na_popustu = EXCLUDED.na_popustu,
  popust_procenat = EXCLUDED.popust_procenat;
