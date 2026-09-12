/**
 * Il riferimento UNICO alle locandine. In tutto il sito non deve esistere
 * nessun altro percorso a un file della locandina: si passa da qui.
 *
 * Questo sito racconta il processo di lavoro, non solo il risultato. Perciò
 * le versioni NON si sostituiscono: si accumulano. Ogni stato del manifesto
 * resta visibile accanto agli altri, con la data e il motivo per cui è
 * cambiato. La versione corrente è l'ultima dell'elenco.
 *
 * Per aggiungerne una nuova:
 *
 *   1. ./scripts/locandina.sh <percorso del nuovo jpg> v7
 *   2. aggiungere qui sotto la voce { id: 'v7', … } in fondo a `versioni`
 *
 * Nessun altro file va toccato, e NON si cancellano le derivate delle
 * versioni precedenti: servono a mostrare il percorso.
 *
 * ATTENZIONE — nessuna di queste è l'esecutivo definitivo. I rilievi aperti
 * sono nel giudizio di prestampa di Atena dell'11/09/2026: formato non A3,
 * QR assente, castello alla base, titolo colorato parola per parola.
 */

export type VersioneLocandina = {
  id: string
  /** Come la chiama il sito, in chiaro. */
  etichetta: string
  /** Quando è stata prodotta. */
  data: string
  /** Che cosa è cambiato rispetto alla precedente, o perché esiste. */
  nota: string
  /** Proporzioni del sorgente: riservano lo spazio ed evitano il salto. */
  larghezzaSorgente: number
  altezzaSorgente: number
}

/** In ordine cronologico. L'ultima è quella corrente. */
export const versioni: readonly VersioneLocandina[] = [
  {
    id: 'v5',
    etichetta: 'Prima versione',
    data: '2026-09-09',
    nota:
      'Il frutto torna intero e chiuso, il fondo perde l’alone, il Castello ' +
      'Barresi-Branciforte scende alla base e regge il frutto. Restano le ' +
      'rotte tratteggiate e gli aerei.',
    larghezzaSorgente: 2939,
    altezzaSorgente: 4158,
  },
  {
    id: 'v6',
    etichetta: 'Seconda versione',
    data: '2026-09-11',
    nota:
      'Via le rotte e gli aerei: servivano a dare un posto al frutto quando ' +
      'galleggiava, e da quando il Castello lo sorregge sono rumore. Il ' +
      'frutto si legge più grande a parità di dimensione.',
    larghezzaSorgente: 2480,
    altezzaSorgente: 3508,
  },
]

/** La versione mostrata come manifesto corrente: sempre l'ultima. */
export const locandina = versioni[versioni.length - 1]

/** Nessuna versione è ancora l'esecutivo consegnato in tipografia. */
export const definitiva = false

/** Larghezze generate da scripts/locandina.sh. Vanno tenute allineate. */
export const larghezze = [480, 720, 1080, 1600] as const

export type FormatoLocandina = 'avif' | 'webp' | 'jpg'

export function percorsoLocandina(
  versione: string,
  larghezza: number,
  formato: FormatoLocandina,
): string {
  return `/locandina/locandina-${versione}-${larghezza}.${formato}`
}

export function srcsetLocandina(versione: string, formato: FormatoLocandina): string {
  return larghezze.map((w) => `${percorsoLocandina(versione, w, formato)} ${w}w`).join(', ')
}
