import type { Stato as StatoTabella } from '../hooks/useTabella'

/** Dice onestamente perché una sezione è vuota, invece di mostrarla e basta. */
export function Vuoto({
  stato,
  errore,
  tabella,
  cosa,
}: {
  stato: StatoTabella
  errore?: string | null
  tabella: string
  cosa: string
}) {
  if (stato === 'attesa') {
    return <p className="text-sm text-antracite-chiaro">Carico…</p>
  }
  if (stato === 'scollegato') {
    return (
      <div className="rounded-lg border border-dashed border-antracite/30 bg-avorio-scuro/30 px-5 py-4 text-sm text-antracite-chiaro">
        Supabase non è configurato: manca <code>.env.local</code>.
        Quando c'è, {cosa} arriva da <code>{tabella}</code>.
      </div>
    )
  }
  if (stato === 'errore') {
    return (
      <div className="rounded-lg border border-magenta/40 bg-magenta/5 px-5 py-4 text-sm">
        Errore leggendo <code>{tabella}</code>: {errore}
      </div>
    )
  }
  return (
    <p className="text-sm text-antracite-chiaro">
      Ancora niente da mostrare: {cosa} è da caricare.
    </p>
  )
}

/** Pallino verde quando il canale realtime è agganciato. */
export function SpiaLive({ attiva }: { attiva: boolean }) {
  if (!attiva) return null
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cactus-scuro">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cactus opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-cactus" />
      </span>
      in diretta
    </span>
  )
}
