import { motion } from 'motion/react'
import { useEdizione } from '../hooks/useEdizione'
import { mostraGiorno } from '../lib/orario'

/**
 * L'apertura della pagina: prima si vede il manifesto, poi si legge perché è così.
 * Il file è la composizione esecutiva corrente; quando cambia si sostituisce
 * l'immagine in `public/passaggi/` senza toccare il codice.
 */
export default function Locandina() {
  const { edizione } = useEdizione()

  return (
    <section id="locandina" className="scroll-mt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 lg:order-1"
        >
          <img
            src="/passaggi/06-locandina-esecutiva.jpg"
            alt={`Manifesto della ${edizione.numero}ª ${edizione.nome}`}
            className="w-full border border-antracite/12 shadow-[0_24px_60px_-30px_rgba(28,28,30,0.55)]"
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

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cactus px-4 py-1.5 text-avorio">
              {mostraGiorno(edizione.data_inizio)}
            </span>
            <span className="text-antracite-chiaro">→</span>
            <span className="rounded-full bg-cactus-scuro px-4 py-1.5 text-avorio">
              {mostraGiorno(edizione.data_fine)}
            </span>
            <span className="rounded-full bg-giallo px-4 py-1.5">{edizione.anno}</span>
          </div>

          <p className="mt-7 max-w-md leading-relaxed text-antracite-chiaro">
            Manifesto ufficiale della {edizione.numero}ª edizione. Sotto, il progetto che lo
            regge: il briefing, l'identità della Sagra e il sistema visivo con cui viene
            declinata quest'anno.
          </p>

          <a
            href="#progetto"
            className="mt-6 inline-block border-b border-cactus pb-0.5 text-cactus-scuro transition-colors hover:text-antracite"
          >
            Il progetto ↓
          </a>
        </motion.div>
      </div>
    </section>
  )
}
