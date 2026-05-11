import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vodič za veličine',
  description: 'Saznajte kako izmjeriti sebe i odabrati pravu veličinu haljine u TESORO Couture salonu.',
}

const TABELA_VELICINA = [
  { velicina: 'XS', grudi: '80–84', struk: '60–64', bokovi: '86–90', visina: '160–170' },
  { velicina: 'S',  grudi: '84–88', struk: '64–68', bokovi: '90–94', visina: '163–173' },
  { velicina: 'M',  grudi: '88–92', struk: '68–72', bokovi: '94–98', visina: '165–175' },
  { velicina: 'L',  grudi: '92–97', struk: '72–77', bokovi: '98–103', visina: '167–177' },
  { velicina: 'XL', grudi: '97–103', struk: '77–83', bokovi: '103–109', visina: '168–178' },
  { velicina: 'XXL', grudi: '103–110', struk: '83–90', bokovi: '109–116', visina: '170–180' },
]

const SAVJETI = [
  'Mjerite se u donjem vešu, bez odjeće koja bi mogla poremetiti mjerenje.',
  'Koristite mekani metar, ne čelični.',
  'Stojte uspravno, prirodno — ne uvlačite stomak.',
  'Grudi: mjerite na najširem dijelu, metar horizontalno.',
  'Struk: mjerite na najtanjem dijelu, obično 2–3 cm iznad pupka.',
  'Bokovi: mjerite na najširem dijelu bokova i stražnjice.',
]

export default function VodicZaVelicine() {
  return (
    <main className="min-h-screen bg-[#faf7f4] pt-20">
      {/* Header */}
      <div className="border-b border-[#e8e0d8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e] mb-3"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Pomoć pri odabiru
          </p>
          <h1
            className="text-[clamp(32px,5vw,52px)] font-light text-[#1a1a1a]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Vodič za veličine
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-14 lg:py-20">

        {/* Illustration + mjere */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-16">

          {/* SVG ilustracija */}
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 200 380"
              className="w-full max-w-[220px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body silhouette */}
              <path
                d="M100 20 C85 20 75 35 75 55 C75 70 80 80 80 90 C70 95 55 105 50 120 C45 135 50 160 55 175 C45 190 40 220 42 250 C44 280 50 320 55 355 L145 355 C150 320 156 280 158 250 C160 220 155 190 145 175 C150 160 155 135 150 120 C145 105 130 95 120 90 C120 80 125 70 125 55 C125 35 115 20 100 20Z"
                fill="#f0ebe5"
                stroke="#e8e0d8"
                strokeWidth="1"
              />
              {/* Head */}
              <circle cx="100" cy="14" r="14" fill="#f0ebe5" stroke="#e8e0d8" strokeWidth="1" />

              {/* Grudi line */}
              <line x1="58" y1="110" x2="142" y2="110" stroke="#c9a96e" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="148" y="114" fontSize="8" fill="#c9a96e" fontFamily="sans-serif">Grudi</text>

              {/* Struk line */}
              <line x1="66" y1="148" x2="134" y2="148" stroke="#c9a96e" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="138" y="152" fontSize="8" fill="#c9a96e" fontFamily="sans-serif">Struk</text>

              {/* Bokovi line */}
              <line x1="55" y1="188" x2="145" y2="188" stroke="#c9a96e" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="148" y="192" fontSize="8" fill="#c9a96e" fontFamily="sans-serif">Bokovi</text>

              {/* Visina arrow */}
              <line x1="30" y1="0" x2="30" y2="355" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" />
              <line x1="25" y1="5" x2="35" y2="5" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" />
              <line x1="25" y1="350" x2="35" y2="350" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" />
              <text x="10" y="185" fontSize="8" fill="#8a8a8a" fontFamily="sans-serif" transform="rotate(-90, 10, 185)">Visina</text>
            </svg>
          </div>

          {/* Instructions */}
          <div>
            <h2
              className="text-2xl font-light text-[#1a1a1a] mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Kako se mjeri?
            </h2>
            <div className="w-8 h-px bg-[#c9a96e] mb-6" />

            <ul className="flex flex-col gap-4">
              {SAVJETI.map((savjet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="text-[#c9a96e] text-sm shrink-0 mt-0.5"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    className="text-sm text-[#8a8a8a] leading-relaxed"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {savjet}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Size table */}
        <div>
          <h2
            className="text-2xl font-light text-[#1a1a1a] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Tabela veličina
          </h2>
          <div className="w-8 h-px bg-[#c9a96e] mb-8" />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e8e0d8]">
                  {['Veličina', 'Grudi (cm)', 'Struk (cm)', 'Bokovi (cm)', 'Visina (cm)'].map((col) => (
                    <th
                      key={col}
                      className="text-left pb-4 pr-6 text-[9px] tracking-[0.3em] uppercase text-[#c9a96e]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABELA_VELICINA.map((row, i) => (
                  <tr
                    key={row.velicina}
                    className={`border-b border-[#e8e0d8] ${i % 2 === 0 ? 'bg-white/50' : ''}`}
                  >
                    <td
                      className="py-4 pr-6 text-sm font-medium text-[#1a1a1a]"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {row.velicina}
                    </td>
                    {[row.grudi, row.struk, row.bokovi, row.visina].map((val, j) => (
                      <td
                        key={j}
                        className="py-4 pr-6 text-sm text-[#8a8a8a]"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-5 bg-[#1a1a1a]">
            <p
              className="text-[10px] tracking-[0.2em] text-[#c9a96e] uppercase mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Niste sigurni?
            </p>
            <p
              className="text-sm text-[#faf7f4]/70 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Uvijek možete odabrati opciju <strong className="text-[#faf7f4]">Po mjeri</strong> — unesete vaše tačne mjere i mi ćemo haljinu prilagoditi vama. Ili nas jednostavno kontaktirajte za savjet.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
