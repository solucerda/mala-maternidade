import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import HeartsBackground from '@/components/HeartsBackground';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('titulo, resumo')
    .eq('slug', params.slug)
    .single();

  if (!post) return {};
  return { title: post.titulo, description: post.resumo };
}

export default async function PostPage({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('publicado', true)
    .single();

  if (!post) notFound();

  return (
    <div className="relative overflow-hidden">
      <HeartsBackground />
      <article className="relative max-w-2xl mx-auto px-4 py-12">
        {post.imagem_capa && (
          <img
            src={post.imagem_capa}
            alt=""
            className="w-full h-56 sm:h-72 object-cover rounded-card mb-6"
          />
        )}
        <p className="text-xs text-ink/40 mb-2">
          {new Date(post.created_at).toLocaleDateString('pt-BR')}
        </p>
        <h1 className="page-title mb-6">{post.titulo}</h1>
        <div
          className="post-content prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />
      </article>
    </div>
  );
}