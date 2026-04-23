alter table public.productos
add column if not exists tipo_cultivo text;

update public.productos
set tipo_cultivo = 'invernaculo'
where tipo_cultivo is null
   or btrim(tipo_cultivo) = '';

update public.productos
set tipo_cultivo = 'invernaculo'
where lower(btrim(tipo_cultivo)) in ('indoor', 'indor', 'invernáculo');

update public.productos
set tipo_cultivo = 'exterior'
where lower(btrim(tipo_cultivo)) = 'exterior';

alter table public.productos
alter column tipo_cultivo set default 'invernaculo';

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'productos_tipo_cultivo_check'
    ) then
        alter table public.productos
        add constraint productos_tipo_cultivo_check
        check (tipo_cultivo in ('invernaculo', 'exterior'));
    end if;
end $$;
