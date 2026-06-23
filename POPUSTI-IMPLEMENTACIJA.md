# Sistem popusta (akcijske cijene) — Implementacija

## Kako funkcioniše

Popust je vezan za **inventar stavku** (kombinacija boje i veličine), ne za haljinu u cjelini.
Znači jedna haljina može imati popust samo na određenu boju/veličinu.

---

## 1. Baza podataka — tabela `inventar`

Tri polja koja treba dodati:

```sql
ALTER TABLE inventar ADD COLUMN na_akciji boolean NOT NULL DEFAULT false;
ALTER TABLE inventar ADD COLUMN cijena_akcija_rsd numeric(10,2) DEFAULT NULL;
ALTER TABLE inventar ADD COLUMN cijena_akcija_eur numeric(10,2) DEFAULT NULL;
```

| Polje | Tip | Opis |
|-------|-----|------|
| `na_akciji` | `boolean` | Da li je ova stavka na popustu |
| `cijena_akcija_rsd` | `numeric` | Akcijska cijena u RSD (null = nema akcije) |
| `cijena_akcija_eur` | `numeric` | Akcijska cijena u EUR (null = nema akcije) |

---

## 2. TypeScript tip — `src/types/index.ts`

Dodati u `InventarStavka` interfejs:

```typescript
export interface InventarStavka {
  id: string
  sifra: string
  boja_naziv: string
  boja_hex: string
  velicina: string
  cijena_rsd: number
  cijena_eur: number
  na_akciji: boolean                // ← NOVO
  cijena_akcija_rsd: number | null  // ← NOVO
  cijena_akcija_eur: number | null  // ← NOVO
  slike: string[]
  dostupna: boolean
  arhivirana: boolean
}
```

---

## 3. Prikaz na kartici haljine — `HaljinaCard.tsx`

Logika za prikaz akcijske cijene i badge-a:

```tsx
// Izračunaj da li ima akcije i najniža akcijska cijena
const isNaAkciji = dostupniInventar.some(i => i.na_akciji)
const saleStavke = dostupniInventar.filter(i => i.na_akciji && i.cijena_akcija_rsd != null)
const minSaleCijena = saleStavke.length > 0
  ? Math.min(...saleStavke.map(i => i.cijena_akcija_rsd!))
  : null

// Badge "SALE" u uglu slike
{isNaAkciji && (
  <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] tracking-[0.2em] uppercase px-2 py-1">
    Sale
  </div>
)}

// Prikaz cijene — prekrižena originalna + akcijska
{isNaAkciji && minSaleCijena ? (
  <div className="flex items-baseline gap-2">
    <span className="line-through text-[#8a8a8a] text-sm">{minCijena?.toLocaleString('sr-RS')} din</span>
    <span className="text-red-600 font-medium">{minSaleCijena.toLocaleString('sr-RS')} din</span>
  </div>
) : (
  <span>{minCijena?.toLocaleString('sr-RS')} din</span>
)}
```

---

## 4. Prikaz na stranici haljine — `HaljinaDetalji.tsx`

Logika vezana za odabranu varijantu (boja + veličina):

```tsx
// Kada korisnik odabere boju/veličinu
const isNaAkciji = odabraniInventar?.na_akciji ?? false
const cijenaAkcija = (isNaAkciji && odabraniInventar?.cijena_akcija_rsd != null)
  ? odabraniInventar.cijena_akcija_rsd
  : null

// Prikaz cijene
{cijenaAkcija ? (
  <div className="flex items-baseline gap-3">
    <span className="text-2xl font-light text-red-600">{cijenaAkcija.toLocaleString('sr-RS')} din</span>
    <span className="line-through text-[#8a8a8a]">{odabraniInventar.cijena_rsd.toLocaleString('sr-RS')} din</span>
  </div>
) : (
  <span className="text-2xl font-light">{odabraniInventar?.cijena_rsd.toLocaleString('sr-RS')} din</span>
)}
```

---

## 5. Filter u katalogu — `katalog/page.tsx`

Filter "Na akciji" u query params:

```tsx
// URL: /katalog?akcija=true
const akcija = searchParams.akcija === 'true'

// Filtriranje na client strani
if (akcija) {
  haljine = haljine.filter(h => h.inventar?.some(i => i.na_akciji && !i.arhivirana))
}
```

Supabase query mora uključiti akcijska polja:

```tsx
.select('..., inventar(id, cijena_rsd, cijena_eur, na_akciji, cijena_akcija_rsd, cijena_akcija_eur, ...)')
```

---

## 6. Admin panel — uređivanje inventara

U admin tabeli haljina, po stavci inventara:

```tsx
// Dropdown: da/ne na akciji
<select name="na_akciji" defaultValue={String(stavka.na_akciji ?? false)}>
  <option value="false">Redovna cijena</option>
  <option value="true">Na akciji</option>
</select>

// Input za akcijsku cijenu
<input type="number" name="cijena_akcija_rsd" defaultValue={stavka.cijena_akcija_rsd ?? ''} placeholder="Sale RSD" />
<input type="number" name="cijena_akcija_eur" defaultValue={stavka.cijena_akcija_eur ?? ''} placeholder="Sale EUR" />
```

Server action koji čita i sprema:

```typescript
// src/app/actions/admin.ts
const naAkciji = formData.get('na_akciji') === 'true'

await supabase.from('inventar').update({
  na_akciji: naAkciji,
  cijena_akcija_rsd: naAkciji ? parseFloat(formData.get('cijena_akcija_rsd') as string) || null : null,
  cijena_akcija_eur: naAkciji ? parseFloat(formData.get('cijena_akcija_eur') as string) || null : null,
}).eq('id', inventarId)
```

---

## 7. Utility funkcija — `src/lib/utils.ts`

Ako koristiš procentualni popust umjesto direktne akcijske cijene:

```typescript
export function cijenaSaPopustom(cijena: number, popust: number): number {
  return cijena * (1 - popust / 100)
}

// Upotreba:
const akcijskaCijena = cijenaSaPopustom(15000, 20) // 12000
```

---

## Sažetak toka

```
Admin panel
  → Odabere inventar stavku
  → Uključi "Na akciji" toggle
  → Unese akcijsku cijenu (RSD + EUR)
  → Sačuva

Baza (inventar tabela)
  → na_akciji = true
  → cijena_akcija_rsd = nova cijena
  → cijena_akcija_eur = nova cijena

Frontend
  → HaljinaCard: badge "SALE" + prekrižena cijena
  → HaljinaDetalji: akcijska cijena kad se odabere ta varijanta
  → Katalog filter: "Na akciji" checkbox prikazuje samo akcijske haljine
```
