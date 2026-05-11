import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCijenaRSD(cijena: number): string {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cijena)
}

export function formatCijenaEUR(cijenaRSD: number): string {
  const kurs = Number(process.env.NEXT_PUBLIC_KURS_EUR || 117)
  const eur = cijenaRSD / kurs
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(eur)
}

export function cijenaSaPopustom(cijena: number, popust: number): number {
  return cijena * (1 - popust / 100)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[čć]/g, 'c')
    .replace(/[žš]/g, (c) => (c === 'ž' ? 'z' : 's'))
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

