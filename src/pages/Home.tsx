import { Link } from 'react-router-dom'
import Locandina from '../components/Locandina'
import Progetto from '../components/Progetto'
import CartaEvento from '../components/CartaEvento'
import { SpiaLive } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import { useAdesso } from '../hooks/useAdesso'
import { inCorso, prossimi } from '../lib/orario'
import type { Aggiornamento, Evento } from '../lib/tipi'

export default function Home() {
  const adesso = useAdesso()
  const { righe: eventi, inAscolto } = useTabella<Evento>('sagra_eventi', 'giorno')
  const { righe: avvisi } = useTabella<Aggiornamento>('sagra_aggiornamenti', 'pubblicato_il', false)

  const ora = inCorso(eventi, adesso)
  const dopo = prossimi(eventi, adesso, 3)
  const evidenza = avvisi.filter((a) => a.in_evidenza).slice(0, 2)

  return (
    <div className="py-4">
      <Locandina />

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

      <Progetto />
    </div>
  )
}
