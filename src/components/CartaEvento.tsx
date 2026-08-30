import { motion } from 'motion/react'
import type { Evento } from '../lib/tipi'
import { mostraOra, statoDi } from '../lib/orario'

export default function CartaEvento({
  evento,
  adesso,
}: {
  evento: Evento
  adesso: Date
}) {
  const stato = statoDi(evento, adesso)
  const bordo =
    stato === 'in corso'
      ? 'border-l-cactus'
      : stato === 'passato'
        ? 'border-l-antracite/20'
        : 'border-l-magenta'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: stato === 'passato' ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-l-2 ${bordo} pl-4 py-1`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-medium tabular-nums">{mostraOra(evento)}</span>
        <h3 className="font-display text-lg">{evento.titolo}</h3>
        {stato === 'in corso' && (
          <span className="rounded-full bg-cactus px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-avorio">
            adesso
          </span>
        )}
        {evento.categoria && (
          <span className="text-[11px] uppercase tracking-[0.15em] text-antracite-chiaro">
            {evento.categoria}
          </span>
        )}
      </div>
      {evento.luogo && (
        <p className="mt-0.5 text-sm text-antracite-chiaro">{evento.luogo}</p>
      )}
      {evento.descrizione && (
        <p className="mt-1 text-sm leading-relaxed">{evento.descrizione}</p>
      )}
    </motion.article>
  )
}
