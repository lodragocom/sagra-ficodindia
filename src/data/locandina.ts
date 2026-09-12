/**
 * Il riferimento UNICO alla locandina. In tutto il sito non deve esistere
 * nessun altro percorso a un file della locandina: si passa da qui.
 *
 * Per sostituirla quando arriva l'esecutivo definitivo (v6, v7…):
 *
 *   1. ./scripts/locandina.sh <percorso del nuovo jpg> v6
 *   2. cambiare `versione` qui sotto in 'v6'
 *   3. cancellare le derivate vecchie da public/locandina/
 *
 * Nessun altro file va toccato. Il `?v=` sul percorso serve perché la CDN e
 * il browser non restituiscano la vecchia immagine se un giorno il nome
 * dovesse restare uguale.
 *
 * ATTENZIONE — la v5 NON è l'esecutivo definitivo. Rilievi aperti nel
 * giudizio di prestampa di Atena dell'11/09/2026 (castello alla base, rotte e
 * aerei rientrati, titolo colorato parola per parola, formato non A3, QR
 * assente). L'immagine cambierà prima del 18/09.
 */
export const locandina = {
  versione: 'v5',
  definitiva: false,
  /** Larghezze generate da scripts/locandina.sh. Vanno tenute allineate. */
  larghezze: [480, 720, 1080, 1600],
  /** Proporzioni del sorgente: servono a riservare lo spazio ed evitare il salto. */
  larghezzaSorgente: 2939,
  altezzaSorgente: 4158,
} as const

export type FormatoLocandina = 'avif' | 'webp' | 'jpg'

export function percorsoLocandina(larghezza: number, formato: FormatoLocandina): string {
  return `/locandina/locandina-${locandina.versione}-${larghezza}.${formato}`
}

export function srcsetLocandina(formato: FormatoLocandina): string {
  return locandina.larghezze.map((w) => `${percorsoLocandina(w, formato)} ${w}w`).join(', ')
}
