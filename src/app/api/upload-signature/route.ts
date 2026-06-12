import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profil } = await supabase.from('profiles').select('uloga').eq('id', user.id).single()
  if (profil?.uloga !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = {
    folder: 'tesoro-couture',
    timestamp,
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    signature,
    timestamp,
    folder: paramsToSign.folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  })
}
