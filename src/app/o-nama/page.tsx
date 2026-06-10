import type { Metadata } from 'next'
import ONamaContent from '@/components/home/ONamaContent'

export const metadata: Metadata = {
  title: 'O nama',
  description: 'Saznajte više o TESORO Couture salonu u Beogradu — naša priča, tim i filozofija lepote.',
}

export default function ONamaPage() {
  return <ONamaContent />
}
