export type Kategorija = 'vjencana' | 'koktel' | 'svecana' | 'casual' | 'maturska'

export type StatusRezervacije = 'na_cekanju' | 'potvrdjena' | 'otkazana' | 'realizovana'

export type UlogaKorisnika = 'korisnik' | 'admin'

export interface Boja {
  naziv: string
  hex: string
}

export interface Haljina {
  id: string
  slug: string
  naziv_sr: string
  naziv_en: string
  opis_sr: string
  opis_en: string
  cijena_rsd: number
  na_popustu: boolean
  popust_procenat: number
  kategorija: Kategorija
  dostupne_boje: Boja[]
  dostupne_velicine: string[]
  slike: string[]
  video_url: string | null
  dostupna: boolean
  kolicina_na_lageru: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Mjere {
  grudi: number
  struk: number
  bokovi: number
  visina: number
}

export interface Rezervacija {
  id: string
  user_id: string | null
  haljina_id: string
  ime: string
  prezime: string
  telefon: string
  email: string
  odabrana_boja: string
  odabrana_velicina: string
  mjere: Mjere | null
  napomena: string | null
  status: StatusRezervacije
  datum_termina: string | null
  created_at: string
  updated_at: string
  haljina?: Haljina
}

export interface Profil {
  id: string
  ime: string
  prezime: string
  telefon: string
  uloga: UlogaKorisnika
  created_at: string
}

export interface KorpaArtikl {
  haljina_id: string
  slug: string
  naziv: string
  slika: string
  boja: string
  boja_hex: string
  velicina: string
  mjere?: Mjere
  cijena_rsd: number
}
