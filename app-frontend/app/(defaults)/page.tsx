'use client';

import SummaryCards from '@/components/finance/SummaryCards';
import FiltersBar from '@/components/finance/FiltersBar';
import TransactionsTable from '@/components/finance/TransactionsTable';

export default function Page() {
    return (
        <section className="flex-1 min-h-full w-full px-6 pb-8 space-y-6">
            {/* Cabeçalho */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white transition-colors duration-300">
                    Extrato da conta
                </h1>

                <p className="
                  mt-1 text-sm text-slate-600 dark:text-white/70
                  transition-colors duration-300">
                    Acompanhe todos os detalhes da sua conta 4Pay.
                </p>
            </div>


            <SummaryCards />
            <FiltersBar
                onFilterChange={(f) => {
                    // f.startDate / f.endDate são 'yyyy-mm-dd' ou null
                    // f.type é 'all' | 'in' | 'out'
                    // faça o fetch ou filtre seu estado aqui
                    // ex: fetch(`/api/tx?from=${f.startDate}&to=${f.endDate}&type=${f.type}`)
                }}
            />


            <div>
                <label className="mb-2 block text-sm text-white/60">Descrição</label>
                <TransactionsTable />
            </div>
        </section>
    );
}
