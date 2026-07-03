'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import HeartsBackground from '@/components/HeartsBackground';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, telefone } },
    });

    setCarregando(false);

    if (error) {
      setErro(error.message);
      return;
    }
    setSucesso(true);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (sucesso) {
    return (
      <div className="relative overflow-hidden">
        <HeartsBackground />
        <div className="relative max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="page-title mb-3">Quase lá!</h1>
          <p className="text-ink/70">
            Enviamos um link de confirmação pro seu email. Confirme pra poder entrar e salvar seu checklist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <HeartsBackground />
      <div className="relative max-w-md mx-auto px-4 py-16">
        <div className="card">
          <h1 className="font-display text-3xl text-plum-dark mb-1">Criar conta</h1>
          <p className="text-ink/70 mb-6 text-sm">Pra salvar sua lista e marcar o que já foi separado.</p>

          <button onClick={handleGoogle} className="btn-outline w-full mb-4">
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 my-4 text-xs text-ink/40">
            <div className="h-px bg-plum/10 flex-1" /> ou <div className="h-px bg-plum/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="nome">Nome</label>
              <input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="telefone">Celular</label>
              <input id="telefone" type="tel" required placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="senha">Senha</label>
              <input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} className="input-field" />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <button type="submit" disabled={carregando} className="btn-primary w-full disabled:opacity-50">
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-xs text-ink/50 mt-4">
            Ao se cadastrar, você concorda com nossa{' '}
            <Link href="/privacidade" className="underline">política de privacidade</Link>.
          </p>

          <p className="text-sm mt-6">
            Já tem conta? <Link href="/login" className="link-plum">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
