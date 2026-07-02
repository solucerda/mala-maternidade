'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import HeartsBackground from '@/components/HeartsBackground';

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
    <div className="relative overflow-hidden">
      <HeartsBackground />
      <div className="relative max-w-md mx-auto px-4 py-16">
        <div className="card">
          <h1 className="font-display text-3xl text-plum-dark mb-1">Entrar</h1>
          <p className="text-ink/70 mb-6 text-sm">Acesse sua lista salva.</p>

          <button onClick={handleGoogle} className="btn-outline w-full mb-4">
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 my-4 text-xs text-ink/40">
            <div className="h-px bg-plum/10 flex-1" /> ou <div className="h-px bg-plum/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="senha">Senha</label>
              <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="input-field" />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <button type="submit" disabled={carregando} className="btn-primary w-full disabled:opacity-50">
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm mt-6">
            Não tem conta? <Link href="/cadastro" className="link-plum">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
