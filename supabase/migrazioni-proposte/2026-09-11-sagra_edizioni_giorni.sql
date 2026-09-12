-- PROPOSTA — NON APPLICATA. Attende il sì di L0.
-- Nome migrazione previsto: sagra_edizioni_giorni
-- Autore: Efesto · 2026-09-11
--
-- Problema: sagra_edizioni ha solo data_inizio/data_fine, cioè un intervallo
-- continuo. La 34ª edizione sono due fine settimana (9-10-11 e 16-17-18 ottobre
-- 2026): la riga sul database afferma dieci giorni consecutivi, che è falso.
-- Il sito lo aggira in presentazione (src/lib/orario.ts), il dato no.
--
-- Ambito: SOLO public.sagra_edizioni. Nessuna tabella di Energia toccata,
-- nessuna vista (il progetto non ne ha), nessuna funzione che cita 'sagra',
-- nessuna FK entrante. ADD COLUMN nullable senza default = metadata-only su
-- Postgres 11+: nessuna riscrittura di tabella, lock ACCESS EXCLUSIVE di
-- millisecondi su una tabella da 1 riga.
-- RLS invariata: la colonna eredita le policy della tabella.

begin;

alter table public.sagra_edizioni
  add column if not exists giorni date[];

comment on column public.sagra_edizioni.giorni is
  'Giorni effettivi di apertura, in ordine crescente. La Sagra non è un intervallo continuo: sono due fine settimana. data_inizio/data_fine restano come primo e ultimo giorno (ordinamento, filtri, "edizione corrente"); giorni è la verità sui giorni aperti. Se NULL, il consumatore ricade su data_inizio..data_fine.';

-- Backfill della sola edizione esistente (34/2026).
update public.sagra_edizioni
   set giorni = array['2026-10-09','2026-10-10','2026-10-11',
                      '2026-10-16','2026-10-17','2026-10-18']::date[]
 where anno = 2026 and numero = 34;

-- Coerenza: se giorni è valorizzato, deve essere ordinato e combaciare con gli estremi.
alter table public.sagra_edizioni
  add constraint sagra_edizioni_giorni_coerenti check (
    giorni is null or (
      array_length(giorni, 1) > 0
      and giorni[1] = data_inizio
      and giorni[array_length(giorni, 1)] = data_fine
    )
  );

commit;

-- Verifica dopo l'applicazione (deve restituire 6 giorni e t):
-- select anno, data_inizio, data_fine, giorni, array_length(giorni,1) = 6 from public.sagra_edizioni;
