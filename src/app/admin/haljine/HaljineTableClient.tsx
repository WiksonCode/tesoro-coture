'use client'

import { Fragment, useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2, Star, Search, ChevronDown, ChevronRight, Plus, Check, X, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Haljina, InventarStavka } from '@/types'
import {
  deleteHaljina,
  deleteInventarStavka,
  updateInventarStavka,
  createInventarStavka,
  toggleDostupnostInventara,
} from '@/app/actions/admin'

interface Props {
  haljine: Haljina[]
}

const VELICINE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri']
const UNDO_DELAY = 5000

interface PendingDelete {
  id: string
  type: 'haljina' | 'inventar'
  label: string
  timeoutId: ReturnType<typeof setTimeout>
  createdAt: number
}

// ─── Undo Toast ────────────────────────────────────────────────────────────

function UndoToastItem({
  item,
  onUndo,
}: {
  item: PendingDelete
  onUndo: () => void
}) {
  const [progress, setProgress] = useState(100)
  const startRef = useRef(item.createdAt)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(0, 100 - (elapsed / UNDO_DELAY) * 100)
      setProgress(remaining)
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div className="relative flex items-center gap-4 bg-[#1a1a1a] text-white px-5 py-3.5 shadow-xl min-w-[320px] overflow-hidden">
      <span className="text-[12px] flex-1 leading-tight" style={{ fontFamily: 'var(--font-sans)' }}>
        <span className="text-[#8a8a8a] text-[10px] tracking-[0.2em] uppercase block mb-0.5">Obrisano</span>
        {item.label}
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="text-[#c9a96e] text-[11px] tracking-[0.25em] uppercase hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Poništi
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          className="h-full bg-[#c9a96e] transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function UndoToastStack({
  items,
  onUndo,
}: {
  items: PendingDelete[]
  onUndo: (id: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto animate-in slide-in-from-bottom-2 duration-200">
          <UndoToastItem item={item} onUndo={() => onUndo(item.id)} />
        </div>
      ))}
    </div>
  )
}

// ─── Inventar slike uploader ───────────────────────────────────────────────

function InventarSlikeEditor({ initial = [] }: { initial?: string[] }) {
  const [slike, setSlike] = useState<string[]>(initial)
  const [uploading, setUploading] = useState(false)

  async function upload(files: FileList | null) {
    if (!files) return
    setUploading(true)
    const urls: string[] = []
    for (const f of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', f)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        urls.push(url)
      }
    }
    setSlike((prev) => [...prev, ...urls])
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <input type="hidden" name="slike" value={JSON.stringify(slike)} />
      {slike.map((url, i) => (
        <div key={url} className="relative w-7 h-9 overflow-hidden group/img bg-[#f0ebe5] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="w-full h-full object-cover object-top" />
          <button
            type="button"
            onClick={() => setSlike((prev) => prev.filter((_, j) => j !== i))}
            className="absolute inset-0 bg-black/55 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
          >
            <X size={9} strokeWidth={2} className="text-white" />
          </button>
        </div>
      ))}
      <label className={cn(
        'w-7 h-9 border border-dashed border-[#e8e0d8] flex items-center justify-center cursor-pointer hover:border-[#c9a96e] transition-colors shrink-0',
        uploading && 'opacity-50 pointer-events-none'
      )}>
        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
        {uploading
          ? <Loader2 size={9} strokeWidth={2} className="animate-spin text-[#8a8a8a]" />
          : <Upload size={9} strokeWidth={2} className="text-[#8a8a8a]" />}
      </label>
      {slike.length === 0 && !uploading && (
        <span className="text-[10px] text-[#8a8a8a] italic" style={{ fontFamily: 'var(--font-sans)' }}>nema slika</span>
      )}
    </div>
  )
}

// ─── Inventory sub-components ──────────────────────────────────────────────

