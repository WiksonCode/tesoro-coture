-- ============================================================
-- TESORO Couture — Schema v2
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type uloga_enum as enum ('korisnik', 'admin');
create type stanje_enum as enum ('nova', 'odlicna', 'dobra', 'ostecena');
create type velicina_enum as enum ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'po_mjeri');
create type status_enum as enum ('na_cekanju', 'potvrdjena', 'otkazana', 'realizovana');
create type akcija_enum as enum ('INSERT', 'UPDATE', 'DELETE');

-- ============================================================
-- TABELA: kategorije
-- ============================================================

create table kategorije (
  id          uuid primary key default uuid_generate_v4(),
  slug        varchar(100) not null unique,
  naziv_sr    varchar(100) not null,
  naziv_en    varchar(100),
  redosled    smallint not null default 0,
  created_at  timestamp with time zone default now()
);

-- Početne kategorije
insert into kategorije (slug, naziv_sr, naziv_en, redosled) values
  ('vjencana',  'Vjenčana',  'Wedding',   1),
  ('maturska',  'Maturska',  'Prom',      2),
  ('koktel',    'Koktel',    'Cocktail',  3),
  ('svecana',   'Svečana',   'Formal',    4),
  ('casual',    'Casual',    'Casual',    5);

-- ============================================================
-- TABELA: korisnici
-- ============================================================

create table korisnici (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  ime         varchar(100) not null,
  prezime     varchar(100) not null,
  email       varchar(255) not null unique,
  telefon     varchar(30),
  uloga       uloga_enum not null default 'korisnik',
  created_at  timestamp with time zone default now()
);

-- ============================================================
-- TABELA: haljine (modeli/dizajni)
-- ============================================================

