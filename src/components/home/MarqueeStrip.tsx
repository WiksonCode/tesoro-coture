const items = [
  'Od 2020. godine',
  'Beograd',
  'Individualan pristup',
  'Haljine po meri',
]

function MarqueeItems() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center flex-shrink-0">
          <span
            className="text-[9px] tracking-[0.45em] uppercase text-[#c9a96e]/70 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {item}
          </span>
          <span className="mx-6 text-base text-[#c9a96e]/50 leading-none">•</span>
        </span>
      ))}
    </>
  )
}

export default function MarqueeStrip() {
  return (
    <div className="relative bg-[#1a1a1a] py-4 border-y border-[#c9a96e]/15 w-full" style={{ overflow: 'hidden' }}>
      <div className="flex whitespace-nowrap animate-marquee will-change-transform">
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  )
}
