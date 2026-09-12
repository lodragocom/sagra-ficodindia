-- Riallineamento di `sagra_passaggi` alla realtà del 11/09/2026.
-- Deciso da Etna (capo progetto) sulla base del giudizio di prestampa di Atena
-- (`sagra-ficodindia-dati/AGGIORNAMENTO_AGENTI/RAPPORTI/2026-09-11-atena-giudizio-prestampa-v5.md`)
-- e del rilievo di Talos sullo stato pubblicato.
--
-- Perché. Le righe 7 e 8 erano `fatto` **e pubblicate**: il sito raccontava come chiuso
-- un passaggio aperto. Il QR della riga 8 non esiste nella v5 — è il primo dei tre
-- bloccanti di stampa. La "composizione definitiva" della riga 7 non è definitiva:
-- la base col Castello è una scelta di merito ancora aperta, il formato non è A3,
-- il claim è fuori asse e rotte e aerei sono rientrati dopo essere stati tolti.
--
-- Non si toglie `pubblicato`: il componente `Tappa` mostra il badge "in lavorazione"
-- per ogni riga con `stato <> 'fatto'`, quindi la pagina dice il vero senza buchi
-- nella narrazione. Nascondere le righe avrebbe sostituito una bugia con un silenzio.
--
-- Da riapplicare all'indietro solo quando il file di stampa è consegnato: allora
-- le righe 7, 8 e 9 tornano `fatto` con la data vera della consegna.

begin;

-- Riga 7 — la data e la parola "definitiva" erano le due cose che, in pubblico,
-- dichiaravano una chiusura che non c'è. Via entrambe.
update sagra_passaggi
   set stato  = 'in corso',
       data   = null,
       titolo = 'La composizione esecutiva'
 where ordine = 7;

-- Riga 8 — il QR non esiste e la raccolta loghi sponsor chiude il 15/09.
update sagra_passaggi
   set stato = 'in corso'
 where ordine = 8;

commit;

-- Verifica:
-- select ordine, titolo, stato, data, pubblicato from sagra_passaggi order by ordine;
-- Atteso in pubblico (pubblicato = true): 1,3,4,5,6 `fatto` · 7,8 `in corso` · 9 `da fare`.
