import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin – TESORO' },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?callbackUrl=/admin')
  }

  const { data: profil } = await supabase
    .from('profiles')
    .select('uloga, ime, prezime')
    .eq('id', user.id)
    .single()

  if (profil?.uloga !== 'admin') {
    redirect('/')
  }

  const displayName = profil.ime
    ? `${profil.ime} ${profil.prezime}`
    : user.email!

  return (
    <div className="h-screen flex overflow-hidden">
      <AdminSidebar displayName={displayName} email={user.email!} />
      <div className="flex-1 min-w-0 bg-[#f5f3f0] lg:ml-0 pt-14 lg:pt-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
