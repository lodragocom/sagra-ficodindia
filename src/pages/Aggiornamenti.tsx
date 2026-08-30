import { motion, AnimatePresence } from 'motion/react'
import Sezione from '../components/Sezione'
import { SpiaLive, Vuoto } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import type { Aggiornamento } from '../lib/tipi'

const quando = new Intl.DateTimeFormat('it-IT', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
})

export default function Aggiornamenti() {
  const { righe, stato, errore, inAscolto } = useTabella<Aggiornamento>(
    'sagra_aggiornamenti',
    'pubblicato_il',
    false,
  )

  return (
    <Sezione
      titolo="Aggiornamenti"
      sottotitolo="Cambi di orario, meteo, novità dell'ultimo minuto. Compaiono qui senza ricaricare."
      azione={<SpiaLive attiva={inAscolto} />}
    >
      {righe.length === 0 ? (
        <Vuoto stato={stato} errore={errore} tabella="sagra_aggiornamenti" cosa="gli avvisi" />
      ) : (
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {righe.map((a) => (
              <motion.article
                key={a.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={
                  a.in_evidenza
                    ? 'rounded-xl border border-magenta/30 bg-magenta/5 px-5 py-4'
                    : 'border-l-2 border-antracite/15 pl-4'
                }
              >
                <p className="text-[11px] uppercase tracking-[0.15em] text-antracite-chiaro">
                  {quando.format(new Date(a.pubblicato_il))}
                </p>
                <h2 className="mt-1 font-display text-xl">{a.titolo}</h2>
                {a.testo && <p className="mt-1 leading-relaxed">{a.testo}</p>}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Sezione>
  )
}
