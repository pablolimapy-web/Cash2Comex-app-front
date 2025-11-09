'use client';

import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { IRootState } from '@/store';
import { getTranslation } from '@/i18n';
import {
    Wallet,
    ArrowRightLeft,
    CreditCard,
    Headphones,
    Settings,
    ExternalLink,
    Eye,
    EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { t } = getTranslation();
    const pathname = usePathname();
    const semidark = useSelector((s: IRootState) => s.themeConfig.semidark);

    useEffect(() => {
        document
            .querySelectorAll('.sidebar ul a.active')
            .forEach((el) => el.classList.remove('active'));
        document
            .querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
            ?.classList.add('active');
    }, [pathname]);

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
            'group flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
            active
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                : 'text-slate-700 hover:bg-slate-50 dark:text-white/80 dark:hover:bg-white/5',
        ].join(' ');
        return (
            <a href={href} className={className}>
        <span className="flex items-center gap-2">
          <span className="opacity-90">{icon}</span>
            {children}
        </span>
                {external ? (
                    <ExternalLink
                        size={14}
                        className="text-slate-400 group-hover:text-slate-600 dark:text-white/40 dark:group-hover:text-white/60"
                    />
                ) : null}
            </a>
        );
    };

    const Section = ({
                         title,
                         children,
                     }: {
        title: string;
        children: React.ReactNode;
    }) => (
        <div className="mt-5 first:mt-0">
            <div className="-mx-4 mb-2 px-7 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-white/40">
                {title}
            </div>
            <div className="grid gap-1">{children}</div>
        </div>
    );

    /** ---- Saldo visível/oculto ---- */
    const [balanceHidden, setBalanceHidden] = useState(false);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`
          sidebar fixed z-50 w-[260px]
          border-r border-slate-200 bg-white text-slate-900
          dark:border-white/10 dark:bg-[#0B0F12] dark:text-white
          shadow-[5px_0_25px_0_rgba(94,92,154,0.08)] transition-all
        `}
                style={{
                    top: 'var(--header-h)',
                    height: 'calc(100vh - var(--header-h))',
                }}
            >
                <PerfectScrollbar className="h-full pt-3">
                    <ul className="space-y-6 p-4 font-semibold">
                        {/* Card: Saldo disponível (fade animado) */}
                        <li>
                            <div
                                className="
                  rounded-2xl border border-slate-200 bg-white p-4 shadow-sm
                  transition-colors duration-300
                  dark:border-white/10 dark:bg-white/[0.035]
                "
                            >
                                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-white/80">
                    Saldo disponível
                  </span>
                                    <button
                                        aria-label="Mostrar/ocultar saldo"
                                        onClick={() => setBalanceHidden((v) => !v)}
                                        className="
                      rounded-xl border border-slate-200 p-1.5
                      text-slate-600 hover:bg-slate-100 transition-colors
                      dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10
                    "
                                    >
                                        {balanceHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>

                                {/* Fade suave entre os estados */}
                                <div className="mt-2 h-8 flex items-center justify-start overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {balanceHidden ? (
                                            <motion.span
                                                key="hidden"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="select-none text-2xl font-semibold text-slate-900 dark:text-white"
                                            >
                                                ••••••
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="visible"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="text-2xl font-semibold text-slate-900 dark:text-white"
                                            >
                                                R$ 0,00
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-white/60">
                  <span
                      className={`inline-block h-2 w-2 rounded-full transition-colors ${
                          balanceHidden ? 'bg-gray-400/80' : 'bg-emerald-500/90'
                      }`}
                  />
                                    {balanceHidden ? 'Saldo oculto' : 'Valor indisponível'}
                                </div>
                            </div>
                        </li>

                        {/* Seções */}
                        <li>
                            <Section title="Criptomoedas">
                                <Item href="/comprar" icon={<CreditCard size={16} />} external>
                                    Comprar
                                </Item>
                                <Item href="/vender" icon={<ArrowRightLeft size={16} />} external>
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
                                <Item href="/suporte" icon={<Headphones size={16} />} external>
                                    Suporte WhatsApp
                                </Item>
                                <Item href="/configuracoes" icon={<Settings size={16} />}>
                                    Configurações
                                </Item>
                            </Section>
                        </li>
                    </ul>
                </PerfectScrollbar>
            </nav>
        </div>
    );
};

export default Sidebar;
