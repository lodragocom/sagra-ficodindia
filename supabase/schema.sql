-- Sagra della Mostarda e del Ficodindia — schema
-- Gira sul progetto Supabase di CalatinoLab25. Tutte le tabelle sono prefissate `sagra_`
-- per non confondersi con quelle di Energia e degli altri rami.

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

create table if not exists sagra_info (
  id           uuid primary key default gen_random_uuid(),
  edizione_id  uuid references sagra_edizioni(id) on delete cascade,
  titolo       text not null,   -- Come arrivare, Parcheggi, Dove dormire...
  testo        text not null,
  ordine       int not null default 0,
  pubblicato   boolean not null default false
);

-- RLS: il pubblico legge solo ciò che è pubblicato, scrive solo chi è autenticato.
alter table sagra_edizioni      enable row level security;
alter table sagra_eventi        enable row level security;
alter table sagra_sponsor       enable row level security;
alter table sagra_aggiornamenti enable row level security;
alter table sagra_info          enable row level security;

create policy "sagra_edizioni lettura pubblica"   on sagra_edizioni      for select using (attiva);
create policy "sagra_eventi lettura pubblica"     on sagra_eventi        for select using (pubblicato);
create policy "sagra_sponsor lettura pubblica"    on sagra_sponsor       for select using (pubblicato);
create policy "sagra_aggior lettura pubblica"     on sagra_aggiornamenti for select using (pubblicato);
create policy "sagra_info lettura pubblica"       on sagra_info          for select using (pubblicato);

create policy "sagra_edizioni scrittura"   on sagra_edizioni      for all to authenticated using (true) with check (true);
create policy "sagra_eventi scrittura"     on sagra_eventi        for all to authenticated using (true) with check (true);
create policy "sagra_sponsor scrittura"    on sagra_sponsor       for all to authenticated using (true) with check (true);
create policy "sagra_aggior scrittura"     on sagra_aggiornamenti for all to authenticated using (true) with check (true);
create policy "sagra_info scrittura"       on sagra_info          for all to authenticated using (true) with check (true);

-- Realtime: senza questo il sito non riceve i cambi mentre la pagina è aperta.
alter publication supabase_realtime add table sagra_eventi;
alter publication supabase_realtime add table sagra_aggiornamenti;
alter publication supabase_realtime add table sagra_sponsor;
alter publication supabase_realtime add table sagra_info;
alter publication supabase_realtime add table sagra_edizioni;
