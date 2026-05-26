import { z } from "zod"

export const rezervacijaSchema = z.object({
  ime: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  prezime: z.string().min(2, "Prezime mora imati najmanje 2 karaktera"),
  telefon: z.string().min(9, "Unesite validan broj telefona"),
  email: z.string().email("Unesite validan email"),
  datum_termina: z.string().min(1, "Odaberite željeni datum termina"),
  napomena: z.string().optional(),
})

export type RezervacijaInput = z.infer<typeof rezervacijaSchema>

export const mjereSchema = z.object({
  grudi: z.number().min(60).max(200),
  struk: z.number().min(40).max(200),
  bokovi: z.number().min(60).max(200),
  visina: z.number().min(140).max(220),
})

export type MjereInput = z.infer<typeof mjereSchema>
