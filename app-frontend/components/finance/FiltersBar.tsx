'use client';

import { useMemo, useState } from 'react';
import { Calendar, RotateCcw, Filter } from 'lucide-react';

type TxType = 'all' | 'in' | 'out';

export interface Filters {
    startDate: string | null;
    endDate: string | null;
    type: TxType;
}

export default function FiltersBar({
                                       onFilterChange,
                                       initial,
                                   }: {
    onFilterChange?: (f: Filters) => void;
    initial?: Partial<Filters>;
}) {
    const [startDate, setStartDate] = useState<string | null>(initial?.startDate ?? null);
    const [endDate, setEndDate] = useState<string | null>(initial?.endDate ?? null);
    const [type, setType] = useState<TxType>(initial?.type ?? 'all');
    const [activePreset, setActivePreset] = useState<null | 1 | 7 | 30>(null);

    const dateError = useMemo(() => {
        if (!startDate || !endDate) return '';
        return startDate > endDate ? 'A data inicial não pode ser maior que a final.' : '';
    }, [startDate, endDate]);

    const apply = () => {
        if (dateError) return;
        onFilterChange?.({ startDate, endDate, type });
    };

    const clear = () => {
        setStartDate(null);
        setEndDate(null);
        setType('all');
        setActivePreset(null);
        onFilterChange?.({ startDate: null, endDate: null, type: 'all' });
    };

    const setPreset = (days: 1 | 7 | 30) => {
        setActivePreset(days);
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        const toISO = (d: Date) => d.toISOString().slice(0, 10);
        setStartDate(toISO(start));
        setEndDate(toISO(end));
    };

    return (
        <div
            className="
        rounded-xl border bg-white p-6 text-slate-900 shadow-sm
        border-slate-200
        dark:bg-[#0b0f14] dark:text-white dark:border-[#1c2533]
      "
        >
            {/* linha superior */}
            <div className="grid gap-x-8 gap-y-4 md:grid-cols-[1.3fr,1fr]">
                {/* PERÍODO */}
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-white/90">
                        Período
                    </label>

                    <div className="flex items-center gap-3">
                        {/* Data inicial */}
                        <div className="relative w-full">
                            <Calendar
                                className="
                  pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                  text-slate-400 dark:text-white/50
                "
                            />
                            <input
                                type="date"
                                value={startDate ?? ''}
                                onChange={(e) => setStartDate(e.target.value || null)}
                                max={endDate ?? undefined}
                                aria-invalid={!!dateError}
                                title={dateError || ''}
                                className="
                  h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none
                  transition-colors
                  border-slate-300 placeholder:text-slate-400
                  focus:border-blue-500 focus:ring-0

                  dark:bg-[#121821] dark:text-white dark:border-[#1f2a36]
                  dark:placeholder:text-white/40 dark:focus:border-blue-500
                "
                            />
                        </div>

                        <span className="text-slate-500 dark:text-white/60">até</span>

                        {/* Data final */}
                        <div className="relative w-full">
                            <Calendar
                                className="
                  pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                  text-slate-400 dark:text-white/50
                "
                            />
                            <input
                                type="date"
                                value={endDate ?? ''}
                                onChange={(e) => setEndDate(e.target.value || null)}
                                min={startDate ?? undefined}
                                aria-invalid={!!dateError}
                                title={dateError || ''}
                                className="
                  h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none
                  transition-colors
                  border-slate-300 placeholder:text-slate-400
                  focus:border-blue-500 focus:ring-0

                  dark:bg-[#121821] dark:text-white dark:border-[#1f2a36]
                  dark:placeholder:text-white/40 dark:focus:border-blue-500
                "
                            />
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {([1, 7, 30] as const).map((d) => (
                            <button
                                key={d}
                                onClick={() => setPreset(d)}
                                className={[
                                    'rounded-full px-4 py-1.5 text-xs font-medium transition-all border',
                                    activePreset === d
                                        ? // ativo
                                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-600/30 dark:text-blue-400 dark:border-blue-600/40'
                                        : // inativo
                                        'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 ' +
                                        'dark:bg-[#121821] dark:text-white/70 dark:border-[#1f2a36] dark:hover:bg-[#19212e]',
                                ].join(' ')}
                            >
                                {d === 1 ? 'Hoje' : `${d} dias`}
                            </button>
                        ))}
                    </div>

                    {dateError && (
                        <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-500">
                            {dateError}
                        </p>
                    )}
                </div>

                {/* TIPO */}
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-semibold text-slate-700 dark:text-white/90">
                        Tipo de transação
                    </label>

                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as TxType)}
                            className="
                h-11 w-full appearance-none rounded-lg border pl-4 pr-10 text-sm outline-none
                bg-white text-slate-900 border-slate-300
                transition-colors focus:border-blue-500

                dark:bg-[#121821] dark:text-white dark:border-[#1f2a36]
                dark:focus:border-blue-500
              "
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="in">Entradas</option>
                            <option value="out">Saídas</option>
                        </select>
                        <Filter
                            className="
                pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4
                text-slate-400 dark:text-white/50
              "
                        />
                    </div>
                </div>
            </div>

            {/* linha inferior */}
            <div
                className="
          mt-6 flex flex-wrap justify-end gap-3 border-t pt-5
          border-slate-200 dark:border-[#1a2230]
        "
            >
                <button
                    onClick={apply}
                    disabled={!!dateError}
                    className="
            h-11 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow
            hover:bg-blue-500 active:scale-[.98]
            disabled:cursor-not-allowed disabled:opacity-60
          "
                >
                    Aplicar filtros
                </button>

                <button
                    onClick={clear}
                    className="
            h-11 rounded-lg border px-6 text-sm font-semibold transition-all
            border-slate-300 text-slate-700 hover:bg-slate-100
            dark:border-[#1f2a36] dark:text-white/70 dark:hover:bg-[#19212e]
            flex items-center gap-2
          "
                >
                    <RotateCcw className="h-4 w-4" />
                    Limpar
                </button>
            </div>
        </div>
    );
}
