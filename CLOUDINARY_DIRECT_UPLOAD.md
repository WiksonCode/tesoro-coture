# Cloudinary Direct Upload — Obrazac bez Vercel posrednika

## Problem koji je riješen

Vercel serverless funkcije imaju limit od **4.5MB** na request body.  
Ako bi browser slao sliku kroz Vercel (stari `POST /api/upload`), sve slike veće od ~4MB bi failale.

**Novo rješenje:** Browser šalje fajlove **direktno Cloudinaryju**, a Vercel server samo generiše kratku kriptografsku signaturu (ne prima fajl uopšte).

---

## Tok podataka

```
STARO:
Browser ──(slika, max 4MB)──▶ Vercel /api/upload ──▶ Cloudinary

NOVO:
Browser ──(mali GET)──▶ Vercel /api/upload-signature ──(signature)──▶ Browser
Browser ──(slika, do 50MB / video do 500MB)──▶ Cloudinary direktno
```

---

## Fajlovi koje treba kopirati / prilagoditi

### 1. `src/app/api/upload-signature/route.ts` — novi fajl

```ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  // Auth provjera — samo admin smije uploadovati
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profil } = await supabase
    .from('profiles')
    .select('uloga')
    .eq('id', user.id)
    .single()
  if (profil?.uloga !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Parametri koji se potpisuju — moraju se poklopiti s onim što browser šalje
  const timestamp = Math.round(Date.now() / 1000)
  const eager = 'q_auto:good,f_auto'   // eager: odmah optimizuj pri uploadu
  const paramsToSign = {
    folder: 'tesoro-couture',           // ← promijeni folder za drugi sajt
    eager,
    timestamp,
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    signature,
    timestamp,
    folder: paramsToSign.folder,
    eager,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  })
}
```

**Važno:** `api_secret` se NIKAD ne šalje browseru — samo `apiKey` (public) i `signature`.

---

### 2. Upload iz browsera — pattern za HaljinaForma.tsx (ili bilo koji form)

```ts
// Korak 1: Uzmi signaturu od Vercel servera
async function getUploadSignature() {
  const res = await fetch('/api/upload-signature')
  if (!res.ok) throw new Error('Greška pri autorizaciji uploada.')
  return res.json() as Promise<{
    signature: string
    timestamp: number
    folder: string
    eager: string
    cloudName: string
    apiKey: string
  }>
}

// Korak 2: Pošalji fajl direktno Cloudinaryju
async function uploadImage(file: File) {
  const { signature, timestamp, folder, eager, cloudName, apiKey } =
    await getUploadSignature()

  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', apiKey)
  fd.append('timestamp', String(timestamp))
  fd.append('signature', signature)
  fd.append('folder', folder)
  fd.append('eager', eager)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: fd }
  )
  const json: { secure_url?: string; eager?: { secure_url: string }[]; error?: { message: string } } =
    await res.json()

  if (!res.ok || json.error) throw new Error(json.error?.message ?? res.statusText)

  // eager[0] = optimizovana verzija, fallback na original
  return json.eager?.[0]?.secure_url ?? json.secure_url!
}

// Za video upload — isti pattern, samo drugačiji endpoint:
// `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
```

---

### 3. Environment varijable (`.env.local` i Vercel dashboard)

```env
CLOUDINARY_CLOUD_NAME=tvoj_cloud_name
CLOUDINARY_API_KEY=tvoj_api_key
CLOUDINARY_API_SECRET=tvoj_api_secret   # nikad ne ide u browser!
```

Za drugi sajt: isti Cloudinary nalog može raditi, samo promijeni `folder` u `upload-signature/route.ts`.

---

### 4. Dependency

```bash
npm install cloudinary
```

Cloudinary SDK koristi se **samo server-side** (za potpisivanje). Browser ne koristi SDK, samo raw `fetch`.

---

## Eager transformacija

`eager: 'q_auto:good,f_auto'` znači:
- **`q_auto:good`** — Cloudinary automatski bira kvalitet (dobro balance između veličine i oštrine)
- **`f_auto`** — Cloudinary servira WebP/AVIF ako browser podržava, JPEG/PNG inače

Cloudinary procesira transformaciju odmah pri uploadu i vraća `eager[0].secure_url` — URL optimizovane verzije.  
Ovo štedi propusnost i ubrzava učitavanje na sajtu.

---

## Limiti

| Tip fajla | Stari limit (kroz Vercel) | Novi limit (direktno) |
|-----------|--------------------------|----------------------|
| Slika     | ~4 MB                    | 50 MB                |
| Video     | ~4 MB                    | 500 MB               |

---

## Sigurnost

- Signatura važi samo za parametre koji su potpisani (`folder`, `eager`, `timestamp`). Browser ne može promijeniti folder ili dodati destruktivne transformacije.
- Signatura ističe ako se ne iskoristi brzo (Cloudinary prihvata do ~1h).
- Auth provjera na `/api/upload-signature` osigurava da samo admini mogu dobiti signaturu.

---

## Checklist za primjenu na drugi sajt

- [ ] Kopirati `src/app/api/upload-signature/route.ts`
- [ ] Promijeniti `folder: 'tesoro-couture'` u naziv foldera za novi sajt
- [ ] Prilagoditi auth provjeru (ako drugi sajt ima drugačiji auth sistem)
- [ ] U upload formi zamijeniti stari `fetch('/api/upload', ...)` novim pattern-om iz sekcije 2
- [ ] Dodati `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` u `.env.local`
- [ ] Dodati iste env varijable u Vercel dashboard (Settings → Environment Variables)
- [ ] `npm install cloudinary` na novom projektu
- [ ] Dodati `res.cloudinary.com` u `next.config.ts` remotePatterns za `next/image`
