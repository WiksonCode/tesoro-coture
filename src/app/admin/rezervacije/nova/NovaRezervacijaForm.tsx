'use client'

import { useState, useTransition, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createRezervacijaAction } from './actions'

interface InventarStavka {
  id: string
  sifra: string
  boja_naziv: string
  boja_hex: string
  velicina: string
  dostupna: boolean
}

interface Haljina {
  id: string
  naziv_sr: string
  inventar: InventarStavka[]
}

const inputCls = 'w-full border border-[#e8e0d8] bg-white px-3.5 py-2.5 text-[13px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors'
const labelCls = 'block text-[8px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-1.5'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls} style={{ fontFamily: 'var(--font-sans)' }}>{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>{error}</p>}
    </div>
  )
}

export default function NovaRezervacijaForm({ haljine }: { haljine: Haljina[] }) {
  const [haljinaId, setHaljinaId] = useState('')
  const [serverError, setServerError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, startTransition] = useTransition()

  const odabranaHaljina = haljine.find((h) => h.id === haljinaId)
  const inventarOpcije = odabranaHaljina?.inventar ?? []

  function validate(fd: FormData) {
    const e: Record<string, string> = {}
    if (!fd.get('inventar_id')) e.inventar_id = 'Odaberite stavku inventara'
    if (!(fd.get('ime') as string)?.trim()) e.ime = 'Obavezno polje'
    if (!(fd.get('prezime') as string)?.trim()) e.prezime = 'Obavezno polje'
    if (!(fd.get('telefon') as string)?.trim()) e.telefon = 'Obavezno polje'
    if (!(fd.get('email') as string)?.trim()) e.email = 'Obavezno polje'
    return e
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const errs = validate(fd)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    startTransition(async () => {
      const result = await createRezervacijaAction(fd)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[12px] text-red-600" style={{ fontFamily: 'var(--font-sans)' }}>{serverError}</p>
        </div>
      )}

      {/* Sekcija: Haljina */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Haljina i inventar
        </p>
        <div className="grid lg:grid-cols-2 gap-4">
          <Field label="Haljina *">
            <select
              value={haljinaId}
              onChange={(e) => setHaljinaId(e.target.value)}
              className={inputCls + ' cursor-pointer'}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <option value="">— Odaberite haljinu —</option>
              {haljine.map((h) => (
                <option key={h.id} value={h.id}>{h.naziv_sr}</option>
              ))}
            </select>
          </Field>

          <Field label="Stavka inventara (boja / veličina) *" error={errors.inventar_id}>
            <select
              name="inventar_id"
              disabled={!haljinaId}
              className={inputCls + ' cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'}
              style={{ fontFamily: 'var(--font-sans)' }}
              defaultValue=""
            >
              <option value="">{haljinaId ? '— Odaberite stavku —' : '— Prvo odaberite haljinu —'}</option>
              {inventarOpcije.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.boja_naziv} · {s.velicina} · {s.sifra}{!s.dostupna ? ' (nije dostupna)' : ''}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Sekcija: Klijent */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Podaci klijenta
        </p>
        <div className="grid lg:grid-cols-2 gap-4">
          <Field label="Ime *" error={errors.ime}>
            <input name="ime" type="text" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Prezime *" error={errors.prezime}>
            <input name="prezime" type="text" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Telefon *" error={errors.telefon}>
            <input name="telefon" type="tel" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Email *" error={errors.email}>
            <input name="email" type="email" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Datum termina">
            <input name="datum_termina" type="date" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Okvirno vreme termina">
            <input name="vreme_termina" type="time" className={inputCls} style={{ fontFamily: 'var(--font-sans)' }} />
          </Field>
          <Field label="Status">
            <select name="status" className={inputCls + ' cursor-pointer'} defaultValue="potvrdjena" style={{ fontFamily: 'var(--font-sans)' }}>
              <option value="potvrdjena">Potvrđena</option>
              <option value="na_cekanju">Na čekanju</option>
            </select>
          </Field>
          <div className="lg:col-span-2">
            <Field label="Napomena">
              <textarea
                name="napomena"
                rows={3}
                className={inputCls + ' resize-none'}
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Akcije */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/rezervacije"
          className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={12} />
          Nazad
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2.5 px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.3em] uppercase hover:bg-[#c9a96e] transition-all duration-300 disabled:opacity-50"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {pending && <Loader2 size={12} className="animate-spin" />}
          Kreiraj rezervaciju
        </button>
      </div>
    </form>
  )
}
