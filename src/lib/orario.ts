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

const soloGiorno = new Intl.DateTimeFormat('it-IT', { day: 'numeric' })
const soloMese = new Intl.DateTimeFormat('it-IT', { month: 'long' })

/**
 * La Sagra non dura dieci giorni di fila: sono due fine settimana.
 * Scrivere "dal 9 al 18 ottobre" è falso, e la gente arriva il 13 e trova il
 * paese chiuso. Questa funzione raggruppa i giorni consecutivi e li unisce:
 * ["2026-10-09"…"2026-10-11","2026-10-16"…"2026-10-18"]
 *   → "9, 10, 11 e 16, 17, 18 ottobre 2026"
 */
export function mostraGiorniEdizione(giorni: string[]): string {
  if (giorni.length === 0) return ''
  const ordinati = [...new Set(giorni)].sort()
  const date = ordinati.map((g) => new Date(`${g}T12:00:00`))

  const blocchi: Date[][] = []
  for (const d of date) {
    const corrente = blocchi[blocchi.length - 1]
    const precedente = corrente?.[corrente.length - 1]
    const consecutivo =
      precedente && Math.round((d.getTime() - precedente.getTime()) / 86_400_000) === 1
    if (consecutivo) corrente.push(d)
    else blocchi.push([d])
  }

  const numeri = blocchi.map((b) => b.map((d) => soloGiorno.format(d)).join(', '))
  const ultimo = date[date.length - 1]
  const mese = soloMese.format(ultimo)
  const anno = ultimo.getFullYear()

  // Se i blocchi cadono in mesi diversi il mese va ripetuto: qui non succede,
  // ma il caso esiste (edizioni a cavallo di fine ottobre) e va detto.
  const mesiDistinti = new Set(blocchi.map((b) => soloMese.format(b[0])))
  if (mesiDistinti.size > 1) {
    return (
      blocchi
        .map((b, i) => `${numeri[i]} ${soloMese.format(b[0])}`)
        .join(' e ') + ` ${anno}`
    )
  }

  return `${numeri.join(' e ')} ${mese} ${anno}`
}
