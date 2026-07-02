'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SiteHeader() {
  const [user, setUser] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-40 bg-base/95 backdrop-blur border-b border-plum/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-plum-dark">
          Mala da Maternidade
        </Link>

        <button
          className="sm:hidden text-plum-dark"
          onClick={() => setMenuAberto((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
          <Link href="/checklist/bebe" className="hover:text-plum">Mala do bebê</Link>
          <Link href="/checklist/mae" className="hover:text-plum">Mala da mãe</Link>
          <Link href="/blog" className="hover:text-plum">Blog</Link>
          {user ? (
            <Link href="/conta" className="px-4 py-2 rounded-full bg-plum text-white hover:bg-plum-dark transition">
              Minha conta
            </Link>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-full bg-plum text-white hover:bg-plum-dark transition">
              Entrar
            </Link>
          )}
        </nav>
      </div>

      {menuAberto && (
        <nav className="sm:hidden flex flex-col gap-1 px-4 pb-4 font-body text-sm">
          <Link href="/checklist/bebe" className="py-2" onClick={() => setMenuAberto(false)}>Mala do bebê</Link>
          <Link href="/checklist/mae" className="py-2" onClick={() => setMenuAberto(false)}>Mala da mãe</Link>
          <Link href="/blog" className="py-2" onClick={() => setMenuAberto(false)}>Blog</Link>
          {user ? (
            <Link href="/conta" className="py-2 font-medium text-plum" onClick={() => setMenuAberto(false)}>Minha conta</Link>
          ) : (
            <Link href="/login" className="py-2 font-medium text-plum" onClick={() => setMenuAberto(false)}>Entrar</Link>
          )}
        </nav>
      )}
    </header>
  );
}
