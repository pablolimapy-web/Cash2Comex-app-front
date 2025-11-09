'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

const WHATS_NUMBER = '5599999999999'; // DDI+DDD+número
const DEFAULT_MSG = 'Olá! Preciso de ajuda com minha conta Cash2Comex.';

export default function SuporteWhatsappPage() {
    const [count, setCount] = useState(3);

    const targetUrl = useMemo(() => {
        const encoded = encodeURIComponent(DEFAULT_MSG);
        const isMobile = /Android|iPhone|iPad|iPod/i.test(
            typeof navigator !== 'undefined' ? navigator.userAgent : ''
        );
        return isMobile
            ? `https://wa.me/${WHATS_NUMBER}?text=${encoded}`
            : `https://web.whatsapp.com/send?phone=${WHATS_NUMBER}&text=${encoded}`;
    }, []);

    useEffect(() => {
        const t = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
        const r = setTimeout(() => {
            window.location.href = targetUrl;
        }, 1400);
        return () => {
            clearInterval(t);
            clearTimeout(r);
        };
    }, [targetUrl]);

    return (
        <main
            className="
        relative min-h-screen overflow-hidden
        bg-gradient-to-b from-[#f7f3ff] to-white
        text-slate-900
        dark:from-[#0b0717] dark:to-[#0b0717] dark:text-white
      "
        >
            {/* Glow roxo */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="h-[520px] w-[520px] rounded-full bg-purple-500/25 blur-3xl dark:bg-purple-700/25" />
            </div>

            {/* Conteúdo central */}
            <section className="relative z-10 mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-6">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-[0_15px_60px_-15px_rgba(0,0,0,0.6)]">
                    {/* LOGO animada */}
                    <div className="mb-6 flex justify-center">
                        <img
                            src="/assets/images/LogoReal.png"
                            alt="Cash2Comex"
                            className="h-40 w-auto animate-pulse opacity-90 transition-all duration-500 hover:opacity-100 hover:scale-105"
                        />
                    </div>

                    {/* Dots */}
                    <div className="mb-4 flex items-center justify-center gap-8">
                        <Dots />
                    </div>

                    <p className="mb-1 text-sm text-slate-700 dark:text-white/80">Conectando ao WhatsApp...</p>
                    <p className="text-xs text-slate-500 dark:text-white/60">
                        você será redirecionado automaticamente {count > 0 ? `em ${count}s` : 'agora'}
                    </p>

                    <a
                        href={targetUrl}
                        className="
              mt-6 inline-flex items-center gap-2 rounded-xl
              bg-purple-600 px-5 py-2 text-sm font-semibold text-white
              hover:bg-purple-500 transition-colors
            "
                    >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Abrir agora
                    </a>
                </div>
            </section>
        </main>
    );
}

/* --- Dots animado --- */
function Dots() {
    return (
        <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-purple-300 [animation-delay:-.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500" />
        </div>
    );
}
