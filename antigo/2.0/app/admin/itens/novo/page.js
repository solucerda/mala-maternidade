import ItemForm from '@/components/ItemForm';

export const metadata = { title: 'Novo item — admin' };

export default function NovoItemPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-plum-dark mb-6">Novo item</h1>
      <ItemForm />
    </div>
  );
}
