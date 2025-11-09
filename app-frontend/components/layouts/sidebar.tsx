'use client';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import IconCaretsDown from '@/components/icon/icon-carets-down';

// Ícones simples (próximos do visual do print)
import {
    Wallet,
    ArrowRightLeft,
    CreditCard,
    Headphones,
    Settings,
    ExternalLink,
    Eye,
} from 'lucide-react';

const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);

    useEffect(() => {
        setActiveRoute();
    }, [pathname]);

    const setActiveRoute = () => {
        const allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector(
            '.sidebar ul a[href="' + window.location.pathname + '"]'
        );
        selector?.classList.add('active');
    };

    const Item = ({
                      href,
                      icon,
                      children,
                      external,
                  }: {
        href: string;
        icon: React.ReactNode;
        children: React.ReactNode;
        external?: boolean;
    }) => {
        const active = pathname === href;
        const className = [
            'group flex items-center justify-between rounded-xl px-3 py-2',
            active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5',
        ].join(' ');

        return (
            <Link href={href} className={className}>
        <span className="flex items-center gap-2">
          <span className="opacity-90">{icon}</span>
            {children}
        </span>
                {external ? (
                    <ExternalLink size={14} className="text-white/40 group-hover:text-white/60" />
                ) : null}
            </Link>

        );
    };

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="mt-5 first:mt-0">
            <div className="-mx-4 mb-2 px-7 py-2 text-xs font-extrabold uppercase tracking-wide text-white/40">
                {title}
            </div>
            <div className="grid gap-1">{children}</div>
        </div>
    );

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
                    semidark ? 'text-white-dark' : ''
                }`}
            >
                {/* Fundo escuro translúcido, similar ao print */}
                <div className="h-full bg-[#0B0F12] text-white">
                    {/* Topo com logo e ícone de colapsar */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 lg:inline">
                VRISTO
              </span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-white/10 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-6 p-4 py-0 font-semibold">
                            {/* Card: Saldo disponível */}
                            <li>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/70">Saldo disponível</span>
                                        <button
                                            aria-label="mostrar/ocultar"
                                            className="rounded-xl border border-white/10 p-1 text-white/60 hover:bg-white/5"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">R$ 0,00</div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/80" />
                                        Valor indisponível
                                    </div>
                                </div>
                            </li>

                            {/* Seções (iguais à imagem) */}
                            <li>
                                <Section title="Criptomoedas">
                                    <Item href="/buy" icon={<CreditCard size={16} />}>
                                        Comprar
                                    </Item>
                                    <Item href="/buy?mode=sell" icon={<ArrowRightLeft size={16} />}>
                                        Vender
                                    </Item>
                                </Section>

                                <Section title="Minha Conta">
                                    <Item href="/finance/extrato" icon={<Wallet size={16} />}>
                                        Extrato
                                    </Item>
                                    <Item href="/transferencias" icon={<ArrowRightLeft size={16} />}>
                                        Transferências
                                    </Item>
                                    <Item href="/pagamentos" icon={<CreditCard size={16} />}>
                                        Pagamentos
                                    </Item>
                                    <Item href="/afiliado/extrato" icon={<Wallet size={16} />}>
                                        Extrato Afiliado
                                    </Item>
                                </Section>

                                <Section title="Ajuda">
                                    <Item href="/suporte-whatsapp" icon={<Headphones size={16} />} external>
                                        Suporte WhatsApp
                                    </Item>
                                    <Item href="/configuracoes" icon={<Settings size={16} />}>
                                        Configurações
                                    </Item>
                                </Section>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
