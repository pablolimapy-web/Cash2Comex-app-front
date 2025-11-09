import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';

// 🎯 Aqui definimos o metadata (inclui título, descrição e ícone da aba)
export const metadata: Metadata = {
    title: {
        template: 'Cash2Comex',
        default: 'Cash2Comex - Comércio de Criptos',
    },
    description: 'Plataforma Cash2Comex — soluções em criptomoedas, câmbio e pagamentos digitais.',
    icons: {
        icon: '/assets/images/FaviconReal.png',      // 👈 repare no "/" inicial
        shortcut: '/assets/images/FaviconReal.png',
        apple: '/assets/images/FaviconReal.png',
    },
};

// Fonte global
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
        <body className={nunito.variable}>
        <ProviderComponent>{children}</ProviderComponent>
        </body>
        </html>
    );
}
