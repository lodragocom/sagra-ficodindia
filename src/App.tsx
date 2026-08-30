import { Routes, Route, NavLink } from 'react-router-dom'
import { edizione } from './data/edizione'
import Home from './pages/Home'
import Programma from './pages/Programma'
import Sponsor from './pages/Sponsor'
import Info from './pages/Info'
import Aggiornamenti from './pages/Aggiornamenti'

const voci = [
  { to: '/', label: 'Home', end: true },
  { to: '/programma', label: 'Programma' },
  { to: '/sponsor', label: 'Sponsor' },
  { to: '/info', label: 'Info' },
  { to: '/aggiornamenti', label: 'Aggiornamenti' },
]

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-antracite/15">
        <nav className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-display text-lg tracking-tight">
            {edizione.numero}ª Sagra
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {voci.map((v) => (
              <NavLink
                key={v.to}
                to={v.to}
                end={v.end}
                className={({ isActive }) =>
                  isActive
                    ? 'text-cactus-scuro font-medium'
                    : 'text-antracite-chiaro hover:text-antracite'
                }
              >
                {v.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programma" element={<Programma />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/info" element={<Info />} />
          <Route path="/aggiornamenti" element={<Aggiornamenti />} />
        </Routes>
      </main>

      <footer className="border-t border-antracite/15 mt-12">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-antracite-chiaro">
          {edizione.nome} · {edizione.luogo} · {edizione.anno}
          <span className="block mt-1">
            Proloco di Militello in Val di Catania · a cura di CalatinoLab25
          </span>
        </div>
      </footer>
    </div>
  )
}
