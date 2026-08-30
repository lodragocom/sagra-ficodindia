import type { Edizione } from '../lib/tipi'
import { edizioneDiRiserva } from '../data/edizione'
import { useTabella } from './useTabella'

export function useEdizione() {
  const { righe, stato } = useTabella<Edizione>('sagra_edizioni', 'anno', false)
  const attiva = righe.find((e) => e.attiva) ?? righe[0]
  return {
    edizione: attiva ?? edizioneDiRiserva,
    dalDatabase: Boolean(attiva),
    stato,
  }
}
