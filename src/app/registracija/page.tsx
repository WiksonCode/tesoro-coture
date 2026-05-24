import type { Metadata } from 'next'
import RegistracijaClient from './RegistracijaClient'

export const metadata: Metadata = {
  title: 'Registracija',
  description: 'Kreirajte vaš TESORO Couture nalog.',
}

export default function RegistracijaPage() {
  return <RegistracijaClient />
}
