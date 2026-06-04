'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StatusRezervacije } from '@/types'

async function adminClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', user.id).single()
  if (profil?.uloga !== 'admin') throw new Error('Forbidden')
  return supabase
}

function extractHaljinaData(formData: FormData) {
  return {
    slug: formData.get('slug') as string,
    naziv_sr: formData.get('naziv_sr') as string,
    naziv_en: (formData.get('naziv_en') as string) || null,
    opis_sr: (formData.get('opis_sr') as string) || null,
    opis_en: (formData.get('opis_en') as string) || null,
    kategorija_id: formData.get('kategorija_id') as string,
    slike: JSON.parse((formData.get('slike') as string) || '[]'),
    video_url: (formData.get('video_url') as string) || null,
    featured: formData.get('featured') === 'true',
  }
}

export async function createHaljina(formData: FormData): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const data = extractHaljinaData(formData)
  const { error } = await supabase.from('haljine').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
  redirect('/admin/haljine')
}

export async function updateHaljina(id: string, formData: FormData): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const data = extractHaljinaData(formData)
  const { error } = await supabase.from('haljine').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
  redirect('/admin/haljine')
}

export async function deleteHaljina(id: string): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const { error } = await supabase
    .from('haljine')
    .update({ arhivirana: true, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function toggleFeatured(id: string, featured: boolean): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const { error } = await supabase.from('haljine').update({ featured }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
}

export async function toggleDostupnostInventara(inventarId: string, dostupna: boolean): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const { error } = await supabase.from('inventar').update({ dostupna }).eq('id', inventarId)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function deleteInventarStavka(id: string): Promise<{ error: string } | void> {
  let supabase
  try { supabase = await adminClient() } catch { return { error: 'Nemate pristup.' } }

  // Provjeri aktivne rezervacije (na čekanju ili potvrđene)
  const { data: aktivne } = await supabase
    .from('rezervacije')
    .select('id')
    .eq('inventar_id', id)
    .in('status', ['na_cekanju', 'potvrdjena'])
    .limit(1)

  if (aktivne && aktivne.length > 0) {
    return { error: 'Ova stavka ima aktivnu rezervaciju koja još nije realizovana. Stavku možete ukloniti tek kada rezervacija bude realizovana ili otkazana.' }
  }

  // Soft delete — sačuvaj podatke za historiju rezervacija
  const { error } = await supabase
    .from('inventar')
    .update({ arhivirana: true })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function updateInventarStavka(id: string, formData: FormData): Promise<{ error: string } | void> {
  let supabase
  try { supabase = await adminClient() } catch { return { error: 'Nemate pristup.' } }
  const data = {
    boja_naziv: formData.get('boja_naziv') as string,
    boja_hex: formData.get('boja_hex') as string,
    velicina: formData.get('velicina') as string,
    cijena_rsd: parseFloat(formData.get('cijena_rsd') as string),
    cijena_eur: parseFloat(formData.get('cijena_eur') as string),
    slike: JSON.parse((formData.get('slike') as string) || '[]'),
    dostupna: formData.get('dostupna') === 'true',
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('inventar').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function createInventarStavka(haljina_id: string, formData: FormData): Promise<{ error: string } | void> {
  let supabase
  try { supabase = await adminClient() } catch { return { error: 'Nemate pristup.' } }
  const sifra = `INV-${Date.now().toString(36).toUpperCase()}`
  const data = {
    haljina_id,
    sifra,
    boja_naziv: formData.get('boja_naziv') as string,
    boja_hex: formData.get('boja_hex') as string,
    velicina: formData.get('velicina') as string,
    cijena_rsd: parseFloat(formData.get('cijena_rsd') as string),
    cijena_eur: parseFloat(formData.get('cijena_eur') as string),
    slike: JSON.parse((formData.get('slike') as string) || '[]'),
    dostupna: true,
  }
  const { error } = await supabase.from('inventar').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function updateStatusRezervacije(id: string, status: StatusRezervacije): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }

  const { error } = await supabase
    .from('rezervacije')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }

  // Kada je kupovina realizovana → arhiviraj samo tu inventar stavku
  if (status === 'realizovana') {
    const { data: rez } = await supabase
      .from('rezervacije')
      .select('inventar_id')
      .eq('id', id)
      .single()

    if (rez?.inventar_id) {
      await supabase
        .from('inventar')
        .update({ arhivirana: true })
        .eq('id', rez.inventar_id)
    }
  }

  revalidatePath('/admin/rezervacije')
  revalidatePath(`/admin/rezervacije/${id}`)
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
  revalidatePath('/haljina', 'layout')
}
