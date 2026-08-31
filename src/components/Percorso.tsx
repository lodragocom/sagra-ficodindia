import { motion } from 'motion/react'
import { useTabella } from '../hooks/useTabella'
import { SpiaLive, Vuoto } from './Stato'
import type { Passaggio } from '../lib/tipi'

const meseAnno = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' })

/**
 * Il percorso della locandina: cosa è già stato fatto e cosa manca.
 * I passaggi arrivano da `sagra_passaggi` e si aggiungono senza ripubblicare il sito.
 */
export default function Percorso() {
  const { righe, stato, errore, inAscolto } = useTabella<Passaggio>('sagra_passaggi', 'ordine')

  const fatti = righe.filter((p) => p.stato === 'fatto').length
  const mancano = righe.filter((p) => p.stato !== 'fatto').length

  return (
    <section id="percorso" className="mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-antracite pt-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cactus-scuro">
            Il lavoro in corso
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
            Come nasce la locandina
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <SpiaLive attiva={inAscolto} />
          {righe.length > 0 && (
            <p className="text-sm tabular-nums text-antracite-chiaro">
              {fatti} passaggi fatti · {mancano} {mancano === 1 ? 'manca' : 'mancano'}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-antracite-chiaro">
        Questa pagina cresce insieme al lavoro. Ogni passaggio compare qui appena è pronto: si
        vede da dove si parte, dove si è arrivati e cosa resta da fare prima della stampa.
      </p>

      <div className="mt-14">
        {righe.length === 0 ? (
          <Vuoto stato={stato} errore={errore} tabella="sagra_passaggi" cosa="il percorso" />
        ) : (
          <ol className="space-y-20">
            {righe.map((p, i) => (
              <Tappa key={p.id} passaggio={p} indice={i + 1} />
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

function Tappa({ passaggio: p, indice }: { passaggio: Passaggio; indice: number }) {
  const daFare = p.stato === 'da fare'
  const inCorso = p.stato === 'in corso'

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="grid gap-6 sm:grid-cols-[4rem_minmax(0,1fr)]"
    >
      <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
        <span
          className={
            daFare
              ? 'font-display text-2xl tabular-nums text-antracite/30'
              : 'font-display text-2xl tabular-nums text-magenta'
          }
        >
          {String(indice).padStart(2, '0')}
        </span>
        <Pastiglia stato={p.stato} />
      </div>

      <div>
        <h3
          className={
            daFare
              ? 'font-display text-2xl text-antracite/45'
              : 'font-display text-2xl'
          }
        >
          {p.titolo}
        </h3>

        {p.data && (
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-antracite-chiaro">
            {meseAnno.format(new Date(`${p.data}T12:00:00`))}
          </p>
        )}

        {p.testo && (
          <p
            className={
              daFare
                ? 'mt-3 max-w-2xl leading-relaxed text-antracite-chiaro'
                : 'mt-3 max-w-2xl leading-relaxed'
            }
          >
            {p.testo}
          </p>
        )}

        {p.immagine_url ? (
          <figure className="mt-7">
            <img
              src={p.immagine_url}
              alt={p.didascalia ?? p.titolo}
              loading="lazy"
              className="w-full max-w-2xl border border-antracite/12 bg-avorio-scuro/20"
            />
            {p.didascalia && (
              <figcaption className="mt-2 text-sm text-antracite-chiaro">
                {p.didascalia}
              </figcaption>
            )}
          </figure>
        ) : (
          !inCorso &&
          daFare && (
            <div className="mt-7 flex h-40 max-w-2xl items-center justify-center rounded-sm border border-dashed border-antracite/25 text-sm text-antracite-chiaro">
              Ancora da fare
            </div>
          )
        )}
      </div>
    </motion.li>
  )
}

function Pastiglia({ stato }: { stato: Passaggio['stato'] }) {
  if (stato === 'fatto') {
    return (
      <span className="rounded-full bg-cactus px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-avorio">
        fatto
      </span>
    )
  }
  if (stato === 'in corso') {
    return (
      <span className="rounded-full bg-magenta px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-avorio">
        in corso
      </span>
    )
  }
  return (
    <span className="rounded-full border border-antracite/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-antracite-chiaro">
      da fare
    </span>
  )
}
