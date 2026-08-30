# sagra-ficodindia

Sito della Sagra della Mostarda e del Ficodindia di Militello in Val di Catania.
Destinazione: **sagra.calatinolab25.com**.

Cliente: Proloco di Militello. A cura di CalatinoLab25, ramo Comunicazione.
Documentazione, concept e decisioni: `../sagra-ficodindia-dati`.

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · React Router · Supabase · deploy Vercel.

## Comandi

```
npm install
npm run dev      # sviluppo
npm run build    # build di produzione
npm run preview  # anteprima della build
```

> **`npm install` va lanciato dal Terminale del Mac**, non dalla shell che Claude usa sul
> computer: quella è una VM Linux e installerebbe i binari nativi sbagliati (rolldown, oxc),
> con `npm run dev` che poi fallisce sul caricamento di `vite.config.ts`. Se succede:
> `rm -rf node_modules package-lock.json && npm install`.

## Struttura

```
src/
  data/edizione.ts    numero, date e claim dell'edizione — dati che non cambiano
  lib/supabase.ts     client Supabase e schema delle tabelle previste
  pages/              Home, Programma, Sponsor, Info, Aggiornamenti
  components/         Sezione, DaFare
  index.css           palette e font come token Tailwind v4
```

## Dati

Ci si appoggia al progetto **Supabase di CalatinoLab25**, non a un'istanza nuova.
Tabelle prefissate `sagra_`: `sagra_edizioni`, `sagra_eventi`, `sagra_sponsor`,
`sagra_aggiornamenti`. RLS: lettura pubblica sul pubblicato, scrittura agli autorizzati.

Variabili d'ambiente: copiare `.env.example` in `.env.local`.
**Nessuna chiave va committata**, né qui né nella cartella dati.

## Palette

Campionata dalla locandina della 33ª edizione (2025) e definita in `src/index.css`:
avorio `#F7F4EA`, antracite `#44403D`, verde cactus `#4B9A64`, verde scuro `#2A6C5F`,
magenta `#E165A1`, giallo `#F5D63B`, ocra `#DCAC0C`.
Da riconfermare quando il concept master 2026 è approvato.

## Stato

Impianto e navigazione in piedi, contenuti da caricare. Il sito non è ancora collegato
a Supabase né pubblicato. Backlog in `../sagra-ficodindia-dati/TASK/TASK_Sito_Sagra.md`.
