'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Loader2, Check } from 'lucide-react'
import { updateRedoslijed } from '@/app/actions/admin'
import type { Haljina } from '@/types'

function SortableKartica({ haljina, index }: { haljina: Haljina; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: haljina.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative bg-white border border-[#e8e0d8] overflow-hidden select-none">
      <div className="relative aspect-[3/4] bg-[#f0ebe5]">
        {haljina.slike?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={haljina.slike[0]} alt={haljina.naziv_sr} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-light italic text-[#1a1a1a]/10" style={{ fontFamily: 'var(--font-serif)' }}>T</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-[#1a1a1a] text-white text-[10px] w-5 h-5 flex items-center justify-center font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
          {index + 1}
        </div>
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
          title="Vuci da promijeniš redoslijed"
        >
          <GripVertical size={14} className="text-[#8a8a8a]" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-[11px] text-[#1a1a1a] leading-tight truncate" style={{ fontFamily: 'var(--font-serif)' }}>
          {haljina.naziv_sr}
        </p>
      </div>
    </div>
  )
}

function DragOverlayKartica({ haljina }: { haljina: Haljina }) {
  return (
    <div className="bg-white border-2 border-[#c9a96e] overflow-hidden shadow-2xl rotate-2 opacity-95">
      <div className="relative aspect-[3/4] bg-[#f0ebe5]">
        {haljina.slike?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={haljina.slike[0]} alt={haljina.naziv_sr} className="w-full h-full object-cover object-top" />
        ) : null}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] text-[#1a1a1a] leading-tight truncate" style={{ fontFamily: 'var(--font-serif)' }}>
          {haljina.naziv_sr}
        </p>
      </div>
    </div>
  )
}

interface RasporedClientProps {
  haljine: Haljina[]
  saveAction?: (ids: string[]) => Promise<unknown>
  helpText?: string
}

export default function RasporedClient({
  haljine: initial,
  saveAction = updateRedoslijed,
  helpText = 'Vuci haljine da promijeniš redoslijed u katalogu. Broj u uglu pokazuje poziciju.',
}: RasporedClientProps) {
  const [haljine, setHaljine] = useState(initial)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
    setSaved(false)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    setHaljine((prev) => {
      const oldIdx = prev.findIndex((h) => h.id === active.id)
      const newIdx = prev.findIndex((h) => h.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  function handleSave() {
    startTransition(async () => {
      await saveAction(haljine.map((h) => h.id))
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  const activeHaljina = activeId ? haljine.find((h) => h.id === activeId) ?? null : null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] text-[#8a8a8a]" style={{ fontFamily: 'var(--font-sans)' }}>
          {helpText}
        </p>
        <button
          onClick={handleSave}
          disabled={isPending || saved}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 text-[9px] tracking-[0.3em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {isPending && <Loader2 size={11} className="animate-spin" />}
          {saved && <Check size={11} />}
          {saved ? 'Sačuvano' : 'Sačuvaj redoslijed'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={haljine.map((h) => h.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {haljine.map((h, i) => (
              <SortableKartica key={h.id} haljina={h} index={i} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeHaljina && <DragOverlayKartica haljina={activeHaljina} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
