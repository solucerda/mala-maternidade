import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ChecklistList from '@/components/ChecklistList';
import HeartsBackground from '@/components/HeartsBackground';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONFIG = {
  bebe: {
    titulo: 'Mala do bebê',
    descricao: 'Tudo que o recém-nascido vai precisar nos primeiros dias.',
    errosComuns: [
      'Comprar roupas de tamanho RN demais — o bebê cresce rápido nas primeiras semanas',
      'Esquecer os documentos (RG, comprovante de residência, carteirinha do convênio)',
      'Levar produtos de higiene em excesso que não serão usados',
      'Não separar os kits de troca com antecedência',
      'Não confirmar com a maternidade quais itens ela já fornece',
    ],
  },
  mae: {
    titulo: 'Mala da mãe',
    descricao: 'Conforto e cuidado pra você durante a internação.',
    errosComuns: [
      'Levar maquiagem e itens de beleza em excesso',
      'Esquecer roupas confortáveis e adequadas pra amamentação',
      'Não confirmar quais itens de higiene o hospital já fornece',
      'Esquecer a roupa de saída — o corpo ainda estará com a barriga',
      'Deixar pra montar a mala em cima da hora',
    ],
  },
};

export async function generateMetadata({ params }) {
  const info = CONFIG[params.mala];
  if (!info) return {};
  return { title: info.titulo, description: info.descricao };
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

  const { data: ordemCategorias } = await supabase
    .from('categoria_ordem')
    .select('categoria, ordem, cor')
    .eq('mala', params.mala);

  const ordemMap = Object.fromEntries((ordemCategorias || []).map((o) => [o.categoria, o.ordem]));
  const coresPorCategoria = Object.fromEntries((ordemCategorias || []).map((o) => [o.categoria, o.cor]));
  categorias.sort((a, b) => {
    const oa = ordemMap[a] ?? Infinity;
    const ob = ordemMap[b] ?? Infinity;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });

  const { data: relacoesArtigos } = await supabase
    .from('categoria_artigos')
    .select('categoria, posts(titulo, slug)')
    .eq('mala', params.mala);

  const artigosPorCategoria = {};
  (relacoesArtigos || []).forEach((r) => {
    if (!r.posts) return;
    if (!artigosPorCategoria[r.categoria]) artigosPorCategoria[r.categoria] = [];
    artigosPorCategoria[r.categoria].push({ titulo: r.posts.titulo, slug: r.posts.slug });
  });

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeartsBackground />
        <div className="relative max-w-3xl mx-auto px-4 pt-12 pb-10">
          <h1 className="page-title">{info.titulo}</h1>
          <p className="page-subtitle">{info.descricao}</p>

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
            artigosPorCategoria={artigosPorCategoria}
            coresPorCategoria={coresPorCategoria}
          />

          <div className="card mt-4 bg-rose-light/40 border-rose/20">
            <p className="font-display text-lg text-plum-dark mb-3">❌ Erros mais comuns</p>
            <ul className="space-y-2">
              {info.errosComuns.map((erro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/70">
                  <span className="text-rose mt-0.5">•</span> {erro}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}