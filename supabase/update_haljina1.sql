-- Ažuriraj prvu haljinu sa lokalnom slikom haljina1.jpg
-- /haljina1.jpg je dostupna kao public asset u Next.js projektu

UPDATE haljine
SET slike = '["/haljina1.jpg"]'
WHERE slug = 'elegantna-crvena-koktel';
