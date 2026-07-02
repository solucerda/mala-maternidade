import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-marigold/20 text-marigold-dark text-xs font-medium mb-4">
          Reta final da gravidez
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-plum-dark leading-tight">
          A mala da maternidade,<br className="hidden sm:block" /> sem esquecer nada.
        </h1>
        <p className="mt-4 text-ink/70 max-w-xl mx-auto">
          Duas listas prontas — mala do bebê e mala da mãe — com a importância de cada item
          explicada, pra você separar com calma e sem culpa do que decidir deixar de fora.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
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
