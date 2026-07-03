'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const SELOS = {
  essencial: { cor: 'bg-sage', label: 'Essencial' },
  recomendado: { cor: 'bg-marigold', label: 'Recomendado' },
  depende: { cor: 'bg-[#6B8CAE]', label: 'Depende da maternidade' },
  opcional: { cor: 'bg-gray-400', label: 'Opcional' },
};

function temConteudoExpansivel(item) {
  return !!(
    item.para_que_serve ||
    item.quantidade ||
    item.como_escolher ||
    item.dica_extra ||
    item.vale_a_pena ||
    item.perguntas_frequentes ||
    item.link_afiliado ||
    item.link_amazon ||
    item.link_mercado_livre ||
    item.link_shopee
  );
}

const CORES_CATEGORIA = [
  { borda: 'border-sage', fundo: 'bg-sage/5' },
  { borda: 'border-rose', fundo: 'bg-rose/5' },
  { borda: 'border-marigold', fundo: 'bg-marigold/5' },
  { borda: 'border-plum', fundo: 'bg-plum/5' },
];

export default function ChecklistList({ items, categorias, statusInicial, logada, artigosPorCategoria = {} }) {
  const [status, setStatus] = useState(statusInicial);
  const [abertos, setAbertos] = useState(new Set());
  const [categoriasAbertas, setCategoriasAbertas] = useState(() => new Set());
  const [artigosAbertos, setArtigosAbertos] = useState(() => new Set());
  const supabase = createClient();

  const total = items.length;
  const marcados = useMemo(() => items.filter((i) => status[i.id]).length, [items, status]);
  const progresso = total ? Math.round((marcados / total) * 100) : 0;

  function toggleCategoria(categoria) {
    setCategoriasAbertas((prev) => {
      const novo = new Set(prev);
      if (novo.has(categoria)) novo.delete(categoria);
      else novo.add(categoria);
      return novo;
    });
  }

  function toggleArtigos(categoria) {
    setArtigosAbertos((prev) => {
      const novo = new Set(prev);
      if (novo.has(categoria)) novo.delete(categoria);
      else novo.add(categoria);
      return novo;
    });
  }

  function toggleAberto(id) {
    setAbertos((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

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
            <div className="h-full bg-marigold transition-all duration-500" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      )}

      {categorias.map((categoria, index) => {
        const itensCategoria = items.filter((i) => i.categoria === categoria);
        const categoriaAberta = categoriasAbertas.has(categoria);
        const marcadosCategoria = itensCategoria.filter((i) => status[i.id]).length;
        const artigos = artigosPorCategoria[categoria] || [];
        const menuArtigosAberto = artigosAbertos.has(categoria);
        const cor = CORES_CATEGORIA[index % CORES_CATEGORIA.length];

        return (
          <div key={categoria} className={`mb-4 rounded-card border-l-4 ${cor.borda} ${cor.fundo} p-4`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <button
                onClick={() => toggleCategoria(categoria)}
                className="flex-1 text-left"
              >
                <h2 className="font-display text-xl text-plum-dark">{categoria}</h2>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {artigos.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArtigos(categoria);
                      }}
                      title="Artigos relacionados"
                      aria-label="Ver artigos relacionados"
                      className="w-9 h-9 rounded-full bg-rose flex items-center justify-center hover:opacity-90 active:scale-95 transition shadow-sm"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </button>

                    {menuArtigosAberto && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-11 z-20 w-64 bg-white rounded-card border border-plum/10 shadow-lg p-2"
                      >
                        <p className="text-[11px] uppercase tracking-wide text-ink/40 px-2 pt-1 pb-1.5">
                          Artigos sobre esse assunto
                        </p>
                        {artigos.map((a) => (
                          <a
                            key={a.slug}
                            href={`/blog/${a.slug}`}
                            className="block px-2 py-2 rounded-lg text-sm text-plum-dark hover:bg-rose-light/60 transition"
                          >
                            {a.titulo}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => toggleCategoria(categoria)}
                  className="flex items-center gap-1.5 text-ink/40"
                  aria-label={categoriaAberta ? 'Recolher categoria' : 'Expandir categoria'}
                >
                  <span className="text-xs">
                    {logada ? `${marcadosCategoria}/${itensCategoria.length}` : itensCategoria.length}
                  </span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`transition-transform ${categoriaAberta ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>

            {categoriaAberta && (
              <ul className="space-y-2 mt-3">
                {itensCategoria.map((item) => {
                const selo = item.selo && SELOS[item.selo];
                const aberto = abertos.has(item.id);
                const expansivel = temConteudoExpansivel(item);

                return (
                  <li key={item.id} className="card !p-0 overflow-hidden">
                    <div className="flex gap-3 items-start p-4">
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

                      <button
                        onClick={() => expansivel && toggleAberto(item.id)}
                        className={`flex-1 text-left ${expansivel ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-medium ${status[item.id] ? 'line-through text-ink/40' : 'text-ink'}`}>
                            {item.nome}
                          </p>
                          {selo && (
                            <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full text-white ${selo.cor}`}>
                              {selo.label}
                            </span>
                          )}
                        </div>
                        {item.descricao && (
                          <p className="text-sm text-ink/60 mt-1.5 bg-marigold/10 rounded-lg px-3 py-2 border-l-2 border-marigold">
                            💡 {item.descricao}
                          </p>
                        )}
                      </button>

                      {expansivel && (
                        <button
                          onClick={() => toggleAberto(item.id)}
                          aria-label={aberto ? 'Recolher detalhes' : 'Ver mais detalhes'}
                          className="shrink-0 text-plum/50 mt-1"
                        >
                          <svg
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`transition-transform ${aberto ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {aberto && expansivel && (
                      <div className="px-4 pb-4 border-t border-plum/10 pt-4 space-y-4 text-sm bg-base/40">
                        {item.para_que_serve && (
                          <Secao titulo="Para que serve?" texto={item.para_que_serve} />
                        )}
                        {item.quantidade && (
                          <Secao titulo="✔ Quantidade recomendada" texto={item.quantidade} />
                        )}
                        {item.como_escolher && (
                          <div>
                            <p className="font-medium text-plum-dark mb-1.5">Como escolher</p>
                            <ul className="space-y-1">
                              {item.como_escolher.split('\n').filter(Boolean).map((linha, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-ink/70">
                                  <span className="text-sage mt-0.5">✔</span> {linha}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.dica_extra && (
                          <div className="bg-marigold/10 rounded-lg px-3 py-2 border-l-2 border-marigold">
                            <p className="font-medium text-plum-dark mb-0.5">💡 Dica</p>
                            <p className="text-ink/70">{item.dica_extra}</p>
                          </div>
                        )}
                        {item.vale_a_pena && (
                          <Secao titulo="Vale a pena?" texto={item.vale_a_pena} />
                        )}
                        {item.perguntas_frequentes && (
                          <div>
                            <p className="font-medium text-plum-dark mb-1.5">Perguntas frequentes</p>
                            <p className="text-ink/70 whitespace-pre-line">{item.perguntas_frequentes}</p>
                          </div>
                        )}
                        {(item.link_afiliado || item.link_amazon || item.link_mercado_livre || item.link_shopee) && (
                          <div>
                            <p className="font-medium text-plum-dark mb-2">🛒 Produtos recomendados</p>
                            <div className="flex flex-wrap gap-2">
                              {item.link_afiliado && <BotaoLoja href={item.link_afiliado} label="Ver opções" />}
                              {item.link_amazon && <BotaoLoja href={item.link_amazon} label="Amazon" />}
                              {item.link_mercado_livre && <BotaoLoja href={item.link_mercado_livre} label="Mercado Livre" />}
                              {item.link_shopee && <BotaoLoja href={item.link_shopee} label="Shopee" />}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
                })}
              </ul>
            )}
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="text-ink/60 text-sm">
          Nenhum item cadastrado ainda nessa lista. Adicione itens pelo{' '}
          <Link href="/admin/itens" className="underline">painel administrativo</Link>.
        </p>
      )}
    </div>
  );
}

function Secao({ titulo, texto }) {
  return (
    <div>
      <p className="font-medium text-plum-dark mb-1">{titulo}</p>
      <p className="text-ink/70">{texto}</p>
    </div>
  );
}

function BotaoLoja({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="text-xs px-3 py-1.5 rounded-full border border-plum/20 hover:bg-plum/5 transition"
    >
      {label}
    </a>
  );
}
