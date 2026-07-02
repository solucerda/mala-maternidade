'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITENS = [
  { href: '/checklist/bebe', label: 'Bebê', icon: '🍼' },
  { href: '/checklist/mae', label: 'Mãe', icon: '💜' },
  { href: '/blog', label: 'Blog', icon: '📖' },
  { href: '/conta', label: 'Conta', icon: '👤' },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-plum/10 flex justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      aria-label="Navegação principal"
    >
      {ITENS.map((item) => {
        const ativo = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-xs px-3 py-1 rounded-lg ${
              ativo ? 'text-plum font-medium' : 'text-ink/50'
            }`}
          >
            <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}