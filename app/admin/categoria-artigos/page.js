import { createClient } from '@/lib/supabase/server';
import CategoriaArtigosManager from '@/components/CategoriaArtigosManager';

export const metadata = { title: 'Artigos por categoria — admin' };

export default async function CategoriaArtigosPage() {
  const supabase = createClient();

  const { data: items } = await supabase.from('items').select('mala, categoria').order('mala').order('categoria');
  const { data: posts } = await supabase.from('posts').select('id, titulo, slug').order('titulo');
  const { data: relacoes } = await supabase
    .from('categoria_artigos')
    .select('id, mala, categoria, post_id, posts(titulo, slug)')
    .order('mala')
    .order('categoria');

  // Categorias únicas por mala, na ordem em que aparecem
  const categoriasPorMala = { bebe: [], mae: [] };
  (items || []).forEach((i) => {
    if (!categoriasPorMala[i.mala].includes(i.categoria)) {
      categoriasPorMala[i.mala].push(i.categoria);
    }
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="page-title mb-2">Artigos por categoria</h1>
      <p className="page-subtitle mb-8">
        Associe artigos do blog a categorias do checklist. Elas aparecem como um ícone de livro
        clicável no cabeçalho da categoria correspondente.
      </p>

      <CategoriaArtigosManager
        categoriasPorMala={categoriasPorMala}
        posts={posts || []}
        relacoesIniciais={relacoes || []}
      />
    </div>
  );
}
