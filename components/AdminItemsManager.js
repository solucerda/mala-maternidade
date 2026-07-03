'use client';

import { useState } from 'react';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

const NOME_MALA = { bebe: 'Mala do bebê', mae: 'Mala da mãe' };

export default function AdminItemsManager({ itemsIniciais }) {
  const [categoriasAbertas, setCategoriasAbertas] = useState(new Set());

  function toggle(chave) {
    setCategoriasAbertas((prev) => {
      const novo = new Set(prev);
      if (novo.has(chave)) novo.delete(chave);
      else novo.add(chave);
      return novo;
    });
  }

  function novaCategoria(mala) {
    const nome = window.prompt(
      `Nome da nova categoria em "${NOME_MALA[mala]}" (ex: Higiene, 1ª troca):`
    );
    if (!nome || !nome.trim()) return;
    window.location.href = `/admin/itens/novo?mala=${mala}&categoria=${encodeURIComponent(nome.trim())}`;
  }

  // Agrupa: { bebe: { 'Higiene': [items...], ... }, mae: {...} }
  const grupos = { bebe: {}, mae: {} };
  itemsIniciais.forEach((item) => {
    if (!grupos[item.mala][item.categoria]) grupos[item.mala][item.categoria] = [];
    grupos[item.mala][item.categoria].push(item);
  });

  return (
    <div className="space-y-10">
      {['bebe', 'mae'].map((mala) => (
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

          {Object.keys(grupos[mala]).length === 0 && (
            <p className="text-ink/60 text-sm mb-4">Nenhuma categoria criada ainda nessa mala.</p>
          )}

          <div className="space-y-2">
            {Object.entries(grupos[mala]).map(([categoria, itens]) => {
              const chave = `${mala}::${categoria}`;
              const aberta = categoriasAbertas.has(chave);

              return (
                <div key={chave} className="card !p-0 overflow-hidden">
                  <button
                    onClick={() => toggle(chave)}
                    className="w-full flex items-center justify-between gap-2 p-4 text-left"
                  >
                    <span className="font-medium text-plum-dark">{categoria}</span>
                    <span className="flex items-center gap-2 text-ink/40 shrink-0">
                      <span className="text-xs">{itens.length} {itens.length === 1 ? 'item' : 'itens'}</span>
                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`transition-transform ${aberta ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {aberta && (
                    <div className="px-4 pb-4 border-t border-plum/10 pt-3 space-y-2">
                      <Link
                        href={`/admin/itens/novo?mala=${mala}&categoria=${encodeURIComponent(categoria)}`}
                        className="inline-block text-sm text-plum underline mb-1"
                      >
                        + Adicionar item nessa categoria
                      </Link>
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
      ))}
    </div>
  );
}
