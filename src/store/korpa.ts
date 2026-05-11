import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KorpaArtikl } from '@/types'

interface KorpaState {
  artikli: KorpaArtikl[]
  dodajArtikl: (artikl: KorpaArtikl) => void
  ukloniArtikl: (haljina_id: string, boja: string, velicina: string) => void
  ocistiKorpu: () => void
}

export const useKorpa = create<KorpaState>()(
  persist(
    (set) => ({
      artikli: [],

      dodajArtikl: (artikl) =>
        set((state) => {
          const exists = state.artikli.some(
            (a) =>
              a.haljina_id === artikl.haljina_id &&
              a.boja === artikl.boja &&
              a.velicina === artikl.velicina
          )
          if (exists) return state
          return { artikli: [...state.artikli, artikl] }
        }),

      ukloniArtikl: (haljina_id, boja, velicina) =>
        set((state) => ({
          artikli: state.artikli.filter(
            (a) =>
              !(
                a.haljina_id === haljina_id &&
                a.boja === boja &&
                a.velicina === velicina
              )
          ),
        })),

      ocistiKorpu: () => set({ artikli: [] }),
    }),
    {
      name: 'tesoro-korpa',
    }
  )
)
