---
name: run-dev
description: Pokreni TESORO Couture Next.js dev server i provjeri da radi
trigger: when user asks to run, start, or pokrenuti app/server/sajt
---

## Pokretanje TESORO Couture dev servera

### 1. Ubij stari process ako postoji
```bash
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1
```

### 2. Pokreni dev server u pozadini
```bash
cd /Users/viktorlakcevic/Desktop/tesoro-coture
PATH="/opt/homebrew/bin:$PATH" npm run dev > /tmp/tesoro-dev.log 2>&1 &
echo "PID: $!"
```

### 3. Sačekaj da server bude spreman (max 30s)
```bash
for i in $(seq 1 15); do
  sleep 2
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
  echo "Attempt $i: HTTP $STATUS"
  [ "$STATUS" = "200" ] && echo "Server spreman!" && break
done
```

### 4. Provjeri log ako ne radi
```bash
tail -30 /tmp/tesoro-dev.log
```

### Korisni portovi
- Dev server: http://localhost:3000
- Admin: http://localhost:3000/admin

### Napomene
- Env varijable su u `.env.local` (Supabase + Cloudinary kredencijali)
- Next.js 15 koristi Turbopack po defaultu
- Ako port 3000 zauzet: `lsof -ti:3000 | xargs kill -9`
