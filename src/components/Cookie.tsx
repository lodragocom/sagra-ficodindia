import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  applicaConsenso,
  consensoSalvato,
  idGa4,
  salvaConsenso,
  type Consenso,
} from '../lib/consenso'

/**
 * Il banner compare solo se c'è davvero qualcosa da acconsentire (VITE_GA4_ID
 * impostato) e solo la prima volta. Le misure di Vercel non passano di qui:
 * sono senza cookie e senza identificativi, quindi non richiedono un permesso.
 */
export default function Cookie() {
  const [visibile, setVisibile] = useState(false)

  useEffect(() => {
    if (!idGa4) return
    const salvato = consensoSalvato()
    if (salvato) applicaConsenso(salvato)
    else setVisibile(true)
  }, [])

  function scegli(scelta: Consenso) {
    salvaConsenso(scelta)
    applicaConsenso(scelta)
    setVisibile(false)
  }

  return (
    <AnimatePresence>
      {visibile && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-label="Consenso ai cookie"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-antracite/20 bg-avorio/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-antracite-chiaro">
              Questa pagina usa cookie tecnici per funzionare e, solo se acconsenti, cookie di
              statistica per capire quante persone la aprono e da dove arrivano — anche dal QR
              della locandina.{' '}
              <a
                href="https://calatinolab25.com/cookie-policy"
                target="_blank"
                rel="noreferrer"
                className="border-b border-cactus text-cactus-scuro"
              >
                Cookie policy
              </a>
            </p>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scegli('essenziali')}
                className="rounded-full border border-antracite/30 px-4 py-2 text-sm transition-colors hover:border-antracite"
              >
                Solo essenziali
              </button>
              <button
                type="button"
                onClick={() => scegli('tutti')}
                className="rounded-full bg-cactus px-4 py-2 text-sm text-avorio transition-colors hover:bg-cactus-scuro"
              >
                Accetta
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
