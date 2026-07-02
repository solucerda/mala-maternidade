import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Painel administrativo' };

export default async function AdminPage() {
  const supabase = createClient();

  const { count: totalItens } = await supabase.from('items').select('*', { count: 'exact', head: true });
  const { count: totalPosts } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: totalUsuarias } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-8">Painel administrativo</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Metrica rotulo="Itens no checklist" valor={totalItens ?? 0} />
        <Metrica rotulo="Posts no blog" valor={totalPosts ?? 0} />
        <Metrica rotulo="Usuárias cadastradas" valor={totalUsuarias ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/itens" className="rounded-card bg-white border border-plum/10 p-6 hover:border-plum/30 transition">
          <p className="font-display text-lg text-plum-dark">Gerenciar itens do checklist</p>
          <p className="text-sm text-ink/60 mt-1">Adicione, edite ou remova itens e links de afiliado.</p>
        </Link>
        <Link href="/admin/posts" className="rounded-card bg-white border border-plum/10 p-6 hover:border-plum/30 transition">
          <p className="font-display text-lg text-plum-dark">Gerenciar posts do blog</p>
          <p className="text-sm text-ink/60 mt-1">Publique e edite artigos do blog.</p>
        </Link>
      </div>
    </div>
  );
}

function Metrica({ rotulo, valor }) {
  return (
    <div className="rounded-card bg-white border border-plum/10 p-4 text-center">
      <p className="font-display text-2xl text-plum-dark">{valor}</p>
      <p className="text-xs text-ink/60">{rotulo}</p>
    </div>
  );
}
