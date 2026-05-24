export default function KatalogLoading() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-16 lg:pt-20">
      {/* Header skeleton */}
      <div className="border-b border-[#e8e0d8] bg-[#faf7f4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-10 lg:pb-14">
          <div className="h-2.5 w-28 bg-[#e8e0d8] rounded animate-pulse mb-5" />
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="h-3 w-20 bg-[#e8e0d8] rounded animate-pulse mb-4" />
              <div className="h-10 w-56 bg-[#e8e0d8] rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-[#e8e0d8] rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="border-b border-[#e8e0d8] bg-[#faf7f4]">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="flex items-center gap-2 py-3 border-b border-[#e8e0d8]/60 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 shrink-0 bg-[#e8e0d8] animate-pulse" />
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3 py-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-[#e8e0d8] animate-pulse" />
            ))}
          </div>
          <div className="flex lg:hidden items-center justify-between py-3">
            <div className="h-3 w-16 bg-[#e8e0d8] animate-pulse" />
            <div className="h-9 w-24 bg-[#e8e0d8] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Cards grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div
                className="bg-[#f0ebe5] animate-pulse w-full"
                style={{ aspectRatio: '3/4' }}
              />
              <div className="mt-4 space-y-2">
                <div className="h-5 bg-[#e8e0d8] animate-pulse rounded w-3/4" />
                <div className="h-4 bg-[#e8e0d8] animate-pulse rounded w-1/3" />
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="w-3 h-3 rounded-full bg-[#e8e0d8] animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
