'use client';

import SummaryCards from '@/components/finance/SummaryCards';
import FiltersBar from '@/components/finance/FiltersBar';
import TransactionsTable from '@/components/finance/TransactionsTable';
import { useEffect, useState } from 'react';

export default function Page() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="flex-1 min-h-full w-full px-6 pb-8 space-y-6">
            {/* Cabeçalho */}
            <div className={mounted ? 'animate-slide-up' : 'opacity-0 translate-y-3'}>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Extrato da conta
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-white/70">
                    Acompanhe todos os detalhes da sua conta Cash2Comex.
                </p>
            </div>

            <div className={mounted ? 'animate-pop-in' : 'opacity-0 scale-95'}>
                <SummaryCards />
            </div>

            <div className={mounted ? 'animate-pop-in' : 'opacity-0 scale-95'}>
                <FiltersBar
                    onFilterChange={(f) => {
                        // faça seu fetch/filtragem aqui
                    }}
                />
            </div>

            <div className={mounted ? 'animate-fade-in' : 'opacity-0'}>
                <TransactionsTable />
            </div>
        </section>
    );
}
