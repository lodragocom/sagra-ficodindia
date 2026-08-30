import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Sezione from '../components/Sezione'
import CartaEvento from '../components/CartaEvento'
import { SpiaLive, Vuoto } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import { useAdesso } from '../hooks/useAdesso'
import { giorniDiRiserva } from '../data/edizione'
import { mostraGiorno, mostraGiornoCorto, ordinaPerOrario } from '../lib/orario'
import type { Evento } from '../lib/tipi'

export default function Programma() {
  const adesso = useAdesso()
  const { righe: eventi, stato, errore, inAscolto } = useTabella<Evento>('sagra_eventi', 'giorno')
  const [giornoScelto, setGiornoScelto] = useState<string | null>(null)

  const giorni = useMemo(() => {
    const dagliEventi = [...new Set(eventi.map((e) => e.giorno))].sort()
    return dagliEventi.length > 0 ? dagliEventi : giorniDiRiserva
  }, [eventi])

  const visibili = giornoScelto ? giorni.filter((g) => g === giornoScelto) : giorni

  return (
    <Sezione
      titolo="Programma"
      sottotitolo="Gli orari possono cambiare fino all'ultimo. Questa pagina è sempre la versione buona."
      azione={<SpiaLive attiva={inAscolto} />}
    >
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip attivo={giornoScelto === null} onClick={() => setGiornoScelto(null)}>
          Tutti i giorni
        </Chip>
        {giorni.map((g) => (
          <Chip key={g} attivo={giornoScelto === g} onClick={() => setGiornoScelto(g)}>
            {mostraGiornoCorto(g)}
          </Chip>
        ))}
      </div>

      {eventi.length === 0 ? (
        <Vuoto stato={stato} errore={errore} tabella="sagra_eventi" cosa="il programma" />
      ) : (
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            {visibili.map((g) => {
              const delGiorno = ordinaPerOrario(eventi.filter((e) => e.giorno === g))
              return (
                <div key={g}>
                  <h2 className="font-display text-2xl capitalize text-cactus-scuro">
                    {mostraGiorno(g)}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {delGiorno.length === 0 ? (
                      <p className="text-sm text-antracite-chiaro">Programma da caricare.</p>
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
      )}
    </Sezione>
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
