import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Posts do blog — admin' };

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-plum-dark">Posts do blog</h1>
        <Link href="/admin/posts/novo" className="px-4 py-2 rounded-full bg-plum text-white text-sm font-medium hover:bg-plum-dark transition">
          + Novo post
        </Link>
      </div>

      <div className="space-y-2">
        {(posts || []).map((post) => (
          <div key={post.id} className="rounded-card bg-white border border-plum/10 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-ink/40">
                {post.publicado ? 'Publicado' : 'Rascunho'}
              </p>
              <p className="font-medium truncate">{post.titulo}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/admin/posts/${post.id}/editar`} className="text-sm text-plum underline">Editar</Link>
              <DeleteButton tabela="posts" id={post.id} />
            </div>
          </div>
        ))}

        {(!posts || posts.length === 0) && (
          <p className="text-ink/60 text-sm">Nenhum post cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
