export type Edizione = {
  id: string
  numero: number
  anno: number
  nome: string
  luogo: string
  claim: string | null
  data_inizio: string
  data_fine: string
  attiva: boolean
}

export type Evento = {
  id: string
  giorno: string
  ora_inizio: string | null
  ora_fine: string | null
  titolo: string
  luogo: string | null
  descrizione: string | null
  categoria: string | null
  pubblicato: boolean
  ordine: number
}

export type Sponsor = {
  id: string
  nome: string
  logo_url: string | null
  sito: string | null
  livello: string
  ordine: number
  pubblicato: boolean
}

export type Aggiornamento = {
  id: string
  pubblicato_il: string
  titolo: string
  testo: string | null
  in_evidenza: boolean
  pubblicato: boolean
}

export type Info = {
  id: string
  titolo: string
  testo: string
  ordine: number
  pubblicato: boolean
}

export type StatoPassaggio = 'fatto' | 'in corso' | 'da fare'

export type Passaggio = {
  id: string
  ordine: number
  titolo: string
  testo: string | null
  immagine_url: string | null
  didascalia: string | null
  stato: StatoPassaggio
  data: string | null
  pubblicato: boolean
}
