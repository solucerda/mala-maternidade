import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobileTabBar from '@/components/MobileTabBar';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Mala da Maternidade — Checklist do bebê e da mamãe',
    template: '%s | Mala da Maternidade',
  },
  description:
    'Monte sua mala da maternidade com um checklist completo, salve seu progresso e entenda a importância de cada item.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-body min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
