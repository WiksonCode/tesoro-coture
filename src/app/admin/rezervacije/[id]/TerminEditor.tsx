'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateTerminRezervacije } from '@/app/actions/admin'

const inputCls = 'w-full border border-[#e8e0d8] bg-white px-3 py-2 text-[12px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors'

interface Props {
  id: string
  initialDatum: string | null
  initialVreme: string | null
}

export default function TerminEditor({ id, initialDatum, initialVreme }: Props) {
  const [datum, setDatum] = useState(initialDatum ?? '')
  const [vreme, setVreme] = useState(initialVreme ? initialVreme.slice(0, 5) : '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSave() {
    setSaved(false)
    setError('')
    startTransition(async () => {
      const result = await updateTerminRezervacije(id, datum || null, vreme || null)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
      }
    })
  }

  return (
    <div className="bg-white border border-[#e8e0d8] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Termin
        </h2>
        {pending && <Loader2 size={12} className="animate-spin text-[#8a8a8a]" />}
        {!pending && saved && (
          <span className="text-[9px] text-green-600" style={{ fontFamily: 'var(--font-sans)' }}>
            Sačuvano
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label
            className="block text-[8px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-1.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Datum
          </label>
          <input
            type="date"
            value={datum}
            onChange={(e) => { setDatum(e.target.value); setSaved(false) }}
            className={inputCls}
            style={{ fontFamily: 'var(--font-sans)' }}
          />
        </div>

        <div>
          <label
            className="block text-[8px] tracking-[0.35em] uppercase text-[#8a8a8a] mb-1.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Okvirno vreme
          </label>
          <input
            type="time"
            value={vreme}
            onChange={(e) => { setVreme(e.target.value); setSaved(false) }}
            className={inputCls}
            style={{ fontFamily: 'var(--font-sans)' }}
          />
        </div>

        {error && (
          <p className="text-[11px] text-red-500" style={{ fontFamily: 'var(--font-sans)' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="w-full px-4 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.25em] uppercase hover:bg-[#c9a96e] transition-all duration-300 disabled:opacity-50 mt-1"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Sačuvaj termin
        </button>
      </div>
    </div>
  )
}
