'use client';

import { FileSearch } from 'lucide-react';

export default function TransactionsTable() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#1c2533] dark:bg-[#0d1117]">
            <div className="table-responsive">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left">
                        <th className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 first:rounded-tl-xl last:rounded-tr-xl dark:bg-[#0f1520] dark:text-white/70">
                            Descrição
                        </th>
                        <th className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-[#0f1520] dark:text-white/70">
                            Data
                        </th>
                        <th className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-[#0f1520] dark:text-white/70">
                            Valor
                        </th>
                        <th className="bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-[#0f1520] dark:text-white/70">
                            Tipo de transação
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-[#141b26]">
                    {/* Estado vazio */}
                    <tr className="hover:bg-slate-50/40 dark:hover:bg-[#0f1520]/60">
                        <td colSpan={4} className="px-6 py-10">
                            <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-500 dark:border-[#1c2533] dark:bg-[#0f1520] dark:text-white/60">
                                <FileSearch className="h-5 w-5 opacity-70" />
                                <span className="text-sm">Nenhuma transação foi encontrada</span>
                            </div>
                        </td>
                    </tr>

                    {/*
            Exemplo de linha real (quando houver dados):
            <tr className="transition-colors hover:bg-slate-50/60 dark:hover:bg-[#0f1520]">
              <td className="px-4 py-3 text-slate-700 dark:text-white/90">
                Pix recebido de João Silva
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-white/70">07/11/2025</td>
              <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">+ R$ 150,00</td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-300">
                  Entrada
                </span>
              </td>
            </tr>
            */}
                    </tbody>

                    {/* Rodapé opcional */}
                    <tfoot>
                    <tr>
                        <td
                            colSpan={4}
                            className="rounded-b-xl bg-slate-50/60 px-4 py-3 text-right text-xs text-slate-500 dark:bg-[#0f1520] dark:text-white/50"
                        >
                            Última atualização em tempo real
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
