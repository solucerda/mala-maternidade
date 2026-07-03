-- ============================================================
-- Tabela que relaciona categorias do checklist com artigos do blog
-- Rode no SQL Editor do Supabase
-- ============================================================

create table if not exists categoria_artigos (
  id bigint generated always as identity primary key,
  mala text not null check (mala in ('bebe','mae')),
  categoria text not null,
  post_id bigint references posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (mala, categoria, post_id)
);

alter table categoria_artigos enable row level security;

create policy "Qualquer pessoa pode ver as relações"
  on categoria_artigos for select using (true);

create policy "Só admin pode inserir relações"
  on categoria_artigos for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode excluir relações"
  on categoria_artigos for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
