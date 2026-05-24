import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Unesite ispravnu email adresu'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
})

export const registerSchema = z
  .object({
    ime: z.string().min(2, 'Ime mora imati najmanje 2 karaktera').max(50),
    prezime: z.string().min(2, 'Prezime mora imati najmanje 2 karaktera').max(50),
    email: z.string().email('Unesite ispravnu email adresu'),
    telefon: z
      .string()
      .min(9, 'Unesite ispravan broj telefona')
      .max(20)
      .regex(/^[+\d\s()-]+$/, 'Nevalidan format broja'),
    password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Lozinke se ne podudaraju',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
