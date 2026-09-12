import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import CartaEvento from './CartaEvento'
import { SpiaLive } from './Stato'
import { useAdesso } from '../hooks/useAdesso'
import { useGiorni } from '../hooks/useGiorni'
import { useEdizione } from '../hooks/useEdizione'
import { mostraGiorno, mostraGiornoCorto, mostraGiorniEdizione, ordinaPerOrario } from '../lib/orario'

/**
 * Il programma, in un posto solo: lo usa la pagina /programma e lo usa la home
 * quando si arriva dal QR della locandina. Due copie diverrebbero due verità.
 *
 * Quando `sagra_eventi` è ancora vuota NON si mostra un errore né una pagina
 * bianca: si mostra il calendario dei sei giorni con l'avviso che gli orari
 * stanno arrivando. Chi inquadra il QR sulla locandina deve capire di essere
 * arrivato nel posto giusto, troppo presto — non di aver trovato un sito rotto.
 */
export default function ProgrammaCompleto({ compatto = false }: { compatto?: boolean }) {
  const adesso = useAdesso()
  const { giorni, eventi, dalDatabase, inAscolto } = useGiorni()
  const [giornoScelto, setGiornoScelto] = useState<string | null>(null)

  const visibili = giornoScelto ? giorni.filter((g) => g === giornoScelto) : giorni

  if (!dalDatabase) return <InArrivo giorni={giorni} inAscolto={inAscolto} />

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Chip attivo={giornoScelto === null} onClick={() => setGiornoScelto(null)}>
          Tutti i giorni
        </Chip>
        {giorni.map((g) => (
          <Chip key={g} attivo={giornoScelto === g} onClick={() => setGiornoScelto(g)}>
            {mostraGiornoCorto(g)}
          </Chip>
        ))}
        {!compatto && <SpiaLive attiva={inAscolto} />}
      </div>

      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {visibili.map((g) => {
            const delGiorno = ordinaPerOrario(eventi.filter((e) => e.giorno === g))
            return (
              <div key={g}>
                <h3 className="font-display text-2xl first-letter:uppercase text-cactus-scuro">
                  {mostraGiorno(g)}
                </h3>
                <div className="mt-4 space-y-4">
                  {delGiorno.length === 0 ? (
                    <p className="text-sm text-antracite-chiaro">
                      Gli orari di questa giornata sono ancora da definire.
                    </p>
                  ) : (
                    delGiorno.map((e) => (
                      <CartaEvento key={e.id} evento={e} adesso={adesso} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Lo stato "non c'è ancora". Non è un errore e non va vestito da errore: è il
 * calendario che c'è già, con detto chiaramente cosa manca e quando torna.
 */
function InArrivo({ giorni, inAscolto }: { giorni: string[]; inAscolto: boolean }) {
  const { edizione } = useEdizione()

  return (
    <div>
      <div className="rounded-xl border border-cactus/35 bg-cactus/5 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="font-display text-xl text-cactus-scuro">
            Il programma degli spettacoli sta arrivando
          </h3>
          <SpiaLive attiva={inAscolto} />
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed text-antracite-chiaro">
          Le giornate della {edizione.numero}ª edizione sono fissate:{' '}
          <strong className="font-medium text-antracite">{mostraGiorniEdizione(giorni)}</strong>, a{' '}
          {edizione.luogo}. Gli orari e i nomi degli spettacoli vengono pubblicati qui appena la
          Proloco li chiude.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-antracite-chiaro">
          Questa pagina si aggiorna da sola, mentre è aperta: salvala fra i preferiti, oppure
          inquadra di nuovo il QR della locandina più avanti. Non c'è niente da scaricare e
          niente da iscriversi.
        </p>
      </div>

      <ol className="mt-8 space-y-3">
        {giorni.map((g) => (
          <li
            key={g}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-antracite/12 pb-3"
          >
            <span className="font-display text-lg first-letter:uppercase">{mostraGiorno(g)}</span>
            <span className="text-sm text-antracite-chiaro">programma in definizione</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Chip({
  attivo,
  onClick,
  children,
}: {
  attivo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        attivo
          ? 'rounded-full bg-antracite px-4 py-1.5 text-sm capitalize text-avorio'
          : 'rounded-full border border-antracite/25 px-4 py-1.5 text-sm capitalize text-antracite-chiaro hover:border-antracite/50'
      }
    >
      {children}
    </button>
  )
}
