-- Sagra della Mostarda e del Ficodindia — schema
-- Gira sul progetto Supabase di CalatinoLab25 (ref ktcsnwyngukqbhbkgjea).
-- Tutte le tabelle sono prefissate `sagra_` per non confondersi con quelle di Energia
-- e degli altri rami.
--
-- Stato al 2026-09-11 (verificato contro il database, non a memoria).
-- Migrazioni applicate che questo file riflette:
--   20260830210555  sagra_ficodindia_schema      (le cinque tabelle + RLS + realtime)
--   20260831233121  sagra_passaggi_evoluzione    (sagra_passaggi + bucket `sagra`)
-- Questo file è la copia di riferimento: se si modifica, si riapplica come nuova
-- migrazione e si riporta qui il nome. Chi aggiunge una tabella sul database e non
-- la scrive qui rompe il file per chi arriva dopo: è successo con sagra_passaggi,
-- rimasta fuori da questo schema per undici giorni.

create table if not exists sagra_edizioni (
  id          uuid primary key default gen_random_uuid(),
  numero      int  not null,
  anno        int  not null unique,
  nome        text not null default 'Sagra della Mostarda e del Ficodindia',
  luogo       text not null default 'Militello in Val di Catania',
  claim       text,
  data_inizio date not null,
  data_fine   date not null,
  attiva      boolean not null default false,
  creata_il   timestamptz not null default now()
);

create table if not exists sagra_eventi (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  giorno       date not null,
  ora_inizio   time,
  ora_fine     time,
  titolo       text not null,
  luogo        text,
  descrizione  text,
  categoria    text,            -- spettacolo, degustazione, mostra, gara, religioso...
  pubblicato   boolean not null default false,
  ordine       int not null default 0
);
create index if not exists sagra_eventi_giorno_idx on sagra_eventi (giorno, ora_inizio);

create table if not exists sagra_sponsor (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  nome         text not null,
  logo_url     text,
  sito         text,
  livello      text not null default 'sostenitore',  -- patrocinio, principale, sostenitore
  ordine       int not null default 0,
  pubblicato   boolean not null default false
);

create table if not exists sagra_aggiornamenti (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  pubblicato_il timestamptz not null default now(),
  titolo       text not null,
  testo        text,
  in_evidenza  boolean not null default false,
  pubblicato   boolean not null default false
);
create index if not exists sagra_aggiornamenti_data_idx on sagra_aggiornamenti (pubblicato_il desc);

create table if not exists sagra_info (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  titolo       text not null,   -- Come arrivare, Parcheggi, Dove dormire...
  testo        text not null,
  ordine       int not null default 0,
  pubblicato   boolean not null default false
);

-- I passaggi dell'evoluzione della locandina: quello che il sito mostra in /progetto.
-- Ogni riga è uno stadio del lavoro, fatto o ancora da fare.
create table if not exists sagra_passaggi (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  ordine       int  not null default 0,
  titolo       text not null,
  testo        text,
  immagine_url text,           -- URL assoluto (storage) oppure percorso interno (/passaggi/...)
  didascalia   text,
  stato        text not null default 'da fare' check (stato in ('fatto','in corso','da fare')),
  data         date,
  pubblicato   boolean not null default false
);
create index if not exists sagra_passaggi_ordine_idx on sagra_passaggi (ordine);

-- RLS: il pubblico legge solo ciò che è pubblicato, scrive solo chi è autenticato.
alter table sagra_edizioni      enable row level security;
alter table sagra_eventi        enable row level security;
alter table sagra_sponsor       enable row level security;
alter table sagra_aggiornamenti enable row level security;
alter table sagra_info          enable row level security;
alter table sagra_passaggi      enable row level security;

create policy "sagra_edizioni lettura pubblica"   on sagra_edizioni      for select using (attiva);
create policy "sagra_eventi lettura pubblica"     on sagra_eventi        for select using (pubblicato);
create policy "sagra_sponsor lettura pubblica"    on sagra_sponsor       for select using (pubblicato);
create policy "sagra_aggiornamenti lettura pubblica" on sagra_aggiornamenti for select using (pubblicato);
create policy "sagra_info lettura pubblica"       on sagra_info          for select using (pubblicato);
create policy "sagra_passaggi lettura pubblica"   on sagra_passaggi      for select using (pubblicato);

-- Scrittura: SOLO admin e moderator, tramite la funzione has_role() che esiste già sul
-- progetto. Non "authenticated": su questo Supabase si registrano anche i lead dell'energia,
-- e un lead registrato non deve poter toccare il programma della Sagra.
-- Alla Proloco si assegna il ruolo `moderator` in public.user_roles.

create policy "sagra_edizioni gestione" on sagra_edizioni for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create policy "sagra_eventi gestione" on sagra_eventi for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create policy "sagra_sponsor gestione" on sagra_sponsor for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create policy "sagra_aggiornamenti gestione" on sagra_aggiornamenti for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create policy "sagra_info gestione" on sagra_info for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

create policy "sagra_passaggi gestione" on sagra_passaggi for all to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator'));

-- Spazio immagini pubblico dei passaggi. Lettura aperta, scrittura ad admin e moderator.
insert into storage.buckets (id, name, public)
values ('sagra', 'sagra', true)
on conflict (id) do nothing;

create policy "sagra storage lettura pubblica" on storage.objects
  for select using (bucket_id = 'sagra');

create policy "sagra storage scrittura" on storage.objects for all to authenticated
  using (bucket_id = 'sagra' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')))
  with check (bucket_id = 'sagra' and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'moderator')));

-- Realtime: senza questo il sito non riceve i cambi mentre la pagina è aperta.
alter publication supabase_realtime add table sagra_eventi;
alter publication supabase_realtime add table sagra_aggiornamenti;
alter publication supabase_realtime add table sagra_sponsor;
alter publication supabase_realtime add table sagra_info;
alter publication supabase_realtime add table sagra_edizioni;
alter publication supabase_realtime add table sagra_passaggi;
