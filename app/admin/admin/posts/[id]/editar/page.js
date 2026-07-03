import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/PostForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Editar post — admin' };

export default async function EditarPostPage({ params }) {
  const supabase = createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', params.id).single();

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-6">Editar post</h1>
      <PostForm postInicial={post} />
    </div>
  );
}
