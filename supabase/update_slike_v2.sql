-- Ažuriranje slika za sve haljine (zamjena Unsplash URL-ova realnim slikama)

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0041584001779653204.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0217541001779653202.jpg"]'
WHERE slug = 'bijela-vjencana-princeza';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0252956001779653167.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0538321001779653186.jpg"]'
WHERE slug = 'cipkasta-vjencana-boho';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0690141001779653184.jpg"]'
WHERE slug = 'crna-svecana-elegantna';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0859379001779658518.jpg"]'
WHERE slug = 'bordo-svecana-sirena';

UPDATE haljine SET
  slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0041584001779653204.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0252956001779653167.jpg"]',
  video_url = 'https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_video_0234305001779653195.mp4'
WHERE slug = 'mini-koktel-zlatna';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0538321001779653186.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg"]'
WHERE slug = 'roze-maturska-tyl';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0690141001779653184.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0859379001779658518.jpg"]'
WHERE slug = 'ljetna-casual-midi';

UPDATE haljine SET slike = '["https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0217541001779653202.jpg","https://khmnabdpfzdqkzpbaour.supabase.co/storage/v1/object/public/haljine-slike/indownloader.app_picture_0689553001779653199.jpg"]'
WHERE slug = 'tamno-plava-svecana';
