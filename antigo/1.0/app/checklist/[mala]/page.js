import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ChecklistList from '@/components/ChecklistList';

const CONFIG = {
  bebe: { titulo: 'Mala do bebê', cor: 'sage', descricao: 'Tudo que o recém-nascido vai precisar nos primeiros dias.' },
  mae: { titulo: 'Mala da mãe', cor: 'rose', descricao: 'Conforto e cuidado pra você durante a internação.' },
};

export async function generateMetadata({ params }) {
  const info = CONFIG[params.mala];
  if (!info) return {};
  return {
    title: info.titulo,
    description: info.descricao,
  };
}

export default async function ChecklistPage({ params }) {
  const info = CONFIG[params.mala];
  if (!info) notFound();

  const supabase = createClient();

const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('mala', params.mala)
    .order('categoria')
    .order('ordem');

  if (itemsError) {
    console.error('[Supabase] Erro ao buscar itens:', itemsError.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let statusMap = {};
  if (user) {
    const { data: status } = await supabase
      .from('user_item_status')
      .select('item_id, marcado')
      .eq('user_id', user.id);
    statusMap = Object.fromEntries((status || []).map((s) => [s.item_id, s.marcado]));
  }

  const categorias = [...new Set((items || []).map((i) => i.categoria))];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-semibold text-plum-dark">{info.titulo}</h1>
      <p className="text-ink/70 mt-1">{info.descricao}</p>

      {!user && (
        <div className="mt-4 rounded-card bg-marigold/15 border border-marigold/30 px-4 py-3 text-sm">
          Você está vendo a lista sem cadastro. <a href="/cadastro" className="underline font-medium">Crie uma conta grátis</a> pra marcar os itens e salvar seu progresso.
        </div>
      )}

      <ChecklistList
        items={items || []}
        categorias={categorias}
        statusInicial={statusMap}
        logada={!!user}
      />
    </div>
  );
}
