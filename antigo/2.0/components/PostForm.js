'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PostForm({ postInicial }) {
  const [form, setForm] = useState({
    titulo: postInicial?.titulo || '',
    slug: postInicial?.slug || '',
    resumo: postInicial?.resumo || '',
    conteudo: postInicial?.conteudo || '',
    imagem_capa: postInicial?.imagem_capa || '',
    publicado: postInicial?.publicado ?? true,
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const supabase = createClient();

  function update(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function handleTituloChange(valor) {
    update('titulo', valor);
    if (!postInicial) update('slug', gerarSlug(valor));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const payload = { ...form, updated_at: new Date().toISOString() };
    const query = postInicial
      ? supabase.from('posts').update(payload).eq('id', postInicial.id)
      : supabase.from('posts').insert(payload);

    const { error } = await query;
    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input required value={form.titulo} onChange={(e) => handleTituloChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
        <input required value={form.slug} onChange={(e) => update('slug', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20 font-mono text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Resumo</label>
        <textarea value={form.resumo} onChange={(e) => update('resumo', e.target.value)} rows={2}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Conteúdo (aceita HTML simples: &lt;p&gt;, &lt;h2&gt;, &lt;a&gt;, &lt;strong&gt;)</label>
        <textarea required value={form.conteudo} onChange={(e) => update('conteudo', e.target.value)} rows={12}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20 font-mono text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagem de capa (URL, opcional)</label>
        <input type="url" value={form.imagem_capa} onChange={(e) => update('imagem_capa', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.publicado} onChange={(e) => update('publicado', e.target.checked)} />
        Publicado (visível no site)
      </label>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button type="submit" disabled={carregando}
        className="px-6 py-3 rounded-full bg-plum text-white font-medium hover:bg-plum-dark transition disabled:opacity-50">
        {carregando ? 'Salvando...' : 'Salvar post'}
      </button>
    </form>
  );
}
