import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KorpaArtikl } from '@/types'

interface KorpaState {
  artikli: KorpaArtikl[]
  dodajArtikl: (artikl: KorpaArtikl) => void
  ukloniArtikl: (inventar_id: string) => void
  ocistiKorpu: () => void
}

export const useKorpa = create<KorpaState>()(
  persist(
    (set) => ({
      artikli: [],

      dodajArtikl: (artikl) =>
        set((state) => {
          const exists = state.artikli.some((a) => a.inventar_id === artikl.inventar_id)
          if (exists) return state
          return { artikli: [...state.artikli, artikl] }
        }),

      ukloniArtikl: (inventar_id) =>
        set((state) => ({
          artikli: state.artikli.filter((a) => a.inventar_id !== inventar_id),
        })),

      ocistiKorpu: () => set({ artikli: [] }),
    }),
    {
      name: 'tesoro-korpa',
    }
  )
)
