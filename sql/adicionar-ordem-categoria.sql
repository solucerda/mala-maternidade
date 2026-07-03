-- ============================================================
-- Tabela que controla a ordem de exibição das categorias
-- Rode no SQL Editor do Supabase
-- ============================================================

create table if not exists categoria_ordem (
  id bigint generated always as identity primary key,
  mala text not null check (mala in ('bebe','mae')),
  categoria text not null,
  ordem integer not null default 0,
  cor text,
  unique (mala, categoria)
);

-- Garante a coluna cor mesmo se a tabela já tiver sido criada antes
alter table categoria_ordem add column if not exists cor text;

alter table categoria_ordem enable row level security;

create policy "Qualquer pessoa pode ver a ordem"
  on categoria_ordem for select using (true);

create policy "Só admin pode inserir ordem"
  on categoria_ordem for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode atualizar ordem"
  on categoria_ordem for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode excluir ordem"
  on categoria_ordem for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Preenche a ordem inicial das categorias que já existem, na ordem em que já apareciam
insert into categoria_ordem (mala, categoria, ordem)
select mala, categoria, row_number() over (partition by mala order by min(ordem), categoria)
from items
group by mala, categoria
on conflict (mala, categoria) do nothing;
