export const metadata = { title: 'Política de privacidade' };

export default function PrivacidadePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 prose prose-sm">
      <h1 className="font-display text-3xl text-plum-dark mb-4">Política de privacidade</h1>
      <p className="text-ink/70 text-sm leading-relaxed">
        Este é um texto-modelo — substitua pelo conteúdo real antes de publicar o site.
        Explique aqui quais dados você coleta no cadastro (nome, email e telefone), para que eles
        são usados (salvar o checklist, contato sobre o serviço, envio de newsletter caso a
        usuária aceite), por quanto tempo ficam armazenados, e como a pessoa pode solicitar a
        exclusão dos seus dados, conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
      </p>
      <p className="text-ink/70 text-sm leading-relaxed mt-4">
        Recomendamos gerar uma política de privacidade completa com um advogado ou uma
        ferramenta especializada antes de publicar o site para o público.
      </p>
    </div>
  );
}
