import { motion } from 'motion/react'
import Sezione from '../components/Sezione'
import { SpiaLive, Vuoto } from '../components/Stato'
import { useTabella } from '../hooks/useTabella'
import type { Sponsor as SponsorRiga } from '../lib/tipi'

const ORDINE_LIVELLI = ['patrocinio', 'principale', 'sostenitore']

export default function Sponsor() {
  const { righe, stato, errore, inAscolto } = useTabella<SponsorRiga>('sagra_sponsor', 'ordine')

  const livelli = [...new Set(righe.map((s) => s.livello))].sort(
    (a, b) => indice(a) - indice(b),
  )

  return (
    <Sezione
      titolo="Sponsor e patrocini"
      sottotitolo="Chi sostiene la Sagra."
      azione={<SpiaLive attiva={inAscolto} />}
    >
      {righe.length === 0 ? (
        <Vuoto stato={stato} errore={errore} tabella="sagra_sponsor" cosa="l'elenco" />
      ) : (
        <div className="space-y-10">
          {livelli.map((livello) => (
            <div key={livello}>
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-antracite-chiaro">
                {livello}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {righe
                  .filter((s) => s.livello === livello)
                  .map((s) => (
                    <motion.a
                      key={s.id}
                      href={s.sito ?? undefined}
                      target={s.sito ? '_blank' : undefined}
                      rel="noreferrer"
                      whileHover={{ y: -3 }}
                      className="flex aspect-[3/2] items-center justify-center rounded-lg border border-antracite/12 bg-avorio p-4"
                    >
                      {s.logo_url ? (
                        <img
                          src={s.logo_url}
                          alt={s.nome}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-center text-sm">{s.nome}</span>
                      )}
                    </motion.a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Sezione>
  )
}

function indice(livello: string) {
  const i = ORDINE_LIVELLI.indexOf(livello)
  return i === -1 ? ORDINE_LIVELLI.length : i
}
