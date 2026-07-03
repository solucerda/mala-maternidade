'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SELOS = [
  { value: '', label: 'Sem selo' },
  { value: 'essencial', label: '🟢 Essencial' },
  { value: 'recomendado', label: '🟡 Recomendado' },
  { value: 'depende', label: '🔵 Depende da maternidade' },
  { value: 'opcional', label: '⚪ Opcional' },
];

export default function ItemForm({ itemInicial, malaPadrao, categoriaPadrao }) {
  const [form, setForm] = useState({
    mala: itemInicial?.mala || malaPadrao || 'bebe',
    categoria: itemInicial?.categoria || categoriaPadrao || '',
    nome: itemInicial?.nome || '',
    descricao: itemInicial?.descricao || '',
    selo: itemInicial?.selo || '',
    para_que_serve: itemInicial?.para_que_serve || '',
    quantidade: itemInicial?.quantidade || '',
    como_escolher: itemInicial?.como_escolher || '',
    dica_extra: itemInicial?.dica_extra || '',
    vale_a_pena: itemInicial?.vale_a_pena || '',
    perguntas_frequentes: itemInicial?.perguntas_frequentes || '',
    link_afiliado: itemInicial?.link_afiliado || '',
    link_amazon: itemInicial?.link_amazon || '',
    link_mercado_livre: itemInicial?.link_mercado_livre || '',
    link_shopee: itemInicial?.link_shopee || '',
    imagem: itemInicial?.imagem || '',
    ordem: itemInicial?.ordem ?? 0,
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const supabase = createClient();

  function update(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    const payload = { ...form, selo: form.selo || null };
    const query = itemInicial
      ? supabase.from('items').update(payload).eq('id', itemInicial.id)
      : supabase.from('items').insert(payload);

    const { error } = await query;
    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    router.push('/admin/itens');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Básico */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Informações básicas</p>

        <div>
          <label className="block text-sm font-medium mb-1">Mala</label>
          <select value={form.mala} onChange={(e) => update('mala', e.target.value)} className="input-field">
            <option value="bebe">Mala do bebê</option>
            <option value="mae">Mala da mãe</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <input required value={form.categoria} onChange={(e) => update('categoria', e.target.value)}
            placeholder="Ex: 1ª troca, Higiene, Amamentação" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do item</label>
          <input required value={form.nome} onChange={(e) => update('nome', e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Selo</label>
          <select value={form.selo} onChange={(e) => update('selo', e.target.value)} className="input-field">
            {SELOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nota rápida (aparece sempre visível, sem precisar expandir)</label>
          <textarea value={form.descricao} onChange={(e) => update('descricao', e.target.value)} rows={2} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ordem de exibição</label>
          <input type="number" value={form.ordem} onChange={(e) => update('ordem', Number(e.target.value))} className="input-field" />
        </div>
      </div>

      {/* Conteúdo expansível */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
          Conteúdo do card expansível (deixe em branco o que não quiser usar)
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Para que serve?</label>
          <textarea value={form.para_que_serve} onChange={(e) => update('para_que_serve', e.target.value)} rows={2} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantidade recomendada</label>
          <input value={form.quantidade} onChange={(e) => update('quantidade', e.target.value)} placeholder="Ex: 1 unidade" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Como escolher (uma dica por linha)</label>
          <textarea value={form.como_escolher} onChange={(e) => update('como_escolher', e.target.value)} rows={4}
            placeholder={'100% algodão\nCom capuz\nTecido macio'} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">💡 Dica</label>
          <textarea value={form.dica_extra} onChange={(e) => update('dica_extra', e.target.value)} rows={2} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vale a pena?</label>
          <textarea value={form.vale_a_pena} onChange={(e) => update('vale_a_pena', e.target.value)} rows={3} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Perguntas frequentes (pergunta numa linha, resposta na de baixo, linha em branco entre pares)</label>
          <textarea value={form.perguntas_frequentes} onChange={(e) => update('perguntas_frequentes', e.target.value)} rows={5}
            placeholder={'Posso usar lenço umedecido?\nSim, mas...\n\nPrecisa esterilizar?\nNão é necessário...'} className="input-field" />
        </div>
      </div>

      {/* Produtos */}
      <div className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Produtos recomendados</p>

        <div>
          <label className="block text-sm font-medium mb-1">Link genérico / melhor custo-benefício</label>
          <input type="url" value={form.link_afiliado} onChange={(e) => update('link_afiliado', e.target.value)} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link Amazon</label>
          <input type="url" value={form.link_amazon} onChange={(e) => update('link_amazon', e.target.value)} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link Mercado Livre</label>
          <input type="url" value={form.link_mercado_livre} onChange={(e) => update('link_mercado_livre', e.target.value)} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link Shopee</label>
          <input type="url" value={form.link_shopee} onChange={(e) => update('link_shopee', e.target.value)} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Imagem (URL completa ou caminho tipo /imagens/nome.jpg)</label>
          <input value={form.imagem} onChange={(e) => update('imagem', e.target.value)} placeholder="/imagens/nome.jpg" className="input-field" />
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button type="submit" disabled={carregando} className="btn-primary disabled:opacity-50">
        {carregando ? 'Salvando...' : 'Salvar item'}
      </button>
    </form>
  );
}
