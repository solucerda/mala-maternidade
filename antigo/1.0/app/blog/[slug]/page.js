import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('titulo, resumo')
    .eq('slug', params.slug)
    .single();

  if (!post) return {};
  return {
    title: post.titulo,
    description: post.resumo,
  };
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
    <article className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs text-ink/40 mb-2">
        {new Date(post.created_at).toLocaleDateString('pt-BR')}
      </p>
      <h1 className="font-display text-3xl text-plum-dark mb-6">{post.titulo}</h1>
      <div
        className="prose prose-sm max-w-none text-ink/80 leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: post.conteudo }}
      />
    </article>
  );
}
