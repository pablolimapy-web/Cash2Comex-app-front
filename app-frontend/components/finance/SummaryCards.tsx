'use client';

export default function SummaryCards() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Entradas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101621]">
                <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-white/80">Entradas</span>
          </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">R$ 0,00</span>
                </div>
            </div>

            {/* Saídas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101621]">
                <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="font-semibold text-slate-700 dark:text-white/80">Saídas</span>
          </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">R$ 0,00</span>
                </div>
            </div>

            {/* Pagamentos agendados */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101621]">
                <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700 dark:text-white/80">Pagamentos agendados</span>
          </span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">R$ 0,00</span>
                </div>
            </div>
        </div>
    );
}
