/**
 * Da dove è arrivato chi sta guardando la pagina.
 *
 * Il QR stampato sulla locandina porta a `https://sagra.calatinolab25.com/?da=locandina`.
 * Qui si legge quel parametro **una sola volta**, all'avvio, e si tiene in
 * memoria per il resto della visita.
 *
 * Cosa NON fa, e non deve fare: non scrive cookie, non usa localStorage né
 * sessionStorage, non manda niente a nessuno. È una variabile in memoria che
 * muore chiudendo la scheda. La misura vera resta dove già sta:
 *   · Vercel Web Analytics, senza cookie, già attivo in index.html;
 *   · GA4, che riceve `da` come campagna in lib/consenso.ts e parte SOLO
 *     dopo un sì esplicito nel banner.
 * Niente qui aggira il consenso, e niente qui va aggiunto per aggirarlo.
 */

export type Provenienza = 'locandina' | 'pieghevole' | 'altro' | null

const riconosciute = ['locandina', 'pieghevole'] as const

function leggi(): Provenienza {
  if (typeof window === 'undefined') return null
  const da = new URLSearchParams(window.location.search).get('da')?.trim().toLowerCase()
  if (!da) return null
  return (riconosciute as readonly string[]).includes(da) ? (da as Provenienza) : 'altro'
}

// Catturata all'ingresso: sopravvive ai cambi di rotta del router, che
// riscrivono la query, senza doverla trascinare in ogni link.
const provenienzaIniziale = leggi()

export function provenienza(): Provenienza {
  return provenienzaIniziale
}

export function daLocandina(): boolean {
  return provenienzaIniziale === 'locandina'
}
