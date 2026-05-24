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
    naziv_en: formData.get('naziv_en') as string,
    opis_sr: (formData.get('opis_sr') as string) || '',
    opis_en: (formData.get('opis_en') as string) || '',
    cijena_rsd: parseFloat(formData.get('cijena_rsd') as string) || 0,
    na_popustu: formData.get('na_popustu') === 'true',
    popust_procenat: parseInt(formData.get('popust_procenat') as string) || 0,
    kategorija: formData.get('kategorija') as string,
    dostupne_boje: JSON.parse((formData.get('dostupne_boje') as string) || '[]'),
    dostupne_velicine: JSON.parse((formData.get('dostupne_velicine') as string) || '[]'),
    slike: JSON.parse((formData.get('slike') as string) || '[]'),
    video_url: (formData.get('video_url') as string) || null,
    dostupna: formData.get('dostupna') === 'true',
    kolicina_na_lageru: parseInt(formData.get('kolicina_na_lageru') as string) || 0,
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
  const { error } = await supabase.from('haljine').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
  revalidatePath('/katalog')
}

export async function toggleDostupnost(id: string, dostupna: boolean): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const { error } = await supabase.from('haljine').update({ dostupna }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/haljine')
}

export async function updateStatusRezervacije(id: string, status: StatusRezervacije): Promise<{ error: string } | void> {
  let supabase
  try {
    supabase = await adminClient()
  } catch {
    return { error: 'Nemate pristup.' }
  }
  const { error } = await supabase.from('rezervacije').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/rezervacije')
  revalidatePath(`/admin/rezervacije/${id}`)
}