function InventarViewRow({
  stavka,
  pending,
  hiddenIds,
  onEdit,
  onDelete,
  onToggle,
}: {
  stavka: InventarStavka
  pending: boolean
  hiddenIds: Set<string>
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  if (hiddenIds.has(stavka.id)) return null

  return (
    <tr className={cn('group hover:bg-white/60 transition-colors', !stavka.dostupna && 'opacity-60')}>
      <td className="px-3 py-2 font-mono text-[10px] text-[#8a8a8a]">{stavka.sifra}</td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {stavka.slike?.[0]
            ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stavka.slike[0]} alt="" className="w-5 h-6 object-cover object-top shrink-0" />
            )
            : <div className="w-3.5 h-3.5 rounded-full border border-[#e8e0d8] shrink-0" style={{ backgroundColor: stavka.boja_hex }} />
          }
          <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{stavka.boja_naziv}</span>
          {stavka.slike && stavka.slike.length > 1 && (
            <span className="text-[9px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>+{stavka.slike.length - 1}</span>
          )}
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="text-[11px] text-[#1a1a1a] uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          {stavka.velicina === 'po_mjeri' ? 'Po meri' : stavka.velicina}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>
          {stavka.cijena_rsd.toLocaleString('sr-RS')} din
        </span>
      </td>
      <td className="px-3 py-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={pending}
          className={cn(
            'text-[10px] px-2 py-0.5 border transition-colors cursor-pointer',
            stavka.dostupna
              ? 'border-green-300 text-green-600 bg-green-50 hover:bg-green-100'
              : 'border-[#e8e0d8] text-[#8a8a8a] bg-white hover:bg-[#e8e0d8]'
          )}
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {stavka.dostupna ? 'Da' : 'Ne'}
        </button>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1 text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-white transition-colors cursor-pointer"
            title="Uredi"
          >
            <Pencil size={11} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="p-1 text-[#8a8a8a] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Obriši"
          >
            <Trash2 size={11} strokeWidth={1.5} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function InventarEditRow({
  stavka,
  onCancel,
  onSave,
  pending,
}: {
  stavka: InventarStavka
  onCancel: () => void
  onSave: (fd: FormData) => void
  pending: boolean
}) {
  return (
    <tr className="bg-amber-50/40">
      <td className="px-3 py-2 font-mono text-[10px] text-[#8a8a8a]">{stavka.sifra}</td>
      <td colSpan={6} className="px-3 py-2">
        <form action={(fd) => onSave(fd)}>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <input type="color" name="boja_hex" defaultValue={stavka.boja_hex} className="w-6 h-6 cursor-pointer border border-[#e8e0d8]" />
              <input
                type="text"
                name="boja_naziv"
                defaultValue={stavka.boja_naziv}
                placeholder="Naziv boje"
                className="w-24 text-[11px] px-2 py-1 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
            <select name="velicina" defaultValue={stavka.velicina} className="text-[11px] px-2 py-1 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
              {VELICINE.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <input type="number" name="cijena_rsd" defaultValue={stavka.cijena_rsd} placeholder="RSD" step="100" min="0" className="w-24 text-[11px] px-2 py-1 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }} />
            <input type="number" name="cijena_eur" defaultValue={stavka.cijena_eur} placeholder="EUR" step="1" min="0" className="w-16 text-[11px] px-2 py-1 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }} />
            <select name="dostupna" defaultValue={String(stavka.dostupna)} className="text-[11px] px-2 py-1 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
              <option value="true">Dostupna</option>
              <option value="false">Nije dostupna</option>
            </select>
            <div className="flex gap-1">
              <button type="submit" disabled={pending} className="p-1.5 text-green-600 hover:bg-green-50 border border-green-200 transition-colors cursor-pointer" title="Sačuvaj">
                <Check size={12} strokeWidth={2} />
              </button>
              <button type="button" onClick={onCancel} className="p-1.5 text-[#8a8a8a] hover:bg-[#e8e0d8] border border-[#e8e0d8] transition-colors cursor-pointer" title="Otkaži">
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="mt-2 pl-1">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Slike za ovu boju</p>
            <InventarSlikeEditor initial={stavka.slike ?? []} />
          </div>
        </form>
      </td>
    </tr>
  )
}

function InventarAddForm({
  onCancel,
  onSave,
  pending,
}: {
  onCancel: () => void
  onSave: (fd: FormData) => void
  pending: boolean
}) {
  return (
    <div className="border border-dashed border-[#c9a96e]/50 bg-white/70 p-4 mt-2 mx-4 mb-4">
      <p className="text-[9px] tracking-[0.35em] uppercase text-[#c9a96e] mb-3" style={{ fontFamily: 'var(--font-sans)' }}>
        Nova stavka inventara
      </p>
      <form action={(fd) => onSave(fd)}>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <input type="color" name="boja_hex" defaultValue="#c9a96e" className="w-6 h-6 cursor-pointer border border-[#e8e0d8]" />
            <input type="text" name="boja_naziv" placeholder="Naziv boje *" required className="w-28 text-[11px] px-2 py-1.5 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }} />
          </div>
          <select name="velicina" required className="text-[11px] px-2 py-1.5 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }}>
            {VELICINE.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <input type="number" name="cijena_rsd" placeholder="RSD *" required step="100" min="0" className="w-24 text-[11px] px-2 py-1.5 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }} />
          <input type="number" name="cijena_eur" placeholder="EUR *" required step="1" min="0" className="w-16 text-[11px] px-2 py-1.5 border border-[#e8e0d8] bg-white outline-none focus:border-[#c9a96e]" style={{ fontFamily: 'var(--font-sans)' }} />
          <div className="flex gap-2 mt-1">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-200 disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Plus size={11} strokeWidth={1.5} />
              Dodaj
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 border border-[#e8e0d8] text-[#8a8a8a] text-[10px] tracking-[0.2em] uppercase hover:bg-[#e8e0d8] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Otkaži
            </button>
          </div>
          <div className="mt-3">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#8a8a8a] mb-1.5" style={{ fontFamily: 'var(--font-sans)' }}>Slike za ovu boju (opciono)</p>
            <InventarSlikeEditor />
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function HaljineTableClient({ haljine }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingInventarId, setEditingInventarId] = useState<string | null>(null)
  const [addingToHaljinaId, setAddingToHaljinaId] = useState<string | null>(null)
  const [pendingDeletes, setPendingDeletes] = useState<Map<string, PendingDelete>>(new Map())
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [invPending, startInvTransition] = useTransition()

  // Kada dođe novi prop sa servera, ukloni ids koji više ne postoje u listi
  useEffect(() => {
    const existing = new Set([
      ...haljine.map((h) => h.id),
      ...haljine.flatMap((h) => (h.inventar ?? []).map((s) => s.id)),
    ])
    setDeletedIds((prev) => {
      const cleaned = new Set([...prev].filter((id) => existing.has(id)))
      return cleaned.size === prev.size ? prev : cleaned
    })
  }, [haljine])

  const hiddenIds = new Set([...pendingDeletes.keys(), ...deletedIds])

  const filtered = haljine.filter(
    (h) =>
      !hiddenIds.has(h.id) &&
      (h.naziv_sr.toLowerCase().includes(search.toLowerCase()) ||
        h.slug.toLowerCase().includes(search.toLowerCase()))
  )

  function scheduleDelete(id: string, type: 'haljina' | 'inventar', label: string) {
    const timeoutId = setTimeout(async () => {
      if (type === 'haljina') {
        await deleteHaljina(id)
      } else {
        await deleteInventarStavka(id)
      }
      // Drži id skriven dok router.refresh() ne dovuče novi prop
      setDeletedIds((prev) => new Set([...prev, id]))
      setPendingDeletes((prev) => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
      router.refresh()
    }, UNDO_DELAY)

    setPendingDeletes((prev) => {
      const next = new Map(prev)
      next.set(id, { id, type, label, timeoutId, createdAt: Date.now() })
      return next
    })
  }

  function cancelDelete(id: string) {
    setPendingDeletes((prev) => {
      const item = prev.get(id)
      if (item) clearTimeout(item.timeoutId)
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }

  function handleToggle(id: string, current: boolean) {
    startInvTransition(async () => {
      await toggleDostupnostInventara(id, !current)
    })
  }

  function handleUpdateInventar(id: string, fd: FormData) {
    startInvTransition(async () => {
      await updateInventarStavka(id, fd)
      setEditingInventarId(null)
    })
  }

  function handleCreateInventar(haljinaId: string, fd: FormData) {
    startInvTransition(async () => {
      await createInventarStavka(haljinaId, fd)
      setAddingToHaljinaId(null)
    })
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null)
      setEditingInventarId(null)
      setAddingToHaljinaId(null)
    } else {
      setExpandedId(id)
      setEditingInventarId(null)
      setAddingToHaljinaId(null)
    }
  }

  const toastItems = Array.from(pendingDeletes.values())

  return (
    <>
      <div className="bg-white border border-[#e8e0d8]">
        {/* Search */}
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
          <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
            {filtered.length} / {haljine.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e0d8]">
                <th className="w-8 px-4 py-3" />
                {['Haljina', 'Kategorija', 'Inventar', 'Akcije'].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[12px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                    Nema rezultata
                  </td>
                </tr>
              )}
              {filtered.map((h) => {
                const ukupno = h.inventar?.length ?? 0
                const dostupno = h.inventar?.filter((i) => i.dostupna && !hiddenIds.has(i.id)).length ?? 0
                const isExpanded = expandedId === h.id

                return (
                  <Fragment key={h.id}>
                    {/* Dress row */}
                    <tr
                      className={cn(
                        'group transition-colors border-b border-[#e8e0d8]',
                        isExpanded ? 'bg-[#faf7f4]' : 'hover:bg-[#faf7f4]',
                      )}
                    >
                      <td className="pl-4 pr-0 py-3">
                        <button
                          type="button"
                          onClick={() => toggleExpand(h.id)}
                          className="p-1 text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                          title={isExpanded ? 'Zatvori' : 'Prikaži inventar'}
                        >
                          {isExpanded
                            ? <ChevronDown size={13} strokeWidth={1.5} />
                            : <ChevronRight size={13} strokeWidth={1.5} />}
                        </button>
                      </td>

                      <td className="px-4 py-3">
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
                            <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>{h.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                          {h.kategorija?.naziv_sr ?? '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cn('text-[11px]', dostupno > 0 ? 'text-green-600' : 'text-[#8a8a8a]')}
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {dostupno}/{ukupno} dostupno
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/haljine/${h.id}`}
                            className="p-1.5 text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#e8e0d8] transition-colors"
                            title="Uredi haljinu"
                          >
                            <Pencil size={13} strokeWidth={1.5} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => scheduleDelete(h.id, 'haljina', h.naziv_sr)}
                            className="p-1.5 text-[#8a8a8a] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Obriši haljinu"
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded inventory section */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 border-b border-[#e8e0d8]">
                          <div className="bg-[#f5f2ee]">
                            <div className="px-8 pt-4 pb-2 flex items-center justify-between">
                              <p className="text-[10px] tracking-[0.35em] uppercase text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
                                Stavke inventara
                              </p>
                              <button
                                type="button"
                                onClick={() => setAddingToHaljinaId(addingToHaljinaId === h.id ? null : h.id)}
                                className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                                style={{ fontFamily: 'var(--font-sans)' }}
                              >
                                <Plus size={11} strokeWidth={1.5} />
                                Dodaj stavku
                              </button>
                            </div>

                            {ukupno === 0 && addingToHaljinaId !== h.id && (
                              <p className="px-8 py-4 text-[11px] text-[#8a8a8a] italic" style={{ fontFamily: 'var(--font-sans)' }}>
                                Nema stavki u inventaru.
                              </p>
                            )}

                            {ukupno > 0 && (
                              <div className="px-4 pb-2">
                                <table className="w-full">
                                  <thead>
                                    <tr>
                                      {['Šifra', 'Boja', 'Veličina', 'Cena', 'Dostupna', 'Akcije'].map((col) => (
                                        <th
                                          key={col}
                                          className="text-left px-3 py-2 text-[9px] tracking-[0.3em] uppercase text-[#8a8a8a] font-normal"
                                          style={{ fontFamily: 'var(--font-sans)' }}
                                        >
                                          {col}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#e8e0d8]/60">
                                    {h.inventar!.map((stavka) =>
                                      editingInventarId === stavka.id ? (
                                        <InventarEditRow
                                          key={stavka.id}
                                          stavka={stavka}
                                          onCancel={() => setEditingInventarId(null)}
                                          onSave={(fd) => handleUpdateInventar(stavka.id, fd)}
                                          pending={invPending}
                                        />
                                      ) : (
                                        <InventarViewRow
                                          key={stavka.id}
                                          stavka={stavka}
                                          pending={invPending}
                                          hiddenIds={hiddenIds}
                                          onEdit={() => setEditingInventarId(stavka.id)}
                                          onDelete={() => scheduleDelete(stavka.id, 'inventar', `${stavka.boja_naziv} / ${stavka.velicina}`)}
                                          onToggle={() => handleToggle(stavka.id, stavka.dostupna)}
                                        />
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {addingToHaljinaId === h.id && (
                              <InventarAddForm
                                onCancel={() => setAddingToHaljinaId(null)}
                                onSave={(fd) => handleCreateInventar(h.id, fd)}
                                pending={invPending}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UndoToastStack items={toastItems} onUndo={cancelDelete} />
    </>
  )
}
