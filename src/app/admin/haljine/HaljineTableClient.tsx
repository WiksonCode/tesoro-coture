'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Eye, EyeOff, Star, Search } from 'lucide-react'
import { cn, formatCijenaRSD } from '@/lib/utils'
import type { Haljina } from '@/types'
import { deleteHaljina, toggleDostupnost } from '@/app/actions/admin'

interface Props {
  haljine: Haljina[]
  kategorijaLabels: Record<string, string>
}

export default function HaljineTableClient({ haljine, kategorijaLabels }: Props) {
  const [search, setSearch] = useState('')
  const [pending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = haljine.filter(
    (h) =>
      h.naziv_sr.toLowerCase().includes(search.toLowerCase()) ||
      h.slug.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id: string) {
    if (confirmDelete !== id) {
      setConfirmDelete(id)
      return
    }
    setDeletingId(id)
    setConfirmDelete(null)
    startTransition(async () => {
      await deleteHaljina(id)
      setDeletingId(null)
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      await toggleDostupnost(id, !current)
    })
  }

  return (
    <div className="bg-white border border-[#e8e0d8]">
      {/* Search bar */}
      <div className="px-6 py-4 border-b border-[#e8e0d8] flex items-center gap-3">
        <Search size={14} strokeWidth={1.5} className="text-[#8a8a8a] shrink-0" />
        <input
          type="text"
          placeholder="Pretraži haljine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-[12px] text-[#1a1a1a] placeholder-[#8a8a8a]/50 outline-none bg-transparent"
          style={{ fontFamily: 'var(--font-sans)' }}
        />
        <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
          {filtered.length} / {haljine.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e0d8]">
              {['Haljina', 'Kategorija', 'Cijena', 'Status', 'Akcije'].map((col) => (
                <th
                  key={col}
                  className="text-left px-6 py-3 text-[8px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e0d8]">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Nema rezultata
                </td>
              </tr>
            )}
            {filtered.map((h) => (
              <tr
                key={h.id}
                className={cn(
                  'group hover:bg-[#faf7f4] transition-colors',
                  deletingId === h.id && 'opacity-40 pointer-events-none'
                )}
              >
                {/* Dress info */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 shrink-0 bg-[#f0ebe5] overflow-hidden">
                      {h.slike?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={h.slike[0]} alt={h.naziv_sr} className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[16px] text-[#1a1a1a]/10 italic" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] text-[#1a1a1a] truncate max-w-[180px]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {h.naziv_sr}
                        </p>
                        {h.featured && <Star size={10} strokeWidth={1.5} className="text-[#c9a96e] shrink-0" />}
                      </div>
                      <p className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                        {h.slug}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Kategorija */}
                <td className="px-6 py-3">
                  <span className="text-[10px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    {kategorijaLabels[h.kategorija] ?? h.kategorija}
                  </span>
                </td>

                {/* Cijena */}
                <td className="px-6 py-3">
                  <div>
                    <p className="text-[12px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
                      {formatCijenaRSD(h.cijena_rsd)}
                    </p>
                    {h.na_popustu && h.popust_procenat > 0 && (
                      <span className="text-[9px] text-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
                        -{h.popust_procenat}% popust
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(h.id, h.dostupna)}
                    disabled={pending}
                    className={cn(
                      'flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase cursor-pointer transition-colors',
                      h.dostupna ? 'text-green-600' : 'text-[#8a8a8a]'
                    )}
                    style={{ fontFamily: 'var(--font-sans)' }}
                    title={h.dostupna ? 'Klikni da deaktiviraj' : 'Klikni da aktiviraj'}
                  >
                    {h.dostupna
                      ? <Eye size={12} strokeWidth={1.5} />
                      : <EyeOff size={12} strokeWidth={1.5} />
                    }
                    {h.dostupna ? 'Dostupna' : 'Nedostupna'}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/haljine/${h.id}`}
                      className="p-1.5 text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#e8e0d8] transition-colors"
                      title="Uredi"
                    >
                      <Pencil size={13} strokeWidth={1.5} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(h.id)}
                      className={cn(
                        'p-1.5 transition-colors cursor-pointer',
                        confirmDelete === h.id
                          ? 'text-red-500 bg-red-50'
                          : 'text-[#8a8a8a] hover:text-red-500 hover:bg-red-50'
                      )}
                      title={confirmDelete === h.id ? 'Klikni ponovo za potvrdu' : 'Obriši'}
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
