import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import HeartsBackground from '@/components/HeartsBackground';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="relative overflow-hidden">
      <HeartsBackground />
      <div className="relative max-w-3xl mx-auto px-4 py-12">
        <h1 className="page-title mb-8">Blog</h1>

        {(!posts || posts.length === 0) && (
          <p className="text-ink/60 text-sm">Nenhum artigo publicado ainda.</p>
        )}

        <div className="space-y-4">
          {(posts || []).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card flex gap-4 hover:border-plum/30 transition overflow-hidden"
            >
              {post.imagem_capa && (
                <img
                  src={post.imagem_capa}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover shrink-0"
                />
              )}
              <div>
                <p className="font-display text-xl text-plum-dark">{post.titulo}</p>
                {post.resumo && <p className="text-sm text-ink/70 mt-1">{post.resumo}</p>}
                <p className="text-xs text-ink/40 mt-2">
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
