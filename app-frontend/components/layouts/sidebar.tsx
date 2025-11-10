'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

/**
 * Sidebar
 */
const Sidebar = () => {
    const { t } = getTranslation();
    const pathname = usePathname();
    const semidark = useSelector((s: IRootState) => s.themeConfig.semidark);

    /** Lê ?mode= da URL para sabermos se estamos em /buy (comprar) ou /buy?mode=sell (vender) */
    const [buyMode, setBuyMode] = useState<'buy' | 'sell'>('buy');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setBuyMode(params.get('mode') === 'sell' ? 'sell' : 'buy');
        }
    }, [pathname]);

    /** ---- Saldo visível/oculto ---- */
    const [balanceHidden, setBalanceHidden] = useState(false);

    /** Calcula ativo de forma inteligente, inclusive com query ?mode=sell */
    const isActive = useMemo(() => {
        return (href: string) => {
            // Rotas de buy
            if (href === '/buy') {
                return pathname === '/buy' && buyMode !== 'sell';
            }
            if (href.startsWith('/buy?mode=sell')) {
                return pathname === '/buy' && buyMode === 'sell';
            }
            // Demais rotas: match exato
            return pathname === href;
        };
    }, [pathname, buyMode]);

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
        const active = isActive(href);
        const className = [
            'group flex items-center justify-between rounded-xl px-3 py-2 transition-colors',
            active
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                : 'text-slate-700 hover:bg-slate-50 dark:text-white/80 dark:hover:bg-white/5',
        ].join(' ');

        // Se for link externo (http...), usa <a target="_blank">; senão, Next <Link>
        const isExternalHref = /^https?:\/\//i.test(href);

        if (isExternalHref) {
            return (
                <a href={href} target="_blank" rel="noreferrer" className={className}>
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
        }

        return (
            <Link href={href} className={className}>
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
            </Link>
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
                        {/* Card: Saldo disponível */}
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
                                {/* Comprar: /buy */}
                                <Item href="/buy" icon={<CreditCard size={16} />}>
                                    Comprar
                                </Item>

                                {/* Vender: mesma página com query ?mode=sell */}
                                <Item href="/buy?mode=sell" icon={<ArrowRightLeft size={16} />}>
                                    Vender
                                </Item>
                            </Section>

                            <Section title="Minha Conta">
                                <Item href="/finance/extract" icon={<Wallet size={16} />}>
                                    Extrato
                                </Item>
                                <Item href="/transfers" icon={<ArrowRightLeft size={16} />}>
                                    Transferências
                                </Item>
                                <Item href="/payments" icon={<CreditCard size={16} />}>
                                    Pagamentos
                                </Item>
                                <Item href="/affiliate" icon={<Wallet size={16} />}>
                                    Extrato Afiliado
                                </Item>
                            </Section>

                            <Section title="Ajuda">
                                <Item href="/support" icon={<Headphones size={16} />} external>
                                    Suporte WhatsApp
                                </Item>
                                <Item href="/config" icon={<Settings size={16} />}>
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
