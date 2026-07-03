'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro('Email ou senha incorretos.');
      return;
    }
    router.push(searchParams.get('redirect') || '/conta');
    router.refresh();
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-plum-dark mb-1">Entrar</h1>
      <p className="text-ink/70 mb-6 text-sm">Acesse sua lista salva.</p>

      <button
        onClick={handleGoogle}
        className="w-full mb-4 py-3 rounded-full border border-plum/20 font-medium hover:bg-plum/5 transition"
      >
        Continuar com Google
      </button>

      <div className="flex items-center gap-3 my-4 text-xs text-ink/40">
        <div className="h-px bg-plum/10 flex-1" /> ou <div className="h-px bg-plum/10 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-plum/20 focus:border-plum outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="senha">Senha</label>
          <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-plum/20 focus:border-plum outline-none" />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button type="submit" disabled={carregando}
          className="w-full py-3 rounded-full bg-plum text-white font-medium hover:bg-plum-dark transition disabled:opacity-50">
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm mt-6">
        Não tem conta? <Link href="/cadastro" className="text-plum underline">Criar conta</Link>
      </p>
    </div>
  );
}
