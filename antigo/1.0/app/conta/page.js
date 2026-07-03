import Link from 'next/link';
import Reveal from '@/components/Reveal';
import LiveDemo from '@/components/LiveDemo';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-60px] w-72 h-72 rounded-full bg-sage/20 blur-3xl" aria-hidden="true" />
        <div className="absolute top-[40px] right-[-60px] w-72 h-72 rounded-full bg-marigold/20 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-2xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="w-16 h-16 mx-auto mb-6 animate-float text-plum-dark" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="12" width="24" height="16" rx="3" fill="currentColor" />
              <rect x="12" y="7" width="8" height="6" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <rect x="4" y="18" width="24" height="3" fill="#E8A33D" />
            </svg>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-plum-dark leading-tight">
            Sua mala, sem pressa<br />e sem esquecer nada.
          </h1>
          <p className="mt-4 text-ink/70">
            Um checklist simples pra organizar a chegada do bebê, no seu tempo.
          </p>

          <a href="#como-funciona" className="inline-flex flex-col items-center gap-1 mt-12 text-plum/60 text-xs">
            Veja como funciona
            <svg className="animate-bounce-soft" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </section>

      <section id="como-funciona" className="max-w-lg mx-auto px-4 py-16 text-center">
        <Reveal>
          <LiveDemo />
        </Reveal>

        <Reveal className="mt-10">
          <p className="text-ink/70 mb-6">
            Marque o que já foi separado, entenda a importância de cada item, e volte quando quiser
            — tudo salvo na sua conta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checklist/bebe"
              className="px-6 py-3 rounded-full bg-plum text-white font-medium hover:bg-plum-dark transition"
            >
              Mala do bebê
            </Link>
            <Link
              href="/checklist/mae"
              className="px-6 py-3 rounded-full bg-rose text-white font-medium hover:opacity-90 transition"
            >
              Mala da mãe
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Dá pra navegar sem cadastro. Criar conta é só se quiser salvar seu progresso.
          </p>
        </Reveal>
      </section>
    </div>
  );
}