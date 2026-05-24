'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovering(!!(el.closest('a') || el.closest('button') || el.closest('[role="button"]')))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [visible])

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden lg:block"
      style={{ width: 10, height: 10, top: 0, left: 0 }}
      animate={{
        x: pos.x - 5,
        y: pos.y - 5,
        scale: hovering ? 3.2 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        x: { type: 'spring', stiffness: 700, damping: 30, mass: 0.2 },
        y: { type: 'spring', stiffness: 700, damping: 30, mass: 0.2 },
        scale: { duration: 0.18, ease: 'easeOut' },
        opacity: { duration: 0.3 },
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor: hovering ? 'transparent' : '#c9a96e',
          border: hovering ? '1px solid #c9a96e' : 'none',
          transition: 'background-color 0.18s, border 0.18s',
        }}
      />
    </motion.div>
  )
}
