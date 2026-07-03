'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DeleteButton({ tabela, id }) {
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm('Tem certeza que quer excluir? Essa ação não pode ser desfeita.')) return;
    setCarregando(true);
    await supabase.from(tabela).delete().eq('id', id);
    setCarregando(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={carregando} className="text-sm text-red-600 underline disabled:opacity-50">
      {carregando ? 'Excluindo...' : 'Excluir'}
    </button>
  );
}
