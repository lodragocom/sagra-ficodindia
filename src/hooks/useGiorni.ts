import { useMemo } from 'react'
import { useTabella } from './useTabella'
import { useEdizione } from './useEdizione'
import { giorniDiRiserva } from '../data/edizione'
import type { Evento } from '../lib/tipi'

/**
 * I giorni dell'edizione, in ordine di autorevolezza:
 *
 *   1. `sagra_edizioni.giorni` — quando la Sagra è APERTA. È la verità.
 *   2. i giorni distinti di `sagra_eventi` — quando SUCCEDE qualcosa. È più
 *      stretto: un giorno aperto senza eventi pubblicati esiste, ed è il caso
 *      di oggi, con `sagra_eventi` ancora vuota.
 *   3. `giorniDiRiserva` — finché il database non dice niente.
 *
 * Perché non da `data_inizio` / `data_fine`: quelle due colonne sanno dire solo
 * un intervallo continuo, e la Sagra sono due fine settimana. Con il solo
 * intervallo la pagina direbbe "dal 9 al 18 ottobre", che è falso.
 *
 * `giorni` è OPZIONALE di proposito (`giorni?` in lib/tipi.ts, `??` qui). La
 * colonna `date[]` è proposta e non ancora applicata: finché non c'è,
 * `edizione.giorni` è `undefined` e la catena scivola su eventi → riserva senza
 * cambiare nulla. È quel punto interrogativo a tenere eseguibile il rollback —
 * scritto come campo obbligatorio il rollback resterebbe possibile sul
 * database e romperebbe i tipi, cioè sarebbe il rollback che non si fa.
 */
export function useGiorni() {
  const { righe: eventi, stato, inAscolto } = useTabella<Evento>('sagra_eventi', 'giorno')
  const { edizione } = useEdizione()

  const giorni = useMemo(() => {
    const dagliEventi = [...new Set(eventi.map((e) => e.giorno))].sort()
    return edizione.giorni ?? (dagliEventi.length > 0 ? dagliEventi : giorniDiRiserva)
  }, [eventi, edizione.giorni])

  return { giorni, eventi, dalDatabase: eventi.length > 0, stato, inAscolto }
}
