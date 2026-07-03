'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import DeleteButton from '@/components/DeleteButton';
import { resolverCorHex } from '@/lib/coresCategoria';

const NOME_MALA = { bebe: 'Mala do bebê', mae: 'Mala da mãe' };

// Cor aleatória mas com saturação/luminosidade controladas, pra combinar com a identidade do site
function corAleatoria() {
  const h = Math.floor(Math.random() * 360);
  const s = 45 + Math.floor(Math.random() * 20); // 45–65%
  const l = 42 + Math.floor(Math.random() * 14); // 42–56%
  return hslParaHex(h, s, l);
}

function hslParaHex(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function AdminItemsManager({ itemsIniciais, ordemIniciais }) {
  const [categoriasAbertas, setCategoriasAbertas] = useState(new Set());
  const [painelEditAberto, setPainelEditAberto] = useState(new Set());
  const [nomeEditando, setNomeEditando] = useState({});
  const [coresLocais, setCoresLocais] = useState({});
  const [ocupado, setOcupado] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function toggle(chave) {
    setCategoriasAbertas((prev) => {
      const novo = new Set(prev);
      if (novo.has(chave)) novo.delete(chave);
      else novo.add(chave);
      return novo;
    });
  }

  function togglePainel(chave, categoria) {
    setPainelEditAberto((prev) => {
      const novo = new Set(prev);
      if (novo.has(chave)) {
        novo.delete(chave);
      } else {
        novo.add(chave);
        setNomeEditando((n) => ({ ...n, [chave]: categoria }));
      }
      return novo;
    });
  }

  // Agrupa itens: { bebe: { 'Higiene': [items...], ... }, mae: {...} }
  const grupos = { bebe: {}, mae: {} };
  itemsIniciais.forEach((item) => {
    if (!grupos[item.mala][item.categoria]) grupos[item.mala][item.categoria] = [];
    grupos[item.mala][item.categoria].push(item);
  });

  // Mapa de ordem e cor: { 'bebe::Higiene': { ordem: 2, cor: '#7C9885' }, ... }
  const infoMap = {};
  ordemIniciais.forEach((o) => {
    infoMap[`${o.mala}::${o.categoria}`] = { ordem: o.ordem, cor: o.cor };
  });
  const ordemMap = Object.fromEntries(Object.entries(infoMap).map(([k, v]) => [k, v.ordem]));

  function categoriasOrdenadas(mala) {
    const doItens = Object.keys(grupos[mala]);
    const doOrdem = ordemIniciais.filter((o) => o.mala === mala).map((o) => o.categoria);
    const todas = [...new Set([...doItens, ...doOrdem])];

    return todas.sort((a, b) => {
      const oa = ordemMap[`${mala}::${a}`] ?? Infinity;
      const ob = ordemMap[`${mala}::${b}`] ?? Infinity;
      if (oa !== ob) return oa - ob;
      return a.localeCompare(b);
    });
  }

  async function novaCategoria(mala) {
    const nome = window.prompt(
      `Nome da nova categoria em "${NOME_MALA[mala]}" (ex: Higiene, 1ª troca):`
    );
    if (!nome || !nome.trim()) return;
    const categoria = nome.trim();

    const ordensDaMala = ordemIniciais.filter((o) => o.mala === mala).map((o) => o.ordem);
    const proximaOrdem = ordensDaMala.length ? Math.max(...ordensDaMala) + 1 : 1;

    setOcupado(true);
    const { error } = await supabase.from('categoria_ordem').upsert(
      { mala, categoria, ordem: proximaOrdem },
      { onConflict: 'mala,categoria' }
    );
    setOcupado(false);

    if (error) {
      alert(`Não foi possível criar a categoria: ${error.message}`);
      return;
    }
    router.refresh();
  }

  async function salvarNome(mala, categoriaAtual, chave) {
    const novoNome = (nomeEditando[chave] || '').trim();
    if (!novoNome || novoNome === categoriaAtual) return;

    setOcupado(true);
    await supabase.from('items').update({ categoria: novoNome }).eq('mala', mala).eq('categoria', categoriaAtual);
    await supabase.from('categoria_artigos').update({ categoria: novoNome }).eq('mala', mala).eq('categoria', categoriaAtual);
    await supabase.from('categoria_ordem').update({ categoria: novoNome }).eq('mala', mala).eq('categoria', categoriaAtual);
    setOcupado(false);
    router.refresh();
  }

  async function moverCategoria(mala, categoria, direcao) {
    const ordenadas = categoriasOrdenadas(mala);
    const index = ordenadas.indexOf(categoria);
    const novoIndex = direcao === 'up' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= ordenadas.length) return;

    const vizinha = ordenadas[novoIndex];
    const ordemAtual = ordemMap[`${mala}::${categoria}`] ?? index + 1;
    const ordemVizinha = ordemMap[`${mala}::${vizinha}`] ?? novoIndex + 1;

    setOcupado(true);
    await supabase.from('categoria_ordem').upsert(
      { mala, categoria, ordem: ordemVizinha },
      { onConflict: 'mala,categoria' }
    );
    await supabase.from('categoria_ordem').upsert(
      { mala, categoria: vizinha, ordem: ordemAtual },
      { onConflict: 'mala,categoria' }
    );
    setOcupado(false);
    router.refresh();
  }

  async function escolherCor(mala, categoria, corHex) {
    const chave = `${mala}::${categoria}`;
    setCoresLocais((c) => ({ ...c, [chave]: corHex }));

    const ordemAtual = ordemMap[chave] ?? 1;
    setOcupado(true);
    await supabase.from('categoria_ordem').upsert(
      { mala, categoria, ordem: ordemAtual, cor: corHex },
      { onConflict: 'mala,categoria' }
    );
    setOcupado(false);
    router.refresh();
  }

  async function sortearCor(mala, categoria) {
    const chave = `${mala}::${categoria}`;
    const corHex = corAleatoria();
    setCoresLocais((c) => ({ ...c, [chave]: corHex }));

    const ordemAtual = ordemMap[chave] ?? 1;
    setOcupado(true);
    await supabase.from('categoria_ordem').upsert(
      { mala, categoria, ordem: ordemAtual, cor: corHex },
      { onConflict: 'mala,categoria' }
    );
    setOcupado(false);
    router.refresh();
  }

  async function excluirCategoria(mala, categoria) {
    const qtd = grupos[mala][categoria]?.length || 0;
    const ok = window.confirm(
      `Excluir a categoria "${categoria}"? Isso vai apagar ${qtd} ${qtd === 1 ? 'item' : 'itens'} dela. Essa ação não pode ser desfeita.`
    );
    if (!ok) return;

    setOcupado(true);
    await supabase.from('items').delete().eq('mala', mala).eq('categoria', categoria);
    await supabase.from('categoria_artigos').delete().eq('mala', mala).eq('categoria', categoria);
    await supabase.from('categoria_ordem').delete().eq('mala', mala).eq('categoria', categoria);
    setOcupado(false);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      {['bebe', 'mae'].map((mala) => {
        const categorias = categoriasOrdenadas(mala);

        return (
          <div key={mala}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-plum-dark">{NOME_MALA[mala]}</h2>
              <div className="flex gap-2">
                <button onClick={() => novaCategoria(mala)} className="btn-outline !px-4 !py-2 text-sm">
                  + Nova categoria
                </button>
                <Link href={`/admin/itens/novo?mala=${mala}`} className="btn-primary !px-4 !py-2 text-sm">
                  + Novo item
                </Link>
              </div>
            </div>

            {categorias.length === 0 && (
              <p className="text-ink/60 text-sm mb-4">Nenhuma categoria criada ainda nessa mala.</p>
            )}

            <div className="space-y-2">
              {categorias.map((categoria, i) => {
                const chave = `${mala}::${categoria}`;
                const aberta = categoriasAbertas.has(chave);
                const painelAberto = painelEditAberto.has(chave);
                const itens = grupos[mala][categoria] || [];
                const corHex = coresLocais[chave] ?? resolverCorHex(infoMap[chave]?.cor, i);

                return (
                  <div
                    key={chave}
                    className="card !p-0 overflow-hidden border-l-4"
                    style={{ borderLeftColor: corHex }}
                  >
                    <div className="w-full flex items-center justify-between gap-2 p-4">
                      <button onClick={() => toggle(chave)} className="flex-1 text-left">
                        <span className="font-medium text-plum-dark">{categoria}</span>
                      </button>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => togglePainel(chave, categoria)}
                          title="Editar categoria"
                          aria-label="Editar categoria"
                          className={`text-ink/40 hover:text-plum transition ${painelAberto ? 'text-plum' : ''}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        </button>

                        <button onClick={() => toggle(chave)} className="flex items-center gap-1.5 text-ink/40" aria-label={aberta ? 'Recolher categoria' : 'Expandir categoria'}>
                          <span className="text-xs">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
                          <svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`transition-transform ${aberta ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {painelAberto && (
                      <div className="px-4 pb-4 border-t border-plum/10 pt-4 bg-base/50 space-y-4">
                        <div>
                          <p className="text-xs font-medium text-ink/50 mb-1.5">Posição</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moverCategoria(mala, categoria, 'up')}
                              disabled={ocupado || i === 0}
                              className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-30"
                            >
                              ▲ Mover pra cima
                            </button>
                            <button
                              onClick={() => moverCategoria(mala, categoria, 'down')}
                              disabled={ocupado || i === categorias.length - 1}
                              className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-30"
                            >
                              ▼ Mover pra baixo
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-ink/50 mb-1.5">Nome</p>
                          <div className="flex gap-2">
                            <input
                              value={nomeEditando[chave] ?? categoria}
                              onChange={(e) => setNomeEditando((n) => ({ ...n, [chave]: e.target.value }))}
                              className="input-field !py-1.5 text-sm flex-1"
                            />
                            <button
                              onClick={() => salvarNome(mala, categoria, chave)}
                              disabled={ocupado}
                              className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-50"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-ink/50 mb-1.5">Cor</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={corHex}
                              onChange={(e) => escolherCor(mala, categoria, e.target.value)}
                              className="w-10 h-10 rounded-full border-2 border-plum/20 cursor-pointer overflow-hidden p-0.5 bg-white shadow-sm"
                            />
                            <button
                              onClick={() => sortearCor(mala, categoria)}
                              disabled={ocupado}
                              className="text-xs link-plum disabled:opacity-50"
                            >
                              🎲 Sortear cor aleatória
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-plum/10">
                          <button
                            onClick={() => excluirCategoria(mala, categoria)}
                            disabled={ocupado}
                            className="text-sm text-red-600 underline disabled:opacity-50"
                          >
                            Excluir categoria (e os {itens.length} {itens.length === 1 ? 'item' : 'itens'} dela)
                          </button>
                        </div>
                      </div>
                    )}

                    {aberta && (
                      <div className="px-4 pb-4 border-t border-plum/10 pt-3 space-y-2">
                        <Link
                          href={`/admin/itens/novo?mala=${mala}&categoria=${encodeURIComponent(categoria)}`}
                          className="inline-block text-sm text-plum underline mb-1"
                        >
                          + Adicionar item nessa categoria
                        </Link>
                        {itens.length === 0 && (
                          <p className="text-sm text-ink/50">Essa categoria ainda não tem itens.</p>
                        )}
                        {itens.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-t border-plum/5 first:border-t-0">
                            <p className="font-medium truncate">{item.nome}</p>
                            <div className="flex items-center gap-3 shrink-0">
                              <Link href={`/admin/itens/${item.id}/editar`} className="text-sm link-plum">Editar</Link>
                              <DeleteButton tabela="items" id={item.id} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}