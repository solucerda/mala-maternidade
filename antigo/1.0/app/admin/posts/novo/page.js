import PostForm from '@/components/PostForm';

export const metadata = { title: 'Novo post — admin' };

export default function NovoPostPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-6">Novo post</h1>
      <PostForm />
    </div>
  );
}
