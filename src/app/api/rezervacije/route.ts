import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { rezervacijaSchema } from '@/lib/validations/rezervacija'
import { PotvrdarezervacijeEmail } from '@/emails/PotvrdarezervacijeEmail'
import type { KorpaArtikl } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Šalji potvrdu korisniku — ne blokiraj odgovor ako email ne uspe
    if (process.env.RESEND_API_KEY) {
      const from = process.env.RESEND_FROM_EMAIL
        ? `TESORO Couture <${process.env.RESEND_FROM_EMAIL}>`
        : 'TESORO Couture <onboarding@resend.dev>'

      const emailHtml = PotvrdarezervacijeEmail({
        ime: parsed.data.ime,
        prezime: parsed.data.prezime,
        artikli,
        datumTermina: parsed.data.datum_termina || null,
        napomena: parsed.data.napomena ?? null,
      })

      const { error: emailError } = await resend.emails.send({
        from,
        to: [parsed.data.email],
        subject: 'Potvrda rezervacije — TESORO Couture',
        html: emailHtml,
      })

      if (emailError) {
        console.error('[rezervacije] Email error:', emailError)
      }
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
