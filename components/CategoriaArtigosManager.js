'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CategoriaArtigosManager({ categoriasPorMala, posts, relacoesIniciais }) {
  const [mala, setMala] = useState('bebe');
  const [categoria, setCategoria] = useState(categoriasPorMala.bebe[0] || '');
  const [postId, setPostId] = useState(posts[0]?.id || '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const supabase = createClient();

  function handleMalaChange(novaMala) {
    setMala(novaMala);
    setCategoria(categoriasPorMala[novaMala][0] || '');
  }

  async function handleAdicionar(e) {
    e.preventDefault();
    if (!categoria || !postId) return;
    setCarregando(true);
    setErro('');

    const { error } = await supabase
      .from('categoria_artigos')
      .insert({ mala, categoria, post_id: Number(postId) });

    setCarregando(false);

    if (error) {
      setErro(error.code === '23505' ? 'Esse artigo já está associado a essa categoria.' : error.message);
      return;
    }
    router.refresh();
  }

  async function handleRemover(id) {
    await supabase.from('categoria_artigos').delete().eq('id', id);
    router.refresh();
  }

  const relacoesPorGrupo = {};
  relacoesIniciais.forEach((r) => {
    const chave = `${r.mala}::${r.categoria}`;
    if (!relacoesPorGrupo[chave]) relacoesPorGrupo[chave] = [];
    relacoesPorGrupo[chave].push(r);
  });

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdicionar} className="card space-y-4">
        <p className="font-display text-lg text-plum-dark">Associar novo artigo</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mala</label>
            <select value={mala} onChange={(e) => handleMalaChange(e.target.value)} className="input-field">
              <option value="bebe">Mala do bebê</option>
              <option value="mae">Mala da mãe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-field">
              {categoriasPorMala[mala].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Artigo do blog</label>
          <select value={postId} onChange={(e) => setPostId(e.target.value)} className="input-field">
            {posts.length === 0 && <option value="">Nenhum post cadastrado ainda</option>}
            {posts.map((p) => (
              <option key={p.id} value={p.id}>{p.titulo}</option>
            ))}
          </select>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button type="submit" disabled={carregando || posts.length === 0} className="btn-primary disabled:opacity-50">
          {carregando ? 'Adicionando...' : 'Associar artigo'}
        </button>
      </form>

      <div>
        <p className="font-display text-lg text-plum-dark mb-3">Associações atuais</p>

        {Object.keys(relacoesPorGrupo).length === 0 && (
          <p className="text-ink/60 text-sm">Nenhuma associação criada ainda.</p>
        )}

        <div className="space-y-3">
          {Object.entries(relacoesPorGrupo).map(([chave, relacoes]) => {
            const [malaGrupo, categoriaGrupo] = chave.split('::');
            return (
              <div key={chave} className="card">
                <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">
                  {malaGrupo === 'bebe' ? 'Mala do bebê' : 'Mala da mãe'} · {categoriaGrupo}
                </p>
                <div className="space-y-1.5">
                  {relacoes.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-ink">{r.posts?.titulo || '(post removido)'}</span>
                      <button onClick={() => handleRemover(r.id)} className="text-xs text-red-600 underline shrink-0">
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
