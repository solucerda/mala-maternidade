-- ============================================================
-- Schema do site Mala da Maternidade
-- Rode este script inteiro no Supabase: SQL Editor > New query
-- ============================================================

-- Perfis de usuário (estende a tabela auth.users do Supabase)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  telefone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Usuária vê e edita o próprio perfil"
  on profiles for select using (auth.uid() = id);

create policy "Usuária atualiza o próprio perfil"
  on profiles for update using (auth.uid() = id);

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    coalesce(new.raw_user_meta_data->>'telefone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Itens do checklist (mala do bebê / mala da mãe)
create table if not exists items (
  id bigint generated always as identity primary key,
  mala text not null check (mala in ('bebe', 'mae')),
  categoria text not null,
  nome text not null,
  descricao text,
  link_afiliado text,
  imagem text,
  ordem integer not null default 0,
  created_at timestamp with time zone default now()
);

alter table items enable row level security;

create policy "Qualquer pessoa pode ver os itens"
  on items for select using (true);

create policy "Só admin pode inserir itens"
  on items for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode editar itens"
  on items for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode excluir itens"
  on items for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Status de cada item por usuária (o que já foi separado/comprado)
create table if not exists user_item_status (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id bigint references items on delete cascade not null,
  marcado boolean not null default false,
  updated_at timestamp with time zone default now(),
  unique (user_id, item_id)
);

alter table user_item_status enable row level security;

create policy "Usuária vê o próprio progresso"
  on user_item_status for select using (auth.uid() = user_id);

create policy "Usuária insere o próprio progresso"
  on user_item_status for insert with check (auth.uid() = user_id);

create policy "Usuária atualiza o próprio progresso"
  on user_item_status for update using (auth.uid() = user_id);

-- Posts do blog
create table if not exists posts (
  id bigint generated always as identity primary key,
  titulo text not null,
  slug text not null unique,
  resumo text,
  conteudo text not null,
  imagem_capa text,
  publicado boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table posts enable row level security;

create policy "Qualquer pessoa pode ver posts publicados"
  on posts for select using (publicado = true);

create policy "Admin vê todos os posts"
  on posts for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode inserir posts"
  on posts for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode editar posts"
  on posts for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Só admin pode excluir posts"
  on posts for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- Itens iniciais do checklist (baseados na sua lista original)
-- ============================================================
insert into items (mala, categoria, nome, descricao, ordem) values
('bebe', 'Higiene', 'Toalha de banho', 'Toalha macia própria para a pele sensível do recém-nascido.', 1),
('bebe', 'Higiene', 'Sabonete/shampoo neutro', 'Prefira produtos neutros e sem fragrância forte para recém-nascidos.', 2),
('bebe', 'Higiene', 'Cotonete', 'Uso externo apenas, com cuidado.', 3),
('bebe', 'Higiene', '1 pacote de fralda RN', 'Leve algumas unidades a mais do tamanho recém-nascido.', 4),
('bebe', 'Enxoval', '6 paninhos de boca', 'Úteis para golfadas e limpeza geral.', 5),
('bebe', 'Enxoval', 'Manta para forrar o berço', '', 6),
('bebe', '1ª troca', 'Conjunto body + mijão', '', 7),
('bebe', '1ª troca', 'Macacão', '', 8),
('bebe', '1ª troca', 'Par de meias', '', 9),
('mae', 'Higiene', 'Shampoo e condicionador', '', 1),
('mae', 'Higiene', 'Sabonete', '', 2),
('mae', 'Higiene', 'Creme de corpo', '', 3),
('mae', 'Pós-parto', 'Fralda pós-parto', '', 4),
('mae', 'Pós-parto', 'Absorvente cirúrgico', 'Pode ser gelado e usado à noite para aliviar o desconforto, mais indicado no parto normal.', 5),
('mae', 'Amamentação', '3 sutiãs de amamentação', '', 6),
('mae', 'Roupas', '3 camisolas', 'Se forem de amamentação, dispensam o uso de sutiã.', 7),
('mae', 'Roupas', 'Roupa para sair da maternidade', '', 8);
