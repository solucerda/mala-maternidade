'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SiteHeader() {
  const [user, setUser] = useState(null);
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
            className="px-4 py-2 rounded-full bg-plum text-white text-sm font-medium hover:bg-plum-dark transition"
          >
            Minha conta
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-plum text-white text-sm font-medium hover:bg-plum-dark transition"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}