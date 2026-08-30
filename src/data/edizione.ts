import type { Edizione } from '../lib/tipi'

/**
 * Riserva: serve solo finché `sagra_edizioni` non è collegata o non ha una riga attiva.
 * Non è il posto dove aggiornare i dati dell'edizione — quello è il database.
 */
export const edizioneDiRiserva: Edizione = {
  id: 'riserva',
  numero: 34,
  anno: 2026,
  nome: 'Sagra della Mostarda e del Ficodindia',
  luogo: 'Militello in Val di Catania',
  claim: "L'Ottava Meraviglia",
  data_inizio: '2026-10-09',
  data_fine: '2026-10-18',
  attiva: true,
}

export const giorniDiRiserva = [
  '2026-10-09', '2026-10-10', '2026-10-11',
  '2026-10-16', '2026-10-17', '2026-10-18',
]
