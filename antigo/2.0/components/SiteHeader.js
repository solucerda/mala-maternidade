'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SiteHeader() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nome')
          .eq('id', data.user.id)
          .single();
        setNome(profile?.nome || data.user.user_metadata?.full_name || data.user.user_metadata?.name || '');
      }
    }
    carregar();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setNome('');
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const primeiroNome = nome.trim().split(' ')[0];

  return (
    <header className="sticky top-0 z-40 bg-base/95 backdrop-blur border-b border-plum/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-plum-dark">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect x="4" y="12" width="24" height="16" rx="3" fill="currentColor" />
            <rect x="12" y="7" width="8" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <rect x="4" y="18" width="24" height="3" fill="#E8A33D" />
          </svg>
          Mala da Maternidade
        </Link>

        <nav className="hidden sm:flex items-center gap-6 font-body text-sm">
          <Link href="/checklist/bebe" className="hover:text-plum">Mala do bebê</Link>
          <Link href="/checklist/mae" className="hover:text-plum">Mala da mãe</Link>
          <Link href="/blog" className="hover:text-plum">Blog</Link>
        </nav>

        {user ? (
          <Link
            href="/conta"
            className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-rose-light hover:bg-rose/25 transition"
          >
            <span className="w-7 h-7 rounded-full bg-rose flex items-center justify-center shrink-0" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-3.9 3.6-6 8-6s8 2.1 8 6v1H4v-1z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-plum-dark">
              {primeiroNome || 'Minha conta'}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-rose-light hover:bg-rose/25 transition"
          >
            <span className="w-7 h-7 rounded-full bg-rose flex items-center justify-center shrink-0" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-3.9 3.6-6 8-6s8 2.1 8 6v1H4v-1z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-plum-dark">Entrar</span>
          </Link>
        )}
      </div>
    </header>
  );
}