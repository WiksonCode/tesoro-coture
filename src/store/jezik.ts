import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Jezik = 'sr' | 'en'

interface JezikStore {
  jezik: Jezik
  setJezik: (j: Jezik) => void
}

export const useJezik = create<JezikStore>()(
  persist(
    (set) => ({
      jezik: 'sr',
      setJezik: (j) => set({ jezik: j }),
    }),
    { name: 'tesoro-jezik' }
  )
)
