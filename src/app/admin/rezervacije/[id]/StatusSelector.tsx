'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateStatusRezervacije } from '@/app/actions/admin'
import type { StatusRezervacije } from '@/types'

const STATUSI: { value: StatusRezervacije; label: string; style: string }[] = [
  { value: 'na_cekanju', label: 'Na čekanju', style: 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#8a6630]' },
  { value: 'potvrdjena', label: 'Potvrđena', style: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'realizovana', label: 'Realizovana', style: 'border-[#1a1a1a] bg-[#1a1a1a]/5 text-[#1a1a1a]' },
  { value: 'otkazana', label: 'Otkazana', style: 'border-red-400 bg-red-50 text-red-600' },
]

export default function StatusSelector({ id, currentStatus }: { id: string; currentStatus: StatusRezervacije }) {
  const [status, setStatus] = useState<StatusRezervacije>(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleChange(newStatus: StatusRezervacije) {
    setStatus(newStatus)
    setSaved(false)
    startTransition(async () => {
      await updateStatusRezervacije(id, newStatus)
      setSaved(true)
    })
  }

  return (
    <div className="bg-white border border-[#e8e0d8] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
          Promjeni status
        </h2>
        {isPending && <Loader2 size={12} className="animate-spin text-[#8a8a8a]" />}
        {!isPending && saved && (
          <span className="text-[9px] text-green-600" style={{ fontFamily: 'var(--font-sans)' }}>Sačuvano</span>
        )}
      </div>
      <div className="space-y-2">
        {STATUSI.map(({ value, label, style }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleChange(value)}
            disabled={isPending}
            className={cn(
              'w-full px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border-2 transition-all duration-200 text-left cursor-pointer',
              status === value
                ? style
                : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a]/30 bg-white'
            )}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
