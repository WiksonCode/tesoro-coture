'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createRezervacijaAction(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const inventarId  = formData.get('inventar_id') as string
  const ime         = (formData.get('ime') as string)?.trim()
  const prezime     = (formData.get('prezime') as string)?.trim()
  const telefon     = (formData.get('telefon') as string)?.trim()
  const email       = (formData.get('email') as string)?.trim()
  const status      = (formData.get('status') as string) || 'potvrdjena'
  const datumRaw    = formData.get('datum_termina') as string
  const vremeRaw    = formData.get('vreme_termina') as string
  const napomena    = (formData.get('napomena') as string)?.trim()

  if (!inventarId || !ime || !prezime || !telefon || !email) {
    return { error: 'Sva obavezna polja moraju biti popunjena.' }
  }

  const { error } = await supabase.from('rezervacije').insert({
    inventar_id:   inventarId,
    ime,
    prezime,
    telefon,
    email,
    status,
    datum_termina: datumRaw || null,
    vreme_termina: vremeRaw || null,
    napomena:      napomena || null,
  })

  if (error) return { error: error.message }

  redirect('/admin/rezervacije')
}
