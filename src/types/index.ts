export type Velicina = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'po_mjeri'
export type StatusRezervacije = 'na_cekanju' | 'potvrdjena' | 'otkazana' | 'realizovana'
export type UlogaKorisnika = 'korisnik' | 'admin'

export interface Kategorija {
  id: string
  slug: string
  naziv_sr: string
  naziv_en: string | null
  redosled: number
  created_at: string
}

export interface Haljina {
  id: string
  slug: string
  naziv_sr: string
  naziv_en: string | null
  opis_sr: string | null
  opis_en: string | null
  kategorija_id: string
  kategorija?: Kategorija
  slike: string[]
  video_url: string | null
  featured: boolean
  created_at: string
  updated_at: string
  inventar?: InventarStavka[]
}

export interface InventarStavka {
  id: string
  sifra: string
  haljina_id: string
  haljina?: Haljina
  boja_naziv: string
  boja_hex: string
  velicina: Velicina
  cijena_rsd: number
  cijena_eur: number

  slike: string[]
  dostupna: boolean
  napomena: string | null
  created_at: string
  updated_at: string
}

export interface Rezervacija {
  id: string
  inventar_id: string
  inventar?: InventarStavka
  korisnik_id: string | null
  korisnik?: Korisnik
  ime: string
  prezime: string
  telefon: string
  email: string
  datum_termina: string
  status: StatusRezervacije
  napomena: string | null
  created_at: string
  updated_at: string
}

export interface Korisnik {
  id: string
  auth_id: string | null
  ime: string
  prezime: string
  email: string
  telefon: string | null
  uloga: UlogaKorisnika
  created_at: string
}

export interface AuditLog {
  id: string
  tabela: string
  zapis_id: string
  akcija: 'INSERT' | 'UPDATE' | 'DELETE'
  stari_podaci: Record<string, unknown> | null
  novi_podaci: Record<string, unknown> | null
  korisnik_id: string | null
  created_at: string
}

export interface KorpaArtikl {
  inventar_id: string
  haljina_id: string
  slug: string
  naziv: string
  slika: string
  boja_naziv: string
  boja_hex: string
  velicina: Velicina
  cijena_rsd: number
  cijena_eur: number
}
