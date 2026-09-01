import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useEdizione } from './hooks/useEdizione'
import Home from './pages/Home'
import Programma from './pages/Programma'
import Sponsor from './pages/Sponsor'
import Info from './pages/Info'
import Aggiornamenti from './pages/Aggiornamenti'
import Cookie from './components/Cookie'

// Il menù mostra solo ciò che ha contenuti veri. Programma, sponsor, info e
// aggiornamenti restano raggiungibili per indirizzo e rientrano qui quando il
// database ha righe pubblicate — non prima: sezioni vuote indeboliscono il lavoro.
const voci: { to: string; label: string; end?: boolean }[] = []

export default function App() {
  const { edizione } = useEdizione()
  const posizione = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-antracite/15 bg-avorio/85 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
          <NavLink to="/" className="font-display text-lg tracking-tight">
            {edizione.numero}ª Sagra
          </NavLink>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a
              href="#locandina"
              className="text-antracite-chiaro transition-colors hover:text-antracite"
            >
              La locandina
            </a>
            <a
              href="#progetto"
              className="text-antracite-chiaro transition-colors hover:text-antracite"
            >
              Il progetto
            </a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {voci.map((v) => (
              <NavLink
                key={v.to}
                to={v.to}
                end={v.end}
                className={({ isActive }) =>
                  isActive
                    ? 'font-medium text-cactus-scuro'
                    : 'text-antracite-chiaro transition-colors hover:text-antracite'
                }
              >
                {v.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={posizione.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={posizione}>
              <Route path="/" element={<Home />} />
              <Route path="/programma" element={<Programma />} />
              <Route path="/sponsor" element={<Sponsor />} />
              <Route path="/info" element={<Info />} />
              <Route path="/aggiornamenti" element={<Aggiornamenti />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-12 border-t border-antracite/15">
        <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-antracite-chiaro">
          {edizione.nome} · {edizione.luogo} · {edizione.anno}
          <span className="mt-1 block">
            Proloco di Militello in Val di Catania · a cura di CalatinoLab25
          </span>
        </div>
      </footer>

      <Cookie />
    </div>
  )
}
