import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-marigold/20 text-marigold-dark text-xs font-medium mb-4">
            Reta final da gravidez
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-plum-dark leading-tight">
            A mala da maternidade,<br className="hidden lg:block" /> sem esquecer nada.
          </h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto lg:mx-0">
            Duas listas prontas — mala do bebê e mala da mãe — com a importância de cada item
            explicada, pra você separar com calma e sem culpa do que decidir deixar de fora.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/checklist/bebe"
              className="px-6 py-3 rounded-full bg-plum text-white font-medium hover:bg-plum-dark transition"
            >
              Ver mala do bebê
            </Link>
            <Link
              href="/checklist/mae"
              className="px-6 py-3 rounded-full bg-rose text-white font-medium hover:opacity-90 transition"
            >
              Ver mala da mãe
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Você pode navegar pelas listas sem cadastro. Crie uma conta grátis quando quiser salvar seu progresso.
          </p>
        </div>

        <div className="hidden lg:flex justify-center" aria-hidden="true">
          <HeroMockup />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10 grid gap-6 sm:grid-cols-3">
        {[
          {
            titulo: 'Liste com clareza',
            texto: 'Itens organizados por categoria, do jeito que você vai usar na hora de arrumar a mala.',
          },
          {
            titulo: 'Entenda o porquê',
            texto: 'Cada item explica sua importância, sem regras rígidas — você decide o que faz sentido pra você.',
          },
          {
            titulo: 'Salve seu progresso',
            texto: 'Crie uma conta gratuita e marque o que já foi separado, de qualquer dispositivo.',
          },
        ].map((c) => (
          <div key={c.titulo} className="rounded-card bg-white p-6 border border-plum/10">
            <p className="font-display text-lg text-plum-dark mb-2">{c.titulo}</p>
            <p className="text-sm text-ink/70">{c.texto}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function HeroMockup() {
  const itens = [
    { nome: 'Fralda RN', marcado: true },
    { nome: 'Manta para o berço', marcado: true },
    { nome: 'Conjunto body + mijão', marcado: false },
    { nome: 'Toalhão de banho', marcado: false },
  ];

  return (
    <div className="relative w-72">
      <div className="absolute -top-4 -left-4 w-full h-full rounded-card bg-sage/25 rotate-[-4deg]" />
      <div className="relative rounded-card bg-white border border-plum/10 shadow-xl p-5 rotate-[2deg]">
        <p className="font-display text-plum-dark text-lg mb-1">Mala do bebê</p>
        <div className="h-2 rounded-full bg-plum/10 overflow-hidden mb-4">
          <div className="h-full bg-marigold" style={{ width: '50%' }} />
        </div>
        <ul className="space-y-2.5">
          {itens.map((item) => (
            <li key={item.nome} className="flex items-center gap-2.5 text-sm">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  item.marcado ? 'bg-sage border-sage' : 'border-plum/30'
                }`}
              >
                {item.marcado && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className={item.marcado ? 'line-through text-ink/40' : 'text-ink'}>{item.nome}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}