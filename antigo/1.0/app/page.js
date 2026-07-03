import Link from 'next/link';
import Reveal from '@/components/Reveal';
import LiveDemo from '@/components/LiveDemo';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-light to-base" aria-hidden="true" />
        <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
          {[
            { x: '8%', y: '15%', s: 18, o: 0.5 },
            { x: '85%', y: '10%', s: 24, o: 0.4 },
            { x: '15%', y: '75%', s: 14, o: 0.45 },
            { x: '90%', y: '65%', s: 20, o: 0.35 },
            { x: '50%', y: '5%', s: 12, o: 0.4 },
            { x: '70%', y: '85%', s: 16, o: 0.3 },
            { x: '30%', y: '40%', s: 10, o: 0.3 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x}, ${h.y})`} opacity={h.o}>
              <path
                d="M0,7 L-1.5,5.5 C-3.8,3.4 -5,1.6 -5,-0.4 C-5,-2.1 -3.7,-3.5 -2,-3.5 C-1,-3.5 -0.1,-3 0,-2.4 C0.1,-3 1,-3.5 2,-3.5 C3.7,-3.5 5,-2.1 5,-0.4 C5,1.6 3.8,3.4 1.5,5.5 Z"
                fill="#C97B84"
                transform={`scale(${h.s / 8})`}
              />
            </g>
          ))}
        </svg>

        <div className="relative max-w-2xl mx-auto px-4 pt-20 pb-16 text-center">
          <img
            src="/imagens/logo-hero.png"
            alt="Ilustração de mãe grávida sorrindo, com uma mala rosa e um coelhinho de pelúcia"
            className="w-56 sm:w-64 mx-auto mb-4 animate-float"
          />

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
          <div className="flex justify-center gap-8 sm:gap-12">
            <Link href="/checklist/bebe" className="flex flex-col items-center group">
              <img
                src="/imagens/mala-bebe.png"
                alt="Mala do bebê"
                className="w-32 sm:w-36 group-hover:scale-105 transition-transform"
              />
            </Link>

            <Link href="/checklist/mae" className="flex flex-col items-center group">
              <img
                src="/imagens/mala-mamae.png"
                alt="Mala da mamãe"
                className="w-32 sm:w-36 group-hover:scale-105 transition-transform"
              />
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