import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-plum/10 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 font-body text-sm">
        <div>
          <p className="font-display text-lg text-plum-dark mb-2">Mala da Maternidade</p>
          <p className="text-ink/70">Checklists pensados pra tirar o peso de organizar a chegada do bebê.</p>
        </div>
        <div>
          <p className="font-medium text-plum-dark mb-2">Navegar</p>
          <ul className="space-y-1">
            <li><Link href="/checklist/bebe" className="hover:text-plum">Mala do bebê</Link></li>
            <li><Link href="/checklist/mae" className="hover:text-plum">Mala da mãe</Link></li>
            <li><Link href="/blog" className="hover:text-plum">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-plum-dark mb-2">Legal</p>
          <ul className="space-y-1">
            <li><Link href="/privacidade" className="hover:text-plum">Política de privacidade</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-xs text-ink/50 pb-6">
        © {new Date().getFullYear()} Mala da Maternidade. Este site pode conter links de afiliados.
      </p>
    </footer>
  );
}
