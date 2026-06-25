-- Dodaje polje featured_redoslijed na tabelu haljine
-- (zaseban redoslijed za slider na početnoj stranici, nezavisan od kataloškog `redoslijed`)
alter table haljine add column if not exists featured_redoslijed integer not null default 0;

-- Postavi početni redoslijed za već featured haljine prema postojećem `redoslijed`
with rang as (
  select id, row_number() over (order by redoslijed desc, created_at desc) as rn
  from haljine
  where featured = true and arhivirana = false
)
update haljine h
set featured_redoslijed = r.rn * 10
from rang r
where h.id = r.id;

create index if not exists idx_haljine_featured_redoslijed on haljine(featured_redoslijed);
