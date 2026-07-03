-- ============================================================
-- Adiciona campos de conteúdo rico aos itens do checklist
-- Rode isso no SQL Editor do Supabase
-- ============================================================

alter table items
  add column if not exists selo text check (selo in ('essencial','recomendado','depende','opcional')),
  add column if not exists para_que_serve text,
  add column if not exists quantidade text,
  add column if not exists como_escolher text,
  add column if not exists dica_extra text,
  add column if not exists vale_a_pena text,
  add column if not exists perguntas_frequentes text,
  add column if not exists link_amazon text,
  add column if not exists link_mercado_livre text,
  add column if not exists link_shopee text;

-- ------------------------------------------------------------
-- Exemplos preenchidos (edite/copie o padrão pelos outros itens
-- direto no painel /admin/itens)
-- ------------------------------------------------------------

update items set
  selo = 'essencial',
  para_que_serve = 'Depois do banho, o bebê perde calor rapidamente. Uma toalha macia ajuda a manter a temperatura corporal enquanto você o veste.',
  quantidade = '1 a 2 unidades',
  como_escolher = '100% algodão
Com capuz
Tecido macio, sem costuras ásperas
Boa absorção de água',
  dica_extra = 'Prefira toalhas com capuz — ajuda a manter a cabecinha aquecida logo após o banho.'
where nome = 'Toalha de banho' and mala = 'bebe';

update items set
  selo = 'recomendado',
  para_que_serve = 'Protege a pele contra assaduras causadas pelo contato prolongado com fralda suja ou úmida.',
  vale_a_pena = 'Muitas famílias usam de forma preventiva a cada troca, mas outras preferem aplicar só quando a pele já está irritada. Não existe uma regra única — funciona bem das duas formas.',
  perguntas_frequentes = 'Preciso usar em toda troca?
Não necessariamente. Muita gente só usa quando percebe vermelhidão.

Pode usar em recém-nascido?
Sim, mas verifique se a fórmula é indicada para a idade na embalagem.'
where nome = 'Pomada de assadura' and mala = 'bebe';

update items set
  selo = 'opcional',
  para_que_serve = 'Tradicionalmente usado para higienizar o coto umbilical do recém-nascido.',
  vale_a_pena = 'Hoje muitos hospitais e pediatras não recomendam mais o uso rotineiro de álcool no coto umbilical — há evidências de que ele pode atrasar a cicatrização. Antes de comprar, confirme a orientação da sua maternidade e do pediatra.',
  perguntas_frequentes = 'O hospital vai pedir mesmo assim?
Alguns ainda pedem por protocolo interno — vale levar 1 vidrinho pequeno só por precaução, mesmo sem uso previsto.'
where nome = '1 vidrinho de álcool 70%' and mala = 'bebe';
