'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Upload, Loader2, ArrowLeft } from 'lucide-react'
import { cn, slugify } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { createHaljina, updateHaljina } from '@/app/actions/admin'
import type { Haljina, Boja } from '@/types'

const VELICINE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Po mjeri']
const KATEGORIJE = [
  { value: 'vjencana', label: 'Vjenčana' },
  { value: 'koktel', label: 'Koktel' },
  { value: 'svecana', label: 'Svečana' },
  { value: 'casual', label: 'Casual' },
  { value: 'maturska', label: 'Maturska' },
]

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

interface Props {
  haljina?: Haljina
}

export default function HaljinaForma({ haljina }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [naziv_sr, setNazivSr] = useState(haljina?.naziv_sr ?? '')
  const [naziv_en, setNazivEn] = useState(haljina?.naziv_en ?? '')
  const [slug, setSlug] = useState(haljina?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!haljina)
  const [opis_sr, setOpisSr] = useState(haljina?.opis_sr ?? '')
  const [opis_en, setOpisEn] = useState(haljina?.opis_en ?? '')
  const [cijena, setCijena] = useState(haljina?.cijena_rsd?.toString() ?? '')
  const [kategorija, setKategorija] = useState<string>(haljina?.kategorija ?? 'koktel')
  const [naPopustu, setNaPopustu] = useState(haljina?.na_popustu ?? false)
  const [popust, setPopust] = useState(haljina?.popust_procenat?.toString() ?? '0')
  const [dostupna, setDostupna] = useState(haljina?.dostupna ?? true)
  const [kolicina, setKolicina] = useState(haljina?.kolicina_na_lageru?.toString() ?? '0')
  const [featured, setFeatured] = useState(haljina?.featured ?? false)
  const [videoUrl, setVideoUrl] = useState(haljina?.video_url ?? '')

  const [velicine, setVelicine] = useState<string[]>(haljina?.dostupne_velicine ?? [])
  const [boje, setBoje] = useState<Boja[]>(haljina?.dostupne_boje ?? [])
  const [novaBoja, setNovaBoja] = useState({ naziv: '', hex: '#c9a96e' })

  const [slike, setSlike] = useState<string[]>(haljina?.slike ?? [])
  const [uploading, setUploading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugManual && naziv_sr) {
      setSlug(slugify(naziv_sr))
    }
  }, [naziv_sr, slugManual])

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('haljine-slike').upload(path, file)
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('haljine-slike').getPublicUrl(data.path)
        newUrls.push(publicUrl)
      }
    }

    setSlike((prev) => [...prev, ...newUrls])
    setUploading(false)
  }

  function toggleVelicina(v: string) {
    setVelicine((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])
  }

  function addBoja() {
    if (!novaBoja.naziv.trim()) return
    setBoje((prev) => [...prev, { naziv: novaBoja.naziv.trim(), hex: novaBoja.hex }])
    setNovaBoja({ naziv: '', hex: '#c9a96e' })
  }

  function removeBoja(index: number) {
    setBoje((prev) => prev.filter((_, i) => i !== index))
  }

  function removeSlika(url: string) {
    setSlike((prev) => prev.filter((s) => s !== url))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    const formData = new FormData()
    formData.set('slug', slug)
    formData.set('naziv_sr', naziv_sr)
    formData.set('naziv_en', naziv_en)
    formData.set('opis_sr', opis_sr)
    formData.set('opis_en', opis_en)
    formData.set('cijena_rsd', cijena)
    formData.set('kategorija', kategorija)
    formData.set('na_popustu', naPopustu.toString())
    formData.set('popust_procenat', popust)
    formData.set('dostupna', dostupna.toString())
    formData.set('kolicina_na_lageru', kolicina)
    formData.set('featured', featured.toString())
    formData.set('video_url', videoUrl)
    formData.set('slike', JSON.stringify(slike))
    formData.set('dostupne_boje', JSON.stringify(boje))
    formData.set('dostupne_velicine', JSON.stringify(velicine))

    startTransition(async () => {
      const result = haljina
        ? await updateHaljina(haljina.id, formData)
        : await createHaljina(formData)
      if (result?.error) setServerError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {serverError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[12px] text-red-600" style={{ fontFamily: 'var(--font-sans)' }}>{serverError}</p>
        </div>
      )}

      {/* Section: Osnovne informacije */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Osnovno
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <Field label="Naziv (srpski) *">
            <input
              type="text"
              required
              value={naziv_sr}
              onChange={(e) => setNazivSr(e.target.value)}
              className={inputCls}
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="npr. Elegantna večernja haljina"
            />
          </Field>
          <Field label="Naziv (engleski)">
            <input
              type="text"
              value={naziv_en}
              onChange={(e) => setNazivEn(e.target.value)}
              className={inputCls}
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="e.g. Elegant Evening Dress"
            />
          </Field>
          <Field label="Slug (URL)">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
                className={cn(inputCls, 'flex-1 font-mono text-[11px]')}
              />
              <button
                type="button"
                onClick={() => { setSlug(slugify(naziv_sr)); setSlugManual(false) }}
                className="px-3 text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] border border-[#e8e0d8] hover:border-[#1a1a1a] transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Auto
              </button>
            </div>
          </Field>
          <Field label="Kategorija *">
            <select
              required
              value={kategorija}
              onChange={(e) => setKategorija(e.target.value)}
              className={cn(inputCls, 'cursor-pointer')}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {KATEGORIJE.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Opis (srpski)">
            <textarea
              value={opis_sr}
              onChange={(e) => setOpisSr(e.target.value)}
              rows={3}
              className={cn(inputCls, 'resize-none')}
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Opis haljine na srpskom..."
            />
          </Field>
          <Field label="Opis (engleski)">
            <textarea
              value={opis_en}
              onChange={(e) => setOpisEn(e.target.value)}
              rows={3}
              className={cn(inputCls, 'resize-none')}
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Dress description in English..."
            />
          </Field>
        </div>
      </div>

      {/* Section: Cijena */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Cijena i dostupnost
        </h2>
        <div className="grid lg:grid-cols-3 gap-4">
          <Field label="Cijena (RSD) *">
            <input
              type="number"
              required
              min={0}
              step={100}
              value={cijena}
              onChange={(e) => setCijena(e.target.value)}
              className={inputCls}
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="15000"
            />
          </Field>
          <Field label="Količina na lageru">
            <input
              type="number"
              min={0}
              value={kolicina}
              onChange={(e) => setKolicina(e.target.value)}
              className={inputCls}
              style={{ fontFamily: 'var(--font-sans)' }}
            />
          </Field>
          <div className="flex flex-col gap-3 pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={dostupna} onChange={(e) => setDostupna(e.target.checked)} className="w-4 h-4 accent-[#1a1a1a]" />
              <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>Dostupna u katalogu</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-[#c9a96e]" />
              <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>Featured (homepage)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={naPopustu} onChange={(e) => setNaPopustu(e.target.checked)} className="w-4 h-4 accent-red-500" />
              <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>Na popustu</span>
            </label>
          </div>
          {naPopustu && (
            <Field label="Procenat popusta (%)">
              <input
                type="number"
                min={1}
                max={100}
                value={popust}
                onChange={(e) => setPopust(e.target.value)}
                className={inputCls}
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </Field>
          )}
        </div>
      </div>

      {/* Section: Slike */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Slike
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
          {slike.map((url, i) => (
            <div key={url} className="relative aspect-[3/4] bg-[#f0ebe5] overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Slika ${i + 1}`} className="w-full h-full object-cover object-top" />
              <button
                type="button"
                onClick={() => removeSlika(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[7px] tracking-[0.2em] uppercase bg-[#1a1a1a] text-white px-1.5 py-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  Glavna
                </span>
              )}
            </div>
          ))}
          <label className={cn(
            'aspect-[3/4] border-2 border-dashed border-[#e8e0d8] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#c9a96e] transition-colors',
            uploading && 'pointer-events-none opacity-50'
          )}>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            {uploading
              ? <Loader2 size={18} strokeWidth={1.5} className="text-[#8a8a8a] animate-spin" />
              : <Upload size={18} strokeWidth={1.5} className="text-[#8a8a8a]" />
            }
            <span className="text-[8px] text-[#8a8a8a] text-center" style={{ fontFamily: 'var(--font-sans)' }}>
              {uploading ? 'Upload...' : 'Dodaj sliku'}
            </span>
          </label>
        </div>
        <Field label="Video URL (opciono)">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputCls}
            style={{ fontFamily: 'var(--font-sans)' }}
            placeholder="https://..."
          />
        </Field>
      </div>

      {/* Section: Veličine */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Veličine
        </h2>
        <div className="flex flex-wrap gap-2">
          {VELICINE.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => toggleVelicina(v)}
              className={cn(
                'px-4 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all duration-200 cursor-pointer',
                velicine.includes(v)
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'border-[#e8e0d8] text-[#8a8a8a] hover:border-[#1a1a1a]'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Section: Boje */}
      <div className="bg-white border border-[#e8e0d8] p-6">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-[#8a8a8a] mb-5" style={{ fontFamily: 'var(--font-sans)' }}>
          Boje
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {boje.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 border border-[#e8e0d8] px-3 py-1.5 group"
            >
              <span
                className="w-4 h-4 rounded-full border border-[#e8e0d8] shrink-0"
                style={{ backgroundColor: b.hex }}
              />
              <span className="text-[10px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>{b.naziv}</span>
              <button
                type="button"
                onClick={() => removeBoja(i)}
                className="text-[#8a8a8a] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={novaBoja.hex}
            onChange={(e) => setNovaBoja((p) => ({ ...p, hex: e.target.value }))}
            className="w-9 h-9 border border-[#e8e0d8] cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={novaBoja.naziv}
            onChange={(e) => setNovaBoja((p) => ({ ...p, naziv: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBoja())}
            className={cn(inputCls, 'flex-1')}
            style={{ fontFamily: 'var(--font-sans)' }}
            placeholder="Naziv boje (npr. Roze)"
          />
          <button
            type="button"
            onClick={addBoja}
            disabled={!novaBoja.naziv.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a1a1a] text-white text-[9px] tracking-[0.2em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-200 disabled:opacity-40 cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Plus size={11} />
            Dodaj
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          <ArrowLeft size={12} />
          Nazad
        </button>
        <button
          type="submit"
          disabled={isPending || uploading}
          className="flex items-center gap-2.5 bg-[#1a1a1a] text-white px-8 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {haljina ? 'Sačuvaj izmjene' : 'Dodaj haljinu'}
        </button>
      </div>
    </form>
  )
}
