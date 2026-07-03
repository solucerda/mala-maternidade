import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/LogoutButton';
import HeartsBackground from '@/components/HeartsBackground';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Minha conta' };

async function progressoDaMala(supabase, userId, mala) {
  const { data: items } = await supabase.from('items').select('id').eq('mala', mala);
  const ids = (items || []).map((i) => i.id);
  if (ids.length === 0) return { total: 0, marcados: 0 };

  const { data: status } = await supabase
    .from('user_item_status')
    .select('item_id, marcado')
    .eq('user_id', userId)
    .in('item_id', ids)
    .eq('marcado', true);

  return { total: ids.length, marcados: (status || []).length };
}

export default async function ContaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('nome, telefone, role')
    .eq('id', user.id)
    .single();

  const bebe = await progressoDaMala(supabase, user.id, 'bebe');
  const mae = await progressoDaMala(supabase, user.id, 'mae');

  return (
    <div className="relative overflow-hidden">
      <HeartsBackground />
      <div className="relative max-w-2xl mx-auto px-4 py-12">
        <h1 className="page-title">Olá, {profile?.nome || 'mamãe'} 👋</h1>
        <p className="text-ink/60 text-sm mt-1">{user.email}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/checklist/bebe" className="card block hover:border-plum/30 transition">
            <p className="font-display text-lg text-plum-dark mb-2 flex items-center gap-2">🍼 Mala do bebê</p>
            <Barra total={bebe.total} marcados={bebe.marcados} />
          </Link>
          <Link href="/checklist/mae" className="card block hover:border-plum/30 transition">
            <p className="font-display text-lg text-plum-dark mb-2 flex items-center gap-2">💜 Mala da mãe</p>
            <Barra total={mae.total} marcados={mae.marcados} />
          </Link>
        </div>

        {profile?.role === 'admin' && (
          <Link href="/admin" className="inline-block mt-8 text-sm link-plum">
            Ir para o painel administrativo
          </Link>
        )}

        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

function Barra({ total, marcados }) {
  const pct = total ? Math.round((marcados / total) * 100) : 0;
  return (
    <div>
      <div className="h-2.5 rounded-full bg-plum/10 overflow-hidden">
        <div className="h-full bg-marigold" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-ink/60 mt-1.5">{marcados} de {total} itens separados</p>
    </div>
  );
}
