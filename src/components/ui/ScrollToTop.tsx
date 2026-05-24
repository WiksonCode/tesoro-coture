'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-6 z-50 w-10 h-10 border border-[#1a1a1a]/15 bg-[#faf7f4]/90 backdrop-blur-sm flex items-center justify-center text-[#8a8a8a] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-300 cursor-pointer"
          aria-label="Nazad na vrh"
        >
          <ArrowUp size={13} strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
