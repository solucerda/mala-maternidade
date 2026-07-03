'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function iconeCategoria(categoria) {
  const c = categoria.toLowerCase();
  if (c.includes('higiene')) return '🧴';
  if (c.includes('troca')) return '👕';
  if (c.includes('enxoval')) return '🧺';
  if (c.includes('pós-parto') || c.includes('pos-parto')) return '🩹';
  if (c.includes('amamenta')) return '🤱';
  if (c.includes('beleza') || c.includes('conforto')) return '💄';
  if (c.includes('roupas')) return '👗';
  return '🎒';
}

export default function ChecklistList({ items, categorias, statusInicial, logada }) {
  const [status, setStatus] = useState(statusInicial);
  const supabase = createClient();

  const total = items.length;
  const marcados = useMemo(
    () => items.filter((i) => status[i.id]).length,
    [items, status]
  );
  const progresso = total ? Math.round((marcados / total) * 100) : 0;

  async function toggle(itemId) {
    if (!logada) return;
    const novoValor = !status[itemId];
    setStatus((s) => ({ ...s, [itemId]: novoValor }));

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_item_status')
      .upsert(
        { user_id: user.id, item_id: itemId, marcado: novoValor, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,item_id' }
      );
  }

  return (
    <div className="mt-6">
      {logada && (
        <div className="mb-6 sticky top-[57px] z-30 bg-base/95 backdrop-blur py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-plum-dark">Progresso</span>
            <span className="text-ink/60">{marcados} de {total} itens</span>
          </div>
          <div className="h-3 rounded-full bg-plum/10 overflow-hidden">
            <div
              className="h-full bg-marigold transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      )}

      {categorias.map((categoria) => (
        <div key={categoria} className="mb-8">
          <h2 className="font-display text-xl text-plum-dark mb-3 flex items-center gap-2">
            <span aria-hidden="true">{iconeCategoria(categoria)}</span> {categoria}
          </h2>
          <ul className="space-y-2">
            {items
              .filter((i) => i.categoria === categoria)
              .map((item) => (
                <li
                  key={item.id}
                  className="rounded-card bg-white border border-plum/10 p-4 flex gap-3 items-start"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    disabled={!logada}
                    aria-label={status[item.id] ? 'Desmarcar item' : 'Marcar item como separado'}
                    className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition
                      ${status[item.id] ? 'bg-sage border-sage' : 'border-plum/30'}
                      ${!logada ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {status[item.id] && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1">
                    <p className={`font-medium ${status[item.id] ? 'line-through text-ink/40' : 'text-ink'}`}>
                      {item.nome}
                    </p>
                   {item.descricao && (
                      <p className="text-sm text-ink/60 mt-1.5 bg-marigold/10 rounded-lg px-3 py-2 border-l-2 border-marigold">
                        💡 {item.descricao}
                      </p>
                    )}
                    {item.link_afiliado && (
                      <a
                        href={item.link_afiliado}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-block mt-2 text-sm text-plum underline"
                      >
                        Ver opções pra comprar
                      </a>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-ink/60 text-sm">
          Nenhum item cadastrado ainda nessa lista. Adicione itens pelo{' '}
          <Link href="/admin/itens" className="underline">painel administrativo</Link>.
        </p>
      )}
    </div>
  );
}
