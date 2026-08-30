import { createClient } from '@supabase/supabase-js'

// Ci si appoggia al progetto Supabase di CalatinoLab25: la Sagra è cliente di Calatino
// e le sue tabelle sono prefissate `sagra_`.
// I valori stanno nelle variabili d'ambiente di Vercel e in .env.local, mai nel repo.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigurato = Boolean(url && key)

export const supabase = supabaseConfigurato
  ? createClient(url!, key!)
  : null

// Tabelle previste:
//   sagra_edizioni       anno, numero, date, claim, pubblicata
//   sagra_eventi         giorno, ora, titolo, luogo, descrizione, categoria, pubblicato
//   sagra_sponsor        nome, logo_url, livello, sito, ordine
//   sagra_aggiornamenti  pubblicato_il, titolo, testo, in_evidenza
//   sagra_info           titolo, testo, ordine
// Schema completo con RLS e realtime: supabase/schema.sql
