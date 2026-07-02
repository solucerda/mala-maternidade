import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Blog',
  description: 'Dicas e informações sobre gravidez, parto e cuidados com o recém-nascido.',
};

export default async function BlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('titulo, slug, resumo, imagem_capa, created_at')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-8">Blog</h1>

      {(!posts || posts.length === 0) && (
        <p className="text-ink/60 text-sm">Nenhum artigo publicado ainda.</p>
      )}

      <div className="space-y-6">
        {(posts || []).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-card bg-white border border-plum/10 p-5 hover:border-plum/30 transition"
          >
            <p className="font-display text-xl text-plum-dark">{post.titulo}</p>
            {post.resumo && <p className="text-sm text-ink/70 mt-1">{post.resumo}</p>}
            <p className="text-xs text-ink/40 mt-2">
              {new Date(post.created_at).toLocaleDateString('pt-BR')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
