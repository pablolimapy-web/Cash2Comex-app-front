'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { IRootState } from '@/store';
import { toggleSidebar, toggleTheme } from '@/store/themeConfigSlice';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import { Copy, Check, Volume2, Sun, Moon } from 'lucide-react';

/**
 * Header component that represents the application's top navigation bar.
 * It provides various functionalities such as toggling the sidebar, displaying an account number,
 * copying the account number to the clipboard, theme switching, volume control, and navigation to other sections.
 *
 * This component uses hooks like `useDispatch` and `useSelector` to interact with Redux state,
 * and it leverages internal state to manage temporary UI changes (e.g., when copying the account number).
 *
 * @return {JSX.Element} The rendered header component with navigation, account actions, and theme management features.
 */
export default function Header() {
    const dispatch = useDispatch();
    const themeConfig = useSelector((s: IRootState) => s.themeConfig);
    const [copied, setCopied] = useState(false);
    const accountNumber = '7210-0';
    const isDark = themeConfig.theme !== 'light';

    const copyAccount = async () => {
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    return (
        <header
            className="
        sticky top-0 z-40 border-b border-slate-200 bg-white text-slate-900
        dark:border-white/10 dark:bg-[#0B0F12] dark:text-white
      "
            style={{ height: 'var(--header-h)' }}
        >
            <div className="flex h-full items-center justify-between gap-4 px-6">
                {/* toggle sidebar (mobile) */}
                <button
                    type="button"
                    className="
            flex h-8 w-8 items-center justify-center rounded-full
            hover:bg-black/[0.05] dark:hover:bg-white/10 lg:hidden
            transition-colors
          "
                    onClick={() => dispatch(toggleSidebar())}
                    aria-label="Abrir menu"
                >
                    <IconCaretsDown className="rotate-90 opacity-80" />
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-2 group select-none"
                    aria-label="Ir para o início">
                    <img
                        src="/assets/images/LogoReal.png"
                        alt="Cash2Comex"
                        className="h-40 w-auto opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[1.03]"
                    />

                </Link>



                <div className="ml-auto flex items-center gap-3">
                    {/* Conta + copiar */}
                    <div
                        className="
              hidden items-center gap-2 rounded-full border px-3 py-1 text-sm
              border-slate-200 bg-slate-50 text-slate-700
              dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80
              md:flex transition-colors
            "
                    >
                        <span className="text-slate-500 dark:text-white/60">Conta:</span>
                        <strong className="text-slate-800 dark:text-white/90">{accountNumber}</strong>
                        <button
                            onClick={copyAccount}
                            className="
                flex h-6 w-6 items-center justify-center rounded-full border
                border-slate-200 hover:bg-slate-100
                dark:border-white/10 dark:hover:bg-white/10
              "
                            aria-label="Copiar conta"
                            title="Copiar"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>

                    <span className="hidden h-6 w-px bg-slate-200 dark:bg-white/10 md:block" />

                    {/* som */}
                    <button
                        className="
              flex h-8 w-8 items-center justify-center rounded-full border
              border-slate-200 bg-slate-50 hover:bg-slate-100
              dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10
            "
                        aria-label="Som"
                    >
                        <Volume2 size={16} />
                    </button>

                    {/* tema */}
                    <button
                        className="
              flex h-8 w-8 items-center justify-center rounded-full border
              border-slate-200 bg-slate-50 hover:bg-slate-100
              dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10
            "
                        onClick={() => dispatch(toggleTheme(isDark ? 'light' : 'dark'))}
                        aria-label="Alternar tema"
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {/* conectar carteira */}
                    <div
                        className="
              hidden items-center gap-2 rounded-full border px-3 py-1 text-sm
              border-slate-200 bg-slate-50 text-slate-700
              dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80
              md:flex
            "
                    >
                        <span>Conectar Carteira</span>
                        <span
                            className="
                rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide
                bg-slate-100 text-slate-600
                dark:bg-white/10 dark:text-white/70
              "
                        >
              Em breve
            </span>
                    </div>

                    <Link
                        href="/buy"
                        className="
                        inline-flex items-center justify-center
                        rounded-full px-4 py-1.5 text-sm font-medium
                        text-white shadow-sm
                        bg-gradient-to-r from-purple-500 to-indigo-500
                        hover:from-purple-600 hover:to-indigo-600
                        active:scale-[.97]
                        transition-all duration-300
                        dark:from-purple-600 dark:to-indigo-700
                      "
                    >
                        Comprar cripto
                    </Link>

                    {/* avatar */}
                    <div
                        className="
              flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold
              bg-slate-100 text-slate-700
              dark:bg-white/10 dark:text-white
            "
                    >
                        MP
                    </div>
                </div>
            </div>
        </header>
    );
}