create table haljine (
  id          uuid primary key default uuid_generate_v4(),
  slug        varchar(255) not null unique,
  naziv_sr    varchar(255) not null,
  naziv_en    varchar(255),
  opis_sr     text,
  opis_en     text,
  kategorija_id uuid not null references kategorije(id) on delete restrict,
  slike       json not null default '[]',
  video_url   varchar(500),
  featured    boolean not null default false,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- ============================================================
-- TABELA: inventar (fizicke instance haljina)
-- ============================================================

create table inventar (
  id          uuid primary key default uuid_generate_v4(),
  sifra       varchar(50) not null unique,
  haljina_id  uuid not null references haljine(id) on delete restrict,
  boja_naziv  varchar(100) not null,
  boja_hex    varchar(7) not null,
  velicina    velicina_enum not null,
  cijena_rsd  decimal(10, 2) not null,
  cijena_eur  decimal(10, 2) not null,
  stanje      stanje_enum not null default 'nova',
  dostupna    boolean not null default true,
  napomena    text,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- ============================================================
-- TABELA: rezervacije
-- ============================================================

create table rezervacije (
  id              uuid primary key default uuid_generate_v4(),
  inventar_id     uuid not null references inventar(id) on delete restrict,
  korisnik_id     uuid references korisnici(id) on delete set null,
  ime             varchar(100) not null,
  prezime         varchar(100) not null,
  telefon         varchar(30) not null,
  email           varchar(255) not null,
  datum_termina   date not null,
  status          status_enum not null default 'na_cekanju',
  napomena        text,
  created_at      timestamp with time zone default now(),
  updated_at      timestamp with time zone default now()
);

-- ============================================================
-- TABELA: audit_log
-- ============================================================

create table audit_log (
  id            uuid primary key default uuid_generate_v4(),
  tabela        varchar(100) not null,
  zapis_id      uuid not null,
  akcija        akcija_enum not null,
  stari_podaci  json,
  novi_podaci   json,
  korisnik_id   uuid references korisnici(id) on delete set null,
  created_at    timestamp with time zone default now()
);

-- ============================================================
-- TRIGGER: updated_at automatski
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_haljine_updated_at
  before update on haljine
  for each row execute function set_updated_at();

create trigger trg_inventar_updated_at
  before update on inventar
  for each row execute function set_updated_at();

create trigger trg_rezervacije_updated_at
  before update on rezervacije
  for each row execute function set_updated_at();

-- ============================================================
-- TRIGGER: inventar.dostupna prati status rezervacije
-- Potvrdjena  → dostupna = false
-- Otkazana    → dostupna = true
-- Realizovana → dostupna = false (prodata, van opticaja)
-- ============================================================

create or replace function sync_inventar_dostupnost()
returns trigger as $$
begin
  if new.status = 'potvrdjena' then
    update inventar set dostupna = false where id = new.inventar_id;

  elsif new.status = 'otkazana' then
    -- vrati dostupnost samo ako nema druge aktivne rezervacije
    if not exists (
      select 1 from rezervacije
      where inventar_id = new.inventar_id
        and id <> new.id
        and status in ('na_cekanju', 'potvrdjena')
    ) then
      update inventar set dostupna = true where id = new.inventar_id;
    end if;

  elsif new.status = 'realizovana' then
    update inventar set dostupna = false where id = new.inventar_id;

  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_rezervacija_dostupnost
  after insert or update of status on rezervacije
  for each row execute function sync_inventar_dostupnost();

-- ============================================================
-- TRIGGER: audit_log za sve kljucne tabele
-- ============================================================

create or replace function log_audit()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    insert into audit_log (tabela, zapis_id, akcija, stari_podaci, novi_podaci)
    values (TG_TABLE_NAME, new.id, 'INSERT', null, row_to_json(new));

  elsif TG_OP = 'UPDATE' then
    insert into audit_log (tabela, zapis_id, akcija, stari_podaci, novi_podaci)
    values (TG_TABLE_NAME, new.id, 'UPDATE', row_to_json(old), row_to_json(new));

  elsif TG_OP = 'DELETE' then
    insert into audit_log (tabela, zapis_id, akcija, stari_podaci, novi_podaci)
    values (TG_TABLE_NAME, old.id, 'DELETE', row_to_json(old), null);

  end if;

  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger trg_audit_haljine
  after insert or update or delete on haljine
  for each row execute function log_audit();

create trigger trg_audit_inventar
  after insert or update or delete on inventar
  for each row execute function log_audit();

create trigger trg_audit_rezervacije
  after insert or update or delete on rezervacije
  for each row execute function log_audit();

create trigger trg_audit_korisnici
  after insert or update or delete on korisnici
  for each row execute function log_audit();

create trigger trg_audit_kategorije
  after insert or update or delete on kategorije
  for each row execute function log_audit();

-- ============================================================
-- INDEKSI za performanse
-- ============================================================

create index idx_haljine_kategorija_id on haljine(kategorija_id);
create index idx_kategorije_redosled on kategorije(redosled);
create index idx_inventar_haljina_id on inventar(haljina_id);
create index idx_inventar_dostupna on inventar(dostupna);
create index idx_rezervacije_inventar_id on rezervacije(inventar_id);
create index idx_rezervacije_korisnik_id on rezervacije(korisnik_id);
create index idx_rezervacije_status on rezervacije(status);
create index idx_rezervacije_datum on rezervacije(datum_termina);
create index idx_audit_log_tabela_zapis on audit_log(tabela, zapis_id);
create index idx_audit_log_created_at on audit_log(created_at desc);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table kategorije enable row level security;
alter table korisnici enable row level security;
alter table haljine enable row level security;
alter table inventar enable row level security;
alter table rezervacije enable row level security;
alter table audit_log enable row level security;

-- Kategorije, haljine i inventar — javno citanje
create policy "kategorije_public_read" on kategorije
  for select using (true);

create policy "haljine_public_read" on haljine
  for select using (true);

create policy "inventar_public_read" on inventar
  for select using (true);

-- Korisnici vide samo svoj profil
create policy "korisnici_own_read" on korisnici
  for select using (auth.uid() = auth_id);

create policy "korisnici_own_update" on korisnici
  for update using (auth.uid() = auth_id);

-- Rezervacije — korisnik vidi samo svoje
create policy "rezervacije_own_read" on rezervacije
  for select using (
    korisnik_id in (select id from korisnici where auth_id = auth.uid())
  );

create policy "rezervacije_insert" on rezervacije
  for insert with check (true);

-- Audit log — samo admin (upravljati kroz service_role)
create policy "audit_log_admin_only" on audit_log
  for select using (
    exists (
      select 1 from korisnici
      where auth_id = auth.uid() and uloga = 'admin'
    )
  );
