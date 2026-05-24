export default function MarqueeStrip() {
  const items = [
    'Kolekcija 2025',
    'Haljine po meri',
    'Besplatne konsultacije',
    'Beograd',
    'Ekskluzivni dizajni',
    'Venčane · Koktel · Svečane',
    'Od 2018. godine',
    'Individualni pristup',
  ]

  const text = items.map((item) => `${item} ·`).join('  ')

  return (
    <div className="relative bg-[#1a1a1a] py-4 border-y border-[#c9a96e]/15 w-full" style={{ overflow: 'hidden' }}>
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        {[text, text].map((t, i) => (
          <span
            key={i}
            className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/70 pr-16 flex-shrink-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
