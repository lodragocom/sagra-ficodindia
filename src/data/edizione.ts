// Dati fissi dell'edizione. Restano qui finché non passano su Supabase:
// il programma e gli sponsor cambiano spesso, questi no.

export const edizione = {
  numero: 34,
  anno: 2026,
  nome: "Sagra della Mostarda e del Ficodindia",
  luogo: "Militello in Val di Catania",
  claim: "L'Ottava Meraviglia", // uso da approvare con la Proloco
  weekend: [
    { dal: "2026-10-09", al: "2026-10-11", etichetta: "9 · 10 · 11 ottobre" },
    { dal: "2026-10-16", al: "2026-10-18", etichetta: "16 · 17 · 18 ottobre" },
  ],
} as const

export const giorni = [
  "2026-10-09", "2026-10-10", "2026-10-11",
  "2026-10-16", "2026-10-17", "2026-10-18",
] as const
