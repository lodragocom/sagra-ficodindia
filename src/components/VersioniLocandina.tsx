import Manifesto from './Manifesto'
import { versioni, locandina, definitiva } from '../data/locandina'

const dataIt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long' })

function mostraData(giorno: string): string {
  return dataIt.format(new Date(`${giorno}T12:00:00`))
}

/**
 * Le versioni del manifesto, in fila e tutte insieme.
 *
 * Questo sito esiste per mostrare il processo di lavoro, non solo l'esito:
 * perciò una versione nuova non sostituisce la precedente, le si affianca.
 * Chi guarda deve poter vedere che cosa è cambiato e leggere perché — che è
 * l'unica cosa che un manifesto finito, da solo, non racconta mai.
 *
 * L'ultima della fila è quella corrente ed è marcata come tale. Nessuna è
 * ancora l'esecutivo consegnato in tipografia, e finché `definitiva` è falsa
 * la pagina lo dice apertamente invece di lasciarlo intendere.
 */
export default function VersioniLocandina() {
  return (
    <section id="versioni" className="mt-20 scroll-mt-24">
      <h2 className="font-display text-3xl tracking-tight">Le versioni del manifesto</h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-antracite-chiaro">
        Un manifesto non nasce finito. Qui restano tutti i passaggi, nell'ordine in cui
        sono stati fatti: accanto a ciascuno, che cosa è cambiato e perché.
      </p>

      {!definitiva && (
        <p className="mt-4 inline-block rounded-full border border-magenta/40 bg-magenta/5 px-4 py-1.5 text-sm text-magenta">
          Lavorazione in corso — nessuna di queste è ancora il file consegnato in stampa
        </p>
      )}

      <ol className="mt-10 grid gap-10 sm:grid-cols-2">
        {versioni.map((v, i) => {
          const corrente = v.id === locandina.id
          return (
            <li key={v.id}>
              <figure>
                <Manifesto
                  versione={v}
                  alt={`Manifesto della 34ª Sagra della Mostarda e del Ficodindia, ${v.etichetta.toLowerCase()} del ${mostraData(v.data)} 2026`}
                  sizes="(min-width: 640px) 22rem, 100vw"
                  className={
                    corrente
                      ? 'border-2 border-cactus shadow-[0_18px_40px_-24px_rgba(28,28,30,0.5)]'
                      : 'border border-antracite/12 opacity-90'
                  }
                />

                <figcaption className="mt-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-lg">
                      {i + 1}. {v.etichetta}
                    </span>
                    <span className="text-sm text-antracite-chiaro">{mostraData(v.data)}</span>
                    {corrente && (
                      <span className="rounded-full bg-cactus-scuro px-2.5 py-0.5 text-[11px] uppercase tracking-[0.15em] text-avorio">
                        versione attuale
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-prose leading-relaxed text-antracite-chiaro">
                    {v.nota}
                  </p>
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
