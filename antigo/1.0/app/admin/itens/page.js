import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/DeleteButton';

export const metadata = { title: 'Itens do checklist — admin' };

export default async function AdminItensPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('mala')
    .order('categoria')
    .order('ordem');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-plum-dark">Itens do checklist</h1>
        <Link href="/admin/itens/novo" className="px-4 py-2 rounded-full bg-plum text-white text-sm font-medium hover:bg-plum-dark transition">
          + Novo item
        </Link>
      </div>

      <div className="space-y-2">
        {(items || []).map((item) => (
          <div key={item.id} className="rounded-card bg-white border border-plum/10 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-ink/40">
                {item.mala === 'bebe' ? 'Mala do bebê' : 'Mala da mãe'} · {item.categoria}
              </p>
              <p className="font-medium truncate">{item.nome}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/admin/itens/${item.id}/editar`} className="text-sm text-plum underline">Editar</Link>
              <DeleteButton tabela="items" id={item.id} />
            </div>
          </div>
        ))}

        {(!items || items.length === 0) && (
          <p className="text-ink/60 text-sm">Nenhum item cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
