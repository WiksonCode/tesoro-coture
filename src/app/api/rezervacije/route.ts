import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rezervacijaSchema } from '@/lib/validations/rezervacija'
import type { KorpaArtikl } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { artikli, ...formData } = body as { artikli: KorpaArtikl[] } & Record<string, unknown>

    const parsed = rezervacijaSchema.safeParse(formData)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Nevalidni podaci forme.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    if (!artikli || artikli.length === 0) {
      return NextResponse.json(
        { error: 'Korpa je prazna.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const rezervacije = artikli.map((artikl) => ({
      inventar_id: artikl.inventar_id,
      ime: parsed.data.ime,
      prezime: parsed.data.prezime,
      telefon: parsed.data.telefon,
      email: parsed.data.email,
      napomena: parsed.data.napomena ?? null,
      datum_termina: parsed.data.datum_termina || null,
      status: 'na_cekanju' as const,
    }))

    const { error } = await supabase.from('rezervacije').insert(rezervacije)

    if (error) {
      console.error('[rezervacije] Supabase error:', error)
      return NextResponse.json(
        { error: 'Greška pri čuvanju rezervacije. Pokušajte ponovo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e) {
    console.error('[rezervacije] Unexpected error:', e)
    return NextResponse.json(
      { error: 'Neočekivana greška. Pokušajte ponovo.' },
      { status: 500 }
    )
  }
}
