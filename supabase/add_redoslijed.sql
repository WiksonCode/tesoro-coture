-- Dodaje polje redoslijed na tabelu haljine
alter table haljine add column if not exists redoslijed integer not null default 0;

-- Postavi početni redoslijed prema created_at (najstarije = 1, najnovije = N)
with ranked as (
  select id, row_number() over (order by created_at asc) as rn
  from haljine
  where not arhivirana
)
update haljine h
set redoslijed = r.rn * 10
from ranked r
where h.id = r.id;

create index if not exists idx_haljine_redoslijed on haljine(redoslijed);
