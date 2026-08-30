import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Pianeta from '../components/Pianeta'
import CartaEvento from '../components/CartaEvento'
import { SpiaLive } from '../components/Stato'
import { useEdizione } from '../hooks/useEdizione'
import { useTabella } from '../hooks/useTabella'
import { useAdesso } from '../hooks/useAdesso'
import { inCorso, prossimi, mostraGiorno } from '../lib/orario'
import type { Aggiornamento, Evento } from '../lib/tipi'

export default function Home() {
  const { edizione } = useEdizione()
  const adesso = useAdesso()
  const { righe: eventi, inAscolto } = useTabella<Evento>('sagra_eventi', 'giorno')
  const { righe: avvisi } = useTabella<Aggiornamento>('sagra_aggiornamenti', 'pubblicato_il', false)

  const ora = inCorso(eventi, adesso)
  const dopo = prossimi(eventi, adesso, 3)
  const evidenza = avvisi.filter((a) => a.in_evidenza).slice(0, 2)

  return (
    <div className="py-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm uppercase tracking-[0.25em] text-cactus-scuro"
      >
        {edizione.luogo}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl"
      >
        {edizione.numero}ª {edizione.nome}
      </motion.h1>

      {edizione.claim && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 font-display text-2xl text-magenta"
        >
          {edizione.claim}
        </motion.p>
      )}

      <Pianeta />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <span className="rounded-full bg-cactus px-5 py-2 text-lg text-avorio">
          {mostraGiorno(edizione.data_inizio)}
        </span>
        <span className="text-antracite-chiaro">→</span>
        <span className="rounded-full bg-cactus-scuro px-5 py-2 text-lg text-avorio">
          {mostraGiorno(edizione.data_fine)}
        </span>
        <span className="rounded-full bg-giallo px-5 py-2 text-lg">{edizione.anno}</span>
      </motion.div>

      {evidenza.length > 0 && (
        <section className="mt-12 rounded-xl border border-magenta/30 bg-magenta/5 px-5 py-4">
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
        <section className="mt-12">
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
        <section className="mt-12">
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
    </div>
  )
}
