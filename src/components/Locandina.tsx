import { motion } from 'motion/react'
import Manifesto from './Manifesto'
import { useEdizione } from '../hooks/useEdizione'
import { useGiorni } from '../hooks/useGiorni'
import { mostraGiorniEdizione } from '../lib/orario'

/**
 * L'apertura della pagina: prima si vede il manifesto, poi si legge perché è così.
 * L'immagine sta in `Manifesto`, che la prende da `src/data/locandina.ts`:
 * qui dentro non c'è nessun percorso a nessun file.
 */
export default function Locandina({ azione }: { azione?: React.ReactNode }) {
  const { edizione } = useEdizione()
  const { giorni } = useGiorni()

  return (
    <section id="locandina" className="scroll-mt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 lg:order-1"
        >
          <Manifesto
            priorita
            alt={`Manifesto della ${edizione.numero}ª ${edizione.nome} — ${edizione.luogo}, ${mostraGiorniEdizione(giorni)}`}
            className="border border-antracite/12 shadow-[0_24px_60px_-30px_rgba(28,28,30,0.55)]"
          />
        </motion.figure>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-cactus-scuro">
            {edizione.luogo}
          </p>

          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            {edizione.numero}ª {edizione.nome}
          </h1>

          {edizione.claim && (
            <p className="mt-5 font-display text-2xl text-magenta">{edizione.claim}</p>
          )}

          {/* Due fine settimana, non dieci giorni di fila: la riga va letta
              per intero, non compressa in un intervallo. */}
          <p className="mt-7 font-display text-xl leading-snug">
            {mostraGiorniEdizione(giorni)}
          </p>

          {azione}

          <p className="mt-7 max-w-md leading-relaxed text-antracite-chiaro">
            Manifesto della {edizione.numero}ª edizione, nello stato in cui è oggi: la
            lavorazione è ancora aperta. Sotto restano tutte le versioni, e il progetto che
            le regge — il briefing, l'identità della Sagra e il sistema visivo di quest'anno.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="#versioni"
              className="inline-block border-b border-cactus pb-0.5 text-cactus-scuro transition-colors hover:text-antracite"
            >
              Le versioni ↓
            </a>
            <a
              href="#progetto"
              className="inline-block border-b border-cactus pb-0.5 text-cactus-scuro transition-colors hover:text-antracite"
            >
              Il progetto ↓
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
