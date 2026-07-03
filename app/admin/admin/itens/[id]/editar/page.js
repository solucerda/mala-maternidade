import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ItemForm from '@/components/ItemForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Editar item — admin' };

export default async function EditarItemPage({ params }) {
  const supabase = createClient();
  const { data: item } = await supabase.from('items').select('*').eq('id', params.id).single();

  if (!item) notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-6">Editar item</h1>
      <ItemForm itemInicial={item} />
    </div>
  );
}
