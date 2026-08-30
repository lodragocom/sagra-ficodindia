import type { Evento } from './tipi'

export type StatoEvento = 'passato' | 'in corso' | 'prossimo'

function componi(giorno: string, ora: string | null, fallback: string): Date {
  return new Date(`${giorno}T${(ora ?? fallback).slice(0, 8).padEnd(8, ':00')}`)
}

export function inizioDi(e: Evento): Date {
  return componi(e.giorno, e.ora_inizio, '00:00:00')
}

export function fineDi(e: Evento): Date {
  if (e.ora_fine) return componi(e.giorno, e.ora_fine, '23:59:59')
  // Senza ora di fine si assume che duri due ore: basta per dire "in corso".
  const d = inizioDi(e)
  d.setHours(d.getHours() + 2)
  return d
}

export function statoDi(e: Evento, adesso: Date): StatoEvento {
  if (adesso < inizioDi(e)) return 'prossimo'
  if (adesso > fineDi(e)) return 'passato'
  return 'in corso'
}

export function inCorso(eventi: Evento[], adesso: Date): Evento[] {
  return eventi.filter((e) => statoDi(e, adesso) === 'in corso')
}

export function prossimi(eventi: Evento[], adesso: Date, quanti = 3): Evento[] {
  return eventi
    .filter((e) => statoDi(e, adesso) === 'prossimo')
    .sort((a, b) => inizioDi(a).getTime() - inizioDi(b).getTime())
    .slice(0, quanti)
}

export function ordinaPerOrario(eventi: Evento[]): Evento[] {
  return [...eventi].sort((a, b) => {
    const d = inizioDi(a).getTime() - inizioDi(b).getTime()
    return d !== 0 ? d : a.ordine - b.ordine
  })
}

const oraIt = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' })
const giornoIt = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
const giornoCorto = new Intl.DateTimeFormat('it-IT', { weekday: 'short', day: 'numeric' })

export function mostraOra(e: Evento): string {
  if (!e.ora_inizio) return 'orario da definire'
  const inizio = oraIt.format(inizioDi(e))
  return e.ora_fine ? `${inizio} – ${oraIt.format(fineDi(e))}` : inizio
}

export function mostraGiorno(giorno: string): string {
  return giornoIt.format(new Date(`${giorno}T12:00:00`))
}

export function mostraGiornoCorto(giorno: string): string {
  return giornoCorto.format(new Date(`${giorno}T12:00:00`))
}
