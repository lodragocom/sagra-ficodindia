-- Rollback di sagra_edizioni_giorni. Non perde nulla: data_inizio e data_fine
-- non sono mai stati toccati, e i sei giorni restano scritti in
-- src/data/edizione.ts (giorniDiRiserva) e in sagra_eventi quando sarà popolata.
-- Va eseguito PRIMA di ripristinare il frontend, oppure con un frontend che
-- legge `giorni` in modo opzionale (vedi nota di sequenza nel rapporto).

begin;
alter table public.sagra_edizioni drop constraint if exists sagra_edizioni_giorni_coerenti;
alter table public.sagra_edizioni drop column if exists giorni;
commit;
