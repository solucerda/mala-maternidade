import { createClient } from '@/lib/supabase/server';
import AdminItemsManager from '@/components/AdminItemsManager';

export const metadata = { title: 'Itens do checklist — admin' };

export default async function AdminItensPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('mala')
    .order('categoria')
    .order('ordem');

  const { data: ordem } = await supabase.from('categoria_ordem').select('mala, categoria, ordem');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="page-title mb-6">Itens do checklist</h1>
      <AdminItemsManager itemsIniciais={items || []} ordemIniciais={ordem || []} />
    </div>
  );
}
