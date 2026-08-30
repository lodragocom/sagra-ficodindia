import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export default function Sezione({
  titolo,
  sottotitolo,
  azione,
  children,
}: {
  titolo: string
  sottotitolo?: string
  azione?: ReactNode
  children?: ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl tracking-tight">{titolo}</h1>
        {azione}
      </div>
      {sottotitolo && <p className="mt-2 text-antracite-chiaro">{sottotitolo}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  )
}
