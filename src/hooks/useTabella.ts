import { useCallback, useEffect, useState } from 'react'
import { supabase, supabaseConfigurato } from '../lib/supabase'

export type Stato = 'attesa' | 'pronto' | 'scollegato' | 'errore'

/**
 * Legge una tabella e resta in ascolto: ogni insert, update o delete
 * ricarica le righe su chi ha la pagina aperta. È il motivo per cui il sito
 * può stare aperto in piazza durante i sei giorni.
 */
export function useTabella<T>(
  tabella: string,
  colonnaOrdine?: string,
  crescente = true,
) {
  const [righe, setRighe] = useState<T[]>([])
  const [stato, setStato] = useState<Stato>(
    supabaseConfigurato ? 'attesa' : 'scollegato',
  )
  const [errore, setErrore] = useState<string | null>(null)
  const [inAscolto, setInAscolto] = useState(false)

  const carica = useCallback(async () => {
    if (!supabase) return
    let query = supabase.from(tabella).select('*')
    if (colonnaOrdine) {
      query = query.order(colonnaOrdine, { ascending: crescente })
    }
    const { data, error } = await query
    if (error) {
      setErrore(error.message)
      setStato('errore')
      return
    }
    setRighe((data ?? []) as T[])
    setErrore(null)
    setStato('pronto')
  }, [tabella, colonnaOrdine, crescente])

  useEffect(() => {
    const client = supabase
    if (!client) {
      setStato('scollegato')
      return
    }
    void carica()

    // Il nome del canale deve essere unico per ogni sottoscrizione: due componenti
    // che leggono la stessa tabella (o il doppio montaggio di React in sviluppo)
    // riuserebbero lo stesso canale, e `.on()` su un canale già sottoscritto lancia.
    const nome = `sagra:${tabella}:${Math.random().toString(36).slice(2)}`

    const canale = client
      .channel(nome)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tabella },
        () => void carica(),
      )
      .subscribe((s) => setInAscolto(s === 'SUBSCRIBED'))

    return () => {
      setInAscolto(false)
      void client.removeChannel(canale)
    }
  }, [carica, tabella])

  return { righe, stato, errore, inAscolto, ricarica: carica }
}
