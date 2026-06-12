import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', user.id).single()
  if (profil?.uloga !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Nema fajla' }, { status: 400 })

  const isVideo = file.type.startsWith('video/')
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      isVideo
        ? {
            folder: 'tesoro-couture',
            resource_type: 'video',
            quality: 'auto:good',
          }
        : {
            folder: 'tesoro-couture',
            resource_type: 'image',
            quality: 'auto:good',
            fetch_format: 'auto',
            flags: 'progressive',
          },
      (err, res) => err ? reject(err) : resolve(res as { secure_url: string })
    ).end(buffer)
  })

  return NextResponse.json({ url: result.secure_url })
}
