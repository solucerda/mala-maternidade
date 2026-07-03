'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ItemForm({ itemInicial }) {
  const [form, setForm] = useState({
    mala: itemInicial?.mala || 'bebe',
    categoria: itemInicial?.categoria || '',
    nome: itemInicial?.nome || '',
    descricao: itemInicial?.descricao || '',
    link_afiliado: itemInicial?.link_afiliado || '',
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

    const query = itemInicial
      ? supabase.from('items').update(form).eq('id', itemInicial.id)
      : supabase.from('items').insert(form);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mala</label>
        <select value={form.mala} onChange={(e) => update('mala', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20">
          <option value="bebe">Mala do bebê</option>
          <option value="mae">Mala da mãe</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        <input required value={form.categoria} onChange={(e) => update('categoria', e.target.value)}
          placeholder="Ex: 1ª troca, Higiene, Amamentação"
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nome do item</label>
        <input required value={form.nome} onChange={(e) => update('nome', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição / importância</label>
        <textarea value={form.descricao} onChange={(e) => update('descricao', e.target.value)} rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Link de afiliado</label>
        <input type="url" value={form.link_afiliado} onChange={(e) => update('link_afiliado', e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL da imagem (opcional)</label>
        <input type="url" value={form.imagem} onChange={(e) => update('imagem', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ordem de exibição</label>
        <input type="number" value={form.ordem} onChange={(e) => update('ordem', Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-lg border border-plum/20" />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button type="submit" disabled={carregando}
        className="px-6 py-3 rounded-full bg-plum text-white font-medium hover:bg-plum-dark transition disabled:opacity-50">
        {carregando ? 'Salvando...' : 'Salvar item'}
      </button>
    </form>
  );
}
