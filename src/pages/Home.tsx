import { Link } from 'react-router-dom'
import Locandina from '../components/Locandina'
import Progetto from '../components/Progetto'
import CartaEvento from '../components/CartaEvento'
import ProgrammaCompleto from '../components/ProgrammaCompleto'
import VersioniLocandina from '../components/VersioniLocandina'
import { SpiaLive } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import { useAdesso } from '../hooks/useAdesso'
import { inCorso, prossimi } from '../lib/orario'
import { daLocandina } from '../lib/provenienza'
import type { Aggiornamento, Evento } from '../lib/tipi'

export default function Home() {
  const adesso = useAdesso()
  const { righe: eventi, inAscolto } = useTabella<Evento>('sagra_eventi', 'giorno')
  const { righe: avvisi } = useTabella<Aggiornamento>('sagra_aggiornamenti', 'pubblicato_il', false)

  // Il QR stampato sulla locandina porta a `/?da=locandina` e sotto il codice
  // c'è scritto IL PROGRAMMA COMPLETO. Chi arriva da lì deve trovare il
  // programma subito, non dopo il racconto del progetto: la pagina resta la
  // stessa, cambia l'ordine di ciò che viene prima.
  const dallaLocandina = daLocandina()

  const ora = inCorso(eventi, adesso)
  const dopo = prossimi(eventi, adesso, 3)
  const evidenza = avvisi.filter((a) => a.in_evidenza).slice(0, 2)

  return (
    <div className="py-4">
      <Locandina
        azione={
          dallaLocandina ? (
            <a
              href="#programma"
              className="mt-7 inline-block rounded-full bg-cactus-scuro px-5 py-2.5 text-avorio transition-colors hover:bg-cactus"
            >
              Il programma completo ↓
            </a>
          ) : undefined
        }
      />

      {evidenza.length > 0 && (
        <section className="mt-16 rounded-xl border border-magenta/30 bg-magenta/5 px-5 py-4">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-magenta">In evidenza</h2>
          <div className="mt-3 space-y-3">
            {evidenza.map((a) => (
              <div key={a.id}>
                <p className="font-medium">{a.titolo}</p>
                {a.testo && <p className="text-sm text-antracite-chiaro">{a.testo}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {dallaLocandina && (
        <section id="programma" className="mt-16 scroll-mt-24">
          <h2 className="font-display text-3xl tracking-tight">Programma</h2>
          <p className="mt-2 text-antracite-chiaro">
            Gli orari possono cambiare fino all'ultimo. Questa pagina è sempre la versione buona.
          </p>
          <div className="mt-8">
            <ProgrammaCompleto compatto />
          </div>
          <Link
            to="/programma"
            className="mt-6 inline-block border-b border-cactus text-cactus-scuro"
          >
            Apri la pagina del programma
          </Link>
        </section>
      )}

      {ora.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl text-cactus-scuro">Adesso in corso</h2>
            <SpiaLive attiva={inAscolto} />
          </div>
          <div className="mt-4 space-y-4">
            {ora.map((e) => (
              <CartaEvento key={e.id} evento={e} adesso={adesso} />
            ))}
          </div>
        </section>
      )}

      {dopo.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">Poi</h2>
          <div className="mt-4 space-y-4">
            {dopo.map((e) => (
              <CartaEvento key={e.id} evento={e} adesso={adesso} />
            ))}
          </div>
          <Link
            to="/programma"
            className="mt-6 inline-block border-b border-cactus text-cactus-scuro"
          >
            Tutto il programma
          </Link>
        </section>
      )}

      <VersioniLocandina />

      <Progetto />
    </div>
  )
}
