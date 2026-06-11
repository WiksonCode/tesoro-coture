'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, Loader2, ArrowLeft, Video, Star } from 'lucide-react'
import { cn, slugify } from '@/lib/utils'
import { createHaljina, updateHaljina } from '@/app/actions/admin'
import type { Haljina, Kategorija } from '@/types'

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
  kategorije: Kategorija[]
}

export default function HaljinaForma({ haljina, kategorije }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [naziv_sr, setNazivSr] = useState(haljina?.naziv_sr ?? '')
  const [naziv_en, setNazivEn] = useState(haljina?.naziv_en ?? '')
  const [slug, setSlug] = useState(haljina?.slug ?? '')
  const [slugManual, setSlugManual] = useState(!!haljina)
  const [opis_sr, setOpisSr] = useState(haljina?.opis_sr ?? '')
  const [opis_en, setOpisEn] = useState(haljina?.opis_en ?? '')
  const [kategorija_id, setKategorijaId] = useState(haljina?.kategorija_id ?? kategorije[0]?.id ?? '')
  const [featured, setFeatured] = useState(haljina?.featured ?? false)
  const [videoUrl, setVideoUrl] = useState(haljina?.video_url ?? '')

  const [slike, setSlike] = useState<string[]>(haljina?.slike ?? [])
  const [uploading, setUploading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugManual && naziv_sr) {
      setSlug(slugify(naziv_sr))
    }
  }, [naziv_sr, slugManual])

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    const oversized = Array.from(files).find((f) => f.size > 10 * 1024 * 1024)
    if (oversized) {
      setServerError(`Slika "${oversized.name}" je prevelika. Maksimalna veličina je 10MB.`)
      return
    }
    setUploading(true)
    setServerError(null)
    const newUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) {
          setServerError(`Upload greška: ${json.error ?? res.statusText}`)
          setUploading(false)
          return
        }
        newUrls.push(json.url)
      }
      setSlike((prev) => [...prev, ...newUrls])
    } catch (err) {
      setServerError(`Upload greška: ${err instanceof Error ? err.message : 'Nepoznata greška'}`)
    } finally {
      setUploading(false)
    }
  }

  function removeSlika(url: string) {
    setSlike((prev) => prev.filter((s) => s !== url))
  }

  function setGlavnaSlika(url: string) {
    setSlike((prev) => [url, ...prev.filter((s) => s !== url)])
  }

  async function handleVideoUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    if (files[0].size > 100 * 1024 * 1024) {
      setServerError(`Video je prevelik. Maksimalna veličina je 100MB.`)
      return
    }
    setUploadingVideo(true)
    setServerError(null)
    try {
      const fd = new FormData()
      fd.append('file', files[0])
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) {
        setServerError(`Upload greška: ${json.error ?? res.statusText}`)
        return
      }
      setVideoUrl(json.url)
    } catch (err) {
      setServerError(`Upload greška: ${err instanceof Error ? err.message : 'Nepoznata greška'}`)
    } finally {
      setUploadingVideo(false)
    }
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
    formData.set('kategorija_id', kategorija_id)
    formData.set('featured', featured.toString())
    formData.set('video_url', videoUrl)
    formData.set('slike', JSON.stringify(slike))

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
              value={kategorija_id}
              onChange={(e) => setKategorijaId(e.target.value)}
              className={cn(inputCls, 'cursor-pointer')}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {kategorije.map((k) => (
                <option key={k.id} value={k.id}>{k.naziv_sr}</option>
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
        <div className="mt-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-[#c9a96e]" />
            <span className="text-[11px] text-[#1a1a1a]" style={{ fontFamily: 'var(--font-sans)' }}>Featured (prikazati na početnoj strani)</span>
          </label>
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
              <button
                type="button"
                onClick={() => setGlavnaSlika(url)}
                title={i === 0 ? 'Naslovna fotografija' : 'Postavi kao naslovnu'}
                className={cn(
                  'absolute top-1 left-1 w-5 h-5 flex items-center justify-center transition-opacity',
                  i === 0
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                )}
              >
                <Star
                  size={14}
                  className={i === 0 ? 'fill-[#c9a96e] text-[#c9a96e]' : 'fill-white/60 text-white drop-shadow'}
                />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[7px] tracking-[0.2em] uppercase bg-[#1a1a1a] text-white px-1.5 py-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                  Naslovna
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
        <div>
          <label className={labelCls} style={{ fontFamily: 'var(--font-sans)' }}>Video (opciono)</label>
          {videoUrl ? (
            <div className="relative bg-black">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={videoUrl}
                controls
                muted
                playsInline
                className="w-full max-h-52 object-contain"
              />
              <button
                type="button"
                onClick={() => setVideoUrl('')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Ukloni video"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <label className={cn(
                'flex items-center gap-2 px-4 py-2.5 border border-dashed border-[#e8e0d8] text-[11px] text-[#8a8a8a] cursor-pointer hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors shrink-0',
                uploadingVideo && 'opacity-50 pointer-events-none'
              )} style={{ fontFamily: 'var(--font-sans)' }}>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoUpload(e.target.files)}
                />
                {uploadingVideo
                  ? <Loader2 size={13} strokeWidth={1.5} className="animate-spin" />
                  : <Video size={13} strokeWidth={1.5} />}
                {uploadingVideo ? 'Upload...' : 'Upload video'}
              </label>
              <span className="text-[11px] text-[#8a8a8a] shrink-0" style={{ fontFamily: 'var(--font-sans)' }}>ili</span>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className={cn(inputCls, 'flex-1')}
                style={{ fontFamily: 'var(--font-sans)' }}
                placeholder="https://... (URL videa)"
              />
            </div>
          )}
        </div>
      </div>

      {/* Note about inventar */}
      <div className="bg-[#faf7f4] border border-[#e8e0d8] px-5 py-4">
        <p className="text-[10px] text-[#8a8a8a] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
          Boje, veličine, cene i dostupnost se upravljaju po stavkama inventara — dodajte ih nakon što sačuvate haljinu.
        </p>
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
          disabled={isPending || uploading || uploadingVideo}
          className="flex items-center gap-2.5 bg-[#1a1a1a] text-white px-8 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-[#c9a96e] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {haljina ? 'Sačuvaj izmene' : 'Dodaj haljinu'}
        </button>
      </div>
    </form>
  )
}
